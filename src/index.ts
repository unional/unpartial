import merge = require('lodash.merge')

// `partial: Partial<T> | undefined` is better than `partial?: Partial<T>` in this case.
// I want to make sure `partial` is passed in, while it can be optional, i.e. undefined, at caller context.
export function unpartial<T extends object>(base: T, partial: Partial<T> | undefined): T
export function unpartial<T extends object, R extends object = {}>(superBase: R, base: T | undefined, partial: Partial<T> | undefined): T & R
export function unpartial(arg1, arg2, arg3?) {
  if (arguments.length === 3) {
    return unpartialTrio(arg1, arg2, arg3)
  }
  else {
    return unpartialDuo(arg1, arg2)
  }
}

function unpartialTrio(superBase, base, partial) {
  if (superBase === undefined || superBase === null)
    return superBase

  if (base === undefined || base === null)
    return unpartial(superBase, partial)

  return merge({}, superBase, base, partial)
}

function unpartialDuo(base, partial) {
  if (partial === undefined || partial === null)
    return partial

  return merge({}, base, partial)
}
