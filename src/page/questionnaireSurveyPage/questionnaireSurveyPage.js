/**
 * 问卷调查
 * Created by xiuxiu on 2016/4/19.
 */
require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common',
    'h5/js/common/data',
    'h5/js/page/csadQuestionnaireSurveyPage',
    'h5/css/page/createMineBoxPage.css'
], function($, URL, Common, Data,csadQuestionnaireSurveyPage) {

    var _uid = URL.param.uid ? URL.param.uid : '',
        _rid = URL.param.detectId ? URL.param.detectId : '',
        userName =  URL.param.userName ? URL.param.userName : '',
        userTel =  URL.param.userTel,
        forAPP =  URL.param.forAPP == 'true' ? true : false,
        serviceId =  URL.param.serviceId;
    $('.waitting').hide();

    $('body').append('<div id="csadUserMessageContainer_'+_uid+'"> <div class="containerQuestion"></div></div>');
    csadQuestionnaireSurveyPage(forAPP,_uid,_rid,userName,'',serviceId);

})
