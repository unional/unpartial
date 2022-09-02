## 1.0.0

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
