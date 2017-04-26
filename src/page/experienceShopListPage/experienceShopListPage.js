/**
 * 体验店
 * Created by xiuxiu on 2016/9/29.
 */
require([
    'jquery',
    'h5/js/common/location',
    'h5/js/common/url',
    'h5/js/common',
    'h5/js/common/nexter',
    'h5/js/common/data',
    'h5/js/common/loadImage',
],function($, WLocation,URL, Common,Nexter, Data,LoadImage){

    var Page;
    function init(){
        var lat,//纬度
            lng,//经度
            myAddr;//位置
        //WLocation.getPosition().done(function(position, pois) {
        //
        //    lat = pois[0].lat;
        //    lng = pois[0].lng;
        //    myAddr =  pois[0].name;
        //    shopList(lat,lng,myAddr)
        //
        //}).fail(function() {
            lat = 23.226019;
            lng = 113.284048;
            myAddr = '广州白云区M3创意园';
            shopList(lat,lng,myAddr)
      //  });
    }

    //查询店铺
    function shopList(lat,lng,myAddr){
        Common.headerHtml('线下体验店','<div class="btn-navbar navbar-right"><img src="'+imgPath+'common/images/experienceStore/icon_map.png"/></div>');
        Page = $('<div class="page-content shopList"><div class="grid navTit"><ul class="page-tabs-nav row" data-switchable-role="nav"><li class=" sortFirst sortPrice col" data-order="2">智能排序</li><li class="sortFirst sortDiscount col" data-order="3">全城</li><li class="sortFirst sortBrand col">筛选</li></ul></div><p class="myAddr clearfix">'+myAddr+'<span class="refreshIcon"></span></p><ul class="shopListUL grid"></ul></div>').appendTo('body');
        var target =  $('.shopList'),
            nexter = new Nexter({
            element: target,
            dataSource: Data.nearByShopLocation,
            enableScrollLoad: true,
            scrollBodyContent: $('.shopList .shopListUL'),
            data: {
                longitude:lng,
                latitude:lat
            },
        }).load().on('load:success', function (res) {
                var items = res.data,
                    template  = '<li class="row" href="'+URL.experienceShopDetailPage+'?shopId={{id}}"><div class="shop-img fb fvc fac"><img data-lazyload-src="{{mainPicUrl}}"/> </div><div class="col col-15 mainRight"><h3>{{name}}</h3><div class="grid"><div class="row"><div class="col"><div class="star-wrap"><div class="star-inner" style="width: {{avgSize}}%;"></div> </div><p class="addr">{{street}}</p></div> <div class="col  comment"><p>{{countSize}}人评价</p><p>{{distance}}km</p></div> </div> </div>  </div> </li>',
                    html = [];
            $.each(items,function(index,item){
                var shop = item.shop;
                shop.distance = ( item.distance / 1000 ).toFixed(1);
                shop.countSize = item.cmodel.countSize;
                shop.avgSize = item.cmodel.avgSize * 20;
                html.push(bainx.tpl(template,shop))
            })
            $('.shopList .shopListUL').append(html.join(''));
            LoadImage(target);
        })
    }


    //查看地图
    //function
    init();

})