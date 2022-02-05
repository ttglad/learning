var extension;

var App;

var Settings;

function init() {
    extension = chrome.extension.getBackgroundPage();
    App = chrome.runtime.getManifest();
    Settings = extension.Settings;
    document.body.style.visibility = "visible";

    $(".versionNumber").text(App.version);

    if (typeof(Settings.getObject("startLearning")) == "undefined") {
        Settings.setObject("startLearning", false);
    }

    if (typeof(Settings.getObject("dayAnswer")) == "undefined") {
        Settings.setObject("dayAnswer", true);
    }

    if (typeof(Settings.getObject("weekAnswer")) == "undefined") {
        Settings.setObject("weekAnswer", true);
    }

    if (typeof(Settings.getObject("paperAnswer")) == "undefined") {
        Settings.setObject("paperAnswer", true);
    }

    if (typeof(Settings.getObject("usedUrls")) == "undefined") {
        Settings.setObject("usedUrls", []);
    }

    if (typeof(Settings.getValue("env")) == "undefined") {
        Settings.setValue("env", "idc");
    }

    // 初始化数据
    $(".answer").each(function() {
        var attrKey = $(this).attr("attr");
        var child = $(this).children("div.icon")[0];
        if (!Settings.getObject(attrKey)) {
            $(child).removeClass("checked");
        } else {
            $(child).addClass("checked")
        }
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
    $("#learning").off("click").on("click", function() {
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
        if (Settings.getObject(attrKey)) {
            Settings.setObject(attrKey, false);
            $(child).removeClass("checked");
        } else {
            Settings.setObject(attrKey, true);
            $(child).addClass("checked")
        }
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