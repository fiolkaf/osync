define(function(require) {
    'use strict';

    //var MessageBus = require('messagebus');

    return {
        sendChanges: function(uri, changes) {
            MessageBus.channel('data').publish('update' + uri, changes);
        },
        subscribeChanges: function(uri, callback) {
            return MessageBus.channel('data').subscribe('update' + uri, function(envelope) {
                callback(envelope.payload);
            });
        }
    };
});
