/**
 * 定位用户站点
 */
define('h5/js/common/shop', [
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/common/storage',
    'h5/js/common',
    'h5/js/common/location',
    'h5/js/common/shopListDialog',
    'h5/js/common/locationDialog',
    'h5/js/common/waitting',
], function($, URL, Data, Storage, Common, WLocation, WLShopListDialog, WLocationDialog, Wait) {


    function Shop(options){
        this.init(options);
        Shop._map[this.id] = this;
    }

    Shop.prototype = {
        init : function(options){
            $.extend(this, options);
            var coords = this.lbs.split(',');
            this.coords = {
                lat : coords[1],
                lng : coords[0]
            };
            return this;
        }
    }

    Shop._map = {};

    Shop.forEach = function(callback){
        $.each(Shop._map, callback);
        return Shop;
    }

    Shop.query = function(id){
        return Shop._map[id];
    }

    Shop.currentShop = function(){
        return Shop._currentShop;
    }
    Shop.currentPosition = function(){
        return Shop._currentPosition;
    }

    Shop.create = function(options){
        var shop = Shop.query(options.id);
        if(shop){
            shop.init(options);
        }else{
            shop = new Shop(options);
        }
        return shop;
    }

    Shop.ready = function(callback){
        Shop.ready.callback = callback;
        Shop.done(callback);
        if(!Shop._ready){
            Shop.fetch().done(function(res){
                //alert(JSON.stringify(res));
                var data = handle(res);
                //alert(JSON.stringify(data));
                if(data){
                    Shop._currentPosition = data.position;
                    Shop._currentShop = data.shop;
                    if(data.position && data.position.id){
                        Storage.UserSelectLocation.set(Shop._currentPosition);
                    }
                    if(Shop._promise.state() == 'pending'){
                        Shop._promise.resolve(Shop._currentShop);
                    }else if($.isFunction(Shop.ready.callback)){
                        Shop.ready.callback(Shop._currentShop);
                    }
                }else{
                    WLocation.getPosition().fail(function(){
                        showShopListDialog();
                        /*showLocationDialog({
                            onRenderLocation : false
                        });*/
                    }).done(PositionSetCurrentShop);
                }
            }).fail(function(){
                WLocation.getPosition().fail(function(){
                    showShopListDialog();
                    /*showLocationDialog({
                        onRenderLocation : false
                    });*/
                }).done(PositionSetCurrentShop);
            });
            Shop._ready = true;
        }
        return Shop;
    }

    Shop.switch = function(){
        showLocationDialog({enableClose:true, closeNotShowShopList:true});
    }


    Shop.fetch = function(){
//        return $.Deferred();
        return Data.getShop();
    }

    Shop._promise = $.Deferred();
    Shop._promise.promise(Shop);


    function handle(res){
        if(res){
            var _currentShop,
                _currentPosition;

            if(res.cityCommunity && res.cityCommunity.length){
                $.each(res.cityCommunity, function(index, item){
                    var shop = Shop.create(item);
                });
            }
            if($.isPlainObject(res.currentCommunity)){
                _currentShop = Shop.create(res.currentCommunity);
            }
            if(res.currentLocation){
                try{
                    _currentPosition = JSON.parse(decodeURIComponent(res.currentLocation));
                }catch(ex){
                    console.log(ex);   
                }
            }
            if(_currentShop){ // && _currentPosition){
                
                
                return {
                    shop : _currentShop,
                    position : _currentPosition
                }
            }
        }
        return false;
    }
    


    function PositionSetCurrentShop(position){
        var pomi = Data.setShop(position).done(function(res){
            var data = handle(res);
                if(data){
                    Shop._currentPosition = data.position;
                    Shop._currentShop = data.shop;
                    if(data.position.id){
                        Storage.UserSelectLocation.set(Shop._currentPosition);
                    }
                    if(Shop._promise.state() == 'pending'){
                        Shop._promise.resolve(Shop._currentShop);
                    }else if($.isFunction(Shop.ready.callback)){
                        Shop.ready.callback(Shop._currentShop);
                    }
                }else{
                    showShopListDialog(position);
                }
        }).fail(function(){
            showShopListDialog(position);
        });
        Wait.show('正在查找服务站点...', pomi);
        return pomi;
    }
    

    function showLocationDialog(options){
        return new WLocationDialog($.extend({
            id: 'wl-location-dialog',
            events:{
                'tap .dialog-close':function(event){
                    event.preventDefault();
                    if(!this.get('closeNotShowShopList')){
                        showShopListDialog();
                    }
                    this.hide();
                }
            }
        }, options)).show().on('value', function(value) {
            if(this.rendered){
                var S = this;
                PositionSetCurrentShop(value).always(function(){
                    S.hide();
                });
            }
        });
    }

    function showShopListDialog(position){
        new WLShopListDialog({
            id: 'wl-shop-list-dialog',
            position : position || null,
            shopList : Shop._map,
            events: {
                'tap .dialog-header,.hand-position': function(event) {
                    event.preventDefault();
                    showLocationDialog({
                        enableClose : true
                    });
                    this.hide();
                },
                'tap .shop':function(event){
                    event.preventDefault();
                    var target = $(event.currentTarget),
                        shopId = target.data('id'),
                        shopInfo = Shop.query(shopId),
                        position = this.get('position'),
                        data = position && $.extend({}, position) || {};

                    if(position && position.name){
                        data.warning ='用户定位成功，但实际位置信息与站点位置不匹配！';
                    }else{
                        data.name = '获取位置信息失败';
                        data.warning ='用户定位失败，实际位置信息与站点位置不匹配！';
                    }
                    if(shopInfo){
                        data.cid = shopId;
                    }
                    var S = this;
                    PositionSetCurrentShop(data).always(function(){
                        S.hide();
                    });
                    

                }
            }
        }).show();
    }

    window['Shop'] = Shop;

    return Shop;

});
