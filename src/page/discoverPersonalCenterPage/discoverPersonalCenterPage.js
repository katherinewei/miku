/**
 * Created by Spades-k on 2016/6/23.
 */
require([
    'jquery',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/url',
    'h5/js/common/loadImage',
    'h5/js/common/nexter',
    'h5/js/common/transDialog',
    'h5/js/common/lazyload',
    'plugin/viewer/0.4.0/viewer',
    'plugin/viewer/0.4.0/viewer.css'
], function ($, Data, Common, URL,LoadImage, Nexter,Dialog,Lazyload,Viewer) {
    var Page,
        userId = URL.param.userId ? URL.param.userId : pageConfig.pid,
        dialog,
        url=window.location.host,
        firstLoad=true;

    function init(){
        render();
    }

    function render(){
        $('.waitting').hide();
        Page=$('<section class="page-content grid"><div class="personal_head"></div><div class="article"><ul class="article_list grid"></ul><ul class="circle_list hide"></ul></div></section><div id="noteGet" class="hide"></div>').appendTo('body');

        bindEvents();

        personalHead();
        if ($('.article').offset().top < $(window).height()*1.5 && firstLoad) {
            articleBox();
            myCircle();
            firstLoad = false;
        }
        //if ($('.circle_list').offset().top < $(window).height()*1.5 && firstLoad) {
        //    myCircle();
        //    firstLoad = false;
        //}

    }


    function bindEvents(){
        var saveClass='';
        $('body').on('tap','.f_f_reprint_l',function(){
            forwardPopup();
            saveClass=$(this);
            var cid=$(this).attr('data-cid'),
                dyid=$(this).attr('data-dyid'),
                note=$(this).children('.noteHide').html(),
                nickname=$(this).attr('data-nickname'),
                profileid=$(this).attr('data-profileid');

            $('#reprintBtn').attr({'data-cid':cid,'data-dyid':dyid});
            $('#reprintCon textarea').attr('placeholder','//@'+nickname);
            $('#reprintCon textarea').attr('data-nickname','//@'+nickname);
            $('#noteGet').empty().append('//<'+'a href="'+URL.discoverPersonalCenterPage+'?userId='+profileid+'"'+'>'+'@'+nickname+'</a>'+':'+note);
        }).on('tap','#reprintBtn',function(){
            var cid=$(this).attr('data-cid'),
                dyid=$(this).attr('data-dyid'),
                newWord=$('#reprintCon textarea').val(),
                content=newWord+$('#noteGet').html(),
                data={
                    cid:cid,
                    dyid:dyid,
                    userId:userId,
                    userName:-1,
                    content:content,
                    contentType:2,
                    goalType:2,
                    actionType:2,
                    actionPostionType:1,
                    topFlag:0
                };
            Data.addOneContentRerfence(data).done(function(res){
                if(res.flag==1){
                    var num=saveClass.find('span').text();
                    saveClass.find('span').text(parseInt(num)+1);
                    $('#forwardPopup').hide();
                    bainx.broadcast('转载成功！');

                }else{
                    bainx.broadcast('转载失败！');
                }
            })
        }).on('tap','.me_dynamic',function(){
            $('.article_list').show();
            $('.circle_list').hide();
        }).on('tap','.me_circle',function(){
            $('.article_list').hide();
            $('.circle_list').show();
        })
    }

    function personalHead(){
        var html,
            template,
            data;
        data={
            userId:userId
        }

        Data.createOneContent(data).done(function(res) {
            template='<div class="personal_box row fvc"><div class="personal_msg col row fvc"><div class="portrait"><img src="{{profilePic}}"/></div><p class="f16">{{nickname}}</p></div><div class="personal_amsg col fvc"><ul class="row"><li class="col tc" href="'+URL.focusListPage+'"><p>关注</p><p>{{gzsize}}</p></li><li class="col tc" href="'+URL.fansListPage+'"><p>粉丝</p><p>{{fssize}}</p></li><li class="col tc" href="'+URL.collectionArticleListPage+'"><p>收藏</p><p>{{collectsize}}</p></li></ul></div></div><div class="switch_box row"><div class="me_dynamic f16 col tc">我的动态</div><div class="me_circle f16 col tc">我的圈子</div></div>';
            res.profilePic=res.profile.profilePic;
            res.nickname=res.profile.nickname;
            $('.personal_head').append(bainx.tpl(template,res));
        })


    }


    //文章列表
    function articleBox(){
        userId ? userId : userId=-1;
        var data={
            userId:userId
        }
        var element = $('.page-content'),
            nexter = new Nexter({
                element: element,
                dataSource: Data.personalContentPageNext,
                enableScrollLoad: true,
                scrollBodyContent: $('.article ul'),
                data:data,
            }).load().on('load:success', function (res)
            {
                console.log(res)
                if ($.isArray(res.list) && res.list.length) {
                    var html =[],
                        template2,
                        template = '<li><div class="list_head row"><div class="col col-15 row fvc"><div class="head_pic"><img src="{{profilePic}}"></div><div class="head_title"><h4>{{nickname}}<!--<span class="f_c ml15">转发了</span>--></h4><p>{{dateCreated}}</p></div></div><!--<div class="col col-10 row head_follow far"><div class="follow_btn" data-goalUserId="{{goalUserId}}">+关注</div></div>--></div><div class="reprintRemarks"></div>{{note}}<div class="content" href="http://'+url+'/api/h/1.0/articleInfoPage.htm?cid={{cid}}&dyid={{dyid}}&goalType={{goalType}}&userName={{userName}}&praiseFlag={{praiseFlag}}"><!--<div class="forward_word"><span class="f16 f_c_r">@王小丫</span><span class="f16">是我转发 ！</span></div>--><div class="content_pic"><img src="{{contentSurfacePicUrl}}"></div><div class="content_con"><h4>{{contentTitle}}</h4><p>{{contentAbstract}}</p></div></div><div class="footer row"><div class="col far row"><div class="f_browse"><i></i><span>{{timesOfBrowsed}}</span></div><div class="f_clikes" data-clicks="{{praiseFlag}}" data-dyid="{{dyid}}"><i class="{{clicksed}}"></i><span>{{timesOfPraised}}</span></div><div class="f_likes" data-likes="{{collectFlag}}" data-id="{{id}}" data-dyid="{{dyid}}" data-cid="{{cid}}"><i class="{{likesed}}"></i><span>{{timesOfCollected}}</span></div><div class="f_comment" data-cid="{{cid}}" data-dyid="{{dyid}}" data-goalType="{{goalType}}" data-userName="{{userName}}" data-praiseFlag="{{praiseFlag}}"><i></i><span>{{timesOfCommented}}</span></div><div class="f_reprint" id="f_reprint" data-contenThumbPicUrl="{{contenThumbPicUrl}}" data-contentAbstract="{{contentAbstract}}" data-cid="{{cid}}" data-dyid="{{dyid}}" data-goalType="{{goalType}}"><i></i><span></span></div><div class="f_f_reprint_l" data-profileid="{{profileid}}" data-cid="{{cid}}" data-dyid="{{dyid}}" data-nickname="{{nickname}}"><i>转载</i><span>{{timesOfReferenced}}</span><div class="noteHide hide">{{note}}</div></div></div></div></li>';

                    template2='<li><div class="list_head row"><div class="col col-15 row fvc"><div class="head_pic"><img src="{{profilePic}}"></div><div class="head_title"><h4>{{nickname}}<!--<span class="f_c ml15">转发了</span>--></h4><p>{{dateCreated}}</p></div></div><!--<div class="col col-10 row head_follow far"><div class="follow_btn" data-goalUserId="{{goalUserId}}">+关注</div></div>--></div><div class="reprintRemarks">{{note}}</div><div class="content"><!--<div class="forward_word"><span class="f16 f_c_r">@王小丫</span><span class="f16">是我转发 ！</span></div>--><div class="content_p_con" href="http://'+url+'/api/h/1.0/articleInfoPage.htm?cid={{cid}}&dyid={{dyid}}&goalType={{goalType}}&userName={{userName}}&praiseFlag={{praiseFlag}}"><p>{{content}}</p></div><div class="content_p_pic">{{picUrls}}</div></div><div class="footer row"><div class="col far row"><div class="f_browse"><i></i><span>{{timesOfBrowsed}}</span></div><div class="f_clikes" data-clicks="{{praiseFlag}}" data-dyid="{{dyid}}"><i class="{{clicksed}}"></i><span>{{timesOfPraised}}</span></div><div class="f_likes" data-likes="{{collectFlag}}" data-id="{{id}}" data-dyid="{{dyid}}" data-cid="{{cid}}"><i class="{{likesed}}"></i><span>{{timesOfCollected}}</span></div><div class="f_comment" data-cid="{{cid}}" data-dyid="{{dyid}}" data-goalType="{{goalType}}" data-userName="{{userName}}" data-praiseFlag="{{praiseFlag}}"><i></i><span>{{timesOfCommented}}</span></div><div class="f_reprint" id="f_reprint" data-contenThumbPicUrl="{{contenThumbPicUrl}}" data-contentAbstract="{{contentAbstract}}" data-cid="{{cid}}" data-dyid="{{dyid}}" data-goalType="{{goalType}}"><i></i><span></span></div><div class="f_f_reprint_l" data-cid="{{cid}}" data-profileid="{{profileid}}" data-dyid="{{dyid}}" data-nickname="{{nickname}}"><i>转载</i><span>{{timesOfReferenced}}</span><div class="noteHide hide">{{note}}</div></div></div></div></li>';

                    $.each(res.list, function (index, item) {
                        var mikuMydynamic=item.mikuMydynamic,
                            mikuSnsContent=item.mikuSnsContent,
                            profile=item.profile;

                        item.likesed = item.collectFlag == 1 ? 'likesed' : '';
                        item.clicksed = item.praiseFlag == 1 ? 'clicksed' : '';

                        item.timesOfBrowsed=mikuMydynamic.timesOfBrowsed;
                        item.timesOfReferenced=mikuMydynamic.timesOfReferenced;
                        item.timesOfPraised=mikuMydynamic.timesOfPraised;
                        item.timesOfCommented=mikuMydynamic.timesOfCommented;
                        item.timesOfCollected=mikuMydynamic.timesOfCollected;
                        item.dyid=mikuMydynamic.id;
                        item.goalType=mikuMydynamic.goalType;
                        item.note=mikuMydynamic.note;

                        if(mikuSnsContent.contentAbstract){
                            mikuSnsContent.contentAbstract.length>=55 ? item.contentAbstract=mikuSnsContent.contentAbstract.substring(1,55)+'...' : item.contentAbstract=mikuSnsContent.contentAbstract;
                        }
                        if(mikuSnsContent.contentTitle){
                            item.contentTitle=mikuSnsContent.contentTitle;
                        }

                        item.content=mikuSnsContent.content;
                        item.userName=mikuSnsContent.userName;
                        item.cid=mikuSnsContent.id;
                        item.contenThumbPicUrl=mikuSnsContent.contenThumbPicUrl;

                        item.dateCreated=bainx.formatDate('Y-m-d h:i', new Date(mikuMydynamic.dateCreated));
                        item.contentSurfacePicUrl=mikuSnsContent.contentSurfacePicUrl;

                        item.goalUserId=profile.id;
                        item.nickname=profile.nickname;
                        item.profilePic=profile.profilePic;
                        item.profileid=profile.id;

                        if(mikuSnsContent.picUrls){
                            var picUrls=mikuSnsContent.picUrls.split(';');
                            if(picUrls.length>1){
                                var tmp=[],
                                    kz=0;
                                $.each(picUrls, function (k, v) {
                                    if(k%3==0) {
                                        tmp.push('<div class="row fvc pic_all">');
                                    }
                                    tmp.push('<div class="col pic_one"><img data-original="'+v+'" src="'+v+'"></div>');
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
                                item.picUrls='<div class="row fvc pic_all"><div class="pic_one"><img data-original="'+mikuSnsContent.picUrls+'" src="'+mikuSnsContent.picUrls+'"></div></div>';
                            }
                        }

                        if(mikuSnsContent.contentCreateType==2){
                            html.push(bainx.tpl(template2,item));
                        }else{
                            html.push(bainx.tpl(template,item));
                        }


                    });

                    $('.article_list').append(html.join(''));

                    $('.pic_all').each(function(i){
                        var viewer = new Viewer($('.pic_all')[i], {
                            url: 'data-original',
                        });
                    })

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

    //我的圈子
    function myCircle(){
        var data={
            userId:userId
        }
        var element = $('.page-content'),
            nexter = new Nexter({
                element: element,
                dataSource: Data.selectMyRelationCircle,
                enableScrollLoad: true,
                scrollBodyContent: $('.article ul'),
                data:data,
            }).load().on('load:success', function (res)
            {
                if ($.isArray(res.list) && res.list.length) {
                    var html =[],
                        template = '<li><div class="row"><div class="circlebox col row fvc"><div class="pic"><img src="http://wx.qlogo.cn/mmopen/FicMF6EiaFYTyYUSv6R1Pkbs8yNkAOSeGaXF4HNibibK0gYNTzXKeC6dqCibv8x0v9ulpdfb3QQBma1KXQKULT6y5iaW2leSxIGMG9/0"></div><div class="title"><p>{{circleName}}</p><p>{{circleDisc}}</p></div></div><div class="follow row fvc" data-circleId="{{id}}"><i>关注</i></div></div></li>';

                    $.each(res.list, function (index, item) {
                        var mikuSnsCircleDo=item.mikuSnsCircleDo;
                        item.circleName=mikuSnsCircleDo.circleName;
                        item.circleDisc=mikuSnsCircleDo.circleDisc;
                        item.id=mikuSnsCircleDo.id;
                        html.push(bainx.tpl(template,item));
                    });
                    $('.article .circle_list').append(html.join(''));
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

    //转载弹窗
    function forwardPopup(){
        if (!dialog) {

            dialog = new Dialog($.extend({}, {
                template: '<div id="forwardPopup"><section class="header"><div class="content navbar"><div class="btn-navbar navbar-left">取消</div></div></section><section class="con"><div class="con_box" id="reprintCon"><ul><li><textarea data-nickname="" rows="3" placeholder="说说转载心得..." style="width: 100%;resize: vertical;"></textarea></li></ul><div class="save" id="reprintBtn" data-cid="" data-dyid=""><span>转载</span></div></div></section></div> ',
                events: {
                    'tap .navbar-left': function (event) {
                        event.preventDefault();
                        dialog.hide();
                    }
                }
            }))

        }
        dialog.show();

    }

    init();
})