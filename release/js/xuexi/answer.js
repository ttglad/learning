chrome.runtime.sendMessage({ type: "checkRunning" }, {}, function (response) {
    if (response && response.hasOwnProperty("runtime")) {
        if (response.runtime) {

            var WaitingTime = 15, setTimeoutFunc = null, ManageType = 'auto', isManual = false;

            function getAnswers() {
                let answerChoseNum = 0, answerArray = [], match_num = {}, max = 0, timeAfter = 0;
                isManual = false;
                // 获取答题标题，单选题、多选题、填空题
                let questionTitle = $(".q-header");
                if (!questionTitle.length) {
                    // 如果答题已完成
                    if ($(".ant-btn.action.ant-btn-primary").length) {
                        setTimeout(function () {
                            chrome.runtime.sendMessage({ type: "studyComplete" }, {}, function (res) {
                                if (res.complete) {
                                    window.close();
                                }
                            });
                        }, 5000 + Math.floor(Math.random() * 5000));
                    } else {
                        setTimeoutFunc = setTimeout(getAnswers, parseInt(Math.random() * 2000 + 2000));
                    }
                    return;
                }
                // 提交答案
                if (!$(".q-footer .tips").length) {
                    answerSubmit(1);
                    return;
                }
                // 获取答案
                $(".q-footer .tips").click();
                $('.line-feed [color=red]').each(function () {
                    let i = $(this).text();
                    if (i != "") {
                        answerArray.push(i);
                    }
                });

                // 如果答案为空，则找到全部提示内容
                if (answerArray.length == 0) {
                    $('.line-feed > font').each(function () {
                        let i = $(this).text();
                        if (i != "") {
                            answerArray.push(i);
                        }
                    });

                    if (answerArray.length == 0) {
                        $('.line-feed').each(function () {
                            let i = $(this).text();
                            if (i != "" && i != "请观看视频") {
                                answerArray.push(i);
                            }
                        });
                    }
                }

                // 获取题目
                let questionType = questionTitle.text().substr(0, 3);
                switch (questionType) {
                    case "单选题":
                        timeAfter = 1;
                    case "多选题":
                        answerChoseNum = $('.q-answers .chosen').length;
                        if (answerChoseNum <= 0) {
                            $('.q-answer').each(function () {
                                let that = $(this);
                                var answerSelect = that.text().split('. ').slice(-1)[0];
                                var answerIsRight = false;
                                var answerMatches = 0;
                                var isChosen = false;
                                var answerJoinString = answerArray.join('');

                                // 转换符号，
                                answerSelect = answerSelect.replace(/\(/g, "（").replace(/\)/g, "）");
                                answerJoinString = answerJoinString.replace(/\(/g, "（").replace(/\)/g, "）");

                                isChosen = Boolean(that.attr('class').indexOf("chosen") != -1);
                                answerIsRight = (answerSelect.indexOf(answerJoinString) != -1 || answerJoinString.indexOf(answerSelect) != -1) && answerJoinString != "";
                                if (answerIsRight && questionType == '单选题') {
                                    answerIsRight = (answerJoinString.length == answerSelect.length ? true : false);
                                }
                                if (answerIsRight && !isChosen) {
                                    that.click();
                                    answerChoseNum++;
                                }
                                if (!answerIsRight) {
                                    answerMatches += getAnswerMatches(answerJoinString, that.text());
                                    match_num[answerMatches] = that;
                                }
                            });

                            if (answerChoseNum == 0) {
                                for (let i in match_num) {
                                    max = Number(max) >= Number(i) ? Number(max) : Number(i);
                                }
                                match_num[max].click();
                                answerChoseNum++;
                                isManual = true;
                            }
                            manualManage();
                            timeAfter = timeAfter == 0 ? 2500 : 1500;
                        }
                        break;
                    case "填空题":
                        var inpus = document.querySelectorAll('.q-body input');
                        var inputs_e = document.querySelectorAll('.q-body input[value=""]');
                        answerChoseNum = inpus.length - inputs_e.length;
                        if (inputs_e.length > 0) {
                            var ev = new Event('input', { bubbles: true });
                            inpus.forEach(function (a, b, c) {
                                if (answerArray[0] == undefined) {
                                    isManual = true;
                                    let a = document.querySelector(".q-body").innerText;
                                    let n = parseInt(Math.random() * 2 + 2);
                                    let i = parseInt(Math.random() * (a.length - n - 1));
                                    answerArray[0] = a.substr(i, n);
                                }
                                var value = "";
                                if (c.length == 1) {
                                    value = answerArray.join('');
                                } else {
                                    value = b < answerArray.length ? answerArray[b] : answerArray[0];
                                }
                                if (a.value == "") {
                                    a.setAttribute("value", value);
                                    a.dispatchEvent(ev);
                                    answerChoseNum++;
                                }
                            })
                            manualManage();
                            timeAfter = 3500;
                        }
                        break;
                }
                setTimeoutFunc = setTimeout(function () {
                    answerSubmit(answerChoseNum)
                }, parseInt(Math.random() * 1500 + timeAfter));
            }

            function answerSubmit(answerChoseNum = 0) {
                // 提交答案
                if (answerChoseNum > 0 && ManageType == 'auto') {
                    //!document.querySelector(".next-btn").disabled ? document.querySelector(".next-btn").click() : document.querySelector(".submit-btn").click();
                    // 有提交按钮，提交数据
                    if ($(".submit-btn").length) {
                        $(".submit-btn").click();
                    } else {
                        if ($(".next-btn").length) {
                            $(".next-btn").click();
                        }
                    }
                    setTimeoutFunc = setTimeout(getAnswers, parseInt(Math.random() * 1000 + 2000));
                }
            }

            function getAnswerMatches(a = '', b = '') {
                let c = 0;
                for (let i = 0; i < b.length; i++) {
                    if (a.indexOf(b.substr(i, 1)) != -1) {
                        c++;
                    }
                }
                return c;
            }

            function manualManage() {

                let myId = "my_ms";
                if ($('#' + myId).length || !isManual) {
                    return;
                }

                // 浏览器提醒
                chrome.runtime.sendMessage({ type: "answerError" });

                // 设置类型等待
                ManageType = "wait";

                let timerId = "my_ds_c";
                let buttonId = "my_bt_c";
                let html = '<div id="' + myId + '" style="color: red; font-size: 20px; text-align: center;">此题无完全匹配答案，已填写(选择)一个相对最匹配的答案(可能是错误的)。你可以点击下面按钮切换到手动做题并修正答案后再次点击按钮切换到自动做题。<br>';
                html += '<span>若 <span id="' + timerId + '">' + WaitingTime + '</span> 秒无操作则继续自动做题</span><br>';
                html += '<button id="' + buttonId + '" value="auto" style="color: green; font-size: 24px; text-align: center; margin-top: 10px;">切换到手动做题</button>';
                html += '</div>';

                $(".header-row").append(html);

                let timeLeftSeconds = 0;
                let timeLeftEvenv = null;
                // button点击事件
                $('#' + buttonId).off('click').on('click', function () {
                    if (timeLeftEvenv != null) {
                        clearInterval(timeLeftEvenv);
                        timeLeftEvenv = null;
                    }
                    if ($(this).val() == 'auto') {
                        $(this).val('manual');
                        $(this).text('切换到自动做题');
                        $(this).css('color', 'red');
                        ManageType = "manual";
                    } else {
                        $(this).val('auto');
                        $(this).text('切换到手动做题');
                        $(this).css('color', 'green');
                        ManageType = 'auto';
                        $('#' + myId).remove();
                        getAnswers();
                    }
                });

                // 定时事件
                timeLeftEvenv = setInterval(function () {
                    timeLeftSeconds++;
                    $('#' + timerId).text(WaitingTime - timeLeftSeconds);
                    if (timeLeftSeconds >= WaitingTime) {
                        $('#' + myId).remove();
                        clearInterval(timeLeftEvenv);
                        timeLeftEvenv = null;
                        ManageType = 'auto';
                        answerSubmit(1);
                    }
                }, 1000);
            }

            setTimeoutFunc = setTimeout(getAnswers, parseInt(Math.random() * 3000 + 3000));

        }
    }
});
