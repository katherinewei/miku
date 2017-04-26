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


    var Item,
        id = URL.param.gid,
        activtyNowTime,
        shareImgUrl,
        //baseSoldQuantity,
        //soldCnt,
        //multiple,
        //itemNum,
        start_time,
        end_time,
        isCanTap = false,
        Page,
        pUserId = URL.param.pUserId,
        itemTypes,              //是否礼包 9为礼包
        isTaxFree;
    var cid;

    function init() {
        fetchItemInfo().done(function (goods) {

            Item = goods;
            render(goods);

            Common.to_Top('#content');
        });

        if (URL.param.a == 1) {
            if (pageConfig.pid) {
                URL.assign(URL.site + URL.goodsDetail + '?gid=' + id + '&pUserId=' + pageConfig.pid);
            } else {
                $('body').append('<div id="noLogin"><div class="content"><p>您尚未登录，该链接无效。</p></div></div>');
                $('#noLogin').on('tap', function () {
                    $('#noLogin').remove();
                })
            }
        }

    }

    function fetchItemInfo() {
        var pomi = $.Deferred();
        if (id) {
            Data.fetchItemsInfo(id).done(function (res) {
                console.log(res);
                activtyNowTime = res.nowDate;
                itemTypes = res.items[0].type;
                isTaxFree = res.items[0].isTaxFree;
                //baseSoldQuantity = res.items[0].baseSoldQuantity;
                //soldCnt= res.items[0].soldCnt;
                //multiple= res.items[0].multiple;
                //itemNum= res.items[0].itemNum;
                if (res.items && res.items.length) {
                    var goods;
                    $.each(res.items, function (index, item) {
                        if (item.itemId == id) {
                            goods = Goods.create(item);
                            return false;
                        }
                    });
                    goods ? pomi.resolve(goods) : pomi.reject();
                } else {
                    pomi.reject();
                }
            });
        } else {
            pomi.reject();
        }
        return pomi.promise();
    }


    function render(goods) {
        Common.headerHtml('商品详情','<div class="category-handle cart-bar" href="' + URL.cart + '"></div>');

        $('.navbar').attr('id','listPage');
        if(URL.param.pUserId){
            $('.cart-bar').attr('href',URL.cart + '?pUserId=' + pUserId + '&isShare=1');

        }
        if(URL.param.firstT){
            $('#listPage .navbar-left .icon-return').attr('href',URL.index+'?pUserId='+pageConfig.pid+'&isShare=1');
        }
        var template = '<div class="page-content" id="content"><div id="item-info"><div class="banner" id="banner"><div class="slider-outer"><ul class="carousel-wrap"></ul></div><div class="carousel-status"><ul></ul></div></div><div class="info-wrap grid"><div class="row "><div class=" col-50" id="price"><div class="priceGroup"> <span class="current-price price"><span class="figure figurePrice">{{_htmlPrice}}</span></span><del class="original-price price"><span class="figure">{{_htmlRelPrice}}</span></del><span class="discount {{discountClass}}">{{discount}}折</span><h1>{{title}} <!--{{specification}}--></h1><div class="soldnum"><div class="threshold" style="width:{{threshold}}%"></div><p >已售<b class="saleTotal">{{saleTotal}}</b>件</p></div></div></div> <div class="col-15 brokeFee {{brokerageFeehide}}"><span class="price">{{brokerageFee}}</span><span>推广费</span></div></div><div class="showTime {{showTime}}"></div></div><div class="list_item grid"><ul class="row qualityAssurance" href="' + URL.qualityAssuranceHtm + '"><li class="col "><img src="' + imgPath + 'common/images/icon_detail1.png" /><span>正品保证</span> </li><li class="col {{refundhide}}"><img src="' + imgPath + 'common/images/icon_detail2.png" /><span>7天退换</span> </li><li class="col"><img src="' + imgPath + 'common/images/icon_detail3.png" /><span>极速发货</span> </li></ul></div><div class="list_item aside"><dl class="grid"><dd class="row {{isTopichide}}" href="{{topicUrl}}"><div class="col col-6 topicCut">满减</div><div class="col col-12">{{topicParameterWord}}</div><div  class="col col-5 topicUrl fb far fvc ">马上拼单<i class="right-icon iconfont"></i></div> </dd><dd class="row {{isTaxFreehide}}"><div class="col col-6 taxFree">保税</div><div class="col col-12">全球保税</div><div class="col col-5 "></div> </dd><dd class="row {{isTaxFreehide}}"><div class="col col-6"></div><div class="col col-18 taxFreeTip"><p>正常工作日3-5天内可收到货品</p><p>如遇周末或节假日，收货期约5-7天</p><p>亲，难道你不知道海关的哥哥姐姐们节假日也不上班的吗？</p></div> </dd><dd class="row"><div class="col col-6 postFee">包邮</div><div class="col col-12">本商品{{isNeedPostFee}}包邮</div><div class="col col-5 "></div></dd><dd class="row {{brokerageFeehide}}"><div class="col col-6 brokerageC">返利</div><div class="col col-16">下单后立刻获得返利，每件<span class="price">{{brokerageFee}}</span></div> <div class="col col-1 "></div></dd><dd class="row" ><div class="col col-6 refund">退货</div><div class="col col-12">本商品{{isrefund}}支持退货</div> <div class="col col-5 "></div></dd></dl></div> <div class="list_item"><p>{{desc}}</p></div></div><div class="main-wrap"><div class="grid tabs-bar"><ul class="row tabs-list"><li class="col  tabs-item active">图文详情<i class="icon-line"></i></li><li class="col  tabs-item ">商品参数<i class="icon-line"></i></li><li class="col  tabs-item ">口碑</li></ul></div><div class="tabs-content "><div id="item-desc" class="item-content visible"></div><div class="item-content item-param"><ul class="list features"></ul></div><div class="item-content item-comments   grid"> </div></div></div></div><div class="large animated fadeInDown" id="large_container" style="display:none"><img id="large_img"> </div>',
            html = [];

        goods.topicUrl = URL.activeTopicPage + '&topicId='+goods.topicId;

        Page = $(bainx.tpl(template, goods)).appendTo('body');




        //时间倒计时
        var leftsecond,
            now_time = activtyNowTime,
            states;
            start_time = goods.activtyStartTime;
            end_time = goods.activtyEndTime;
        //console.log(start_time,end_time);
        if(start_time > now_time){
            states = 1;

        }else if(start_time < now_time && end_time > now_time){
            states = 2;
            isCanTap = true;
        }else  if(end_time < now_time){
            states = 3;
            isCanTap = false;
        }


        renderFooter(goods);

        ShowTime('.showTime','距离开始：','距离结束：','已结束');

        function ShowTime(container,textDecs1,textDecs2,textDecs3) {



            var leftTime;


            if (states == 1) {  //未开始
                leftTime = start_time - now_time;
                $('#cart-btn,#buy-btn').addClass('sold-out-state');

            } else if (states == 2) {    //进行中
                leftTime = end_time - now_time;


            }
            else  if(states == 3){
                $(container).html(textDecs3);
                $('#cart-btn,#buy-btn').addClass('sold-out-state');
                if (!(goods.approveStatus == 1 && goods.activtyItemNum > 0)) {
                    $('#buy-btn').addClass('sold-out-state2').text('商品已售光');
                }
                return;
            }
            leftsecond = parseInt(leftTime / 1000);

            countDown(container,textDecs1,textDecs2);
            var times = setInterval(function () {
                countDown(container,textDecs1,textDecs2);
                if (leftsecond < 1 && states == 1) {
                    leftTime = end_time - start_time;
                    leftsecond = parseInt(leftTime / 1000);
                    states = 2;
                    start_time++;

                } else if (leftsecond < 1 && states == 2) {
                    states = 3;
                }
                if (states == 3 && leftsecond < 0) {
                    clearInterval(times);
                    $(container).html(textDecs3);
                    //$('.threshold').css('width',threshold+'%');
                    //$('.saleTotal').text(saleTotal);
                   // console.log(saleTotal);
                    isCanTap = false;
                    $('#cart-btn,#buy-btn').addClass('sold-out-state');
                }
            }, 1000);
        }


        //倒计时
        function countDown(container,textDecs1,textDecs2) {
            leftsecond--;
            now_time++;
            var day = Math.floor(leftsecond / (60 * 60 * 24)),
                hour = Math.floor((leftsecond - day * 24 * 60 * 60) / 3600),
                minute = Math.floor((leftsecond - day * 24 * 60 * 60 - hour * 3600) / 60),
                second = Math.floor(leftsecond - day * 24 * 60 * 60 - hour * 3600 - minute * 60);


            if (states == 1) {
                $(container).html(textDecs1 + day + '天' + p(hour) + '时' + p(minute) + '分' + p(second)+'秒');
                //$('.threshold').css('width',threshold+'%');
                //$('.saleTotal').text(saleTotal);


            }
            else if (states == 2) {
                $(container).html(textDecs2 + day + '天' + p(hour) + '时' + p(minute) + '分' + p(second)+'秒');
                //$('.threshold').css('width',thresholdA+'%');
                //$('.saleTotal').text(saleTotalA);
                $('#cart-btn,#buy-btn').removeClass('sold-out-state');
                //console.log(!(goods.approveStatus == 1 && goods.activtyItemNum > 0));

                isCanTap = true;

                if (!(goods.approveStatus == 1 && goods.activtyItemNum > 0)) {
                    isCanTap = false;
                    $('#cart-btn,#buy-btn').addClass('sold-out-state');
                    $('#buy-btn').addClass('sold-out-state2').text('商品已售光');
                }
            }
            function p(s) {
                return s < 10 ? '0' + s : s;
            }
        }
        if (goods.pics && goods.pics.length) {
            html = [];
            $.each(goods.pics, function (index, pic) {
                html.push('<li class="pic"><div class="pic-wrap"><img src="' + pic + '"></div></li>');
            });
            $('.carousel-wrap', Page).html(html.join(''));
            var ww = $(window).width();
            $('#banner .slider-outer, #banner .slider-outer li').width(ww);
            shareImgUrl = $('.carousel-wrap li').eq(0).find('img').attr('src'),
            Slider({
                slideCell:"#banner",
                titCell:".carousel-status ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
                mainCell:".slider-outer ul",
                effect:"left",
                autoPlay:true,//自动播放
                autoPage:true, //自动分页
                //switchLoad:"_src" //切换加载，真实图片路径为"_src"
            });

            //var slide = new Slider($('#pic-carousel'), {
            //    loop: 1,
            //    curIndex: 0,
            //    useTransform: 1,
            //    lazy: '.lazyimg',
            //    play: true, //动画自动播放
            //    interval: 3000,
            //    trigger: '.carousel-status',
            //    activeTriggerCls: 'sel',
            //    hasTrigger: 'tap',
            //});
        }

        if (goods.features) {
            html = [];
            var index = -1;
            $.each(goods.features, function (key, value) {
                index++;
                if(goods.brandName && index == 0) {
                    html.push('<li><label>品牌:</label><span>' + goods.brandName + '</span></li>');
                }
                if(goods.specification && index == 1) {
                    html.push('<li><label>规格:</label><span>' + goods.specification + '</span></li>');
                }
                if (key != '禁忌') {
                    html.push('<li><label>' + key + ':</label><span>' + value + '</span></li>');
                    //html.push('<li class="attr"><span class="attr-title">' + key + '：</span><div class="attr-content">' + value + '</div></li>');
                }
            });
            $('.features', Page).html(html.join(''));
        }

        if (goods.detail && goods.detail.length) {
            html = [];
            var data = goods.detail.concat([
                //详情页下面加引导说明 lin
                /* 'http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20150608/vNTT-0-1433754854062.jpg'
                 'http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20150202/vNTT-0-1422886245014.jpg',
                 'http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20150202/vNTT-0-1422886246875.jpg',
                 'http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20150202/vNTT-0-1422886245520.jpg',
                 'http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20150202/vNTT-0-1422886247170.jpg'*/
            ])
            $.each(data, function (index, detail) {
                html.push('<div class="pic"><img data-lazyload-src="' + detail + '"></div>');
            });

            $('#item-desc', Page).html(html.join(''));
        }

        bindEvent();
        Lazyload('#item-desc img', {attr: 'data-lazyload-src', container: '#content'});
        //LoadImage(Page);

        //renderCart(goods);
        refreshCart();
        weiXinShare();






    }

    //加载评论统计
    function commentTotal() {
        var commentsList = $('.comments-list').html();
        if (!commentsList) {
            var data = {
                buildingId: id,
            }
            Data.getCommentsCount(data).done(function (res) {
                console.log(res);
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

            })
        }
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
        if(starNumGe < 10 && starNumGe != 0 ){
            item.star = starNumShi+'='+starNumGe;
            var star_geReplace = 5;
            item.star = item.star.replace(item.star.substring(item.star.indexOf(starNumShi)+1,item.star.length),star_geReplace);

        }
        console.log(item.star);
        item.star = item.star * 2;
        return bainx.tpl(template, item);
    }


    //加载评论列表
    function commentNexter(buildingId, buildingType) {
        var element = $('.item-comments');
        $('<ul class="comments-list"></ul><div class="allComments"><span class="btnAll" href="' + URL.wordOfMouthPage + '?buildingId=' + id + '">查看全部口碑</span> </div>').appendTo('.item-comments');
        var nexter = new Nexter({
            element: element,
            dataSource: Data.commentsList,
            enableScrollLoad: true,
            data: {
                buildingId: buildingId,
                buildingType: buildingType,
            },
            pageSize:5
        }).load().on('load:success', function (res) {
            console.log(res);
            var html=[];

            if (res.list.length) {
                $.each(res.list, function (index, item) {
                    html.push(commentsHtml(item));
                });
                $('.comments-list').append(html.join(''));
                viewLargeImg(false);
            } else if (this.get('pageIndex') == 0) {
                $('.comments-list').html('<li class="not-has-comments-msg">暂时没有评论……</li>');
                $('.allComments').hide();
            }
        });
    }

    //查看大图
    function viewLargeImg(trap){
        var zWin = $(window),
             wImage = $('#large_img'),
             domImage = wImage[0],
             loadImg = function(id,target,callback){
                    $('.thumb-wrap').css({height:zWin.height(),'overflow':'hidden'})
                    $('#large_container').css({
                        width:zWin.width(),
                        height:zWin.height(),
                        //top:$(window).scrollTop()
                    }).show();
                    $('.page-content').css('z-index','9');
                    $('.waitting').show();
                    var imgsrc = target.attr('src');
                    imgsrc = imgsrc.substring(0, imgsrc.indexOf('!')) + '!q75';
                    var ImageObj = new Image();
                    ImageObj.src = imgsrc;
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
                $('.page-content').css('z-index','0');
                wImage.attr('src','');
            }).on('swipeLeft','#large_container',function(){

                if(lock && thumbLen == 1){
                    return;
                }
                cid ++;
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

    function renderFooter(goods) {
        var template = '<div id="toolbar" class="grid"><div class="row fvc"><span class=" button" id="share-btn">分享</span><span class="button btn" id="cart-btn" href tj_category="商品" tj_action="'+id+'" tj_label="加入购物车">加入购物车</span><span class="button btn" id="buy-btn" href tj_category="商品" tj_action="'+id+'" tj_label="立即购买">立即购买</span></div></div>';
        $(template).appendTo('body');

        if(goods.flag.immediatelyBuy || goods.showTime == '' ){
            $('#cart-btn').hide();
            $('#buy-btn').addClass('onlyBuyBtn');
        }
        if (goods.approveStatus == 1 && goods.itemNum > 0) {
            canTap(goods);
        }else{
            $('#cart-btn,#buy-btn').addClass('sold-out-state');
            $('#buy-btn').addClass('sold-out-state2').text('商品已售光');

        }
        console.log(goods.type)
        if(goods.type == 11){
            $('#buy-btn').hide();
            $('#cart-btn').addClass('onlyBuyBtn');
        }
        //既是满减产品又是抢购产品或打了只能购买标。
        if(goods.type == 11 && (goods.flag.immediatelyBuy || goods.showTime == '')){
            $('#cart-btn').hide();
            $('#buy-btn').addClass('onlyBuyBtn').show();
        }
    }


    function canTap(goods){
        $('body').on('tap', '#cart-btn', function (event) {
            if(goods.showTime == '' ) {      //是抢购   开始
                if (isCanTap && (goods.approveStatus == 1 && goods.activtyItemNum > 0)) {
                    event.preventDefault();
                    showBuyDialog(goods, 1);
                    $('.topIcon').removeClass('is-visible');
                }
            }
            else {
                if (goods.approveStatus == 1 && goods.itemNum > 0) {
                    event.preventDefault();
                    showBuyDialog(goods, 1);
                    $('.topIcon').removeClass('is-visible');
                }
            }

        }).on('tap', '#buy-btn', function (event) {
            if(goods.showTime == '' ) {      //是抢购   开始
                console.log(goods.showTime,isCanTap);
                if (isCanTap && (goods.approveStatus == 1 && goods.itemNum > 0)) {
                    event.preventDefault();
                    showBuyDialog(goods, 2);
                    $('.topIcon').removeClass('is-visible');
                }
            }
            else {
                if (goods.approveStatus == 1 && goods.itemNum > 0) {
                    event.preventDefault();
                    showBuyDialog(goods, 2);
                    $('.topIcon').removeClass('is-visible');
                }
            }


        }).on('tap', '#share-btn', function (event) {
            event.preventDefault();
            Common.shareTips('.page-content', 0, 0);
        });
    }


    function bindEvent() {
        //$('body').on('scroll', scrollEventLoadImage);
       // viewLargeImg(true);
        Page.on('tap', '.tabs-item', function (event) {
            console.log(event);
            //switchNav($(this).index());
            $(this).addClass('active').siblings().removeClass('active');
            $('.item-content').eq($(this).index()).addClass('visible').siblings().removeClass('visible');

            console.log($('.item-comments').hasClass('visible') && $('.item-comments').find('.comments-list').length == 0);
            if ($('.item-comments').hasClass('visible') && $('.item-comments').find('.comments-list').length == 0) {
                commentTotal();
                commentNexter(id);

            }
        }).on('tap', '.icon-return', function (event) {
            event.preventDefault();
            (URL.param.isShare) ? URL.assign(URL.index +'?pUserId='+pUserId) : history.go(-1);

        }).on('tap', '[href]', function (event) {
            event.preventDefault();
            Common.addPUserId($(this));
        });
    }

    function scrollEventLoadImage(event) {
        clearTimeout(Page._scroll_event_sid);
        Page._scroll_event_sid = setTimeout(function () {
            LoadImage(Page);
        }, 200);
    }

    function showBuyDialog(goods, type) {
        new Dialog($.extend({}, Dialog.templates.bottom, {
            onHideDestroy: true,
            id: 'order-popup',
            template: '<section class="wl-trans-dialog wl-top-dialog"><section class="header"><div class="content navbar"><div class="btn-navbar navbar-right close"></div><div class="navbar-main">立即购买</div></div></section><div class="dialog-mask"></div><div class="dialog-body page-content"><div class="dialog-header"></div><div class="dialog-content"></div></div><div class="close"></div></section>'
        })).before('render', function () {
            var S = this,
                template = '<div class="popup-body"><div class="order-info"><div class="item-pic"><img src="{{thumimg}}"></div><p class="item-title">{{title}}{{specification}}</p><p class="item-price price"><span class="current-price"><span class="figure figurePrice">{{_htmlPrice}}</span></span></p></div><div class="order-count"><label for="order-count-input">购买数量：</label><div class="form-control"><span class="btn minus-btn" >-</span><input id="order-count-input" type="tel" value="1" name="count" min="1" max="99" maxlength="2" autocomplete="off" ><span class="btn plus-btn" >+</span></div></div></div><div class="popup-footer"><span class="btn confirm-btn"  id="order-confirm-btn" data-busy="正在加入..." data-idle="确认"   tj_category="商品" tj_action="{{itemId}}" tj_label="立即购买" tj_value="确认" href="">确认</span></div><a class="btn close-btn close">+</a></div>',
                minusFn = function (event) {
                    event.preventDefault();
                    var $count = S.$('#order-count-input'),
                        count = parseInt($count.val());
                    if (count - 1 < 1) {
                        return;
                    }
                    $count.val(count - 1);
                },
                pushFn = function (event) {
                    event.preventDefault();
                    var $count = S.$('#order-count-input'),
                        count = parseInt($count.val());

                    var new_item_count = count + 1;
                    goods.check(new_item_count, 1).done(function () {
                        $count.val(new_item_count);
                    }).fail(function (json) {
                        alert(json && json.msg || '未知错误');
                    });
                },
                submitFn = function (event) {

                    event && event.preventDefault();
                    var $count = S.$('#order-count-input'),
                        count = parseInt($count.val());
                    if ($('#order-confirm-btn').hasClass('disable')) {
                        return;
                    }
                    if (type == 1) {
                        //加入购物车
                        var item = Cart.query(goods.itemId) || Cart.create(goods);
                        if (item) {
                            item.add({
                                count: count,
                            }).done(function () {
                                S.hide();
                                $('.navbar-main').text('商品详情');

                                //renderCart(goods);
                            }).fail(function (json) {
                                alert(json && json.msg || '同步购物车失败！');
                                if (!item.goods.itemNum) {
                                    Cart.removeItem(item);
                                }
                            });
                        }

                    } else if (type == 2) {

                        //立即购买
                        goods.check(count, 0).done(function () {

                            var placeO = URL.placeOrder + '?gid=' + goods.itemId + '&count=' + count + '&pUserId=' + pUserId;
                            if(itemTypes == 9 || isTaxFree == 1){
                                location.href = placeO + '&type='+itemTypes;
                            }else{
                                location.href = placeO;
                            }
                            if(URL.param.isShare){
                                location.href = placeO + '&isShare=1';
                            }


                        }).fail(function (json) {
                            alert(json && json.msg || '未知错误');
                        });
                    }
                },
                sid,
                focusFn = function (event) {
                    event.preventDefault();
                    sid = setInterval(function () {
                        var $count = $('#order-count-input'),
                            val = $count.val();
                        if (val) {
                            if (!/^[\d]{1,2}$/gi.test(val)) {
                                $count.val(1);
                            }
                            $('#order-confirm-btn').removeClass('disable');
                        } else {
                            $('#order-confirm-btn').addClass('disable');
                        }
                    }, 500);
                },
                blurFn = function (event) {
                    event.preventDefault();
                    clearInterval(sid);
                    var $count = $('#order-count-input'),
                        val = $count.val();
                    if (!/^[\d]{1,2}$/gi.test(val)) {
                        $count.val(1);
                    }
                    $('#order-confirm-btn').removeClass('disable');
                };
                closeFn = function(event){
                    event.preventDefault();
                    S.hide();
                }

            S.$('.dialog-content').html(bainx.tpl(template, goods))
                .on('tap', '.minus-btn', minusFn)
                .on('tap', '.plus-btn', pushFn)
                .on('tap', '#order-confirm-btn', submitFn)
                .on('focus', '#order-count-input', focusFn)
                .on('blur', '#order-count-input', blurFn)
                .on('tap', '.close', closeFn);
            if (type == 1) {
                S.$('.navbar-main').text('加入购物车');
                S.$('#order-confirm-btn').attr('tj_label','加入购物车');

            } else {
                S.$('.navbar-main').text('立即购买');
            }

        }).show();

    }

    function renderCart(goods) {
        Cart.ready(function () {
            Cart.forEach(function (index, item) {
                if (item.id == goods.itemId) {
                    $('<a id="cart" href="/api/h/1.0/cartPage.htm" class="rollIn"><img src="data:image/png;base64,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"></a>').appendTo('body');
                }
            })
        })
    }

    function weiXinShare() {
        console.log(URL.site + URL.goodsDetail + '?gid=' + id + '&pUserId='+pageConfig.pid+'&isShare=1');
        if (Common.inWeixin) {
            console.log(document.title);
           // var inQuestion = location.href.match(/\?/i);
            var descTitle = $('.info-wrap h1').text();

            var shareUrl = URL.site + URL.goodsDetail + '?gid=' + id + '&pUserId='+pageConfig.pid+'&isShare=1&firstT=1',

                shareOption = {
                    title: '米酷 ', // 分享标题
                    desc: '<' + descTitle + '>这款产品一百个赞，快快进米酷的碗里来!', // 分享描述
                    link: shareUrl, // 分享链接
                    type: 'link', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    imgUrl: shareImgUrl // 分享图标
                },
                shareOptionTimeline = {
                    title: descTitle, // 分享标题
                    link: shareUrl, // 分享链接
                    imgUrl: shareImgUrl // 分享图标
                };

            WeiXin.hideMenuItems();
            WeiXin.showMenuItems();
            WeiXin.share(shareOption, shareOptionTimeline);

        }

    }

    function refreshCart() {
        Common.getCartCount();
        Common.isLogin && Cart.ready(function () {

//            renderSmallCart();
//            refreshListCount();
        });

    }
    init();

});
