export function required<
  T extends Record<any, any>,
  R extends Record<any, any> = T,
  S extends Record<any, any> = T & R
>(source1: Partial<T>, source2: Partial<R> | undefined | null, source3?: Partial<S> | null): T & R & S {
  return merge([source1, source2, source3], (p, e) => {
    return { ...p, ...e }
  })
}

export function requiredDeep<
  T extends Record<any, any>,
  R extends Record<any, any> = T,
  S extends Record<any, any> = T & R
>(source1: Partial<T>, source2: Partial<R> | undefined | null, source3?: Partial<S> | null): T & R & S {
  return merge([source1, source2, source3], (p, e) => deepmerge(p, e) as any)
}

function merge(
  entries: [Record<any, any>, Record<any, any> | undefined | null, Record<any, any> | undefined | null],
  reducer: (result: Record<any, any>, entry: Record<any, any> | undefined | null) => Record<any, any>
) {
  if (entries[0] === undefined || entries[0] === null) return entries[0]

  return entries.filter(x => !!x).reduce(reducer, {})
}

function deepmerge(
  source1: unknown,
  source2: unknown
): unknown {
  if (typeof source1 !== 'object' || source1 === null) return source2 !== undefined ? source2 : source1
  if (Array.isArray(source1)) {
    if (Array.isArray(source2)) return source2
    if (source2 === undefined) return [...source1]
    return [...source1, source2]
  }

  return getAllKeys(source1).concat(getAllKeys(source2)).reduce((p, k) => {
    // @ts-ignore
    p[k] = deepmerge(source1[k], source2 && source2[k])

    return p
  }, {} as Record<keyof any, unknown>)
}

function getAllKeys(subject: any, internal = false): string[] {
  if (typeof subject !== 'object') return []
  const propertyNames = Object.getOwnPropertyNames(subject)
  const keys = internal ? propertyNames.filter(n => n !== 'constructor') : propertyNames
  const proto = Object.getPrototypeOf(subject)
  return proto !== Object.prototype ? keys.concat(getAllKeys(proto, true)) : keys
}

/**
 * Unpartial a partial type.
 * @type T Type of `base`. If not specified, it will be inferred from `base`.
 * @param base The base value to fill in needed property if not available in the `partial` value.
 * @param partial The partial value to be unpartialed.
 */
export function unpartial<
  T extends Record<any, any>,
  R extends Record<any, any> = Partial<T>
>(base: T, partial: R | undefined | null):
  { [P in keyof T]: P extends keyof R ? T[P] | Exclude<R[P], undefined> : T[P] }
  & Pick<R, Exclude<keyof R, keyof T>>
/**
* Unpartial a partial type with two base values.
* This is useful when you are extending value from another package or code.
* That means you have a `parent` value from the original code,
* a `base` value where you add additional defaults or override existing one,
* and `partial` value from input.
* @deprecated please use composition instead: `unpartial(unpartial(a, b), c)`
* @type R Type of `base`. This type will be used as the return type.
* @param parent The default value from the original code.
* @param base The extended default value of your code.
* @param partial The input value.
*/
export function unpartial<
  T extends Record<any, any>,
  R extends Record<any, any> = Partial<T>,
  S extends Record<any, any> = Partial<T & R>
>(parent: T, base: R | undefined | null, partial: S | undefined | null): T & R & S
export function unpartial(s1: any, s2: any, s3?: any) {
  // defensive check for JS
  if (s1 === undefined || s1 === null) return s1
  return [s1, s2, s3]
    .filter(notNil)
    .reduce((p, s: any) => ({ ...p, ...trimNilProps(s) }), {} as any)
}

function trimNilProps(value: any) {
  return Object.keys(value).reduce((p, k) => {
    if (notNil(value[k])) p[k] = value[k]
    return p
  }, {} as any)
}

function notNil(value: any) {
  return value !== null && value !== undefined
}


export function unpartialRecursively<
  T extends Record<string, any>
>(base: T, partial: Record<string, any> | undefined): T
export function unpartialRecursively<
  T extends Record<string, any>,
  R extends Record<string, any> = Record<string, any>
>(superBase: R, base: T | undefined, partial: Record<string, unknown> | undefined): T & R
export function unpartialRecursively(arg1: any, arg2: any, arg3?: any) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return requiredDeep(arg1, arg2, arg3)
}
