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
    var type=URL.param.type,page;
    function init() {
        $('.waitting').hide();

        if(!pageConfig.pid || pageConfig.pid.length<=0){
            bainx.broadcast('请扫码登录！');
            setTimeout(function(){
                URL.assign(URL.createQrCodeLoginPage);
            },1000);
            return;
        }

        var html='<section class="skinPicBox"><div class="con"><div class="headTit"><p class="tit">皮肤图像对比</p><p class="stit">SKIN IMAGE CONTRAST</p></div><div class="conBox clearfix"><div class="nowBox clearfix"><div class="smallImg sameSmallImg"><p class="title"><span class="titleSpan">本次测试皮肤图像</span><span class="time">2016-10-10 09:10</span></p><div class="imgs"><ul><li><div class="img"><img src=""><p>额头</p></div><p class="english">Forehead</p></li><li><div class="img"><img src=""><p>脸颊</p></div><p class="english">Cheek</p></li><li><div class="img"><img src=""><p>眼角</p></div><p class="english">Canthus</p></li><li><div class="img"><img src=""><p>色素</p></div><p class="english">Pigment</p></li><li><div class="img"><img src=""><p>炎症</p></div><p class="english">Phlogosis</p></li><li><div class="img"><img src=""><p>毛孔</p></div><p class="english">Pore</p></li></ul></div></div><div class="bigImg"><img src=""></div></div><div class="beforeBox clearfix"><div class="bigImg"><img src=""></div><div class="smallImg sameSmallImg"><p class="title">上次测试皮肤图像<span class="time">2016-10-10 09:10</span></p><div class="imgs"><ul><li><div class="img"><img src=""><p>额头</p></div><p class="english">Forehead</p></li><li><div class="img"><img src=""><p>脸颊</p></div><p class="english">Cheek</p></li><li><div class="img"><img src=""><p>眼角</p></div><p class="english">Canthus</p></li><li><div class="img"><img src=""><p>色素</p></div><p class="english">Pigment</p></li><li><div class="img"><img src=""><p>炎症</p></div><p class="english">Phlogosis</p></li><li><div class="img"><img src=""><p>毛孔</p></div><p class="english">Pore</p></li></ul></div></div></div></div><div class="bottomBtn"><div class="fy clearfix"><p class="back active">Back</p><p class="last active">Last</p></div><p class="home">Home</p></div></div></section>';

        $('body').append(html);
        frameBox('.skinPicBox');

        var obj={
                '额头':'Forehead',
                '脸颊':'Cheek',
                '眼角':'Canthus',
                '色素':'Pigment',
                '炎症':'Phlogosis',
                '毛孔':'Pore'
        };

        var data={
            startRow:0
        }
        Data.getMyMikuSkinCheckData(data).done(function(res) {
            if(res.hasNext){
                $('.last').show();

                var skinImgs=[res.vo.foreheadPic,res.vo.cheekPic,res.vo.canthusPic,res.vo.pigmentPic,res.vo.phlogosisPic,res.vo.porePic];
                var tp=[],
                    i=0;
                $.each(obj, function(key,value) {
                    tp.push('<li><div class="img"><img src="'+skinImgs[i]+'"><p>'+key+'</p></div><p class="english">'+value+'</p></li>');
                    i=i+1;
                })
                $('.nowBox .time').text(bainx.formatDate('Y-m-d h:i', new Date(res.vo.lastUpdated)));
                $('.nowBox .imgs ul').empty();
                $('.nowBox .imgs ul').append(tp.join(''));


                //加载右边
                var data={
                    startRow:1
                }
                Data.getMyMikuSkinCheckData(data).done(function(res) {
                    if(res.hasNext){
                        $('.last').show();

                        page=1;
                        var skinImgs=[res.vo.foreheadPic,res.vo.cheekPic,res.vo.canthusPic,res.vo.pigmentPic,res.vo.phlogosisPic,res.vo.porePic];
                        var tp=[],
                            i=0;
                        $.each(obj, function(key,value) {
                            tp.push('<li><div class="img"><img src="'+skinImgs[i]+'"><p>'+key+'</p></div><p class="english">'+value+'</p></li>');
                            i=i+1;
                        })
                        $('.beforeBox .time').text(bainx.formatDate('Y-m-d h:i', new Date(res.vo.lastUpdated)));
                        $('.beforeBox .imgs ul').empty();
                        $('.beforeBox .imgs ul').append(tp.join(''));
                    }else {
                        $('.last').hide();
                    }
                })

            }else {
                $('.last').hide();
            }

        })

        //测试进入
        if(type==1){

        }

        //首页进入

        if(type==0){
            $('.titleSpan').text('最近测试皮肤图像');
        }

        bindEvent();
    }

    function bindEvent(){
        $('body')
            .on('click','.home',function(){
                URL.assign(URL.skinUserInfoPage);
            })
            .on('click','.nowBox .img img',function(){
                $('.nowBox .bigImg img').attr('src',$(this).attr('src'));
            })
            .on('click','.beforeBox .img img',function(){
                $('.beforeBox .bigImg img').attr('src',$(this).attr('src'));
            })
            .on('click','.last',function(){
                page=page+1;
                upDownPage(1);
            })
            .on('click','.back',function(){
                page==1 ? page=1 : page=page-1;
                upDownPage(0);
            })
    }

    //处理上下翻页
    function upDownPage(i){
        var data={
            startRow:page
        },
            flag= i,
                obj={
                '额头':'Forehead',
                '脸颊':'Cheek',
                '眼角':'Canthus',
                '色素':'Pigment',
                '炎症':'Phlogosis',
                '毛孔':'Pore'
            };
        Data.getMyMikuSkinCheckData(data).done(function(res) {
            if(page==1){
                bainx.broadcast('已经是最新的了！');
            }
            if(res.hasNext){
                if(flag==1){
                    $('.last').show();
                }else if(flag==0){
                    $('.back').show();
                    $('.last').show();
                }

                var skinImgs=[res.vo.foreheadPic,res.vo.cheekPic,res.vo.canthusPic,res.vo.pigmentPic,res.vo.phlogosisPic,res.vo.porePic];
                var tp=[],
                    i=0;
                $.each(obj, function(key,value) {
                    tp.push('<li><div class="img"><img src="'+skinImgs[i]+'"><p>'+key+'</p></div><p class="english">'+value+'</p></li>');
                    i=i+1;
                })
                $('.beforeBox .time').text(bainx.formatDate('Y-m-d h:i', new Date(res.vo.lastUpdated)));
                $('.beforeBox .imgs ul').empty();
                $('.beforeBox .imgs ul').append(tp.join(''));
            }else {
                if(flag==1){
                    $('.last').hide();
                }else if(flag==0){
                    $('.back').show();
                }
            }
        })
    }


    init();
})