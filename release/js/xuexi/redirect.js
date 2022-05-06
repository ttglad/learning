chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
        case "redirect":
            window.location.replace(message.url);
            break;
    }
    sendResponse({"redirect": true});
});