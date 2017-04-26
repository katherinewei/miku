/**
 * Created by Spades-k on 2016/7/4.
 */

require([
    'jquery',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/url',
    'h5/js/page/csadUserTrajectory'
], function ($, Data, Common, URL,CsadUserTrajectory) {
    var Page,
        userId=URL.param.userId,
        rId=URL.param.rId;
    function init(){
        render();
    }

    function render(){
        $('.waitting').hide();
        Page=$('<section class="page-content grid"><ul><li class="input_information"><p class="tc now_time"></p><textarea class="record" rows="7" placeholder="请输入记录信息"></textarea></li><li class="use_time"><h3>用户使用产品时间：</h3><div class="select_time"><select class="year" id="year"><option value="">请选择</option></select><select class="month" id="month"></select><select class="day"></select></div></li><li class="select_box"><h3>盒子名称：</h3><div class="select_con"><select class="box"></select></div></li><li class="photo"><dl class="grid"><dd><div class="addPic"><form id="my_form" enctype="multipart/form-data"><img src="http://mikumine.b0.upaiyun.com/common/images/personalTailor/icon_record_addpic.png"><input type="hidden" name="type" value="1"> <input type="file" class="file" name="file" multiple="multiple"></form></div></dd></dl></li><li class="save tc"><button class="save_btn">保存</button></li></ul></section>').appendTo('body');
        setTime();
        setInterval(function(){
            setTime();
        },1000);
        findContent();
        //dateLinkage();
        //boxList();
        bindEvents();
    }

    function bindEvents(){
        $('body').on('click', 'input', function (event) {
            if (event && event.preventDefault) {
                window.event.returnValue = true;

            }
        }).on('change', '.file', function (event) {
            $('.waitting').show();
            Common.uploadImages(event,'#my_form', URL.upYunUploadPics).done(function(res) {
                $('.waitting').hide();
                var addPic = $('.addPic').parent('dd');
                var picUrls = res.result.picUrls,
                    imgListUrl = [];
                picUrls = picUrls.split(';');
                $.each(picUrls,function(index,item){
                    imgListUrl.push('<dd class="active"><img src="'+ item+'"  alt=""><span class="delete"></span></dd>');
                })
                imgListUrl = imgListUrl.join('');
                addPic.before(imgListUrl);
            }).fail(function() {
                bainx.broadcast('上传图片失败！');
            });

        }).on('click','.delete',function(event){
            event.preventDefault();
            var _this=$(this);
            setTimeout(function(){
                _this.addClass('currentDelete').siblings().removeClass('currentDelete');
                $('.currentDelete').parent('dd').remove();
            }, 500);
        }).on('click','.save_btn',function(){
            saveRecord();
        })
    }

    function setTime(){
        var now = new Date();

        var year = now.getFullYear();       //年
        var month = now.getMonth() + 1;     //月
        var day = now.getDate();            //日

        var hh = now.getHours();            //时
        var mm = now.getMinutes();          //分

        if(hh<10){
            hh='0'+hh;
        }
        if(mm<10){
            mm='0'+mm;
        }

        var time=year+'年'+month+'月'+day+'日'+'&nbsp;&nbsp;'+hh+':'+mm;
        $('.now_time').html(time);
    }

    //日期联动
    function dateLinkage(data_y,data_m,data_d){
        var MonHead = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        //年
        var y=parseInt(data_y);
        var str='';
        for(var i=(y-20);i<(y+20);i++){
            if(i==data_y){
                str+='<option selected value="'+i+'">'+i+'年</option>';
            }else{
                str+='<option value="'+i+'">'+i+'年</option>';
            }
        }
        $('.year').html(str);

        //月
        var str='';
        var data_m=parseInt(data_m);
        for(var i=1;i<13;i++){
            if(i==data_m){
                str+='<option selected value="'+i+'">'+i+'月</option>';
            }else{
                str+='<option value="'+i+'">'+i+'月</option>';
            }
        }
        $('.month').html(str);
        $('.year').val(y);
        $('.month').val(data_m);

        IsPinYear();

        GetDays(y,data_m);
        $('.day').val(data_d);

        $('.year').change(function(){
            var str=$(this).val();
            var MMvalue=document.getElementById("month").options[document.getElementById("month").selectedIndex].value;
            if(MMvalue==''){
                $('.day').html('<option value="">日</option>');
                return;
            }
            var n=MonHead[MMvalue - 1];
            if(MMvalue ==2 && IsPinYear(str)) n++;
            writeDay(n);
        })

        $('.month').change(function(){
            var str=$(this).val();
            var YYYYvalue=document.getElementById("year").options[document.getElementById("year").selectedIndex].value;
            if(str == ""){
                $('.day').html('<option value="">日</option>');
                return;
            }
            var n = MonHead[str - 1];
            if (str ==2 && IsPinYear(YYYYvalue)) n++;
            writeDay(n);
        })

        function writeDay(n){
            var s='';
            for(var i=1;i<(n+1);i++){
                s+='<option value="'+i+'">'+i+'日</option>';
            }
            $('.day').html(s);
        }

        function IsPinYear(year){
            return(0 == year%4 && (year%100 !=0 || year%400 == 0))
        }

        function GetDays(y, m) {
            var conDays=0;
            if (m == 2) {
                if (IsPinYear(y)) {
                    conDays=29;
                } else {
                    conDays=28;
                }
            } else
            if (m == 1 || m == 3 || m == 5 || m == 7 || m == 8 || m == 10 || m == 12) {
                conDays=31;
            } else {
                conDays=30;
            }
            writeDay(conDays);
        }

    }

    function findContent(){
        var data={
            userId:userId,
            rId:rId
        }
        Data.selectOneRecordInfoByrId(data).done(function(res){
            var data=res.data;
            var record=data.record;
            var boxId=data.boxId;
            var html='';
            var tmp='';
            var arr=data.useTime.split('-');
            var data_y=arr[0].substring(0,arr[0].length-1);
            var data_m=arr[1].substring(0,arr[1].length-1);
            var data_d=arr[2].substring(0,arr[2].length-1);
            $.each(res.boxlist,function(index,item){
                if(item.id==boxId){
                    html+='<option selected value="'+item.id+'">'+item.boxName+'</option>'
                }else{
                    html+='<option value="'+item.id+'">'+item.boxName+'</option>'
                }
            })

            if(data.imageUrls){
                var arrPics=data.imageUrls.split(';');
                $.each(arrPics,function(index,item){
                    tmp+='<dd class="active"><img src="'+item+'" alt=""><span class="delete"></span></dd>';
                })
                $('.photo dl dd').eq(0).before(tmp);
            }


            dateLinkage(data_y,data_m,data_d);
            $('.record').val(record);
            $('.box').append(html);

        })
    }



    //保存数据
    function saveRecord(){
        var imgUrlArr = [];

        $('.photo dd').each(function(){
            if($(this).hasClass('active')){
                var imgUrlItem = $(this).children('img').attr('src'),
                    imgsrc;
                if(imgUrlItem.indexOf('!') > -1){
                    imgsrc = imgUrlItem.substring(0, imgUrlItem.indexOf('!'))
                }else{
                    imgsrc = imgUrlItem;
                }
                imgUrlArr.push(imgsrc);
            }

        })
        imgUrlArr = imgUrlArr.join(';');
        var record=$.trim($('.record').val()),
            year=$('.year').val(),
            month=$('.month').val(),
            day=$('.day').val(),
            boxId=$('.box').val(),
            boxName=$(".box option").not(function(){ return !this.selected }).text(),
            useTime=year+'年-'+month+'月-'+day+'日',
            data={
                userId:userId,
                boxId:boxId,
                record:record,
                useTime:useTime,
                boxName:boxName,
                imgUrls:imgUrlArr,
                rId:rId
            }
        if(!record){
            bainx.broadcast('请输入记录信息！');
            return;
        }
        if(boxId=='-1'){
            bainx.broadcast('请选择盒子！');
            return
        }
        Data.addOneUserDoUseRecordInfo(data).done(function(res){
            if(res.flag==1){
                bainx.broadcast('编辑记录成功！');
                if(!URL.param.platform){
                    URL.assign('addBoxRecodePageSuccess');
                }else{
                    //用户轨迹



                    var tmp='<td width="5%" style="border-top: 1px solid #E7E7E7 !important;"><i>{{num}}</i></td><td width="31%" style="text-align: left; border-top: 1px solid #E7E7E7 !important;"><p style="padding: 0;background-color: white;border-radius: 0;">{{dataTime}}</p><p style="display:block;padding: 0;background-color: white;border-radius: 0;color: #B4B4B4;">{{boxName}}&nbsp;&nbsp;&nbsp;&nbsp;{{useTime}}开始使用</p></td><td width="37%"><p>{{record}}</p></td><td width="10%"><img src="{{imageUrls}}" {{style}}></td><td width="25%"><a  class="editUserRecord" data-id="{{id}}">编辑记录>></a></td>',html=[];
                    res.data.num =  $(window.parent.document).find('.currentRP').parent().parent().find('i').text();

                    res.data.dataTime=formatDate(new Date(res.data.lastUpdated));
                    res.data.useTime=res.data.useTime.replace(/\-/g,'');
                    res.data.imageUrls = res.data.imageUrls.split(';');
                    res.data.imageUrls = res.data.imageUrls[0];
                    res.data.style = res.data.imageUrls ? '' : 'style="display:none"';
                    html.push(bainx.tpl(tmp,res.data));

                    function formatDate(now){
                        var   year=now.getYear();
                        var   month=now.getMonth()+1;
                        var   date=now.getDate();
                        var   hour=now.getHours();
                        var   minute=now.getMinutes();
                        var   second=now.getSeconds();
                        return month+'月'+date+'日'+' '+hour+':'+minute;
                    }

                    $(window.parent.document).find('.currentRP').parent().parent().html(html.join(''));

                    $(window.parent.document).find('.IframeBox').remove();
                }
            }else{
                bainx.broadcast('编辑记录失败');
            }
        })
    }

    init();

})
