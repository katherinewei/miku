/**
 * 问卷展示内容
 * Created by xiuxiu on 2016/9/10.
 */
define('h5/js/page/getDetectRecord',[
    'jquery',
    'h5/css/page/getDetectRecord.css'
],function($){

    var getDetectRecord = function(res){

        if(res){
            var data = {
                nickName:res.name ? res.name : '',
                sex:res.sex == 1 ? '男':'女',
                mobile:res.mobile ? res.mobile : '',
                birthday:res.birthday ? res.birthday : '',
                city:res.city ? res.city : '',
                expertDiagnose:res.expertDiagnose ? res.expertDiagnose : '',
                expertCheckfaceQuestion:res.expertCheckfaceQuestion ? res.expertCheckfaceQuestion : '',
                expertCheckbodyQuestion:res.expertCheckbodyQuestion ? res.expertCheckbodyQuestion : '',
                suggest : res.suggest ? res.suggest : ''
            };
            var baiscUm = [
                    {
                        label:'昵称',
                        answer:data.nickName
                    },{
                        label:'性别',
                        answer:data.sex
                    },{
                        label:'电话号码',
                        answer:data.mobile
                    },{
                        label:'生日',
                        answer:data.birthday
                    },{
                        label:'常居住地',
                        answer:data.city
                    }
                ],
                bTpl = '<p class="basicP">{{label}}：<span>{{answer}}</span></p>',
                bHtml = [];
            $.each(baiscUm,function(k,bItem){
                bHtml.push(bainx.tpl(bTpl,bItem));
            })
            var con  = [
                    {
                        title:'基本信息',
                        tpl:bHtml.join('')
                    },{
                        title:'专家确诊问题',
                        tpl:'<div class="texta">'+data.expertDiagnose+'</div>'
                    },{
                        title:'问题分析',
                        tpl:'<p class="qaP">1、面部</p><div class="texta">'+data.expertCheckfaceQuestion+'</div><p  class="qaP">2、生活建议</p><div class="texta">'+data.suggest+'</div>'
                    }],
                cTpl = '<dd><h4>{{title}}</h4><div class="condetail">{{tpl}}</div> </dd>',
                cHtml = [];
            $.each(con,function(i,cItem){
                cHtml.push(bainx.tpl(cTpl,cItem));
            })

            return '<div class="getDetectRecord">'+cHtml.join('') + '</div>';
        }
        else{
            return '<div class="noReport"><p>暂无分析报告</p></div>';
        }
    }
    return getDetectRecord
})
