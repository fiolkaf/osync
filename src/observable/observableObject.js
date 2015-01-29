define(function(require) {
    'use strict';

    var Disposable = require('src/mixin/disposable');
    var ObjectProxy = require('src/proxy/objectProxy');
    var ArrayProxy = require('src/proxy/arrayProxy');

    /**
     * Creates a proxy on a complex hierarchical Javascript array.
     *
     * @param array {Array}  Source array to create proxy on.
     * @returns {Array}      Observable array, triggers change events on data modification of entire array and it's objects.
     */
    function ObservableArray(array) {
        var proxy = new ArrayProxy(array);
        Disposable.mixin(proxy);

        array.forEach(function(item, index) {
            if (Array.isArray(item)) {
                throw 'Observable array does not support nested Arrays';
            }

            if (typeof item === 'object') {
                item = new ObservableObject(item);
                var unsubscribe = item.on('change', function() {
                    var args = Array.prototype.slice.call(arguments, 1);
                    var argumentPath = '[' + index + '].' + arguments[0];
                    proxy._trigger.apply(this, ['change', argumentPath].concat(args));
                });
                proxy.addDisposer(unsubscribe);
                proxy.addDisposer(item.dispose);
                proxy[index] = item;
            }
        });

        return proxy;
    }

    /**
     * Creates a proxy on a complex hierarchical Javascript object.
     *
     * @param data {Object}  Source object to create proxy on.
     * @returns {Object}     Observable object, triggers change events on data modification of entire object structure.
     */
    function ObservableObject(data) {
        var proxy = new ObjectProxy(data);
        Disposable.mixin(proxy);

        Object.getOwnPropertyNames(data).forEach(function(key) {
            var args;
            var childProxy;
            var unsubscribe;
            var value = data[key];

            if (Array.isArray(value)) {
                childProxy = new ObservableArray(value);
                unsubscribe = childProxy.on('change', function(subKey, value) {
                    if (typeof subKey === 'number') { // Indexer assignment
                        args = Array.prototype.slice.call(arguments, 1);
                        args = ['change', key + '[' + subKey + ']'].concat(args);
                    } else if (subKey.indexOf('.') > -1) { // Nested properties
                        args = Array.prototype.slice.call(arguments, 1);
                        args = ['change', key + arguments[0]].concat(args);
                    } else { // Array collection modifications
                        args = ['change', key, {
                            type: subKey,
                            value: value
                        }];
                    }
                    proxy._trigger.apply(this, args);
                });

            } else if (typeof value === 'object') {
                childProxy = new ObservableObject(value);
                unsubscribe = childProxy.on('change', function() {
                    args = Array.prototype.slice.call(arguments, 1);
                    var argumentPath = key + '.' + arguments[0];
                    args = ['change', argumentPath].concat(args);
                    proxy._trigger.apply(this, args);
                });
            }

            if (!childProxy) {
                return;
            }
            proxy[key] = childProxy;
            proxy.addDisposer(unsubscribe);
            proxy.addDisposer(childProxy.dispose);

        });
        return proxy;
    }

    return {
        ObservableObject: ObservableObject,
        ObservableArray: ObservableArray
    };

});
