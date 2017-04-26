/**
 * 匿名聊天
 * Created by xiuxiu on 2016/7/18.
 */
require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data'
], function($,URL, Data)
{
    function init(){
        $('.waitting').hide();
        Data.checkIsLogin().done(function(res){
            if(res.isLogin == 0){       //未登录
                var template = '<section class="row box chat container grid"><div class="chatMain wxChatMain"><div class="chatLogin"><div class="logo_text tc"><div class="logoBox d_ib clearfix"><div class="logoPic wxLogo"><img src="http://ninelab.b0.upaiyun.com/common/images/9LAB_pic@2x.png" alt="logo"></div></div></div><div class="inMsg"><div class="inBox tc"><p>为了更有效的沟通请选择你需要解决的问题</p><select name="inText d_ib" class="inText d_ib selectCheck" id="problem"></select><button class="inBtn">立即咨询</button></div></div></div></div></section>';

                $('body').append(template);
                //Data.TempRandomNumberCount().done(function(res) {
                //    $('.perNum').text(res.size);
                //})
                var optionsList=[
                    //{
                    //    id:0,
                    //    optionName: "抗衰"
                    //},{
                    //    id:1,
                    //    optionName: "祛斑"
                    //},{
                    //    id:2,
                    //    optionName: "祛痘"
                    //},{
                    //    id:3,
                    //    optionName: "舒敏"
                    //}
                    //,{
                    //    id:4,
                    //    optionName: "过敏肌"
                    //},{
                    //    id:5,
                    //    optionName: "混合肌"
                    //},{
                    //    id:6,
                    //    optionName: "痘痘肌"
                    //},{
                    //    id:7,
                    //    optionName: "抗衰老"
                    //},{
                    //    id:8,
                    //    optionName: "祛斑"
                    //},{
                    //    id:9,
                    //    optionName: "眼部特护"
                    //}
                ]

                Data.getExertSkilfulTypeList().done(function(res){
                    optionsList = res.list;
                    var $demand = localStorage.getItem('demandUser');
                    var html=[],
                        tem='<option value="{{name}}" {{select}} >{{name}}</option>';
                    $.each(optionsList,function(index,item){

                        // demand = JSON.parse(demand);
                        if($demand == item.id){
                            item.select = 'selected="selected"';
                        }
                        html.push(bainx.tpl(tem, item));
                    })
                    $('#problem').append(html.join(''));

                })
                bindEvent();
            }
            else{
                getOnlineCsad();
            }
        })

    }
    function bindEvent(){

        $('body').on('tap','.inBtn',function(){
            //获取在线专家
            var data = {skilfulType : $('#problem').val()};
            localStorage.setItem('demandUser',data.skilfulType);
            getOnlineCsad(data);
        })
    }
    function getOnlineCsad(data){
        Data.getExpertWxQrcodeUrl(data).done(function(res){
            if(res.expertWxQrcodeUrl){
                URL.assign(URL.expertWxQrcodePage + '?wxQrcodeUrl='+res.expertWxQrcodeUrl+'&firstLoginIN=true');
            }
            else{
                bainx.broadcast('暂时没有专家在线，请稍后咨询。');
            }
        })
    }
    init();
})

