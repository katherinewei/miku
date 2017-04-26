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
        Page=$('<section class="page-content grid"><div class="allcircle"><ul></ul></div></section>').appendTo('body');

        if ($('.allcircle').offset().top < $(window).height()*1.5 && firstLoad) {
            circleList();
            firstLoad = false;
        }

        bindEvents();
    }

    function bindEvents(){
        $('body').on('tap','.follow',function(){//关注
            var circleId=$(this).attr('data-circleId'),
                data={
                    circleId:circleId,
                    userId:userId
                }
            Data.addOneCircleToBeNumber(data).done(function(res){
                if(res.flag){
                    bainx.broadcast('关注圈子成功！');
                }else{
                    bainx.broadcast('关注圈子失败！');
                }
            })
        })
    }

    function circleList(){
        var element = $('.page-content'),
            nexter = new Nexter({
                element: element,
                dataSource: Data.selectCircleIndexPage,
                enableScrollLoad: true,
                scrollBodyContent: $('.allcircle ul'),
            }).load().on('load:success', function (res)
            {
                if ($.isArray(res.list) && res.list.length) {
                    console.log(res)
                    var html =[],
                        template = '<li><div class="row"><div class="circlebox col row fvc" href="'+URL.circleDetailPage+'?circleId={{id}}"><div class="pic"><img src="http://wx.qlogo.cn/mmopen/FicMF6EiaFYTyYUSv6R1Pkbs8yNkAOSeGaXF4HNibibK0gYNTzXKeC6dqCibv8x0v9ulpdfb3QQBma1KXQKULT6y5iaW2leSxIGMG9/0"></div><div class="title"><p>{{circleName}}</p><p>{{circleDisc}}</p></div></div><div class="follow row fvc" data-circleId="{{id}}"><i>关注</i></div></div></li>';

                    $.each(res.list, function (index, item) {
                        var mikuSnsCircleDo=item.mikuSnsCircleDo;
                        item.circleName=mikuSnsCircleDo.circleName;
                        item.circleDisc=mikuSnsCircleDo.circleDisc;
                        item.id=mikuSnsCircleDo.id;
                        html.push(bainx.tpl(template,item));
                    });
                    $('.allcircle ul').append(html.join(''));
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