var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
//imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
//notify = require('gulp-notify'),
//cache = require('gulp-cache'),
//livereload = require('gulp-livereload'),
    html2js = require('gulp-html-js-template'),
    del = require('del'),
    map = require('map-stream'),
    autofixConfig = {
        browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
        cascade: false
    },
    sassConfig = {
        style: 'expanded'
    },
//DIST = '../mpage/';
    DIST = '';

function myReporter(file, cb) {
    if (!file.jshint.success) {
        console.log('JSHINT fail in ' + file.path);
        file.jshint.results.forEach(function(reporter) {
            if (reporter) {
                console.log(reporter.error.id + ' ' + reporter.file + ': line ' + reporter.error.line + ', col ' + reporter.error.character + ', code ' + reporter.error.code + ', ' + reporter.error.reason + ', evidence ' + reporter.error.evidence);
            }
        });
    }
    cb(null, file);
}

function insertTimestamp(file, cb) {
    if (!file.isNull() && !file.isStream()) {
        var d = new Date();
        var ds = [d.getFullYear(), '/', d.getMonth() + 1, '/', d.getDate(), ' ', d.getHours(), ':', d.getMinutes(), ':', d.getSeconds(), '.', d.getMilliseconds()].join('');

        var content = [
            '/*************************************\n',
            ' * Author:\tsuperman\n',
            ' * Date:\t', ds, '\n',
            ' *************************************/\n',
            file.contents.toString()
        ].join('');
        file.contents = new Buffer(content);
    }
    //console.log(file, cb);
    return cb(null, file);
}

function cmd(command, cb) {
    var process = require('child_process');
    process.exec(command, function(error, stdout, stderr) {
        if (stdout) {
            console.log(stdout);
        }
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });
    return cb();
}

function script(res) {
    console.log(res);
    return function() {
        return gulp.src(res.src)
            .pipe(jshint())
            .pipe(map(myReporter))
            .pipe(gulp.dest(res.dist));
    }
}

function style(res) {
    console.log(res);
    return function() {
        return gulp.src(res.src)
            .pipe(sass(sassConfig))
            .pipe(autoprefixer(autofixConfig))
            .pipe(gulp.dest(res.dist));
    }
}

gulp.task('localtest-push', function(cb) {
    return cmd('./local-push.sh "local test"', cb);
});




gulp.task('lib-style', function() {
    var dist = DIST + 'h5/js/lib';
    console.log('lib-style-dist:' + dist);
    var ret = gulp.src('src/lib/**/*.css')
        .pipe(autoprefixer(autofixConfig));
    if (DIST) {
        ret = ret.pipe(minifycss());
    }
    return ret.pipe(gulp.dest(dist));
});
gulp.task('lib-script', function() {
    var dist = DIST + 'h5/js/lib';
    console.log('lib-script-dist:' + dist);
    var ret = gulp.src([
        'src/lib/**/*.js',
        '!src/lib/main.js'
    ]);
    if (DIST) {
        ret = ret.pipe(uglify());
    }
    ret.pipe(gulp.dest(dist));
    var common = 'src/common/script/';
    ret = gulp.src([
        //'src/lib/gallery/jquery/2.1.1/jquery.js',
        'src/lib/gallery/zepto/1.1.6/zepto.js',
        'src/lib/main.js',
        'src/lib/dist/msg/1.1.0/msg.js',
        'src/lib/arale/class/1.2.0/class.js',
        'src/lib/arale/events/1.2.0/events.js',
        'src/lib/arale/base/1.2.0/aspect.js',
        'src/lib/arale/base/1.2.0/attribute.js',
        'src/lib/arale/base/1.2.0/base.js',
        'src/lib/arale/widget/1.2.0/daparser.js',
        'src/lib/arale/widget/1.2.0/auto-render.js',
        'src/lib/arale/widget/1.2.0/widget.js',
        'src/lib/component/jweixin/1.0.0/jweixin.js',
        /*'src/lib/component/gaode/1.3.0/gaode.js',*/
        //common + '_template.js',
        common + 'url.js',
        common + 'data.js',
        common + 'common.js',
        common + 'banner.js',
        common + 'location.js',
        common + 'goods.js',
        common + 'cart.js',
        common + 'loadImage.js',
        common + 'countDown.js',
        common + 'checkMobile.js',
        common + 'translate.js',
        common + 'storage.js',
        common + 'dialog.js',
        common + 'shop.js',
        common + 'consignee.js',
        common + 'consigneeDialog.js',
        common + 'editConsigneeDialog.js',
        common + 'payer.js',
        common + 'waitting.js',
        common + 'weixin.js',
        common + 'questionData.js',
        common + 'point.js',
        common + 'nexter.js',
        common + 'coupon.js',
        common + 'event.js',
       // common + 'shareTips.js',
        common + '*.js',
        //'src/widget/page.js',

    ]).pipe(concat('main.js'));
    if (DIST) {
        ret = ret.pipe(uglify());
    }
    /*ret.pipe(gulp.dest('build/temp/'));
     gulp.src([
     'build/temp/**.*',
     'src/lib/component/jweixin/1.0.0/jweixin.js'
     ]).pipe(concat('main.js'))*/
    ret.pipe(gulp.dest(dist));

});
gulp.task('lib', function(cb) {
    return gulp.start('lib-style', 'lib-script', cb);
});


gulp.task('common-style', function() {
    var dist = DIST + 'h5/css/';
    console.log('common-style-dist:' + dist);
    var ret = gulp.src([
            'src/common/style/base.scss',
            'src/common/style/page.scss',
            'src/common/style/dialog.scss',
            'src/common/style/shopListDialog.scss',
            'src/common/style/locationDialog.scss',
            'src/common/style/mapDialog.scss'
        ])
        .pipe(sass(sassConfig))
        .pipe(autoprefixer(autofixConfig))
        .pipe(concat('common.css'));
    if (DIST) {
        ret = ret.pipe(minifycss());
    }
    return ret.pipe(gulp.dest(dist));
});
//gulp.task('common-script', ['template'], function() {
/*var dist = DIST + 'h5/js/';
 console.log('common-script-dist:'+dist);
 var ret = gulp.src([
 'src/common/script/_template.js',
 'src/common/script/url.js',
 'src/common/script/storage.js',
 'src/common/script/data.js',
 //'src/common/script/historyStorage.js',
 'src/common/script/common.js',
 'src/common/script/translate.js',
 'src/common/script/dialog.js',
 'src/common/script/loadImage.js',
 'src/common/script/shop.js',
 'src/common/script/*.js'
 ])
 .pipe(jshint())
 .pipe(map(myReporter))
 .pipe(concat('common.js'));
 if(DIST){
 ret = ret.pipe(uglify());
 }
 return ret.pipe(gulp.dest(dist));*/
//});
gulp.task('common', function() {
    return gulp.start('common-style');
});

gulp.task('widget-script', function() {
    var dist = DIST + 'h5/js/widget/';
    console.log('widget-script-dist:' + dist);
    var ret = gulp.src(['src/widget/**/*.js'])
        .pipe(jshint())
        .pipe(map(myReporter));
    if (DIST) {
        ret = ret.pipe(uglify());
    }
    return ret.pipe(gulp.dest(dist));
});

gulp.task('widget', function() {
    return gulp.start('widget-script');
});

gulp.task('font', function() {
    var dist = DIST + 'h5/fonts/';
    console.log('font-dist:' + dist);
    return gulp.src('src/fonts/**/*.*')
        .pipe(gulp.dest(dist));
});

gulp.task('page-script', function() {
    var dist = DIST + 'h5/js/page/';
    console.log('page-script-dist:' + dist);

    var ret = gulp.src([

            'src/page/address/address.js',
            'src/page/bindMobile/bindMobile.js',

            'src/page/community/community.js',
            'src/page/detail/detail.js',

            'src/page/editAddress/editAddress.js',
            'src/page/index/index.js',
            'src/page/orderDetail/orderDetail.js',
            'src/page/orderList/orderList.js',
            'src/page/placeOrder/placeOrder.js',
            'src/page/userCenter/userCenter.js',
            'src/page/login/login.js',
            'src/page/integral/integral.js',
            'src/page/coupon/coupon.js',
            'src/page/reqReturnGoodPage/reqReturnGoodPage.js',
            'src/page/returnGoodFlowPage/returnGoodFlowPage.js',
            'src/page/payResultPage/payResultPage.js',
            'src/page/register/register.js',
            'src/page/loginYzmPicPage/loginYzmPicPage.js',
            'src/page/logisticsInfoPage/logisticsInfoPage.js',
            'src/page/questionnaireSurveyPage/questionnaireSurveyPage.js',
            'src/page/questionnaireSurveyResultPage/questionnaireSurveyResultPage.js',
            'src/page/expertDetailPage/expertDetailPage.js',
            'src/page/questionnaireSurveyReportPage/questionnaireSurveyReportPage.js',
            'src/page/clearCachePage/clearCachePage.js',
            'src/page/userReportPage/userReportPage.js',
            'src/page/discoverPage/discoverPage.js',
            'src/page/addArticlePage/addArticlePage.js',
            'src/page/createMineBoxPage/createMineBoxPage.js',
            'src/page/articleInfoPage/articleInfoPage.js',
            'src/page/articleDetailPage/articleDetailPage.js',
            'src/page/discoverPersonalCenterPage/discoverPersonalCenterPage.js',
            'src/page/discoverMessageListPage/discoverMessageListPage.js',
            'src/page/focusListPage/focusListPage.js',
            'src/page/fansListPage/fansListPage.js',
            'src/page/createCirclePage/createCirclePage.js',
            'src/page/circleListPage/circleListPage.js',
            'src/page/collectionArticleListPage/collectionArticleListPage.js',
            'src/page/circleDetailPage/circleDetailPage.js',
            'src/page/addBoxRecodePage/addBoxRecodePage.js',
            'src/page/csadPage/csadPage.js',
            'src/page/editBoxRecodePage/editBoxRecodePage.js',
            'src/page/scanCodeCashPage/scanCodeCashPage.js',
            'src/page/loginPage/loginPage.js',
            'src/page/csadPage/csadAddBoxRecodePage.js',
            'src/page/csadPage/csadCommon.js',
            'src/page/csadPage/csadManagementListPage.js',
            'src/page/csadPage/csadSalesTrackingPage.js',
            'src/page/csadPage/csadHoneymoonReturnPage.js',
            'src/page/csadPage/csadGroup.js',
            'src/page/csadPage/csadUserTrajectory.js',
            'src/page/csadPage/csadQuestionnaireSurveyPage.js',
            'src/page/csadPage/csadDirectionCenter.js',
            'src/page/csadPage/csadAddNotes.js',
            'src/page/csadPage/csadCreateMineBoxPage.js',
            'src/page/csadPage/csadUserMessage.js',
            'src/page/csadPage/imageMagnification.js',
            'src/page/csadPage/dragFn.js',
            'src/page/csadPage/courseTemplatePage.js',
            'src/page/csadPage/csadViewUserLog.js',
            'src/page/anonymousChatPage/anonymousChatPage.js',
            'src/page/anonymousChatPage/anonyCommon.js',
            'src/page/anonymousChatPage/anonyExtend.js',
            'src/page/login/createIMSingle.js',
            'src/page/boxDetailPage/boxDetailPageComm.js',
            'src/page/boxDetailPage/boxDetailPage.js',
            'src/page/getDetectRecord/getDetectRecord.js',
            'src/page/getXmDetailPage/getXmDetailPage.js',
            'src/page/buyedBoxListPage/buyedBoxListPage.js',
            'src/page/anonymousChatPage/shareCommon.js',
            'src/page/anonymousChatPage/waittingH.js',
            'src/page/discoverPage/commentEntrance.js',
            'src/page/experienceShopListPage/experienceShopListPage.js',
            'src/page/experienceShopDetailPage/experienceShopDetailPage.js',
            'src/page/experienceShopCommentPage/experienceShopCommentPage.js',
            'src/page/commentEntrance/commentEntrance.js',
            'src/page/addExperienceShopCommentPage/addExperienceShopCommentPage.js',
            'src/page/scanShopQrCodePage/scanShopQrCodePage.js',
            'src/page/scanQrLoginPage/scanQrLoginPage.js',
            'src/page/createQrCodeLoginPage/createQrCodeLoginPage.js',
            'src/page/createQrCodeLoginPage/frameBox.js',
            'src/page/qrCodeLoginTipPage/qrCodeLoginTipPage.js',
            'src/page/articleFocusListPage/articleFocusListPage.js',
            'src/page/skinUserInfoPage/skinUserInfoPage.js',
            'src/page/skinCheckedPage/skinCheckedPage.js',
            'src/page/skinPicComparePage/skinPicComparePage.js',
            'src/page/skinCheckReportPage/skinCheckReportPage.js',
            'src/page/expertWxQrcodePage/expertWxQrcodePage.js',
            'src/page/expertRegisterPage/expertRegisterPage.js',
            'src/page/checkScanCodeIsScan/checkScanCodeIsScan.js',
            'src/page/csadPage/csadCreateOrder.js',
            'src/page/csadPage/csadPerformanceQuery.js',
            'src/page/csadPage/csadSelfInformation.js',
            'src/page/websitePageWxnoPage/websitePageWxnoPage.js',
            'src/page/appCsadPage/appCsadPage.js',
            'src/page/appCsadPage/appCsadCallCenterPage.js',
            'src/page/appCsadPage/appCsadChatMessagePage.js',
            'src/page/appCsadPage/appCsadCommon.js',
            'src/page/appCsadPage/appCsadGroup.js',
            'src/page/checkIsExperPage/checkIsExperPage.js',
            'src/page/csadPage/csadDeliveryList.js',
            'src/page/csadPage/reissueOrder.js',


        ])
        .pipe(jshint())
        .pipe(map(myReporter));
    if (DIST) {
        ret = ret.pipe(uglify());
        /*gulp.src(['src/page/detail/detail2.min.js'])
         .pipe(rename('detail2.js'))
         .pipe(gulp.dest(dist));*/
        //gulp.src(['src/lib/plugin/slider/1.0.0/slider.js', 'src/page/index/index.js'])
        //    .pipe(concat('index.js'))
        //    .pipe(uglify())
        //    .pipe(gulp.dest(dist));
    } else {
        /* gulp.src(['src/page/detail/detail2.js'])
         .pipe(gulp.dest(dist));*/
        //gulp.src(['src/lib/plugin/slider/1.0.0/slider.js', 'src/page/index/index.js'])
        //    .pipe(concat('index.js'))
        //    .pipe(gulp.dest(dist));
    }

    gulp.src('src/page/integral/audit-note.html').pipe(gulp.dest(DIST + 'h5/html/'));
    gulp.src('src/page/integral/point-guide.html').pipe(gulp.dest(DIST + 'h5/html/'));
    gulp.src('src/html/test/swap.html').pipe(gulp.dest(DIST + 'h5/html/'));
    gulp.src('src/html/profit-help.html').pipe(gulp.dest(DIST + 'h5/html/'));
    gulp.src('src/html/test/map.html').pipe(gulp.dest(DIST + 'h5/html/'));
    gulp.src('src/html/test/newuser.html').pipe(gulp.dest(DIST + 'h5/html'));
    gulp.src('src/html/appleTiaoLi.html').pipe(gulp.dest(DIST + 'h5/html'));
    gulp.src('src/html/aboutUs.html').pipe(gulp.dest(DIST + 'h5/html'));
    gulp.src('src/html/businessDepartment.html').pipe(gulp.dest(DIST + 'h5/html'));
    gulp.src('src/html/download.html').pipe(gulp.dest(DIST + 'h5/html'));
    gulp.src('src/html/faq.html').pipe(gulp.dest(DIST + 'h5/html'));
    gulp.src('src/html/qualityAssurance.html').pipe(gulp.dest(DIST + 'h5/html'));
    gulp.src('src/html/downloadLink.html').pipe(gulp.dest(DIST + 'h5/html'));
    gulp.src('src/html/returnPolicy.html').pipe(gulp.dest(DIST + 'h5/html'));
    gulp.src('src/html/howtoAttention.html').pipe(gulp.dest(DIST + 'h5/html'));
    gulp.src('src/html/howToView.html').pipe(gulp.dest(DIST + 'h5/html'));
    gulp.src('src/html/howToMakeMoney.html').pipe(gulp.dest(DIST + 'h5/html'));
    gulp.src('src/html/kjssxzc.html').pipe(gulp.dest(DIST + 'h5/html'));




    return ret.pipe(gulp.dest(dist)); //ret.pipe(map(insertTimestamp))
});
gulp.task('page-style', function() {
    var dist = DIST + 'h5/css/page/';
    console.log('page-style-dist:' + dist);
    var files = [
        'address', 'detail', 'editAddress',
        'index',  'login', 'orderDetail', 'orderList', 'placeOrder', 'userCenter', 'integral',
        'coupon', 'contactUsPage',
        'reqReturnGoodPage', 'returnGoodFlowPage', 'payResultPage', 'register', 'loginYzmPicPage', 'returnSaleRecord','logisticsInfoPage','questionnaireSurveyPage','questionnaireSurveyResultPage','expertDetailPage','questionnaireSurveyReportPage','userReportPage','discoverPage','addArticlePage','createMineBoxPage','articleInfoPage','articleDetailPage','discoverMessageListPage','discoverPersonalCenterPage','focusListPage','fansListPage','createCirclePage','circleListPage','collectionArticleListPage','circleDetailPage','addBoxRecodePage','csadPage','editBoxRecodePage','scanCodeCashPage','loginPage','csadCssZy','courseTemplatePage','anonymousChatPage','boxDetailPage','getDetectRecord','getXmDetailPage','buyedBoxListPage','experienceShopCommentPage','experienceShopDetailPage','experienceShopListPage','addExperienceShopCommentPage','mapPage','scanShopQrCodePage','scanQrLoginPage','createQrCodeLoginPage','qrCodeLoginTipPage','articleFocusListPage','skinUserInfoPage','skinCheckedPage','skinPicComparePage','skinCheckReportPage','expertWxQrcodePage','expertRegisterPage','checkScanCodeIsScan','websitePageWxnoPage','appCsadPage','checkIsExperPage'

    ];
    for (var i = 0, len = files.length; i < len; i++) {
        files[i] = 'src/page/' + files[i] + '/' + files[i] + '.scss';
    }
    var ret = gulp.src(files)
        .pipe(sass(sassConfig))
        .pipe(autoprefixer(autofixConfig));
    if (DIST) {
        ret = ret.pipe(minifycss());
    }
    return ret.pipe(gulp.dest(dist));

});

gulp.task('page', function() {
    return gulp.start('page-script', 'page-style');
});

/*gulp.task('template', function() {
 return gulp.src('src/template/*.tpl')
 .pipe(html2js())
 .pipe(concat('_template.js'))
 .pipe(gulp.dest('src/common/script/'));
 });*/





gulp.task('watch', function() {
    gulp.watch('src/lib/**/*.js', ['lib-script']);
    gulp.watch('src/lib/**/*.css', ['lib-style']);
    gulp.watch('src/common/style/*.scss', ['common-style']);
    gulp.watch('src/common/script/*.js', ['lib-script']);
    gulp.watch('src/fonts/*.*', ['font']);
    gulp.watch('src/page/**/*.js', ['page-script']);
    gulp.watch('src/page/**/*.scss', ['page-style']);
    //gulp.watch('src/template/*.tpl', ['common-script']);
    gulp.watch('src/widget/**/*.js', ['widget-script']);
    gulp.watch('src/html/*.html',['html']);
});

gulp.task('clean', function(cb) {
    return del('h5', cb);
});

gulp.task('test', function(cb) {
    return gulp.src('src/html/**/*.html').pipe(gulp.dest('h5/html/'));
});

gulp.task('html', function(cb){
    return gulp.src('src/html/*.html').pipe(gulp.dest('h5/html/'));
});

gulp.task('default', ['clean'], function(cb) {
    return gulp.start('lib', 'font', 'common', 'page', 'widget','html');
});

gulp.task('release', ['clean'], function() {
    DIST = './';
    return gulp.start('font', 'common', 'page', 'widget', 'lib','html');
});





var imageDataURI = require('gulp-image-data-uri');
var path = require('path');
gulp.task('image-data', function() {

    gulp.src('src/images/*')
        .pipe(imageDataURI({
            customClass: function(className, file) {
                var customClass = 'icons-' + className; // add prefix

                // add suffix if the file is a GIF
                if (path.extname(file.path) === '.gif') {
                    customClass += '-gif';
                }

                return customClass;
            }
        }))
        .pipe(concat('icons-image.css'))
        .pipe(gulp.dest('./dist/'));
});


function Task(name, src, dist, release) {
    var ret = gulp.src(src).pipe(jshint()).pipe(map(myReporter)).pipe(concat(name + '.js'));
    if (release) {
        ret = ret.pipe(uglify());
    }
    return ret.pipe(gulp.dest('h5/js/' + dist));
}


gulp.task('script', function(cb) {
    Task('common', [], '', release);
    Task('active', [], 'page/', release);
    Task('address', [], 'page/', release);
    Task('allyExamineAttention', [], 'page/', release);
    Task('allyOrderList', [], 'page/', release);
    Task('cart', [], 'page/', release);
    Task('coupon', [], 'page/', release);
    Task('detail', [], 'page/', release);
    Task('halfPrice', [], 'page/', release);
    Task('help', [], 'page/', release);
    Task('index', [], 'page/', release);
    Task('itemCommentsPage', [], 'page/', release);
    Task('integral', [], 'page/', release);
    Task('list', [], 'page/', release);
    Task('login', [], 'page/', release);
    Task('lottery', [], 'page/', release);
    Task('lotteryList', [], 'page/', release);
    Task('lotteryOrder', [], 'page/', release);
    Task('myAlly', [], 'page/', release);
    Task('myInOrDirectAlly', [], 'page/', release);
    Task('orderDetail', [], 'page/', release);
    Task('orderList', [], 'page/', release);
    Task('placeOrder', [], 'page/', release);
    Task('userCenter', [], 'page/', release);
    Task('profit', [], 'page/', release);
    Task('rebateIntro', [], 'page/', release);
    Task('shareIntro', [], 'page/', release);
    Task('buySend', [], 'page/', release);
    Task('reqReturnGoodPage', [], 'page/', release);
    Task('returnGoodFlowPage', [], 'page/', release);
    Task('wordOfMouthPage', [], 'page/', release);
});
