/**
 * Created by Spades-k on 2016/6/16.
 */

require([
    'jquery',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/url',
    'h5/js/common/loadImage',
    'h5/js/common/nexter',
    'h5/js/common/transDialog',
    'h5/js/common/lazyload'
], function ($, Data, Common, URL,LoadImage, Nexter,Dialog,Lazyload) {
    var Page,
        //userId=pageConfig.pid,
        cid=URL.param.cid,
        dyid=URL.param.dyid,
        goalType=URL.param.goalType,
        firstLoad=true;
    function init(){

        render();

    }

    function render(){
        $('.waitting').hide();
        Page=$('<section class="page-content grid"><div class="con_head"></div><div class="content"></div><div class="comment"><ul></ul></div></section><div class="large animated fadeInDown" id="large_container" style="display:none"><img id="large_img"> </div>').appendTo('body');

        //showpicList();
        conHead();

        if ($('.comment').offset().top < $(window).height()*1.5 && firstLoad) {
            firstLoad = false;
        }

        //articleCon();
    }


    //图片显示
    //function showpicList(){
    //    var template='<ul class="row"><li class="col col-25"><img src="http://unesmall.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20160517/vNTT-0-1463450642438.png"></li><li class="col col-25"><img src="http://unesmall.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20160517/vNTT-0-1463450642438.png"></li><li class="col col-25"><img src="http://unesmall.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20160517/vNTT-0-1463450642438.png"></li><li class="col col-25"><img src="http://unesmall.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20160517/vNTT-0-1463450642438.png"></li><li class="col col-25"><img src="http://unesmall.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20160517/vNTT-0-1463450642438.png"></li><li class="col col-25"><img src="http://unesmall.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20160517/vNTT-0-1463450642438.png"></li></ul>';
    //    //var html=[];
    //    //$.each(list, function (index, item) {
    //    //    html.push(bainx.tpl(template,item));
    //    //})
    //    $('.content_pic').append(template);
    //}

    //头部图
    function conHead(){
        var data={
            cid:cid,
            dyid:dyid,
            goalType:goalType
        }

        Data.seeOneSnsContentDetail(data).done(function(res) {//查看详情

            //comment();

            var template = '<img src="{{contentSurfacePicUrl}}"/><!--<div class="head_nva row"><div class="col col-5"><i href="javascript:history.go(-1);" class="nav_back"></i></div><div class="col col-20 row far"><i class="clicks" data-clicks="{{praiseFlag}}"></i><i class="share"></i></div></div>-->';
            var content = res.content,
                dynamic = res.dynamic,
                profile = res.profile,
                html = [];

            if (res) {
                content.praiseFlag = res.praiseFlag;//是否点赞
                html.push(bainx.tpl(template, content));
                $('.con_head').append(html.join(''));

                if (content.praiseFlag == 1) {
                    $('.clicks').attr('id', 'clicksed');
                }

                html = [];
                var template1 = '<div class="con_people row fvc"><div class="portrait"><img src="{{profilePic}}"></div><p>{{nickname}}</p></div><div class="art_msg row"><div class="col row fvc time_box"><i class="time"></i>{{dateCreated}}</div><div class="col row fvc browse_box far"><i class="browse"></i>{{timesOfBrowsed}}<i class="clicks"></i>{{timesOfPraised}}<i class="share"></i>{{timesOfReferenced}}<i class="comment"></i>{{timesOfCommented}}<i class="collect"></i>{{timesOfCollected}}</div></div><div class="art_text">{{content}}</div>';

                content.dateCreated = bainx.formatDate('Y-m-d h:i', new Date(content.dateCreated));
                content.timesOfBrowsed = dynamic.timesOfBrowsed;

                content.timesOfPraised = dynamic.timesOfPraised;
                content.timesOfReferenced = dynamic.timesOfReferenced;
                content.timesOfCommented = dynamic.timesOfCommented;
                content.timesOfCollected = dynamic.timesOfCollected;

                content.nickname = profile.nickname;
                content.profilePic = profile.profilePic;
                html.push(bainx.tpl(template1, content));
                $('.content').append(html.join(''));

                conHandle();
            }

        })

    }



    //content里面内容的处理
    function conHandle(){
        var v_imgf=$('.art_text img.edui-faked-video');
        var v_imgup=$('.art_text img.edui-upload-video');
        v_imgf.each(function(index){
            var url=$(this).attr('_url');
            var html='<video class="edui-upload-video  vjs-default-skin video-js" controls="" preload="none" width="420" height="280" src="'+url+'" data-setup="{}"></video>';
            $(this).before(html);
            $(this).remove();

        })
        v_imgup.each(function(index){
            var url=$(this).attr('_url');
            var html='<video class="edui-upload-video  vjs-default-skin video-js" controls="" preload="none" width="420" height="280" src="'+url+'" data-setup="{}"></video>';
            $(this).before(html);
            $(this).remove();

        })


        var video=$('.art_text video');
        video.each(function(){
            $(this).attr('width','100%');
            $(this).attr('height','auto');
        })
    }

    init();
})