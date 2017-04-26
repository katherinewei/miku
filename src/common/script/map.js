define('h5/js/common/map', [
    'jquery'
], function($) {

    function loadScript() {
        console.log(callback, key ,'loadScript');

        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "http://webapi.amap.com/maps?v=1.3&key="+ key +"&callback="+callback;
        document.body.appendChild(script);
    }
    var key = '68a0bff0e024c317ac1ecda5ba7deb23';
    var callback = key;  //+ '-' + (new Date()).getTime(); 会引起js文件不能缓存导致每次加载此js的问题
    var promise = $.Deferred();

    window[callback] = function(){
        AMap && promise.resolve(AMap);
        delete window[callback];
    }

    function Gaode(){};

    promise.promise(Gaode);
    

    Gaode.ready = function(callback){
        callback && Gaode.done(callback);
        if(!Gaode._readyed){
            loadScript();
            Gaode._readyed = true;
        }
        return Gaode;
    }


    //添加marker和infowindow   
    function addmarker(map, d) {
    	var lng = d.lng,
    		lat = d.lat;
        var markerOption = {
            map: map,
            icon: "http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20150414/vNTT-0-1428989624848.png", //"http://api.amap.com/Public/images/js/yun_marker.png",
            offset: new AMap.Pixel(-10, -30),
            position: new AMap.LngLat(lng, lat)
        };
        var mar = new AMap.Marker(markerOption);

        var infoWindow = new AMap.InfoWindow({
            content: bainx.tpl(d.template, d),
            size: new AMap.Size(300, 0),
            autoMove: true,
            offset: new AMap.Pixel(0, -30)
        });
        AMap.event.addListener(mar, "tap", function() {
            infoWindow.open(map, mar.getPosition());
        });
    }

    function Polygon(coords){
    	this.path = [];

    	var tmp = [];
    	if (typeof coords === 'string') {
            tmp = coords.split(',');
        } else if ($.isArray(coords)) {
            tmp = coords;
        }
        var minX = 180,
        	minY = 90,
        	maxX = 0,
        	maxY = 0;
        for (var i = 0, len = tmp.length; i < len; i += 2) {
            this.path.push(new AMap.LngLat(tmp[i], tmp[i + 1]));
            minX = Math.min(minX, tmp[i]);
            maxX = Math.max(maxX, tmp[i]);
            minY = Math.min(minY, tmp[i+1]);
            maxY = Math.max(maxY, tmp[i+1]);
        }
        this.path.push(new AMap.LngLat(tmp[0], tmp[1]));
        
        this.topLeft  = new AMap.LngLat(minX, minY);
        this.topRight = new AMap.LngLat(maxX, minY);
        this.bottomLeft = new AMap.LngLat(minX, maxY);
        this.bottomRight = new AMap.LngLat(maxX, maxY);
        this.center = new AMap.LngLat((maxX-minX) / 2 + minX, (maxY-minY) / 2 + minY);
    }

    function drawPolygon(map, polygon) {
        map.clearMap();
        var polygon = new AMap.Polygon({
            map: map,
            path: polygon.path,
            strokeColor: "#3366FF",
            strokeOpacity: 0.2,
            strokeWeight: 2,
            fillColor: "#3366FF",
            fillOpacity: 0.2
        });
    }

    Gaode.Polygon = Polygon;
    Gaode.addmarker = addmarker;
    Gaode.drawPolygon = drawPolygon;

    return Gaode;
});
