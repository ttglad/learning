var XX = {};

XX.urlMap = {
    "index": "https://www.xuexi.cn",
    "points": "https://pc.xuexi.cn/points/my-points.html",
    "scoreApi": "https://pc-proxy-api.xuexi.cn/api/score/days/listScoreProgress?sence=score&deviceType=2",
    "channelApi": "https://www.xuexi.cn/lgdata/",
    "loginUrl": "https://pc.xuexi.cn/points/login.html",
    "dayAskUrl": "https://pc.xuexi.cn/points/exam-practice.html",
    "weekAskUrl": "https://pc.xuexi.cn/points/exam-weekly-list.html",
    "paperAskUrl":  "https://pc.xuexi.cn/points/exam-paper-list.html",
    "articleUrl": [
        "1jpuhp6fn73",  // 重要活动
        "19vhj0omh73",  // 重要会议
        "132gdqo7l73",  // 重要讲话
        "35il6fpn0ohq", // 学习重点
        "1ap1igfgdn2",  // 学习时评
        "slu9169f72",   // 中宣部发布
        "tuaihmuun2",   // 新文发布厅
        "1oo5atvs172",   // 文化广场
        "1eppcq11fne",   // 科技思想研究
        "152ijthp37e",   // 科技前沿
        "1jscb6pu1n2",   // 重要新闻
        "1ajhkle8l72",   // 综合新闻
    ],
    "videoUrl": [
        "2qfjjjrprmdh",  // 国防军事新文
        // "3m1erqf28h0r",  // 红色故事
        "525pi8vcj24p",  // 红色书信
        // "48cdilh72vp4", // 社会与法
        "1novbsbi47k",  // 重要活动视频专辑
        "1742g60067k",   // 学习新视界
        "1koo357ronk",   // 学习专题报道
        "vc9n1ga0nl",   // 永远的丰碑
        "1f8iooppm7l",   // 文艺广场
        // "1am3asi2enl",   // 微电影
    ],
};

XX.getPoints = function () {
    var result;
    $.ajax({
        type: "GET",
        async: false,
        timeout: 10000,
        url: XX.urlMap.scoreApi,
        success: function(data){
            result = data;
        },
        error: function() {

        }
    });
    return result;
}

XX.getUrls = function (type) {
    var result;
    if (type == "article" || type == "video") {
        let key;
        if (type == "article") {
            key = Utils.ArrayRandom(XX.urlMap.articleUrl);
        } else {
            key = Utils.ArrayRandom(XX.urlMap.videoUrl);
        }
        $.ajax({
            type: "GET",
            async: false,
            timeout: 10000,
            url: XX.urlMap.channelApi + key + ".json?_st=" + Math.floor(Date.now() / 6e4),
            success: function(res){
                let list = [];
                let url;
                let publishTime;
                for (key in res) {
                    if (!res.hasOwnProperty(key)) {
                        continue;
                    }
                    if (res[key].hasOwnProperty("url")) {
                        url = res[key].url;

                        // 判断发布时间是否是700天之内，如果没有，判断url规则
                        if (res[key].hasOwnProperty("publishTime")) {
                            publishTime = new Date(res[key].publishTime);
                            var lastYear = new Date(new Date() - 700 * 86400000);
                            if (publishTime < lastYear) {
                                continue;
                            }
                        } else {
                            if (url.indexOf("lgpage/detail/index") === -1) {
                                continue;
                            }
                        }

                        if (list.indexOf(url) === -1) {
                            list.push(url);
                        }
                    }
                }
                if (list.length) {
                    result = Utils.ArrayRandom(list);
                }
            },
            error: function() {

            }
        });
    } else if (type == "paperAsk") {
        result = XX.urlMap.paperAskUrl;
    } else if (type == "weekAsk") {
        result = XX.urlMap.weekAskUrl;
    } else if (type == "dayAsk") {
        result = XX.urlMap.dayAskUrl;
    }
    return result;
}
