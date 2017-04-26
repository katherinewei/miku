/**
 * 发现
 * Created by Spades-k on 2016/5/30.
 */


require([
    'jquery',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/url',
    'h5/js/common/loadImage',
    'plugin/slider/1.0.0/slider',
    'h5/js/page/commentEntrance',
    'h5/js/page/shareCommon',
    'h5/js/common/banner',
    'h5/css/page/anonymousChatPage.css'
], function ($, Data, Common, URL,LoadImage,Slider,commentEntrance,shareCommon,Banner) {
    var userId = pageConfig.pid,ifclicks=false,iffollow=false,loadflag=false,loadmore=false,loadadd=false,isH5=URL.param.type,targetId=URL.param.targetId,name=URL.param.name;

    function init(){
        render();
    }

    function render(){
        $('<section id="indexPage" class=""><div id="banner" class="banner pic-carousel"></div><div class="article"><div class="article_box"><ul class="article_list grid"></ul></div></div></section><div class="popMask"><div class="switchList"><ul><li class="choice active">精选</li><li class="myConcern">我的关注</li></ul><i class="upIco"></i></div></div>').appendTo('body');

        //h5增加头尾
        if(isH5==1){
            Common.headerHtml(name);
            Common.renderAppBar();
            $('#indexPage').css({'padding-bottom':'50px','padding-top':'45px'});
            $('.navbar-main').css({'background-color':'#42454C','color':'white'});
            $('.header').css('border-bottom','1px solid #42454C');
            $('.btn-navbar').hide();
            //$('.popMask').height($(window).height()-46);
        }

        //判断是否有缓存
        var res=JSON.parse(getSessionStrorage('res')),
            flagState=JSON.parse(getSessionStrorage('flagState'));
        if(res && flagState==0){//缓存
            bannerHtml(JSON.parse(getSessionStrorage('bannerlist')));
            articleList(res);
            $('.waitting').hide();
        }else{
            sessionStorage.removeItem('res');
            sessionStorage.removeItem('pg');
            sessionStorage.removeItem('indexNum');
            sessionStorage.removeItem('hasNext');
            sessionStorage.removeItem('scrollheight');

            htmlItems(0);
        }

        setSessionStrorage('flagState',0);

        $('#indexPage').scroll(function(){
            var _this=$(this);
            var viewH=_this.height(),
                contentH =_this.get(0).scrollHeight,
                scrollTop = _this.scrollTop();
            setSessionStrorage('scrollheight',scrollTop);
            if(-(viewH+scrollTop-contentH)<=50){
                loadadd=true;
                var hasNext=getSessionStrorage('hasNext');
                if(getSessionStrorage("hasNext")=='true'){
                    if(!loadflag){
                        var number=parseInt(getSessionStrorage('pg'))+1;
                        loadmore=true;
                        htmlItems(number);
                    }
                }
            }
        });


        bindEvent();
        ////评论入口
        //commentEntrance();
        //
        shareCommon.defineShareModel();
        shareCommon.shareFn();
    }


    //精选文章列表
    function htmlItems(pg) {
        userId ? userId : userId=-1;
        var data={
                userId:userId,
                pg:pg,
                sz:15,
                targetId:targetId
            },
            pgV=pg;
        loadflag=true;
        Data.selectSnsIndexPage(data).done(function(res) {

            articleList(res);

            if($('#banner').children().length==0){
                bannerHtml(res.bannerlist);
            }
            loadmore=true;

            var getPg=getSessionStrorage('pg'),getRes=getSessionStrorage('res');
            if(!getPg){
                setSessionStrorage('pg','0');
            }else{
                var pg=parseInt(getPg)+1;
                setSessionStrorage('pg',pg);
            }

            loadflag=false;
            if(JSON.parse(getRes)){
                var listobj=JSON.parse(getRes).list;
                for(var i=0;i<res.list.length;i++){
                    listobj.push(res.list[i]);
                }
                res.list=listobj;
            }
            //分开缓存bannerlist
            if(pgV==0){
                setSessionStrorage('bannerlist',JSON.stringify(res.bannerlist));
            }
            setSessionStrorage('hasNext',JSON.stringify(res.hasNext));
            setSessionStrorage('res',JSON.stringify(res));

            loadadd && $('.add_more').eq(0).remove();
            loadadd=false;
        }).fail(function(){
            loadflag=false;
        })
    }



    //文章列表
    function articleList(res){
        if ($.isArray(res.list) && res.list.length) {
            var html=[],
                template = '<li><div class="list_head row"><div class="col col-15 row fvc"><div class="head_pic"><img src="{{profilePic}}" ></div><div class="head_title"><h4>{{nickname}}</h4><p>{{dateCreated}}</p></div></div><div class="col col-10 row head_follow far fvc" style="{{showorhide}}"><div class="follow_btn" data-Index="{{indexNum}}" data-follow="{{attentionType}}" data-goalUserId="{{goalUserId}}">{{isfollow}}</div></div></div><div class="content" href="'+URL.articleInfoPage+'?dyid={{dyid}}&indexNum={{indexNum}}{{type}}"><div class="content_con"><h4>{{contentTitle}}</h4><p>{{contentAbstract}}</p></div><div class="content_pic"><img src="{{src}}"></div></div><div class="footer row"><div class="col far row footer_con"><div class="col row fvc fal f_browse"><span>浏览{{timesOfBrowsed}}次</span></div><div class="col row fvc far operateBox"><div class="col row fvc far f_comment"><i data-cid="{{cid}}" data-dyid="{{dyid}}" data-goalType="{{goalType}}" data-userName="{{userName}}" data-index="{{indexNum}}" href="'+URL.articleInfoPage+'?dyid={{dyid}}&indexNum={{indexNum}}{{type}}"></i></div><div class="col row fvc far f_clicks"><i data-praiseFlag="{{praiseFlag}}" data-dyid="{{dyid}}" data-index="{{indexNum}}" class="{{active}}"></i></div><div class="col row fvc far f_forward "><i data-url="'+URL.site+URL.articleInfoPage+'?dyid={{dyid}}&indexNum={{indexNum}}{{type}}" data-title="{{contentTitle}}" data-art="{{contentAbstract}}" data-img="{{src}}"></i></div></div></div></div><div class="clikesShow"><i style="{{show}}"></i><span><span class="haveClicks">{{haveClicks}}</span></span></div><div class="commentShow"><ul style="{{out}}">{{comlist}}</ul></div></li>',comlist,i=getSessionStrorage('indexNum'),listlength=res.list.length;
            $.each(res.list, function (index, item) {
                var mikuMydynamic=item.mikuMydynamic,
                    mikuSnsContent=item.mikuSnsContent,
                    profile=item.profile,
                    contentAbstract=mikuSnsContent.contentAbstract,
                    noPUrl=URL.imgPath+'common/images/avatar-small.png';
                if(i && loadmore){
                    item.indexNum=parseInt(i)+index+1;
                }else{
                    item.indexNum=index+1;
                }
                var iNum=item.indexNum;
                item.likesed = item.collectFlag == 1 ? 'likesed' : '';
                item.active = item.praiseFlag == 1 ? 'active' : '';
                item.timesOfBrowsed=mikuMydynamic.timesOfBrowsed;
                //item.timesOfCommented=mikuMydynamic.timesOfCommented;
                //item.timesOfCollected=mikuMydynamic.timesOfCollected;
                item.dyid=mikuMydynamic.id;
                item.goalType=mikuMydynamic.goalType;
                item.contentTitle=mikuSnsContent.contentTitle;
                item.content=mikuSnsContent.content;
                item.userName=profile.nickname;
                item.cid=mikuSnsContent.id;
                item.dateCreated=bainx.formatDate('Y-m-d h:i', new Date(mikuMydynamic.dateCreated));
                item.contentSurfacePicUrl=mikuSnsContent.contentSurfacePicUrl;
                item.goalUserId=profile.id;
                item.nickname=profile.nickname;
                item.src = mikuSnsContent.contentSurfacePicUrl;
                item.attentionType==1 ? item.isfollow='已关注' : item.isfollow='+关注';

                if(item.commentlist && item.commentlist.length>0){
                    item.out='display:block';
                    var h=[];
                    var cH1='<li style="{{css}}"><span class="myCommentName">{{userName}}：</span><span class="myComment" data-name="{{userName}}" data-id="{{id}}" data-userid="{{userid}}" data-cid="{{cid}}" data-dyid="{{dyid}}" data-goaltype="{{goalType}}" data-index="{{iNum}}">{{content}}</span></li>';
                    var cH2='<li style="{{css}}"><span class="myCommentName">{{userName}}：</span><span class="reply">回复&nbsp;</span><span class="heCommentName">{{name}}：</span><span class="myComment" data-name="{{userName}}" data-id="{{id}}" data-userid="{{userid}}" data-cid="{{cid}}" data-dyid="{{dyid}}" data-goaltype="{{goalType}}"data-index="{{iNum}}">{{content}}</span></li>';

                    $.each(item.commentlist,function(i,v){
                        var mikuMineCommentsDo=v.mikuMineCommentsDo;

                        v.content= icoSubstitution(mikuMineCommentsDo.content);
                        v.id=mikuMineCommentsDo.id;
                        v.cid=mikuSnsContent.id;
                        v.dyid=mikuMydynamic.id;
                        v.userName= v.profile.nickname;
                        v.userid=mikuMineCommentsDo.userId;
                        v.name=v.targetName;
                        v.goalType=mikuMydynamic.goalType;
                        v.iNum=iNum;

                        i==0 ? v.css='border-top:1px solid #e7e7e7;padding-top:5px;' : v.css='';
                        if(mikuMineCommentsDo.commentType==1){//评论
                            h.push(bainx.tpl(cH1,v));
                        }else if(mikuMineCommentsDo.commentType==2){//回复
                            h.push(bainx.tpl(cH2,v));
                        }
                    })
                    item.comlist= h.join('');
                }else {
                    item.show='';
                    item.comlist= '';
                }
                if(item.praiselist && item.praiselist.length>0){
                    item.show='display:inline-block;';
                    var value=[];
                    $.each(item.praiselist,function(i,v){
                        if(i==0){
                            value.push('<span class="s'+v.userId+'">'+v.userName+'</span>');
                        }else {
                            value.push('<span class="s'+v.userId+'">、'+v.userName+'</span>');
                        }
                        item.haveClicks=value.join('');
                    })
                }else {
                    item.show='';
                    item.haveClicks='';
                }

                isH5==1 ? item.type='&type='+1 : '';
                if(contentAbstract){
                    contentAbstract.length>=55 ? item.contentAbstract=contentAbstract.substring(1,55)+'...' : item.contentAbstract=contentAbstract;
                }
                profile.id==userId ? item.showorhide='display:none' : item.showorhide='';
                profile.profilePic ? item.profilePic=profile.profilePic : item.profilePic=noPUrl;

                //item.src = index==0 ? 'src="'+mikuSnsContent.contentSurfacePicUrl+'"' : 'data-lazyload-src="'+mikuSnsContent.contentSurfacePicUrl+'"';
                html.push(bainx.tpl(template,item));
            });

            if(i && loadmore){
                setSessionStrorage('indexNum',parseInt(i)+listlength);
            }else{
                setSessionStrorage('indexNum',listlength);
            }

            loadmore=true;

            $('.article_list').append(html.join('')+'<li class="add_more tc">加载更多...</li>');
            if(!(res.hasNext)){
                $('.add_more').text('没有更多文章了哦！')
            }

            var sid,
                scrollEventHandle = function(event) {
                    event.preventDefault();
                    clearTimeout(sid);
                    sid = setTimeout(function() {
                        LoadImage($('.article_list'));
                    }, 0);
                }
            $('#indexPage').on('scroll', scrollEventHandle);

            $('.list_head')
            //关注
                .on('tap','.follow_btn',function(){
                    if(iffollow){
                        return;
                    }
                    iffollow=true;
                    var goalUserId=$(this).attr('data-goalUserId'),
                        datafollow=$(this).attr('data-follow'),
                        relationType= 1,
                        f_follow=$('.follow_btn');
                    if(datafollow==0){
                        var data={
                            userId:userId,
                            goalUserId:goalUserId,
                            relationType:relationType
                        }
                        Data.concernOneUserById(data).done(function(res){
                            if(res.flag==1){
                                bainx.broadcast('关注成功！');
                                iffollow=false;
                                f_follow.each(function(){
                                    if($(this).attr('data-goalUserId')==goalUserId){
                                        $(this).attr('data-follow',1)
                                        $(this).text('已关注');
                                    }
                                })
                                changOperator(1,goalUserId);
                            }else if(res.flag==0){
                                iffollow=false;
                                bainx.broadcast('关注失败！');
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
                                iffollow=false;
                                f_follow.each(function(){
                                    if($(this).attr('data-goalUserId')==goalUserId){
                                        $(this).attr('data-follow',0)
                                        $(this).text('+关注');
                                    }
                                })
                                changOperator(0,goalUserId);
                            }else if(res.flag==0){
                                iffollow=false;
                                bainx.broadcast('取消关注失败！');
                            }
                        }).fail(function(){
                            iffollow=false;
                        })
                    }

                })
            $('.footer')
            //点赞
                .on('tap','.f_clicks i',function(){
                    if(ifclicks){
                        return false;
                    }
                    ifclicks=true;

                    var praiseFlag=$(this).attr('data-praiseflag');
                    var dyid=$(this).attr('data-dyid'),
                        dataindex=$(this).attr('data-index');
                    var data={
                        cid:dyid,
                        userId:userId
                    }

                    var f_clikes=$(this);
                    if(praiseFlag==0){
                        Data.addOneContentPraise(data).done(function(res){//点赞
                            bainx.broadcast('点赞成功！');
                            f_clikes.attr('data-praiseFlag','1');
                            var num=f_clikes.find('span').text();
                            f_clikes.addClass('active');
                            f_clikes.find('span').text(parseInt(num)+1);
                            ifclicks=false;

                            if(f_clikes.closest('li').find('.haveClicks').text().length<=0){
                                f_clikes.closest('li').find('.haveClicks').append('<span class="s'+res.profile.id+'">'+res.profile.nickname+'</span>');
                            }else {
                                f_clikes.closest('li').find('.haveClicks').append('<span class="s'+res.profile.id+'">、'+res.profile.nickname+'</span>');
                            }

                            if(f_clikes.closest('li').find('.clikesShow i').css('display')=='none'){
                                f_clikes.closest('li').find('.clikesShow i').css('display','inline-block');
                            }

                            var obj={
                                userId:res.profile.id,
                                userName:res.profile.nickname
                            };

                            changClick(dataindex,1,obj,1,res.profile.id);
                        }).fail(function(){
                            ifclicks=false;
                        })
                    }else if(praiseFlag==1){
                        Data.cancelOneContentPraise(data).done(function(res){//取消点赞
                            bainx.broadcast('取消点赞成功！');
                            f_clikes.attr('data-praiseFlag','0');
                            var num=f_clikes.find('span').text();
                            f_clikes.removeClass('active');
                            f_clikes.find('span').text(parseInt(num)-1);
                            ifclicks=false;

                            f_clikes.closest('li').find('.haveClicks').children('.s'+userId).remove();

                            if(f_clikes.closest('li').find('.haveClicks').text().length<=0){
                                f_clikes.closest('li').find('.clikesShow i').css('display','none');
                            }

                            changClick(dataindex,0,'',0,userId);
                        }).fail(function(){
                            ifclicks=false;
                        })
                    }
                })
                //分享
                .on('tap','.f_forward i',function(){
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
            //评论
            //.on('tap','.f_comment i',function(e){
            //    e.stopPropagation();
            //    $('.commentEntrance').css('height','auto');
            //    $('#my_form').show();
            //    var cid=$(this).attr('data-cid');
            //    var dyid=$(this).attr('data-dyid');
            //    var goalType=$(this).attr('data-goalType');
            //    var userName=$(this).attr('data-userName');
            //    var index=$(this).attr('data-index');
            //    $('.sendCo').attr({'data-cid':cid,'data-dyid':dyid,'data-goalType':goalType,'data-userName':userName,'data-index':index,'data-commenttype':'1','data-targetCommentId':'0','data-userid':''});
            //    $('#inputBoxIn').attr('placeholder','说点什么吧').focus();
            //})

        }else {
            var _html='<li class="notData"><img src="'+URL.imgPath+'common/images/loading_fail.png"/><p>没有数据哦！</p></li>';
            $('.article_list').append(_html);
        }
        loadmore=false;

        var getScrollheight=getSessionStrorage('scrollheight');
        if(getScrollheight){
            var scrollheight=parseInt(getScrollheight);
            //window.onload=function(){
            $('#indexPage').scrollTop(scrollheight);
            LoadImage($('.article_list'));
            //}
        }
    }

    //banner图片
    function bannerHtml(data){
        var template='<li href="{{href}}"><img _src="{{img}}" src="{{img}}" /></li>',
            html=['<div class="slider-outer"><ul>'];
        $.each(data,function(index,item){
            //html.push(bainx.tpl(template,item));
            html.push((new Banner(item)).html(template));
        });
        html.push('</ul></div><div id="carousel-status" class="carousel-status"><ul></ul></div>');
        $('.banner').append(html.join(''));
        Slider({
            slideCell:"#banner",
            titCell:".carousel-status ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
            mainCell:".slider-outer ul",
            effect:"leftLoop",
            autoPlay:true,//自动播放
            autoPage:true, //自动分页
            switchLoad:"_src" //切换加载，真实图片路径为"_src"
        });
    }

    //获取sessionStorage
    function getSessionStrorage(vKey){
        return sessionStorage.getItem(vKey);
    }

    //设置取sessionStorage
    function setSessionStrorage(key,val){
        sessionStorage.setItem(key,val);
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
    //function changComment(dataindex,obj){
    //    var num=parseInt(dataindex)-1;
    //    var result=JSON.parse(getSessionStrorage('res'));
    //    result.list[num].commentlist.push(obj);
    //    result=JSON.stringify(result);
    //    setSessionStrorage('res',result);
    //}

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


    //事件绑定
    function bindEvent(){

        //解除input不能选图片
        $('body').on('click', 'input', function (event) {
            if (event && event.preventDefault) {
                window.event.returnValue = true;
            }
        })
        //评论
        //.on('tap','.sendCo',function(){
        //
        //    var comment= $.trim($('#inputBoxIn').val());
        //    if(!comment || comment.length==0){
        //        return;
        //    }
        //
        //    var picUrls=[],
        //        picUrlsList=$('.f_addpic').find('dd');
        //    $.each(picUrlsList,function(index,item){
        //        picUrls.push($(item).find('img').attr('src'));
        //    })
        //
        //    var commentType=$(this).attr('data-commentType');
        //    var index=$(this).attr('data-index');
        //
        //    var data={
        //        cid:$(this).attr('data-cid'),
        //        dyid:$(this).attr('data-dyid'),
        //        userId:pageConfig.pid,
        //        userName:$(this).attr('data-userName'),
        //        comment:comment,
        //        goalType:$(this).attr('data-goaltype'),
        //        commentType:commentType,
        //        targetCommentId:$(this).attr('data-targetCommentId'),
        //        picUrls:picUrls.join(",")
        //    }
        //    Data.addOneCommentByUsersay(data).done(function(res){
        //        if(res.flag==1 || res.flag==2){
        //            bainx.broadcast('评论成功！');
        //            $('.commentShow ul').show();
        //            $('#inputBoxIn').val('');
        //            $('.commentEntrance').css('height',0+'px');
        //            $('.f_addpic').find('dd').remove();
        //            $('.sendCo').attr('data-commentType','1');
        //            $('.sendCo').attr('data-targetCommentId','0');
        //
        //            $('.expBox').css('height',0+'px');
        //            res.userName=res.profile.nickname;
        //            res.content=icoSubstitution(res.comment.content);
        //            res.id=res.comment.id;
        //            res.name=res.targetName;
        //            res.userid=res.comment.userId;
        //            res.cid=res.dynamic.goalId;
        //            res.dyid=res.dynamic.id;
        //            res.goaltype=res.dynamic.goalType;
        //            var html=[];
        //            var cH1='<li><span class="myCommentName">{{userName}}：</span><span class="myComment" data-name="{{name}}" data-id="{{id}}" data-userid="{{userid}}" data-cid="{{cid}}" data-dyid="{{dyid}}" data-username="{{userName}}" data-goaltype="{{goaltype}}">{{content}}</span></li>';
        //            var cH2='<li><span class="myCommentName">{{userName}}：</span><span class="reply">回复&nbsp;</span><span class="heCommentName">{{name}}：</span><span class="myComment" data-name="{{name}}" data-id="{{id}}" data-userid="{{userid}}" data-cid="{{cid}}" data-dyid="{{dyid}}" data-username="{{userName}}" data-goaltype="{{goaltype}}">{{content}}</span></li>';
        //            if(commentType=='1'){
        //                html.push(bainx.tpl(cH1,res));
        //            }else {
        //                html.push(bainx.tpl(cH2,res));
        //            }
        //            $('.article_list > li').eq(index-1).find('.commentShow ul').append(html.join(''));
        //            $('.article_list > li').eq(index-1).find('.commentShow ul li').eq(0).css({'border-top': '1px solid #e7e7e7',
        //            'padding-top': '5px'});
        //
        //            var obj={
        //                flag:res.flag,
        //                mikuMineCommentsDo:res.comment,
        //                profile:res.profile,
        //                targetName:res.targetName
        //            }
        //            changComment(index,obj);
        //        }
        //
        //    }).fail(function(){
        //        bainx.broadcast('评论失败！');
        //    })
        //})
        ////回复
        //.on('tap','.myComment',function(){
        //
        //    var userid=$(this).attr('data-userid');
        //    if(userid==pageConfig.pid && pageConfig.pid){
        //        bainx.broadcast('不能回复自己喔！');
        //        return
        //    }
        //
        //    var name=$(this).attr('data-name');
        //    var id=$(this).attr('data-id');
        //    var userid=$(this).attr('data-userid');
        //    var cid=$(this).attr('data-cid');
        //    var dyid=$(this).attr('data-dyid');
        //    var goaltype=$(this).attr('data-goaltype');
        //    var index=$(this).attr('data-index');
        //    $('#inputBoxIn').attr('placeholder','回复'+name);
        //    $('.sendCo').attr({'data-commenttype':'2','data-targetCommentId':id,'data-name':name,'data-userid':userid,'data-cid':cid,'data-dyid':dyid,'data-goaltype':goaltype,'data-index':index});
        //    $('#my_form').hide();
        //    $('.commentEntrance').css('height','auto');
        //})


        //document.addEventListener('touchstart',touchStart,false);
        //document.addEventListener('touchmove',touchMove,false);
    }
    init();
})