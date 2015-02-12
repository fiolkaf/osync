var Changes = require('./changes');
var ChangeActions = require('./changeActions');
var MessageBusAdapter = require('./messageBusAdapter');
var RemoteObjectTraverse = require('./remoteObjectTraverse');
var ObservableObject = require('../observable/observables').ObservableObject;

function RemoteObject(data) {
    var self = new ObservableObject(data);

    var _receive = false;
    var changeLog = null;
    var _messageBus = new MessageBusAdapter();

    self.startChanges = function() {
        changeLog = [];
    };

    self.commitChanges = function() {
        sendChanges(changeLog);
        changeLog = null;
    };

    self.supressChanges = function() {
        changeLog = null;
    };

    function sendChanges(changes) {
        var result = [];
        changes.forEach(function(change) {
            Array.prototype.push.apply(result, Changes.mapObservableChange(change));
        });

        self._trigger('changed', result);
        _messageBus.sendChanges(self.uri, result);
    }

    function receiveChanges(uri, changes) {
        _receive = true;
        changes.forEach(function(change) {
            var descendentObject = RemoteObjectTraverse.getDescendentObject(self, change.property);
            change = Object.assign({}, change, {
                property: descendentObject.property
            });
            switch (change.type) {
                case 'set':
                case 'insert':
                    if (change.object.uri) {
                        var remoteObject = new RemoteObject(change.object);
                        self.addDisposer(remoteObject.dispose);
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
        self.addDisposer(unsubscribe);
    }

    var unsubscribe = self.on('change', function(change) {
        var changeInfo = RemoteObjectTraverse.getLastUriByPath(self, change.key);
        if (self !== changeInfo.object) {
            return;
        }

        if (changeInfo.path === 'uri') {
            subscribeRecordChanges(data.uri);
        }

        if (_receive) {
            return;
        }

        if (!self.uri) {
            return;
        }

        if (changeLog) {
            changeLog.push(change);
        } else {
            sendChanges([change]);
        }

    });

    self.addDisposer(unsubscribe);
    if (data && data.uri) {
        subscribeRecordChanges(data.uri);
    }

    return self;
}

module.exports = RemoteObject;
