/**
 * 问卷调查
 * Created by xiuxiu on 2016/4/19.
 */
define('h5/js/page/csadQuestionnaireSurveyPage', [
    'gallery/jquery/2.1.1/jquery',
    'h5/js/common/url',
    'h5/js/common',
    'h5/js/common/data',
    //'plugin/addressData/1.0.0/addressData',
    //'http://cdn.bootcss.com/jquery-datetimepicker/2.5.4/build/jquery.datetimepicker.full.min',
    'h5/js/common/questionData',
    'h5/js/page/csadCreateMineBoxPage',
    'h5/js/page/imageMagnification',
    'h5/js/page/getDetectRecord'
    //'plugin/datetimepicker/2.5.4/datetimepicker'
    // 'h5/js/page/csadCommon',
], function($, URL, Common, Data,QuestionData,csadCreateMineBoxPage,imageMagnification,getDetectRecord) {

    var questionSurvey = function(_uidO,rid,userName,userTel,serviceId,isAnonymous,coopCode,isNotReg)
    {
        var container,questionTab;
        if($('.leftNav li.chatMessage').hasClass('active')){
            container = $('#chatMessage_Wrap').find('#csadUserMessageContainer_'+_uidO+' .containerQuestion');
            questionTab = $('#chatMessage_Wrap').find('#csadUserMessageContainer_'+_uidO+' .questionTab');
        }
        if($('.leftNav li.fillReportAndBox').hasClass('active')){
            container = $('#fillReportAndBox_Wrap').find('#csadUserMessageContainer_'+_uidO+' .containerQuestion');
            questionTab = $('#fillReportAndBox_Wrap').find('#csadUserMessageContainer_'+_uidO+' .questionTab');
        }
        if($('.leftNav li.payVisit').hasClass('active')){
            container = $('#payVisit_Wrap').find('#csadUserMessageContainer_'+_uidO+' .containerQuestion');
            questionTab = $('#payVisit_Wrap').find('#csadUserMessageContainer_'+_uidO+' .questionTab');
        }
        else{
            container = $('#csadUserMessageContainer_'+_uidO+' .containerQuestion');
            questionTab = $('#csadUserMessageContainer_'+_uidO+' .questionTab');
        }


        var Page,
            _flag = false,
            _status,
            hasNotCreateBox = true,
            canEdit = true,
            canSubmit = true,
            boxId,
            dataFlag = false,
            fileTpl = '<dd><div class="addPic"><form id="my_form" enctype="multipart/form-data"><img src="'+imgPath + 'common/images/personalTailor/pic_add.png"/><input type="hidden" name="type" value="1"/> <input type="file" class="file" name="file"  multiple="multiple"/></form></div>  </dd>';//上传图片

        var hasChangeDia = false,
            hasChangeface = false,
            hasChangebody = false;

        var cache = [];//回显问题的字段

        var _uid = _uidO;//用户id


        //textarea文本高度自适应
        $.fn.autoHeight = function(){

            this.each(function(){
                autoHeight(this);
                $(this).on('keyup', function(){
                    autoHeight(this);
                });
            });
        };
        function autoHeight(elem){
            elem.style.height = 'auto';
            elem.scrollTop = 0; //防抖动
            elem.style.height = elem.scrollHeight + 'px';
        }

        function init(){
            judgeStatus();
            bindEvents();
        }
        //布局
        function layout(data){
            var
                sleepTime = data && data.sleepTime ? data.sleepTime : '0',
                imgs = data && data.imgs ? data.imgs.split(';') : '',
                demand = data && data.demand ? data.demand : '',
                expertDiagnose = data && data.expertDiagnose ? data.expertDiagnose : '',
                question = initQuestion(),
                basicMessageTpl = getUserMessage(data),
                sovleQuestionTpl = wantSovleQuestion(demand,expertDiagnose),
                expertCheckfaceQuestion = data && data.expertCheckfaceQuestion ? data.expertCheckfaceQuestion : '',
                //expertCheckbodyQuestion = data && data.expertCheckbodyQuestion ? data.expertCheckbodyQuestion : '',
                suggest = data && data.suggest ? data.suggest : '',
                remark = data && data.remark ? data.remark : '',
                questionAnalysisTpl = questionAnalysis(imgs,expertCheckfaceQuestion,suggest,remark),
                dataArr = [
                    {
                        name:'基本信息',
                        content:basicMessageTpl,
                        className:'basicMessage'
                    //},{
                    //    name:'生活和身体状况',
                    //    content:question.htmlA,
                    //    className:'lifeAndBodyCondition'
                    },{
                        name:'肌肤状况/日常护理习惯',
                        content:question.htmlB,
                        className:'skinCondition'
                    },{
                        name:'目前最想解决的皮肤问题/确诊问题',
                        content:sovleQuestionTpl,
                        className:'wantToSolve'
                    },{
                        name:'问题分析（面部/生活建议）',
                        content:questionAnalysisTpl,
                        className:'questionAnalysis'
                    }
                ],
                tpl ='<div class="boxItem {{className}}"><div class="title">{{name}}</div><div class="contentItem grid">{{content}}</div></div>',
                html = [];
            $.each(dataArr,function(index,item){
                html.push(bainx.tpl(tpl,item));
            })

            container.append(html.join(''));
            //$('.basicMessage select').find('option[value='+ageGroup+']').attr("selected",true);
            container.find('.basicMessage select').find('option').each(function(){
                if($(this).val() == sleepTime){
                    $(this).attr("selected",true);
                }
            })

            //身高体重加单位
            container.find('.basicMessage input[name=height]').after('<span class="inputSpan">cm</span>');
            container.find('.basicMessage input[name=weight]').after('<span class="inputSpan">kg</span>');

            //肌肤类型
            if(container.find('.grade_warp').length == 0){
                skinTypeData();
            }

            container.find('textarea[autoHeight]').autoHeight();
            if(container.find('.sex.active').length == 0){
                container.find('.sex').eq(1).addClass('active');
            }
            if(container.find('.isMarry.active').length == 0){
                container.find('.isMarry').eq(0).addClass('active');
            }
        }
        //用户基本信息
        function getUserMessage(data){
            var _userName = userName ? userName : '',
                _height = '',
                _weight = '',
                birthday = '',
                mobile = '',
                city = '',
                sex,
                ageGroup='',
                sleepTime,
                wichatNum='',
                memo = '',
                isMarry;

            if(data){
                _userName = data && data.name  && data.name != 'null'  ? data.name :  userName ;
                _height = data.height ? data.height : '';
                _weight = data.weight ? data.weight : '';
                birthday = data.birthday ? data.birthday : '';
                mobile =  userTel && userTel != 'undefined' ? userTel : (data.mobile ? data.mobile : '');
                city = data.city ? data.city : '';
                sex = data.sex ?　data.sex　: '';
                ageGroup = data.ageGroup ?　data.ageGroup　: '';
                sleepTime = data.sleepTime;
                wichatNum = data.wichatNum ? data.wichatNum : '';
                isMarry = data.isMarray ? data.isMarray : '';
                memo = data.memo ? data.memo : '';

            }
            var basicMessage = '<div class="basicItemL {{className}}"> <label>{{label}}:</label>{{content}}</div>',
                basicMessageHtml = [],
                basic = [
                    {
                        label:'昵称',
                        type:'text',
                        name:'userName',
                        value:_userName
                    },
                    {
                        label:'微信号',
                        type:'text',
                        name:'wichatNum',
                        value:wichatNum,
                        className: isAnonymous ? ''　:'hide'
                    },
                    {
                        label:'性别',
                        type:'radio',
                        name:'sex',
                        option:[
                            {
                                value:'男',
                                id:1
                            },{
                                value:'女',
                                id:2
                            }
                        ],
                        value:sex
                    },
                    {
                        label:'身高',
                        type:'text',
                        name:'height',
                        value:_height
                    },
                    {
                        label:'体重',
                        type:'text',
                        name:'weight',
                        value:_weight
                    },

                    {
                        label:'年龄',
                        type:'text',
                        name:'age',
                        value:ageGroup
                    },
                    {
                        label:'电话号码',
                        type:'tel',
                        name:'tel',
                        value:mobile
                    },
                    {
                        label:'常居住地',
                        type:'text',
                        name:'address',
                        value:city
                    },
                    {
                        label:'睡眠时间',
                        type:'select',
                        name:'sleepTime',
                        option:[
                            {
                                value:'很好',
                                id:0
                            },{
                                value:'好',
                                id:1
                            },{
                                value:'一般',
                                id:2
                            },{
                                value:'差',
                                id:3
                            },{
                                value:'很差',
                                id:4
                            }
                        ],
                        value:sleepTime
                    },
                    {
                        label:'婚姻状况',
                        type:'radio',
                        name:'isMarry',
                        option:[
                            {
                                value:'已婚',
                                id:1
                            },{
                                value:'未婚',
                                id:0
                            }
                        ],
                        value:isMarry,
                        className: isAnonymous ? 'hide': ''
                    },{
                        label:'备注',
                        type:'text',
                        name:'memo',
                        value:memo
                    }
                ],
                _index = 0;

            $.each(basic,function(i,basicItem){
                //if (i % 2 == 0) {
                //    basicMessageHtml.push('<div class="row">');
                //}

                if(basicItem.type=='radio'){
                    var optiontpl = '<span  class="choice basicChoice {{name}} {{active}}" data-id="{{id}}"><i></i>{{value}}</span>',
                        optionhtml =[];
                    $.each(basicItem.option,function(j,optionItem){
                        optionItem.name = basicItem.name;
                        optionItem.active = basicItem.value == optionItem.id ? 'active' : '';
                        optionhtml.push(bainx.tpl(optiontpl,optionItem));
                    })
                    basicItem.content=optionhtml.join('');

                }
                else if(basicItem.type=='select'){
                    var optiontpl = '<option  class=" {{active}}" value="{{id}}" >{{value}}</option>',
                        optionhtml =[];
                    $.each(basicItem.option,function(j,optionItem){
                        optionItem.name = basicItem.name;
                        optionhtml.push(bainx.tpl(optiontpl,optionItem));
                    })
                    basicItem.content='<select class="'+basicItem.name+'">'+optionhtml.join('')+'</select>';
                }
                else
                {
                    basicItem.content='<input type="'+basicItem.type+'" class="'+basicItem.name+'" name="'+basicItem.name+'" value="'+basicItem.value+'"/>'
                }


                basicMessageHtml.push(bainx.tpl(basicMessage,basicItem));
                //if (i % 2 == 1) {
                //    basicMessageHtml.push('</div>');
                //}
                //_index = i;

            })
            //if (_index % 2 == 0) {
            //basicMessageHtml.push('</div>');
            //  }
            return basicMessageHtml.join('');
        }

        //想要解决的问题
        function  wantSovleQuestion(demand,expertDiagnose){
            var demandQ = initQuestion(),
                addQue =  addQuestionAnal("确诊问题","diagnosis",expertDiagnose);
            var Tpl = '<div class="textarea" class="demand">'+demandQ.htmlC+'<p>13、确诊问题</p>'+addQue+'</div>';
            return Tpl
        }


        //添加问题
        function addQuestionAnal(txt,className,expertDiagnose){
            var txta = expertDiagnose ? '<textarea class="'+className+'" autoHeight="true">'+expertDiagnose+'</textarea>' : '',
                style = expertDiagnose ? 'style="line-height:36px"' : '',
                txt = canEdit ? '<p  class="addQues '+className+'Btn" '+style+'>＋添加'+txt+'</p>' : '';
            return '<div class="addQuestionAanalysis">'+txta+txt+'</div>';
        }

        //问题分析
        function questionAnalysis(list,expertCheckfaceQuestion,suggest,remark){
            var imgList = '';
            if(list){
                var tplHtml = [];
                $.each(list,function(index,item){
                    tplHtml.push('<dd  class="active"><img src="'+ item+'" /><i class="deleteImg"></i></dd>');
                })
                imgList = tplHtml.join('');
            }
            var addQueFace = addQuestionAnal("面部问题分析","expertCheckfaceQuestion",expertCheckfaceQuestion);
            //var addQueBody = addQuestionAnal("身体问题分析","expertCheckbodyQuestion",expertCheckbodyQuestion);
            //var Tpl = '<div class="textarea" class="analysis"><p>11、专家面部问题分析</p>'+addQueFace+'<!--<p>12、专家身体问题分析</p>'+addQueBody+'--><p>13、备注</p><textarea class="expertremark">'+remark+'</textarea><dl>'+imgList+fileTpl+'</dl></div>';
            var Tpl = '<div class="textarea" class="analysis"><p>14、专家面部问题分析</p>'+addQueFace+'<p><div class="skinData"><p>15、肌肤类型</p><!--<span class="previewChart">预览雷达图</span>--><div class="skinType skinType1"></div><div class="skinType skinType2"></div></div>16、生活建议</p><textarea class="lifeSuggest">'+suggest+'</textarea><p><p>17、备注</p><textarea class="expertremark">'+remark+'</textarea><dl>'+imgList+fileTpl+'</dl></div>';
            return Tpl
        }
        //判断用户答到哪一步
        function judgeStatus(){
            var data;

            if(isNotReg){       //未注册用户
                data = {
                    unionId: _uid
                }
                Data.getMineTempQuestionRecordInfo(data).done(function(res){
                    appendToMain(res,true);
                })
                return
            }
            if(isAnonymous){        //匿名用户
                 data = {
                    sessionId: _uid
                }
                Data.tempfinalUserData(data).done(function(res){
                    appendToMain(res,true);
                })
                return
            }




            if(rid){        //报告id
                canEdit = false;
                 data = {
                    dId : rid
                }
                Data.getDetectRecordDetail(data).done(function(res){
                    appendToMain(res,false);
                })
            }
            if(_uid){       //用户id
                 data = {
                    userId : _uid
                }
                Data.getLastUserDetectDataByUserId(data).done(function(res){
                    boxId = res.boxId ;
                    appendToMain(res,true);

                })
            }



        }

        //查询到数据之后的操作
        function appendToMain(res,restart){
            _status = res.flag;//flag=0没有答过题,需要用户或者专家进行重新答题  flag=1 单单用户的插入基本信息  flag=2 专家进行帮填的操作 flag=3 专家问诊的操作
            var data = res.data  ? res.data : '', dataCache;

            if(_status == 4 ){
                dataFlag = true;  //状态为4
            }

            layout(data); //list==素颜照的src

            hasNotCreateBox = (!boxId) ?  false : true;

            if(!restart){   //去生成盒子，不可编辑
                container.find('input,textarea').attr('readonly','readonly');
                container.find('select').attr('disabled','disabled');
                //$('.containerQuestion input,.containerQuestion textarea').attr('readonly','readonly');
                container.find('.deleteImg').hide();
                canEdit = false;
            }
            if(data) {
                dataCache = data.cache;
                container.attr('data-id', data.id)
                var skinCondition = data.skinCondition ? data.skinCondition.split('&') : '',
                    lifeAndBodyCondition = data.lifeAndBodyCondition ? data.lifeAndBodyCondition.split('&') : '',
                    demand= data.demand ? data.demand.split(';') : '',
                    skinCauseData= data.skinCauseData ? data.skinCauseData.split(',') : '',
                    skinTypeData= data.skinTypeData ? data.skinTypeData.split(',') : '';
                if (!canEdit) {
                    //container.find('.lifeAndBodyCondition').find('dd').addClass('hide');
                    //container.find('.skinCondition').find('dd').addClass('hide');
                    container.find('.addPic,dd').addClass('hide');
                }
                if (lifeAndBodyCondition) {
                    $.each(lifeAndBodyCondition, function (i, itemList) {
                        var lifeAndBodyItem = itemList ? itemList.split(';') : '';
                        $.each(lifeAndBodyItem, function (j, item) {
                            container.find('.lifeAndBodyCondition').find('.question_item').eq(i).find('dd').each(function () {
                                if ($(this).data('id') == item) {
                                    $(this).attr('class', 'active');
                                }
                            })
                        })
                    })
                }
                if (skinCondition) {
                    $.each(skinCondition, function (i, itemList) {
                        var z = skinCondition.length == 3 ? i+1 : i;


                        // if (skinCondition.length > (i + 1)) {
                        var skinConditionItem = itemList ? itemList.split(';') : '';
                        $.each(skinConditionItem, function (j, item) {

                            container.find('.skinCondition').find('.question_item').eq(z).find('dd').each(function () {
                                if ($(this).data('id') == item) {
                                    $(this).attr('class', 'active');
                                }
                            })
                        })
                        // }


                    })
                    //var tableData = skinCondition[3];
                    //tableData = tableData.split(';');
                    //container.find('table').find('.td').each(function (i) {
                    //    if (tableData[i] == '无') {
                    //        tableData[i] = '';
                    //    }
                    //    var targetInput = $(this).find('input'),
                    //        targetSpan = $(this).find('span');
                    //    targetInput.val(tableData[i]);
                    //    targetSpan.addClass(tableData[i]);
                    //})
                }
                if (demand) {
                    $.each(demand, function (j, item) {
                        container.find('.wantToSolve').find('dd').each(function () {
                            if ($(this).data('id') == item) {
                                $(this).attr('class', 'active');
                            }
                        })
                    })
                }
                var left = 0;
                if(skinTypeData){
                    $.each(skinTypeData,function(i,item){
                        container.find('#title'+i).text(item);
                        left = 99 * (parseFloat(item) - 1) * 2;
                        container.find('#btn'+i).css('left',left);
                        container.find('#bar'+i + ' div').css('width',left);
                    })
                }
                if(skinCauseData){
                    $.each(skinCauseData,function(i,item){
                        var l = i+10;
                        container.find('#title'+l).text(item);
                        left = 99 * (parseFloat(item) - 1) * 2;
                        container.find('#btn'+l).css('left',left);
                        container.find('#bar'+l + ' div').css('width',left);
                    })
                }
                container.find('.checkName').val(data.checkName ? data.checkName : '');
                var checkValue =  $('.checkValue')[0];
                for(var i=0; i<checkValue.options.length; i++){
                    if(checkValue.options[i].value == data.checkValue){
                        checkValue.options[i].selected = true;
                        break;
                    }
                }
            }
            if(canEdit){
               // var txt = '预览/发送';
               // if(isNotReg){
                  //  txt = '预览'
               // }
                var hide = '';
                if(boxId){
                    hide = 'style="display: none"';
                }
                container.append('<div class="footer grid questionTool"><div class=""><!--<span class="viewBtn col">预览</span> <span class="draftBtn col">保存</span><span '+hide+' class="submitBtn col ">生成盒子 </span>--><span class="submitBtnBox  ">下一步 </span></div></div>');
                //$('.questionTool').width(container.width());

               // if(isAnonymous){
                    //container.find('.submitBtn').hide();
               // }
                if(data){
                    cache = dataCache ? dataCache.split('%') : [];
                }
                //字典
                for(var i =1;i<3;i++){
                    diagnosisLayout(i,false, cache[i-1]);
                }
            }
            //================上传的实现
            //===================拖拽上传
            var box = container[0]; //拖拽区域
            box.addEventListener("drop",function(e){
                e.preventDefault(); //取消默认浏览器拖拽效果
                var fileList = e.dataTransfer.files; //获取文件对象
                //检测是否是拖拽文件到页面的操作
                if(fileList.length == 0){
                    return false;
                }
                //检测文件是不是图片
                if(fileList[0].type.indexOf('image') === -1){
                    alert("您拖的不是图片！");
                    return false;
                }
                //拖拉图片到浏览器，可以实现预览功能
                var img = window.webkitURL.createObjectURL(fileList[0]);
                var filename = fileList[0].name; //图片名称
                var filesize = Math.floor((fileList[0].size)/1024);
                if(filesize>2048){
                    bainx.broadcast("上传大小不能超过2M.");
                    return false;
                }
                //上传
                console.log(fileList[0])
                var xhr = new XMLHttpRequest();
                xhr.open("post", URL.site + '/' + URL.upYunUploadPics, true);
                xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                var fd = new FormData();
                fd.append('file', fileList[0]);
                xhr.send(fd);
                //回调函数的返回值给XHR的回调函数对象
                xhr.onreadystatechange=callback;
                function callback(){
                    if(xhr.readyState==4){
                        if(xhr.status==200){
                            var responseText=xhr.responseText;
                            responseText = JSON.parse(responseText);
                            upLoadPicCallback(responseText.result.picUrls);
                        }
                    }
                }
            },false);


            //======================粘贴上传
            document.body.addEventListener('paste', function (event) {
                console.log(event)
                var isChrome = false;
                if ( event.clipboardData || event.originalEvent ) {
                    //not for ie11  某些chrome版本使用的是event.originalEvent
                    var clipboardData = (event.clipboardData || event.originalEvent.clipboardData);
                    if ( clipboardData.items ) {
                        // for chrome
                        var  items = clipboardData.items,
                            len = items.length,
                            blob = null;
                        isChrome = true;
                        //items.length比较有意思，初步判断是根据mime类型来的，即有几种mime类型，长度就是几（待验证）
                        //如果粘贴纯文本，那么len=1，如果粘贴网页图片，len=2, items[0].type = 'text/plain', items[1].type = 'image/*'
                        //如果使用截图工具粘贴图片，len=1, items[0].type = 'image/png'
                        //如果粘贴纯文本+HTML，len=2, items[0].type = 'text/plain', items[1].type = 'text/html'
                        // console.log('len:' + len);
                        // console.log(items[0]);
                        // console.log(items[1]);
                        // console.log( 'items[0] kind:', items[0].kind );
                        // console.log( 'items[0] MIME type:', items[0].type );
                        // console.log( 'items[1] kind:', items[1].kind );
                        // console.log( 'items[1] MIME type:', items[1].type );

                        //阻止默认行为即不让剪贴板内容在div中显示出来
                       // event.preventDefault();

                        //在items里找粘贴的image,据上面分析,需要循环
                        for (var i = 0; i < len; i++) {
                            if (items[i].type.indexOf("image") !== -1) {
                                // console.log(items[i]);
                                // console.log( typeof (items[i]));

                                //getAsFile() 此方法只是living standard firefox ie11 并不支持
                                blob = items[i].getAsFile();
                               // console.log(blob);
                                //uploadImgFromPaste(blob, 'paste', isChrome);
                            }
                        }
                        if ( blob !== null ) {
                            var reader = new FileReader();
                            reader.onload = function (event) {
                                // event.target.result 即为图片的Base64编码字符串
                                var base64_str = event.target.result
                                //可以在这里写上传逻辑 直接将base64编码的字符串上传（可以尝试传入blob对象，看看后台程序能否解析）
                                uploadImgFromPaste(base64_str, 'paste', isChrome);
                            }
                            reader.readAsDataURL(blob);
                        }
                    }
                    else {
                        //for firefox
                        setTimeout(function () {
                            //设置setTimeout的原因是为了保证图片先插入到div里，然后去获取值
                            var imgList = document.querySelectorAll('#tar_box img'),
                                len = imgList.length,
                                src_str = '',
                                i;
                            for ( i = 0; i < len; i ++ ) {
                                if ( imgList[i].className !== 'my_img' ) {
                                    //如果是截图那么src_str就是base64 如果是复制的其他网页图片那么src_str就是此图片在别人服务器的地址
                                    src_str = imgList[i].src;
                                }
                            }
                            uploadImgFromPaste(src_str, 'paste', isChrome);
                        }, 1);
                    }
                }
                else {
                    //for ie11
                    setTimeout(function () {
                        var imgList = document.querySelectorAll('#tar_box img'),
                            len = imgList.length,
                            src_str = '',
                            i;
                        for ( i = 0; i < len; i ++ ) {
                            if ( imgList[i].className !== 'my_img' ) {
                                src_str = imgList[i].src;
                            }
                        }
                        uploadImgFromPaste(src_str, 'paste', isChrome);
                    }, 1);
                }
            })

            function uploadImgFromPaste (file) {
                var data = {
                    data:file.replace('data:image/png;base64,',''),
                    type:6
                }
                $('.waitting').show();
                Data.upyunBlobDogetpatImgpath(data).done(function(res){
                    upLoadPicCallback(res.picUrl);
                })
            }
        }

        //上传完图片之后的显示
        function upLoadPicCallback(picUrl){
            $(this).val('');
            $('.waitting').hide();
            var addPic = container.find('.addPic').parent('dd');
            var picUrls = picUrl,
                imgListUrl = [];
            picUrls = picUrls.split(';');
            $.each(picUrls,function(index,item){
                imgListUrl.push('<dd class="active"><img src="'+ item+'"  alt=""><i class="deleteImg"></i></dd>');
            })
            imgListUrl = imgListUrl.join('');
            addPic.before(imgListUrl);
        }

        //提交问题
        function submitQuestion(isdraft,target){

            var flag =  3,
                lifeAndBodyCondition = [],
                skinCondition = [],
                demand = [],
                imgs = [],
            // demand = $('.demand').val(),
                expertDiagnose = container.find('.diagnosis').val(),
                expertCheckfaceQuestion = container.find('.expertCheckfaceQuestion').val(),
                suggest = container.find('.lifeSuggest').val(),
                //expertCheckbodyQuestion = container.find('.expertCheckbodyQuestion').val(),
                remark= container.find('.expertremark').val();
            //生活和身体状况
            container.find('.lifeAndBodyCondition .question_item').each(function(){
                var quetionA = [];
                $(this).find('.active').each(function(){
                    quetionA.push($(this).data('id'));
                })
                quetionA = quetionA.join(';');
                lifeAndBodyCondition.push(quetionA);
            })
            lifeAndBodyCondition = lifeAndBodyCondition.join('&');

            //肌肤状况,日常护理习惯
            container.find('.skinCondition .question_item').each(function(){
                var quetionB = [],colAll = [];
                $(this).find('.active').each(function(){
                    quetionB.push($(this).data('id'));
                })
                quetionB = quetionB.join(';');

                skinCondition.push(quetionB);

            })
            skinCondition = skinCondition.join('&');

            //需求问题
            //container.find('.wantToSolve dd').each(function(){
            container.find('.wantToSolve').find('.active').each(function(){
                demand.push($(this).data('id'));
            })
            demand = demand.join(';');
            // })


            //肌肤类型
            if(!$.trim($('.checkName').val())){
                bainx.broadcast('请填写所属肌肤类型');
                canSubmit = true;
                return false;
            }


            //素颜照
            container.find('.questionAnalysis dd.active').each(function(){
                imgs.push($(this).find('img').attr('src'));
            })
            imgs = imgs.join(';');

            //var dpIdval = dataFlag ?  (hasNotCreateBox ? container.attr('data-id') : 0 ) : container.attr('data-id');
            //dpIdval = _status == 0 ? 0 : dpIdval;
            var dpIdval = boxId ? container.attr('data-id') : 0;


            //肌肤类型数据
            var skinTypeData = [],skinCauseData = [];
            container.find('.skinType1 .title').each(function(){
                skinTypeData.push($(this).text());
            })
            container.find('.skinType2 .title').each(function(){
                skinCauseData.push($(this).text());
            })

            userName = container.find('input[name=userName]').val();
            var dataOrgin = {
                flag:flag,

                dpId:dpIdval,
                name:userName,
                sex:container.find('.sex.active').data('id'),
                isMarry:container.find('.isMarry.active').data('id'),
                ageGroup:container.find('.basicMessage .age').val(),
                wichatNum:container.find('input[name=wichatNum]').val(),
                // isHaveHealproduct:container.find('.isHaveHealproduct.active').data('id'),
                birthday:container.find('input[name=birthday]').val(),
                mobile:container.find('input[name=tel]').val(),
                city:container.find('input[name=address]').val(),
                lifeAndBodyCondition:lifeAndBodyCondition,
                skinCondition:skinCondition,
                sleepTime:container.find('.basicMessage select.sleepTime').val(),
                imgs:imgs,
                demand:demand,
                expertDiagnose:expertDiagnose,
                expertCheckfaceQuestion:expertCheckfaceQuestion,
                suggest:suggest,
               // expertCheckbodyQuestion:expertCheckbodyQuestion,
                remark:remark,
                serviceId:serviceId,
                cache:cache.join('%'),
                skinTypeData:skinTypeData.join(','),
                skinCauseData:skinCauseData.join(','),
                height:container.find('input[name=height]').val(),
                weight:container.find('input[name=weight]').val(),
                memo:container.find('input[name=memo]').val(),
                checkName:container.find('.checkName').val(),
                checkValue:container.find('.checkValue').val(),

            },
           // console.log(cache.join('%'));
            data = {};
            for(var item in dataOrgin){
                if(dataOrgin[item]){
                    data[item]=dataOrgin[item];
                }
            }
            data.imgs = imgs;


                data.userId = _uid;
                Data.insertOneDetectQuestionData(data).done(function(res){
                    var _rid = res.data.id,_dateCreated = res.data.dateCreated;


                    container.attr('data-id',_rid);
                    canSubmit = true;
                    hasNotCreateBox = true;



                        var reportTime =res.data.dateCreated;
                    var W = $('.csadUserMessageContainer');
                        if(!boxId){
                            reportTime =res.data.dateCreated;
                            // var dedetectId = _rid,
                            var boxData={detectReportId:_rid}
                            if(coopCode){
                                boxData.coopCode = coopCode;
                            }
                            Data.createOrUpdateBox(boxData).done(function (resB) {
                                //if(!target.hasClass('sendBtn')){
                                    bainx.broadcast('保存成功！');
                               // }
                                boxId = resB.vo.id;


                                if(!isdraft){
                                    //container.find('.submitBtn').hide();


                                    W.find('.csadUserMsgTitle ul .questionTab').text('产品定制');
                                    W.find('.createBoxTab,.CreateBoxContainer').remove();
                                    container.addClass('hide');
                                    W.find('.csadUserMsgContent').append('<div class="presentList CreateBoxContainer "></div>');

                                    csadCreateMineBoxPage(_uidO,_rid,resB.vo.id,'','',true,userName,reportTime);

                                    $('.questionBtnG').removeClass('show');
                                    $('.createBoxBtnG').addClass('show');
                                }
                                else{
                                    bainx.broadcast('保存成功');
                                }
                            })
                        }
                        else{
                            if(!isdraft){
                                //container.find('.submitBtn').hide();
                                W.find('.csadUserMsgTitle ul .questionTab').text('产品定制');
                                W.find('.createBoxTab,.CreateBoxContainer').remove();
                                container.addClass('hide');
                                W.find('.csadUserMsgContent').append('<div class="presentList CreateBoxContainer "></div>');
                                csadCreateMineBoxPage(_uidO,_rid,boxId,'','',true,userName,reportTime);
                                $('.questionBtnG').removeClass('show');
                                $('.createBoxBtnG').addClass('show');
                            }
                            else{
                                bainx.broadcast('保存成功');
                            }

                        }

                }).fail(function(){
                    canSubmit = true;
                })
          //  }


        }

        //问题
        function initQuestion(){
            var template = '<div class="question_item" data-index="{{index}}"  data-question="{{id}}"><p class="title_q">{{index}}、{{questionName}}{{selectMore}}</p><p class="tips">{{questionDes}}</p><div class="answerBox" data-last="{{isend}}" ><dl data-answernum="{{optionsSelectableMaxnum}}" class="answerBoxDL">{{answerTPL}}</dl></div></div>',
                htmlA = [],
                htmlB = [],htmlC=[];
            $.each(QuestionData,function(i,item){
                var res =  item,
                    question = res.question,
                    option = res.optionsList,
                    answer = [];
                question.index = i+1;

                if(parseInt(question.optionsSelectableMaxnum) > 1){
                    question.selectMore = '(可多选)';
                    question.checkBox = 'checkBox';
                }
                if(option) {
                    $.each(option, function (Oindex, itemA) {


                        var  answerTPL = '<dd data-id="{{id}}" data-value="{{optionName}}"><span class="choice {{checkBox}}" ><i></i>{{optionName}}</span></dd>';
                        itemA.checkBox = question.checkBox;
                        answer.push((bainx.tpl(answerTPL, itemA)));
                    });
                    question.answerTPL = answer.join('');
                }
                if(res.questionType == 1){
                    htmlA.push(bainx.tpl(template, question));
                }
                if(res.questionType == 2){
                    htmlB.push(bainx.tpl(template, question));
                }
                if(res.questionType == 3){
                    htmlC.push(bainx.tpl(template, question));
                }


            })
            htmlA = htmlA.join('');
            htmlB = htmlB.join('');
            htmlC = htmlC.join('');


            return {
                htmlA:htmlA,
                htmlB:htmlB,
                htmlC:htmlC
            };
        }

        function bindEvents(){
            var textVal1,textVal2,textVal3;
            //阻止浏览器默认行。
            $(document).on({
                dragleave:function(e){		//拖离
                    e.preventDefault();
                },
                drop:function(e){			//拖后放
                    e.preventDefault();
                },
                dragenter:function(e){		//拖进
                    e.preventDefault();
                },
                dragover:function(e){		//拖来拖去
                    e.preventDefault();
                }
            });

            $('body')
                .off('click','input').on('click', 'input', function (event) {
                    if (event && event.preventDefault) {
                        window.event.returnValue = true;
                    }
                })


                .off('click','.closepreviewChart').on('click','.closepreviewChart',function(){
                    $('#previewChart').remove();
                })
                .off('click','.previewBtnIQue').on('click','.previewBtnIQue',function(){
                viewReport();
            })
                .off('click','.submitBtnBox,.saveQuetionI').on('click','.submitBtnBox,.saveQuetionI',function(){
                if(canSubmit){
                    canSubmit = false;
                    var isdraf = true;
                    if($(this).hasClass('submitBtnBox')){
                        isdraf = false;
                    }
                    submitQuestion(isdraf,$(this));
                }
            })
            container
                .off('click','.choice').on('click','.choice',function(){
                    if(canEdit){
                        var target = $(this).parents('dd'),
                            answerNum = parseInt(target.parent('dl').data('answernum'));
                        //console.log(target.parent('dl'))
                        if(answerNum > 1){
                            chooseRC(target,false,answerNum)
                        }else{
                            chooseRC(target,true)
                        }
                        if($(this).hasClass('basicChoice')){
                            $(this).addClass('active').siblings().removeClass('active');
                        }
                    }

                })
                .off('change','#my_form .file').on('change', '#my_form .file', function (event) {
                    $('.waitting').show();
                    Common.uploadImages(event,'#csadUserMessageContainer_'+_uidO+' #my_form', URL.upYunUploadPics).done(function(res) {
                        upLoadPicCallback(res.result.picUrls);
                    }).fail(function() {
                        $(this).val('');
                        bainx.broadcast('上传图片失败！');
                    });
                })
                .off('click','.deleteImg').on('click','.deleteImg',function(){
                    var tarP =  $(this).parent(),
                        data = {
                            filePath:tarP.children('img').attr('src')
                        }
                    // Data.upyunDeleteFile(data).done(function(res){
                    bainx.broadcast('删除成功！');
                    tarP.remove();
                    // })

                })
                .off('click','.table td span').on('click','.table td span',function(){
                    if(canEdit){
                        $(this).toggleClass('activeSpan');
                    }
                })

                .off('click','.img').on('click','img',function(){
                    imageMagnification.loadImg($(this));
                })

                .off('click','.resetBtn,.closeReportPreview').on('click','.resetBtn,.closeReportPreview',function(){
                    $('.reportPreview').remove();
                })
                .off('click','.addQues').on('click','.addQues',function(){
                    if($(this).hasClass('diagnosisBtn')){       //确诊问题
                        diagnosisLayout(1,true)
                    }
                    if($(this).hasClass('expertCheckfaceQuestionBtn')){
                        diagnosisLayout(2,true)
                    }
                    //if($(this).hasClass('expertCheckbodyQuestionBtn')){
                    //    diagnosisLayout(3,true)
                    //}

                })
                .off('click','.colseDictionary').on('click','.colseDictionary',function(){
                    $(this).parent().parent().hide();
                })
                //关联操作
                .off('click','.dictionaryContent li').on('click','.dictionaryContent li',function(){
                    container.find('.dictionaryContent li').removeClass('cur');
                    $(this).addClass('cur');
                    container.find('.addQue'+$(this).index()).removeClass('hide').siblings().addClass('hide');
                })
                .off('click','.checkBox').on('click','.checkBox',function(){
                    var target = $(this),
                        tarParent = target.parent();
                    target.toggleClass('selected');
                    //导航
                    if((!target.hasClass('selected')) && tarParent.hasClass('navLi')){
                        container.find('.addQue'+tarParent.index()).find('.selected').removeClass('selected');
                    }

                    if(!tarParent.hasClass('navLi')){
                        //第一格 &&   //内外因
                        var tarTable, tarParentTR;

                        if(tarParent.hasClass('partition') || tarParent.hasClass('causedt')){
                            if(tarParent.hasClass('partition')){
                                tarTable = tarParent.parent().parent().parent();
                                tarParentTR = tarParent.parent();
                            }
                            if(tarParent.hasClass('causedt')){
                                tarTable = tarParent.parent().parent().parent().parent().parent();
                                tarParentTR = tarParent.parent().parent().parent();
                            }
                            if(target.hasClass('selected')){
                                tarParent.next().find('.checkBox').addClass('selected');
                                if(tarParent.next().next().length > 0){
                                    tarParent.next().next().find('.checkBox').addClass('selected');
                                }
                            }
                            else{
                                tarParent.next().find('.selected').removeClass('selected');
                                if(tarParent.next().next().length > 0){
                                    tarParent.next().next().find('.selected').removeClass('selected');
                                }
                            }

                        }
                        if(tarParent.hasClass('subP') || tarParent.hasClass('subSpan')){
                            if(tarParent.hasClass('subP')){
                                tarParentTR = tarParent.parent().parent();
                            }
                            if(tarParent.hasClass('subSpan')) {
                                if(tarParent.parent().find('.selected').length == 0){
                                    tarParent.parent().prev().find('.checkBox').removeClass('selected');

                                }else{
                                    tarParent.parent().prev().find('.checkBox').addClass('selected');
                                }
                                tarParentTR = tarParent.parent().parent().parent().parent();
                            }
                            tarTable =  tarParentTR.parent().parent();
                        }
                        var tarContentUl = tarTable.parent().prev(),
                            i = tarTable.data('index'),
                            parti = tarParentTR.find('.partition').find('.checkBox'),
                            navli = tarContentUl.find('.navLi').eq(i).find('.checkBox');
                        if (tarParentTR.find('.express,.cause,.reason').find('.selected').length == 0) {
                            parti.removeClass('selected');
                        }
                        else {
                            if (!parti.hasClass('selected')) {
                                parti.addClass('selected');
                            }
                         }
                        if(tarTable.find('.selected').length == 0) {
                            navli.removeClass('selected');
                        }
                        else {
                            navli.addClass('selected');
                        }
                    }
                })
                //确诊 &确定操作
                .off('click','.submitDirBtn').on('click','.submitDirBtn',function(){
                    var $this = $(this);
                    hasChangeValue($this);

                })
                //textarea操作 高度
                .off('input','textarea').on('input','textarea',function(){
                   this.style.height = this.scrollHeight + 'px';
                })
                .off('focus','textarea').on('focus','textarea',function(){
                    var $this = $(this);
                    if($this.hasClass('diagnosis')){
                        textVal1 = $.trim($this.val());
                    }
                    if($this.hasClass('expertCheckfaceQuestion')){
                        textVal2 = $.trim($this.val());
                    }
                    //if($this.hasClass('expertCheckbodyQuestion')){
                    //    textVal3 = $.trim($this.val());
                    //}
                   // this.style.height = this.scrollHeight + 'px';
                })
                .off('blur','textarea').on('blur','textarea',function(){
                    var lastValue = $.trim($(this).val()),$this = $(this);
                    if($this.hasClass('diagnosis')){
                        if (textVal1 != lastValue && null != lastValue && "" != lastValue) {
                            hasChangeDia = true;
                        }
                    }
                    if($this.hasClass('expertCheckfaceQuestion')){
                        if (textVal2 != lastValue && null != lastValue && "" != lastValue) {
                            hasChangeface = true;
                        }
                    }
                    //if($this.hasClass('expertCheckbodyQuestion')){
                    //    if (textVal1 != lastValue && null != lastValue && "" != lastValue) {
                    //        hasChangebody = true;
                    //    }
                    //}
                })
                //.on('click','.previewChart',function(){
                //    $('body').append('<section class="telDialog wl-trans-dialog translate-viewport grid" id="previewChart" style="display: block;"><div class="previewChartContent row"><i class="closeBtn closepreviewChart"></i><div id="mainChart1"></div><div id="mainChart2"></div></div></section>');
                //    chartFn();
                //})



        }

        //判断文本框是否改变
        function hasChangeValue($this){
            if($this.hasClass('submitDirBtn1')){
                if(hasChangeDia && window.confirm('您已经修改了文本框的值，是否覆盖？')){
                    submitQuestionAnaliys($this);
                }
                if(!hasChangeDia){
                    submitQuestionAnaliys($this);
                }
            }
            if($this.hasClass('submitDirBtn2')){
                if(hasChangeface && window.confirm('您已经修改了文本框的值，是否覆盖？')){
                    submitQuestionAnaliys2($this);
                }
                if(!hasChangeface){
                    submitQuestionAnaliys2($this);
                }
            }
            //if($this.hasClass('submitDirBtn3')){
            //    if(hasChangebody && window.confirm('您已经修改了文本框的值，是否覆盖？')){
            //        submitQuestionAnaliys3($this);
            //    }
            //    if(!hasChangebody){
            //        submitQuestionAnaliys3($this);
            //    }
            //}

        }

        //确诊  &&&  问题
        function diagnosisLayout(dictionary,show,showData){
            //var obj;
            if(container.find('#dictionary'+dictionary).length == 0) {
                var show = show ? 'style="display: block;"' : '';
                container.append('<section class="telDialog wl-trans-dialog translate-viewport dictionary grid" id="dictionary'+dictionary+'" '+show+'><div class="dictionaryContent row"><i class="closeBtn colseDictionary"></i><ul class="col col-5"></ul><div class="dictionaryContentTable col col-15"></div> </div></section>');
                //showData = showData ? showData.split('%') : [];
                switch (dictionary){
                    case 1:

                        var ALlEasyDbDictionary = sessionStorage.getItem('ALlEasyDbDictionary');
                        ALlEasyDbDictionary =ALlEasyDbDictionary ? JSON.parse(ALlEasyDbDictionary) : '';
                        if(ALlEasyDbDictionary){
                            loopShow(dictionary,ALlEasyDbDictionary.list,showData);
                        }
                        else{
                            Data.getExpertALlEasyDbDiretory().done(function(res){
                                loopShow(dictionary,res.list,showData);
                                sessionStorage.setItem('ALlEasyDbDictionary',JSON.stringify(res));
                            })
                        }

                        break;
                    case 2:
                        var FaceDbDictionary = sessionStorage.getItem('FaceDbDictionary');
                        FaceDbDictionary = FaceDbDictionary ? JSON.parse(FaceDbDictionary) : '';
                        if(FaceDbDictionary){
                            loopShow(dictionary,FaceDbDictionary.data,showData);
                        }
                        else{
                            Data.getExpertFaceDbDiretory().done(function(res){
                                loopShow(dictionary,res.data,showData);
                                sessionStorage.setItem('FaceDbDictionary',JSON.stringify(res));
                            })
                        }

                        break;
                    case 3:
                        var BodyDbDictionary = sessionStorage.getItem('BodyDbDictionary');
                        BodyDbDictionary = BodyDbDictionary ? JSON.parse(BodyDbDictionary) : '';
                        if(BodyDbDictionary){
                            loopShow(dictionary,BodyDbDictionary.data,showData);
                        }
                        else {
                            Data.getExpertBodyDbDiretory().done(function (res) {
                                loopShow(dictionary, res.data,showData);
                                sessionStorage.setItem('BodyDbDictionary',JSON.stringify(res));
                            })
                        }
                        break;
                    default:
                        break;
                }
            }
            else{
                container.find('#dictionary'+dictionary).show();
            }
        }
        //共同相似的代码
        function loopShow(dictionary,resList,showData){
            var list = resList,
                navTpl = '<li data-index="{{i}}" class="navLi"><i class="checkBox"></i>{{name}}</li>',
                contentTpl = '<table class="addQue{{i}} hide"  data-index="{{i}}">{{trHtml}}</table>',
                liHtml = [],
                contentHtml = [],
                showData = showData ? showData.split('#') : [];
            $.each(list,function(index,item){
                item.i = index;
                liHtml.push(bainx.tpl(navTpl,item));
                var  trHtml = [],trTpl='';
                if(dictionary == 1){
                    trTpl = '<tr><td data-id="{{id}}" class="partition"><i class="checkBox {{selected}}"></i>{{name}}</td><td class="reason">{{reason}}</td></tr>';
                }
                else if(dictionary == 2){
                    trTpl = '<tr><td class="partition" data-id="{{id}}"><i class="checkBox {{selected}}"></i>{{partition}}</td><td class="express">{{expressH}}</td><td class="cause">{{causeH}}</td><td class="suggest">{{suggestH}}</td></tr>';
                }
                else{
                    trTpl = '<tr><td class="partition" data-id="{{id}}"><i class="checkBox {{selected}}"></i>{{partition}}</td><td class="express">{{expressH}}</td><td class="cause">{{causeH}}</td></tr>';
                }
                $.each(item.list,function(i,tdItem){

                    switch (dictionary){
                        case 1:
                            trHtml = DiagnosisItems(tdItem,trHtml,trTpl,i,showData);
                            break;
                        case 2:
                            trHtml = FaceItems(tdItem,trHtml,trTpl,i);
                            break;
                        //case 3:
                        //    trHtml = bodyItems(tdItem,trHtml,trTpl,i);
                        //    break;
                    }
                })
                item.trHtml = trHtml.join('');
                contentHtml.push(bainx.tpl(contentTpl,item));
            })
            container.find('#dictionary'+dictionary+' ul').append(liHtml.join('')+'<span class="submitDirBtn submitDirBtn'+dictionary+'">确定</span>');
            container.find('#dictionary'+dictionary+' .dictionaryContentTable').append(contentHtml.join(''));
            if(showData && showData.length > 0){
                var theFirst = showData[0] ? showData[0].split('&') : [];
                theFirst = theFirst && theFirst.length > 0 ? theFirst[0] : 0;
                $.each(showData,function(k,listItem){
                    var _item = listItem  ? listItem.split('&') : [];
                    if(_item && _item.length > 0){
                        container.find('#dictionary'+dictionary+' ul li').each(function(index){
                            if(_item[0] == index){
                                $(this).find('.checkBox').addClass('selected');
                            }
                        })

                        container.find('#dictionary'+dictionary+' table').each(function(i){
                            var $table = $(this);
                            if(_item[0] == $table.data('index')){
                                //  var obj = dictionary == 1 ?  '.reason' : '.express';
                                $table.find('.partition').each(function(){
                                    var $partition = $(this);
                                    var tdFirstA = _item[1] ?  _item[1].split(',') : [];
                                    if(tdFirstA && tdFirstA.length > 0) {
                                        $.each(tdFirstA, function (k, tdFirstAItem) {
                                            if (tdFirstAItem == $partition.data('id')) {
                                                $partition.find('.checkBox').addClass('selected');
                                                $partition.next().find('.subP').each(function () {
                                                    var $express = $(this);
                                                    var tdFirstB = _item[2] ?  _item[2].split(',') : [];
                                                    var ans = tdFirstB[k] && tdFirstB[k].length > 0 ? tdFirstB[k].split(';') : [];
                                                    if (ans && ans.length > 0) {
                                                        $.each(ans, function (j, ansItem) {
                                                            if (ansItem == $express.data('id')) {
                                                                $express.find('.checkBox').addClass('selected');
                                                            }
                                                        })
                                                    }
                                                })
                                                if (dictionary == 2) {
                                                    $partition.next().next().find('.causeD').each(function () {
                                                        var $cause = $(this);
                                                        var tdFirstC = _item[3].split(',');
                                                        var ans = tdFirstC[k] ? tdFirstC[k].split(';') : [];
                                                        if (ans && ans.length > 0) {
                                                            $.each(ans, function (j, ansItem) {
                                                                var ansD = ansItem.split('$');
                                                                if (ansD[0] == $cause.data('id')) {
                                                                    $cause.find('dt').find('.checkBox').addClass('selected');
                                                                    var ansDet = ansD[1] ? ansD[1].split('-') : [];
                                                                    // var dlParent = $(this).parent().parent();
                                                                    $.each(ansDet, function (m, ansDItem) {
                                                                        $cause.find('dd').find('.checkBox').each(function () {
                                                                            if (ansDItem == $(this).parent().data('id')) {
                                                                                $(this).addClass('selected');
                                                                            }
                                                                        })
                                                                    })
                                                                }
                                                            })
                                                        }
                                                    })
                                                    $partition.next().next().next().find('.causeD').each(function () {
                                                        var $cause = $(this);
                                                        var tdFirstC = _item[3].split(',');
                                                        var ans = tdFirstC[k] ? tdFirstC[k].split(';') : [];
                                                        if (ans && ans.length > 0) {
                                                            $.each(ans, function (j, ansItem) {
                                                                var ansD = ansItem.split('$');
                                                                if (ansD[0] == $cause.data('id')) {
                                                                    $cause.find('dt').find('.checkBox').addClass('selected');
                                                                    var ansDet = ansD[1] ? ansD[1].split('-') : [];
                                                                    // var dlParent = $(this).parent().parent();
                                                                    $.each(ansDet, function (m, ansDItem) {
                                                                        $cause.find('dd').find('.checkBox').each(function () {
                                                                            if (ansDItem == $(this).parent().data('id')) {
                                                                                $(this).addClass('selected');
                                                                            }
                                                                        })
                                                                    })
                                                                }
                                                            })
                                                        }
                                                    })
                                                }
                                                if (dictionary == 3) {
                                                    $partition.next().next().find('.subP').each(function () {
                                                        var $cause = $(this);
                                                        var tdFirstC = _item[3].split(',');
                                                        var ans = tdFirstC[k] ? tdFirstC[k].split(';') : [];
                                                        if (ans && ans.length > 0) {
                                                            $.each(ans, function (j, ansItem) {
                                                                if (ansItem == $cause.data('id')) {
                                                                    $cause.find('.checkBox').addClass('selected');
                                                                }
                                                            })
                                                        }
                                                    })
                                                }
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })

                container.find('#dictionary'+dictionary+' ul li').eq(theFirst).addClass('cur');
                container.find('#dictionary'+dictionary+' .addQue'+theFirst).removeClass('hide');
            }
            else{
                container.find('#dictionary'+dictionary+' ul li').eq(0).addClass('cur');
                container.find('#dictionary'+dictionary+' .addQue0').removeClass('hide');
            }
        }

        //确诊遍历
        function DiagnosisItems(tdItem,trHtml,trTpl,i){
            tdItem.id = i;
            //$.each(showData,function(k,listItem){
            //    var _item = listItem.split('&');
            //    var tdFirst = _item[1].split(',');
            //    $.each(tdFirst,function(m,tdFirstItem){
            //        if(tdFirstItem == i){
            //            tdItem.selected = 'selected';
            //        }
            //    })
            //})
            var tdTpl = '{{expressItem}}',
                tdHtml = [];
            if(tdItem.list.express){
                tdHtml = express(tdItem.list,tdHtml,tdTpl);
            }else{
                $.each(tdItem.list,function(i,pItem){
                    tdHtml = express(pItem,tdHtml,tdTpl,i);
                })
            }
            tdItem.reason = tdHtml.join('');
            trHtml.push(bainx.tpl(trTpl,tdItem));
            return trHtml;
        }
        //面部遍历
        function FaceItems(itemList,trHtml,trTpl,i){
            var pHtml = [],
                cHtml = [],
                sHtml = [],
                cause = JSON.parse(itemList.cause),
                suggest = JSON.parse(itemList.suggest),
                express = itemList.express;
            express = express.split(';');

            $.each(express,function(i,eItem){

                pHtml.push('<p class="subP" data-id="'+i+'" ><i class="checkBox"></i>'+eItem+'</p>');
            })
            var cTPL = '<dl class="causeD" data-id="{{id}}"><dt class="causedt"><i class="checkBox"></i>{{name}}</dt><dd >{{causeDet}}</dd></dl>';
            // causeId = -1;
            $.each(cause,function(j,cItem){
                cItem.id = j;
                var causeDetHtml = [];
                $.each(cItem.arr,function(k,aItem){
                    // causeId ++;
                    causeDetHtml.push('<span class="subSpan" data-id="'+k+'"><i class="checkBox"></i>'+aItem+'</span>');
                })
                cItem.causeDet = causeDetHtml.join('');
                cHtml.push(bainx.tpl(cTPL,cItem));

            })
            var sTPL = '<dl class="causeD" data-id="{{id}}"><dt class="causedt"><i class="checkBox"></i>{{name}}</dt><dd >{{suggestDet}}</dd></dl>';
            $.each(suggest,function(m,sItem){
                sItem.id = m;
                var suggestDetHtml = [];
                $.each(sItem.arr,function(n,aItem){
                    // causeId ++;
                    suggestDetHtml.push('<span class="subSpan" data-id="'+n+'"><i class="checkBox"></i>'+aItem+'</span>');
                })
                sItem.suggestDet = suggestDetHtml.join('');
                sHtml.push(bainx.tpl(sTPL,sItem));

            })
            itemList.id = i;
            itemList.expressH = pHtml.join('');
            itemList.causeH = cHtml.join('');
            itemList.suggestH = sHtml.join('');
            trHtml.push(bainx.tpl(trTpl,itemList));
            return trHtml;
        }
        //身体遍历
        //function bodyItems(itemList,trHtml,trTpl,i){
        //    var pHtml = [],
        //        cHtml = [],
        //        cause = itemList.cause,
        //        express = itemList.express;
        //    cause = cause.split(';');
        //    express = express.split(';');
        //    $.each(express,function(i,eItem){
        //        pHtml.push('<p class="subP" data-id="'+i+'"><i class="checkBox"></i>'+eItem+'</p>');
        //    })
        //    $.each(cause,function(j,cItem){
        //        cHtml.push('<p class="subP" data-id="'+j+'"><i class="checkBox"></i>'+cItem+'</p>');
        //
        //    })
        //    itemList.id = i;
        //    itemList.expressH = pHtml.join('');
        //    itemList.causeH = cHtml.join('');
        //    trHtml.push(bainx.tpl(trTpl,itemList));
        //    return trHtml;
        //}

        function express(pItem,tdHtml,tdTpl,z){
            var pHtml = [],
                express = pItem.express;
            express = express.split(';');
            $.each(express,function(i,eItem){
                var index = z ? z : i;
                pHtml.push('<p class="subP" data-id="'+index+'"><i class="checkBox"></i>'+eItem+'</p>');
            })
            pItem.expressItem = pHtml.join('');
            tdHtml.push(bainx.tpl(tdTpl,pItem));
            return  tdHtml;
        }

        //确定
        function submitQueLayout(i,className,tdHtml){
            var addDiv = container.find('.addQuestionAanalysis').eq(i);
            if(addDiv.find('textarea').length > 0){
                addDiv.find('textarea').val(tdHtml.join('\r\n'));
            }
            else{
                addDiv.prepend('<textarea class="'+className+'" autoHeight="true">'+tdHtml.join('\r\n')+'</textarea>');
            }
            var txtarea = addDiv.find('textarea')[0];
           // txtarea.style.height = txtarea.scrollTop +  txtarea.scrollHeight + 'px';
            container.find('.'+className+'Btn').css('line-height','36px');
            //txtarea.autoHeight();
            autoHeight(txtarea)
        }

        //确定
        function submitQuestionAnaliys($this){
            var tar = container.find('#dictionary1'),
                allTd = tar.find('.reason'),
                allSelected = allTd.find('.subP').find('.selected');
            if(allSelected.length > 0){
               var diagnosisList = [];
                var tdHtml=[], pHtml = [],pid = [],allIdItem = {},allId = [],list='';
                tar.find('li').find('.selected').each(function(){
                    var targetLi = $(this).parent(),express=[],type=[],
                        tarIdx = targetLi.index();
                    tar.find('.addQue'+tarIdx).find('.reason').each(function(j){
                        var  tarTd = $(this).parent().find('td').eq(0);
                        $(this).find('.selected').each(function(){
                            var tarP = $(this).parent();
                            pHtml.push(tarP.text());
                            pid.push(tarP.data('id'));
                        })
                        if($(this).find('.selected').length > 0){
                            tdHtml.push(tarTd.text()+'：'+pHtml.join(';'));
                            express.push(pid.join(';'));
                            type.push(tarTd.data('id'));
                            pHtml = []; pid = [];
                            allId.push(allIdItem);
                            allIdItem = {};
                        }
                    })
                    //list.nameId=targetLi.data('index');
                    //list.list = allId;
                    list = targetLi.data('index') +'&' + type.join(',') + '&' + express.join(',')
                    diagnosisList.push(list);
                    // list = {};
                    allId=[];
                })
                cache[0] = diagnosisList.join('#');

                submitQueLayout(0,'diagnosis',tdHtml);
            }
            $this.parent().parent().parent().hide();
            hasChangeDia = false;
        }

        function submitQuestionAnaliys2($this){

            var tar = container.find('#dictionary2'),
                allTd = tar.find('.partition').find('.selected'),
                allLi =  tar.find('li').find('.selected'),
                cause = tar.find('.cause').find('dd').find('.selected');
            if(allLi.length > 0){
                var allHtml = [];
                if(allTd.length > 0) {
                   var faceQueList = [];
                    tar.find('li').find('.selected').each(function(){
                        var targetLi = $(this).parent(),allIdItem = {},allId = [],list={},eid=[],cid=[],cArrId=[],express=[],tarTDArr=[],
                            tarIdx = targetLi.index();
                        tar.find('.addQue'+tarIdx).find('.partition').find('.selected').each(function(j){
                            var tarTD = $(this).parent(),
                                tarTableIndex = $(this).parent().parent().parent().parent().data('index');
                            var tdHtml = [],expressHtm = '',causeHtm = '';
                            var tarTd = $(this).parent();
                            tarTDArr.push(tarTD.data('id'));
                            //tdHtml.push(tarTd.text());
                            var allExpress = tarTd.next().find('.selected'),
                                cause = tarTd.parent().find('.cause').find('dd').find('.selected'),
                                pHtml = [];
                            if(allExpress.length > 0){
                                allExpress.each(function () {
                                    var tarTd = $(this).parent();
                                    pHtml.push(tarTd.text());
                                    eid.push(tarTd.data('id'));
                                })
                                expressHtm = pHtml.join(';');
                                pHtml = [];
                                express.push(eid.join(';'));
                            }

                            if(cause.length > 0){
                                var cHtml = [],causeArrId = [];
                                //causeD
                                //cause.parent().parent().parent().parent().each(function(){
                                tarTd.parent().find('.cause').find('.causeD').each(function(){
                                    var dHtml = [];
                                    $(this).find('dd').find('.selected').each(function(){
                                        dHtml.push($(this).parent().text());
                                        cid.push($(this).parent().data('id'));
                                    })

                                    cHtml.push($(this).find('dt').text() + ':'+dHtml.join(';'));
                                    //causeArrId.id = $(this).data('id');
                                    //causeArrId.Item = cid.join(';');
                                    causeArrId.push($(this).data('id') + '$' + cid.join('-'));

                                   // causeArrId = {};
                                    cid=[];
                                    dHtml=[];
                                })
                                cArrId.push(causeArrId.join(';'));
                                causeHtm = cHtml.join('\r\n');
                                //allIdItem.cause = cArrId;
                                // cArrId = [];
                                cHtml = [];
                            }
                            allHtml.push(tarTd.text()+ ':' +expressHtm+'\r\n'+causeHtm);


                            //allIdItem.type = tarTd.data('id');
                            pHtml = []; eid = [];
                            allId.push(allIdItem);
                            allIdItem = {};

                        })

                        list = targetLi.data('index') +'&'+tarTDArr.join(',') +'&' + express.join(',') + '&' + cArrId.join(',')
                        faceQueList.push(list);
                    })

                    cache[1] = faceQueList.join('#');
                   // console.log(cache[1]);


                    //生活建议
                    var eatVal = '',
                        attVal = '',
                        eatSug = [],
                        attSug = [];
                    tar.find('.suggest').find('dd').find('.selected').each(function(m){
                        var tit = $(this).parent().parent().parent().find('.causedt').text();
                        if(tit == '日常注意'){
                            attSug.push($(this).parent().text());
                        }
                        else{
                            eatSug.push($(this).parent().text());
                        }
                    })

                    if(eatSug.length > 0 ){
                        eatVal = '饮食建议：'+ eatSug.join(';');
                    }
                    if(eatSug.length > 0){
                        attVal = '日常注意：'+ attSug.join(';');
                    }
                    container.find('.lifeSuggest').val(eatVal+'\r\n'+attVal);

                }

                submitQueLayout(1,'expertCheckfaceQuestion',allHtml);
            }
            $this.parent().parent().parent().hide();
            hasChangeface = false;
        }

        //function submitQuestionAnaliys3($this){
        //    var tar = container.find('#dictionary3'),
        //        allTd = tar.find('.partition').find('.selected'),
        //        allLi =  tar.find('li').find('.selected'),
        //        cause = tar.find('.cause').find('dd').find('.selected');
        //    if(allLi.length > 0){
        //        var allHtml = [];
        //        if(allTd.length > 0) {
        //            var bodyQueList =[];
        //            tar.find('li').find('.selected').each(function(){
        //                var targetLi = $(this).parent(),cArrId = [],express = [],list,tarTDArr=[],
        //                    tarIdx = targetLi.index();
        //                tar.find('.addQue'+tarIdx).find('.partition').find('.selected').each(function(j){
        //                    tarTDArr.push($(this).parent().data('id'));
        //                    var expressHtm = '',causeHtm = '',eid=[],cid=[],allIdItem = {};
        //                    var tarTd = $(this).parent();
        //                    var allExpress = tarTd.next().find('.selected'),
        //                        cause = tarTd.parent().find('.cause').find('.selected'),
        //                        pHtml = [];
        //                    if(allExpress.length > 0){
        //                        allExpress.each(function () {
        //                            var tarTd = $(this).parent();
        //                            pHtml.push(tarTd.text());
        //                            eid.push(tarTd.data('id'));
        //                        })
        //                        expressHtm = '症状表现：\r\n'+pHtml.join(';');
        //                    }
        //                    if(cause.length > 0){
        //                        var cHtml = [];
        //                        cause.each(function () {
        //                            var tarTd = $(this).parent();
        //                            cHtml.push(tarTd.text());
        //                            cid.push(tarTd.data('id'));
        //                        })
        //                        causeHtm = '问题成因：\r\n'+cHtml.join('\r\n');
        //                        cArrId.push(cid.join(';'));
        //                    }
        //                    allHtml.push(targetLi.text() + '：' + tarTd.text() +'\r\n'+expressHtm+'\r\n'+causeHtm);
        //
        //                    express.push(eid.join(';'));
        //                    //allIdItem.type = tarTd.data('id');
        //                    //  allId.push(allIdItem);
        //                })
        //                //list.nameId=targetLi.data('index');
        //                //list.list = allId;
        //                list = targetLi.data('index') +'&'+tarTDArr.join(',') +'&' + express.join(',') + '&' + cArrId.join(',')
        //                bodyQueList.push(list);
        //            })
        //            cache[2] = bodyQueList.join('#');
        //        }
        //
        //        submitQueLayout(2,'expertCheckbodyQuestion',allHtml);
        //    }
        //    $this.parent().parent().parent().hide();
        //    hasChangebody = false;
        //}

        //分析报告预览
        function viewReport(chatView,chatRid){
            if(chatView){
                if(isAnonymous){
                    var data = {
                        sessionId : _uid
                    }
                    Data.tempfinalUserData(data).done(function(res){
                        reqestParm(res);
                    })
                }
                else{
                    var data = {
                        dId : chatRid
                    }
                    Data.getDetectRecordDetail(data).done(function(res){
                        reqestParm(res);
                    })
                }

            }else{
                var nickName = container.find('input[name=userName]').val(),
                    sex = container.find('.sex.active').data('id'),
                    mobile = container.find('input[name=tel]').val(),
                    birthday = container.find('input[name=birthday]').val(),
                    city = container.find('input[name=address]').val(),
                    expertDiagnose = container.find('.diagnosis').val(),
                    expertCheckfaceQuestion = container.find('.expertCheckfaceQuestion').val(),
                    //expertCheckbodyQuestion = container.find('.expertCheckbodyQuestion').val(),
                    suggest = container.find('.lifeSuggest').val(),
                    data = {
                        name: nickName,
                        sex: sex,
                        mobile: mobile,
                        birthday: birthday,
                        city: city,
                        expertDiagnose: expertDiagnose,
                        expertCheckfaceQuestion: expertCheckfaceQuestion,
                        //expertCheckbodyQuestion: expertCheckbodyQuestion,
                        suggest:suggest
                    },
                    showsendAfter = false;

                if(isNotReg){
                    showsendAfter = true;
                }
                previewReport(data,showsendAfter)
            }
        }

        //请求参数
        function reqestParm(res){
            var resDate = res.data;

            previewReport(resDate,true)
        }

        //预览的内容
        function previewReport(data,sendAfter){


            container.append('<section class="telDialog wl-trans-dialog translate-viewport reportPreview" id="reportPreview" style="display: block;"><div class="reportPreviewContent"><i class="closeBtn closeReportPreview"></i><div class="reportPreviewTitle">用户诊断分析报告</div><div class="detailContent"><dl>'+getDetectRecord(data)+'</dl></div><div class="footerTool"><span class="resetBtn">取消</span></div> </div></section>');
        }

        //判断是否是多选
        function chooseRC(target,canMultiple,chooseNum){
            canMultiple == true ? chooseAnswerRadio(target) : chooseAnswerCheckbox(target,chooseNum);
        }

        //单选
        function chooseAnswerRadio(target){
            var
                _view =target.parent('dl'),
                siblingsDD = _view.find('dd');
            siblingsDD.removeClass('active');
            target.addClass('active');
            if(_view.find('.active').length > 0){
                _flag = true;
            }

        }

        //多选
        function chooseAnswerCheckbox(target,chooseNum){
            var
                _view =target.parent('dl'),
                _activeL = _view.find('.active').length;

            // console.log(_activeL);
            if(target.hasClass('active')){
                target.removeClass('active')
                if(_activeL==1){
                    _flag = false;
                }
            }else{
                if(_activeL < chooseNum) {
                    target.addClass('active')
                    _flag = true;
                }
                else
                {
                    bainx.broadcast('最多只能选择'+chooseNum+'个')
                }
            }
        }

        //肌肤类型数据
        function skinTypeData(){
            var type1 = ['干燥','眼部','祛斑需求','美白需求','痘痘类','过敏性','敏感性','衰老性','混合性','油性'],
                type2 = ['毛孔','色素','纹理','油','水','光泽'],
                tpl = '<div class="grade_warp blockMove{{index}}"><label>{{name}}</label> <div class="User_ratings User_grade"> <div class="ratings_bars">  <div class="scale" id="bar{{index}}"> <div></div> <span id="btn{{index}}"></span> </div><span class="title" id="title{{index}}">1</span></div> </div> </div>',
                html1 = [],
                html2 = [];
            var itemType = {};
            $.each(type1,function(index,item){
                itemType.index = index;
                itemType.name = item;
                html1.push(bainx.tpl(tpl,itemType));
            })
            container.find('.questionAnalysis').find('.skinType1').append(html1.join(''));
            var blockMoveLen = container.find('.grade_warp').length;
            $.each(type2,function(index,item){
                itemType.index = index + blockMoveLen;
                itemType.name = item;
                html2.push(bainx.tpl(tpl,itemType));
            })
            container.find('.questionAnalysis').find('.skinType2').append(html2.join(''));

            $('.skinData').append('<div style="clear: both;"></div> <p><label>所属肌肤类型：</label><input type="text" class="checkName"/></p><p><label>严重程度：</label><select class="checkValue"><option value="1">轻度</option><option value="2">中度</option><option value="3">重度</option></select></p> ');


            if(canEdit){

                for(var k = 0,l = container.find('.grade_warp').length;k<l;k++){
                    new scale('btn'+k, 'bar'+k, 'title'+k);
                }
            }
        }

        scale = function (btn, bar, title) {
            this.btn = container.find('#'+btn)[0];
            this.bar = container.find('#'+bar)[0];
            this.title = container.find('#'+title)[0];
            this.step = this.bar.getElementsByTagName("DIV")[0];
            this.init();
        };
        scale.prototype = {
            init: function () {
                var f = this, g = document, b = window, m = Math;
                f.btn.onmousedown = function (e) {
                    var x = (e || b.event).clientX;
                    var l = this.offsetLeft;
                    var max = f.bar.offsetWidth - this.offsetWidth;
                    g.onmousemove = function (e) {
                        var thisX = (e || b.event).clientX;
                        var to = m.min(max, m.max(-2, l + (thisX - x)));
                        f.btn.style.left = to + 'px';
                        f.ondrag(m.round(m.max(0, to / max) * 100), to);
                        b.getSelection ? b.getSelection().removeAllRanges() : g.selection.empty();
                    };
                   // g.onmouseup = new Function('this.onmousemove=null');
                    g.onmouseup = function(){
                        this.onmousemove=null;
                    }
                };
            },
            ondrag: function (pos, x) {
                this.step.style.width = Math.max(0, x) + 'px';
                this.title.innerHTML =( pos / 200 + 1).toFixed(1);
            }
        }


        init();
    }
    return questionSurvey;

})
