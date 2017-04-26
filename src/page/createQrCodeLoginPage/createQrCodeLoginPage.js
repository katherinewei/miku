/**
 * Created by Spades-k on 2016/10/18.
 */
require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/common'
], function($,URL, Data,Common) {
    function init() {
        $('.waitting').hide();
        var url=URL.site+URL.scanQrLoginPage+'?qrUuid='+pageConfig.qrUuid,
            html='<section class="codeBox"><div class="con"><div class="code"><img src="'+URL.qrUrl+url+'" alt="二维码"></div><div class="logo"><i></i></div><p class="codeText">请扫码登录</p></div></section>';
console.log(url)
        $('body').append(html);

        //二维码Uuid登录
        var data={
            qrUuid:pageConfig.qrUuid
        }
        setInterval(function(){
            Data.loginScanQr(data).done(function(res) {
                console.log(res.isQrLogin)
                switch(res.isQrLogin)
                {
                    case 1:
                        URL.assign(URL.skinUserInfoPage);
                        break;
                    case 2:
                        bainx.broadcast('二维码已失效，将刷新页！');
                        window.location.reload();
                        break;
                    default:

                }
            })
        },500)
    }


    init();
})