/**
 * 获得页面//判断当前是哪个页面，获取当前最大的div来指定哪个div
 * Created by xiuxiu on 2016/10/19.
 */
define('h5/js/page/getCsadPage',[
    'jquery'
], function ($) {

    function getWrapper(){
        var status = $('.leftNav li.active').data('status'),
            source = $('.leftNav li.active').data('source');
        var wrapper = $('#index_Wrap');//首页
        if(status == 0){
            wrapper = $('#callCenter_Wrap');//呼叫中心
        }
        else if(status == 1){
            switch (source){
                case 1:
                    wrapper = $('#chatMessage_Wrap');//聊天列表
                    break;

            }
        }
        else{
            wrapper = $('#managementList_Wrap');//管理列表
        }
        return wrapper;
    }
    return getWrapper

})

