require([
    'jquery',
    'h5/js/common/url', 
    'h5/css/page/help.css'
], function($, URL){
   
    function renderSecurity(){
        $('body').html('<div id="security" style="width:320px;margin:0 auto;padding-bottom: 20px;position: relative;"><img src="http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20150414/vNTT-0-1428993346697.jpg" /><img src="http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20150414/vNTT-0-1428993346721.jpg" /><img src="http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20150414/vNTT-0-1428993346732.jpg" /><a id="range" class="open-map-dialog"  style="position: absolute;background: transparent;display: block;width: 120px;height: 33px;top: 504px;left: 50%;margin-left: -107px;"></a><img src="http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20150414/vNTT-0-1428993347461.jpg" /></div>');
    }

    function renderHotQuestion(){
        $('body').html('<div id="hotquestion" style=" width:320px;margin:0 auto;padding-bottom: 20px;"><img src="http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20150414/vNTT-0-1428994094238.jpg" /><img src="http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20150414/vNTT-0-1428994095127.jpg" /><img src="http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20150414/vNTT-0-1428994095734.jpg" /></div>');
    }

    function renderDefault(){
        $('body').html('<style>body {background-image: url(http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20150320/vNTT-0-1426823492978.jpg);-webkit-background-size: 100%;background-size: 100%;height: auto;min-height: 100%;overflow: auto;}.wrap {width: 261px;margin: 0 auto;padding-top: 30px;padding-bottom: 30px;}.wrap .m {margin: 30px 0;}.wrap .m2 {position: relative;}.wrap .m2 a {position: absolute;background-color: transparent;width: 100px;height: 30px;top: 68px;left: 40px;}.wrap .m7 img {margin: 0 auto;}</style><div class="wrap"><div class="m0"><img src="http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20150320/vNTT-0-1426823604011.png" width="115" height="61"></div><div class="m1 m"><img src="http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20150320/vNTT-0-1426823604040.png"></div><div class="m2 m"><img src="http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20150403/vNTT-0-1428032710488.png"><a class="open-map-dialog"></a></div><div class="m3 m"><img src="http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20150320/vNTT-0-1426823604595.png"></div><div class="m4 m"><img src="http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20150320/vNTT-0-1426823604647.png"></div><div class="m5 m"><img src="http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20150320/vNTT-0-1426823604931.png"></div><div class="m6 m"><img src="http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20150320/vNTT-0-1426823605139.png"></div><div class="m7"><img src="http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20150320/vNTT-0-1426823605125.png" width="123" height="12"></div></div>');

        //href="http://h5.welinjia.com/h5/html/map.html"
        
        
    }

    function init(){
        if(URL.param.m == 'security' || URL.param.m== 'xfbz'){
            renderSecurity();
        }else if(URL.param.m == 'qa'){
            renderHotQuestion();
        }else{
            renderDefault();
        }
        $('.open-map-dialog').on('tap', function(event){
            event.preventDefault();
            require('h5/js/common/mapDialog', function(WLMapDialog) {
                var mapDialog = new WLMapDialog().show()//.set('shopId', 2005);
            });
        })
    }

    init();
})