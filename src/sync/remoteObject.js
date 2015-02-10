var Changes = require('./changes');
var ChangeActions = require('./changeActions');
var MessageBusAdapter = require('./messageBusAdapter');
var RemoteObjectTraverse = require('./remoteObjectTraverse');
var ObservableObject = require('../observable/observables').ObservableObject;

function RemoteObject(data) {
    if (!data.uri) {
        throw 'Remote object must have "uri" identifier';
    }
    var _receive = false;
    var _messageBus = new MessageBusAdapter();
    var observableObject = new ObservableObject(data);

    observableObject.getDescendentObject = function(property) {
        return RemoteObjectTraverse.getDescendentObject(observableObject, property);
    };

    function sendChange(change) {
        var changes = Changes.mapObservableChange(change);
        _messageBus.sendChanges(observableObject.uri, changes);
    }

    function receiveChanges(uri, changes) {
        _receive = true;
        changes.forEach(function(change) {
            var descendentObject = observableObject.getDescendentObject(change.property);
            change = Object.assign({}, change, {
                property: descendentObject.property
            });
            switch (change.type) {
                case 'set':
                case 'insert':
                    if (change.object.uri) {
                        var remoteObject = new RemoteObject(change.object);
                        observableObject.addDisposer(remoteObject.dispose);
                        change.object = remoteObject;
                    }
                break;
            }

            ChangeActions[change.type].execute(descendentObject.object, change);
        });
        _receive = false;
    }

    function subscribeRecordChanges(uri) {
        var unsubscribe = _messageBus.subscribeChanges(uri, receiveChanges);
        observableObject.addDisposer(unsubscribe);
    }

    var unsubscribe = observableObject.on('change', function(evt) {
        var changeInfo = RemoteObjectTraverse.getLastUriByPath(observableObject, evt.key);
        if (observableObject !== changeInfo.object) {
            return;
        }

        if (_receive) {
            return;
        }

        sendChange(evt);
    });
    observableObject.addDisposer(unsubscribe);
    subscribeRecordChanges(data.uri);

    return observableObject;
}

module.exports = RemoteObject;
