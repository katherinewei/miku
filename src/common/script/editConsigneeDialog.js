define('h5/js/common/editConsigneeDialog',[
	'jquery',
	'h5/js/common/transDialog',
	'h5/js/common/data',
	'h5/js/common/consignee',
	'h5/css/page/editAddress.css',
	'plugin/addressData/1.0.0/addressData'
],function($, Dialog, Data, Consignee,addressData){
	var exports = Dialog.extend({
		attrs : $.extend({}, Dialog.templates.right,{
			name : '',
			mobile : '',
			community : null,
			addr: '',
			idCard: '',
			enableClose:true,
			userInfo : null,
			onHideDestroy : true,
			consignees:null,
			consignee:null 			//编辑的时候要传递此值
		}),
		events:{
			//'focus .community':'showLocationDialog',
			'tap .submit':'submit'
		},
		setup : function () {
			var S = this;
			exports.superclass.setup.call(S);
			S.element.addClass('wl-edit-consignee-dialog');
			S.$('.dialog-header').html('<h1>' + S.get('title')+'</h1>').addClass('fb fvc fac');
			S.$('.dialog-content').html('<div class="grid consignee-form '+ S.get('eventClassName') +'"><div class="row"><div class="col col-7 form-label">姓名</div><div class="col col-17"><input class="name" type="text" placeholder="请输入姓名" maxlength="20"></div><div class="col col-1"></div></div><div class="row"><div class="col col-7 form-label">手机</div><div class="col col-17"><input class="mobile" type="tel" placeholder="请输入手机号码" maxlength="11"></div><div class="col col-1"></div></div><div class="row"><div class="col col-7 form-label">省份</div><div class="col col-17"><input type="hidden" class="community" placeholder="请定位区域" /><select  id="cmbProvince"></select></div><div class="col col-1"></div></div><div class="row community-row fvc"><div class="col col-7 form-label">城市</div><div class="col col-17"><select id="cmbCity"></select></div><div class="col col-1"></div></div><div class="row community-row fvc"><div class="col col-7 form-label">县、区</div><div class="col col-17"><select id="cmbArea"></select><input id="cmbProvince_input" type="hidden"/><input id="cmbCity_input" type="hidden"/><input id="cmbArea_input" type="hidden"/></div><div class="col col-1"></div></div><div class="row"><div class="col col-7 form-label">详细地址</div><div class="col col-17"><input class="addr" type="text" placeholder="请填写详细地址" maxlength="200"></div><div class="col col-1"></div></div><div class="row idCard_row"><div class="col col-7 form-label">身份证号</div><div class="col col-17"><input class="idCard" type="tel" placeholder="请填写身份证号" maxlength="200"></div><div class="col col-1"></div></div></div><div class="detail-address-text">注：地址填写尽量详细，如xx楼xx室；</div><div class="button submit">保存</div><input type="hidden" class="id" />');

			if(!S.get('mobile')){
				Data.fetchUserInfo().done(function(res){
					S.set('userInfo', res);
					Address.addressData('cmbProvince', 'cmbCity', 'cmbArea', $('#cmbProvince_input').val(), $('#cmbCity_input').val(), $('#cmbArea_input').val());
					if($('.consignee-form').hasClass('addBox')){
						$('.idCard_row').hide();
					}
					S.$('.icon-return').hide();

				});
			}

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
		_onRenderConsignee : function(consignee){
			var S = this;
			if(consignee){
				consignee.idCard = consignee.idCard ? S.plusStar(consignee.idCard, 4, 4) : '';
				this.$('.name').val(consignee.receiverName)
						.attr('initialvalue', consignee.receiverName);
				this.$('.mobile').val(consignee.receiverMobile)
						.attr('initialvalue', consignee.receiverMobile);
				this.$('.addr').val(consignee.receiverAddress)
						.attr('initialvalue', consignee.receiverAddress);
				this.$('.community').val(consignee.communityName)
						.attr('initialvalue', consignee.communityName);
				this.$('.id').val(consignee.id);
				this.$('#cmbProvince_input').val(consignee.receiver_state);
				this.$('#cmbCity_input').val(consignee.receiverCity);
				this.$('#cmbArea_input').val(consignee.receiverDistrict);
				this.$('.idCard').val(consignee.idCard)
						.attr('initialvalue', consignee.idCard);


				if(!this.$('.idCard').attr('initialvalue')){
					this.$('.idCard_row').hide();
				}
			}
		},
		_onRenderUserInfo : function(userInfo){

			var S = this;
			if(!S.$('.mobile').val()){
				S.$('.mobile').val(userInfo.mobile);
			}
		},
		_onRenderName : function(name){
			this.$('.name').val(name);
		},
		_onRenderMobile : function(mobile){
			this.$('.mobile').val(mobile);
		},
		_onRenderAddr:function(addr){
			this.$('.addr').val(addr);
		},
		_onRenderCommunity:function(community){
			if(community) {

				this.$('.community').val(community.name);
				//this.$('.addr').val('');
			}
			//}else{
			//	this.$('.community').val('请选择区域');
			//}
		},
		_onRenderIdCard:function(idCard){
			this.$('.idCard').val(idCard);
		},
		//showLocationDialog : function(event){
		//	if(event){
		//		event.preventDefault();
		//		$(event.currentTarget).blur();
		//	}
		//	var S = this;
		//	//require(['h5/js/common/transDialog','h5/js/common/locationDialog'],function(Dialog, LocationDialog){
		//	//	var dialog = new LocationDialog($.extend({}, Dialog.templates.right, {
		//	//		id: 'wl-location-dialog',
		//	//	})).show(function(){
		//	//		S.$('.community').hide();
		//	//	}).on('value', function(value) {
		//	//		this.hide(function(){
		//	//			S.$('.community').show();
		//	//		});
		//	//		S.set('community', value);
		//	//		console.log(value);
		//	//	});
		//	//	S.set('community', value);
		//	//})
        //
		//},
		submit : function(event){
			event && event.preventDefault();

			var S = this,
					consignee = S.get('consignee');
			if(consignee){
				var data = S._packEditData();

				if(data){
					Consignee.ready(function(){
						Consignee.modfiy(data).done(function(res){
							S.set('consignees', Consignee.all(), {override:true});
							S.trigger('consignees', Consignee.all());
						});
					});
				}
			}else{

				var data = S._packAddData();

				if(data){
					//Data.addConsignee(data)
					Consignee.ready(function(){
						Consignee.add(data).done(function(res){
							S.set('consignees', Consignee.all(), {override:true});
							S.trigger('consignees', Consignee.all());
						});
					})
				}
			}

		},
		_packEditData : function(){
			var S = this,
					$name = S.$('.name'),
					$mobile = S.$('.mobile'),
					$addr = S.$('.addr'),
					//$community = S.$('.community'),
					$id = S.$('.id'),
					$idCard = S.$('.idCard'),
					name = $name.val(),
					mobile = $mobile.val(),
					addr = $addr.val(),

					idCard = $idCard.val(),
					//community = $community.val(),
					//communityJson = S.get('community'),
					id = $id.val(),
					_name = $name.attr('initialvalue'),
					_mobile = $mobile.attr('initialvalue'),
					_addr = $addr.attr('initialvalue'),
					_idCard = $idCard.attr('initialvalue'),
					//_community = $community.attr('initialvalue'),
					province = $("#cmbProvince").val(),
					city = $("#cmbCity").val(),
					district = $("#cmbArea").val(),

					data = {};

			if(!name){
				alert('请填写收货人姓名');
				$name.focus();
				return;
			}
			if(!mobile){
				alert('请填写手机号码');
				$mobile.focus();
				return;
			}
			if(!/[\d]{11}/gi.test(mobile)){
				alert('请填写11位手机号码');
				$mobile.focus();
				return;
			}
			if(province == '请选择省份'){
				alert(province);
				return;
			}

			if(district == '其他'){
				district='';
			}

			var value = {
				'city':city,
				//"citycode":"418000",
				'district':district,
				'province':province,
				'name':addr
			}
			S.set('community', value);
			var community = S.get('community');

			if(!addr){
				alert('请填写详细地址');
				$addr.focus();
				return;
			}
			if(name != _name){
				data.nick = name;
			} else {
				data.nick = _name;
			}
			if(mobile != _mobile){
				data.mobile = mobile;
			}
			if(idCard != _idCard){
				data.idCard = idCard;
			}
			data.addr = community;

			if(addr != _addr){
				data.addr.address = addr;
			}
			if(data.addr){
				data.addr = JSON.stringify(data.addr);
			}

			console.log(name, data.nick);

			if(!$.isEmptyObject(data)){
				data.id = id;
				return data;
			}else{
				return false;
			}
		},
		_packAddData : function(){
			var S = this,
					$name = S.$('.name'),
					$mobile = S.$('.mobile'),
					$addr = S.$('.addr'),

					name = $name.val(),
					mobile = $mobile.val(),
					addr = $addr.val(),
					province = $("#cmbProvince").val(),
					city = $("#cmbCity").val(),
					district = $("#cmbArea").val();

			if(!name){
				alert('请填写收货人姓名');
				$name.focus();
				return;
			}
			if(!mobile){
				alert('请填写手机号码');
				$mobile.focus();
				return;
			}
			if(!/[\d]{11}/gi.test(mobile)){
				alert('请填写11位手机号码');
				$mobile.focus();
				return;
			}
			if(province == '请选择省份'){
				alert(province);
				return;
			}

			if(district == '其他'){
				district='';
			}
			var value = {
				'city':city,
				//"citycode":"418000",
				'district':district,
				'province':province,
				'name':addr
			}
			S.set('community', value);
			var community = S.get('community');

			if(!addr){
				alert('请填写详细地址');
				$addr.focus();
				return;
			}
			community.address = addr;

			return {
				nick : name,
				mobile : mobile,
				addr : JSON.stringify(community)
			};
		}
	});

	return exports;
});