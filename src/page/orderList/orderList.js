require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/payer',
    'h5/js/common/weixin',
    'h5/js/common/goods',
    'h5/js/common/nexter',
    'h5/js/common/storage',
    'h5/js/common/transDialog'
], function($, URL, Data, Common, Payer, Weixin, Goods, Nexter, Storage, Dialog) {

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
        Order = {},
        commentDialog,
        tradeStatus = '',
        currentState = 0,
        orderList,
        state = URL.param.state,
        orderListNotHasData = '<li class="not-has-order-msg"><div class="empty_img"><img src="' + URL.imgPath + 'common/images/bg_empty_order_list.png" alt=""></div><div class="empty_msg">去逛逛</div></li>',
        order_ststus_links = [
            {title: '全部', className: 'active', dataId: '', orderListClassName: 'show'},
            {title: '待付款', className: '', dataId: '2', orderListClassName: 'hide'},
            {title: '待收货', className: '', dataId: '5', orderListClassName: 'hide'},
            {title: '待评价', className: '', dataId: '7', orderListClassName: 'hide'},
            {title: '已完成', className: '', dataId: '71', orderListClassName: 'hide'}
        ];
    function init() {
        render();

        weiXinShare();
    }


    function weiXinShare(){
        if(Common.inWeixin){
            //console.log(document.title);
            var shareUrl = location.href;
            var shareImgUrl = imgPath + 'common/images/share_order.png',
                desc =  '你可以查看盒子订单的具体情况',
                shareOption = {
                    title: '9LAB-个人订单详情', // 分享标题
                    desc: desc, // 分享描述
                    link: shareUrl,
                    type: 'link',
                    dataUrl: '',
                    imgUrl: shareImgUrl
                },
                shareOptionTimeline = {
                    title: desc,
                    link: shareUrl,
                    imgUrl: shareImgUrl
                };

            Weixin.hideMenuItems();
            Weixin.showMenuItems();
            Weixin.share(shareOption, shareOptionTimeline);
        }
    }

    function render() {
        var orderTemplate = '<div class="order-list order-list_{{dataId}} {{orderListClassName}}"><ul class="list"></ul></div>',
            template = '<section id="order-list-page">'+htmlLinks(order_ststus_links,orderTemplate)+'</section>';

        $('body').append(template);
        Page = $('#order-list-page');
        orderList = Page.find('.order-list');
        orderStatusHtml();
        bindEvent(Page);
        if (state) {
            state = parseInt(state);
            switch (state) {
                case 0:
                    initNexter(orderList, 2, 1, false);
                    CurrentS(1);
                    break;
                case 1:
                    initNexter(orderList, 5, 2, false);
                    CurrentS(2);
                    break;
                case 2:
                    initNexter(orderList, 7, 3, false);
                    CurrentS(3);
                    break;
                case 3:
                    initNexter(orderList, 71, 4, false);
                    CurrentS(4);
                    break;
                //case 4:
                //    initNexter(orderList, 7, state, false);
                //    CurrentS(state);
                //    break;
                default:
                    break;
            }

        } else {
            initNexter(orderList, tradeStatus, '0', true, 1);
        }

    }
    /*状态*/
    function CurrentS(currentState) {
        ///*显示*/
        $('.order_status').eq(currentState).addClass('active').siblings().removeClass('active');
        $('.order-list').eq(currentState).show().siblings().hide();
    }
    function htmlLinks(links,template){
        var html = [];
        $.each(links, function(index, item){
            if(item.price) {
                item.price = Common.moneyString(item.price);
            }
            html.push(bainx.tpl(template, item));
        });
        return html.join('');
    }

    function initNexter(page, tradeStatus, current_status, flag) {
        page = page.eq(current_status);

        var data,
            tradeStatusNum = [7,20].join(',');
        switch(tradeStatus){
            case 2:
                data = {
                    tradeStatus: [1,2].join(',')
                };
                break;
            case 5:
                data = {
                    tradeStatus: [3,4,5,6].join(',')
                };
                break;
            case 7:
                data = {
                    buyerRate: 0,
                    tradeStatus: tradeStatusNum
                };
                break;
            case 71:
                data = {
                    buyerRate: 1,
                    tradeStatus: tradeStatusNum,
                };
                break;
            default:
                data = {
                    tradeStatus: tradeStatus
                };
        }
        var nexter = new Nexter({
            element: page,
            dataSource: Data.fetchTrades,
            enableScrollLoad: true,
            data: data
        }).on('load:success', function(res) {
            // console.log(res);


            var is_null = $('.order_main').attr('is_null');
            //currentState = $(this).index();

            if (res.trades.length) {
                var html = htmlItems(res.trades, tradeStatus);
            }

            //else if (!is_null && $('.order-list_2 li').length == 0 && flag) {
            //    initNexter(orderList, '', '1',false, 1);
            //    CurrentS(1);
            //    $('.order_main').attr('is_null', 1);
            //    currentState = 0;
            //
            //}
            if (is_null == 1) {
                currentState = 1;
            }
            console.log(current_status);
            //if (tradeStatus == '4,6') {
            //    tradeStatus = '4_6';
            //}


            if (res.trades.length == 0 && $('.order-list_' + tradeStatus + ' li').length == 0) {
                $('.order-list .list').eq(current_status).html(orderListNotHasData);
            }
            if (state && res.trades.length == 0 && $('.order-list_' + tradeStatus + ' li').length == 0) {
                $('.order-list .list').eq(state).html(orderListNotHasData);
            }

        }).render().load();
    }

    function htmlItems(items,tradeStatus, commentState) {
        var html = [],
            sel_target = $('.order-list_'+tradeStatus+' .list'),
            template = '<li class="grid order" data-id="{{tradeId}}" href="' + URL.orderDetail + '?oid={{tradeId}}&iscrowdfund=0"><div class="summary row"><div class="col col-18"><div class="create-time">订单号：{{tradeId}}</div><div class="create-time">下订时间：{{_htmlCreateTime}}</div></div><div class="col col-7 fb fvc far order-status">{{statusText}}</div></div><div class="goods-list-layout {{multiItems}}"><div class="scroll-box"><ul class="goods-list clearfix">{{goodsList}}</ul></div></div><div class="suminfo-layout "><div class="suminfo"><p>合计：<span class="money">{{_htmlTotalFee}}</span></p></div><div class="row btnGroups"><div class="col col-11"></div> {{actions}}</div></div></li>';
        $.each(items, function(index, item) {
            Order[item.tradeId] = item;
            item._htmlCreateTime = bainx.formatDate('Y-m-d h:i', new Date(item.dateCreated));


            item._htmlTotalFee = Common.moneyString(item.totalFee);
            item.multiItems = item.orderViewDOs.length == 1 ? '' : 'multi-items';
            item.goodsList = item.mikuMineScBoxDO ? htmlGoodsList(item.mikuMineScBoxDO) : '';
            item.width = item.orderViewDOs.length == 1 ? '100%' : (125 * item.orderViewDOs.length) + 'px';
            if (item.status == 2) {
                item.actions = '<div class="col col-5 fb fvc fac cancel-order"></div><div class="col col-5 fb fvc fac dopay"></div>'
            }

            item.actions_logis = '<div class="col col-5 fb fvc fac logistics">查看物流</div>'

            if (item.status == 5) {
                item.actions = item.actions_logis + '<div class="col col-5 fb fvc fac sure-order">确认收货</div>';
            }
            //todo 待评价
            if ((item.status == 7 || item.status == 20) && item.buyerRate == 0) {
                item.actions = item.actions_logis + '<div class="col col-5 fb fvc fac product-comment">立即评价</div>';
                ORDER_STATUS[7] = '待评价';
                ORDER_STATUS[20] = '待评价';
            }
            if ((item.status == 7 || item.status == 20) && item.buyerRate == 1) {
                item.actions = item.actions_logis;
                ORDER_STATUS[7] = '已完成';
                ORDER_STATUS[20] = '已完成';
            }

            if (item.status == 7 && tradeStatus == 71) {
                item.status = tradeStatus;
            }

            item.statusText = ORDER_STATUS[item.status];

            html.push(bainx.tpl(template, item));

        });


        sel_target.append(html.join(''));

    }

    //订单状态 lin 2015-10-30
    function orderStatusHtml(){
        var template = '<li class="col col-5 order_status {{className}}" data-id="{{dataId}}">{{title}}</li>',
         head_html = '<section id="orderPage"></section>';

        $('#order-list-page').before(head_html);
        Common.headerHtml('我的订单','',false,'#orderPage');

        $('.header').after('<div class="main grid"><ul class="order_main row">' + htmlLinks(order_ststus_links, template) + '</ul></div>');
    }

    function htmlGoodsList(item) {
        var template = /*items.length == 1 ? */'<li class="goods row" data-id="{{boxId}}" ><div class="thumb"><img src="{{pic}}" /></div><div class="col fb fvc"><div><h3 class="pb-05"><span class="title">{{boxName}}</span><!--<span class="spec">{{specification}}</span>--></h3><p><span class="money">{{_htmlPrice}}</span><!--<span class="count">{{num}}</span>--></p></div></div></li>'/* : '<li class="goods float-left" data-id="{{itemId}}" data-cateid="{{cateId}}" href="' + URL.goodsDetail + '?gid={{itemId}}"><div><img src="{{pic}}" /></div><div><h3 class="ellipsis"><span class="title">{{title}}</span><span class="spec">{{specification}}</span></h3><p><span class="money">{{_htmlPrice}}</span><span class="count">{{num}}</span></p></div></li>'*/,
           // suffix = item ? '!300q75' : '!small',
        html = [];


            //$.each(items, function(index, item) {
            if (item.picUrls) {
                item.pic = item.picUrls.split(';')[0];
            }
            item._htmlPrice = Common.moneyString(item.price);
            html.push(bainx.tpl(template, item));
            // });
            return html.join('');

    }

    function bindEvent(page) {
        page.on('tap', '.cancel-order, .dopay', function(event) {
            event.preventDefault();
            var target = $(this);
            if (target.hasClass('cancel-order') && window.confirm("您要取消此订单吗？")) {
                //var orderTabTit = target.parents('body').find('.order_status').data('id');
                //console.log(orderTabTit);
                cancelOrder(target);
                event.stopPropagation();
            } else if (target.hasClass('dopay')) {
                showPaymentDialog(target);
                event.stopPropagation();
            }
        }).on('tap','.not-has-order-msg .empty_msg',function(event){
            event.preventDefault();
            var target = $(this);
            location.href = URL.index;
        }).on('tap', '.sure-order', function (event) {
            event.preventDefault();
            var target = $(this);
            if (window.confirm("您要确认收货吗？")) {
                sureOrder(target);
                event.stopPropagation();
            }
        }).on('tap', '.product-comment', function (event) {
            event.stopPropagation();
            var tradeList = $(this).parents('.order');
            var tradeId = tradeList.attr('data-id');
            //var goodsItemJson = [];
            //
            //var goodsItems = tradeList.find('.goods');//title  price goodsId
            //$.each(goodsItems,function(index, item) {
            //    item.goodsId = goodsItems.eq(index).attr('data-id'),
            //    item.goodsImg = goodsItems.eq(index).find('.thumb img').attr('src'),
            //    item.goodsTitle = goodsItems.eq(index).find('.title').text(),
            //    item.goodsPrice = goodsItems.eq(index).find('.money').text();
            //
            //    var json = {
            //        id:item.goodsId,
            //        imgUrl: item.goodsImg,
            //        title:item.goodsTitle,
            //        price:item.goodsPrice
            //    };
            //
            //    //console.log(item.goodsId,item.goodsTitle,item.goodsPrice);
            //    goodsItemJson.push(json);
            //
            //});

            //goodsIds.join('');

            //bainx.broadcast('.product-comment');
            console.log(tradeId);
            //showCommentDialog(tradeId); // tradeId   buildingId {}

            location.href = URL.itemCommentsPage + '?tradeId=' + tradeId;

            //Data.getOrderDetail(tradeId).done(function(res) {
            //    showCommentDialog(res);
            //});
        }).on('tap', '.logistics', function (event) {
            event.stopPropagation();
            var tradeList = $(this).parents('.order');
            var tradeId = tradeList.attr('data-id');
            location.href = URL.logisticsInfoPage + '&tradeId=' + tradeId;
        });


        $('body').on('tap','.order_main .order_status',function(event){
            event.preventDefault();
            $('.order_main').attr('is_null', 2);
            currentState = $(this).index();
            var target = $(this),
                order_status = target.data('id'),
                order_list = $('.order-list'),
                sel_order_list= $('.order-list_'+order_status);

            target.addClass('active').siblings().removeClass('active');

            order_list.hide();
            sel_order_list.show();
            console.log($('.order-list_2 li').length == 0);
            if ($('.order-list_' + order_status + ' li').length == 0) {
                if (order_status !== "7") {
                    //数据加载
                    initNexter(orderList, order_status, currentState, false, 1);
                } else {
                    initNexter(orderList, '7', '3', false, 0);
                }
            }

        });
    }

    function cancelOrder(btn) {
        var tid = btn.parents('.order').data('id'),
            disable = 'disable';

        if (tid) {
            if (!btn.hasClass(disable)) {
                btn.addClass(disable);
                Data.cancelOrder(tid).done(function(res) {

                    $('.order-list_9 .order').remove();
                    if($('.order-list_2').css("display") == "block"){      //待付款
                        var list = btn.parents('.list'),
                            order = btn.parents('.order').remove();
                        if (!list.find('.order').length) {
                            list.append(orderListNotHasData);
                        }
                    }else{          //全部订单
                        $('.summary .order-status').text('已关闭');
                        btn.parents('.btnGroups').remove();
                    }


                }).fail(function() {
                    btn.removeClass(disable).text('取消订单');
                });
            }
        }
    }

    function showPaymentDialog(btn) {
        var tid = btn.parents('.order').data('id'),
            order = Order[tid];

        new Payer({
            unableDelivery: (order.coupon || order.point) ? 2 : 0
        }).on('change:payment', function(payment) {
            this.hide();
            $('.order-list_4 .order').remove();
            doPay(order, btn, payment.value);
        }).show();
    }

    function doPay(order, btn, payment) {
        var tid = order.tradeId;
        if (tid) {
            if (!btn.hasClass('disable')) {
                btn.addClass('disable');
                var data = {
                        tradeId: tid,
                        pType: payment
                    },

                    aliPayDoneFn = function(res) {
                        if (res && res.fm) {
                            console.log(res.fm);
                            Common.state(URL.orderDetail + '?oid=' + tid);
                            Common.statistics('pay', 'alipay', 'success', new Date().getTime() - startTime);
                            if (Common.inWeixin) {
                                location.href = URL.alipayDrawboard+'?fm=' + encodeURIComponent(res.fm);
                            } else {
                                location.href = 'http://wappaygw.alipay.com/service/rest.htm?' + decodeURIComponent(res.fm);
                            }
                        } else {
                            alert('支付宝支付失败!');
                            btn.removeClass('disable');
                            //location.href = '/api/h/1.0/orderDetail.htm?oid=' + tid
                        }
                    },
                    aliPayFailFn = function(code, json) {
                        alert(json && json.msg || '支付宝支付失败');
                        btn.removeClass('disable');
                        //location.href = '/api/h/1.0/orderDetail.htm?oid=' + tid
                    };

                var startTime = new Date().getTime();
                Common.statistics('pay', 'order-' + payment, 'invoke', 1);

                switch (payment) {
                    case 2:
                        Data.doPay(data).done(function(res) {
                            Common.statistics('pay', 'delivery', 'success', new Date().getTime() - startTime);
                            if(res.tradeType == 9){
                                location.href = URL.joinAgencySuccess;
                            }else {
                                location.href = URL.payResult + '?oid=' + tid + '&type=1';
                            }
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
                                location.href = URL.payResult + '?oid=' + tid + '&type=1';
                            }
                        }).fail(function() {
                            location.href = URL.payResult + '?oid=' + tid + '&type=0';
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

    function sureOrder(btn) {
        var tid = btn.parents('.order').data('id'),
            disable = 'disable';
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
                    //location.href = URL.orderDetail+'?oid=' + tid+'&iscrowdfund=0';
                    btn.addClass(disable).text('立即评价');
                    if (!commentDialog) {
                        commentDialog = new Dialog($.extend({}, Dialog.templates.bottom,{
                            template: '<section class="telDialog"><div class="cont"><p class="contactWay">确认收货成功，快去给宝贝评价吧！</p><p class="tel"></p><div class="btngroup"><span class="btn reset">取消</span><span href="'+URL.itemCommentsPage + '?tradeId=' + tid+'" class="btn ring">立即评价</span></div></div></section>',
                            events: {
                                'tap .reset': function (event) {
                                    event.preventDefault();
                                    commentDialog.hide();
                                    var order_list = $('.order-list');
                                    $('.order_status ').eq(3).addClass('active').siblings().removeClass('active');
                                    order_list.hide();
                                    $('.order-list_7').show();
                                    if ($('.order-list_7 li').length == 0) {
                                            initNexter(orderList, '7', '3', false, 0);
                                    }

                                }
                            }
                        }))

                    }
                    commentDialog.show();



                }).fail(function () {
                    btn.removeClass(disable).text('确认收货');
                });
            }
        }
    }

    init();

});