/**
 * 颜值测试
 * Created on 2016/1/5.
 */
require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/transDialog',
    'h5/js/common/nexter',
    'h5/js/common/weixin'
], function ($, URL, Data, Common, Dialog, Nexter, WeiXin) {


    var Page,
        //faceScore,
        imgUrl,
        rankListPage;

    function init() {
        Data.checkProfileId();
        $('.waitting').hide();
        initPage();

        weiXinShare();

    }

    function initPage() {
        renderPage(0);
        bindEventHandle();

    }

    function renderPage(index) {
        var template = '<a class="result" style="position:absolute;right: 0;top:50px;z-index: 10;">测试结果</a><div class="overflow-wrap"><header class="grid "><div class="btn-navbar navbar-left"><span href="javascript:history.go(-1);" class="icon icon-return"></span></div><div class="row"><div class="col nav" data-index="0">测颜值</div><div class="col nav" data-index="1">排行榜</div></div></header><div class="overflow-x-wrap clearfix"><div class="overflow-y-wrap"><div class=" grid takePhoto"><div class="camera"><img id="camera-img" src="' + URL.imgPath + '/common/images/faceScoreTest/camera.png" /><form id="my_form" action="' + URL.uploadUserQrCode + '" class="form-horizontal" enctype="multipart/form-data"> <input id="file" name="file" type="file"/></form><p>马上自拍一张</p> </div> </div><div class="takeFooter"><img src="' + URL.imgPath + '/common/images/faceScoreTest/bg_bottom.png" /> </div></div><div class="overflow-y-wrap"><div class="photoList"><ul class="list grid"></ul></div></div></div></div>';

        $('body').append(template);
        var img1 = document.getElementById('camera-img');
        img1.onload = function () {
            $('#file').height($('.camera img').height());
        }
        Page = $('body').attr('id', 'faceIndexPage');

        $('.photoList', Page).height($(window).height()-$('header').height());

        switchNav(index);
    }


    function fetchRankList() {
        //RankList = [{index:1,pic:1,score:80},{index:2,pic:2,score:70},{index:3,pic:3,score:90}];
        //return RankList;

        return Data.faceScoreExchangeList();
    }


    function renderRankList() {

        //if(!rankListPage){
        //    fetchRankList().done(function(res){
        //        RankList = res;
        //        if(res){
        //            renderRankList(res);
        //        }
        //    });
        //
        //    //fetchRankList();
        //
        //    //renderRankList(RankList);
        //
        //    return;
        //}

        var RankData = [
            {index:1,picUrl:'http://wx.qlogo.cn/mmopen/0w44rZsqE6YDZYZfPq2JxH3oLkYFFQZRRKJxYuRdgb2LS9p6gjIjJ4Y1DBP9icXy7LkBAZ5GuUPdmTITuIzadSa7zzDhlXFlO/0',faceScore:80},
            {index:2,picUrl:'http://wx.qlogo.cn/mmopen/0w44rZsqE6YDZYZfPq2JxH3oLkYFFQZRRKJxYuRdgb2LS9p6gjIjJ4Y1DBP9icXy7LkBAZ5GuUPdmTITuIzadSa7zzDhlXFlO/0',faceScore:70},
            {index:3,picUrl:'http://wx.qlogo.cn/mmopen/0w44rZsqE6YDZYZfPq2JxH3oLkYFFQZRRKJxYuRdgb2LS9p6gjIjJ4Y1DBP9icXy7LkBAZ5GuUPdmTITuIzadSa7zzDhlXFlO/0',faceScore:90},
            {index:4,picUrl:'http://wx.qlogo.cn/mmopen/0w44rZsqE6YDZYZfPq2JxH3oLkYFFQZRRKJxYuRdgb2LS9p6gjIjJ4Y1DBP9icXy7LkBAZ5GuUPdmTITuIzadSa7zzDhlXFlO/0',faceScore:50},
            {index:5,picUrl:'http://wx.qlogo.cn/mmopen/0w44rZsqE6YDZYZfPq2JxH3oLkYFFQZRRKJxYuRdgb2LS9p6gjIjJ4Y1DBP9icXy7LkBAZ5GuUPdmTITuIzadSa7zzDhlXFlO/0',faceScore:65},
            {index:6,picUrl:'http://wx.qlogo.cn/mmopen/0w44rZsqE6YDZYZfPq2JxH3oLkYFFQZRRKJxYuRdgb2LS9p6gjIjJ4Y1DBP9icXy7LkBAZ5GuUPdmTITuIzadSa7zzDhlXFlO/0',faceScore:65},
            {index:7,picUrl:'http://wx.qlogo.cn/mmopen/0w44rZsqE6YDZYZfPq2JxH3oLkYFFQZRRKJxYuRdgb2LS9p6gjIjJ4Y1DBP9icXy7LkBAZ5GuUPdmTITuIzadSa7zzDhlXFlO/0',faceScore:65},
            {index:8,picUrl:'http://wx.qlogo.cn/mmopen/0w44rZsqE6YDZYZfPq2JxH3oLkYFFQZRRKJxYuRdgb2LS9p6gjIjJ4Y1DBP9icXy7LkBAZ5GuUPdmTITuIzadSa7zzDhlXFlO/0',faceScore:65},
            {index:9,picUrl:'http://wx.qlogo.cn/mmopen/0w44rZsqE6YDZYZfPq2JxH3oLkYFFQZRRKJxYuRdgb2LS9p6gjIjJ4Y1DBP9icXy7LkBAZ5GuUPdmTITuIzadSa7zzDhlXFlO/0',faceScore:65},
            {index:10,picUrl:'http://wx.qlogo.cn/mmopen/0w44rZsqE6YDZYZfPq2JxH3oLkYFFQZRRKJxYuRdgb2LS9p6gjIjJ4Y1DBP9icXy7LkBAZ5GuUPdmTITuIzadSa7zzDhlXFlO/0',faceScore:65},
            {index:11,picUrl:'http://wx.qlogo.cn/mmopen/0w44rZsqE6YDZYZfPq2JxH3oLkYFFQZRRKJxYuRdgb2LS9p6gjIjJ4Y1DBP9icXy7LkBAZ5GuUPdmTITuIzadSa7zzDhlXFlO/0',faceScore:65},
            {index:12,picUrl:'http://wx.qlogo.cn/mmopen/0w44rZsqE6YDZYZfPq2JxH3oLkYFFQZRRKJxYuRdgb2LS9p6gjIjJ4Y1DBP9icXy7LkBAZ5GuUPdmTITuIzadSa7zzDhlXFlO/0',faceScore:65}];

        //var nexter = new Nexter({
        //    element: $('.photoList'),
        //    dataSource: RankData,  //Data.faceScoreExchangeList
        //    enableScrollLoad: true,
        //}).load().on('load:success', function (items) {
            var html = [],
                template = '<li class="item row"><div class="icon-wrap col col-5"><img class="icon" src="' + URL.imgPath + 'common/images/faceScoreTest/{{index}}.png"/></div><div class="score-wrap col col-10"><span class="label">颜值分:{{score}}</span></div><div class="username col col-10">昵称:{{userName}}</div></li>';

            //$.each(items.list, function(index, item){
            $.each(RankData, function(index, item){

                //序号
                item.index = index+1;
                //var index = index + 1,
                //    str_mumber =index.toString().split(''),
                //    sort_mumber = [];
                //
                //$.each(str_mumber, function(index, str) {
                //
                //    str = '<img class="icon col" src="' + URL.imgPath + 'common/images/faceScoreTest/face-rank-' + str + '.png"/>';
                //
                //    sort_mumber.push(str);
                //
                //});
                //
                //item.sort_mumber = sort_mumber.join('');

                //测试照片
                item.picUrl = item.picUrl ? item.picUrl : URL.imgPath + 'common/images/faceScoreTest/pic_default.png';

                html.push(bainx.tpl(template, item));

            });

            rankListPage = $('.photoList .list').append(html.join(''));
        //});

    }

    function showFaceScore(res) {
        if(!dialog) {
            var dialog = new Dialog($.extend({}, Dialog.templates.top, {
                id: 'faceScroePage',
                //onHideDestroy: true,
                template: bainx.tpl('<section class="wl-trans-dialog wl-bottom-dialog"><section class="header"><div class="content navbar"><div class="btn-navbar navbar-left"><span href="javascript:history.go(-1);" class="icon icon-return"></span></div><div class="navbar-main">测试结果</div></div></section><section class="page-content"><div class="photo-wrap"><img src="{{picUrl}}" alt="" class="photo"></div><div class="face-info"><span class="item-info">年龄：{{age}}</span><span class="item-info">性别：{{sex}}</span><span class="item-info">颜值分：{{faceScore}}</span></div><div class="face-tips"><img class="tips-img" src="{{faceScoreTips}}" alt=""></div><div class="action-bar"><a href="javascript:;" class="item-action item-exchange"><i class="icon icon-exchange"></i><span class="label">兑换现金</span></a><a href="javascript:;" class="item-action item-again"><i class="icon icon-again"></i><span class="label">再来一次</span></a><a href="javascript:;" class="item-action item-invite"><i class="icon icon-invite"></i><span class="label">邀朋友玩玩</span></a></div></section></section>', res),

                events: {
                    'tap .icon-return': function (event) {
                        event.preventDefault();
                        this.hide();
                    },
                    'tap .item-again': function (event) {
                        event.preventDefault();
                        this.hide();
                    },
                    'tap .item-exchange': function (event) {
                        event.preventDefault();
                        //todo
                        location.href = URL.site + URL.myCoupon + '?mode=point';
                    },
                    'tap .item-invite': function (event) {
                        event.preventDefault();
                        Common.shareTips('#faceScroePage .page-content', 500, 700);
                    }
                }
            }));


            $('.photo').attr('src', imgUrl);

            dialog.render();

            dialog.show();
        }

    }

    function bindEventHandle() {

        if (Page) {
            Page.on('tap', '.nav', function (event) {
                switchNav($(this).data('index'));

            }).on('swipeRight', '.overflow-wrap', function (event) {
                event.preventDefault();
                switchNav(0);

            }).on('swipeLeft', '.overflow-wrap', function (event) {
                event.preventDefault();
                switchNav(1);
            }).on('click', 'input', function (event) {
                if (event && event.preventDefault) {
                    window.event.returnValue = true;
                }
            }).on('change', '#file', function (event) {

                $('.waitting').show();

                var img = event.target.files[0];

                // 判断是否图片
                if(!img){
                    return ;
                }

                // 判断图片格式
                if(!(img.type.indexOf('image')==0 && img.type && /\.(?:jpg|png|gif)$/.test(img.name)) ){
                    alert('图片只能是jpg,gif,png');
                    return ;
                }

                //var data = new FormData($('#my_form')[0]);

                //console.log(data);


                //var imgUrl = $(this).val();
                //
                //$('#camera-img').attr('src', imgUrl);

                var file=this.files[0];

                var reader=new FileReader(),htmlImage;
                reader.onload=function(){
                    // 通过 reader.result 来访问生成的 DataURL
                    //htmlImage = '<img src="'+ e.target.result +'" />';

                    //$('#camera-img').attr('src', e.target.result);

                    imgUrl=reader.result;

                    showFaceScore(imgUrl);


                    var data = {imgStr:imgUrl};
                    Data.faceScore(data).done(function(res) {
                        //$('#img').attr('src',res.wxQrcodeUrl);
                        showFaceScore(res);

                    });
                    //return imgUrl;
                    //setImageURL(url);
                };
                reader.readAsDataURL(file);


                //var image=new Image();
                //function setImageURL(url){
                //    image.src=url;
                //}




                //$.ajax({
                //    url: URL.site + '/' + URL.faceScoreExchange,
                //    type: 'POST',
                //    data: data,
                //    dataType: 'JSON',
                //    cache: false,
                //    processData: false,
                //    contentType: false
                //}).done(function(ret){
                //
                //    $('.waitting').hide();
                //
                //    if(ret) {
                //
                //        ret = JSON.parse(ret).result.do;
                //
                //        if (ret.faceScore < 60) {
                //            ret.faceScoreTips = URL.imgPath+'common/images/faceScoreTest/face-scroe-0-60.png';
                //        } else if ((ret.faceScore > 60) && (ret.faceScore < 70)) {
                //            ret.faceScoreTips = URL.imgPath+'common/images/faceScoreTest/face-scroe-60-70.png';
                //        } else if ((ret.faceScore > 70) && (ret.faceScore < 80)) {
                //            ret.faceScoreTips = URL.imgPath+'common/images/faceScoreTest/face-scroe-70-80.png';
                //        } else if ((ret.faceScore > 80 && ret.faceScore < 90)) {
                //            ret.faceScoreTips = URL.imgPath+'common/images/faceScoreTest/face-scroe-80-90.png';
                //        } else {
                //            ret.faceScoreTips = URL.imgPath+'common/images/faceScoreTest/face-scroe-90-100.png';
                //        }
                //        showFaceScore(ret);
                //    } else {
                //        bainx.broadcast('获取颜值测试结果失败！');
                //    }
                //
                //});

            }).on('tap', '.result', function (event) {
                event.preventDefault();
                showFaceScore(11);
            });
        }
    }


    function switchNav(index) {
        $('header .nav.active').removeClass('active');
        $('header .nav').eq(index).addClass('active');
        if (index == 0) {
            $('.overflow-x-wrap', Page)
                .removeClass('show-right');

        } else if (index == 1) {
            $('.overflow-x-wrap', Page)
                .addClass('show-right');
            if(!rankListPage) {
                renderRankList();
            }
        }
    }

    function weiXinShare() {
        if(Common.inWeixin){
            console.log(document.title);
            var inQuestion = location.href.match(/\?/i);

            var shareUrl =  URL.site + URL.faceScoreTest+'?pUserId='+pageConfig.pid+'&isShare=1',
                shareImgUrl = URL.imgPath + 'common/images/faceScoreTest/share-face-score.png',
                desc = '快来米酷一起玩耍吧~，测测你的颜值值多少钱，还可兑换积分哦~~~',
                shareOption = {
                    title: '看看你的颜值值多少钱', // 分享标题
                    desc: desc, // 分享描述
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

            WeiXin.showMenuItems();
            WeiXin.share(shareOption, shareOptionTimeline);
        }
    }

    init();
});