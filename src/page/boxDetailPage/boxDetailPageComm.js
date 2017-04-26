/**
 * 盒子详情页
 * Created by xiuxiu on 2016/9/9.
 */
define('h5/js/page/boxDetailPageComm',[
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data',
    'h5/js/page/getDetectRecord',
    'h5/js/common/weixin',
    'h5/js/common',
],function($,URL,Data,getDetectRecord,WeiXin,Common){

    var boxDetailCommon = function(containerCreateBox,boxId,userName,preview,csadName,rid){
        var _boxImg = '',
            _boxName= '',
            _boxPrice= '0',
            _boxIntro= '',
            _boxNote= '',
            _boxDateCreated= '',
            _courceImg= '',
            _courceName= '',
            suggestT= '',
            productList = [];
        weiXinShare();
        var appendMsg = function(userName,_boxImg,_boxPrice,_boxName,_boxIntro,_boxNote,csadName,_boxDateCreated,suggestT,_courceImg,_courceName,_rid,productList,itemId,isTrade){

            var hide = isTrade ? 'style=display:none' : '',
                buy = preview ? '' : '<div class="col fb fvc fac col-50 " '+hide+'><div class="buyBtn" >立即购买</div></div>',
                forAPP =  URL.param.forAPP == 'true' ?  '': 'style=display:none',
                footer = preview ? '<span class="spanBtn closePreviewC">取消</span><span class="spanBtn sendBtnPreviewC sendBox disabled" '+forAPP+'>发送</span>' : '<div class="row"><div class="col boxPrice col-50">价值：<span class="price">'+_boxPrice+'</span></div>'+buy+'</div>',
                title = preview ? '<div class="boxTitle">'+userName+'的护肤盒子</div>' : '',

                boxBasicMsg = title+'<div class="boxItemM grid"><img src="' + imgPath + 'common/images/boxCover.png" class="boxImg"/><div class="row border-bottom"><div class="price boxPrice col col-50  fb fvc">'+_boxPrice+'</div>'+buy+'</div> <div class="boxDe"><p class="boxName">'+_boxName+'</p><div class="boxOther row"><div class="col csadName">管家：'+csadName+'</div><div class="col boxCreateTime">生成时间：'+_boxDateCreated+'</div> </div> </div> </div><div class="boxItemM boxContentM grid"><ul class="row"></ul><div class="contentM"></div></div>';
            $('.coursePreviewContent').append(boxBasicMsg);
            var obj =  preview ?  $('.coursePreviewContent') :  containerCreateBox;
            obj.append('<div class="footerT grid">'+footer+'</div>');
            var data = {
                dId : _rid
            }
            Data.getDetectRecordDetail(data).done(function(res){
                var resDate = res.data;
                var prodTpl = '<dt><img src="{{proImg}}"/><p>{{proName}}</p></dt>',
                    prodHtml = [];
                $.each(productList,function(z,proItem){
                    prodHtml.push(bainx.tpl(prodTpl,proItem))
                })
                var solveWayTpl = '<div class=""><p>1、面部产品搭配</p><dl>'+prodHtml.join('')+'</dl></div>',
                    nav = [
                        {
                            title:'分析报告',
                            className:'reportView',
                            content:getDetectRecord(resDate)
                        },
                        {
                            title:'解决方案',
                            className:'solveWayView',
                            content:solveWayTpl
                        }

                        //,
                        //{
                        //    title:'搭配课程',
                        //    className:'matchCourceView',
                        //    content:'<div class="coursePC"><img src="'+_courceImg+'"/><div class="boxWrap"><div class="boxInner">'+_courceName+'</div></div> </div>'
                        //}
                    ],
                    liTpl = '<li class="{{className}}Tab col">{{title}}</li>',
                    contentTpl = '<div class="tabContent {{className}} hide">{{content}}</div>',
                    liHtml = [],
                    contentHtml = [];
                $.each(nav,function(k,navItem){
                    liHtml.push(bainx.tpl(liTpl,navItem))
                    contentHtml.push(bainx.tpl(contentTpl,navItem))
                })
                $('.boxContentM ul').html(liHtml.join(''));
                $('.boxContentM .contentM').html(contentHtml.join(''));

                $('.boxContentM ul li').eq(0).addClass('current');
                $('.boxContentM .tabContent').eq(0).removeClass('hide');

            })

            //预览tab
            var event = preview ? 'click' : 'tap';
            containerCreateBox.on(event,'.boxContentM li',function(){
                $(this).addClass('current').siblings().removeClass('current');
                $('.tabContent').eq($(this).index()).removeClass('hide').siblings().addClass('hide');
            })
                .on(event,'.buyBtn',function(){
                    URL.assign(URL.placeOrder+'?gid=' + itemId + '&count=1&boxId='+boxId);
                })

        }

        if(preview){
                 _boxImg = containerCreateBox.find('.boxMessage').find('.active').find('img').attr('src');
                _boxName = containerCreateBox.find('.boxMessage').find('input[name=box_name]').val();
                _boxPrice = containerCreateBox.find('.boxOtherMsg').find('.boxPrice').val();
                _boxIntro = containerCreateBox.find('.boxMessage').find('input[name=box_introduce]').val();
                _boxNote = containerCreateBox.find('.boxMessage').find('input[name=box_note]').val();
                _boxDateCreated = containerCreateBox.find('.boxOtherMsg').find('.boxDateCreated').text();
               // _courceImg = containerCreateBox.find('.courseDetail').find('.box_img').find('.active').find('img').attr('src');
               // _courceName = containerCreateBox.find('.courseDetail').find('.courseName').val() ? containerCreateBox.find('.courseDetail').find('.courseName').val() : '';
                suggestT = containerCreateBox.find('.healthyAdviceTxt').val();
            containerCreateBox.find('.productMessage li .hasChoiceItem').each(function(){
                var targetP = $(this).parent(),
                    proImg = targetP.data('thnmbnail'),
                // proImg = targetP.find('img').attr('src'),
                    proName = targetP.find('.prod_name').text();
                productList.push({proImg:proImg,proName:proName});
            })
            containerCreateBox.append('<section class="telDialog wl-trans-dialog translate-viewport coursePreview" id="coursePreview" data-widget-cid="widget-0" style="display: block;"><div class="coursePreviewContent"></div></section>');

            appendMsg(userName,_boxImg,_boxPrice,_boxName,_boxIntro,_boxNote,csadName,_boxDateCreated,suggestT,'','',rid,productList);
        }
        else{

            containerCreateBox.append('<div class="coursePreviewContent"></div>');
            var data = {};
            if(boxId){
                 data = {
                    boxId:boxId
                }
            }
            else{
                data = {
                    isZxBox:1
                }
            }
            Data.getMineScBoxTradeList(data).done(function(res){
                var list = res.list[0],
                     itemId,isTrade,csadNameQ,ridQ;
                if(list){
                    boxId = list.id;
                    _boxImg = list.picUrls ? list.picUrls : '';
                    _boxName = list.boxName ? list.boxName : '';
                    _boxPrice = (list.price / 100).toFixed(2);
                    _boxIntro = list.boxIntroduce ? list.boxIntroduce : '';
                    _boxNote = list.boxNote ? list.boxNote : '';
                    _boxDateCreated = bainx.formatDate('Y-m-d', new Date(list.dateCreated));
                   // if(list.mineCourse){
                       // _courceImg = list.mineCourse.picUrls;
                       // _courceName = list.mineCourse.courseName;
                   // }
                    suggestT = list.healthyAdvice ? list.healthyAdvice : '';
                    itemId = list.itemId ? list.itemId : 0;
                    isTrade = list.tradeStatus == 2 || list.tradeStatus == 4 || list.tradeStatus == 5 || list.tradeStatus == 6 || list.tradeStatus == 7 || list.tradeStatus == 20 ? true : false;
                    csadNameQ = list.csadName  ? list.csadName : '';
                    ridQ = list.detectReportId;
                    var prodList = [];
                    if(list.productList){
                         prodList = list.productList;
                        $.each(prodList,function(i,item){
                            productList.push({proImg:item.prodPicUrls,proName:item.prodName});
                        })
                    }
                    appendMsg(userName,_boxImg,_boxPrice,_boxName,_boxIntro,_boxNote,csadNameQ,_boxDateCreated,suggestT,'','',ridQ,productList,itemId,isTrade);

                }
                else{
                    $('.coursePreviewContent').html('<p style="text-align: center;margin-top: 50%; font-size: 18px">暂无盒子</p>');
                }




            })
        }


        function weiXinShare(){
            if(Common.inWeixin){
                //console.log(document.title);
                var shareUrl = location.href;
                var shareImgUrl = imgPath + 'common/images/share_box.png',
                    desc =  '我们已根据你的实际情况为你生成专属的护肤盒子，你可以查看盒子详情并进行购买',
                    shareOption = {
                        title: '9LAB-私人定制护肤盒子', // 分享标题
                        desc: desc, // 分享描述
                        link: shareUrl,
                        type: 'link',
                        dataUrl: '',
                        imgUrl: shareImgUrl
                    },
                    shareOptionTimeline = {
                        title: desc,
                        link: shareUrl,
                        imgUrl: shareImgUrl
                    };

                WeiXin.hideMenuItems();
                WeiXin.showMenuItems();
                WeiXin.share(shareOption, shareOptionTimeline);
            }
        }

    }

    return boxDetailCommon
})