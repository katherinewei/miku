/**
 * 二维码邀请
 */
require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/weixin',
], function ($, URL, Data, Common, WeiXin) {
    //初始化
    // $('.waitting').hide();
    var Page;

    function init() {

        render();


    }

    //生成页面
    function render() {
        //header
        Common.headerHtml('二维码邀请');
        var urlQr = URL.site + URL.inviteSpreadMangerPage + '?pUserId=' + pageConfig.pid + '&isShare=1',
            template = '<div class="Page_wrap"><img id="firstImg" src="' + URL.imgPath + '/common/images/bg_invite1.png" /><img src="' + URL.imgPath + '/common/images/bg_invite2.png" /><img src="' + URL.imgPath + '/common/images/bg_invite3.png" /><img src="' + URL.imgPath + '/common/images/bg_invite4.png" /> <div class="page-invite-qrcode"><div class="qrcode-wrap"> <img src="'+URL.qrUrl + encodeURIComponent(urlQr) + '" alt=""></div><p class="text"><span class="title"></span><br/><span class="level"></span><br/>我在这里等你<br/>长按二维码识别或扫码进入</p></div></div>';
        Page = $(template).appendTo('body');

        document.getElementById('firstImg').onload = function(){
            $('.page-invite-qrcode').css('margin-top',$('#firstImg').height());
        }

        Data.fetchMineInfo().done(function (userInfo) {
            $('.title').text('我是'+userInfo.mobile);
            $('.level').text('我是米酷' + userInfo.agencyLevelName);

            weiXinShare();

        });

        if(URL.param.type == 1){
            $('.header').show();
            $('.Page_wrap').css('padding-top','45px');
            document.getElementById('firstImg').onload = function(){
                $('.page-invite-qrcode').css('margin-top',$('#firstImg').height() + 45);
            }
        }else{
            $('.header').hide();
        }
    }
    function weiXinShare() {
        if (Common.inWeixin) {
            var shareUrl = URL.site + URL.inviteSpreadMangerPage+ '?pUserId=' + pageConfig.pid+'&isShare=1',
                shareImgUrl = URL.imgPath + 'common/images/qr_share.png',
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