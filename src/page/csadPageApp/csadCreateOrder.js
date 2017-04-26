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

    var csadCreateOrder = {};
      csadCreateOrder.prototype = {
         init:function(userId,boxId){
             var W = $('.csadUserMessageContainer');
             if(W.find('.createOrderContainer').length == 0){
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
                     addr = item.addr ? item.addr : '';
                     zipCode = item.zipCode ? item.zipCode : '';
                     memo = item.memo ? item.memo : '';
                     province = item.province ? item.province : '';
                     city = item.city ? item.city : '';
                     district = item.district ? item.district : '';
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
                             'type': 'text',
                             'name': 'buyerMemo',
                             'value': memo
                         },
                     ],
                     html = [];
                 $.each(list, function (i, item) {
                     switch (item.type) {
                         case 'radio':
                             var optHtml = [], optTpl = '<span  class="radioDD {{unpay}}" data-id="{{id}}"><i></i>{{name}}</span>';
                             $.each(item.option, function (j, opt) {
                                 opt.unpay = j == 0 ? 'unpay' : opt.id == 1 ? 'onlinePay' : '';

                                 optHtml.push(bainx.tpl(optTpl, opt));
                             })
                             item.content = '<div class="payWay">' + optHtml.join('') + '</div><div class="prepay hide"><span>预付金额：</span><input type="text"/> <span  class="radioDD" data-id="10"><i></i>微信转账</span><span  class="radioDD" data-id="9"><i></i>支付宝转账</span></div>';
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





                 W.find('.csadUserMsgContent').append('<div class="presentList createOrderContainer "><div data-id="' + boxId + '" class=" grid" id="createOrder"><div class="pop_box"  ><dl class="add_con grid">' + html.join('') + '</dl></div></div><div class="footer grid questionTool"><div class=""><span class="  prevBtn prevCB">上一步 </span><span class="createOrderBtn  nextBtn">完成 </span></div></div></div>');
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
                 var targetParent = $('#createOrder'),boxId = targetParent.attr('data-id');
                 if(!$('.radioDD.onlinePay').hasClass('choice')){

                     //生成订单。。
                     var //targetParent.find('.choice').data('id'),
                         contactName = $.trim($('.contactName').val()),
                         contactMobile = $.trim($('.contactMobile').val()),
                         prepaidFee = parseFloat($.trim($('.prepay input').val()) * 100),
                         payType = $('.unpay').hasClass('choice')  ? $('.prepay').find('.choice').data('id') && prepaidFee != 0 ? $('.prepay').find('.choice').data('id') : $('.unpay').data('id') : $('.payWay').find('.choice').data('id'),
                         zipCode = $.trim($('.zipCode').val()),
                         buyerMemo = $.trim($('.buyerMemo').val()),
                         province = $('#cmbProvince').val(),
                         city = $('#cmbCity').val(),
                         district = $('#cmbArea').val(),
                         addr = $.trim($('.addr').val()),
                        // kdType =  $('#kdType').val(),
                         data = {
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
                             //kdType:kdType
                         }
                     if(!payType){
                         bainx.broadcast('请选择付款方式');
                         return;
                     }
                     if(prepaidFee != 0){
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
                     else if (!/^[\d]{11}$/gi.test(contactMobile)) {
                         bainx.broadcast('请输入正确的手机号码！');
                         return;
                     }
                     if($('#cmbProvince').val() =='请选择省份' || !$.trim($('.addr').val())){
                         bainx.broadcast('请输入收货地址');
                         return;
                     }
                     Data.expertDzOrder(data).done(function(res){
                         bainx.broadcast('订单生成成功！');
                         //targetParent.remove();
                     //    if(target){
                     //        $('.curBox').find('.payStatus').text('已付款');
                     //        $('.curBox').find('.placeOrderBtn,.editBoxIt').remove();
                     //
                     //
                     //    }
                     //else{

                          $('.userTrajectoryTab').click();
                          $('.csadUserMsgTitle ul .questionTab').text('用户诊断');
                          $('.CreateBoxContainer,.createOrderContainer ').remove();
                          $('.containerQuestion').html('');
                        // }

                     })
                 }
                 else{
                     $('.userTrajectoryTab').click();
                     $('.csadUserMsgTitle ul .questionTab').text('用户诊断');
                     $('.CreateBoxContainer,.createOrderContainer ').remove();
                     //$('.containerQuestion').html('');
                 }

             })

             .off('click', '.prevCB').on('click','.prevCB',function(){
                    $('.CreateBoxContainer').removeClass('hide').siblings().addClass('hide');
                 //$('.questionBtnG').removeClass('show');
                 $('.createBoxBtnG').addClass('show');
                 $('.questionTab').text('产品定制');
             })
             .off('click', '.radioDD').on('click','.radioDD',function(){
             if($(this).parent().hasClass('payWay')){

                 if($(this).hasClass('onlinePay')){
                     $('#createOrder').find('.row').eq(0).siblings().hide();
                     $('.prepay').addClass('hide');

                 }
                 else{
                     if($(this).hasClass('unpay')){
                         $('.prepay').removeClass('hide');
                     }
                     else{
                         $('.prepay').addClass('hide');
                     }
                     $('#createOrder').find('.row').eq(0).siblings().css('display','flex');
                 }
             }
             $(this).addClass('choice').siblings().removeClass('choice');
         })

         }

     }
    return csadCreateOrder
})