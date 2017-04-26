define('h5/js/common/coupon', [
	'jquery',
	'h5/js/common/data'
], function($, Data){
	
	function Coupon(options){
		this.init(options);
		Coupon._map[this.userCouponId] = this;
		if(!this.hasBeenUsed && this.valid){
			Coupon._unUsedCoupons[this.userCouponId] = this;
		}else{
			Coupon._usedCoupons[this.userCouponId] = this;
		}
	}

	Coupon.prototype = {
		init : function(options){
			$.extend(this, options);
			return this;
		}
	}

	Coupon.fetch = function(){
		Data.fetchCouponList().done(function(res){
			$.each(res.unUsedCoupons,  function(index, item){
				Coupon.create(item);
			});
			$.each(res.usedCoupons,  function(index, item){
				Coupon.create(item);
			});
			promise.resolve(Coupon);
		}).fail(function(code, json){
			promise.reject();
		});
		return Coupon;
	}

	Coupon.ready = function(callback){
		Coupon.done(callback);
		if(!Coupon._ready){
			Coupon.fetch();
			Coupon._ready = true;
		}
		return Coupon;
	}

	Coupon.query = function(id){
		return Coupon._map[id];
	}

	Coupon.create = function(options){
		var coupon = Coupon.query(options.userCouponId);
		if(coupon){
			coupon.init(options);
		}else{
			coupon = new Coupon(options);
		}
		return coupon;
	}

	Coupon.canUse = function(price, callback){
		if(Coupon.canUse.price == price){
			callback && $.each(Coupon._canUse, callback);
		}else{
			Coupon.canUse.price = price;
			Coupon._canUse = {};
			$.each(Coupon._unUsedCoupons, function(id, coupon){
				if(coupon.minValue <= price){
					Coupon._canUse[id] = coupon;
					callback && callback(id, coupon);
				}
			});
		}
		return Coupon;
	}

	Coupon.hasCanUse = function(){
		return !$.isEmptyObject(Coupon._canUse);
	}

	Coupon.forEach = function(callback, used){
		$.each(used ? Coupon._usedCoupons : Coupon._unUsedCoupons, callback);
		return Coupon;
	}

	//所有
	Coupon._map = {};
	Coupon._unUsedCoupons = {};
	Coupon._usedCoupons = {};
	Coupon._canUse = {};

	var promise = $.Deferred();
	promise.promise(Coupon);
	
	return Coupon;
});