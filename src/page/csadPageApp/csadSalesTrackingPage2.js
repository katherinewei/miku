/**
 * 销售追踪
 * Created by xiuxiu on 2016/7/18.
 */
define('h5/js/page/csadSalesTrackingPage2',[
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/page/csadCommon',
    'h5/js/page/csadUserMessage',
    'h5/css/page/csadCssZy.css'
], function($,URL, Data,CommonCsad,CsadUserMessage) {
    var saleTrack;
    function init() {
        saleTrack = $('#salesTracking_Wrap');

        $('body').attr('aloadflag',0);
        $('body').attr('iflag',1);
        $('body').attr('firsrload',1);
        var html=initSalesTracking();

        var tradeStatus = URL.param.tradeStatus;
        saleTrack.append(html);
        $('.tradeStatus_'+tradeStatus).removeClass('hide');
        $('body').attr('data-orderstatus','未下单');
        $('body').attr('data-page1','0');
        $('body').attr('data-page2','0');
        $('body').attr('data-page3','0');
        $('body').attr('data-page4','0');
        $('body').attr('data-page5','0');
        $('body').attr('data-page6','0');

        boxOrderStatistics(tradeStatus);//盒子订单统计

        //var page=parseInt($('body').attr('data-page5'))+1;
        if(!tradeStatus){
            $('body').attr('data-boxsflag','1')
            $('body').attr('data-orderstatus','未下单');
            getListOfBoxes(2,'',0,1);//获取盒子订单列表
            setTimeout(function(){
                $('.no_orders1').addClass('active');
            },1000)
        }
        if(tradeStatus == 0){
            $('body').attr('data-boxsflag','1')
            $('body').attr('data-orderstatus','未下单');
            setTimeout(function(){
                $('.no_orders1').addClass('active');
            },1000)
            getListOfBoxes(2,'',0,1);//获取盒子订单列表
        }else if(tradeStatus==2){
            $('body').attr('data-boxsflag','2');
            $('body').attr('data-orderstatus','未付款');
            setTimeout(function(){
                $('.unpaid1').addClass('active');
            },1000)
            getListOfBoxes(0,2,0,2);
        }else if(tradeStatus==4){
            $('body').attr('data-boxsflag','3')
            $('body').attr('data-orderstatus','已付款');
            getListOfBoxes(0,4,0,3);
            setTimeout(function(){
                $('.already_paid1').addClass('active');
            },1000)
        }else if(tradeStatus==6){
            $('body').attr('data-boxsflag','4')
            $('body').attr('data-orderstatus','已备货');
            setTimeout(function(){
                $('.stocking1').addClass('active');
            },1000)
            getListOfBoxes(0,6,0,4);
        }else if(tradeStatus==7){
            $('body').attr('data-boxsflag','5')
            $('body').attr('data-orderstatus','已收货');
            setTimeout(function(){
                $('.receipt1').addClass('active');
            },1000)
            getListOfBoxes(0,'7,20',0,5);
        }else if(tradeStatus==5){
            $('body').attr('data-boxsflag','6')
            $('body').attr('data-orderstatus','已发货');
            setTimeout(function(){
                $('.shipped1').addClass('active');
            },1000)
            getListOfBoxes(0,5,0,6);
        }
        //getListOfBoxes(2,tStatus,0);//获取盒子订单列表



        Events();

        //dragFn.dragBox('boxleft','rightdrag',false, false, false, true);
        //dragFn.dragBox('boxright','r',false, false, false, true);
    }

    //
    function initSalesTracking(){
        var template='<section id="salestracking" class="row"><div class="boxleft" id="boxleft"><div class="top_banner"><ul class="clearfix"></ul></div><div class="con_box row"><div class="leftbox"><div class="payment_people box_order_people1 box_order_people tradeStatus_0 hide"><ul></ul></div><div class="payment_people box_order_people2 box_order_people tradeStatus_2 hide"><ul></ul></div><div class="payment_people box_order_people3 box_order_people tradeStatus_4 hide"><ul></ul></div><div class="payment_people box_order_people4 box_order_people tradeStatus_6 hide"><ul></ul></div><div class="payment_people box_order_people5 box_order_people tradeStatus_7 hide"><ul></ul></div><div class="payment_people box_order_people6 box_order_people tradeStatus_5 hide"><ul></ul></div></div><div class="rightbox col col-10"></div></div></div><div class="boxright " id="boxright"></div></section>';
        return template;
    }

    //盒子订单统计
    function boxOrderStatistics(tradeStatus){
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
        })
    }

    //获取盒子订单列表
    function getListOfBoxes(hasTrade,tradestatus,pg,i){
        var pages=URL.param.pages;
        var first=$('body').attr('firsrload');
        var _pg,
            _sz;
        if(first=='1'){
            _pg=pages ? 0 : pg;
            _sz=pages ? (parseInt(pages)+1)*10 :10;
        }else{
            _pg=pg;
            _sz=10
        }
        var data={
                type:1,
                hasTrade:hasTrade,
                allTrade:0,
                tradeStatus:tradestatus,
                pg:_pg,
                sz:_sz
            },
            html=[];
        var iflag= $('body').attr('iflag');
        Data.getMineScBoxTradeList(data).done(function(res) {
            var template='<li data-boxId="{{id}}" data-detectReportId="{{detectReportId}}" data-uid="{{userId}}" class="boxItem_{{id}}"><div class="people_box row fvc"><div class="pic"><img src="{{userPicUrl}}"></div><div class="people_msg"><p class="f18"><strong>{{nicknameM}}</strong></p><p>盒子名：{{boxName}}</p><p>￥{{price}}</p></div><div class="p_r"><p class="f12">{{time}}</p><p>{{orderstatus}}</p></div></div></li>';
            if ($.isArray(res.list) && res.list.length) {
                var orderstatus=$('body').attr('data-orderstatus');
                if(iflag==1){
                    CsadUserMessage('.rightbox',res.list[0].userId);
                    $('.csadUserMsgContent,.containerQuestion,.containerUserTrajectory').height($('.csadUserMessageContainer').height()-70);
                }
                //csadQuestionnaireSurveyPage('',res.list[0].detectReportId,'','',res.list[0].emUserName);
                //
                //var tpm=CsadUserTrajectory.csadUserTrajectoryHtml();
                //$('#csadUserMessageContainer_'+res.list[0].userId+' .containerUserTrajectory').html(tpm);
                //CsadUserTrajectory.initUserTrajectory('miku_'+res.list[0].userId);

                //$('.containerUserTrajectory').html('<iframe src="'+URL.hActiveHtm+'?detectId='+res.list[0].detectReportId+'"></iframe>');
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
            var id=URL.param.boxId;
            scrollHeight(i,id);

            function nexthandle(i){
                saleTrack.find('.box_order_people'+i+' ul').append(html.join('')+'<li class="box_next_page tc">下一页</li>');
                saleTrack.find('.box_order_people'+i).show().siblings('.box_order_people').hide();
                if(!res.hasNext){
                    saleTrack.find('.box_order_people'+i+' .box_next_page').remove();
                }
            }

            var boxId,detectId,uid;
            if(!URL.param.boxId){
                if(res.list[0]){
                    boxId = res.list[0].id;
                    detectId = res.list[0].detectReportId;
                    uid = res.list[0].userId;
                }
            }else if(URL.param.boxId){
                var firsrload=$('body').attr('firsrload');
                if(firsrload==1){
                    boxId = URL.param.boxId;
                    detectId = URL.param.detectId;
                    uid = URL.param.uid;
                    CsadUserMessage('.rightbox',uid);
                }else{
                    if(res.list){
                        boxId = res.list[0].id;
                        detectId = res.list[0].detectReportId;
                        uid = res.list[0].userId;
                    }
                }
            }
            if(iflag==1){
                userMessage(detectId,boxId,uid)
            }
            if(!res.list){
                saleTrack.find('.csadUserMsgTitle').hide();
            }else{
                saleTrack.find('.csadUserMsgTitle').show();
            }
            $('body').attr('aloadflag',1);
            $('body').attr('firsrload',0);
        }).fail(function(){
            $('body').attr('aloadflag',1);
            $('body').attr('firsrload',0);
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

    //加载数据
    function loadData(i,e){

    }

    function Events(){

        $('#salestracking')
            .on('click','.box_next_page',function(e){
            var i = $(this).parent().parent().index() + 1;
            e.stopPropagation();
            var page=parseInt($('body').attr('data-page'+i))+1;
            $('body').attr('data-page'+i,page);
            $('body').attr('iflag',0);
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
                var tradeS = ['','未下单','未付款','已付款','已备货','已收货','已发货'];
                $('body').attr('iflag',1);
                if($('body').attr('aloadflag')==1){
                    saleTrack.find('.rightbox').children().remove();
                    saleTrack.find('.boxright').empty();
                    var index = $(this).index() + 1;
                    $('body').attr('data-boxsflag',index);
                    $('body').attr('data-orderstatus',tradeS[index]);
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
                }
            })
            .on('click','.people_box',function(){
            if($(this).children('.people_msg').length==0){
                return;
            }
            $('body').attr('iflag',1);
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
            //var tpm=CsadUserTrajectory.csadUserTrajectoryHtml();
            //$('.containerUserTrajectory').html(tpm);
            //CsadUserTrajectory.initUserTrajectory(uid.toString());
        }
        //$('.boxItem_'+boxId).children('.people_box').addClass('active').parent().siblings().children().removeClass('active');
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


    return init
})