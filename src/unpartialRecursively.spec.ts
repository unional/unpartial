import test from 'ava'

import { unpartialRecursively } from './index'

interface Config {
  require: { a: number }
  optional?: { a: number }
}
const defaultConfig: Config = { require: { a: 1 } }


test('undefined partial will be ignored', t => {
  t.is(unpartialRecursively(undefined as any, undefined), undefined)
  t.is(unpartialRecursively(null as any, undefined), null)
  t.deepEqual(unpartialRecursively({ a: 1 }, undefined), { a: 1 })

  t.is(unpartialRecursively(null as any, null as any, undefined), null)
  t.deepEqual(unpartialRecursively({}, undefined, undefined), {})
})

test('undefined base will be ignored', t => {
  t.is(unpartialRecursively(undefined as any, null as any), null)
  t.deepEqual(unpartialRecursively(undefined as any, {}), {})

  t.deepEqual(unpartialRecursively({}, undefined as any, null as any), {})
  t.deepEqual(unpartialRecursively({}, undefined, undefined), {})
  t.deepEqual(unpartialRecursively({}, undefined as any, {}), {})
  t.deepEqual(unpartialRecursively({ a: 1 }, undefined as any, { b: 2 }), { a: 1, b: 2 })
})

test('null base will be ignored', t => {
  t.is(unpartialRecursively(null as any, null as any), null)
  t.deepEqual(unpartialRecursively(null as any, {}), {})

  t.deepEqual(unpartialRecursively({}, null as any, undefined), {})
  t.deepEqual(unpartialRecursively({}, null as any, null as any), {})
  t.deepEqual(unpartialRecursively({}, null as any, {}), {})
})

test('undefined superBase returns undefined (in JS)', t => {
  // to avoid unintended error
  t.is(unpartialRecursively(undefined as any, undefined as any, undefined), undefined)
  t.is(unpartialRecursively(undefined as any, undefined as any, null as any), undefined)
  t.is(unpartialRecursively(undefined as any, undefined as any, {}), undefined)
})

test('null superBase returns null (in JS)', t => {
  t.is(unpartialRecursively(null as any, null as any, undefined), null)
  t.is(unpartialRecursively(null as any, null as any, null as any), null)
  t.is(unpartialRecursively(null as any, null as any, {}), null)
})


test('base and partial are not modified', t => {
  const base = { require: { a: 1 }, optional: { a: 2 } } as Config
  const partial = { require: { a: 3 } }
  const actual = unpartialRecursively(base, partial)

  t.deepEqual(base, { require: { a: 1 }, optional: { a: 2 } })
  t.deepEqual(partial, { require: { a: 3 } })
  t.deepEqual(actual, { require: { a: 3 }, optional: { a: 2 } })
})

test('superBase base and partial are not modified', t => {
  const superBase = { require: { a: 1 } }
  const base = { require: { a: 2 }, optional: { a: 3 } } as Config
  const partial = { require: { a: 4 } }
  const actual = unpartialRecursively(superBase, base, partial)

  t.deepEqual(superBase, { require: { a: 1 } })
  t.deepEqual(base, { require: { a: 2 }, optional: { a: 3 } })
  t.deepEqual(partial, { require: { a: 4 } })
  t.deepEqual(actual, { require: { a: 4 }, optional: { a: 3 } })
})

test('partial config with optional', t => {
  const config = unpartialRecursively(defaultConfig, { optional: { a: 2 } })

  // `require` is not optional
  t.is(config.require.a, 1)
  // `optional`is still optional
  t.is(config.optional!.a, 2)
})

test('specify target interface explicitly', t => {
  const x = unpartialRecursively<Config>({ require: { a: 1 } }, {})
  t.is(x.require.a, 1)
})

test('will merge inner object', t => {
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

  t.deepEqual(actual, { require: { a: { b: 1, c: 'c' } } })
})
