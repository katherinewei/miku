define('h5/js/widget/page', [
    'jquery',
    'widget',
    'h5/js/common'
], function($, Widget, Global) {




    var COUST = {
        fade: 'fade',
        fadeIn: 'fadeIn',
        fadeOut: 'fadeOut',
        slideFromTop: 'slideInFromTop',
        slideToTop: 'slideOutToTop',
        slideFromLeft: 'slideInFromLeft',
        slideToLeft: 'slideOutToLeft',
        slideFromRight: 'slideInFromRight',
        slideToRight: 'slideOutToRight',
        slideFromBottom: 'slideInFromBottom',
        slideToBottom: 'slideOutToBottom',
        slideTop: 'slideTop',
        slideLeft: 'slideLeft',
        slideRight: 'slideRight',
        slideBottom: 'slideBottom'
    };

    var win = $(window);

    function getClass(className) {
        return '.' + className;
    }

    function toggle(slide, remove, add) {
        this.$(getClass(COUST[slide])).removeClass(COUST[remove]).addClass(COUST[add]);
        return this;
    }

    var REPLACE_IMAGE = 'http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20150210/vNTT-0-1423554790723.png';


    function imageLoader(target, src){

        //console.log(target, target.tagName);

        var img = $('<img />').on('load', function(){
               if(target.tagName === 'IMG') {
                    $(target).attr('src', this.src);
               }else{
                    $(target).empty().append(this);
                    img.off('load');
               }
            }).on('error', function(){
               img.attr('src', src);
            }).on('error').attr('src', Global.imgSrc(src));

        if(target.tagName === 'IMG'){
            $(target).attr('src', REPLACE_IMAGE);
        }

    }

    var Implements = {
        showTop: function() {
            return toggle.call(this, 'slideTop', 'slideToTop', 'slideFromTop');
        },

        hideTop: function() {
            return toggle.call(this, 'slideTop', 'slideFromTop', 'slideToTop');
        },

        showBottom: function() {
            return toggle.call(this, 'slideBottom', 'slideToBottom', 'slideFromBottom');
        },

        hideBottom: function() {
            return toggle.call(this, 'slideBottom', 'slideFromBottom', 'slideToBottom');
        },

        showLeft: function() {
            return toggle.call(this, 'slideLeft', 'slideToLeft', 'slideFromLeft');
        },

        hideLeft: function() {
            return toggle.call(this, 'slideLeft', 'slideFromLeft', 'slideToLeft');
        },

        showRight: function() {
            return toggle.call(this, 'slideRight', 'slideToRight', 'slideFromRight');
        },

        hideRight: function() {
            return toggle.call(this, 'slideRight', 'slideFromRight', 'slideToRight');
        },

        showFade: function() {
            return toggle.call(this, 'fade', 'fadeOut', 'fadeIn');
        },

        hideFade: function() {
            return toggle.call(this, 'fade', 'fadeIn', 'fadeOut');
        },

        showOther: function() {
            var S = this;
            var sender = S.$("[data-toggle]"),
                toggle = sender.data('toggle');
            toggle && sender.removeClass(toggle.hide).addClass(toggle.show);
            return S;
        },

        hideOther: function() {
            var S = this;
            var sender = S.$("[data-toggle]"),
                toggle = sender.data('toggle');
            toggle && sender.removeClass(toggle.show).addClass(toggle.hide);
            return S;
        }
    };


    var Module = Widget.extend({
        attrs: {
            showMode : 'slideInFromBottom',
            hideMode : 'slideOutToBottom',
           
            hideDestroy: true,
            hasLoadImage: false,
            title: '',
            checkInWxp : false,  //检测是不否在微信公众号中
            
            events : {
               'webkitAnimationEnd':function(event){
                    var S = this;
                    if($(event.target).hasClass('page')){
                        setTimeout(function(){
                            S.loadImage(S.$('.page-content .page-scroll-panel'));
                        },0);
                    }
                },
                'webkitAnimationStart':function(event){},
                'webkitAnimationEnd .page-content':function(event){},
                'webkitAnimationEnd footer':function(event){},

            }
        },

        

        setup : function(){
            var S = this,
                //checkInWxp = S.get('checkInWxp'),
                checkUserInfo = S.get('checkUserInfo');
            /*if(!Global.inWeLink && !pageConfig.openid && !localStorage['debug']){
                $('body').append('<div id="must-follow"></div>');
            }*/
            /*if(checkUserInfo && !S.get('userInfo')){
                Global.Data.getUserInfo().done(function(userInfo){
                    console.log(userInfo);
                    S.set('userInfo', userInfo);
                }).fail(function(code){
                    console.log(arguments);
                    if(code === 1){
                        location.href = '/api/h/1.0/bindMobile.htm';
                    }
                });
            }*/
            /*if(S.get('showCartCount')){
                Global.Data.getCartItems().done(function(res){
                    if(res && res.data && res.data.length){
                        S.set('cartCount', res.data.length);
                    }
                });
            }*/
        },

        render: function() {
            var S = this;
            Module.superclass.render.call(this);
            if (S.get('hasLoadImage')) {
                var scrollEle = S.$('.page-content .page-scroll-panel').on('scroll', function(event) {
                    clearTimeout(S.get('scroll-sid'));
                    S.set('scroll-sid', setTimeout(function() {
                        S.loadImage(scrollEle);
                    }, 200));
                });
                setTimeout(function(){
                    S.loadImage(scrollEle);
                },0);
            }
            S.initBanner();
            return S;
        },



        loadImage: function(scrollEle) {
            var S = this;
            var loadheight = Math.floor(win.height());  //scrollEle.scrollTop() + 
            /*S.$('img[data-src]').each(function() {
                var img = $(this);
                if (img.offset().top < loadheight) {
                    img.attr('src', img.data('src')).removeAttr('data-src');
                }
            });*/
            S.$('[data-lazyload-src]').each(function(){
                var target = $(this);
                console.log(target.offset().top, loadheight);
                if(target.offset().top < loadheight){
                    console.log(target.offset().top, loadheight);
                    var src = target.data('lazyload-src');

                    if(this.tagName === 'IMG'){
                        //target.attr('src', Global.imgSrc(src));
                        imageLoader(this, src);

                        if(Global.isDebug){
                            target.parent().css({
                                position: 'relative'
                            }).append('<span style="position: absolute; top:0; left:0; background:#f00; color:#fff;">'+ target.offset().top +'</span>');
                        }
                        
                    }else{
                        /*var loadEventHandle = function(){
                                img.appendTo(target).addClass('fadeIn');
                                img.off('load', loadEventHandle);
                                img.off('error', errorEventHandle);
                            },
                            errorEventHandle = function(){
                                img.attr('src', src);
                            };
                        var img = $('<img class="fade"/>').on('load', loadEventHandle).one('error', errorEventHandle).attr('src', Global.imgSrc(src));*/
                        imageLoader(this, src);
                    }
                    target.removeAttr('data-lazyload-src');
                }
            });
            return S;
        },

        _show: function(pomi) {
            var S = this;
            S.element.removeClass(S.get('hideMode')).addClass(S.get('showMode'));
            setTimeout(function() {
                S.showTop().showRight().showBottom().showLeft().showFade().showOther();
                pomi.resolve(S);
            }, 200);
            return S;
        },

        show: function(){
            var pomi = $.Deferred(),
                S = this;
            try{
                !S.rendered && S.render();
                S.refresh();
                $('#app-bar .active').removeClass('active');
                $('#app-bar .' + S.get('bar') ).parents('.col').addClass('active');
                S._show(pomi);
            }catch(ex){}
            return pomi;
        },

        /**
         * 在实例中覆盖此方法， 在show方法中会调用此方法更新页面
         */
        refresh: function() {
            return this;
        },

        _hide: function(pomi) {
            var S = this;
            S.hideTop().hideRight().hideBottom().hideLeft().hideFade().hideOther();
            setTimeout(function() {
                S && S.element && S.element.removeClass(S.get('showMode')).addClass(S.get('hideMode'));
                pomi && pomi.resolve(S);
            }, 100);
            return S;
        },

        hide: function() {
            var pomi = $.Deferred(),
                S = this;
            S._hide(pomi);
            return pomi;
        },

        initBanner : function(bid){
            var S = this, 
                pomi = $.Deferred(),
                banners = bid ? S.$('[data-banner="'+ bid +'"]') : S.$('[data-banner]');
            if(banners.length){
                var doneFn = function(res){
                    if($.isPlainObject(res.banners)){
                        banners.each(function(){
                            var obj = $(this);
                            var key = obj.data('banner'),
                                siteItems = res.banners[key];
                            if(key && siteItems && siteItems.length){
                                obj.trigger('banner:init', {banners: siteItems});
                            }
                        });
                    }
                };
                var data = [];
                if(bid){
                    data.push(bid);
                }else{
                    banners.each(function(){
                        data.push($(this).data('banner'));
                    });
                }
                Global.Data.getBanner(data).done(doneFn).always(function(){
                    pomi.resolve();
                });
            }
            return pomi;
        },

        getFooter: function() {
            return this.$('footer');
        },

        Implements: Implements
    });

    Module.initBanner = function(ele, banners, template){
        var html = [];
        template = template || Global.Template.banner;
        banners.forEach(function(item, index){
            if(item.redirectType === 311){
                item.href = '/api/h/1.0/detailPage.htm?gid='+item.target;
                item.className = 'goods';
            }else if(item.redirectType === 310){
                item.href = item.target;
                item.className = 'banner';
            }
            html.push(bainx.tpl(template, item));
        });
    };

    return Module;
});
