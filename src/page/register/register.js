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
        successJoinDialog,
        howToMakeDialog,
        isAgency = URL.param.isAgency;
    $('.waitting').hide();
    function init() {

        render();
    }

    function render() {
        //header

        var mainPage = '<section class="inviteSP page-content"><div class="banner"><img src="' + URL.imgPath + '/common/images/bg_invite5.png"> </div> <div class="makeMoneyWrap"> <div class="inputBox grid"><div class="row"><div class="col"><input type="tel" class="mobile" placeholder="请输入手机号" /></div> </div> <div class="row"><div class="col col-15 fb far fvc "><input class="vercode" type="tel" placeholder="请输入4位验证码" maxlength="4"></div> <div class="col col-10 "><div class="sendvercode">发送验证码</div></div></div><div class="row"><div class="col"><input type="password" class="password" placeholder="请输入密码" /></div> </div><div class="row"><div class="col"><input type="password" class="passwordAgain" placeholder="请确认密码" /></div> </div><div class="row"><div class="col"><input type="submit" class="btn submit" value="加入米酷"/></div> </div></div> <article><div class="boxContent"><h4><span>米酷推广经理特权</span></h4><div class="list"> <div class="grid"> <dl class="row"><dt class="col col-6"><div class="round"><img src="'+URL.imgPath+'/common/images/icon_power2.png"/> </div></dt><dd class="col col-18"><h3>平台代理权</h3> <p>享受米酷平台上百万款热销产品的代理权，推广销售即可获得高额奖励</p> </dd> </dl> </div><div class="grid"><dl class="row"><dt class="col col-6"><div class="round"><img src="'+URL.imgPath+'/common/images/icon_power3.png"/></div></dt> <dd class="col col-18"><h3>推广拿高额奖励</h3><p>每成功推荐一位好友成为推广经理，或推广销售平台上的任何产品，都可获得高额奖励</p> </dd></dl></div> <div class="grid"><dl class="row"><dt class="col col-6"><div class="round"><img src="'+URL.imgPath+'/common/images/icon_power4.png"/></div></dt><dd class="col col-18"><h3>自购拿返利</h3><p>自己购买平台上的任何产品，都可获得高额返利。</p></dd></dl></div><div class="grid"> <dl class="row"><dt class="col col-6"><div class="round"><img src="'+URL.imgPath+'/common/images/icon_power1.png"/></div></dt><dd class="col col-18"><h3>轻松享受一键式营销</h3> <p>吸睛营销方案公司提供，只需动动手指， 就能坐等推广费进兜。</p> </dd> </dl> </div></div></div> </article></div></section>';
        Page = $(mainPage).appendTo('body');

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


        require('component/rsa/1.0.0/rsa', function(RSA) {


            var mobile = $.trim($('.mobile', page).val()),
                vercode = $.trim($('.vercode', page).val()),
                password = $.trim($('.password', page).val()),
                passwordAgain = $.trim($('.passwordAgain', page).val());
            RSA.setMaxDigits(130);          //长度为1024是130  2048 是260
            var key = new RSA.RSAKeyPair("65537", "", "937AF0D334A5B437D18EE148468452E3095FFD24258A82F910498B3506B477024FF3F87BE8DE3231EEE670F214C1E299EE9E0BCA8EEE62C7D20631FD0CE89E77B69899D6B19987A1C43C176C51E6EE01E2869604A47F6C2A6EDAF167A1A2B7D0B26EF98100CDF8AB3142ADA8D129605C00A1EAD5B1E42D0FC6453D440DE9ADD7");
            var passwordRSA = RSA.encryptedString(key, password);
            var passwordRSA2 = RSA.encryptedString(key, passwordAgain);

            alert(password,passwordAgain,passwordRSA)

            var data = {
                mobile: mobile,
                checkNum: vercode,
                pswd: passwordRSA
            };
        if (!data.mobile) {
            bainx.broadcast($('.mobile', page).attr('placeholder'));
            return;
        } else if (!/^[\d]{11}$/gi.test(data.mobile)) {
            bainx.broadcast('请输入正确的手机号码！');
            return;
        }

        if (!data.checkNum) {
            bainx.broadcast($('.vercode', page).attr('placeholder'));
            return;
        } else if (data.checkNum.length !== 4) {
            bainx.broadcast('请输入4位数字验证码');
            return;
        }
        if(password != passwordAgain){
            bainx.broadcast('您输入的密码不一致,请重新输入!');
            return;
        }
        btn.addClass('disable').text('用户登录中...');

        var doneFn = function(res) {
                btn.text('加入成功');
                $('.inputBox').remove();
                $('.banner').addClass('receivePage').html('<p class="text"></p><a class="btn"></a>');


                console.log(res);

                if(Common.inWeixin){
                    $('.banner .text').text("恭喜你成功注册米酷,赶紧购买创业礼包,成为推广经理,开启赚钱模式吧!");
                    $('.btn').text("进入米酷").attr("href", URL.index);
                    $('.banner .text').after('<a  href="' + URL.buyForJoinAgencyPage + '?type=1">成为推广经理</a>');
                }
                else{
                    $('.banner .text').text("恭喜你成功注册米酷,赶紧购买创业礼包,成为推广经理,开启赚钱模式吧!");
                    $('.btn').text("下载米酷APP").attr("href", Common.downloadLink);
                }
            },
            failFn = function() {
                btn.removeClass('disable').text('重新注册');
            };
        Common.statistics('login', 'sendcode', 'success', new Date().getTime() - startTime);
        return Data.register(data).done(doneFn).fail(failFn);
      })
    }
    init();

});
