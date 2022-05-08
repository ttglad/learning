chrome.runtime.sendMessage({ type: "checkAuth" }, (response) => {
    if (response && response.hasOwnProperty("runtime")) {
        if (response.runtime) {
            setTimeout(function () {
                document.querySelector(".qrcode-box").scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                    inline: "center"
                });
            }, 1000);
        }
    }
});