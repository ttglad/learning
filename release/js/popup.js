var extension;

var App;

function init() {
    App = chrome.runtime.getManifest();
    document.body.style.visibility = "visible";

    $(".versionNumber").text(App.version);


    // 初始化数据
    $(".answer").each(function () {
        var attrKey = $(this).attr("attr");
        var child = $(this).children("div.icon")[0];

        // 获取配置信息
        chrome.storage.local.get(['studySubjectConfig'], function (result) {
            let studySubjectConfig = result.studySubjectConfig
            for (let i = 0; i < studySubjectConfig.length; i++) {
                if (attrKey == studySubjectConfig[i].type) {
                    if (!studySubjectConfig[i].flag) {
                        $(child).removeClass("checked");
                    } else {
                        $(child).addClass("checked")
                    }
                    break;
                }
            }
        });
    });

    // 开始按钮展示
    chrome.storage.local.get(['studyWindowId'], function (result) {
        if (result.studyWindowId) {
            $("#learning span:first").text('结束学习');
        } else {
            $("#learning span:first").text('开始学习');
        }
    });
}

// 初始化
jQuery(function () {
    init();

    // 学习按钮
    $("#learning").off("click").on("click", function () {
        chrome.storage.local.get(["studyWindowId"], function (result) {
            if (!result.studyWindowId) {
                chrome.runtime.sendMessage({ type: "startStudy" }, (response) => {
                    if (response.complete) {
                        window.close();
                    }
                });
            } else {
                chrome.runtime.sendMessage({ type: "stopStudy" }, (response) => {
                    if (response.complete) {
                        window.close();
                    }
                });
            }
        });
    });


    // 答题选项
    $(".answer").off("click").on("click", function () {
        var attrKey = $(this).attr("attr");
        var child = $(this).children("div.icon")[0];

        chrome.storage.local.get(['studySubjectConfig'], function (result) {
            let config = new Array();
            let studySubjectConfig = result.studySubjectConfig
            for (let i = 0; i < studySubjectConfig.length; i++) {
                if (attrKey == studySubjectConfig[i].type) {
                    if (studySubjectConfig[i].flag) {
                        studySubjectConfig[i].flag = false;
                        $(child).removeClass("checked");
                    } else {
                        studySubjectConfig[i].flag = true;
                        $(child).addClass("checked")
                    }
                }
                config.push(studySubjectConfig[i]);
            }
            // 设置初始数据
            chrome.storage.local.set({ "studySubjectConfig": config }, function () {
                console.log("data init success");
            });
        });

    });

    // 配置选项
    $("#menuOptions").off('click').on('click', function () {
        let fullUrl = chrome.runtime.getURL("html/options.html");
        chrome.tabs.query({ currentWindow: true }, function (tabs) {
            for (let i in tabs) { // check if Options page is open already
                if (tabs.hasOwnProperty(i)) {
                    let tab = tabs[i];
                    if (tab.url == fullUrl) {
                        chrome.tabs.update(tab.id, { selected: true }); // select the tab
                        return;
                    }
                }
            }
            chrome.tabs.query({ active: true }, function (tabs) {
                chrome.tabs.create({
                    url: fullUrl,
                    index: tabs[0].index + 1
                });
            });
        });
    });

    // 关于展示
    $("#menuAbout").off('click').on('click', function () {
        var currentBodyDirection = document.body.style.direction;
        document.body.style.direction = "ltr";
        $("#about").css("visibility", "hidden");

        $("#menu").hide();
        $("#about").show();
        $(document.body).height($("#about").height());
        $(window).height($("#about").height());

        document.body.style.direction = currentBodyDirection;
        $("#about").css("visibility", "visible");

        $("#about, #addRule .close").off('click').on('click', function () {
            window.close();
        });
    });
});