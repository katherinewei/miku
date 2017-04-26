/**
 * 幸运抽奖-领奖列表
 * Created by Spades-k on 2015/12/25.
 */


require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/nexter',
    'h5/js/common/weixin'
], function($, URL, Data, Common, Nexter, WeiXin) {

    var Page;

    function init() {

        render();

    }

    function render() {
        Common.headerHtml('领奖');
        var template = '<section class="page-content"><div class="lottery-list"><ul class="list"></ul></div></section>';

        Page = $(template).appendTo('body');

        renderListNexter();

        bindEvent();

        weiXinShare();

    }


    //加载领奖列表
    function renderListNexter() {
        var element = $('.lottery-list'),
            wrapTemplate = element.find('ul');
            html = [],
            notHasData = '<li class="not-has-goods-msg"><i class="icon-ally-null"></i><p>您暂时还没有抽中奖品，快去抽奖吧！</p><a href="' + URL.myInviteAlly + '">去获取抽奖机会</a></li>';

        new Nexter({
            element: element,
            dataSource: Data.itemLotteryDrawList,
            pageSize: 10,
            enableScrollLoad: true
        }).load().on('load:success', function (res) {
            console.log(res);

            if (res.rewards) {

                $.each(res.rewards, function (index, item) {

                    if(item.value == 0) {

                        if (item.pics) {
                            item.pic = item.pics.split(';')[0];
                        }


                        item.param = encodeURIComponent(item.destination + ',1');

                        html.push(htmlItems(item));
                    }
                });

                if(html.join('')) {
                    wrapTemplate.append(html.join(''));
                } else {
                    wrapTemplate.html(notHasData);
                }

            } else {
                wrapTemplate.html(notHasData);
            }
        }).render();


    }


    function htmlItems(item) {

        var template = '<li class="media"><div class="media-left"><a href="' + URL.goodsDetail + '?gid={{destination}}"><img class="media-object" src="{{pic}}" alt="..."></a></div><div class="media-body"><h4 class="media-heading" href="' + URL.goodsDetail + '?gid={{destination}}">{{itemTitle}}</h4><a class="btn-receive" href="'+URL.lotteryOrder + '?from=cart&goods={{param}}">立即领奖></a></div></li>';

        return bainx.tpl(template, item);

    }

    //分享
    function weiXinShare() {
        if (Common.inWeixin) {
            console.log(document.title);
            var inQuestion = location.href.match(/\?/i);

            var shareUrl = URL.site + URL.lottery+'?pUserId='+pageConfig.pid+'&isShare=1',
                shareImgUrl = URL.imgPath + '/game/lottery/wxpic.png',
                desc = '邀请好友米酷一起玩耍吧~，积分，年货大礼包，护肤礼包，送不停~~~',
                shareOption = {
                    title: '快来米酷,玩幸运抽奖吧~', // 分享标题
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

    function bindEvent() {
        Page.on('tap', '.btn-share', function(event) {
            event.preventDefault();
            if (Common.inWeixin) {
                Common.shareTips('.content', 0, 0);
            } else {
                alert('请在微信中打开');
            }
        });

    }

    init();

});
