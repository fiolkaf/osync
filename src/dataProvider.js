define(['bussi'], function (MessageBus) {

    function DataProvider(types, dataAdapter) {
        this._dataAdapter = dataAdapter;

        types = !Array.isArray(types) ? [types] : types;
        types.forEach(this._subscribeTypeRequest);

        return this;
    }

    DataProvider.prototype.subscribeTypeRequest = function(parameters) {
        var type = parameters.type;
        var channel = MessageBus.channel('actions');

        channel.subscribe('get/' + type + 's/*', function(id) {
            var result = this._dataAdapter.get(type, id);
            channel.publish('receive/' + type + 's/' + id, result);
        });

        channel.subscribe('get/' + type + 's', function(filter) {
            var result = this._dataAdapter.getAll(type, filter);
            channel.publish('receive/' + type + 's', result);
        });
    };

    return DataProvider;
});