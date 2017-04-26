require([
    'jquery',
    'h5/js/common/data',
    'h5/js/common/goods',
    'h5/js/common/cart',
    'h5/js/common',
    'h5/js/common/loadImage',
    'h5/css/page/list.css'
], function($, Data, Goods, Cart, Common, LoadImage) {

    
    
    var Page;

    function init() {
        fetch().always(render);
    }

    function fetch() {
        var pomi = $.Deferred();
        Data.halfActiveSnapshot().done(function(res) {
            if (res.items && res.items.length) {
                var items = [];
                $.each(res.items, function(index, item){
                    var goods = Goods.create(item);
                    goods && items.push(goods);
                });
                pomi.resolve(items);
            } else {
                pomi.reject();
            }
        }).fail(function() {
            pomi.reject();
        });
        return pomi.promise();
    }


    function render(items) {
        var template = '<section id="halfPage"><div class="header-banner"><img src="http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20150418/vNTT-0-1429370876147.jpg" /></div><div class="main-goods pb-10"></div><div class="active-list-layout"><h1 class="today-recommend">今日推荐</h1><ul class="active-list grid"></ul></div></section><footer id="page-footer"></footer>';

        Page = $(template).appendTo('body');

        if(items && items.length){

            var item = items.shift();
            item._htmlDifference = '比实体店省'+Common.moneyString(item.refPrice-item.price)+'元';
            $('.main-goods', Page).html(goodsToHtml(item,'first'));

            var html = [];
            $.each(items, function(index, item) {
                if (index % 2 == 0) {
                    html.push('<li class="row">');
                }
                html.push(goodsToHtml(item));
                if (index % 2 == 1) {
                    html.push('</li>');
                }
            });
            if (items.length % 2 == 1) {
                html.push('<div class="col col-50 goods goods-null fb fvc fac"></div></li>');
            }
            $('.active-list', Page).html(html.join(''));

            LoadImage(Page);
            refreshCart();
        }else{
            $('.active-list', Page).addClass('not-has-goods').html('<li><div class="col col-50 goods goods-null fb fvc fac"></div></li>');
        }

        bindEvent();

        Common.renderAppBar();

        
    }

    function bindEvent() {
        Page.on('scroll', scrollEventLoadImage);

        Page.on('tap', '.add-cart', function(event) {
            event.preventDefault();
            addCart($(this));
        }).on('transitionend', '.adding', function(event) {
            $(this).removeClass('adding');
        })

    }

    function scrollEventLoadImage(event) {
        //console.log(event);
        clearTimeout(Page._scroll_event_sid);
        Page._scroll_event_sid = setTimeout(function() {
            LoadImage(Page);
        }, 200);
    }

    function goodsToHtml(goods, first) {

        var template = first ? '<div class="goods col col-50" data-id="{{itemId}}"><div class="listimg" href="/api/h/1.0/detailPage.htm?gid={{itemId}}"><img data-lazyload-src="{{bigimg}}"/></div><div class="goods-info clearfix"><h1 class="title">{{title}}<span class="spec">{{specification}}</span></h1><p class="price-layout"><strong class="price">{{_htmlPrice}}</strong><span class="refprice">{{_htmlDifference}}</span></p></div><a class="add-cart"></a><div class="count">{{cartCount}}</div>{{soldOut}}<div class="main-goods-icon"></div></div>' : '<div class="goods col col-50" data-id="{{itemId}}"><div class="listimg" href="/api/h/1.0/detailPage.htm?gid={{itemId}}"><img data-lazyload-src="{{listimg}}"/></div><div class="goods-info clearfix"><h1 class="title">{{title}}<span class="spec">{{specification}}</span></h1><p class="price-layout"><del class="refprice">{{_htmlRelPrice}}</del><br/><strong class="price">{{_htmlPrice}}</strong></p></div><a class="add-cart"></a><div class="count">{{cartCount}}</div>{{soldOut}}</div>';
        return bainx.tpl(template, goods);

    }


    function addCart(btn) {
        var view = btn.parents('.goods'),
            gid = view.data('id'),
            item = Cart.query(gid) || Cart.create(Goods.query(gid));

        if (item) {
            item.add({
                btn: btn,
                start: function(newCount) {
                    btn.addClass('adding');
                    view.find('.count').text(newCount);
                },
                count: 1,
                view: view
            }).always(function() {
                item.count > 0 ? view.find('.count').text(item.count).show() : view.find('.count').hide();
                renderSmallCart();
            }).fail(function(json) {
                alert(json && json.msg || '同步购物车失败！');
                if (!item.goods.itemNum) {
                    Cart.removeItem(item);
                }
            });
        }
    }

    function renderSmallCart() {
        /*Cart.renderSmallCart({
            wrap: $('footer').addClass('grid'),
            submitText: '下单',
            href: '/api/h/1.0/cartPage.htm'
        });*/
    }

    function refreshCart() {
        Common.isLogin && Cart.ready(function() {
            renderSmallCart();
            refreshListCount();
        });
    }

    function refreshListCount() {
        $('.goods .count', Page).hide();
        if (Cart.total) {
            Cart.forEach(function(id, item) {
                $('.goods[data-id="' + id + '"] .count', Page).text(item.count).show();
            });
        }
    }



    init();
});
