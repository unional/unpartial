---
"unpartial": patch
---

Pin `type-plus` (devDependency) to the exact `8.0.0-beta.10`.

`type-plus` is used only in this package's test file (`assertType`, `isType.equal`),
never re-exported or referenced from `ts/index.ts`, so it does not appear in the
published `.d.ts`. No source change was needed and no runtime dependency exists
between this package and type-plus, so consumers see nothing.
