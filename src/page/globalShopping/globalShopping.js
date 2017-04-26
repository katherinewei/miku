/**
 * 全球购
 * Created by xiuxiu on 2016/1/14.
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
        k,
        i,
        firstLoad = true,
        cate_url = URL.list+'?cid=', //美容美体:20000001
        brand_url = URL.list+'?brandId=',
        goods_detail_url = URL.goodsDetail+'?gid=',
        act_image_path = imgPath+'active/images/',
        active_type = [];

        //品牌团
        active_type['brand']={
                'title':'品牌团',
                'image':'brand.jpg',
                'img_type':'.jpg',
                'image_path':act_image_path+'brand/',
                'goods':{
                    0:{'title':'','type':'bannar','goods_ids':[8536,8645,8662,8665]},
                    1:{'title':'热卖单品','type':'goods','goods_ids':'8524;8640;8532;8636;8643;8655;8684;8695;8670;8674;8657;8663','class_name':'hot_content'},
                    2:{'title':'更多好货','type':'more','goods_ids':''}
                }
            };

            //限量特卖
        active_type['limit']={
                'title':'限量特卖',
                'image':'limit.jpg',
                'img_type':'.jpg',
                'image_path':act_image_path+'limit/',
                'goods':{
                    0:{'title':'','type':'bannar','goods_ids':[8167,8213,8197,9383]},
                    1:{'title':'热卖单品','type':'goods','goods_ids':'8645;8372;9382;8380;9297;8658','class_name':'hot_content'},
                    2:{'title':'更多好货','type':'more','goods_ids':''}
                }
            };

        //冬季补水
        active_type['water']={
                'title':'冬季补水',
                'image':'water.jpg',
                'img_type':'.jpg',
                'image_path':act_image_path+'water/',
                'goods':{
                    0:{'title':'膜力新年','type':'goods','goods_ids':'8215;8217;8225;8201','class_name':'new_year_content'},
                    1:{'title':'补水神器','type':'goods','goods_ids':'8223;8241','class_name':'water_content'},
                    2:{'title':'冬季保湿有一套','type':'goods','goods_ids':'8847;8959','class_name':'winter_content'},
                    3:{'title':'更多好货','type':'more','goods_ids':''}
                }
            };

            //全球购
        active_type['global']={
                'title':'全球购',
                'image':'global.jpg',
                'img_type':'.png',
                'image_path':act_image_path+'global/',
                'goods':{
                    0:{'title':'','type':'cate','cate_ids':[20000088,20000089,20000170,20000171]},
                    1:{'title':'超值专场','type':'bannar','goods_ids':[8241,8373,8191]},
                    2:{'title':'海外大牌','type':'brand','brand_ids':[57,56,25,58,1,64]},
                    3:{'title':'每日必看','type':'more','goods_ids':''}
                }
            };

    $('.waitting').hide();


    function init() {
        render();
        Common.to_Top('#indexPage');        //返回顶部

    }

    function render() {
        Common.headerHtml('');
        var mainPage = '<section id="indexPage" class="page-content"><div class="scroll-content"></div></section>';
        Page = $(mainPage).appendTo('body');

        //显示页面内容
        showPage();

        var type = URL.param.type;
        if (type == 1) {
            document.getElementsByClassName('header')[0]['style'].display = 'block';
            $('#indexPage').css({"padding": "37px 0 50px"});
            refreshCart();
        }

    }

    function showPage(){

        var type_name = URL.param.act_type,
            active_name = active_type[type_name],
            active_image_path = active_name.image_path,
            img_type = active_name.img_type,
            page_conent = active_name.goods,
            tit_obj = {},
            bannar_tpl = '<div class="activity"><div class="item" href="{{href}}"><img data-lazyload-src="{{img}}"/></div></div>',//大图
            cate_tpl = '<li class="row" href = {{href}}><div class="col"><img data-lazyload-src="{{img}}"/> </div></li>', //入口
            title_tpl = '<div class="title-content"><div class="tit-content-left">{{title}}</div></div>', //标题
            brand_tpl = '<li class="row" href = {{href}}><div class="col"><img data-lazyload-src="{{img}}" /></div></li>';  //品牌

        //主标题
        $('.navbar-main').html(active_name.title);
        document.title = active_name.title;

        //添加活动主题图
        tit_obj.img = active_image_path+active_name.image;
        $( bainx.tpl(bannar_tpl,tit_obj)).appendTo('.scroll-content');

        //专区标题
        function show_title(title){
            if(title){
                $(bainx.tpl(title_tpl,{'title':title})).appendTo('.scroll-content');
            }
        }

        for(k in page_conent){
            var contet_type = page_conent[k].type,
                con_title = page_conent[k].title;

            //标题
            show_title(con_title);

            switch (contet_type){
                case 'bannar':

                    var bannar_obj = page_conent[k].goods_ids,
                        bannar_html= tplHmtl(bannar_tpl,bannar_obj,contet_type,active_image_path,img_type);
                        $(bannar_html).appendTo('.scroll-content');
                    break;
                case 'brand':
                        var brand_obj = page_conent[k].brand_ids,
                            brandHtml = tplHmtl(brand_tpl,brand_obj,contet_type,active_image_path,img_type),
                            brand_html = '<ul class="brand grid clearfix">'+brandHtml+'</ul>';

                            $(brand_html).appendTo('.scroll-content');
                    break;
                case 'cate':

                        var cate_obj = page_conent[k].cate_ids,
                            cateHtml= tplHmtl(cate_tpl,cate_obj,contet_type,active_image_path,img_type),
                            cate_html = '<ul class="enter grid clearfix hide">'+cateHtml+'</ul>';

                        $(cate_html).appendTo('.scroll-content');
                    break;
                case 'goods':
                        var goods_obj = page_conent[k].goods_ids,
                            con_class_name = page_conent[k].class_name,
                            more_html = '<div class="page-tabs-panel '+con_class_name+'"><ul class="goods-list grid"></ul></div>';
                            $(more_html).appendTo('.scroll-content');

                            renderCateNexter(goods_obj,con_class_name);
                    break;
                case 'more':
                    var more_html = '<div class="page-tabs-panel  page-tabs-panel-more"><ul class="goods-list grid"></ul></div>';
                    $(more_html).appendTo('.scroll-content');
                    break;
            }
        }

        LoadImage(Page);
        bindEvents();

    }

    function bindEvents() {
        Page.on('scroll', scrollEventLoadImage)
            .on('scroll', function () {
                event.preventDefault();

                if ($('.page-tabs-panel-more').offset().top < $(window).height()*1.5 && firstLoad) {
                    renderCateNexter({cateId:20000001},'page-tabs-panel-more');
                    firstLoad = false;
                }
            }).on('tap', '.add-cart', function (event) {
                event.preventDefault();
                addCart($(this));
            });
    }

    function scrollEventLoadImage(event) {

        clearTimeout(Page._scroll_event_sid);
        Page._scroll_event_sid = setTimeout(function() {
            LoadImage(Page);
        }, 0);
    }

    //加载更多商品
    function renderCateNexter(data,class_name) {


        var element = $('#indexPage'),
            data_url = (data.cateId ? Data.fetchItems : Data.fetchItemsInfo ),
            class_name = (class_name ? ('.'+class_name+' ul') : ('.page-tabs-panel ul')),
            goodsWrap = Page.find(class_name);

        var nexter = new Nexter({
            element: element,
            dataSource: data_url,
            enableScrollLoad: true,
            scrollBodyContent: $(class_name),
            data: data
        }).load().on('load:success', function (res) {

            var html = htmlItems(res.items);
            if (html.length) {
                goodsWrap.append(html.join(''));
                LoadImage(goodsWrap);

            } else if (this.get('pageIndex') == 0) {
                goodsWrap.html('<li class="not-has-goods-msg">暂时没有您想要的商品...</li>');
            }
        }).render();

        var sid,
            scrollEventHandle = function (event) {
                event.preventDefault();
                clearTimeout(sid);
                sid = setTimeout(function () {
                    LoadImage(element);
                }, 0);
            };
        element.on('scroll', scrollEventHandle);

    }

    //商品模板
    function htmlItems(items) {
        var template = '<div class="goods col col-50" data-id="{{itemId}}"><div class="listimg" href="/api/h/1.0/detailPage.htm?gid={{itemId}}"><img data-lazyload-src="{{listimg}}" />{{soldOut}}</div><div class="goods-info"><h1><span class="title">{{title}}</span></h1><p class="goodsPrice"><span class="price">{{_htmlPrice}}</span><span class="refprice">{{_htmlRelPrice}}</span></p><a class="add-cart {{soldOutCartState}}">立即抢购</a><div class="count">{{cartCount}}</div></div>{{_htmlFlag}}</div>',
            html = [],
            _index = 0;

        if ($.isArray(items) && items.length) {

            $.each(items, function (index, item) {
                if (index % 2 == 0) {
                    html.push('<li class="row">');
                }
                var goods = Goods.create(item);
                html.push(bainx.tpl(template, goods));
                if (index % 2 == 1) {
                    html.push('</li>');
                }
                _index = index;
            });
            if (_index % 2 == 0) {
                html.push('<div class="col col-50 goods goods-null fb fvc fac"></div></li>');
            }
        }
        return html;
    }

    //拼接模板内容
    function tplHmtl(tpl,obj,type,img_path,img_type){
        var html = '',
            new_obj = {};

        for(i in obj){

            if(type == 'bannar'){
                new_obj.href = goods_detail_url+obj[i];
            }

            if(type == 'brand'){
                new_obj.href = brand_url+obj[i];
            }

            if(type == 'cate'){
                new_obj.href = cate_url+obj[i];
            }
            new_obj.img = img_path+obj[i]+img_type;
            html += bainx.tpl(tpl,new_obj);

        }

        return html;
    }

    //加入购物车
    function addCart(btn) {
        var view = btn.parents('.goods'),
            gid = view.data('id'),
            item = Cart.query(gid) || Cart.create(Goods.query(gid));

        if (item) {
            item.add({
                btn: btn,
                start: function (newCount) {
                    btn.addClass('adding');
                    view.find('.count').text(newCount);

                    var offset = $(".cart-bar .count").offset(),
                        cloneViewOffset = $('.listimg', view).offset(),
                        imgUrl = view.find('.listimg').children('img').attr('src'), //获取当前点击图片链接
                        flyerWidth = $('.listimg img', view).width(),
                        flyer = $('<div class="listimg move-wrap"><img class="flyer-img" src="' + imgUrl + '"></div>'); //抛物体对象

                    flyer.find('.flyer-img').width(flyerWidth);

                    flyer.fly({
                        start: {
                            left: cloneViewOffset.left,//抛物体起点横坐标
                            top: cloneViewOffset.top //抛物体起点纵坐标

                        },
                        end: {
                            left: offset.left + 1,//抛物体终点横坐标
                            top: offset.top + 1, //抛物体终点纵坐标
                            width: 10,
                            height: 10
                        },
                        speed: 0.8,
                        vertex_Rtop: 20, //运动轨迹最高点top值，默认20
                        onEnd: function () {
                            //$("#tip").show().animate({width: '200px'},300).fadeOut(500);////成功加入购物车动画效果
                            this.destory(); //销毁抛物体
                        }
                    });

                },
                count: 1,
                view: view
            }).always(function (res) {
                item.count > 0 ? view.find('.count').text(item.count).css({visibility: "visible"}) : view.find('.count').css({visibility: "hidden"});
                refreshCart();

            }).fail(function (json) {

                if (item.goods.flag.immediatelyBuy) {
                    URL.assign('/api/h/1.0/detailPage.htm?gid=' + item.id);
                } else {
                    alert(json && json.msg || '同步购物车失败！');

                    if (!item.goods.itemNum) {
                        Cart.removeItem(item);
                    }
                }

            });
        }
    }


    //刷新购物车
    function refreshCart() {
        Common.renderAppBar();
        Common.isLogin && Cart.ready(); //获取购物车总数

    }

    init();

});
