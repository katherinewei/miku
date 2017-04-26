/**
 * Created by Spades-k on 2016/7/22.
 */
define('h5/js/page/csadAddNotes',[
    'jquery',
    'h5/js/common/data',
    'h5/css/page/csadCssZy.css'
], function ($, Data) {
    //var userId=URL.param.userId;
    var outer;
    function initAddNotes(userId){
        if($('.leftNav .chatMessage').hasClass('active')){
            outer = $('#chatMessage_Wrap');
        }
        if($('.leftNav .payVisit').hasClass('active')){
            outer = $('#payVisit_Wrap');
        }

        Events(userId);
        if($('.leftNav .chatMessage').hasClass('active') || $('.leftNav .payVisit').hasClass('active')){
            getNotes(userId);//输出便签//聊天列表
        }
        else{
            getNotes1(userId);//输出便签头像处//呼叫中心
        }
    }


    function csadAddNotesHtml(userId,isTemp){//呼叫中心
        var template;
        if(isTemp){
            template='<section class="addnotesContent"><div class="notes_box clearfix"><div class="t_name" id="userNameNote" ></div><p class="loginE">该用户来自<span id ="loginEntrance"></span></p></div></section>';
        }
        else {
            template = '<section class="addnotesContent"><div class="notes_box clearfix"><div class="people_msg row fvc fl"></div><div class="notes row fvc fl"><div class="notes_con clearfixc"></div><div class="notes_add"><p>添加</p></div></div></div><div class="pop_rment"><ul><li class="d_r tc">删除</li><li class="c_r tc">修改</li></ul></div></section>';
            getUserMsg1(userId);
        }
        return template;
    }

    //获取用户信息
    function getUserMsg1(userId){
        var html=[],
            data={
                userId:userId
            }
        Data.mineInfo(data).done(function(res) {
            var template='<div class="pic"><img src="{{headPic}}"></div><div class="name"><p id="userNameNote" data-mobile="{{mobile}}" data-nickName="{{nickName}}">{{noteName}}</p></div><div class="time"><p><span class="time_title">注&nbsp;&nbsp;册&nbsp;&nbsp;&nbsp;时&nbsp;&nbsp;&nbsp;间：</span><span class="time_data">{{datacreated}}</span></p><!--<p><span class="time_title">最新登陆时间：</span><span class="time_data">2016-03-09</span></p>--></div>';
            res.datacreated=bainx.formatDate('Y-m-d', new Date(res.dateCreated));
            res.noteName = $('.currentWin .message_main_item span').text();
            html.push(bainx.tpl(template,res));
            $('#callCenter_Wrap').find('#csadUserMessageContainer_'+userId).find('.people_msg').append(html.join(''));
            // $('.people_msg').append(html.join(''));
        })
    }

    function csadAddNotesHtml2(userId,isTemp){//聊天页面
        var template;
        if(isTemp){
            template='<section class="addnotesContent2 isTempNote"><div class="n_con"><div class="n_conleft"><div class="notes_box clearfix row fvc"><div class="t_name" id="userNameNote" ></div><p class="loginE">该用户来自<span id ="loginEntrance"></span></p></div></div><div class="close_page" id="closeChatWindow"></div><div class="close_btn" id="ext">结束对话</div></div></section>';
        }
        else{
            template='<section class="addnotesContent2"><div class="n_con"><div class="n_conleft"><div class="notes_box clearfix row fvc"><div class="notes_list clearfix fl"></div><div class="notes_add fl"><p>添加</p></div></div></div><div class="close_page" id="closeChatWindow"></div><div class="close_btn" id="ext">结束对话</div></div><div class="pop_rment"><ul><li class="d_r tc">删除</li><li class="c_r tc">修改</li></ul></div></section>';
            getUserMsg(userId);//输出用户信息
        }

        return template;
    }

    //获取用户信息
    function getUserMsg(userId){
        var html=[],
            data={
                userId:userId
            }
        Data.mineInfo(data).done(function(res) {
            var template='<div class="t_name" id="userNameNote" data-mobile="{{mobile}}" data-nickName="{{nickName}}">{{noteName}}</div><div class="time_l clearfix"><p class="fl"><span class="time_title">注&nbsp;&nbsp;册&nbsp;&nbsp;&nbsp;时&nbsp;&nbsp;&nbsp;间：</span><span class="time_data">{{datacreated}}</span></p><!--<p class="fl"><span class="time_title">最新登陆时间：</span><span class="time_data">2016-03-09</span></p>--></div>';
            res.datacreated=bainx.formatDate('Y-m-d', new Date(res.dateCreated));
            res.noteName = $('.currentWin .message_main_item span').text();
            html.push(bainx.tpl(template,res));
            // if($('.t_name').length == 0){
            outer.find('.notes_box').before(html.join(''));
            //}else{
            //    $('.n_con .t_name').text(res.nickName);
            //    $('.n_con .time_data').text(res.datacreated);
            //}

        })
    }

    //获取便签
    function getNotes(userId){
        var data={
                userId:userId
            },
            html=[];
        Data.selectoneUserTags(data).done(function(res) {
            if(res.info){
                var template='<p class="fl" data-id="{{id}}">#{{info}}</p>';
                $.each(JSON.parse(res.info),function(index,item){
                    html.push(bainx.tpl(template,item));
                });
                // if($('.notes_list p').length == 0){
                outer.find('.notes_list').html(html.join(''));
                //}else{

                // }

            }
        })
    }

    //获取便签有头像处
    function getNotes1(userId){
        var data={
                userId:userId
            },
            html=[];
        Data.selectoneUserTags(data).done(function(res) {
            if(res.info){
                var template='<p class="fl" data-id="{{id}}">#{{info}}</p>';
                $.each(JSON.parse(res.info),function(index,item){
                    html.push(bainx.tpl(template,item));
                });
                $('#callCenter_Wrap').find('#csadUserMessageContainer_'+userId).find('.notes_con').append(html.join(''));
            }
        })
    }

    function pop(){
        var temple='<div class="pop_add hide"><div class="pop_box"><div class="add_con"><input type="text" placeholder="输入标签"><p>请输入最多20个字</p></div><div class="pop_btn row fvc fac"><div class="cancel col">取消</div><div id="confirmid" class="confirm col">确定</div></div></div></div>';
        return temple;
    }


    function Events(userId){
        $('.addNotes')[0].oncontextmenu = function(e){
            e.preventDefault();
        };

        //$('body').click(function(){
        //    $('.pop_rment').hide();
        //})

        $('.addnotesContent2').on('click','.notes_add p',function(){
            $('.pop_add').show();
            $('#confirmid').attr('class','confirm col');
        }).on('click','.cancel',function(){
            $('.pop_add').hide();
            $('.add_con input').val('');
        }).on('click','.confirm',function(){
            var tag= $('.add_con input').val();
            if(tag.length>20){
                bainx.broadcast('最多输入20个字！');
                return;
            }
            if(!tag){
                bainx.broadcast('请输入标签！');
                return;
            }
            var data={
                userId:userId,
                tag:tag
            }
            Data.addOneUserTagInfo(data).done(function(res) {
                var list=JSON.parse(res.model.tagsInfo);
                if(res.flag==1) {
                    bainx.broadcast('添加成功！');
                    $('.pop_add').hide();
                    var value=$('.add_con input').val();
                    var id=list[list.length-1].id;
                    var html='<p class="fl" data-id="'+id+'">'+"#"+''+value+'</p>';
                    $('.notes_list').append(html);
                    $('.add_con input').val('');
                }
            })
        }).on('mousedown','.notes_list p',function(e){
            var e = e || window.event;
            if(e.button=='2'){
                e.stopPropagation();
                $('#confirmid').attr('class','confirmupdata col');
                var pointX = e.pageX;
                var pointY = e.pageY;
                $('.pop_rment').css('left',pointX+'px');
                $('.pop_rment').css('top',pointY+'px');
                $('.pop_rment').show();
                var id=$(this).attr('data-id');
                var value=$(this).text();
                $('.c_r').attr('data-value',value);
                $('.d_r').attr('data-id',id);
                $('.c_r').attr('data-id',id);
            }
        }).on('click','.d_r',function(e){
            e.stopPropagation();
            var id=$(this).attr('data-id'),
                me=$(this),
                data={
                    userId:userId,
                    delId:id
                };
            Data.delOneUserTag(data).done(function(res) {
                if(res.flag==1){
                    bainx.broadcast('删除便签成功！');
                    $('.notes_list p').each(function(index,item){
                        if($(this).attr('data-id')==id){
                            $(this).remove();
                        }
                    })
                    $('.pop_rment').hide();
                }
            })
        }).on('click','.c_r', function (e) {
            e.stopPropagation();
            $('.pop_rment').hide();
            $('.pop_add').show();
            var value=$(this).attr('data-value').replace(/#/, "");
            $('.add_con input').val(value);
            var uId=$(this).attr('data-id');
            $('#confirmid').attr('data-id',uId);
        }).on('click','.confirmupdata',function(){
            var uId=parseInt($(this).attr('data-id'));
            var tag=$('.add_con input').val();
            if(tag.length>20){
                bainx.broadcast('最多只能输入20个字！');
                return;
            }
            if(!tag){
                bainx.broadcast('请输入标签！');
                return;
            }
            var data={
                userId:userId,
                uId:uId,
                tag:tag
            }
            Data.updateOneUserTag(data).done(function(res) {
                if(res.flag==1){
                    bainx.broadcast('修改便签成功！');
                    $('.notes_list p').each(function(index,item){
                        if($(this).attr('data-id')==uId){
                            $(this).text('#'+tag);
                        }
                    })
                    $('.add_con input').val('');
                    $('.pop_add').hide();
                }
            })
        })
        var wrap = $('#csadUserMessageContainer_'+userId);
        wrap.on('click','.notes_add p',function(){

            wrap.find('#confirmid').attr('class','confirm col');
            wrap.find('.pop_add').show();
        }).on('click','.cancel',function(){
            wrap.find('.pop_add').hide();
            wrap.find('.add_con input').val('');
        }).on('click','.confirm',function(){
            var tag= wrap.find('.add_con input').val();
            if(tag.length>20){
                bainx.broadcast('最多只能输入20个字！');
                return;
            }
            if(!tag){
                bainx.broadcast('请输入标签！');
                return;
            }
            var data={
                userId:userId,
                tag:tag
            }
            console.log(tag)
            Data.addOneUserTagInfo(data).done(function(res) {
                var list=JSON.parse(res.model.tagsInfo);
                if(res.flag==1) {
                    bainx.broadcast('添加成功！');
                    wrap.find('.pop_add').hide();
                    var value=wrap.find('.add_con input').val();
                    var id=list[list.length-1].id;
                    var html='<p class="fl" data-id="'+id+'">'+"#"+''+value+'</p>';
                    wrap.find('.notes_con').append(html);
                    wrap.find('.add_con input').val('');

                }
            })
        }).on('mousedown','.notes_con p',function(e){
            var e = e || window.event;
            if(e.button=='2'){
                e.stopPropagation();
                wrap.find('#confirmid').attr('class','confirmupdata col');
                var pointX = e.pageX;
                var pointY = e.pageY;
                wrap.find('.pop_rment').css('left',pointX+'px');
                wrap.find('.pop_rment').css('top',pointY+'px');
                wrap.find('.pop_rment').show();
                var id=$(this).attr('data-id');
                var value=$(this).text();
                wrap.find('.c_r').attr('data-value',value);
                $('.d_r').attr('data-id',id);
                wrap.find('.c_r').attr('data-id',id);
            }
        }).on('click','.d_r',function(e){
            e.stopPropagation();
            var id=$(this).attr('data-id'),
                me=$(this),
                data={
                    userId:userId,
                    delId:id
                };
            Data.delOneUserTag(data).done(function(res) {
                if(res.flag==1){
                    bainx.broadcast('删除便签成功！');
                    wrap.find('.notes_con p').each(function(index,item){
                        if($(this).attr('data-id')==id){
                            $(this).remove();
                        }
                    })
                    wrap.find('.pop_rment').hide();
                }
            })
        }).on('click','.c_r', function (e) {
            e.stopPropagation();
            wrap.find('.pop_rment').hide();
            wrap.find('.pop_add').show();
            var value=wrap.find(this).attr('data-value').replace(/#/, "");
            wrap.find('.add_con input').val(value);
            var uId=$(this).attr('data-id');
            wrap.find('#confirmid').attr('data-id',uId);
        }).on('click','.confirmupdata',function(){
            var uId=parseInt(wrap.find(this).attr('data-id'));
            var tag=wrap.find('.add_con input').val();
            if(tag.length>20){
                bainx.broadcast('最多只能输入20个字！');
                return;
            }
            if(!tag){
                bainx.broadcast('请输入标签！');
                return;
            }

            var data={
                userId:userId,
                uId:uId,
                tag:tag
            }
            Data.updateOneUserTag(data).done(function(res) {
                if(res.flag==1){
                    bainx.broadcast('修改便签成功！');
                    wrap.find('.notes_con p').each(function(index,item){
                        if($(this).attr('data-id')==uId){
                            $(this).text('#'+tag);
                        }
                    })
                    wrap.find('.add_con input').val('');
                    wrap.find('.pop_add').hide();
                }
            })
        })
    }


    return{
        csadAddNotesHtml:csadAddNotesHtml,
        csadAddNotesHtml2:csadAddNotesHtml2,
        pop:pop,
        initAddNotes:initAddNotes
    }

})