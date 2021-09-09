let scoreTabId = 0, runningTabId = 0, scoreWindowId = 0, runningWindowId = 0, channelUrls = {}, userId = 0,
    usedUrls = {}, chooseLogin = 0;
let windowWidth = 360 + Math.floor(Math.random() * 120);
let windowHeight = 360 + Math.floor(Math.random() * 120);
let chromeVersion = (/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [0, 0])[1];
let firefoxVersion = (/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [0, 0])[1];
let isMobile = !!(/Mobile/.exec(navigator.userAgent));
let urlMap = {
    "index": "https://www.xuexi.cn",
    "points": "https://pc.xuexi.cn/points/my-points.html",
    "scoreApi": "https://pc-api.xuexi.cn/open/api/score/today/queryrate",
    "channelApi": "https://www.xuexi.cn/lgdata/",
    "dayAskUrl": [
        "https://pc.xuexi.cn/points/exam-practice.html",
        "https://pc.xuexi.cn/points/exam-practice.html",
        "https://pc.xuexi.cn/points/exam-practice.html",
        "https://pc.xuexi.cn/points/exam-practice.html",
        "https://pc.xuexi.cn/points/exam-practice.html",
    ],
    "weekAskUrl": [
        "https://pc.xuexi.cn/points/exam-weekly-list.html",
    ],
    "paperAskUrl": [
        "https://pc.xuexi.cn/points/exam-paper-list.html",
    ],
};
let channel = {
    'article': [
        "152mdtl3qn1|https://www.xuexi.cn/71a472c6203e03e49df7768d4d01ba31/b78fdcf1d588904b1965faf807264e6f.html",
        "vdppiu92n1|https://www.xuexi.cn/3960624581d7231cef96ba3ca43ec77c/d0fd85813f78b23f5e5399baa4304972.html",
        "1jscb6pu1n2|https://www.xuexi.cn/98d5ae483720f701144e4dabf99a4a34/5957f69bffab66811b99940516ec8784.html",
        "1ap1igfgdn2|https://www.xuexi.cn/d05cad69216e688d304bb91ef3aac4c6/9a3668c13f6e303932b5e0e100fc248b.html",
        "1ajhkle8l72|https://www.xuexi.cn/7097477a9643eacffe4cc101e4906fdb/9a3668c13f6e303932b5e0e100fc248b.html",
        "slu9169f72|https://www.xuexi.cn/105c2fa2843fa9e6d17440e172115c92/9a3668c13f6e303932b5e0e100fc248b.html",
        "17aeesljm72|https://www.xuexi.cn/03c8b56d5bce4b3619a9d6c2dfb180ef/9a3668c13f6e303932b5e0e100fc248b.html",
        "tuaihmuun2|https://www.xuexi.cn/bab787a637b47d3e51166f6a0daeafdb/9a3668c13f6e303932b5e0e100fc248b.html",
        "u1ght1omn2|https://www.xuexi.cn/d184e7597cc0da16f5d9f182907f1200/9a3668c13f6e303932b5e0e100fc248b.html",
        "1lo8n2gv8n2|https://www.xuexi.cn/531564a05f3981160bf5c4c2b70fe1ce/65d8bbc44cc6812cec5ef2df79cb91cf.html",
        "1oo5atvs172|https://www.xuexi.cn/00f20f4ab7d63a1c259fff55be963558/9a3668c13f6e303932b5e0e100fc248b.html",
        "1gohlpfidnc|https://www.xuexi.cn/4954c7f51c37ef08e9fdf58434a8c1e2/5afa2289c8a14feb189920231dadc643.html",
        "1eppcq11fne|https://www.xuexi.cn/0db3aecacaed782aaab2da53498360ad/5957f69bffab66811b99940516ec8784.html",
        "152ijthp37e|https://www.xuexi.cn/f64099d849c46d8b64b25e3313e1b172/5957f69bffab66811b99940516ec8784.html",
        "1cieuomejnn|https://www.xuexi.cn/0053f57ca16ece330b5ec5b567effa10/5957f69bffab66811b99940516ec8784.html",
        "1lje05c9une|https://www.xuexi.cn/6ed7728b41f51a160e1560e988d70276/5957f69bffab66811b99940516ec8784.html",
        "1drofao4h7e|https://www.xuexi.cn/07ad59ece3409638975ecf44a67dba0e/5957f69bffab66811b99940516ec8784.html",
        "1aa6otcmsne|https://www.xuexi.cn/5984cbfad3406999bae6844604122bf4/3130ba968c09230dc802101c66761e93.html",
        "1h94aj7cc7e|https://www.xuexi.cn/607eb6a12164c2323e19ba2d1a0b2b7c/867ef8949a23097bcde57732799cb4b6.html",
        "1ooaa665snf|https://www.xuexi.cn/00fb9c21e0a728930d42eddba912b3f6/5957f69bffab66811b99940516ec8784.html",
        "1j62uk931nf|https://www.xuexi.cn/52e44abae4bdb29ec9c20e2ebc8ff4c4/5957f69bffab66811b99940516ec8784.html",
        "1hoa55co0nf|https://www.xuexi.cn/fc9e217ca5c82e1c3abeb7ffc653295b/101e83575e300916a040edc4afe62c3d.html",
    ],
    'video': [
        "1novbsbi47k|https://www.xuexi.cn/a191dbc3067d516c3e2e17e2e08953d6/b87d700beee2c44826a9202c75d18c85.html",
        "1742g60067k|https://www.xuexi.cn/0b99b2eb0a13e4501cbaf82a5c37a853/b87d700beee2c44826a9202c75d18c85.html",
        "1novbsbi47k|https://www.xuexi.cn/4426aa87b0b64ac671c96379a3a8bd26/db086044562a57b441c24f2af1c8e101.html#1novbsbi47k-5",
        "1koo357ronk|https://www.xuexi.cn/4426aa87b0b64ac671c96379a3a8bd26/db086044562a57b441c24f2af1c8e101.html#1koo357ronk-5",
        "1742g60067k|https://www.xuexi.cn/4426aa87b0b64ac671c96379a3a8bd26/db086044562a57b441c24f2af1c8e101.html#1742g60067k-5",
        "17th9fq5c7l|https://www.xuexi.cn/4426aa87b0b64ac671c96379a3a8bd26/db086044562a57b441c24f2af1c8e101.html#17th9fq5c7l-5",
        "vc9n1ga0nl|https://www.xuexi.cn/4426aa87b0b64ac671c96379a3a8bd26/db086044562a57b441c24f2af1c8e101.html#vc9n1ga0nl-5",
        "1f8iooppm7l|https://www.xuexi.cn/4426aa87b0b64ac671c96379a3a8bd26/db086044562a57b441c24f2af1c8e101.html#1f8iooppm7l-5",
        "17fsu5j4hnl|https://www.xuexi.cn/4426aa87b0b64ac671c96379a3a8bd26/db086044562a57b441c24f2af1c8e101.html#17fsu5j4hnl-5",
        "1am3asi2enl|https://www.xuexi.cn/4426aa87b0b64ac671c96379a3a8bd26/db086044562a57b441c24f2af1c8e101.html#1am3asi2enl-5",
    ]
};

//检查用户积分数据
// 1阅读文章，2试听学习，4专项答题，5每周答题，6每日答题，9登录，1002文章时长，1003视听学习时长
function getPointsData(callback) {
    if (scoreTabId) {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", urlMap.scoreApi);
        xhr.setRequestHeader("Pragma", "no-cache");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let res = JSON.parse(xhr.responseText);
                if (res.hasOwnProperty("code") && parseInt(res.code) === 200) {
                    if (checkScoreAPI(res)) {
                        let points = 0;
                        // let ruleList = [1, 2, 9, 1002, 1003];
                        let ruleList = [1, 2, 4, 5, 6, 9, 1002, 1003];
                        for (let key in res.data.dayScoreDtos) {
                            if (!res.data.dayScoreDtos.hasOwnProperty(key)) {
                                continue;
                            }
                            if (ruleList.indexOf(res.data.dayScoreDtos[key].ruleId) !== -1) {
                                points += res.data.dayScoreDtos[key].currentScore;
                            }
                        }
                        if (!isMobile) {
                            // 浏览器扩展图标
                            chrome.browserAction.setBadgeText({"text": points.toString()});
                        }
                        if (typeof callback === "function") {
                            callback(res.data);
                        }
                    } else {
                        notice(chrome.i18n.getMessage("extScoreApi"), chrome.i18n.getMessage("extUpdate"));
                    }
                } else {
                    if (runningTabId) {
                        chrome.tabs.remove(runningTabId);
                    }
                    if (runningWindowId) {
                        closeWindow();
                    }
                    chrome.tabs.update(scoreTabId, {"active": true, "url": getLoginUrl()});
                }
            }
        };
        xhr.send();
    }
}

//检查积分接口数据结构
function checkScoreAPI(res) {
    if (res.hasOwnProperty("data")) {
        if (res.data.hasOwnProperty("dayScoreDtos")) {
            let pass = 0;
            let ruleList = [1, 2, 4, 5, 6, 9, 1002, 1003];
            for (let key in res.data.dayScoreDtos) {
                if (!res.data.dayScoreDtos.hasOwnProperty(key)) {
                    continue;
                }
                if (res.data.dayScoreDtos[key].hasOwnProperty("ruleId") && res.data.dayScoreDtos[key].hasOwnProperty("currentScore") && res.data.dayScoreDtos[key].hasOwnProperty("dayMaxScore")) {
                    if (ruleList.indexOf(res.data.dayScoreDtos[key].ruleId) !== -1) {
                        ++pass;
                    }
                }
            }
            if (pass === ruleList.length) {
                return true;
            }
        }
    }
    return false;
}

//检查首页内容数据
function getChannelData(type, callback) {
    shuffle(channel[type]);
    channelArr = channel[type][0].split('|');

    if (!isMobile) {
        chrome.windows.get(runningWindowId, {"populate": true}, function (window) {
            if (typeof window !== "undefined") {
                chrome.tabs.sendMessage(window.tabs[window.tabs.length - 1].id, {
                    "method": "redirect",
                    "data": channelArr[1]
                });
            }
        });
    } else {
        chrome.tabs.sendMessage(runningTabId, {
            "method": "redirect",
            "data": channelArr[1]
        });
    }

    setTimeout(function () {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", urlMap.channelApi + channelArr[0] + ".json?_st=" + Math.floor(Date.now() / 6e4));
        xhr.setRequestHeader("Accept", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    let res = JSON.parse(xhr.responseText);
                    let list = [];
                    let pass = [];
                    let url;

                    for (key in res) {
                        if (!res.hasOwnProperty(key)) {
                            continue;
                        }
                        if (res[key].hasOwnProperty("url")) {
                            url = res[key].url;
                            if (type === 'article') {
                                if (url.indexOf("e43e220633a65f9b6d8b53712cba9caa") === -1 && url.indexOf("lgpage/detail/index") === -1) {
                                    continue;
                                }
                            } else {
                                if (url.indexOf("cf94877c29e1c685574e0226618fb1be") === -1 && url.indexOf("7f9f27c65e84e71e1b7189b7132b4710") === -1 && url.indexOf("lgpage/detail/index") === -1) {
                                    continue;
                                }
                            }
                            if (list.indexOf(url) === -1 && pass.indexOf(url) === -1) {
                                if (usedUrls[type].indexOf(url) === -1) {
                                    list.push(url);
                                } else {
                                    pass.push(url);
                                }
                            }
                        }
                    }
                    shuffle(list);
                    shuffle(pass);
                    list.concat(pass);

                    if (list.length) {
                        if (typeof callback === "function") {
                            callback(list);
                        }
                    } else {
                        notice(chrome.i18n.getMessage("extChannelApi"), chrome.i18n.getMessage("extUpdate"));
                    }
                }
            }
        };
        xhr.send();
    }, 1000 + Math.floor(Math.random() * 3000));
}

//自动积分
function autoEarnPoints(timeout) {
    let url;
    let newTime = 0;
    setTimeout(function () {
        getPointsData(function (data) {
            let score = data.dayScoreDtos;
            let type;

            for (let key in score) {
                if (!score.hasOwnProperty(key)) {
                    continue;
                }
                switch (score[key].ruleId) {
                    case 1:
                    case 1002:
                        if (score[key].currentScore < score[key].dayMaxScore) {
                            type = "article";
                            newTime = 35 * 1000 + Math.floor(Math.random() * 150 * 1000);
                        }
                        break;
                    case 2:
                    case 1003:
                        if (score[key].currentScore < score[key].dayMaxScore) {
                            type = "video";
                            newTime = 125 * 1000 + Math.floor(Math.random() * 120 * 1000);
                        }
                        break;
                    case 4:
                        if (score[key].currentScore <= 0) {
                            type = "paperAsk";
                            newTime = 300 * 1000 + Math.floor(Math.random() * 10 * 1000);
                        }
                        break;
                    case 5:
                        if (score[key].currentScore <= 0) {
                            type = "weekAsk";
                            newTime = 300 * 1000 + Math.floor(Math.random() * 10 * 1000);
                        }
                        break;
                    case 6:
                        if (score[key].currentScore < score[key].dayMaxScore) {
                            type = "dayAsk";
                            newTime = 300 * 1000 + Math.floor(Math.random() * 10 * 1000);
                        }
                        break;
                }
                if (type) {
                    break;
                }
            }

            if (type && channelUrls[type].length) {
                url = channelUrls[type].shift();
            }

            // alert('scoreTabId' + scoreTabId);
            if (!isMobile) {
                if (url && scoreTabId && runningWindowId) {
                    chrome.windows.get(runningWindowId, {"populate": true}, function (window) {
                        if (typeof window !== "undefined") {
                            chrome.tabs.sendMessage(window.tabs[window.tabs.length - 1].id, {
                                "method": "redirect",
                                "data": url
                            });
                            autoEarnPoints(newTime);
                        }
                    });
                } else {
                    closeWindow();
                }
            } else {
                if (url && scoreTabId && runningTabId) {
                    chrome.tabs.sendMessage(runningTabId, {
                        "method": "redirect",
                        "data": url
                    });
                    autoEarnPoints(newTime);
                } else {
                    chrome.tabs.remove(runningTabId);
                    chrome.tabs.remove(scoreTabId);
                }
            }
        });
    }, timeout);
}

//获取最后使用的网址
function getLastTypeUrl(type, index) {
    let urls = [];
    let length = usedUrls[type].length ? usedUrls[type].length - 1 : 0;
    for (let i = length; i >= 0; --i) {
        if (!usedUrls[type].hasOwnProperty(i)) {
            continue;
        }
        urls.push(usedUrls[type][i]);

        if (urls.length >= index + 1) {
            break;
        }
    }
    return urls.hasOwnProperty(index) ? urls[index] : undefined;
}

//打乱数组
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

//通知
function notice(title, message = "") {
    if (!isMobile) {
        chrome.notifications.create({
            "type": "basic",
            "iconUrl": "img/128.png",
            "title": title,
            "message": message
        }, function (notificationId) {
            setTimeout(function () {
                chrome.notifications.clear(notificationId);
            }, 5000);
        });
    } else {
        alert(title + (message ? "\n" + message : ""));
    }
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
        if (runningWindowId) {
            chrome.windows.remove(runningWindowId);
        }
        if (scoreWindowId) {
            chrome.windows.remove(scoreWindowId);
        }
        notice(chrome.i18n.getMessage("extFinish"));
    }
}

//获取登录链接
function getLoginUrl() {
    let lang = chrome.i18n.getUILanguage() === "zh-CN" ? ".zh-CN" : "";
    return chrome.runtime.getURL("login" + lang + ".html");
}

//扩展按钮点击事件
chrome.browserAction.onClicked.addListener(function (tab) {
    if (chromeVersion < 45 && firefoxVersion < (isMobile ? 55 : 48)) {
        notice(chrome.i18n.getMessage("extVersion"));
    } else {
        if (!isMobile) {
            if (scoreTabId) {
                if (runningWindowId) {
                    chrome.windows.update(runningWindowId, {"focused": true, "state": "normal"});
                } else {
                    chrome.windows.update(scoreWindowId, {"focused": true, "state": "normal"});
                }
            } else {
                channelUrls = {};
                chooseLogin = 0;
                createWindow(urlMap.points, function (window) {
                    scoreWindowId = window.id;
                    scoreTabId = window.tabs[window.tabs.length - 1].id;
                });
            }
        } else {
            if (scoreTabId) {
                if (runningTabId) {
                    chrome.tabs.update(runningTabId, {"active": true});
                } else {
                    chrome.tabs.update(scoreTabId, {"active": true});
                }
            } else {
                channelUrls = {};
                chooseLogin = 0;
                chrome.tabs.create({"url": urlMap.points}, function (tab) {
                    scoreTabId = tab.id;
                });
            }
        }
    }
});

//标签页移除事件
chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
    if (tabId === runningTabId) {
        runningTabId = 0;
    } else if (tabId === scoreTabId) {
        scoreTabId = 0;
    }
});

//窗口移除事件
if (!isMobile) {
    chrome.windows.onRemoved.addListener(function (windowId) {
        if (windowId === runningWindowId) {
            runningWindowId = 0;
        } else if (windowId === scoreWindowId) {
            scoreWindowId = 0;
            chrome.browserAction.setBadgeText({"text": ""});
        }
    });
}

//通信事件
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    switch (request.method) {
        case "checkTab":
            if (sender.tab.windowId === runningWindowId || sender.tab.id === runningTabId || sender.tab.id === scoreTabId) {
                sendResponse({
                    "runtime": 1
                });
            }
            break;
        case "startRun":
            // alert('length' + Object.keys(channelUrls).length);
            // alert('runningWindowId' + runningWindowId);
            if (!Object.keys(channelUrls).length) {
                if (!isMobile) {
                    if (!runningWindowId) {
                        getPointsData(function (data) {
                            if (userId !== data.userId) {
                                usedUrls = {
                                    "article": [],
                                    "video": []
                                }
                            }
                            userId = data.userId;
                            createWindow(urlMap.index, function (window) {
                                runningWindowId = window.id;
                                notice(chrome.i18n.getMessage("extWorking"), chrome.i18n.getMessage("extWarning"));
                                setTimeout(function () {
                                    channelUrls["dayAsk"] = urlMap.dayAskUrl;
                                    channelUrls["weekAsk"] = urlMap.weekAskUrl;
                                    channelUrls["paperAsk"] = urlMap.paperAskUrl;
                                    getChannelData("article", function (list) {
                                        channelUrls["article"] = list;
                                        getChannelData("video", function (list) {
                                            channelUrls["video"] = list;
                                            autoEarnPoints(1000 + Math.floor(Math.random() * 1000));
                                        });
                                    });
                                }, 1000 + Math.floor(Math.random() * 3000));
                            });
                        });
                    }
                } else {
                    if (!runningTabId) {
                        getPointsData(function (data) {
                            if (userId !== data.userId) {
                                usedUrls = {
                                    "article": [],
                                    "video": []
                                }
                            }
                            userId = data.userId;
                            chrome.tabs.create({"url": urlMap.index}, function (tab) {
                                runningTabId = tab.id;
                                setTimeout(function () {
                                    channelUrls["dayAsk"] = urlMap.dayAskUrl;
                                    channelUrls["weekAsk"] = urlMap.weekAskUrl;
                                    channelUrls["paperAsk"] = urlMap.paperAskUrl;
                                    getChannelData("article", function (list) {
                                        channelUrls["article"] = list;
                                        getChannelData("video", function (list) {
                                            channelUrls["video"] = list;
                                            autoEarnPoints(1000 + Math.floor(Math.random() * 1000));
                                        });
                                    });
                                }, 1000 + Math.floor(Math.random() * 3000));
                            });
                        });
                    }
                }
            }
            break;
        case "useUrl":
            if (usedUrls[request.type].indexOf(sender.tab.url) === -1) {
                usedUrls[request.type].push(sender.tab.url);
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
        case "askComplete":
            // closeWindow();
            break;
    }
});