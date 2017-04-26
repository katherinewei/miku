define('h5/js/common/weixin', [
    'jquery',
    'jweixin',
    'h5/js/common/data',
    'h5/js/common/waitting',
    'h5/js/common/url'
], function($, WxJSDK, Data,  Waitting,URL) {

    var debug = URL.param.debug,
        inWeixin = navigator.userAgent.match(/micromessenger/i);

    function SDK(url) {
        this.url = url;
        this.apiList = [
            'getLocation', 'getNetworkType', 'chooseWXPay', 'chooseImage',
            'onMenuShareTimeline', 'onMenuShareAppMessage', 'scanQRCode',
            'onMenuShareQQ', 'onMenuShareWeibo', 'hideMenuItems', 'showMenuItems'
        ];
        this.debug = debug ? debug : false; //true;
        SDK.Map[url] = this;
        this._promise = $.Deferred();
        this._promise.promise(this);
    }
    SDK.prototype.ready = function(callback) {
        var S = this;
        S.done(callback);
        if (!S._ready) {
            if (inWeixin) {
                var pomi = Data.wxjssdkParam(S.url).done(function(res) {
                    console.log(res);
                    var conf = $.extend({
                        beta:true,
                        debug: S.debug,//S.debug
                        jsApiList: S.apiList
                    }, res);
                    //alert('config weixin jsdk:'+JSON.stringify(conf));

                    //Waitting.show('正在Config微信JSDK', S._promise);
                    WxJSDK.config(conf);
                    WxJSDK.ready(function() {
                        //alert('wx.ready');
                        S._promise.resolve() //'wx jsdk ready:'+ S.url);
                    });
                    WxJSDK.error(function(res) {
                        //alert('wx.ready:error'+ JSON.stringify(res));
                        S._promise.reject(arguments);
                    });
                }).fail(function() {
                    S._promise.reject(arguments);
                });

            } else {
                S._promise.reject() //resolve()//'wx jsdk ready:'+ S.url);
            }
            //Waitting.show('正在获取Config微信JSDK参数', pomi);
            S._ready = true;
        }
        return S;
    };

    SDK.Map = {};
    SDK.init = function() {
        var url = location.href.split('#')[0];
        var sdk = SDK.Map[url];
        if (!sdk) {
            //alert('init new sdk config:'+url);
            sdk = new SDK(url);
        }
        return sdk;
    };

    SDK.getNetworkType = function() {
        var pomi = $.Deferred();
        var S = SDK.init();
        S.ready(function() {
            WxJSDK.getNetworkType({
                success: function(res) {
                    pomi.resolve(res.networkType);
                }
            });
        });
        return pomi.promise();
    };

    SDK.share = function (options, optionsTimeline) {
        var pomi = $.Deferred();
        if (inWeixin) {
            var S = SDK.init();
            S.ready(function() {
                var shareOption = {
                    title: '米酷', // 分享标题
                    desc: '网上购物，就上米酷', // 分享描述
                    link: URL.site + URL.index, // 分享链接
                    type: 'link', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    imgUrl: '', // 分享图标
                    success: function() {
                        // 用户确认分享后执行的回调函数
                        console.log('用户已分享');
                        //alert('分享成功!');
                        pomi.resolve();
                    },
                    cancel: function() {
                        // 用户取消分享后执行的回调函数
                        console.log('用户取消分享');
                        //alert('取消分享!');
                        bainx.broadcast('已取消');
                        pomi.reject('cancel');
                    },
                    fail: function() {
                        //alert('分享失败!');
                        pomi.reject('fail');
                        bainx.broadcast('分享失败!');
                    }
                };

                var shareOptionTimeline = {
                    title: '米酷', // 分享标题
                    link: URL.site + URL.index, // 分享链接
                    imgUrl: '', // 分享图标
                    success: function () {
                        // 用户确认分享后执行的回调函数
                        console.log('用户已分享');
                        //alert('分享成功!');
                        pomi.resolve();
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                        console.log('用户取消分享');
                        //alert('取消分享!');
                        bainx.broadcast('已取消');
                        pomi.reject('cancel');
                    },
                    fail: function () {
                        //alert('分享失败!');
                        pomi.reject('fail');
                        bainx.broadcast('分享失败!');
                    }
                };

                options && $.extend(shareOption, options);
                optionsTimeline && $.extend(shareOptionTimeline, optionsTimeline);

                WxJSDK.onMenuShareAppMessage(shareOption);
                //WxJSDK.onMenuShareTimeline(shareOption);
                WxJSDK.onMenuShareTimeline(shareOptionTimeline);
                WxJSDK.onMenuShareQQ(shareOption);
                WxJSDK.onMenuShareWeibo(shareOption);
            });
        } else {
            pomi.resolve();
        }
        return pomi.promise();
    };

    SDK.getLocation = function() {
        var pomi = $.Deferred();
        var S = SDK.init();
        setTimeout(function() {
            pomi.reject({
                timeout: true
            });
        }, 5000);
        S.ready(function() {
            WxJSDK.getLocation({
                timestamp: 0, // 位置签名时间戳，仅当需要兼容6.0.2版本之前时提供
                nonceStr: '', // 位置签名随机串，仅当需要兼容6.0.2版本之前时提供
                addrSign: '', // 位置签名，仅当需要兼容6.0.2版本之前时提供，详见附录4
                success: function(res) {
                    // var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                    // var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                    // var speed = res.speed; // 速度，以米/每秒计
                    // var accuracy = res.accuracy; // 位置精度
                    pomi.resolve(res);
                },
                fail: function() {
                    //白云区M3创意园 lin 2015-1027    失败设置默认地址
                    var res = {"longitude":113.284052,'latitude':23.225904};
                    pomi.resolve(res);
                    
                    ///  pomi.reject();  //注释掉 lin
                }
            });
        });
        Waitting.show('正在微信定位', pomi);
        return pomi.promise();
    };

    SDK.pay = function(data) {
        var pomi = $.Deferred();
        var S = SDK.init();
        //alert('SDK:'+ JSON.stringify(S));
        S.ready(function() {

            Waitting.show('正在获取微信支付参数', Data.doPay(data).done(function(res) {
                //alert('微信支付参数：'+JSON.stringify(res));
                Waitting.show('等待唤起微信支付', pomi);
                WxJSDK.chooseWXPay({
                    timestamp: res.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。
                    // 但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                    nonceStr: res.nonceStr, // 支付签名随机串，不长于 32 位
                    package: res.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                    signType: res.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                    paySign: res.paySign, // 支付签名
                    success: function(res) {
                        // 支付成功后的回调函数
                        debug && alert('微信支付成功！');
                        pomi.resolve(res);
                    },
                    fail: function(res) {
                        debug && alert('微信支付失败！');
                        // 支付失败后回调函数
                        pomi.reject('fail', res);
                    },
                    cancel: function(res) {
                        debug && alert('微信支付取消！');
                        pomi.reject('cancel', res);
                    }
                });
            }).fail(function(code, json) {
                pomi.reject(json && json || '获取支付参数失败！');
            }));
        });
        Waitting.show('正在微信支付', pomi);
        return pomi.promise();
    };

    SDK.hideMenuItems = function(menuList) {
        var pomi = $.Deferred();
        var S = SDK.init();
        var items = menuList || [
            "menuItem:share:appMessage", //发送给朋友
            "menuItem:share:timeline", //分享到朋友圈
            "menuItem:share:qq", //分享到QQ
            "menuItem:share:weiboApp", //分享到Weibo
            "menuItem:share:facebook", //分享到FB
            "menuItem:share:QZone", //分享到 QQ 空间
            "menuItem:readMode",//阅读模式
            "menuItem:openWithQQBrowser",//在QQ浏览器中打开
            "menuItem:openWithSafari",//在Safari中打开
            "menuItem:share:email",//邮件
            "menuItem:share:brand",//一些特殊公众号
            "menuItem:favorite", //收藏
            "menuItem:originPage",//原网页
            "menuItem:share:facebook", //分享到FB
            "menuItem:editTag",//编辑标签 
            "menuItem:delete",//删除
            //"menuItem:copyUrl" //复制链接
        ];
        S.ready(function() {
            WxJSDK.hideMenuItems({
                menuList: items, // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                success: function(res) {
                    pomi.resolve();
                },
                fail: function(res) {
                    pomi.reject();
                }
            });
            //alert('hide menu items:'+ JSON.stringify(items));
        });
        return pomi.promise();
    };
    
    SDK.showMenuItems = function(menuList) {
        var pomi = $.Deferred();
        var S = SDK.init();
        var items = menuList || [
            "menuItem:share:appMessage", //发送给朋友
            "menuItem:share:timeline", //分享到朋友圈
            "menuItem:share:qq", //分享到QQ
            "menuItem:share:weiboApp", //分享到Weibo
            "menuItem:share:facebook", //分享到FB
            "menuItem:share:QZone", //分享到 QQ 空间

        ];
      
        S.ready(function() {
            WxJSDK.showMenuItems({
                menuList: items, // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                success: function(res) {
                  
                    pomi.resolve();
                },
                fail: function(res) {
                   
                    pomi.reject();
                }
            });
            //alert('hide menu items:'+ JSON.stringify(items));
        });
        return pomi.promise();
    };

    SDK.scanQRCode = function () {
        var pomi = $.Deferred(),
            S = SDK.init();

        S.ready(function () {
            WxJSDK.scanQRCode({
                needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                success: function (res) {
                    //var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                    //alert(result);
                    pomi.resolve(res);
                }
            });
        });
        return pomi.promise();
    };



    SDK.chooseImage = function () {
        var pomi = $.Deferred(),
            S = SDK.init();

        S.ready(function () {

            WxJSDK.chooseImage({
                success: function (res) {
                    pomi.resolve(res);
                }
            });
        });
        return pomi.promise();
    };







    return SDK;
});
