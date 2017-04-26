define('h5/js/common/goods', [
    'jquery',
    'h5/js/common/data'
], function($, Data) {
    var Map = {};

    function hasDot(num) {              //判断是否有小数
        if (!isNaN(num)) {
            return ((num + '').indexOf('.') != -1) ? true : false;
        }
    }

    function moneyString(money) {           //如果没有小数，去掉。

        var Price = parseFloat((money / 100).toFixed(2));

        return (isNaN(money)  ? 0 : (hasDot(Price) ? Price.toFixed(2) : parseInt(Price)));
    }

    function Goods(options) {
        this.init(options);
        Map[this.itemId] = this;
    }
    Goods.prototype = {
        init: function(options) {
            //console.log('实例化商品数据', options);
            $.extend(this, options);

            if (this.detail && typeof this.detail == 'string') {
                this.detail = this.detail.split(';');
            }

            if (this.features && typeof this.features == 'string') {
                try {
                    var tmp = JSON.parse(this.features);
                    this.features = tmp;
                } catch (ex) {
                    console.log(ex);
                    //alert(JSON.stringify(ex));
                }
            }

            if (this.pics && typeof this.pics == 'string') {
                this.pics = this.pics.split(';');
            }
            if ($.isArray(this.pics) && this.pics.length) {
                var img = this.pics[0],
                    isJpg = /\.jpg/gi.test(img);

                this.thumimg = img + (isJpg ? '!small' : '');
                this.listimg = img + (isJpg ? '!300q75' : '');
                this.bigimg = img;
                
                //首页临时橱窗位图片
                var indeximg = this.pics[this.pics.length-1],
                    indexisJpg = /\.jpg/gi.test(indeximg);
                this.indeximg = indeximg + (indexisJpg ? '!300q75' : '');
            }






            //this.desc = this.desc;
            this.refundhide = this.isrefund == 1 ? '' : 'hide';
            this.isrefund = this.isrefund == 1 ? '可' : '不';  //退货
            this.isNeedPostFee = this.isNeedPostFee == 0 ? '' : '不';  //包邮

            this.isTaxFreehide = this.isTaxFree == 1 ? '' : 'hide';
            this.showTime = false; //显示倒计时



            var S = this;
            S.flag = {};
            //默认商品可购买数量是商品的库存数量
            S.cap = S.itemNum;
            S.alreadyBuyCount = 0;

            if ($.isArray(S.tags) && S.tags.length) {
                S.tags.sort(function(m, n) {
                    return m.weight <= n.weight;
                });
                
                var flagIcon = [],
                    flagIconSpec = [],
                    flagBit = [];
                $.each(S.tags, function(index, tag) {
                   
                    if (!tag) {
                        console.log(S);
                        //alert('非法的标' + S.itemId);
                        return;
                    }
                    /*if (tag.type == 1000) {

                    }*/
                    var okv = null;
                    if (tag.okv) {
                        try {
                            okv = JSON.parse(tag.okv);
                            //console.log(okv);
                        } catch (ex) {
                            console.log('tag.okv is not json', tag);
                        }
                    }
                    


                    switch (tag.bit) {
                        case 1: //限购
                            S.flag.limit = okv;
                            if(okv && okv.xgLimitNum){
                                S._htmlLimit = '<span class="limit">限购'+ okv.xgLimitNum +'件</span>';
                            }
                            //flagIcon.push('<img class="flag-pierre" src="' + tag.pic + '" />');
                            flagIcon[tag.bit] = '<img class="flag-pierre" src="' + tag.pic + '" />';
                            flagBit.push(tag.bit);
                            console.log('限购', S);
                            break;
                        case 2: //半价
                            S.flag.half = tag.pic;
                            //flagIcon.push('<img class="flag-half" src="' + tag.pic + '" />');
                            flagIconSpec[tag.bit] = '<img class="flag-half" src="' + tag.pic + '" />';
                            flagBit.push(tag.bit);
                            break;
                        case 4: //橱窗推荐
                            S.flag.win = tag.pic;
                            break;
                        case 8: //不支持积分
                            S.flag.disablePoint = true;
                            break;
                        case 16: //时令
                            S.flag.season = tag.pic;
                            //flagIcon.push('<img class="flag-season" src="' + tag.pic + '" />');
                            flagIcon[tag.bit] = '<img class="flag-season" src="' + tag.pic + '" />';
                            flagBit.push(tag.bit);
                            break;
                        case 32: //臻品
                            S.flag.pierre = tag.pic;
                            //flagIcon.push('<img class="flag-pierre" src="' + tag.pic + '" />');
                            flagIcon[tag.bit] = '<img class="flag-season" src="' + tag.pic + '" />';
                            flagBit.push(tag.bit);
                            break;
                        case 64: //不支持优惠
                            S.flag.disableCoupon = true;
                            break;
                        case 128: //不计运费
                            S.flag.noPostFee = true;
                            S.noPostFee = '[免运费]';
                            break;
                        case 256: //只允许立即购买
                            S.flag.immediatelyBuy = true;
                            break;
                        case 512: //不支持配送，仅限自提
                            S.flag.unableDistribution = true;
                            break;
                        case 1024: //不支持货到付款
                            S.flag.unableDelivery = true;
                            break;
                        case 2048:  //抢购
                            S.flag.immediatelyBuy = true;
                            S.showTime = true;
                            break;
                        //case 32768: //免税
                        //    S.flag.taxFree = tag.pic;
                        //    flagIcon[tag.bit] = '<img class="flag-taxFree" src="' + tag.pic + '" />';
                        //    flagBit.push(tag.bit);
                        //    break;
                    }

                   
                });
              
                //lin 2015-10-30
                if(flagIcon.length > 0){
                  
                    var new_flagBit = flagBit.sort(function(m,n){
                        if(m > n){
                            return n;
                        }
                   });
                    //pop:从集合中把最后一个元素删除，并返回这个元素的值
                    //shift:从集合中把第一个元素删除，并返回这个元素的值。
                    S._htmlFlag = '<div class="goods-flag">' + flagIcon[new_flagBit.pop()] + '</div>'; //flagIcon.join('')
                    if(flagIconSpec.length > 0){
                        S._htmlFlagSpec = '<div class="goods-flag-Spec">' + flagIconSpec[2] + '</div>'; //flagIcon.join('')
                    }

                }else{
                    S._htmlFlag = '<div class="goods-flag"></div>';
                }
                
            }




            if(S.showTime){
                S.soldOutCartState = 'icon-sold-out';
                this._htmlPrice =  this.activtyPrice ? this.activtyPrice : 0;
                this.baseSoldQuantity = this.activtyBaseSoldQuantity;
                this.itemNum = this.activtyItemNum ;
                this.soldCnt = this.activtySoldCnt;
                this.multiple = this.activtyMultiple;
                this.showTime = '';
                if(this.activtyStatus == 0){   //activtyStatus  0、未开始 1、进行中 2、已结束
                    this.soldCnt = 0;
                    this.baseSoldQuantity = 0;
                }
            }else{
                this.showTime = 'hide';
                this._htmlPrice = this.price;
                this.baseSoldQuantity = this.baseSoldQuantity;
                this.multiple = this.multiple;
                this.itemNum = this.itemNum ;
                this.soldCnt = this.soldCnt;
            }
            //抢购开始前  已售数量=销售基数+实际销售数量（如果之前进行过抢购的活动，那也应包括之前抢购销售的数量）；
            //已售数量=(抢购的销售基数+抢购的销售数量)*活动展示倍数；
            //已售数量=销售基数+实际销售数量（也包括刚刚抢购销售的数量）




            //不减推广费
            this.brokerageFeehide = this.hasBrokerageFee == 1 ? '' : 'hide';
            this.discount = ((this._htmlPrice / this.refPrice) * 10).toFixed(1)   //折扣
            this.discount = this.discount <= 0 ? 0 : this.discount;
            this.discountClass = (this.discount >= 10) ? 'hide':'';           //大于10隐藏

            //减推广费
            //if(this.hasBrokerageFee == 1){            //1显示推广费、0不显示
            //    this.brokerageFeehide = '';
            //    this.brokerage = this.brokerageFee;
            //}else{
            //    this.brokerageFeehide = 'hide';             //不是代理
            //    this.brokerage = 0;
            //}
            //
            //this.discountPrice = this._htmlPrice - this.brokerage;
            //this.discountPrice = this._htmlPrice == 0 ?  0 : this.discountPrice;
            //this.discount = ((this.discountPrice / this.refPrice) * 10).toFixed(1)   //折扣
            //this.discount = this.discount <= 0 ? 0 : this.discount;
            //this.discountClass = (this.discount >= 10) ? 'hide':'';           //大于10隐藏

            //this.brokerageFeehide = 'hide';
            //this.discount = ((this._htmlPrice / this.refPrice) * 10).toFixed(1)   //折扣
            //this.discountClass = (this.discount >= 10) ? 'hide':'';      //大于10隐藏


            this.brokerageFee = this.brokerageFee ? moneyString(parseInt(this.brokerageFee)) : this.brokerageFee;

            this._htmlPrice = moneyString(this._htmlPrice);
            this.itemNum = this.itemNum ? this.itemNum : 0;
           // console.log(this._htmlPrice);
            if(hasDot(this._htmlPrice)){
                this._htmlPrice = this._htmlPrice.replace(/([\d]*)(\.)([\d]*)/gi, function(a, b, c, d) {
                    return '<strong>' + b + '</strong>' + c + d;
                });
            }
            this._htmlRelPrice = moneyString(this.refPrice);

            this.saleTotal = (parseInt(this.baseSoldQuantity) + parseInt(this.soldCnt))* parseInt(this.multiple);
            this.goodsAllTotal = (parseInt(this.baseSoldQuantity) + parseInt(this.itemNum) + parseInt(this.soldCnt))* parseInt(this.multiple);
            this.threshold = Math.ceil(this.saleTotal / this.goodsAllTotal * 100);
            this.threshold = this.threshold > 100 ? 100 : this.threshold;

            this.isTopichide = 'hide';
            if(this.type == 11 ){//判断是否是满减
                this.isTopichide = 'show';
                this.topicParameter = JSON.parse(this.topicParameter);
                this.topicParameterMin = (parseFloat(this.topicParameter[0].min) / 100);
                this.topicParameterValue = (parseFloat(this.topicParameter[0].value) / 100);
                this.topicParameterWord = '满'+this.topicParameterMin + '减' +this.topicParameterValue;
            }


            if (!S.itemNum) {

                S.soldOut = '<img class="flag-sold-out" src="http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20150403/vNTT-0-1428049594317.png" />';
                S.soldOutCartState = 'icon-sold-out';
            }

            
            return this;
        },
        /**
         * 检查限购
         * @return {[type]} [description]
         */
        checkLimit: function() {
            var S = this,
                pomi = $.Deferred();

            if (S.flag.limit && !S.flag.limit.check) {
                Data.checkActiveOrder(this.itemId).done(function(res) {
                    console.log(res);
                    if (res && res.itemLimits) {
                        $.each(res.itemLimits, function(index, item) {
                            if (item.itemId == S.itemId) {
                                S.cap = item.cap;
                                S.flag.limit.check = item;
                                S.alreadyBuyCount = S.flag.limit.xgLimitNum - S.cap;
                            }
                        });
                        pomi.resolve();
                    }
                }).fail(function(code, json) {
                    pomi.reject(json);
                });
            } else {
                pomi.resolve();
            }
            return pomi;
        },
        limitMsg: function(cap) {
            if (!isNaN(cap)) {
                this.cap = cap;
                this.alreadyBuyCount = this.flag.limit.xgLimitNum - this.cap;
            }
            var template = '{{title}}限购{{limit}}件{{already}}',
                data = {
                    title: this.title,
                    limit: this.flag.limit.xgLimitNum,
                    already: this.alreadyBuyCount > 0 ? '，您已经购买过' + this.alreadyBuyCount + '件' : ''
                }
            return bainx.tpl(template, data);
        },
        check: function(new_item_count, count) {
            var pomi = $.Deferred();
            if (new_item_count > 99) {
                pomi.reject({
                    msg: '一次最多可以买99件哦！'
                });
                return pomi.promise();
            }
            if (count >= 0) {
                if (!this.itemNum) {
                    pomi.reject({
                        msg: this.title + '已经售罄',
                        soldOut : true
                    });
                    return pomi.promise();
                }
                if (new_item_count > this.itemNum) {
                    pomi.reject({
                        msg: this.title + '库存只有' + this.itemNum + '件',
                        stockLess:true
                    });
                    return pomi.promise();
                }
                if (this.approveStatus != 1) {
                    pomi.reject({
                        msg: this.title + '已经下架',
                        approveStatus:true
                    });
                    return pomi.promise();
                }
                if (this.flag.limit && new_item_count > this.flag.limit.xgLimitNum) {
                    pomi.reject({
                        msg: this.limitMsg(),
                        limit:true
                    });
                    return pomi.promise();
                }
                if (this.flag.limit) {
                    var S = this;
                    this.checkLimit().done(function() {
                        if (S.cap > 0 && new_item_count <= S.cap) {
                            pomi.resolve();
                        } else {
                            pomi.reject({
                                msg: S.limitMsg(),
                                limit:true
                            });
                        }
                    });
                    return pomi.promise();
                } else {
                    pomi.resolve();
                    return pomi.promise();
                }
            } else if (count < 0 && new_item_count >= 0) {
                pomi.resolve();
                return pomi.promise();
            }
            return pomi.promise();
        }
    };

    Goods._map = Map;

    Goods.create = function(options) {
        return Goods.query(options.itemId) || new Goods(options);
    };
    Goods.query = function(itemId) {
        return Map[itemId];
    };
    Goods.fetch = function(ids) {
        return Data.fetchItemsInfo(ids).done(function(res) {
            //console.log(res);
            if (res.items && res.items.length) {
                $.each(res.items, function(index, item) {
                    Goods.create(item);
                });
            }
        });
    };

    window['Goods'] = Goods;

    return Goods;
});
