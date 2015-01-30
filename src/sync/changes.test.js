define(function(require) {
    var expect = require('unexpected');
    var Changes = require('src/sync/changes');

    describe('Changes', function() {
        describe('applyChanges.object', function() {
            it('modifies single object property', function() {
                var obj = { property1: 0 };
                var change = { type: 'set', property: 'property1', value: 1 };
                Changes.applyChange(obj, change);
                expect(obj.property1, 'to equal', 1);
            });
        });
    });
});
