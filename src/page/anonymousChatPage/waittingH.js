/**
 * Created by Spades-k on 2016/10/14.
 */
define('h5/js/page/waittingH', [
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/common'
], function($,URL, Data,Common) {

    var waittingHtml=function(msg){
        var html='<div class="waittingHtml"><div class="wait"><div class="loading"></div><div class="message">'+msg+'</div></div></div>';

        $('body').append(html);

        var width=$('.wait').width(),
            height=$('.wait').height();
        $('.wait').css({'margin-left':-width/2+'px','margin-top':-height/2+'px'});

    }

    return waittingHtml;

})