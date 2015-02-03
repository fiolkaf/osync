var expect = require('unexpected/unexpected');
var RemoteObject = require('./remoteObject');

describe('RemoteObject', function() {

    describe('syncronize objects', function() {
        it('can synchronize property', function() {
            var object1 = new RemoteObject({
                uri: 'object/1',
                property: false
            });

            var object2 = new RemoteObject({
                uri: 'object/1',
                property: false
            });
            object1.property = true;
            expect(object2.property, 'to be true');
            object1.dispose();
            object2.dispose();
        });

        it('can synchronize array pop method', function() {
            var object1 = new RemoteObject({
                uri: 'object/1',
                array: []
            });

            var object2 = new RemoteObject({
                uri: 'object/1',
                array: []
            });
            object1.array.push(1);
            expect(object2.array, 'to equal', [1]);
            object1.dispose();
            object2.dispose();
        });

        it('can synchronize nested array pop method', function() {
            var object1 = new RemoteObject({
                uri: 'object/1',
                object: {
                    array: []
                }
            });

            var object2 = new RemoteObject({
                uri: 'object/1',
                object: {
                    array: []
                }
            });
            object1.object.array.push(1);
            expect(object2.object.array, 'to equal', [1]);
            object1.dispose();
            object2.dispose();
        });

        it('can synchronize inserted objects', function() {
            var object1 = new RemoteObject({
                uri: 'object/1',
                object: {
                    array: []
                }
            });

            var object2 = new RemoteObject({
                uri: 'object/1',
                object: {
                    array: []
                }
            });

            //TODO
            /*
            var newItem = {uri: 'object/2', property: false};
            object1.object.array.push(newItem);
            object1.object.array[0].property = true;

            expect(object1.object.array[0], 'to equal', {uri: 'object/2', property: true});
            expect(object2.object.array[0], 'to equal', {uri: 'object/2', property: true});

            object1.dispose();
            object2.dispose();*/
        });

    });
});
