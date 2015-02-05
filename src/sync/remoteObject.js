var Changes = require('./changes');
var ChangeActions = require('./changeActions');
var ObservableObject = require('../observable/observables').ObservableObject;
var MessageBusAdapter = require('./messageBusAdapter');
var RemoteObjectTraverse = require('./remoteObjectTraverse');

function RemoteObject(data) {
    if (!data.uri) {
        throw 'Remote object must have "uri" identifier';
    }
    var observableObject = new ObservableObject(data);
    var _receive = false;
    var _subscriptions = {};
    var remoteObjects = RemoteObjectTraverse.getRemoteObjects(data);

    function sendChange(evt) {
        var changeInfo = RemoteObjectTraverse.getLastUriByPath(data, evt.key);
        var ev = Object.assign({}, evt);
        ev.key = changeInfo.path;

        var changes = Changes.mapObservableChange(ev);
        changes.forEach(function(change) {
            switch(change.type) {
                case 'insert':
                    subscribeRecordChanges(change.object.uri);
                    remoteObjects[change.object.uri] = change.object;
                    break;
                case 'remove':
                    remoteObjects[change.object.uri] = null;
                    break;
            }
        });
        if (!_receive) {
            MessageBusAdapter.sendChanges(changeInfo.object.uri, changes);
        }
    }

    function receiveChanges(uri, changes) {
        if (!remoteObjects[uri]) { //Ignore - object was removed
            return;
        }
        _receive = true;
        var obj = remoteObjects[uri];
        changes.forEach(function(change) {
            var descendentObject = RemoteObjectTraverse.getDescendentObject(obj, change.property);
            change = Object.assign({}, change, {
                property: descendentObject.property
            });
            ChangeActions[change.type].execute(descendentObject.object, change);
        });
        _receive = false;
    }

    function subscribeRecordChanges(uri) {
        var unsubscribe = MessageBusAdapter.subscribeChanges(uri, receiveChanges);
        observableObject.addDisposer(unsubscribe);
        _subscriptions[uri] = unsubscribe;
    }

    var unsubscribe = observableObject.on('change', sendChange);
    observableObject.addDisposer(unsubscribe);


    Object.keys(remoteObjects).forEach(subscribeRecordChanges);
    return observableObject;
}

module.exports = RemoteObject;
