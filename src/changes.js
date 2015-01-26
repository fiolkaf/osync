define(function(require) {
    'use strict';

    function applyChange(obj, change) {
        var key = change.property;
        if (!Array.isArray(obj[key])) {
            obj[key] = change.value;
            return;
        }
        var array = obj[key];
        switch (change.type) {
            case 'add':
                array.push(change.value);
                break;
            case 'remove':
                var index = array.findIndex(function(item) {
                    return item.id ? item.id === change.value.id : item === change.value;
                });
                if (index >= 0) {
                    array.splice(index, 1);
                }
                break;
            case 'index':
                var fromIndex = array.findIndex(function(item) {
                    return item.id ? item.id === change.value.id : item === change.value;
                });

                if (fromIndex < 0) {
                    return;
                }
                array.splice(change.index, 0, array.splice(fromIndex, 1)[0]);
                break;
        }
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
