/**
 * 专家端登录
 * Created by xiuxiu on 2016/7/13.
 */
require([
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data'
], function($,URL, Data) {

    var Page;

    function init(){
        $('.waitting').hide();
        sessionStorage.removeItem('membersListIM');
        Page = $('<div class="login-box"> <div class="login-logo"><b>9LAB私人管家</b></div> <div class="login-box-body"> <p class="login-box-msg">登录</p><div class="form-group"> <input type="text" name="username" class="form-control" placeholder="用户名" id="username"> <span class="icon user-icon"></span> </div> <div class="form-group"> <input type="password" name="password" class="form-control" placeholder="密码" id="password" > <span class="icon pswd-icon"></span> </div> <div class="checkbox icheck "> <label class="active">记住密码</label> </div> <button  class="btn" id="mysubmit">登录</button> </div></div>').appendTo('body');

        bindEvent()
    }

    function bindEvent(){
        Page.on('click','.icheck',function(){
            $(this).find('label').toggleClass('active');
        }).on('click','#mysubmit',function(){
            submitLogin()
        })

        $(document).keypress(function(event){
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if(keycode == '13'){
                console.log(1);
                submitLogin()
            }
        });

    }
    //登录
    function submitLogin(){
        var mysubmit= $('#mysubmit'),
            password= $('#password'),
            username=$('#username'),
            vusername =  username.val().trim(),
            vpassword = password.val().trim();
        if(!(vusername && vpassword))
        {
            bainx.broadcast('用户名和密码不能为空');
            return false;
        }
        var dataJudge={mobile:vusername}
        Data.checkIsExper(dataJudge).done(function(res){
            isExpert = res.isExpert;
            localStorage.setItem('isExpert',isExpert);
            judgeCsad(isExpert,vusername,vpassword)
        })
    }


    //登录判断是否专家
    function judgeCsad(isExpert,vusername,vpassword){
        require('plugin/jsencrypt/2.3.1/jsencrypt', function(JSEncrypt) {
            var encrypt = new JSEncrypt();
            var publicK = '-----BEGIN PUBLIC KEY-----\n' +
                'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCTevDTNKW0N9GO4UhGhFLjCV/9\n' +
                'JCWKgvkQSYs1BrR3Ak/z+Hvo3jIx7uZw8hTB4pnungvKju5ix9IGMf0M6J53tpiZ\n' +
                '1rGZh6HEPBdsUebuAeKGlgSkf2wqbtrxZ6Git9CybvmBAM34qzFCrajRKWBcAKHq\n' +
                '1bHkLQ/GRT1EDemt1wIDAQAB\n' +
                '-----END PUBLIC KEY-----';
            encrypt.setPublicKey(publicK);
             vpassword = encrypt.encrypt(vpassword);
            var data = {
                m: vusername,
                hp: vpassword
            }
            if (isExpert == 1 || isExpert == 2) {
                Data.loginFromPwd(data).done(function (res) {
                    var refurl = URL.param.refurl;
                    if(refurl){
                        URL.assign(refurl);
                    }
                    else{
                        URL.assign(URL.csadPage);
                    }

                })
            }
            else {
                bainx.broadcast('亲，您不是专家！');
            }
        })
    }
    init();
})