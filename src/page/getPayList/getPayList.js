/**
 * 我的分润 提现明细 lin
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
        listDiv = '.presentList',
        profitCountData     //分润统计数据
        ;

    function init() {

        profit_index(); //首页页面
        bindEvents();  //绑定事件

    }

    //首页
    function profit_index() {

        Page = $('<section id="profitPage"></section>').appendTo('body');
        Common.headerHtml('提现明细','',false,'#profitPage');
        $('#profitPage').append('<div class="grid main page-main page-content"><div class="presentList" data-role-scrollable="true"><ul></ul></div></div>');


        $('.main').prepend('<div class="row present-button clearfix"><div class="col active" data-status="">全部</div><div class="col " data-status="0">提现中</div><div class="col " data-status="1">已完成</div><div class="col " data-status="2">审核异常</div></div>');

        $('.present-button div').each(function (i) {
            $('.main').append('<div class="presentList" data-role-scrollable="true"><ul></ul></div>');

        });
        $('.presentList').hide();

        var type = URL.param.type;
        $('.present-button div').removeClass('active');


        if (type) {
            var tatget = $('.presentList').eq(type);
            tatget.show();
            initNexter(type - 1, tatget);


            $('.present-button div').eq(type).addClass('active');

        } else {
            var tatget = $('.presentList').eq(type);
            tatget.show();
            initNexter('', tatget);
            $('.present-button div').eq(0).addClass('active');

        }

    }


    //绑定事件
    function bindEvents() {
        Page.on('tap', '.present-button div', function (event) {
            event.preventDefault();
            var target = $(this),
                status,
                key,
                present_list;

            target.siblings().removeClass('active');
            target.addClass('active');
            status = target.data('status');
            key = $(this).index();
            present_list = $('.presentList').eq(key);
            if (present_list.find('ul li').length == 0) {
                initNexter(status, present_list);

            }

            $('.presentList').hide();
            present_list.show();
            (present_list.find('.emptyMsg').length == 1) ? $('.present-tit').hide() : $('.present-tit').show();


        });

    }

    //获取分润统计数据
    function initNexter(status_code, ele) {

        var nexter = new Nexter({
            element: ele,
            dataSource: Data.getPayList,
            pageSize: 20,
            data: {
                status: status_code
            },
            enableScrollLoad: true
        }).on('load:success', function (res) {
            console.log(res);

            if (res.list.length > 0) {
                htmlItems(res.list, ele);
            }else{
                ele.find('ul').html('<li class="emptyMsg"><img src="' + imgPath + 'common/images/money_empty.png"/> </li>');

            }
            (ele.find('.emptyMsg').length == 1) ? $('.present-tit').hide() : $('.present-tit').show();
        }).render().load();
    }

    //数据HTML
    function htmlItems(items, ele) {
        var status_name = ['待审核', '已审核','审核异常'],
            template = '<li><div class="row"> <div class="col col-15"><p>审核时间：{{_htmlCreateTime}}</p><p>提现金额：<span>{{getpayFee}}</span></p></div><div class="col col-5 fb far fvc"><span>{{statusName}}</span></div></div><p class="errorMemo {{show}}">备注：{{errorMemo}}</p> </li>'
        $.each(items, function (index, item) {
            item._htmlCreateTime = bainx.formatDate('Y-m-d', new Date(item.dateCreated));
            item.statusName = status_name[item.status];
            item.show = item.status == 2 ? 'show':'';

            ele.find('ul').append(bainx.tpl(template, item));

        });

        $(listDiv, Page).on('scroll', function () {
            $(this).attr('scroll-top', $(this).scrollTop());
        });
    }

    init();
});