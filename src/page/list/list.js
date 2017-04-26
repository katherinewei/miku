require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/nexter',
    'h5/js/common/tabs',
    'h5/js/common/goods',
    'h5/js/common/loadImage',
    'h5/js/common/cart',
    'h5/js/common/storage',
    'h5/js/common/transDialog'
], function($, URL, Data, Common, Nexter, Tabs, Goods, LoadImage, Cart, Storage,Dialog) {
    var Page,
        CateTabs,
        dialog,
        Cates = Storage.Cates.get(),
        clevel = URL.param.level,       //类目等级
        cid = URL.param.cid,            //类目id
        brandId = URL.param.brandId,    //品牌id
        name = URL.param.name,      //title
        stype = 2,      //升序
        cidParent,      //父级类目id
        cidName,        //类目名称
        type = URL.param.type,      //判断是否是品牌入口
        q = URL.param.q,           //关键字
        oCol;                   //排序种类
    var countTap = URL.param.countTap;
    function init() {
        render();

        Common.to_Top('.page-tabs-panel');//返回顶部


    }

    function render() {


        var template = '<section class="page" id="listPage"><section class="header"><div class="content navbar"><div class="btn-navbar navbar-left"><span href="javascript:history.go(-1);" class="icon icon-return"></span></div><div class="search-wrap"><div class="row search-box"><div class="icon-search search-submit"></div><div class="input-wrap"><input type="text" class="search-input" placeholder="搜索"/></div><div class="icon-wrap" style="display: none;"><i class="icon-close"></i></div></div></div><div class="category-handle cart-bar" href="' + URL.cart + '"><span class="price"></span></div></div><div class="grid navTit"><ul class="page-tabs-nav row" data-switchable-role="nav"><li class=" sortFirst sortPrice col" data-order="2"><i class="up"></i><i class="down"></i>价格</li><li class="sortFirst sortDiscount col" data-order="3"><i class="up"></i><i class="down"></i>销量</li><li class="sortSecond sortBrand col">品牌</li><li class=" sortSecond sortCate col">品类</li></ul></div></section><div class="page-content"><div class="page-list-tabs"><div class="page-tabs-content" data-switchable-role="content"></div></div></div><footer></footer></section>';

        Page = $(template).appendTo('body');



        renderCate();
        //renderSearch();
        bindEvent();



        if (q) {
            searchItems(q);
            $('.search-input').val(q);
        }


    }

    function renderSearch() {
        var target = $('.search-layout', Page),
            template = '<div class="row search-box"><div class="col col-3 search-submit"></div><div class="col col-20"><input type="text" class="search-input" placeholder="输入搜索关键字～" /><div class="icon-wrap"><i class="icon-close"></i></div></div></div>';
        target.append(template);
    }

    function bindEvent() {
        Page.on('tap', '.icon-return', function (event) {
            event.preventDefault();
            Common.returnPrePage();
        }).on('tap', '.add-cart', function (event) {
            event.preventDefault();
            addCart($(this));

        }).on('transitionend', '.adding', function(event) {
            $(this).removeClass('adding');
        }).on('swipeUp', '.page-tabs-panel', function(event) {

            event.preventDefault();
            var $this = $(this);
            setTimeout(function() {
                hideNav($this);
            }, 0);
        }).on('swipeDown', '.page-tabs-panel', function(event) {

            event.preventDefault();
            setTimeout(function() {
                showNav();
            }, 0);
        }).on('tap','.sortSecond',function(event){
            event.preventDefault();
            var target = $(this);
            $('.sortFirst').find('i').removeClass('active');
            //target.addClass('active').siblings().removeClass('active');
            if(target.hasClass('sortBrand')){
                if (URL.param.type == 'brand') {        //如果是品牌入口就不让点了、
                    return ;
                }
                sortDialog('品牌','sortBrandBtn');
            }else if(target.hasClass('sortCate')){
                sortDialog('品类','sortCateBtn');
            }
        }).on('tap','.sortPrice,.sortDiscount',function(event){
            event.preventDefault();
            var target = $(this);
            oCol = target.data('order');           //1权重；2=价格；3=销售数量
            if(!countTap){
                countTap = 0;
            }

            setSession(target);
            countTap ++;
            switch (countTap){
                case 1:
                    stype = 1; //1=降序desc；2=升序asc）默认2
                    break;
                case 2:
                    stype = 2;
                    break;
                case 3:
                    stype = 2;
                    oCol = 1;
                    countTap = 0;
                    break;
                default:
                    break;
            }


            if (!cid) {               //如果没有品类id。传空
                cid = '';
            }
            if (!brandId) {           //如果没有品牌id。传空
                brandId = '';
            }

            if (cid && brandId && type && !clevel) {              //品牌进入的。如果选择 了品类。等级为3.其他情况为2
                clevel = 3;
            }
            if (brandId && type && !clevel) {              //品牌进入的。如果选择 了品类。等级为3.其他情况为2
                clevel = 2;
            }
            var urlLo = URL.list + '?cid=' + cid + '&brandId=' + brandId + '&level=' + clevel + '&oCol=' + oCol + '&stype=' + stype + '&name=' + cidName + '&countTap=' + countTap;

            urlLo = type ? urlLo + '&type=' + type : urlLo;

            if (q || $('#search-result').find('li').length > 0) {             //搜索、、的链接
                var query = q ? q : $.trim($('.search-input', Page).val() + '');
                urlLo = URL.list + '?q=' + query + '&oCol=' + oCol + '&stype=' + stype + '&name=' + cidName + '&countTap=' + countTap;
            }

            URL.assign(urlLo);

        }).on('tap', '[href]', function (event) {
            event.preventDefault();
            Common.addPUserId($(this));
        }).on('tap', '.navbar-left span', function (event) {
            event.preventDefault();
            $(this).removeAttr('href');
            URL.assign(URL.category);
        }).on('tap', '.search-submit', function (event) {
            event.preventDefault();
            var $input = $('.search-input', Page);
            var q = $.trim($input.val() + '');
            if (q == '') {
                alert('请输入搜索关键字!');
                return false;
            }
            searchItems(q);
        })/*.on('focus', '.search-input', function(event){
         var _this = this;
         $(document).one('touchstart', function(event){
         if(_this != this ){
         $(_this).blur();
         }
         });


         })*/.on('input', '.search-input', function (e) {
            var $input = $('.search-input', Page);
            var q = $.trim(encodeURIComponent($input.val()));
            if ($input.val() == '') {
                $('.icon-wrap').hide();
            } else {
                $('.icon-wrap').show();
            }
            itemSearchSuggest(q);

        }).on('keyup', '.search-input', function (e) {
            var key = e.which;
            var $input = $('.search-input', Page);
            var q = $.trim($input.val());
            if (key == 13) {
                e.preventDefault();
                if (q == '') {
                    alert('请输入收索关键字!');
                    return false;
                }
                $(this).blur();
                searchItems(q);
            }
        }).on('keydown', '.search-input', function (e) {
            //e.preventDefault();
            $('.associateValHtm').remove();
            $('.navTit').show();
        }).on('tap', '.icon-wrap', function (event) {
            event.preventDefault();
            $('.search-input').val('');
            $(this).hide();
            $('.associateValHtm').hide();
            $('.navTit').show();
        });
    }

    function setSession(target){
        if(target.hasClass('sortPrice')){
            if(!sessionStorage.getItem('countP')){
                sessionStorage.setItem('countP','0');
                countTap = sessionStorage.getItem('countP');
                sessionStorage.removeItem('countD');
            }
        }
        else if(target.hasClass('sortDiscount')){
            if(!sessionStorage.getItem('countD')){
                sessionStorage.setItem('countD','0');
                countTap = sessionStorage.getItem('countD');
                sessionStorage.removeItem('countP');
            }
        }
    }


    //获取品牌列表
    function fetchBrandsList() {



        var data = {
            cateId: cidParent,
            cateLevel: 2,//分类等级

        }
        if($('.sortMain dd').length == 1){
            Data.fetchBrands(data).done(function(res){
                if(res.brands){
                    var html=[];

                    $.each(res.brands,function(index,item){
                        var template = '<dd class="col sortDD"><span class="ellipsis" data-brandid="{{id}}">{{name}}</span></dd>';

                        html.push( bainx.tpl(template, item));
                    });
                    $('.sortBrandsList .theAll').after(html.join(''));

                    $('.sortBrandsList dd').each(function () {
                        if ($(this).children('span').data('brandid') == brandId) {
                            $('.sortBrandsList .theAll').children('span').removeClass('active');
                            $(this).children('span').addClass('active');
                        }
                    })
                }
            })
        }
    }

    //获取品类列表
    function fetchCatesList(){


        cidParent = URL.param.type ? '' : cidParent;
        var brandIdT = URL.param.type ? brandId : '';
        var data = {
            cateParentId: cidParent,
            level:3,//分类等级
            brandId: brandIdT
        }
        if($('.sortMain dd').length == 1){
            Data.fetchCatesByParams(data).done(function(res){
                if(res.cates){
                    var html=[];
                    $.each(res.cates,function(index,item){
                        var template = '<dd class="col sortDD"><span class="ellipsis" data-cateid="{{categoryId}}" data-level="{{level}}">{{name}}</span></dd>';

                        html.push( bainx.tpl(template, item));
                    });
                    $('.sortCateList .theAll').after(html.join(''));


                    $('.sortDD').each(function () {

                        if ($(this).children('span').data('cateid') == cid) {
                            $('.sortCateList .theAll').children('span').removeClass('active');
                            $(this).children('span').addClass('active');
                        }
                    })

                }
            })
        }
    }

    //弹窗
    function sortDialog(sort_name,sort_btn){
        var istap = false;
        if (!dialog) {

            dialog = new Dialog($.extend({}, Dialog.templates.bottom, {
                template: '<div id="sortPage"><section class="header"><div class="content navbar"><div class="btn-navbar navbar-left">取消</div><div class="navbar-main">' + sort_name + '</div></div></section><div class="grid"><dl class="sortMain "><dd class="col theAll"><span class="active">全部</span></dd></dl></div><footer><a class="' + sort_btn + '">完成</a></footer></div> ',
                events: {
                    'tap .navbar-left': function (event) {
                        event.preventDefault();
                        dialog.hide();
                    },
                    'tap a': function (event) {
                        event.preventDefault();
                        var urlLocate,
                            fullName,
                            brandName,
                            oColParam = URL.param.oCol,
                            stypeParam = URL.param.stype,
                            countTapParam = URL.param.countTap;
                        cidName = clevel == '2' ? sessionStorage.getItem('cid3Name') : sessionStorage.getItem('cidName');


                        if ($('#sortPage .sortDD').find('.active').length == 1) {
                            dialog.hide();

                            if ($('#sortPage .navbar-main').text() == '品牌') {
                                var bid = $('.sortMain').find('.active').data('brandid');

                                brandName = $('.sortMain').find('.active').text();

                                sessionStorage.setItem('brandName', brandName);

                                fullName = !cidName ? brandName : brandName + ' / ' + cidName;

                                urlLocate = cid ? URL.list + '?brandId=' + bid + '&cid=' + cid + '&level=' + clevel + '&name=' + fullName : URL.list + '?brandId=' + bid + '&level=' + clevel + '&name=' + fullName

                            }
                            else{
                                var cid3 = $('.sortMain').find('.active').data('cateid');
                                var cateName = $('.sortMain').find('.active').text();
                                clevel = 3;
                                sessionStorage.setItem('cid3Name', cateName);

                                if (brandId) {
                                    fullName = sessionStorage.getItem('brandName') + ' / ' + cateName;
                                } else {
                                    fullName = cateName;
                                }



                                urlLocate = brandId ? URL.list + '?brandId=' + brandId + '&level=' + clevel + '&name=' + fullName + '&cid=' + cid3 + '&parentName=' + name : URL.list + '?level=' + clevel + '&name=' + fullName + '&cid=' + cid3 + '&parentName=' + name;


                                if (type) {
                                    urlLocate = urlLocate + '&type=' + type;
                                }

                            }
                            urlLocate = oCol ? urlLocate + '&oCol='+oColParam+'&stype='+stypeParam + '&countTap=' +countTapParam : urlLocate;
                            URL.assign(urlLocate);
                        }else if($('.sortMain').find('.active').length == 0){
                            bainx.broadcast('请至少选择一种！');
                        } else {
                            if(sort_name == '品牌'){
                                var fullN = clevel == '3' ? name : cidName;
                                urlLocate = URL.list + '?cid=' + cid + '&name=' + fullN + '&level=' + clevel;

                            }else{
                                var parentName = brandId ? sessionStorage.getItem('brandName') + '/' + cidName : cidName;
                                if(brandId){
                                    urlLocate = URL.list + '?brandId=' + brandId + '&name=' + parentName + '&level=2' + '&cid=' + cidParent
                                }else{
                                    urlLocate = URL.list + '?cid=' + cidParent + '&name=' + parentName + '&level=2'
                                }
                                if (type) {
                                    urlLocate = urlLocate + '&type=' + type;
                                }
                            }
                            urlLocate = oCol ? urlLocate + '&oCol='+oColParam+'&stype='+stypeParam + '&countTap=' +countTapParam : urlLocate;
                            URL.assign(urlLocate);
                        }
                    }
                }
            }))
            istap = true;
        }
        dialog.show();
        $('#sortPage dd').eq(0).siblings().remove();
        if(sort_name == '品牌'){
            $('#sortPage .navbar-main').text('品牌');
            $('#sortPage').addClass('sortBrandsList').removeClass('sortCateList');
            fetchBrandsList(clevel);

        }
        if(sort_name == '品类'){
            $('#sortPage .navbar-main').text('品类');
            $('#sortPage').addClass('sortCateList').removeClass('sortBrandsList');
            fetchCatesList();
        }

        if(istap){
            $('#sortPage').on('tap', '.sortMain dd span', function (event) {
                event.preventDefault();
                $('.sortMain dd span').removeClass('active');
                $(this).addClass('active');
            })
        }
    }
    function renderSearchResultNexter(){
        var template = '<div id="search-result" class="page-tabs-panel" data-role-scrollable="true"><ul class="goods-list grid"></ul></div>';
        $('#search-result').remove();
        $('.page-content').after(template);
        //$('.sortSecond').hide();

    }

    function searchItems(q){
        if(q){
            renderSearchResultNexter();
            $('.sortSecond').hide();
            var target = $('#search-result'),
                i = 0;
            var nexter = new Nexter({
                element: target,
                dataSource: Data.searchItems,
                enableScrollLoad: true,
                data: {
                    q: q,
                    orderColumn: oCol,//排序字段 1、权重 2、价格 3、销售数量
                    sortType: stype//排序类型 1、降序 2、升序
                },
            }).load().on('load:success', function (res) {
                i++;

                if (res.items.length) {

                    var html = htmlItems(res.items);
                    if (html.length) {
                        this.$('ul').append(html.join(''));
                        LoadImage(target);

                        $('.page-content').hide();
                        target.show();
                        target.find('.goods-list').show();
                        $('.associateValHtm').remove();
                        $('.navTit').show();
                    }
                }else{
                    bainx.broadcast('不存在“' + q + '”商品');
                    $('#search-result').hide();
                    $('.page-content').show();
                    $('.sortSecond').show();
                }
                if (i > 1) {
                    //bainx.broadcast('');
                    $('#search-result').show();
                }
            }).render();

            var sid,
                scrollEventHandle = function (event) {
                    event.preventDefault();
                    clearTimeout(sid);
                    sid = setTimeout(function () {
                        LoadImage(target);
                    }, 0);
                }
            target.on('scroll', scrollEventHandle);

            $('.associateValHtm').remove();
            $('.navTit').show();


        }
    }


    function itemSearchSuggest(q) {
        if (q) {
            Data.itemSearchSuggest(q).done(function (res) {
                $('.associateValHtm').remove();

                var html = [],
                    associateValHtm = '<ul class="associateValHtm"></ul>';
                $('#listPage').append(associateValHtm);
                $('.navTit').hide();
                if (res.length > 0) {
                    $.each(res, function () {
                        var template = '<li><a href="' + URL.list + '?q=' + this + '" tj_category="商品" tj_action="搜索商品" >' + this + '</a></li>';

                        html.push(bainx.tpl(template));
                    });
                    $('.associateValHtm').append(html.join(''));
                }
            })
        }
    }
    function hideNav(panel) {
        var nav = $('.page-tabs-nav', Page);
       // console.log(panel, panel.scrollTop(), nav.height() * 1.2);
        if (!nav.hasClass('show') && panel.scrollTop() > nav.height() * 1.2) {
            nav.removeClass('show');
            Page.removeClass('show-tabs-nav');
        }
    }

    function showNav() {
        $('.page-tabs-nav', Page).addClass('show');
    }

    function renderCate() {
        var wrapTemplate = '<div class="page-tabs-panel" data-role-scrollable="true" data-category-id="'+cid+'"><ul class="goods-list grid"></ul></div>';

        var content = $('.page-tabs-content', Page).html(wrapTemplate);


        oCol = URL.param.oCol;
        stype = URL.param.stype;

        if(stype == 1 && oCol == 2){             //价格降序
            $('.sortPrice i.down').addClass('active');
        }else if(stype == 1 && oCol == 3){          //销量降序
            $('.sortDiscount i.down').addClass('active');
        }else if(stype == 2 && oCol == 2){          //价格升序
            $('.sortPrice i.up').addClass('active');
        }else if(stype == 2 && oCol == 3){          //销量升序
            $('.sortDiscount i.up').addClass('active');
        }



        var data = {
            cateId: cid,//分类ID
            brandId: brandId,//品牌ID
            cateLevel:clevel,//分类等级
            orderColumn:oCol,//排序字段 1、权重 2、价格 3、销售数量
            sortType:stype//排序类型 1、降序 2、升序
        }

        if (!sessionStorage.getItem('cidParent')) {
            sessionStorage.setItem('cidParent', cid);
        }
        cidParent = sessionStorage.getItem('cidParent');
        if (!sessionStorage.getItem('cidName')) {
            sessionStorage.setItem('cidName', name);
        }
        cidName = sessionStorage.getItem('cidName');


        if(brandId){
            $('.sortBrand').addClass('active');
        }

        if (clevel == '3') {
            $('.sortCate').addClass('active');
        }
        renderCateNexter(data);
    }

    function renderCateNexter(data) {

        Page.find('.page-tabs-panel').each(function(index, ele) {
            var element = $(ele);

            var nexter = new Nexter({
                element: element,
                dataSource: Data.fetchItems,
                enableScrollLoad: true,
                data: data,

                //pageSize:16
            }).load().on('load:success', function(res) {


                var html = htmlItems(res.items);

                element.show();
                //element.show().css('height','690px');
                if (html.length) {
                    this.$('ul').append(html.join(''));


                    LoadImage(this.element);
                    //refreshCart();
                } else if (this.get('pageIndex') == 0) {
                    this.$('ul').html('<li class="not-has-goods-msg"><img src="'+URL.imgPath+'/common/images/loading_fail.png"/><p>灰常抱歉，暂时没有数据哦</p> </li>');
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
            element.on('scroll', scrollEventHandle);

        });

    }

    function htmlItems(items) {
        var template = '<div class="goods col col-50" data-id="{{itemId}}"><div class="listimg" href="' + URL.goodsDetail + '?gid={{itemId}}" tj_category="商品" tj_action="{{title}}"><img data-lazyload-src="{{listimg}}" />{{soldOut}}{{_htmlFlagS}}</div><div class="goods-info"><h1><span class="title">{{title}}</span><span class="spec">{{_htmlLimit}}</span><span class="no-post-fee">{{noPostFee}}</span></h1><p><span class="price">{{_htmlPrice}}</span><span class="refprice">{{_htmlRelPrice}}</span><span class="discount {{discountClass}}">{{discount}}折</span></p><p class="brokeFee {{brokerageFeehide}}">推广费：<span class="price">{{brokerageFee}}</span></p><div class="soldnum"><div style="width:{{threshold}}%"></div><p>已售{{saleTotal}}件</p></div><a class="add-cart {{soldOutCartState}}"></a><div class="count">{{cartCount}}</div></div>{{_htmlFlag}}</div>',
            html = [],
            _index = 0;


        if ($.isArray(items) && items.length) {

            $.each(items, function(index, item) {

                if (index % 2 == 0) {
                    html.push('<li class="row">');
                }
                var goods = Goods.create(item);
                (item.isTaxFree == 1)  ? goods._htmlFlag = '<div class="goods-flag"><img class="flag-taxFree" src="'+URL.imgPath+'common/images/icon_label_dutyFree.png" /></div>' : '';
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
        refreshCart();
        return html;
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

                    var offset = $(".category-handle").offset(),
                        cloneViewOffset = $('.listimg', view).offset(),
                        imgUrl = view.find('.listimg').children('img').attr('src'), //获取当前点击图片链接
                        flyerWidth = $('.listimg img', view).width(),
                    //flyerHeight = $('.listimg img', view).height(),
                        flyer = $('<div class="listimg move-wrap"><img class="flyer-img" src="' + imgUrl + '"></div>'); //抛物体对象

                    flyer.find('.flyer-img').width(flyerWidth);
                    //flyer.find('.flyer-img').height(flyerHeight);

                    flyer.fly({
                        start: {
                            left: cloneViewOffset.left,//抛物体起点横坐标
                            top: cloneViewOffset.top //抛物体起点纵坐标

                        },
                        end: {
                            left: offset.left + 10,//抛物体终点横坐标
                            top: offset.top + 10, //抛物体终点纵坐标
                            width: 10,
                            height: 10
                        },
                        speed: 1.2,
                        vertex_Rtop: 50, //运动轨迹最高点top值，默认20
                        onEnd: function () {
                            //$("#tip").show().animate({width: '200px'},300).fadeOut(500);////成功加入购物车动画效果
                            this.destory(); //销毁抛物体
                        }
                    });

                },
                count: 1,
                view: view
            }).always(function(res) {
                item.count > 0 ? view.find('.count').text(item.count).css({visibility: "visible"}) : view.find('.count').css({visibility: "hidden"});
                refreshCart();

            }).fail(function(json) {

                if (item.goods.flag.immediatelyBuy) {
                    URL.assign(URL.goodsDetail + '?gid=' + item.id);
                } else {
                    alert(json && json.msg || '同步购物车失败！');

                    if (!item.goods.itemNum) {
                        Cart.removeItem(item);
                    }
                }

            });
        }
    }

    function renderSmallCart() {
        /*Cart.renderSmallCart({
         wrap: $('footer', Page).addClass('grid'),
         submitText: '下单',
         href: '/api/h/1.0/cartPage.htm'
         });*/
    }

    function refreshCart() {
        Common.getCartCount();
        Common.isLogin && Cart.ready(function() {

//            renderSmallCart();
//            refreshListCount();
        });

    }

    function refreshListCount() {
        $('.goods .count', Page).hide();
        Cart.forEach(function(id, item) {
            //$('.goods[data-id="' + id + '"] .count', Page).text(item.count).show();
        });
    }

    init();
});
