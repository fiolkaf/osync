define(function(require) {
    var expect = require('unexpected');
    var ChangeActions = require('src/sync/changeActions');
    var ObservableObject = require('src/observable/observableObject').ObservableObject;

    describe('ChangeActions', function() {
        describe('set', function() {
            describe('execute', function() {
                it('modifies object property', function() {
                    var obj = {
                        property1: 0
                    };
                    var change = ChangeActions.set.create('property1', 1);
                    ChangeActions.set.execute(obj, change);
                    expect(obj.property1, 'to equal', 1);
                });
            });
            describe('create', function() {
                it('can create set property change', function() {
                    var change = ChangeActions.set.create('property1', 1);
                    expect(change.type, 'to equal', 'set');
                    expect(change.property, 'to equal', 'property1');
                    expect(change.object, 'to equal', 1);
                });
            });
        });
        describe('insert', function() {
            describe('execute', function() {
                it('unshifts an item', function() {
                    var obj = {
                        array1: [2, 3, 4]
                    };
                    var change = ChangeActions.insert.create('array1', 1, 0);
                    ChangeActions.insert.execute(obj, change);
                    expect(obj.array1, 'to equal', [1, 2, 3, 4]);
                });
                it('pushes an item if index is not specified', function() {
                    var obj = {
                        array1: [2, 3, 4]
                    };
                    var change = ChangeActions.insert.create('array1', 5);
                    ChangeActions.insert.execute(obj, change);
                    expect(obj.array1, 'to equal', [2, 3, 4, 5]);
                });
                it('pushes an item', function() {
                    var obj = {
                        array1: [2, 3, 4]
                    };
                    var change = ChangeActions.insert.create('array1', 5, 3);
                    ChangeActions.insert.execute(obj, change);
                    expect(obj.array1, 'to equal', [2, 3, 4, 5]);
                });
                it('insers an item in the middle', function() {
                    var obj = {
                        array1: [2, 4, 5]
                    };
                    var change = ChangeActions.insert.create('array1', 3, 1);
                    ChangeActions.insert.execute(obj, change);
                    expect(obj.array1, 'to equal', [2, 3, 4, 5]);
                });
                it('insers an item at the end if index is outside the boundary', function() {
                    var obj = {
                        array1: [2, 3, 4]
                    };
                    var change = ChangeActions.insert.create('array1', 5, 4);
                    ChangeActions.insert.execute(obj, change);
                    expect(obj.array1, 'to equal', [2, 3, 4, 5]);
                });
            });
            describe('create', function() {
                it('can create insert array item change', function() {
                    var change = ChangeActions.insert.create('array1', 5, 4);
                    expect(change.type, 'to equal', 'insert');
                    expect(change.property, 'to equal', 'array1');
                    expect(change.object, 'to equal', 5);
                    expect(change.index, 'to equal', 4);
                });
            });
        });
        describe('remove', function() {
            describe('execute', function() {
                it('removes a simple type item', function() {
                    var obj = {
                        array1: [2, 3, 4]
                    };
                    var change = ChangeActions.remove.create('array1', 3);
                    ChangeActions.remove.execute(obj, change);
                    expect(obj.array1, 'to equal', [2, 4]);
                });
                it('removes object item', function() {
                    var obj = {
                        array1: [{
                            uri: 1
                        }, {
                            uri: 2
                        }, {
                            uri: 3
                        }]
                    };
                    var change = ChangeActions.remove.create('array1', {
                        uri: 2
                    });
                    ChangeActions.remove.execute(obj, change);
                    expect(obj.array1, 'to equal', [{
                        uri: 1
                    }, {
                        uri: 3
                    }]);
                });
                it('leaves an array untouched if cannot find a simple type item', function() {
                    var obj = {
                        array1: [2, 3, 4]
                    };
                    var change = ChangeActions.remove.create('array1', 5);
                    ChangeActions.remove.execute(obj, change);
                    expect(obj.array1, 'to equal', [2, 3, 4]);
                });
                it('leaves an array untouched if cannot find object item', function() {
                    var obj = {
                        array1: [{
                            uri: 1
                        }, {
                            uri: 2
                        }, {
                            uri: 3
                        }]
                    };
                    var change = ChangeActions.remove.create('array1', { uri: 4 });
                    ChangeActions.remove.execute(obj, change);
                    expect(obj.array1, 'to equal', [{
                        uri: 1
                    }, {
                        uri: 2
                    }, {
                        uri: 3
                    }]);
                });
            });
            describe('create', function() {
                it('can create remove array item change', function() {
                    var change = ChangeActions.remove.create('array1', 5);
                    expect(change.type, 'to equal', 'remove');
                    expect(change.property, 'to equal', 'array1');
                    expect(change.object, 'to equal', 5);
                });
            });
        });
    });
});
