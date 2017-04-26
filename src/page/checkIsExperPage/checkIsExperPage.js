/**
 * Created by xiuxiu on 2016/12/6.
 */
require([
    'jquery',
    'h5/js/common/data'
], function ($, Data) {

    function init(){
        $('.waitting').hide();
        document.title ='验证老师';
        $('body').append('<div class="content"><img src="'+imgPath+'common/images/pic_checkExpert.png"/> <div class="inputWrap grid"><label class="txt">在下方输入老师的微信号，即可查询您当前咨询的老师是否为<b>9LAB官方老师</b>（请一定要核对微信号是否正确）</label><input type="text" placeholder="请输入微信号" class="wxno"/><input type="button" class="submitBtn btn"/></div></p> </div></div>');

        $('body').on('tap','.submitBtn',function(){
            var $number = $('.wxno'),
                $val = $.trim($number.val());
            if(!$val){
                bainx.broadcast($number.attr('placeholder'));
                return
            }
            var data = {
                wxno:$val
            }
            Data.checkIsExper(data).done(function(res){
                if(res.isExpert != 0){
                    $('.txt').hide();
                    $('.inputWrap').html('<div class="row"><p>微信号：</p>' +
                        '<div class="col">'+$val+'</div></div><div class="row"><p>查询结果：</p><div class="col">您好，您所查询的老师是9LAB的官方老师，请放心咨询。定制美丽，从9LAB开始。</div> </div><span class="btn intoWeb disabled" ></span><!--<input class="btn reSearch" value="继续查询" />-->').addClass('result');
                    setTimeout(function(){
                        $('.intoWeb').removeClass('disabled');
                    },500)
                }
                else{
                    bainx.broadcast('该微信号不是我们的官方老师，请注意~');
                }
            })
        })
            .on('tap','.intoWeb',function(){
                location.href = 'http://www.my9lab.com/';
            })

    }
    init();
})
