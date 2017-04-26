/**
 * 生成盒子 //补发
 * Created by xiuxiu on 2016/5/21.
 */
require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common',
    'h5/js/common/data',
    'h5/js/common/nexter',
    'h5/js/common/transDialog',
    'h5/js/page/csadQuestionnaireSurveyPage',
    'h5/js/page/csadCreateMineBoxPage',
    'h5/css/page/questionnaireSurveyPage.css',

], function($, URL, Common, Data,Nexter,Dialog,csadQuestionnaireSurveyPage,csadCreateMineBoxPage) {

    var rid = URL.param.rid,//报告id
        //canEdit = URL.param.canEdit,//
        boxId=URL.param.boxId,//盒子id
        //csadName=URL.param.csadName,
        userId = URL.param.userId,
        userName =  URL.param.userName,
        tradeId = URL.param.tradeId,
        oldBoxId = URL.param.oldBoxId;
        //reportTime = URL.param.reportTime,
        //csadTel=URL.param.csadTel;

    $('.waitting').hide();

    function init(){
        $('body').append('<div id="csadUserMessageContainer_'+userId+'" class="createBoxContent csadUserMessageContainer"><div class="csadUserMsgContent"><div class="presentList CreateBoxContainer "></div> </div></div>').attr('data-tradeid',tradeId);

        if(boxId){

            csadCreateMineBoxPage(userId,rid,boxId,'','',true,userName,'',false,false,oldBoxId);
        }else{
            var data = {
                type:1,
                allTrade:0,
                buyerId:manageId(userId),
                pg:0,
                sz:1
            }
            $(window.parent.document).find('#csadUserMessageContainer_'+userId).find('.csadCallInRightContent').parent().show();
            Data.getMineScBoxTradeList(data).done(function(res){

                if(res.list.length > 0){
                    var list = res.list[0];
                    csadCreateMineBoxPage(userId,list.detectReportId,list.id,csadName,csadTel,canEdit,userName,reportTime);
                }else{
                    $(window.parent.document).find('#csadUserMessageContainer_'+userId).find('.csadCallInRightContent').parent().hide();
                   // $('#csadUserMessageContainer_'+userId).find('CreateBoxContainer').html('暂无');
                }

            })
        }

        //$('body').on('click','.sendBox',function(){
        //    var target = $(this);
        //    window.parent.sendBoxIframe(target);
        //
        //})
        $('body')
            .on('click', '.sendBox', function (event) {
                if(URL.param.isIframe == '1'){
                    window.parent.document.getElementById("iframeSendBox").click();
                }
            })
    }

    init()

})