define(function(require) {
    'use strict';

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

        array.forEach(function(item, index) {
            if (Array.isArray(item)) {
                throw 'Observable array does not support nested Arrays';
            }

            if (typeof item === 'object' ) {
                item = new ObservableObject(item);
                item.on('change', function() {
                    var args = Array.prototype.slice.call(arguments, 1);
                    var argumentPath = '[' + index + '].' + arguments[0];
                    proxy._trigger.apply(this, ['change', argumentPath].concat(args));
                });
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

        Object.getOwnPropertyNames(data).forEach(function(key) {
            var value = data[key];
            if (Array.isArray(value)) {
                var arrayProxy = new ObservableArray(value);
                arrayProxy.on('change', function(type, value) {
                    var args;
                    if (typeof value === 'object') { // Array method modifications
                        args = ['change', key, { type: type, value: value }];
                    } else { // Property modifications
                        args = Array.prototype.slice.call(arguments, 1);
                        var argumentPath = key +  arguments[0];
                        args = ['change', argumentPath].concat(args);
                    }
                    proxy._trigger.apply(this, args);
                });
                proxy[key] = arrayProxy;
            } else if (typeof value === 'object') {
                var propertyProxy = new ObservableObject(value);
                propertyProxy.on('change', function() {
                    var args = Array.prototype.slice.call(arguments, 1);
                    var argumentPath = key + '.' + arguments[0];
                    proxy._trigger.apply(this, ['change', argumentPath].concat(args));
                });
                proxy[key] = propertyProxy;
            }
        });

        return proxy;
    }

    return {
        ObservableObject: ObservableObject,
        ObservableArray: ObservableArray
    };

});
