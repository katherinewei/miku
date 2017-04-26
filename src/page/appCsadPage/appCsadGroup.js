/**
 * 分组信息
 * Created by xiuxiu on 2016/7/18.
 */
define('h5/js/page/appCsadGroup', [
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/page/csadUserTrajectory',
    'h5/js/page/appCsadCommon',
], function($,URL, Data,CsadUserTrajectory,CsadCommon) {

    // var Group = function(isFill){
    var wrapGroup,membersList;
    function init(isFill){
        wrapGroup = isFill ? $('#fillReportAndBox_Wrap') : $('#managementList_Wrap'); //membersList,
        // _setTime = setInterval(function ()
        // {
        //if(sessionStorage.getItem('membersListIM')){
        membersList = sessionStorage.getItem('membersListIM');
        membersList = JSON.parse(membersList);
        // console.log(membersList)
        //  clearInterval(_setTime);

        groups();
        bindEvent();
    }

    // }
    // },1000);

    //function init(){
    //
    //}


    function bindEvent(){
        wrapGroup
        //分组展开关闭
            .on('click','.groupListUl .title',function(){
                if(!$(this).find('.groupName').hasClass('disable') || $(this).parent().hasClass('subGroup')){
                    $(this).parent().toggleClass('hideGroupMember');

                    //($(this).parent().hasClass('hideGroupMember')) ? $(this).parent().removeClass('hideGroupMember') : $(this).parent().addClass('hideGroupMember')

                }

            })
            //双击到聊天
            .on('dblclick','.groupItem,.resultItem',function(){
                // CsadCommon.chooseContactDivClick(this);
                if($(this).find('input').length == 0 && !$('.leftNav li.fillReportAndBox').hasClass('active')){
                    var id = $(this).attr('id');
                    //URL.assign(URL.csadChatMessagePage+'?userId='+id+'&status=1&source=1');
                    //var sid = this.getAttribute('displayName');
                    CsadCommon.callToChat(id,false,id,true);
                }
            })
            //单击展开用户轨迹
            .on('click','.groupItem,.resultItem',function(){
                if($(this).find('input').length == 0){
                    var CurrentPage = $('#managementList_Wrap');
                    if($('.leftNav li.fillReportAndBox').hasClass('active')) {
                        CurrentPage = $('#fillReportAndBox_Wrap');
                    }
                    CurrentPage.find('.groupItem,.resultItem').removeClass('cur');
                    $(this).addClass('cur');
                    CurrentPage.find('#nullchater').hide();
                    CurrentPage.find('.rightCon').show();
                    var id = $(this).data('fuserid'),
                        csadId = $('#headerimg').attr('emuserid'),
                        wrapContainer = wrapGroup.find('#csadUserMessageContainer_'+id);
                    CurrentPage.find('.csadUserMessageContainer').hide();
                    if($('.leftNav li.fillReportAndBox').hasClass('active')) {     //展开分析报告
                        $('.fillReportIframe').hide();
                        var isNotReg = false;
                        if($(this).data('not-regist')){
                            isNotReg = true
                        }
                        var name = isNotReg ? $(this).find('i') : $(this).find('em'),
                            mobile = isNotReg ? '' : $(this).data('mobile');
                        if($('#fillReport'+id).length == 0){
                            CurrentPage.find('.rightCon').append('<iframe class="fillReportIframe" id="fillReport'+id+'" src="'+URL.questionnaireSurveyReportPage+'?id='+id+'&name='+name.text()+'&csadId='+csadId+'&mobile='+mobile+'&isTemp='+isNotReg+'&isNotReg='+isNotReg+'"></iframe>');
                        }

                        else{
                            $('#fillReport'+id).show();
                        }
                        //var isNotReg = false;
                        //if($(this).data('not-regist')){
                        //    isNotReg = true;
                        //    if(wrapContainer.length == 0){
                        //        $('#fillReportAndBox_Wrap .rightCon').append('<div class="csadUserMessageContainer" id="csadUserMessageContainer_'+id+'"><h3 style="margin:10px;font-size: 20px;">诊断分析报告</h3><div class="containerQuestion"></div></div>')
                        //    }
                        //    else{
                        //        wrapContainer.show();
                        //    }
                        //}else{
                        //    CsadUserMessage('.rightCon', id, wrapGroup);
                        //}
                        //if(wrapGroup.find('#csadUserMessageContainer_'+id).find('.containerQuestion').children().length == 0){
                        //    var obg = isNotReg ? $(this).find('i') : $(this).find('em'),
                        //        mobile = isNotReg ? '' : $(this).data('mobile');
                        //    csadQuestionnaireSurveyPage(id,'',obg.text(),mobile,$('#headerimg').attr('emuserid'),isNotReg,'',isNotReg);
                        //}
                        //else{
                        //    wrapGroup.find('#csadUserMessageContainer_'+id).show();
                        //}
                    }
                    else{

                        var conLayout;
                        if(CurrentPage.find('#csadUserMessageContainer_'+id).length == 0){
                            CurrentPage.find('.rightCon').append('<div class="csadUserMessageContainer" id="csadUserMessageContainer_'+id+'"><div class="containerUserTrajectory"></div></div>');
                            conLayout = wrapGroup.find('#csadUserMessageContainer_'+id);
                            conLayout.removeClass('hide');
                            var con = conLayout.find('.containerUserTrajectory');
                            var tpm=CsadUserTrajectory.csadUserTrajectoryHtml();
                            con.html(tpm);
                            CsadUserTrajectory.initUserTrajectory(id.toString(),wrapGroup,'',true);
                        }else{
                            CurrentPage.find('#csadUserMessageContainer_'+id).show();
                        }
                    }
                }
            })

            //分组的操作
            //添加分组
            .on('click','.addGroupBtn',function(){
                wrapGroup.find('.title').removeClass('currentItem');
                wrapGroup.find('.groupsContent ul').append('<li class="groupList hideGroupMember"><div class="title currentItem"><span class="groupName"></span><span class="number hide">0</span></div><div class="groupMember"></div> </li>');
                wrapGroup.find('.groupList').last().find('.groupName').html('<input value="未命名" name="groupName" />').addClass('disable');
                wrapGroup.find('input[name=groupName]').select();
            })

            //编辑分组
            .on('click','.editGroupBtn',function(){
                var target = wrapGroup.find('.groupsContent .currentItem'),
                    groupName = target.find('.groupName').text();
                target.find('.number').addClass('hide');
                target.find('.groupName').html('<input value="'+groupName+'" name="groupName" />').addClass('disable');
                wrapGroup.find('input[name=groupName]').select();
            })
            .on('blur','input[name=groupName]',function(){
                var target = wrapGroup.find('.groupsContent .currentItem').parents('li'),
                    groupName = $(this).val(),
                    groupid = target.data('id') ? target.data('id') : '';
                target.find('.groupName').html(groupName).removeClass('disable');
                target.find('.number').removeClass('hide');
                editOrAddGroup(groupid,target.find('.groupName'),target);
            })
            //删除分组
            .on('click','.deleteGroupBtn',function(){
                var target = wrapGroup.find('.groupsContent .currentItem').parents('li');
                deleteGroup(target);
            })

            //修改好友备注
            .on('click','.editMemberBtn',function(){
                var target = wrapGroup.find('.currentItem'),
                    userNote = target.find('em').text(),
                    nickName = target.find('i').length > 0 ? target.find('i').text() : userNote;
                target.find('img').addClass('hide');


                target.find('span').html('<input value="'+userNote+'" name="memberName" />').addClass('disable').attr('data-nickname',nickName);
                $('input[name=memberName]').select();
            })
            .on('blur','input[name=memberName]',function(){
                var target = wrapGroup.find('.currentItem'),
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
            //搜索
            .on('keyup','#kw',function(){
                getContent('#kw');
            })
            .on('click','.icon-search',function(){
                getContent('#kw');
            })

            //刷新成员列表
            .on('click','.refreshGroupBtn',function(){
                //if($('.leftNav li.fillReportAndBox').hasClass('active')) {     //展开分析报告
                groups(true);
                // }
            })

            //下一页
            .on('click','.nextBtn',function(){
                var pg = parseInt($(this).attr('data-pg')) + 1;
                getWechatUser(pg);
            })

        //将好友放入分组内
        $('body').delegate('.groupItemLi','click',function(){
            var currentItem = wrapGroup.find('.currentItem'),
                groupId = $(this).data('id'),
                fUserId = currentItem.data('fuserid'),
                data = {
                    groupId:groupId,
                    fUserId:fUserId
                }
            Data.changeFriendsGroupMap(data).done(function(){
                wrapGroup.find('.groupList').each(function(){
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
                //$('.groupItem')[0].oncontextmenu = function() {
                ////$('.groupItem').contextmenu(function() {
                //    var oMenu2 = document.getElementById("rightMenu2");
                //    var oMenu = document.getElementById("rightMenu");
                //    $('.title').removeClass('currentItem');
                //    $('.groupItem').removeClass('currentItem');
                //    $(this).addClass('currentItem');
                //    contextMenu(oMenu2);
                //    oMenu.style.display = "none";
                //    $('.editMemberBtn').removeClass('hide') ;
                //
                //    return false;
                //}
            })

        })
    }

    //搜索
    function getContent(obj){
        var kw = $.trim($(obj).val());
        if(kw == ""){
            wrapGroup.find("#append").hide().html("");
            return false;
        }
        var html = "";
        Data.getGroupAndFriendsList().done(function(res) {
            if (res.list.length > 0) {
                membersList = res.list;
                $.each(membersList,function(i,item){
                    $.each(item.friendsGroupMapList,function(j,memberItem){
                        if (memberItem.profileName && memberItem.profileName.indexOf(kw) >= 0 || memberItem.userName && memberItem.userName.indexOf(kw) >= 0) {
                            var headPic = memberItem.profilePic ? memberItem.profilePic : 'http://mikumine.b0.upaiyun.com/common/images/avatar-small.png',
                                _userName = memberItem.userName ? memberItem.userName + '(<i>'+memberItem.profileName+'</i>)' : memberItem.profileName;
                            html = html +  '<div class="resultItem row" data-groupid="'+item.id+'" data-id="'+memberItem.emUserName+'" id="'+memberItem.emUserName+'" type="chat" displayname="'+memberItem.emUserName+'" data-fuserid="'+memberItem.fUserId+'"><div class="headPic '+memberItem.emUserName+'_imgUrl"><img src="'+headPic+'"/></div><div class="col col-15"><p>'+_userName+'</p><p>来自分组：'+item.name+'</p></div> </div>'
                        }
                    })
                })
                if(html != ""){
                    wrapGroup.find("#append").show().html('<p class="search_result_tit">搜索结果</p>'+html);
                }else{
                    wrapGroup.find("#append").hide().html("");
                }
            }
        })
    }

    //************结束搜索

    //分组
    function groups(isfresh){
        var isfillReportAndBox = false,notRegist = '';
        if( $('.leftNav li.fillReportAndBox').hasClass('active')){
            isfillReportAndBox = true;
            notRegist = '<li class=" subGroup hideGroupMember"><div class="title">未注册用户</div><ul class="groupListU unResiGroupList groupMember"><li><dl></dl></li></ul></li>'
        }
        if(!isfresh){
            wrapGroup.append('<div class="row" style="height: 100%;"> <div class="groupsContent" id="container"><div class="search-wrap"><div class="row search-box"><div class="icon-search search-submit"></div><div class="input-wrap"><input type="text" class="search-input" id="kw" placeholder="搜索"></div></div><div class="icon-wrap" ><i class="icon-refresh refreshGroupBtn" title="刷新"></i></div></div><div id="append" class="grid hide"></div><ul class="groupListUl">'+notRegist+'<li class="subGroup hideGroupMember"><div class="title">注册用户</div><ul class="groupListU groupMember resiGroupList "></ul> </li></ul> </div><div id="nullchater" class="col">暂无对话消息~</div><div class="rightCon col hide"></div></div>');
        }
        if($('#rightMenu').length == 0){
            $('body').append('<div id="rightMenu" class="rightMenu"><ul><li class="addGroupBtn">添加分组</li><li class="deleteGroupBtn"> 删除分组</li><li class="editGroupBtn"> 修改分组</li></ul></div><div id="rightMenu2" class="rightMenu"><ul><!--<li class="deleteMemberBtn"> 删除好友</li>--><li class="editMemberBtn"> 修改好友备注</li><li class="moveMemberBtn"> 将好友移动到<ul class="allGroup"></ul></li></ul></div>');
            Data.getMikuFriendsGroupList().done(function(res){
                var allGroupTpl = '<li data-id="{{id}}" class="groupItemLi">{{name}}</li>',
                    html = [];
                $.each(res.list,function(index,item){
                    html.push(bainx.tpl(allGroupTpl,item));
                })
                $('#rightMenu2').find('.allGroup').html(html.join(''));
            })
        }
        var template = '<li class="groupList hideGroupMember" data-id="{{id}} "><div class="title"><span class="groupName">{{name}}</span><span class="number">{{count}}</span></div><div class="groupMember">{{dlHtml}}</div> </li>',
            liHtmls = [];
        if(isfresh){
            Data.getGroupAndFriendsList().done(function(res){
                var list = res.list;

                if(list.length > 0) {
                    membersList = list;

                    sessionStorage.setItem('membersListIM',JSON.stringify(list));
                }
            })
        }


        //
        if(isfillReportAndBox){
            getWechatUser(0);
        }

        $.each(membersList,function(index,item){
            var templateContent = '<dd class="groupItem" data-groupid="{{groupId}}" data-id="{{id}}" id="{{emUserName}}" data-mobile="{{mobile}}" type="chat" displayname="{{emUserName}}" data-fuserid="{{fUserId}}"><img class="{{emUserName}}_imgUrl" src="{{profilePic}}" /><span class="ellipsis">{{name}}</span></dd>',
                dlHtml = [];
            $.each(item.friendsGroupMapList,function(index,dlitem){
                dlitem.profilePic = dlitem.profilePic ? dlitem.profilePic : imgPath+'common/images/avatar-small.png';
                dlitem.name = dlitem.userName ? '<em>'+dlitem.userName + '</em>(<i>'+dlitem.profileName+'</i>)' : '<em>'+dlitem.profileName+ '</em>';
                dlHtml.push(bainx.tpl(templateContent,dlitem));
            })
            item.dlHtml = dlHtml.length > 0 ? '<dl>'+dlHtml.join('')+'</dl>' : '';
            item.count = item.friendsGroupMapList.length;
            liHtmls.push(bainx.tpl(template,item));
        });

        wrapGroup = isfillReportAndBox ? $('#fillReportAndBox_Wrap') : $('#managementList_Wrap');

        wrapGroup.find('.groupsContent ul .resiGroupList').find('li').remove();
        wrapGroup.find('.groupsContent ul .resiGroupList').append(liHtmls.join(''));

        //   }

        defineContext();
        //  })

    }

    //获取微信用户
    function getWechatUser(pg){
        var data = {
            pg:pg,
            sz:10
        }
        Data.getProfileWechatList(data).done(function(res){
            var list = res.list;
            var templateContent = '<dd class="groupItem" data-id="{{unionId}}" id="{{unionId}}" data-fuserid="{{unionId}}" data-not-regist="true" ><img class="{{unionId}}_imgUrl" src="{{profilePic}}"  /><span class="ellipsis"><i>{{name}}</i></span></dd>',
                dlHtml = [];
            $.each(list,function(index,dlitem){
                dlitem.profilePic = dlitem.headimgurl ? dlitem.headimgurl : imgPath+'common/images/avatar-small.png';
                dlitem.name = dlitem.nickname ? dlitem.nickname : '未知用户';
                dlHtml.push(bainx.tpl(templateContent,dlitem));
            })
            var next = '';
            if(res.hasNext){
                next = '<span class="nextBtn" data-pg="'+data.pg+'">下一页</span>';
            }
            if(data.pg == 0){
                wrapGroup.find('.unResiGroupList dl').html(dlHtml.join('')+next);
            }
            else{
                wrapGroup.find('.unResiGroupList dl .nextBtn').attr('data-pg',data.pg).before(dlHtml.join(''));
                //wrapGroup.find('.unResiGroupList dl').append(dlHtml.join('')+next);
                if(!res.hasNext){
                    wrapGroup.find('.unResiGroupList dl .nextBtn').hide();
                }
            }

        });

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
        //$('.title').contextmenu(function() {
        wrapGroup.find(".groupList").delegate(".title", "contextmenu", function ()
        {
            wrapGroup.find('.title').removeClass('currentItem');
            wrapGroup.find('.groupItem').removeClass('currentItem');
            $(this).addClass('currentItem');
            contextMenu(oMenu,aUl);
            if($(this).parent().data('id') == -1){
                wrapGroup.find('.deleteGroupBtn').addClass('hide');
                wrapGroup.find('.editGroupBtn').addClass('hide');
            }else{
                wrapGroup.find('.deleteGroupBtn').removeClass('hide');
                wrapGroup.find('.editGroupBtn').removeClass('hide');
            }
            oMenu2.style.display = "none";
            return false;
        });
        //$('.title').contextmenu(function() {
        //
        //})
        wrapGroup.find(".groupListUl").delegate(".groupItem", "contextmenu", function (){

            // $('.groupItem').contextmenu(function() {
            wrapGroup.find('.title').removeClass('currentItem');
            wrapGroup.find('.groupItem').removeClass('currentItem');
            $(this).addClass('currentItem');
            contextMenu(oMenu2);
            var editMemberB = $('.editMemberBtn');
            if(!$(this).data('groupid')){
                editMemberB.addClass('hide');
            }else{
                editMemberB.removeClass('hide') ;
            }

            oMenu.style.display = "none";
            return false;
        })
        //点击隐藏菜单
        //document.onclick = function ()
        //{
        //    oMenu.style.display = "none";
        //    oMenu2.style.display = "none";
        //    $('.pop_rment').hide();//用户标签
        //    $('.opareReply').addClass('hide');//快捷回复
        //};
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
                        oUl[0].style.top = oThis.offsetTop + "px";
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
        oMenu.style.top = event.clientY + "px";
        oMenu.style.left = event.clientX + "px";

        //setWidth(aUl[0]);

        //最大显示范围
        maxWidth = aDoc[0] - oMenu.offsetWidth;
        maxHeight = aDoc[1] - oMenu.offsetHeight;

        //防止菜单溢出
        oMenu.offsetTop > maxHeight && (oMenu.style.top = maxHeight + "px");
        oMenu.offsetLeft > maxWidth && (oMenu.style.left = maxWidth + "px");
        //return false;
    }

    //编辑分组


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
                target.attr('data-id',vo.id);
                $('#rightMenu2').find('.allGroup').append('<li data-id="'+vo.id+'" class="groupItemLi">'+vo.name+'</li>');
            }else{
                $('#rightMenu2').find('.allGroup li').each(function(){
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
                $('#rightMenu2').find('.allGroup li').each(function(){
                    if($(this).data('id') == groupid){
                        $(this).remove();
                    }
                })
            })
        }else{
            bainx.broadcast('该组内还有成员不能删除哦~');
        }

    }


    //  init();

    // }
    return {
        group:init,
        groups:groups
    };

})