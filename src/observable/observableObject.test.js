var expect = require('unexpected/unexpected');
var ObservableObject = require('./observableObject').ObservableObject;

describe('ObservableObject', function() {
    describe('create', function() {
        it('can create observable object on data', function() {
            var obj = {
                property1: 0
            };
            var observable = new ObservableObject(obj);
            expect(observable, 'to be defined');
        });
        it('contains all properties of a source object', function() {
            var obj = {
                property1: 0,
                property2: 1,
                array1: [1, 2, 3, 4],
                object1: {
                    id: 1
                }
            };
            var observable = new ObservableObject(obj);
            expect(observable.property1, 'to be defined');
            expect(observable.property2, 'to be defined');
            expect(observable.array1, 'to equal', [1, 2, 3, 4]);
            expect(observable.object1.id, 'to equal', 1);
        });
    });
    describe('subscribe', function() {
        it('can subscribe to its own plain property changes', function() {
            var obj = {
                property1: 0
            };
            var observable = new ObservableObject(obj);
            var result = {};
            observable.on('change', function(evt) {
                result[evt.key] = evt.value;
            });
            observable.property1 = 2;
            expect(result.property1, 'to equal', 2);
        });
        it('can subscribe to its own array property changes', function() {
            var obj = {
                array1: [1, 2, 3, 4]
            };
            var observable = new ObservableObject(obj);
            var result = {};
            observable.on('change', function(evt) {
                result[evt.key] = evt.value;
            });
            observable.array1 = [1];
            expect(result.array1, 'to equal', [1]);
        });
        it('can subscribe to its own object property changes', function() {
            var obj = {
                id: 1
            };
            var observable = new ObservableObject(obj);
            var result = {};
            observable.on('change', function(evt) {
                result[evt.key] = evt.value;
            });
            observable.id = 2;
            expect(result.id, 'to equal', 2);
        });
    });
    describe('hierarchical simple object subscription', function() {
        it('receives events about nested property changes - 2 levels', function() {
            var obj = {
                property1: {
                    property2: 0
                }
            };
            var observable = new ObservableObject(obj);
            var result = {};
            observable.on('change', function(evt) {
                result[evt.key] = evt.value;
            });
            observable.property1.property2 = 2;
            expect(result['property1.property2'], 'to equal', 2);
        });
        it('receives events about nested property changes - 3 levels', function() {
            var obj = {
                property1: {
                    property2: {
                        property3: 0
                    }
                }
            };
            var observable = new ObservableObject(obj);
            var result = {};
            observable.on('change', function(evt) {
                result[evt.key] = evt.value;
            });
            observable.property1.property2.property3 = 2;
            expect(result['property1.property2.property3'], 'to equal', 2);
        });
    });
    describe('hierarchical complex object subscription', function() {
        it('receives events about nested object changes - 2 levels', function() {
            var obj = {
                property1: {
                    property2: 0
                }
            };
            var observable = new ObservableObject(obj);
            var result = {};
            observable.on('change', function(evt) {
                result[evt.key] = evt.value;
            });
            observable.property1 = {
                property3: 2
            };
            expect(result.property1, 'to equal', {
                property3: 2
            });
        });
        it('receives events about nested object changes - 3 levels', function() {
            var obj = {
                property1: {
                    property2: {
                        id: 1
                    }
                }
            };
            var observable = new ObservableObject(obj);
            var result = {};
            observable.on('change', function(evt) {
                result[evt.key] = evt.value;
            });
            observable.property1.property2 = {
                id: 2
            };
            expect(result['property1.property2'], 'to equal', {
                id: 2
            });
        });
        it('receives events about nested object changes - 4 levels', function() {
            var obj = {
                property1: {
                    property2: {
                        property3: {
                            id: 1
                        }
                    }
                }
            };
            var observable = new ObservableObject(obj);
            var result = {};
            observable.on('change', function(evt) {
                result[evt.key] = evt.value;
            });
            observable.property1.property2.property3 = {
                id: 2
            };
            expect(result['property1.property2.property3'], 'to equal', {
                id: 2
            });
        });
    });
    describe('array subscription', function() {
        it('receives events about single array push changes', function() {
            var obj = {
                array: []
            };
            var observable = new ObservableObject(obj);
            observable.on('change', function(evt) {
                expect(evt, 'to equal', {
                    key: 'array',
                    type: 'push',
                    args: [1],
                    result: 1
                });
            });
            observable.array.push(1);
        });
        it('receives events about multiple array push changes', function() {
            var obj = {
                array: []
            };
            var observable = new ObservableObject(obj);
            observable.on('change', function(evt) {
                expect(evt, 'to equal', {
                    key: 'array',
                    type: 'push',
                    args: [1, 2],
                    result: 2
                });
            });
            observable.array.push(1, 2);
        });
        it('receives events about nested array property changes', function() {
            var obj = {
                property1: {
                    array: []
                }
            };
            var observable = new ObservableObject(obj);
            observable.on('change', function(evt) {
                expect(evt, 'to equal', {
                    key: 'property1.array',
                    type: 'push',
                    args: [1],
                    result: 1
                });
            });
            observable.property1.array.push(1);
        });
        it('receives events about array objects changes', function() {
            var obj = {
                array: [{
                    id: 1
                }, {
                    id: 2
                }]
            };
            var observable = new ObservableObject(obj);
            observable.on('change', function(evt) {
                expect(evt, 'to equal', {
                    key: 'array[0].id',
                    type: 'set',
                    value: 1
                });
            });
            observable.array[0].id = 1;
        });
        it('receives events about nested array objects changes', function() {
            var obj = {
                array: [{
                    array: [{
                        id: 2
                    }]
                }]
            };
            var observable = new ObservableObject(obj);
            observable.on('change', function(evt) {
                expect(evt, 'to equal', {
                    key: 'array[0].array[0].id',
                    type: 'set',
                    value: 1
                });
            });
            observable.array[0].array[0].id = 1;
        });
        /*
                    it('receives events about new object assignment', function() {
                        var obj = {
                            array: [ {id: 2}]
                        };
                        var observable = new ObservableObject(obj);
                        var result = {};
                        observable.on('change', function(key, value) {
                            result[key] = value;
                        });
                        obj.array[0] = {id: 3};
                        expect(result['array[0]'], 'to equal', {id: 3});
                    });
                    it('receives events about nested object assignment', function() {
                        var obj = {
                            array: [
                                { array: [{id: 2}] }
                            ]
                        };
                        var observable = new ObservableObject(obj);
                        var result = {};
                        observable.on('change', function(key, value) {
                            result[key] = value;
                        });
                        obj.array[0].array[0] = {id: 3};
                        expect(result['array[0].array[0]'], 'to equal', {id: 3});
                    });*/
    });
    describe('new item subscriptions', function() {
        it('fire "change" event on pushed single array items', function() {
            var observable = new ObservableObject({
                uri: 'object/1',
                object: {
                    array: []
                }
            });

            observable.object.array.push({
                uri: 'object/2',
                property: false
            });
            var callback = sinon.spy();
            observable.on('change', callback);
            observable.object.array[0].property = true;
            expect(callback.called, 'to be true');
        });
        it('fire "change" event on pushed multiple array items', function() {
            var observable = new ObservableObject({
                uri: 'object/1',
                object: {
                    array: []
                }
            });

            observable.object.array.push({
                uri: 'object/2',
                property: false
            }, {
                uri: 'object/3',
                property: false
            });
            var callback = sinon.spy();
            observable.on('change', callback);
            observable.object.array[0].property = true;
            observable.object.array[1].property = true;
            expect(callback.calledTwice, 'to be true');
        });
        it('fire "change" event on unshifted single array items', function() {
            var observable = new ObservableObject({
                uri: 'object/1',
                object: {
                    array: []
                }
            });

            observable.object.array.unshift({
                uri: 'object/2',
                property: false
            });
            var callback = sinon.spy();
            observable.on('change', callback);
            observable.object.array[0].property = true;
            expect(callback.called, 'to be true');
        });
        it('fire "change" event on unshifted multiple array items', function() {
            var observable = new ObservableObject({
                uri: 'object/1',
                object: {
                    array: []
                }
            });

            observable.object.array.unshift({
                uri: 'object/2',
                property: false
            });
            var callback = sinon.spy();
            observable.on('change', callback);
            observable.object.array[0].property = true;
            expect(callback.called, 'to be true');
        });
        it('fire "change" event on unshifted multiple array items', function() {
            var observable = new ObservableObject({
                uri: 'object/1',
                object: {
                    array: []
                }
            });

            observable.object.array.unshift({
                uri: 'object/2',
                property: false
            });
            var callback = sinon.spy();
            observable.on('change', callback);
            observable.object.array[0].property = true;
            expect(callback.called, 'to be true');
        });
        it('fire "change" event on spliced single array item', function() {
            var observable = new ObservableObject({
                uri: 'object/1',
                object: {
                    array: []
                }
            });

            observable.object.array.splice(0, 0, {
                uri: 'object/2',
                property: false
            });
            var callback = sinon.spy();
            observable.on('change', callback);
            observable.object.array[0].property = true;
            expect(callback.called, 'to be true');
        });
        it('fire "change" event on spliced multiple array items', function() {
            var observable = new ObservableObject({
                uri: 'object/1',
                object: {
                    array: [{uri: 'object/2'}, {uri: 'object/3'}, {uri: 'object/4'}]
                }
            });
            observable.object.array.splice(1, 0, {
                uri: 'object/5',
                property: false
            }, {
                uri: 'object/6',
                property: false
            });
            var callback = sinon.spy();
            observable.on('change', callback);
            observable.object.array[1].property = true;
            observable.object.array[2].property = true;
            expect(callback.calledTwice, 'to be true');
        });
    });
    describe('dispose', function() {
        it('contains dispose method', function() {
            var obj = {};
            var observable = new ObservableObject(obj);
            var result = {};
            expect(observable.dispose, 'to be defined');
        });
        it('disposes children', function() {
            var obj = {
                obj: {
                    obj: {}
                }
            };
            var observable = new ObservableObject(obj);
            var spy = sinon.spy();
            obj.obj.obj.addDisposer(spy);
            observable.dispose();
            expect(spy.called, 'to be true');
        });
        it('disposes array children', function() {
            var obj = {
                obj: {
                    array: [{}]
                }
            };
            var observable = new ObservableObject(obj);
            var spy = sinon.spy();
            obj.obj.array[0].addDisposer(spy);
            observable.dispose();
            expect(spy.called, 'to be true');
        });
        it('does not fire "change" event after disposing', function() {
            var obj = {
                property: true
            };
            var observable = new ObservableObject(obj);
            var callback = sinon.spy();
            observable.on('change', callback);
            observable.dispose();
            obj.property = false;
            expect(callback.called, 'to be false');
        });
        it('does not fire "change" event after disposing - 2nd level', function() {
            var obj = {
                object: {
                    property: true
                }
            };
            var observable = new ObservableObject(obj);
            var callback = sinon.spy();
            observable.on('change', callback);
            observable.dispose();
            obj.object.property = false;
            expect(callback.called, 'to be false');
        });
        it('does not fire "change" event after disposing - array methods', function() {
            var obj = {
                object: {
                    array: []
                }
            };
            var observable = new ObservableObject(obj);
            var callback = sinon.spy();
            observable.on('change', callback);
            observable.dispose();
            obj.object.array.push(0);
            expect(callback.called, 'to be false');
        });
        it('does not fire "change" event after disposing - array object assignments', function() {
            var obj = {
                object: {
                    array: [{
                        id: 1
                    }]
                }
            };
            var observable = new ObservableObject(obj);
            var callback = sinon.spy();
            observable.on('change', callback);
            observable.dispose();
            obj.object.array[0].property = false;
            expect(callback.called, 'to be false');
        });
    });
});
