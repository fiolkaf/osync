var expect = require('unexpected/unexpected');
var MessageBusAdapter = require('./messageBusAdapter');
var RemoteObject = require('./remoteObject');

describe('RemoteObject', function() {
    var _messageBusSpy;
    before(function() {
        _messageBusSpy = {
            subscribeChanges: sinon.stub(MessageBusAdapter, 'subscribeChanges', sinon.spy()),
            sendChanges: sinon.stub(MessageBusAdapter, 'sendChanges', sinon.spy())
        };
    });
    after(function() {
        MessageBusAdapter.sendChanges.restore();
        MessageBusAdapter.subscribeChanges.restore();
    });
    beforeEach(function() {
        _messageBusSpy.subscribeChanges.reset();
        _messageBusSpy.sendChanges.reset();
    });
    describe('constructor', function() {
        it('can create a remote object', function() {
            var obj = {
                uri: '/remoteobject/1'
            };
            var remoteObject = new RemoteObject(obj);
            expect(remoteObject, 'to be defined');
        });
        it('throws an error if remote object does not have uri defined', function() {
            expect(function() {
                new RemoteObject({});
            }, 'to throw error');
        });
    });
    describe('subscription', function() {
        it('subscribes to all uris defined in the object', function() {
            var obj = {
                uri: '/remoteobject/1',
                obj1: {
                    uri: '/remoteobject/2'
                },
                array1: [{
                    uri: '/remoteobject/3'
                }, {
                    uri: '/remoteobject/4'
                }]
            };
            var remoteObject = new RemoteObject(obj);
            expect(_messageBusSpy.subscribeChanges.calledWith('/remoteobject/1'), 'to be true');
            expect(_messageBusSpy.subscribeChanges.calledWith('/remoteobject/2'), 'to be true');
            expect(_messageBusSpy.subscribeChanges.calledWith('/remoteobject/3'), 'to be true');
            expect(_messageBusSpy.subscribeChanges.calledWith('/remoteobject/4'), 'to be true');
        });
        it('subscribes to new element uris', function() {
            var obj = {
                uri: '/remoteobject/1',
                array1: []
            };
            var remoteObject = new RemoteObject(obj);
            var spyCall = _messageBusSpy.subscribeChanges.getCall(0);
            var receiveCallback = spyCall.args[1];
            receiveCallback('/remoteobject/1', [{
                type: 'insert',
                property: 'array1',
                object: {
                    uri: '/remoteobject/5'
                }
            }]);
            expect(_messageBusSpy.subscribeChanges.calledWith('/remoteobject/5'), 'to be true');
        });
    });
    //TODO: continue
});
