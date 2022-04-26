chrome.runtime.sendMessage({"method": "chooseLogin"}, {}, function (response) {
    window.onload = function () {

        setTimeout(function () {
            document.querySelector("#qglogin").scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "center",
            });
        }, 500);

        chrome.runtime.sendMessage({"method": "checkLogin"});
    }
});