define("arale/base/1.2.0/base", ["arale/class/1.2.0/class", "arale/events/1.2.0/events", "arale/base/1.2.0/aspect", "arale/base/1.2.0/attribute"], function(Class, Events, Aspect, Attribute) {
    // Base
    // ---------
    // Base 是一个基础类，提供 Class、Events、Attrs 和 Aspect 支持。

    /* var Class = require('arale-class');
     var Events = require('arale-events');
     var Aspect = require('./aspect');
     var Attribute = require('./attribute');*/


    var exports = Class.create({
        Implements: [Events, Aspect, Attribute],

        initialize: function(config) {
            this.initAttrs(config);

            // Automatically register `this._onChangeAttr` method as
            // a `change:attr` event handler.
            parseEventsFromInstance(this, this.attrs);
        },

        destroy: function() {
            this.off();

            for (var p in this) {
                if (this.hasOwnProperty(p)) {
                    delete this[p];
                }
            }

            // Destroy should be called only once, generate a fake destroy after called
            // https://github.com/aralejs/widget/issues/50
            this.destroy = function() {};
        }
    });


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
});