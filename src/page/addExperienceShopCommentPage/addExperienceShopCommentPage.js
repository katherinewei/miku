/**
 * 添加店铺评论 页。。
 * Created by xiuxiu on 2016/10/10.
 */
require([
    'jquery',
    'h5/js/common',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/common/transDialog'
],function($,  Common,URL, Data,Dialog) {
    //评价
    var dialog,
        shopId = URL.param.shopId,
        shopName = URL.param.shopName;
    $('.waitting').hide();
    function addComment(){

        var iStar = [],
            istap = false;
        for(var i = 0;i < 5; i++){
            iStar.push('<i class="icon-star active"></i>');
        }

        if (!dialog) {
            dialog = new Dialog($.extend({}, Dialog.templates.bottom, {
                template: '<div id="addComment"><section class="header"><div class="content navbar"><div class="btn-navbar navbar-left"><span class="icon icon-return" href="javascript:history.go(-1);"></span></div><div class="navbar-main">'+shopName+'</div></div></section><div class="grid page-content"><div class="comment"> <div class="addComm">总体评价<div class="star-wrap">'+iStar.join('')+'</div><div class="addCommBtn">发表</div> </div><div class="textD"><textarea placeholder="说点什么呢..."></textarea></div><form id="my_form" class="form-horizontal uploadImg" enctype="multipart/form-data"><div class="upload"><input class="file" name="file" type="file" accept="image/*"/><img src="'+imgPath+'common/images/experienceStore/icon_picture_add.png"/></div> <label>+上传图片</label> <div class="imgPreview"></div> </form> </div></div>',
            }))
            istap = true;
        }
        dialog.show();
        bindEvent();
    }


    function bindEvent() {
        $('body').on('click', 'input', function(e) {
            //e.preventDefault();
            if (e && e.preventDefault) {
                window.event.returnValue = true;
            }
        }).on('change', '.file', function(event) {
            //event.preventDefault();
            $('.waitting').show();
            var target = $(this),
                itemThumbCount = $('.imgPreview').find('.thumb').length;

            if(itemThumbCount >= 5){
                $('.waitting').hide();
                bainx.broadcast('最多只能上传5张');
                return;
            } else {
                Common.uploadImages(event, '#my_form', URL.uploadCommentPic).done(function (res) {
                    $('.waitting').hide();
                    $('<div class="tbumb-wrap"><img src="' + res.result.picUrl + '" class="thumb" alt=""><span class="deleteBtn">×</span></div> ').appendTo('.imgPreview');

                }).fail(function () {
                    bainx.broadcast('上传图片失败！');
                });
            }

        }).on('tap', '.deleteBtn', function(){
                var tarP =  $(this).parent(),
                    data = {
                        filePath:tarP.children('img').attr('src')
                    }
                Data.upyunDeleteFile(data).done(function(res) {
                    bainx.broadcast('删除成功！');
                    tarP.remove();
                })
            })

            .on('tap', '.icon-star', function(){
                event.preventDefault();

                var target = $(event.target),
                    starWrap = target.parent();

                starWrap.find('.icon-star').removeClass('active');

                var levelState = target.index();

                for (var i = 0; i <= levelState; ++i) {
                    starWrap.find('.icon-star').eq(i).addClass('active');
                }
            }).on('tap', '.addCommBtn', function(event){

            event.preventDefault();
            var imgUrl = [];
            $('.thumb').each(function(){
                imgUrl.push($(this).attr('src'));
            })
            var data = {
                content:$('textarea').val(),
                shopId:shopId,
                imgUrl:imgUrl.join(';'),
                userId:pageConfig.pid,
                starts:$('.icon-star.active').length
            };
            Data.insertOneMikuShopComment(data).done(function() {
                bainx.broadcast('发表评价成功！');
                location.href = URL.experienceShopDetailPage+'?shopId='+shopId;
            });
            isTap = false;

        }).on('tap', '.icon-return', function (event) {
            event.preventDefault();
            //Common.returnPrePage();
            //location.href = URL.experienceShopDetailPage+'?shopId='+shopId;
        });

    }
    addComment();
})