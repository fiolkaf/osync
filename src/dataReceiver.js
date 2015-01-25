define(['bussi'], function (MessageBus) {

    function DataReceiver(type, dataAdapter) {
        var emit = EventEmitter.mixin(this);
        var channel = MessageBus.channel('actions');

        function sentDataRequest(command, type, payload) {
            channel.publish('get/' + type + 's', payload);
            channel.subscribe('receive/' + type + 's', function (data) {
                emit('data', data);
            }, {
                once: true
            });
        }

        return {
            get: function (uri) {
                sendDataRequest('get', type, { uri : uri });
            },
            getAll: function (filter) {
                sendDataRequest('getAll', type, { filter: filter });
            }
        };
    }

    return DataReceiver;
});