/**
 * 幸运抽奖
 * Created by Spades-k on 2015/12/23.
 */

require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/weixin',
    'plugin/lotterys/1.0.0/lotterys'
], function($, URL, Data, Common, WeiXin,Lottery) {

    var Page,
        Times,
        message;


    function init() {

        render();
    }

    function render() {
        var template = '<section id="lottery-page"><div class="page-content"><div class="lottery-wrap"><h3 class="lottery-title"></h3> <div id="lottery"><table border="0" cellpadding="0" cellspacing="0"><tr class="lottery-group"><td class="lottery-unit td_1 active"><img src="'+URL.imgPath+'/game/lottery/lottery_1.png"/></td><td class="lottery-unit td_2"><img src="'+URL.imgPath+'/game/lottery/lottery_2.png"/></td><td class="lottery-unit td_3"><img src="'+URL.imgPath+'/game/lottery/lottery_3.png"/></td></tr><tr class="lottery-group"><td class="lottery-unit td_4"><img src="'+URL.imgPath+'/game/lottery/lottery_4.png"/></td><td class="td_5"><a ><img src="'+URL.imgPath+'/game/lottery/lottery_start.png"/></a></td><td class="lottery-unit td_6"><img src="'+URL.imgPath+'/game/lottery/lottery_6.png"/></td></tr><tr class="lottery-group"><td class="lottery-unit td_7"><img src="'+URL.imgPath+'/game/lottery/lottery_7.png"/></td><td class="lottery-unit td_8"><img src="'+URL.imgPath+'/game/lottery/lottery_8.png"/></td><td class="lottery-unit td_9"><img src="'+URL.imgPath+'/game/lottery/lottery_7.png"/></td></tr></table></div><div class="lottery-bg"><img src="'+URL.imgPath+'/game/lottery/lottery_bg.png" alt=""></div><a class="btn-reward">查看我的奖品</a></div> <div class="activity-detail"><h3 class="title title-rule">活动规则</h3> <p>1、每邀请一位朋友成功注册米酷，可参加抽奖一次，次数不设上限</p><h3 class="title title-prize">活动奖品</h3><p>1、本活动奖品包括苹果手机，拍立得套餐，小样礼包，现金红包，现金积分。<br/>2、实物奖品抽中后，可在订单里面查看奖品详情。</p><p>*本活动最终解释权归米酷所有</p></div></div></section>';


        Page = $('body').append(template);

        lotteryDrawTimes();

        weiXinShare();

        bindEvent();
    }

    //获取抽奖次数
    function lotteryDrawTimes() {

        Data.lotteryDrawTimes().done(function(res){
            Times = res.times;
            $('.lottery-title', Page).html('我的幸运抽奖：'+ Times +'次');
            console.log(Times);

            lotteryDraw();
        });

    }


    //抽奖
    function lotteryDraw() {

        var reward,
            type,
            serial;

        console.log(Times);

        Lottery.lottery({
            selector: '#lottery',
            width: 3,
            height: 3,
            index: 0,    // 初始位置
            initSpeed: 500,  // 初始转动速度
            upStep:       50,   // 加速滚动步长
            upMax:        50,   // 速度上限
            downStep:     50,   // 减速滚动步长
            downMax:      200,  // 减速上限
            waiting: 1000, // 匀速转动时长  5000
            times: Times,  //抽奖次数
            message: message,  //抽奖次数
            beforeRoll: function () { // 重写滚动前事件：beforeRoll
                // console.log(this);

                var _this = this;
                if(Times>0) {
                    var add_data = {unesTest:URL.param.unesTest};

                    Data.lotteryDraw(add_data).done(function (res) {

                        type = res.lotteryDrawRewardVO.type;

                        serial = res.lotteryDrawRewardVO.index;

                        console.log(type,serial);

                        switch (type) {
                            case -1:

                                reward = randomDraw(type,serial);

                                break;
                            case 1:

                                reward = randomDraw(type,serial);

                                break;
                            case 2:

                                reward = randomDraw(type,serial);

                                break;
                            case 3:

                                reward = randomDraw(type,serial);

                                break;
                        }


                        _this.options.message = message;

                    });

                    console.log(Times);

                    Times = --_this.options.times;

                    $('.lottery-title', Page).html('我的幸运抽奖：'+ Times +'次');



                } else {
                    $('body').append('<section class="telDialog wl-trans-dialog translate-viewport" style="display: block;"><div class="cont bounceIn"><p>你没有抽奖机会了，赶快去邀请好友获得更多抽奖机会吧！</p><div class="btngroup"><span class="btn reset">取消</span> <span href="'+URL.myInviteAlly+'" class="btn ring">邀请好友</span></div></div></section>');
                    return false;
                }


            },
            beforeDown: function () { // 重写减速前事件：beforeDown
                // console.log(this);
            },
            aim: function () { // 重写计算中奖号的方法：aim
                // console.log(this);
                this.options.target = reward;
            }
        });

    }


    function randomDraw (type,serial) {
        //1001(500积分)   1002(1000积分) 2001(10元红包)    3001（礼包）  3002（礼包）  3003（拍立得）
        //type:表示抽奖产品的类型,index:表示奖品,arr:表示转盘奖品的位置
        var drawArr = [{
            index:3,
            type: -1,
            arr: 2,
            msg: '哈哈，没抽中哦...'
        },{
            index:1001,
            type: 1,
            arr: 0,
            msg: '恭喜你抽中了500积分！'
        },{
            index:1002,
            type: 1,
            arr: 3,
            msg: '恭喜你抽中了1000积分！'
        },{
            index:3001,
            type: 2,
            arr: 4,
            msg: '恭喜你抽中了小样礼包！'
        },{
            index:3002,
            type: 2,
            arr: 6,
            msg: '恭喜你抽中了小样礼包！'
        },{
            index:2001,
            type: 2,
            arr: 5,
            msg: '恭喜你抽中了10元红包！'
        },{
            index:10,
            type: 3,
            arr: 1,
            msg: '恭喜你抽中了苹果6 Plus，快点去领取吧！'
        },{
            index:3003,
            type: 3,
            arr: 7,
            msg: '恭喜你抽中了拍立得套餐，快点去领取吧！'
        }];

        $.each(drawArr, function(index, item) {

            if(item.type == -1){

                    reward = item.arr;
                    message = item.msg;

            }
            if(item.index == serial){
                reward = item.arr;
                message = item.msg;
            }

        });
        console.log(type,serial);
        console.log(reward,message);

        return reward;

    }


    function weiXinShare() {
        if(Common.inWeixin){
            //console.log(document.title);
            var inQuestion = location.href.match(/\?/i);

            var shareUrl =  URL.site + URL.lottery+'?pUserId='+pageConfig.pid+'&isShare=1',
                shareImgUrl = URL.imgPath + '/game/lottery/wxpic.png',
                desc = '邀请好友米酷一起玩耍吧~，积分，年货大礼包，护肤礼包，送不停~~~',
                shareOption = {
                    title: '快来米酷,玩幸运抽奖吧~', // 分享标题
                    desc: desc, // 分享描述
                    link: shareUrl, // 分享链接
                    type: 'link', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    imgUrl: shareImgUrl // 分享图标
                },
                shareOptionTimeline = {
                    title: desc, // 分享标题
                    link: shareUrl, // 分享链接
                    imgUrl: shareImgUrl // 分享图标
                };

            WeiXin.showMenuItems();
            WeiXin.share(shareOption, shareOptionTimeline);
        }
    }

    function bindEvent() {
        Page.on('tap', '.btn-reward', function(event) {
            event.preventDefault();
            location.href = URL.hActiveHtm + '?page=lotteryList';
        }).on('tap','.reset', function (event) {
            event.preventDefault();
            $('.telDialog').remove();
        });

    }

    init();

});
