/**
 * Package version of `@responsivevoice/types`.
 *
 * In published builds, __PKG_VERSION__ is inlined by tsdown's `define` config.
 * In dev/test, it falls back to reading this package's own package.json via
 * createRequire.
 */

import { createRequire } from 'node:module';

declare const __PKG_VERSION__: string | undefined;

/** Package version, the source of truth for the OpenAPI contract version. */
export const VERSION: string =
  typeof __PKG_VERSION__ === 'string'
    ? __PKG_VERSION__
    : (createRequire(import.meta.url)('../package.json') as { version: string }).version;
