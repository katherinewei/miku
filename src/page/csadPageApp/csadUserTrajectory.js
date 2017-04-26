/**
 * Created by Spades-k on 2016/7/20.
 */
define('h5/js/page/csadUserTrajectory',[
    'jquery',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/url',
    'h5/js/page/imageMagnification',
    'h5/js/page/getCsadPage',
    'h5/js/page/csadCreateMineBoxPage',
    'h5/js/page/csadCreateOrder',
    //'plugin/addressData/1.0.0/addressData',
    'h5/css/page/csadCssZy.css'
], function ($, Data, Common, URL,imageMagnification,getCsadPage,csadCreateMineBoxPage,csadCreateOrder) {
    var body;
    var loginEnter = ['Android客户端','IOS客户端','官网','微信','微博'];//匿名用户登录方式
    var wraper;
    var statusP,sourceP;

    function initUserTrajectory(userId,outer,obj){
        wraper= outer ? outer :getCsadPage();
        statusP = $('.leftNav li.active').data('status');
        sourceP = $('.leftNav li.active').data('source');

        var isTemp = isNaN(userId) ? true  : false;
        if(obj){        //iframe里面的
            body =  $(window.parent.document)
        }else{
            body = $('body');
        }

        body.on('click','.closeIframe',function(){
            $('.IframeBox').remove();
        })
        Events(userId);
        //if(isTemp){
        //    getTempSelectDialogDatasBySessionId(userId);
        //}
        //else{
            $('body').attr('buy_boxs_num_'+userId,'0');
            $('body').attr('report_num_'+userId,'0');
            $('body').attr('record_num_'+userId,'0');
            $('body').attr('buy_boxs_index_'+userId,'1');
            $('body').attr('report_index_'+userId,'1');
            $('body').attr('record_index_'+userId,'1');



            getBoxList(0,10,userId,false);//购买盒子记录
            //getReportList(userId,0,10,false);//分析报告列表
           // getUseRecordList(userId,0,10,false);//产品使用记录
       // }


    }

    function csadUserTrajectoryHtml(isTemp){
        var template;
             //isTemp = userId && userId.indexOf('_') > -1 ? true  : false;
        //if(isTemp){
        //    template='<section class="page-content grid" id="_index"><div class="usertrajectory_user_box"><div class="con"><div class="buy_box_records  chat_box"><div class="title tc">客户聊天记录</div><div class="table_con"><table class="one_msg chat_boxs_list"><tbody></tbody></table></div><div class="up_and_down"><p>展开</p></div></div></div></div></section>';
        //}
        //else{
            template='<section class="page-content grid" id="_index"><div class="usertrajectory_user_box"><div class="con"><div class="buy_box_records buy_box"><div class="title tc">用户订单记录</div><div class="table_con"><table class="one_msg buy_boxs_list"><tbody></tbody></table></div><div class="up_and_down"><p>展开</p></div></div><!--<div class="analysis_report_list"><div class="buy_box_records"><div class="title tc">分析报告列表</div><div class="table_con"><table class="one_msg report_list"><tbody></tbody></table></div><div class="up_and_down"><p>展开</p></div></div></div><div class="product_usage_record"><div class="buy_box_records"><div class="title tc">产品使用记录<span class="addrecord">新增记录</span></div><div class="table_con"><table class="one_msg use_record_list"><tbody></tbody></table></div><div class="up_and_down"><p>展开</p></div></div></div>--></div></div></section>';
       // }

        return template;
    }

    //获取客户聊天记录
    //function getTempSelectDialogDatasBySessionId(userId){
    //    var data = {
    //        sessionId:userId
    //    }
    //    Data.TempSelectDialogDatasBySessionId(data).done(function(res){
    //
    //        var tmp='<tr class="ul_boxId{{id}}"><td width="5%" style="border-top: 1px solid #E7E7E7 !important;"><i>{{order}}</i></td><td width="25%" style="border-top: 1px solid #E7E7E7 !important;"><p  class="createTimeB"><span>{{lastUpdated}}</span></p></td><td width="30%"><p>专家：{{name}}</p></td><td width="25%"><p>登录次数：{{num}}</p></td><td width="25%"><p>登录方式：{{loginEntrance}}</p></td></tr>';
    //        var html=[];
    //       // for(var j=0;j<arr.length;j++){
    //
    //               // var n=parseInt($('body').attr('buy_boxs_index_'+userId));
    //                //body.attr('buy_boxs_index_'+userId,n+1);
    //                $.each(res.data,function(index,item){
    //                    item.order = index+1;
    //                    item.loginEntrance = loginEnter[item.loginEntrance];
    //                    item.lastUpdated=bainx.formatDate('y-m-d h:i', new Date(item.lastUpdated));
    //                    html.push(bainx.tpl(tmp, item));
    //                })
    //
    //            //}
    //      //  }
    //        if(res.data.length==0){
    //            html=['<tr class="tc hide"><td colspan="7" style="padding: 23px 0;">暂无数据哦！</td></tr>'];
    //            wraper.find('#csadUserMessageContainer_'+userId).find('.chat_box').find('.up_and_down').remove();
    //        }
    //        wraper.find('#csadUserMessageContainer_'+userId).find('.chat_boxs_list tbody').append(html.join('')+'<tr class="buy_boxs_page hide"><td colspan="7">下一页</td></tr>');
    //        wraper.find('.chat_box .up_and_down').hide();
    //
    //        if(!res.hasNext){
    //            wraper.find('#csadUserMessageContainer_'+userId).find('.chat_boxs_list .chat_boxs_page').remove();
    //        }
    //    })
    //}


    //获取盒子订单
    function getBoxList(pg,sz,buyerid,showTr){
        var data={
            type:1,
            allTrade:0,
            buyerId:buyerid,
            pg:pg,
            sz:sz
        }
        Data.getMineScBoxTradeList(data).done(function(res) {
            var arr=TimeList(res);

            var tmp='<tr class=" ul_boxId{{id}}" data-id="{{id}}"><td width="5%" style="border-top: 1px solid #E7E7E7 !important;"><i>{{num}}</i></td><td width="15%" style="border-top: 1px solid #E7E7E7 !important;"><p  class="createTimeB">{{lastUpdated}}</p></td><td width="21%"><p>名称：{{boxName}}</p><p>{{time}}</p></td><td width="21%"><p>报告生成时间：</p><p>{{detectReportDate}}</p></td><td width="7%">￥{{price}}</td><td style="color:#FF6868; " width="10%" class="payStatus"  data-tradeStatus="{{status}}">{{tradeStatus}}</td><!--<td width="20%"><ul class="clearfix"><li class="fl">课程进度：</li><li class="fl"><p>共{{courseTimes}}分钟</p><p>第{{userStime}}/{{courseDuration}}天<p>已完成{{startedLessonTimes}}/{{totalLessonTimes}}次</p></li></ul></td>--><td width="15%">{{editBoxHtm}}<a data-id="{{id}}" data-reportid="{{detectReportId}}"  class="viewDetail viewBox">查看产品>></a>{{placeOrderHtm}}<a  class="viewDetail viewReportU" data-id="{{detectReportId}}">查看报告>></a><a  class="{{hide}} printReportBtn"  data-id="{{id}}">打印报告>></a></td></tr>';
            var tmp2='<tr data-id="{{id}}"><td width="5%"></td><td width="15%"><p style="display: none !important;"  class="createTimeB"></p></td><td width="21%"><p>名称：{{boxName}}</p><p>{{time}}</td><td width="21%"><p>报告生成时间：</p><p>{{detectReportDate}}</p></td><td width="7%">￥{{price}}</td><td style="color:#FF6868; " width="10%" class="payStatus" data-tradeStatus="{{status}}">{{tradeStatus}}</td><!--<td width="20%"><ul class="clearfix"><li class="fl">课程进度：</li><li class="fl"><p>共{{courseTimes}}分钟</p><p>第{{userStime}}/{{courseDuration}}天<p>已完成{{startedLessonTimes}}/{{totalLessonTimes}}次</p></li></ul></td>--><td width="15%">{{editBoxHtm}}<a data-id="{{id}}" data-reportid="{{detectReportId}}"  class="viewDetail viewBox">查看产品>></a>{{placeOrderHtm}}<a  class="viewDetail viewReportU" data-id="{{detectReportId}}">查看报告>></a><a  class="{{hide}} printReportBtn"  data-id="{{id}}">打印报告>></a></td></tr>';
            var html=[];
            for(var j=0;j<arr.length;j++){
                if(arr[j].length==1){
                    var n=parseInt($('body').attr('buy_boxs_index_'+buyerid));
                    body.attr('buy_boxs_index_'+buyerid,n+1);
                    $.each(arr[j],function(index,item){
                        res.lastUpdated=bainx.formatDate('Y-m-d', new Date(item.lastUpdated));
                        res.time=bainx.formatDate('h:i', new Date(item.lastUpdated));
                        res.detectReportDate = bainx.formatDate('Y-m-d h:i', new Date(item.detectReportDate));
                        res.num=n;
                        res.boxName=item.boxName;
                        res.price=(item.price/100).toFixed(2);
                        res.id=item.id;
                        res.status=item.tradeStatus;
                        res.detectReportId=item.detectReportId;
                        res.editBoxHtm = '';
                        res.placeOrderHtm = '';
                        if(item.tradeStatus==2){
                            res.tradeStatus='未付款';
                        }else if(item.tradeStatus==4){
                            res.tradeStatus='已付款';
                        }else if(item.tradeStatus==6){
                            res.tradeStatus='已备货';
                        }else if(item.tradeStatus==7){
                            res.tradeStatus='已收货';
                        }else if(item.tradeStatus==5){
                            res.tradeStatus='已发货';
                        }else if(item.tradeStatus==8){
                            res.tradeStatus='退款成功';
                        }else if(item.tradeStatus==20){
                            res.tradeStatus='已收货';
                        }else if(item.tradeStatus==9){
                            res.tradeStatus='已取消';
                        }else{
                            res.tradeStatus='未下单';
                        }

                        //var nowtime=new Date().getTime();
                        //if(item.mineCourse && item.mineCourse.userStime){
                        //    res.userStime=((nowtime-item.mineCourse.userStime)/86400000).toFixed(1) ? ((nowtime-item.mineCourse.userStime)/86400000).toFixed(1) : 0;
                        //}
                        //res.courseTimes=item.mineCourse && item.mineCourse.courseTimes ? item.mineCourse.courseTimes / 60 : 0;
                        //res.courseDuration=item.mineCourse && item.mineCourse.courseDuration ? item.mineCourse.courseDuration : 0;
                        //res.startedLessonTimes=item.mineCourse && item.mineCourse.startedLessonTimes ?item.mineCourse.startedLessonTimes : 0;
                        //res.totalLessonTimes=item.mineCourse && item.mineCourse.totalLessonTimes ? item.mineCourse.totalLessonTimes : 0;
                        //res.userStime =item.mineCourse && item.mineCourse.courseUserStime ? item.mineCourse.courseUserStime : 0;
                    })

                        //res.editBoxHtm = '<a data-id="'+res.id+'" data-reportid="'+res.detectReportId+'"  class="editBoxIt">编辑盒子>></a>';
                        //res.placeOrderHtm = '<a data-id="'+res.id+'" data-reportid="'+res.detectReportId+'"  class="placeOrderBtn">生成订单>></a>';

                    html.push(bainx.tpl(tmp, res));
                }else if(arr[j].length>1){
                    var n=parseInt($('body').attr('buy_boxs_index_'+buyerid));
                    body.attr('buy_boxs_index_'+buyerid,n+1);
                    $.each(arr[j],function(index,item){
                        res.lastUpdated=bainx.formatDate('Y-m-d', new Date(item.lastUpdated));
                        res.num=n;
                        res.time=bainx.formatDate('h:i', new Date(item.lastUpdated));
                        res.detectReportDate = bainx.formatDate('Y-m-d h:i', new Date(item.detectReportDate));
                        res.boxName=item.boxName;
                        res.price=(item.price/100).toFixed(2);
                        res.id=item.id;
                        res.status=item.tradeStatus;
                        res.detectReportId=item.detectReportId;
                        res.editBoxHtm = '';
                        res.placeOrderHtm = '';
                        if(item.tradeStatus==2){
                            res.tradeStatus='未付款';
                        }else if(item.tradeStatus==4){
                            res.tradeStatus='已付款';
                        }else if(item.tradeStatus==6){
                            res.tradeStatus='已备货';
                        }else if(item.tradeStatus==7){
                            res.tradeStatus='已收货';
                        }else if(item.tradeStatus==5){
                            res.tradeStatus='已发货';
                        }else if(item.tradeStatus==8){
                            res.tradeStatus='退款成功';
                        }else if(item.tradeStatus==20){
                            res.tradeStatus='已收货';
                        }else if(item.tradeStatus==9){
                            res.tradeStatus='已取消';
                        }else{
                            res.tradeStatus='未下单';
                            //res.editBoxHtm = '<a data-id="'+res.id+'" data-reportid="'+res.detectReportId+'"  class=" editBoxIt">编辑盒子>></a>';
                            //res.placeOrderHtm = '<a data-id="'+res.id+'" data-reportid="'+res.detectReportId+'"  class=" placeOrderBtn">生成订单>></a>';
                        }
                        //var nowtime=new Date().getTime();
                        //if(item.mineCourse && item.mineCourse.userStime){
                        //    res.userStime=((nowtime-item.mineCourse.userStime)/86400000).toFixed(1) ? ((nowtime-item.mineCourse.userStime)/86400000).toFixed(1) : 0;
                        //}
                        //res.courseTimes=item.mineCourse && item.mineCourse.courseTimes ? item.mineCourse.courseTimes  / 60 : 0;
                        //res.courseDuration=item.mineCourse && item.mineCourse.courseDuration ? item.mineCourse.courseDuration : 0;
                        //res.startedLessonTimes=item.mineCourse && item.mineCourse.startedLessonTimes ?item.mineCourse.startedLessonTimes : 0;
                        //res.totalLessonTimes=item.mineCourse && item.mineCourse.totalLessonTimes ? item.mineCourse.totalLessonTimes : 0;
                        //res.userStime =item.mineCourse && item.mineCourse.courseUserStime ? item.mineCourse.courseUserStime : 0;

                        //if(!arr[j][0].tradeStatus){
                        //    res.editBoxHtm = '<a data-id="'+res.id+'" data-reportid="'+res.detectReportId+'"  class="editBoxIt">编辑盒子>></a>';
                        //    res.placeOrderHtm = '<a data-id="'+res.id+'" data-reportid="'+res.detectReportId+'"  class="placeOrderBtn">生成订单>></a>';
                        //}

                        if(index==0){
                            html.push(bainx.tpl(tmp, res));
                        }else{
                            html.push(bainx.tpl(tmp2, res));
                        }
                    })
                }
            }
            if(res.list.length==0){
                html=['<tr class="tc hide"><td colspan="7" style="padding: 23px 0;">暂无数据哦！</td></tr>'];
                wraper.find('#csadUserMessageContainer_'+buyerid).find('.buy_box').find('.up_and_down').remove();
            }
            else if(res.list.length<=10){
                wraper.find('#csadUserMessageContainer_'+buyerid).find('.buy_box').find('.up_and_down').remove();
            }
            wraper.find('#csadUserMessageContainer_'+buyerid).find('.buy_boxs_list tbody').append(html.join('')+'<tr class="buy_boxs_page"><td colspan="7">下一页</td></tr>');
            //wraper.find('#csadUserMessageContainer_'+buyerid).find('.buy_boxs_list tr').eq(0).show();
            //wraper.find('#csadUserMessageContainer_'+buyerid).find('.buy_boxs_list tr').eq(1).show();
          //  showTr ?　 wraper.find('#csadUserMessageContainer_'+buyerid).find('.buy_boxs_list tr').removeClass('hide') : '';

            if(!res.hasNext){
                wraper.find('#csadUserMessageContainer_'+buyerid).find('.buy_boxs_list .buy_boxs_page').remove();
            }


            //获取最新盒子
            if(pg == 0){
                var gData = {
                    userId:buyerid
                }
                Data.getNewestBox(gData).done(function(res){
                    var  boxId_n = res.boxId
                    if(res.isOrder == 0 && boxId_n){
                        $('.buy_boxs_list tr').each(function(){
                            if(boxId_n == $(this).data('id')){
                                $(this).find('.viewBox').after('<a data-id="'+boxId_n+'"   class="editBoxIt">编辑产品>></a><a data-id="'+boxId_n+'"  class="placeOrderBtn">生成订单>></a>');
                                return false;
                            }
                        })
                    }

                })
            }

        })
    }

    ////获取分析报告列表
    //function getReportList(userId,pg,sz,showTr){
    //    var data={
    //        userId:userId,
    //        pg:pg,
    //        sz:sz
    //    };
    //    Data.selectUuserDetectRecordByzjId(data).done(function(res) {
    //        var arr=TimeList(res);
    //        var tmp='<tr class="hide ulboxIdReport_{{boxId}}" id="ulboxIdReport_{{boxId}}"><td width="5%" style="border-top: 1px solid #E7E7E7 !important;"><i class="num">{{num}}</i></td><td style="border-top: 1px solid #E7E7E7 !important;" width="15%"><p class="createTime">{{lastUpdated}}</p></td><td width="25%">{{createBox}}生成盒子</td><td width="10%">{{boxName}}</td><td width="30%"><p style="display: inline-block">报告生成时间：</p><p style="display: inline-block">{{recordlastUpdated}}</p></td><td width="15%"><a  class="viewDetail viewReportU"  data-id="{{id}}">查看报告>></a><a  class="{{hide}} printReportBtn"  data-id="{{boxId}}">打印报告>></a></td></tr>';
    //        var tmp2='<tr class="hide ulboxIdReport_{{boxId}}" id="ulboxIdReport_{{boxId}}"><td width="5%"></td><td width="15%"><p style="display: none !important;"  class="createTime"></p></td><td width="25%">{{createBox}}生成盒子</td><td width="10%">{{boxName}}</td><td width="30%"><p style="display: inline-block">报告生成时间：</p><p style="display: inline-block">{{recordlastUpdated}}</p></td><td width="15%"><a  class="viewDetail viewReportU" data-id="{{id}}">查看报告>></a><a  class="{{hide}} printReportBtn"  data-id="{{boxId}}">打印报告>></a></td></tr>';
    //        var html=[];
    //
    //        for(var j=0;j<arr.length;j++){
    //            if(arr[j].length==1){
    //                var n=parseInt($('body').attr('report_index_'+userId));
    //                body.attr('report_index_'+userId,n+1);
    //                $.each(arr[j],function(index,item){
    //                    res.hide = item.boxId ? '' : 'hide';
    //                    res.lastUpdated=bainx.formatDate('Y-m-d', new Date(item.lastUpdated));
    //                    res.time=bainx.formatDate('h:i', new Date(item.lastUpdated));
    //                    res.id=item.id;
    //                    res.boxId = item.boxId;
    //                    res.num=n;
    //                    res.boxName= res.boxId && item.boxName  ? '<p>盒子名：<span class="boxNameRoprt">'+item.boxName+'</span></p><p>'+res.time+'</p>' : '';
    //                    res.createBox = res.boxId ? '已' : '未';
    //                    res.recordlastUpdated=bainx.formatDate('Y-m-d h:i', new Date(item.recordlastUpdated));
    //                });
    //                html.push(bainx.tpl(tmp, res));
    //            }else if(arr[j].length>1){
    //                var n=parseInt($('body').attr('report_index_'+userId));
    //                body.attr('report_index_'+userId,n+1);
    //                $.each(arr[j],function(index,item){
    //                    res.hide = item.boxId ? '' : 'hide';
    //                    res.lastUpdated=bainx.formatDate('Y-m-d', new Date(item.lastUpdated));
    //                    res.time=bainx.formatDate('h:i', new Date(item.lastUpdated));
    //                    res.num=n;
    //                    res.id=item.id;
    //                    res.boxId = item.boxId;
    //                    res.boxName= res.boxId && item.boxName ? '<p>盒子名：<span class="boxNameRoprt">'+item.boxName+'</span></p><p>'+res.time+'</p>' : '';
    //                    res.createBox = res.boxId ? '已' : '未';
    //                    res.recordlastUpdated=bainx.formatDate('Y-m-d h:i', new Date(item.recordlastUpdated));
    //                    if(index==0){
    //                        html.push(bainx.tpl(tmp, res));
    //                    }else{
    //                        html.push(bainx.tpl(tmp2, res));
    //                    }
    //                })
    //            }
    //        }
    //
    //        if(res.list.length==0){
    //            html=['<tr class="tc hide"><td colspan="6">暂无数据哦！</td></tr>'];
    //            wraper.find('#csadUserMessageContainer_'+userId).find('.analysis_report_list').find('.up_and_down').remove();
    //        }else if(res.list.length<=2){
    //            wraper.find('#csadUserMessageContainer_'+userId).find('.analysis_report_list').find('.up_and_down').remove();
    //        }
    //        wraper.find('#csadUserMessageContainer_'+userId).find('.report_list tbody').append(html.join('')+'<tr class="report_page hide"><td colspan="6" style="padding: 0;">下一页</td></tr>');
    //
    //        //body.find('.report_list tr ');
    //        wraper.find('#csadUserMessageContainer_'+userId).find('.report_list tr').eq(0).show();
    //        wraper.find('#csadUserMessageContainer_'+userId).find('.report_list tr').eq(1).show();
    //        showTr ? wraper.find('#csadUserMessageContainer_'+userId).find('.report_list tr').removeClass('hide') : '';
    //        if(res.hasNext==0){
    //            wraper.find('#csadUserMessageContainer_'+userId).find('.report_list .report_page').remove();
    //        }
    //    })
    //}

    //按时间再分
    function TimeList(res){
        var arr=[],
            arr1=[];
        var isTrue = true;
        for(var i=0;i<=res.list.length;i++){
            if(isTrue){
                arr1.push(res.list[i]);
            }else{
                arr.push(arr1);
                arr1 = [];
                arr1.push(res.list[i]);
            }
            if(i+1<res.list.length){
                if(bainx.formatDate('Y-m-d', new Date(res.list[i].lastUpdated))==bainx.formatDate('Y-m-d', new Date(res.list[i+1].lastUpdated))){
                    isTrue = true;
                }else{
                    isTrue = false;
                }
            }else{
                isTrue = false;
            }
        }
        return arr;
    }


    ////获取用户使用记录列表
    //function getUseRecordList(userid,pg,sz,showTr){
    //    var data={
    //        userId:userid,
    //        pg:pg,
    //        sz:sz
    //    };
    //    Data.selectUserDoRecordPageIndex(data).done(function(res) {
    //        var tmp='<tr class="hide"><td width="5%" style="border-top: 1px solid #E7E7E7 !important;"><i>{{num}}</i></td><td width="31%" style="text-align: left; border-top: 1px solid #E7E7E7 !important;"><p style="padding: 0;background-color: white;border-radius: 0;">{{data}}</p><p style="display:block;padding: 0;background-color: white;border-radius: 0;color: #B4B4B4;">{{boxName}}&nbsp;&nbsp;&nbsp;&nbsp;{{useTime}}开始使用</p></td><td width="37%"><p>{{record}}</p></td><td width="10%">{{urls}}</td><td width="25%"><a  class="editUserRecord" data-id="{{id}}">编辑记录>></a></td></tr>';
    //        var html=[],
    //            reslen=res.list.length,
    //            reslist=res.list;
    //        console.log(reslen)
    //        $.each(res.list,function(index,item){
    //            var n=parseInt($('body').attr('record_index_'+userid));
    //            body.attr('record_index_'+userid,n+1);
    //            item.data=formatDate(new Date(item.lastUpdated));
    //            //item.boxName=item.boxName;
    //            item.num=n;
    //            item.useTime=item.useTime.replace(/\-/g,'');
    //            var imageUrls=item.imageUrls.split(';');
    //            //imgobj=[];
    //            //$.each(imageUrls,function(index,item){
    //            //    imgobj.push('<img src="'+item+'"/>')
    //            //})
    //            //item.urls = imgobj.join('');
    //            item.urls = '<img src="'+imageUrls[0]+'"/>'
    //            //item.style = item.imageUrls ? '' : 'style="display:none"';
    //            //item.record=item.record;
    //            html.push(bainx.tpl(tmp, item));
    //        })
    //        if(reslen==0 && pg==0){
    //            html=['<tr class="tc hide"><td colspan="6">暂无数据哦！</td></tr>'];
    //            wraper.find('.csadUserMessageContainer_'+userid).find('.product_usage_record').find('.up_and_down').remove();
    //        }else if(reslen<=2){
    //            wraper.find('#csadUserMessageContainer_'+userid).find('.product_usage_record').find('.up_and_down').remove();
    //        }
    //
    //        function formatDate(now){
    //            var   year=now.getYear();
    //            var   month=now.getMonth()+1;
    //            var   date=now.getDate();
    //            var   hour=now.getHours();
    //            var   minute=now.getMinutes();
    //            var   second=now.getSeconds();
    //            return month+'月'+date+'日'+' '+hour+':'+minute;
    //        }
    //        wraper.find('#csadUserMessageContainer_'+userid).find('.use_record_list tbody').append(html.join('')+'<tr class="record_page hide"><td colspan="6" style="padding: 0;">下一页</td></tr>');
    //        if(reslist==''){
    //            wraper.find('#csadUserMessageContainer_'+userid).find('.product_usage_record').find('.up_and_down').remove();
    //        }
    //        wraper.find('#csadUserMessageContainer_'+userid).find('.use_record_list tr').eq(0).show();
    //        wraper.find('#csadUserMessageContainer_'+userid).find('.use_record_list tr').eq(1).show();
    //        showTr ? wraper.find('.use_record_list tr').removeClass('hide') : '';
    //        if(!(statusP == 1 && (sourceP == 1 || sourceP == 3))){
    //            wraper.find('#csadUserMessageContainer_'+userid).find('.addrecord,.editUserRecord').hide();
    //        }
    //        if(res.hasNext==0){
    //            wraper.find('#csadUserMessageContainer_'+userid).find('.use_record_list .record_page').remove();
    //        }
    //
    //        wraper.find('.use_record_list img').each(function(){
    //            if(!$(this).attr('src')){
    //                $(this).remove();
    //            }
    //        })
    //
    //    })
    //}

    function isContains(str, substr) {
        return new RegExp(substr).test(str);
    }

    function Events(userId){
        wraper.find('#csadUserMessageContainer_'+userId)
            .off('click', '.up_and_down').on('click','.up_and_down',function(e){
                e.stopPropagation();
                var _thisP=$(this).prev(),
                    _thisC=$(this).children();
                if(_thisP.find('tr').eq(2).hasClass('hide')){
                    _thisP.find('tr').removeClass('hide');
                }else{
                    _thisP.find('tr').addClass('hide');
                }
                //$(this).prev().find('tr').last().removeClass('hide')
                // $(this).prev().find('tr').slideToggle("slow");
                _thisC.toggleClass('active');
                if(_thisC.hasClass('active')){
                    _thisC.text('收起');
                }else{
                    _thisC.text('展开');
                }
            })
            .off('click', '.buy_boxs_page').on('click','.buy_boxs_page',function(){
                var num=parseInt($('body').attr('buy_boxs_num_'+userId))+1;
                //getBoxList(num,10,userId,true);

                getBoxList(num,10,userId,true);//购买盒子记录

                wraper.find('.buy_boxs_page').eq(0).remove();
                $('body').attr('buy_boxs_num_'+userId,num);
            })

            .off('click', '.viewDetail').on('click','.viewDetail',function(){



                //$('.IframeBox').remove();
                var containerIframe;
                if(statusP == 0){
                    containerIframe = wraper.find('.csadCallInRightContent iframe');
                    if(wraper.find('#csadUserMessageContainer_'+userId).find('.csadCallInRightContent').parent().is(':hidden')){
                        wraper.find('#csadUserMessageContainer_'+userId).find('.csadCallInRightContent').parent().show();
                    }

                }else{
                    var template = '<section class="telDialog wl-trans-dialog translate-viewport IframeBox" data-widget-cid="widget-0" style="display: block;"><div class="IframeBoxContent"><iframe></iframe><i class="closeBtn closeIframe"></i><span id="iframeSendBox"></span></div></section>';
                    $('body').append(template);
                    containerIframe = $('.IframeBox iframe');
                }
                var boxId,reportId,userName;
                if($(this).hasClass('viewBox')){//查看盒子
                     boxId = $(this).data('id');
                        reportId = $(this).data('reportid');
                        userName = statusP == 0 ? wraper.find('#csadUserMessageContainer_'+userId).find('#userNameNote').text() :$('#userNameNote').text();
                       var canedit = statusP == 1 &&  !$(this).parent().parent().find('.payStatus').data('tradestatus') ? '&canEdit=true' : '',
                        csadName = $('#login_user p').eq(0).text(),csadTel = $('#login_user p').eq(0).data('mobile');
                    containerIframe.attr('src',URL.createMineBoxPage+'?userId='+userId+'&boxId='+boxId+'&rid='+reportId+canedit+'&csadName='+csadName+'&csadTel='+csadTel+'&isIframe=1&userName='+userName);
                }
                if($(this).hasClass('viewReportU')){//查看报告
                     reportId = $(this).data('id');
                        userName = wraper.find('#csadUserMessageContainer_'+userId).find('#userNameNote').text();
                    containerIframe.attr('src',URL.questionnaireSurveyPage+'?detectId='+reportId+'&userName='+userName);
                }


            })


            //打印报告
            .off('click', '.printReportBtn').on('click','.printReportBtn',function(){
                var src = URL.skinCheckReportPage+'?boxId='+$(this).data('id');

                window.open(src,'打印报告');

            })
        //生成订单
            .off('click', '.placeOrderBtn').on('click', '.placeOrderBtn', function (event) {

            //获取收货地址
            var target = $(this),_boxId = target.attr('data-id');
            $('.containerUserTrajectory').addClass('hide');
            $('.userTrajectoryTab').removeClass('activeTab').siblings().addClass('activeTab');
            csadCreateOrder.prototype.init(userId,_boxId);

            })
            //编辑盒子
            .off('click', '.editBoxIt').on('click', '.editBoxIt', function (event) {

                var boxId = $(this).data('id'),
                    _rid = $(this).data('reportid');


            var W = $('.csadUserMessageContainer');
            W.find('.csadUserMsgTitle ul .questionTab').text('生成订单').addClass('activeTab').siblings().removeClass('activeTab');
            W.find('.createBoxTab,.CreateBoxContainer').remove();
            W.find('.csadUserMsgContent').append('<div class="presentList CreateBoxContainer "></div>');
            $('.CreateBoxContainer').siblings().addClass('hide');

            csadCreateMineBoxPage(userId, _rid, boxId, '', '', true, '', '', true);
            $('.questionTab').text('产品定制');
            $('.createBoxBtnG ').addClass('show');

            })
           $('body').off('click', '.closeprintReport').on('click','.closeprintReport',function(){
                $(this).parent().parent().remove();
            })

    }


    return{
        csadUserTrajectoryHtml:csadUserTrajectoryHtml,
        initUserTrajectory:initUserTrajectory
    }

})