(function() {
    'use strict';

    function getNeedAnswer()
    {
        var isNextPage = false;
        document.querySelectorAll('.week > button').forEach(function (e, b, c) {
            let i = e.innerText;
            if (i != "" && i == '开始答题') {
                e.click();
                return;
            }
            isNextPage = true;
        });

        if (isNextPage) {
            document.querySelector('a.ant-pagination-item-link > i.anticon-right').click();

            setTimeout(getNeedAnswer, parseInt(Math.random() * 1000 + 3000));
        }
    }

    setTimeout(getNeedAnswer, parseInt(Math.random() * 1000 + 3000));
})();