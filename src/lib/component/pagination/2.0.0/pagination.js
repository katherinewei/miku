// 分页组件
define("component/pagination/2.0.0/pagination", ["jquery", "arale/widget/1.1.1/widget"], function($, Widget) {

    var S = tbtx,
        substitute = S.substitute;

    var Pagination = Widget.extend({
        attrs: {
            // 记录总数
            total: 100,
            // 每页记录数
            pagesize: 6,
            // 中间显示的页面数
            display: 10,
            // 当前页数,
            activeIndex: {
                value: 1,
                setter: function(val) {
                    return parseInt(val, 10) || 1;
                }
            },

            // 是否新窗口打开
            isTarget: false,

            prevText: '上一页',
            nextText: '下一页',
            firstText: '首页',
            lastText: '末页',
            itemText: '{{ page }}',
            urlText: 'javascript:void(0);',

            pattern: '<a href="{{ href }}" data-page="{{ page }}" class="{{ className }}" target="{{ target }}">{{ content }}</a>',

            className: "tbtx-pagination",
            classPrefix: "tbtx-pagination",

            // 是否切换分页
            isSwitch: true
        },

        events: {
            "click .{{attrs.classPrefix}}-item": "_switch"
        },

        setup: function() {
            Pagination.superclass.setup.call(this);

            this._initConstClass();
            this.after("render", this._render);
        },

        _initConstClass: function() {
            this.CONST = constClass(this.get("classPrefix"));
        },

        _switch: function(e) {
            if (!this.get("isSwitch")) {
                return;
            }

            var disableClass = this.CONST.disable,
                currentClass = this.CONST.current,
                target = $(e.currentTarget),
                page = target.attr("data-page");

            if (target.hasClass(disableClass) || target.hasClass(currentClass)) {
                e.preventDefault();
                return;
            }

            this.set("activeIndex", page);
            this._render();
            this.trigger("switch", page);
        },

        _render: function() {
            this.calc();

            var pattern = this.get("pattern"),
                target = this.get("isTarget") ? '_blank' : '_self',
                urlText = this.get("urlText"),
                activeIndex = this.get("activeIndex"),
                CONST = this.CONST,
                html = [];

            S.each(this.display, function(item) {
                var page,
                    href,
                    className = [CONST.item];

                if (typeof item == "number") {
                    page = item;
                } else {
                    page = this.get(item);
                }

                href = substitute(urlText, {
                    page: page
                });

                // 当前页
                if (page == activeIndex) {
                    className.push(CONST.current);
                }
                // disable
                if (page === 0) {
                    className.push(CONST.disable);
                }
                // prev next first next
                if (CONST[item]) {
                    className.push(CONST[item]);
                }

                html.push(substitute(pattern, {
                    href: href,
                    className: className.join(" "),
                    target: target,
                    content: this.get(item + "Text") || substitute(this.get("itemText"), {page: page}),
                    page: page
                }));
            }, this);

            if (this.$("[data-pagination-role=container]").length) {
                this.$("[data-pagination-role=container]").html(html.join(''));
            } else {
                this.element.html(html.join(''));
            }

            this.trigger("render", activeIndex);
        },

        // 计算要显示的页
        calc: function() {
            var total = this.get("total"),
                pagesize = this.get("pagesize"),
                activeIndex = this.get("activeIndex"),
                display = this.get("display"),

                pages = Math.ceil(total / pagesize);

            this.display = ["first", "prev"];          // 要显示的页

            // 验证参数
            if (activeIndex > pages) {
                activeIndex = pages;
            }
            if (activeIndex < 1) {
                activeIndex = 1;
            }

            this.set("activeIndex", activeIndex);
            this.set("first", 1);
            this.set("last", pages);
            this.set("prev", activeIndex - 1);
            this.set("next", activeIndex == pages ? 0 : activeIndex + 1);


            // 要显示的页
            var left = activeIndex - Math.floor(display / 2),
                right = activeIndex + Math.floor(display / 2);

            // 判断越界
            if (left < 1) {
                left = 1;
                right = display < pages ? display : pages;
            }
            if (right > pages) {
                right = pages;
                left =  display < pages ? (pages - display + 1) : 1;
            }

            for (var i = left; i <= right; i++) {
                this.display.push(i);
            }
            this.display.push("next");
            this.display.push("last");
        }
    });


    function constClass(classPrefix) {
        return {
            prev: classPrefix ? classPrefix + "-prev" : "",
            next: classPrefix ? classPrefix + "-next" : "",
            first: classPrefix ? classPrefix + "-first" : "",
            last: classPrefix ? classPrefix + "-last" : "",
            item: classPrefix ? classPrefix + "-item" : "",
            disable: classPrefix ? classPrefix + "-disable" : "",
            current: classPrefix ? classPrefix + "-current" : ""
        };
    }
    return Pagination;
});
