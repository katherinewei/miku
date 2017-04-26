/**
 * Created by Spades-k on 2016/10/21.
 */
define('h5/js/page/frameBox', [
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/css/page/createQrCodeLoginPage.css',
], function($,URL, Data) {
    function layout(selector){
        var html='<section id="frameHeader"><div class="logo"><img src="'+imgPath+'common/images/cefu/top_9lab.png"></div><div class="outBtn">退出</div></section>';
        $(selector).append(html);
        bindEvent();
    }

    function bindEvent(){
        $('body')
            .on('click','.outBtn',function(){
                Data.logOut().done(function(res) {
                    bainx.broadcast('退出成功！');
                    setTimeout(function(){
                        URL.assign(URL.createQrCodeLoginPage);
                    },1000)
                })
            })
    }


    return layout;
})