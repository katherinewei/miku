define('h5/js/common/shopListDialog', [
    'jquery',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/transDialog',
    'h5/js/common/storage',
    'h5/js/common/location',
    'h5/js/common/locationDialog',
    'h5/js/common/mapDialog'
], function($, Data,  Common, Dialog, Storage, WLocation, WLocationDialog, WLMapDialog) {


    var exports = Dialog.extend({
        attrs: {
            position: null,
            shopList: null,
            onHideDestroy : true
        },
        events: {
            /*'tap .shop': function(event) {
                event.preventDefault();
                var shopId = $(event.currentTarget).data('id');
                if (shopId) {
                    var mapDialog = new WLMapDialog().show().set('shopId', shopId)
                }
            }*/
        },

        setup: function() {
            var S = this;
            S.element.addClass('wl-shop-list-dialog');
            S.$('.dialog-header').html('<span class="location">正在定位...</span>');
            S.$('.dialog-content').html('<div class="unfind-shop-message"></div><div class="shop-list-layout grid"><ul class="grid shop-list"></ul></div>');
            return S;
        },

        render: function() {
            var S = this;
            exports.superclass.render.call(S);
           /* if (!S.get('shopList')) {
                S.set('shopList', Storage.CityShop.get());
            }*/
            //当前地址暂未开通配送服务<br/>换个地址试试吧<a class="button hand-position">选择其他地址</a>
            
            

            if (!S.get('position')) {
            	var doneFn = function(position, pois) {
                    S.set('position', position);
                },
                failFn = function() {
                    S.$('.unfind-shop-message').html('请检查是否允许“微信”访问您的位置<a class="button hand-position">重新定位</a><br/>或者就近选择下列站点');
                    S.$('.dialog-header .location').html('获取用户位置信息失败<i class="iconfont bottom-icon"></i>');

                },
                alwaysFn = function(){
                	/*var position = S.get('position'),
                		shopList = S.get('shopList');
                	if(!shopList){
                		var doneFn = function(shopInfo){
					        	S.set('shopInfo', shopInfo);
					        },
					        alwaysFn = function(){
					        	shopList = Storage.CityShop.get();
					        	if(shopList){
					        		S.set('shopList', shopList);	
					        	}
					        };
                		if(position){
                			Data.setShop(position).done(doneFn).always(alwaysFn);
                		}else{
                			Data.getShop().done(doneFn).always(alwaysFn);	
                		}
				        
                	}*/
                };
                if(S.get('positionFail')){
                	failFn();
                	alwaysFn();
                }else{
                	WLocation.getPosition().done(doneFn).fail(failFn).always(alwaysFn);	
                }
            }
            
            
            S.renderFooter();
            return S;
        },

        renderFooter: function() {
            this.$('.dialog-content').append('<div class="footer"><span class="copyright">米酷&copy;版权所有</span></div>');
            return this;
        },

        _onRenderPosition: function(position) {
            console.log('_onRenderPosition:', position);
            var S = this;
            if (position && !$.isEmptyObject(position)) {
                S.$('.unfind-shop-message').html('当前地址暂未开通配送服务<a class="button hand-position">换个地址试试吧</a><br />或者就近选择下列站点');
            	S.set('positionFail', false);
                S.$('.dialog-header .location').html(position.name + '<i class="iconfont bottom-icon"></i>');
                S.renderDistance();
            }else{
                S.$('.unfind-shop-message').html('请检查是否允许微信定位<br/>并允许果格格使用您的位置信息<a class="button hand-position">重新定位</a>');
            }
            return S;
        },

        _onRenderShopList: function(shopList) {
            var S = this;
            if (shopList) {
                var template = '<li class="shop" id="shop-{{id}}" data-id="{{id}}"><h2>{{name}}</h2><p class="location">{{city}}{{district}}{{location}}</p><p class="tel">电话: {{phone}}</p><div class="distance-layout"></div></li>',
                    html = [];
                    /*,
                    i = 0;*/
                $.each(shopList, function(key, shop) {
                   /* if (i % 2 == 0) {
                        html.push('<li class="row">');
                    }*/
                    html.push(bainx.tpl(template, shop));
                    /*if (i % 2 == 1) {
                        html.push('</li>');
                    }
                    i++;*/
                });
                /*if (i % 2 == 0) {
                    html.push('<div class="col col-50"></div></li>');
                }*/
                if (html.length) {
                    S.$('.shop-list').html(html.join(''));
                    S.renderDistance();
                }
            }
            return S;
        },


        renderDistance: function() {
            var S = this,
                position = S.get('position'),
                shopList = S.get('shopList');

            if (position && shopList) {

                console.log(position);

                var list = [];
                $.each(shopList, function(key, shop) {
                    if (shop.lbs) {
                        var coords = shop.lbs.split(',');
                        if (coords.length >= 2) {
                            var distance = WLocation.getGreatCircleDistance(position.lng, position.lat, coords[0], coords[1]),
                                distanceHtml = WLocation.morkm(distance).replace(/([\d])([km])/, function(q, w, e, r) {
                                    return w + '<br/>' + e
                                });
                            var element = S.$('#shop-' + shop.id).addClass('distance-reckon');
                            element.find('.distance-layout').html(distanceHtml);
                            list.push({
                                distance : distance,
                                element : element
                            });
                        }
                    }
                });
                for(var i=0,len=list.length; i<len; i++){
                    for(var j=i;j<len;j++){
                        if(list[i].distance < list[j].distance){
                            var tmp = list[i];
                            list[i] = list[j];
                            list[j] = tmp;
                        }
                    }
                }
                /*list.sort(function(a,b){
                    return a.distance < b.distance;
                });*/
                var ul = S.$('.shop-list');
                $.each(list, function(index, item){
                    ul.prepend(item.element);
                });
            }
            return S;
        },

        

    });

    return exports;
});
