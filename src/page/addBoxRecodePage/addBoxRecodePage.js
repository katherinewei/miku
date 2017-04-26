/**
 * Created by Spades-k on 2016/7/4.
 */

require([
    'jquery',
    'h5/js/common/url',
    'h5/js/page/csadAddBoxRecodePage'
], function ($,URL,csadAddBoxRecodePage) {
    var ouserId=URL.param.oldUserId,
        userId=URL.param.userId;
    function init(){
        csadAddBoxRecodePage.addBoxRecodePageHtml(userId,$('body'),ouserId);
    }
    init();

})
