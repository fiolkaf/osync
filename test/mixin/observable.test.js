var expect = require('unexpected/unexpected');
var Observable = require('../../src/mixin/observable');

describe('Observable', function() {
    var Bike = function() {
        var trigger = Observable.mixin(this);
        this.drive = function() {
            trigger('drive', 'drive');
        };
        this.stop = function() {
            trigger('stop', 'stop');
        };
    };
    describe('mixin', function() {
        it('can create observable objects', function() {
            var obj = {};
            Observable.mixin(obj);
            expect(obj.on, 'to be defined');
        });
        it('can subscribe to the topic', function() {
            var obj = {};
            Observable.mixin(obj);
            var unsubscribe = obj.on('topic', function(){});
            expect(unsubscribe, 'to be defined');
        });
    });
    describe('on', function() {
        it('triggers an event on topic', function() {
            var bike = new Bike();
            var result = null;
            bike.on('drive', function(data) {
                result = data;
            });
            bike.drive();
            expect(result, 'to equal', 'drive');
        });
        it('does not trigger an event on different topic', function() {
            var bike = new Bike();
            var result = null;
            bike.on('stop', function(data) {
                result = data;
            });
            bike.drive();
            expect(result, 'to be null');
        });
        it('can have multiple subscribers on the topic', function() {
            var bike = new Bike();
            var callCount = 0;
            var inc = function() {
                callCount++;
            };
            bike.on('drive', inc);
            bike.on('drive', inc);
            bike.drive();
            expect(callCount, 'to equal', 2);
        });
        it('can unsubscribe from the topic', function() {
            var bike = new Bike();
            var callCount = 0;
            var inc = function() {
                callCount++;
            };
            var unsubscribe = bike.on('drive', inc);
            unsubscribe();
            bike.drive();
            expect(callCount, 'to equal', 0);
        });
        it('keeps other topic subscriptions after unsubscribe is called', function() {
            var bike = new Bike();
            var result = null;
            var inc = function(data) {
                result = data;
            };
            bike.on('stop', inc);
            var unsubscribe = bike.on('drive', inc);
            unsubscribe();
            bike.drive();
            bike.stop();
            expect(result, 'to equal', 'stop');
        });
    });
});
