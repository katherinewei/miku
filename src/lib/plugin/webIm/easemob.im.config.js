define('plugin/webIm/easemob.im.config', [
    'plugin/webIm/easemob.im-1.1',
], function(Easemob) {
    var appkey = location.host == "test.unesmall.com" ? "mikusdp#ninelab" : "mikusdp#mikuandroid"

    Easemob.im.config = {
        /*
         The global value set for xmpp server
         */
        xmppURL: 'im-api.easemob.com',
        /*
         The global value set for Easemob backend REST API
         "http://a1.easemob.com"
         */
        apiURL: 'https://a1.easemob.com',
        /*
         连接时提供appkey
         */
        //appkey: "mikusdp#mikuandroid",
        appkey: appkey,
        /*
         * 是否使用https
         */
        https: true,
        /*
         * 是否使用多resource
         */
        multiResources: false

    }
    //console.log(Easemob.im.config.multiResources);
    return  Easemob.im.config
})
