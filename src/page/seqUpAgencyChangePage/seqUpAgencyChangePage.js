/**
 * 下级变更申请
 */
require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/common'
], function ($, URL, Data, Common, WeiXin) {
    //初始化

    var  Page;
    function init() {
       render();
       bindEvents();
       $('.waitting').hide();
    }
    //生成页面
    function render() {
        //红包
        Common.headerHtml('下级变更申请');
        var main = '<div class="page-content grid main"><div class="logo"><img src="'+URL.imgPath+'/common/images/contact_logo.png"><p>米酷</p></div><div class="row"><div class="col col-7 fb fav fvc">上级电话</div><div class="col col-18 fb fav fvc"><input type="tel" class="superiorAgency" placeholder="请输入上级电话" /></div> </div><div class="row"><div class="col col-7 fb fav fvc">下级电话</div><div class="col col-18 fb fav fvc"><textarea class="juniorAgency"  placeholder="请输入下级电话，如有多个，请用英文逗号隔开，如13000000000,13100000000" ></textarea></div> </div><div class="row"><div class="col col-7 fb fav fvc">申请理由</div><div class="col col-18 fb fav fvc"><textarea placeholder="请输入申请理由" class="reason"></textarea></div> </div><div class="row tips">提示：您所填写的下级电话号码我们工作人员会在1-7个工作日内与之联系，如若意见一致，我们会审核通过您的下级变更申请。</div><div class="row"><div class="col"><input type="submit" class="submit" value="提交申请"/> </div></div> </div>';
        Page = $(main).appendTo('body');
    }

    //
    function bindEvents() {
        Page.on('tap', '.submit', function (event) {
            var superiorAgency = $.trim($('.superiorAgency').val()),
                juniorAgency = $.trim($('.juniorAgency').val()),
                reason = $.trim($('.reason').val());
            if(superiorAgency == ''){
                bainx.broadcast($('.superiorAgency').attr('placeholder'));
                return;
            }
            if(!/^[\d]{11}$/gi.test(superiorAgency)){
                bainx.broadcast('请输入正确的手机号码！');
                return;
            }
            if(juniorAgency == ''){
                bainx.broadcast('请输入下级电话');
                return;
            }
            var arr= [];
            arr=juniorAgency.split(',');
            for(var i=0;i<arr.length;i++){
                if (!/^[\d]{11}$/gi.test(arr[i])) {
                    bainx.broadcast('['+arr[i]+']手机号码有误，请重新输入！');
                    return;
                }
            }
            if(reason == ''){
                bainx.broadcast($('.reason').attr('placeholder'));
                return;
            }

            var data = {
                superiorAgency:superiorAgency,
                juniorAgency:juniorAgency,
                reason:reason,
            }
            console.log(data);

        });
    }
    init();
});
