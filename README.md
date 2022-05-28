# unpartial

[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]

[![GitHub NodeJS][github-nodejs]][github-action-url]
[![Codecov][codecov-image]][codecov-url]

[![Visual Studio Code][vscode-image]][vscode-url]

Unpartial a type.

It is very common to define a config type and `Partial<>` it in a function argument.
When we received the argument, we want to merge it with our default config before using it:

```ts
import { unpartial } from 'unpartial'

interface Config {
  require: { a: number }
  optional?: { a: number }
}
const defaultConfig = { require: { a: 1 } }

function foo(givenConfig?: Partial<Config>) {
  const config = unpartial(defaultConfig, givenConfig);
  // use config with type safety
}
```

Code completion is available as you type:

```ts
const config = unpartial(defaultConfig, { /* code completion here */});
```

It also supports merging two default configs.
This is useful when you are extending the interface from another package/class.

```ts
import { unpartial } from 'unpartial'

import { Option, defaultOption } from 'another-package'

interface MyOption extends Option { ... }

const myDefaultOption = { ... }

function foo(givenOption?: Partial<MyOption>) {
  const option = unpartial(defaultOption, myDefaultOption, givenOption)
}
```

There are 3 more functions available in this library:

- `unpartialRecursively()`: `unpartial()` deeply.
- `required()`: an improved version of `unpartial()` with better type management.
- `requiredDeep()`: an improved version of `unpartialRecursively()` with better type management.

The `required()` and `requiredDeep()` function is also exposed in [`type-plus`](https://github.com/unional/type-plus).
Feel free to check it out.

## Contribute

```sh
# after fork and clone
yarn

# begin making changes
git checkout -b <branch>
yarn watch

# after making change(s)
git commit -m "<commit message>"
git push

# create PR
```

[codecov-image]: https://codecov.io/gh/unional/unpartial/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/unional/unpartial
[downloads-image]: https://img.shields.io/npm/dm/unpartial.svg?style=flat
[downloads-url]: https://npmjs.org/package/unpartial
[github-nodejs]: https://github.com/unional/unpartial/workflows/nodejs/badge.svg
[github-action-url]: https://github.com/unional/unpartial/actions
[npm-image]: https://img.shields.io/npm/v/unpartial.svg?style=flat
[npm-url]: https://npmjs.org/package/unpartial
[vscode-image]: https://img.shields.io/badge/vscode-ready-green.svg
[vscode-url]: https://code.visualstudio.com/
