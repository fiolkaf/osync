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
        if (typeof index === 'undefined') {
            index = array.length;
        }
        index = array.length <= index ? array.length: index;
        array.splice(index, 0, object);
    }

    function applyChange(obj, change) {
        switch (change.type) {
            case 'set':
                obj[change.property] = change.object;
                break;
            case 'insert':
                arrayInsert(obj[change.property] , change.object, change.index);
                break;
            case 'remove':
                arrayRemove(obj[change.property] , change.object);
                break;
            default:
                throw 'Change type not recognized ' + change.type;
        }
    }

    return {
        applyChange: applyChange
    };

});
