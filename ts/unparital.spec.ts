import t from 'assert'
import { isType } from 'type-plus'
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

describe('unpartial2()', () => {
  it('requires all default fields to be filled in for source1', () => {
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
  })

  it('returns undefined if source1 is undefined to avoid unintended error in JS', () => {
    t.strictEqual(unpartial<Subject>(undefined as any, null), undefined)
  })

  it('returns null if source1 is null to avoid unintended error in JS', () => {
    t.strictEqual(unpartial<Subject>(null as any, {} as any), null)
  })

  it('ignores undefined source 2 or 3', () => {
    expect(unpartial<Subject>(defaultOptions, undefined)).toEqual(defaultOptions)
    expect(unpartial<Subject>(defaultOptions, undefined, undefined)).toEqual(defaultOptions)
    expect(unpartial<Subject>(defaultOptions, undefined, { num: 2 })).toEqual({ ...defaultOptions, num: 2 })
    expect(unpartial<Subject>(defaultOptions, { num: 2 }, undefined)).toEqual({ ...defaultOptions, num: 2 })
  })
  it('ignores null source 2 or 3', () => {
    expect(unpartial<Subject>(defaultOptions, null)).toEqual(defaultOptions)
    expect(unpartial<Subject>(defaultOptions, null, null)).toEqual(defaultOptions)
    expect(unpartial<Subject>(defaultOptions, null, { num: 2 })).toEqual({ ...defaultOptions, num: 2 })
    expect(unpartial<Subject>(defaultOptions, { num: 2 }, null)).toEqual({ ...defaultOptions, num: 2 })
  })

  it('handles property explicitly set to false (eslint rules)', () => {
    type RulesOption = Record<string, boolean | [number, Record<string, any>?]>
    const a = unpartial<RulesOption>({ someRule: [2, { someOption: true }] }, { someRule: false })
    expect(a).toEqual({ someRule: false })
  })

  it('gets type from source 1', () => {
    const a = unpartial({ a: 1 }, undefined)
    expect(a).toEqual({ a: 1 })
    isType.equal<true, { a: number }, typeof a>()
  })
  it('acceps undefined and null in source 2 and 3', () => {
    expect(unpartial(defaultOptions, undefined)).toEqual(defaultOptions)
    expect(unpartial(defaultOptions, null)).toEqual(defaultOptions)
    expect(unpartial(defaultOptions, undefined, undefined)).toEqual(defaultOptions)
    expect(unpartial(defaultOptions, undefined, null)).toEqual(defaultOptions)
  })
  type TestSubject = { require: { a: number }, optional?: { a: number } }
  const defaultConfig: TestSubject = { require: { a: 1 } }
  it('will not modify source 1 and 2', () => {
    const base = { require: { a: 1 }, optional: { a: 2 } } as TestSubject
    const partial = { require: { a: 3 } }
    const actual = unpartial(base, partial)

    t.deepStrictEqual(base, { require: { a: 1 }, optional: { a: 2 } })
    t.deepStrictEqual(partial, { require: { a: 3 } })
    t.deepStrictEqual(actual, { require: { a: 3 }, optional: { a: 2 } })
  })
  it('will not modify source 1, 2, and 3', () => {
    const superBase = { require: { a: 1 } }
    const base = { require: { a: 2 }, optional: { a: 3 } } as TestSubject
    const partial = { require: { a: 4 } }
    const actual = unpartial(superBase, base, partial)

    t.deepStrictEqual(superBase, { require: { a: 1 } })
    t.deepStrictEqual(base, { require: { a: 2 }, optional: { a: 3 } })
    t.deepStrictEqual(partial, { require: { a: 4 } })
    t.deepStrictEqual(actual, { require: { a: 4 }, optional: { a: 3 } })
  })
  it('unpartial a partial config with optional', () => {
    const config = unpartial(defaultConfig, { optional: { a: 2 } })

    expect(config).toEqual({ require: defaultConfig.require, optional: { a: 2 } })
    // `require` is not optional
    t.strictEqual(config.require.a, 1)
    // `optional`is still optional
    t.strictEqual(config.optional!.a, 2)

    isType.equal<true, TestSubject, typeof config>()
  })
  it(`will not affect return type from source 2`, () => {
    const partial: Partial<TestSubject> | undefined = undefined
    const config = unpartial(defaultConfig, partial)

    // `require` is not optional
    t.strictEqual(config.require.a, 1)
    // `optional`is still optional
    t.strictEqual(config.optional, undefined)

    isType.equal<true, TestSubject, typeof config>()
  })
  it('sets value if not defined', () => {
    const a = unpartial({ a: 1 }, {})
    t.strictEqual(a.a, 1)
  })

  it('skips property that explicitly undefined or null', () => {
    const a = unpartial<{ a: number, b: number | null }>({ a: 1, b: 2 }, { a: undefined, b: null })
    expect(a).toEqual({ a: 1, b: 2 })
  })

  it('gets type from source 2 when in superBase, base, partial use case', () => {
    unpartial(defaultOptions, { newField: 1 }, { newField: 2 })
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
