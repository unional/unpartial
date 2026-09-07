# unpartial

## 1.0.8

### Patch Changes

- a123600: Pin `type-plus` (devDependency) to the exact `8.0.0-beta.10`.
  
  `type-plus` is used only in this package's test file (`assertType`, `isType.equal`),
  never re-exported or referenced from `ts/index.ts`, so it does not appear in the
  published `.d.ts`. No source change was needed and no runtime dependency exists
  between this package and type-plus, so consumers see nothing.

## 1.0.7

### Patch Changes

- b1938e2: Rebuild with tsdown instead of `tsc` + `buddy ts build cjs`.
  
  The published paths are unchanged — `cjs/index.js`, `esm/index.js` and their
  `.d.ts`/`.map` siblings are all still emitted at the same locations, and the tarball
  file list is identical to 1.0.6. What changes is the emitted JavaScript: both builds
  now target ES2022, where the CommonJS output was previously downlevelled to ES5.
  
  `engines.node` moves from `>=6` to `>= 20` to match. The `>=6` value has been wrong
  since this package became `"type": "module"` with an `exports` map, neither of which
  Node 6 understands.

## 1.0.6

### Patch Changes

- 40bc7b3: Point repository metadata at `cyberuni/unpartial` and publish through npm trusted
  publishing (OIDC) with provenance.

## 1.0.5

### Patch Changes

- cac4c5d: Improve exports/main/module fields

## 1.0.4

### Patch Changes

- 4e3eba3: Omit `Pick` when it is not needed.

## 1.0.3

### Patch Changes

- afa4606: Improve `unpartial(base, partial)` type.

  The type for `unpartial(parent, base, partial)` is marked as deprecated.
  The type is loosened now similar to `required(parent, base, partial)` to make it more flexible.
  But note that it is incorrect as the values are not deeply merged.

## 1.0.2

### Patch Changes

- 6070a75: Update types to fix some use cases.
  It is now based on the type from `required()` but make some improvements.

  - Result now honors `| undefined` property
  - Type is constructed instead of intersect, making it easier to read

## 1.0.1

### Patch Changes

- fa5dce0: fix cjs package.json

### Major Changes

- dabbde0: The `unpartial()` is rewritten to improve its type management,
  and ignore `undefined` and `null` properties.

  While this can be considered as a fix,
  it is better to release it as a breaking change this change might accidentally break consuming code.

## 1.0.0

## [0.7.5](https://github.com/unional/unpartial/compare/v0.7.4...v0.7.5) (2022-06-11)

### Bug Fixes

- add cjs/package.json ([#84](https://github.com/unional/unpartial/issues/84)) ([4e8dcae](https://github.com/unional/unpartial/commit/4e8dcae6e2755fd924d739dae9915a06baf2f1ff))

## [0.7.4](https://github.com/unional/unpartial/compare/v0.7.3...v0.7.4) (2022-06-04)

### Bug Fixes

- mark `sideEffects` false ([8ab6c12](https://github.com/unional/unpartial/commit/8ab6c1240c70711c5475a699b0561bfc791804c1))

## [0.7.3](https://github.com/unional/unpartial/compare/v0.7.2...v0.7.3) (2022-05-31)

### Bug Fixes

- add sem-rel npm ([19899d1](https://github.com/unional/unpartial/commit/19899d1294ef2e19c09ef4c61789d7ce9929aded))

## [0.7.2](https://github.com/unional/unpartial/compare/v0.7.1...v0.7.2) (2022-05-31)

### Bug Fixes

- re-release ([5b69974](https://github.com/unional/unpartial/commit/5b6997437582c290ecf77961d8e9684e7685e188))

## [0.7.1](https://github.com/unional/unpartial/compare/v0.7.0...v0.7.1) (2022-05-31)

### Bug Fixes

- add declaration files ([#81](https://github.com/unional/unpartial/issues/81)) ([c4729da](https://github.com/unional/unpartial/commit/c4729da2e7bd0453fc3d1dcf8172d8a5391bcfbc))

# unpartial

## 0.7.0

### Minor Changes

- Add ESM support
