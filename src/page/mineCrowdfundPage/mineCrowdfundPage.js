/**
 * 我的项目
 * Created by xiuxiu on 2016/2/16.
 */
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
    'h5/js/common/transDialog',
    'h5/js/common/loadImage'
], function($, URL, Data, Common, Payer, Weixin, Goods, Nexter, Storage, Dialog,LoadImage) {

    var Page,
        Order = {},
        tradeStatus = {
            '1': '待付款',
            '2':'待付款',
            '3': '待收货',
            '4': '备货中',
            '5': '待收货',
            '6': '备货中',
            '7': '已完成',
            '20': '已完成',
            '8': '退款',
            '9':'已关闭',
        },
        crowdStatus = {     // -1=无效;0=正常;1=成功;2=失败
            '-1' : '乐享团无效',
            '0' : '乐享团中',
            '1' : '乐享团成功',
            '2' : '乐享团失败'
        }
        orderListNotHasData = '<li class="not-has-order-msg"><div class="empty_img"><img src="' + URL.imgPath + 'common/images/item_list_empty.png" alt=""></div></li>';

    function init() {
        render();

    }


    function render() {
        Common.headerHtml('我的项目');

        Page = $('<section id="mineIndexPage"><div class="page-panel"><div class="tips"></div><ul class="list"></ul></div></section>').appendTo('body');
        $('.tips').append('<h3><i></i>风险提示</h3><div class="narrowContent"><p class="hide">1、乐享团并非商品交易，项目存在一定的风险，如果项目筹款成功，我将第一时间安排发货，乐享团产品不提供退货服务，如有质量问题，请与客服联系。<br />2、乐享团成功后，发放回报、开具发票及售后服务等事项均由我方负责。<br />3、如果乐享团失败，您支持的款项会全部原路退还给您。<br />4、本页面统计的项目支持人数和总支持金额存在一定的延迟，以单个回报详情为准。 </p><span class="viewMore">展开更多<i></i></span></div>');



        getCrowdfundTradeListNexter();
        bindEvents();

    }

    function getCrowdfundTradeListNexter(){
        var element = $('.page-panel');
        var nexter = new Nexter({
            element: element,
            dataSource: Data.getCrowdfundTradeList,
            enableScrollLoad: true,
        }).load().on('load:success', function(res) {
            console.log(res);
            var html=[];
            nowTime = res.nowDate;

            if (res.list.length) {
                $.each(res.list, function (index, item) {
                    html.push(htmlItems(item));
                });
                $('.list').append(html.join(''));
                LoadImage(this.element);

                $('.page-panel ul li').each(function(){
                    var outW = $(this).find('.progress').width(),
                        innerW = $(this).find('.progressBar').width();
                    if(outW - innerW < 28){
                        $(this).find('.progressBar').children('i').css('right','0px');
                    }
                })


            } else if (this.get('pageIndex') == 0) {
                $('.list').html(orderListNotHasData);
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
    }


    function htmlItems(item){

        var template = '<li class="grid order" data-id="{{tradeId}}"><div class="summary"><p>乐享团名称：{{crowdTitle}}</p><p class="order-status">乐享团状态：<span>{{crowdStatus}}</span></p></div><div class="goods-list-layout "><div class="scroll-box"><ul class="goods-list clearfix"><li class="goods row" href="'+URL.crowdfundInfoPage+'?crowdfundId={{crowdfundId}}"><div class="thumb"><img data-lazyload-src="{{thumimg}}" /></div><div class="col fvc"><div class="grid aside"><div class="row pt-05"> <div class="progress col-17"><div class="progressBar" style="width: {{progressBar}}%;"><i>{{progressBarNum}}%</i></div></div><div class="hasSupported col col-7"><b>{{crowdTotalFee}}</b>已筹金额</div> </div><div class="row supportNum"><div class="col col-50"><i class="supported"></i>{{crowdSoldNum}}人支持</div><div class="col col-50 timeO "><i class="time"></i>{{time}}</div> </div></div></div></li></ul></div></div><div class="suminfo-layout2 "><p>订单号：{{tradeId}}</p><p>订单状态：<span class="status">{{tradeStatus}}</span></p><p>支持金额：<span class="price">{{price}}</span></p></div> <div class="moreDetail {{borderhide}}"><div class="showMore"><span>展开详情</span></div> <div class="messageBox hide"><div class="message"><div><p><span>收货人信息：{{receiptName}}</span><span>{{receiptMobile}}</span></p><p>{{receiptAddr}}</p></div></div><div class="message"><div><p>回报内容</p><p>{{crowdReturnContent}}</p></div></div><div class="timeBox"><span>回报时间</span>项目结束{{crowdPlusDay}}天内</div> </div> </div><div class="suminfo-layout "><div class="row btnGroups"><div class="col col-11"></div>{{actions}} </div></div> </li>';

        Order[item.tradeId] = item;
        item.price = Common.moneyString(item.price);
        item.crowdTargetAmount = Common.moneyString(item.crowdTargetAmount);
        item.crowdTotalFee = Common.moneyString(item.crowdTotalFee);
        item.time =  Common.Crowdfund(nowTime,item.crowdEndTime);

        item.progressBar = ((item.crowdTotalFee / item.crowdTargetAmount)*100).toFixed(0);
        item.progressBarNum = item.progressBar;
        (item.progressBar > 100) ? item.progressBar = 100 : item.progressBar;


        //if(item.buyerRate == 0){
        //    tradeStatus[7] = '待评价';
        //}else{
        //    tradeStatus[7] = '已完成';
        //}

        item.tradeStatus = tradeStatus[item.status];
        item.crowdStatus = crowdStatus[item.crowdStatus];

        if(item.crowdfundRefundStatus == 1 && item.status != 2){
            item.tradeStatus = '退款中'
        }
        if(item.crowdfundRefundStatus == 2){
            item.tradeStatus = '已退款'
        }
        item.actions_logis = '<div class="col col-5 fb fvc fac logistics">查看物流</div>'

        if (item.status == 2  && (item.crowdfundRefundStatus == 0 || item.crowdfundRefundStatus == 3)) {
            item.actions =  '<div class="col col-7 fb fvc fac cancel-order"></div><div class="col col-7 fb fvc fac dopay"></div>'
        }
        if (item.status == 5 && item.crowdfundRefundStatus == 3) {
            item.actions = item.actions_logis + '<div class="col col-5 fb fvc fac sure-order">确认收货</div>';
        }
        if ((item.status == 7 || item.status == 20)  && item.crowdfundRefundStatus == 3 ) {
            item.actions = item.actions_logis;
        }
        ////todo 待评价
        //if (item.status == 7 && item.buyerRate == 0) {
        //    item.actions = '<div class="col col-5 fb fvc fac product-comment">立即评价</div>';
        //}
        (item.actions == '') ? item.borderhide = 'borderhide':'';

        if (item.itemPicUrls && typeof item.itemPicUrls == 'string') {
            item.itemPicUrls = item.itemPicUrls.split(';');
        }
        if ($.isArray(item.itemPicUrls) && item.itemPicUrls.length) {

            var img = item.itemPicUrls[0],
                isJpg = /\.jpg/gi.test(img);
            item.thumimg = img + (isJpg ? '!small' : '');

        }


        return bainx.tpl(template, item);

    }


    function bindEvents() {
        $('body').on('tap','.viewMore',function(event){
            event.preventDefault();
            if($(this).hasClass('hide')){
                $(this).text('展开更多').removeClass('hide');
                $('.narrowContent p').removeClass('show').addClass('hide');
            }else{
                $(this).text('收起').addClass('hide');
                $('.narrowContent p').addClass('show').removeClass('hide');
            }
        }).on('tap','.showMore',function(event){
            event.preventDefault();
            if($(this).children('span').hasClass('active')){
                $(this).children('span').text('展开详情').removeClass('active');
                $(this).parent('.moreDetail').find('.messageBox').hide();
            }else{
                $(this).children('span').text('收起详情').addClass('active');
                $(this).parent('.moreDetail').find('.messageBox').show();
            }
        }).on('tap', '.cancel-order, .dopay', function(event) {
            event.preventDefault();
            var target = $(this);
            if (target.hasClass('cancel-order') && window.confirm("您要取消此订单吗？")) {
                cancelOrder(target);
                event.stopPropagation();
            } else if (target.hasClass('dopay')) {

                showPaymentDialog(target);
                event.stopPropagation();
            }
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
            location.href = URL.itemCommentsPage + '?tradeId=' + tradeId;
        }).on('tap', '.logistics', function (event) {
            event.stopPropagation();
            var tradeList = $(this).parents('.order');
            var tradeId = tradeList.attr('data-id');
            location.href = URL.logisticsInfoPage + '&tradeId=' + tradeId;
        });

    }
    function cancelOrder(btn) {
        var tid = btn.parents('.order').data('id'),
            disable = 'disable';
        if (tid) {
            if (!btn.hasClass(disable)) {
                btn.addClass(disable);
                Data.cancelOrder(tid).done(function(res) {

                    var list = btn.parents('.list');
                    btn.parents('.order').find('.status').text('已关闭');
                    btn.parents('.btnGroups').remove();

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
                            location.href = URL.orderDetail+'?oid=' + tid;
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
                            location.href = URL.orderDetail+'?oid=' + tid;
                        }).fail(function() {
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

                    location.href = URL.orderDetail+'?oid=' + tid

                }).fail(function () {
                    btn.removeClass(disable).text('确认收货');
                });
            }
        }
    }

    init();
})