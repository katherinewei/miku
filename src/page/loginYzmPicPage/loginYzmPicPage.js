/**
 * 邀请成为推广经理
 */


require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/countDown'
], function ($, URL, Data, Common, CountDown) {
    var Page,
        count_down_time = 0,
        verCode = false,
        inputBefore,
        isAgency = URL.param.isAgency;
    $('.waitting').hide();
    function init() {

        render();
    }

    function render() {
        //header

        var mainPage = '<section class="inviteSP page-content"><div class="banner"><img src="' + URL.imgPath + '/common/images/bg_invite5.png"> </div> <div class="makeMoneyWrap"> <div class="inputBox grid"><div class="row"><div class="col"><input type="tel" class="mobile" placeholder="请输入手机号" /></div> </div> <div class="row"><div class="col col-15 fb far fvc "><input id="vercode2" class="vercode2" type="text" placeholder="请输入图中4位验证码" maxlength="4"></div> <div class="col col-10 "><div id="sendvercode2" class="sendvercode2"></div></div></div><div class="row"><div class="col col-15 fb far fvc "><input class="vercode" type="tel" placeholder="请输入4位验证码" maxlength="4"></div> <div class="col col-10 "><div class="sendvercode disable">发送验证码</div></div></div><div class="row"><div class="col"><input type="submit" id="submit" class="btn submit" value="加入米酷"/></div> </div></div> <article><div class="boxContent"><h4><span>米酷推广经理特权</span></h4><div class="list"> <div class="grid"> <dl class="row"><dt class="col col-6"><div class="round"><img src="'+URL.imgPath+'/common/images/icon_power2.png"/> </div></dt><dd class="col col-18"><h3>平台代理权</h3> <p>享受米酷平台上百万款热销产品的代理权，推广销售即可获得高额奖励</p> </dd> </dl> </div><div class="grid"><dl class="row"><dt class="col col-6"><div class="round"><img src="'+URL.imgPath+'/common/images/icon_power3.png"/></div></dt> <dd class="col col-18"><h3>推广拿高额奖励</h3><p>每成功推荐一位好友成为推广经理，或推广销售平台上的任何产品，都可获得高额奖励</p> </dd></dl></div> <div class="grid"><dl class="row"><dt class="col col-6"><div class="round"><img src="'+URL.imgPath+'/common/images/icon_power4.png"/></div></dt><dd class="col col-18"><h3>自购拿返利</h3><p>自己购买平台上的任何产品，都可获得高额返利。</p></dd></dl></div><div class="grid"> <dl class="row"><dt class="col col-6"><div class="round"><img src="'+URL.imgPath+'/common/images/icon_power1.png"/></div></dt><dd class="col col-18"><h3>轻松享受一键式营销</h3> <p>吸睛营销方案公司提供，只需动动手指， 就能坐等推广费进兜。</p> </dd> </dl> </div></div></div> </article></div></section>';
        Page = $(mainPage).appendTo('body');



        require('component/kinerCode/1.0.0/kinerCode',function(KinerCode){
            var inp = document.getElementById('vercode2');
            var code = document.getElementById('sendvercode2');
            var submit = document.getElementById('submit');
            inputBefore = inp.value;

            var c = ["+", "-", "*", "/"];
            var arr = [];
            for (var i = 0; i < 1000; i++) {

                var num = parseInt(Math.random() * 100 + 1);
                var num2 = parseInt(Math.random() * 100 + 1);
                var num3 = parseInt(Math.random() * 4);

                if (c[num3] === '/') {
                    var x = num % num2;
                    if (x != 0) {
                        num -= x;

                        if(num==0){
                            var temp = num;
                            num2 = num;
                            num = temp;
                        }

                    }
                }

                if(num==0&&num==0){
                    continue;
                }

                var str = num + c[num3] + num2;

                arr.push(str);

            }
            //======================插件引用主体
            var c = new KinerCode({
                len: 4,//需要产生的验证码长度
//        chars: ["1+2","3+15","6*8","8/4","22-15"],//问题模式:指定产生验证码的词典，若不给或数组长度为0则试用默认字典
                chars: [
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 0,
                    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
                    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
                ],//经典模式:指定产生验证码的词典，若不给或数组长度为0则试用默认字典
                question: false,//若给定词典为算数题，则此项必须选择true,程序将自动计算出结果进行校验【若选择此项，则可不配置len属性】,若选择经典模式，必须选择false
                copy: false,//是否允许复制产生的验证码
                bgColor: "#ffffff",//背景颜色[与背景图任选其一设置]
                bgImg: "",//若选择背景图片，则背景颜色失效
                randomBg: false,//若选true则采用随机背景颜色，此时设置的bgImg和bgColor将失效
                inputArea: inp,//输入验证码的input对象绑定【 HTMLInputElement 】
                codeArea: code,//验证码放置的区域【HTMLDivElement 】
                click2refresh: true,//是否点击验证码刷新验证码
                false2refresh: true,//在填错验证码后是否刷新验证码
                //timeoutrefresh:3000,
                validateObj: '',//触发验证的对象，若不指定则默认为已绑定的输入框inputArea
                validateEven: "blur",//触发验证的方法名，如click，blur等
                validateFn: function (result, code) {//验证回调函数
                    if (result) {
                        //alert('验证成功');
                        verCode = false;
                        $('.sendvercode').removeClass('disable');
                    } else {
                        console.log(inputBefore,inp.value);

                        if(inputBefore != inp.value){
                            bainx.broadcast('验证码错误，请重新输入');
                        }
                        verCode = true;
                        $('.sendvercode').addClass('disable');
                    }
                }
            });
        })

        bindEvents(Page);
    }

    function bindEvents(page) {
        page.on('tap', '.sendvercode', function(event){

            event.preventDefault();
            if(count_down_time == 0){
                sendVerCode(page, $(this));
            }

        }).on('tap', '.submit', function (event) {
            event.preventDefault();

            submit(page, $(this));
            //var mobile = $('.mobile', page),
            //    data = {
            //        mobile: $.trim(mobile.val())
            //    },
            //    parentId = pageConfig.parentId,
            //    telReg = data.mobile.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);
            //if (!data.mobile) {
            //    bainx.broadcast(mobile.attr('placeholder'));
            //    return;
            //
            //} else if (!telReg) {
            //    bainx.broadcast('请输入正确的手机号码！');
            //    return;
            //}
            //if (Common.inWeixin) {
            //    receiveUrlWX = URL.site + URL.receiveInviteSpreadMangerPage + '?mobile=' + data.mobile + '&parentId=' + pageConfig.pid;
            //    location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx21647f957347c195&redirect_uri=' + encodeURIComponent(receiveUrlWX) + '&response_type=code&scope=snsapi_base&state=1#wechat_redirect';
            //} else {
            //    location.href = URL.receiveInviteSpreadMangerPage + '?mobile=' + data.mobile + '&parentId=' +  pageConfig.pid;
            //}




        });


    }

    function startCountDown(btn){
        (new CountDown({
            time: 60,
            change: function(){
                count_down_time = this.time;
                btn.text(this.time + '秒');
                return this;
            },
            end: function(){
                btn.text('发送验证码').removeClass('disable');
                return this;
            }
        })).start();
    }
    function sendVerCode(page, btn){

        var mobile = $('.mobile', page),
            vmobile = $.trim(mobile.val());

        if (!vmobile) {
            bainx.broadcast(mobile.attr('placeholder'));
            return false;
        } else if (!/^[\d]{11}$/gi.test(vmobile)) {
            bainx.broadcast('请输入正确的手机号码！');
            return false;
        }if(btn.hasClass('disable')){
            bainx.broadcast('请输入图中的验证码！');
            return false;
        }

        var doneFn = function(res) {
                btn.addClass('disable').text('60秒');
                startCountDown(btn);
            },
            failFn = function(code, json) {
                setTimeout(function() {
                    if (code === 7) {
                        btn.removeClass('disable').text('发送验证码');
                    } else {
                        btn.removeClass('disable').text('重新发送');
                    }
                }, 1000);
            };

        Common.statistics('login', 'sendcode', 'invoke', 1);


        btn.addClass('disable').text('正在处理..');
        return Data.checkMobile(vmobile).done(doneFn).fail(failFn);
    }

    var startTime = new Date().getTime();
    function submit(page, btn){
        var mobile = $('.mobile', page),
            vercode = $('.vercode', page),
            data = {
                mobile: $.trim(mobile.val()),
                checkNO: $.trim(vercode.val()),
                pUserId:URL.param.pUserId
            };

        if (!data.mobile) {
            bainx.broadcast(mobile.attr('placeholder'));
            return;
        } else if (!/^[\d]{11}$/gi.test(data.mobile)) {
            bainx.broadcast('请输入正确的手机号码！');
            return;
        }

        if (!data.checkNO) {
            bainx.broadcast(vercode.attr('placeholder'));
            return;
        } else if (data.checkNO.length !== 4) {
            bainx.broadcast('请输入4位数字验证码');
            return;
        }

        if(verCode){
            return;
        }

        btn.addClass('disable').text('用户登录中.');

        var doneFn = function(res) {
                btn.text('加入成功');
                //URL.assign(URL.receiveInviteSpreadMangerPage + '?mobile=' + data.mobile + '&parentId=' +  pageConfig.pid);
                $('.inputBox').remove();
                $('.banner').addClass('receivePage').html('<p class="text"></p><a class="btn"></a>');


                console.log(res);
                var status = res.status;            //status(0=未注册；1=已注册；2=注册成功)
                switch (status) {
                    case 1:           //已注册
                        if(res.isAgency == 1) {
                            $('.banner .text').text("感谢您关注米酷,您已经是米酷推广经理了,赶紧进行推广吧!")
                        }else{
                            $('.banner .text').text("感谢您关注米酷,赶紧购买创业礼包,成为推广经理,开启赚钱模式吧!");
                            if (Common.inWeixin) {
                                $('.banner .text').after('<a href="' + URL.buyForJoinAgencyPage + '?type=1">成为推广经理</a>');//只有在微信中才显示
                            }
                        }
                        Common.inWeixin ? $('.btn').text("进入米酷").attr("href", URL.index) : $('.btn').text("下载米酷APP").attr("href", Common.downloadLink);
                        break;
                    case 2:               //注册成功
                        if(Common.inWeixin){
                            $('.banner .text').text("恭喜你成功注册米酷,赶紧购买创业礼包,成为推广经理,开启赚钱模式吧!");
                            $('.btn').text("进入米酷").attr("href", URL.index);
                            $('.banner .text').after('<a  href="' + URL.buyForJoinAgencyPage + '?type=1">成为推广经理</a>');
                        }
                        else{
                            $('.banner .text').text("恭喜你成功注册米酷,赶紧购买创业礼包,成为推广经理,开启赚钱模式吧!");
                            $('.btn').text("下载米酷APP").attr("href", Common.downloadLink);
                        }
                        break;
                    default:
                        break;
                }
            },
            failFn = function() {
                btn.removeClass('disable').text('重新登录');
            };

        Common.statistics('login', 'sendcode', 'success', new Date().getTime() - startTime);


        return Data.login(data).done(doneFn).fail(failFn);
    }
    init();

});
