/**
 *    地址管理
 */
require([
    'jquery', 
    'h5/js/common/data',
    'h5/js/common/transDialog',
    'h5/js/common/consigneeDialog'
], function($, Data, Dialog, ConsigneeDialog) {

    function init(){

        render();

    }
    function render(){

        new ConsigneeDialog({
            mode : 'edit',
            title : '收货地址管理',
            onSelectConsigneeHide : false
        }).show();

    }
    init();
});
        
