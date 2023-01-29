chrome.runtime.sendMessage({type: "checkRunning"}, {}, function (response) {
    if (response && response.hasOwnProperty("runtime")) {
        if (response.runtime) {

            function slideVerify() {
                const nc_mask = document.getElementById("nc_mask")
                if (nc_mask !== null && getComputedStyle(nc_mask).display !== 'none') {
                    var btn_slide = document.getElementById("nc_1_n1z")
                    var mousedown = document.createEvent("MouseEvents");
                    if (btn_slide !== null) {
                        var btn_slide_rect = btn_slide.getBoundingClientRect();
                        var x = btn_slide_rect.left + btn_slide_rect.width * (parseInt(Math.random() * 5) / 10 + 0.2);
                        var y = btn_slide_rect.top + btn_slide_rect.height / 2;
                    }
                    var nc_scale = document.getElementById("nc_1_n1t");
                    if (nc_scale !== null) {
                        var w = nc_scale.getBoundingClientRect().width;
                    }

                    //点击滑块
                    mousedown.initMouseEvent("mousedown", true, true, window, 0, x, y, x, y, false, false, false, false, 0, null);
                    if (btn_slide != null) {
                        btn_slide.dispatchEvent(mousedown);
                    }

                    var dx = 0;
                    var dy = 0;
                    //滑动滑块
                    var intervaltimer = setInterval(function () {
                        var mousemove = document.createEvent("MouseEvents");
                        var _x = x + dx;
                        var _y = y + dy;
                        mousemove.initMouseEvent("mousemove", true, true, window, 0, _x, _y, _x, _y, false, false, false, false, 0, null);
                        if (btn_slide != null) {
                            btn_slide.dispatchEvent(mousemove);
                        }
                        if (_x - x >= w) {
                            // 滑到最右边
                            clearInterval(intervaltimer);
                            var mouseup = document.createEvent("MouseEvents");
                            mouseup.initMouseEvent("mouseup", true, true, window, 0, _x, _y, _x, _y, false, false, false, false, 0, null);
                            if (btn_slide != null) {
                                btn_slide.dispatchEvent(mouseup);
                            }
                        } else {
                            dx += parseInt(Math.random() * (209 - 199) + 199) / 33;
                        }
                    }, 25 + Math.floor(Math.random() * 5));
                }
            }

            // 定时执行
            setInterval(function () {
                // 滑块验证
                const swiperValid = document.getElementById("swiper_valid")

                if (swiperValid) {
                    // 滑块出现执行对应回调
                    let observer = new MutationObserver(mutationRecords => {
                        slideVerify();
                    });
                    observer.observe(swiperValid, {
                        childList: true, // 观察直接子节点
                        subtree: true, // 及其更低的后代节点
                        characterDataOldValue: true // 将旧的数据传递给回调
                    });
                }

            }, 10000 + Math.floor(Math.random() * 5000));
        }
    }
});