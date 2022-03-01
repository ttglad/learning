chrome.runtime.sendMessage({"method": "checkTab"}, {}, function (response) {
    if (response && response.hasOwnProperty("runtime")) {
        if (response.runtime) {
            window.onload = function () {


                // 设置1s
                // setTimeout(function() {
                //     var item = document.getElementsByClassName("ant-pagination-item");
                //     item[item.length - 1].click();
                // }, 3000);

                function getNeedAnswer() {
                    var isNextPage = true;
                    document.querySelectorAll('.item .right > button').forEach(function (e, b, c) {
                        if (isNextPage) {
                            let year = e.parentNode.parentNode.firstElementChild.lastElementChild.innerText.slice(0, 4);
                            let i = e.innerText;
                            if (i != "" && (i == '开始答题' || i == '继续答题')) {
                                isNextPage = false;
                                if (year != "" && (new Date().getFullYear() == year)) {
                                    e.click();
                                } else {
                                    var item = document.getElementsByClassName("ant-pagination-item");
                                    item[item.length - 1].click();
                                    // 设置查询非当年题目
                                    setTimeout(getNeedAnswerHistory, parseInt(Math.random() * 1000 + 2000));
                                }
                                return;
                            }
                        }
                    });

                    if (isNextPage) {
                        var li = document.getElementsByClassName("ant-pagination-next")[0];
                        if (li.getAttribute("aria-disabled") == "false") {
                            document.querySelector('a.ant-pagination-item-link > i.anticon-right').click();
                            setTimeout(getNeedAnswer, parseInt(Math.random() * 1000 + 2000));
                        } else {
                            chrome.runtime.sendMessage({"method": "paperAskDoes"}, {}, function (res) {
                                if (res.complete) {
                                    window.close();
                                }
                            });
                        }
                    }
                }

                function getNeedAnswerHistory() {
                    var isNextPage = true;
                    Array.from(document.querySelectorAll('.item .right > button')).reverse().forEach(function (e, b, c) {
                        if (isNextPage) {
                            let i = e.innerText;
                            if (i != "" && (i == '开始答题' || i == '继续答题')) {
                                isNextPage = false;
                                e.click();
                                return;
                            }
                        }
                    });

                    if (isNextPage) {
                        var li = document.getElementsByClassName("ant-pagination-prev")[0];
                        if (li.getAttribute("aria-disabled") == "false") {
                            document.querySelector('a.ant-pagination-item-link > i.anticon-left').click();
                            setTimeout(getNeedAnswerHistory, parseInt(Math.random() * 1000 + 2000));
                        } else {
                            chrome.runtime.sendMessage({"method": "paperAskDoes"}, {}, function (res) {
                                if (res.complete) {
                                    window.close();
                                }
                            });
                        }
                    }
                }
                let config = response.config;
                let paperConfig = new Object();
                for (let i = 0; i < config.length; i++) {
                    if ("paper" == config[i].type) {
                        paperConfig = config[i];
                        break;
                    }
                }

                if (paperConfig.subject == "current") {
                    setTimeout(getNeedAnswer, parseInt(Math.random() * 1000 + 5000));
                } else {
                    var item = document.getElementsByClassName("ant-pagination-item");
                    item[item.length - 1].click();
                    // 设置查询非当年题目
                    setTimeout(getNeedAnswerHistory, parseInt(Math.random() * 1000 + 5000));
                }
            }
        }
    }
});