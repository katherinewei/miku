define('h5/js/common/mapDialog',[
	'jquery',
	'h5/js/common',
	'h5/js/common/transDialog',
	'h5/js/common/data',
	'h5/js/common/map'
], function($, Common, Dialog, Data, Map){

	var cidGenerator = bainx.cidGenerator();

	var exports = Dialog.extend({
		attrs : {
			shopId : null,
			shopInfo : null,
			position : null,
			onHideDestroy : true,
			enableClose : true,
		},
		events : {
			'tap .shop-info-name':function(event){
				event.preventDefault();
				var S = this;
				var target = $('#shopNameList');
				if(!target.length){
					require('h5/js/common/shop', function(Shop){
						Shop.ready(function(){
							var html = ['<ul id="shopNameList">'];
							Shop.forEach(function(id, shop){
								html.push('<li class="shop-item" data-id="'+ shop.id +'">'+ shop.name +'</li>');
							});
							html.push('</ul>');
							$('.dialog-header').append(html.join(''));
							target = $('#shopNameList').on('tap', '.shop-item', function(event){
								event.preventDefault();
								var id = $(this).data('id'),
									shop = Shop.query(id);
								if(shop){
									S._onRenderShopInfo(shop);
								}
								target.hide();
							}).css({
								'max-height':$(window).height(),
								'overflow-y': 'auto'
							})
						});
					});
				}else{
					target.show();
				}
			}
		},
		setup : function(){
			exports.superclass.setup.call(this);
			this.element.addClass('wl-map-dialog');
			var S = this;
			return S;
		},
		render : function(){
			exports.superclass.render.call(this);
			var S = this;
			
				setTimeout(function(){
				if(!S.get('shopId')){
						require('h5/js/common/shop', function(Shop){
							Shop.ready(function(){
								var shop = Shop.currentShop();
								console.log(shop);
								S._onRenderShopInfo(shop);
							});
						});
					}
				},100);
			return this;
		},
		_onRenderShopId : function(shopId){
			var S = this;
			console.log(shopId);
			
			Data.getShop().done(function(res){
				if(res){
					$.each(res.cityCommunity, function(index, shopInfo){
						if(shopInfo.id == shopId){
							S.set('shopInfo', shopInfo);
							return false;
						}
					});
				}
			});
			return S;
		},
		_onRenderShopInfo : function(shopInfo){
			var S = this;
			if(!S.rendered) return;

			console.log(shopInfo);
			
			var coords = shopInfo.lbs.split(',');

			S.$('.dialog-header').html('<span class="shop-info-name iconfont bottom-icon">'+ shopInfo.name +'</span>');

			var id = 'wl-map-'+ cidGenerator();
			S.$('.dialog-content').html('<div id="'+ id +'"></div>');

			Map.ready(function(){

				var polygon = new Map.Polygon(shopInfo.deliveryArea);

				console.log('地图中心点', polygon.center.lng, polygon.center.lat);

				//基本地图加载
				var map = new AMap.Map(id,{
					resizeEnable: true, //false,
					rotateEnable: true, //false,
					dragEnable: true, //false,
					zoomEnable: true, //false,
			        view: new AMap.View2D({
			        	center:new AMap.LngLat(polygon.center.lng, polygon.center.lat),//地图中心点
			        	zoom:15 //地图显示的缩放级别13
			        })
			    });

			    Map.drawPolygon(map, polygon);
			    Map.addmarker(map, {
			    	lng : coords[0],
			    	lat : coords[1],
			    	template : '<div class="map-marker">{{lng}},{{lat}}</div>'
			    });
			});

			
		    return S;
		}

	});

	return exports;

});