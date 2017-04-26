/**
 * 个人信息管理
 * Created by xiuxiu on 2016/12/12.
 */
define('h5/js/page/csadSelfInformation',[
    'gallery/jquery/2.1.1/jquery',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/url',
    'h5/js/common/transDialog'
], function ($, Data, Common, URL,Dialog) {

    //var firstLoad;

    var selfInformation_Wrap,bindCsadDialog;

    function init(){
        selfInformation_Wrap = $('#selfInformation_Wrap');

        var data = [
                {
                    read:0,
                    txt:'个人信息管理',
                    classN:''

                },
                {
                    read:1,
                    txt:'绑定微信',
                    classN:'bindWXBtn'
                }
            ],liHtml=[],

            tpl1 = '<li data-read="{{read}}" class="{{active}} {{classN}}">{{txt}}</li>';


        $.each(data,function(i,navli){
            navli.active = i == 0 ? 'active' : '';
            liHtml.push(bainx.tpl(tpl1,navli));
        })


        selfInformation_Wrap.html('<div class="searchU"><ul class="logNav">'+liHtml.join('')+'</ul></div><section><!--<div class="searchGroup"><dl><dd><label >我的真实姓名：</label><input type="text" class="myName"/> </dd><dd><label >我的真实电话：</label><input type="text" class="myName"/> </dd><dd><input type="button" value="绑定微信" class="btn bindWXBtn" />--><!-- <input type="button" value="解绑微信" class="btn unbindWXBtn" /></dd></dl></div>--><div class="searchResult" ></div></section> ');

        //



        //获取数据
        getData();
        bindEvent();

        // }

        //表
        //

    }

    //getheader
    function getHeader(isGet,htmls){
        var td = [

                {
                    txt:'微信号'
                },

                {
                    txt:'昵称'
                },
                {
                    txt:'电话号码'
                },
                {
                    txt:'专家类型'
                },
            ],
            tpl3= '<dd  class="col">{{txt}}</dd>';

        if(!isGet){
            td.push({txt:'绑定人'});
        }

        var tdHtml = [];
        $.each(td,function(j,tdT){
            tdHtml.push(bainx.tpl(tpl3,tdT));
        })

        var txt = isGet ? '解绑' : '选择';
        var html = '<div class="detailTable grid"><dl class="thead row"><dd class="col checkBoxWrap"><div class="readUserLogBtn"> <!--<label class="checkbox checkAll"></label>--><span>'+txt+'</span></div></dd>'+tdHtml.join('')+'</dl><ul class="userList mainContent">'+htmls+'</ul></div>';
        return html;

    }


    //获取数据
    function getData(){
        //var data = {
        //
        //}
        //Data.sumTradeBoxPrice(data).done(function(res){

        selfInformation_Wrap = $('#selfInformation_Wrap');
        selfInformation_Wrap.find('.searchResult').html(getHeader(true,''));
            //数据
                //表
                //getTableList(data,0);
        var uidS = sessionStorage.getItem('currentExpert');
        uidS = JSON.parse(uidS);

        var data = {
            userId:uidS[2],
            status:1,
            sz:100
        }
        Data.getWxCsadInfoVOList(data).done(function(res) {
            getTableList(res);

        })

                //$('.boxList').scroll(function(){
                //    var _this=$(this);
                //    var viewH=_this.height(),
                //        contentH =_this.get(0).scrollHeight,
                //        scrollTop = _this.scrollTop();
                //    if(scrollTop + viewH == contentH){
                //        if(_this.attr('data-hasnext') == 'true'){
                //            var pg = parseInt(_this.attr('data-pg')) + 1;
                //            getTableList(data,pg)
                //        }
                //    }
                //});


           // }
           // else{
           //     $('#echatsContainer').html('<p>暂无数据</p>');
           //     $('.boxList').html('<li class="noData">暂无</li>');
           // }

      //  })
    }

    //获取表数据
    function getTableList(data){
        //data.sz=6;
        //data.pg=pg;
        //Data.getBoxTradeVOList(data).done(function(res){
        selfInformation_Wrap = $('#selfInformation_Wrap');
        var con = selfInformation_Wrap.find('.userList');
        if(data.list && data.list.length > 0) {
            var tpl = tplHt(),
                html = [];

            $.each(data.list, function (i, item) {
                html.push(bainx.tpl(tpl, item));
            })

            //if(pg == 0){
            //    con.html(html.join(''));
            //}
            //else{
            con.append(html.join(''));
            // }
            //con.attr({'data-hasnext':res.hasNext,'data-pg':pg})
            // })
        }
        else{
            con.append('<li class="noData">暂无</li>');
        }
    }



    //
    function bindEvent(){
        selfInformation_Wrap
            //选择操作
            .off('click', '.checkbox').on('click', '.checkbox', function (event) {
            var parent = $(this).parents('.detailTable');
            var $this = $(this);

                $this.toggleClass('active').parents('li').siblings().find('.checkbox').removeClass('active')
                //parent.find('.checkbox').removeClass('active');

                if($this.hasClass('active')){
                    parent.find('.readUserLogBtn span').text('解绑').addClass('btn');
                }
                else{
                    parent.find('.readUserLogBtn span').text('操作').removeClass('btn');
                }


            //if($this.hasClass('active')){
            //    $this.removeClass('active');
            //
            //    //判断是否全部都没选中
            //    var allcheck=selfInformation_Wrap.find('.userList').find('.checkbox.active');
            //
            //    if(allcheck.length == 0){
            //        selfInformation_Wrap.find('.checkBoxWrap .readUserLogBtn span').text('操作').removeClass('btn');
            //        selfInformation_Wrap.find('.checkBoxWrap .readUserLogBtn label').removeClass('active');
            //
            //    }
            //    if($this.parents('.row').hasClass('thead')) {        //全选'
            //        parent.find('.checkbox').removeClass('active');
            //        parent.find('.readUserLogBtn span').text('操作').removeClass('btn');
            //    }
            //}
            //else{
            //    // $this.next().addClass('btn');
            //    if($this.parents('.row').hasClass('thead')) {        //全选'
            //        parent.find('.checkbox').addClass('active');
            //        parent.find('.readUserLogBtn span').text('解绑').addClass('btn');
            //    }
            //    else{
            //        $this.addClass('active');
            //        selfInformation_Wrap.find('.checkBoxWrap .readUserLogBtn span').text('解绑').addClass('btn');
            //    }
            //}
        })
            //绑定专家
            .off('click', '.bindWXBtn').on('click', '.bindWXBtn', function (event) {
                //if($('#bindCasd').length == 0){
                //    $('body').append('<div id="bindCasd"><div class="" </div>');
                //}
            if (!bindCsadDialog) {
                var dataA = {
                    sz:150,
                    //status:0
                }
                Data.getWxCsadInfoVOList(dataA).done(function(res) {
                    var tpl = tplHt(true),
                        html = [];

                    $.each(res.list, function (i, item) {
                        item.disable = item.status == 1 ? 'disabled' : '';
                        html.push(bainx.tpl(tpl, item));
                    })
                    html = html.join('');

                    bindCsadDialog = new Dialog($.extend({}, Dialog.templates.top, {
                            template: '<div id="bindCasd"><div class="content_d"> <h1><span>微信号:<input type="text" placeholder="请输入微信号"  class="searchWXNO"/> </span><span>电话号码:<input class="searchTEL" type="text" placeholder="请输入电话号码"/> </span><button class="searchWxVOBtn">搜索</button></h1>'+getHeader(false,html)+'<div class="foot"><span class="btn submitB">绑定</span><span class="btn resetB">取消</span></div></div> </div> ',
                            events: {
                                'click .resetB': function (event) {
                                    event.preventDefault();
                                    bindCsadDialog.hide();
                                    $('#bindCasd').find('.searBindWXWrap').hide();
                                    $('#bindCasd').find('.userList').show();
                                },
                                'click .submitB': function (event) {
                                    event.preventDefault();
                                    bindWX(1);

                                },
                                'click .checkbox': function (event) {
                                    var $this = $(event.currentTarget);
                                    if(!$this.hasClass('disabled')) {
                                        var parent = $this.parents('.detailTable');
                                        $this.toggleClass('active').parents('li').siblings().find('.checkbox').removeClass('active')
                                    }
                                    else{
                                        bainx.broadcast('此微信已被绑定，需先解绑才能绑定');
                                    }

                                    //$this.toggleClass('active');
                                    //if($this.hasClass('checkAll')){
                                    //    if ($('.checkAll').hasClass('active')) {
                                    //        parent.find('.checkbox').addClass('active');
                                    //    }
                                    //    else {
                                    //        parent.find('.checkbox').removeClass('active');
                                    //    }
                                    //}
                                },
                                'keyup .searchWXNO':function(){
                                    if($('.searchWXNO').val().length ==0){
                                        $('#bindCasd').find('.userList').show();
                                        $('#bindCasd').find('.searBindWXWrap').hide();
                                    }

                                },
                                'click .searchWxVOBtn':function(){
                                    var data = {
                                        wxno:$('.searchWXNO').val(),
                                        mobile:$('.searchTEL').val()
                                    }
                                    Data.getWxCsadInfoVOList(data).done(function(resSear) {
                                        var tplSear = tplHt(true),
                                            htmlSear = [];

                                        $.each(resSear.list, function (i, itemSear) {
                                            itemSear.disable = itemSear.status == 1 ? 'disabled' : '';
                                            htmlSear.push(bainx.tpl(tplSear, itemSear));
                                        })
                                        htmlSear = htmlSear.join('');
                                        $('#bindCasd').find('.userList').hide();
                                        $('#bindCasd').find('.searBindWXWrap').show();
                                        if($('.searBindWXWrap').length >0){
                                            $('.searBindWXWrap').html(htmlSear);
                                        }
                                        else{
                                            $('#bindCasd').find('.userList').after('<div class="searBindWXWrap">'+htmlSear+'</div>');
                                        }

                                    })

                                }
                            }
                        }
                    ))
                    bindCsadDialog.show();
                })
            }
            else{
                bindCsadDialog.show();
                $('#bindCasd').find('input').val('');
            }

             })



        //解绑
            .off('click', '.checkBoxWrap .btn').on('click', '.checkBoxWrap .btn', function (event){
                    bindWX(0)
            })


        //添加个人信息



    }

    //
    function bindWX(status){
        var target;
        if(status == 1){
            target = $('#bindCasd').find('.active').parents('li');
        }
        else{
            target = $('.searchResult').find('.active').parents('li');
        }
        var id=target.data('id'),
            wxno = target.find('.wxno').text(),
            nickname = target.find('.nickname').text(),
            mobile = target.find('.mobile').text(),
            description = target.find('.description').text();

        var data = {
            id:id,
            status:status
        }
        Data.updateWxCasdDoOneDataInfoStatus(data).done(function(res){
            bainx.broadcast('操作成功！');
            if(status == 0){
                target.remove();
                var wrap = $('#selfInformation_Wrap');
                wrap.find('.checkBoxWrap span').text('操作').removeClass('btn');
                if(wrap.find('.userList').find('li').length == 0){
                    wrap.find('.userList').append('<li class="noData">暂无</li>');
                }

                //弹窗的绑定列表去掉绑定人
                if($('#bindCasd').length > 0){
                    $('#bindCasd').find('.userList').find('li').each(function(){
                       var $that = $(this);
                        if($that.find('.wxno').text() == wxno && $that.find('.disabled').length > 0){

                            $that.find('.checkbox').removeClass('disabled');
                            $that.find('.real_name').text('');
                        }
                    })
                }
            }
            else{
                var tpl = tplHt(),
                    list={
                        id:id,
                        wxName:nickname,
                        wxNo:wxno,
                        mobile:mobile,
                        description:description
                    },html=[];
                html.push(bainx.tpl(tpl,list));
                $('.searchResult').find('.userList').append(html.join(''));
                bindCsadDialog.hide();
                //setTimeout(function(){
                //    $('#bindCasd').remove();
                //    bindCsadDialog = null;
                //},1000)
                $('#selfInformation_Wrap').find('.noData').remove();

                target.find('.real_name').text(res.realName);
                target.find('.active').addClass('disabled').removeClass('active');
               // $('#bindCasd').find('.checkbox.active').parents('li').remove();
            }
        })
    }

    function tplHt(t){
        var dd='';
        if(t){
            dd = '<dd  class="col real_name">{{realName}}</dd> ';
        }
        var tpl = '<li class="row" data-id="{{id}}"><dd class="col"><span class="readUserLogBtn"><label class="checkbox {{disable}}"></label><!--<span>标为已读</span>--></span></dd><dd  class="col wxno">{{wxNo}}</dd><dd  class="col nickname" >{{wxName}}</dd><dd  class="col mobile">{{mobile}}</dd><dd  class="col description">{{description}}</dd>'+dd+'</li>';

        return tpl;
    }


    return init;
})

