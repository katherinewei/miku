define('h5/js/common/nexter', [
    'jquery',
    'widget'
], function($, Widget) {
    var exports = Widget.extend({
        attrs: {
            hasNext: true,
            pageIndex: 0,
            pageSize: 10,
            dataSource: null,
            data: {},
            template: '<div><ul></ul></div>',
            enableScrollLoad: false,
            scrollLoadTimeoutId: 0
        },
        setup: function() {
            var S = this;
            S.element.addClass('wl-nexter');
            if (S.get('enableScrollLoad')) {
                var scrollEventBindElement = S.get('scrollEventBindElement') || S.element;
                var scrollBodyContent = S.get('scrollBodyContent') || S.$('ul');
                var scrollBodyContentOffsetTop = Math.floor(scrollBodyContent.position().top) || 0;
                var scrollEventHandle = function(event) {
                    if (!S.get('loading')) {
                        if (S.get('hasNext')) {
                            clearTimeout(S.get('scrollLoadTimeoutId'));
                            S.set('scrollLoadTimeoutId', setTimeout(function() {
                                var sbh = scrollBodyContent.height(),
                            		sh = scrollEventBindElement.height(),
                                    st = scrollEventBindElement.scrollTop();
                            	if(st + sh * 1.5 > sbh + scrollBodyContentOffsetTop){
                            		S.load();
                            	}
                            }, 200));
                        } else {
                            scrollEventBindElement.off('scroll', scrollEventHandle);
                        }
                    }
                };
                scrollEventBindElement.on('scroll', scrollEventHandle);
            }
        },
        _onRenderPageIndex: function(pageIndex) {
            this.element.attr('pageindex', pageIndex);
        },
        _onRenderPageSize: function(pageSize) {
            this.element.attr('pagesize', pageSize);
        },
        load: function() {
            var HASNEXT = 'hasNext',
                PAGEINDEX = 'pageIndex',
                LOADING = 'loading';

            if (this.get(HASNEXT)) {
                var S = this,
                    dataSource = S.get('dataSource') || function() {
                        var pomi = $.Deferred();
                        pomi.reject();
                        return pomi;
                    },
                    data = S.get('data');

                data.pg = S.get(PAGEINDEX) || 0;
                data.sz = S.get('pageSize') || 10;

                S.set(LOADING, true);
                console.log(data);
                dataSource(data).done(function(res) {
                    S.set(HASNEXT, res.hasNext);
                    if (res.hasNext) {
                        S.set(PAGEINDEX, (S.get(PAGEINDEX) || 0) + 1);
                    }
                    S.trigger('load:success', res);
                }).fail(function() {
                    S.trigger('load:fail', arguments);
                }).always(function() {
                    S.trigger('load:always');
                    S.set(LOADING, false);
                });
            }
            return S;
        },

    });

    return exports;
});
