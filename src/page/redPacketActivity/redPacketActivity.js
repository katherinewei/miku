/**
 * 红包活动
 * Created by Spades-k on 2015/12/16.
 */

require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/weixin'
], function($, URL, Data, Common, WeiXin) {

    var Page;

    function init() {

        render();



    }

    function render() {
        var template = '<section ><div class="content"><img src="'+imgPath+'active/images/red_packets.jpg" alt=""><a class="btn-receive"></a><a class="btn-share"></a></div></section>';

        Page = $(template).appendTo('body');

        $('.waitting').hide();
        bindEvent();

        weiXinShare();

    }

    function bindEvent() {
        Page.on('tap', '.btn-receive', function(event) {
            event.preventDefault();
            location.href = URL.redPacketHtm;
        }).on('tap', '.btn-share', function(event) {
            event.preventDefault();
            if (Common.inWeixin) {
                Common.shareTips('.content', 0, 0);
            } else {
                alert('请在微信中打开');
            }
        });
    }


    //分享
    function weiXinShare() {
        if (Common.inWeixin) {
            console.log(document.title);
            var inQuestion = location.href.match(/\?/i);

            var shareUrl = URL.site + URL.redPacketHtm + '?pid=' + pageConfig.pid+'&isShare=1',
                shareImgUrl = URL.imgPath + 'common/images/invite-redpag.png',
                desc = '米酷发福利啦，亲们快快进来领红包吧！',
                shareOption = {
                    title: '米酷', // 分享标题
                    desc: desc, // 分享描述
                    link: shareUrl, // 分享链接
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
