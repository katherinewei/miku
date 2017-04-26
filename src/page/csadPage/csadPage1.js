/**
 * 专家端页面
 * Created by xiuxiu on 2016/7/5.
 */
require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/page/csadCommon2',
    'h5/js/page/csadDirectionCenter',
    'h5/js/page/csadChatMessagePage2',
    'h5/js/page/csadGroup2',
    'h5/js/page/csadSalesTrackingPage2',
    'h5/js/page/csadHoneymoonReturnPage2'
    //'h5/css/page/csadPage.css'
], function($,URL, Data,CsadCommon,CsadDirectionCenter,CsadChatMessagePage,CsadGroup,CsadSalesTrackingPage,CsadHoneymoonReturnPage)
{
    function init(){
        $('.waitting').hide();
        CsadCommon.layout();
        //Group();
        render();
    }

    function render(){
        var tpm=CsadDirectionCenter.csadDirectionCenterHtml();
        $('.wrap .wrapper').append('<div id="index_Wrap">'+tpm+'</div>');
        CsadDirectionCenter.initDirectionCenter();

        //CsadCallCenterPage();
        //CsadChatMessagePage();
        //CsadGroup();
        //CsadSalesTrackingPage();
        //CsadHoneymoonReturnPage();
        bindEvent();
    }

    function bindEvent(){
        $('body').on('click', '.leftNav li i', function(){
            handleNavList($(this).parent());
        })
        //点击隐藏菜单
        document.onclick = function ()
        {
            //oMenu.style.display = "none";
            //oMenu2.style.display = "none";
            $('.pop_rment,#rightMenu,#rightMenu2').hide();//用户标签
            $('.opareReply').addClass('hide');//快捷回复
        };
    }

    //点击导航
    function  handleNavList($this,_userId){
        $('#index_Wrap').addClass('hide');
        status = $this.data('status');
        source =  $this.data('source');
        var curPage = $this.attr('data-name'),
            outerW = $('#'+curPage+'_Wrap');
        console.log('#'+curPage+'_Wrap');
        if(outerW.children().length == 0){
            //聊天页面
            if(status == 1 && source==1) {
                CsadChatMessagePage();
                CsadCommon.getPageStatus($this);
                CsadCommon.buildStrangerDiv("momogrouplist", "momogrouplistUL");
                //获取快速回复句子
                CsadCommon.quickReplySentense();

            }
            //呼叫页面
            if(status == 0 ){
                var template = '<section class="row callInCenterC"><div class="accordion-inner" id="callCenter" style="display:none"><ul id="callCenterUL" class="chat03_content_ul"></ul></div><div id="noCallMsg">暂时没有用户呼叫！</div> </section> </section>'
                $('#callCenter_Wrap').append(template);
                CsadCommon.getPageStatus($this);//设置全局变量status && source //要加。。
                CsadCommon.buildStrangerDiv("callCenter","callCenterUL");
            }

            //管理列表
            if(status == 2 ){
                CsadGroup();
            }

            //销售
            if(status == 1 && source==2) {
                CsadSalesTrackingPage();
            }
            //回访
            if(status == 1 && source==3) {
                CsadHoneymoonReturnPage();
            }

        }
        CsadCommon.handleNav($this);
    }
    init();
})