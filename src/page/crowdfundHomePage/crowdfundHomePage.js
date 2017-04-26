/**
 * 众筹
 * Created by xiuxiu on 2016/2/16.
 */
require([
    'jquery',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/loadImage',
    'h5/js/common/nexter',
    'h5/js/common/goods',
    'h5/js/common/cart',
    'h5/js/common/weixin',
    'h5/js/common/url',
    'h5/js/common/banner',
], function ($, Data, Common,LoadImage, Nexter,  Goods, Cart, WeiXin, URL,Banner) {

    var Page,
        list,
        pUserId = URL.param.pUserId;

    function init() {

        render();

    }

    function weiXinShare(shareUrl,shareImgUrl,desc){
        if(Common.inWeixin){


            //var shareUrl = (inQuestion ? location.href+'&mid='+pageConfig.pid : location.href+'?pid='+pageConfig.pid),
            //    shareImgUrl = URL.imgPath + 'common/images/share-miku.png',
                var shareOption = {
                    title:'米酷乐享团干货', // 分享标题
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

            WeiXin.hideMenuItems();
            WeiXin.showMenuItems();
            WeiXin.share(shareOption, shareOptionTimeline);
        }
    }


    function render() {
        Common.isLogin && Cart.ready(); //获取购物车总数

        Common.headerHtml('乐享团');

        Page = $('<section id="indexPage"><div class="scroll-content"><div class="banner pic-carousel" id="banner" data-banner="418"><div class="carousel-outer"><ul class="carousel-wrap"></ul></div><div class="carousel-status"></div></div><div class="cate-nav grid"></div><div class="title-content"><div class="tit-content-left">每日推荐</div><!--<div class="tit-content-right">换一批</div>--></div><div class="page-panel"><ul class="goods-list grid"></ul></div></div></section>').appendTo('body');

        bindEvents();

        renderBanner();
        var shareUrl = URL.site + URL.crowdfundHomePage+'?pUserId='+pageConfig.pid+'&isShare=1',
            shareImgUrl = URL.imgPath + 'common/images/share-miku.png',
            desc = '正在乐享团中，好货分享给大家~!';
        weiXinShare(shareUrl,shareImgUrl,desc);

    }

    function renderBanner(){
        var ids = [];
        Page.find('[data-banner]').each(function() {
            ids.push($(this).data('banner'));
        });

        Data.crowdfundBanner(ids,3).done(function(res) {

            console.log(res);

            //渲染页面banner位置
            if ($.isPlainObject(res.banners)) {
                $.each(res.banners, function(key, banners) {
                    switch (key) {
                        case '418': //顶部活动位
                            var template = '<li class="{{className}} addHrefParm" href="{{href}}" ><img src="{{img}}" class="lazyimg" ></li>',
                                html = ['<div class="carousel-status"><ul></ul></div><div class="slider-outer"><ul class="clearfix slider-wrap">'],
                                target = Page.find('.banner');

                            banners.forEach(function(item, index) {
                                html.push((new Banner(item)).html(template));
                            });
                            var len = banners.length;

                            html.push('</ul></div>');
                            target.html(html.join('')).show();
                            if (len > 1) {
                                require('slider', function (Slider) {
                                    Slider({
                                        slideCell: "#banner",
                                        titCell: ".carousel-status ul",
                                        mainCell: ".slider-outer ul",
                                        effect: "leftLoop",
                                        autoPlay: true,
                                        autoPage: true,
                                        switchLoad: "_src"
                                    });
                                })
                            }
                            if($('.carousel-wrap').find('li').length == 1){
                                $('.carousel-status').hide();
                            }
                            break;
                        default:
                            break;
                    }
                });
            }
        });

        //导航
        var menu = [
                {
                    title: '新品上市',
                    url: URL.crowdfundListPage + '?orderColumn=2',
                    picUrl: '1',
                    className:'newProduct'
                },
                {
                    title: '排行榜',
                    url: URL.crowdfundListPage + '?orderColumn=3',
                    picUrl: '2',
                    className:'rank'
                },
                {
                    title: '我的项目',
                    url: URL.mineCrowdfundPage,
                    picUrl: '3',
                    className:''
                }
            ],
            cateContainer = '<ul class="cate-nav-ul clearfix "></ul>',
        template = '<li class="cate-nav-li {{className}}" href="{{url}}"><div class="cate-li-img"><img src="' + URL.imgPath + '/common/images/raise_icon{{picUrl}}.png"></div><div class="cate-li-tit">{{title}}</div></li>',
            html = [];
        $('.cate-nav').append(cateContainer);
        $.each(menu, function (index, item) {
            html.push(bainx.tpl(template, item));
        });
        $('.cate-nav-ul').append(html.join(''));


        //众筹列表
        renderNexter();

    }

    //
    function renderNexter(orderColumn) {
        var element = $('#indexPage');


            var nexter = new Nexter({
                element: element,
                dataSource: Data.getCrowdfundList,
                enableScrollLoad: true,
                data:{
                    orderColumn:orderColumn,
                    status:0,
                    sortType:2
                }
            }).load().on('load:success', function(res) {
                var html=[];
                nowTime = res.nowDate;
                if (res.list.length) {
                    $.each(res.list, function (index, item) {
                        html.push(htmlItems(item));
                    });
                    this.$('.page-panel ul').append(html.join(''));
                    $('.page-panel ul li').each(function(){
                        var outW = $(this).find('.progress').width(),
                            innerW = $(this).find('.progressBar').width();
                        if(outW - innerW < 28){
                            $(this).find('.progressBar').children('i').css('right','0px');
                        }
                    })
                    LoadImage(element);
                } else if (this.get('pageIndex') == 0) {
                    this.$('.page-panel ul').html('<li class="notData"><img src="'+URL.imgPath+'/common/images/loading_fail.png"/><p>灰常抱歉，暂时没有数据哦</p></li>');
                }
            }).render();


        var sid,
                scrollEventHandle = function(event) {
                    event.preventDefault();
                    clearTimeout(sid);
                    sid = setTimeout(function() {
                        LoadImage(element);
                    }, 0);
                }
            Page.on('scroll', scrollEventHandle);
    }

    function hasDot(num) {              //判断是否有小数
        if (!isNaN(num)) {
            return ((num + '').indexOf('.') != -1) ? true : false;
        }
    }

    function moneyString(money) {           //如果没有小数，去掉。

        var Price = parseFloat((money / 100).toFixed(2));

        return (isNaN(money)  ? 0 : (hasDot(Price) ? Price.toFixed(2) : parseInt(Price)));
    }



    function htmlItems(item) {
        var template = '<li class="row" data-id="{{id}}" ><div class="thumb" href="' + URL.crowdfundInfoPage + '?crowdfundId={{id}}"><img data-lazyload-src="{{listimg}}" /></div><div class="col col-17 "><div href="' + URL.crowdfundInfoPage + '?crowdfundId={{id}}"><div class="pb-05 goodsname ellipsis" ><span >{{title}}</span></div><div class="decs grid"><div class="progress"><div class="progressBar" style="width: {{progressBar}}%;"><i>{{progressBarNum}}%</i></div> </div> <div class=" row supportDetail"><p class="Moneyed col col-50 "><b>{{totalFee}}</b>已筹金额</p><p class="totleMoney col col-50  far fvc"><b>{{targetAmount}}</b>目标金额</p></div><div class="row supportNum"><div class="col col-50"><i class="supported"></i>{{soldNum}}人支持</div><div class="col col-50 timeO "><i class="time"></i>{{time}}</div> </div> </div></div><div class="icon_share">分享</div> </div> </li>',
            thumbsHtml = [];
        item.targetAmount =moneyString(item.targetAmount);
        item.totalFee = moneyString(item.totalFee);
        item.time =  Common.Crowdfund(item.startTime,item.endTime);
        item.progressBar = ((item.totalFee / item.targetAmount)*100).toFixed(0);
        item.progressBarNum = item.progressBar;
        (item.progressBar > 100) ? item.progressBar = 100 : item.progressBar;

        if (item.picUrls && typeof item.picUrls == 'string') {
            item.picUrls = item.picUrls.split(';');
        }
        if ($.isArray(item.picUrls) && item.picUrls.length) {

            var img = item.picUrls[0],
                isJpg = /\.jpg/gi.test(img);
            item.listimg = img + (isJpg ? '!300q75' : '');
        }
        return bainx.tpl(template, item);

    }

    function bindEvents() {
        Page.on('tap','.icon_share',function(e){
            e.preventDefault();
            Common.shareTips('#indexPage', 0, 0);

            var   cid = $(this).parents('li').data('id'),
                  shareUrl = URL.site + URL.crowdfundInfoPage+'?crowdfundId='+cid+'&pUserId='+pageConfig.pid+'&isShare=1',
                  shareImgUrl = $(this).parents('li').find('.thumb').children('img').attr('src'),
                  desc  = '<'+$(this).parents('li').find('.goodsname').children('span').text() + '>正在乐享团中，好货分享给大家~!';
            weiXinShare(shareUrl,shareImgUrl,desc);
        }).on('tap', '[href]', function (event) {
            event.preventDefault();
            Common.addPUserId($(this));
        })
    }


    init();
})