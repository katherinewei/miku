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

    var Page,
        type = URL.param.type,
        zjAllyCount = URL.param.zjAllyCount,
        jjAllyCount = URL.param.jjAllyCount;


    //初始化
    function init() {

        render();

        renderListNexter();

    }

    //生成页面
    function render() {

        var headTitle = function() {
                if (type == 1) {
                    return "直接盟友" + zjAllyCount + "人";

                } else {
                    return "间接盟友" + jjAllyCount + "人";
                }
            };
        Common.headerHtml(headTitle());
        var template = '<div class="page-content"><div class="page-ally-list"><div class="search-layout grid"><div class="row search-box"><div class="col col-2 search-submit"></div><div class="col col-23"><input type="search" class="search-input" placeholder="输入我的盟昵称"></div></div></div><div class="ally-list clearfix"><ul class="media-list"></ul></div><div class="ally-search-list clearfix" id="search-result"><ul class="media-list"></ul></div></div></div>';

        //html = bainx.tpl(template, myAlly);

        Page = $(template).appendTo('body');
        //Page = $(html).appendTo('body');

    }



    //加载盟友列表
    function renderListNexter() {
        var element = $('.ally-list', Page);

        new Nexter({
            element: element,
            dataSource: Data.allyList,
            enableScrollLoad: true,
            data: {
                nickName:"",
                type: type
            }
        }).load().on('load:success', function(res) {
                console.log(res);

                var html = [];

                    if (res.list.length > 0) {
                    $.each(res.list,function(index,item){
                        if (!item.profilePic) {
                            item.profilePic = URL.imgPath + '/common/images/avatar-large.png';
                        }
                        html.push(htmlItems(item));
                    });
                    $('.ally-list .media-list').append(html.join(''));
                } else if (this.get('pageIndex') == 0) {
                    $('.ally-list .media-list').html('<li class="not-has-goods-msg"><i class="icon-ally-null"></i><p>您暂时还没有新盟友，快去邀请吧！</p><a href="' + URL.myInviteAlly + '">去邀请盟友</a></li>');
                }


        }).render();

        var allyListHeight = $(window).height()-$('.header').height()-$('.search-layout').height();

        element.height(allyListHeight);

        bindEvent();
    }


    //装载模板
    function htmlItems(item) {

        var template = '<li class="media"><div class="media-left"><a href="#"><img class="media-object" src="{{profilePic}}" alt="..."></a></div> <div class="media-body"><h4 class="media-heading"><span class="label">昵称：</span>{{nickName}}</h4><p><span class="label">电话号码：</span><span class="label">{{mobile}}</span></p></div><div class="media-footer"><span class="label-wrap"><span class="label">订单数：</span><span class="count">{{pTradesCount}}</span></span><span class="label-wrap"><span class="label">贡献分润：</span><span class="count">￥{{pOfferFee}}</span></span></div></li>';
        //item.pOfferFee = Common.moneyString(item.pOfferFee);
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
            allySearch(nickName,type);
            })/*.on('focus', '.search-input', function(event){
            var _this = this;
            $(document).one('touchstart', function(event){
                if(_this != this ){
                    $(_this).blur();
                }
            });
             })*//*.on('input propertychange', '.search-input', function (event) {
            event.preventDefault();

            var $input = $('.search-input', Page);

            var nickName = $.trim($input.val() + '');

            console.log(nickName);

            if (nickName == '') {
                $('.ally-list').show();
                $('.ally-search-list').hide();
            }

            allySearch(nickName, type);
         })*/.on('keyup', '.search-input', function (e) {

            var key = e.which;
            var $input = $('.search-input', Page);
            var nickName = $.trim($input.val());
            if (key == 13) {
                e.preventDefault();
                if (nickName == '') {
                    alert('请输入收索关键字!');
                    return false;
                }
                allySearch(nickName, type);
                //location.href = URL.list + '?q=' + q;
            }
        });

        //$('.search-input', Page).off();

    }


    function allySearch(nickName,type){
        if(nickName){
            var target = $('#search-result');
            new Nexter({
                element: target,
                dataSource: Data.allyList,
                pageSize: 10,
                enableScrollLoad: true,
                data: {
                    nickName: nickName,
                    type: type
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

                        $('.ally-list').hide();
                        $('.ally-search-list').show();
                    }
                }else{
                    bainx.broadcast('不存在' + nickName + '盟友');
                    $('.ally-list').show();
                    $('.ally-search-list').hide();
                }
            });
        }
    }



    init();
});