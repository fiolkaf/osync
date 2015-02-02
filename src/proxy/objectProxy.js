define(function(require) {
    'use strict';

    var Observable = require('src/mixin/observable');

    /**
     * Creates proxy on plain Javascript object.
     *
     * @param data {Object}  Source object to create proxy on.
     * @returns {Object}     Observable proxy, which triggers change events on data modification.
     */
    return function ObjectProxy(data) {
        var proxy = {};
        var trigger = Observable.mixin(proxy);

        Object.getOwnPropertyNames(data).forEach(function(key) {
            Object.defineProperty(proxy, key, {
                enumerable: true,
                get: function() {
                    return data[key];
                },
                set: function(value) {
                    trigger('change', {
                        key: key,
                        type: 'set',
                        value: value
                    });
                    data[key] = value;
                }
            });
        });
        return proxy;
    };
});
