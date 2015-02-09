var MessageBus = require('bussi');
var DataUtils = require('../utils/dataUtils');

module.exports = function MessageBusAdapter() {
    var channel = MessageBus.channel('data');

    this.sendChanges = function(uri, changes) {
        channel.publish('update' + uri, DataUtils.deepClone(changes));
    };

    this.subscribeChanges = function(uri, callback) {
        return channel.subscribe('update' + uri, function(envelope) {
            callback(uri, DataUtils.deepClone(envelope.payload));
        });
    };
};
