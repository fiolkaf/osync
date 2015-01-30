define(function(require) {
    'use strict';

    function getAllObjects(object, result) {
        result = result || [];
        Object.keys(object).map(function(key) {
            var property = object[key];
            if (Array.isArray(property)) {
                property.forEach(function(arrayItem) {
                    getAllObjects(arrayItem, result);
                });
            } else if (typeof property === 'object') {
                getAllObjects(property, result);
            }
        });
        result.push(object);
        return result;
    }

    function iterateObjectPath(object, indexes, result) {
        result = result || [];
        var index = indexes.shift();

        if (index) {
            result.push(object[index]);
            return iterateObjectPath(object[index], indexes, result);
        }

        return result;
    }

    function getIndexes(key) {
        return key.replace(/\[/g, '.').replace(/\[|\]/g, '').split('.');
    }

    function getObjectsInPath(object, key) {
        var indexes = getIndexes(key);
        return iterateObjectPath(object, indexes);
    }

    function getLastUriByPath(object, key) {
        var objectsInPath = getObjectsInPath(object, key);
        objectsInPath.unshift(object);

        var remoteObjects = objectsInPath.filter(function(item) {
            return item.hasOwnProperty('uri');
        });

        var remoteObject = remoteObjects[remoteObjects.length - 1];
        var index = objectsInPath.indexOf(remoteObject);

        var keys = key.replace(/\[/g, '.[').split('.');
        return {
            object: remoteObject,
            path: keys.slice(index).join('.')
        };
    }

    function getDescendentValue(object, key) {
        var objectsInPath = getObjectsInPath(object, key);
        return objectsInPath[objectsInPath.length - 1];
    }

    function getRemoteObjects(object) {
        var result = {};
        var remoteObjects = getAllObjects(object).filter(function(item) {
            return item.hasOwnProperty('uri');
        });

        remoteObjects.forEach(function(obj) {
            result[obj.uri] = obj;
        });
        return result;
    }

    return {
        getLastUriByPath: getLastUriByPath,
        getDescendentValue: getDescendentValue,
        getRemoteObjects: getRemoteObjects
    };
});
