define(function(require) {
    'use strict';

    var IndexerRegEx = /([\w]+)\[(\d+)]/;

    function findLastUriByPath(object, array, result) {
        if (object.uri) {
            result = result || {};
            result.object = object;
            result.pathArray = array.slice(0);
        }

        var key = array.shift();
        if (!array.length) {
            return result;
        }

        if (IndexerRegEx.test(key)) {
            var match = key.match(IndexerRegEx);
            key = match[1];
            var index = match[2];
            return findLastUriByPath(object[key][index], array, result);
        } else {
            return findLastUriByPath(object[key], array, result);
        }

        return result;
    }

    function getRemoteObjects(object, result) {
        result = result || [];
        Object.keys(object).map(function(key) {
            var property = object[key];
            if (Array.isArray(property)) {
                property.forEach(function(arrayItem) {
                    getRemoteObjects(arrayItem, result);
                });
            } else if (typeof property === 'object') {
                getRemoteObjects(property, result);
            }
        });
        if (object.uri) {
            result[object.uri] = object;
        }
        return result;
    }

    return {
        getLastUriByPath: function(object, path) {
            if (!object.hasOwnProperty('uri')) {
                throw 'Remote object is missing "uri" property';
            }

            var result = findLastUriByPath(object, path.split('.'));
            return {
                object: result.object,
                path: result.pathArray.join('.')
            };
        },
        getRemoteObjects: getRemoteObjects
    };
});
