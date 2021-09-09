window.addEventListener("load", function () {
    document.getElementById("qr").addEventListener("click", function () {
        chrome.runtime.sendMessage({"method": "chooseLogin"}, {}, function (response) {
            window.location.replace("https://pc.xuexi.cn/points/my-points.html");
        });
    });
});
