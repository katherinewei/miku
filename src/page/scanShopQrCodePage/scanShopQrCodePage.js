/**
 * Created by xiuxiu on 2016/10/13.
 */

require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/page/createIMSingle',
    'h5/js/common/countDown',
    'h5/js/common/weixin',
    'h5/js/common'
], function($,URL, Data,CreateIMSingle, CountDown,WeiXin,Common) {

//推广  -----加入九妍
    var count_down_time = 0,
        shopId = URL.param.shopId,
        Page,
        startConsult = false;

    function init() {

            $('.waitting').hide();
            var mainPage = '<section class="inviteSP"><div class="banner"><img src="' + URL.imgPath + 'website/pc/images/9labmobile.png"><p>欢迎您加入9LAB</p> </div> <div class="makeMoneyWrap"> <div class="inputBox grid"><div class="row mobileRow"><div class="col"><input type="tel" class="mobile" placeholder="请输入手机号" maxlength="11"/></div> </div><div class="row imgVerCode"><div class="col col-15 fb far fvc"><input class="imgvercodeI" type="tel" placeholder="请输入图中验证码获取短信验证码" maxlength="4"></div><div class="col col-7 fb fvc"><div class="imgVeC ml-05"><img src="' + URL.getMobileVerificationCode + '"/></div></div></div> <div class="row verCodeRow"><div class="col col-15 fb far fvc "><input class="vercode" type="tel" placeholder="请输入4位验证码" maxlength="4"></div> <div class="col col-10 "><span class="sendvercode">获取验证码</span></div></div><div class="row"><div class="col"><input type="submit" class="btn submit" value="加入9LAB"/></div> </div></div> </div></section>';
            Page = $(mainPage).appendTo('body');
            bindEvents(Page);
    }

    function bindEvents(page) {
        page.on('tap', '.imgVerCode img', function () {
            $(this).attr('src', URL.getMobileVerificationCode + '?r=' + Math.random());
        }).on('tap', '.sendvercode', function (event) {
            event.preventDefault();
            if (count_down_time == 0) {
                sendVerCode(page, $(this));
            }
        }).on('tap', '.submit', function (event) {
            event.preventDefault();
            submit(page, $(this));
        });
    }


    function startCountDown(btn) {
        (new CountDown({
            time: 60,
            change: function () {
                count_down_time = this.time;
                btn.text(this.time + '秒');
                return this;
            },
            end: function () {
                btn.text('发送验证码').removeClass('disable');
                return this;
            }
        })).start();
    }

    function sendVerCode(page, btn) {

        var mobile = $('.mobile', page),
            vmobile = $.trim(mobile.val()),
            yzmNO = $('.imgvercodeI', page),
            vyzmNO = $.trim(yzmNO.val());

        if (!vmobile) {
            bainx.broadcast(mobile.attr('placeholder'));
            return false;
        } else if (!/^[\d]{11}$/gi.test(vmobile)) {
            bainx.broadcast('请输入正确的手机号码！');
            return false;
        }
        else if (!vyzmNO) {
            bainx.broadcast(yzmNO.attr('placeholder'));
            return false;
        }

        var doneFn = function (res) {
                btn.addClass('disable').text('60秒');
                startCountDown(btn);
            },
            failFn = function (code, json) {
                setTimeout(function () {
                    if (code === 7) {
                        btn.removeClass('disable').text('发送验证码');
                    } else {
                        btn.removeClass('disable').text('重新发送');
                    }
                }, 1000);
            };

        Common.statistics('login', 'sendcode', 'invoke', 1);


        btn.addClass('disable').text('正在处理..');
        return Data.checkMobile(vmobile, vyzmNO).done(doneFn).fail(failFn);
    }

    var startTime = new Date().getTime();

    function submit(page, btn) {
        var mobile = $('.mobile', page),
            vercode = $('.vercode', page),
            data = {
                mobile: $.trim(mobile.val()),
                checkNO: $.trim(vercode.val()),
                shopId: shopId
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

        btn.addClass('disable').text('用户登录中.');

        var doneFn = function (res) {
                btn.text('加入成功');
                //URL.assign(URL.receiveInviteSpreadMangerPage + '?mobile=' + data.mobile + '&parentId=' +  pageConfig.pid);

                var status = res.status;            //status(0=未注册；1=已注册；2=注册成功)
                resultPage(status, res.isAgency);
                CreateIMSingle(doneAfter, true);
            },
            failFn = function () {
                btn.removeClass('disable').text('重新登录');
            },
            doneAfter = function () {

            };
        Common.statistics('login', 'sendcode', 'success', new Date().getTime() - startTime);


        return Data.loginByShop(data).done(doneFn).fail(failFn);
    }

//结果处理
    function resultPage() {
        //$('.inviteSP').remove();
        var openid = pageConfig.openid;
        startConsult = true;
        alert(openid);
        $('.t_record .m_record').addClass('joined');
        var btn = ' <span class="btn" href="http://mp.weixin.qq.com/s?__biz=MzA5NjQ4MDQ3Nw==&mid=400607662&idx=1&sn=104bb3cf79486a71e6484fc2f54872e2&scene=0#wechat_redirect">关注九妍美尚</span>';
        $('.inviteSP').html('<div class="banner"><img src="' + URL.imgPath + 'website/pc/images/9labmobile.png"><p>恭喜您，已成功加入9LAB</p><p class="tips">小9提示：您尚未关注九妍美尚，无法体验个人专属定制体验服务哟~</p> </div> <div class="btnGroup">' + btn + '<span class="consult" href="' + Common.downloadLink +'"> 下载九妍美尚</span></div>');
        Data.checkAttention(openid).done(function (res) {

            if (res.subscribe == 1) {
                //btn = ' <span class="btn" href="'+Common.downloadLink+'">下载九妍美尚</span>'
                $('.btnGroup .btn').text('立即体验定制服务').attr('href', URL.anonymousChatPage + '?loginentrance=3');
                $('.tips').text('小9提示：个人专属定制体验服务已为您准备好了哟~').attr('href', Common.downloadLink);
            }

        })
    }

    init();

})
