//众筹界面
require([
    'jquery',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/shop',
    'h5/js/common/loadImage',
    'h5/js/common/nexter',
    'h5/js/common/banner',
    'h5/js/common/location',
    'h5/js/common/storage',
    'h5/js/common/goods',
    'h5/js/common/cart',
    'h5/js/common/weixin',
    'h5/js/common/url'
], function ($, Data, Common, Shop, LoadImage, Nexter, Banner, WLocation, Storage, Goods, Cart, WeiXin, URL) {

    var Page,
        list,
        activity;

    function init() {
        render();
        Common.to_Top('#subcategory');//返回顶部
    }

    function render() {
        Data.getSystemTimes().done(function(res){

            var remains_time = computeTime(res.now,0),
                title = '<!--<div class="title grid"><div class="row"><h1 class="tit-content col col-15">米酷</h1><div class="tit-search col col-8"></div></div></div>--><div class="navbar-fixed-top top-nav grid"><ul class="top-nav-ul row"><li class="top-nav-li col col-33"><div >商城</div></li><li class="top-nav-li col col-33"><div class="active">众筹</div></li><li class="top-nav-li col col-33"><div>私人定制</div></li></ul></div>',
                header = title+'<section id="subcategory" class="page-content"><div class="banner"><img src="'+imgPath+'temporary/crowdfund/time_bg.jpg" alt=""><div class="time_day"><div class="time_img"><img src="'+imgPath+'temporary/crowdfund/'+remains_time[0]+'.png" alt=""></div><div class="time_img"><img src="'+imgPath+'temporary/crowdfund/'+remains_time[1]+'.png" alt=""></div></div></div><div class="activity" data-banner="421"></div></section>';
            Page = $(header).appendTo('body');

            actiSep();
            bindEvent();
            hideHearderFooter();  //隐藏头尾
        });

        Common.renderAppBar(URL.index);
        Common.isLogin && Cart.ready(); //获取购物车总数
    }
    //活动
    function actiSep() {

        var banners = getBanner();
        var createHtml = function (banners, template, className, showText) {
            var listTemplate = [],
                html = [],
                secListTemplate = '<div class="item" href="{{href}}"><div class="shadows_parent"> <img data-lazyload-src="{{img}}" /><span class="{{shadows}}"></span></div><div class="textWrap clearfix {{is_show}}"><span class="ellipsis">{{title}}</span><em>{{remains_time}}</em></div></div>';

                banners.forEach(function (item, index) {
                    //item.nowTime = res.nowTime;
                    if (className) {
                        item.className = className;
                    }
                    html.push((new Banner(item)).html( secListTemplate));
                });
            return html.join('');
        };

        if (banners.length > 0) {
            $('.activity').append('<h3><span class="line"></span><b>热门推荐</b></h3><div class="items"></div>');
        }
        Page.find('.items').html(createHtml(banners));

        LoadImage(Page);
        var sid,
            scrollEventHandle = function (event) {
                event.preventDefault();
                clearTimeout(sid);
                sid = setTimeout(function () {
                    LoadImage(Page);
                }, 100);
            }
        Page.on('scroll', scrollEventHandle);

    }

    function _renderHtml(cates) {

        var template = '<dl class="col col-25" data-id="{{categoryId}}"><dt><img data-lazyload-src="{{pic}}" /></dt><dd class="ellipsis">{{name}}</dd></dl>',
            html = [];

        $.each(cates, function (index, cate) {
            html.push(bainx.tpl(template, cate));
        });

        $('.list .listitem', Page).html(html.join(''));
        setTimeout(function () {
            LoadImage(Page);
        }, 0);
    }

    function bindEvent() {
        Page.on('tap', '.top-nav .top-nav-li', function (event) {
            event.preventDefault();
            var li_index = $(this).index();
            switch (li_index){
                case 0:
                    location.href = URL.index;
                    break;
                case 1:
                    break;
                case 2:
                    location.href = URL.customizationHtm;
                    break;
            }

        });
    }

    function getBanner(){
        var banners =[
            {categoryId: 20000003,
                description: "可莱丝水库面膜",
                picUrl: imgPath+"index/8215.jpg",
                redirectType: 311,
                showText: 1,
                soldCount: 58,
                target: "8215",
                title: "可莱丝水库面膜",
                type: 421,
                weight: 1},
            {categoryId: 20000002,
                description: "VDL贝壳提亮液",
                picUrl: imgPath+"index/8191.jpg",
                redirectType: 311,
                showText: 1,
                soldCount: 58,
                target: "8191",
                title: "VDL贝壳提亮液",
                type: 421,
                weight: 1},
            {categoryId: 20000002,
                description: "D-UP超强力夹眼睫毛胶水(透明)",
                picUrl: imgPath+"index/8195.jpg",
                redirectType: 311,
                showText: 1,
                soldCount: 58,
                target: "8195",
                title: "D-UP超强力夹眼睫毛胶水(透明)",
                type: 421,
                weight: 1}
        ];

        return banners;
    }

    //计算剩余时间
    function computeTime(now_time,end_time){
        var remains_time = 0;
        var str_time = '2016-1-20';
        str_time = str_time.replace(/-/g,'/');
        var date = new Date(str_time);
        var time = date.getTime();
        now_time = now_time ? now_time : Date.parse(new Date());
        end_time = end_time ? end_time : time;
        remains_time = Math.ceil((parseInt(end_time) - parseInt(now_time))/(1000*24*60*60)).toString();

        if(remains_time.length == 1){
            remains_time = '0'+remains_time;
        }

        return remains_time;
    }


    function hideHearderFooter() {
        var type = getQueryString('type');
        if (type == 1) {
            $('#app-bar,.top-nav').show();
            $('#subcategory').css({'padding': '40px 0 50px'});

        } else {
            $('#app-bar,.top-nav').hide();
            $('#subcategory').css({'padding': 0});
        }
    }

    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
    init();
})