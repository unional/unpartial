import { required, requiredDeep } from './required.js'

export function unpartial<
  T extends Record<string | number | symbol, any>
>(base: T, partial: Partial<T> | undefined): T
export function unpartial<
  T extends Record<string | number | symbol, any>,
  R extends Record<string | number | symbol, any> = Record<string | number | symbol, any>
>(superBase: R, base: T | undefined, partial: Partial<T> | undefined): T & R
export function unpartial(arg1: any, arg2: any, arg3?: any) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return required(arg1, arg2, arg3)
}

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
