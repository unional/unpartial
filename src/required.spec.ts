import { required, requiredDeep } from './required';

describe('required()', () => {
  test('none of the inputs are modified', () => {
    const source1 = { a: 1 }
    const source2 = { b: 2 }
    const source3 = { c: 3 }
    required(source1, source2, source3)

    expect(source1).toEqual({ a: 1 })
    expect(source2).toEqual({ b: 2 })
    expect(source3).toEqual({ c: 3 })
  })

  test('source2 can be undefined', () => {
    const actual = required({ a: 1 }, undefined)

    expect(actual).toEqual({ a: 1 })
  })

  test('source2 can be null', () => {
    const actual = required({ a: 1 }, null)

    expect(actual).toEqual({ a: 1 })
  })

  test('source3 can be undefined', () => {
    const actual = required({ a: 1 }, undefined, undefined)

    expect(actual).toEqual({ a: 1 })
  })

  test('source3 can be null', () => {
    const actual = required({ a: 1 }, null, null)

    expect(actual).toEqual({ a: 1 })
  })

  type Source1 = {
    a: string,
    b: number,
    c: { d: boolean }
    e?: string
  };

  test('can access types in source1', () => {
    const source1: Partial<Source1> = { a: 'a', b: 2, c: { d: true } }

    const actual = required(source1, undefined)

    expect(actual.a).toEqual('a')
    expect(actual.b).toEqual(2)
    expect(actual.c.d).toEqual(true)
    actual.e = undefined
  })

  type Source2 = {
    p: string,
    q: number,
    r: { s: boolean }
    t?: string
  };

  test('can access types in source2', () => {
    const source1: Partial<Source1> = { a: 'a', b: 2, c: { d: true } }
    const source2: Partial<Source2> = { p: 'p', q: 2, r: { s: true } }

    const actual = required(source1, source2)

    expect(actual.p).toEqual('p')
    expect(actual.q).toEqual(2)
    expect(actual.r.s).toEqual(true)
    actual.t = undefined
  })

  type Source3 = {
    w: string,
    x: number,
    y: { z: boolean }
    u?: string
  };

  test('can access types in source3', () => {
    const source1: Partial<Source1> = { a: 'a', b: 2, c: { d: true } }
    const source2: Partial<Source2> = { p: 'p', q: 2, r: { s: true } }
    const source3: Partial<Source3> = { w: 'w', x: 2, y: { z: true } }

    const actual = required(source1, source2, source3)

    expect(actual.w).toEqual('w')
    expect(actual.x).toEqual(2)
    expect(actual.y.z).toEqual(true)
    actual.u = undefined
  })

  test('can explicitly specify target type', () => {
    const actual = required<Source1>({ a: 'a' }, { b: 2 }, { c: { d: true } })

    expect(actual.a).toEqual('a')
    expect(actual.b).toEqual(2)
    expect(actual.c.d).toEqual(true)
    actual.e = undefined
  })
})

describe('requiredDeep()', () => {
  test('merge class instance', () => {
    class Foo {
      a = 1
      c() {
        return this.a
      }
    }

    class Boo extends Foo {
      d() { return this.a + 1 }
    }
    const boo = new Boo()
    const actual = requiredDeep({ a: { b: { x: 1 } } }, undefined, { a: { b: boo } })
    expect(actual).toEqual({
      a: {
        b: {
          a: 1,
          x: 1,
          c: boo.c,
          d: boo.d
        }
      }
    })
  })

  test('override array', () => {
    const actual = requiredDeep({ a: [1] }, { a: [2] })
    expect(actual).toEqual({ a: [2] })
  })

  test('value add to array', () => {
    expect(requiredDeep({ a: [1] }, { a: 2 })).toEqual({ a: [1, 2] })
  })
})
