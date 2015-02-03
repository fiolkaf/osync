//var MessageBus = require('messagebus');

module.exports = {
    sendChanges: function(uri, changes) {
        MessageBus.channel('data').publish('update' + uri, changes);
    },
    subscribeChanges: function(uri, callback) {
        return MessageBus.channel('data').subscribe('update' + uri, function(envelope) {
            callback(envelope.payload);
        });
    }
};
