define(function(require) {
    'use strict';

    var Observable = require('src/mixin/observable');

    /**
     * Creates a proxy on a array with basic modify methods.
     * [ 'pop', 'push', 'reverse', 'shift', 'unshift', 'splice', 'sort' ]
     *
     * @param array {Array} Source array
     */
    var ArrayProxy = function(array) {

        var trigger = Observable.mixin(array);

        function proxy(method) {
            var args = Array.prototype.slice.call(arguments, 1);
            var result = Array.prototype[method].apply(array, args);
            if (['pop', 'shift'].indexOf(method) >= 0) {
                trigger('change', method, result);
            } else {
                trigger('change', method, args);
            }

            return result;
        }

        ['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'].forEach(function(method) {
            Object.defineProperty(array, method, {
                value: proxy.bind(null, method)
            });
        });

        return array;
    };

    return ArrayProxy;
});
