/**
 * 微信摇一摇抢红包
 * Created on 2015/12/29.
 */
require([
    'jquery',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/url'
], function ($, Data, Common, URL) {
    var Page,
        is_shake = false,  //是否允许触发搜红包事件
        SHAKE_THRESHOLD = 3000,
        last_update = 0,
        x = y = z = last_x = last_y = last_z = 0,
        leftsecond,
        now_time,
        start_time,
        end_time,
        state;


    function init() {
        render();
        weiXinShare();

    }


    //微信分享
    function weiXinShare() {
        if (Common.inWeixin) {
            console.log(document.title);
            var inQuestion = location.href.match(/\?/i);

            var shareUrl = URL.site + URL.redPacketHtm + '?pid=' + pageConfig.pid+'&isShare=1',
                shareImgUrl = URL.imgPath + 'common/images/invite-redpag.png',
                desc = '邀请好友米酷一起玩耍吧~，红包，送不停~~~',
                shareOption = {
                    title: '快来米酷,摇一摇中红包啦', // 分享标题
                    desc: desc, // 分享描述
                    link: shareUrl, // 分享链接
                    type: 'link', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    imgUrl: shareImgUrl, // 分享图标
                },
                shareOptionTimeline = {
                    title: desc, // 分享标题
                    link: shareUrl, // 分享链接
                    imgUrl: shareImgUrl // 分享图标
                };

            WeiXin.hideMenuItems();
            WeiXin.showMenuItems();
            WeiXin.share(shareOption, shareOptionTimeline);
        }
    }


    function render() {
        var mainPage = '<div class="wrap"><div class="time"></div><input type="hidden" value="" id="leftsecond" /> <div class="shake"><img class="circle" src="' + URL.imgPath + '/common/images/wxShake/circle.png" /> <img id="shakeHand" src="' + URL.imgPath + '/common/images/wxShake/shake.png"/> </div> <div class="footer"><img src="' + URL.imgPath + '/common/images/wxShake/word.png" /><p>还有<span></span>个红包</p></div> <audio style="display:hiden" id="musicBox" preload="metadata" src="' + URL.imgPath + '/common/images/wxShake/mini.wav" ></div>';
        Page = $(mainPage).appendTo('body');
        enterPage();


    }
    //进入红包摇摇
    function enterPage() {
        //处理
        Data.doredPacket().done(function (res) {
            start_time = parseInt(res.beginTime),
                now_time = parseInt(res.nowTime),
                end_time = parseInt(res.endTime);

            //start_time =  parseInt(100);
            //now_time = parseInt(95);
            //end_time = parseInt(105);
            if (res.flag != -1 || res.flag != -2) {
                $('.footer span').text(res.num);
                if (res.flag == 3) {
                    $('.footer span').text(0);
                }
                //倒计时
                ShowCountDown(res.flag);
                //ShowCountDown(1);
            } else {
                bainx.broadcast('没有这个活动哦~');
            }
        })

        //开始摇
        if (window.DeviceMotionEvent) {
            window.addEventListener('devicemotion', deviceMotionHandler, false);
        } else {
            alert('您该手机不支持摇一摇!');
        }

    }


    //开始摇一摇
    function deviceMotionHandler(eventData) {

        var acceleration = eventData.accelerationIncludingGravity;
        var curTime = new Date().getTime();
        if ((curTime - last_update) > 100) {
            var diffTime = curTime - last_update;
            last_update = curTime;
            x = acceleration.x;
            y = acceleration.y;
            z = acceleration.z;
            var speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;


            var is_null = (document.getElementById('resultWrap')) ? true : false;

            if (speed > SHAKE_THRESHOLD && !is_shake && !is_null) {
                $('#musicBox')[0].play();
                document.getElementById('shakeHand').className = 'animated';
                is_shake = true;

                //处理
                setTimeout(function () {
                    Data.doredPacketResult().done(function (res) {
                        $('.footer span').text(res.num);
                        //alert(res.info);
                        shakeResult(res.result, res.price, res.openid, res.flag);
                    })
                    is_shake = false;
                }, 1500)

            }
            last_x = x;
            last_y = y;
            last_z = z;
        }
    }

    //结果
    function shakeResult(result, price, openid, flag) {
        $('#musicBox')[0].pause();
        document.getElementById('shakeHand').className = '';
        var resultPage = '<div class="resultWrap" id="resultWrap"><img src="' + URL.imgPath + '/common/images/wxShake/envelope1.png" /> <img src="' + URL.imgPath + '/common/images/wxShake/envelope2.png" /><img src="' + URL.imgPath + '/common/images/wxShake/envelope3.png" /><div class="resultContainer"><img src="' + URL.imgPath + '/common/images/wxShake/envelope4.png" /><div class="resultBox"><p class="price"></p><p class="tips"></p></div></div><div class="receive"><img src="' + URL.imgPath + '/common/images/wxShake/envelope5.png" /><a class="colseBtn" ></a></div></div>';
        Page = $(resultPage).appendTo('body');

        var closeTxt = '点击关闭',
            receiveTxt = '点击领取红包';
        //几种结果
        switch (result) {
            case 0:  //没有中奖
                $('.resultBox .price').text('0');
                $('.tips').html('骚年，别气馁，使劲摇起来');
                $('.colseBtn').text(closeTxt);
                break;
            case 1:         //抽中了一个红包
                $('.resultBox .price').text(price);
                $('.tips').html('恭喜您<br />功夫不负有心人<br />红包都可以摇成真~').css('line-height', '20px');
                $('.colseBtn').addClass('receiveBtn').text(receiveTxt);
                break;
            case 2:     //全部红包已经摇完
                $('.resultBox .price').text('0');
                $('.tips').html('全部红包已经被摇完啦~');
                $('.colseBtn').text(closeTxt);
                break;
            case -1:
                if (flag == 3) {       //全部红包已经摇完
                    $('.resultBox .price').text('0');
                    $('.tips').html('全部红包已经被摇完啦~');
                    $('.colseBtn').text(closeTxt);
                } else {          //未开始
                    $('.resultBox .price').text('0');
                    $('.tips').html('还没开始啦，骚年，摇多了伤身~');
                    $('.colseBtn').text(closeTxt);
                }
                break;
            default:
                break;

        }

        Page.on('tap', '.colseBtn', function (event) {
            event.preventDefault();
            if ($('.colseBtn').hasClass('receiveBtn')) {
                //领取红包
                var data = {
                    openid: openid,
                    price: price
                }
                Data.doredPacketGetPay(data).done(function (res) {
                    bainx.broadcast(res.msg);
                })
                $('.colseBtn').removeClass('receiveBtn');
            }
            $('.resultWrap').remove();
        })
    }
    //时间倒计时
    function ShowCountDown(flag) {
        state = flag;
        var leftTime;
        if (state == 1) {  //未开始
            leftTime = start_time - now_time;

        } else if (state == 2) {    //进行中
            leftTime = end_time - now_time;
        }
        else {
            $('.time').html('抢红包已结束！');
            return;
        }
        leftsecond = parseInt(leftTime / 1000);
        //start_time++;
        var times = setInterval(function () {
            countDown();


            if (leftsecond < 1 && state == 1) {
                leftTime = end_time - start_time;
                leftsecond = parseInt(leftTime / 1000);
                state = 2;
                start_time++;
            } else if (leftsecond < 1 && state == 2) {
                state = 3;
            }
            if (state == 3 && leftsecond < 0) {
                clearInterval(times);
                $('.time').html('抢红包已结束！');
                $('.footer span').text('0');
            }
        }, 1000);
    }

    function countDown() {
        leftsecond--;
        now_time++;
        var day = Math.floor(leftsecond / (60 * 60 * 24)),
            hour = Math.floor((leftsecond - day * 24 * 60 * 60) / 3600),
            minute = Math.floor((leftsecond - day * 24 * 60 * 60 - hour * 3600) / 60),
            second = Math.floor(leftsecond - day * 24 * 60 * 60 - hour * 3600 - minute * 60);
        if (state == 1) {
            $('.time').html('距离抢红包还有：' + day + ' 天 ' + p(hour) + ' ：' + p(minute) + ' ：' + p(second));
        }
        else if (state == 2) {
            $('.time').html('距离抢红包结束还有：' + day + ' 天' + p(hour) + ' ：' + p(minute) + ' ：' + p(second));


        }
        function p(s) {
            return s < 10 ? '0' + s : s;
        }
    }
    init();
})