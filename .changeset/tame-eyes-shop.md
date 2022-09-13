---
"unpartial": patch
---

Improve `unpartial(base, partial)` type.

The type for `unpartial(parent, base, partial)` is marked as deprecated.
The type is loosened now similar to `required(parent, base, partial)` to make it more flexible.
But note that it is incorrect as the values are not deeply merged.
