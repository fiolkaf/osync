define(function(require) {
    'use strict';

    function arrayRemove(array, object) {
        var getIdentifier = function(item) {
            return item.uri ? item.uri : item;
        };
        var index = array.findIndex(function(item) {
            return getIdentifier(item) === getIdentifier(object);
        });
        if (index >= 0) {
            array.splice(index, 1);
        }
    }

    function arrayInsert(array, object, index) {
        index = array.length >= index ? array.length - 1: index;
        array.splice(index, 0, object);
    }

    function arrayChange(obj, change) {
        var array = obj[change.property];
        switch (change.method) {
            // pop / shift
            case 'remove':
                arrayRemove(array, change.object);
                break;
            // push / unshift
            case 'insert':
                arrayInsert(array, change.object, change.index ? change.index : 0);
                break;
        }

    }

    function applyChange(obj, change) {
        switch (change.type) {
            case 'set':
                obj[change.property] = change.object;
                break;
            case 'array':
                arrayChange(obj, change);
                break;
            default:
                throw 'Change type not recognized ' + change.type;
        }
    }

    return {
        applyChange: applyChange
    };

});
