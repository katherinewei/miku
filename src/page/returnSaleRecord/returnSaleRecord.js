/**
 * 我的分润 退款金额明细
 */
require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/nexter',
    'h5/js/common/storage'
], function ($, URL, Data, Common, Nexter, Storage) {
    //获取URL参数  URL.param.mode=='obtain'

    var Page,		//页面
        main_section = '#profitPage', //主区块
        list_type = 0,
        listDiv = '.presentList',
        profitCountData     //分润统计数据
        ;

    function init() {

        profit_index(); //首页页面

    }

    //首页
    function profit_index() {

        Page = $('<section id="profitPage"></section>').appendTo('body');
        Common.headerHtml('已退款金额','',false,'#profitPage');
        $('#profitPage').append('<div class="grid main page-main page-content"><div class="presentList" data-role-scrollable="true"><ul></ul></div></div>');
        initNexter();

    }

    //获取分润统计数据
    function initNexter() {
        var ele = $('.presentList');
        var nexter = new Nexter({
            element: ele,
            dataSource: Data.getReturnSaleRecordVOList,
            enableScrollLoad: true
        }).on('load:success', function (res) {


            if (res.list.length > 0) {
                htmlItems(res.list, ele);
            } else {
                ele.find('ul').html('<li class="emptyMsg"><img src="' + URL.imgPath + 'common/images/salesReturn_empty.png"/> </li>');

            }

        }).render().load();
    }

    //数据HTML
    function htmlItems(items, ele) {
        var fans_html = '<div class="row fans_info"><div class="fans">粉丝:<span class="fans_namet">{{nickname}}</span><!--{{contactsLevel}}度--></div><div class="fans_money">退款金额:<span class="money_num">{{shareFee}}</span></div></div> ',
            template = '<li><div class="row row_border"> <div class="col col-15"><p class="ellipsis">{{itemName}}</p><p class="order_num">订单号：{{tradeId}}</p><p class="order_time">退货时间：<span>{{_htmlCreateTime}}</span></p></div><div class="col col-5 fb far fvc"><span class="status_img"><img src="' + URL.imgPath + 'common/images/icon_salesReturn.png" alt=""></span></div></div>' + fans_html + '</li>'
        $.each(items, function (index, item) {
            item.shareFee = Common.moneyString(item.shareFee);
            item._htmlCreateTime = bainx.formatDate('Y-m-d H:i', new Date(item.returnDate));

            ele.find('ul').append(bainx.tpl(template, item));

        });
    }

    init();
});