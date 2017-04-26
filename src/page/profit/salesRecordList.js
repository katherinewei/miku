/**
 * 我的分润 lin
 */
require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/nexter',
    'h5/js/common/storage'
],function($, URL, Data, Common, Nexter, Storage){
    //获取URL参数  URL.param.mode=='obtain'

    var Page,		//页面
        main_section = '#profitPage', //主区块
        recordListDiv = '.recordList',
        profitCountData,    //分润统计数据
        sum = 0;

    function init() {

        profit_index(); //首页页面
        bindEvents();  //绑定事件
    }

    //首页
    function profit_index() {
        $(main_section).remove();
        Common.headerHtml('余额明细','',false,'#profitPage');
        Page = $('<section id="profitPage"><div class="main saleRecord page-main page-content grid"><div class="balance-tit row"><div class="col">订单号</div><div class="col">订单时间</div><div class="col">推广费</div><div class="col">状态</div> </div><div class="recordList" data-role-scrollable="true"><ul></ul></div></div><div class="footer"></div></section>').appendTo('body');

        $('.main').prepend('');

        sub_botton('我要提现'); //提交按钮
        initNexter();

    }


    //统计总数
    function profit_html(data) {
        var count_html = '<div class="balance-money"><div class="total-money"><label class="money-tit">当前可用资金:</label><span class="money">{{shareFee}}</span></div></div>';
        $('.saleRecord').append(bainx.tpl(count_html, data));



        var recordListHeight = $('body').height()-$('.balance-tit').height()-$('.balance-money').height()-95;

        $('.recordList').height(recordListHeight);

        var money = URL.param.money;
        $('.total-money span').text(money);
    }

    //提交按钮
    function sub_botton(msg) {
        $('<div class="sub-button"><a class="withdraw">' + msg + '</a></div>').appendTo('.footer');
    }

    //绑定事件
    function bindEvents() {
        Page.on('tap', '.withdraw', function (event) {
            event.preventDefault();
            location.href = URL.reqGetPayHtm; //我要提现
        }).on('swipeUp', recordListDiv, function (event) {
            console.log(event);
            event.preventDefault();
        }).on('swipeDown', recordListDiv, function (event) {
            console.log(event);
            event.preventDefault();
        });

    }

    //获取分润统计数据
    function initNexter() {

        var nexter = new Nexter({
            element: $(recordListDiv),
            dataSource: Data.salesRecordList,
            enableScrollLoad: true
        }).on('load:success', function (res) {
            console.log(res);
            if ($('.balance-money').length == 0) {
                profit_html(res);
            }
            if (res.list.length > 0) {
                var html = htmlItems(res.list);
            }
            if ($('.recordList ul li').length == 0) {
                $(recordListDiv).html('<div class="emptyMsg"><img src="' + imgPath + 'common/images/balance_empty.png" /></div>');
                $('.balance-tit,.balance-money,.footer').hide();
            }
            /*else{
             $(recordListDiv).html('<div class="emptyMsg">暂时没有记录!</div>');
             }*/

        }).render().load();


    }

    //数据HTML
    function htmlItems(items) {
        var template = '<li><div class="balance-content row"><div class="col">{{tradeId}}</div><div class="col">{{_htmlCreateTime}}</div><div class="col mt4">{{shareFee}}</div><div class="col mt4 status status_{{tradeStatus}}"></div> </div></li>';
        $.each(items, function (index, item) {
            //item.isGetpay 0==未提现 1==提现中 2==已提现
            //if (item.isGetpay != 2) {
                item._htmlCreateTime = bainx.formatDate('Y-m-d h:i:s', new Date(item.dateCreated));
            //if(item.tradeStatus == 20){
            //
            //}

                $(recordListDiv + ' ul').append(bainx.tpl(template, item));
            //}

        });

        $(recordListDiv, Page).on('scroll', function () {
            $(this).attr('scroll-top', $(this).scrollTop());
        });
    }

    init();
});