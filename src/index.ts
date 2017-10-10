import defaults = require('lodash.defaults')

export function unpartial<T extends object>(base: T, partial: Partial<T>): T
export function unpartial<T extends object, R extends object = any>(superBase: R, base: T, partial: Partial<T>): T
export function unpartial(arg1, arg2, arg3?) {
  if (arg3 !== undefined) {
    const superBase = arg1
    const base = arg2
    const partial = arg3
    if (superBase === undefined || superBase === null)
      return superBase
    if (base === undefined || base === null)
      return base
    return defaults({}, partial, base, superBase)
  }
  else {
    const base = arg1
    const partial = arg2
    if (base === undefined || base === null)
      return base
    return defaults({}, partial, base)
  }
}
