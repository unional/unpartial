export function required<
  T extends object,
  R extends object = {},
  S extends object = {}
>(source1: Partial<T>, source2: Partial<R> | undefined | null, source3?: Partial<S> | null): T & R & S {
  let result = {}
  const entries = [source1, source2, source3].filter(x => !!x)
  entries.forEach(e => result = { ...result, ...e })
  return result as any
}
