/**
 * 刮刮卡 2015-12-15
 */
require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/translate',
    'h5/js/common/transDialog',
    'h5/js/common/consignee',
    'h5/js/common/nexter',
    'h5/js/common/weixin',
    'h5/js/common/transDialog',
    'h5/js/common/consignee',
    'h5/js/common/consigneeDialog',
    'h5/js/common/payer',
    'plugin/addressData/1.0.0/addressData'
], function ($, URL, Data, Common, Translate, Dialog, Consignee,Nexter, Weixin,Dialog, WLConsignee, ConsigneeDialog,Payer,addressData) {
    var Page,		//页面
        inputBefore,
        verCode = false,
        inputNum,
        Consignee, //用户默认收货地址
        tj_goodsids=[],
        //itemMsg = [],
        Payment = Payer.payments[0], //支付方式
        nowTime =0;


    function init() {

        render();  //渲染页面

        document.title = '扫码兑奖';



    }

    function render() {

        var mainPage = '<div id="scratchCardPage" ><div class="header_SC"><img src="' + imgPath + '/common/images/scanCode/pic1.png" id="header_SC_IMG" /></div><div class="scratchCardMain"></div> </div><div class="footer_SC"><img src="' + imgPath + '/common/images/scanCode/pic2.png" /></div> ';
        Page = $(mainPage).appendTo('body');
        inputCode();
        //codeMsg()
        Data.getSystemTimes().done(function(res){
            nowTime = res.now;
        })
    }

    //输入兑换码
    function inputCode() {

        var template = '<div class="inner" id="inputCode"><form class="form"><div class="grid inputBox"><div class="row"><input class="col" placeholder="请输入16位数串码" type="tel" name="code"> </div> <div class="row"><div class="col col-15"> <input class="yzm" id="vercode" placeholder="请输入验证码"  name="validateCode"></div><div class="col col-10"> <div class=" yzm" id="sendvercode"></div> </div> </div><a class="btn submit" id="submit">确定</a></div><fieldset><legend>已中奖</legend><div class="grid list" data-role-scrollable="true"><ul></ul></div></fieldset> </div> </form></div> ';
        Page = $(template).appendTo('.scratchCardMain');


        //获取高度
        //document.getElementById('header_SC_IMG').onload = function(){
        //    var wh = $(window).height(),
        //        hh = $('.header_SC').height(),
        //        inputBoxh = $('.inputBox').height();
        //    $('fieldset').height(wh - inputBoxh-hh-60);
        //
        //}


        scratchCardList();

        require('component/kinerCode/1.0.0/kinerCode',function(KinerCode){
            var inp = document.getElementById('vercode');
            var code = document.getElementById('sendvercode');
            var submit = document.getElementById('submit');
            inputBefore = inp.value;

            var c = ["+", "-", "*", "/"];
            var arr = [];
            for (var i = 0; i < 1000; i++) {

                var num = parseInt(Math.random() * 100 + 1);
                var num2 = parseInt(Math.random() * 100 + 1);
                var num3 = parseInt(Math.random() * 4);

                if (c[num3] === '/') {
                    var x = num % num2;
                    if (x != 0) {
                        num -= x;

                        if(num==0){
                            var temp = num;
                            num2 = num;
                            num = temp;
                        }

                    }
                }

                if(num==0&&num==0){
                    continue;
                }

                var str = num + c[num3] + num2;

                arr.push(str);

            }
            //======================插件引用主体
            var c = new KinerCode({
                len: 4,//需要产生的验证码长度
//        chars: ["1+2","3+15","6*8","8/4","22-15"],//问题模式:指定产生验证码的词典，若不给或数组长度为0则试用默认字典
                chars: [
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 0,
                    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
                    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
                ],//经典模式:指定产生验证码的词典，若不给或数组长度为0则试用默认字典
                question: false,//若给定词典为算数题，则此项必须选择true,程序将自动计算出结果进行校验【若选择此项，则可不配置len属性】,若选择经典模式，必须选择false
                copy: false,//是否允许复制产生的验证码
                bgColor: "#ffffff",//背景颜色[与背景图任选其一设置]
                bgImg: "",//若选择背景图片，则背景颜色失效
                randomBg: false,//若选true则采用随机背景颜色，此时设置的bgImg和bgColor将失效
                inputArea: inp,//输入验证码的input对象绑定【 HTMLInputElement 】
                codeArea: code,//验证码放置的区域【HTMLDivElement 】
                click2refresh: true,//是否点击验证码刷新验证码
                false2refresh: true,//在填错验证码后是否刷新验证码
                //timeoutrefresh:3000,
                validateObj: '',//触发验证的对象，若不指定则默认为已绑定的输入框inputArea
                validateEven: "blur",//触发验证的方法名，如click，blur等
                validateFn: function (result, code) {//验证回调函数
                    if (result) {
                        //alert('验证成功');
                        verCode = false;
                        $('.sendvercode').removeClass('disable');
                    } else {
                        console.log(inputBefore,inp.value);

                        if(inputBefore != inp.value){
                            bainx.broadcast('验证失败，请重新输入');

                        }
                        verCode = true;
                        $('.sendvercode').addClass('disable');
                    }
                }
            });
        })




        Page.on('tap', '.btn', function (event) {
            event.preventDefault();

            if($(this).hasClass('submit')){
                var codeVal = $('input[name=code]').val(),
                    numReg = codeVal.match(/^[0-9]{16}$/);
                if (codeVal == '' || !numReg) {
                    bainx.broadcast($('input[name=code]').attr('placeholder'));
                    return;
                }
                if(verCode){
                    return;
                }
                $('input').blur();
                inputNum = $('input[name=code]').val();
                getCode();
            }else if($(this).hasClass('btnEx')){
                inputNum = $(this).parents('li').find('.col-16').text();
            }

        }).on('focus','.yzm',function(){
            if($('input[name=code]').val().length > 0 && $('input[name=code]').val().length != 16){
                bainx.broadcast('请输入16位数串码');
            }
        })
        $('.list ul').on('tap','.btnEx',function(){
            if(!$(this).hasClass('disabled')){
                listBtn($(this));
            }

        })
    }

    //刮刮卡列表
    function scratchCardList(){
        var target = $('#scratchCardPage');
        var nexter = new Nexter({
            element: target,
            dataSource: Data.getMyScanCodeCashList,
            enableScrollLoad: true,

        }).load().on('load:success', function (res) {
            if(res.list.length > 0){
                var  html =[];
               // itemMsg.push(res.list);
                $.each(res.list,function(index,item){

                    var template = '<li class="row" data-status="{{status}}" data-id="{{id}}" data-orderid="{{itemId}}" data-imgurl="{{picUrls}}"  data-tradeId="{{tradeId}}"><div class="col col-16">{{number}}</div><div class="col col-8"><a class="btn btnEx {{disable}}">{{chargeTxt}}</a></div></li>';
                    item.disable =  item.status == 3 ? 'disabled' : '';

                    if(item.status == 3){
                        item.chargeTxt = '已兑奖'
                    }
                    if(item.status == 2){
                        item.chargeTxt = '去支付'
                    }
                    if(item.status == 1){
                        item.chargeTxt = '去兑奖'
                    }

                    if(nowTime > item.endDate){         //已过期
                        item.disable = 'disabled';
                        item.chargeTxt = '已过期'
                    }
                    item.tradeId = item.tradeId ? item.tradeId : '';
                    html.push(bainx.tpl(template,item));
                })
                $(html.join('')).appendTo('.list ul');


            }else if (this.get('pageIndex') == 0) {
                $('fieldset').hide();
            }
        }).render();
    }

    //兑奖列表的兑奖
    function listBtn(btn){
        var pTarget = btn.parents('li'),
            status = pTarget.data('status'),
            tid = pTarget.data('tradeid'),

            itemData = {
                itemId:pTarget.data('orderid'),
                picUrls:pTarget.data('imgurl'),
                id:pTarget.data('id')
            };

        switch (status){
            case 1:                   //未下单
                $('#inputCode').hide();
                var  html =[];
                html.push(codeMsg(itemData));
                Page =  $(html.join('')).appendTo('body');
                //alert($('.popExcharge').html());
                Page.on('tap', '.btn', function (event) {
                    event.preventDefault();
                    startExchange();
                    $('.popExcharge').hide();
                })
                break;
            case 2:           //待付款
                $('body').append('<section class="telDialog wl-trans-dialog translate-viewport" style="display: block"><div class="cont bounceIn"><p class="tips">亲~您已下单，但未付款哦！</p><div class="btngroup"><span class="btn reset">取消</span> <span class="btn doPay">立即付款</span></div></div></section>');
                $('#scratchCardPage').css('overflow-y','hidden');
                $('body').on('tap', '.btngroup .btn', function (event) {
                    event.preventDefault();
                    $('.telDialog').remove();
                    $('#scratchCardPage').css('overflow-y','auto');
                }).on('tap', '.doPay', function (event) {
                    event.preventDefault();

                    Data.getOrderDetail(tid).done(function(res) {
                        showPaymentDialog($(this),res);
                    });
                });
                break;
            case 3:           //已付款

                break;
            default:
                break;
        }
    }



    //未付款  --弹出付款
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






    //兑奖
    function getCode(){
        var data = {
            number:inputNum
        }

        Data.receiveScanCodeCash(data).done(function(res){
            //if(res.isReward == 1){
                $('#inputCode').hide();
                var  html =[];
                html.push(codeMsg(res.vo));
                // alert(res);
                Page =  $(html.join('')).appendTo('body');
                Page.on('tap', '.btn', function (event) {
                    event.preventDefault();
                    startExchange();
                    $('.popExcharge').hide();
                })

            //}
            //else{
            //    bainx.broadcast('亲~没中奖哦！');
            //}
        })
    }


    //兑换码信息
    function codeMsg(item) {
        var template = '<div class="popExcharge"><div class="inner resultBox"><img class="resultTitleImg" src="' + URL.imgPath + '/common/images/scanCode/pic3.png"/><img class="decorate" src="' + URL.imgPath + '/common/images/scanCode/pic5.png" /> <ul id="resultList"><li data-id="{{id}}"><div class="goods" data-orderid="{{itemId}}"> <img src="{{picUrls}}" /><!--<p class="name">{{itemTitle}}</p>--></div> <div class="tips">请填写收货地址并支付9.9元运费，即可领大礼包回家哦。</div> <a class="btn btnEx">马上去领奖</a> </li> </ul></div></div>',
            suffix =  '!small';
        item.dateCreated = bainx.formatDate('Y-m-d h:i', new Date(item.dateCreated));
        if (item.picUrls && item.picUrls.indexOf('!small') < -1) {
            item.picUrls = item.picUrls.split(';')[0] + suffix;
        }
        return bainx.tpl(template,item);

    }

    //输入地址兑换
    function startExchange() {

        var template = '<div class="inner writeBox"><div class="consignee-layout page-layout grid"><h1>收货人信息</h1><div class="consignee page-layout-content row"></div></div><a class="btn btnEx active-do-pay">确定支付</a></div>';
        Page = $(template).appendTo('.scratchCardMain');

        initConsignee();
        //Address.addressData('cmbProvince', 'cmbCity', 'cmbArea');

        // $('.scratchCardMain').css({'height': 'auto'});
        //initConsignee();

        Page.on('focus', 'input', function (event) {
            event.preventDefault();
            //todo
            document.querySelector('input').scrollIntoView();

        }).on('tap', '.consignee', function (event) {
            setTimeout(function() {
                event.preventDefault();
                showConsigneeDialog();
            },320)
        }).on('tap', '.btn', function (event) {
            event.preventDefault();
            var btn = $(this);

            if (Consignee) {
                btn.removeClass('disable');
            } else {
                btn.addClass('disable');
            }
            if (btn.hasClass('disable')  || !checkInConsigneeRange()) {
                bainx.broadcast($('.null-msg').text());
                return;
            }

            submit(btn);

            //统计
            if(tj_goodsids.length >0){

                $.each(tj_goodsids, function (tj_index, tj_item) {
                    tj_cnzz(tj_item,'','创建订单');
                });
            }

        })


    }

    /**
     * 提交订单
     * @return {[type]} [description]
     */
    function submit(btn) {

        var data = pack();

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
    }

    function pack() {

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
                    goodsId = $('.goods').data('orderid'),
                    goodsCount = 1,
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
            adTime:  (new Date()).getTime(),
            orderType: 13,
            scanCashId: $('#resultList li').data('id')
        }
        return data;
    }

    //统计goods_id:商品ID ,is_add 是否新添加
    function tj_cnzz(goods_id,is_add,action_name){
        if(URL.site.indexOf('miku') >= 0) {

            _czc.push(['_trackEvent', '商品',goods_id, action_name, '支付', '']);
        }
    }

    function checkInConsigneeRange() {
        if (!(Consignee)) {
            alert('请设置收货地址！');
            $('.consignee', Page).trigger('tap');
            return false;
        }
        return true;
    }
    function initConsignee() {
        renderConsignee();
    }


    function renderConsignee() {

        WLConsignee.ready(function() {

            var target = $('.consignee', Page);

            Consignee = WLConsignee.default();

            if (Consignee) {


                var template = '<div class="col col-18"><div class="row"><h2 class="col col-10">{{receiverName}}</h2><h3 class="col col-15">{{receiverMobile}}</h3></div><p >{{receiver_state}}{{receiverCity}}{{receiverDistrict}}{{receiverAddress}}</p></div><div class="col col-6 right-icon fb fvc far"></div>';

                target.html(bainx.tpl(template, Consignee));


            } else {
                target.html('<div class="null-msg col col-18">请设置收货地址！</div><div class="col col-6 right-icon fb fvc far"></div>');
            }

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
    init();
})
