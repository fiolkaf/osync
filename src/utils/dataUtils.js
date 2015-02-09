
/**
 * deepClone - Creates a deep clone of data
 *
 * @param  {type} obj Object to clone
 * @return {type}     Deep clone of an object
 */
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

module.exports = {
    deepClone: deepClone
};
