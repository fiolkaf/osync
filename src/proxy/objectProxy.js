var Observable = require('../mixin/observable');

/**
 * Creates proxy on plain Javascript object.
 *
 * @param data {Object}  Source object to create proxy on.
 * @returns {Object}     Observable proxy, which triggers change events on data modification.
 */
module.exports = function ObjectProxy(data) {
    var _this = {};
    var trigger = Observable.mixin(_this);

    _this.defineProperty = function(key) {
        Object.defineProperty(_this, key, {
            enumerable: true,
            get: function() {
                return data[key];
            },
            set: function(value) {
                data[key] = value;
                trigger('change', {
                    key: key,
                    type: 'set',
                    value: value,
                    target: _this
                });
                trigger(key + 'Change', {
                    key: key,
                    type: 'set',
                    value: value,
                    target: _this
                });
            }
        });
    };

    Object.getOwnPropertyNames(data).forEach(_this.defineProperty);
    return _this;
};
