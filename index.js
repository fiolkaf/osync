var Observable = require('./src/mixin/observable');
var Disposable = require('./src/mixin/disposable');
var RemoteObject = require('./src/sync/remoteObject');
var ObservableObject = require('./src/sync/observableObject');

module.exports = {
    RemoteObject: RemoteObject,
    ObservableObject: ObservableObject,
    Mixin: {
        Observable: Observable,
        Disposable: Disposable
    }
};
