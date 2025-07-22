/**
 * Pick a list of properties from an object
 * into a new object
 */
export const pick = <T extends object, TKeys extends keyof T>(
  obj: T,
  keys: TKeys[]
): Pick<T, TKeys> => {
  if (!obj) return {} as Pick<T, TKeys>
  return keys.reduce((acc, key) => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) acc[key] = obj[key]
    return acc
  }, {} as Pick<T, TKeys>)
}

/**
 * Omit a list of properties from an object
 * returning a new object with the properties
 * that remain
 */
export const omit = <T, TKeys extends keyof T>(
  obj: T,
  keys: TKeys[]
): Omit<T, TKeys> => {
  if (!obj) return {} as Omit<T, TKeys>
  if (!keys || keys.length === 0) return obj as Omit<T, TKeys>
  return keys.reduce(
    (acc, key) => {
      // Gross, I know, it's mutating the object, but we
      // are allowing it in this very limited scope due
      // to the performance implications of an omit func.
      // Not a pattern or practice to use elsewhere.
      delete acc[key]
      return acc
    },
    { ...obj }
  )
}

/**
 * Dynamically get a nested value from an array or
 * object with a string.
 *
 * @example get(person, 'friends[0].name')
 */
export const get = <TDefault = unknown>(
  value: any,
  path: string,
  defaultValue?: TDefault
): TDefault => {
  const segments = path.split(/[\.\[\]]/g)
  let current: any = value
  for (const key of segments) {
    if (current === null) return defaultValue as TDefault
    if (current === undefined) return defaultValue as TDefault
    const dequoted = key.replace(/['"]/g, '')
    if (dequoted.trim() === '') continue
    current = current[dequoted]
  }
  if (current === undefined) return defaultValue as TDefault
  return current
}