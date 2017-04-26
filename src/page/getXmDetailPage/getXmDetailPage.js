/**
 * 项目详情
 * Created by xiuxiu on 2016/9/10.
 */
require([
    'jquery',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/url',
    'h5/js/common/loadImage',
], function ($, Data, Common,URL,LoadImage) {
    var data = {
            id:URL.param.id
        }
    var Page;
    Data.getxmBannerDetail(data).done(function(res){
        var resData = res.data;
        document.title = resData.title;
        Common.headerHtml('9LAB');
        var pic = resData.detailPicUrl,html=[];
        if(pic != ''){
            pic = pic.split(';');
            $.each(pic,function(i,item){
                html.push('<img data-lazyload-src="'+item+'" />');
            })
        }

        Page =  $('body').append('<div class="page-content">'+html.join('')+'</div><div class="consultBtn" href="'+URL.anonymousChatPage+'?loginentrance=3&description='+resData.description+'&title='+resData.title+'"><span>立即咨询</span></div> ');
        LoadImage(Page);

    })

})

