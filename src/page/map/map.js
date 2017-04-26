define('h5/js/page/map',['jquery','h5/js/common','h5/css/page/map.css'], function($, Common){

	var isDialog = !/map\.htm/gi.test(location.pathname);

	var sites = [
			'http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20150317/vNTT-0-1426580412234.jpg',
			'http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20150408/vNTT-0-1428496860741.jpg',
			//'http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20150317/vNTT-0-1426580412286.jpg',
			'http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20150317/vNTT-0-1426580412786.jpg',
			'http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20150317/vNTT-0-1426580413453.jpg',
			'http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20150317/vNTT-0-1426580413778.jpg',
			'http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20150317/vNTT-0-1426580413748.jpg'/*,
			'http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20150317/vNTT-0-1426598372660.jpg'*/
		],
		html = ['<section id="sites-map"><div class="sites-list-layout"><ul>'];

	sites.forEach(function(item, index){
		html.push('<li><img src="'+ Common.imgSrc(item) +'" /></li>');
	});
	html.push('</ul></div><h1>果格格站点列表'+(isDialog ? '<div class="dialog-close sites-map-close"></div>' : '' )+'</h1></section>');


	var Page = new Common.Dialog({
		template : html.join(''),
		full : false,
		translate : 'Right'
	});




	return Page;

});