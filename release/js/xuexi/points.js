chrome.runtime.sendMessage({ type: "checkAuth" }, (response) => {
    if (response && response.hasOwnProperty("runtime")) {
        if (response.runtime) {
            chrome.runtime.sendMessage({ type: "startRun" });
        }
    }
});