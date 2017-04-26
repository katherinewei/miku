/**
 * Created by Spades-k on 2016/9/6.
 */
define('h5/js/page/anonyExtend', [
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/common/nexter',
    'h5/js/page/shareCommon',
], function($,URL, Data,Nexter,shareCommon) {

    var isTaping=false;//重复点击标识
    var firstLoad=true;
    var ifclicks=false;
    var userId=pageConfig.pid;
    var isNotTmp = pageConfig.pid && parseInt(pageConfig.pid) > 0;  //是注册用户
    //副入口
    function assistant(){
        defineBframe();

        if ($('.eMessageB').offset().top < $(window).height()*1.5 && firstLoad) {
            firstLoad = false;
        }
    }

    //文件最终入口
    function init(){
        var isT=judgeIsMobile(),tap='';
        if(isT){
            tap='tap';
        }else {
            tap='click';
        }
        Events(tap);
    }

    //定义整体外框
    function defineBframe(){
        var tem='<div class="wBframe"><div class="topBanner grid"></div><div class="extendCon"><div class="eMyArticle"><ul></ul></div><div class="eMessageB"><ul></ul></div></div></div>';
        $('.chatExtend').append(tem);
        //
        defineTopCon();

        var userId,uid;
        if(URL.param.coopCode){
            userId=$('.container').attr('data-emid-expert');//
            uid=$('.container').attr('data-uid');//

        }
        else{
            if(isNotTmp){
                var currentCsadIM=localStorage.getItem('currentCsadIM');
                userId=JSON.parse(currentCsadIM)[0];//
                var currentUserIM=localStorage.getItem('currentUserIM');
                uid=JSON.parse(currentUserIM)[0].split('_')[1];//

            }else {
                var userData=localStorage.getItem('userData');
                userId='miku_'+getLocalStorageValue('userId');
                uid=JSON.parse(userData)[2];//
            }
        }
        defineConShowBox(userId,uid);
    }
    //定义头部的内容
    function defineTopCon(){
        var csadPicUrl,csadName
        if(URL.param.coopCode) {
            csadPicUrl= imgPath+'common/images/avatar9.png';
            csadName='';
        }
        else{
             csadPicUrl=getLocalStorageValue('csadPicUrl');
             csadName=getLocalStorageValue('csadName');
        }
        var tem='<div class="eTCon row"><div class="ePortrait col fvc fac tc"><img src="'+csadPicUrl+'" alt="头像"><p>'+csadName+'</p></div><div class="eIpMsg col row fvc fac"><div class="eMsgList"><p class="tday"></p><p class="allb"></p></div></div></div><div class="tabBtnList"><ul class="clearfix"></ul></div><div class="eLeaveMessageIn clearfix"><input type="text" class="getInV" placeholder="留个言吧..."><span class="publishBtn">发表</span></div>';

        //处理li中的dom元素
        function eHandleTabBtnList(){
            var arrTx=['管家介绍','我的文章','留言板'],arrClass=['housekeeperTap','myArticle','messageB'];
            var temArr=[];
            for (var o=0;o<arrTx.length;o++){
                var tem='<li class="tc fl '+arrClass[o]+'"><p>'+arrTx[o]+'</p></li>';
                temArr.push(tem);
            }
            $('.tabBtnList ul').append(temArr.join(''));
            $('.tabBtnList ul li').eq(0).children('p').addClass('active');
        }


        $('.topBanner').append(tem);
        //
        eHandleTabBtnList();
    }

    //定义管家介绍
    function defineConShowBox(emUserName,userId){
        var data = {
            emUserName:emUserName,
            userId:userId//用户的id或者匿名用户的sessionId值
        }

        Data.getCsadInfo(data).done(function(res){
            //储存管家信息
            var butlerData=[];
            butlerData[0]=res.vo.id;//专家id
            butlerData[1]=res.vo.userId;//专家的用户userId
            var butlerData = JSON.stringify(butlerData);
            localStorage.setItem('butlerData',butlerData);

            //处理头像
            if(URL.param.coopCode) {
                $('.ePortrait img').attr('src',res.vo.csadPicUrl);
                $('.ePortrait p').text(res.vo.csadName);
            }
            //处理访问量
            $('.tday').text('今日访客：'+res.todayCount);
            $('.allb').text('总浏览量：'+res.allCount);

            var tem='<div class="eExpertIntroduction"><ul><li><div class="eIntroductionList clearfix"><div class="eintroPic tc"><img src="{{csadPicUrl}}"></div><div class="eintroDescribe"><p class="eTitle">简介</p><p class="eDetailed">{{csadIntroduce}}</p></div></div></li><li><div class="eIntroductionList clearfix"><div class="eintroPic tc"><img src="http://ninelab.b0.upaiyun.com/common/images/personalTailor/icon_p2.png"></div><div class="eintroDescribe"><p class="eTitle">成就</p><p class="eDetailed">{{csadNoticeBoard}}</p></div></div></li><li><div class="eIntroductionList clearfix"><div class="eintroPic tc"><img src="http://ninelab.b0.upaiyun.com/common/images/personalTailor/icon_p3.png"></div><div class="eintroDescribe"><p class="eTitle">擅长</p><p class="eDetailed">{{csadSpeciality}}</p></div></div></li></ul></div>';
            var html=[],
                item = res.vo;
            if(!item.csadPicUrl){
                item.csadPicUrl = imgPath + 'common/images/personalTailor/p_expert.png';
            }
            html.push(bainx.tpl(tem,item));
            $('.extendCon').append(html.join(''));
        })

    }

    //定义我的文章内容
    function defineMyArticle(ele,userId,pg,seerId){
        //个人文章列表
        var data={
            pg:pg ? pg : 0,
            userId:userId,//专家的id
            size:10,
            seerId:seerId//对应用户的id，是外来用户或者匿名用户的话则为-1 如果是发现中的个人文章列表则为0或者不填
        }
        Data.personalPageContent(data).done(function(res){
            var tem='<li class="i_{{iNum}}"><div class="eArticleConHead clearfix" data-href="'+URL.articleInfoPage+'?cid={{cid}}&dyid={{dyid}}&goalType={{goalType}}&userName={{userName}}&praiseFlag={{praiseFlag}}&indexNum={{iNum}}&isrecord=1"><div class="eAtrHeadPic fl"><img src="{{profilePic}}" alt="头像"></div><div class="eAtrHeadTitFTit fl"><div class="eHTD clearfix"><p class="DTitle fl">{{userName}}</p></div><p class="eAtrDescribe">{{dateCreated}}</p></div></div><div class="eAtrHeadSurface" data-href="'+URL.articleInfoPage+'?cid={{cid}}&dyid={{dyid}}&goalType={{goalType}}&userName={{userName}}&praiseFlag={{praiseFlag}}&indexNum={{iNum}}&isrecord=1"><img src="{{contentSurfacePicUrl}}" alt="封面图"></div><div class="eDperationData clearfix"><span class="browse">浏览<span>{{timesOfBrowsed}}</span>次</span><div class="rExtend"><a class="comment"><i class="{{active}}" data-cid="{{cid}}"  data-collection="{{collectFlag}}" data-goaltype="{{goalType}}" data-dyid="{{dyid}}" data-userName="{{userName}}" data-index="{{indexNum}}" data-href="'+URL.articleInfoPage+'?cid={{cid}}&dyid={{dyid}}&goalType={{goalType}}&userName={{userName}}&praiseFlag={{praiseFlag}}&indexNum={{iNum}}&isrecord=1"></i></a><a class="clikes" href="javascript:"><i data-index="{{indexNum}}" data-praiseflag="{{praiseFlag}}" data-collection="{{collectFlag}}" data-cid="{{cid}}" data-dyid="{{dyid}}" class="{{active}}"></i></span></a><a id="share" href="javascript:" class="repeat"  style="display:none;"></a></div></div><div class="clikesShow"><i style="{{show}}"></i><span><span class="haveClicks">{{haveClicks}}</span></span></div><div class="commentShow"><ul style="{{out}}">{{comlist}}</ul></div></li>',html=[];
            handlePgAdd('atrpg');//设置页数
            setSessionStrorage('res',JSON.stringify(res));
            if ($.isArray(res.list) && res.list.length) {
                $.each(res.list, function (index, item) {

                    if(getSessionStrorage('indexNum')){
                        item.indexNum=parseInt(sessionStorage.getItem('indexNum'))+index+1;
                    }else{
                        item.indexNum=index+1;
                    }

                    item.profilePic=item.profile.profilePic ? item.profile.profilePic : imgPath + 'common/images/personalTailor/p_expert.png';
                    item.contentTitle=item.mikuSnsContent.contentTitle;
                    item.dateCreated=bainx.formatDate('Y.m.d h:s', new Date(item.mikuMydynamic.dateCreated));
                    item.contentAbstract=item.mikuSnsContent.contentAbstract;
                    item.contentSurfacePicUrl=item.mikuSnsContent.contentSurfacePicUrl;
                    item.timesOfBrowsed=item.mikuMydynamic.timesOfBrowsed;
                    item.timesOfCommented=item.mikuMydynamic.timesOfCommented;
                    item.timesOfCollected=item.mikuMydynamic.timesOfCollected;
                    item.cid=item.mikuSnsContent.id;
                    item.dyid=item.mikuMydynamic.id;
                    item.goalType=item.mikuMydynamic.goalType;
                    item.userName=item.profile.nickname;
                    item.praiseFlag=item.praiseFlag;
                    item.goalType=item.mikuMydynamic.goalType;
                    item.indexNum=index+1;
                    item.collectFlag=item.collectFlag;
                    item.active=item.praiseFlag==0 ? '' : 'active';
                    item.iNum=index+1;

                    if(item.commentlist && item.commentlist.length>0){
                        item.out='display:block';
                        var h=[];
                        var cH1='<li style="{{css}}"><span class="myCommentName">{{userName}}：</span><span class="myComment" data-name="{{userName}}" data-id="{{id}}" data-userid="{{userid}}" data-cid="{{cid}}" data-dyid="{{dyid}}" data-goaltype="{{goalType}}" data-index="{{iNum}}">{{content}}</span></li>';
                        var cH2='<li style="{{css}}"><span class="myCommentName">{{userName}}：</span><span class="reply">回复&nbsp;</span><span class="heCommentName">{{name}}：</span><span class="myComment" data-name="{{userName}}" data-id="{{id}}" data-userid="{{userid}}" data-cid="{{cid}}" data-dyid="{{dyid}}" data-goaltype="{{goalType}}"data-index="{{iNum}}">{{content}}</span></li>';

                        $.each(item.commentlist,function(i,v){
                            v.content= icoSubstitution(v.mikuMineCommentsDo.content);
                            v.id=v.mikuMineCommentsDo.id;
                            v.cid=item.mikuSnsContent.id;
                            v.dyid=item.mikuMydynamic.id;
                            v.userName= v.profile.nickname;
                            v.userid=v.mikuMineCommentsDo.userId;
                            v.name=v.targetName;
                            v.goalType=item.mikuMydynamic.goalType;
                            v.iNum=item.iNum+1;
                            i==0 ? v.css='border-top:1px solid #e7e7e7;padding-top:5px;' : v.css='';

                            if(v.mikuMineCommentsDo.commentType==1){//评论
                                h.push(bainx.tpl(cH1,v));
                            }else if(v.mikuMineCommentsDo.commentType==2){//回复
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

                    html.push(bainx.tpl(tem,item));
                })

                if(getSessionStrorage('indexNum')){
                    var indexNum=sessionStorage.getItem('indexNum');
                    setSessionStrorage('indexNum',parseInt(indexNum)+res.list.length);
                }else{
                    setSessionStrorage('indexNum',res.list.length);
                }

                $('.eMyArticle > ul').append(html.join(''));
                var msg;
                if(res.hasNext){
                    msg='加载下一页';
                }else {
                    msg='没有更多了哦...';
                }
                $('.eMyArticle > ul .bottomArtBtn').remove();
                $('.eMyArticle > ul').append(handleBottomMore('bottomArtBtn',msg,res.hasNext));
            }
            else {
                if($('body').data('atrpg')==0){
                    $('.eMyArticle > ul').append(handleNoData('暂时没有数据喔！'));
                }else {
                    $('.eMyArticle > ul .bottomArtBtn').remove();
                    $('.eMyArticle > ul').append(handleBottomMore('bottomArtBtn','没有更多了哦...',res.hasNext));
                }
            }
            shareCommon.defineShareModel();//加载分享
            shareCommon.shareFn();//加载分享方法
        })


    }

    //定义留言板
    function defineMessageB(csadId,pg){

        //获取留言数据
        var data={
            pg:pg ? pg : 0,
            csadId:csadId,//专家的id
            sz:10
        }
        Data.msboardList(data).done(function(res){
            var t='<li class="data{{id}}" data-id="{{id}}" data-userId="{{fromUserId}}"><div class="eMessageBBox clearfix"><div class="eBBoxPic fl"><img src="{{fromUserImg}}" alt="头像"></div><div class="eBBoxMessage fl"><p class="eTitle">{{fromUserName}}<span class="delectMsg {{hide}}">删除</span></span></p><p class="eData">{{dateCreated}}</p><p class="eMessage">{{content}}</p></div></div></li>';
            var html=[];
            var msg;
            handlePgAdd('emsgpg');//定义留言的页数
            if ($.isArray(res.list) && res.list.length) {
                var pid=pageConfig.pid;
                $.each(res.list, function (index, item) {
                    item.dateCreated=bainx.formatDate('Y-m-d h:i', new Date(item.dateCreated));
                    item.fromUserImg=item.fromUserImg ? item.fromUserImg : imgPath + 'common/images/personalTailor/p_expert.png';
                    item.hide=item.fromUserId==pid ? '' : 'hide';//是否对应用户
                    html.push(bainx.tpl(t,item));
                })
                if(res.hasNext){
                    msg='加载下一页';
                }else {
                    msg='没有更多了哦...';
                }
                $('.eMessageB ul').append(html.join(''));
                $('.eMessageB ul').find('.bottomMsgBtn').remove();
                $('.eMessageB ul').append(handleBottomMore('bottomMsgBtn',msg,res.hasNext));
            }else {
                if($('body').data('emsgpg')==0){
                    $('.eMessageB ul').append(handleNoData('暂时没有数据喔！'));
                }else {
                    $('.eMessageB ul').find('.bottomMsgBtn').remove();
                    $('.eMessageB ul').append(handleBottomMore('bottomMsgBtn','没有更多了哦...',res.hasNext));
                }

            }

        })

    }

    //处理没有文章
    function handleNoData(prompt){
        var tem='<li class="notData"><img src="http://unesmall.b0.upaiyun.com/common/images/loading_fail.png"><p>'+prompt+'</p></li>';
        return tem;
    }

    //处理列表底部没有更多和下一页
    function handleBottomMore(ele,msg,ised){
        var tem='<li data-ised="'+ised+'" class="tc '+ele+'">'+msg+'</li>';
        return tem;
    }

    //定义弹出输入评论部分
    function popInComment(ele){
        var tem='';
        $('.'+ele).append(tem);
    }

    //获取localStorage的值
    function getLocalStorageValue(valueK){
        return localStorage.getItem(valueK);
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
        return content;
    }

    //处理收藏的操作
    //function handleLikesOperate(_this){
    //    if(isTapingForCollection){
    //        return;
    //    }
    //    if(!pageConfig.pid){
    //        bainx.broadcast('请登录再收藏文章！');
    //        return;
    //    }
    //    isTapingForCollection=true;
    //    var Collection=_this.data('collection');//是否收藏
    //    var cid=_this.data('cid');
    //    var dyid=_this.data('dyid');
    //    var userId=pageConfig.pid;
    //    if(Collection==1){//取消
    //        var data={
    //            dyId:dyid,
    //            userId:userId
    //        }
    //        Data.cancelcollectionOneContent(data).done(function(res) {
    //            if(res.flag){
    //                _this.data('collection',0);
    //                _this.children('i').removeClass('active');
    //                _this.children('span').text(parseInt(_this.children('span').text())-1);//值+1
    //                bainx.broadcast('取消收藏成功！');
    //                isTapingForCollection=false;
    //            }else {
    //                isTapingForCollection=false;
    //            }
    //        }).fail(function(){
    //            isTapingForCollection=false;
    //        })
    //    }else {//收藏
    //        var data={
    //            cid:cid,
    //            dyId:dyid,
    //            userId:userId
    //        }
    //        Data.collectionOneContent(data).done(function(res) {
    //            if(res.flag){
    //                _this.data('collection',1);
    //                _this.children('i').addClass('active');
    //                _this.children('span').text(parseInt(_this.children('span').text())+1);//值+1
    //                bainx.broadcast('收藏成功！');
    //                isTapingForCollection=false;
    //            }else {
    //                isTapingForCollection=false;
    //            }
    //        }).fail(function(){
    //            isTapingForCollection=false;
    //        })
    //    }
    //
    //}

    //处理留言发表的操作
    function handleLeaveMsg(ele,fromUserName,fromUserId,csadId,flag,csadUserId){
        var t='<li class="data{{id}}" data-id="{{id}}"><div class="eMessageBBox clearfix"><div class="eBBoxPic fl"><img src="{{fromUserImg}}" alt="头像"></div><div class="eBBoxMessage fl"><p class="eTitle">{{fromUserName}}<span class="delectMsg {{hide}}">删除</span></p><p class="eData">{{dateCreated}}</p><p class="eMessage">{{content}}</p></div></div></li>',html=[];
        var value=$.trim($('.'+ele).val());
        if(value.length==0){
            return;
        }
        var data={
            content:value,//留言内容
            fromUserName:fromUserName,//留言的用户【匿名用户的时候填匿名用户+sessionId即可】
            fromUserId:fromUserId,//留言的用户的id【匿名用户的时候填-1】
            csadId:csadId,//专家的id
            flag:flag,//1代表用户  0代表匿名用户
            csadUserId:csadUserId//专家的用户id
        }
        var pid=pageConfig.pid;
        isTaping=true;
        Data.msboardInsert(data).done(function(res) {
            if(res.size==1){
                isTaping=false;
                res.fromUserImg=res.data.fromUserImg ? res.data.fromUserImg : imgPath + 'common/images/personalTailor/p_expert.png';
                res.fromUserName=res.data.fromUserName;
                res.content=res.data.content;
                res.dateCreated=bainx.formatDate('Y-m-d h:i', new Date(res.data.dateCreated));
                res.id=res.data.id;
                res.hide=pid ? '' : 'hide';
                html.push(bainx.tpl(t,res));
                $('.getInV').val('');
                bainx.broadcast('留言成功！');
                if($('.eMessageB ul li').length>=1){
                    $('.eMessageB ul li').eq(0).before(html.join(''));
                }else {
                    $('.eMessageB ul').append(html.join(''));
                }

                $('.eMessageB .notData').remove();
            }
        }).fail(function(){
            isTaping=false;
            bainx.broadcast('留言失败！');
        })
    }

    //处理删除留言
    function handleDelectMsg(bId){
        var data={
            bId:bId
        }
        Data.msboardDelete(data).done(function(res) {
            if(res.flag==1){
                $('.eMessageB ul').children('.data'+bId).remove();
                if($('.eMessageB ul li').length==0 || ($('.eMessageB ul li').length==1 && $('.eMessageB ul').children('.bottomMsgBtn').length==1)){
                    $('.eMessageB ul li').remove();
                    $('.eMessageB ul').append(handleNoData('暂时没有数据喔！'));
                }
                bainx.broadcast('删除留言成功！');
            }else if(res.flag==0){
                bainx.broadcast('删除留言失败！');
            }
        })

    }

    //处理文章加载更多
    function handleloadMoreAtr(key){
        var userId=localStorage.getItem('userId');//专家的id
        var pg=parseInt($('body').attr('data-'+key))+1;
        var seerId=pageConfig.pid;
        if(!pageConfig.pid || parseInt(pageConfig.pid) < 0){
            seerId=-1;
        }
        //调文章加载方法
        defineMyArticle('extendCon',userId,pg,seerId);
    }

    //处理中的页数+1
    function handlePgAdd(elePg){
        if($('body').data(elePg)!=0){
            $('body').attr('data-'+elePg,0);
        }else {
            $('body').attr('data-'+elePg,parseInt($('body').data(elePg))+1);
        }
    }

    //处理点击我的文章弹出文章详情
    function handlePopArticleDetails(src){
        var tem='<div class="popDetails"><div class="poptools"><i class="backReturn"></i></div><iframe id="popIframe" src="'+src+'" frameborder="0" width="100%" height="100%"></iframe></div>';
        $('body').append(tem);
    }

    //处理判断是否移动端
    function judgeIsMobile(){
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
            return true;
        }
        else {
            return false;
        }
    }

    //事件处理
    function Events(tap){
        $('body').on(tap,'.clikes i',function(){//点赞操作
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
                    f_clikes.attr('data-praiseFlag','1').addClass('active');
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
        $('body').on(tap,'.publishBtn',function(){

            if(isTaping){
                return;
            }
                //拿匿名用户信息
                //var userData=localStorage.getItem('userData');
                //var user=JSON.parse(userData)[0];//匿名用户
                //var sessionId=JSON.parse(userData)[2];//
                //拿专家信息
                var butlerData=localStorage.getItem('butlerData');
                var id=JSON.parse(butlerData)[0];//专家id
                var userId=JSON.parse(butlerData)[1];//专家的用户id
                //处理是否登录
                var fromUserName;
                var fromUserId;
                var flag;
                if(isNotTmp){
                    var currentUserIM=localStorage.getItem('currentUserIM');
                    fromUserName=JSON.parse(currentUserIM)[2];//
                    fromUserId=pageConfig.pid;
                    flag=1;
                }else {
                    fromUserName='匿名用户';
                    fromUserId=-1;
                    flag=0;
                }
                var csadId=id;
                var csadUserId=userId;
                handleLeaveMsg('getInV',fromUserName,fromUserId,csadId,flag,csadUserId);
        }).on(tap,'.delectMsg',function(){
            var bId=$(this).parent().parent().parent().parent().data('id');
            handleDelectMsg(bId);

        }).on(tap,'.eArticleConHead,.eAtrHeadSurface,.comment i',function(){
            var href=$(this).data('href');
            handlePopArticleDetails(href);
            //URL.assign(href);
        }).on(tap,'.backReturn',function(e){
            e.preventDefault();
            setTimeout(function(){
                $('.popDetails').remove();//关闭文章详情层
            },200)
        }).on(tap,'.bottomArtBtn',function(){
            if($(this).data('ised')==false){//没有分页就不能点击了
                return;
            }
            handleloadMoreAtr('atrPg');//文章加载更多
        }).on(tap,'.bottomMsgBtn',function(){
            if($(this).data('ised')==false){//没有分页就不能点击了
                return;
            }
            var butlerData=localStorage.getItem('butlerData');
            var id=JSON.parse(butlerData)[0];//专家id
            var num=parseInt($('body').data('emsgpg'))==0 ? parseInt($('body').data('emsgpg'))+1 : parseInt($('body').data('emsgpg'));//页数
            defineMessageB(id,num);
        })
            .on(tap,'.comment i',function(e){
                e.stopPropagation();
                $('.commentEntrance').css('height','auto');
                $('#my_form').show();
                var cid=$(this).attr('data-cid');
                var dyid=$(this).attr('data-dyid');
                var goalType=$(this).attr('data-goalType');
                var userName=$(this).attr('data-userName');
                var index=$(this).attr('data-index');
                $('.sendCo').attr({'data-cid':cid,'data-dyid':dyid,'data-goalType':goalType,'data-userName':userName,'data-index':index,'data-commenttype':'1','data-targetCommentId':'0','data-userid':''});
                $('#inputBoxIn').attr('placeholder','说点什么吧').focus();
            })
            .on('tap','.myComment',function(){

                var userid=$(this).attr('data-userid');
                if(userid==pageConfig.pid && pageConfig.pid){
                    bainx.broadcast('不能回复自己喔！');
                    return
                }

                var name=$(this).attr('data-name');
                var id=$(this).attr('data-id');
                var userid=$(this).attr('data-userid');
                var cid=$(this).attr('data-cid');
                var dyid=$(this).attr('data-dyid');
                var goaltype=$(this).attr('data-goaltype');
                var index=$(this).attr('data-index');
                $('#inputBoxIn').attr('placeholder','回复'+name);
                $('.sendCo').attr({'data-commenttype':'2','data-targetCommentId':id,'data-name':name,'data-userid':userid,'data-cid':cid,'data-dyid':dyid,'data-goaltype':goaltype,'data-index':index});
                $('#my_form').hide();
                $('.commentEntrance').css('height','auto');
            })
            .on('tap','.sendCo',function(){

                var comment= $.trim($('#inputBoxIn').val());
                if(!comment || comment.length==0){
                    return;
                }

                var picUrls=[],
                    picUrlsList=$('.f_addpic').find('dd');
                $.each(picUrlsList,function(index,item){
                    picUrls.push($(item).find('img').attr('src'));
                })

                var commentType=$(this).attr('data-commentType');
                var index=$(this).attr('data-index');

                var data={
                    cid:$(this).attr('data-cid'),
                    dyid:$(this).attr('data-dyid'),
                    userId:pageConfig.pid,
                    userName:$(this).attr('data-userName'),
                    comment:comment,
                    goalType:$(this).attr('data-goaltype'),
                    commentType:commentType,
                    targetCommentId:$(this).attr('data-targetCommentId'),
                    picUrls:picUrls.join(",")
                }
                Data.addOneCommentByUsersay(data).done(function(res){
                    if(res.flag==1 || res.flag==2){
                        bainx.broadcast('评论成功！');
                        $('.commentShow ul').show();
                        $('#inputBoxIn').val('');
                        $('.commentEntrance').css('height',0+'px');
                        $('.f_addpic').find('dd').remove();
                        $('.sendCo').attr('data-commentType','1');
                        $('.sendCo').attr('data-targetCommentId','0');

                        $('.expBox').css('height',0+'px');
                        res.userName=res.profile.nickname;
                        res.content=icoSubstitution(res.comment.content);
                        res.id=res.comment.id;
                        res.name=res.targetName;
                        res.userid=res.comment.userId;
                        res.cid=res.dynamic.goalId;
                        res.dyid=res.dynamic.id;
                        res.goaltype=res.dynamic.goalType;
                        var html=[];
                        var cH1='<li><span class="myCommentName">{{userName}}：</span><span class="myComment" data-name="{{name}}" data-id="{{id}}" data-userid="{{userid}}" data-cid="{{cid}}" data-dyid="{{dyid}}" data-username="{{userName}}" data-goaltype="{{goaltype}}">{{content}}</span></li>';
                        var cH2='<li><span class="myCommentName">{{userName}}：</span><span class="reply">回复&nbsp;</span><span class="heCommentName">{{name}}：</span><span class="myComment" data-name="{{name}}" data-id="{{id}}" data-userid="{{userid}}" data-cid="{{cid}}" data-dyid="{{dyid}}" data-username="{{userName}}" data-goaltype="{{goaltype}}">{{content}}</span></li>';
                        if(commentType=='1'){
                            html.push(bainx.tpl(cH1,res));
                        }else {
                            html.push(bainx.tpl(cH2,res));
                        }
                        $('.eMyArticle > ul > li').eq(index-1).find('.commentShow ul').append(html.join(''));
                        $('.eMyArticle > ul > li').eq(index-1).find('.commentShow ul li').eq(0).css({'border-top': '1px solid #e7e7e7',
                            'padding-top': '5px'});

                        var obj={
                            flag:res.flag,
                            mikuMineCommentsDo:res.comment,
                            profile:res.profile,
                            targetName:res.targetName
                        }
                        changComment(index,obj);
                    }

                }).fail(function(){
                    bainx.broadcast('评论失败！');
                })
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
    function changComment(dataindex,obj){
        var num=parseInt(dataindex)-1;
        var result=JSON.parse(getSessionStrorage('res'));
        result.list[num].commentlist.push(obj);
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


    //出口
    return {
        init:init,
        assistant:assistant,
        defineMyArticle:defineMyArticle,
        defineMessageB:defineMessageB
    }
})