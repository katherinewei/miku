/**
 *
 */
define('h5/js/common/loadNext', [
    'jquery',
    'widget'
], function($, Widget){

    var win = $(window);

    var Module = Widget.extend({
            attrs : {
                postData : {},
                pageSize : 10,
                currentPage : -1,
                template : '<div><ul></ul></div>',
                itemTemplate : '<li></li>',
                dataRequest : null,
                hasNext : true,
                className:'widget-load-next'
            },
            handleResult : function(result){},

            load : function(){
                var S = this,
                    dataRequest = S.get('dataRequest'),
                    postData = S.get('postData'),
                    currentPage = S.get('currentPage') + 1,
                    pageSize = S.get('pageSize');

                postData.pg = currentPage;
                postData.sz = pageSize;

                S.load_disable = true;

                return dataRequest(postData).done(function(result){
                    S.handleResult(result.data);
                     S.set('currentPage', currentPage);
                    S.set('hasNext', result.hasNext);
                    S.loadImage();
                }).always(function(){
                    S.load_disable = false;
                });
            },

            loadImage : function(){
                var S= this;
                var loadheight = S.element.scrollTop() + win.height() * 1.5;
                S.$('img[data-src]').each(function(){
                    var img = $(this);
                    //console.log(img, img.offset().top);
                    if(img.offset().top < loadheight){
                        img.attr('src', img.data('src')).removeAttr('data-src');
                    }
                });
                return S;
            },

            scrollLoad : function(){
                var S = this;
                var ulh = S.$('ul').height(),
                    sct = S.element.scrollTop(),
                    wh = win.height(),
                    loadline = wh * 1.5 + sct;
                (loadline > ulh) && S.load();
                return S;
            },

            render : function(){
                var S = this;
                Module.superclass.render.call(S);
                S.element.on('scroll', function(event){
                    clearTimeout(S.get('scroll-sid'));
                    S.set('scroll-sid',setTimeout(function(){
                        S.loadImage();
                        if(!S.get('hasNext') || S.load_disable) {return;}
                        S.scrollLoad();
                    },200));
                });
                S.scrollLoad();
                return S;
            }
        });

    return Module;
});