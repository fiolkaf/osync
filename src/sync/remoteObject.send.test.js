define(function(require) {

    var expect = require('unexpected');

    var MessageBusAdapter = require('src/sync/messageBusAdapter');
    var RemoteObject = require('src/sync/remoteObject');

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
        describe('send message', function() {

            /**
             * Property set
             */
            it('sends "set" when object property is modified', function() {
                var obj = {
                    uri: '/remoteobject/1',
                    property: false
                };
                var remoteObject = new RemoteObject(obj);
                remoteObject.property = true;
                expect(_messageBusSpy.sendChanges.calledWith('/remoteobject/1', [{
                    type: 'set',
                    property: 'property',
                    object: true
                }]), 'to be true');
            });
            it('sends "set" when nested property is modified', function() {
                var obj = {
                    uri: '/remoteobject/1',
                    object: {
                        property: false
                    }
                };
                var remoteObject = new RemoteObject(obj);
                remoteObject.object.property = true;
                expect(_messageBusSpy.sendChanges.calledWith('/remoteobject/1', [{
                    type: 'set',
                    property: 'object.property',
                    object: true
                }]), 'to be true');
            });
            it('sends "set" when nested identified object property is modified', function() {
                var obj = {
                    uri: '/remoteobject/1',
                    object: {
                        uri: '/remoteobject/2',
                        property: false
                    }
                };
                var remoteObject = new RemoteObject(obj);
                remoteObject.object.property = true;
                expect(_messageBusSpy.sendChanges.calledWith('/remoteobject/2', [{
                    type: 'set',
                    property: 'property',
                    object: true
                }]), 'to be true');
                expect(_messageBusSpy.sendChanges.calledWith('/remoteobject/1'), 'to be false');
            });

            /**
             * Array push
             */
            it('sends "insert" when push to an array', function() {
                var obj = {
                    uri: '/remoteobject/1',
                    array: [1, 2, 3]
                };
                var remoteObject = new RemoteObject(obj);
                remoteObject.array.push(4);
                expect(_messageBusSpy.sendChanges.calledWith('/remoteobject/1', [{
                    type: 'insert',
                    index: 3,
                    object: 4,
                    property: 'array'
                }]), 'to be true');
            });
            it('sends "insert" when push multiple items to an array', function() {
                var obj = {
                    uri: '/remoteobject/1',
                    array: [1, 2, 3]
                };
                var remoteObject = new RemoteObject(obj);
                remoteObject.array.push(4, 5);
                expect(_messageBusSpy.sendChanges.calledWith('/remoteobject/1', [{
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
            });
            it('sends "insert" when push to nested identified object array', function() {
                var obj = {
                    uri: '/remoteobject/1',
                    object: {
                        uri: '/remoteobject/2',
                        array: [1, 2, 3]
                    }
                };
                var remoteObject = new RemoteObject(obj);
                remoteObject.object.array.push(4);
                expect(_messageBusSpy.sendChanges.calledWith('/remoteobject/2', [{
                    type: 'insert',
                    index: 3,
                    object: 4,
                    property: 'array'
                }]), 'to be true');
            });
            it('sends "insert" when push to nested array', function() {
                var obj = {
                    uri: '/remoteobject/1',
                    object: {
                        array: [1, 2, 3]
                    }
                };
                var remoteObject = new RemoteObject(obj);
                remoteObject.object.array.push(4);
                expect(_messageBusSpy.sendChanges.calledWith('/remoteobject/1', [{
                    type: 'insert',
                    index: 3,
                    object: 4,
                    property: 'object.array'
                }]), 'to be true');
            });

            /**
             * Array unshift
             */
            it('sends "insert" when unshift to an array', function() {
                var obj = {
                    uri: '/remoteobject/1',
                    array: [1, 2, 3]
                };
                var remoteObject = new RemoteObject(obj);
                remoteObject.array.unshift(0);
                expect(_messageBusSpy.sendChanges.calledWith('/remoteobject/1', [{
                    type: 'insert',
                    index: 0,
                    object: 0,
                    property: 'array'
                }]), 'to be true');
            });
            it('sends "insert" when unshift multiple items to an array', function() {
                var obj = {
                    uri: '/remoteobject/1',
                    array: [1, 2, 3]
                };
                var remoteObject = new RemoteObject(obj);
                remoteObject.array.unshift(-1, 0);
                expect(_messageBusSpy.sendChanges.calledWith('/remoteobject/1', [{
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
            });
            it('sends "insert" when unshift to nested identified object array', function() {
                var obj = {
                    uri: '/remoteobject/1',
                    object: {
                        uri: '/remoteobject/2',
                        array: [1, 2, 3]
                    }
                };
                var remoteObject = new RemoteObject(obj);
                remoteObject.object.array.unshift(0);
                expect(_messageBusSpy.sendChanges.calledWith('/remoteobject/2', [{
                    type: 'insert',
                    index: 0,
                    object: 0,
                    property: 'array'
                }]), 'to be true');
            });
            it('sends "insert" when unshift to nested array', function() {
                var obj = {
                    uri: '/remoteobject/1',
                    object: {
                        array: [1, 2, 3]
                    }
                };
                var remoteObject = new RemoteObject(obj);
                remoteObject.object.array.unshift(0);
                expect(_messageBusSpy.sendChanges.calledWith('/remoteobject/1', [{
                    type: 'insert',
                    index: 0,
                    object: 0,
                    property: 'object.array'
                }]), 'to be true');
            });

            /**
             * Array pop
             */
            it('sends "remove" when pop from an array', function() {
                var obj = {
                    uri: '/remoteobject/1',
                    array: [1, 2, 3]
                };
                var remoteObject = new RemoteObject(obj);
                remoteObject.array.pop();
                expect(_messageBusSpy.sendChanges.calledWith('/remoteobject/1', [{
                    type: 'remove',
                    object: 3,
                    property: 'array'
                }]), 'to be true');
            });
            it('sends "remove" when pop from nested identified object array', function() {
                var obj = {
                    uri: '/remoteobject/1',
                    object: {
                        uri: '/remoteobject/2',
                        array: [1, 2, 3]
                    }
                };
                var remoteObject = new RemoteObject(obj);
                remoteObject.object.array.pop();
                expect(_messageBusSpy.sendChanges.calledWith('/remoteobject/2', [{
                    type: 'remove',
                    object: 3,
                    property: 'array'
                }]), 'to be true');
            });
            it('sends "remove" when pop from nested array', function() {
                var obj = {
                    uri: '/remoteobject/1',
                    object: {
                        array: [1, 2, 3]
                    }
                };
                var remoteObject = new RemoteObject(obj);
                remoteObject.object.array.pop(0);
                expect(_messageBusSpy.sendChanges.calledWith('/remoteobject/1', [{
                    type: 'remove',
                    object: 3,
                    property: 'object.array'
                }]), 'to be true');
            });

            /**
             * Array shift
             */
            it('sends "remove" when shift from an array', function() {
                var obj = {
                    uri: '/remoteobject/1',
                    array: [1, 2, 3]
                };
                var remoteObject = new RemoteObject(obj);
                remoteObject.array.shift();
                expect(_messageBusSpy.sendChanges.calledWith('/remoteobject/1', [{
                    type: 'remove',
                    object: 1,
                    property: 'array'
                }]), 'to be true');
            });
            it('sends "remove" when pop from nested identified object array', function() {
                var obj = {
                    uri: '/remoteobject/1',
                    object: {
                        uri: '/remoteobject/2',
                        array: [1, 2, 3]
                    }
                };
                var remoteObject = new RemoteObject(obj);
                remoteObject.object.array.shift();
                expect(_messageBusSpy.sendChanges.calledWith('/remoteobject/2', [{
                    type: 'remove',
                    object: 1,
                    property: 'array'
                }]), 'to be true');
            });
            it('sends "remove" when pop from nested array', function() {
                var obj = {
                    uri: '/remoteobject/1',
                    object: {
                        array: [1, 2, 3]
                    }
                };
                var remoteObject = new RemoteObject(obj);
                remoteObject.object.array.shift(0);
                expect(_messageBusSpy.sendChanges.calledWith('/remoteobject/1', [{
                    type: 'remove',
                    object: 1,
                    property: 'object.array'
                }]), 'to be true');
            });

            /**
             * Array splice
             */
            it('sends "remove" when splice/remove a single item from array', function() {
                var obj = {
                    uri: '/remoteobject/1',
                    array: [1, 2, 3]
                };
                var remoteObject = new RemoteObject(obj);
                remoteObject.array.splice(1, 1);
                expect(_messageBusSpy.sendChanges.calledWith('/remoteobject/1', [{
                    type: 'remove',
                    object: 2,
                    property: 'array'
                }]), 'to be true');
            });
            it('sends "remove" when splice/remove multiple items from array', function() {
                var obj = {
                    uri: '/remoteobject/1',
                    array: [1, 2, 3]
                };
                var remoteObject = new RemoteObject(obj);
                remoteObject.array.splice(1, 2);
                expect(_messageBusSpy.sendChanges.calledWith('/remoteobject/1', [
                    { type: 'remove', object: 2, property: 'array' },
                    { type: 'remove', object: 3, property: 'array' }
                ]), 'to be true');
            });
            it('sends "remove"/"insert" when replacing a single item in array', function() {
                var obj = {
                    uri: '/remoteobject/1',
                    array: [1, 2, 3]
                };
                var remoteObject = new RemoteObject(obj);
                remoteObject.array.splice(1, 1, 2.5);
                expect(_messageBusSpy.sendChanges.calledWith('/remoteobject/1', [
                    { type: 'remove', object: 2, property: 'array' },
                    { type: 'insert', object: 2.5, index: 1, property: 'array' }
                ]), 'to be true');
            });
            it('sends "remove"/"insert" when replacing multiple items in array', function() {
                var obj = {
                    uri: '/remoteobject/1',
                    array: [1, 2, 3, 4]
                };
                var remoteObject = new RemoteObject(obj);
                remoteObject.array.splice(1, 2, 2.5, 3.1, 3.5);
                expect(_messageBusSpy.sendChanges.calledWith('/remoteobject/1', [
                    { type: 'remove', object: 2, property: 'array' },
                    { type: 'remove', object: 3, property: 'array' },
                    { type: 'insert', object: 2.5, index: 1, property: 'array' },
                    { type: 'insert', object: 3.1, index: 2, property: 'array' },
                    { type: 'insert', object: 3.5, index: 3, property: 'array' }
                ]), 'to be true');
            });
        });
    });
});
