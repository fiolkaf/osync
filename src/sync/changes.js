define(function(require) {
    'use strict';

    function applySetChange(obj, change) {
        obj[change.property] = change.value;
    }

    function applyChange(obj, change) {
        switch (change.type) {
            case 'set':
                applySetChange(obj, change);
                break;
            case 'collection':
                applyCollectionChange(obj, change);
                break;
            default:
                throw 'Change type not recognized ' + change.type;
        }
    }

    return {
        applyChange: applyChange
    };

});
