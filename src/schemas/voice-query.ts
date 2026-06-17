// Declarative voice selection grammar — the JSON-serializable query language
// used by `core.speak()` and `WebPlayerFeatureSchema` to choose a voice.

import { z } from 'zod';

// ============================================================================
// Voice Query Types (Declarative Voice Selection)
// ============================================================================

/**
 * Declarative voice selection query.
 * All conditions are AND — a voice must match every specified field.
 *
 * @example
 * ```ts
 * // Select Portuguese female voice
 * { lang: "pt", gender: "female" }
 * ```
 *
 * @example
 * ```ts
 * // Select a specific BYOK WaveNet voice
 * { lang: "en-GB", gender: "m", provider: "Google Cloud WaveNet", name: "Wavenet-A" }
 * ```
 */
export const VoiceQuerySchema = z.object({
  /** Case-insensitive name match — tries exact first, falls back to substring.
   *  Use as disambiguator within attribute-filtered results. */
  name: z.string().optional(),

  /** BCP-47 language code — prefix match (e.g., "pt" matches "pt-BR") */
  lang: z.string().optional(),

  /** Voice gender filter (accepts short or long form) */
  gender: z.enum(['f', 'm', 'male', 'female']).optional(),

  /** Filter to BYOK-only voices */
  isByok: z.boolean().optional(),

  /** Provider name filter (e.g., "Google Cloud WaveNet") — case-insensitive */
  provider: z.string().optional(),
});
/** Inferred from {@link VoiceQuerySchema}. */
export type VoiceQuery = z.infer<typeof VoiceQuerySchema>;

/**
 * JSON-serializable regex literal for {@link VoiceSelectorSchema}. Used in
 * place of a runtime `RegExp` so the selector can travel over the wire and
 * appear in OpenAPI / SDKs in every language.
 */
export const RegexSelectorSchema = z.object({
  /** Regex pattern source (e.g. `'Portuguese'`). */
  regex: z.string(),
  /** Regex flags (e.g. `'i'`). */
  flags: z.string().optional(),
});
/** Inferred from {@link RegexSelectorSchema}. */
export type RegexSelector = z.infer<typeof RegexSelectorSchema>;

/**
 * Voice selector — declarative grammar for choosing a voice. Three forms
 * after parsing, all JSON-serializable so the same shape works in JS, every
 * SDK language, and server payloads:
 *
 * - `string` — exact name match (e.g. `'UK English Female'`).
 * - {@link VoiceQuery} — structured AND-filter (e.g. `{ lang: 'pt', gender: 'female' }`).
 * - {@link RegexSelector} — `{ regex, flags? }` for pattern matching.
 *
 * In JS the schema also accepts a real `RegExp` as input — a `preprocess`
 * step normalizes it to the {@link RegexSelector} literal form before
 * validation, so the post-parse output is always JSON-clean. The OpenAPI
 * emit only describes the three wire forms (the preprocess is invisible to
 * the schema description), so non-JS SDK consumers get a clean `oneOf`
 * without a phantom `RegExp` branch.
 */
export const VoiceSelectorSchema = z.preprocess(
  (val) => (val instanceof RegExp ? { regex: val.source, flags: val.flags } : val),
  z.union([z.string(), RegexSelectorSchema, VoiceQuerySchema])
);
/** Post-parse output — what consumers (resolvers, server responses) see. */
export type VoiceSelector = z.infer<typeof VoiceSelectorSchema>;
/**
 * Input form callers may write. JS callers can pass a real `RegExp` as
 * sugar for {@link RegexSelector}; the schema normalizes it on parse.
 */
export type VoiceSelectorInput = string | RegExp | RegexSelector | VoiceQuery;
