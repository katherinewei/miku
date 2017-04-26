define('h5/js/common/consigneeDialog',[
	'jquery',
	'h5/js/common/transDialog',
	'h5/js/common/data',
	'h5/js/common/locationDialog',
	'h5/js/common/storage',
	'h5/js/common/location',
	'h5/js/common/shop',
	'h5/js/common/consignee',
	'h5/css/page/address.css',
	'h5/js/common/url',
], function($, Dialog, Data, LocationDialog, Storage, WLocation, Shop, Consignee,URL){
	var exports = Dialog.extend({
		attrs : {
			consignees : null,
			listNullMessage : '<li class="not-has-address">您还没有添加过任何收货地址！<br/> 最多添加5个地址</li>',
			/*consigneeTemplate:'<li class="address-item" data-id="{{id}}" ><div class="delete fb fvc fac"></div><div class="row"><div class="col col-3 select-event-handle fb fvc"><div class="iconfont check-icon"></div></div><div class="col col-20 consignee-content"><h1><strong class="contact">{{name}}</strong><span class="mobile">{{mobile}}</span></h1><p class="addr" province="{{province}}" >{{province}}{{city}}{{district}}{{address}}</p><p class="shop-name" style="display: none">{{shopName}}</p></div><div class="col col-2 fb fvc far iconfont right-icon edit-btn"></div></div></li>',*/
			consigneeTemplate: '<li class="address-item" data-id="{{id}}" ><div class="row tool"><div class="col col-20 select-event-handle fb fvc"><div class="iconfont check-icon"></div>默认地址</div><div class="col col-5 delete fb fvc far">删除</div></div><div class="consignee-content row"><div class="col col-20"><div class="row "><div class="col contact">收货人：{{name}}</div><div class="col mobile fb fvc far">{{mobile}}</div></div><div class="row detailAddr"> <p class="addr" province="{{province}}" >{{province}}{{city}}{{district}}{{address}}</p></div><div class="idCard {{idCardshow}}"><p class=" col">身份证号：<span>{{idCard}}</span></p> </div></div> <div class="col col-3 fb far fvc edit-check"><div class="iconfont check-icon"></div></div></div> </div></li>',
			onHideDestroy : true,
		},
		events : {
			'tap .consignee-content':function(event){

				if(this.get('mode') == 'edit'){
					this.showEditConsigneeDialog(event);
				}else{
					this.selectConsignee(event);
				}
				if(this.element.hasClass('wl-reEdit-dialog')){
					this.showEditConsigneeDialog(event);
				}
			},
			'tap .add-button':'showAddConsigneeDialog',
			'tap .select-event-handle':'selectConsignee',
			'tap .wl-bottom-dialog .icon-return':function(){
				this.hide();
			},
			'tap .wl-reEdit-dialog .icon-return':function(event){
				event.preventDefault();
				this.element.removeClass('wl-consignee-dialog').removeClass('wl-reEdit-dialog').addClass('wl-bottom-dialog');
				this.get('content').find('.address-item').children('.tool').hide();
				$('.edit-button').show();
				$('.dialog-header h1').text('请选择地址');
				$('.add_button_bottom').hide();
			},
			//'swipeLeft .address-item':function (event) {
			//	event.preventDefault();
			//	this.showDeleteMode($(event.currentTarget));
			//},
			'longTap .address-item':function(event){
				event.preventDefault();
				this.showDeleteMode($(event.currentTarget));
			},
			//'swipeRight .address-item':function(event){
			//	event.preventDefault();
			//	this.hideDeleteMode();
			//},
			'tap .delete':function(event){
				event.preventDefault();
				this.deleteItem($(event.currentTarget).parents('.address-item'));
			},
			'tap .edit-button':function(event){
				event.preventDefault();
				this.element.removeClass('wl-bottom-dialog').addClass('wl-reEdit-dialog');
				this.get('content').find('.address-item').children('.tool').show();
				$('.edit-button').hide();
				$('.dialog-header h1').text('收货地址管理');
				if(this.get('content').find('.address-item').length < 5){
					this.get('content').append('<div class="button add-button add_button_bottom">新建收货地址</div>');
				}

			}
		},
		setup : function(){
			exports.superclass.setup.call(this);
			var S = this,
				consignees = S.get('consignees');
			S.element.addClass('wl-consignee-dialog');
			S.get('header').html('<h1 class="col tc">'+ S.get('title') +'</h1>');


			S.get('content').html('<ul class="consignee-list"></ul>').addClass('grid');


			if(!consignees || $.isEmptyObject(consignees)){
				Consignee.ready(function(){
					var cons = Consignee.all();
					S.set('consignees', Consignee.all());
					if(Consignee.all.isEmpty()){
						S._onRenderConsignees();
					}

				});
				/*exports.getConsignees().done(function(res){
					//console.log(res);
					S.set('consignees', res.consignees);
					if(res.consignees.length==0){
						S._onRenderConsignees(res.consignees);
					}
				});*/

			}
			return this;
		},
		deleteItem : function(view){
			var S = this,
				aid = view.data('id');
			if(aid){
				Consignee.ready(function(){
					Consignee.delete(aid).done(function(res){
						S.set('consignees', Consignee.all(), {override:true});
						S._onRenderConsignees(Consignee.all());
						S.trigger('consignees', Consignee.all());
					});
				})
			}
		},
		showDeleteMode : function(view) {
			var S = this;
	        view.addClass('moveleft');
	        $(document).one('tap', function(event){
	        	event.preventDefault();
	        	S.hideDeleteMode();
	        });
	    },

	    hideDeleteMode : function() {
	        this.$('.moveleft').removeClass('moveleft');
	    },

	    toggleDeleteMode : function () {
	        this.$('.address-item').toggleClass('moveleft');
	    },

		_onRenderConsignees : function(consignees){
			var S = this,
				target = S.$('.consignee-list'),
				html = [],
				template = S.get('consigneeTemplate'),
				def = null,
				length = 0;
			if(consignees && !$.isEmptyObject(consignees)){

				var idCard;
				$.each(consignees, function(id, consignee){
					length ++ ;

					var data = {
							id : consignee.id,
							name : consignee.receiverName,
							mobile : consignee.receiverMobile,
							province : consignee.receiver_state,
							city : consignee.receiverCity,
							district : consignee.receiverDistrict,
							community: consignee.communityName,
							address : consignee.receiverAddress,
						idCard: consignee.idCard,
						idCardshow: consignee.idCard ? 'show' : 'hide',
							shopName: consignee.shopName ? ('距离'+consignee.shopName+consignee.distance):'不在服务范围内'
						}
					data.idCard = data.idCard ? S.plusStar(data.idCard, 4, 4) : '';
					html.push(bainx.tpl(template, data));
					if(consignee.getDef == 1){
						def = consignee;
					}
				});

				target.html(html.join(''));
				$('.dialog-content').css('background-color', 'transparent');
				
			}else{
				target.html(S.get('listNullMessage'));
				$('.dialog-content').css('background-color', '#fff');
			}
			if(def){
				//S.$('.active[data-id]').removeClass('active');
				S.$('[data-id="'+ def.id +'"]').addClass('active');
			}
			S._renderLength(length);
			
			return S;
		},
		plusStar: function (str, frontLen, endLen) {

			var len = str.length - frontLen - endLen;
			var xing = '';
			for (var i = 0; i < len; i++) {
				xing += '*';
			}
			return str.substr(0, frontLen) + xing + str.substr(str.length - endLen);
		},

		_renderLength : function(length){
			var header = this.get('header');

			this.$('.add-button').remove();
			//this.$('header .add-button').remove();
			if(this.element.hasClass('wl-bottom-dialog')){

				this.$('.icon-return').attr('href','').show();

				//if(length < 5){
					header.append('<div class="edit-button " >管理</div>');
					//header.find('h1.tc').removeClass('tc');
					//this.get('content').find('.address-item').children('.row').append('<div class="col edit fb fvc far">编辑</div>')
					//this.$('header').append('<div class="col far add-button">添加</div>').find('h1.tc').removeClass('tc');
					this.get('content').find('.address-item').children('.tool').hide();
				//}else{
				//	header.find('h1').addClass('tc');
					//this.$('header h1').addClass('tc');
				//}
			}else{
				if(length < 5 && this.get('content').find('add_button_bottom').length == 0){
					this.get('content').append('<div class="button add-button add_button_bottom">新建收货地址</div>');
				}
			}
		},
		showAddConsigneeDialog : function(event){
			event && event.preventDefault();
			var S = this;
			require('h5/js/common/editConsigneeDialog',function(EditConsigneeDialog){
				new EditConsigneeDialog({
					title : '添加收货地址',
					eventClassName: 'addBox'
				}).on('change:consignees', function(consignees){
					console.log('添加收货地址:change:consignees', consignees);
					if(this.rendered){
						S.set('consignees', consignees, {override:true});
						this.hide();
					}
				}).show();
			});
		},
		showEditConsigneeDialog : function(event){
			event && event.preventDefault();
			var S = this,
				view = $(event.target).parents('.address-item'),
				id = view.data('id'),
				consignees = S.get('consignees');
			if(id && consignees && !$.isEmptyObject(consignees)){
				var consignee;
				$.each(consignees, function(index, item){
					if(item.id == id){
						consignee = item;
						return false;
					}
				});
				if(consignee){
					require('h5/js/common/editConsigneeDialog',function(EditConsigneeDialog){
						new EditConsigneeDialog({
							title : '编辑收货地址',
							eventClassName: 'editBox',
							consignee : consignee
						}).on('change:consignees', function(consignees){
							if(this.rendered){
								S.set('consignees', consignees, {override:true});
								this.hide();
							}
						}).show();
					});
				}
			}
		},
		selectConsignee:function(event){
			event && event.preventDefault();
			var S = this,
				target = $(event.currentTarget).parents('.address-item'),
				aid = target.data('id');

			if(aid){
				Consignee.ready(function(){
					Consignee.select(aid).done(function(res){
						console.log(res);
						S.set('consignees', Consignee.all(), {override:true});
						S._onRenderConsignees(Consignee.all());
						S.trigger('consignees', Consignee.all());
						if(S.get('onSelectConsigneeHide') && S.element.hasClass('wl-bottom-dialog')){
							S.hide();
						}
					});
				})
				
			}
		}
	});

	
       
	
	return exports;
    
});