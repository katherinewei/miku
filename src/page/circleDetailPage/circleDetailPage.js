/**
 * Created by Spades-k on 2016/7/4.
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
], function ($, Data, Common, URL,LoadImage, Nexter) {
    var Page,
        userId=pageConfig.pid,
        circleId=URL.param.circleId;
    function init(){
        render();
    }

    function render(){
        $('.waitting').hide();
        Page=$('<section class="page-content grid"><div class="circle_information"></div><div class="circle_list"><ul></ul></div></section>').appendTo('body');

        circleInformation();

        bindEvents();
    }

    function bindEvents(){

    }

    function circleInformation(){
        var data={
            userId:userId,
            circleId:circleId
        }
        //Data.selectOneCircleIndexPage(data).done(function(res) {
        //    var template='<div class="head_top row"><div class="portrait"><img src="http://wx.qlogo.cn/mmopen/FicMF6EiaFYTyYUSv6R1Pkbs8yNkAOSeGaXF4HNibibK0gYNTzXKeC6dqCibv8x0v9ulpdfb3QQBma1KXQKULT6y5iaW2leSxIGMG9/0"></div><div class="msg"><p class="title">#{{circleName}}#</p><p><span>阅读{{readNum}}</span><span>评论{{commentNum}}</span></p><p>创建者：{{autorName}}</p></div></div><div class="describe"><p>{{circleDisc}}</p></div>';
        //
        //    var res=res.circle,
        //        mikuSnsCircleDo=res.mikuSnsCircleDo;
        //
        //        res.circleName=mikuSnsCircleDo.circleName;
        //        res.circleDisc=mikuSnsCircleDo.circleDisc;
        //
        //    $('.circle_information').append(bainx.tpl(template,res));
        //
        //
        //
        //})


        var element = $('.page-content'),
            nexter = new Nexter({
                element: element,
                dataSource: Data.selectOneCircleIndexPage,
                enableScrollLoad: true,
                scrollBodyContent: $('.circle_list ul'),
                data:data,
            }).load().on('load:success', function (res)
            {
                if ($.isArray(res.list) && res.list.length) {

                        var html =[],
                        template = '<li><div class="list_head row"><div class="col col-15 row fvc"><div class="head_pic"><img src="{{profilePic}}"></div><div class="head_title"><h4>{{nickname}}</h4><p>{{dateCreated}}</p></div></div><div class="col col-10 row head_follow far"><div class="follow_btn" data-goalUserId="{{goalUserId}}">+关注</div></div></div><div class="content" href="'+URL.articleInfoPage+'?cid={{cid}}&dyid={{dyid}}&goalType={{goalType}}&userName={{userName}}&praiseFlag={{praiseFlag}}"><div class="content_pic"><img src="{{contentSurfacePicUrl}}"></div><div class="content_con"><h4>{{contentTitle}}</h4><p>{{contentAbstract}}</p></div></div><div class="footer row"><div class="col far row"><div class="f_browse"><i></i><span>{{timesOfBrowsed}}</span></div><div class="f_clikes" data-clicks="{{praiseFlag}}" data-dyid="{{dyid}}"><i class="{{clicksed}}"></i><span>{{timesOfPraised}}</span></div><div class="f_likes" data-likes="{{collectFlag}}" data-id="{{id}}" data-dyid="{{dyid}}" data-cid="{{cid}}"><i class="{{likesed}}"></i><span>{{timesOfCollected}}</span></div><div class="f_comment" data-cid="{{cid}}" data-dyid="{{dyid}}" data-goalType="{{goalType}}" data-userName="{{userName}}" data-praiseFlag="{{praiseFlag}}"><i></i><span>{{timesOfCommented}}</span></div><div class="f_reprint" id="f_reprint" data-contenThumbPicUrl="{{contenThumbPicUrl}}" data-contentAbstract="{{contentAbstract}}" data-cid="{{cid}}" data-dyid="{{dyid}}" data-goalType="{{goalType}}"><i></i><span></span></div><div class="f_f_reprint_l" data-cid="{{cid}}" data-dyid="{{dyid}}"><i>转载</i><span>{{timesOfReferenced}}</span></div></div></div></li>',

                        template2='<li><div class="list_head row"><div class="col col-15 row fvc"><div class="head_pic"><img src="{{profilePic}}"></div><div class="head_title"><h4>{{nickname}}<!--<span class="f_c ml15">转发了</span>--></h4><p>{{dateCreated}}</p></div></div><div class="col col-10 row head_follow far"><div class="follow_btn" data-goalUserId="{{goalUserId}}">+关注</div></div></div><div class="content" href="'+URL.articleInfoPage+'?cid={{cid}}&dyid={{dyid}}&goalType={{goalType}}&userName={{userName}}&praiseFlag={{praiseFlag}}"><!--<div class="forward_word"><span class="f16 f_c_r">@王小丫</span><span class="f16">是我转发 ！</span></div>--><div class="content_p_con"><p>{{content}}</p></div><div class="content_p_pic">{{picUrls}}</div></div><div class="footer row"><div class="col far row"><div class="f_browse"><i></i><span>{{timesOfBrowsed}}</span></div><div class="f_clikes" data-clicks="{{praiseFlag}}" data-dyid="{{dyid}}"><i class="{{clicksed}}"></i><span>{{timesOfPraised}}</span></div><div class="f_likes" data-likes="{{collectFlag}}" data-id="{{id}}" data-dyid="{{dyid}}" data-cid="{{cid}}"><i class="{{likesed}}"></i><span>{{timesOfCollected}}</span></div><div class="f_comment" data-cid="{{cid}}" data-dyid="{{dyid}}" data-goalType="{{goalType}}" data-userName="{{userName}}" data-praiseFlag="{{praiseFlag}}"><i></i><span>{{timesOfCommented}}</span></div><div class="f_reprint" id="f_reprint" data-contenThumbPicUrl="{{contenThumbPicUrl}}" data-contentAbstract="{{contentAbstract}}" data-cid="{{cid}}" data-dyid="{{dyid}}" data-goalType="{{goalType}}"><i></i><span></span></div><div class="f_f_reprint_l" data-cid="{{cid}}" data-dyid="{{dyid}}"><i>转载</i><span>{{timesOfReferenced}}</span></div></div></div></li>',

                        template3='<div class="head_top row"><div class="portrait"><img src="http://wx.qlogo.cn/mmopen/FicMF6EiaFYTyYUSv6R1Pkbs8yNkAOSeGaXF4HNibibK0gYNTzXKeC6dqCibv8x0v9ulpdfb3QQBma1KXQKULT6y5iaW2leSxIGMG9/0"></div><div class="msg"><p class="title">#{{circleName}}#</p><p><span>阅读{{readNum}}</span><span>评论{{commentNum}}</span></p><p>创建者：{{autorName}}</p></div></div><div class="describe"><p>{{circleDisc}}</p></div>';

                    var circle=res.circle,
                        mikuSnsCircleDo=res.circle.mikuSnsCircleDo;
                    arry=[];
                    arry.circleName=mikuSnsCircleDo.circleName;
                    arry.circleDisc=mikuSnsCircleDo.circleDisc;
                    arry.readNum=circle.readNum;
                    arry.commentNum=circle.commentNum;
                    arry.autorName=circle.autorName;
                    $('.circle_information').append(bainx.tpl(template3,arry));

                    $.each(res.list, function (index, item) {
                        var mikuMydynamic=item.mikuMydynamic;
                        var mikuSnsContent=item.mikuSnsContent;
                        var profile=item.profile;
                        item.likesed = item.collectFlag == 1 ? 'likesed' : '';
                        item.clicksed = item.praiseFlag == 1 ? 'clicksed' : '';

                        item.timesOfBrowsed=mikuMydynamic.timesOfBrowsed;
                        item.timesOfReferenced=mikuMydynamic.timesOfReferenced;
                        item.timesOfPraised=mikuMydynamic.timesOfPraised;
                        item.timesOfCommented=mikuMydynamic.timesOfCommented;
                        item.timesOfCollected=mikuMydynamic.timesOfCollected;
                        item.dyid=mikuMydynamic.id;
                        item.goalType=mikuMydynamic.goalType;

                        item.contentTitle=mikuSnsContent.contentTitle;
                        item.content=mikuSnsContent.content;
                        if(mikuSnsContent.contentAbstract){
                            mikuSnsContent.contentAbstract.length>=55 ? item.contentAbstract=mikuSnsContent.contentAbstract.substring(1,55)+'...' : item.contentAbstract=mikuSnsContent.contentAbstract;
                        }
                        item.userName=mikuSnsContent.userName;
                        item.cid=mikuSnsContent.id;
                        item.contenThumbPicUrl=mikuSnsContent.contenThumbPicUrl;

                        item.dateCreated=bainx.formatDate('Y-m-d h:i', new Date(mikuSnsContent.dateCreated));
                        item.contentSurfacePicUrl=mikuSnsContent.contentSurfacePicUrl;

                        item.goalUserId=profile.id;
                        item.nickname=profile.nickname;
                        item.profilePic=profile.profilePic;

                        if(mikuSnsContent.picUrls){
                            var picUrls=mikuSnsContent.picUrls.split(';');
                            if(picUrls.length>1){
                                var tmp=[],
                                    kz=0;
                                $.each(picUrls, function (k, v) {
                                    if(k%3==0) {
                                        tmp.push('<div class="row fvc pic_all">');
                                    }
                                    tmp.push('<div class="col pic_one"><span style="background-image: url('+v+')"></span></div>');
                                    if(k%3==2){
                                        tmp.push('</div>');
                                    }
                                    kz = k;
                                })
                                if(kz>2){
                                    if(kz%3 == 0){
                                        tmp.push('<div class="col"></div><div class="col"></div></div>');
                                    }
                                    if(kz%3 == 1){
                                        tmp.push('<div class="col"></div></div>');
                                    }
                                }else{
                                    if(kz%3==0 || kz%3==1){
                                        tmp.push('</div>');
                                    }
                                }

                                item.picUrls=tmp.join('');
                            }else{
                                item.picUrls='<div class="pic_one"><span style="background-image: url('+mikuSnsContent.picUrls+')"></span></div>';
                            }
                        }

                        if(mikuSnsContent.contentCreateType==2){
                            html.push(bainx.tpl(template2,item));
                        }else{
                            html.push(bainx.tpl(template,item));
                        }

                    });
                    $('.circle_list ul').append(html.join(''));
                    LoadImage(element);

                }
                var sid,
                    scrollEventHandle = function(event) {
                        event.preventDefault();
                        clearTimeout(sid);
                        sid = setTimeout(function() {
                            LoadImage(element);
                        }, 0);
                    }
                element.on('scroll', scrollEventHandle);
            })

    }

    init();
})