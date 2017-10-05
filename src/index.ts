import defaults = require('lodash.defaults')

export function unpartial<T extends object, U, R extends object>(obj: U, src1: T, src2?: R): T & R {
  if (src1 === undefined || src1 === null)
    return obj as any
  return defaults(obj, src1, src2)
}
