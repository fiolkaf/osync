var Changes = require('./changes');
var ChangeActions = require('./changeActions');
var MessageBusAdapter = require('./messageBusAdapter');
var RemoteObjectTraverse = require('./remoteObjectTraverse');
var ObservableObject = require('../observable/observables').ObservableObject;
var assign = Object.assign || require('object.assign');

function RemoteObject(data) {
    var self = new ObservableObject(data);

    var _receive = false;
    var changeLog = null;
    var _messagebusSubscription = null;
    var _messageBus = new MessageBusAdapter();

    self.startChanges = function() {
        changeLog = [];
    };

    self.commitChanges = function() {
        sendChanges(changeLog);
        changeLog = null;
    };

    self.supressChanges = function() {
        var result = changeLog;
        changeLog = null;
        return result;
    };

    function sendChanges(changes) {
        var result = [];
        changes.forEach(function(change) {
            Array.prototype.push.apply(result, Changes.mapObservableChange(change));
        });

        self._trigger('changed', result);
        _messageBus.sendChanges(self._uri, result);
    }

    function receiveChanges(uri, changes) {
        _receive = true;
        changes.forEach(function(change) {
            var descendentObject = RemoteObjectTraverse.getDescendentObject(self, change.property);
            change = assign({}, change, {
                property: descendentObject.property
            });
            switch (change.type) {
                case 'set':
                case 'insert':
                    if ((change.object || {})._uri) {
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
        if (_messagebusSubscription) {
            _messagebusSubscription();
        }
        _messagebusSubscription = _messageBus.subscribeChanges(uri, receiveChanges);
        self.addDisposer(_messagebusSubscription);
        return _messagebusSubscription;
    }

    var unsubscribe = self.on('change', function(change) {
        var changeInfo = RemoteObjectTraverse.getLastUriByPath(self, change.key);
        if (self !== changeInfo.object) {
            return;
        }

        if (changeInfo.path === '_uri') {
            subscribeRecordChanges(data._uri);
        }

        if (_receive) {
            return;
        }

        if (!self._uri) {
            return;
        }

        if (changeLog) {
            changeLog.push(change);
        } else {
            sendChanges([change]);
        }
    });

    self.addDisposer(unsubscribe);
    if (data && data._uri) {
        subscribeRecordChanges(data._uri);
    }

    return self;
}

module.exports = RemoteObject;
