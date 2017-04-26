require([
    'gallery/jquery/2.1.1/jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'plugin/webIm/strophe',
    //'http://187.unesmall.com/h5/html/web-im-master/static/sdk/easemob.im-1.1',
    'plugin/webIm/easemob.im-1.1.shim',
    'plugin/webIm/easemob.im.config',
    'plugin/webIm/swfupload/swfupload',
    //'gallery/bootstrap/3.2.0/js/bootstrap',
    'plugin/webIm/bootstrap.css',
    'plugin/webIm/webim.css',
    'plugin/webIm/jplayer/jquery.jplayer.min',

], function($,URL, Data,Strophe,EasemobShim,EasemobConfig,SWFUpload) {
    var imgPathStatic = 'http://187.unesmall.com/h5/html/web-im-master/';


    function init(){

        var tpl = '<div id="waitLoginmodal" class="modal hide" data-backdrop="static">             <img src="'+imgPathStatic+'static/img/waitting.gif">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;正在努力加载中...</img></div><div class="content" id="content" style="display: none"><div class="leftcontact" id="leftcontact"><div id="headerimg" class="leftheader"><span> <img id="myPic" src="'+imgPathStatic+'static/img/head/header2.jpg" alt="logo" class="img-circle" width="60px" height="60px" style="margin-top: -40px; margin-left: 20px" /></span> <span id="login_user" class="login_user_title"> <a     class="leftheader-font" href="#"></a></span> <span> <div class="btn-group" style="margin-left: 5px;"> </div> </span></div> <div id="leftmiddle"> <!--<input style="width: 120px; color: #999999; margin-top: 8px;"  type="text" id="searchfriend" value="搜索" onFocus="if(value==defaultValue){value=\'\';this.style.color=\'#000\'}" onBlur="if(!value){value=defaultValue;this.style.color=\'#999\'}" /> <button id="searchFriend" style="background: #cccccc">查询</button> -->  </div> <div id="contractlist11"         style="height: 492px; overflow-y: auto; overflow-x: auto;"><div class="accordion" id="accordionDiv"><div class="accordion-group"> <div class="accordion-heading"><a id="accordion1" class="accordion-toggle" data-toggle="collapse" data-parent="#accordionDiv" href="#collapseOne">呼叫中心 </a></div><div id="collapseOne" class="accordion-body collapse in"><div class="accordion-inner" id="callCenterlist"><ul id="callCenterUL" class="chat03_content_ul"></ul> </div>   </div></div><div class="accordion-group"><div class="accordion-heading"><a id="accordion3" class="accordion-toggle collapsed"  data-toggle="collapse" data-parent="#accordionDiv" href="#collapseThree">陌生人</a></div><div id="collapseThree" class="accordion-body collapse"><div class="accordion-inner" id="momogrouplist"><ul id="momogrouplistUL" class="chat03_content_ul"></ul></div> </div> </div></div></div></div><div id="rightTop" style="height: 78px;"></div><!-- 聊天页面 --><div class="chatRight"><div id="chat01"><div class="chat01_title"><ul class="talkTo"><li id="talkTo"><a href="#"></a></li><li id="recycle" style="float: right;"><img  src="'+imgPathStatic+'static/img/recycle.png" style="margin-right: 15px; cursor: hand; width: 18px;" title="清屏" /></li> <li id="roomInfo" style="float: right;"><img  id="roomMemberImg" src="'+imgPathStatic+'static/img/head/find_more_friend_addfriend_icon.png"style="margin-right: 15px; cursor: hand; width: 18px; display: none" title="成员" /></li></ul></div><div id="null-nouser" class="chat01_content"></div></div><div class="chat02"><div class="chat02_title"><a class="chat02_title_btn ctb01 showEmotionDia"  title="选择表情"></a><input id=\'sendPicInput\' style=\'display:none\'/><a class="chat02_title_btn ctb03 sendIt" title="选择图片" type=\'img\' href="#"></a><input id=\'sendAudioInput\' style=\'display:none\'/><a class="chat02_title_btn ctb02 sendIt" title="选择语音" href="#" type=\'audio\'></a><!--<input id=\'sendFileInput\' class=\'emim-hide\'/> <a class="chat02_title_btn ctb04 sendIt" title="选择文件"   href="#"></a>--> <label d="chat02_title_t"></label><div id="wl_faces_box" class="wl_faces_box"> <div class="wl_faces_content"><div class="title"><ul><li class="title_name">常用表情</li><li class="title_name" style="left:105px;" id="tusijiBtn">兔斯基</li><li class="wl_faces_close "><span class="turnoffFaces_box">&nbsp;</span></li></ul> </div><div id="wl_faces_main" class="wl_faces_main"><ul id="emotionUL" class="emtionList"></ul>  <ul id="tusijiUL" class="emtionList" style="display:none"></ul></div></div><div class="wlf_icon"></div></div></div><div id="input_content" class="chat02_content"><textarea id="talkInputId" style="resize: none;"></textarea></div>     <div class="chat02_bar"><ul><li style="right: 5px; top: 5px;"><img src="'+imgPathStatic+'static/img/send_btn.jpg" class="sendText"/></li></ul></div><div style="clear: both;"></div></div></div><!-- 一般消息通知 --><div id="notice-block-div" class="modal hide"><button type="button" class="close" data-dismiss="alert">&times;</button><div class="modal-body"><h4>Warning!</h4><div id="notice-block-body"></div></div></div><!-- 确认消息通知 --></div><input type="file" id="fileInput" style="display:none;"/><div id=\'alert\' class=\'em-alert\' style=\'display:none;\'><span></span><button>好的</button></div><span id="ext" style="color:#f00">扩展消息</span>';

        $('.waitting').hide();
        $('body').append(tpl);

        login();


        //表情
        $('.title_name').click(function(){
            $('.emtionList').hide();
            $('.emtionList').eq($(this).index()).show();
        })

        //添加大表情
        var bigEmtionList = ['002','007','010','012','013','018','019','020','021','022','024','027','029','030','035','040'],
            bigEmtionHtml = [],
            template = ''
        $.each(bigEmtionList,function(index,item){
            bigEmtionHtml.push('<li><img data-name="[示例'+(index+1)+']" src="'+imgPathStatic+'static/img/faces/icon_'+item+'.gif"/></li>');
        })
        $('#tusijiUL').append(bigEmtionHtml.join(''));


        //大表情
        $('#tusijiUL li').click(function(){
            var imgSrc = $(this).find('img').attr('src'),
                i = $(this).index();

            bigMotion(imgSrc,i);
        })

        //发送消息
        $('.sendText').click(function(){
            var msg = document.getElementById(talkInputId).value;
            //var msg = msgInput.value;
            sendText(msg);
            // sendBigEmotion(msg)
        })

        //关闭会话
        $('#ext').click(function(){
            // var msg = document.getElementById(talkInputId).value;
            closeTalking()
            //bigMotion(msg);
        })


        $('.turnoffFaces_box').click(function(){
            turnoffFaces_box();
        })

        $('.logTimeOut').click(function(){
            console.log('213231');
            login();
        })



        $('.sendIt').click(function(){
            send($(this))
        })
        $('.showEmotionDia').click(function(){
            showEmotionDialog();
        })
        $('#tusijiBtn').click(function(){
            //  showtusijiDialog();
        })

        $('#roomMemberImg').click(function(){
            showRoomMember();
        })
        $('#recycle').click(function(){
            clearCurrentChat()
        })
        $('.accordion-heading').click(function(){
            $('.accordion-body').removeClass('in');
            $(this).parents('.accordion-group').find('.accordion-body').addClass('in');
        })

    }
    init();





    var curUserId = null;
    var curChatUserId = null;
    var conn = null;
    var curRoomId = null;
    var curChatRoomId = null;
    var msgCardDivId = "chat01";
    var talkToDivId = "talkTo";
    var talkInputId = "talkInputId";
    var bothRoster = [];
    var toRoster = [];
    var maxWidth = 200;
    var groupFlagMark = "groupchat";
    var chatRoomMark = "chatroom";
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
    strangerIMCount = strangerIMLocal ? strangerIMLocal.length : 0;//陌生人人数
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
            file_post_name: 'file'
            , flash_url: imgPathStatic+"static/js/swfupload/swfupload.swf"
            , button_placeholder_id: fileInputId
            , button_width: 24
            , button_height: 24
            , button_cursor: SWFUpload.CURSOR.HAND
            , button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT
            , file_size_limit: 10485760
            , file_upload_limit: 0
            , file_queued_handler: function ( file ) {
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
            }
            , file_dialog_start_handler: function () {
                if ( Easemob.im.Helper.getIEVersion && Easemob.im.Helper.getIEVersion < 10 ) {
                    document.title = pageTitle;
                }
            }
            , upload_error_handler: function ( file, code, msg ) {
                if ( code != SWFUpload.UPLOAD_ERROR.FILE_CANCELLED
                    && code != SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED
                    && code != SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED ) {
                    this.uploadOptions.onFileUploadError && this.uploadOptions.onFileUploadError({ type: EASEMOB_IM_UPLOADFILE_ERROR, msg: msg });
                }
            }
            , upload_complete_handler: function () {
                //this.setButtonText('点击上传');
            }
            , upload_success_handler: function ( file, response ) {
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
    };
    var clearPageSign = function () {
        if ( Easemob.im.config.multiResources && window.localStorage ) {
            try {
                localStorage.clear();
            } catch ( e ) {}
        }
    };
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

        //陌生人列表
        console.log(strangerIMLocal);
        //$.each(strangerIMLocal,function(index,strangerItem){
        //    createMomogrouplistUL(strangerItem[0])
        //})
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

        window.alert = (function () {
            var dom = document.getElementById('alert'),
                info = dom.getElementsByTagName('span')[0],
                btn = dom.getElementsByTagName('button')[0],
                st = 0;

            btn.onclick = function () {
                clearTimeout(st);
                dom.style.display = 'none';
            };
            var delayHide = function () {
                clearTimeout(st);
                st = setTimeout(function () {
                    btn.click();
                }, 3000);
            };
            return function ( msg ) {
                info.innerHTML = msg;
                dom.style.display = 'block';
                delayHide();
            }
        }());


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
                curChatRoomId = null;
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
        curRoomId = null;
        curChatRoomId = null;
        bothRoster = [];
        toRoster = [];
        hiddenChatUI();
        for(var i=0,l=audioDom.length;i<l;i++) {
            if(audioDom[i].jPlayer) audioDom[i].jPlayer('destroy');
        }
        clearContactUI("contactlistUL", "contracgrouplistUL",
            "momogrouplistUL", msgCardDivId);
        //showLoginUI();
        // login();
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
                        "src" : imgPathStatic+"static/img/head/contact_normal.png"
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
        curChatRoomId = null;

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
    };

    //从缓存中拿帐号密码
    function fromStorageLogin(){
        user = currentIMLocal[0];
        pass = currentIMLocal[1];
        showWaitLoginedUI();
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

            console.log(user,pass);

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
//构造联系人列表
    var buildContactDiv = function(contactlistDivId, roster) {
        var uielem = document.getElementById("contactlistUL");
        var cache = {};
        for (i = 0; i < roster.length; i++) {
            if (!(roster[i].subscription == 'both' || roster[i].subscription == 'from')) {
                continue;
            }
            var jid = roster[i].jid;
            var userName = jid.substring(jid.indexOf("_") + 1).split("@")[0];
            if (userName in cache) {
                continue;
            }
            cache[userName] = true;
            var lielem = $('<li>').attr({
                'id' : userName,
                'class' : 'offline',
                'className' : 'offline',
                'type' : 'chat',
                'displayName' : userName
            }).click(function() {
                chooseContactDivClick(this);
            });
            $('<img>').attr("src", "static/img/head/contact_normal.png").appendTo(
                lielem);
            $('<span>').html(userName).appendTo(lielem);
            $('#contactlistUL').append(lielem);
        }
        var contactlist = document.getElementById(contactlistDivId);
        var children = contactlist.children;
        if (children.length > 0) {
            contactlist.removeChild(children[0]);
        }
        contactlist.appendChild(uielem);
    };
//构造群组列表
    var buildListRoomDiv = function(contactlistDivId, rooms, type) {
        var uielem = document.getElementById(contactlistDivId + "UL");
        uielem.innerHTML = '';
        var cache = {};
        for (i = 0; i < rooms.length; i++) {
            var roomsName = rooms[i].name;
            var roomId = rooms[i].roomId || rooms[i].id;
            if (roomId in cache) {
                continue;
            }
            cache[roomId] = true;
            var lielem = $('<li>').attr({
                'id' : (type == chatRoomMark ? chatRoomMark : groupFlagMark) + roomId,
                'class' : 'offline',
                'className' : 'offline',
                'type' : type || groupFlagMark,
                'displayName' : roomsName,
                'roomId' : roomId,
                'joined' : 'false'
            }).click(function() {
                chooseContactDivClick(this);
            });
            $('<img>').attr({
                'src' : 'static/img/head/group_normal.png'
            }).appendTo(lielem);
            $('<span>').html(roomsName).appendTo(lielem);
            $(uielem).append(lielem);
        }
        var contactlist = document.getElementById(contactlistDivId);
        var children = contactlist.children;
        if (children.length > 0) {
            contactlist.removeChild(children[0]);
        }
        contactlist.appendChild(uielem);
    };
//构造陌生人列表
    var buildStrangerDiv = function(momogrouplistDivId) {
        var uielem = document.getElementById("momogrouplistUL");
        var cache = {};
        // for (i = 0; i < strangerIMLocal.length; i++) {
        console.log(strangerIMLocal);
        $.each(strangerIMLocal,function(index,item){
            console.log(item);
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
                item[1] = item[1] ?　item[1]　: imgPath+'/common/images/avatar-small.png'
                $('<img>').attr("src", item[1]).appendTo(
                    lielem);
                $('<span>').html(item[2]).appendTo(lielem);
                $('#momogrouplistUL').append(lielem);
            }

        })

        var momogrouplist = document.getElementById(momogrouplistDivId);
        var children = momogrouplist.children;
        if (children.length > 0) {
            momogrouplist.removeChild(children[0]);
        }
        momogrouplist.appendChild(uielem);
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
        return newContent;
    };
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
        if (chatUserId.indexOf(groupFlagMark) >= 0) {
            dispalyTitle = "群组" + $(contactLi).attr('displayname') + "聊天中";
            curRoomId = $(contactLi).attr('roomid');
            $("#roomMemberImg").css('display', 'block');
        } else if (chatUserId.indexOf(chatRoomMark) >= 0) {
            dispalyTitle = "聊天室" + $(contactLi).attr('displayname');
            curChatRoomId = $(contactLi).attr('roomid');
            $("#roomMemberImg").css('display', 'block');
        } else {
            var curChatnick =  $('#' + chatUserId).find('span').text();
            dispalyTitle = "与" + curChatnick + "聊天中";
            $("#roomMemberImg").css('display', 'none');
        }
        document.getElementById(talkToDivId).children[0].innerHTML = dispalyTitle;
    };
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

        if ( curChatRoomId && curChatRoomId != roomId ) {//切换时，退出当前聊天室
            var source = document.getElementById(curUserId + '-' + chatRoomMark + curChatRoomId);
            source && (source.innerHTML = '', source.style.display = 'none');
            var clearId = curChatRoomId;
            conn.quitChatRoom({
                roomId : curChatRoomId
            });
            curChatRoomId = null;
        }

        if ($(li).attr("type") == groupFlagMark && ('true' != $(li).attr("joined"))) {
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
            li.removeChild(li.children[2]);
        }
        //点击有未读消息对象时对未读消息提醒的处理
        var badgespanGroup = $(li).parent().parent().parent().find(".badge");
        if (badgespanGroup && badgespanGroup.length == 0) {
            $(li).parent().parent().parent().prev().children().children().remove();
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
        ;
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
        // 群组消息和个人消息的判断分支
        if (curChatUserId.indexOf(groupFlagMark) >= 0) {
            options.type = groupFlagMark;
            options.to = curRoomId;
        } else if (curChatUserId.indexOf(chatRoomMark) >= 0) {

            options.type = groupFlagMark;
            options.roomType = chatRoomMark;
            options.to = curChatRoomId;
        }

        //easemobwebim-sdk发送文本消息的方法 to为发送给谁，meg为文本消息对象
        conn.sendTextMessage(options);
        //当前登录人发送的信息在聊天窗口中原样显示
        //var msgtext = Easemob.im.Utils.parseLink(Easemob.im.Utils.parseEmotions(encode(msg)));
        var msgtext = Easemob.im.Utils.parseEmotions(encode(msg));
        console.log(msgtext,msg);
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
        // 群组消息和个人消息的判断分支
        if (curChatUserId.indexOf(groupFlagMark) >= 0) {
            options.type = groupFlagMark;
            options.to = curRoomId;
        } else if (curChatUserId.indexOf(chatRoomMark) >= 0) {

            options.type = groupFlagMark;
            options.roomType = chatRoomMark;
            options.to = curChatRoomId;
        }

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
        // 群组消息和个人消息的判断分支
        if (curChatUserId.indexOf(groupFlagMark) >= 0) {
            options.type = groupFlagMark;
            options.to = curRoomId;
        } else if (curChatUserId.indexOf(chatRoomMark) >= 0) {

            options.type = groupFlagMark;
            options.roomType = chatRoomMark;
            options.to = curChatRoomId;
        }

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
        };
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

                    var file = document.getElementById('fileInput');
                    if ( Easemob.im.Helper.isCanUploadFileAsync && file && file.files) {
                        var objUrl = getObjectURL(file.files[0]);
                        if (objUrl) {
                            var img = document.createElement("img");
                            img.src = objUrl;
                            img.width = maxWidth;
                        }
                    } else {
                        filename = data.filename || '';
                        var img = document.createElement("img");
                        img.src = data.uri + '/' + data.entities[0].uuid;
                        img.width = maxWidth;
                    }
                    appendMsg(curUserId, to, {
                        data : [ {
                            type : 'pic',
                            filename : filename,
                            data : img
                        } ]
                    });
                },
                flashUpload: flashPicUpload
            };
            if (curChatUserId.indexOf(groupFlagMark) >= 0) {
                opt.type = groupFlagMark;
                opt.to = curRoomId;
            } else if (curChatUserId.indexOf(chatRoomMark) >= 0) {
                opt.type = groupFlagMark;
                opt.roomType = chatRoomMark;
                opt.to = curChatRoomId;
            }
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
            if (curChatUserId.indexOf(groupFlagMark) >= 0) {
                opt.type = groupFlagMark;
                opt.to = curRoomId;
            } else if (curChatUserId.indexOf(chatRoomMark) >= 0) {

                opt.type = groupFlagMark;
                opt.roomType = chatRoomMark;
                opt.to = curChatRoomId;
            }
            conn.sendAudio(opt);
            return;
        }
        alert("不支持此音频类型" + filetype);
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
            if (curChatUserId.indexOf(groupFlagMark) >= 0) {
                opt.type = groupFlagMark;
                opt.to = curRoomId;
            } else if (curChatUserId.indexOf(chatRoomMark) >= 0) {
                opt.type = groupFlagMark;
                opt.roomType = chatRoomMark;
                opt.to = curChatRoomId;
            }
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
        var room = message.to;
        if (mestype == groupFlagMark || mestype == chatRoomMark) {
            appendMsg(message.from, mestype + message.to, messageContent);
        }
        //else if(message.ext.em_is_big_expression){
        //    appendMsg(from, from, messageContent,message.ext.em_is_big_expression);
        //}
        else {
            appendMsg(from, from, messageContent);
        }
    };

    //easemobwebim-sdk收到扩展消息的回调方法的实现
    //var handlekzMessage = function(message) {
    //    console.log();
    //    var from = message.from;//消息的发送者
    //    var mestype = message.type;//消息发送的类型是群组消息还是个人消息
    //    var messageContent = message.data;//文本消息体
    //    console.log(messageContent);
    //    //TODO  根据消息体的to值去定位那个群组的聊天记录
    //    var room = message.to;
    //    if (mestype == groupFlagMark || mestype == chatRoomMark) {
    //        appendMsg(message.from, mestype + message.to, messageContent);
    //    } else {
    //        appendMsg(from, from, messageContent);
    //    }
    //};


//easemobwebim-sdk收到表情消息的回调方法的实现，message为表情符号和文本的消息对象，文本和表情符号sdk中做了
//统一的处理，不需要用户自己区别字符是文本还是表情符号。
    var handleEmotion = function(message) {
        var from = message.from;
        var room = message.to;
        var mestype = message.type;//消息发送的类型是群组消息还是个人消息
        if (mestype == groupFlagMark || mestype == chatRoomMark) {
            appendMsg(message.from, mestype + message.to, message);
        } else {
            appendMsg(from, from, message);
        }
    };
//easemobwebim-sdk收到图片消息的回调方法的实现
    var handlePictureMessage = function(message) {
        var filename = message.filename;//文件名称，带文件扩展名
        var from = message.from;//文件的发送者
        var mestype = message.type;//消息发送的类型是群组消息还是个人消息
        var contactDivId = from;
        if (mestype == groupFlagMark || mestype == chatRoomMark) {
            contactDivId = mestype + message.to;
        }
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
        if (mestype == groupFlagMark || mestype == chatRoomMark) {
            contactDivId = mestype + message.to;
        }


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
        if (mestype == groupFlagMark || mestype == chatRoomMark) {
            contactDivId = mestype + message.to;
        }
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
        if (mestype == groupFlagMark || mestype == chatRoomMark) {
            contactDivId = mestype + message.to;
        }
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
        if (mestype == groupFlagMark || mestype == chatRoomMark) {
            appendMsg(from, mestype + to, content);
        } else {
            appendMsg(from, from, content);
        }
    };

    var cleanListRoomDiv = function cleanListRoomDiv() {
        $('#contracgrouplistUL').empty();
    };
//收到陌生人消息时创建陌生人列表
    function createMomogrouplistUL(who, message) {
        var momogrouplistUL = document.getElementById("callCenterUL");
        var cache = {};
        console.log(cache);
        if (who in cache) {
            return;
        }
        cache[who] = true;
        var lielem = document.createElement("li");
        strangerIMCount ++;
        $(lielem).attr({
            'id' : who,
            'class' : 'offline',
            'className' : 'offline',
            'type' : 'chat',
            'displayName' : who
        });
        lielem.onclick = function() {
            sendText('米酷专家为您服务~')
            chooseContactDivClick(this);
        };

        var imgelem = document.createElement("img");

        var data = {
            emUserName:who
        }
        //陌生人列表
        //var isHasToStrangerGroup=true;
        //$.each(strangerIMLocal,function(index,strangerItem){
        //    if(who == strangerItem[0]){
        //        isHasToStrangerGroup = false;
        //    }
        //})
        //if(isHasToStrangerGroup){



        Data.getUserInfoIM(data).done(function(res){
            if(res.headPic){
                imgelem.setAttribute("src", res.headPic);
            }else{
                imgelem.setAttribute("src", imgPath+'common/images/avatar-small.png');
            }
            lielem.appendChild(imgelem);
            var spanelem = document.createElement("span");
            spanelem.innerHTML = res.nickName;
            lielem.appendChild(spanelem);
            momogrouplistUL.appendChild(lielem);
            var strangerIMSingleMsg = [who,res.headPic,res.nickName];
            //for(var i = 0; i < strangerIMCount-1; i++){
            //    strangerIMGroup[i] =
            //}
            if(strangerIMLocal){
                $.each(strangerIMLocal,function(index,item){
                    strangerIMGroup[index] = item;
                })
            }

            strangerIMGroup[strangerIMCount-1] = strangerIMSingleMsg;
            var strangerIMGroupData = JSON.stringify(strangerIMGroup);
            console.log(strangerIMGroup,strangerIMCount,strangerIMGroupData);
            localStorage.setItem('strangerIM',strangerIMGroupData);//保存信息
            strangerIMSingleMsg = [];//清除
        })
        //}

    };



    var handleChatRoomMessage = function (contact) {
        if ( contact.indexOf(chatRoomMark) > -1 ) {
            return contact.slice(chatRoomMark.length) === curChatRoomId;
        }
        return true;
    };
//显示聊天记录的统一处理方法
    var appendMsg = function(who, contact, message, onlyPrompt) {
        if ( !handleChatRoomMessage(contact) ) { return; }
        //if ( !contact.indexOf(chatRoomMark) > -1 ) { return; }

        var contactUL = document.getElementById("contactlistUL");
        var contactDivId = contact;
        var contactLi = getContactLi(contactDivId);
        if (contactLi == null) {
            createMomogrouplistUL(who, message);
        }
        // 消息体 {isemotion:true;body:[{type:txt,msg:ssss}{type:emotion,msg:imgdata}]}
        var localMsg = null;
        if (typeof message == 'string') {
            localMsg = Easemob.im.Helper.parseTextMessage(message);
            localMsg = localMsg.body;
        } else {
            localMsg = message.data;
        }
        var headstr = onlyPrompt ? ["<p1>" + message + "</p1>"] : [ "<p1>" + who + "   <span></span>" + "   </p1>",
            "<p2>" + getLoacalTimeString() + "<b></b><br/></p2>" ];
        var header = $(headstr.join(''))
        var lineDiv = document.createElement("div");
        for (var i = 0; i < header.length; i++) {
            var ele = header[i];
            lineDiv.appendChild(ele);
        }
        var messageContent = localMsg,
            flg = onlyPrompt ? 0 : messageContent.length;

        // if(flg == 0){
        //    $('#tusijiUL li').each(function(){
        //        if(message = $(this).find('img').data('name')){
        //            var imgsrc = $(this).find('img').attr('src'),
        //                eletext = "<p3><img src='" + imgsrc + "'/></p3>";
        //            var ele = $(eletext);
        //             for (var j = 0; j < ele.length; j++) {
        //            lineDiv.appendChild(ele);
        //             }
        //        }
        //    })
        //}



        for (var i = 0; i < flg; i++) {
            var msg = messageContent[i];
            var type = msg.type;
            var data = msg.data;
            console.log(message);
            if (type == "emotion") {
                var eletext = "<p3><img src='" + data + "'/></p3>";
                var ele = $(eletext);
                for (var j = 0; j < ele.length; j++) {
                    lineDiv.appendChild(ele[j]);
                }
            }


            else if (type == "pic" || type == 'audio' || type == 'video') {
                var filename = msg.filename;
                var fileele = $("<p3>" + filename + "</p3><br>");
                for (var j = 0; j < fileele.length; j++) {
                    lineDiv.appendChild(fileele[j]);
                }
                data.nodeType && lineDiv.appendChild(data);
                if(type == 'audio' && msg.audioShim) {
                    var d = $(lineDiv),
                        t = new Date().getTime();
                    d.append($('<div class="'+t+'"></div>\
					<button class="play'+t+'">播放</button><button style="display:none" class="play'+t+'">暂停</button>'));
                }
            } else {
                console.log(data);

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
                    data = "<img src='"+imgPathStatic+"static/img/faces/"+bigEmotion[data]+"'/>";
                }

                var eletext = "<p3>" + data + "</p3>";
                var ele = $(eletext);
                ele[0].setAttribute("class", "chat-content-p3");
                ele[0].setAttribute("className", "chat-content-p3");
                if (curUserId == who) {
                    ele[0].style.backgroundColor = "#EBEBEB";
                }
                for (var j = 0; j < ele.length; j++) {
                    lineDiv.appendChild(ele[j]);
                }
            }
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
            contactLi.style.backgroundColor = "green";
            var badgespan = $(contactLi).children(".badge");
            if (badgespan && badgespan.length > 0) {
                var count = badgespan.text();
                var myNum = new Number(count);
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
                    .append('<span class="badgegroup">New</span>');
            }
        }
        var msgContentDiv = getContactChatDiv(contactDivId);
        if ( onlyPrompt ) {
            lineDiv.style.textAlign = "center";
        } else if (curUserId == who) {
            lineDiv.style.textAlign = "right";
        } else {
            lineDiv.style.textAlign = "left";
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

//添加输入框鼠标焦点进入时清空输入框中的内容
    var clearInputValue = function(inputId) {
        $('#' + inputId).val('');
    };

//消息通知操作时条用的方法
    var showNewNotice = function(message) {

        $('#confirm-block-footer-body').html(message);
    };
    var showWarning = function(message) {
        $('#notice-block-div').modal('toggle');
        $('#notice-block-body').html(message);
    };

//清除聊天记录
    var clearCurrentChat = function clearCurrentChat() {
        var currentDiv = getContactChatDiv(curChatUserId)
            || createContactChatDiv(curChatUserId);
        currentDiv.innerHTML = "";
    };
//显示成员列表
    var showRoomMember = function showRoomMember() {
        if (groupQuering) {
            return;
        }
        groupQuering = true;
        queryOccupants(curRoomId);
    };
//根据roomId查询room成员列表
    var queryOccupants = function queryOccupants(roomId) {
        var occupants = [];
        conn.queryRoomInfo({
            roomId : roomId,
            success : function(occs) {
                if (occs) {
                    for (var i = 0; i < occs.length; i++) {
                        occupants.push(occs[i]);
                    }
                }
                conn.queryRoomMember({
                    roomId : roomId,
                    success : function(members) {
                        if (members) {
                            for (var i = 0; i < members.length; i++) {
                                occupants.push(members[i]);
                            }
                        }
                        showRoomMemberList(occupants);
                        groupQuering = false;
                    },
                    error : function() {
                        groupQuering = false;
                    }
                });
            },
            error : function() {
                groupQuering = false;
            }
        });
    };
    var showRoomMemberList = function showRoomMemberList(occupants) {
        var list = $('#room-member-list')[0];
        var childs = list.childNodes;
        for (var i = childs.length - 1; i >= 0; i--) {
            list.removeChild(childs.item(i));
        }
        for (i = 0; i < occupants.length; i++) {
            var jid = occupants[i].jid;
            var userName = jid.substring(jid.indexOf("_") + 1).split("@")[0];
            var txt = $("<p></p>").text(userName);
            $('#room-member-list').append(txt);
        }
        $('#option-room-div-modal').modal('toggle');
    };
    var showRegist = function showRegist() {
        $('#loginmodal').modal('hide');
        $('#regist-div-modal').modal('toggle');
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
        path: imgPathStatic+'static/img/faces/'
        , map: {
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
            '[(D)]': 'ee_35.png',
            //'[示例1]': 'icon_002.gif',
            //'[示例2]': 'icon_007.gif',
            //'[示例3]': 'icon_010.gif',
            //'[示例4]': 'icon_012.gif',
            //'[示例5]': 'icon_013.gif',
            //'[示例6]': 'icon_018.gif',
            //'[示例7]': 'icon_019.gif',
            //'[示例8]': 'icon_020.gif',
            //'[示例9]': 'icon_021.gif',
            //'[示例10]': 'icon_022.gif',
            //'[示例11]': 'icon_024.gif',
            //'[示例12]': 'icon_027.gif',
            //'[示例13]': 'icon_029.gif',
            //'[示例14]': 'icon_030.gif',
            //'[示例15]': 'icon_035.gif',
            //'[示例16]': 'icon_040.gif'
        }
    };
})