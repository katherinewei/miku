/**
 * 查看用户日志
 * Created by xiuxiu on 2016/11/25.
 */
define('h5/js/page/csadViewUserLog', [
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/common/nexter',
], function($,URL, Data,Nexter) {


    function viewUserLog() {
        var _wrap = $('#viewUserLog_Wrap');

        var data = [
            {
                read:0,
                txt:'未读',
                classN:'userLogUnread'

            },
            {
                read:1,
                txt:'已读',
                classN:'userLogRead'
            }
        ],liHtml=[],contentHtml=[],
            td = [
            {
                txt:'姓名',
            },
            {
                txt:'微信号',
            },
            {
                txt:'客户状态',
            },
            {
                txt:'微信昵称',
            },
            {
                txt:'头像',
            },
            {
                txt:'性别',
            },{
                txt:'地址',
            }, {
                txt:'登录时间',
            },
            {
                txt:'关联老师',
            }
            ],
        tpl1 = '<li data-read="{{read}}" class="{{active}} ">{{txt}}日志</li>',
            tpl2 = '<div class="userLogList {{classN}}" {{hide}}><div class="thead row">{{content}}{{select}}</div><ul class="list"></ul></div>',
            tpl3= '<dd  class="col">{{txt}}</dd>';
        $.each(data,function(i,navli){

            navli.active = i == 0 ? 'active' : '';
            navli.hide = i == 0 ? '' : 'style="display:none"';
            navli.select = i == 0 ? '<dd class="col checkBoxWrap"><div class="readUserLogBtn"> <label class="checkbox"></label><span>标为已读</span></div></dd>' : '';
            var tdHtml = [];
            $.each(td,function(j,tdT){
                tdHtml.push(bainx.tpl(tpl3,tdT));
            })
            navli.content = tdHtml.join('');
            liHtml.push(bainx.tpl(tpl1,navli));
            contentHtml.push(bainx.tpl(tpl2,navli));
        })


        _wrap.append('<div class="searchU"><ul class="logNav">'+liHtml.join('')+'</ul><div class="search-wrap"><div class="row search-box"><div class="icon-search search-submit"></div><div class="input-wrap"><input type="text" class="search-input" id="kwUlog" placeholder="搜索"></div></div></div></div> <div class="grid mainContent">'+contentHtml.join('')+'<ul id="searchContent"></ul></div>');
        getUserLog(0);
        bindEvent();
    }

    //获取用户日志
    function getUserLog(isRead,nicknameOrWxno){
        var _wrap = $('#viewUserLog_Wrap');
        var data =  {
            hasRelation: 2,
            isRead:isRead
        };
        var $ul = _wrap.find('.userLogUnread .list');
        if(isRead == 1){
            $ul = _wrap.find('.userLogRead .list');
        }
        if(nicknameOrWxno){
            $ul.hide();
            $ul = $('#searchContent');
        }
        if(nicknameOrWxno){
            data.nicknameOrWxno = nicknameOrWxno;
        }
         var  nexter = new Nexter({
            element: _wrap,  //主元素
            dataSource: Data.getWxqrcodeLoginLogVOList,//请求的接口数据
            enableScrollLoad: true,
            data:data,//传入参数
            scrollBodyContent:$ul,

            pageSize: 16//一页显示的数量
        }).load().on('load:success', function (res) {

             if(res.list.length == 0){
                 if( !nicknameOrWxno){
                     var txt = '';
                     if(isRead == 0){
                         txt = '未读';
                     }
                     $ul.html('暂无'+txt+'用户日志！').css({'font-size':'16px','text-align':'center','padding-top': '10%'});
                 }
                 else{
                     $ul.html('暂无该用户日志！').css({'font-size':'16px','text-align':'center'});

                 }
                 return false
             }
             //未读的提示数量
             if(isRead == 0){
                 if($('.viewUserLog').find('.badgegroup').length > 0){
                     $('.viewUserLog').find('.badgegroup').text(res.count);
                 }else{
                     $('.viewUserLog').append('<span class="badgegroup">'+res.count+'</span>');
                 }
             }

            var tpl = '<li class="row item" data-id="{{id}}"><!--<dd  class="col"><label class="checkbox"></label></dd>--><dd  class="col">{{userNickname}}</dd><dd  class="col">{{wxno}}</dd><dd  class="col state"> <img src="'+imgPath+'common/images/personalTailor/csad/{{state}}.png"/> </dd><dd  class="col ">{{nickname}}</dd><dd  class="col headPic"><img src="{{headimgurl}}"/> </dd><dd  class="col" >{{sex}}</dd><dd  class="col">{{addr}}</dd><dd  class="col time">{{lastUpdated}}</dd><dd  class="col">'+$("#login_user .curName").text()+'</dd><!--<dd  class="col"><span class="deleteUserLogBtn deleteUserLogItem"></span></dd>-->{{read}}</li>',
                html = [];

            $.each(res.list, function (i, item) {
                item.state = item.status == 0 ? 'icon_no_link' : 'icon_link';
                item.addr = item.province + '' + item.city;
                item.lastUpdated = bainx.formatDate('Y-m-d h:i', new Date(item.lastUpdated));
                item.read = isRead == 0 ? '<dd  class="col"><span class="readUserLogBtn"><label class="checkbox"></label><!--<span>标为已读</span>--></span></dd>':'';
                html.push(bainx.tpl(tpl, item));
            })
            if(this.get('pageIndex') == 0){
                $ul.html(html.join(''));
            }
             else{
                $ul.append(html.join(''));
            }

        })
    }

    //搜索
    function search(e){
        var kw = $.trim($('#kwUlog').val()),cur = $('.logNav li.active');
        if(kw == ""){
            $("#searchContent").hide().html("");
            var
                idx = cur.index();
            $('.userLogList .list').hide();
            $('.userLogList').eq(idx).find('.list').show();
            return false;
        }

        var isRead = cur.data('read');
        if(e.keyCode == 13 || !e ){
            $("#searchContent").show();
            getUserLog(isRead,kw);
        }

    }

    function bindEvent(){
        var _wrap = $('#viewUserLog_Wrap');
        _wrap
            .on('click','.logNav li',function(){
                var target = $(this),
                    idx = target.index(),
                    current = $('.userLogList').eq(idx);
                target.addClass('active').siblings().removeClass('active');

                current.show().siblings().hide();

                getUserLog(target.data('read'));

            })
            .on('keyup','#kwUlog',function(e){
                search(e);
            })

            .on('click','.readUserLogBtn span.btn',function(){
                var ids = [];
                $('.userLogUnread').find('.list').find('.checkbox.active').each(function(){
                    var parent = $(this).parents('li');
                    ids.push(parent.data('id'));
                })
                var len = ids.length;
                var data = {
                    ids:ids.join(',')
                }
                Data.readWxqrcodeLoginLog(data).done(function(){
                    $('.userLogUnread').find('.list').find('.checkbox.active').each(function(){
                        $(this).parents('li').remove();
                    });
                    var badge = $('.viewUserLog').find('.badgegroup'),size = parseInt(badge.text()) - len;
                    if(size == 0){
                        badge.remove();
                    }
                    else{
                        badge.text(size);
                    }


                   // parent.remove();
                    //$('.badgegroup').text();
                })
            })
            .on('click','.icon-search',function(){
                search();
            })
            .off('click', '.checkbox').on('click', '.checkbox', function (event) {
                var parent = $(this).parents('.userLogList');
                var $this = $(this);
                if($this.hasClass('active')){
                    $this.removeClass('active');

                    //判断是否全部都没选中
                    var allcheck=_wrap.find('.list').find('.checkbox.active');

                    if(allcheck.length == 0){
                        _wrap.find('.checkBoxWrap .readUserLogBtn span').removeClass('btn');
                        _wrap.find('.checkBoxWrap .readUserLogBtn label').removeClass('active');

                    }

                    if($this.parents('.row').hasClass('thead')) {        //全选'
                        parent.find('.checkbox').removeClass('active');
                        parent.find('.readUserLogBtn span').removeClass('btn');
                    }
                }
                else{
                    $this.addClass('active');
                    _wrap.find('.checkBoxWrap .readUserLogBtn span').addClass('btn');
                   // $this.next().addClass('btn');
                    if($this.parents('.row').hasClass('thead')) {        //全选'
                        parent.find('.checkbox').addClass('active');
                        parent.find('.readUserLogBtn span').addClass('btn');
                    }
                }
        })

    }
    return viewUserLog;
})
