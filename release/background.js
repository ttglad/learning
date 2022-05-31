// 初始化数据
const StudyConfig = {
    "index": "https://www.xuexi.cn",
    "points": "https://pc.xuexi.cn/points/my-points.html",
    "scoreApi": "https://pc-proxy-api.xuexi.cn/api/score/days/listScoreProgress?sence=score&deviceType=2",
    "channelApi": "https://www.xuexi.cn/lgdata/",
    "loginUrl": "https://pc.xuexi.cn/points/login.html",
    "dayAskUrl": "https://pc.xuexi.cn/points/exam-practice.html",
    "weekAskUrl": "https://pc.xuexi.cn/points/exam-weekly-list.html",
    "paperAskUrl": "https://pc.xuexi.cn/points/exam-paper-list.html",
    "articleUrl": [
        "1jpuhp6fn73",  // 重要活动
        "19vhj0omh73",  // 重要会议
        "132gdqo7l73",  // 重要讲话
        "35il6fpn0ohq", // 学习重点
        "1ap1igfgdn2",  // 学习时评
        "slu9169f72",   // 中宣部发布
        "tuaihmuun2",   // 新文发布厅
        "1oo5atvs172",  // 文化广场
        "1eppcq11fne",  // 科技思想研究
        "152ijthp37e",  // 科技前沿
        "1jscb6pu1n2",  // 重要新闻
        "1ajhkle8l72",  // 综合新闻
    ],
    "videoUrl": [
        "2qfjjjrprmdh", // 国防军事新文
        "525pi8vcj24p", // 红色书信
        "1novbsbi47k",  // 重要活动视频专辑
        "1742g60067k",  // 学习新视界
        "1koo357ronk",  // 学习专题报道
        "1f8iooppm7l",  // 文艺广场
        "eta8vnluqmd",  // 军事科技
        "16421k8267l",  // 强军V视
        "41gt3rsjd6l8", // 绿色发展
    ],
};

// 学习开始
function startRun() {
    chrome.storage.local.get(["studySubjectConfig", "paperAskDoes", "weekAskDoes", "studyWindowId", "studyTabId"], function (result) {
        logMessage("startRun begin, studyWindowId is: " + result.studyWindowId);
        if (result.studyWindowId && result.studyTabId) {
            // 获取积分数据
            fetch(StudyConfig.scoreApi)
                .then((response) => response.json())
                .then(function (requestData) {
                    logMessage(requestData);
                    if (requestData.hasOwnProperty("code") && parseInt(requestData.code) === 200) {

                        pointData = requestData.data;

                        // 浏览器扩展图标
                        chrome.action.setBadgeText({ "text": pointData.totalScore.toString() });

                        // 获取请求类型
                        let type;
                        type = getTypeByPoint(pointData.taskProgress, result.studySubjectConfig, result.paperAskDoes, result.weekAskDoes);
                        logMessage("type is: " + type);
                        if (typeof (type) != "undefined" && type != null) {
                            (async () => {
                                const url = await getUrlByType(type);
                                if (typeof (url) != "undefined" && url != null) {
                                    chrome.tabs.sendMessage(result.studyTabId, {
                                        "type": "redirect",
                                        "url": url
                                    });
                                } else {
                                    // 定时重新执行
                                    setTimeout(startRun, Math.floor(10000 + Math.random() * 30 * 1000));
                                    // 获取页面失败
                                    noticeMessage(chrome.i18n.getMessage("extChannelApi"), chrome.i18n.getMessage("extUpdate"));
                                }
                            })();
                        } else {
                            setTimeout(stopStudy, Math.floor(5000 + Math.random() * 1000));
                        }
                    } else {
                        // 跳转登录页面
                        chrome.tabs.update(studyTabId, { "active": true, "url": StudyConfig.loginUrl + "?ref=" + StudyConfig.points });
                    }
                })
                .catch(error => function (error) {
                    logMessage(error);
                    // 定时重新执行
                    setTimeout(startRun, Math.floor(10000 + Math.random() * 30 * 1000));
                });
        }
    });

    return true;
}

// 获取url
async function getUrlByType(type) {
    let url;

    if (type == "paper") {
        url = StudyConfig.paperAskUrl;
    } else if (type == "week") {
        url = StudyConfig.weekAskUrl;
    } else if (type == "day") {
        url = StudyConfig.dayAskUrl;
    } else {
        let key;
        if (type == "article") {
            key = ArrayRandom(StudyConfig.articleUrl);
        } else {
            key = ArrayRandom(StudyConfig.videoUrl);
        }
        try {
            const response = await fetch(StudyConfig.channelApi + key + ".json?_st=" + Math.floor(Date.now() / 6e4));
            const urlData = await response.json();

            logMessage(urlData);

            let urlList = [];
            let urlTemp;
            let publishTime;
            for (key in urlData) {
                if (!urlData.hasOwnProperty(key)) {
                    continue;
                }
                if (urlData[key].hasOwnProperty("url")) {
                    urlTemp = urlData[key].url;

                    // 判断发布时间是否是365天之内，如果没有，判断url规则
                    if (urlData[key].hasOwnProperty("publishTime")) {
                        publishTime = new Date(urlData[key].publishTime);
                        var lastYear = new Date(new Date() - 365 * 86400000);
                        if (publishTime < lastYear) {
                            continue;
                        }
                    } else {
                        if (urlTemp.indexOf("lgpage/detail/index") === -1) {
                            continue;
                        }
                    }

                    if (urlList.indexOf(urlTemp) === -1) {
                        urlList.push(urlTemp);
                    }
                }
            }
            if (urlList.length) {
                url = ArrayRandom(urlList);
            }

        } catch (error) {
            logMessage("fetch getUrlByType error.")
            logMessage(error);
        }
    }

    return url;
}

// 1阅读文章，2试听学习，4专项答题，5每周答题，6每日答题，9登录，1002文章时长，1003视听学习时长
function getTypeByPoint(score, configs, paperAskDoes, weekAskDoes) {
    let type;
    let config = configs.sort(function (a, b) {
        return a.sort - b.sort;
    });

    let task = new Array();
    task['article'] = false;
    task['video'] = false;
    task['paper'] = false;
    task['week'] = false;
    task['day'] = false;


    for (let key in score) {
        if (!score.hasOwnProperty(key)) {
            continue;
        }
        if (task['article'] == false && (score[key].taskCode.indexOf("1") != -1 || score[key].taskCode.indexOf("1002") != -1)) {
            if (score[key].currentScore < score[key].dayMaxScore) {
                task['article'] = true;
            }
        }
        if (task['video'] == false && score[key].taskCode.indexOf("2") != -1) {
            if (score[key].currentScore < score[key].dayMaxScore) {
                task['video'] = true;
            }
        }
        if (task['video'] == false && score[key].taskCode.indexOf("1003") != -1) {
            if (score[key].currentScore < score[key].dayMaxScore) {
                task['video'] = true;
            }
        }
        if (task['paper'] == false && score[key].taskCode.indexOf("4") != -1) {
            if (paperAskDoes == 0 && score[key].currentScore <= 0) {
                task['paper'] = true;
            }
        }
        if (task['week'] == false && score[key].taskCode.indexOf("5") != -1) {
            if (weekAskDoes == 0 && score[key].currentScore <= 0) {
                task['week'] = true;
            }
        }
        if (task['day'] == false && score[key].taskCode.indexOf("6") != -1) {
            if (score[key].currentScore < score[key].dayMaxScore) {
                task['day'] = true;
            }
        }
    }

    for (let i = 0; i < config.length; i++) {
        if (config[i].flag == true && task[config[i].type] == true) {
            type = config[i].type;
            break;
        }
    }
    return type;
}

// 开始学习
function startStudy() {
    // 获取数据，判断执行
    chrome.storage.local.get(["studyWindowId"], function (result) {
        logMessage("startStudy begin, studyWindowId is: " + result.studyWindowId);
        if (!result.studyWindowId) {
            chrome.windows.create({
                "url": StudyConfig.points,
                "type": "popup",
                // "state": "fullscreen"
                "top": 0,
                "left": 0,
                "width": 350,
                "height": 350
            }, function (window) {
                chrome.storage.local.set({
                    "studyWindowId": window.id,
                    "studyTabId": window.tabs[window.tabs.length - 1].id,
                    "weekAskDoes": 0,
                    "paperAskDoes": 0
                }, function () {
                    // 静音处理
                    chrome.tabs.update(window.tabs[window.tabs.length - 1].id, { "muted": true });
                    // 开始学习
                    noticeMessage(chrome.i18n.getMessage("extWorking"), chrome.i18n.getMessage("extWarning"));
                });
            });
        } else {
            // 学习中
            noticeMessage(chrome.i18n.getMessage("extWorking"), chrome.i18n.getMessage("extLearning"));

            // 设置焦点
            chrome.windows.update(result.studyWindowId, { "focused": true });
        }
    });
    return true;
}

// 停止学习，需要关闭
function stopStudy() {
    // 获取数据，判断执行
    chrome.storage.local.get(["studyWindowId"], function (result) {
        logMessage("stopStudy begin, studyWindowId is: " + result.studyWindowId);
        if (result.studyWindowId) {
            // 关闭窗口
            chrome.windows.remove(result.studyWindowId, function () {
                noticeMessage(chrome.i18n.getMessage("extFinish"));
                logMessage("stopStudy success.");
            });
            // 重置参数
            chrome.storage.local.remove(["studyWindowId", "studyTabId"]);
            chrome.action.setBadgeText({ text: "" });
        }
    });
    return true;
}

// 通知消息
function noticeMessage(title, message = "") {
    chrome.notifications.create({
        "type": "basic",
        "iconUrl": "img/icon/icon_128x128.png",
        "title": title,
        "message": message
    }, function (notificationId) {
        setTimeout(function () {
            chrome.notifications.clear(notificationId);
        }, 5000);
    });
}

// 打印日志
function logMessage(message) {
    chrome.storage.local.get(["env"], function (result) {
        if (result.env.toLowerCase() != "idc") {
            if (typeof (message) == "object") {
                console.log(message);
            } else {
                console.log(new Date().toLocaleString() + ": " + message);
            }
        }
    });
}

// 数据随机排序
function ArrayShuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 数据随机取一条
function ArrayRandom(array) {
    var index = Math.floor((Math.random() * array.length));
    return array[index];
}

// storage监听事件
// chrome.storage.onChanged.addListener((changes, area) => {
    // logMessage("storage changed, changes.");
    // logMessage(changes);
    // logMessage("storage changed, area: " + area);
// });


// tab移除监听事件
chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
    logMessage("chrome tab remove begin");
    // 获取数据，判断执行
    chrome.storage.local.get(["studyTabId"], function (result) {
        if (result.studyTabId && tabId == result.studyTabId) {
            chrome.storage.local.remove(["studyWindowId", "studyTabId"]);
            chrome.action.setBadgeText({ text: "" });
            logMessage("chrome tab remove success.");
        }
    });
    return true;
});

// 窗口移除监听事件
chrome.windows.onRemoved.addListener(function (windowId) {
    logMessage("chrome windows remove begin.");
    chrome.storage.local.get(["studyWindowId"], function (result) {
        if (result.studyWindowId && result.studyWindowId == windowId) {
            chrome.storage.local.remove(["studyWindowId", "studyTabId"]);
            chrome.action.setBadgeText({ text: "" });
            logMessage("chrome windows remove success.");
        }
    });
    return true;
});

// 后台监听事件消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    let requestType = message.type;
    logMessage("message type is: " + message.type);

    switch (requestType) {

        // 检测扩展是否运行
        case "checkRunning":
            chrome.storage.local.get(["studyWindowId"], function (result) {
                let runtime = false;
                if (result.studyWindowId) {
                    runtime = true;
                }
                sendResponse({ "runtime": runtime });
            });
            break;

        // 检测是否是扩展开启状态
        case "checkAuth":
            sendResponse({ "runtime": true });
            break;

        // 开始学习
        case "startStudy":
            startStudy();
            sendResponse({ "complete": 1 });
            break;

        // 结束学习
        case "stopStudy":
            stopStudy();
            sendResponse({ "complete": 1 });
            break;

        // 开始运行
        case "startRun":
            startRun();
            sendResponse({ "complete": 1 });
            break;

        // 每周答题
        case "weekAskDoes":
            chrome.storage.local.set({ "weekAskDoes": 1 });
            startRun();
            sendResponse({ "complete": 0 });
            break;

        // 专项答题
        case "paperAskDoes":
            chrome.storage.local.set({ "paperAskDoes": 1 });
            startRun();
            sendResponse({ "complete": 0 });
            break;

        // 学习完成
        case "studyComplete":
            startRun();
            sendResponse({ "complete": 0 });
            break;

        // 回答错误
        case "answerError":
            noticeMessage(chrome.i18n.getMessage("extName"), chrome.i18n.getMessage("extAnswerError"))
            sendResponse({ "complete": 0 });
            break;
    }
    return true;
});

// 插件安装监听事件
chrome.runtime.onInstalled.addListener(() => {

    chrome.storage.local.clear();

    let studySubjectConfig = [
        { "type": "week", "sort": 1, "title": "每周答题", "time": 0, "flag": false, "subject": "current" },
        { "type": "paper", "sort": 2, "title": "专项答题", "time": 0, "flag": true, "subject": "history" },
        { "type": "article", "sort": 3, "title": "文章学习", "time": 60, "flag": true, "subject": "" },
        { "type": "video", "sort": 4, "title": "视频学习", "time": 60, "flag": true, "subject": "" },
        { "type": "day", "sort": 5, "title": "每日答题", "time": 0, "flag": true, "subject": "" }
    ];

    // 设置初始数据
    chrome.storage.local.set({
        "studySubjectConfig": studySubjectConfig,
        "env": "idc"
    }, function () {
        logMessage("chrome extension is install.");
    });
});