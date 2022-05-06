chrome.runtime.sendMessage({ type: "checkAuth" }, (response) => {
    if (response && response.hasOwnProperty("runtime")) {
        if (response.runtime) {
            setTimeout(function () {
                document.querySelector("#qglogin").scrollIntoView({
                    behavior: "smooth"
                });
            }, 1000);
        }
    }
});