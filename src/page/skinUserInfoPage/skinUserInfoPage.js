/**
 * Created by Spades-k on 2016/10/19.
 */
require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/page/frameBox',
], function($,URL, Data,Common,frameBox) {
    function init() {
        $('.waitting').hide();

        if(!pageConfig.pid || pageConfig.pid.length<=0){
            bainx.broadcast('请扫码登录！');
            setTimeout(function(){
                URL.assign(URL.createQrCodeLoginPage);
            },1000);
            return;
        }

        var html='<section class="informationBox"><div class="con"><div class="head clearfix"><p>9LAB用户基本信息</p><div class="logo"><img src="http://unesmall.b0.upaiyun.com/website/pc/images/9lab.jpg"></div></div><div class="conBody"><ul><li><label for="nikeName">昵称：</label><input type="text" readonly value="{{nickName}}" id="nikeName"></li><li><label for="sex">性别：</label><input readonly type="text" value="{{sex}}" id="sex"></li><li><label for="mobile">电话：</label><input type="text" readonly value="{{mobile}}" id="mobile"></li></ul></div><div class="btnList"><a href="'+URL.skinCheckedPage+'">肌肤测试</a><a href="'+URL.skinPicComparePage+'?type=0">图像对比</a></div></div></section>',tp=[];

        Data.mineInfo().done(function(res){
            if(res.sex==1){
                res.sex='男';
            }else if(res.sex==0){
                res.sex='女';
            }else {
                res.sex='未知';
            }
            res.mobile=res.mobile.substring(0,3)+"xxxx"+res.mobile.substring(8,11);
            tp.push(bainx.tpl(html,res));
            $('body').append(tp.join(''));
        })


        frameBox('.informationBox');
    }


    init();
})