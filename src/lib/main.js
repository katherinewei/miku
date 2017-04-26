var imgPath = 'http://ninelab.b0.upaiyun.com/'; //图片存放路径   生产环境:mikumine
var nowTime = 0;   //系统时间

/**
 * @name:       bainx-js
 * @author:     superman
 * @version:    v2.5.0
 * @buildTime:  Wed Nov 12 2014 13:34:59 GMT+0800 (中国标准时间)
 */
(function(global, document, S, undefined) {

    var location = global.location,

        ua = navigator.userAgent,

        documentElement = document.documentElement,

        head = document.head || document.getElementsByTagName("head")[0] || documentElement,

        isSupportConsole = global.console && console.log,

        noop = function() {},


        error = function (msg) {
            throw isError(msg) ? msg : new Error(msg);
        },

        /**
         * 配置getter/setter
         * @type {Object}
         */
        ConfigFns = {},

        /**
         * 配置对象
         * @type {Object}
         */
        Config = {
            debug: location.search.indexOf("debug") !== -1 ? true : false,
            fns: ConfigFns
        },

        _config = function(key, value) {
            var self = S,
                Config = self.Config,
                fns = Config.fns,
                fn,
                ret = self;

            if (isString(key)) {
                fn = fns[key];
                // get config
                if (value === undefined) {
                    ret = fn ? fn.call(self) : Config[key];
                } else { // set config
                    if (fn) {
                        ret = fn.call(self, value);
                    } else {
                        Config[key] = value;
                    }
                }
            } else {
                // Object config
                each(key, function(v, k) {
                    fn = fns[k];
                    if (fn) {
                        fn.call(self, v);
                    } else {
                        Config[k] = v;
                    }
                });
            }

            return ret;
        };

    S = global[S] = {

        version: "2.5",

        /**
         * 在log环境下输出log信息，避免因为忘记删除log语句而引发错误
         * @param  {String} msg 消息
         * @param  {String} src 消息来源，可选
         * @return {Object}     返回this以链式调用，如S.log().log()
         */
        log: isSupportConsole ? function(msg, src) {
            if (S.config("debug")) {
                if (src) {
                    msg = src + ": " + msg;
                }
                console.log(msg);
            }

            return S;
        } : noop,

        /**
         * Throws error message.
         */
        error: error,

        /**
         * global对象，在浏览器环境中为window
         * @type {Object}
         */
        global: global,

        /**
         * 空函数，在需要使用空函数作为参数时使用
         */
        noop: noop,

        Config: Config,

        config: _config
    };

    /**
     * 语言扩展
     */
    var AP = Array.prototype,

        SP = String.prototype,

        FP = Function.prototype,

        class2type = {},

        toString = class2type.toString,

        hasOwn = class2type.hasOwnProperty,

        slice = AP.slice,

        hasOwnProperty = function(o, p) {
            return hasOwn.call(o, p);
        },

        rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

    //切割字符串为一个个小块，以空格或逗号分开它们，结合replace实现字符串的forEach
        rword = /[^, ]+/g,

    // 是否是复杂类型
    // rcomplexType = /^(?:object|array)$/,

        rtags = /<[^>]+>/img,

        rsubstitute = /\\?\{\{\s*([^{}\s]+)\s*\}\}/mg,

        /**
         * return false终止循环
         * 原生every必须return true or false
         */
        each = function(object, fn, context) {
            var i = 0,
                length = object.length;

            if (context) {
                fn = fn.bind(context);
            }
            if (length === +length) {
                for (; i < length; i++) {
                    if (fn(object[i], i, object) === false) {
                        break;
                    }
                }
            } else {
                for (i in object) {
                    if (hasOwnProperty(object, i) && (fn(object[i], i, object) === false)) {
                        break;
                    }
                }
            }
        };

    /**
     * Object.keys
     * 不支持enum bug
     */
    if (!Object.keys) {
        Object.keys = function(o) {
            var ret = [],
                p;

            for (p in o) {
                if (hasOwnProperty(o, p)) {
                    ret.push(p);
                }
            }

            return ret;
        };
    }

    if (!FP.bind) {
        FP.bind = function(context) {
            var args = slice.call(arguments, 1),
                fn = this,
                noop = function() {},
                ret = function() {
                    return fn.apply(this instanceof noop? this : context || global, args.concat(slice.call(arguments)));
                };

            noop.prototype = fn.prototype;
            ret.prototype = new noop();
            return ret;
        };
    }

    /**
     * Date.now
     */
    if (!Date.now) {
        Date.now = function() {
            return +new Date();
        };
    }

    if (!SP.trim) {
        SP.trim = function() {
            return this.replace(rtrim, "");
        };
    }

    if (!SP.startsWith) {
        SP.startsWith = function(search) {
            return this.lastIndexOf(search, 0) === 0;
        };
    }

    if (!SP.endsWith) {
        SP.endsWith = function(search) {
            var index = this.length - search.length;
            return index >= 0 && this.indexOf(search, index) === index;
        };
    }


    /*
     * array shim
     * Array.prototype.every
     * Array.prototype.filter
     * Array.prototype.forEach
     * Array.prototype.indexOf
     * Array.prototype.lastIndexOf
     * Array.prototype.map
     * Array.prototype.some
     * Array.prototype.reduce
     * Array.prototype.reduceRight
     * Array.isArray
     */
    if (!AP.forEach) {
        AP.forEach = function(fn, context) {
            var i = 0,
                length = this.length;

            for (; i < length; i++) {
                fn.call(context, this[i], i, this);
            }
        };
    }

    if (!AP.map) {
        AP.map = function(fn, context) {
            var ret = [],
                i = 0,
                length = this.length;

            for (; i < length; i++) {
                ret.push(fn.call(context, this[i], i, this));
            }
            return ret;
        };
    }

    if (!AP.filter) {
        AP.filter = function(fn, context) {
            var ret = [],
                i = 0,
                length = this.length,
                item;

            for (; i < length; i++) {
                item = this[i];
                if (fn.call(context, item, i, this)) {
                    ret.push(item);
                }
            }
            return ret;
        };
    }

    if (!AP.some) {
        AP.some = function(fn, context) {
            var i = 0,
                length = this.length;

            for (; i < length; i++) {
                if (fn.call(context, this[i], i, this)) {
                    return true;
                }
            }
            return false;
        };
    }

    if (!AP.every) {
        AP.every = function(fn, context) {
            var i = 0,
                length = this.length;

            for (; i < length; i++) {
                if (!fn.call(context, this[i], i, this)) {
                    return false;
                }
            }
            return true;
        };
    }

    if (!AP.indexOf) {
        AP.indexOf = function(searchElement, fromIndex) {
            var ret = -1,
                i,
                length = this.length;

            i = fromIndex * 1 || 0;
            i = i >= 0 ? i : Math.max(0, length + i);

            for (; i < length; i++) {
                if (this[i] === searchElement) {
                    return i;
                }
            }
            return ret;
        };
    }

    if (!AP.lastIndexOf) {
        AP.lastIndexOf = function(searchElement, fromIndex) {
            var ret = -1,
                length = this.length,
                i = length - 1;

            fromIndex = fromIndex * 1 || length - 1;
            i = Math.min(i, fromIndex);

            for (; i > -1; i--) {
                if (this[i] === searchElement) {
                    return i;
                }
            }
            return ret;
        };
    }

    if (!AP.reduce) {
        AP.reduce = function(fn, initialValue) {
            var previous = initialValue,
                i = 0,
                length = this.length;

            if (initialValue === undefined) {
                previous = this[0];
                i = 1;
            }

            for (; i < length; i++) {
                previous = fn(previous, this[i], i, this);
            }
            return previous;
        };
    }

    if (!AP.reduceRight) {
        AP.reduceRight = function(fn, initialValue) {
            var length = this.length,
                i = length - 1,
                previous = initialValue;

            if (initialValue === undefined) {
                previous = this[length - 1];
                i--;
            }
            for (; i > -1; i--) {
                previous = fn(previous, this[i], i, this);
            }
            return previous;
        };
    }

    "Boolean Number String Function Array Date RegExp Object Error".replace(rword, function(name, lc) {
        class2type["[object " + name + "]"] = (lc = name.toLowerCase());
        S["is" + name] = function(o) {
            return type(o) === lc;
        };
    });

    var isArray = Array.isArray = S.isArray = Array.isArray || S.isArray,
        isFunction = S.isFunction,
        isObject = S.isObject,
        isString = S.isString,
        isError = S.isError,
        isDate = S.isDate,

        isNotEmptyString = function(val) {
            return isString(val) && val !== "";
        },

        memoize = function(fn, hasher) {
            var memo = {};

            // 默认拿第一个传入的参数做key
            hasher = hasher || function(val) {
                    return val;
                };

            return function() {
                var args = arguments,
                    key = hasher.apply(this, args),
                    val = memo[key];

                // 必须有返回结果才缓存
                return hasOwnProperty(memo, key) && val != null ? memo[key] : (memo[key] = fn.apply(this, args));
            };
        },

        /**
         * 单例模式
         * return only one instance
         * @param  {Function} fn      the function to return the instance
         * @param  {object}   context
         * @return {Function}
         */
        singleton = function(fn, context) {
            if (context) {
                fn = fn.bind(context);
            }
            return memoize(fn, function() {
                return 1;
            });
        },

        /**
         * {{ name }} -> {{ o[name] }}
         * \{{}} -> \{{}}
         * reserve 是否保留{{ var }}来进行多次替换, 默认不保留，即替换为空
         */
        substitute = function(str, o, reserve) {
            if (!isString(str) && !isArray(o) && !isPlainObject(o)) {
                return str;
            }

            return str.replace(rsubstitute, function(match, name) {
                if (match.charAt(0) === '\\') {
                    return match.slice(1);
                }
                return (o[name] == null) ? reserve ? match : "" : o[name];
            });
        },

        /**
         * jQuery type()
         */
        type = function(object) {
            if (object == null ) {
                return object + "";
            }

            var t = typeof object;
            return t === "object" || t === "function" ?
            class2type[toString.call(object)] || "object" :
                t;
        },

        isWindow = function(object) {
            return object != null && object == object.window;
        },

        isPlainObject = function(object) {
            // Must be an Object.
            // Because of IE, we also have to check the presence of the constructor property.
            // Make sure that Dom nodes and window objects don't pass through, as well
            if (!isObject(object) || object.nodeType || isWindow(object)) {
                return false;
            }

            var key, constructor;

            try {
                // Not own constructor property must be Object
                if ((constructor = object.constructor) && !hasOwnProperty(object, "constructor") && !hasOwnProperty(constructor.prototype, "isPrototypeOf")) {
                    return false;
                }
            } catch (e) {
                // IE8,9 Will throw exceptions on certain host objects
                return false;
            }

            // Own properties are enumerated firstly, so to speed up,
            // if last one is own, then all properties are own.
            for (key in object) {}

            return key === undefined || hasOwnProperty(object, key);
        },

        makeArray = function(o) {
            if (o == null) {
                return [];
            }
            if (isArray(o)) {
                return o;
            }

            var ret = [],
                i = 0,
                length = o.length,
                lengthType = type(length),
                oType = type(o);

            if (lengthType !== "number" || typeof o.nodeName === "string" || isWindow(o) || oType === "string" || oType === "function" && !("item" in o && lengthType === "number")) {
                return [o];
            }
            for (; i < length; i++) {
                ret[i] = o[i];
            }
            return ret;
        },

        extend = function() {
            var src, copyIsArray, copy, name, options, clone,
                target = arguments[0] || {},
                i = 1,
                length = arguments.length,
                deep = false;

            // Handle a deep copy situation
            if (typeof target === "boolean") {
                deep = target;

                // skip the boolean and the target
                target = arguments[i] || {};
                i++;
            }

            // Handle case when target is a string or something (possible in deep copy)
            if (typeof target !== "object" && !isFunction(target)) {
                target = {};
            }

            // extend itself if only one argument is passed
            if (i === length) {
                target = S;
                i--;
            }

            for (; i < length; i++) {
                // Only deal with non-null/undefined values
                if ((options = arguments[i]) != null) {
                    // Extend the base object
                    for (name in options) {
                        src = target[name];
                        copy = options[name];

                        // Prevent never-ending loop
                        if (target === copy) {
                            continue;
                        }

                        // Recurse if we're merging plain objects or arrays
                        if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
                            if (copyIsArray) {
                                copyIsArray = false;
                                clone = src && isArray(src) ? src : [];
                            } else {
                                clone = src && isPlainObject(src) ? src : {};
                            }

                            // Never move original objects, clone them
                            target[name] = extend(deep, clone, copy);

                            // Don't bring in undefined values
                        } else if (copy !== undefined) {
                            target[name] = copy;
                        }
                    }
                }
            }

            // Return the modified object
            return target;
        },

        /**
         * 判断两个变量是否相等
         * 数字特殊情况不做判断 如0 == -0
         * regexp不特殊判断
         */
        isEqual = function(a, b) {

            var ret = a === b,
                aType,
                bType;

            if (ret || (a == null || b == null)) {
                return ret;
            }

            aType = type(a);
            bType = type(b);
            /**
             * type不同即不相等
             */
            if (aType !== bType) {
                return false;
            }

            switch (aType) {
                case "array":
                case "object":
                    return compareObject(a, b);
            /**
             * new String("a")
             */
                case "string":
                    return a == String(b);
                case "number":
                    return ret;
                case "date":
                case "boolean":
                    return +a == +b;
            }

            return ret;
        },

        compareObject = function(a, b) {
            var p;

            for (p in b) {
                if (!hasOwnProperty(a, p) && hasOwnProperty(b, p)) {
                    return false;
                }
            }
            for (p in a) {
                if (!hasOwnProperty(b, p) && hasOwnProperty(a, p)) {
                    return false;
                }
            }
            for (p in b) {
                if (!isEqual(a[p], b[p])) {
                    return false;
                }
            }
            if (isArray(a) && isArray(b) && a.length !== b.length) {
                return false;
            }
            return true;
        },

        cidGenerator = function(prefix) {
            prefix = prefix || 0;

            var counter = 0;
            return function() {
                return prefix + counter++;
            };
        },

        ucfirst = function(str) {
            return str.charAt(0).toUpperCase() + str.substring(1);
        },

        htmlEntities = {
            "&amp;": "&",
            "&gt;": ">",
            "&lt;": "<",
            "&#x60;": "`",
            "&#x2F;": "/",
            "&quot;": '"',
            "&#x27;": "'"
        },
        reverseEntities = {},
        getEscapeReg = singleton(function() {
            var str = "";
            each(htmlEntities, function(entity) {
                str += entity + "|";
            });
            str = str.slice(0, -1);
            return new RegExp(str, "g");
        }),
        getUnEscapeReg = singleton(function() {
            var str = "";
            each(reverseEntities, function(entity) {
                str += entity + "|";
            });
            str += "&#(\\d{1,5});";

            return new RegExp(str, "g");
        }),
        escapeHtml = function(text) {
            return (text + "").replace(getEscapeReg(), function(all) {
                return reverseEntities[all];
            });
        },
        unEscapeHtml = function(text) {
            return (text + "").replace(getUnEscapeReg(), function(all) {
                return htmlEntities[all];
            });
        };

    each(htmlEntities, function(entity, k) {
        reverseEntities[entity] = k;
    });

    extend({

        each: each,

        mix: extend,

        extend: extend,

        isWindow: isWindow,

        isPlainObject: isPlainObject,

        isEqual: isEqual,

        type: type,

        makeArray: makeArray,

        memoize: memoize,
        singleton: singleton,

        cidGenerator: cidGenerator,
        uniqueCid: cidGenerator(),

        isNotEmptyString: isNotEmptyString,

        ucfirst: ucfirst,

        random: function(min, max) {
            var array, seed;

            if (isArray(min)) {
                array = min;
                min = 0;
                max = array.length - 1;
            }
            if (max == null) {
                max = min;
                min = 0;
            }
            seed = min + Math.floor(Math.random() * (max - min + 1));
            return array ? array[seed] : seed;
        },

        /**
         * [later description]
         * @param  {Function} fn       要执行的函数
         * @param  {number}   when     延迟时间
         * @param  {boolean}   periodic 是否周期执行
         * @param  {object}   context  context
         * @param  {Array}   data     传递的参数
         * @return {object}            timer，cancel and interval
         */
        later: function(fn, when, periodic, context, data) {
            when = when || 0;
            var m = fn,
                d = makeArray(data),
                f,
                r;

            if (isString(fn)) {
                m = context[fn];
            }

            if (!m) {
                S.error("later: method undefined");
            }

            f = function() {
                m.apply(context, d);
            };

            r = (periodic) ? setInterval(f, when) : setTimeout(f, when);

            return {
                id: r,
                interval: periodic,
                cancel: function() {
                    if (this.interval) {
                        clearInterval(r);
                    } else {
                        clearTimeout(r);
                    }
                }
            };
        },

        /**
         * 在underscore里面有实现，这个版本借鉴的是kissy
         */
        throttle: function(fn, ms, context) {
            context = context || this;
            ms = ms || 150;

            if (ms === -1) {
                return fn.bind(context);
            }

            var last = Date.now();

            return function() {
                var now = Date.now();
                if (now - last > ms) {
                    last = now;
                    fn.apply(context, arguments);
                }
            };
        },

        debounce: function(fn, ms, context) {
            context = context || this;
            ms = ms || 150;

            if (ms === -1) {
                return fn.bind(context);
            }
            var timer = null,
                f = function() {
                    f.stop();
                    timer = S.later(fn, ms, 0, context, arguments);
                };

            f.stop = function() {
                if (timer) {
                    timer.cancel();
                    timer = 0;
                }
            };
            return f;
        },

        substitute: substitute,
        tpl : substitute,

        /**
         * 对字符串进行截断处理
         */
        truncate: function(str, length, truncation) {
            str += "";
            truncation = truncation || "...";

            return str.length > length ? str.slice(0, length - truncation.length) + truncation : str;
        },

        stripTags: function(str) {
            return (str + "").replace(rtags, "");
        },

        escapeHtml: escapeHtml,
        unEscapeHtml: unEscapeHtml
    });



    /**
     * Uri 相关
     */
    var encode = encodeURIComponent,

        decode = function(s) {
            return decodeURIComponent(s.replace(/\+/g, " "));
        },

        param = function(o, sep, eq) {
            sep = sep || "&";
            eq = eq || "=";

            var buf = [];
            each(o, function(val, key) {
                key = encode(key);
                if (isValidParamValue(val)) {
                    buf.push(key);
                    if (val !== undefined) {
                        buf.push(eq, encode(val));
                    }
                    buf.push(sep);
                }
            });

            buf.pop();
            return buf.join("");
        },

        /**
         * query字符串转为对象
         */
        unparam = function(str, sep, eq) {
            str = (str + "").trim();
            sep = sep || "&";
            eq = eq || "=";

            var ret = {},
                eqIndex,
                pairs = str.split(sep),
                key,
                val,
                i = 0,
                length = pairs.length;

            if (!str) {
                return ret;
            }

            for (; i < length; ++i) {
                eqIndex = pairs[i].indexOf(eq);
                if (eqIndex == -1) { // 没有=
                    key = decode(pairs[i]);
                    val = undefined;
                } else {
                    // remember to decode key!
                    key = decode(pairs[i].substring(0, eqIndex));
                    val = pairs[i].substring(eqIndex + 1);
                    try {
                        val = decode(val);
                    } catch (e) {
                        error(e);
                    }
                }
                ret[key] = val;
            }
            return ret;
        },

        ruri = new RegExp([
            "^",
            "(?:",
            "([^:/?#]+)", // scheme
            ":)?",
            "(?://",
            "(?:([^/?#]*)@)?", // credentials
            "([^/?#:@]*)", // domain
            "(?::([0-9]+))?", // port
            ")?",
            "([^?#]+)?", // path
            "(?:\\?([^#]*))?", // query
            "(?:#(.*))?", // fragment
            "$",
        ].join("")),

        uriInfo = {
            scheme: 1,
            credentials: 2,
            domain: 3,
            port: 4,
            path: 5,
            query: 6,
            fragment: 7
        },

        getComponents = function(uri) {
            uri = uri || location.href;

            var m = uri.match(ruri) || [],
                ret = {};

            each(uriInfo, function(index, key) {
                // 默认为""
                ret[key] = m[index] || "";
            });

            return ret;
        },

        Query = function(query) {
            this._query = query;
            this._map = unparam(query);
        },

        Uri = function(uriStr) {
            var uri = this,
                components = getComponents(uriStr);

            each(components, function(v, key) {

                if (key === "query") {
                    // need encoded content
                    uri.query = new Query(v);
                } else {
                    // https://github.com/kissyteam/kissy/issues/298
                    try {
                        v = decode(v);
                    } catch (e) {
                        error(e);
                    }
                    // need to decode to get data structure in memory
                    uri[key] = v;
                }
            });

            return uri;
        },

        isUri = function(val) {
            val += "";

            var first = val.charAt(0),
                match;

            // root and relative
            if (first === "/" || first === ".") {
                return true;
            }

            match = ruri.exec(val);
            // scheme
            if (match) {
                // http://a.com
                // file:/// -> no domain
                return !!((match[1] && match[3]) || (match[1] && match[5]));
            }
            return false;
        };


    Query.prototype = {

        /**
         * Return parameter value corresponding to current key
         * @param {String} [key]
         */
        get: function(key) {
            var map = this._map;
            return key ? map[key] : map;
        },

        /**
         * Set parameter value corresponding to current key
         * @param {String} key
         * @param value
         * @chainable
         */
        set: function(key, value) {
            var query = this,
                map = query._map;

            if (isString(key)) {
                map[key] = value;
            } else {
                if (key instanceof Query) {
                    key = key.get();
                }
                each(key, function(v, k) {
                    map[k] = v;
                });
            }
            return query;
        },

        /**
         * Remove parameter with specified name.
         * @param {String} key
         * @chainable
         */
        remove: function(key) {
            var query = this;

            if (key) {
                key = makeArray(key);
                each(key, function(k) {
                    delete query._map[k];
                });
            } else {
                query._map = {};
            }
            return query;
        },

        /**
         * Serialize query to string.
         */
        toString: function() {
            return param(this._map);
        }
    };

    Query.prototype.add = Query.prototype.set;

    Uri.prototype = {

        getFragment: function() {
            return this.fragment;
        },

        toString: function() {
            var ret = [],
                uri = this,
                scheme = uri.scheme,
                domain = uri.domain,
                path = uri.path,
                port = uri.port,
                fragment = uri.fragment,
                query = uri.query.toString(),
                credentials = uri.credentials;

            if (scheme) {
                ret.push(scheme);
                ret.push(":");
            }

            if (domain) {
                ret.push("//");
                if (credentials) {
                    ret.push(credentials);
                    ret.push("@");
                }

                ret.push(encode(domain));

                if (port) {
                    ret.push(":");
                    ret.push(port);
                }
            }

            if (path) {
                ret.push(path);
            }

            if (query) {
                ret.push("?");
                ret.push(query);
            }

            if (fragment) {
                ret.push("#");
                ret.push(fragment);
            }

            return ret.join("");
        }
    };


    function isValidParamValue(val) {
        var t = typeof val;
        // If the type of val is null, undefined, number, string, boolean, return TRUE.
        return val === null || (t !== "object" && t !== "function");
    }

    /**
     * get/set/remove/add QueryParam
     * uri, args... or args.., uri
     */
    "add get remove set".replace(rword, function(name) {
        S[name + "QueryParam"] = function() {
            var args = makeArray(arguments),
                length = args.length,
                uriStr;

            // 第一个跟最后一个参数都可能是uri
            if (isUri(args[0])) {
                uriStr = args.shift();
            } else if (isUri(args[length - 1])) {
                uriStr = args.pop();
            }

            var uri = new Uri(uriStr),
                query = uri.query,
                ret = query[name].apply(query, args);

            return ret === query ? uri.toString() : ret || "";
        };
    });

    extend({
        Query: Query,
        Uri: Uri,

        urlEncode: encode,
        urlDecode: decode,

        param: param,
        unparam: unparam,

        isUri: isUri,

        parseUri: getComponents,

        getFragment: function(uri) {
            return new Uri(uri).getFragment();
        }
    });
    /**
     * events
     */
    var events = S.events = {};

// Bind event
    S.on = function(name, callback) {
        var list = events[name] || (events[name] = []);
        list.push(callback);
        return S;
    };

    S.one = function(name, callback) {
        var _callback = function(data) {
            S.off(name, _callback);
            callback(data);
        };
        return S.on(name, _callback);
    };

// Remove event. If `callback` is undefined, remove all callbacks for the
// event. If `event` and `callback` are both undefined, remove all callbacks
// for all events
    S.off = function(name, callback) {
        // Remove *all* events
        if (!(name || callback)) {
            events = S.events = {};
            return S;
        }

        var list = events[name];
        if (list) {
            if (callback) {
                for (var i = list.length - 1; i >= 0; i--) {
                    if (list[i] === callback) {
                        list.splice(i, 1);
                    }
                }
            } else {
                delete events[name];
            }
        }

        return S;
    };

// Emit event, firing all bound callbacks. Callbacks receive the same
// arguments as `emit` does, apart from the event name
    var trigger = S.trigger = function(name, data) {
        var list = events[name];

        if (list) {
            // Copy callback lists to prevent modification
            list = list.slice();

            // Execute event callbacks, use index because it's the faster.
            for (var i = 0, len = list.length; i < len; i++) {
                list[i](data);
            }
        }

        return S;
    };


// thanks modernizr
    var element = document.createElement("bainx"),
        style = element.style,
        spliter = " ",
        omPrefixes = "Webkit Moz O ms",
        cssomPrefixes = omPrefixes.split(spliter),

        prefixed = function(prop) {
            return testPropsAll(prop, "pfx");
        },
        testProps = function(props, prefixed) {
            var prop,
                i;

            for (i in props) {
                prop = props[i];
                if (style[prop] !== undefined) {
                    return prefixed == "pfx" ? prop : true;
                }
            }
            return false;
        },
        testPropsAll = function(prop, prefixed) {
            var ucProp = ucfirst(prop),
                props = (prop + spliter + cssomPrefixes.join(ucProp + spliter) + ucProp).split(spliter);

            return testProps(props, prefixed);
        },

        touch = "ontouchstart" in documentElement,
        mobile = !!ua.match(/AppleWebKit.*Mobile.*/) || touch,
        pad = !!ua.match(/iPad/i),
        phone = mobile && !pad,

        support = {
            transition: testPropsAll("transition"),
            transform: testPropsAll("transform"),
            touch: touch,
            mobile: mobile,
            pad: pad,
            phone: phone,
            placeholder: "placeholder" in document.createElement("input")
        };

// .add("canvas", function() {
//     var elem = document.createElement("canvas");
//     return !!(elem.getContext && elem.getContext("2d"));
// })

    extend({
        support: support,
        testPropsAll: testPropsAll,
        prefixed: prefixed
    });


    /**
     * an amd loader
     * thanks [seajs](http://seajs.org/)
     * 将seajs改造为一个amd加载器
     * 尽量减少对seajs代码的修改
     */
    var Loader = S.Loader = {},
        data = Loader.data = {},
        cid = cidGenerator(),

        DIRNAME_RE = /[^?#]*\//,
        DOT_RE = /\/\.\//g,
        DOUBLE_DOT_RE = /\/[^/]+\/\.\.\//,
        MULTI_SLASH_RE = /([^:/])\/+\//g;

// Extract the directory portion of a path
// dirname("a/b/c.js?t=123#xx/zz") ==> "a/b/"
// ref: http://jsperf.com/regex-vs-split/2
    function dirname(path) {
        return path.match(DIRNAME_RE)[0];
    }

// Canonicalize a path
// realpath("http://test.com/a//./b/../c") ==> "http://test.com/a/c"
    function realpath(path) {
        // /a/b/./c/./d ==> /a/b/c/d
        path = path.replace(DOT_RE, "/");

        // a//b/c  ==>  a/b/c
        path = path.replace(MULTI_SLASH_RE, "$1/");

        // a/b/c/../../d  ==>  a/b/../d  ==>  a/d
        while (path.match(DOUBLE_DOT_RE)) {
            path = path.replace(DOUBLE_DOT_RE, "/");
        }

        return path;
    }

// Normalize an id
// normalize("path/to/a") ==> "path/to/a.js"
// NOTICE: substring is faster than negative slice and RegExp
    function normalize(path) {
        var last = path.length - 1;
        var lastC = path.charAt(last);

        // If the uri ends with `#`, just return it without '#'
        if (lastC === "#") {
            return path.substring(0, last);
        }

        return (path.substring(last - 2) === ".js" ||
        path.indexOf("?") > 0 ||
        path.substring(last - 3) === ".css" ||
        lastC === "/") ? path : path + ".js";
    }


    var PATHS_RE = /^([^/:]+)(\/.+)$/,
        VARS_RE = /{([^{]+)}/g;

    function parseAlias(id) {
        var alias = data.alias;
        return alias && isString(alias[id]) ? alias[id] : id;
    }

    function parsePaths(id) {
        var paths = data.paths,
            m;

        if (paths && (m = id.match(PATHS_RE)) && isString(paths[m[1]])) {
            id = paths[m[1]] + m[2];
        }

        return id;
    }

    function parseVars(id) {
        var vars = data.vars;

        if (vars && id.indexOf("{") > -1) {
            id = id.replace(VARS_RE, function(m, key) {
                return isString(vars[key]) ? vars[key] : m;
            });
        }

        return id;
    }

    function parseMap(uri) {
        var map = data.map,
            ret = uri;

        if (map) {
            for (var i = 0, len = map.length; i < len; i++) {
                var rule = map[i];

                ret = isFunction(rule) ?
                    (rule(uri) || uri) :
                    uri.replace(rule[0], rule[1]);

                // Only apply the first matched rule
                if (ret !== uri) break;
            }
        }

        return ret;
    }


    var ABSOLUTE_RE = /^\/\/.|:\//,
        ROOT_DIR_RE = /^.*?\/\/.*?\//;

    function addBase(id, refUri) {
        var ret,
            first = id.charAt(0);

        // Absolute
        if (ABSOLUTE_RE.test(id)) {
            ret = id;
        }
        // Relative
        else if (first === ".") {
            ret = (refUri ? dirname(refUri) : data.cwd) + id;
        }
        // Root
        else if (first === "/") {
            var m = data.cwd.match(ROOT_DIR_RE);
            ret = m ? m[0] + id.substring(1) : id;
        }
        // Top-level
        else {
            ret = data.base + id;
        }

        if (ret.indexOf("//") === 0) {
            ret = location.protocol + ret;
        }

        return realpath(ret);
    }

    function id2Uri(id, refUri) {
        if (!id) return "";

        id = parseAlias(id);
        id = parsePaths(id);
        id = parseVars(id);
        id = normalize(id);

        var uri = addBase(id, refUri);
        uri = parseMap(uri);

        return uri;
    }

    var cwd = dirname(location.href),
        scripts = document.scripts,
        loaderScript = scripts[scripts.length - 1],
        loaderDir = dirname(getScriptAbsoluteSrc(loaderScript) || cwd);

    function getScriptAbsoluteSrc(node) {
        return node.hasAttribute ? // non-IE6/7
            node.src :
            // see http://msdn.microsoft.com/en-us/library/ms536429(VS.85).aspx
            node.getAttribute("src", 4);
    }


    /**
     * util-request.js - The utilities for requesting script and style files
     * ref: tests/research/load-js-css/test.html
     */

    var baseElement = head.getElementsByTagName("base")[0],

        currentlyAddingScript,
        interactiveScript,
        IS_CSS_RE = /\.css(?:\?|$)/i,
        isOldWebKit = +navigator.userAgent
                .replace(/.*(?:AppleWebKit|AndroidWebKit)\/(\d+).*/, "$1") < 536;

    function request(url, callback, charset) {
        callback = callback || noop;

        var isCSS = IS_CSS_RE.test(url),
            node = document.createElement(isCSS ? "link" : "script");

        if (charset) {
            var cs = isFunction(charset) ? charset(url) : charset;
            if (cs) {
                node.charset = cs;
            }
        }

        addOnload(node, callback, isCSS);

        if (isCSS) {
            node.rel = "stylesheet";
            node.href = url;
        }
        else {
            node.async = true;
            node.src = url;
        }

        // For some cache cases in IE 6-8, the script executes IMMEDIATELY after
        // the end of the insert execution, so use `currentlyAddingScript` to
        // hold current node, for deriving url in `define` call
        currentlyAddingScript = node;

        // ref: #185 & http://dev.jquery.com/ticket/2709
        if (baseElement) {
            head.insertBefore(node, baseElement);
        } else {
            head.appendChild(node);
        }

        currentlyAddingScript = null;
    }

    function addOnload(node, callback, isCSS) {
        // 不支持 onload事件
        var supportOnload = "onload" in node;
        // for Old WebKit and Old Firefox
        if (isCSS && (isOldWebKit || !supportOnload)) {
            setTimeout(function() {
                pollCss(node, callback);
            }, 1); // Begin after node insertion
            return;
        }

        var onload = function() {
            // Ensure only run once and handle memory leak in IE
            node.onload = node.onerror = node.onreadystatechange = null;

            if(!isCSS && !_config("debug")) {
                head.removeChild(node);
            }

            // Dereference the node
            node = null;
            callback();
        };

        if (supportOnload) {
            node.onload = node.onerror = onload;
        } else {
            node.onreadystatechange = function() {
                if (/loaded|complete/.test(node.readyState)) {
                    onload();
                }
            };
        }
    }

    function pollCss(node, callback) {
        var sheet = node.sheet,
            isLoaded;

        // for WebKit < 536
        if (isOldWebKit) {
            if (sheet) {
                isLoaded = true;
            }
        }
        // for Firefox < 9.0
        else if (sheet) {
            try {
                if (sheet.cssRules) {
                    isLoaded = true;
                }
            } catch (ex) {
                // The value of `ex.name` is changed from "NS_ERROR_DOM_SECURITY_ERR"
                // to "SecurityError" since Firefox 13.0. But Firefox is less than 9.0
                // in here, So it is ok to just rely on "NS_ERROR_DOM_SECURITY_ERR"
                if (ex.name === "NS_ERROR_DOM_SECURITY_ERR") {
                    isLoaded = true;
                }
            }
        }

        setTimeout(function() {
            if (isLoaded) {
                // Place callback here to give time for style rendering
                callback();
            } else {
                pollCss(node, callback);
            }
        }, 20);
    }

    function getCurrentScript() {
        // @update
        if (document.currentScript) {
            return document.currentScript;
        }
        if (currentlyAddingScript) {
            return currentlyAddingScript;
        }

        // For IE6-9 browsers, the script onload event may not fire right
        // after the script is evaluated. Kris Zyp found that it
        // could query the script nodes and the one that is in "interactive"
        // mode indicates the current script
        // ref: http://goo.gl/JHfFW
        if (interactiveScript && interactiveScript.readyState === "interactive") {
            return interactiveScript;
        }

        var scripts = head.getElementsByTagName("script"),
            script,
            i = scripts.length - 1;

        for (; i >= 0; i--) {
            script = scripts[i];
            if (script.readyState === "interactive") {
                interactiveScript = script;
                return interactiveScript;
            }
        }
    }

    /**
     * module.js - The core of module loader
     */

    var cachedMods = Loader.cache = {},
        anonymousMeta,
        fetchingList = {},
        fetchedList = {},
        callbackList = {};

    var STATUS = Module.STATUS = {
        // 1 - The `module.uri` is being fetched
        FETCHING: 1,
        // 2 - The meta data has been saved to cachedMods
        SAVED: 2,
        // 3 - The `module.dependencies` are being loaded
        LOADING: 3,
        // 4 - The module are ready to execute
        LOADED: 4,
        // 5 - The module is being executed
        EXECUTING: 5,
        // 6 - The `module.exports` is available
        EXECUTED: 6
    };

    function Module(uri, deps) {
        this.uri = uri;
        this.dependencies = deps || [];
        this.exports = null;
        this.status = 0;

        // Who depends on me
        this._waitings = {};

        // The number of unloaded dependencies
        // 未加载的依赖数
        this._remain = 0;
    }

    Module.prototype = {
        // Resolve module.dependencies
        // 返回依赖模块的uri数组
        resolve: function() {
            var mod = this,
                uri = mod.uri,
                ids = mod.dependencies;

            return ids.map(function(id) {
                return Module.resolve(id, uri);
            });
        },

        // Load module.dependencies and fire onload when all done
        load: function() {
            var mod = this;

            // If the module is being loaded, just wait it onload call
            if (mod.status >= STATUS.LOADING) {
                return;
            }

            mod.status = STATUS.LOADING;

            var uris = mod.resolve(),

            // 未加载的依赖数
                len = mod._remain = uris.length,
                m,
                i,
                uri = mod.uri;

            // Initialize modules and register waitings
            for (i = 0; i < len; i++) {
                m = Module.get(uris[i]);

                if (m.status < STATUS.EXECUTED) {
                    // Maybe duplicate
                    m._waitings[uri] = (m._waitings[uri] || 0) + 1;
                } else {
                    mod._remain--;
                }
            }

            if (mod._remain === 0) {
                mod.onload();
                return;
            }

            for (i = 0; i < len; i++) {
                m = cachedMods[uris[i]];

                // 模块尚未define及加载
                if (m.status < STATUS.FETCHING) {
                    m.fetch();
                }
                // 模块define过
                else if (m.status === STATUS.SAVED) {
                    m.load();
                }
            }

            // Send all requests at last to avoid cache bug in IE6-9. Issues#808
            // for (var requestUri in requestCache) {
            //     if (requestCache.hasOwnProperty(requestUri)) {
            //         requestCache[requestUri]();
            //     }
            // }
        },

        onload: function() {
            var mod = this;
            mod.status = STATUS.LOADED;

            if (mod.callback) {
                mod.callback();
            }

            mod.exec();
        },

        // exec to get exports
        exec: function() {
            var mod = this;

            // When module is executed, DO NOT execute it again. When module
            // is being executed, just return `module.exports` too, for avoiding
            // circularly calling
            if (mod.status >= STATUS.EXECUTING) {
                return mod.exports;
            }

            mod.status = STATUS.EXECUTING;

            var uri = mod.uri,
                uris = mod.resolve(),
                deps = [],
                i = 0,
                len = uris.length;

            for (; i < len; i++) {
                deps[i] = Module.get(uris[i]).exports;
            }

            // Exec factory
            var factory = mod.factory,
                exports = isFunction(factory) ?
                    factory.apply(null, deps) :
                    factory;

            if (exports === undefined) {
                exports = mod.exports;
            }

            // if (exports === null) {

            // }

            // Reduce memory leak
            delete mod.factory;

            mod.exports = exports;
            mod.status = STATUS.EXECUTED;

            // Emit `exec` event
            // emit("exec", mod)
            //
            // Notify waiting modules to fire onload
            var waitings = mod._waitings,
                m;

            for (uri in waitings) {
                if (waitings.hasOwnProperty(uri)) {
                    m = cachedMods[uri];
                    m._remain -= waitings[uri];
                    if (m._remain === 0) {
                        m.onload();
                    }
                }
            }

            // Reduce memory taken
            delete mod._waitings;
            delete mod._remain;

            return exports;
        },

        fetch: function() {
            var mod = this,
                uri = mod.uri;

            mod.status = STATUS.FETCHING;

            // Empty uri or a non-AMD module
            if (!uri || fetchedList[uri]) {
                mod.load();
                return;
            }

            if (fetchingList[uri]) {
                callbackList[uri].push(mod);
                return;
            }

            fetchingList[uri] = true;
            callbackList[uri] = [mod];


            sendRequest();

            function sendRequest() {
                request(uri, onRequest, data.charset);
            }


            function onRequest() {
                delete fetchingList[uri];
                fetchedList[uri] = true;

                // Save meta data of anonymous module
                if (anonymousMeta) {
                    Module.save(uri, anonymousMeta);
                    anonymousMeta = null;
                }

                // Call callbacks
                var m, mods = callbackList[uri];
                delete callbackList[uri];
                while ((m = mods.shift())) m.load();
            }
        }
    };

// Save meta data to cachedMods
    Module.save = function(uri, meta) {
        var mod = Module.get(uri);

        // Do NOT override already saved modules
        if (mod.status < STATUS.SAVED) {
            mod.id = meta.id || uri;
            mod.dependencies = meta.deps || [];
            mod.factory = meta.factory;
            mod.status = STATUS.SAVED;
        }
    };

    Module.get = function(uri, deps) {
        return cachedMods[uri] || (cachedMods[uri] = new Module(uri, deps));
    };
// 不直接调用Module.require, 在其他地方使用并传入uri
// Use function is equal to load a anonymous module
    Module.require = function(ids, callback, uri) {

        // 匿名模块uri根据preload，require等+cid进行区分
        // 需要uri来创建模块，注册依赖
        var mod = Module.get(uri, makeArray(ids));

        // 注册模块完成时的callback
        // 获取依赖模块的export并且执行callback
        if (callback) {
            mod.callback = function() {
                var uris = mod.resolve(),
                    exports = uris.map(function(uri) {
                        return cachedMods[uri].exports;
                    });

                callback.apply(global, exports);
                delete mod.callback;
            };
        }

        mod.load();
    };

// Resolve id to uri
    Module.resolve = function(id, refUri) {
        return id2Uri(id, refUri);
    };

    /**
     * define
     * 匿名模块与非匿名模块
     * 非匿名模块调用module.save保存模块信息。模块状态变为SAVED
     */
    Module.define = function(id, deps, factory) {
        var argsLen = arguments.length;

        // define(factory)
        if (argsLen === 1) {
            factory = id;
            id = undefined;
        } else if (argsLen === 2) {
            factory = deps;

            // define(deps, factory)
            if (isArray(id)) {
                deps = id;
                id = undefined;
            }
            // define(id, factory)
            else {
                deps = undefined;
            }
        }

        if (!isArray(deps)) {
            deps = [];
        }

        var meta = {
            id: id,
            uri: Module.resolve(id),
            deps: deps,
            factory: factory
        };

        /**
         * 具名模块直接save，匿名模块使用meta信息，在onload里面保存
         */
        if (!meta.uri) {
            var script = getCurrentScript();
            if (script) {
                meta.uri = script.src;
            }

            // NOTE: If the id-deriving methods above is failed, then falls back
            // to use onload event to get the uri
        }

        if (meta.uri) {
            Module.save(meta.uri, meta);
        } else {
            // Save information for "saving" work in the script onload event
            anonymousMeta = meta;
        }
    };

    Module.define.amd = {};
    data.fetchedList = fetchedList;

    /**
     * config.js - The configuration for the loader
     */

// The root path to use for id2uri parsing
// If loaderUri is `http://test.com/libs/seajs/[??][seajs/1.2.3/]sea.js`, the
// baseUri should be `http://test.com/libs/`
// 请求的baseUrl
    data.base = loaderDir;

// The loader directory
// loader所在目录，base默认是这个
    data.dir = loaderDir;

// The current working directory
    data.cwd = cwd;

// The charset for requesting files
    data.charset = "utf-8";

// data.alias - An object containing shorthands of module id
// data.paths - An object containing path shorthands in module id
// data.vars - The {xxx} variables in module id
// data.map - An array containing rules to map module uri
// data.debug - Debug mode. The default value is false

    Loader.config = function(configData) {

        for (var key in configData) {
            var curr = configData[key],
                prev = data[key];

            // Merge object config such as alias, vars
            if (prev && isObject(prev)) {
                for (var k in curr) {
                    prev[k] = curr[k];
                }
            } else {
                // Concat array config such as map, preload
                if (isArray(prev)) {
                    curr = prev.concat(curr);
                }
                // Make sure that `data.base` is an absolute path
                else if (key === "base") {
                    if (curr.slice(-1) !== "/") {
                        curr += "/";
                    }
                    curr = addBase(curr);
                }

                // Set config
                data[key] = curr;
            }
        }
    };

    Loader.resolve = id2Uri;

    var define = global.define = Module.define;
    var require = global.require = function(ids, callback) {
        Module.require(ids, callback, data.cwd + "_require_" + cid());
        return S;
    };

    extend({
        Module: Module,
        define: define,
        require: require,
        realpath: realpath,
        loadScript: request,
        loadCss: request
    });



    /**
     * 模块配置与注册
     * 只写常用的
     * @type {[type]}
     */
    var staticUrl = S.staticUrl = realpath(loaderDir + "../../../"),

        paths = {},

        alias = {},

        aliasConfig = {

            component: {
                switchable: "1.0.3",
                validator: "0.9.7",
                popup: "1.0.0",
                weixin:"2.8.0",
                rsa : "1.0.0",
                jweixin:'1.0.0'
            },

            plugin: {
                lazyload: "1.8.4",
                easing: "1.3",
                slider : '1.0.0'    //手机专用
            },

            gallery: {
                jquery: support.phone ? "2.1.1" : "1.11.1",
                handlebars: "1.3.0",
                json: "2"
            },

            arale: {
                base: "1.2.0",
                widget: "1.2.0",
                position: "1.0.1"
            },

            dist: {
                msg: "1.1.0"    //手机专用
            }
        },

    // 目录规范
        dirPattern = "{{ dir }}/{{ name }}/{{ version }}/{{ name }}";

    each(aliasConfig, function(config, dir) {

        paths[dir] = realpath(loaderDir) + dir;  //../../

        each(config, function(v, name) {
            alias[name] = substitute(dirPattern, {
                dir: dir,
                name: name,
                version: v
            });
        });
    });

    alias.$ = alias.jquery;

    Loader.config({

        base: staticUrl,

        alias: alias,

        paths: paths

    });

    if (!_config("debug")) {
        var scriptstamp = Math.floor(Date.now() / 3600000);
        Loader.config({
            // 每小时更新时间戳
            map: [
                function(uri) {
                    if (uri.indexOf("t=") === -1) {
                        return uri.replace(/^(.*\.(?:css|js))(.*)$/i, "$1?t=" + scriptstamp);
                    }
                }
            ]
        });
    }

    "alias map paths".replace(rword, function(name) {
        ConfigFns[name] = function(val) {
            if (val) {
                var cfg = {};
                cfg[name] = val;
                Loader.config(cfg);
            } else {
                return data[name];
            }
        };
    });


    var jQuery = global.jQuery || global.Zepto || global.$,
        jQueryFactory,
        JSON = global.JSON;

    if (JSON) {
        define("json", JSON);
    }

    if (jQuery) {
        jQueryFactory = function() {
            return jQuery;
        };
        define("jquery", jQueryFactory);
        define("$", jQueryFactory);
    }

    define("bainx", S);

    var preloadConfig = {
        broadcast: {
            module: "msg"
        },
        pin: {
            module: "position"
        },
        center: {
            module: "position"
        }
    };

// 某些没有return的模块接口可以提前写入
    each(preloadConfig, function(config, name) {
        var module = config.module;

        S[name] = function() {
            var args = arguments;

            require(module, function(exports) {
                var fn = exports[name];
                if (isFunction(fn)) {
                    fn.apply(S, args);

                    S[name] = fn;
                }
            });
        };
    });


    var MILLISECONDS_OF_DAY = 24 * 60 * 60 * 1000,

        cookie = S.cookie = {
            /**
             * 获取 cookie 值
             * @return {string} 如果 name 不存在，返回 undefined
             */
            get: function(name) {
                var ret, m;

                if (isNotEmptyString(name)) {
                    if ((m = String(document.cookie).match(
                            new RegExp('(?:^| )' + name + '(?:(?:=([^;]*))|;|$)')))) {
                        ret = m[1] ? decode(m[1]) : '';
                    }
                }
                return ret;
            },

            set: function(name, val, domain, expires, path, secure) {
                var text = String(encode(val)),
                    date = expires;

                // 从当前时间开始，多少天后过期
                if (typeof date === 'number') {
                    date = new Date();
                    date.setTime(date.getTime() + expires * MILLISECONDS_OF_DAY);
                }

                // expiration date
                if (date instanceof Date) {
                    text += ';expires=' + date.toUTCString();
                }

                // domain
                if (isNotEmptyString(domain)) {
                    text += ';domain=' + domain;
                }

                // path
                if (isNotEmptyString(path)) {
                    text += ';path=' + path;
                }

                // secure
                if (secure) {
                    text += ';secure';
                }

                document.cookie = name + '=' + text;
                return this;
            },

            remove: function(name, domain, path, secure) {
                // 置空，并立刻过期
                this.set(name, '', domain, -1, path, secure);
                return this;
            }
        };

    /**
     * formate格式只有2014/07/12 12:34:35的格式可以跨平台
     * new Date()
     * new Date(时间戳)
     * new Date(year, month, day[, hour[, minute[, second[, millisecond]]]])
     */

    var rformat = /y|m|d|h|i|s/gi,
        rdate = /^(?:number|date)$/,
        rnewdate = /^(?:number|string)$/;

    /*
     * 将日期格式化成字符串
     *  Y - 4位年
     *  y - 2位年
     *  M - 不补0的月,
     *  m - 补0的月
     *  D - 不补0的日期
     *  d - 补0的日期
     *  H - 不补0的小时
     *  h - 补0的小时
     *  I - 不补0的分
     *  i - 补0的分
     *  S - 不补0的秒
     *  s - 补0的秒
     *  毫秒暂不支持
     *
     * date只支持毫秒和Date
     *  @return：指定格式的字符串
     */
    function formatDate(format, date) {
        // 交换参数
        if (rdate.test(type(format))) {
            date = [format, format = date][0];
        }

        format = format || "Y-m-d h:i:s";
        date = normalizeDate(date);

        return format.replace(rformat, function(k) {
            return date[k];
        });
    }

// date转对象
    function normalizeDate(date) {
        date = makeDate(date);

        var o = {
                Y: date.getFullYear(),
                M: date.getMonth() + 1,
                D: date.getDate(),
                H: date.getHours(),
                I: date.getMinutes(),
                S: date.getSeconds()
            },
            ret = {};

        each(o, function(v, k) {
            // 统一结果为字符串
            v += "";
            ret[k] = v;

            ret[k.toLowerCase()] = padding2(v).slice(-2);
        });

        return ret;
    }

// 字符串/数字 -> Date
    function makeDate(date) {
        if (isDate(date)) {
            date = +date;
        }

        return rnewdate.test(type(date)) ? new Date(date) : new Date();
    }

    function padding2(str) {
        str += "";
        return str.length === 1 ? "0" + str : str;
    }

    extend({
        normalizeDate: normalizeDate,
        formatDate: formatDate
    });


    define("request.config", function() {

        var key = "tokenName",

            random = function() {
                return Math.random().toString(36).substring(2, 15);
            },

            token = random() + random(),

            generateToken = function() {
                cookie.set(_config(key), token, "", "", "/");
                return token;
            };

        _config(key, "XDJ_JTOKEN");

        _config({
            request: {
                code: {
                    fail: -1,
                    success: 1
                },
                msg: {
                    def: "请求失败！请重试！",
                    0: "啊吖，忙死我了，客官请稍候..",
                    // "301": "请求被重定向!",
                    // "302": "请求被临时重定向！",
                    500: "服务器出错!",
                    timeout: "请求超时！请检查网络连接！",
                    // "abort": "请求被终止！",
                    parsererror: "服务器出错或数据解析出错！"
                }
            }
        });

        S.generateToken = generateToken;
    });

    require("request.config");

    define("request", ["jquery"], function($) {

        var config = _config("request"),

            code = config.code,
            msg = config.msg,


            request = function(url, data, successCode, show) {
                var options = {
                    method: "post",
                    type : 'POST',
                    dataType: "json",
                    timeout: 10000
                };

                if (typeof url === "object") {
                    options = extend(options, url);
                    successCode = data;
                    data = options.data;
                    url = options.url;
                }

                successCode = successCode || code.success;
                data = data || {};
                url = url.trim();
                if (isString(data)) {
                    data = unparam(data);
                }

                data.jtoken = S.generateToken();
                url = S.addQueryParam(url, "_", Date.now());
                options.url = url;
                options.data = data;

                var ret = $.Deferred();



                var ajax = function(){
                    /*if(show){
                     var loading = $('<div class="page-loading loading"></div>').appendTo('body');
                     }*/
                    $.ajax(options).done(function(response) {
                        var code, result;
                        if (response) {
                            code = response.status;
                            result = response.result;
                        }
                        if (code == successCode) {     //code === successCode
                            ret.resolve(result || response, options);
                        } else {
                            ret.reject(code || (response && response.code) , response, options, ajax);
                        }
                    }).fail(function(xhr, status, err) {

                        if(status == 'abort') return;

                        console.log('ajax request fail:', arguments, url, data);
                        //向服务器端回显错误信息
                        $.ajax({
                            type : 'POST',
                            url : '/api/h/1.0/addLog.json',
                            data : {
                                act : url,
                                dt : xhr.responseText || 'ajax请求未接收到任何字符',
                                status : xhr.status
                            }
                        });


                        ret.reject(code.fail, {
                            code: code.fail,
                            url: url,
                            msg: msg[xhr.status] || msg[status] || msg.def
                        }, options, ajax);
                    })/*.always(function(){
                     if(loading){
                     setTimeout(function(){
                     loading.remove();
                     },500);
                     }
                     });*/
                }

                ajax();



                return ret;
            };

        return request;
    });




})(typeof window !== "undefined" ? window : this, document, "bainx");

window.alert = function(txt){
    var shield = document.createElement("DIV");
    shield.id = "shield";
    shield.style.position = "absolute";
    shield.style.left = "0px";
    shield.style.top = "0px";
    shield.style.right = "0px";
    shield.style.bottom = "0px";
    shield.style.width = "100%";
    shield.style.height = "100%";
    shield.style.background = "#333";
    shield.style.textAlign = "center";
    shield.style.zIndex = "10000";
    shield.style.filter = "alpha(opacity=75)"; //IE  取值从 0 到 100
    shield.style.opacity = "0.75"; //css3 取值从 0 到 1

    var my_alert = document.createElement("DIV");
    my_alert.id = "my-alert";
    my_alert.setAttribute('tabindex',"-1");
    my_alert.style.display = "block";
    my_alert.style.width = "270px";
    my_alert.style.position = "fixed";
    my_alert.style.zIndex = "11100";
    my_alert.style.left = "50%";
    my_alert.style.marginLeft = "-135px";
    my_alert.style.marginTop = "0";
    my_alert.style.top = "50%";
    my_alert.style.textAlign = "center";

    var strHtml='';
    strHtml += " <div style=\"background: #f8f8f8;\">\n";
    strHtml += " <div style=\"border-bottom: 1px solid #dedede;border-radius: 2px 2px 0 0;padding: 15px 10px;text-align: center;\">"+txt+"</div>\n";
    strHtml += " <div style=\"border-collapse: collapse;display: table;height: 44px;overflow: hidden;width: 100%;\"><span  id=\"doOk\" style=\"box-sizing: border-box !important;color: #0e90d2;cursor: pointer;display: table-cell !important;height: 44px;line-height: 44px;overflow: hidden;padding: 0 5px;text-align: center;text-overflow: ellipsis;white-space: nowrap;word-wrap: normal;\">确定</span></div>\n";
    strHtml += "</div>\n";

    my_alert.innerHTML = strHtml;
    document.body.appendChild(my_alert);
    document.body.appendChild(shield);
    var c = 0;
    this.doAlpha = function(){
        if (c++ > 20){clearInterval(ad);return 0;}
        my_alert.style.filter = "alpha(opacity="+c+");";
    }
    var ad = setInterval("doAlpha()",5);
    $('body').on('tap', '#doOk', function () {
        my_alert.parentNode.removeChild(my_alert);
        shield.parentNode.removeChild(shield);
    })
}

