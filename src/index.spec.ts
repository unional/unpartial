import test from 'ava'

interface Config {
  require: { a: number }
  optional?: { a: number }
}
const defaultConfig: Config = { require: { a: 1 } }

import defaults = require('lodash.defaults')
function unpartial<T extends Object, U, R extends Object>(obj: U, src1: T, src2?: R): T & R {
  if (src1 === undefined || src1 === null)
    return obj as any
  return defaults(obj, src1, src2)
}

test(`ignore src1 when it is null or undefined (in JS)`, t => {
  t.is(unpartial(undefined, undefined as any), undefined)
  t.deepEqual(unpartial({}, undefined as any), {})
  t.is(unpartial(undefined, null as any), undefined)
  t.deepEqual(unpartial({}, null as any), {})
})

test(`ignore src2 when it is null or undefined (in JS)`, t => {
  t.is(unpartial(undefined, undefined as any, undefined as any), undefined)
  t.deepEqual(unpartial({}, undefined as any, undefined as any), {})
  t.is(unpartial(undefined, null as any, null as any), undefined)
  t.deepEqual(unpartial({}, null as any, null as any), {})
})

test('undefined gets a clone of src1', t => {
  const config = unpartial(undefined, defaultConfig)

  // `require` is not optional
  t.is(config.require.a, 1)

  t.deepEqual(config, defaultConfig)
  t.not(config, defaultConfig)
})

test('unpartial a partial config with optional', t => {
  const partial: Partial<Config> = { optional: { a: 2 } }
  const config = unpartial(partial, defaultConfig)

  // `require` is not optional
  t.is(config.require.a, 1)
  // `optional`is still optional
  t.is(config.optional!.a, 2)
})


test('unpartial a partial config with two sources', t => {
  // it is common to extend a config provided elsewhere (e.g. in another package).
  // in this case there are two default configs: from the other package and any new defaults defined.
  interface Config2 extends Config {
    require2: { a: number }
    optional2?: { a: number }
  }
  const defaultConfig2: Config2 = { require2: { a: 3 }, require: { a: 5 } }

  const partial: Partial<Config2> = { optional: { a: 2 }, optional2: { a: 4 } }
  const config = unpartial(partial, defaultConfig2, defaultConfig)

  // `require` is not optional anymore
  t.is(config.require.a, 5)
  // `optional`is still optional
  t.is(config.optional!.a, 2)

  // `require2` is not optional anymore
  t.is(config.require2.a, 3)
  // `optional`is still optional
  t.is(config.optional2!.a, 4)
})


test('Config2 extending from Partial<Config>', t => {
  interface Config2 extends Partial<Config> {
    require2: { a: number }
    optional2?: { a: number }
  }
  const defaultConfig2: Config2 = { require2: { a: 3 } }

  const partial: Partial<Config2> = { optional: { a: 2 }, optional2: { a: 4 } }
  const config = unpartial(partial, defaultConfig, defaultConfig2)

  // `require` is not optional anymore
  t.is(config.require.a, 1)
  // `optional`is still optional
  t.is(config.optional!.a, 2)

  // `require2` is not optional anymore
  t.is(config.require2.a, 3)
  // `optional`is still optional
  t.is(config.optional2!.a, 4)
})
