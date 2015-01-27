define(function(require) {
    'use strict';

    var Observable = require('src/mixin/observable');

    /**
     * Creates a proxy on a array with basic modify methods.
     * [ 'pop', 'push', 'reverse', 'shift', 'unshift', 'splice', 'sort' ]
     *
     * @param array {Array} Source array
     */
    return function ArrayProxy(array) {
        var proxyArray = array.slice(0);
        var trigger = Observable.mixin(proxyArray);

        function redefineSetters(proxyArray) {
            // Foreach index proxy setter
            array.forEach(function(value, index) {
                Object.defineProperty(proxyArray, index, {
                    configurable: true,
                    get: function() {
                        return array[index];
                    },
                    set: function(value) {
                        array[index] = value;

                        trigger('change', index, value);
                    }
                });
            });
        }

        function proxy(method) {
            var args = Array.prototype.slice.call(arguments, 1);
            // DO not reverse and sort proxy as those already work on indexers
            if (['reverse', 'sort'].indexOf(method) < 0) {
                Array.prototype[method].apply(proxyArray, args);
            }
            var result = Array.prototype[method].apply(array, args);
            if (['pop', 'shift'].indexOf(method) >= 0) {
                trigger('change', method, result);
            } else {
                trigger('change', method, args);
            }
            redefineSetters(proxyArray);

            return result;
        }

        // Proxy modify methods on array
        ['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'].forEach(function(method) {
            Object.defineProperty(proxyArray, method, {
                value: proxy.bind(null, method)
            });
        });
        redefineSetters(proxyArray);
        return proxyArray;
    };
});
