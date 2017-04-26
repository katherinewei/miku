/**
 * 蜜月回访
 * Created by xiuxiu on 2016/7/18.
 */
define('h5/js/page/csadHoneymoonReturnPage',[
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/page/csadCommon',
    'h5/css/page/csadCssZy.css'
], function($,URL, Data,CommonCsad) {
    var wrapGroup,uid;
    function init(dayOrder,boxId,$uid) {
        wrapGroup = $('#payVisit_Wrap');

        if(wrapGroup.children().length == 0){
            var html=initHomemoonReturn();
            wrapGroup.append(html);
        }
        uid = $uid;
        visitStatistics(dayOrder);//待回访统计
        if(dayOrder){
            if(dayOrder<7){
                returninglist(1,parseInt(dayOrder),0,boxId,parseInt(dayOrder));//待回访列表
            }else{
                returninglist(2,'',0,boxId,parseInt(dayOrder));//待回访列表
            }

        }else{
            returninglist(1,1,0,boxId,1);//待回访列表

        }

        Events();
    }
    function inittoolHtml(){
        var html = [],
            data = [
                {
                    name:'表情',
                    className:'showEmotionDia',
                    type:'',
                    id:''

                },{
                    name:'图片',
                    className:'sendIt sendPic',
                    type:'img',
                    id:'sendPicInput'

                },{
                    name:'快速回复',
                    className:'quickReplyBtn',
                    type:'',
                    id:''

                },{
                    name:'添加快速回复',
                    className:'addQuickReplyBtn',
                    type:'',
                    id:''

                }
                //,{
                //    name:'语音',
                //    className:'sendIt sendAudio',
                //    type:'audio',
                //    id:'sendAudioInput'
                //
                //},{
                //    name:'录音',
                //    className:'recordBtn startRecord',
                //    type:'',
                //    id:''
                //
                //}
            ],
            tpl ='<input id="{{id}}" class="hide"/><a class="chat02_title_btn ctb01 {{className}}"  title="{{name}}" type="{{type}}"></a>';
        $.each(data,function(index,item){

            html.push(bainx.tpl(tpl,item));
        })

        return html.join('')

    }

    function findBoxAddActive(boxId){
        wrapGroup.find('#homemoonretrn .payment_people').find('li').each(function(){
            console.log($(this).data('boxid'))
            if($(this).data('boxid')==boxId){
                $(this).children('.people_box').addClass('active');
            }
        })
    }

    function addActive(dayOrder){
        var day=wrapGroup.find('.day'+dayOrder+'_return');
        day.addClass('active').siblings().removeClass('active');
        wrapGroup.find('.returning_people'+dayOrder).show().siblings('.returning_people').hide();
    }
    //
    function initHomemoonReturn(){

        var tplArrList = [],tplArrRight = [];
        for(var i =1;i < 9; i++){
            var tplList= '<div class="payment_people returning_people returning_people'+i+'"><ul class="chat03_content_ul"></ul></div>';
            tplArrList.push(tplList);
        }
        var template='<section id="homemoonretrn" class="row"><div class="box_left col col-15" ><div class="top_bannner"><ul class="clearfix"></ul></div><div class="con_box clearfix row"><div class="visit_box fl">'+tplArrList.join('')+'</div><div class="chat_box fl col col-15"><div id="nullchater">暂时没有会话消息哦~</div><div class="mainContainer  hide"><div class="chatRight"><div id="chat01"><div class="chat01_title grid"><div class="addNotes"></div> </div><div id="null-nouser" class="chat01_content"></div></div><div class="chat02"><div class="chat02_title">'+inittoolHtml()+'<div id="wl_faces_box" class="wl_faces_box"><div class="wl_faces_content"><div class="title"><ul><li class="title_name">常用表情</li><!--<li class="title_name" style="left:105px;" id="tusijiBtn">兔斯基</li>--><li class="wl_faces_close"><span class="turnoffFaces_box"></span></li></ul></div><div id="wl_faces_main" class="wl_faces_main"><ul id="emotionUL" class="emtionList"></ul><!--<ul id="tusijiUL" class="emtionList" style="display:none"></ul>--></div></div><div class="wlf_icon"></div></div></div><div id="input_content" class="chat02_content"><textarea id="talkInputId" style="resize: none;"></textarea></div><div class="chat02_bar"><span class="sendText">发送</span></div></div></div><input type="file" id="fileInput" style="display:none;"/></div></div></div></div><div class="box_right rightNa col col-10"></div></section>';
        return template;
    }

    //待回访统计
    function visitStatistics(dayOrder){
        //addActive(dayOrder);//active
        if(wrapGroup.find('.top_bannner li').length == 0){
            Data.getBoxChatUserCount().done(function(res) {
                var day = [res.day1Count,res.day2Count,res.day3Count,res.day4Count,res.day5Count,res.day6Count,res.day7Count],
                    dayWord = ['一','二','三','四','五','六','七'],
                    html=[];
                $.each(day,function(index,item){
                    var i = index + 1;
                    html.push('<li class="day'+i+'_return fl day_return" data-day="'+i+'">第'+dayWord[index]+'天('+item+')</li>');
                })
                wrapGroup.find('.top_bannner ul').append(html.join(''));

                addActive(dayOrder);//active
            })
        }
        else{
            addActive(dayOrder);
        }


    }

    //待回访列表
    function returninglist(daytype,dayorder,pg,boxId,i){
        var data={
                dayType:daytype,
                dayOrder:dayorder,
                //pg:pg,
                //sz:10
            },
            html=[];
        Data.getBoxChatUserVOList(data).done(function(res) {
            var template='<li class="returnVisit{{boxId}}" data-boxId="{{boxId}}" data-detectReportId="{{detectReportId}}" id="{{em_user_name}}" displayName="{{em_user_name}}"><div class="row"><img src="{{profile_pic}}" class="img-circle-50"><div class="col message_main_item col-10" name="col"><span data-mobile="15549463718">{{memoName}}</span></div><div class="col message_main_time col-5"><span class="message_main_time_span">{{returnVisitTime}}</span></div></div></li>';
            if ($.isArray(res.list) && res.list.length) {
                handle2();
                wrapGroup.find('.box_right').show();
                wrapGroup.find('.mainContainer').attr('id','')
                wrapGroup.find('#nullchater').hide();
                $.each(res.list,function(index,item){
                    item.profile_pic = item.profile_pic  ? item.profile_pic :  imgPath+'common/images/avatar-small.png';
                    item.memoName = item.memoName ? item.memoName : item.nickname;
                    item.returnVisitTime=bainx.formatDate('Y-m-d h:i', new Date(item.userStime));
                    html.push(bainx.tpl(template,item));
                })
                handlebox(i);
            }else{
                handle1();
                html=['<li class="tc"><div class="people_box row fvc fac">没有数据哦！</div></li>'];
                wrapGroup.find('.returning_people'+i+' ul').append(html.join(''));
            }

            //var firstload=$('body').attr('firstload');
            if(dayorder){
                i=parseInt(dayorder);
            }
            //if(URL.param.dayOrder && firstload=='1'){
            //    i=parseInt(URL.param.dayOrder);
            //}


            function handlebox(i){
                var returnI = '.returning_people'+i;

                wrapGroup.find(returnI+' ul').append(html.join(''));
                //if(!res.hasNext){
                //    $(returnI+' .returning_next_page').remove();
                //}
                if(res.list){
                    var db = CommonCsad.getCurrentDb();//初始化
                    db.transaction(function (trans) {
                        CommonCsad.getItemUnreadNum(trans);
                    })
                    var $this;
                    if(uid){
                        $this = wrapGroup.find(returnI).find('#'+uid);
                    }else{
                        $this = wrapGroup.find(returnI).find('li').eq(0);
                    }
                    $this.addClass('currentWin');
                    CommonCsad.chooseContactDivClick($this[0],true,$this.attr('displayname'));
                }
            }

            var curBoxId = boxId ? boxId : res.list[0] ? res.list[0].boxId : '';
            if(curBoxId){
                findBoxAddActive(boxId);
            }

            //$('body').attr('firstload','0');
        });

    }

    function showHide(day){
        var selector=wrapGroup.find('.returning_people'+day).find('li').eq(0),
            len=selector.find('.people_box').children('.people_msg').length,
            id;
        if(len==0){
            handle1();
        }else{
            handle2();
            if(selector.find('.active').length>=1){
                id=manageId(selector.find('.active').parent().attr('id'));
            }else{
                id=manageId(selector.attr('id'));
            }
            wrapGroup.find('#csadUserMessageContainer_'+id).show().siblings().hide();
        }


        function manageId(id){
            if(id.indexOf('_') > 0) {
                var arrId = id.split("_");
                if (arrId.length > 1) {
                    id = parseInt(arrId[1]);
                }
            }

            return id;
        }
    }

    function handle1(){
        wrapGroup.find('.box_right').hide();
        wrapGroup.find('.mainContainer').attr('id','hide');
        wrapGroup.find('#nullchater').show();
    }
    function handle2(){
        wrapGroup.find('.box_right').show();
        wrapGroup.find('.mainContainer').attr('id','')
        wrapGroup.find('#nullchater').hide();
    }

    //加载数据
    function dayReturnData(target,boxId){
        var day=target.data('day');
        showHide(day);
        target.addClass('active').siblings().removeClass('active');
       // $('body').attr('data-returningflag',day);
        if(wrapGroup.find('.returning_people'+day+' ul li').length>=1){
            var $target = boxId ? wrapGroup.find('.returning_people'+day+' ul li').eq(0) : wrapGroup.find('.returning_people'+day+' ul li').eq(0);
            if(!$target.hasClass('tc')){
                handle2();
                CommonCsad.chooseContactDivClick($target[0],true,$target.attr('displayname'));

            }
            wrapGroup.find('.returning_people'+day).show().siblings('.returning_people').hide();
        }else{
            returninglist(1,day,0,'',day);
            wrapGroup.find('.returning_people'+day).show().siblings('.returning_people').hide();
        }
    }

    //下一页
    //function dayReturnNext(target){
    //    var day=target.data('day');
    //    var page=parseInt($('body').attr('data-rpage'+day))+1;
    //    $('body').attr('data-rpage'+day,page);
    //    returninglist(1,day,page,'',day);
    //    $('.day'+day+'_return .returning_next_page').eq(0).remove();
    //}

    function Events(){
        wrapGroup.find('#homemoonretrn')
            .on('click','.day_return',function(){//待回访
                dayReturnData($(this))
            })
            //.on('click','.day_return .returning_next_page',function(){
            //    //var target = $('li');//需要修改，为this的父级li;
            //    //dayReturnNext(target)  ;
            //})

            .on('click','#closeChatWindow',function(){
                wrapGroup.find('.mainContainer').hide();
            })
            .on('click','.chat03_content_ul li',function(){
                $(this).addClass('active').parent().siblings().children().removeClass('active');
                var dayorder = $(this).parent().data('day');
                CommonCsad.chooseContactDivClick($(this)[0],true,$(this).attr('displayname'));
                wrapGroup.find('.mainContainer').css({'display':'flex'});
            })
            .on('click','.sendBox,#iframeSendBox',function(){
                var target = $(this);
                sendPrivateBox(target);
                if(target.attr('id') == 'iframeSendBox' && !target.hasClass('disabled')){
                    wrapGroup.find('.IframeBox').remove();
                }

            })

        //.on('click','#homemoonretrn li',function(){
        //    CommonCsad.chooseContactDivClick();
        //})

    }

    //发送盒子
    function sendPrivateBox(target){
        if(target.hasClass('disabled')){
            bainx.broadcast('您尚未保存盒子，请先保存再发送！');
        }else{
            var boxName = target.attr('data-boxname'),boxImg=target.attr('data-boximg'),boxId=target.attr('data-boxid').toString();
            CommonCsad.sendBox(boxName,boxId,boxImg);
        }
    }


    return {
        init:init,
        dayReturnData:dayReturnData
    }
})