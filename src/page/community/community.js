/**
 * 选择小区页
 */
define('h5/js/page/community', [
    'jquery',
    'h5/js/common',
    'h5/js/widget/page'
], function($, Global, Page) {
    var Template = Global.Template;

    var notHasAutoCompleteResult = "π__π 亲,人家找不到结果!<br />要不试试：<br />1.请确保所有字词拼写正确<br />2.尝试不同的关键字<br />3.尝试更宽泛的关键字";

    var poiTemplate = '<li class="result-item row " data-id="{{id}}" data-addcode="{{adcode}}" data-addrgeo="{{address}}" data-district="{{adname}}" data-citycode="{{citycode}}" data-city="{{cityname}}" data-name="{{name}}" data-pcode="{{pcode}}" data-province="{{pname}}" data-postcode="{{postcode}}" data-tel="{{tel}}" data-type="{{type}}" data-latitude="{{latitude}}" data-longitude="{{longitude}}" data-gps="{{gps}}"><h3>{{name}}</h3><h4>{{cityname}}{{adname}}{{address}}</h4></li>';

    var positioning = '<div class="position-msg pd-10 tc">正在定位...</div>',
        positionError = '<div class="position-msg pd-10 tc">定位失败</div>';

    return function(){

        var S = new Page({
            id: 'communityPage',
            bar: 'user-bar',
            template: Template.page,
            title: '请选择区域',
            city: '0571',
            radius : 3000,
            events: {
                'focus .keyword': function(event) {
                    S.startAutoSearch();
                },
                'blur .keyword': function(event) {
                    S.stopAutoSearch();
                },
                'tap .result-item': function(event) {
                    var data = {},
                        item = $(event.currentTarget);
                    if(window.jQuery){
                        data = item.data();
                    }else if(window.Zepto){
                        var dataAttrs = [
                            'id','addcode','addrego','district','citycode','city','name','gps',
                            'pcode','province','postcode','tel','type','latitude','longitude'
                        ];
                        dataAttrs.forEach(function(attr,index){
                            data[attr] = item.data(attr);
                        });
                    }
                    S.set('value', data);
                    S.hide().done(function(){
                        S.destroy();
                    });
                },
                'tap .relocation':function(event){
                    S.getLocation();
                }
            }
        }).after('render', function() {
            S.initContent();
        }).after('hide', function(){
            S.$('.result').html('');
            S.$('.keyword').val('');
            S.$('.result-layout').hide();
        }).after('show', function() {
            //定位, 成功时设置coords
            S.getLocation();
        }).on('change:coords', function(coords) {
            //当定位改变的时候
            if(coords){
                var fn = function(cd, gps){
                    S.reGeocoder(cd).done(function(regeocode){
                        S.applyReGeocode(regeocode, gps);
                    }).fail(function(){
                        console.log('获取定位点逆地址编码信息失败！',arguments);
                    });
                };
                Global.Data.lbsTrans(coords).done(function(gdcoords){
                    if(gdcoords && gdcoords.lg && gdcoords.lt){
                        var gdcd = {
                            latitude : gdcoords.lt || coords.latitude,
                            longitude : gdcoords.lg || coords.longitude
                        };
                        console.log(gdcoords, '使用转换后的坐标', coords);
                        fn(gdcd);
                    }else{
                        console.log(coords, '使用GPS坐标');
                        fn(coords, 'gps');
                    }
                }).fail(function(){
                    console.log(coords, '使用GPS坐标');
                    fn(coords, 'gps');
                });
            }
        }).on('change:value', function(value){
            console.log('new value:',value);
        });

        S.applyReGeocode = function(regocode, gps){
            var component = regocode.addressComponent;
            //应用城市
            S.set('city', component.citycode);
            //应该定位点数据
            console.log(regocode);

            if(regocode.pois && regocode.pois.length){
                var html = [];
                regocode.pois.forEach(function(poi, index){
                    poi.adcode = component.adcode;
                    poi.cityname = component.city;
                    poi.citycode = component.citycode;
                    poi.adname = component.district;
                    poi.pname = component.province;
                    poi.street = component.street;
                    poi.streetNumber = component.streetNumber;
                    poi.township = component.township;
                    poi.latitude = poi.location.lat;
                    poi.longitude = poi.location.lng;
                    poi.gps = gps || '';
                    html.push(bainx.tpl(poiTemplate, poi));
                });
                //将第一个poi做为定位点的poi信息
                //其他poi数据做为附近poi信息
                S.$('.location-result').show().find('.result').html(html.shift());
                html.length &&
                S.$('.nearby-result').show().find('.result').html(html.join(''));
                
                S.$('.location-msg').hide();
                //S.$('.location-result-layout').show();
            }

            //应用定位点附近poi数据
            

        };

        S.initContent = function(){
            S.scrollPanel = S.$('.page-scroll-panel').html(Template.communityPageContent);
            S.$('.page-content').prepend(Template.communityKeywordBox);
            S.scrollContainer = S.$('.scroll-container');
            S.bindResultLayoutScrollEvent();
            return S;
        };

        

        

        S.bindResultLayoutScrollEvent = function(){
            S.scrollPanel.on('scroll', scrollEventFn);
            return S;
        };

        S.unbindResultLayoutScrollEvent = function(){
            S.scrollPanel.off('scroll', scrollEventFn);
            return S;
        };

        function scrollEventFn(event){
            clearTimeout(scrollEventFn._id);
            scrollEventFn._id = setTimeout(function(){
                scrollEventSetTimeOutFn(event);
            }, 200);
        }

        function scrollEventSetTimeOutFn(event){
            if(!S.canNextLoad){ return; }
            var st = S.scrollPanel.scrollTop(),
                sp = S.scrollPanel.height(),
                ch = S.scrollContainer.height();
            //console.log(st, sp, ch);
            if(ch - sp < st){
                S.canNextLoad.pageIndex ++;
                S.placeSearch(S.canNextLoad).done(S.searchDoneFn).fail(S.searchFailFn);
            }
        }

        S.searchDoneFn = function(poiList, data){
            if(poiList.pageIndex * poiList.pageSize < poiList.count){
                S.canNextLoad = data;
            }else{
                S.canNextLoad = false;
            }
            console.log(poiList);
            if(poiList.pois && poiList.pois.length){
                var html = [];
                poiList.pois.forEach(function(poi){
                    poi.latitude = poi.location.lat;
                    poi.longitude = poi.location.lng;
                    html.push(bainx.tpl(poiTemplate, poi));
                });
                if(poiList.pageIndex > 1 ){
                    S.$('.search-result .result').append(html.join(''));
                }else{
                    var rl = S.$('.search-result').show();
                        rl.find('.result').html(html.join(''));
                    var rlot = rl.offset().top,
                        psp = S.$('.page-scroll-panel'),
                        psppt = parseInt(S.$('.scroll-container').css('padding-top')) || 0,
                        pspst = psp.scrollTop();

                    var st = rlot + pspst - psppt;

                    //console.log(rlot, psppt, pspst, st, 'ooo');
                    
                    psp.scrollTop(st);
                    
                }
            }else{
                S.$('.search-result').show().find('.result').html(notHasAutoCompleteResult);
            }
            return S;
        };

        S.searchFailFn = function(status, result, data){
            S.canNextLoad = false;
            console.log(arguments);
            if(status === 'no_data'){
                if(data.pageIndex === 1){
                    S.$('.search-result .result').html(notHasAutoCompleteResult);
                }
            }
        };

        S.startAutoSearch = function() {
            var input = S.$('.keyword');
            var keyword = input.val();

            S._autoSearchSetIerval_id = setInterval(function() {
                var val = input.val();
                if (val !== keyword) {
                    if(val){
                        S.placeSearch(val).done(S.searchDoneFn).fail(S.searchFailFn);
                    }else{
                        S.$('.search-layout').show().find('.result').html(notHasAutoCompleteResult);
                    }
                    keyword = val;
                }
            }, 500);
        };

        S.stopAutoSearch = function() {
            clearInterval(S._autoSearchSetIerval_id);
        };

        S.getLocation = function() {
            var msg = S.$('.location-msg').text('开始定位').removeClass('relocation').removeClass('button').removeClass('mg-10'),
                slh = ['......','.....','....','...','..','.'];

            var countDown = new Global.CountDown({
                    time: 20,
                    change: function(){
                        msg.text('正在定位'+ slh[(this.time % slh.length)]);
                        return this;
                    },
                    end: function() {
                        S && S.element && S.$('.location-msg').text('重新定位').addClass('relocation').addClass('button').addClass('mg-10');
                        return this;
                    }
                });
                countDown.start();
            //Global.isDebug = true;
            if(Global.isDebug){
                setTimeout(function(){
                    S.set('coords',{"latitude":30.242297,"longitude":120.021542});

                    //S.set('coords', {latitude:30.234, longitude:120.025});
                }, Math.floor(Math.random() * 2000));
                
            }else{
                Global.getLocation().done(function(coords){
                    //window.confirm('latitude:'+ coords.latitude +',longitude:'+coords.longitude);
                    S.set('coords', coords);
                }).fail(function(res){
                    /*if(res && res.error){
                        bainx.broadcast('定位失败:'+res.error);
                    }*/
                    countDown.clear();
                    if(res.errMsg === 'timeout'){
                        msg.text('重新定位').addClass('relocation button mg-10');
                    }else{
                        bainx.broadcast('定位失败！'); //'定位失败：'+ res.errMsg);
                        msg.hide();
                    }
                });
            }
        };

        S.placeSearch = function(options) {
            var pomi = $.Deferred();
            var MSearch,
                data = {
                    pageSize : options && options.pageSize || 20,
                    pageIndex : options && options.pageIndex || 1,
                    city : options && options.city || S.get('city') || '0571',
                    keyword : options && options.keyword || options.toString(),
                    extensions : 'all'
                };
            AMap.service(["AMap.PlaceSearch"], function() {
                MSearch = new AMap.PlaceSearch( data );
                //关键字查询
                MSearch.search(data.keyword, function(status, result) {
                    console.log(arguments);
                    if (status === 'complete' && result.info === 'OK') {
                        pomi.resolve(result.poiList, data);
                    } else {
                        pomi.reject(status, result, data);
                    }
                });
            });
            return pomi;
        };

        S.reGeocoder = function(coords){
            var pomi = $.Deferred();
            AMap.service(["AMap.Geocoder"], function() {
                var geocoder = new AMap.Geocoder({
                        radius : S.get('radius') || 3000,
                        extensions : 'all'
                    }),
                    lnglat = new AMap.LngLat(coords.longitude, coords.latitude);

                geocoder.getAddress(lnglat, function(status, result){
                    if(status === 'complete' && result.info === 'OK' && result.regeocode){
                        result.regeocode.location = lnglat;
                        console.log('逆地址编码：', result);
                        pomi.resolve(result.regeocode);
                    }else{
                        pomi.reject(status, result);
                    }
                });
            });
            return pomi;
        };
        return S;

    };


});
