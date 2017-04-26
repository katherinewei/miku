require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/payer',
    'h5/js/common/weixin'
], function($, URL, Data, Common, Payer, Weixin) {

    var ORDER_STATUS = {
        '2': '待付款',  //dateCreated 待付款
        '3' :'已发货',
        '4': '调配中',  //payTime  待发货
        '6': '调配中',  //consignTime 待发货
        '5': '已发货',  //confirmTime 待收货
        '7': '待评价',  //endTime  已完成
        '8': '已退款',  //endTime  已评价
        '9': '已关闭'   //endTime 已关闭
    };
    var Page,
        TradeId,
        Detail,
        iscrowdfund = URL.param.iscrowdfund;

    function init() {
        var TradeId = URL.param.oid;
        if (TradeId) {
            Data.getOrderDetail(TradeId).done(function(res) {
                Detail = res;
                render(Detail);
            });
        }
    }

    function render(detail) {
        Common.headerHtml('订单详情');
        var html = getOrderDetailHtml(detail);
        $('body').append(html);
        Page = $('#order-detail');
        bindEvents(Page, detail);
        //renderShopIndo(detail.trade.communityId);
    }

    /*function renderShopIndo(shopid) {
        Data.getShop().done(function(res) {
            $.each(res.cityCommunity, function(index, shopInfo) {
                if (shopInfo.id == shopid) {
                    $('.shop-info').html('<span class="shop-name">' + shopInfo.name + '</span><span class="shop-phone">' + shopInfo.phone + '</span>');
                    return false;
                }
            })
        });
    }*/

    function bindEvents(page, detail) {
        $('body').on('tap', '.dopay, .cancel-order', function(event) {
            event.preventDefault();
            var target = $(this);
            if (target.hasClass('dopay')) {
                showPaymentDialog(target, detail);
            } else if (target.hasClass('cancel-order') && window.confirm('您要取消此订单吗？')) {
                cancelOrder(target, detail.trade.tradeId);
            }
        }).on('tap', '.sure-order', function (event) {
            event.preventDefault();
            var target = $(this);
            if (window.confirm("您要确认收货吗？")) {
                sureOrder(target, detail.trade.tradeId);
                event.stopPropagation();
            }
        }).on('tap', '.product-comment', function (event) {
            event.stopPropagation();
            var tradeId = $(this).parents('#order-detail').find('.trade-id').text();
            console.log(tradeId);
            location.href = URL.itemCommentsPage + '?tradeId=' + tradeId;
        });

    }

    function showPaymentDialog(btn, detail) {
        new Payer({
            unableDelivery: (detail.trade.coupon || detail.trade.point) ? 2 : 0
        }).on('change:payment', function(payment) {
            this.hide();
            doPay(detail, btn, payment.value);
        }).show();
    }

    function doPay(detail, btn, payment) {
        if (detail && detail.trade.status == 2) {
            if (!btn.hasClass('disable')) {
                btn.addClass('disable');
                var data = {
                        tradeId: detail.trade.tradeId,
                        pType: payment
                    },

                    aliPayDoneFn = function(res) {
                        if (res && res.fm) {
                            console.log(res.fm);
                            Common.statistics('pay', 'alipay', 'success', new Date().getTime() - startTime);
                            if (Common.inWeixin) {
                                location.href = '/api/h/1.0/alipayDrawboard.htm?fm=' + encodeURIComponent(res.fm);
                            } else {
                                location.href = 'http://wappaygw.alipay.com/service/rest.htm?' + decodeURIComponent(res.fm);
                            }
                        } else {
                            alert('支付宝支付失败!');
                            btn.removeClass('disable');
                        }
                    },
                    aliPayFailFn = function(code, json) {
                        alert(json && json.msg || '支付宝支付失败');
                        btn.removeClass('disable');
                        //location.href = '/api/h/1.0/orderDetail.htm?oid=' + res.tradeId;
                    };

                var startTime = new Date().getTime();
                Common.statistics('pay', 'order-' + payment, 'invoke', 1);

                switch (payment) {
                    case 2:
                        Data.doPay(data).done(function(res) {
                            Common.statistics('pay', 'delivery', 'success', new Date().getTime() - startTime);
                            location.reload();
                        }).fail(function() {
                            alert('货到付款支付失败' + JSON.stringify(arguments));
                            btn.removeClass('disable');
                        });
                        break;
                    case 3:
                        Data.doPay(data).done(function() {
                            Common.statistics('pay', 'alipay', 'invoke', 1);
                        }).done(aliPayDoneFn).fail(aliPayFailFn);
                        break;
                    case 4:
                        //Data.doPay(res).done(wxPayDoneFn).fail(wxPayFailFn);
                        Weixin.pay(data).done(function() {
                            Common.statistics('pay', 'wxpay', 'invoke', 1);
                            if(res.tradeType == 9){
                                location.href = URL.joinAgencySuccess;
                            }else {
                                location.href = URL.payResult + '?oid=' + detail.trade.tradeId + '&type=1';
                            }
                            //location.reload();
                        }).fail(function() {
                            location.href = URL.payResult + '?oid=' + detail.trade.tradeId + '&type=0';
                            btn.removeClass('disable');
                        });
                        break;
                    default:
                        alert('不支持的支付方式' + payment);
                        btn.removeClass('disable');
                        break;
                }
            }
        }
    }

    function cancelOrder(btn, tid) {
        var disable = 'disable';
        if (tid) {
            if (!btn.hasClass(disable)) {
                btn.addClass(disable);
                Data.cancelOrder(tid).done(function(res) {
                    btn.remove();
                    Common.state('indexPage.htm', 'replaceState');
                    if(iscrowdfund == 1){
                        URL.assign(URL.mineCrowdfundPage);
                    }else{
                        URL.assign(URL.orderList);
                    }
                    //URL.assign('/api/h/1.0/orderList.htm');

                }).fail(function() {
                    btn.removeClass(disable).text('取消订单');
                });
            }
        }
    }
    /*确认收货*/
    function sureOrder(btn,tid) {
        var disable = 'disable';

        if (tid) {
            if (!btn.hasClass(disable)) {
                btn.addClass(disable).text('确认中...');
                Data.sureOrder(tid).done(function (res) {
//                    $('.order-list_7 .order').remove();
                    /*var list = btn.parents('.order-list'),
                     order = btn.parents('.order').remove();
                     if (!list.find('.order').length) {
                     list.html(orderListNotHasData);
                     }*/
                    location.href = URL.orderList+'?state=2';


                }).fail(function () {
                    btn.removeClass(disable).text('确认收货');
                });
            }
        }
    }



    function getOrderDetailHtml(detail) {
        var module = {
                id: detail.trade.tradeId,
                dateCreated:bainx.formatDate('Y-m-d h:i', new Date(detail.trade.dateCreated)),
                statusDetail: (function() {
                    var html = [],
                        htmlTime = function(title, time) {
                            return '<h2>' + title + '<span>' + bainx.formatDate('Y-m-d h:i', new Date(time)) + '</span></h2>';
                        }
                    if (detail.trade.dateCreated) {
                        html.push(htmlTime('创建订单', detail.trade.dateCreated));
                    }
                    if (detail.trade.payTime) {
                        html.push(htmlTime('完成支付', detail.trade.payTime));
                        switch (detail.trade.payType) {
                            case 2:
                                html.push('<p>使用货到付款</p>');
                                break;
                            case 3:
                                html.push('<p>使用支付宝付款</p>');
                                break;
                            case 4:
                                html.push('<p>使用微信支付付款</p>');
                                break;
                        }
                    }
                    if(detail.trade.payType == 2){
                        html.push('<h2>货到付款</h2>');
                    }
                    if (detail.trade.consignTime && detail.trade.status != 4) {
                        html.push(htmlTime('已备货', detail.trade.consignTime));
                    }
                    if (detail.trade.confirmTime && detail.trade.status != 4) {
                        html.push(htmlTime('配送时间', detail.trade.confirmTime));
                        if (detail.trade.deliverName && detail.trade.deliverMobile) {
                            //显示配送员信息
                            html.push('<div class="deliver-info"><img src="http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20150526/vNTT-0-1432626645067.jpg" /><h3>'+ detail.trade.deliverName +'</h3><h4>'+ detail.trade.deliverMobile +'</h4></div>');
                        }
                    }
                    if (detail.trade.endTime) {
                        html.push(htmlTime('完成时间', detail.trade.endTime));
                    }

                    switch(detail.trade.status){
                        case 2:
                            html.push('<p class="warning">请尽快付款，订单将在24小时内关闭！</p>');
                            break;
                        case 4:
                            html.push('<p>开始调配！ </p>');
                            break;
                        case 6:
                            html.push('<p>正在等待配送员配送！</p>');
                            break;
                        case 5:
                            html.push('<p>商品已经送出，请耐心等待哦！</p>');
                            break;
                        case 7:
                            html.push('<p>感谢您对“米酷”的鼎力支持！</p>');
                            break;
                        case 8:
                            html.push('<p>您的退款已完成！</p>');
                            break;
                    }

                    return html.join('');
                })(),
                status:  (function() {
                    var html =[];
                    if((detail.trade.status == 7 || detail.trade.status == 20) && detail.trade.buyerRate == 0 && iscrowdfund == 0){
                        ORDER_STATUS[detail.trade.status] = '待评价';
                    }
                    var ORDER_STATUS_IMG;
                    switch (detail.trade.status){
                        case 2:     //待付款
                            ORDER_STATUS_IMG = 'payment';
                            break;
                        case 4:     //备货中
                            ORDER_STATUS_IMG = 'payed';
                            break;
                        case 5:         //待收货
                            ORDER_STATUS_IMG = 'deliver';
                            break;
                        case 6:     //待发货
                            ORDER_STATUS_IMG = 'delivery';
                            break;
                        case 7:     //0待评价 1已完成
                            ORDER_STATUS_IMG = (detail.trade.buyerRate == 0) ? 'evaluate' : 'done';
                            break;
                        case 8:         //已退款
                            ORDER_STATUS_IMG = 'refund';
                            break;
                        case 9:         //已关闭
                            ORDER_STATUS_IMG = 'close';
                            break;
                    }

                    var tpl_status = '<img src="'+URL.imgPath + 'common/images/confirm_'+ORDER_STATUS_IMG+'.png"/>'+ORDER_STATUS[detail.trade.status];

                    html.push(tpl_status);
                    return html;
                    //ORDER_STATUS[detail.trade.status]
                })(),
               // statusClass : detail.trade.status == 2 ? 'dopay':'',
                /*name: detail.name,
                mobile: detail.mobile,
                addr: detail.addr,*/
                _htmlTotalFee: Common.moneyString(detail.trade.totalFee),
                moneyDetail: (function(param) {
                    return '<p><span>商品金额：</span>' + Common.moneyString(param.price) + '</p>' +
                        (param.point ? '<p><span>积分抵用：</span>' + Common.moneyString(param.point) + '</p>' : '') +
                        (param.coupon ? '<p><span>红包抵用：</span>' + Common.moneyString(param.coupon) + '</p>' : '') +
                        (param.postFee ? '<p><span>运费：</span>' + Common.moneyString(param.postFee) + '</p>' : '');
                })(detail.trade),
                goodsList: (function(items) {
                    var html = [],
                        template = '<li class="goods row" data-id="{{boxId}}"  href="'+URL.boxDetailPage+'?boxId={{boxId}}"><div class="col col-8"><img src="{{prodPicUrls}}"></div><div class="col col-17 fb fvc pl-10"><div><h3 class="pb-10"><span class="title">{{prodName}}</span><span class="count">{{num}}</span><!--<span class="spec">{{specification}}</span>--></h3><!--<p><span class="money">{{_htmlPrice}}</span><span class="count">{{num}}</span></p>--></div></div></li>';
                    if ($.isArray(items) && items.length) {
                        items.forEach(function(item, index) {
                            //var goods = Goods.create(item);
                            //goods.boxId = detail.trade.boxId;
                            html.push(bainx.tpl(template, item));
                           // console.log(bainx.tpl(template, goods))
                        });
                    }
                    return html.join('');
                })(detail.trade.mikuMineBoxProductVOList),
                actions: (function() {
                    var html = [];
                    if(detail.trade.status == 2 ){
                        html.push('<div class="col col-7 fb fvc fac cancel-order"></div><div class="col col-7 fb fvc fac dopay"></div>') ;
                    }
                    if(detail.trade.status == 5 ){
                        html.push('<div class="col col-5 fb fvc fac sure-order">确认收货</div>');
                    }
                    if((detail.trade.status == 7 || detail.trade.status == 20) && detail.trade.buyerRate == 0 && iscrowdfund == 0){
                        html.push('<div class="col col-5 fb fvc fac product-comment">立即评价</div>');
                    }
                    return html;

                })(),
                receiverInfo: (function(type, info, time, region) {
                    if (type != 1) { // 非自提订单显示收货人信息
                        var start = new Date(time),
                            end = new Date(time + region);

                        info.start = bainx.formatDate("m月d日 h:i", start);
                        info.end = bainx.formatDate("h:i", end);

                        var template = '<div id="receive-detail"><h1><span>配送详情</span></h1><div class="receiver-info"><p><span class="contact">{{contactName}}</span><span class="mobile">{{mobile}}</span></p><p class="address clearfix"><span>{{addr}}</span></p><!--<p class="appoint-delivery-time">预约时间：{{start}}~{{end}}</p>--></div></div>';

                        return bainx.tpl(template, info);
                    } else {
                        return '';
                    }

                })(detail.trade.shippingType, detail.logisticsDO, detail.trade.appointDTime, detail.region),

                communityName : detail.trade.communityName,
                communityMobile : detail.trade.communityMobile,
                detailInfo: (function(item){
                    var html = [],
                        template = '<p><span>收货人信息：</span></p><div class="row"><div class="col col-5"><span>{{contactName}}</span></div><div class="col col-16"><span>{{mobile}}</span></div></div><p>{{addr}}</p> ';
                    html.push(bainx.tpl(template, item));
                    return html.join('');

                })(detail.logisticsDO),
                hide:detail.trade.status == 5 || detail.trade.status == 7 || detail.trade.status == 20 ? '' : 'hide'
            },

        template = '<section id="order-detail-page"><div id="order-status-layout"><h1><span>订单状态</span></h1><div class="status-detail-layout"><div class="status-detail">{{statusDetail}}</div></div></div><div id="order-detail" class="grid"><h1><span>订单详情</span></h1><!--<div class="shop-info"><span class="shop-name">{{communityName}}</span><span class="shop-phone">{{communityMobile}}</span></div>--><div class="detail-info"><p><span>订单号：</span>{{id}}</p><p><span>下单时间</span>：{{dateCreated}}</p>{{detailInfo}}</div><div class="goods-list-layout "><ul class="goods-list">{{goodsList}}</ul></div><div class="logistics {{hide}} row"><div class="col col-18 fb fvc "></div><div class="col col-5 fb fvc fac" href="'+URL.logisticsInfoPage + '&tradeId={{id}}">查看物流</div></div><div class="payment"></div><div class="suminfo-layout row"><div class="col col-18 fb fvc suminfo"><p>合计：<span class="money">{{_htmlTotalFee}}</span></p></div>{{actions}}</div><div class="money-detail">{{moneyDetail}}</div></div></section><div id="order-status" class="grid ">{{status}}</div>';

        return bainx.tpl(template, module);
    }
    init();
});