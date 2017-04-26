/**
 * 返利活动
 * Created by Spades-k on 2015/12/17.
 */

require([
    'jquery',
    'h5/js/common/url'
], function($, URL) {

    var Page;

    function init() {
        render();
    }

    function render() {
        var template = '<section><div class="content"><img src="'+imgPath+'active/images/rebateIntro.jpg" alt=""><a class="btn-receive"></a></div></section>';

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
