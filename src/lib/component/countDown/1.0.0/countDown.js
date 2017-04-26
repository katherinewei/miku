define("component/countDown/1.0.0/countDown", ["tbtx", "widget"], function(S, Widget) {

    var attrConfig = {
        value: "00",
        setter: function(val) {
            return val.length == 1 ? "0" + val : "" + val;
        }
    };

    var timeConfig = {
        value: null,
        getter: function(val) {
            return parseInt(val, 10);
        }
    };

    // 倒计时组件
    var CountDown = Widget.extend({
        attrs: {
            // 当前时间
            now: timeConfig,
            // 目标时间
            target: timeConfig,

            day: attrConfig,
            hour: attrConfig,
            minute: attrConfig,
            second: attrConfig
        },

        setup: function() {
            var serverNow = this.get("now"),
                clientNow = Date.now();

            // 计算客户端当前时间和服务器当前时间的差
            this.diff = clientNow - serverNow;

            this.timer = S.later(this.update, 1000, true, this);
            this.update();
        },

        // 更新时间
        update: function() {
            // 目标时间
            var target = this.get("target"),
                clientNow = Date.now(),
                now = clientNow - this.diff,
                diff;

            if (now >= target) {
                this.timer.cancel();
                this.trigger("end");
            }

            diff = diffDate(target, now);
            S.each(diff, function(v, k) {
                this.set(k, v);
            }, this);

            this.trigger("update", diff);
        },

        _onRenderDay: function(val) {
            this.$("[data-role=day]").html(val);
        },
        _onRenderHour: function(val) {
            this.$("[data-role=hour]").html(val);
        },
        _onRenderMinute: function(val) {
            this.$("[data-role=minute]").html(val);
        },
        _onRenderSecond: function(val) {
            this.$("[data-role=second]").html(val);
        }
    });

    var seconds = {
        second: 1,
        minute: 60,
        hour: 60 * 60,
        day: 60 * 60 * 24
    };
    function diffDate(d1, d2) {
        d1 = new Date(d1);
        d2 = new Date(d2);

        // 相差的秒
        var diff = Math.abs(d1 - d2) / 1000,
            remain = diff,
            ret = {};

        "day hour minute second".split(" ").forEach(function(name) {
            var s = seconds[name],
                current = Math.floor(remain / s);

            ret[name] = current;
            remain -= s * current;
        });
        return ret;
    }

    return CountDown;
});