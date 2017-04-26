/**
 * Created by Spades-k on 2015/12/25.
 */

define('./orderItem', [
    'h5/js/common',
    'h5/js/common/url'
], function (Common, URL) {

    function Item(goods, count) {
        this.goods = goods;
        this.count = count;
        this.sum = this.goods.price * count;
    }
    Item.prototype.html = function() {
        var template = '<li class="row goods" data-id="{{id}}" href="' + URL.goodsDetail + '?gid={{id}}"><div class="thumb"><img src="{{listimg}}" alt="{{title}}" /></div><div class="col fb fvc"><div><h3 class="pb-10"><span class="title">{{title}}</span><span class="spec">{{specification}}</span></h3><p><span class="money">{{price}}</span><span class="count">{{count}}</span></p></div></div><!--<div class="col fb fvc"><span class="price">{{price}}</span><span class="count">{{count}}</span></div>--></li>',
            data = {
                id: this.goods.itemId,
                listimg: this.goods.listimg,
                title: this.goods.title,
                price: this.goods._htmlPrice,
                count: this.count
            };
        return bainx.tpl(template, data);
    }
    return Item;
});

define('./orderItemsList', [
    './orderItem',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/common/goods',
    'h5/js/common/cart',
], function(Item, URL, Data, Goods, Cart) {

    function itemsList() {
        this._sum = 0;
        this._total = 0;
        this._html = [];
        this._map = {};
        this._noPostFee = false;
        this._unableDistribution = 0;
        this._unableDelivery = 0;
        this._pomi = $.Deferred();
        this._pomi.promise(this);
    }

    itemsList.prototype = {
        ready: function(callback) {
            this.done(callback);
            if (!this._ready) {
                var param = URL.param;
                //如果URL传递商品ID与商品数量， 则使用此数据
                if (param.gid && param.count) {
                    //获取商品数据
                    this._fetch(param.gid, param.count);
                    this.from = 'single';
                }
                //如果传递的是商品列表
                else if (param.goods) {
                    var map = param.goods.split(';'),
                        items = {};
                    if (map.length) {
                        $.each(map, function(index, item) {
                            var tmp = item.split(',');
                            if (tmp.length == 2) {
                                items[tmp[0]] = tmp[1];
                            }
                        });
                        this._fetch(items);
                        this.from = param.from || 'multi';
                    }
                }
                //否则使用购物车数据
                else {
                    this._fetch();
                    this.from = 'cart';
                }
                this._ready = true;
            }
            return this;
        },
        unableDistribution: function() {
            return !!this._unableDistribution;
        },
        unableDelivery: function() {
            return !!this._unableDelivery;
        },
        /**
         * 订单的配送费， 30元起送
         * @return {[type]} [description]
         */
        postFee: function() {
            return (this._sum >= 3000 || this._noPostFee) ? 0 : 1;
        },
        sum: function() {
            return this._sum;
        },
        total: function() {
            return this._total;
        },
        html: function() {
            return this._html.join('');
        },
        query: function(id) {
            return this._map[id];
        },
        forEach: function(callback) {
            $.each(this._map, callback);
            return this;
        },
        checkLimit: function() {
            var S = this,
                ids = [],
                pomi = $.Deferred();
            S.forEach(function(index, item) {
                if (item.goods.flag.limit) {
                    ids.push(item.goods.itemId);
                }
            });
            if (ids.length) {
                Data.checkActiveOrder(ids.join(',')).done(function(res) {
                    var fail = [];
                    if (res && res.itemLimits) {
                        $.each(res.itemLimits, function(index, item) {
                            var it = S.query(item.itemId);
                            if (it.count > item.cap) {
                                fail.push(it.goods.limitMsg(item.cap));
                            }
                        });
                    }
                    if (fail.length) {
                        pomi.reject({
                            msg: fail.join('')
                        });
                    } else {
                        pomi.resolve();
                    }
                }).fail(function() {
                    pomi.reject(arguments);
                });
            } else {
                pomi.resolve();
            }
            return pomi.promise();
        },
        _fetch: function() {
            var S = this;
            if (arguments.length == 1 && $.isPlainObject(arguments[0])) {
                var data = arguments[0],
                    ids = [];
                $.each(data, function(id, count) {
                    ids.push(id);
                });
                Goods.fetch(ids.join(';')).done(function() {
                    $.each(data, function(id, count) {
                        S._add(id, count);
                    });
                    S._pomi.resolve();
                }).fail(function() {
                    S._pomi.reject();
                });
            } else if (arguments.length == 2) {
                var id = arguments[0],
                    count = arguments[1];
                Goods.fetch(id).done(function() {
                    S._add(id, count);
                    S._pomi.resolve();
                }).fail(function() {
                    S._pomi.reject();
                });
            } else {
                Cart.ready(function() {
                    Cart.forEach(function(id, item) {
                        S._add(id, item.count);
                    });
                    S._pomi.resolve();
                }).fail(function() {
                    S._pomi.reject();
                });
            }
            return S;
        },
        _initItem: function(id, count) {
            var S = this,
                goods = Goods.query(id);
            if (goods) {
                var item = new Item(goods, count);
                S._map[id] = item;
                return item;
            }
        },
        _add: function(id, count) {
            var item = this._initItem(id, count);
            if (item) {
                this._sum += item.sum;
                this._total++;
                this._html.push(item.html());
            }
        }

    };

    var exports = new itemsList();

    return exports;
});

require([
    'jquery',
    'h5/js/common',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/common/goods',
    'h5/js/common/transDialog',
    'h5/js/common/consignee',
    'h5/js/common/consigneeDialog',
    'h5/js/common/shop'
], function($, Common, URL, Data, Goods, Dialog, WLConsignee, ConsigneeDialog) {

    var DISABLE = 'disable',
        AJAXBUSY = 'ajax-busy',
        Body = $('body'),
        Page, //页面Ele对象
        unableDelivery = 0,//是否支持货到付款
        Consignees,
        Consignee, //用户默认收货地址
        DistributionMode, //收货方式， 1:配送, 2:自提
        GoodsSumPrice = 0, //交易的商品的
        PostFee = 0, //运费
        postFeeStep = 0,//免邮费总金额
        goodsList = ''//商品列表 ;

    function init() {

        getAllInfo();
        weiXinShare();

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


    //获取全部结算数据
    function getAllInfo() {

        var data = {
            items: pack().items
        };

        Data.confirmLotteryDraw(data).done(function (res) {

            postFeeStep = res.postFeeStep;
            GoodsSumPrice = res.totalFee ? (res.totalFee - res.post_fee) : 0;
            PostFee = res.post_fee;

            Page = renderPage();
            initDistributionMode($('.distribution-mode', Page));

            goodsList = getGoodsList(res.items);

            renderOrderGoods();
            bindEvents();
        });
    }

    //获取商品
    function getGoodsList(data) {
        var goodsHtml = [],
            newGoods = new Goods(),
            template = '<li class="row goods" data-id="{{id}}" href="' + URL.goodsDetail + '?gid={{id}}"><div class="thumb"><img src="{{listimg}}" alt="{{title}}" /></div><div class="col fb fvc"><div><h3 class="pb-10"><span class="title">{{title}}</span><span class="spec">{{specification}}</span></h3><p><span class="money">{{price}}</span><span class="count">{{count}}</span></p></div></div><!--<div class="col fb fvc"><span class="price">{{price}}</span><span class="count">{{count}}</span></div>--></li>';

        if (data) {
            $(data).each(function (index, item) {

                var goods = newGoods.init(item),
                    goodsdata = {
                        id: goods.itemId,
                        listimg: goods.listimg,
                        title: goods.title,
                        price: goods._htmlPrice,
                        count: item.num
                    };

                var item = bainx.tpl(template, goodsdata);
                goodsHtml.push(item);
            });

            return goodsHtml.join(' ');
        }

        return '';
    }

    function renderPage() {

        $('body').append('<section id="placeOrderPage"><div class="page-content grid"><div class="consignee-layout page-layout grid"><h2 class="page-layout-head row distribution-mode fvc"></h2><div class="consignee page-layout-content row"></div></div><div class="page-layout buy-detail-layout"><h2 class="page-layout-head">奖品详情</h2><div class="page-layout-content"><div class="goods-list-layout"></div></div></div></div></section><footer class="grid disable"></footer>');
        var ret = $('#placeOrderPage');
        Common.headerHtml('领取奖品','',false,ret);
        renderSubmit();

        return ret;
    }

    function bindEvents() {
        var mapPage;

        Page.on('tap', '.time-select-handle, .payment, .icon-pay, .not-in-range, .consignee', function (event) {
            event.preventDefault();
            var target = $(this);
            if (target.hasClass('not-in-range')) {
                require('h5/js/common/mapDialog', function(WLMapDialog) {
                    var mapDialog = new WLMapDialog().show().set('shopId', StoresAddress.id);
                });
            } else if (target.hasClass('consignee') && DistributionMode == 1) {
                showConsigneeDialog();
            }

        });

        $('body').on('tap', 'footer .active-do-pay', function(event) {
            event.preventDefault();
            submitEventHandle($(this));
        })
    }

    function showConsigneeDialog() {
        if (!WLConsignee.all.isEmpty()) {
            new ConsigneeDialog($.extend({}, Dialog.templates.bottom, {
                consignees: WLConsignee.all(),
                title: '请选择地址',
                eventClassName: 'editBox',
                onSelectConsigneeHide: true
            })).after('hide', function() {
                if (this.rendered) {
                    /*Consignees = this.get('consignees');
                     Consignee = ConsigneeDialog.getDefaultConsignee(Consignees);*/
                    renderConsignee();
                }
            }).show();
        } else {
            require('h5/js/common/editConsigneeDialog', function(EditConsigneeDialog) {
                new EditConsigneeDialog({
                    title: '添加收货地址',
                    eventClassName: 'addBox'
                }).on('consignees', function(consignees) {
                    if (this.rendered) {
                        /*ConsigneeDialog.mixinShop(consignees);
                         Consignees = consignees;
                         Consignee = ConsigneeDialog.getDefaultConsignee(Consignees);*/
                        renderConsignee();
                        this.hide();
                    }
                }).show();
            });
        }
    }

    function initDistributionMode(wrap) {

        function getDefaultMode() {

            return data['1'];
        }

        function setDefaultMode(mode) {
            sessionStorage['distribution-mode'] = mode;
        }

        var data = {
                //Benz 分支只支持配送了
                '1':{
                    title: '配送上门',
                    refresh: initConsignee
                }
            },
            itemTemplate = '<div data-mode="{{mode}}" class="col fb fac fvc {{className}}">{{title}}</div>',
            html = [];

        var defaultMode = getDefaultMode();

        $.each(data, function(key, item) {
            item.mode = key;
            if (defaultMode.mode == key) {
                item.className = 'active';
            }

            html.push(bainx.tpl(itemTemplate, item));
        });

        var active_strong;
        wrap.html(html.join('')).on('tap', '.col', function(event) {
            event.preventDefault();
            if (active_strong == this) {
                return;
            }
            active_strong = this;
            var btn = $(this),
                mode_key = btn.data('mode'),
                mode = data[mode_key];

            $('.active', wrap).removeClass('active');
            btn.addClass('active');
            setDefaultMode(mode_key);
            $('.not-in-range', Page).remove();
            $('.consignee-content', Page).html('');
            $('.consignee', Page).removeAttr('href').off();
            DistributionMode = mode_key;
            //renderDistriHead();
            mode.refresh();
            //renderSubmit();
        });
        DistributionMode = defaultMode.mode; //收货方式

        defaultMode.refresh();
        //renderDistriHead();

    }


    /**
     * 渲染确认下单按钮
     * @return {[type]} [description]
     */
    function renderSubmit() {
        $('footer').html('<div class="row"><div class="col col-50 fb fvc fac active-do-pay disable"></div></div>').addClass('disable');

    }


    function enableActiveDoPay() {
        if (DistributionMode == 2 || Consignee) {
            $('footer, .active-do-pay').removeClass('disable');
        } else {
            $('footer, .active-do-pay').addClass('disable');
        }
    }

    /**
     * 初始化收货地址
     * @return {[type]}      [description]
     */
    function initConsignee() {
        renderConsignee();
    }


    /**
     * 渲染用户收货地址
     * @param  {[type]} consignee [description]
     * @return {[type]}           [description]
     */
    function renderConsignee() {

        WLConsignee.ready(function() {

            var target = $('.consignee', Page);

            Consignee = WLConsignee.default();

            if (Consignee) {


                var template = '<div class="col col-23"><div class="row"><h2 class="col col-10">{{receiverName}}</h2><h3 class="col col-15">{{receiverMobile}}</h3></div><p class="ellipsis">{{receiver_state}}{{receiverCity}}{{receiverDistrict}}{{receiverAddress}}</p></div><div class="col col-2 right-icon fb fvc far"></div>';

                target.html(bainx.tpl(template, Consignee));

            } else {
                target.html('<div class="null-msg col col-24">请设置收货地址！</div><div class="col col-1 right-icon fb fvc far"></div>');
            }
            enableActiveDoPay();
        })

        //$('.consignee', Page).attr('href', getEditConsigneeUrl());
    }

    function checkConsignee() {
        return DistributionMode == 2 || Consignee;
    }

    /**
     * 检查收货地址是否在配送范围内
     * @return {[type]} [description]
     */
    function checkInConsigneeRange() {
        if (DistributionMode == 1 && !Consignee) {
            alert('请设置收货地址！');
            $('.consignee', Page).trigger('tap');
            return false;
        }
        return true;
    }


    /**
     * 渲染商品总价运费等信息
     * @param  {[type]} sum [description]
     * @return {[type]}     [description]
     */
    function renderGoodsSum(sum) {

        //商品总价
        GoodsSumPrice = sum || GoodsSumPrice;
        //配送费
        PostFee = DistributionMode == 1 ? PostFee : 0;

        renderPostFee();

    }

    function renderPostFee() {
        $('.distribution-cost .money', Page).html(Common.moneyString(PostFee));
    }

    /**
     * 渲染商品数据
     * @return {[type]} [description]
     */
    function renderOrderGoods() {
        //var list = goodsList ? goodsList : Items.html();
        $('.goods-list-layout', Page).html('<ul class="goods-list clearfix">' + goodsList + '</ul>');

        renderGoodsSum(GoodsSumPrice);
    }

    /**
     * 提交下单事件处理
     * @param  {[type]} btn [description]
     * @return {[type]}     [description]
     */
    function submitEventHandle(btn) {
        if (btn.hasClass(DISABLE) || btn.hasClass(AJAXBUSY) || !checkInConsigneeRange()) {

            bainx.broadcast($('.null-msg').text());
            return;
        }
        submit(btn);
    }

    /**
     * 提交订单
     * @return {[type]} [description]
     */
    function submit(btn) {
        var data = pack();

        //if (DistributionMode == 1 && !checkConsignee()) {
        //    alert('对不起，您的配送地址不在服务范围内，敬请期待！');
        //    return;
        //}


        Data.lotteryDrawOrder(data).done(function(res) {

            bainx.broadcast('领取成功');

            Common.state(URL.orderDetail + '?oid=' + res.trade.tradeId, 'replace');

            location.href = URL.orderDetail + '?oid=' + res.trade.tradeId;

        }).fail(function() {

                bainx.broadcast('领取失败');
                //alert('失败')
        })

    }

    function pack() {

        var data = {

            msg: "",
            items: (function() {
                var goodsIds = URL.param.goods,
                    goodsId = URL.param.gid,
                    goodsCount = URL.param.count,
                    map = goodsIds ? URL.param.goods.split(';') : [],
                    items = [];
                if (map.length) {
                    $.each(map, function (index, item) {
                        var tmp = item.split(',');
                        if (tmp.length == 2) {
                            items.push({
                                'item_id': tmp[0],
                                'num': tmp[1]
                            });
                        }
                    });
                }

                if (items.length) {
                    return JSON.stringify(items);
                }

                if (goodsId) {
                    goodsCount = goodsCount ? goodsCount : 1;
                    return JSON.stringify([{'item_id': goodsId, 'num': goodsCount}]);
                }

                return '';
            })(),
            pType: 0,
            adTime: 0
        }

        if (URL.param.from == 'cart') {
            data.from = 'cart';
        }

        if (DistributionMode == 2) {
            data.spId = pageConfig.shopid;
        }

        console.log(data);
        return data;
    }

    init();

});
