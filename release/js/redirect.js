chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    switch (request.method) {
        case "redirect":
            window.location.replace(request.data);
            break;
    }
});