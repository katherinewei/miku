define('h5/js/common/checkMobile', [
	'jquery',
	'h5/js/common',
	'h5/js/common/countDown',
	'h5/js/common/data'
], function($, Common, CountDown, Data){
	//发送手机验证码
    var exports = function(page, btn) {
        var S = page;
        var mobile = S.$('.mobile'),
            vmobile = $.trim(mobile.val());

        if (!vmobile) {
            bainx.broadcast(mobile.attr('placeholder'));
            return false;
        } else if (!/^[\d]{11}$/gi.test(vmobile)) {
            bainx.broadcast('请输入正确的手机号码！');
            return false;
        }

        var doneFn = function(result) {
                btn.addClass('disable').text('60秒');
                var changeFn = function() {
                        btn.text(this.time + '秒');
                        return this;
                    },
                    endFn = function() {
                        btn.text('发送验证码').removeClass('disable');
                        return this;
                    };
                (new CountDown({
                    time: 60,
                    change: changeFn,
                    end: endFn
                })).start();
                S.trigger('sendCheckNum.success', result);
            },
            failFn = function(code, json) {
                S.trigger('sendCheckNum.fali');
                setTimeout(function() {
                    if (code === 7) {
                        btn.removeClass('disable').text('发送验证码');
                    } else {
                        btn.removeClass('disable').text('重新发送');
                    }
                }, 1000);
            };

        btn.addClass('disable').text('正在处理..');
        return Data.checkMobile(vmobile).done(doneFn).fail(failFn);
    };

    return exports;
});