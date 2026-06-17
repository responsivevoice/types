// Prosody knob alphabet and the `RV-Prosody-Applied` response header
// contract. The vocabulary is shared verbatim between tts-api (server
// emitter), @responsivevoice/core (client consumer + capability decisions),
// and the OpenAPI extractor — single source of truth.

import { z } from 'zod';

/**
 * The complete set of prosody knobs the v2 API recognises. Order is stable
 * and used for deterministic header formatting.
 */
export const PROSODY_KNOBS = ['pitch', 'rate', 'volume'] as const;

/** Inferred union from {@link PROSODY_KNOBS}. */
export type ProsodyKnob = (typeof PROSODY_KNOBS)[number];

/** Zod enum over {@link PROSODY_KNOBS}. */
export const ProsodyKnobSchema = z.enum(PROSODY_KNOBS);

/**
 * Wire shape for the `RV-Prosody-Applied` response header — a comma-separated
 * subset of the prosody knob alphabet, in any order. Empty string means the
 * server applied none of the requested knobs (client should run its own
 * fallback per its `prosodyFallback` policy).
 */
export const ProsodyAppliedHeaderSchema = z
  .string()
  .regex(/^$|^(pitch|rate|volume)(,(pitch|rate|volume))*$/);

/**
 * Parse the `RV-Prosody-Applied` header value into a set of knobs. Tolerates
 * null/undefined (legacy server, no header) and empty string (server applied
 * nothing) by returning an empty set. Unknown tokens are dropped silently —
 * defensive against future server additions an old client doesn't know.
 */
export function parseProsodyApplied(value: string | null | undefined): Set<ProsodyKnob> {
  const out = new Set<ProsodyKnob>();
  if (!value) return out;
  for (const token of value.split(',')) {
    const trimmed = token.trim();
    if ((PROSODY_KNOBS as readonly string[]).includes(trimmed)) {
      out.add(trimmed as ProsodyKnob);
    }
  }
  return out;
}

/**
 * Format a set/iterable of knobs into the comma-separated header value.
 * Output order follows {@link PROSODY_KNOBS} so two calls with the same
 * inputs produce byte-identical headers (cache-key friendly).
 */
export function formatProsodyApplied(knobs: Iterable<ProsodyKnob>): string {
  const present = new Set(knobs);
  return PROSODY_KNOBS.filter((k) => present.has(k)).join(',');
}
