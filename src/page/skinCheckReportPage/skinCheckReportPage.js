/**
 * Created by Spades-k on 2016/10/24.
 */
require([
    'gallery/jquery/2.1.1/jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/common',
    'plugin/echarts/echarts2mychange',
    'plugin/html2canvas/0.4.1/html2canvas',
], function($,URL, Data,Common,ec,html2canvas) {
    var imgData,
        type = 'jpg',
        boxId=URL.param.boxId,aname;
    function init() {
        render();
        Events();
    }

    function render(){
        $('.waitting').hide();
        var html='<section class="skinReport" id="skinReport"><div class="reportHead"><h2>肌肤检测报告</h2><p>Skin-Test Report from 9LAB</p></div><div class="reportCon"><ul><li class="information"><dl><dt><h4>用户基本信息</h4>&nbsp;|&nbsp;<span>User Information</span></dt><dd><ul class="clearfix inbox"><li><label for="name">姓名：</label><span id="name"></span></li><li><label for="sex">性别：</label><div id="sex"></div></li><li><label for="weight">体重：</label><span id="weight"></span></li><li><label for="height">身高：</label><span id="height"></span></li><li><label for="birthday">生日：</label><span id="birthday"></span></li><li><label for="addres">地址：</label><span id="addres"></span></li></ul></dd></dl></li><li class="problem"><dl><dt><h4>专家确诊问题</h4>&nbsp;|&nbsp;<span>Diagnosis Problem</span></dt><dd><ul class="clearfix"><li><div id="main1"></div></li><li><div id="main2"></div></li><li><div id="main3"><div class="box1"><p>暂无</p><div class="scale"><span class="slight">轻微</span><div class="widthS"><span class="kedu keduadd"></span><span class="kedu kedu1"></span><span class="kedu kedu2"></span><span class="kedu kedu3"></span><span class="kedu kedu4"></span><span class="kedu kedu5"></span></div><span class="grave">严重</span></div></div><div class="box2"><p>暂无</p><div class="scale"><span class="slight">轻微</span><div class="widthS"><span class="kedu keduadd"></span><span class="kedu kedu1"></span><span class="kedu kedu2"></span><span class="kedu kedu3"></span><span class="kedu kedu4"></span><span class="kedu kedu5"></span></div><span class="grave">严重</span></div></div><div class="box3"><p class="standard"><span></span>肌肤标准图</p><p class="typeP"><span></span>肌肤类型图</p><p class="problemG"><span></span>问题成因图</p></div></div></li></ul></dd></dl></li><li class="problemAnalysis"><dl><dt><h4>专家问题分析</h4>&nbsp;|&nbsp;<span>Problem Analysis</span></dt><dd class="proList"></dd></dl></li><li class="proposal"><dl><dt><h4>产品搭配及健康养生建议</h4>&nbsp;|&nbsp;<span>Other Advice</span></dt><dd class="psalList"></dd></dl></li></ul></div><div class="footer"><div class="byName"><p>审&nbsp;&nbsp;核：</p><p>Verified by</p></div><div class="seal"><img src="'+URL.site+'/image/pic_zhang.png"></div></div><div class="logo"><img src="'+URL.site+'/image/pic_9lab.png"></div><div class="descCom"><img src="'+URL.site+'/image/pic_english.png"></div><div class="autograph"></div></section>';


        $(html).appendTo('body');
        //下载
        $('body').append('<button class="download">下载</button>');

        var data={
            boxId:boxId
        }
        Data.getBoxRecordInfoByBoxId(data).done(function(res) {
            var resData = res.data;
            //基本信息
            $('#name').text(resData.name ? resData.name : '暂无');
            aname=resData.name ? resData.name : '';
            var sex='';
            if(resData.sex){
                resData.sex==1 ? sex='<span class="man"><img src="'+URL.site+'/image/icon_sure.png"></span>男<span class="woman"><img src="'+URL.site+'/image/pic_kuang.png"></span>女' : sex='<span class="man"><img src="'+URL.site+'/image/pic_kuang.png"></span>男<span class="woman"><img src="'+URL.site+'/image/icon_sure.png"></span>女';
            }else {
                sex='暂无';
            }
            $('.box2 p').text(resData.checkName?resData.checkName : '暂无');
            var left = 0;
            switch (resData.checkValue){
                case '1':
                    left = 25;
                    break;
                case '2':
                    left = 50;
                    break;
                case '3':
                    left = 75;
                    break;
                default:
                    left = 0;
            }
            $('.box2 .keduadd').css('left',left+'%');

            $('#sex').html(sex);
            $('#weight').text(resData.weight ? resData.weight+'kg' : '暂无');
            $('#height').text(resData.height ? resData.height+'cm' : '暂无');
            if(resData.birthday){
                $('#birthday').text(bainx.formatDate('Y-m-d', new Date(resData.birthday)));
            }else {
                $('#birthday').text('暂无');
            }
            $('#addres').text(res.data.city ? res.data.city : '暂无');

            //专家确诊问题
            chartFn(res.data.skinTypeData,res.data.skinCauseData);

            //问题分享
            var imgsListP=[];
            if(res.data.imgs){
                var imgs=res.data.imgs.split(';');
                if(imgs.length>0){
                    for(var i=0;i<4;i++){
                        if(imgs[i]){
                            imgsListP.push('<img src="'+URL.site+'/'+imgs[i]+'">');
                        }else {
                            imgsListP.push('<img src="'+URL.site+'/image/icon_fangkhang.png'+'">');
                        }
                    }
                }
            }
            //else {
            //
            //    for(var i=0;i<4;i++){
            //        imgsListP.push('<img src="'+URL.site+'/image/icon_fangkhang.png'+'">');
            //    }
            //}


            var qarr=[],h=[];
            if(resData.expertCheckfaceQuestion){
                var expertCheckfaceQuestion=resData.expertCheckfaceQuestion.split('\n');
                for(var p=0;p<expertCheckfaceQuestion.length;p++){
                    if(expertCheckfaceQuestion[p].length>44){
                        var reg=/.{1,44}/g,rs=expertCheckfaceQuestion[p].match(reg);
                        $.each(rs,function(i,v){
                            h.push('<span>'+v+'</span>');
                        })
                    }else {
                        h.push('<span>'+expertCheckfaceQuestion[p]+'</span>');
                    }
                }
                qarr.push('<p>'+ h.join('')+'</p>');
            }else {
                qarr.push('<p>暂无</p>');
            }


            var tp='<div class="imgsList">'+imgsListP.join('')+'</div>'+qarr.join('');
            $('.proList').empty();
            $('.proList').append(tp);

            //产品搭配及健康养生建议

            var proImgsL=[];
            if(resData.itemsName){
                //var proImgs=res.data.proImgs.split(';');
                var itemsName=resData.itemsName.split(';');
                var imgU='',imgC='';
                for(var u=0;u<itemsName.length;u++){
                    if(itemsName[u]=='面部调理霜'  || itemsName[u]=='精纯液'){

                    }else {
                        if(itemsName[u]=='洁面霜' || itemsName[u]=='保湿霜' || itemsName[u]=='倍润霜' || itemsName[u]=='隔离霜'){
                            imgU=URL.site+'/image/product/baoshishuang.png';
                        }else if(itemsName[u]=='舒缓水' || itemsName[u]=='保湿乳'){
                            imgU=URL.site+'/image/product/shuhuanshui.png';
                        }

                        //else if(itemsName[u]=='精纯液'){
                        //    imgU=URL.site+'/image/product/jingchunye.png';
                        //}
                        else if(itemsName[u].indexOf('修复面膜') >=0 ){
                            imgU=URL.site+'/image/product/xiufumianmo.png';
                            imgC = 'mianmo';
                        }
                        else if(itemsName[u].indexOf('基础眼霜') >=0 ){
                            imgU=URL.site+'/image/product/jichuyanshuang.png';
                        }
                        else if(itemsName[u].indexOf('多效眼霜') >=0 ){
                            imgU=URL.site+'/image/product/duoxiaoyanshuang.png';
                        }
                        //else {
                        //    imgU=URL.site+'/image/product/jingchunye.png';
                        //}

                        proImgsL.push('<li><div class="pic"><img src="'+imgU+'" class="'+imgC+'"></div><span>'+itemsName[u]+'</span></li>');
                    }
                }
            }

            var sarr=[],sh=[];
            if(resData.suggest){
                var suggest=resData.suggest.split('\n');
                for(var p=0;p<suggest.length;p++){
                    if(suggest[p].length>44){
                        var reg=/.{1,44}/g,rs=suggest[p].match(reg);
                        $.each(rs,function(i,v){
                            sh.push('<span>'+v+'</span>');
                        })
                    }else {
                        sh.push('<span>'+suggest[p]+'</span>');
                    }
                }
                sarr.push('<p>'+ sh.join('')+'</p>');
            }else {
                sarr.push('<p>暂无</p>');
            }

            var t='<div class="imgsList"><ul class="clearfix">'+proImgsL.join('')+'</ul></div>'+sarr.join('');
            $('.psalList').empty();
            $('.psalList').append(t);

            //签名
            if(resData.csadName){
                var tp='';
                switch (resData.csadName){
                    case 'ADA WANG':
                        tp='<img src="'+URL.site+'/image/wang.png">';
                        break;
                    case 'QUNEE LAN':
                        tp='<img src="'+URL.site+'/image/lan.png">';
                        break;
                }
                $('.autograph').append(tp);

                ////策略
                //var getCsadName={
                //    'ADA WANG':function(){
                //        return '<img src="'+URL.site+'/image/wang.png">';
                //    },
                //    'QUNEE LAN':function(){
                //        return '<img src="'+URL.site+'/image/lan.png">';
                //    }
                //}
                ////环境
                //var setCsadName=function(k){
                //    $('.autograph').append(getCsadName[k]);
                //}
                //setCsadName(res.data.csadName);

            }

        })


        function chartFn(skinTypeData1,skinCauseData1){
            //雷达图1
            var myChart1 = ec.init(document.getElementById('main1'));
            var myChart2 = ec.init(document.getElementById('main2'));
            var skinTypeData;
            var skinCauseData;
            if(skinTypeData1){
                skinTypeData=skinTypeData1.split(',');
            }else {
                skinTypeData=[0,0,0,0,0,0,0,0,0,0];
            }
            if(skinCauseData1){
                skinCauseData=skinCauseData1.split(',');
            }else {
                skinCauseData=[0,0,0,0,0,0];
            }

            var option1 = {
                title: {
                    text: '',
                    //textStyle:{
                    //    color:'#47515a',
                    //    fontSize:14
                    //},
                    //textAlign: 'right'
                },
                legend: {},
                radar: [
                    {
                        indicator: [
                            { text: '干燥',max:1.5 },
                            { text: '眼部',max:1.5 },
                            { text: '祛斑需求',max:1.5 },
                            { text: '美白需求',max:1.5 },
                            { text: '痘痘类',max:1.5 },
                            { text: '过敏性',max:1.5 },
                            { text: '敏感性',max:1.5 },
                            { text: '衰老性',max:1.5 },
                            { text: '混合性',max:1.5 },
                            { text: '油性',max:1.5 }
                        ],
                        center: ['50%', '50%'],
                        radius: '50%',
                        startAngle: 90,
                        splitNumber: 6,
                        shape: 'circle',
                        name: {
                            formatter:'{value}',
                            textStyle: {
                                color:'#2e2e2e',
                                fontSize:10
                            }
                        },
                        splitArea: {
                            areaStyle: {
                                color: ['rgba(255, 255, 255, 1)',
                                    'rgba(255, 255, 255, 1)'],
                                //shadowColor: 'rgba(0, 0, 0, 0.3)',
                                //shadowBlur: 10
                            }
                        },
                        axisLine: {
                            //lineStyle: {
                            //    color: 'rgba(81, 90, 98, 1)'
                            //}
                            show:false
                        },
                        splitLine: {
                            lineStyle: {
                                color: '#9e9e9e'
                            }
                        }
                    }
                ],
                series: [
                    {
                        name: '雷达图',
                        type: 'radar',
                        itemStyle: {
                            emphasis: {
                                // color: 各异,
                                lineStyle: {
                                    width: 2
                                }
                            }
                        },
                        data: [
                            {
                                value: skinTypeData,
                                name: '图一',
                                symbol: 'none',
                                symbolSize: 4,
                                lineStyle: {
                                    normal: {
                                        type: 'dotted',
                                        color:'#d93333',
                                        width:1
                                    }
                                }
                            },
                            //{
                            //    value: [1.5, 1.4, 1.5, 1.5, 1.7,1.5, 1.5, 1.2, 1.4, 1.8],
                            //    name: '图二',
                            //    symbol: 'none',
                            //    lineStyle: {
                            //        normal: {
                            //            type: 'dashed',
                            //            color:'#E96C4D',
                            //            width:1
                            //        }
                            //    }
                            //}
                        ]
                    }
                ]
            }
            myChart1.setOption(option1);

            //雷达图2
            var option2 = {
                title: {
                    text: ''
                },
                legend: {

                },
                radar: [
                    {
                        indicator: [
                            { text: '毛孔',max:1.5 },
                            { text: '色素',max:1.5 },
                            { text: '纹理',max:1.5 },
                            { text: '油',max:1.5 },
                            { text: '水',max:1.5 },
                            { text: '光泽',max:1.5 }
                        ],
                        center: ['50%', '50%'],
                        radius: '50%',
                        startAngle: 90,
                        splitNumber:5,
                        shape: 'circle',
                        name: {
                            formatter:'{value}',
                            textStyle: {
                                color:'#2e2e2e',
                                fontSize:10
                            }
                        },
                        splitArea: {
                            areaStyle: {
                                color: ['rgba(255, 255, 255, 1)',
                                    'rgba(255, 255, 255, 1)'],
                                //shadowColor: 'rgba(0, 0, 0, 0.3)',
                                //shadowBlur: 10
                            }
                        },
                        axisLine: {
                            //lineStyle: {
                            //    color: 'rgba(81, 90, 98, 1)'
                            //}
                            show:false
                        },
                        splitLine: {
                            lineStyle: {
                                color: '#9e9e9e'
                            }
                        }
                    }
                ],
                series: [
                    {
                        name: '雷达图',
                        type: 'radar',
                        itemStyle: {
                            emphasis: {
                                color: "#eee",
                                lineStyle: {
                                    width: 2
                                }
                            }
                        },
                        data: [
                            {
                                value: skinCauseData,
                                name: '图一',
                                symbol: 'image://'+URL.site+'/image/pic_yuan1.png',
                                symbolSize: 5,
                                lineStyle: {
                                    normal: {
                                        type: 'dotted',
                                        color:'#d93333',
                                        width:1
                                    },
                                    width:2
                                }
                            },
                            //{
                            //    value: [60, 5, 0.30, -100, 1500,60, 5, 0.30, -100, 1500],
                            //    name: '图二',
                            //    symbol: 'none',
                            //    lineStyle: {
                            //        normal: {
                            //            type: 'dashed',
                            //            color:'#000',
                            //            width:1
                            //        }
                            //    }
                            //}
                        ]
                    }
                ]
            }
            myChart2.setOption(option2);
        }

    }


    function Events(){
        $('body')
        //下载
            .on('click','.download',function(){
                $('#mycanvas').remove();
                //滚到顶部
                $('html, body').animate({scrollTop:0});

                if(confirm('是否下载肌肤检测报告？'))
                {

                    setTimeout(function(){
                        var canvas = document.createElement("canvas"),
                            w=$('#skinReport').width(),
                            h=$('#skinReport').height();
                        canvas.width = w * 3;
                        canvas.height = h * 3;
                        canvas.style.width = w + "px";
                        canvas.style.height = h + "px";
                        var context = canvas.getContext("2d");
//然后将画布缩放，将图像放大两倍画到画布上
                        context.scale(3,3);
                        html2canvas(document.getElementById('skinReport'), {
                            allowTaint: false,
                            taintTest: true,
                            canvas: canvas,
                            onrendered: function(canvas) {
                                canvas.id = "mycanvas";
                                canvas.style.display = 'none';
                                document.body.appendChild(canvas);
                                //生成base64图片数据

                                imgData = canvas.toDataURL(type);
                                //var newImg = document.createElement("img");
                                //newImg.src =  dataUrl;
                                //document.body.appendChild(newImg);
                                //console.log(imgData);

                                var _fixType = function(type) {
                                    type = type.toLowerCase().replace(/jpg/i, 'jpeg');
                                    var r = type.match(/png|jpeg|bmp|gif/)[0];
                                    return 'image/' + r;
                                };
                                // 加工image data，替换mime type
                                imgData = imgData.replace(_fixType(type),'image/octet-stream');
                                /**
                                 * 在本地进行文件保存
                                 * @param  {String} data     要保存到本地的图片数据
                                 * @param  {String} filename 文件名
                                 */
                                var saveFile = function(data, filename){
                                    var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
                                    save_link.href = data;
                                    save_link.download = filename;

                                    var event = document.createEvent('MouseEvents');
                                    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                                    save_link.dispatchEvent(event);
                                };
                                // 下载后的问题名
                                var filename = bainx.formatDate('Y-m-d',new Date()) + aname + '.' + type;
                                // download
                                saveFile(imgData,filename);
                            },
                            width:1512,
                            height:15000
                        })
                    },2500)
                }
                else
                {
                    return;
                }

            })

            //.on('click','#sex span',function(){
            //    $(this).addClass('active').siblings().removeClass('active');
            //})
    }

    init();


})