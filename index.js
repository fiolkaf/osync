var Observable = require('./src/mixin/observable');
var Disposable = require('./src/mixin/disposable');
var RemoteObject = require('./src/sync/remoteObject');
var Observables = require('./src/observable/observables');

module.exports = {
    RemoteObject: RemoteObject,
    ObservableObject: Observables.ObservableObject,
    Mixin: {
        Observable: Observable,
        Disposable: Disposable
    }
};
