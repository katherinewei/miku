/**
 * 分组信息
 * Created by xiuxiu on 2016/7/18.
 */
define('h5/js/page/csadGroup', [
    'gallery/jquery/2.1.1/jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/page/csadUserTrajectory',
    //'h5/js/page/csadCommon',
    //'h5/js/common/nexter',
    //'h5/css/page/csadCssZy'
], function($,URL, Data,Nexter) {

   // var Group = function(isFill){
    var wrapGroup,membersList,noPhoto = imgPath+'common/images/avatar9.png',time = null;
        function init(){
             wrapGroup = $('#managementList_Wrap');
            groups();
            bindEvent();
        }
        function bindEvent(){
            $('body')
            //添加新 && 编辑用户
                .on('click','.icon-add,.edit',function(e){
                    if (e && e.stopPropagation) {//非IE浏览器
                        e.stopPropagation();
                    }
                    else {//IE浏览器
                        window.event.cancelBubble = true;
                    }


                    var nick = '',
                        dataid = '',
                        wxno = '',
                        $this = $(this).parent();
                    if($(this).hasClass('edit')){
                        nick = $this.find('i').text();
                        wxno = $this.attr('data-wxno');
                        dataid = 'data-id="'+$this.data('id')+'"';
                        $('.groupListUl').find('dd').removeClass('curEdit');
                        $this.addClass('curEdit');
                    }
                    var addNewUser = $('#addNewUser');
                    if(addNewUser.length == 0){
                        $('body').append('<div id="addNewUser" class=" grid addReplySentense" '+dataid+'><div class="pop_box"><div class="add_con"><input type="text" class="wechatNickname" value="'+nick+'" placeholder="输入用户昵称"><input type="text" placeholder="输入用户微信号" value="'+wxno+'" class="wechatNO"></div><div class="pop_btn row fvc fac"><div class="col cancelBtn addNewUserBtn">取消</div><div class="confirmBtn  col addNewUserBtn">确定</div></div></div></div>');
                    }
                    else{
                        addNewUser.show().find('input').each(function(){
                            $(this).val('');
                        })
                        if($(this).hasClass('edit')){
                            addNewUser.find('.wechatNickname').val(nick);
                            addNewUser.find('.wechatNO').val(wxno);
                            addNewUser.attr('data-id',$this.data('id'));
                        }
                        else{
                            addNewUser.removeAttr('data-id');
                        }
                    }
                })
            //分组展开关闭
                .on('click','.groupListUl .title',function(){
                    if(!$(this).find('.groupName').hasClass('disable') || $(this).parent().hasClass('subGroup')){
                        $(this).parent().toggleClass('hideGroupMember').siblings().addClass('hideGroupMember');
                    }
                })
                .on('dblclick','.groupItem,.resultItem',function(){
                    if($(this).parents('.groupMember').hasClass('resiGroupList')){
                             return false;
                    }
                    clearTimeout(time);
                    $('.showUserQR').hide();
                    var id = $(this).data('id'),obj = $('#showUserQR'+id);
                    if(obj.length == 0){
                        var data = {
                            type:1,//临时=1, 永久=2
                            scene:id
                        }
                        Data.getWxMpQrCodeTicket(data).done(function(res){
                            $('body').append('<div class="showUserQR" id="showUserQR'+id+'"><section><img src="https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket='+res.ticket.ticket+'" /></section> </div>');
                        })
                    }
                    else{
                        obj.show();
                    }
                })
                //单击展开用户轨迹
                .on('click','.groupItem,.resultItem',function(e){
                    e.stopPropagation();
                    var $this = $(this);
                        clearTimeout(time);
                        time =  setTimeout(function(){
                           var CurrentPage = $('#managementList_Wrap');

                           CurrentPage.find('.groupItem,.resultItem').removeClass('cur');
                            $this.addClass('cur');
                           CurrentPage.find('#nullchater').hide();
                           CurrentPage.find('.rightCon').show();
                           var id = $this.data('fuserid'),
                               csadId = pageConfig.pid,
                               wrapContainer = wrapGroup.find('#csadUserMessageContainer_'+id);
                           CurrentPage.find('.csadUserMessageContainer').hide();
                           //if($('.leftNav li.fillReportAndBox').hasClass('active')) {     //展开分析报告
                           $('.fillReportIframe').hide();
                           var isNotReg = false;
                           if($this.data('not-regist')){
                               isNotReg = true
                           }
                           var name = $this.find('i');
                           //if($('#fillReport'+id).length == 0){
                            $('#fillReport'+id).remove();
                               CurrentPage.find('.rightCon').append('<iframe class="fillReportIframe" id="fillReport'+id+'" src="'+URL.questionnaireSurveyReportPage+'?id='+id+'&name='+name.text()+'&csadId='+csadId+'&isTemp=false&isNotReg=false"></iframe>');
                           //}
                           //
                           //else{
                           //    $('#fillReport'+id).show();
                           //}

                       },300)

                })

                //搜索
                .on('keyup','#kw',function(e){
                    var kw = $.trim($('#kw').val());
                    if(kw == ""){
                        wrapGroup.find("#append").hide().find('dl').html("");
                        return false;
                    }
                    if(e.keyCode == 13){
                        getContent('#kw');
                    }
                })
                .on('click','.icon-search',function(){
                    getContent('#kw');
                })

                //刷新成员列表
                .on('click','.refreshGroupBtn',function(){
                        groups(true);
                })

                //下一页
                .on('click','.nextBtn',function(){
                    var pg = parseInt($(this).attr('data-pg')) + 1,
                        isBind = $(this).attr('data-wxbinded');
                    getWechatUser(isBind,pg);
                })




            //确定&取消操作
                .on('click','.addNewUserBtn',function(){

                    if($(this).hasClass('confirmBtn')){
                        //帮助用户注册的。。
                        var data = {
                            nickname: $.trim($('.wechatNickname').val()),
                            wxno:$.trim($('.wechatNO').val())
                        }
                        if(!data.nickname){
                            bainx.broadcast('请输入昵称');
                            return false
                        }
                        if(!data.wxno){
                            bainx.broadcast('请输入微信号');
                            return false
                        }
                        var $id = $('#addNewUser').attr('data-id');
                        if($id){
                            data.id = $id;
                        }
                        Data.addOrUpdateUserByExpert(data).done(function(res){
                            $('#addNewUser').hide().removeAttr('data-id');
                            if($id){
                                bainx.broadcast('编辑成功！');
                                $('.curEdit').attr('data-wxno',data.wxno).find('i').text(data.nickname);
                            }
                            else{
                                bainx.broadcast('添加成功！');
                                var numC = $('.newUserList').find('.title b');
                                numC.text(parseInt(numC.text() ? numC.text() : 0)+1).show();
                                //var countC = $('.managementList .badgegroup');
                                //if(countC.length == 0){
                                //    $('.managementList').append('<span class="badgegroup">1</span>');
                                //}
                                //else{
                                //    countC.text(parseInt(countC.text())+1);
                                //}
                                var vo = res.vo;
                                $('.unResiGroupList dl').prepend('<dd class="groupItem"  data-fuserid="'+vo.id+'" data-wxno="'+vo.wxno+'" data-id="'+vo.id+'"><img  src="'+noPhoto+'" /><span class="ellipsis"><i>'+vo.nickname+'</i></span><em class="edit"></em></dd>');
                            }
                        })
                    }
                    else{
                        $('#addNewUser').hide();
                    }
                })

            $('.groupMember').scroll(function(){
                var _this=$(this);
                var viewH=_this.height(),
                    contentH =_this.get(0).scrollHeight,
                    scrollTop = _this.scrollTop();
                if(scrollTop + viewH == contentH){
                    if($(this).attr('data-hasnext') == 'true'){
                        var pg = parseInt($(this).attr('data-pg')) + 1,
                            isBind = $(this).attr('data-wxbinded');
                        getWechatUser(isBind,pg);
                    }
                }
            });

        }
        function newUserTipNum(){

        }
        //搜索
        function getContent(obj){
            var kw = $.trim($(obj).val());
            if(kw == ""){
                wrapGroup.find("#append").hide().find('dl').html("");
                return false;
            }
            var html = "";
            getWechatUser(2,'',kw);
            //Data.getProfileWechatVOList().done(function(res) {
            //    if (res.list.length > 0) {
            //        membersList = res.list;
            //        $.each(membersList,function(i,item){
            //            $.each(item.friendsGroupMapList,function(j,memberItem){
            //                if (memberItem.profileName && memberItem.profileName.indexOf(kw) >= 0 || memberItem.userName && memberItem.userName.indexOf(kw) >= 0) {
            //                    var headPic = memberItem.profilePic ? memberItem.profilePic : 'http://mikumine.b0.upaiyun.com/common/images/avatar-small.png',
            //                        _userName = memberItem.userName ? memberItem.userName + '(<i>'+memberItem.profileName+'</i>)' : memberItem.profileName;
            //                    html = html +  '<div class="resultItem row" data-groupid="'+item.id+'" data-id="'+memberItem.emUserName+'" id="'+memberItem.emUserName+'" type="chat" displayname="'+memberItem.emUserName+'" data-fuserid="'+memberItem.fUserId+'"><div class="headPic '+memberItem.emUserName+'_imgUrl"><img src="'+headPic+'"/></div><div class="col col-15 fb fvc"><p>'+_userName+'</p><!--<p>来自分组：'+item.name+'</p>--></div> </div>'
            //                }
            //            })
            //        })
            //        if(html != ""){
            //            wrapGroup.find("#append").show().html('<p class="search_result_tit">搜索结果</p>'+html);
            //        }else{
            //            wrapGroup.find("#append").hide().html("");
            //        }
            //    }
            //})
        }
        //************结束搜索

        //分组
        function groups(isfresh){
            if(!isfresh){
                wrapGroup.append('<div class="row" style="height: 100%;"> <div class="groupsContent" id="container"><div class="search-wrap"><div class="row search-box"><div class="icon-search search-submit"></div><div class="input-wrap"><input type="text" class="search-input" id="kw" placeholder="搜索"></div></div><div class="icon-wrap" ><i class="icon-add" title="添加新用户"></i><i class="icon-refresh refreshGroupBtn" title="刷新"></i></div></div><div id="append" class="grid hide"><p class="search_result_tit">搜索结果</p><dl></dl></div><ul class="groupListUl"><li class="newUserList subGroup hideGroupMember"><div class="title">新用户<b class="number"></b></div><ul class="groupListU unResiGroupList groupMember"><li><dl></dl></li></ul></li><li class="subGroup hideGroupMember"><div class="title">已识别用户<b class="number"></b></div><ul class="groupListU groupMember resiGroupList "><li><dl></dl></li></ul> </li></ul></div><div id="nullchater" class="col"></div><div class="rightCon col hide" style="height: 100%;"></div></div>');
            }
            getWechatUser(0,'0');//获取
            getWechatUser(1,'0');

            var getHeight = $('.groupsContent').height() - 100 - 54 * 2;
            $('.groupsContent').find('.groupMember').css('height',getHeight);
            //var template = '<div class="groupMember">{{dlHtml}}</div>',
            //    liHtmls = [];
            //    Data.getProfileWechatVOList().done(function(res){
            //        var list = res.list;
            //
            //        if(list.length > 0) {
            //            membersList = list;
            //            $.each(membersList,function(index,item){
            //                var templateContent = '<dd class="groupItem" data-groupid="{{groupId}}" data-id="{{id}}" id="{{emUserName}}" data-mobile="{{mobile}}" type="chat" displayname="{{emUserName}}" data-fuserid="{{fUserId}}"><img class="{{emUserName}}_imgUrl" src="{{profilePic}}" /><span class="ellipsis">{{name}}</span></dd>',
            //                    dlHtml = [];
            //                $.each(item.friendsGroupMapList,function(index,dlitem){
            //                    dlitem.profilePic = dlitem.profilePic ? dlitem.profilePic : imgPath+'common/images/avatar-small.png';
            //                    dlitem.name = dlitem.userName ? '<em>'+dlitem.userName + '</em>(<i>'+dlitem.profileName+'</i>)' : '<em>'+dlitem.profileName+ '</em>';
            //                    dlHtml.push(bainx.tpl(templateContent,dlitem));
            //                })
            //                item.dlHtml = dlHtml.length > 0 ? '<dl>'+dlHtml.join('')+'</dl>' : '';
            //                liHtmls.push(bainx.tpl(template,item));
            //            });
            //            wrapGroup.find('.groupsContent ul .resiGroupList').find('li').remove();
            //            wrapGroup.find('.groupsContent ul .resiGroupList').append(liHtmls.join(''));
            //         }
            //    })
            //    getWechatUser(0);
        }

    //获取微信用户
    function getWechatUser(isWxBinding,pg,nicknameOrWxno,nickname,wxno){
        var data = {
            isMineUser:1,//是否我的用户(0=全部;1=我的用户)默认0
            isWxBinding:isWxBinding,//是否绑定微信:0=未绑定;1=绑定;2=全部; 不是必须),
            sz : 15
        },
            currentDiv = isWxBinding == 0 ? $('.unResiGroupList') : isWxBinding == 1 ? $('.resiGroupList'): $('#append');
        if(pg){//分页
            data.pg = pg;

        }
        if(nicknameOrWxno){     //昵称或微信号
            data.nicknameOrWxno = nicknameOrWxno;
        }
        if(nickname){//昵称
            data.nickname = nickname;
        }
        if(wxno){//微信号
            data.wxno = wxno;
        }
        Data.getProfileWechatVOList(data).done(function(res){
                var list = res.list,tip = '';
                if(isWxBinding == 0){
                    tip = '双击获取二维码';
                }

                var templateContent = '<dd class="groupItem" data-wxno="{{wxno}}" data-id="{{id}}" id="{{id}}" data-fuserid="{{id}}" title="'+tip+'"><img  src="{{profilePic}}"  /><span class="ellipsis"><i>{{name}}</i></span><em class="edit"></em></dd>',
                    dlHtml = [];
                $.each(list,function(index,dlitem){
                    dlitem.profilePic = dlitem.profilePic ? dlitem.profilePic : noPhoto;
                    dlitem.name = dlitem.nickname ? dlitem.nickname : '未知用户';
                    dlHtml.push(bainx.tpl(templateContent,dlitem));
                })
                var next = '';
                currentDiv.attr({
                    'data-hasnext':res.hasNext
                })
                if(res.hasNext){
                    currentDiv.attr({
                        'data-wxbinded':isWxBinding,
                        'data-pg':pg,
                    });
                    next = '<span class="nextBtn" data-wxbinded="'+isWxBinding+'" data-pg="'+pg+'">下一页</span>';
                }

                //
                if(data.pg == 0 || !data.pg){
                    if(isWxBinding == 2){       //搜索
                        currentDiv.show();
                    }
                    else{
                        if(list.length > 0){
                            currentDiv.prev().find('b').text(res.count).show();
                            if(isWxBinding == 0){
                                //var countC = $('.managementList .badgegroup');
                                //if(countC.length == 0){
                                //    $('.managementList').append('<span class="badgegroup">'+res.count+'</span>');
                                //}
                                //else{
                                //    countC.text(res.count);
                                //}

                            }
                        }
                        else{
                            currentDiv.prev().find('b').hide();
                           // $('.managementList .badgegroup').remove();
                        }
                    }
                    currentDiv.find('dl').html(dlHtml.join('')+next);

                    //return dlHtml.join('')+next;
                }
                //点击下一页
                else{
                    currentDiv.find('.nextBtn').attr('data-pg',data.pg).before(dlHtml.join(''));
                    if(!res.hasNext){
                        currentDiv.find('.nextBtn').hide();
                    }
                }

            });

    }


    return {
        group:init,
        groups:groups
    };

})