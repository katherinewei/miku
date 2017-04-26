/**
 * URL 接口
 */
define('h5/js/common/url', function(){

    var SITE = location.protocol + '//' +location.host + (location.port? (':'+location.port) : '');
    console.log(SITE);
    var ROOT = '/api/h/1.0/';
    var HTML = 'http://h.unesmall.com/h5/html/';  //存放静态页面目录
    var imgPath = 'http://unesmall.b0.upaiyun.com/'; //图片存放路径
    var inWeLink = navigator.userAgent.match(/welink/i);
    /*if(inWeLink){
     alert(inWeLink[0]);
     }else{
     alert(navigator.userAgent);
     }*/


    function locationAssign(_url, replace){
        //alert(_url);
//        console.log(inWeLink);

        if(inWeLink){
            var url = new bainx.Uri(_url);
            var cart = /cartPage\.htm$/i,
                login = /vLoginPage\.htm$/i,
                detail = /detailPage\.htm$/i,
                placeOrder = /placeOrder\.htm$/i,
                userCenter = /userCenter\.htm$/i,
                listPage = /listPage\.htm$/i,
                myCoupon = /myCoupon\.htm$/i,
                profitIndex = /profitIndex\.htm$/i,
                questionnaireSurveyResultPage=/questionnaireSurveyResultPage\.htm$/i;

            if(cart.test(url.path)){
                console.log('APP 实现并跳转到购物车页面， app://cart')
                location.href = "app://cart";
            }else if(login.test(url.path)){
                var refurl = url.query.get('refurl');
                console.log('APP 实现并跳转到登录页面， app://login?data='+encodeURIComponent(JSON.stringify({
                        refurl : refurl
                    })));
                location.href = "app://login?data="+ encodeURIComponent(JSON.stringify({
                        refurl : refurl
                    }));
            }else if(detail.test(url.path)){
                var data = encodeURIComponent(JSON.stringify({
                    itemId : url.query.get('gid')
                }));
                console.log('APP 实现并跳转到商品详情页面，app://detail?data='+data);
                location.href = "app://detail?data="+data;
            }else if(questionnaireSurveyResultPage.test(url.path)){
                var data = encodeURIComponent(JSON.stringify({
                    uid : url.query.get('uid')
                }));
                console.log('APP 实现并跳转到专家详情页面，app://questionnaireSurveyResultPage?data='+data);
                location.href = "app://questionnaireSurveyResultPage?data="+data;
            }else if(placeOrder.test(url.path)){
                var itemId = url.query.get('gid'),
                    count = url.query.get('count'),
                    items = [],
                    data = '';
                if(itemId && count){
                    data = encodeURIComponent(JSON.stringify({items:[{
                        itemId : itemId,
                        count : count
                    }]}));
                }else if(url.query.get('goods')){
                    var goods = url.query.get('goods')+'',
                        items = [];
                    goods = goods.split(';');
                    if(goods.length){
                        $.each(goods,function(index, item){
                            var tmp = item.split(',');
                            if(tmp.length == 2){
                                items.push({
                                    itemId:tmp[0],
                                    count:tmp[1]
                                });
                            }
                        });
                        if(items.length){
                            var data = {
                                items : items
                            };
                            if(url.query.get('from')){
                                data.from = url.query.get('from');
                            }
                            data = encodeURIComponent(JSON.stringify(items));
                        }
                    }
                }

                if(data){
                    console.log('APP 实现并跳转到下单确认页面，app://confirmOrder?data='+data);
                    location.href = 'app://confirmOrder?data='+data;
                }else{
                    console.log('APP 实现并跳转到下单确认页面，app://confirmOrder?data='+encodeURIComponent(JSON.stringify({
                            fromCart : true
                        })));
                    location.href = 'app://confirmOrder?data='+encodeURIComponent(JSON.stringify({
                            fromCart : true
                        }));
                }
            }else if(userCenter.test(url.path)){
                console.log('APP 实现并跳转到个人中心页面，app://personal');
                location.href = "app://personal";
            }else if(profitIndex.test(url.path)){
                console.log('APP 实现并跳转到分润中心页面，app://profitIndex');
                location.href = "app://profitIndex";
            }else if(listPage.test(url.path)){

                var data = {
                    brandId : url.query.get('brandId'),
                    cid : url.query.get('cid')
                };
                data = encodeURIComponent(JSON.stringify(data));
                location.href = "app://listPage?data="+data;
            }else if(myCoupon.test(url.path)){
                var data = {
                    mode: url.query.get('mode')
                };
                data = encodeURIComponent(JSON.stringify(data));
                location.href = "app://myCoupon?data="+data;
            }else{
                if(replace){
                    location.replace(_url);
                }else{
                    location.href = _url;
                }
            }
        }else{
            if(replace){
                location.replace(_url);
            }else{
                location.href = _url;
            }
        }
    }




    var URL = {
        assign : locationAssign,
        site : SITE,
        root : ROOT,
        param: bainx.getQueryParam(),
        imgPath:imgPath,

        index :             ROOT + 'indexPage.htm',
        userCenter :        ROOT + 'userCenter.htm', //会员中心

        alipayDrawboard:    ROOT + 'alipayDrawboard.htm',           //微信支付页面
        wxPay:              ROOT + 'hwxPay.json',
        hPay:               ROOT + 'hPay.json',

        createOrder:        ROOT + 'hOrder.json',                   //创建订单
        placeOrder: ROOT + 'placeOrder.htm',                //确认订单
        cancelOrder:        ROOT + 'cancelOrder.json',              //取消订单
        sureOrder:          ROOT + 'sureOrder.json',                  //确认收货
        orderDetail:        ROOT + 'orderDetail.htm',               //订单详情
        fetchCouponList:    ROOT + 'fetchCouponList.json',          //优惠券列表
        obtainCoupon:       ROOT + 'obtainCoupon.json',             //领优惠券
        fetchCoupon:        ROOT + 'fetchCoupon.json',              //优惠券状态
        obtainPoint:        ROOT + 'obtainPoint.json',              //领积分
        fetchPointList:     ROOT + 'fetchPointList.json',           //获取积分明细
        fetchPoint:         ROOT + 'fetchPoint.json',               //获取积分总数，签到数据
        getMyWallet:        ROOT + 'getMyWallet.json',               //获取我的钱包数据
        myPoint:            ROOT + 'myPoint.htm',                     //签到页面

        lbsCommunity:       ROOT + 'lbsCommunity.json',             //定位站点

        loginPage :         ROOT + 'vLoginPage.htm',                //登录页面
        login:              ROOT + 'vCodeLogin.json',               //登录
        vCodeLoginByShop:   ROOT + 'vCodeLoginByShop.json',               //登录。绑定商家
        findPswd:           ROOT + 'findPswd.json',               //修改密码


        /**
         * 订单
         * form="cart" 确认订单
         */
        orderList:          ROOT + 'orderList.htm',                 //我的订单
        confirmOrder:       ROOT + 'confirmOrder.json',             //确认订单
        relatedItems:       ROOT + 'relatedItems.json',             //关联商品
        halfActiveSnapshot: ROOT + 'halfActiveSnapshot.json',       //半价活动
        fetchCommunity :    ROOT + 'fetchCommunity.json',           //自提点
        getBanner:          ROOT + 'homeBanner.json',               //页面banner
        lbsTrans :          ROOT + 'lbsTrans.json',                 //GPS坐标转高德坐标
        wxjssdkParam :      ROOT + 'hjsApiParams.json',             //获取微信JS-SDK,config时所需要的参数
        checkActiveOrder:   ROOT + 'checkActiveOrder.json',          //检查是是否参加过活动
        bindMobile :        ROOT + 'bindMobile.htm',                //绑定手机的页面
        fetchTradesSum:     ROOT + 'fetchTradesSum.json',            //获取订单个数接口
        synCheckMobile:     ROOT + 'synCheckMobile.json',            //绑定手机号码

        getOrderDetail :    ROOT + 'fetchTrade.json',                //获取订单详情
        fetchTrades :       ROOT + 'fetchTrades.json',               //获取订单列表
        mineTradeCount:     ROOT + 'mineTradeCount.json',               //我的订单统计
        getCartItems :      ROOT + 'oCartItems.json',                //获取购物车详情
        getUserInfo :       ROOT + 'fetchUser.json',                 //获取用户信息
        //login :             ROOT + 'login.json',                     //登录
        logout :            ROOT + 'logOut.json',                    //退出
        register :          ROOT + 'register.json',                  //注册
        fetchPub :          ROOT + 'fetchPub.json',                  //获取RSA公钥
        checkMobile :       ROOT + 'checkMobile.json',               //发送验证码

        getStoresAddress:   ROOT + 'fetchCommunity.json',            //自提点
        /**
         * 收货地址相关操作
         * consignee.json
         * 参数：
         *     op 操作类型
         *         更新传递u
         *         添加传递add
         *         删除传递 del
         *         查询所有操作地址传递 sel
         *         选择该收获地址 chs
         *     id 要更新或者删除的id
         *     mobile 收货地址收件人电话
         *     nick 收货人
         *     addr 收货地址信息 例子 值为：
         *     {
         *           "addcode":   "330110",
         *           "address":   "多少号啊",
         *           "addrgeo":   "xxx",
         *           "city":      "杭州市",
         *           "citycode":  "0571",
         *           "distance":  123,
         *           "district":  "余杭区",
         *           "latitude":  "12.245523",
         *           "longitude": "32.344321",
         *           "name":      "dfad",
         *           "pcode":     "24",
         *           "postcode":  "310000",
         *           "province":  "浙江省",
         *           "tel":       "12",
         *           "type":      "type here",
         *           "uid":       "ioidlfldl81892"
         *       }
         */
        /*
         * 收货地址
         */
        consignee :         ROOT + 'consignee.json',                  //收货地址操作
        fetchDefAddr:       ROOT + 'fetchDefAddr.json',                 //默认地址
        address:            ROOT + 'address.htm',                       //收货地址


        /*
         * 我的分润
         */
        //profitHelp:         HTML + 'profit-help.html?type=1',                //帮助页面
        //profitIndex:        ROOT + 'profit.htm',                    //首页
        //profileProfit:      ROOT + 'profileProfit.json',            //首页数据
        //reqGetPayHtm:       ROOT + 'reqGetPay.htm',                //申请提现页面
        //reqGetPay:          ROOT + 'reqGetPay.json',                //申请提现数据
        //getPayListHtm:      ROOT + 'getPayList.htm',               //提现明细页面
        //getPayList:         ROOT + 'getPayList.json',               //提现明细数据
        //salesRecordListHtm: ROOT + 'salesRecordList.htm',          //代理分润记录页面
        //salesRecordList:    ROOT + 'salesRecordList.json',          //代理分润记录数据
        //
        //getReturnSaleRecordVOList: ROOT + 'getReturnSaleRecordVOList.json', //退款分润记录
        //returnSaleRecord: ROOT + 'returnSaleRecord.htm', //退款分润记录


        /**
         * 我的盟友
         */
        //myAllyHtm:                  ROOT + 'myAlly.htm',                //我的盟友首页
        //myAlly:                     ROOT + 'myAlly.json',                //我的盟友首页数据
        //allyExamineAttention: HTML + 'allyExamineAttention.html?type=1',  //盟友审核注意事项
        ////allyApply :               ROOT + 'allyApply.json',
        //allyList: ROOT + 'myInOrDirectAlly.json',       //我的盟友列表数据
        //myInOrDirectAlly: ROOT + 'myInOrDirectAlly.htm',       //我的盟友列表页面
        //myInviteAlly: ROOT + 'inviteAlly.htm',       //邀请盟友
        //myInviteAllyQr: ROOT + 'inviteAllyQrPage.htm',       //二维码邀请
        /*
         * 我的积分
         */
        myPoint:                    ROOT + 'myPoint.htm',       //我的积分
        pointRule: HTML + 'point-guide.html?type=1', //积分规则

        /*
         * 我的红包
         */
        myCoupon:                   ROOT + 'myCoupon.htm',       //我的红包
        receiveActiveCoupon:        ROOT + 'receiveActiveCoupon.json', //领取红包

        redPacketHtm: ROOT + 'redPacket.htm',           //全场通用红包
        checkIsRegister: ROOT + 'checkIsRegister.json',  //是否注册
        checkAttention: ROOT + 'getWxUserByOpenid.json',  //是否关注订阅号
        receiveRedPacketHtm: ROOT + 'receiveRedPacketPage.htm',//领取红包页面
        checkHasRegisterWeiXin: ROOT + 'checkHasRegisterWeiXin.json',  //判断用户是否在微信公众号注册
        howtoAttention: HTML + 'howtoAttention.html?type=1',  //如何关注公众号

        /*
         *我要赚钱
         */
        //makeMoneyHtm: ROOT + 'makeMoneyPage.htm',       //我要赚钱
        //joinAgency: ROOT + 'joinAgency.json',           //申请成为代理
        //tradeSumFeeByBuyer: ROOT + 'tradeSumFeeByBuyer.json',  //消费总额接口

        /**
         *联系我们
         */
        contactUsHtm: ROOT + 'contactUsPage.htm?type=1',       //联系我们

        /**
         * 关于我们
         */
        aboutUsHtm: HTML + 'aboutUs.html',       //关于我们
        /**
         *招商
         */
        //businessDepartmentHtm: HTML + 'businessDepartment.html',       //招商
        //
        //hActiveHtm: ROOT + 'hActive.htm',       //活动页面
        //getSystemTimes:ROOT + 'getSystemTimes.json',   //获取系统时间
        //customizationHtm: ROOT + 'customizationPage.htm?type=1',       //私人定制页面
        //crowdfundHtm: ROOT + 'crowdfundPage.htm?type=1',       //众筹页面
        //faqHtm: HTML + 'faq.html?type=1',//售后问答


        /**
         * 幸运抽奖--活动
         */
        lotteryDrawTimes:  ROOT  + 'lotteryDrawTimes.json',   //抽奖次数接口
        lotteryDraw:  ROOT  + 'lotteryDraw.json',   //抽奖接口
        confirmLotteryDrawHtm:  HTML  + 'confirmLotteryDraw.htm',   //抽奖确认订单接口
        confirmLotteryDraw:  ROOT  + 'confirmLotteryDraw.json',   //抽奖确认订单接口
        lotteryDrawOrder:  ROOT  + 'lotteryDrawOrder.json',   //抽奖下订单接口
        lotteryOrder:  ROOT  + 'lotteryOrder.htm',   //抽奖下订单页面
        itemLotteryDrawList: ROOT + 'itemLotteryDrawList.json',  //领奖接口
        lottery :ROOT  + 'lottery.htm', //抽奖页面

        lotteryDrawMikAtctive:ROOT + 'lotteryDrawMikAtctive.json',

        /**
         * 摇一摇
         */
        //doredPacket: ROOT + 'doredpacket.json',   //进入红包摇摇
        //doredPacketResult: ROOT + 'doredpacketresult.json',   //摇摇动作进行连接对应的接口
        //doredPacketGetPay: ROOT + 'doredpacketgetpay.json',   //摇摇动作结果返回的接口

        /**
         * 个人中心
         */
        fetchUser: ROOT + 'mine.json',  //个人中心接口
        fetchMineInfo:ROOT + 'mineInfo.json',  //个人中心接口,查的信息少一点

        uploadUserQrCode: ROOT + 'uploadUserQrCode.json',   //图片上传接口

        qualityAssuranceHtm: HTML + 'qualityAssurance.html?type=1', //正品保证


        /**
         * 颜值测试
         */
        //faceScore: ROOT + 'faceScore.json',    //颜值测试
        //faceScoreExchange: ROOT + 'faceScoreExchange.json',    //颜值测试兑换
        //faceScoreExchangeList: ROOT + 'faceScoreExchangeList.json',  //颜值排行榜
        //faceScoreTest: ROOT + 'faceScoreTest.htm',    //颜值测试

        /**
         * 下载链接
         */
        downloadHtm: HTML + 'download.html',
        downloadLinkHtm: HTML + 'downloadLink.html',

        /**
         *评论
         */
        //itemCommentsPage: ROOT + 'itemCommentsPage.htm',  //添加评论页面
        //addComments: ROOT + 'addComments.json',         //添加评论
        //addCommentsReply: ROOT + 'addCommentsReply.json',         //回复评论
        //commentsList: ROOT + 'commentsList.json',         //评论列表
        //commentsReplyList: ROOT + 'commentsReplyList.json',         //回复评论列表
        //getCommentsCount: ROOT + 'getCommentsCount.json',        //评论统计
        //addCommentsPic: ROOT + 'addCommentsPic.json',        //评论上传单张图片
        //uploadCommentPic: ROOT + 'uploadCommentPic.json',        //评论上传多张图片
        //uploadCommentPics: ROOT + 'uploadCommentPics.json',        //评论上传多张图片
        //wordOfMouthPage:ROOT +'wordOfMouthPage.htm',        //全部口碑

        /**
         * 退货
         */

        getReturnGoodsVOList: ROOT + 'getReturnGoodsVOList.json',     //获取全部退货退款列表(包括可退货和退货列表)
        confirmReturnGood: ROOT + 'confirmReturnGood.json',         //确认退货
        reqReturnGood: ROOT + 'reqReturnGood.json',         //申请退货
        reqReturnGoodAbnormal: ROOT + 'reqReturnGoodAbnormal.json',         //异常申请退货
        expressReturnGood: ROOT + 'expressReturnGood.json',         //退货发快递(退货中)
        returnPolicy: HTML + 'returnPolicy.html?type=1',       //退货政策
        reqReturnGoodPage: ROOT + 'reqReturnGoodPage.htm',       //退货列表
        returnGoodFlowPage: ROOT + 'returnGoodFlowPage.htm',       //退货流程
        uploadReturnGoodsPic:ROOT + 'uploadReturnGoodsPic.json',   //退货申请上传图片

        /**
         * 众筹
         */
        //getCrowdfundList:ROOT + 'getCrowdfundList.json',   //众筹列表
        //getCrowdfundInfo:ROOT + 'getCrowdfundInfo.json',   //众筹详情
        //getCrowdfundItemList:ROOT + 'getCrowdfundItemList.json',   //众筹详情我要支持页
        //getCrowdfundTradeList:ROOT + 'getCrowdfundTradeList.json',   //我的项目
        //crowdfundHomePage:ROOT + 'crowdfundHomePage.htm',   //众筹首页
        //crowdfundInfoPage:ROOT + 'crowdfundInfoPage.htm',   //众筹详情
        //crowdfundItemListPage:ROOT + 'crowdfundItemListPage.htm',   //我要支持页
        //crowdfundPaymentPage:ROOT + 'crowdfundPaymentPage.htm',   //支付页
        //mineCrowdfundPage:ROOT + 'mineCrowdfundPage.htm',   //我的项目
        //crowdfundListPage:ROOT + 'crowdfundListPage.htm',   //新品排行
        //crowdfundBanner:ROOT + 'crowdfundBanner.json',   //获取众筹banner数据

        //buyForJoinAgencyPage:ROOT + 'buyForJoinAgencyPage.htm',  //购买99礼包成为代理
        payResult : ROOT + 'payResultPage.htm',//支付结果页面
        //joinAgencySuccess:ROOT + 'joinAgencySuccessPage.htm',//成功成为代理的页面
        //howToView: HTML + 'howToView.html?type=1',//支付宝到账查看
        //beJoinAgencyGift  :ROOT + 'beJoinAgencyGift.htm',  //如何成为推广经理
        //
        //marketSpreadPage: ROOT + 'marketSpreadPage.htm',//营销推广页面,
        //posterSpreadPage: ROOT + 'posterSpreadPage.htm',//海报推广页面,
        //inviteSpreadMangerPage: ROOT + 'inviteSpreadMangerPage.htm', //邀请成为推广经理
        //receiveInviteSpreadMangerPage: ROOT + 'receiveInviteSpreadMangerPage.htm',//邀请成为推广经理接收
        //howToMakeMoney:HTML + 'howToMakeMoney.html?type=1',         //如何赚钱
        //
        //mbhyymszcPage: ROOT + 'mbhyymszcPage.htm',//美博会一元秒杀页面
        //concernWeixin:'http://mp.weixin.qq.com/s?__biz=MzIxNTIxNTQzOA==&mid=403685351&idx=1&sn=3c885e6ab6cff8ae66872d6d8ab49784#rd',  //关注微信公众号
        //myParentUser:ROOT + 'myParentUser.json',  //是否有上级

        /**
         * 物流信息
         **/
        logisticsInfoPage:ROOT + 'logisticsInfoPage.htm?type=1',//物流信息
        searchLogisticsCallBack : ROOT + 'searchLogisticsCallBack.json', //物流信息

        /**
         * 刮刮卡
         */
        //scratchCard:            ROOT + 'scratchCard.json',//刮刮卡兑奖
        //getMyScratchCardList:   ROOT + 'getMyScratchCardList.json',//刮刮卡兑奖列表
        //
        //activeTopicPage:        ROOT + 'activeTopicPage.htm?isApp=1',

        /*扫码*/
        //receiveScanCodeCash:    ROOT+'receiveScanCodeCash.json',//用户扫码
        //getMyScanCodeCashList:  ROOT+'getMyScanCodeCashList.json',//获取我的扫码列表
        receiveScanCodeCash:    ROOT+'receiveScanCodeCash.json',//用户扫码
        getMyScanCodeCashList:  ROOT+'getMyScanCodeCashList.json',//获取我的扫码列表

        //二维码接口
        qrUrl:                  ROOT + 'qrUrl.json?url=',

        /**
         * 私人定制
         */
        getCsadInfo:            ROOT + 'getCsadInfo.json',      //专家信息
        questionnaireSurveyResultPage:ROOT + 'questionnaireSurveyResultPage.htm',//问卷调查结果
        finalselectBydevQuestions: ROOT + 'finalselectBydevQuestions.json',//答题并提交答案与获取下一题
        finalsubmitBydevQuestions:ROOT + 'finalsubmitBydevQuestions.json',//答最后一题并得出问卷的结果
        getoneSkinAndItems:ROOT + 'getoneSkinAndItems.json',//推荐产品
        getoneSkinDataByUuid:ROOT + 'getoneSkinDataByUuid.json',//根据uuid来获取问卷陈述
        questionnaireSurveyReportPage: ROOT + 'questionnaireSurveyReportPage.htm',//问卷报告
        selectByNewTimeTypeTest:ROOT+'selectByNewTimeTypeTest.json',//测肤数据
        questionnaireSurveyPage: ROOT + 'questionnaireSurveyPage.htm',//问卷报告
        upYunUploadPics:ROOT + 'upYunUploadPics.json',//upyun评论上传多张图片
        upYunUploadPic:ROOT + 'upYunUploadPic.json',//upyun评论上传单张图片
        upyunBlobDogetpatImgpath:ROOT + 'upyunBlobDogetpatImgpath.json',//upyun上传单张图片根据Base64字符串
        upyunDeleteFile:ROOT + 'upyunDeleteFile.json',//upyun删除单张图片
        upYunUploadPicByUrl:ROOT + 'upYunUploadPicByUrl.json',//upyun根据url上传单张图片
        insertOneSkinReport:ROOT + 'insertOneSkinReport.json',//调查报告的提交
        userReportPage:ROOT + 'userReportPage.htm',//用户报告
        //getOneUserReportByrid:ROOT + 'getOneUserReportByrid.json',//查看报告
        //ineserOneRcordsTogiveParam:ROOT + 'ineserOneRcordsTogiveParam.json',//开始答题
        insertOneRecordByParams:ROOT + 'insertOneRecordByParams.json',//新增题目
        //insertOneOtherCRecordByParams:ROOT + 'insertOneOtherCRecordByParams.json',//细节问题
        //judgeByZjFlag:ROOT+'judgeByZjFlag.json',//专家的进入界面的判断
        selectQuestionsByUserId:ROOT + 'selectQuestionsByUserId.json',//用户的进入界面的判断
        judgeByZjFlagAndApp:ROOT + 'judgeByZjFlagAndApp.json',//用户是否填完的判断
        //createMineScBox:ROOT + 'createMineScBox.json',//生成盒子
        insertOneReportByUserId:ROOT + 'insertOneReportByUserId.json',//生成报告
        getOneUserReports:ROOT + 'getOneUserReports.json',//生成报告
        selectReportDataByBoxId:ROOT + 'selectReportDataByBoxId.json',//根据盒子id查看报告
        createMineBoxPage:ROOT + 'createMineBoxPage.htm',//生成盒子页面
        createOrUpdateBox:ROOT + 'createOrUpdateBox.json',//创建盒子或更新盒子
        createOrUpdateCourse:ROOT + 'createOrUpdateCourse.json',//创建课程或更新课程
        createOrUpdatelesson:ROOT + 'createOrUpdatelesson.json',//3、创建或更新课时
        createOrUpdateCourseSection:ROOT + 'createOrUpdateCourseSection.json',//4、创建或更新课程阶段
        createOrUpdateMineSectionLesson:ROOT + 'createOrUpdateMineSectionLesson.json',//5、创建或更新课程阶段课时关系表
        createOrUpdateMineLessonStep:ROOT + 'createOrUpdateMineLessonStep.json',//6、创建或更新课时步骤
        //deleteCourse:ROOT + 'deleteCourse.json',//7、删除课程
        //deleteLesson:ROOT + 'deleteLesson.json',//删除课时
        //deleteCourseSection:ROOT + 'deleteCourseSection.json',//删除课程阶段
        //deleteSectionLesson:ROOT + 'deleteSectionLesson.json',//删除阶段课时关系表
        //deleteLessonStep:ROOT + 'deleteLessonStep.json',//删除课时步骤
        getMineBoxInfo:ROOT + 'getMineBoxInfo.json',//查找单个盒子
        //getCourseInfo:ROOT + 'getCourseInfo.json',//查找课程信息
        //getLessonList:ROOT + 'getLessonList.json',//查找课时列表
        //getCourseSectionList:ROOT + 'getCourseSectionList.json',//查找课程阶段列表
        //getLessonStepList:ROOT + 'getLessonStepList.json',//获取课时步骤
        //getNeedUpdateBoxParam:ROOT + 'getNeedUpdateBoxParam.json',//获取需要更新盒子信息值
        //getProblemExpertDbList:ROOT + 'getProblemExpertDbList.json',//获取问题经验库列表
        //getExpertDbList:ROOT + 'getExpertDbList.json',//获取经验库列表
        //getSectionLessonVOList:ROOT + 'getSectionLessonVOList.json',//查询阶段课时关系表
        //getLessonVOList:ROOT +'getLessonVOList.json',//查询课时步骤
        getMineScProductVOList:ROOT + 'getMineScProductVOList.json',//查询私人定制产品VO列表
        //getBoxDetail:ROOT+'getBoxDetail.json',//获取课程汇总
        createNewIMUserSingle:ROOT + 'createNewIMUserSingle.json',//创建单个环信用户
        getUserInfoIM:ROOT+'getEmUserInfo.json',//获取环信用户信息
        //getCourseToStepDetail:ROOT+'getCourseToStepDetail.json',//获取从课程到阶段课时步骤详情
        //selectDataByDetectId:ROOT+'selectDataByDetectId.json',//根据报告id查报告
        //getOpenCourseVOList:ROOT + 'getOpenCourseVOList.json',//获取课程模版
        //collectionOneContent:ROOT + 'collectionOneContent.json',//获取课程模版

        /*盒子*/
        createCourseByTemplate:ROOT + 'createCourseByTemplate.json',//根据模版创建课程
        getMineBoxProductVOList:ROOT + 'getMineBoxProductVOList.json',//查询私人定制盒子的产品VO列表
        createOrUpdateMineBoxProduct:ROOT + 'createOrUpdateMineBoxProduct.json',//创建或更新盒子的定制产品
        deleteBoxProduct:ROOT + 'deleteBoxProduct.json',//删除盒子的定制产品
        updateBoxPrice:ROOT + 'updateBoxPrice.json',//更新盒子价格信息值
        getPublicLessonVOList:ROOT + 'getPublicLessonVOList.json',//获取公共课时信息
        getDzHomeCount:ROOT + 'getDzHomeCount.json',//获取盒子&课程统计数据


        /**
         * 发现
         */
        isHavaSnsProfile:ROOT + 'isHavaSnsProfile.json',//进入发现入口时的判断
        insertOneSnsProfileRecord:ROOT + 'insertOneSnsProfileRecord.json',//填写用户的基本信息
        insertOneSnsContentRecord:ROOT + 'insertOneSnsContentRecord.json',//用户填写自己发现的内容
        discoverPage:ROOT + 'discoverPage.htm',//发现首页
        addOneContentPraise:ROOT + 'addOneContentPraise.json',//发现点赞
        cancelOneContentPraise:ROOT + 'cancelOneContentPraise.json',//发现取消点赞
        addOneContentRerfence:ROOT + 'addOneContentRerfence.json',//转载
        selectSnsIndexPage:ROOT + 'selectSnsIndexPage.json',//发现首页分页列表
        seeOneSnsContentDetail:ROOT + 'seeOneSnsContentDetail.json',//发现首页分页列
        addOneCommentByUsersay:ROOT + 'addOneCommentByUsersay.json',//发现首页分页列表
        selectSnsComentIndexPage:ROOT + 'selectSnsComentIndexPage.json',//发现首页分页列表
        concernOneUserById:ROOT + 'concernOneUserById.json',//进行对用户的关联操作
        cancelcollectionOneContent:ROOT + 'cancelcollectionOneContent.json',//取消收藏
        createOneContent:ROOT + 'createOneContent.json',//进入个人主页初始化
        deleteOnePraise:ROOT + 'deleteOnePraise.json',//删除个人评价
        personalContentPageNext:ROOT + 'personalContentPageNext.json',//个人主页我的动态
        discoverPersonalCenterPage:ROOT + 'discoverPersonalCenterPage.htm',//发现个人中心页collectionArticleListPage
        personalFansIndexPageContent:ROOT + 'personalFansIndexPageContent.json',//关注列表
        focusListPage:ROOT + 'focusListPage.htm',//关注页面
        fansListPage:ROOT + 'fansListPage.htm',//粉丝页面
        createOneCircle:ROOT + 'createOneCircle.json',//关注列表
        selectCircleIndexPage:ROOT + 'selectCircleIndexPage.json',//圈子列表
        selectMyRelationCircle:ROOT + 'selectMyRelationCircle.json',//个人圈子列表
        addOneCircleToBeNumber:ROOT + 'addOneCircleToBeNumber.json',//关注一个圈子
        selemikuSnsRemindInfosByProfileId:ROOT + 'selemikuSnsRemindInfosByProfileId.json',//消息列表
        personalCollectedContent:ROOT + 'personalCollectedContent.json',//文章收藏列表
        collectionArticleListPage:ROOT + 'collectionArticleListPage.htm',//发现个人收藏页面
        circleDetailPage:ROOT + 'circleDetailPage.htm',//圈子详情
        selectOneCircleIndexPage:ROOT + 'selectOneCircleIndexPage.json',//文章收藏列表
        articleInfoPage:ROOT + 'articleInfoPage.htm',//文章详情
        articleFocusListPage:ROOT + 'articleFocusListPage.htm',//对应关注人的文章列表
        cancelOneConcernByIds:ROOT + 'cancelOneConcernByIds.json',//取消个人关注



        getUseBoxDataInfoinit:ROOT + 'getUseBoxDataInfoinit.json',//盒子列表表
        addOneUserDoUseRecordInfo:ROOT + 'addOneUserDoUseRecordInfo.json',//增加使用记录
        selectOneRecordInfoByrId:ROOT + 'selectOneRecordInfoByrId.json',//查询对应的盒子内容和列表使用记录
        addBoxRecodePage:ROOT + 'addBoxRecodePage.htm',//增加盒子记录
        editBoxRecodePage:ROOT + 'editBoxRecodePage.htm',//增加盒子记录


        /**专家端 pc端*/
        expertDetailPage:ROOT + 'expertDetailPage.htm',//专家详情
        csadPage : ROOT + 'csadPage.htm',//专家端页面
        csadCallCenterPage : ROOT + 'csadCallCenterPage.htm',// 呼叫中心 页面
        csadChatMessagePage : ROOT + 'csadChatMessagePage.htm',//聊天消息页面
        csadManagementListPage : ROOT + 'csadManagementListPage.htm',// 管理列表 页面
        csadSalesTrackingPage : ROOT + 'csadSalesTrackingPage.htm',//销售追踪页面
        csadHoneymoonReturnPage : ROOT + 'csadHoneymoonReturnPage.htm',// 蜜月回访 页面
        getMineScBoxTradeList : ROOT + 'getMineScBoxTradeList.json',//.获取盒子订单列表
        getMineScBoxTradeCount : ROOT + 'getMineScBoxTradeCount.json',//.盒子订单统计
        getBoxTradeCount:ROOT + 'getBoxTradeCount.json',//获取盒子订单统计

        getBoxChatUserVOList : ROOT + 'getBoxChatUserVOList.json',//.待回访列表
        selectoneUserTags : ROOT + 'selectoneUserTags.json',//.查询对应用户便签
        addOneUserTagInfo : ROOT + 'addOneUserTagInfo.json',//.添加用户便签
        getBoxChatUserCount : ROOT + 'getBoxChatUserCount.json',//.统计专家端待聊天数
        mineInfo : ROOT + 'mineInfo.json',//.获取用户信息
        delOneUserTag : ROOT + 'delOneUserTag.json',//.删除对应的用户便签
        updateOneUserTag : ROOT + 'updateOneUserTag.json',//.更新对应的用户便签
        selectUuserDetectRecordByzjId : ROOT + 'selectUuserDetectRecordByzjId.json',//.获取用户分析报告列表
        selectUserDoRecordPageIndex : ROOT + 'selectUserDoRecordPageIndex.json',//.获取用户使用记录列表
        checkIsExper:ROOT + 'checkIsExper.json',//判断是否是专家
        getOneCsad:ROOT + 'getOneCsad.json',//分配管家

        //专家端快捷语
        addOneShortcuty:ROOT + 'addOneShortcuty.json',//添加对应的快捷语
        updateOneShortcuty:ROOT + 'updateOneShortcuty.json',//更新对应的快捷语
        deleteOneShortcuty:ROOT + 'deleteOneShortcuty.json',//删除对应的快捷语
        selectShortcutysByuserId:ROOT + 'selectShortcutysByuserId.json',//查询对应用户的快捷语

        /*
        * 分组*/
        getGroupAndFriendsList:ROOT+'getGroupAndFriendsList.json',//查询好友分组和组内的好友列表
        getMikuFriendsGroupList:ROOT+'getMikuFriendsGroupList.json',//查询分组列表
        createOrEditMikuFriendsGroup:ROOT+'createOrEditMikuFriendsGroup.json',//添加或者更新好友分组
        delMikuFriendsGroup:ROOT+'delMikuFriendsGroup.json',//删除分组
        modFriendsName:ROOT+'modFriendsName.json',//修改好友备注
        changeFriendsGroupMap:ROOT+'changeFriendsGroupMap.json',//切换好友分组

        /*问卷 &报告*/
        getLastUserDetectDataByUserId:ROOT + 'getLastUserDetectDataByUserId.json',//进行查看对应的用户的数据答到哪一步的状态
        insertOneDetectQuestionData:ROOT + 'insertOneDetectQuestionData.json',//添加[更新]调查问卷的内容信息
        getDetectRecordDetail:ROOT + 'getDetectRecordDetail.json',//根据对应的id来查询对应的报告的详情
        skinCheckReportPage:ROOT + 'skinCheckReportPage.htm',//打印分析报告
        getProfileWechatList:ROOT + 'getProfileWechatList.json',//查询微信用户列表
        getMineTempQuestionRecordInfo:ROOT + 'getMineTempQuestionRecordInfo.json',//获取临时分析报告info
        createOrUpdateMineTempQuestionRecord:ROOT + 'createOrUpdateMineTempQuestionRecord.json',//更新或增加临时分析报告


        /*登录 &&登出，*/
        loginFromPwd:ROOT + 'login.json',//登录  用密码
        logOut:ROOT + 'logOut.json',//登出
        loginPageCsad:ROOT + 'loginPage.htm',//

        /*设置专家在线状态*/
        changeOneCsadStatus:ROOT+'changeOneCsadStatus.json',//设置专家在线状态
        isEmOnline:ROOT+'isEmOnline.json',//查看专家在线状态

        //匿名聊天
        getTempEmUser:ROOT + 'getTempEmUser.json',//获取随机用户
        doTempUserToCsadFirst:ROOT + 'doTempUserToCsadFirst.json',//操作进行开始与结束对话接口
        getRandomOneOnlineCsad:ROOT + 'getRandomOneOnlineCsad.json',//获取随机专家
        tempSaveOneTempRecord:ROOT + 'tempSaveOneTempRecord.json',//添加[更新]匿名调查问卷的内容信息
        tempfinalUserData:ROOT + 'tempfinalUserData.json',//查找对应匿名调查问卷内容[获取最后一条数据,根据对应的时间来进行排序
        tempAddOneDialogData:ROOT + 'tempAddOneDialogData.json',//操作匿名用户轨迹表数据:每次进行请求连接登录的时候
        TempSelectDialogDatasBySessionId:ROOT + 'TempSelectDialogDatasBySessionId.json',//根据对应的匿名用户的sessionId来进行获取对应用户轨迹
        addCsadServiceLog:ROOT + 'addCsadServiceLog.json',//插入用户聊天日志
        TempIsMyUserByserId:ROOT + 'TempIsMyUserByserId.json',//证明用户是不是我的匿名用户
        getExpertFaceDbDiretory:ROOT + 'getExpertFaceDbDiretory.json',//面部字典
        getExpertBodyDbDiretory:ROOT + 'getExpertBodyDbDiretory.json',//身体字典
        getExpertALlEasyDbDiretory:ROOT + 'getExpertALlEasyDbDiretory.json',//初步诊断的字典
        msboardList:ROOT + 'msboardList.json',//留言列表
        msboardInsert:ROOT + 'msboardInsert.json',//添加留言
        msboardDelete:ROOT + 'msboardDelete.json',//删除留言
        personalPageContent:ROOT + 'personalPageContent.json',//个人文章列表
        anonymousChatPage:ROOT + 'anonymousChatPage.htm',//匿名聊天
        stopTalk:ROOT + 'stopTalk.json',//评价专家
        TempRandomNumberCount:ROOT + 'TempRandomNumberCount.json',//获取您是多少位用户

        /*3人聊天*/
        getClientThreeTalkMikuEmGroup:ROOT + 'getClientThreeTalkMikuEmGroup.json',//3人聊天

        /**/
        getxmBannerDetail:ROOT + 'getxmBannerDetail.json',//获取项目详情
        getXmDetail:ROOT + 'getXmDetailPage.htm',//项目详情页面
        boxDetailPage:ROOT + 'boxDetailPage.htm',//盒子详情页
        buyedBoxListPage:ROOT + 'buyedBoxListPage.htm',//盒护肤盒子页

        //体验店
        nearByShopLocation:ROOT + 'nearByShopLocation.json',//查看附近商店的信息
        getShopById:ROOT + 'getShopById.json',//根据对应的shopId来查询的对应对应商店的详情
        insertOneMikuShopComment:ROOT + 'insertOneMikuShopComment.json',//新增一条对商店的评论
        getShopCommentPageIndex:ROOT + 'getShopCommentPageIndex.json',//根据对应的页码来获取对应的评论的列表的详情
        experienceShopListPage:ROOT + 'experienceShopListPage.htm',//查看附近商店的信息
        experienceShopDetailPage:ROOT + 'experienceShopDetailPage.htm',//详情
        experienceShopCommentPage:ROOT + 'experienceShopCommentPage.htm',//评论
        addExperienceShopCommentPage:ROOT + 'addExperienceShopCommentPage.htm',//添加评论

        //线下店测肤
        vCodeLogin:ROOT + 'vCodeLogin.json',//二维码Uuid注册或登录
        loginScanQr:ROOT + 'loginScanQr.json',//根据二维码Uuid登录
        setScanQrStatus:ROOT + 'setScanQrStatus.json',//设置二维码的登录状态
        createOrUpdateSkinCheckData:ROOT + 'createOrUpdateSkinCheckData.json',//新增或更新肌肤测试数据
        getMyMikuSkinCheckData:ROOT + 'getMyMikuSkinCheckData.json',//获取肌肤测试数据
        skinUserInfoPage:ROOT + 'skinUserInfoPage.htm',//测肤基本信息
        scanQrLoginPage:ROOT + 'scanQrLoginPage.htm',//登录页面
        qrCodeLoginTipPage:ROOT + 'qrCodeLoginTipPage.htm',//确认登录状态页面
        skinCheckedPage:ROOT + 'skinCheckedPage.htm',//皮肤测试页面
        skinPicComparePage:ROOT + 'skinPicComparePage.htm',//皮肤对比页面
        createQrCodeLoginPage:ROOT + 'createQrCodeLoginPage.htm',//二维码生成页面
        upyunBlobDogetpatImgpath:ROOT + 'upyunBlobDogetpatImgpath.json',//base64返回图片地址
        getBoxRecordInfoByBoxId:ROOT + 'getBoxRecordInfoByBoxId.json',//获取肌护测试报告数据



        //新版本11.14
        addOrUpdateUserByExpert:ROOT +'addOrUpdateUserByExpert.json',//专家添加用户
        getProfileWechatVOList:ROOT + 'getXcxUserWeChatVOList.json',//获取用户与微信关联列表
        getWxMpQrCodeTicket:ROOT + 'getWxMpQrCodeTicket.json',//获得微信二维码ticket
        expertWxQrcodePage:ROOT + 'expertWxQrcodePage.htm',//专家二维码
        checkIsLogin:ROOT + 'checkIsLogin.json',//判断是否登录
        getExpertWxQrcodeUrl:ROOT + 'getExpertWxQrcodeUrl.json',//获取专家微信二维码
        getExertSkilfulTypeList:ROOT + 'getExertSkilfulTypeList.json',//获取专家技能类型列表
        registExpertByExpert:ROOT + 'registExpertByExpert.json',//专家添加专家
        updateExpertByExpert:ROOT + 'updateExpertByExpert.json',//更新专家信息
        getExpertList:ROOT + 'getExpertList.json',//获取专家列表
        expertRegisterPage:ROOT + 'expertRegisterPage.htm',//添加或更新专家
        getExpertInfo:ROOT + 'getExpertInfo.json',//获取专家信息
        expertDzOrder:ROOT + 'expertDzOrder.json',//专家给用户下盒子订单
        expertUpdateTradeOfflineIsPayed:ROOT + 'expertUpdateTradeOfflineIsPayed.json',//专家更新线下订单为已付款
        getWxqrcodeLoginLogVOList:ROOT + 'getWxqrcodeLoginLogVOList.json',//获取微信二维码登录日志列表VO
        getLogisticsList:ROOT + 'getLogisticsList.json',//获取物流信息
        readWxqrcodeLoginLog:ROOT + 'readWxqrcodeLoginLog.json',//更新扫描二维码微信登录日志为已读
        checkScanCodeIsScan:ROOT + 'checkScanCodeIsScan.json',//检测是否有扫码
        getNewestBox:ROOT + 'getNewestBox.json',//最新盒子id未下单
        appCsadPage:ROOT + 'appCsadPage.htm',//app专家端
        expertUpdateOfflineTrade:ROOT + 'expertUpdateOfflineTrade.json',//更改订单信息
        getEditTradeDataByZjBoxId:ROOT + 'getEditTradeDataByZjBoxId.json',//根据对应的盒子来查找对应的订单详情内容值
        expertSetTradeAppointDeliveryTime:ROOT + 'expertSetTradeAppointDeliveryTime.json',//设置延时发货时间




        //业绩查询
        sumTradeBoxPrice:ROOT + 'sumTradeBoxPrice.json',//统计订单盒子的价格
        getBoxTradeVOList:ROOT + 'getBoxTradeVOList.json',//统计订单盒子的价格
        sumTradeBoxPriceYj:ROOT+ 'sumTradeBoxPriceYj.json',//统计盒子订单销售业绩

        //设置网页微信号以及概率
        getWebsitePageWxnoList:ROOT + 'getWebsitePageWxnoList.json',//查询
        delWebsitePageWxnoById:ROOT + 'delWebsitePageWxnoById.json',//删除
        createOrUpdateWebsitePageWxno:ROOT + 'createOrUpdateWebsitePageWxno.json',//添加或修改
        websitePageWxnoPage:ROOT + 'websitePageWxnoPage.htm',//

        //绑定微信
        getWxCsadInfoVOList:ROOT + 'getWxCsadInfoVOList.json',//获取专家微信列表VO
        updateWxCasdDoOneDataInfoStatus:ROOT + 'updateWxCasdDoOneDataInfoStatus.json',//解绑&绑定

    };

    return URL;
});
