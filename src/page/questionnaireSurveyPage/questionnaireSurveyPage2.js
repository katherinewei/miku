/**
 * 问卷调查
 * Created by xiuxiu on 2016/4/19.
 */
require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common',
    'h5/js/common/data',
    'plugin/addressData/1.0.0/addressData'
], function($, URL, Common, Data,addressData) {

    var Page,
        _flag = false,
        index = 0,      //上一题index
        localLoad = false,   //第一次加载
        currentId = 0,
        deleteArr ='',
        moveId = '',        //进度条的值
        moveText = '', //进度条的值
        moveTop = 0,//移动的高度
        localLength = 0, //缓存的长度
        _uid = URL.param.uid,
        canTap = true,
        localArr = [],
        _arrI = [],
        _currentUid,
        localList,
        questionArr,
        type=URL.param.type,
        solveQuestion,//需要解决的问题
        recordId,//记录id
        isExpert = parseInt(URL.param.isExpert),
        detailLength,//多少道细化问题
        count = 0,//计算细化问题
        _answerList = [],
        _answerListS,//细化问题的答案
        _answerListSlocal,
        entry = parseInt(URL.param.entry) ,//1--专家 2--用户
        isFullIn,
        fristNext = 0,
        isRestart = false,
        isEdit = true,
        userName = URL.param.userName ? URL.param.userName : '';

    if(_uid){
        var arrUid = _uid.split("_");
        if(arrUid.length > 1){
            _uid = parseInt(arrUid[1]);
        }
    }else{
        _uid = -1;
    }

    //删除二维数组指定数组
    Array.prototype.del=function(index){
        if(isNaN(index)||index>=this.length){
            return false;
        }
        for(var i=0,n=0;i<this.length;i++){
            if(this[i]!=this[index]){
                this[n++]=this[i];
            }
        }
        this.length-=1;
    };

    //删除相同值
    Array.prototype.delSame = function() {
        var a = {}, c = [], l = this.length;
        for (var i = 0; i < l; i++) {
            var b = this[i];
            var d = (typeof b) + b;
            if (a[d] === undefined) {
                c.push(b);
                a[d] = 1;
            }
        }
        return c;
    }





    function init(){

        render();
    }

    function render(){




        Page = $('<div class="page-content grid" id="questionContainer"><!--<div class="questionBox"></div>--> <div class="resultPage hide"></div><div class="bottom_bar grid rusultBar"><ul class=" row"><li class="col start" href="' + URL.questionnaireSurveyPage + '?uid='+_uid+'&entry='+entry+'&isExpert='+isExpert+'"><span class=" btn">重新开始</span></li><li class="col prev"><span class=" btn" >上一步</span></li><li class="col"><span class=" btn saveBtn " >开始细化问题</span></li></ul></div><div class="bottom_bar grid bar"> <ul class=" row"><li class="col start"><span class=" btn">重新开始</span></li><li class="col prev"><span class=" btn">上一步</span></li><li class="col next"><span class=" btn">下一步</span></li></ul> </div>').appendTo('body');
        //initLocal();
        //resultPage();
        // result();
        initLocal();
        bindEvents();

        if(entry == 0 && isExpert == 0 ){

            $('.saveBtn').text('呼叫私人管家');

        }
        if(entry == 2){
            $('.rusultBar .prev').hide();
            $('.saveBtn').text('生成报告').attr('href','_createReport1').removeClass('saveBtn');
        }

    }


    //显示每道题
    function questionItem(questionArr,qid){

        var html = [];

        $.each(questionArr,function(index,item){
            var res =  item;



            var question = res.question,
                option = res.optionsList,
                currentId = question.id;

            question.index = qid + index;








            var template = '<div class="question_item question{{index}} hide" data-index="{{index}}"  data-question="{{id}}" data-questionvalue="{{questionShowValue}}"><p class="title" data-shortname="{{questionShortName}}">{{questionName}}</p><p class="tips">{{questionDes}}</p><div class="answerBox" data-last="{{isend}}" >{{touchHtml}}<dl data-answernum="{{optionsSelectableMaxnum}}" data-optionstype="{{optionShowStyle}}">{{answerTPL}}</dl></div></div>',
                answer = [],
                touchHtml = [],
                cityHtml = [];

            question.isend = res.isend == true ? '1':'0';
            question.questionShowValue = res.questionShowValue;

            var answerTPL = '',
                touchContent = '',
                cityContent = '';

            if(option) {

                var optWidth = 100 / option.length;



                $.each(option, function (index, itemA) {

                    var _optionShowStyle = itemA.optionShowStyle;

                    itemA.optionShowStyle = typeof _optionShowStyle == 'number' ?  _optionShowStyle.toString() : _optionShowStyle;

                    if(qid == 17){
                        itemA.optionName = itemA.optionValue;
                        itemA.optionValue = itemA.optionName;
                    }

                    switch (itemA.optionShowStyle){


                        case '1'://文字
                            answerTPL = '<dd ><span data-id="{{id}}" data-value="{{optionValue}}">{{optionName}}</span><p>{{optionDes}}</p> </dd>';
                            answer.push((bainx.tpl(answerTPL, itemA)));
                            break;
                        case '2':  //色值
                            touchContent = '<dd data-value="{{optionName}}" data-id="{{id}}" style="background-color: {{optionName}};width: '+optWidth+'%;"></dd>';
                            touchHtml.push((bainx.tpl(touchContent, itemA)));

                            break;

                        case '3'://进度条
                            touchContent = '<dd data-value="{{optionName}}" data-id="{{id}}" style="height: 0;opacity: 0"></dd>';
                            answer.push((bainx.tpl(touchContent, itemA)));
                            break;
                        case '4'://城市选择
                            answerTPL = '<dd style="height: 0;opacity: 0"><span data-id="{{id}}" data-value="{{optionValue}}">{{optionName}}</span><p>{{optionDes}}</p> </dd>';
                            answer.push((bainx.tpl(answerTPL, itemA)));
                            break;
                        case '5'://无答案
                            answerTPL = '<dd class="hidden" "><span data-id="{{id}}" class="active">{{optionName}}</span><p>{{optionDes}}</p> </dd>';
                            answer.push((bainx.tpl(answerTPL, itemA)));
                            break;
                        default:
                            answerTPL = '<dd ><span data-id="{{id}}" data-value="{{optionValue}}">{{scProblemName}}</span></dd>';
                            answer.push((bainx.tpl(answerTPL, itemA)));
                            break;

                    }

                });

                question.answerTPL = answer.join('');

                if(option[0].optionShowStyle == 2){
                    question.touchHtml = '<div class="blockDiv colorBlock" ><dl class="colorBlockInner" id="colorBlock'+question.id+'">'+touchHtml.join('')+'</dl> <span id="block'+question.id+'" class="block1" data-id="'+option[0].id+'" data-value="'+option[0].optionName+'" ></span><p class="blockDrapTips">请将滑块向左右拖动</p></div>';

                }
                if(option[0].optionShowStyle == 3){
                    question.touchHtml = '<div class="blockDiv colorBlock2" > <div id="colorBlock'+question.id+'" class="colorOuter"><div class="inner" id="colorBlockInner'+question.id+'"></div></div><span id="block'+question.id+'" class="block2"></span><span class="moveTips" data-id="'+option[0].id+'">'+option[0].optionName+'</span></div><p class="blockDrapTips">请将滑块向左右拖动</p>';
                }
                if(option[0].optionShowStyle == 4){
                    question.touchHtml = '<select  id="cmbProvince"></select><select id="cmbCity" class="cmbCity"></select><select id="cmbArea" style="display: none"></select>';
                }
                else{
                    question.answerTPL = answer.join('');
                }

            }

            html.push(bainx.tpl(template, question));

        })

        html = html.join('');

        return html;
    }




    //缓存所有题
    function initAllQuestion(option){
        /// index == 0;

        // console.log(questionArr[10].option,option);

        //基础题
        var questionArr = [

            {
                question: {
                    id:1,
                    optionsSelectableMaxnum: "1",
                    optionsSelectableType: 1,
                    questionDes: "询问您的年龄是为了向您提供更贴切的私人服务",
                    questionName: "您在以下哪个年龄段？",
                    questionShowOrder: 1,
                    questionType: 1,
                },
                isend: false,
                questionShowValue:1,
                optionsList: [{
                    id:1,
                    optionDes: "",
                    optionName: "25岁及以下",
                    optionShowStyle: '1',
                    optionValue:"25岁及以下",

                },{
                    id:2,
                    optionDes: "",
                    optionName: "26岁到32岁",
                    optionShowStyle: '1',
                    optionValue:"26岁到32岁",

                },{
                    id:3,
                    optionDes: "",
                    optionName: "33岁到39岁",
                    optionShowStyle: '1',
                    optionValue:"33岁到39岁",

                },{
                    id:4,
                    optionDes: "",
                    optionName: "40岁到49岁",
                    optionShowStyle: '1',
                    optionValue:"40岁到49岁",

                },{
                    id:5,
                    optionDes: "",
                    optionName: "50岁到60岁",
                    optionShowStyle: '1',
                    optionValue:"50岁到60岁",

                }]
            },
            {
                question: {
                    id:2,
                    optionsSelectableMaxnum: "1",
                    optionsSelectableType: 1,
                    questionDes: "询问您的性别是为了向您提供最正确的美妆服务",
                    questionName: "您的性别",
                    questionShowOrder: 1,
                    questionType: 1,
                },
                isend: false,
                questionShowValue:2,
                optionsList: [{
                    id:1,
                    optionDes: "",
                    optionName: "女",
                    optionShowStyle: '1',
                    optionValue:"女",

                },{
                    id:2,
                    optionDes: "",
                    optionName: "男",
                    optionShowStyle: '1',
                    optionValue:"男",

                }]
            },
            {
                question: {
                    id:3,
                    optionsSelectableMaxnum: "1",
                    optionsSelectableType: 1,
                    questionDes: "请观察手腕内侧的肌肤肤色，它与自然肤色最接近。",
                    questionName: "您的自然肤色是什么色？",
                    questionShowOrder: 1,
                    questionType: 1,
                },
                isend: false,
                questionShowValue:3,
                optionsList: [
                    {
                        id: 1,
                        optionDes: "",
                        optionName: "#fbf4eb",
                        optionShowStyle: '2',


                    },
                    {
                        id: 2,
                        optionDes: "",
                        optionName: "#f9f0e1",
                        optionShowStyle: '2',


                    },
                    {
                        id: 3,
                        optionDes: "",
                        optionName: "#f6edd7",
                        optionShowStyle: '2',


                    },
                    {
                        id: 4,
                        optionDes: "",
                        optionName: "#f3e9d1",
                        optionShowStyle: '2',


                    },
                    {
                        id: 5,
                        optionDes: "",
                        optionName: "#efe3c7",
                        optionShowStyle: '2',


                    },
                    {
                        id: 6,
                        optionDes: "",
                        optionName: "#ebdcba",
                        optionShowStyle: '2',

                    },
                    {
                        id: 7,
                        optionDes: "",
                        optionName: "#e7d4b4",
                        optionShowStyle: '2',


                    },
                    {
                        id: 8,
                        optionDes: "",
                        optionName: "#e1ccaa",
                        optionShowStyle: '2',


                    },
                    {
                        id: 9,
                        optionDes: "",
                        optionName: "#dfc7a0",
                        optionShowStyle: '2',


                    },
                    {
                        id: 10,
                        optionDes: "",
                        optionName: "#d9c098",
                        optionShowStyle: '2',


                    },
                    {
                        id: 11,
                        optionDes: "",
                        optionName: "#d2b68a",
                        optionShowStyle: '2',


                    },
                    {
                        id: 12,
                        optionDes: "",
                        optionName: "#c9a877",
                        optionShowStyle: '2',


                    },
                    {
                        id: 13,
                        optionDes: "",
                        optionName: "#bb9b6d",
                        optionShowStyle: '2',


                    },
                    {
                        id: 14,
                        optionDes: "",
                        optionName: "#ae875e",
                        optionShowStyle: '2',


                    },
                    {
                        id: 15,
                        optionDes: "",
                        optionName: "#9f7356",
                        optionShowStyle: '2',


                    }]
            },
            {
                question: {
                    id:4,
                    optionsSelectableMaxnum: "1",
                    optionsSelectableType: 1,
                    questionDes: "",
                    questionName: "如果不使用滋润品，您的皮肤在中午时会有什么感觉？",
                    questionShowOrder: 1,
                    questionType: 1,
                },
                isend: false,
                questionShowValue:1,
                optionsList: [
                    {
                        id:1,
                        optionDes: "",
                        optionName: "整张脸都很油／泛油光<br/>您的肌肤类型为第一类型 / 油性",
                        optionShowStyle: '1',
                        optionValue:"油性",

                    }, {
                        id:2,
                        optionDes: "",
                        optionName: "整张脸都感觉紧绷、不适。<br/>您的肌肤类型为第二类型 / 干性",
                        optionShowStyle: '1',
                        optionValue:"干性",

                    },{
                        id:3,
                        optionDes: "",
                        optionName: "脸颊感觉紧绷和不适，T 区（前额、鼻子、下巴）正常或偏油<br/>您的肌肤类型为第三类型 / 混合型偏干",
                        optionShowStyle: '1',
                        optionValue:"混合型偏干",

                    },{
                        id:4,
                        optionDes: "",
                        optionName: "脸颊正常（不油也不干），T 区很油／泛油光<br/>您的肌肤类型为第四类型 / 混合型偏油",
                        optionShowStyle: '1',
                        optionValue:"混合型偏油",

                    }]
            },
            {
                question: {
                    id:5,
                    optionsSelectableMaxnum: "1",
                    optionsSelectableType: 1,
                    questionDes: "",
                    questionName: "您每天的平均日晒程度如何？",
                    questionShowOrder: 1,
                    questionType: 1,
                },
                isend: false,
                questionShowValue:4,
                optionsList: [
                    {
                        id:1,
                        optionDes: "",
                        optionName: "偶尔日晒<br/>“随便逛逛”／经常往返于室内室外",
                        optionShowStyle: '1',
                        optionValue:"偶尔日晒",


                    },{
                        id:2,
                        optionDes: "",
                        optionName: "强烈日晒<br/>长时间待在户外",
                        optionShowStyle: '1',
                        optionValue:"强烈日晒",

                    }]
            },
            {
                question: {
                    id:6,
                    optionsSelectableMaxnum: "1",
                    optionsSelectableType: 1,
                    questionDes: "每个人的肌肤都会偶尔出现点小问题，您曾有过泛红、发痒或灼热感吗？ 或出现脱皮或皮疹？",
                    questionName: "您是否出现过肌肤敏感的情况？",
                    questionShowOrder: 1,
                    questionType: 1,
                },
                isend: false,
                questionShowValue:4,
                optionsList: [
                    {
                        id:1,
                        optionDes: "",
                        optionName: "是",
                        optionShowStyle: '1',
                        optionValue:"有",

                    },{
                        id:2,
                        optionDes: "",
                        optionName: "否",
                        optionShowStyle: '1',
                        optionValue:"没有",

                    }]
            },
            {
                question: {
                    id:7,
                    optionsSelectableMaxnum: "1",
                    optionsSelectableType: 1,
                    questionDes: "每个人的肌肤都会偶尔出现点小问题，您曾有过泛红、发痒或灼热感吗？ 或出现脱皮或皮疹？",
                    questionName: "您是否出现过肌肤敏感的情况？",
                    questionShowOrder: 1,
                    questionType: 1,
                },
                isend: false,
                questionShowValue:4,
                optionsList: [
                    {
                        id:1,
                        optionDes: "",
                        optionName: "很少（一年有一次或两次产生敏感刺激现象。这种现象很轻微，并且消退速度快。）",
                        optionShowStyle: '1',
                        optionValue:"很少",

                    },{
                        id:2,
                        optionDes: "",
                        optionName: "偶尔（由天气变化、日晒导致敏感。对特定成分、药物、激光或磨皮手术过敏。）",
                        optionShowStyle: '1',
                        optionValue:"偶尔",

                    },{
                        id:3,
                        optionDes: "",
                        optionName: "长期（经常敏感，现象严重。）",
                        optionShowStyle: '1',
                        optionValue:"长期",

                    }]
            },
            {
                question: {
                    id:8,
                    optionsSelectableMaxnum: "1",
                    optionsSelectableType: 1,
                    questionDes: "",
                    questionName: "您的问题严重程度如何？请用轻度、中度或重度来表示。",
                    questionShowOrder: 1,
                    questionType: 1,
                },
                isend: false,
                questionShowValue:3,
                optionsList: [
                    {
                        id:1,
                        optionDes: "",
                        optionName: "轻度",
                        optionShowStyle: '3',

                    },{
                        id:2,
                        optionDes: "",
                        optionName: "中度",
                        optionShowStyle: '3',

                    },{
                        id:3,
                        optionDes: "",
                        optionName: "重度",
                        optionShowStyle: '3',

                    }]
            },
            {
                question: {
                    id:9,
                    optionsSelectableMaxnum: "1",
                    optionsSelectableType: 1,
                    questionDes: "",
                    questionName: "在您肤色不均的区域，是否有皮肤泛红现象吗？",
                    questionShowOrder: 1,
                    questionType: 1,
                },
                isend: false,
                questionShowValue:4,
                optionsList: [
                    {
                        id:1,
                        optionDes: "",
                        optionName: "是",
                        optionShowStyle: '1',
                        optionValue:"有",

                    },{
                        id:2,
                        optionDes: "",
                        optionName: "否",
                        optionShowStyle: '1',
                        optionValue:"没有",

                    }]
            },
            {
                question: {
                    id:10,
                    optionsSelectableMaxnum: "1",
                    optionsSelectableType: 1,
                    questionDes: "",
                    questionName: "肌肤泛红可分为多种类型， 我们来确定一下您属于哪一类型。",
                    questionShowOrder: 1,
                    questionType: 1,
                },
                isend: false,
                questionShowValue:4,
                optionsList: [
                    {
                        id:1,
                        optionDes: "",
                        optionName: "偶发性泛红",
                        optionShowStyle: '1',
                        optionValue:"偶发性",

                    },{
                        id:2,
                        optionDes: "",
                        optionName: "长期",
                        optionShowStyle: '1',
                        optionValue:"长期",
                    }]
            },
            {
                question: {
                    id:11,
                    optionsSelectableMaxnum: "1",
                    optionsSelectableType: 1,
                    questionDes: "肌肤在夜间会自行修复，所以如果睡眠不佳，会影响您肌肤的整体状态。",
                    questionName: "您晚上一般睡几个小时？",
                    questionShowOrder: 1,
                    questionType: 1,
                },
                isend: false,
                questionShowValue:3,
                optionsList: [
                    {
                        id: 1,
                        optionDes: "",
                        optionName: "3小时",
                        optionShowStyle: '3',

                    }, {
                        id: 2,
                        optionDes: "",
                        optionName: "3半小时",
                        optionShowStyle: '3',

                    }, {
                        id: 3,
                        optionDes: "",
                        optionName: "4小时",
                        optionShowStyle: '3',

                    }, {
                        id: 4,
                        optionDes: "",
                        optionName: "4半小时",
                        optionShowStyle: '3',

                    }, {
                        id: 5,
                        optionDes: "",
                        optionName: "5小时",
                        optionShowStyle: '3',

                    }, {
                        id: 6,
                        optionDes: "",
                        optionName: "5半小时",
                        optionShowStyle: '3',

                    }, {
                        id: 7,
                        optionDes: "",
                        optionName: "6小时",
                        optionShowStyle: '3',

                    }, {
                        id: 8,
                        optionDes: "",
                        optionName: "6半小时",
                        optionShowStyle: '3',

                    }, {
                        id: 9,
                        optionDes: "",
                        optionName: "7小时",
                        optionShowStyle: '3',

                    }, {
                        id: 10,
                        optionDes: "",
                        optionName: "7半小时",
                        optionShowStyle: '3',

                    }, {
                        id: 11,
                        optionDes: "",
                        optionName: "8小时",
                        optionShowStyle: '3',

                    }, {
                        id: 12,
                        optionDes: "",
                        optionName: "8半小时",
                        optionShowStyle: '3',

                    },{
                        id: 13,
                        optionDes: "",
                        optionName: "9小时",
                        optionShowStyle: '3',

                    }, {
                        id: 14,
                        optionDes: "",
                        optionName: "9半小时",
                        optionShowStyle: '3',

                    }, {
                        id: 15,
                        optionDes: "",
                        optionName: "10小时",
                        optionShowStyle: '3',

                    }]
            },
            {
                question: {
                    id:12,
                    optionsSelectableMaxnum: "1",
                    optionsSelectableType: 1,
                    questionDes: "压力过大会影响肌肤的抵抗能力，长期承受压力会使您的肌肤变得更干燥、更粗糙、更敏感。",
                    questionName: "您目前承受的压力水平如何？",
                    questionShowOrder: 1,
                    questionType: 1,
                },
                isend: false,
                questionShowValue:3,
                optionsList: [
                    {
                        id:1,
                        optionDes: "",
                        optionName: "没有",
                        optionShowStyle: '3',

                    },{
                        id:2,
                        optionDes: "",
                        optionName: "没有",
                        optionShowStyle: '3',

                    },{
                        id:3,
                        optionDes: "",
                        optionName: "低",
                        optionShowStyle: '3',

                    },{
                        id:4,
                        optionDes: "",
                        optionName: "低",
                        optionShowStyle: '3',

                    },{
                        id:5,
                        optionDes: "",
                        optionName: "一般",
                        optionShowStyle: '3',

                    },{
                        id:6,
                        optionDes: "",
                        optionName: "一般",
                        optionShowStyle: '3',

                    },{
                        id:7,
                        optionDes: "",
                        optionName: "高",
                        optionShowStyle: '3',

                    },{
                        id:8,
                        optionDes: "",
                        optionName: "高",
                        optionShowStyle: '3',

                    },{
                        id:9,
                        optionDes: "",
                        optionName: "很高",
                        optionShowStyle: '3',

                    },{
                        id:10,
                        optionDes: "",
                        optionName: "很高",
                        optionShowStyle: '3',

                    }]

            },
            {
                question: {
                    id:13,
                    optionsSelectableMaxnum: "1",
                    optionsSelectableType: 1,
                    questionDes: "",
                    questionName: "您通常所处的环境有哪些？",
                    questionShowOrder: 1,
                    questionType: 1,
                },
                isend: false,
                questionShowValue:2,
                optionsList: [
                    {
                        id:1,
                        optionDes: "",
                        optionName: "城市",
                        optionShowStyle: '1',
                        optionValue: "城市",

                    },{
                        id:2,
                        optionDes: "",
                        optionName: "郊区",
                        optionShowStyle: '1',
                        optionValue: "郊区",

                    },{
                        id:3,
                        optionDes: "",
                        optionName: "户外",
                        optionShowStyle: '1',
                        optionValue: "户外",

                    },{
                        id:4,
                        optionDes: "",
                        optionName: "频繁空中旅行",
                        optionShowStyle: '1',
                        optionValue: "频繁空中旅行",

                    },{
                        id:5,
                        optionDes: "",
                        optionName: "极端的海拔／温度",
                        optionShowStyle: '1',
                        optionValue: "极端的海拔／温度",

                    }]
            },
            {
                question: {
                    id:14,
                    optionsSelectableMaxnum: "1",
                    optionsSelectableType: 1,
                    questionDes: "",
                    questionName: "您所在城市是",
                    questionShowOrder: 1,
                    questionType: 1,
                },
                isend: false,
                questionShowValue:5,
                optionsList: [
                    {
                        id:1,
                        optionDes: "",
                        optionName: "南方",
                        optionShowStyle: '4',
                        optionValue: "南方",

                    },{
                        id:2,
                        optionDes: "",
                        optionName: "北方",
                        optionShowStyle: '4',
                        optionValue:"北方",
                    }]
            },
            {
                question: {
                    id:15,
                    optionsSelectableMaxnum: "1",
                    optionsSelectableType: 1,
                    questionDes: "询问您的所在城市的季节气候是为了向您提供适合的产品建议",
                    questionName: "您所在城市现在是属于什么季节气候",
                    questionShowOrder: 1,
                    questionType: 1,
                },
                isend: false,
                questionShowValue:1,
                optionsList: [
                    {
                        id:1,
                        optionDes: "",
                        optionName: "春",
                        optionShowStyle: '1',
                        optionValue:"春",

                    },{
                        id:2,
                        optionDes: "",
                        optionName: "夏",
                        optionShowStyle: '1',
                        optionValue:"夏",
                    },{
                        id:3,
                        optionDes: "",
                        optionName: "秋",
                        optionShowStyle: '1',
                        optionValue:"秋",
                    },{
                        id:4,
                        optionDes: "",
                        optionName: "冬",
                        optionShowStyle: '1',
                        optionValue:"冬",
                    }]
            },
            {
                question: {
                    id:16,
                    optionsSelectableMaxnum: "1",
                    optionsSelectableType: 1,
                    questionDes: "请选择 1 个适用项。",
                    questionName: "您现在最想改善的皮肤问题是什么？",
                    questionShowOrder: 1,
                    questionType: 1,
                },
                isend: true,
                questionShowValue:2,
                optionsList: option
            }
        ];

        //插入
        $('#questionContainer').append(questionItem(questionArr,1));

        //if(){
        //
        //}

        $('.question16').find('dd').each(function(){
            $(this).children('span').attr('data-value',$(this).children('span').text());
        })







        //选项显示样式
        $('.question_item').each(function(){
            var _currentQDiv = $(this),
                isblock;
            _currentQDiv.find('dd').each(function(){
                var str = $(this).children('span').text();
                if(str && str.length > 20){
                    isblock = true;
                }
            })
            if(_currentQDiv.find('dd').length < 4){
                isblock = true;
            }
            if(isblock){
                _currentQDiv.find('dd').addClass('block');
            }



        })





    }



    function bindEvents(){
        $('body').on('tap','.answerBox dd',function(event){

            //if(!$(this).parents('.question_item').hasClass('notEdit')){
            event.preventDefault();
            var answerNum = parseInt($(this).parent('dl').data('answernum'));
            if(answerNum > 1){
                chooseRC($(this),false,answerNum)
            }else{
                chooseRC($(this),true)
            }
            // }


        }).on('tap','.btn',function(event){
            event.preventDefault();

            StepEvent($(this));

        }).on('tap','.sure',function(event){
            if(localStorage.length > 0){    //localStorage
                //for(var i in localStorage){
                //    localStorage.removeItem(localStorage.key(i))
                //}
            }

        }).on('tap','.resultPage dd span',function(event)
        {          //编辑答案的。。

            //if(entry != 2){
            event.preventDefault();
            // $('.resultPage').hide();
            var qid = $(this).parent('dd').data('id'),
                _currentQuestion = $('.question' + qid);


            //if(!_currentQuestion.hasClass('notEdit')) {
            $('.resultPage').addClass('hide');
            _currentQuestion.removeClass('hide').siblings().addClass('hide');
            _currentQuestion.addClass('currentQuestion').siblings().removeClass('currentQuestion');
            $('.editBar').removeClass('hide');

            _currentQuestion.find('.active').addClass('orgin');

            //进度条
            if(_currentQuestion.find('.blockDiv').length > 0){
                var _left1 = _currentQuestion.find('.block1').css('left'),
                    _id1 =_currentQuestion.find('.block1').data('id'),
                    _left2 = _currentQuestion.find('.block2').css('left'),
                    _id2 =_currentQuestion.find('.moveTips').data('id');
                _currentQuestion.find('.block1').attr('data-orginleft',_left1);
                _currentQuestion.find('.block1').attr('data-orginid',_id1);
                _currentQuestion.find('.block2').attr('data-orginleft',_left2);
                _currentQuestion.find('.moveTips').attr('data-orginid',_id2)

            }



            // }
            //  }
        }).on('tap','.editBar .col',function(event)
        {



            if($(this).hasClass('reset')){
                var _currentQuestion = $('.currentQuestion');
                _currentQuestion.find('span').removeClass('active');
                _currentQuestion.find('.orgin').addClass('active');
                if(_currentQuestion.find('.blockDiv').length > 0){
                    var _left1 = _currentQuestion.find('.block1').data('orginleft'),
                        _id1 =_currentQuestion.find('.block1').data('orginid'),
                        _left2 = _currentQuestion.find('.block2').data('orginleft'),
                        _id2 =_currentQuestion.find('.moveTips').data('orginid');
                    _currentQuestion.find('.block1').css('left',_left1);
                    _currentQuestion.find('.block1').attr('data-id',_id1);
                    _currentQuestion.find('.block2').css('left',_left2);
                    _currentQuestion.find('.moveTips').css('left',parseInt(_left2) - 25 ).attr('data-id',_id2);
                    _currentQuestion.find('.inner').css('width',parseInt(_left2) + 13);
                }
                $('.resultPage,.rusultBar ').removeClass('hide');
                $('.editBar').addClass('hide');
                $('#questionContainer').find('.question_item').addClass('hide');
            }
            else if($(this).hasClass('btnOk')){
                var qid,
                    qvalue,
                    answer,
                    answerId,
                    activeSpan = $('.currentQuestion').find('.active');

                answer = activeSpan.data('value');
                answerId = activeSpan.data('id');

                //多个选项
                if(activeSpan.length > 1){
                    var answerIds = [],
                        answerTexts = [];
                    activeSpan.each(function(){
                        answerIds.push($(this).data('id'));
                        answerTexts.push($(this).data('value'));
                    })
                    answerId =  answerIds.join(';');
                    answer = answerTexts.join('/');

                }

                //进度条
                if($('.currentQuestion').find('.colorBlock2').length > 0){
                    answer = $('.currentQuestion').find('.moveTips').text();
                    answerId = $('.currentQuestion').find('.moveTips').data('id');
                }
                //肤色
                if($('.currentQuestion').find('.colorBlock').length > 0) {
                    qvalue = $('.block1').data('value');
                    answerId = $('.block1').data('id');
                }

                qid = $('.currentQuestion').data('index');
                _qid = $('.currentQuestion').data('question');


                //城市
                if($('.currentQuestion').find('#cmbProvince').length > 0){
                    answer = $("#cmbProvince option").not(function(){ return !this.selected }).text() +' '+ $("#cmbCity option").not(function(){ return !this.selected }).text();
                    answerId = $("#cmbProvince option").not(function(){ return !this.selected }).data('area');
                }

                $('.currentQuestion').find('.answerBox').attr('data-answeritem',answerId);

                $('.resultPage dd').each(function(){
                    if($(this).data('id') == qid){
                        $(this).children('span').text(answer);


                        $(this).children('span').attr('data-id',answerId);
                        //$(this).attr('data-question',_qid);
                        if($('.currentQuestion').find('.colorBlock').length > 0){
                            $(this).children('span').html('<b style="background-color: '+qvalue+'"></b>');
                        }
                    }
                })


                //泛红敏感选是（原先是否）
                if($('.currentQuestion').find('.orgin').data('id') == 2 && $('.currentQuestion').find('.active').data('id') == 1){
                    $('.currentQuestion').next().addClass('currentQuestion').siblings().removeClass('currentQuestion');
                    $('.currentQuestion').next().removeClass('hide').siblings().removeClass('hide');
                }else{
                    $('.resultPage,.rusultBar ').removeClass('hide');
                    $('.editBar').addClass('hide');
                    $('#questionContainer').find('.question_item').addClass('hide');
                }
                //if($('.currentQuestion').hasClass('question7')){
                //    $('.currentQuestion').next().addClass('currentQuestion').siblings().removeClass('currentQuestion');
                //    $('.currentQuestion').next().removeClass('hide').siblings().removeClass('hide');
                //}


            }
            $('.currentQuestion').find('span').removeClass('orgin');
            //$('.resultPage,.rusultBar ').removeClass('hide');
            //$('.editBar').addClass('hide');
            //$('#questionContainer').find('.question_item').addClass('hide');

        }).on('tap','.saveBtn',function(){
            showDetailQuestion();
        }).on('tap','#createReport',function(){
            //submitDetailQuestion();
            showDetailQuestion(1);
        }).on('tap','#createReport',function(){

        })

    }



    //初始化有缓存的问题
    function initLocal(){

        var data={
            userId:_uid
        };




        Data.selectQuestionsByUserId(data).done(function(res){
            initShowQuestion(res.options,0);
            isFullIn = res.type;
            if(res.type == '1'){
                _record = res.record;
                flagQuestionAnswer(_record);
                $('#questionContainer').attr('data-rid',-1);

                //地址选择
                var str= _record.envCity;
                var ret=str.split(/\s+/);
                Address.addressData('cmbProvince', 'cmbCity', 'cmbArea',ret[0],ret[1]);

                if(isExpert == 1){
                    $('#questionContainer').attr('data-rid',_record.id);
                    // if(entry != 1){
                    //  $('#questionContainer').find('.question_item').addClass('notEdit');
                    // }

                    $('.rusultBar .start').attr('href',URL.questionnaireSurveyPage + '?uid='+_uid+'&entry=1&isExpert='+isExpert);
                    if(entry == 0){

                        result();
                    }else if(entry == 2){
                        result(res.questions);
                    }

                }


            }else{

                //地址选择
                Address.addressData('cmbProvince', 'cmbCity', 'cmbArea');
                rid = res.record.id;
                $('#questionContainer').attr('data-rid',rid);

            }

        })




    }

    //有填过的，给她上一次的默认答案
    function flagQuestionAnswer(lastAnswer){



        var _AnswerArr = {
            '0': lastAnswer.ageRegion,
            '1': lastAnswer.sex,
            '2':lastAnswer.skinColor,
            '3':lastAnswer.skinType,
            '4':lastAnswer.baskDegree,
            '5':lastAnswer.skinSensitive,
            '6':lastAnswer.skinSensitiveFrequency,
            '7':lastAnswer.skinSensitiveDegree,
            '8':lastAnswer.skinRedness,
            '9':lastAnswer.skinRednessDegree,
            '10':lastAnswer.sleepTime,
            '11':lastAnswer.stressDegree,
            '12':lastAnswer.liveEnv,
            '13':lastAnswer.envCity,
            '14':lastAnswer.season,
            '15':lastAnswer.scProblemIds,

        };

        //基础题
        var questionArr = [];

        questionArr[2]={
            optionsList: [
                {
                    id: 1,
                    optionDes: "",
                    optionName: "#fbf4eb",
                    optionShowStyle: '2',


                },
                {
                    id: 2,
                    optionDes: "",
                    optionName: "#f9f0e1",
                    optionShowStyle: '2',


                },
                {
                    id: 3,
                    optionDes: "",
                    optionName: "#f6edd7",
                    optionShowStyle: '2',


                },
                {
                    id: 4,
                    optionDes: "",
                    optionName: "#f3e9d1",
                    optionShowStyle: '2',


                },
                {
                    id: 5,
                    optionDes: "",
                    optionName: "#efe3c7",
                    optionShowStyle: '2',


                },
                {
                    id: 6,
                    optionDes: "",
                    optionName: "#ebdcba",
                    optionShowStyle: '2',

                },
                {
                    id: 7,
                    optionDes: "",
                    optionName: "#e7d4b4",
                    optionShowStyle: '2',


                },
                {
                    id: 8,
                    optionDes: "",
                    optionName: "#e1ccaa",
                    optionShowStyle: '2',


                },
                {
                    id: 9,
                    optionDes: "",
                    optionName: "#dfc7a0",
                    optionShowStyle: '2',


                },
                {
                    id: 10,
                    optionDes: "",
                    optionName: "#d9c098",
                    optionShowStyle: '2',


                },
                {
                    id: 11,
                    optionDes: "",
                    optionName: "#d2b68a",
                    optionShowStyle: '2',


                },
                {
                    id: 12,
                    optionDes: "",
                    optionName: "#c9a877",
                    optionShowStyle: '2',


                },
                {
                    id: 13,
                    optionDes: "",
                    optionName: "#bb9b6d",
                    optionShowStyle: '2',


                },
                {
                    id: 14,
                    optionDes: "",
                    optionName: "#ae875e",
                    optionShowStyle: '2',


                },
                {
                    id: 15,
                    optionDes: "",
                    optionName: "#9f7356",
                    optionShowStyle: '2',


                }]
        }
        questionArr[7] = {
            optionsList: [
                {
                    id:1,
                    optionDes: "",
                    optionName: "轻度",
                    optionShowStyle: '3',

                },{
                    id:2,
                    optionDes: "",
                    optionName: "中度",
                    optionShowStyle: '3',

                },{
                    id:3,
                    optionDes: "",
                    optionName: "重度",
                    optionShowStyle: '3',

                }]
        }
        questionArr[10] = {
            optionsList: [
                {
                    id: 1,
                    optionDes: "",
                    optionName: "3小时",
                    optionShowStyle: '3',

                }, {
                    id: 2,
                    optionDes: "",
                    optionName: "3半小时",
                    optionShowStyle: '3',

                }, {
                    id: 3,
                    optionDes: "",
                    optionName: "4小时",
                    optionShowStyle: '3',

                }, {
                    id: 4,
                    optionDes: "",
                    optionName: "4半小时",
                    optionShowStyle: '3',

                }, {
                    id: 5,
                    optionDes: "",
                    optionName: "5小时",
                    optionShowStyle: '3',

                }, {
                    id: 6,
                    optionDes: "",
                    optionName: "5半小时",
                    optionShowStyle: '3',

                }, {
                    id: 7,
                    optionDes: "",
                    optionName: "6小时",
                    optionShowStyle: '3',

                }, {
                    id: 8,
                    optionDes: "",
                    optionName: "6半小时",
                    optionShowStyle: '3',

                }, {
                    id: 9,
                    optionDes: "",
                    optionName: "7小时",
                    optionShowStyle: '3',

                }, {
                    id: 10,
                    optionDes: "",
                    optionName: "7半小时",
                    optionShowStyle: '3',

                }, {
                    id: 11,
                    optionDes: "",
                    optionName: "8小时",
                    optionShowStyle: '3',

                }, {
                    id: 12,
                    optionDes: "",
                    optionName: "8半小时",
                    optionShowStyle: '3',

                },{
                    id: 13,
                    optionDes: "",
                    optionName: "9小时",
                    optionShowStyle: '3',

                }, {
                    id: 14,
                    optionDes: "",
                    optionName: "9半小时",
                    optionShowStyle: '3',

                }, {
                    id: 15,
                    optionDes: "",
                    optionName: "10小时",
                    optionShowStyle: '3',

                }]
        }
        questionArr[11] = {
            optionsList: [
                {
                    id:1,
                    optionDes: "",
                    optionName: "没有",
                    optionShowStyle: '3',

                },{
                    id:2,
                    optionDes: "",
                    optionName: "没有",
                    optionShowStyle: '3',

                },{
                    id:3,
                    optionDes: "",
                    optionName: "低",
                    optionShowStyle: '3',

                },{
                    id:4,
                    optionDes: "",
                    optionName: "低",
                    optionShowStyle: '3',

                },{
                    id:5,
                    optionDes: "",
                    optionName: "一般",
                    optionShowStyle: '3',

                },{
                    id:6,
                    optionDes: "",
                    optionName: "一般",
                    optionShowStyle: '3',

                },{
                    id:7,
                    optionDes: "",
                    optionName: "高",
                    optionShowStyle: '3',

                },{
                    id:8,
                    optionDes: "",
                    optionName: "高",
                    optionShowStyle: '3',

                },{
                    id:9,
                    optionDes: "",
                    optionName: "很高",
                    optionShowStyle: '3',

                },{
                    id:10,
                    optionDes: "",
                    optionName: "很高",
                    optionShowStyle: '3',

                }]
        }


        $('.question_item').each(function(i){

            //console.log(_AnswerArr[i]);
            switch ($(this).data('questionvalue')){

                case 1://有标识的题目
                case 2: //正常
                case 4: //缩写
                    $(this).find('dd').each(function(){
                        if($(this).children('span').data('id') == _AnswerArr[i]){
                            $(this).children('span').addClass('active');
                        }
                        if(i==15){
                            if($(this).children('span').data('value') == _AnswerArr[i]){
                                $(this).children('span').addClass('active');
                            }
                        }
                    })

                    if($(this).find('.active').length ==0 ){
                        $(this).addClass('deleteDiv');
                    }

                    break;
                case 3: //进度条&&肤色

                    var _leftIndex = 0,
                        _left = 0;
                    $(this).find('dd').each(function(){


                        if($(this).data('id') == parseInt(_AnswerArr[i])){

                            $('.question'+(i+1)).find('.block1').attr('data-id',_AnswerArr[i]);

                            $('.question'+(i+1)).find('.moveTips').attr('data-id',_AnswerArr[i]);
                            if(questionArr[i]){
                                var opt = questionArr[i].optionsList,
                                    optid = _AnswerArr[i];


                                $('.question'+(i+1)).find('.block1').attr('data-value',opt[optid-1].optionName)
                                $('.question'+(i+1)).find('.moveTips').text(opt[optid-1].optionName).attr('data-value',opt[optid-1].optionName);

                                _leftIndex = $(this).index();
                            }

                        }

                    })

                    var _currentQDiv = $(this);

                    var ww = $('.answerBox').width();
                    _left = ((100 / $(this).find('dd').length) * _leftIndex) * ww / 100;
                    _currentQDiv.find('.block1').css('left',_left + "px");
                    _currentQDiv.find('.inner').css('width',_left + 9 + "px");
                    _currentQDiv.find('.block2').css('left',_left + "px");
                    _currentQDiv.find('.moveTips').css('left',_left - 18 + "px");
                    _leftIndex = 0;



                    break;
                case 5:

                    break;
                default:
                    break;

            }

        })

        if($('.question7').find('.active').length == 0 ){
            $('.question8').addClass('deleteDiv');
        }



    }




    function initShowQuestion(options,index){
        initAllQuestion(options);
        $('.question_item').eq(index).addClass('currentQuestion');
        $('.question_item').eq(index).removeClass('hide');

        if($('.currentQuestion').data('index') == 1 ){
            $('.bar .start,.bar .prev').addClass('hide');
        }


        var _currentQDiv = $('.currentQuestion')

        canTouch(_currentQDiv)
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


            //var oTop = touches.clientY - oH;
            //if(oTop > -10 && oTop < outer-10) {
            //    _flag = true;
            //    block.style.top = oTop + "px";
            //    moveTop = oTop;
            //    callbackinnder(oTop);
            //}
            var oLeft = touches.clientX - oW;
            if(oLeft > -9 && oLeft < outer - 9) {
                _flag = true;
                block.style.left = oLeft + "px";
                moveTop = oLeft;
                callbackinnder(oLeft);
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
            var avgH = outer / (ddCont.length);
            inner.style.width = oTop + 9 + "px";
            tips.style.left = oTop - 25  + "px";
            for(var i = 0,l = ddCont.length; i< l; i++){
                if(oTop > avgH * i && oTop < avgH * (i+1)){
                    tips.innerHTML = ddCont.eq(i).data('value');

                    tips.setAttribute('data-id',ddCont.eq(i).data('id'));
                    moveId = ddCont.eq(i).data('id');
                    moveText = ddCont.eq(i).data('value');


                }
            }

        }

    }
    function drapColor(block,outer,ddCont){

        drap(block,outer,callback1);
        var ddWidth = ddCont.width();
        function callback1(oTop){


            for(var i in ddCont){
                if(oTop > ddWidth * i && oTop < ddWidth * (i+1)){
                    moveId = ddCont.eq(i).data('id');
                    moveText = ddCont.eq(i).data('value');
                    block.setAttribute('data-value',moveText);
                    block.setAttribute('data-id',moveId);
                }
            }

        }
    }

    //滑动
    function canTouch(_currentQDiv){

        // console.log(_currentQDiv.find('.colorBlock2').length > 0 , !_currentQDiv.hasClass('notEdit'),555);

        // if(_currentQDiv.find('.colorBlock').length > 0 && !_currentQDiv.hasClass('notEdit')){
        if(_currentQDiv.find('.colorBlock').length > 0){
            var block1 = _currentQDiv.find('.block1')[0],
                outer1 = _currentQDiv.find('.colorBlockInner').width(),
                ddCont1 = _currentQDiv.find('.colorBlockInner').find('dd');


            drapColor(block1,outer1,ddCont1);
        }
        // if(_currentQDiv.find('.colorBlock2').length > 0 && !_currentQDiv.hasClass('notEdit')){
        if(_currentQDiv.find('.colorBlock2').length > 0){
            var block2 = _currentQDiv.find('.block2')[0],
                outer2 = _currentQDiv.find('.colorBlock2').width(),
                ddCont2 = _currentQDiv.find('.answerBox').find('dd'),
                inner2 = _currentQDiv.find('.inner')[0],
                tips2 = _currentQDiv.find('.moveTips')[0];

            drapProgress(block2,outer2,inner2,tips2,ddCont2)
        }
    }


    //选择
    function StepEvent(btn){

        //选择上一步
        if(btn.parent('li').hasClass('prev')) {
            var isExp=false;

            if($('.currentQuestion').hasClass('question17')){
                $('.resultPage,.rusultBar').removeClass('hide');
                $('.bar').addClass('hide');
                $('.question16 ~ .question_item').remove();
                return;
            }

            if(!$('.resultPage').hasClass('hide')){
                isExp=true;
                //  fristPrev = false;

            }
            if(isExp){
                index = $('.question_item').last().data('index');
                isExp=false;
                $('.resultPage,.rusultBar').addClass('hide');
                $('.bar').removeClass('hide');
            }

            index--;

            if(index <= 0){
                $('.bar .start,.bar .prev').addClass('hide');
            }
            if( index == -1){
                bainx.broadcast('已经是第一页了~')
                index = 0;
                return
            }

            //显示上一题
            $('.question_item').removeClass('currentQuestion');

            if($('.question_item').eq(index).hasClass('deleteDiv') && $('.question_item').eq(index).hasClass('question8')){
                index=5;
            }else if($('.question_item').eq(index).hasClass('deleteDiv') && $('.question_item').eq(index).hasClass('question10')) {
                index=8;
            }
            $('.question_item').eq(index).addClass('currentQuestion');
            $('.currentQuestion').removeClass('hide').siblings('.question_item').addClass('hide');

            //下一题已经选择过了改为true
            if($('.currentQuestion').find('.active').length > 0){
                _flag = true;
            }
        }

        //选择下一步
        else if(btn.parent('li').hasClass('next')){

            //  console.log(index);

            var isMove = false,
                initmoveId,
                initmoveText;

            if($('.currentQuestion').find('.colorBlock').length > 0 && parseInt($('.currentQuestion').find('.block1').css('left')) >= -9 || $('.currentQuestion').find('.colorBlock2').length > 0 && parseInt($('.currentQuestion').find('.block2').css('top')) > -9 || ($('.currentQuestion').find('.cmbCity').val() != '请选择市' && typeof $('.currentQuestion').find('.cmbCity').val() != 'undefined')){
                initmoveId = $('.currentQuestion').find('dd').eq(0).data('id');
                initmoveText = $('.currentQuestion').find('dd').eq(0).data('value');
                isMove = true;
            }
            // console.log(initmoveText);
            if($('.currentQuestion').find('.active').length > 0){
                _flag = true;
            }


            if(_flag || isMove){

                index++;

                if(index <= 0){
                    $('.bar .start,.bar .prev').addClass('hide');
                }else{
                    $('.bar .start,.bar .prev').removeClass('hide');
                }


                //选择了才能执行下一题
                _flag = false;
                isMove = false;
                var _currentQDiv =  $('.currentQuestion');


                if(_currentQDiv.next().find('.active').length > 0 ){
                    _flag = true;
                }

                //存储答案
                var a_index = [],
                    answerItem = [],
                    answerText = [],
                    answerArr = [];
                _currentQDiv.find('.active').each(function(){
                    a_index.push($(this).parent('dd').index());
                    answerItem.push($(this).parent('dd').children('span').data('id'));

                    answerText.push($(this).parent('dd').children('span').data('value'));


                })
                answerItem = answerItem.join(';');
                answerText = answerText.join(';');
                var qid = _currentQDiv.data('question'),

                    oIds = answerItem;



                //如果有滑动的保存滑动值
                if(_currentQDiv.find('.blockDiv').length > 0){

                    if(_currentQDiv.find('.answerBox').data('answeritem') && moveId == ''){
                        moveId = $('.currentQuestion').find('.answerBox').data('answeritem');
                        $('.currentQuestion dd').each(function(){
                            if($(this).data('id') == moveId){
                                moveText = $(this).data('value');
                            }
                        })

                    }

                    if(moveId == ''){
                        moveId = initmoveId;
                        moveText = initmoveText;
                    }

                    // console.log(moveId,'000025');
                    // console.log(moveId);

                    moveId = moveId.toString();
                    oIds = moveId;
                    oId = moveId;
                    answerItem = moveId;
                    answerText = moveText;

                }
                if(_currentQDiv.find('#cmbProvince').length > 0){
                    oIds = $("#cmbProvince option").not(function(){ return !this.selected }).data('area').toString();
                    answerItem = oIds;
                    answerText = $("#cmbProvince option").not(function(){ return !this.selected }).text() +' '+ $("#cmbCity option").not(function(){ return !this.selected }).text();
                }


                var lastQ = _currentQDiv.children('.answerBox').data('last') == '1' ? true : false;


                answerArr.push(qid,oIds,moveTop,lastQ,answerText);

                //如果下一题没有加载过才加载~在有缓存的时候已经加载了

                $('.currentQuestion').find('.answerBox').attr('data-answeritem',answerItem);


                moveTop = 0;

                moveId = '';


                _arrI[index-1] = answerArr;
                //console.log(answerArr);



                //敏感泛红选择
                if($('.currentQuestion').hasClass('question6') && $('.question6').find('.active').data('id') == 2){
                    $('.question8').addClass('currentQuestion').siblings('.currentQuestion').removeClass('currentQuestion');
                    $('.question7,.question8').addClass('deleteDiv');
                    //$('.question7,.question8').remove();
                    _arrI[6] = [7,'0',0,false,''];
                    _arrI[7] = [8,'0',0,false,''];
                    index = 8;

                }else if($('.currentQuestion').hasClass('question6') && $('.question6').find('.active').data('id') == 1){
                    $('.question7,.question8').removeClass('deleteDiv');
                }
                if($('.currentQuestion').hasClass('question9') && $('.question9').find('.active').data('id') == 2){
                    $('.question10').addClass('currentQuestion').siblings('.currentQuestion').removeClass('currentQuestion');
                    $('.question10').addClass('deleteDiv');
                    _arrI[9] = [10,'0',0,false,''];
                    index = 10;
                }else if($('.currentQuestion').hasClass('question9') && $('.question9').find('.active').data('id') == 1){
                    $('.question10').removeClass('deleteDiv');
                }

                var qIndex = $('.currentQuestion').data('index')+1;


                if(qIndex >16){
                    //fristNext++;
                    // if($('.question17').length == 0){

                    if($('.currentQuestion').data('index') == 16){

                        // setTimeout(function() {

                        result()
                        // }, 320);
                    }

                    // fristNext =0;
                    //  }
                    //  else{


                    var detailLength= $('.question16 ~ .question_item').length;
                    //  console.log(qIndex,detailLength,'5555');

                    if($('.currentQuestion').hasClass('lastQuestion')){
                        $('.question_item').last().addClass('hide');
                        var hasOver = true;
                        result('',hasOver);

                    }

                    // }

                }

                $('.currentQuestion').next().addClass('currentQuestion').siblings('.currentQuestion').removeClass('currentQuestion');
                $('.currentQuestion').removeClass('hide').siblings('.question_item').addClass('hide');


                var _currentQDiv = $('.currentQuestion');
                canTouch(_currentQDiv)



            }else{
                bainx.broadcast('请选择~')
            }
        }

        //重新开始
        if(btn.parent('li').hasClass('start')){

            _flag = false;
            index = 0;
            localLoad = false;
            isRestart = true;

            $('#questionContainer').find('.question_item').remove();


            initLocal();
            if(localStorage.length > 0) {    //localStorage
                localStorage.removeItem(_uid);
            }

        }
    }



    //提交细化问题
    function submitDetailQuestion(){//index当前题,


        $('.question16 ~ .question_item').each(function(j) {

            var qid = $(this).data('question'),
                _answerL = $(this).find('.answerBox').data('answeritem');

            _answerList.push(qid + '$' + _answerL);

            _answerListS =  _answerList.join('|');
        })

        var data = {
            userId:_uid,
            answer:_answerListS,
            recordId:$('#questionContainer').data('rid')
        }

        Data.insertOneOtherCRecordByParams(data).done(function(res){

            URL.assign('_createReport1');

        }).fail(function(){
            alert('保存失败');
        })

    }


    //显示细化问题
    function showDetailQuestion(xhflag){

        var datadoflag = (entry == 0 && isExpert == 0 && isFullIn == '1' && isEdit || entry == 1  && isFullIn == '1' && isEdit || isRestart) ? 1 : 0,//用户端入口2（+）,为插入数据操作。。其余为更新操作  entry=0,入口2，isExpert=0，不是专家，isFullIn=填过（如果没填过，一开始会插入数据，基本问题只要更新即可）。  1为插入操作0为更新操作
            questionnaireRecordsName = _uid,
            scProblemIds = $('.question16').find('.active').data('id'),
            ageRegion=$('.question1').find('.active').data('id'),
            sex=$('.question2').find('.active').data('id'),
            skinColor=$('.question3').find('.block1').data('id'),
            skinType=$('.question4').find('.active').data('id'),//肤质
            baskDegree=$('.question5').find('.active').data('id'),//日晒情况
            skinSensitive=$('.question6').find('.active').data('id'),//敏感
            skinSensitiveFrequency = skinSensitive == 2 ? '' : $('.question7').find('.active').data('id'),//敏感程度
            skinSensitiveDegree = skinSensitive == 2 ? '' : $('.question8').find('.moveTips').data('id'),//严重程度
            skinRedness=$('.question9').find('.active').data('id'),//泛红
            skinRednessDegree= skinRedness == 2 ? '' : $('.question10').find('.active').data('id'),//泛红程度
            sleepTime=$('.question11').find('.moveTips').data('id'),//睡眠时间
            stressDegree=$('.question12').find('.moveTips').data('id'),//承受压力情况
            liveEnv=$('.question13').find('.active').data('id'),//居住环境
            envCity=$("#cmbProvince option").not(function(){ return !this.selected }).text() +' '+ $("#cmbCity option").not(function(){ return !this.selected }).text(),//城市
            envArea=$("#cmbProvince option").not(function(){ return !this.selected }).data('area').toString(),//南北方
            season = $('.question15').find('.active').data('id');//季节

        isRestart = false;
        isEdit = false;//已经插入数据了，修改答案为更新操作

        $('.question16 ~ .question_item').each(function(j) {

            var qid = $(this).data('question'),
                _answerL = $(this).find('.answerBox').data('answeritem');

            _answerList.push(qid + '$' + _answerL);

            _answerListS =  _answerList.join('|');
        })


        // console.log(skinSensitive,skinSensitiveDegree);

        var data = {
            datadoflag:datadoflag,
            questionnaireRecordsName:questionnaireRecordsName,  //'手机号
            scProblemIds:scProblemIds,//解决问题
            //age:age,//年龄
            ageRegion:ageRegion,
            sex:sex,//性别
            skinColor:skinColor,//肤色
            skinType:skinType,//肤质
            baskDegree:baskDegree,//日晒情况
            skinSensitive:skinSensitive,//敏感
            skinSensitiveFrequency:skinSensitiveFrequency,//敏感程度
            skinSensitiveDegree:skinSensitiveDegree,//严重程度
            skinRedness:skinRedness,//泛红
            skinRednessDegree:skinRednessDegree,//泛红程度
            stressDegree:stressDegree,//承受压力情况
            liveEnv:liveEnv,//居住环境
            sleepTime:sleepTime,//睡眠时间
            envCity:envCity,//城市
            envArea:envArea,//南北方
            season:season,//季节
            flag:isExpert,
            userId:_uid,
            id:recordId ? recordId : $('#questionContainer').data('rid'),
            answer:_answerListS,
            xhflag:xhflag

        }


        //console.log(data);
        // result();

        Data.insertOneRecordByParams(data).done(function(res){
            // console.log(res);


            //$('#questionContainer').find('.question_item').addClass('notEdit');


            if(isExpert == 1){  //专家

                $('#questionContainer').data('rid',res.record.id);
                canTap = false;

                var html = [],
                    questionDetails = res.data;

                console.log(questionDetails.length);

                if(questionDetails.length > 0){
                    detailLength = questionDetails.length;

                    // $('.question16 ~ .question_item').remove();
                    $('.question16').after(questionItem(questionDetails,17));


                    index=16;

                    $('.question_item').last().addClass('lastQuestion');
                    $('.rusultBar,.resultPage').addClass('hide');
                    $('.bar').removeClass('hide');


                    $('#questionContainer').find('.question_item').addClass('hide').removeClass('currentQuestion');
                    // if(_curIndex == 16){

                    $('.question17').addClass('currentQuestion').removeClass('hide');

                }

                else{

                    result();
                    bainx.broadcast('没有细化问题了，可以直接生成问卷');
                    $('.saveBtn').text('生成问卷').attr('id','createReport').removeClass('saveBtn');

                }

            }else{

                bainx.broadcast('保存成功');
                URL.assign('_callExpert1');

                result();
            }



        })

    }




    //问卷结果
    function result(question,hasOver){

        $('.bar').addClass('hide');
        $('.bar .start,.bar .prev').removeClass('hide');


        if($('.resultPage .data').length > 0){
            $('.resultPage .data,.resultPage p').remove();
        }



        var dataAnswer = [],
            detailQuestion= [],
            detailAnswer = [];


        //是否有敏感程度
        isSkinSensitive = false;

        for(var i=1;i<17;i++){
            var _questionvalue = $('.question' + i).data('questionvalue') ;

            // console.log(_questionvalue, typeof _questionvalue);
            switch (_questionvalue){

                case 1://有标识的题目
                case 2: //正常
                case 4: //缩写

                    if((i-1) == 6 && $('.question' + (i-1)).find('.active').data('id') == 2){
                        isSkinSensitive = true;
                    }
                    if((i-1) == 9 && $('.question' + (i-1)).find('.active').data('id') == 2){
                        isSkinSensitive = true;
                    }
                    if(!isSkinSensitive){
                        dataAnswer[i] = $('.question' + i).find('.active').data('value');
                    }
                    isSkinSensitive = false;


                    break;
                case 3: //进度条&&肤色

                    if((i-2) == 6 && $('.question' + (i-2)).find('.active').data('id') == 2){
                        isSkinSensitive = true;
                    }
                    if(!isSkinSensitive){
                        dataAnswer[i] = $('.question' + i).find('.moveTips').text();
                    }
                    isSkinSensitive = false;

                    if(i == 3){  //肤色
                        dataAnswer[i] = $('.question' + i).find('.block1').data('value');
                    }
                    break;
                case 5:
                    dataAnswer[i] = $("#cmbProvince option").not(function(){ return !this.selected }).text() +' '+ $("#cmbCity option").not(function(){ return !this.selected }).text();
                    break;
                default:
                    break;
            }
        }

        console.log(dataAnswer);






        if(question){


            var qids = [],
                answerValues = [];

            $.each(question,function(index,item){

                detailQuestion.push(item.questionShortName);
                qids.push(item.questionId);

            })
            detailQuestion = detailQuestion.delSame();
            qids = qids.delSame();

            $.each(qids,function(i,qid){
                var answerValue = [];
                $.each(question,function(index,item){
                    if(qid == item.questionId){
                        answerValue.push(item.optionValue);
                    }
                })
                //var obj={
                //    id:qid,
                //    str:answerValue.join('')
                //};
                detailAnswer.push(answerValue.join(''));
            })
            console.log(qids,detailAnswer);

        }else{
            $('.question16 ~ .question_item').each(function(j){
                var activeSpan = $('.question' + (17+j)).find('.active'),
                    answerValue;
                detailQuestion[j] = $('.question' + (17+j)).find('.title').data('shortname');


                if(activeSpan.length > 1){
                    var answerTexts = [];
                    activeSpan.each(function(){
                        answerTexts.push($(this).data('value'));
                    })
                    answerValue = answerTexts.join('/');
                }else{
                    answerValue = $('.question' + (17+j)).find('.active').data('value')
                }

                if($(this).find('.moveTips').length > 0){
                    answerValue = $('.question' + (17+j)).find('.moveTips').text();
                }
                detailAnswer[j] = answerValue;

            })
        }

        var
            html=[],
            detail=[];

        //肌肤颜色
        if(dataAnswer[3].indexOf('#') > -1){
            dataAnswer[3] = '<b style="background-color: '+dataAnswer[3]+'"></b>';
        }


        userName = isExpert == 1 ? URL.param.userName : '我',

            dataQuestion1 = {
                '16':'主要肌肤问题<span>'+dataAnswer[16]+'</span>',
                '3':'自然肤色为<span>'+dataAnswer[3]+'</span>',
                '4':'肌肤类型为<span>'+dataAnswer[4]+'</span>',
                '9':'<span>'+dataAnswer[9]+'</span>出现肌肤泛红情况。',
                '10': dataAnswer[10] ? '<span>'+dataAnswer[10]+'</span>出现肌肤泛红情况。' :''

            },
            dataQuestion2 = {
                '1':'年龄在<span>'+dataAnswer[1]+'<span>',
                '2':'性别是<span>'+dataAnswer[2]+'</span>',
                '5':'日晒程度为<span>'+dataAnswer[5]+'</span>',
                '6':'<span>'+dataAnswer[6]+'</span>出现肌肤敏感情况',
                '7': dataAnswer[7]  ? '<span>'+dataAnswer[7]+'</span>出现肌肤敏感情况' : '',
                '8':dataAnswer[8]  ? '肌肤敏感问题为<span>'+dataAnswer[8]+'</span>':'',
                '11':'晚上一般睡<span>'+dataAnswer[11]+'</span>',
                '12':'压力水平为<span>'+dataAnswer[12]+'</span>',
                '13':'所处的环境为<span>'+dataAnswer[13]+'</span>',
                '14':'所在城市为<span>'+dataAnswer[14]+'</span>',
                '15':'所在区域的季节为<span>'+dataAnswer[15]+'</span>',

            }



        $.each(dataQuestion1, function(index, item){


            html.push('<dd data-id="'+index+'">'+item+'</dd>');

        });
        $.each(dataQuestion2, function(index, item){

            detail.push('<dd data-id="'+index+'" >'+item+'</dd>');


        });

        $('.resultPage').removeClass('hide');


        name = URL.param.userName ? URL.param.userName : '我们来回顾下您';
        $('#questionContainer').find('.question_item').addClass('hide');

        $('.rusultBar').removeClass('hide');
        if($('.resultPage .data').length == 0){

            $('.resultPage').append('<p class="title">'+name+'的肌肤测试</p><ul class="data"><li class="skinCondition"><h3>肌肤状态</h3><dl class="detail">'+html.join('')+'</dl></li><li class="lifeStyle"><h3>生活方式</h3><dl class="detail">'+detail.join('')+'</dl></li></ul>');

            $('dd').each(function(){
                if($(this).text().length == 0){
                    $(this).css('padding-top',0);
                }
            })
        }
        if($('.question17').length > 0 && hasOver){

            // $('.saveBtn').text('保存问卷').addClass('fillInDetail').removeClass('saveBtn');
            $('.saveBtn').text('生成报告').attr('id','createReport').removeClass('saveBtn');
        }


        if($('.question17').length > 0 && hasOver || question){
            var experHtml = [];

            $.each(detailAnswer,function(index,item){
                experHtml.push('<dd data-answerItem="" data-id="'+(index+17)+'">'+detailQuestion[index]+'<span>'+item+'</span></dd>');
            })
            if($('.detailQustion').length == 0){
                $('.resultPage ul.data').append('<li class="skinCondition detailQustion"><h3>细化问题</h3><dl class="detail">'+experHtml.join('')+'</dl></li>');
            }

        }


        if($('.editBar').length == 0){
            $('body').append('<div class="editBar bottom_bar grid hide"> <ul class=" row"><li class="col btnOk "><span class="btn">确定</span></li><li class="col reset"><span class="btn">取消</span></li></ul> </div>')
        }


    }




    //判断是否是多选
    function chooseRC(target,canMultiple,chooseNum){
        canMultiple == true ? chooseAnswerRadio(target) : chooseAnswerCheckbox(target,chooseNum);
    }

    //单选
    function chooseAnswerRadio(target){
        var _span = target.children('span'),
            _view =target.parents('.answerBox'),
            siblingsSpan = _view.find('span');
        siblingsSpan.removeClass('active');
        _span.addClass('active');
        if(_view.find('.active').length > 0){
            _flag = true;
        }

    }

    //多选
    function chooseAnswerCheckbox(target,chooseNum){
        var _span =target.children('span'),
            _view =target.parents('.answerBox'),
            _activeL = _view.find('.active').length;

        // console.log(_activeL);
        if(_span.hasClass('active')){
            _span.removeClass('active')
            if(_activeL==1){
                _flag = false;
            }
        }else{
            if(_activeL < chooseNum) {
                _span.addClass('active')
                _flag = true;
            }
            else
            {
                bainx.broadcast('最多只能选择'+chooseNum+'个')
            }
        }
    }

    init();

})
