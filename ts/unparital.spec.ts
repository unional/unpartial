/* eslint-disable @typescript-eslint/no-unsafe-argument */
import t from 'assert'
import { unpartial, unpartialRecursively } from '.'

describe('unpartial()', () => {
  interface TestSubject {
    require: { a: number },
    optional?: { a: number }
  }

  const defaultConfig: TestSubject = { require: { a: 1 } }
  test('undefined partials will be ignored', () => {
    t.deepStrictEqual(unpartial({ a: 1 }, undefined), { a: 1 })
    t.deepStrictEqual(unpartial({ a: 1 }, undefined, undefined), { a: 1 })
    t.deepStrictEqual(unpartial({ a: 1 }, undefined, { b: 2 }), { a: 1, b: 2 })
  })

  test('null partials will be ignored', () => {
    t.deepStrictEqual(unpartial({}, null as any, undefined), {})
    t.deepStrictEqual(unpartial({}, null as any, null as any), {})
    t.deepStrictEqual(unpartial({}, null as any, {}), {})
  })

  test('undefined first argument returns undefined to avoid unintended error (for JS)', () => {
    t.strictEqual(unpartial(undefined as any, {}), undefined)
    t.strictEqual(unpartial(undefined as any, undefined, {}), undefined)
  })

  test('null first argument returns null to avoid unintended error (in JS)', () => {
    t.strictEqual(unpartial(null as any, {}), null)
    t.strictEqual(unpartial(null as any, undefined, {}), null)
  })

  test('base and partial are not modified', () => {
    const base = { require: { a: 1 }, optional: { a: 2 } } as TestSubject
    const partial = { require: { a: 3 } }
    const actual = unpartial(base, partial)

    t.deepStrictEqual(base, { require: { a: 1 }, optional: { a: 2 } })
    t.deepStrictEqual(partial, { require: { a: 3 } })
    t.deepStrictEqual(actual, { require: { a: 3 }, optional: { a: 2 } })
  })

  test('superBase base and partial are not modified', () => {
    const superBase = { require: { a: 1 } }
    const base = { require: { a: 2 }, optional: { a: 3 } } as TestSubject
    const partial = { require: { a: 4 } }
    const actual = unpartial(superBase, base, partial)

    t.deepStrictEqual(superBase, { require: { a: 1 } })
    t.deepStrictEqual(base, { require: { a: 2 }, optional: { a: 3 } })
    t.deepStrictEqual(partial, { require: { a: 4 } })
    t.deepStrictEqual(actual, { require: { a: 4 }, optional: { a: 3 } })
  })

  test('unpartial a partial config with optional', () => {
    const config = unpartial(defaultConfig, { optional: { a: 2 } })

    // `require` is not optional
    t.strictEqual(config.require.a, 1)
    // `optional`is still optional
    t.strictEqual(config.optional!.a, 2)
  })

  test(`optional partial would not affect type`, () => {
    const partial: Partial<TestSubject> | undefined = undefined
    const config = unpartial(defaultConfig, partial)

    // `require` is not optional
    t.strictEqual(config.require.a, 1)
    // `optional`is still optional
    t.strictEqual(config.optional, undefined)
  })

  test('specify target interface explicitly', () => {
    const x = unpartial<TestSubject>({ require: { a: 1 } }, {})
    t.strictEqual(x.require.a, 1)
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
    const given = { require: { a: { c: 'c' } } } as DeepConfig;

    const actual = unpartialRecursively<DeepConfig>({ require: { a: { b: 1 } } }, given)

    t.deepStrictEqual(actual, { require: { a: { b: 1, c: 'c' } } })
  })
})
