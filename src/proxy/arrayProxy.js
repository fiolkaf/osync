define(function(require) {
    'use strict';

    var proxy = function (method) {
        var args = Array.prototype.slice.call(arguments, 1);
        var result = Array.prototype[method].apply(arr, args);

        return result;
    };

    /**
     * Creates a proxy on a array with basic modify methods.
     * [ 'pop', 'push', 'reverse', 'shift', 'unshift', 'splice', 'sort' ]
     *
     * @param array {Array} Source array
     */
    var ArrayProxy = function(array) {
        [ 'pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift' ].forEach(function (method) {
            Object.defineProperty(array, method, {
                value: proxy.bind(null, method) }
            );
        });
    };

    return ArrayProxy;
});