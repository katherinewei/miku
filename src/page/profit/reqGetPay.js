/**
 * 我的分润 我要提现lin
 */
require([
	'jquery', 
	'h5/js/common/url', 
	'h5/js/common/data', 
	'h5/js/common',
	'h5/js/common/translate', 
	'h5/js/common/transDialog'
],function($, URL, Data, Common, Translate, Dialog){
        //获取URL参数  URL.param.mode=='obtain'

	var Page,		//页面
        main_section = '#profitPage', //主区块
        profitCountData;


	function init(){
	    profit_index(); //首页页面
            bindEvents();  //绑定事件
	}
        
        //首页
        function profit_index(){
            Page = $('<section id="profitPage" style="overflow-y: auto"><div class="mainWrap"><div class="head head-profit"></div><div class="main"><div class="apply-button"><div class="button-left active" data-type="1">支付宝</div><div class="button-right " data-type="2">微信</div></div></div></div> </section>').appendTo('body');
            sub_botton('申请提现'); //提交按钮
            sub_form(1);
            profitDate();
            $('.main').after('<p style="color: #fa4f90;padding: 0 5%" class="tips">通知：<br />1、提现审核时间为月初或者月中<br />2、使用微信提现更方便快捷，等待审核时间更短。</p>');
        }
        
        //页面头部
        function head_html(){
          
            var html = [],
                head_money_right_html = '<div class="money-right"></div>',
                head_money_template = '<div class="head-money"><div class="money-left"><div class="left-top">可提现余额(元)</div><div class="left-buttom canGetFee">{{canGetpayFee}}</div> </div>' + head_money_right_html + '</div>';
            
            html.push('<div class="head-tit"><div class="head-tit-left" onclick="javascript:history.go(-1);"></div><div class="head-tit-mid">申请提现</div></div>');
            html.push(bainx.tpl(head_money_template, profitCountData));//替换数据
            $('.head').html(html.join(''));
            $('.head-money').css('height','7em');
            if ($(' .canGetFee').text() == '0.00') {
                $('.withdraw').addClass('disabled');
            }
        }
        
        //表单
        function sub_form(account_type){
            var account_name;

            if(account_type == 1){
                account_name = '支付宝';
                $('.main').append('<div class="subForm zhifubao sel_active"><div class="boxContent2"> <div class="appliy"><label class="account-name">' + account_name + '账户:</label><input type="text" name="account" id="account" value="" placeholder="请输入' + account_name + '账户"></div><div class="appliy"><label class="account-name">支付宝实名:</label><input type="text" name="name" id="name" value="" placeholder="请输入支付宝实名"></div></div><p class="howToView"><a href="'+URL.howToView + '&payWay=1">查看支付宝到账</a></p> </div>');

                ($(' .canGetFee').text() == '0.00') ? $('.withdraw').addClass('disabled'): $('.withdraw').removeClass('disabled');

                $('.tips2').show();

            }else{
                $('.tips2').hide();
                Data.checkHasRegisterWeiXin().done(function(res){
                    var descTip,
                        className,
                        imgSrc;
                    if(Common.inWeixin){
                        if(res.status == 1){         //已在微信公众号注册
                            descTip = '您已关注公众号，可直接提现';
                            imgSrc = URL.imgPath + '/common/images/icon_done.png';
                            className='';
                            ($(' .canGetFee').text() == '0.00') ? $('.withdraw').addClass('disabled'): $('.withdraw').removeClass('disabled');
                        }else{

                            descTip = '长按二维码关注米酷公众号<br/>微信提现更轻松';
                            imgSrc = URL.imgPath + '/common/images/publicNo.png';
                            className='ewm';
                            $('.withdraw').addClass('disabled');
                        }

                    }else{
                        descTip = '关注米酷公众号，微信提现更轻松<a href='+URL.howtoAttention+'>如何关注米酷公众号</a>';
                        imgSrc = URL.imgPath + '/common/images/icon_n_done.png';
                        className='';
                        $('.withdraw').addClass('disabled');
                    }
                    var html = '<div class="subForm  sel_active"><div class="boxContent"><div class="boxImg"><img src="'+imgSrc+'" class="'+className+'" /><p>'+descTip+'</p></div> </div><p class="howToView"><a href="'+URL.howToView + '&payWay=2">查看微信到账</a></p></div>';
                    $('.main').append(html);

                })
           }


        }
        
        //提交按钮
        function sub_botton(msg){
            $('.mainWrap').height($(window).height() -45).css('padding-bottom',0);
            $('<div class="sub-button"><a class="withdraw">'+msg+'</a></div>').appendTo(main_section);
        }
        
        //绑定事件
        function bindEvents() {
            Page.on('focus', 'input', function (event) {
                event.preventDefault();

                //todo
                //document.querySelector('input').scrollIntoView();

            }).on('tap', '.apply-button div', function (event) {
                event.preventDefault();
                $('.apply-button div').removeClass('active');
                $(this).addClass('active');
                $('.subForm').remove();
                var key = $(this).index();
                sub_form(key+1);
            }).on('tap', '.success-btn', function(event){
                event.preventDefault();
                $('#mask-layer,.sub-success').remove();
            }).on('tap', '.head-money .money-right', function(event){
                event.preventDefault();
                var money = $('.head-money .left-buttom').text();
                location.href = URL.salesRecordListHtm+'?money='+money; //余额明细
            }).on('focus', 'input', function() {
                $('.sub-button').css('position','static');
               // $('.mainWrap').css('height','90%');
                //$('.sub-button').hide();
            }).on('blur', 'input', function() {
                $('.sub-button').css('position','absolute');
               // $('.mainWrap').css('height','100%');
                //$('.sub-button').show();
            }).on('keyup', 'input', function (e) {
                var key = e.which;
                if (key == 13) {
                    submit();
                }
            }).on('tap', '.withdraw', function(event){
                event.preventDefault();
                if ($(this).hasClass('disabled')) {
                    return false;
                }
                $('input').blur();
                submit();
            });
            $('body').on('tap','.reset',function(e){
                $('.telDialog').remove();
            })
        }

    function submit(){
        var msg,
            type = $('.apply-button .active').data('type'),
            account = $('#account').val(),
            name = $('#name').val(),
        //money = $('#money').val(),
            data = {
                getpayType:type,//提现类型（1支付宝，2微信钱包，3银行卡）
                account:account,//账号
                accountName: name//收款人姓名
                //getpayFee:money //申请提现金额
            };

        if(account == ''){
            msg = '提现账号不能为空!';
            bainx.broadcast(msg);
            return false;
        }

        if(name == ''){
            msg = '姓名不能为空!';
            bainx.broadcast(msg);
            return false;
        }
        /*if(money == ''){
         msg = '提现金额不能为空!';
         bainx.broadcast(msg);
         return false;
         }*/
        if(parseFloat($('.canGetFee').text()) < 1){
            bainx.broadcast('您的提现金额小于1块钱，不能提现哦~');
            return false;
        }


        Data.reqGetPay(data).done(function(res){
            console.log(res);
            //msgDialog();
            $('.canGetFee').text('0.00');
            $('body').append('<section class="telDialog wl-trans-dialog translate-viewport" style="display: block;"><div class="cont bounceIn"><p></p><div class="btngroup"><span class="btn reset">取消</span> <span href="' + URL.howToView + '&payWay='+type+'" class="btn ring">查看到账流程</span></div></div></section>');
            if(type == 1){
                $('.telDialog p').text('您已成功提交提现申请，我们会在一到两个工作日审核！')
            }else{
                $('.telDialog p').text('您已提现成功！')
            }
            //bainx.broadcast('申请提现成功,请耐心等候审核');

        }).fail(function(res){
            console.log('msg:'+res);
        });
    }

    /*function msgDialog() {
        var msgTemplate = '<div class="dialog"><h3>申请提现成功,请耐心等候审核</h3><a class="btn-confirm" href="javascript:;">确定</a></div>';
        Page = $(msgTemplate).appendTo('body');

        Page.on('tap', '.btn-confirm', function (event) {
            event.preventDefault();

            $('.dialog').remove();

            $('input', '.subForm').val('');
        })
        }
     */
        //获取分润统计数据
        function profitDate(){
            return  Data.profileProfit().done(function(res){
			console.log(res);
                        profitCountData = res.agencyShareAccount;
                        head_html(); //头部
                    });
        }
        
	init();
});