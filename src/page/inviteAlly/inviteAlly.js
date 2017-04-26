/**
 * 邀请粉丝
 */
require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/transDialog',
    'h5/js/common/weixin'
], function ($, URL, Data, Common, Dialog, WeiXin) {
    //初始化
    var InviteQrcode,
        Page,
        shareTips;
    $('.waitting').hide();
    function init() {
         render();
        weiXinShare();

    }

    //生成页面
    function render() {
        //header template
        Common.headerHtml('邀请粉丝');

        //邀请
        var invite = '<div class="page-content"><div class="grid page-invite clearfix"><div class="row item-wrap straInvite"> <div class="col col-8 icon-wrap fb fvc fac"><span class="icon fvc fac icon-invite"></span></div> <div class="col col-17 fb fvc pl-10"><div class="text-wrap"><h3 ><span class="title">直接邀请</span></h3> <p>通过分享到微信好友、朋友圈或复制链接等渠道，好友通过链接成功购买礼包后即可成为你的粉丝。</p> </div></div></div><div class="row item-wrap ewmInvite"><div class="col col-8 icon-wrap fb fvc fac"><span class="icon icon-invite-qrcode"></span> </div><div class="col col-17 fb fvc pl-10"><div class="text-wrap "><h3><span class="title">二维码邀请</span></h3> <p>自动生成你专属的邀请二维码，通过截屏的方式获取二维码图片，将图片分享到微信好友、朋友圈等渠道，好友通过识别二维码，成功购买礼包后即可成为你的粉丝。</p></div></div></div></div></div>';
        Page = $(invite).appendTo('body');
        Page.on('tap', '.straInvite', function (event) {
            event.preventDefault();
            Common.shareTips('.page-content', 500, 700);
        }).on('tap', '.ewmInvite', function () {
            URL.assign(URL.myInviteAllyQr + '?type=1');
        })
    }

    function weiXinShare() {
        if (Common.inWeixin) {
            console.log(document.title);
            var inQuestion = location.href.match(/\?/i);

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


