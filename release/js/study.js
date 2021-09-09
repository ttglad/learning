chrome.runtime.sendMessage({"method": "checkTab"}, {}, function (response) {
    if (response && response.hasOwnProperty("runtime")) {
        if (response.runtime) {
            window.location.replace("https://pc.xuexi.cn/points/my-points.html");
        }
    }
});