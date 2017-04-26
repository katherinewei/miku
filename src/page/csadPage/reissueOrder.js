/**
 * 补发订单 // 先请求报告 ----生成报告------生成盒子----选择产品 ---获取订单 --- 生成订单
 * Created by xiuxiu on 2017/1/18.
 */
define('h5/js/page/reissueOrder',[
    'jquery',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/url',
    'h5/js/page/csadCreateMineBoxPage',
    'h5/js/page/csadCreateOrder',
    'h5/css/page/csadCssZy.css'
], function ($, Data, Common, URL,csadCreateMineBoxPage,csadCreateOrder) {

    function init(_uid,userName,tradeId,bid){
        //获取报告
        var data = {
            userId : _uid
        }
        Data.getLastUserDetectDataByUserId(data).done(function(resGetReport){
            var resData = resGetReport.data;
            delete resData.id;
            Data.insertOneDetectQuestionData(resData).done(function(resReport){  //生成报告

                //生成盒子
                var _rid = resReport.data.id,
                    dataBox = {
                    detectReportId:_rid
                }
                Data.createOrUpdateBox(dataBox).done(function(resBox){
                    var obj = $('body');
                    if($('.wrapper').length > 0){
                        obj = $('.wrapper');
                    }

                    obj.append('<div class="reissueOrderWrap"><div class="reissueContent"><iframe src="'+URL.createMineBoxPage+'?userId='+_uid+'&rid='+_rid+'&boxId='+resBox.vo.id+'&userName='+userName+'&tradeId='+tradeId+'&oldBoxId='+bid+'"></iframe></div> </div>');


                })
            })
        })
    }

    return init;

})
