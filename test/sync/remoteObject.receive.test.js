var expect = require('unexpected/unexpected');
var MessageBusAdapter = require('../../src/sync/messageBusAdapter');
var RemoteObject = require('../../src/sync/remoteObject');

describe('RemoteObject', function() {
    var _messageBusAdapter = new MessageBusAdapter();
    describe('receive message', function() {
        it('can modify object property', function() {
            var obj = {
                _uri: '/remoteobject/1',
                property: false
            };
            var remoteObject = new RemoteObject(obj);
            _messageBusAdapter.sendChanges('/remoteobject/1', [{
                type: 'set',
                property: 'property',
                object: true
            }]);
            remoteObject.dispose();
            expect(remoteObject.property, 'to equal', true);
        });
        it('can modify nested object property', function() {
            var obj = {
                _uri: '/remoteobject/1',
                object: {
                    property: false
                }
            };
            var remoteObject = new RemoteObject(obj);
            _messageBusAdapter.sendChanges('/remoteobject/1', [{
                type: 'set',
                property: 'object.property',
                object: true
            }]);
            remoteObject.dispose();
            expect(remoteObject.object.property, 'to equal', true);
        });
        it('can insert into array', function() {
            var obj = {
                _uri: '/remoteobject/1',
                array: []
            };
            var remoteObject = new RemoteObject(obj);
            _messageBusAdapter.sendChanges('/remoteobject/1', [{
                type: 'insert',
                property: 'array',
                object: 1
            }]);
            remoteObject.dispose();
            expect(obj.array, 'to equal', [1]);
        });
        it('can insert into nested array', function() {
            var obj = {
                _uri: '/remoteobject/1',
                object: {
                    array: []
                }
            };
            var remoteObject = new RemoteObject(obj);
            _messageBusAdapter.sendChanges('/remoteobject/1', [{
                type: 'insert',
                property: 'object.array',
                object: 1
            }]);
            remoteObject.dispose();
            expect(obj.object.array, 'to equal', [1]);
        });
        it('can remove from array', function() {
            var obj = {
                _uri: '/remoteobject/1',
                array: [1]
            };
            var remoteObject = new RemoteObject(obj);
            _messageBusAdapter.sendChanges('/remoteobject/1', [{
                type: 'remove',
                property: 'array',
                object: 1
            }]);
            remoteObject.dispose();
            expect(obj.array, 'to equal', []);
        });
    });
});
