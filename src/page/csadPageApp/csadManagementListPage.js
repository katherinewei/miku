/**
 * 专家端页面
 * Created by xiuxiu on 2016/7/5.
 */
require([
    'gallery/jquery/2.1.1/jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/page/csadCommon2',
    'h5/js/page/csadDirectionCenter',
    'h5/js/page/csadChatMessagePage',
    'h5/js/page/csadGroup',
    'h5/js/page/csadSalesTrackingPage',
    'h5/js/page/csadHoneymoonReturnPage'
], function($,URL, Data,CsadCommon,CsadDirectionCenter,CsadChatMessagePage,CsadGroup,CsadSalesTrackingPage,CsadHoneymoonReturnPage)
{
    function init(){
        // $('.waitting').hide();
        layout();
        //Group();

    }
    //框架
    function layout(){
        var template = '<div class="setCsadStatus hide"><ul><li class="iconOnline" data-state="1">我在线上</li><li class="iconLeave" data-state="2">离开</li><li class="iconLeave" data-state="0">离线</li></ul></div> <header class="grid"><div class="headPicCol"><div id="headerimg" class="titleHeader" title="在线"><div class="headImg"> <div class="img-circle-50"><img id="myPic" /></div><span class="cur-online"></span></div><div id="login_user" class="login_user_title col"><p> 您好，<a class="curName"></a></p></div></div></div><div class="callWrap row"><div class="call_title col" ><p>暂时没有用户呼叫！</p><ul id="call_title"></ul></div><div class="call_title_anonymous col" ><p>暂时没有匿名用户呼叫！</p><ul id="call_title_anonymous"></ul></div></div> </header><div class="container grid"><div class="leftNav"><ul></ul><span id="logout"></span></div><div class="rightContainer"> <div class="wrap"><div class="wrapper"></div> </div> </div></div>';

        $('body').append(template);

        $('.container').height($(window).height()-84);
        $('.wrapper').height($(window).height()-$('.callWrap').height()-6);

        initNav();
        CsadCommon.init();
        setTimeout(function(){
            render();
        },200)

        //专家半小时之内无页面操作刷新页面。。
        var timer;
        function startTimer(){
            clearTimeout(timer);
            timer=setTimeout(function(){
                URL.assign(location.href)},30*60*1000);
        }
        document.onmousemove=document.onmousedown=document.onkeydown=startTimer




        //window.onbeforeunload = function(){
        //    var data = {
        //        emUserName:$('#headerimg').attr('emuserid'),
        //        status:0,
        //        terminal:'pc'
        //    }
        //    Data.changeOneCsadStatus(data).done(function() {
        //
        //
        //    })
        //    return ("确定是否退出");
        //}
    }

    function initNav(){
        var html = [],
            htmlContent = [],
            data = [
                {
                    name:'呼叫中心',
                    className:'callCenter',
                    url:URL.csadCallCenterPage+'?status=0',
                    status:0,



                },{
                    name:'聊天消息',
                    className:'chatMessage',
                    url:URL.csadChatMessagePage+'?status=1&source=1',
                    status:1,
                    source:1,

                },{
                    name:'管理列表',
                    className:'managementList',
                    url:URL.csadManagementListPage,
                    status:2,


                },{
                    name:'填写报告与生成盒子',
                    className:'fillReportAndBox',
                    // url:URL.csadManagementListPage,
                    status:3,


                },{
                    name:'销售追踪',
                    className:'salesTracking',
                    url:URL.csadSalesTrackingPage+'?status=1&source=2',
                    status:1,
                    source:2,

                },{
                    name:'蜜月回访',
                    className:'payVisit',
                    url:URL.csadHoneymoonReturnPage+'?status=1&source=3',
                    status:1,
                    source:3,

                }
                //,{
                //    name:'模版课程',
                //    className:'templateCourse',
                //    url:URL.csadHoneymoonReturnPage
                //}
            ],
            tpl ='<li class="{{className}} {{active}}" data-status="{{status}}" data-source="{{source}}" data-name="{{className}}"><i></i><p>{{name}}</p></li>',
            tplContent = '<div id="{{className}}_Wrap" class="hide contentWrap"></div>';

        $.each(data,function(index,item){
            //var itemUrl = item.url;
            //if(isContains(itemUrl,location.pathname)){
            //    //item.url = '';
            //    item.active = 'active';
            //}
            htmlContent.push(bainx.tpl(tplContent,item));
            html.push(bainx.tpl(tpl,item));
        })
        $('.leftNav ul').append(html.join(''));
        $('.wrapper').append(htmlContent.join(''));
    }


    function render(){
        var tpm=CsadDirectionCenter.csadDirectionCenterHtml();
        $('.wrap .wrapper').append('<div id="index_Wrap">'+tpm+'</div>');
        CsadDirectionCenter.initDirectionCenter();

        //CsadCallCenterPage();
        //CsadChatMessagePage();
        //CsadGroup();
        //CsadSalesTrackingPage();
        //CsadHoneymoonReturnPage();


        //聊天页面
        // if(status == 1 && source==1) {
        CsadChatMessagePage();
        //CsadCommon.getPageStatus($('.chatMessage'));
        //CsadCommon.buildStrangerDiv("momogrouplist", "momogrouplistUL");

        //  }
        //呼叫页面
        //  if(status == 0 ){
        var template = '<section class="row callInCenterC"><div class="accordion-inner" id="callCenter" style="display:none"><ul id="callCenterUL" class="chat03_content_ul"></ul></div><div id="noCallMsg">暂时没有用户呼叫！</div> </section> </section>'
        $('#callCenter_Wrap').append(template);
        //CsadCommon.getPageStatus($('.callCenter'));//设置全局变量status && source //要加。。
        //CsadCommon.buildStrangerDiv("callCenter","callCenterUL");
        //  }

        //管理列表
        //    if(status == 2 ){
        // CsadGroup();
        //    }
        bindEvent();
    }

    function bindEvent(){
        $('body')
            .on('click', '.leftNav li i', function(){
                handleNavList($(this).parent());
            })
            .on('contextmenu','#headerimg',function(e){
                var e = e || window.event;
                e.stopPropagation();
                var pointX = e.pageX;
                var pointY = e.pageY;
                $('.setCsadStatus').removeClass('hide').css({'left':pointX+'px','top':pointY+'px'});
                var id=$(this).attr('data-id');
                var value=$(this).text();
                $('.editBtnReply').attr({'data-value':value,'data-id':id});
                $('.deleteBtnReply').attr('data-id',id);
                $(this).addClass('curReply').siblings().removeClass('curReply');
                return false;
            })
            .on('click', '.setCsadStatus li', function(){
                var state = $(this).data('state');
                CsadCommon.setCsadOffline(state);
            })
        //点击隐藏菜单
        document.onclick = function ()
        {
            //oMenu.style.display = "none";
            //oMenu2.style.display = "none";
            $('.pop_rment,#rightMenu,#rightMenu2').hide();//用户标签
            $('.opareReply,.deleteContactMan,.setCsadStatus').addClass('hide');//快捷回复
            $('#fillReportAndBox_Wrap').find('#rightMenu,#rightMenu2').hide();

        };

    }


    //点击导航
    function  handleNavList($this){
        $('#index_Wrap').addClass('hide');
        var status = $this.data('status');
        var source =  $this.data('source');
        var curPage = $this.attr('data-name'),
            outerW = $('#'+curPage+'_Wrap');
        //console.log('#'+curPage+'_Wrap');

        ////获取快速回复句子
        //if(status == 1 && $('#quickReply').length == 0){
        //    CsadCommon.quickReplySentense();
        //}

        CsadCommon.handleNav($this);

        if(outerW.children().length == 0){
            //    //聊天页面
            //    if(status == 1 && source==1) {
            //        CsadChatMessagePage();
            //        CsadCommon.getPageStatus($this);
            //        CsadCommon.buildStrangerDiv("momogrouplist", "momogrouplistUL");
            //        //获取快速回复句子
            //        CsadCommon.quickReplySentense();
            //
            //    }
            //    //呼叫页面
            //    if(status == 0 ){
            //        var template = '<section class="row callInCenterC"><div class="accordion-inner" id="callCenter" style="display:none"><ul id="callCenterUL" class="chat03_content_ul"></ul></div><div id="noCallMsg">暂时没有用户呼叫！</div> </section> </section>'
            //        $('#callCenter_Wrap').append(template);
            //        CsadCommon.getPageStatus($this);//设置全局变量status && source //要加。。
            //        CsadCommon.buildStrangerDiv("callCenter","callCenterUL");
            //    }
            //
            //管理列表
            if(status == 2 ){
                CsadGroup.group();
            }
            if(status == 3 ){
                CsadGroup.group(true);
            }
            //
            //销售
            if(status == 1 && source==2 ) {
                CsadSalesTrackingPage.init(2,'',0,1,false);
            }
            //回访
            if(status == 1 && source==3 ) {
                CsadHoneymoonReturnPage.init(1);
            }
            //
        }
        else{
            //if(status == 2 ||status == 3  ){
            //    CsadGroup.groups(true);
            //}
        }

    }
    init();
})