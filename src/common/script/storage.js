define('h5/js/common/storage', [
    'jquery'
], function($) {

    function Storage(options) {
        this._storage = window.sessionStorage;
        options && $.extend(this, options);
        this._init_object();
    }

    Storage.prototype = {
        isEmpty: function() {
            return ($.isPlainObject(this._object) && $.isEmptyObject(this._object)) || ($.isArray(this._object) && this._object.length == 0);
        },
        _init_object: function() {
            this._object = this.length ? [] : {};
            return this;
        },
        _expire: function() {
            return this.time &&
                this._object._time &&
                ((this._object._time + this.time) < (new Date().getTime()));
        },
        init: function() {
            if (this._inited) {
                return;
            }
            var _object = this._storage[this.id];
            if (_object) {
                try {
                    this._object = JSON.parse(_object);
                    this._expire() && this.clear();
                } catch (ex) {
                    this._init_object();
                }
            } else {
                this._init_object();
            }
            this._inited = true;
            return this;
        },
        get: function(/* key */) {
            this.init();
            return this._expire() ? (this.clear(), null) : arguments.length ? this._object[arguments[0]] : this.isEmpty() ? null : this._object;
        },
        set: function(key, val) {
        	this.init();
        	if(this.length){
        		arguments.length == 1 ? this._object.push(key) : (this._object[key] = val);
        		while(this._object.length > this.length){
        			(typeof val === 'function') ? val.call(this, this._object) : this._object.shift();
        		}
        	}else{
        		arguments.length == 1 ? (this._object = key) : (this._object[key] = val);
        	}
        	if(this.time){
        		this._object._time = new Date().getTime();
        	}
        	this._storage[this.id] = JSON.stringify(this._object);
        	return this;
        },
        clear: function() {
            this._storage.removeItem(this.id);
            this._init_object();
            return this;
        }
    }



    /*if (localStorage['version'] != '201504150000' || URL.param.session == 'expire') {
        localStorage.clear();
        sessionStorage.clear();
        localStorage['version'] = '201504150000';
    }*/



    /*Storage.UserHistoryShop = new Storage({
        id: 'user-history-shop',
        length: 3,
        storage: localStorage
    });*/




    /**
     * 用户定位位置
     * @type {Storage}
     */
    Storage.Position = new Storage({
        id: 'current-position',
        time: 300000
    });
    /**
     * 用户定位位置POS
     * @type {Storage}
     */
    Storage.PositionPois = new Storage({
        id: 'current-position-pois',
        time: 300000
    });

    /**
     * 用户选择的位置
     * @type {Storage}
     */
    Storage.UserSelectLocation = new Storage({
        id: 'user-select-location',
        storage: localStorage,
        length: 3
    });


    Storage.CityShop = new Storage({
     	id : 'city-shops',
     	storage: localStorage,
        time:600000
     });

    Storage.lbsCommunity = new Storage({
        id : 'lbsCommunity',
        storage : sessionStorage,
        time:600000
    });

    /*Storage.ShopInfo = new Storage({
    	id : 'current-shop',
    	storage : localStorage
    })*/

    Storage.Cates = new Storage({
        id:'cates',
        time:600000
    });

    window['Storage'] = Storage;

    return Storage;

});
