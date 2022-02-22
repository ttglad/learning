chrome.runtime.sendMessage({"method": "checkTab"}, {}, function (response) {
    if (response && response.hasOwnProperty("runtime")) {
        if (response.runtime) {

            window.onload = function () {

                // 设置1s，优先执行
                // setTimeout(function () {
                //     var item = document.getElementsByClassName("ant-pagination-item");
                //     item[item.length - 1].click();
                // }, 3000);

                function getNeedAnswer() {
                    var isNextPage = true;
                    document.querySelectorAll('.week > button').forEach(function (e, b, c) {
                        if (isNextPage) {
                            let i = e.innerText;
                            let year = e.parentNode.firstElementChild.firstElementChild.innerText.slice(0, 4);
                            if (i != "" && i == '开始答题') {
                                isNextPage = false;
                                if (year != "" && (new Date().getFullYear() == year)) {
                                    e.click();
                                } else {
                                    // 点击最后一页
                                    var item = document.getElementsByClassName("ant-pagination-item");
                                    item[item.length - 1].click();
                                    // 设置查询非当年题目
                                    setTimeout(getNeedAnswerHistory, parseInt(Math.random() * 1000 + 5000));
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
                            chrome.runtime.sendMessage({"method": "weekAskDoes"}, {}, function (res) {
                                if (res.complete) {
                                    window.close();
                                }
                            });
                        }
                    }
                }

                function getNeedAnswerHistory() {
                    var isNextPage = true;
                    Array.from(document.querySelectorAll('.week > button')).reverse().forEach(function (e, b, c) {
                        if (isNextPage) {
                            let i = e.innerText;
                            if (i != "" && i == '开始答题') {
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
                            chrome.runtime.sendMessage({"method": "weekAskDoes"}, {}, function (res) {
                                if (res.complete) {
                                    window.close();
                                }
                            });
                        }
                    }
                }

                setTimeout(getNeedAnswer, parseInt(Math.random() * 1000 + 5000));
            }
        }
    }
});