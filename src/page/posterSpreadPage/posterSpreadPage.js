
/**
 * 海报邀请
 */
require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/weixin',
], function ($, URL, Data, Common, WeiXin) {
    //初始化
     $('.waitting').hide();
    var Page;

    function init() {

        render();

        weiXinShare();

    }


    //生成页面
    function render() {
        //header
        Common.headerHtml('海报推广');
        var template = '<div class="Page_wrap"><img id="firstImg" src="'+imgPath+'common/images/bg_poster1.png" /><img src="'+imgPath+'common/images/bg_poster2.png" /><img src="'+imgPath+'common/images/bg_poster3.png" /><img class="bottomImg fixedB" src="'+imgPath+'common/images/bg_poster4.png" /> <div class="page-invite-qrcode"></div></div>';
        Page = $(template).appendTo('body');

        //屏幕高度小于480并且不是在ios app上的
        if($(window).height() < 480 && navigator.userAgent.indexOf("welink") < 0){
            $('.bottomImg').removeClass('fixedB');
        }

        //二维码邀请
        var urlQr = URL.site + URL.index + '?pUserId=' + pageConfig.pid + '&isShare=1';
        var inviteQr = ' <div class="qrcode-wrap"><img  src="http://miku.unesmall.com//api/m/1.0/qrUrl.json?url=' + encodeURIComponent(urlQr)+'" alt=""/> </div><p class="text">长按二维码识别或扫码进入</p>';
        Page = $(inviteQr).appendTo('.page-invite-qrcode');

        document.getElementById('firstImg').onload = function(){
            $('.page-invite-qrcode').css('margin-top',$('#firstImg').height());
        }
        if(URL.param.type == 1){
            $('.header').show();
            $('.Page_wrap').css('padding-top','45px');
            document.getElementById('firstImg').onload = function(){
                $('.page-invite-qrcode').css('margin-top',$('#firstImg').height()+45);
            }
        }else{
            $('.header').hide();
        }
    }

    function weiXinShare() {
        if (Common.inWeixin) {

            var shareUrl = URL.site + URL.index + '?pUserId=' + pageConfig.pid+'&isShare=1',
                shareImgUrl = URL.imgPath + 'common/images/poster_share.png',
                desc = $('.text').text(),
                shareOption = {
                    title: '快来米酷一起玩耍吧～', // 分享标题
                    desc: desc, // 分享描述
                    link: shareUrl, // 分享链接
                    type: 'link', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    imgUrl: shareImgUrl // 分享图标
                },
                shareOptionTimeline = {
                    title: desc, // 分享标题
                    link: shareUrl, // 分享链接
                    imgUrl: shareImgUrl // 分享图标
                };
            WeiXin.showMenuItems();
            WeiXin.share(shareOption, shareOptionTimeline);
        }

    }

    init();
})