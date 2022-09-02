---
"unpartial": patch
---

Update types to fix some use cases.
It is now based on the type from `required()` but make some improvements.

- Result now honors `| undefined` property
- Type is constructed instead of intersect, making it easier to read
