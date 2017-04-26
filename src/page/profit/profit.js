/**
 * 我的分润 lin
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

	var Page ,		//页面
        main_section = '.mainWrap', //主区块
        sumReturnSaleRecord,//已退款金额
        profitCountData     //分润统计数据
	;

	function init(){
	    profit_index(); //首页页面
            
            bindEvents();  //绑定事件
	}
        
        //首页
        function profit_index(){
            $(main_section).remove();
            Page = $('<section id="profitPage"><div class="mainWrap"> <div class="head head-profit"></div><div class="main"></div></div></section>').appendTo('body');
     
            profitDate();
            
        }
        
        //页面头部
        function head_html(){
            var html = [];
            var tit_right_html = '<div class="head-tit-right"></div>';
            var head_money_right_html = '<div class="money-right"></div>';
            var head_money_template = '<div class="head-money grid"><div class="money-left"><div class="left-top">账号余额(元)</div><div class="left-buttom">{{noGetpayFee}}</div> </div>' + head_money_right_html + '<div class="row money_group"><div class="col"><div class="item canGet "><p>可提现金额</p><p class="canGetFee ">{{canGetpayFee}}</p></div></div><div class="col " href="' + URL.returnSaleRecord + '"><div class="item refund" ><p>已退款金额</p><p>' + sumReturnSaleRecord + '</p></div><div class="far fb fvc next"></div> </div> </div></div>';
            
            html.push('<div class="head-tit"><div class="head-tit-left" onclick="javascript:history.go(-1);"></div><span>我的推广费</span>'+tit_right_html+'</div>');
            html.push(bainx.tpl(head_money_template, profitCountData));//替换数据
            $('.head').html(html.join(''));
        }
        
        //统计总数
        function profit_html(){
            var main_import_html = '<div class="main-import grid"></div>';
            $('.main').html(main_import_html);
            
            //var top_left_html = '<div class="left-top"></div><div class="left-mid">累计推广费</div><div class="left-bottom">¥{{totalShareFee}}</div>';
            //$('.import-top .top-left').html(bainx.tpl(top_left_html, profitCountData));
            //
            //var top_right_html = '<div class="right-top"></div><div class="right-mid">累计销售</div><div class="right-bottom">¥{{pSalesFee}}</div>';
            //$('.import-top .top-right').html(bainx.tpl(top_right_html, profitCountData));
            //
            //var buttom_left_html = '<div class="left-top"></div><div class="left-mid">已提现</div><div class="left-bottom">¥{{totalGotpayFee}}</div>';
            //$('.import-buttom .buttom-left').html(bainx.tpl(buttom_left_html, profitCountData));
            //
            //var buttom_right_html = '<div class="right-top"></div><div class="right-mid">提现中</div><div class="right-bottom">¥{{getpayingFee}}</div>';
            //$('.import-buttom .buttom-right').html(bainx.tpl(buttom_right_html, profitCountData));

            var tpl = '<div class="row"><div class="col borderH borderV"><img src="'+URL.imgPath+'/common/images/icon_money1.png"/><p>累计推广费<span class="price">{{totalShareFee}}</span></p> </div><div class="col borderV"><img src="'+URL.imgPath+'/common/images/icon_money2.png"/><p>累积单数<span class="">{{pTradesCount}}</span></p> </div> </div><div class="row"><div class="col borderH left-mid next_gray"><img src="'+URL.imgPath+'/common/images/icon_money3.png"/><p>已提现<span class="price">{{totalGotpayFee}}</span></p> </div><div class="col right-mid next_gray"><img src="'+URL.imgPath+'/common/images/icon_money4.png"/><p>提现中<span class="price">{{getpayingFee}}</span></p> </div> </div>';
            $('.main-import').html(bainx.tpl(tpl, profitCountData));
            
        }
        
        //直接与间接分润金额
        function profit_money(name,total,profitTotal){
         
            var template = '<div class="profit"><div class="profit-left"><div class="left-top">'+name+'分销(元)</div><div class="left-bottom">¥{{'+total+'}}</div></div><div class="profit-right"><div class="right-top">分润额(元)</div><div class="right-bottom">¥{{'+profitTotal+'}}</div></div></div>';
            $(bainx.tpl(template, profitCountData)).appendTo(main_section);
        }
        
        //块之间的间隙
        function border_gap(){
            $('<div class="border-width"></div>').appendTo(main_section);
        }
        
        //提交按钮
        function sub_botton(msg){
            $('<div class="sub-button"><a class="withdraw">' + msg + '</a></div>').appendTo('#profitPage');
        }
        
        //绑定事件
        function bindEvents() {
            Page.on('tap', '.head-tit-right', function(event){
                event.preventDefault();
                location.href = URL.profitHelp; //分润帮助页面
            }).on('tap', '.head-money .money-right', function(event){
                event.preventDefault();
                var money = $('.head-money .canGetFee').text();
                location.href = URL.salesRecordListHtm+'?type=0&money='+money; //余额明细
            }).on('tap', '.left-mid', function(event){
                event.preventDefault();
                location.href = URL.getPayListHtm+'?type=2'; //已提现
            }).on('tap', '.right-mid', function(event){
                event.preventDefault();
                location.href = URL.getPayListHtm+'?type=1'; //提现中
            }).on('tap', '.withdraw', function(event){
                event.preventDefault();
                location.href = URL.reqGetPayHtm; //我要提现
            });
        }
        
        //获取分润统计数据
        function profitDate(){
            return  Data.profileProfit().done(function(res){
			console.log(res);
                        profitCountData = res.agencyShareAccount;
                sumReturnSaleRecord = res.sumReturnSaleRecord;
                        head_html(); //头部
            
                        profit_html();//分润总数统计

                        //border_gap(); //间隔
                        //profit_money('直接','directSalesFee','directShareFee');  //直接分润
                        //
                        //border_gap(); //间隔
                        //profit_money('间接','indirectSalesFee','indirectShareFee');  //间接分润

                        //border_gap(); //间隔
                        sub_botton('我要提现'); //提交按钮
                       
                    });
        }
        
	init();
});