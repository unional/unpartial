import t from 'node:assert'
import { assertType, isType } from 'type-plus'
import { required, requiredDeep, unpartial, unpartialRecursively } from './index.js'

type TestSubject = { require: { a: number }, optional?: { a: number } }

describe('unpartial(base, input)', () => {
  it('requires all default fields to be filled in for base', () => {
    type Options = { a: number, b?: number }
    const a = unpartial<Options>({ a: 1 }, {})

    assertType<Options>(a)
  })

  it('allows base to skip optional fields', () => {
    type Options = { a: number, b?: string, c?: boolean }

    const a = unpartial<Options>({ a: 1, b: 'b' }, {})

    assertType<Options>(a)
  })

  it('augments additional types from partial', () => {
    const input: { a?: number, b: string, c?: boolean, d?: { x: number } } = { b: 'b' }
    const a = unpartial({ a: 1 }, input)

    assertType<{ a: number, b: string, c?: boolean | undefined, d?: { x: number } | undefined }>(a)
  })

  it('add optional property type to required property', () => {
    const input: { a?: string } = {}
    const a = unpartial({ a: 1 }, input)

    assertType<{ a: number | string }>(a)
  })

  it('adds type to optional property', () => {
    type Base = { a?: number }
    type Input = { a?: string }
    const base: Base = {}
    const input: Input = {}
    const a = unpartial(base, input)

    assertType<{ a?: number | string }>(a)
  })

  it('returns undefined if base is undefined to avoid unintended error in JS', () => {
    t.strictEqual(unpartial(undefined as any, null), undefined)
  })

  it('returns null if base is null to avoid unintended error in JS', () => {
    t.strictEqual(unpartial(null as any, {} as any), null)
  })

  it('ignores undefined partial', () => {
    expect(unpartial({ a: 1 }, undefined)).toEqual({ a: 1 })
  })

  it('ignores null partial', () => {
    expect(unpartial({ a: 1 }, null)).toEqual({ a: 1 })
  })

  it('picks up value explicitly set to false (eslint rules)', () => {
    type RulesOption = Record<string, boolean | [number, Record<string, any>?]>
    const a = unpartial<RulesOption>({ someRule: [2, { someOption: true }] }, { someRule: false })

    assertType<RulesOption>(a)
    expect(a).toEqual({ someRule: false })
  })

  it('gets type from base', () => {
    const a = unpartial({ a: 1 }, undefined)

    assertType<{ a: number }>(a)
    expect(a).toEqual({ a: 1 })
  })

  it('will not modify base and partial', () => {
    type Base = { require: { a: number }, optional?: { a: number } }
    const base: Base = { require: { a: 1 }, optional: { a: 2 } }
    const partial = { require: { a: 3 } }
    const a = unpartial(base, partial)

    assertType<{ require: { a: number }, optional?: { a: number } | undefined }>(a)
    t.deepStrictEqual(base, { require: { a: 1 }, optional: { a: 2 } })
    t.deepStrictEqual(partial, { require: { a: 3 } })
    t.deepStrictEqual(a, { require: { a: 3 }, optional: { a: 2 } })
  })

  it('detects not optional fields from partial', () => {
    type Options = { b: number, c?: number }
    const options: Options = { b: 2 }
    const a = unpartial({ a: 1 }, options)

    assertType<{ a: number, b: number, c?: number }>(a)
    expect(a).toEqual({ a: 1, b: 2 })
  })

  it('sets value if not defined', () => {
    const a = unpartial({ a: 1 }, {})
    t.strictEqual(a.a, 1)
  })

  it('skips property that explicitly undefined or null', () => {
    const a = unpartial<{ a: number, b: number | null }>(
      { a: 1, b: 2 },
      { a: undefined, b: null })
    expect(a).toEqual({ a: 1, b: 2 })
  })

  it('works with optional type', () => {
    type Input = { a: number, b?: number } | undefined
    const i = undefined as Input
    const a = unpartial({ b: 2 }, i)
    isType.equal<true, { a: number, b: number }, typeof a>()
  })

  it('keeps optional props optional', () => {
    type Options = { a: number, b?: number }
    type Input = Partial<Options>
    const base: Options = { a: 1 }
    const input: Input = {}
    const a = unpartial(base, input)
    isType.equal<true, Options, typeof a>()
  })

  it('will not merge deeply', () => {
    const a = unpartial({ a: { b: 1 } }, { a: { c: 2 } })

    isType.equal<false, { a: { b: number, c: number } }, typeof a>()
    isType.equal<true, { a: { b: number } | { c: number } }, typeof a>()
  })

  it('do not contain `Pick<>` when not necessary', () => {
    // This test always pass, need to inspect directly
    const a = unpartial({ a: { a: 1 } }, { a: { b: 2 } })
    assertType<{ a: { a: number } | { b: number } }>(a)
  })
})

describe('unpartial(parent, base, partial)', () => {
  it('ignores undefined base or partial', () => {
    expect(unpartial({ a: 1 }, undefined, undefined)).toEqual({ a: 1 })
    expect(unpartial({ a: 1 }, undefined, { num: 2 })).toEqual({ a: 1, num: 2 })
    expect(unpartial({ a: 1 }, { num: 2 }, undefined)).toEqual({ a: 1, num: 2 })
  })
  it('ignores null base or partial', () => {
    expect(unpartial({ a: 1 }, null, null)).toEqual({ a: 1 })
    expect(unpartial({ a: 1 }, null, { num: 2 })).toEqual({ a: 1, num: 2 })
    expect(unpartial({ a: 1 }, { num: 2 }, null)).toEqual({ a: 1, num: 2 })
  })
  it('will not modify parent, base, and partial', () => {
    const parent = { require: { a: 1 } }
    const base = { require: { a: 2 }, optional: { a: 3 } } as TestSubject
    const input = { require: { a: 4 } }
    const actual = unpartial(parent, base, input)

    t.deepStrictEqual(parent, { require: { a: 1 } })
    t.deepStrictEqual(base, { require: { a: 2 }, optional: { a: 3 } })
    t.deepStrictEqual(input, { require: { a: 4 } })
    t.deepStrictEqual(actual, { require: { a: 4 }, optional: { a: 3 } })
  })
  it('gets type from parent, base, and input', () => {
    const a = unpartial({ a: 1 }, unpartial({ b: 2 }, { c: 3 }))
    assertType<{ a: number, b: number, c: number }>(a)
    expect(a).toEqual({ a: 1, b: 2, c: 3 })
  })

  it('can specify the base type', () => {
    type ParentOptions = { a: number }
    type Base = ParentOptions & { b: number, c?: { d?: boolean } }
    type Input = Partial<Base> | undefined
    const p = { a: 1 } as ParentOptions
    const b = { b: 2 } as Base
    const i = { c: { d: true } } as Input
    const a = unpartial<Base>(unpartial(p, b), i)

    assertType<Base>(a)

    expect(a.a).toEqual(1)
    expect(a.b).toEqual(2)
    expect(a.c?.d).toEqual(true)
  })
  it('combine parent and base', () => {
    type Parent = { a: number }
    type Base = Parent & { b: number, c?: boolean }
    type Input = Partial<Base>
    const p = { a: 1 } as Parent
    const i = {} as Input
    const a = required<Base>(p, { b: 2 }, i)

    assertType<Base>(a)
    isType.equal<true, Base, typeof a>()
  })
})

describe('unpartialRecursively()', () => {
  interface Config {
    require: { a: number },
    optional?: { a: number }
  }
  const defaultConfig: Config = { require: { a: 1 } }

  test('undefined partials will be ignored', () => {
    t.deepStrictEqual(unpartialRecursively({ a: 1 }, undefined), { a: 1 })
    t.deepStrictEqual(unpartialRecursively({ a: 1 }, undefined, undefined), { a: 1 })
    t.deepStrictEqual(unpartialRecursively({ a: { b: 2 } }, undefined, { a: { b: 3 } }), { a: { b: 3 } })
    t.deepStrictEqual(unpartialRecursively({ a: 1 }, null as any, undefined), { a: 1 })
  })

  test('null partials will be ignored', () => {
    t.deepStrictEqual(unpartialRecursively({ a: 1 }, null as any), { a: 1 })
    t.deepStrictEqual(unpartialRecursively({ a: 1 }, undefined, null as any), { a: 1 })
    t.deepStrictEqual(unpartialRecursively({ a: { b: 2 } }, null as any, { a: { b: 3 } }), { a: { b: 3 } })
    t.deepStrictEqual(unpartialRecursively({ a: 1 }, null as any, undefined), { a: 1 })
  })

  test('undefined first argument returns undefined to avoid unintended error (for JS)', () => {
    t.strictEqual(unpartialRecursively(undefined as any, {}), undefined)
    t.strictEqual(unpartialRecursively(undefined as any, undefined, {}), undefined)
  })

  test('null first argument returns null to avoid unintended error (in JS)', () => {
    t.strictEqual(unpartialRecursively(null as any, {}), null)
    t.strictEqual(unpartialRecursively(null as any, undefined, {}), null)
  })

  test('base and partial are not modified', () => {
    const base = { require: { a: 1 }, optional: { a: 2 } } as Config
    const partial = { require: { a: 3 } }
    const actual = unpartialRecursively(base, partial)

    t.deepStrictEqual(base, { require: { a: 1 }, optional: { a: 2 } })
    t.deepStrictEqual(partial, { require: { a: 3 } })
    t.deepStrictEqual(actual, { require: { a: 3 }, optional: { a: 2 } })
  })

  test('superBase base and partial are not modified', () => {
    const superBase = { require: { a: 1 } }
    const base = { require: { a: 2 }, optional: { a: 3 } } as Config
    const partial = { require: { a: 4 } }
    const actual = unpartialRecursively(superBase, base, partial)

    t.deepStrictEqual(superBase, { require: { a: 1 } })
    t.deepStrictEqual(base, { require: { a: 2 }, optional: { a: 3 } })
    t.deepStrictEqual(partial, { require: { a: 4 } })
    t.deepStrictEqual(actual, { require: { a: 4 }, optional: { a: 3 } })
  })

  test('partial config with optional', () => {
    const config = unpartialRecursively(defaultConfig, { optional: { a: 2 } })

    // `require` is not optional
    t.strictEqual(config.require.a, 1)
    // `optional`is still optional
    t.strictEqual(config.optional!.a, 2)
  })

  test('specify target interface explicitly', () => {
    const x = unpartialRecursively<Config>({ require: { a: 1 } }, {})
    t.strictEqual(x.require.a, 1)
  })

  test('will merge inner object', () => {
    interface DeepConfig {
      require: {
        a: {
          b: number,
          c?: string
        }
      }
    }
    const given = { require: { a: { c: 'c' } } } as DeepConfig

    const actual = unpartialRecursively<DeepConfig>({ require: { a: { b: 1 } } }, given)

    t.deepStrictEqual(actual, { require: { a: { b: 1, c: 'c' } } })
  })
})

describe('required()', () => {
  test('none of the inputs are modified', () => {
    const source1 = { a: 1 }
    const source2 = { b: 2 }
    const source3 = { c: 3 }
    required(source1, source2, source3)

    expect(source1).toEqual({ a: 1 })
    expect(source2).toEqual({ b: 2 })
    expect(source3).toEqual({ c: 3 })
  })

  test('source2 can be undefined', () => {
    const actual = required({ a: 1 }, undefined)

    assertType<{ a: number }>(actual)
    expect(actual).toEqual({ a: 1 })
  })

  test('source2 can be null', () => {
    const actual = required({ a: 1 }, null)

    assertType<{ a: number }>(actual)
    expect(actual).toEqual({ a: 1 })
  })

  test('source3 can be undefined', () => {
    const actual = required({ a: 1 }, undefined, undefined)

    assertType<{ a: number }>(actual)
    expect(actual).toEqual({ a: 1 })
  })

  test('source3 can be null', () => {
    const actual = required({ a: 1 }, null, null)

    assertType<{ a: number }>(actual)
    expect(actual).toEqual({ a: 1 })
  })

  type Source1 = {
    a: string,
    b: number,
    c: { d: boolean },
    e?: string
  }

  test('can access types in source1', () => {
    const source1: Partial<Source1> = { a: 'a', b: 2, c: { d: true } }

    const actual = required(source1, {})

    assertType<Source1>(actual)
    expect(actual.a).toEqual('a')
    expect(actual.b).toEqual(2)
    expect(actual.c.d).toEqual(true)
    actual.e = undefined
  })

  type Source2 = {
    p: string,
    q: number,
    r: { s: boolean },
    t?: string
  }

  test('can access types in source2', () => {
    const source1: Partial<Source1> = { a: 'a', b: 2, c: { d: true } }
    const source2: Partial<Source2> = { p: 'p', q: 2, r: { s: true } }

    const actual = required(source1, source2)

    assertType<Source1 & Source2>(actual)
    expect(actual.p).toEqual('p')
    expect(actual.q).toEqual(2)
    expect(actual.r.s).toEqual(true)
    actual.t = undefined
  })

  type Source3 = {
    w: string,
    x: number,
    y: { z: boolean },
    u?: string
  }

  test('can access types in source3', () => {
    const source1: Partial<Source1> = { a: 'a', b: 2, c: { d: true } }
    const source2: Partial<Source2> = { p: 'p', q: 2, r: { s: true } }
    const source3: Partial<Source3> = { w: 'w', x: 2, y: { z: true } }

    const actual = required(source1, source2, source3)

    assertType<Source1 & Source2 & Source3>(actual)
    expect(actual.w).toEqual('w')
    expect(actual.x).toEqual(2)
    expect(actual.y.z).toEqual(true)
    actual.u = undefined
  })

  test('can explicitly specify target type', () => {
    const actual = required<Source1>({ a: 'a' }, { b: 2 }, { c: { d: true } })

    assertType<Source1>(actual)
    expect(actual.a).toEqual('a')
    expect(actual.b).toEqual(2)
    expect(actual.c.d).toEqual(true)
    actual.e = undefined
  })

  it('applies default value for not specified property', () => {
    type A = { a?: string }
    const actual = required<A>({ a: 'a' }, {})
    expect(actual.a).toEqual('a')
  })

  it('preserves explicit undefined property', () => {
    type A = { a?: string }
    const actual = required<A>({ a: 'a' }, { a: undefined })
    expect(actual.a).toEqual(undefined)
  })
})

describe('requiredDeep()', () => {
  test('merge class instance', () => {
    class Foo {
      a = 1
      c(this: void) {
        return 3
      }
    }

    class Boo extends Foo {
      d(this: void) { return 4 }
    }
    const boo = new Boo()
    const actual = requiredDeep({ a: { b: { x: 1 } } }, undefined, { a: { b: boo } })
    expect(actual).toEqual({
      a: {
        b: {
          a: 1,
          x: 1,
          c: boo.c,
          d: boo.d
        }
      }
    })
  })

  test('override array', () => {
    const actual = requiredDeep({ a: [1] }, { a: [2] })
    expect(actual).toEqual({ a: [2] })
  })

  test('value add to array', () => {
    expect(requiredDeep({ a: [1] }, { a: 2 })).toEqual({ a: [1, 2] })
  })

  test('empty string overrides', () => {
    expect(requiredDeep({ a: { b: 'b' } }, { a: { b: '' } })).toEqual({ a: { b: '' } })
  })

  test('undefined property not added to array', () => {
    expect(requiredDeep({ a: [1] }, {})).toEqual({ a: [1] })
  })
})
