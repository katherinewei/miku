define('h5/js/common/lazyload', [
    'jquery'
], function($) {

    function lazyload(selector, options) {
        var $container, contHeight, contWidth,
            $this = $(selector),
            defaults = {
                attr: 'data-url',
                container: window
            };

        $.extend(defaults, options || {});

        $container = $(defaults.container);

        function update() {
            contHeight = $container.height();
            contWidth = $container.width();
        }

        update()

        function inViewport(el) {
            var contTop, contLeft;

            if (defaults.container === window) {
                contTop = $container.scrollTop();
                contLeft = $container.scrollLeft();
            } else {
                contTop = $container.offset().top;
                contLeft = $container.offset().left;
            }

            if ((
            	el.offset().top + el.height() > contTop &&
            	el.offset().top < contTop + contHeight) && (
            	el.offset().left + el.width() > contLeft &&
            	el.offset().left < contLeft + contWidth)) {
                return true;
            }

            return false;
        }

        function loadImg() {
            $this.each(function() {
                var self = $(this),
                    url = self.attr(defaults.attr),
                    node = this.nodeName.toLowerCase();

                function isVis(ele) {
                    if (ele.css('display') != 'none' && ele.css('visibility') != 'hidden') {
                        return true;
                    } else {
                        return false;
                    }
                }

                if (isVis(self) && (node === 'img') && inViewport(self) && url) { //跳过隐藏,不在视窗内以及已加载过的图片
                    self.attr('src', url).removeAttr(defaults.attr);
                }
            })
        }

        loadImg()

        $container.on('scroll', loadImg);

        if (defaults.container === window) {
            $container.on('resize', function() {
                update()
                loadImg()
            })
        }
    }

    return lazyload;
});
