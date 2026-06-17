// Voice resource schemas — the user-facing voice definition, the low-level
// system voice mapping, and the catalog wrapping both. Imported by every
// downstream consumer that needs to describe or validate a voice.

import { z } from 'zod';
import 'zod-openapi';
import { TTSServiceSchema, VoiceGenderShortSchema } from './core';

// ============================================================================
// Voice Types
// ============================================================================

/**
 * High-level ResponsiveVoice voice definition
 * Represents a user-facing voice option
 */
export const VoiceSchema = z
  .object({
    /** Display name for the voice (e.g., "UK English Female") */
    name: z.string(),

    /** Country flag code (e.g., "gb", "us") */
    flag: z.string(),

    /** Voice gender */
    gender: VoiceGenderShortSchema,

    /** BCP-47 language code (e.g., "en-GB") */
    lang: z.string(),

    /** References to system voice IDs in the voice collection */
    voiceIDs: z.array(z.number()),

    /** Whether this voice is deprecated */
    deprecated: z.boolean().optional(),

    /** Whether this voice requires user-provided API keys (BYOK) */
    isByok: z.boolean().optional(),

    /** Human-readable provider name for BYOK voices (e.g., "Google Cloud WaveNet") */
    provider: z.string().optional(),
  })
  .meta({ ref: 'Voice', description: 'User-facing voice definition' });
/** Inferred from {@link VoiceSchema}. */
export type Voice = z.infer<typeof VoiceSchema>;

/**
 * Low-level system voice mapping
 * Represents the actual TTS voice configuration
 */
export const SystemVoiceSchema = z
  .object({
    /** Catalog voice ID. Required — used as the lookup key on the client. */
    id: z.number(),

    /** System voice identifier name */
    name: z.string(),

    /** BCP-47 language code */
    lang: z.string().optional(),

    /** Speech rate modifier */
    rate: z.number().optional(),

    /** Voice pitch modifier */
    pitch: z.number().optional(),

    /** Timer speed for playback */
    timerSpeed: z.number().optional(),

    /** Whether this is a fallback voice (HTTP audio) */
    fallbackVoice: z.boolean().optional(),

    /** TTS service to use for fallback voices */
    service: TTSServiceSchema.optional(),

    /** Service-specific voice identifier */
    voiceName: z.string().optional(),

    /** Gender classification */
    gender: z.string().optional(),

    /** Volume level */
    volume: z.number().optional(),

    /** Whether this voice is deprecated */
    deprecated: z.boolean().optional(),
  })
  .meta({ ref: 'SystemVoice', description: 'Low-level system voice mapping' });
/** Inferred from {@link SystemVoiceSchema}. */
export type SystemVoice = z.infer<typeof SystemVoiceSchema>;

/**
 * Complete voice collection containing all voices
 */
export const VoiceCollectionSchema = z
  .object({
    /** Array of high-level ResponsiveVoice voices */
    voices: z.array(VoiceSchema),

    /** Array of low-level system voice mappings */
    systemVoices: z.array(SystemVoiceSchema),

    /** Voice collection version */
    version: z.string(),

    /** Last update timestamp */
    lastUpdated: z.string(),
  })
  .meta({ ref: 'VoiceCollection', description: 'Complete voice collection' });
/** Inferred from {@link VoiceCollectionSchema}. */
export type VoiceCollection = z.infer<typeof VoiceCollectionSchema>;
