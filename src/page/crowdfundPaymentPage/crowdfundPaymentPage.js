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

    'h5/js/common/transDialog',
    'h5/js/common/consignee',
    'h5/js/common/consigneeDialog',
    'h5/js/common/shop'
], function($, Common, URL, Data, Goods, Translate, Items, TimeSelectDialog, AdTimeOptions, Payer, Storage, Weixin, Dialog, WLConsignee, ConsigneeDialog, Shop) {

    var DISABLE = 'disable',
        AJAXBUSY = 'ajax-busy',
        Body = $('body'),
        Page, //页面Ele对象
        unableDelivery = 0,//是否支持货到付款
        Consignees,
        Consignee, //用户默认收货地址
    //StoresAddress = Storage.ShopInfo.get(), //自提点地址
        DistributionMode, //收货方式， 1:配送, 2:自提  
        GoodsSumPrice = 0, //交易的商品的总金额
        PostFee = 0, //运费
        postFeeStep = 0,//免邮费总金额
        AdTime = AdTimeOptions, //配送时间
        Payment = Payer.payments[0], //支付方式
        goodsList = '',//商品列表 ;
        crowdfundDetailId = URL.param.id,  //众筹商品明细id
        totleFee = 0,       //不包括运费总金额
        count = 1,          //购买数量
        itemNum = URL.param.itemNum,       //众筹明细商品库存
        isflag = true,           //只能下一次单
        idCard,
        isTaxFree;




    function init() {

        StoresAddress = Shop.currentShop();

        getAllInfo();
    }

    //获取全部结算数据
    function getAllInfo() {

        var data = {
            items: pack().items,
            orderType:7,            //下单类型(1=正常下单，7=众筹，8=抽奖下单)默认1
            crowdfundDetailId:crowdfundDetailId
        };

        Data.confirmOrder(data).done(function (res) {

            postFeeStep = res.postFeeStep;
            PostFee = res.post_fee;
            isTaxFree = res.isTaxFree;
            idCard = res.idCard ? res.idCard : '';

            console.log(isTaxFree,idCard);


            Page = renderPage();
            initDistributionMode($('.distribution-mode', Page));

            goodsList = getGoodsList(res);

            renderOrderGoods();
            bindEvents();

            if(isTaxFree == 1){
                $('.idCardMessage').show();
            }

        });
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


    function getGoodsList(data) {
        var goodsHtml = [],
            newGoods = new Goods(),
            template = '<div class="banner" id="banner"><div class="slider-outer"><ul class="carousel-wrap">{{pics}}</ul></div><div class="carousel-status"><ul></ul></div></div><div class="item"><h3>{{title}}</h3><p>支持金额<span class="price totlePrice" data-price="{{totlePrice}}">{{price}}</span></p><p class="distribution-cost ">配送运费<span class="money"></span></p></div><div class="item row"><div class="col fb fvc"><h3>支持数量:</h3></div><div class="col far fb fvc"><div class="form-control"><span class="btn minus-btn">-</span><input id="order-count-input" type="tel" readonly value="1" name="count" min="1" max="99"  autocomplete="off"><span class="btn plus-btn">+</span></div></div> </div><div class="item"><h3>回报内容</h3> <p>{{crowdReturnContent}}</p><h3>项目发起人承诺</h3><p>乐享团成功后{{crowdPlusDay}}天发货</p></div><div class="item"><p><b>备注：</b><input type="text" placeholder="给项目发起人留下备注信息" class="leave-word"></p></div><div class=" page-layout-content  item"><h3>收货人信息：</h3><div class="row consignee"></div> </div><div class="item row"><div class="col fb fvc"><h3>支付方式:</h3></div><div class="col far fb fvc"><div class="payment"><img src="' + URL.imgPath + '/common/images/confirm_wx_H.png" /> </div> </div> </div><div class="item"><h3>风险提示：</h3><p>1、乐享团并非商品交易，项目存在一定的风险，如果项目筹款成功，我将第一时间安排发货，乐享团产品不提供退货服务，如有质量问题，请与客服联系。<br />2、乐享团成功后，发放回报、开具发票及售后服务等事项均由我方负责。<br />3、如果乐享团失败，您支持的款项会全部原路退还给您。<br />4、本页面统计的项目支持人数和总支持金额存在一定的延迟，以单个回报详情为准。 </p></div><div class="item"><h3>特别说明：</h3><p>{{crowdSpecialNote}}</p></div>';

        if (data) {
            var item_T = data.items[0];
            //$(data).each(function (index, item) {

                if (item_T.pics && item_T.pics.length) {
                    var html = [];
                    item_T.pics = item_T.pics.split(';');
                    $.each(item_T.pics, function (index, pic) {
                        html.push('<li class="pic"><div class="pic-wrap"><img src="' + pic + '"></div></li>');
                    });
                    item_T.pics = html.join('');
                }
                item_T.totlePrice = moneyString(item_T.price);

                var goods = newGoods.init(item_T),
                    goodsdata = {
                        id: goods.itemId,
                        listimg: goods.listimg,
                        title: goods.title,
                        price: goods._htmlPrice,
                        count: item_T.num,
                        pics:item_T.pics,
                        totlePrice:item_T.totlePrice,
                        crowdReturnContent:data.crowdReturnContent,
                        crowdPlusDay:data.crowdPlusDay,
                        crowdRiskTips:data.crowdRiskTips,
                        crowdSpecialNote:data.crowdSpecialNote
                    };

                var items = bainx.tpl(template, goodsdata);
                goodsHtml.push(items);

           // });

            return goodsHtml.join(' ');

        }

        return '';
    }

    function renderPage() {

        Common.headerHtml('商品详情');

        $('body').append('<div class="page-content" id="placeOrderPage"><div id="item-info"><div class="info-wrap grid"><div class="order-sum"></div> </div> </div></div><footer class="grid disable"></footer>');


        var ret = $('#placeOrderPage');



        renderSubmit();

        return ret;
    }

    function bindEvents() {


        Page.on('tap', '.icon-return', function (event) {
            event.preventDefault();
            Common.returnPrePage();
        }).on('focus', '.leave-word', function (event) {
            event.preventDefault();
           // $('#toolbar').css('position','static');
            //var textbox = $(this);
            //setTimeout(function() {
            //    $(document).one('tap', function(event) {
            //        textbox.trigger('blur');
            //    });
            //}, 0);

        }).on('blur','.leave-word',function(event){
            event.preventDefault();
            //$('#toolbar').css('position','fixed');

        }).on('tap', '.time-select-handle, .payment, .icon-pay, .not-in-range, .consignee', function (event) {
            event.preventDefault();
            var target = $(this);
            if (target.hasClass('time-select-handle')) {
                showTimeSelectDialog();
            } else if (target.hasClass('not-in-range')) {
                require('h5/js/common/mapDialog', function(WLMapDialog) {
                    var mapDialog = new WLMapDialog().show().set('shopId', StoresAddress.id);
                });
            } else if (target.hasClass('consignee') && DistributionMode == 1) {
                showConsigneeDialog();
            }

        }).on('tap', '.minus-btn', minusFn)
        .on('tap', '.plus-btn', pushFn)
        .on('tap','.showMore',function(event){
            event.preventDefault();
            if($(this).children('span').hasClass('active')){
                $(this).children('span').text('收起详情').removeClass('active');
                $(this).parent('.moreDetail').find('.messageBox').hide();
            }else{
                $(this).children('span').text('展开详情').addClass('active');
                $(this).parent('.moreDetail').find('.messageBox').show();
            }
        });


        $('body').on('tap', 'footer .active-do-pay', function(event) {
            event.preventDefault();

            submitEventHandle($(this));




        })
    }
    function  minusFn() {
        var $count = $('#order-count-input');
        count = parseInt($count.val());
        if (count - 1 < 1) {
            return;
        }
        $count.val(count - 1);
        count = parseInt($count.val());
        refreshPrice();
    }

    function  pushFn() {
        var $count = $('#order-count-input');
        count = parseInt($count.val());
        count = count + 1;

        //goods.check(new_item_count, 1).done(function () {         //检查库存~~晚点做。。。。。
        if(count <= itemNum){
            $count.val(count);
            refreshPrice();
        }else{
            count = itemNum;
            alert('您购买的商品数量已超过商品库存，请重新选择');
        }

        //}).fail(function (json) {
        //    alert(json && json.msg || '未知错误');
        //});
    }


    //价格刷新
    function refreshPrice(){

        totleFee =  $('.totlePrice').data('price');
        totleFee = (totleFee * count).toFixed(2);
        $('.totlePrice').text(totleFee);
        $('.relPrice').text(totleFee);
        (totleFee > postFeeStep) ? PostFee = 0:PostFee;
        GoodsSumPrice = totleFee ? (totleFee - PostFee) : 0;
        renderAmountPayable();

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
            template: '<section class="wl-trans-dialog wl-bottom-dialog"><section class="header"><div class="content navbar"><div class="btn-navbar navbar-left"><span class="icon icon-return"></span></div><div class="navbar-main">支付方式</div></div></section><div class="dialog-mask"></div><div class="dialog-body page-content"><div class="dialog-header"></div><div class="dialog-content"></div></div><div class="close"></div></section>'

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

        $('footer').html('<div id="toolbar"><div class="hide amount-payable"></div> <a id="support-btn" class="active-do-pay disable">去支付</a></div></div>').addClass('disable');

    }

    function renderAmountPayable() {

        var money = (GoodsSumPrice + PostFee).toFixed(2);

        money = money < 0 ? 0 : money;

        var html = '合计:<span class="money">' + money + '</span>';

        $('footer .amount-payable').html(html);
    }

    function enableActiveDoPay() {
        if ((DistributionMode == 2 && StoresAddress) || (Consignee)) {
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

    //function checkConsignee() {
    //    return (DistributionMode == 2) || (Consignee && Consignee.inCurrentShop);
    //}

    /**
     * 检查收货地址是否在配送范围内
     * @return {[type]} [description]
     */
    function checkInConsigneeRange() {
        //if (DistributionMode == 1 && !(Consignee && Consignee.inCurrentShop)) {
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

        refreshPrice();

        //renderAmountPayable();



    }

    function renderGoodsSumPrice() {
        $('.sum-price .money', Page).html(moneyString(GoodsSumPrice));
    }

    function renderPostFee() {

        $('.distribution-cost .money', Page).html(moneyString(PostFee));
    }

    /**
     * 渲染商品数据
     * @return {[type]} [description]
     */
    function renderOrderGoods() {
        //var list = goodsList ? goodsList : Items.html();
        $('.order-sum', Page).html(goodsList);



        require('slider', function(Slider) {
            var ww = $(window).width();
            $('#pic-carousel .carousel-outer, #pic-carousel .carousel-outer li').width(ww);
            if ($('.pic').length > 1){
                Slider({
                    slideCell: "#banner",
                    titCell: ".carousel-status ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
                    mainCell: ".slider-outer ul",
                    effect: "left",
                    autoPlay: true,//自动播放
                    autoPage: true, //自动分页
                    // switchLoad:"_src" //切换加载，真实图片路径为"_src"
                });
            }
            //var slide = new Slider($('#pic-carousel'), {
            //    loop: 1,
            //    curIndex: 0,
            //    useTransform: 1,
            //    lazy: '.lazyimg',
            //    play: true, //动画自动播放
            //    interval: 3000,
            //    trigger: '.carousel-status',
            //    activeTriggerCls: 'sel',
            //    hasTrigger: 'tap',
            //});
        })



        renderGoodsSum(GoodsSumPrice);
    }

    /**
     * 提交下单事件处理
     * @param  {[type]} btn [description]
     * @return {[type]}     [description]
     */
    function submitEventHandle(btn) {



        if (btn.hasClass(DISABLE) || btn.hasClass(AJAXBUSY) || !checkInConsigneeRange() ) {

            bainx.broadcast($('.null-msg').text());
            isflag = true;

            return;
        }
        //var num = $('.id-card').val();
        //    num = num.toUpperCase();
        ////身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
        //if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) {
        //    bainx.broadcast('请输入正确的手机号');
        //    return;
        //}


        if(isflag){
            submit(btn);
        }

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
                                    Common.state(URL.orderDetail + '?oid=' + res.tradeId + '&iscrowdfund=1', 'replace');
                                    Data.doPay(res).done(aliPayDoneFn).done(function() {
                                        Common.statistics('pay', 'alipay', 'invoke', 1);
                                    }).fail(aliPayFailFn);
                                    break;
                                case 4:
                                    Weixin.pay(res).done(function() {
                                        Common.statistics('pay', 'wxpay', 'invoke', 1);
                                        if(res.tradeType == 9){
                                            location.href = URL.joinAgencySuccess;
                                        }else {
                                            location.href = URL.payResult + '?oid=' + res.tradeId + '&type=1&iscrowdfund=1';
                                        }
                                    }).fail(function() {
                                        Common.state(URL.payResult + '?oid=' + res.tradeId + '&type=0&iscrowdfund=1', 'replace');
                                        //location.href = URL.orderDetail + '?oid=' + res.tradeId + '&iscrowdfund=1';
                                        location.href = URL.payResult + '?oid=' + res.tradeId + '&type=0&iscrowdfund=1';
                                    });
                                    break;
                                default:
                                    alert('不支持的支付方式' + res.pType);
                                    break;
                            }
                        } else {
                            Common.state(URL.payResult + '?oid=' + res.tradeId + '&type=1&iscrowdfund=1', 'replace');
                            if(res.tradeType == 9){
                                location.href = URL.joinAgencySuccess;
                            }else {
                                location.href = URL.payResult + '?oid=' + res.tradeId + '&type=1&iscrowdfund=1';
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
                    location.href = URL.orderDetail + '?oid=' + res.tradeId + '&iscrowdfund=1';
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
        var pUserId = URL.param.pUserId ? URL.param.pUserId : 0;
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
                                    'num': count
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
            orderType: 7,
            crowdfundDetailId:crowdfundDetailId,
            pUserId:pUserId
        }



        if (DistributionMode == 2) {
            data.spId = pageConfig.shopid;
        }


        return data;
    }



    Shop.ready(init);

});
