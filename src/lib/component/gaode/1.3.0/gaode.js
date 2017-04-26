(function(config) {
    var d = navigator.userAgent.toLowerCase().replace("", "+"),
        z = window,
        B = document;

    function D(a) {
        return -1 !== d.indexOf(a)
    }
    var aa = D("ucbrowser"),
        ba = D("micromessenger"),
        ca = D("mqqbrowser"),
        E = "ActiveXObject" in z,
        da = E && !z.XMLHttpRequest,
        ea = E && !B.querySelector,
        fa = E && !B.addEventListener,
        ga = E && D("ie 9"),
        ia = E && D("rv:11"),
        ja = z.navigator && z.navigator.msPointerEnabled && !!z.navigator.msMaxTouchPoints,
        ka = ja || D("touch") || "ontouchstart" in B,
        la = D("webkit"),
        chrome = D("chrome"),
        ma = D("firefox"),
        na = D("android"),
        oa = -1 !== d.search(/android( |\/)4\./),
        pa = -1 !== d.search(/android [23]/),
        qa = D("windows phone"),
        ra = "devicePixelRatio" in z && 1.4 < z.devicePixelRatio ||
        "matchMedia" in z && z.matchMedia("(min-resolution:144dpi)") && z.matchMedia("(min-resolution:144dpi)").matches,
        sa = D("ipad;"),
        ta = sa && ra,
        ua = D("ipod touch;"),
        va = D("iphone;"),
        wa = va || sa || ua,
        xa = (D(" os 7") || D(" os 8")) && wa,
        G = na || wa || qa || D("mobile") || "undefined" !== typeof orientation,
        ya = B.documentElement,
        za = E && "transition" in ya.style,
        Aa = !!B.createElementNS && !!B.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect,
        Ba = !!B.createElement("canvas").getContext,
        Ca = "WebKitCSSMatrix" in z && "m11" in new window.WebKitCSSMatrix,
        Da = "MozPerspective" in ya.style,
        Ea = "OTransition" in ya.style,
        Fa = za || Ca || Da || Ea,
        Ga = !G && D("windows nt") && -1 === d.search(/nt [67]\.[1-9]/),
        Ha;
    if (!(Ha = !Ba)) {
        var Ia;
        if (!(Ia = na && !(oa && (-1 !== d.search(/m351|firefox/) ? 0 : ba && ca ? -1 === d.search(/hm note|gt-/) : D("gt-n710") && -1 !== d.search(/android( |\/)4\.1/) ? 0 : -1 !== d.search(/ucbrowser\/((9\.[0-5]\.)|(10\.))/) ? -1 === d.search(/huawei( p6|h30)/) : D("baidubrowser") ? -1 === d.search(/hm201|sm-g900/) : -1 !== d.search(/lbbrowser|360|liebao|oupeng|mqqbrowser|sogou|micromessenger|chrome/) || !D("ucbrowser") && -1 !== d.search(/sm-n900|(gt-(n710|i95|p[67]))|(mi( [1-4]|-one))|(huawei( p6|_c8813|h30| g750))|lenovo k900|coolpad_9150/))))) {
            var Ja;
            if (Ja = va) {
                var Ka = screen.width;
                Ja = !(xa && (aa || ba ? !(375 < Ka) : D("safari")))
            }
            Ia = Ja || ua || ta || qa || E && !ia || G && ma
        }
        Ha = Ia
    }
    var La = Ha,
        ra = G && ra,
        Ma = !1;
    try {
        Ma = "undefined" !== typeof z.localStorage
    } catch (Na) {}
    config.e = {
        size: 150,
        Mm: D("macintosh"),
        Ol: D("baidubrowser"),
        gF: !0,
        le: E,
        fc: da,
        vi: ea,
        Yb: fa,
        IC: la,
        Km: Ma,
        he: na,
        BD: pa,
        Bn: aa,
        chrome: chrome,
        kr: ma,
        DE: za,
        JC: Ca,
        cE: Da,
        aF: Ea,
        Ox: Fa,
        da: G,
        ZE: G && la,
        rA: G && Ca,
        YE: G && z.opera,
        Oa: ka,
        cs: ja,
        EE: ga,
        wb: ra,
        He: Aa,
        Bm: Ba,
        Um: La,
        Sl: !La && !Ga,
        Tm: !Aa && G && Ba
    };
    var z = window,
        H = "http map anip layers overlay0 brender mrender".split(" ");
    config.jc = "main";
    config.e.Oa && (H.push("touch"), config.jc += "t");
    config.e.da || (H.push("mouse"), config.jc += "m");
    config.e.Um && !config.e.Tm ? (config.jc += "d", H.push("drender")) : (H.push("crender"), config.jc += "c", config.e.Sl && (config.jc += "v", H.push("vectorlayer", "overlay"), H.push("vp"), config.jc += "p"));
    H.push("sync");
    config.zt = H;
    window.AMap = window.AMap || {
        Fh: "1.3.6.5-1"
    };
    var Oa = window.AMap.En = {},
        Pa = config[2].split(",")[0],
        //Qa = Pa + "/theme/v" + config[4] + "/style.css",
        Ra = document.head || document.getElementsByTagName("head")[0];
    /*if (Ra) {
        var Sa = document.createElement("link");
        Sa.setAttribute("rel", "stylesheet");
        Sa.setAttribute("type", "text/css");
        Sa.setAttribute("href", Qa);
        Ra.insertBefore(Sa, Ra.firstChild)
    } else document.write("<link rel='stylesheet' href='" + Qa + "'/>");*/

    function Ta() {
        var a = Ua,
            b = document,
            c = b.createElement("script");
        c.charset = "utf-8";
        c.src = a;
        return (a = b.body || Ra) ? (a.appendChild(c), !0) : !1
    }
    var Va = (new Date).getTime();
    Oa.__load__ = function(a) {
        a(config, Va);
        delete Oa.__load__
    };
    try {
        if (window.localStorage) {
            var I = window.localStorage["_AMap_" + config.jc],
                Wa = !1;
            I ? (I = JSON.parse(I), I.version === window.AMap.Fh ? (eval(I.script), Oa.loaded = !0) : Wa = !0) : Wa = !0;
            if (Wa)
                for (var Xa in window.localStorage) window.localStorage.hasOwnProperty(Xa) && 0 === Xa.indexOf("_AMap_") && window.localStorage.removeItem(Xa)
        }
    } catch (Ya) {}
    if (!Oa.loaded) {
        var Ua = Pa + "/maps/main?v=" + config[4] + "&key=" + config[0] + "&m=" + config.zt.join(",");
        config[5] && Ta() || (document.write('<script id="a$m@p&j^s_" src=\'' + Ua + "' type='text/javascript'>\x3c/script>"), document.getElementById("a$m@p&j^s_") || Ta());
        delete config.zt
    };
})(["68a0bff0e024c317ac1ecda5ba7deb23", [118.344933, 29.188757, 120.721945, 30.566516, 120.153576, 30.287459], "http://webapi.amap.com", 1, "1.3"])
