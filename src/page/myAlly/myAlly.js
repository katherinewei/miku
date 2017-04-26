/**
 * Created by Spades-k on 2015/11/3.
 */

require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/common/nexter',
    'h5/js/common'
], function ($, URL, Data, Nexter,Common) {

    var Page;


    //初始化
    function init() {

        render();


    }

    //生成页面
    function render() {

        Common.headerHtml('我的粉丝');
        var template = '<div class="page-content"><div class="page-ally-list grid"><div class="search-layout"><div class="row nav"><div class="col zjAlly active" data-type="1"><span>直接粉丝</span></div><div class="col jjAlly" data-type="2"><span>间接粉丝</span></div> </div><div class="row search-box"><div class="col col-2 search-submit"></div><div class="col col-23"><input type="search" class="search-input" placeholder="输入我的粉丝昵称"></div></div></div><div class="total"><p>当前您的直接粉丝人数：<span></span>人</p></div><div class="ally-search-list clearfix" id="search-result"><ul class="media-list"></ul></div></div></div>';


        Page = $(template).appendTo('body');

        $('.nav .col').each(function () {
            $('.page-ally-list').append('<div class="ally-list clearfix hide"><ul class="media-list"></ul></div>');

        });
        $('.ally-list').eq(0).addClass('show').removeClass('hide');

        renderListNexter(1);



    }



    //加载盟友列表
    function renderListNexter(type,nickName) {
        var element = $('.ally-list', Page);

        new Nexter({
            element: element,
            dataSource: Data.allyList,
            enableScrollLoad: true,
            data:{
                type:type,
                nickName:nickName
            }
        }).load().on('load:success', function(res) {
            console.log(res);
            if(type == 1){
                $('.total span').text(res.allyCount);
            }

            var html = [];
            if (res.list && res.list.length) {
                $.each(res.list,function(index,item){
                    if (!item.profilePic) {
                        item.profilePic = URL.imgPath + '/common/images/avatar-large.png';
                    }
                    html.push(htmlItems(item));
                });
                $('.ally-list').eq(type-1).find('.media-list').append(html.join(''));

                element.height($(window).height()-$('.header').height()-$('.total').height());

            } else if (this.get('pageIndex') == 0) {
                $('.search-box,.total').hide();
                $('.page-content').addClass('nofans');
                $('.ally-list').eq(type-1).children('.media-list').html('<li class="not-has-goods-msg"><i class="icon-ally-null"></i><p>您暂时还没有新粉丝，快去邀请吧！</p><a href="' + URL.myInviteAlly + '">去邀请粉丝</a></li>');
                $('.ally-list').eq(type-1).css('padding-top','34px');
                element.height($(window).height()-$('.header').height());

            }

        }).render();



        bindEvent();
    }


    //装载模板
    function htmlItems(item) {

        var template = '<li class="media"><div class="media-left"><a href="#"><img class="media-object" src="{{profilePic}}" alt="..."></a></div> <div class="media-body"><h4 class="media-heading"><span class="label">昵称：</span>{{nickName}} <span class="count label">{{dateCreated}}</span></h4><p><span class="label">电话号码：</span><span class="label">{{mobile}}</span></p></div><div class="icon-badge-join icon-badge-{{contactsLevel}}"></div> </li>';
        //item.pOfferFee = Common.moneyString(item.pOfferFee);
        item.dateCreated =  bainx.formatDate('Y-m-d', new Date(item.dateCreated));
        return bainx.tpl(template, item);
    }


    function bindEvent() {

        Page.off('click', '.search-input')
            .on('tap', '.search-submit', function(event){
                event.preventDefault();
                var $input = $('.search-input', Page);
                $input.blur();
                var nickName = $.trim($input.val()+'');
                //debugger;
                allySearch(nickName);
            }).on('keyup', '.search-input', function (e) {

            var key = e.which;
            var $input = $('.search-input', Page);
            var nickName = $.trim($input.val());
            if (key == 13) {
                e.preventDefault();
                if (nickName == '') {
                    alert('请输入收索关键字!');
                    return false;
                }
                allySearch(nickName);

            }
        }) .on('tap', '.nav .col', function(event){
            event.preventDefault();
            $('.ally-search-list').addClass('hide').removeClass('show');

            var type = $(this).data('type');
            $('.page-ally-list').find('.ally-list').removeClass('show').addClass('hide');
            $('.ally-list').eq(type-1).addClass('show').removeClass('hide');

            if ($('.ally-list').eq(type-1).find('ul li').length == 0) {
                renderListNexter(type);
            }
            $(this).addClass('active').siblings().removeClass('active');
            if(type == 2 || $('.ally-list').eq(type-1).find('li').hasClass('not-has-goods-msg')){
                $('.search-box,.total').hide();
                $('.ally-list').css('padding-top','34px').eq(type-1).height($(window).height()-$('.header').height());

            }else{
                $('.search-box,.total').show();
                $('.ally-list').css('padding-top','74px').eq(type-1).height($(window).height()-$('.header').height()-$('.total').height());
            }
            ($('.ally-list').eq(type-1).find('li').hasClass('not-has-goods-msg')) ? $('.page-content').addClass('nofans') : $('.page-content').removeClass('nofans');

        })
    }


    function allySearch(nickName){
        if(nickName){
            var target = $('#search-result');
            new Nexter({
                element: target,
                dataSource: Data.allyList,
                enableScrollLoad: true,
                data:{
                    type:1,
                    nickName:nickName
                }
            }).load().on('load:success', function (res) {
                if(res.list.length){
                    var content=[];
                    $.each(res.list,function(index,item){

                        if (!item.profilePic) {
                            item.profilePic = URL.imgPath + '/common/images/avatar-large.png';
                        }
                        content.push(htmlItems(item));
                    });
                    var html = content.join(" ");
                    if (html.length) {
                        $('ul', target).html(html);

                        $('.ally-list').addClass('hide').removeClass('show');
                        $('.ally-search-list').addClass('show').removeClass('hide');
                    }
                }else{
                    bainx.broadcast('不存在' + nickName + '粉丝');
                    $('.ally-list').addClass('show').removeClass('hide');
                    $('.ally-search-list').addClass('hide').removeClass('show');
                }
            });
        }
    }



    init();
});