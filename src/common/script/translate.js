define('h5/js/common/translate', [
	'jquery', 
	'h5/js/common'
], function($, Common){
	//切割字符串为一个个小块，以空格或逗号分开它们，结合replace实现字符串的forEach
    var rword = /[^, ]+/g,
        exports = {};

    exports.type = "Left Top Right Bottom Fade";

    exports.forEach = function(callback){
        exports.type.replace(rword, callback);
    };

    exports.forEach(function(name) {
        var lowName = name.toLowerCase();
        exports['outTo' + name] = function(target) {
            var pomi = $.Deferred(),
                /*webkitAnimationStart = function(event) {
                    target.removeClass('translate-viewport');
                    console.log(event);
                },*/
                webkitAnimationEnd = function(event) {
                    console.log('add class translate-' + lowName);
                    target.removeClass('translate-out-to-' + lowName).addClass('translate-' + lowName);
                    pomi.resolve(target);
                };
            target.one({
                //'webkitAnimationStart': webkitAnimationStart,
                'webkitAnimationEnd': webkitAnimationEnd
            });
            target.removeClass('translate-viewport').addClass('translate-out-to-' + lowName)
            return pomi;
        };
        exports['fromIn' + name] = function(target) {
            var pomi = $.Deferred(),
                /*webkitAnimationStart = function(event) {
                    console.log(target, event, 'remove translate-' + lowName);
                },*/
                webkitAnimationEnd = function(event) {
                    //console.log(event);
                    target.removeClass('translate-from-in-' + lowName).addClass('translate-viewport');
                    pomi.resolve(target);
                };
            target.one({
                //'webkitAnimationStart': webkitAnimationStart,
                'webkitAnimationEnd': webkitAnimationEnd
            });
            exports.forEach(function(n) {
                n = n.toLowerCase();
                target.removeClass('translate-' + n);
            });
            target.addClass('translate-from-in-' + lowName);
            return pomi;
        };
    })

	return exports;

});