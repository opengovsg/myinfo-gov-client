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

export const objToSearchParams = (
  obj: Record<string, unknown>,
): URLSearchParams => {
  const params = new URLSearchParams()
  Object.keys(obj).forEach((k) => {
    params.append(k, String(obj[k]))
  })
  return params
}
