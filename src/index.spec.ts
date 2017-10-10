import test from 'ava'

import { unpartial } from './index'

interface Config {
  require: { a: number }
  optional?: { a: number }
}
const defaultConfig: Config = { require: { a: 1 } }

test('undefined base returns undefined (in JS)', t => {
  t.is(unpartial(undefined as any, undefined), undefined)
  t.is(unpartial(undefined as any, null), undefined)
  t.is(unpartial(undefined as any, {}), undefined)
})

test('null base returns null (in JS)', t => {
  t.is(unpartial(null as any, undefined), null)
  t.is(unpartial(null as any, null), null)
  t.is(unpartial(null as any, {}), null)
})

test('base and partial are not modified', t => {
  const partial = { require: { a: 2 } }
  const base = { require: { a: 1 }, optional: { a: 3 } } as Config
  const actual = unpartial(base, partial)

  t.deepEqual(base, { require: { a: 1 }, optional: { a: 3 } })
  t.deepEqual(partial, { require: { a: 2 } })
  t.deepEqual(actual, { require: { a: 2 }, optional: { a: 3 } })
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
