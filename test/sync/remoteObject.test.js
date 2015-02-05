var expect = require('unexpected/unexpected');
var MessageBusAdapter = require('../../src/sync/messageBusAdapter');
var RemoteObject = require('../../src/sync/remoteObject');

describe('RemoteObject', function() {
    var _messageBusSpy;
    before(function() {
        _messageBusSpy = {
            subscribeChanges: sinon.stub(MessageBusAdapter, 'subscribeChanges'),
            sendChanges: sinon.stub(MessageBusAdapter, 'sendChanges')
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
        it('can receive changes for removed objects', function() {
            var obj = {
                uri: '/remoteobject/1',
                array1: [{
                    uri: '/remoteobject/2',
                    property: false
                }]
            };

            var spyCall = _messageBusSpy.subscribeChanges.withArgs('/remoteobject/2');
            var remoteObject = new RemoteObject(obj);
            var receiveCallback = spyCall.args[0][1];

            obj.array1.splice(0, 1);
            receiveCallback('/remoteobject/2', [{
                type: 'set',
                property: 'property',
                object: false
            }]);
        });
        it('unsubscribes all uris when disposed', function() {
            var obj = {
                uri: '/remoteobject/1',
                array1: [{
                    uri: '/remoteobject/2'
                }]
            };
            var unsubscribeSpy = sinon.spy();
            _messageBusSpy.subscribeChanges.returns(unsubscribeSpy);
            var remoteObject = new RemoteObject(obj);
            remoteObject.dispose();
            expect(unsubscribeSpy.calledTwice, 'to be true');
        });

    });
});
