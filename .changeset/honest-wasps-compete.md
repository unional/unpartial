---
"unpartial": major
---

The `unpartial()` is rewritten to improve its type management,
and ignore `undefined` and `null` properties.

While this can be considered as a fix,
it is better to release it as a breaking change this change might accidentally break consuming code.
