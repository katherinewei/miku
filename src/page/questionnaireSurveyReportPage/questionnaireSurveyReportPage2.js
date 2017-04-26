

/**
 * 问卷调查
 * Created by xiuxiu on 2016/4/19.
 */
require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common',
    'h5/js/common/data',

], function($, URL, Common, Data) {

    var Page,
        dialog,
        uuid  = URL.param.uuid,
        name = URL.param.name,
        _uid = URL.param.uid;

    function init() {

        render();

        edit();
    }

    function render() {

        Page = $('<div id="questionContainer" class="page-content"></div>').appendTo('body');


        if(URL.param.questionId){
            var qid = URL.param.questionId,
                oId = URL.param.optionId,
                oIds = URL.param.optionIds,

                data ={
                    questionId:qid,
                    optionId:oId,
                    optionIds:oIds,
                    flag:1,
                    uuid:uuid,
                    uid:_uid
                }
            Data.finalsubmitBydevQuestions(data).done(function(res){
                initHtml(res);

            })

        }else{

            var data = {
                uuid:uuid
            }
            Data.getoneSkinDataByUuid(data).done(function(res){

                initHtml(res)

            })
        }




    }

    function initHtml(res){


        resTpl = '<p data-lastqid="{{lastQid}}" data-lastoptids="{{lastOptids}}" data-lastoptid="{{lastOptid}}"><span>{{questionName}}</span>{{uuid}}</p>',
            html=[],
            detail=[];

        $.each(res.data, function(index, item){
            if(item.questionId != 0){

                for(var i in localStorage){
                    var localArr = localStorage.getItem(i).split(',');

                    if(item.questionId == localArr[7]){
                        item.lastQid = localArr[0];
                        item.lastOptid = localArr[1];
                        item.lastOptids = localArr[2];
                        if (item.questionType == 4) {

                            html.push(bainx.tpl(resTpl, item));

                        } else {

                            detail.push(bainx.tpl(resTpl, item))
                        }
                    }
                }

            }

        });

        name = name ? name : '我们来回顾下您';
        $('#questionContainer').find('.question_item').addClass('hide');
        $('#questionContainer').append('<div class="resultPage"><p class="title">'+name+'的肌肤测试</p><ul><li><h3>您的肌肤状态</h3><div class="detail">'+html.join('')+'</div></li><h3>您的生活方式</h3><div class="detail">'+detail.join('')+'</div></li></ul></div>');

    }



    //修改问题
    function edit(){
        if(URL.param.type =='1'){
            $('body').on('tap','.resultPage p',function(){
                var questionId = $(this).data('lastqid'),
                    optionId = $(this).data('lastoptid'),
                    optionIds = $(this).data('lastoptids');
                initQuestion(questionId,optionId,optionIds);
            })
        }
    }

    //弹出问题
    function questionDialog(){



    }

    //初始化问题
    function initQuestion(questionId,optionId,optionIds){
        var data = {
                questionId:questionId,
                optionId:optionId,
                optionIds:optionIds,
                flag:1,
                uuid:uuid,
                uid:_uid
            },
            _con = $('#questionContainer');



        Data.finalselectBydevQuestions(data).done(function(res){


            var question = res.question,
                option = res.option;

            var template = '<div class="question_item question{{id}} currentQuestion" data-index="{{index}}"  data-question={{id}} data-uuid={{uuid}}><p class="title">{{questionName}}</p><p class="tips">{{questionDes}}</p><div class="answerBox" data-last="{{isend}}">{{touchHtml}}<dl data-answernum="{{optionsSelectableMaxnum}}" data-optionstype="{{optionsSelectableType}}">{{answerTPL}}</dl></div></div>',
                html = [],
                answer = [];
            question.uuid = res.uuid;
            question.isend = res.isend == true ? '1':'0';

            var answerTPL = '',
                touchContent = '';

            if(option) {

                $.each(option, function (index, itemA) {
                    switch (itemA.optionShowStyle){
                        case 1://文字
                            answerTPL = '<dd ><span data-id="{{id}}">{{optionValue}}</span><p>{{optionDes}}</p> </dd>';
                            answer.push((bainx.tpl(answerTPL, itemA)));
                            break;
                        case 2:  //色值
                            touchContent = '<dd data-color="{{optionValue}}" data-id="{{id}}" style="background-color: {{optionName}}"></dd>';
                            answer.push((bainx.tpl(touchContent, itemA)));

                            break;

                        case 3://进度条
                            touchContent = '<dd data-value="{{optionValue}}" data-id="{{id}}" style="height: 0;opacity: 0"></dd>';
                            answer.push((bainx.tpl(touchContent, itemA)));
                            break;
                    }

                });

                question.answerTPL = answer.join('');

                if(option[0].optionShowStyle == 2){
                    question.touchHtml = '<div class="blockDiv colorBlock" ><dl class="colorBlockInner" id="colorBlock'+question.id+'">'+question.answerTPL+'</dl> <span id="block'+question.id+'" class="block1"></span><p class="blockDrapTips">请将滑块向上下拖动</p></div>';

                }
                if(option[0].optionShowStyle == 3){
                    question.touchHtml = '<div class="blockDiv colorBlock2" > <div id="colorBlock'+question.id+'" class="colorOuter"><div class="inner" id="colorBlockInner'+question.id+'"></div></div><span id="block'+question.id+'" class="block2"></span><span class="moveTips">'+option[0].optionValue+'</span></div><p class="blockDrapTips">请将滑块向上下拖动</p>';
                }
            }
            html.push(bainx.tpl(template, question));
            _con.append(html.join(''));

            chooseAnswer = $('.currentQuestion').find('dd').children('span');
            $('.currentQuestion').find('.answerBox').attr('data-answeritem',localList[2]);
            chooseAnswer.each(function () {
                for (var k in localData) {
                    if ($(this).data('id') == localData[k]) {
                        $(this).addClass('active');
                    }
                }
            })
            //if($('.currentQuestion').find('.blockDiv').length > 0){
            //    $('.currentQuestion').find('.block1').css('top',localList[5] + "px");
            //    $('.currentQuestion').find('.inner').css('height',parseInt(localList[5]) + 9 + "px");
            //    $('.currentQuestion').find('.block2').css('top',localList[5] + "px");
            //
            //    var remeberValue,
            //        _answerItem = $('.currentQuestion').find('.answerBox').data('answeritem');
            //    $('.currentQuestion').find('dd').each(function(){
            //        if($(this).data('id') == _answerItem){
            //            remeberValue = $(this).data('value');
            //        }
            //    })
            //    $('.currentQuestion').find('.moveTips').text(remeberValue);
            //}


            if($('.currentQuestion').find('dd').length < 4){
                $('.currentQuestion').find('dd').addClass('block');
            }

            if($('.currentQuestion').find('.colorBlock').length > 0){

                var block = $('.currentQuestion').find('.block1')[0],
                    outer = $('.currentQuestion').find('.colorBlock').height(),
                    ddCont = $('.currentQuestion').find('.colorBlockInner').find('dd');


                drapColor(block,outer,ddCont);
            }
            if($('.currentQuestion').find('.colorBlock2').length > 0){
                var block = $('.currentQuestion').find('.block2')[0],
                    outer = $('.currentQuestion').find('.colorBlock2').height(),
                    ddCont = $('.currentQuestion').find('.answerBox').find('dd');
                inner = $('.currentQuestion').find('.inner')[0],
                    tips = $('.currentQuestion').find('.moveTips')[0];
//console.log(inner,tips);
                drapProgress(block,outer,inner,tips,ddCont)
            }

        })
    }




    // 拖拽事件
    function drap(block,outer,callbackinnder){
        var oW,oH;

        block.addEventListener("touchstart", function(e) {
            var touches = e.touches[0];
            oW = touches.clientX - block.offsetLeft;
            oH = touches.clientY - block.offsetTop;
            //阻止页面的滑动默认事件
            document.addEventListener("touchmove",defaultEvent,false);
        },false)

        block.addEventListener("touchmove", function(e) {
            var touches = e.touches[0];


            var oTop = touches.clientY - oH;


            if(oTop > -10 && oTop < outer-10) {
                _flag = true;
                block.style.top = oTop + "px";
                moveTop = oTop;
                callbackinnder(oTop);
            }

        },false);

        block.addEventListener("touchend",function() {
            document.removeEventListener("touchmove",defaultEvent,false);
        },false);
        function defaultEvent(e) {
            e.preventDefault();
        }
    }

    //
    function drapProgress(block,outer,inner,tips,ddCont){
        //拖拽事件 的

        drap(block,outer,callback2);

        function callback2(oTop){
            var //ddL =  $('#colorBlock2').parents('.answerBox').find('dd'),
                avgH = outer / (ddCont.length),
                ddMinV = ddCont.first().data('value')
            ddMaxV = ddCont.last().data('value');
            // console.log(typeof moveId,'222222333');
            for(var i = 0,l = ddCont.length; i< l; i++){
                if(oTop > avgH * i && oTop < avgH * (i+1)){
                    tips.innerHTML = ddCont.eq(i).data('value');
                    //tips.style.top = oTop + "px";
                    inner.style.height = oTop + 9 + "px";
                    moveId = ddCont.eq(i).data('id');

                }
            }

        }

    }
    function drapColor(block,outer,ddCont){

        var outer1 = 26 * ddCont.length;

        drap(block,outer,callback1);
        function callback1(oTop){
            //var ddLen = $('#colorBlock dd');

            for(var i in ddCont){
                if(oTop > 34 * i && oTop < 34 * (i+1)){
                    moveId = ddCont.eq(i).data('id');
                }
            }
            //console.log(typeof moveId,'222222333');
        }
    }


    init();
})