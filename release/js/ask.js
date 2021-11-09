chrome.runtime.sendMessage({"method": "checkTab"}, {}, function (response) {
    if (response && response.hasOwnProperty("runtime")) {
        if (response.runtime) {

            var WaitingTime = 10, setTimeoutFunc = null, ManageType = 'auto', isManual = false;

            function getAnswers() {
                var answerChoseNum = 0, answerArray = [], match_num = {}, max = 0, timeAfter = 0;
                isManual = false;
                if (document.querySelector(".q-header") == null) {
                    if (document.querySelector(".ant-btn.action.ant-btn-primary") != null){
                        chrome.runtime.sendMessage({"method": "askComplete"});
                        return;
                    } else {
                        setTimeoutFunc = setTimeout(getAnswers, parseInt(Math.random() * 1000 + 1000));
                        return;
                    }
                }
                var questionTitle = document.querySelector(".q-header");
                if (questionTitle == null) {
                    return;
                }
                var questionType = questionTitle.innerText.substr(0, 3);
                if (document.querySelector(".q-footer .tips") != null) {
                    document.querySelector(".q-footer .tips").click();
                } else {
                    answerSubmit(1);
                    return;
                }
                document.querySelectorAll('.line-feed [color=red]').forEach(function (a, b, c) {
                    let i = a.innerText;
                    if (i != "") answerArray.push(i);
                });
                switch (questionType) {
                    case "单选题":
                        timeAfter = 1;
                    case "多选题":
                        answerChoseNum = document.querySelectorAll('.q-answers .chosen').length;
                        if (answerChoseNum <= 0) {
                            document.querySelectorAll('.q-answer').forEach(function (a, b, c) {
                                var answerSelect = a.innerHTML.split('. ').slice(-1)[0];
                                var answerIsRight = false;
                                var answerMatches = 0;
                                var isChosen = false;
                                var answerJoinString = answerArray.join('');
                                isChosen = Boolean(a.className.indexOf("chosen") != -1);
                                answerIsRight = (answerSelect.indexOf(answerJoinString) != -1 || answerJoinString.indexOf(answerSelect) != -1) && answerJoinString != "";
                                if (answerIsRight && questionType == '单选题') {
                                    answerIsRight = (answerJoinString.length == answerSelect.length ? true : false);
                                }
                                if (answerIsRight && !isChosen) {
                                    a.click();
                                    answerChoseNum++;
                                }
                                if (!answerIsRight) {
                                    answerMatches += getAnswerMatches(answerJoinString, a.innerHTML);
                                    match_num[answerMatches] = a
                                }
                            })
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
                            var ev = new Event('input', {bubbles: true});
                            inpus.forEach(function (a, b, c) {
                                if (answerArray[0] == undefined) {
                                    isManual = true;
                                    let a = document.querySelector(".q-body").innerText;
                                    let n = parseInt(Math.random() * 2 + 2);
                                    let i = parseInt(Math.random() * (a.length - n - 1));
                                    answerArray[0] = a.substr(i, n);
                                }
                                var value = "";
                                if (c.length == 1)
                                    value = answerArray.join('');
                                else
                                    value = b < answerArray.length ? answerArray[b] : answerArray[0];
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
                if (answerChoseNum > 0 && ManageType == 'auto') {
                    !document.querySelector(".next-btn").disabled ? document.querySelector(".next-btn").click() : document.querySelector(".submit-btn").click();
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
                if (document.querySelector("#my_ms") != null || !isManual) return;
                let ds_c = 0;
                let ds_t = null;
                ManageType = "wait";
                let e = document.createElement("div");
                e.id = "my_ms";
                e.innerHTML = "此题无完全匹配答案，已填写(选择)一个相对最匹配的答案(可能是错误的)。你可以点击下面按钮切换到手动做题并修正答案后再次点击按钮切换到自动做题。<br><span id='my_ds'>若 <span id='my_ds_c'>" + WaitingTime + "</span> 秒无操作则继续自动做题</span><br>";
                e.style.color = 'red';
                e.style.fontSize = '20px';
                e.style.textAlign = 'center';
                document.querySelector(".header-row").appendChild(e);
                let b = document.createElement("button");
                b.style.color = 'green';
                b.style.fontSize = '24px';
                b.style.textAlign = 'center';
                b.style.marginTop = '10px';
                b.value = 'auto';
                b.innerText = '切换到手动做题';
                b.onclick = function () {
                    document.querySelector("#my_ds").innerHTML = '';
                    if (ds_t != null) {
                        clearInterval(ds_t);
                        ds_t = null;
                    }
                    if (this.value == 'auto') {
                        this.value = 'manual';
                        ManageType = "manual";
                        b.innerText = '切换到自动做题';
                        this.style.color = 'red';
                    } else {
                        this.value = 'auto';
                        ManageType = 'auto';
                        b.innerText = '切换到手动做题';
                        this.style.color = 'green';
                        document.querySelector("#my_ms").remove();
                        getAnswers();
                    }
                }
                e.appendChild(b);
                ds_t = setInterval(function () {
                    ds_c++;
                    document.querySelector("#my_ds_c").innerText = WaitingTime - ds_c;
                    if (ds_c >= WaitingTime) {
                        document.querySelector("#my_ms").remove();
                        clearInterval(ds_t);
                        ds_t = null;
                        ManageType = 'auto';
                        answerSubmit(1);
                    }
                }, 1000);

            }

            setTimeoutFunc = setTimeout(getAnswers, parseInt(Math.random() * 1000 + 2000));
        }
    }
});
