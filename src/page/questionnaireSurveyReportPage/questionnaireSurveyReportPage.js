/**
 * 问卷调查
 * Created by xiuxiu on 2016/4/19.
 */
require([
    'jquery',
    'h5/js/common/url',
    'h5/js/page/csadUserMessage',
    'h5/js/page/csadQuestionnaireSurveyPage',
    'h5/css/page/csadPage.css',
    'h5/css/page/questionnaireSurveyPage.css',
], function($,URL, CsadUserMessage,csadQuestionnaireSurveyPage) {

    var id = URL.param.id,
        name = URL.param.name,
        csadId =  URL.param.csadId,
        mobile = URL.param.mobile,
        istemp = URL.param.isTemp == 'true' ? true : false,//匿名用户
        isNotReg = URL.param.isNotReg == 'true' ? true : false,//未注册用户
        coopCode = URL.param.coopCode,
        forApp = URL.param.forAPP == 'true' ? true : false,//匿名用户
        wrapGroup = $('#fillReportAndBox_Wrap');
    if(isNotReg){
            $('body').append('<div class="csadUserMessageContainer" id="csadUserMessageContainer_'+id+'"><h3 style="margin:10px;font-size: 20px;">诊断分析报告</h3><div class="containerQuestion"></div></div>');
    }else{
        $('body').append('<div class="wwrap"></div>');
        CsadUserMessage('.wwrap', id, $('body'),forApp);
    }
    csadQuestionnaireSurveyPage(forApp,id,'',name,mobile,csadId,istemp,coopCode,isNotReg);


})