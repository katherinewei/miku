/**
 * 呼叫中心
 * Created by xiuxiu on 2016/7/18.
 */
define('h5/js/page/csadCallCenterPage',[
    'jquery'
], function($) {
    function init() {
        var template = '<section class="row callInCenterC"><div class="accordion-inner" id="callCenter" style="display:none"><ul id="callCenterUL" class="chat03_content_ul"></ul></div><div id="noCallMsg">暂时没有用户呼叫！</div> </section> </section>'

        $('#callCenter_Wrap').append(template);
    }
    return init
})