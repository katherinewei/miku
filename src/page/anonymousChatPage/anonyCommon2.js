/**
 * Created by Spades-k on 2016/8/22.
 */
/**
 * pc端专家common
 * Created by xiuxiu on 2016/7/15.
 */
define('h5/js/page/anonyCommon', [
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'plugin/webIm/HZRecorder',
    'plugin/webIm/strophe',
    'plugin/webIm/easemob.im-1.1.shim',
    'plugin/webIm/easemob.im.config',
    'plugin/webIm/swfupload/swfupload',

    'h5/js/page/imageMagnification',
    'plugin/fastclick/0.6.7/fastclick',
    'h5/js/page/getDetectRecord',
    'plugin/webIm/jplayer/jquery.jplayer.min',
], function($,URL, Data,HZRecorder,Strophe,EasemobShim,EasemobConfig,SWFUpload,imageMagnification,fastClick,getDetectRecord) {

    var loginentrance=URL.param.loginentrance ? URL.param.loginentrance : 3;
    var description=URL.param.description;
    var title=URL.param.title;

    var timeFlag=true;//配合处理定时器
    var isRegist =  pageConfig.pid && parseInt(pageConfig.pid) > 0; //判断是否是注册用户

    var chatRecord = localStorage.getItem('chatRecord'); //获取聊天消息
    chatRecord = JSON.parse(chatRecord);

    var ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
        setStorage(['flagSet'],['true']);
    }else{
        setStorage(['flagSet'],['flase']);
    }
    //
    if ('addEventListener' in document) {
        document.addEventListener('DOMContentLoaded', function() {
            fastClick.attach(document.body);
        }, false);
    }

    browserRedirect();
    function browserRedirect() {
        var sUserAgent = navigator.userAgent.toLowerCase();
        var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
        var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
        var bIsMidp = sUserAgent.match(/midp/i) == "midp";
        var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
        var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
        var bIsAndroid = sUserAgent.match(/android/i) == "android";
        var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
        var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";

        if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM){
            setStorage(['agentFlag'],['true']);
        }else{
            setStorage(['agentFlag'],['false']);
        }
    }


    //判断数组是否包含某元素
    Array.prototype.containItem = function (obj) {
        var i = this.length;
        while (i--) {
            if (this[i] == obj) {
                return true;
            }
        }
        return false;
    }

    //框架
    function layout(){
        login();
        bindEvents();
    }

    function isContains(str, substr) {
        return new RegExp(substr).test(str);
    }

    //评价专家
    function comment(){
        $('.serviceComment').parent().remove();//清掉之前的评论框
        var temp = '<div class="serviceComment"><div class="title" ><span>服务评价</span><div class="star-wrap"><i class="icon-star active"></i><i class="icon-star active"></i><i class="icon-star active"></i><i class="icon-star active"></i><i class="icon-star active"></i></div> </div><div class="comment-textarea"><textarea placeholder="评个价咯"></textarea></div>  <div class="btn-comment">提交</div> </div>';
        return temp
    }

    //事件
    function bindEvents(){

        var flagSet=localStorage.getItem('flagSet'),
            tap='';
        if(flagSet=='true'){
            tap='tap';
        }else{
            tap='click';
        }
        //表情
        $('body')
            .on(tap,'.title_name',function(){
                $('.emtionList').hide();
                $('.emtionList').eq($(this).index()).show();
            })
            //大表情
            .on(tap,'#tusijiUL li',function(){
                var name = $(this).find('img').attr('data-name'),
                    i = $(this).index();
                bigMotion(name,i);
            })

            ////发送消息
            .on('click','.sendText',function(e){
                e.stopPropagation();
                var msg = $('#talkInputId').val();
                sendText(msg);
                setTimeout(function(){
                    $('#talkInputId').blur();
                    //$('.inMove2').hide();
                    //$('.inMove').show().removeClass('sendText1');
                    //$('.moveList').hide();
                },250)
            })
            //重新接入
            .on(tap,'.reCallExp',function(){
                sendCallExpert();
                $(this).parent().parent().hide();
            })
            //评价--星
            .on(tap, '.icon-star', function(event){
                event.preventDefault();
                var target = $(event.target),
                    starWrap = target.parent();
                starWrap.find('.icon-star').removeClass('active');
                var levelState = target.index();
                for (var i = 0; i <= levelState; ++i) {
                    starWrap.find('.icon-star').eq(i).addClass('active');
                }
            })
            //评价
            .on(tap, '.btn-comment', function(event){
                var $tarP = $(this).parent(),
                    evaluateLevel = $tarP.find('.icon-star.active').length * 2,
                    evaluateNote =  $tarP.find('textarea').val(),
                    data = {
                    emUserName:emExpertId,
                    evaluateLevel:evaluateLevel,
                    evaluateNote:evaluateNote
                }
                Data.stopTalk(data).done(function(){
                    bainx.broadcast('评价成功！');
                    $tarP.remove();
                })
            })
            .on(tap,'.turnoffFaces_box',function(){
                //turnoffFaces_box();
                $('#wl_faces_box').css('display','none');
                if($('#talkInputId').val().length<=0){
                    $('.inMove').show();
                    $('.inMove2').hide().removeClass('sendText1');
                }
            })
            .on('click','.sendIt',function(){
                send($(this));
            })

            .on('click','.showEmotionDia',function(){
                $('.moveList').hide();
                $('.inMove').hide();
                $('.inMove2').show().addClass('sendText1');
                showEmotionDialog();
            })
            .on(tap,'.viewReport',function(){
                if(isRegist){
                    var rid=$(this).data('id');
                    viewReport(rid);
                }else {
                    viewReport(sessionId);
                }

            })

            //放大图片
            .on('click','.chatRight .viewImgInChat img',function(){
                imageMagnification.loadImg($(this));
            })


    }

    //******************************聊天功能 开始
    var curName = null,curMobile = null;
    //var curChatUserId = 'miku_78743';
    var curChatUserId = '';
    var conn = null;
    var groupFlag = URL.param.coopCode;//判断是否是群组
    var groupFlagMark = 'groupchat';
    var groupName;
    var msgCardDivId = "chat01";
    var talkToDivId = "talkTo";
    var talkInputId = "talkInputId";
    var bothRoster = [];
    var toRoster = [];
    var maxWidth = 200;
    var numIndex=0;

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
        //收到文件消息的回调方法
        onFileMessage : function(message) {
            //handleFileMessage(message);
        },
        //收到命令消息
        onCmdMessage: function(message) {
            handleCmdMessage(message);
        },


        //收到联系人信息的回调方法
        //onRoster: function(message) {
        //    handleRoster(message);
        //},

        //异常时的回调方法
        onError: function(message) {
            handleError(message);
        }
    });

    var emExpertId = null;
    var groupQuering = false;
    var textSending = false;
    var time = 0;
    var flashFilename = '';
    var audioDom = [];
    var picshim;
    var audioshim;
    //var fileshim;
    var PAGELIMIT = 8;
    var pageLimitKey = new Date().getTime();
    var currentIMMsg = [];//当前用户的信息
    var currentIMLocal = localStorage.getItem('currentIM');//当前用户的信息保存在localstorage中的
    var user,//环信用户
        pass,//环信密码
        sessionId,//环信sessionId
        reportId;//报告id
    currentIMLocal = JSON.parse(currentIMLocal);
    var curUserId = currentIMLocal && currentIMLocal[0] ? currentIMLocal[0] :  null;

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
    //var flashFileUpload = function ( url, options ) {
    //    flashUpload(fileshim, url, options);
    //};
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
    //var showLoginUI = function () {
    //    if (!Data.checkProfileId()) return ERROR_PROMISE;
    //};

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
        if ( Easemob.im.Helper.getIEVersion && Easemob.im.Helper.getIEVersion < 10 ) {
        }
        var loginInfo = getLoginInfo();
        if (loginInfo.isLogin) {

        }
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
                conn.setPresence();
                //getChatRecord(curChatUserId);

                //sendCallExpert();
            }
        });

        if ( !Easemob.im.Helper.isCanUploadFileAsync && typeof uploadShim === 'function' ) {
            picshim = uploadShim('sendPicInput', 'pic');
            audioshim = uploadShim('sendAudioInput', 'aud');
            // fileshim = uploadShim('sendFileInput', 'file');
        }

        //获取聊天消息
        getChatRecord();

        //启动心跳
        if (conn.isOpened()) {
            conn.heartBeat(conn);
        }
    };

    //获取聊天消息
    var getChatRecord = function(){
       if (chatRecord && chatRecord[0] == curUserId) {
           console.log(typeof chatRecord[1]);
                $.each(chatRecord[1],function(i,msgLocal){
                    var msgtext = msgLocal.data,
                        from = msgLocal.from,
                        to = msgLocal.to,
                        time = msgLocal.chat_timestamp;
                    if(msgtext && msgtext instanceof Array > 0){        //判断消息体是不是数组
                        msgtext = msgLocal;
                    }
                    if(msgLocal.ext && msgLocal.ext.em_expression_id){     //大表情
                        msgtext = msgLocal.data
                    }
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

                //如果是发送消息之后还没获取聊天记录的，将未读消息放在最后面
                var currentDiv =  getContactChatDiv(chatUserId),
                    currentDivFirst = $(currentDiv).find('.chatMess').eq(0);
                if(currentDivFirst.hasClass('left')){    //是用户发送的
                    for(var k = 0; k < parseInt($('#'+chatUserId).find('.badge').text());k++){
                        var $this = $(currentDiv).find('.chatMess').eq(k);
                        $(currentDiv).append($this.clone());
                        $this.remove();
                    }
                }
                })
       }
    }


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
        $('#chatWindow').append('<div class="logTimeOut" style="text-align: center;cursor: pointer;color:#42B8F4;text-decoration: underline;">连接超时，请重新登录！</div>');
        groupQuering = false;
        textSending = false;
    };
//异常情况下的处理方法
    var handleError = function(e) {


        clearPageSign();
        e && e.upload && $('#fileModal').modal('hide');
        if (curUserId == null) {
            //alert(e.msg + ",请重新登录");
            //showLoginUI();
            //URL.assign(URL.loginPageCsad);
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

        if(groupFlag){
            groupLogin();
            return false;
        }

        $('body').on('click','.inBtn',function(){
            handleLogin();
        })

        //setTimeout(function(){
        //    handleLogin();
        //},5000);
    }

    function handleLogin(){

        if((!description && !title)){
            var problem= $('#problem').val(),
                sex=$('#sex').val(),
                number=$.trim($('#number').val());
            var arr=[];
            arr[0]=problem;
            arr[1]=sex;
            arr[2]=number;
            localStorage.setItem('arrsave',JSON.stringify(arr));//回现作用

            addRedB(problem,'problem');
            addRedB(sex,'sex');
            addRedB(number,'number');
            if(problem=='' || sex==''){
                return false;
            }
            if(!number.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/)){
                $('#number').addClass('redBorder');
                if(number!==''){
                    bainx.broadcast('请输入正确的手机号码！');
                }
                return false;
            }
            function addRedB(val,selector){
                if(val=='') {
                    $('#'+selector).addClass('redBorder');
                    return false;
                }else{
                    $('#'+selector).removeClass('redBorder');
                }
            }
        }



        createSingleIM();

        Data.getRandomOneOnlineCsad().done(function(res){
            if(res){
                var userOneOnlineId=res.emUserName;//环信id
                if(userOneOnlineId=='' || !userOneOnlineId){
                    bainx.broadcast('暂时没有专家在线，请稍后再咨询！');
                    return false;
                }
                $('.mainContainer').show();
                $('.chatMain').hide();

                    $('.chat02').show();


                //$('.mTitle').css('background-color','#42454D');
                var csadName=res.csadDO.csadName;//专家名
                var userId=res.csadDO.userId;//专家id
                var csadPicUrl=res.csadDO.csadPicUrl;
                //$('.mTitle').html(csadName);
                $('.addBox').css('display','block');
                $('.container').css('background-color','#eee');
                var dataK=['csadName','userId','csadPicUrl'];
                var dataV=[csadName,userId,csadPicUrl];
                setStorage(dataK,dataV);
                curChatUserId=userOneOnlineId;

                //操作匿名用户轨迹表数据:每次进行请求连接登录的时候
                var data={
                    sessionId:sessionId,
                    expertId:userId,
                    //remark:remark备注
                    name:csadName,
                    loginEntrance:loginentrance//官网，微信，微博
                }
                Data.tempAddOneDialogData(data).done(function(res){
                    if(res.flag){
                        console.log(res.flag);
                    }
                })
            }

        });

        if((!description && !title) ){
            setTimeout(function(){
                sendCallExpert();
            },2000)
        }
    }

    //处理已创建用户的专家
    function handleEstablishCasd(){
        var currentCsadIM=localStorage.getItem('currentCsadIM');//获取缓存中注册用户对应专家
        var userOneOnlineId=JSON.parse(currentCsadIM)[0];//环信id
        if(userOneOnlineId=='' || !userOneOnlineId){
            bainx.broadcast('暂时没有专家在线，请稍后再咨询！');
            return false;
        }
        $('.mainContainer').show();
        $('.chatMain').hide();
        var csadName=JSON.parse(currentCsadIM)[1];//专家名
        var userId=JSON.parse(currentCsadIM)[0].split("_")[1];//专家id
        var csadPicUrl=JSON.parse(currentCsadIM)[3];
        //$('.mTitle').html(csadName);
        $('.addBox').css('display','flex');
        $('.container').css('background-color','#eee');

            $('.chat02').show();


        var dataK=['csadName','userId','csadPicUrl'];
        var dataV=[csadName,userId,csadPicUrl];
        setStorage(dataK,dataV);
        curChatUserId=userOneOnlineId;

        //  $('.mTitle').css('background-color','#42454D');//得到注册用户后设置
    }

    //处理设置localStorage
    function setStorage(arrK,arrV){
        for (var i in arrK){
            localStorage.setItem(arrK[i],arrV[i]);
        }
    }


    //创建单个用户-----
    function createSingleIM(){

        localStorage.removeItem('currentIM');

        currentIMLocal = [];

        Data.getTempEmUser().done(function(res){
            user = res.vo.emUserName;
            pass = res.vo.emUserPw;
            sessionId=res.vo.sessionId;

            var userData=[];
            userData[0]=user;
            userData[1]=pass;
            userData[2]=sessionId;
            var userData = JSON.stringify(userData);
            localStorage.setItem('userData',userData);//保存信息

            defineBrowserCycle('sessionId',sessionId);//发一个浏览器生周期

            if (user == '' || pass == '') {
                alert("请输入用户名和密码");
                return;
            }
            //hiddenLoginUI();
            //根据用户名密码登录系统
            loginImSystem(user,pass);

        })
    }

    //群组登录 -----江苏卫视
    function groupLogin(){
        //获取群组
        // if(groupFlag){
        var data = {
            coopUserId:URL.param.coopUserId,
            coopCode:URL.param.coopCode
        }
        Data.getClientThreeTalkMikuEmGroup(data).done(function(res){
            var vo = res.vo;
            curRoomId = vo.emGroupId;
            groupName = vo.groupName;
            user =  res.clientIm.userName;
            pass = res.clientIm.password;
            $('.container').attr({'data-uid':vo.clientUserId,'data-emid-user':vo.clientEmUser,'data-emid-expert':vo.expertEmUser,'data-uid-expert':vo.expertUserId});
            //根据用户名密码登录系统
            loginImSystem(user,pass);
        })
        //}
    }


    //根据用户名密码登录系统
    function loginImSystem(user,pass){

        conn.open({
            apiUrl : Easemob.im.config.apiURL,
            user : user,
            pwd : pass,
            //连接时提供appkey
            appKey : Easemob.im.config.appkey
        });
    }

    //创建已注册用户聊天
    function establishRegisterChat(){
        localStorage.removeItem('currentIM');

        currentIMLocal = [];
        var currentUserIM=localStorage.getItem('currentUserIM');//获取缓存中注册用户信息
        var chatName=JSON.parse(currentUserIM)[0];//用户名
        var chatPass=JSON.parse(currentUserIM)[1];//用户密码
        //根据用户名密码登录系统
        loginImSystem(chatName,chatPass);
    }

    //定义浏览器的生命周期
    function defineBrowserCycle(key,value){
        sessionStorage.setItem(key,value);
    }

    //分析报告预览
    function viewReport(_uid){

        if(isRegist){
            var data={
                dId:_uid
            }
            Data.getDetectRecordDetail(data).done(function(res){

                previewReport(res,true)
            })
        }else {
            var data = {
                sessionId : _uid
            }
            Data.tempfinalUserData(data).done(function(res){
                previewReport(res,true)
            })
        }
    }

    //预览的内容
    function previewReport(res,sendAfter){
        var resDate = res.data;
        var hide = sendAfter ? 'style="display:none"' : '';
        $('body').append('<section class="telDialog wl-trans-dialog translate-viewport reportPreview" id="reportPreview" style="display: block;"><div class="reportPreviewContent"><i class="closeBtn closeReportPreview"></i><div class="reportPreviewTitle">用户诊断分析报告</div><div class="detailContent"><dl>'+getDetectRecord(resDate)+'</dl></div><div class="footerTool"><span class="resetBtn">取消</span></div></div></section>');
    }

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
        //txt.focus();
    };

    //发文字和表情
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

        var options={};
        var csadPicUrl='';
        if(isRegist){//给聊天分辨是注册用户还是匿名用户
            options = {
                to : curChatUserId,
                msg : msg,
                ext : {isTempEm:0},
                type : "chat"
            };
            var currentUserIM=localStorage.getItem('currentUserIM');//获取缓存中注册用户信息
            csadPicUrl=JSON.parse(currentUserIM)[4];//用户头像
        }
        else {
            var sessionIdU=localStorage.getItem('userData');
            sessionId=JSON.parse(sessionIdU)[2];

            //分来项目进去
            if((!description && !title)){
                var arrsave=localStorage.getItem('arrsave');
                var tel=JSON.parse(arrsave)[2];
                options = {
                    to : curChatUserId,
                    msg : msg,
                    ext : {sessionId:sessionId,flag:loginentrance,tel:tel,isTempEm:1},
                    type : "chat"
                }
            }else {
                options = {
                    to : curChatUserId,
                    msg : msg,
                    ext : {sessionId:sessionId,flag:loginentrance,isTempEm:1},
                    type : "chat"
                }
            }

        }
        // 群组消息和个人消息的判断分支
        if (groupFlag) {
            options.type = 'groupchat';
            options.to = curRoomId;
            options.ext.groupName = groupName;
            options.ext.coopCode = groupFlag;
            options.ext.isExpert = 0;
            csadPicUrl='';//用户头像
        }
        //easemobwebim-sdk发送文本消息的方法 to为发送给谁，meg为文本消息对象
        conn.sendTextMessage(options);

        //保存消息
        handleSaveData(options);

        //修改消息来源
        // insertOrUpdateSession(to,curUserId,source)

        //当前登录人发送的信息在聊天窗口中原样显示
        //var msgtext = Easemob.im.Utils.parseLink(Easemob.im.Utils.parseEmotions(encode(msg)));
        var msgtext = Easemob.im.Utils.parseEmotions(encode(msg));
        // console.log(msgtext,msg);

        var to=curChatUserId;
        var chatName=localStorage.getItem('csadName');

        numIndex=numIndex+1;
        if(handleChatTimepPoor()>15){//看时差15分钟
            sendCallExpertForChatEd();
        }

        appendMsg(curUserId, to, msgtext,'','','',chatName,csadPicUrl);
        turnoffFaces_box();
        msgInput.value = "";
        setTimeout(function() {
            textSending = false;
        }, 1000);
    };

    //登录环信给专家发一条消息匿名用户
    var sendCallExpert = function(msg) {
        if(!groupFlag){
            var sessionIdU=localStorage.getItem('userData');
            sessionId=JSON.parse(sessionIdU)[2];
            var options={};

            //判断是不是从项目进入
            if((!description && !title)){
                var arrsave=localStorage.getItem('arrsave');
                var problem=JSON.parse(arrsave)[0];
                var sex=JSON.parse(arrsave)[1];
                var tel=JSON.parse(arrsave)[2];
                options = {
                    to : curChatUserId,
                    msg : '',
                    // ext:MikuExpand == 'CallExpert'
                    ext : {"MikuExpand":"CallExpert",sessionId:sessionId,flag:loginentrance,demand:problem,sex:sex,tel:tel,isTempEm:1},//官网2，微信3，微博4入口
                    type : "chat"
                };
            }else {//项目进入
                options = {
                    to : curChatUserId,
                    msg : '',
                    // ext:MikuExpand == 'CallExpert'
                    ext : {"MikuExpand":"CallExpert",sessionId:sessionId,flag:loginentrance,isTempEm:1},//loginentrance官网2，微信3，微博4入口
                    type : "chat"
                };
            }


            //easemobwebim-sdk发送文本消息的方法 to为发送给谁，meg为文本消息对象
            conn.sendTextMessage(options);
        }
    };

    //登录环信给专家发一条消息注册用户
    function sendCallExpertForChatEd() {
        if (!groupFlag) {
            var options = {
                to: curChatUserId,
                msg: '',
                // ext:MikuExpand == 'CallExpert'
                ext: {"MikuExpand": "CallExpert", flag: loginentrance, isTempEm: 0,demand:title},
                type: "chat"
            };

            conn.sendTextMessage(options);
        }
    }

    //登录环信给专家发一条消息从项目进入
    function sendCallExpertForChatEdXiangM(){
        if(!groupFlag) {
            var sessionIdU = localStorage.getItem('userData');
            sessionId = JSON.parse(sessionIdU)[2];
            var options = {
                to: curChatUserId,
                msg: '',
                // ext:MikuExpand == 'CallExpert'
                ext: {"MikuExpand": "CallExpert", sessionId: sessionId, flag: loginentrance, isTempEm: 0,demand:title},
                type: "chat"
            };
            conn.sendTextMessage(options);
        }
    }

    //项目进入再发一条消息
    function sendCallExpertForChatEdForProject(){
        if(!groupFlag) {
            var options = {
                to: curChatUserId,
                msg: '描述：' + description + ',标题：' + title,
                ext: {sessionId: sessionId, flag: loginentrance, isTempEm: 1},//loginentrance官网2，微信3，微博4入口
                type: "chat"
            };
            conn.sendTextMessage(options);
        }
    }


    //处理聊天和上条时间的时间差
    function handleChatTimepPoor(){
        var chatTimeQ='',minites='';
        if($('.chatMess').last().length > 0){
            chatTimeQ = new Date().getTime();
            var timeStr =  $('.chatMess').last().find('.chatTime').data('timestape')==0 ? chatTimeQ : $('.chatMess').last().find('.chatTime').data('timestape'),
                timecha = chatTimeQ - timeStr;
            minites = Math.floor(timecha/(60*1000));
        }
        return minites;
    }

    timer();
    //定时器
    function timer(){
        setInterval(function(){
            if(handleChatTimepPoor()>15 && timeFlag){
                var commentTmp = '';
                if(isRegist){
                    commentTmp = comment();
                }
                $('#chatWindow').append('<p1 class="waitExpert tc">已经很久没收到您的消息了，系统将自动结束本次对话，如果您有其他问题，请<span class="reCallExp">重新接入</span>。</p1>'+commentTmp);
                timeFlag=false;
            }
        },1000);
    }


    //发大表情
    var bigMotion = function(name,i) {
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
            msg : name,
            ext : {"em_expression_id":"em"+(1000+i+1),"em_is_big_expression":true},
            type : "emotion"
        };

// 群组消息和个人消息的判断分支
        if (groupFlag) {
            options.type = 'groupchat';
            options.to = curRoomId;
            options.ext.groupName = groupName;
            options.ext.coopCode = groupFlag;
            options.ext.isExpert = 0;
            csadPicUrl='';//用户头像
        }

        //easemobwebim-sdk发送文本消息的方法 to为发送给谁，meg为文本消息对象
        conn.sendTextMessage(options);

        options.data = options.msg;
        //存储文本数据
        options.from = curUserId;
        var chatName=localStorage.getItem('csadName');
        //insertdbData(to,curUserId,timestamp,1,1,messageJ,chatName,1);

        //当前登录人发送的信息在聊天窗口中原样显示
        //var msgtext = Easemob.im.Utils.parseLink(Easemob.im.Utils.parseEmotions(encode(msg)));
        var msgtext = Easemob.im.Utils.parseEmotions(encode(options.msg));
        numIndex=numIndex+1;
        var csadPicUrl='';
        var currentUserIM=localStorage.getItem('currentUserIM');//获取缓存中注册用户信息
        if(isRegist){
            csadPicUrl=JSON.parse(currentUserIM)[4];//用户头像
        }

        if(handleChatTimepPoor()>15){//看时差15分钟
            sendCallExpertForChatEd();
        }

        appendMsg(curUserId, to, msgtext,'','','',chatName,csadPicUrl);
        turnoffFaces_box();
        if($('#talkInputId').val().length<=0){
            $('.inMove').show();
            $('.inMove2').hide().removeClass('sendText1');
        }
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
        var agentFlag=localStorage.getItem('agentFlag');
        var fI = $('#fileInput');
        if(agentFlag=='false'){
            fI.val('').attr('data-type', $this.attr('type')).click();
        }else {
            fI.val('').attr('data-type', $this.attr('type'));
        }


    };
    //$('#sendPicBtn, #sendAudioBtn, #sendFileBtn').on('click', send);
    $('body').on('change','#fileInput',function(){
        //$('#fileInput').on('change', function() {
        // console.log('000')

        switch ( this.getAttribute('data-type') ) {
            case 'img':
                sendPic();
                break;
        }
    });

//发送图片
    var sendPic = function() {

        var to = curChatUserId;
        if (to == null) {
            return;
        }

        hideDom('moveList');

        var chatName=localStorage.getItem('csadName');
        var filename='dd',
            img= document.createElement("img");
        var file = document.getElementById('fileInput');
        var objUrl = getObjectURL(file.files[0]);
        img.src = objUrl;
        numIndex=numIndex+1;
        var csadPicUrl='';
        if(isRegist){
            var currentUserIM=localStorage.getItem('currentUserIM');//获取缓存中注册用户信息
            csadPicUrl=JSON.parse(currentUserIM)[4];//用户头像
        }
        if(groupFlag){
            csadPicUrl='';//用户头像
        }

        if(handleChatTimepPoor()>15){//看时差15分钟
            sendCallExpertForChatEd();
        }

        appendMsg(curUserId, to, {
            data : [{
                type : 'pic',
                filename : filename,
                data : img
            }]
        },'','','',chatName,csadPicUrl);



        //$('#chatWindow .right').last().find('.viewImgInChat').addClass('vB');

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
                    //$('#chatWindow .right:last-child .viewImgInChat').text(messageContent);
                    $('#chatWindow .right_'+numIndex).find('.viewImgInChat').children('img').attr('src','hhhhhhhhhhhh');
                    appendMsg(curUserId, to, messageContent);
                },
                onFileUploadComplete : function(data) {

                    //var file = document.getElementById('fileInput'),
                    img;
                    if ( Easemob.im.Helper.isCanUploadFileAsync && file && file.files) {
                        //var objUrl = getObjectURL(file.files[0]);
                        //if (objUrl) {
                        //    //img= document.createElement("img");
                        //    //img.src = objUrl;
                        //    //$('#chatWindow .right_'+numIndex).find('.viewImgInChat').html('<img src="'+objUrl+'">');
                        //    //img.width = maxWidth;
                        //}
                        $('#chatWindow .right').last().find('.viewImgInChat').removeClass('vB');
                    } else {
                        $('#chatWindow .right').last().find('.viewImgInChat').removeClass('vB');
                        //filename = data.filename || '';
                        //img = document.createElement("img");
                        //img.src = data.uri + '/' + data.entities[0].uuid;

                        //$('#chatWindow .right_'+numIndex).find('.viewImgInChat').html('<img src="'+data.uri + '/' + data.entities[0].uuid+'">');
                    }


                    //保存消息
                    handleSaveData(opt);

                },
                flashUpload: flashPicUpload
            };
            if(!isRegist){  //匿名用户发送sessionId
                opt.ext ={
                    sessionId :sessionId
                }
            }
            // 群组消息和个人消息的判断分支
            if (groupFlag) {
                opt.type = 'groupchat';
                opt.to = curRoomId;
                opt.ext ={
                    groupName : groupName,
                    coopCode : groupFlag,
                    isExpert : 0
                };
            }
            conn.sendPicture(opt);



            return;
        }
        //alert("不支持此图片类型" + filetype);
        $('#chatWindow .right_'+numIndex).find('.viewImgInChat').text('发送失败！不支持此图片类型'+filetype);
        $('#chatWindow .right').last().find('.viewImgInChat').removeClass('vB');
    };

    //处理隐藏dom
    function hideDom(ele){
        $('.'+ele).hide();
    }

//easemobwebim-sdk收到文本消息的回调方法的实现
    var handleTextMessage = function(message) {
        var from = message.from;//消息的发送者
        var mestype = message.type;//消息发送的类型是群组消息还是个人消息
        var messageContent = message.data;//文本消息体


        var csadName = groupSaveNH(mestype,message).csadName;
        var csadPicUrl =  groupSaveNH(mestype,message).csadPicUrl;

        //TODO  根据消息体的to值去定位那个群组的聊天记录

        if(!(message.ext && (message.ext.MikuExpand == 'ExpertRespond' || message.ext.MikuExpand == 'IsOver'))){
            //保存消息
            handleSaveData(message);
        }


        if(message.ext && message.ext.MikuExpand == 'UserReport'){
            appendMsg(from, from, messageContent,message.ext.MikuExpand,message,'',csadName,csadPicUrl);
        }else if(message.ext && message.ext.MikuExpand == 'CheckBox'){
            appendMsg(from, from, messageContent,message.ext.MikuExpand,message,'',csadName,csadPicUrl);
        }else if(message.ext && message.ext.MikuExpand == 'IsOver'){//专家主动结束聊天
            appendMsg(from, from, messageContent,message.ext.MikuExpand,'','',csadName,csadPicUrl);
        }
        else{
            appendMsg(from, from, messageContent,'','','',csadName,csadPicUrl);
        }



    };

    function handleSaveData(message){
        //存储文本数据
        var len = 0,chatRarr = [];
        if(!chatRecord){
            chatRecord = [message];
            chatRarr = [curUserId,chatRecord];
        }
        else{
            len = chatRecord[1].length;
            chatRecord[1][len] = message;
            chatRarr = [curUserId,chatRecord[1]];
        }
        chatRecord = chatRarr;
        var messageJ = JSON.stringify(chatRarr);
        localStorage.setItem('chatRecord',messageJ);

    }

    //聊天的昵称头像存储
    function groupSaveNH(mestype,message){
        //接收处理是否注册用户还是匿名
       var csadName,csadPicUrl;
        if(isRegist){
            var currentCsadIM=localStorage.getItem('currentCsadIM');//获取缓存中注册用户对应专家
            csadPicUrl=JSON.parse(currentCsadIM)[3];//专家头像
            csadName=JSON.parse(currentCsadIM)[1];//专家名字
            emExpertId = JSON.parse(currentCsadIM)[0];
        }else {
            csadPicUrl=localStorage.getItem('csadPicUrl');
            csadName=localStorage.getItem('csadName');
        }

        if(mestype == 'groupchat'){      //群聊
            var msgLocal;
            if(message.ext.isExpert == '1') {        //专家
                msgLocal = 'groupExpert';
                emExpertId = message.from;
            }
            else{
                msgLocal = 'groupSell';
            }
            var groupExpert = localStorage.getItem(msgLocal);
            if(groupExpert){
                groupExpert = JSON.parse(groupExpert);
                csadName = groupExpert[0];
                csadPicUrl = groupExpert[1];
            }
            else{
                var data = {
                    emUserName: message.from
                }
                Data.getUserInfoIM(data).done(function(res){
                    var groupExpert = [res.nickName,res.headPic,res.emUserName];
                    groupExpert = JSON.stringify(groupExpert);
                    localStorage.setItem(msgLocal,groupExpert);
                    csadName = res.nickName;
                    csadPicUrl = res.headPic;
                })
            }
        }
        else{
            emExpertId = message.from;
        }
        return {
            csadName:csadName,
            csadPicUrl:csadPicUrl
        }
    }


//easemobwebim-sdk收到表情消息的回调方法的实现，message为表情符号和文本的消息对象，文本和表情符号sdk中做了
//统一的处理，不需要用户自己区别字符是文本还是表情符号。
    var handleEmotion = function(message) {
        var from = message.from;
        var room = message.to;
        var mestype = message.type;//消息发送的类型是群组消息还是个人消息
        //showMessageTips(from,message);
        //保存消息
        handleSaveData(message);
        var csadName = groupSaveNH(mestype,message).csadName;
        var csadPicUrl =  groupSaveNH(mestype,message).csadPicUrl;

        appendMsg(from, from, message,'','','',csadName,csadPicUrl);


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

        //保存消息
        handleSaveData(message);

        var csadName = groupSaveNH(mestype,message).csadName;
        var csadPicUrl =  groupSaveNH(mestype,message).csadPicUrl;
        appendMsg(from, contactDivId, {
            data : [ {
                type : 'pic',
                filename : filename || '',
                data : img
            } ]
        },'','','',csadName,csadPicUrl);

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
        //保存消息
        handleSaveData(message);

        var csadName = groupSaveNH(mestype,message).csadName;
        var csadPicUrl =  groupSaveNH(mestype,message).csadPicUrl;

        appendMsg(from, contactDivId, {
            data : [ {
                type : 'audio',
                filename : filename || '',
                data : audio,
                audioShim: !window.Audio,
                length:message.length
            } ]
        },'','','',csadName,csadPicUrl);/**/
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

    //收到命令消息
    var handleCmdMessage = function(message){
        if(message.ext.inputing){
            if(message.ext.inputing == 'true'){
                document.title = '正在输入中'
            }
            else{
                document.title = '免费诊断'
            }
        }

    }

//显示聊天记录的统一处理方法
    var appendMsg = function(who, contact, message, onlyPrompt,messExcept,_timestamp,chatName,csadPicUrl) {




        timeFlag=true;//配合处理定时器
        if($('.chang_b').length>0){
            $('.sendText').removeClass('chang_b');
        }

        var contactDivId = contact;
        var chatName=chatName=='' || !chatName ? '' :  chatName+':';
        //var contactLi = getContactLi(contactDivId);


        // 消息体 {isemotion:true;body:[{type:txt,msg:ssss}{type:emotion,msg:imgdata}]}
        var localMsg = null;
        if (typeof message == 'string') {
            localMsg = Easemob.im.Helper.parseTextMessage(message);
            localMsg = localMsg.body;
        } else {
            localMsg = message.data;
        }
        //接收专家主动接收对话
        if(onlyPrompt && onlyPrompt=='IsOver'){
            var commentTmp = '';
            if(isRegist){
                commentTmp = comment();
            }
            message = '专家已结束对话！如果您有其他问题，请<span class="reCallExp">重新接入</span>。'+commentTmp;
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
            agentFlag=localStorage.getItem('agentFlag');
        var headstr;
        if(agentFlag=='true'){
            var img=csadPicUrl ? csadPicUrl : imgPath+'common/images/avatar9.png';
            headstr =(onlyPrompt && !messExcept) ? ['<p1 class="waitExpert tc">'+message+'</p1>'] : [ "<p2 class='chatTime "+showTime+"' data-timestape='"+chatTimeQ+"'>" + chatTime + "<b></b><br/></p2>","<p1 class='userPhoto'><img src='"+img+"' /></p1>","<p class='chatName agent'>"+chatName+"</p>"];
        }else{
            headstr =(onlyPrompt  && !messExcept) ? ['<p1 class="waitExpert tc">'+message+'</p1>'] : [ "<p2 class='chatTime "+showTime+"' data-timestape='"+chatTimeQ+"'>" + chatTime + "<b></b><br/></p2>","<p class='chatName'>"+chatName+"</p>"];
        }


        var header = $(headstr.join(''));
        var lineDiv = document.createElement("div");
        //var lineDiv;
        lineDiv.className="chatMess";
        var messageContent = localMsg,
            flg = onlyPrompt ? 0 : messageContent.length;



        //接收报告
        if(onlyPrompt && onlyPrompt  == 'UserReport'){
            var eletext = "<div data-id='"+messExcept.ext.UserReport_id+"' class='chat-content-p3 grid boxMessage viewReport'><img class='reportViewImg' src='" +imgPath + "/common/images/personalTailor/csad/reportViewImg.png'/><div><p class='describe_p'>姓名："+message+"</p><p class='describe_p'>管家："+messExcept.ext.UserReport_expertName+"</p><p class='describe_p'>日期："+messExcept.ext.UserReport_date+"</p></div><a class='viewReportInChat'>点击查看 >> </a> </div>";
            var ele = $(eletext);
            for (var j = 0; j < ele.length; j++) {
                lineDiv.appendChild(ele[j]);
            }
            reportId=messExcept.ext.UserReport_id;
        }

        //接收盒子
        if(onlyPrompt && onlyPrompt  == 'CheckBox'){
            var eletext = "<p3 data-id='"+messExcept.ext.BoxId+"' class='chat-content-p3 viewBoxInChat'><div class='boxMessage'><p class='title_p'>"+message+"</p><img src='"+imgPath + "/common/images/personalTailor/csad/box.png' class='boxImg'/><img src='"+imgPath + "/common/images/personalTailor/csad/just-for.png'/></div> </p3>";
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
                // console.log(msg);
                var eletext = "<img src='" + data + "' class='emotionImg'/>";
                var ele = $(eletext);
                for (var j = 0; j < ele.length; j++) {
                    lineDiv.getElementsByTagName('p3')[0].appendChild(ele[j]);
                }
                //$(".messageBody").append(eletext);
            }


            else if (type == "pic" || type == 'audio' ) {


                if (type == "pic" ) {
                    if(curUserId == who){
                        //data = '<span>图片发送中...</span>';
                        var ele = $(data);
                        for (var j = 0; j < ele.length; j++) {
                            lineDiv.getElementsByTagName('p3')[0].appendChild(ele[j]);
                        }
                    }
                    else{
                        data.nodeType && lineDiv.getElementsByTagName('p3')[0].appendChild(data);
                    }

                    lineDiv.getElementsByTagName('p3')[0].setAttribute("class", "chat-content-p3 viewImgInChat");
                }

                if( type == 'audio' ){
                    var filename = msg.filename;
                    data.nodeType && lineDiv.getElementsByTagName('p3')[0].appendChild(data);
                }

                //if(type == "audio"){
                //    data.className = 'hide';
                //
                //    var eleaudioT = "<div class='audioMsg'>"+msg.length+"\'\'</div>",
                //        eleaudio = $(eleaudioT);
                //    for (var j = 0; j < eleaudio.length; j++) {
                //        lineDiv.getElementsByTagName('p3')[0].appendChild(eleaudio[j]);
                //    }
                //    eleaudio.onclick = function(){
                //        data.play();
                //    }
                //
                //}

                //lineDiv.firstChild.setAttribute("class", "chat-content-p3");
                if(type == 'audio' && msg.audioShim) {
                    var d = $(lineDiv),
                        t = new Date().getTime();
                    d.append($('<div class="'+t+'"></div><button class="play'+t+'">播放</button><button style="display:none" class="play'+t+'">暂停</button>'));
                }
            }
            else {
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




        //消息显示
        var msgShowLast = true;

        var msgContentDiv = document.getElementById('chatWindow');
        if ( (onlyPrompt && !messExcept) ) {
            lineDiv.style.textAlign = "center";
            lineDiv.getElementsByTagName('p1')[0].className = 'waitExpert';
        } else if (curUserId == who) {

            lineDiv.style.textAlign = "right";
            lineDiv.setAttribute("class", "right chatMess right_"+numIndex);

            // lineDiv.firstChild.style.right = '20px';
        } else {
            lineDiv.style.textAlign = "left";
            lineDiv.setAttribute("class", "left chatMess");
            //lineDiv.firstChild.style.left = '20px';
        }



        var create = false;
        if (msgContentDiv == null) {
            //msgContentDiv = createContactChatDiv(contactDivId);
            create = true;
        }
        if(msgShowLast){
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

    //******************************聊天功能 结束
    //************************************h5 本地数据库


    return {
        layout:layout,//布局
        handleLogin:handleLogin,//登录聊天入口方法
        establishRegisterChat:establishRegisterChat,//处理已注册用户的聊天
        handleEstablishCasd:handleEstablishCasd,//处理已注册用户的专家聊天
        sendCallExpertForChatEd:sendCallExpertForChatEd,//登录环信给专家发一条消息
        sendCallExpertForChatEdForProject:sendCallExpertForChatEdForProject,//针对项目进入聊天再发一条消息
        sendCallExpertForChatEdXiangM:sendCallExpertForChatEdXiangM//从项目里进去呼叫专家
    }

})