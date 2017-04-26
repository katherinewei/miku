require([
    'jquery',
    'h5/js/common',
    'h5/js/common/data',
    'h5/js/common/goods',
    'h5/js/common/cart',
    'h5/js/common/nexter',
    'h5/js/common/loadImage'
], function($, Common, Data, Goods, Cart, Nexter, LoadImage) {

    function init() {
    	render();
    }

    function render() {
        var bannerImage = 'http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20150429/vNTT-0-1430275246743.jpg',
            template = '<section id="pierre-page"><div class="scroll-body"><div class="banner"><img src="' + bannerImage + '" /></div><div class="goods-list-layout"><ul class="grid"></ul></div></div></section>';
            
           
        $('body').append(template);

        var Page = $('#pierre-page');

        initLoad(Page);

        Common.renderAppBar();

    }

    function htmlItems(items){
    	var itemImage = '<div class="col col-12"><img data-lazyload-src="{{listimg}}" /></div>',
            itemInfo = '<div class="col col-13 goods-info"><h1>{{title}}</h1><div class="taste-spec fb fvc fac"><div class="spec col tc">{{specification}}</div><div class="col taste tc">{{taste}}</div></div><div class="icons-qxprice"></div><div class="ref-price">原价:{{_htmlRelPrice}}元</div><div class="fb fvc"><div class="col price">{{_htmlPrice}}<span>元</span></div><div class="col"><div class="icons-buybtn"></div></div></div></div>',
            itemOddTemplate = '<li class="goods row odd fvc" data-id="{{itemId}}" href="detailPage.htm?gid={{itemId}}">' + itemInfo + itemImage + '</li>',
            itemEvenTemplate = '<li class="goods row even fvc" data-id="{{itemId}}" href="detailPage.htm?gid={{itemId}}">' + itemImage + itemInfo + '</li>',
            html = [];
        $.each(items, function(index, item){
        	var goods = Goods.create(item);
        	goods.taste = goods.features && goods.features["口感"] || '';
        	var template = htmlItems.count % 2 ? itemEvenTemplate : itemOddTemplate;
        	html.push(bainx.tpl(template, goods));
        	htmlItems.count ++;
        });
        return html;
    }
    htmlItems.count = 0;

    function initLoad(Page){
    	var element = Page; //$('.goods-list-layout', Page);

        var nexter = new Nexter({
            element: element,
            dataSource: Data.tagItems,
            enableScrollLoad : true,
            scrollEventBindElement : Page,
            scrollBodyContent : $('.scroll-body', Page),
            data: {
                tag : 32 //臻品
            }
        }).on('load:success', function(res) {
            console.log(res);
            var html = htmlItems(res.items);
            if (html.length) {
                this.$('ul').append(html.join(''));
                LoadImage(this.element);
            } else if (this.get('pageIndex') == 0) {
                this.$('ul').html('<li class="not-has-goods-msg">我们正在努力搬运中...</li>');
            }
        }).render().load();

        //Lazyload('#pierre-page img', {attr:'data-lazyload-src', container : '#pierre-page'});

        var sid,
            scrollEventHandle = function(event) {
                event.preventDefault();
                clearTimeout(sid);
                sid = setTimeout(function() {
                    LoadImage(element);
                }, 200);
            }
        element.on('scroll', scrollEventHandle);
    }


    init();
});
