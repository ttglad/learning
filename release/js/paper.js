chrome.runtime.sendMessage({"method": "checkTab"}, {}, function (response) {
    if (response && response.hasOwnProperty("runtime")) {
        if (response.runtime) {

            function getNeedAnswer()
            {
                var isNextPage = true;
                document.querySelectorAll('.item .right > button').forEach(function (e, b, c) {
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
                    document.querySelector('a.ant-pagination-item-link > i.anticon-right').click();

                    setTimeout(getNeedAnswer, parseInt(Math.random() * 1000 + 3000));
                }
            }

            setTimeout(getNeedAnswer, parseInt(Math.random() * 1000 + 3000));

        }
    }
});