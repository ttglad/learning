var extension;

var App;

var Settings;

function init() {
    extension = chrome.extension.getBackgroundPage();
    App = chrome.runtime.getManifest();
    Settings = extension.Settings;
    document.body.style.visibility = "visible";

    $(".versionNumber").text(App.version);

    if (typeof (Settings.getObject("learningConfig")) == "undefined") {
        let learningConfig = [
            {"type": "article", "sort": 1, "title": "文章学习", "time": 120, "flag": true, "subject": ""},
            {"type": "video", "sort": 2, "title": "视频学习", "time": 120, "flag": true, "subject": ""},
            {"type": "week", "sort": 3, "title": "每周答题", "time": 0, "flag": true, "subject": "current"},
            {"type": "paper", "sort": 4, "title": "专项学习", "time": 0, "flag": true, "subject": "current"},
            {"type": "day", "sort": 5, "title": "每日答题", "time": 0, "flag": true, "subject": ""}
        ];
        Settings.setObject("learningConfig", learningConfig);
    }

    if (typeof (Settings.getObject("startLearning")) == "undefined") {
        Settings.setObject("startLearning", false);
    }

    // if (typeof (Settings.getObject("dayAnswer")) == "undefined") {
    //     Settings.setObject("dayAnswer", true);
    // }
    //
    // if (typeof (Settings.getObject("weekAnswer")) == "undefined") {
    //     Settings.setObject("weekAnswer", true);
    // }
    //
    // if (typeof (Settings.getObject("paperAnswer")) == "undefined") {
    //     Settings.setObject("paperAnswer", true);
    // }

    if (typeof (Settings.getValue("env")) == "undefined") {
        Settings.setValue("env", "idc");
    }

    // 初始化数据
    $(".answer").each(function () {
        var attrKey = $(this).attr("attr");
        var child = $(this).children("div.icon")[0];

        // 获取配置信息
        let learningConfig = Settings.getObject("learningConfig");
        for (let i = 0; i < learningConfig.length; i++) {
            if (attrKey == learningConfig[i].type) {
                if (!learningConfig[i].flag) {
                    $(child).removeClass("checked");
                } else {
                    $(child).addClass("checked")
                }
                break;
            }
        }

        // if (!Settings.getObject(attrKey)) {
        //     $(child).removeClass("checked");
        // } else {
        //     $(child).addClass("checked")
        // }
    });

    var start = Settings.getObject("startLearning");
    if (start) {
        $("#learning span:first").text('结束学习');
    } else {
        $("#learning span:first").text('开始学习');
    }
}

$(document).ready(function () {
    init();

    // 学习按钮
    $("#learning").off("click").on("click", function () {
        var start = Settings.getObject("startLearning");
        if (!start) {
            Settings.setObject("startLearning", true);
            extension.browserActionClick();
        } else {
            Settings.setObject("startLearning", false);
            extension.closeWindow();
        }
        window.close();
    });


    // 答题选项
    $(".answer").off("click").on("click", function () {
        var attrKey = $(this).attr("attr");
        var child = $(this).children("div.icon")[0];

        let learningConfig = Settings.getObject("learningConfig");
        let config = new Array();
        for (let i = 0; i < learningConfig.length; i++) {
            if (attrKey == learningConfig[i].type) {
                if (learningConfig[i].flag) {
                    learningConfig[i].flag = false;
                    $(child).removeClass("checked");
                } else {
                    learningConfig[i].flag = true;
                    $(child).addClass("checked")
                }
            }
            config.push(learningConfig[i]);
        }
        Settings.setObject("learningConfig", config);

        // if (Settings.getObject(attrKey)) {
        //     Settings.setObject(attrKey, false);
        //     $(child).removeClass("checked");
        // } else {
        //     Settings.setObject(attrKey, true);
        //     $(child).addClass("checked")
        // }
    });

    // 配置选项
    $("#menuOptions").off('click').on('click', function () {
        extension.openOptions();
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