/**
 * 专家端页面
 * Created by xiuxiu on 2016/7/5.
 */
require([
    'gallery/jquery/2.1.1/jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'plugin/webIm/HZRecorder',
    'plugin/webIm/strophe',
    'plugin/webIm/easemob.im-1.1.shim',
    'plugin/webIm/easemob.im.config',
    'plugin/webIm/swfupload/swfupload',
    'plugin/webIm/jplayer/jquery.jplayer.min'
], function($,URL, Data,HZRecorder,Strophe,EasemobShim,EasemobConfig,SWFUpload) {

    var membersList = [],   //分组成员信息
        Page;

    function init(){
        var partOneHeaderHtm = '<div class="row"><div class="col grid col-10 headPicCol"><div id="headerimg" class="titleHeader row "><div class="img-circle-50"><img id="myPic"></div><div id="login_user" class="login_user_title col"><p> 您好，<a class="curName"></a></p><p class="cur-online">Online</p></div></div></div><div class="col grid col-15 search-wrap"><div class=" titleHeader"><div class="row search-box"><div class="icon-search search-submit"></div><div class="input-wrap"><input type="text" class="search-input" id="kw" placeholder="搜索"></div><div class="icon-wrap" style="display: none;"><i class="icon-close"></i></div></div><div id="append" class="grid"><ul></ul></div></div></div></div> ';

        Page = $('<header id="header">MIKU MINE<span id="logout">退出</span> </header><div class="chatContainer grid"><div class="row"></div> </div>').appendTo('body');

        var partOneTpl = partOneHeaderHtm + '<div class="chatListContainer"></div>',

            partTwoTpl = '<div id="nullchater">暂时没有会话消息哦~</div><div class="mainContainer row"><div class="chatRight col-12 col  "><div id="chat01"><div class="chat01_title grid"><ul class="talkTo row"><li id="talkTo" class="col col-20"><a></a></li><li class="col col-5"><span id="ext" >关闭会话</span></li></ul></div><div id="null-nouser" class="chat01_content"></div></div><div class="chat02"><div class="chat02_title">'+inittoolHtml()+'<div id="wl_faces_box" class="wl_faces_box"><div class="wl_faces_content"><div class="title"><ul><li class="title_name">常用表情</li><li class="title_name" style="left:105px;" id="tusijiBtn">兔斯基</li><li class="wl_faces_close"><span class="turnoffFaces_box"></span></li></ul></div><div id="wl_faces_main" class="wl_faces_main"><ul id="emotionUL" class="emtionList"></ul><ul id="tusijiUL" class="emtionList" style="display:none"></ul></div></div><div class="wlf_icon"></div></div></div><div id="input_content" class="chat02_content"><textarea id="talkInputId" style="resize: none;"></textarea></div><div class="chat02_bar"><span class="sendText">发送</span></div></div></div><div id="userSingleMessage" class="col col-6"><div class="titleHeader tit" >用户信息</div><div class="iframeDiv"><iframe ></iframe></div></div><div id="diagnosedReport" class="col col-7"><div class="titleHeader tit" >诊断分析报告</div><div class="iframeDiv"><iframe ></iframe></div> </div>  <input type="file" id="fileInput" style="display:none;"/>';
        //    partFourTpl =  '<iframe src="'+URL.questionnaireSurveyPage+'?uid=5"></iframe>',
        //partThreeTpl = '';
        layout(partOneTpl,partTwoTpl);
        //window.parent.document.getElementById('oneiframe').src = '3.html'
        //添加大表情
        var bigEmtionList = ['002','007','010','012','013','018','019','020','021','022','024','027','029','030','035','040'],
            bigEmtionHtml = [];
        $.each(bigEmtionList,function(index,item){
            bigEmtionHtml.push('<li><img data-name="[示例'+(index+1)+']" src="'+imgPath+'common/images/personalTailor/csad/faces/icon_'+item+'.gif"/></li>');
        })
        $('#tusijiUL').append(bigEmtionHtml.join(''));

        login();
        bindEvents();

        groups();

    }

    //子页面调用父方法、、
$('body').append("<script>function a(){$('body').append('<section class=\"telDialog wl-trans-dialog translate-viewport\" style=\"display: block\"><div class=\"cont bounceIn\"><p class=\"tips\"></p><div class=\"btngroup\"><span class=\"btn reset\">取消</span> <span class=\"btn share\">分享好友</span></div></div></section>');}</script>")




    //布***局***开始
    function layout(partOneTpl,partTwoTpl){
        var html = [],
            data = [
                {
                    content:partOneTpl,
                    className:'partOne',
                    id:'chatList',
                    col:''
                },{
                    content:partTwoTpl,
                    className:'partTwo',
                    id:'chatContent',
                    col:'col'
                }/*,{
                    content:partThreeTpl,
                    className:'partThree',
                    id:'userSingleMessage'
                },{
                    content:partFourTpl,
                    className:'partFour',
                    id:'diagnosedReport'
                }*/],
            tpl ='<div class="{{col}}"><div id="{{id}}" class=" grid partItem {{className}}">{{content}}</div></div> ';
        $.each(data,function(index,item){
            html.push(bainx.tpl(tpl,item));
        })

        $('.chatContainer .row').append(html.join(''));

        //录音的媒介
        //var audioRecord = document.createElement("audio");
        //$(audioRecord).attr({
        //    "id" : 'recordObj',
        //    "style" : "display:none"
        //});
        //$('.chat02_title')[0].appendChild(audioRecord);

        $('<audio>').attr({"id" : 'recordObj', "style" : "display:none"}).appendTo($('.chat02_title'));

        initPartOneHtml();

    }

    function initPartOneHtml(){
        var html = [],
            data = [
                {
                    name:'呼叫中心',
                    headerId:'accordion1',
                    bodyId:'callCenterlist',
                    bodyUl:'callCenterUL'
                },{
                    name:'聊天列表',
                    headerId:'accordion2',
                    bodyId:'momogrouplist',
                    bodyUl:'momogrouplistUL'
                },{
                    name:'管理列表',
                    headerId:'accordion3',
                    bodyId:'groupsContentList',
                    bodyUl:'groupsContentListUL'
                },{
                    name:'定制盒子',
                    headerId:'accordion4',
                    bodyId:'customBox',
                    bodyUl:'customBoxUL'
                }],
            tpl ='<div class="accordion-group row"><div class="accordion-heading col col-10"><a id="{{headerId}}" class="accordion-toggle" >{{name}}</a></div><div class="accordion-body collapse col col-15"><div class="accordion-inner" id="{{bodyId}}"><ul id="{{bodyUl}}" class="chat03_content_ul"></ul> </div></div></div>';

        $.each(data,function(index,item){

            html.push(bainx.tpl(tpl,item));
        })
        $('.chatListContainer').append(html.join(''));
        $('.accordion-group').eq(0).addClass('in');
        $('.accordion-inner').css('width',$('.search-wrap').width())
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
                    className:'sendIt',
                    type:'img',
                    id:'sendPicInput'

                },{
                    name:'语音',
                    className:'sendIt',
                    type:'audio',
                    id:'sendAudioInput'

                },{
                    name:'录音',
                    className:'recordBtn startRecord',
                    type:'',
                    id:''

                }],
            tpl ='<input id="{{id}}" class="hide"/><a class="chat02_title_btn ctb01 {{className}}"  title="{{name}}" type="{{type}}"></a>';
        $.each(data,function(index,item){

            html.push(bainx.tpl(tpl,item));
        })

        return html.join('')

    }


    //布***局***结束

    //事件
    function bindEvents(){

        //表情
        $('body').on('click','.title_name',function(){
                $('.emtionList').hide();
                $('.emtionList').eq($(this).index()).show();
            })
            //大表情
            .on('click','#tusijiUL li',function(){
                var imgSrc = $(this).find('img').attr('src'),
                    i = $(this).index();
                bigMotion(imgSrc,i);
            })

            //发送消息
            .on('click','.sendText',function(){
                var msg = document.getElementById(talkInputId).value;
                sendText(msg);

            })

            //关闭会话
            .on('click','#ext',function(){
                closeTalking()
            })

            .on('click','.turnoffFaces_box',function(){
                turnoffFaces_box();
            })
            .on('click','.logTimeOut',function(){
                login();
            })

            .on('click','.sendIt',function(){
                send($(this))
            })

            .on('click','.showEmotionDia',function(){
                showEmotionDialog();
            })

            .on('click','#recycle',function(){
                clearCurrentChat()
            })

            .on('click','.accordion-heading',function(){
                $('.accordion-group').removeClass('in');
                $(this).parents('.accordion-group').addClass('in');
            })

            //录音
            .on('click','.recordBtn',function(){
                if($(this).hasClass('startRecord')){
                    $(this).removeClass('startRecord').addClass('stopRecord').attr('title','停止录音');
                    startRecording();
                }else if($(this).hasClass('stopRecord')){
                    $(this).removeClass('stopRecord').addClass('uploadRecord').attr('title','播放录音');
                    stopRecording();
                }
                else if($(this).hasClass('playRecord')){

                    $(this).removeClass('playRecord').addClass('uploadRecord').attr('title', '发送录音');
                    playRecording();
                }else if($(this).hasClass('uploadRecord')){
                    playRecording();
                    sendRecord($('#recordObj').attr('src'));
                    $(this).removeClass('uploadRecord').addClass('startRecord').attr('title','开始录音');

                }
            })

            //分组展开关闭
            .on('click','.groupList .title',function(){
                if(!$(this).find('.groupName').hasClass('disable')){
                    ($(this).parent().hasClass('hideGroupMember')) ? $(this).parent().removeClass('hideGroupMember') : $(this).parent().addClass('hideGroupMember')
                }

            })
            .on('click','.groupItem',function(){
                chooseContactDivClick(this);
            })
            .on('click','.share',function(){
                $('.telDialog').hide();
            })



            //分组的操作
            //添加分组
            .on('click','.addGroupBtn',function(){
                $('.title').removeClass('currentItem');
                $('.groupsContent ul').append('<li class="groupList hideGroupMember"><div class="title currentItem"><span class="groupName"></span><span class="number hide">0</span></div><div class="groupMember"></div> </li>');
                $('.groupList').last().find('.groupName').html('<input value="未命名" name="groupName" />').addClass('disable');
                $('input[name=groupName]').select();
            })

            //编辑分组
            .on('click','.editGroupBtn',function(){
                var target = $('.groupsContent .currentItem'),
                    groupName = target.find('.groupName').text();
                target.find('.number').addClass('hide');

                target.find('.groupName').html('<input value="'+groupName+'" name="groupName" />').addClass('disable');
                $('input[name=groupName]').select();
            })
            .on('blur','input[name=groupName]',function(){
                var target = $('.groupsContent .currentItem').parents('li'),
                    groupName = $(this).val(),
                    groupid = target.data('id') ? target.data('id') : '';
                target.find('.groupName').html(groupName).removeClass('disable');
                target.find('.number').removeClass('hide');
                editOrAddGroup(groupid,target.find('.groupName'),target);
            })
            //删除分组
            .on('click','.deleteGroupBtn',function(){
                var target = $('.groupsContent .currentItem').parents('li');
                deleteGroup(target);
            })

            //将好友放入分组内
            .on('click','.groupItemLi',function(){
                var currentItem = $('.currentItem'),
                    groupId = $(this).data('id'),
                    fUserId = currentItem.data('fuserid'),
                    data = {
                        groupId:groupId,
                        fUserId:fUserId
                    }
                Data.changeFriendsGroupMap(data).done(function(){
                    $('.groupList').each(function(){
                        if($(this).data('id') == groupId){
                            currentItem.attr('data-groupid',groupId);
                            var currentItemHtm = currentItem.clone();
                            var Oldnumber = parseInt(currentItem.parents('.groupList').find('.number').text());
                            currentItem.parents('.groupList').find('.number').text(--Oldnumber);
                            currentItem.remove();
                            // console.log( $(this).find('dl').length,currentItemHtm)
                            $(this).find('dl').length == 0 ? $(this).find('.groupMember').append('<dl></dl>') :  '';
                            $(this).find('dl').append(currentItemHtm);
                            var Newnumber = parseInt($(this).find('.number').text());
                            $(this).find('.number').text(++Newnumber);

                        }
                    })
                    $('.groupItem').contextmenu(function() {
                        var oMenu2 = document.getElementById("rightMenu2");
                        var oMenu = document.getElementById("rightMenu");
                        $('.title').removeClass('currentItem');
                        $('.groupItem').removeClass('currentItem');
                        $(this).addClass('currentItem');
                        contextMenu(oMenu2);
                        oMenu.style.display = "none";
                        return false;
                    })
                })

            })

            //修改好友备注
            .on('click','.editMemberBtn',function(){
                var target = $('.currentItem'),
                    userNote = target.find('em').text(),
                    nickName = target.find('i') ? target.find('i').text() : userNote;
                target.find('img').addClass('hide');


                target.find('span').html('<input value="'+userNote+'" name="memberName" />').addClass('disable').attr('data-nickname',nickName);
                $('input[name=memberName]').select();
            })
            .on('blur','input[name=memberName]',function(){
                var target = $('.currentItem'),
                    memberName = $(this).val(),
                    memberid = target.data('id');
                target.find('span').removeClass('disable');
                target.find('img').removeClass('hide');
                var data = {
                    id:memberid,
                    userName:memberName
                }
                Data.modFriendsName(data).done(function(){
                    var _spanD = target.find('span'),
                        _nickName = _spanD.data('nickname');
                    _spanD.html('<em>'+memberName+'</em>(<i>'+_nickName+'</i>)');

                })
            })

            //发送盒子

            .on('click','.sendBoxBtn',function(){
                sendBox('美白','1','http://wx.qlogo.cn/mmopen/rQRHolqGLymW0zFUNGYAZbVEk8UciccJbThia6atl5fzzkB29QqzZauP9Xjwvic0kBb7ykK2lskPfdu2swhMHRthTHnOib5LN3cZ/0');
            })

            //搜索
            .on('click','.search-submit',function(){
                getContent('#kw');
            })

            //登出
            .on('click','#logout',function(){
                    Data.logOut().done(function(){
                        bainx.broadcast('退出成功！');
                        URL.assign(URL.loginPageCsad);
                    })
            })


        //搜索
        $(document).keydown(function(e){
            e = e || window.event;
            var keycode = e.which ? e.which : e.keyCode;
            if(keycode == 38){
                if(jQuery.trim($("#append").html())==""){
                    return;
                }
                movePrev();
            }else if(keycode == 40){
                if(jQuery.trim($("#append").html())==""){
                    return;
                }
                $("#kw").blur();
                if($(".item").hasClass("addbg")){
                    moveNext();
                }else{
                    $(".item").removeClass('addbg').eq(0).addClass('addbg');
                }

            }else if(keycode == 13){
                dojob();
            }
        });

        var movePrev = function(){
            $("#kw").blur();
            var index = $(".addbg").prevAll().length;
            if(index == 0){
                $(".item").removeClass('addbg').eq($(".item").length-1).addClass('addbg');
            }else{
                $(".item").removeClass('addbg').eq(index-1).addClass('addbg');
            }
        }

        var moveNext = function(){
            var index = $(".addbg").prevAll().length;
            if(index == $(".item").length-1){
                $(".item").removeClass('addbg').eq(0).addClass('addbg');
            }else{
                $(".item").removeClass('addbg').eq(index+1).addClass('addbg');
            }

        }

        var dojob = function(){
            $("#kw").blur();
            var value = $(".addbg").text();
            $("#kw").val(value);
            $("#append").hide().html("");
        }


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
                        nameHtml = memberItem.userName ? memberItem.userName + '(<i>'+memberItem.profileName+'</i>)' : memberItem.profileName;
                    html = html +  '<li class="resultItem row" data-groupid="'+item.id+'" data-id="'+memberItem.emUserName+'" id="'+memberItem.emUserName+'" type="chat" displayname="'+memberItem.emUserName+'" data-fuserid="'+memberItem.userId+'"><div class="headPic '+memberItem.emUserName+'_imgUrl"><img src="'+headPic+'"/></div><div class="col col-15"><span>'+nameHtml+'</span><p>来自分组：'+item.name+'</p></div> </li>'
                }
            })
        })
        if(html != ""){
            html ='<div class="result_title">搜索结果</div>' + html;
            $("#append ul").show().html(html);

            $('#append li').click(function(){
                chooseContactDivClick(this);
                $("#append").hide();
            })

        }else{
            $("#append ul").hide().html("");
        }
    }
    //************结束搜索

    //分组   *****开始
    function groups(){
        $('#groupsContentList').append('<div class="groupsContent" id="container"><ul></ul></div><div id="rightMenu" class="rightMenu"><ul><li class="addGroupBtn">添加分组</li><li class="deleteGroupBtn"> 删除分组</li><li class="editGroupBtn"> 修改分组</li></ul></div><div id="rightMenu2" class="rightMenu"><ul><li class="deleteMemberBtn"> 删除好友</li><li class="editMemberBtn"> 修改好友备注</li><li class="moveMemberBtn"> 将好友移动到<ul class="allGroup"></ul></li></ul></div>');
        var template = '<li class="groupList hideGroupMember" data-id="{{id}} "><div class="title"><span class="groupName">{{name}}</span><span class="number">{{count}}</span></div><div class="groupMember">{{dlHtml}}</div> </li>',
            liHtmls = [];

        Data.getGroupAndFriendsList().done(function(res){
            var list = res.list;

            if(list.length > 0){

                membersList = list;
                $.each(list,function(index,item){
                    var templateContent = '<dd class="groupItem" data-groupid="{{groupId}}" data-id="{{id}}" id="{{emUserName}}" type="chat" displayname="miku_{{fUserId}}" data-fuserid="{{fUserId}}"><img class="{{emUserName}}_imgUrl" src="{{profilePic}}" /><span>{{name}}</span></dd>',
                        dlHtml = [];
                    $.each(item.friendsGroupMapList,function(index,dlitem){
                        dlitem.profilePic = dlitem.profilePic ? dlitem.profilePic : imgPath+'common/images/avatar-small.png';
                        dlitem.name = dlitem.userName ? '<em>'+dlitem.userName + '</em>(<i>'+dlitem.profileName+'</i>)' : '<em>'+dlitem.profileName+ '</em>';
                        dlHtml.push(bainx.tpl(templateContent,dlitem));
                    })
                    item.dlHtml = dlHtml.length > 0 ? '<dl>'+dlHtml.join('')+'</dl>' : '';
                    item.count = item.friendsGroupMapList.length;
                    liHtmls.push(bainx.tpl(template,item));
                })
                $('.groupsContent ul').append(liHtmls.join(''));

            }

            defineContext();
        })
        Data.getMikuFriendsGroupList().done(function(res){
            var allGroupTpl = '<li data-id="{{id}}" class="groupItemLi">{{name}}</li>',
                html = [];
            $.each(res.list,function(index,item){
                html.push(bainx.tpl(allGroupTpl,item));
            })
            $('.allGroup').append(html.join(''));
        })

    }

    var getOffset = {
        top: function (obj) {
            return obj.offsetTop + (obj.offsetParent ? arguments.callee(obj.offsetParent) : 0)
        },
        left: function (obj) {
            return obj.offsetLeft + (obj.offsetParent ? arguments.callee(obj.offsetParent) : 0)
        }
    };
    var aDoc = [document.documentElement.offsetWidth, document.documentElement.offsetHeight];
    //设置右键
    function defineContext()
    {
        var oMenu = document.getElementById("rightMenu");
        var oMenu2 = document.getElementById("rightMenu2");
        var aUl = oMenu.getElementsByTagName("ul");
        var aUl2 = oMenu2.getElementsByTagName("ul");
        var container = document.getElementById("container");

        // console.log(aDoc)
        rightMenu(oMenu);
        rightMenu(oMenu2);
        var cLi = container.getElementsByTagName("li");
        //自定义右键菜单

        //右键
        $('.title').contextmenu(function() {
            $('.title').removeClass('currentItem');
            $('.groupItem').removeClass('currentItem');
            $(this).addClass('currentItem');
            contextMenu(oMenu,aUl);
            oMenu2.style.display = "none";
            return false;
        })
        $('.groupItem').contextmenu(function() {
            $('.title').removeClass('currentItem');
            $('.groupItem').removeClass('currentItem');
            $(this).addClass('currentItem');
            contextMenu(oMenu2);
            var editMemberB = $('.editMemberBtn');
            (!$(this).data('groupid')) ? editMemberB.addClass('hide') : editMemberB.removeClass('hide');
            oMenu.style.display = "none";
            return false;
        })

        //点击隐藏菜单
        document.onclick = function ()
        {
            oMenu.style.display = "none";
            oMenu2.style.display = "none";
        };
    }
    function rightMenu(oMenu){

        var aUl = oMenu.getElementsByTagName("ul");
        var aLi = oMenu.getElementsByTagName("li");
        var showTimer = hideTimer = null;
        var i = 0;
        var maxWidth = maxHeight = 0;


        oMenu.style.display = "none";

        for (i = 0; i < aLi.length; i++)
        {
            //为含有子菜单的li加上箭头
            aLi[i].getElementsByTagName("ul")[0] && (aLi[i].className = "sub");

            //鼠标移入
            aLi[i].onmouseover = function ()
            {
                var oThis = this;
                var oUl = oThis.getElementsByTagName("ul");

                //鼠标移入样式
                oThis.className += " active";

                //显示子菜单
                if (oUl[0])
                {
                    clearTimeout(hideTimer);
                    showTimer = setTimeout(function ()
                    {
                        for (i = 0; i < oThis.parentNode.children.length; i++)
                        {
                            oThis.parentNode.children[i].getElementsByTagName("ul")[0] &&
                            (oThis.parentNode.children[i].getElementsByTagName("ul")[0].style.display = "none");
                        }
                        oUl[0].style.display = "block";
                        oUl[0].style.top = 0;
                        oUl[0].style.left = oThis.offsetWidth + "px";
                        // setWidth(oUl[0]);

                        //最大显示范围
                        maxWidth = aDoc[0] - oUl[0].offsetWidth;
                        maxHeight = aDoc[1] - oUl[0].offsetHeight;

                        //防止溢出
                        maxWidth < getOffset.left(oUl[0]) && (oUl[0].style.left = -oUl[0].clientWidth + "px");
                        maxHeight < getOffset.top(oUl[0]) && (oUl[0].style.top = -oUl[0].clientHeight + oThis.offsetTop + oThis.clientHeight + "px")
                    },300);
                }
            };

            //鼠标移出
            aLi[i].onmouseout = function ()
            {
                var oThis = this;
                var oUl = oThis.getElementsByTagName("ul");
                //鼠标移出样式
                oThis.className = oThis.className.replace(/\s?active/,"");

                clearTimeout(showTimer);
                hideTimer = setTimeout(function ()
                {
                    for (i = 0; i < oThis.parentNode.children.length; i++)
                    {
                        oThis.parentNode.children[i].getElementsByTagName("ul")[0] &&
                        (oThis.parentNode.children[i].getElementsByTagName("ul")[0].style.display = "none");
                    }
                },300);
            };
        }
    }

    function contextMenu(oMenu){
        var event = event || window.event;
        oMenu.style.display = "block";
        oMenu.style.top = (event.clientY-100) + "px";
        oMenu.style.left = (event.clientX-100) + "px";

        console.log(event)

        //setWidth(aUl[0]);

        //最大显示范围
        maxWidth = aDoc[0] - oMenu.offsetWidth;
        maxHeight = aDoc[1] - oMenu.offsetHeight;

        //防止菜单溢出
        oMenu.offsetTop > maxHeight && (oMenu.style.top = maxHeight + "px");
        oMenu.offsetLeft > maxWidth && (oMenu.style.left = maxWidth + "px");
        //return false;
    }

    //编辑分组 && 提交
    function editOrAddGroup(groupid,groupName,target){
        var data = {
            id:groupid,
            name:groupName.text()
        }
        Data.createOrEditMikuFriendsGroup(data).done(function(res){
            // console.log(groupid)
            var vo = res.vo;

            groupName.text(vo.name);
            if(!groupid){            //添加分组
                target.attr('data',vo.id);
                $('.allGroup').append('<li data-id="'+vo.id+'">'+vo.name+'</li>');
            }else{
                $('.allGroup li').each(function(){
                    if($(this).data('id') == vo.id){
                        $(this).text(vo.name);
                    }
                })
            }
        })
    }
    //删除分组
    function deleteGroup(target){
        if(target.find('.groupMember').find('dd').length == 0){
            var groupid = target.data('id'),
                data = {
                    id:groupid
                }
            Data.delMikuFriendsGroup(data).done(function(){
                target.remove();
                bainx.broadcast('删除成功！');
            })
        }else{
            bainx.broadcast('该组内还有成员不能删除哦~');
        }

    }

    //************结束分组

    //****************************录音开始
    var recorder;

    function startRecording() {
        HZRecorder.get(function (rec) {
            recorder = rec;
            recorder.start();
        });
    }

    function stopRecording() {
        recorder.stop();
    }

    function playRecording() {
        var audioRecordId = document.getElementById('recordObj')
        recorder.play(audioRecordId);
    }

    //*****************************结束

    init();


    //******************************聊天功能 开始
    var curUserId = null;
    var curChatUserId = null;
    var conn = null;
    var msgCardDivId = "chat01";
    var talkToDivId = "talkTo";
    var talkInputId = "talkInputId";
    var bothRoster = [];
    var toRoster = [];
    var maxWidth = 200;

    conn = new Easemob.im.Connection({
        multiResources: Easemob.im.config.multiResources,
        https : Easemob.im.config.https,
        url: Easemob.im.config.xmppURL
    });

    //初始化连接
    conn.listen({
        //当连接成功时的回调方法
        onOpened : function() {
            handleOpen(conn);
        },
        //当连接关闭时的回调方法
        onClosed : function() {
            handleClosed();
        },
        //收到文本消息时的回调方法
        onTextMessage : function(message) {
            handleTextMessage(message);

        },
        //收到表情消息时的回调方法
        onEmotionMessage : function(message) {
            handleEmotion(message);
        },
        //收到图片消息时的回调方法
        onPictureMessage : function(message) {
            handlePictureMessage(message);
        },
        //收到音频消息的回调方法
        onAudioMessage : function(message) {
            handleAudioMessage(message);
        },
        //收到位置消息的回调方法
        onLocationMessage : function(message) {
            handleLocationMessage(message);
        },
        //收到文件消息的回调方法
        onFileMessage : function(message) {
            handleFileMessage(message);
        },
        //收到视频消息的回调方法
        onVideoMessage: function(message) {
            handleVideoMessage(message);
        },

        //收到联系人信息的回调方法
        onRoster: function(message) {
            handleRoster(message);
        },

        //异常时的回调方法
        onError: function(message) {
            handleError(message);
        }
    });


    var groupQuering = false;
    var textSending = false;
    var time = 0;
    var flashFilename = '';
    var audioDom = [];
    var picshim;
    var audioshim;
    var fileshim;
    var PAGELIMIT = 8;
    var pageLimitKey = new Date().getTime();
    var currentIMMsg = [];//当前用户的信息
    var currentIMLocal = localStorage.getItem('currentIM');//当前用户的信息保存在localstorage中的
    var user,//环信用户
        pass;//环信密码
    currentIMLocal = JSON.parse(currentIMLocal);
    var strangerIMGroup = [],//陌生人列表
        strangerIMLocal = localStorage.getItem('strangerIM');//陌生人保存在localstorage中的
    strangerIMLocal = JSON.parse(strangerIMLocal);
    var strangerIMCount = strangerIMLocal ? strangerIMLocal.length : 0;//陌生人人数

    var userIMGroup = [],//陌生人列表
        userIMLocal,//陌生人保存在localstorage中的
        userIMLocalCount;//陌生人人数



    var callInStatus = true,
        timePrev;//上一个聊天时间
    var encode = function ( str ) {
        if ( !str || str.length === 0 ) return "";
        var s = '';
        s = str.replace(/&amp;/g, "&");
        s = s.replace(/<(?=[^o][^)])/g, "&lt;");
        s = s.replace(/>/g, "&gt;");
        //s = s.replace(/\'/g, "&#39;");
        s = s.replace(/\"/g, "&quot;");
        s = s.replace(/\n/g, "<br>");
        return s;
    };
    var hasloaded = false;

//处理不支持<audio>标签的浏览器，当前只支持MP3
    var playAudioShim = function ( dom, url, t ) {
        var d = $(dom),
            play = d.next(),
            pause = play.next(),
            u = url;

        if ( !d.jPlayer ) {
            return;
        }

        Easemob.im.Helper.getIEVersion < 9 && audioDom.push(d);
        d.jPlayer({
            ready: function () {
                $(this).jPlayer("setMedia", {
                    mp3: u
                });
            },
            solution: (Easemob.im.Helper.getIEVersion != 9 ? "html, flash" : "flash"),
            swfPath: "sdk/jplayer",
            supplied: "mp3",
            ended: function () {
                pause.hide();
                play.show();
            }
        });
        play.on('click', function () {
            d.jPlayer('play');
            play.hide();
            pause.show();
        });
        pause.on('click', function () {
            d.jPlayer('pause');
            play.show();
            pause.hide();
        });
    };

//处理不支持异步上传的浏览器,使用swfupload作为解决方案
    var uploadType = null;
    var uploadShim = function ( fileInputId, type ) {
        var pageTitle = document.title;
        if ( typeof SWFUpload === 'undefined' ) {
            return;
        }

        return new SWFUpload({
            file_post_name: 'file',
            flash_url: imgPath+'common/images/personalTailor/csad/swfupload.swf"',
            button_placeholder_id: fileInputId,
            button_width: 24,
            button_height: 24,
            button_cursor: SWFUpload.CURSOR.HAND,
            button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
            file_size_limit: 10485760,
            file_upload_limit: 0,
            file_queued_handler: function ( file ) {
                if ( this.getStats().files_queued > 1 ) {
                    this.cancelUpload();
                }

                var checkType = window[type + 'type'];

                if ( !checkType[file.type.slice(1)] ) {
                    conn.onError({
                        type : EASEMOB_IM_UPLOADFILE_ERROR,
                        msg : '不支持此文件类型' + file.type
                    });
                    this.cancelUpload();
                } else if ( 10485760 < file.size ) {
                    conn.onError({
                        type : EASEMOB_IM_UPLOADFILE_ERROR,
                        msg : '文件大小超过限制！请上传大小不超过10M的文件'
                    });
                    this.cancelUpload();
                } else {
                    flashFilename = file.name;

                    switch (type) {
                        case 'pic':
                            sendPic();
                            break;
                        case 'aud':
                            sendAudio();
                            break;
                        case 'file':
                            sendFile();
                            break;
                    }
                }
            },
            file_dialog_start_handler: function () {
                if ( Easemob.im.Helper.getIEVersion && Easemob.im.Helper.getIEVersion < 10 ) {
                    document.title = pageTitle;
                }
            },
            upload_error_handler: function ( file, code, msg ) {
                if ( code != SWFUpload.UPLOAD_ERROR.FILE_CANCELLED
                    && code != SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED
                    && code != SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED ) {
                    this.uploadOptions.onFileUploadError && this.uploadOptions.onFileUploadError({ type: EASEMOB_IM_UPLOADFILE_ERROR, msg: msg });
                }
            },
            upload_complete_handler: function () {
                //this.setButtonText('点击上传');
            } ,
            upload_success_handler: function ( file, response ) {
                //处理上传成功的回调
                try{
                    var res = Easemob.im.Helper.parseUploadResponse(response);

                    res = $.parseJSON(res);
                    res.filename = file.name;
                    this.uploadOptions.onFileUploadComplete && this.uploadOptions.onFileUploadComplete(res);
                } catch ( e ) {
                    conn.onError({
                        type : EASEMOB_IM_UPLOADFILE_ERROR,
                        msg : '上传图片发生错误'
                    });
                }
            }
        });
    }


//提供上传接口
    var flashUpload = function ( swfObj, url, options ) {
        swfObj.setUploadURL(url);
        swfObj.uploadOptions = options;
        swfObj.startUpload();
    };
    var flashPicUpload = function ( url, options ) {
        flashUpload(picshim, url, options);
    };
    var flashAudioUpload = function ( url, options ) {
        flashUpload(audioshim, url, options);
    };
    var flashFileUpload = function ( url, options ) {
        flashUpload(fileshim, url, options);
    };
    function handlePageLimit() {
        if ( Easemob.im.config.multiResources && window.localStorage ) {
            var keyValue = 'empagecount' + pageLimitKey;

            $(window).on('storage', function () {
                localStorage.setItem(keyValue, 1);
            });
            return function () {
                try {
                    localStorage.clear();
                    localStorage.setItem(keyValue, 1);
                } catch ( e ) {}
            }
        } else {
            return function () {};
        }
    }
    var clearPageSign = function () {
        if ( Easemob.im.config.multiResources && window.localStorage ) {
            try {
                localStorage.clear();
            } catch ( e ) {}
        }
    }
    var getPageCount = function () {
        var sum = 0;

        if ( Easemob.im.config.multiResources && window.localStorage ) {
            for ( var o in localStorage ) {
                if ( localStorage.hasOwnProperty(o) && /^empagecount/.test(o.toString()) ) {
                    sum++;
                }
            }
        }

        return sum;
    };

    window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
    var getLoginInfo = function () {
        return {
            isLogin : false
        };
    };
    var showLoginUI = function () {
        if (!Data.checkProfileId()) return ERROR_PROMISE;
    };
    //var hiddenLoginUI = function () {
    //    $('#loginmodal').modal('hide');
    //};
    var showWaitLoginedUI = function () {
        $('#waitLoginmodal').removeClass('hide');
    };
    var hiddenWaitLoginedUI = function () {
        $('#waitLoginmodal').addClass('hide');
    };
    var showChatUI = function () {
        $('#content').css({
            "display" : "block"
        });
        var login_userEle = document.getElementById("login_user").children[0],
            login_userPic = document.getElementById("myPic");
        if(currentIMLocal && currentIMLocal.length > 2){
            login_userEle.innerHTML = currentIMLocal[2];
            login_userPic.src = currentIMLocal[3];

        }
        else{

            var data = {
                emUserName:curUserId
            }
            Data.getUserInfoIM(data).done(function(res){
                var headpic = res.headPic ? res.headPic : imgPath+'common/images/avatar-small.png';
                login_userEle.innerHTML = res.nickName;
                login_userPic.src = headpic;
                currentIMMsg[0] = user;
                currentIMMsg[1] = pass;
                currentIMMsg[2] = res.nickName;
                currentIMMsg[3] = headpic;
                var currentIMMsgData = JSON.stringify(currentIMMsg);
                localStorage.setItem('currentIM',currentIMMsgData);//保存信息
            })
            login_userEle.setAttribute("title", curUserId);
        }

    };
//登录之前不显示web对话框
    var hiddenChatUI = function () {
        $('#content').css({
            "display" : "none"
        });
        document.getElementById(talkInputId).value = "";
    };
//定义消息编辑文本域的快捷键，enter和ctrl+enter为发送，alt+enter为换行
//控制提交频率
    $(function() {
        $("textarea").keydown(function(event) {
            var msg = document.getElementById(talkInputId).value;
            if (event.altKey && event.keyCode == 13) {
                e = $(this).val();
                $(this).val(e + '\n');
            } else if (event.ctrlKey && event.keyCode == 13) {
                //e = $(this).val();
                //$(this).val(e + '<br>');
                event.returnValue = false;

                //var msg = msgInput.value;
                sendText(msg);
                //sendText();
                return false;
            } else if (event.keyCode == 13) {
                event.returnValue = false;
                sendText(msg);
                return false;
            }
        });

    });
//easemobwebim-sdk注册回调函数列表
    $(document).ready(function() {
        if ( Easemob.im.Helper.getIEVersion && Easemob.im.Helper.getIEVersion < 10 ) {
            $('#em-cr').remove();
        }

        //window.alert = (function () {
        //    var dom = document.getElementById('alert'),
        //        info = dom.getElementsByTagName('span')[0],
        //        btn = dom.getElementsByTagName('button')[0],
        //        st = 0;
        //
        //    btn.onclick = function () {
        //        clearTimeout(st);
        //        dom.style.display = 'none';
        //    };
        //    var delayHide = function () {
        //        clearTimeout(st);
        //        st = setTimeout(function () {
        //            btn.click();
        //        }, 3000);
        //    };
        //    return function ( msg ) {
        //        info.innerHTML = msg;
        //        dom.style.display = 'block';
        //        delayHide();
        //    }
        //}());



        var loginInfo = getLoginInfo();
        if (loginInfo.isLogin) {
            showWaitLoginedUI();
        } else {
            showLoginUI();
        }

        $('#notice-block-div').on('hidden.bs.modal', function(e) {
        });

        $(function() {
            $(window).bind('beforeunload', function() {

                if (conn) {
                    conn.close();
                    return navigator.userAgent.indexOf("Firefox") > 0 ? ' ' : '';
                }
            });
        });
    });

//处理连接时函数,主要是登录成功后对页面元素做处理
    var handleOpen = function(conn) {
        //从连接中获取到当前的登录人注册帐号名
        curUserId = conn.context.userId;
        //获取当前登录人的联系人列表
        conn.getRoster({
            success : function(roster) {
                // 页面处理
                hiddenWaitLoginedUI();
                showChatUI();
                conn.setPresence();
                var curroster;
                for ( var i in roster) {
                    var ros = roster[i];
                    //both为双方互为好友，要显示的联系人,from我是对方的单向好友
                    if (ros.subscription == 'both'
                        || ros.subscription == 'from') {
                        bothRoster.push(ros);
                    } else if (ros.subscription == 'to') {
                        //to表明了联系人是我的单向好友
                        toRoster.push(ros);
                    }
                }


                //获取陌生人列表
                if (strangerIMLocal && strangerIMLocal.length > 0){
                    buildStrangerDiv("momogrouplist");
                }
            }
        });

        if ( !Easemob.im.Helper.isCanUploadFileAsync && typeof uploadShim === 'function' ) {
            picshim = uploadShim('sendPicInput', 'pic');
            audioshim = uploadShim('sendAudioInput', 'aud');
            fileshim = uploadShim('sendFileInput', 'file');
        }


        //启动心跳
        if (conn.isOpened()) {
            conn.heartBeat(conn);
        }
    };
//连接中断时的处理，主要是对页面进行处理
    var handleClosed = function() {
        curUserId = null;
        curChatUserId = null;


        bothRoster = [];
        toRoster = [];
        hiddenChatUI();
        for(var i=0,l=audioDom.length;i<l;i++) {
            if(audioDom[i].jPlayer) audioDom[i].jPlayer('destroy');
        }
        clearContactUI("contactlistUL", "contracgrouplistUL",
            "momogrouplistUL", msgCardDivId);

        $('body').append('<div class="logTimeOut">连接超时，请重新登录！</div>');
        groupQuering = false;
        textSending = false;
    };



//easemobwebim-sdk中处理出席状态操作
    var handleRoster = function(rosterMsg) {
        for (var i = 0; i < rosterMsg.length; i++) {
            var contact = rosterMsg[i];
            if (contact.ask && contact.ask == 'subscribe') {
                continue;
            }
            if (contact.subscription == 'to') {
                toRoster.push({
                    name : contact.name,
                    jid : contact.jid,
                    subscription : "to"
                });
            }
            //app端删除好友后web端要同时判断状态from做删除对方的操作
            if (contact.subscription == 'from') {
                toRoster.push({
                    name : contact.name,
                    jid : contact.jid,
                    subscription : "from"
                });
            }
            if (contact.subscription == 'both') {
                var isexist = contains(bothRoster, contact);
                if (!isexist) {
                    var lielem = $('<li>').attr({
                        "id" : contact.name,
                        "class" : "offline",
                        "className" : "offline"
                    }).click(function() {
                        chooseContactDivClick(this);
                    });
                    $('<img>').attr({
                        "src" : imgPath+'common/images/personalTailor/csad/head/contact_normal.png"'
                    }).appendTo(lielem);
                    $('<span>').html(contact.name).appendTo(lielem);
                    $('#contactlistUL').append(lielem);
                    bothRoster.push(contact);
                }
            }

        }
    };
//异常情况下的处理方法
    var handleError = function(e) {


        clearPageSign();
        e && e.upload && $('#fileModal').modal('hide');
        if (curUserId == null) {
            hiddenWaitLoginedUI();
            alert(e.msg + ",请重新登录");
            showLoginUI();
        } else {
            var msg = e.msg;
            if (e.type == EASEMOB_IM_CONNCTION_SERVER_CLOSE_ERROR) {
                if (msg == "" || msg == 'unknown' ) {
                    alert("服务器断开连接,可能是因为在别处登录");
                } else {
                    alert("服务器断开连接");
                }
            } else if (e.type === EASEMOB_IM_CONNCTION_SERVER_ERROR) {
                if (msg.toLowerCase().indexOf("user removed") != -1) {
                    alert("用户已经在管理后台删除");
                }
            } else {
                alert(msg);
            }
        }
        conn.stopHeartBeat(conn);
    };



//判断要操作的联系人和当前联系人列表的关系
    var contains = function(roster, contact) {
        var i = roster.length;
        while (i--) {
            if (roster[i].name === contact.name) {
                return true;
            }
        }
        return false;
    };
    Array.prototype.indexOf = function(val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i].name == val.name)
                return i;
        }
        return -1;
    };
    Array.prototype.remove = function(val) {
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    };
//登录系统时的操作方法
    function login() {
        handlePageLimit();

        setTimeout(function () {

            var total = getPageCount();
            if ( total > PAGELIMIT ) {
                alert('当前最多支持' + PAGELIMIT + '个resource同时登录');
                return;
            }

            else {

                if(currentIMLocal && currentIMLocal.length > 0 && currentIMLocal[0] != 'null' && currentIMLocal[1] != 'null'){
                    var _userId = currentIMLocal[0],
                        arrId = _userId.split("_");
                    if(arrId.length > 1){
                        _userId = parseInt(arrId[1]);
                    }
                    if(_userId == pageConfig.pid) {
                        fromStorageLogin()

                    }else{
                        createSingleIM();
                    }
                }else{
                    createSingleIM();
                }


            }
            return false;
        }, 50);
    }

    //从缓存中拿帐号密码
    function fromStorageLogin(){
        user = currentIMLocal[0];
        pass = currentIMLocal[1];
        showWaitLoginedUI();
        console.log(conn)
        //根据用户名密码登录系统
        conn.open({
            apiUrl: Easemob.im.config.apiURL,
            user: user,
            pwd: pass,
            //连接时提供appkey
            appKey: Easemob.im.config.appkey
        });
    }

    //创建单个用户-----
    function createSingleIM(){

        localStorage.removeItem('currentIM');
        localStorage.removeItem('strangerIM');

        currentIMLocal = [];

        Data.createNewIMUserSingle().done(function(res){
            user = res.imUser.userName;
            pass = res.imUser.password;


            //var currentIMMsgData = JSON.stringify(currentIMMsg);
            //localStorage.setItem('currentIM',currentIMMsgData);//保存信息

            //console.log(user,pass);

            if (user == '' || pass == '') {
                alert("请输入用户名和密码");
                return;
            }
            //hiddenLoginUI();
            showWaitLoginedUI();
            //根据用户名密码登录系统
            conn.open({
                apiUrl : Easemob.im.config.apiURL,
                user : user,
                pwd : pass,
                //连接时提供appkey
                appKey : Easemob.im.config.appkey
            });
        })
    }

//设置当前显示的聊天窗口div，如果有联系人则默认选中联系人中的第一个联系人，如没有联系人则当前div为null-nouser
    var setCurrentContact = function(defaultUserId) {
        showContactChatDiv(defaultUserId);
        if (curChatUserId != null) {
            hiddenContactChatDiv(curChatUserId);
        } else {
            $('#null-nouser').css({
                "display" : "none"
            });
        }
        curChatUserId = defaultUserId;
    };

//构造陌生人列表
    var buildStrangerDiv = function(momogrouplistDivId) {
        var uielem = document.getElementById("momogrouplistUL");
        var cache = {};
        // for (i = 0; i < strangerIMLocal.length; i++) {
        //console.log(strangerIMLocal);
        $('#momogrouplistUL').find('li').remove();//移除所有联系人
        $.each(strangerIMLocal,function(index,item){
            //console.log(item);
            if(item){
                var lielem = $('<li>').attr({
                    'id' : item[0],
                    'class' : 'offline',
                    'className' : 'offline',
                    'type' : 'chat',
                    'displayName' : item[0]
                }).click(function() {
                    chooseContactDivClick(this);
                });
                item[1] = item[1] ?　item[1]　: imgPath+'/common/images/avatar-small.png';

                $('<div>').attr({"class": "row","name":"row"}).appendTo(lielem);
                console.log(lielem.children('.row'))
                $('<img>').attr("src", item[1]).appendTo(lielem.children('.row'));

                $('<div>').attr({"class": "col message_main_item","name":"col"}).appendTo(lielem.children('.row'));
                $('<span>').html(item[2]).appendTo(lielem.find('.message_main_item'));


                $('#momogrouplistUL').append(lielem);
            }

        })



        var momogrouplist = document.getElementById(momogrouplistDivId);
        var children = momogrouplist.children;
        if (children.length > 0) {
            momogrouplist.removeChild(children[0]);
        }
        momogrouplist.appendChild(uielem);

        //如果当前有聊天窗口
        $('#momogrouplistUL li').each(function(){
            if($(this).attr('id') == $('#talkTo a').data('id')){
                $(this).css('backgroundColor','#33CCFF');
                $('.accordion-body').removeClass('in');
                $('#collapseThree').addClass('in');
            }
        })
    };





//选择联系人的处理
    var getContactLi = function(chatUserId) {
        return document.getElementById(chatUserId);
    };
//构造当前聊天记录的窗口div
    var getContactChatDiv = function(chatUserId) {
        return document.getElementById(curUserId + "-" + chatUserId);
    };
//如果当前没有某一个联系人的聊天窗口div就新建一个
    var createContactChatDiv = function(chatUserId) {
        var msgContentDivId = curUserId + "-" + chatUserId;
        var newContent = document.createElement("div");
        $(newContent).attr({
            "id" : msgContentDivId,
            "class" : "chat01_content",
            "className" : "chat01_content",
            "style" : "display:none"
        });
        $('.mainContainer').css('display','flex');
        $('#nullchater').addClass('hide');
        changeChatIframeSrc(chatUserId);

        return newContent;
    };

    //修改相应的iframe地址
    var changeChatIframeSrc = function(chatUserId){
        $('#diagnosedReport').find('iframe').attr('src',URL.questionnaireSurveyPage+'?uid='+chatUserId);
        $('#userSingleMessage').find('iframe').attr('src',URL.questionnaireSurveyPage+'?uid='+chatUserId);

    }



//显示当前选中联系人的聊天窗口div，并将该联系人在联系人列表中背景色置为蓝色



    var showContactChatDiv = function(chatUserId) {
        var contentDiv = getContactChatDiv(chatUserId);
        if (contentDiv == null) {
            contentDiv = createContactChatDiv(chatUserId);
            document.getElementById(msgCardDivId).appendChild(contentDiv);
        }
        contentDiv.style.display = "block";

        var contactLi = document.getElementById(chatUserId);
        if (contactLi == null) {
            return;
        }
        contactLi.style.backgroundColor = "#33CCFF";
        var dispalyTitle = null;//聊天窗口显示当前对话人名称

        var curChatnick =  $('#' + chatUserId).find('span').text();
        dispalyTitle =  '<p class="userName_tit">'+curChatnick+'</p>';
        $("#roomMemberImg").css('display', 'none');

        //获取缓存中的用户信息
        userIMLocal = sessionStorage.getItem('userIMMessage');//陌生人保存在localstorage中的
        userIMLocal = JSON.parse(userIMLocal);
        userIMLocalCount = userIMLocal ? userIMLocal.length : 0;//陌生人人数
        if(userIMLocal){
            $.each(userIMLocal,function(index,item){
                userIMGroup[index] = item;
            })
        }

        var hasNotExist = true;
        if(userIMLocal){
            $.each(userIMLocal,function(index,item){
               // console.log(item,chatUserId);
                if(item[0] == chatUserId){
                    hasNotExist = false;
                    dispalyTitle +='<p><span class="sex_tit">'+item[1]+'</span><span class="birthday_tit">'+item[2]+'</span><span class="city_tit">'+item[3]+'</span><span class="mobile_tit">'+item[4]+'</span></p>';
                }
            })
            if(hasNotExist ){       //不存在保存

                dispalyTitle += saveUserMessage(chatUserId,false) && hasloaded ? saveUserMessage(chatUserId) : '';

                //console.log(saveUserMessage(chatUserId))
            }
        }
        else{//没用户信息local保存

            dispalyTitle += saveUserMessage(chatUserId,true) && hasloaded ? saveUserMessage(chatUserId) : '';
        }



        document.getElementById(talkToDivId).setAttribute('data-id',chatUserId);
        document.getElementById(talkToDivId).innerHTML = dispalyTitle;
    };


    //保存用户信息到localstorage
    var saveUserMessage = function (_chatUserId,hasnotSession){
        var arrId = _chatUserId.split("_"),
            uid,
            chatTitle = '';
        if(arrId.length > 1){
            uid = parseInt(arrId[1]);
        }
        var data = {
            userId:uid
        }
        Data.getLastUserDetectDataByUserId(data).done(function(res){
            hasloaded = true;
            var userIMSingleMsg;
            if(hasnotSession){
                //获取缓存中的用户信息
                userIMLocal = sessionStorage.getItem('userIMMessage');//陌生人保存在localstorage中的
                userIMLocal = JSON.parse(userIMLocal);
                userIMLocalCount = userIMLocal ? userIMLocal.length : 0;//陌生人人数
                if(userIMLocal){
                    $.each(userIMLocal,function(index,item){
                        userIMGroup[index] = item;
                    })
                }
            }

            if(res.flag != 0){
                var list = res.data,
                    sexVal;
                if(list.sex == 1){
                    sexVal = '男'
                }
                if(list.sex == 2){
                    sexVal = '女'
                }
                chatTitle ='<p><span class="sex_tit">'+sexVal+'</span><span class="birthday_tit">'+list.birthday+'</span><span class="city_tit">'+list.city+'</span><span class="mobile_tit">'+list.mobile+'</span></p>';


                userIMSingleMsg = [_chatUserId,sexVal,list.birthday,list.city,list.mobile];
            }else{
                userIMSingleMsg = [_chatUserId,'','.','',''];
            }
                    userIMLocalCount ++;
                    userIMGroup[userIMLocalCount - 1] = userIMSingleMsg;

               // console.log(userIMGroup)
                    var currentIMMsgData = JSON.stringify(userIMGroup);
                    sessionStorage.setItem('userIMMessage', currentIMMsgData);//保存信息



            return chatTitle
        })

    }



//对上一个联系人的聊天窗口div做隐藏处理，并将联系人列表中选择的联系人背景色置空
    var hiddenContactChatDiv = function(chatUserId) {
        var contactLi = document.getElementById(chatUserId);
        if (contactLi) {
            contactLi.style.backgroundColor = "";
        }
        var contentDiv = getContactChatDiv(chatUserId);
        if (contentDiv) {
            contentDiv.style.display = "none";
        }
    };
//切换联系人聊天窗口div
    var chooseContactDivClick = function(li) {
        var chatUserId = li.id,
            roomId = $(li).attr("roomId");



        if (('true' != $(li).attr("joined"))) {
            conn.join({
                roomId : roomId
            });
            $(li).attr("joined", "true");
        }

        if (chatUserId != curChatUserId) {
            if (curChatUserId == null) {
                showContactChatDiv(chatUserId);
            } else {
                showContactChatDiv(chatUserId);
                hiddenContactChatDiv(curChatUserId);
            }
            curChatUserId = chatUserId;
        }
        //对默认的null-nouser div进行处理,走的这里说明联系人列表肯定不为空所以对默认的聊天div进行处理
        $('#null-nouser').css({
            "display" : "none"
        });
        var badgespan = $(li).children(".badge");
        if (badgespan && badgespan.length > 0) {
            li.removeChild(badgespan[0]);
            var message_li = $(li).find(".message_li");
            message_li.remove();

        }
        //点击有未读消息对象时对未读消息提醒的处理
        var badgespanGroup = $(li).parent().parent().parent().find(".badge");
        if (badgespanGroup && badgespanGroup.length == 0) {
            $(li).parents('.accordion-group').find('.badgegroup').remove();
        }
    };
    var clearContactUI = function(contactlistUL, contactgrouplistUL,momogrouplistUL, contactChatDiv) {
        //清除左侧联系人内容
        $('#contactlistUL').empty();
        $('#contracgrouplistUL').empty();
        $('#momogrouplistUL').empty();
        //处理联系人分组的未读消息处理
        var accordionChild = $('#accordionDiv').children();
        for (var i = 1; i <= accordionChild.length; i++) {
            var badgegroup = $('#accordion' + i).find(".badgegroup");
            if (badgegroup && badgegroup.length > 0) {
                $('#accordion' + i).children().remove();
            }
        }
        //清除右侧对话框内容
        document.getElementById(talkToDivId).children[0].innerHTML = "";
        var chatRootDiv = document.getElementById(contactChatDiv);
        var children = chatRootDiv.children;
        for (var i = children.length - 1; i > 1; i--) {
            chatRootDiv.removeChild(children[i]);
        }
        $('#null-nouser').css({
            "display" : "block"
        });
    };
    var emotionFlag = false;

    var showEmotionDialog = function() {
        if (emotionFlag) {
            $('#wl_faces_box').css({
                "display" : "block"
            });
            return;
        }
        emotionFlag = true;
        // Easemob.im.Helper.EmotionPicData设置表情的json数组
        var sjson = Easemob.im.EMOTIONS,
            data = sjson.map,
            path = sjson.path;
        for ( var key in data) {
            var emotions = $('<img>').attr({
                "id" : key,
                "src" : path + data[key],
                "style" : "cursor:pointer;"
            }).click(function() {
                selectEmotionImg(this);
            });
            $('<li>').append(emotions).appendTo($('#emotionUL'));
        }
        $('#wl_faces_box').css({
            "display" : "block"
        });
    };


//表情选择div的关闭方法
    var turnoffFaces_box = function() {
        //$("#wl_faces_box").fadeOut("slow");
        $('#wl_faces_box').css({
            "display" : "none"
        });
    };
    var selectEmotionImg = function(selImg) {
        var txt = document.getElementById(talkInputId);
        txt.value = txt.value + selImg.id;
        txt.focus();
    };

    var sendText = function(msg) {
        if (textSending) {
            return;
        }
        textSending = true;
        var msgInput = document.getElementById(talkInputId);
        //var msg = msgInput.value;
        if (msg == null || msg.length == 0) {
            textSending = false;
            return;
        }
        var to = curChatUserId;
        if (to == null) {
            textSending = false;
            return;
        }
        var options = {
            to : to,
            msg : msg,
            type : "chat"
        };


        //easemobwebim-sdk发送文本消息的方法 to为发送给谁，meg为文本消息对象
        conn.sendTextMessage(options);

        //存储文本数据
        var nowDate = new Date(),
            timestamp = nowDate.getTime();
        insertdbData(curUserId,to,'text',msg,timestamp,'','');

        //当前登录人发送的信息在聊天窗口中原样显示
        //var msgtext = Easemob.im.Utils.parseLink(Easemob.im.Utils.parseEmotions(encode(msg)));
        var msgtext = Easemob.im.Utils.parseEmotions(encode(msg));
        // console.log(msgtext,msg);
        appendMsg(curUserId, to, msgtext);
        turnoffFaces_box();
        msgInput.value = "";
        msgInput.focus();
        setTimeout(function() {
            textSending = false;
        }, 1000);
    };


    //关闭对话closeTalking
    var closeTalking = function(msg) {
        if (textSending) {
            return;
        }
        textSending = true;
        var to = curChatUserId;
        if (to == null) {
            textSending = false;
            return;
        }
        var options = {
            to : to,
            msg : '您已关闭对话',
            ext : {"MikuExpand":"IsOver"},
            type : "chat"
        };


        //easemobwebim-sdk发送文本消息的方法 to为发送给谁，meg为文本消息对象
        conn.sendTextMessage(options);
        //当前登录人发送的信息在聊天窗口中原样显示
        //var msgtext = Easemob.im.Utils.parseLink(Easemob.im.Utils.parseEmotions(encode(msg)));
        var msgtext = Easemob.im.Utils.parseEmotions(encode(options.msg));
        appendMsg(curUserId, to, msgtext,options.ext.MikuExpand);

        //var contentDiv = getContactChatDiv(to);
        //console.log(contentDiv);

        //将状态改为true





        turnoffFaces_box();
        setTimeout(function() {
            textSending = false;
        }, 1000);
    };


    //大表情
    var bigMotion = function(imgSrc,i) {
        if (textSending) {
            return;
        }
        textSending = true;
        var to = curChatUserId;
        if (to == null) {
            textSending = false;
            return;
        }
        var options = {
            to : to,
            msg : "<img src='"+imgSrc+"'/>",
            ext : {"em_expression_id":"em"+(1000+i+1),"em_is_big_expression":true},
            type : "emotion"
        };


        //easemobwebim-sdk发送文本消息的方法 to为发送给谁，meg为文本消息对象
        conn.sendTextMessage(options);
        //当前登录人发送的信息在聊天窗口中原样显示
        //var msgtext = Easemob.im.Utils.parseLink(Easemob.im.Utils.parseEmotions(encode(msg)));
        var msgtext = Easemob.im.Utils.parseEmotions(encode(options.msg));
        appendMsg(curUserId, to, msgtext);
        turnoffFaces_box();
        setTimeout(function() {
            textSending = false;
        }, 1000);
    };

    var pictype = {
        "jpg" : true,
        "gif" : true,
        "png" : true,
        "bmp" : true
    };
    var send = function ($this) {

        var fI = $('#fileInput');
        fI.val('').attr('data-type', $this.attr('type')).click();
    };
    $('#sendPicBtn, #sendAudioBtn, #sendFileBtn').on('click', send);
    $('#fileInput').on('change', function() {

        switch ( this.getAttribute('data-type') ) {
            case 'img':
                sendPic();
                break;
            case 'audio':
                sendAudio();
                break;
            default:
                sendFile();
                break;
        }
    });

//发送图片消息时调用方法
    var sendPic = function() {

        var to = curChatUserId;
        if (to == null) {
            return;
        }

        // Easemob.im.Helper.getFileUrl为easemobwebim-sdk获取发送文件对象的方法，fileInputId为 input 标签的id值
        var fileObj = Easemob.im.Helper.getFileUrl('fileInput');
        if (Easemob.im.Helper.isCanUploadFileAsync && (fileObj.url == null || fileObj.url == '')) {
            alert("请先选择图片");
            return;
        }
        var filetype = fileObj.filetype;
        var filename = fileObj.filename;
        if (!Easemob.im.Helper.isCanUploadFileAsync || filetype in pictype) {
            var opt = {
                type : 'chat',
                fileInputId : 'fileInput',
                filename : flashFilename || filename,
                to : to,
                apiUrl: Easemob.im.config.apiURL,
                onFileUploadError : function(error) {
                    var messageContent = (error.msg || '') + ",发送图片文件失败:" + (filename || flashFilename);
                    appendMsg(curUserId, to, messageContent);
                },
                onFileUploadComplete : function(data) {

                    var file = document.getElementById('fileInput'),
                        img;
                    if ( Easemob.im.Helper.isCanUploadFileAsync && file && file.files) {
                        var objUrl = getObjectURL(file.files[0]);
                        if (objUrl) {
                            img= document.createElement("img");
                            img.src = objUrl;
                            //img.width = maxWidth;
                        }
                    } else {
                        filename = data.filename || '';
                        img = document.createElement("img");
                        img.src = data.uri + '/' + data.entities[0].uuid;
                        //img.width = maxWidth;
                    }


                    appendMsg(curUserId, to, {
                        data : [{
                            type : 'pic',
                            filename : filename,
                            data : img
                        }]
                    });
                },
                flashUpload: flashPicUpload
            };

            conn.sendPicture(opt);
            return;
        }
        alert("不支持此图片类型" + filetype);
    };
    var audtype = {
        "mp3" : true,
        "wma" : true,
        "wav" : true,
        "amr" : true,
        "avi" : true
    };
//发送音频消息时调用的方法
    var sendAudio = function() {
        var to = curChatUserId;
        if (to == null) {
            return;
        }
        //利用easemobwebim-sdk提供的方法来构造一个file对象
        var fileObj = Easemob.im.Helper.getFileUrl('fileInput');

        if (Easemob.im.Helper.isCanUploadFileAsync && (fileObj.url == null || fileObj.url == '')) {
            alert("请先选择音频");
            return;
        }
        var filetype = fileObj.filetype;
        var filename = fileObj.filename;
        if (!Easemob.im.Helper.isCanUploadFileAsync || filetype in audtype) {
            //console.log(flashFilename+'1' , filename+'2');
            var opt = {
                type : "chat",
                fileInputId : 'fileInput',
                filename : flashFilename || filename,
                //filename:'blob:http://test.unesmall.com/eb56ea4f-8d80-46cb-8423-912974ae1e87',
                to : to,//发给谁
                apiUrl: Easemob.im.config.apiURL,
                onFileUploadError : function(error) {
                    var messageContent = (error.msg || '') + ",发送音频失败:" + (filename || flashFilename);
                    appendMsg(curUserId, to, messageContent);
                },
                onFileUploadComplete : function(data) {
                    var messageContent = "发送音频" + data.filename;

                    var file = document.getElementById('fileInput');
                    var aud = document.createElement('audio');
                    aud.controls = true;
                    // console.log(Easemob.im.Helper.isCanUploadFileAsync,file,file.files);
                    if (Easemob.im.Helper.isCanUploadFileAsync && file && file.files) {
                        var objUrl = getObjectURL(file.files[0]);
                        if (objUrl) {
                            aud.setAttribute('src', objUrl);
                        }
                    } else {
                        aud.setAttribute('src', data.uri + '/' + data.entities[0].uuid);
                    }

                    appendMsg(curUserId, to, {
                        data : [ {
                            type : 'audio',
                            filename : filename,
                            data : aud,
                            audioShim: !window.Audio
                        } ]
                    });
                },
                flashUpload: flashAudioUpload
            };
            //构造完opt对象后调用easemobwebim-sdk中发送音频的方法

            conn.sendAudio(opt);
            return;
        }
        alert("不支持此音频类型" + filetype);
    };


//发送录音
    var sendRecord = function(src) {
        var to = curChatUserId;
        if (to == null) {
            return;
        }
        //利用easemobwebim-sdk提供的方法来构造一个file对象
        var fileObj = Easemob.im.Helper.getFileUrl('fileInput');

        var filetype = fileObj.filetype;
        var filename = fileObj.filename;

        var Aduration = document.getElementById('recordObj').duration;


        var opt = {
            type : "chat",
            fileInputId : 'fileInput',
            file:{
                data:recorder.getBlob(),
                url:src
            },
            filename : flashFilename || filename,
            file_length:Aduration,
            to : to,//发给谁
            apiUrl: Easemob.im.config.apiURL,
            onFileUploadError : function(error) {
                var messageContent = (error.msg || '') + ",发送音频失败:";
                appendMsg(curUserId, to, messageContent);
            },
            onFileUploadComplete : function(data) {

                var messageContent = "发送音频" + data.filename;

                var file = document.getElementById('fileInput');
                var aud = document.createElement('audio');
                aud.controls = true;

                aud.setAttribute('src', src);

                appendMsg(curUserId, to, {
                    data : [ {
                        type : 'audio',
                        filename : filename,
                        data : aud,
                        audioShim: !window.Audio
                    } ]
                });
            },
            flashUpload: flashAudioUpload
        };
        //构造完opt对象后调用easemobwebim-sdk中发送音频的方法

        conn.sendAudio(opt);
        return;

    };

    var filetype = {
        "mp3" : true,
        "wma" : true,
        "wav" : true,
        "amr" : true,
        "avi" : true,
        "jpg" : true,
        "gif" : true,
        "png" : true,
        "bmp" : true,
        "zip" : true,
        "rar" : true,
        "doc" : true,
        "docx" : true,
        "pdf" : true
    };
//发送文件消息时调用的方法
    var sendFile = function() {
        var to = curChatUserId;
        if (to == null) {
            return;
        }
        //利用easemobwebim-sdk提供的方法来构造一个file对象
        var fileObj = Easemob.im.Helper.getFileUrl('fileInput');
        if (Easemob.im.Helper.isCanUploadFileAsync && (fileObj.url == null || fileObj.url == '')) {
            alert("请选择发送音频");
            return;
        }
        var fileType = fileObj.filetype;
        var filename = fileObj.filename;
        if (!Easemob.im.Helper.isCanUploadFileAsync || fileType in filetype) {
            var opt = {
                type : "chat",
                fileInputId : 'fileInput',
                filename : filename || flashFilename,
                to : to,//发给谁
                apiUrl: Easemob.im.config.apiURL,
                onFileUploadError : function(error) {
                    var messageContent = (error.msg || '') + ",发送文件失败:" + (filename || flashFilename);
                    appendMsg(curUserId, to, messageContent);
                },
                onFileUploadComplete : function(data) {
                    var messageContent = "发送文件" + data.filename;
                    appendMsg(curUserId, to, messageContent);
                },
                flashUpload: flashFileUpload
            };
            //构造完opt对象后调用easemobwebim-sdk中发送音频的方法

            conn.sendFile(opt);
            return;
        }
        alert("不支持此文件类型" + fileType);
    };
//easemobwebim-sdk收到文本消息的回调方法的实现
    var handleTextMessage = function(message) {
        var from = message.from;//消息的发送者
        var mestype = message.type;//消息发送的类型是群组消息还是个人消息
        var messageContent = message.data;//文本消息体





        //TODO  根据消息体的to值去定位那个群组的聊天记录
         if(message.ext && message.ext.MikuExpand){
            appendMsg(from, from, messageContent,message.ext.MikuExpand);
        }
        else {
            appendMsg(from, from, messageContent);
        }

        //显示消息在列表里
        //$('#'+from);

    };



//easemobwebim-sdk收到表情消息的回调方法的实现，message为表情符号和文本的消息对象，文本和表情符号sdk中做了
//统一的处理，不需要用户自己区别字符是文本还是表情符号。
    var handleEmotion = function(message) {
        var from = message.from;
        var room = message.to;
        var mestype = message.type;//消息发送的类型是群组消息还是个人消息

            appendMsg(from, from, message);

    };
//easemobwebim-sdk收到图片消息的回调方法的实现
    var handlePictureMessage = function(message) {
        var filename = message.filename;//文件名称，带文件扩展名
        var from = message.from;//文件的发送者
        var mestype = message.type;//消息发送的类型是群组消息还是个人消息
        var contactDivId = from;

        var options = message;

        var img = document.createElement("img");
        img.src = message.url;
        appendMsg(from, contactDivId, {
            data : [ {
                type : 'pic',
                filename : filename || '',
                data : img
            } ]
        });
    };


//easemobwebim-sdk收到音频消息回调方法的实现
    var handleAudioMessage = function(message) {
        var filename = message.filename;
        var filetype = message.filetype;
        var from = message.from;
        var mestype = message.type;//消息发送的类型是群组消息还是个人消息
        var contactDivId = from;


        var audio = document.createElement("audio");
        audio.controls = "controls";
        audio.innerHTML = "当前浏览器不支持播放此音频:" + filename;
        //audio.src = message.url;

        appendMsg(from, contactDivId, {
            data : [ {
                type : 'audio',
                filename : filename || '',
                data : audio,
                audioShim: !window.Audio
            } ]
        });/**/

        var options = message;
        options.onFileDownloadComplete = function(response, xhr) {
            var objectURL = Easemob.im.Helper.parseDownloadResponse.call(this, response);
            if (Easemob.im.Helper.getIEVersion != 9 && window.Audio) {
                audio.onload = function() {
                    audio.onload = null;
                    window.URL && window.URL.revokeObjectURL && window.URL.revokeObjectURL(audio.src);
                };
                audio.onerror = function() {
                    audio.onerror = null;
                };
                audio.src = objectURL;
                return;
            }
        };
        options.onFileDownloadError = function(e) {
            appendMsg(from, contactDivId, e.msg + ",下载音频" + filename + "失败");
        };
        options.headers = {
            "Accept" : "audio/mp3"
        };
        Easemob.im.Helper.download(options);
    };
//处理收到文件消息
    var handleFileMessage = function(message) {
        var filename = message.filename;
        var filetype = message.filetype;
        var from = message.from;
        var mestype = message.type;//消息发送的类型是群组消息还是个人消息
        var contactDivId = from;

        var options = message;
        options.onFileDownloadComplete = function(response, xhr) {
            var spans = "收到文件消息:" + filename;
            appendMsg(from, contactDivId, spans);
            return;
        };
        options.onFileDownloadError = function(e) {
            appendMsg(from, contactDivId, e.msg + ",下载文件" + filename + "失败");
        };
        Easemob.im.Helper.download(options);
    };
//收到视频消息
    var handleVideoMessage = function(message) {
        var filename = message.filename;
        var filetype = message.filetype;
        var from = message.from;
        var mestype = message.type;//消息发送的类型是群组消息还是个人消息
        var contactDivId = from;

        var options = message;

        var video = document.createElement("video");
        video.controls = "controls";
        video.src = message.url;
        video.innerHTML = "收到视频消息:" + options.filename + ', 当前浏览器不支持video，无法播放';

        appendMsg(from, contactDivId, {
            data : [ {
                type : 'video',
                filename : filename || '',
                data : video
            } ]
        });
    };
    var handleLocationMessage = function(message) {
        var from = message.from;
        var to = message.to;
        var mestype = message.type;
        var content = message.addr;

            appendMsg(from, from, content);

    };


    //专家响应
    var ExpertRespond = function() {
        if (textSending) {
            return;
        }
        textSending = true;
        var to = curChatUserId;
        if (to == null) {
            textSending = false;
            return;
        }
        var options = {
            to : to,
            msg : '米酷专家为您服务！',
            ext : {"MikuExpand":"ExpertRespond"},
            type : "chat"
        };


        //easemobwebim-sdk发送文本消息的方法 to为发送给谁，meg为文本消息对象
        conn.sendTextMessage(options);
        //当前登录人发送的信息在聊天窗口中原样显示
        //var msgtext = Easemob.im.Utils.parseLink(Easemob.im.Utils.parseEmotions(encode(msg)));
        var msgtext = Easemob.im.Utils.parseEmotions(encode(options.msg));
        appendMsg(curUserId, to, msgtext);

        turnoffFaces_box();
        setTimeout(function() {
            textSending = false;
        }, 1000);
    };


    //发送盒子
    var sendBox = function(boxName,BoxId,BoxImgUrl) {
        if (textSending) {
            return;
        }
        textSending = true;
        var to = curChatUserId;
        if (to == null) {
            textSending = false;
            return;
        }
        var options = {
            to : to,
            msg : boxName,
            ext : {"MikuExpand":"CheckBox","BoxId":BoxId,BoxImgUrl:BoxImgUrl},
            type : "chat"
        };

        //easemobwebim-sdk发送文本消息的方法 to为发送给谁，meg为文本消息对象
        conn.sendTextMessage(options);
        console.log(options)
        //当前登录人发送的信息在聊天窗口中原样显示
        //var msgtext = Easemob.im.Utils.parseLink(Easemob.im.Utils.parseEmotions(encode(msg)));
        var msgtext = Easemob.im.Utils.parseEmotions(encode(options.msg));
        appendMsg(curUserId, to, msgtext,options.ext.MikuExpand,options);

        turnoffFaces_box();
        setTimeout(function() {
            textSending = false;
        }, 1000);
    };


    //呼叫中心有新内容
    var callCenterNewMsg = function(chatId){

        if($('#callCenterUL li').length > 0){
            var contactLi = getContactLi(chatId);
            //contactLi.style.backgroundColor = "green";
            var badgespan = $(contactLi).children(".badge");
            if (badgespan && badgespan.length > 0) {
                var count = badgespan.text();
                var myNum = parseInt(count);
                //var myNum = new Number(count);
                myNum++;
                badgespan.text(myNum);
            } else {
                $(contactLi).append('<span class="badge">1</span>');
            }
            //联系人不同分组的未读消息提醒
            var badgespanGroup = $(contactLi).parent().parent().parent().prev()
                .children().children(".badgegroup");
            if (badgespanGroup && badgespanGroup.length == 0) {
                $(contactLi).parent().parent().parent().prev().children()
                    .append('<span class="badgegroup"></span>');
            }
        }
    }


//收到陌生人消息时创建陌生人列表
    function createMomogrouplistUL(who, message) {


        var cache = {};
        if (who in cache) {
            return;
        }
        var data = {
            emUserName:who
        };
        cache[who] = true;
        var lielem = document.createElement("li");
        callInStatus = true;


        $(lielem).attr({
            'id' : who,
            'class' : 'offline',
            'className' : 'offline',
            'type' : 'chat',
            'displayName' : who,
            'data-call-status':'1'
        });
        var strangerIMItem = [],strangerIMSingleMsg = [];
        //缓存中是否已经有这个用户了
        var isInStrangerStorge = true;
        lielem.onclick = function() {


            if(callInStatus && callOrList){

                    ExpertRespond();
                    buildStrangerDiv("momogrouplist");
                    $(this).remove();

                $(this).attr('data-call-status',0);
                strangerIMSingleMsg[3] = 'false';

                if(strangerIMLocal){
                    $.each(strangerIMLocal,function(index,item){
                        strangerIMGroup[index] = item;
                    })
                }
                strangerIMGroup[strangerIMCount-1] = strangerIMSingleMsg;
                var strangerIMGroupData = JSON.stringify(strangerIMGroup);
                localStorage.setItem('strangerIM',strangerIMGroupData);//保存信息
                strangerIMSingleMsg = [];//清除
                callInStatus = false;
                strangerIMLocal = localStorage.getItem('strangerIM');//陌生人保存在localstorage中的
                strangerIMLocal = JSON.parse(strangerIMLocal);

                //点击有未读消息对象时对未读消息提醒的处理
                if($('#callCenterUL li').length == 0){
                    $('#accordion1').find(".badgegroup").remove();
                }

            }
            chooseContactDivClick(this);
        };
        var momogrouplistUL,
            callOrList = false;
        if(message &&  message.ext && message.ext.MikuExpand == 'CallExpert' && isInStrangerStorge){
             momogrouplistUL = document.getElementById("callCenterUL");
             callOrList = true;
        }else{
            momogrouplistUL = document.getElementById("momogrouplistUL");
        }


        var divelemRow = document.createElement("div");
        $(divelemRow).attr({
            'class' : 'row'
        });
        lielem.appendChild(divelemRow);

        var imgelem = document.createElement("img");


        imgelem.setAttribute("src", imgPath+'common/images/avatar-small.png');

        divelemRow.appendChild(imgelem);
        var divelemCol = document.createElement("div");
        $(divelemCol).attr({
            'class' : 'col col-10 message_main_item'
        });
        divelemRow.appendChild(divelemCol);

        var spanelem = document.createElement("span");
        spanelem.innerHTML = who;
        divelemCol.appendChild(spanelem);
        if(callOrList){
            var divelemresponse = document.createElement("div");
            $(divelemresponse).attr({
                'class' : 'col col-5 responseBtn'
            });
            divelemRow.appendChild(divelemresponse);
            var spanelemBtn = document.createElement("span");
            spanelemBtn.innerHTML = '应答';
            divelemresponse.appendChild(spanelemBtn);
        }

        momogrouplistUL.appendChild(lielem);


        $.each(membersList,function(i,item){
            $.each(item.friendsGroupMapList,function(j,memberItem){
                if(memberItem.emUserName == who){
                    spanelem.innerHTML = memberItem.profileName;
                    if(memberItem.profilePic){
                        imgelem.setAttribute("src", memberItem.profilePic);
                    }

                   var callInState =  callOrList ? 'true' :'false';

                    strangerIMSingleMsg = [who,memberItem.profilePic,memberItem.profileName,callInState];

                    if(strangerIMLocal){
                        $.each(strangerIMLocal,function(index,item){
                            strangerIMGroup[index] = item;
                            if(item[0] == who){
                                isInStrangerStorge= false;
                            }
                        })
                    }
                    if(isInStrangerStorge && who != null) {
                        strangerIMCount ++;
                        strangerIMGroup[strangerIMCount - 1] = strangerIMSingleMsg;
                        var strangerIMGroupData = JSON.stringify(strangerIMGroup);
                        //console.log(strangerIMGroup,strangerIMCount,strangerIMGroupData);
                        localStorage.setItem('strangerIM', strangerIMGroupData);//保存信息
                    }
                    //strangerIMSingleMsg = [];//清除
                }

            })
        })
        callCenterNewMsg(who);

    }



//显示聊天记录的统一处理方法
    var appendMsg = function(who, contact, message, onlyPrompt,messExcept) {


        var contactUL = document.getElementById("contactlistUL");
        var contactDivId = contact;
        var contactLi = getContactLi(contactDivId);

        if(onlyPrompt && onlyPrompt  == 'CallExpert' && $('#callCenterUL').find('#'+who).length == 0){     //呼叫专家
            createMomogrouplistUL(who, messExcept);
            if($('#momogrouplistUL').find('#'+who).length > 0){        //陌生人列表里有
                //console.log($('#'+who));
                $('#momogrouplistUL').find('#'+who).remove();//移除
            }

        }else{
            var curCId = curUserId == who ? contact : who;
            if ($('#momogrouplistUL').find('#'+curCId).length == 0) {
                    createMomogrouplistUL(curCId);

            }
        }


        // 消息体 {isemotion:true;body:[{type:txt,msg:ssss}{type:emotion,msg:imgdata}]}
        var localMsg = null;
        if (typeof message == 'string') {
            localMsg = Easemob.im.Helper.parseTextMessage(message);
            localMsg = localMsg.body;
        } else {
            localMsg = message.data;
        }


        var curHeadPic;

        $.each(membersList,function(i,item){
            $.each(item.friendsGroupMapList,function(j,memberItem){
                if(memberItem.emUserName == who){
                    curHeadPic = memberItem.profilePic;
                }
            })
        })

        var userPhotoSrc = (curUserId == who) ? $('#myPic').attr('src') : curHeadPic;
        //    LoacalTime = getLoacalTimeString();
        //timePrev = LoacalTime

        var headstr =(onlyPrompt && !messExcept) ? ["<p1>" + message + "</p1>"] : [ "<p2 class='chatTime'>" + getLoacalTimeString() + "<b></b><br/></p2>","<p1 class='userPhoto'><img src='" + userPhotoSrc + "' /></p1>"];
        var header = $(headstr.join(''))
        var lineDiv = document.createElement("div");
        //var lineDiv;

        lineDiv.className="chatMess";
        var messageContent = localMsg,
            flg = onlyPrompt ? 0 : messageContent.length;



        if(onlyPrompt && onlyPrompt  == 'CheckBox'){     //发送盒子
            var eletext = "<p3 data-id='"+messExcept.ext.BoxId+"'  href='https://www.hao123.com/' class='chat-content-p3'><div class='boxMessage'><span>"+message+"</span><img src='" + messExcept.ext.BoxImgUrl + "'/></div> </p3>";
            var ele = $(eletext);
            for (var j = 0; j < ele.length; j++) {
                lineDiv.appendChild(ele[j]);
            }

        }



        var msg,type;

        //多个表情
        var _chatType = messageContent[0].type,
            messageTip;
        if(_chatType == "emotion" || _chatType == "pic" || _chatType == 'audio' || _chatType == 'video'){
            var eletext = "<p3 class='chat-content-p3'></p3>";
            var ele = $(eletext);
            for (var j = 0; j < ele.length; j++) {
                lineDiv.appendChild(ele[j]);
            }
            if(_chatType == "emotion"){
                messageTip = '[表情]';
            }
            if(_chatType == "pic"){
                messageTip = '[图片]';
            }
            if(_chatType == "audio"){
                messageTip = '[语音]';
            }
            if(_chatType == "video"){
                messageTip = '[视频]';
            }
        }else{
            messageTip = message;
        }


        for (var i = 0; i < flg; i++) {
            msg = messageContent[i];
            type = msg.type;
            var data = msg.data;
            //console.log(message);
            if (type == "emotion") {
                console.log(msg);
                var eletext = "<img src='" + data + "'/>";
                var ele = $(eletext);
                for (var j = 0; j < ele.length; j++) {
                    lineDiv.getElementsByTagName('p3')[0].appendChild(ele[j]);
                }
                //$(".messageBody").append(eletext);
            }


            else if (type == "pic" || type == 'audio' || type == 'video') {
                var filename = msg.filename;

                data.nodeType && lineDiv.getElementsByTagName('p3')[0].appendChild(data);
                //lineDiv.firstChild.setAttribute("class", "chat-content-p3");
                if(type == 'audio' && msg.audioShim) {
                    var d = $(lineDiv),
                        t = new Date().getTime();
                    d.append($('<div class="'+t+'"></div><button class="play'+t+'">播放</button><button style="display:none" class="play'+t+'">暂停</button>'));
                }
            } else {
                //console.log(data);

                var bigEmotion = {
                    '[示例1]': 'icon_002.gif',
                    '[示例2]': 'icon_007.gif',
                    '[示例3]': 'icon_010.gif',
                    '[示例4]': 'icon_012.gif',
                    '[示例5]': 'icon_013.gif',
                    '[示例6]': 'icon_018.gif',
                    '[示例7]': 'icon_019.gif',
                    '[示例8]': 'icon_020.gif',
                    '[示例9]': 'icon_021.gif',
                    '[示例10]': 'icon_022.gif',
                    '[示例11]': 'icon_024.gif',
                    '[示例12]': 'icon_027.gif',
                    '[示例13]': 'icon_029.gif',
                    '[示例14]': 'icon_030.gif',
                    '[示例15]': 'icon_035.gif',
                    '[示例16]': 'icon_040.gif'
                }
                if(data.indexOf('示例')> -1){
                    data = "<img src='"+imgPath+"common/images/personalTailor/csad/faces/"+bigEmotion[data]+"'/>";
                }



                var eletext = "<p3>" + data + "</p3>";
                var ele = $(eletext);
                ele[0].setAttribute("class", "chat-content-p3");
                ele[0].setAttribute("className", "chat-content-p3");
                if (curUserId == who) {
                    // ele[0].style.backgroundColor = "#AAAAB4";
                }
                for (var j = 0; j < ele.length; j++) {
                    lineDiv.appendChild(ele[j]);
                }
                // console.log($(".messageBody"))
                //$(".messageBody").append(eletext);
            }
        }

        for (var m = 0; m < header.length; m++) {
            var ele = header[m];
            lineDiv.appendChild(ele);
        }

        //呼叫专家 && 超时不显示
        if(onlyPrompt && onlyPrompt  == 'CallExpert' || onlyPrompt && onlyPrompt == 'OverTime'){
            lineDiv.className = 'chatMess hide';
        }



        if (curChatUserId == null) {
            setCurrentContact(contact);

            if (time < 1) {
                //$('#accordion3').click();
                time++;
            }
        }
        if (curChatUserId && curChatUserId.indexOf(contact) < 0) {
            var contactLi = getContactLi(contactDivId);
            if (contactLi == null) {
                return;
            }
            //contactLi.style.backgroundColor = "green";
            var badgespan = $(contactLi).children(".badge");
            if (badgespan && badgespan.length > 0) {
                var count = badgespan.text();
                var myNum = parseInt(count);

                myNum++;
                badgespan.text(myNum);
            } else {
                $(contactLi).append('<span class="badge">1</span>');
            }

            //消息
            var messageI = $(contactLi).find(".message_li");

                if (messageI && messageI.length > 0) {
                    messageI.text(messageTip);
                } else {
                    $(contactLi).find('.message_main_item').append('<i class="message_li ellipsis">'+messageTip+'</i>');
                }

            //联系人不同分组的未读消息提醒
            var badgespanGroup = $(contactLi).parent().parent().parent().prev()
                .children().children(".badgegroup");
            if (badgespanGroup && badgespanGroup.length == 0) {
                $(contactLi).parent().parent().parent().prev().children()
                    .append('<span class="badgegroup"></span>');
            }
        }

        var msgContentDiv = getContactChatDiv(contactDivId);
        if ( (onlyPrompt && !messExcept) ) {
            lineDiv.style.textAlign = "center";
            lineDiv.getElementsByTagName('p1')[0].className = 'ex_center';
        } else if (curUserId == who) {
            lineDiv.style.textAlign = "right";
            lineDiv.setAttribute("class", "right chatMess");

            // lineDiv.firstChild.style.right = '20px';
        } else {
            lineDiv.style.textAlign = "left";
            lineDiv.setAttribute("class", "left chatMess");
            //lineDiv.firstChild.style.left = '20px';
        }
        var create = false;
        if (msgContentDiv == null) {
            msgContentDiv = createContactChatDiv(contactDivId);
            create = true;
        }
        msgContentDiv.appendChild(lineDiv);
        if (create) {
            document.getElementById(msgCardDivId).appendChild(msgContentDiv);
        }
        if(type == 'audio' && msg.audioShim) {
            setTimeout(function(){
                playAudioShim(d.find('.'+t), data.currentSrc, t);
            }, 0);
        }
        msgContentDiv.scrollTop = msgContentDiv.scrollHeight;
        return lineDiv;
    };


//清除聊天记录
    var clearCurrentChat = function clearCurrentChat() {
        var currentDiv = getContactChatDiv(curChatUserId)
            || createContactChatDiv(curChatUserId);
        currentDiv.innerHTML = "";
    };



    var getObjectURL = function getObjectURL(file) {
        var url = null;
        if (window.createObjectURL != undefined) { // basic
            url = window.createObjectURL(file);
        } else if (window.URL != undefined) { // mozilla(firefox)
            url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) { // webkit or chrome
            url = window.webkitURL.createObjectURL(file);
        }
        return url;
    };
    var getLoacalTimeString = function getLoacalTimeString() {
        var date = new Date();
        var time = date.getHours() + ":" + date.getMinutes() + ":"
            + date.getSeconds();
        return time;
    }


    Easemob.im.EMOTIONS = {
        path: imgPath+'common/images/personalTailor/csad/faces/',
        map: {
            '[):]': 'ee_1.png',
            '[:D]': 'ee_2.png',
            '[;)]': 'ee_3.png',
            '[:-o]': 'ee_4.png',
            '[:p]': 'ee_5.png',
            '[(H)]': 'ee_6.png',
            '[:@]': 'ee_7.png',
            '[:s]': 'ee_8.png',
            '[:$]': 'ee_9.png',
            '[:(]': 'ee_10.png',
            '[:\'(]': 'ee_11.png',
            '[:|]': 'ee_12.png',
            '[(a)]': 'ee_13.png',
            '[8o|]': 'ee_14.png',
            '[8-|]': 'ee_15.png',
            '[+o(]': 'ee_16.png',
            '[<o)]': 'ee_17.png',
            '[|-)]': 'ee_18.png',
            '[*-)]': 'ee_19.png',
            '[:-#]': 'ee_20.png',
            '[:-*]': 'ee_21.png',
            '[^o)]': 'ee_22.png',
            '[8-)]': 'ee_23.png',
            '[(|)]': 'ee_24.png',
            '[(u)]': 'ee_25.png',
            '[(S)]': 'ee_26.png',
            '[(*)]': 'ee_27.png',
            '[(#)]': 'ee_28.png',
            '[(R)]': 'ee_29.png',
            '[({)]': 'ee_30.png',
            '[(})]': 'ee_31.png',
            '[(k)]': 'ee_32.png',
            '[(F)]': 'ee_33.png',
            '[(W)]': 'ee_34.png',
            '[(D)]': 'ee_35.png'
        }
    };

    //******************************聊天功能 结束


    //************************************h5 本地数据库
    initDatabase();
    function insertdbData(from,to,type,message,timestamp,secret,length){
        //执行sql脚本，插入数据
        var db = getCurrentDb();
        db.transaction(function (trans) {
            trans.executeSql("insert into chatRecord(from_id,to_id,chat_type,chat_content,chat_timestamp,chat_secret,chat_length) values(?,?,?,?,?,?,?) ", [from, to, type,message,timestamp,secret,length], function (ts, data) {
            }, function (ts, message) {
               // alert(message);
            });
        });
    }


    //显示所有数据库中的数据到页面上去
    function showDBTheData(from,to) {
        var db = getCurrentDb();
        db.transaction(function (trans) {
            trans.executeSql("select * from chatRecord where from_id=" +from+" and to_id="+to , [], function (ts, data) {
                if (data) {
                        alert('has data!');
                }
            }, function (ts, message) {
                //alert(message);var tst = message;
                });
        });
    }


    function initDatabase() {
        var db = getCurrentDb();//初始化数据库
        if (!db) {
            alert("您的浏览器不支持HTML5本地数据库");
            return;
        }
        db.transaction(function (trans) {//启动一个事务，并设置回调函数
            //执行创建表的Sql脚本
            trans.executeSql("create table if not exists chatRecord(from_id text null,to_id text null,chat_type text null,chat_content text null,chat_timestamp text null,chat_secret text null,chat_length text null)", [], function (trans, result) {
            }, function (trans, message) {//消息的回调函数alert(message);});
            }, function (trans, result) {
            }, function (trans, message) {
            });
        })
    }


    function getCurrentDb() {
        //打开数据库，或者直接连接数据库参数：数据库名称，版本，概述，大小
        //如果数据库不存在那么创建之
        var db = openDatabase("miku", "1.0", "it's to save Chat Record data!", 1024 * 1024 *1024);
        return db;
    }



})