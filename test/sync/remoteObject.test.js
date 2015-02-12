var MessageBus = require('bussi');
var expect = require('unexpected/unexpected');
var RemoteObject = require('../../src/sync/remoteObject');
var MessageBusAdapter = require('../../src/sync/messageBusAdapter');

describe('RemoteObject', function() {
    describe('constructor', function() {
        it('can create a remote object', function() {
            var obj = {
                uri: '/remoteobject/1'
            };
            var remoteObject = new RemoteObject(obj);
            remoteObject.dispose();
            expect(remoteObject, 'to be defined');
        });
        it('does not throw an error if remote object does not have uri defined', function() {
            expect(function() {
                new RemoteObject({});
            }, 'not to throw error');
        });
    });
    describe('subscription spies', function() {
        var _channel = MessageBus.channel();
        var _messageBusSpy = {
            publish: sinon.spy(_channel.publish),
            subscribe: sinon.spy(_channel.subscribe)
        };
        var _messagebusStub;

        beforeEach(function() {
            _messagebusStub = sinon.stub(MessageBus, 'channel', function() {
                return _messageBusSpy;
            });
            _messageBusSpy.publish.reset();
            _messageBusSpy.subscribe.reset();
        });
        afterEach(function() {
            _messagebusStub.restore();
        });
        it('subscribes to all uris defined in the object', function() {
            var obj = {
                uri: '/remoteobject/1',
                obj1: new RemoteObject({
                    uri: '/remoteobject/2'
                }),
                array1: [
                    new RemoteObject({
                        uri: '/remoteobject/3'
                    }), new RemoteObject({
                        uri: '/remoteobject/4'
                    })]
            };
            var remoteObject = new RemoteObject(obj);
            remoteObject.dispose();
            expect(_messageBusSpy.subscribe.calledWith('update/remoteobject/1'), 'to be true');
            expect(_messageBusSpy.subscribe.calledWith('update/remoteobject/2'), 'to be true');
            expect(_messageBusSpy.subscribe.calledWith('update/remoteobject/3'), 'to be true');
            expect(_messageBusSpy.subscribe.calledWith('update/remoteobject/4'), 'to be true');
            expect(_messageBusSpy.subscribe.callCount, 'to equal', 4);
            remoteObject.dispose();
        });
        it('subscribes to new element uris', function() {
            var obj = {
                uri: '/remoteobject/1',
                array1: []
            };
            var remoteObject = new RemoteObject(obj);
            var messageBusAdapter = new MessageBusAdapter();

            messageBusAdapter.sendChanges('/remoteobject/1', [{
                type: 'insert',
                property: 'array1',
                object: new RemoteObject({
                    uri: '/remoteobject/5'
                })
            }]);
            remoteObject.dispose();
            expect(_messageBusSpy.subscribe.calledWith('update/remoteobject/1'), 'to be true');
            expect(_messageBusSpy.subscribe.calledWith('update/remoteobject/5'), 'to be true');
        });
        it('unsubscribes all uris when disposed', function() {
            var unsubscribeSpy = sinon.spy();
            _messageBusSpy.subscribe = sinon.stub();
            _messageBusSpy.subscribe.returns(unsubscribeSpy);
            var obj = {
                uri: '/remoteobject/1',
                array1: [ new RemoteObject({
                    uri: '/remoteobject/2'
                })]
            };
            var remoteObject = new RemoteObject(obj);
            remoteObject.dispose();
            expect(unsubscribeSpy.calledTwice, 'to be true');
            _messageBusSpy.subscribe = sinon.spy(_channel.subscribe);
            remoteObject.dispose();
        });
    });
    describe('subscription to removed items', function() {
        it('can receive changes for spliced objects', function() {
            var obj = {
                uri: '/remoteobject/1',
                array1: [ new RemoteObject({
                    uri: '/remoteobject/2',
                    property: false
                })]
            };
            var remoteObject = new RemoteObject(obj);
            obj.array1.splice(0, 1);

            var messageBusAdapter = new MessageBusAdapter();
            messageBusAdapter.sendChanges('/remoteobject/2', [{
                type: 'set',
                property: 'property',
                object: false
            }]);
            remoteObject.dispose();
        });
        it('can receive changes for poped objects', function() {
            var obj = {
                uri: '/remoteobject/1',
                array1: [ new RemoteObject({
                    uri: '/remoteobject/2',
                    property: false
                })]
            };
            var remoteObject = new RemoteObject(obj);
            obj.array1.pop();

            var messageBusAdapter = new MessageBusAdapter();
            messageBusAdapter.sendChanges('/remoteobject/2', [{
                type: 'set',
                property: 'property',
                object: false
            }]);
            remoteObject.dispose();
        });
        it('can receive changes for shifted objects', function() {
            var obj = {
                uri: '/remoteobject/1',
                array1: [ new RemoteObject({
                    uri: '/remoteobject/2',
                    property: false
                })]
            };
            var remoteObject = new RemoteObject(obj);
            obj.array1.shift();

            var messageBusAdapter = new MessageBusAdapter();
            messageBusAdapter.sendChanges('/remoteobject/2', [{
                type: 'set',
                property: 'property',
                object: false
            }]);
            remoteObject.dispose();
        });
    });
});
