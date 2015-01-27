define(function(require) {
    'use strict';

    function propertyProxy(object, key, objectProxy, path) {
        var propertyPath = path ? path + '.' + key : key;
        var proxyGet;
        if ((typeof object[key] === 'object') && ! Array.isArray(object[key])) {
             proxyGet = new ObjectProxy(object[key], propertyPath);
        }

        Object.defineProperty(objectProxy, key, {
            enumerable: true,
            get: function() {
                return proxyGet ? proxyGet : object[key];
            },
            set: function(value) {
                if ((typeof value === 'object') && ! Array.isArray(value)) {
                    object[key] = new ObjectProxy(value, propertyPath);
                }
                object[key] = value;
            }
        });
    }

    var ObjectProxy = function(data, path) {
        path = path || '';
        var proxy = {};

        Object.getOwnPropertyNames(data).forEach(function(key) {
            var sourceProperty = data[key];
            propertyProxy(data, key, proxy, path);

            //Array
            // [ 'pop', 'push', 'reverse', 'shift', 'unshift', 'splice', 'sort' ]
        });
        return proxy;
    };

    return ObjectProxy;
});
