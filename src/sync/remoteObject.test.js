define(function(require) {
    var expect = require('unexpected');
    var RemoteObject = require('src/sync/remoteObject');

    describe('RemoteObject', function() {
        describe('constructor', function() {
            it('can create a remote object', function() {
                var obj = { uri: '/remoteobject/1' };
                var remoteObject = new RemoteObject(obj);
                expect(remoteObject, 'to be defined');
            });
            it('throws an error if remote object does not have uri defined', function() {
                expect(function() { new RemoteObject({}); }, 'to throw error');
            });
        });
        //TODO: continue
    });
});
