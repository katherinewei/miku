define('h5/js/common/location', [
    'jquery',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/storage',
    'h5/js/common/weixin',
    'h5/js/common/waitting',
    'h5/js/common/map'
], function($, Data, Common, Storage, Weixin, Wait, Map) {
    var GPS = 'gps',///现场给第三方
        LBS = 'lbs';

    function reGeocoder(coords, radius) {
        var pomi = $.Deferred();
        Wait.show('正在加载...', pomi);
        Map.ready(function(AMap){
            AMap.service(["AMap.Geocoder"], function() {
                var geocoder = new AMap.Geocoder({
                        radius: radius || 3000,
                        extensions: 'all'
                    }),
                    lnglat = new AMap.LngLat(coords.longitude || coords.lng, coords.latitude || coords.lat);

                geocoder.getAddress(lnglat, function(status, res) {
                    if (status === 'complete' && res.info === 'OK' && res.regeocode) {
                        console.log('逆地址编码：', res);
                        if(res.regeocode && res.regeocode.addressComponent && res.regeocode.pois && res.regeocode.pois.length){
                            var pois = [];
                            $.each(res.regeocode.pois, function(index, poi){
                                pois.push(poiTrans(poi, res.regeocode.addressComponent));
                            });
                            pomi.resolve(pois.shift(), pois);
                        }else{
                            if(res.regeocode.addressComponent){
                                var poi = poiTrans({
                                    location:lnglat,
                                    name : res.regeocode.formattedAddress
                                }, res.regeocode.addressComponent);
                                pomi.resolve(poi, []);
                            }else{
                                pomi.reject();  
                            }
                        }
                    } else {
                        pomi.reject(status, res);
                    }
                });
            });
        });
        
        return pomi;
    }

    function getLocation(options) {

    	if(getLocation.pomi && (!options || !options.force)){
    		return getLocation.pomi;
    	}

        console.log('正在定位...', options);

        getLocation.canceled = false;

        var pomi = $.Deferred(),
        	sid;

        Wait.show('正在定位...', pomi);

        function trans(gps) {
            console.log('位置成功://'+gps);
            if(gps.coords){
                gps = {
                    lat : gps.coords.latitude,
                    lng : gps.coords.longitude
                };
            }
            !getLocation.canceled && lbsTrans(gps).done(function(coords) {
                !getLocation.canceled && pomi.resolve(coords);
            }).fail(function() {
                !getLocation.canceled && pomi.reject();
            });
        }
        
        // lin 2015-10-27 
        function gderr(arr){
            console.log('位置失败://'+arr);
        }
        
        if (Common.isDebug && !Common.inWeixin) {
            console.log('测试时使用模拟LBS坐标');
            trans({
                latitude: 32.419045, //30.917419,  //30.317419,   //120.299402,30.419045
                longitude: 120.299402 //120.351894
            });
        } else if (Common.inWeixin) {
            console.log('须要使用微信JSDK获取坐标');
            Weixin.getLocation().done(function(res) {
                trans(res);
            }).fail(function() {
                !getLocation.canceled && pomi.reject();
            });
        } else {
            console.log('HTML5定位功能获取坐标');
            
            navigator.geolocation.getCurrentPosition(trans,gderr); 
        }

        pomi.always(function(){
        	clearTimeout(sid);
            setTimeout(function(){
                getLocation.pomi = null;
            },0);
        });

        sid = setTimeout(function(){
            console.log('定位超时');
        	pomi.reject({msg:'time out', timeout:true});
        }, options && options.timeout || 5000);

        getLocation.pomi = pomi;
        getLocation._sid = sid;
        return pomi;
    }
    getLocation.cancel = function(){
        clearTimeout(getLocation._sid);
        getLocation.canceled = true;
        getLocation.pomi && getLocation.pomi.reject({msg:'cancel location', cancel:true});
    }



    function getPosition(options) {
        var pomi = $.Deferred();

        

        Wait.show('正在定位...', pomi);
        if(!options || !options.force){
        	var position = Storage.Position.get(),
        		pois = Storage.PositionPois.get();
        }

        if (position) {
            pomi.resolve(position, pois || []);
        } else {
            
            Common.statistics('lbs', 'position', 'invoke', 1);
            var startTime = new Date().getTime();
            
            getLocation(options).done(function(coords) {
                /*coords = {
                    lat : 30.419045,
                    lng : 120.299402
                }*/
                
                Common.statistics('lbs', 'reGeocoder', 'invoke', 1);

                reGeocoder(coords).done(function(position, pois) {
                    Storage.Position.set(position);
                    Storage.PositionPois.set(pois);
                    
                    Common.statistics('lbs', 'position', 'success', new Date().getTime() - startTime);

                    pomi.resolve(position, pois);

                }).fail(function(status, res) {
                    pomi.reject();
                });
            }).fail(function() {
                pomi.reject();
            });
        }
        return pomi;
    }

    function placeSearch(options) {
        var pomi = $.Deferred();
        Wait.show('正在加载...', pomi);
        var MSearch,
            data = {
                pageSize: options && options.pageSize || 20,
                pageIndex: options && options.pageIndex || 1,
                city: options && options.city || '0571',
                keyword: options && options.keyword || options.toString(),
                extensions: 'all'
            };
        Map.ready(function(AMap){
            AMap.service(["AMap.PlaceSearch"], function() {
                MSearch = new AMap.PlaceSearch(data);
                //关键字查询
                MSearch.search(data.keyword, function(status, result) {
                    if (status === 'complete' && result.info === 'OK') {
                        console.log('PlaceSearch', result);
                        var pois = [];
                        $.each(result.poiList.pois, function(index, poi){
                        	//console.log(index, poi);
                        	pois.push(poiTrans(poi));
                        });
                        
                        pomi.resolve({
                        	count : result.poiList.count,
                        	pageIndex : result.poiList.pageIndex,
                        	pageSize : result.poiList.pageSize,
                        	pois : pois
                        }, data);
                    } else {
                        pomi.reject(status, result, data);
                    }
                });
            });
        });
        return pomi;
    }

    function lbsTrans(coords) {
        return Data.lbsTrans(coords.lat || coords.latitude, coords.lng || coords.longitude);
    }

    var EARTH_RADIUS = 6378137.0; //单位M  
    var PI = Math.PI;

    function getRad(d) {
        return d * PI / 180.0;
    }

    /** 
     * caculate the great circle distance 
     */
    function getGreatCircleDistance(lng1, lat1, lng2, lat2) {
        //console.log(lng1, lat1, lng2, lat2)
        var radLat1 = getRad(lat1);
        var radLat2 = getRad(lat2);

        var a = radLat1 - radLat2;
        var b = getRad(lng1) - getRad(lng2);

        var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
        s = s * EARTH_RADIUS;
        s = Math.round(s * 10000) / 10000.0;

        s = parseInt(s);
        
        return s;
    }

    function morkm(s){
        return  s > 1000 ? ((s / 1000).toFixed(1) + 'km') : (s + 'm')
    }
    function poiToHtml(poi, template){
    	var tpl = template || '<li class="poi-item" data-addrgeo="{{addrgeo}}" data-businessArea="{{businessarea}}" data-direction="{{direction}}" data-distance="{{distance}}" data-id="{{id}}" data-lat="{{lat}}" data-lng="{{lng}}" data-name="{{name}}" data-tel="{{tel}}" data-type="{{type}}" data-email="{{email}}" data-pcode="{{pcode}}" data-website="{{website}}" data-adcode="{{adcode}}" data-city="{{city}}" data-citycode="{{citycode}}" data-district="{{district}}" data-province="{{province}}" data-street="{{street}}" data-streetnumber="{{streetNumber}}" data-township="{{township}}"><h3>{{name}}</h3><h4>{{district}}{{addrgeo}}</h4></li>';
	    return bainx.tpl(tpl, poi);
    }

    function getPoiValue(view) {
        var data = {};

        if (window.Zepto) {
            var keys = ['id', 'addrgeo', 'businessarea', 'direction', 'distance', 'lat', 'lng', 'name', 'tel', 'type', 'email', 'pcode', 'website', 'adcode', 'city', 'citycode', 'district','province','street','streetnumber', 'township'];
            $.each(keys, function(index, key) {
                data[key] = view.data(key);
            });
        }
        if (window.jQuery) {
            data = view.data();
        }
        data.latitude = data.lat;
        data.longitude = data.lng;
        return data;
    }

    function poiTrans(poi, component) {
    	if(!component){
    		component = {};
    	}
    	return {
    		//address: poi.address, 							//"学林街412"
            addrgeo : poi.address,
	        businessarea: poi.businessArea, 				//"下沙"
	        direction: poi.direction, 						//"西北"
	        distance: poi.distance, 						//73 
	        id: poi.id, 									//"B0FFF0E9GF"
	        lat: poi.location.getLat(),
            latitude : poi.location.getLat(),
	        lng: poi.location.getLng(),
            longitude : poi.location.getLng(),
	        name: poi.name, 								//"浙江理工大学(北3门)"
	        tel: poi.tel, 									//""
	        type: poi.type, 								//"科教文化服务;学校;高等院校"
	        email:poi.email,
	        pcode:poi.pcode,
	        website:poi.website,

	        adcode: poi.adcode || component.adcode, 		//"330104"
	        /*building: component.building, 				//""
	        buildingType: component.buildingType, 			//""
	        businessAreas: Array[1] */
	        city: poi.cityname || component.city, 			//"杭州市"
	        citycode: poi.citycode || component.citycode,	//"0571"
	        district: poi.adname || component.district, 	//"江干区"
	        //neighborhood: component.neighborhood, 			//""
	        //neighborhoodType: component.neighborhoodType, 	//""
	        province: poi.pname || component.province,		//"浙江省"
	        street: component.street, 						//"学源街"
	        streetnumber: component.streetNumber, 			//"B13号楼"
	        township: component.township, 					//"白杨街道"
    	};
    }


    Common.location = {
        morkm : morkm,
        reGeocoder: reGeocoder,
        placeSearch: placeSearch,
        getLocation: getLocation,
        getPosition: getPosition,
        GPS: GPS,
        LBS: LBS,
        lbsTrans: lbsTrans,
        poiToHtml : poiToHtml,
        poiTrans: poiTrans,
        getPoiValue : getPoiValue,
        getGreatCircleDistance: getGreatCircleDistance
    };

    return Common.location;

});
