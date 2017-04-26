define('h5/js/common/locationDialog', [
    'jquery',
    'h5/js/common',
    'h5/js/common/transDialog',
    'h5/js/common/storage',
    'h5/js/common/location'
], function($, Common, Dialog, Storage, WLocation) {

    var notHasAutoCompleteResult = "π__π 亲，人家找不到结果！<br />要不试试：<br />1.请确保所有字词拼写正确<br />2.尝试不同的关键字<br />3.尝试更宽泛的关键字",
    	positionFailHtml = '<li class="location-null-msg">π__π 亲，定位失败了哟！<br/>试试“重新定位”或者输入关键字搜索</li>';

    var exports = Dialog.extend({
        attrs: {
            enableClose:true,
            onHideDestroy : true,
            onRenderLocation : true,
        },
        events: {
            'focus .keyword': function(event) {
                event.preventDefault();
                this.startAutoSearch();
            },
            'blur .keyword': function(event) {
                event.preventDefault();
                this.stopAutoSearch();
            },
            'tap .poi-item': function(event) {
                event.preventDefault();
                this.$('.keyword').blur();
                var poi = WLocation.getPoiValue($(event.currentTarget));
                this.trigger('value', poi);
                //WLocation.getLocation.cancel();
                //this.getResultItemValue($(event.currentTarget));
            },
            'tap .relocation':function(event){
            	event.preventDefault();
            	var force = $(event.currentTarget).data('force');
            	this.location({
            		force : force
            	});
            },
            'tap .clear-history':function(event){
            	event.preventDefault();
            	Storage.UserSelectLocation.clear();
            	this.$('.history-result').removeClass('show').find('ul').html('');
            }
        },
        setup: function() {
            console.log(Date.now());
        	var S = this;
        	exports.superclass.setup.call(this);
            this.element.addClass('wl-location-dialog');
            this.before('show', function(){
                this.$('.result-scroll-title').empty();
            }).after('hide', function(){
                WLocation.getLocation.cancel();
            });
        	return S;
        },
        render: function() {
            var S = this;
            exports.superclass.render.call(S);
            S.renderSearch().renderResultModuleElement().renderHistory();
            if(S.get('onRenderLocation')){
                S.location();
            }
            var scroll_event_sid,
                scrollContentBody = S.$('.scroll-content-body'),

                titleLayout = S.$('.result-scroll-title'),

                //titleLayoutOffsetTop = titleLayout.offset().top,

                content = S.$('.dialog-content').on('scroll', function(event) {

                    S.$('.result-layout.show').each(function(index,element){
                        var $this = $(this),
                            offset = $this.offset(),
                            lineY = titleLayout.offset().top + 5;
                        //console.log($this.attr('class'), offset, titleLayout.offset().top, event);
                        if(offset.top < lineY && (offset.top + offset.height) > lineY){
                            titleLayout.empty().append($this.find('h2').clone());
                            return false;
                        }
                    });

                    

                    if (!S._canNextLoad) return;
                    clearTimeout(scroll_event_sid);
                    scroll_event_sid = setTimeout(function() {
                        if (scrollContentBody.height() <= content.height() * 1.5 + content.scrollTop()) {
                            //console.log('继续加载...');
                            if(S._canNextLoad){     //异步后可能S._canNextLoad = null
                                S._canNextLoad.pageIndex++;
                                WLocation.placeSearch(S._canNextLoad).done(function(pois, data) {
                                    S.placeSearchDoneFn(pois, data);
                                }).fail(function(status, result, data) {
                                    S.placeSearchFailFn(status, result, data);
                                });
                            }
                        }
                    }, 200);
                });
                //contentPaddingTop = parseInt(content.css('padding-top'));

            return S;
        },

        location: function(options) {
            var S = this,
            	locationResult = S.$('.location-result').removeClass('show'),
                nearbyResult = S.$('.nearby-result').removeClass('show');


            WLocation.getPosition(options).done(function(position, pois) {
                var html = [];
                clearTimeout(locationResult.data('sid'));
                locationResult.addClass('show').find('ul').html(WLocation.poiToHtml(position));
                
                //locationResult.show().find('ul').html(bainx.tpl(lbsItemTemplate, position));
                
                $.each(pois, function(index, poi) {
                    //html.push(bainx.tpl(lbsItemTemplate, poi));
                    html.push(WLocation.poiToHtml(poi));
                });
                if (html.length) {
                    nearbyResult.addClass('show').find('ul').html(html.join(''));
                } else {
                    nearbyResult.removeClass('show');
                }

            }).fail(function() {
                clearTimeout(locationResult.data('sid'));
                locationResult.data('sid',setTimeout(function(){
                    locationResult.addClass('show').find('ul').html(positionFailHtml);
                },500));
                nearbyResult.removeClass('show');
            });

            return S;
        },

        renderSearch: function() {
            this.$('.dialog-header').addClass('grid').html('<h1 class="keyword-title">请输入地址</h1><div class="keyword-layout row"><div class="city col col-6 fb fvc"><p><!--杭州--><i class="iconfont right-icon"></i></p></div><div class="col col-19"><input type="text" class="keyword" placeholder="搜索关键字"></div></div></div><div class="result-scroll-title"></div>');
            return this;
        },

        renderHistory: function(){
        	var S = this;
        	var historyLocation = Storage.UserSelectLocation.get();
        	console.log(historyLocation);
        	if($.isArray(historyLocation) && historyLocation.length){
        		var html = [], repeat={};
        		$.each(historyLocation, function(index, poi){
        			if(poi.id && repeat[poi.id]){
        				return;	
        			}
        			repeat[poi.id] = poi;
        			html.push(WLocation.poiToHtml(poi));
        		});
        		S.$('.history-result').addClass('show').find('ul').html(html.join(''));
        	}else{
        		S.$('.history-result').removeClass('show');
        	}
        	return S;
        },

        renderResultModuleElement: function() {
            var template = '<div class="result-layout {{className}}"><h2>{{title}}</h2><ul></ul></div>',
                data = [{
                    className: 'history-result',
                    title: '历史位置'
                }, {
                    className: 'location-result',
                    title: '定位位置'
                }, {
                    className: 'nearby-result',
                    title: '附近位置'
                }, {
                    className: 'search-result',
                    title: '搜索位置'
                }],
                html = ['<div class="scroll-content-body">'];
            $.each(data, function(index, item) {
                html.push(bainx.tpl(template, item));
            });
            html.push('</div>');
            this.$('.dialog-content').html(html.join(''));
            this.$('.search-result').css('min-height', $(window).height());
            this.$('.history-result h2').addClass('clearfix').append('<span class="clear-history">清除历史</span>');
            this.$('.location-result h2').addClass('clearfix').append('<span class="relocation" data-force="1">重新定位</span>');
            return this;
        },

        startAutoSearch: function() {
            var S = this,
                input = S.$('.keyword'),
                keyword = input.val();

            S._autoSearchSetIerval_id = setInterval(function() {
                var val = input.val();
                if (val !== keyword) {
                    if (val) {
                        WLocation.placeSearch(val).done(function(pois, data) {
                            S.placeSearchDoneFn(pois, data);
                        }).fail(function(status, result, data) {
                            S.placeSearchFailFn(status, result, data);
                        });
                    } else {
                        S.$('.search-layout').addClass('show').find('ul').html(notHasAutoCompleteResult);
                    }
                    keyword = val;
                }
            }, 500);

            return S;
        },

        stopAutoSearch: function() {
            clearInterval(this._autoSearchSetIerval_id);
            return this;
        },

        getResultItemValue: function(view) {
            var data = {};

            if (window.Zepto) {
                var keys = ['id', 'addcode', 'addrgeo', 'district', 'citycode', 'city', 'name', 'pcode', 'province', 'postcode', 'tel', 'type', 'lat', 'lng', 'gps'];
                $.each(keys, function(index, key) {
                    data[key] = view.data(key);
                });
            }
            if (window.jQuery) {
                data = view.data();
            }

            this.trigger('value', data);
            //this.set('value', data, {override:true});

            return this;
        },

        placeSearchDoneFn: function(poiList, data) {
            var S = this;
            if (poiList.pageIndex * poiList.pageSize < poiList.count) {
                S._canNextLoad = data;
            } else {
                S._canNextLoad = false;
            }
            console.log(poiList);
            if (poiList.pois && poiList.pois.length) {
                var html = [],
                    target = S.$('.search-result');

                poiList.pois.forEach(function(poi) {
                    /*poi.latitude = poi.location.lat;
                    poi.longitude = poi.location.lng;*/
                    //html.push(bainx.tpl(lbsItemTemplate, poi));
                    html.push(WLocation.poiToHtml(poi));
                });
                if (poiList.pageIndex > 1) {
                    target.addClass('show').find('ul').append(html.join(''));
                } else {
                    target.addClass('show').find('ul').html(html.join(''));
                    //滚动到搜索的位置
                    var ttop = target.offset().top,
                    	dc = S.$('.dialog-content'),
                    	dct = parseInt(dc.css('padding-top')) || 0,
                    	dcst = dc.scrollTop();
                    dc.scrollTop(ttop + dcst - dct);
                }
            } else {
                target.addClass('show').find('ul').html(notHasAutoCompleteResult);
            }

            return S;
        },

        placeSearchFailFn: function(status, result, data) {
            var S = this;
            S._canNextLoad = false;
            console.log(arguments);
            if (status === 'no_data' && data.pageIndex === 1) {
                S.$('.search-result').addClass('show').find('ul').html(notHasAutoCompleteResult);
            }
            return S;
        }

    });

    return exports;
});
