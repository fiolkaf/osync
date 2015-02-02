define(function(require) {
    var expect = require('unexpected');
    var ArrayProxy = require('src/proxy/arrayProxy');

    describe('ArrayProxy', function() {
        describe('create', function() {
            it('can create proxy on an array', function() {
                var array = [];
                var proxy = new ArrayProxy(array);
                expect(proxy, 'to be defined');
                expect(proxy, 'to be an array');
            });
            it('can create get proxy values array values', function() {
                var array = [1, 2, 3];
                var proxy = new ArrayProxy(array);
                expect(proxy, 'to equal', array);
            });
            it('can iterate through proxy array', function() {
                var array = [1, 2, 3];
                var result = [];
                var proxy = new ArrayProxy(array);
                proxy.forEach(function(item) {
                    result.push(item);
                });
                expect(result, 'to equal', array);
            });
        });
        describe('modify methods', function() {
            it('can pop an item from proxy array', function() {
                var array = [1, 2, 3];
                var proxy = new ArrayProxy(array);
                var value = proxy.pop();
                expect(value, 'to equal', 3);
                expect(array, 'to equal', [1, 2]);
                expect(proxy, 'to equal', [1, 2]);
            });
            it('can push a single item to proxy array', function() {
                var array = [1, 2, 3];
                var proxy = new ArrayProxy(array);
                proxy.push(4);
                expect(array, 'to equal', [1, 2, 3, 4]);
                expect(proxy, 'to equal', [1, 2, 3, 4]);
            });
            it('can push multiple items to proxy array', function() {
                var array = [1, 2, 3];
                var proxy = new ArrayProxy(array);
                proxy.push(4, 5);
                expect(array, 'to equal', [1, 2, 3, 4, 5]);
                expect(proxy, 'to equal', [1, 2, 3, 4, 5]);
            });
            it('can reverse items in array', function() {
                var array = [1, 2, 3];
                var proxy = new ArrayProxy(array);
                proxy.reverse();
                expect(array, 'to equal', [3, 2, 1]);
                expect(proxy, 'to equal', [3, 2, 1]);
            });
            it('can shift an item from array', function() {
                var array = [1, 2, 3];
                var proxy = new ArrayProxy(array);
                var shifted = proxy.shift();
                expect(shifted, 'to equal', 1);
                expect(array, 'to equal', [2, 3]);
                expect(proxy, 'to equal', [2, 3]);
            });
            it('can sort items in array', function() {
                var array = [3, 2, 1];
                var proxy = new ArrayProxy(array);
                proxy.sort();
                expect(array, 'to equal', [1, 2, 3]);
                expect(proxy, 'to equal', [1, 2, 3]);
            });
            it('can splice elements from array', function() {
                var array = [1, 2, 3];
                var proxy = new ArrayProxy(array);
                proxy.splice(1, 2);
                expect(array, 'to equal', [1]);
                expect(proxy, 'to equal', [1]);
            });
            it('can unshift a single element to array', function() {
                var array = [1, 2, 3];
                var proxy = new ArrayProxy(array);
                proxy.unshift(0);
                expect(array, 'to equal', [0, 1, 2, 3]);
                expect(proxy, 'to equal', [0, 1, 2, 3]);
            });
            it('can unshift multiple elements to array', function() {
                var array = [1, 2, 3];
                var proxy = new ArrayProxy(array);
                proxy.unshift(-1, 0);
                expect(array, 'to equal', [-1, 0, 1, 2, 3]);
                expect(proxy, 'to equal', [-1, 0, 1, 2, 3]);
            });
        });
        describe('subscriptions', function() {
            it('triggers pop event on a single item', function() {
                var array = [1, 2, 3];
                var proxy = new ArrayProxy(array);
                proxy.on('change', function(evt) {
                    expect(evt, 'to equal', {
                        type: 'pop',
                        args: [],
                        result: 3
                    });
                });
                var value = proxy.pop();
                expect(value, 'to equal', 3);
            });
            it('triggers push event on a single item', function() {
                var array = [1, 2, 3];
                var proxy = new ArrayProxy(array);
                proxy.on('change', function(evt) {
                    expect(evt, 'to equal', {
                        type: 'push',
                        args: [4],
                        result: 4
                    });
                });
                proxy.push(4);

            });
            it('triggers push event on multiple items', function() {
                var array = [1, 2, 3];
                var proxy = new ArrayProxy(array);
                proxy.on('change', function(evt) {
                    expect(evt, 'to equal', {
                        type: 'push',
                        args: [4, 5],
                        result: 5
                    });
                });
                proxy.push(4, 5);
            });
            it('triggers reverse array event', function() {
                var array = [1, 2, 3];
                var proxy = new ArrayProxy(array);
                proxy.on('change', function(evt) {
                    expect(evt, 'to equal', {
                        type: 'reverse',
                        args: [],
                        result: [3, 2, 1]
                    });
                });
                proxy.reverse();
            });
            it('triggers shift array event', function() {
                var array = [1, 2, 3];
                var proxy = new ArrayProxy(array);
                proxy.on('change', function(evt) {
                    expect(evt, 'to equal', {
                        type: 'shift',
                        result: 1,
                        args: []
                    });
                });
                proxy.shift();
            });
            it('triggers sort event on array', function() {
                var array = [3, 2, 1];
                var proxy = new ArrayProxy(array);
                proxy.on('change', function(evt) {
                    expect(evt, 'to equal', {
                        type: 'sort',
                        args: [],
                        result: [1, 2, 3]
                    });
                });
                proxy.sort();
            });
            it('triggers splice event on array', function() {
                var array = [1, 2, 3];
                var proxy = new ArrayProxy(array);
                proxy.on('change', function(evt) {
                    expect(evt, 'to equal', {
                        type: 'splice',
                        result: [2, 3],
                        args: [1, 2]
                    });
                });
                proxy.splice(1, 2);
            });
            it('triggers unshift event on a single array element', function() {
                var array = [1, 2, 3];
                var proxy = new ArrayProxy(array);
                proxy.on('change', function(evt) {
                    expect(evt, 'to equal', {
                        type: 'unshift',
                        result: 4,
                        args: [0]
                    });
                });
                proxy.unshift(0);
            });
            it('triggers unshift event on multiple array elements', function() {
                var array = [1, 2, 3];
                var proxy = new ArrayProxy(array);
                proxy.on('change', function(evt) {
                    expect(evt, 'to equal', {
                        type: 'unshift',
                        result: 5,
                        args: [-1, 0]
                    });
                });
                proxy.unshift(-1, 0);
            });
        });
    });
});
