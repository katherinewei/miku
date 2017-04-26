/**
 *
 * 评论输入的
 * Created by Spades-k on 2016/9/27.
 */
define('h5/js/page/commentEntrance', [
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/common',
    'plugin/swiper/3.3.1/swiper',
    'plugin/swiper/3.3.1/swiper.css'
], function($,URL, Data,Common,Swiper) {

    var commentEntrance=function(){
        //模板
        var tem='<div class="commentEntrance grid"><div class="entranceHeader"><div class="toolbar row"><div class="look"><i></i></div><form id="my_form" enctype="multipart/form-data"><div class="picture"><i></i><input type="hidden" name="type" value="6"><input multiple="multiple" type="file" name="file" id="fileInput" accept="image/*"><div class="f_addpic clearfix"><div class="addpic_i"></div></div></div></form><div class="close col"><span>取消</span></div></div></div><div class="inputBox row"><p class="col col-20 conInput"><input id="inputBoxIn" type="text" placeholder="说点什么吧"></p><p class="col col-4 tc sendCo" data-commentType="1" data-targetCommentId="0">发送</p></div><div class="expBox"><div class="swiper-container"><div class="swiper-wrapper"><div class="swiper-slide swiper-slide1"><ul id="emotionUL" class="emtionList"></ul></div><div class="swiper-slide swiper-slide2"><ul id="emotionUL" class="emtionList"></ul></div></div><div class="swiper-pagination"></div></div></div></div>';

        $('body').append(tem);
        //处理表情显示
        var path=imgPath+'common/images/personalTailor/csad/faces/';
        var map={
            '[):]': 'ee_1.png',
            '[:D]': 'ee_2.png',
            '[;)]': 'ee_3.png',
            '[:-o]': 'ee_4.png',
            '[:p]': 'ee_5.png',
            '[(H)]': 'ee_6.png',
            '[:@]': 'ee_7.png',
            '[:s]': 'ee_8.png',
            '[:$]': 'ee_9.png',
            '[:(]': 'ee_10.png',
            '[:\'(]': 'ee_11.png',
            '[:|]': 'ee_12.png',
            '[(a)]': 'ee_13.png',
            '[8o|]': 'ee_14.png',
            '[8-|]': 'ee_15.png',
            '[+o(]': 'ee_16.png',
            '[<o)]': 'ee_17.png',
            '[|-)]': 'ee_18.png',
            '[*-)]': 'ee_19.png',
            '[:-#]': 'ee_20.png',
            '[:-*]': 'ee_21.png',
            '[^o)]': 'ee_22.png',
            '[8-)]': 'ee_23.png',
            '[(|)]': 'ee_24.png',
            '[(u)]': 'ee_25.png',
            '[(S)]': 'ee_26.png',
            '[(*)]': 'ee_27.png',
            '[(#)]': 'ee_28.png',
            '[(R)]': 'ee_29.png',
            '[({)]': 'ee_30.png',
            '[(})]': 'ee_31.png',
            '[(k)]': 'ee_32.png',
            '[(F)]': 'ee_33.png',
            '[(W)]': 'ee_34.png',
            '[(D)]': 'ee_35.png'
        }
        var i= 0;
        $.each(map, function(k,v) {
            i=i+1;
            var page1=[],page2=[];
            if(i<=21){
                page1.push('<li><img id="'+k+'" src="'+path+v+'"></li>');
                $('.swiper-slide1 ul').append(page1.join(''));
            }else{
                page2.push('<li><img id="'+k+'" src="'+path+v+'"></li>');
                $('.swiper-slide2 ul').append(page2.join(''));
            }



        });


        var swiper = new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            paginationClickable: true
        });

        $('body')
            .on('change', '#fileInput', function (event) {
                $('.waitting').show();
                if(pageConfig.pid==''){
                    URL.assign('vLoginPage.htm');
                    return;
                }
                Common.uploadImages(event,'#my_form', URL.upYunUploadPics).done(function(res) {
                    $('.waitting').hide();
                    var addPic = $('.f_addpic');
                    var picUrls = res.result.picUrls,
                        imgListUrl = [];
                    picUrls = picUrls.split(';');
                    $.each(picUrls,function(index,item){
                        imgListUrl.push('<dd class="active"><img src="'+ item+'!small"  alt=""><span class="delete"></span></dd>');
                    })
                    imgListUrl = imgListUrl.join('');
                    addPic.append(imgListUrl);
                    isHavepiv();
                }).fail(function() {
                    bainx.broadcast('上传图片失败！');
                });
            })
            .on('tap','.delete',function(event){
                event.preventDefault();
                $(this).addClass('currentDelete').siblings().removeClass('currentDelete');
                var data = {
                    filePath:$(this).parent('dd').children('img').attr('src')
                }
                Data.upyunDeleteFile(data).done(function(res){
                    bainx.broadcast('删除图片成功！');
                    $('.currentDelete').parent('dd').remove();
                    isHavepiv();
                })
            })
            .on('tap','.look',function(){
                if($('.expBox').css('height')=='0px'){
                    $('.expBox').css('height','auto');
                    $('.conInput input').blur();
                }else {
                    $('.expBox').css('height',0+'px');
                }
                document.getElementById('inputBoxIn').focus();
            })
            .on('tap','.conInput input',function(){
                $('.expBox').css('height',0+'px');
            })
            .on('tap','.toolbar .close span',function(){
                $('.commentEntrance').css('height',0+'px');
                document.getElementById('inputBoxIn').blur();
            })
            .on('tap','#emotionUL li img',function(){
                var id=$(this).attr('id');
                $('#inputBoxIn').val($('#inputBoxIn').val()+id);
            })



        //处理图片列表是否有图片
        function isHavepiv(){
            var w_w=$(window).width()*0.85;
            var dd=$('.f_addpic').find('dd');
            if((dd.length*69)<w_w){
                $('.f_addpic').width(dd.length*74);
            }else{
                $('.f_addpic').width($(window).width()*0.9);
            }
            if(dd.length>0){
                $('.f_addpic').show();
                $('.commentEntrance').css('overflow','visible');
            }else{
                $('.f_addpic').hide();
                $('.commentEntrance').css('overflow','hidden');
            }
        }


    }
    return commentEntrance;
})