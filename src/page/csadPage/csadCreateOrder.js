/**
 * 专家端下单
 * Created by xiuxiu on 2016/12/9.
 */
define('h5/js/page/csadCreateOrder',[
    'jquery',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/url',
    'plugin/addressData/1.0.0/addressData',
    'h5/css/page/csadCssZy.css'
], function ($, Data, Common, URL) {

    //function csadCreateOrder(target){
    //    //this.init(target);
    //    //this.bindEvent();
    //}

    var csadCreateOrder = {},canClick;
    var _paytype= '',_deliTime= '',_createTime= '',_prepaid= '',_wxno='';
      csadCreateOrder.prototype = {//isReissue补发
         init:function(userId,boxId,hidePrev,isDialog,isReissue){
             var W = $('.csadUserMessageContainer');

              canClick = true;
             var tradeId = $('body').attr('data-tradeid');
             if(W.find('.createOrderContainer').length == 0){

                if(tradeId){     //如果有订单号查询订单详情

                    var _$boxid = isReissue ? isReissue : boxId;
                    var tradeData={
                        boxId:_$boxid
                    }
                    Data.getEditTradeDataByZjBoxId(tradeData).done(function(result){
                            var vo =result.data;
                             _paytype= vo.payType;_deliTime= vo.appointDeliveryTime;_createTime= vo.dateCreated;_prepaid= vo.prepaidFee/100;_wxno = vo.wxNo;
                            $('.csadUserMessageContainer').attr({'pay-type':_paytype,'delivery-time':_deliTime,'date-created':_createTime,'prepaid-fee':_prepaid,'wxno':_wxno});


                    })
                }


                 var data = {
                         userId:userId,
                         sz:1
                     }
                 Data.getLogisticsList(data).done(function(res) {
                     var item = [], contactName = '', mobile = '', addr = '', zipCode = '', memo = '', province = '', city = '', district = '';
                     if (res.list && res.list.length > 0) {
                         item = res.list[0];
                         contactName = item.contactName ? item.contactName : '';
                         mobile = item.mobile ? item.mobile : '';
                         addr = item.addrDetail ? item.addrDetail : '';
                         zipCode = item.zipCode ? item.zipCode : '';
                         memo = item.memo ? item.memo : '';
                         province = item.province ? item.province : '';
                         city = item.city ? item.city : '';
                         district = item.district ? item.district : '其他';

                     }
                     //var item = res.list && res.list.length ? res.list[0] ;
                     //$('.createOrderContainer').remove();
                     var tpl = '<dd class="row"><label>{{label}}</label><div class="boxR col">{{content}}</div></dd>',
                         list = [
                             {
                                 'label': '付款方式',
                                 'type': 'radio',
                                 name: 'payWay',
                                 'option': [

                                     {
                                         name: '货到付款',
                                         id: 6
                                     },
                                     {
                                         name: '微信转账',
                                         id: 8
                                     },
                                     {
                                         name: '支付宝转账',
                                         id: 7
                                     },
                                     {
                                         name: '企业微信转账',
                                         id: 11
                                     },
                                     {
                                         name: '在线支付',
                                         id: 1
                                     },
                                 ]
                             },
                             {
                                 'label': '收货人',
                                 'type': 'text',
                                 'name': 'contactName',
                                 'value': contactName
                             },
                             {
                                 'label': '收货电话',
                                 'type': 'tel',
                                 'name': 'contactMobile',
                                 'value': mobile
                             },
                             {
                                 'label': '收货地址',
                                 'type': 'select',
                                 'name': 'addr',
                                 'value': addr
                             },
                             {
                                 'label': '邮政编码',
                                 'type': 'text',
                                 'name': 'zipCode',
                                 'value': zipCode
                             },
                             //{
                             //    'label': '选择快递',
                             //    'type': 'selectKD',
                             //    'name': 'kdType',
                             //    'value': zipCode,
                             //    'option': [{
                             //            id: 0,
                             //            name: '选择快递'
                             //        },
                             //        {
                             //            id: 1,
                             //            name: '顺丰快递'
                             //        },
                             //        {
                             //            id:2,
                             //            name: '圆通快递'
                             //        },
                             //        {
                             //            id: 3,
                             //            name: '德邦快递'
                             //        },
                             //        {
                             //            id: 4,
                             //            name: 'EMS快递'
                             //        }],
                             //
                             //
                             //},

                             {
                                 'label': '备注',
                                 'type': 'textarea',
                                 'name': 'buyerMemo',
                                 'value': memo
                             },
                         ],
                         html = [];
                     $.each(list, function (i, item) {
                         switch (item.type) {
                             case 'radio':
                                 var optHtml = [], optTpl = '<span  class="radioDD {{unpay}} {{active}}" data-id="{{id}}"><i></i>{{name}}</span>',isCollect=false,isCollectHide='hide';
                                 if(_paytype == 6 || _paytype == 9 || _paytype == 10){
                                     isCollect = true;
                                     isCollectHide = '';
                                 }

                                 $.each(item.option, function (j, opt) {
                                     opt.unpay = j == 0 ? 'unpay' : opt.id == 1 ? 'onlinePay' : '';
                                     if(_paytype == opt.id ){
                                         opt.active = 'choice';
                                     }
                                     if(isCollect){
                                         item.option[0].active =  'choice';
                                     }

                                     optHtml.push(bainx.tpl(optTpl, opt));
                                 })
                                 var offPay = [
                                     {
                                         name: '微信转账',
                                         id: 10
                                     },
                                     {
                                         name: '支付宝转账',
                                         id: 9
                                     },
                                     {
                                         name: '企业微信转账',
                                         id: 12
                                     }
                                 ];
                                 var offPayTpl = '<span  class="radioDD {{active}}" data-id="{{id}}"><i></i>{{name}}</span>',offPayHtml=[];
                                 $.each(offPay, function (k, offPayItem) {
                                     if(_paytype == offPayItem.id ){
                                         offPayItem.active = 'choice';
                                     }
                                     offPayHtml.push(bainx.tpl(offPayTpl,offPayItem));
                                 })
                                 var _readonly = '';
                                if(isReissue){
                                    _prepaid = 0;
                                    _readonly = 'readonly';
                                }

                                 item.content = '<div class="payWay">' + optHtml.join('') + '</div><div class="prepay '+isCollectHide+'"><span>预付金额：</span><input type="text" '+_readonly+' value="'+_prepaid+'"/> '+offPayHtml.join('')+'</div>';
                                 break;
                             case 'select':
                                 item.content = '<select  id="cmbProvince"></select><select id="cmbCity" class="cmbCity"></select><select id="cmbArea"></select><input type="text" class="addr" placeholder="请输入详细地址" value="' + item.value + '"/> ';
                                 break;
                             case 'selectKD':
                                 var optHtm = [];
                                 $.each(item.option,function(k,opt){
                                     optHtm.push('<option value="'+opt.id+'">'+opt.name+'</option>');
                                 })
                                 item.content = '<select  id="'+item.name+'">'+optHtm.join('')+'</select>';
                                 break;
                             case 'textarea':
                                 item.content = '<textarea  class="' + item.name + '" >' + item.value + '</textarea> ';
                                 break;

                             default:
                                 item.content = '<input type="' + item.type + '" value="' + item.value + '" class="' + item.name + '" /> ';
                                 break;
                         }
                         html.push(bainx.tpl(tpl, item))
                     })
                     // var boxId = boxId;
                     // if(target){
                     //     $('.table_con').find('tr').removeClass('curBox');
                     //     target.parent().parent().addClass('curBox');
                     // }

                    var prevTpl = hidePrev ? 'none' : 'inline-block';
                     var createO = isReissue ? '完成' : '下一步';

                     W.find('.csadUserMsgContent').append('<div class="presentList createOrderContainer "><div data-id="' + boxId + '" class=" grid" id="createOrder"><div class="pop_box"  ><dl class="add_con grid">' + html.join('') + '</dl></div></div><div class="footer grid questionTool"><div class=""><span class="  prevBtn prevCB" style="display: '+prevTpl+'">上一步 </span><span class="createOrderBtn  nextBtn">'+createO+' </span></div></div></div>');

                     if(tradeId){
                         $('#createOrder').find('.onlinePay').hide();
                     }

                     Address.addressData('cmbProvince', 'cmbCity', 'cmbArea', province, city, district);
                 })  .fail(function(){
                     bainx.broadcast('程序报错，请联系后台管理员！');
                 })
             }
             else{
                     $('.createOrderContainer').removeClass('hide');
                 }
             W.find('.csadUserMsgTitle ul .questionTab').text('生成订单');


             $('body').off('click', '.createOrderBtn').on('click', '.createOrderBtn',function(){

                 if($('.radioDD.onlinePay').hasClass('choice')){

                     doneAll();
                 }
                 else{
                     if($(this).hasClass('disabled')){
                         return
                     }

                     var targetParent = $('#createOrder');
                     //生成订单。。
                     var //targetParent.find('.choice').data('id'),
                         contactName = $.trim(targetParent.find('.contactName').val()),
                         contactMobile = $.trim(targetParent.find('.contactMobile').val()),
                         prepaidFee = parseFloat($.trim($('.prepay input').val()) * 100),
                         payType = $('.unpay').hasClass('choice')  ? $('.prepay').find('.choice').data('id') && prepaidFee != 0 ? $('.prepay').find('.choice').data('id') : $('.unpay').data('id') : $('.payWay').find('.choice').data('id'),
                         zipCode = $.trim($('.zipCode').val()),
                         buyerMemo = $.trim($('.buyerMemo').val()),
                         province = $('#cmbProvince').val(),
                         city = $('#cmbCity').val(),
                         district = $('#cmbArea').val() == '其他'  ? '' : $('#cmbArea').val(),
                         addr = $.trim(targetParent.find('.addr').val());
                     // kdType =  $('#kdType').val(),

                     if(!payType){
                         bainx.broadcast('请选择付款方式');
                         return;
                     }
                     if(prepaidFee != 0 && !(payType == 9 ||  payType == 10 || payType == 12)){
                         bainx.broadcast('请选择付款方式');
                         return;
                     }
                     if(!contactName){
                         bainx.broadcast('请输入收货人');
                         return;
                     }
                     if(!contactMobile){
                         bainx.broadcast('请输入收货电话');
                         return;
                     }
                     //else if (!/^[\d]{11}$/gi.test(contactMobile)) {
                     //    bainx.broadcast('请输入正确的手机号码！');
                     //    return;
                     //}
                     if(province =='请选择省份' || !addr){
                         bainx.broadcast('请输入收货地址');
                         return;
                     }
                     if(isReissue){
                         createOrderAll()
                     }
                     else{
                         selectWxno();
                     }


                 }


                    //doneAll();
                     //$('.containerQuestion').html('');


             })
             .off('click', '.prevSelctWXNO').on('click','.prevSelctWXNO',function(){
                 $('.presentList').addClass('hide');
                 $('.createOrderContainer').removeClass('hide');
             })
             .off('click', '.prevCB').on('click','.prevCB',function(){
                    $('.CreateBoxContainer').removeClass('hide').siblings().addClass('hide');
                 //$('.questionBtnG').removeClass('show');
                 $('.createBoxBtnG').addClass('show');
                 $('.questionTab').text('产品定制');
             })
             .off('click', '.radioDD').on('click','.radioDD',function(){
                 if($(this).parent().hasClass('payWay')){
                     var prepay = $('.prepay');

                     if($(this).hasClass('onlinePay')){ //在线支付
                         $('#createOrder').find('.row').eq(0).siblings().hide();
                         prepay.addClass('hide');

                     }
                     else{
                         if($(this).hasClass('unpay')){     //货到付款
                             prepay.removeClass('hide');
                             if(isReissue){
                                 prepay.find('input').val('0');
                             }
                         }
                         else{  //微信支付宝
                             prepay.addClass('hide').find('input').val('');
                             prepay.find('.radioDD').removeClass('choice');
                         }
                         $('#createOrder').find('.row').eq(0).siblings().css('display','flex');
                     }
                 }
                 $(this).addClass('choice').siblings().removeClass('choice');
         })
             .off('click', '.choiceItem').on('click','.choiceItem',function(){
                 if($(this).parent().hasClass('selectOrderDay')){//下单时间  ---判断修改的时间是否超过换月了。
                     var mm = new Date().getMonth() +1;//当前月份
                     if(_createTime && mm != bainx.formatDate('m', new Date(_createTime))){
                         bainx.broadcast('已结算上月业绩，不可修改！');
                         return false;
                     }
                 }
                 $(this).addClass('active').siblings().removeClass('active');
                if($(this).hasClass('DeliveryBtn')){
                    if($(this).data('id') == 0){//延迟发货
                        if($('.delivBody').children().length == 0){
                            var htm =[];
                            for(var i = 1;i<11;i++){
                                var _nowTime =  new Date().getTime(),//
                                    diffD = parseInt(( _deliTime - _nowTime) /1000/3600/24),isActive='';
                                if(diffD+1 == i){
                                    isActive = 'active';
                                }
                                htm.push('<span class="choiceItem selDeliveryDayWrap '+isActive+'"><b>'+i+'天后</b><span class="selDeliveryDay">' + GetDateStr(i).date + '</span>('+GetDateStr(i).week+')</span>');
                            }
                            $('.delivBody').show().append(htm.join(''));
                        }
                        else{
                            $('.delivBody').show();
                        }
                    }
                    else{
                        $('.delivBody').hide();
                    }
                }

         })


             //选择老师
             .off('click', '.selectWxnoBtn').on('click','.selectWxnoBtn',function(){
                    if($(this).hasClass('disabled')){
                        return
                    }
                 createOrderAll();
             //doneAll()
            })
             //生成订单
             function createOrderAll(){
                 var targetParent = $('#createOrder'),boxId = targetParent.attr('data-id');


                 //生成订单。。
                 var contactName = $.trim(targetParent.find('.contactName').val()),
                     contactMobile = $.trim(targetParent.find('.contactMobile').val()),
                     prepaidFee = parseFloat($.trim($('.prepay input').val()) * 100),
                     payType = $('.unpay').hasClass('choice')  ? $('.prepay').find('.choice').data('id') && prepaidFee != 0 ? $('.prepay').find('.choice').data('id') : $('.unpay').data('id') : $('.payWay').find('.choice').data('id'),
                     zipCode = $.trim($('.zipCode').val()),
                     buyerMemo = $.trim($('.buyerMemo').val()),
                     province = $('#cmbProvince').val(),
                     city = $('#cmbCity').val(),
                     district = $('#cmbArea').val() == '其他'  ? '' : $('#cmbArea').val(),
                     addr = $.trim(targetParent.find('.addr').val()),
                     wxno = $('.allWxno').find('.choiceItem.active').find('.order_wxno').text(),
                     choseDay = $('.selectOrderDay').find('.choiceItem.active'),
                     orderTime = choseDay.find('.selDay').text(),
                     sendTime;

                 if(isReissue){
                     wxno =  _wxno;
                     orderTime = bainx.formatDate('Y/m/d h:i:s', new Date());
                     sendTime = bainx.formatDate('Y/m/d h:i:s', new Date());
                 }
                 else{
                     if(!wxno){
                         bainx.broadcast('请选择下单相对应的微信号');
                         return;
                     }
                     if(!orderTime){
                         bainx.broadcast('请选择客户下单的真实时间');
                         return;
                     }
                     if($('.DeliveryBtn.active').length == 0){
                         bainx.broadcast('请选择是否立即发货');
                         return;
                     }

                     if(choseDay.index() == 0){
                         orderTime =  bainx.formatDate('Y/m/d h:i:s', new Date());
                     }
                     if($('.DeliveryBtn.active').data('id') != 1){
                         //
                         sendTime = $('.selDeliveryDayWrap.active').find('.selDeliveryDay').text();
                     }
                     else{
                         sendTime = bainx.formatDate('Y/m/d h:i:s', new Date());
                     }
                     if(!sendTime){
                         bainx.broadcast('请选择延迟发货时间！');
                         return false;
                     }
                 }

                 // kdType =  $('#kdType').val(),
                 var data = {
                     buyerId:userId,
                     boxId:boxId,
                     prepaidFee:prepaidFee,
                     payType:payType,
                     offlineIsPayed:payType == 6 ? 0 : 1,
                     province:province,
                     city:city,
                     district:district,
                     addr:addr,
                     contactName:contactName,
                     contactMobile:contactMobile,
                     zipCode:zipCode,
                     buyerMemo:buyerMemo,
                     wxno:wxno,
                     orderTime:orderTime,
                     appointDeliveryTime:sendTime
                     //kdType:kdType
                 }
                 //防止多次点击
                 $('.selectWxnoBtn').addClass('disabled');
                 var detailAddr = province+ city+district+addr;

                 if(isReissue){
                     data.isReissue = 1;
                     data.buyerMemo = buyerMemo + '(为订单号为'+tradeId+'补发)';
                     Data.expertDzOrder(data).done(function (resTrade) {
                         bainx.broadcast('订单补发成功！');
                         $('.selectWxnoBtn').removeClass('disabled');
                         //$('body').attr('data-tradeid',res.trade.tradeId);

                         ////延迟订单添加数量提醒
                         //if(sendTime){
                         //    delaynumTips()
                         //}
                         var tradeD = resTrade.trade;

                         var data = {
                             boxId: boxId
                         }
                         Data.getMineBoxProductVOList(data).done(function (resProduct) {
                             var prodHtml=[],prodTpl='{{prodName}}×{{num}}';

                             $.each(resProduct.list,function(k,prodItem){
                                 prodHtml.push(bainx.tpl(prodTpl,prodItem));
                             })
                             tradeD.product = prodHtml.join(' ');

                             //用户轨迹
                             if($(window.parent.document).find('.buy_boxs_list').length > 0){

                                 tradeD.detectReportDate = bainx.formatDate('Y/m/d h:i', new Date());
                                 tradeD.lastUpdated = bainx.formatDate('Y/m/d', new Date());
                                 tradeD.time = bainx.formatDate('h:i', new Date());

                                 $(window.parent.document).find('.buy_boxs_list').find('.placeOrderBtn,.editBoxIt,.viewReportU').hide();
                                 $(window.parent.document).find('.buy_boxs_list').prepend(bainx.tpl('<tr class=" ul_boxId{{mineScBoxId}}" data-id="{{mineScBoxId}}" data-tradeid="{{tradeId}}"><td width="5%" class="theFirst"><i>0</i></td><td width="10%" class="theFirst"><p  class="createTimeB">{{lastUpdated}}</p></td><td width="15%"><p>名称：{{title}}</p><p>{{time}}</p></td><td width="15%"><p>报告生成时间：</p><p>{{detectReportDate}}</p></td><td width="30%">{{product}}</td><td width="7%">￥0.00</td><td width="10%" class="payStatus"  data-tradeStatus="{{status}}"><span class="tradeStatus">已付款</span></td><td width="7%"><a data-id="{{mineScBoxId}}"   class="editBoxIt"  data-tradeid="{{tradeId}}">修改产品>></a><a data-id="{{mineScBoxId}}" data-tradeid="{{tradeId}}"  class="placeOrderBtn">修改订单>></a><a  class=" printReportBtn"  data-id="{{id}}">打印报告>></a></td></tr>',tradeD));
                             }

                             //我的全部订单
                             else{
                                var pay_Type = '',offPay = '';
                                 switch (tradeD.payType){
                                     case 7:
                                         pay_Type = '支付宝';
                                         break;
                                     case 8:
                                         pay_Type = '微信';
                                         break;
                                     case 11:
                                         pay_Type = '企业微信';
                                         break;
                                     case 6:
                                     case 9:
                                     case 10:
                                         pay_Type = '货到付款';
                                         if(tradeD.payType == 9 || tradeD.payType == 10 || tradeD.payType == 12){
                                             offPay = '预收：￥'+(tradeD.prepaidFee/100)+'</p>';
                                             if(tradeD.payType == 9){
                                                 offPay  = '<p>支付宝' + offPay;
                                             }
                                             if(tradeD.payType == 10){
                                                 offPay  = '<p>微信' +offPay;
                                             }
                                             if(tradeD.payType == 12){
                                                 offPay  = '<p>企业微信' +offPay;
                                             }
                                         }
                                         break;

                                 }
                                 tradeD.pay_Type = pay_Type;
                                 tradeD.offPay =  offPay;
                                 tradeD.orderTime = bainx.formatDate('Y-m-d', new Date());
                                 var targetObj;
                                 $(window.parent.document).find('.orderListContent').each(function(){
                                     if($(this).css('display') == 'block'){
                                         targetObj = $(this);
                                         return false;
                                     }
                                 })
                                 console.log(targetObj);

                                 targetObj.find('.orderList').prepend(bainx.tpl('<li class="row" data-id="{{id}}" data-uid="{{userId}}"  data-trade-id="{{tradeId}}"><dd  class="col wxno fvc fb fac">'+wxno+'</dd><dd  class="col orderTime fvc fb fac" >{{orderTime}}</dd><dd  class="col contactName fvc fb fac">'+contactName+'</dd><dd  class="col addr fvc fb fac">'+province+city+district+addr+'</dd><dd  class="col price fvc fb fac">0.00</dd><dd  class="col product fvc fb fac">{{product}}</dd><dd  class="col status fvc fb fac"><div class="statusW">已付款</div> </dd><dd  class="col payType fvc fb fac"><div class="payway">{{pay_Type}}{{offPay}}</div> </dd><dd class="col fvc fb fac operate"><span class="editMyOrderListBtn">修改订单</span></dd></li>',tradeD));
                             }
                             $(window.parent.document).find('.reissueOrderWrap').remove();
                         })
                     }).fail(function () {
                         $('.selectWxnoBtn').removeClass('disabled');
                     })
                 }
                 else{

                     if(tradeId){
                         data.tradeId= tradeId;
                         Data.expertUpdateOfflineTrade(data).done(function(res){
                             bainx.broadcast('订单修改成功！');
                             delaynumTips();
                             doneAll(wxno,orderTime,contactName,detailAddr,payType,prepaidFee,sendTime,tradeId,boxId,userId,isDialog);
                             $('.selectWxnoBtn').removeClass('disabled');

                         }).fail(function(){
                             $('.selectWxnoBtn').removeClass('disabled');
                         })

                     }
                     else {
                         Data.expertDzOrder(data).done(function (res) {
                             bainx.broadcast('订单生成成功！');
                             $('body').attr('data-tradeid',res.trade.tradeId);

                             //延迟订单添加数量提醒
                             if(sendTime){
                                 delaynumTips()
                             }
                             doneAll();
                             $('.selectWxnoBtn').removeClass('disabled');
                         }).fail(function () {
                             $('.selectWxnoBtn').removeClass('disabled');
                         })
                     }
                 }

             }
            //
         }



     }





    //延迟订单添加数量提醒
    function delaynumTips(){
        var body = $('body'),deliveryList =$('.deliveryList');
        if(deliveryList.length == 0){
            deliveryList = $(window.parent.document).find('.deliveryList');
        }

        var badgegroup = deliveryList.find('.badgegroup'),
            d = {
            tradeStatus:4,
            isDelayTime:1,
            type:1
        }
        Data.getBoxTradeCount(d).done(function(res){
            if(res.orderCount>0){
                if(badgegroup.length > 0){
                    badgegroup.show();
                    badgegroup.text(res.orderCount);
                }
                else{
                    deliveryList.append('<span class="badgegroup">'+res.orderCount+'</span>') ;
                }
            }else{
                badgegroup.hide();
            }


        })

    }

    function selectWxno(){

        if($('.createOrderContainerNext').length > 0){
            $('.presentList').addClass('hide');
            $('.createOrderContainerNext').removeClass('hide');

        }
        else {

            var uidS = sessionStorage.getItem('currentExpert');
            uidS = JSON.parse(uidS);
            var data = {
                userId: uidS[2],
                status: 1,
                sz: 100
            }
            Data.getWxCsadInfoVOList(data).done(function (res) {
                if(res.list && res.list.length > 0){

                    var tpl = '<span class="choiceItem {{active}}" data-id="{{id}}">{{wxName}}<br/>微信号：<span class="order_wxno">{{wxNo}}</span><br/>专业类型：{{description}}</span>',
                        html = [];
                    $.each(res.list, function (i, item) {
                        item.active = item.wxNo == _wxno ? 'active' : '';
                        html.push(bainx.tpl(tpl, item));
                    })
                    var htmlTime = [];
                    var //createD = bainx.formatDate('d', new Date(_createTime)),
                        _nowTime =  new Date().getTime(),//_deliTime
                        diffD = Math.floor((_nowTime - _createTime) /1000/3600/24);
                    console.log(diffD,bainx.formatDate('d', new Date(_createTime)));
                    for(var i = 0;i<4;i++){
                        var txt = '';
                        if(i == 0){
                            txt = '今天'
                        }
                        if(i == 1){
                            txt = '昨天'
                        }
                        if(i == 2){
                            txt = '前天'
                        }
                        if(i == 3){
                            txt = '大前天'
                        }
                        var choice = i == diffD ? 'active' : '';
                        htmlTime.push('<span class="choiceItem '+choice+'"><b>'+txt+'</b><span class="selDay">' + GetDateStr(-i).date + '</span>('+GetDateStr(-i).week+')</span>');
                    }
                    var diffDD = Math.ceil(( _deliTime - _nowTime) /1000/3600/24),isoffActive='',isonActive='';
                    if(_deliTime){
                        if(diffDD > 0){
                            isoffActive = 'active';
                        }
                        else{
                            isonActive= 'active';
                        }
                    }

                    $('.presentList').addClass('hide');
                    $('.csadUserMsgContent').append('<div class=" presentList createOrderContainerNext"><div class="pop_box"><div class="selectwxnoW"> <p>请选择下单相对应的微信号<span style="color: #f00;">（用于财务核帐，必须正确）</span></p><div class="allWxno">' + html.join('') + '</div><p>请选择客户实际的购买时间：<span style="color: #f00;">（请认真核对便于数据统计跟运营分析）</span></p><div class="selectOrderDay">'+htmlTime.join('')+'</div><p>是否立即发货：</p> <div class="immediateDeliveryW"><div class="delivHead"> <span class="choiceItem DeliveryBtn '+isonActive+'" data-id="1">立即发货</span><span class="choiceItem DeliveryBtn '+isoffActive+'"  data-id="0">延迟发货</span></div><div class="delivBody"></div> </div> </div> </div><div class="footer grid questionTool"><div class=""><span class="prevBtn prevSelctWXNO" style="display: inline-block">上一步 </span><span class="nextBtn selectWxnoBtn">完成</span></div></div></div>');

                }
                else{
                    bainx.broadcast('请先去信息管理绑定个人微信号！');
                    //$('.csadUserMsgContent').append('<p>请先去信息管理绑定个人微信号！</p>');
                    $('.createOrderBtn').addClass('disabled');
                }

            })
        }


    }
    //时间
    function GetDateStr(AddDayCount) {
        var dd = new Date();
        dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
        var y = dd.getFullYear();
        var m = dd.getMonth()+1;//获取当前月份的日期
        var d = dd.getDate();

        var week = dd.getDay(),str;
        if (week == 0) {
            str = "星期日";
        } else if (week == 1) {
            str = "星期一";
        } else if (week == 2) {
            str = "星期二";
        } else if (week == 3) {
            str = "星期三";
        } else if (week == 4) {
            str = "星期四";
        } else if (week == 5) {
            str = "星期五";
        } else if (week == 6) {
            str = "星期六";
        }
        return {
            date:y+'/'+m+'/'+d,
            week:str
        };


    }

    //完成
    function doneAll(wxno,orderTime,contactName,detailAddr,payType,prepaidFee,sendTime,tradeId,boxId,userId,isDialog){
        if(isDialog){
            $('.editOrderListWrap').hide();
            var tar = $('.orderListContent.curWrap').find('.current');
            tar.find('.wxno').text(wxno);
            tar.find('.orderTime').text(orderTime);
            tar.find('.contactName').text(contactName);
            tar.find('.addr ').text(detailAddr);
            var pay_Type = '',offPay = '';

            switch (payType){
                case 7:
                    pay_Type = '支付宝';
                    break;
                case 8:
                    pay_Type = '微信';
                    break;
                case 6:
                case 9:
                case 10:
                    pay_Type = '货到付款';
                    if(payType == 9 || payType == 10){
                        offPay = '预收：￥'+(prepaidFee/100)+'</p>';
                        if(payType == 9){
                            offPay  = '<p>支付宝' + offPay;
                        }
                        if(payType == 10){
                            offPay  = '<p>微信' + offPay;
                        }
                    }
                    break;
            }
            tar.find('.payway').html(pay_Type+offPay);


            var orderlist= $('.isDelayOrderList');
            if( new Date(sendTime).getTime() <= new Date().getTime()){//没有设置延迟 && 删除延迟订单的
                orderlist.find('li').each(function(){
                    if($(this).data('trade-id') == tradeId){
                        $(this).remove();
                        return false;
                    }
                })
                if(orderlist.find('li').length == 0){
                    orderlist.find('.orderList').append('<li class="noData">暂无</li>')
                }
            }
            else{
                var isExist = false;
                orderlist.find('li').each(function(){
                    if($(this).data('trade-id') == tradeId){
                        isExist = true;
                        return false;
                    }
                })
                if(!isExist){
                    var cur = $('.orderListContent.curWrap');
                    orderlist.find('.orderList').prepend('<li class="row" data-id="'+boxId+'" data-uid="'+userId+'" data-delaytime="'+sendTime+'" data-trade-id="'+tradeId+'">'+cur.find('.current').html()+'</li>');
                    orderlist.find('li').eq(0).find('.operate').html('<span class="editDelieveryBtn">修改延迟时间</span><span class="immediateDeliveryBtn">立即发货</span>');
                    orderlist.find('li').eq(0).find('.operate').before('<dd class="col fvc fb fac delay-time">'+sendTime+'</dd>');
                    orderlist.find('.noData').remove();
                }
            }


        }else{
            $('.userTrajectoryTab').click();
            $('.csadUserMsgTitle ul .questionTab').text('用户诊断');
            $('.CreateBoxContainer,.createOrderContainer ').remove();
            //$('.containerQuestion').html('');
        }
    }

    return csadCreateOrder
})