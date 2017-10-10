import defaults = require('lodash.defaults')

export function unpartial<T extends object>(base: T, partial: Partial<T>): T {
  if (base === undefined || base === null)
    return base
  return defaults({}, partial, base)
}
