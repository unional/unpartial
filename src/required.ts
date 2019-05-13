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
  return merge([source1, source2, source3], (p, e) => deepmerge(p, e))
}

function merge(entries: any[], reducer: (result: any, entry: any) => any) {
  if (entries[0] === undefined || entries[0] === null) return entries[0]

  return entries.filter(x => !!x).reduce(reducer, {} as any)
}

function deepmerge(source1: any, source2: any): any {
  if (typeof source1 !== 'object' || source1 === null) return source2 || source1
  if (Array.isArray(source1)) {
    return Array.isArray(source2) ? source2 : [...source1, source2]
  }

  return getAllKeys(source1).concat(getAllKeys(source2)).reduce((p, k) => {
    p[k] = deepmerge(source1[k], source2 && source2[k])

    return p
  }, {} as any)
}

function getAllKeys(subject: any, internal = false): string[] {
  if (typeof subject !== 'object') return []
  const propertyNames = Object.getOwnPropertyNames(subject)
  const keys = internal ? propertyNames.filter(n => n !== 'constructor') : propertyNames
  const proto = Object.getPrototypeOf(subject)
  return proto !== Object.prototype ? keys.concat(getAllKeys(proto, true)) : keys
}
