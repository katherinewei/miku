/**
 * 编辑收货地址页
 */
define('h5/js/page/editAddress', [
    'jquery',
    'h5/js/common',
    'h5/js/widget/page'
], function($, Global, Page) {

    var Data = Global.Data;
        Template = Global.Template;

    var S = new Page({
        element: $('#editAddressPage'),
        checkInWxp: true,
        checkUserInfo : true,
        bar: 'user-bar',
        title: '编辑地址',
        events: {
            'tap .button.submit': function(event) {
                event.preventDefault();
                setTimeout(function(){
                    S.submit($(event.currentTarget));
                },100);
            },
            'tap .community-row': function(event) {
                event.preventDefault();
                S.selectCommunity($(event.currentTarget));
                
            }
        }
    }).on('change:value', function(value) {
        if (value) {
            S.$('.community').text(
                value.receiver_state +
                value.receiverCity +
                value.receiverDistrict +
                value.communityName
            );
            S.$('.addr').val(value.receiverAddress).attr('initValue', value.receiverAddress);
            S.$('.name').val(value.receiverName).attr('initValue', value.receiverName);
            S.$('.mobile').val(value.receiverMobile).attr('initValue', value.receiverMobile);
            (!value.community) && S.$('.community').text('请选择区域');
            S.$('.form-items .changed').removeClass('changed');
        }
    }).on('change:userInfo', function(userInfo) {
        if (!Global.URL.param.aid) {
            //S.$('.name').val(userInfo.wxNick);
            S.$('.mobile').val(userInfo.mobile);
            S.$('.community').text('请选择区域');
            //S.$('.addr').val('');
            //S.$('.form-items .changed').removeClass('changed');
        }
    }).on('change:aid', function(aid) {
        if (aid) {
            S.set('mode', 'modfiy');
            Data.getConsignee(aid).done(function(result) {
                if (result && result.consignees && result.consignees.length) {
                    S.set('value', result.consignees[0]);
                }
            });
        }
    });

    S.selectCommunity = function() {
        var cityId = S.$('.city').data('value');
        S.$('input').blur();
        require('h5/js/page/community', function(pageInit) {
            var page = pageInit();
            page.on('change:value', function(value) {
                var o = S.$('.community').text(value.province + value.city + value.district + value.name).addClass('changed');
                if(window.jQuery){
                    o.data('value', value);
                }else if(window.Zepto){
                    o.data('value', JSON.stringify(value));
                }
            }).show();
        });
        return S;
    };

    S.packAdd = function() {
        var community = S.$('.community'),
            addr = S.$('.addr'),
            name = S.$('.name'),
            mobile = S.$('.mobile'),
            data = {
                community: community.data('value'),
                addr: $.trim(addr.val()),
                name: $.trim(name.val()),
                m: $.trim(mobile.val()),
                mobile: $.trim(mobile.val())
            };

        if (!data.name) {
            bainx.broadcast('请输入收货人姓名！');
            return;
        }
        if(!Global.verify.mobile(data.m)){
            return;
        }

        if (!data.community) {
            bainx.broadcast('请选择区域！');
            return;
        }
        if (!data.addr) {
            bainx.broadcast('请输入详细地址！');
            return;
        }
        

        data.community.address = data.addr;

        var ret = {
            mobile: data.mobile,
            nick: data.name,
            addr: JSON.stringify(data.community)
        };
        if(data.community.gps){
            ret.adjust = true;
        }
        return ret;

    };

    S.packModfiy = function(){
        var community = S.$('.community'),
            addr = S.$('.addr'),
            name = S.$('.name'),
            mobile = S.$('.mobile'),
            data = {},
            commun = null;
        if(window.Zepto || name.hasClass('changed')){
            data.nick = $.trim(name.val());
            if (!data.nick) {
                bainx.broadcast('请输入姓名！');
                return;
            }
        }
        if(window.Zepto || mobile.hasClass('changed')){
            data.mobile = $.trim(mobile.val());
            if(!Global.verify.mobile(data.mobile)){
                return;
            }
        }
        if(community.hasClass('changed')){
            commun = community.data('value');
            if(!commun){
                bainx.broadcast('请选择区域！');
                return;
            }
        }
        if(window.Zepto || addr.hasClass('changed')){
            commun = commun || {};
            commun.address = $.trim(addr.val());
            if(!commun.address){
                bainx.broadcast('请输入详细地址！');
                return;
            }
        }
        if(commun){
            data.addr = JSON.stringify(commun);
            if(commun.gps){
                data.adjust = true;
            }
        }
        data.id = S.get('aid');
        return data;
    };

    S.submit = function(btn) {
        if (btn.hasClass('disable')) {
            return;
        }
        var mode = S.get('mode'),
            doneFn = function(result) {
                btn.removeClass('disable').text('保存');
                S.trigger('submit:success');
                S.hide().done(function() {
                    history.back();
                });
            },
            failFn = function() {
                btn.removeClass('disable').text('保存');
                S.trigger('submit:fail');
            },
            data;

        if(mode === 'modfiy'){

            if(window.jQuery && S.$('.form-items .changed').length === 0){
                //alert(S.$('.form-items .changed').length);
                return doneFn();
            }
            data = S.packModfiy();
        }else{
            data = S.packAdd();
        }
        if(!data){
            return;
        }
        btn.addClass('disable').text('保存中...');
        var pomi = mode === 'modfiy' ? Data.modfiyConsignee(data) : Data.addConsignee(data);
        pomi.done(doneFn).fail(failFn);
        return S;
    };

    S.refresh = function() {
        //var cid = Global.URL.param.cid;
        /*var value = S.get('value');
        if (!value) {
            Global.Data.getConsignee().done(function(result) {
                S.set('value', result);
            });
        }*/
        Global.Data.getUserInfo().done(function(res){
            S.set('userInfo', res);
        });
    };

    S.set('aid', Global.URL.param.aid);

    return S;

});
