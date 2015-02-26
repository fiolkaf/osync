require('array.prototype.findindex');

module.exports = {
    set: {
        create: function(property, object) {
            return {
                type: 'set',
                property: property,
                object: object
            };
        },
        execute: function(object, change) {
            object[change.property] = change.object;
        }
    },
    insert: {
        create: function(property, object, index) {
            return {
                type: 'insert',
                property: property,
                object: object,
                index: index
            };
        },
        execute: function(object, change) {
            var array = object[change.property];
            var index = change.index;
            if (typeof index === 'undefined') {
                index = array.length;
            }
            index = array.length <= index ? array.length : index;
            array.splice(index, 0, change.object);
        }
    },
    remove: {
        create: function(property, object) {
            return {
                type: 'remove',
                property: property,
                object: object
            };
        },
        execute: function(object, change) {
            var array = object[change.property];
            var obj = change.object;
            var getIdentifier = function(item) {
                return item.uri ? item.uri : item;
            };
            var index = array.findIndex(function(item) {
                return getIdentifier(item) === getIdentifier(obj);
            });
            if (index >= 0) {
                array.splice(index, 1);
            }
        }
    }
};
