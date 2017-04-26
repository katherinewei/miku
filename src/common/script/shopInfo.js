/*define('h5/js/common/shopInfo',[
	'jquery',
	'h5/js/common/data',
	'h5/js/common/storage',
	'h5/js/common/location'
], function($, Data, Storage, WLoction){

	function ShopInfo(options){
		this.init(options);
		ShopInfo._map[this.id] = this;
	}

	ShopInfo.prototype = {
		init : function(options){
			$.extend(this, options);
			return this;
		}
	}

	ShopInfo.query = function(id){
		return ShopInfo._map[id];
	}

	ShopInfo.create = function(options){
		var shopInfo = ShopInfo.query(options.id);
		if(shopInfo){
			shopInfo.init(options);
		}else{
			shopInfo = new ShopInfo(options);
		}
		return shopInfo;
	}

	ShopInfo.fetch = function(){
		Data.fetchShopInfo().done(function(res){
			$.each(res.cityCommunity, function(index, item) {
				var shopInfo = ShopInfo.create(item);
				if(pageConfig && pageConfig.shopid && pageConfig.shopid == shopInfo.id){
					ShopInfo._current = shopInfo;
				}
            });
            promise.resolve(ShopInfo);
		}).fail(function(code, json){
			promise.reject(json && json.msg || '未知错误');
		});
	}

	ShopInfo.ready = function(callback){
		ShopInfo.done(callback);
		if(!ShopInfo._ready){
			if(pageConfig && pageConfig.shopid){
				ShopInfo.fetch();	
			}else{
				ShopInfo.locationCurrent().done(function(){
					promise.resolve(ShopInfo);
				}).fail(function(code, json){
					promise.reject(json && json.msg || '未知错误');
				});
			}
			ShopInfo._ready = true;
		}
		return ShopInfo;
	}

	ShopInfo.locationCurrent = function(coords, force){
		var pomi = $.Deferred();
		if(ShopInfo.locationCurrent._position || !force){
			fn(ShopInfo.locationCurrent._position);
		}else{
			WL.getPosition().done(function(position){
				fn(position).done(function(){
					ShopInfo.locationCurrent._position = position;
				});
			}).fail(function(code, json){
				ShopInfo.locationCurrent._position = null;
				pomi.reject(json);
			});
		}
		function fn(coords){
			return Data.setShop(coords).done(function(res){
				$.each(res.cityCommunity, function(index, item) {
					ShopInfo.create(item);
	            });
				if(res.community){
					ShopInfo._current = ShopInfo.create(res.community);
					pomi.resolve(ShopInfo._current);
				}else{
					pomi.reject();
				}
			}).fail(function(code, json){
				pomi.reject();
			});
		}
		
		return pomi.promise();
	}

	ShopInfo.locationCurrent._position = null;

	ShopInfo.getCurrent = function(){
		return ShopInfo._current;
	}


	ShopInfo._map = {};
	ShopInfo._current = null;

	var promise = $.Deferred();
	promise.promise(ShopInfo);

	return ShopInfo;

});*/