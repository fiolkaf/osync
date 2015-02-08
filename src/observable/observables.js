var Disposable = require('../mixin/disposable');
var ObjectProxy = require('../proxy/objectProxy');
var ArrayProxy = require('../proxy/arrayProxy');

/**
 * Creates a proxy on a complex hierarchical Javascript array.
 *
 * @param array {Array}  Source array to create proxy on.
 * @returns {Array}      Observable array, triggers change events on data modification of entire array and it's objects.
 */
function ObservableArray(array) {
    var proxy = new ArrayProxy(array);
    Disposable.mixin(proxy);

    function getObservableArrayObject(index, item) {
        var observable = item.hasOwnProperty('on') ? item : new ObservableObject(item);
        var unsubscribe = observable.on('change', function(evt) {
            evt.target = evt.target ? evt.target : observable;
            evt.key = '[' + index + '].' + evt.key;
            proxy._trigger.call(this, 'change', evt);
        });
        proxy.addDisposer(unsubscribe);
        proxy.addDisposer(observable.dispose);
        return observable;
    }

    array.forEach(function(item, index) {
        if (Array.isArray(item)) {
            throw 'Observable array does not support nested Arrays';
        }
        if (typeof item === 'object') {
            proxy[index] = getObservableArrayObject(index, item);
        }
    });

    var unsubscribe = proxy.on('change', function(evt) {
        switch(evt.type) {
            case 'push':
                return evt.args.map(function(item, index) {
                    var itemIndex = evt.result - evt.args.length + index;
                    array[itemIndex] = typeof item === 'object' ?
                        getObservableArrayObject(itemIndex, item) : array[itemIndex];
                });
            case 'unshift':
                return evt.args.map(function(item, index) {
                    array[index] = typeof item === 'object' ?
                        getObservableArrayObject(index, item) : array[index];
                });
            case 'splice':
                var startIndex = evt.args[0];
                var inserted = Array.prototype.slice.call(evt.args, 2);
                return inserted.map(function(item, index) {
                    var itemIndex = index + startIndex;
                    array[itemIndex] = typeof item === 'object' ?
                        getObservableArrayObject(itemIndex, item) : array[itemIndex];
                });
        }
    });
    proxy.addDisposer(unsubscribe);

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
        var eventArgs;
        var childProxy;
        var unsubscribe;
        var value = data[key];
        if (value === null) {
            return;
        }
        if (Array.isArray(value)) {
            childProxy = new ObservableArray(value);
            unsubscribe = childProxy.on('change', function(evt) {
                if (evt.key) { //Rely children events
                    evt.key = key + evt.key;
                } else if (evt.type === 'set'){
                    evt.key = key + '[' + evt.index + ']';
                } else { // Methods
                    evt.key = key;
                }
                evt.target = evt.target ? evt.target : proxy;
                proxy._trigger.call(this, 'change', evt);
            });
        } else if (typeof value === 'object') {
            childProxy = new ObservableObject(value);
            unsubscribe = childProxy.on('change', function(evt) {
                evt.target = evt.target ? evt.target : childProxy;
                evt.key = key + '.' + evt.key;
                proxy._trigger.call(this, 'change', evt);
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

module.exports = {
    ObservableObject: ObservableObject,
    ObservableArray: ObservableArray
};
