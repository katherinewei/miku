require(['jquery', 'h5/js/common'], function($, Common){

	var Page,
		sharePromptPage;
		

	function init(){
		renderPage();
		setShare();
	}

	function renderPage(){
		var gid = 2266;
		var template = '<section id="new-active-page"><div class="module-1"><img src="http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20150317/vNTT-0-1426602861330.jpg"></div><div class="module-2"><div class="module-layout-1"><div class="m0"><img src="http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20150317/vNTT-0-1426602861357.jpg"></div></div><div class="module-layout-2"><img src="http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20150317/vNTT-0-1426602861435.jpg"><div class="m1"></div><div class="m2"></div></div></div><div class="module-3"><img src="http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20150319/vNTT-0-1426752003911.png"><div class="m3"></div></div></section>';
		Page = $(template).appendTo('body').on('tap', '.m0',function(event){
            event.preventDefault();
            Common.URL.assign('/api/h/1.0/userCenter.htm');
        }).on('tap', '.m1',function(event){
            event.preventDefault();
            checkActiveAndOrder(gid);
        }).on('tap', '.m2',function(event){
            event.preventDefault();
            
            showShare();
        });

	}

	function showShare(){
		if(!sharePromptPage){
            sharePromptPage = new Common.Dialog({
                template : '<section id="share-prompt-page" ><div class="jiantou"></div><div class="page-dialog"><p>这个地方可以分享告诉好友哦!<br>仅支持微信中分享</p><div class="iknow-button dialog-close">我知道了</div></div></section>',
                full : true
            });
        }
        sharePromptPage.show();
	}

	function setShare(){
		if(Common.inWeixin){
            Common.weixin.ready(function(){
                var shareOption = {
                    title: '哇塞，40元水果大红包，还可1元抢七彩果盒', // 分享标题
                    desc: '关注果格格微信公众号或者下载果格格APP，注册成功后即可领取35 元水果现金券和500积分，活动期间，七彩果盒1元抢购，Duang Duang超值，数量有限，速速去抢！！', // 分享描述
                    link: location.href + (/\?/.test(location.href) ? '&' : '?') + 'mode=active' , // 分享链接
                    type: 'link', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    imgUrl: 'http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20150317/vNTT-0-1426602861330.jpg', // 分享图标
                    success: function () { 
                        // 用户确认分享后执行的回调函数
                        console.log('用户已分享');
                    },
                    cancel: function () { 
                        // 用户取消分享后执行的回调函数
                        console.log('用户取消分享');
                    }
                };
                Common.weixin.onMenuShareAppMessage(shareOption);
                Common.weixin.onMenuShareTimeline(shareOption);
                Common.weixin.onMenuShareQQ(shareOption);
                Common.weixin.onMenuShareWeibo(shareOption);
            });
        }
	}

	function checkActiveAndOrder(gid){
		return Common.Data.checkActiveOrder(gid).done(function(res){
			console.log(res);
			if(res.items && res.items.length){
				var data = res.items[0];
				if(data.item_status != 1){
					window.alert('不好意思，商品已经下架了！');
					return;
				}
				if(data.num<1){
					window.alert('不好意思，商品没有库存了！');
					return;
				}
				if(data.picked != '1'){
					window.alert('不好意思，您已经参加过此活动了！');
					return;
				}
				Common.URL.assign('/api/h/1.0/placeOrder.htm?gid='+gid+'&count=1&nopoint=1');
			}else{
				window.alert('不好意思，商品不存在！');
			}
		});
	}

	init();
});