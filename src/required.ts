import deepmerge from 'deepmerge'

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
