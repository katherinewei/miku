/**
 * 众筹详情
 * Created by xiuxiu on 2016/2/16.
 */
require([
    'jquery',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/loadImage',
    'h5/js/common/url',
    'h5/js/common/weixin'
], function ($, Data, Common,LoadImage, URL,WeiXin) {

    var Page,
        status = {
            '-1':'乐享团无效',
            '0':'乐享团中',
            '2':'乐享团成功',
            '3':'乐享团失败'
        },
        shareImgUrl,
        id = URL.param.crowdfundId,
        plusDay = 0,    //提示多少天发货
        pUserId = URL.param.pUserId;

    function init() {
        var data = {
            crowdfundId:id
        };
        if (id) {
            Data.getCrowdfundInfo(data).done(function (res) {
                console.log(res);
                render(res);

            });
        }
        Common.to_Top('#content');

    }
    function hasDot(num) {              //判断是否有小数
        if (!isNaN(num)) {
            return ((num + '').indexOf('.') != -1) ? true : false;
        }
    }

    function moneyString(money) {           //如果没有小数，去掉。

        var Price = parseFloat((money / 100).toFixed(2));

        return (isNaN(money)  ? 0 : (hasDot(Price) ? Price.toFixed(2) : parseInt(Price)));
    }



    function render(item) {
        Common.headerHtml('乐享团详情');

        var template = '<div class="page-content" id="content"><div id="item-info"><div class="banner" id="banner"><div class="slider-outer"><ul class="carousel-wrap"></ul></div><div class="carousel-status"><ul></ul></div></div><div class="info-wrap grid"><div class="desc row"><div class="col col-18"><h3>{{title}}</h3><div class="price-crw"><span class="price">{{minItemPrice}}</span>-<span class="price">{{maxItemPrice}}</span></div> </div><div class="col col-9 viewSupport fb far fvc">查看各项支持</div> </div><div class="asideBox row"><div class="col"><div id="light1circle" class="c100 p{{soldNumBar}} "><div class="slice"><div class="bar"></div><div class="fill"></div></div><div class="dot" style="-webkit-transform: rotate({{soldNumDeg}}deg);transform: rotate({{soldNumDeg}}deg);"></div><p class="pspan">{{soldNum}}</p></div><p>支持人数</p> </div> <div class="col"><div id="light2circle" class="c100 p{{statusBar}} "><div class="slice"><div class="bar"></div><div class="fill"></div></div><div class="dot" style="-webkit-transform: rotate({{statusDeg}}deg);transform: rotate({{statusDeg}}deg)"></div><p class="pspan">{{statusBar2}}%<span>{{status}}</span></p></div> </div> <div class="col"><div id="light3circle" class="c100 p{{timeBar}} "><div class="slice"><div class="bar"></div><div class="fill"></div></div><div class="dot" style="-webkit-transform: rotate({{timeDeg}}deg);transform: rotate({{timeDeg}}deg)"></div><p class="pspan">{{remains_time}}</p></div><p class="{{hide}}">剩余时间</p> </div> </div> <div class=" row supportDetail"><p class="Moneyed col col-50 "><b>{{totalFee}}</b>已筹金额</p><p class="totleMoney col col-50  far fvc"><b>{{targetAmount}}</b>目标金额</p></div></div> </div><div class="main-wrap"><div id="item-desc" class="item-content visible"><p class="letView"><span>上滑查看详情</span><i class="line"></i></p></div></div> </div><div id="toolbar" class="grid"><div class="row fvc"><a class="btn button col col-6" id="share-btn">分享</a><a class="button btn col col-19" id="support-btn">我要支持</a></div></div>',
        html = [],
        crowdfundDO = item.crowdfundDO;
        nowTime = item.nowDate;
        plusDay = crowdfundDO.plusDay;
        item.minItemPrice = moneyString(item.minItemPrice);
        item.maxItemPrice = moneyString(item.maxItemPrice);
        item.title = crowdfundDO.title;
        item.soldNum = crowdfundDO.soldNum;

        item.soldNum = item.soldNum / 10000 >= 1 ?  parseInt(item.soldNum / 10000) + '万+': item.soldNum;

        item.soldNumBar = parseInt((item.soldNum / (item.totalNum + item.soldNum) ) * 100);
        item.soldNumDeg = parseInt(360 * (item.soldNumBar / 100));
        //item.time =  Common.Crowdfund(crowdfundDO.startTime,crowdfundDO.endTime);

        item.totalFee = moneyString(crowdfundDO.totalFee);
        item.targetAmount = moneyString(crowdfundDO.targetAmount);

        //item.soldNumDeg =status_progress[crowdfundDO.status];

        item.status = status[crowdfundDO.status];
        //item.statusBar = status_progress[crowdfundDO.status];
        //item.statusDeg = 360 * (item.statusBar / 100);

        item.statusBar =  ((item.totalFee / item.targetAmount) * 100).toFixed(0);
        item.statusBar2 = item.statusBar;
        item.statusDeg = ((item.totalFee / item.targetAmount) * 360).toFixed(0);
        item.statusBar = item.statusBar > 100 ? 100 : item.statusBar;

        if(nowTime < crowdfundDO.startTime){    //即将开始
            item.remains_time = '即将开始';
            item.timeDeg = 0;
            item.timeBar = 0;
            item.hide = 'hide';
        }else if(nowTime > crowdfundDO.endTime){  //已结束
            item.timeDeg = 0;
            item.timeBar = 100;
            item.remains_time = '0 秒';
        }else{                  //进行中
            var remains_time_t = (crowdfundDO.endTime - nowTime) / 1000;

            if (remains_time_t > 0) {
                item.remains_time = parseInt(remains_time_t);
                item.totle_time = parseInt((crowdfundDO.endTime - crowdfundDO.startTime) / 1000 );
                item.timeBar = parseInt(((item.totle_time - item.remains_time) / item.totle_time) * 100 );
                item.timeDeg = 360 * ((item.totle_time - item.remains_time) / item.totle_time);
                item.hide = '';

                if (remains_time_t < 60) {
                    item.remains_time = parseInt(remains_time_t) + '秒';
                } else if (remains_time_t < 60 * 60) {
                    item.remains_time = parseInt(remains_time_t / 60) + '分';
                } else if (remains_time_t < 60 * 60 * 24) {
                    item.remains_time = parseInt(remains_time_t / (60 * 60)) + '时';
                } else {
                    item.remains_time = parseInt(remains_time_t / (60 * 60 * 24)) + '天';
                }
            }

        }

        Page = $(bainx.tpl(template, item)).appendTo('body');



            var outW = $('.progress').width(),
                innerW = $('.progressBar').width();
            if(outW - innerW < 28){
                $('.progressBar').children('i').css('right','0px');
            }

        //环形进度条
        var rotationMultiplier = 3.6;
        $( "div[id$='circle']" ).each(function() {
            var classList = $( this ).attr('class').split(/\s+/);
            for (var i = 0; i < classList.length; i++) {
                if (classList[i].match("^p")) {
                    var rotationPercentage = classList[i].substring(1, classList[i].length);
                    var rotationDegrees = rotationMultiplier*rotationPercentage;
                    $('.c100.p'+rotationPercentage+ ' .bar').css({
                        '-webkit-transform' : 'rotate(' + rotationDegrees + 'deg)',
                        'transform'         : 'rotate(' + rotationDegrees + 'deg)'
                    });
                }
            }
        });


        //详情轮播
        if (crowdfundDO.picUrls && crowdfundDO.picUrls.length) {
            html = [];
            crowdfundDO.picUrls = crowdfundDO.picUrls.split(';');
            $.each(crowdfundDO.picUrls, function (index, pic) {
                html.push('<li class="pic"><div class="pic-wrap"><img src="' + pic + '"></div></li>');
            });
            $('.carousel-wrap', Page).html(html.join(''));
            shareImgUrl = $('.carousel-wrap li').eq(0).find('img').attr('src');
            if($('.pic').length > 1) {
                require('slider', function (Slider) {
                    var ww = $(window).width();
                    $('#pic-carousel .carousel-outer, #pic-carousel .carousel-outer li').width(ww);
                    Slider({
                        slideCell: "#banner",
                        titCell: ".carousel-status ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
                        mainCell: ".slider-outer ul",
                        effect: "left",
                        autoPlay: true,//自动播放
                        autoPage: true, //自动分页
                        // switchLoad:"_src" //切换加载，真实图片路径为"_src"
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
                });
            }

            //产品描述图片
            if (crowdfundDO.detail && crowdfundDO.detail.length) {
                var html = [],
                    data = crowdfundDO.detail.split(';');
                $.each(data, function (index, detail) {
                    html.push('<div class="pic"><img src="' + detail + '"></div>');
                });

                $('#item-desc', Page).html(html.join(''));
                //Lazyload('#item-desc img', {attr: 'data-lazyload-src', container: '#content'});
                //LoadImage($('#content'));
            }else{
                $('#item-desc', Page).html('暂时没有描述商品详情哦~').css('margin','10% 0');

            }
            $('.letView').remove();

        }


        weiXinShare();
        bindEvents();

    }

    function bindEvents() {
        Page.on('tap', '#share-btn', function (event) {
            event.preventDefault();
            Common.shareTips('.page-content', 0, 0);
        }).on('tap','#support-btn , .viewSupport',function(event){
            event.preventDefault();
            var lisURL = URL.crowdfundItemListPage + '?crowdfundId=' + id + '&plusDay=' + plusDay;
            if (URL.param.pUserId) {
                lisURL += '&pUserId=' + pUserId;
            }
            if (URL.param.isShare) {
                lisURL += '&isShare=' + URL.param.isShare;
            }
            URL.assign(lisURL);
        });

        $('#content').on('scroll',function(){
            LoadImage($(this));
        })

    }
    function weiXinShare(){
        if(Common.inWeixin){
            var inQuestion = location.href.match(/\?/i),
                shareUrl = URL.site + URL.crowdfundInfoPage+'?crowdfundId='+id+'&pUserId='+pageConfig.pid+'&isShare=1',

                desc = $('.desc h3').text(),
                shareOption = {
                    title:'米酷乐享团干货', // 分享标题
                    desc: '<' + desc + '>正在乐享团中，好货分享给大家~!', // 分享描述
                    link: shareUrl, // 分享链接
                    type: 'link', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    imgUrl: shareImgUrl // 分享图标
                },
                shareOptionTimeline = {
                    title: desc, // 分享标题
                    link: shareUrl, // 分享链接
                    imgUrl: shareImgUrl // 分享图标
                };

            WeiXin.hideMenuItems();
            WeiXin.showMenuItems();
            WeiXin.share(shareOption, shareOptionTimeline);
        }
    }


    init();
})