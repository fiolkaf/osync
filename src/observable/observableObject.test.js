define(function(require) {
    var expect = require('unexpected');

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
                observable.on('change', function(key, value) {
                    result[key] = value;
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
                observable.on('change', function(key, value) {
                    result[key] = value;
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
                observable.on('change', function(key, value) {
                    result[key] = value;
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
                observable.on('change', function(key, value) {
                    result[key] = value;
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
                observable.on('change', function(key, value) {
                    result[key] = value;
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
                observable.on('change', function(key, value) {
                    result[key] = value;
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

                observable.on('change', function(key, value) {
                    result[key] = value;
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

                observable.on('change', function(key, value) {
                    result[key] = value;
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
            it('receives events about array property changes', function() {
                var obj = {
                    array: []
                };
                var observable = new ObservableObject(obj);
                var result = {};
                observable.on('change', function(key, change) {
                    result[key] = change.value;
                });
                observable.array.push(1);
                expect(result.array, 'to equal', [1]);
            });
            it('receives events about nested array property changes', function() {
                var obj = {
                    property1: {
                        array: []
                    }
                };
                var observable = new ObservableObject(obj);
                var result = {};
                observable.on('change', function(key, change) {
                    expect(change.type, 'to equal', 'push');
                    result[key] = change.value;
                });
                observable.property1.array.push(1);
                expect(result['property1.array'], 'to equal', [1]);
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
                var result = {};
                observable.on('change', function(key, value) {
                    result[key] = value;
                });
                observable.array[0].id = 1;
                expect(result['array[0].id'], 'to equal', 1);
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
                var result = {};
                observable.on('change', function(key, value) {
                    result[key] = value;
                });
                observable.array[0].array[0].id = 1;
                expect(result['array[0].array[0].id'], 'to equal', 1);
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
                        array: [{ id:1 }]
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
});
