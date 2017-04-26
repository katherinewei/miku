/**
 * 成为代理显示
 * Created by xiuxiu on 2016/3/3.
 */
require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/transDialog',
], function ($, URL, Data, Common, Dialog) {

    var successJoinDialog;

    function init() {
        $('.waitting').hide();
        render();
    }
    function render() {
        if (!successJoinDialog) {
            successJoinDialog = new Dialog($.extend({}, Dialog.templates.top, {
                template: '<section class="leagueSuccess makeMoneyPage"><section class="header"><div class="content navbar"><div class="btn-navbar navbar-left"><span href="javascript:history.go(-1);" class="icon icon-return"></span></div><div class="navbar-main">完成开通</div></div></section><div class="successBox"><div class="Top"><img src="' + URL.imgPath + '/common/images/ic_joined.png"><p>恭喜！您已经成为米酷推广经理了！</p><div class="grid page-invite clearfix"><div class="row item-wrap" href="'+URL.index+'"> <div class="col col-6 icon-wrap"><span class="icon fvc fac icon-invite"></span></div> <div class="col col-16 fb fvc "><div class="text-wrap straInvite"><h3 ><span class="title">进入商城</span></h3> <p>在米酷自购商品，您自己可以获得返利，推荐好友成功购买商品您还可以获得丰厚的推广奖励哦！</p> </div></div><div class="col col-2 fb far fvc next_gray"></div> </div><div class="row item-wrap" href="'+URL.myInviteAllyQr+'?type=1"><div class="col col-6 icon-wrap"><span class="icon icon-invite-qrcode"></span> </div><div class="col col-16 fb fvc"><div class="text-wrap ewmInvite"><h3 ><span class="title">进入我的二维码</span></h3> <p>进入二维码邀请页面之后，请使用截屏功能截取页面，将截取的图片发给好友，好友成功购买创业礼包就能获得推广奖励啦~</p></div></div><div class="col col-2 fb far fvc next_gray"></div></div></div></div></div><div class="explainBox"><h4>如何赚钱？</h4><div class="list"><div class="line"></div><ul><li><span>1</span><p>购物米酷超值礼包，即可成为米酷推广经理</p></li><li><span>2</span><p>自己购买商品，拿高额返利</p></li><li><span>3</span><p>成功推荐朋友成为米酷推广经理，马上获得推荐奖励</p></li><li><span>4</span><p>选择喜欢的商品推广出去，好友购买即可获得推广奖励</p></li><li> <span>5</span><p>就这样开始轻松赚钱啦！</p></li></ul></div></div></section>'
            }))
        }
        successJoinDialog.show();

    }
    init();
})