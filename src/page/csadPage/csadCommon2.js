/**
 * pc端专家common
 * Created by xiuxiu on 2016/7/15.
 */
define('h5/js/page/csadCommon2', [
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    //'plugin/webIm/HZRecorder',
    'plugin/webIm/strophe',
    'plugin/webIm/easemob.im-1.1.shim',
    'plugin/webIm/easemob.im.config',
    'plugin/webIm/swfupload/swfupload',
    'h5/js/page/csadAddNotes',
    'h5/js/page/csadUserMessage',
    'h5/js/page/csadQuestionnaireSurveyPage',
    'h5/js/page/csadUserTrajectory',
    'h5/js/page/imageMagnification',
    'h5/css/page/questionnaireSurveyPage.css',
    'h5/css/page/createMineBoxPage.css',
    'plugin/webIm/jplayer/jquery.jplayer.min'
], function($,URL, Data,Strophe,EasemobShim,EasemobConfig,SWFUpload,CsadAddNotes,CsadUserMessage,csadQuestionnaireSurveyPage,CsadUserTrajectory,imageMagnification) {

    var membersList = [],//分组成员信息
        titleDom = document.title,//标题
        newMsgTips = '[您有新的消息]',
        source = 1,
        status = '',
        currentPageCon,//当前页面
        noPhoto = imgPath+'common/images/avatar9.png';
    var db = getCurrentDb();//初始化数据库
    var loginEnter = ['Android客户端','IOS客户端','官网','微信','微博'];//匿名用户登录方式
    var sendStatus = true,notification//桌面提醒框;
    //判断数组是否包含某元素

    var load_time = null,down_time = null;//时间判断

    var receiveMan = [],//接待的人数
        waittingMan = [],//发送是否在线的等待的人
        currentsendId,// 当前发送消息的人的id
        currentsendSessionId;//当前发送消息的人的sessionid

    Array.prototype.containItem = function (obj) {
        var i = this.length;
        while (i--) {
            if (this[i] == obj) {
                return true;
            }
        }
        return false;
    }
    //删除数组指定的某个元素
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
    //是否包含
    function isContains(str, substr) {
        return new RegExp(substr).test(str);
    }
    //处理id
    function manageId(id){

        if(id && id.indexOf('_') > 0) {
            var arrId = id.split("_");
            if (arrId.length > 1) {
                //id = parseInt(arrId[1]);
                id = arrId[1];
            }
        }
        return id;
    }

    function init(){
        login();//登录
        getMembersList();//获取好友列表
        bindEvents();
    }


    //获取所有用户信息
    function getMembersList(){
        membersList = sessionStorage.getItem('membersListIM');
        membersList = JSON.parse(membersList);
        if(!membersList){
            Data.getGroupAndFriendsList().done(function(res) {
                if (res.list.length > 0) {
                    membersList = res.list;
                    var membersListData = JSON.stringify(membersList);
                    sessionStorage.setItem('membersListIM',membersListData);
                }
            })
        }
    }


    //获取页面状态
    function getPageStatus($this){
        status = $this.data('status');
        source =  $this.data('source');
        currentPageCon = $('#'+$this.data('name')+'_Wrap');
    }

    //点击导航

    function  handleNav($this,_userId){
        //$('#index_Wrap').addClass('hide');
        //status = $this.data('status');
        //source =  $this.data('source');
        getPageStatus($this);


        //获取快速回复句子
        if(status == 1 && $('#quickReply').length == 0){
            quickReplySentense();
        }


        var idx = 0,
            obj=$('.callCenter'),
            callOrChat = false;
        if(status == 1){
            idx=1;
            obj = $('.chatMessage');
            callOrChat=true;
        }
        if(_userId){
            obj.addClass('active').attr('data-userid',_userId).siblings().removeClass('active');
            $('.contentWrap').eq(idx).removeClass('hide').siblings().addClass('hide');
            spreadMsg(_userId);
        }
        else{
            var curContent = $this.index();
            $this.addClass('active').siblings().removeClass('active');
            $('.contentWrap').eq(curContent).removeClass('hide').siblings().addClass('hide');
            spreadMsg();
        }

    }
    //展开
    function spreadMsg(uid){
        if(status == 0 || (status == 1 &&  source != 2)){
            var cont = $('#callCenterUL');
            if(status == 1){
                cont = $('#momogrouplistUL');
            }
            //展开
            var chatLi = cont.find('li');
            if(chatLi.length > 0){
                var curOpenUId;
                if(uid){
                    curOpenUId = uid;
                }
                else if(cont.find('.currentWin').length == 0){
                    curOpenUId = chatLi.eq(0).attr('id');
                }
                if(curOpenUId){

                    var chatLiId = $('#'+curOpenUId);
                    // if(chatLiId.length > 0){
                    chatLiId.addClass('currentWin').siblings().removeClass('currentWin');
                    var sid = chatLiId.attr('displayname');
                    // }
                    if(status == 1){//&& getContactChatDiv(curOpenUId) == null
                        currentPageCon.find('#nullchater').hide();
                        chooseContactDivClick('',true,sid,curOpenUId,true);
                    }
                    if(status == 0 && $('#callCenter_Wrap').find('#csadUserMessageContainer_'+sid).length == 0){
                        $('#callCenter').show();
                        $('#noCallMsg').hide();
                        callShowUserOtherMsg(sid);
                    }
                }
            }
        }
    }


    //事件
    function bindEvents(){
        //表情
        $('body')
            .on('click', '.headPicCol', function(){
                //URL.assign(URL.csadPage);
                $('#index_Wrap').removeClass('hide').siblings().addClass('hide');
                $('.leftNav li').removeClass('active');
                status = -1;
                source = -1;
            })
            .on('click', '#deleteAllData', function(){
                deleteTable();
            })
            .on('click', '[href]', function(){
                var href = $(this).attr('href');
                URL.assign(href);
            })
            //导航选择
            .on('mouseover', '.leftNav li i', function(){
                $('.leftNav li p').removeClass('show')
                $(this).next().addClass('show');
            })
            .on('mouseout', '.leftNav li i', function(){
                $('.leftNav li p').removeClass('show')
            })
            //.on('click', '.leftNav li i', function(){
            //
            //    handleNav($(this).parent());
            //
            //})
            //表情选择
            .on('click','.title_name',function(){
                //$('.emtionList').hide();
                $('.emtionList').eq($(this).index()).show().siblings().hide();

            })

            //发送文本消息
            .on('click','.sendText',function(){
                var msg = document.getElementById(talkInputId).value;
                sendText(msg);

            })
            //发送正在输入状态
            .on('input','#talkInputId',function(){
                if($(this).val().length >0 && sendStatus){
                    sendActionMsg('true');
                    sendStatus = false;
                }
            })
            .on('blur','#talkInputId',function(){
                sendActionMsg('false');
                sendStatus = true;
            })
            //快速回复
            .on('click','.quickReplyBtn',function(){
                //  quickReplySentense();
                $('#quickReply').toggleClass('hide');
                $('#wl_faces_box').hide();

            })
            //添加快速回复
            .on('click','.addQuickReplyBtn',function(){
                addQuickReplySentense();
            })

            //发送快速回复
            .on('click','#quickReply dd',function(){
                var msg = $(this).text();
                sendText(msg,true);
                $('#quickReply').addClass('hide');
            })


            //关闭会话
            .on('click','#ext',function(){
                closeTalking()
            })
            //关闭表情
            .on('click','.turnoffFaces_box',function(){
                turnoffFaces_box();
            })
            //登录超时，重新登录
            .on('click','.logTimeOut',function(){
                login();
            })
            .on('click', 'input', function (event) {
                if (event && event.preventDefault) {
                    window.event.returnValue = true;
                }
            })
            .on('change','#fileInput',function(){
                switch ( this.getAttribute('data-type') ) {
                    case 'img':
                        sendPic();
                        break;
                    //case 'audio':
                    //    sendAudio();
                    //    break;
                }
            })
            //发送图片、音频
            .on('click','.sendIt',function(){
                send($(this))
            })
            //弹出表情
            .on('click','.showEmotionDia',function(){
                showEmotionDialog();
                $('#quickReply').addClass('hide');
            })

            //放大图片
            .on('click','.chatRight .viewImgInChat img',function(){
                imageMagnification.loadImg($(this));
            })
            //登出
            .on('click','#logout',function(){
                Data.logOut().done(function(){
                    bainx.broadcast('退出成功！');
                    localStorage.removeItem('isExpert');
                    setCsadOffline(0);
                })
            })
            //专家信息
            .on('click','.chatRight .chatMess.right .userPhoto',function(){
                if($('#csadDetailMsg').length == 0){
                    $('body').append('<section class="telDialog wl-trans-dialog translate-viewport csadDetailMsg" id="csadDetailMsg" data-widget-cid="widget-0" style="display: block;"><div class="csadDetailMsgContent"><iframe src="'+URL.expertDetailPage+'?emUserName='+curUserId+'"></iframe></div></section>');
                }
                else{
                    $('#csadDetailMsg').show();
                }
            })
            .on('click','#csadDetailMsg',function(){
                $(this).hide();
            })
            //添加快速回复取消确定事件
            .on('click','.cancelBtn',function(){
                $('#addReply').hide().removeAttr('data-id');
                $('#addReply .add_con input').val('');
            })
            .on('click','.confirmBtn',function(){
                var tag= $('#addReply .add_con input').val();

                if(tag.length > 60){
                    bainx.broadcast('最多输入60个字！');
                    return;
                }
                if(!tag){
                    bainx.broadcast('请输入标签！');
                    return;
                }


                var dataReply = {
                    content:tag
                }
                if($('#addReply').attr('data-id')){
                    dataReply.id = $('#addReply').attr('data-id');
                    Data.updateOneShortcuty(dataReply).done(function(res){
                        $('.curReply').html(res.data.content).attr('data-id',res.data.id);
                        bainx.broadcast('编辑成功！');
                        $('#addReply').hide().removeAttr('data-id');

                    })
                }
                else{
                    dataReply.userId = manageId(curUserId);
                    Data.addOneShortcuty(dataReply).done(function(res){
                        $('#quickReply dl').prepend('<dd data-id="'+res.data.id+'">'+res.data.content+'</dd>');
                        bainx.broadcast('添加成功！');
                        $('#addReply').hide().removeAttr('data-id');
                    })
                }



            })

            .on('contextmenu','#quickReply dd',function(e){
                var e = e || window.event;
                e.stopPropagation();
                var pointX = e.pageX;
                var pointY = e.pageY;
                $('.opareReply').removeClass('hide').css({'left':e.pageX+'px','top':pointY+'px'});
                var id=$(this).attr('data-id');
                var value=$(this).text();
                $('.editBtnReply').attr({'data-value':value,'data-id':id});
                $('.deleteBtnReply').attr('data-id',id);
                $(this).addClass('curReply').siblings().removeClass('curReply');
                return false;
            })
            //编辑快捷语
            .on('click','.editBtnReply',function(){
                var val = $(this).attr('data-value'),
                    id = $(this).attr('data-id');
                addQuickReplySentense(val,id);
            })
            //删除快捷语
            .on('click','.deleteBtnReply',function(){
                var data = {
                    id:$(this).attr('data-id')
                }
                Data.deleteOneShortcuty(data).done(function(){
                    bainx.broadcast('删除成功！');
                    $('.curReply').remove();
                })
            })

            //右键删除聊天列表的联系人
            .on('contextmenu','#momogrouplistUL li',function(e){
                var e = e || window.event;
                e.stopPropagation();
                var pointX = e.pageX;
                var pointY = e.pageY;
                if($('.deleteContactMan').length == 0){
                    $('body').append('<div class="deleteContactMan" style="position: absolute;left: '+pointX+'px;top: '+pointY+'px;">删除联系人</div>');
                }
                else{
                    $('.deleteContactMan').removeClass('hide').css({'left':e.pageX+'px','top':pointY+'px'});
                }
                var id = $(this).attr('id');
                $('.deleteContactMan').attr('data-id',id);
                return false;
            })
            .on('click','.deleteContactMan',function(){
                var id = $(this).attr('data-id'),
                    sid = $(this).attr('displayname');
                sid = manageId(sid);
                //
                if($('#'+id).hasClass('currentWin')){
                    currentPageCon.find('.mainContainer').hide();
                    currentPageCon.find('#nullchater').show();
                }
                else{
                    $('#'+curUserId+'-'+id).remove();
                }
                $('#'+id).remove();
                $('.deleteContactMan').addClass('hide');
                $('#chatMessage_Wrap').find('#csadUserMessageContainer_'+sid).remove();
                //删除记录
                db.transaction(function (trans) {
                    trans.executeSql("delete from chatSession where service_id='"+curUserId+"' and user_id = '"+id+"'", [], function (ts, data) {});
                    trans.executeSql("delete from chatRecord where service_id='"+curUserId+"' and user_id = '"+id+"'", [], function (ts2, data2) {});
                });
            })


        //$('#quickReply dd').contextmenu(function(e){
        //    e.preventDefault();
        //});
    }

    //******************************聊天功能 开始
    var curName = null,curMobile = null;
    var curChatUserId = null;
    var conn = null;
    var curRoomId = null;
    var curChatRoomId = null;
    var groupFlagMark = "groupchat";
    var chatRoomMark = "chatroom";
    var msgCardDivId = "chat01";
    var talkToDivId = "talkTo";
    var talkInputId = "talkInputId";
    var bothRoster = [];
    var toRoster = [];
    //var maxWidth = 200;
    var chatListArr =[],//聊天列表未读人数；
        saleListArr =[],//销售列表未读人数
        payVisitLisitArr = [];//蜜月回访未读人数
    //var getInitChatNum = 0; //获取一开始的聊天人数
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
        //收到命令消息
        onCmdMessage : function(message) {
            handleCmdMessage(message);
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
    var PAGELIMIT = 8;
    var pageLimitKey = new Date().getTime();
    var currentIMMsg = [];//当前用户的信息
    var currentIMLocal = localStorage.getItem('currentIM');//当前用户的信息保存在localstorage中的
    var user,//环信用户
        pass;//环信密码
    currentIMLocal = JSON.parse(currentIMLocal);
    var curUserId = curUserId = currentIMLocal && currentIMLocal[0] ? currentIMLocal[0] :  null;
    var callInStatus = true,
    // hasResponse = false,
        hasCurWin = true;//当前是否有这个窗口
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
    //  var hasloaded = false;

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
    var showChatUI = function () {
        var login_userEle = document.getElementById("login_user").children[0],
            login_userPic = document.getElementById("myPic");
        if(currentIMLocal && currentIMLocal.length > 2){
            login_userEle.innerHTML = currentIMLocal[2];
            login_userEle.setAttribute('data-mobile',currentIMLocal[4]);
            login_userPic.src = currentIMLocal[3];
            curName = currentIMLocal[2];
            curMobile = currentIMLocal[4];
        }
        else{
            var data = {
                emUserName:curUserId
            }
            Data.getUserInfoIM(data).done(function(res){
                var headpic = res.headPic ? res.headPic : noPhoto;
                login_userEle.innerHTML = res.nickName;
                curName = res.nickName;
                curMobile = res.mobile;
                login_userPic.src = headpic;
                login_userEle.setAttribute('data-mobile',res.mobile);
                currentIMMsg[0] = user;
                currentIMMsg[1] = pass;
                currentIMMsg[2] = res.nickName;
                currentIMMsg[3] = headpic;
                currentIMMsg[4] = res.mobile;
                var currentIMMsgData = JSON.stringify(currentIMMsg);
                localStorage.setItem('currentIM',currentIMMsgData);//保存信息
            })
            login_userEle.setAttribute("title", curUserId);
        }

    };
//登录之前不显示web对话框
//    var hiddenChatUI = function () {
//        $('.container').css({
//            "display" : "none"
//        });
//        // bainx.broadcast('连接中断，请刷新！');
//        document.getElementById(talkInputId).value = "";
//    };
//定义消息编辑文本域的快捷键，enter和ctrl+enter为发送，alt+enter为换行
//控制提交频率
    $(function() {
        $('body').on('keydown','#talkInputId',function(event) {
            var msg = document.getElementById('talkInputId').value;
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
        })
    });
//easemobwebim-sdk注册回调函数列表
    $(document).ready(function() {
        $(function() {
            // $(window).bind('beforeunload', function() {
            //  if (conn) {
            // conn.close();
            // return navigator.userAgent.indexOf("Firefox") > 0 ? ' ' : '';
            //   }
            //  });
        });
    });

    //设置专家在线状态
    function setCsadOffline(state,notTip){
        var data = {
            emUserName:curUserId,
            status:state,
            terminal:'pc'
        }
        Data.changeOneCsadStatus(data).done(function() {
            if(state != 0){
                if(!notTip){
                    bainx.broadcast('设置成功！');
                }

                $('.setCsadStatus').addClass('hide');
                var obj = $('.cur-online'),
                    tit;
                switch (state){
                    case 1:
                        obj.addClass('online').removeClass('leave');
                        tit = '在线';
                        break;
                    case 2:
                        obj.addClass('leave').removeClass('online');
                        tit = '离开';
                        break;
                    case 0 :
                        obj.addClass('offline');
                        tit = '离线';
                }
                $('#headerimg').attr('title',tit);
            }
            else{
                insertChatRec(true,2);
                setTimeout(function(){
                    URL.assign(URL.loginPageCsad);
                },2000)
            }
        })
    }

//处理连接时函数,主要是登录成功后对页面元素做处理
    var handleOpen = function(conn) {
        //从连接中获取到当前的登录人注册帐号名
        curUserId = conn.context.userId;
        //获取当前登录人的联系人列表
        // conn.getRoster({
        //   success : function(roster) {
        // 页面处理
        showChatUI();
        conn.setPresence();//设置在线状态
        $('#headerimg').attr('emuserid',curUserId);
        setCsadOffline(1,true);



        //
        getPageStatus($('.chatMessage'));
        buildStrangerDiv("momogrouplist", "momogrouplistUL");

        getPageStatus($('.callCenter'));//设置全局变量status && source //要加。。
        buildStrangerDiv("callCenter","callCenterUL");



        //获取陌生人列表
        // if (strangerIMLocal && strangerIMLocal.length > 0){
        //if(status && status == '1' && source=='1'){
        // buildStrangerDiv("momogrouplist","momogrouplistUL");
        //获取当前登录人的群组列表
        conn.listRooms({
            success : function(rooms) {
                if (rooms && rooms.length > 0) {
                    //buildListRoomDiv("momogrouplist", rooms);//群组列表页面处理
                    if (curChatUserId === null) {
                        // setCurrentContact(groupFlagMark + rooms[0].roomId);
                        //$('#accordion2').click();
                    }
                }
                conn.setPresence();//设置用户上线状态，必须调用
            },
            error : function(e) {
                conn.setPresence();//设置用户上线状态，必须调用
            }
        });
        // }
        // if(status && status == '0'){
        //     buildStrangerDiv("callCenter","callCenterUL");
        // }
        // if(!(status == 1 && source == 1)){
        //     //消息 提示
        messageTipsNav();
        // }


        //  }
        // });
        if ( !Easemob.im.Helper.isCanUploadFileAsync && typeof uploadShim === 'function' ) {
            picshim = uploadShim('sendPicInput', 'pic');
            audioshim = uploadShim('sendAudioInput', 'aud');
            // fileshim = uploadShim('sendFileInput', 'file');
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
        //hiddenChatUI();
        for(var i=0,l=audioDom.length;i<l;i++) {
            if(audioDom[i].jPlayer) audioDom[i].jPlayer('destroy');
        }
        //$('body').append('<div class="logTimeOut">连接超时，请重新登录！</div>');
        groupQuering = false;
        textSending = false;
        if(confirm('连接中断,可能是因为在别处登录,请重新登录')){
            setCsadOffline(0);
            URL.assign(URL.csadPage);
        }
    };

//异常情况下的处理方法
    var handleError = function(e) {
        setCsadOffline(0);
        clearPageSign();
        e && e.upload && $('#fileModal').modal('hide');
        if (curUserId == null) {
        } else {
            var msg = e.msg;
            if (e.type == EASEMOB_IM_CONNCTION_SERVER_CLOSE_ERROR) {
                if (msg == "" || msg == 'unknown' ) {

                    if(confirm('服务器断开连接,可能是因为在别处登录')){
                        URL.assign(URL.csadPage);
                    }
                } else {
                    if(confirm('服务器断开连接')){
                        URL.assign(URL.csadPage);
                    }
                }
            } else if (e.type === EASEMOB_IM_CONNCTION_SERVER_ERROR) {
                if (msg.toLowerCase().indexOf("user removed") != -1) {
                    if(confirm('用户已经在管理后台删除')){
                        URL.assign(URL.csadPage);
                    }
                }
            } else {
                if(confirm(msg)){
                    URL.assign(URL.csadPage);
                }
            }
        }
        conn.stopHeartBeat(conn);
    };

//登录系统时的操作方法
    function login() {
        handlePageLimit();
        var isExpert;
        setTimeout(function () {
            isExpert = localStorage.getItem('isExpert');
            if(isExpert){
                loginInCsad(isExpert);
            }
            else{
                Data.checkIsExper().done(function(res){
                    isExpert = res.isExpert;
                    localStorage.setItem('isExpert',isExpert);
                    loginInCsad(isExpert);
                })
            }
            return false;
        }, 50);
    }

    //判断是否是专家之后的操作即登录
    function loginInCsad(isExpert){
        if(isExpert == 1){
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
        }else{
            bainx.broadcast('亲，您不是专家！');
            setTimeout(function(){URL.assign(URL.loginPageCsad)},2000)
        }
    }

    //从缓存中拿帐号密码
    function fromStorageLogin(){
        user = currentIMLocal[0];
        pass = currentIMLocal[1];
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
        currentIMLocal = [];
        Data.createNewIMUserSingle().done(function(res){
            user = res.imUser.userName;
            pass = res.imUser.password;
            if (user == '' || pass == '') {
                alert("请输入用户名和密码");
                return;
            }
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

    //添加快速回复
    function addQuickReplySentense(value,id){

        var idTmp = '';
        if(!value){
            value = '';
        }
        if(id){
            idTmp = 'data-id="'+id+'"';
        }
        if($('#addReply').length == 0){
            $('.chat02').append('<div id="addReply" class=" grid addReplySentense" data-uid="'+manageId(curUserId)+'" '+idTmp+'><div class="pop_box"><div class="add_con"><input type="text" placeholder="输入快捷语" value="'+value+'"><p>请输入最多60个字</p></div><div class="pop_btn row fvc fac"><div class="col cancelBtn">取消</div><div class="confirmBtn  col">确定</div></div></div></div>');
        }
        else{
            $('#addReply').attr('data-id',id).show().find('input').val(value);

        }

    }

    //快速回复句子
    function quickReplySentense(){
        var data = {
            userId:manageId(curUserId)
        }
        Data.selectShortcutysByuserId(data).done(function(res){
            var tpl = '<dd data-id="{{id}}">{{content}}</dd>',
                html = [];
            $.each(res.data,function(index,item){
                html.push(bainx.tpl(tpl,item));
            })
            //$('#quickReply').toggleClass('hide');
            if($('#quickReply').length == 0){
                $('.chat02_title').append('<div id="quickReply" class="hide"><dl>'+html.join('')+'</dl> </div>');
                $('body').append('<div class="opareReply hide"><ul><li class="deleteBtnReply tc">删除</li><li class="editBtnReply tc">修改</li></ul></div>');

                //$('#quickReply').removeClass('hide');
            }
        })

    }

//设置当前显示的聊天窗口div，如果有联系人则默认选中联系人中的第一个联系人，如没有联系人则当前div为null-nouser
    var setCurrentContact = function(defaultUserId,sid) {
        showContactChatDiv(defaultUserId,sid);
        if (curChatUserId != null) {
            hiddenContactChatDiv(curChatUserId);
        } else {
            $('#null-nouser').css({
                "display" : "none"
            });
        }
        curChatUserId = status == 1 && $('.currentWin').length > 0 ? $('.currentWin').attr('id') :  defaultUserId;
    };

//构造陌生人列表
    var buildStrangerDiv = function(momogrouplistDivId,momogrouplistULId) {

        //sql = 'select user_id,chat_timestamp from chatRecord where status > 0 group by user_id ';  //获取联系人列表
        db.transaction(function (trans) {
            var sql = momogrouplistDivId == 'callCenter' ? 'select * from chatSession where  status = 0 and service_id = "'+curUserId+'"  order by isTempEm desc, last_time desc' : 'select * from chatSession where  status > 0 and service_id = "'+curUserId+'" and source = 1  order by read asc,isTempEm desc, last_time desc';
            trans.executeSql(sql, [], function (ts, data) {
                var jugdeExist = false; //判断链接的uid是否在缓存内
                //userIdUrl = URL.param.userId;
                if (data && data.rows.length > 0) {     //有数据
                    for (var i = 0; i < data.rows.length; i++) {
                        var itemData = data.rows.item(i),
                            _userId = itemData.user_id,
                            _times = bainx.formatDate('m-d h:i', new Date(itemData.last_time)),
                            uName = itemData.em_name,
                            uSessionId = itemData.session_id,
                            uLoginEnter = itemData.login_entrance,
                            timestrap = itemData.start_time;
                        if(itemData){
                            //userIdArr.push(_userId);
                            getChatListMember(_userId,momogrouplistULId,_times,uName,uSessionId,uLoginEnter,itemData,timestrap)
                        }
                        //if(userIdUrl && _userId == userIdUrl){
                        //    jugdeExist = true;
                        //}
                    }
                    // }
                    // if(data.rows.length > 0){
                    //if(userIdUrl && !jugdeExist){
                    //    getChatListMember(userIdUrl,momogrouplistULId,'')
                    //}
                    //if(status == 0){
                    //    $('#callCenter').show();
                    //    $('#noCallMsg').hide();
                    //}
                }
                //if(userIdUrl && data.rows.length == 0){
                //    getChatListMember(userIdUrl,momogrouplistULId,'');
                //}

                var uid = $('.callCenter').data('userid');
                if(status ==1){
                    uid = $('.chatMessage').data('userid');
                }
                if(uid){
                    spreadMsg(uid);
                }
                else if(data.rows.length > 0){
                    spreadMsg();
                }

            });
            getItemUnreadNum(trans);
        });
    };
    //获取个人未读消息数量
    function getItemUnreadNum(trans){
        trans.executeSql('select * from chatRecord where read = 0 and service_id = "'+curUserId+'" ', [], function (ts2, data2)
        {
            if(data2){
                // var num = 0;
                if(data2.rows.length > 0){
                    document.title = titleDom + newMsgTips;
                    for (var j = 0,l = data2.rows.length; j < l; j++) {
                        var itemData2 = data2.rows.item(j),
                            msgArr = JSON.parse(itemData2.msgbody),
                            from = msgArr.from;

                        if(from != curUserId){
                            // num++;
                            // var wrapObj = status == 1 ? $('#momogrouplistUL') : $('#callCenterUL');
                            messageTipAndContent(msgArr);
                        }
                    }
                }



                //if(status== 1 && chatLi.length == 0){
                //    messageTipsNav();
                //}
            }
        }, function (ts2, message2) {console.log(message2);var tst = message2;})
    }

    //消息内容跟提醒
    function messageTipAndContent(msgArr){
        var from  = msgArr.from,
        // wrapObj = status == 1 ? $('#momogrouplistUL') : $('#callCenterUL'),
            $this  = $('#'+from);
        if(!(msgArr.ext && msgArr.ext.MikuExpand == 'CallExpert')){
            var msgData = msgArr.data,messageTip = msgArr.data;
            if(msgData && msgData[0].type && msgData[0].type == "txt"){
                messageTip = msgData[0].data;
            }
            if(msgData && msgData[0].type && msgData[0].type == "emotion"){
                messageTip = '[表情]';
            }
            if(msgArr.filename){
                if(msgArr.length){
                    messageTip = '[语音]';
                }else{
                    messageTip = '[图片]';
                }
            }
            if($this.find('.message_main_item').find('i').length == 0){
                $this.find('.message_main_item').append('<i class="message_li ellipsis">'+messageTip+'</i>')
            }else{
                $this.find('.message_main_item').find('i').html(messageTip);
            }
            if(!($this.hasClass('currentWin') && status == 1)){
                if($this.find('.badge').length == 0){
                    $this.append('<span class="badge">1</span>');
                }else{
                    $this.find('.badge').text(parseInt($this.find('.badge').text())+1);
                }
                if(isContains(from,'miku_temp_')){
                    $this.find('.badge').addClass('badgeAnon');
                }
            }
        }
    }

    //获取成员列表信息
    function getChatListMember(_userId,momogrouplistULId,_times,uName,uSessionId,uLoginEnter,itemData,timestrap,createFromMsg){
        var isTemp = isContains(_userId,'miku_temp') ? true : false;
        var _type = itemData && itemData.type_chat == 0,
            _id =  _type ? itemData.curChatId : _userId,
            sid = isTemp ? uSessionId : _userId;
        var lielem = $('<li>').attr({
            'id' :_id,
            'class' : '',
            'className' : '',
            'type' : _type ? groupFlagMark : 'chat',
            'roomId' :  _type ? itemData.curChatId : '',
            'displayName' : sid,
            'coopCode':_type ? itemData.coopCode : '',
            'starttime':timestrap
        }).click(function() {
            $(this).addClass('currentWin').siblings().removeClass('currentWin');
            if(momogrouplistULId == 'momogrouplistUL'){        //聊天页面
                chooseContactDivClick(this,true,lielem.attr('displayName'),_userId);
            }
            if(momogrouplistULId == 'callCenterUL'){        //呼叫页面
                // var chatUserIdM = this.getAttribute('id');
                callShowUserOtherMsg(lielem.attr('displayName'));
            }
        });
        $('<div>').attr({"class": "row","name":"row"}).appendTo(lielem);
        $('<img>').attr({"src": noPhoto,"class": "img-circle-50 headPicUser"}).appendTo(lielem.children('.row'));
        $('<div>').attr({"class": "col message_main_item col-10","name":"col"}).appendTo(lielem.children('.row'));
        $('<span>').attr({"data-mobile": '','data-uloginenter': uLoginEnter,'class':'userName'}).html(uName).appendTo(lielem.find('.message_main_item'));
        $('<div>').attr({"class": "col message_main_time col-5"}).appendTo(lielem.children('.row'));
        $('<span>').attr({"class": "message_main_time_span"}).html(_times).appendTo(lielem.find('.message_main_time'));
        if(momogrouplistULId == 'callCenterUL'){
            $('<div>').attr({"class": "responseBtn"}).appendTo(lielem.find('.message_main_time'));
            $('<span>').html('应答').appendTo(lielem.find('.responseBtn')).click(function() {
                //upDateStatus(_userId,1);
                //status = 1;
                //$('#'+_userId).remove();
                //$('#csadUserMessageContainer_'+sid).remove();
                //handleNav($('.chatMessage'),_userId);
                //var sid = this.getAttribute('displayName');

                callToChat(_userId,isTemp,sid);


                //URL.assign(URL.csadChatMessagePage+'?status=1&source=1&response=1&userId='+_userId)
            });
        }

        else{
            if(isTemp){
                $('<span>').attr({"class": "isTempIcon"}).appendTo(lielem.find('.message_main_time'));
            }
        }
        if(createFromMsg){          //来消息时创建列表显示在最前
            $('#'+momogrouplistULId).prepend(lielem);
        }
        else{
            $('#'+momogrouplistULId).append(lielem);
        }


        //$('#'+momogrouplistULId).delegate('.responseBtn span','click',function(e){
        //        e.stopPropagation()
        //    var $uid = $(this).parent().parent().parent().parent().attr('id');
        //    upDateStatus($uid,1)
        //    URL.assign(URL.csadChatMessagePage+'?status=1&source=1&response=1&userId='+$uid)
        //})
        //$('#'+momogrouplistULId).delegate('li','click',function(e){
        //    e.stopPropagation()
        //    $(this).addClass('currentWin').siblings().removeClass('currentWin');
        //    if(momogrouplistULId == 'momogrouplistUL'){        //聊天页面
        //        chooseContactDivClick(this,true,$(this).attr('displayName'),$(this).attr('id'));
        //    }
        //    if(momogrouplistULId == 'callCenterUL'){        //呼叫页面
        //        callShowUserOtherMsg($(this).attr('displayName'));
        //    }
        //});

        if(_type){
            //lielem.find('.userName').text(uName);
            return false;
        }
        if(!isTemp){

            var spanelem = lielem.find('.userName')[0],
                imgelem = lielem.find('.headPicUser')[0];
            showNickPhoto(_userId,spanelem,imgelem,true);
        }
        else{
            //lielem.find('.userName').text(uName);
            // lielem.find('.userName').data('uloginenter',uLoginEnter);

        }
    }

    //呼叫中心展开用户信息
    function callShowUserOtherMsg(chatUserIdMS){
        var isTemp = chatUserIdMS.indexOf('_') > -1 ? false : true,          //是匿名
            chatUserIdM;
        if(isTemp){
            chatUserIdM = chatUserIdMS;
        }
        else{
            chatUserIdM = chatUserIdMS.split("_");
            if(chatUserIdM.length > 1){
                chatUserIdM = parseInt(chatUserIdM[1]);
            }
        }
        var outer = $('#callCenter_Wrap');
        outer.find('.csadCallInUserMessageContainer').hide();
        if(outer.find('#csadUserMessageContainer_'+chatUserIdM).length == 0){
            $('<div class="csadCallInUserMessageContainer  col col-20" id="csadUserMessageContainer_'+chatUserIdM+'"><div class="grid"><div class="row"><div class="col col-17"><div class="callInCenterUserMsg"><div class="addNotes"></div><div class="userTrajectoryBox"></div> </div> </div><div class="col col-8"><div class="csadCallInRightContent"></div></div> </div> </div> </div>').appendTo('.callInCenterC');var csadCenter,tpm,popHtml,tpm2

            if(isTemp){
                csadCenter = outer.find('#csadUserMessageContainer_'+chatUserIdM);
                csadCenter.find('.col-8').hide();
                //用户轨迹
                tpm2=CsadUserTrajectory.csadUserTrajectoryHtml(isTemp);
                csadCenter.find('.callInCenterUserMsg').attr('id','csadUserMessageContainer_'+chatUserIdM);
                csadCenter.find('.callInCenterUserMsg .userTrajectoryBox').html(tpm2);
                CsadUserTrajectory.initUserTrajectory(chatUserIdM.toString(),outer);//是匿名
            }
            else{
                csadCenter = outer.find('#csadUserMessageContainer_'+chatUserIdM);
                tpm=CsadAddNotes.csadAddNotesHtml(chatUserIdM);
                popHtml=CsadAddNotes.pop();
                csadCenter.find('.addNotes').html(tpm);
                csadCenter.find('.addnotesContent').append(popHtml);
                CsadAddNotes.initAddNotes(chatUserIdM);
                csadCenter.find('.addNotes .t_name').attr('data-id',chatUserIdM);
                //用户轨迹
                tpm2=CsadUserTrajectory.csadUserTrajectoryHtml(isTemp);
                csadCenter.find('.callInCenterUserMsg').attr('id','csadUserMessageContainer_'+chatUserIdM);
                csadCenter.find('.callInCenterUserMsg .userTrajectoryBox').html(tpm2);
                CsadUserTrajectory.initUserTrajectory(chatUserIdM.toString(),outer);
                //盒子
                csadCenter.find('.csadCallInRightContent').html('<iframe src="'+URL.createMineBoxPage+'?userId='+chatUserIdM+'&csadName='+curName+'&csadTel='+curMobile+'" ></iframe>').height($('.wrapper').height());
            }
        }else{
            outer.find('#csadUserMessageContainer_'+chatUserIdM).show();
        }
    }

    //消息提示
    function messageTipsNav(){
        var //db = getCurrentDb(),
            allUnRead =[],//所有未读的
            allSessionUser = [],//所有同一专家的用户
            allSessionSource = []; //所有同一专家的用户来源
        db.transaction(function (trans){
            trans.executeSql('select * from chatSession where  status = 0 and service_id = "'+curUserId+'"', [], function (ts, data) //呼叫中心的消息数量
            {
                if(data){
                    if(data.rows.length> 0){
                        $('.callCenter').append('<span class="badgegroup">'+data.rows.length+'</span>');
                    }
                }
            }, function (ts, message) {console.log(message);})
            //呼叫头部的消息数量
            trans.executeSql('select * from chatSession where status = 0 and isTempEm = 0 and service_id = "'+curUserId+'"', [], function (ts, data)        //不是匿名用户的消息数量
            {
                if(data.rows.length> 0){
                    var CallTitUL = $('#call_title');
                    callInHeadTips(CallTitUL,data,false)
                }
            }, function (ts, message) {console.log(message);})

            trans.executeSql('select * from chatSession where   status = 0 and isTempEm = 1 and service_id = "'+curUserId+'"', [], function (ts, data)      //是匿名用户的消息数量
            {
                if(data.rows.length> 0){
                    var CallTitUL = $('#call_title_anonymous');
                    callInHeadTips(CallTitUL,data,true)
                }
            }, function (ts, message) {console.log(message);})
            //聊天列表的消息数量
            trans.executeSql('select * from chatSession where status = 1 and service_id = "'+curUserId+'" and read = 0  ', [], function (ts2, data2)
            {
                if(data2){
                    var l = data2.rows.length;
                    if(l > 0){
                        for(var i = 0; i < l;i++){
                            allUnRead.push(data2.rows.item(i).user_id);
                        }
                    }
                }
            }, function (ts2, message2) {console.log(message2);})
            //区分消息来源。。
            trans.executeSql('select * from chatSession where  service_id = "'+curUserId+'"', [], function (ts4, session){
                if(allUnRead.length > 0){
                    $.each(allUnRead,function(k,unReadItem){
                        if(session && session.rows.length>0){
                            var l = session.rows.length;
                            for(var i = 0; i < l;i++){
                                allSessionUser.push(session.rows.item(i).user_id);
                                allSessionSource.push(session.rows.item(i).source);
                            }
                            if(!allSessionUser.containItem(unReadItem)){
                                chatListArr.push(unReadItem);
                            }else{
                                $.each(allSessionUser,function(j,allItem){
                                    if(allItem == unReadItem){
                                        var sqlSource = allSessionSource[j];
                                        switch (sqlSource){
                                            case 1:
                                                chatListArr.push(unReadItem);
                                                break;
                                            case 2:
                                                saleListArr.push(unReadItem);
                                                break;
                                            case 3:
                                                payVisitLisitArr.push(unReadItem);
                                                break;
                                            default:
                                                break;
                                        }
                                    }
                                })
                            }
                        }
                        else{
                            chatListArr.push(unReadItem);
                        }
                    })
                }
            }, function (ts4, message4) {console.log(message4);})
            //
            trans.executeSql('select * from chatRecord where read = 0 and service_id = "'+curUserId+'"  ', [], function (ts3, userMessage)
            {
                if(userMessage){
                    var l = userMessage.rows.length;
                    //导航的消息数量
                    if(chatListArr.length >= 1){
                        $('.chatMessage').append('<span class="badgegroup">'+chatListArr.length+'</span>');
                    }
                    if(saleListArr.length >= 1){
                        $('.salesTracking').append('<span class="badgegroup">'+saleListArr.length+'</span>');
                    }
                    if(payVisitLisitArr.length >= 1){
                        $('.payVisit').append('<span class="badgegroup">'+payVisitLisitArr.length+'</span>');
                    }
                    //个人的消息数量
                    for(var j = 0;j < l;j++){
                        var itemData = userMessage.rows.item(j),
                            msg = JSON.parse(itemData.msgbody);
                        if(!(msg.ext && msg.ext.MikuExpand == 'CallExpert')){
                            //itemData = userMessage.rows.item(j),
                            var contactLi = $('.callTitle_'+itemData.user_id),
                                badgespan = contactLi.children(".badge");
                            if (badgespan && badgespan.length > 0) {
                                var count = badgespan.text();
                                var myNum = parseInt(count);
                                myNum++;
                                badgespan.text(myNum);
                            } else {
                                contactLi.append('<span class="badge">1</span>');
                            }
                            if(isContains(itemData.user_id,'miku_temp_')){
                                contactLi.find('.badge').addClass('badgeAnon');
                            }
                        }
                    }
                }
            }, function (ts3, message3) {console.log(message3);})
        })
    }

    //呼叫头部提醒
    function callInHeadTips(CallTitUL,data,isTemp){
        for (var j = 0,l = data.rows.length; j < l; j++) {
            var itemData3 = data.rows.item(j),
                _userId = itemData3.user_id,
                tempName = isTemp ? itemData3.em_name : '';
            //if(_userId == URL.param.userId && !status){
            //    l = l-1;
            //}
            // else{
            /**/
            var lielemCallTit = document.createElement("li");
            $(lielemCallTit).attr({
                //'id' : _userId,
                'class' : ' callTitle_'+_userId,
                'className' : '',
                'type' : 'chat',
                'displayName' : itemData3.session_id,
                'data-call-status':'1',
                'style': j > 3 ? 'display:none' : '',
                'data-time': bainx.formatDate('m-d h:i', new Date(itemData3.last_time)),
                'data-uloginenter':itemData3.login_entrance,
                'data-uid':_userId,
                'starttime':itemData3.start_time
            });
            lielemCallTit.onclick = function() {

                //upDateStatus(_userId,1);
                //status = 1;
                //$('#'+_userId).remove();
                //$('#csadUserMessageContainer_'+this.getAttribute('displayName')).remove();
                //handleNav($('.chatMessage'),_userId);

                var who = this.getAttribute('data-uid'),
                    sid = this.getAttribute('displayName');

                callToChat(who,isTemp,sid);

                //URL.assign(URL.csadCallCenterPage+'?status=0&userId='+this.getAttribute('displayName'));//跳转到呼叫中心页面
            };
            var imgelemCallTit = document.createElement("img");
            $(imgelemCallTit).attr({
                'class' : 'img-circle-50',
                'src':noPhoto
            });
            lielemCallTit.appendChild(imgelemCallTit);
            var spanelemCallTit = document.createElement("span");
            lielemCallTit.appendChild(spanelemCallTit);
            CallTitUL[0].appendChild(lielemCallTit);
            if(!isTemp){
                showNickPhoto(_userId,spanelemCallTit,imgelemCallTit,false)
            }
            else{
                spanelemCallTit.innerHTML = tempName;
            }
        }
        var callList = CallTitUL.find('li'),tempWord = isTemp ? '匿名' : '';
        if(callList.length > 0){
            CallTitUL.prev().show().html(tempWord+'呼叫用户(<span class="countNum">'+callList.length+'</span>)');
        }else{
            CallTitUL.prev().show().html('暂时没有'+tempWord+'用户呼叫！');
        }
        // }
        if(l > 4){
            CallTitUL.find('li').eq(3).addClass('nextAllHide');
            $('.nextAllHide ~ li').hide();
            var moreCallTit = document.createElement("span");
            $(moreCallTit).attr({
                'class' : 'callTitMore'
            });
            moreCallTit.innerHTML = '>>';
            CallTitUL[0].appendChild(moreCallTit);
        }


    }

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
        currentPageCon.find('.mainContainer').css('display','flex');
        currentPageCon.find('#nullchater').addClass('hide');
        getChatRecord(chatUserId);//获取聊天消息
        return newContent;
    };
    //获取聊天消息
    var getChatRecord = function(chatUserId){
        var sql = 'select * from chatRecord where (user_id = "'+chatUserId+'" )';
        db.transaction(function (trans) {
            trans.executeSql(sql, [], function (ts, data) {
                if (data) {
                    if(data.rows.length > 0){
                        for (var i = 0; i < data.rows.length; i++) {
                            var item = data.rows.item(i);
                            var msgLocal = JSON.parse(item.msgbody),
                                msgtext = msgLocal.data,
                                from = msgLocal.from,
                                to = msgLocal.to,
                                time = item.chat_timestamp;
                            if(msgtext && msgtext instanceof Array > 0){        //判断消息体是不是数组
                                msgtext = msgLocal;
                            }
                            //if(msgLocal.ext && msgLocal.ext.em_expression_id){     //大表情
                            //    msgtext = msgLocal.data
                            //}
                            if(msgLocal.filename){      //图片 || 语音
                                var  filename = msgLocal.filename;
                                if(msgLocal.length){  //音频
                                    var audio = document.createElement("audio");
                                    audio.controls = "controls";
                                    audio.innerHTML = "当前浏览器不支持播放此音频:" + filename;
                                    msgLocal.data = [ {
                                        type : 'audio',
                                        filename : filename || '',
                                        data : audio,
                                        audioShim: !window.Audio,
                                        length:msgLocal.length
                                    } ]
                                }else{
                                    var img = document.createElement("img");
                                    img.src = msgLocal.url;
                                    msgLocal.data = [ {
                                        type : 'pic',
                                        filename : filename || '',
                                        data : img
                                    } ]
                                }
                                msgtext = msgLocal
                            }
                            if(msgLocal.addr){      //位置
                                msgtext = msgLocal.addr;
                            }

                            if(from == curUserId){ //发送
                                if(msgLocal.ext && msgLocal.ext.MikuExpand){
                                    msgtext = msgLocal.msg;
                                    appendMsg(curUserId, item.user_id, msgtext,msgLocal.ext.MikuExpand,msgLocal,time);
                                }
                                else{
                                    appendMsg(curUserId, item.user_id, msgtext,'',msgLocal,time);
                                }
                            }
                            else{  //接收
                                if(!(msgLocal.ext && msgLocal.ext.MikuExpand == 'CallExpert')){
                                    appendMsg(from, item.user_id, msgtext,'',msgLocal,time);
                                }
                            }

                            $('.chat-content-p3 audio').each(function(){        //下载语音
                                var audio = $(this)[0];
                                if(msgLocal.length && msgLocal.filename){
                                    var options = msgLocal;
                                    options.onFileDownloadComplete = function(response, xhr) {
                                        var len = response.size;
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
                                            $(audio).next().click(function(){
                                                var tar = $(this);
                                                tar.addClass('flash');
                                                audio.play();
                                                setTimeout(function(){
                                                    tar.removeClass('flash');
                                                },len)
                                            })
                                            return;
                                        }
                                    };
                                    options.onFileDownloadError = function(e) {
                                        if(from == curUserId) { //发送
                                            appendMsg(curUserId, to, e.msg + ",下载音频" + filename + "失败",'','',time);
                                        }else{
                                            appendMsg(from, from, e.msg + ",下载音频" + filename + "失败");
                                        }
                                    };
                                    options.headers = {
                                        "Accept" : "audio/mp3"
                                    };
                                    Easemob.im.Helper.download(options);
                                }
                            })
                            //if(i == data.rows.length -1 && URL.param.response && !hasResponse){
                            //    ExpertRespond();
                            //}
                        }
                        //如果是发送消息之后还没获取聊天记录的，将未读消息放在最后面
                        //var currentDiv =  getContactChatDiv(chatUserId),
                        //    currentDivFirst = $(currentDiv).find('.chatMess').eq(0);
                        //if( hasCurWin &&  currentDivFirst.hasClass('left')){    //是用户发送的
                        //    for(var k = 0; k < parseInt($('#'+chatUserId).find('.badge').text());k++){
                        //        var $this = $(currentDiv).find('.chatMess').eq(k),
                        //            $thisId = $this.attr('data-msgid');
                        //        $(currentDiv).append($this.clone());
                        //        $('.chat_'+$thisId).remove();
                        //        //$this.remove();
                        //    }
                        //    hasCurWin = false;
                        //}
                    }
                    // else{
                    //if(URL.param.response && !hasResponse){
                    //    ExpertRespond();
                    //}
                    //  }
                }
            });
        });
    }

//显示当前选中联系人的聊天窗口div，并将该联系人在联系人列表中currentWin
    var showContactChatDiv = function(chatUserId,sid) {
        var contentDiv = getContactChatDiv(chatUserId);
        if (contentDiv == null) {
            contentDiv = createContactChatDiv(chatUserId);
            document.getElementById(msgCardDivId).appendChild(contentDiv);
            //将未读状态改为已读
            upDateRead(chatUserId)
        }
        contentDiv.style.display = "block";
        var numChatId = manageId(sid);
        var $this,outer;

        if($('.leftNav li.payVisit').hasClass('active')){
            $this = $('.leftNav li.payVisit');
            outer = $('#payVisit_Wrap');
            getPageStatus($this);
        }else{
            $this = $('.leftNav li.chatMessage');
            outer = $('#chatMessage_Wrap');
            getPageStatus($this);
        }

        //var outer = $('.leftNav li.payVisit').hasClass('active') ? $('#payVisit_Wrap') : $('#chatMessage_Wrap');
        //var outer = source == 3 ?  $('#payVisit_Wrap') : $('#chatMessage_Wrap');
        outer.find('.fillReportIframeChat').hide();
        var isTemp = isNaN(numChatId) ? true  : false,
            name = outer.find('.currentWin .message_main_item  span').text(),
            mobile = outer.find('.currentWin .message_main_item  span').data('mobile'),
            coopCode = outer.find('.currentWin').attr('coopCode');

        if(outer.find('#fillReportInchat'+numChatId).length == 0){
            outer.find('.rightNa').append('<iframe class="fillReportIframeChat" id="fillReportInchat'+numChatId+'" src="'+URL.questionnaireSurveyReportPage+'?id='+numChatId+'&name='+name+'&csadId='+curUserId+'&mobile='+mobile+'&isTemp='+isTemp+'&isNotReg=false&coopCode='+coopCode+'"></iframe>');
        }
        else{
            outer.find('#fillReportInchat'+numChatId).show();
        }

        //CsadUserMessage('.rightNa', numChatId,outer);
        //var isTemp = isNaN(numChatId) ? true  : false;
        //if(outer.find('#csadUserMessageContainer_'+numChatId).find('.containerQuestion').children().length == 0){
        //    csadQuestionnaireSurveyPage(numChatId,'',name,mobile,curUserId,isTemp,coopCode);
        //}

        //获取缓存中的用户信息
        var contactLi = document.getElementById(chatUserId);
        if (contactLi == null) {
            return;
        }
        $('li').removeClass('currentWin');
        contactLi.className = 'currentWin';
        var tpm;
        if(!isTemp){    //不是匿名
            //var chatUserIdM = chatUserId.split("_");
            //if(chatUserIdM.length > 1){
            //    chatUserIdM = parseInt(chatUserIdM[1]);
            //}
            tpm=CsadAddNotes.csadAddNotesHtml2(numChatId);
            var popHtml=CsadAddNotes.pop();
            outer.find('.addNotes').html(tpm);
            outer.find('.addnotesContent2').append(popHtml);
            CsadAddNotes.initAddNotes(numChatId);
        }
        else{
            tpm=CsadAddNotes.csadAddNotesHtml2('',isTemp);
            //var popHtml=CsadAddNotes.pop();
            outer.find('.addNotes').html(tpm);
            var currentObj = $('.currentWin').find('.userName');
            outer.find('#loginEntrance').text(loginEnter[currentObj.attr('data-uloginenter')]);
            outer.find('.addNotes .t_name').text(currentObj.text());
        }
        outer.find('.addNotes .t_name').attr('data-id',chatUserId)
    };

//对上一个联系人的聊天窗口div做隐藏处理，并将联系人列表中选择的联系人背景色置空
    var hiddenContactChatDiv = function(chatUserId) {
        // var contactLi = document.getElementById(chatUserId);
        // if (contactLi) {
        // contactLi.style.backgroundColor = "";
        // }
        var contentDiv = getContactChatDiv(chatUserId);
        if (contentDiv) {
            contentDiv.style.display = "none";
        }
    };
//切换联系人聊天窗口div
    var chooseContactDivClick = function(li,iscall,sid,curOpenUId,theFirst) {
        //theFirst  --点击应答之后跳转到聊天页面
        var chatUserId = li && li.getAttribute('type') == groupFlagMark ? li.getAttribute('id') : (curOpenUId ? curOpenUId :  li.getAttribute('id')),
            roomId = $(li).attr("roomId");
        //群聊
        if (chatUserId != curChatUserId) {
            if (curChatUserId == null) {
                showContactChatDiv(chatUserId,sid);
            } else {
                showContactChatDiv(chatUserId,sid);
                hiddenContactChatDiv(curChatUserId,sid);
            }
            curChatUserId = chatUserId;
        }
        //对默认的null-nouser div进行处理,走的这里说明联系人列表肯定不为空所以对默认的聊天div进行处理
        $('#null-nouser').css({
            "display" : "none"
        });
        currentPageCon.find('.mainContainer').css('display','flex');
        currentPageCon.find('#nullchater').addClass('hide');
        console.log(status,source,'1111111');
        //点击有未读消息对象时对未读消息提醒的处理
        //if(iscall){
        var obj;
        if(iscall){
            switch (source){
                case 1:
                    obj = $('.chatMessage');
                    chatListArr.remove(chatUserId);
                    break;
                case 2:
                    obj = $('.salesTracking');
                    saleListArr.remove(chatUserId);
                    break;
                case 3:
                    obj = $('.payVisit');
                    payVisitLisitArr.remove(chatUserId);
                    break;
                default:
                    obj = $('.chatMessage');
                    chatListArr.remove(chatUserId);
                    break;
            }
            var badgespanGroup = obj.find(".badgegroup"),
                badgespan = $('#'+chatUserId).children(".badge"),
                title = document.title;
            title = title.split('[');
            if (badgespanGroup && badgespanGroup.length > 0 &&  (badgespan && badgespan.length > 0)) {
                var badgeNum = parseInt(badgespanGroup.text());
                if(badgeNum > 1){
                    badgeNum--;
                    badgespanGroup.text(badgeNum);
                }else{
                    badgespanGroup.remove();
                    document.title = title[0];
                }
                // }
            }
            else{
                document.title = title[0];
            }

            if (badgespan && badgespan.length > 0) {
                badgespan.remove();
                var message_li = $('#'+chatUserId).find(".message_li");
                message_li.remove();
            }

        }
        if($('.callTitle_'+chatUserId).length > 0){
            $('.callTitle_'+chatUserId).remove();
            var callNum = $('.callCenter').find('.badgegroup').text();
            if(callNum > 1){
                $('.callCenter').find('.badgegroup').text(--callNum);
            }
            else{
                $('.callCenter').find('.badgegroup').remove();
            }
        }

        if(source == 3){
            $(li).find('.badge').remove();
            var callNum = $('.payVisit').find('.badgegroup').text();
            if(callNum > 1){
                $('.payVisit').find('.badgegroup').text(--callNum);
            }
            else{
                $('.payVisit').find('.badgegroup').remove();
            }
        }

        var curUnReadNum = $('#momogrouplistUL li').find('.badge').length;
        if(curUnReadNum == 0){
            $('.chatMessage').find('.badgegroup').remove();
        }
        else{
            $('.chatMessage').find('.badgegroup').text(curUnReadNum);
        }


        //将未读状态改为已读
        upDateRead(chatUserId)
        upDateStatus(chatUserId,1)
        insertOrUpdateSession(chatUserId,false);//修改消息来源

        if(theFirst){
            // messageTipsNav();
        }
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
    //发送消息之后的操作
    function sendMsgAfter(to,message,save){

        message.id = conn.getUniqueId();//生成本地消息id
        var chatType = 1;
        // 群组消息和个人消息的判断分支
        if (curChatUserId.indexOf(groupFlagMark) >= 0) {
            message.type = groupFlagMark;
            message.to = manageId(curChatUserId);
            message.ext.isExpert = 1;
            //to = manageId(to);
            chatType = 0;
        }

        insertOrUpdateSession(to,true);//修改消息来源
        upInsertTimeRec(to);//更新状态
        //insertSession(from,to,sqlSource,startTime,timestamp,stautsJ,readJ,isTemp,whoName,sessionId,loginEntrance,0);
        if(save){
            //存储文本数据
            var nowDate = new Date(),
                timestamp = nowDate.getTime();
            var isAnonymous = false;  //是否是匿名用户
            var messageJ = JSON.stringify(message);
            if(isContains(to,'miku_temp_')){
                isAnonymous = true;
            }
            //存储数据
            var  isTemp = isAnonymous ? 1 : 0,
                tempName = isAnonymous ? $('#'+to).find('.userName').text() : '';     //匿名用户名需要修改
            insertdbData(to,timestamp,1,1,messageJ,isTemp,tempName,0,chatType);
        }
    }

    var sendText = function(msg,isQuickReply) {
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
        // 群组消息和个人消息的判断分支
        if (curChatUserId.indexOf(groupFlagMark) >= 0) {
            options.type = groupFlagMark;
            options.to = manageId(to);
            options.ext = {isExpert: 1};
            //to = manageId(to);
        }

        var id = conn.getUniqueId();//生成本地消息id
        var msgB = new Easemob.im.EmMessage('txt', id);//创建文本消息

        msgB.set({
            msg: msg,
            to: to,
            success: function ( id,serverMsgId ) {
                console.log(id,serverMsgId)
            }//消息发送成功回调
        });
        if ( curChatUserId.indexOf(groupFlagMark) >= 0 ) {
            msgB.setGroup("groupchat");
        }
        conn.send(msgB.body);

        //options.success = function(res,serverMsgId ){
        //    console.log(res,serverMsgId);
        //}

        //easemobwebim-sdk发送文本消息的方法 to为发送给谁，meg为文本消息对象
        //conn.sendTextMessage(options);

        //当前登录人发送的信息在聊天窗口中原样显示
        var msgtext = Easemob.im.Utils.parseEmotions(encode(msg));
        options.from = curUserId;
        options.data = msgtext;
        options.id = conn.getUniqueId();//生成本地消息id
        sendMsgAfter(to,options,true);//发送消息之后对数据库的操作
        appendMsg(curUserId, to, msgtext,'',options);
        if(!isQuickReply) {
            turnoffFaces_box();
            msgInput.value = "";
            msgInput.focus();
        }
        setTimeout(function() {
            textSending = false;
        }, 1000);
    };

    //关闭对话closeTalking
    var closeTalking = function() {
        var to = curChatUserId;
        if (to == null) {
            return;
        }
        var options = {
            to : curChatUserId,
            msg : '专家已结束对话',
            ext : {"MikuExpand":"IsOver"},
            type : "chat"
        };
        //easemobwebim-sdk发送文本消息的方法 to为发送给谁，meg为文本消息对象
        conn.sendTextMessage(options);
        insertChatRec(false,1,to);
        var msgtext = Easemob.im.Utils.parseEmotions(encode(options.msg));
        appendMsg(curUserId, to, msgtext,options.ext.MikuExpand);
        upDateStatus(to,2);
        if(isContains(curChatUserId,'miku_temp_')){
            handelReception($('#momogrouplistUL .currentWin').attr('displayname'),2,curChatUserId);
        }
    };
    //专家响应 //发消息给呼叫的人。
    var ExpertRespond = function(from) {
        //curChatUserId = from ? from : URL.param.userId;
        var options = {
            to : from,
            msg : '您好，有什么可以帮您的么？我是您的私人管家'+$('#login_user').find('p').eq(0).text()+'，很高兴为您服务。',
            ext : {"MikuExpand":"ExpertRespond"},
            type : "chat"
        };
        conn.sendTextMessage(options);
    };
    var ExpertLeave = function(from) {
        var options = {
            to : from,
            msg : '[自动回复]亲~专家现在有事离开，请稍候联系',
            type : "chat",
            ext : {"MikuExpand":"ExpertRespondLeave"},
        };
        // 群组消息和个人消息的判断分支
        if (from.indexOf(groupFlagMark) >= 0) {
            options.type = groupFlagMark;
            options.to = manageId(from);
            options.ext = {isExpert: 1};
        }
        conn.sendTextMessage(options);
    };

    //发送文本消息 && 扩展消息
    function sendMessage(options,txt){
        var to = curChatUserId;
        if (to == null) {
            return;
        }
        // 群组消息和个人消息的判断分支
        if (curChatUserId.indexOf(groupFlagMark) >= 0) {
            options.type = groupFlagMark;
            options.to = manageId(to);
            options.ext.isExpert = 1;
            //to = manageId(to);
        }
        //easemobwebim-sdk发送文本消息的方法 to为发送给谁，meg为文本消息对象
        conn.sendTextMessage(options);
        options.id = conn.getUniqueId();//生成本地消息id
        var msgtext = Easemob.im.Utils.parseEmotions(encode(options.msg));
        if(txt){
            options.data = options.msg;
            appendMsg(curUserId, to, msgtext);
            turnoffFaces_box();
        }
        else{
            appendMsg(curUserId, to, msgtext,options.ext.MikuExpand,options);
        }
        options.from = curUserId;
        sendMsgAfter(to,options,true);//发送消息之后对数据库的操作
    }

    //发送盒子
    var sendBox = function(boxName,BoxId,BoxImgUrl) {
        var options = {
            to : curChatUserId,
            msg : boxName.toString(),
            ext : {"MikuExpand":"CheckBox","BoxId":BoxId,BoxImgUrl:BoxImgUrl},
            type : "chat"
        };
        sendMessage(options,false);
    };

    //发送报告
    var sendReport = function(detectName,detectId,csadName,dateCreated) {

        var options = {
            to : curChatUserId,
            msg : detectName.toString(),
            ext : {"MikuExpand":"UserReport","UserReport_id":detectId.toString(),"UserReport_userName":detectName.toString(),"UserReport_expertName":csadName,"UserReport_date":dateCreated},
            type : "chat"
        };
        sendMessage(options,false);
    };

    //发送命令消息。显示是否正在输入中
    var sendActionMsg = function(msg,sendMan,curSessionId){
        var to = sendMan ? sendMan : curChatUserId;
        if (to == null) {
            return;
        }
        var options = {
            to : to,
            msg : '',
            action:'input',
            ext : {"inputing":msg},
            type : "chat"
        };

        // 群组消息和个人消息的判断分支
        if(curChatUserId){
            if (curChatUserId.indexOf(groupFlagMark) >= 0) {
                options.type = groupFlagMark;
                options.to = manageId(to);
                options.ext.isExpert = 1;
            }
        }


        if(msg == 'OnLine'){        //发送是否在线的消息
            options.action = msg;
            options.ext = '';

        }
        //easemobwebim-sdk发送文本消息的方法 to为发送给谁，meg为文本消息对象
        conn.sendCmdMessage(options);

        var item = {
            id:to,
            time:0,
            sessionId:curSessionId
        }
        waittingMan.push(item);
        localStorage.setItem('waittingMan',JSON.stringify(waittingMan));

        //if(msg == 'OnLine') {        //发送是否在线的消息
        //    setTimeout(function(){
        //        if(!handleCmdMessage()){    //10s后没有收到返回来的消息。则说明离线
        //            var sessionId = message.ext.sessionId;
        //            handelReception(sessionId,2,message.from);
        //        }
        //    },1000*10)
        //}
    }

    //处理发送消息出去之后监听返回来的数据
    var isOnLine = false;
    setInterval(function(){
        if(waittingMan.length > 0){
            $.each(waittingMan,function(k,item){
                item.time += 1000;
                if(item.time >= 1000*3 && !isOnLine){ //3s后没有收到返回来的消息。则说明离线
                    handelReception(item.sessionId,2,item.id);
                    isOnLine = false;
                    waittingMan.remove(item);
                }
            })
        }
    },1000)

    var pictype = {
        "jpg" : true,
        "gif" : true,
        "png" : true,
        "bmp" : true
    };
    var send = function ($this) {
        var fI = $('#fileInput'),
            typeAccept;
        switch ( $this.attr('type') ) {
            case 'img'://选择文件的类型
                typeAccept = 'image/*';
                break;
            case 'audio':
                typeAccept = 'audio/*';
                break;

        }
        fI.attr('accept',typeAccept);
        fI.val('').attr('data-type', $this.attr('type')).click();
    };
    //$('body').on('change','#fileInput',function(){
    //    switch ( this.getAttribute('data-type') ) {
    //        case 'img':
    //            sendPic();
    //            break;
    //        //case 'audio':
    //        //    sendAudio();
    //        //    break;
    //    }
    //});

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
                // from:curUserId,
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
                    var saveData = {
                        type:"chat",
                        from:curUserId,
                        to:to,
                        url: data.uri + '/' + data.entities[0].uuid,
                        fileInputId : 'fileInput',
                        filename : flashFilename || filename,
                    }
                    if (curChatUserId.indexOf(groupFlagMark) >= 0) {
                        saveData.type = groupFlagMark;
                        saveData.to = manageId(to);
                        saveData.ext = {isExpert:1};
                        //to = manageId(to);
                    }
                    sendMsgAfter(to,saveData,true);//发送消息之后对数据库的操作
                    var option={
                        data : [{
                            type : 'pic',
                            filename : filename,
                            data : img
                        }],
                        id: conn.getUniqueId()
                    }
                    appendMsg(curUserId, to, {
                        data : [{
                            type : 'pic',
                            filename : filename,
                            data : img
                        }]
                    },'',option);
                },
                flashUpload: flashPicUpload
            };
            if (curChatUserId.indexOf(groupFlagMark) >= 0) {
                opt.type = groupFlagMark;
                opt.to = manageId(to);
                opt.ext = {isExpert:1};
                //to = manageId(to);
            }
            conn.sendPicture(opt);

            return;
        }
        alert("不支持此图片类型" + filetype);
    };
//easemobwebim-sdk收到文本消息的回调方法的实现
    var handleTextMessage = function(message) {
        var from = message.from;//消息的发送者
        var mestype = message.type;//消息发送的类型是群组消息还是个人消息
        var messageContent = message.data;//文本消息体

        //TODO  根据消息体的to值去定位那个群组的聊天记录

        //离开
        if(message.ext && message.ext.ExpertLeave){
            ExpertLeave(from);
            // return false;
        }

        //呼叫   status为0
        if(message.ext && message.ext.MikuExpand == 'CallExpert'){
            if(!$('#momogrouplistUL').find('#'+from).hasClass('currentWin')){//呼叫消息并且不是正在聊天的。
                upDateStatus(from,0)
                if(message.ext.sessionId){
                    handelReception(message.ext.sessionId,1,from);
                }
            }
            if(!(message.ext.CancelRespond ||  message.ext.ExpertLeave)){
                ExpertRespond(from);
            }
        }



        //群组
        //超时或者不在线不显示
        if(!(message.ext && (message.ext.MikuExpand == 'OverTime' || message.ext.MikuExpand == 'OffLine' ))){
            showMessageTips(from,message);
            if(!(message.ext && (message.ext.MikuExpand == 'CallExpert'))){
                if (mestype == groupFlagMark || mestype == chatRoomMark) {
                    appendMsg(message.from, mestype + '_' + message.to, messageContent,'',message);
                    return false;
                }
                if(message.ext && message.ext.MikuExpand){
                    appendMsg(from, from, messageContent,message.ext.MikuExpand,message);
                }
                else {
                    appendMsg(from, from, messageContent,'',message);
                }
            }
        }
    };
    //显示消息提示
    var showMessageTips = function(who,message){


        var  _type = message.type == groupFlagMark ? 0 : 1,//0为群聊
            _userId = message.to,
            who =  _type == 0 ? _userId.indexOf(groupFlagMark) < 0 ?  groupFlagMark + '_' + _userId : _userId : who,
            tit = document.title;
        if(tit.indexOf(newMsgTips) <= 0 && !$('#'+who).hasClass('currentWin') && status == 1){
            document.title = titleDom + newMsgTips;
        }
        var isAnonymous = false,  //是否是匿名用户
            callTitle = $('#call_title'),//
            perpleNum; //人数
        if(isContains(who,'miku_temp_')){
            isAnonymous = true;
            callTitle = $('#call_title_anonymous');
        }

        if(isAnonymous){
            currentsendId == message.from;
            currentsendSessionId = message.sessionId;
        }

        var cache = {};
        if (who in cache) {
            return;
        }
        cache[who] = true;
        var lielem = document.createElement("li");
        callInStatus = true;

        if(status == 0){
            $('#callCenter').show();
            $('#noCallMsg').hide();
        }

        //收到消息的提示音
        if($('#tipsSound').length == 0){
            $('body').append('<audio id="tipsSound" autoplay="autoplay" src="http://ninelab.b0.upaiyun.com/common/images/personalTailor/tips.wav"></audio>');
        }
        else{
            $('#tipsSound')[0].play();
        }

        var momogrouplistUL = $('#momogrouplistUL'),
            contactNav,contactSource;

        var //db = getCurrentDb(),
            isNotCall = true,
            sqlSource,
            whoName = message.ext && message.ext.groupName ? message.ext.groupName : ( isAnonymous ? (message.ext && message.ext.tel ? message.ext.tel : '匿名用户_'+getLoacalTimeString()) : ''),
            loginEntrance = isAnonymous ? (message.ext && message.ext.flag ? message.ext.flag : 2 ): '';

        //判断是否是呼叫消息
        var isExistList = false,
            isnotChatting = !(status == 1 && source != 2 && momogrouplistUL.find('#'+who).hasClass('currentWin'));

        if(callTitle.find('li').length > 0){
            callTitle.find('li').each(function () {         //存不存在
                if ($(this).attr('data-uid') == who) {
                    isExistList = true;
                    return false
                }
            })
        }

        if(isnotChatting && message &&  message.ext && message.ext.MikuExpand == 'CallExpert'){

            if(!isExistList){       //不存在新建 收到的是呼叫消息。。&& 并且不是正在聊天的
                var hasFull = callTitle.find('li').length >= 4 ? 'display:none' : '';
                var _sid = isAnonymous ? message.ext.sessionId : manageId(who);

                $(lielem).attr({
                    //'id' : who,
                    'class' : '  callTitle_'+who,
                    'className' : '',
                    'type' : 'chat',
                    'displayName' : _sid,
                    'style': hasFull,
                    'data-call-status':'1',
                    'data-time':getLoacalTimeString(),
                    'data-uloginenter':loginEntrance,
                    'data-uid':who,
                    'starttime':new Date().getTime()
                });

                lielem.onclick = function() {
                    var sid = this.getAttribute('displayName');
                    callToChat(who,isAnonymous,sid)
                };
                //呼叫头部的创建
                callTipHeadItem(isAnonymous,true,message,who,lielem,callTitle,whoName);
                isExistList = true;
            }
        }
        if(isExistList){
            isNotCall = false;
            contactNav = '.callCenter';
            //呼叫头部的消息提醒
            callTipHeadItem(isAnonymous,false,message,who);




        }
        else{
            isNotCall = true;
            contactNav = '.chatMessage';
        }


        var sid = message && message.ext && message.ext.sessionId ? message.ext.sessionId : who;

        //如果列表没有用户。。。则创建
        var isExistInList = true;// 存在在列表中
        if(message &&  message.ext && message.ext.MikuExpand == 'CallExpert'){     //呼叫专家
            if($('#callCenterUL').find('#'+who).length == 0 && isnotChatting){
                createMomogrouplistUL(who, message);
                isExistInList = false;
            }
            //如果是匿名用户
            if(message.ext.demand){
                var optionsList = [
                        {
                            id:0,
                            optionName: "敏感肌"
                        },{
                            id:1,
                            optionName: "补水"
                        },{
                            id:2,
                            optionName: "美白"
                        },{
                            id:3,
                            optionName: "油性肌"
                        },{
                            id:4,
                            optionName: "过敏肌"
                        },{
                            id:5,
                            optionName: "混合肌"
                        },{
                            id:6,
                            optionName: "痘痘肌"
                        },{
                            id:7,
                            optionName: "抗衰老"
                        },{
                            id:8,
                            optionName: "祛斑"
                        },{
                            id:9,
                            optionName: "眼部特护"
                        }],
                    demandId = message.ext.demand;
                $.each(optionsList,function(j,item){
                    if(item.optionName == message.ext.demand){
                        demandId = item.id;
                        return false
                    }
                })


                if(isAnonymous){
                    sid = message.ext.sessionId;
                    var dataQ = {
                            sessionId: sid
                        },
                        dpId = 0;
                    Data.tempfinalUserData(dataQ).done(function(res){
                        var getData = res.data ? res.data : {};
                        if(res.flag == 1){
                            dpId = res.data.id;

                        }
                        //var dataQinsert = questionnaireAnswer(getData);
                        getData.sessionId=message.ext.sessionId;
                        getData.flag=1;
                        getData.dpId=dpId;
                        getData.demand=demandId;
                        getData.sex=message.ext.sex ? message.ext.sex : 2;
                        getData.mobile=message.ext.tel  ? message.ext.tel : (res.data && res.data.mobile ? res.data.mobile :　'');
                        Data.tempSaveOneTempRecord(getData).done(function(res){
                        })
                    })
                }
                else{
                    var data = {
                        userId : manageId(who)
                    }
                    Data.getLastUserDetectDataByUserId(data).done(function(res){
                        var dpId = res.flag == 4 ?  (res.boxId ? res.data.id : 0 ) : res.data.id ;
                        dpId = res.flag == 0 ? 0 : dpId;
                        var data = res.data;
                        data.flag = dpId == 0 ? -1 : 3;
                        data.demand=demandId;
                        data.dpId=dpId;
                        data.userId=manageId(who);
                        Data.insertOneDetectQuestionData(data).done(function(){
                        })
                    })
                }
            }
        }
        else{
            var curCId = who,callInWho = false;
            if($('.callWrap li').length > 0){
                $('.callWrap li').each(function(){
                    if ($(this).hasClass('callTitle_'+curCId)) {
                        callInWho = true
                    }
                })
            }
            if (momogrouplistUL.find('#'+who).length == 0 &&  !callInWho) {
                createMomogrouplistUL(who, message);
                isExistInList = false;
            }
        }
        var $who = $('#'+who);

        //不是呼叫消息 && 不是正在聊天
        if (isnotChatting) {
            if($(contactNav).find('.badgegroup').length == 0){
                $(contactNav).append('<span class="badgegroup">1</span>');
            }
            else{
                var callInNum = $('#call_title li').length + $('#call_title_anonymous li').length;//呼叫消息数
                var num = 0;
                if(contactNav != '.callCenter'){
                    if(momogrouplistUL.find('li').length > 0){
                        num = momogrouplistUL.find('.badge').length;
                    }
                }
                else{
                    num = callInNum;
                }
                if(num > 0) {
                    $(contactNav).find('.badgegroup').text(num);
                }
            }
            if(!(message &&  message.ext && (message.ext.MikuExpand ==  'CallExpert'))){
                //如果是存在在列表中的，来消息的时候把他放在列表的最前面
                if(isExistInList){
                    var msgNum = parseInt($who.find('.badge').text());
                    var momogrouplistULQ = $who.parent().attr('id'),
                        nowT = $who.find('.message_main_time_span'),
                        uSessionId = $who.attr('displayname'),
                        uLoginEnter = $who.find('.userName').data('uloginenter'),
                        starttime = $who.attr('starttime'),
                        tel = $who.find('.userName').text();
                    message.type_chat = message.type == 'chat' ? 1 : 0;
                    message.curChatId = groupFlagMark + '_' + message.to;
                    message.coopCode = message.ext && message.ext.coopCode ? message.ext.coopCode : '';
                    var isNotC = false;
                    if($who.hasClass('currentWin')){
                        isNotC = true;
                    }
                    $who.remove();
                    getChatListMember(who,momogrouplistULQ,nowT,tel,uSessionId,uLoginEnter,message,starttime,1);
                    $who =  $('#'+who);
                    if(msgNum > 0){
                        $who.append('<span class="badge">'+msgNum+'</span>');
                    }
                    if(isNotC){
                        $who.addClass('currentWin');
                    }
                }

                messageTipAndContent(message)
                //var badgespan = $who.children(".badge");
                //if (badgespan && badgespan.length > 0 ) {
                //    var count = badgespan.text();
                //    var myNum = parseInt(count);
                //    myNum++;
                //    badgespan.text(myNum);
                //}
                //else {
                //    $who.append('<span class="badge">1</span>');
                //}
                //if(isAnonymous){
                //    $who.children(".badge").addClass('badgeAnon');
                //}
            }
        }
        $who.find('.message_main_time_span').text(getLoacalTimeString());

        //
        //桌面提醒
        if(!(message &&  message.ext && (message.ext.MikuExpand ==  'CallExpert'))){
            var msgData,
                _chatType,
                messageTip;
            if(message.filename){
                _chatType = 'pic';
                if(message.file_length){
                    _chatType = 'audio';
                }
            }else{
                msgData = message.data[0];
                _chatType = msgData.type;
            }
            switch (_chatType){
                case 'emotion':
                    messageTip = '[表情]';
                    break;
                case 'pic':
                    messageTip = '[图片]';
                    break;
                case 'audio':
                    messageTip = '[语音]';
                    break;
                case 'txt':
                    messageTip = msgData.data;
                    break;
                default:
                    messageTip = message.data;
                    break;
            }
            deskupTips(who,messageTip);
        }
        //存储文本数据
        var nowDate = new Date(),
            timestamp = nowDate.getTime(),
            from = message.from;//消息的发送者
        var messageJ = JSON.stringify(message),
            readJ = isnotChatting ? 0 :  1,
            stautsJ = _type == 0 ? 1 :(isNotCall ? 1 : 0),
            coopCode = message.ext && message.ext.coopCode ? message.ext.coopCode : '',
            isTemp = isAnonymous ? 1 : 0,
            sessionId = isAnonymous ? message.ext.sessionId : '',
            startTime = isNotCall ? timestamp : $who.attr('starttime');
        var isCallMsg = (message && message.ext && message.ext.MikuExpand == 'CallExpert') ? 1 : 0;
        insertSession(from,1,startTime,timestamp,stautsJ,readJ,isTemp,whoName,sessionId,loginEntrance,0,who,_type,coopCode);
        insertdbData(who,timestamp,readJ,stautsJ,messageJ,isTemp,whoName,isCallMsg,_type);

    }

    //桌面消息提醒
    function deskupTips(who,msg){
        if (window.Notification) {
            if(notification){
                notification.close();
            }
            var userNickName = showNickPhoto(who).name,
                photo = showNickPhoto(who).photo;
            var popNotice = function() {
                if (Notification.permission == "granted") {
                    notification = new Notification("您有未读消息：", {
                        body: userNickName + '说: '+msg,
                        icon: photo,
                        //renotify:true,
                        //tag:notification,
                        //silent:true,
                        //sound:'http://ninelab.b0.upaiyun.com/common/images/personalTailor/tips.wav',

                    });

                    notification.onclick = function() {
                        notification.close();
                    };
                }
            };

            //button.onclick = function() {
            if (Notification.permission == "granted") {
                popNotice();
            } else if (Notification.permission != "denied") {
                Notification.requestPermission(function (permission) {
                    popNotice();
                });
            }
            // };
        } else {
            alert('浏览器不支持桌面提醒');
        }
    }

    //呼叫用户头像 点击之后跳转到聊天页面，删除当前呼叫用户，修改呼叫数量
    function callToChat(who,isAnonymous,sid,isGroupList){

        status = 0; //先变为0处理页面元素的显示。。
        if(status == 0){

            var callTitObj  = $('.call_title'),
                word = '';

            if(isAnonymous){
                callTitObj = $('.call_title_anonymous');
                word = '匿名';
            }
            else{
                sid = manageId(sid);
            }
            var　num = parseInt(callTitObj.find('.countNum').text());
            if(num==1){
                callTitObj.find('p').text('暂时没有'+word+'用户呼叫!');
            }else{
                callTitObj.find('.countNum').text(--num);
            }
            $('#callCenter_Wrap').find('#csadUserMessageContainer_'+sid).remove();

            //聊天页面加联系人
            if($('#chatMessage_Wrap').children().length == 0){//还没有聊天页面
                $('.leftNav li').eq(1).find('i').click();
            }

            //var lielem = $('<li>').attr({
            //    'id' :who,
            //    'class' : '',
            //    'className' : '',
            //    'type' : 'chat',
            //    'displayName' : sid
            //}).click(function() {
            //    $(this).addClass('currentWin').siblings().removeClass('currentWin');
            //    chooseContactDivClick(this,true,sid,who);
            //});
            //
            //$('#momogrouplistUL').prepend(lielem);
            if($('#momogrouplistUL').find('#'+who).length == 0){
                var tar = $('#'+who),_times,uName,uSessionId,uLoginEnter,itemData,timestrap;
                if(tar.length > 0){
                    _times = tar.find('.message_main_time_span').text();
                    uName =  tar.find('.userName').text();
                    uSessionId = tar.attr('displayname');
                    uLoginEnter = tar.find('.userName').attr('data-uloginenter');
                    itemData ={
                        type_chat:1,
                        curChatId:who
                    };
                    timestrap = tar.attr('starttime');
                    if(!isGroupList){
                        tar.remove();
                    }
                }
                else{
                    tar = $('.callTitle_'+sid);
                    _times = tar.data('time');
                    uName =  tar.find('span').eq(0).text();
                    uSessionId = sid;
                    uLoginEnter = tar.attr('data-uloginenter');
                    itemData ={
                        type_chat:1,
                        curChatId:who
                    };
                    timestrap = tar.attr('starttime')
                }
                getChatListMember(who,'momogrouplistUL',_times,uName,uSessionId,uLoginEnter,itemData,timestrap,1)
            }

            //$('#'+who).find('.responseBtn').remove();
            //if(isContains(who,'miku_temp_')){
            //    $('#'+who).find('.message_main_time').append('<span class="isTempIcon"></span>');
            //}

            if($('#callCenterUL li').length == 0){
                $('#noCallMsg').show();
                $('#callCenter').hide();
                $('#callCenter_Wrap').find('.csadCallInUserMessageContainer').remove();
            }
        }
        upDateStatus(who,1);
        status = 1;
        handleNav($('.chatMessage'),who);



        // URL.assign(URL.csadCallCenterPage+'?status=0&userId='+this.getAttribute('displayName'));//跳转到呼叫中心页面
    }

    //呼叫提示头部(单个)
    function callTipHeadItem(isAnonymous,create,message,who,lielem,callTitle,temp_name){

        //如果是呼叫的。刚好在聊天页面上的并且不是正在对话的，将其删除,显示第一个
        var chatWrap = $('#chatMessage_Wrap'),$whoc = chatWrap.find('#'+who),itemUnreadNum = 0;
        if(create){
            if (!($whoc.hasClass('currentWin') && status == 1 && source == 1)) {
                var sid = $whoc.attr('displayname');
                chatWrap.find('#csadUserMessageContainer_'+sid).remove();
                itemUnreadNum = $whoc.find('.badge').text();
                $whoc.remove();
                //去掉聊天列表的消息提醒
                var chatBadgeG = $('li.chatMessage').find('.badgegroup');
                if( chatBadgeG.length > 0){
                    var chatBadgeLi = $('#momogrouplistUL li').find('badge').length;
                    if(chatBadgeLi == 0){
                        chatBadgeG.remove();
                    }
                    else{
                        chatBadgeG.text(--chatBadgeLi);
                    }
                }

                var $theFirst =  $('#momogrouplistUL li').eq(0);
                if($theFirst.length > 0){
                    $theFirst.addClass('currentWin');
                    var firstId = $theFirst.attr('id');
                    sid = $theFirst.attr('displayname');
                    var $documentTheFirst = $theFirst[0];
                    chooseContactDivClick($documentTheFirst,true,sid,firstId);
                }
                else{
                    chatWrap.find('#nullchater').show();
                    chatWrap.find('.mainContainer').css('display','none');
                }
            }
            var momogrouplistUL = isAnonymous ? $('#call_title_anonymous')[0] : $('#call_title')[0];
            var imgelem = document.createElement("img");
            $(imgelem).attr({
                'class': 'img-circle-50',
                'src': noPhoto
            });
            lielem.appendChild(imgelem);
            var spanelem = document.createElement("span");
            spanelem.innerHTML = who;
            lielem.appendChild(spanelem);
            if(itemUnreadNum > 0){
                var slem = document.createElement("span");
                $(slem).attr({
                    'class':'badge'
                }).text(itemUnreadNum);
                lielem.appendChild(slem);
            }

            momogrouplistUL.appendChild(lielem);
            var callList = callTitle.find('li');
            if (callList.length > 0) {
                var anonTxt = isAnonymous ? '匿名' : '';
                callTitle.parent().find('p').show().html('呼叫'+anonTxt+'用户(<span class="countNum">' + callList.length + '</span>)');
            }
            //else {
            //    $('.call_title p').show().html('暂时没有用户呼叫！');
            //}
            if(isAnonymous){
                spanelem.innerHTML = temp_name;
            }
            else{

                showNickPhoto(who,spanelem,imgelem,false)
            }
        }
        // }

        //呼叫头部的消息
        if(!(message.ext && message.ext.MikuExpand == 'CallExpert') && !create){
            var contactLi = $('.callTitle_' + who);
            var badgespan = contactLi.children(".badge");
            if (badgespan && badgespan.length > 0 ) {
                var count = badgespan.text();
                var myNum = parseInt(count);
                myNum++;
                badgespan.text(myNum);
            }
            else {
                contactLi.append('<span class="badge">1</span>');
            }
            if(isAnonymous){
                contactLi.children(".badge").addClass('badgeAnon');
            }
        }

    }

//easemobwebim-sdk收到表情消息的回调方法的实现，message为表情符号和文本的消息对象，文本和表情符号sdk中做了统一的处理，不需要用户自己区别字符是文本还是表情符号。
    var handleEmotion = function(message) {
        var from = message.from;
        var room = message.to;
        var mestype = message.type;//消息发送的类型是群组消息还是个人消息
        showMessageTips(from,message);
        // appendMsg(from, from, message);
        //群组
        if (mestype == groupFlagMark || mestype == chatRoomMark) {
            appendMsg(message.from, mestype + '_' + message.to, message,'',message);
        } else {
            appendMsg(from, from, message,'',message);
        }

    };
//easemobwebim-sdk收到图片消息的回调方法的实现
    var handlePictureMessage = function(message) {
        var filename = message.filename;//文件名称，带文件扩展名
        var from = message.from;//文件的发送者
        var mestype = message.type;//消息发送的类型是群组消息还是个人消息
        var contactDivId = from;
        if (mestype == groupFlagMark || mestype == chatRoomMark) {
            contactDivId = mestype + '_' + message.to;
        }
        var options = message;

        var img = document.createElement("img");
        img.src = message.url;
        showMessageTips(from,message);
        appendMsg(from, contactDivId, {
            data : [ {
                type : 'pic',
                filename : filename || '',
                data : img
            } ]
        },'',message);
        //将发送的图片放在问卷上
        var _id = manageId(from);
        if(from.indexOf('miku_temp') >=0){      //匿名用户
            _id = $('.currentWin').attr('displayname');
        }
        var dataUrl = {
            url:message.url,
            type:6
        }
        Data.upYunUploadPicByUrl(dataUrl).done(function(res){
            var targetP =  $('#chatMessage_Wrap').find('#csadUserMessageContainer_'+_id).find('.questionAnalysis'),
                imgtpl = '<dd class="active fromIM"><img src="'+res.picUrl+'"><i class="deleteImg"></i></dd>';
            //targetP.find('.active').length > 0 ? targetP.find('.active').after(imgtpl) : targetP.find('dl').prepend(imgtpl);
            targetP.find('.addPic').parent().before(imgtpl);
        })

        //console.log(message.url)
    };

//easemobwebim-sdk收到音频消息回调方法的实现
    var handleAudioMessage = function(message) {
        var filename = message.filename;
        var filetype = message.filetype;
        var from = message.from;
        var mestype = message.type;//消息发送的类型是群组消息还是个人消息
        var contactDivId = from;
        if (mestype == groupFlagMark || mestype == chatRoomMark) {
            contactDivId = mestype + '_' + message.to;
        }
        var audio = document.createElement("audio");
        audio.controls = "controls";
        audio.innerHTML = "当前浏览器不支持播放此音频:" + filename;
        //audio.src = message.url;
        showMessageTips(from,message);
        appendMsg(from, contactDivId, {
            data : [ {
                type : 'audio',
                filename : filename || '',
                data : audio,
                audioShim: !window.Audio,
                length:message.length
            } ]
        },'',message);/**/
        var options = message;
        options.onFileDownloadComplete = function(response, xhr) {
            var len = response.size,
                objectURL = Easemob.im.Helper.parseDownloadResponse.call(this, response);
            if (Easemob.im.Helper.getIEVersion != 9 && window.Audio) {
                audio.onload = function() {
                    audio.onload = null;
                    window.URL && window.URL.revokeObjectURL && window.URL.revokeObjectURL(audio.src);
                };
                audio.onerror = function() {
                    audio.onerror = null;
                };
                audio.src = objectURL;
                //$(audio).next().onclick = function(){
                //    audio.play();
                //}

                $(audio).next().click(function(){
                    var tar = $(this);
                    tar.addClass('flash');
                    audio.play();
                    setTimeout(function(){
                        tar.removeClass('flash');
                    },len)
                })


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

    var handleLocationMessage = function(message) {
        var from = message.from;
        var to = message.to;
        var mestype = message.type;
        var content = message.addr;

        showMessageTips(from,message);
        if (mestype == groupFlagMark || mestype == chatRoomMark) {
            appendMsg(from, mestype + '_' + message.to, content,'',message);
        } else {
            appendMsg(from, from, content);
        }

    };

    //收到命令消息
    var handleCmdMessage = function(message){
        // var isOnLine = false;
        if(message.action == 'OnLine'){         //收到来自用户判断是否在线的消息
            isOnLine == true;
            //收到的就清掉
            $.each(waittingMan,function(j,item){
                if(item.id == message.from){
                    waittingMan.remove(item);
                }
            })
            console.log(waittingMan+'等待的人');
            if(waittingMan.length > 0){
                localStorage.setItem('waittingMan',JSON.stringify(waittingMan));
            }
            else{
                localStorage.removeItem('waittingMan');
            }

            //var sessionId = message.ext.sessionId;
            //handelReception(sessionId,2,message.from);
        }
        //return isOnLine
    }



    //每隔10s 发送一条测试用户是否在线的消息
    var countTime = setInterval(function(){     //每秒增加时间
        if(receiveMan.length > 0){
            console.log(receiveMan+'接待的人');
            $.each(receiveMan,function(k,item){
                item.time += 1000;
                //if(item.id == currentsendId){
                //    item.time = 0;
                //}
                if(item.time >= 1000*10){
                    sendActionMsg('OnLine',item.id,item.sessionId);
                    item.time = 0;
                }
            })
        }
        //else{
        //    clearInterval(countTime);
        //}
    },1000);


    //处理专家接待人数
    var handelReception = function(sessionId,flagH,to){

        if(flagH == 2 && receiveMan.length == 0){
            return false;
        }
        var data = {
            flag:flagH,
            sessionId:sessionId,
            emUserName:curUserId
        }
        Data.doTempUserToCsadFirst(data).done(function(){
            console.log('操作对话成功'+flagH);
            if(flagH == 1){
                var man = {
                    id:to,
                    time:0,
                    sessionId:sessionId
                }
                receiveMan.push(man);
            }
            else{
                $.each(receiveMan,function(j,item){
                    if(item.id == to){
                        receiveMan.remove(item);
                        //waittingMan.remove(item);
                    }
                })
            }
            if(receiveMan.length > 0){
                localStorage.setItem('receiveMan',JSON.stringify(receiveMan));
            }
            else{
                localStorage.removeItem('receiveMan');
            }
            if(waittingMan.length > 0){
                localStorage.setItem('waittingMan',JSON.stringify(waittingMan));
            }
            else{
                localStorage.removeItem('waittingMan');
            }
        })
    }


//收到陌生人消息时创建陌生人列表
    function createMomogrouplistUL(who, message) {
        var cache = {};
        if (who in cache) {
            return;
        }
        cache[who] = true;
        callInStatus = true;
        var isTemp = isContains(who,'miku_temp') ? true : false;
        var momogrouplistUL,
            nowT = getLoacalTimeString(),
        //callOrList = false,
            uSessionId = message && message.ext && message.ext.sessionId ? message.ext.sessionId : '',
            uLoginEnter = message && message.ext && message.ext.flag ? message.ext.flag : '',
            tel = message.ext && message.ext.groupName ?  message.ext.groupName : message && message.ext && message.ext.tel ? message.ext.tel : '匿名用户_'+nowT;
        if(message &&  message.ext && message.ext.MikuExpand == 'CallExpert'){
            momogrouplistUL = "callCenterUL";
            //呼叫中心如果没内容。。。
            //if($('#callCenter_Wrap').children().length == 0){//还没有聊天页面
            //    var template = '<section class="row callInCenterC"><div class="accordion-inner" id="callCenter" ><ul id="callCenterUL" class="chat03_content_ul"></ul></div><div id="noCallMsg" style="display:none">暂时没有用户呼叫！</div> </section> </section>'
            //    $('#callCenter_Wrap').append(template);
            //    buildStrangerDiv("callCenter","callCenterUL");
            //}
            //$('#noCallMsg').hide();
            //$('#callCenterUL').show();
            //callOrList = true;
        }
        else{
            momogrouplistUL = "momogrouplistUL";
            //uSessionId = uItem.sessionId;
        }

        message.type_chat = message.type == 'chat' ? 1 : 0;
        message.curChatId = groupFlagMark + '_' + message.to;
        message.coopCode = message.ext && message.ext.coopCode ? message.ext.coopCode : '';
        getChatListMember(who,momogrouplistUL,nowT,tel,uSessionId,uLoginEnter,message,new Date().getTime(),1);

        //之前没有呼叫用户，然后添加上去，需要展开用户信息
        if($('#callCenter li').length == 1){
            callShowUserOtherMsg($('#'+who).attr('displayName'));
        }

        //var  _to =  message.type_chat == 0 ? message.curChatId.indexOf(groupFlagMark) < 0 ?  groupFlagMark + '_' + to : to : who;
        //var contactLi = $('#' + who);///呼叫中心的消息提示
        //if(status == '0' && !( message.ext && message.ext.MikuExpand == 'CallExpert')){
        //    contactLi.append('<span class="badge">1</span>');
        //    if(isTemp){
        //        contactLi.children(".badge").addClass('badgeAnon');
        //    }
        //}
    }

    //昵称头像显示
    function showNickPhoto(who,spanelem,imgelem,setMobile,isNext){

        var isNotcontains = isNext ?  1 : 2,
            name='匿名用户', photo=noPhoto;
        $.each(membersList, function (i, item) {
            $.each(item.friendsGroupMapList, function (j, memberItem) {
                if (memberItem.emUserName == who) {
                    isNotcontains = 1;
                    name = memberItem.userName ? memberItem.userName :  memberItem.profileName;
                    if(spanelem){
                        spanelem.innerHTML = name;
                    }
                    if (memberItem.profilePic) {
                        if(imgelem){
                            imgelem.setAttribute("src", memberItem.profilePic);
                        }
                        photo = memberItem.profilePic
                    }
                    if(setMobile){
                        spanelem.setAttribute("data-mobile", memberItem.mobile);
                    }
                    return false
                }
            })
        })
        if(isNotcontains == 2){
            Data.getGroupAndFriendsList().done(function(res) {
                if (res.list.length > 0) {
                    membersList = res.list;
                    var membersListData = JSON.stringify(membersList);
                    sessionStorage.setItem('membersListIM',membersListData);
                    showNickPhoto(who,spanelem,imgelem,setMobile,1);
                    //isNotcontains = false;
                }
            })
        }
        return {
            name:name,
            photo:photo
        }
    }
//显示聊天记录的统一处理方法
    var appendMsg = function(who, contact, message, onlyPrompt,messExcept,_timestamp) {

        var contactDivId = contact;

        var contactLi = getContactLi(contactDivId),
            isTemp = isContains(who,'miku_temp_') ? true : false,
            sid = messExcept && messExcept.ext && messExcept.ext.sessionId ? messExcept.ext.sessionId : who;

        // 消息体 {isemotion:true;body:[{type:txt,msg:ssss}{type:emotion,msg:imgdata}]}
        var localMsg = null;
        if (typeof message == 'string') {
            localMsg = Easemob.im.Helper.parseTextMessage(message);
            localMsg = localMsg.body;
        } else {
            localMsg = message.data;
        }

        var curHeadPic = noPhoto;
        if(!isTemp && curUserId != who){
            $.each(membersList,function(i,item){
                $.each(item.friendsGroupMapList,function(j,memberItem){
                    if(memberItem.emUserName == who){
                        curHeadPic = memberItem.profilePic ? memberItem.profilePic : curHeadPic;
                        return false
                    }
                })
            })
        }
        var curNickName = '',contactObj = $('#'+contact),userName='';
        if(contact.indexOf(groupFlagMark) >=0 && source == '1' && curUserId != who){
            var $name;
            if(messExcept.ext.isExpert == '0') {        //用户
                $name = 'user';
            }
            else{
                $name = 'sell';
            }
            if(!contactObj.data($name+'-name')){
                var dataInfo = {
                    emUserName:who
                }
                Data.getUserInfoIM(dataInfo).done(function(res){
                    var img = res.headPic ?　res.headPic　: noPhoto;
                    $('#'+curCId).attr($name+'-name',res.nickName).attr($name+'-img',img);
                })
            }
            curHeadPic = contactObj.attr($name+'-img');
            curNickName = contactObj.attr($name+'-name');
            userName =  contact.indexOf(groupFlagMark) >= 0 ? '<span class="curNickName">'+curNickName+'</span>' : '';
        }

        var userPhotoSrc =  (curUserId == who) ? (currentIMLocal[3] ?  currentIMLocal[3] : $('#myPic').attr('src') ): curHeadPic;

        if(onlyPrompt && onlyPrompt  == 'IsOver'){      //结束对话
            message = '您已结束对话'
        }

        var showTime  = '',chatTimeQ='';
        if($('.chatMess').last().length > 0){
            chatTimeQ = _timestamp ?　_timestamp　: new Date().getTime();
            var timeStr =  $('.chatMess').last().find('.chatTime').data('timestape'),
                timecha = chatTimeQ - timeStr,
                minites = Math.floor(timecha/(60*1000));
            showTime = minites > 2 ? '':'hide';
        }
        var  chatTime = _timestamp ?  bainx.formatDate('m-d h:i', new Date(_timestamp)) : getLoacalTimeString(),
            headstr =(onlyPrompt && !messExcept) ? ["<p1>" + message + "</p1>"] :  [ "<p2 class='chatTime "+showTime+"' data-timestape='"+chatTimeQ+"'>" + chatTime + "<b></b><br/></p2>",userName,"<p1 class='userPhoto'><img src='" + userPhotoSrc + "' /></p1>"];
        var header = $(headstr.join(''))
        var lineDiv = document.createElement("div");
        //var lineDiv;
        lineDiv.className="chatMess";
        var messageContent = localMsg,
            flg = onlyPrompt ? 0 : messageContent.length;

        if(onlyPrompt && onlyPrompt  == 'CheckBox'){     //发送盒子
            var eletext = "<p3 data-id='"+messExcept.ext.BoxId+"' class='chat-content-p3 viewBoxInChat'><div class='boxMessage'><p class='title_p'>"+message+"</p><img src='"+imgPath + "/common/images/personalTailor/csad/box.png' class='boxImg'/><img src='"+imgPath + "/common/images/personalTailor/csad/just-for.png'/></div> </p3>";
            var ele = $(eletext);
            for (var j = 0; j < ele.length; j++) {
                lineDiv.appendChild(ele[j]);
            }
        }

        if(onlyPrompt && onlyPrompt  == 'UserReport'){     //发送报告
            var eletext = "<div data-id='"+messExcept.ext.UserReport_id+"' class='chat-content-p3 grid boxMessage viewReport'><img class='reportViewImg' src='" +imgPath + "/common/images/personalTailor/csad/reportViewImg.png'/><div><p class='describe_p'>姓名："+message+"</p><p class='describe_p'>管家："+messExcept.ext.UserReport_expertName+"</p><p class='describe_p'>日期："+messExcept.ext.UserReport_date+"</p></div><a class='viewReportInChat'>点击查看 >> </a> </div>";
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
        }else if(_chatType == "txt"){
            messageTip = messageContent[0].data;
        }else{
            messageTip = message;
        }


        for (var i = 0; i < flg; i++) {
            msg = messageContent[i];
            type = msg.type;
            var data = msg.data;
            //console.log(message);
            if (type == "emotion") {
                // console.log(msg);
                var eletext = "<img src='" + data + "' class='emotionImg'/>";
                var ele = $(eletext);
                for (var j = 0; j < ele.length; j++) {
                    lineDiv.getElementsByTagName('p3')[0].appendChild(ele[j]);
                }
                //$(".messageBody").append(eletext);
            }


            else if (type == "pic" || type == 'audio' || type == 'video') {
                var filename = msg.filename;

                data.nodeType && lineDiv.getElementsByTagName('p3')[0].appendChild(data);
                if(type == "pic"){
                    data.nodeType && lineDiv.getElementsByTagName('p3')[0].setAttribute("class", "chat-content-p3 viewImgInChat")
                }
                if(type == "audio"){
                    data.className = 'hide';

                    var eleaudioT = "<div class='audioMsg'>"+msg.length+"\'\'</div>",
                        eleaudio = $(eleaudioT);
                    for (var j = 0; j < eleaudio.length; j++) {
                        lineDiv.getElementsByTagName('p3')[0].appendChild(eleaudio[j]);
                    }

                    eleaudio.click(function(){
                        var tar = $(this);
                        if($(data).hasClass('play')){
                            tar.removeClass('flash');
                            data.pause();
                        }
                        else{
                            $(data).addClass('play');
                            tar.addClass('flash');
                            data.play();
                            setTimeout(function(){
                                tar.removeClass('flash');
                                $(data).removeClass('play')
                            },msg.length * 1000)
                        }
                    })

                }

                //lineDiv.firstChild.setAttribute("class", "chat-content-p3");
                if(type == 'audio' && msg.audioShim) {
                    var d = $(lineDiv),
                        t = new Date().getTime();
                    d.append($('<div class="'+t+'"></div><button class="play'+t+'">播放</button><button style="display:none" class="play'+t+'">暂停</button>'));
                }
            }
            else {


                var eletext = "<p3>" + data + "</p3>";
                var ele = $(eletext);
                ele[0].setAttribute("class", "chat-content-p3 chat_"+messExcept.id);
                ele[0].setAttribute("data-msgid", messExcept.id);
                ele[0].setAttribute("className", "chat-content-p3");
                if (curUserId == who) {
                    // ele[0].style.backgroundColor = "#AAAAB4";
                }
                for (var j = 0; j < ele.length; j++) {
                    lineDiv.appendChild(ele[j]);
                }

            }
        }

        for (var m = 0; m < header.length; m++) {
            var ele = header[m];
            lineDiv.appendChild(ele);
        }

        //var hasWindow = true;  //是否有当前窗口
        if(curChatUserId == null){
            // hasCurWin = false;
        }
        // if(status){
        // var MainListContainer;
        if( status == 1 && source != 2 ) {
            //消息显示
            //MainListContainer = $('#callCenterUL');


            // var msgShowLast = true;
            if (curChatUserId == null && source == 1) {

                setCurrentContact(contact, sid);

                //msgShowLast = false;
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

            }
            else if (curChatUserId && curChatUserId == contact) {
                //var unreadNum = $('.chatMessage .badgegroup');
                //if(unreadNum.length > 0){
                //    if(parseInt(unreadNum.text()) > 1){
                //        unreadNum.text(parseInt(unreadNum.text()-1));
                //    }else{
                //        unreadNum.remove();
                //    }
                //}
                //将未读状态改为已读
                upDateRead(contact)
                upDateStatus(contact, 1)
            }
        }
        else{

            if(!(onlyPrompt && onlyPrompt  == 'CallExpert')){
                //MainListContainer = $('#callCenterUL');
                //var badgespan = $(contactLi).children(".badge");
                ////if(!(messExcept && messExcept.ext && messExcept.MikuExpand == 'CallExpert')){
                //if (badgespan && badgespan.length > 0) {
                //    var count = badgespan.text();
                //    var myNum = parseInt(count);
                //    myNum++;
                //    badgespan.text(myNum);
                //}
                //else {
                //    $(contactLi).append('<span class="badge">1</span>');
                //}
                //if(isTemp) {
                //    $(contactLi).children(".badge").addClass('badgeAnon');
                //}
                //消息
                var messageI = $(contactLi).find(".message_li");

                if (messageI && messageI.length > 0) {
                    messageI.text(messageTip);
                }
                else {
                    $(contactLi).find('.message_main_item').append('<i class="message_li ellipsis">'+messageTip+'</i>');
                }
            }
        }

        //消息
        var messageI = $(contactLi).find(".message_li");

        if(curUserId == who){
            if(isContains(messageTip,'<img')){
                messageTip = '[图片]';
            }
        }

        if (messageI && messageI.length > 0) {
            messageI.text(messageTip);
        }
        else {
            $(contactLi).find('.message_main_item').append('<i class="message_li ellipsis">'+messageTip+'</i>');
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

        //呼叫专家 && 超时不显示
        if(onlyPrompt && onlyPrompt  == 'CallExpert' || onlyPrompt && onlyPrompt == 'OverTime'){
            lineDiv.className = 'chatMess hide left';
        }


        var create = false;
        if (msgContentDiv == null) {
            msgContentDiv = createContactChatDiv(contactDivId);
            create = true;
            //hasCurWin = false;
            //hasWindow = true
        }
        else{
            //hasCurWin = true;
            msgContentDiv.appendChild(lineDiv);
        }

        if (create) {
            document.getElementById(msgCardDivId).appendChild(msgContentDiv);
        }
        if(type == 'audio' && msg.audioShim) {
            setTimeout(function(){
                playAudioShim(d.find('.'+t), data.currentSrc, t);
            }, 0);
        }
        msgContentDiv.scrollTop = msgContentDiv.scrollHeight;



        // }

        return lineDiv;
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
        var time = p(date.getHours()) + ":" + p(date.getMinutes());
        return time;
    }

    function p(s) {
        return s < 10 ? '0' + s : s;
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

    //只要发消息，都把插入的状态改为0，并更新开始时间
    function upInsertTimeRec(chatUserId){
        // var db = getCurrentDb();
        db.transaction(function (trans) {
            trans.executeSql("select * from chatSession where user_id='"+chatUserId+"'", [], function (ts, data) {
                if(data && data.rows.length > 0){
                    if(data.rows[0].has_insert_timeRec == 1){
                        var now = new Date().getTime();
                        trans.executeSql("update chatSession set has_insert_timeRec = 0,start_time = "+now+" ,last_time = "+now+" where user_id='"+chatUserId+"'", [], function (ts2, data2) {});
                    }
                }
            });

        });
    }

    //时间差
    function dateDifference(time,timeDiff){
        var date = new Date(),
            _Diff = time == 'h' ? timeDiff * 60 * 60 *1000 : timeDiff * 60 *1000;
        return date.getTime() - _Diff;
    }

    insertChatRec(true,2);

    //deleteData()
    //删除数据
    function deleteData(){
        //var db = getCurrentDb();
        db.transaction(function (trans) {
            trans.executeSql("delete from chatRecord  where user_id='miku_temp_1472177785234537'", [], function (ts, data) {});
            trans.executeSql("delete from chatSession where user_id='miku_temp_1472177785234537'", [], function (ts, data) {});
        });
    }

    //结束对话插入聊天日志 超时删除。。。。
    function insertChatRec(more,type,who){
        var nTime = dateDifference('m',15),
        //db = getCurrentDb(),
            sql = more ? "select * from chatSession where has_insert_timeRec = 0 and last_time < "+ nTime: "select * from chatSession where has_insert_timeRec = 0 and  user_id='"+who+"'";
        db.transaction(function (trans) {
            trans.executeSql(sql, [], function (ts, dataS) {
                var last = false;
                for(var i = 0,l = dataS.rows.length;i<l;i++){
                    var item = dataS.rows.item(i),
                        whoId = dataS.rows.item(i).user_id;
                    if(i == dataS.rows.length - 1){
                        last = true;
                    }
                    insertLoginRec(whoId,item,type,more,last);
                }
                if(dataS.rows.length == 0){
                    deleteRelateEmData();
                }
            })
        })
    }

    //插入日志方法
    function insertLoginRec(who,item,type,more,last){
        var startTime = bainx.formatDate('Y/m/d h:i:s', new Date(item.start_time)),
            lastTime = bainx.formatDate('Y/m/d h:i:s', new Date(item.last_time)),
            data = {
                type:1,
                emUserName:who,
                serviceStime:startTime,
                serviceEtime:lastTime,
                serviceEtype:type
            }
        Data.addCsadServiceLog(data).done(function(){
            console.log('插入成功');
            //var db = getCurrentDb();
            db.transaction(function (trans) {
                trans.executeSql("update chatSession set has_insert_timeRec = 1", [], function (ts, dataS) {})
            })
            if(more && last){
                deleteRelateEmData();
            }
        })
    }
    //******************************聊天功能 结束
    //************************************h5 本地数据库
    initDatabase();

    //****/////
    //  deleteRelat();
    function deleteRelat(){
        db.transaction(function (trans) {
            trans.executeSql("delete from chatSession where service_id='246165468665086388'", [], function (ts, data) {});
            trans.executeSql("delete from chatRecord where service_id='246165468665086388'", [], function (ts, data) {});
        });
    }


    //将未读状态改为已读
    function upDateRead(chatUserId){
        //var db = getCurrentDb();
        db.transaction(function (trans) {
            trans.executeSql("update chatRecord set read = 1 where user_id='"+chatUserId+"'", [], function (ts, data) {});
            trans.executeSql("update chatSession set read = 1 where curChatId='"+chatUserId+"'", [], function (ts, data) {});
        });
    }

    //状态更新
    function upDateStatus(chatUserId,_status){
        //var db = getCurrentDb();
        db.transaction(function (trans) {
            trans.executeSql("update chatRecord set status = "+_status+" where user_id='"+chatUserId+"' and  exists  ( select * from chatRecord where user_id = '"+chatUserId+"')", [], function (ts, data) {
            }, function (ts, message) {
                console.log(ts,message);
            });
            trans.executeSql("update chatSession set status = "+_status+" where curChatId='"+chatUserId+"' and  exists  ( select * from chatSession where curChatId = '"+chatUserId+"')", [], function (ts, data) {
            }, function (ts, message) {
                console.log(ts,message);
            });
        });
    }

    function insertdbData(to,timestamp,hasRead,isStatus,msg,isTemp,tempName,isCallMsg,type){
        //执行sql脚本，插入数据
        var
        //db = getCurrentDb(),
            sid=1;
        db.transaction(function (trans) {
            trans.executeSql("select * from chatSession where user_id = '"+to+"' and service_id='"+curUserId+"'", [], function (ts, data) {
                if (data && data.rows.length > 0) {
                    var item = data.rows.item(0);
                    sid = item.id;
                }

                trans.executeSql("insert into chatRecord(sid,user_id,service_id,chat_timestamp,read,status,msgbody,isTempEm,temp_name,last_time,isCallMsg,type_chat) values(?,?,?,?,?,?,?,?,?,?,?,?) ", [sid,to,curUserId,timestamp, hasRead,isStatus,msg,isTemp,tempName,timestamp,isCallMsg,type], function (ts, data) {
                }, function (ts, message) {
                    console.log(ts,message);
                });
            })

            trans.executeSql("update chatSession set last_time = "+timestamp+" where user_id='"+to+"'", [], function (ts, data) {
            }, function (ts, message) {
                console.log(ts,message);
            });
            trans.executeSql("update chatRecord set last_time = "+timestamp+",temp_name = '"+tempName+"' where user_id='"+to+"'", [], function (ts, data) {
            }, function (ts, message) {
                console.log(ts,message);
            });
        });
    }

    function deleteRelateEmData(){
        var nTime = dateDifference('h',4);
        //db = getCurrentDb();
        db.transaction(function (trans) {
            trans.executeSql("delete from chatSession where service_id='"+curUserId+"' and isTempEm = 1 and start_time < "+nTime, [], function (ts, data) {});
            trans.executeSql("delete from chatRecord where service_id='"+curUserId+"' and isTempEm = 1 and last_time < "+nTime, [], function (ts2, data2) {});
        });
    }


    //创建会话表
    function insertSession(to,source,startTime,lastTime,status,read,isTempEm,emName,sessionId,loginEntrance,hasInsertTimeRec,curChatId,type,coopCode){
        var
        //db = getCurrentDb(),
            sid = 1;
        db.transaction(function (trans) {
            trans.executeSql("select * from chatSession", [], function (ts, data) {
                if((data && data.rows.length > 0)){
                    sid = data.rows.length;
                }
                var sqlSelect = "select * from chatSession where curChatId='"+curChatId+"'",sqlUpdate;
                if(isTempEm == 1){
                    //sqlSelect = "select * from chatSession where session_id='"+sessionId+"'";
                    sqlUpdate = "update chatSession set start_time = "+startTime+",last_time = "+lastTime+",user_id = '"+to+"',service_id = '"+user+"',status = "+status+",read = "+read+",em_name = '"+emName+"',login_entrance = "+loginEntrance+",has_insert_timeRec = "+hasInsertTimeRec+",session_id='"+sessionId+"',curChatId = '"+curChatId+"' where user_id='"+to+"'";
                }else{
                    //sqlSelect = "select * from chatSession where user_id='"+to+"'";
                    sqlUpdate = "update chatSession set start_time = "+startTime+",last_time = "+lastTime+",status = "+status+",read = "+read+",has_insert_timeRec = "+hasInsertTimeRec+" where curChatId='"+curChatId+"'";
                }
                trans.executeSql(sqlSelect, [], function (ts, data) {
                    if(!(data && data.rows.length > 0)){
                        trans.executeSql("insert into chatSession(id,user_id,service_id,source,start_time,last_time,status,read,isTempEm,em_name,session_id,login_entrance,has_insert_timeRec,curChatId,type_chat,coopCode) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ", [sid,to, user, source,startTime,lastTime,status,read,isTempEm,emName,sessionId,loginEntrance,hasInsertTimeRec,curChatId,type,coopCode], function (ts3, data3) {
                        }, function (ts3, message3) {
                            console.log(ts3, message3);
                        });
                    }else{
                        trans.executeSql(sqlUpdate, [], function (ts, data) {
                        }, function (ts, message) {
                            console.log(ts,message);
                        });
                    }
                }, function (ts3, message3) {
                    console.log(ts3, message3);
                });
            }, function (ts3, message3) {
                console.log(ts3, message3);
            });
        })
    }
    //更新会话表------会话来源
    function insertOrUpdateSession(to,sOrr){    //source=1,普通聊天 2，销售追踪3，蜜月回访
        var //db = getCurrentDb(),
            sql = sOrr ? "update chatSession set source = "+source+" where user_id='"+to+"'" : "update chatSession set read = 1 where user_id='"+to+"'";
        db.transaction(function (trans) {
            trans.executeSql(sql, [], function (ts2, data2) {
            }, function (ts2, message2) {
                console.log(ts2, message2);
            });
        })
    }
    // deleteTable();
    function deleteTable(){
        //删除表
        //var db = getCurrentDb();
        db.transaction(function (tx) {
            tx.executeSql('DROP TABLE chatRecord');
            tx.executeSql('DROP TABLE chatSession');
        });

    }

    function initDatabase() {

        if (!db) {
            alert("您的浏览器不支持HTML5本地数据库");
            return;
        }
        db.transaction(function (trans) {//启动一个事务，并设置回调函数   ///type ==0群聊 1===单聊
            //执行创建表的Sql脚本
            trans.executeSql("create table if not exists chatRecord(sid int null,user_id text null,service_id text null,chat_timestamp int null,read int null,status int null,msgbody text null,isTempEm int null,temp_name text null,last_time int null,isCallMsg int null,type_chat int null)", [], function (trans, result) {
            }, function (trans, message) {
            }, function (trans, result) {
            }, function (trans, message) {
            });
            trans.executeSql("create table if not exists chatSession(id int null,user_id text null,service_id text null,source int null,start_time int null,last_time int null,status int null,read int null,isTempEm int null,em_name text null,session_id text null,login_entrance int null,has_insert_timeRec int null,curChatId text null,type_chat int null,coopCode text null)", [], function (trans, result) {
            }, function (trans, message) {
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

    return {
        init:init,//布局
        sendBox:sendBox,//发送盒子
        sendReport:sendReport,//发送报告
        chooseContactDivClick:chooseContactDivClick,//选择窗口
        getItemUnreadNum:getItemUnreadNum,//获取个人未读消息数量
        getCurrentDb:getCurrentDb,//打开数据库
        callToChat:callToChat,//专家应答。。
        handleNav:handleNav,
        buildStrangerDiv:buildStrangerDiv,
        quickReplySentense:quickReplySentense,
        getPageStatus:getPageStatus,
        setCsadOffline:setCsadOffline//设置专家在线状态
        //getMembersList:getMembersList//获取成员信息
    }

})