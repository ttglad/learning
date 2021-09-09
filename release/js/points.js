chrome.runtime.sendMessage({"method": "checkTab"}, {}, function (response) {
    if (response && response.hasOwnProperty("runtime")) {
        if (response.runtime) {
            chrome.runtime.sendMessage({"method": "startRun"});
        }
    }
});