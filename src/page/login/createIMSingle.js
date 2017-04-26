/**
 * 创建环信帐号跟分配私人管家
 * Created by xiuxiu on 2016/9/9.
 */
define('h5/js/page/createIMSingle',[
    'jquery',
    'h5/js/common/url',
    'h5/js/common/data'
],function($, URL, Data){

    var createIMSingle = function(callback,isLogin,sessionId){

        var currentUserIMLocal = localStorage.getItem('currentUserIM'),
            currentUserIM,
            currentCsadIM;
        if(isLogin || (!currentUserIMLocal && pageConfig.pid)){
             var bol = false,currentIMMsgData = [],currentCsadIMMsgData = [];
              Data.createNewIMUserSingle().done(function(res) {
                  var user = res.imUser.userName,
                      pass = res.imUser.password;
                  var data = {
                      emUserName:user
                  }
                  Data.getUserInfoIM(data).done(function(res){
                      var currentImg = res.headPic ? res.headPic : '',
                          currentIMMsg = [user,pass,res.nickName,res.mobile,currentImg];
                          currentIMMsgData = JSON.stringify(currentIMMsg);
                      localStorage.setItem('currentUserIM',currentIMMsgData);//保存用户信息

                      var getData = {};
                      if(sessionId){
                          getData.sessionId=sessionId;
                      }
                      Data.getOneCsad(getData).done(function(resCsad){
                          var info = resCsad.info,
                              currentCsadImg = info.csadPicUrl ? info.csadPicUrl : '',
                              currentCsadIMMsg = [resCsad.csad_em_user_name,info.csadName,info.csadTel,currentCsadImg];
                              currentCsadIMMsgData = JSON.stringify(currentCsadIMMsg);
                          localStorage.setItem('currentCsadIM',currentCsadIMMsgData);//保存专家信息
                          bol = true;
                          if(isLogin){
                              callback();
                          }
                      })
                  })
              })
            return {
                currentUserIM:currentIMMsgData,
                currentCsadIM:currentCsadIMMsgData
            }
        }
        if(currentUserIMLocal && !isLogin){
            currentUserIMLocal = JSON.parse(currentUserIMLocal);
            var currentCsadIMLocal = localStorage.getItem('currentCsadIM');
            currentCsadIMLocal  = JSON.parse(currentCsadIMLocal);
            return {
                currentUserIM:currentUserIMLocal,
                currentCsadIM:currentCsadIMLocal
            }
        }
    }
    return createIMSingle;
})

