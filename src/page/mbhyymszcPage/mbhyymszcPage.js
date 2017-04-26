/**
 * 首页
 */
require([
    'jquery',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/storage',
    'h5/js/common/url'
], function ($, Data, Common, Storage, URL) {
    var Page;
        //pUserId = URL.param.pUserId;

    function init() {
        $('.waitting').hide();
        render();
        Common.to_Top('#indexPage');        //返回顶部
    }

    function render() {
        var now_day = parseInt(bainx.formatDate('d', new Date(pageConfig.nowTime)));
        console.log(now_day);
        var day = (now_day ? now_day : 9),
            goods_list_html = '',
            goods_key = 0;
            goods_list = {
                1:[10688,10691,10687],
                2:[10687,10691,10688],
                3:[10691,10688,10687],
            };

        switch (day){
            case 9:
                goods_key = 1;
                break;
            case 10:
                goods_key = 2;
                break;
            default:
                goods_key = 3;
                break;
        }

        var goods_list_len = goods_list[goods_key].length;

        for(var i=0;i<goods_list_len;i++){

            goods_list_html += '<a href="'+URL.goodsDetail+'?gid='+goods_list[goods_key][i]+'"><img src="'+imgPath+'mbh/'+goods_key+'/'+(i+2)+'.jpg"></a>';
        }

        var html = '<div class="main"><img src="'+imgPath+'mbh/'+goods_key+'/1.jpg">'+goods_list_html+'<img src="'+imgPath+'mbh/'+goods_key+'/5.jpg"><a href="' +URL.hActiveHtm+'?page=lottery"><img src="'+imgPath+'mbh/'+goods_key+'/6.jpg"></a><a href="'+URL.index+'"><img src="'+imgPath+'mbh/'+goods_key+'/7.jpg"></a></div>';
        Page = $(html).appendTo('body');

    }

    function bindEvents() {
        Page.on('tap', '.shop-signs', function(event) {

        }).on('tap','.tit-search',function(event){
            location.href = '';
        });

    }

    init();
});

