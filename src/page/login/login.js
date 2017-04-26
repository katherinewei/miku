require([
	'jquery', 
    'h5/js/common/url', 
    'h5/js/common/data', 
    //'h5/js/common',
    //'h5/js/common/countDown',
    //'h5/js/page/createIMSingle',
    //'h5/js/common/transDialog',
    //'h5/js/common/weixin',
//],function($, URL, Data, Common, CountDown,CreateIMSingle,Dialog,WeiXin){
],function($, URL, Data ){
    function init(){

        $('body').append('<p style="margin: 30% auto;text-align: center">请马上进行免费咨询</p>');
        setTimeout(function(){
                URL.assign(URL.anonymousChatPage);
        },3000)

        //Data.getExpertWxQrcodeUrl().done(function(res){
        //        if(res.expertWxQrcodeUrl){
        //            URL.assign(URL.expertWxQrcodePage + '?wxQrcodeUrl='+res.expertWxQrcodeUrl);
        //        }
        //        else{
        //            bainx.broadcast('暂时没有专家在线，请稍后咨询。');
        //        }
        //    })
    }


    //var count_down_time = 0,Page,successDialog;
    //function init(){
    //
    //    //接除缓存数据对发现页的影响
    //    sessionStorage.removeItem('res');
    //    sessionStorage.removeItem('pg');
    //    sessionStorage.removeItem('indexNum');
    //    sessionStorage.removeItem('hasNext');
    //    sessionStorage.removeItem('typeflag');
    //
		//renderPage();
    //    weiXinShare();
		//bindEvents();
    //}
    //
    //function renderPage(){
		////var template = '<section id="loginPage"><!--<h1 class="title">一键登录</h1>--><div class="grid"><div class="row mobileRow"><div class="col col-4 tr fb fvc far"><label class="pd-10">+86</label></div><div class="col col-21"><input class="mobile pd-10" type="tel"  placeholder="请输入11位手机号" maxlength="11"></div></div><div class="imgVer"></div> <div class="row"><div class="col col-15"><input class="vercode tc pd-10" type="tel" placeholder="请输入4位验证码" maxlength="4"></div><div class="col col-10"><div class="button sendvercode ml-05">发送验证码</div></div></div></div><div class="panel"><div class="button submit">注册并登录</div></div></section>';
		////$('body').append(template);
    //    var mainPage = '<section class="inviteSP"><div class="banner"><img src="' + imgPath + 'common/images/9labmobile.png"><p>欢迎您加入9LAB</p> </div> <div class="makeMoneyWrap"> <div class="inputBox grid"><div class="row mobileRow"><div class="col"><input type="tel" class="mobile" placeholder="请输入手机号" maxlength="11"/></div> </div><div class="row imgVerCode"><div class="col col-15 fb far fvc "><input class="imgvercodeI" type="tel" placeholder="请输入图中验证码获取短信验证码" maxlength="4"></div><div class="col col-7 fb fvc fac"><div class="imgVeC ml-05"><img src="' + URL.getMobileVerificationCode + '"/></div></div></div> <div class="row verCodeRow"><div class="col col-15 fb far fvc "><input class="vercode" type="tel" placeholder="请输入4位验证码" maxlength="4"></div> <div class="col col-10 "><span class="sendvercode">获取验证码</span></div></div><div class="row"><div class="col"><input type="submit" class="btn submit" value="加入9LAB"/></div> </div></div> </div></section>';
    //    Page = $(mainPage).appendTo('body');
    //
    //
		////return $('#loginPage');
    //}
    //
    //function bindEvents(){
    //    Page.on('keyup','.mobile',function(){
    //        getImgVerCode($(this).val());
    //    }).on('tap','.imgVerCode img',function(){
    //        $(this).attr('src',URL.getMobileVerificationCode+'?mobile='+$('.mobile').val()+'&r='+Math.random());
    //    }).on('tap', '.sendvercode', function(event){
		//
		//	event.preventDefault();
    //        if(count_down_time == 0){
    //            sendVerCode($(this));
    //        }
		//}).on('tap', '.submit', function(event){
		//
		//	event.preventDefault();
		//	submit($(this));
		//});
    //}
    //
    ////获取图片验证码
    ////判断是否注册
    //function getImgVerCode(vmobile){
    //    if (/^[\d]{11}$/gi.test(vmobile)){
    //        Data.checkIsRegister(vmobile).done(function(res){
    //            var w = '';
    //            if(res.isRegister == 1){
    //                w = '登录'
    //            }
    //            else{
    //                w = '注册'
    //            }
    //            $('.submit').val(w);
    //        })
    //            //$('.imgVer').html('<div class="row imgVerCode"><div class="col col-15"><input class="imgvercodeI tc pd-10" type="tel" placeholder="请输入图中验证码获取短信验证码" maxlength="4"></div><div class="col col-7 fb fvc"><div class="imgVeC ml-05"><img src="'+URL.getMobileVerificationCode+'?mobile='+vmobile+'"/></div></div></div>');
    //    }
    //    else{
    //        //$('.imgVer').html('');
    //    }
    //}
    //
    //function startCountDown(btn){
    //    (new CountDown({
    //        time: 60,
    //        change: function(){
    //            count_down_time = this.time;
    //            btn.text(this.time + '秒');
    //            return this;
    //        },
    //        end: function(){
    //            btn.text('发送验证码').removeClass('disable');
    //            return this;
    //        }
    //    })).start();
    //}
    //
    //function sendVerCode(btn){
    //
    //    var mobile = $('.mobile', Page),
    //        vmobile = $.trim(mobile.val()),
    //        yzmNO = $('.imgvercodeI', Page),
    //        vyzmNO = $.trim(yzmNO.val());
    //
    //    if (!vmobile) {
    //        bainx.broadcast(mobile.attr('placeholder'));
    //        return false;
    //    } else if (!/^[\d]{11}$/gi.test(vmobile)) {
    //        bainx.broadcast('请输入正确的手机号码！');
    //        return false;
    //    }
    //    else if(!vyzmNO){
    //        bainx.broadcast(yzmNO.attr('placeholder'));
    //        return false;
    //    }
    //    var doneFn = function(res) {
    //            btn.addClass('disable').text('60秒');
    //            startCountDown(btn);
    //        },
    //        failFn = function(code, json) {
    //            setTimeout(function() {
    //                if (code === 7) {
    //                    btn.removeClass('disable').text('发送验证码');
    //                } else {
    //                    btn.removeClass('disable').text('重新发送');
    //                }
    //            }, 1000);
    //        };
    //
    //    Common.statistics('login', 'sendcode', 'invoke', 1);
    //
    //    btn.addClass('disable').text('正在处理..');
    //
    //    return Data.checkMobile(vmobile,vyzmNO).done(doneFn).fail(failFn);
    //}
    //
    //var startTime = new Date().getTime();
    //
    //function submit( btn){
		//var mobile = $('.mobile', Page),
    //        vercode = $('.vercode', Page),
    //        data = {
    //            mobile: $.trim(mobile.val()),
    //            checkNO: $.trim(vercode.val()),
    //            filterExpertUserId:URL.param.filterExpertUserId
    //        };
    //
    //    if (!data.mobile) {
    //        bainx.broadcast(mobile.attr('placeholder'));
    //        return;
    //    } else if (!/^[\d]{11}$/gi.test(data.mobile)) {
    //        bainx.broadcast('请输入正确的手机号码！');
    //        return;
    //    }
    //
    //    if (!data.checkNO) {
    //        bainx.broadcast(vercode.attr('placeholder'));
    //        return;
    //    } else if (data.checkNO.length !== 4) {
    //        bainx.broadcast('请输入4位数字验证码');
    //        return;
    //    }
    //
    //    btn.addClass('disable').text('用户登录中.');
    //
    //    var doneFn = function(res) {
    //            btn.text('登录成功');
    //            var isExpert = localStorage.getItem('isExpert');
    //            if(!isExpert){
    //                var dataJudge={mobile:data.mobile}
    //                Data.checkIsExper(dataJudge).done(function(res){
    //                    localStorage.setItem('isExpert',res.isExpert);
    //                })
    //            }
    //            if(URL.param.filterExpertUserId && !URL.param.refurl){
    //                if (!successDialog) {
    //                    successDialog = new Dialog($.extend({}, Dialog.templates.top,{
    //                        id: 'weixinKFDialog',
    //                        template: '<section ><img src="' + imgPath + 'common/images/9labmobile.png"/> <p>欢迎加入9LAB</p></section>',
    //                        //events: {
    //                        //    'tap .close': function (event) {
    //                        //        event.preventDefault();
    //                        //        successDialog.hide();
    //                        //    }
    //                        //}
    //                    }))
    //                }
    //                successDialog.show();
    //            }
    //            else{
    //                    var sessionId = URL.param.sessionId ? URL.param.sessionId : '';
    //                    CreateIMSingle(doneAfter,true,sessionId);
    //                }
    //
    //        },
    //        failFn = function() {
    //            btn.removeClass('disable').text('重新登录');
    //        },
    //        doneAfter = function(){
    //
    //
    //
    //            if(URL.param.refurl){
    //                URL.assign(decodeURI(URL.param.refurl));
    //            }
    //            else{
    //                history.back();
    //            }
    //        };
    //
    //
    //    Common.statistics('login', 'sendcode', 'success', new Date().getTime() - startTime);
    //
    //
    //    return Data.login(data).done(doneFn).fail(failFn);
    //}
    //
    //function weiXinShare(){
    //    if(Common.inWeixin){
    //        //console.log(document.title);
    //        var shareUrl = location.href;
    //        var shareImgUrl = imgPath + 'common/images/share_login.png',
    //            desc =  '欢迎加入9LAB',
    //            shareOption = {
    //                title: '欢迎加入9LAB', // 分享标题
    //                desc: desc, // 分享描述
    //                link: shareUrl,
    //                type: 'link',
    //                dataUrl: '',
    //                imgUrl: shareImgUrl
    //            },
    //            shareOptionTimeline = {
    //                title: desc,
    //                link: shareUrl,
    //                imgUrl: shareImgUrl
    //            };
    //
    //        WeiXin.hideMenuItems();
    //        WeiXin.showMenuItems();
    //        WeiXin.share(shareOption, shareOptionTimeline);
    //    }
    //}

	//入口
	init();
});