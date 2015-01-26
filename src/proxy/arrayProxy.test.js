define(function(require) {
    var expect = require('unexpected');
    var ArrayProxy = require('src/proxy/arrayProxy');

    describe('ArrayProxy', function() {
        describe('create', function() {
            it('can create proxy on an array', function() {
                var array = [];
                var proxy = new ArrayProxy(array);
                expect(proxy, 'to be defined');
            });
        });
    });
});
