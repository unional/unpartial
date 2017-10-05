# Unpartial

[![unstable][unstable-image]][unstable-url]
[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]
[![Build status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![Greenkeeper badge](https://badges.greenkeeper.io/unional/unpartial.svg)](https://greenkeeper.io/)

Unpartial an interface

It is very common to define a config interface and `Partial<>` it in a function argument.
When we received the arguement, we want to merge it with our default config before using it:

```ts
import { unpartial } from 'unpartial'

interface Config {
  require: { a: number }
  optional?: { a: number }
}
const defaultConfig = { require: { a: 1 } }

function foo(givenConfig: Partial<Config>) {
  const config = unpartial(givenConfig, defaultConfig);
  // use config with type safety
}
```

It also support merging two default configs.
This is useful when you are extending config from some other package/class.

```ts
import { unpartial } from 'unpartial'

import { Option, defaultOption } from 'another-package'

interface MyOption extends Option { ... }

const myDefaultOption = { ... }

function foo(givenOption: Partial<MyOption>) {
  const option = unpartial(givenOption, myDefaultOption, defaultOption)
}
```

## Contribute

```sh
# right after fork
npm install

# begin making changes
npm run watch

```

[unstable-image]: http://badges.github.io/stability-badges/dist/unstable.svg
[unstable-url]: http://github.com/badges/stability-badges
[npm-image]: https://img.shields.io/npm/v/unpartial.svg?style=flat
[npm-url]: https://npmjs.org/package/unpartial
[downloads-image]: https://img.shields.io/npm/dm/unpartial.svg?style=flat
[downloads-url]: https://npmjs.org/package/unpartial
[travis-image]: https://img.shields.io/travis/unional/unpartial.svg?style=flat
[travis-url]: https://travis-ci.org/unional/unpartial
[coveralls-image]: https://coveralls.io/repos/github/unional/unpartial/badge.svg
[coveralls-url]: https://coveralls.io/github/unional/unpartial
