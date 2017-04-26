/**
 * Created by xiuxiu on 2016/10/13.
 */

require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/common/countDown',
    'h5/js/common/weixin',
    'h5/js/common'
], function($,URL, Data, CountDown,WeiXin,Common) {

    var Page,
        qrUuid=URL.param.qrUuid;

    function init() {

        $('.waitting').hide();
        Common.headerHtml('九研美尚');

        var mainPage = '<section class="inviteSP"><div class="banner"><img src="' + URL.imgPath + 'website/pc/images/9labmobile.png"><p class="textF">欢迎您登录多动能皮肤测试系统</p> </div> <div class="makeMoneyWrap"> <div class="inputBox grid"><div class="row"><div class="col"><input type="submit" id="confirmBtn" class="btn submit" value="确认登录"/></div> </div></div> </div></section>';
        Page = $(mainPage).appendTo('body');

        bindEvents();
    }

    function bindEvents(){
        Page
            .on('tap','#confirmBtn',function(){
                var data={
                    qrUuid:qrUuid
                },
                    _this=$('.submit');
                    _this.val('登录中...');
                Data.setScanQrStatus(data).done(function(res) {
                    _this.val('知道了');
                    $('.textF').text('恭喜您，登录成功！');
                    _this.attr('id','iknow');
                    bainx.broadcast('登录成功！');
                })
            })
            .on('tap','#iknow',function(){

            })
    }

    init();

})
