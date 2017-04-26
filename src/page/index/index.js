/**
 * 首页
 */
require([
    'jquery',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/shop',
    'h5/js/common/loadImage',
    'h5/js/common/banner',
    'h5/js/common/location',
    'h5/js/common/storage',
    'h5/js/common/goods',
    'h5/js/common/cart',
    'h5/js/common/weixin',
    'h5/js/common/url',
    'h5/js/common/nexter'

], function ($, Data, Common, Shop, LoadImage, Banner, WLocation, Storage, Goods, Cart, WeiXin, URL, Nexter) {

    var Page,
        now_time = 0,
        ShopInfo;
        //firstLoad = true,
       // pUserId = URL.param.pUserId;

    function init() {
        //window.history.back(-1);
       // weiXinShare();
       // Shop.ready(render);
        render();
        Common.to_Top(window);        //返回顶部
    }

    /*window.onbeforeunload = function () {
     var scrollPos;
     if (typeof window.pageYOffset != 'undefined') {
     scrollPos = $('.page-content').scrollTop();
     }
     else if (typeof document.compatMode != 'undefined' &&
     document.compatMode != 'BackCompat') {
     scrollPos = document.documentElement.scrollTop;
     }
     else if (typeof document.body != 'undefined') {
     scrollPos = document.body.scrollTop;
     }
     document.cookie = "scrollTop=" + scrollPos; //存储滚动条位置到cookies中
     }*/

    //function weiXinShare(){
    //    if(Common.inWeixin){
    //        console.log(document.title);
    //        var shareUrl = URL.site + URL.index+'?pUserId='+pageConfig.pid+'&isShare=1';
    //        var shareImgUrl = URL.imgPath + 'common/images/share-miku.png',
    //            desc =  '米酷，一个明明可以靠脸，却偏偏要凭实力的平台，不要问我为什么，有逼格就是这么任性',
    //            shareOption = {
    //                title: '米酷,100%,限时抢购', // 分享标题
    //                desc: desc, // 分享描述
    //                link: shareUrl,
    //                type: 'link',
    //                dataUrl: '',
    //                imgUrl: shareImgUrl
    //            },
    //            shareOptionTimeline = {
    //                title: desc,
    //                link: shareUrl,
    //                imgUrl: shareImgUrl
    //            };
    //
    //        WeiXin.hideMenuItems();
    //        WeiXin.showMenuItems();
    //        WeiXin.share(shareOption, shareOptionTimeline);
    //    }
    //}

    function render(shopInfo) {
      //  Common.isLogin && Cart.ready(); //获取购物车总数

        ShopInfo = shopInfo;
        $('#indexPage, #app-bar').remove();
        var title = '<div class="navbar-fixed-top top-nav grid"><h1 class="title">9LAB</h1><!--<ul class="top-nav-ul row"><li class="top-nav-li col "><div class="active">推荐</div></li><li class="top-nav-li col " href="' + URL.cateTwoPage + '?categoryId=20000006&categoryName=母婴"><div>母婴</div></li><li class="top-nav-li col "  href="' + URL.cateTwoPage + '?categoryId=20000004&categoryName=私护"><div>私护</div></li><li class="top-nav-li col " href="' + URL.cateTwoPage + '?categoryId=20000005&categoryName=保健"><div>保健</div></li></ul><div class="searchbtn" href="' + URL.category + '"><img src ="' + imgPath + 'common/images/home_search.png"  /></div>--></div>';
        Page = $(title + '<section id="indexPage" class="page-content"><div id="banner" class="banner pic-carousel" data-banner="418"></div><div class="cate-nav grid" data-banner="419"></div><!--<div class="columnBanner" data-banner="423"></div> <div class="showcase clearfix"></div><div class="full-cut" data-banner="425"></div><div class="sec-area" data-banner="422"></div><div class="active-nav" data-banner="420"></div><!--<div class="shop-info" ></div><div class="recommend" data-banner="421"></div>--><div class="project" data-banner="426"></div><!--<div class="title-content" style="display: none;"><div class="tit-content-left">每日必看</div></div><div class="page-tabs-panel" style="display: none;"><ul class="goods-list grid"></ul></div>--></section>').appendTo('body');

        //$('#indexPage').height($(window).height());
        bindEvents();
        renderBanner();//
//
        Common.renderAppBar();
    }

    function bindEvents() {
        Page.on('tap','.testSkin', function () {
            if($('.telDialog').length == 0){
                $('body').append('<section class="telDialog wl-trans-dialog translate-viewport" style="display: block;"><div class="cont bounceIn"><p>九研美尚APP专属功能，请下载APP</p><div class="btngroup"><span class="btn reset">取消</span> <span href="' + Common.downloadLink + '"  class="btn ring">下载APP</span></div></div></section>');
            }
            else{
                $('.telDialog').show();
            }
        })
        $('body').on('tap', '.reset', function () {
            $('.telDialog').hide();
        })
            //    Shop.switch();
            //})
        //    .on('scroll', scrollEventLoadImage).on('tap', '.shop-signs', function(event) {
        //    Shop.switch();
        //})
        //    .on('tap','.tit-search',function(event){
        //    location.href = URL.category;
        //})
        //    .on('tap', '.add-cart', function (event) {
        //        event.preventDefault();
        //        addCart($(this));
        //    })
            //    隐藏每日必看
            //    .on('scroll', function () {
            //    event.preventDefault();

            //
            //    if ($('.page-tabs-panel').offset().top < $(window).height()*1.5 && firstLoad) {
            //        renderCateNexter();
            //        firstLoad = false;
            //    }
            //})
        //}).on('tap', '.top-nav .top-nav-li', function (event) {
        //    event.preventDefault();
        //    var li_index = $(this).index();
        //    switch (li_index){
        //        case 0:
        //
        //            break;
        //        case 1:
        //            location.href = URL.crowdfundHtm;
        //            break;
        //        case 2:
        //            location.href = URL.customizationHtm;
        //            break;
        //    }
        //
        //});
        //    .on('tap', '[href]', function (event) {
        //        event.preventDefault();
        //        Common.addPUserId($(this));
        //    });
    }

    //function scrollEventLoadImage(event) {
    //    //console.log(event);
    //    clearTimeout(Page._scroll_event_sid);
    //    Page._scroll_event_sid = setTimeout(function() {
    //        LoadImage(Page);
    //    }, 0);
    //}

    function renderBanner() {
        var ids = [];
        Page.find('[data-banner]').each(function() {
            ids.push($(this).data('banner'));
        });
        //  $('#indexPage').height(10000);
        Data.getBanner(ids).done(function(res) {
            now_time = parseInt(res.nowTime/1000);
            console.log(res);
            if(res.length != 0) {
                //渲染页面banner位置
                if ($.isPlainObject(res.banners)) {
                    var createHtml = function (banners, template, className, showText) {
                        var listTemplate = [],
                            html = [],//{{shadows}}

                            secListTemplate = '<div class="sec-product " href="{{href}}" tj_label="{{title}}" tj_action="{{index_key}}"><div class="shadows_parent sec-product-img"><span class=""></span><div class="{{hasSoldOut}}"></div> <img src="{{img}}" ></div><div class="sec-product-tit {{is_show}}"><div class="tit-content">{{title}}</div><div class="tit-time {{count_down_time}}" start_time="{{startTime}}" end_time="{{endTime}}" >{{remains_time}}</div></div></div>',
                            cateListTemplate = '<li class="{{className}} " href="{{href}}" tj_label="{{title}}" tj_action="{{index_key}}"><div class="cate-li-img"><img src="{{img}}" ></div><div class="cate-li-tit ellipsis">{{title}}</div></li>',
                            bannerTemplate = '<div class="{{className}} " href="{{href}}" tj_label="{{title}}" tj_action="{{index_key}}"><img src="{{img}}"/></div>',
                            columnTemplate = '<div class="{{className}} " href="{{href}}" tj_label="{{title}}" tj_action="{{index_key}}"><img src="{{img}}"/></div>',
                             fullCutTemplate = '<div class="{{className}}" href="{{href}}" tj_label="{{title}}" tj_action="{{index_key}}"><img src="{{img}}"/></div>',
                            projectTemplate = '<div class="{{className}}" href="{{href}}" tj_label="{{title}}" tj_action="{{index_key}}"><img src="{{img}}"/></div>';

                        listTemplate[419] = cateListTemplate,
                        listTemplate[421] = secListTemplate,
                        listTemplate[422] = secListTemplate,
                        listTemplate[423] = columnTemplate,
                        listTemplate[425] = fullCutTemplate,
                        listTemplate[426] = projectTemplate;
                            banners.forEach(function (item, index) {
                                item.index_key = showText+index;
                                item.nowTime = res.nowTime; //服务器时间
                                //if(template == 426){
                                //    item.getXmUrl = item.target != '' ? '' : URL.getXmDetail+'?id='+item.id;
                                //}
                                if (className) {
                                    item.className = className;
                                }
                                html.push((new Banner(item)).html(listTemplate[template] || bannerTemplate));
                            });
                        return html.join('');
                    };
                    $.each(res.banners, function (key, banners) {
                        var html = [];
                        switch (key) {
                            case '418': //顶部活动位
                                initBannerSlider(banners, res.cid);
                                break;
                            case '419': //品类
                                Page.find('.cate-nav').html('<ul class="cate-nav-ul clearfix">' + createHtml(banners, key, 'cate-nav-li','首页类目_') + '</ul>');
                                break;
                            case '420': //品牌

                                break;

                            case '421': //秒杀
                                if (banners.length > 0) {
                                    $('.active-nav').before('<div class="title-content"><div class="tit-content-left">精选活动</div><!--<div class="tit-content-right">更多>></div>--></div>');
                                }
                                Page.find('.active-nav').html(createHtml(banners, key,'','超值专场_'));
                                break;
                            case '422':  //秒杀
                                if (banners.length > 0) {
                                    $('.sec-area').before('<div class="title-content"><div class="tit-content-left">每日10点准时开抢</div><!--<div class="tit-content-right">更多爆款>></div>--></div>');
                                }
                                Page.find('.sec-area').html(createHtml(banners, key,'','秒杀项目_'));
                                break;
                            case '423':  //通栏
                                if (banners.length > 0) {
                                    $('.columnBanner').html(createHtml(banners, key,'','顶部通栏_'));
                                }
                                break;
                            case '425':  //通栏
                                if (banners.length > 0) {
                                    $('.full-cut').before('<div class="title-content"><div class="tit-content-left">超值专场</div><!--<div class="tit-content-right">更多爆款>></div>--></div>');
                                    $('.full-cut').html(createHtml(banners, key,'','满减_'));
                                }
                                break;
                            case '426':  //项目
                                if (banners.length > 0) {
                                    //$('.project').before('<div class="title-content"><div class="tit-content-left">超值专场</div><!--<div class="tit-content-right">更多爆款>></div>--></div>');
                                    $('.project').html(createHtml(banners, key,'','项目_'));
                                }
                                break;
                        }
                    });
                    //Page.find('.cate-nav li').last().removeAttr('href').addClass('testSkin').find('img').attr('src',imgPath+'common/images/index_cate_4.png');
                    var csad = localStorage.getItem('currentCsadIM');

                    if((pageConfig.pid &&  parseInt(pageConfig.pid) > 0) && csad){
                        csad = JSON.parse(csad);
                        Page.find('.cate-nav li').first().find('.cate-li-img').css('border','1px solid #9d9d9d').find('img').attr('src',csad[3]);
                    }
                }
                //站点相关的橱窗商品展示
              //  console.log('橱窗商品', res.recItems);

                //if ($.isArray(res.recItems) && res.recItems.length) {
                //
                //    var createActiveHtml = function (banners) {
                //        var html1 = [],
                //            html2 = [],
                //            template = [
                //                '<div class="active-nav-left " data-id="{{itemId}}" href="' + URL.goodsDetail + '?gid={{itemId}}" tj_label="{{title}}" tj_action="橱窗位_1"><img src="{{indeximg}}" /></div>',
                //                '<div class="ac-nav-right-img right-top " data-id="{{itemId}}" href="' + URL.goodsDetail + '?gid={{itemId}}"  tj_label="{{title}}" tj_action="橱窗位_2"><img src="{{indeximg}}" /></div>',
                //                '<div class="ac-nav-right-img " data-id="{{itemId}}" href="' + URL.goodsDetail + '?gid={{itemId}}" tj_label="{{title}}" tj_action="橱窗位_3"><img src="{{indeximg}}" /></div>'
                //            ];
                //        banners.forEach(function (item, index) {
                //
                //            var goods = Goods.create(item);
                //            if (index == 0) {
                //                html1.push(bainx.tpl(template[index], goods));
                //            } else {
                //                html2.push(bainx.tpl(template[index], goods));
                //            }
                //        });
                //        return html1.join('') + '<div class="active-nav-right">' + html2.join('') + '</div>';
                //    };
                //
                //    Page.find('.showcase').html(createActiveHtml(res.recItems));  //橱窗位
                //
                //
                //}

                setTimeout(function () {
                    LoadImage(Page);
                }, 0);


            }else{
                $('#indexPage').html('<div class="notData"><img src="'+URL.imgPath+'/common/images/loading_fail.png"/><p>灰常抱歉，暂时没有数据哦</p></div>')
            }

            //倒计时
            //showCountDown();

            //  Common.scrollTopRel();


        });

    }
    function initBannerSlider(banners, shopId) {
        var template = '<li class="{{className}} " href="{{href}}" tj_label="{{title}}" tj_action="轮播图_{{index_key}}"><img _src="{{img}}" class="lazyimg" ></li>',
            html = ['<div class="carousel-status"><ul></ul></div><div class="slider-outer"><ul class="clearfix slider-wrap">'],
            target = Page.find('.banner'),
            statusHtml = [];

        banners.forEach(function(item, index) {
            item.index_key = index;
            html.push((new Banner(item)).html(template));
            statusHtml.push('<span></span>');
        });
        var len = banners.length;

        html.push('</ul></div>');
        target.html(html.join('')).show();
        $('.carousel-status div').html(statusHtml.join('')).find('span').eq(0).addClass('sel');
        //var statusElementLayout = $('.carousel-status');
        if (len > 1) {
            require('slider', function(Slider) {
                //var ww = $(window).width();
                //$('#indexPage .banner, #indexPage .banner img').width(ww);


                Slider({
                    slideCell:"#banner",
                    titCell:".carousel-status ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
                    mainCell:".slider-outer ul",
                    effect:"left",
                    autoPlay:true,//自动播放
                    autoPage:true, //自动分页
                    switchLoad:"_src" //切换加载，真实图片路径为"_src"
                });

                //var slide = new Slider(target, {
                //    loop: 1,
                //    curIndex: 0,
                //    useTransform: 1,
                //    lazy: '.lazyimg',
                //    play: true, //动画自动播放
                //    interval: 3000,
                //    //trigger: '.carousel-status',
                //    //activeTriggerCls: 'sel',
                //    //hasTrigger: 'tap',
                //    callback: function (index) {
                //        statusElementLayout.find('.sel').removeClass('sel');
                //        statusElementLayout.find('span').eq(index).addClass('sel');
                //    }
                //});
            });
        } else {
            var img = $('img', target);
            img.attr('src', img.attr('_src')).removeAttr('_src');
        }
    }
    //function renderShopInfo(target) {
    //
    //    var template = '<div class="location">{{location}}</div><div class="phone">{{phone}}</div><div class="shop-signs"><div class="name" style="  padding: 10px 0;font-size: 14px;white-space: nowrap;width: 70%;overflow: hidden;text-overflow: ellipsis;">{{name}}</div><!--div class="distance">正在计算距离...</div--></div>';
    //
    //    shopInfo = Shop.currentShop();
    //    target.html(bainx.tpl(template, shopInfo));
    //
    //    renderPosition(Shop.currentPosition(), shopInfo);
    //}
    //
    //function renderPosition(position, shopInfo) {
    //    var coords = shopInfo.lbs.split(',');
    //    var distance = WLocation.getGreatCircleDistance(coords[0], coords[1], position.lng, position.lat);
    //
    //}



    //function renderCateNexter() {
    //
    //
    //    var element = $('#indexPage'),
    //    //var element = $('.page-tabs-panel'),
    //        goodsWrap = Page.find('.page-tabs-panel ul');
    //
    //    var nexter = new Nexter({
    //        element: element,
    //        dataSource: Data.fetchItems,
    //        enableScrollLoad: true,
    //        scrollBodyContent: $('.page-tabs-panel ul')
    //    }).load().on('load:success', function (res) {
    //        console.log(res);
    //
    //        var html = htmlItems(res.items);
    //        if (html.length) {
    //            goodsWrap.append(html.join(''));
    //            LoadImage(goodsWrap);
    //
    //            //refreshCart();
    //        } else if (this.get('pageIndex') == 0) {
    //            goodsWrap.html('<li class="not-has-goods-msg">暂时没有您想要的商品...</li>');
    //        }
    //    }).render();
    //
    //    var sid,
    //        scrollEventHandle = function (event) {
    //            event.preventDefault();
    //            clearTimeout(sid);
    //            sid = setTimeout(function () {
    //                LoadImage(element);
    //            }, 0);
    //        };
    //
    //    element.on('scroll', scrollEventHandle);
    //
    //}

    //function htmlItems(items) {
    //    var template = '<div class="goods col col-50" data-id="{{itemId}}"><div class="listimg " href="' + URL.goodsDetail + '?gid={{itemId}}"><img src="{{listimg}}" />{{soldOut}}</div><div class="goods-info"><h1><span class="title">{{title}}</span></h1><p class="goodsPrice"><span class="price">{{_htmlPrice}}</span><span class="refprice">{{_htmlRelPrice}}</span></p><span class="add-cart {{soldOutCartState}}">立即抢购</span><div class="count">{{cartCount}}</div></div>{{_htmlFlag}}</div>',
    //        html = [],
    //        _index = 0;
    //
    //    if ($.isArray(items) && items.length) {
    //
    //        $.each(items, function (index, item) {
    //            if (index % 2 == 0) {
    //                html.push('<li class="row">');
    //            }
    //            var goods = Goods.create(item);
    //            html.push(bainx.tpl(template, goods));
    //            if (index % 2 == 1) {
    //                html.push('</li>');
    //            }
    //            _index = index;
    //        });
    //        if (_index % 2 == 0) {
    //            html.push('<div class="col col-50 goods goods-null fb fvc fac"></div></li>');
    //        }
    //    }
    //    return html;
    //}

    //function addCart(btn) {
    //    var view = btn.parents('.goods'),
    //        gid = view.data('id'),
    //        item = Cart.query(gid) || Cart.create(Goods.query(gid));
    //
    //    if (item) {
    //        item.add({
    //            btn: btn,
    //            start: function (newCount) {
    //                btn.addClass('adding');
    //                view.find('.count').text(newCount);
    //
    //                var offset = $(".cart-bar .count").offset(),
    //                     cloneViewOffset = $('.listimg', view).offset(),
    //                     imgUrl = view.find('.listimg').children('img').attr('src'), //获取当前点击图片链接
    //                     flyerWidth = $('.listimg img', view).width(),
    //                 //flyerHeight = $('.listimg img', view).height(),
    //                 flyer = $('<div class="listimg move-wrap"><img class="flyer-img" src="' + imgUrl + '"></div>'); //抛物体对象
    //
    //             flyer.find('.flyer-img').width(flyerWidth);
    //             //flyer.find('.flyer-img').height(flyerHeight);
    //
    //             flyer.fly({
    //                     start: {
    //                         left: cloneViewOffset.left,//抛物体起点横坐标
    //                             top: cloneViewOffset.top //抛物体起点纵坐标
    //
    //                     },
    //                 end: {
    //                         left: offset.left + 1,//抛物体终点横坐标
    //                             top: offset.top + 1, //抛物体终点纵坐标
    //                             width: 10,
    //                             height: 10
    //                     },
    //                 speed: 0.8,
    //                     vertex_Rtop: 20, //运动轨迹最高点top值，默认20
    //                     onEnd: function () {
    //                         //$("#tip").show().animate({width: '200px'},300).fadeOut(500);////成功加入购物车动画效果
    //                         this.destory(); //销毁抛物体
    //                     }
    //                });
    //
    //            },
    //            count: 1,
    //            view: view
    //        }).always(function (res) {
    //            item.count > 0 ? view.find('.count').text(item.count).css({visibility: "visible"}) : view.find('.count').css({visibility: "hidden"});
    //            refreshCart();
    //
    //        }).fail(function (json) {
    //
    //            if (item.goods.flag.immediatelyBuy) {
    //                URL.assign(URL.goodsDetail + '?gid=' + item.id);
    //            } else {
    //                alert(json && json.msg || '同步购物车失败！');
    //
    //                if (!item.goods.itemNum) {
    //                    Cart.removeItem(item);
    //                }
    //            }
    //
    //        });
    //    }
    //}

    //function refreshCart() {
    //    Common.getCartCount();
    //    Common.isLogin && Cart.ready(function () {
    //
    //    });
    //
    //}

    //倒计时 只显示进行中的状态
    //window.showCountDown = function (){
    //    now_time ++;
    //    var leftsecond = 0,
    //        msg = '仅剩';
    //
    //    $(".count_down_time").each(function(i){
    //
    //        var start_time = this.getAttribute("start_time"), //开始时间
    //            end_time = this.getAttribute("end_time"); 	//结束时间
    //
    //        //进行中
    //        if(now_time >= start_time && now_time <= end_time){
    //             leftsecond=end_time-now_time;
    //        }
    //
    //        var hour=Math.floor(leftsecond/3600);
    //        var minute=Math.floor((leftsecond-hour*3600)/60);
    //        var second=Math.floor(leftsecond-hour*3600-minute*60);
    //
    //        if(hour < 0){
    //            leftsecond = 0;
    //        }
    //
    //        if(leftsecond > 0){
    //            $(this).html(msg+'<span>'+add_zero(hour)+":"+add_zero(minute)+":"+add_zero(second)+'</span>');
    //        }
    //
    //    });
    //
    //    setTimeout(function(){
    //        showCountDown();
    //    },1000);
    //
    //
    //}
    //
    ////时间处理
    //function add_zero(number) {
    //    if(number < 10){
    //        number = '0'+number;
    //    }
    //    return number;
    //}



    init();

});