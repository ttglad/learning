let scoreTabId = 0, scoreWindowId = 0, chooseLogin = 0, weekAskDoes = 0, paperAskDoes = 0;
let windowWidth = 360 + Math.floor(Math.random() * 120);
let windowHeight = 360 + Math.floor(Math.random() * 120);
let chromeVersion = (/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [0, 0])[1];
let firefoxVersion = (/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [0, 0])[1];

function startXuexi(timeout) {

    let newTime = 120000 + Math.floor(Math.random() * 30 * 1000);
    let type;
    let url;

    setTimeout(function () {

        logMessage(new Date().toLocaleString() + ': xuexi begin, timeOut is: ' + timeout + ', newTime is: ' + newTime);

        var requestData = XX.getPoints();
        // 获取数据
        if (typeof (requestData) != "undefined" && requestData != null) {
            // 判断是否登录
            if (requestData.hasOwnProperty("code") && parseInt(requestData.code) === 200) {
                pointData = requestData.data;

                // 浏览器扩展图标
                chrome.browserAction.setBadgeText({"text": pointData.totalScore.toString()});

                // 获取请求类型
                type = getTypeByPoint(pointData.taskProgress);

                if (typeof (type) != "undefined" && type != null) {
                    url = XX.getUrls(type);
                    logMessage(new Date().toLocaleString() + ': type is: ' + type + ', url is: ' + url);
                    if (typeof (url) != "undefined" && url != null) {
                        if (url && scoreTabId && scoreWindowId) {

                            chrome.windows.get(scoreWindowId, {"populate": true}, function (window) {
                                if (typeof window !== "undefined") {
                                    chrome.tabs.sendMessage(window.tabs[window.tabs.length - 1].id, {
                                        "method": "redirect",
                                        "data": url
                                    });
                                    startXuexi(newTime);
                                }
                            });

                        }
                    } else {
                        notice(chrome.i18n.getMessage("extChannelApi"), chrome.i18n.getMessage("extUpdate"));
                    }
                } else {
                    // 学习完成
                    closeWindow();

                    notice(chrome.i18n.getMessage("extFinish"));
                }
            } else {
                // 跳转登录页面
                chrome.tabs.update(scoreTabId, {"active": true, "url": getLoginUrl()});
            }
        } else {
            // 获取积分差异
            notice(chrome.i18n.getMessage("extScoreApi"), chrome.i18n.getMessage("extUpdate"));
        }
    }, timeout);
}

// 获取类型
// 1阅读文章，2试听学习，4专项答题，5每周答题，6每日答题，9登录，1002文章时长，1003视听学习时长
function getTypeByPoint(score) {
    let type;

    for (let key in score) {
        if (!score.hasOwnProperty(key)) {
            continue;
        }

        if (score[key].taskCode.indexOf("1") != -1 || score[key].taskCode.indexOf("1002") != -1) {
            if (score[key].currentScore < score[key].dayMaxScore) {
                type = "article";
                break;
            }
        }
        if (score[key].taskCode.indexOf("2") != -1) {
            if (score[key].currentScore < score[key].dayMaxScore) {
                type = "video";
                break;
            }
        }
        if (score[key].taskCode.indexOf("1003") != -1) {
            if (score[key].currentScore < score[key].dayMaxScore) {
                type = "video";
                break;
            }
        }
        if (Settings.getObject("paperAnswer") && score[key].taskCode.indexOf("4") != -1) {
            if (paperAskDoes == 0 && score[key].currentScore <= 0) {
                type = "paperAsk";
                break;
            }
        }
        if (Settings.getObject("weekAnswer") && score[key].taskCode.indexOf("5") != -1) {
            if (weekAskDoes == 0 && score[key].currentScore <= 0) {
                type = "weekAsk";
                break;
            }
        }
        if (Settings.getObject("dayAnswer") && score[key].taskCode.indexOf("6") != -1) {
            if (score[key].currentScore < score[key].dayMaxScore) {
                type = "dayAsk";
                break;
            }
        }
    }

    return type;
}

// 打印日志
function logMessage(message) {
    if (Settings.getValue("env", "idc").toLowerCase() != "idc") {
        console.log(message);
    }
}

//通知
function notice(title, message = "") {
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

//创建窗口
function createWindow(url, callback) {
    chrome.windows.create({
        "url": url,
        "type": "popup",
        "top": 0,
        "left": 0,
        "width": windowWidth,
        "height": windowHeight
    }, function (window) {
        if (firefoxVersion) {
            chrome.windows.update(window.id, {
                "top": 0,
                "left": 0,
            });
        }
        chrome.tabs.update(window.tabs[window.tabs.length - 1].id, {"muted": true});
        if (typeof callback === "function") {
            callback(window);
        }
    })
}

//关闭窗口
function closeWindow(windowId) {
    if (windowId) {
        chrome.windows.get(windowId, function (window) {
            if (window) {
                chrome.windows.remove(windowId);
            }
        });
    } else {
        if (scoreWindowId) {
            chrome.windows.remove(scoreWindowId);
        }
    }
}

//获取登录链接
function getLoginUrl() {
    return XX.urlMap.loginUrl + "?ref=" + XX.urlMap.points;
}

// 扩展点击事件
function browserActionClick() {
    if (scoreTabId) {
        // 学习中
        notice(chrome.i18n.getMessage("extWorking"), chrome.i18n.getMessage("extLearning"));

        // 设置焦点
        chrome.windows.update(scoreWindowId, {"focused": true, "state": "fullscreen"});
    } else {
        // 开始学习
        notice(chrome.i18n.getMessage("extWorking"), chrome.i18n.getMessage("extWarning"));

        weekAskDoes = 0;
        paperAskDoes = 0;
        chooseLogin = 0;
        createWindow(XX.urlMap.points, function (window) {
            scoreWindowId = window.id;
            scoreTabId = window.tabs[window.tabs.length - 1].id;
        });
    }
}

//扩展按钮点击事件
chrome.browserAction.onClicked.addListener(function (tab) {
    if (chromeVersion < 45 && firefoxVersion < 48) {
        notice(chrome.i18n.getMessage("extVersion"));
    } else {
        browserActionClick();
    }
});

//标签页移除事件
chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
    if (tabId === scoreTabId) {
        scoreTabId = 0;
    }
});

//窗口移除事件
chrome.windows.onRemoved.addListener(function (windowId) {
    if (windowId === scoreWindowId) {
        scoreWindowId = 0;
        chrome.browserAction.setBadgeText({"text": ""});
    }
});


//通信事件
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    switch (request.method) {
        case "checkTab":
            if (sender.tab.windowId === scoreWindowId || sender.tab.id === scoreTabId) {
                sendResponse({
                    "runtime": 1
                });
            }
            break;
        case "startRun":
            if (scoreWindowId) {
                startXuexi(1000 + Math.floor(Math.random() * 1000));
            }
            break;
        case "useUrl":
            let usedUrls = Settings.getObject("usedUrls");
            if (usedUrls.indexOf(sender.tab.url) === -1) {
                usedUrls.push(sender.tab.url);
                Settings.setObject("usedUrls", usedUrls);
            }
            break;
        case "chooseLogin":
            chooseLogin = 1;
            sendResponse({
                "chooseLogin": chooseLogin
            });
            break;
        case "checkLogin":
            if (sender.tab.id === scoreTabId) {
                if (!chooseLogin) {
                    chrome.tabs.update(scoreTabId, {"url": getLoginUrl()});
                }
            }
            break;
        case "weekAskDoes":
            weekAskDoes = 1;
            sendResponse({
                "weekAskDoes": weekAskDoes
            });
            break;
        case "paperAskDoes":
            paperAskDoes = 1;
            sendResponse({
                "paperAskDoes": paperAskDoes
            });
            break;
        case "askComplete":
            // closeWindow();
            break;
    }
});