chrome.runtime.sendMessage({"method": "checkTab"}, {}, function (response) {
    if (response && response.hasOwnProperty("runtime")) {
        if (response.runtime) {
            function getNeedAnswer() {
                var isNextPage = true;
                document.querySelectorAll('.week > button').forEach(function (e, b, c) {
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
                    var li = document.getElementsByClassName("ant-pagination-next")[0];
                    if (li.getAttribute("aria-disabled") == "false") {
                        document.querySelector('a.ant-pagination-item-link > i.anticon-right').click();
                        setTimeout(getNeedAnswer, parseInt(Math.random() * 1000 + 1000));
                    } else {
                        chrome.runtime.sendMessage({"method": "weekAskDoes"});
                    }
                }
            }

            setTimeout(getNeedAnswer, parseInt(Math.random() * 1000 + 1000));
        }
    }
});