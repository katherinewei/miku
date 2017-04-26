require([
    'jquery',
    'h5/js/common',
    'h5/js/common/data',
    'h5/js/common/url',
    'h5/js/common/nexter',
], function ($,Common,Data,URL,Nexter) {
    var userId=pageConfig.pid,more=false;
    function init(){
        render();

        //处理精选我的关注标识
        setSessionStrorage('typeflag',JSON.stringify('2'));
    }

    function render(){
        $('.waitting').hide();
        $('<section id="indexPage" class="page-content"><div class="header grid"><div class="row"><div class="face-img"><img src=""></div><div class="userInfoDiv fb far fvc"><p class="user-info">15521396116</p><!--<p class="level"></p>--></div><div class="col col-1 fb far fvc"><i class="right-icon iconfont"></i></div></div></div><div class="focusList grid"><ul></ul></div></section>').appendTo('body');

        var userCenterObj=JSON.parse(localStorage.getItem('userCenterObj')),
            focusList=JSON.parse(getSessionStrorage('focusList'));
        $('.face-img > img').attr('src',userCenterObj.headPic);
        $('.user-info').html(userCenterObj.nickName);


        $('#indexPage').scroll(function(){
            var _this=$(this);
            var viewH=_this.height(),
                contentH =_this.get(0).scrollHeight,
                scrollTop = _this.scrollTop();
            setSessionStrorage('scrollheight',JSON.stringify(scrollTop));
            if(-(viewH+scrollTop-contentH)<=50){
                var focusListhasNext=getSessionStrorage('focusListhasNext');
                if(getSessionStrorage("focusListhasNext")=="true"){
                    var number=parseInt(JSON.parse(getSessionStrorage('focusPg')))+1;
                    console.log(number)
                    comment(number);
                }

            }
        });


        //加载判断
        if(focusList){
            arrList(focusList);

            //
            $('#indexPage').scrollTop(JSON.parse(getSessionStrorage('scrollheight')));
        }else {
            comment(0);
        }

        //加载数据
        function comment(pg){
            var data={
                userId:userId,
                flag:0,
                pg:pg
            }
            if(more==true){
                return;
            }
            more=true;
            var element = $('.page-content'),
                focusPg=getSessionStrorage('focusPg');
                Data.personalFansIndexPageContent(data).done(function(res) {
                    arrList(res);

                    var focusList=JSON.parse(getSessionStrorage('focusList'));
                    if(focusList){
                        var listobj=focusList.list;
                        for(var i=0;i<res.list.length;i++){
                            listobj.push(res.list[i]);
                        }
                        res.list=listobj;
                    }
                    var focusPg=getSessionStrorage('focusPg');
                    if(focusPg){
                        setSessionStrorage('focusPg',JSON.stringify(parseInt(focusPg)+1));
                    }else {
                        setSessionStrorage('focusPg',0);
                    }
                    setSessionStrorage('focusListhasNext',JSON.stringify(res.hasNext));
                    setSessionStrorage('focusList',JSON.stringify(res));

                    more=false;
            });
        }

        sessionStorage.removeItem('res');
        sessionStorage.removeItem('pg');
        sessionStorage.removeItem('indexNum');
        sessionStorage.removeItem('hasNext');
        sessionStorage.removeItem('scrollheight');
    }

    //列表生成
    function arrList(res){
        var template='<li class="liList" href="'+URL.articleFocusListPage+'?type=1&myfollow=1&targetId={{id}}&name={{nickname}}"><div class="focusListBox row fvc""><div class="pic"><img src="{{profilePic}}"></div><div class="listCon"><p class="listName">{{nickname}}</p><p class="listTitle">《{{corp}}》</p></div></div></li>',
            html=[];
        if ($.isArray(res.list) && res.list.length) {
            $.each(res.list, function (index, item) {
                item.profilePic ? item.profilePic=item.profilePic : item.profilePic=URL.imgPath+'common/images/avatar-small.png';
                html.push(bainx.tpl(template,item));
            });
            $('.focusList ul').append(html.join(''));
        }else{
            var _html='<li class="notData"><img src="'+URL.imgPath+'common/images/loading_fail.png"/><p>没有数据哦！</p></li>';
            $('.focusList ul').append(_html);
        }

    }

    //保存sessionStorage
    function setSessionStrorage(key,val){
        sessionStorage.setItem(key,val);
    }

    //获取sessionStorage
    function getSessionStrorage(vKey){
        return sessionStorage.getItem(vKey);
    }

    init();
})