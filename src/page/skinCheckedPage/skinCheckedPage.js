/**
 * Created by Spades-k on 2016/10/19.
 */
require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/page/frameBox',
], function($,URL, Data,Common,frameBox) {
    var imgPath='http://ninelab.b0.upaiyun.com/',
        _this;
    function init() {
        $('.waitting').hide();

        if(!pageConfig.pid || pageConfig.pid.length<=0){
            bainx.broadcast('请扫码登录！');
            setTimeout(function(){
                URL.assign(URL.createQrCodeLoginPage);
            },1000);
            return;
        }

        sessionStorage.removeItem('skinImgs');
        var html='<section class="skinChekBox"><canvas class="hide" id="canvas" width="542" height="437"></canvas><div class="con"><div class="headBox"><p class="tit">皮肤表层测试-红色</p><p class="stit">SKIN LAYER TEST-RED</p></div><div class="conBox clearfix"><div class="conVideo"><video id="video" width="542" height="437" autoplay></video></div><div class="showImg"><div class="st1"><ul><li><div class="st1_1"><img data-num="0" src="'+imgPath+'common/images/cefu/pic_1.png"></div></li><li><div class="st1_2"><img data-num="1" src="'+imgPath+'common/images/cefu/pic_2.png"></div></li><li><div class="st1_3"><img data-num="2" src="'+imgPath+'common/images/cefu/pic_3.png"></div></li></ul></div></div></div><div class="bottomBtn"><!--<p id="cImg" data-num="0" class="cImg">拍照</p>--><p class="next" data-i="1">Next</p></div></div></section>';


        $('body').append(html);
        frameBox('.skinChekBox');
        _this=$('.st1_1 img');

        //视频图片处理区域--
        // Put event listeners into place
        window.addEventListener("DOMContentLoaded", function() {
            // Grab elements, create settings, etc.
            var video = document.getElementById("video"),
                videoObj = { "video": true },
                errBack = function(error) {
                    console.log("Video capture error: ", error.code);
                };
            // Put video listeners into place
            if(navigator.getUserMedia) { // Standard
                navigator.getUserMedia(videoObj, function(stream) {
                    video.src = stream;
                    video.play();
                }, errBack);
            } else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
                navigator.webkitGetUserMedia(videoObj, function(stream){
                    video.src = window.webkitURL.createObjectURL(stream);
                    video.play();
                }, errBack);
            }
            else if(navigator.mozGetUserMedia) { // Firefox-prefixed
                navigator.mozGetUserMedia(videoObj, function(stream){
                    video.src = window.URL.createObjectURL(stream);
                    video.play();
                }, errBack);
            }
        }, false);

        // 触发拍照动作
        $('body').on('click','.st1_1 img,.st1_2 img,.st1_3 img',function(){
            _this=$(this);
            _this.parent().css('border','1px solid #CFA972');
            _this.parent().parent().siblings().children().css('border','1px solid white');
            $('.cImg').attr('data-num',_this.attr('data-num'));

            var canvas = document.getElementById("canvas"),
                context = canvas.getContext("2d");
            context.drawImage(video, 0, 0, 542, 437);
            //64base图片
            var src = canvas.toDataURL("image/png").replace(canvas.toDataURL("image/png").substr(0,canvas.toDataURL("image/png").indexOf(",")+1),''),
                len=$('.showImg ul li').length;

            //base62转图片
            var data={
                data:src,
                type:7
            }
            Data.upyunBlobDogetpatImgpath(data).done(function(res) {
                _this.attr({'src':res.picUrl,'data-f':1});
                //处理下一步
                if(len==3){
                    if($('.st1_1 img').attr('data-f')==1 && $('.st1_2 img').attr('data-f')==1 && $('.st1_3 img').attr('data-f')==1){
                        $('.next').addClass('active');
                    }else {
                        $('.next').removeClass('active');
                    }
                }else if(len==2){
                    if($('.st1_1 img').attr('data-f')==1 && $('.st1_2 img').attr('data-f')==1){
                        $('.next').addClass('active');
                    }else {
                        $('.next').removeClass('active');
                    }
                }else if(len==1){
                    if($('.st1_1 img').attr('data-f')==1){
                        $('.next').addClass('active');
                    }else {
                        $('.next').removeClass('active');
                    }
                }
                cacheImgs(parseInt(_this.attr('data-num')));
            })

        })


        //document.getElementById("cImg")
        //    .addEventListener("click", function() {
        //        var canvas = document.getElementById("canvas"),
        //            context = canvas.getContext("2d");
        //            context.drawImage(video, 0, 0, 542, 437);
        //            //64base图片
        //            var src = canvas.toDataURL("image/png"),
        //                len=$('.showImg ul li').length;
        //            $(_this).attr({'src':src,'data-f':1});
        //
        //            cacheImgs(parseInt($(this).attr('data-num')));
        //
        //            //处理下一步
        //            if(len==3){
        //                if($('.st1_1 img').attr('data-f')==1 && $('.st1_2 img').attr('data-f')==1 && $('.st1_3 img').attr('data-f')==1){
        //                    $('.next').addClass('active');
        //                }else {
        //                    $('.next').removeClass('active');
        //                }
        //            }else if(len==2){
        //                if($('.st1_1 img').attr('data-f')==1 && $('.st1_2 img').attr('data-f')==1){
        //                    $('.next').addClass('active');
        //                }else {
        //                    $('.next').removeClass('active');
        //                }
        //            }else if(len==1){
        //                if($('.st1_1 img').attr('data-f')==1){
        //                    $('.next').addClass('active');
        //                }else {
        //                    $('.next').removeClass('active');
        //                }
        //            }
        //    });
    }

    bindEvent();

    function bindEvent(){
        $('body')
            //.on('click','.st1_1 img,.st1_2 img,.st1_3 img',function(){
            //    _this=$(this);
            //    _this.parent().css('border','1px solid #CFA972');
            //    _this.parent().parent().siblings().children().css('border','1px solid white');
            //    $('.cImg').attr('data-num',_this.attr('data-num'));
            //})
            .on('click','.bottomBtn .active',function(){
                var st2='<div class="st2"><ul><li><div class="st1_1"><img data-num="3" src="'+imgPath+'common/images/cefu/pigment.png"></div></li><li><div class="st1_2"><img data-num="4" src="'+imgPath+'common/images/cefu/phlogosis.png"></div></li></ul></div>';

                var st3='<div class="st3"><ul><li><div class="st1_1"><img data-num="5" src="'+imgPath+'common/images/cefu/pore.png"></div></li></ul></div>';

                var i=parseInt($(this).attr('data-i'));
                if(i==1){
                    $(this).attr('data-i',i+1);
                    $('.showImg').empty().append(st2);
                    $('.tit').text('皮肤表层测试-绿色');
                    $('.stit').text('SKIN LAYER TEST-GREEN');
                    $(this).removeClass('active');
                }else if(i==2){
                    $(this).attr('data-i',i+1);
                    $('.showImg').empty().append(st3);
                    $('.tit').text('皮肤表层测试-蓝色');
                    $('.stit').text('SKIN LAYER TEST-BLUE');
                    $(this).removeClass('active');
                }else if(i==3){
                    var foreheadPic,cheekPic,canthusPic,pigmentPic,phlogosisPic,porePic;
                    var skinImgs=JSON.parse(sessionStorage.getItem('skinImgs'));
                    foreheadPic=skinImgs[0];
                    cheekPic=skinImgs[1];
                    canthusPic=skinImgs[2];
                    pigmentPic=skinImgs[3];
                    phlogosisPic=skinImgs[4];
                    porePic=skinImgs[5];

                    //保存测肤图片
                    var data={
                        foreheadPic:foreheadPic,
                        cheekPic:cheekPic,
                        canthusPic:canthusPic,
                        pigmentPic:pigmentPic,
                        phlogosisPic:phlogosisPic,
                        porePic:porePic
                    }
                    Data.createOrUpdateSkinCheckData(data).done(function(res) {
                        URL.assign(URL.skinPicComparePage+'?type=1');
                        $(this).removeClass('active');
                    })

                }

            })
    }


    //缓存64base图片
    function cacheImgs(i){
        var skinImgsArr=[],
            thisImg=_this.attr('src'),
            skinImgsArr=JSON.parse(sessionStorage.getItem('skinImgs'));
            if(skinImgsArr){
                skinImgsArr=skinImgsArr;
            }else {
                skinImgsArr=['','','','','','']
            }
            skinImgsArr[i]=thisImg;
            sessionStorage.setItem('skinImgs',JSON.stringify(skinImgsArr));
    }


    init();
})