export type OptionalKeys<O extends Record<keyof any, any>> = O extends unknown
  ? OptionalKeys._<O>
  : never

export namespace OptionalKeys {
  export type _<O extends Record<keyof any, any>> = {
    [K in keyof O]-?: Record<keyof any, any> extends Pick<O, K>
    ? K
    : never
  }[keyof O]
}


export type RequiredKeys<T extends Record<keyof any, any>> = T extends unknown
  ? RequiredKeys._<T> : never

export namespace RequiredKeys {
  export type _<T extends Record<keyof any, any>> = Exclude<keyof T, OptionalKeys._<T>>
}
