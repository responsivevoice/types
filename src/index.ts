/**
 * Shared TypeScript types, Zod schemas, and runtime type guards used across
 * the `@responsivevoice/*` packages. The Zod schemas are the single source of
 * truth for runtime validation; TypeScript types are inferred via `z.infer<>`.
 *
 * @packageDocumentation
 */

// ============================================================================
// Export all schemas and types
// ============================================================================

export * from './schemas';

// ============================================================================
// Re-export guards
// ============================================================================

export * from './guards';

// ============================================================================
// Package version
// ============================================================================

export { VERSION } from './version';
