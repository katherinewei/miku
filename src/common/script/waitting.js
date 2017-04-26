define('h5/js/common/waitting', ['jquery'], function($) {
    var waitting = bainx.singleton(function() {
        var target = $('.waitting');
        return target.length ? target : $('<div class="waitting"><div class="loading"></div><div class="message"></div></div>').appendTo('body');
    });

    var hideTimeoutId,
        list = [];

    function showMsgList() {
        var data;
        while (list.length) {
            if (list[0].pomi && list[0].pomi.state() == 'pending') {
                data = list[0];
                break;
            } else {
                list.shift();
            }
        }
        data ? showMsg(data) : hideMsg();
    }

    function showMsg(data) {
        var wrap = waitting(),
            $message = wrap.find('.message'),
            html = $message.html();
        if (html == data.msg) {
            wrap.show()
        } else {
            wrap.find('.message').html(data.msg);
            wrap.show().css({
                'margin-left': (-wrap.width() / 2) + 'px',
                'margin-top': (-wrap.height() / 2) + 'px'
            });
        }
        if (!data.always) {
            data.always = function() {
                clearTimeout(hideTimeoutId);
                hideTimeoutId = setTimeout(showMsgList, data.delay || 200);
            }
            data.pomi.always(data.always);
        }
    }

    function hideMsg() {
        waitting().hide();
    }

    var exports = {
        show: function(msg, pomi, delay) {
            var data = {
                msg: msg,
                pomi: pomi,
                delay: delay
            };
            list.unshift(data);
            showMsgList();
        },
        hide: hideMsg
    }

    return exports;
});
