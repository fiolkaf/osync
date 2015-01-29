define(function(require) {
    var expect = require('unexpected');
    var Disposable = require('src/mixin/disposable');

    describe('Disposable', function() {
        describe('dispose', function() {
            it('calls disposer when object is finalized', function() {
                var obj = {};
                var called = false;
                var disposer = function() {
                    called = true;
                };
                Disposable.mixin(obj);
                obj.addDisposer(disposer);
                obj.dispose();
                expect(called, 'to be true');
            });

        });
        describe('mixin', function() {
            it('can mixin an object with disposable behaviour', function() {
                var obj = {};
                expect(function() { Disposable.mixin(obj); }, 'not to throw error');
            });
            it('adds "dispose" method to object', function() {
                var obj = {};
                Disposable.mixin(obj);
                expect(obj.dispose, 'to be defined');
            });
            it('does not throw an error when calling dispose', function() {
                var obj = {};
                Disposable.mixin(obj);
                expect(obj.dispose, 'not to throw error');
            });
            it('does not throw an error when beeing mixed multiple times', function() {
                var obj = {};
                Disposable.mixin(obj);
                expect(function() { Disposable.mixin(obj); }, 'to throw error');
            });
        });
    });
});
