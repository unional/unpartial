import t from 'assert'
import { assertType, CanAssign, isType } from 'type-plus'
import { unpartial, unpartialRecursively } from './index.js'

type Subject = {
  num: number,
  str: string,
  onum?: number,
  ostr?: string,
  unum: number | undefined,
  ustr: string | undefined,
  obj: {
    num: number,
    str: string,
    onum?: number,
    ostr?: string,
    unum: number | undefined,
    ustr: string | undefined,
  },
  oobj?: {
    num: number,
    str: string,
    onum?: number,
    ostr?: string,
    unum: number | undefined,
    ustr: string | undefined,
  },
  uobj: {
    num: number,
    str: string,
    onum?: number,
    ostr?: string,
    unum: number | undefined,
    ustr: string | undefined,
  } | undefined,
}

const defaultOptions = {
  num: 1,
  obj: { num: 2, str: 'a', unum: undefined, ustr: undefined },
  str: 'b',
  unum: undefined,
  uobj: undefined,
  ustr: undefined
}

type TestSubject = { require: { a: number }, optional?: { a: number } }

describe('unpartial(base, partial)', () => {
  it('requires all default fields to be filled in for base', () => {
    const a = unpartial<Subject>({
      num: 1,
      obj: { num: 2, str: 'a', unum: undefined, ustr: undefined },
      str: 'b',
      unum: undefined,
      uobj: undefined,
      ustr: undefined
    }, undefined)
    expect(a).toEqual({
      num: 1,
      obj: { num: 2, str: 'a', unum: undefined, ustr: undefined },
      str: 'b',
      unum: undefined,
      uobj: undefined,
      ustr: undefined
    })

    isType.equal<true, true, CanAssign<typeof a, Subject>>()
  })

  it('allows base to skip optional fields', () => {
    type Options = { a: number, b?: string, c?: boolean }

    const a = unpartial<Options>({ a: 1, b: 'b' }, {})

    isType.equal<true, true, CanAssign<typeof a, Options>>()
  })

  it('augments additional types from partial', () => {
    const partial: { a?: number, b?: string, c?: boolean, d?: { x: number } } = {}
    const a = unpartial({ a: 1 }, partial)

    isType.equal<
      true,
      { a: number, b: string | undefined, c: boolean | undefined, d: { x: number } | undefined },
      typeof a
    >()
  })

  it('returns undefined if base is undefined to avoid unintended error in JS', () => {
    t.strictEqual(unpartial<Subject>(undefined as any, null), undefined)
  })

  it('returns null if base is null to avoid unintended error in JS', () => {
    t.strictEqual(unpartial<Subject>(null as any, {} as any), null)
  })

  it('ignores undefined partial', () => {
    expect(unpartial(defaultOptions, undefined)).toEqual(defaultOptions)
  })
  it('ignores null partial', () => {
    expect(unpartial(defaultOptions, null)).toEqual(defaultOptions)
  })

  it('handles property explicitly set to false (eslint rules)', () => {
    type RulesOption = Record<string, boolean | [number, Record<string, any>?]>
    const a = unpartial<RulesOption>({ someRule: [2, { someOption: true }] }, { someRule: false })
    expect(a).toEqual({ someRule: false })
  })

  it('gets type from base', () => {
    const a = unpartial({ a: 1 }, undefined)
    expect(a).toEqual({ a: 1 })
    isType.equal<true, true, CanAssign<{ a: number }, typeof a>>()
  })

  it('will not modify base and partial', () => {
    const base = { require: { a: 1 }, optional: { a: 2 } } as TestSubject
    const partial = { require: { a: 3 } }
    const actual = unpartial(base, partial)

    t.deepStrictEqual(base, { require: { a: 1 }, optional: { a: 2 } })
    t.deepStrictEqual(partial, { require: { a: 3 } })
    t.deepStrictEqual(actual, { require: { a: 3 }, optional: { a: 2 } })
  })

  it('detects  not optional fields from partial', () => {
    type Options = { b: number, c?: number }
    const options: Options = { b: 2 }
    const config = unpartial({ a: 1 }, options)

    expect(config).toEqual({ a: 1, b: 2 })

    assertType<{ a: number, b: number, c?: number }>(config)
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
})

describe('unpartial(parent, base, partial)', () => {
  it('ignores undefined base or partial', () => {
    expect(unpartial<Subject>(defaultOptions, undefined, undefined)).toEqual(defaultOptions)
    expect(unpartial<Subject>(defaultOptions, undefined, { num: 2 })).toEqual({ ...defaultOptions, num: 2 })
    expect(unpartial<Subject>(defaultOptions, { num: 2 }, undefined)).toEqual({ ...defaultOptions, num: 2 })
  })
  it('ignores null base or partial', () => {
    expect(unpartial<Subject>(defaultOptions, null, null)).toEqual(defaultOptions)
    expect(unpartial<Subject>(defaultOptions, null, { num: 2 })).toEqual({ ...defaultOptions, num: 2 })
    expect(unpartial<Subject>(defaultOptions, { num: 2 }, null)).toEqual({ ...defaultOptions, num: 2 })
  })
  it('will not modify parent, base, and partial', () => {
    const superBase = { require: { a: 1 } }
    const base = { require: { a: 2 }, optional: { a: 3 } } as TestSubject
    const partial = { require: { a: 4 } }
    const actual = unpartial(superBase, base, partial)

    t.deepStrictEqual(superBase, { require: { a: 1 } })
    t.deepStrictEqual(base, { require: { a: 2 }, optional: { a: 3 } })
    t.deepStrictEqual(partial, { require: { a: 4 } })
    t.deepStrictEqual(actual, { require: { a: 4 }, optional: { a: 3 } })
  })
  it('gets type from base and partial', () => {
    const a = unpartial({ a: 1 }, { b: 2 }, { c: 3 })
    expect(a).toEqual({ a: 1, b: 2, c: 3 })
    assertType<{ a: number, b: number, c: number }>(a)
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
