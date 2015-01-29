define(function(require) {
    'use strict';

    var ObservableObject = require('src/observable/observableObject').ObservableObject;
    var MessageBusAdapter = require('src/sync/messageBusAdapter');
    var RemoteObjectChanges = require('src/sync/remoteObjectChanges');
    var RemoteObjectTraverse = require('src/sync/remoteObjectTraverse');

    function RemoteObject(data) {
        if (!data.uri) {
            throw 'Remote object must have "uri" identifier';
        }
        var observableObject = new ObservableObject(data);
        var remoteObjects = RemoteObjectTraverse.getRemoteObjects(data);

        function receiveChanges(changes) {
            RemoteObjectChanges.applyChanges(data, changes);
            //TODO: trigger change event
        }

        function subscribeChanges() {
            Object.keys(remoteObjects).map(function(uri) {
                //return DataAdapter.subscribeChanges(uri, receiveChange);
            }).forEach(
                observableObject.addDisposer
            );
        }

        function sendChange(propertyPath, type, value) {
            var changeInfo = RemoteObjectTraverse.getLastUriByPath(propertyPath);
            dataAdapter.sendChange(changeInfo.uri, type, changeInfo.propertyPath, value);
        }

        var unsubscribe = observableObject.on('change', sendChange);
        observableObject.addDisposer(unsubscribe);
        subscribeChanges();

        return observableObject;
    }

    return RemoteObject;

});
