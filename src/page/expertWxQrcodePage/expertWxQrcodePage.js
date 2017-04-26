                                                                    /**
 * 专家二维码
 * Created by xiuxiu on 2016/11/3.
 */
require([
    'jquery',
    'h5/js/common/url'
], function($, URL) {
    function init(){

        var qrUrl = URL.param.wxQrcodeUrl;
        var firstLoad = URL.param.firstLoginIN;
        var tip = firstLoad ? '长按屏幕识别二维码'  : '您已有私人老师为您服务'
        $('.waitting').hide();
        if(qrUrl){
            $('body').append( '<div id="weixinKFDialog"> <section class="grid"><div class="logo"><img src="http://ninelab.b0.upaiyun.com/common/images/9LAB_pic@2x.png" alt="logo"></div> <div class="row"><div class="photo"><img src="http://ninelab.b0.upaiyun.com/common/images/service_photo@2x.png" alt="logo"></div><div class="col fb fvc"><p>'+tip+'<br/>立刻长按二维码进行交流</p></div> </div><div class="qrcode"><img class="icon iconl" src="http://ninelab.b0.upaiyun.com/common/images/icon_erduo@2x.png"/> <img class="icon iconr" src="http://ninelab.b0.upaiyun.com/common/images/icon_erduo@2x.png"/><div class="qrcodeImg"> <img src="'+qrUrl+'" /></div></div></section></div>');
        }
        else{
            bainx.broadcast('暂无私人管家二维码');
        }
    }

    init();

})
