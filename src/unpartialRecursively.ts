import merge = require('lodash.merge')

export function unpartialRecursively<T extends object>(base: T, partial: object | undefined): T
export function unpartialRecursively<T extends object, R extends object = {}>(superBase: R, base: T | undefined, partial: object | undefined): T & R
export function unpartialRecursively(arg1, arg2, arg3?) {
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
    return unpartialRecursively(superBase, partial)

  return merge({}, superBase, base, partial)
}

function unpartialDuo(base, partial) {
  if (partial === undefined)
    return base
  if (base === null || base === undefined)
    return partial

  return merge({}, base, partial)
}
