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
        this._point = 0;
        this._coupon = 0;
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
        point: function() {
            return this._point;
        },
        coupon: function() {
            return this._coupon;
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
                if (item.goods.flag.disablePoint) {
                    console.log('不支持积分的商品', item);
                } else {
                    this._point += item.sum;
                }
                if (item.goods.flag.disableCoupon) {
                    console.log('不支持优惠券的商品', item);
                } else {
                    this._coupon += item.sum;
                }
                //不计运费
                if (item.goods.flag.noPostFee) {
                    this._noPostFee = true;
                }
                //不支持配送
                if (item.goods.flag.unableDistribution) {
                    this._unableDistribution++;
                }
                //不支持货到付款
                if (item.goods.flag.unableDelivery) {
                    this._unableDelivery++;
                }
            }
        }

    };

    var exports = new itemsList();

    return exports;
});


define('./timeSelectDialog', [
    'jquery',
    'h5/js/common/transDialog'
], function($, Dialog) {
    var exports = Dialog.extend({
        attrs: $.extend({}, Dialog.templates.bottom, {
            value: null,
            onHideDestroy: true,
            options: null,
            date: null,
            dateOption: null,
            hoursOption: null,
            title: '请选择配送时间'
        }),
        events: {
            'change .date': '_changeDateSelect',
            'change .hours': '_changeHoursSelect',
            'tap .enter': function(event) {
                event.preventDefault();
            },
            'tap .date-item': function(event) {
                event.preventDefault();
                this._changeDateSelect($(event.currentTarget));
            },
            'tap .hours-item': function(event) {
                event.preventDefault();
                this._changeHoursSelect($(event.currentTarget));
            }
        },
        setup: function() {
            exports.superclass.setup.call(this);
            this.get('header').addClass('tc').text(this.get('title'));
            this.element.addClass('wl-time-select-dialog').find('.dialog-content').html('<div class="time-select-content row"><div class="col date-options-layout"></div><div class="col hours-options-layout"></div></div>').addClass('grid');
            return this;
        },
        _onRenderOptions: function(options) {
            console.log(options);
            var html = createOptionsList('date', options),
                layout = this.$('.date-options-layout').html(html);
            this._changeDateSelect(layout.find('.date-item').eq(0));
        },
        _changeDateSelect: function(element) {
            var S = this,
                val = element.data('value'),
                options = S.get('options');
            S.$('.date-options-layout .date-item.active').removeClass('active');
            element.addClass('active');
            $.each(options, function(index, option) {
                if (option.value == val) {
                    console.log(option);
                    S.set('hoursOption', null);
                    S.set('dateOption', option);
                    return false;
                }
            });
        },
        _onRenderDateOption: function(option) {
            var S = this,
                html = createOptionsList('hours', option.options),
                layout = S.$('.hours-options-layout').html(html);
            //S._changeHoursSelect(layout.find('.hours-item').eq(0));
        },

        _changeHoursSelect: function(element) {
            var S = this,
                val = element.data('value'),
                dateOption = S.get('dateOption');

            $.each(dateOption.options, function(index, option) {
                if (option.value == val) {
                    S.set('hoursOption', option);
                }
            })
        },
        _onRenderHoursOption: function(option) {
            if (!option) return this;
            var S = this,
                dateOption = S.get('dateOption'),
                hoursOption = option,
                date = dateOption.value,
                hours = hoursOption.value,
                now = S.get('date') || new Date(),
                year = now.getFullYear(),
                month = now.getMonth(),
                day = now.getDate();

            now = (new Date((new Date(year, month, day)).getTime() + (date * 24 + hours) * 3600000)).getTime();

            now = hoursOption.text == '30分钟速达' ? -1 : now;

            if (S.rendered) {
                S.set('value', now);
            }
        },
        getText: function() {
            var dateOption = this.get('dateOption'),
                hoursOption = this.get('hoursOption');
            return (hoursOption.text != '30分钟速达' ? dateOption.text : '') + hoursOption.text;
        }
    });

    function createOptionsList(className, options) {
        var template = '<li class="' + className + '-item" data-value="{{value}}">{{text}}</li>',
            html = [];
        $.each(options, function(index, option) {
            html.push(bainx.tpl(template, option));
        });
        html.unshift('<ul class="' + className + '">');
        html.push('</ul>');
        return html.join('');
    }

    return exports;
});

define('./adTimeOptions', [
    'jquery'
], function($) {
    var timeSolt = [{
            value: 9.5,
            text: '09:30 ~ 12:00',
        }, {
            value: 12,
            text: '12:00 ~ 14:30',
        }, {
            value: 14.5,
            text: '14:30 ~ 17:00',
        }, {
            value: 17,
            text: '17:00 ~ 19:30'
        }],
        date = new Date(),
        hours = date.getHours(),
        minutes = date.getMinutes(),
        today = {
            value: 0,
            text: '今天',
            options: [],
        },
        options = [{
            value: 1,
            text: '明天',
            options: []
        }, {
            value: 2,
            text: '后天',
            options: []
        }];

    var tmp = hours + minutes / 60,
        flag = false;

    //tmp += tmp > 13 ? 4 : 0;
    //
    if(tmp >= 10 && tmp <= 19){
        today.options.unshift({
            value : -1,
            text : '30分钟速达'
        });
    }

    $.each(timeSolt, function(index, ts) {
        if (flag) {
            today.options.push(ts);
        }
        if (!flag && ts.value > tmp) {
            today.options.push(ts);
            flag = true;
        }
        options[0].options.push(ts);
        options[1].options.push(ts);
    });
    if (today.options.length) {
        options.unshift(today);
    }

    function value(date, dateOption, hoursOption) {
        var _date = dateOption.value,
            _hours = hoursOption.value,
            now = date,
            year = now.getFullYear(),
            month = now.getMonth(),
            day = now.getDate();

        now = (new Date((new Date(year, month, day)).getTime() + (_date * 24 + _hours) * 3600000)).getTime();
        return {
            value: (hoursOption.text == '30分钟速达' ? -1 : now),
            text: (hoursOption.text != '30分钟速达' ? dateOption.text : '') + hoursOption.text,
            date: date
        }
    }

    var exports = value(new Date(), options[0], options[0].options[0]);
    exports.options = options;
    return exports;
});



require([
    'jquery',
    'h5/js/common',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/common/goods',
    'h5/js/common/translate',
    './orderItemsList',
    './timeSelectDialog',
    './adTimeOptions',
    'h5/js/common/payer',
    'h5/js/common/storage',
    'h5/js/common/weixin',
    'h5/js/common/point',
    'h5/js/common/coupon',
    'h5/js/common/transDialog',
    'h5/js/common/consignee',
    'h5/js/common/consigneeDialog',
    'h5/js/common/shop'
], function($, Common, URL, Data, Goods, Translate, Items, TimeSelectDialog, AdTimeOptions, Payer, Storage, Weixin, WLPoint, WLCoupon, Dialog, WLConsignee, ConsigneeDialog, Shop) {

    var tj_goodsids=[],
        DISABLE = 'disable',
        AJAXBUSY = 'ajax-busy',
        Body = $('body'),
        Page, //页面Ele对象
        unableDelivery = 0,//是否支持货到付款
        Consignees,
        Consignee, //用户默认收货地址
    //StoresAddress = Storage.ShopInfo.get(), //自提点地址
        DistributionMode, //收货方式， 1:配送, 2:自提  
        GoodsSumPrice = 0, //交易的商品的
        PostFee = 0, //运费
        postFeeStep = 0,//免邮费总金额
        UsePoint = 0, //使用的积分数量
        pointTotal = 0, //积分总数量
        IsUsePoint = false,
        CouponList, //可用优惠券列表
        CouponListPage, //优惠券列表页面
        Coupon, //选择使用的优惠券
        CouponTotal = 0,//可以使用优惠券的金额
        AdTime = AdTimeOptions, //配送时间
        Payment = Payer.payments[0], //支付方式
        goodsList = '',//商品列表 ;
        isflag = true,           //只能下一次单
        isTaxFree,//是否免税
        idCard;//身份证
    var boxId = URL.param.boxId;

    function init() {

        StoresAddress = Shop.currentShop();

        getAllInfo();

        //Common.isParentUserShow();
    }

    //获取全部结算数据
    function getAllInfo() {

        var data = {
            items: pack().items
        };

        if(boxId){
            data.mineScBoxId = boxId;
            data.orderType = 12;
        }

        Data.confirmOrder(data).done(function (res) {

            postFeeStep = res.postFeeStep;
            CouponList = res.coupons;
            GoodsSumPrice = res.totalFee ? (res.totalFee - res.post_fee) : 0;
            CouponTotal = res.coupons ? res.coupons.length : 0;
            PostFee = res.post_fee;
            pointTotal = res.point ? res.point : 0;
            isTaxFree = res.isTaxFree;
            //idCard = res.idCard ? res.idCard : '';

            Page = renderPage();
            initDistributionMode($('.distribution-mode', Page));

            goodsList = getGoodsList(res.prodVO);

            renderOrderGoods();
            bindEvents();
        });
    }

    //获取商品
    function getGoodsList(data) {
        var goodsHtml = [],
            newGoods = new Goods(),
            template = '<li class="row goods" data-id="{{id}}" ><div class="thumb"><img src="{{listimg}}" alt="{{title}}" /></div><div class="col fb fvc"><div><h3 class="pb-10"><span class="title">{{title}}</span><!--<span class="spec">{{specification}}</span>--></h3><!--<p><span class="money">{{price}}</span><span class="count">{{count}}</span></p>--></div></div><!--<div class="col fb fvc"><span class="price">{{price}}</span><span class="count">{{count}}</span></div>--></li>';

        if (data) {
            $(data).each(function (index, item) {

                var //goods = newGoods.init(item),
                    goodsdata = {
                        id: item.prodId,
                        listimg: item.prodPicUrls,
                        title: item.prodName,
                       // price: goods._htmlPrice,
                      //  count: item.num
                    };

                var item = bainx.tpl(template, goodsdata);
                goodsHtml.push(item);
            });

            return goodsHtml.join(' ');
        }

        return '';
    }

    function renderPage() {
        $('body').append('<section id="placeOrderPage"></section><footer class="grid disable"></footer>');

        Common.headerHtml('确认订单','',false,'#placeOrderPage');

        $('#placeOrderPage').append(bainx.tpl('<div class="page-content grid"><div class="consignee-layout page-layout grid"><h2 class="page-layout-head row distribution-mode fvc"></h2><div class="consignee page-layout-content row"></div></div><div class="page-layout distribution-layout grid"><!--<div class="page-layout-head row fvc distri-head"></div>--><div class="content page-layout-content grid hide idCardMessage"><div class="row"><div class="col message-wrap"><span class="ness">*</span><input class="id-card"  placeholder="身份证号码（填写后，我们将加密处理）"  /></div></div><div class="moreDetail"><div class="showMore"><span>展开说明</span></div> <div class="messageBox hide"><p>因各海关政策不同，部分海关需对收货人身份信息进行认证，错误信息可能导致无法正常清关。</p><p>您的身份证信息将加密保管，米酷保证信息安全，绝不对外泄漏！</p><p>任何身份认证问题可联系我们<a href="tel:'+Common.companyTel+'">'+Common.companyTel+'</a>(9:00-18:00)</p></div> </div></div><div class="content page-layout-content grid"><div class="row"><div class="col message-wrap"><textarea class="leave-word" rows="1" placeholder="给我们留个言呗~～" maxlength="140"></textarea></div></div></div></div><div class="page-layout buy-detail-layout"><h2 class="page-layout-head">订单详情</h2><div class="page-layout-content"><div class="goods-list-layout"></div><div class="order-sum grid"></div></div></div></div>', data));
        var ret = $('#placeOrderPage');

        if(isTaxFree == 1){
            $('.idCardMessage').show();
        }

        var dataTemplate = '<div class="{{className}} row fvc"><div class="col col-15">{{title}}</div><p class="col col-9 fb far money">{{value}}</p><div class="col col-1"></div></div>';
        var data = [{
                className: 'payment',
                title: '支付方式',
                value: Payment.title,
                icon: Payment.icon,
                template: '<div class="paymentWay"><h4>{{title}}</h4><div class="{{className}} row fvc"><div class="col col-10"><img width="20" height="20" src="{{icon}}" />{{value}}</div><div class="col col-12 fb far fvc payment-value "><i class="checked"></i></div><!--<div class="col col-3 right-icon fb far fvc"></div>--></div></div> '
            }, {
                className: 'sum-price',
                title: '商品金额',
                value: Common.moneyString(GoodsSumPrice),
                template: dataTemplate
            },
            //{
            //    className: 'distribution-cost',
            //    title: '配送费用(满' + Common.moneyString(postFeeStep) + '免费)',
            //    value: Common.moneyString(PostFee),
            //    template: dataTemplate
            //}
        ],
            html = [];
        data.forEach(function (val, index) {
            html.push(bainx.tpl(val.template, val));
        });

        $('.buy-detail-layout .order-sum').html(html.join(''));

        renderSubmit();

        return ret;
    }

    function bindEvents() {
        var mapPage;

        Page.on('tap', '.icon-return', function (event) {
            event.preventDefault();
            Common.returnPrePage();
        }).on('focus', '.leave-word,.id-card', function (event) {
            event.preventDefault();
            //var textbox = $(this);
            //setTimeout(function() {
            //    $(document).one('tap', function(event) {
            //        textbox.trigger('blur');
            //    });
            //}, 0);
        }).on('tap', '.time-select-handle, .payment, .icon-pay, .coupon, .not-in-range, .consignee', function (event) {
            event.preventDefault();
            var target = $(this);
            if (target.hasClass('time-select-handle')) {
                showTimeSelectDialog();
            } /*else if (target.hasClass('payment')) {
             showPaymentDialog();
             }*//* else if (target.hasClass('icon-pay')) {
             var _this = $(this);
             togglePayment(_this);
             }*/ else if (target.hasClass('coupon')) {
                initCouponListPage();
            } else if (target.hasClass('not-in-range')) {
                require('h5/js/common/mapDialog', function(WLMapDialog) {
                    var mapDialog = new WLMapDialog().show().set('shopId', StoresAddress.id);
                });
            } else if (target.hasClass('consignee') && DistributionMode == 1) {
                showConsigneeDialog();
            }

        }).on('tap swipeLeft swipeRight', '.point-switch', SwitchPointEventHandle)
          .on('tap','.showMore',function(event){
            event.preventDefault();
            if($(this).children('span').hasClass('active')){
                $(this).children('span').text('展开说明').removeClass('active');
                $(this).parent('.moreDetail').find('.messageBox').hide();
            }else{
                $(this).children('span').text('收起说明').addClass('active');
                $(this).parent('.moreDetail').find('.messageBox').show();
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

    function showPaymentDialog() {
        new Payer({

            payment: Payment,
            unableDelivery: unableDelivery,
            template: '<section class="wl-trans-dialog wl-bottom-dialog"><section class="header"><div class="content navbar"><div class="btn-navbar navbar-left"><a class="icon icon-return"></a></div><div class="navbar-main">支付方式</div></div></section><div class="dialog-mask"></div><div class="dialog-body page-content"><div class="dialog-header"></div><div class="dialog-content"></div></div><div class="close"></div></section>'

        }).on('change:payment', function(payment) {
            Payment = payment;
            $('.payment-value', Page).html('<img src="' + payment.icon + '" width="28" height="28" />' + payment.title);
            this.hide();
            renderGoodsSum();
        }).show();
    }

    function togglePayment(_this) {

        console.log(payments);

        var toggleTemplate = '<span class="icon-pay payment-item icon-pay-alipay {{active}}" data-index="{{index}}"></span><span class="icon-pay payment-item icon-pay-wechat" data-index="{{index}}"></span>';

        new Payer({});

        _this.addClass('active').siblings().removeClass('active');
        //item.addClass('active');
        var index = _this.index(),
            payments = _this.get('payment'),
            payment = payments[index];
        this.set('payment', payment);

    }

    function showTimeSelectDialog() {
        new TimeSelectDialog({
            id: 'time-select-dialog',
            options: AdTimeOptions.options,
            date: AdTimeOptions.date || new Date()
        }).on('change:value', function(value) {
            AdTime = {
                value: value,
                text: this.getText()
            }
            renderAdTime();
            this.hide();
        }).show();
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
            renderDistriHead();
            mode.refresh();
            //renderSubmit();
        });
        DistributionMode = defaultMode.mode; //收货方式

        defaultMode.refresh();
        renderDistriHead();

    }

    function renderDistriHead() {
        var data = {
                1: {
                    title: '配送时间',
                    time: AdTime.text,
                    icon: '<div class="col col-2 right-icon fb fvc far"></div>'
                },
                2: {
                    title: '服务时间',
                    time: StoresAddress && StoresAddress.openingHours || '09:30 ~ 19:30',
                }
            },
            className = 'time-select-handle',
            target = $('.distri-head', Page).html(bainx.tpl('<h2 class="col col-8">{{title}}</h2><div class="col col-12 tr time-value">{{time}}</div>{{icon}}', data[DistributionMode]));
        if (DistributionMode == 1) {
            target.addClass(className);
        } else {
            target.removeClass(className);
        }
    }

    function renderAdTime() {
        $('.time-value', Page).text(AdTime.text);
    }

    /**
     * 渲染确认下单按钮
     * @return {[type]} [description]
     */
    function renderSubmit() {
        $('footer').html('<div class="row"><div class="col col-50 fb fvc fac amount-payable"></div><div class="col col-50 fb fvc fac active-do-pay disable"></div></div>').addClass('disable');

        renderAmountPayable();
    }

    function renderAmountPayable() {

        var money = GoodsSumPrice + PostFee;

        //只有不是货到付款，才能使用积分与优惠券
        if (Payment.value != 2) {
            money = money - UsePoint - (Coupon && Coupon.value || 0);
        }

        money = money < 0 ? 0 : money;

        var html = '合计:<span class="money">' + Common.moneyString(money) + '</span>';

        $('footer .amount-payable').html(html);
    }

    function enableActiveDoPay() {
        if ((DistributionMode == 2 && StoresAddress) || (Consignee )) {
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
     * 获取选择收货地址页面的URL
     * @return {[type]} [description]
     */
    function getEditConsigneeUrl() {
        return URL.root + "address.htm?mode=select&relurl=" + encodeURIComponent(location.href);
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
                    //notInRangeTemplate = '<div class="not-in-range grid"><div class="topicon"></div><div class="row fvc"><div class="col col-24">范围外暂不提供服务，查看配送范围</div><div class="col col-1 fb fvc far right-icon"></div></div></div>';

                target.html(bainx.tpl(template, Consignee));

                //填写身份证
                idCard = Consignee.idCard ? Consignee.idCard :'';

                $('.id-card').val(Common.plusStar(idCard,4,4));
                if(idCard != ''){
                    $('.moreDetail').hide();
                }


                //如果地址不在配送范围内，提示用户
                //$('.not-in-range', Page).remove();
                //if (Consignee && !Consignee.shop) {
                //    $('.consignee-layout', Page).append(notInRangeTemplate);
                //} else if (Consignee && !Consignee.inCurrentShop) {
                //
                //    $('.consignee-layout', Page).append('<div class="not-in-range grid"><div class="topicon"></div><div class="row fvc"><div class="col col-24">不在' + StoresAddress.name + '服务范围内，查看站点配送范围</div><div class="col col-1 fb fvc far right-icon"></div></div></div>');
                //}
                //用户选择地址后更新运费
                renderGoodsSum();
            } else {
                target.html('<div class="null-msg col col-24">请设置收货地址！</div><div class="col col-1 right-icon fb fvc far"></div>');
            }
            enableActiveDoPay();
        })

        //$('.consignee', Page).attr('href', getEditConsigneeUrl());
    }

    function checkConsignee() {
        return (DistributionMode == 2) || (Consignee && Consignee.inCurrentShop);
    }

    /**
     * 检查收货地址是否在配送范围内
     * @return {[type]} [description]
     */
    function checkInConsigneeRange() {
        if (DistributionMode == 1 && !(Consignee)) {
            alert('请设置收货地址！');
            $('.consignee', Page).trigger('tap');
            return false;
        }
        return true;
    }

    function initStoresAddress() {

        if (StoresAddress) {
            $('.consignee', Page)
                .html(bainx.tpl('<div><div class="row"><h2 class="col col-10">{{name}}</h2><h3 class="col col-15">{{phone}}</h3></div><p class="ellipsis">{{province}}{{city}}{{district}}{{location}}</p></div>', StoresAddress));
        } else {
            $('.consignee', Page).html('<div class="null-msg col">未知的站点服务地址</div>');
        }


        //用户选择自提后更新运费
        renderGoodsSum();
        enableActiveDoPay();
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

        renderGoodsSumPrice();

        renderPostFee();

        renderPoint();

        renderCoupon();

        renderAmountPayable();

    }

    function renderGoodsSumPrice() {
        $('.sum-price .money', Page).html(Common.moneyString(GoodsSumPrice));
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
            isflag = true;
            return;
        }
        //var num = $('.id-card').val();
        //num = num.toUpperCase();
        ////身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
        //if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) {
        //    bainx.broadcast('请输入正确的手机号');
        //    return;
        //}
        if(isflag){
            submit(btn);

            //统计
            if(tj_goodsids.length >0){

                $.each(tj_goodsids, function (tj_index, tj_item) {
                    tj_cnzz(tj_item,'','创建订单');
                });
            }
        }

    }

    /**
     * 提交订单
     * @return {[type]} [description]
     */
    function submit(btn) {
        if(idCard == ''){
            idCard = $('.id-card').val();
        }

        var data = pack();

        //if (DistributionMode == 1 ) {
        //    alert('对不起，您的配送地址不在服务范围内，敬请期待！');
        //    return;
        //}
        if (GoodsSumPrice) {

            var createOrderDoneFn = function(res) {

                    if (res.tradeId && res.pType) {
                        isflag = false;
                        Common.statistics('pay', 'create-order-' + res.pType, 'success', new Date().getTime() - startTime);

                        //app://pay?data={"needPay":true,"tradeId":123456789}
                        //支持APP使用H5页面调用创建订单
                        if(Common.inWeLink){
                            var data = {
                                tradeId : res.tradeId,
                                needPay : res.tradeStatus == 2
                            };
                            location.href = 'app://pay?data='+encodeURIComponent(JSON.stringify(data));
                            return;
                        }

                        if (res.tradeStatus == 2) {
                            switch (res.pType) {
                                case 3:
                                    Common.state(URL.orderDetail + '?oid=' + res.tradeId, 'replace');
                                    Data.doPay(res).done(aliPayDoneFn).done(function() {
                                        Common.statistics('pay', 'alipay', 'invoke', 1);

                                        //统计
                                        if(tj_goodsids.length >0){
                                            $.each(tj_goodsids, function (tj_index, tj_item) {
                                                tj_cnzz(tj_item,'','订单支付成功');
                                            });
                                        }

                                    }).fail(aliPayFailFn);
                                    break;
                                case 4:
                                    Weixin.pay(res).done(function() {
                                        Common.statistics('pay', 'wxpay', 'invoke', 1);

                                        //统计
                                        if(tj_goodsids.length >0){
                                            $.each(tj_goodsids, function (tj_index, tj_item) {
                                                tj_cnzz(tj_item,'','订单支付成功');
                                            });
                                        }

                                        if(res.tradeType == 9){
                                            location.href = URL.joinAgencySuccess;
                                        }else{
                                            location.href = URL.payResult + '?oid=' + res.tradeId + '&type=1';
                                        }

                                    }).fail(function() {
                                        Common.state(URL.payResult + '?oid=' + res.tradeId + '&type=0', 'replace');
                                        location.href = URL.payResult + '?oid=' + res.tradeId + '&type=0';
                                    });
                                    break;
                                default:
                                    alert('不支持的支付方式' + res.pType);
                                    break;
                            }
                        } else {
                            Common.state(URL.payResult + '?oid=' + res.tradeId  + '&type=1', 'replace');
                            if(res.tradeType == 9){
                                location.href = URL.joinAgencySuccess;
                            }else {
                                location.href = URL.payResult + '?oid=' + res.tradeId + '&type=1';
                            }
                        }
                    } else {
                        Common.state(URL.index, 'replace');
                        alert('创建订单失败！');
                    }
                },
                createOrderFailFn = function(code, json) {
                    if (json.result && json.result.failItems) {
                        var msg = [];
                        $.each(json.result.failItems, function(key, items) {
                            items && items.length && $.each(items, function(index, item) {
                                var goods = Goods.query(item.itemId);

                                if (goods) {
                                    if (item.cap) {
                                        msg.push('还可以购买' + item.cap + '件' + goods.title);
                                    } else {
                                        msg.push('不可以购买' + goods.title);
                                    }
                                }
                            });
                        });
                        //if(msg.length >= 1){
                        //    alert(msg.join());
                        //}

                    } else {
                        //alert(json && json.msg || '创建订单失败');
                    }
                },
                aliPayDoneFn = function(res) {
                    if (res && res.fm) {
                        console.log(res.fm);
                        Common.statistics('pay', 'alipay', 'success', new Date().getTime() - startTime);
                        if (Common.inWeixin) {
                            location.href = URL.alipayDrawboard + '?fm=' + encodeURIComponent(res.fm);
                        } else {
                            location.href = 'http://wappaygw.alipay.com/service/rest.htm?' + decodeURIComponent(res.fm);
                        }
                    } else {
                        alert('支付宝支付失败!');
                    }
                },
                aliPayFailFn = function(code, json) {
                    alert(json && json.msg || '支付宝支付失败');
                    location.href = URL.payResult + '?oid=' + res.tradeId + '&type=0';
                };

            var startTime;
            //创建订单
            startTime = new Date().getTime();
            Common.statistics('pay', 'create-order-' + data.pType, 'invoke', 1);

            Data.createOrder(data).done(createOrderDoneFn).fail(createOrderFailFn);

        } else {
            alert('您还没有选购商品！');
        }
    }

    function pack() {
        var pUserId = URL.param.pUserId ? parseInt(URL.param.pUserId) : 0;

        if(URL.param.pUserId == 'undefined'){
            pUserId = 0;
        }
        var data = {

            msg: (function() {
                var leaveWord = $('.leave-word', Page),
                    vLeaveWord = leaveWord.val();

                if (vLeaveWord && vLeaveWord.length > parseInt(leaveWord.attr('maxlength'))) {
                    vLeaveWord = vLeaveWord.substr(0, 140);
                }
                return vLeaveWord;
            })(),
            point: UsePoint || 0,
            couponId: Coupon && Coupon.userCouponId || null,
            items: (function() {
                var goodsIds = URL.param.goods,
                    goodsId = URL.param.gid,
                    goodsCount = URL.param.count,
                    map = goodsIds ? URL.param.goods.split(';') : [],
                    items = [];
                if (map.length) {

                    tj_goodsids = []; //清空统计数据

                    $.each(map, function (index, item) {
                        var tmp = item.split(',');
                        if (tmp.length == 2) {

                            //统计
                            tj_goodsids.push(tmp[0]);

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
            pType: Payment.value,
            adTime: (AdTime.value == -1 ? (new Date()).getTime() : AdTime.value),
            orderType: URL.param.type == 9 ? 9 :(boxId ? 12 : 1),
            idCard: idCard,
            isTaxFree: isTaxFree,
            pUserId:pUserId
        }
        if(boxId){
            data.mineScBoxId = boxId
        }

        if (URL.param.from == 'cart') {
            data.from = 'cart';
        }

        if (DistributionMode == 2) {
            data.spId = pageConfig.shopid;
        }


        return data;
    }

    //统计goods_id:商品ID ,is_add 是否新添加
    function tj_cnzz(goods_id,is_add,action_name){
        if(URL.site.indexOf('miku') >= 0) {

            _czc.push(['_trackEvent', '商品',goods_id, action_name, '支付', '']);
        }
    }

    function renderPoint() {
        //如果支付方式是货到付款 or  订单不支持使用积分
        if (Payment.value == 2 || !pointTotal) { //URL.param.nopoint ||
            $('.order-sum .point', Page).remove();
            return;
        }

        if (pointTotal) {
            var target = $('.order-sum .point', Page),
                score = canUsePointTotal(),
                scoreMoney = Common.moneyString(score);

            if (!target.length) {
                target = $('<div class="point row fvc"><div class="col col-15 point-score">可用' + score + '积分抵扣' + scoreMoney + '元</div><div class="col col-9 fb fvc far"><div class="switch point-switch ' + (UsePoint ? 'on' : '') + '"></div></div><div class="col col-1"></div></div>').appendTo($('.order-sum', Page))
            } else {
                $('.point-score', target).html('可用' + score + '积分抵扣' + scoreMoney + '元');
            }
        }

    }

    //计算能使用的积分
    function canUsePointTotal() {
        var couponVal = Coupon && Coupon.value || 0,
            moneyVal = GoodsSumPrice - couponVal,
            score = 0;
        if (GoodsSumPrice >= (pointTotal + couponVal)) {
            score = pointTotal;
        } else {
            if (moneyVal > 0) {
                score = moneyVal >= pointTotal ? pointTotal : moneyVal;
            }

        }

        return score;
    }

    function usePoint() {

        UsePoint = IsUsePoint ? canUsePointTotal() : 0;

        renderPoint();
        renderAmountPayable();
    }

    function SwitchPointEventHandle(event) {
        event && event.preventDefault();
        var btn = $(this);
        //不使用积分
        if (btn.hasClass('on')) {
            btn.removeClass('on');
            IsUsePoint = false;
            usePoint();
        }
        //使用积分
        else {
            btn.addClass('on');
            IsUsePoint = true;
            usePoint();
        }
    }

    function renderCoupon() {
        var target = $('.order-sum .coupon', Page);
        if (Payment.value == 2) {
            target.remove();
            return;
        }
        if (target.length) {
            return;
        }

        if (CouponTotal) {
            $('.order-sum .coupon', Page).remove();
            $('<div class="coupon row fvc"><div class="col col-15">优惠券</div><p class="col col-9 fb far coupon-value">有可用优惠券</p><div class="col col-1 right-icon fb fvc far"></div></div>').appendTo($('.order-sum', Page));
        }

        if (Coupon) {
            $('.order-sum .coupon-value').html('<span class="money">' + Common.moneyString(Coupon.value) + '</span>');
        }
    }

    function initCouponListPage(event) {
        event && event.preventDefault();

        if (!CouponListPage) {
            if (CouponTotal) {
                var template = '<li class="couponItem row" data-index="{{_index}}" data-id="{{key}}"><div class="col fb far"><div class="coupon"><img src="{{picUrl}}" /></div></div><div class="col fb fac fvc"><div><p>有效期至<br/>{{endTime_html}}</p><h2 class="button">立即使用</h2></div></div></li>',
                    html = [];
                $(CouponList).each(function (id, item) {
                    item.endTime_html = bainx.formatDate('Y-m-d', new Date(item.endTime));
                    item.value_html = item.value / 100;
                    item.key = id;
                    html.push(bainx.tpl(template, item));
                });
                if (html.length) {

                    CouponListPage = new Dialog($.extend({}, Dialog.templates.right, {
                        template: '<section id="couponPage"><div class="coupon-list-layout"><ul class="coupon-list grid">' + html.join('') + '</ul></div><div class="footer"><div class="button unUseCoupon-button">不使用优惠券</div></div></section>',
                        events: {
                            'tap .couponItem': function(e) {
                                e.preventDefault();
                                var couponItem = $(e.currentTarget),
                                    id = couponItem.data('id');
                                Coupon = CouponList[id];
                                $('.order-sum .coupon-value').html('<span class="money">' + Common.moneyString(Coupon.value) + '</span>');
                                usePoint();
                                this.hide();
                            },
                            'tap .unUseCoupon-button': function(e) {
                                e.preventDefault();
                                Coupon = null;
                                $('.order-sum .coupon-value').html('有可用优惠券');
                                usePoint();
                                this.hide();
                            }
                        }
                    }));
                }
            }

        }
        CouponListPage && CouponListPage.show();
    }

    Shop.ready(init);

});
