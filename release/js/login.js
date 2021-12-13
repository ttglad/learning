chrome.runtime.sendMessage({"method": "chooseLogin"}, {}, function (response) {
    window.onload = function () {

        setTimeout(function () {
            document.querySelector(".qrcode-box").scrollIntoView({
                behavior: "smooth"
            });
        }, 500);

        chrome.runtime.sendMessage({"method": "checkLogin"});
    }
});