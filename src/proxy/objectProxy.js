var Observable = require('../mixin/observable');

/**
 * Creates proxy on plain Javascript object.
 *
 * @param data {Object}  Source object to create proxy on.
 * @returns {Object}     Observable proxy, which triggers change events on data modification.
 */
module.exports = function ObjectProxy(data) {
    var proxy = {};
    var trigger = Observable.mixin(proxy);
    Object.getOwnPropertyNames(data).forEach(function(key) {
        Object.defineProperty(proxy, key, {
            enumerable: true,
            get: function() {
                return data[key];
            },
            set: function(value) {
                data[key] = value;
                trigger('change', {
                    key: key,
                    type: 'set',
                    value: value
                });
                trigger(key + 'Change', {
                    key: key,
                    type: 'set',
                    value: value
                });
            }
        });
    });
    return proxy;
};
