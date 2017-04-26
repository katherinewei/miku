<script id="file-content" type="text/javascript">
define('h5/js/common/template', <%= templates %>);
</script>

<div id="templates">

	<div id="halfGoods">
		<div class="goods checked half-goods" data-id="{{itemId}}" data-price="{{price}}" data-limit="{{limitNum}}">
			<div class="goods-img" >
				<img data-lazyload-src="{{bigimg}}" />
				<span class="limit">限购{{limitNum}}件</span>
				<span class="count"></span>
			</div>
	        <div class="goods-info row">
	            <div class="col col-21">
	            <h2>
	            	<span class="title">{{title}}</span>
	            	<span class="specification">{{specification}}</span>

	            </h2>
	            <h3>
	            	<span class="price">{{html_price}}</span>
	            	<span class="rel-price">{{html_refprice}}</span>

	            </h3>
	            </div>
	            <div class="col col-4 fb far fvc">
	                <a class="add-cart iconfont"></a>
	            </div>
	        </div>
	    </div>
	</div>

	<div id="halfRelGoods">
		<li class="goods" data-id="{{itemId}}" data-price="{{price}}" >
			<div class="goods-bg">
	            <!--div class="iconfont check-icon"></div-->
	            <a class="add-cart iconfont"></a>
	            <div class="goods-img" >
	            	<img data-lazyload-src="{{listimg}}" />
	            	<span class="count"></span>
	            </div>
	            <div class="goods-info">
	                <h2>
	                	<span class="title">{{title}}</span>
	                	<span class="">{{specification}}</span>
	                </h2>
	                <h3>
	                    <span class="price">{{html_price}}</span>
	                    <span class="rel-price">{{html_refprice}}</span>
	                </h3>
	            </div>
            </div>
        </li>
	</div>

	<div id="taskitem">
		<div class="row fvc" href="{{href}}">
	        <div class="col col-3">
	        	<div class="iconfont {{icon}}"></div>
	        </div>
	        <h1 class="col col-20">{{title}}</h1>
	        <div class="col col-2">
	        	<div class="iconfont {{right}}"></div>
	        </div>
	    </div>
    </div>

	<div id="countBox">
		<div class="count-box fb">
			<div class="col">
				<a class="count-diff iconfont"></a>
			</div>
			<div class="col">
            	<a class="count">{{item_count}}</a>
            </div>
            <div class="col">
            	<a class="count-add iconfont"></a>
            </div>
        </div>
	</div>

	<div id="bannerItem">
		<li class="{{className}}" href="{{href}}" ><img data-lazyload-src="{{img}}" /></li>
	</div>
	<div id="banner">
		<div class="{{className}}" href="{{href}}"><img data-lazyload-src="{{img}}" /></div>
	</div>
	<div id="slideBannerItem">
		<li class="{{className}}" href="{{href}}" ><img dataimg="{{img}}" class="lazyimg" ></li>
	</div>
	
	<div id="indexGoodsItem">
		<li class="{{className}}" href="{{href}}">
			<img src="{{img}}" />
			<div class="qianggou"></div>
		</li>
	</div>

	<div id="categoryTabsNav">
		<li class="col page-tabs-trigger" data-index="{{index}}" data-id="{{id}}">{{text}}</li>
	</div>

	<div id="categoryTabsPanel">
		<div class="page-tabs-panel" data-role-scrollable="true" data-category-id="{{id}}"><ul class="goods-list clearfix"></ul></div>
	</div>

	<div id="listNotHasDataMsg">
		<li class="not-has-data-msg">请稍等，我们努力搬运中...</li>
	</div>

	<div id="page">
		<section class="page slide">
		    <div class="page-content fade">
		        <div data-role-scrollable="true" class="page-scroll-panel"></div>
		    </div>
		</section>
	</div>
	
	<div id="consignee">
		<div class="consignee row" >
			<div class="col col-2 fb fvc">
				<div class="iconfont address-icon"></div>
			</div>
			<div class="col col-21 consignee-content">
					<div class="row">
						<span class="col contact">{{receiverName}}</span>
						<span class="col phone">{{receiverMobile}}</span>
					</div>
					<div class="row address">
						{{receiver_state}}
						{{receiverCity}}
						{{receiverDistrict}}
						{{communityName}}
						{{receiverAddress}}
					</div>
			</div>
			<div class="col col-2 fb fvc far">
				<div class="iconfont right-icon"></div>
			</div>
		</div>
	</div>


	<div id="goods">
		<li class="goods row" data-id="{{item_id}}">
			<div class="col col-6">
		    	<img class="thumimg" src="{{thumimg}}" />
		    </div>
		    <div class="col col-13 pd-10">
		        <h1>
		            <span class="title">{{ title }}</span>
		            <span class="spec">{{ specification }}</span>
		        </h1>
		    </div>
		    <div class="col col-6 pt-10">
		        <h2 class="price">{{ html_price }}</h2>
		        <h3 class="count">{{ item_count }}</h3>
		    </div>
		</li>
	</div>
    
    <div id="pageTabs">
    	<div class="page-list-tabs" >
		    <div class="page-tabs-nav-layout">
		        <div class="clearfix page-tabs-nav" data-switchable-role="nav"></div>
		    </div>
		    <div class="page-tabs-content" data-switchable-role="content"></div>
		</div>
    </div>

    <div id="smallCart">
    	<div class="small-cart row pd-05 fvc">
		    <div class="sumTotal col col-17">
		        <!--i class="iconfont top-icon"></i-->
		        合计:<em class="price">{{ sumPrice }}</em>
		        商品:<em class="sum-goods-count">{{ goodsCount }}</em>种
		    </div>
		    <div class="col col-8 button enter fb fvc fac" data-href="{{href}}">
		        {{ submitText }}
		    </div>
		</div>
    </div>

   

	

	<div id="goodsDetail">
        <div class="goods" data-id="{{item_id}}">
            <h1 class="tc pd-05">
                <span class="title">{{title}}</span>
                <span class="spec">{{specification}}</span>
            </h1>
            <h2 class="price tc">{{html_price}}<span class="refprice">{{html_refprice}}</span></h2>
            <p class="summary">{{desc}}</p>
        </div>
    </div>

    

	<div id="orderTabsNavItem">
		<div class="col page-tabs-trigger">{{text}}</div>
	</div>
	<div id="orderTabsPanel">
		<div class="page-tabs-panel" data-status="{{status}}"></div>
	</div>
	
	<div id="orderListItem">
		<li class="order layout" data-id="{{trade_id}}">
		    <div class="order-goto-detail" href="/api/h/1.0/orderDetail.htm?oid={{trade_id}}">
		        <ul class="goods-list order-goods-list grid">{{itemsHtml}}</ul>
		        <ul class="goods-suminfo clearfix">{{suminfo}}</ul>
		    </div>
		    {{actions}}
		</li>
	</div>

	<div id="orderDetailPay">
		<div class="panel"><div class="button dopay">立即付款</div></div>
	</div>
	

	<div id="addressItem">
		<li class="address-item {{defaultClassName}}" data-id="{{id}}" >
			<div class="delete fb fvc fac"></div>
			<div class="row">
				<div class="col col-3 select-event-handle fb fvc">
					<div class="iconfont check-icon"></div>
				</div>
				<div class="col col-20 {{select}}" {{edit}} >
					<h1>
						<strong class="contact">{{receiverName}}</strong>
						<span class="mobile">{{receiverMobile}}</span>
					</h1>
					<p class="addr">
						{{receiver_state}}
						{{receiverCity}}
						{{receiverDistrict}}
						{{communityName}}
						{{receiverAddress}}
					</p>
				</div>
				<div class="col col-2 fb fvc far" href="/api/h/1.0/editAddr.htm?aid={{id}}&op=edit">
					<div class="iconfont right-icon"></div>
				</div>
			</div>
		</li>
	</div>


	<div id="communityKeywordBox">
		<div class="keyword-search-layout">
			<h1 class="keyword-title">请输入关键字，如：北部软件园</h1>
			<div class="keyword-layput grid layout">
				<div class="row">
					<input type="text" class="col keyword" placeholder="搜索关键字" />
				</div>
			</div>
		</div>
	</div>

	<div id="communityPageContent">
		<div class="scroll-container form-items">
			<div class="location-msg">正在定位...</div>
			<div class="result-layout location-result">
				<h2>当前位置</h2>
				<div class="layout">
					<ul class="result "></ul>
				</div>
			</div>
			<div class="result-layout nearby-result">
				<h2>附近位置</h2>
				<div class="layout">
					<ul class="result "></ul>
				</div>
			</div>
			<div class="result-layout search-result">
				<h2>查找位置：</h2>
				<div class="layout">
					<ul class="result "></ul>
				</div>
			</div>
		</div>
	</div>

	<div id="payment">
		<section class="payment-popup">
			<div class="popup-mask"></div>
			<div class="popup-body grid">
				<h1 class="payment-icon popup-title">
					请选择支付方式
				</h1>
			</div>
		</section>
	</div>
	<div id="paymentItem">
		<div class="payment-item {{payment}}-icon" data-payment="{{payment}}">
			<h2>{{title}}</h2>
			<p>{{desc}}</p>
		</div>
	</div>

	<div id="notice">
		<div class="notice">
			<div class="header grid">
				<div class="row">
					<div class="col col-9 fac fvc fb prev">&lt;&nbsp;上一期</div>
					<div class="col col-7 fac fvc fb curr tc">正在加载</div>
					<div class="col col-9 fac fvc fb next">下一期&nbsp;&gt;</div>
				</div>
			</div>
			<div class="content">
			</div>
		</div>
	</div>

	<div id="noticeGoods">
		<li class="activeItem grid" data-index="{{index}}" data-activeId="{{activeId}}" data-itemId="{{itemId}}">
			<div class="goods-image">
				<img dataimg="{{bigimg}}" class="lazyimg" />
				<span class="count"></span>
			</div>
			<div class="row">
				<div class="col col-18">
					<h2>{{title}}{{specification}}</h2>
					<p>
						<span class="price">{{html_activePrice}}</span>
						<span class="refprice">{{html_refprice}}</span>
					</p>
				</div>
				<div class="col col-7 fb far fvc">
					{{action}}
				</div>
			</div>
		</li>
	</div>
    
</div>
