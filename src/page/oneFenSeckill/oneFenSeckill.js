/**
 *  一分钱秒杀
 * Created by Administrator on 2016/4/13.
 */

require([
    'jquery',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/url'
], function ($, Data, Common, URL) {
    var Page,
        dialog;
    var isAPP = navigator.userAgent.indexOf("welink") > -1 || navigator.userAgent.indexOf("unesmall") > -1 ?  false: true;  //判断是否是app  welink表示ios，unesmall表示android
    function init() {
        $('.waitting').hide();
        render();
        Common.to_Top('#indexPage');        //返回顶部
        document.title = '一分钱秒杀';
    }


    function render() {
        var goods_key = URL.param.page,
            goods_list_html = '',
            goods_list = {
                oneFenSeckill:['',16123,16122,16121], //
            };
        var goods_list_len = goods_list[goods_key].length,
            src = '',
            href;
        for(var i=1;i<goods_list_len;i++){
            src = imgPath+goods_key+'/'+i+'.jpg';
            href = URL.goodsDetail+'?gid='+goods_list[goods_key][i];

            if(isAPP){
                href = '';
            }
            if(goods_list[goods_key][i] == ''){
                href = '',
                    src = imgPath+goods_key+'/'+i+'-1.jpg';
            }
            goods_list_html += '<img class="'+goods_list[goods_key][0]+' img" src="'+src+'" href="'+href+'" tj_category="商品" tj_action="'+goods_list[goods_key][i]+'" tj_label="活动专场" />';
        }
        var html = '<div class="main" id="indexPage"><img src="'+imgPath+goods_key+'/top.jpg">'+goods_list_html+'</div>';
        Page = $(html).appendTo('body');
        if(isAPP){
            if($('.telDialog').length == 0){
                dialog = $('<section class="telDialog wl-trans-dialog translate-viewport" style="display: none;"><div class="cont bounceIn"><p>该活动仅支持APP下单</p><div class="btngroup"><span class="btn reset">取消</span> <span href="' + Common.downloadLink + '"  class="btn ring">下载APP</span></div></div></section>').appendTo('body');
            }
            $('body').on('tap','.img',function(){
                $('.telDialog').show();
            }).on('tap','.reset',function(){
                $('.telDialog').hide();
            })

        }

    }

    init();
});
