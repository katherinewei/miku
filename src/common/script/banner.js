define('h5/js/common/banner',[
           'jquery',
           'h5/js/common/data',
           'h5/js/common',
            'h5/js/common/url'
    ], function($, Data, Common,URL) {

    function Banner(data) {
        this.img = Common.imgSrc(data.picUrl);
        this.className = data.className;
        this.title = data.title;
        this.target = data.target;
        this.index_key = data.index_key;
        this.id = data.id;
      //  this.getXmUrl = data.getXmUrl;
        var remains_time_name = '',
            desc_name = '',
            remains_time = 0,
            nowTime = parseInt(data.nowTime / 1000),
            startTime = parseInt(data.onlineStartTime / 1000),
            endTime = parseInt(data.onlineEndTime / 1000);
        this.startTime = startTime;
        this.endTime = endTime;
        if (startTime && endTime) {
            //            console.log(startTime,nowTime,endTime);
            if (nowTime < startTime) { //未开始
                desc_name = '即将开抢';
                this.shadows = 'shadows';
            } else if (nowTime > endTime) {//已结束
                desc_name = '已结束';
                this.shadows = 'shadows';
            } else { //进行中
                //desc_name = '仅剩';
                //remains_time = endTime - nowTime;
                this.shadows = '';
                this.count_down_time = 'count_down_time'; //用于倒计时的类
            }
            //
            //if(remains_time > 0){
            //    if(remains_time < 60){
            //        remains_time_name = parseInt(remains_time)+'秒';
            //    }else if(remains_time < 60*60){
            //        remains_time_name = parseInt(remains_time/60)+'分';
            //    }else if(remains_time < 60*60*24){
            //        remains_time_name = parseInt(remains_time/(60*60))+'时'+(parseInt(remains_time/60)-parseInt(remains_time/(60*60))*60)+'分';
            //    }
            //}
            //if(this.itemNum && this.itemNum == 0){
            //    desc_name = '已抢光';
            //    this.hasSoldOut = 'hasSoldOut';
            //}
            remains_time_name = desc_name;
        }
        if (data.showText == 1) {
            this.is_show = 'show';
        } else {
            this.is_show = 'hide';
        }
        switch (data.redirectType) {
            case 311:
                this.href = URL.goodsDetail + '?gid=' + this.target;
                if(data.itemNum == 0) {
                    this.hasSoldOut = 'hasSoldOut';
                    remains_time_name = '已抢光';
                    this.count_down_time = '';
                }
                break;
            case 312:
                this.href = URL.cateTwoPage + '?categoryId=' + this.target + '&categoryName=' + this.title;  //二级类目/
                break;
            case 313:
                this.href = URL.list + '?cid=' + this.target + '&name=' + this.title;  //商品列表
                break;
            case 314:
                this.href = URL.myPoint + '?mode=obtain';
                break;
            case 315:
                this.href = URL.myCoupon + '?mode=obtain';
                break;
            case 316:
                this.href = URL.list + '?brandId=' + this.target + '&name=' + this.title + '&type=brand';  //品牌商品列表
                break;
            case 317:
                this.href = URL.list + '?q=' + this.target + '&name=' + this.title;  //搜索列表
                break;
            case 318:
                this.href = URL.crowdfundHomePage;  //众筹首页
                break;
            case 319:
                this.href = URL.crowdfundInfoPage + '?crowdfundId=' + this.target;  //众筹详情
                break;
            case 320:
                break;
            case 321:
                this.href = URL.getXmDetail+'?id='+this.id;  //项目详情
                break;
            case 322:
                this.href = this.target ? URL.articleInfoPage+'?dyid='+this.target+'&type='+1 : '';  //文章详情
                break;
            default:
                this.href = this.target;
                break;
        }

        this.remains_time = remains_time_name;
    }

    Banner.prototype = {
        html: function (template) {
            return bainx.tpl(template || Common.Template.bannerItem, this);
        }
    };

    Common.Banner = Banner;

    return Banner;
});