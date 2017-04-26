/**
 * 联系我们
 */
require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/transDialog',
], function ($, URL, Data, Common, Dialog) {
    var Page,
        TelDialog,
        weixinDialog;
    $('.waitting').hide();
    function init() {

        render();
    }

    function render() {

        //header
        Common.headerHtml('联系我们');
        var mainPage = '<section class="page-content" id="contactUs"><div class="logo"><img src="' + imgPath + '/common/images/9lab.jpg" /><p>九研美尚</p></div><div class="contactMain grid"><div class="kf row fvc tel_num" ><div class="col col-10">联系电话</div><div class="col col-3 right-icon fb far fvc iconfont "></div></div><div class="kf row fvc weixinKF" ><div class="col col-10">联系微信客服</div><div class="col col-3 right-icon fb far fvc iconfont "></div></div><!--<div class="tel_business row fvc tel_num" ><div class="col col-10">招商热线</div><div class="col col-3 right-icon fb far fvc iconfont "></div></div><div class="notice row fvc" href="' + URL.businessDepartmentHtm + '"><div class="col col-10">招商公告</div><div class="col col-3 right-icon fb far fvc iconfont "></div></div>--><div class="aboutUs row fvc" href="' + URL.aboutUsHtm + '"><div class="col col-10" >关于我们</div><div class="col col-3 right-icon fb far fvc iconfont "></div></div></div><div class="copyRight"><p>Copyright@2016-2020</p><p>深圳米酷信息科技有限公司</p></div></section>';
        Page = $(mainPage).appendTo('body');

        if(URL.param.type == '1'){

            $('.notice').attr('href',URL.businessDepartmentHtm + '?type=1');
            $('.aboutUs').attr('href',URL.aboutUsHtm + '?type=1');
        }else{
            $('.header').hide();
            $('#contactUs').css({'padding':'0'});
        }

        bindEvent();

    }
    function bindEvent() {
        Page.on('tap','.tel_num', function (event) {
            event.preventDefault();
            var target = $(this);

            showTelDialog(target);

        }).on('tap','.weixinKF', function (event) {
            event.preventDefault();
            if (!weixinDialog) {
                weixinDialog = new Dialog($.extend({}, Dialog.templates.top,{
                    id: 'weixinKFDialog',
                    template: '<section ><img src="'+URL.imgPath+'common/images/weixinKF.jpg"/> <i class="close"></i></section>',
                    events: {
                        'tap .close': function (event) {
                            event.preventDefault();
                            weixinDialog.hide();
                        }
                    }
                }))
            }
            weixinDialog.show();
        })

    }

    //显示电话
    function showTelDialog(target) {

        if (!TelDialog) {
            TelDialog = new Dialog({
                template: '<section class="telDialog"><div class="cont"><p class="contactWay"></p><p class="tel"></p><div class="btngroup"><span class="btn reset">取消</span><span href="" class="btn ring">拨号</span></div></div></section>',
            })

        }
        TelDialog.show();
        $('.cont').removeClass('bounceOut').addClass('bounceIn');

        if (target.hasClass('kf')) {
            $('.contactWay').text('联系客服');
            $('.tel').text(Common.companyTel);
            $('.ring').attr('href', 'tel:' + Common.companyTel);
        } else {
            $('.contactWay').text('招商热线');
            $('.tel').text(Common.companyTel);
            $('.ring').attr('href', 'tel:' + Common.companyTel);
        }

        $('.btn').on('tap', function () {
            $('.cont').removeClass('bounceIn').addClass('bounceOut');
            setTimeout(a, 600);
        })
        function a() {
            TelDialog.hide();
        }
    }
    init();

});




