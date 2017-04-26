/**
 * 邀请成为推广经理
 */


require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/countDown',
    'h5/js/common/weixin',
], function ($, URL, Data, Common, CountDown,WeiXin) {
    var Page,
        count_down_time = 0,
        pUseId=URL.param.pUseId,
        giftURL = URL.buyForJoinAgencyPage + '?type=1&pUserId=' + URL.param.pUserId + '&isShare=1';
    $('.waitting').hide();
    weiXinShare();
    function init() {
        ///render();
        if (pageConfig && pageConfig.pid){             //已登录
            Data.fetchMineInfo().done(function(res){
                if(res.isAgency == 0){          //不是代理
                    render();
                    resultPage(1,0);
                }else{

                    render();
                    resultPage(1,1);
                }
            })
        }else{          //未登录
            render();
        }
    }
    function render() {
        //header
        var mainPage = '<section class="inviteSP page-content"><div class="banner"><img src="' + URL.imgPath + '/common/images/bg_invite5.png"> </div> <div class="makeMoneyWrap"> <div class="inputBox grid"><div class="row mobileRow"><div class="col"><input type="tel" class="mobile" placeholder="请输入手机号" /></div> </div> <div class="row verCodeRow"><div class="col col-15 fb far fvc "><input class="vercode" type="tel" placeholder="请输入4位验证码" maxlength="4"></div> <div class="col col-10 "><div class="sendvercode">发送验证码</div></div></div><div class="row"><div class="col"><input type="submit" class="btn submit" value="加入米酷"/></div> </div></div> <article><div class="boxContent"><h4><span>米酷推广经理特权</span></h4><div class="list"> <div class="grid"> <dl class="row"><dt class="col col-6"><div class="round"><img src="'+URL.imgPath+'/common/images/icon_power2.png"/> </div></dt><dd class="col col-18"><h3>平台代理权</h3> <p>享受米酷平台上百万款热销产品的代理权，推广销售即可获得高额奖励</p> </dd> </dl> </div><div class="grid"><dl class="row"><dt class="col col-6"><div class="round"><img src="'+URL.imgPath+'/common/images/icon_power3.png"/></div></dt> <dd class="col col-18"><h3>推广拿高额奖励</h3><p>每成功推荐一位好友成为推广经理，或推广销售平台上的任何产品，都可获得高额奖励</p> </dd></dl></div> <div class="grid"><dl class="row"><dt class="col col-6"><div class="round"><img src="'+URL.imgPath+'/common/images/icon_power4.png"/></div></dt><dd class="col col-18"><h3>自购拿返利</h3><p>自己购买平台上的任何产品，都可获得高额返利。</p></dd></dl></div><div class="grid"> <dl class="row"><dt class="col col-6"><div class="round"><img src="'+URL.imgPath+'/common/images/icon_power1.png"/></div></dt><dd class="col col-18"><h3>轻松享受一键式营销</h3> <p>吸睛营销方案公司提供，只需动动手指， 就能坐等推广费进兜。</p> </dd> </dl> </div></div></div> </article></div></section>';
        Page = $(mainPage).appendTo('body');

        bindEvents(Page);
    }

    function bindEvents(page) {
        page.on('keyup','.mobile',function(){
            getImgVerCode($(this).val());
        }).on('tap','.imgVerCode img',function(){
            $(this).attr('src',URL.getMobileVerificationCode+'?mobile='+$('.mobile').val()+'&r='+Math.random());
        }).on('tap', '.sendvercode', function(event){

            event.preventDefault();
            if(count_down_time == 0){
                sendVerCode(page, $(this));
            }

        }).on('tap', '.submit', function (event) {
            event.preventDefault();

            submit(page, $(this));

        });


    }


    //获取图片验证码
    function getImgVerCode(vmobile){
        if (/^[\d]{11}$/gi.test(vmobile) && $('.imgVerCode').length == 0){
            $('.mobileRow').after('<div class="row imgVerCode"><div class="col col-15"><input class="imgvercodeI tc pd-10" type="tel" placeholder="请输入图中验证码获取短信验证码" maxlength="4"></div><div class="col col-7 fb fvc"><div class="imgVeC ml-05"><img src="'+URL.getMobileVerificationCode+'?mobile='+vmobile+'"/></div></div></div>');
        }else{
            $('.imgVerCode').remove();
        }
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
        else if(!vyzmNO){
            bainx.broadcast(yzmNO.attr('placeholder'));
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
        return Data.checkMobile(vmobile,vyzmNO).done(doneFn).fail(failFn);
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

        btn.addClass('disable').text('用户登录中.');

        var doneFn = function(res) {
                btn.text('加入成功');
                //URL.assign(URL.receiveInviteSpreadMangerPage + '?mobile=' + data.mobile + '&parentId=' +  pageConfig.pid);

                var status = res.status;            //status(0=未注册；1=已注册；2=注册成功)
                resultPage(status,res.isAgency);
            },
            failFn = function() {
                btn.removeClass('disable').text('重新登录');
            };
        Common.statistics('login', 'sendcode', 'success', new Date().getTime() - startTime);


        return Data.login(data).done(doneFn).fail(failFn);
    }

    //结果处理
    function resultPage(status,isAgency){
        $('.inputBox').remove();
        $('.banner').addClass('receivePage').html('<p class="text"></p><a class="btn"></a>');
        switch (status) {
            case 1:           //已注册
                if(isAgency == 1) {     //是代理
                    Common.isParentUserShow();
                    $('.banner .text').text("感谢您关注米酷,您已经是米酷推广经理了,赶紧下载APP进行推广吧!")
                }else{              //不是代理
                    $('.banner .text').text("感谢您关注米酷,赶紧购买创业礼包,成为推广经理,开启赚钱模式吧!");

                        $('.banner .text').after('<a href="' + giftURL + '">马上购买礼包</a>');//只有在微信中才显示

                    //URL.assign(giftURL);
                }
               $('.btn').text("下载米酷APP").attr("href", Common.downloadLink);
                break;
            case 2:               //注册成功
                    Common.isParentUserShow();
                    $('.banner .text').text("恭喜你成功注册米酷,赶紧购买创业礼包,成为推广经理,开启赚钱模式吧!");
                    $('.btn').text("下载米酷APP").attr("href", Common.downloadLink);
                    $('.banner .text').after('<a  href="'+giftURL+'">马上购买礼包</a>');
                break;
            default:
                break;
        }
    }

    function weiXinShare() {
        if (Common.inWeixin) {

            var shareUrl = URL.site + URL.inviteSpreadMangerPage + '?pUserId=' + pageConfig.pid+'&isShare=1',
                shareImgUrl = URL.imgPath + 'common/images/straInvite_share.png',
                desc = '上米酷，人人都是CEO！无忧生活从这一刻开始',
                shareOption = {
                    title: '米酷', // 分享标题
                    desc: desc,// 分享描述
                    link: shareUrl,
                    type: 'link', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    imgUrl: shareImgUrl, // 分享图标
                },
                shareOptionTimeline = {
                    title: desc, // 分享标题
                    link: shareUrl, // 分享链接
                    imgUrl: shareImgUrl // 分享图标
                };

            WeiXin.hideMenuItems();
            WeiXin.showMenuItems();
            WeiXin.share(shareOption, shareOptionTimeline);
        }

    }
    init();

});
