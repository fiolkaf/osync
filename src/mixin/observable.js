function Observable(target) {
    if (target.on !== undefined) {
        throw '"On" method already defined';
    }
    var subscriptions = {};

    target.on = function(topic, callback) {
        subscriptions[topic] = subscriptions[topic] || [];
        subscriptions[topic].push(callback);
        return function() {
            var index = subscriptions[topic].indexOf(callback);
            subscriptions[topic].splice(index, 1);
        };
    };

    target._trigger = function(topic, argn) {
        if (subscriptions[topic] === undefined) {
            return;
        }
        var args = Array.prototype.slice.call(arguments, 1);
        subscriptions[topic].forEach(function(subscription) {
            subscription.apply(this, args);
        });
    };

    return target._trigger;
}

module.exports = {
    mixin: Observable
};
