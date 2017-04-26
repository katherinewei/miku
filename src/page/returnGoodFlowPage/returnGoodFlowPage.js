/**
 * 退款流程
 * Created by xiuxiu on 2016/1/21.
 */
require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/goods',
    'h5/js/common/nexter'
], function($, URL, Data, Common, Goods, Nexter) {
    var Page,
        currentState = URL.param.status,
        orderId = URL.param.orderId,
        isTradeStatus = false,       //未发货
        isFirstNotPass = false,  //已发货第一次审核失败为true
        RETURN_STATUS = {
            '1': '填写申请',
            '2': '寄回商品',
            '3':'米酷收货',
            '4':'退款完成',
        };

    function init() {

        var data ={
            orderId:orderId,
            status:currentState,
        }
        Data.getReturnGoodsVOList(data).done(function(res) {
            var tradeStatusT = res.list[0].tradeStatus;
            isTradeStatus = tradeStatusT == 4  ? true : false;
            render(res.list[0]);
            console.log(res.list[0],typeof(tradeStatus));
        });
    }

    function render(item) {
        Common.headerHtml('申请退货','<div class="btn-navbar navbar-right"><span  class="policy" href="'+URL.returnPolicy+'">退货政策</span></div>',false);
        var html = getFlowHtml(item,currentState);
        $('body').append(html);
        //
        stepShow();

        Page = $('body');
        bindEvents(Page);
    }
    //判断显示
    function stepShow(){
        //流程显示
        for(var i= 0;i <= currentState;i++){
            $('.flow dt').eq(i).addClass('active');
            if(currentState == 1 || currentState == 3){
                $('.flow dt').eq(currentState).show();
            }
            else{
                $('.flow').find('.audit').hide();
            }
        }
        //流程描述第一的加active
        $('.returnGoods-status .state').eq(0).addClass('active');

        //状态0
        if(currentState == 0 && isTradeStatus ){
                $('.reason .box').eq(2).html('<div class="tel_kf"><a href="tel:'+Common.companyTel+'"><i class="icon_kf"></i>联系客服</a> </div>');
        }
        //状态0
        if(currentState == 0 || isTradeStatus ){
            $('.order ').removeClass('mt-05');
            $('.returnGoods-status .grid').css({'margin-bottom':'0'});
        }
        //状态2
        if(currentState == 2){
            $('.returnInstra').addClass('sendGoods');
        }
        //运费无补贴隐藏
        if($('.subsidyFee i').text() == 0){
            $('.subsidyFee,.subsidyFeeTip').hide();
        }
        //状态异常   1未发货 2已发货第一次审核不通过 3已发货第二次审核不通过
        if(currentState == 6 ){
            if(!isTradeStatus){          //条件          2&&3
                if(isFirstNotPass){            //2  后面的active去掉
                    $('.audit1').show();
                    $('.audit1 p').text('审批失败');
                    for(var k = 2;k < currentState; k++){
                        $('.flow dt').eq(k).removeClass('active');
                    }
                }else{           //3
                    $('.finished').text('退款异常');
                }
            }else{    // 1
                $('.finished').text('退款异常');
            }


        }
        if($('.flow .col').length == 3){            //未发货显示3个进度
            $('.line').addClass('line2');
        }
        //买家描述为空隐藏
        if($('.returnReason span').text() == '' || $('.returnReason span').text() == 'undefined' ){
            $('.returnReason').hide();
        }
        //进度超过4条隐藏
        if($('.state').length > 4){
            $('<div class="viewMore">查看更多</div>').appendTo('.returnGoods-status');
            for(var j = 4;j < currentState;j++){
                $('.state').eq(j).hide();
            }
        }

    }

    function getFlowHtml(item,currentState) {
        var module = {

                flowStep:(function(){

                    //已发货
                    var template = '<dt class="col"><i></i><p>填写申请</p></dt> <dt class="audit audit1 hide"><p>等待审批</p><i class="dot"></i></dt><dt class="col"><i></i><p>寄回商品</p></dt> <dt class="audit audit2 hide"><p>快递中</p><i  class="dot"></i></dt><dt class="col"><i class="dot"></i><p>米酷收货</p></dt><dt class="col"><i></i><p class="finished">退款完成</p></dt>';


                    //未发货
                    if(isTradeStatus){          //  未发货字段
                        template = '<dt class="col"><i></i><p>填写申请</p></dt><dt class="col"><i></i><p>米酷审核</p></dt><dt class="col"><i></i><p  class="finished">退款完成</p></dt>';
                    }



                   // var template = '<dt class="col"><i></i><p>{{statusText}}</p></dt>';
                   //
                   // $.each(RETURN_STATUS,function(index,item){
                   //     if(!item.reqExamine){
                   //
                   //     }
                   //     html.push(bainx.tpl(template, item));
                   // })
                   //return html.join('');

                    return  template;

                })(),
                returnInstra:(function(item){
                    var html = [];

                    switch (currentState){
                        case '0' :
                            if(isTradeStatus) {              //未发货字段
                                html.push('请按要求填写退货申请，退款将在1-7个工作日内原路退回您的账户。');
                            }
                            else {
                                html.push('请按要求填写退货申请，您寄回商品的运费由米酷报销；本地最高10元，外地最高15元。报销的运费和退款将在1-7个工作日内原路退回您的账户。');
                            }
                            break;
                        case '2' :
                            html.push('<div class="box"><p>需要寄回地址：（请勿货到付款）</p><span class="tip">广东省广州市白云区嘉禾联边工业区尖彭路南面02号M3创意园201-202，收货人：米酷，电话：'+Common.companyTel+'</span></div><div class="box"><p>需要寄回物品：</p><span class="tip">1、退货商品 2、发货单，注明退货商品 3、如有发票，请一并寄回</span></div><div class="box grid"><p>请填写物流信息：（未填写物流信息，会影响您的退款进度）</p><div class="inputDiv row"><div class="col col-5 fb far fvc">快递公司</div><div class="col col-15"><select  id="chooseEC"><option value="0">请选择</option><option value="1">申通快递</option><option value="2">圆通快递</option><option value="3">中通快递</option><option value="4">百世汇通</option><option value="5">顺丰速运</option><option value="6">韵达快运</option><option value="7">宅急送</option><option value="8">德邦</option><option value="9">EMS</option><option value="10">其他</option></select></div></div><div class="inputDiv row"><div class="col col-5 fb far fvc">运单号码</div><div class="col col-15"><input type="text"  placeholder="请填写运单号码" class="expressNo"/></div></div> </div><div class="btnSubmitE btn">提交</div>');
                            break;
                        case '5' :
                            if(isTradeStatus) {              //未发货字段
                                html.push('您的退款已完成，退款金额已原路退回。');
                            }
                            break;
                        case '6' :
                            if(isTradeStatus) {              //未发货字段
                                html.push('您的退款有异常。');
                            }
                            break;
                    }
                    return html;

                })(item),
                flowCaption:(function(item){
                    var html=[],
                        htmlTime = function( time,desc) {
                            return '<div class="state"> <p>' + bainx.formatDate('Y-m-d h:i', new Date(time)) + '</p><div class="descItem">'+desc+'</div> </div>';

                        };
                    var  template = '<div class="grid"><div class="summary row"><div class="col col-16">订单号：{{tradeId}}</div><div class="col col-9 fb fvc far order-status create-time"><span id="times">{{orderDateCreated}}</span></div></div><div class="desc"></div></div>';

                    item.orderDateCreated = bainx.formatDate('Y-m-d h:i', new Date(item.orderDateCreated));

                    html.push(bainx.tpl(template, item));

                    if(!isTradeStatus) {                //未发货字段
                        ///currentState判断到时候改为时间判断。。
                        if(item.finishTime){
                            if(currentState == 6){      //退款异常
                                if(!item.reqExamine){       //第一次审核失败
                                    isFirstNotPass = true;
                                }
                                html.push(htmlTime(item.finishTime,item.sellerMemo));
                            }else{                  //已退款
                                var sixthtpl =function(item){
                                    var tpl = '<p>退款已完成，{{refundFee}}元已原路退回您的账户</p>';
                                    item.refundFee = Common.moneyString(item.refundFee);
                                    return bainx.tpl(tpl, item);
                                }
                                html.push(htmlTime(item.finishTime,sixthtpl(item)));
                            }


                        }
                        if(item.receiptTime){       //已收货
                            var fithtpl =function(item){
                                var tpl = '<p>您的商品已经到达广州市白云区嘉禾联边工业区尖彭路南面02号M3创意园201-202，请耐心等待</p><p class="subsidyFeeTip">您的退货补贴运费{{postfee}}元将原路退回您的账户</p><p>您的退款总金额{{refundFee}}元，1-7个工作日将原路退回您的账户</p>';
                                item.postfee = Common.moneyString(item.postfee);
                                item.refundFee = Common.moneyString(item.refundFee);
                                return bainx.tpl(tpl, item);
                            }
                            html.push(htmlTime(item.receiptTime,fithtpl(item)));
                        }
                        if(item.consignTime){       //配送中
                            html.push(htmlTime(item.consignTime,'您的商品正在配送中'));
                        }
                        if(item.reqExamine){        //已通过审核  reqExamine
                            html.push(htmlTime(item.reqExamine,'您的退货申请已通过审批'));
                        }
                        if(item.dateCreated){          //已提交申请 dateCreated
                            var statusFirst =function(item) {
                                var tpl = '<div><p>您的退货申请已提交，退款方式：原路退回</p><p>联系人:米酷，联系方式:' + Common.companyTel + '</p><p>退货原因：{{returnReason}}</p><p class="returnReason">您的描述：<span >{{buyerMemo}}</span></p></div>';
                                return bainx.tpl(tpl, item);
                            }
                            html.push(htmlTime(item.dateCreated,statusFirst(item)));
                        }
                    }
                    return html.join('');
                })(item),
                order:(function(item){
                    var html = [],
                        template = '<li class="grid" data-id="{{id}}"><div class="goods-list-layout"><div class="scroll-box"><ul class="goods-list clearfix"><li class="goods row" data-id="{{artificialId}}"  href="' + URL.goodsDetail + '?gid={{artificialId}}"><div class="thumb"><img src="{{picUrl}}" /></div><div class="col fb fvc"><div><h3 class="pb-05"><span class="title">{{title}}</span></h3><p><span class="money">{{price}}</span><span class="count">{{num}}</span></p></div></div></li></ul></div></div></li>';


                    if(currentState != 0  && !isTradeStatus){   //未发货字段

                        item.totalFee = Common.moneyString(item.totalFee);
                        html.push('<div class="summary row"><div class="col col-18">应退总额：<span class="price totalFee">'+item.totalFee+'</span><span class=" subsidyFee"><i >'+item.isSubsidy+'</i>（运费补贴￥'+item.subsidyFee+'）</span></div></div>');
                        //if(currentState > 3){
                        //    item.isSubsidy = item.isSubsidy == 1 ? 'show' : 'hide';
                        //}

                    }



                    item.price = Common.moneyString(item.price);
                    html.push(bainx.tpl(template, item));
                    return html.join('');

                })(item),
                reason:(function(){
                    if(currentState == 0){
                        var template = '<div class="box"><p><span class="ness">*</span>退货原因</p><select  id="chooseReason"><option value="0">请选择</option> <option value="1">材料与商品描述不符</option><option value="2">做工瑕疵</option><option value="3">收到的商品少件或破损</option><option value="4">拍错/不喜欢/效果不好</option><option value="5">卖家发错货</option><option value="6">其他</option></select></div><div class="box"><p>描述说明</p><input type="text" placeholder="请描述您想退货的原因"  class="returnReason"/> </div><div class="box grid"><p>上传照片</p><span class="tip">支持JPG、GIF、PNG，最多5M，最多支持3张;</span><span class="tip">移动网络下将会产生较多流量</span><div class="uploadImg row"><img class="fileBg" src="' + URL.imgPath + 'common/images/icon_put_pic.png" /><form id="my_form" action="' + URL.uploadCommentPic + '" class="form-horizontal col col-7" enctype="multipart/form-data"><input id="file" name="file" type="file"/></form><div class="col col-17 picList"></div> </div> </div><div class="btnRG "><span class="btn">申请退货</span></div>';
                        return template;
                    }
                })(),
                buyerMemo:(function(item){
                    if(currentState != 0  && isTradeStatus){   //未发货字段
                        var html = [],
                            template = '<div class="summary row"><div class="col col-16">买家申请了退款</div><div class="col col-9 fb fvc far order-status create-time"><span id="times">{{dateCreated}}</span></div></div><dl class="grid box"><dd>退款原因：{{returnReason}}</dd><dd>退款金额：{{refundFee}}元</dd><dd>买家说明：{{buyerMemo}}</dd></dl> ';
                        item.dateCreated = bainx.formatDate('Y-m-d h:i', new Date(item.dateCreated));
                        item.refundFee = Common.moneyString(item.refundFee);
                        html.push(bainx.tpl(template, item));
                        return html.join('');
                    }
                })(item)
            },
            template = '<section class="page-content"><div class="flow mt-05"><div class="grid"><dl class="row">{{flowStep}}</dl> <div class="line"></div> </div><div class="returnInstra">{{returnInstra}}</div></div></div><div class="returnGoods-status mt-05">{{flowCaption}}</div><ul class="order mt-05">{{order}}</ul><div class="reason mt-05">{{reason}}</div><div class="buyerMemo mt-05 grid">{{buyerMemo}}</div> </section>';

        return bainx.tpl(template, module);
    }
    function bindEvents(Page) {
        Page.on('tap', '.policy', function (e) {
            e.preventDefault();
            location.href = URL.returnPolicy;
        }).on('click', 'input', function (e) {
            if (e && e.preventDefault) {
                window.event.returnValue = true;
            }
        }).on('change', '#file', function (event) {
            $('.waitting').show();
            if($('.thumbPic').length >= 3){
                $('.waitting').hide();
                bainx.broadcast('最多只能上传3张。');
                return;
            }else{
                Common.uploadImages(event,'#my_form', URL.uploadReturnGoodsPic).done(function(res) {
                    $('.waitting').hide();
                    $('<img src="'+ res.result.picUrl+'" class="thumbPic " alt="">').appendTo('.picList');

                }).fail(function() {
                    bainx.broadcast('上传图片失败！');
                });
            }

        }).on('tap', '.btnRG ', function () {
            var sel = document.getElementById("chooseReason"),
                index = sel.selectedIndex,
                returnReason = sel.options[index].text,
                buyerMemo = $('.returnReason').val(),
                picUrls = [],
                thumbs = $('.picList img'),
                thumbsCount = thumbs.length;

            for (var i = 0; i < thumbsCount; ++i) {
                picUrls.push(thumbs.eq(i).attr('src'));
            }

            picUrls = picUrls.join(';');
            var  reqdata = {
                    orderId:orderId,
                    buyerMemo:buyerMemo,
                    returnReason:returnReason,
                    picUrl:picUrls,
                };
            console.log(reqdata);
            if(returnReason == '请选择'){
                bainx.broadcast('请选择退货原因');
                return false;
            }
            Data.reqReturnGood(reqdata).done(function(){
                $('.header,.page-content').remove();
                currentState = 1;
                init();
            })
        }).on('tap', '.btnSubmitE', function (e) {
            e.preventDefault();
            var sel = document.getElementById("chooseEC"),
                index = sel.selectedIndex,
                expressCompany = sel.options[index].text,
                expressNo = $('.expressNo').val(),
                returnGoodId = $('.order li').data('id'),
                expressData = {
                    returnGoodId:returnGoodId,
                    expressCompany:expressCompany,
                    expressNo:expressNo,
                };
            Data.expressReturnGood(expressData).done(function(){
                $('.header,.page-content').remove();
                currentState = 3;
                init();
            })
        }).on('tap','.viewMore',function(e){
            e.preventDefault();
            $('.returnGoods-status').find('.state').show();
            $(this).hide();
        })
    }
    init()
})