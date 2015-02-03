var expect = require('unexpected/unexpected');
var RemoteObjectTraverse = require('./remoteObjectTraverse');

describe('RemoteObjectTraverse', function() {
    describe('getLastUriByPath', function() {
        it('returns itself if object has no structure', function() {
            var obj = {
                uri: '/remoteobject/1'
            };
            var result = RemoteObjectTraverse.getLastUriByPath(obj, '');
            expect(result.object, 'to be', obj);
        });
        it('returns itself if object has nested object structure without other remote objects', function() {
            var obj = {
                uri: '/remoteobject/1',
                object1: {
                    object12: {
                        object123: true
                    }
                }
            };
            var result = RemoteObjectTraverse.getLastUriByPath(obj, 'object1.object12.object123');
            expect(result.object, 'to be', obj);
        });
        it('returns full path if object has nested remote object', function() {
            var obj = {
                uri: '/remoteobject/1',
                object1: {
                    object12: {
                        object123: true
                    }
                }
            };
            var result = RemoteObjectTraverse.getLastUriByPath(obj, 'object1.object12.object123');
            expect(result.path, 'to equal', 'object1.object12.object123');
            expect(result.object, 'to be', obj);
        });
        it('gets nested object with uri', function() {
            var obj = {
                uri: '/remoteobject/1',
                object1: {
                    object12: {
                        uri: '/remoteobject/2',
                        object123: true
                    }
                }
            };
            var result = RemoteObjectTraverse.getLastUriByPath(obj, 'object1.object12.object123');
            expect(result.object, 'to be', obj.object1.object12);
            expect(result.path, 'to equal', 'object123');
        });
        it('returns remote object from Array', function() {
            var obj = {
                uri: '/remoteobject/1',
                object1: {
                    array1: [{
                        uri: '/remoteobject/2',
                        object123: true
                    }]
                }
            };
            var result = RemoteObjectTraverse.getLastUriByPath(obj, 'object1.array1[0].object123');
            expect(result.path, 'to equal', 'object123');
            expect(result.object, 'to be', obj.object1.array1[0]);
        });
    });
    describe('getRemoteObjects', function() {
        it('returns all uris from nested objects', function() {
            var obj = {
                uri: '/remoteobject/1',
                object1: {
                    object12: {
                        uri: '/remoteobject/2',
                        object123: true
                    }
                }
            };
            var result = RemoteObjectTraverse.getRemoteObjects(obj);
            expect(result['/remoteobject/1'], 'to equal', obj);
            expect(result['/remoteobject/2'], 'to equal', obj.object1.object12);
            expect(Object.keys(result).length, 'to equal', 2);
        });
        it('returns all uris from nested objects in arrays', function() {
            var obj = {
                uri: '/remoteobject/1',
                object1: {
                    array1: [{
                        uri: '/remoteobject/2',
                        object123: true
                    }],
                    a_23_09rray1: [{
                        uri: '/remoteobject/3',
                        object123: true
                    }]
                }
            };
            var result = RemoteObjectTraverse.getRemoteObjects(obj);
            expect(result['/remoteobject/1'], 'to equal', obj);
            expect(result['/remoteobject/2'], 'to equal', obj.object1.array1[0]);
            expect(result['/remoteobject/3'], 'to equal', obj.object1.a_23_09rray1[0]);
            expect(Object.keys(result).length, 'to equal', 3);
        });
        it('returns unique values', function() {
            var obj = {
                uri: '/remoteobject/1',
                object1: {
                    array1: [{
                        uri: '/remoteobject/1',
                        object123: true
                    }],
                    a_23_09rray1: [{
                        uri: '/remoteobject/3',
                        object123: true
                    }]
                }
            };
            var result = RemoteObjectTraverse.getRemoteObjects(obj);
            expect(result['/remoteobject/1'], 'to equal', obj);
            expect(result['/remoteobject/3'], 'to equal', obj.object1.a_23_09rray1[0]);
            expect(Object.keys(result).length, 'to equal', 2);
        });
    });
    describe('getDescendentValue', function() {
        it('can return object property', function() {
            var obj = {
                property: true
            };
            var result = RemoteObjectTraverse.getDescendentValue(obj, 'property');
            expect(result, 'to be true');
        });
        it('returns single object by property path', function() {
            var obj = {
                property1: {
                    property2: true
                }
            };
            var result = RemoteObjectTraverse.getDescendentValue(obj, 'property1.property2');
            expect(result, 'to be true');
        });
        it('returns array object', function() {
            var obj = {
                array: [{
                    property2: true
                }]
            };
            var result = RemoteObjectTraverse.getDescendentValue(obj, 'array[0]');
            expect(result.property2, 'to be true');
        });
        it('returns nested array object', function() {
            var obj = {
                array: [
                    [1, 2, 3]
                ]
            };
            var result = RemoteObjectTraverse.getDescendentValue(obj, 'array[0][0]');
            expect(result, 'to equal', 1);
        });
    });
    describe('getDescendentObject', function() {
        it('can return object property', function() {
            var obj = {
                property: true
            };
            var result = RemoteObjectTraverse.getDescendentObject(obj, 'property');
            expect(result.object, 'to equal', obj);
            expect(result.property, 'to equal', 'property');
        });
        it('returns single object by property path', function() {
            var obj = {
                property1: {
                    property2: true
                }
            };
            var result = RemoteObjectTraverse.getDescendentObject(obj, 'property1.property2');
            expect(result.object, 'to equal', obj.property1);
            expect(result.property, 'to equal', 'property2');
        });
        it('returns array object', function() {
            var obj = {
                array: [{
                    property2: true
                }]
            };
            var result = RemoteObjectTraverse.getDescendentObject(obj, 'array[0].property2');
            expect(result.property, 'to equal', 'property2');
            expect(result.object, 'to equal', obj.array[0]);
        });
        it('returns nested array object', function() {
            var obj = {
                array: [
                    [1, 2, 3]
                ]
            };
            var result = RemoteObjectTraverse.getDescendentObject(obj, 'array[0][0]');
            expect(result.property, 'to equal', '[0]');
            expect(result.object, 'to equal', [1, 2, 3]);
        });
    });
});
