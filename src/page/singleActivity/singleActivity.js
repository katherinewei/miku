/**
 * Created by Spades-k on 2015/12/17.
 */
require([
    'jquery'
], function($) {

    var Page;

    function init() {
        document.title = '凑单活动';
        render();
    }

    function render() {
        var template = '<section><div class="content"><img src="'+imgPath+'active/images/singleActivity.jpg" alt=""></div></section>';
        Page = $(template).appendTo('body');
        $('.waitting').hide();

    }
    init();
});