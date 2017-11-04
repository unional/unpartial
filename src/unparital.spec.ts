import test from 'ava'

import { unpartial } from './index'

interface Config {
  require: { a: number }
  optional?: { a: number }
}
const defaultConfig: Config = { require: { a: 1 } }

test('undefined partial will be ignored', t => {
  t.is(unpartial(undefined as any, undefined), undefined)
  t.is(unpartial(null as any, undefined), null)
  t.deepEqual(unpartial({ a: 1 }, undefined), { a: 1 })

  t.is(unpartial(null as any, null as any, undefined), null)
  t.deepEqual(unpartial({}, undefined, undefined), {})
})

test('undefined base will be ignored', t => {
  t.is(unpartial(undefined as any, null), null)
  t.deepEqual(unpartial(undefined as any, {}), {})

  t.deepEqual(unpartial({}, undefined as any, null), {})
  t.deepEqual(unpartial({}, undefined as any, {}), {})
  t.deepEqual(unpartial({ a: 1 }, undefined as any, { b: 2 }), { a: 1, b: 2 })
})

test('null base will be ignored', t => {
  t.is(unpartial(null as any, null), null)
  t.deepEqual(unpartial(null as any, {}), {})

  t.deepEqual(unpartial({}, null as any, undefined), {})
  t.deepEqual(unpartial({}, null as any, null), {})
  t.deepEqual(unpartial({}, null as any, {}), {})
})

test('undefined superBase returns undefined (in JS)', t => {
  // to avoid unintended error
  t.is(unpartial(undefined as any, undefined as any, undefined), undefined)
  t.is(unpartial(undefined as any, undefined as any, null), undefined)
  t.is(unpartial(undefined as any, undefined as any, {}), undefined)
})

test('null superBase returns null (in JS)', t => {
  t.is(unpartial(null as any, null as any, null), null)
  t.is(unpartial(null as any, null as any, {}), null)
})


test('base and partial are not modified', t => {
  const base = { require: { a: 1 }, optional: { a: 2 } } as Config
  const partial = { require: { a: 3 } }
  const actual = unpartial(base, partial)

  t.deepEqual(base, { require: { a: 1 }, optional: { a: 2 } })
  t.deepEqual(partial, { require: { a: 3 } })
  t.deepEqual(actual, { require: { a: 3 }, optional: { a: 2 } })
})

test('superBase base and partial are not modified', t => {
  const superBase = { require: { a: 1 } }
  const base = { require: { a: 2 }, optional: { a: 3 } } as Config
  const partial = { require: { a: 4 } }
  const actual = unpartial(superBase, base, partial)

  t.deepEqual(superBase, { require: { a: 1 } })
  t.deepEqual(base, { require: { a: 2 }, optional: { a: 3 } })
  t.deepEqual(partial, { require: { a: 4 } })
  t.deepEqual(actual, { require: { a: 4 }, optional: { a: 3 } })
})

test('unpartial a partial config with optional', t => {
  const config = unpartial(defaultConfig, { optional: { a: 2 } })

  // `require` is not optional
  t.is(config.require.a, 1)
  // `optional`is still optional
  t.is(config.optional!.a, 2)
})

test(`optional partial would not affact type`, t => {
  const partial: Partial<Config> | undefined = undefined
  const config = unpartial(defaultConfig, partial)

  // `require` is not optional
  t.is(config.require.a, 1)
  // `optional`is still optional
  t.is(config.optional, undefined)
})

test('specify target interface explicitly', t => {
  const x = unpartial<Config>({ require: { a: 1 } }, {})
  t.is(x.require.a, 1)
})
