/**
 * 签到
 */

require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/transDialog',
    'h5/js/common/point',
], function ($, URL, Data, Common, Dialog, WLPoint) {
    var PointPage,
        Point = new WLPoint(), //积分信息
        SigninPage, //签到页面
        AJAX_BUSY = 'ajax-busy',
        DISABLE = 'disable';
    function init() {
        document.title = '签到';
        initSigninDialog();
    }
    function initSigninDialog() {
        Point.ready(function() {
            var dialog = new Dialog($.extend({}, Dialog.templates.top, {
                id: 'signinPage',
                onHideDestroy: true,
                template: bainx.tpl('<div class="mainPage"><section class="header" style="display:none;"><div class="content navbar"><div class="btn-navbar navbar-left"><a href="javascript:history.go(-1);" class="icon icon-return"></a></div><div class="navbar-main">签到</div><div class="btn-navbar navbar-right"><a class="icon-rule">积分规则</a></div></div></section><section class="page-content"><div class="intergralWrap"><p class="tips">连续签到可获得额外积分哦！</p><div class="interBox"> <p class="p1">您已连<br>续签到</p><p class="p2">0</p><p class="p3">天</p></div> <div class="signIn signinBtn"><div class="img"></div> <p>签到</p></div><div class="signInP"><p class="descriptT">今天签到可获得积分：{{todayScore}}</p> <p class="descriptC">您当前可用积分：<b>{{totalScore}}</b></p> <span id="viewHis">查看历史积分</span> </div></div></section></div> ', Point),

                events: {
                    'tap .icon-rule': function (event) {
                        event.preventDefault();
                        location.href = URL.pointRule;
                    },
                    'tap #viewHis': function (event) {
                        event.preventDefault();
                        this.hide();
                        $('body').addClass('nobg');
                        location.href = URL.myCoupon + '?mode=point';
                    },
                    'tap .signinBtn': function(event) {
                        event.preventDefault();
                        var btn = $(event.currentTarget);
                        if (btn.hasClass(AJAX_BUSY) || btn.hasClass(DISABLE)) {
                            return;
                        }
                        var S = this;
                        btn.addClass(AJAX_BUSY);
                        Point.obtain().always(function() {
                            setTimeout(function() {
                                // anim.removeClass('animation');
                                btn.removeClass(AJAX_BUSY);
                            }, 500);
                        }).done(function(res) {

                            bainx.broadcast('签到成功！获得' + Point.todayScore + '积分');
                            $.when(Point.fetch()).done(function () {
                                $('.signinBtn').addClass('disable');
                                $('.signIn p', dialog.element).text('已签到');
                                $('.p2').html(Point.signDay);
                                $('.descriptT').text('明天连续签到可获得：' + Point.tomorrowScore);
                                $('.descriptC b').text(Point.totalScore);

                                //renderPoint();

                                //S.hide();
                            });
                        });
                    }
                }
            }));

            dialog.render();

            function renderPoint() {
                if (Point.hasSignToday) {

                    $('.signinBtn', dialog.element).addClass(DISABLE);

                    $('.signIn p', dialog.element).text('已签到');
                    $('.descriptT', dialog.element).text('明天连续签到可获得：' + Point.tomorrowScore);

                } else {
                    $('.signIn p', dialog.element).text('签到');
                    $('.signinBtn', dialog.element).removeClass(DISABLE);
                    $('.descriptT', dialog.element).text('今天签到可获得：' + Point.todayScore);

                }
                $('.p2', dialog.element).html(Point.signDay);
                $('.descriptC b', dialog.element).text(Point.totalScore);
                $('.totalPoint', dialog.element).text(Point.totalScore);
            }

            renderPoint();
            dialog.show();

            var type = URL.param.type;
            if (type == 1) {
                document.getElementsByClassName('header')[0]['style'].display = 'block';
                $('#indexPage').css({"padding": "37px 0 50px"});
            }
        });
    }
    init();

});
