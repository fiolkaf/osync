define(function(require) {
    var ObjectProxy = require('src/proxy/objectProxy');
    var expect = require('unexpected');

    describe('ObjectProxy', function() {
        describe('object', function() {
            it('can create proxy on data', function() {
                var obj = {
                    property1: 0
                };
                var proxy = new ObjectProxy(obj);
                expect(proxy, 'to be defined');
            });
            it('contains source property', function() {
                var obj = {
                    property1: 0
                };
                var proxy = new ObjectProxy(obj);
                expect(proxy.property1, 'to be defined');
            });
            it('can get the value of a source property', function() {
                var obj = {
                    property1: 0
                };
                var proxy = new ObjectProxy(obj);
                expect(proxy.property1, 'to equal', 0);
            });
            it('can set the value of a source property', function() {
                var obj = {
                    property1: 0
                };
                var proxy = new ObjectProxy(obj);
                proxy.property1 = 1;
                expect(proxy.property1, 'to equal', 1);
            });
            it('changes underlying data', function() {
                var obj = {
                    property1: 0
                };
                var proxy = new ObjectProxy(obj);
                proxy.property1 = 1;
                expect(obj.property1, 'to equal', 1);
            });
            it('changes proxy property', function() {
                var obj = {
                    property1: 0
                };
                var proxy = new ObjectProxy(obj);
                obj.property1 = 1;
                expect(proxy.property1, 'to equal', 1);
            });
        });

        describe('array', function() {
            it('can set the value of a source array property', function() {
                var obj = {
                    arr1: []
                };
                var proxy = new ObjectProxy(obj);
                proxy.arr1 = [1];
                expect(proxy.arr1, 'to equal', [1]);
            });
            it('changes underlying data', function() {
                var obj = {
                    arr1: []
                };
                var proxy = new ObjectProxy(obj);
                proxy.arr1 = [1];
                expect(obj.arr1, 'to equal', [1]);
            });
        });

        describe('subscriptions', function() {
            it('triggers an event when modifying plain property', function() {
                var obj = {
                    prop: 2
                };
                var result = {};
                var proxy = new ObjectProxy(obj);
                proxy.on('change', function(evt) {
                    result[evt.key] = evt.value;
                });
                proxy.prop = 3;
                expect(result.prop, 'to equal', 3);
            });
        });
    });
});
