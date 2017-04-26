;(function() {
var anima_yocto_core_110_src_core_debug, anima_yocto_ajax_103_src_util_debug, anima_widget_112_src_events_debug, cookies_110_index_debug, urijs_1141_src_punycode_debug, urijs_1141_src_IPv6_debug, urijs_1141_src_SecondLevelDomains_debug, handlebars_runtime_130_dist_cjs_handlebars_safe_string_debug, handlebars_runtime_130_dist_cjs_handlebars_exception_debug, import_style_100_index_debug, detail_001_index_debugcssjs, anima_yocto_core_110_index_debug, anima_yocto_event_102_src_event_debug, anima_yocto_event_101_src_event_debug, urijs_1141_src_URI_debug, handlebars_runtime_130_dist_cjs_handlebars_utils_debug, anima_yocto_plugin_100_index_debug, anima_yocto_event_102_index_debug, anima_yocto_touch_106_src_gestureManager_debug, anima_yocto_touch_106_src_tap_debug, anima_yocto_ajax_103_src_jsonp_debug, anima_yocto_ajax_103_src_miniAjax_debug, anima_yocto_event_101_index_debug, handlebars_runtime_130_dist_cjs_handlebars_base_debug, handlebars_runtime_130_dist_cjs_handlebars_runtime_debug, anima_yocto_touch_106_index_debug, anima_yocto_ajax_103_src_ajax_debug, anima_yocto_lite_110_index_debug, anima_widget_112_src_class_debug, anima_widget_112_src_attribute_debug, anima_lazyload_101_src_lazyload_debug, handlebars_runtime_130_dist_cjs_handlebarsruntime_debug, detail_001_index_debughandlebars, detail_001_order_debughandlebars, detail_001_toolbar_debughandlebars, anima_yocto_ajax_103_index_debug, anima_widget_112_src_base_debug, anima_lazyload_101_index_debug, anima_widget_112_src_widget_debug, anima_widget_112_index_debug, anima_carousel_101_src_carousel_debug, anima_carousel_101_index_debug, detail_001_index_debug;
anima_yocto_core_110_src_core_debug = function (exports) {
  var Yocto = function () {
      var undefined, key, $, classList, emptyArray = [], slice = emptyArray.slice, filter = emptyArray.filter,
        // [Opt:C] 增加win变量缓存window
        win = window, document = win.document, elementDisplay = {}, classCache = {}, fragmentRE = /^\s*<(\w+|!)[^>]*>/, rootNodeRE = /^(?:body|html)$/i, class2type = {}, toString = class2type.toString, zepto = {}, camelize, uniq,
        //[Opt:B][V1.0+] 由于已经删除prop方法，因此原propMap变量一并删除
        //[Opt:C] 去掉isArray旧方法的兼容
        isArray = Array.isArray;
      zepto.matches = function (element, selector) {
        // [Opt:C] 将原本在父级作用域的变量转移至局部变量
        var tempParent = document.createElement('div');
        if (!selector || !element || element.nodeType !== 1)
          return false;
        // [Opt:C] 去除对moz o 的支持，一般情况下，是不会遇到以上的浏览器，不针对moz和o做专门的优化
        var matchesSelector = element.webkitMatchesSelector || element.matchesSelector;
        if (matchesSelector)
          return matchesSelector.call(element, selector);
        // fall back to performing a selector:
        var match, parent = element.parentNode, temp = !parent;
        if (temp)
          (parent = tempParent).appendChild(element);
        match = ~zepto.qsa(parent, selector).indexOf(element);
        temp && tempParent.removeChild(element);
        return match;
      };
      //opt by 完颜
      //Get string type of an object. 
      //Possible types are: 
      //null undefined boolean number string function array date regexp object error.
      function type(obj) {
        return obj == null ? String(obj) : class2type[toString.call(obj)] || 'object';
      }
      function isFunction(value) {
        return type(value) == 'function';
      }
      function isWindow(obj) {
        return obj != null && obj == obj.window;
      }
      function isDocument(obj) {
        return obj != null && obj.nodeType == obj.DOCUMENT_NODE;
      }
      function isObject(obj) {
        return type(obj) == 'object';
      }
      function isPlainObject(obj) {
        return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype;
      }
      function likeArray(obj) {
        return typeof obj.length == 'number';
      }
      function compact(array) {
        return filter.call(array, function (item) {
          return item != null;
        });
      }
      function flatten(array) {
        return array.length > 0 ? $.fn.concat.apply([], array) : array;
      }
      //将中划线连接符转化为驼峰字符串
      camelize = function (str) {
        return str.replace(/-+(.)?/g, function (match, chr) {
          return chr ? chr.toUpperCase() : '';
        });
      };
      uniq = function (array) {
        return filter.call(array, function (item, idx) {
          return array.indexOf(item) == idx;
        });
      };
      function classRE(name) {
        return name in classCache ? classCache[name] : classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)');
      }
      function children(element) {
        return 'children' in element ? slice.call(element.children) : $.map(element.childNodes, function (node) {
          if (node.nodeType == 1)
            return node;
        });
      }
      // `$.zepto.fragment` takes a html string and an optional tag name
      // to generate DOM nodes nodes from the given html string.
      // The generated DOM nodes are returned as an array.
      // This function can be overriden in plugins for example to make
      // it compatible with browsers that don't support the DOM fully.
      zepto.fragment = function (html, name) {
        // [Opt:C] 将原本在父级作用域的变量转移至局部变量
        var table = document.createElement('table'), tableRow = document.createElement('tr'), containers = {
            'tr': document.createElement('tbody'),
            'tbody': table,
            'thead': table,
            'tfoot': table,
            'td': tableRow,
            'th': tableRow,
            '*': document.createElement('div')
          }, tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
          // special attributes that should be get/set via method calls
          methodAttributes = [
            'val',
            'css',
            'html',
            'text',
            'data',
            'width',
            'height',
            'offset'
          ];
        var dom, nodes, container;
        // A special case optimization for a single tag
        if (singleTagRE.test(html))
          dom = $(document.createElement(RegExp.$1));
        if (!dom) {
          if (html.replace)
            html = html.replace(tagExpanderRE, '<$1></$2>');
          if (name === undefined)
            name = fragmentRE.test(html) && RegExp.$1;
          if (!(name in containers))
            name = '*';
          container = containers[name];
          container.innerHTML = '' + html;
          dom = $.each(slice.call(container.childNodes), function () {
            container.removeChild(this);
          });
        }
        //[Opt:B-1][V1.0+] 移除 $(htmlString, attributes) 的api方法支持
        return dom;
      };
      // `$.zepto.Z` swaps out the prototype of the given `dom` array
      // of nodes with `$.fn` and thus supplying all the Zepto functions
      // to the array. Note that `__proto__` is not supported on Internet
      // Explorer. This method can be overriden in plugins.
      zepto.Z = function (dom, selector) {
        dom = dom || [];
        dom.__proto__ = $.fn;
        dom.selector = selector || '';
        return dom;
      };
      // `$.zepto.isZ` should return `true` if the given object is a Zepto
      // collection. This method can be overriden in plugins.
      zepto.isZ = function (object) {
        return object instanceof zepto.Z;
      };
      // `$.zepto.init` is Zepto's counterpart to jQuery's `$.fn.init` and
      // takes a CSS selector and an optional context (and handles various
      // special cases).
      // This method can be overriden in plugins.
      zepto.init = function (selector, context) {
        var dom;
        // If nothing given, return an empty Zepto collection
        if (!selector)
          return zepto.Z();
        else if (typeof selector == 'string') {
          selector = selector.trim();
          // If it's a html fragment, create nodes from it
          // Note: In both Chrome 21 and Firefox 15, DOM error 12
          // is thrown if the fragment doesn't begin with <
          if (selector[0] == '<' && fragmentRE.test(selector))
            dom = zepto.fragment(selector, RegExp.$1, context), selector = null;
          else if (context !== undefined)
            return $(context).find(selector);
          else
            dom = zepto.qsa(document, selector);
        } else if (isFunction(selector))
          return $(document).ready(selector);
        else if (zepto.isZ(selector))
          return selector;
        else {
          // normalize array if an array of nodes is given
          if (isArray(selector))
            dom = compact(selector);
          else if (isObject(selector))
            dom = [selector], selector = null;
          else if (fragmentRE.test(selector))
            dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null;
          else if (context !== undefined)
            return $(context).find(selector);
          else
            dom = zepto.qsa(document, selector);
        }
        // create a new Zepto collection from the nodes found
        return zepto.Z(dom, selector);
      };
      // `$` will be the base `Zepto` object. When calling this
      // function just call `$.zepto.init, which makes the implementation
      // details of selecting nodes and creating Zepto collections
      // patchable in plugins.
      $ = function (selector, context) {
        return zepto.init(selector, context);
      };
      // Copy all but undefined properties from one or more
      // objects to the `target` object.
      $.extend = function (target) {
        //[Opt:C] 将全局函数编程内部函数
        var extend = function (target, source, deep) {
          for (key in source)
            if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
              if (isPlainObject(source[key]) && !isPlainObject(target[key]))
                target[key] = {};
              if (isArray(source[key]) && !isArray(target[key]))
                target[key] = [];
              extend(target[key], source[key], deep);
            } else if (source[key] !== undefined)
              target[key] = source[key];
        };
        var deep, args = slice.call(arguments, 1);
        if (typeof target == 'boolean') {
          deep = target;
          target = args.shift();
        }
        args.forEach(function (arg) {
          extend(target, arg, deep);
        });
        return target;
      };
      // `$.zepto.qsa` is Zepto's CSS selector implementation which
      // uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
      // This method can be overriden in plugins.
      // opt by 轩与
      zepto.qsa = function (element, selector) {
        // [Opt:C] 将全局simpleSelectorRE转到局部
        var found, simpleSelectorRE = /^[\w-]*$/, maybeID = selector[0] == '#', maybeClass = !maybeID && selector[0] == '.', nameOnly = maybeID || maybeClass ? selector.slice(1) : selector,
          // Ensure that a 1 char tag name still gets checked
          isSimple = /^[\w-]*$/.test(nameOnly);
        return isDocument(element) && isSimple && maybeID ? (found = element.getElementById(nameOnly)) ? [found] : [] : element.nodeType !== 1 && element.nodeType !== 9 ? [] : slice.call(isSimple && !maybeID ? maybeClass ? element.getElementsByClassName(nameOnly) : // If it's simple, it could be a class
        element.getElementsByTagName(selector) : // Or a tag
        element.querySelectorAll(selector));
      };
      function filtered(nodes, selector) {
        return selector == null ? $(nodes) : $(nodes).filter(selector);
      }
      $.contains = function (parent, node) {
        return parent !== node && parent.contains(node);
      };
      function funcArg(context, arg, idx, payload) {
        return isFunction(arg) ? arg.call(context, idx, payload) : arg;
      }
      function setAttribute(node, name, value) {
        value == null ? node.removeAttribute(name) : node.setAttribute(name, value);
      }
      // access className property while respecting SVGAnimatedString
      function className(node, value) {
        var klass = node.className, svg = klass && klass.baseVal !== undefined;
        if (value === undefined)
          return svg ? klass.baseVal : klass;
        svg ? klass.baseVal = value : node.className = value;
      }
      // "true"  => true
      // "false" => false
      // "null"  => null
      // "42"    => 42
      // "42.5"  => 42.5
      // "08"    => "08"
      // JSON    => parse if valid
      // String  => self
      function deserializeValue(value) {
        var num;
        try {
          return value ? value == 'true' || (value == 'false' ? false : value == 'null' ? null : !/^0/.test(value) && !isNaN(num = Number(value)) ? num : /^[\[\{]/.test(value) ? $.parseJSON(value) : value) : value;
        } catch (e) {
          return value;
        }
      }
      $.type = type;
      $.isFunction = isFunction;
      $.isWindow = isWindow;
      $.isArray = isArray;
      $.isPlainObject = isPlainObject;
      //[Opt:A] 移除$.isEmptyObject方法，官网无公开，core内无引用
      //$.isEmptyObject
      $.camelCase = camelize;
      $.trim = function (str) {
        return str == null ? '' : String.prototype.trim.call(str);
      };
      // plugin compatibility
      $.uuid = 0;
      $.support = {};
      $.expr = {};
      $.map = function (elements, callback) {
        var value, values = [], i, key;
        if (likeArray(elements))
          for (i = 0; i < elements.length; i++) {
            value = callback(elements[i], i);
            if (value != null)
              values.push(value);
          }
        else
          for (key in elements) {
            value = callback(elements[key], key);
            if (value != null)
              values.push(value);
          }
        return flatten(values);
      };
      $.each = function (elements, callback) {
        var i, key;
        if (likeArray(elements)) {
          for (i = 0; i < elements.length; i++)
            if (callback.call(elements[i], i, elements[i]) === false)
              return elements;
        } else {
          for (key in elements)
            if (callback.call(elements[key], key, elements[key]) === false)
              return elements;
        }
        return elements;
      };
      // [Opt:C] 删除不必要的if (win.JSON)
      $.parseJSON = JSON.parse;
      // Populate the class2type map
      $.each('Boolean Number String Function Array Date RegExp Object Error'.split(' '), function (i, name) {
        class2type['[object ' + name + ']'] = name.toLowerCase();
      });
      // Define methods that will be available on all
      // Zepto collections
      $.fn = {
        // Because a collection acts like an array
        // copy over these useful array functions.
        forEach: emptyArray.forEach,
        reduce: emptyArray.reduce,
        push: emptyArray.push,
        sort: emptyArray.sort,
        indexOf: emptyArray.indexOf,
        concat: emptyArray.concat,
        // `map` and `slice` in the jQuery API work differently
        // from their array counterparts
        map: function (fn) {
          return $($.map(this, function (el, i) {
            return fn.call(el, i, el);
          }));
        },
        slice: function () {
          return $(slice.apply(this, arguments));
        },
        ready: function (callback) {
          //[Opt:C]将原本在父级作用域的变量转移至局部变量
          var readyRE = /complete|loaded|interactive/;
          // need to check if document.body exists for IE as that browser reports
          // document ready when it hasn't yet created the body element
          // [Opt:C] 不做ie的兼容
          if (readyRE.test(document.readyState))
            callback($);
          else
            document.addEventListener('DOMContentLoaded', function () {
              callback($);
            }, false);
          return this;
        },
        get: function (idx) {
          return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length];
        },
        toArray: function () {
          return this.get();
        },
        size: function () {
          return this.length;
        },
        remove: function () {
          return this.each(function () {
            if (this.parentNode != null)
              this.parentNode.removeChild(this);
          });
        },
        each: function (callback) {
          emptyArray.every.call(this, function (el, idx) {
            return callback.call(el, idx, el) !== false;
          });
          return this;
        },
        filter: function (selector) {
          if (isFunction(selector))
            return this.not(this.not(selector));
          return $(filter.call(this, function (element) {
            return zepto.matches(element, selector);
          }));
        },
        add: function (selector, context) {
          return $(uniq(this.concat($(selector, context))));
        },
        is: function (selector) {
          return this.length > 0 && zepto.matches(this[0], selector);
        },
        not: function (selector) {
          var nodes = [];
          if (isFunction(selector) && selector.call !== undefined)
            this.each(function (idx) {
              if (!selector.call(this, idx))
                nodes.push(this);
            });
          else {
            var excludes = typeof selector == 'string' ? this.filter(selector) : likeArray(selector) && isFunction(selector.item) ? slice.call(selector) : $(selector);
            this.forEach(function (el) {
              if (excludes.indexOf(el) < 0)
                nodes.push(el);
            });
          }
          return $(nodes);
        },
        has: function (selector) {
          return this.filter(function () {
            return isObject(selector) ? $.contains(this, selector) : $(this).find(selector).size();
          });
        },
        eq: function (idx) {
          return idx === -1 ? this.slice(idx) : this.slice(idx, +idx + 1);
        },
        first: function () {
          var el = this[0];
          return el && !isObject(el) ? el : $(el);
        },
        last: function () {
          var el = this[this.length - 1];
          return el && !isObject(el) ? el : $(el);
        },
        find: function (selector) {
          var result, $this = this;
          if (typeof selector == 'object')
            result = $(selector).filter(function () {
              var node = this;
              return emptyArray.some.call($this, function (parent) {
                return $.contains(parent, node);
              });
            });
          else if (this.length == 1)
            result = $(zepto.qsa(this[0], selector));
          else
            result = this.map(function () {
              return zepto.qsa(this, selector);
            });
          return result;
        },
        //[Opt:B][V1.0+] : closest的父级选择，代理parents，去除原有的第二个参数支持
        closest: function (selector) {
          if (zepto.matches(this[0], selector))
            return $(this[0]);
          else
            return $(this.parents(selector).get(0));
        },
        parents: function (selector) {
          var ancestors = [], nodes = this;
          while (nodes.length > 0)
            nodes = $.map(nodes, function (node) {
              if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {
                ancestors.push(node);
                return node;
              }
            });
          return filtered(ancestors, selector);
        },
        parent: function (selector) {
          return filtered(uniq(this.pluck('parentNode')), selector);
        },
        children: function (selector) {
          return filtered(this.map(function () {
            return children(this);
          }), selector);
        },
        //[Opt:B][V1.0+] : contents已经转移至plugin
        siblings: function (selector) {
          return filtered(this.map(function (i, el) {
            return filter.call(children(el.parentNode), function (child) {
              return child !== el;
            });
          }), selector);
        },
        //[Opt:A] : empty已经转移至plugin
        // `pluck` is borrowed from Prototype.js
        pluck: function (property) {
          return $.map(this, function (el) {
            return el[property];
          });
        },
        show: function () {
          // [Opt:C] 提取函数
          var getDisplay = function (DOM) {
            return getComputedStyle(DOM, '').getPropertyValue('display');
          };
          return this.each(function () {
            this.style.display == 'none' && (this.style.display = '');
            if (getDisplay(this) == 'none') {
              // [Opt:C] 将defaultDisplay方法局部化
              var defaultDisplay = function (nodeName) {
                var element, display;
                if (!elementDisplay[nodeName]) {
                  element = document.createElement(nodeName);
                  document.body.appendChild(element);
                  display = getDisplay(element);
                  element.parentNode.removeChild(element);
                  display == 'none' && (display = 'block');
                  elementDisplay[nodeName] = display;
                }
                return elementDisplay[nodeName];
              };
              this.style.display = defaultDisplay(this.nodeName);
            }
          });
        },
        replaceWith: function (newContent) {
          return this.before(newContent).remove();
        },
        //[Opt:A] : wrap系列方法，已经转移至plugin
        clone: function () {
          return this.map(function () {
            return this.cloneNode(true);
          });
        },
        hide: function () {
          return this.css('display', 'none');
        },
        toggle: function (setting) {
          return this.each(function () {
            var el = $(this);
            (setting === undefined ? el.css('display') == 'none' : setting) ? el.show() : el.hide();
          });
        },
        prev: function (selector) {
          return $(this.pluck('previousElementSibling')).filter(selector || '*');
        },
        next: function (selector) {
          return $(this.pluck('nextElementSibling')).filter(selector || '*');
        },
        html: function (html) {
          return arguments.length === 0 ? this.length > 0 ? this[0].innerHTML : null : this.each(function (idx) {
            var originHtml = this.innerHTML;
            this.innerHTML = '';
            $(this).append(funcArg(this, html, idx, originHtml));
          });
        },
        text: function (text) {
          return arguments.length === 0 ? this.length > 0 ? this[0].textContent : null : this.each(function () {
            this.textContent = text === undefined ? '' : '' + text;
          });
        },
        attr: function (name, value) {
          var result;
          return typeof name == 'string' && value === undefined ? this.length == 0 || this[0].nodeType !== 1 ? undefined : name == 'value' && this[0].nodeName == 'INPUT' ? this.val() : !(result = this[0].getAttribute(name)) && name in this[0] ? this[0][name] : result : this.each(function (idx) {
            if (this.nodeType !== 1)
              return;
            if (isObject(name))
              for (key in name)
                setAttribute(this, key, name[key]);
            else
              setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)));
          });
        },
        removeAttr: function (name) {
          return this.each(function () {
            this.nodeType === 1 && setAttribute(this, name);
          });
        },
        data: function (name, value) {
          //[Opt:C]将原本在父级作用域的变量转移至局部变量
          var capitalRE = /([A-Z])/g, data = this.attr('data-' + name.replace(capitalRE, '-$1').toLowerCase(), value);
          return data !== null ? deserializeValue(data) : undefined;
        },
        val: function (value) {
          return arguments.length === 0 ? this[0] && (this[0].multiple ? $(this[0]).find('option').filter(function () {
            return this.selected;
          }).pluck('value') : this[0].value) : this.each(function (idx) {
            this.value = funcArg(this, value, idx, this.value);
          });
        },
        //[Opt:B][V1.0+] 去除offset的coordinates参数
        offset: function () {
          if (this.length == 0)
            return null;
          var obj = this[0].getBoundingClientRect();
          return {
            left: obj.left + win.pageXOffset,
            top: obj.top + win.pageYOffset,
            width: Math.round(obj.width),
            height: Math.round(obj.height)
          };
        },
        css: function (property, value) {
          //智能补足：分析css方法中传入的value，如果name是在cssNumber清单外的纯数字，则增加px单位
          //[Opt:C] 将全局函数装到局部函数
          var maybeAddPx = function (name, value) {
            //[Opt:C]将原本在父级作用域的变量转移至局部变量
            var cssNumber = {
                'column-count': 1,
                'columns': 1,
                'font-weight': 1,
                'line-height': 1,
                'opacity': 1,
                'z-index': 1,
                'zoom': 1
              };
            return typeof value == 'number' && !cssNumber[dasherize(name)] ? value + 'px' : value;
          };
          //将字符串(驼峰)转换为dasherized(中划线连接符形式命名)字符
          //[Opt:C] 将全局函数装到局部函数
          var dasherize = function (str) {
            return str.replace(/::/g, '/').replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2').replace(/([a-z\d])([A-Z])/g, '$1_$2').replace(/_/g, '-').toLowerCase();
          };
          if (arguments.length < 2) {
            var element = this[0], computedStyle = getComputedStyle(element, '');
            if (!element)
              return;
            if (typeof property == 'string')
              return element.style[camelize(property)] || computedStyle.getPropertyValue(property);
            else if (isArray(property)) {
              var props = {};
              $.each(isArray(property) ? property : [property], function (_, prop) {
                props[prop] = element.style[camelize(prop)] || computedStyle.getPropertyValue(prop);
              });
              return props;
            }
          }
          var css = '';
          if (type(property) == 'string') {
            if (!value && value !== 0)
              this.each(function () {
                this.style.removeProperty(dasherize(property));
              });
            else
              css = dasherize(property) + ':' + maybeAddPx(property, value);
          } else {
            for (key in property)
              if (!property[key] && property[key] !== 0)
                this.each(function () {
                  this.style.removeProperty(dasherize(key));
                });
              else
                css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';';
          }
          return this.each(function () {
            this.style.cssText += ';' + css;
          });
        },
        index: function (element) {
          return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0]);
        },
        hasClass: function (name) {
          if (!name)
            return false;
          return emptyArray.some.call(this, function (el) {
            return this.test(className(el));
          }, classRE(name));
        },
        addClass: function (name) {
          if (!name)
            return this;
          return this.each(function (idx) {
            classList = [];
            var cls = className(this), newName = funcArg(this, name, idx, cls);
            newName.split(/\s+/g).forEach(function (klass) {
              if (!$(this).hasClass(klass))
                classList.push(klass);
            }, this);
            classList.length && className(this, cls + (cls ? ' ' : '') + classList.join(' '));
          });
        },
        removeClass: function (name) {
          return this.each(function (idx) {
            if (name === undefined)
              return className(this, '');
            classList = className(this);
            funcArg(this, name, idx, classList).split(/\s+/g).forEach(function (klass) {
              classList = classList.replace(classRE(klass), ' ');
            });
            className(this, classList.trim());
          });
        },
        toggleClass: function (name, when) {
          if (!name)
            return this;
          return this.each(function (idx) {
            var $this = $(this), names = funcArg(this, name, idx, className(this));
            names.split(/\s+/g).forEach(function (klass) {
              (when === undefined ? !$this.hasClass(klass) : when) ? $this.addClass(klass) : $this.removeClass(klass);
            });
          });
        },
        scrollTop: function (value) {
          if (!this.length)
            return;
          var hasScrollTop = 'scrollTop' in this[0];
          if (value === undefined)
            return hasScrollTop ? this[0].scrollTop : this[0].pageYOffset;
          return this.each(hasScrollTop ? function () {
            this.scrollTop = value;
          } : function () {
            this.scrollTo(this.scrollX, value);
          });
        }
      };
      // for now
      $.fn.detach = $.fn.remove;
      [
        'width',
        'height'
      ].forEach(function (dimension) {
        var dimensionProperty = dimension.replace(/./, function (m) {
            return m[0].toUpperCase();
          });
        $.fn[dimension] = function (value) {
          var offset, el = this[0];
          if (value === undefined)
            return isWindow(el) ? el['inner' + dimensionProperty] : isDocument(el) ? el.documentElement['scroll' + dimensionProperty] : (offset = this.offset()) && offset[dimension];
          else
            return this.each(function (idx) {
              el = $(this);
              el.css(dimension, funcArg(this, value, idx, el[dimension]()));
            });
        };
      });
      [
        'after',
        'prepend',
        'before',
        'append'
      ].forEach(function (operator, operatorIndex) {
        var inside = operatorIndex % 2;
        //=> prepend, append
        $.fn[operator] = function () {
          // arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
          var argType, nodes = $.map(arguments, function (arg) {
              argType = type(arg);
              return argType == 'object' || argType == 'array' || arg == null ? arg : zepto.fragment(arg);
            }), parent, copyByClone = this.length > 1;
          if (nodes.length < 1)
            return this;
          return this.each(function (_, target) {
            parent = inside ? target : target.parentNode;
            // convert all methods to a "before" operation
            target = operatorIndex == 0 ? target.nextSibling : operatorIndex == 1 ? target.firstChild : operatorIndex == 2 ? target : null;
            // [Opt:C] 全部变量局部化
            var traverseNode = function (node, fun) {
              fun(node);
              for (var key in node.childNodes)
                traverseNode(node.childNodes[key], fun);
            };
            nodes.forEach(function (node) {
              if (copyByClone)
                node = node.cloneNode(true);
              else if (!parent)
                return $(node).remove();
              traverseNode(parent.insertBefore(node, target), function (el) {
                if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' && (!el.type || el.type === 'text/javascript') && !el.src)
                  win['eval'].call(win, el.innerHTML);
              });
            });
          });
        };
        // after    => insertAfter
        // prepend  => prependTo
        // before   => insertBefore
        // append   => appendTo
        $.fn[inside ? operator + 'To' : 'insert' + (operatorIndex ? 'Before' : 'After')] = function (html) {
          $(html)[operator](this);
          return this;
        };
      });
      zepto.Z.prototype = $.fn;
      // Export internal API functions in the `$.zepto` namespace
      zepto.uniq = uniq;
      zepto.deserializeValue = deserializeValue;
      $.zepto = zepto;
      return $;
    }();
  exports = Yocto;
  return exports;
}();
anima_yocto_ajax_103_src_util_debug = function (exports) {
  // triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable
  function ajaxBeforeSend(xhr, settings) {
    var context = settings.context;
    if (settings.beforeSend.call(context, xhr, settings) === false)
      return false;
  }
  function ajaxSuccess(data, xhr, settings, deferred) {
    var context = settings.context, status = 'success';
    settings.success.call(context, data, status, xhr);
    if (deferred)
      deferred.resolveWith(context, [
        data,
        status,
        xhr
      ]);
    ajaxComplete(status, xhr, settings);
  }
  // type: "timeout", "error", "abort", "parsererror"
  function ajaxError(error, type, xhr, settings, deferred) {
    var context = settings.context;
    settings.error.call(context, xhr, type, error);
    if (deferred)
      deferred.rejectWith(context, [
        xhr,
        type,
        error
      ]);
    ajaxComplete(type, xhr, settings);
  }
  // status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
  function ajaxComplete(status, xhr, settings) {
    var context = settings.context;
    settings.complete.call(context, xhr, status);
  }
  exports = {
    ajaxBeforeSend: ajaxBeforeSend,
    ajaxSuccess: ajaxSuccess,
    ajaxError: ajaxError
  };
  return exports;
}();
anima_widget_112_src_events_debug = function (exports) {
  // Events
  // -----------------
  // Thanks to:
  //  - https://github.com/documentcloud/backbone/blob/master/backbone.js
  //  - https://github.com/joyent/node/blob/master/lib/events.js
  // Regular expression used to split event strings
  var eventSplitter = /\s+/;
  // A module that can be mixed in to *any object* in order to provide it
  // with custom events. You may bind with `on` or remove with `off` callback
  // functions to an event; `trigger`-ing an event fires all callbacks in
  // succession.
  //
  //     var object = new Events();
  //     object.on('expand', function(){ alert('expanded'); });
  //     object.trigger('expand');
  //
  function Events() {
  }
  // Bind one or more space separated events, `events`, to a `callback`
  // function. Passing `"all"` will bind the callback to all events fired.
  Events.prototype.on = function (events, callback, context) {
    var cache, event, list;
    if (!callback)
      return this;
    cache = this.__events || (this.__events = {});
    events = events.split(eventSplitter);
    while (event = events.shift()) {
      list = cache[event] || (cache[event] = []);
      list.push(callback, context);
    }
    return this;
  };
  // Remove one or many callbacks. If `context` is null, removes all callbacks
  // with that function. If `callback` is null, removes all callbacks for the
  // event. If `events` is null, removes all bound callbacks for all events.
  Events.prototype.off = function (events, callback, context) {
    var cache, event, list, i;
    // No events, or removing *all* events.
    if (!(cache = this.__events))
      return this;
    if (!(events || callback || context)) {
      delete this.__events;
      return this;
    }
    events = events ? events.split(eventSplitter) : Object.keys(cache);
    // Loop through the callback list, splicing where appropriate.
    while (event = events.shift()) {
      list = cache[event];
      if (!list)
        continue;
      if (!(callback || context)) {
        delete cache[event];
        continue;
      }
      for (i = list.length - 2; i >= 0; i -= 2) {
        if (!(callback && list[i] !== callback || context && list[i + 1] !== context)) {
          list.splice(i, 2);
        }
      }
    }
    return this;
  };
  // Trigger one or many events, firing all bound callbacks. Callbacks are
  // passed the same arguments as `trigger` is, apart from the event name
  // (unless you're listening on `"all"`, which will cause your callback to
  // receive the true name of the event as the first argument).
  Events.prototype.trigger = function (events) {
    var cache, event, all, list, i, len, rest = [], args, returned = true;
    if (!(cache = this.__events))
      return this;
    events = events.split(eventSplitter);
    // Fill up `rest` with the callback arguments.  Since we're only copying
    // the tail of `arguments`, a loop is much faster than Array#slice.
    for (i = 1, len = arguments.length; i < len; i++) {
      rest[i - 1] = arguments[i];
    }
    // For each event, walk through the list of callbacks twice, first to
    // trigger the event, then to trigger any `"all"` callbacks.
    while (event = events.shift()) {
      // Copy callback lists to prevent modification.
      if (all = cache.all)
        all = all.slice();
      if (list = cache[event])
        list = list.slice();
      // Execute event callbacks except one named "all"
      if (event !== 'all') {
        returned = triggerEvents(list, rest, this) && returned;
      }
      // Execute "all" callbacks.
      returned = triggerEvents(all, [event].concat(rest), this) && returned;
    }
    return returned;
  };
  Events.prototype.emit = Events.prototype.trigger;
  // Execute callbacks
  function triggerEvents(list, args, context) {
    var pass = true;
    if (list) {
      var i = 0, l = list.length, a1 = args[0], a2 = args[1], a3 = args[2];
      // call is faster than apply, optimize less than 3 argu
      // http://blog.csdn.net/zhengyinhui100/article/details/7837127
      switch (args.length) {
      case 0:
        for (; i < l; i += 2) {
          pass = list[i].call(list[i + 1] || context) !== false && pass;
        }
        break;
      case 1:
        for (; i < l; i += 2) {
          pass = list[i].call(list[i + 1] || context, a1) !== false && pass;
        }
        break;
      case 2:
        for (; i < l; i += 2) {
          pass = list[i].call(list[i + 1] || context, a1, a2) !== false && pass;
        }
        break;
      case 3:
        for (; i < l; i += 2) {
          pass = list[i].call(list[i + 1] || context, a1, a2, a3) !== false && pass;
        }
        break;
      default:
        for (; i < l; i += 2) {
          pass = list[i].apply(list[i + 1] || context, args) !== false && pass;
        }
        break;
      }
    }
    // trigger will return false if one of the callbacks return false
    return pass;
  }
  function isFunction(func) {
    return Object.prototype.toString.call(func) === '[object Function]';
  }
  exports = Events;
  return exports;
}();
cookies_110_index_debug = function (exports) {
  // Cookie
  // -------------
  // Thanks to:
  //  - http://www.nczonline.net/blog/2009/05/05/http-cookies-explained/
  //  - http://developer.yahoo.com/yui/3/cookie/
  var Cookie = exports;
  var decode = decodeURIComponent;
  var encode = encodeURIComponent;
  /**
   * Returns the cookie value for the given name.
   *
   * @param {String} name The name of the cookie to retrieve.
   *
   * @param {Function|Object} options (Optional) An object containing one or
   *     more cookie options: raw (true/false) and converter (a function).
   *     The converter function is run on the value before returning it. The
   *     function is not used if the cookie doesn't exist. The function can be
   *     passed instead of the options object for conveniently. When raw is
   *     set to true, the cookie value is not URI decoded.
   *
   * @return {*} If no converter is specified, returns a string or undefined
   *     if the cookie doesn't exist. If the converter is specified, returns
   *     the value returned from the converter.
   */
  Cookie.get = function (name, options) {
    validateCookieName(name);
    if (typeof options === 'function') {
      options = { converter: options };
    } else {
      options = options || {};
    }
    var cookies = parseCookieString(document.cookie, !options['raw']);
    return (options.converter || same)(cookies[name]);
  };
  /**
   * Sets a cookie with a given name and value.
   *
   * @param {string} name The name of the cookie to set.
   *
   * @param {*} value The value to set for the cookie.
   *
   * @param {Object} options (Optional) An object containing one or more
   *     cookie options: path (a string), domain (a string),
   *     expires (number or a Date object), secure (true/false),
   *     and raw (true/false). Setting raw to true indicates that the cookie
   *     should not be URI encoded before being set.
   *
   * @return {string} The created cookie string.
   */
  Cookie.set = function (name, value, options) {
    validateCookieName(name);
    options = options || {};
    var expires = options['expires'];
    var domain = options['domain'];
    var path = options['path'];
    if (!options['raw']) {
      value = encode(String(value));
    }
    var text = name + '=' + value;
    // expires
    var date = expires;
    if (typeof date === 'number') {
      date = new Date();
      date.setDate(date.getDate() + expires);
    }
    if (date instanceof Date) {
      text += '; expires=' + date.toUTCString();
    }
    // domain
    if (isNonEmptyString(domain)) {
      text += '; domain=' + domain;
    }
    // path
    if (isNonEmptyString(path)) {
      text += '; path=' + path;
    }
    // secure
    if (options['secure']) {
      text += '; secure';
    }
    document.cookie = text;
    return text;
  };
  /**
   * Removes a cookie from the machine by setting its expiration date to
   * sometime in the past.
   *
   * @param {string} name The name of the cookie to remove.
   *
   * @param {Object} options (Optional) An object containing one or more
   *     cookie options: path (a string), domain (a string),
   *     and secure (true/false). The expires option will be overwritten
   *     by the method.
   *
   * @return {string} The created cookie string.
   */
  Cookie.remove = function (name, options) {
    options = options || {};
    options['expires'] = new Date(0);
    return this.set(name, '', options);
  };
  function parseCookieString(text, shouldDecode) {
    var cookies = {};
    if (isString(text) && text.length > 0) {
      var decodeValue = shouldDecode ? decode : same;
      var cookieParts = text.split(/;\s/g);
      var cookieName;
      var cookieValue;
      var cookieNameValue;
      for (var i = 0, len = cookieParts.length; i < len; i++) {
        // Check for normally-formatted cookie (name-value)
        cookieNameValue = cookieParts[i].match(/([^=]+)=/i);
        if (cookieNameValue instanceof Array) {
          try {
            cookieName = decode(cookieNameValue[1]);
            cookieValue = decodeValue(cookieParts[i].substring(cookieNameValue[1].length + 1));
          } catch (ex) {
          }
        } else {
          // Means the cookie does not have an "=", so treat it as
          // a boolean flag
          cookieName = decode(cookieParts[i]);
          cookieValue = '';
        }
        if (cookieName) {
          cookies[cookieName] = cookieValue;
        }
      }
    }
    return cookies;
  }
  // Helpers
  function isString(o) {
    return typeof o === 'string';
  }
  function isNonEmptyString(s) {
    return isString(s) && s !== '';
  }
  function validateCookieName(name) {
    if (!isNonEmptyString(name)) {
      throw new TypeError('Cookie name must be a non-empty string');
    }
  }
  function same(s) {
    return s;
  }
  return exports;
}({});
urijs_1141_src_punycode_debug = function (exports) {
  (function (root) {
    var freeExports = true;
    var freeModule = true;
    var freeGlobal = typeof global == 'object' && global;
    if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
      root = freeGlobal;
    }
    var punycode, maxInt = 2147483647, base = 36, tMin = 1, tMax = 26, skew = 38, damp = 700, initialBias = 72, initialN = 128, delimiter = '-', regexPunycode = /^xn--/, regexNonASCII = /[^ -~]/, regexSeparators = /\x2E|\u3002|\uFF0E|\uFF61/g, errors = {
        'overflow': 'Overflow: input needs wider integers to process',
        'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
        'invalid-input': 'Invalid input'
      }, baseMinusTMin = base - tMin, floor = Math.floor, stringFromCharCode = String.fromCharCode, key;
    function error(type) {
      throw RangeError(errors[type]);
    }
    function map(array, fn) {
      var length = array.length;
      while (length--) {
        array[length] = fn(array[length]);
      }
      return array;
    }
    function mapDomain(string, fn) {
      return map(string.split(regexSeparators), fn).join('.');
    }
    function ucs2decode(string) {
      var output = [], counter = 0, length = string.length, value, extra;
      while (counter < length) {
        value = string.charCodeAt(counter++);
        if (value >= 55296 && value <= 56319 && counter < length) {
          extra = string.charCodeAt(counter++);
          if ((extra & 64512) == 56320) {
            output.push(((value & 1023) << 10) + (extra & 1023) + 65536);
          } else {
            output.push(value);
            counter--;
          }
        } else {
          output.push(value);
        }
      }
      return output;
    }
    function ucs2encode(array) {
      return map(array, function (value) {
        var output = '';
        if (value > 65535) {
          value -= 65536;
          output += stringFromCharCode(value >>> 10 & 1023 | 55296);
          value = 56320 | value & 1023;
        }
        output += stringFromCharCode(value);
        return output;
      }).join('');
    }
    function basicToDigit(codePoint) {
      if (codePoint - 48 < 10) {
        return codePoint - 22;
      }
      if (codePoint - 65 < 26) {
        return codePoint - 65;
      }
      if (codePoint - 97 < 26) {
        return codePoint - 97;
      }
      return base;
    }
    function digitToBasic(digit, flag) {
      return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
    }
    function adapt(delta, numPoints, firstTime) {
      var k = 0;
      delta = firstTime ? floor(delta / damp) : delta >> 1;
      delta += floor(delta / numPoints);
      for (; delta > baseMinusTMin * tMax >> 1; k += base) {
        delta = floor(delta / baseMinusTMin);
      }
      return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
    }
    function decode(input) {
      var output = [], inputLength = input.length, out, i = 0, n = initialN, bias = initialBias, basic, j, index, oldi, w, k, digit, t, length, baseMinusT;
      basic = input.lastIndexOf(delimiter);
      if (basic < 0) {
        basic = 0;
      }
      for (j = 0; j < basic; ++j) {
        if (input.charCodeAt(j) >= 128) {
          error('not-basic');
        }
        output.push(input.charCodeAt(j));
      }
      for (index = basic > 0 ? basic + 1 : 0; index < inputLength;) {
        for (oldi = i, w = 1, k = base;; k += base) {
          if (index >= inputLength) {
            error('invalid-input');
          }
          digit = basicToDigit(input.charCodeAt(index++));
          if (digit >= base || digit > floor((maxInt - i) / w)) {
            error('overflow');
          }
          i += digit * w;
          t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
          if (digit < t) {
            break;
          }
          baseMinusT = base - t;
          if (w > floor(maxInt / baseMinusT)) {
            error('overflow');
          }
          w *= baseMinusT;
        }
        out = output.length + 1;
        bias = adapt(i - oldi, out, oldi == 0);
        if (floor(i / out) > maxInt - n) {
          error('overflow');
        }
        n += floor(i / out);
        i %= out;
        output.splice(i++, 0, n);
      }
      return ucs2encode(output);
    }
    function encode(input) {
      var n, delta, handledCPCount, basicLength, bias, j, m, q, k, t, currentValue, output = [], inputLength, handledCPCountPlusOne, baseMinusT, qMinusT;
      input = ucs2decode(input);
      inputLength = input.length;
      n = initialN;
      delta = 0;
      bias = initialBias;
      for (j = 0; j < inputLength; ++j) {
        currentValue = input[j];
        if (currentValue < 128) {
          output.push(stringFromCharCode(currentValue));
        }
      }
      handledCPCount = basicLength = output.length;
      if (basicLength) {
        output.push(delimiter);
      }
      while (handledCPCount < inputLength) {
        for (m = maxInt, j = 0; j < inputLength; ++j) {
          currentValue = input[j];
          if (currentValue >= n && currentValue < m) {
            m = currentValue;
          }
        }
        handledCPCountPlusOne = handledCPCount + 1;
        if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
          error('overflow');
        }
        delta += (m - n) * handledCPCountPlusOne;
        n = m;
        for (j = 0; j < inputLength; ++j) {
          currentValue = input[j];
          if (currentValue < n && ++delta > maxInt) {
            error('overflow');
          }
          if (currentValue == n) {
            for (q = delta, k = base;; k += base) {
              t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
              if (q < t) {
                break;
              }
              qMinusT = q - t;
              baseMinusT = base - t;
              output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0)));
              q = floor(qMinusT / baseMinusT);
            }
            output.push(stringFromCharCode(digitToBasic(q, 0)));
            bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
            delta = 0;
            ++handledCPCount;
          }
        }
        ++delta;
        ++n;
      }
      return output.join('');
    }
    function toUnicode(domain) {
      return mapDomain(domain, function (string) {
        return regexPunycode.test(string) ? decode(string.slice(4).toLowerCase()) : string;
      });
    }
    function toASCII(domain) {
      return mapDomain(domain, function (string) {
        return regexNonASCII.test(string) ? 'xn--' + encode(string) : string;
      });
    }
    punycode = {
      'version': '1.2.3',
      'ucs2': {
        'decode': ucs2decode,
        'encode': ucs2encode
      },
      'decode': decode,
      'encode': encode,
      'toASCII': toASCII,
      'toUnicode': toUnicode
    };
    if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
      define(function () {
        return punycode;
      });
    } else if (freeExports && !freeExports.nodeType) {
      if (freeModule) {
        freeModule.exports = punycode;
      } else {
        for (key in punycode) {
          punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
        }
      }
    } else {
      root.punycode = punycode;
    }
  }(this));
  return exports;
}({});
urijs_1141_src_IPv6_debug = function (exports) {
  (function (root, factory) {
    'use strict';
    if (true) {
      exports = factory();
    } else if (typeof define === 'function' && define.amd) {
      define(factory);
    } else {
      root.IPv6 = factory(root);
    }
  }(this, function (root) {
    'use strict';
    var _IPv6 = root && root.IPv6;
    function bestPresentation(address) {
      var _address = address.toLowerCase();
      var segments = _address.split(':');
      var length = segments.length;
      var total = 8;
      if (segments[0] === '' && segments[1] === '' && segments[2] === '') {
        segments.shift();
        segments.shift();
      } else if (segments[0] === '' && segments[1] === '') {
        segments.shift();
      } else if (segments[length - 1] === '' && segments[length - 2] === '') {
        segments.pop();
      }
      length = segments.length;
      if (segments[length - 1].indexOf('.') !== -1) {
        total = 7;
      }
      var pos;
      for (pos = 0; pos < length; pos++) {
        if (segments[pos] === '') {
          break;
        }
      }
      if (pos < total) {
        segments.splice(pos, 1, '0000');
        while (segments.length < total) {
          segments.splice(pos, 0, '0000');
        }
        length = segments.length;
      }
      var _segments;
      for (var i = 0; i < total; i++) {
        _segments = segments[i].split('');
        for (var j = 0; j < 3; j++) {
          if (_segments[0] === '0' && _segments.length > 1) {
            _segments.splice(0, 1);
          } else {
            break;
          }
        }
        segments[i] = _segments.join('');
      }
      var best = -1;
      var _best = 0;
      var _current = 0;
      var current = -1;
      var inzeroes = false;
      for (i = 0; i < total; i++) {
        if (inzeroes) {
          if (segments[i] === '0') {
            _current += 1;
          } else {
            inzeroes = false;
            if (_current > _best) {
              best = current;
              _best = _current;
            }
          }
        } else {
          if (segments[i] === '0') {
            inzeroes = true;
            current = i;
            _current = 1;
          }
        }
      }
      if (_current > _best) {
        best = current;
        _best = _current;
      }
      if (_best > 1) {
        segments.splice(best, _best, '');
      }
      length = segments.length;
      var result = '';
      if (segments[0] === '') {
        result = ':';
      }
      for (i = 0; i < length; i++) {
        result += segments[i];
        if (i === length - 1) {
          break;
        }
        result += ':';
      }
      if (segments[length - 1] === '') {
        result += ':';
      }
      return result;
    }
    function noConflict() {
      if (root.IPv6 === this) {
        root.IPv6 = _IPv6;
      }
      return this;
    }
    return {
      best: bestPresentation,
      noConflict: noConflict
    };
  }));
  return exports;
}({});
urijs_1141_src_SecondLevelDomains_debug = function (exports) {
  (function (root, factory) {
    'use strict';
    if (true) {
      exports = factory();
    } else if (typeof define === 'function' && define.amd) {
      define(factory);
    } else {
      root.SecondLevelDomains = factory(root);
    }
  }(this, function (root) {
    'use strict';
    var _SecondLevelDomains = root && root.SecondLevelDomains;
    var SLD = {
        list: {
          'ac': ' com gov mil net org ',
          'ae': ' ac co gov mil name net org pro sch ',
          'af': ' com edu gov net org ',
          'al': ' com edu gov mil net org ',
          'ao': ' co ed gv it og pb ',
          'ar': ' com edu gob gov int mil net org tur ',
          'at': ' ac co gv or ',
          'au': ' asn com csiro edu gov id net org ',
          'ba': ' co com edu gov mil net org rs unbi unmo unsa untz unze ',
          'bb': ' biz co com edu gov info net org store tv ',
          'bh': ' biz cc com edu gov info net org ',
          'bn': ' com edu gov net org ',
          'bo': ' com edu gob gov int mil net org tv ',
          'br': ' adm adv agr am arq art ato b bio blog bmd cim cng cnt com coop ecn edu eng esp etc eti far flog fm fnd fot fst g12 ggf gov imb ind inf jor jus lel mat med mil mus net nom not ntr odo org ppg pro psc psi qsl rec slg srv tmp trd tur tv vet vlog wiki zlg ',
          'bs': ' com edu gov net org ',
          'bz': ' du et om ov rg ',
          'ca': ' ab bc mb nb nf nl ns nt nu on pe qc sk yk ',
          'ck': ' biz co edu gen gov info net org ',
          'cn': ' ac ah bj com cq edu fj gd gov gs gx gz ha hb he hi hl hn jl js jx ln mil net nm nx org qh sc sd sh sn sx tj tw xj xz yn zj ',
          'co': ' com edu gov mil net nom org ',
          'cr': ' ac c co ed fi go or sa ',
          'cy': ' ac biz com ekloges gov ltd name net org parliament press pro tm ',
          'do': ' art com edu gob gov mil net org sld web ',
          'dz': ' art asso com edu gov net org pol ',
          'ec': ' com edu fin gov info med mil net org pro ',
          'eg': ' com edu eun gov mil name net org sci ',
          'er': ' com edu gov ind mil net org rochest w ',
          'es': ' com edu gob nom org ',
          'et': ' biz com edu gov info name net org ',
          'fj': ' ac biz com info mil name net org pro ',
          'fk': ' ac co gov net nom org ',
          'fr': ' asso com f gouv nom prd presse tm ',
          'gg': ' co net org ',
          'gh': ' com edu gov mil org ',
          'gn': ' ac com gov net org ',
          'gr': ' com edu gov mil net org ',
          'gt': ' com edu gob ind mil net org ',
          'gu': ' com edu gov net org ',
          'hk': ' com edu gov idv net org ',
          'hu': ' 2000 agrar bolt casino city co erotica erotika film forum games hotel info ingatlan jogasz konyvelo lakas media news org priv reklam sex shop sport suli szex tm tozsde utazas video ',
          'id': ' ac co go mil net or sch web ',
          'il': ' ac co gov idf k12 muni net org ',
          'in': ' ac co edu ernet firm gen gov i ind mil net nic org res ',
          'iq': ' com edu gov i mil net org ',
          'ir': ' ac co dnssec gov i id net org sch ',
          'it': ' edu gov ',
          'je': ' co net org ',
          'jo': ' com edu gov mil name net org sch ',
          'jp': ' ac ad co ed go gr lg ne or ',
          'ke': ' ac co go info me mobi ne or sc ',
          'kh': ' com edu gov mil net org per ',
          'ki': ' biz com de edu gov info mob net org tel ',
          'km': ' asso com coop edu gouv k medecin mil nom notaires pharmaciens presse tm veterinaire ',
          'kn': ' edu gov net org ',
          'kr': ' ac busan chungbuk chungnam co daegu daejeon es gangwon go gwangju gyeongbuk gyeonggi gyeongnam hs incheon jeju jeonbuk jeonnam k kg mil ms ne or pe re sc seoul ulsan ',
          'kw': ' com edu gov net org ',
          'ky': ' com edu gov net org ',
          'kz': ' com edu gov mil net org ',
          'lb': ' com edu gov net org ',
          'lk': ' assn com edu gov grp hotel int ltd net ngo org sch soc web ',
          'lr': ' com edu gov net org ',
          'lv': ' asn com conf edu gov id mil net org ',
          'ly': ' com edu gov id med net org plc sch ',
          'ma': ' ac co gov m net org press ',
          'mc': ' asso tm ',
          'me': ' ac co edu gov its net org priv ',
          'mg': ' com edu gov mil nom org prd tm ',
          'mk': ' com edu gov inf name net org pro ',
          'ml': ' com edu gov net org presse ',
          'mn': ' edu gov org ',
          'mo': ' com edu gov net org ',
          'mt': ' com edu gov net org ',
          'mv': ' aero biz com coop edu gov info int mil museum name net org pro ',
          'mw': ' ac co com coop edu gov int museum net org ',
          'mx': ' com edu gob net org ',
          'my': ' com edu gov mil name net org sch ',
          'nf': ' arts com firm info net other per rec store web ',
          'ng': ' biz com edu gov mil mobi name net org sch ',
          'ni': ' ac co com edu gob mil net nom org ',
          'np': ' com edu gov mil net org ',
          'nr': ' biz com edu gov info net org ',
          'om': ' ac biz co com edu gov med mil museum net org pro sch ',
          'pe': ' com edu gob mil net nom org sld ',
          'ph': ' com edu gov i mil net ngo org ',
          'pk': ' biz com edu fam gob gok gon gop gos gov net org web ',
          'pl': ' art bialystok biz com edu gda gdansk gorzow gov info katowice krakow lodz lublin mil net ngo olsztyn org poznan pwr radom slupsk szczecin torun warszawa waw wroc wroclaw zgora ',
          'pr': ' ac biz com edu est gov info isla name net org pro prof ',
          'ps': ' com edu gov net org plo sec ',
          'pw': ' belau co ed go ne or ',
          'ro': ' arts com firm info nom nt org rec store tm www ',
          'rs': ' ac co edu gov in org ',
          'sb': ' com edu gov net org ',
          'sc': ' com edu gov net org ',
          'sh': ' co com edu gov net nom org ',
          'sl': ' com edu gov net org ',
          'st': ' co com consulado edu embaixada gov mil net org principe saotome store ',
          'sv': ' com edu gob org red ',
          'sz': ' ac co org ',
          'tr': ' av bbs bel biz com dr edu gen gov info k12 name net org pol tel tsk tv web ',
          'tt': ' aero biz cat co com coop edu gov info int jobs mil mobi museum name net org pro tel travel ',
          'tw': ' club com ebiz edu game gov idv mil net org ',
          'mu': ' ac co com gov net or org ',
          'mz': ' ac co edu gov org ',
          'na': ' co com ',
          'nz': ' ac co cri geek gen govt health iwi maori mil net org parliament school ',
          'pa': ' abo ac com edu gob ing med net nom org sld ',
          'pt': ' com edu gov int net nome org publ ',
          'py': ' com edu gov mil net org ',
          'qa': ' com edu gov mil net org ',
          're': ' asso com nom ',
          'ru': ' ac adygeya altai amur arkhangelsk astrakhan bashkiria belgorod bir bryansk buryatia cbg chel chelyabinsk chita chukotka chuvashia com dagestan e-burg edu gov grozny int irkutsk ivanovo izhevsk jar joshkar-ola kalmykia kaluga kamchatka karelia kazan kchr kemerovo khabarovsk khakassia khv kirov koenig komi kostroma kranoyarsk kuban kurgan kursk lipetsk magadan mari mari-el marine mil mordovia mosreg msk murmansk nalchik net nnov nov novosibirsk nsk omsk orenburg org oryol penza perm pp pskov ptz rnd ryazan sakhalin samara saratov simbirsk smolensk spb stavropol stv surgut tambov tatarstan tom tomsk tsaritsyn tsk tula tuva tver tyumen udm udmurtia ulan-ude vladikavkaz vladimir vladivostok volgograd vologda voronezh vrn vyatka yakutia yamal yekaterinburg yuzhno-sakhalinsk ',
          'rw': ' ac co com edu gouv gov int mil net ',
          'sa': ' com edu gov med net org pub sch ',
          'sd': ' com edu gov info med net org tv ',
          'se': ' a ac b bd c d e f g h i k l m n o org p parti pp press r s t tm u w x y z ',
          'sg': ' com edu gov idn net org per ',
          'sn': ' art com edu gouv org perso univ ',
          'sy': ' com edu gov mil net news org ',
          'th': ' ac co go in mi net or ',
          'tj': ' ac biz co com edu go gov info int mil name net nic org test web ',
          'tn': ' agrinet com defense edunet ens fin gov ind info intl mincom nat net org perso rnrt rns rnu tourism ',
          'tz': ' ac co go ne or ',
          'ua': ' biz cherkassy chernigov chernovtsy ck cn co com crimea cv dn dnepropetrovsk donetsk dp edu gov if in ivano-frankivsk kh kharkov kherson khmelnitskiy kiev kirovograd km kr ks kv lg lugansk lutsk lviv me mk net nikolaev od odessa org pl poltava pp rovno rv sebastopol sumy te ternopil uzhgorod vinnica vn zaporizhzhe zhitomir zp zt ',
          'ug': ' ac co go ne or org sc ',
          'uk': ' ac bl british-library co cym gov govt icnet jet lea ltd me mil mod national-library-scotland nel net nhs nic nls org orgn parliament plc police sch scot soc ',
          'us': ' dni fed isa kids nsn ',
          'uy': ' com edu gub mil net org ',
          've': ' co com edu gob info mil net org web ',
          'vi': ' co com k12 net org ',
          'vn': ' ac biz com edu gov health info int name net org pro ',
          'ye': ' co com gov ltd me net org plc ',
          'yu': ' ac co edu gov org ',
          'za': ' ac agric alt bourse city co cybernet db edu gov grondar iaccess imt inca landesign law mil net ngo nis nom olivetti org pix school tm web ',
          'zm': ' ac co com edu gov net org sch '
        },
        has: function (domain) {
          var tldOffset = domain.lastIndexOf('.');
          if (tldOffset <= 0 || tldOffset >= domain.length - 1) {
            return false;
          }
          var sldOffset = domain.lastIndexOf('.', tldOffset - 1);
          if (sldOffset <= 0 || sldOffset >= tldOffset - 1) {
            return false;
          }
          var sldList = SLD.list[domain.slice(tldOffset + 1)];
          if (!sldList) {
            return false;
          }
          return sldList.indexOf(' ' + domain.slice(sldOffset + 1, tldOffset) + ' ') >= 0;
        },
        is: function (domain) {
          var tldOffset = domain.lastIndexOf('.');
          if (tldOffset <= 0 || tldOffset >= domain.length - 1) {
            return false;
          }
          var sldOffset = domain.lastIndexOf('.', tldOffset - 1);
          if (sldOffset >= 0) {
            return false;
          }
          var sldList = SLD.list[domain.slice(tldOffset + 1)];
          if (!sldList) {
            return false;
          }
          return sldList.indexOf(' ' + domain.slice(0, tldOffset) + ' ') >= 0;
        },
        get: function (domain) {
          var tldOffset = domain.lastIndexOf('.');
          if (tldOffset <= 0 || tldOffset >= domain.length - 1) {
            return null;
          }
          var sldOffset = domain.lastIndexOf('.', tldOffset - 1);
          if (sldOffset <= 0 || sldOffset >= tldOffset - 1) {
            return null;
          }
          var sldList = SLD.list[domain.slice(tldOffset + 1)];
          if (!sldList) {
            return null;
          }
          if (sldList.indexOf(' ' + domain.slice(sldOffset + 1, tldOffset) + ' ') < 0) {
            return null;
          }
          return domain.slice(sldOffset + 1);
        },
        noConflict: function () {
          if (root.SecondLevelDomains === this) {
            root.SecondLevelDomains = _SecondLevelDomains;
          }
          return this;
        }
      };
    return SLD;
  }));
  return exports;
}({});
handlebars_runtime_130_dist_cjs_handlebars_safe_string_debug = function (exports) {
  'use strict';
  function SafeString(string) {
    this.string = string;
  }
  SafeString.prototype.toString = function () {
    return '' + this.string;
  };
  exports['default'] = SafeString;
  return exports;
}({});
handlebars_runtime_130_dist_cjs_handlebars_exception_debug = function (exports) {
  'use strict';
  var errorProps = [
      'description',
      'fileName',
      'lineNumber',
      'message',
      'name',
      'number',
      'stack'
    ];
  function Exception(message, node) {
    var line;
    if (node && node.firstLine) {
      line = node.firstLine;
      message += ' - ' + line + ':' + node.firstColumn;
    }
    var tmp = Error.prototype.constructor.call(this, message);
    for (var idx = 0; idx < errorProps.length; idx++) {
      this[errorProps[idx]] = tmp[errorProps[idx]];
    }
    if (line) {
      this.lineNumber = line;
      this.column = node.firstColumn;
    }
  }
  Exception.prototype = new Error();
  exports['default'] = Exception;
  return exports;
}({});
import_style_100_index_debug = function (exports) {
  var RE_NON_WORD = /\W/g;
  var doc = document;
  var head = document.getElementsByTagName('head')[0] || document.documentElement;
  var styleNode;
  exports = importStyle;
  function importStyle(cssText, id) {
    if (id) {
      id = id.replace(RE_NON_WORD, '-');
      if (doc.getElementById(id))
        return;
    }
    var element;
    if (!styleNode || id) {
      element = doc.createElement('style');
      id && (element.id = id);
      head.appendChild(element);
    } else {
      element = styleNode;
    }
    if (element.styleSheet) {
      if (doc.getElementsByTagName('style').length > 31) {
        throw new Error('Exceed the maximal count of style tags in IE');
      }
      element.styleSheet.cssText += cssText;
    } else {
      element.appendChild(doc.createTextNode(cssText));
    }
    if (!id) {
      styleNode = element;
    }
  }
  return exports;
}();
detail_001_index_debugcssjs = function () {
  import_style_100_index_debug('html{font-family:sans-serif;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%;}body{margin:0;}article,aside,details,figcaption,figure,footer,header,hgroup,main,nav,section,summary{display:block;}audio,canvas,progress,video{display:inline-block;vertical-align:baseline;}audio:not([controls]){display:none;height:0;}[hidden],template{display:none;}a{background:transparent;}a:active,a:hover{outline:0;}abbr[title]{border-bottom:1px dotted;}b,strong{font-weight:bold;}dfn{font-style:italic;}h1{font-size:2em;margin:0.67em 0;}mark{background:#ff0;color:#000;}small{font-size:80%;}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline;}sup{top:-0.5em;}sub{bottom:-0.25em;}img{border:0;}svg:not(:root){overflow:hidden;}figure{margin:1em 40px;}hr{-moz-box-sizing:content-box;box-sizing:content-box;height:0;}pre{overflow:auto;}code,kbd,pre,samp{font-family:monospace, monospace;font-size:1em;}button,input,optgroup,select,textarea{color:inherit;font:inherit;margin:0;}button{overflow:visible;}button,select{text-transform:none;}button,html input[type="button"],input[type="reset"],input[type="submit"]{-webkit-appearance:button;cursor:pointer;}button[disabled],html input[disabled]{cursor:default;}button::-moz-focus-inner,input::-moz-focus-inner{border:0;padding:0;}input{line-height:normal;}input[type="checkbox"],input[type="radio"]{box-sizing:border-box;padding:0;}input[type="number"]::-webkit-inner-spin-button,input[type="number"]::-webkit-outer-spin-button{height:auto;}input[type="search"]{-webkit-appearance:textfield;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;box-sizing:content-box;}input[type="search"]::-webkit-search-cancel-button,input[type="search"]::-webkit-search-decoration{-webkit-appearance:none;}fieldset{border:1px solid #c0c0c0;margin:0 2px;padding:0.35em 0.625em 0.75em;}legend{border:0;padding:0;}textarea{overflow:auto;}optgroup{font-weight:bold;}table{border-collapse:collapse;border-spacing:0;}td,th{padding:0;}li{list-style:none;}button{outline:none;}@-webkit-keyframes rollIn{0%{-webkit-transform:translateX(100%) rotate(360deg);transform:translateX(100%) rotate(360deg);}100%{-webkit-transform:translateX(0) rotate(0deg);transform:translateX(0) rotate(0deg);}}@keyframes rollIn{0%{-webkit-transform:translateX(100%) rotate(0deg);transform:translateX(100%) rotate(0deg);}100%{-webkit-transform:translateX(0) rotate(360deg);transform:translateX(0) rotate(360deg);}}@-webkit-keyframes rollOut{0%{-webkit-transform:translateX(0) rotate(0deg);transform:translateX(0) rotate(0deg);}100%{-webkit-transform:translateX(100%) rotate(360deg);transform:translateX(100%) rotate(360deg);}}@keyframes rollOut{0%{-webkit-transform:translateX(0) rotate(0deg);transform:translateX(0) rotate(0deg);}100%{-webkit-transform:translateX(100%) rotate(360deg);transform:translateX(100%) rotate(360deg);}}@-webkit-keyframes loading{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg);}100%{-webkit-transform:rotate(5000deg);transform:rotate(5000deg);}}@keyframes loading{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg);}100%{-webkit-transform:rotate(5000deg);transform:rotate(5000deg);}}*{padding:0;margin:0;}.btn{border:none;background:none;}.price .price-unit{font-family:Verdana;}.price .figure{font-family:Arial;}body{position:relative;}#loading{position:absolute;left:0;top:0;width:100%;text-align:center;}#loading span{display:inline-block;background-image:url(http://unesmall.b0.upaiyun.com/common/images/loading_icon.png);background-repeat:no-repeat;background-position:center center;background-size:48px 48px;min-width:48px;min-height:48px;-webkit-animation-name:loading;animation-name:loading;-webkit-animation-duration:10s;animation-duration:10s;-webkit-animation-timing-function:ease-out;animation-timing-function:ease-out;}#content{background:#e6e6e6;padding-bottom:49px;}#item-info{background:#fff;}#pic-carousel{}#pic-carousel .carousel-outer{width:100%;overflow:hidden;position:relative;margin:0 auto;}#pic-carousel .carousel-wrap{position:absolute;}#pic-carousel .carousel-wrap .pic{float:left;display:table;table-layout:fixed;}#pic-carousel .carousel-wrap .pic-wrap{display:table-cell;vertical-align:middle;}#pic-carousel .carousel-wrap .pic-wrap img{width:100%;}#pic-carousel .carousel-status{text-align:center;}#pic-carousel .carousel-status{text-align:center;}#pic-carousel .carousel-status span{display:inline-block;width:7px;height:7px;border-radius:2px;background:#e7e7e7;margin-left:5px;}#pic-carousel .carousel-status span:first-child{margin-left:0;}#pic-carousel .carousel-status span.sel{background:#9cc54e;}#price{margin-top:5px;height:32px;line-height:32px;padding:0 8px;overflow:hidden;}#price .current-price{font-size:18px;color:#9cc54e;}#price .original-price{font-size:14px;color:#959595;margin-left:5px;}#price .sold{float:right;font-size:14px;color:#9cc54e;}#summary h1{border-top:1px solid #e6e6e6;border-bottom:1px solid #e6e6e6;margin-top:10px;height:48px;line-height:48px;font-size:18px;color:#666;padding:0 14px;}#summary ul{padding:8px 14px;overflow:hidden;font-size:14px;line-height:21px;color:#666;}#summary .attr{overflow:hidden;font-size:14px;line-height:20px;}#summary .attr-title{float:left;font-weight:bold;width:42px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}#summary .attr-content{padding-left:42px;}#item-desc{background:#fff;margin-top:10px;}#item-desc .pic{min-height:100px;}#item-desc img{margin-top:10px;width:100%;display:block;}#item-desc img:first-child{margin-top:0;}#toolbar{position:fixed;border-top:1px solid #ccc;bottom:0;left:0;width:100%;padding:6px 0;text-align:center;word-spacing:7px;height:37px;background:#fff;}#toolbar button{height:37px;padding:0 15px;border-radius:4px;background:#f0642b;border:none;font-size:16px;color:#fff;}#mask{position:fixed;left:0;top:0;width:100%;height:100%;background:#000;opacity:.7;}#order-popup{position:fixed;left:0;bottom:-267px;width:100%;background:#fff;-webkit-transition:all .3s;transition:all .3s;}#order-popup.popup-pullup{bottom:0;}#order-popup .popup-wrap{padding:15px 14px 0;position:relative;}#order-popup .close-btn{height:50px;position:absolute;right:14px;top:15px;font-size:30px;font-weight:bold;color:#ccc;-webkit-transform:rotate(45deg);transform:rotate(45deg);}#order-popup .order-info{height:50px;}#order-popup .order-info .item-pic{width:50px;height:50px;float:left;margin-right:10px;position:relative;}#order-popup .order-info .item-pic::before{border:1px solid #e3e3e3;width:100%;height:100%;box-sizing:border-box;position:absolute;left:0;top:0;content:" ";}#order-popup .order-info .item-pic img{display:block;width:100%;height:100%;}#order-popup .order-info .item-title{margin-top:6px;font-size:14px;line-height:20px;}#order-popup .order-info .item-price{font-size:12px;line-height:18px;color:#f0642b;}#order-popup .order-count{margin-top:15px;border-top:1px solid #ddd;border-bottom:1px solid #ddd;height:66px;overflow:hidden;}#order-popup .order-count label{line-height:66px;font-size:14px;color:#666;float:left;}#order-popup .order-count .form-control{float:right;margin-top:15px;height:34px;position:relative;text-align:center;padding:0 35px;border:1px solid #b2b2b2;border-radius:2px;}#order-popup .order-count .form-control input{font-size:12px;color:#5f5f5f;width:38px;height:34px;text-align:center;border:none;}#order-popup .order-count .form-control input[type=number]::-webkit-inner-spin-button,#order-popup .order-count .form-control input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0;}#order-popup .order-count .form-control .minus-btn,#order-popup .order-count .form-control .plus-btn{display:block;width:35px;line-height:34px;font-size:20px;color:#5f5f5f;text-align:center;position:absolute;}#order-popup .order-count .form-control .minus-btn{left:0;top:0;border-right:1px solid #b2b2b2;}#order-popup .order-count .form-control .plus-btn{right:0;top:0;border-left:1px solid #b2b2b2;}#order-popup .popup-footer{margin-top:66px;padding:5px 0;}#order-popup .popup-footer .confirm-btn{height:37px;width:100%;text-align:center;border-radius:4px;background:#f0642b;font-size:16px;color:#fff;}#order-popup .popup-footer .confirm-btn.btn-busy{background:#ccc;}#must-follow{position:absolute;top:0;left:0;width:100%;height:100%;background-image:url(http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20150106/vNTT-0-1420541007403.png);background-position:top center;background-color:rgba(0, 0, 0, .7);background-repeat:no-repeat;background-size:100% auto;z-index:99999;}#cart{position:fixed;right:0;bottom:50px;width:56px;height:56px;}#cart img{width:100%;height:100%;display:block;}.rollOut{display:none;}.rollIn{display:block;}.tbtx-broadcast{position:fixed;left:-9999px;top:-9999px;background:rgba(0, 0, 0, 0.8);color:#fff;font-size:14px;line-height:36px;z-index:9999;}.tbtx-broadcast p{padding:0 15px;}');
}();
anima_yocto_core_110_index_debug = function (exports) {
  var core = anima_yocto_core_110_src_core_debug;
  exports = core;
  return exports;
}();
anima_yocto_event_102_src_event_debug = function (exports) {
  var $ = anima_yocto_core_110_index_debug;
  var _zid = 1, undefined, slice = Array.prototype.slice, isFunction = $.isFunction, isString = function (obj) {
      return typeof obj == 'string';
    }, handlers = {}, specialEvents = {};
  specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents';
  function zid(element) {
    return element._zid || (element._zid = _zid++);
  }
  function findHandlers(element, event, fn, selector) {
    event = parse(event);
    if (event.ns)
      var matcher = matcherFor(event.ns);
    return (handlers[zid(element)] || []).filter(function (handler) {
      return handler && (!event.e || handler.e == event.e) && (!event.ns || matcher.test(handler.ns)) && (!fn || zid(handler.fn) === zid(fn)) && (!selector || handler.sel == selector);
    });
  }
  function parse(event) {
    var parts = ('' + event).split('.');
    return {
      e: parts[0],
      ns: parts.slice(1).sort().join(' ')
    };
  }
  function matcherFor(ns) {
    return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)');
  }
  function eventCapture(handler, captureSetting) {
    return handler.del && (handler.e === 'focus' || handler.e === 'blur') || !!captureSetting;
  }
  function add(element, events, fn, data, selector, delegator, capture) {
    var id = zid(element), set = handlers[id] || (handlers[id] = []);
    events.split(/\s/).forEach(function (event) {
      if (event == 'ready')
        return $(document).ready(fn);
      var handler = parse(event);
      handler.fn = fn;
      handler.sel = selector;
      handler.del = delegator;
      var callback = delegator || fn;
      handler.proxy = function (e) {
        if (navigator.userAgent.toLowerCase().indexOf('android') > -1 && $.gestures && $.gestures.tap && handler.e === 'click' && !e.animaClick) {
          if (e.stopImmediatePropagation) {
            e.stopImmediatePropagation();
          } else {
            e.propagationStopped = true;
          }
          e.stopPropagation();
          e.preventDefault();
          return false;
        }
        e = compatible(e);
        if (e.isImmediatePropagationStopped())
          return;
        e.data = data;
        var result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args));
        if (result === false)
          e.preventDefault(), e.stopPropagation();
        return result;
      };
      handler.i = set.length;
      set.push(handler);
      if ('addEventListener' in element) {
        if ($.gestures && $.gestures.list && $.gestures.list[handler.e]) {
          $.gestures.list[handler.e](element);
        }
        element.addEventListener(handler.e, handler.proxy, eventCapture(handler, capture));
      }
    });
  }
  function remove(element, events, fn, selector, capture) {
    var id = zid(element);
    (events || '').split(/\s/).forEach(function (event) {
      findHandlers(element, event, fn, selector).forEach(function (handler) {
        delete handlers[id][handler.i];
        if ('removeEventListener' in element)
          element.removeEventListener(handler.e, handler.proxy, eventCapture(handler, capture));
      });
    });
  }
  $.event = {
    add: add,
    remove: remove
  };
  $.proxy = function (fn, context) {
    if (isFunction(fn)) {
      var proxyFn = function () {
        return fn.apply(context, arguments);
      };
      proxyFn._zid = zid(fn);
      return proxyFn;
    } else if (isString(context)) {
      return $.proxy(fn[context], fn);
    } else {
      throw new TypeError('expected function');
    }
  };
  $.fn.one = function (event, selector, data, callback) {
    return this.on(event, selector, data, callback, 1);
  };
  var returnTrue = function () {
      return true;
    }, returnFalse = function () {
      return false;
    }, ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$)/, eventMethods = {
      preventDefault: 'isDefaultPrevented',
      stopImmediatePropagation: 'isImmediatePropagationStopped',
      stopPropagation: 'isPropagationStopped'
    };
  function compatible(event, source) {
    if (source || !event.isDefaultPrevented) {
      source || (source = event);
      $.each(eventMethods, function (name, predicate) {
        var sourceMethod = source[name];
        event[name] = function () {
          this[predicate] = returnTrue;
          return sourceMethod && sourceMethod.apply(source, arguments);
        };
        event[predicate] = returnFalse;
      });
      if (source.defaultPrevented !== undefined ? source.defaultPrevented : 'returnValue' in source ? source.returnValue === false : source.getPreventDefault && source.getPreventDefault())
        event.isDefaultPrevented = returnTrue;
    }
    return event;
  }
  function createProxy(event) {
    var key, proxy = { originalEvent: event };
    for (key in event)
      if (!ignoreProperties.test(key) && event[key] !== undefined)
        proxy[key] = event[key];
    return compatible(proxy, event);
  }
  $.fn.on = function (event, selector, data, callback, one) {
    var autoRemove, delegator, $this = this;
    if (event && !isString(event)) {
      $.each(event, function (type, fn) {
        $this.on(type, selector, data, fn, one);
      });
      return $this;
    }
    if (!isString(selector) && !isFunction(callback) && callback !== false)
      callback = data, data = selector, selector = undefined;
    if (isFunction(data) || data === false)
      callback = data, data = undefined;
    if (callback === false)
      callback = returnFalse;
    return $this.each(function (_, element) {
      if (one)
        autoRemove = function (e) {
          remove(element, e.type, callback);
          return callback.apply(this, arguments);
        };
      if (selector)
        delegator = function (e) {
          var evt, match = $(e.target).closest(selector, element).get(0);
          if (match && match !== element) {
            evt = $.extend(createProxy(e), {
              currentTarget: match,
              liveFired: element
            });
            return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)));
          }
        };
      add(element, event, callback, data, selector, delegator || autoRemove);
    });
  };
  $.fn.off = function (event, selector, callback) {
    var $this = this;
    if (event && !isString(event)) {
      $.each(event, function (type, fn) {
        $this.off(type, selector, fn);
      });
      return $this;
    }
    if (!isString(selector) && !isFunction(callback) && callback !== false)
      callback = selector, selector = undefined;
    if (callback === false)
      callback = returnFalse;
    return $this.each(function () {
      remove(this, event, callback, selector);
    });
  };
  $.fn.trigger = function (event, args) {
    event = isString(event) || $.isPlainObject(event) ? $.Event(event) : compatible(event);
    event._args = args;
    return this.each(function () {
      if ('dispatchEvent' in this)
        this.dispatchEvent(event);
      else
        $(this).triggerHandler(event, args);
    });
  };
  $.fn.triggerHandler = function (event, args) {
    var e, result;
    this.each(function (i, element) {
      e = createProxy(isString(event) ? $.Event(event) : event);
      e._args = args;
      e.target = element;
      $.each(findHandlers(element, event.type || event), function (i, handler) {
        result = handler.proxy(e);
        if (e.isImmediatePropagationStopped())
          return false;
      });
    });
    return result;
  };
  ('focusin focusout load resize scroll unload click dblclick ' + 'change select keydown keypress keyup error').split(' ').forEach(function (event) {
    $.fn[event] = function (callback) {
      return callback ? this.on(event, callback) : this.trigger(event);
    };
  });
  [
    'focus',
    'blur'
  ].forEach(function (name) {
    $.fn[name] = function (callback) {
      if (callback)
        this.on(name, callback);
      else
        this.each(function () {
          try {
            this[name]();
          } catch (e) {
          }
        });
      return this;
    };
  });
  $.Event = function (type, props) {
    if (!isString(type))
      props = type, type = props.type;
    var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true;
    if (props)
      for (var name in props)
        name == 'bubbles' ? bubbles = !!props[name] : event[name] = props[name];
    event.initEvent(type, bubbles, true);
    return compatible(event);
  };
  exports = $;
  return exports;
}();
anima_yocto_event_101_src_event_debug = function (exports) {
  var $ = anima_yocto_core_110_index_debug;
  var _zid = 1, undefined, slice = Array.prototype.slice, isFunction = $.isFunction, isString = function (obj) {
      return typeof obj == 'string';
    }, handlers = {}, specialEvents = {};
  specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents';
  function zid(element) {
    return element._zid || (element._zid = _zid++);
  }
  function findHandlers(element, event, fn, selector) {
    event = parse(event);
    if (event.ns)
      var matcher = matcherFor(event.ns);
    return (handlers[zid(element)] || []).filter(function (handler) {
      return handler && (!event.e || handler.e == event.e) && (!event.ns || matcher.test(handler.ns)) && (!fn || zid(handler.fn) === zid(fn)) && (!selector || handler.sel == selector);
    });
  }
  function parse(event) {
    var parts = ('' + event).split('.');
    return {
      e: parts[0],
      ns: parts.slice(1).sort().join(' ')
    };
  }
  function matcherFor(ns) {
    return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)');
  }
  function eventCapture(handler, captureSetting) {
    return handler.del && (handler.e === 'focus' || handler.e === 'blur') || !!captureSetting;
  }
  function add(element, events, fn, data, selector, delegator, capture) {
    var id = zid(element), set = handlers[id] || (handlers[id] = []);
    events.split(/\s/).forEach(function (event) {
      if (event == 'ready')
        return $(document).ready(fn);
      var handler = parse(event);
      handler.fn = fn;
      handler.sel = selector;
      handler.del = delegator;
      var callback = delegator || fn;
      handler.proxy = function (e) {
        e = compatible(e);
        if (e.isImmediatePropagationStopped())
          return;
        e.data = data;
        var result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args));
        if (result === false)
          e.preventDefault(), e.stopPropagation();
        return result;
      };
      handler.i = set.length;
      set.push(handler);
      if ('addEventListener' in element)
        element.addEventListener(handler.e, handler.proxy, eventCapture(handler, capture));
    });
  }
  function remove(element, events, fn, selector, capture) {
    var id = zid(element);
    (events || '').split(/\s/).forEach(function (event) {
      findHandlers(element, event, fn, selector).forEach(function (handler) {
        delete handlers[id][handler.i];
        if ('removeEventListener' in element)
          element.removeEventListener(handler.e, handler.proxy, eventCapture(handler, capture));
      });
    });
  }
  $.event = {
    add: add,
    remove: remove
  };
  $.proxy = function (fn, context) {
    if (isFunction(fn)) {
      var proxyFn = function () {
        return fn.apply(context, arguments);
      };
      proxyFn._zid = zid(fn);
      return proxyFn;
    } else if (isString(context)) {
      return $.proxy(fn[context], fn);
    } else {
      throw new TypeError('expected function');
    }
  };
  $.fn.one = function (event, selector, data, callback) {
    return this.on(event, selector, data, callback, 1);
  };
  var returnTrue = function () {
      return true;
    }, returnFalse = function () {
      return false;
    }, ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$)/, eventMethods = {
      preventDefault: 'isDefaultPrevented',
      stopImmediatePropagation: 'isImmediatePropagationStopped',
      stopPropagation: 'isPropagationStopped'
    };
  function compatible(event, source) {
    if (source || !event.isDefaultPrevented) {
      source || (source = event);
      $.each(eventMethods, function (name, predicate) {
        var sourceMethod = source[name];
        event[name] = function () {
          this[predicate] = returnTrue;
          return sourceMethod && sourceMethod.apply(source, arguments);
        };
        event[predicate] = returnFalse;
      });
      if (source.defaultPrevented !== undefined ? source.defaultPrevented : 'returnValue' in source ? source.returnValue === false : source.getPreventDefault && source.getPreventDefault())
        event.isDefaultPrevented = returnTrue;
    }
    return event;
  }
  function createProxy(event) {
    var key, proxy = { originalEvent: event };
    for (key in event)
      if (!ignoreProperties.test(key) && event[key] !== undefined)
        proxy[key] = event[key];
    return compatible(proxy, event);
  }
  $.fn.on = function (event, selector, data, callback, one) {
    var autoRemove, delegator, $this = this;
    if (event && !isString(event)) {
      $.each(event, function (type, fn) {
        $this.on(type, selector, data, fn, one);
      });
      return $this;
    }
    if (!isString(selector) && !isFunction(callback) && callback !== false)
      callback = data, data = selector, selector = undefined;
    if (isFunction(data) || data === false)
      callback = data, data = undefined;
    if (callback === false)
      callback = returnFalse;
    if ($.gestures && $.gestures.list && $.gestures.list[event]) {
      $.gestures.list[event]($this);
    }
    return $this.each(function (_, element) {
      if (one)
        autoRemove = function (e) {
          remove(element, e.type, callback);
          return callback.apply(this, arguments);
        };
      if (selector)
        delegator = function (e) {
          var evt, match = $(e.target).closest(selector, element).get(0);
          if (match && match !== element) {
            evt = $.extend(createProxy(e), {
              currentTarget: match,
              liveFired: element
            });
            return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)));
          }
        };
      add(element, event, callback, data, selector, delegator || autoRemove);
    });
  };
  $.fn.off = function (event, selector, callback) {
    var $this = this;
    if (event && !isString(event)) {
      $.each(event, function (type, fn) {
        $this.off(type, selector, fn);
      });
      return $this;
    }
    if (!isString(selector) && !isFunction(callback) && callback !== false)
      callback = selector, selector = undefined;
    if (callback === false)
      callback = returnFalse;
    return $this.each(function () {
      remove(this, event, callback, selector);
    });
  };
  $.fn.trigger = function (event, args) {
    event = isString(event) || $.isPlainObject(event) ? $.Event(event) : compatible(event);
    event._args = args;
    return this.each(function () {
      if ('dispatchEvent' in this)
        this.dispatchEvent(event);
      else
        $(this).triggerHandler(event, args);
    });
  };
  $.fn.triggerHandler = function (event, args) {
    var e, result;
    this.each(function (i, element) {
      e = createProxy(isString(event) ? $.Event(event) : event);
      e._args = args;
      e.target = element;
      $.each(findHandlers(element, event.type || event), function (i, handler) {
        result = handler.proxy(e);
        if (e.isImmediatePropagationStopped())
          return false;
      });
    });
    return result;
  };
  ('focusin focusout load resize scroll unload click dblclick ' + 'change select keydown keypress keyup error').split(' ').forEach(function (event) {
    $.fn[event] = function (callback) {
      return callback ? this.on(event, callback) : this.trigger(event);
    };
  });
  [
    'focus',
    'blur'
  ].forEach(function (name) {
    $.fn[name] = function (callback) {
      if (callback)
        this.on(name, callback);
      else
        this.each(function () {
          try {
            this[name]();
          } catch (e) {
          }
        });
      return this;
    };
  });
  $.Event = function (type, props) {
    if (!isString(type))
      props = type, type = props.type;
    var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true;
    if (props)
      for (var name in props)
        name == 'bubbles' ? bubbles = !!props[name] : event[name] = props[name];
    event.initEvent(type, bubbles, true);
    return compatible(event);
  };
  exports = $;
  return exports;
}();
urijs_1141_src_URI_debug = function (exports) {
  (function (root, factory) {
    'use strict';
    if (true) {
      exports = factory(urijs_1141_src_punycode_debug, urijs_1141_src_IPv6_debug, urijs_1141_src_SecondLevelDomains_debug);
    } else if (typeof define === 'function' && define.amd) {
      define([
        './punycode',
        './IPv6',
        './SecondLevelDomains'
      ], factory);
    } else {
      root.URI = factory(root.punycode, root.IPv6, root.SecondLevelDomains, root);
    }
  }(this, function (punycode, IPv6, SLD, root) {
    'use strict';
    var _URI = root && root.URI;
    function URI(url, base) {
      if (!(this instanceof URI)) {
        return new URI(url, base);
      }
      if (url === undefined) {
        if (typeof location !== 'undefined') {
          url = location.href + '';
        } else {
          url = '';
        }
      }
      this.href(url);
      if (base !== undefined) {
        return this.absoluteTo(base);
      }
      return this;
    }
    URI.version = '1.14.1';
    var p = URI.prototype;
    var hasOwn = Object.prototype.hasOwnProperty;
    function escapeRegEx(string) {
      return string.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
    }
    function getType(value) {
      if (value === undefined) {
        return 'Undefined';
      }
      return String(Object.prototype.toString.call(value)).slice(8, -1);
    }
    function isArray(obj) {
      return getType(obj) === 'Array';
    }
    function filterArrayValues(data, value) {
      var lookup = {};
      var i, length;
      if (isArray(value)) {
        for (i = 0, length = value.length; i < length; i++) {
          lookup[value[i]] = true;
        }
      } else {
        lookup[value] = true;
      }
      for (i = 0, length = data.length; i < length; i++) {
        if (lookup[data[i]] !== undefined) {
          data.splice(i, 1);
          length--;
          i--;
        }
      }
      return data;
    }
    function arrayContains(list, value) {
      var i, length;
      if (isArray(value)) {
        for (i = 0, length = value.length; i < length; i++) {
          if (!arrayContains(list, value[i])) {
            return false;
          }
        }
        return true;
      }
      var _type = getType(value);
      for (i = 0, length = list.length; i < length; i++) {
        if (_type === 'RegExp') {
          if (typeof list[i] === 'string' && list[i].match(value)) {
            return true;
          }
        } else if (list[i] === value) {
          return true;
        }
      }
      return false;
    }
    function arraysEqual(one, two) {
      if (!isArray(one) || !isArray(two)) {
        return false;
      }
      if (one.length !== two.length) {
        return false;
      }
      one.sort();
      two.sort();
      for (var i = 0, l = one.length; i < l; i++) {
        if (one[i] !== two[i]) {
          return false;
        }
      }
      return true;
    }
    URI._parts = function () {
      return {
        protocol: null,
        username: null,
        password: null,
        hostname: null,
        urn: null,
        port: null,
        path: null,
        query: null,
        fragment: null,
        duplicateQueryParameters: URI.duplicateQueryParameters,
        escapeQuerySpace: URI.escapeQuerySpace
      };
    };
    URI.duplicateQueryParameters = false;
    URI.escapeQuerySpace = true;
    URI.protocol_expression = /^[a-z][a-z0-9.+-]*$/i;
    URI.idn_expression = /[^a-z0-9\.-]/i;
    URI.punycode_expression = /(xn--)/i;
    URI.ip4_expression = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
    URI.ip6_expression = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;
    URI.find_uri_expression = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/gi;
    URI.findUri = {
      start: /\b(?:([a-z][a-z0-9.+-]*:\/\/)|www\.)/gi,
      end: /[\s\r\n]|$/,
      trim: /[`!()\[\]{};:'".,<>?«»“”„‘’]+$/
    };
    URI.defaultPorts = {
      http: '80',
      https: '443',
      ftp: '21',
      gopher: '70',
      ws: '80',
      wss: '443'
    };
    URI.invalid_hostname_characters = /[^a-zA-Z0-9\.-]/;
    URI.domAttributes = {
      'a': 'href',
      'blockquote': 'cite',
      'link': 'href',
      'base': 'href',
      'script': 'src',
      'form': 'action',
      'img': 'src',
      'area': 'href',
      'iframe': 'src',
      'embed': 'src',
      'source': 'src',
      'track': 'src',
      'input': 'src',
      'audio': 'src',
      'video': 'src'
    };
    URI.getDomAttribute = function (node) {
      if (!node || !node.nodeName) {
        return undefined;
      }
      var nodeName = node.nodeName.toLowerCase();
      if (nodeName === 'input' && node.type !== 'image') {
        return undefined;
      }
      return URI.domAttributes[nodeName];
    };
    function escapeForDumbFirefox36(value) {
      return escape(value);
    }
    function strictEncodeURIComponent(string) {
      return encodeURIComponent(string).replace(/[!'()*]/g, escapeForDumbFirefox36).replace(/\*/g, '%2A');
    }
    URI.encode = strictEncodeURIComponent;
    URI.decode = decodeURIComponent;
    URI.iso8859 = function () {
      URI.encode = escape;
      URI.decode = unescape;
    };
    URI.unicode = function () {
      URI.encode = strictEncodeURIComponent;
      URI.decode = decodeURIComponent;
    };
    URI.characters = {
      pathname: {
        encode: {
          expression: /%(24|26|2B|2C|3B|3D|3A|40)/gi,
          map: {
            '%24': '$',
            '%26': '&',
            '%2B': '+',
            '%2C': ',',
            '%3B': ';',
            '%3D': '=',
            '%3A': ':',
            '%40': '@'
          }
        },
        decode: {
          expression: /[\/\?#]/g,
          map: {
            '/': '%2F',
            '?': '%3F',
            '#': '%23'
          }
        }
      },
      reserved: {
        encode: {
          expression: /%(21|23|24|26|27|28|29|2A|2B|2C|2F|3A|3B|3D|3F|40|5B|5D)/gi,
          map: {
            '%3A': ':',
            '%2F': '/',
            '%3F': '?',
            '%23': '#',
            '%5B': '[',
            '%5D': ']',
            '%40': '@',
            '%21': '!',
            '%24': '$',
            '%26': '&',
            '%27': '\'',
            '%28': '(',
            '%29': ')',
            '%2A': '*',
            '%2B': '+',
            '%2C': ',',
            '%3B': ';',
            '%3D': '='
          }
        }
      }
    };
    URI.encodeQuery = function (string, escapeQuerySpace) {
      var escaped = URI.encode(string + '');
      if (escapeQuerySpace === undefined) {
        escapeQuerySpace = URI.escapeQuerySpace;
      }
      return escapeQuerySpace ? escaped.replace(/%20/g, '+') : escaped;
    };
    URI.decodeQuery = function (string, escapeQuerySpace) {
      string += '';
      if (escapeQuerySpace === undefined) {
        escapeQuerySpace = URI.escapeQuerySpace;
      }
      try {
        return URI.decode(escapeQuerySpace ? string.replace(/\+/g, '%20') : string);
      } catch (e) {
        return string;
      }
    };
    URI.recodePath = function (string) {
      var segments = (string + '').split('/');
      for (var i = 0, length = segments.length; i < length; i++) {
        segments[i] = URI.encodePathSegment(URI.decode(segments[i]));
      }
      return segments.join('/');
    };
    URI.decodePath = function (string) {
      var segments = (string + '').split('/');
      for (var i = 0, length = segments.length; i < length; i++) {
        segments[i] = URI.decodePathSegment(segments[i]);
      }
      return segments.join('/');
    };
    var _parts = {
        'encode': 'encode',
        'decode': 'decode'
      };
    var _part;
    var generateAccessor = function (_group, _part) {
      return function (string) {
        try {
          return URI[_part](string + '').replace(URI.characters[_group][_part].expression, function (c) {
            return URI.characters[_group][_part].map[c];
          });
        } catch (e) {
          return string;
        }
      };
    };
    for (_part in _parts) {
      URI[_part + 'PathSegment'] = generateAccessor('pathname', _parts[_part]);
    }
    URI.encodeReserved = generateAccessor('reserved', 'encode');
    URI.parse = function (string, parts) {
      var pos;
      if (!parts) {
        parts = {};
      }
      pos = string.indexOf('#');
      if (pos > -1) {
        parts.fragment = string.substring(pos + 1) || null;
        string = string.substring(0, pos);
      }
      pos = string.indexOf('?');
      if (pos > -1) {
        parts.query = string.substring(pos + 1) || null;
        string = string.substring(0, pos);
      }
      if (string.substring(0, 2) === '//') {
        parts.protocol = null;
        string = string.substring(2);
        string = URI.parseAuthority(string, parts);
      } else {
        pos = string.indexOf(':');
        if (pos > -1) {
          parts.protocol = string.substring(0, pos) || null;
          if (parts.protocol && !parts.protocol.match(URI.protocol_expression)) {
            parts.protocol = undefined;
          } else if (string.substring(pos + 1, pos + 3) === '//') {
            string = string.substring(pos + 3);
            string = URI.parseAuthority(string, parts);
          } else {
            string = string.substring(pos + 1);
            parts.urn = true;
          }
        }
      }
      parts.path = string;
      return parts;
    };
    URI.parseHost = function (string, parts) {
      var pos = string.indexOf('/');
      var bracketPos;
      var t;
      if (pos === -1) {
        pos = string.length;
      }
      if (string.charAt(0) === '[') {
        bracketPos = string.indexOf(']');
        parts.hostname = string.substring(1, bracketPos) || null;
        parts.port = string.substring(bracketPos + 2, pos) || null;
        if (parts.port === '/') {
          parts.port = null;
        }
      } else if (string.indexOf(':') !== string.lastIndexOf(':')) {
        parts.hostname = string.substring(0, pos) || null;
        parts.port = null;
      } else {
        t = string.substring(0, pos).split(':');
        parts.hostname = t[0] || null;
        parts.port = t[1] || null;
      }
      if (parts.hostname && string.substring(pos).charAt(0) !== '/') {
        pos++;
        string = '/' + string;
      }
      return string.substring(pos) || '/';
    };
    URI.parseAuthority = function (string, parts) {
      string = URI.parseUserinfo(string, parts);
      return URI.parseHost(string, parts);
    };
    URI.parseUserinfo = function (string, parts) {
      var firstSlash = string.indexOf('/');
      var pos = string.lastIndexOf('@', firstSlash > -1 ? firstSlash : string.length - 1);
      var t;
      if (pos > -1 && (firstSlash === -1 || pos < firstSlash)) {
        t = string.substring(0, pos).split(':');
        parts.username = t[0] ? URI.decode(t[0]) : null;
        t.shift();
        parts.password = t[0] ? URI.decode(t.join(':')) : null;
        string = string.substring(pos + 1);
      } else {
        parts.username = null;
        parts.password = null;
      }
      return string;
    };
    URI.parseQuery = function (string, escapeQuerySpace) {
      if (!string) {
        return {};
      }
      string = string.replace(/&+/g, '&').replace(/^\?*&*|&+$/g, '');
      if (!string) {
        return {};
      }
      var items = {};
      var splits = string.split('&');
      var length = splits.length;
      var v, name, value;
      for (var i = 0; i < length; i++) {
        v = splits[i].split('=');
        name = URI.decodeQuery(v.shift(), escapeQuerySpace);
        value = v.length ? URI.decodeQuery(v.join('='), escapeQuerySpace) : null;
        if (hasOwn.call(items, name)) {
          if (typeof items[name] === 'string') {
            items[name] = [items[name]];
          }
          items[name].push(value);
        } else {
          items[name] = value;
        }
      }
      return items;
    };
    URI.build = function (parts) {
      var t = '';
      if (parts.protocol) {
        t += parts.protocol + ':';
      }
      if (!parts.urn && (t || parts.hostname)) {
        t += '//';
      }
      t += URI.buildAuthority(parts) || '';
      if (typeof parts.path === 'string') {
        if (parts.path.charAt(0) !== '/' && typeof parts.hostname === 'string') {
          t += '/';
        }
        t += parts.path;
      }
      if (typeof parts.query === 'string' && parts.query) {
        t += '?' + parts.query;
      }
      if (typeof parts.fragment === 'string' && parts.fragment) {
        t += '#' + parts.fragment;
      }
      return t;
    };
    URI.buildHost = function (parts) {
      var t = '';
      if (!parts.hostname) {
        return '';
      } else if (URI.ip6_expression.test(parts.hostname)) {
        t += '[' + parts.hostname + ']';
      } else {
        t += parts.hostname;
      }
      if (parts.port) {
        t += ':' + parts.port;
      }
      return t;
    };
    URI.buildAuthority = function (parts) {
      return URI.buildUserinfo(parts) + URI.buildHost(parts);
    };
    URI.buildUserinfo = function (parts) {
      var t = '';
      if (parts.username) {
        t += URI.encode(parts.username);
        if (parts.password) {
          t += ':' + URI.encode(parts.password);
        }
        t += '@';
      }
      return t;
    };
    URI.buildQuery = function (data, duplicateQueryParameters, escapeQuerySpace) {
      var t = '';
      var unique, key, i, length;
      for (key in data) {
        if (hasOwn.call(data, key) && key) {
          if (isArray(data[key])) {
            unique = {};
            for (i = 0, length = data[key].length; i < length; i++) {
              if (data[key][i] !== undefined && unique[data[key][i] + ''] === undefined) {
                t += '&' + URI.buildQueryParameter(key, data[key][i], escapeQuerySpace);
                if (duplicateQueryParameters !== true) {
                  unique[data[key][i] + ''] = true;
                }
              }
            }
          } else if (data[key] !== undefined) {
            t += '&' + URI.buildQueryParameter(key, data[key], escapeQuerySpace);
          }
        }
      }
      return t.substring(1);
    };
    URI.buildQueryParameter = function (name, value, escapeQuerySpace) {
      return URI.encodeQuery(name, escapeQuerySpace) + (value !== null ? '=' + URI.encodeQuery(value, escapeQuerySpace) : '');
    };
    URI.addQuery = function (data, name, value) {
      if (typeof name === 'object') {
        for (var key in name) {
          if (hasOwn.call(name, key)) {
            URI.addQuery(data, key, name[key]);
          }
        }
      } else if (typeof name === 'string') {
        if (data[name] === undefined) {
          data[name] = value;
          return;
        } else if (typeof data[name] === 'string') {
          data[name] = [data[name]];
        }
        if (!isArray(value)) {
          value = [value];
        }
        data[name] = (data[name] || []).concat(value);
      } else {
        throw new TypeError('URI.addQuery() accepts an object, string as the name parameter');
      }
    };
    URI.removeQuery = function (data, name, value) {
      var i, length, key;
      if (isArray(name)) {
        for (i = 0, length = name.length; i < length; i++) {
          data[name[i]] = undefined;
        }
      } else if (typeof name === 'object') {
        for (key in name) {
          if (hasOwn.call(name, key)) {
            URI.removeQuery(data, key, name[key]);
          }
        }
      } else if (typeof name === 'string') {
        if (value !== undefined) {
          if (data[name] === value) {
            data[name] = undefined;
          } else if (isArray(data[name])) {
            data[name] = filterArrayValues(data[name], value);
          }
        } else {
          data[name] = undefined;
        }
      } else {
        throw new TypeError('URI.addQuery() accepts an object, string as the first parameter');
      }
    };
    URI.hasQuery = function (data, name, value, withinArray) {
      if (typeof name === 'object') {
        for (var key in name) {
          if (hasOwn.call(name, key)) {
            if (!URI.hasQuery(data, key, name[key])) {
              return false;
            }
          }
        }
        return true;
      } else if (typeof name !== 'string') {
        throw new TypeError('URI.hasQuery() accepts an object, string as the name parameter');
      }
      switch (getType(value)) {
      case 'Undefined':
        return name in data;
      case 'Boolean':
        var _booly = Boolean(isArray(data[name]) ? data[name].length : data[name]);
        return value === _booly;
      case 'Function':
        return !!value(data[name], name, data);
      case 'Array':
        if (!isArray(data[name])) {
          return false;
        }
        var op = withinArray ? arrayContains : arraysEqual;
        return op(data[name], value);
      case 'RegExp':
        if (!isArray(data[name])) {
          return Boolean(data[name] && data[name].match(value));
        }
        if (!withinArray) {
          return false;
        }
        return arrayContains(data[name], value);
      case 'Number':
        value = String(value);
      case 'String':
        if (!isArray(data[name])) {
          return data[name] === value;
        }
        if (!withinArray) {
          return false;
        }
        return arrayContains(data[name], value);
      default:
        throw new TypeError('URI.hasQuery() accepts undefined, boolean, string, number, RegExp, Function as the value parameter');
      }
    };
    URI.commonPath = function (one, two) {
      var length = Math.min(one.length, two.length);
      var pos;
      for (pos = 0; pos < length; pos++) {
        if (one.charAt(pos) !== two.charAt(pos)) {
          pos--;
          break;
        }
      }
      if (pos < 1) {
        return one.charAt(0) === two.charAt(0) && one.charAt(0) === '/' ? '/' : '';
      }
      if (one.charAt(pos) !== '/' || two.charAt(pos) !== '/') {
        pos = one.substring(0, pos).lastIndexOf('/');
      }
      return one.substring(0, pos + 1);
    };
    URI.withinString = function (string, callback, options) {
      options || (options = {});
      var _start = options.start || URI.findUri.start;
      var _end = options.end || URI.findUri.end;
      var _trim = options.trim || URI.findUri.trim;
      var _attributeOpen = /[a-z0-9-]=["']?$/i;
      _start.lastIndex = 0;
      while (true) {
        var match = _start.exec(string);
        if (!match) {
          break;
        }
        var start = match.index;
        if (options.ignoreHtml) {
          var attributeOpen = string.slice(Math.max(start - 3, 0), start);
          if (attributeOpen && _attributeOpen.test(attributeOpen)) {
            continue;
          }
        }
        var end = start + string.slice(start).search(_end);
        var slice = string.slice(start, end).replace(_trim, '');
        if (options.ignore && options.ignore.test(slice)) {
          continue;
        }
        end = start + slice.length;
        var result = callback(slice, start, end, string);
        string = string.slice(0, start) + result + string.slice(end);
        _start.lastIndex = start + result.length;
      }
      _start.lastIndex = 0;
      return string;
    };
    URI.ensureValidHostname = function (v) {
      if (v.match(URI.invalid_hostname_characters)) {
        if (!punycode) {
          throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-] and Punycode.js is not available');
        }
        if (punycode.toASCII(v).match(URI.invalid_hostname_characters)) {
          throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-]');
        }
      }
    };
    URI.noConflict = function (removeAll) {
      if (removeAll) {
        var unconflicted = { URI: this.noConflict() };
        if (root.URITemplate && typeof root.URITemplate.noConflict === 'function') {
          unconflicted.URITemplate = root.URITemplate.noConflict();
        }
        if (root.IPv6 && typeof root.IPv6.noConflict === 'function') {
          unconflicted.IPv6 = root.IPv6.noConflict();
        }
        if (root.SecondLevelDomains && typeof root.SecondLevelDomains.noConflict === 'function') {
          unconflicted.SecondLevelDomains = root.SecondLevelDomains.noConflict();
        }
        return unconflicted;
      } else if (root.URI === this) {
        root.URI = _URI;
      }
      return this;
    };
    p.build = function (deferBuild) {
      if (deferBuild === true) {
        this._deferred_build = true;
      } else if (deferBuild === undefined || this._deferred_build) {
        this._string = URI.build(this._parts);
        this._deferred_build = false;
      }
      return this;
    };
    p.clone = function () {
      return new URI(this);
    };
    p.valueOf = p.toString = function () {
      return this.build(false)._string;
    };
    function generateSimpleAccessor(_part) {
      return function (v, build) {
        if (v === undefined) {
          return this._parts[_part] || '';
        } else {
          this._parts[_part] = v || null;
          this.build(!build);
          return this;
        }
      };
    }
    function generatePrefixAccessor(_part, _key) {
      return function (v, build) {
        if (v === undefined) {
          return this._parts[_part] || '';
        } else {
          if (v !== null) {
            v = v + '';
            if (v.charAt(0) === _key) {
              v = v.substring(1);
            }
          }
          this._parts[_part] = v;
          this.build(!build);
          return this;
        }
      };
    }
    p.protocol = generateSimpleAccessor('protocol');
    p.username = generateSimpleAccessor('username');
    p.password = generateSimpleAccessor('password');
    p.hostname = generateSimpleAccessor('hostname');
    p.port = generateSimpleAccessor('port');
    p.query = generatePrefixAccessor('query', '?');
    p.fragment = generatePrefixAccessor('fragment', '#');
    p.search = function (v, build) {
      var t = this.query(v, build);
      return typeof t === 'string' && t.length ? '?' + t : t;
    };
    p.hash = function (v, build) {
      var t = this.fragment(v, build);
      return typeof t === 'string' && t.length ? '#' + t : t;
    };
    p.pathname = function (v, build) {
      if (v === undefined || v === true) {
        var res = this._parts.path || (this._parts.hostname ? '/' : '');
        return v ? URI.decodePath(res) : res;
      } else {
        this._parts.path = v ? URI.recodePath(v) : '/';
        this.build(!build);
        return this;
      }
    };
    p.path = p.pathname;
    p.href = function (href, build) {
      var key;
      if (href === undefined) {
        return this.toString();
      }
      this._string = '';
      this._parts = URI._parts();
      var _URI = href instanceof URI;
      var _object = typeof href === 'object' && (href.hostname || href.path || href.pathname);
      if (href.nodeName) {
        var attribute = URI.getDomAttribute(href);
        href = href[attribute] || '';
        _object = false;
      }
      if (!_URI && _object && href.pathname !== undefined) {
        href = href.toString();
      }
      if (typeof href === 'string' || href instanceof String) {
        this._parts = URI.parse(String(href), this._parts);
      } else if (_URI || _object) {
        var src = _URI ? href._parts : href;
        for (key in src) {
          if (hasOwn.call(this._parts, key)) {
            this._parts[key] = src[key];
          }
        }
      } else {
        throw new TypeError('invalid input');
      }
      this.build(!build);
      return this;
    };
    p.is = function (what) {
      var ip = false;
      var ip4 = false;
      var ip6 = false;
      var name = false;
      var sld = false;
      var idn = false;
      var punycode = false;
      var relative = !this._parts.urn;
      if (this._parts.hostname) {
        relative = false;
        ip4 = URI.ip4_expression.test(this._parts.hostname);
        ip6 = URI.ip6_expression.test(this._parts.hostname);
        ip = ip4 || ip6;
        name = !ip;
        sld = name && SLD && SLD.has(this._parts.hostname);
        idn = name && URI.idn_expression.test(this._parts.hostname);
        punycode = name && URI.punycode_expression.test(this._parts.hostname);
      }
      switch (what.toLowerCase()) {
      case 'relative':
        return relative;
      case 'absolute':
        return !relative;
      case 'domain':
      case 'name':
        return name;
      case 'sld':
        return sld;
      case 'ip':
        return ip;
      case 'ip4':
      case 'ipv4':
      case 'inet4':
        return ip4;
      case 'ip6':
      case 'ipv6':
      case 'inet6':
        return ip6;
      case 'idn':
        return idn;
      case 'url':
        return !this._parts.urn;
      case 'urn':
        return !!this._parts.urn;
      case 'punycode':
        return punycode;
      }
      return null;
    };
    var _protocol = p.protocol;
    var _port = p.port;
    var _hostname = p.hostname;
    p.protocol = function (v, build) {
      if (v !== undefined) {
        if (v) {
          v = v.replace(/:(\/\/)?$/, '');
          if (!v.match(URI.protocol_expression)) {
            throw new TypeError('Protocol "' + v + '" contains characters other than [A-Z0-9.+-] or doesn\'t start with [A-Z]');
          }
        }
      }
      return _protocol.call(this, v, build);
    };
    p.scheme = p.protocol;
    p.port = function (v, build) {
      if (this._parts.urn) {
        return v === undefined ? '' : this;
      }
      if (v !== undefined) {
        if (v === 0) {
          v = null;
        }
        if (v) {
          v += '';
          if (v.charAt(0) === ':') {
            v = v.substring(1);
          }
          if (v.match(/[^0-9]/)) {
            throw new TypeError('Port "' + v + '" contains characters other than [0-9]');
          }
        }
      }
      return _port.call(this, v, build);
    };
    p.hostname = function (v, build) {
      if (this._parts.urn) {
        return v === undefined ? '' : this;
      }
      if (v !== undefined) {
        var x = {};
        URI.parseHost(v, x);
        v = x.hostname;
      }
      return _hostname.call(this, v, build);
    };
    p.host = function (v, build) {
      if (this._parts.urn) {
        return v === undefined ? '' : this;
      }
      if (v === undefined) {
        return this._parts.hostname ? URI.buildHost(this._parts) : '';
      } else {
        URI.parseHost(v, this._parts);
        this.build(!build);
        return this;
      }
    };
    p.authority = function (v, build) {
      if (this._parts.urn) {
        return v === undefined ? '' : this;
      }
      if (v === undefined) {
        return this._parts.hostname ? URI.buildAuthority(this._parts) : '';
      } else {
        URI.parseAuthority(v, this._parts);
        this.build(!build);
        return this;
      }
    };
    p.userinfo = function (v, build) {
      if (this._parts.urn) {
        return v === undefined ? '' : this;
      }
      if (v === undefined) {
        if (!this._parts.username) {
          return '';
        }
        var t = URI.buildUserinfo(this._parts);
        return t.substring(0, t.length - 1);
      } else {
        if (v[v.length - 1] !== '@') {
          v += '@';
        }
        URI.parseUserinfo(v, this._parts);
        this.build(!build);
        return this;
      }
    };
    p.resource = function (v, build) {
      var parts;
      if (v === undefined) {
        return this.path() + this.search() + this.hash();
      }
      parts = URI.parse(v);
      this._parts.path = parts.path;
      this._parts.query = parts.query;
      this._parts.fragment = parts.fragment;
      this.build(!build);
      return this;
    };
    p.subdomain = function (v, build) {
      if (this._parts.urn) {
        return v === undefined ? '' : this;
      }
      if (v === undefined) {
        if (!this._parts.hostname || this.is('IP')) {
          return '';
        }
        var end = this._parts.hostname.length - this.domain().length - 1;
        return this._parts.hostname.substring(0, end) || '';
      } else {
        var e = this._parts.hostname.length - this.domain().length;
        var sub = this._parts.hostname.substring(0, e);
        var replace = new RegExp('^' + escapeRegEx(sub));
        if (v && v.charAt(v.length - 1) !== '.') {
          v += '.';
        }
        if (v) {
          URI.ensureValidHostname(v);
        }
        this._parts.hostname = this._parts.hostname.replace(replace, v);
        this.build(!build);
        return this;
      }
    };
    p.domain = function (v, build) {
      if (this._parts.urn) {
        return v === undefined ? '' : this;
      }
      if (typeof v === 'boolean') {
        build = v;
        v = undefined;
      }
      if (v === undefined) {
        if (!this._parts.hostname || this.is('IP')) {
          return '';
        }
        var t = this._parts.hostname.match(/\./g);
        if (t && t.length < 2) {
          return this._parts.hostname;
        }
        var end = this._parts.hostname.length - this.tld(build).length - 1;
        end = this._parts.hostname.lastIndexOf('.', end - 1) + 1;
        return this._parts.hostname.substring(end) || '';
      } else {
        if (!v) {
          throw new TypeError('cannot set domain empty');
        }
        URI.ensureValidHostname(v);
        if (!this._parts.hostname || this.is('IP')) {
          this._parts.hostname = v;
        } else {
          var replace = new RegExp(escapeRegEx(this.domain()) + '$');
          this._parts.hostname = this._parts.hostname.replace(replace, v);
        }
        this.build(!build);
        return this;
      }
    };
    p.tld = function (v, build) {
      if (this._parts.urn) {
        return v === undefined ? '' : this;
      }
      if (typeof v === 'boolean') {
        build = v;
        v = undefined;
      }
      if (v === undefined) {
        if (!this._parts.hostname || this.is('IP')) {
          return '';
        }
        var pos = this._parts.hostname.lastIndexOf('.');
        var tld = this._parts.hostname.substring(pos + 1);
        if (build !== true && SLD && SLD.list[tld.toLowerCase()]) {
          return SLD.get(this._parts.hostname) || tld;
        }
        return tld;
      } else {
        var replace;
        if (!v) {
          throw new TypeError('cannot set TLD empty');
        } else if (v.match(/[^a-zA-Z0-9-]/)) {
          if (SLD && SLD.is(v)) {
            replace = new RegExp(escapeRegEx(this.tld()) + '$');
            this._parts.hostname = this._parts.hostname.replace(replace, v);
          } else {
            throw new TypeError('TLD "' + v + '" contains characters other than [A-Z0-9]');
          }
        } else if (!this._parts.hostname || this.is('IP')) {
          throw new ReferenceError('cannot set TLD on non-domain host');
        } else {
          replace = new RegExp(escapeRegEx(this.tld()) + '$');
          this._parts.hostname = this._parts.hostname.replace(replace, v);
        }
        this.build(!build);
        return this;
      }
    };
    p.directory = function (v, build) {
      if (this._parts.urn) {
        return v === undefined ? '' : this;
      }
      if (v === undefined || v === true) {
        if (!this._parts.path && !this._parts.hostname) {
          return '';
        }
        if (this._parts.path === '/') {
          return '/';
        }
        var end = this._parts.path.length - this.filename().length - 1;
        var res = this._parts.path.substring(0, end) || (this._parts.hostname ? '/' : '');
        return v ? URI.decodePath(res) : res;
      } else {
        var e = this._parts.path.length - this.filename().length;
        var directory = this._parts.path.substring(0, e);
        var replace = new RegExp('^' + escapeRegEx(directory));
        if (!this.is('relative')) {
          if (!v) {
            v = '/';
          }
          if (v.charAt(0) !== '/') {
            v = '/' + v;
          }
        }
        if (v && v.charAt(v.length - 1) !== '/') {
          v += '/';
        }
        v = URI.recodePath(v);
        this._parts.path = this._parts.path.replace(replace, v);
        this.build(!build);
        return this;
      }
    };
    p.filename = function (v, build) {
      if (this._parts.urn) {
        return v === undefined ? '' : this;
      }
      if (v === undefined || v === true) {
        if (!this._parts.path || this._parts.path === '/') {
          return '';
        }
        var pos = this._parts.path.lastIndexOf('/');
        var res = this._parts.path.substring(pos + 1);
        return v ? URI.decodePathSegment(res) : res;
      } else {
        var mutatedDirectory = false;
        if (v.charAt(0) === '/') {
          v = v.substring(1);
        }
        if (v.match(/\.?\//)) {
          mutatedDirectory = true;
        }
        var replace = new RegExp(escapeRegEx(this.filename()) + '$');
        v = URI.recodePath(v);
        this._parts.path = this._parts.path.replace(replace, v);
        if (mutatedDirectory) {
          this.normalizePath(build);
        } else {
          this.build(!build);
        }
        return this;
      }
    };
    p.suffix = function (v, build) {
      if (this._parts.urn) {
        return v === undefined ? '' : this;
      }
      if (v === undefined || v === true) {
        if (!this._parts.path || this._parts.path === '/') {
          return '';
        }
        var filename = this.filename();
        var pos = filename.lastIndexOf('.');
        var s, res;
        if (pos === -1) {
          return '';
        }
        s = filename.substring(pos + 1);
        res = /^[a-z0-9%]+$/i.test(s) ? s : '';
        return v ? URI.decodePathSegment(res) : res;
      } else {
        if (v.charAt(0) === '.') {
          v = v.substring(1);
        }
        var suffix = this.suffix();
        var replace;
        if (!suffix) {
          if (!v) {
            return this;
          }
          this._parts.path += '.' + URI.recodePath(v);
        } else if (!v) {
          replace = new RegExp(escapeRegEx('.' + suffix) + '$');
        } else {
          replace = new RegExp(escapeRegEx(suffix) + '$');
        }
        if (replace) {
          v = URI.recodePath(v);
          this._parts.path = this._parts.path.replace(replace, v);
        }
        this.build(!build);
        return this;
      }
    };
    p.segment = function (segment, v, build) {
      var separator = this._parts.urn ? ':' : '/';
      var path = this.path();
      var absolute = path.substring(0, 1) === '/';
      var segments = path.split(separator);
      if (segment !== undefined && typeof segment !== 'number') {
        build = v;
        v = segment;
        segment = undefined;
      }
      if (segment !== undefined && typeof segment !== 'number') {
        throw new Error('Bad segment "' + segment + '", must be 0-based integer');
      }
      if (absolute) {
        segments.shift();
      }
      if (segment < 0) {
        segment = Math.max(segments.length + segment, 0);
      }
      if (v === undefined) {
        return segment === undefined ? segments : segments[segment];
      } else if (segment === null || segments[segment] === undefined) {
        if (isArray(v)) {
          segments = [];
          for (var i = 0, l = v.length; i < l; i++) {
            if (!v[i].length && (!segments.length || !segments[segments.length - 1].length)) {
              continue;
            }
            if (segments.length && !segments[segments.length - 1].length) {
              segments.pop();
            }
            segments.push(v[i]);
          }
        } else if (v || typeof v === 'string') {
          if (segments[segments.length - 1] === '') {
            segments[segments.length - 1] = v;
          } else {
            segments.push(v);
          }
        }
      } else {
        if (v) {
          segments[segment] = v;
        } else {
          segments.splice(segment, 1);
        }
      }
      if (absolute) {
        segments.unshift('');
      }
      return this.path(segments.join(separator), build);
    };
    p.segmentCoded = function (segment, v, build) {
      var segments, i, l;
      if (typeof segment !== 'number') {
        build = v;
        v = segment;
        segment = undefined;
      }
      if (v === undefined) {
        segments = this.segment(segment, v, build);
        if (!isArray(segments)) {
          segments = segments !== undefined ? URI.decode(segments) : undefined;
        } else {
          for (i = 0, l = segments.length; i < l; i++) {
            segments[i] = URI.decode(segments[i]);
          }
        }
        return segments;
      }
      if (!isArray(v)) {
        v = typeof v === 'string' || v instanceof String ? URI.encode(v) : v;
      } else {
        for (i = 0, l = v.length; i < l; i++) {
          v[i] = URI.decode(v[i]);
        }
      }
      return this.segment(segment, v, build);
    };
    var q = p.query;
    p.query = function (v, build) {
      if (v === true) {
        return URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
      } else if (typeof v === 'function') {
        var data = URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
        var result = v.call(this, data);
        this._parts.query = URI.buildQuery(result || data, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
        this.build(!build);
        return this;
      } else if (v !== undefined && typeof v !== 'string') {
        this._parts.query = URI.buildQuery(v, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
        this.build(!build);
        return this;
      } else {
        return q.call(this, v, build);
      }
    };
    p.setQuery = function (name, value, build) {
      var data = URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
      if (typeof name === 'string' || name instanceof String) {
        data[name] = value !== undefined ? value : null;
      } else if (typeof name === 'object') {
        for (var key in name) {
          if (hasOwn.call(name, key)) {
            data[key] = name[key];
          }
        }
      } else {
        throw new TypeError('URI.addQuery() accepts an object, string as the name parameter');
      }
      this._parts.query = URI.buildQuery(data, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
      if (typeof name !== 'string') {
        build = value;
      }
      this.build(!build);
      return this;
    };
    p.addQuery = function (name, value, build) {
      var data = URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
      URI.addQuery(data, name, value === undefined ? null : value);
      this._parts.query = URI.buildQuery(data, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
      if (typeof name !== 'string') {
        build = value;
      }
      this.build(!build);
      return this;
    };
    p.removeQuery = function (name, value, build) {
      var data = URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
      URI.removeQuery(data, name, value);
      this._parts.query = URI.buildQuery(data, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
      if (typeof name !== 'string') {
        build = value;
      }
      this.build(!build);
      return this;
    };
    p.hasQuery = function (name, value, withinArray) {
      var data = URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
      return URI.hasQuery(data, name, value, withinArray);
    };
    p.setSearch = p.setQuery;
    p.addSearch = p.addQuery;
    p.removeSearch = p.removeQuery;
    p.hasSearch = p.hasQuery;
    p.normalize = function () {
      if (this._parts.urn) {
        return this.normalizeProtocol(false).normalizeQuery(false).normalizeFragment(false).build();
      }
      return this.normalizeProtocol(false).normalizeHostname(false).normalizePort(false).normalizePath(false).normalizeQuery(false).normalizeFragment(false).build();
    };
    p.normalizeProtocol = function (build) {
      if (typeof this._parts.protocol === 'string') {
        this._parts.protocol = this._parts.protocol.toLowerCase();
        this.build(!build);
      }
      return this;
    };
    p.normalizeHostname = function (build) {
      if (this._parts.hostname) {
        if (this.is('IDN') && punycode) {
          this._parts.hostname = punycode.toASCII(this._parts.hostname);
        } else if (this.is('IPv6') && IPv6) {
          this._parts.hostname = IPv6.best(this._parts.hostname);
        }
        this._parts.hostname = this._parts.hostname.toLowerCase();
        this.build(!build);
      }
      return this;
    };
    p.normalizePort = function (build) {
      if (typeof this._parts.protocol === 'string' && this._parts.port === URI.defaultPorts[this._parts.protocol]) {
        this._parts.port = null;
        this.build(!build);
      }
      return this;
    };
    p.normalizePath = function (build) {
      if (this._parts.urn) {
        return this;
      }
      if (!this._parts.path || this._parts.path === '/') {
        return this;
      }
      var _was_relative;
      var _path = this._parts.path;
      var _leadingParents = '';
      var _parent, _pos;
      if (_path.charAt(0) !== '/') {
        _was_relative = true;
        _path = '/' + _path;
      }
      _path = _path.replace(/(\/(\.\/)+)|(\/\.$)/g, '/').replace(/\/{2,}/g, '/');
      if (_was_relative) {
        _leadingParents = _path.substring(1).match(/^(\.\.\/)+/) || '';
        if (_leadingParents) {
          _leadingParents = _leadingParents[0];
        }
      }
      while (true) {
        _parent = _path.indexOf('/..');
        if (_parent === -1) {
          break;
        } else if (_parent === 0) {
          _path = _path.substring(3);
          continue;
        }
        _pos = _path.substring(0, _parent).lastIndexOf('/');
        if (_pos === -1) {
          _pos = _parent;
        }
        _path = _path.substring(0, _pos) + _path.substring(_parent + 3);
      }
      if (_was_relative && this.is('relative')) {
        _path = _leadingParents + _path.substring(1);
      }
      _path = URI.recodePath(_path);
      this._parts.path = _path;
      this.build(!build);
      return this;
    };
    p.normalizePathname = p.normalizePath;
    p.normalizeQuery = function (build) {
      if (typeof this._parts.query === 'string') {
        if (!this._parts.query.length) {
          this._parts.query = null;
        } else {
          this.query(URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace));
        }
        this.build(!build);
      }
      return this;
    };
    p.normalizeFragment = function (build) {
      if (!this._parts.fragment) {
        this._parts.fragment = null;
        this.build(!build);
      }
      return this;
    };
    p.normalizeSearch = p.normalizeQuery;
    p.normalizeHash = p.normalizeFragment;
    p.iso8859 = function () {
      var e = URI.encode;
      var d = URI.decode;
      URI.encode = escape;
      URI.decode = decodeURIComponent;
      this.normalize();
      URI.encode = e;
      URI.decode = d;
      return this;
    };
    p.unicode = function () {
      var e = URI.encode;
      var d = URI.decode;
      URI.encode = strictEncodeURIComponent;
      URI.decode = unescape;
      this.normalize();
      URI.encode = e;
      URI.decode = d;
      return this;
    };
    p.readable = function () {
      var uri = this.clone();
      uri.username('').password('').normalize();
      var t = '';
      if (uri._parts.protocol) {
        t += uri._parts.protocol + '://';
      }
      if (uri._parts.hostname) {
        if (uri.is('punycode') && punycode) {
          t += punycode.toUnicode(uri._parts.hostname);
          if (uri._parts.port) {
            t += ':' + uri._parts.port;
          }
        } else {
          t += uri.host();
        }
      }
      if (uri._parts.hostname && uri._parts.path && uri._parts.path.charAt(0) !== '/') {
        t += '/';
      }
      t += uri.path(true);
      if (uri._parts.query) {
        var q = '';
        for (var i = 0, qp = uri._parts.query.split('&'), l = qp.length; i < l; i++) {
          var kv = (qp[i] || '').split('=');
          q += '&' + URI.decodeQuery(kv[0], this._parts.escapeQuerySpace).replace(/&/g, '%26');
          if (kv[1] !== undefined) {
            q += '=' + URI.decodeQuery(kv[1], this._parts.escapeQuerySpace).replace(/&/g, '%26');
          }
        }
        t += '?' + q.substring(1);
      }
      t += URI.decodeQuery(uri.hash(), true);
      return t;
    };
    p.absoluteTo = function (base) {
      var resolved = this.clone();
      var properties = [
          'protocol',
          'username',
          'password',
          'hostname',
          'port'
        ];
      var basedir, i, p;
      if (this._parts.urn) {
        throw new Error('URNs do not have any generally defined hierarchical components');
      }
      if (!(base instanceof URI)) {
        base = new URI(base);
      }
      if (!resolved._parts.protocol) {
        resolved._parts.protocol = base._parts.protocol;
      }
      if (this._parts.hostname) {
        return resolved;
      }
      for (i = 0; p = properties[i]; i++) {
        resolved._parts[p] = base._parts[p];
      }
      if (!resolved._parts.path) {
        resolved._parts.path = base._parts.path;
        if (!resolved._parts.query) {
          resolved._parts.query = base._parts.query;
        }
      } else if (resolved._parts.path.substring(-2) === '..') {
        resolved._parts.path += '/';
      }
      if (resolved.path().charAt(0) !== '/') {
        basedir = base.directory();
        resolved._parts.path = (basedir ? basedir + '/' : '') + resolved._parts.path;
        resolved.normalizePath();
      }
      resolved.build();
      return resolved;
    };
    p.relativeTo = function (base) {
      var relative = this.clone().normalize();
      var relativeParts, baseParts, common, relativePath, basePath;
      if (relative._parts.urn) {
        throw new Error('URNs do not have any generally defined hierarchical components');
      }
      base = new URI(base).normalize();
      relativeParts = relative._parts;
      baseParts = base._parts;
      relativePath = relative.path();
      basePath = base.path();
      if (relativePath.charAt(0) !== '/') {
        throw new Error('URI is already relative');
      }
      if (basePath.charAt(0) !== '/') {
        throw new Error('Cannot calculate a URI relative to another relative URI');
      }
      if (relativeParts.protocol === baseParts.protocol) {
        relativeParts.protocol = null;
      }
      if (relativeParts.username !== baseParts.username || relativeParts.password !== baseParts.password) {
        return relative.build();
      }
      if (relativeParts.protocol !== null || relativeParts.username !== null || relativeParts.password !== null) {
        return relative.build();
      }
      if (relativeParts.hostname === baseParts.hostname && relativeParts.port === baseParts.port) {
        relativeParts.hostname = null;
        relativeParts.port = null;
      } else {
        return relative.build();
      }
      if (relativePath === basePath) {
        relativeParts.path = '';
        return relative.build();
      }
      common = URI.commonPath(relative.path(), base.path());
      if (!common) {
        return relative.build();
      }
      var parents = baseParts.path.substring(common.length).replace(/[^\/]*$/, '').replace(/.*?\//g, '../');
      relativeParts.path = parents + relativeParts.path.substring(common.length);
      return relative.build();
    };
    p.equals = function (uri) {
      var one = this.clone();
      var two = new URI(uri);
      var one_map = {};
      var two_map = {};
      var checked = {};
      var one_query, two_query, key;
      one.normalize();
      two.normalize();
      if (one.toString() === two.toString()) {
        return true;
      }
      one_query = one.query();
      two_query = two.query();
      one.query('');
      two.query('');
      if (one.toString() !== two.toString()) {
        return false;
      }
      if (one_query.length !== two_query.length) {
        return false;
      }
      one_map = URI.parseQuery(one_query, this._parts.escapeQuerySpace);
      two_map = URI.parseQuery(two_query, this._parts.escapeQuerySpace);
      for (key in one_map) {
        if (hasOwn.call(one_map, key)) {
          if (!isArray(one_map[key])) {
            if (one_map[key] !== two_map[key]) {
              return false;
            }
          } else if (!arraysEqual(one_map[key], two_map[key])) {
            return false;
          }
          checked[key] = true;
        }
      }
      for (key in two_map) {
        if (hasOwn.call(two_map, key)) {
          if (!checked[key]) {
            return false;
          }
        }
      }
      return true;
    };
    p.duplicateQueryParameters = function (v) {
      this._parts.duplicateQueryParameters = !!v;
      return this;
    };
    p.escapeQuerySpace = function (v) {
      this._parts.escapeQuerySpace = !!v;
      return this;
    };
    return URI;
  }));
  return exports;
}({});
handlebars_runtime_130_dist_cjs_handlebars_utils_debug = function (exports) {
  'use strict';
  var SafeString = handlebars_runtime_130_dist_cjs_handlebars_safe_string_debug['default'];
  var escape = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      '\'': '&#x27;',
      '`': '&#x60;'
    };
  var badChars = /[&<>"'`]/g;
  var possible = /[&<>"'`]/;
  function escapeChar(chr) {
    return escape[chr] || '&amp;';
  }
  function extend(obj, value) {
    for (var key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        obj[key] = value[key];
      }
    }
  }
  exports.extend = extend;
  var toString = Object.prototype.toString;
  exports.toString = toString;
  var isFunction = function (value) {
    return typeof value === 'function';
  };
  if (isFunction(/x/)) {
    isFunction = function (value) {
      return typeof value === 'function' && toString.call(value) === '[object Function]';
    };
  }
  var isFunction;
  exports.isFunction = isFunction;
  var isArray = Array.isArray || function (value) {
      return value && typeof value === 'object' ? toString.call(value) === '[object Array]' : false;
    };
  exports.isArray = isArray;
  function escapeExpression(string) {
    if (string instanceof SafeString) {
      return string.toString();
    } else if (!string && string !== 0) {
      return '';
    }
    string = '' + string;
    if (!possible.test(string)) {
      return string;
    }
    return string.replace(badChars, escapeChar);
  }
  exports.escapeExpression = escapeExpression;
  function isEmpty(value) {
    if (!value && value !== 0) {
      return true;
    } else if (isArray(value) && value.length === 0) {
      return true;
    } else {
      return false;
    }
  }
  exports.isEmpty = isEmpty;
  return exports;
}({});
anima_yocto_plugin_100_index_debug = function (exports) {
  var $ = anima_yocto_core_110_index_debug;
  var plugin = {};
  var rootNodeRE = /^(?:body|html)$/i;
  function isDocument(obj) {
    return obj != null && obj.nodeType == obj.DOCUMENT_NODE;
  }
  plugin.fn = {
    wrap: function (structure) {
      var func = $.isFunction(structure);
      if (this[0] && !func)
        var dom = $(structure).get(0), clone = dom.parentNode || this.length > 1;
      return this.each(function (index) {
        $(this).wrapAll(func ? structure.call(this, index) : clone ? dom.cloneNode(true) : dom);
      });
    },
    wrapAll: function (structure) {
      if (this[0]) {
        $(this[0]).before(structure = $(structure));
        var children;
        while ((children = structure.children()).length)
          structure = children.first();
        $(structure).append(this);
      }
      return this;
    },
    wrapInner: function (structure) {
      var func = $.isFunction(structure);
      return this.each(function (index) {
        var self = $(this), contents = self.contents(), dom = func ? structure.call(this, index) : structure;
        contents.length ? contents.wrapAll(dom) : self.append(dom);
      });
    },
    unwrap: function () {
      this.parent().each(function () {
        $(this).replaceWith($(this).children());
      });
      return this;
    },
    closest: function (selector, context) {
      var node = this[0], collection = false;
      if (typeof selector == 'object')
        collection = $(selector);
      while (node && !(collection ? collection.indexOf(node) >= 0 : $.zepto.matches(node, selector)))
        node = node !== context && !isDocument(node) && node.parentNode;
      return $(node);
    },
    contents: function () {
      return this.map(function () {
        return [].slice.call(this.childNodes);
      });
    },
    empty: function () {
      return this.each(function () {
        this.innerHTML = '';
      });
    },
    scrollLeft: function (value) {
      if (!this.length)
        return;
      var hasScrollLeft = 'scrollLeft' in this[0];
      if (value === undefined)
        return hasScrollLeft ? this[0].scrollLeft : this[0].pageXOffset;
      return this.each(hasScrollLeft ? function () {
        this.scrollLeft = value;
      } : function () {
        this.scrollTo(value, this.scrollY);
      });
    },
    position: function () {
      if (!this.length)
        return;
      var elem = this[0], offsetParent = this.offsetParent(), offset = this.offset(), parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? {
          top: 0,
          left: 0
        } : offsetParent.offset();
      offset.top -= parseFloat($(elem).css('margin-top')) || 0;
      offset.left -= parseFloat($(elem).css('margin-left')) || 0;
      parentOffset.top += parseFloat($(offsetParent[0]).css('border-top-width')) || 0;
      parentOffset.left += parseFloat($(offsetParent[0]).css('border-left-width')) || 0;
      return {
        top: offset.top - parentOffset.top,
        left: offset.left - parentOffset.left
      };
    },
    offsetParent: function () {
      return this.map(function () {
        var parent = this.offsetParent || document.body;
        while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css('position') == 'static')
          parent = parent.offsetParent;
        return parent;
      });
    }
  };
  $.extend($.fn, plugin.fn);
  [
    'width',
    'height'
  ].forEach(function (dimension) {
    var offset, Dimension = dimension.replace(/./, function (m) {
        return m[0].toUpperCase();
      });
    $.fn['outer' + Dimension] = function (margin) {
      var elem = this;
      if (elem) {
        var size = elem[dimension]();
        var sides = {
            'width': [
              'left',
              'right'
            ],
            'height': [
              'top',
              'bottom'
            ]
          };
        sides[dimension].forEach(function (side) {
          if (margin)
            size += parseInt(elem.css('margin-' + side), 10);
        });
        return size;
      } else {
        return null;
      }
    };
  });
  exports = $;
  return exports;
}();
anima_yocto_event_102_index_debug = function () {
  anima_yocto_event_102_src_event_debug;
}();
anima_yocto_touch_106_src_gestureManager_debug = function (exports) {
  var $ = Yocto = anima_yocto_core_110_index_debug;
  anima_yocto_event_102_index_debug;
  Gesture = {
    init: function (name) {
      var self = this, gesture = self[name];
      var bindEvent = function (element) {
        var $el = $(element);
        if (!$el.data(name)) {
          $el.data(name, 1).forEach(function (el) {
            el.addEventListener('touchstart', function (event) {
              gesture.handler.touchstart(event);
              document.addEventListener('touchmove', move, false);
              document.addEventListener('touchend', end, false);
              document.addEventListener('touchcancel', cancel, false);
            }, false);
          });
          function move(event) {
            gesture.handler.touchmove(event);
          }
          function end(event) {
            gesture.handler.touchend(event);
            document.removeEventListener('touchmove', move, false);
            document.removeEventListener('touchend', end, false);
            document.removeEventListener('touchcancel', cancel, false);
          }
          function cancel(event) {
            gesture.handler.touchcancel(event);
            document.removeEventListener('touchmove', move, false);
            document.removeEventListener('touchend', end, false);
            document.removeEventListener('touchcancel', cancel, false);
          }
        }
      };
      gesture.events.forEach(function (eventName) {
        self.list[eventName] = bindEvent;
        $.fn[eventName] = function (callback) {
          return this.on(eventName, callback);
        };
      });
    },
    list: {}
  };
  $.gestures = Gesture;
  exports = $;
  return exports;
}();
anima_yocto_touch_106_src_tap_debug = function (exports) {
  var $ = Yocto = anima_yocto_core_110_index_debug;
  anima_yocto_event_102_index_debug;
  anima_yocto_touch_106_src_gestureManager_debug;
  var Gesture = $.gestures;
  var deviceIsAndroid = navigator.userAgent.toLowerCase().indexOf('android') > 0, deviceIsIOS = /ip(ad|hone|od)/.test(navigator.userAgent.toLowerCase());
  var yoctoTouch = {
      trackingClick: false,
      trackingClickStart: 0,
      targetElement: null,
      touchStartX: 0,
      touchStartY: 0,
      touchBoundary: 10,
      tapDelay: 200,
      sendClick: function (targetElement, event) {
        var tap = $.Event('tap', { animaTap: true });
        $(targetElement).trigger(tap);
        var clickEvent, touch;
        if (document.activeElement && document.activeElement !== targetElement) {
          document.activeElement.blur();
        }
        touch = event.changedTouches[0];
        clickEvent = document.createEvent('MouseEvents');
        clickEvent.initMouseEvent('click', true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
        clickEvent.animaClick = true;
        targetElement.dispatchEvent(clickEvent);
      },
      needClick: function (target) {
        switch (target.nodeName.toLowerCase()) {
        case 'button':
        case 'select':
        case 'textarea':
          if (target.disabled) {
            return true;
          }
          break;
        case 'input':
          if (deviceIsIOS && target.type === 'file' || target.disabled) {
            return true;
          }
          break;
        case 'label':
        case 'iframe':
        case 'video':
          return true;
        }
        return false;
      },
      focus: function (targetElement) {
        var length;
        if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time') {
          length = targetElement.value.length;
          targetElement.setSelectionRange(length, length);
        } else {
          targetElement.focus();
        }
      },
      needFocus: function (target) {
        switch (target.nodeName.toLowerCase()) {
        case 'textarea':
        case 'select':
          return true;
        case 'input':
          switch (target.type) {
          case 'button':
          case 'checkbox':
          case 'file':
          case 'image':
          case 'radio':
          case 'submit':
            return false;
          }
          return !target.disabled && !target.readOnly;
        default:
          return false;
        }
      },
      updateScrollParent: function (targetElement) {
        var scrollParent, parentElement;
        scrollParent = targetElement.yoctoTouchScrollParent;
        if (!scrollParent || !scrollParent.contains(targetElement)) {
          parentElement = targetElement;
          do {
            if (parentElement.scrollHeight > parentElement.offsetHeight) {
              scrollParent = parentElement;
              targetElement.yoctoTouchScrollParent = parentElement;
              break;
            }
            parentElement = parentElement.parentElement;
          } while (parentElement);
        }
        if (scrollParent) {
          scrollParent.yoctoTouchLastScrollTop = scrollParent.scrollTop;
        }
      },
      findControl: function (labelElement) {
        if (labelElement.control !== undefined) {
          return labelElement.control;
        }
        if (labelElement.htmlFor) {
          return document.getElementById(labelElement.htmlFor);
        }
        return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
      },
      touchHasMoved: function (event) {
        var touch = event.changedTouches[0], boundary = yoctoTouch.touchBoundary;
        if (Math.abs(touch.pageX - yoctoTouch.touchStartX) > boundary || Math.abs(touch.pageY - yoctoTouch.touchStartY) > boundary) {
          return true;
        }
        return false;
      }
    };
  Gesture.tap = {
    events: [
      'tap',
      'click'
    ],
    handler: {
      touchstart: function (event) {
        var targetElement, touch, selection;
        if (event.targetTouches.length > 1) {
          return true;
        }
        targetElement = event.target;
        touch = event.targetTouches[0];
        if (deviceIsIOS) {
          selection = window.getSelection();
          if (selection.rangeCount && !selection.isCollapsed) {
            return true;
          }
          yoctoTouch.updateScrollParent(targetElement);
        }
        yoctoTouch.trackingClick = true;
        yoctoTouch.trackingClickStart = event.timeStamp;
        yoctoTouch.targetElement = targetElement;
        yoctoTouch.touchStartX = touch.pageX;
        yoctoTouch.touchStartY = touch.pageY;
        if (event.timeStamp - yoctoTouch.lastClickTime < yoctoTouch.tapDelay) {
          event.preventDefault();
        }
        return true;
      },
      touchmove: function (event) {
        if (!yoctoTouch.trackingClick) {
          return true;
        }
        if (yoctoTouch.targetElement !== event.target || yoctoTouch.touchHasMoved(event)) {
          yoctoTouch.trackingClick = false;
          yoctoTouch.targetElement = null;
        }
        return true;
      },
      touchend: function (event) {
        var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = yoctoTouch.targetElement;
        if (event.timeStamp - yoctoTouch.trackingClickStart > yoctoTouch.tapDelay || !yoctoTouch.trackingClick) {
          return true;
        }
        if (event.timeStamp - yoctoTouch.lastClickTime < yoctoTouch.tapDelay) {
          yoctoTouch.cancelNextClick = true;
          return true;
        }
        yoctoTouch.cancelNextClick = false;
        yoctoTouch.lastClickTime = event.timeStamp;
        trackingClickStart = yoctoTouch.trackingClickStart;
        yoctoTouch.trackingClick = false;
        yoctoTouch.trackingClickStart = 0;
        targetTagName = targetElement.tagName.toLowerCase();
        if (targetTagName === 'label') {
          forElement = yoctoTouch.findControl(targetElement);
          if (forElement) {
            yoctoTouch.focus(targetElement);
            if (deviceIsAndroid) {
              return false;
            }
            targetElement = forElement;
          }
        } else if (yoctoTouch.needFocus(targetElement)) {
          if (event.timeStamp - trackingClickStart > 100 || deviceIsIOS && window.top !== window && targetTagName === 'input') {
            yoctoTouch.targetElement = null;
            return false;
          }
          yoctoTouch.focus(targetElement);
          event.preventDefault();
          yoctoTouch.sendClick(targetElement, event);
          return false;
        }
        if (deviceIsIOS) {
          scrollParent = targetElement.yoctoTouchScrollParent;
          if (scrollParent && scrollParent.yoctoTouchLastScrollTop !== scrollParent.scrollTop) {
            return true;
          }
        }
        if (!yoctoTouch.needClick(targetElement)) {
          event.preventDefault();
          yoctoTouch.sendClick(targetElement, event);
        }
        return false;
      },
      touchcancel: function (event) {
        yoctoTouch.trackingClick = false;
        yoctoTouch.targetElement = null;
      }
    }
  };
  Gesture.init('tap');
  var oldInitEvent = Event.prototype.initEvent;
  Event.prototype.initEvent = function () {
    var args = Array.prototype.slice.call(arguments);
    oldInitEvent.apply(this, args);
    if (args[0] === 'click') {
      this.animaClick = true;
    }
  };
  exports = $;
  return exports;
}();
anima_yocto_ajax_103_src_jsonp_debug = function (exports) {
  var $ = anima_yocto_core_110_index_debug, util = anima_yocto_ajax_103_src_util_debug;
  anima_yocto_event_102_index_debug;
  var jsonpID = 0, document = window.document, ajaxBeforeSend = util.ajaxBeforeSend, ajaxSuccess = util.ajaxSuccess, ajaxError = util.ajaxError;
  $.ajaxJSONP = function (options, deferred) {
    if (!('type' in options))
      return $.ajax && $.ajax(options);
    var _callbackName = options.jsonpCallback, callbackName = ($.isFunction(_callbackName) ? _callbackName() : _callbackName) || 'jsonp' + ++jsonpID, script = document.createElement('script'), originalCallback = window[callbackName], responseData, abort = function (errorType) {
        $(script).triggerHandler('error', errorType || 'abort');
      }, xhr = { abort: abort }, abortTimeout;
    if (deferred)
      deferred.promise(xhr);
    $(script).on('load error', function (e, errorType) {
      clearTimeout(abortTimeout);
      $(script).off().remove();
      if (e.type == 'error' || !responseData) {
        ajaxError(null, errorType || 'error', xhr, options, deferred);
      } else {
        ajaxSuccess(responseData[0], xhr, options, deferred);
      }
      window[callbackName] = originalCallback;
      if (responseData && $.isFunction(originalCallback))
        originalCallback(responseData[0]);
      originalCallback = responseData = undefined;
    });
    if (ajaxBeforeSend(xhr, options) === false) {
      abort('abort');
      return xhr;
    }
    window[callbackName] = function () {
      responseData = arguments;
    };
    script.src = options.url.replace(/\?(.+)=\?/, '?$1=' + callbackName);
    document.head.appendChild(script);
    if (options.timeout > 0)
      abortTimeout = setTimeout(function () {
        abort('timeout');
      }, options.timeout);
    return xhr;
  };
  exports = $;
  return exports;
}();
anima_yocto_ajax_103_src_miniAjax_debug = function (exports) {
  var $ = anima_yocto_core_110_index_debug, util = anima_yocto_ajax_103_src_util_debug;
  anima_yocto_event_102_index_debug;
  var key, name, rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, scriptTypeRE = /^(?:text|application)\/javascript/i, xmlTypeRE = /^(?:text|application)\/xml/i, jsonType = 'application/json', htmlType = 'text/html', blankRE = /^\s*$/, ajaxBeforeSend = util.ajaxBeforeSend, ajaxSuccess = util.ajaxSuccess, ajaxError = util.ajaxError;
  function empty() {
  }
  $.ajaxSettings = {
    type: 'GET',
    beforeSend: empty,
    success: empty,
    error: empty,
    complete: empty,
    context: null,
    global: true,
    xhr: function () {
      return new window.XMLHttpRequest();
    },
    accepts: {
      script: 'text/javascript, application/javascript, application/x-javascript',
      json: jsonType,
      xml: 'application/xml, text/xml',
      html: htmlType,
      text: 'text/plain'
    },
    crossDomain: false,
    timeout: 0,
    processData: true,
    cache: true
  };
  function mimeToDataType(mime) {
    if (mime)
      mime = mime.split(';', 2)[0];
    return mime && (mime == htmlType ? 'html' : mime == jsonType ? 'json' : scriptTypeRE.test(mime) ? 'script' : xmlTypeRE.test(mime) && 'xml') || 'text';
  }
  function appendQuery(url, query) {
    if (query == '')
      return url;
    return (url + '&' + query).replace(/[&?]{1,2}/, '?');
  }
  function serializeData(options) {
    if (options.processData && options.data && $.type(options.data) != 'string')
      options.data = $.param(options.data, options.traditional);
    if (options.data && (!options.type || options.type.toUpperCase() == 'GET'))
      options.url = appendQuery(options.url, options.data), options.data = undefined;
  }
  $.ajax = function (options) {
    var settings = $.extend({}, options || {}), deferred = $.Deferred && $.Deferred();
    for (key in $.ajaxSettings)
      if (settings[key] === undefined)
        settings[key] = $.ajaxSettings[key];
    if (!settings.crossDomain)
      settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) && RegExp.$2 != window.location.host;
    if (!settings.url)
      settings.url = window.location.toString();
    serializeData(settings);
    if (settings.cache === false)
      settings.url = appendQuery(settings.url, '_=' + Date.now());
    var dataType = settings.dataType, hasPlaceholder = /\?.+=\?/.test(settings.url);
    if (dataType == 'jsonp' || hasPlaceholder) {
      if (!hasPlaceholder)
        settings.url = appendQuery(settings.url, settings.jsonp ? settings.jsonp + '=?' : settings.jsonp === false ? '' : 'callback=?');
      return $.ajaxJSONP(settings, deferred);
    }
    var mime = settings.accepts[dataType], headers = {}, setHeader = function (name, value) {
        headers[name.toLowerCase()] = [
          name,
          value
        ];
      }, protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol, xhr = settings.xhr(), nativeSetHeader = xhr.setRequestHeader, abortTimeout;
    if (deferred)
      deferred.promise(xhr);
    if (!settings.crossDomain)
      setHeader('X-Requested-With', 'XMLHttpRequest');
    setHeader('Accept', mime || '*/*');
    if (mime) {
      if (mime.indexOf(',') > -1)
        mime = mime.split(',', 2)[0];
      xhr.overrideMimeType && xhr.overrideMimeType(mime);
    }
    if (settings.contentType || settings.contentType !== false && settings.data && settings.type.toUpperCase() != 'GET')
      setHeader('Content-Type', settings.contentType || 'application/x-www-form-urlencoded');
    if (settings.headers)
      for (name in settings.headers)
        setHeader(name, settings.headers[name]);
    xhr.setRequestHeader = setHeader;
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        xhr.onreadystatechange = empty;
        clearTimeout(abortTimeout);
        var result, error = false;
        if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304 || xhr.status == 0 && protocol == 'file:') {
          dataType = dataType || mimeToDataType(xhr.getResponseHeader('content-type'));
          result = xhr.responseText;
          try {
            if (dataType == 'script')
              (1, eval)(result);
            else if (dataType == 'xml')
              result = xhr.responseXML;
            else if (dataType == 'json')
              result = blankRE.test(result) ? null : $.parseJSON(result);
          } catch (e) {
            error = e;
          }
          if (error)
            ajaxError(error, 'parsererror', xhr, settings, deferred);
          else
            ajaxSuccess(result, xhr, settings, deferred);
        } else {
          ajaxError(xhr.statusText || null, xhr.status ? 'error' : 'abort', xhr, settings, deferred);
        }
      }
    };
    if (ajaxBeforeSend(xhr, settings) === false) {
      xhr.abort();
      ajaxError(null, 'abort', xhr, settings, deferred);
      return xhr;
    }
    var async = 'async' in settings ? settings.async : true;
    xhr.open(settings.type, settings.url, async);
    for (name in headers)
      nativeSetHeader.apply(xhr, headers[name]);
    if (settings.timeout > 0) {
      xhr.timeout = settings.timeout;
      xhr.ontimeout = function () {
        xhr.onreadystatechange = empty;
        xhr.abort();
        ajaxError(null, 'timeout', xhr, settings, deferred);
      };
    }
    xhr.send(settings.data ? settings.data : null);
    return xhr;
  };
  function parseArguments(url, data, success, dataType) {
    if ($.isFunction(data))
      dataType = success, success = data, data = undefined;
    if (!$.isFunction(success))
      dataType = success, success = undefined;
    return {
      url: url,
      data: data,
      success: success,
      dataType: dataType
    };
  }
  $.get = function () {
    return $.ajax(parseArguments.apply(null, arguments));
  };
  $.post = function () {
    var options = parseArguments.apply(null, arguments);
    options.type = 'POST';
    return $.ajax(options);
  };
  $.getJSON = function () {
    var options = parseArguments.apply(null, arguments);
    options.dataType = 'json';
    return $.ajax(options);
  };
  $.fn.load = function (url, data, success) {
    if (!this.length)
      return this;
    var self = this, parts = url.split(/\s/), selector, options = parseArguments(url, data, success), callback = options.success;
    if (parts.length > 1)
      options.url = parts[0], selector = parts[1];
    options.success = function (response) {
      self.html(selector ? $('<div>').html(response.replace(rscript, '')).find(selector) : response);
      callback && callback.apply(self, arguments);
    };
    $.ajax(options);
    return this;
  };
  var escape = encodeURIComponent;
  function serialize(params, obj, traditional, scope) {
    var type, array = $.isArray(obj), hash = $.isPlainObject(obj);
    $.each(obj, function (key, value) {
      type = $.type(value);
      if (scope)
        key = traditional ? scope : scope + '[' + (hash || type == 'object' || type == 'array' ? key : '') + ']';
      if (!scope && array)
        params.add(value.name, value.value);
      else if (type == 'array' || !traditional && type == 'object')
        serialize(params, value, traditional, key);
      else
        params.add(key, value);
    });
  }
  $.param = function (obj, traditional) {
    var params = [];
    params.add = function (k, v) {
      this.push(escape(k) + '=' + escape(v));
    };
    serialize(params, obj, traditional);
    return params.join('&').replace(/%20/g, '+');
  };
  exports = $;
  return exports;
}();
anima_yocto_event_101_index_debug = function () {
  anima_yocto_event_101_src_event_debug;
}();
handlebars_runtime_130_dist_cjs_handlebars_base_debug = function (exports) {
  'use strict';
  var Utils = handlebars_runtime_130_dist_cjs_handlebars_utils_debug;
  var Exception = handlebars_runtime_130_dist_cjs_handlebars_exception_debug['default'];
  var VERSION = '1.3.0';
  exports.VERSION = VERSION;
  var COMPILER_REVISION = 4;
  exports.COMPILER_REVISION = COMPILER_REVISION;
  var REVISION_CHANGES = {
      1: '<= 1.0.rc.2',
      2: '== 1.0.0-rc.3',
      3: '== 1.0.0-rc.4',
      4: '>= 1.0.0'
    };
  exports.REVISION_CHANGES = REVISION_CHANGES;
  var isArray = Utils.isArray, isFunction = Utils.isFunction, toString = Utils.toString, objectType = '[object Object]';
  function HandlebarsEnvironment(helpers, partials) {
    this.helpers = helpers || {};
    this.partials = partials || {};
    registerDefaultHelpers(this);
  }
  exports.HandlebarsEnvironment = HandlebarsEnvironment;
  HandlebarsEnvironment.prototype = {
    constructor: HandlebarsEnvironment,
    logger: logger,
    log: log,
    registerHelper: function (name, fn, inverse) {
      if (toString.call(name) === objectType) {
        if (inverse || fn) {
          throw new Exception('Arg not supported with multiple helpers');
        }
        Utils.extend(this.helpers, name);
      } else {
        if (inverse) {
          fn.not = inverse;
        }
        this.helpers[name] = fn;
      }
    },
    registerPartial: function (name, str) {
      if (toString.call(name) === objectType) {
        Utils.extend(this.partials, name);
      } else {
        this.partials[name] = str;
      }
    }
  };
  function registerDefaultHelpers(instance) {
    instance.registerHelper('helperMissing', function (arg) {
      if (arguments.length === 2) {
        return undefined;
      } else {
        throw new Exception('Missing helper: \'' + arg + '\'');
      }
    });
    instance.registerHelper('blockHelperMissing', function (context, options) {
      var inverse = options.inverse || function () {
        }, fn = options.fn;
      if (isFunction(context)) {
        context = context.call(this);
      }
      if (context === true) {
        return fn(this);
      } else if (context === false || context == null) {
        return inverse(this);
      } else if (isArray(context)) {
        if (context.length > 0) {
          return instance.helpers.each(context, options);
        } else {
          return inverse(this);
        }
      } else {
        return fn(context);
      }
    });
    instance.registerHelper('each', function (context, options) {
      var fn = options.fn, inverse = options.inverse;
      var i = 0, ret = '', data;
      if (isFunction(context)) {
        context = context.call(this);
      }
      if (options.data) {
        data = createFrame(options.data);
      }
      if (context && typeof context === 'object') {
        if (isArray(context)) {
          for (var j = context.length; i < j; i++) {
            if (data) {
              data.index = i;
              data.first = i === 0;
              data.last = i === context.length - 1;
            }
            ret = ret + fn(context[i], { data: data });
          }
        } else {
          for (var key in context) {
            if (context.hasOwnProperty(key)) {
              if (data) {
                data.key = key;
                data.index = i;
                data.first = i === 0;
              }
              ret = ret + fn(context[key], { data: data });
              i++;
            }
          }
        }
      }
      if (i === 0) {
        ret = inverse(this);
      }
      return ret;
    });
    instance.registerHelper('if', function (conditional, options) {
      if (isFunction(conditional)) {
        conditional = conditional.call(this);
      }
      if (!options.hash.includeZero && !conditional || Utils.isEmpty(conditional)) {
        return options.inverse(this);
      } else {
        return options.fn(this);
      }
    });
    instance.registerHelper('unless', function (conditional, options) {
      return instance.helpers['if'].call(this, conditional, {
        fn: options.inverse,
        inverse: options.fn,
        hash: options.hash
      });
    });
    instance.registerHelper('with', function (context, options) {
      if (isFunction(context)) {
        context = context.call(this);
      }
      if (!Utils.isEmpty(context))
        return options.fn(context);
    });
    instance.registerHelper('log', function (context, options) {
      var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
      instance.log(level, context);
    });
  }
  var logger = {
      methodMap: {
        0: 'debug',
        1: 'info',
        2: 'warn',
        3: 'error'
      },
      DEBUG: 0,
      INFO: 1,
      WARN: 2,
      ERROR: 3,
      level: 3,
      log: function (level, obj) {
        if (logger.level <= level) {
          var method = logger.methodMap[level];
          if (typeof console !== 'undefined' && console[method]) {
            console[method].call(console, obj);
          }
        }
      }
    };
  exports.logger = logger;
  function log(level, obj) {
    logger.log(level, obj);
  }
  exports.log = log;
  var createFrame = function (object) {
    var obj = {};
    Utils.extend(obj, object);
    return obj;
  };
  exports.createFrame = createFrame;
  return exports;
}({});
handlebars_runtime_130_dist_cjs_handlebars_runtime_debug = function (exports) {
  'use strict';
  var Utils = handlebars_runtime_130_dist_cjs_handlebars_utils_debug;
  var Exception = handlebars_runtime_130_dist_cjs_handlebars_exception_debug['default'];
  var COMPILER_REVISION = handlebars_runtime_130_dist_cjs_handlebars_base_debug.COMPILER_REVISION;
  var REVISION_CHANGES = handlebars_runtime_130_dist_cjs_handlebars_base_debug.REVISION_CHANGES;
  function checkRevision(compilerInfo) {
    var compilerRevision = compilerInfo && compilerInfo[0] || 1, currentRevision = COMPILER_REVISION;
    if (compilerRevision !== currentRevision) {
      if (compilerRevision < currentRevision) {
        var runtimeVersions = REVISION_CHANGES[currentRevision], compilerVersions = REVISION_CHANGES[compilerRevision];
        throw new Exception('Template was precompiled with an older version of Handlebars than the current runtime. ' + 'Please update your precompiler to a newer version (' + runtimeVersions + ') or downgrade your runtime to an older version (' + compilerVersions + ').');
      } else {
        throw new Exception('Template was precompiled with a newer version of Handlebars than the current runtime. ' + 'Please update your runtime to a newer version (' + compilerInfo[1] + ').');
      }
    }
  }
  exports.checkRevision = checkRevision;
  function template(templateSpec, env) {
    if (!env) {
      throw new Exception('No environment passed to template');
    }
    var invokePartialWrapper = function (partial, name, context, helpers, partials, data) {
      var result = env.VM.invokePartial.apply(this, arguments);
      if (result != null) {
        return result;
      }
      if (env.compile) {
        var options = {
            helpers: helpers,
            partials: partials,
            data: data
          };
        partials[name] = env.compile(partial, { data: data !== undefined }, env);
        return partials[name](context, options);
      } else {
        throw new Exception('The partial ' + name + ' could not be compiled when running in runtime-only mode');
      }
    };
    var container = {
        escapeExpression: Utils.escapeExpression,
        invokePartial: invokePartialWrapper,
        programs: [],
        program: function (i, fn, data) {
          var programWrapper = this.programs[i];
          if (data) {
            programWrapper = program(i, fn, data);
          } else if (!programWrapper) {
            programWrapper = this.programs[i] = program(i, fn);
          }
          return programWrapper;
        },
        merge: function (param, common) {
          var ret = param || common;
          if (param && common && param !== common) {
            ret = {};
            Utils.extend(ret, common);
            Utils.extend(ret, param);
          }
          return ret;
        },
        programWithDepth: env.VM.programWithDepth,
        noop: env.VM.noop,
        compilerInfo: null
      };
    return function (context, options) {
      options = options || {};
      var namespace = options.partial ? options : env, helpers, partials;
      if (!options.partial) {
        helpers = options.helpers;
        partials = options.partials;
      }
      var result = templateSpec.call(container, namespace, context, helpers, partials, options.data);
      if (!options.partial) {
        env.VM.checkRevision(container.compilerInfo);
      }
      return result;
    };
  }
  exports.template = template;
  function programWithDepth(i, fn, data) {
    var args = Array.prototype.slice.call(arguments, 3);
    var prog = function (context, options) {
      options = options || {};
      return fn.apply(this, [
        context,
        options.data || data
      ].concat(args));
    };
    prog.program = i;
    prog.depth = args.length;
    return prog;
  }
  exports.programWithDepth = programWithDepth;
  function program(i, fn, data) {
    var prog = function (context, options) {
      options = options || {};
      return fn(context, options.data || data);
    };
    prog.program = i;
    prog.depth = 0;
    return prog;
  }
  exports.program = program;
  function invokePartial(partial, name, context, helpers, partials, data) {
    var options = {
        partial: true,
        helpers: helpers,
        partials: partials,
        data: data
      };
    if (partial === undefined) {
      throw new Exception('The partial ' + name + ' could not be found');
    } else if (partial instanceof Function) {
      return partial(context, options);
    }
  }
  exports.invokePartial = invokePartial;
  function noop() {
    return '';
  }
  exports.noop = noop;
  return exports;
}({});
anima_yocto_touch_106_index_debug = function (exports) {
  var $ = Yocto = anima_yocto_core_110_index_debug;
  anima_yocto_event_102_index_debug;
  anima_yocto_touch_106_src_gestureManager_debug;
  anima_yocto_touch_106_src_tap_debug;
  exports = $;
  return exports;
}();
anima_yocto_ajax_103_src_ajax_debug = function (exports) {
  var $ = anima_yocto_core_110_index_debug, util = anima_yocto_ajax_103_src_util_debug;
  anima_yocto_event_102_index_debug;
  anima_yocto_ajax_103_src_jsonp_debug;
  anima_yocto_ajax_103_src_miniAjax_debug;
  exports = $;
  return exports;
}();
anima_yocto_lite_110_index_debug = function (exports) {
  var $ = anima_yocto_core_110_index_debug;
  anima_yocto_event_101_index_debug;
  exports = $;
  return exports;
}();
anima_widget_112_src_class_debug = function (exports) {
  var $ = anima_yocto_lite_110_index_debug;
  function Class(o) {
    if ($.isFunction(o)) {
      return classify(o).implement({ initialize: o });
    }
  }
  Class.create = function (properties) {
    properties || (properties = {});
    function SubClass() {
      if (this.constructor === SubClass && this.initialize) {
        this.initialize.apply(this, arguments);
      }
    }
    classify(SubClass);
    SubClass.implement(properties);
    return SubClass;
  };
  function classify(cls) {
    _extend(cls, Class);
    cls.extend = extend;
    cls.implement = implement;
    return cls;
  }
  function implement(properties) {
    Array.isArray(properties) || (properties = [properties]);
    var item, proto = this.prototype;
    while (item = properties.shift()) {
      mix(proto, item.prototype || item);
    }
    return this;
  }
  function extend(properties) {
    var subClass = Class.create(properties);
    _extend(subClass, this);
    mix(subClass, this, [
      'extend',
      'implement',
      'superclass'
    ]);
    return subClass;
  }
  function _extend(self, parent) {
    var existed = self.prototype;
    var proto = Object.create(parent.prototype);
    mix(proto, existed);
    proto.constructor = self;
    self.prototype = proto;
    self.superclass = parent.prototype;
  }
  function mix(r, s, bl) {
    for (var p in s) {
      if (s.hasOwnProperty(p)) {
        if (bl && bl.indexOf(p) !== -1)
          continue;
        r[p] = s[p];
      }
    }
  }
  exports = Class;
  return exports;
}();
anima_widget_112_src_attribute_debug = function (exports) {
  var $ = anima_yocto_lite_110_index_debug;
  exports.initAttrs = function (config) {
    var attrs = this.attrs = {};
    var specialProps = this.propsInAttrs || [];
    mergeInheritedAttrs(attrs, this, specialProps);
    if (config) {
      mergeUserValue(attrs, config);
    }
    copySpecialProps(specialProps, this, attrs, true);
  };
  exports.get = function (key) {
    var attr = this.attrs[key] || {};
    var val = attr.value;
    return attr.getter ? attr.getter.call(this, val, key) : val;
  };
  exports.set = function (key, val, options) {
    var attrs = {};
    if (isString(key)) {
      attrs[key] = val;
    } else {
      attrs = key;
      options = val;
    }
    options || (options = {});
    var silent = options.silent;
    var override = options.override;
    var now = this.attrs;
    var changed = this.__changedAttrs || (this.__changedAttrs = {});
    for (key in attrs) {
      if (!attrs.hasOwnProperty(key))
        continue;
      var attr = now[key] || (now[key] = {});
      val = attrs[key];
      var prev = this.get(key);
      if (!override && $.isPlainObject(prev) && $.isPlainObject(val)) {
        val = merge(merge({}, prev), val);
      }
      now[key].value = val;
      if (!this.__initializingAttrs && !isEqual(prev, val)) {
        if (silent) {
          changed[key] = [
            val,
            prev
          ];
        } else {
          this.trigger('change:' + key, val, prev, key);
        }
      }
    }
    return this;
  };
  exports.change = function () {
    var changed = this.__changedAttrs;
    if (changed) {
      for (var key in changed) {
        if (changed.hasOwnProperty(key)) {
          var args = changed[key];
          this.trigger('change:' + key, args[0], args[1], key);
        }
      }
      delete this.__changedAttrs;
    }
    return this;
  };
  exports._isPlainObject = $.isPlainObject;
  var toString = Object.prototype.toString;
  var hasOwn = Object.prototype.hasOwnProperty;
  function isString(val) {
    return toString.call(val) === '[object String]';
  }
  function isEmptyObject(o) {
    if (!o || toString.call(o) !== '[object Object]') {
      return false;
    }
    for (var p in o) {
      if (o.hasOwnProperty(p))
        return false;
    }
    return true;
  }
  function merge(receiver, supplier) {
    var key;
    for (key in supplier) {
      if (supplier.hasOwnProperty(key)) {
        receiver[key] = cloneValue(supplier[key], receiver[key]);
      }
    }
    return receiver;
  }
  function cloneValue(value, prev) {
    if ($.isArray(value)) {
      value = value.slice();
    } else if ($.isPlainObject(value)) {
      $.isPlainObject(prev) || (prev = {});
      value = merge(prev, value);
    }
    return value;
  }
  var keys = Object.keys;
  function mergeInheritedAttrs(attrs, instance, specialProps) {
    var inherited = [];
    var proto = instance.constructor.prototype;
    while (proto) {
      if (!proto.hasOwnProperty('attrs')) {
        proto.attrs = {};
      }
      copySpecialProps(specialProps, proto.attrs, proto);
      if (!isEmptyObject(proto.attrs)) {
        inherited.unshift(proto.attrs);
      }
      proto = proto.constructor.superclass;
    }
    for (var i = 0, len = inherited.length; i < len; i++) {
      mergeAttrs(attrs, normalize(inherited[i]));
    }
  }
  function mergeUserValue(attrs, config) {
    mergeAttrs(attrs, normalize(config, true), true);
  }
  function copySpecialProps(specialProps, receiver, supplier, isAttr2Prop) {
    for (var i = 0, len = specialProps.length; i < len; i++) {
      var key = specialProps[i];
      if (supplier.hasOwnProperty(key)) {
        receiver[key] = isAttr2Prop ? receiver.get(key) : supplier[key];
      }
    }
  }
  function normalize(attrs, isUserValue) {
    var newAttrs = {};
    for (var key in attrs) {
      var attr = attrs[key];
      if (!isUserValue && $.isPlainObject(attr) && attr.hasOwnProperty('getter')) {
        newAttrs[key] = attr;
        continue;
      }
      newAttrs[key] = { value: attr };
    }
    return newAttrs;
  }
  function mergeAttrs(attrs, inheritedAttrs, isUserValue) {
    var key, value;
    var attr;
    for (key in inheritedAttrs) {
      if (inheritedAttrs.hasOwnProperty(key)) {
        value = inheritedAttrs[key];
        attr = attrs[key];
        if (!attr) {
          attr = attrs[key] = {};
        }
        value['value'] !== undefined && (attr['value'] = cloneValue(value['value'], attr['value']));
        if (isUserValue)
          continue;
        if (value['getter'] !== undefined) {
          attr['getter'] = value['getter'];
        }
      }
    }
    return attrs;
  }
  function isEqual(a, b) {
    if ($.isPlainObject(b) || $.isArray(b)) {
      return false;
    }
    return a == b;
  }
  return exports;
}({});
anima_lazyload_101_src_lazyload_debug = function (exports) {
  var $ = anima_yocto_lite_110_index_debug;
  function lazyload(selector, options) {
    var $container, contHeight, contWidth, $this = $(selector), defaults = {
        attr: 'data-url',
        container: window
      };
    $.extend(defaults, options || {});
    $container = $(defaults.container);
    function update() {
      contHeight = $container.height();
      contWidth = $container.width();
    }
    update();
    function inViewport(el) {
      var contTop, contLeft;
      if (defaults.container === window) {
        contTop = $container.scrollTop();
        contLeft = $container.scrollLeft();
      } else {
        contTop = $container.offset().top;
        contLeft = $container.offset().left;
      }
      if (el.offset().top + el.height() > contTop && el.offset().top < contTop + contHeight && (el.offset().left + el.width() > contLeft && el.offset().left < contLeft + contWidth)) {
        return true;
      }
      return false;
    }
    function loadImg() {
      $this.each(function () {
        var self = $(this), url = self.attr(defaults.attr), node = this.nodeName.toLowerCase();
        function isVis(ele) {
          if (ele.css('display') != 'none' && ele.css('visibility') != 'hidden') {
            return true;
          } else {
            return false;
          }
        }
        if (isVis(self) && node === 'img' && inViewport(self) && url) {
          self.attr('src', url).removeAttr(defaults.attr);
        }
      });
    }
    loadImg();
    $container.on('scroll', loadImg);
    if (defaults.container === window) {
      $container.on('resize', function () {
        update();
        loadImg();
      });
    }
  }
  exports = lazyload;
  return exports;
}();
handlebars_runtime_130_dist_cjs_handlebarsruntime_debug = function (exports) {
  'use strict';
  var base = handlebars_runtime_130_dist_cjs_handlebars_base_debug;
  var SafeString = handlebars_runtime_130_dist_cjs_handlebars_safe_string_debug['default'];
  var Exception = handlebars_runtime_130_dist_cjs_handlebars_exception_debug['default'];
  var Utils = handlebars_runtime_130_dist_cjs_handlebars_utils_debug;
  var runtime = handlebars_runtime_130_dist_cjs_handlebars_runtime_debug;
  var create = function () {
    var hb = new base.HandlebarsEnvironment();
    Utils.extend(hb, base);
    hb.SafeString = SafeString;
    hb.Exception = Exception;
    hb.Utils = Utils;
    hb.VM = runtime;
    hb.template = function (spec) {
      return runtime.template(spec, hb);
    };
    return hb;
  };
  var Handlebars = create();
  Handlebars.create = create;
  exports['default'] = Handlebars;
  return exports;
}({});
detail_001_index_debughandlebars = function (exports) {
  var Handlebars = handlebars_runtime_130_dist_cjs_handlebarsruntime_debug['default'];
  exports = Handlebars.template(function (Handlebars, depth0, helpers, partials, data) {
    this.compilerInfo = [
      4,
      '>= 1.0.0'
    ];
    helpers = this.merge(helpers, Handlebars.helpers);
    data = data || {};
    var buffer = '', stack1, helper, functionType = 'function', escapeExpression = this.escapeExpression, self = this;
    function program1(depth0, data) {
      var buffer = '', stack1;
      buffer += '\n                ';
      stack1 = helpers['if'].call(depth0, data == null || data === false ? data : data.first, {
        hash: {},
        inverse: self.program(4, program4, data),
        fn: self.program(2, program2, data),
        data: data
      });
      if (stack1 || stack1 === 0) {
        buffer += stack1;
      }
      buffer += '\n            ';
      return buffer;
    }
    function program2(depth0, data) {
      var buffer = '';
      buffer += '\n                    <li class="pic"><div class="pic-wrap"><img src="' + escapeExpression(typeof depth0 === functionType ? depth0.apply(depth0) : depth0) + '"></div></li>\n                ';
      return buffer;
    }
    function program4(depth0, data) {
      var buffer = '';
      buffer += '\n                    <li class="pic"><div class="pic-wrap"><img class="lazyimg" dataimg="' + escapeExpression(typeof depth0 === functionType ? depth0.apply(depth0) : depth0) + '"></div></li>\n                ';
      return buffer;
    }
    function program6(depth0, data) {
      var buffer = '', stack1;
      buffer += '\n        <ul>\n            ';
      stack1 = helpers.each.call(depth0, depth0 && depth0.attr_list, {
        hash: {},
        inverse: self.noop,
        fn: self.program(7, program7, data),
        data: data
      });
      if (stack1 || stack1 === 0) {
        buffer += stack1;
      }
      buffer += '\n        </ul>\n        ';
      return buffer;
    }
    function program7(depth0, data) {
      var buffer = '', stack1, helper;
      buffer += '\n            <li class="attr">\n                <span class="attr-title">';
      if (helper = helpers.title) {
        stack1 = helper.call(depth0, {
          hash: {},
          data: data
        });
      } else {
        helper = depth0 && depth0.title;
        stack1 = typeof helper === functionType ? helper.call(depth0, {
          hash: {},
          data: data
        }) : helper;
      }
      buffer += escapeExpression(stack1) + '\uFF1A</span>\n                <div class="attr-content">';
      if (helper = helpers.content) {
        stack1 = helper.call(depth0, {
          hash: {},
          data: data
        });
      } else {
        helper = depth0 && depth0.content;
        stack1 = typeof helper === functionType ? helper.call(depth0, {
          hash: {},
          data: data
        }) : helper;
      }
      buffer += escapeExpression(stack1) + '</div>\n            </li>\n            ';
      return buffer;
    }
    function program9(depth0, data) {
      var buffer = '';
      buffer += '\n        <div class="pic"><img data-url="' + escapeExpression(typeof depth0 === functionType ? depth0.apply(depth0) : depth0) + '"></div>\n    ';
      return buffer;
    }
    buffer += '<div id="item-info">\n    <div class="carousel" id="pic-carousel">\n        <div class="carousel-outer">\n            <ul class="carousel-wrap">\n            ';
    stack1 = helpers.each.call(depth0, depth0 && depth0.item_pics, {
      hash: {},
      inverse: self.noop,
      fn: self.program(1, program1, data),
      data: data
    });
    if (stack1 || stack1 === 0) {
      buffer += stack1;
    }
    buffer += '\n            </ul>\n        </div>\n        <div class="carousel-status"></div>\n    </div>\n    <div id="price">\n        <span class="current-price price"><span class="price-unit">&yen;</span><span class="figure">';
    if (helper = helpers.current_price) {
      stack1 = helper.call(depth0, {
        hash: {},
        data: data
      });
    } else {
      helper = depth0 && depth0.current_price;
      stack1 = typeof helper === functionType ? helper.call(depth0, {
        hash: {},
        data: data
      }) : helper;
    }
    buffer += escapeExpression(stack1) + '</span></span><del class="original-price price"><span class="figure">';
    if (helper = helpers.original_price) {
      stack1 = helper.call(depth0, {
        hash: {},
        data: data
      });
    } else {
      helper = depth0 && depth0.original_price;
      stack1 = typeof helper === functionType ? helper.call(depth0, {
        hash: {},
        data: data
      }) : helper;
    }
    buffer += escapeExpression(stack1) + '</span></del>\n        <div class="sold">\u5DF2\u552E<span class="figure">';
    if (helper = helpers.sold) {
      stack1 = helper.call(depth0, {
        hash: {},
        data: data
      });
    } else {
      helper = depth0 && depth0.sold;
      stack1 = typeof helper === functionType ? helper.call(depth0, {
        hash: {},
        data: data
      }) : helper;
    }
    buffer += escapeExpression(stack1) + '</span></div>\n    </div>\n    <div id="summary">\n        <h1>';
    if (helper = helpers.item_title) {
      stack1 = helper.call(depth0, {
        hash: {},
        data: data
      });
    } else {
      helper = depth0 && depth0.item_title;
      stack1 = typeof helper === functionType ? helper.call(depth0, {
        hash: {},
        data: data
      }) : helper;
    }
    buffer += escapeExpression(stack1);
    if (helper = helpers.item_type) {
      stack1 = helper.call(depth0, {
        hash: {},
        data: data
      });
    } else {
      helper = depth0 && depth0.item_type;
      stack1 = typeof helper === functionType ? helper.call(depth0, {
        hash: {},
        data: data
      }) : helper;
    }
    buffer += escapeExpression(stack1) + '</h1>\n        ';
    stack1 = helpers['if'].call(depth0, depth0 && depth0.attr_list, {
      hash: {},
      inverse: self.noop,
      fn: self.program(6, program6, data),
      data: data
    });
    if (stack1 || stack1 === 0) {
      buffer += stack1;
    }
    buffer += '\n    </div>\n</div>\n<div id="item-desc">\n    ';
    stack1 = helpers.each.call(depth0, depth0 && depth0.item_desc, {
      hash: {},
      inverse: self.noop,
      fn: self.program(9, program9, data),
      data: data
    });
    if (stack1 || stack1 === 0) {
      buffer += stack1;
    }
    buffer += '\n</div>';
    return buffer;
  });
  return exports;
}();
detail_001_order_debughandlebars = function (exports) {
  var Handlebars = handlebars_runtime_130_dist_cjs_handlebarsruntime_debug['default'];
  exports = Handlebars.template(function (Handlebars, depth0, helpers, partials, data) {
    this.compilerInfo = [
      4,
      '>= 1.0.0'
    ];
    helpers = this.merge(helpers, Handlebars.helpers);
    data = data || {};
    var buffer = '', stack1, helper, functionType = 'function', escapeExpression = this.escapeExpression;
    buffer += '<div id="order-popup" class="popup">\n\n    <div class="popup-wrap">\n\n        <div class="popup-body">\n\n            <div class="order-info">\n\n                <div class="item-pic"><img src="';
    if (helper = helpers.item_thumb) {
      stack1 = helper.call(depth0, {
        hash: {},
        data: data
      });
    } else {
      helper = depth0 && depth0.item_thumb;
      stack1 = typeof helper === functionType ? helper.call(depth0, {
        hash: {},
        data: data
      }) : helper;
    }
    buffer += escapeExpression(stack1) + '"></div>\n\n                <p class="item-title">';
    if (helper = helpers.item_title) {
      stack1 = helper.call(depth0, {
        hash: {},
        data: data
      });
    } else {
      helper = depth0 && depth0.item_title;
      stack1 = typeof helper === functionType ? helper.call(depth0, {
        hash: {},
        data: data
      }) : helper;
    }
    buffer += escapeExpression(stack1);
    if (helper = helpers.item_type) {
      stack1 = helper.call(depth0, {
        hash: {},
        data: data
      });
    } else {
      helper = depth0 && depth0.item_type;
      stack1 = typeof helper === functionType ? helper.call(depth0, {
        hash: {},
        data: data
      }) : helper;
    }
    buffer += escapeExpression(stack1) + '</p>\n                <p class="item-price price"><span class="current-price"><span class="price-unit">&yen;</span><span class="figure">';
    if (helper = helpers.current_price) {
      stack1 = helper.call(depth0, {
        hash: {},
        data: data
      });
    } else {
      helper = depth0 && depth0.current_price;
      stack1 = typeof helper === functionType ? helper.call(depth0, {
        hash: {},
        data: data
      }) : helper;
    }
    buffer += escapeExpression(stack1) + '</span></span></p>\n\n            </div>\n            <div class="order-count">\n\n                <label for="order-count-input">\u8D2D\u4E70\u6570\u91CF</label>\n                <div class="form-control">\n                    <span class="btn minus-btn">-</span>\n                    <input id="order-count-input" type="number" value="1" name="count" maxlength="2" autocomplete="off">\n                    <span class="btn plus-btn">+</span>\n                </div>\n\n            </div>\n\n        </div>\n\n        <div class="popup-footer">\n\n            <button class="btn confirm-btn" type="button" id="order-confirm-btn" data-busy="\u6B63\u5728\u52A0\u5165..." data-idle="\u786E\u8BA4">\u786E\u8BA4</button>\n\n        </div>\n\n        <button class="btn close-btn">+</button>\n\n    </div>\n\n</div>';
    return buffer;
  });
  return exports;
}();
detail_001_toolbar_debughandlebars = function (exports) {
  var Handlebars = handlebars_runtime_130_dist_cjs_handlebarsruntime_debug['default'];
  exports = Handlebars.template(function (Handlebars, depth0, helpers, partials, data) {
    this.compilerInfo = [
      4,
      '>= 1.0.0'
    ];
    helpers = this.merge(helpers, Handlebars.helpers);
    data = data || {};
    return '<div id="toolbar">\n    <div class="bg"></div>\n    <button class="btn" id="cart-btn" type="button" data-type="1">\u52A0\u5165\u8D2D\u7269\u8F66</button>\n    <button class="btn" id="buy-btn" type="button" data-type="2">\u7ACB\u5373\u8D2D\u4E70</button>\n</div>\n';
  });
  return exports;
}();
anima_yocto_ajax_103_index_debug = function () {
  anima_yocto_ajax_103_src_ajax_debug;
}();
anima_widget_112_src_base_debug = function (exports) {
  var Class = anima_widget_112_src_class_debug;
  var Events = anima_widget_112_src_events_debug;
  var Attribute = anima_widget_112_src_attribute_debug;
  exports = Class.create({
    initialize: function (config) {
      this.initAttrs(config);
      parseEventsFromInstance(this, this.attrs);
    },
    destroy: function () {
      this.off();
      for (var p in this) {
        if (this.hasOwnProperty(p)) {
          delete this[p];
        }
      }
      this.destroy = function () {
      };
    }
  }).implement([
    Events,
    Attribute
  ]);
  function parseEventsFromInstance(host, attrs) {
    for (var attr in attrs) {
      if (attrs.hasOwnProperty(attr)) {
        var m = '_onChange' + ucfirst(attr);
        if (host[m]) {
          host.on('change:' + attr, host[m]);
        }
      }
    }
  }
  function ucfirst(str) {
    return str.charAt(0).toUpperCase() + str.substring(1);
  }
  return exports;
}();
anima_lazyload_101_index_debug = function (exports) {
  exports = anima_lazyload_101_src_lazyload_debug;
  return exports;
}();
anima_widget_112_src_widget_debug = function (exports) {
  var Base = anima_widget_112_src_base_debug;
  var $ = anima_yocto_lite_110_index_debug;
  var DELEGATE_EVENT_NS = '.delegate-events-';
  var ON_RENDER = '_onRender';
  var DATA_WIDGET_CID = 'data-widget-cid';
  var cachedInstances = {};
  var Widget = Base.extend({
      propsInAttrs: [
        'initElement',
        'element'
      ],
      element: null,
      attrs: {
        id: null,
        className: null,
        style: null,
        template: '<div></div>',
        parentNode: document.body
      },
      initialize: function (config) {
        this.cid = uniqueCid();
        Widget.superclass.initialize.call(this, config);
        this.parseElement();
        this.initProps();
        this.setup();
        this._stamp();
        this._isTemplate = !(config && config.element);
      },
      parseElement: function () {
        var element = this.element;
        if (element) {
          this.element = $(element);
        } else if (this.get('template')) {
          this.element = $(this.get('template'));
        }
        if (!this.element || !this.element[0]) {
          throw new Error('element is invalid');
        }
      },
      initProps: function () {
      },
      setup: function () {
      },
      render: function () {
        if (!this.rendered) {
          this._renderAndBindAttrs();
          this.rendered = true;
        }
        var parentNode = this.get('parentNode');
        if (parentNode && !isInDocument(this.element[0])) {
          var outerBoxClass = this.constructor.outerBoxClass;
          if (outerBoxClass) {
            var outerBox = this._outerBox = $('<div></div>').addClass(outerBoxClass);
            outerBox.append(this.element).appendTo(parentNode);
          } else {
            this.element.appendTo(parentNode);
          }
        }
        return this;
      },
      _renderAndBindAttrs: function () {
        var widget = this;
        var attrs = widget.attrs;
        for (var attr in attrs) {
          if (!attrs.hasOwnProperty(attr))
            continue;
          var m = ON_RENDER + ucfirst(attr);
          if (this[m]) {
            var val = this.get(attr);
            if (!isEmptyAttrValue(val)) {
              this[m](val, undefined, attr);
            }
            (function (m) {
              widget.on('change:' + attr, function (val, prev, key) {
                widget[m](val, prev, key);
              });
            }(m));
          }
        }
      },
      _onRenderId: function (val) {
        this.element.attr('id', val);
      },
      _onRenderClassName: function (val) {
        this.element.addClass(val);
      },
      _onRenderStyle: function (val) {
        this.element.css(val);
      },
      _stamp: function () {
        var cid = this.cid;
        (this.initElement || this.element).attr(DATA_WIDGET_CID, cid);
        cachedInstances[cid] = this;
      },
      $: function (selector) {
        return this.element.find(selector);
      },
      destroy: function () {
        delete cachedInstances[this.cid];
        if (this.element && this._isTemplate) {
          this.element.off();
          if (this._outerBox) {
            this._outerBox.remove();
          } else {
            this.element.remove();
          }
        }
        this.element = null;
        Widget.superclass.destroy.call(this);
      }
    });
  exports = Widget;
  var toString = Object.prototype.toString;
  var cidCounter = 0;
  function uniqueCid() {
    return 'widget-' + cidCounter++;
  }
  function isString(val) {
    return toString.call(val) === '[object String]';
  }
  function isInDocument(element) {
    return !!(document.documentElement.compareDocumentPosition(element) & 16);
  }
  function ucfirst(str) {
    return str.charAt(0).toUpperCase() + str.substring(1);
  }
  function isEmptyAttrValue(o) {
    return o == null || o === undefined;
  }
  return exports;
}();
anima_widget_112_index_debug = function (exports) {
  var Widget = anima_widget_112_src_widget_debug;
  exports = Widget;
  return exports;
}();
anima_carousel_101_src_carousel_debug = function (exports) {
  var $ = anima_yocto_lite_110_index_debug, Widget = anima_widget_112_index_debug;
  var hasTransform = function () {
      var ret = 'WebkitTransform' in document.documentElement.style ? true : false;
      return ret;
    }, has3d = function () {
      var style, ret = false, div = document.createElement('div'), style = [
          '&#173;',
          '<style id="smodernizr">',
          '@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}',
          '</style>'
        ].join(''), mStyle = document.documentElement.style;
      div.id = 'modernizr';
      div.innerHTML += style;
      document.body.appendChild(div);
      if ('WebkitPerspective' in mStyle && 'webkitPerspective' in mStyle) {
        ret = div.offsetLeft === 9 && div.offsetHeight === 3;
      }
      div.parentNode.removeChild(div);
      return ret;
    }, gv1 = has3d ? 'translate3d(' : 'translate(', gv2 = has3d ? ',0)' : ')';
  var Carousel = Widget.extend({
      attrs: {
        container: '.slider',
        wrap: null,
        panel: null,
        trigger: null,
        activeTriggerCls: 'sel',
        hasTrigger: false,
        steps: 0,
        left: 0,
        visible: 1,
        margin: 0,
        curIndex: 0,
        duration: 300,
        loop: false,
        play: false,
        interval: 5000,
        useTransform: has3d ? true : false,
        lazy: '.lazyimg',
        lazyIndex: 1,
        callback: null,
        prev: null,
        next: null,
        activePnCls: 'none'
      },
      events: {},
      setup: function () {
        this._findEl() && this._init();
        this._increaseEvent();
      },
      destroy: function () {
      },
      _findEl: function () {
        var element = this.element;
        var x = $('.carousel-1');
        var y = $('.carousel-1');
        if (!element.length) {
          return null;
        }
        set_wrap = this.get('wrap') && element.find(this.get('wrap')) || element.children().first();
        this.set('wrap', set_wrap);
        if (!this.get('wrap').length) {
          return null;
        }
        var set_panel = this.get('panel') && element.find(this.get('panel')) || this.get('wrap').children().first();
        this.set('panel', set_panel);
        if (!this.get('panel').length) {
          return null;
        }
        this.set('panels', this.get('panel').children());
        if (!this.get('panels').length) {
          this.element.hide();
          return null;
        }
        set_trigger = this.get('trigger') && element.find(this.get('trigger'));
        this.set('trigger', set_trigger);
        set_prev = this.get('prev') && element.find(this.get('prev'));
        this.set('prev', set_prev);
        set_next = this.get('next') && element.find(this.get('next'));
        this.set('next', set_next);
        return this;
      },
      _init: function () {
        var wrap = this.get('wrap'), panel = this.get('panel'), panels = this.get('panels'), trigger = this.get('trigger'), len = panels.length, margin = this.get('margin'), allWidth = 0, status = this.get('visible'), useTransform = hasTransform ? this.get('useTransform') : false;
        this.set('len', len);
        this.set('useTransform', useTransform);
        set_steps = this.get('steps') || wrap.width();
        this.set('steps', set_steps);
        panels.each(function (n, item) {
          allWidth += item.offsetWidth;
        });
        if (margin && typeof margin == 'number') {
          allWidth += (len - 1) * margin;
          this.set('steps', this.get('steps') + margin);
        }
        if (status > 1) {
          this.set('loop', false);
        }
        var initLeft = this.get('left');
        initLeft -= this.get('curIndex') * this.get('steps');
        this._setCoord(panel, initLeft);
        if (useTransform) {
          if (has3d) {
            wrap.css({ '-webkit-transform': 'translateZ(0)' });
          }
          panel.css({ '-webkit-backface-visibility': 'hidden' });
        }
        var pages = this._pages = Math.ceil(len / status);
        this._minpage = 0;
        this._maxpage = this._pages - 1;
        this._loadImg();
        this._updateArrow();
        if (pages <= 1) {
          this._getImg(panels[0]);
          trigger && trigger.hide();
          return null;
        }
        if (this._oldLoop) {
          var oldpanels = panel.children();
          oldpanels.eq(oldpanels.length - 2).remove();
          oldpanels.eq(oldpanels.length - 1).remove();
        }
        if (this.get('loop')) {
          panel.append(panels[0].cloneNode(true));
          var lastp = panels[len - 1].cloneNode(true);
          panel.append(lastp);
          this._getImg(lastp);
          lastp.style.cssText += 'position:relative;left:' + -this.get('steps') * (len + 2) + 'px;';
          allWidth += panels[0].offsetWidth;
          allWidth += panels[len - 1].offsetWidth;
        }
        panel.css('width', allWidth);
        if (trigger && trigger.length) {
          var temp = '', childstu = trigger.children();
          if (!childstu.length) {
            for (var i = 0; i < pages; i++) {
              temp += '<span' + (i == this.get('curIndex') ? ' class=' + this.get('activeTriggerCls') + '' : '') + '></span>';
            }
            trigger.html(temp);
          }
          this.set('triggers', trigger.children());
          this.set('triggerSel', this.get('triggers')[this.get('curIndex')]);
        } else {
          this.set('hasTrigger', false);
        }
        return this;
      },
      _setCoord: function (obj, x) {
        this.get('useTransform') && obj.css('-webkit-transform', gv1 + x + 'px,0' + gv2) || obj.css('left', x);
      },
      _loadImg: function (n) {
        n = n || 0;
        if (n < this._minpage)
          n = this._maxpage;
        else if (n > this._maxpage)
          n = this._minpage;
        var status = this.get('visible'), lazyIndex = this.get('lazyIndex') - 1, maxIndex = lazyIndex + n;
        if (maxIndex > this._maxpage)
          return;
        maxIndex += 1;
        var start = (n && lazyIndex + n || n) * status, end = maxIndex * status, panels = this.get('panels');
        end = Math.min(panels.length, end);
        for (var i = start; i < end; i++) {
          this._getImg(panels[i]);
        }
      },
      _updateArrow: function () {
        var prev = this.get('prev'), next = this.get('next');
        if (!prev || !prev.length || !next || !next.length)
          return;
        if (this.get('loop'))
          return;
        var cur = this.get('curIndex'), cls = this.get('activePnCls');
        cur <= 0 && prev.addClass(cls) || prev.removeClass(cls);
        cur >= this._maxpage && next.addClass(cls) || next.removeClass(cls);
      },
      _getImg: function (obj) {
        if (!obj)
          return;
        obj = $(obj);
        if (obj.attr('l')) {
          return;
        }
        var lazy = this.get('lazy'), cls = 'img' + lazy;
        lazy = lazy.replace(/^\.|#/g, '');
        obj.find(cls).each(function (n, item) {
          var nobj = $(item);
          src = nobj.attr('dataimg');
          if (src) {
            nobj.attr('src', src).removeAttr('dataimg').removeClass(lazy);
          }
        });
        obj.attr('l', '1');
      },
      _increaseEvent: function () {
        var that = this, _panel = this.get('wrap')[0], prev = this.get('prev'), next = this.get('next'), triggers = this.get('triggers');
        if (_panel.addEventListener) {
          _panel.addEventListener('touchstart', that, false);
          _panel.addEventListener('touchmove', that, false);
          _panel.addEventListener('touchend', that, false);
          _panel.addEventListener('webkitTransitionEnd', that, false);
          _panel.addEventListener('msTransitionEnd', that, false);
          _panel.addEventListener('oTransitionEnd', that, false);
          _panel.addEventListener('transitionend', that, false);
        }
        if (this.get('play')) {
          this._begin();
        }
        if (prev && prev.length) {
          prev.on('click', function (e) {
            that._backward.call(that, e);
          });
        }
        if (next && next.length) {
          next.on('click', function (e) {
            that._forward.call(that, e);
          });
        }
        if (this.get('hasTrigger') && triggers) {
          triggers.each(function (n, item) {
            $(item).on('click', function () {
              that._slideTo(n);
            });
          });
        }
      },
      handleEvent: function (e) {
        switch (e.type) {
        case 'touchstart':
          this._start(e);
          break;
        case 'touchmove':
          this._move(e);
          break;
        case 'touchend':
        case 'touchcancel':
          this._end(e);
          break;
        case 'webkitTransitionEnd':
        case 'msTransitionEnd':
        case 'oTransitionEnd':
        case 'transitionend':
          this._transitionEnd(e);
          break;
        }
      },
      _start: function (e) {
        var et = e.touches[0];
        this._movestart = undefined;
        this._disX = 0;
        this._coord = {
          x: et.pageX,
          y: et.pageY
        };
      },
      _move: function (e) {
        if (e.touches.length > 1 || e.scale && e.scale !== 1)
          return;
        var et = e.touches[0], disX = this._disX = et.pageX - this._coord.x, initLeft = this.get('left'), tmleft;
        if (typeof this._movestart == 'undefined') {
          this._movestart = !!(this._movestart || Math.abs(disX) < Math.abs(et.pageY - this._coord.y));
        }
        if (!this._movestart) {
          e.preventDefault();
          this._stop();
          if (!this.get('loop')) {
            disX = disX / (!this.get('curIndex') && disX > 0 || this.get('curIndex') == this._maxpage && disX < 0 ? Math.abs(disX) / this.get('steps') + 1 : 1);
          }
          tmleft = initLeft - this.get('curIndex') * this.get('steps') + disX;
          this._setCoord(this.get('panel'), tmleft);
          this._disX = disX;
        }
      },
      _end: function (e) {
        if (!this._movestart) {
          var distance = this._disX;
          if (distance < -10) {
            e.preventDefault();
            this._forward();
          } else if (distance > 10) {
            e.preventDefault();
            this._backward();
          }
          distance = null;
        }
      },
      _begin: function () {
        var that = this;
        if (that.get('play') && !that._playTimer) {
          that._stop();
          that._playTimer = setInterval(function () {
            that._forward();
          }, that.get('interval'));
        }
      },
      _stop: function () {
        var that = this;
        if (that.get('play') && that._playTimer) {
          clearInterval(that._playTimer);
          that._playTimer = null;
        }
      },
      _backward: function (e) {
        if (e && e.preventDefault) {
          e.preventDefault();
        }
        var cur = this.get('curIndex'), minp = this._minpage;
        console.log(cur);
        cur -= 1;
        if (cur < minp) {
          if (!this.get('loop')) {
            cur = minp;
          } else {
            cur = minp - 1;
          }
        }
        this._slideTo(cur);
        this.get('callback') && this.get('callback')(Math.max(cur, minp), -1);
      },
      _forward: function (e) {
        if (e && e.preventDefault) {
          e.preventDefault();
        }
        var cur = this.get('curIndex'), maxp = this._maxpage;
        console.log(cur);
        cur += 1;
        if (cur > maxp) {
          if (!this.get('loop')) {
            cur = maxp;
          } else {
            cur = maxp + 1;
          }
        }
        this._slideTo(cur);
        this.get('callback') && this.get('callback')(Math.min(cur, maxp), 1);
      },
      _slideTo: function (cur, duration) {
        cur = cur || 0;
        this.set('curIndex', cur);
        var panel = this.get('panel'), style = panel[0].style, scrollx = this.get('left') - cur * this.get('steps');
        style.webkitTransitionDuration = style.MozTransitionDuration = style.msTransitionDuration = style.OTransitionDuration = style.transitionDuration = (duration || this.get('duration')) + 'ms';
        this._setCoord(panel, scrollx);
        this._loadImg(cur);
      },
      _transitionEnd: function () {
        var panel = this.get('panel'), style = panel[0].style, loop = this.get('loop'), cur = this.get('curIndex');
        if (loop) {
          if (cur > this._maxpage) {
            this.set('curIndex', 0);
          } else if (cur < this._minpage) {
            this.set('curIndex', this._maxpage);
          }
          this._setCoord(panel, this.get('left') - this.get('curIndex') * this.get('steps'));
        }
        if (!loop && cur == this._maxpage) {
          this._stop();
          this.set('play', false);
        } else {
          this._begin();
        }
        this._update();
        this._updateArrow();
        style.webkitTransitionDuration = style.MozTransitionDuration = style.msTransitionDuration = style.OTransitionDuration = style.transitionDuration = 0;
      },
      _update: function () {
        var triggers = this.get('triggers'), triggerSel = this.get('triggerSel'), cls = this.get('activeTriggerCls'), curIndex = this.get('curIndex');
        if (triggers && triggers[curIndex]) {
          triggerSel && (triggerSel.className = '');
          triggers[curIndex].className = cls;
          this.set('triggerSel', triggers[curIndex]);
        }
      },
      _updateArrow: function () {
        var prev = this.get('prev'), next = this.get('next');
        if (!prev || !prev.length || !next || !next.length)
          return;
        if (this.get('loop'))
          return;
        var cur = this.get('curIndex'), cls = this.get('activePnCls');
        cur <= 0 && prev.addClass(cls) || prev.removeClass(cls);
        cur >= this._maxpage && next.addClass(cls) || next.removeClass(cls);
      },
      cache: [],
      destroy: function () {
        var that = this, _panel = that.get('wrap')[0], prev = that.get('prev'), next = that.get('.next'), triggers = that.get('triggers');
        if (_panel.removeEventListener) {
          _panel.removeEventListener('touchstart', that, false);
          _panel.removeEventListener('touchmove', that, false);
          _panel.removeEventListener('touchend', that, false);
          _panel.removeEventListener('webkitTransitionEnd', that, false);
          _panel.removeEventListener('msTransitionEnd', that, false);
          _panel.removeEventListener('oTransitionEnd', that, false);
          _panel.removeEventListener('transitionend', that, false);
        }
        if (prev && prev.length)
          prev.off('click');
        if (next && next.length)
          next.off('click');
        if (that.get('hasTrigger') && triggers) {
          triggers.each(function (n, item) {
            $(item).off('click');
          });
        }
        return Carousel.superclass.destroy.call(this);
      }
    });
  exports = Carousel;
  return exports;
}();
anima_carousel_101_index_debug = function (exports) {
  exports = anima_carousel_101_src_carousel_debug;
  return exports;
}();
detail_001_index_debug = function () {
  detail_001_index_debugcssjs;
  var tpl = detail_001_index_debughandlebars;
  var orderTpl = detail_001_order_debughandlebars;
  var toolbarTpl = detail_001_toolbar_debughandlebars;
  var $ = anima_yocto_plugin_100_index_debug;
  anima_yocto_touch_106_index_debug;
  anima_yocto_ajax_103_index_debug;
  var Carousel = anima_carousel_101_index_debug;
  var Lazyload = anima_lazyload_101_index_debug;
  var Cookie = cookies_110_index_debug;
  var URI = urijs_1141_src_URI_debug;
  var REQUEST_DATA_FAIL_MSG = 'sorry\uFF0C\u670D\u52A1\u5668\u5F00\u5C0F\u5DEE\uFF0C\u9A6C\u4E0A\u56DE\u6765\u3002';
  var ADD_TO_CART_FAIL_MSG = 'sorry\uFF0C\u670D\u52A1\u5668\u5F00\u5C0F\u5DEE\uFF0C\u9A6C\u4E0A\u56DE\u6765\u3002';
  var ADD_TO_CART_SUCCESS_MSG = '\u5DF2\u6210\u529F\u52A0\u5165\u8D2D\u7269\u8F66\uFF01';
  var REQUEST_TIMEOUT = 10000;
  var PIC_QUALITY_SUFFIX = {
      '2g': '!q50',
      '3g': '!q50',
      '3g+': '!q75',
      '4g': '!q75',
      'wifi': ''
    };
  var $loading;
  var $mask;
  var $orderPopup;
  var $orderCountInput;
  var $orderCountConfirmBtn;
  var itemDataRaw;
  var itemData;
  var $cart;
  var $cartHideTimeout;
  var addToCartLoadingShownTimeout;
  function doNothing() {
  }
  function isCartEmpty(itemId, success) {
    $.ajax({
      type: 'post',
      url: '/api/h/1.0/oCartItems.json?_=' + generateTimestamp(),
      data: { jtoken: generateToken() },
      dataType: 'json',
      timeout: REQUEST_TIMEOUT,
      success: function (data) {
        if (data.status == 1 && data.result && data.result.data) {
          var cart = data.result.data;
          if (cart.length) {
            for (var i = 0, len = cart.length; i < len; i++) {
              var item = cart[i];
              if (item.item_id == itemId) {
                var body = $('body');
                body.data('itemCount', item.item_count);
                break;
              }
            }
          }
          success && success(data.result.data.length == 0);
        } else {
          doNothing();
        }
      },
      error: function (xhr, type) {
        doNothing();
      }
    });
  }
  function showMsg(msg) {
    $('.tbtx-broadcast').remove();
    var div = $('<div class="tbtx-broadcast" style="visibility: hidden;"><p>' + msg + '</p></div>');
    div.appendTo('body').css({
      top: '20%',
      left: '50%',
      'margin-left': -div.width() / 2 + 'px',
      visibility: 'visible'
    });
    setTimeout(function () {
      div.remove();
    }, 3000);
  }
  function createCart() {
    $cart = $('<a id="cart" href="/api/h/1.0/cartPage.htm"><img src="data:image/png;base64,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"></a>');
    $cart.appendTo(document.body);
    return $cart;
  }
  function showCart() {
    if (!$cart) {
      $cart = createCart();
    }
    $cart.removeClass('rollOut').addClass('rollIn');
  }
  function hideCart() {
    $cart && $cart.removeClass('rollIn').addClass('rollOut');
  }
  function createOrderPopup() {
    $mask = $('<div id="mask"></div>');
    $mask.appendTo(document.body);
    $mask.on('tap', function () {
      hideOrderPopup();
    });
    $orderPopup = $(orderTpl(itemData));
    $orderPopup.appendTo(document.body);
    $orderCountInput = $('#order-count-input');
    $orderCountConfirmBtn = $('#order-confirm-btn');
    $orderCountInput.prev().on('tap', function (ev) {
      var $currentTarget = $(ev.currentTarget);
      var count;
      count = $orderCountInput.val() * 1;
      if (count > 1) {
        $orderCountInput.val(--count);
        if (count == 0) {
          $currentTarget.prop('disabled', true).addClass('btn-disabled');
        }
      }
    });
    $orderCountInput.next().on('tap', function (ev) {
      var $currentTarget = $(ev.currentTarget);
      var count;
      count = $orderCountInput.val() * 1;
      if (count < 99) {
        $orderCountInput.val(++count);
        if (count == 99) {
          $currentTarget.prop('disabled', true).addClass('btn-disabled');
        }
      }
    });
    $orderPopup.find('.close-btn').on('tap', function (ev) {
      hideOrderPopup();
    });
    $orderCountInput.on('change', function (ev) {
      var value = ev.target.value * 1;
      if (value < 1 || value > 99) {
        ev.target.value = 1;
      }
    });
    $orderPopup.find('.confirm-btn').on('tap', function (ev) {
      var amount = $orderCountInput.val() * 1;
      if (amount < 1 || amount > 99) {
        amount = 1;
      }
      switch ($orderPopup.attr('data-type')) {
      case '1':
        addToCart(amount);
        break;
      case '2':
        order(amount);
        break;
      }
    });
  }
  function hideOrderPopup() {
    $mask && $mask.hide();
    $orderPopup && $orderPopup.removeClass('popup-pullup');
  }
  function showOrderPopup(type) {
    if ($orderPopup) {
      $orderPopup.find('input').val(1);
    } else {
      createOrderPopup();
    }
    $mask.show();
    $orderPopup.addClass('popup-pullup');
    $orderPopup.attr('data-type', type);
  }
  function getItemId() {
    var itemId;
    var search = location.search;
    if (search) {
      search = search.split('&');
      $.each(search, function (index, param) {
        if (/gid=/.test(param)) {
          itemId = param.split('=')[1];
          return false;
        }
      });
    }
    return itemId;
  }
  function requestDetailData() {
    var itemId = getItemId();
    if (!itemId) {
      console.log('\u65E0\u6CD5\u83B7\u53D6itemId');
      return;
    }
    showLoading();
    $.ajax({
      type: 'post',
      url: '/api/m/1.0/item.json?_=' + generateTimestamp(),
      data: {
        itemId: itemId,
        jtoken: generateToken()
      },
      dataType: 'json',
      timeout: REQUEST_TIMEOUT,
      success: function (data) {
        if (data.status == 1 && data.result && data.result.item) {
          itemDataRaw = data.result.item;
          onDataLoad(decorateData(data.result.item));
          halfActiveSnapshot(itemId);
        } else {
          showMsg(REQUEST_DATA_FAIL_MSG);
        }
      },
      error: function (xhr, type) {
        showMsg(REQUEST_DATA_FAIL_MSG);
      }
    });
  }
  function onDataLoad(data) {
    hideLoading();
    $('#toolbar').show();
    itemData = data;
    $('#content').css({ 'min-height': $(window).height() }).html(tpl(data));
    var picWrapWidth = $('#pic-carousel').width();
    var picWrapHeight = Math.ceil(picWrapWidth / 320 * 250);
    $('#pic-carousel .carousel-outer').height(picWrapHeight);
    $('#pic-carousel .carousel-wrap li').width(picWrapWidth).height(picWrapHeight);
    if ($('#pic-carousel img').size() > 1) {
      var carousel = new Carousel({
          element: '#pic-carousel',
          trigger: '.carousel-status',
          loop: true,
          play: true,
          hasTrigger: true
        });
    }
    Lazyload('#item-desc img');
    isCartEmpty(itemDataRaw.itemId, function (isEmpty) {
      !isEmpty && showCart();
    });
    $(toolbarTpl()).appendTo(document.body);
    $('#toolbar .btn').on('tap', function (ev) {
      var $target = $(ev.target);
      var type = $target.attr('data-type') * 1;
      showOrderPopup(type);
    });
  }
  function decorateData(rawData) {
    var data = {};
    var attr_list = [];
    data['item_pics'] = rawData['pics'].split(';');
    data['item_desc'] = rawData['detail'].split(';');
    data['current_price'] = rawData['price'] / 100;
    data['original_price'] = rawData['refPrice'] / 100;
    data['sold'] = decorateSold(rawData['soldCnt'], rawData['itemId']);
    data['item_title'] = rawData['title'];
    data['item_type'] = rawData['specification'];
    if (rawData['features']) {
      $.each($.parseJSON(rawData['features']), function (key, value) {
        attr_list.push({
          title: key,
          content: value
        });
      });
      data['attr_list'] = attr_list;
    }
    data['item_desc'].push('http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20150202/vNTT-0-1422886245014.jpg');
    data['item_desc'].push('http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20150202/vNTT-0-1422886246875.jpg');
    data['item_desc'].push('http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20150202/vNTT-0-1422886245520.jpg');
    data['item_desc'].push('http://welinklife.b0.upaiyun.com/1/LTE=/SVRFTS1QVUJMSVNI/MA==/20150202/vNTT-0-1422886247170.jpg');
    data['item_pics'] = addPicQualitySuffix(data['item_pics']);
    data['item_desc'] = addPicQualitySuffix(data['item_desc']);
    data['item_thumb'] = data['item_pics'][0];
    return data;
  }
  function showLoading() {
    $loading = $('<div id="loading"><span></span></div>');
    $loading.appendTo(document.body);
    $loading.css({ 'top': ($(window).height() - $loading.height()) / 2 + 'px' });
  }
  function hideLoading() {
    $loading.hide();
  }
  function halfActiveSnapshot(itemId) {
    $.ajax({
      type: 'post',
      url: 'api/h/1.0/halfActiveSnapshot.json?_=' + generateTimestamp(),
      data: { jtoken: generateToken() },
      dataType: 'json',
      timeout: REQUEST_TIMEOUT,
      success: function (data) {
        if (data && data.status == 1 && data.result && data.result.excutiveList && data.result.excutiveList.length) {
          var halfGoodsList = data.result.excutiveList;
          for (var i = 0, len = halfGoodsList.length; i < len; i++) {
            if (itemId == halfGoodsList[i].itemId) {
              var body = $('body');
              $.each(halfGoodsList[i], function (key, val) {
                body.data(key, val);
              });
              body.addClass('is-half-goods');
              break;
            }
          }
        } else {
        }
      },
      error: function (xhr, type) {
      }
    });
  }
  function checkHalfGoodsLimitNum(amount) {
    var body = $('body');
    if (body.hasClass('is-half-goods')) {
      var limit = body.data('limitNum');
      if (limit < amount) {
        alert('\u534A\u4EF7\u5546\u54C1\u9650\u8D2D' + limit + '\u4EFD\uFF01');
        return false;
      }
    }
    return true;
  }
  function checkActiveOrder(itemId, callback) {
    if (!checkUserLogin()) {
      return;
    }
    $.ajax({
      type: 'post',
      url: '/api/h/1.0/checkActiveOrder.json?_=' + generateTimestamp(),
      data: {
        ids: itemId,
        daily: true,
        jtoken: generateToken()
      },
      dataType: 'json',
      timeout: REQUEST_TIMEOUT,
      success: function (data) {
        console.log(data);
        if (data && data.status == 1 && data.result && data.result.items && data.result.items.length) {
          var items = data.result.items;
          for (var i = 0, len = items.length; i < len; i++) {
            var item = items[i];
            if (item.itemId == itemId && item.item_status == 1) {
              if (!item.num) {
                alert('\u4E0D\u597D\u610F\u601D\uFF0C\u5DF2\u7ECF\u5356\u5B8C\u4E86\uFF01');
                return;
              }
              if (item.picked != '1') {
                alert('\u4E0D\u597D\u610F\u601D\uFF0C\u60A8\u5DF2\u7ECF\u8D2D\u4E70\u8FC7\u4E86\uFF01');
                return;
              }
              $.isFunction(callback) && callback();
            }
          }
        } else {
          alert(data && data.msg || '\u68C0\u67E5\u534A\u4EF7\u5546\u54C1\u51FA\u9519\uFF01');
        }
      },
      error: function (xhr, type) {
        console.log('\u68C0\u67E5\u534A\u4EF7\u5546\u54C1\u51FA\u9519:', xhr, type);
      }
    });
  }
  function addToCart(amount) {
    if (!checkUserLogin()) {
      return;
    }
    var itemId = getItemId();
    if (itemId) {
      var itemCount = $('body').data('itemCount') || 0;
      if (!checkHalfGoodsLimitNum(amount + itemCount)) {
        return;
      }
      checkActiveOrder(itemId, function () {
        _addToCart(amount);
      });
    }
  }
  function checkUserLogin() {
    if (!pageConfig || !pageConfig.pid) {
      location.href = '/api/h/1.0/vLoginPage.htm?refurl=' + encodeURIComponent(location.href);
      return false;
    }
    return true;
  }
  function _addToCart(amount) {
    if (addToCartLoadingShownTimeout) {
      clearTimeout(addToCartLoadingShownTimeout);
      addToCartLoadingShownTimeout = null;
    }
    addToCartLoadingShownTimeout = setTimeout(function () {
      $orderCountConfirmBtn.val($orderCountConfirmBtn.attr('data-busy')).addClass('btn-busy');
    }, 1000);
    $.ajax({
      type: 'post',
      url: '/api/h/1.0/addCart.json?_=' + generateTimestamp(),
      data: {
        items: JSON.stringify([{
            item_id: itemDataRaw.itemId,
            num: amount
          }]),
        jtoken: generateToken()
      },
      dataType: 'json',
      timeout: REQUEST_TIMEOUT,
      success: function (data) {
        if (addToCartLoadingShownTimeout) {
          clearTimeout(addToCartLoadingShownTimeout);
          addToCartLoadingShownTimeout = null;
        }
        $orderCountConfirmBtn.val($orderCountConfirmBtn.attr('data-busy')).removeClass('btn-busy');
        if (data.status == 1) {
          hideOrderPopup();
          var itemCount = ($('body').data('itemCount') || 0) + amount;
          $('body').data('itemCount', itemCount);
          if (data.result && data.result['item_kinds'] > 0) {
            showCart();
          } else {
            hideCart();
          }
          showMsg(ADD_TO_CART_SUCCESS_MSG);
        } else {
          showMsg(ADD_TO_CART_FAIL_MSG);
        }
      },
      error: function (xhr, type) {
        if (addToCartLoadingShownTimeout) {
          clearTimeout(addToCartLoadingShownTimeout);
          addToCartLoadingShownTimeout = null;
        }
        $orderCountConfirmBtn.val($orderCountConfirmBtn.attr('data-busy')).removeClass('btn-busy');
        showMsg(ADD_TO_CART_FAIL_MSG);
      }
    });
  }
  function order(amount) {
    if (!checkUserLogin()) {
      return;
    }
    var itemId = getItemId();
    if (itemId) {
      if (!checkHalfGoodsLimitNum(amount)) {
        return;
      }
      checkActiveOrder(itemId, function () {
        _order(amount);
      });
    }
  }
  function _order(amount) {
    var uri = new URI('/api/h/1.0/placeOrder.htm');
    uri.addQuery('gid', itemDataRaw['itemId']).addQuery('count', amount);
    window.location.assign(uri.toString());
  }
  function generateTimestamp() {
    return Date.parse(new Date());
  }
  function generateToken() {
    function random() {
      return Math.random().toString(36).substring(2, 15);
    }
    var token = random() + random();
    Cookie.set('XDJ_JTOKEN', token, { path: '/' });
    return token;
  }
  function addPicQualitySuffix(picArr) {
    var arr = [];
    $.each(picArr, function (index, url) {
      if (/^(http:\/\/welinklife\.b0\.upaiyun\.com\/)[\S]*(\.jpg)$/gi.test(url)) {
        url += PIC_QUALITY_SUFFIX[sessionStorage.networkType || '4g'];
      }
      arr.push(url);
    });
    return arr;
  }
  function decorateSold(amount, itemId) {
    var amount = parseInt(amount || '1');
    return amount + Math.abs(Math.ceil(Math.sin(parseInt(itemId)) * (100 + amount)));
  }
  function init() {
    requestDetailData();
  }
  init();
}();
}());