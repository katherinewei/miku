/**
 * 问卷的基本问题&答案
 * Created by xiuxiu on 2016/6/23.
 */
define('h5/js/common/questionData',[],function(){
    //基础题
    var questionArr = [
        {
            question: {
                id:1,
                optionsSelectableMaxnum: "1",
                questionDes: "",
                questionName: "皮肤触感？"
            },
            questionType: 2,
            isend: false,
            optionsList: [
                {
                id:0,
                optionDes: "",
                optionName: "脱皮严重"
            },{
                id:1,
                optionDes: "",
                optionName: "少量脱皮"

            },{
                id:2,
                optionDes: "",
                optionName: "粗糙"

            },{
                id:3,
                optionDes: "",
                optionName: "光滑"

            },{
                id:4,
                optionDes: "",
                optionName: "有油腻感"

            },{
                id:5,
                optionDes: "",
                optionName: "非常油腻"

            }]
        },
        {
            question: {
                id:2,
                optionsSelectableMaxnum: "1",
                questionDes: "",
                questionName: "皮肤的白皙度？"

            },
            questionType: 2,
            isend: false,
            questionShowValue:2,
            optionsList: [
                {
                id:0,
                optionDes: "",
                optionName: "皮肤很白"
            },{
                id:1,
                optionDes: "",
                optionName: "皮肤偏白"

            },{
                id:2,
                optionDes: "",
                optionName: "不白不黑"

            },{
                id:3,
                optionDes: "",
                optionName: "皮肤偏黑"

            },{
                id:4,
                optionDes: "",
                optionName: "皮肤很黑"

            }]
        },
        {
            question: {
                id:3,
                optionsSelectableMaxnum: "1",
                questionDes: "",
                questionName: "皮肤的毛孔情况？"

            },
            questionType: 2,
            isend: false,
            optionsList: [
                {
                    id: 0,
                    optionDes: "",
                    optionName: "毛孔几乎不可见"
                },
                {
                    id: 1,
                    optionDes: "",
                    optionName: "毛孔细腻"
                },
                {
                    id: 2,
                    optionDes: "",
                    optionName: "毛孔明显"
                },
                {
                    id: 3,
                    optionDes: "",
                    optionName: "毛孔粗大"
                }]
        },
        {
            question: {
                id:4,
                optionsSelectableMaxnum: "1",
                questionDes: "",
                questionName: "鼻头情况"

            },
            questionType: 2,
            isend: false,
            optionsList: [
                {
                    id: 0,
                    optionDes: "",
                    optionName: "鼻头毛孔细腻"
                },
                {
                    id: 1,
                    optionDes: "",
                    optionName: "鼻头油腻"
                },
                {
                    id: 1,
                    optionDes: "",
                    optionName: "鼻头有白头/黑头"
                }]
        },
        {
            question: {
                id:5,
                optionsSelectableMaxnum: "1",
                questionDes: "",
                questionName: "脸颊情况"

            },
            questionType: 2,
            isend: false,
            optionsList: [
                {
                    id:0,
                    optionDes: "",
                    optionName: "脸颊油腻"
                }, {
                    id:1,
                    optionDes: "",
                    optionName: "脸颊不干不油"

                },{
                    id:2,
                    optionDes: "",
                    optionName: "脸颊粗糙"

                },{
                    id:3,
                    optionDes: "",
                    optionName: "脸颊脱皮"

                },{
                    id:4,
                    optionDes: "",
                    optionName: "几乎不长"

                }]
        },
        {
            question: {
                id:6,
                optionsSelectableMaxnum: "1",
                questionDes: "",
                questionName: "痘痘的情况？"

            },
            questionType: 2,
            isend: false,
            optionsList: [
                {
                    id:0,
                    optionDes: "",
                    optionName: "从不长痘"
                },{
                    id:1,
                    optionDes: "",
                    optionName: "偶尔上火长痘"


                },{
                    id:2,
                    optionDes: "",
                    optionName: "长期长痘"

                }]
        },
        {
            question: {
                id:7,
                optionsSelectableMaxnum: "6",
                questionDes: "",
                questionName: "肤色情况"

            },
            questionType: 2,
            isend: false,
            optionsList: [
                {
                    id:0,
                    optionDes: "",
                    optionName: "肤色不均匀"
                },{
                    id:1,
                    optionDes: "",
                    optionName: "肤色偏黄"
                },{
                    id:2,
                    optionDes: "",
                    optionName: "肤色偏红"
                },{
                    id:3,
                    optionDes: "",
                    optionName: "肤色偏青"
                },{
                    id:4,
                    optionDes: "",
                    optionName: "肤色偏黑"
                },{
                    id:5,
                    optionDes: "",
                    optionName: "皮肤长斑"
                }]
        },
        {
            question: {
                id:8,
                optionsSelectableMaxnum: "1",
                questionDes: "",
                questionName: "衰老性情况"

            },
            questionType: 2,
            isend: false,
            optionsList: [
                {
                    id:0,
                    optionDes: "",
                    optionName: "皮肤暂无衰老迹象"
                },{
                    id:1,
                    optionDes: "",
                    optionName: "出现隐形眼角纹"
                },{
                    id:2,
                    optionDes: "",
                    optionName: "出现显性眼角纹"
                },{
                    id:3,
                    optionDes: "",
                    optionName: "出现全脸性皱纹"

                }]
        },
        {
            question: {
                id:9,
                optionsSelectableMaxnum: "4",
                questionDes: "",
                questionName: "眼部情况"

            },
            questionType: 2,
            isend: false,
            optionsList: [
                {
                    id:0,
                    optionDes: "",
                    optionName: "黑眼圈（短期）"
                },{
                    id:1,
                    optionDes: "",
                    optionName: "黑眼圈（长期）"
                },{
                    id:2,
                    optionDes: "",
                    optionName: "眼袋"
                },{
                    id:3,
                    optionDes: "",
                    optionName: "油脂粒"

                }]
        },
        {
            question: {
                id:10,
                optionsSelectableMaxnum: "5",
                questionDes: "",
                questionName: "皮肤敏感情况"

            },
            questionType: 2,
            isend: false,
            optionsList: [
                {
                    id:0,
                    optionDes: "",
                    optionName: "从未敏感"

                },{
                    id:1,
                    optionDes: "",
                    optionName: "皮肤容易发痒，刺痛，"
                },{
                    id:2,
                    optionDes: "",
                    optionName: "皮肤很薄，容易看到红血丝，静脉管"
                },{
                    id:3,
                    optionDes: "",
                    optionName: "用一些美白功效型产品，感觉皮肤刺刺痒痒的感觉"

                },{
                    id:4,
                    optionDes: "",
                    optionName: "非常敏感，即使使用爽肤水也会有此刺痛感觉"

                }]
        },
        {
            question: {
                id:11,
                optionsSelectableMaxnum: "1",
                questionDes: "",
                questionName: "皮肤过敏情况"

            },
            questionType: 2,
            isend: false,
            optionsList: [
                {
                    id:0,
                    optionDes: "",
                    optionName: "从不过敏"
                },{
                    id:1,
                    optionDes: "",
                    optionName: "对酒精过敏"
                },{
                    id:2,
                    optionDes: "",
                    optionName: "对花粉过敏"
                },{
                    id:3,
                    optionDes: "",
                    optionName: "对海鲜等蛋白质过敏"

                },{
                    id:4,
                    optionDes: "",
                    optionName: "对其它东西过敏"

                }]
        },
        {
            question: {
                id:12,
                optionsSelectableMaxnum: "16",
                questionDes: "",
                questionName: "皮肤护理需求"
            },
            questionType: 3,
            isend: false,
            optionsList: [
                {
                    id:0,
                    optionName: "敏感肌"
                },{
                    id:1,
                    optionName: "补水"
                },{
                    id:2,
                    optionName: "美白"
                },{
                    id:3,
                    optionName: "油性肌"
                },{
                    id:4,
                    optionName: "过敏肌"
                },{
                    id:5,
                    optionName: "混合肌"
                },{
                    id:6,
                    optionName: "痘痘肌"
                },{
                    id:7,
                    optionName: "抗衰老"
                },{
                    id:8,
                    optionName: "祛斑"
                },{
                    id:9,
                    optionName: "眼部特护"
                },{
                    id:10,
                    optionName: "其他"
                }]
        }
    ];
    return questionArr;
})
