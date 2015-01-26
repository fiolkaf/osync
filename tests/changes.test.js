define(function(require) {
    var Changes = require('src/changes');
    var expect = require('unexpected');

    describe('Changes', function() {
        describe('applyChanges.object', function() {
            it('modifies single object property', function() {
                var obj = { property1: 0 };
                var changes = [ { type: 'update', property: 'property1', value: 1 }];
                Changes.applyChanges(obj, changes);
                expect(obj.property1, 'to equal', 1);
            });

            it('modifies multiple object properties', function() {
                var obj = { property1: 0, property2: 0 };
                var changes = [
                    { type: 'update', property: 'property1', value: 1 },
                    { type: 'update', property: 'property2', value: 2 }
                ];
                Changes.applyChanges(obj, changes);
                expect(obj.property1, 'to equal', 1);
                expect(obj.property2, 'to equal', 2);
            });
        });

        describe('applyChanges.array', function() {
            it('adds a single item to array with values', function() {
                var obj = { array1: [1, 2] };
                var changes = [ { type: 'add', property: 'array1', value: 3 }];
                Changes.applyChanges(obj, changes);
                expect(obj.array1, 'to equal', [1, 2, 3]);
            });

            it('removes a single item from array with values', function() {
                var obj = { array1: [1, 2, 3] };
                var changes = [ { type: 'remove', property: 'array1', value: 2 }];
                Changes.applyChanges(obj, changes);
                expect(obj.array1, 'to equal', [1, 3]);
            });

            it('adds a single item to array with objects', function() {
                var obj = { array1: [{id: 1}, {id: 2}] };
                var changes = [ { type: 'add', property: 'array1', value: {id: 3} }];
                Changes.applyChanges(obj, changes);
                expect(obj.array1, 'to equal', [{id: 1}, {id: 2}, {id: 3}]);
            });

            it('removes a single item to array with objects', function() {
                var obj = { array1: [{id: 1}, {id: 2}, {id: 3}] };
                var changes = [ { type: 'remove', property: 'array1', value: {id: 2} }];
                Changes.applyChanges(obj, changes);
                expect(obj.array1, 'to equal', [{id: 1}, {id: 3}]);
            });

            it('reorders an object in array', function() {
                var obj = { array1: [{id: 1}, {id: 2}, {id: 3}] };
                var changes = [{ type: 'index', property: 'array1', value: {id: 2}, index: 0 }];
                Changes.applyChanges(obj, changes);
                expect(obj.array1, 'to equal', [{id: 2}, {id: 1}, {id: 3}] );
            });

            it('reorders a simple object in array', function() {
                var obj = { array1: [1, 2, 3] };
                var changes = [{ type: 'index', property: 'array1', value: 2, index: 0 }];
                Changes.applyChanges(obj, changes);
                expect(obj.array1, 'to equal', [2, 1, 3] );
            });

            it('leaves an array untouched if cannot find an object in array', function() {
                var obj = { array1: [{id: 1}, {id: 2}, {id: 3}] };
                var changes = [{ type: 'index', property: 'array1', value: {id: 4}, index: 0 }];
                Changes.applyChanges(obj, changes);
                expect(obj.array1, 'to equal', [{id: 1}, {id: 2}, {id: 3}] );
            });

            it('moves an item at the end if new index is out of range', function() {
                var obj = { array1: [{id: 1}, {id: 2}, {id: 3}] };
                var changes = [{ type: 'index', property: 'array1', value: {id: 2}, index: 10 }];
                Changes.applyChanges(obj, changes);
                expect(obj.array1, 'to equal', [{id: 1}, {id: 3}, {id: 2}] );
            });

        });
    });
});
