/**
 * Sorts an object's keys in alphabetical order. Does
 * not modify the original object.
 * @param unordered Object with unsorted keys
 * @returns An object with the same keys and values, with the
 * keys ordered
 */
export declare const sortObjKeys: <T>(unordered: Record<string, T>) => Record<string, T>;
/**
 * Converts key-value pairs to URL search parameters.
 * @param obj Object containing query parameters
 * @returns URL search parameters containing the key-value pairs
 */
export declare const objToSearchParams: (obj: Record<string, unknown>) => URLSearchParams;
/**
 * Type guard for whether an object contains a given property
 * @param obj Object to check
 * @param prop The property to check for
 */
export declare const hasProp: <K extends string>(obj: object, prop: K) => obj is Record<K, unknown>;
