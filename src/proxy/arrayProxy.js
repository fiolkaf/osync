var Observable = require('../mixin/observable');

/**
 * Creates a proxy on a array with basic modify methods.
 * [ 'pop', 'push', 'reverse', 'shift', 'unshift', 'splice', 'sort' ]
 *
 * @param array {Array} Source array
 */
module.exports = function ArrayProxy(array) {
    var proxyArray = array.slice(0);
    var trigger = Observable.mixin(proxyArray);
    function redefineSetters(proxyArray) {
        Array.prototype.splice.call(proxyArray, 0); // clean the array
        array.forEach(function(value, index) {
            Array.prototype.push.call(proxyArray, value);
            Object.defineProperty(proxyArray, index, {
                configurable: true,
                get: function() {
                    return array[index];
                },
                set: function(value) {
                    array[index] = value;
                    trigger('change', {
                        type: 'set',
                        index: index,
                        value: value
                    });
                }
            });
        });
    }

    function proxy(method) {
        var args = Array.prototype.slice.call(arguments, 1);
        var result = Array.prototype[method].apply(array, args);
        redefineSetters(proxyArray);

        trigger('change', {
            type: method,
            args: args,
            result: result
        });

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
