/**
 * 修改网页二维码
 * Created by xiuxiu on 2016/12/6.
 */
require([
    'gallery/jquery/2.1.1/jquery',
    'h5/js/common/data',
    'h5/js/common/url'
], function ($, Data,URL) {
    var website = ['my9g','is9l','nengliangliaofa','biod-hplc','li-dian','bjwanshou','bjshangcheng','beijingshangmao','shangmaojia','shangchengyizhan','120xianwt','86352836'],
        Web = [['ex','eq','es','em','qb','qb2','ey','ep','ek','ed','ew','bbs'],['gm','hxs','hxs2','jsl','qb','qb2','qbwd','gmj'],['qb2','gm','hxs','jsl'],['gm','hxs','jsl','hyq','hyq1','hyq2','yd','yww'],['ex','ep','eq'],['gm','hxs','jsl'],['ek','ey','ex','ep','hyq','hyq1','hyq2','bbs'],[],['gm','jsl','hxs'],[],['gm','hxs','jsl'],['ex','ek','ep','ey']];


    function init(){
        $('.waitting').hide();

        if(!pageConfig.pid){
            URL.assign(URL.loginPageCsad +'?refurl='+URL.websitePageWxnoPage);
            return
        }

        var basicMessage = '<div class="basicItemL "> <label class="{{class}}">{{label}}:</label><div class="rightCol">{{content}}</div> </div>',
            basicMessageHtml = [],
            tpls = [
                {
                    'label':'选择网站',
                    'name':'website',
                    'type':'select',
                    'value':'',
                    'option':website

                },
                {
                    'label':'选择网页',
                    'name':'Webpage',
                    'type':'select',
                    'value':'',
                    'option':Web[0]
                },
                //{
                //    'label':'修改微信号',
                //    'name':'value',
                //    'type':'text',
                //    'value':'',
                //},
                //{
                //    'label':'设置概率',
                //    'name':'value',
                //    'type':'text',
                //    'value':'',
                //},

            ]
        $.each(tpls,function(i,basicItem){

            switch (basicItem.type){

                case 'select':
                    var optionhtml =[];
                    $.each(basicItem.option,function(j,optionItem){

                        optionhtml.push('<option>'+optionItem+'</option>');
                    })
                    basicItem.content='<select class="'+basicItem.name+'">'+optionhtml.join('')+'</select>';
                    break;
                //default:
                //    basicItem.content='<input type="'+basicItem.type+'"  placeholder="如若需要多个用;隔开"  class="'+basicItem.name+' '+basicItem.class+'" name="'+basicItem.name+'" value="'+basicItem.value+'"/>';
                //    break;
            }
            basicMessageHtml.push(bainx.tpl(basicMessage,basicItem));
        })



        $('body').append('<div class="container">'+basicMessageHtml.join('')+'<table></table><div class="submit"><button class="addwxnoItem">添加</button></div></div>');
        getWxno();

        bindEvent();
    }

    //查询
    function getWxno(){
        var wsVal = $('.website').val(),
            wpVal = $('.Webpage').val(),
            data = {
            websiteName:wsVal,
            pageName:wsVal +'_'+wpVal,
        }
        Data.getWebsitePageWxnoList(data).done(function(res){
            //
            var list = res.list,
                html = '<tr><td>微信号</td><td>概率</td><td>操作</td></tr>';
            if(list && list.length > 0){
                $.each(list,function(i,item){
                    var wxno = item.wxno ? item.wxno : '请设置微信号',
                        probability =  item.probability ? item.probability : '请设置概率';
                    html += '<tr data-id="'+item.id+'" class="wxnoItem"><td class="canE"><span>'+wxno+'</span></td><td class="canE"><span>'+probability+'</span></td><td><span class="delete">删除</span></td></tr>'
                })
            }
            $('table').html(html);
        })
    }

    //
    function bindEvent(){
        $('body').on('change','.website',function(){
                var optionh = [];
                for(var i =0;i<website.length;i++){
                    if($(this).val() == website[i]){
                        $.each(Web[i],function(j,optionItem){
                            optionh.push('<option>'+optionItem+'</option>');
                        })
                        $('.Webpage').html(optionh.join(''));

                    }
                }
                //if($(this).val() == website[1]){
                //    $.each(Web[1],function(j,optionItem){
                //        optionh.push('<option>'+optionItem+'</option>');
                //    })
                //    $('.Webpage').html(optionh.join(''));
                //}
                getWxno();
            })
            .on('change','.Webpage',function(){
                getWxno();
            })
            .on('click','.delete',function(){
                var $thatP = $(this).parent().parent(),
                    data = {
                        ids:$thatP.data('id')
                    }
                Data.delWebsitePageWxnoById(data).done(function(res){
                    bainx.broadcast('删除成功！');
                    $thatP.remove();
                })
            })
            .on('click','.wxnoItem .canE span',function(){
                var $this = $(this), val =$this.text(),index = $this.parent().index(),cn='';
                if(index ==0){
                    cn = 'wxno_i';
                }
                if(index ==1){
                    cn = 'probability_i';
                }
                val = val.indexOf('请设置') > -1 ? '' : val;
                $this.parent().html('<input type="text" value="'+val+'" class="setIt '+ cn +'" autofocus/>');
                $('input').focus();

            })
            .on('blur','.setIt',function(e){
                e.stopPropagation();
                var $that = $(this),
                    $thatP = $that.parent().parent(),
                    wsVal = $('.website').val(),
                    wpVal = $('.Webpage').val(),
                    data = {
                        id:$thatP.data('id'),
                        websiteName:wsVal,
                        pageName:wsVal +'_'+wpVal
                    },
                    val  =  $that.val();
                if(!val){
                    return false;
                }


                if($that.hasClass('wxno_i')){
                    data.wxno = val;
                }
                else{
                    if(isNaN(val)){
                        bainx.broadcast('请输入数字！');
                        $that.val('').focus();

                        return
                    }
                    data.probability = val;
                }
                Data.createOrUpdateWebsitePageWxno(data).done(function(res){
                    bainx.broadcast('修改成功！');
                    var txt = '';
                    if($that.hasClass('wxno_i')){
                        txt = res.vo.wxno;
                    }
                    else{
                        txt = res.vo.probability;
                    }
                    $that.parent().html('<span>'+txt+'</span>');
                })
            })
            .on('click','.addwxnoItem',function(){
                var  wsVal = $('.website').val(),
                    wpVal = $('.Webpage').val(),
                    data = {
                        websiteName: wsVal,
                        pageName: wsVal + '_' + wpVal
                    }

                Data.createOrUpdateWebsitePageWxno(data).done(function(res){
                    bainx.broadcast('添加成功！');
                    var vo = res.vo;
                    $('table tr').last().after('<tr data-id="'+vo.id+'" class="wxnoItem"><td class="canE"><span>请设置微信号</span></td><td class="canE"><span>请设置概率</span></td><td><span class="delete">删除</span></td></tr>');
                })
            })
    }


    init();
})