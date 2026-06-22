# @responsivevoice/types

## 2.0.1

### Patch Changes

- Voice synthesize HATEOAS links advertise the `voice` parameter and make `lang` optional.

## 2.0.0

First public release of the rebuilt ResponsiveVoice — a complete, TypeScript-first rewrite of the original library, now split into focused, independently-versioned packages.

`@responsivevoice/types` is the Zod-schema contract layer for the entire ecosystem.

### Highlights

- Zod 4 schemas as the single source of truth for every API and configuration shape
- TypeScript types inferred directly from the schemas via `z.infer`
- Runtime type guards backed by `safeParse`
- Website and dashboard configuration schemas

Documentation: https://docs.responsivevoice.org
