/**
 * 模版课程
 * Created by xiuxiu on 2016/8/18.
 */
require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/nexter',
    'h5/css/page/createMineBoxPage.css'
], function($,URL, Data,Common,Nexter) {

    var coverImg = '<div class="coverImg"><form id="my_form" enctype="multipart/form-data"><img src="' + imgPath + 'common/images/personalTailor/pic_add.png"/><input type="hidden" name="type" value="1"/> <input type="file" class="file" name="file"  accept="image/png,image/gif,image/jpg" /></form></div>',
        isSave = false;//是否保存;

    //求两个数组的差集
    function chaji_array(arr1, arr2) {
        var arr3 = [];
        for (var i = 0; i < arr1.length; i++) {
            var flag = true;
            for (var j = 0; j < arr2.length; j++) {
                if (arr2[j] == arr1[i]) {
                    flag = false;
                }
            }
            if (flag) {
                arr3.push(arr1[i]);
            }
        }
        return arr3;
    }

    function init(){

       // $('.waitting').hide();
        $('body').append('<div id="courseTemplateContainer"><ul class="nav"></ul><div class="content"></div> </div>');
        courseNav();

    }

    //模板课程导航
    function courseNav(){
        var   courseData = [
                {
                    label: '课程列表',
                    className:'courseList'

                },
                {
                    label:'添加课程',
                    className:'addCourse'

                },
                {
                    label:'课时列表',
                    className:'lessonList'

                },
                {
                    label:'添加课时',
                    className:'addLesson'
                }
        ],
            tplNav = '<li class="{{className}}Nav navLi">{{label}}</li>',
            tplContent = '<div class="{{className}}Content ContentDiv grid hide"></div>',
            htmlNav=[],
            htmlContent = [];
        $.each(courseData,function(index,item){
            htmlNav.push(bainx.tpl(tplNav,item));
            htmlContent.push(bainx.tpl(tplContent,item));
        })
        $('#courseTemplateContainer .nav').append(htmlNav.join(''));
        $('#courseTemplateContainer .content').append(htmlContent.join(''));
        $('#courseTemplateContainer .nav li').first().addClass('active');
        $('#courseTemplateContainer .content .ContentDiv').first().removeClass('hide');

        courseList();
        bindEvent();

    }

    //模版课程列表
    function courseList(){
        var courseTplContent = $('#courseTemplateContainer .courseListContent');
        courseTplContent.append('<div class="headerLi row"><div class="col">课程名称</div> <div class="col">课程简称</div><div class="col">定制类型</div><div class="col">课程周期</div><div class="col">操作</div></div><ul ></ul>');


        var element = $('#courseTemplateContainer'),
            nexter = new Nexter({
                element: element,
                dataSource: Data.getOpenCourseVOList,
                data: {
                    courseTemplate: 1
                },
                pageSize: 100,
                enableScrollLoad: true
            }).load().on('load:success', function (res) {

                if (res.list.length > 0) {
                    var html = [],
                        template = '<li data-id="{{id}}" class="row"><div class="col">{{courseName}}</div> <div class="col">{{courseShortName}}</div><div class="col">{{mineType}}</div><div class="col">{{courseDuration}}</div><div class="col"><span class="btn editBtn editCourseBtn">编辑</span><span class="btn deleteBtn deleteCourseBtn">删除</span> </div></li>',makeType = ['','护肤定制','私密护理','减肥定制','脱发定制'];
                    $.each(res.list, function (index, item) {
                        item.mineType = makeType[item.mineType];
                        html.push(bainx.tpl(template, item));

                    });

                    courseTplContent.find('ul').append(html.join(''));
                    courseTplContent.find('ul li').first().addClass('hasChoiceCourse');
                }
                else {
                    courseTplContent.append('暂时没有模版课程！');
                }
            })
    }

    //添加课程
    function addCourse(target,res){
        var courseId = '';
        if(res){
            courseId = res.courseDO.id;
        }
        $('.'+target).append('<div class="templateCourseContent grid" data-id="'+courseId+'"><div class="courseMsg "><h3>课程信息</h3><div class="courseContent row"></div> </div><div class="sectionMsg"><table class="courseTable"></table></div><div class="footer"><span class="btn saveBtn saveCourseBtn">保存</span></div> </div>');
        courseMsg(res);
    }

    //课时列表
    function lessonList(){
        var courseTplContent = $('#courseTemplateContainer .lessonListContent');
        courseTplContent.append('<div class="headerLi row"><div class="col">课时名称</div> <div class="col">课时简称</div><div class="col">课时时长(分)</div><div class="col">课时步骤数</div><div class="col">操作</div></div><ul ></ul>');


        var nexter = new Nexter({
                element: courseTplContent,
                dataSource: Data.getPublicLessonVOList,
                data: {
                    courseTemplate: 1
                },
                pageSize: 15,
                enableScrollLoad: true
            }).load().on('load:success', function (res) {

                if (res.list.length > 0) {
                    var html = [],
                        template = '<li data-id="{{id}}" class="row"><div class="col">{{lessonName}}</div> <div class="col">{{lessonShortName}}</div><div class="col">{{lessonTime}}</div><div class="col">{{lessonStepsNum}}</div><div class="col"><span class="btn editBtn editLessonBtn">编辑</span><span class="btn deleteBtn deleteLessonBtn">删除</span> </div></li>';
                    $.each(res.list, function (index, item) {
                        item.lessonTime = (item.lessonTime / 60).toFixed(1);
                        html.push(bainx.tpl(template, item));

                    });

                    courseTplContent.find('ul').append(html.join(''));
                    courseTplContent.find('ul li').first().addClass('hasChoiceCourse');
                }
                else {
                    courseTplContent.append('暂时没有模版课程！');
                }
            })
    }

    //课程信息
    function courseMsg(res){
        var txtE = 'course',
            txt = '课程',
            data = res ? res.courseDO : [],
            courseData = [
                {
                    label: '定制类型',
                    name: 'mine_type',
                    type: 'radio',
                    className:'boxBL'
                },
            {
                label:txt+'名称',
                type:'text',
                name:txtE+'_name',
                value:data && data.courseName ? data.courseName : ''
            },
            {
                label:txt+'简称',
                type:'text',
                name:txtE+'_short_name',
                value:data && data.courseShortName ? data.courseShortName : ''
            },
            {
                label:txt+'介绍',
                type:'text',
                name:txtE+'_introduce',
                value:data && data.courseIntroduce ? data.courseIntroduce : ''
            },

            {
                label:txt+'备注',
                type:'text',
                name:txtE+'_note',
                value:data && data.courseNote ? data.courseNote : ''
            },
            {
                label:txt+'周期',
                type:'tel',
                name:txtE+'Duration',
                value:data && data.courseDuration ? data.courseDuration : ''
            },

            //{
            //    label:txt+'封面',
            //    type:'img',
            //    //name:txtE+'_note',
            //    value:''
            //}
            ],
            basicMessage = '<div class="basicItemL {{coverImg}}"> <label>{{label}}:</label>{{content}}</div>',
            basicMessageHtml = [];
            $.each(courseData,function(i,basicItem) {

               // if (basicItem.type != 'img') {
                    basicItem.content = '<input type="' + basicItem.type + '" class="' + basicItem.name + '" name="' + basicItem.name + '" value="' + basicItem.value + '"/>'
                //}
                //else {
                //    basicItem.content = coverImg;
                //    basicItem.coverImg = 'courseCoverImg';
                //}
                if (basicItem.type == 'radio') {
                    basicItem.content = '<div class="makeType"><div class="displayB"><b class="choice active chooseItem" data-id="1">护肤定制类</b><b class="choice chooseItem" data-id="2">私密护理类</b><b class="choice chooseItem" data-id="3">减肥定制类</b><b class="choice chooseItem" data-id="4">脱发定制类</b></div> </div>';
                }

                 if (basicItem.type == 'tel') {
                     basicItem.content += '天'
                 }
                basicMessageHtml.push(bainx.tpl(basicMessage, basicItem));
            })
            $('.courseContent').append('<div class="col col-15">'+basicMessageHtml.join('')+'</div><div class="col col-8 courseCoverImg"><p>添加封面</p>'+coverImg+'</div> ');
        var htmlSection = [];
        if(res && res.courseSectionVOList.length > 0){
           // $.each(res.courseSectionVOList,function(i,item){
                htmlSection.push(addSection(res));
           // })
        }
        else{
            htmlSection.push(addSection());
        }
        $('.courseTable').append(htmlSection.join(''));
    }

    //课程汇总
    function courseGather(courseId) {
        var data = {
            courseId: courseId
        }
        Data.getCourseToStepDetail(data).done(function (res) {
            addCourse('editCourseContent',res);
        })

    }

    //添加一个阶段
    function addSection(res){
        var items = res && res.courseSectionVOList ? res.courseSectionVOList : '',
            lessonItems = res && res.lessonVOList ? res.lessonVOList : '',
            addSection = [];
            if(items.length > 0){
                $.each(items,function(index,item){
                    var sectionTpl = add('阶段', 'section',item);
                        addSection.push('<tr><td>'+ sectionTpl +'</td><td><table class="dayTable">'+addSectionLesson(item,lessonItems)+'</table></tr>');
                })
            }
            else{
                var sectionTpl = add('阶段', 'section');
                    addSection.push('<tr><td>'+ sectionTpl +'</td><td><table class="dayTable">'+addSectionLesson()+'</table></tr>');
            }
        return addSection.join('');
    }

    //添加一个天数
    function addSectionLesson(data,lessonData){
        var tpl = '<tr><td class="tdSectionLesson"><p>第<input type="tel" class="dayorderC" value="{{dayOrder}}" />天</p><div class="btnGroupSC"><span class="btn delete_btn sectionLesson_delete_btn">删除</span><span class="btn sectionLesson_ok_btn ok_btn">添加</span><span class="btn sectionLesson_batch_btn">批量添加</span></div> </td><td><table class="timeQTable">{{time}}</table><span class="btn sectionLessonTime_ok_btn ok_btn">添加</span></td></tr>',
            html=[],
            sectionData=[];
        if(data){
            sectionData = data.sectionLessonVOList;
        }
        if(sectionData.length > 0){
            $.each(sectionData,function(index,item){
                item.time = addTimeQuantum(item,lessonData);
                html.push(bainx.tpl(tpl,item));
            })
        }
        else{
            var item = {
                time: addTimeQuantum()
            };
            html.push(bainx.tpl(tpl,item))
        }
         return html.join('');
    }

    //添加一个时间段
    function addTimeQuantum(item,lessonData){
        var id = item ? item.id : '',
            ed = item ? item.earliesttimeInDay : '',
            ld = item ? item.latestttimeInDay : '',
            sd = item ? item.suggesttimeInDay : '',
            lessonBtnTxt = '选择',
            lesson = '';
        if(lessonData && lessonData.length > 0){
            $.each(lessonData, function (j, lessonItem) {
                if (item.lessonId == lessonItem.id) {
                    lessonItem.lessonId = lessonItem.id;
                    lesson = selectedLesson(lessonItem);
                    lessonBtnTxt = '更改';
                    return false
                }
            })
        }
           var tpl = '<tr data-id="'+id+'"><td><div class="timeQuantum">建议时间：<input type="time" class="suggestTime" value="'+sd+'" />要求时间：<input type="time" class="earlyTime" value="'+ed+'"/>-<input type="time" class="latestTime" value="'+ld+'"/></div> </td><td ><div class="lessonChooseInTime"> <div class="lessonDetail">'+lesson+'</div><span class="lessonChoose chooseLessonBtn btn">'+lessonBtnTxt+'课时</span></div></td><td width="40" class="deletetimeQuantum delete_btn">×</td></tr>';

        return tpl;
    }

    function bindEvent(){
        $('body')
            .on('click', 'input', function (event) {
                if (event && event.preventDefault) {
                    window.event.returnValue = true;
                }
            })
            .on('change', '.file', function (event) {
                var target = $(this).parent().find('img');
                if(target.attr('src') != imgPath + 'common/images/personalTailor/pic_add.png'){
                    var data = {
                        filePath: target.attr('src')
                    }
                    Data.upyunDeleteFile(data).done(function () {
                    })
                }
                    Common.uploadImages(event, '#my_form', URL.upYunUploadPics).done(function (res) {
                        target.attr('src',res.result.picUrls).addClass('active');
                    }).fail(function () {
                        bainx.broadcast('上传图片失败！');
                    });
            })
            //导航
            .on('click', '.navLi', function () {
                    var index = $(this).index();
                    $('.ContentDiv').eq(index).show().siblings().hide();
                    $(this).addClass('active').siblings().removeClass('active');
                if(index == 1 && $('.addCourseContent').children().length == 0){
                    addCourse('addCourseContent');
                }
                if(index == 2 && $('.lessonListContent ').children().length == 0){
                    lessonList();
                }
                if(index == 3 && $('.addLessonContent ').children().length == 0){
                    addLesson(true,'addLessonContent');
                }


            })

            //删除
            .on('click', '.deleteBtn', function (){

                if( $(this).hasClass('deleteCourseBtn')){
                    var target = $(this).parent().parent();
                    deleteOperate('course',target,target.data('id'))
                }
                if( $(this).hasClass('deleteLessonBtn')){
                    var target = $(this).parent().parent();
                    deleteOperate('lesson',target,target.data('id'))
                }
            })

            //关闭
            .on('click', '.closeBtn', function (){
                    if($(this).hasClass('closegetCourseTamplate')){
                        $(this).parent().parent().remove();
                    }
            })

            .on('click','.ok_btn',function(){
                var $this = $(this);
                if($this.hasClass('section_ok_btn')){
                    $this.parent().parent().parent().parent().after(addSection());
                }
                if($this.hasClass('sectionLesson_ok_btn') ){
                   var slTargetParent =  $this.parent().parent().parent().parent().parent().parent().prev(),
                        _sd = slTargetParent.find('input[name=section_sd]').val(),
                        _ed = slTargetParent.find('input[name=section_ed]').val(),
                        _day = $this.parent().prev().find('.dayorderC').val(),
                        tarParent = $this.parent().parent().parent(),
                       tarParentDay = parseInt(tarParent.find('.dayorderC').val());
                    if(validateSectionTime(_sd,_ed,_day) && tarParentDay <= _ed){
                        tarParent.after(tarParent.clone(true));
                        tarParent.next().find('.dayorderC').val(tarParentDay+1);
                        if(tarParentDay == _ed){
                            tarParent.next().find('.dayorderC').val(tarParentDay);
                        }
                    }
                }
                if($this.hasClass('step_ok_btn')){
                    var stepTargetParent =  $this.parent().parent().parent().parent();
                    stepTargetParent.after('<tr><td>'+add("步骤", "step")+'</td></tr>');
                }
                if($this.hasClass('sectionLessonTime_ok_btn')){
                    $this.prev().find('tbody').append(addTimeQuantum());
                }
             })
            //选择产品
            .on('click','.chooseProduct',function(){
                $(this).addClass('currentStep').siblings().removeClass('currentStep');
                getProductList();
            })

            //选择产品
            .on('click', '.chooseProductContents ul i', function () {
                    $('.chooseProductContents ul .productItem').removeClass('hasChoiceProd');
                    $(this).parent().addClass('hasChoiceProd');
            })
            .on('click', '#selectedProduct span', function () {
                $('#chooseProduct').hide();
                var target = $('.chooseProductContents').find('.hasChoiceProd'),
                    id = target.data('id'),
                    prodTips = target.data('useremind'),
                    multimediaresid = target.data('multimediaresid'),
                    resremain = target.data('resremain'),
                    prod_name = target.find('.prod_name').text();
                $('.currentStep').prev().attr({'data-id':id,'data-prodtips':prodTips,'data-multimediaresid':multimediaresid,'data-resremain':resremain}).val(prod_name);
            })

        //批量添加天数
            .on('click','.sectionLesson_batch_btn',function(){

                    var $this = $(this),
                        slTargetParent =  $this.parent().parent().parent().parent().parent().parent().prev(),
                        _sd = slTargetParent.find('input[name=section_sd]').val(),
                        _ed = slTargetParent.find('input[name=section_ed]').val(),
                        _day = $this.parent().prev().find('.dayorderC').val();

                if(validateSectionTime(_sd,_ed,_day)){
                    var thisDay = $this.parent().parent().find('.dayorderC').val(),
                        _allDl = $this.parent().parent().parent().parent().find('.dayorderC');
                    var arr2 = [],//两者差集
                        arr = [],//全部阶段天数
                        hasAddOrder = [];//已经添加的天数
                    for (var i = _sd; i <= _ed; i++) {
                        arr.push(i);
                    }
                    _allDl.each(function () {
                        var thisDayOrder = parseInt($(this).val());
                        hasAddOrder.push(thisDayOrder);
                    })
                    arr2 = chaji_array(arr, hasAddOrder);
                    if (arr2.length == 0) {
                        arr2 = arr;
                    }
                    var tarParent = $this.parent().parent().parent(),
                        day = tarParent.find('.dayorderC');
                    for(var k = arr2.length-1;k >= 0;k--){

                   // $.each(arr2, function (idx, item) {
                        var _dayOrderPL = arr2[k];
                        day.val(_dayOrderPL);
                        tarParent.after(tarParent.clone(true));

                   // })
                    }
                    day.val(thisDay);
                }

            })

            .on('click','.delete_btn',function(){
                var $this = $(this),thisParent,tarId,type;
                //var onlyOne = false;

                if($this.hasClass('section_delete_btn')){
                     thisParent = $this.parent().parent().parent().parent();
                    tarId = $(this).parent().parent().data('id');
                    type = 'section';
                }
                if($this.hasClass('sectionLesson_delete_btn')){
                     thisParent = $this.parent().parent().parent();
                    type = 'sectionLesson';

                }
                if( $this.hasClass('deletetimeQuantum')){
                     thisParent = $this.parent();
                    type = 'sectionLesson';
                    tarId =  thisParent.data('id');
                }

                //删除步骤
                if($this.hasClass('step_delete_btn')){
                     thisParent = $this.parent().parent();
                    type = 'step';
                    tarId =  thisParent.data('id');
                }

                if(thisParent.parent().children('tr').length == 1){
                    //onlyOne = true;
                    bainx.broadcast('只剩一条了，不能删除！');
                    return
                }

                if($this.hasClass('sectionLesson_delete_btn')){
                    thisParent.find('.timeQTable').find('tr').each(function(){
                        deleteOperate(type,thisParent,tarId)
                    })
                }
                else{
                    deleteOperate(type,thisParent,tarId);
                }
            })

            //关闭
            .on('click','.closeBtn',function(){
                if($(this).hasClass('closeLessonChoose')){
                    $('.userLessonList').hide();
                }
            })

            //选择课时
            .on('click', '.lessonChoose', function () {
                $('.lessonChoose').removeClass('currentSelectLesson');
                $(this).addClass('currentSelectLesson');
                if($('.userLessonList').length == 0){
                    lessonGather()
                }else{
                    $('.userLessonList').show();
                    //$('.choiceDialog').removeClass('hasChoice');
                    $('.courseTable .dayTable tr').removeClass('currentAddSL');
                    $(this).parent().addClass('currentAddSL');
                }
            })
            //
            .on('click', '.lessonChoice', function () {
                var chosedItem = $(this).prev(),
                    stepList = [],vo = {};
                chosedItem.find('.stepDetail').each(function () {
                    var targetStep = $(this),
                        lessonStepVOList = {
                            id:targetStep.data('id'),
                            stepName: targetStep.find('.name').text(),
                            stepShortName: targetStep.find('.shortname').text(),
                            stepIntroduce: targetStep.find('.introduce').text(),
                            stepNote: targetStep.find('.note').text(),
                            stepOrder: targetStep.find('.order').text(),
                            stepType: targetStep.find('.type.active').data('id'),
                            stepInterval: targetStep.find('.interval').text(),
                            prodId: targetStep.find('.product').data('prodid'),
                            prodName: targetStep.find('.prodName').text(),
                            prodUseRemind: targetStep.find('.product').data('remain'),
                            multimediaResourceId: targetStep.find('.res').data('resid'),
                            multimediaUseRemind: targetStep.find('.res').data('resremain'),
                            resName: targetStep.find('.res').text()
                        };
                    stepList.push(lessonStepVOList);

                })
                var sl_data = {
                    lessonName: chosedItem.find('.lessonName').text(),
                    lessonStepVOList: stepList,
                    lessonId:chosedItem.data('id')
                }
                vo.lessonStepVOList = sl_data.lessonStepVOList;
                vo.lessonName = sl_data.lessonName;
                vo.lessonId = sl_data.lessonId;
                var htm = selectedLesson(vo);
               // $('.chooseLessonBtn').hide();
                $('.currentSelectLesson').text('更换课时').prev().html(htm);
                $('.userLessonList').hide();
            })

            //选择定制类型
            .on('click', '.makeType .choice', function () {
                    $(this).addClass('active').siblings().removeClass('active');
            })

        //保存盒子
            .on('click', '.saveBtn', function (){
                if($(this).hasClass('saveCourseBtn')){
                    saveCourseTemplate();
                }
                if($(this).hasClass('saveLessonBtn')){
                    saveAllLesson();
                }

            })

        //编辑
            .on('click', '.editBtn', function (){
                var $this = $(this),
                    $thisParentId = $(this).parent().parent().data('id');
                if($this.hasClass('editLessonBtn')){
                    $('.addLessonNav').text('编辑课时').addClass('active').siblings().removeClass('active');
                    $('.ContentDiv').hide();
                    //$('.ContentDiv').eq(3).show().siblings().hide();
                    $('.ContentDiv').eq(3).after('<div class="editLessonContent ContentDiv grid"></div>') ;
                    editLesson($thisParentId,'editLessonContent');
                }
                if( $(this).hasClass('editCourseBtn')){
                    $('.addCourseNav').text('编辑课程').addClass('active').siblings().removeClass('active');
                    $('.ContentDiv').hide();
                    var courseId = $(this).parent().parent().data('id');
                   if($('#editCourseContent_'+courseId).length == 0){
                       $('.editCourseContent').remove();
                       $('.ContentDiv').eq(3).after('<div class="editCourseContent ContentDiv grid" id="editCourseContent_'+courseId+'"></div>') ;
                       courseGather($thisParentId);
                   }
                    else{
                       $('#editCourseContent_'+courseId).show();
                   }

                }
            })
    }

    //选择课时之后的操作
    function selectedLesson(vo){
        var tpl = '<p>您选择的是<span class="lessonG" data-id="{{lessonId}}">{{lessonName}}</span></p><p class="lessonStepP">该课时分为<span class="count_step">{{count}}</span>个步骤:</p><div class="gather_stepList grid">{{stepList}}</div>',
            html = [];
        createOrUpdateStepHtml(vo)
        html.push(bainx.tpl(tpl, vo));

        return html.join('');

    }



    //选择产品
    function getProductList() {
        var  containerCreateBox = $('body');
       // containerCreateBox.find('#chooseProduct').remove();

        if($('#chooseProduct').length == 0){
            containerCreateBox.append('<section class="telDialog wl-trans-dialog translate-viewport"  id="chooseProduct" style="display: block;"><div  class="grid chooseProductContents"><i class="closeBtn closeCommonProduct"></i><ul></ul><div id="selectedProduct"><span>确定</span></div></div></section>');

            Data.getMineScProductVOList().done(function(res){
                if (res.list.length > 0) {
                    var html = [],
                        template = '<div class="productItem col col-50 getBoxProductItemC_{{id}}" data-id="{{id}}" data-useremind="{{resUseRemind}}" data-multimediaresid="{{multimediaResId}}" data-resremain="{{resUseRemind}}" data-resname="{{resName}}" ><i></i><dt><span></span><img src="{{listimg}}" /></dt><dd><p class="ellipsis prod_name">{{prodName}}</p><p class="ellipsis">产品效果：{{prodResult}}</p><p class="ellipsis">产品用途：{{prodPurpose}}</p><p class="prod_Price">价格：{{prodRetailPrice}}</p><p class="prodNum"></p></dd></div>',
                        _index = 0;
                    $.each(res.list, function (index, item) {
                        var img = item.prodPicUrls;
                        item.listimg = img ? img : imgPath + 'common/images/img_icon.png';
                        item.prodRetailPrice = (isNaN(item.prodRetailPrice) ? 0 : (item.prodRetailPrice / 100)).toFixed(2)
                        if (index % 2 == 0) {
                            html.push('<li class="row">');
                        }
                        html.push(bainx.tpl(template, item));
                        if (index % 2 == 1) {
                            html.push('</li>');
                        }
                        _index = index;
                    });
                    if (_index % 2 == 0) {
                        html.push('<div class="col col-50 goods goods-null fb fvc fac"></div></li>');
                    }
                    containerCreateBox.find('#chooseProduct ul').append(html.join(''));

                }
            })
        }
        else{
            $('#chooseProduct').show();
        }
    }

    //删除操作
    function deleteOperate(type,thisParent,delId){
        var data;
        if(type == 'course'){
            data = {
                id: delId
            }
            Data.deleteCourse(data).done(function (res) {
                thisParent.remove();
            })

        }
        if (type == 'lesson') {//删除课时
            if (delId) {
                    data = {
                        id: delId
                    }
                    Data.deleteLesson(data).done(function (res) {
                        thisParent.remove();

                    })
            } else {
                thisParent.remove();
            }

        }
        if (type == 'step') {//删除步骤
            if (delId) {
                data = {
                    id: delId
                }
                Data.deleteLessonStep(data).done(function (res) {
                    thisParent.remove();
                })
            } else {
                thisParent.remove();
            }
        }
        if (type == 'section') {//删除课程阶段
            if (delId) {
                data = {
                    id: delId
                }
                Data.deleteCourseSection(data).done(function (res) {
                    thisParent.remove();
                })
            } else {
                thisParent.remove();
            }
        }
        if (type == 'sectionLesson') {//删除课时阶段关联
            if (delId) {
                data = {
                    id: delId
                }
                Data.deleteSectionLesson(data).done(function (res) {
                    thisParent.remove();
                })
            } else {
                thisParent.remove();
            }
        }
    }

    //验证阶段时间
    function validateSectionTime(_sd,_ed,_day){
        if(!_sd){
            bainx.broadcast('请填写开始时间');
            return false
        }
        if(!_ed){
            bainx.broadcast('请填写结束时间');
            return false
        }
        if(!_day){
            bainx.broadcast('请填写天数');
            return false
        }
        if(_sd && _ed && _day){
            return true
        }
    }

    function add(name, className,item) {
        var _sectionHtm = '',_sectionBtn = '',_stepHtml = '',
            tpl;
        var _name = '',_shortName = '',_introduce = '',_note = '',_sectionSd = '',_sectionEd = '',_stepOrder = '',_stepInterval = '',_type = '',_prodId = '',_prodTips = '',_resId = '',resTips = '',_prodName = '',_id='';
        if(item){
            _id = item.id;
        }

        if (className == 'section') {
            if(item){

                _name = item.sectionName;
                _shortName = item.sectionShortName;
                _introduce = item.sectionIntroduce;
                _note = item.sectionNote;
                _sectionSd = item.sectionSd;
                _sectionEd = item.sectionEd;
            }

            _sectionHtm = '<dd><span>第</span><input type="tel" name="section_sd" class="input_sd" value="'+_sectionSd+'"/> <span>天到第</span><input type="tel" name="section_ed" class="input_ed" value="'+_sectionEd+'"/><span>天</span> </dd>';
        }
        if (className == 'section' || className == 'step') {
            _sectionBtn = '<dd><span id="' + className + '_deleteBtn" class="' + className + '_delete_btn delete_btn btn">删除</span><span id="' + className + '_deleteBtn" class="' + className + '_ok_btn ok_btn btn">添加</span></dd>';
        }
        if (className == 'step') {
            if(item) {
                _name = item.stepName;
                _shortName = item.stepShortName;
                _introduce = item.stepIntroduce;
                _note = item.stepNote;
                _stepOrder = item.stepOrder;
                _stepInterval = item.stepInterval;
                _type = item.stepType;
                _prodId = item.prodId;
                _prodTips = item.prodUseRemind;
                _prodName = item.prodName;
                _resId = item.multimediaResourceId;
                resTips = item.multimediaUseRemind;
            }
            _stepHtml = '<dd><span>' + name + '排序：</span><select name="step_order" class="input_order" /><!--<input type="tel" name="step_order" class="input_order"/>--><p><span>与上一个' + name + '之间的间隔：</span><input type="tel" name="step_interval" value="'+_stepInterval+'"/>秒</p></dd><dd class=" step_choice_type"><span>' + name + '类型：</span><div class="displayB"> <b class="choice active chooseItem" data-id="1">普通步骤</b><b class="choice chooseItem" data-id="2">特效步骤</b></div></dd><dd class="chooseProdDD"><span>选择产品</span><input type="text" placeholder="请选择产品名" name="productName" class="ellipsis " readonly="readonly" data-id="'+_prodId+'" data-prodtips="'+_prodTips+'" data-multimediaresid="'+_resId+'" data-resremain="'+resTips+'" value="'+_prodName+'"/> <span class="chooseProduct btn">选择</span></dd>';
        }
        if (className == 'lesson') {
            if(item) {
                _name = item.lessonName;
                _shortName = item.lessonShortName;
                _introduce = item.lessonIntroduce;
                _note = item.lessonNote;
            }
        }

        tpl = '<dl class="grid '+className+'_add" data-id="'+_id+'"><dd><p><span>' + name + '名：</span><input type="text" name="' + className + '_name" class="input_name ellipsis '+className+'Name" value="'+_name+'"/></p><p><span>' + name + '简称：</span><input type="text" name="' + className + '_short_name" class="input_short_name ellipsis '+className+'ShortName" value="'+_shortName+'"/></p></dd><dd><span>' + name + '介绍：</span><textarea name="' + className + '_introduce" class="textarea_introduce '+className+'Introduce" >'+_introduce+'</textarea></dd><dd><span>' + name + '备注：</span><textarea name="' + className + '_note" class="textarea_note '+className+'Note">'+_note+'</textarea>' + _stepHtml +  _sectionHtm + ' </dd>'+_sectionBtn+'</dl>';


        return tpl
        //containertplCourse.find('.addContent').append(tpl);


        if (className == 'step') {
            var productTpl = '<dd class="chooseProdDD"><span>选择产品</span><input type="text" placeholder="请选择产品名" name="productName" class="ellipsis " readonly="readonly"/> <span class="chooseProduct btn">选择</span></dd>';

        }
        //if (className == 'section') {
        //    containertplCourse.find('.' + className + '_ok_btn').text('确定并关联课时');
        //
        //    if(target.prev().length > 0){
        //        containertplCourse.find('input[name=section_sd]').val(parseInt(target.prev().find('.gather_sectionEd').val())+1);
        //    }else{
        //        containertplCourse.find('input[name=section_sd]').val('1');
        //    }
        //}
        //if (className == 'lesson') {
        //    containertplCourse.find('.' + className + '_ok_btn').text('确定并添加步骤');
        //}
        //if (className == 'step') {
        //    containertplCourse.find('.' + className + '_ok_btn').addClass('okAndClose').text('确定并关闭').after('<span class="' + className + '_ok_btn ok_btn btn okAndContinue">确定并继续添加</span>');
        //
        //}
    }

    //获取课时列表
    function getlessonItems(items) {
        var tpl = lesson_TPL(),
            html = [],
            htmlTml = '';
        $.each(items, function (index, item) {
            item.stepHtm = '';
            if (item.lessonStepVOList) {
                var step = [],
                    stepTpl = step_TPL(),
                    stepTypeTxt = ['', '普通', '特效'];
                $.each(item.lessonStepVOList, function (j, voListItem) {
                    voListItem.active1 = voListItem.stepType == 1 ? 'active' : '';
                    voListItem.active2 = voListItem.stepType == 2 ? 'active' : '';
                    step.push(bainx.tpl(stepTpl, voListItem));
                })
                //item.stepHtm = '<div class="stepListL"><p class="borderl">步骤：</p><dl class="less_step grid">' + step.join('') + '</dl></div> ';
                item.stepHtm = '<dl class="less_step grid">' + step.join('') + '</dl>';
                html.push(bainx.tpl(tpl, item))
            }
        })
        htmlTml = html.join('');
        return htmlTml;
    }

    //弹窗 课时汇总
    function lessonGather() {
        $('body').append('<section class="telDialog wl-trans-dialog translate-viewport userLessonList userLessonListTemplate" data-widget-cid="widget-0" style="display: block;" id="userLessonList"><div class="chooseDialog"><i class="closeBtn closeLessonChoose"></i><ul class="grid"></ul></div></section>');

        var nexter = new Nexter({
            element: $('#userLessonList'),
            dataSource: Data.getPublicLessonVOList,
            enableScrollLoad: true,
        }).load().on('load:success', function (res) {
            $('#userLessonList ul').append(getlessonItems(res.list));
        })

    }

    //添加课时
    function addLesson(create,obj,data){
        $('.'+obj).append('<div class="templateLessonContent grid"><div class="LessonMsg "><h3>课时信息</h3><div class="LessonContent row"></div> </div><div class="LessonMsg"><table class="LessonTable"></table></div><div class="footer"><span class="btn saveBtn saveLessonBtn">保存</span></div> </div>');

        var htmlLesson,htmlStep = [];

        if(create){
            htmlStep.push(add('步骤', 'step'));
            htmlLesson = add('课时', 'lesson');
        }else{
            htmlLesson = add('课时', 'lesson',data);
            $.each(data.lessonStepVOList,function(i,item){
                htmlStep.push(add('步骤', 'step',item));
            })
        }

        $('.LessonTable').append('<tr class="lessonAdd"><td>'+ htmlLesson+'</td><td><table><tr><td>'+htmlStep.join('')+'</td></tr></table></tr>').removeClass('row');
        var arr = [];
        //删除所有option值
        for (var i = 1; i < 11; i++) {
            arr.push(i);
        }
        var currentSelect = $('.LessonTable').find('.input_order')[0];
        $.each(arr, function (index, item) {
            currentSelect.options.add(new Option('第' + item + '步骤', item));
        })
    }

    //编辑课时
    function editLesson(id,obj){
        var data = {
            lessonId:id
        }
        Data.getPublicLessonVOList(data).done(function (res) {
            var listItem = res.list[0]
            addLesson(false,obj,listItem);
        })

    }

    function lesson_TPL() {
        var tpl = '<li class="lessonItem row"  data-id="{{id}}" ><div class="col col-8"><div class="borderl"><p><span>基础信息</span></p><p>课时名：<span class="lessonName answer">{{lessonName}}</span></p><p>课时简称：<span class="lessonShortName answer" >{{lessonShortName}}</span></p></div><div class="row borderl"><div class="">课时介绍:</div><div class="col"><span class="lessonIntroduce answer">{{lessonIntroduce}}</span></div> </div><div class="row borderl"><div>课时备注:</div><div class="col"><span class="lessonNote answer">{{lessonNote}}</span></div> </div></div><div class="col col-17">{{stepHtm}}</div></li><div class=" lessonChoice choiceDialog"><i></i></div>';

        return tpl
    }

    //步骤tpl
    function step_TPL() {
        var tpl = '<div class="row stepDetail" data-id="{{id}}" ><div class="stepItemDot"><i></i>步骤<span class="order">{{stepOrder}}</span> </div><div class="col col-10"><div class="grid"> <div class="row"><div>步骤名：</div><span class="col answer name">{{stepName}}</span></div><!--<div class="row"><div>步骤简称：</div><span class="col answer shortname" >{{stepShortName}}</span></div><div class="row"><div>步骤类型：</div><div class="col answer"><b class="choice {{active1}} chooseItem type" data-id="1">普通步骤</b><b class="choice {{active2}} chooseItem type" data-id="2">特效步骤</b></div></div><div class="row"><div>与上一个步骤之间的间隔：</div><span class="col answer interval">{{stepInterval}}</span></div><div class="row"><div>步骤介绍：</div><div class="col answer introduce">{{stepIntroduce}}</div></div><div class="row"><div>步骤备注：</div><div class="col answer note" >{{stepNote}}</div></div>--><div class="row"><div>使用：</div><div class="col answer product {{disabled}}" data-prodid="{{prodId}}" data-remain="{{prodUseRemind}}" ><span class="{{show}} prodName">{{prodName}}</span></div></div><div class="row"><div>学习：</div><div class="col answer res {{disabled}}" data-resid="{{multimediaResourceId}}" data-resremain="{{multimediaUseRemind}}" ><span class="{{show}} resName">{{resName}}</span></div></div></div></div></div>';
        return tpl;
    }

    //更新或添加步骤的html
    function createOrUpdateStepHtml(vo) {
        var voStepTpl = '<div class="stepItem stepItem_{{id}}" > <p class="stepDot " >步骤{{stepOrder}}:</p><div class="row"><div> 步骤名：</div><div class="col name_step">{{stepName}}</div> </div><div class="row userProductItem "><div> 使用：</div><div class="col product_step {{disabled}}" data-remain="{{prodUseRemind}}" data-id="{{prodId}}"><span class="{{show}} prodName">{{prodName}}</span><i class="tips {{hide}} prod_{{prodId}}">{{tipsProd}}</i></div> </div><div class="row learnVideoItem "><div> 学习：</div><div class="col res_step {{disabled}}" data-resourceid="{{multimediaResourceId}}" data-resremain="{{resUseRemind}}"><span class="{{show}} resName"> {{resName}}</span></div></div></div>',
            voStepTplHtml = [],
            lessonStep = vo.lessonStepVOList;

        if (lessonStep) {
            // containSPList = uniqueArr(containSPList);//步骤的产品id
            $.each(lessonStep, function (j, voListItem) {
                voStepTplHtml.push(bainx.tpl(voStepTpl, voListItem));
            })
            vo.count = lessonStep.length;
        }
        vo.stepList = voStepTplHtml.join('');
    }

    //保存模版
    function saveCourseTemplate(){


            var isseted = true,
                courseId;

        $('.templateCourseContent').find('.courseContent .col-15').find('input').each(function(){
            if(!$(this).val()){
                isseted = false;
                bainx.broadcast('有未填信息！');
                return false;
            }
        })
        $('.templateCourseContent').find('.sectionMsg').find('input').each(function(){
            if(!$(this).val()){
                isseted = false;
                bainx.broadcast('有未填信息！');
                return false;
            }
        })
        if(!isseted){
            return false;
        }


            //课程周期判断
            var　courseDur = $('.courseDuration').val(),
                sectionLastDay = $('.courseTable').find('.section_add').last().find('.input_ed').val();
            if(courseDur < sectionLastDay){
                bainx.broadcast('课程周期设置不正确！');
                $('.courseDuration').val('');
                isseted = false;
                return false;
            }


            //具体时间判断
            //var setTimeOK = true;
            $('.courseTable').find('.dayTable').each(function(){
                var $thisDay =  $(this).find('.dayorderC').val(),
                    $startTime  = $(this).find('.earlyTime').val(),
                    $endTime =  $(this).find('.latestTime').val(),
                    $suggestTime = $(this).find('.suggestTime').val();
                if(!time_range($startTime, $endTime, $suggestTime)){
                    isseted = false;
                    bainx.broadcast('第'+$thisDay+'天时间设置不合理');
                    return false;
                }
                if($(this).find('.lessonDetail ').children().length == 0){
                    isseted = false;
                    bainx.broadcast('第'+$thisDay+'天未设置课时');
                    return false;
                }
            })
            if(!isseted){
                return false;
            }

           // if (isseted) {
                var
                    data = {
                        courseTemplate:1,
                        courseProperty: 1,
                        id: $('.templateCourseContent').data('id') ? $('.templateCourseContent').data('id') : '',
                        courseType: 2,
                        courseName: $('.course_name').val(),
                        courseShortName: $('.course_short_name').val(),
                        courseIntroduce: $('.course_introduce').val(),
                        courseNote: $('.course_note').val(),
                        picUrls: $('.courseCoverImg .coverImg img.active').attr('src'),
                        mineType: $('.makeType').find('.active').data('id'),
                        courseDuration:courseDur

                    }
                Data.createOrUpdateCourse(data).done(function (res) {
                    var vo = res.vo;
                    courseId = vo.id;
                    $('.templateCourseContent').attr('data-id', courseId)

                    saveAllSection(vo)

                })
           // }
    }

    //保存课时
    function saveAllLesson() {
        //保存课时


        var lessonTarget = $('.LessonTable .lessonAdd'),
            lessonId = lessonTarget.find('.lesson_add').data('id') ? lessonTarget.find('.lesson_add').data('id') : '',
            name = lessonTarget.find('.lessonName').val(),
            shortname = lessonTarget.find('.lessonShortName').val(),
            introduce = lessonTarget.find('.lessonIntroduce').val(),
            property = 1,
            note = lessonTarget.find('.lessonNote').val(),
            data = {
                id: lessonId,
                lessonName: name,
                lessonShortName: shortname,
                lessonIntroduce: introduce,
                lessonNote: note,
                lessonProperty: property
            }
        Data.createOrUpdatelesson(data).done(function (res) {

            lessonTarget.find('.lesson_add').attr({'data-id': res.vo.id});
            var targetStepAll = lessonTarget.find('.step_add');
            var voLesson = res.vo;

            //保存步骤
            targetStepAll.each(function (iStep) {
                var targetStep = $(this),
                    stepId = targetStep.data('id') ? targetStep.data('id') : '',
                    stepName = targetStep.find('.stepName').val(),
                    stepShortName = targetStep.find('.stepShortName').val(),
                    stepIntroduce = targetStep.find('.stepIntroduce').val(),
                    stepNote = targetStep.find('.stepNote').val(),
                    stepOrder = targetStep.find('select[name=step_order]').val(),
                    stepType = targetStep.find('.chooseItem.active').data('id'),
                    stepInterval = targetStep.find('input[name=step_interval]').val(),
                    prodId =targetStep.find('input[name=productName]').data('id'),
                    prodUseRemind = targetStep.find('input[name=productName]').data('prodtips'),
                    multimediaResourceId = targetStep.find('input[name=productName]').data('multimediaresid'),
                    multimediaUseRemind = targetStep.find('input[name=productName]').data('resremain'),
                    dataStep = {
                        lessonId: lessonTarget.data('id'),
                        id: stepId,
                        stepName: stepName,
                        stepShortName: stepShortName,
                        stepIntroduce: stepIntroduce,
                        stepNote: stepNote,
                        stepOrder: stepOrder,
                        stepType: stepType,
                        stepInterval: stepInterval,
                        prodId: prodId,
                        prodUseRemind: prodUseRemind,
                        multimediaResourceId: multimediaResourceId,
                        multimediaUseRemind: multimediaUseRemind
                    }
                Data.createOrUpdateMineLessonStep(dataStep).done(function (res) {

                    var stepVo = res.vo;
                    targetStep.attr({'data-id': stepVo.id});
                })

            })

        })



    }

    //保存阶段&& 阶段课时
    function saveAllSection(courseVo) {
        //保存阶段

        var isSL = false,

            sectionObj = $('.courseTable .section_add');
        sectionObj.each(function (indexSection) {
            var sectionTarget = $(this),
                sectionId = sectionTarget.data('id') ? sectionTarget.data('id'): '',
                sectionName = sectionTarget.find('input[name=section_name]').val(),
                sectionShortName = sectionTarget.find('input[name=section_short_name]').val(),
                sectionIntroduce = sectionTarget.find('textarea[name=section_introduce]').val(),
                sectionNote = sectionTarget.find('textarea[name=section_note]').val(),
                sectionOrder = indexSection+1,
                sectionSd = sectionTarget.find('input[name=section_sd]').val(),
                sectionEd = sectionTarget.find('input[name=section_ed]').val(),
                sectionDuration = parseInt(sectionEd) - parseInt(sectionSd) + 1,
                data = {
                    courseId: courseVo.id,
                    id:sectionId,
                    sectionName: sectionName,
                    sectionShortName: sectionShortName,
                    sectionDuration: sectionDuration,
                    sectionIntroduce: sectionIntroduce,
                    sectionNote: sectionNote,
                    sectionOrder: sectionOrder,
                    sectionSd: sectionSd,
                    sectionEd: sectionEd
                }
            Data.createOrUpdateCourseSection(data).done(function (res) {

                sectionTarget.attr('data-id', res.vo.id);

                var targetSLAll = sectionTarget.parent().next().find('.timeQTable tr');
                targetSLAll.each(function (itm) {

                    var targetSL = $(this),
                        slId = targetSL.data('id') ? targetSL.data('id'): '',
                        _earliesttime = targetSL.find('.earlyTime').val(),
                        _latestttime = targetSL.find('.latestTime').val(),
                        _suggesttime = targetSL.find('.suggestTime').val(),
                        dataSL = {
                            id: slId,
                            sectionId: res.vo.id,
                            earliesttimeInDay: _earliesttime,
                            latestttimeInDay: _latestttime,
                            suggesttimeInDay: _suggesttime,
                            lessonId: targetSL.find('.lessonG').data('id'),
                            dayOrder: targetSL.parent().parent().parent().parent().find('.dayorderC').val()
                        }
                        Data.createOrUpdateMineSectionLesson(dataSL).done(function (res) {
                            targetSL.attr('data-id', res.vo.id);
                            if (itm == targetSLAll.length - 1 && indexSection == sectionObj.length - 1) {
                                isSL = true;
                            }
                            if (isSL) {
                                isSave = true;
                                bainx.broadcast('保存成功！');

                                var html = [],
                                    template = '<li data-id="{{id}}" class="row"><div class="col">{{courseName}}</div> <div class="col">{{courseShortName}}</div><div class="col">{{mineType}}</div><div class="col">{{courseDuration}}</div><div class="col"><span class="btn editBtn editCourseBtn">编辑</span><span class="btn deleteBtn deleteCourseBtn">删除</span> </div></li>',makeType = ['','护肤定制','私密护理','减肥定制','脱发定制'];

                                courseVo.mineType = makeType[courseVo.mineType];
                                html.push(bainx.tpl(template, courseVo));
                                $('.courseListContent ul').append(html.join(''));
                            }
                        })
                })
            })
        })
    }

    //判断设置的建议时间是否在要求的时间段内
    function time_range(beginTime, endTime, nowTime) {
        //console.log(beginTime,endTime,nowTime)
        var strb = beginTime.split(":");

        if (strb.length < 2) {
            return false;
        }
        var stre = endTime.split(":");
        if (stre.length < 2) {
            return false;
        }
        var strn = nowTime.split(":");
        if (stre.length < 2) {
            return false;
        }
        var b = new Date();
        var e = new Date();
        var n = new Date();
        b.setHours(strb[0]);
        b.setMinutes(strb[1]);
        e.setHours(stre[0]);
        e.setMinutes(stre[1]);
        n.setHours(strn[0]);
        n.setMinutes(strn[1]);
        if (n.getTime() - b.getTime() >= 0 && n.getTime() - e.getTime() <= 0) {
            //bainx.broadcast("时间设置不合理");
            return true;
        } else {
            bainx.broadcast("时间设置不合理");
            return false;
        }
    }

    init();
})


