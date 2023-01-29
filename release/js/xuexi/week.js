chrome.runtime.sendMessage({ type: "checkRunning" }, {}, function (response) {
    if (response && response.hasOwnProperty("runtime")) {
        if (response.runtime) {
            
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
                        console.log("weekAskDoes 1");
                        chrome.runtime.sendMessage({ type: "weekAskDoes" }, {}, function (res) {
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
                        console.log("weekAskDoes");
                        chrome.runtime.sendMessage({ type: "weekAskDoes" }, {}, function (res) {
                            if (res.complete) {
                                window.close();
                            }
                        });
                    }
                }
            }

            chrome.storage.local.get(['studySubjectConfig'], function (result) {
                let config = result.studySubjectConfig;
                let weekConfig = new Object();
                for (let i = 0; i < config.length; i++) {
                    if ("week" == config[i].type) {
                        weekConfig = config[i];
                        break;
                    }
                }

                if (weekConfig.subject == "current") {
                    setTimeout(getNeedAnswer, parseInt(Math.random() * 1000 + 5000));
                } else {
                    // 设置查询非当年题目
                    setTimeout(function () {
                        var item = document.getElementsByClassName("ant-pagination-item");
                        item[item.length - 1].click();

                        setTimeout(getNeedAnswerHistory, parseInt(Math.random() * 1000 + 2000));
                    }, parseInt(Math.random() * 1000 + 5000));
                }
            });

        }
    }
});
