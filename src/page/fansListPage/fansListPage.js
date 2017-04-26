/**
 * Created by Spades-k on 2016/6/29.
 */
require([
    'jquery',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/url',
    'h5/js/common/loadImage',
    'h5/js/common/nexter',
    'h5/js/common/transDialog',
    'h5/js/common/lazyload'
], function ($, Data, Common, URL,LoadImage, Nexter,Dialog,Lazyload) {
    var Page,
        userId=pageConfig.pid,
        firstLoad=true;

    function init(){
        render();
    }

    function render(){
        $('.waitting').hide();
        Page=$('<section class="page-content grid"><div class="allfans"><ul></ul></div></section>').appendTo('body');

        if ($('.allfans').offset().top < $(window).height()*1.5 && firstLoad) {
            followList();
            firstLoad = false;
        }

        bindEvents();
    }

    function bindEvents(){

    }

    function followList(){
        var data={
            userId:userId,
            flag:1
        }
        var element = $('.page-content'),
            nexter = new Nexter({
                element: element,
                dataSource: Data.personalFansIndexPageContent,
                enableScrollLoad: true,
                scrollBodyContent: $('.allfans ul'),
                data:data,
            }).load().on('load:success', function (res)
            {
                console.log(res)
                if ($.isArray(res.list) && res.list.length) {
                    var html =[],
                        template = '<li><div class="fansbox row fvc"><div class="pic"><img src="{{profilePic}}"></div><div class="title"><p>{{nickname}}</p><p>{{lemonName}}</p></div></div></li>';

                    $.each(res.list, function (index, item) {
                        html.push(bainx.tpl(template,item));
                    });
                    $('.allfans ul').append(html.join(''));
                    LoadImage(element);

                }
                var sid,
                    scrollEventHandle = function(event) {
                        event.preventDefault();
                        clearTimeout(sid);
                        sid = setTimeout(function() {
                            LoadImage(element);
                        }, 0);
                    }
                element.on('scroll', scrollEventHandle);
            })
    }


    init();

})