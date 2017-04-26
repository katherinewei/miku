/**
 * 添加文章
 * Created by Spades-k on 2016/5/30.
 */
require([
    'jquery',
    'h5/js/common/data',//接口内容
    'h5/js/common',
    'h5/js/common/url'//接口地址
], function ($, Data, Common, URL) {
    var Page,
        userId=pageConfig.pid;

    function init(){
        render();
    }


    function render(){
        $('.waitting').hide();
        Page=$('<section class="resultPage"><ul><li class="resultAndSuggest"><h3>文章内容</h3><dl class="grid"><dd style="padding-bottom: 0px;"><textarea class="article_con"></textarea></dd></dl></li><li class="photo"><h3>添加照片</h3><dl class="grid"><dd><div class="addPic"><form id="my_form" enctype="multipart/form-data"><img src="http://mikumine.b0.upaiyun.com/common/images/personalTailor/pic_add.png"><input type="hidden" name="type" value="6"> <input type="file" class="file" name="file" multiple="multiple"></form></div></dd></dl></li><li><dl class="actionPostionId"><dd>圈子id:<input type="text"></dd></dl><dl class="actionPostionType"><dd>标识：<input type="text">不是圈子则为1，如果是圈子的文章则为2。</dd></dl></li></ul><div class="save"><span>保存</span></div></section>').appendTo('body');
    }

    //绑定body事件
    function bindEvent(){
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

        }).on('tap','.photo dd img',function(event){
            event.preventDefault();
            var target = $(this);
            $('.photo dd img').removeClass('upload')
            target.addClass('upload');
            //target.addClass('upload').siblings().removeClass('upload');

            if(target.attr('src').indexOf('mikumine') <= -1){
                var data = {
                    url:target.attr('src'),
                    type:6
                }
                Data.upYunUploadPicByUrl(data).done(function(res){
                    bainx.broadcast('上传成功！');
                    $('.upload').attr('src',res.picUrl).parent('dd').addClass('active');
                })
            }

        }).on('tap','.delete',function(event){
            event.preventDefault();

            $(this).addClass('currentDelete').siblings().removeClass('currentDelete');
            var data = {
                filePath:$(this).parent('dd').children('img').attr('src')
            }

            Data.upyunDeleteFile(data).done(function(res){
                bainx.broadcast('删除成功！');
                $('.currentDelete').parent('dd').remove();
            })
        }).on('tap','.save',function(event) {
            saveReport();
        })
    }

    bindEvent();

    init();

    //保存
    function saveReport(){
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
                console.log(imgUrlArr)
            }

        })
        imgUrlArr = imgUrlArr.join(';');

        var content = $('.article_con').val(),
            data,
            actionPostionId=$('.actionPostionId input').val(),
            actionPostionType=$('.actionPostionType input').val();
        if(!content){
            bainx.broadcast('文章内容为空！');
            return false;
        }
        data={
            userId:userId,
            contentCreateType:2,
            contentTitle:-1,
            contentShortTitle:-1,
            contentSurfacePicUrl:-1,
            content:content,
            picUrls:imgUrlArr,
            authorShowName:-1,
            specialFlag:0,
            userName:-1,
            contentType:1,
            goalType:2,
            actionType:1,
            actionPostionId:-1,
            actionPostionType:1,
            actionPostionId:actionPostionId,
            actionPostionType:actionPostionType
        }

        // console.log(data);
        Data.insertOneSnsContentRecord(data).done(function(res){


            bainx.broadcast('保存成功！');
            URL.assign(URL.discoverPage+'?uid='+userId);

        }).fail(function(){
            alert('保存失败');
        })

    }

})
