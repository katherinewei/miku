/**
 * 发现文章详情
 * Created by Spades-k on 2016/6/1.
 */
require([
    'jquery',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/url',
    'h5/js/common/nexter',
    'plugin/pinchzoom/0.0.2/pinchzoom',
    'h5/js/common/weixin',
    'h5/js/page/commentEntrance',
    'h5/js/page/shareCommon',
    'h5/css/page/discoverPage.css',
    'h5/css/page/anonymousChatPage.css',
], function ($, Data, Common, URL, Nexter,Pinchzoom,WeiXin,commentEntrance,shareCommon) {
    var Page,
        userId=pageConfig.pid,
        cid='',
        dyid=URL.param.dyid,
        goalType='',
        userName='',
        dataindex=URL.param.indexNum,
        isH5=URL.param.type,
        iNum=URL.param.iNum,//匿名列表的文章序号0开始
        isrecord=URL.param.isrecord,//是否在专家履历跳过来
        firstLoad=true,
        ifcomment=false,
        iflikes=false,
        iffollow=false,
        ifclicks=false,
        isblur=true;
    function init(){
        if(userId){
            getMineInfo();
        }
        render();
        //评论
        var tem='<div class="nivo row" style="display: none;"><div class="col col-6 nivo_title">全部评论</div></div>';
        $('.nav_box').append(tem);

        if(dataindex && sessionStorage.getItem("res")!=null){
            //修改缓存浏览数
            var num=parseInt(dataindex)- 1,
            result=JSON.parse(sessionStorage.getItem("res"));
            result.list[num].mikuMydynamic.timesOfBrowsed=result.list[num].mikuMydynamic.timesOfBrowsed+1;
            result=JSON.stringify(result);
            sessionStorage.setItem("res",result);
        }

        browserRedirect();
        function browserRedirect() {
            var sUserAgent = navigator.userAgent.toLowerCase();
            var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
            var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
            var bIsMidp = sUserAgent.match(/midp/i) == "midp";
            var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
            var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
            var bIsAndroid = sUserAgent.match(/android/i) == "android";
            var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
            var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";

            if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM){
                localStorage.setItem('agentFlag','true');
            }else{
                localStorage.setItem('agentFlag','false');
            }
        }
        if(isH5==1){
            var rHtml='<div class="forward"><i  data-url="'+URL.location+'"></i></div>';
            Common.headerHtml('文章详情',rHtml);
            $('.page-content').css('padding-top','45px');
            $('.navbar-main').css({'background-color':'#42454C','color':'white'});
            $('.header').css('border-bottom','1px solid #42454C');
        }
    }

    function render(){
        $('.waitting').hide();
        Page=$('<section class="page-content grid"><!--<div class="con_head"></div>--><div class="content grid"></div><div class="nav_box"></div><div class="comment"><ul></ul></div><p id="datahide" data-contenThumbPicUrl="" data-contentAbstract="" style="display:none;"></p></section><div class="large animated fadeInDown" id="large_container" style="display:none"><img id="large_img"> </div>').appendTo('body');

        var commentHtml = '<footer id="footerF" class="grid"><div class="f_box row fvc"><div class="msg_in col col-20"><p>说点什么吧～</p></div><div class="msg_btn col col-4"><p class="send">评论</p></div></div></footer>';
        $('body').append(commentHtml);

        conHead();
        if ($('.comment').offset().top < $(window).height()*1.5 && firstLoad) {
            firstLoad = false;
        }

        //评论入口
        commentEntrance();

        //
        shareCommon.defineShareModel();
        shareCommon.shareFn();
    }


    //头部图
    function conHead(){
        userId ? userId : userId=-1;
        var data={
            cid:cid,
            dyid:dyid,
            goalType:goalType,
            userId:userId
        }
        Data.seeOneSnsContentDetail(data).done(function(res) {//查看详情
                var content = res.content,
                dynamic = res.dynamic,
                profile = res.profile,
                scuserlist=res.scuserlist,
                //html = [],
                html1 = [],
                imgPic=URL.imgPath+'common/images/avatar-small.png';
            if (res) {
                cid=dynamic.goalId;
                goalType=dynamic.goalType;

                //设置分享参数
                $('.forward i').attr('data-img',content.contentSurfacePicUrl);
                $('.forward i').attr('data-art',content.contentAbstract);
                $('.forward i').attr('data-title',content.contentTitle);
                $('.forward i').attr('data-url',window.location.href);

                var template1 = '<div class="artHeader"><h2>{{contentTitle}}</h2><p>{{nickname}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="dataTime">{{dateCreated}}</span></p></div><div class="art_text">{{content}}</div><div class="likeAfollow row"><div class="likes col row fac fvc"><div class="likesBtn {{isPrais}}" data-praiseflag="{{praiseFlag}}" data-dyid="{{dyid}}"><i></i><span>棒棒哒~</span></div></div><div class="follow col row fac fvc"><div class="followBtn {{active}}" data-goalUserId="{{goalUserId}}" data-follow="{{attentionType}}"><span>{{isfollow}}</span></div></div></div><input type="hidden" id="data_shareandcollectn" data-contenThumbPicUrl="{{contenThumbPicUrl}}" data-contentShortTitle="{{contentShortTitle}}" data-contentAbstract="{{contentAbstract}}" data-cid="{{id}}" data-dyid="{{dyid}}" data-goalType="{{goalType}}" data-attentionType="{{attentionType}}" data-collectFlag="{{collectFlag}}">';

                content.dateCreated = bainx.formatDate('Y-m-d', new Date(content.dateCreated));
                content.dyid=dynamic.id;
                content.goalType=dynamic.goalType;
                content.attentionType=res.attentionType;
                content.collectFlag=res.collectFlag;
                content.praiseFlag=res.praiseFlag;
                //content.timesOfCollected=dynamic.timesOfCollected;
                content.nickname = profile.nickname;
                content.goalUserId=content.userId;
                //content.timesOfCommented=dynamic.timesOfCommented;
                //content.timesOfReferenced=dynamic.timesOfReferenced;//转发
                //content.timesOfPraised=dynamic.timesOfPraised;

                if(res.attentionType==1){
                    content.isfollow='已关注作者';
                    content.active='active';
                }else{
                    content.isfollow='+关注作者';
                    content.active='';
                }
                if(res.praiseFlag==1){
                    content.isPrais='active';
                }else {
                    content.isPrais='';
                }

                profile.id==userId ? content.showorhide='display:none' : content.showorhide='';
                profile.profilePic ? content.profilePic = profile.profilePic : content.profilePic = ''+URL.imgPath+'common/images/avatar-small.png';

                var html=[];
                $.each(scuserlist,function(index,item){
                    var profilePic;
                    item.profilePic ? profilePic=item.profilePic : profilePic=imgPic;
                    html.push('<div class="pic" data-id="'+item.id+'"><img src="'+profilePic+'" /></div>');
                    content.praisehtml=html.join('');
                })
                html1.push(bainx.tpl(template1, content));
                $('.page-content .content').append(html1.join(''));
                if (content.collectFlag == 1) {
                    $('.collect_i').attr('id','showlikesed');
                    $('.collect_btn img').attr('src',imgPic);
                    $('.textchang').text('人收藏');
                }
                $('.collect_btn img').attr('data-likes',content.collectFlag);
                $('.click_i').attr('data-clicks',content.praiseFlag);
                $('#datahide').attr({'data-contenThumbPicUrl':content.contenThumbPicUrl,'data-contentAbstract':content.contentAbstract,'data-contentShortTitle':content.contentShortTitle});
                $('.nivo').show();
                conHandle();
                comment();
                //weiXinShare(shareImgUrl,desc,title);
            }
        })
    }

    //评论
    function comment(){
        var data={
            goalId:dyid
        }
        var element = $('.page-content');
        var nexter = new Nexter({
            element: element,
            dataSource: Data.selectSnsComentIndexPage,
            enableScrollLoad: true,
            scrollBodyContent: $('.comment ul'),
            data: data,
        }).load().on('load:success', function(res) {
            var template='<li class="grid box" data-userId="{{userId}}" data-name="{{nickname}}" data-targetCommentId="{{targetCommentId}}"><div class="row"><div class="portrait"><img src="{{profilePic}}"/></div><div class="comment_box col col-16"><h4>{{nickname}}</h4><br/><p><span>{{targetName}}</span>{{content}}</p></div><div class="delect"><span id="delectComment" data-cid="{{targetCommentId}}">{{isDelete}}</span></div></div><div class="pic_list clearfix">{{picUrls}}</div><div class="comment_time row fvc far hide">{{dateCreated}}</div></li>',
                html=[];
            if ($.isArray(res.list) && res.list.length) {
                $.each(res.list, function (index, item) {
                    var mikuMineCommentsDo=item.mikuMineCommentsDo,
                        profile=item.profile;

                    item.targetCommentId=mikuMineCommentsDo.id;
                    item.content=icoSubstitution(mikuMineCommentsDo.content);
                    item.nickname=item.profile.nickname;
                    //item.dateCreated=bainx.formatDate('Y-m-d h:i', new Date(mikuMineCommentsDo.dateCreated));
                    item.userId=profile.id;

                    profile.profilePic ? item.profilePic=profile.profilePic : item.profilePic = ''+URL.imgPath+'common/images/avatar-small.png';
                    profile.id==userId ? item.isDelete='删除' : item.isDelete='';
                    if(item.flag==1){
                        item.targetName='回复 @'+item.targetName+'： ';
                    }
                    var picUrls=mikuMineCommentsDo.picUrls,
                        htmlpicUrls=[];
                    if(picUrls){
                        var picUrlsArry=picUrls.split(',');
                        for (var i=0;i<picUrlsArry.length;i++){
                            htmlpicUrls.push('<div class="img"><img src="'+picUrlsArry[i]+'" data-index="'+(i+1)+'"></div>');
                        }
                    }else{
                        htmlpicUrls.push('');
                    }
                    item.picUrls=htmlpicUrls.join('');
                    html.push(bainx.tpl(template,item));
                });
                $('.comment ul').append(html.join('')+'<li class="notData hide"><img src="'+URL.imgPath+'common/images/loading_fail.png"/><p>暂时没有评论哦</p></li>');
                viewLargeImg();
                if($('.pinch-zoom-container').length<1){
                    $('div#large_container').each(function () {
                        new Pinchzoom($(this), {});
                    });
                }
                $('.img').height($('.img img').width());
                isHavePic();
            }else if(this.get('pageIndex') == 0){
                var _html='<li class="notData"><img src="'+URL.imgPath+'common/images/loading_fail.png"/><p>暂时没有评论哦</p></li>';
                $('.comment ul').append(_html);
            }
        });
    }

    //获取用户信息
    function getMineInfo(){
        Data.mineInfo().done(function(res) {
            userName=res.nickName;
        })
    }

    var agentFlag=localStorage.getItem('agentFlag'),tap='';
    if(agentFlag=='true'){
        tap='tap';
    }else {
        tap='click';
    }
    bindEvent(tap);
    //事件绑定
    function bindEvent(tap){

        $('body')
            .on(tap,'.sendCo',function(){
                isblur=true;
                var commentData= $.trim($('#inputBoxIn').val()),
                    commentType= $(this).attr('data-commentType'),
                    targetCommentId=$(this).attr('data-targetCommentId'),
                    picUrls=[],
                    picUrlsList=$('.f_addpic').find('dd');
                $.each(picUrlsList,function(index,item){
                    picUrls.push($(item).find('img').attr('src'));
                })
                var data={
                        cid:cid,
                        dyid:dyid,
                        userId:userId,
                        userName:userName,
                        comment:commentData,
                        goalType:goalType,
                        commentType:commentType,
                        targetCommentId:targetCommentId,
                        picUrls:picUrls.join(",")
                    },
                    html=[],
                    commentList=[];
                if(!commentData){
                    bainx.broadcast('评论为空！');
                    return false;
                }
                if(ifcomment){
                    return false;
                }
                ifcomment=true;
                Data.addOneCommentByUsersay(data).done(function(res){
                    if(res.flag==1 || res.flag==2){
                        ifcomment=false;
                        bainx.broadcast('评论成功！');

                        $('.commentEntrance').css('height',0+'px');
                        $('.msg_in > p').text('说点什么吧~');
                        $('#inputBoxIn').val('');

                        //处理匿名我的文章收藏操作变化
                        if(iNum){
                            handleAnonymousChatNum(iNum,'comment',1);
                        }

                        if(dataindex){
                            //修改缓存
                            var num=parseInt(dataindex)- 1,
                                result=JSON.parse(sessionStorage.getItem("res"));
                            result.list[num].mikuMydynamic.timesOfCommented=result.list[num].mikuMydynamic.timesOfCommented+1;
                            result=JSON.stringify(result);
                            sessionStorage.setItem("res",result);
                        }

                        $('.f_addpic').find('dd').remove();
                        isHavepiv();

                        $('.sendCo').attr('data-commentType','1');
                        $('.sendCo').attr('data-targetCommentId','0');
                        var tpm='<li class="grid box" data-userId="{{userId}}" data-name="{{nickname}}" data-targetcommentid="{{targetcommentid}}"><div class="row"><div class="portrait"><img src="{{profilePic}}"/></div><div class="comment_box col col-16"><h4>{{nickname}}</h4><br/><p><span>{{targetName}}</span>{{content}}</p></div><div class="delect"><span id="delectComment" data-cid="{{id}}">{{isDelete}}</span></div></div><div class="pic_list clearfix"></div></li>';
                        commentList.userName=res.dynamic.userName;
                        commentList.content=icoSubstitution(res.comment.content);
                        commentList.id=res.comment.id;
                        commentList.nickname=res.profile.nickname;
                        commentList.userId=res.profile.id;
                        res.profile.profilePic ? commentList.profilePic=res.profile.profilePic : commentList.profilePic = ""+URL.imgPath+"common/images/avatar-small.png";
                        res.profile.id==userId ? commentList.isDelete='删除' : commentList.isDelete='';
                        commentList.targetName=res.targetName;
                        commentList.targetcommentid=res.comment.id;
                        if(commentList.targetName){
                            commentList.targetName='回复 @'+commentList.targetName+'： ';
                        }
                        html.push(bainx.tpl(tpm, commentList));
                        $('.page-content .comment ul li').length>=1 ? $('.page-content .comment ul li').eq(0).before(html.join('')) : $('.page-content .comment ul').append(html.join(''));
                        var htmltpm=[];
                        var pics=res.comment.picUrls;
                        if(pics){
                            var picsarr=pics.split(",");
                            console.log(picsarr)
                            for(var i=0;i<picsarr.length;i++){
                                htmltpm.push('<div class="img"><img src="'+picsarr[i]+'" data-index="'+(i+1)+'"></div>');
                            }
                        }else{
                            htmltpm.push('');
                        }
                        $('.page-content .comment ul li').eq(0).find('.pic_list').append(htmltpm.join(''));
                        viewLargeImg();
                        if($('.pinch-zoom-container').length<1){
                            $('div#large_container').each(function () {
                                new Pinchzoom($(this), {});
                            });
                        }
                        isHavePic();
                        $('.img').height($('.img img').width());
                        $('.notData').hide();
                        $('.msg_addpic').hide();
                        $('.collect_btn').show();

                        var obj={
                            flag:res.flag,
                            mikuMineCommentsDo:res.comment,
                            profile:res.profile
                        }
                        changComment(dataindex,obj,1,res.comment.id);

                    }else{
                        ifcomment=false;
                        bainx.broadcast('评论失败！');
                    }
                }).fail(function(){
                    ifcomment=false;
                })
            })
            .on('change', '.file', function (event) {
                $('.waitting').show();
                if(pageConfig.pid==''){
                    URL.assign('vLoginPage.htm');
                    return;
                }
                Common.uploadImages(event,'#my_form', URL.upYunUploadPics).done(function(res) {
                    $('.waitting').hide();
                    var addPic = $('.f_addpic');
                    var picUrls = res.result.picUrls,
                        imgListUrl = [];
                    picUrls = picUrls.split(';');
                    $.each(picUrls,function(index,item){
                        imgListUrl.push('<dd class="active"><img src="'+ item+'"  alt=""><span class="delete"></span></dd>');
                    })
                    imgListUrl = imgListUrl.join('');
                    addPic.append(imgListUrl);
                    isHavepiv();
                }).fail(function() {
                    bainx.broadcast('上传图片失败！');
                });
            })
            .on('click', 'input', function (event) {
                if (event && event.preventDefault) {
                    window.event.returnValue = true;
                }
            })
            .on(tap,'.delete',function(event){
                event.preventDefault();
                $(this).addClass('currentDelete').siblings().removeClass('currentDelete');
                var data = {
                    filePath:$(this).parent('dd').children('img').attr('src')
                }
                Data.upyunDeleteFile(data).done(function(res){
                    bainx.broadcast('删除成功！');
                    $('.currentDelete').parent('dd').remove();
                    isHavepiv();
                })
            })
            .on(tap,'.comment_box p,.comment_box h4,.portrait img',function(event){
                var me=$(this);
                setTimeout(function(){
                    event.stopPropagation();
                    var id=me.parent().parent().parent().attr('data-userId');
                    if(id==userId){
                        bainx.broadcast('不能评论自己喔！');
                        return;
                    }
                    $('#my_form').hide();
                    var name=me.parent().parent().parent().attr('data-name');
                    var targetCommentId=me.parent().parent().parent().attr('data-targetCommentId');
                    $('.sendCo').attr('data-commentType','2');
                    $('.sendCo').attr('data-targetCommentId',targetCommentId);
                    $('#inputBoxIn').attr('placeholder','回复 @'+name);
                    $('.msg_in > p').text('回复 @'+name);
                },320);
            })
            .on(tap,'.forward i',function(){
                var arr=[],
                    _this=$(this);
                arr[0]=_this.attr('data-url');
                arr[1]=_this.attr('data-title');
                arr[2]=_this.attr('data-art');
                arr[3]=_this.attr('data-img');
                sessionStorage.setItem('shareArr',JSON.stringify(arr));

                /*分享点击弹窗*/
                $('.screenW').show();
                $('.subW').addClass('move').removeClass('back');
                $('.shareBox').show().siblings().hide();
            })
            .on(tap,'#delectComment',function(e){//删除自己的评论
                e.stopPropagation();
                var cid=$(this).attr('data-cid'),
                    data={
                        cid:cid
                    }
                Data.deleteOnePraise(data).done(function(res){
                    if(res.flag){
                        bainx.broadcast('删除评论成功！');

                        //处理匿名我的文章收藏操作变化
                        if(iNum){
                            handleAnonymousChatNum(iNum,'comment',0);
                        }

                        if(dataindex){
                            //修改缓存
                            var num=parseInt(dataindex)- 1,
                                result=JSON.parse(sessionStorage.getItem("res"));
                            result.list[num].mikuMydynamic.timesOfCommented=result.list[num].mikuMydynamic.timesOfCommented-1;
                            result=JSON.stringify(result);
                            sessionStorage.setItem("res",result);
                        }

                        $('.comment').find('li[data-targetCommentId="'+cid+'"]').animate({opacity: 0.1},1000,'ease-out');
                        setTimeout(function(){
                            $('.comment').find('li[data-targetCommentId="'+cid+'"]').remove();
                        },1000);
                        if($('.comment li').length==2){
                            if($('.comment .notData')){
                                $('.comment .notData').show();
                            }else{
                                var _html='<li class="notData"><img src="'+URL.imgPath+'common/images/loading_fail.png"/><p>暂时没有评论哦</p></li>';
                                $('.comment ul').append(_html);
                            }
                        }

                        changComment(dataindex,'',0,res.cid);

                    }else{
                        bainx.broadcast('删除评论失败！');
                    }
                })
            })
            .on(tap,'#close',function(){
                $('.page-content').css('overflow-y','auto');
                $('body').removeClass('height_hidden');
                $('.pic_list').css({height:'auto','overflow':'auto'})
                $('.page-content').css({'z-index':'0'});
                $('#large_img').attr('src','');
                $('.pinch-zoom-container').hide();
                $('.pinch-zoom-container').remove();
                $('body').append('<div class="large animated fadeInDown" id="large_container" style="display:none"><img id="large_img"> </div>');
                viewLargeImg();
                $('div#large_container').each(function () {
                    new Pinchzoom($(this), {});
                });
                $('.waitting').hide();

                //
                $(window.parent.document).find('.poptools').show();
            })
            .on(tap,'.followBtn',function(){
                if(iffollow){
                    return false;
                }
                iffollow=true;
                var goalUserId=$(this).attr('data-goalUserId'),
                    datafollow=$(this).attr('data-follow'),
                    relationType= 1,
                    f_follow=$(this);
                if(datafollow==0){
                    userId ? userId : userId=-1;
                    var data={
                        userId:userId,
                        goalUserId:goalUserId,
                        relationType:relationType
                    }
                    Data.concernOneUserById(data).done(function(res){
                        if(res.flag==1){
                            bainx.broadcast('关注成功！');
                            $('.followBtn').attr('data-follow',1);
                            iffollow=false;
                            f_follow.find('span').text('已关注作者');
                            f_follow.addClass('active');

                            changOperator(1,goalUserId);

                        }else if(res.flag==0){
                            bainx.broadcast('关注失败！');
                            iffollow=false;
                        }
                    }).fail(function(){
                        iffollow=false;
                    })
                }else if(datafollow==1){
                    var data={
                        goalUserId:goalUserId,
                        userId:userId
                    }
                    Data.cancelOneConcernByIds(data).done(function(res){
                        if(res.flag==1){
                            bainx.broadcast('取消关注成功！');
                            $('.followBtn').attr('data-follow',0);
                            iffollow=false;
                            f_follow.find('span').text('+关注作者');
                            f_follow.removeClass('active');

                            changOperator(0,goalUserId);
                        }else if(res.flag==0){
                            bainx.broadcast('取消关注失败！');
                            iffollow=false;
                        }
                    }).fail(function(){
                        iffollow=false;
                    })
                }
            })
            .on(tap,'.likesBtn',function(){
                if(ifclicks){
                    return false;
                }
                ifclicks=true;

                var praiseFlag=$(this).attr('data-praiseflag');
                var dyid=$(this).attr('data-dyid');
                var data={
                    cid:dyid,
                    userId:userId
                }

                var f_clikes=$(this);
                if(praiseFlag==0){
                    Data.addOneContentPraise(data).done(function(res){//点赞
                        bainx.broadcast('点赞成功！');
                        f_clikes.attr('data-praiseFlag','1');
                        f_clikes.addClass('active');
                        ifclicks=false;
                        var obj={
                            userId:res.profile.id,
                            userName:res.profile.nickname
                        };

                        //处理是从专家履历跳过来点赞操作
                        if(isrecord==1){
                            $('#popIframe', window.parent.document).parent().parent().find('.eMyArticle ul').children('.i_'+dataindex).find('.clikes i').addClass('active');
                        }
                        changClick(dataindex,1,obj,1,res.profile.id);

                    }).fail(function(){
                        ifclicks=false;
                    })
                }else if(praiseFlag==1){
                    Data.cancelOneContentPraise(data).done(function(res){//取消点赞
                        bainx.broadcast('取消点赞成功！');
                        f_clikes.attr('data-praiseFlag','0');
                        f_clikes.removeClass('active');
                        ifclicks=false;
                        //处理是从专家履历跳过来点赞操作
                        if(isrecord==1){
                            console.log('cheng');
                            $('#popIframe', window.parent.document).parent().parent().find('.eMyArticle ul').children('.i_'+dataindex).find('.clikes i').removeClass('active');
                        }
                        changClick(dataindex,0,'',0,userId);
                    }).fail(function(){
                        ifclicks=false;
                    })
                }
            })
            .on(tap,'.collect_btn img',function(){
                var num=$(this).attr('data-likes');
                var data={
                    cid:cid,
                    dyId:dyid,
                    userId:userId
                }
                if(iflikes){
                    return false;
                }
                iflikes=true;
                if(num==0){
                    Data.collectionOneContent(data).done(function(res){
                        if(res.flag){
                            iflikes=false;
                            bainx.broadcast('收藏成功！');
                            $('.collect_btn img').attr('data-likes','1');
                            var num=$('.numchang').text();
                            $('.numchang').text(parseInt(num)+1);
                            $('.collect_btn img').attr('src',""+URL.imgPath+"common/images/find/article_collected_max.png");
                            $('.collect_btn img').css('-webkit-animation', 'like_animation 0.3s');
                            setTimeout(function(){
                                $('.collect_btn img').css('-webkit-animation', '');
                            },300);
                            $('.collect_i').attr('id','showlikesed');
                            var profilePic;
                            res.profile.profilePic ? profilePic=res.profile.profilePic : profilePic=''+URL.imgPath+'common/images/avatar-small.png';
                            $('.people_portrait').find('.pic').length>=1 ? $('.people_portrait').find('.pic').eq(0).before('<div class="pic" data-id="'+userId+'"><img src="'+profilePic+'"></div>') : $('.people_portrait').append('<div class="pic" data-id="'+userId+'"><img src="'+profilePic+'"></div>');

                            //处理匿名我的文章收藏操作变化
                            if(iNum){
                                handleAnonymousChatNum(iNum,'likes',1);
                            }

                            if(dataindex){
                                //修改缓存
                                var num=parseInt(dataindex)- 1,
                                    result=JSON.parse(sessionStorage.getItem("res"));
                                result.list[num].collectFlag=1;
                                result.list[num].mikuMydynamic.timesOfCollected=result.list[num].mikuMydynamic.timesOfCollected+1;
                                result=JSON.stringify(result);
                                sessionStorage.setItem("res",result);
                            }
                        }
                    }).fail(function(){
                        iflikes=false;
                    })
                }else{
                    Data.cancelcollectionOneContent(data).done(function(res){
                        if(res.flag){
                            iflikes=false;
                            bainx.broadcast('取消收藏成功！');
                            $('.collect_btn img').attr('data-likes','0');
                            var num=$('.numchang').text();
                            $('.numchang').text(parseInt(num)-1);
                            $('.collect_btn img').attr('src',""+URL.imgPath+"common/images/find/article_collect_max.png");
                            $('.collect_btn img').css('-webkit-animation', 'like_animation 0.3s');
                            setTimeout(function(){
                                $('.collect_btn img').css('-webkit-animation', '');
                            },300);
                            $('.collect_i').attr('id','');
                            $('.people_portrait div[data-id="'+userId+'"]').remove();

                            //处理匿名我的文章收藏操作变化
                            if(iNum){
                                handleAnonymousChatNum(iNum,0);
                            }

                            if(dataindex){
                                //修改缓存
                                var num=parseInt(dataindex)- 1,
                                result=JSON.parse(sessionStorage.getItem("res"));
                                result.list[num].collectFlag=0;
                                result.list[num].mikuMydynamic.timesOfCollected=result.list[num].mikuMydynamic.timesOfCollected-1;
                                result=JSON.stringify(result);
                                sessionStorage.setItem("res",result);
                            }

                        }
                    }).fail(function(){
                        iflikes=false;
                    })
                }
            })
            .on(tap,'#img_btn',function(e){
                isblur=false;
                $('.file').click();
            })
            .on(tap,'.msg_in p',function(){
                $('.commentEntrance').css('height','auto');
                $('#inputBoxIn').focus();
            })
            .on(tap,'.send',function(){
                bainx.broadcast('评论为空！');
            })
    }


    //处理点赞修改缓存
    function changClick(dataindex,number,obj,flag,userId){
        var num=parseInt(dataindex)-1;
        var result=JSON.parse(getSessionStrorage('res'));
        result.list[num].praiseFlag=number;

        if(flag==1){
            result.list[num].praiselist.push(obj);
        }else if(flag==0){
            $.each(result.list[num].praiselist,function(index,item){
                if(item.userId==userId){
                    result.list[num].praiselist.splice(index,1);
                }
            })
        }


        result=JSON.stringify(result);
        setSessionStrorage('res',result);
    }

    //处理评论缓存
    function changComment(dataindex,obj,flag,cid){
        var num=parseInt(dataindex)-1;
        var result=JSON.parse(getSessionStrorage('res'));
        if(flag==1){
            result.list[num].commentlist.push(obj);
        }else if(flag==0){
            $.each(result.list[num].commentlist,function(index,item){
                if(item.mikuMineCommentsDo.id==cid){//评论id
                    result.list[num].commentlist.splice(index,1);
                }
            })
        }
        result=JSON.stringify(result);
        setSessionStrorage('res',result);
    }

    //处理关注修改缓存
    function changOperator(number,goalUserId){
        var result=JSON.parse(getSessionStrorage('res'));

        $.each(result.list,function(index,item){
            if(item.goalUserId==goalUserId){
                result.list[index].attentionType=number;
            }
        })

        result=JSON.stringify(result);
        setSessionStrorage('res',result);
    }

    //获取sessionStorage
    function getSessionStrorage(vKey){
        return sessionStorage.getItem(vKey);
    }

    //设置取sessionStorage
    function setSessionStrorage(key,val){
        sessionStorage.setItem(key,val);
    }

    //处理在匿名聊天收藏数的对应
    function handleAnonymousChatNum(ele,fele,flag){
        if(flag==1){
            if(fele=='likes'){
                $(window.parent.document).find('.i_'+ele+' .'+fele).children('i').addClass('active');
                $(window.parent.document).find('.i_'+ele+' .'+fele).data('collection',1);
            }
            $(window.parent.document).find('.i_'+ele+' .'+fele).children('span').text(parseInt($(window.parent.document).find('.i_'+ele+' .'+fele).children('span').text())+1);
        }else {
            if(fele=='likes'){
                $(window.parent.document).find('.i_'+ele+' .'+fele).children('i').removeClass('active');
                $(window.parent.document).find('.i_'+ele+' .'+fele).data('collection',0);
            }

            $(window.parent.document).find('.i_'+ele+' .'+fele).children('span').text(parseInt($(window.parent.document).find('.i_'+ele+' .'+fele).children('span').text())-1);
        }

    }


    //判断图片列表是否有图片
    function isHavepiv(){
        var w_w=$(window).width()*0.9;
        var dd=$('.f_addpic').find('dd');
        if((dd.length*74)<w_w){
            $('.f_addpic').width(dd.length*72);
        }else{
            $('.f_addpic').width($(window).width()*0.9);
        }
        if(dd.length>0){
            $('.f_addpic').show();
        }else{
            $('.f_addpic').hide();
        }
    }

    ////微信分享
    //function weiXinShare(shareImgUrl,desc,title){
    //    if(Common.inWeixin){
    //        console.log(document.title);
    //        var shareUrl = window.location.href;
    //        var shareImgUrl = shareImgUrl,
    //            desc =  desc,
    //            shareOption = {
    //                title: title, // 分享标题
    //                desc: desc, // 分享描述
    //                link: shareUrl,
    //                type: 'link',
    //                dataUrl: '',
    //                imgUrl: shareImgUrl
    //            },
    //            shareOptionTimeline = {
    //                title: desc,
    //                link: shareUrl,
    //                imgUrl: shareImgUrl
    //            };
    //
    //        WeiXin.hideMenuItems();
    //        WeiXin.showMenuItems();
    //        WeiXin.share(shareOption, shareOptionTimeline);
    //    }
    //}

    //查看大图
    function viewLargeImg(){
        var zWin = $(window),
            cid,
            wImage = $('#large_img'),
            domImage = wImage[0];
        var loadImg = function(id,target,callback){
            $('#large_container').css({
                width:zWin.width(),
                height:zWin.height()
            }).show();
            var imgsrc = target.attr('src');
            //imgsrc = imgsrc.substring(0, imgsrc.indexOf('!'))+'!800q75';
            $('.waitting').show();
            var ImageObj = new Image();
            ImageObj.src = imgsrc;
            ImageObj.onload = function(){
                $('.waitting').hide();
                var w = this.width;
                var h = this.height;
                var winWidth = zWin.width();
                var winHeight = zWin.height();
                var realw = parseInt((winWidth - winHeight*w/h)/2);
                var realh = parseInt((winHeight - winWidth*h/w)/2);
                wImage.css('width','auto').css('height','auto');
                wImage.css('padding-left','0px').css('padding-top','0px');
                if(h/w>1.2){
                    wImage.attr('src',imgsrc).css('height',winHeight).css('padding-left',realw+'px');
                }else{
                    wImage.attr('src',imgsrc).css('width',winWidth).css('padding-top',realh+'px');
                }
                callback&&callback();
            }
        }

        $('.pic_list').on(tap,'.pic_list div img',function(e){
            e.stopPropagation();
            $('.page-content').css('overflow-y','hidden');
            var _id = cid = parseInt($(this).attr('data-index'));
            loadImg(_id,$(this));
            $('.box').data('current','off');
            $(this).parents('.box').data('current','on');
            $('.commentEntrance').css('height',0+'px');
            $('.pinch-zoom-container').show();

            $(window.parent.document).find('.poptools').hide();
        });
        var lock = false,
            thumbLen = $('.box[data-current="on"]').find('.pic_list img').length;
        $('body').on('swipeLeft','#large_container',function(){
            if(lock && thumbLen == 1){
                return;
            }
            cid++;
            lock =true;
            var tar = $('.box[data-current="on"]').find('.pic_list img[data-index="'+cid+'"]'),
                lastThumb = $('.box[data-current="on"]').find('.pic_list div:last-child img').data('index');
            if(cid < lastThumb + 1) {
                loadImg(cid, tar, function () {
                    domImage.addEventListener('webkitAnimationEnd', function () {
                        wImage.removeClass('animated bounceInRight');
                        lock = false;
                    }, false);
                    wImage.addClass('animated bounceInRight');
                });
            }else{
                cid = lastThumb;
            }
        }).on('swipeRight','#large_container',function(){
            if(lock && thumbLen == 1 ){
                return;
            }
            cid--;
            lock =true;
            var tar = $('.box[data-current="on"]').find('.pic_list img[data-index="'+cid+'"]');
            if(cid>0 ){
                loadImg(cid,tar,function(){
                    domImage.addEventListener('webkitAnimationEnd',function(){
                        wImage.removeClass('animated bounceInLeft');
                        lock = false;
                    },false);
                    wImage.addClass('animated bounceInLeft');
                });
            }else{
                cid = 1;
            }
        })
    }

    //表情替换
    function icoSubstitution(content){
        var path=imgPath+'common/images/personalTailor/csad/faces/';
        var map={
            '[):]': 'ee_1.png',
            '[:D]': 'ee_2.png',
            '[;)]': 'ee_3.png',
            '[:-o]': 'ee_4.png',
            '[:p]': 'ee_5.png',
            '[(H)]': 'ee_6.png',
            '[:@]': 'ee_7.png',
            '[:s]': 'ee_8.png',
            '[:$]': 'ee_9.png',
            '[:(]': 'ee_10.png',
            '[:\'(]': 'ee_11.png',
            '[:|]': 'ee_12.png',
            '[(a)]': 'ee_13.png',
            '[8o|]': 'ee_14.png',
            '[8-|]': 'ee_15.png',
            '[+o(]': 'ee_16.png',
            '[<o)]': 'ee_17.png',
            '[|-)]': 'ee_18.png',
            '[*-)]': 'ee_19.png',
            '[:-#]': 'ee_20.png',
            '[:-*]': 'ee_21.png',
            '[^o)]': 'ee_22.png',
            '[8-)]': 'ee_23.png',
            '[(|)]': 'ee_24.png',
            '[(u)]': 'ee_25.png',
            '[(S)]': 'ee_26.png',
            '[(*)]': 'ee_27.png',
            '[(#)]': 'ee_28.png',
            '[(R)]': 'ee_29.png',
            '[({)]': 'ee_30.png',
            '[(})]': 'ee_31.png',
            '[(k)]': 'ee_32.png',
            '[(F)]': 'ee_33.png',
            '[(W)]': 'ee_34.png',
            '[(D)]': 'ee_35.png'
        }
        var content=content;
        if(content && content.length>0){
            var arr=content.match(/\[.*?\]/g);
            if(arr && arr.length>0){
                $.each(arr,function(key,value){
                    $.each(map, function(k,v) {
                        if (value==k){
                            content=content.replace(value,'<img src="'+path+''+v+'"/>')
                        }
                    })
                })
            }
        }
        return content;
    }

    //是否有图片
    function isHavePic(){
        var pics= $('.pic_list');
        $.each(pics,function(index,item){
            var iscon=$(item).is(":empty");
            if(iscon){
                $(item).remove();
            }
        })
    }

    //content里面视频内容的处理
    function conHandle(){
        var v_imgf=$('.art_text img.edui-faked-video');
        var v_imgup=$('.art_text img.edui-upload-video');
        v_imgf.each(function(index){
            var url=$(this).attr('_url');
            var html='<video class="edui-upload-video  vjs-default-skin video-js" controls="controls" preload="none" width="420" height="280" src="'+url+'" data-setup="{}"></video>';
            $(this).before(html);
            $(this).remove();

        })
        v_imgup.each(function(index){
            var url=$(this).attr('_url');
            var html='<video class="edui-upload-video  vjs-default-skin video-js" controls="controls" preload="none" width="420" height="280" src="'+url+'" data-setup="{}"></video>';
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