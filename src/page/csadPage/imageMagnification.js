/**
 * 放大图片
 * Created by xiuxiu on 2016/8/8.
 */
define('h5/js/page/imageMagnification', [
    'jquery',
    'h5/js/common/url'
],function($,URL){

   // var viewLargeImg = function(target){


        var loadImg = function(target){

            var body = URL.param.boxId || URL.param.userId || URL.param.detectId ? $(window.parent.document) : $('body')

            if(body.find('#large_container').length == 0){
                if(body.find('.container').length == 0){
                    body = $(window.parent.parent.document);
                    body.find('.container').append('<div class="large animated fadeInDown" id="large_container" style="display:none"><div class="bigImgContent"><img id="large_img"><i class="closeBigImg">关闭</i> </div> </div>');
                }else{
                    body.find('.container').append('<div class="large animated fadeInDown" id="large_container" style="display:none"><div class="bigImgContent"><img id="large_img"><i class="closeBigImg">关闭</i> </div> </div>');
                }

            }
            var zWin = $(window),
                wImage = body.find('#large_img');

            body.find('#large_container').css({
               // width:zWin.width(),
                //height:zWin.height(),
            }).show();
            var imgsrc = target.attr('src');
            var ImageObj = new Image();
            ImageObj.src = imgsrc;
            $('.waitting').show();
            ImageObj.onload = function(){
                $('.waitting').hide();
                var w = this.width;
                var h = this.height;
                var winWidth = body.width();
                var winHeight = body.height();
                //var realw = parseInt((winWidth - winHeight*w/h)/2);
                //var realh = parseInt((winHeight - winWidth*h/w)/2);
                if(h/w>1.2){
                   var realh= winHeight > h ? h : winHeight - 60;
                    wImage.attr('src',imgsrc).css('height',realh);
                }else{
                    var realw= winWidth > w ? w : winWidth;
                    wImage.attr('src',imgsrc).css('width',realw);
                }
            }
            var ua = navigator.userAgent.toLowerCase();
            var tap='';
            if (/iphone|ipad|ipod/.test(ua)) {
                tap='tap';
            }else{
                tap='click';
            }
            body.on(tap,'.closeBigImg,#large_img',function(){
                body.find('#large_container').remove();
            })
        }

   // }
    return {loadImg:loadImg};

})
