/**
 * 生成盒子
 * Created by xiuxiu on 2016/5/21.
 */
define('h5/js/page/csadCreateMineBoxPage',[
    'jquery',
    'h5/js/common/url',
    'h5/js/common',
    'h5/js/common/data',
    'h5/js/common/nexter',
    'h5/js/common/transDialog',
   // 'h5/js/page/csadUserTrajectory',
    'h5/js/page/imageMagnification',
    'h5/js/page/boxDetailPageComm',
    'h5/js/page/csadCreateOrder',
   // 'plugin/addressData/1.0.0/addressData',
    // 'h5/js/page/csadCommon',
    // 'h5/js/page/csadQuestionnaireSurveyPage',
    'h5/css/page/createMineBoxPage.css'

], function($, URL, Common, Data,Nexter,Dialog,imageMagnification,BoxDetailCommon,csadCreateOrder) {

    var userBox = function(_uid,_rid,boxId,_csadName,_csadTel,canEdit,_userName,reportTime,notIframe) {

        var Page,
            rid,
            _CanEdit = canEdit ? true : false,//报告id
            dialog,//步骤弹窗
            chooseBoxProductDialog,//产品弹窗
            userName = _userName ? _userName+'的' : '',
            csadInfo = $(window.parent.document).find('#login_user .curName'),
            csadName = URL.param.csadName ? URL.param.csadName : csadInfo.text(),
            csadTel = URL.param.csadTel ? URL.param.csadTel : csadInfo.data('mobile'),
            containerBox = 'CreateBoxContainer',
            containerCreateBox = $('#csadUserMessageContainer_'+_uid),
            isCourseTpl = false,//是否是模板的
            isSave = false,//是否保存
        //addBoxProduct = '<li class="addBoxProduct"><div class="searchProdct"><i></i> <input type="text" name="productName" placeholder="请输入产品名" /></div><span class="addBoxProductBtn">添加产品</span><!--<img src="' + imgPath + 'common/images/personalTailor/pic_add.png" title="添加产品"/>--></li>',
            addPicture = '<div class="addPic col"><form id="my_form1" enctype="multipart/form-data"><img src="' + imgPath + 'common/images/personalTailor/pic_add.png"/><input type="hidden" name="type" value="1"/> <input type="file" class="file" name="file"  multiple="multiple"/></form></div>';
        // isCreateLesson = true;//是否创建课时

        //判断数组是否包含某元素
        Array.prototype.contains = function (obj) {
            var i = this.length;
            while (i--) {
                if (this[i] == obj) {
                    return true;
                }
            }
            return false;
        }


        //初始化
        function init() {
            // Page = containerCreateBox.append('<div class="'+containerBox+'"></div>');
            coursePreview(false)

            if (_CanEdit) {
                containerCreateBox.find('.'+containerBox).append('<div class="footer grid questionTool"><div class=""><span class="  prevBtn prevCQ">上一步 </span><span class="saveBoxBtn  nextBtn">下一步 </span></div></div>');

            }

            bindEvent();
        }

        window.onbeforeunload = function(){
            if(!isSave && canEdit){
                return ("您的盒子尚未保存");
            }
        }
        //布局
        function layout(obj) {
            var reportTimeP = reportTime ? '('+bainx.formatDate('Y-m-d h:i', new Date(reportTime))+')' : '',
                layout = [
                    {
                        title: '盒子基本信息',
                        className: 'boxMessage',
                        content: getUserMessage()
                    },
                    {
                        title: '选择产品/总额：<span class="chosedProductPrice">0</span>元',
                        className: 'productMessage',
                        content: '<ul></ul>'
                    }
                ],
                layoutTpl = '<div class="boxItem {{className}} "><div class="title">{{title}}</div><div class="contentItem grid">{{content}}</div></div>',
                layoutHtml = [];

            $.each(layout, function (index, item) {
                layoutHtml.push(bainx.tpl(layoutTpl, item));
            })
            $(obj).append(layoutHtml.join(''));

            $(obj).append('<div class="boxOtherMsg"></div>');
            if (!_CanEdit) {
                containerCreateBox.find('.courseMessage .title').text('课程');
               // containerCreateBox.find('input,.healthyAdviceTxt').attr('readonly', 'readonly').addClass('readonly');
                containerCreateBox.find('input').attr('readonly', 'readonly').addClass('readonly');
                containerCreateBox.find('.chooseCourseTpl,.box_img .addPic,.addBoxProduct').hide();
                containerCreateBox.find('.makeType').find('.choice').addClass('disabled').css('display', 'none');
                 $(' .makeType').find('.active').css({'display': 'block','width':'100px'});
                //$('.addBoxProduct').hide();
            }else{
                containerCreateBox.find('.boxMessage').addClass('canEditLayout');
            }
        }


        //课程预览 && 不可编辑
        function coursePreview(isPreview) {

            if (isPreview) {

                BoxDetailCommon(containerCreateBox,'',userName,true,csadName,_rid);

            }
            else {

                layout('#csadUserMessageContainer_'+_uid+' .'+containerBox);

                //containerCreateBox.find('.courseMessage').addClass('hide');

                var data = {
                    boxId: boxId
                }
                Data.getMineBoxInfo(data).done(function (res) {

                    var vo = res.vo;
                    rid =vo.detectReportId;
                    var BodyObj = containerCreateBox.find('.'+containerBox),
                        isEdit = true;
                    if (isPreview) {
                        BodyObj = containerCreateBox.find('.coursePreview');
                        isEdit = false;
                    }
                    BodyObj.find('.makeType .chooseItem').each(function(){
                        if($(this).data('id') == vo.mineType){
                            $(this).addClass('active').siblings().removeClass('active');
                        }
                    })
                    if(vo){
                        if(vo.boxName){
                            BodyObj.find('input[name=box_name]').val(vo.boxName);
                        }


                    }


                    getBoxDetailView(res.vo, isEdit)
                })
            }

            // setInputSize();
        }

        //查询盒子之后
        function getBoxDetailView(vo) {




            // if (vo.price) {
            getProductList(vo);

            //getBoxProductDialog(vo, true)
            //  }
            var tpl = '<p>盒子生成时间：<span class="boxDateCreated">{{dateCreated}}</span></p><p>私人管家：' + csadName + '</p><p>联系方式：' + csadTel + '</p><p >盒子价格：￥<input  class="boxPrice price" value="{{price}}"/></p>',
                html = [];
            vo.dateCreated = bainx.formatDate('Y-m-d h:i', new Date(vo.dateCreated));
            vo.price = (isNaN(vo.price) ? 0 : (vo.price / 100));
            html.push(bainx.tpl(tpl, vo));
            containerCreateBox.find('.chosedProductPrice').text(vo.price);
            containerCreateBox.find('.boxOtherMsg').append(html.join(''));
            if(!canEdit){
                var boxName =vo && vo.boxName ? vo.boxName : '';
                containerCreateBox.prepend('<div class="boxTitleName"><h3>'+boxName+'</h3><p>'+bainx.formatDate('Y-m-d', new Date(vo.dateCreated))+'</p></div>');
            }

        }

        //盒子基本信息
        function getUserMessage() {
            var basicMessage = '<div class="row {{className}}"> <label class=""><i>*</i>{{label}}:</label>{{content}}</div>',
                basicMessageHtml = [],
                basic = [

                    {
                        label: '名称',
                        name: 'box_name',
                        val:userName + '护肤定制',
                        className:'boxBL'
                    },

                    {
                        label: '定制类型',
                        name: 'mine_type',
                        type: 'radio',
                        className:'boxBL'
                    },
                ];

            $.each(basic, function (i, basicItem) {
                if (basicItem.type) {
                    if (basicItem.type == 'radio') {
                        basicItem.content = '<div class="makeType col"><div class="displayB"><b class="choice active chooseItem" data-id="1">护肤定制类</b><b class="choice chooseItem" data-id="2">私密护理类</b><b class="choice chooseItem" data-id="3">减肥定制类</b><b class="choice chooseItem" data-id="4">脱发定制类</b></div> </div>';
                    }

                }
                else {
                    basicItem.content = '<input type="text" class="col" value="'+basicItem.val+'"  name="' + basicItem.name + '" />'
                }
                basicMessageHtml.push(bainx.tpl(basicMessage, basicItem));
            })

            basicMessageHtml.push();

            return basicMessageHtml.join('');
        }



        //get定制产品
        function getBoxProductDialog(vo, inPage,prodIdC) {
            var data = {
                boxId: boxId
            }
            Data.getMineBoxProductVOList(data).done(function (res) {
                var tpl = '<li data-id="{{id}}" class="productItem boxProductActive getBoxProductItem_{{id}} hasChoiceItem" data-price="{{prodRetailPrice}}" data-remain="{{prodNote}}" data-resid="{{multimediaResId}}" data-resremain="{{resUseRemind}}" data-resname="{{resName}}" data-thnmbnail="{{thnmbnail}}">{{operate}}<img src="{{prodPicUrls}}" /><p class="prodName">{{prodName}}</p><p class="{{hide}}">数量：<input type="tel" class="numProdItem" value="{{num}}" /> </p><p class="hide">价格：<span class="price priceProdItem">{{prodRetailPriceSum}}</span></p></li>',
                    html = [],
                    list = res.list;
                $.each(list, function (i, item) {

                    item.operate = inPage ? '<i class="deleteProduct hide"></i>' : '<i class="chooseProducti"></i>'
                    //item.hide = inPage ? '' : 'hide';

                    item.prodRetailPrice = (isNaN(item.prodRetailPrice) ? 0 : (item.prodRetailPrice / 100)).toFixed(2);
                    item.prodRetailPriceSum = item.prodRetailPrice * item.num;
                    if (!item.prodPicUrls) {
                        item.prodPicUrls = imgPath + 'common/images/img_icon.png'
                    }
                    html.push(bainx.tpl(tpl, item));
                })
                        containerCreateBox.find('.productMessage ul').html(html.join(''));
                        containerCreateBox.find('.deleteProduct').hide();
                        containerCreateBox.find('.numProdItem').attr('readonly', 'readonly').addClass('disabled');
                    containerCreateBox.find('.productMessage ul').addClass('noBorder');
            })

        }

        //创建或更新盒子的定制产品
        function createBoxProduct(target,lastCreateProduct) {
            var prodId = target.data('id'),
                num = target.find('.numProdItem').val() ? parseInt($.trim(target.find('.numProdItem').val())) : parseInt($.trim(target.find('.prod_num').val())),
                data = {
                    boxId: boxId,
                    prodId: prodId,
                    num: num
                }

            Data.createOrUpdateMineBoxProduct(data).done(function (res) {
                target.find('.prodImg').addClass('hasChoiceItem');
                var ItemPrice = target.data('price'),
                    tarParentLi = target.parent().parent().parent();
                target.find('.leastSum').text((ItemPrice * num ));
                var lessSum = 0;
                target.parent().find('dd').each(function(){
                    if($(this).find('.prodImg').hasClass('hasChoiceItem')){
                        lessSum += $(this).data('price') * parseInt($.trim($(this).find('.numProdItem').val()))
                    }
                })
                tarParentLi.find('.lessSum').text(lessSum);
                var sumPrice=0;
                $('.lessSum').each(function(){
                    sumPrice += parseFloat($(this).text());
                })
                //var //sumPrice = parseInt(containerCreateBox.find('.boxPrice').val()) + ItemPrice;
                containerCreateBox.find('.boxPrice').val(sumPrice);
                containerCreateBox.find('.chosedProductPrice').text(sumPrice);
                //var updata = {
                //    boxId:boxId
                //}
                //Data.updateBoxPrice(updata).done(function(resUp){
                //    var sumPrice = (isNaN(resUp.boxPrice) ? 0 : (resUp.boxPrice / 100)).toFixed(2);
                //    containerCreateBox.find('.boxPrice').text(sumPrice);
                //    containerCreateBox.find('.chosedProductPrice').text(sumPrice);
                //})

                //var tpl = '<li data-id="{{id}}" class=" boxProductActive getBoxProductItem_{{id}}" data-price="{{prodRetailPrice}}"><i class="deleteProduct hide"></i><img src="{{prodPicUrls}}" /><p>{{prodName}}</p><p>数量：<input type="tel" class="numProdItem" value="{{num}}" /></p><p>价格：<span class="price priceProdItem">{{prodRetailPriceSum}}</span></p></li>',
                //    html = [],
                //    boxProductVO = res.boxProductVO;
                //if (containerCreateBox.find('.getBoxProductItem_' + boxProductVO.id).length == 0) {
                //    if (!boxProductVO.prodPicUrls) {
                //        boxProductVO.prodPicUrls = imgPath + 'common/images/img_icon.png'
                //    }
                //    boxProductVO.prodRetailPrice = (boxProductVO.prodRetailPrice / 100 ).toFixed(2);
                //    boxProductVO.prodRetailPriceSum = (boxProductVO.prodRetailPrice * boxProductVO.num);
                //    html.push(bainx.tpl(tpl, boxProductVO));
                //    containerCreateBox.find('.addBoxProduct').before(html.join(''));
                //} else {
                //    containerCreateBox.find('.getBoxProductItem_' + boxProductVO.id).find('.numProdItem').val(num);
                //}
                //if (containerCreateBox.find('.boxProductActive').length > 0) {
                //    containerCreateBox.find('.courseMessage').removeClass('hide');
                //}
                //if(lastCreateProduct){
                //    var updata = {
                //        boxId:boxId
                //    }
                //    Data.updateBoxPrice(updata).done(function(resUp){
                //        containerCreateBox.find('.boxPrice').text((isNaN(resUp.boxPrice) ? 0 : (resUp.boxPrice / 100)).toFixed(2));
                //    })
                //}
                var prodTips = containerCreateBox.find('.prod_' + prodId);
                prodTips.addClass('hide');
                prodTips.parent().removeClass('disabled');
            })
        }

        //删除定制产品
        function deleteBoxProduct(target) {

            //if (containerCreateBox.find('.productMessage').find('.hasChoiceItem').length == 1) {
            //    bainx.broadcast('只剩一个产品了，不能删除哦');
            //    return
            //}
            var prodId = target.data('id'),
                data = {
                    boxId: boxId,
                    prodId: prodId
                }
            Data.deleteBoxProduct(data).done(function (res) {
                var leastP = parseInt(target.find('.leastSum').text()),
                    lessP = target.parent().parent().parent().find('.lessSum');
                lessP.text(parseInt(lessP.text()) - leastP);
                containerCreateBox.find('.boxPrice,.chosedProductPrice').val((isNaN(res.boxPrice) ? 0 : (res.boxPrice / 100)));
                deleteBoxProductAfter(target, prodId);

            })

        }

        //删除定制产品之后
        function deleteBoxProductAfter(target, prodId) {

            //bainx.broadcast('删除成功！');
            //target.remove();
            target.find('.prodImg').removeClass('hasChoiceItem');
            var prodTips = containerCreateBox.find('.prod_' + prodId);
            prodTips.removeClass('hide');
            prodTips.parent().addClass('disabled');
            prodTips.prev('.prodName').text('');
            //prodTips.parents('.stepItem').find('.res_step').addClass('disabled');
            //prodTips.parents('.stepItem').find('.resName').text('');

            prodTips.each(function(){
                $(this).parent().parent().parent('.stepItem').find('.res_step').addClass('disabled').text('');
                $(this).parent().parent().parent('.grid').find('.resName').text('').addClass('disabled');
            })


            //prodTips.parent().parent().parent('.stepItem').find('.res_step').addClass('disabled').text('');
            //console.log(prodTips.parent().parent().parent())
            //prodTips.parent().parent().parent('.grid').find('.resName').text('').addClass('disabled');

            //if($('.boxProductActive').length == 0){
            //$('.courseMessage').addClass('hide');
            //}
        }

        //get产品
        function getProductList(vo) {
            if(_CanEdit){
                Data.getMineScProductVOList().done(function(res){
                    var list = res.list,
                        prodArr = [],
                        prodLiTpl = '<li data-use-type="{{userType}}" class="row userType{{userType}}"><div class="Ptitle"><p>{{title}}</p><p>共计（<span class="lessSum">0</span>）元</p></div><div class="col"><dl>{{contentTpl}}</dl></div> </li>',
                        prodLiHtml = [],
                        wrapArr = [
                            {
                                title:'清洁'
                            },{
                                title:'湿润'
                            },{
                                title:'护肤（原液、乳）'
                            },{
                                title:'滋润（霜）'
                            }, {
                                title: '防护'
                            }, {
                                title: '眼部'
                            }, {
                                title: '水疗膜'
                            }, {
                                title: '护理操作'
                            },{
                                title: '套装'
                            },{
                                title: '赠品'
                            }
                        ];

                    $.each(wrapArr,function(i,wrapItem){
                        wrapItem.userType = i+1;
                        // wrapItem.title = wrapItem;
                        var prodListTpl = '<dd class="productItem getBoxProductItemC_{{id}} " data-id="{{id}}" data-thnmbnail="{{thnmbnail}}" data-useremind="{{resUseRemind}}" data-multimediaresid="{{multimediaResId}}" data-resremain="{{resUseRemind}}" data-resname="{{resName}}" data-price="{{prodRetailPrice}}" ><div class="prodImg" data-id="{{id}}" ><img src="{{prodPicUrls}}" /><i></i><span class="price priceItem">{{prodRetailPrice}}</span></div><div class="prodDetail"><p class=" prod_name" title="{{prodName}}">{{prodName}}</p><!--<p class="quantity">库存：<span>{{quantity}}</span>--></p><div class="operateNum"><span class="minus-btn">-</span><input type="tel" value="0" class="numProdItem" /> <span class="plus-btn">+</span></div><p class="prod_Price">小计：(<span class="leastSum">0</span>)元</p></div></dd>',

                            prodList=[];
                        $.each(list,function(j,item){
                            if(item.userStep == i+1){
                                item.prodRetailPrice =  item.prodRetailPrice / 100 ;
                                // item.hide = j < 6 ? '' : 'hide'; ///记得删掉
                                item.prodPicUrls = item.prodPicUrls ? item.prodPicUrls : imgPath + 'common/images/img_icon.png';
                                prodList.push(bainx.tpl(prodListTpl,item))
                            }
                        })
                        wrapItem.contentTpl = prodList.join('');
                        prodArr.push(bainx.tpl(prodLiTpl,wrapItem))
                    })

                    containerCreateBox.find('.productMessage ul').html(prodArr.join(''));


                    var MineBoxProductData = {
                        boxId: boxId
                    }
                    Data.getMineBoxProductVOList(MineBoxProductData).done(function (resMine) {
                        var listMine = resMine.list;
                        containerCreateBox.find('.productMessage').find('dd').each(function(){
                            var _tar = $(this);
                            $.each(listMine,function(k,itemMine){
                                if(_tar.data('id') == itemMine.id){
                                    _tar.find('.prodImg').addClass('hasChoiceItem');
                                    _tar.find('.numProdItem').val(itemMine.num);
                                    _tar.find('.leastSum').text(itemMine.num * itemMine.prodRetailPrice / 100);
                                }
                            })
                        })
                        containerCreateBox.find('.productMessage').find('li').each(function(){
                            var lessSum = 0;
                            $(this).find('dd').each(function(){
                                lessSum += parseInt($(this).find('.leastSum').text());
                            })
                            $(this).find('.lessSum').text(lessSum);
                        })
                    })

                })
            }else{
                getBoxProductDialog(vo, true);
            }


        }

        //保存盒子
        function saveBox() {


                var mineType = containerCreateBox.find('.makeType').find('.active').data('id'),
                    pic_urls = containerCreateBox.find('.boxMessage .box_img .active img').attr('src');
                var data = {
                    id: boxId,
                    mineType: mineType,
                    boxName: containerCreateBox.find('input[name=box_name]').val(),
                    //boxIntroduce: containerCreateBox.find('input[name=box_introduce]').val(),
                    //boxNote: containerCreateBox.find('input[name=box_note]').val(),
                   // picUrls: pic_urls,
                   // healthyAdvice:containerCreateBox.find('.healthyAdviceTxt').val(),
                    price:$('.boxPrice').val()*100
                }
                Data.createOrUpdateBox(data).done(function (res) {


                    isSave = true;

                    var target = $(this);
                    $('.CreateBoxContainer').addClass('hide');
                    csadCreateOrder.prototype.init(_uid,res.vo.id);
                    $('.questionBtnG,.createBoxBtnG').removeClass('show');


                })


        }



        //事件
        function bindEvent() {
            //创建盒子
            $('body')
                .off('click', '.previewBtnIBox').on('click', '.previewBtnIBox', function (){//预览
                    coursePreview(true, true);
            })

            containerCreateBox
                .off('click', '.prevCQ').on('click', '.prevCQ', function (){//返回分析报告
                    $('.containerQuestion').removeClass('hide').siblings().addClass('hide');
                    $('.createBoxBtnG').removeClass('show');
                    $('.questionBtnG').addClass('show');
                    $('.questionTab').text('用户诊断');
                })
                .off('click', '.addBoxProductP i').on('click', '.addBoxProductP i', function () {
                    $(this).toggleClass('currentSelectedProduct');
                    $(this).parent().toggleClass('currentSelectedProductLi');
                })


                //选择定制类型
                .off('click', '.makeType .choice').on('click', '.makeType .choice', function (event) {
                    if (!$(this).hasClass('disabled')) {
                        $(this).addClass('active').siblings().removeClass('active');

                        if($(this).parent().parent().hasClass('makeType')){
                            var typeN = $(this).text();
                            containerCreateBox.find('input[name=box_name]').val(userName+typeN);
                        }
                    }

                })

                //删除定制产品
                .off('click', '.deleteProduct').on('click', '.deleteProduct', function (event) {
                    var target = $(this).parents('li');
                    deleteBoxProduct(target);
                })

                //保存盒子
                .off('click', '.saveBoxBtn,.sendBtnPreviewC').on('click', '.saveBoxBtn,.sendBtnPreviewC', function (event) {
                    var isSend = false;
                    if($(this).hasClass('sendBtnPreviewC')){
                        isSend = true;
                    }
                    saveBox(isSend);

                })

                //预览
                .off('click', '.previewBtn').on('click', '.previewBtn', function (event) {
                    coursePreview(true, true);
                })
                .off('click', '.closePreviewC').on('click', '.closePreviewC', function () {
                    $('#coursePreview').remove();
                })
                //修改定制产品数量
                .off('click', '.numProdItem').on('blur', '.numProdItem', function (event) {
                    var tarParent = $(this).parent().parent().parent();
                    if($(this).val() == '0'){
                        //tarParent.find('.prodImg').removeClass('hasChoiceItem');
                        deleteBoxProduct(tarParent);
                        return
                    }

                    if (!$(this).hasClass('disabled')) {
                        //库存
                        //var quanti = tarParent.find('.quantity span').text();
                        //if(quanti < $(this).val()){
                        //    bainx.broadcast('最多只能选择'+quanti+'个');
                        //    return
                        //}
                        createBoxProduct(tarParent);
                    }
                })
                //选中产品
                .off('click', '.prodImg').on('click', '.prodImg', function (event) {
                    var tarParent = $(this).parent();
                    if($(this).hasClass('hasChoiceItem')){
                        deleteBoxProduct(tarParent);
                        //$(this).removeClass('hasChoiceItem');
                    }
                    else{
                        tarParent.find('.numProdItem').val(1);
                        createBoxProduct(tarParent);
                       // $(this).addClass('hasChoiceItem');
                    }
                })
                //产品增减数量
                .off('click', '.minus-btn,.plus-btn').on('click','.minus-btn,.plus-btn',function(){
                    var tarParent = $(this).parent().parent().parent(),
                        numInput = $(this).parent().children('.numProdItem'),
                        numVal = parseInt(numInput.val());

                    if($(this).hasClass('minus-btn')){
                        numInput.val(--numVal);
                        if(numVal >= 1){
                           // tarParent.find('.prodImg').addClass('hasChoiceItem');
                        }else{
                            //bainx.broadcast('输入的产品数量已经是1了！');
                           // numInput.val(--numVal);
                           // tarParent.find('.prodImg').removeClass('hasChoiceItem');
                            deleteBoxProduct(tarParent);
                            return
                        }
                    }
                    else{
                        //库存
                        //var quanti = tarParent.find('.quantity span').text();
                        //if(quanti < numVal){
                        //    bainx.broadcast('最多只能选择'+quanti+'个');
                        //    return
                        //}

                        numInput.val(++numVal);
                        //tarParent.find('.prodImg').addClass('hasChoiceItem');
                    }
                    createBoxProduct(tarParent)
                })

                //预览tab
                .off('click', '.boxContentM li').on('click','.boxContentM li',function(){
                    $(this).addClass('current').siblings().removeClass('current');
                    $('.tabContent').eq($(this).index()).removeClass('hide').siblings().addClass('hide');
                })
        }

        init()
    }

    return userBox

})