/**
 * 用户报告
 * Created by xiuxiu on 2016/5/11.
 */
require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/page/getDetectRecord',
    'h5/js/common/weixin',
    'h5/js/common',
], function($, URL, Data,getDetectRecord,WeiXin,Common) {

    function init(){

        //var data = {
        //    userId : URL.param.uid
        //}
        Data.getLastUserDetectDataByUserId().done(function(res){
            var resDate = res.data,
                sex = resDate ? resDate.sex == 2 ? '女' : '男' : '',
                name = resDate ? resDate.name : '',
                expertDiagnose = resDate ? resDate.expertDiagnose : '';
            $('body').append(getDetectRecord(resDate));


        })
        weiXinShare();
    }

    function weiXinShare(){
        if(Common.inWeixin){

            //console.log(document.title);
            var shareUrl = location.href;
            var shareImgUrl = imgPath + 'common/images/share_report.png',
                desc = '我们已根据你的实际情况为你生成专属的分析报告，你可以通过该分析报告了解到自身肌肤的问题及形成原因',
                shareOption = {
                    title: '9LAB-分析报告', // 分享标题
                    desc: desc, // 分享描述
                    link: shareUrl,
                    type: 'link',
                    dataUrl: '',
                    imgUrl: shareImgUrl
                },
                shareOptionTimeline = {
                    title: desc,
                    link: shareUrl,
                    imgUrl: shareImgUrl
                };
            //WeiXin.hideMenuItems();
            //WeiXin.showMenuItems();
            WeiXin.share(shareOption, shareOptionTimeline);
        }
    }

    init();
})
