/**
 * Created by lin on 2015/12/16.
 */
require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/common/weixin'
], function($, URL, Data, Goods, Weixin) {

    var Page;

    function init() {
        render();
    }

    function render() {
        var template = '<section><div class="content"><img src="'+imgPath+'active/images/free_shipping.jpg" alt=""><a class="btn-receive"></a></div></section>';

        Page = $(template).appendTo('body');

        $('.waitting').hide();

        bindEvent();
    }

    function bindEvent() {
        Page.on('tap', '.btn-receive', function(event) {
            event.preventDefault();

            location.href = URL.index;
        });
    }

    init();
});
