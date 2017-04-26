/**
 * 聊天消息
 * Created by xiuxiu on 2016/7/18.
 */
define('h5/js/page/appCsadChatMessagePage',[
    'jquery',
    'h5/js/common/url',
   // 'h5/js/common/data',
    'h5/js/page/appCsadCommon'
], function($,URL,CommonCsad)
{
    var membersList;
    //  var _setTime = setInterval(function ()
    //  {
    // if(sessionStorage.getItem('membersListIM')){
    membersList = sessionStorage.getItem('membersListIM');
    membersList = JSON.parse(membersList);
    //  console.log(membersList)
    // clearInterval(_setTime);
    //init();
    //  }
    //   },1000);

    function init(){
        //$('.waitting').hide();
        //CommonCsad.layout();
        var template = '<section class="row"><div class="accordion-inner" id="momogrouplist"><div class="search-wrap"><div class="row search-box"><div class="icon-search search-submit"></div><div class="input-wrap"><input type="text" class="search-input" id="kw" placeholder="搜索"></div><div class="icon-wrap" style="display: none;"><i class="icon-close"></i></div></div></div><div id="append" class="grid hide"></div><ul id="momogrouplistUL" class="chat03_content_ul groupMember"></ul><!--<div class="groupsContent"><div class="singleChat"><div class="title">单聊</div><ul id="momogrouplistUL" class="chat03_content_ul groupMember"></ul></div><div class="groupChat"><div class="title">群聊</div><ul id="momogrouplistULGroup" class="chat03_content_ul groupMember"></ul></div> </div>--> </div><div id="nullchater">暂时没有会话消息哦~</div><div class="mainContainer col col-10 hide"><div class="chatRight"><div id="chat01"><div class="chat01_title grid"><div class="addNotes"></div> </div><div id="null-nouser" class="chat01_content"></div></div><div class="chat02"><div class="chat02_title">'+inittoolHtml()+'<div id="wl_faces_box" class="wl_faces_box"><div class="wl_faces_content"><div class="title"><ul><li class="title_name">常用表情</li><!--<li class="title_name" style="left:105px;" id="tusijiBtn">兔斯基</li>--><li class="wl_faces_close"><span class="turnoffFaces_box"></span></li></ul></div><div id="wl_faces_main" class="wl_faces_main"><ul id="emotionUL" class="emtionList"></ul><!--<ul id="tusijiUL" class="emtionList" style="display:none"></ul>--></div></div><div class="wlf_icon"></div></div></div><div id="input_content" class="chat02_content"><textarea id="talkInputId" style="resize: none;"></textarea></div><div class="chat02_bar"><span class="sendText">发送</span></div></div></div></div>  <input type="file" id="fileInput" style="display:none;"/><div class="rightNa col col-10"></div> </section><span class="sendBtnActuely" style="display: none">发送</span><span class="sendBox" style="display: none">发送</span>'

        $('#chatMessage_Wrap').append(template);
        $('.chatRight').height($('.wrapper').height())

        bindEvent();

    }

    function bindEvent(){
        $('body').on('keyup','#kw',function(){
                getContent('#kw');
            })
            .on('click','.icon-search',function(){
                getContent('#kw');
            })
            .on('click','#closeChatWindow',function(){
                $('.mainContainer').hide();
            })
            .on('click','.chat03_content_ul li',function(){
                $('.mainContainer').css({'display':'flex'});
            })
            .on('click','.resultItem',function(){
                CommonCsad.chooseContactDivClick(this,false);
                var csadId = $(this).attr('data-id'),
                    csadImg = $(this).find('img').attr('src'),
                    csadName = $(this).find('em').text();
                //$('#momogrouplistUL li').each(function(){
                //    if($(this).attr('id') == csadId){
                //
                //    }
                //})
                if($('#momogrouplistUL #'+csadId).length == 0){
                    $('#momogrouplistUL').append('<li id="'+csadId+'"  classname="offline" type="chat" displayname="'+csadId+'"><div class="row" ><img src="'+csadImg+'" class="img-circle-50"><div class="col message_main_item col-10" name="col"><span>'+csadName+'</span></div><div class="col message_main_time col-5"><span class="message_main_time_span"></span></div></div></li>');
                }
                $('#momogrouplistUL #'+csadId).addClass('currentWin').siblings().removeClass('currentWin');
                $('#append').hide().html('');
            })
            .on('click','.sendBox,#iframeSendBox',function(){
                var target = $(this);
                sendPrivateBox(target);
                if(target.attr('id') == 'iframeSendBox' && !target.hasClass('disabled')){
                    $('.IframeBox').remove();
                }
            })
            .on('click','.sendBtnActuely',function(){
                var userName = $(this).data('name'),
                    _rid = $(this).data('rid'),
                    rImg = $(this).data('rimg'),
                    csadName = $('#login_user p').eq(0).text(),
                    _dateCreated = bainx.formatDate('Y-m-d H:i', new Date($(this).data('datecreated')));
                CommonCsad.sendReport(userName,_rid,csadName,_dateCreated);
                $('.reportPreview').remove();
            })
            //聊天窗口查看盒子
            .on('click','.viewBoxInChat',function(){
                var template = '<section class="telDialog wl-trans-dialog translate-viewport IframeBox" data-widget-cid="widget-0" style="display: block;"><div class="IframeBoxContent"><iframe></iframe><i class="closeBtn closeIframe"></i><span id="iframeSendBox"></span></div></section>';
                $('body').append(template);
                var containerIframe = $('.IframeBox iframe'),
                    uid = $('.currentWin').attr('id'),
                    _boxidChat = $(this).data('id'),
                    userName = $('#userNameNote').text(),
                    csadName = $('#login_user p').eq(0).text(),csadTel = $('#login_user p').eq(0).data('mobile');
                uid = uid.split("_");
                uid = parseInt(uid[1]);
                containerIframe.attr('src',URL.createMineBoxPage+'?userId='+ uid+'&boxId='+_boxidChat+'&csadName='+csadName+'&csadTel='+csadTel+'&isIframe=1&userName='+userName)
            })
            .on('click','.closeIframe',function(){
                $('.IframeBox').remove();
            })
    }
    // $('body').append('<script>function sendBoxIframe(target){sendPrivateBox(target)}</script>')
    //发送盒子
    function sendPrivateBox(target){
        //if(target.hasClass('disabled')){
        //    bainx.broadcast('您尚未保存盒子，请先保存再发送！');
        //}else{
            var boxName = target.attr('data-boxname'),boxImg=target.attr('data-boximg'),boxId=target.attr('data-boxid').toString();
            CommonCsad.sendBox(boxName,boxId,boxImg);
      //  }
    }

    //搜索
    function getContent(obj){
        var kw = $.trim($(obj).val());
        if(kw == ""){
            $("#append").hide().html("");
            return false;
        }
        var html = "";

        $.each(membersList,function(i,item){
            $.each(item.friendsGroupMapList,function(j,memberItem){
                if (memberItem.profileName && memberItem.profileName.indexOf(kw) >= 0 || memberItem.userName && memberItem.userName.indexOf(kw) >= 0) {
                    var headPic = memberItem.profilePic ? memberItem.profilePic : 'http://mikumine.b0.upaiyun.com/common/images/avatar-small.png',
                        _userName = memberItem.userName ? '<em>'+memberItem.userName + '</em>(<i>'+memberItem.profileName+'</i>)' : '<em>'+memberItem.profileName + '</em>';
                    html = html +  '<div class="resultItem row" data-groupid="'+item.id+'" data-id="'+memberItem.emUserName+'" id="'+memberItem.emUserName+'" type="chat" displayname="'+memberItem.emUserName+'" data-fuserid="'+memberItem.userId+'"><div class="headPic '+memberItem.emUserName+'_imgUrl"><img src="'+headPic+'"/></div><div class="col col-15"><p>'+_userName+'</p><p>来自分组：'+item.name+'</p></div> </div>'
                }
            })
        })
        if(html != ""){
            $("#append").show().html('<p class="search_result_tit">搜索结果</p>'+html);
        }else{
            $("#append").hide().html("");
        }
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

                },
                //{
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
                //},
                {
                    name:'快速回复',
                    className:'quickReplyBtn',
                    type:'',
                    id:''

                },{
                    name:'添加快速回复',
                    className:'addQuickReplyBtn',
                    type:'',
                    id:''

                }],
            tpl ='<input id="{{id}}" class="hide"/><a class="chat02_title_btn ctb01 {{className}}"  title="{{name}}" type="{{type}}"></a>';
        $.each(data,function(index,item){

            html.push(bainx.tpl(tpl,item));
        })

        return html.join('')

    }

    //  init();
    return init
})