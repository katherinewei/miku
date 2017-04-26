define('timer', ['jquery'], function($){

	function Timer(options){
		$.extend(this, options);
	}

	function init(){
		if(!this.element){
			this.element = $('<div class="wl-timer"></div>');
		}
		this.dateEle = $(createSelectHtml({
			className : 'wl-timer-date',
			opts : [{
				value : 'today',
				selected : true,
				text : '今天'
			},{
				value : 'tomorrow',
				text : '明天'
			},{
				value : 'afterTomorrow',
				text : '后天'
			}],
			value : 'today'
		})).appendTo(this.element);

		this.timeEle = $(createSelectHtml({
			className : 'wl-timer-time',
			opts : [{
				text : '请先选择日期'
			}]
		})).appendTo(this.element);
		this.bindEvents();
		this._inited = true;
	}

	function createSelectHtml(options){
		var template = '<select class="{{className}}" value="{{value}}">{{optionsHtml}}</select>';
		options.optionsHtml = createOptionsHtml(options.opts);
		return bainx.tpl(template, options);
	}

	function createOptionsHtml(options){
		var template = '<option value="{{value}}" {{selected}}>{{text}}</option>',
			html = [];
		if($.isArray(options) && options.length){
			options.forEach(function(item, index){
				html.push(bainx.tpl(template, item));
			});
		}
		return html.join('');
	}

	function render(){
		if(!this._inited){
			this.init();
		}
		if(!this.element.parent().length){
			this.element.appendTo(this.parent || 'body');
		}
		this._rendered = true;
	}

	function numberToTimeRange(num){
		var start = num < 10 ? ('0'+num) : num,
			end = num+1;
		end = end < 10 ? ('0'+end) : end;
		return start + ':00 ～ '+end+':00';
	}

	function bindEvents(){
		this.element.on('changed', '.wl-timer-date', function(event){
			var ele = $(this),
				val = ele.val(),
				opts = [];
			switch(val){
				case 'tomorrow':
				case 'afterTomorrow':
					for(var i=8, end=18; i<=end; i++){
						opt.push({
							value : i,
							text : numberToTimeRange(i)
						});
					}
				break;
				default : 
					var d = new Date(),
						h = d.getHours() + (d.getMinutes() ? 1 : 0);
				break;
			}
		});
	}

	Timer.prototype = {
		init : init,
		render : render,
		bindEvents : bindEvents
	};

	return Timer;
});