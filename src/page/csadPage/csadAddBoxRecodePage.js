/**
 * Created by Spades-k on 2016/7/15.
 */
define('h5/js/page/csadAddBoxRecodePage',[
    'jquery',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/url',
    'h5/js/page/csadUserTrajectory',
    'h5/css/page/csadCssZy.css'
], function ($, Data, Common, URL,CsadUserTrajectory) {
    // var userId=URL.param.userId;
    function addBoxRecodePageHtml(userId,obj,ouserId){
        var template='<section class="page-content grid"><ul><li class="input_information"><p class="tc now_time"></p><textarea class="record" rows="7" placeholder="请输入记录信息"></textarea></li><li class="use_time"><h3>用户使用产品时间：</h3><div class="select_time"><select class="year" id="year"><option value="">请选择</option></select><select class="month" id="month"></select><select class="day"></select></div></li><li class="select_box"><h3>盒子名称：</h3><div class="select_con"><select class="box"></select></div></li><li class="photo"><dl class="grid"><dd><div class="addPic"><form id="my_form" enctype="multipart/form-data"><img src="'+URL.imgPath+'common/images/personalTailor/icon_record_addpic.png"><input type="hidden" name="type" value="1"> <input type="file" class="file" name="file" multiple="multiple"></form></div></dd></dl></li><li class="save tc"><button class="save_btn">保存记录</button></li></ul></section>';
        obj.append(template);

        setTime();
        setInterval(function(){
            setTime();
        },1000);
        dateLinkage();
        boxList(userId);
        bindEvents(userId,ouserId);
    }

    function bindEvents(userId,ouserId){
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

            $(this).addClass('currentDelete').siblings().removeClass('currentDelete');
            var data = {
                filePath:$(this).parent('dd').children('img').attr('src')
            }

            Data.upyunDeleteFile(data).done(function(res){
                bainx.broadcast('删除成功！');
                $('.currentDelete').parent('dd').remove();
            })
        }).on('click','.save_btn',function(){
            saveRecord(userId,ouserId);
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
    function dateLinkage(){
        var MonHead = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        //年
        var y=new Date().getFullYear();
        var str='';
        for(var i=(y-20);i<(y+20);i++){
            str+='<option value="'+i+'">'+i+'年</option>';
        }
        $('.year').html(str);

        //月
        var str='';
        for(var i=1;i<13;i++){
            str+='<option value="'+i+'">'+i+'月</option>'
        }
        $('.month').html(str);
        $('.year').val(y);
        $('.month').val(new Date().getMonth() + 1);
        var n=MonHead[new Date().getMonth()];
        var YYYYvalue=document.getElementById("year").options[document.getElementById("year").selectedIndex].value;
        IsPinYear();
        if(new Date().getMonth() ==1 && IsPinYear(YYYYvalue)) n++;
        writeDay(n);
        $('.day').val(new Date().getDate());

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

    }
    //盒子列表
    function boxList(userId){
        var data={
            userId:userId
        }
        Data.getUseBoxDataInfoinit(data).done(function(res){
            var str='<option value="-1">请选择</option>';
            $.each(res.boxlist,function(index, item){
                if(item.boxName){
                    str+='<option value="'+item.id+'">'+item.boxName+'</option>';
                }
            })
            $('.box').html(str);
        })
    }


    //保存数据
    function saveRecord(userId,ouserId){
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
                imgUrls:imgUrlArr
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
            if(res.flag=='1'){
                bainx.broadcast('新增记录成功！');
                if(!URL.param.platform){
                    URL.assign('addBoxRecodePageSuccess');
                }else{
                    //用户轨迹

                    //var tpm=CsadUserTrajectory.csadUserTrajectoryHtml();
                    //$(window.parent.document).find('#csadUserMessageContainer_'+ouserId+' .containerUserTrajectory').html(tpm);
                    //CsadUserTrajectory.initUserTrajectory(ouserId.toString(),true);

                    var tmp='<tr><td width="5%" style="border-top: 1px solid #E7E7E7 !important;"><i>1</i></td><td width="31%" style="border-top: 1px solid #E7E7E7 !important;"><p style="padding: 0;background-color: white;border-radius: 0;">{{dataTime}}</p><p style="display:block;padding: 0;background-color: white;border-radius: 0;color: #B4B4B4;">{{boxName}}&nbsp;&nbsp;&nbsp;&nbsp;{{useTime}}开始使用</p></td><td width="37%"><p>{{record}}</p></td><td width="10%"><img src="{{imageUrls}}" {{style}}></td><td width="25%"><a  class="editUserRecord" data-id="{{id}}">编辑记录>></a></td></tr>',html=[];
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
                    $(window.parent.document).find('#csadUserMessageContainer_'+userId+' .containerUserTrajectory').find('.use_record_list').prepend(html.join(''));
                    console.log($(window.parent.document).find('.use_record_list tr').eq(1).find('td').eq(0).children('i').text());
                    $(window.parent.document).find('.use_record_list tr').each(function(index,item){

                        if(index>0){
                            $(this).eq(0).find("td").eq(0).find('i').text(parseInt($(this).eq(0).find("td").eq(0).text())+1);
                        }
                    })
                    var indexnum=parseInt($(window.parent.document).find('body').attr('record_index_'+userId))+1;
                    $(window.parent.document).find('body').attr('record_index_'+userId,indexnum);
                    $(window.parent.document).find('.IframeBox').remove();
                    $('body').attr('record_index',parseInt($('body').attr('record_index'))+1);

                }

            }else{
                bainx.broadcast('新增记录失败');
            }
        })
    }

    return {
        addBoxRecodePageHtml:addBoxRecodePageHtml
    }
})