/**
 * xiangdangjia global.js
 * Superman 2014.12.20
 * version 0.2.0
 */
define('h5/js/common', [
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/common/cart',
    'h5/js/common/goods',
    'h5/js/common/weixin'
], function($, URL, Data, Cart, Goods,Weixin) {



    //去除中国移动恶心的上网管家
    /*try{
     top.tlbsEmbed = true;
     }catch(ex){

     }*/

    //去除中国电信DNS劫持的广告展示 ！！！！没用
    //http://116.252.178.237:19991/main.js?ver=v44
    /*window['BCMain'] = {
     show : function(){},
     third_req : function(){}
     };*/
    //


    var debug = false; //window.localStorage && localStorage['debug'];

    //检测调试模式
    bainx.each(URL.param, function(item, key) {
        if (key == 'debug') {
            $('body').addClass('debug');
            debug = true;
        }
    });

    var isAndroid = navigator.userAgent.match(/Android/i);
    var isIPhone = navigator.userAgent.match(/iPhone|ipad/i);
    var inWeLink = navigator.userAgent.match(/welink/i);
    var inWeixin = navigator.userAgent.match(/micromessenger/i);
    // && window.WeixinJSBridge;

    var NetType = navigator.userAgent.toLocaleLowerCase().match(/NetType\/(\w*\+?)/i);
    NetType = $.isArray(NetType) && (NetType.length == 2) && NetType[1] || '';

    /*alert('ua = '+ navigator.userAgent);
     alert('net type = ' + NetType);*/

    sessionStorage['networkType'] = NetType;

    //
    if(isAndroid){
        $('html,body').addClass('overflow-scrolling');
    }

    var NTI = {
        '2g': '!q50',
        'cmnet': '!q50',
        'ctwap': '!q50',
        'ctnet': '!q50',
        '3g': '!q50',
        '3gnet' : '!q50',
        '3g+': '!q75',
        'ctlte': '!q75',
        '4g': '!q75',
        'wifi': '',
        'nonwifi':''
    };

    function imgSrc(src) {
        var reg = /(^http:\/\/welinklife\.b0\.upaiyun\.com\/)[\S]*(\.jpg$)/gi;
        var ret = src;
        if (reg.test(src)) {
            ret += imgSrc.compress;
        }
        //window.confirm(ret);
        return ret;
    }
    imgSrc.compress = NTI[sessionStorage['networkType'] || '4g'];

    //alert(imgSrc.compress);

    var networkType = $.Deferred();

    networkType.done(function(nt) {
        imgSrc.compress = NTI[nt] || '';
    });


    /**
     * touch <a href="url"> 处理
     */
    function touchAction(event) {
        event.preventDefault();
        console.log(event, this);
        var sender = $(this),
            href = sender.attr('href');

        var tj_category = sender.attr('tj_category'),
            tj_action = sender.attr('tj_action'),
            tj_label = sender.attr('tj_label'),
            tj_value = sender.attr('tj_value'),
            tj_nodeid = sender.attr('tj_nodeid'),
            _czc;

        tj_category = tj_category ? tj_category : '首页'; //必填
        tj_action = tj_action ? tj_action : ''; //必填
        tj_label = tj_label ? tj_label : '';
        tj_value =  tj_value ? tj_value : 1;
        tj_nodeid = tj_nodeid ? tj_nodeid : '';
        console.log(tj_category, tj_action, tj_label,tj_value,tj_nodeid,'统计','href:'+href);

        //if(tj_action && URL.site.indexOf('miku') >= 0){
        //    _czc.push(['_trackEvent', tj_category, tj_action, tj_label,tj_value,tj_nodeid]);
        //}


        if (href) {
            //location.href = href;
            URL.assign(href);
        }

    }


    /*头部*/
    function headerHtml(title,rightBtnHtml,showLeft,obj){
        if(!rightBtnHtml){
            rightBtnHtml = '';
        }
        var leftBtnHtml = showLeft ? '':  '<div class="btn-navbar navbar-left"><span href="javascript:history.go(-1);" class="icon icon-return"></span></div>',
            header = '<section class="header"><div class="content navbar">'+leftBtnHtml+'<div class="navbar-main">'+title+'</div>'+rightBtnHtml+'</div></section>';

        (obj) ? $(obj).append(header) : $('body').append(header)

    }




    /**
     * DOM事件绑定
     */
    $('body')
        .on('tap', '[href]', touchAction)
        .on('click', 'input', function (event) {
            event.preventDefault();
        }).on('dbclick', function(event) {
        event.preventDefault();
    }).on('blur change', function(event) {
        var sender = $(event.target),
            initValue = sender.attr('initValue');
        if (initValue != sender.val()) {
            sender.addClass('changed');
        } else {
            sender.removeClass('changed');
        }
    }).on('focus', 'input', function() {
        $('body').addClass('editing');
    }).on('blur', 'input', function() {
        $('body').removeClass('editing');
    });




    /**
     * 监听屏幕旋转事件
     */
    addEventListener('load', function() {
        window.onorientationchange = function() {
            $('input').blur();
        };
    });

    function state(data, replaceState) {
        var url = location.pathname;
        if (bainx.isString(data)) {
            url = data;
        } else if (bainx.isPlainObject(data)) {
            $.extend(URL.param, data);
            url += '?' + $.param(URL.param);
        }
        if (replaceState && window.history.replaceState) {
            window.history.replaceState(URL.param, document.title, url);
        } else {
            window.history.pushState(URL.param, document.title, url);
        }
    }

    function checkMobile(m) {
        if (!m) {
            bainx.broadcast('请输入手机号码！');
            return;
        } else if (!/^[\d]{11}$/gi.test(m)) {
            bainx.broadcast('请输入正确的手机号码！');
            return;
        }
        return m;
    }

    downAndConcern();
    //下载与分享
    function downAndConcern(){
        var is_show = false;

        //需要显示的页面添加该页面的URL
        if ([
                URL.index,          //商城首页
                //URL.goodsDetail, //商品详情
                //URL.myInviteAlly, //邀请盟友
                //URL.myInviteAllyQr, //二维码邀请盟友
                //URL.redPacketHtm, //全场通用红包
                //URL.receiveRedPacketHtm, //全场通用红包接收
                //URL.hActiveHtm, //活动页
                //URL.crowdfundHomePage,      //众筹首页
                //URL.mbhyymszcPage, //美博会一元秒杀
                //URL.crowdfundInfoPage   //众筹详情
            ].indexOf(location.pathname) >= 0 || URL.param.page == 'lottery') {
            //is_show = true;
        }


        if(is_show){

            var black_img = imgPath+'common/images/icon_home_delete2.png',
                white_img = imgPath+'common/images/icon_home_delete.png',
                msg_content = '',
                msg_handle = '',
                local_img_src = '',
                font_color='',
                border_color ='',
                background_color='',
                class_name = '',
                style_class='';

            //判断是否是微信
            if(inWeixin){
                msg_content = '关注米酷公众号,马上领取现金红包';
                msg_handle = '马上关注';
                class_name = 'concern_wx';
            }else{
                msg_content = '下载米酷APP,马上领取现金红包';
                msg_handle = '下载APP';
                class_name = 'down_load_app';
            }

            if (URL.param.page == 'lottery') {
                local_img_src = black_img;
                font_color = '';
                border_color = 'black_border';
                background_color = 'black_background';
                style_class = 'style="bottom: 0;"';
            }else{
                local_img_src = white_img;
                font_color = 'white';
                border_color = 'white_border';
                background_color = 'white_background';
            }

            var html = '<section id="down_and_concern" class="'+background_color+'" '+style_class+'><div class="down_img_left"><img src="'+local_img_src+'" alt=""></div><div class="down_con_center '+font_color+'">'+msg_content+'</div><div class="down_con_right '+font_color+' '+border_color+' '+class_name+'">'+msg_handle+'</div></section>';
            $('body').append(html);
            if(URL.param.page == 'lottery' && URL.param.type != '1'){
                $('#down_and_concern').remove();
            }

            $('body').on('tap','.down_img_left',function(){
                $(this).parent().hide();
            }).on('tap','.concern_wx',function(){
                location.href = URL.concernWeixin;
            }).on('tap','.down_load_app',function(){
                location.href = URL.downloadHtm;
            }).on('tap','#buy-btn',function(){
                $('#down_and_concern').hide();
            }).on('tap','#cart-btn',function(){
                $('#down_and_concern').hide();
            });

            //已关注隐藏
            if(pageConfig.subscribeWx == 1 || pageConfig.subscribeWx == 2){
                $('#down_and_concern').hide();
            }
            //alert(pageConfig.subscribeWx);
            //setTimeout(function(){
            //    $('#down_and_concern').hide();
            //},5000);
        }
    }

    function renderAppBar(myUrl){
        console.log(myUrl);
        //var shareUrl = URL.param.isShare ? '?isShare=1' : '';
        var data = [{
                url : URL.index,
                icon : 'index-bar',
                title : '定制'
            },
            //,{
                //url : URL.category,
                //icon : 'list-bar',
                //title: '分类'
           // },
            {
                url : URL.discoverPage+'?type=1',
                icon : 'cart-bar',
                title : '发现'
            },{
                url : URL.userCenter,
                icon : 'user-bar',
                title: '个人中心'
            }],
            template = '<li class="col col-25 {{active}} addHrefParm" href="{{url}}" tj_action="{{title}}"><i class="{{icon}} "></i><p>{{title}}</p></li>',
            html = [];
        $.each(data, function(index, item){
            if(myUrl){
                if(item.url == myUrl){
                    item.url = '';
                    item.active = 'active';
                }
            }else{
                if(new RegExp(location.pathname).test(item.url)){
                    item.url = '';
                    item.active = 'active';
                }
            }

            html.push(bainx.tpl(template, item));
        });
        html = '<section id="app-bar" class="grid"><ul class="row">' + html.join('') + '</ul></section>';
        $('body').append(html);
        //$('.addHrefParm').each(function () {
        //    addPUserId($(this));
        //})
       // getCartCount();
    }

    //获取购物车商品总数
    function getCartCount(){

        $('<span class=" price" style="visibility:hidden"></span>').appendTo('#app-bar .cart-bar');
        if($('.category-handle span').length == 0){
            $('<span class=" price" style="visibility:hidden"></span>').appendTo('#listPage .cart-bar');
        }
        var navCart = $('#app-bar .cart-bar .price'),
            listCart = $('#listPage .cart-bar .price');

        /* Cart.ready();*/
        Cart.on('total', function(total){


            if(total){

                var sum = parseFloat((Cart._sum  - Cart._totleTopicP) / 100);
                if(parseInt(sum) > 999){
                    sum = '999+';
                }
                navCart.text(sum).css({visibility: "visible"});
                listCart.text(sum).css({visibility: "visible"});
                $('i.cart-bar').next().text(total + '件').css({'color':'#2e2e2e'});
               // $('#app-bar li:nth-child(2) p').text(total + '件').css({'color':'#fb4e90'});

            }else{
                navCart.css({visibility: "hidden"});
                listCart.css({visibility: "hidden"});
                $('i.cart-bar').next().text('购物车');
               // $('#app-bar li:nth-child(2) p').text('购物车');
            }
        });


    }

    function moneyString(money) {
        return (isNaN(money) ? 0 : (money / 100)).toFixed(2);
    }

    function moneyString0(money) {
        return (isNaN(money) ? 0 : (money / 100)).toFixed(0);
    }

    function statistics(category, action, label, value){
        console.log(category, action, label, value);
        //window._hmt && _hmt.push(['_trackEvent', category, action, label, value]);
        window.ga && ga('send', 'event', category, action, label, value);
    }

    //返回顶部
    function to_Top(obj) {
        var topHtm = '<div class="topIcon" id="to_top">返回顶部</div>';
        $(topHtm).appendTo('body');

        $(obj).on('scroll', function () {
            var offset = 180;
            $(this).scrollTop() > offset ? $('#to_top').addClass('is-visible') : $('#to_top').removeClass('is-visible');

            //有下载或者关注导航条的时候隐藏回到顶部
            var nav_is_show = $('#down_and_concern').css('display');
            if(nav_is_show == 'block'){
                $('#to_top').removeClass('is-visible');
            }
        })
        $('#to_top').on('tap', function () {
            $(obj).scrollTop(0);
        })
    }

    //分享提示
    function shareTips(obj, setTime1, setTime2) {

        if ($(".header").length != 0) {
            $('.header').addClass('hide');
        }
        if ($(".shareCont").length == 0) {
            template = '<div class="shareCont"><div class="wra"> <img id="img" src="' + URL.imgPath + '/common/images/shareTips.jpg" /><div class="closeShareTips"><span>我知道了</span></div></div> </div>';
            $(template).appendTo('body');
            $('.shareCont').css({'opacity': 1, 'height': 'auto'});
            var imgHeight,
                img1 = document.getElementById('img');
            img1.onload = function () {
                imgHeight = $('.shareCont').height();
                $(obj).css({'margin-top': imgHeight});
                if ($(".header").length != 0) {
                    $(obj).css({'padding-top':0});
                }
            }
        }
        $('.closeShareTips').on('tap', function (event) {
            event.preventDefault();
            setTimeout(a, setTime1);
            if ($(".header").length != 0) {
                setTimeout(b, setTime2);
                $(obj).css({'padding-top':'45px'});
            }
            $(obj).css({'margin-top': 0});
        })
        function a() {
            $('.shareCont').remove();
        }
        function b() {
            $('.header').removeClass('hide');
        }
    }


    //上传图片
    function uploadImages(event, form, url) {

        var pomi = $.Deferred();
        var img = event.target.files[0];



        // 判断是否图片
        if(!img){
            return ;
        }

        // 判断图片格式
        if(!(img.type.indexOf('image')==0 && img.type && /\.(?:jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/.test(img.name)) ){
            bainx.broadcast('图片只能是jpg,gif,png');
            return ;
        }
        var data = new FormData($(form)[0]);

        console.log(data)

        $.ajax({
            url: URL.site + '/' + url,
            type: 'POST',
            data: data,
            dataType: 'JSON',
            cache: false,
            processData: false,
            contentType: false
        }).done(function(res){

            res = JSON.parse(res);

            $('.waitting').hide();

            if(res) {
                bainx.broadcast('上传图片成功！');

            } else {
                bainx.broadcast('上传图片失败！');
            }

            pomi.resolve(res);

        });

        return pomi.promise();

    }

    //剩余时间计算显示
    function Crowdfund(startTime,endTime) {

        var desc_name,
            remains_time,
            remains_time_name='';
        if (startTime && endTime) {
            if (nowTime < startTime) { //未开始
                desc_name = '即将开始';
            } else if (nowTime > endTime) {//已结束
                desc_name = '已结束';
            } else { //进行中
                desc_name = '剩余';
                remains_time = (endTime - nowTime) / 1000;
            }

            if (remains_time > 0) {
                if (remains_time < 60) {
                    remains_time_name = parseInt(remains_time) + '秒';
                } else if (remains_time < 60 * 60) {
                    remains_time_name = parseInt(remains_time / 60) + '分';
                } else if (remains_time < 60 * 60 * 24) {
                    remains_time_name = parseInt(remains_time / (60 * 60)) + '时';
                } else  {
                    remains_time_name = parseInt(remains_time / (60 * 60 * 24)) + '天';
                }
            }

            remains_time_name = desc_name + remains_time_name;
        }
        return remains_time_name;
    }


    //返回上一页
    function returnPrePage() {
        if (window.document.referrer == "" || window.document.referrer == window.location.href) {
            window.location.href = "{dede:type}[field:typelink /]{/dede:type}";
        } else {
            window.location.href = window.document.referrer;
        }
    }

    //隐藏身份证只显示前4后4
    function plusStar (str,frontLen,endLen) {
        var len = str.length-frontLen-endLen;
        var xing = '';
        for (var i=0;i<len;i++) {
            xing+='*';
        }
        return str.substr(0,frontLen)+xing+str.substr(str.length-endLen);
    }

    //所有href加pUserId
    function addPUserId(target) {
        var pUserId = URL.param.pUserId;
        if (pUserId) {
            var inQuestion = target.attr("href").match(/\?/i),
                href;
            if (target.attr("href") != '') {
                href = inQuestion ? target.attr("href") + '&pUserId=' + pUserId : target.attr("href") + '?pUserId=' + pUserId;
                if (URL.param.isShare) {
                    href = href + '&isShare=1';
                }
            }
            target.attr("href", href);
        }
    }

    //分享时判断是否有上级，如有则显示
    function isParentUserShow(){
        var pUserId = URL.param.pUserId;
        if (URL.param.isShare == '1' && pUserId != "undefined") {

            if (getCookie('pUserId') == URL.param.pUserId) {
                return;
            }else{
                var data = {
                    pUserId :URL.param.pUserId
                }
                Data.myParentUser(data).done(function(res){

                    if(res.hasUp == 0 || res.hasUp == 3 ){ //-1=未登录;0=无代理关系;1=有上级；2=有代理关系3=同一线上
                        if($('#showParentUserPage').length == 0) {
                            $('body').append('<div id="showParentUserPage"><div class="content"><img src="' + URL.imgPath + 'common/images/popup.png"/><i class="close"></i></div></div>');

                            document.cookie = "pUserId=" + URL.param.pUserId; //存储pUserId到cookies中
                            document.cookie = "isParentUserShow=1"; //存储显示到cookies中
                        }else {
                            return;
                        }
                    }
                    $('#showParentUserPage i').on('tap',function(){
                        $('#showParentUserPage').remove();
                    })


                })
            }
        }
    }

    //读取cookie
    function getCookie(name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    }


    //清除cookie
    function delCookie(name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = getCookie(name);
        if (cval != null)
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    }
    //
    if ([
            URL.index,          //商城首页
            URL.goodsDetail, //商品详情
            URL.redPacketHtm, //全场通用红包
            URL.hActiveHtm, //活动页
            URL.crowdfundHomePage,      //众筹首页
            URL.crowdfundInfoPage,   //众筹详情
            URL.buyForJoinAgencyPage, //购买礼包
            URL.cart,//购物车
            URL.userCenter,//个人中心
            URL.placeOrder,//订单页
            URL.crowdfundPaymentPage,//众筹支付页
            URL.myPoint  //签到
        ].indexOf(location.pathname) >= 0) {
        isParentUserShow();
    }


    //消除之前在列表页设置的sessionStorage。。
    if ([
            URL.list,          //列表页
            URL.goodsDetail
        ].indexOf(location.pathname) < 0) {
        sessionStorage.removeItem('countP');
        sessionStorage.removeItem('countD');
        sessionStorage.removeItem('cidParent');
        sessionStorage.removeItem('cidName');
        sessionStorage.removeItem('cid3Name');
        sessionStorage.removeItem('brandName');

    }

    if (inWeixin && [
            URL.index,          //商城首页
            URL.hActiveHtm, //活动页
            URL.loginPage,//登录页
            URL.boxDetailPage,//盒子详情页
            URL.userReportPage,//报告
            URL.orderList,//订单列表

        ].indexOf(location.pathname) < 0) {
        setTimeout(function() {
            Weixin.hideMenuItems()
            /*.done(function() {
             alert('hide menu items success');
             });*/
        }, 500);
    }

//js刷新记住原来位置
    function goBack(){
        var scrollPos;
        if (typeof window.pageYOffset != 'undefined') {
            scrollPos = $('.page-content').scrollTop();
        }
        else if (typeof document.compatMode != 'undefined' &&
            document.compatMode != 'BackCompat') {
            scrollPos = document.documentElement.scrollTop;
        }
        else if (typeof document.body != 'undefined') {
            scrollPos = document.body.scrollTop;
        }
        document.cookie = "scrollTop=" + scrollPos; //存储滚动条位置到cookies中


    }


    function scrollTopRel() {
        if (document.cookie.match(/scrollTop=([^;]+)(;|$)/) != null) {
            var arr = document.cookie.match(/scrollTop=([^;]+)(;|$)/); //cookies中不为空，则读取滚动条位置
            document.documentElement.scrollTop = parseInt(arr[1]);
            document.body.scrollTop = parseInt(arr[1]);
            $('.page-content').scrollTop(parseInt(arr[1]));
        }
    }

    var imgPrefix = 'http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==';

    var downloadLink = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.unescn.ninelab',
        companyTel = '4006-234-336';

    //if(isAndroid){
    //    downloadLink = 'http://fir.im/k1ue';
    //}
    //if(isIPhone){
    //    downloadLink = 'http://fir.im/mikumine';
    //}


    return {
        headerHtml:headerHtml,
        addPUserId: addPUserId,
        goBack:goBack,
        scrollTopRel:scrollTopRel,
        isParentUserShow:isParentUserShow,
        plusStar:plusStar,
        Crowdfund:Crowdfund,
        uploadImages: uploadImages,
        to_Top: to_Top,
        shareTips: shareTips,
        returnPrePage: returnPrePage,
        statistics : statistics,
        isLogin : window.pageConfig && window.pageConfig.pid,
        renderAppBar : renderAppBar,
        moneyString: moneyString,
        moneyString0:moneyString0,
        getCartCount:getCartCount,
        isDebug: debug,
        /*CountDown: CountDown,
         LoadNext: LoadNext,*/
        state: state,
        imgSrc: imgSrc,
        //appBarCartCount: appBarCartCount,
        isAndroid: isAndroid,
        isIPhone: isIPhone,
        inWeLink: inWeLink,
        inWeixin: inWeixin,
        downloadLink: downloadLink,
        companyTel: companyTel,
        /*coupon: {
         '500': {
         img: imgPrefix + '/20150312/vNTT-0-1426146384098.png'
         },
         '1000': {
         img: imgPrefix + '/20150312/vNTT-0-1426146488500.png'
         },
         '2000': {
         img: imgPrefix + '/20150312/vNTT-0-1426146488517.png'
         }
         }*/
    };

});
