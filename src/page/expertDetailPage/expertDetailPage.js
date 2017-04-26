/**
 * 专家详情
 * Created by xiuxiu on 2016/4/22.
 */
require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common',
    'h5/js/common/nexter',
    'h5/js/common/data'
], function($, URL, Common,Nexter, Data) {

    var Page,
        emUserName = URL.param.emUserName,
        firstLoad = true;

    function init() {
        $('.waitting').hide()
        render();
    }

    function render() {
        var data = {
            emUserName:emUserName
        }

        Data.getCsadInfo(data).done(function(res){
            var tpl = '<div class="page-content" id="exp"><div class="top"><div class="photo"><img src="{{csadPicUrl}}"/></div><p class="namename">{{csadName}}</p><!--<div class="starWrap"><div class="star" style="width:{{star}}%"></div> </div><p class="brief">{{csadNoticeBoard}}</p><span class="consult">立即咨询</span>--> </div><div class="introduce"><dl><dd><h3 class="introduce_icon">专家介绍</h3><p>{{csadIntroduce}}</p></dd><dd><h3 class="achieve_icon">成就</h3><p>{{csadAchievement}}</p></dd><dd><h3 class="skill_icon">擅长</h3><p>{{csadSpeciality}}</p></dd></dl></div> </div>',
                html=[];
            var item = res.vo;
            if(!item.csadPicUrl){
                item.csadPicUrl = imgPath + 'common/images/personalTailor/p_expert.png';
            }

            item.star = item.csadLevel * 10;

            html.push(bainx.tpl(tpl,item));
            $('body').append(html.join(''));

            $('body').on('tap','.consult',function(){
                URL.assign(location.href);
            })

        })

    }

    init()
})