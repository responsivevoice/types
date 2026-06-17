// Barrel for the topical schema modules. Defensive `import 'zod-openapi'`
// here ensures `.meta()` is patched onto zod before the topical files run
// even if a consumer reaches into the directory directly.

import 'zod-openapi';

export * from './core';
export * from './events';
export * from './prosody';
export * from './responses';
export * from './streaming';
export * from './synthesis';
export * from './voice';
export * from './voice-query';
export * from './website';
