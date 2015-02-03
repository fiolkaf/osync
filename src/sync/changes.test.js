var expect = require('unexpected/unexpected');
var Changes = require('./changes');
var ObservableObject = require('../observable/observableObject').ObservableObject;

describe('Changes', function() {
    describe('mapObservableChange', function() {
        it('generates remove item change from observable object event', function() {
            var object = ObservableObject({
                array: [1, 2, 3, 4, 5]
            });
            var changes;
            object.on('change', function(evt) {
                changes = Changes.mapObservableChange(evt);
            });
            object.array.splice(1, 1);
            expect(changes, 'to equal', [ {property: 'array', type: 'remove', object: 2}]);
        });
    });
});
