"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasProp = exports.objToSearchParams = exports.sortObjKeys = void 0;
/**
 * Sorts an object's keys in alphabetical order. Does
 * not modify the original object.
 * @param unordered Object with unsorted keys
 * @returns An object with the same keys and values, with the
 * keys ordered
 */
var sortObjKeys = function (unordered) {
    return Object.keys(unordered)
        .sort()
        .reduce(function (obj, key) {
        obj[key] = unordered[key];
        return obj;
    }, {});
};
exports.sortObjKeys = sortObjKeys;
/**
 * Converts key-value pairs to URL search parameters.
 * @param obj Object containing query parameters
 * @returns URL search parameters containing the key-value pairs
 */
var objToSearchParams = function (obj) {
    var params = new URLSearchParams();
    Object.keys(obj).forEach(function (k) {
        params.append(k, String(obj[k]));
    });
    return params;
};
exports.objToSearchParams = objToSearchParams;
/**
 * Type guard for whether an object contains a given property
 * @param obj Object to check
 * @param prop The property to check for
 */
var hasProp = function (
// eslint-disable-next-line @typescript-eslint/ban-types
obj, prop) {
    return prop in obj;
};
exports.hasProp = hasProp;
