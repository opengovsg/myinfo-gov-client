/**
 * Sorts an object's keys in alphabetical order. Does
 * not modify the original object.
 * @param unordered Object with unsorted keys
 * @returns An object with the same keys and values, with the
 * keys ordered
 */
export const sortObjKeys = <T>(
  unordered: Record<string, T>,
): Record<string, T> => {
  return Object.keys(unordered)
    .sort()
    .reduce<Record<string, T>>((obj, key) => {
      obj[key] = unordered[key]
      return obj
    }, {})
}

/**
 * Converts key-value pairs to URL search parameters.
 * @param obj Object containing query parameters
 * @returns URL search parameters containing the key-value pairs
 */
export const objToSearchParams = (
  obj: Record<string, unknown>,
): URLSearchParams => {
  const params = new URLSearchParams()
  Object.keys(obj).forEach((k) => {
    params.append(k, String(obj[k]))
  })
  return params
}

/**
 * Type guard for whether an object contains a given property
 * @param obj Object to check
 * @param prop The property to check for
 */
export const hasProp = <K extends string>(
  // eslint-disable-next-line @typescript-eslint/ban-types
  obj: object,
  prop: K,
): obj is Record<K, unknown> => {
  return prop in obj
}

/**
 * Wraps a caught object in an error.
 * @param err Object caught in try-catch block
 * @param defaultMsg String which will be prefixed to the error's message if
 * the error is an Error object, otherwise wrapped in an Error
 */
export const wrapError = (err: any, defaultMsg: string): Error => {
  if (err instanceof Error) {
    err.message = `${defaultMsg}: ${err.message}`
    throw err
  }
  throw new Error(`${defaultMsg}: ${JSON.stringify(err)}`)
}
