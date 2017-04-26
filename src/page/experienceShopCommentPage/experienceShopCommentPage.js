/**
 * 体验店评论页面
 * Created by xiuxiu on 2016/9/29.
 */
require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common',
    'h5/js/common/nexter',
    'h5/js/common/data'
], function($, URL, Common,Nexter, Data) {

    var shopId = URL.param.shopId,
        shopName = URL.param.shopName;

    function init() {
        $('.waitting').hide()
        render();
    }

    function render() {
        Common.headerHtml('评论','<div class="btn-navbar navbar-right" href="' + URL.addExperienceShopCommentPage + '?shopId='+shopId+'&shopName='+shopName+'"><img src="'+imgPath+'common/images/experienceStore/icon_comment.png"/></div>');//头部
        var tpl = '<div class="item-content  grid page-content"><div class="item-comments "><ul class="comments-list" ></ul></div><div class="large animated fadeInDown" id="large_container" style="display:none"><img id="large_img"> </div></div>';
        $(tpl).appendTo('body');
        commentNexter();
    }


    //加载评论列表
    function commentNexter() {
        var element = $('.item-comments');
        var nexter = new Nexter({
            element: element,
            dataSource: Data.getShopCommentPageIndex,
            enableScrollLoad: true,
            data: {
                shopId:shopId
            }
        }).load().on('load:success', function (res) {
            var html = [],
                list = res.commentList;
            if (list && list.length > 0) {
                $.each(list, function (index, item) {
                    if (index == 5) {
                        return false
                    }
                    html.push(commentsHtml(item));

                });
                $('.comments-list').append(html.join(''));
                viewLargeImg();
            }
            else  if (this.get('pageIndex') == 0) {
                $('.comments-list').html('<li class="not-has-comments-msg">暂时没有评论……</li>');

            }
                if (list.length > 5) {
                    $('.allComments').show();
                }
            })
    }

    function commentsHtml(items) {
        var thumbsHtml = [],
            template = '<li class="grid box"><div class="row"><div class="userPic"><img src="{{headPic}}"/> </div><div class="col col-17"><div class="grid"> <div class="row"> <div class="col name">{{userName}}</div><div class="col time fb fvc far">{{dateTime}}</div></div><div class="starWrap"><div class="star" style="width:{{star}}%"></div> </div><p>{{content}}</p><div class="thumb-wrap">{{imgUrl}}</div></div></div></div> </li>';
        items.star = items.starts * 20;
        items.headPic = items.userImg ? items.userImg :  imgPath + '/common/images/avatar-small.png';

        items.dateTime = bainx.formatDate('m', new Date(items.dateCreated))+'月'+bainx.formatDate('d', new Date(items.dateCreated))+'日';

        if(items.imgUrl){
            items.imgUrl = items.imgUrl.split(';');
            var isJpg,
                listimg;
            $.each(items.imgUrl,function(index,item) {
                listimg = item + '!small';
                thumbsHtml.push('<img src="'+listimg+'" alt="" class="thumb"  data-id="'+(index+1)+'"> ');
            });
            items.imgUrl = thumbsHtml.join('');
        }
        return bainx.tpl(template, items);
    }

    //查看大图
    function viewLargeImg(){
        var zWin = $(window),
            cid,
            wImage = $('#large_img'),
            domImage = wImage[0];


        var loadImg = function(id,target,callback){
            $('.thumb-wrap').css({height:zWin.height(),'overflow':'hidden'})
            $('#large_container').css({
                width:zWin.width(),
                height:zWin.height(),
                //top:$(window).scrollTop()
            }).show();
            $('.page-content').css({'z-index':'9','padding':'0'});

            var imgsrc = target.attr('src');

            imgsrc = imgsrc.substring(0, imgsrc.indexOf('!'));

            var ImageObj = new Image();
            ImageObj.src = imgsrc;

            $('.waitting').show();

            ImageObj.onload = function(){
                $('.waitting').hide();
                var w = this.width;
                var h = this.height;
                var winWidth = zWin.width();
                var winHeight = zWin.height();
                var realw = parseInt((winWidth - winHeight*w/h)/2);
                var realh = parseInt((winHeight - winWidth*h/w)/2);

                wImage.css('width','auto').css('height','auto');
                wImage.css('padding-left','0px').css('padding-top','0px');
                if(h/w>1.2){
                    wImage.attr('src',imgsrc).css('height',winHeight).css('padding-left',realw+'px');
                }else{
                    wImage.attr('src',imgsrc).css('width',winWidth).css('padding-top',realh+'px');
                }

                callback&&callback();
            }
        }

        $('.thumb').tap(function(){
            var _id = cid = $(this).attr('data-id');
            loadImg(_id,$(this));
            $('.box').data('current','off');
            $(this).parents('.box').data('current','on');

        });
        var lock = false,
            thumbLen = $('.box[data-current="on"]').find('.thumb').length;
        $('body').on('tap','#large_container',function(){
            $('.thumb-wrap').css({height:'auto','overflow':'auto'})
            $('#large_container').hide();
            $('.page-content').css({'z-index':'0','padding-top':'45px'});
            wImage.attr('src','');
        }).on('swipeLeft','#large_container',function(){
            if(lock && thumbLen == 1){
                return;
            }
            cid++;
            lock =true;

            var tar = $('.box[data-current="on"]').find('.thumb[data-id="'+cid+'"]'),
                lastThumb = $('.box[data-current="on"]').find('.thumb:last-child').data('id');
            if(cid < lastThumb + 1) {
                loadImg(cid, tar, function () {
                    domImage.addEventListener('webkitAnimationEnd', function () {
                        wImage.removeClass('animated bounceInRight');
                        domImage.removeEventListener('webkitAnimationEnd');
                        lock = false;
                    }, false);
                    wImage.addClass('animated bounceInRight');
                });
            }else{
                cid = lastThumb;
            }
        }).on('swipeRight','#large_container',function(){
            if(lock && thumbLen == 1 ){
                return;
            }
            cid--;
            lock =true;

            var tar = $('.box[data-current="on"]').find('.thumb[data-id="'+cid+'"]');
            if(cid>0 ){
                loadImg(cid,tar,function(){
                    domImage.addEventListener('webkitAnimationEnd',function(){
                        wImage.removeClass('animated bounceInLeft');
                        domImage.removeEventListener('webkitAnimationEnd');
                        lock = false;
                    },false);
                    wImage.addClass('animated bounceInLeft');
                });
            }else{
                cid = 1;
            }
        })
    }



    init()
})
