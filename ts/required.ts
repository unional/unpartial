/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
export function required<
  T extends Record<any, any>,
  R extends Record<any, any> = T,
  S extends Record<any, any> = T & R
>(source1: Partial<T>, source2: Partial<R> | undefined | null, source3?: Partial<S> | null): T & R & S {
  return merge([source1, source2, source3], (p, e) => ({ ...p, ...e }))
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
