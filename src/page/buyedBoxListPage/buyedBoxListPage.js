/**
 * 护肤盒子
 * Created by xiuxiu on 2016/9/10.
 */
require([
    'jquery',
    'h5/js/common/data',
    'h5/js/common/url',
    'h5/js/common',
    'h5/js/common/nexter',
    'h5/js/page/getDetectRecord'
],function($,Data,URL,Common,Nexter,getDetectRecord){

    var count = 0;
    function init(){
        Common.headerHtml('护肤盒子');
        $('body').append('<div class="page-content grid"><header class="user-info row"></header><section class="content"><ul class="row"></ul><div class="wrap"></div> </section> </div>');

        getUserInfo();

        var titleList = [{
                title:'购买盒子记录',
                className:'buyBoxList'
                },
                {
                    title:'最新分析报告',
                    className:'newReport'
                }],
            tamplate = '<li class="userMsgTab {{className}}_tab col">{{title}}</li>',
            content = '<article class="{{className}}_content hide"></article>',
            html=[],
            contentHtml=[];
        $.each(titleList,function(i,item){
            html.push(bainx.tpl(tamplate,item));
            contentHtml.push(bainx.tpl(content,item));
        })
        $('.content ul').html(html.join(''));
        $(' .wrap').html(contentHtml.join(''));
        $('.buyBoxList_content').removeClass('hide');
        $('.buyBoxList_tab').addClass('active');


        getBoxList();

        bindEvent();
    }
    //最新分析报告
    function newReport(){
        var data = {
            userId : pageConfig.pid
        }
        Data.getLastUserDetectDataByUserId(data).done(function(res){

            $('.newReport_content').append(getDetectRecord(res.data));
        })
    }

    //获取盒子订单
    function getBoxList(){
        $('.buyBoxList_content').append('<ul></ul>');
        var nexter = new Nexter({
            element: $('.page-content'),
            dataSource: Data.getMineScBoxTradeList,
            enableScrollLoad: true,
            scrollBodyContent: $('.buyBoxList_content ul'),
        }).load().on('load:success', function (res) {
            var list = TimeList(res),
                tpl = '<li class="box"><i>{{num}}</i><div class="item grid"><p class="date">{{dateCreated}}</p><div class="boxList">{{Items}}</div></div> </li>',
                tplItem = '<div class="row" href="{{href}}"><div class="col col-20"><p>盒子名:{{boxName}}<span class="price">{{price}}</span></p><p>共{{courseTimes}}分钟</p><p>第{{userStime}}/{{courseDuration}}天</p><p>已完成{{startedLessonTimes}}/{{totalLessonTimes}}次</p></div><div class="col col-3 right-icon fb far fvc iconfont "></div> </div>',
             html=[],
             dateCreated,
             itemHtml = [];
            $.each(list,function(i,listItem){
                $.each(listItem,function(j,item){
                    var course = item.mineCourse;
                   // item.href ='';
                    item.href = URL.boxDetailPage+'?boxId='+item.id;
                    if(item.mineCourse){
                        item.courseTimes = course.courseTimes;
                        item.userStime = course.courseUserStime ? course.courseUserStime : 0;
                        item.courseDuration = course.courseDuration ;
                        item.startedLessonTimes = course.startedLessonTimes;
                        item.totalLessonTimes = course.totalLessonTimes;
                       // item.href = URL.boxDetailPage+'?boxId='+item.id;
                    }
                    else{
                        item.courseTimes = 0;
                        item.userStime = 0;
                        item.courseDuration = 0;
                        item.startedLessonTimes = 0;
                        item.totalLessonTimes = 0;

                    }
                    item.price = Common.moneyString0(item.price);
                    itemHtml.push(bainx.tpl(tplItem,item));
                    dateCreated =  bainx.formatDate('Y-m-d', new Date(item.dateCreated));
                })
                listItem.Items = itemHtml.join('');
                itemHtml = [];
                listItem.num = i+1 + count;
                listItem.dateCreated =  dateCreated;
                html.push(bainx.tpl(tpl,listItem));
                if(i == list.length -1){
                    count = listItem.num;
                }
            })
            $('.buyBoxList_content ul').append(html.join(''));

        })
    }


    //按时间分
    function TimeList(res){
        var arr=[],
            arr1=[];
        var isTrue = true;
        for(var i=0;i<=res.list.length;i++){
            //console.log(bainx.formatDate('Y-m-d', new Date(res.list[i].dateCreated)));
            if(isTrue){
                arr1.push(res.list[i]);
            }else{
                arr.push(arr1);
                arr1 = [];
                arr1.push(res.list[i]);
            }
            if(i+1<res.list.length){
                if(bainx.formatDate('Y-m-d', new Date(res.list[i].dateCreated))==bainx.formatDate('Y-m-d', new Date(res.list[i+1].dateCreated))){
                    isTrue = true;
                }else{
                    isTrue = false;
                }
            }else{
                isTrue = false;
            }
        }
        return arr;
    }

    //获取用户信息
    function getUserInfo(){

        Data.fetchMineInfo().done(function(res){
            var tpl = '<div class="col col-50"><img src="{{headPic}}"/><span class="ellipsis">{{mobile}}</span> </div><div class="col col-50 time"><p><span>注&nbsp;&nbsp;册&nbsp;&nbsp;&nbsp;时&nbsp;&nbsp;间:</span>{{dateCreated}}</p><p><span>最新登录时间:</span>{{newLoginDate}}</p></div> ',
                html = [];
            res.dateCreated = bainx.formatDate('Y-m-d', new Date(res.dateCreated));
            res.newLoginDate =  bainx.formatDate('Y-m-d', new Date(new Date().getTime()));
            html.push(bainx.tpl(tpl,res));
            $('.user-info').append(html.join('')).find('img').height($('.user-info img').width());

        })
    }

    //
    function bindEvent(){
        $('body').on('tap','.userMsgTab',function(e){
            e.preventDefault();
            $(this).addClass('active').siblings().removeClass('active');
            $('article').eq($(this).index()).removeClass('hide').siblings().addClass('hide');
            if($(this).index() == 1 && $('.getDetectRecord').length == 0){
                newReport();
            }
        })
    }

    init();

})
