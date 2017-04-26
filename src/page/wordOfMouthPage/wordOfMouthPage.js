/**
 * 全部口碑
 * Created by xiuxiu on 2016/1/21.
 */
require([
    'jquery',
    'slider',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/common/goods',
    'h5/js/common/cart',
    'h5/js/common',
    'h5/js/common/transDialog',
    'h5/js/common/loadImage',
    'h5/js/common/lazyload',
    'h5/js/common/weixin',
    'h5/js/common/nexter'
], function ($, Slider, URL, Data, Goods, Cart, Common, Dialog, LoadImage, Lazyload, WeiXin, Nexter) {

    var id = URL.param.buildingId;
    function init() {

        Common.to_Top('#content');
        render();

    }
    function render(){
        Common.headerHtml('全部口碑');
        var tpl = '<div class="item-content  grid page-content"><div class="item-comments "><ul class="comments-list" ></ul></div><div class="large animated fadeInDown" id="large_container" style="display:none"><img id="large_img"> </div></div>';
        $(tpl).appendTo('body');

        // $('.comments-list').height($(window).height() - $('.commentsTotal').height() - 45);

        commentTotal();
    }
    //加载评论统计
    function commentTotal() {
        var data = {
            buildingId: id,
        }
        Data.getCommentsCount(data).done(function (res) {

            var html=[],
                counts = res.vo;
            if (counts) {
                html.push(commentsTotalHtml(counts));
                $('.item-comments').prepend(html.join(''));
                //var commScore = ((counts.starCount * 1 +counts.star2Count * 2 + counts.star3Count * 3 + counts.star4Count * 4 +counts.star5Count * 5  ) / counts.count).toFixed(1);
                //$('.commentsTotal h3').text(commScore);
            } else {
                $('.item-comments').html('<div class="not-has-comments-msg">暂时没有评论……</div>');
            }

        });


        commentNexter(id);

    }

    function commentsTotalHtml(item) {
        var template = '<div class="commentsTotal row "><div class="col col-5"><h3>{{score}}</h3></div><div class="col col-13"><p>好评率{{highOpinion}}%</p><p>{{mouthCount}}口碑，{{count}}短评</p></div><div class="col col-8"><div class="starWrap"><div class="star" style="width: {{star}}%;"></div> </div> </div>';
        item.score = ((item.starCount * 1 +item.star2Count * 2 + item.star3Count * 3 + item.star4Count * 4 +item.star5Count * 5  ) / item.count).toFixed(1);
        if(item.mouthCount){
            item.mouthCount = item.mouthCount;
        }else{
            item.mouthCount = 0;
        }

        var starNumT= item.score * 10;
        item.star = starNumT.toString();
        var starNumGe = starNumT - ((Math.floor(starNumT/10))*10),//个位
            starNumShi = (starNumT - ((Math.floor(starNumT/100))*100) - starNumGe)/10;//十位数
        item.star = starNumShi+'='+starNumGe;
        if(starNumGe < 10 && starNumGe != 0 ){
            var star_geReplace = 5;
            item.star = item.star.replace(item.star.substring(item.star.indexOf(starNumShi)+1,item.star.length),star_geReplace);


        }else{
            item.star = starNumShi.toString()+starNumGe.toString();
        }
        item.star = item.star * 2;

        return bainx.tpl(template, item);
    }


    //加载评论列表
    function commentNexter(buildingId, buildingType) {
        var element = $('.item-comments');
        var nexter = new Nexter({
            element: element,
            dataSource: Data.commentsList,
            enableScrollLoad: true,
            data: {
                buildingId: buildingId,
                buildingType: buildingType,
            }
            //pageSize:16
        }).load().on('load:success', function (res) {

            var html=[];

            if (res.list) {
                $.each(res.list, function (index, item) {
                    html.push(commentsHtml(item));
                });
                $('.comments-list').append(html.join(''));
                viewLargeImg();
            } else if (this.get('pageIndex') == 0) {
                $('.comments-list').html('<li class="not-has-comments-msg">暂时没有评论……</li>');
                $('.allComments').hide();
            }
        });
    }

    function commentsHtml(items) {
        var thumbsHtml = [],
            template = '<li class="grid box"><div class="row"> <div class="col name">{{userName}}</div><div class="col time fb fvc far">{{dateTime}}</div></div><div class="starWrap"><div class="star" style="width:{{star}}%"></div> </div><p>{{content}}</p><div class="thumb-wrap">{{picUrls}}</div></li>';
        items.star = items.star * 20;
        items.dateTime = bainx.formatDate('Y-m-d h:i', new Date(items.dateCreated));


        if(items.picUrls){
            items.picUrls = items.picUrls.split(';');
            var isJpg,
                listimg;
            $.each(items.picUrls,function(index,item) {
                 //isJpg = /\.(?:jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/.test(item);
                 //listimg = item + (isJpg ? '!small' : '');
                listimg = item + '!small';
                thumbsHtml.push('<img src="'+listimg+'" alt="" class="thumb"  data-id="'+(index+1)+'"> ');
            });
            items.picUrls = thumbsHtml.join('');
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
        $('.item-content').on('tap','#large_container',function(){
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


    init();

});