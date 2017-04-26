/**
 * 营销推广
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
    var Page;
    $('.waitting').hide();
    function init() {
         render();
        //weiXinShare();

    }

    //生成页面
    function render() {
        //header template
        Common.headerHtml('营销推广');
        //邀请
        var invite = '<div class="page-content"><div class="grid page-invite clearfix"><div class="row item-wrap straInvite" id="straInvite"> <div class="col col-8 icon-wrap fb fvc fac"><span class="icon fvc fac icon-invite"></span></div> <div class="col col-17 fb fvc pl-10"><div class="text-wrap "><h3 class=""><span class="title">米酷爆款推荐</span></h3> <p>精选各种高利润、高回报、高销量的热销爆款，让你受益丰盛！更为你提供专业文案、精美图片素材，动动手指即可下载转发，让你推广轻松又精彩！</p> </div></div></div><div class="row item-wrap ewmInvite"><div class="col fb fvc fac col-8 icon-wrap"><span class="icon icon-invite-qrcode"></span> </div><div class="col col-17 fb fvc pl-10"><div class="text-wrap "><h3 class=""><span class="title">海报推广</span></h3> <p>平台自动生成你专属的商城二维码，进入后通过截屏或者保存图片的方式获取二维码图片，将图片分享到微信好友、朋友圈等渠道，好友进入商城成功购买任何产品，你就可以获得相应的推广奖励。</p></div></div></div></div></div><section class="telDialog wl-trans-dialog translate-viewport" style="display: none;"><div class="cont bounceIn"><p>米酷APP专属功能，请下载APP</p><div class="btngroup"><span class="btn reset">取消</span> <span href="' + Common.downloadLink + '"  class="btn ring">下载APP</span></div></div></section>';
        Page = $(invite).appendTo('body');

        if(URL.param.type == '1'){
            $('.header').show();
            Page.on('tap', '.straInvite', function (event) {
                event.preventDefault();
               // Common.shareTips('.page-content', 500, 700);
                $('.telDialog').show();
            }).on('tap', '.ewmInvite', function () {
                document.location = URL.posterSpreadPage + '?type=1';
            }).on('tap', '.reset', function () {
                $('.telDialog').hide();
            })
        }else{
            $('.header').hide();
            $('.page-content').css({'padding':'0'});
            Page.on('tap', '.straInvite', function (event) {
                event.preventDefault();
               URL.assign(URL.marketSpreadPage+'?app=1');
            }).on('tap', '.ewmInvite', function () {
                if(Common.isAndroid){
                    URL.assign(URL.posterSpreadPage);
                }
                if(Common.isIPhone){
                    URL.assign(URL.marketSpreadPage+'?app=2');
                }

            })

        }

    }


    function weiXinShare() {
        if (Common.inWeixin) {
            console.log(document.title);
            var inQuestion = location.href.match(/\?/i);

            var shareUrl = URL.site + URL.redPacketHtm + '?pUserId=' + pageConfig.pid+'&isShare=1',
                shareImgUrl = URL.imgPath + 'common/images/redPack_share.png',
                desc = '米酷分发福利咯，亲们快进来拆红包啦！',
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


