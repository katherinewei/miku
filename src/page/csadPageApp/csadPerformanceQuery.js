/**
 * 业绩查询
 * Created by xiuxiu on 2016/12/12.
 */
define('h5/js/page/csadPerformanceQuery',[
    'gallery/jquery/2.1.1/jquery',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/url',
    'plugin/echarts/echarts2mychange',


], function ($, Data, Common, URL,EChats) {

    //var firstLoad;

    function echat(){
        //init();
        //function init(){
        //firstLoad = true;


            var list = [
                    {
                        txt:'今日',
                        className:'searchToday',
                        val:''
                    },{
                        txt:'昨日',
                        className:'searchYesterday',
                        val:''
                    },{
                        txt:'前日',
                        className:'searchEve',
                        val:''
                    },{
                        txt:'当月',
                        className:'searchMonth',
                        val:''
                    }
                ],
                html=[],htmlRes=[],
                tpl = '<dd><span class="searchDay {{className}} {{active}}">{{txt}}业绩</span><label class="price">{{val}}</label></dd>';
            $.each(list,function(i,item){
                item.active = i == 0 ? 'active' : '';

                html.push(bainx.tpl(tpl,item));

            })


           var today = GetDateStr(0);
            $('#performanceQuery_Wrap').html('<div class="title">查询本人业绩</div><section><div class="searchGroup"><dl>'+html.join('')+'<dd>时间：<input type="text"  id="st" placeholder="起始时间" value="'+today+'" > 一 <input type="text"  id="et" placeholder="结束时间" value="'+today+'"  /><input type="button" value="查询" class="searchBtn" /> </dd></dl></div><div class="searchResult" ></div></section> ');

        //
        Data.sumTradeBoxPriceYj().done(function(res){
            $('.searchToday').next().text((res.todayYj /100).toFixed(0));
            $('.searchYesterday').next().text((res.yesterdayYj /100).toFixed(0));
            $('.searchEve').next().text((res.qianTianYj /100).toFixed(0));
            $('.searchMonth').next().text((res.nowMonthYj /100).toFixed(0));
        })

        //日历
            var nowTemp = new Date();
            var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(),nowTemp.getHours(), nowTemp.getMinutes(), nowTemp.getSeconds(), 0);

        //日期插件
            require(['plugin/foundation-datepicker/foundation-datepicker'],function(Datepicker){
                var checkin = $('#st').fdatepicker({
                        //format: 'yyyy-mm-dd',
                        //pickTime: true,
                        leftArrow:'<<',
                        rightArrow:'>>',
                        disableDblClickSelection: true,
                        onRender: function (date) {

                            return date.valueOf() >= now.valueOf() ? 'disabled' : '';
                        }
                    })
                    .on('changeDate', function (ev) {
                        if (ev.date.valueOf() > checkout.date.valueOf()) {
                            var newDate = new Date(ev.date)
                            newDate.setDate(newDate.getDate() + 1);
                            checkout.update(newDate);
                        }
                        checkin.hide();
                        $('#et')[0].focus();
                    }).data('datepicker');
                var checkout = $('#et').fdatepicker({
                    leftArrow:'<<',
                    rightArrow:'>>',
                    onRender: function (date) {
                        //结束日期 要大于起始日期 || 起始日期跟结束日期在一个月之内 || 结束日期小于当前日期
                        return date.valueOf() <= checkin.date.valueOf() ||  parseInt((date.valueOf()- checkin.date.valueOf()) / (1000 * 60 * 60 * 24))  > 30 || date.valueOf() > now.valueOf() ? 'disabled' : '';
                    }
                }).on('changeDate', function (ev) {
                    checkout.hide();
                }).data('datepicker');
            })


            //获取数据
            getData(today,today);
            bindEvent();

       // }

        //表
        //

    }
    //获取数据
    function getData(st,et,days){
        var data = {
            stime:st,
            etime:et
        }
        Data.sumTradeBoxPrice(data).done(function(res){
            var total =  (res.yj  / 100 ).toFixed(0),
                onlinePay = (res.onlinePay / 100 ).toFixed(0),
                offlineAlipay =  (res.offlineAlipay / 100 ).toFixed(0),
                offlineWxpay =  (res.offlineWxpay / 100 ).toFixed(0),
                offlineBackToPay =  ( res.offlineBackToPay / 100 ).toFixed(0),
                offlineBackToPayFailed =  (res.offlineBackToPayFailed / 100 ).toFixed(0);

            //


            //if(firstLoad){
            //    $('.searchToday').next().text(total);
            //}
            var td = [
                    {
                        txt:'客户姓名'
                    },
                    {
                        txt:'头像'
                    },
                    //{
                    //    txt:'备注昵称'
                    //},
                    {
                        txt:'购买清单'
                    },
                    {
                        txt:'付款方式'
                    },
                    {
                        txt:'预付金额'
                    },{
                        txt:'到付金额'
                    }, {
                        txt:'总金额'
                    },
                    {
                        txt:'邮寄地址'
                    },
                    {
                        txt:'订单状态'
                    }
                ],
                tpl3= '<dd  class="col">{{txt}}</dd>';

            var tdHtml = [];
            $.each(td,function(j,tdT){
                tdHtml.push(bainx.tpl(tpl3,tdT));
            })
            var tt='';
            if(days){
                tt = st + '-' + et;
            }
            else{
                tt = st;
            }

            $('.searchResult').html('<div class="item "><h3>'+tt+'销售统计数据</h3><div id="pandect"><h4>销售总额：<span class="price">'+total+'</span></h4><div class="detailD"> <label>支付宝交易额：<span class="price">'+offlineAlipay+'</span></label><label>微信转账交易额：<span class="price">'+offlineWxpay+'</span></label><label>到付交易额：<span class="price">'+offlineBackToPay+'</span></label><label>线上交易额：<span class="price">'+onlinePay+'</span></label><label>到付失败交易额：<span class="price">'+offlineBackToPayFailed+'</span></label></div></div></div> <div class="item echatsData "><h3>'+tt+'销售统计饼状图</h3><div id="echatsContainer" ></div></div><div style="clear: both"></div> <div class="detailTable grid"><dl class="thead row">'+tdHtml.join('')+'</dl><ul class="boxList mainContent"></ul></div>');

            //数据

            var legData = [],serData1=[],serData2=[], ver={};
            if(offlineAlipay >0){
                legData.push('支付宝支付');
                 ver = {value:offlineAlipay,name:'支付宝支付'};
                serData1.push(ver);
            }
            if(offlineWxpay >0){
                legData.push('微信支付');
                 ver = {value:offlineWxpay,name:'微信支付'};
                serData1.push(ver);
            }
            if(onlinePay >0){
                legData.push('在线支付');
                 ver = {value:onlinePay,name:'在线支付'};
                serData1.push(ver);
            }
            if(offlineBackToPay >0){
                legData.push('到付');
                 ver = {value:offlineBackToPay,name:'到付', selected:true};
                serData1.push(ver);

            }
            if(offlineBackToPay >0){
                legData.push('到付成功');
                 ver = {value:offlineBackToPay,name:'到付成功'};
                serData2.push(ver);
            }

            if(offlineBackToPayFailed >0){
                legData.push('到付失败');
                 ver = {value:offlineBackToPayFailed,name:'到付失败'};
                serData2.push(ver);
            }

            if(legData.length > 0){
                $('#echatsContainer p').remove();
                var dom = document.getElementById("echatsContainer");
                var myChart = EChats.init(dom);
                var option = null;
                option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}: {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'left',
                        data:legData
                    },
                    series: [
                        {
                            //name:'访问来源',
                            type:'pie',
                            selectedMode: 'single',
                            radius: [0, '30%'],

                            label: {
                                normal: {
                                    position: 'inner'
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data:serData1
                        },
                        {
                            // name:'访问来源',
                            type:'pie',
                            radius: ['40%', '55%'],

                            data:serData2
                        }
                    ]
                };

                if (option && typeof option === "object") {
                    myChart.setOption(option, true);
                }
                //表
                getTableList(data,0);

                $('.boxList').scroll(function(){
                    var _this=$(this);
                    var viewH=_this.height(),
                        contentH =_this.get(0).scrollHeight,
                        scrollTop = _this.scrollTop();
                    if(scrollTop + viewH == contentH){
                        if(_this.attr('data-hasnext') == 'true'){
                            var pg = parseInt(_this.attr('data-pg')) + 1;
                            getTableList(data,pg)
                        }
                    }
                });


            }
            else{
                $('#echatsContainer').html('<p>暂无数据</p>');
                $('.boxList').html('<li class="noData">暂无</li>');
            }

        })
    }

    //获取表数据
    function getTableList(data,pg){
        data.sz=6;
        data.pg=pg;
        Data.getBoxTradeVOList(data).done(function(res){
            // if(res.list && res.list.length > 0){
            var tpl = '<li class="row" data-id="{{tradeId}}"><dd  class="col" data-id="{{buyerId}}">{{username}}</dd><dd  class="col headPic"><img src="{{headPicUrl}}"/> </dd><dd  class="col">{{prodList}}</dd><dd  class="col ">{{payWay}}</dd><dd  class="col" >{{prepaidFee}}</dd><dd  class="col">{{offlineBackToPay}}</dd><dd  class="col time">{{price}}</dd><dd  class="col ellipsis">{{contactAddr}}</dd><!--<dd  class="col"><span class="deleteUserLogBtn deleteUserLogItem"></span></dd>--><dd>{{status}}</dd></li>',
                html = [];

            $.each(res.list, function (i, item) {
                item.headPicUrl = item.headPicUrl ? item.headPicUrl : imgPath+'common/images/avatar9.png';
                item.offlineBackToPay = item.offlineIsPayed && item.payType == 6 ? Common.moneyString0(item.totalFee - item.prepaidFee) : 0;
                item.price =  Common.moneyString0(item.price);
                item.prepaidFee =  Common.moneyString0(item.prepaidFee);
                var txt = '',txt2 = '';
                switch (item.payType){
                    case 6:
                    case 9:
                    case 10:
                        txt = '货到付款';
                        break;
                    case 7:
                        txt = '支付宝转账';
                        break;
                    case 8:
                        txt = '微信转账';
                        break;
                    default:
                        break;
                }
                item.payWay = txt;
                switch (item.tradeStatus){
                    case 2:
                        txt2 = '待付款';
                        break;
                    case 4:
                        txt2 = '已付款';
                        break;
                    case 5:
                        txt2 = '等待确认收货';
                        break;
                    case 6:
                        txt2 = '待发货';
                        break;
                    case 7:
                    case 20:
                        txt2 = '交易完成';
                        break;
                    case 8:
                        txt2 = '已退款';
                        break;
                    case 9:
                        txt2 = '交易关闭';
                        break;
                    default:
                        break;
                }
                item.status = txt2;

                //产品
                var prodH = [],tpl1 = '{{prodName}}x{{num}}';
                $.each(item.boxProductVOList,function(j,prod){
                    prodH.push(bainx.tpl(tpl1,prod));
                })
                item.prodList = prodH.join(' ');
                html.push(bainx.tpl(tpl, item));
            })
            var con  = $('.boxList');
            if(pg == 0){
                con.html(html.join(''));
            }
            else{
                con.append(html.join(''));
            }
            con.attr({'data-hasnext':res.hasNext,'data-pg':pg})
            //}
            //else{

            // }
        })
    }



    //
    function bindEvent(){
        $('body')
            .off('click','.searchDay,.searchBtn').on('click','.searchDay,.searchBtn',function(){

            var that = $(this),st,et,days='';
            if(that.hasClass('searchBtn')){   //查询日期
                st = $('#st').val();
                et = $('#et').val();
                if(!st || !et){
                    bainx.broadcast('请输入日期！');
                    return
                }
                days = 'days';
                $('.searchDay').removeClass('active');
            }
            else{
                $('.searchDay').removeClass('active');
                that.addClass('active');

                if(that.hasClass('searchToday')){
                    st = et = GetDateStr(0);
                }
                if(that.hasClass('searchYesterday')){
                    st = et = GetDateStr(-1);
                }
                if(that.hasClass('searchEve')){
                    st = et = GetDateStr(-2);
                }
                if(that.hasClass('searchMonth')){
                    var date =  new Date(),mon = date.getMonth()+1;
                    st = mon + '/' + '01' + '/' + date.getFullYear();
                    et = GetDateStr(0);
                    days = 'month';
                }
                $('#st').val(st);
                $('#et').val(et);
            }

            console.log(st,et);
            getData(st,et,days);
        })
    }

    function GetDateStr(AddDayCount,type) {
        var dd = new Date();
        dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
        var y = dd.getFullYear();
        var m = dd.getMonth()+1;//获取当前月份的日期
        var d = dd.getDate();
        if(type){
            return m+"月"+d+"日";
        }else{
            return m+"/"+d+"/"+y;
        }

    }



    return echat;
})
