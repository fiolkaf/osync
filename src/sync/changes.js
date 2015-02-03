var ChangeActions = require('./changeActions');

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
        case 'push':
            return evt.args.map(function(item, index) {
                return ChangeActions.insert.create(evt.key, item, evt.result - evt.args.length + index);
            });
        case 'unshift':
            return evt.args.map(function(item, index) {
                return ChangeActions.insert.create(evt.key, item, index);
            });
        case 'pop':
        case 'shift':
            return [ChangeActions.remove.create(evt.key, evt.result)];
        case 'set':
            return [ChangeActions.set.create(evt.key, evt.value)];
        default:
            throw evt.type + ' id not supported';
    }
}

module.exports = {
    mapObservableChange: mapObservableChange
};
