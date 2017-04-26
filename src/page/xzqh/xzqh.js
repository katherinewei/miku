/**
 * 卸妆前后
 * Created on 2016/04/08.
 */
require([
    'jquery',
    'h5/js/common/data',
    'h5/js/common',
    'h5/js/common/url'
], function ($, Data, Common, URL) {

    var images=[];

    //生成二维数组
    for(var i=1;i<11;i++){
        images[i] = [];
        for(var j=1;j<5;j++){
            images[i][j] = i + '-' + j;
        }
    }
    var Page,
        //n = images.length,
        count = 0,      //点击次数
        score = 0,      //分数
        row = [];//记录行

    function init() {
        $('.waitting').hide();
        render();
        weiXinShare();

        document.title = '卸妆前后'
    }

    function render() {

        Common.headerHtml('卸妆前后');

        var mainPage = '<div class="wrap page-content"><div class="startPage"><img src="'+imgPath+'/active/images/xzqh/bg1.png"/> <img src="'+imgPath+'/active/images/xzqh/bg2.png"/><img src="'+imgPath+'/active/images/xzqh/bg3.png"/><span class="btn go"><img src="'+imgPath+'/active/images/xzqh/bt1.png" </span></div> </div>';
        Page = $(mainPage).appendTo('body');
        bindEvent();
    }

    function bindEvent(){
        $('body').on('tap','.go',function(event){
            event.preventDefault();
            game();
        }).on('tap','.game dd',function(event){
            event.preventDefault();
            count ++;
            var indexCurrent = $(this).index();//当前点击

            $('.game').find('dd').children('span').addClass('wrong');       //先把所有的加×
            $('dd').each(function(){
                if($(this).data('correct')){            //正确的
                    $(this).children('span').addClass('right').removeClass('wrong');        //匹配正确的加√
                    var indexCorrect =  $(this).index();
                    if(indexCurrent == indexCorrect){               //分数加10分
                        score += 10;
                    }
                }
            })

            if(count > 9){
                setTimeout(function(){
                    GameOver();                 //游戏结束
                },300);
            }else{
                var currIndexRow = GetRandomNum(1,10);      //生成随机数
                currIndexRow = randomNum(row,currIndexRow);

                setTimeout(function(){
                    initGame(currIndexRow)      //重新加载图片
                },300);
            }

        })
    }

    //判断生成的随机是否跟之前的相等，一样则换一个直到1-10全部输出。
    function randomNum(row,currIndexRow) {
        for (var k = 0; k < row.length; k++) {
            if (row[k] == currIndexRow) {
                currIndexRow = GetRandomNum(1, 10);
                return randomNum(row, currIndexRow);
            }
        }
        return currIndexRow;
    }

    //1-10范围内生成随机数
    function GetRandomNum(Min,Max){

        var Range = Max - Min;

        var Rand = Math.random();

        return(Min + Math.round(Rand * Range));

    }


    //开始
    function game(){
        $('.startPage').hide();
        $('.wrap').append('<ul class="game"></ul>');

        var currIndexRow = GetRandomNum(1,10);

        initGame(currIndexRow)

    }

    //随机排列
    function randomsort() {
        return Math.random() > 0.5 ? -1 : 1;
    }

    function initGame(i){
        var arr = [2,3,4],
           arr2 = arr.sort(randomsort),
           index;

        $('.game li').remove();

        var tpl = '<li class="grid fadeInDown"><div class="bigPic"><img src="'+imgPath+'/active/images/xzqh/person/'+images[i][1]+'.png"/> </div><dl class="row"><dd class="col"><img src="'+imgPath+'/active/images/xzqh/person/'+images[i][arr2[0]]+'.png"/><span class="choose"></span> </dd><dd class="col"><img src="'+imgPath+'/active/images/xzqh/person/'+images[i][arr2[1]]+'.png"/><span class="choose"></span> </dd><dd class="col"><img src="'+imgPath+'/active/images/xzqh/person/'+images[i][arr2[2]]+'.png"/><span class="choose"></span> </dd></dl></li>';
        $('.game').append(tpl);


        var str = '',
            str2 = '';

        for(var j = 0; j <arr2.length ;j++){            //随机后的数组
            str = images[i][arr2[j]];                   //获取图片名 1-1,1-2,1-3这样的
            str2 = str.charAt(str.length - 1)           //获取最后一个字符
            if(str2 == '2'){
                index = j ;                             //等于2的时候说明是正确答案
            }
        }
        $('dd').eq(index).attr('data-correct','true');


        row[count] = i;             //记录出现过的随机数
        console.log(row,i);

    }

    function GameOver(){
        $('.game').remove();    //移除
        var numGe = score - ((Math.floor(score/10))*10),//个位
            numShi = (score - ((Math.floor(score/100))*100) - numGe)/10;//十位数
            $('.wrap').append( '<div class="over"><img src="'+imgPath+'/active/images/xzqh/bg4.png"/><div class="score_wrap"><img src="'+imgPath+'/active/images/xzqh/bg5.png"/><p class="score"><img src="'+imgPath+'/active/images/xzqh/num'+numShi+'.png"/><img src="'+imgPath+'/active/images/xzqh/num0.png"/>  </p></div><div class="btnGroup"> <span class="btn" href="'+URL.index+'"><img src="'+imgPath+'/active/images/xzqh/bt2.png"/> </span><span class="btn" href="'+URL.hActiveHtm+'?page=allImgPage&active_name=qdbb"><img src="'+imgPath+'/active/images/xzqh/bt3.png"/> </span></div> </div>');

    }

    //微信分享
    function weiXinShare() {
        if (Common.inWeixin) {
            console.log(document.title);
            var inQuestion = location.href.match(/\?/i);

            var shareUrl = URL.site + URL.redPacketHtm + '?pid=' + pageConfig.pid+'&isShare=1',
                shareImgUrl = URL.imgPath + 'common/images/invite-redpag.png',
                desc = '邀请好友米酷一起玩耍吧~，红包，送不停~~~',
                shareOption = {
                    title: '快来米酷,摇一摇中红包啦', // 分享标题
                    desc: desc, // 分享描述
                    link: shareUrl, // 分享链接
                    type: 'link', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    imgUrl: shareImgUrl, // 分享图标
                },
                shareOptionTimeline = {
                    title: desc, // 分享标题
                    link: shareUrl, // 分享链接
                    imgUrl: shareImgUrl // 分享图标
                };

            WeiXin.hideMenuItems();
            WeiXin.showMenuItems();
            WeiXin.share(shareOption, shareOptionTimeline);
        }
    }
    init();
})