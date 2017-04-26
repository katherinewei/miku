/**
 * Created by xiuxiu on 2016/10/13.
 */

require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/common/countDown',
    'h5/js/common/weixin',
    'h5/js/common'
], function($,URL, Data, CountDown,WeiXin,Common) {

    var count_down_time = 0,
        Page,
        qrUuid = pageConfig.qrUuid,
        subscribeWx=pageConfig.subscribeWx,//微信关注状态
        isQrLogin=pageConfig.isQrLogin;//账号登录状态
    function init() {

        $('.waitting').hide();
        Common.headerHtml('九研美尚');

        var mainPage = '<section class="inviteSP"><div class="banner"><img src="' + URL.imgPath + 'website/pc/images/9labmobile.png"><p>欢迎您加入九研美尚</p> </div> <div class="makeMoneyWrap"> <div class="inputBox grid"><div class="row mobileRow"><div class="col"><input type="tel" class="mobile" placeholder="请输入手机号" maxlength="11"/></div> </div><div class="row imgVerCode"><div class="col col-15 fb far fvc"><input class="imgvercodeI" type="tel" placeholder="请输入图中验证码获取短信验证码" maxlength="4"></div><div class="col col-7 fb fvc"><div class="imgVeC ml-05"><img src="' + URL.getMobileVerificationCode + '"/></div></div></div> <div class="row verCodeRow"><div class="col col-15 fb far fvc "><input class="vercode" type="tel" placeholder="请输入4位验证码" maxlength="4"></div> <div class="col col-10 "><span class="sendvercode">获取验证码</span></div></div><div class="row"><div class="col"><input type="submit" class="btn submit" value="确认登录"/></div> </div></div> </div></section>';
        Page = $(mainPage).appendTo('body');

        //判断状态
            if(subscribeWx==1 && isQrLogin==1){//已登录已关注
                URL.assign(URL.qrCodeLoginTipPage+'?qrUuid='+qrUuid);
            }else if(isQrLogin==0 && subscribeWx==0){//未登录未关注
                $('body').show();
            }else if(isQrLogin==1 && subscribeWx==0){//已登录未关注
                window.location.href='http://mp.weixin.qq.com/s?__biz=MzI1OTQwNzg3Mg==&tempkey=GvADbeLTBB5FXtwe6coLnjQJnwuADAH%2Ff53%2BtLtCeVfjlDh9%2B1tZf7b1NbbIgRKMgHEmxML8eSVlSFk1732AcLupS4kVxIZN5DSg3WXHpoDYKN08lXsHfNl604nrgx51Pph6yY579d5zJzO%2B%2FxBswA%3D%3D&chksm=6a7828745d0fa162a5e580ff43a9f4c0bc7e9195ffe4bdc5505285bc530ed8d7238d9cbd427e&scene=0&previewkey=YhjBrjwExEDFddG1OLe11MNS9bJajjJKzz%252F0By7ITJA%253D#wechat_redirect';
            }else if(isQrLogin==0 && subscribeWx==1){
                $('body').show();
            }

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
                qrUuid: pageConfig.qrUuid
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
                btn.val('登录成功');

                if(subscribeWx==1){
                    URL.assign(URL.qrCodeLoginTipPage+'?qrUuid='+qrUuid);
                }else{
                    window.location.href='http://mp.weixin.qq.com/s?__biz=MzI1OTQwNzg3Mg==&tempkey=GvADbeLTBB5FXtwe6coLnjQJnwuADAH%2Ff53%2BtLtCeVfjlDh9%2B1tZf7b1NbbIgRKMgHEmxML8eSVlSFk1732AcLupS4kVxIZN5DSg3WXHpoDYKN08lXsHfNl604nrgx51Pph6yY579d5zJzO%2B%2FxBswA%3D%3D&chksm=6a7828745d0fa162a5e580ff43a9f4c0bc7e9195ffe4bdc5505285bc530ed8d7238d9cbd427e&scene=0&previewkey=YhjBrjwExEDFddG1OLe11MNS9bJajjJKzz%252F0By7ITJA%253D#wechat_redirect';
                }
            },
            failFn = function () {
                btn.removeClass('disable').val('重新登录');
            }
        Common.statistics('login', 'sendcode', 'success', new Date().getTime() - startTime);


        return Data.vCodeLogin(data).done(doneFn).fail(failFn);
    }


    init();

})
