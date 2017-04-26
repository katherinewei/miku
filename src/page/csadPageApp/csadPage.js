/**
 * 专家端页面
 * Created by xiuxiu on 2016/7/5.
 */
require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/page/csadGroup',
    'h5/js/page/csadViewUserLog',
    'h5/js/page/csadPerformanceQuery',

], function($,URL, Data,CsadGroup,ViewUserLog,PerformanceQuery)
{

    var currentIMLocal = localStorage.getItem('currentIM');//当前用户的信息保存在localstorage中的
    var user,//环信用户
        pass,//环信密码
        curName,
        curMobile,
        noPhoto = imgPath+'common/images/avatar9.png',
        currentIMMsg = [];//当前用户的信息;
    currentIMLocal = JSON.parse(currentIMLocal);
    var curUserId = curUserId = currentIMLocal && currentIMLocal[0] ? currentIMLocal[0] :  null;
    function init(){

        var template = '<header class="grid"><div class="headPicCol"><div id="headerimg" class="titleHeader" title="在线"><div class="headImg"> <div class="img-circle-50"><img id="myPic" /></div><span class="cur-online"></span></div><div id="login_user" class="login_user_title col"><p> <a class="curName"></a></p><p class="wxno-user"></p></div></div></div><div class="rightHead"><span class="addNewCsad" title="添加新专家"></span><span class="editCsad" title="编辑信息"></span></div> </header><div class="container grid"><div class="leftNav"><ul></ul><span id="logout"></span></div><div class="rightContainer"> <div class="wrap"><div class="wrapper"></div> </div> </div></div>';

        $('body').append(template);
        //$('.container').height($(window).height()-84);
        //$('.wrapper').height($(window).height()-$('.callWrap').height()-6);

        showChatUI();

    }
    var showChatUI = function () {


        var login_userEle = $("#login_user .curName"),
            login_userPic = document.getElementById("myPic");
        //if(currentIMLocal && currentIMLocal.length > 2){
        //    login_userEle.text(currentIMLocal[2]).attr('data-mobile',currentIMLocal[4]);
        //    //login_userEle.setAttribute('data-mobile',currentIMLocal[4]);
        //    login_userPic.src = currentIMLocal[3];
        //    curName = currentIMLocal[2];
        //    curMobile = currentIMLocal[4];
        //    $('.wxno-user').text('微信号：'+currentIMLocal[5]);
        //}
        //else{
            //var data = {
            //    emUserName:'miku_'+pageConfig.pid
            //}

            Data.fetchMineInfo().done(function(res){
                curMobile = res.mobile;
                var dataJudge={mobile:curMobile};
                Data.checkIsExper(dataJudge).done(function(resu){
                   var isExpert = resu.isExpert;
                    if(isExpert != 1){
                        bainx.broadcast('您不是专家，请登录专家号');
                        setTimeout(function(){
                            URL.assign(URL.loginPageCsad);
                        },2000)

                    }
                    else{
                        var headpic = res.headPic ? res.headPic : noPhoto;
                        //login_userEle.innerHTML = res.nickName;
                        login_userEle.text(res.nickName).attr('data-mobile',res.mobile);
                        curName = res.nickName;
                        login_userPic.src = headpic;
                        //login_userEle.setAttribute('data-mobile',res.mobile);
                       var wxno = res.wxno  ? res.wxno : '暂无';
                        $('.wxno-user').text('微信号：'+ wxno);
                        $('#headerimg').attr('emuserid',curUserId);
                        initNav();
                        bindEvent();
                    }
                })
                //currentIMMsg[0] = user;
                //currentIMMsg[1] = pass;
                //currentIMMsg[2] = res.nickName;
                //currentIMMsg[3] = headpic;
                //currentIMMsg[4] = res.mobile;
                //currentIMMsg[5] = res.wxno;
                //var currentIMMsgData = JSON.stringify(currentIMMsg);
                //localStorage.setItem('currentIM',currentIMMsgData);//保存信息
            })
            //login_userEle.setAttribute("title", curUserId);


       // }


    };
    function initNav(){
        var html = [],
            htmlContent = [],
            data = [
                //{
                //    name:'呼叫中心',
                //    className:'callCenter',
                //    url:URL.csadCallCenterPage+'?status=0',
                //    status:0,
                //
                //
                //
                //},{
                //    name:'聊天消息',
                //    className:'chatMessage',
                //    url:URL.csadChatMessagePage+'?status=1&source=1',
                //    status:1,
                //    source:1,
                //
                //},{
                //    name:'管理列表',
                //    className:'managementList',
                //    url:URL.csadManagementListPage,
                //    status:2,
                //
                //
                //},

                {
                    name:'用户列表',
                    className:'managementList'
                    // url:URL.csadManagementListPage,
                    //status:3,


                },
                {
                    name:'用户日志',
                    className:'viewUserLog'
                },
                {
                    name:'业绩查询',
                    className:'performanceQuery'
                },


                //,{
                //    name:'销售追踪',
                //    className:'salesTracking',
                //    url:URL.csadSalesTrackingPage+'?status=1&source=2',
                //    status:1,
                //    source:2,
                //
                //},{
                //    name:'蜜月回访',
                //    className:'payVisit',
                //    url:URL.csadHoneymoonReturnPage+'?status=1&source=3',
                //    status:1,
                //    source:3,
                //
                //}
                //,{
                //    name:'模版课程',
                //    className:'templateCourse',
                //    url:URL.csadHoneymoonReturnPage
                //}
            ],
            tpl ='<li class="{{className}} {{active}}" data-status="{{status}}" data-source="{{source}}" data-name="{{className}}"><i></i><p>{{name}}</p></li>',
            tplContent = '<div id="{{className}}_Wrap" class="contentWrap {{hide}}"></div>';

        $.each(data,function(index,item){
            //var itemUrl = item.url;
            //if(isContains(itemUrl,location.pathname)){
            //    //item.url = '';
            //    item.active = 'active';
            //}
            item.hide = 'hide';
            if(index == 0){
                item.active = 'active';
                item.hide = '';
            }
            htmlContent.push(bainx.tpl(tplContent,item));
            html.push(bainx.tpl(tpl,item));
        })
        $('.leftNav ul').append(html.join(''));
        $('.wrapper').append(htmlContent.join(''));
        CsadGroup.group();

       //PerformanceQuery();

        ViewUserLog();
        $('#viewUserLog_Wrap').hide();


    }
    function bindEvent(){
        $('body')
        //导航选择
            .on('mouseover', '.leftNav li i', function(){
                $('.leftNav li p').removeClass('show')
                $(this).next().addClass('show');
            })
            .on('mouseout', '.leftNav li i', function(){
                $('.leftNav li p').removeClass('show')
            })
            .on('click','.leftNav li i',function(){
                var parent = $(this).parent();
                parent.addClass('active').siblings().removeClass('active');
                var name = parent.data('name'),_wrap = $('#'+name+'_Wrap');
                _wrap.removeClass('hide').siblings().addClass('hide');
                if( name == 'performanceQuery'){
                    PerformanceQuery();
                }
                else{
                    _wrap.show();
                }
            })
            .on('click','#logout',function(){
                Data.logOut().done(function(){
                    bainx.broadcast('退出成功！');
                    localStorage.removeItem('isExpert');
                    localStorage.removeItem('currentIM');
                    URL.assign(URL.loginPageCsad)
                })
            })
            .on('click','.addNewCsad,.editCsad',function(){
                var iurl = '';
                    if($(this).hasClass('editCsad')){
                        iurl = '?expertUserId='+pageConfig.pid;
                    }
                    $('body').append('<section class="telDialog wl-trans-dialog translate-viewport csadDetailMsg" id="csadDetailMsgAdd" data-widget-cid="widget-0" style="display: block;"><div class="csadDetailMsgContent" style="position: relative"><i class="closeBtn"></i><iframe src="'+URL.expertRegisterPage+iurl+'"></iframe></div></section>');

            })
            .on('click','.closeBtn',function(){
                $(this).parent().parent().remove();
            })


        //点击隐藏菜单
        document.onclick = function ()
        {
            //oMenu.style.display = "none";
            //oMenu2.style.display = "none";
            //$('.pop_rment,#rightMenu,#rightMenu2').hide();//用户标签
            //$('.opareReply,.deleteContactMan,.setCsadStatus').addClass('hide');//快捷回复
            //$('#fillReportAndBox_Wrap').find('#rightMenu,#rightMenu2').hide();
            $('.showUserQR').hide();

        };

    }
    init();
})