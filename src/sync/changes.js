define(function(require) {
    'use strict';

    var ChangeActions = require('src/sync/changeActions');

    function mapObservableChange(evt) {
        switch(evt.type) {
            case 'splice':
                var startIndex = evt.args[0];
                var deleted = Array.isArray(evt.result) ? evt.result : [evt.result];
                var inserted = Array.prototype.slice.call(evt.args, 2);

                var deleteChanges = deleted.map(function(item) {
                    return ChangeActions.remove.create(evt.key, item);
                });

                var insertChanges = inserted.map(function(item, index) {
                    return ChangeActions.insert.create(evt.key, item, startIndex + index);
                });

                return deleteChanges.concat(insertChanges);
            case 'unshift':
                break;
            case 'pop':
                break;
            case 'push':
                break;
            case 'shift':
                break;
        }

        return changes;
    }

    return {
        mapObservableChange: mapObservableChange
    };

});
