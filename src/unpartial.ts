import { required, requiredDeep } from './required';

export function unpartial<T extends Record<string | number | symbol, any>>(base: T, partial: Partial<T> | undefined): T
export function unpartial<T extends Record<string | number | symbol, any>, R extends Record<string | number | symbol, any> = Record<string | number | symbol, any>>(superBase: R, base: T | undefined, partial: Partial<T> | undefined): T & R
export function unpartial(arg1: any, arg2: any, arg3?: any) {
  return required(arg1, arg2, arg3)
}

export function unpartialRecursively<T extends object>(base: T, partial: object | undefined): T
export function unpartialRecursively<T extends object, R extends object = {}>(superBase: R, base: T | undefined, partial: object | undefined): T & R
export function unpartialRecursively(arg1: any, arg2: any, arg3?: any) {
  return requiredDeep(arg1, arg2, arg3)
}
