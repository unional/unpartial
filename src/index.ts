import defaults = require('lodash.defaults')

// `partial: Partial<T> | undefined` is better than `partial?: Partial<T>` in this case.
// I want to make sure `partial` is passed in, while it can be optional, i.e. undefined, at caller context.
export function unpartial<T extends object>(base: T, partial: Partial<T> | undefined): T
export function unpartial<T extends object, R extends object = {}>(superBase: R, base: T, partial: Partial<T> | undefined): T & R
export function unpartial(arg1, arg2, arg3?) {
  if (arguments.length === 3) {
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
