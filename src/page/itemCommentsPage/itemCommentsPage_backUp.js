/**
 * Created by Spades-k on 2016/1/25.
 */


require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/weixin'
], function($, URL, Data, Common, WeiXin) {

    var Page,
        tradeId = URL.param.tradeId,
        isTap = true,   //判断是否点击过
        goodsItems;

    function init() {

        getOrderDetail();

    }


    function render(items) {

        goodsItems = items.trade.orderViewDOs;

        var htmlItems = '<div class="item-comment"><div class="goods-info"><div class="goods-cover"><img src="{{pics}}" alt="" class="cover"></div><div class="goods-intro"><div class="title">{{title}}</div><div class="price">{{price}}</div></div></div><div class="goods-photo"><div class="icon-wrap"><label class="icon-photo" for="file"></label><form id="my_form_{{itemId}}" action="' + URL.uploadCommentPic + '" class="form-horizontal" enctype="multipart/form-data"><input class="file" name="file" type="file" accept="image/*"/></form></div><div class="photo-label">晒晒自己的宝贝</div></div><div class="goods-preview"></div><div class="goods-comment"><textarea name="" id="comment-textarea" class="comment-textarea" cols="30" rows="10" placeholder="你的评价很值钱哟！"></textarea></div><div class="goods-score"><span class="label">商品评分</span><span class="star-wrap"><i class="icon-star active"></i><i class="icon-star active"></i><i class="icon-star active"></i><i class="icon-star active"></i><i class="icon-star active"></i></span></div></div>',
            template = '<section id="product-comment"><section class="header"><div class="content navbar"><div class="btn-navbar navbar-left"><a href="javascript:;" class="icon icon-return"></a></div><div class="navbar-main">商品评价</div></div></section><section class="page-content">' + htmlLinks(goodsItems, htmlItems) + '</section><section class="footer"><button class="btn-comment">发表评价</button></section></section>';

        html = bainx.tpl(template, items.trade);

        Page = $(template).appendTo('body');

        bindEvent();
    }


    function htmlLinks(links,template){
        var html = [];
        $.each(links, function(index, item){
            if(item.price) {
                item.price = Common.moneyString(item.price);
            }
            html.push(bainx.tpl(template, item));
        });
        return html.join('');
    }



    function getOrderDetail() {
        Data.getOrderDetail(tradeId).done(function(res) {
            render(res);
        });
    }




    function bindEvent() {



        $('body').on('click', 'input', function(e) {
            //e.preventDefault();
            if (e && e.preventDefault) {
                //window.event.returnValue = true;
            }
        }).on('tap', '.file', function(event) {
            event.preventDefault();
            if (Common.inWeixin) {
                WeiXin.chooseImage().done(function (res) {
                    var localIds = res.localIds;
                    alert(localIds);
                    $('.waitting').show();
                    var target = $(this),
                        parents = target.parents('.item-comment'),
                        formId = '#'+target.parent().attr('id'),
                        index = parents.index(),
                        itemComment = $('.item-comment').eq(index),
                        itemThumbCount = parents.find('.thumb').length;

                    if(itemThumbCount >= 10){
                        $('.waitting').hide();
                        bainx.broadcast('最多只能上传10张');
                        return;
                    } else {
                            var data =  localIds;
                        Data.uploadCommentPics(data).done(function() {
                            $('.waitting').hide();
                            $('<img src="' + res.result.picUrl + '" class="thumb" alt="">').appendTo(itemComment.find('.goods-preview'));
                        })

                        //Common.uploadImages(event, formId, URL.uploadCommentPic).done(function (res) {
                        //    $('.waitting').hide();
                        //    $('<img src="' + res.result.picUrl + '" class="thumb" alt="">').appendTo(itemComment.find('.goods-preview'));
                        //
                        //}).fail(function () {
                        //    bainx.broadcast('上传图片失败！');
                        //});
                    }


                });
            } else {
                alert('请在微信中打开');
            }

        }).on('tap', '.icon-star', function(){
            event.preventDefault();

            var target = $(event.target),
                starWrap = target.parent();

            starWrap.find('.icon-star').removeClass('active');

            var levelState = target.index();

            for (var i = 0; i <= levelState; ++i) {
                starWrap.find('.icon-star').eq(i).addClass('active');
            }
        }).on('tap', '.btn-comment', function(event){

            if(isTap){
                event.preventDefault();

                var commentsJson = [];

                $.each(goodsItems, function(index,item) {

                    var itemComment = $('.item-comment').eq(index),
                        star = itemComment.find('.icon-star.active').length,
                        content = itemComment.find('.comment-textarea').val() ? itemComment.find('.comment-textarea').val() : '',
                        picUrls = [];

                    var thumbs = itemComment.find('.goods-preview img'),
                        thumbsCount = thumbs.length;

                    for (var i = 0; i < thumbsCount; ++i) {
                        picUrls.push(thumbs.eq(i).attr('src'));
                    }

                    picUrls = picUrls.join(';');

                    json = {
                        "buildingId": item.itemId,
                        "star": star,
                        "content": content,
                        "picUrls": picUrls
                    };

                    commentsJson.push(json);

                });

                commentsJson = JSON.stringify(commentsJson);


                var data = {
                    buildingType: '1',
                    tradeId : tradeId,
                    commentsJson: commentsJson
                };

                console.log(data);

                Data.addComments(data).done(function() {

                    bainx.broadcast('发表评价成功！');
                    //Common.returnPrePage();
                    location.href = URL.orderList + '?state=2';

                });
            }
            isTap = false;

        }).on('tap', '.icon-return', function (event) {
            event.preventDefault();
            //Common.returnPrePage();
            location.href = URL.orderList + '?state=2';
        });

    }


    init();

});