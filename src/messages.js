define(function(require) {
    'use strict';

    function objectChange(id, changes) {
        return {
            id: id,
            type: 'change',
            changes: changes
        };
    }

    function updateProperty(property, value, oldValue) {
        return {
            property: property,
            type: 'update',
            oldValue: oldValue,
            value: value
        };
    }

    function addArrayItem(property, value) {
        return {
            type: 'add',
            property: property,
            value: value
        };
    }

    function removeArrayItem(property, value) {
        return {
            type: 'remove',
            property: property,
            value: value
        };
    }

    function moveArrayItem(property, value, index) {
        return {
            type: 'index',
            property: property,
            value: value,
            index: index
        };
    }

    return {
        objectChange: objectChange,
        Changes: {
            updateProperty: updateProperty,
            moveArrayItem: moveArrayItem,
            addArrayItem: addArrayItem,
            removeArrayItem: removeArrayItem
        }
    };
});
