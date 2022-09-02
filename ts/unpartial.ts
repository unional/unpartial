import { requiredDeep } from './required.js'

export function unpartialRecursively<
  T extends Record<string, any>
>(base: T, partial: Record<string, any> | undefined): T
export function unpartialRecursively<
  T extends Record<string, any>,
  R extends Record<string, any> = Record<string, any>
>(superBase: R, base: T | undefined, partial: Record<string, unknown> | undefined): T & R
export function unpartialRecursively(arg1: any, arg2: any, arg3?: any) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return requiredDeep(arg1, arg2, arg3)
}

/**
 * Unpartial a partial type.
 * @type T Type of `base`. If not specified, it will be inferred from `base`.
 * @param base The base value to fill in needed property if not available in the `partial` value.
 * @param partial The partial value to be unpartialed.
 */
export function unpartial<
  T extends Record<any, any>,
  R extends Record<any, any> = Partial<T>
>(base: T, partial: R | undefined | null): { [k in keyof T | keyof R]: R[k] & T[k] }
/**
 * Unpartial a partial type with two base values.
 * This is useful when you are extending value from another package or code.
 * That means you have a `parent` value from the original code,
 * a `base` value where you add additional defaults or override existing one,
 * and `partial` value from input.
 * @type R Type of `base`. This type will be used as the return type.
 * @param parent The default value from the original code.
 * @param base The extended default value of your code.
 * @param partial The input value.
 */
export function unpartial<
  T extends Record<any, any>,
  R extends Record<any, any> = Partial<T>,
  S extends Record<any, any> = Partial<T & R>
>(parent: T, base: R | undefined | null, partial: S | undefined | null): { [k in keyof T | keyof R | keyof S]: S[k] & R[k] & T[k] }
export function unpartial(s1: any, s2: any, s3?: any) {
  // defensive check for JS
  if (s1 === undefined || s1 === null) return s1
  return [s1, s2, s3]
    .filter(notNil)
    .reduce((p, s: any) => ({ ...p, ...trimNilProps(s) }), {} as any)
}

function trimNilProps(value: any) {
  return Object.keys(value).reduce((p, k) => {
    if (notNil(value[k])) p[k] = value[k]
    return p
  }, {} as any)
}

function notNil(value: any) {
  return value !== null && value !== undefined
}
