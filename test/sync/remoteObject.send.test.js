var expect = require('unexpected/unexpected');
var MessageBusAdapter = require('../../src/sync/messageBusAdapter');
var RemoteObject = require('../../src/sync/remoteObject');

describe('RemoteObject', function() {

    describe('send message', function() {
        /**
         * Property set
         */
        it('sends "set" when object property is modified', function() {
            var spy = sinon.spy();
            var messageBusAdapter = new MessageBusAdapter();
            var unsubscribe = messageBusAdapter.subscribeChanges('/remoteobject/1', spy);

            var remoteObject = new RemoteObject({
                uri: '/remoteobject/1',
                property: false
            });
            remoteObject.property = true;

            expect(spy.calledWith('/remoteobject/1', [{
                type: 'set',
                property: 'property',
                object: true
            }]), 'to be true');
            remoteObject.dispose();
            unsubscribe();
        });
        it('sends "set" when nested property is modified', function() {
            var spy = sinon.spy();
            var messageBusAdapter = new MessageBusAdapter();
            var unsubscribe = messageBusAdapter.subscribeChanges('/remoteobject/1', spy);

            var obj = {
                uri: '/remoteobject/1',
                object: {
                    property: false
                }
            };
            var remoteObject = new RemoteObject(obj);

            remoteObject.object.property = true;
            expect(spy.calledWith('/remoteobject/1', [{
                type: 'set',
                property: 'object.property',
                object: true
            }]), 'to be true');
            remoteObject.dispose();
            unsubscribe();
        });
        it('sends "set" when nested identified object property is modified', function() {
            var spy = sinon.spy();
            var messageBusAdapter = new MessageBusAdapter();
            var unsubscribe = messageBusAdapter.subscribeChanges('/remoteobject/*', spy);

            var obj = {
                uri: '/remoteobject/1',
                object: new RemoteObject({
                    uri: '/remoteobject/2',
                    property: false
                })
            };
            var remoteObject = new RemoteObject(obj);
            remoteObject.object.property = true;
            expect(spy.calledWith('/remoteobject/*', [{
                type: 'set',
                property: 'property',
                object: true
            }]), 'to be true');
            remoteObject.dispose();
            expect(spy.calledOnce, 'to be true');
            unsubscribe();
        });
        /**
         * Array push
         */
        it('sends "insert" when push to an array', function() {
            var spy = sinon.spy();
            var messageBusAdapter = new MessageBusAdapter();
            var unsubscribe = messageBusAdapter.subscribeChanges('/remoteobject/1', spy);

            var obj = {
                uri: '/remoteobject/1',
                array: [1, 2, 3]
            };
            var remoteObject = new RemoteObject(obj);
            remoteObject.array.push(4);
            expect(spy.calledWith('/remoteobject/1', [{
                type: 'insert',
                index: 3,
                object: 4,
                property: 'array'
            }]), 'to be true');
            remoteObject.dispose();
            unsubscribe();
        });
        it('sends "insert" when push multiple items to an array', function() {
            var spy = sinon.spy();
            var messageBusAdapter = new MessageBusAdapter();
            var unsubscribe = messageBusAdapter.subscribeChanges('/remoteobject/1', spy);

            var obj = {
                uri: '/remoteobject/1',
                array: [1, 2, 3]
            };
            var remoteObject = new RemoteObject(obj);
            remoteObject.array.push(4, 5);
            expect(spy.calledWith('/remoteobject/1', [{
                type: 'insert',
                index: 3,
                object: 4,
                property: 'array'
            }, {
                type: 'insert',
                index: 4,
                object: 5,
                property: 'array'
            }]), 'to be true');
            remoteObject.dispose();
            unsubscribe();
        });
        it('sends "insert" when push to nested identified object array', function() {
            var spy = sinon.spy();
            var messageBusAdapter = new MessageBusAdapter();
            var unsubscribe = messageBusAdapter.subscribeChanges('/remoteobject/*', spy);

            var obj = {
                uri: '/remoteobject/1',
                object: new RemoteObject({
                    uri: '/remoteobject/2',
                    array: [1, 2, 3]
                })
            };
            var remoteObject = new RemoteObject(obj);
            remoteObject.object.array.push(4);
            expect(spy.calledWith('/remoteobject/*', [{
                type: 'insert',
                index: 3,
                object: 4,
                property: 'array'
            }]), 'to be true');
            expect(spy.calledOnce, 'to be true');
            remoteObject.dispose();
            unsubscribe();
        });
        it('sends "insert" when push to nested array', function() {
            var spy = sinon.spy();
            var messageBusAdapter = new MessageBusAdapter();
            var unsubscribe = messageBusAdapter.subscribeChanges('/remoteobject/1', spy);

            var obj = {
                uri: '/remoteobject/1',
                object: {
                    array: [1, 2, 3]
                }
            };
            var remoteObject = new RemoteObject(obj);
            remoteObject.object.array.push(4);
            expect(spy.calledWith('/remoteobject/1', [{
                type: 'insert',
                index: 3,
                object: 4,
                property: 'object.array'
            }]), 'to be true');

            unsubscribe();
            remoteObject.dispose();
        });
        /**
         * Array unshift
         */
        it('sends "insert" when unshift to an array', function() {
            var spy = sinon.spy();
            var messageBusAdapter = new MessageBusAdapter();
            var unsubscribe = messageBusAdapter.subscribeChanges('/remoteobject/1', spy);

            var obj = {
                uri: '/remoteobject/1',
                array: [1, 2, 3]
            };
            var remoteObject = new RemoteObject(obj);
            remoteObject.array.unshift(0);
            expect(spy.calledWith('/remoteobject/1', [{
                type: 'insert',
                index: 0,
                object: 0,
                property: 'array'
            }]), 'to be true');

            unsubscribe();
            remoteObject.dispose();
        });
        it('sends "insert" when unshift multiple items to an array', function() {
            var spy = sinon.spy();
            var messageBusAdapter = new MessageBusAdapter();
            var unsubscribe = messageBusAdapter.subscribeChanges('/remoteobject/1', spy);

            var obj = {
                uri: '/remoteobject/1',
                array: [1, 2, 3]
            };
            var remoteObject = new RemoteObject(obj);
            remoteObject.array.unshift(-1, 0);
            expect(spy.calledWith('/remoteobject/1', [{
                type: 'insert',
                index: 0,
                object: -1,
                property: 'array'
            }, {
                type: 'insert',
                index: 1,
                object: 0,
                property: 'array'
            }]), 'to be true');
            unsubscribe();
            remoteObject.dispose();
        });
        it('sends "insert" when unshift to nested identified object array', function() {
            var spy = sinon.spy();
            var messageBusAdapter = new MessageBusAdapter();
            var unsubscribe = messageBusAdapter.subscribeChanges('/remoteobject/2', spy);

            var obj = {
                uri: '/remoteobject/1',
                object: new RemoteObject({
                    uri: '/remoteobject/2',
                    array: [1, 2, 3]
                })
            };
            var remoteObject = new RemoteObject(obj);
            remoteObject.object.array.unshift(0);
            expect(spy.calledWith('/remoteobject/2', [{
                type: 'insert',
                index: 0,
                object: 0,
                property: 'array'
            }]), 'to be true');

            unsubscribe();
            remoteObject.dispose();
        });
        it('sends "insert" when unshift to nested array', function() {
            var spy = sinon.spy();
            var messageBusAdapter = new MessageBusAdapter();
            var unsubscribe = messageBusAdapter.subscribeChanges('/remoteobject/1', spy);

            var obj = {
                uri: '/remoteobject/1',
                object: {
                    array: [1, 2, 3]
                }
            };
            var remoteObject = new RemoteObject(obj);
            remoteObject.object.array.unshift(0);
            expect(spy.calledWith('/remoteobject/1', [{
                type: 'insert',
                index: 0,
                object: 0,
                property: 'object.array'
            }]), 'to be true');

            unsubscribe();
            remoteObject.dispose();
        });
        /**
         * Array pop
         */
        it('sends "remove" when pop from an array', function() {
            var spy = sinon.spy();
            var messageBusAdapter = new MessageBusAdapter();
            var unsubscribe = messageBusAdapter.subscribeChanges('/remoteobject/1', spy);

            var obj = {
                uri: '/remoteobject/1',
                array: [1, 2, 3]
            };
            var remoteObject = new RemoteObject(obj);
            remoteObject.array.pop();
            expect(spy.calledWith('/remoteobject/1', [{
                type: 'remove',
                object: 3,
                property: 'array'
            }]), 'to be true');

            unsubscribe();
            remoteObject.dispose();
        });
        it('sends "remove" when pop from nested identified object array', function() {
            var spy = sinon.spy();
            var messageBusAdapter = new MessageBusAdapter();
            var unsubscribe = messageBusAdapter.subscribeChanges('/remoteobject/*', spy);

            var obj = {
                uri: '/remoteobject/1',
                object: new RemoteObject({
                    uri: '/remoteobject/2',
                    array: [1, 2, 3]
                })
            };
            var remoteObject = new RemoteObject(obj);
            remoteObject.object.array.pop();
            expect(spy.calledWith('/remoteobject/*', [{
                type: 'remove',
                object: 3,
                property: 'array'
            }]), 'to be true');
            expect(spy.calledOnce, 'to be true');

            unsubscribe();
            remoteObject.dispose();
        });
        it('sends "remove" when pop from nested array', function() {
            var spy = sinon.spy();
            var messageBusAdapter = new MessageBusAdapter();
            var unsubscribe = messageBusAdapter.subscribeChanges('/remoteobject/1', spy);

            var obj = {
                uri: '/remoteobject/1',
                object: {
                    array: [1, 2, 3]
                }
            };
            var remoteObject = new RemoteObject(obj);
            remoteObject.object.array.pop(0);
            expect(spy.calledWith('/remoteobject/1', [{
                type: 'remove',
                object: 3,
                property: 'object.array'
            }]), 'to be true');

            unsubscribe();
            remoteObject.dispose();
        });
        /**
         * Array shift
         */
        it('sends "remove" when shift from an array', function() {
            var spy = sinon.spy();
            var messageBusAdapter = new MessageBusAdapter();
            var unsubscribe = messageBusAdapter.subscribeChanges('/remoteobject/1', spy);

            var obj = {
                uri: '/remoteobject/1',
                array: [1, 2, 3]
            };
            var remoteObject = new RemoteObject(obj);
            remoteObject.array.shift();
            expect(spy.calledWith('/remoteobject/1', [{
                type: 'remove',
                object: 1,
                property: 'array'
            }]), 'to be true');

            unsubscribe();
            remoteObject.dispose();
        });
        it('sends "remove" when pop from nested identified object array', function() {
            var spy = sinon.spy();
            var messageBusAdapter = new MessageBusAdapter();
            var unsubscribe = messageBusAdapter.subscribeChanges('/remoteobject/*', spy);

            var obj = {
                uri: '/remoteobject/1',
                object: new RemoteObject({
                    uri: '/remoteobject/2',
                    array: [1, 2, 3]
                })
            };
            var remoteObject = new RemoteObject(obj);
            remoteObject.object.array.shift();
            expect(spy.calledWith('/remoteobject/*', [{
                type: 'remove',
                object: 1,
                property: 'array'
            }]), 'to be true');
            expect(spy.calledOnce, 'to be true');

            unsubscribe();
            remoteObject.dispose();
        });
        it('sends "remove" when pop from nested array', function() {
            var spy = sinon.spy();
            var messageBusAdapter = new MessageBusAdapter();
            var unsubscribe = messageBusAdapter.subscribeChanges('/remoteobject/1', spy);

            var obj = {
                uri: '/remoteobject/1',
                object: {
                    array: [1, 2, 3]
                }
            };
            var remoteObject = new RemoteObject(obj);
            remoteObject.object.array.shift(0);
            expect(spy.calledWith('/remoteobject/1', [{
                type: 'remove',
                object: 1,
                property: 'object.array'
            }]), 'to be true');

            unsubscribe();
            remoteObject.dispose();
        });
        /**
         * Array splice
         */
        it('sends "remove" when splice/remove a single item from array', function() {
            var spy = sinon.spy();
            var messageBusAdapter = new MessageBusAdapter();
            var unsubscribe = messageBusAdapter.subscribeChanges('/remoteobject/1', spy);

            var obj = {
                uri: '/remoteobject/1',
                array: [1, 2, 3]
            };
            var remoteObject = new RemoteObject(obj);
            remoteObject.array.splice(1, 1);
            expect(spy.calledWith('/remoteobject/1', [{
                type: 'remove',
                object: 2,
                property: 'array'
            }]), 'to be true');

            unsubscribe();
            remoteObject.dispose();
        });
        it('sends "remove" when splice/remove multiple items from array', function() {
            var spy = sinon.spy();
            var messageBusAdapter = new MessageBusAdapter();
            var unsubscribe = messageBusAdapter.subscribeChanges('/remoteobject/1', spy);

            var obj = {
                uri: '/remoteobject/1',
                array: [1, 2, 3]
            };
            var remoteObject = new RemoteObject(obj);
            remoteObject.array.splice(1, 2);
            expect(spy.calledWith('/remoteobject/1', [
                { type: 'remove', object: 2, property: 'array' },
                { type: 'remove', object: 3, property: 'array' }
            ]), 'to be true');

            unsubscribe();
            remoteObject.dispose();
        });
        it('sends "remove"/"insert" when replacing a single item in array', function() {
            var spy = sinon.spy();
            var messageBusAdapter = new MessageBusAdapter();
            var unsubscribe = messageBusAdapter.subscribeChanges('/remoteobject/1', spy);

            var obj = {
                uri: '/remoteobject/1',
                array: [1, 2, 3]
            };
            var remoteObject = new RemoteObject(obj);
            remoteObject.array.splice(1, 1, 2.5);
            expect(spy.calledWith('/remoteobject/1', [
                { type: 'remove', object: 2, property: 'array' },
                { type: 'insert', object: 2.5, index: 1, property: 'array' }
            ]), 'to be true');

            unsubscribe();
            remoteObject.dispose();
        });
        it('sends "remove"/"insert" when replacing multiple items in array', function() {
            var spy = sinon.spy();
            var messageBusAdapter = new MessageBusAdapter();
            var unsubscribe = messageBusAdapter.subscribeChanges('/remoteobject/1', spy);

            var obj = {
                uri: '/remoteobject/1',
                array: [1, 2, 3, 4]
            };
            var remoteObject = new RemoteObject(obj);
            remoteObject.array.splice(1, 2, 2.5, 3.1, 3.5);
            expect(spy.calledWith('/remoteobject/1', [
                { type: 'remove', object: 2, property: 'array' },
                { type: 'remove', object: 3, property: 'array' },
                { type: 'insert', object: 2.5, index: 1, property: 'array' },
                { type: 'insert', object: 3.1, index: 2, property: 'array' },
                { type: 'insert', object: 3.5, index: 3, property: 'array' }
            ]), 'to be true');

            unsubscribe();
            remoteObject.dispose();
        });
    });
});
