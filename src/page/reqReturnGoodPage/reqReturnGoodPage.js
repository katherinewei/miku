/**
 * 申请退货
 * Created by xiuxiu on 2016/1/21.
 */
require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/goods',
    'h5/js/common/nexter',
    'h5/js/common/loadImage'
], function($, URL, Data, Common, Goods, Nexter, LoadImage) {
    var Page,
        returnGoodsList,
        orderListNotHasData = '<li class="not-has-order-msg"><div class="empty_img"><img src="' + URL.imgPath + 'common/images/bg_empty_order_list.png" alt=""></div></li>',
        return_status = {
            '-1': '删除订单',
            '0': '申请退货',
            '1': '正在审核中',
            '2': '填写快递',
            '3':  '配送中',
            '4': '确认收货中',
            '5': '退款完成',
            '6':'退款异常'
        };

    function init() {
        render();
    }

    function render() {
        Common.headerHtml('申请退货','<div class="btn-navbar navbar-right"><span  class="policy" href="'+URL.returnPolicy+'">退货政策</span></div>',false);
        var headerHtml = '<section class="page-content"><div class="returnGoods" ><ul class="returnList"></ul></div> </section>';
        Page=$(headerHtml).appendTo('body');

        returnGoodsListNexter();
        bindEvents();
    }

    //获取申请退货列表
    function returnGoodsListNexter(){
        var ele = $('.returnGoods');
        var nexter = new Nexter({
            element: ele,
            dataSource: Data.getReturnGoodsVOList,
            enableScrollLoad: true,
            //pageSize: 15,
        }).load().on('load:success', function(res) {
             console.log(res);
            if (res.list.length) {
               var html = [];
                $.each(res.list,function(index,item){
                    html.push(htmlItems(item));
                });
                $('.returnList').append(html.join(''));
                LoadImage(ele);

            } else if (this.get('pageIndex') == 0) {
                $('.page-content').css({'background-color':'#fff'});
                $('.returnList').html(orderListNotHasData);

            }
        }).render();

        var sid,
            scrollEventHandle = function (event) {
                event.preventDefault();
                clearTimeout(sid);
                sid = setTimeout(function () {
                    LoadImage(ele);
                }, 0);
            }
        ele.on('scroll', scrollEventHandle);

    }

    function htmlItems(item){
            var template = '<li class="grid order" data-id="{{tradeId}}"><div class="summary row"><div class="col col-16">订单号：{{tradeId}}</div><div class="col col-9 fb fvc far order-status create-time">{{_htmlCreateTime}}</div></div><div class="goods-list-layout"><div class="scroll-box"><ul class="goods-list clearfix"><li class="goods row" data-id="{{artificialId}}" href="' + URL.goodsDetail + '?gid={{artificialId}}"><div class="thumb"><img data-lazyload-src="{{picUrl}}" /></div><div class="col fb fvc"><div><h3 class="pb-05"><span class="title">{{title}}</span></h3><p><span class="money">{{_htmlPrice}}</span><span class="count">{{num}}</span></p></div></div></li></ul></div></div><div class="suminfo-layout "><div class="btnGroups"><div class="btnReturnGoods" data-status="{{status}}" data-orderid="{{orderId}}">{{word}}</div></div></div></li>';
        item._htmlCreateTime = bainx.formatDate('Y-m-d h:i', new Date(item.orderDateCreated));
        item._htmlPrice = Common.moneyString(item.price);
        item.word = return_status[item.status];



        return bainx.tpl(template, item);
    }

    function bindEvents(){
        Page.on('tap','.policy',function(e){
            e.preventDefault();
            location.href = URL.returnPolicy;
        }).on('tap','.btnReturnGoods',function(e){
            var status_o =parseInt($(this).data('status')),
                orderId = $(this).data('orderid');
            location.href = URL.returnGoodFlowPage +'?status='+status_o+'&orderId='+orderId;
        })
    }
    init();
})
