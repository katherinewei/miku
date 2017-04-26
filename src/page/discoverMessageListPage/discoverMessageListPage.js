/**
 * Created by Spades-k on 2016/6/23.
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
        Page=$('<section class="page-content grid"><div class="messageList"><ul></ul></div></section>').appendTo('body');

        if ($('.messageList').offset().top < $(window).height()*1.5 && firstLoad) {
            messageList();
            firstLoad = false;
        }
    }

    function messageList(){
        var data={
            userId:userId
        }
        var element = $('.page-content'),
            nexter = new Nexter({
                element: element,
                dataSource: Data.selemikuSnsRemindInfosByProfileId,
                enableScrollLoad: true,
                scrollBodyContent: $('.messageList ul'),
                data:data,
            }).load().on('load:success', function (res)
            {
                if ($.isArray(res.list) && res.list.length) {
                    console.log(res)
                    var html =[],
                        template = '<li><div class="row"><div class="messagebox col row fvc"><div class="pic"><img src="{{doprofile}}"></div><div class="title"><p>{{nickname}}</p><p>{{message}}</p></div></div><!--<div class="follow row fvc" data-circleId="{{id}}"><i>关注</i></div>--></div></li>';

                    $.each(res.list, function (index, item) {
                        var doprofile=item.doprofile,
                            mikuSnsRemindMessage=item.mikuSnsRemindMessage;
                        item.doprofile=doprofile.profilePic;
                        item.nickname=doprofile.nickname;

                        item.message=mikuSnsRemindMessage.message;
                        html.push(bainx.tpl(template,item));
                    });
                    $('.messageList ul').append(html.join(''));
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