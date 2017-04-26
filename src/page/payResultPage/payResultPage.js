/**
 * 支付结果
 * Created by xiuxiu on 2016/3/3.
 */
require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/payer',
    'h5/js/common/weixin'
], function($, URL, Data, Common, Payer, Weixin) {
    var Page,
        oid = URL.param.oid,
        Detail;

    function init(){
        $('.waitting').hide();
       if(URL.param.type == 1){         //已支付
           render('success','谢谢您的光临，支付成功！','查看订单');
       }
        else{
           if (oid) {
               Data.getOrderDetail(oid).done(function(res) {
                   Detail = res;
                   render(Detail);
                   render('fail','很抱歉，您的订单未支付成功！','去支付',Detail);
               });
           }
       }
    }
    function render(status,word,btnWord,detail){
        Common.headerHtml('支付结果');
        var tpl = '<div class="page-content"><div class="box"><img src="'+URL.imgPath+'/common/images/pay_'+status+'.png"/><p>'+word+'</p><div class="btnGroup"><span class="btnE">返回首页</span><span class="btnF '+status+'">'+btnWord+'</span></div> </div> </div>';
        Page = $('body').append(tpl);

        bindEvents(detail);
    }

    function bindEvents(detail){
        Page.on('tap','.btnE',function(e){
            e.preventDefault();
            URL.assign(URL.index);
        }).on('tap','.success',function(e){
            e.preventDefault();
            URL.assign(URL.orderDetail + '?oid='+oid);
            if(URL.param.iscrowdfund == 1){
                URL.assign(URL.mineCrowdfundPage);
            }
        }).on('tap','.fail',function(e){
            e.preventDefault();
            showPaymentDialog($(this), detail);
        })
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
                            location.reload();
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
    init();
})
