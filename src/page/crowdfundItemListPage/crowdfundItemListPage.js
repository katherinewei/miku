/**
 * 我要支持
 * Created by xiuxiu on 2016/2/16.
 */
require([
    'jquery',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/nexter',
    'h5/js/common/goods',
    'h5/js/common/cart',
    'h5/js/common/weixin',
    'h5/js/common/url'
], function ($, Data, Common, Nexter,  Goods, Cart, WeiXin, URL) {

    var Page,
        crowdfundId = URL.param.crowdfundId,            //众筹id
        id = 0,       //众筹明细id
        plusDay = URL.param.plusDay,   //提示多少天发货
        pUserId = URL.param.pUserId;


    function init() {
        render();
    }

    function render() {
        Common.headerHtml('我要支持');
        Page = $('<section  class="page-content"><div class="tips"></div><div class="itemAll"><h3>选择回报</h3><ul class="item-list"></ul> </div> </section>').appendTo('body');

        $('.tips').append('<h3><i></i>风险提示</h3><div class="narrowContent"><p class="hide">1、乐享团并非商品交易，项目存在一定的风险，如果项目筹款成功，我将第一时间安排发货，乐享团产品不提供退货服务，如有质量问题，请与客服联系。<br />2、乐享团成功后，发放回报、开具发票及售后服务等事项均由我方负责。<br />3、如果乐享团失败，您支持的款项会全部原路退还给您。<br />4、本页面统计的项目支持人数和总支持金额存在一定的延迟，以单个回报详情为准。 </p><span class="viewMore">展开更多<i></i></span></div>');


        var data = {
            crowdfundId:crowdfundId
        };
        if (crowdfundId) {
            Data.getCrowdfundItemList(data).done(function (res) {
                console.log(res);
                var html=[];
                if(res.crowdfundStatus != 0){
                    $('#support-btn').addClass('disabled');
                }
                if (res.detailVOList.length) {
                    $.each(res.detailVOList, function (index, item) {
                        html.push(htmlItem(item));
                    });
                    $('.item-list').append(html.join(''));
                    $('.item-list li .choice i').eq(0).parent('.choice').addClass('active');
                    //$('.item-list li:first-child .choice').addClass('active');
                    if($('.item-list').find('.choice').children('i').length == 0){
                        $('#support-btn').addClass('disabled');
                    }

                } else {
                    $('.item-list').html('<li class="notData"><img src="'+URL.imgPath+'/common/images/loading_fail.png"/><p>灰常抱歉，暂时没有数据哦</p></li>');
                }

            });


        }

        bindEvents();
        renderFooter();
    }
    function hasDot(num) {              //判断是否有小数
        if (!isNaN(num)) {
            return ((num + '').indexOf('.') != -1) ? true : false;
        }
    }

    function moneyString(money) {           //如果没有小数，去掉。

        var Price = parseFloat((money / 100).toFixed(2));

        return (isNaN(money)  ? 0 : (hasDot(Price) ? Price.toFixed(2) : parseInt(Price)));
    }



    function htmlItem(item){

        var template = '<li class="grid cart-item" data-id="{{id}}"><div class="title row"><div class="col col-18 goodsItem" data-id="{{itemId}}"><p class="nowPrice">支持:<span class="price">{{price}}</span></p></div><div class="col col-7 choice  fvc fb far">{{choice}}</div> </div><div class="decs"><p class="num mb-05">{{soldCnt}}位支持者（剩余<span class="itemNum">{{itemNum}}</span>位支持者）</p><p>{{returnContent}}</p><div class="thumb-wrap mt-05 mb-05">{{picUrls}}</div> </div><div class="promise">卖家承诺：乐享团成功后'+plusDay+'天发货</div></li>',
         thumbsHtml = [];
        item.price = moneyString(item.itemViewDO.price);
        item.refPrice = moneyString(item.itemViewDO.refPrice);
        item.soldCnt = item.soldNum;
        item.itemNum = item.itemViewDO.itemNum;
        item.desc = item.itemViewDO.desc;

        if(item.itemNum == 0){
            item.choice = '已经满额';
        }else{
            item.choice = '<i></i>';
        }
        if(item.itemViewDO.pics && item.itemViewDO.pics.length){
            item.picUrls = item.itemViewDO.pics.split(';');
            $.each(item.picUrls,function(index,item_p) {
                thumbsHtml.push('<img src="'+item_p+'" alt="" class="pic-wrap">');
            });
            item.picUrls = thumbsHtml.join('');
        }

        return bainx.tpl(template, item);


    }
    function renderFooter() {
        var template = '<div id="toolbar"><a id="support-btn">我要支持</a></div></div>';
        $(template).appendTo('body');
    }


    function bindEvents() {
        $('body').on('tap','.viewMore',function(event){
            event.preventDefault();
            if($(this).hasClass('hide')){
                $(this).text('展开更多').removeClass('hide');
                $('.narrowContent p').removeClass('show').addClass('hide');
            }else{
                $(this).text('收起').addClass('hide');
                $('.narrowContent p').addClass('show').removeClass('hide');
            }
        }).on('tap','.choice',function(){
            //event.preventDefault();
            //$(this).addClass('active').siblings().removeClass('active');

            $('.choice').removeClass('active');
            $(this).addClass('active');


        }).on('tap','#support-btn',function(event){
            event.preventDefault();
            var param = getCheckItemsParam(),
                itemNum =$('.active').parents('.cart-item').find('.itemNum').text(); //众筹明细商品库存
            if($(this).hasClass('disabled')){
                return;
            }else{
                if(!param){
                    alert('请选择要支持的商品！');
                    return;
                }
                console.log(itemNum);

                var lisURL = URL.crowdfundPaymentPage + '?id=' + id + '&goods=' + encodeURIComponent(param) + '&itemNum=' + itemNum;
                if (URL.param.pUserId) {
                    lisURL += '&pUserId=' + pUserId;
                }
                if (URL.param.isShare) {
                    lisURL += '&isShare=' + URL.param.isShare;
                }
                URL.assign(lisURL);

            }

        })

    }
    function getCheckItemsParam(){
        var ret = [],
            cid;

        $('.item-list li').each(function(){
            if($(this).find('.active').length != 0){
                cid = $(this).find('.goodsItem').data('id');
                id = $(this).data('id');
                ret.push(cid+','+1);
            }
        });
        return ret.join(';');
    }



    init();
})