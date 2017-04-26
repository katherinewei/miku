/**
 * 数据
 */
define('h5/js/common/data', [
    'jquery',
    'request',
    'h5/js/common/url',
    'h5/js/common/storage',
    'h5/js/common/waitting'
], function($, Request, URL, WLStorage, Waitting) {

    var LOADINGTEXT = '';

    var ERROR_PROMISE = $.Deferred();
    ERROR_PROMISE.reject();

    var S = {
        fail: function(msg) {
            return function(code, json, piomset, ajax) {
                if (URL.param.session != 'expire') {
                    if (code == 61 && !/indexPage\.htm$/gi.test(location.pathname)) {
                        URL.assign(URL.index + '?session=expire');
                        return;
                    }
                }
                bainx.broadcast(json && json.msg || msg);
            };
        },

        tagItems: function(data) {
            //data = {
            //  tag : bit值 
            //  pg : 页码
            //  sz : 页大小
            //}
            var pomi = Request(URL.tagItems, data).fail(S.fail('获取商品数据失败！'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },

        fetchGiftItem: function() {
            var pomi = Request(URL.fetchGiftItem, null, 1, 1).fail(S.fail('获取新人礼品失败！'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },

        /**
         * 设置用户站点
         */
        setShop: function(position) {

            var data = {};
            if (position) {
                if (position.lat && position.lng && !position.cid) {
                    data = {
                        lat: position.lat,
                        lng: position.lng,
                        addr: encodeURIComponent(JSON.stringify(position))
                    };
                } else if (position.cid) {
                    data = {
                        cid: position.cid,
                        op: 'set',
                        addr: encodeURIComponent(JSON.stringify(position))
                    }
                }
            }

            var pomi = Request(URL.lbsCommunity, data).done(function(res){
                if(res){
                    WLStorage.lbsCommunity.set(res);
                }
            });

            Waitting.show('正在前往站点...', pomi);

            return pomi;
        },

        /**
         * 查找站点信息
         * @return {[type]} [description]
         */
        getShop: function(cid) {
            var data = {
//                op: 'fetch'
                //经纬度 lin
                lng:'113.290526',
                lat:'23.232075'
                //end
            };
            if (cid) {
                data.cid = cid;
            }

            var cshops = WLStorage.lbsCommunity.get();
            if(cshops && !$.isEmptyObject(cshops) || ($.isArray(cshops) && cshops.length)){
                var pomi = $.Deferred();
                pomi.resolve(cshops);
            }else{
//                var pomi = $.Deferred();
                var pomi = Request(URL.lbsCommunity, data).done(function(res){
                    if(res){
                        WLStorage.lbsCommunity.set(res);
                    }
                });
                Waitting.show('正在加载...', pomi);
            }
            return pomi;
        },

        doPay: function(data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var url = URL.hPay;
            if (data.pType == 4) {
                url = URL.wxPay;
            }
            var pomi = Request(url, data, 1, 0).fail(S.fail('支付失败！'));
            Waitting.show('正在支付...', pomi);
            return pomi;
        },

        createOrder: function(data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;

            var pomi = Request(URL.createOrder, data, 1, 0).done(function(res) {
                /*if(window.ga){
                 ga('require', 'ecommerce');
                 ga('ecommerce:addTransaction', {
                 'id': res.tradeId,                     // Transaction ID. Required.
                 'affiliation': 'Acme Clothing',   // Affiliation or store name.
                 'revenue': '11.99',               // Grand Total.
                 'shipping': '5',                  // Shipping.
                 'tax': '1.29'                     // Tax.
                 });
                 }*/
            }).fail(S.fail('创建订单失败！'));
            Waitting.show('正在创建订单...', pomi);
            return pomi;
        },
        confirmOrder: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.confirmOrder, data, 1, 1).fail(S.fail('确认订单失败！'));
            Waitting.show('正在确认订单...', pomi);
            return pomi;
        },


        cancelOrder: function(tid) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.cancelOrder, {
                tradeId: tid
            }, 1, 1).fail(S.fail('取消订单失败！'));
            Waitting.show('正在取消订单...', pomi);
            return pomi;
        },
        sureOrder: function (tid) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.sureOrder, {
                tradeId: tid
            }, 1, 1).fail(S.fail('确认收货失败！'));
            Waitting.show('正在确认收货...', pomi);
            return pomi;
        },

        fetchCouponList: function() {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.fetchCouponList, null, 1, 1).fail(S.fail('获取优惠券列表失败！'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },

        obtainCoupon: function() {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.obtainCoupon, null, 0, 0).fail(S.fail('领取优惠券失败！'));
            Waitting.show('正在抽取...', pomi);
            return pomi;
        },

        fetchCoupon: function() {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.fetchCoupon, null, 1, 1).fail(S.fail('获取优惠券信息失败！'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },

        obtainPoint: function() {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.obtainPoint, null, 1, 0).fail(S.fail('签到失败！'));
            Waitting.show('正在签到...', pomi);
            return pomi;
        },

        /**
         * 获取积分数据
         * @return {[type]} [description]
         */
        fetchPoint: function() {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.fetchPoint, null, 1, 1).fail(S.fail('获取积分数据失败！'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        /**
         *获取我的钱包数据
         *
         */
        getMyWallet: function(data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.getMyWallet, data, 1, 1).fail(S.fail('获取我的钱包数据失败！'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        /**
         * 获取我的盟友
         * @return {[type]} [description]
         */
        //myAlly: function() {
        //    if (!S.checkProfileId()) return ERROR_PROMISE;
        //    var pomi = Request(URL.myAlly, null, 1, 1).fail(S.fail('获取我的盟友数据失败！'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        //allyApply: function() {
        //    if (!S.checkProfileId()) return ERROR_PROMISE;
        //    var pomi = Request(URL.allyApply, null, 1, 1).fail(S.fail('获取我的盟友申请数据失败！'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        //allyList: function(data) {
        //    if (!S.checkProfileId()) return ERROR_PROMISE;
        //    var pomi = Request(URL.allyList, data, 1, 1).fail(S.fail('获取我的盟友列表数据失败！'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        /**
         * 获取积分明细列表
         */
        fetchPointList: function(data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.fetchPointList, data, 1, 1).fail(S.fail('获取积分明细失败！'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },

        /**
         * 关联商品
         * @param  {ID} id 商品ID
         * @return {ajax}    关联商品
         */
        /*relatedItems: function(id) {
         return Request(URL.relatedItems, {
         itemId: id
         }, 1, 1).fail(S.fail('获取关联商品失败！'));
         },*/

        halfActiveSnapshot: function() {
            var pomi = Request(URL.halfActiveSnapshot, null, 1, 1).fail(S.fail('获取特价商品失败！'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },

        getBanner: function(k) {
            var data = {
                k: k,
            };
            if ($.isArray(k)) {
                data.k = k.join(',');
            }
            var pomi = Request(URL.getBanner, data).fail(function() {
                console.log(arguments, '获取页面banner数据失败!');
            });
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },

        wxjssdkParam: function(url) {
            var _url = encodeURIComponent(url);
            //window.confirm(_url);
            var pomi = Request(URL.wxjssdkParam, {
                url: _url
            });
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },

        fetchTradesSum: function() {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.fetchTradesSum).fail(S.fail('获取订单个数失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },


        searchItems: function (data) {
            var pomi = Request(URL.searchItems, data).fail(S.fail('搜索商品失败！'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        itemSearchSuggest: function (query) {
            var pomi = Request(URL.itemSearchSuggest, {query: query}).fail(S.fail(''));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },

        fetchItems: function(data) {
            var pomi = Request(URL.getGoodsList, data, 1, 1).fail(S.fail('获取商品列表失败！'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        fetchBrands: function (data) {
            var pomi = Request(URL.fetchBrands, data, 1, 1).fail(S.fail('获取商品列表失败！'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        fetchItemsInfo: function(ids) {
            var pomi = Request(URL.fetchItemsInfo, {
                ids: ids
            }, 1, 1).fail(S.fail('获取商品信息失败！'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        /*getGoodsList: function(cid) {
         return Request(URL.getGoodsList, {
         cateId: cid
         }, 1, 1).fail(S.fail('获取商品列表失败！'));
         },*/
        /**
         * 绑定手机
         * data{ categoryBannermobile: checkNO: }
         */
        /*synCheckMobile: function(data) {
         return Request(URL.synCheckMobile, data).fail(S.fail('绑定手机失败!'));
         },*/

        fetchUserInfo: function() {
            var pomi = Request(URL.getUserInfo, null, 1, 1).fail(S.fail('获取当前用户信息失败！'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        fetchUser: function() {
            var pomi = Request(URL.fetchUser, null, 1, 1).fail(S.fail('获取当前用户信息失败！'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        fetchMineInfo: function() {
            var pomi = Request(URL.fetchMineInfo, null, 1, 1).fail(S.fail('获取当前用户信息失败！'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        getOrderDetail: function(id) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.getOrderDetail, {
                tradeId: id
            }, 1, 1).fail(S.fail('获取订单详情失败！'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        fetchTrades: function(data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.fetchTrades, data, 1, 1).fail(S.fail('获取订单列表失败！'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        mineTradeCount: function() {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.mineTradeCount).fail(S.fail('获取订单个数失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },

        /*getCommunity: function(cid) {
         return Request(URL.getCommunity, {
         cid: cid
         }, 1, 1).fail(S.fail('获取小区失败！'));
         },*/

        login: function(data) {
            var pomi = Request(URL.login, data, 1, 1).fail(S.fail('登录失败！'));
            Waitting.show('正在登录...', pomi);
            return pomi;
        },
        loginByShop: function(data) {
            var pomi = Request(URL.vCodeLoginByShop, data, 1, 1).fail(S.fail('登录失败！'));
            Waitting.show('正在登录...', pomi);
            return pomi;
        },
        findPswd: function(data) {
            var pomi = Request(URL.findPswd, data, 1, 1).fail(S.fail('更换密码失败！'));
            return pomi;
        },
        register: function(data) {
            var pomi = Request(URL.register, data, 1, 1).fail(S.fail('注册失败！'));
            Waitting.show('正在注册...', pomi);
            return pomi;
        },
        checkMobile: function(mobile,yzmNO) {
            var data = {
                act: 'send',
                yzmNO:yzmNO,
                mobile: mobile
            };
            var pomi = Request(URL.checkMobile, data, 1, 1).fail(S.fail('获取验证码失败！'));
            Waitting.show('正在发送...', pomi);
            return pomi;
        },
        /*getGoodsDetail: function(id) {
         return Request(URL.getGoodsDetail, {
         itemId: id
         }, 1, 1).fail(S.fail('获取商品详情失败！'));
         },*/
        /*syncCart: function(data) {
         if (!S.checkProfileId()) return;
         return Request(URL.addCart, data).fail(S.fail('同步购物车数据失败！'));
         },*/
        //addCart: function(goodsId, count) {
        //    if (!S.checkProfileId()) return ERROR_PROMISE;
        //    var post = JSON.stringify([{
        //        item_id: goodsId,
        //        num: count
        //    }]);
        //    var pomi = Request(URL.addCart, {
        //        items: post
        //    }, 1, 1).fail(S.fail('添加商品到购物车失败！'));
        //    Waitting.show('正在' + (count > 0 ? '放入' : '拿出') + '购物车...', pomi);
        //    return pomi;
        //},
        //deleteCheckedCart: function(post) {
        //    if (!S.checkProfileId()) return ERROR_PROMISE;
        //    var pomi = Request(URL.addCart, {
        //        items: post
        //    }, 1, 1).fail(S.fail('删除商品失败！'));
        //    Waitting.show('正在删除商品', pomi);
        //    return pomi;
        //},
        //getCartItems: function() {
        //    var pomi = Request(URL.getCartItems, null, 1, 1).fail(S.fail('获取购物车详情失败！'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        //fetchCates: function() {
        //    var pomi = Request(URL.fetchCates).fail(S.fail('获取商品类目失败！'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        //categoryBanner: function (data) {
        //    var pomi = Request(URL.categoryBanner, data).fail(S.fail('获取Banner数据失败！'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        //fetchCatesByParams: function (data) {
        //    var pomi = Request(URL.fetchCatesByParams, data).fail(S.fail('获取商品类目失败！'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},


        /**
         * 获取地址列表
         */
        getConsignee: function(id) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var data = {
                    op: 'sel'
                },
                msg = '获取地址列表失败！';
            if (id) {
                data.id = id;
                data.op = 'schs';
                msg = '获取地址信息失败！';
            }
            var pomi = Request(URL.consignee, data, 1, 1).fail(S.fail(msg));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        /**
         * 添加地址
         */
        addConsignee: function(data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            data.op = 'add';
            var pomi = Request(URL.consignee, data, 1, 1).fail(S.fail('添加地址失败！'));
            Waitting.show('正在添加...', pomi);
            return pomi;
        },
        /**
         * 修改地址
         */
        modfiyConsignee: function(data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            data.op = 'u';
            var pomi = Request(URL.consignee, data, 1, 1).fail(S.fail('修改地址失败！'));
            Waitting.show('正在修改...', pomi);
            return pomi;
        },
        /**
         * 删除地址
         */
        delConsignee: function(id) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.consignee, {
                op: 'del',
                id: id
            }, 1, 1).fail(S.fail('删除地址失败！'));
            Waitting.show('正在删除...', pomi);
            return pomi;
        },
        /**
         * 选择地址
         */
        chsConsignee: function(id) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.consignee, {
                op: 'chs',
                id: id
            }, 1, 1).fail(S.fail('选择地址失败！'));
            Waitting.show('正在设置...', pomi);
            return pomi;
        },

        /**
         * 获取默认地址，只在首页确定站点用
         * @return {[type]} [description]
         */
        fetchDefAddr: function() {
            var pomi = Request(URL.fetchDefAddr);
            Waitting.show('正在加载...', pomi);
            return pomi;
        },

        checkActiveOrder: function(ids, daily) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.checkActiveOrder, {
                ids: ids,
                daily: daily
            }, 1, 1).fail(S.fail('抢购失败，请稍候再试！'));
            Waitting.show('正在抢购...', pomi);
            return pomi;
        },

        lbsTrans: function(lat, lng) {
            var pomi = $.Deferred();
            var data = {
                lg: lng,
                lt: lat
            };
            Request(URL.lbsTrans, data).done(function(res) {
                pomi.resolve({
                    lat: res.lt,
                    lng: res.lg,
                    type: 'lbs',
                    trans: 1
                });
            }).fail(function() {
                pomi.resolve({
                    lat: lat,
                    lng: lng,
                    type: 'gps',
                    trans: 1
                });
            });
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },

        //获取分润首页数据
        //profileProfit: function() {
        //    if (!S.checkProfileId()) return ERROR_PROMISE;
        //    var pomi = Request(URL.profileProfit, null, 1, 1).fail(S.fail('获取分润数据失败！'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        //
        ////获取分润明细
        //salesRecordList: function(data) {
        //    if (!S.checkProfileId()) return ERROR_PROMISE;
        //    var pomi = Request(URL.salesRecordList, data, 1, 1).fail(S.fail('获取分润明细数据失败！'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        //
        ////获取提现明细
        //getPayList: function(data) {
        //    if (!S.checkProfileId()) return ERROR_PROMISE;
        //    var pomi = Request(URL.getPayList,data, 1, 1).fail(S.fail('获取提现明细数据失败！'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        //
        ////获取申请提现
        //reqGetPay: function(data) {
        //    if (!S.checkProfileId()) return ERROR_PROMISE;
        //    var pomi = Request(URL.reqGetPay, data, 1, 1).fail(S.fail('提交申请失败！'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        ////获取申请提现
        //getReturnSaleRecordVOList: function (data) {
        //    if (!S.checkProfileId()) return ERROR_PROMISE;
        //    var pomi = Request(URL.getReturnSaleRecordVOList, data, 1, 1).fail(S.fail('获取退款分润记录失败！'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        hasProfileId: function() {
            return pageConfig && (pageConfig.pid && parseInt(pageConfig.pid) > 0);
        },
        checkProfileId: function() {
            return S.hasProfileId() ? true : (URL.assign(URL.loginPage + '?refurl=' + encodeURIComponent(location.href)), false);
        },
        //获取用户是否注册
        checkIsRegister:function(mobile) {
            var data = {
                mobile: mobile
            };
            var pomi = Request(URL.checkIsRegister, data, 1, 1).fail(S.fail('获取用户是否注册失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },

        //获取用户是否关注订阅号
        checkAttention: function (openId) {
            var data = {
                openId: openId
            }
            var pomi = Request(URL.checkAttention, data, 1, 1).fail(S.fail('获取用户是否关注订阅号失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        //获取红包
        receiveRedPacket: function (mobile, openid, parentId) {
            var data = {
                mobile: mobile,
                openid: openid,
                parentId: parentId
            }
            var pomi = Request(URL.receiveRedPacket, data, 1, 1).fail(S.fail('获取用户是否关注订阅号失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        //领取红包
        receiveActiveCoupon: function () {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.receiveActiveCoupon, null, 1, 1).fail(S.fail('领取券失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },

        checkHasRegisterWeiXin: function () {
            var pomi = Request(URL.checkHasRegisterWeiXin, null, 1, 1).fail(S.fail('获取用户是否在微信公众号注册失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },

        //我要赚钱
        //joinAgency: function () {
        //    var pomi = Request(URL.joinAgency, null, 1, 1).fail(S.fail('申请成为代理失败'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        //tradeSumFeeByBuyer: function () {
        //    var pomi = Request(URL.tradeSumFeeByBuyer, null, 1, 1).fail(S.fail('获取消费总额失败'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        //获取系统时间
        getSystemTimes: function () {
            var pomi = Request(URL.getSystemTimes, null, 1, 1).fail(S.fail('获取系统时间失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },


        /**
         * 幸运抽奖--活动
         */


        //幸运抽奖次数
        //lotteryDrawTimes: function () {
        //    if (!S.checkProfileId()) return ERROR_PROMISE;
        //    var pomi = Request(URL.lotteryDrawTimes, null, 1, 1).fail(S.fail('获取幸运抽奖次数失败'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        ////幸运抽奖
        //lotteryDrawMikAtctive: function (data) {
        //    if (!S.checkProfileId()) return ERROR_PROMISE;
        //    var pomi = Request(URL.lotteryDrawMikAtctive, data, 1, 1).fail(S.fail('幸运抽奖失败'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        //
        ////幸运抽奖
        //lotteryDraw: function (data) {
        //    if (!S.checkProfileId()) return ERROR_PROMISE;
        //    var pomi = Request(URL.lotteryDraw, data, 1, 1).fail(S.fail('幸运抽奖失败'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        ////抽奖确认订单
        //confirmLotteryDraw: function (data) {
        //    if (!S.checkProfileId()) return ERROR_PROMISE;
        //    var pomi = Request(URL.confirmLotteryDraw, data, 1, 1).fail(S.fail('获取抽奖确认订单失败'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        ////抽奖下订单
        //lotteryDrawOrder: function (data) {
        //    if (!S.checkProfileId()) return ERROR_PROMISE;
        //    var pomi = Request(URL.lotteryDrawOrder, data, 1, 1).fail(S.fail('获取抽奖下订单失败'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        ////获取领奖列表
        //itemLotteryDrawList: function () {
        //    if (!S.checkProfileId()) return ERROR_PROMISE;
        //    var pomi = Request(URL.itemLotteryDrawList, null, 1, 1).fail(S.fail('获取领奖列表失败'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        ////进入红包摇摇
        //doredPacket: function () {
        //    if (!S.checkProfileId()) return ERROR_PROMISE;
        //    var pomi = Request(URL.doredPacket, null, 1, 1).fail(S.fail('获取红包页面失败'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        ////摇摇动作进行连接对应的接口
        //doredPacketResult: function () {
        //    if (!S.checkProfileId()) return ERROR_PROMISE;
        //    var pomi = Request(URL.doredPacketResult, null, 1, 1).fail(S.fail('摇一摇失败'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        ////摇摇动作结果返回的接口
        //doredPacketGetPay: function (data) {
        //    if (!S.checkProfileId()) return ERROR_PROMISE;
        //    var pomi = Request(URL.doredPacketGetPay, data, 1, 1).fail(S.fail('领奖失败'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        //
        ///**
        // * 颜值测试--活动
        // */
        //
        //faceScore: function (data) {
        //    if (!S.checkProfileId()) return ERROR_PROMISE;
        //    var pomi = Request(URL.faceScore, data, 1, 1).fail(S.fail('获取颜值测试结果失败'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        //faceScoreExchange: function (data) {
        //    if (!S.checkProfileId()) return ERROR_PROMISE;
        //    var pomi = Request(URL.faceScoreExchange, data, 1, 1).fail(S.fail('获取颜值兑换结果失败'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        //faceScoreExchangeList: function (data) {
        //    if (!S.checkProfileId()) return ERROR_PROMISE;
        //    var pomi = Request(URL.faceScoreExchangeList, data, 1, 1).fail(S.fail('获取颜值兑换列表请求失败'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        //
        ///**
        // * 评论
        // */
        //addComments: function (data) {
        //    if (!S.checkProfileId()) return ERROR_PROMISE;
        //    var pomi = Request(URL.addComments, data, 1, 1).fail(S.fail('添加评论请求失败'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        //addCommentsReply: function (data) {
        //    if (!S.checkProfileId()) return ERROR_PROMISE;
        //    var pomi = Request(URL.addCommentsReply, data, 1, 1).fail(S.fail('回复评论请求失败'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        //commentsList: function (data) {
        //    var pomi = Request(URL.commentsList, data, 1, 1).fail(S.fail('评论列表请求失败'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        //commentsReplyList: function (data) {
        //    if (!S.checkProfileId()) return ERROR_PROMISE;
        //    var pomi = Request(URL.commentsReplyList, data, 1, 1).fail(S.fail('获取回复评论列表请求失败'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        //getCommentsCount: function (data) {
        //    var pomi = Request(URL.getCommentsCount, data, 1, 1).fail(S.fail('获取评论统计请求失败'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        //addCommentsPic: function (data) {
        //    if (!S.checkProfileId()) return ERROR_PROMISE;
        //    var pomi = Request(URL.addCommentsPic, data, 1, 1).fail(S.fail('上传评论图片请求失败'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        uploadCommentPic: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.uploadCommentPic, data, 1, 1).fail(S.fail('上传评论图片请求失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        uploadCommentPics: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.uploadCommentPics, data, 1, 1).fail(S.fail('上传评论图片请求失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },

        /**
         * 退货
         */


        getReturnGoodsVOList: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.getReturnGoodsVOList, data, 1, 1).fail(S.fail('获取退货退款列表请求失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },

        confirmReturnGood: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.confirmReturnGood, data, 1, 1).fail(S.fail('确认退货请求失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },

        reqReturnGood: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.reqReturnGood, data, 1, 1).fail(S.fail('申请退货请求失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },

        reqReturnGoodAbnormal: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.reqReturnGoodAbnormal, data, 1, 1).fail(S.fail('异常申请退货请求失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        expressReturnGood: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.expressReturnGood, data, 1, 1).fail(S.fail('退货发快递请求失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },

        /**
         *众筹
         */
        //getCrowdfundList: function (data) {
        //    var pomi = Request(URL.getCrowdfundList, data, 1, 1).fail(S.fail('获取乐享团商品列表请求失败'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        //getCrowdfundInfo: function (data) {
        //    var pomi = Request(URL.getCrowdfundInfo, data, 1, 1).fail(S.fail('获取乐享团商品详情请求失败'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        //getCrowdfundItemList: function (data) {
        //    var pomi = Request(URL.getCrowdfundItemList, data, 1, 1).fail(S.fail('获取乐享团商品列表请求失败'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        //getCrowdfundTradeList: function (data) {
        //    if (!S.checkProfileId()) return ERROR_PROMISE;
        //    var pomi = Request(URL.getCrowdfundTradeList, data, 1, 1).fail(S.fail('获取我的乐享团项目请求失败'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        //crowdfundBanner: function (k,moduleType) {
        //    var data = {
        //        k: k,
        //        moduleType:moduleType
        //    };
        //    if ($.isArray(k)) {
        //        data.k = k.join(',');
        //    }
        //    var pomi = Request(URL.crowdfundBanner, data).fail(S.fail('获取我的乐享团项目请求失败'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        myParentUser: function (data) {
            var pomi = Request(URL.myParentUser, data, 1, 1).fail(S.fail());
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        searchLogisticsCallBack: function (data) {
            var pomi = Request(URL.searchLogisticsCallBack, data, 1, 1).fail(S.fail('获取物流信息请求失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        scratchCard: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.scratchCard, data, 1, 1).fail(S.fail());
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        getMyScratchCardList: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.getMyScratchCardList, data, 1, 1).fail(S.fail());
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        //receiveScanCodeCash: function (data) {
        //    if (!S.checkProfileId()) return ERROR_PROMISE;
        //    var pomi = Request(URL.receiveScanCodeCash, data, 1, 1).fail(S.fail('领取奖品失败'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        //getMyScanCodeCashList: function (data) {
        //    if (!S.checkProfileId()) return ERROR_PROMISE;
        //    var pomi = Request(URL.getMyScanCodeCashList, data, 1, 1).fail(S.fail('获取我的扫码领奖列表失败'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},

        /**
         * 私人定制
         */
        getCsadInfo: function (data) {
            var pomi = Request(URL.getCsadInfo, data, 1, 1).fail(S.fail('获取专家信息请求失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        //调查问卷
        //finalselectBydevQuestions: function (data) {
        //    var pomi = Request(URL.finalselectBydevQuestions, data,1,1).fail(S.fail('获取问卷调查题目请求失败'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        //finalsubmitBydevQuestions: function (data) {
        //    var pomi = Request(URL.finalsubmitBydevQuestions, data,1,1).fail(S.fail('获取问卷调查结果请求失败!'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        //getoneSkinAndItems: function (data) {
        //    var pomi = Request(URL.getoneSkinAndItems, data,1,1).fail(S.fail('获取推荐产品请求失败!'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        //getoneSkinDataByUuid: function (data) {
        //    var pomi = Request(URL.getoneSkinDataByUuid, data,1,1).fail(S.fail());
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        //selectByNewTimeTypeTest: function (data) {
        //    var pomi = Request(URL.selectByNewTimeTypeTest, data,1,1).fail(S.fail());
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        upyunDeleteFile: function (data) {
            var pomi = Request(URL.upyunDeleteFile, data,1,1).fail(S.fail('删除图片请求失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        upYunUploadPicByUrl: function (data) {
            var pomi = Request(URL.upYunUploadPicByUrl, data,1,1).fail(S.fail('上传图片请求失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        upyunBlobDogetpatImgpath: function (data) {
            var pomi = Request(URL.upyunBlobDogetpatImgpath, data,1,1).fail(S.fail('上传图片请求失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        //insertOneSkinReport: function (data) {
        //    var pomi = Request(URL.insertOneSkinReport, data).fail(function() {
        //        console.log(arguments, '提交调查报告失败!');
        //    });
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        //getOneUserReportByrid: function (data) {
        //var pomi = Request(URL.getOneUserReportByrid, data).fail(function() {
        //    console.log(arguments, '查看报告请求失败!');
        //});
        //Waitting.show(LOADINGTEXT, pomi);
        //return pomi;
        //},
        //ineserOneRcordsTogiveParam: function (data) {
        //    var pomi = Request(URL.ineserOneRcordsTogiveParam, data).fail(function() {
        //        console.log(arguments, '开始答题请求失败!');
        //    });
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        insertOneRecordByParams: function (data) {
            var pomi = Request(URL.insertOneRecordByParams, data,1,1).fail(S.fail('新增题目请求失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        //insertOneOtherCRecordByParams: function (data) {
        //    var pomi = Request(URL.insertOneOtherCRecordByParams, data).fail(function() {
        //        console.log(arguments, '提交答案请求失败!');
        //    });
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        //judgeByZjFlag: function (data) {
        //    var pomi = Request(URL.judgeByZjFlag, data).fail(function() {
        //        console.log(arguments, '专家的进入界面的判断!');
        //    });
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        //selectQuestionsByUserId: function (data) {
        //    var pomi = Request(URL.selectQuestionsByUserId, data,1,1).fail(S.fail('用户的进入界面的判断'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        //judgeByZjFlagAndApp: function (data) {
        //    var pomi = Request(URL.judgeByZjFlagAndApp, data).fail(function() {
        //        console.log(arguments, '判断用户是否填完');
        //    });
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        //createMineScBox: function (data) {
        //    var pomi = Request(URL.createMineScBox, data).fail(function() {
        //        console.log(arguments, '生成盒子失败');
        //    });
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        insertOneReportByUserId: function (data) {
            var pomi = Request(URL.insertOneReportByUserId, data,1,1).fail(S.fail('生成报告失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        getOneUserReports: function (data) {
            var pomi = Request(URL.getOneUserReports, data,1,1).fail(S.fail('查看报告请求失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        selectReportDataByBoxId: function (data) {
            var pomi = Request(URL.selectReportDataByBoxId, data,1,1).fail(S.fail('查看报告请求失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        createOrUpdateBox: function (data) {
            var pomi = Request(URL.createOrUpdateBox, data,1,1).fail(S.fail());
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        //createOrUpdateCourse: function (data) {
        //    var pomi = Request(URL.createOrUpdateCourse, data,1,1).fail(S.fail());
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        //createOrUpdatelesson: function (data) {
        //    var pomi = Request(URL.createOrUpdatelesson, data,1,1).fail(S.fail('创建或更新课时失败'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        //createOrUpdateCourseSection: function (data) {
        //    var pomi = Request(URL.createOrUpdateCourseSection, data,1,1).fail(S.fail('创建或更新课程阶段失败'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        //createOrUpdateMineSectionLesson: function (data) {
        //    var pomi = Request(URL.createOrUpdateMineSectionLesson, data,1,1).fail(S.fail('创建或更新课时阶段失败'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        //createOrUpdateMineLessonStep: function (data) {
        //    var pomi = Request(URL.createOrUpdateMineLessonStep, data,1,1).fail(S.fail('创建或更新课时步骤失败'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        //deleteCourse: function (data) {
        //    var pomi = Request(URL.deleteCourse, data,1,1).fail(S.fail('删除课程失败'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        //deleteLesson: function (data) {
        //    var pomi = Request(URL.deleteLesson, data,1,1).fail(S.fail('删除课时失败'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        //deleteCourseSection: function (data) {
        //    var pomi = Request(URL.deleteCourseSection, data,1,1).fail(S.fail('删除课程阶段失败'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        //deleteSectionLesson: function (data) {
        //    var pomi = Request(URL.deleteSectionLesson, data,1,1).fail(S.fail('删除阶段课时关系表失败'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        //deleteLessonStep: function (data) {
        //    var pomi = Request(URL.deleteLessonStep, data,1,1).fail(S.fail('删除课时步骤失败'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        getMineBoxInfo: function (data) {
            var pomi = Request(URL.getMineBoxInfo, data,1,1).fail(S.fail('查找单个盒子失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        //getCourseInfo: function (data) {
        //    var pomi = Request(URL.getCourseInfo, data,1,1).fail(S.fail('查找课程信息失败'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        //getLessonList: function (data) {
        //    var pomi = Request(URL.getLessonList, data,1,1).fail(S.fail('查找课时列表失败'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        //getCourseSectionList: function (data) {
        //    var pomi = Request(URL.getCourseSectionList, data,1,1).fail(S.fail('查找课程阶段列表失败'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        //getLessonStepList: function (data) {
        //    var pomi = Request(URL.getLessonStepList, data,1,1).fail(S.fail('获取课时步骤失败'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        //getNeedUpdateBoxParam: function (data) {
        //    var pomi = Request(URL.getNeedUpdateBoxParam, data,1,1).fail(S.fail('获取需要更新盒子信息值失败'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        //getProblemExpertDbList: function (data) {
        //    var pomi = Request(URL.getProblemExpertDbList, data,1,1).fail(S.fail('获取问题经验库列表失败'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        //getExpertDbList: function (data) {
        //    var pomi = Request(URL.getExpertDbList, data,1,1).fail(S.fail('获取经验库列表失败'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        //getSectionLessonVOList: function (data) {
        //    var pomi = Request(URL.getSectionLessonVOList, data,1,1).fail(S.fail('获取查询阶段课时关系表失败'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        //getLessonVOList: function (data) {
        //    var pomi = Request(URL.getLessonVOList, data,1,1).fail(S.fail('获取课时步骤失败'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        getMineScProductVOList: function (data) {
            var pomi = Request(URL.getMineScProductVOList, data,1,1).fail(S.fail('获取产品失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        //getBoxDetail: function (data) {
        //    var pomi = Request(URL.getBoxDetail, data,1,1).fail(S.fail('获取课程汇总失败'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        //createCourseByTemplate: function (data) {
        //    var pomi = Request(URL.createCourseByTemplate, data,1,1).fail(S.fail('根据模版创建课程失败'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        getMineBoxProductVOList: function (data) {
            var pomi = Request(URL.getMineBoxProductVOList, data,1,1).fail(S.fail('查询私人定制盒子的产品VO列表'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        createOrUpdateMineBoxProduct: function (data) {
            var pomi = Request(URL.createOrUpdateMineBoxProduct, data,1,1).fail(S.fail('创建或更新盒子的定制产品'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        deleteBoxProduct: function (data) {
            var pomi = Request(URL.deleteBoxProduct, data,1,1).fail(S.fail('删除盒子的定制产品'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        updateBoxPrice: function (data) {
            var pomi = Request(URL.updateBoxPrice, data,1,1).fail(S.fail('更新盒子价格失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        //getPublicLessonVOList: function (data) {
        //    var pomi = Request(URL.getPublicLessonVOList, data,1,1).fail(S.fail('获取课时失败'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        getDzHomeCount: function () {
            var pomi = Request(URL.getDzHomeCount, null,1,1).fail(S.fail('获取盒子数量失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        isHavaSnsProfile: function (data) {
            var pomi = Request(URL.isHavaSnsProfile, data,1,1).fail(S.fail('发现入口时判断失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        insertOneSnsProfileRecord: function (data) {
            var pomi = Request(URL.insertOneSnsProfileRecord, data,1,1).fail(S.fail('用户填写基本信息失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        insertOneSnsContentRecord: function (data) {
            var pomi = Request(URL.insertOneSnsContentRecord, data,1,1).fail(S.fail('用户填写基本信息失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        addOneContentPraise: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.addOneContentPraise, data,1,1).fail(S.fail('收藏操作失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        cancelOneContentPraise: function (data) {
            var pomi = Request(URL.cancelOneContentPraise, data,1,1).fail(S.fail('取消收藏操作失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        addOneContentRerfence: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.addOneContentRerfence, data,1,1).fail(S.fail('转载操作失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        selectSnsIndexPage: function (data) {
            var pomi = Request(URL.selectSnsIndexPage, data,1,1).fail(S.fail('获取精选文章失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        seeOneSnsContentDetail: function (data) {
            var pomi = Request(URL.seeOneSnsContentDetail, data,1,1).fail(S.fail('获取精选文章失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        addOneCommentByUsersay: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.addOneCommentByUsersay, data,1,1).fail(S.fail('添加评论失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        selectSnsComentIndexPage: function (data) {
            var pomi = Request(URL.selectSnsComentIndexPage, data,1,1).fail(S.fail('获取评论数据失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        concernOneUserById: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.concernOneUserById, data,1,1).fail(S.fail('用户的关联操作失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        createNewIMUserSingle: function () {
           // if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.createNewIMUserSingle, null,1,1,1).fail(S.fail('创建单个环信用户'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        getUserInfoIM: function (data) {
            var pomi = Request(URL.getUserInfoIM, data,1,1,1).fail(S.fail('获取用户信息失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        //getCourseToStepDetail: function (data) {
        //    var pomi = Request(URL.getCourseToStepDetail, data,1,1).fail(S.fail('获取课程模版信息失败'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        //getOpenCourseVOList: function (data) {
        //    var pomi = Request(URL.getOpenCourseVOList, data,1,1).fail(S.fail('获取课程模版失败'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},

        selectDataByDetectId: function (data) {
            var pomi = Request(URL.selectDataByDetectId, data,1,1).fail(S.fail('获取报告失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        //getOpenCourseVOList: function (data) {
        //    var pomi = Request(URL.getOpenCourseVOList, data,1,1).fail(S.fail('获取课程模版列表失败'));
        //    Waitting.show(LOADINGTEXT, pomi);
        //    return pomi;
        //},
        collectionOneContent: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.collectionOneContent, data,1,1).fail(S.fail('收藏文章失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        cancelcollectionOneContent: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.cancelcollectionOneContent, data,1,1).fail(S.fail('取消收藏失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        createOneContent: function (data) {
            var pomi = Request(URL.createOneContent, data,1,1).fail(S.fail('个人主页数据获取失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        deleteOnePraise: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.deleteOnePraise, data,1,1).fail(S.fail('删除个人评论失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        personalContentPageNext: function (data) {
            var pomi = Request(URL.personalContentPageNext, data,1,1).fail(S.fail('获取我的动态数据失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        personalFansIndexPageContent: function (data) {
            var pomi = Request(URL.personalFansIndexPageContent, data,1,1).fail(S.fail('获取关注粉丝数据失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        createOneCircle: function (data) {
            var pomi = Request(URL.createOneCircle, data,1,1).fail(S.fail('创建圈子失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        selectCircleIndexPage: function (data) {
            var pomi = Request(URL.selectCircleIndexPage, data,1,1).fail(S.fail('获取圈子列表失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        selectMyRelationCircle: function (data) {
            var pomi = Request(URL.selectMyRelationCircle, data,1,1).fail(S.fail('获取圈子列表失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        addOneCircleToBeNumber: function (data) {
            var pomi = Request(URL.addOneCircleToBeNumber, data,1,1).fail(S.fail('关注圈子失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        selemikuSnsRemindInfosByProfileId: function (data) {
            var pomi = Request(URL.selemikuSnsRemindInfosByProfileId, data,1,1).fail(S.fail('获取消息失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        personalCollectedContent: function (data) {
            var pomi = Request(URL.personalCollectedContent, data,1,1).fail(S.fail('获取文章收藏列表失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        selectOneCircleIndexPage: function (data) {
            var pomi = Request(URL.selectOneCircleIndexPage, data,1,1).fail(S.fail('获取圈子基本信息失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        getUseBoxDataInfoinit: function (data) {
            var pomi = Request(URL.getUseBoxDataInfoinit, data,1,1).fail(S.fail('获取盒子列表失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        addOneUserDoUseRecordInfo: function (data) {
            var pomi = Request(URL.addOneUserDoUseRecordInfo, data,1,1).fail(S.fail('新增使用记录失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        selectOneRecordInfoByrId: function (data) {
            var pomi = Request(URL.selectOneRecordInfoByrId, data,1,1).fail(S.fail('查询使用记录，获取盒子列表失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        cancelOneConcernByIds: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.cancelOneConcernByIds, data,1,1).fail(S.fail('取消关注失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },

        /**专家端 pc端*/
        getMineScBoxTradeList: function (data) {
            //if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.getMineScBoxTradeList, data,1,1).fail(S.fail('获取盒子订单列表失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        getMineScBoxTradeCount: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.getMineScBoxTradeCount, data,1,1).fail(S.fail('获取盒子订单统计失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        getBoxTradeCount: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.getBoxTradeCount, data,1,1).fail(S.fail('获取盒子订单统计失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        getBoxChatUserVOList: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.getBoxChatUserVOList, data,1,1).fail(S.fail('获取待回访列表失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        selectoneUserTags: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.selectoneUserTags, data,1,1).fail(S.fail('获取用户便签失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        addOneUserTagInfo: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.addOneUserTagInfo, data,1,1).fail(S.fail('添加用户便签失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        getBoxChatUserCount: function () {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.getBoxChatUserCount, null,1,1).fail(S.fail('获取专家端待回访数失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        mineInfo: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.mineInfo, data,1,1).fail(S.fail('获取用户信息失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        delOneUserTag: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.delOneUserTag, data,1,1).fail(S.fail('删除对应用户便签失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        updateOneUserTag: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.updateOneUserTag, data,1,1).fail(S.fail('更新对应用户便签失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        selectUuserDetectRecordByzjId: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.selectUuserDetectRecordByzjId, data,1,1).fail(S.fail('获取用户分析报告列表失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        selectUserDoRecordPageIndex: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.selectUserDoRecordPageIndex, data,1,1).fail(S.fail('获取用户使用记录列表失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        checkIsExper: function (data) {
           // if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.checkIsExper, data,1,1,1).fail(S.fail('判断是否是专家失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        getOneCsad: function (data) {
            var pomi = Request(URL.getOneCsad, data,1,1,1).fail(S.fail('分配管家失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },

        /*快捷语*/
        addOneShortcuty: function (data) {
            var pomi = Request(URL.addOneShortcuty, data,1,1).fail(S.fail('添加快捷语失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        updateOneShortcuty: function (data) {
            var pomi = Request(URL.updateOneShortcuty, data,1,1).fail(S.fail('更新快捷语失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        deleteOneShortcuty: function (data) {
            var pomi = Request(URL.deleteOneShortcuty, data,1,1,1).fail(S.fail('删除快捷语失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        selectShortcutysByuserId: function (data) {
            var pomi = Request(URL.selectShortcutysByuserId, data,1,1,1).fail(S.fail('查询快捷语失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },

        /*分组**/
        getGroupAndFriendsList: function () {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.getGroupAndFriendsList, null,1,1,1).fail(S.fail('查询好友分组和组内的好友列表失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        getMikuFriendsGroupList: function () {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.getMikuFriendsGroupList, null,1,1).fail(S.fail('查询分组列表失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        createOrEditMikuFriendsGroup: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.createOrEditMikuFriendsGroup, data,1,1).fail(S.fail('添加或者更新好友分组失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        delMikuFriendsGroup: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.delMikuFriendsGroup, data,1,1).fail(S.fail('删除分组失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        modFriendsName: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.modFriendsName, data,1,1).fail(S.fail('修改好友备注失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        changeFriendsGroupMap: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.changeFriendsGroupMap, data,1,1).fail(S.fail('切换好友分组失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        getLastUserDetectDataByUserId: function (data) {
            //if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.getLastUserDetectDataByUserId, data,1,1).fail(S.fail('获取用户答题到哪一步失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        insertOneDetectQuestionData: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.insertOneDetectQuestionData, data,1,1).fail(S.fail('更新数据失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        getDetectRecordDetail: function (data) {
            var pomi = Request(URL.getDetectRecordDetail, data,1,1).fail(S.fail('查询报告失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        getProfileWechatList: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.getProfileWechatList, data,1,1).fail(S.fail('获取微信用户失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        getMineTempQuestionRecordInfo: function (data) {
            if (!S.checkProfileId()) return ERROR_PROMISE;
            var pomi = Request(URL.getMineTempQuestionRecordInfo, data,1,1).fail(S.fail('获取数据失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        createOrUpdateMineTempQuestionRecord: function (data) {
            var pomi = Request(URL.createOrUpdateMineTempQuestionRecord, data,1,1).fail(S.fail('更新报告失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        loginFromPwd: function (data) {
            var pomi = Request(URL.loginFromPwd, data,1,1).fail(S.fail('登录失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        logOut: function () {
            var pomi = Request(URL.logOut, null,1,1).fail(S.fail('退出登录失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        changeOneCsadStatus: function (data) {
            var pomi = Request(URL.changeOneCsadStatus, data,1,1).fail(S.fail('设置状态失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        isEmOnline: function (data) {
            var pomi = Request(URL.isEmOnline, data,1,1,1).fail(S.fail('查看专家状态失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        //匿名聊天
        getTempEmUser: function (data) {
            var pomi = Request(URL.getTempEmUser, data,1,1).fail(S.fail('获取环信临时用户失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        doTempUserToCsadFirst: function (data) {
            var pomi = Request(URL.doTempUserToCsadFirst, data, 1, 1).fail(S.fail('操作对话失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        getRandomOneOnlineCsad: function (data) {
            var pomi = Request(URL.getRandomOneOnlineCsad, data,1,1).fail(S.fail('获取随机一个在线专家失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        tempSaveOneTempRecord: function (data) {
            var pomi = Request(URL.tempSaveOneTempRecord, data,1,1).fail(S.fail('更新匿名调查问卷的内容信息失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        tempfinalUserData: function (data) {
            var pomi = Request(URL.tempfinalUserData, data,1,1).fail(S.fail('查找匿名调查问卷的内容信息失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        tempAddOneDialogData: function (data) {
            var pomi = Request(URL.tempAddOneDialogData, data,1,1).fail(S.fail('操作匿名用户轨迹表数据失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        TempSelectDialogDatasBySessionId: function (data) {
            var pomi = Request(URL.TempSelectDialogDatasBySessionId, data,1,1).fail(S.fail('获取用户轨迹失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        addCsadServiceLog: function (data) {
            var pomi = Request(URL.addCsadServiceLog, data,1,1).fail(S.fail('获取用户轨迹失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        TempIsMyUserByserId: function (data) {
            var pomi = Request(URL.TempIsMyUserByserId, data,1,1).fail(S.fail('获取数据失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        getExpertFaceDbDiretory: function () {
            var pomi = Request(URL.getExpertFaceDbDiretory, null,1,1).fail(S.fail('获取面部字典失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        getExpertBodyDbDiretory: function () {
            var pomi = Request(URL.getExpertBodyDbDiretory, null,1,1).fail(S.fail('获取身体字典失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        getExpertALlEasyDbDiretory: function () {
            var pomi = Request(URL.getExpertALlEasyDbDiretory, null,1,1).fail(S.fail('获取初步诊断的字典失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },TempRandomNumberCount: function () {
            var pomi = Request(URL.TempRandomNumberCount, null,1,1).fail(S.fail('获取用户数失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },

        //匿名聊天喔
        msboardList: function (data) {
            var pomi = Request(URL.msboardList, data,1,1).fail(S.fail('获取留言数据失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        msboardInsert: function (data) {
            var pomi = Request(URL.msboardInsert, data,1,1).fail(S.fail('添加留言失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        msboardDelete: function (data) {
            var pomi = Request(URL.msboardDelete, data,1,1).fail(S.fail('删除留言失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        personalPageContent: function (data) {
            var pomi = Request(URL.personalPageContent, data,1,1).fail(S.fail('获取个人文章失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        stopTalk: function (data) {
            var pomi = Request(URL.stopTalk, data,1,1).fail(S.fail('评价失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        getClientThreeTalkMikuEmGroup: function (data) {
            var pomi = Request(URL.getClientThreeTalkMikuEmGroup, data,1,1).fail(S.fail('获取群组失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },

        //项目
        getxmBannerDetail: function (data) {
            var pomi = Request(URL.getxmBannerDetail, data,1,1).fail(S.fail('获取项目详情失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        upyunBlobDogetpatImgpath: function (data) {
            var pomi = Request(URL.upyunBlobDogetpatImgpath, data,1,1).fail(S.fail('base64返回图片地址失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        //体验店
        nearByShopLocation: function (data) {
            var pomi = Request(URL.nearByShopLocation, data,1,1).fail(S.fail('获取附近店铺失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        getShopById: function (data) {
            var pomi = Request(URL.getShopById, data,1,1).fail(S.fail('获取店铺详情失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        insertOneMikuShopComment: function (data) {
            var pomi = Request(URL.insertOneMikuShopComment, data,1,1).fail(S.fail('新增评论失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        getShopCommentPageIndex: function (data) {
            var pomi = Request(URL.getShopCommentPageIndex, data,1,1).fail(S.fail('获取店铺评论失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        //线下店测肤
        vCodeLogin: function (data) {
            var pomi = Request(URL.vCodeLogin, data,1,1).fail(S.fail('二维码注册登录失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        loginScanQr: function (data) {
            var pomi = Request(URL.loginScanQr, data,1,1).fail(S.fail('根据二维码Uuid登录失败'));
            Waitting.hide();
            return pomi;
        },
        setScanQrStatus: function (data) {
            var pomi = Request(URL.setScanQrStatus, data,1,1).fail(S.fail('设置二维码登录状态失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        createOrUpdateSkinCheckData: function (data) {
            var pomi = Request(URL.createOrUpdateSkinCheckData, data,1,1).fail(S.fail('新增或更新肌肤测试数据失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        getMyMikuSkinCheckData: function (data) {
            var pomi = Request(URL.getMyMikuSkinCheckData, data,1,1).fail(S.fail('获取肌肤测试数据失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        getBoxRecordInfoByBoxId: function (data) {
            var pomi = Request(URL.getBoxRecordInfoByBoxId, data,1,1).fail(S.fail('获取肌护测试报告失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        addOrUpdateUserByExpert: function (data) {
            var pomi = Request(URL.addOrUpdateUserByExpert, data,1,1).fail(S.fail('添加用户失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        getProfileWechatVOList: function (data) {
            var pomi = Request(URL.getProfileWechatVOList, data,1,1).fail(S.fail('获取用户与微信关联列表失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        getWxMpQrCodeTicket: function (data) {
            var pomi = Request(URL.getWxMpQrCodeTicket, data,1,1).fail(S.fail('获得微信二维码ticket失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        checkIsLogin: function () {
            var pomi = Request(URL.checkIsLogin, null,1,1).fail(S.fail('是否登录失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        getExpertWxQrcodeUrl: function (data) {
            var pomi = Request(URL.getExpertWxQrcodeUrl, data,1,1).fail(S.fail('获得专家二维码失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        getExertSkilfulTypeList: function (data) {
            var pomi = Request(URL.getExertSkilfulTypeList, data,1,1).fail(S.fail('获取专家技能类型列表失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        registExpertByExpert: function (data) {
            var pomi = Request(URL.registExpertByExpert, data,1,1).fail(S.fail('添加专家失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        updateExpertByExpert: function (data) {
            var pomi = Request(URL.updateExpertByExpert, data,1,1).fail(S.fail('更新专家信息失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        getExpertList: function (data) {
            var pomi = Request(URL.getExpertList, data,1,1).fail(S.fail('获取专家列表失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        getExpertInfo: function (data) {
            var pomi = Request(URL.getExpertInfo, data,1,1).fail(S.fail('获取专家信息失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        expertDzOrder: function (data) {
            var pomi = Request(URL.expertDzOrder, data,1,1).fail(S.fail('给用户下盒子订单失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        expertUpdateTradeOfflineIsPayed: function (data) {
            var pomi = Request(URL.expertUpdateTradeOfflineIsPayed, data,1,1).fail(S.fail('更新线下订单为已付款状态失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        getWxqrcodeLoginLogVOList: function (data) {
            var pomi = Request(URL.getWxqrcodeLoginLogVOList, data,1,1).fail(S.fail('获取微信二维码登录日志列表失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        getLogisticsList: function (data) {
            var pomi = Request(URL.getLogisticsList, data,1,1).fail(S.fail('获取物流信息失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },

        readWxqrcodeLoginLog: function (data) {
            var pomi = Request(URL.readWxqrcodeLoginLog, data,1,1).fail(S.fail('更新为已读失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        checkScanCodeIsScan: function (data) {
            var pomi = Request(URL.checkScanCodeIsScan, data,1,1).fail(S.fail('检测是否有扫码失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        getNewestBox: function (data) {
            var pomi = Request(URL.getNewestBox, data,1,1).fail(S.fail('获取最新盒子失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        expertUpdateOfflineTrade: function (data) {
            var pomi = Request(URL.expertUpdateOfflineTrade, data,1,1).fail(S.fail('修改订单失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        getEditTradeDataByZjBoxId: function (data) {
            var pomi = Request(URL.getEditTradeDataByZjBoxId, data,1,1,1).fail(S.fail('修改订单失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        expertSetTradeAppointDeliveryTime: function (data) {
            var pomi = Request(URL.expertSetTradeAppointDeliveryTime, data,1,1,1).fail(S.fail('设置延迟发货时间失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        sumTradeBoxPrice:function (data) {
            var pomi = Request(URL.sumTradeBoxPrice, data,1,1).fail(S.fail('获取最新盒子失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        getBoxTradeVOList:function (data) {
            var pomi = Request(URL.getBoxTradeVOList, data,1,1).fail(S.fail('获取最新盒子失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        getWebsitePageWxnoList:function (data) {
            var pomi = Request(URL.getWebsitePageWxnoList, data,1,1).fail(S.fail('获取微信号失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        delWebsitePageWxnoById:function (data) {
            var pomi = Request(URL.delWebsitePageWxnoById, data,1,1).fail(S.fail('删除微信号失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        createOrUpdateWebsitePageWxno:function (data) {
            var pomi = Request(URL.createOrUpdateWebsitePageWxno, data,1,1).fail(S.fail('添加或修改微信号失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        sumTradeBoxPriceYj:function () {
            var pomi = Request(URL.sumTradeBoxPriceYj, null,1,1).fail(S.fail('获取统计数据失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
         },
        getWxCsadInfoVOList:function (data) {
            var pomi = Request(URL.getWxCsadInfoVOList, data,1,1).fail(S.fail('获取专家微信列表失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
        updateWxCasdDoOneDataInfoStatus:function (data) {
            var pomi = Request(URL.updateWxCasdDoOneDataInfoStatus, data,1,1).fail(S.fail('操作微信失败'));
            Waitting.show(LOADINGTEXT, pomi);
            return pomi;
        },
    };

    return S;

});