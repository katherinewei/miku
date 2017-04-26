/**
 * 物流信息
 * Created by xiuxiu on 2016/3/22.
 */
require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/common'
], function($, URL, Data, Common) {

    var Page,
        tid = URL.param.tradeId,
        status = {
            '0':'运输中',//    0：在途，即货物处于运输过程中；
            '1':'已揽件',//    1：揽件，货物已由快递公司揽收并且产生了第一条跟踪信息；
            '2':'疑难件',//    2：疑难，货物寄送过程出了问题；
            '3':'已签收',//    3：签收，收件人已签收；
            '4':'已退签',//    4：退签，即货物由于用户拒签、超区等原因退回，而且发件人已经签收；
            '5':'正在派件',//    5：派件，即快递正在进行同城派件；
            '6':'退回中'//    6：退回，货物正处于退回发件人的途中；


        };

    function init(){

        render();

    }

    function render(){

        var template = '<div class="page-content grid" id="logistics"></div> ';

        Page = $(template).appendTo('body');
        if(URL.param.type){
            Common.headerHtml('物流信息');
            $('#logistics').css('padding-top','45px')
        }

        fetchInfo();

        Page.on('tap','.showMessage',function(){
            if($(this).hasClass('active')){
                $(this).removeClass('active');
                var firstH = $(this).parent('.list').find('li').eq(0).height();
                $(this).parent('.list').children('ul').css('height',firstH);
                $(this).text('展开物流信息');
            }else{
                $(this).addClass('active');
                $(this).parent('.list').children('ul').css('height','auto');
                $(this).text('收起物流信息');
            }

        })

    }


    function fetchInfo(){
        var data = {
            tradeId:tid
        };
        Data.searchLogisticsCallBack(data).done(function(res){

            console.log(res[0]);
            var html = [];
            $.each(res,function(index, item){
                html.push(htmlItem(item));
            })
            $('#logistics').append(html.join(''));



            $('.list').each(function(){
                $(this).find('ul').height($(this).find('li').eq(0).height());

                if($(this).find('li').length == 1 || $('.box').length == 1){
                    $(this).children('.showMessage').hide();
                    $(this).find('ul').css('border-bottom-width',0).height('auto')
                }
            })








            $('.list li:first-child').addClass('active');
            $('.list li').each(function(){
                $(this).children('span').height($(this).height());
            })
            $('.list li:last-child').children('span').height(10);
        }).fail(function(){
            $('#logistics').append('<p class="noLogistics">暂时没有物流消息哦~</p>');
        })
    }

    function htmlItem(logistics){
        var module = {
            companyName: logistics.companyName,
            companyNum: logistics.companyNum,
            logisticsInfo: (function(items) {
                var html = [],
                    template = '<li><span></span><p>{{context}}</p><p>{{time}}</p></li>';
                if ($.isArray(items) && items.length) {

                    //items.reverse();
                    items.forEach(function(item, index) {
                       // item.time = bainx.formatDate('Y-m-d h:i:s', new Date(items.time));
                        html.push(bainx.tpl(template, item));
                    });
                }else{
                    if(logistics.companyName){
                        status[logistics.state] = '揽件中';
                        html.push('<li><span></span><p>正在通知快递公司揽件</p></li>');
                    }
                }
                return html.join('');
            })(logistics.wllist),
            goodsList: (function(items) {
                var html = [],
                    template = '<li class="goods row" data-id="{{id}}" data-cateid="{{categoryId}}" ><div class="col col-8"><img src="{{picUrls}}"></div><div class="col col-17 fb fvc pl-10"><div><h3 class="pb-10"><span class="title">{{title}}</span></h3><p><span class="money">{{_htmlPrice}}</span><span class="count">{{num}}</span></p></div></div></li>';
                if ($.isArray(items) && items.length) {



                        $.each(items, function(index, item) {

                                var img = item.picUrls.split(";")[0],
                                    isJpg = /\.jpg/gi.test(img);
                                item.picUrls = img + (isJpg ? '!300q75' : '');

                            item._htmlPrice = Common.moneyString(item.price);


                         html.push(bainx.tpl(template, item));
                          //  console.log(goods);
                    });
                }


                return html.join('');
            })(logistics.itemist),
            state:status[logistics.state]

        },


         tpl = '<div class="box"><div class=" item sub_title"><p>物流状态：<span>{{state}}</span></p><p>物流公司：{{companyName}}</p><p>物流号：{{companyNum}}</p></div><div class="goods-list-layout item"><ul class="goods-list">{{goodsList}}</ul></div><div class="logistics_info item"><h4>物流信息：</h4><div class="list"><ul>{{logisticsInfo}}</ul><div class="showMessage">展开物流信息</div> </div></div></div>';

        return bainx.tpl(tpl, module);
    }


    init();

})