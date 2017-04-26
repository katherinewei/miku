/**
 * 我的优惠券
 */
require([
	'jquery',
	'h5/js/common/url',
	'h5/js/common/data',
	'h5/js/common',
	'h5/js/common/translate',
	'h5/js/common/transDialog',
	'h5/js/common/point',
	'h5/js/common/nexter'
], function ($, URL, Data, Common, Translate, Dialog, WLPoint, Nexter) {

	var Page, 		//页面
			ObtainCouponPage,
			RemainCount = 0,
			CouponList, //优惠券列表

			PointPage,
			Point = new WLPoint(), //积分信息
	//PointList = new Class_PointList(), //积分明细
			SigninPage, //签到页面
			AJAX_BUSY = 'ajax-busy',
			DISABLE = 'disable',
			Wrap = $('.myPoint'),

			SigninDialog,
			PointGuideDialog, //签到规则
			MoneyPage,
			count = 0,
			isflag=true;

	function init(){
		if(URL.param.mode=='obtain'){
			initObtainCouponPage();
		}else{
			initPage();
			if (URL.param.mode == 'point') {
				$('header .nav').eq(1).addClass('active');
				$('.mainContainerA', Page)
						.addClass('show-right')
						.height(Math.max($('.wrapOut', Page).eq(1).height(), $(window).height()));
				$('#pointPage', Page).height(Math.max($('.wrapOut', Page).eq(1).height(), $(window).height()) - 125);
				initPointPage();
			}
			//if (URL.param.mode == 'wallet') {
			//	$('header .nav').eq(2).addClass('active');
			//	initMoneyPage();
			//	$('.mainContainerA', Page)
			//			.addClass('show-right-double').removeClass('show-right')
			//			.height(Math.max($('.wrapOut', Page).eq(2).height(), $(window).height()));
			//	$('#moneyPage', Page).css('height', Math.max($('.wrapOut', Page).eq(2).height(), $(window).height()) - 125);
			//}
		}
	}

	function initPage(){
		if(!Page){
			//fetchCouponList();
			renderPage(0);
			bindEventHandle();
		}
	}

	function renderPage(index) {
		var template = '<section class="header"><div class="content navbar"><div class="btn-navbar navbar-left"><span href="javascript:history.go(-1);" class="icon icon-return"></span></div><header class="grid mainNav"><div class="row"><div class="col nav" data-index="0">我的红包</div><div class="col nav" data-index="1">我的积分</div><!--<div class="col nav" data-index="2">我的钱包</div>--></div></section><div class="page-content"><section class="mainContainerAssets"><div class="mainContainerA clearfix"><div class="myCoupon wrapOut"><header class="grid"><div class="row"><div class="col nav active" data-index="3"><span>未使用</span></div><div class="col nav" data-index="4"><span>已过期</span></div></div></header><div class="overflow-wrap"><div class="overflow-x-wrap clearfix"><div class="overflow-y-wrap unUsedC"><ul class="couponList grid unUsedCoupons"></ul></div><div class="overflow-y-wrap usedC"><ul class="couponList grid usedCoupons"></ul></div></div></div></div><div class="myPoint wrapOut"></div><div class="myMoneyPack wrapOut"></div></div></section></div> ';
		$('body').prepend(template);

		Page = $('body').attr('id', 'couponPage');


		renderCouponList(index);

	}

	function bindEventHandle(){
		if(Page){
			Page.on('tap', '.nav', function(event){
				//console.log(event);
				switchNav($(this).data('index'));
				isflag = false;

			}).on('tap','.obtainNav', function(event){
				event.preventDefault();
				initObtainCouponPage();
			});
		}
	}

	function renderCouponList(index){
		if(!CouponList){
			fetchCouponList().done(function(res){
				if(res){
					renderCouponList(index);
				}
			})
			return;
		}
		var unUsedCoupons = CouponList.unUsedCoupons,
				usedCoupons = CouponList.usedCoupons,
				null_msg = '<li class="null-msg"><img src="'+imgPath+'common/images/promotion_empty.png" alt="" ></li>',
				template = '<li class="couponItem row" data-coupon-type="{{couponType}}" data-min-value="{{minValue}}" data-valid="{{valid}}" data-has-been-used="{{hasBeenUsed}}" id="{{userCouponId}}"><div class="col fb far"><div class="coupon"><img src="{{picUrl}}" /></div></div><div class="col fb fac fvc"><div><p>有效期至<br/>{{endTime_html}}</p><h2>{{valid_html}}</h2></div></div></li>',

				html = [];
		if($.isArray(unUsedCoupons) && unUsedCoupons.length){
			unUsedCoupons.forEach(function(item, index){
				//item.img = Common.coupon[item.value].img;
				item.valid_html = !item.hasBeenUsed ? (item.valid ? '未使用' : '已过期') :'已使用';
				item.endTime_html = bainx.formatDate('Y-m-d',new Date(item.endTime));
				html.push(bainx.tpl(template, item));
			});
			$('.unUsedCoupons', Page).html(html.join(''));
		}else{
			$('.unUsedCoupons', Page).html(null_msg);
		}
		if($.isArray(usedCoupons) && usedCoupons.length){
			html = [];
			usedCoupons.forEach(function(item, index){
				//item.img = Common.coupon[item.value].img;
				item.valid_html = !item.hasBeenUsed ? (item.valid ? '未使用' : '已过期') :'已使用';
				item.endTime_html = bainx.formatDate('Y-m-d',new Date(item.endTime));
				html.push(bainx.tpl(template, item));
			});
			$('.usedCoupons', Page).html(html.join(''));

		}else{
			$('.usedCoupons', Page).html(null_msg);

		}

		switch (URL.param.mode){
			case 'point':
				switchNav(1);
				break;
			//case 'wallet':
			//	switchNav(2);
			//	break;
			default:
				switchNav(index);
				break;
		}

	}

	function switchNav(index) {
		$('header .nav.active').removeClass('active');
		$('header .nav').eq(index).addClass('active');
		if (index == 0) {
			($('.overflow-x-wrap').hasClass('show-right')) ? $('.myCoupon .nav:nth-child(2)').addClass('active') : $('.myCoupon  .nav:first-child').addClass('active');
			$('.mainContainerA', Page)
					.removeClass('show-right').removeClass('show-right-double')
					.height(Math.max($('.overflow-y-wrap', Page).eq(0).height(), $(window).height()) + 50);


		} else if (index == 1) {
			initPointPage();
			$('.mainContainerA', Page)
					.addClass('show-right').removeClass('show-right-double')
					.height(Math.max($('.wrapOut', Page).eq(1).height(), $(window).height()) - 50);
			$('#pointPage', Page).css('height', Math.max($('.wrapOut', Page).eq(1).height(), $(window).height()) - 125);
			if ($(window).height() < 480) {
				$('.mainContainerA', Page)
						.height(Math.max($('.wrapOut', Page).eq(1).height(), $(window).height()) - 55);
			}
		}
		//else if (index == 2) {
		//	initMoneyPage();
		//	$('.mainContainerA', Page)
		//			.addClass('show-right-double').removeClass('show-right')
		//			.height(Math.max($('.wrapOut', Page).eq(2).height(), $(window).height()) - 50);
		//	$('#moneyPage', Page).css('height', Math.max($('.wrapOut', Page).eq(2).height(), $(window).height()) - 125);
        //
		//	if(isflag){
		//		$('.mainContainerA', Page)
		//				.addClass('show-right').removeClass('show-right-double');
		//	}
		//	if (URL.param.mode == 'point') {
		//		$('.mainContainerA', Page)
		//				.addClass('show-right-double').removeClass('show-right');
		//	}
        //
        //
		//}

		else if (index == 3 || index == 4) {
			$('.mainNav .nav:first-child').addClass('active');

			if (index == 3) {
				$('.mainContainerA', Page)
						.removeClass('show-right')
						.height(Math.max($('.overflow-y-wrap', Page).eq(0).height(), $(window).height()) + 50);

				$('.overflow-x-wrap', Page)
						.removeClass('show-right')
						.height(Math.max($('.overflow-y-wrap', Page).eq(0).height(), $(window).height()));


			} else {
				$('.mainContainerA', Page)
						.removeClass('show-right')
						.height(Math.max($('.overflow-y-wrap', Page).eq(1).height(), $(window).height()) + 50);
				$('.overflow-x-wrap', Page)
						.addClass('show-right')
						.height(Math.max($('.overflow-y-wrap', Page).eq(1).height(), $(window).height()));

			}
		}





	}

	function fetchCouponList(){
		return Data.fetchCouponList().done(function(res){
			console.log(res);
			CouponList = res;
		});
	}

	var fetchCoupon = bainx.singleton(function(){
		return Data.fetchCoupon().done(function(res){
			console.log(res);
			RemainCount = res.remainCount;
		});
	});

	function initObtainCouponPage(){
		var dialog = new Dialog($.extend({}, Dialog.templates.top, {
			template : '<section id="obtainCouponPage"><h1></h1><div class="guaguaka"></div><div class="signinBtnLayout fb fvc fac"><div class="signinBtnFlex"><div class="signinBtnBg"></div><div class="signinBtn fb fvc fac disable"><div class="obtain-button">领取刮刮卡<br/>试试手气哦</div></div></div></div><div class="prompt-swpie"></div></section>',
			onHideDestroy:true,
			events:{
				'tap .signinBtn':function(event){
					event.preventDefault();
					var btn = $(event.currentTarget);
					if(btn.hasClass('disable')){
						return;
					}
					initGuaguaka(
							this.$('.guaguaka'),
							btn,
							this.$('.signinBtnLayout'),
							this.$('.signinBtnBg')
					);
				},
				'swipeUp':function(event){
					event.preventDefault();
					this.hide();
				},
				'tap .prompt-swpie' : 'hide'
			}
		}));

		dialog.after('show', function(){
			renderRemainCount();
		}).after('hide', function(){
			initPage();
		}).show();

		function renderRemainCount(){
			fetchCoupon().done(function(){
				if(RemainCount && RemainCount > 0){
					dialog.$('.signinBtn').removeClass('disable');
					dialog.$('.obtain-button').html('今天还有<br/>'+ RemainCount +'张刮刮卡');
				}else{
					dialog.$('.signinBtn').addClass('disable');
					dialog.$('.obtain-button').html('再刮屏幕<br/>就报废了哦！');
				}
			});
		}

		function initGuaguaka(wrap, btn, btnwrap, btnbg){

			btnbg.addClass('animation');

			RemainCount--;

			return Data.obtainCoupon().done(function(res){
				console.log(res);
				var msg, couponImage

				wrap.empty();
				switch(res.value){
					case 500:
						msg = '嘻嘻，5元优惠券到手嘞！';
						couponImage = '<img src="' + res.picUrl + '" />';
						break;
					case 1000:
						msg = '哈哈，人品不错，10元优惠券到手！';
						couponImage = '<img src="' + res.picUrl + '" />';
						break;
					case 2000:
						msg = 'Oh yeah~~，人品大爆发了，刮到20元优惠券！';
						couponImage = '<img src="' + res.picUrl + '" />';
						break;
					default:
						msg = '吼吼，RP不够高，好像没刮中哦！';
						couponImage = '<div class="xiexiecanyu">谢谢参与</div>';
						break;
				}
				if(res.value){
					CouponList = null;
					renderCouponList(0);
				}

				require('plugin/lottery/1.0.0/lottery', function(Lottery){

					setTimeout(function(){

						renderRemainCount();

						wrap.html('<div class="lottery">'+ couponImage +'</div>').show();

						btnbg.removeClass('animation');

						btnwrap.hide();

						var lottery = new Lottery(
								$('.lottery', wrap)[0],
								'#999',
								'color',
								wrap.width(),
								wrap.height(),
								function(){
									alert(msg);
									//btn.text('再试试手气');
									wrap.hide();
									btnwrap.show();
								}
						);

						lottery.init();



					},1000);

				});

			}).fail(function(){
				RemainCount ++;
			});
		}
	}


	function initObtainCouponPage2(){
		if(!ObtainCouponPage){

			var template = '<section id="obtainCouponPage"><h1></h1><div class="guaguaka"></div><div class="signinBtnLayout fb fvc fac"><div class="signinBtnFlex"><div class="signinBtnBg"></div><div class="signinBtn fb fvc fac disable"><div class="obtain-button">领取刮刮卡<br/>试试手气哦</div></div></div></div><div class="prompt-swpie"></div></section>';

			ObtainCouponPage = $(template).appendTo('body').on('tap', '.signinBtn', function(event){
				event.preventDefault();
				if($(this).hasClass('disable')){
					return;
				}
				initGuaguaka(
						$('.guaguaka', ObtainCouponPage),
						$(this),
						$('.signinBtnLayout', ObtainCouponPage),
						$('.signinBtnBg', ObtainCouponPage)
				);
			}).on('swipeUp', function(event){
				event.preventDefault();
				Translate.outToTop(ObtainCouponPage);
				initPage();
				/*Common.slideOutToTop(ObtainCouponPage).done(function(){
				 //obtainCouponPage.remove();
				 });*/
			}).on('touchstart', function(event){
				event.preventDefault();
			}).on('touchend', function(event){
				event.preventDefault();
			});
		}
		fetchCoupon().done(renderRemainCount);

		Translate.fromInTop(ObtainCouponPage);


	}

	function renderRemainCount(){
		if(RemainCount && RemainCount > 0){
			$('.signinBtn', ObtainCouponPage).removeClass('disable');
			$('.obtain-button', ObtainCouponPage).html('今天还有<br/>'+ RemainCount +'张刮刮卡');
		}else{
			$('.signinBtn', ObtainCouponPage).addClass('disable');
			$('.obtain-button', ObtainCouponPage).html('再刮屏幕<br/>就报废了哦！');
		}
	}

	function initGuaguaka(wrap, btn, btnwrap, btnbg){

		btnbg.addClass('animation');

		RemainCount--;

		return Data.obtainCoupon().done(function(res){
			console.log(res);
			var msg, couponImage

			wrap.empty();
			switch(res.value){
				case 500:
					msg = '嘻嘻，5元优惠券到手嘞！';
					couponImage = '<img src="' + res.picUrl + '" />';
					break;
				case 1000:
					msg = '哈哈，人品不错，10元优惠券到手！';
					couponImage = '<img src="' + res.picUrl + '" />';
					break;
				case 2000:
					msg = 'Oh yeah~~，人品大爆发了，刮到20元优惠券！';
					couponImage = '<img src="' + res.picUrl + '" />';
					break;
				default:
					msg = '吼吼，RP不够高，好像没刮中哦！';
					couponImage = '<div class="xiexiecanyu">谢谢参与</div>';
					break;
			}
			if(res.value){
				CouponList = null;
				renderCouponList(0);
			}

			require('plugin/lottery/1.0.0/lottery', function(Lottery){

				setTimeout(function(){

					renderRemainCount();

					wrap.html('<div class="lottery">'+ couponImage +'</div>').show();

					btnbg.removeClass('animation');

					btnwrap.hide();

					var lottery = new Lottery(
							$('.lottery', wrap)[0],
							'#999',
							'color',
							wrap.width(),
							wrap.height(),
							function(){
								alert(msg);
								//btn.text('再试试手气');
								wrap.hide();
								btnwrap.show();
							}
					);

					lottery.init();



				},1000);

			});

		}).fail(function(){
			RemainCount ++;
		});
	}

	/**
	 * 我的积分
	 */

	function initPointPage() {

		if (!PointPage) {
			PointPage = renderPointPage();

			renderPointList();
		}
		return PointPage;

	}
	function renderPointPage() {
		var template = '<section id="pointP" class="slider-p"><header id="point-header" class="slider-header" style="z-index: 999"><h1 class="point-total">0</h1><p>您当前可用积分</p><a href="' + URL.pointRule + '">积分规则 > </a> </header><div id="pointPage" class="sliderPage"><ul class="point-list grid"></ul></div></section>';
		$('.myPoint').prepend(template);
		var ret = $('#pointPage');
		Point.ready(function () {
			$('#point-header .point-total').text(Point.totalScore);
		});
		return ret;
	}


	function renderPointList() {
		/* if (!PointList.checkHasNewData()) {
		 PointList.fetch().done(function() {
		 if (PointList.checkHasNewData()) {
		 renderPointList();
		 }
		 });
		 return;
		 }*/
		var nexter = new Nexter({
			element: $('#pointPage'),
			dataSource: Data.fetchPointList,
			enableScrollLoad: true,
			//pageSize:5
		}).load().on('load:success', function (res) {
			var template = '<li class="row"><div class="col col-20"><h3 class="title">{{reason}}</h3><p class="datetime">{{datetime}}</p></div><div class="col col-5 fb far fvc value">{{score_html}}</div></li>',
					html = [];
			if ( res.pointList.length) {
				$.each(res.pointList, function (index, item) {
					item.datetime = bainx.formatDate(new Date(item.createTime));
					item.score_html = item.score * item.symbol;
					item.score_html = item.score_html > 0 ? '+' + item.score_html : item.score_html;
					html.push(bainx.tpl(template, item));
				})
			}
			else if (this.get('pageIndex') == 0) {
				html.push('<li class="not-has-msg"><img src="'+URL.imgPath + '/common/images/integral_empty.png"/> </li>');
			}
			$('.point-list', PointPage).append(html.join(''));
		})

	}


	/***
	 * 我的钱包
	 */
	//function initMoneyPage() {
    //
	//	if (!MoneyPage) {
	//		MoneyPage = renderMoneyPage();
    //
	//		renderMoneyList();
	//	}
	//	return MoneyPage;
    //
	//}
	//function renderMoneyPage() {
	//	var template = '<section id="moneyP" class="slider-p"><header id="money-header" class="slider-header" style="z-index: 999"><h1 class="point-total price">0</h1><p>余额金额</p></header><div id="moneyPage" class="sliderPage"><ul class="point-list grid" id="wallet-list"></ul></div></section>';
	//	$('.myMoneyPack').prepend(template);
	//	var ret = $('#moneyPage');
    //
	//	return ret;
	//}
    //
    //
	//function renderMoneyList() {
	//	var nexter = new Nexter({
	//		element: $('#moneyPage'),
	//		dataSource: Data.getMyWallet,
	//		enableScrollLoad: true,
	//		//pageSize:5
	//	}).load().on('load:success', function (res) {
	//		var template = '<li class="row"><div class="col col-20"><h3 class="title">{{reason}}</h3><p class="datetime">{{datetime}}</p></div><div class="col col-5 fb far fvc value">{{totalFee}}</div></li>',
	//				html = [],
	//				originType = {
	//					'0':'充值到钱包',
	//					'1':'退款到钱包',
	//					'2':'购买使用'
	//				};
	//		if ( res.walletOrigins.length) {
	//			$.each(res.walletOrigins, function (index, item) {
	//				//var item = res.walletOrigins[i];
	//				item.datetime = bainx.formatDate(new Date(item.dateCreated));
	//				item.reason = originType[item.type];
	//				item.totalFee = Common.moneyString(item.totalFee);
	//				item.totalFee = item.type != 2 ? '+' + item.totalFee : item.totalFee;
	//				html.push(bainx.tpl(template, item));
	//			})
	//		}
	//		else if (this.get('pageIndex') == 0) {
	//			$('#moneyP ul').css('height','100%');
	//			html.push('<li class="not-has-msg"><img src="'+URL.imgPath + '/common/images/wallet_empty.png"/> </li>');
	//		}
    //
	//		$('#wallet-list', MoneyPage).append(html.join(''));
	//		$('#money-header .point-total').text(Common.moneyString(res.balanceFee));
	//	})
	//}
	init();
});