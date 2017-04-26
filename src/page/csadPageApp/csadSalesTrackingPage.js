/**
 * 销售追踪
 * Created by xiuxiu on 2016/7/18.
 */
define('h5/js/page/csadSalesTrackingPage',[
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/page/csadUserMessage',
    'h5/css/page/csadCssZy.css'
], function($,URL, Data,CsadUserMessage) {
    var saleTrack,firstLoad = true;
    function init(hasTrade,tradestatus,pg,titIndx,fromPage,detectId,boxId,uid){
        saleTrack = $('#salesTracking_Wrap');

        var html=initSalesTracking();


        saleTrack.append(html);

        titIndx = titIndx ? titIndx : 1;
        boxOrderStatistics(titIndx);//盒子订单统计
        getListOfBoxes(hasTrade,tradestatus,pg,titIndx,fromPage,boxId,detectId,uid);//获取盒子订单列表.
        Events();

    }

    //
    function initSalesTracking(){
        var template='<section id="salestracking" class="row"><div class="boxleft" id="boxleft"><div class="top_banner"><ul class="clearfix"></ul></div><div class="con_box row"><div class="leftbox"><div class="payment_people box_order_people1 box_order_people tradeStatus_0 hide"><ul></ul></div><div class="payment_people box_order_people2 box_order_people tradeStatus_2 hide"><ul></ul></div><div class="payment_people box_order_people3 box_order_people tradeStatus_4 hide"><ul></ul></div><div class="payment_people box_order_people4 box_order_people tradeStatus_6 hide"><ul></ul></div><div class="payment_people box_order_people5 box_order_people tradeStatus_7 hide"><ul></ul></div><div class="payment_people box_order_people6 box_order_people tradeStatus_5 hide"><ul></ul></div></div><div class="rightbox col col-10"></div></div></div><div class="boxright " id="boxright"></div></section>';
        return template;
    }

    //盒子订单统计
    function boxOrderStatistics(titIndx){
        var data={
                type:1,
                hasTrade:0,
                allTrade:0
            },
            html=[];
        Data.getMineScBoxTradeCount(data).done(function(res) {
            var template='<li class="no_orders1 fl tTSatus_0">未下单({{noOrderCount}})</li><li class="unpaid1 fl tTSatus_2">未付款({{noPayOrderCount}})</li><li class="already_paid1 tTSatus_4 fl">已付款({{payedOrderCount}})</li><li class="stocking1 tTSatus_6 fl">已备货({{readyOrderCount}})</li><li class="receipt1 tTSatus_7 fl">已收货({{finishOrderCount}})</li><li class="shipped1 tTSatus_5 fl">已发货({{sendedOrderCount}})</li>';
            html.push(bainx.tpl(template, res));
            saleTrack.find('.top_banner ul').append(html.join(''));
            saleTrack.find('.top_banner li').eq(titIndx-1).addClass('active').siblings().removeClass('active');
        })
    }

    //获取盒子订单列表
    function getListOfBoxes(hasTrade,tradestatus,pg,i,fromPage,fromboxId,fromDpid,fromuid){


        var data={
                type:1,
                hasTrade:hasTrade,
                allTrade:0,
                tradeStatus:tradestatus,
                pg:pg,
                sz:fromPage ? (parseInt(pg)+1)*10 : 10
            },
            html=[];

        Data.getMineScBoxTradeList(data).done(function(res) {
            var template='<li id="saleTbox{{id}}" data-boxId="{{id}}" data-detectReportId="{{detectReportId}}" data-uid="{{userId}}" class="boxItem_{{id}}"><div class="people_box row fvc"><div class="pic"><img src="{{userPicUrl}}"></div><div class="people_msg"><p class="f18"><strong>{{nicknameM}}</strong></p><p>盒子名：{{boxName}}</p><p>￥{{price}}</p></div><div class="p_r"><p class="f12">{{time}}</p><p>{{orderstatus}}</p></div></div></li>';
            if ($.isArray(res.list) && res.list.length) {
                var orderstatus=$('body').attr('data-orderstatus');
                if(firstLoad){
                    CsadUserMessage('.rightbox',res.list[0].userId,saleTrack);
                    $('.csadUserMsgContent,.containerQuestion,.containerUserTrajectory').height($('.csadUserMessageContainer').height()-70);
                }

                $.each(res.list,function(index,item){
                    item.nicknameM = item.memoName ? item.memoName : item.userName;
                    item.time=bainx.formatDate('Y-m-d h:i', new Date(item.lastUpdated));
                    item.orderstatus=orderstatus;
                    item.price=(item.price/100).toFixed(2);
                    html.push(bainx.tpl(template,item));
                });
            }else{
                html=['<li class="tc"><div class="people_box row fvc">没有数据哦！</div></li>'];
            }

            nexthandle(i);
            if(fromboxId){
                scrollHeight(i,fromboxId);
            }
            function nexthandle(i){
                saleTrack.find('.box_order_people'+i+' ul').append(html.join('')+'<li class="box_next_page tc" data-page='+data.pg+'>下一页</li>');
                fromPage && firstLoad ?saleTrack.find('#saleTbox'+boxId).children().addClass('active') : saleTrack.find('.box_order_people1 li').eq(0).children().addClass('active');
                saleTrack.find('.box_order_people'+i).show().siblings('.box_order_people').hide();
                if(!res.hasNext){
                    saleTrack.find('.box_order_people'+i+' .box_next_page').remove();
                }

            }

            var boxId,detectId,uid;
            if(!fromboxId){
                if(res.list[0]){
                    boxId = res.list[0].id;
                    detectId = res.list[0].detectReportId;
                    uid = res.list[0].userId;
                }
            }
            else if(fromboxId){
                boxId =   fromboxId;
                detectId = fromDpid;
                uid = fromuid;

                }
            if(firstLoad){
                userMessage(detectId,boxId,uid)
            }
            if(!res.list){
                saleTrack.find('.csadUserMsgTitle').hide();
            }else{
                saleTrack.find('.csadUserMsgTitle').show();
            }
            firstLoad = false;
        }).fail(function(){
        });
        function   formatDate(now)   {
            var   year=now.getYear();
            var   month=now.getMonth()+1;
            var   date=now.getDate();
            var   hour=now.getHours();
            var   minute=now.getMinutes();
            var   second=now.getSeconds();
            return   hour+":"+minute;
        }
    }

    function Events(){

        $('#salestracking')
            .on('click','.box_next_page',function(e){
                var i = $(this).parent().parent().index() + 1;
                e.stopPropagation();

                var page = $(this).attr('data-page')+1;
                switch (i){
                    case 1:
                        getListOfBoxes(2,'',page,i);
                        break;
                    case 2:
                        getListOfBoxes(0,2,page,i);
                        break;
                    case 3:
                        getListOfBoxes(0,4,page,i);
                        break;
                    case 4:
                        getListOfBoxes(0,6,page,i);
                        break;
                    case 5:
                        getListOfBoxes(0,'7,20',page,i);
                        break;
                    case 6:
                        getListOfBoxes(0,5,page,i);
                        break;
                }
                saleTrack.find('.box_order_people'+i+' .box_next_page').eq(0).remove();
            })
            .on('click','.top_banner li',function(){
               // var tradeS = ['','未下单','未付款','已付款','已备货','已收货','已发货'];

                    saleTrack.find('.rightbox').children().remove();
                    saleTrack.find('.boxright').empty();
                    var index = $(this).index() + 1;
                    $(this).addClass('active').siblings().removeClass('active');
                    var boxId = saleTrack.find('.box_order_people'+index).find('li').eq(0).data('boxid'),
                        detectId = saleTrack.find('.box_order_people'+index).find('li').eq(0).data('detectreportid'),
                        uid  = saleTrack.find('.box_order_people'+index).find('li').eq(0).data('uid');
                    if($('.box_order_people'+index+' ul li').length>=1){
                        saleTrack.find('.box_order_people'+index).show().siblings('.box_order_people').hide();
                        CsadUserMessage('.rightbox',uid);
                        saleTrack.find('.csadUserMsgContent,.containerQuestion,.containerUserTrajectory').height($('.csadUserMessageContainer').height()-70);
                        userMessage(detectId,boxId,uid);
                    }else{
                        switch (index){
                            case 1:
                                getListOfBoxes(2,'',0,index);
                                break;
                            case 2:
                                getListOfBoxes(0,2,0,index);
                                break;
                            case 3:
                                getListOfBoxes(0,4,0,index);
                                break;
                            case 4:
                                getListOfBoxes(0,6,0,index);
                                break;
                            case 5:
                                getListOfBoxes(0,'7,20',0,index);
                                break;
                            case 6:
                                getListOfBoxes(0,5,0,index);
                                break;

                        }
                        userMessage(detectId,boxId,uid);
                        saleTrack.find('.box_order_people'+index).show().siblings('.box_order_people').hide();
                    }
                    if(saleTrack.find('.box_order_people'+index+' ul li .people_box').find('.people_msg').length!=0){
                        saleTrack.find('.csadUserMsgTitle').show();
                    }else{
                        saleTrack.find('.csadUserMsgTitle').hide();
                    }
            })
            .on('click','.people_box',function(){
                if($(this).children('.people_msg').length==0){
                    return;
                }
                var uid=$(this).parent().attr('data-uid');
                saleTrack.find('.rightbox').children().remove();
                saleTrack.find('.csadUserMessageContainer').children('.csadUserMsgContent').remove();
                CsadUserMessage('.rightbox',uid);
                $(this).addClass('active').parent().siblings().children().removeClass('active');
                var boxId = $(this).parent().data('boxid'),
                    detectId = $(this).parent().data('detectreportid'),
                    uid  = $(this).parent().data('uid');
                userMessage(detectId,boxId,uid);
            })
    }

    //右侧用户信息
    function userMessage(detectId,boxId,uid){
        if(detectId){
            saleTrack.find('.containerQuestion').html('<iframe src="'+URL.questionnaireSurveyPage+'?detectId='+detectId+'"></iframe>');
        }
        if(boxId && detectId){
            var currentIMLocalSale = localStorage.getItem('currentIM');//当前用户的信息保存在localstorage中的
            currentIMLocalSale = JSON.parse(currentIMLocalSale);
            var  csadName = currentIMLocalSale[2],
                csadTel = currentIMLocalSale[4];

            saleTrack.find('.boxright').html('<iframe src="'+URL.createMineBoxPage+'?boxId='+boxId+'&rid='+ detectId+'&csadName='+csadName+'&csadTel='+csadTel+'"></iframe>');
        }
        //用户轨迹
        if(uid){
            saleTrack.find('.rightbox').show();

        }

        saleTrack.find('.csadUserMsgContent,.containerQuestion,.containerUserTrajectory').height($('.csadUserMessageContainer').height()-70);
    }
    //滚动指定位置
    function scrollHeight(index,boxId){

        var ele=$('#salestracking .leftbox .box_order_people'+index);
        ele.find('li').each(function(){
            var _this=$(this);
            if(_this.attr('data-boxid')==boxId){
                _this.children().addClass('active');
                ele.scrollTop((_this.position().top)-205);
            }
        })
    }
    return {
        init:init,
        scrollHeight:scrollHeight,
        userMessage:userMessage,
        getListOfBoxes:getListOfBoxes
    }
})