import test from 'ava'

import { unpartial } from './index'

interface Config {
  require: { a: number }
  optional?: { a: number }
}
const defaultConfig: Config = { require: { a: 1 } }

test('undefined base returns undefined (in JS)', t => {
  // to avoid unintended error
  t.is(unpartial(undefined as any, undefined), undefined)
  t.is(unpartial(undefined as any, null), undefined)
  t.is(unpartial(undefined as any, {}), undefined)

  t.is(unpartial({}, undefined as any, undefined), undefined)
  t.is(unpartial({}, undefined as any, null), undefined)
  t.is(unpartial({}, undefined as any, {}), undefined)
})

test('null base returns null (in JS)', t => {
  // to avoid unintended error
  t.is(unpartial(null as any, undefined), null)
  t.is(unpartial(null as any, null), null)
  t.is(unpartial(null as any, {}), null)

  t.is(unpartial({}, null as any, undefined), null)
  t.is(unpartial({}, null as any, null), null)
  t.is(unpartial({}, null as any, {}), null)
})

test('undefined superBase returns undefined (in JS)', t => {
  // to avoid unintended error
  t.is(unpartial(undefined as any, undefined as any, undefined), undefined)
  t.is(unpartial(undefined as any, undefined as any, null), undefined)
  t.is(unpartial(undefined as any, undefined as any, {}), undefined)
})

test('null superBase returns null (in JS)', t => {
  t.is(unpartial(null as any, null as any, undefined), null)
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

test('specify target interface explicitly', t => {
  const x = unpartial<Config>({ require: { a: 1 } }, {})
  t.is(x.require.a, 1)
})
