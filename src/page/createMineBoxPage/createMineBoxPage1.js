/**
 * 分配管家
 * Created by xiuxiu on 2016/5/21.
 */
require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common',
    'h5/js/common/data',
    'h5/js/common/nexter'
], function($, URL, Common, Data,Nexter) {
    var Page,
        _uid = URL.param.uid,//用户id
        _uName = URL.param.name,//用户名
        page = parseInt(URL.param.page),
        rid = URL.param.rid,//报告id
        dialog,//步骤弹窗
        userLessonListdialog,//选择课时弹窗
        chooseProductDialog,//产品弹窗
        boxId,//盒子id
        courseId,
        stepOrder= 0, //步骤排序
        prodPrice = 0, //盒子价格
        prodids,//盒子产品id
        hasRelate = false,//是否完成阶段课时关联
        firstNextLesson = true,//模版课时第一次操作下一步创建数据
        firstNextStep = true,//模版步骤第一次操作下一步创建数据
        firstNextSection = true,//模版阶段第一次操作下一步创建数据
        firstNextSectionLesson = true,//模版阶段课时第一次操作下一步创建数据
        firstLoadCourseTpl = true,//第一次加载模版
        index = 2;//索引
    if(URL.param.boxId1 && URL.param.boxId1 !='undefined'){
        boxId= URL.param.boxId1;
        firstNextLesson = false;
        firstNextStep = false;
        firstNextSection = false;
        firstNextSectionLesson = false;
    }else{
        boxId = '';
    }

    //判断数组是否包含某元素
    Array.prototype.contains = function (obj) {
        var i = this.length;
        while (i--) {
            if (this[i] == obj) {
                return true;
            }
        }
        return false;
    }


    //求两个数组的差集
    function chaji_array(arr1,arr2){
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
    //初始化
    function init(){
        if(page == 1){
            URL.assign(URL.userReportPage +'?uid='+ _uid + '&box=2&name='+_uName+'&boxId1='+boxId+'&rid='+rid);
        }else{
            render();
        }
    }
    //数据
    function render(){
        $('.waitting').hide();
        Page = $('<div class="page-content"><section class="main"></section></div><footer class="grid toolbar"><ul class="row"><li class="col prev btn">上一步</li><li class="col next btn">下一步</li></ul></footer>').appendTo('body');
        bindEvent();
        var boxTpl='<div class="handle"> <dl class="grid"><dd><span>定制类型：</span><div class="displayB"><b class="choice active chooseItem" data-id="1">护肤定制类</b><b class="choice chooseItem" data-id="2">私密护理类</b><b class="choice chooseItem" data-id="3">减肥定制类</b><b class="choice chooseItem" data-id="4">脱发定制类</b></div> </dd><dd><span>盒子名：</span><input type="text" class="box_name input_name" name="box_name" value="" size="15"> </dd><dd><span>盒子介绍：</span><textarea name="box_introduce" class="textarea_introduce"></textarea></dd><dd><span>盒子注意事项：</span><textarea name="box_note" class="textarea_note"></textarea></dd></dl></div>',
            courseTpl = '<div class="handle"><dl class="grid"><dd><span>基础信息</span><p><span>课程名：</span><input type="text" class="course_name input_name" name="course_name" value="" > </p><p><span>课程简称：</span><input type="text" class="course_short_name" name="course_short_name" value="" > </p></dd><dd><span>课程介绍</span><textarea class="course_introduce" name="course_introduce" class="textarea_introduce"></textarea></dd><dd><span>课程备注</span><textarea class="course_note" name="course_note" class="textarea_note"></textarea></dd></dl></div>',
            lessonTpl = '',
            sectionTpl = '',
            courseGatherTpl = '<ul></ul>';
        initHtml(boxTpl,courseTpl,lessonTpl,sectionTpl,courseGatherTpl);
        getMineBoxInfo();


    }

    function initHtml(boxTpl,courseTpl,lessonTpl,sectionTpl,courseGatherTpl,finishTpl){
        var html = [],
            data = [
                {
                    name:'盒子',
                    title:'<p><span>用户名：'+_uName+'</span></p><p>现在为<b class="userName">'+_uName+'</b>定制专属护肤盒子</p>',
                    content:boxTpl,
                    className:'box'
                },{
                    name:'课程',
                    title:' <p><span>用户名：'+_uName+'</span></p><p><span class="boxName">盒子名：<b></b></span></p><p><span>现在为</span><b class="userName">'+_uName+'</b>定制专属课程</p>',
                    content:courseTpl,
                    className:'course'
                },{
                    name:'课时',
                    title:' <p><span>用户名：'+_uName+'</span></p><p><span class="boxName">盒子名：<b></b></span></p><p><span class="courseName">课程名：<b></b></span></p><p><span>现在为</span><b class="userName">'+_uName+'</b>准备课时</p>',
                    content:lessonTpl,
                    className:'lesson'
                },{
                    name:'阶段',
                    title:'<p><span>用户名：'+_uName+'</span></p><p><span class="boxName">盒子名：<b></b></span></p><p><span class="courseName">课程名：<b></b></span></p><p>您已准备好<span class="countLesson"></span>个课时，接下来请为整个盒子的课程添加阶段计划，并准备好课时放入阶段计划中</p>',
                    content:sectionTpl,
                    className:'section'
                },{
                    name:'课程汇总',
                    title:'<p><span>用户名：'+_uName+'</span></p><p><span class="boxName">盒子名：<b></b></span></p><p><span class="courseName">课程名：<b></b></span></p><p><span>课程汇总如下:</span></p>',
                    content:courseGatherTpl,
                    className:'courseGather'
                },{
                    name:'完成',
                    title:'<p>盒子已经生成好啦~马上发送给<b>'+_uName+'</b>吧~</p>',
                    content:finishTpl,
                    className:'finish'
                }],
            tpl ='<div id="page{{i}}" class="pageBox hide"><div class="title">{{title}}</div><div class="{{className}} list" id="{{className}}">{{content}}</div>{{addBtnHtm}}<div class="{{className}}_handle handle">{{handle}}</div></div>';
        $.each(data,function(index,item){
            item.i = index+2;
            if(index == 2 || index == 3){
                item.addBtnHtm = '<div class="addBtn _addBtn add_'+item.className+'_btn"></div>';
            }
            //item.hide = index > 1 &&  index < 4? '' :'hide';
            html.push(bainx.tpl(tpl,item));
        })

        $('.main').append(html.join(''));
        $('.pageBox').eq(0).removeClass('hide').siblings().addClass('hide');
    }


    //获取课程模版列表
    function courseTamplateList(){
        //if(!URL.param.boxId1){
        if($('#courseBox').length == 0){
            $('.main').append('<div class="pageBox" id="courseBox"><div class="title"><p><span>用户名：'+_uName+'</span></p><p>现在为<b class="userName">'+_uName+'</b>选择课程模板</p></div><ul class="grid"></ul></div>')
            firstLoadCourseTpl = false;
            // }
            var element = $('#courseBox'),
                nexter = new Nexter({
                    element: element,
                    dataSource: Data.getOpenCourseVOList,
                    data:{
                        courseTemplate:1
                    },
                    enableScrollLoad: true,
                }).load().on('load:success', function (res)
                {

                    if (res.list.length > 0) {
                        var html =[],
                            template = '<li data-id="{{id}}" ><i></i><div class="courseItem" ><div class="row"><div>课程名：</div><div class="col">{{courseName}}</div> </div><div class="row"><div>课程简称：</div><div class="col">{{courseShortName}}</div> </div><div class="row"><div>课程介绍：</div><div class="col">{{courseIntroduce}}</div> </div><div class="row"><div>课程备注：</div><div class="col">{{courseNote}}</div></div></div></li>';
                        $.each(res.list, function(index, item) {
                            html.push(bainx.tpl(template,item));
                        });
                        $('#courseBox ul').append(html.join(''));
                        $('#courseBox ul li').first().addClass('hasChoiceCourse');
                    }
                    else{
                        index++;
                        $('body').find('.targetEdit').removeClass('targetEdit');
                        $('#page'+index).removeClass('hide').siblings('.pageBox').addClass('hide');
                    }
                })
        }
        else{
            // $('#courseBox').removeClass('hide');
        }

    }

    //填充模版信息
    function fillInTamplate(){

        //如果上次选择的模版要换一个模版
        //var curCourseId = $('.hasChoiceCourse').data('id'),
        //    oldCourseId = $('#courseBox ul').data('id');
        //console.log(curCourseId,oldCourseId,curCourseId != oldCourseId);
        //if(curCourseId != oldCourseId){         //不相等
        //    if(oldCourseId && window.confirm('您确定要更改模版吗？更改完之后你之前所做的操作都将消失')){//已经有旧数据且确定操作
        //        getTamplateData()
        //    }
        //    //没有旧数据
        //    if(!oldCourseId){
        //        getTamplateData()
        //    }
        //}
        getTamplateData()
    }

    //调模版数据
    function getTamplateData(){
        $('.main').find('.lesson,.step,.section,.sectionLesson').find('.grid').remove();
        $('.stepPage,.sectionLessonPage').remove();


        firstNextLesson = true;//模版课时第一次操作下一步创建数据
        firstNextStep = true;//模版步骤第一次操作下一步创建数据
        firstNextSection = true;//模版阶段第一次操作下一步创建数据
        firstNextSectionLesson = true;//模版阶段课时第一次操作下一步创建数据

        var data = {
            courseId:$('#courseBox .hasChoiceCourse').data('id')
        }
        Data.getCourseToStepDetail(data).done(function(res){
            var courseContent = res.courseDO,//课程信息
                lessonVOList = res.lessonVOList,//课时信息
                courseDetail = res.courseSectionVOList;//课程阶段信息
            //填充课程
            $('.course_name').val(courseContent.courseName);
            $('.course_short_name').val(courseContent.courseShortName);
            $('.course_introduce').val(courseContent.courseIntroduce);
            $('.course_note').val(courseContent.courseNote);

            //填充阶段
            getPageList(lessonVOList,'课时','lesson',$('.lesson'));
            getPageList(courseDetail,'阶段','section',$('.section'));
            $('.addStep').each(function(index){
                addSubPage($(this),'step','步骤','课时','lesson',false);
                if(lessonVOList[index].lessonStepVOList){
                    getPageList(lessonVOList[index].lessonStepVOList,'步骤','step',$('.stepPage_'+index+' .step'))
                }
                $('.stepPage').addClass('hide');
            })
            $('.addRelateSectionLesson').each(function(index){
                addSubPage($(this),'sectionLesson','阶段课时','阶段','section',false);
                if(courseDetail[index].sectionLessonVOList){
                    getPageList(courseDetail[index].sectionLessonVOList,'阶段课时','sectionLesson',$('.sectionLessonPage_'+index+' .sectionLesson'))
                    $('.sectionLessonPage_0').addClass('currentSubPage');
                }
                $('.sectionLessonPage').addClass('hide');

            })

            $('.toolbar').removeClass('hide');

        })
    }

    //课程汇总
    function courseGather(res){

        var items = res.courseSectionVOList,
            lessonItems =  res.lessonVOList;
        $('.courseGather ul').find('li').remove();
        var courseGatherTpl = '<li><p class="gather_sectionName">{{sectionName}}</p><i class="whiteDot"></i><dl class="grid sectionLs">{{sectionLessonVOListTpl}}</dl> </li>',
            html = [],
            hasNotFinish = false,
            htm = '';
        //if(items[0].sectionLessonVOList){
        $.each(items,function(i,item){
            if(item.sectionLessonVOList){
                var voListTpl = '<dd class="row"><div class="col col-4 sl_left">第{{dayOrder}}天</div><div class="col col-21"> <p>要求从{{earliesttimeInDay}}到{{latestttimeInDay}}之间学习{{lessonName}}</p><p>建议{{suggesttimeInDay}}学习{{lessonName}}</p><p>该{{lessonName}}分为{{count}}个步骤:</p><div class="gather_stepList grid">{{stepList}}</div></div> </dd>',
                    voListHtml = [];

                if(item.sectionLessonVOList){
                    $.each(item.sectionLessonVOList,function(j,voSectionLessonItem){
                        $.each(lessonItems,function(j,lessonItem){
                            if(voSectionLessonItem.lessonId == lessonItem.id){
                                var voStepTpl = '<p class="stepDot">步骤{{j}}:</p><div class="row"><div> 使用：</div><div class="col">{{prodName}}</div> </div><div class="row"><div> 学习：</div><div class="col">{{resName}}</div></div>',
                                    voStepTplHtml = [],
                                    lessonStep = lessonItem.lessonStepVOList;
                                if(lessonStep){
                                    $.each(lessonStep,function(j,voListItem){
                                        voListItem.j = j+1;
                                        voStepTplHtml.push(bainx.tpl(voStepTpl,voListItem));
                                    })
                                }
                                lessonItem.count = lessonStep.length;
                                lessonItem.stepList = voStepTplHtml.join('');
                                lessonItem.dayOrder = voSectionLessonItem.dayOrder;
                                lessonItem.latestttimeInDay = voSectionLessonItem.latestttimeInDay;
                                lessonItem.earliesttimeInDay = voSectionLessonItem.earliesttimeInDay;
                                lessonItem.suggesttimeInDay = voSectionLessonItem.suggesttimeInDay;
                                voListHtml.push(bainx.tpl(voListTpl,lessonItem));
                            }
                        })
                    })
                }
                item.sectionLessonVOListTpl = voListHtml.join('');
                html.push(bainx.tpl(courseGatherTpl,item));
            }else{
                hasNotFinish = true;
            }

        })
        htm = html.join('');
        // }else{
        if(hasNotFinish){
            htm = '<li>暂时还尚未完成设置哦！</li>'
        }

        //}
        $('.courseGather ul').append(htm);
    }

    //创建或更新之后的操作
    function oparetion(res,parentTarget,target,className,name){
        var vo = res.vo,
            okBtn;
        if(className == 'step' || className == 'sectionLesson' ){
            okBtn = $('.currentSubPage .ok_btn');
        }else{
            okBtn = $('#'+parentTarget+' .ok_btn');
        }

        if(okBtn.hasClass(className+'_edit_btn')){
            // update(className,vo);
            if(className == 'lesson'){
                update(className,vo.lessonName,vo.lessonShortName,vo.lessonIntroduce,vo.lessonNote)
            }
            if(className == 'step'){
                var _type = ['','普通','特效'];
                update(className,vo.stepName,vo.stepShortName,vo.stepIntroduce,vo.stepNote,vo.stepInterval,vo.stepOrder,_type[vo.stepType],vo.stepType,vo.proName);
            }
            if(className == 'section'){
                update(className,vo.sectionName,vo.sectionShortName,vo.sectionIntroduce,vo.sectionNote,vo.sectionDuration,vo.sectionOrder,vo.sectionSd,vo.sectionEd)
                var curSid = $('.targetEdit').data('id');
                $('.sectionLessonPage_'+curSid).find('.section_a_sd').text(vo.sectionSd);
                $('.sectionLessonPage_'+curSid).find('.section_a_ed').text(vo.sectionEd);

            }
            if(className == 'sectionLesson'){
                var _lesson_name = $('.userLesson_id').text();
                update(className,vo.earliesttimeInDay,vo.latestttimeInDay,_lesson_name,vo.suggesttimeInDay,vo.dayOrder)
            }
            $('.'+className).find('dl').removeClass('targetEdit');
            okBtn.removeClass(className+'_edit_btn');
        }else{
            //showToList(name,target,className);
            getPageList('',name,className,target,vo);
            var _tarHandle=target.parents('.pageBox').find('.handle');
            orderNoRepeat(_tarHandle,className,name);
            target.find('.targetAdd').attr('data-id',vo.id);
        }
        if(className != 'sectionLesson'){
            $('#'+parentTarget+' input').each(function(){
                $(this).val('');
            })
            $('#'+parentTarget+' textarea').each(function(){
                $(this).val('');
            })
        }
    }

    //事件绑定
    function bindEvent(){
        $('body').on('tap','.toolbar .btn',function()
            {
                stepBindEnevt($(this));

                //}).on('focus', 'input', function() {
                //    $('.toolbar').css('position','static');
                //
                //}).on('blur', 'input', function() {
                //    $('.toolbar').css('position','absolute');
            })
            .on('click', 'input', function (event) {
                if (event && event.preventDefault) {
                    window.event.returnValue = true;
                }
            })
            .on('keyup', 'input[type=tel]', function (event) {
                this.value=this.value.replace(/\D/g,'');
            })
            .on('afterpaste', 'input[type=tel]', function (event) {
                this.value=this.value.replace(/\D/g,'');
            })
            .on('tap', '#page2 .choice,.stepPage  .choice', function (event) {
                $(this).addClass('active').siblings().removeClass('active');
            })
            .on('tap','._addBtn',function(){
                var name,
                    target = $(this).parents('.pageBox').children('.handle'),
                    className;
                if($(this).hasClass('add_lesson_btn')){
                    name = '课时';
                    className = 'lesson';
                }
                if($(this).hasClass('add_section_btn')){
                    name = '阶段';
                    className = 'section';
                }
                if($(this).hasClass('add_sectionLesson_btn')){
                    name = '';
                    className = 'sectionLesson';
                }
                if($(this).hasClass('add_step_btn')){
                    name = '步骤';
                    className = 'step';
                    var data = {
                        detectReportId:rid
                    }
                    if (!dialog) {
                        Data.getExpertDbList(data).done(function(res){
                            if(res.list){
                                require(['h5/js/common/transDialog'],function(Dialog){
                                    dialog = new Dialog($.extend({}, Dialog.templates.bottom, {
                                        template: '<ul class="grid" id="expertdb">' + getExpertItem(res.list) + '<li class="addBtn _addBtn addExtraStep"></li></ul>',

                                    }))
                                })
                            }
                            dialog.show();
                            return
                        })
                    }else{
                        dialog.show();
                        //return
                    }
                    $('#expertdb').removeClass('addStepPage');
                }
                if($(this).hasClass('addExtraStep')){
                    $('.stepPage').each(function(){
                        if(!$(this).hasClass('hide')){
                            target = $(this).children('.handle');
                            name = '步骤';
                            className = 'step';
                        }
                    })
                    dialog.hide();
                    $('#expertdb').addClass('addStepPage');
                }
                add(name,target,className)
            })
            .on('tap','.choiceDialog',function(){
                var _tar = $(this);
                _tar.parents('li').addClass('hasStep').siblings().removeClass('hasStep');
                $('.choiceDialog').removeClass('hasChoice');
                var target = $(this).parents('li');
                _tar.addClass('hasChoice');
                if(_tar.hasClass('stepChoice')){
                    dialog.hide();
                    $('input[name=step_name]').val(target.find('.stepName').text());
                    $('input[name=step_short_name]').val(target.find('.stepShortName').text());
                    $('input[name=productName]').val(target.find('.productName').text());
                    $('input[name=step_interval]').val(target.data('stepinterval'));
                    var _stepOrder = target.find('.stepOrderEx').data('steporder');
                    $('.step_handle').find('select option[value="'+_stepOrder+'"]').attr("selected", true);
                    //$('#expertdb').removeClass('addStepPage');
                    $('.chooseProduct').parent('dd').remove();
                    var chosedItem = $('#expertdb').find('.hasChoice').parents('li');
                    var stepType = chosedItem.data('steptype');
                    $('.step_choice_type b').each(function(){
                        if($(this).data('id') == stepType){
                            $(this).addClass('active').siblings().removeClass('active');
                        }
                    })
                }else if(_tar.hasClass('lessonChoice')){
                    userLessonListdialog.hide();
                    $('.userLesson_id').text(target.find('.lessonName').text()).attr('data-id',target.data('id'));
                }
            })
            .on('tap','.ok_btn',function(){
                var name,
                    target,
                    className,
                    parentT = $(this).parents('.handle'),
                    _id = $('.targetEdit').data('id') ? $('.targetEdit').data('id') : '',
                    data;
                $('input,textarea').blur();
                if(!validate(parentT)){
                    //定义className
                    if($(this).hasClass('lesson_ok_btn')){
                        className = 'lesson';
                    }
                    if($(this).hasClass('step_ok_btn')) {
                        className = 'step';
                    }
                    if($(this).hasClass('section_ok_btn')){
                        className = 'section';
                    }
                    if($(this).hasClass('sectionLesson_ok_btn')){
                        className = 'sectionLesson';
                    }
                    var _Name = $('input[name='+className+'_name]').val(),
                        _ShortName = $('input[name='+className+'_short_name]').val(),
                        _Introduce = $('textarea[name='+className+'_introduce]').val(),
                        _Note = $('textarea[name='+className+'_note]').val();
                    if($(this).hasClass('lesson_ok_btn')){
                        name = '课时';
                        target = $(this).parents('.pageBox').children('.lesson');

                        //引用模版
                        if(firstNextLesson){
                            var changeData = {
                                vo:{
                                    lessonName:_Name,
                                    lessonShortName:_ShortName,
                                    lessonIntroduce:_Introduce,
                                    lessonNote:_Note,
                                }
                            }
                            oparetion(changeData,'page4',target,className,name)
                            $('#userLessonList').remove();
                            userLessonListdialog = '';
                        }
                        //更新最新数据
                        else{
                            data = {
                                boxId:boxId,
                                id:_id,
                                lessonName:_Name,
                                lessonShortName:_ShortName,
                                lessonIntroduce:_Introduce,
                                lessonNote:_Note,
                                lessonProperty:2
                            }
                            Data.createOrUpdatelesson(data).done(function(res){
                                // console.log(className)
                                oparetion(res,'page4',target,className,name)
                                $('#userLessonList').remove();
                                userLessonListdialog = '';
                            })
                        }

                    }
                    if($(this).hasClass('step_ok_btn')){
                        name = '步骤';
                        target = $(this).parents('.pageBox').children('.step');
                        var lessonId = $(this).parents('.pageBox').data('id'),
                            _stepOrder = parentT.find('select').val(),
                            stepType = $('.step_choice_type .active').data('id'),
                            stepInterval =$('input[name=step_interval]').val(),
                            prodId,
                            prodUseRemind ,
                            multimediaResourceId,//暂时为1，以后修改
                            multimediaUseRemind,
                            chosedItem;
                        if($('#chooseProduct').length > 0){
                            chosedItem = $('#chooseProduct').find('.hasChoiceProd');
                            prodId = chosedItem.data('id');
                            prodUseRemind = chosedItem.data('useremind');
                            multimediaResourceId = chosedItem.data('multimediaresid');//暂时为1，以后修改
                            //multimediaUseRemind = chosedItem.data('multimediauseremind');
                        }else if($('#expertdb').length > 0){
                            chosedItem = $('#expertdb').find('.hasChoice').parents('li');
                            prodId = chosedItem.data('prodid');
                            prodUseRemind = chosedItem.data('produseremind');
                            multimediaResourceId = chosedItem.data('multimediaresourceid') ;//暂时为1，以后修改
                            multimediaUseRemind = chosedItem.data('multimediauseremind');
                        }else{
                            chosedItem = target.find('.targetEdit').find('.step_a_name');
                            prodId = chosedItem.data('id');
                            prodUseRemind = chosedItem.data('useremind');
                            multimediaResourceId = chosedItem.data('multimediaresid');//暂时为1，以后修改
                            multimediaUseRemind = chosedItem.data('multimediauseremind');
                        }

                        if(!prodId){       //如果没有产品id
                            bainx.broadcast('请选择产品');
                            return
                        }

                        //引用模版
                        if(firstNextStep){
                            var changeData = {
                                vo:{
                                    stepName: _Name,
                                    stepShortName: _ShortName,
                                    stepIntroduce: _Introduce,
                                    stepNote: _Note,
                                    stepOrder: _stepOrder,
                                    stepType: stepType,
                                    stepInterval: stepInterval,
                                    prodId: prodId,
                                    proName:$('input[name=productName]').val(),
                                    prodUseRemind: prodUseRemind,
                                    multimediaResourceId: multimediaResourceId,
                                    multimediaUseRemind: multimediaUseRemind
                                }
                            }
                            oparetion(changeData, 'step', target, className, name)
                            $('.step_handle .grid').remove();
                        }
                        //更新最新数据
                        else {
                            data = {
                                boxId: boxId,
                                lessonId: lessonId,
                                id: _id,
                                stepName: _Name,
                                stepShortName: _ShortName,
                                stepIntroduce: _Introduce,
                                stepNote: _Note,
                                stepOrder: _stepOrder,
                                stepType: stepType,
                                stepInterval: stepInterval,
                                prodId: prodId,
                                prodUseRemind: prodUseRemind,
                                multimediaResourceId: multimediaResourceId,
                                multimediaUseRemind: multimediaUseRemind
                            }
                            // console.log(!editOrder($(this),name,className))
                            if (!editOrder($(this), name, className)) {
                                Data.createOrUpdateMineLessonStep(data).done(function (res) {
                                    res.vo.proName = $('input[name=productName]').val();
                                    oparetion(res, 'step', target, className, name)
                                    $('.step_handle .grid').remove();
                                })
                            }
                        }
                    }
                    if($(this).hasClass('section_ok_btn')){
                        name = '阶段';
                        target = $(this).parents('.pageBox').children('.section');
                        var //sectionDuration = $('input[name=section_duration]').val(),
                            sectionOrder = parentT.find('select').val(),
                            sectionSd = $('input[name=section_sd]').val(),
                            sectionEd = $('input[name=section_ed]').val(),
                            sectionSdOld = $('input[name=section_sd]').data('old'),
                            sectionEdOld = $('input[name=section_ed]').data('old'),
                            sectionDuration = parseInt(sectionEd)-parseInt(sectionSd)+1;

                        if((sectionSdOld && sectionSd != sectionSdOld) || sectionSdOld && sectionEd != sectionSdOld){
                            bainx.broadcast('您修改阶段的时间，请记得修改课时关联跟以下阶段的时间（包括课时关联）哦');
                        }
                        //引用模版
                        if(firstNextSection){
                            var changeData = {
                                vo:{
                                    sectionName : _Name,
                                    sectionShortName : _ShortName,
                                    sectionDuration : sectionDuration,
                                    sectionIntroduce : _Introduce,
                                    sectionNote : _Note,
                                    sectionOrder : sectionOrder,
                                    sectionSd : sectionSd,
                                    sectionEd:sectionEd
                                }
                            }
                            oparetion(changeData, 'page5', target, className, name)
                        }
                        //更新最新数据
                        else{
                            data = {
                                boxId:boxId,
                                id:_id,
                                courseId : $('#page3').data('id'),
                                sectionName : _Name,
                                sectionShortName : _ShortName,
                                sectionDuration : sectionDuration,
                                sectionIntroduce : _Introduce,
                                sectionNote : _Note,
                                sectionOrder : sectionOrder,
                                sectionSd : sectionSd,
                                sectionEd:sectionEd
                            }
                            if(!editOrder($(this),name,className)) {
                                Data.createOrUpdateCourseSection(data).done(function (res) {
                                    oparetion(res, 'page5', target, className, name)
                                })
                            }
                        }

                    }
                    if($(this).hasClass('sectionLesson_ok_btn')){
                        name = '';

                        var targetBtn =  $(this),
                            target = targetBtn.parents('.pageBox').children('.sectionLesson'),
                            sectionId = targetBtn.parents('.pageBox').data('id'),
                            _tar = $('.currentSubPage'),
                            _dayOrder =  _tar.find('input[name=day_order]').val();
                        sectionLessonBatch(targetBtn,_dayOrder,className,name,sectionId,_id,true)



                    }
                }
            })
            .on('tap','.sectionLesson_batch_btn',function(){
                var _tar = $('.currentSubPage');
                if(!validate(_tar)) {
                    var _allDl = $('.currentSubPage').find('.sectionLesson').find('dl'),
                    //actrueLength = $('.currentSubPage').find('.sectionLesson').find('dl').length,
                    //nessLength = parseInt($('.currentItem .section_a_duration').text()),
                        _ed = parseInt($('.currentItem .section_a_ed').text()),
                        _sd = parseInt($('.currentItem .section_a_sd').text());
                    var  targetBtn =  $(this),
                        className = 'sectionLesson',
                        name = '',
                        target = targetBtn.parents('.pageBox').children('.sectionLesson'),
                        _id = '';
                    var sectionId = targetBtn.parents('.pageBox').data('id'),
                        _earliesttime = _tar.find('input[name=earliesttime_in_day]').val(),
                        _latestttime = _tar.find('input[name=latestttime_in_day]').val(),
                        _lesson_id = _tar.find('.userLesson_id').data('id'),
                        _suggesttime = _tar.find('input[name=suggesttime_in_day]').val();
                    var arr2=[],//两者差集
                        arr=[],//全部阶段天数
                        hasAddOrder=[];//已经添加的天数
                    for(var i = _sd;i<= _ed;i++){
                        arr.push(i);
                    }
                    _allDl.each(function(){
                        var thisDayOrder = parseInt($(this).find('.sectionLesson_a_dayOrder').text());
                        hasAddOrder.push(thisDayOrder);
                    })
                    arr2 = chaji_array(arr,hasAddOrder);
                    if(arr2.length == 0){
                        arr2 = arr;
                    }
                    // console.log(arr2);
                    $.each(arr2,function(idx,item){
                        var _dayOrderPL = item;
                        console.log(_id);
                        var lastSL = false;
                        if(idx == arr2.length-1){
                            lastSL = true;
                        }
                        sectionLessonBatch(targetBtn,_dayOrderPL,className,name,sectionId,_id,lastSL)
                    })
                }
            })
            .on('tap','.addStep,.addRelateSectionLesson',function(){
                var target = $(this),
                    targetPid = target.parents('.grid').data('id'),
                    idParent = targetPid ? targetPid : 'add'+target.parents('.grid').index();
                $('.list').find('.grid').removeClass('currentItem');
                $(this).parents('.grid').addClass('currentItem');
                if(target.hasClass('addStep')){
                    var isFirstTpl = false,
                        hasStep = true;

                    //$('.stepPage').each(function(){
                    //
                    //})


                    if($('#stepPage_'+idParent).length == 0){
                        isFirstTpl =  !firstNextStep ? true : false;
                        addSubPage(target,'step','步骤','课时','lesson',isFirstTpl)
                        //}
                        //if(!firstNextStep || $('.stepPage_'+indexParent).length == 0){

                    }else{
                        $('.page-content').css('padding-bottom',0);
                        $('.pageBox,.toolbar').addClass('hide');
                        $('.pageBox').addClass('hide').removeClass('currentSubPage');
                        $('#stepPage_'+idParent).removeClass('hide').addClass('currentSubPage');
                        $('.list').find('.grid').removeClass('currentItem');
                        target.parents('.grid').addClass('currentItem');
                    }
                }
                else
                {
                    //if(!firstNextSectionLesson || $('.sectionLessonPage_'+indexParent).length == 0){
                    //    addSubPage(target,'sectionLesson','阶段课时','阶段','section',true)
                    //}
                    var isFirstTplSL = false;
                    if($('#sectionLessonPage_'+idParent).length == 0){

                        isFirstTplSL =  !firstNextSectionLesson ? true : false;
                        addSubPage(target,'sectionLesson','阶段课时','阶段','section',isFirstTplSL)
                    }
                    else{
                        $('.page-content').css('padding-bottom',0);
                        $('.pageBox,.toolbar').addClass('hide');
                        //$('.sectionLessonPage_'+indexParent).removeClass('hide');
                        $('.pageBox').addClass('hide').removeClass('currentSubPage');
                        $('#sectionLessonPage_'+idParent).removeClass('hide').addClass('currentSubPage');
                        $('.list').find('.grid').removeClass('currentItem');
                        target.parents('.grid').addClass('currentItem');
                    }
                }
            })
            .on('tap', '.userLesson_id', function (event){
                $('input,textarea').blur();
                var data = {
                    boxId:boxId
                }
                if (!userLessonListdialog) {
                    Data.getLessonVOList(data).done(function(res){
                        if(res.has == 1){
                            require(['h5/js/common/transDialog'],function(Dialog) {
                                userLessonListdialog = new Dialog($.extend({}, Dialog.templates.bottom, {
                                    template: '<ul class="grid" id="userLessonList">' + getlessonItems(res.list) + '</ul>',
                                }))
                            })
                        }
                        userLessonListdialog.show();
                    })
                }else{
                    userLessonListdialog.show();
                }
            })
            .on('tap', '.delete', function (event) {
                var target =  $(this).parents('.grid'),
                    currentP = target.parent('.list').attr('id'),
                    id = target.data('id'),
                    data = {
                        id:id
                    };
                if(currentP == 'lesson'){//删除课时
                    if(firstNextLesson){
                        deleteOK(target,currentP)
                    }else{
                        Data.deleteLesson(data).done(function(res){
                            deleteOK(target,currentP)
                        })
                    }
                }
                if(currentP == 'step'){//删除课时步骤
                    if(firstNextStep){
                        deleteOK(target,currentP)
                    }
                    else{
                        Data.deleteLessonStep(data).done(function(res){
                            deleteOK(target,currentP)
                        })
                    }
                }
                if(currentP == 'section'){//删除课程阶段
                    if(firstNextSection){
                        deleteOK(target, currentP)
                    }
                    else {
                        Data.deleteCourseSection(data).done(function (res) {
                            deleteOK(target, currentP)
                        })
                    }
                }
                if(currentP == 'sectionLesson'){//删除课时阶段关联
                    if(firstNextSectionLesson){
                        deleteOK(target, currentP)
                    }
                    else {
                        Data.deleteSectionLesson(data).done(function (res) {
                            deleteOK(target, currentP)
                        })
                    }
                }
            })
            .on('tap', '.returnstep,.returnsectionLesson', function (event) {
                var _tar = $(this);
                $('.page-content').css('padding-bottom','45px');
                if(_tar.hasClass('returnsectionLesson')){
                    pop();
                }else{
                    _tar.parents('.pageBox').addClass('hide');
                    $('#page4,.toolbar').removeClass('hide');
                    $('#expertdb').removeClass('addStepPage');
                    var stepArr = [];
                    _tar.parents('.pageBox').find('.list').find('dl').each(function(){
                        var step_name = $(this).find('dd').find('.step_a_name').text(),
                            step_order = $(this).find('dd').find('.step_a_order').text(),
                            stepobj = {};
                        stepobj.order = step_order;
                        stepobj.name = step_name;
                        stepArr.push(stepobj);
                    })
                    var _index = _tar.parents('.pageBox').data('index');
                    // console.log(stepArr,_index);
                    if(stepArr){
                        var stepT = '<dd class="row"><p>步骤{{order}}：</p><b class="col">{{name}}</b></dd>',
                            htm=[];
                        $.each(stepArr,function(index,item){
                            htm.push(bainx.tpl(stepT,item));
                        })
                        htm = htm.join('');
                        $('.lesson .currentItem').find('.less_step').remove();
                        if(htm.length > 0){
                            $('.lesson .currentItem').find('dd').last().before('<dd class="less_step"><span>步骤：</span><dl>'+htm+'</dl></dd>');
                        }
                    }
                }
            })
            .on('tap','.edit',function(){
                var currentPage = $(this).parents('.list').attr('id'),
                // currentState = currentPage.substring(0, currentPage.indexOf('_')),
                    target = $(this).parents('dl'),
                //targetIndex = $(this).parents('.list').data('index'),
                    pageName = ['课时','步骤','阶段'],
                    pageNameItem;
                if(currentPage == 'lesson'){
                    pageNameItem = pageName[0];
                }
                if(currentPage == 'step'){
                    pageNameItem = pageName[1];
                }
                if(currentPage == 'section'){
                    pageNameItem = pageName[2];
                }
                edit(target,currentPage,pageNameItem);
            })
            .on('tap','.surePrice',function(){
                createOrUpdateTheBox($(this));
            })
            .on('tap','.chooseProduct',function(){
                getProductList();
            })
            .on('tap','.productItem i,.noDataBtn',function(){
                if(!$(this).hasClass('noDataBtn')){
                    var target = $(this).parent('.productItem');
                    target.addClass('hasChoiceProd').siblings().removeClass('hasChoiceProd');
                    var prodname = target.find('.prod_name').text();
                    $('input[name=productName]').val(prodname);
                }
                if($(this).parents('#userLessonList').length > 0){
                    userLessonListdialog.hide();
                }else if($(this).parents('#chooseProduct').length > 0){
                    chooseProductDialog.hide();
                }
            })
            .on('tap','#courseBox i',function(){
                var tarParent = $(this).parent('li');
                //console.log();

                tarParent.addClass('hasChoiceCourse').siblings().removeClass('hasChoiceCourse');

            })
    }


    //批量添加阶段课时
    function sectionLessonBatch(_tarSLB,dorder,className,name,sectionId,id,lastSL){
        target = _tarSLB.parents('.pageBox').children('.sectionLesson');
        var sectionId = _tarSLB.parents('.pageBox').data('id'),
            _tar = $('.currentSubPage'),
            _sdDay = parseInt(_tar.find('.section_a_sd').text()),
            _edDay = parseInt(_tar.find('.section_a_ed').text()),
            _earliesttime = _tar.find('input[name=earliesttime_in_day]').val(),
            _latestttime = _tar.find('input[name=latestttime_in_day]').val(),
            _lesson_id = _tar.find('.userLesson_id').data('id'),
            _suggesttime = _tar.find('input[name=suggesttime_in_day]').val();
        //_dayOrder =  _tar.find('input[name=day_order]').val();

        if(dorder < _sdDay || dorder > _edDay){
            bainx.broadcast('您填写的天数不在范围内，请重新填写');
            _tar.find('input[name=day_order]').val('').focus();
            return;
        }


        //引用模版
        if(firstNextSectionLesson){
            var changeData = {
                vo:{
                    earliesttimeInDay : _earliesttime,
                    latestttimeInDay : _latestttime,
                    suggesttimeInDay : _suggesttime,
                    lessonId : _lesson_id,
                    dayOrder : dorder
                }
            }
            if(time_range(_earliesttime, _latestttime, _suggesttime)) {
                oparetion(changeData, 'sectionLesson', target, className, name)
                if(lastSL){
                    _tar.find('.userLesson_id').text('请选择课时').attr('data-id','');
                }

            }
        }
        //更新最新数据
        else{
            data = {
                boxId:boxId,
                id:id,
                sectionId : sectionId,
                earliesttimeInDay : _earliesttime,
                latestttimeInDay : _latestttime,
                suggesttimeInDay : _suggesttime,
                lessonId : _lesson_id,
                dayOrder : dorder
            }
            if(time_range(_earliesttime, _latestttime, _suggesttime)){
                Data.createOrUpdateMineSectionLesson(data).done(function(res){
                    oparetion(res,'sectionLesson',target,className,name)
                    if(lastSL){
                        _tar.find('.userLesson_id').text('请选择课时').attr('data-id','');
                    }
                })
            }
        }
    }


    //get产品
    function getProductList(){
        $('#chooseProduct').remove();
        chooseProductDialog = '';
        $('input,textarea').blur();
        if(!chooseProductDialog) {
            require(['h5/js/common/transDialog'],function(Dialog) {
                chooseProductDialog = new Dialog($.extend({}, Dialog.templates.bottom, {
                    template: '<div class="grid" id="chooseProduct"><ul></ul></div>'
                }))
            })
            chooseProductDialog.show();
            var element = $('#chooseProduct'),
                prodName = $('input[name=productName]').val(),
                nexter = new Nexter({
                    element: element,
                    dataSource: Data.getMineScProductVOList,
                    data:{
                        prodName:prodName
                    },
                    enableScrollLoad: true,
                }).load().on('load:success', function (res)
                {

                    if (res.list.length > 0) {
                        var html =[],
                            template = '<div class="productItem col col-50" data-id="{{id}}" data-useremind="{{resUseRemind}}" data-multimediaresid="{{multimediaResId}}"><i></i><dt><span></span><img src="{{listimg}}" /></dt><dd><p class="ellipsis prod_name">{{prodName}}</p><p class="ellipsis">产品效果：{{prodResult}}</p><p class="ellipsis">产品用途：{{prodPurpose}}</p></dd></div>',
                            _index = 0;
                        $.each(res.list, function(index, item) {
                            var img = item.prodPicUrls,
                                isJpg = /\.jpg/gi.test(img);
                            //item.listimg = img + (isJpg ? '!300q75' : '');
                            item.listimg = img ? img : imgPath + 'common/images/img_icon.png';
                            if (index % 2 == 0) {
                                html.push('<li class="row">');
                            }
                            html.push(bainx.tpl(template,item));
                            if (index % 2 == 1) {
                                html.push('</li>');
                            }
                            _index = index;
                        });
                        if (_index % 2 == 0) {
                            html.push('<div class="col col-50 goods goods-null fb fvc fac"></div></li>');
                        }

                        $('#chooseProduct ul').append(html.join(''));
                    }
                    else{
                        $('#chooseProduct ul').append('<li class="notData"><img src="'+imgPath+'/common/images/loading_fail.png"/><p>灰常抱歉，没有搜到产品哦</p><span class="btn noDataBtn">返回</span></li>');
                    }
                })
        }
        chooseProductDialog.show();
    }

    //弹出层(检查阶段时长大于等于创建的阶段课时关系)
    function pop(nexted){
        $('.main').find('.sectionLessonPage').addClass('hide');
        $('#page5,.toolbar').removeClass('hide');
        //var _currentItem = $('.currentSubPage').find('.sectionLesson').find('dl');
        //var nessLength = parseInt($('.currentItem .section_a_ed').text()),
        //    actrueLength = parseInt($('.currentSubPage').find('.sectionLesson').find('dl').last().find('.sectionLesson_a_dayOrder').text()),
        //    tips='确定要返回吗？',
        //    cancelText = '取消',
        //    confirmHtm = ' <span class="btn confirmBtn col">确定</span>',
        //    canNext = nessLength != actrueLength ||  $('.currentSubPage').length == 0;
        //if(nexted){
        //    tips='';
        //    confirmHtm='';
        //    cancelText = '马上关联';
        //    var nessArr  = [],//需要的长度
        //        actrueArr = [];//实际长度
        //    $('.section .grid').each(function(index){
        //        var nessLen = parseInt($(this).find('.section_a_ed').text());
        //        nessArr.push(nessLen);
        //    })
        //    $('.sectionLessonPage').each(function(index){
        //        var actrueLen = parseInt($(this).find('.sectionLesson').find('dl').last().find('.sectionLesson_a_dayOrder').text());
        //        actrueArr.push(actrueLen);
        //    })
        //    canNext = false;
        //    $.each(nessArr,function(index,item){
        //        // console.log(item,actrueArr[index]);
        //        if(item != actrueArr[index]){
        //            canNext = true;
        //        }else{
        //            canNext = false;
        //        }
        //    })
        //    if($('.currentSubPage').length == 0){
        //        canNext = true;
        //    }
        //}
        //if(canNext){//阶段时长要大于等于创建的阶段课时关系
        //    //if($('.telDialog').length == 0){
        //    $('body').append('<section class="telDialog wl-trans-dialog translate-viewport grid" style="display: block"><div class="cont bounceIn"><p class="tips">您所设置的课时关联要大于或等于阶段时长哦，您现在尚未完成阶段与课时的关联，'+tips+'</p><div class="btngroup row"><span class="btn reset col">'+cancelText+'</span>'+confirmHtm+'</div></div></section>');
        //    hasRelate = true;
        //
        //    // }else{
        //    //  $('.telDialog').show();
        //    // }
        //}else{
        //    hasRelate = false;
        //    $('.main').find('.sectionLessonPage').addClass('hide');
        //    $('#page5,.toolbar').removeClass('hide');
        //}
        //$('.telDialog').on('tap', '.btngroup .btn', function (event) {
        //    event.preventDefault();
        //    $('.telDialog').remove();
        //}).on('tap', '.confirmBtn', function (event) {
        //    $('.main').find('.sectionLessonPage').addClass('hide');
        //    $('#page5,.toolbar').removeClass('hide');
        //    $('.telDialog').remove();
        //})
    }

    //验证
    function validate(target){
        var _name = target.find('.input_name').val(),
            _order = target.find('.input_order').val(),
            _short_name =  target.find('.input_short_name').val(),
            _introduce = target.find('.textarea_introduce').val(),
            _note = target.find('.textarea_note').val(),
            _interval = target.find('input[name=step_interval]').val(),
        //_duration = target.find('.input_duration').val(),
            _productName = target.find('input[name=productName]').val(),
            _sd = target.find('.input_sd').val(),
            _ed = target.find('.input_ed').val(),
            _earlyTime = target.find('input[name=earliesttime_in_day]').val(),
            _latestTime = target.find('input[name=latestttime_in_day]').val(),
            _suggestTime = target.find('input[name=suggesttime_in_day]').val(),
            _dayOrder = target.find('input[name=day_order]').val(),
            _userLessobId = target.find('.userLesson_id').text(),
            hasOK = false;

        if(!_suggestTime && _suggestTime == ''){
            bainx.broadcast('请填写建议时间~');
            hasOK = true;
        }
        if(_userLessobId == '请选择课时'){
            bainx.broadcast('请选择课时~');
            hasOK = true;
        }
        if(!_latestTime && _latestTime == ''){
            bainx.broadcast('请填写结束时间~');
            hasOK = true;
        }
        if(!_earlyTime && _earlyTime == ''){
            bainx.broadcast('请填写起始时间~');
            hasOK = true;
        }

        if(!_ed && _ed == ''){
            bainx.broadcast('请填写阶段结束时间~');
            hasOK = true;
        }
        if(!_sd && _sd == ''){
            bainx.broadcast('请填写阶段开始时间~');
            hasOK = true;
        }
        if(!_productName && _productName == ''){
            bainx.broadcast('请输入产品~');
            hasOK = true;
        }
        if(!_note && _note == ''){
            bainx.broadcast('请填写备注~');
            hasOK = true;
        }
        if(!_introduce && _introduce == ''){
            bainx.broadcast('请填写介绍~');
            hasOK = true;
        }
        if(!_interval && _interval == ''){
            bainx.broadcast('请填写间隔时长~');
            hasOK = true;
        }
        if(!_short_name && _short_name == ''){
            bainx.broadcast('请填写简称~');
            hasOK = true;
        }
        if(!_order && _order == ''){
            bainx.broadcast('请填写排序~');
            hasOK = true;
        }
        if(!_name && _name == ''){
            bainx.broadcast('请填写名称~');
            hasOK = true;
        }
        if(!_dayOrder && _dayOrder == ''){
            bainx.broadcast('请填写天数~');
            hasOK = true;
        }
        return hasOK
    }

    //删除成功之后的操作
    function deleteOK(target,className){
        bainx.broadcast('删除成功！');
        targetIndex =  target.index();
        if(className == 'lesson'){
            // console.log(target.data('id'));
            //如果是删除的是模版、、并且已经新增了、、也有了步骤

            if($('.main').find('.stepPage_add'+targetIndex)){
                $('.stepPage_add'+targetIndex).remove();
            }

            if(target.data('id')){
                // $('.stepPage_add'+targetIndex).remove();
                $('.stepPage_add').each(function(stepInx){
                    var curClassName =  $(this).attr('id');
                    // console.log(curClassNameArr[2],targetIndex);
                    console.log($(this).data('index'));
                    $(this).attr('id','stepPage_add'+($(this).data('index')-1));
                });

            }


            $('.stepPage').each(function(){
                if($(this).data('id') == target.data('id')){
                    $(this).remove();
                }

            })




            $('#userLessonList').remove();
            userLessonListdialog = '';
        }

        if(className == 'section'){

            if($('.main').find('.sectionLessonPage_add'+targetIndex)){
                $('.sectionLessonPage_add'+targetIndex).remove();
            }

            if(target.data('id')){
                // $('.stepPage_add'+targetIndex).remove();
                $('.sectionLessonPage_add').each(function(stepInx){
                    var curClassName =  $(this).attr('id');
                    // console.log(curClassNameArr[2],targetIndex);
                    console.log($(this).data('index'));
                    $(this).attr('id','sectionLessonPage_add'+($(this).data('index')-1));
                });

            }


            $('.sectionLessonPage').each(function(){
                if(target.data('id') == $(this).data('id')){
                    $(this).remove();
                }
            })

        }
        var targetHandle = target.parents('.pageBox').find('.handle'),
            parentTarget = target.parents('.pageBox');
        if(className == 'step'){
            //console.log(target,targetHandle);
            orderNoRepeat(targetHandle,className,'步骤')
        }
        if(className == 'section'){
            orderNoRepeat(targetHandle,className,'阶段',target)
        }
        if(targetHandle.find('.ok_btn').hasClass(className+'_edit_btn') && target.hasClass('targetEdit')){       //证明是编辑并且要删除的是正在编辑的
            targetHandle.find('input').each(function(){
                $(this).val('');
            })
            targetHandle.find(' textarea').each(function(){
                $(this).val('');
            })
        }
        target.remove();
    }

    //添加步骤跟阶段关联
    function addSubPage(target,className,name,parentName,parentClassName,loadTamplate){
        var _index = target.parents('.grid').index();
        $('body').find('.targetEdit').removeClass('targetEdit');
        $('.'+className+'Page_'+_index).remove();
        var lessonName = target.parents('.grid').find('dd').eq(0).children('b').text(),
            lessonId = target.parents('.grid').data('id'),
            _dur_time = '';
        if(className == 'sectionLesson'){
            _dur_time ='，'+ target.parents('.grid').find('.firstToLast').html();
        }
        var flagClassName = lessonId ? className+'Page_'+lessonId : className+'Page_add'+_index,
            _addCla = lessonId ? '' : className+'Page_add';

        var steptpl = '<div id="'+flagClassName+'" class="pageBox '+_addCla+' '+className+'Page '+className+'Page_'+_index+'" data-index="'+_index+'" data-id="'+lessonId+'"><div class="title">请为<span class="sub_lessonName">'+lessonName+'</span>添加'+name+'<span>'+_dur_time+'</span></div> <div class="'+className+' list" id="'+className+'"></div><div class="addBtn add_'+className+'_btn _addBtn"></div><div class="'+className+'_handle handle"></div><div class="returnBack return'+className+'"><span>返回'+parentName+'</span></div></div> ',
            _target = $('.main');
        _target.append(steptpl);
        if(loadTamplate){
            $('.page-content').css('padding-bottom',0);
            showList(className,target);

        }
        $('.toolbar').addClass('hide');
        var parentTitleName = target.parents('.grid').find('.'+parentClassName+'_a_name').text();
        $('.pageBox').removeClass('currentSubPage');
        $('.'+className+'Page_'+_index).addClass('currentSubPage').find('.title').find('.sub_lessonName').text(parentTitleName);
        //$('.'+className+'Page_'+index).addClass('currentSubPage');
        target.parents('.pageBox').addClass('hide');
        $('.list').find('.grid').removeClass('currentItem');
        target.parents('.grid').addClass('currentItem');

    }

    //获取盒子信息
    function getMineBoxInfo(){
        if(URL.param.boxId1){
            var data={
                boxId:URL.param.boxId1
            }
            Data.getMineBoxInfo(data).done(function(res){
                var vo = res.vo;
                $('.box_name').val(vo.boxName);
                $('.textarea_introduce').val(vo.boxIntroduce);
                $('.textarea_note').val(vo.boxNote);
            })
        }
    }

    //获取课程信息
    function getCourse(){
        var data={
            boxId:boxId
        }
        Data.getCourseInfo(data).done(function(res){
            if(res.has==1){
                var vo = res.vo;
                courseId=vo.id;
                $('.course_name').val(vo.courseName);
                $('.course_short_name').val(vo.courseShortName);
                $('.course_introduce').val(vo.courseIntroduce);
                $('.course_note').val(vo.courseNote);
            }
        })
    }

    //获取经验库步骤
    function getExpertItem(items){
        var tpl = '<li class="row" data-stepinterval="{{stepInterval}}" data-prodid="{{prodId}}" data-produseremind="{{prodUseRemind}}" data-multimediaresourceid="{{multimediaResourceId}}" data-multimediauseremind="{{multimediaUseRemind}}" data-steptype="{{stepType}}"><div class="choice fb fac fvc stepChoice choiceDialog"></div><div class="col col-5 fb fac fvc stepOrderEx" data-steporder="{{stepOrder}}">步骤{{stepOrder}}</div><div class="col col-17 borderL"><p>步骤名:<span class="stepName">{{stepName}}</span></p><p>步骤简称:<span class="stepShortName">{{stepShortName}}</span></p><p>使用产品:<span class="productName">{{prodName}}</span></p><i></i></div></li>',
            html=[];
        $.each(items,function(index,item){
            html.push(bainx.tpl(tpl,item))
        })
        return html.join('');
    }

    //获取课时列表
    function getlessonItems(items){
        var tpl = '<li  data-id="{{id}}"><div class="borderl"><p ><span>基础信息</span></p><p>课时名：<span class="lessonName answer">{{lessonName}}</span></p><p>课时简称：<span class="lessonShortName answer">{{lessonShortName}}</span></p></div><div class="row borderl"><div class="">课时介绍:</div><div class="col"><span class="lessonIntroduce answer">{{lessonIntroduce}}</span></div> </div><div class="row borderl"><div>课时备注:</div><div class="col"><span class="lessonNote answer">{{lessonNote}}</span></div> </div>{{stepHtm}}<div class="choice lessonChoice choiceDialog"><i></i></div></li>',
            html=[],
            htmlTml = '';

        $.each(items,function(index,item){
            item.stepHtm = '';
            if(item.lessonStepVOList){
                var step=[],
                    stepTpl = '<dd class="row"><div class="stepItemDot"><i></i>步骤{{stepOrder}}</div><div class="col"><div class="grid"> <div class="row"><div>步骤名：</div><div class="col answer">{{stepName}}</div></div><div class="row"><div>步骤简称：</div><div class="col answer">{{stepShortName}}</div></div><div class="row"><div>步骤类型：</div><div class="col answer">{{stepType}}步骤</div></div><div class="row"><div>与上一个步骤之间的间隔：</div><div class="col answer">{{stepInterval}}</div></div><div class="row"><div>步骤介绍：</div><div class="col answer">{{stepIntroduce}}</div></div><div class="row"><div>步骤备注：</div><div class="col answer">{{stepNote}}</div></div></div></div></dd>',
                    stepTypeTxt = ['','普通','特效'];
                $.each(item.lessonStepVOList,function(index,itemStep){
                    itemStep.stepType = stepTypeTxt[itemStep.stepType];
                    step.push(bainx.tpl(stepTpl,itemStep))
                })
                item.stepHtm = '<div><p class="borderl">步骤：</p><dl class="less_step grid">'+step.join('')+'</dl></div> ';
                html.push(bainx.tpl(tpl,item))
            }
        })
        htmlTml = html.join('');
        if(html.length == 0){
            htmlTml = '<li class="notData"><img src="'+imgPath+'/common/images/loading_fail.png"/><p>灰常抱歉，没有有效课时哦</p><span class="btn noDataBtn">返回</span></li>'
        }
        return htmlTml;
    }

    //添加
    function add(name,target,className){
        var _sectionHtm = '',
            _stepHtml = '',
            tpl;
        if(className == 'section'){
            var _listLast = target.parents('.pageBox').find('.list').children('dl').last(),
                _nextsd = 1;
            if(_listLast.length > 0){
                var _endDay = parseInt(_listLast.find('.section_a_ed').text());
                _nextsd = _endDay + 1;
            }
            _sectionHtm = '<!--<dd><span>'+name+'时长：</span><input type="tel" name="section_duration" class="input_duration" /> </dd>--><dd><span>'+name+'编号：</span><select name="section_order" class="input_order" /><!--<input type="tel" name="section_order" class="input_order"/> --></dd><dd><span>该阶段从：第</span><input type="tel" name="section_sd" class="input_sd" value="'+_nextsd+'"/> <span>天开始，到第</span><input type="tel" name="section_ed" class="input_ed"/><span>天结束</span> </dd>';
        }
        if(className == 'step'){
            _stepHtml = '<dd><span>'+name+'排序：</span><select name="section_order" class="input_order" /><!--<input type="tel" name="step_order" class="input_order"/>--><p><span>与上一个'+name+'之间的间隔：</span><input type="tel" name="step_interval"/>秒</p></dd><dd class=" step_choice_type"><span>'+name+'类型：</span><div class="displayB"> <b class="choice active chooseItem" data-id="1">普通步骤</b><b class="choice chooseItem" data-id="2">特效步骤</b></div></dd>';
        }
        tpl = '<dl class="grid"><dd><span>基础信息</span><p><span>'+name+'名：</span><input type="text" name="'+className+'_name" class="input_name ellipsis "/></p><p><span>'+name+'简称：</span><input type="text" name="'+className+'_short_name" class="input_short_name ellipsis"/></p></dd>'+_stepHtml+_sectionHtm+'<dd><span>'+name+'介绍</span><textarea name="'+className+'_introduce" class="textarea_introduce"></textarea></dd><dd><span>'+name+'备注</span><textarea name="'+className+'_note" class="textarea_note"></textarea> </dd><dd><span id="'+className+'_okBtn" class="'+className+'_ok_btn ok_btn btn">确定</span></dd></dl>';
        if(className == 'sectionLesson'){
            tpl = '<dl class="grid"><dd><span>第</span><input name="day_order" type="tel" />天</dd><dd>要求<input type="time" name="earliesttime_in_day"/>到<input type="time" name="latestttime_in_day"/>时候使用<span class="userLesson_id">请选择课时</span></dd><dd>建议在<input type="time" name="suggesttime_in_day"/>使用<span class="userLesson_id">请选择课时</span></dd><dd><span class="sectionLesson_ok_btn btn ok_btn">确定</span><span class="sectionLesson_batch_btn btn">批量添加</span></dd></dl>';
        }
        if(target.children('.grid').length == 0){
            target.append(tpl);
        }
        else{
            $('.sectionLesson_batch_btn').show();
            target.find('input').each(function(){
                $(this).val('');
            })
            target.find('textarea').each(function(){
                $(this).val('');
            })
        }
        var productTpl='';
        if(className == 'step'){
            if($('#expertdb').hasClass('addStepPage')){
                productTpl = '<dd class="chooseProdDD"><span>选择产品</span><input type="text" placeholder="请输入产品名（可不填）" name="productName" class="ellipsis "/> <span class="chooseProduct btn">选择</span></dd>';
            }else{
                productTpl = '<dd class="chooseProdDD"><span>选择产品</span><input type="text" placeholder="请输入产品名（可不填）" name="productName" class="ellipsis "/></dd>';
            }
            $('.chooseProdDD').remove();
            target.find('dd').last().before(productTpl);
        }

        if(className == 'sectionLesson'){
            $('input[name=earliesttime_in_day]').attr('data-old','');
            $('input[name=latestttime_in_day]').attr('data-old','');
        }
        target.css('height','auto');
        orderNoRepeat(target,className,name);
        target.parents('.pageBox').find('.ok_btn').removeClass(className+'_edit_btn');
    }

    //步骤&&阶段的排序
    function  orderNoRepeat(target,className,name,deleteItem){
        //console.log(target,target.find('.input_order'));
        if(target.find('.input_order').length > 0){
            var currentList = target.parents('.pageBox').find('.list'),
                currentListOrder = [],
                currentSelect =  target.find('.input_order')[0],
                arr=[];
            //删除所有option值
            for(var i=0;i<currentSelect.options.length;)
            {
                currentSelect.removeChild(currentSelect.options[i]);
            }
            for(var i=1;i<11;i++){
                arr.push(i);
            }
            currentList.find('dl').each(function(){
                var _orderItem = $(this).find('.'+className+'_a_order').text();
                currentListOrder.push(_orderItem);
            })
            if(deleteItem){
                var delTxt = deleteItem.find('.'+className+'_a_order').text();
                //获取下标
                Array.prototype.indexOf = function(val) {
                    for (var i = 0; i < this.length; i++) {
                        if (this[i] == val) return i;
                    }
                    return -1;
                };
                //删除元素
                Array.prototype.remove = function(val) {
                    var index = this.indexOf(val);
                    if (index > -1) {
                        this.splice(index, 1);
                    }
                };
                //调用
                currentListOrder.remove(delTxt);
            }
            var arr2 = chaji_array(arr,currentListOrder);
            $.each(arr2,function(index,item){
                currentSelect.options.add(new Option('第'+item+name,item));

            })
        }
    }

    //修改步骤&&阶段时候的排序
    function editOrder(target,name,className){
        var flag = false,
            currentListOrder = [],
            currentVal = target.parents('.pageBox').find('select').val(),
            currentOrderVal = target.parents('.pageBox').find('.targetEdit').find('.'+className+'_a_order').text(),
            currentList = target.parents('.pageBox').find('.list');
        currentList.find('dl').each(function(){
            var _orderItem = $(this).find('.'+className+'_a_order').text();
            currentListOrder.push(_orderItem);
        })
        // console.log(currentListOrder,currentVal);
        $.each(currentListOrder,function(index,item){
            if(item == currentVal ){
                flag = true;
            }
        })
        if(target.hasClass(className+'_edit_btn') && currentVal == currentOrderVal){
            flag = false;
        }
        if(flag){
            bainx.broadcast('您已经有这个'+name+'的排序，如果需要修改，请先修改这个'+name+'的排序');
        }
        return flag
    }

    //show列表获取数据调用getPageList
    function showList(className,btn){
        var data = {
            boxId:boxId
        }
        var target =  $('.'+className);
        //target.find('dl').remove()
        if(btn){
            var index = btn.parents('.grid').index();
            target = $('.'+className+'Page_'+index).find('.'+className);
        }
        if(target.find('dl').length == 0){
            if(className == 'lesson'){//课时
                Data.getLessonVOList(data).done(function(res){
                    if(res.has == 1){
                        getPageList(res.list,'课时',className,target)
                    }
                })
            }
            if(className == 'step'){//步骤
                data = {
                    boxId:boxId,
                    lessonId:btn.parents('dl').data('id')
                }
                Data.getLessonStepList(data).done(function(res){
                    if(res.has == 1){
                        getPageList(res.list,'步骤',className,target)
                    }
                    var _handle = target.parents('.pageBox').find('.handle'),
                        _title = target.parents('.pageBox').find('.title').height(),
                        _addBtn = target.parents('.pageBox').find('.addBtn').height(),
                        wh = $(window).height();
                    if(_handle.find('.grid').length == 0){
                        //_handle.height(wh-_title-_addBtn-50-target.height()-30);
                    }
                })
            }
            if(className == 'section'){//阶段
                Data.getCourseSectionList(data).done(function(res){
                    if(res.has == 1){
                        getPageList(res.list,'阶段',className,target);
                        $('.addRelateSectionLesson').each(function(){
                            addSubPage($(this),'sectionLesson','阶段课时','阶段','section',true);
                            $('.sectionLessonPage').addClass('hide');
                            $('#page5,.toolbar').removeClass('hide');
                        })
                    }
                })
            }
            if(className == 'sectionLesson'){//阶段课时关联
                data = {
                    boxId:boxId,
                    sectionId:btn.parents('dl').data('id')
                }
                Data.getSectionLessonVOList(data).done(function(res){
                    if(res.has == 1){
                        getPageList(res.list,'阶段课时',className,target)
                    }
                    var _handle = target.parents('.pageBox').find('.handle'),
                        _title = target.parents('.pageBox').find('.title').height(),
                        _addBtn = target.parents('.pageBox').find('.addBtn').height(),
                        wh = $(window).height();
                    if(_handle.find('.grid').length == 0){
                        //_handle.height(wh-_title-_addBtn-50-target.height()-30);
                    }
                })
            }
        }
    }

    //判断设置的建议时间是否在要求的时间段内
    function time_range(beginTime, endTime, nowTime) {
        //console.log(beginTime,endTime,nowTime)
        var strb = beginTime.split (":");

        if (strb.length < 2) {
            return false;
        }
        var stre = endTime.split (":");
        if (stre.length < 2) {
            return false;
        }
        var strn = nowTime.split (":");
        if (stre.length < 2) {
            return false;
        }
        var b = new Date ();
        var e = new Date ();
        var n = new Date ();
        b.setHours (strb[0]);
        b.setMinutes (strb[1]);
        e.setHours (stre[0]);
        e.setMinutes (stre[1]);
        n.setHours (strn[0]);
        n.setMinutes (strn[1]);
        if (n.getTime () - b.getTime () >= 0 && n.getTime () - e.getTime () <= 0) {
            return true;
        } else {
            alert ("您所设置的建议时间是：" + n.getHours () + ":" + n.getMinutes () + "，不在要求时间范围内！");
            return false;
        }
    }

    //show列表
    function getPageList(items,name,className,target,item){
        if(target.find('dl').length > 0){
            target.find('dl').removeClass('targetAdd');
        }
        var _durationHtm = '',
            lessonHtm = '',
            _stepHtml = '',
            _btnHtml = '',
            tpl = '',
            html=[];
        if(className == 'lesson'){
            _btnHtml = '<span class="'+className+'_btn btn addStep extra">添加步骤</span>';
        }
        if(className == 'step'){
            _stepHtml = '<dd><span>'+name+'排序：</span>第<b class="'+className+'_a_order">{{'+className+'Order}}</b>步骤<p><span>与上一个步骤之间的间隔：</span><b class="'+className+'_a_interval">{{'+className+'Interval}}</b>秒</p></dd><dd><span>步骤类型：</span><b class="'+className+'_a_Type" data-id="{{stepType}}">{{stepTypeTxt}}</b></dd><dd><span>产品名：</span><b class="'+className+'_a_prodName" data-id="{{prodId}}" data-useremind="{{prodUseRemind}}" data-multimediaresid="{{multimediaResourceId}}" data-multimediaUseRemind="{{multimediaUseRemind}}">{{prodName}}</b></dd>';
        }
        if(className == 'section'){
            _durationHtm = '<dd><span>'+name+'顺序：</span><b class="'+className+'_a_order">{{'+className+'Order}}</b><p><span>'+name+'时长：</span><b class="'+className+'_a_duration">{{'+className+'Duration}}</b></p><p class="firstToLast"><span>该'+name+'从第</span><b class="'+className+'_a_sd">{{'+className+'Sd}}</b><span>天开始，到第</span><b class="'+className+'_a_ed">{{'+className+'Ed}}</b>天结束</p></dd>';
            _btnHtml = '<span class="'+className+'_btn btn addRelateSectionLesson extra">添加课时与阶段关联</span>';
        }
        if(className == 'sectionLesson'){
            tpl = '<dl class="grid targetAdd" data-id="{{id}}" data-index="{{_idx}}"><dd>第<b class="'+className+'_a_dayOrder">{{dayOrder}}</b>天</dd><dd>要求<b class="'+className+'_a_earliesttime">{{earliesttimeInDay}}</b>到<b class="'+className+'_a_latestttime">{{latestttimeInDay}}</b>时候使用<b class="'+className+'_a_lesson_name" data-lessonid="{{lessonId}}">{{_lessonName}}</b></dd><dd>建议在<b class="'+className+'_a_suggesttime">{{suggesttimeInDay}}</b>使用<b class="'+className+'_a_lesson_name" data-lessonid="{{lessonId}}">{{_lessonName}}</b></dd><dd><span class="'+className+'_btn btn edit" id="'+className+'_EditBtn">编辑</span><span class="'+className+'_btn btn delete">删除</span></dd></dl>';
        }
        else {
            tpl = '<dl class="grid targetAdd" data-id="{{id}}" data-index="{{_idx}}"><dd><span>基础信息</span><p><span>' + name + '名：</span><b class="' + className + '_a_name" {{prodmsg}}>{{' + className + 'Name}}</b></p><p><span>' + name + '简称：</span><b class="' + className + '_a_short_name">{{' + className + 'ShortName}}</b></p></dd>' + _stepHtml + _durationHtm + '<dd><span>' + name + '介绍</span><b class="' + className + '_a_intro displayB">{{' + className + 'Introduce}}</b></dd><dd><span>' + name + '备注</span><b class="' + className + '_a_note displayB">{{' + className + 'Note}}</b></dd><dd class="less_step">{{lessonHtm}}</dd><dd><span class="' + className + '_btn btn edit">编辑</span><span class="' + className + '_btn btn delete">删除</span>' + _btnHtml + '</dd></dl>';
        }
        var stepTypeArr = ['','普通','特效'];
        if(item){
            item.lessonHtm = '';
            if(className == 'lesson' && item.lessonStepVOList){
                var step=[],
                    stepTpl = '<dd  class="row"><p>步骤{{stepOrder}}:</p><b class="col">{{stepName}}</b></dd>';
                $.each(item.lessonStepVOList,function(index,itemStep){
                    step.push(bainx.tpl(stepTpl,itemStep))
                })
                item.lessonHtm = '<p>步骤：</p><dl >'+step.join('')+'</dl>';
            }
            if(className == 'step'){
                var _prod_name = $('input[name=productName]').val()
                item.prodName = _prod_name;
                //item.prodHtm = typeof _prod_name != 'undefined'  && _prod_name != '' ? prodTpl : '';
            }
            item._lessonName = $('.userLesson_id').text();
            item.stepTypeTxt = stepTypeArr[item.stepType];
            html.push(bainx.tpl(tpl,item))
        }
        else{
            $.each(items,function(index,item){
                item.lessonHtm = '';
                if(className == 'lesson' && item.lessonStepVOList){
                    var step=[],
                        stepTpl = '<dd  class="row"><p>步骤{{stepOrder}}：</p><b class="col">{{stepName}}</b></dd>';
                    $.each(item.lessonStepVOList,function(index,itemStep){
                        step.push(bainx.tpl(stepTpl,itemStep))
                    })
                    item.lessonHtm = '<p class="borderL">步骤：</p><dl>'+step.join('')+'</dl>';
                }
                if(className == 'step'){
                    item.prodmsg = 'data-id="'+item.prodId+'" data-useremind="'+item.prodUseRemind+'" data-multimediaresid="'+item.multimediaResourceId+'" data-multimediaUseRemind="'+item.multimediaUseRemind+'"';
                }
                item.stepTypeTxt = stepTypeArr[item.stepType];
                item._lessonName = item.lessonName;
                html.push(bainx.tpl(tpl,item))
            })
        }
        target.append(html.join(''));
        if(className == 'step'){
            var firstStepListLength = target.find('dl').length;
            target.attr('data-length',firstStepListLength);
            //target.parents('.pageBox').find('.returnBack').height(wh-_title-);
        }
    }

    //编辑
    function edit(target,className,name){
        var _tar = target.parents('.pageBox').children('.handle');
        if(_tar.children('dl').length == 0){
            add(name,_tar,className)
        }
        target.addClass('targetEdit').siblings().removeClass('targetEdit');
        target.parents('.pageBox').find('.ok_btn').addClass(className+'_edit_btn');
        var _targetEdit = $('.targetEdit'),
            _name = $('input[name='+className+'_name]'),
            _short_name =  $('input[name='+className+'_short_name]'),
            _intro = $('textarea[name='+className+'_introduce]'),
            _note = $('textarea[name='+className+'_note]'),
            a_name = _targetEdit.find('.'+className + '_a_name').text(),
            a_short_name = _targetEdit.find('.'+className + '_a_short_name').text(),
            a_intro = _targetEdit.find('.'+className + '_a_intro').text(),
            a_note = _targetEdit.find('.'+className + '_a_note').text(),
            a_order =  parseInt(_targetEdit.find('.'+className + '_a_order').text());
        if(className == 'section'){
            var _sd = $('input[name=section_sd]'),
                _ed= $('input[name=section_ed]'),
                a_sd = _targetEdit.find('.'+className + '_a_sd').text(),
                a_ed= _targetEdit.find('.'+className + '_a_ed').text();
            _sd.val(a_sd).attr('data-old',a_sd);
            _ed.val(a_ed).attr('data-old',a_ed);
        }
        if(className == 'step'){
            if($('.chooseProduct').length == 0){
                $('input[name=productName]').after('<span class="chooseProduct btn">选择</span>');
            }
            var _interval = $('input[name=step_interval]'),
                a_interval = _targetEdit.find('.'+className + '_a_interval').text(),
                _type = $('.step_choice_type').find('b'),
                a_type = _targetEdit.find('b').eq(4).text(),
                a_typeId=_targetEdit.find('b').eq(4).data('id'),
                _prodName= $('input[name=productName]'),
                a_prodName=_targetEdit.find('.'+className + '_a_prodName').text();
            if(a_prodName ==null){
                $('.chooseProdDD').addClass('hide');
            }
            else{
                $('.chooseProdDD').removeClass('hide');
            }
            _interval.val(a_interval);
            _type.removeClass('active');
            _type.eq(a_typeId-1).addClass('active');
            _prodName.val(a_prodName);
        }
        if(className == 'sectionLesson'){
            var _earliesttime = $('input[name=earliesttime_in_day]'),
                _latestttime =  $('input[name=latestttime_in_day]'),
                _lesson_name = $('.userLesson_id'),
                _suggesttime = $('input[name=suggesttime_in_day]'),
                _dayOrder =  $('input[name=day_order]'),
                _targetEdit = $('.targetEdit'),
                a_earliesttime = _targetEdit.find('.'+className + '_a_earliesttime').text(),
                a_latestttime = _targetEdit.find('.'+className + '_a_latestttime').text(),
                a_lesson_name = _targetEdit.find('.'+className + '_a_lesson_name').text(),
                a_suggesttime = _targetEdit.find('.'+className + '_a_suggesttime').text(),
                a_dayOrder = _targetEdit.find('.'+className + '_a_dayOrder').text();
            _earliesttime.val(a_earliesttime);
            _latestttime.val(a_latestttime);
            _lesson_name.text(a_lesson_name);
            _suggesttime.val(a_suggesttime);
            _dayOrder.val(a_dayOrder);
            $('.sectionLesson_batch_btn').hide();
        }
        _name.val(a_name);
        _short_name.val(a_short_name);
        _intro.val(a_intro);
        _note.val(a_note);
        //_order.val(a_order);
        if(_tar.find('.input_order').length > 0) {
            var currentSelect = _tar.find('.input_order')[0];
            for (var i = 0; i < currentSelect.options.length;) {
                currentSelect.removeChild(currentSelect.options[i]);
            }
            for (var j = 1; j < 11; j++) {
                currentSelect.options.add(new Option('第' + j + name, j));
            }
            _tar.find('select option:nth-child(' + a_order + ')').attr("selected", true);
        }
    }

    //更新数据
    function update(className,name,shortName,introduce,note,duration,order,sd,ed,proName){
        var _targetEdit = $('.targetEdit');
        _targetEdit.find('.'+className+'_a_name').text(name);
        _targetEdit.find('.'+className+'_a_short_name').text(shortName);
        _targetEdit.find('.'+className+'_a_intro').text(introduce);
        _targetEdit.find('.'+className+'_a_note').text(note);
        _targetEdit.find('.'+className+'_a_duration').text(duration);
        _targetEdit.find('.'+className+'_a_order').text(order);
        _targetEdit.find('.'+className+'_a_sd').text(sd);
        _targetEdit.find('.'+className+'_a_ed').text(ed);
        _targetEdit.find('.'+className+'_a_interval').text(duration);
        _targetEdit.find('.'+className+'_a_earliesttime').text(name);
        _targetEdit.find('.'+className+'_a_latestttime').text(shortName);
        _targetEdit.find('.'+className+'_a_lesson_name').text(introduce);
        _targetEdit.find('.'+className+'_a_suggesttime').text(note);
        _targetEdit.find('.'+className+'_a_dayOrder').text(duration);
        _targetEdit.find('.'+className+'_a_Type').text(sd);
        _targetEdit.find('.'+className+'_a_Type').attr('data-id',ed);
        _targetEdit.find('.'+className+'_a_prodName').text(proName);
    }

    //更新或创建盒子
    function createOrUpdateTheBox(btn){
        var   _boxId = $('#page2').data('id'),
            _prodids = btn ? $('.prodids').data('prodids') : '',
            _price = btn ? parseInt($('.prodPrice').val()) * 100 : '',
            _detectReportId = _boxId ? '': rid;
        var data = {
            id:boxId,
            //id:288,
            mineType:$('#page2').find('.active').data('id'),
            boxName:$('input[name=box_name]').val(),
            boxIntroduce:$('textarea[name=box_introduce]').val(),
            boxNote :$('textarea[name=box_note]').val(),
            detectReportId:_detectReportId,
            productIds:_prodids,
            price:_price
        }
        if(btn){
            URL.assign('_boxId1='+boxId);
        }else {
            Data.createOrUpdateBox(data).done(function (res) {
                var vo = res.vo;
                $('#page2').attr('data-id', vo.id);
                boxId = vo.id;
                $('.title .boxName b').text(vo.boxName);
                //console.log(index)

                if(!firstLoadCourseTpl){
                    index = 3;
                    $('body').find('.targetEdit').removeClass('targetEdit');
                    $('#page' + index).removeClass('hide').siblings('.pageBox').addClass('hide');
                }


                if(!URL.param.boxId1){
                    $('#page2').addClass('hide');
                    courseTamplateList()
                }else{
                    index++;
                    $('body').find('.targetEdit').removeClass('targetEdit');
                    $('#page'+index).removeClass('hide').siblings('.pageBox').addClass('hide');
                    if(index==3){
                        getCourse();
                    }
                }

            })
        }
    }

    //上下翻页
    function stepBindEnevt(btn){
        if(btn.hasClass('prev')){
            if(index == 2){
                URL.assign(URL.userReportPage +'?uid='+ _uid + '&box=2&name='+_uName+'&boxId1='+boxId+'&rid='+rid);
            }
            if(!$('.surePrice').hasClass('next')){
                $('.surePrice').addClass('next').removeClass('surePrice').text('下一步');
            }
            //if(index == 3 && !URL.param.boxId1 && $('#courseBox').length == 0){
            ////if(index == 3 && !URL.param.boxId1 && $('#courseBox').hasClass('hide')){
            //        $('#page3').addClass('hide');
            //        courseTamplateList()
            //}
            //else{
            index--;
            $('#page'+index).removeClass('hide').siblings('.pageBox').addClass('hide');
            //}
        }
        else if(btn.hasClass('next')){

            $('input,textarea').blur();
            $('.page-content').css('padding-bottom','45px');

            //没被隐藏
            //if( $('#courseBox').length > 0  && !$('#courseBox').hasClass('hide') ) {
            if( $('#courseBox').length > 0  && !$('#courseBox').hasClass('hide')  && !firstLoadCourseTpl) {
                index = 3;
                fillInTamplate();
                $('body').find('.targetEdit').removeClass('targetEdit');
                $('#page' + index).removeClass('hide').siblings('.pageBox').addClass('hide');
                $('#courseBox').addClass('hide');
                console.log($('.hasChoiceCourse').data('id'));
                $('#courseBox ul').attr('data-id',$('.hasChoiceCourse').data('id'));
                //$('#courseBox').remove();
                return
            }




            if(index == 2){//创建或更新盒子
                var _vTarget = $('#page2');
                // console.log(validate(_vTarget))
                if(!validate(_vTarget)){
                    createOrUpdateTheBox();



                }else{
                    return
                }
            }

            if(index == 3){//创建或更新课程
                if( $('#courseBox').hasClass('hide') || URL.param.boxId1){
                    var _vTarget = $('#page3');
                    if(!validate(_vTarget)) {
                        var
                            data = {
                                boxId: boxId,
                                id: courseId,
                                //id: 388,
                                courseProperty: 2,
                                courseType: 2,
                                courseName: $('input[name=course_name]').val(),
                                courseShortName: $('input[name=course_short_name]').val(),
                                courseIntroduce: $('textarea[name=course_introduce]').val(),
                                courseNote: $('textarea[name=course_note]').val(),
                                mineType: $('#page2').find('.active').data('id')

                            }
                        Data.createOrUpdateCourse(data).done(function (res) {
                            var vo = res.vo;
                            courseId = vo.id;
                            $('#page3').attr('data-id', vo.id);
                            index++;
                            $('body').find('.targetEdit').removeClass('targetEdit');
                            $('#page'+index).removeClass('hide').siblings('.pageBox').addClass('hide');
                            //$('#page'+index).removeClass('hide').siblings('.pageBox').addClass('hide');
                            $('.title .courseName b').text(vo.courseName);
                            showList('lesson')
                        })
                        return
                    }else{
                        return
                    }
                }

            }
            if(index == 4){//创建或更新课时
                if($('.lesson dl').length == 0){
                    bainx.broadcast('您还未添加课时，请先添加课时！');
                    //return;
                }
                else{
                    var lessonLength = $('#page4 .lesson').find('.grid').length;
                    $('.countLesson').text(lessonLength);
                    var lessonIdArr = [];
                    if (firstNextLesson) {
                        if ($('.main').find('.stepPage').length == lessonLength) {
                            $('.lesson .grid').each(function (index_lesItem) {
                                var lessonTarget = $(this);
                                lessonIdArr.push(lessonTarget.data('id'));
                                var _className = 'lesson';
                                var data = {
                                    boxId: boxId,
                                    lessonName: lessonTarget.find('.' + _className + '_a_name').text(),
                                    lessonShortName: lessonTarget.find('.' + _className + '_a_short_name').text(),
                                    lessonIntroduce: lessonTarget.find('.' + _className + '_a_intro').text(),
                                    lessonNote: lessonTarget.find('.' + _className + '_a_note').text(),
                                    lessonProperty: 2
                                }
                                Data.createOrUpdatelesson(data).done(function (res) {
                                    firstNextLesson = false;
                                    //$('.'+_className).find('.grid').remove();
                                    //getPageList('','课时',_className,$('.'+_className),res.vo);


                                    //修改阶段关联里的课时id
                                    $('.sectionLessonPage').each(function () {
                                        var itemSL = $(this).find('.list').find('.grid');
                                        itemSL.each(function () {
                                            var lesId = $(this).find('.sectionLesson_a_lesson_name');
                                            //判断课时是否被删除
                                            //if(!lessonIdArr.contains(lesId.data('lessonid'))){
                                            //    //$(this).remove();
                                            //}
                                            //console.log(lesId.data('lessonid') ,lessonTarget.data('id'));
                                            if (lesId.data('lessonid') == lessonTarget.data('id')) {
                                                lesId.attr('data-lessonid', res.vo.id);
                                                lesId.text(res.vo.lessonName);
                                            }
                                        })
                                    })

                                    $('#stepPage_' + lessonTarget.data('id')).attr('data-id', res.vo.id).attr('id','stepPage_' + res.vo.id);
                                    $('#stepPage_add'+index_lesItem).attr('data-id', res.vo.id).attr('id','stepPage_'+ res.vo.id);

                                    lessonTarget.attr('data-id', res.vo.id);
                                    var targetStepAll = $('#stepPage_' + res.vo.id).find('.step').find('.grid');
                                    var _step = 'step';

                                    targetStepAll.each(function () {

                                        var targetStep = $(this),
                                            dataStep = {
                                                boxId: boxId,
                                                lessonId: lessonTarget.data('id'),
                                                stepName: targetStep.find('.' + _step + '_a_name').text(),
                                                stepShortName: targetStep.find('.' + _step + '_a_short_name').text(),
                                                stepIntroduce: targetStep.find('.' + _step + '_a_intro').text(),
                                                stepNote: targetStep.find('.' + _step + '_a_note').text(),
                                                stepOrder: targetStep.find('.' + _step + '_a_order').text(),
                                                stepType: targetStep.find('.' + _step + '_a_Type').data('id'),
                                                stepInterval: targetStep.find('.' + _step + '_a_interval').text(),
                                                prodId: targetStep.find('.' + _step + '_a_prodName').data('id'),
                                                prodUseRemind: targetStep.find('.' + _step + '_a_prodName').data('useremind'),
                                                multimediaResourceId: targetStep.find('.' + _step + '_a_prodName').data('multimediaresid'),
                                                multimediaUseRemind: targetStep.find('.' + _step + '_a_prodName').data('multimediauseremind')
                                            }
                                        if (!editOrder($('#stepPage_' + res.vo.id).find('.step_ok_btn'), '步骤', _step)) {
                                            Data.createOrUpdateMineLessonStep(dataStep).done(function (res) {
                                                // getPageList('','步骤',_step,$('.'+_step),res.vo);
                                                //$('.step_handle .grid').remove();
                                                targetStep.attr('data-id', res.vo.id);

                                                firstNextStep = false;
                                            })
                                        }
                                    })
                                })

                            })
                            //判断课时是否被删除
                            judgeDeleteLesson(lessonIdArr);
                            index++;
                            $('body').find('.targetEdit').removeClass('targetEdit');
                            $('#page' + index).removeClass('hide').siblings('.pageBox').addClass('hide');
                        }
                        else {
                            bainx.broadcast('您尚未完成步骤的添加');
                        }
                    }
                    if(!firstNextLesson ){
                        if(URL.param.boxId1){
                            showList('section')
                        }
                        //判断课时是否被删除

                        lessonIdArr = [];
                        $('.lesson .grid').each(function (index) {
                            var lessonTarget = $(this);
                            lessonIdArr.push(lessonTarget.data('id'));
                        })

                        judgeDeleteLesson(lessonIdArr);
                        index++;
                        $('body').find('.targetEdit').removeClass('targetEdit');
                        $('#page' + index).removeClass('hide').siblings('.pageBox').addClass('hide');
                    }
                    //判断课时是否被删除
                    //judgeDeleteLesson(lessonIdArr);
                    //index++;
                    //$('body').find('.targetEdit').removeClass('targetEdit');
                    //$('#page' + index).removeClass('hide').siblings('.pageBox').addClass('hide');

                }
                return
            }
            if(index == 5){//创建或更新阶段
                if($('.section dl').length == 0){
                    bainx.broadcast('您还未添加阶段，请先添加阶段！');
                    //return;
                }
                else{
                    pop(true);
                    //if(!hasRelate){
                    if(firstNextSection){
                        var _className = 'section';
                        console.log($('.section .grid').length);
                        lastUp = false;
                        $('.section .grid').each(function(indexSection) {
                            var sectionTarget = $(this),
                                data = {
                                    boxId: boxId,
                                    courseId: $('#page3').data('id'),
                                    sectionName: sectionTarget.find('.' + _className + '_a_name').text(),
                                    sectionShortName: sectionTarget.find('.' + _className + '_a_short_name').text(),
                                    sectionDuration: sectionTarget.find('.' + _className + '_a_duration').text(),
                                    sectionIntroduce: sectionTarget.find('.' + _className + '_a_intro').text(),
                                    sectionNote: sectionTarget.find('.' + _className + '_a_note').text(),
                                    sectionOrder: sectionTarget.find('.' + _className + '_a_order').text(),
                                    sectionSd: sectionTarget.find('.' + _className + '_a_sd').text(),
                                    sectionEd: sectionTarget.find('.' + _className + '_a_ed').text()
                                }
                            Data.createOrUpdateCourseSection(data).done(function (res) {
                                firstNextSection = false;
                                //$('.'+_className).find('.grid').remove();
                                //getPageList('', '阶段', _className, $('.' + _className), res.vo);
                                //sectionTarget.attr('data-id',res.vo.id);

                                $('#sectionLessonPage_' + sectionTarget.data('id')).attr('data-id', res.vo.id).attr('id','sectionLessonPage_' + res.vo.id);

                                $('#sectionLessonPage_add'+indexSection).attr('data-id', res.vo.id).attr('id','sectionLessonPage_' + res.vo.id);

                                sectionTarget.attr('data-id', res.vo.id);

                                var targetSLAll = $('#sectionLessonPage_' + res.vo.id).find('.sectionLesson').find('.grid'),
                                    _SL = 'sectionLesson';
                                console.log(indexSection,targetSLAll);
                                targetSLAll.each(function (itm) {

                                    var targetSL = $(this),
                                        _earliesttime = targetSL.find('.' + _SL + '_a_earliesttime').text(),
                                        _latestttime = targetSL.find('.' + _SL + '_a_latestttime').text(),
                                        _suggesttime = targetSL.find('.' + _SL + '_a_suggesttime').text(),
                                        dataSL = {
                                            boxId: boxId,
                                            sectionId: sectionTarget.data('id'),
                                            earliesttimeInDay: _earliesttime,
                                            latestttimeInDay: _latestttime,
                                            suggesttimeInDay: _suggesttime,
                                            lessonId: targetSL.find('.' + _SL + '_a_lesson_name').data('lessonid'),
                                            dayOrder: targetSL.find('.' + _SL + '_a_dayOrder').text(),
                                        }
                                    if (time_range(_earliesttime, _latestttime, _suggesttime)) {
                                        Data.createOrUpdateMineSectionLesson(dataSL).done(function (res) {
                                            //getPageList('', '阶段课时', _SL, $('.' + _SL), res.vo);
                                            targetSL.attr('data-id',res.vo.id);
                                            if(itm == targetSLAll.length - 1 && indexSection == $('.section .grid').length - 1){
                                                lastUp = true;
                                                firstNextSectionLesson = false;
                                            }
                                            if(lastUp){
                                                lastUp = false;
                                                index++;
                                                var data = {
                                                    boxId:boxId
                                                }
                                                Data.getBoxDetail(data).done(function(res){
                                                    courseGather(res);
                                                })
                                                $('body').find('.targetEdit').removeClass('targetEdit');
                                                $('#page'+index).removeClass('hide').siblings('.pageBox').addClass('hide');
                                            }
                                        })
                                    }
                                })
                            })
                        })

                        // firstNextSectionLesson = false;
                        //// lastUp = false;
                        // index++;
                        // var data = {
                        //     boxId:boxId
                        // }
                        // Data.getBoxDetail(data).done(function(res){
                        //     courseGather(res);
                        // })
                        // $('body').find('.targetEdit').removeClass('targetEdit');
                        // $('#page'+index).removeClass('hide').siblings('.pageBox').addClass('hide');
                    }
                    else{
                        index++;
                        var data = {
                            boxId:boxId
                        }
                        Data.getBoxDetail(data).done(function(res){
                            courseGather(res);
                        })
                        $('body').find('.targetEdit').removeClass('targetEdit');
                        $('#page'+index).removeClass('hide').siblings('.pageBox').addClass('hide');

                    }

                    // }
                }
                return
            }
            if(index == 6) {//课程汇总
                var data = {
                    boxId:boxId
                }
                Data.getMineBoxInfo(data).done(function(res){
                    var vo = res.vo;
                    //if(vo.price){
                    //    vo.prodPrice = Common.moneyString(vo.price);
                    //    vo.prodids = vo.scProductIds;
                    //    hasPrice(vo);
                    //}else{
                    Data.getNeedUpdateBoxParam(data).done(function(res_price) {
                        vo.prodPrice = Common.moneyString(res_price.price);
                        vo.prodids = res_price.prodIds;
                        hasPrice(vo);
                    })
                    // }
                    index++;
                    $('body').find('.targetEdit').removeClass('targetEdit');
                    $('#page'+index).removeClass('hide').siblings('.pageBox').addClass('hide');
                })
            }

            //if(!hasRelate || index!=5){
            //    index++;
            //    $('body').find('.targetEdit').removeClass('targetEdit');
            //}
        }
        // $('#page'+index).removeClass('hide').siblings('.pageBox').addClass('hide');
    }

    //判断课时是否被删除
    function judgeDeleteLesson(lessonIdArr){
        //修改阶段关联里的课时id
        $('.sectionLessonPage').each(function(){
            var itemSL = $(this).find('.list').find('.grid');
            itemSL.each(function(){
                var lesId = $(this).find('.sectionLesson_a_lesson_name');
                if(!lessonIdArr.contains(lesId.data('lessonid'))){
                    $(this).remove();
                }
            })
        })
    }

    //最后盒子页面（有价格）
    function hasPrice(vo){

        var finishhtm = '<dl class="grid" data-id={{id}}><dd class="row"><div class="boxLeft"> <span>定制类型：</span></div><div class="col"> <b>{{mineType}}</b> </div></dd><dd  class="row"><div class="boxLeft"><span>盒子名：</span> </div><div class="col"><b>{{boxName}}</b></div></dd><dd  class=""><div class="boxLeft"><span>盒子介绍：</span></div><div class=""><b class="displayB">{{boxIntroduce}}</b></div></dd><dd  class=""><div class="boxLeft"><span>盒子注意事项：</span></div><div class=""><b  class="displayB">{{boxNote}}</b></div> </dd><dd class="prodids row" data-prodids="{{prodids}}"><div class="boxLeft"><span>价格：</span></div><div class="col"><p class="price">{{prodPrice}}</p></div></dd></dl>',
            finishHtmA = [],
            _mineType = ['','护肤定制类','私密护理类','减肥定制类','脱发定制类'];
        vo.mineType = _mineType[vo.mineType];
        finishHtmA.push(bainx.tpl(finishhtm,vo));
        //if($('.finish dl').length == 0){
        $('#page7 .finish .grid').remove();
        $('#page7 .finish').append(finishHtmA.join(''));
        $('.next').text('确定').addClass('surePrice').removeClass('next');
    }

    init()
})

