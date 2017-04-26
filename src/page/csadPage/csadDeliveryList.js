/**
 * 延迟发货列表
 * Created by xiuxiu on 2016/12/30.
 */
define('h5/js/page/csadDeliveryList',[
    'gallery/jquery/2.1.1/jquery',
    'h5/js/common/data',
    'h5/js/page/csadCreateOrder',
    'h5/js/page/reissueOrder',
    'h5/css/page/createMineBoxPage.css',
], function ($, Data,csadCreateOrder,reissueOrder) {

    //var firstLoad;

    var deliveryList_Wrap;

    function init(){
        deliveryList_Wrap = $('#deliveryList_Wrap');

        var nav = [
            {
                txt:'延迟订单',
                cn:'isDelayOrderList',
                isDelay:1
            },
            {
                txt:'全部订单',
                cn:'allOrderList'
            },
        ],
            navT='<li data-isdelay="{{isDelay}}" class="{{active}} ">{{txt}}</li>',
            contentT = '<div class="orderListContent {{cn}} {{hide}}">'+getHeader()+'</div>',navlist=[],contentList=[];
        $.each(nav,function(index,item){
            item.active = index == 0 ? 'active' : '';
            item.hide = index == 0 ? '' : 'hide';
            navlist.push(bainx.tpl(navT,item));
            contentList.push(bainx.tpl(contentT,item));
        })

        deliveryList_Wrap.html('<div class="searchU"><ul class="logNav">'+navlist.join('')+'</ul><!--<div class="search-wrap"><div class="row search-box"><div class="icon-search search-submit"></div><div class="input-wrap"><input type="text" class="search-input" id="kwUlog" placeholder="使用微信号搜索订单"></div></div></div>--></div><section><div class="searchResult" ><div class="searchCondition"><span>微信号：<input type="text" class="searchwxno" placeholder="请输入微信号"/> </span><span>客户名称：<input type="text" class="customer" placeholder="请输入客户名称"/> </span><span>时间： <input type="text"  id="startt" placeholder="起始时间" > 一 <input type="text"  id="endt" placeholder="结束时间"  /><input type="button" value="查询" class="searchBtn" /> </span></div>'+contentList.join('')+'<div class="orderListContent hide searchOrderList">'+getHeader()+'</div></div></section><div class="deliveryPOP hide"></div><div class="csadUserMessageContainer editOrderListWrap"></div> ');

        //
        var ulHeight = $(window).height() - $('header').height() - deliveryList_Wrap.find('.searchU').height() - 66;

        $('.orderListContent').find('.orderList').height(ulHeight);
        //日历
        var nowTemp = new Date();
        var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(),nowTemp.getHours(), nowTemp.getMinutes(), nowTemp.getSeconds(), 0);
        //日期插件
        require(['plugin/foundation-datepicker/foundation-datepicker'],function(Datepicker){
            var checkin = $('#startt').fdatepicker({
                    //format: 'yyyy-mm-dd',
                    //pickTime: true,
                    leftArrow:'<<',
                    rightArrow:'>>',
                    disableDblClickSelection: true,
                    onRender: function (date) {

                        return date.valueOf() >= now.valueOf() ? 'disabled' : '';
                    }
                })
                .on('changeDate', function (ev) {
                    if (ev.date.valueOf() > checkout.date.valueOf()) {
                        var newDate = new Date(ev.date)
                        newDate.setDate(newDate.getDate() + 1);
                        checkout.update(newDate);
                    }
                    checkin.hide();
                    $('#endt')[0].focus();
                }).data('datepicker');
            var checkout = $('#endt').fdatepicker({
                leftArrow:'<<',
                rightArrow:'>>',
                onRender: function (date) {
                    //结束日期 要大于起始日期 || 起始日期跟结束日期在一个月之内 || 结束日期小于当前日期
                    return date.valueOf() <= checkin.date.valueOf() ||  parseInt((date.valueOf()- checkin.date.valueOf()) / (1000 * 60 * 60 * 24))  > 30 || date.valueOf() > now.valueOf() ? 'disabled' : '';
                }
            }).on('changeDate', function (ev) {
                checkout.hide();
            }).data('datepicker');
        })



        //获取数据
        getData(1,0,$('.isDelayOrderList'));
        bindEvent();
    }

    //getheader
    function getHeader(){
        var td = [

                {
                    txt:'微信号'
                },

                {
                    txt:'下单时间'
                },
                {
                    txt:'收货人'
                },
                {
                    txt:'收货地址'
                },
                {
                    txt:'订单金额'
                },
                {
                    txt:'订单明细'
                },
                {
                    txt:'交易状态'
                },
                {
                    txt:'支付方式'
                },
                {
                    txt:'延迟时间',
                    cn:'isHide'
                },
                {
                    txt:'操作',
                    //cn:'isHide'
                },
            ],
            tpl3= '<dd  class="col {{cn}}">{{txt}}</dd>';

        var tdHtml = [];
        $.each(td,function(j,tdT){
            tdHtml.push(bainx.tpl(tpl3,tdT));
        })

        var html = '<div class="detailTable grid"><dl class="thead row">'+tdHtml.join('')+'</dl><ul class="orderList mainContent"></ul></div>';
        return html;
    }


    //获取数据
    function getData(isDelay,pg,obj,wxno,contactName,tStartTime,tEndTime,isSearch){
        //var user = sessionStorage.getItem('currentExpert');
        //    user = JSON.parse(user);
        var //buyerid = user[2],
            data = {
            //isDelayTime:isDelay,
            type:1,
            //allTrade:0,
           // buyerId:buyerid,
            pg:pg,
            sz:15,
            hasTrade:3
            }

        if(isDelay){
            data.isDelayTime = isDelay;
        }
        if(wxno){
            data.wxNo = wxno;
        }
        if(contactName){
            data.contactName = contactName;
        }
        if(tStartTime || tEndTime){
            data.tStartTime = tStartTime;
            data.tEndTime = tEndTime;
        }


        Data.getMineScBoxTradeList(data).done(function(res){

        deliveryList_Wrap = $('#deliveryList_Wrap');
            if(pg == 0){
                //obj.html(getHeader());
            }
            if(isSearch && pg == 0){
                obj.find('.orderList').html('');
            }


            getTableList(res,isDelay,obj,pg);



         })
    }

    //获取表数据
    function getTableList(data,isDelay,obj,pg){

        if(data.list && data.list.length > 0) {
            var tpl = '<li class="row" data-id="{{id}}" data-uid="{{userId}}" data-delaytime="{{appointDeliveryTime}}" data-trade-id="{{tradeId}}"><dd  class="col wxno fvc fb fac">{{wxNo}}</dd><dd  class="col orderTime fvc fb fac" >{{orderTime}}</dd><dd  class="col contactName fvc fb fac">{{contactName}}</dd><dd  class="col addr fvc fb fac">{{province}}{{city}}{{district}}{{addrDetail}}</dd><dd  class="col price fvc fb fac">{{price}}</dd><dd  class="col product fvc fb fac"><div>{{product}}{{memo}}</div></dd><dd  class="col status fvc fb fac"><div class="statusW">{{status}}{{express}}</div> </dd><dd  class="col payType fvc fb fac"><div class="payway">{{pay_Type}}{{offPay}}</div> </dd>{{delayTime}}<dd class="col fvc fb fac operate">{{operate}}</dd></li>',
                html = [];

            $.each(data.list, function (i, item) {
                item.orderTime = bainx.formatDate('Y-m-d', new Date(item.tradeDateCreated));
                item.price = (item.price / 100).toFixed(2);
                var status = ['','','','','已付款','待收货','已备货','已完成','已退款','已关闭'];
                status[20] = '已完成';
                item.status = status[item.tradeStatus];
                if(item.logisticsVO){
                    item.contactName = item.logisticsVO.contactName;
                    item.province = item.logisticsVO.province;
                    item.city = item.logisticsVO.city;
                    item.district = item.logisticsVO.district;
                    item.addrDetail = item.logisticsVO.addrDetail;
                    item.memo =  item.logisticsVO.memo ? '<p style="color: #bf5831;">备注：'+ item.logisticsVO.memo +'</p>': '';
                }


                //物流信息
                if(item.tradeStatus == 5){
                    item.express = '<p>'+item.expressCompany+'<br/>'+item.expressNO+'</p>';
                }



                item.operate =isDelay ?'<!--<i class="checkbox"></i>--><span class="editDelieveryBtn">修改延迟时间</span><span class="immediateDeliveryBtn">立即发货</span>' : item.tradeStatus == 4 ? '<span class="editMyOrderListBtn">修改订单</span>' : item.tradeStatus == 5 || item.tradeStatus == 7 || item.tradeStatus == 20 ?'<span class="reissueOrderBtn" data-id="'+item.id+'" data-uid="'+item.userId+'" data-tradeid="'+item.tradeId+'" data-uname="'+item.userName+'">补发订单</span>' : '';
                item.delayTime=isDelay ?'<dd class="col fvc fb fac delay-time">'+bainx.formatDate('Y-m-d', new Date(item.appointDeliveryTime))+'</dd>' :'';
                switch (item.payType){
                    case 7:
                        item.pay_Type = '支付宝';
                        break;
                    case 8:
                        item.pay_Type = '微信';
                        break;
                    case 11:
                        item.pay_Type = '企业微信';
                        break;
                    case 6:
                    case 9:
                    case 10:
                    case 12:
                        item.pay_Type = '货到付款';
                        if(item.payType == 9 || item.payType == 10 || item.payType == 12){
                            item.offPay = '预收：￥'+(item.prepaidFee/100)+'</p>';
                            if(item.payType == 9){
                                item.offPay  = '<p>支付宝' + item.offPay;
                            }
                            if(item.payType == 10){
                                item.offPay  = '<p>微信' + item.offPay;
                            }
                            if(item.payType == 12){
                                item.offPay  = '<p>企业微信' + item.offPay;
                            }
                        }
                        break;

                }
                var productH=[];
                $.each(item.productList,function(i,prod){

                    productH.push(prod.prodName+'×'+prod.num);
                })
                item.product = productH.join(' ');


                html.push(bainx.tpl(tpl, item));
            })

            //if(pg == 0){
            //    con.html(html.join(''));
            //}
            //else{
            obj.find('.orderList').append(html.join('')).attr({'data-hasnext':data.hasNext,'data-pg':pg});
            if(!isDelay){
                obj.find('.thead').find('dd.isHide').hide();
            }
            else{
                obj.find('.thead').find('dd.isHide').show();
            }

            obj.find('.noData').remove();




            // }
            //con.attr({'data-hasnext':res.hasNext,'data-pg':pg})
            // })
        }
        if(!(data.list && data.list.length > 0) && pg == 0) {
            obj.find('.orderList').append('<li class="noData">暂无</li>');
        }
        obj.show().siblings().hide();
        $('.searchCondition').show();
    }



    //
    function bindEvent(){
        $('.orderList').scroll(function(){
            var _this=$(this);
            var viewH=_this.height(),
                contentH =_this.get(0).scrollHeight,
                scrollTop = _this.scrollTop();
            if(scrollTop + viewH == contentH){
                if(_this.attr('data-hasnext') == 'true'){
                    var pg = parseInt(_this.attr('data-pg')) + 1,
                        isdelay = $('.logNav li').data('isdelay'),
                        wxno =  $.trim(deliveryList_Wrap.find('.searchwxno').val()),
                        contactName  = $.trim(deliveryList_Wrap.find('.customer').val()),
                        st = $.trim(deliveryList_Wrap.find('#startt').val()),
                        et = $.trim(deliveryList_Wrap.find('#endt').val()),
                        isSearch = false;
                    if($('.searchOrderList').css("display") == "block"){
                        isSearch = true;
                    }
                    getData(isdelay,pg,$(this).parents('.orderListContent'),wxno,contactName,st,et,isSearch);
                }
            }
        });
        deliveryList_Wrap
            //搜索
            .off('click', '.searchBtn').on('click', '.searchBtn', function (event) {
                var wxno =  $.trim(deliveryList_Wrap.find('.searchwxno').val()),
                    contactName  = $.trim(deliveryList_Wrap.find('.customer').val()),
                    tStartTime  = $.trim(deliveryList_Wrap.find('#startt').val()),
                    tEndTime  = $.trim(deliveryList_Wrap.find('#endt').val()),
                    isdelay = deliveryList_Wrap.find('.logNav li.active').data('isdelay');
                    if((tStartTime && !tEndTime) || (!tStartTime && tEndTime)){
                        bainx.broadcast('请输入时间');
                        return;
                    }

                getData(isdelay,0,$('.searchOrderList'),wxno,contactName,tStartTime,tEndTime,true);
             })
            //.off('keyup', '.search-input').on('keyup', '.search-input', function (event) {
            //    var isdelay = deliveryList_Wrap.find('.logNav li.active').data('isdelay');
            //    if($.trim($(this).val()) == '') {
            //        var index = deliveryList_Wrap.find('.logNav li.active').index();
            //        $('.orderListContent').eq(index).show().siblings().hide();
            //        $('.searchOrderList .orderList').html('');
            //    }
            //    if(event.keyCode == 13) {
            //        var wxno = $.trim(deliveryList_Wrap.find('.search-input').val());
            //        $('.searchOrderList .orderList').html('');
            //        getData(isdelay, 0, $('.searchOrderList'),wxno);
            //    }
            //})

        //选择操作
            .off('click', '.logNav li').on('click', '.logNav li', function (event) {
                var index  = $(this).index();
                $(this).addClass('active').siblings().removeClass('active');
                var curC = $('.orderListContent').eq(index);
                curC.show().siblings().hide();
                $('.searchCondition').show();
                if(curC.find('li').length == 0){
                    getData($(this).data('isdelay'),0,curC);
                }


             })

            //修改延迟时间
                .off('click', '.editDelieveryBtn').on('click', '.editDelieveryBtn', function (event){
                    var pop = deliveryList_Wrap.find('.deliveryPOP');
                    var $parent = $(this).parents('li'),delaytime = $parent.attr('data-delaytime');
                    $parent.addClass('cur').siblings().removeClass('cur');


                        var htm =[];
                        for(var i = 1;i<11;i++){
                            var _nowTime =  new Date().getTime(),//
                                diffD = parseInt(( delaytime - _nowTime) /1000/3600/24),isActive='';
                            if(diffD+1 == i){
                                isActive = 'active';
                            }
                            htm.push('<span class="choiceItem selDeliveryDayWrap '+isActive+'"><b>'+i+'天后</b><span class="selDeliveryDay">' + GetDateStr(i).date + '</span>('+GetDateStr(i).week+')</span>');
                        }
                        pop.html('<p>请选择延迟发货时间</p><div class="deliver-time-content">'+htm.join('')+'</div><div class="tfoot"> <span class="editDelivery">修改</span><span class="resetDelivery">取消</span></div>').removeClass('hide');

                })
                //立即发货
                .off('click', '.immediateDeliveryBtn').on('click', '.immediateDeliveryBtn', function (event){
                    $(this).parents('li').addClass('cur').siblings().removeClass('cur');
                    deliverTime();
            })


        //修改订单
            .off('click', '.editMyOrderListBtn').on('click', '.editMyOrderListBtn', function (event){
                    var $parent = $(this).parents('li'),userId = $parent.data('uid'),tradeId =  $parent.data('trade-id'),id = $parent.data('id');
                    $parent.addClass('current').siblings().removeClass('current');
            $parent.parents('.orderListContent').addClass('curWrap').siblings().removeClass('curWrap');
            $('body').attr('data-tradeid',tradeId);
                    $('.csadUserMessageContainer').html('<div class="csadUserMsgContent"><i class="closeEditOrderBtn"></i></div>').show();
                    csadCreateOrder.prototype.init(userId,id,true,true);
            })
        //关闭弹窗
            .off('click', '.closeEditOrderBtn').on('click', '.closeEditOrderBtn', function (event){
                    $('.csadUserMessageContainer').hide();
            })

        //补发订单
            .off('click', '.reissueOrderBtn').on('click', '.reissueOrderBtn', function (event){
                if(!$(this).hasClass('disabled')){
                    var _bid = $(this).data('id'),
                        _uid = $(this).data('uid'),
                        tradeId = $(this).data('tradeid'),
                        userName = $(this).data('uname');
                    reissueOrder(_uid,userName,tradeId,_bid);
                    $(this).addClass('disabled');
                }
            })


            //选择时间
        deliveryList_Wrap.find('.deliveryPOP').off('click', '.choiceItem').on('click', '.choiceItem', function (){
                    $(this).addClass('active').siblings().removeClass('active');
            })
            .off('click', '.editDelivery').on('click', '.editDelivery', function (event){

                deliverTime(true);

            })

            .off('click', '.resetDelivery').on('click', '.resetDelivery', function (event){
            deliveryList_Wrap.find('.deliveryPOP').addClass('hide');
        })




        //添加个人信息

    }

    //
    function deliverTime(state){

        var $target = deliveryList_Wrap.find('li.cur');
        var data={
            tradeId:$target.data('trade-id'),

        }
        if(state){
            data.appointDeliveryTime=deliveryList_Wrap.find('.deliveryPOP').find('.active .selDeliveryDay').text();
        }
        Data.expertSetTradeAppointDeliveryTime(data).done(function(){
            bainx.broadcast('修改成功！');
            deliveryList_Wrap.find('.deliveryPOP').addClass('hide');
            $target.attr('data-delaytime',new Date(data.appointDeliveryTime).getTime());
            if(!state){
                $target.remove();
                var badgegroup = $('.deliveryList .badgegroup'),
                    num =parseInt(badgegroup.text());
                    num = --num;
                badgegroup.text(num);
                if(num == 0){
                    badgegroup.hide();
                }

            }
        })
    }

    function tplHt(){
        var tpl = '';

        return tpl;
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

    return init;
})



