define(function(require) {
    var expect = require('unexpected');
    var Changes = require('src/sync/changes');

    describe('Changes', function() {
        describe('applyChanges.object', function() {
            it('modifies object property', function() {
                var obj = {
                    property1: 0
                };
                var change = {
                    type: 'set',
                    property: 'property1',
                    object: 1
                };
                Changes.applyChange(obj, change);
                expect(obj.property1, 'to equal', 1);
            });
        });
        describe('applyChanges.array.insert', function() {
            it('unshifts an item', function() {
                var obj = {
                    array1: [2, 3, 4]
                };
                var change = {
                    type: 'insert',
                    property: 'array1',
                    object: 1,
                    index: 0
                };
                Changes.applyChange(obj, change);
                expect(obj.array1, 'to equal', [1, 2, 3, 4]);
            });
            it('pushes an item of index is not specified', function() {
                var obj = {
                    array1: [2, 3, 4]
                };
                var change = {
                    type: 'insert',
                    property: 'array1',
                    object: 5,
                };
                Changes.applyChange(obj, change);
                expect(obj.array1, 'to equal', [2, 3, 4, 5]);
            });
            it('pushes an item', function() {
                var obj = {
                    array1: [2, 3, 4]
                };
                var change = {
                    type: 'insert',
                    property: 'array1',
                    object: 5,
                    index: 3
                };
                Changes.applyChange(obj, change);
                expect(obj.array1, 'to equal', [2, 3, 4, 5]);
            });
            it('insers an item in the middle', function() {
                var obj = {
                    array1: [2, 4, 5]
                };
                var change = {
                    type: 'insert',
                    property: 'array1',
                    object: 3,
                    index: 1
                };
                Changes.applyChange(obj, change);
                expect(obj.array1, 'to equal', [2, 3, 4, 5]);
            });
            it('insers an item at the end if index is outside the boundary', function() {
                var obj = {
                    array1: [2, 3, 4]
                };
                var change = {
                    type: 'insert',
                    property: 'array1',
                    object: 5,
                    index: 4
                };
                Changes.applyChange(obj, change);
                expect(obj.array1, 'to equal', [2, 3, 4, 5]);
            });
        });
        describe('applyChanges.array.remove', function() {
            it('removes a simple type item', function() {
                var obj = {
                    array1: [2, 3, 4]
                };
                var change = {
                    type: 'remove',
                    property: 'array1',
                    object: 3
                };
                Changes.applyChange(obj, change);
                expect(obj.array1, 'to equal', [2, 4]);
            });
            it('removes object item', function() {
                var obj = {
                    array1: [{uri: 1}, {uri: 2}, {uri: 3}]
                };
                var change = {
                    type: 'remove',
                    property: 'array1',
                    object: {uri: 2}
                };
                Changes.applyChange(obj, change);
                expect(obj.array1, 'to equal', [{uri: 1}, {uri: 3}]);
            });
            it('leaves an array untouched if cannot find a simple type item', function() {
                var obj = {
                    array1: [2, 3, 4]
                };
                var change = {
                    type: 'remove',
                    property: 'array1',
                    object: 5
                };
                Changes.applyChange(obj, change);
                expect(obj.array1, 'to equal', [2, 3, 4]);
            });
            it('leaves an array untouched if cannot find object item', function() {
                var obj = {
                    array1: [{uri: 1}, {uri: 2}, {uri: 3}]
                };
                var change = {
                    type: 'remove',
                    property: 'array1',
                    object: {}
                };
                Changes.applyChange(obj, change);
                expect(obj.array1, 'to equal', [{uri: 1}, {uri: 2}, {uri: 3}]);
            });
        });
    });
});
