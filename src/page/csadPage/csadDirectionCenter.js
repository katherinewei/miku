/**
 * Created by Spades-k on 2016/7/21.
 */
define('h5/js/page/csadDirectionCenter',[
    'jquery',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/url',
    'h5/js/page/csadSalesTrackingPage',
    'h5/js/page/csadHoneymoonReturnPage',
    'h5/css/page/csadCssZy.css'
], function ($, Data, Common, URL,CsadSalesTrackingPage,CsadHoneymoonReturnPage) {

    var indexWrap;
    function initDirectionCenter(){

        Events();
        boxOrderStatistics();//盒子订单统计
        getListOfBoxes(2,'',0);//获取盒子订单列表
        returning();//待回访统计
        returninglist(1,1,0);//待回访列表
        indexWrap = $('#index_Wrap');
    }

    function csadDirectionCenterHtml(){
        var template='<section id="direction_box"><div id="direction_center"><div class="con_box clearfix"><div class="leftbox clearfix"><div class="payment_list box_order"><ul></ul></div><div class="payment_people box_order_people1 box_order_people"><ul></ul></div><div class="payment_people box_order_people2 box_order_people hide"><ul></ul></div><div class="payment_people box_order_people3 box_order_people hide"><ul></ul></div><div class="payment_people box_order_people4 box_order_people hide"><ul></ul></div><div class="payment_people box_order_people5 box_order_people hide"><ul></ul></div><div class="payment_people box_order_people6 box_order_people hide"><ul></ul></div></div><div class="rightbox"><div class="payment_list returning"><ul></ul></div><div class="payment_people returning_people returning_people1"><ul></ul></div><div class="payment_people returning_people returning_people2 hide"><ul></ul></div><div class="payment_people returning_people returning_people3 hide"><ul></ul></div><div class="payment_people returning_people returning_people4 hide"><ul></ul></div><div class="payment_people returning_people returning_people5 hide"><ul></ul></div><div class="payment_people returning_people returning_people6 hide"><ul></ul></div><div class="payment_people returning_people returning_people7 hide"><ul></ul></div></div></div></div></section>';

        return template;
    }

    //盒子订单统计
    function boxOrderStatistics(){
        var data={
                type:1,
                hasTrade:0,
                allTrade:0
            },
            html=[];
        Data.getMineScBoxTradeCount(data).done(function(res) {
            var template='<li class="no_orders active" data-trade-status="0"><span>未下单</span>({{noOrderCount}})</li><li class="unpaid" data-trade-status="2"><span>未付款</span>({{noPayOrderCount}})</li><li class="already_paid" data-trade-status="4"><span>已付款</span>({{payedOrderCount}})</li><li class="stocking" data-trade-status="6"><span>已备货</span>({{readyOrderCount}})</li><li class="receipt" data-trade-status="7"><span>已收货</span>({{finishOrderCount}})</li><li class="shipped" data-trade-status="5"><span>已发货</span>({{sendedOrderCount}})</li>';
            html.push(bainx.tpl(template, res));
            indexWrap.find('.box_order ul').append(html.join(''));
        })

    }

    //待回访统计
    function returning(){
        Data.getBoxChatUserCount().done(function(res) {
            var day = [res.day1Count,res.day2Count,res.day3Count,res.day4Count,res.day5Count,res.day6Count,res.day7Count],
                dayWord = ['一','二','三','四','五','六','七'],
                html=[];
            $.each(day,function(index,item){
                var i = index + 1;
                html.push('<li class="day'+i+'_return"><div class="list_box row fvc fac"><div class="box_l"><p>第'+dayWord[index]+'天</p><p>待回访</p></div><div class="box_r"><p>('+item+')</p></div></div></li>');
            })
            indexWrap.find('.returning ul').append(html.join('')).find('li').eq(0).addClass('active');
        })

    }

    //待回访人数列表
    function returninglist(daytype,dayorder,pg){
        var data={
                dayType:daytype,
                dayOrder:dayorder,
                pg:pg,
                sz:10
            },
            html=[];
        Data.getBoxChatUserVOList(data).done(function(res) {
            var template='<li data-boxId="{{boxId}}" data-detectReportId="{{detectReportId}}" data-uid="{{userId}}" data-day="{{dayOrder}}" data-emuid="{{em_user_name}}"><div class="people_box row"><div class="pic"><img src="{{profile_pic}}"></div><div class="people_msg"><p class="f18"><strong>{{nicknameM}}</strong></p></div><div class="p_r"><p class="f12">{{time}}</p></div></div></li>';
            if ($.isArray(res.list) && res.list.length) {
                $.each(res.list,function(index,item){
                    item.profile_pic = item.profile_pic  ? item.profile_pic :  imgPath+'common/images/avatar-small.png';
                    item.nicknameM = item.memoName ? item.memoName : item.nickname;
                    item.time=bainx.formatDate('Y-m-d h:i', new Date(item.boxCreatedTime));
                    html.push(bainx.tpl(template,item));
                })
            }else{
                html=['<li class="tc"><div class="people_box row fvc" style="padding: 15px 10px !important;">没有数据哦！</div></li>'];
            }

            indexWrap.find('.returning_people'+dayorder+' ul').append(html.join('')+'<li class="returning_next_page tc" style="border-bottom: none !important;" data-page="'+data.pg+'">下一页</li>');
                if(!res.hasNext){
                    indexWrap.find('.returning_people'+dayorder+' .returning_next_page').remove();
                }

        }).fail(function(){
        });

    }

    //获取盒子订单列表
    function getListOfBoxes(hasTrade,tradestatus,pg){
        var data={
                type:1,
                hasTrade:hasTrade,
                allTrade:0,
                tradeStatus:tradestatus,
                pg:pg,
                sz:10
            },
            html=[];
        Data.getMineScBoxTradeList(data).done(function(res) {
            var template='<li data-boxId="{{id}}" data-detectReportId="{{detectReportId}}" data-uid="{{userId}}" data-pages="{{pages}}"><div class="people_box row fvc"><div class="pic"><img src="{{userPicUrl}}"></div><div class="people_msg"><p class="f18"><strong>{{nicknameM}}</strong></p><p>盒子名：{{boxName}}</p><p>￥{{price}}</p></div><div class="p_r"><p class="f12">{{time}}</p><p>{{orderstatus}}</p></div></div></li>';
            if ($.isArray(res.list) && res.list.length) {
                var datatime='';
                var orderstatus=$('.box_order li.active span').text();

                $.each(res.list,function(index,item){
                    item.time=bainx.formatDate('Y-m-d h:i', new Date(item.lastUpdated));
                    item.pages=pg;
                    if(new Date(item.lastUpdated).getHours()<=11){
                        datatime='上午';
                    }else if(new Date(item.lastUpdated).getHours()==12){
                        datatime='中午';
                    }else{
                        datatime='下午';
                    }
                    item.nicknameM = item.memoName ? item.memoName : item.userName;
                    item.data=datatime;
                    item.orderstatus=orderstatus;
                    item.price = (item.price / 100).toFixed(2)
                    html.push(bainx.tpl(template,item));
                });
            }else{
                html=['<li class="tc"><div class="people_box row fvc">没有数据哦！</div></li>'];
            }
            var boxsflag = $('.box_order li.active').index()+1;

            indexWrap.find('.box_order_people'+boxsflag+' ul').append(html.join('')+'<li class="box_next_page tc" style="border-bottom: none !important;" data-page="'+data.pg+'">下一页</li>');
                if(!res.hasNext){
                    indexWrap.find('.box_order_people'+boxsflag+' .box_next_page').remove();
                }


        }).fail(function(){

        });
    }
    function   formatDate(now)   {
        var   year=now.getYear();
        var   month=now.getMonth()+1;
        var   date=now.getDate();
        var   hour=now.getHours();
        var   minute=now.getMinutes();
        var   second=now.getSeconds();
        return   hour+":"+minute;
    }
    function Events(){
        $('#direction_box').on('click','.box_next_page',function(e){
            var i = $(this).parent().parent().index();
            e.stopPropagation();
            var page = parseInt($(this).attr('data-page'))+1;
            switch (i){
                case 1:
                    getListOfBoxes(2,'',page);
                    break;
                case 2:
                    getListOfBoxes(0,2,page);
                    break;
                case 3:
                    getListOfBoxes(0,4,page);
                    break;
                case 4:
                    getListOfBoxes(0,6,page);
                    break;
                case 5:
                    getListOfBoxes(0,'7,20',page);
                    break;
                case 6:
                    getListOfBoxes(0,5,page);
                    break;
            }

            indexWrap.find('.box_order_people'+i+' .box_next_page').eq(0).remove();
        })
            .on('mouseover','.people_box',function(){
            $(this).addClass('active');
        })
            .on('mouseout','.people_box',function(){
                $(this).removeClass('active');
            })
            .on('click','.leftbox .people_box',function(){
                if($(this).children('.people_msg').length==0){
                    return;
                }
                var boxId = $(this).parent().data('boxid'),
                    detectId = $(this).parent().data('detectreportid'),
                    uid  = $(this).parent().data('uid'),
                    pages=$(this).parent().data('pages'),
                    index = $('.box_order li.active').index()+1;
                $('.leftNav li').eq(3).addClass('active').siblings().removeClass('active');
                $('.contentWrap').eq(3).removeClass('hide').siblings().addClass('hide');
                if($('#saleTbox'+boxId).length > 0){
                    $('#saleTbox'+boxId).children('.people_box').addClass('active').parent().siblings().children().removeClass('active');
                    CsadSalesTrackingPage.userMessage(detectId,boxId,uid);
                    CsadSalesTrackingPage.scrollHeight(index,boxId);
                    ('#salestracking .top_banner li').eq(index-1).addClass('active').siblings().removeClass('active');
                }
                else{
                    var tar = indexWrap.find('.box_order li.active'),
                        tradestatus = tar.data('trade-status') == 0 ? '' : tar.data('trade-status'),
                        hasTrade = tradestatus == 0 ? 2 : 0;
                    CsadSalesTrackingPage.init(hasTrade,tradestatus,pages,index,true,detectId,boxId,uid);
                }
            })
            .on('click','.rightbox .people_box',function(){
                if($(this).children('.people_msg').length==0){
                    return;
                }
                var uid  = $(this).parent().data('uid'),
                    emuid = $(this).parent().data('emuid'),
                    dayOrder = $(this).parent().data('day'),
                    boxId = $(this).parent().data('boxid'),
                    index = $('.returning li.active').index()+1;
                if(dayOrder >= 8) {
                    dayOrder = 8;
                }
                //$('.leftNav li.payVisit').find('i').click();
                $('.leftNav li.payVisit').addClass('active').siblings().removeClass('active');
                $('#payVisit_Wrap').removeClass('hide').siblings().addClass('hide');


                if($('#payVisit_Wrap').children().length == 0){
                    CsadHoneymoonReturnPage.init(dayOrder,boxId,emuid);
                }
                else{
                    CsadHoneymoonReturnPage.dayReturnData($('#payVisit_Wrap').find('.day'+dayOrder+'_return'),boxId)
                }

                //if($('.returnVisit'+boxId).length > 0){
                //    $('.returnVisit'+boxId).addClass('currentWin').siblings().removeClass('currentWin');
                //    $('#payVisit_Wrap .top_banner li').eq(index-1).addClass('active').siblings().removeClass('active');
                //    var $target = $('#payVisit_Wrap').find('#'+emuid);
                //   // CommonCsad.chooseContactDivClick($target[0],true,uid);
                //}
                //else{
                //    var tar = indexWrap.find('.returning li.active');
                //
                //}

            })
            .on('click','.box_order li',function(){
                //var tradeS = ['','未下单','未付款','已付款','已备货','已收货','已发货'];
                    var index = $(this).index() + 1;
                    $(this).addClass('active').siblings().removeClass('active');
                    if(indexWrap.find('.box_order_people'+index+' ul li').length>=1){
                        indexWrap.find('.box_order_people'+index).show().siblings('.box_order_people').hide();
                    }
                    else{
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
                        indexWrap.find('.box_order_people'+index).show().siblings('.box_order_people').hide();
                    }
              //  }
            })
            .on('click','.returning li',function(){//待回访
                $(this).addClass('active').siblings().removeClass('active');
                var index = $(this).index() +1;
                if($('.returning_people'+index+' ul li').length>=1){
                    $('.returning_people'+index).show().siblings('.returning_people').hide();
                }else{
                    returninglist(1,index,0);
                    indexWrap.find('.returning_people'+index).show().siblings('.returning_people').hide();
                }
        })
    }

    return{
        csadDirectionCenterHtml:csadDirectionCenterHtml,
        initDirectionCenter:initDirectionCenter
    }

})