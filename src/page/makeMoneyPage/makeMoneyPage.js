/**
 * 我要赚钱
 */


require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/transDialog',
], function ($, URL, Data, Common, Dialog) {
    var Page,
        successJoinDialog,
        howToMakeDialog,
        isAgency = URL.param.isAgency;
    $('.waitting').hide();
    function init() {

        render();
    }

    function render() {
        //header
        Common.headerHtml('我要赚钱');

        var mainPage = '<section class="makeMoneyPage startPage page-content"><div class="banner"><img src="' + URL.imgPath + '/common/images/makeMoneyBanner.png"> </div> <div class="makeMoneyWrap"> <div class="tips"> <p>成为米酷推广经理,掌管米酷大权，上万款热销产品任你经营，无忧生活就从这一刻开始</p> <div class="grid"> <div class="row"><a class="col col-50 btnMake" >马上成为推广经理</a> <a class="col col-50 howToMakeMoney" >如何赚钱</a> </div> </div> </div> <article><h4>推广经理特权:</h4><div class="list"> <div class="grid"> <dl class="row"><dt class="col col-6"><div class="round"><img src="'+URL.imgPath+'/common/images/ic_privilege4.png"/></div></dt><dd class="col col-18"><h3>平台代理权</h3> <p>享受米酷平台上百万款热销产品的代理权。</p> </dd> </dl> </div><div class="grid"> <dl class="row"><dt class="col col-6"><div class="round"><i class="icon2"></i></div></dt><dd class="col col-18"><h3>推广拿高额奖励</h3> <p>每成功推荐一位好友成为推广经理，或推广销售平台上的任何产品，都可获得高额奖励。</p> </dd> </dl> </div><div class="grid"><dl class="row"><dt class="col col-6"><div class="round"><i class="icon3"></i></div></dt> <dd class="col col-18"><h3>自购拿返利</h3><p>自己购买平台上的任何产品，都可获得高额返利。</p> </dd></dl></div> <div class="grid"><dl class="row"><dt class="col col-6"><div class="round"><i class="icon1"></i></div></dt><dd class="col col-18"><h3>轻松享受一键式营销</h3><p>吸睛营销方案公司提供，只需动动手指， 就能坐等推广费进兜。</p></dd></dl></div></div></article><footer><p>商品销售统一由平台直接收款、直接发货，并 提供产品的售后服务，推广费由平台统一设置。</p> </footer></div></section>';
        Page = $(mainPage).appendTo('body');
        canJoin();
        bindEvents();

    }

    //判断是否可以加盟
    function canJoin() {

        if (isAgency == 1) {

            $('.btnMake').addClass('disable');
            $('.tips p').text('恭喜您已经成为米酷推广经理，快去查看如何赚钱吧！');
        } else {
            $('.btnMake').attr('href',URL.buyForJoinAgencyPage+'?type=1');
        }
    }
    function bindEvents() {

        $('body').on('tap', '.icon-returnGuide', function (event) {
            event.preventDefault();
            howToMakeDialog.hide();
            $('.navbar-main').text('我要赚钱');
        }).on('tap', '.howToMakeMoney', function (event) {
            event.preventDefault();
            URL.assign(URL.howToMakeMoney + '&isAgency=' + isAgency);
        })
    }

    init();

});
