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

    proxyArray.set = function(index, value) {
        array[index] = value;
        proxyArray[index] = value;
        trigger('change', {
            type: 'set',
            index: index,
            value: value
        });
    };

    function proxy(method) {
        var args = Array.prototype.slice.call(arguments, 1);
        Array.prototype[method].apply(proxyArray, args);
        var result = Array.prototype[method].apply(array, args);

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
    return proxyArray;
};
