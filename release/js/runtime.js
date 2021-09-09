function autoScroll(type) {
    if (type === "article") {
        setTimeout(function () {
            let scrollYMax = document.body.scrollHeight - document.documentElement.clientHeight;
            if (window.scrollY < scrollYMax - 600) {
                window.scrollBy({
                    left: 0,
                    top: Math.floor(Math.random() * 3) > 0 ? (100 + Math.floor(Math.random() * 200)) : (Math.floor(Math.random() * -200)),
                    behavior: 'smooth'
                });
                autoScroll(type);
            }
        }, 1000 + Math.floor(Math.random() * 3000))
    } else {
        setTimeout(function () {
            let x = Math.floor(Math.random() * 2);
            window.scrollBy({
                left: x ? -100 + Math.floor(Math.random() * 200) : 0,
                top: x ? 0 : -100 + Math.floor(Math.random() * 200),
                behavior: "smooth"
            });
            autoScroll(type);
        }, 2000 + Math.floor(Math.random() * 58 * 1000));
    }
}

chrome.runtime.sendMessage({"method": "checkTab"}, {}, function (response) {
    if (response && response.hasOwnProperty("runtime")) {
        if (response.runtime) {
            let type = "article";
            if (document.querySelector('video')) {
                type = "video";
            }
            setTimeout(function () {
                document.querySelector(".content").click();
            }, 1000 + Math.floor(Math.random() * 3000));

            setTimeout(function () {
                window.scrollTo({
                    left: window.scrollX,
                    top: 400 + Math.floor(Math.random() * 200),
                    behavior: 'smooth'
                });
                autoScroll(type);
                chrome.runtime.sendMessage({"method": "useUrl", "type": type});
            }, 1000 + Math.floor(Math.random() * 3000))
        }
    }
});