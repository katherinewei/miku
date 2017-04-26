/**
 * Created by xiuxiu on 2016/11/18.
 */
require([
    'gallery/jquery/2.1.1/jquery',
    'h5/js/common/url',
    'h5/js/common',
    'h5/js/common/data'
], function($, URL, Common, Data) {

    var Page,expertUserId = URL.param.expertUserId;

    function init(){
        if(expertUserId){     //编辑
            var data = {
                expertUserId:expertUserId
            }
            Data.getExpertInfo(data).done(function(res){
                Data.getExertSkilfulTypeList().done(function(resT){
                    res.list = resT.list;
                    mainInfo(res)
                })
            })
        }
        else{           //添加
            Data.getExertSkilfulTypeList().done(function(res){
                mainInfo(res)
            })
        }

    }

    //个人信息
    function mainInfo(data){
        var basicMessage = '<div class="basicItemL "> <label class="{{class}}">{{label}}:</label><div class="rightCol">{{content}}</div> </div>',
            basicMessageHtml = [],
            expertVO = data.expertVO ? data.expertVO : [],
            userVO = data.userVO ? data.userVO : [],

            tpls = [
                {
                    'label':'专家电话',
                    'name':'mobile',
                    'type':'tel',
                    'value':expertVO.csadTel ? expertVO.csadTel : '',
                    'class':expertUserId ? 'hide' : ''
                },
                {
                    'label':'微信号',
                    'name':'wxno',
                    'type':'text',
                    'value':userVO.wxno ? userVO.wxno : ''
                },
                {
                    'label':'真实名字',
                    'name':'realname',
                    'type':'text',
                    'value':userVO.realName  ? userVO.realName  : ''
                },
                {
                    'label':'密码',
                    'name':'hpswd',
                    'type':'password',
                    'value':'',
                    'class':expertUserId ? 'hide' : ''

                },
                {
                    'label':'确认密码',
                    'name':'hpswd2',
                    'type':'password',
                    'value':'',
                    'class':expertUserId ? 'hide' : ''
                },
                {
                    'label':'专家昵称',
                    'name':'nickname',
                    'type':'text',
                    'value':expertVO.csadName ? expertVO.csadName : ''
                },
                {
                    'label':'修改密码',
                    'name':'hpswd',
                    'type':'changePsw',
                    'class':expertUserId ? '' : 'hide'

                },
                {
                    'label':'专家头像',
                    'name':'headPicUrl',
                    'type':'file',
                    'value':userVO.profilePic ? userVO.profilePic : ''
                },
                {
                    'label':'微信二维码',
                    'name':'wxQrcodeUrl',
                    'type':'file',
                    'value':userVO.wxQrcodeUrl ? userVO.wxQrcodeUrl : ''
                },
                {
                    'label':'护肤类型',
                    'name':'expertSkilfulType',
                    'type':'select',
                    'option':data.list,
                    'value':expertVO.skilfulType ? expertVO.skilfulType : 1
                },
                {
                    'label':'专家公告',
                    'name':'csadNoticeBoard',
                    'type':'textarea',
                    'value':expertVO.csadNoticeBoard ? expertVO.csadNoticeBoard : ''
                },
                {
                    'label':'专家专长',
                    'name':'csadSpeciality',
                    'type':'textarea',
                    'value':expertVO.csadSpeciality ? expertVO.csadSpeciality : ''
                },
                {
                    'label':'专家成就 ',
                    'name':'csadAchievement',
                    'type':'textarea',
                    'value':expertVO.csadAchievement ? expertVO.csadAchievement : ''
                },
                {
                    'label':'专家介绍 ',
                    'name':'csadIntroduce',
                    'type':'textarea',
                    'value':expertVO.csadIntroduce ? expertVO.csadIntroduce : ''
                },
                //{
                //    'label':'短信验证码',
                //    'name':'checkNO',
                //    'type':'checkNO'
                //},
            ]
        $.each(tpls,function(i,basicItem){

            switch (basicItem.type){
                case 'file':
                    var tpl = '',hide = '';
                    if(basicItem.value){
                        tpl = '<dd class="active"><img src="'+ basicItem.value+'"  alt="" style="width: 60px;"><i class="deleteImg"></i></dd>';
                        hide = 'hide';
                    }

                    basicItem.content = '<form class="addPic" id="my_form'+i+'" enctype="multipart/form-data"><img class="addPicImg '+hide+'" src="'+imgPath+'common/images/personalTailor/pic_add.png"><input type="hidden" name="type" value="2"> <input type="file" class="file '+hide+'" name="file" multiple="multiple" >'+tpl+'</form>'
                    break;
                case 'select':
                    var optiontpl = '<option  value="{{id}}" {{select}} >{{name}}</option>',
                        optionhtml =[];
                    $.each(basicItem.option,function(j,optionItem){
                        if(optionItem.id == basicItem.value ){
                            optionItem.select = 'selected="selected"';
                        }
                        optionhtml.push(bainx.tpl(optiontpl,optionItem));
                    })
                    basicItem.content='<select class="'+basicItem.name+'">'+optionhtml.join('')+'</select>';
                    break;
                case 'checkNO':
                    basicItem.content='<input type="'+basicItem.type+'" class="'+basicItem.name+'" name="'+basicItem.name+'" /><span class="getCheckNO">获取验证码</span>';
                    break;
                case 'textarea':
                    basicItem.content='<textarea placeholder="请输入'+basicItem.label+'" class="'+basicItem.name+'" name="'+basicItem.name+'">'+basicItem.value+'</textarea>'
                    break;
                case 'changePsw':
                    basicItem.content = '<span class="changePsw '+basicItem.class+'">点此修改密码</span>';

                    break;
                default:

                    basicItem.content='<input type="'+basicItem.type+'"  placeholder="请输入'+basicItem.label+'"  class="'+basicItem.name+' '+basicItem.class+'" name="'+basicItem.name+'" value="'+basicItem.value+'"/>';
                    break;
            }
            basicMessageHtml.push(bainx.tpl(basicMessage,basicItem));
        })
        var subTpl = '注册';
        if(expertUserId){
            subTpl = '编辑';
        }
        Page = $('body').append('<div class="container"> '+basicMessageHtml.join('')+'<div class="submit"><button>'+subTpl+'</button></div></div>');

        bindEnvent()
    }

    function bindEnvent(){
        $('body')
            .on('click', 'input', function (event) {
                if (event && event.preventDefault) {
                    window.event.returnValue = true;
                }
            })
        Page.on('change','.addPic .file',function(event){
            $('.waitting').show();
            var formId = '#'+$(this).parent().attr('id');
            Common.uploadImages(event,formId, URL.upYunUploadPics).done(function(res) {
                upLoadPicCallback(res,formId);
                $(formId).find('.file').hide();
            }).fail(function() {
                $(this).val('');
                bainx.broadcast('上传图片失败！');
            });
        })
        .on('click','.changePsw',function(e){
            if($('.bgfixed').length == 0){
                $('body').append('<div class="bgfixed"> <div class="changePswContent"><div class="basicItemL "> <label class="">原密码:</label><div class="rightCol"><input type="password" placeholder="请输入原密码" class="orginPsw" name="orginPsw" ></div> </div><div class="basicItemL "> <label class="">新密码:</label><div class="rightCol"><input type="password" placeholder="请输入新密码" class="newPsw" name="newPsw" ></div> </div><div class="submitPsw"><button>确定</button></div><i class="closeBtn">×</i></div></div>');
            }
            else{
                $('.bgfixed').show().find('input').val('');
            }

        })
        .on('click','.closeBtn',function(e){
            $('.bgfixed').hide()
        })
        .on('click','.submitPsw button',function(e){

            require('plugin/jsencrypt/2.3.1/jsencrypt', function(JSEncrypt) {

                //RSA.setMaxDigits(130);          //长度为1024是130  2048 是260
                //var key = new RSA.RSAKeyPair("65537", "", "937AF0D334A5B437D18EE148468452E3095FFD24258A82F910498B3506B477024FF3F87BE8DE3231EEE670F214C1E299EE9E0BCA8EEE62C7D20631FD0CE89E77B69899D6B19987A1C43C176C51E6EE01E2869604A47F6C2A6EDAF167A1A2B7D0B26EF98100CDF8AB3142ADA8D129605C00A1EAD5B1E42D0FC6453D440DE9ADD7");
                //var passwordRSA = RSA.encryptedString(key,  $.trim($('.orginPsw').val()));
                //var passwordRSA2 = RSA.encryptedString(key, $.trim($('.newPsw').val()));

                var encrypt = new JSEncrypt();
                var publicK = '-----BEGIN PUBLIC KEY-----\n'+
                'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCTevDTNKW0N9GO4UhGhFLjCV/9\n'+
                'JCWKgvkQSYs1BrR3Ak/z+Hvo3jIx7uZw8hTB4pnungvKju5ix9IGMf0M6J53tpiZ\n'+
                '1rGZh6HEPBdsUebuAeKGlgSkf2wqbtrxZ6Git9CybvmBAM34qzFCrajRKWBcAKHq\n'+
                '1bHkLQ/GRT1EDemt1wIDAQAB\n'+
                '-----END PUBLIC KEY-----';
                encrypt.setPublicKey(publicK);
                var orginPsw = encrypt.encrypt($.trim($('.orginPsw').val())),
                    newPsw = encrypt.encrypt($.trim($('.newPsw').val()));

                var data = {
                    hp:orginPsw,
                    nhp:newPsw,
                    mobile: $('.mobile').val()
                }
                Data.findPswd(data).done(function (res) {
                    bainx.broadcast('修改成功,请记住新密码。');
                    $('.bgfixed').hide();
                })
            })

        })
        .on('click','.deleteImg',function(e){
            var tarP =  $(this).parent();
               // data = {
               //     filePath:tarP.children('img').attr('src')
               // }
             //Data.upyunDeleteFile(data).done(function(res){
                bainx.broadcast('删除成功！');
                tarP.parent().find('.addPicImg,.file').show();
                tarP.remove();
            // })
        })
        .on('click','.submit button',function(e){
            e.preventDefault();
            var mobile = $('.mobile'),
                wxno = $('.wxno'),
                hpswd = $('.hpswd'),
                nickname = $('.nickname'),
                realname = $('.realname'),
                form5 = $('#my_form7'),
                form6 = $('#my_form8'),
                data = {
                mobile:$.trim(mobile.val()),
                wxno:$.trim(wxno.val()),
                //checkNum:$('.mobile').val(),
                nickname:$.trim(nickname.val()),
                realName:$.trim(realname.val()),

                headPicUrl:form5.find('.active img').attr('src'),
                wxQrcodeUrl:form6.find('.active img').attr('src'),
                expertSkilfulType:$.trim($('.expertSkilfulType').val()),
                csadNoticeBoard:$.trim($('.csadNoticeBoard').val()),
                csadSpeciality:$.trim($('.csadSpeciality').val()),
                csadAchievement:$.trim($('.csadAchievement').val()),
                csadIntroduce:$.trim($('.csadIntroduce').val()),
                checkNum:'1234'
            }

            if (!data.mobile) {
                bainx.broadcast(mobile.attr('placeholder'));
                return;
            } else if (!/^[\d]{11}$/gi.test(data.mobile)) {
                bainx.broadcast('请输入正确的手机号码！');
                return;
            }
            if (!data.wxno) {
                bainx.broadcast(wxno.attr('placeholder'));
                return;
            }

            if (!data.nickname) {
                bainx.broadcast(nickname.attr('placeholder'));
                return;
            }
            if (form5.find('.active').length == 0) {
                bainx.broadcast('请选择专家头像');
                return;
            }

            if (form6.find('.active').length == 0) {
                bainx.broadcast('请选择专家微信二维码');
                return;
            }
            if(expertUserId){
                data.userId = expertUserId;
                Data.updateExpertByExpert(data).done(function(){
                    bainx.broadcast('编辑成功！');
                })
            }
            else{
                data.hpswd=$.trim(hpswd.val());
                if(!data.hpswd ){
                    bainx.broadcast(hpswd.attr('placeholder'));
                    return;
                }
                if(data.hpswd != $('.hpswd2').val()){
                    bainx.broadcast('您输入的密码不一致,请重新输入!');
                    return;
                }
                Data.registExpertByExpert(data).done(function(){
                    bainx.broadcast('添加成功！');
                })
            }
        })
    }
//上传完图片之后的显示
    function upLoadPicCallback(res,$this){
        $(this).val('');
        $('.waitting').hide();

        var picUrls = res.result.picUrls,
            imgListUrl = [];
        picUrls = picUrls.split(';');
        $.each(picUrls,function(index,item){
            imgListUrl.push('<dd class="active"><img src="'+ item+'"  alt="" style="width: 60px;"><i class="deleteImg"></i></dd>');
        })
        imgListUrl = imgListUrl.join('');
        $($this).append(imgListUrl).find('.addPicImg').hide();
    }
    init();
})
