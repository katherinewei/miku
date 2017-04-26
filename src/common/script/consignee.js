define('h5/js/common/consignee',[
	'jquery',
	'h5/js/common/data',
	'h5/js/common/storage',
	'h5/js/common/shop',
	'h5/js/common/location'
], function($, Data, Storage, Shop, WLocation){

	function Consignee(options){
		this.init(options);
		Consignee._map[this.id] = this;
		//console.log(this);
	}

	Consignee.prototype = {
		init : function(options){
			$.extend(this, options);

			var shop = Shop.query(this.communityId);
			if(shop){
				this.shop = shop;
				this.shopName = shop.name;
				this.distance = WLocation.getGreatCircleDistance(this.longitude, this.latitude, shop.coords.lng, shop.coords.lat);
				this._htmlDistance = WLocation.morkm(this.distance);
			}
			var currentShop = Shop.currentShop();

			if(currentShop && currentShop.id == this.communityId){
				this.inCurrentShop = true;
			}
			return this;
		}
	}

	function handle(res){
		
		Consignee._map = {};
		Consignee._default = null;

		if(res && res.consignees && res.consignees.length){
			$.each(res.consignees, function(index, item){
				var consignee = Consignee.create(item);
				if(consignee && consignee.getDef == 1){
					Consignee._default = consignee;
					//console.log('默认地址：',consignee);
				}
			})
		}
	}
	Consignee.fetch = function(){
		return Data.getConsignee().done(function(res){
			handle(res);
			promise.resolve(Consignee);
		}).fail(function(code, json){
			promise.reject();
		});
	}

	Consignee.default = function(){
		return Consignee._default;
	}

	Consignee.ready = function(callback){
		Consignee.done(callback);
		if(!Consignee._ready){
			Shop.ready(Consignee.fetch());
			Consignee._ready = true;
		}
		return Consignee;
	}

	Consignee.query = function(id){
		return Consignee._map[id];
	}



	Consignee.create = function(options){
		var consignee = Consignee.query(options.id);
		if(consignee){
			consignee.init(options);
		}else{
			consignee = new Consignee(options);
		}
		return consignee;
	}

	Consignee.forEach =function(callback){
		$.each(Consignee._map, callback);
		return Consignee;
	}

	Consignee.all = function(){
		return Consignee._map;
	}
	Consignee.all.isEmpty = function(){
		return $.isEmptyObject(Consignee._map);
	}

	Consignee.add = function(data){
		return Data.addConsignee(data).done(function(res){
			handle(res);
		});
	}

	Consignee.delete = function(id){
		return Data.delConsignee(id).done(function(res){
			handle(res);
		});
	}

	Consignee.modfiy = function(data){
		return Data.modfiyConsignee(data).done(function(res){
			handle(res);
		})
	}

	Consignee.select = function(id){
		return Data.chsConsignee(id).done(function(res){
			handle(res);
		})
	}


	Consignee._map = {};
	Consignee._default = null;

	var promise = $.Deferred();
	promise.promise(Consignee);

	window['Consignee'] = Consignee;

	return Consignee;

});