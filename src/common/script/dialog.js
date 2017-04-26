define('h5/js/common/transDialog', [
    'jquery',
    'widget',
    'h5/js/common/translate'
], function($, Widget, Translate) {

    console.log('define trans-dialog module');

	$(window).on('orientationchange resize', function(event){
		$('.wl-trans-dialog').width($(window).width());
	});

    var templates = {};

    Translate.forEach(function(name){
        var lname = name.toLowerCase();
        templates[lname] = {
            template: '<section class="wl-trans-dialog wl-' + lname + '-dialog"><!--<section class="header"><div class="content navbar"><div class="btn-navbar navbar-left"><a href="javascript:history.go(-1);" class="icon icon-return"></a></div><div class="navbar-main">地址管理</div></div></section>--><div class="dialog-mask"></div><div class="dialog-body page-content"><span href="javascript:history.go(-1);" class="icon icon-return"></span><div class="dialog-header"></div><div class="dialog-content"></div></div><div class="close"></div></section>',
            fromInTranslate: name,
            outToTranslate: name
        }
    });
    templates.default = templates.fade;

    var exports = Widget.extend({
        attrs: $.extend({
            header : {
                readonly : true,
                getter : function(){
                    return this.$('.dialog-header');
                }
            },
            content : {
                readonly : true,
                getter : function(){
                    return this.$('.dialog-content');
                }
            }
        }, templates['default']),
        events: {
            'tap  .dialog-close,.close,.dialog-mask,[data-rol="close"]': function (event) {
                event.preventDefault();
                event.stopPropagation();
                this.hide();
            }
        },
        setup: function() {
            exports.superclass.setup.call(this);
            this.element.addClass('wl-trans-dialog');
            if(this.get('enableClose')){
                this.$('.close').addClass('dialog-close');
            }
            return this;
        },
        show: function(callback) {
            var _this = this;
            if (!_this.rendered) {
                _this.render();
            } else {
                _this.element.parent().append(_this.element);
            }
            var fromInTranslate =  _this.get('fromInTranslate');
            if(fromInTranslate == 'Right' || fromInTranslate == 'Left'){
                _this.element.show().css('width', $(window).width() - 1);
            }else{
                _this.element.show();
            }
            var tranMode = 'fromIn' + fromInTranslate;
            Translate[tranMode] && Translate[tranMode](this.element).done(function() {
                $('body').addClass('dialog-mode');
                if(fromInTranslate == 'Right' || fromInTranslate == 'Left'){
                    _this.element.show().css('width', $(window).width());
                }
                exports.showCount++;
                _this.trigger(_this.get('className') + ':show');
                $.isFunction(callback) && callback.call(_this);
            });
            return _this;
        },
        hide: function(callback) {
            var _this = this;
            var outToTranslate = _this.get('outToTranslate');
            var tranMode = 'outTo' + outToTranslate;

            Translate[tranMode] && Translate[tranMode](this.element).done(function() {
                if(outToTranslate == 'Right' || outToTranslate == 'Left'){
                    _this.element.width(0).hide();
                }else{
                    _this.element.hide();
                }
                exports.showCount--;
                if (exports.showCount == 0) {
                    $('body').removeClass('dialog-mode');
                }
                _this.element.trigger(_this.get('className') + ':hide');
                $.isFunction(callback) && callback.call(_this);
                _this.get('onHideDestroy') && _this.destroy();
            });
            return this;
        }
    });

    exports.templates = templates;

    return exports;
});