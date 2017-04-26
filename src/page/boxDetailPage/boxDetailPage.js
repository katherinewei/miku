/**
 * 盒子详情页
 * Created by xiuxiu on 2016/9/9.
 */
require([
    'jquery',
    'h5/js/common/data',
    'h5/js/common/url',
    'h5/js/page/boxDetailPageComm',
    'h5/js/common/weixin',
    'h5/js/common',
],function($,Data,URL,BoxDetailCommon,WeiXin,Common){

    var boxId = URL.param.boxId ? URL.param.boxId : '',
        userName = URL.param.userName;
    Common.headerHtml('护肤盒子','<span href="'+URL.buyedBoxListPage+'" class="icon recordBtn"></span>')
    BoxDetailCommon($('body'),boxId,userName);

})
