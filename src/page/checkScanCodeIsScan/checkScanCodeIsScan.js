/**
 * Created by xiuxiu on 2016/12/6.
 */
require([
    'jquery',
    'h5/js/common/data'
], function ($, Data) {

    function init(){
        $('.waitting').hide();
        $('body').append('<div class="content"><img src="'+imgPath+'common/images/pic_securityCode.png"/> <div class="inputWrap grid"><input type="tel" name="code" placeholder="请输入16位防伪码" class="code"/><input type="button" class="submitBtn btn" value=""/> <p><a href="http://www.my9lab.com/">http://www.my9lab.com/</a> </p> </div></div>');

        $('body').on('tap','.submitBtn',function(){
            var $number = $('input[name=code]'),
                $val = $.trim($number.val());
            var reg = /^\d{16}$/;
            if(!$val || !reg.test($val)){
                bainx.broadcast($number.attr('placeholder'));
                return
            }
            var data = {
                number:$val
            }
            Data.checkScanCodeIsScan(data).done(function(res){
                if(res.hasCode == 1){
                    $('.inputWrap').html('<div class="row"><p>防伪码：</p><div class="col">'+$val+'</div></div><div class="row"><p>查询结果：</p><div class="col">您好，您所查询的产品是英国9LAB出品的正牌产品，请放心使用。定制美丽，从9LAB开始。</div> </div><span class="btn intoWeb disabled" ></span>').addClass('result');
                    //if(res.isScan == 1){
                    //    bainx.broadcast('已扫过码！');
                    //}
                    //else{
                    //    bainx.broadcast('未扫过码');
                    //}
                    setTimeout(function(){
                        $('.intoWeb').removeClass('disabled');
                    },500)
                }
                else{
                    bainx.broadcast('没有此防伪码');
                }

            })
        })
            .on('tap','.intoWeb',function(){
                location.href = 'http://www.my9lab.com/';
            })


    }
    init();
})