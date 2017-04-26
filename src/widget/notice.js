/*define('h5/js/widget/notice', [
    'jquery',
    'widget',
    'h5/js/common.js',
    'slider'
], function($, Widget, Common, Slider) {

	var Template = Common.Template,
		Data = Common.Data,
		URL = Common.URL;




	var Notice = Widget.extend({
		attr : {
			activeIndex : 0,
			activeList : null,
		},
		_onRenderActiveList : function(list){
			console.log(list);
			var S = this;
			if(S.slider && S.slider.destroy && $.isFunction(S.slider.destroy)){
				S.slider.destroy();
				delete S.slider;
			}
			var html = [];
			if(list && $.isArray(list) && list.length){
				html = ['<div class="slider"><ul class="clearfix">'];
				list.forEach(function(item, index){
					var goods = Common.Goods.create(item);
					goods.index = index;
					switch(goods.activeStatus){
						case 0:
							goods.action = '<div class="button">尽请期待</div>';
							break;
						case 15:
							goods.action = '<div class="button" href="/api/h/1.0/hActive.htm">立即参加</div>';
							break;
						case 1:
						default:
							goods.action = '';
							break;
					}
					html.push(bainx.tpl(Template.noticeGoods, goods));
				});
				html.push('</ul></div>');
			}
			var sw = S.$('.content').html(html.join(''));
			S.$('.content').find('li').width(S.$('.content').width());
			var curIndex = S.get('activeIndex');
			if(curIndex<0){
				curIndex = 0;
			}

			var load = function(index){
                    	console.log(index, list[index]);
                    	var activeItem = list[index];
                    	if(activeItem){
                    		S.$('.header .curr').html(startTime(activeItem.startTime));
                    	}
                    };
			S.slider =  new Slider(S.element,{
                    //loop:1,
                    curIndex : S.get('activeIndex'),
                    useTransform : 1,
                    lazy:'.lazyimg',
                    callback : load,
                    //play : true,  //动画自动播放
                    //interval : 3000,
                    prev : S.$('.prev'),
                    next : S.$('.next'),
                    wrap : sw.find('.slider')
                });
			load(S.slider.curIndex);

		}
	});

	function startTime(st){
		var d = new Date(st);
		var week = ['日','一','二','三','四','五','六']
		return '星期'+week[d.getDay()] +'<br />'+ bainx.formatDate('M月D日', d);
	}

	return Notice;
});
*/