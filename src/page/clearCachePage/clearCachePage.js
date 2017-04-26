/**
 * 清除缓存
 * Created by xiuxiu on 2016/5/10.
 */
require([
    'jquery'
], function($) {
    function init(){
        var len = localStorage.length;
        if(len > 0){
            for(var i = 0;i < len; i++){
                localStorage.removeItem(localStorage.key(0))
            }
        }
    }
    init();
})

