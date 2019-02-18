import t from 'assert';
import { unpartialRecursively } from './index';

interface Config {
  require: { a: number }
  optional?: { a: number }
}
const defaultConfig: Config = { require: { a: 1 } }


test('undefined partial will be ignored', () => {
  t.strictEqual(unpartialRecursively(undefined as any, undefined), undefined)
  t.strictEqual(unpartialRecursively(null as any, undefined), null)
  t.deepStrictEqual(unpartialRecursively({ a: 1 }, undefined), { a: 1 })

  t.strictEqual(unpartialRecursively(null as any, null as any, undefined), null)
  t.deepStrictEqual(unpartialRecursively({}, undefined, undefined), {})
})

test('undefined base will be ignored', () => {
  t.strictEqual(unpartialRecursively(undefined as any, null as any), null)
  t.deepStrictEqual(unpartialRecursively(undefined as any, {}), {})

  t.deepStrictEqual(unpartialRecursively({}, undefined as any, null as any), {})
  t.deepStrictEqual(unpartialRecursively({}, undefined, undefined), {})
  t.deepStrictEqual(unpartialRecursively({}, undefined as any, {}), {})
  t.deepStrictEqual(unpartialRecursively({ a: 1 }, undefined as any, { b: 2 }), { a: 1, b: 2 })
})

test('null base will be ignored', () => {
  t.strictEqual(unpartialRecursively(null as any, null as any), null)
  t.deepStrictEqual(unpartialRecursively(null as any, {}), {})

  t.deepStrictEqual(unpartialRecursively({}, null as any, undefined), {})
  t.deepStrictEqual(unpartialRecursively({}, null as any, null as any), {})
  t.deepStrictEqual(unpartialRecursively({}, null as any, {}), {})
})

test('undefined superBase returns undefined (in JS)', () => {
  // to avoid unintended error
  t.strictEqual(unpartialRecursively(undefined as any, undefined as any, undefined), undefined)
  t.strictEqual(unpartialRecursively(undefined as any, undefined as any, null as any), undefined)
  t.strictEqual(unpartialRecursively(undefined as any, undefined as any, {}), undefined)
})

test('null superBase returns null (in JS)', () => {
  t.strictEqual(unpartialRecursively(null as any, null as any, undefined), null)
  t.strictEqual(unpartialRecursively(null as any, null as any, null as any), null)
  t.strictEqual(unpartialRecursively(null as any, null as any, {}), null)
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
