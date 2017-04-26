/**
 * 诊断分析报告 && 盒子 && 用户轨迹
 * Created by xiuxiu on 2016/7/28.
 */
define('h5/js/page/csadUserMessage',[
    'jquery',
    'h5/js/common/url',
    'h5/js/page/csadUserTrajectory',
    'h5/js/page/csadQuestionnaireSurveyPage',

    'h5/js/page/getCsadPage'
], function ($,URL,CsadUserTrajectory,csadQuestionnaireSurveyPage,getCsadPage) {

    var csadUserMessage = function(obj,_uid,_Wrap){
        var tpl = '<div class="csadUserMessageContainer" id="csadUserMessageContainer_'+_uid+'"><div class="csadUserMsgTitle"><ul></ul><div class="questionBtnG show" ><span title="公众号预览" class="previewBtnI  previewBtnIQue"></span><span title="保存" class="saveQuetionI "></span> </div><div class="createBoxBtnG" ><span title="公众号预览" class="previewBtnI  previewBtnIBox"></span> </div></div><div class="csadUserMsgContent"></div></div>';
        var currentPage = _Wrap ? _Wrap : getCsadPage();
        currentPage.find('.csadUserMessageContainer').hide();
        var UserMessageItem = currentPage.find('#csadUserMessageContainer_'+_uid);
        if(UserMessageItem.length == 0){
            currentPage.find(obj).append(tpl);
            UserMessageItem = currentPage.find('#csadUserMessageContainer_'+_uid)
            init();
        }else{
            UserMessageItem.show();
        }

        function init(){
           // if($(UserMessageItem +' .containerQuestion').children().length == 0){
                var titleList = [{
                    title:'用户诊断',
                    className:'questionTab'
                },
                //{
                //    title:'生成盒子',
                //    className:'createBoxTab',
                //    isShow:isShowBox ? '' : 'hide'
                //},
                {
                    title:'用户轨迹',
                    className:'userTrajectoryTab'
                }],
                tamplate = '<li class="userMsgTab {{className}}">{{title}}</li>',
                html=[];
                $.each(titleList,function(i,item){
                    html.push(bainx.tpl(tamplate,item))
                })
                UserMessageItem.find('.csadUserMsgTitle ul').html(html.join(''));

                var classArr = ['containerQuestion','containerUserTrajectory']
                UserMessageItem.find('.csadUserMsgTitle li').each(function(i){
                UserMessageItem.find('.csadUserMsgContent').append('<div class="hide presentList '+classArr[i]+'"></div>');
                    })
                UserMessageItem.find('.csadUserMsgTitle li').eq(0).addClass('activeTab');
                UserMessageItem.find('.presentList').eq(0).removeClass('hide');
               //
               //     csadQuestionnaireSurveyPage(_uid,'',userName,userTel,serviceId);
               //
               //     var tpm=CsadUserTrajectory.csadUserTrajectoryHtml();
               //     $(UserMessageItem+' .containerUserTrajectory').append(tpm);
               //     CsadUserTrajectory.initUserTrajectory(_uid);

            //}
                bindEvent(_uid);
          //  }

        }
        function bindEvent(_uid){
            UserMessageItem.on('click','.userMsgTab',function(){
                var index = $(this).index();
                if(index == 0 && $(this).hasClass('activeTab')){
                    return
                }

                UserMessageItem.find('.userMsgTab').removeClass('activeTab');
                $(this).addClass('activeTab');
                var curPresent = UserMessageItem.find('.presentList').eq(index);

                UserMessageItem.find('.presentList').addClass('hide');
                curPresent.removeClass('hide');

                if(curPresent.hasClass('containerUserTrajectory')){

                    var isTemp = isNaN(_uid) ? true  : false;
                    var tpm = CsadUserTrajectory.csadUserTrajectoryHtml(isTemp);
                    UserMessageItem.find('.containerUserTrajectory').html(tpm);
                    CsadUserTrajectory.initUserTrajectory(_uid.toString(),currentPage);
                    $('.createBoxBtnG ,.questionBtnG').removeClass('show');
                }
                else if(curPresent.children().length == 0){
                    var serviceId =  URL.param.csadId;
                    csadQuestionnaireSurveyPage(_uid,'','','',serviceId);
                }

                if(index == 0){
                    var curTabT = $(this).text(),OT = '',QG=$('.questionBtnG'),BG = $('.createBoxBtnG');
                    switch (curTabT){
                        case '用户诊断':
                            OT = 'containerQuestion';
                            QG.addClass('show');
                            BG.removeClass('show');
                            break;
                        case '产品定制':
                            OT = 'CreateBoxContainer';
                            QG.removeClass('show');
                            BG.addClass('show');
                            break;
                        case '生成订单':
                            OT = 'createOrderContainer';
                            $('.questionBtnG,.createBoxBtnG').removeClass('show');

                            break;

                    }
                    $('.'+OT).removeClass('hide').siblings().addClass('hide');

                }


            })
        }

    }
    return csadUserMessage

})
