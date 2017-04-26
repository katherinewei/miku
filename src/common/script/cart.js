define('h5/js/common/cart', [
    'jquery',
    'h5/js/common/data',
    'h5/js/common/goods',
    'h5/js/common/event',
    'h5/js/common/url',
], function($, Data, Goods, Event,URL) {


    function Cart(goods) {
        this.goods = Goods.create(goods);
        this.id = this.goods.itemId;
        this.count = 0;
        this.checked = true;
        this._change_count = 0;
        Cart._all[this.id] = this;
    }
    Cart.prototype = {
        toggleCheck:function(checked){

            var tr = false;
            if(arguments.length){
                if(this.checked != !!checked){
                    this.checked = !!checked;
                    tr = true;
                }
            }else{
                this.checked = !this.checked;
                tr = true;
            }

            if(tr){

                if(this.checked){

                    Cart._sum+=this.sum();
                    Cart._total++;
                }else{

                    Cart._sum-=this.sum();
                    Cart._total--;
                }

                var sel_goods_count = $('.goods-view .checked').length,
                    cart_goods_count = $('.cart-item-list .cart-item').length;

                if(sel_goods_count == 0){
                    Cart._sum =0;
                    Cart._total=0;
                }

                if(sel_goods_count == cart_goods_count){
                    $('.small-cart .all-select').addClass('checked');
                }else{
                    $('.small-cart .all-select').removeClass('checked');
                }

                Cart.trigger('change:sum', Cart._sum);
                Cart.trigger('change:total', Cart._total);
            }
            return this;
        },
        sum: function(count) {
            return this.goods.price * (count || this.count);
        },
        add: function(options) {
            var S = this,
                _count = options.count || -S.count,

                pomi = $.Deferred();

            if(S.goods.flag.immediatelyBuy && _count > 0){
                var data = {
                    prompt : true,
                    msg : S.goods.title+'只允许立即购买'
                };
                pomi.reject(data);
                return pomi;
            }

            S._change_count = S._change_count + _count;

            var new_item_count = S.count + S._change_count;

            S.goods.check(new_item_count, _count).done(sync).fail(function(json) {
                S._change_count = 0;
                alert(json && json.msg || '未知错误');
            });

            function sync() {
                clearTimeout(S._cart_sid);
                S._cart_sid = setTimeout(function() {
                    if (S._change_count) {
                        S._sync().always(function() {
                            S._change_count = 0;
                        }).done(function(res) {
                            pomi.resolve(res);
                        }).fail(function(code, json) {
                            pomi.reject(json);
                        });
                    }
                }, 500);
                options && $.isFunction(options.start) && options.start(new_item_count);
            }

            return pomi.promise();
        },
        _sync: function() {
            var S = this,
                count = S._change_count;

            if(URL.activeTopicPage.indexOf(location.pathname) >= 0){        //判断是否是满减链接。。如果是，在app不调用add接口
                if(!URL.param.isApp){
                    return;
                }
            }

            return Data.addCart(this.id, count).done(function(res) {

                if (S.count == 0 && count > 0) {
                    Cart._add(S, count);
                }
                else {
                    S.count += count;
                    if(S.checked){

                       if(S.goods.topicId){         //如果有计算总价
                           Cart.topicArr[S.goods.topicId].total += S.sum(count)
                           Cart._totleTopicP = Cart.topicPrice();
                       }
                       Cart._sum += S.sum(count);

                       Cart.trigger('total', Cart._total);
                    }
                }
                if (S.count <= 0) {
                    Cart._remove(S);
                }
            });
        },
        removeConfirm: function() {
            return window.confirm("要删除" + this.goods.title + "吗？");
        },
    }

    Event(Cart);

    Cart.toggleCheckAll = function(checked){
        Cart.forEach(function(id, item){
            item.toggleCheck(checked);
        });
        return Cart;
    }

    Cart.getCheckItemsParam = function(){
        var ret = [];
        Cart.forEach(function(id, item){
            if(item.checked){
                ret.push(id+','+item.count);

                if(URL.site.indexOf('miku') >= 0){
                    _czc.push(['_trackEvent', '商品',id, '购物车_结算', '结算', '']);
                }

            }
        });
        return ret.join(';');
    }

    Cart.total = function() {

        return Cart._total;
    }

    Cart.sum = function() {
        return Cart._sum;
    }
    Cart.topicPrice = function(){

        var _totalTP = 0;
        for(var i in Cart.topicArr){


            Cart.topicArr[i].totleTopicP = Cart._fetchTopicPrice(Cart.topicArr[i].topicParameter,Cart.topicArr[i].total);
            if(Cart.topicArr[i].totleTopicP == ''){
                Cart.topicArr[i].totleTopicP = 0;
            }
            _totalTP += parseFloat(Cart.topicArr[i].totleTopicP);
        }

        return _totalTP;
    }

    Cart.ready = function(callback) {
        callback && Cart.done(callback);
        if (!Cart._ready) {
            Cart._fetch();
            Cart._ready = true;
        }
        return Cart;
    }

    Cart.query = function(id) {
        return Cart._map[id];
    }

    Cart.forEach = function(callback) {
        $.each(Cart._map, callback);
        return Cart;
    }

    Cart.renderSmallCart = function(options) {
        var template = options && options.template || '<div class="small-cart row fvc"><div class="col col-6 pl-10"><span class="checkbox checked all-select"></span>全选</div><div class="sumTotal col col-10"><span class="label">合计:</span><em class="price">{{ sumPrice }}</em><span class="diso">已优惠<b class="discountAll"></b></span></div><div class="col col-9 enter fb fvc fac" href="{{href}}"><div>{{ submitText }}<em class="sum-goods-count">({{ goodsCount }})</em></div></div></div>',
            cart_goods_count = $('.cart-item-list .cart-item').length,
            sel_goods_count = $('.cart-item .checked').length,
            html = cart_goods_count != 0 ? bainx.tpl(template, $.extend({
                sumPrice: (Cart._sum/ 100).toFixed(2),
                goodsCount: Cart._total,
                //postFee: '<br/>满10元免配送费' //(Cart._sum >=1000 || Cart._noPostFee) ? '':
            }, options)) : '';

        var app_sum = (Cart._sum/ 100).toFixed(0);
        if(parseInt(app_sum) > 999){
            app_sum = '999+';
        }

        $('#app-bar .cart-bar .price').text(app_sum);
        options && options.wrap && options.wrap.html(html);
        cart_goods_count = options && options.is_del ? cart_goods_count - 1 : cart_goods_count;

        if (cart_goods_count == Cart._total || sel_goods_count == cart_goods_count) {
            $('.small-cart .all-select').addClass('checked');
        }else{
            $('.small-cart .all-select').removeClass('checked');
        }
        if(Cart._total == 0){
            $('.sumTotal .price').text('0.00');
        }

        $('.cart-bar .count').html(cart_goods_count);
        return html;
    }

    Cart.create = function(options) {
        var id = (options && (options.itemId || options.id)) || options;
        var cart = Cart.query(id) || Cart._all[id] || new Cart(options);
        return cart;
    }

    Cart._init = function() {
        Cart._sum = 0;
        Cart._totleTopicP = 0;//优惠总价
        Cart._total = 0;
        Cart._map = {};
        Cart._all = {};
        Cart.topicArr = [];//满减数组
        Cart._noPostFee = 0;
        Cart._approveStatus = {};
        Cart._promise = $.Deferred();
        Cart._promise.promise(Cart);
        return Cart;
    }

    Cart._add = function(cart, count) {

        cart.count = count;
        Cart._map[cart.id] = cart;
        Cart._sum += cart.sum();
        Cart._total++;

        var lis = cart.goods,
            tpId = lis.topicId;
        if(tpId){

            if(!Cart.topicArr[tpId]){
                Cart.topicArr[tpId] = {};
                Cart.topicArr[tpId].total = 0;
                Cart.topicArr[tpId].minPrice = 0;
                Cart.topicArr[tpId].value = 0;
                Cart.topicArr[tpId].id = 0;
                Cart.topicArr[tpId].count = 0;
                Cart.topicArr[tpId].name = '';
                Cart.topicArr[tpId].list = [];
                Cart.topicArr[tpId].totleTopicP = 0;
            }


            Cart.topicArr[tpId].total += lis.price * cart.count;
            Cart.topicArr[tpId].list.push(Cart._map[lis.itemId].goods);
            Cart.topicArr[tpId].count += 1;
            Cart._map[lis.itemId].goods.checked = true;
            //Cart.topicArr[tpId].list.push(lis);
            Cart.topicArr[tpId].topicParameter = lis.topicParameter;



            Cart.topicArr[tpId].totleTopicP = 0;
            Cart.topicArr[tpId].id = lis.topicId;
            Cart.topicArr[tpId].name = lis.topicName;

            Cart._totleTopicP = Cart.topicPrice();

        }


        Cart.trigger('total', Cart._total);


        cart.goods.flag.noPostFee && Cart._noPostFee++;
        if (cart.goods.approveStatus != 1) {
            Cart._approveStatus[cart.id] = cart;
        }
    }
    Cart._remove = function (cart, is_del) {
        if (Cart.query(cart.id)) {
            if (cart.checked) {
                Cart._total--;
            }

            Cart.trigger('total', Cart._total);
            cart.goods.flag.noPostFee && Cart._noPostFee--;
            if (cart.goods.approveStatus != 1) {
                delete Cart._approveStatus[cart.id];
            }
            delete Cart._map[cart.id];
        }
    }

    Cart.isApproveStatus = function() {
        return $.isEmptyObject(Cart._approveStatus);
    }

    Cart.forEachApproveStatus = function(callback) {
        Cart._approveStatus && $.each(Cart._approveStatus, callback);
        return Cart;
    }


    Cart._fetch = function() {
        Data.getCartItems().done(function(res) {
            $.isArray(res.items) && res.items.length && $.each(res.items, function(index, item) {
                var cart = Cart.create(item);

                Cart._add(cart, item.cartCount);


            });


            Cart._promise.resolve();
        }).fail(function(code, json) {
            Cart._promise.reject(json);
        });
    }
    Cart._fetchTopicPrice = function(topicParameter,total) {
        var hasDiscounted = 0;

        var topicParameterS;

        //如果已经解析了字符串为json的就不解析了~
        try
        {
            topicParameterS = JSON.parse(topicParameter);

        } catch(error) {
            topicParameterS = topicParameter;
        }

        var topicParameterSLength = topicParameterS.length;

        for (var j = topicParameterSLength - 1; j >= 0; j--) {
            if (total >= topicParameterS[j].min) {
                if(j == 0){
                    hasDiscounted = topicParameterS[0].value;
                }
                if(j == topicParameterSLength - 1){
                    hasDiscounted = topicParameterS[j].value
                }else if(j > 0){
                    hasDiscounted = topicParameterS[j].value;
                }
                break;
            }
            if (total < topicParameterS[0].min) {
                hasDiscounted = '';
            }
        }

        return  hasDiscounted;

    }

    window['Cart'] = Cart;

    return Cart._init();


});
