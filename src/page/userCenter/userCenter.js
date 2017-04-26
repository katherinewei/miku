require([
    'jquery', 
    'h5/js/common/data',
    'h5/js/common',
   // 'h5/js/common/cart',
    'h5/js/common/url',
    'h5/js/page/createIMSingle'
], function($, Data, Common,URL,CreateIMSingle){
    var Page;


    function init(){
        render();
        //Common.isParentUserShow();
    }
    function render(){
        var template = '<section id="user-page"><div class="user-info-layout grid"><div class="row"><div class="face-img"></div><div class="userInfoDiv fb far fvc"><p class="user-info"></p><!--<p class="level"></p>--></div><div class="col col-1 fb far fvc"><i class="right-icon iconfont"></i></div></div></div><div class="links-layout "><ul class="clearfix grid"></ul></div></section>'/*,
         msgTemplate = '<span class="icon"><span class="badge">10</span></span>'*/;
        
        Page = $('body').append(template);
        //Page = $('#user-page');

        renderUserInfo(Page);


    }
    
    //会员中心显示的链接:isAgency: 0:不是代理显示,1:代理显示,2:总是显示
    function htmlLinks(isAgency){
        var links = [{
                isAgency:2,
                className : 'my-order',
                title : '我的订单',
                url: URL.orderList,
                inFor: '查看全部订单'
            },{
                isAgency:2,
                className : 'my-coupon',
                title: '我的资产',
                url: URL.myCoupon,
                inFor: ''
            },{
                isAgency:2,
                className : 'my-privateButler',
                title : '私人管家',
                url: URL.anonymousChatPage+'?loginentrance=3',
                inFor: '<img />'
            },{
                isAgency:2,
                className : 'my-moisturisesBox',
                title : '护肤盒子',
                url: URL.buyedBoxListPage,
                inFor: ''
            },{
                isAgency:2,
                className : 'my-follow',
                title : '我的关注',
                url: URL.focusListPage,
                inFor: ''
            },{
                isAgency:2,
                className : 'my-consignee',
                title : '收货地址',
                url: URL.address,
                inFor: ''
            },
            //, {
            //    isAgency: 2,
            //    className: 'my-make-money',
            //    title: '我要赚钱',
            //    url: URL.makeMoneyHtm + '?isAgency=' + isAgency,
            //    inFor: '0成本，高收益'
            //}, {
            //    isAgency:1,
            //    className : 'my-profit',
            //    title : '我的推广费',
            //    url: '',
            //    inFor: ''
            //},{
            //    isAgency:1,
            //    className : 'my-marketSpread',
            //    title : '营销推广',
            //    url: '',
            //    inFor: ''
            //},{
            //    isAgency:1,
            //    className : 'my-invite-ally',
            //    title : '邀请粉丝',
            //    url: '',
            //    inFor: '邀请好友送iPhone'
            //},{
            //    isAgency:1,
            //    className : 'my-ally',
            //    title : '我的粉丝',
            //    url: '',
            //    inFor: ''
            //},
            {
                isAgency: 2,
                className: 'contactUs',
                title: '联系我们：',
                url: URL.contactUsHtm,
                inFor: ''
            }],
            template = '<li href="{{url}}" class="{{className}}" tj_category="会员中心" tj_action="{{title}}"><div class="item row fvc"> <div class="col col-50"><i class="iconUser "></i><span class="title">{{title}}</span></div><div class="col col-50 fb far fvc"><span class="infor">{{inFor}}</span><i class="right-icon iconfont"></i></div></div></li>',
            html = [];
            $.each(links, function(index, item){
                html.push(bainx.tpl(template, item));
            });
                
        $('.clearfix').append(html.join(''));
        if(isAgency == 0){
            $('.my-marketSpread').hide();
        }
        //获取专家
        Data.getOneCsad().done(function(res){
            $('.my-privateButler img').attr('src',res.info.csadPicUrl);
        })
        //var currentCsadIM = CreateIMSingle().currentCsadIM;
        //var csadImg = currentCsadIM ? currentCsadIM[3] : imgPath+'common/images/index_cate_1.png';
        //$('.my-privateButler img').attr('src',csadImg);
        //盒子数量
        Data.getDzHomeCount().done(function(res){
            if(res.boxCount > 0){
                $('.my-moisturisesBox .infor').text(res.boxCount+'个');
            }
        })

        myOrder();
        myCoupon();
        contactUs();
    }

    /*我的订单*/
    function myOrder() {
        var menu = [
                {
                    title: '待付款',
                    className: 'order1',
                    state: '0'
                },
                {
                    title: '待收货',
                    className: 'order2',
                    state: '1'
                },
                {
                    title: '待评价',
                    className: 'order3',
                    state: '2'
                },
                {
                    title: '已完成',
                    className: 'order4',
                    state: '3'
                },
                {
                    title: '退货/退款',
                    className: 'order5',
                    state: '4'
                },
            ],
            orderContainer = '<div class="grid orderContainer itemBox"><div class="row"></div></div>';
        template = '<dl class="col {{className}}" href="' + URL.orderList + '?state={{state}}" tj_category="会员中心" tj_action="{{title}}"><dt><i class="count hide"></i></dt><dd>{{title}}</dd></dl>',
            html = [];
        $('.my-order').append(orderContainer);

        $.each(menu, function (index, item) {
            html.push(bainx.tpl(template, item));
        });
        $('.orderContainer .row').append(html.join(''));


        Data.mineTradeCount().done(function(res){      //获取订单个数
            console.log(res.waitPayCount != 0)
            res.waitPayCount != 0 ?  $('.orderContainer dl').eq(0).find('i').text(res.waitPayCount).removeClass('hide') : '';
            res.waitReceiptCount != 0 ? $('.orderContainer dl').eq(1).find('i').text(res.waitReceiptCount).removeClass('hide') : '';
            res.waitReviewsCount != 0 ?  $('.orderContainer dl').eq(2).find('i').text(res.waitReviewsCount).removeClass('hide') : '';

        })

        $('.order5').attr('href',URL.reqReturnGoodPage);
    }
    /*我的资产*/
    function myCoupon() {
        var menu = [{
                title: '我的红包',
                url: URL.myCoupon
            },
                {
                    title: '我的积分',
                    url: URL.myCoupon + '?mode=point'
                },
                //{
                //    title: '我的钱包',
                //    url: URL.myCoupon + '?mode=wallet'
                //}
            ],
            couponContainer = '<div class="grid couponContainer itemBox"><div class="row"></div></div>';
        template = '<dl class="col" href="{{url}}" tj_category="会员中心" tj_action="{{title}}"><dd>{{title}}</dd></dl>',
            html = [];
        $('.my-coupon').append(couponContainer);
        $.each(menu, function (index, item) {
            html.push(bainx.tpl(template, item));
        });
        $('.couponContainer .row').append(html.join(''));
    }

    /*联系我们*/
    function contactUs() {
        var tel = '<span class="tel" href="tel:' + Common.companyTel + '">' + Common.companyTel + '</span>';
        $('.contactUs .col:first-child').addClass('col-15').removeClass('col-50').append(tel);
        $('.contactUs .col:last-child').addClass('col-3').removeClass('col-50');
    }


    function fetchUserInfo(){
        return Data.fetchMineInfo();
    }

    function renderUserInfo(Page){
        fetchUserInfo().done(function(userInfo){

            userInfo.headPic = userInfo.headPic ? userInfo.headPic : URL.imgPath + '/common/images/avatar-small.png';

            $('.user-nick', Page).html(userInfo.nickName || '用户(' + userInfo.mobile + ')');
            $('.user-info', Page).html(userInfo.nickName);
            $('.face-img', Page).html('<img src="'+ userInfo.headPic +'">');
            //缓存用户头像和昵称
            var obj={
                headPic:userInfo.headPic ? userInfo.headPic : URL.imgPath + '/common/images/avatar-small.png',
                nickName:userInfo.nickName || userInfo.mobile
            }
            localStorage.setItem('userCenterObj',JSON.stringify(obj));

            //if (userInfo.isAgency == 1) {
            //    $('.level', Page).html(userInfo.agencyLevelName).addClass('level' + userInfo.agencyLevelId)
            //} else {
            //    $('.level', Page).hide();
            //    $('.user-info', Page).css('line-height', '50px');
            //}
            htmlLinks(userInfo.isAgency);
            bindEvent(userInfo.isAgency)


            $('[href]').each(function () {
                Common.addPUserId($(this));
            })

            $('.contactUs .tel').attr('href','tel:' + Common.companyTel);


            Common.renderAppBar();
            //Common.isLogin && Cart.ready(); //获取购物车总数

        });
    }

    function bindEvent(isAgency) {
        $('body').on('tap', '.my-profit,.my-invite-ally,.my-ally,.my-marketSpread', function () {
            var target = $(this);
            if (isAgency == 0) {
                $('body').append('<section class="telDialog wl-trans-dialog translate-viewport" style="display: block;"><div class="cont bounceIn"><p>抱歉亲，您还没有成为我们的米酷推广经理，赶紧查看如何加盟成为我们的米酷推广经理吧</p><div class="btngroup"><span class="btn reset">取消</span> <span href="' + URL.makeMoneyHtm + '" tj_category="会员中心" tj_action="{{查看如何成为推广经理}}" class="btn ring">看看咯</span></div></div></section>')
            } else {
                if (target.hasClass('my-profit')) {
                    URL.assign(URL.profitIndex);
                }
                if (target.hasClass('my-invite-ally')) {
                    URL.assign(URL.myInviteAlly);
                }
                if (target.hasClass('my-ally')) {
                    URL.assign(URL.myAllyHtm);
                }
                if (target.hasClass('my-marketSpread')) {
                    URL.assign(URL.marketSpreadPage + '?type=1');
                }
            }
        }).on('tap', '.reset', function () {
            $('.telDialog').remove();
        })


    }


    init();
});