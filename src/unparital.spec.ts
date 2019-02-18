import t from 'assert';
import { unpartial } from '.';

interface Config {
  require: { a: number }
  optional?: { a: number }
}
const defaultConfig: Config = { require: { a: 1 } }

test('undefined partial will be ignored', () => {
  t.strictEqual(unpartial(undefined as any, undefined), undefined)
  t.strictEqual(unpartial(null as any, undefined), null)
  t.deepStrictEqual(unpartial({ a: 1 }, undefined), { a: 1 })

  t.strictEqual(unpartial(null as any, null as any, undefined), null)
  t.deepStrictEqual(unpartial({}, undefined, undefined), {})
})

test('undefined base will be ignored', () => {
  t.strictEqual(unpartial(undefined as any, null as any), null)
  t.deepStrictEqual(unpartial(undefined as any, {}), {})

  t.deepStrictEqual(unpartial({}, undefined as any, null as any), {})
  t.deepStrictEqual(unpartial({}, undefined as any, {}), {})
  t.deepStrictEqual(unpartial({ a: 1 }, undefined as any, { b: 2 }), { a: 1, b: 2 })
})

test('null base will be ignored', () => {
  t.strictEqual(unpartial(null as any, null as any), null)
  t.deepStrictEqual(unpartial(null as any, {}), {})

  t.deepStrictEqual(unpartial({}, null as any, undefined), {})
  t.deepStrictEqual(unpartial({}, null as any, null as any), {})
  t.deepStrictEqual(unpartial({}, null as any, {}), {})
})

test('undefined superBase returns undefined (in JS)', () => {
  // to avoid unintended error
  t.strictEqual(unpartial(undefined as any, undefined as any, undefined), undefined)
  t.strictEqual(unpartial(undefined as any, undefined as any, null as any), undefined)
  t.strictEqual(unpartial(undefined as any, undefined as any, {}), undefined)
})

test('null superBase returns null (in JS)', () => {
  t.strictEqual(unpartial(null as any, null as any, null as any), null)
  t.strictEqual(unpartial(null as any, null as any, {}), null)
})


test('base and partial are not modified', () => {
  const base = { require: { a: 1 }, optional: { a: 2 } } as Config
  const partial = { require: { a: 3 } }
  const actual = unpartial(base, partial)

  t.deepStrictEqual(base, { require: { a: 1 }, optional: { a: 2 } })
  t.deepStrictEqual(partial, { require: { a: 3 } })
  t.deepStrictEqual(actual, { require: { a: 3 }, optional: { a: 2 } })
})

test('superBase base and partial are not modified', () => {
  const superBase = { require: { a: 1 } }
  const base = { require: { a: 2 }, optional: { a: 3 } } as Config
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

test(`optional partial would not affact type`, () => {
  const partial: Partial<Config> | undefined = undefined
  const config = unpartial(defaultConfig, partial)

  // `require` is not optional
  t.strictEqual(config.require.a, 1)
  // `optional`is still optional
  t.strictEqual(config.optional, undefined)
})

test('specify target interface explicitly', () => {
  const x = unpartial<Config>({ require: { a: 1 } }, {})
  t.strictEqual(x.require.a, 1)
})
