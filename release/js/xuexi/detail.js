chrome.runtime.sendMessage({ type: "checkAuth" }, {}, function (response) {
    if (response && response.hasOwnProperty("runtime")) {
        if (response.runtime) {

            chrome.storage.local.get(['studySubjectConfig'], function (result) {
                let config = result.studySubjectConfig;
                let type = "article";

                // 延迟执行
                setTimeout(function () {
                    let newTime = 120000;

                    // 获取配置时间
                    for (var i = 0; i < config.length; i++) {
                        if (config[i].type == type) {
                            newTime = config[i].time * 1000;
                            break;
                        }
                    }

                    if (document.querySelector('video')) {
                        type = "video";

                        for (var i = 0; i < config.length; i++) {
                            if (config[i].type == type) {
                                newTime = config[i].time * 1000;
                                break;
                            }
                        }

                        // 增加视频播放功能

                        let video = document.querySelector('video');
                        video.muted = true
                        video.play();

                        let videoTime = parseInt(video.duration) * 1000;
                        if (videoTime > 0 && videoTime < newTime) {
                            newTime = videoTime;
                        }

                    }

                    // 学习完成关闭页面
                    setTimeout(function () {
                        chrome.runtime.sendMessage({ type: "studyComplete" }, {}, function (res) {
                            if (res.complete) {
                                window.close();
                            }
                        });
                    }, newTime + Math.floor(Math.random() * 10 * 1000));

                    // 页面点击时间
                    if (document.querySelector(".content")) {
                        document.querySelector(".content").click();
                    }

                    window.scrollTo({
                        left: window.scrollX,
                        top: 400 + Math.floor(Math.random() * 200),
                        behavior: 'smooth'
                    });
                    autoScroll(type);

                }, 10000 + Math.floor(Math.random() * 1000));
            });

            // 滚动方法
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
        }
    }
});