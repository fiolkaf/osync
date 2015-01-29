define(function(require) {
    'use strict';

    function applyChange(obj, change) {
    }

    function applyChanges(obj, changes) {
        changes.forEach(function(change) {
            applyChange(obj, change);
        });
    }

    return {
        applyChanges: applyChanges
    };
});
