define('h5/js/common/payer',[
	'jquery',
	'h5/js/common/data',
	'h5/js/common',
	'h5/js/common/weixin',
    'h5/js/common/transDialog',
    'h5/js/common/url'
], function ($, Data, Common, Weixin, Dialog, URL) {


    var payments = [{
            icon: URL.imgPath + 'common/images/wechat_icon.png',
            title : '微信支付',
            value : 4
        }/*,{
            icon: URL.imgPath + 'common/images/alipay_icon.png',
            title : '支付宝支付',
            value : 3

         },{
            icon : 'http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20150409/vNTT-0-1428546765465.png',
            title : '货到付款',
            value : 2
        }*/],

        exports = Dialog.extend({
            attrs : $.extend({}, Dialog.templates.bottom, {
                payment : null,
                payments : payments,
                title:'请选择支付方式',
                noSupport : 0,
                onHideDestroy:true
            }),
            events : {
                'tap .payment-item':function(event){
                    event.preventDefault();
                    this.selectPayment($(event.currentTarget));
                }
            },
            setup : function(){
                exports.superclass.setup.call(this);
                this.element.addClass('wl-payer-dialog');
                this.get('header').addClass('tc').text(this.get('title'));
                //this.$('.dialog-content').prepend('<header class="fb fvc fac">'+ this.get('title') +'</header>');
                return this;
            },
            _onRenderPayments : function(payments){
                var S = this,
                    template = '<li class="payment-item row fvc {{active}}" data-index="{{index}}"><div class="col col-3"><img src="{{icon}}" width="28" /></div><div class="col col-22">{{title}}</div></li>',
                    html = [],
                    _payment = this.get('payment'),
                    _unableDelivery = this.get('unableDelivery');
                    

                if($.isArray(payments) && payments.length){
                    $.each(payments, function(index, payment){
                        if(_unableDelivery && payment.value==2){
                            return;
                        }
                        var data = {
                                icon : payment.icon,
                                title : payment.title,
                                index : index
                            };
                        
                        if(_payment && _payment.value == payment.value){
                            data.active = 'active';
                        }
                        html.push(bainx.tpl(template, data));
                    });
                    html.unshift('<ul class="payment-list grid">');
                    html.push('</ul>');
                }
                S.$('.dialog-content').append(html.join(''));
            },
            selectPayment : function(item){
                this.$('.payment-item.active').removeClass('active');
                item.addClass('active');
                var index = item.data('index'),
                    payments = this.get('payments'),
                    payment = payments[index];
                this.set('payment', payment);
            }
        });
    exports.payments = payments;
    return exports;

});
