
function init() {
    document.body.style.visibility = "visible";
}

function loadConfigView() {
    chrome.storage.local.get(['studySubjectConfig'], function (result) {
        let studySubjectConfig = result.studySubjectConfig
        var html = "";
        for (var i = 0; i < studySubjectConfig.length; i++) {
            html += getViewDetail(studySubjectConfig[i]);
        }
        $(html).appendTo("#configListTable");
    });
}

/**
 * @returns {string}
 */
function getViewDetail(obj) {
    var html = "";
    html += '<tr class="tableRow config_' + obj.type + '" attr="' + obj.type + '" title="' + obj.title + '">';

    html += '<td><select class="' + obj.type + '_sort">';
    var sortArr = [1, 2, 3, 4, 5];
    for (var i = 0; i < sortArr.length; i++) {
        if (obj.sort == sortArr[i]) {
            html += '<option value="' + sortArr[i] + '" selected>' + sortArr[i] + '</option> ';
        } else {
            html += '<option value="' + sortArr[i] + '">' + sortArr[i] + '</option> ';
        }
    }
    html += '</select></td>';

    html += '<td style="text-align: center">' + obj.title + '</td>';

    html += '<td><select class="' + obj.type + '_flag">';
    var flagArr = [{ "key": "自动学习", "value": true }, { "key": "不学习", "value": false }];
    for (var i = 0; i < flagArr.length; i++) {
        if (obj.flag === flagArr[i].value) {
            html += '<option value=' + flagArr[i].value + ' selected>' + flagArr[i].key + '</option> ';
        } else {
            html += '<option value=' + flagArr[i].value + '>' + flagArr[i].key + '</option> ';
        }
    }
    html += '</select></td>';

    html += '<td>';
    if (obj.type == "article" || obj.type == "video") {
        html += '<select class="' + obj.type + '_time">';

        var flagArr = [{ "key": "1分钟", "value": "60" }, { "key": "2分钟", "value": "120" }, { "key": "3分钟", "value": "180" }];
        for (var i = 0; i < flagArr.length; i++) {
            if (obj.time == flagArr[i].value) {
                html += '<option value="' + flagArr[i].value + '" selected>' + flagArr[i].key + '</option> ';
            } else {
                html += '<option value="' + flagArr[i].value + '">' + flagArr[i].key + '</option> ';
            }
        }

        html += '</select>';
    }

    html += '</td>';

    html += '<td>';
    if (obj.type == "week" || obj.type == "paper") {
        html += '<select class="' + obj.type + '_subject">';

        var flagArr = [{ "key": "优先本年度题目", "value": "current" }, { "key": "优先历史题目", "value": "history" }];
        for (var i = 0; i < flagArr.length; i++) {
            if (obj.subject == flagArr[i].value) {
                html += '<option value="' + flagArr[i].value + '" selected>' + flagArr[i].key + '</option> ';
            } else {
                html += '<option value="' + flagArr[i].value + '">' + flagArr[i].key + '</option> ';
            }
        }

        html += '</select>';
    }

    html += '</td>';

    html += '</tr>';
    return html;
}

function saveOptions() {
    var config = [];
    $(".tableRow").each(function () {

        var type = $(this).attr("attr");
        var item = new Object();
        item.type = type;
        item.title = $(this).attr("title");
        var flag = $("select." + type + "_flag :selected").val();
        if (flag == "true") {
            item.flag = true;
        } else {
            item.flag = false;
        }
        item.sort = $("select." + type + "_sort :selected").val();
        var time = $("select." + type + "_time :selected").val();
        if (typeof (time) == "undefined") {
            item.time = 0;
        } else {
            item.time = time;
        }
        var subject = $("select." + type + "_subject :selected").val();
        if (typeof (subject) == "undefined") {
            item.subject = "";
        } else {
            item.subject = subject;
        }
        config.push(item);
    });

    config.sort(function (a, b) {
        return a.sort - b.sort;
    });

    // 保存数据
    chrome.storage.local.set({ studySubjectConfig: config }, function () {
        location.reload();
    });
}

// 初始化函数
jQuery(function () {
    init();

    loadConfigView();

    $("#saveLearningConfig").off('click').on('click', saveOptions);
});

