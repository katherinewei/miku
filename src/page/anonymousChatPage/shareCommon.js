/**
 * Created by Spades-k on 2016/9/14.
 */
define('h5/js/page/shareCommon', [
], function() {

    //分享模板
    function defineShareModel(){
        var tem='<section class="screenW"><div class="subW"><div class="info"><div class="shareBox"><h2>请选择您的分享方式：</h2><div class="bdsharebuttonbox bdshare-button-style0-16"><a href="#" class="bds_qzone" data-cmd="qzone" title="分享到QQ空间">QQ空间</a><a href="#" class="bds_tsina" data-cmd="tsina" title="分享到新浪微博">新浪微博</a><a href="#" class="bds_sqq" data-cmd="sqq" title="分享到QQ好友">QQ</a><a href="#" class="bds_weixin" data-cmd="weixin" title="分享到微信">微信</a></div><div class="bdsharebuttonbox bdshare-button-style0-16"><a href="#" onclick="return false;" class="popup_more" data-cmd="more"></a></div></div></div><div class="close">关闭</div></div></section>';

        $('body').append(tem);

    }

    function shareFn(){
        var goodsDetail = {
            node: {
                closeBtn: $('.close'),
                screenW: $('.screenW'),
                subW: $('.subW'),
                //share: $('#share'),
                shareBox: $('.shareBox')
            },
            /*入口*/
            init: function() {
                var self = this;
                self.closeTap();
                //self.shareTap();
            },
            ///*分享点击弹窗*/
            //shareTap: function() {
            //    var self = this;
            //    self.node.share.on('tap', function() {
            //        self.wShow();
            //        self.node.shareBox.show().siblings().hide();
            //    });
            //},
            /*点击关闭弹窗*/
            closeTap: function() {
                var self = this;
                self.node.closeBtn.on('tap', function() {
                    self.wHide();
                });
            },
            ///*窗口显示*/
            //wShow: function() {
            //    var self = this;
            //    self.node.screenW.show();
            //    self.node.subW.addClass('move').removeClass('back');
            //},
            /*窗口隐藏*/
            wHide: function() {
                var self = this;
                self.node.subW.addClass('back').removeClass('move');
                setTimeout(function() {
                    self.node.screenW.hide();
                }, 500);
            }
        };
        /*商品js入口*/
        goodsDetail.init();

        /*百度分享js*/
        window._bd_share_config = {
            "common": {
                onBeforeClick:setShareC
            },
            "share": {},
            "selectShare": {
                "bdContainerClass": null,
                "bdSelectMiniList": ["qzone", "tsina", "sqq", "weixin"]
            }
        };

        document.body.appendChild(document.createElement('script')).src = 'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion=' + ~(-new Date() / 36e5);
    }

    function setShareC(cmd, config) {
        var shareArr=JSON.parse(sessionStorage.getItem('shareArr'));
        if (shareArr) {
            config.bdUrl = shareArr[0];
            config.bdText = shareArr[1];
            config.bdDesc = shareArr[2];
            config.bdPic = shareArr[3];
        }
        return config;
    }

    return{
        defineShareModel:defineShareModel,
        shareFn:shareFn
    }

})