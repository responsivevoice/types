// Speech parameters, synthesis request/response shapes, and SDK client
// configuration. These are the request-side schemas consumed by the API
// client and the server's request validators.

import { z } from 'zod';
import 'zod-openapi';
import {
  AudioFormatSchema,
  ENGINE_SUPPORTED_FORMATS,
  isFormatSupportedByEngine,
  TTSServiceSchema,
  VoiceGenderSchema,
} from './core';

// ============================================================================
// Speech Parameter Primitives
// ============================================================================
// Shared range constraints for `pitch` / `rate` / `volume`. Reused by every
// schema that exposes them — synthesis requests, `SpeakParamsSchema`, the
// website default voice profile, and the web-player playback overrides.
// Each consumer applies `.optional()` or `.default(N)` at the point of use
// depending on whether the field is required post-parse, so the source of
// truth here is the *range*, not the optionality.

/** Voice pitch range (0–2; 1 = normal). */
export const PitchSchema = z.number().min(0).max(2);
/** Speech rate range (0–2; 1 = normal). */
export const RateSchema = z.number().min(0).max(2);
/** Volume range (0–1; 1 = full). */
export const VolumeSchema = z.number().min(0).max(1);

/**
 * Numeric speech parameters as a reusable, all-optional shape. Spread via
 * `...SpeechParamsSchema.shape` into any schema that wants `pitch` / `rate`
 * / `volume` overrides — `SynthesizeRequestSchema`, `SpeakParamsSchema`,
 * `WebPlayerFeatureSchema`, and any future consumer. Field-level
 * documentation lives here so the constraints and the meaning live in one
 * place; consumer comments only describe context-specific *behavior* (e.g.
 * "inherits website default when omitted").
 */
export const SpeechParamsSchema = z.object({
  /** Voice pitch (0–2, default 1 = normal). Providers may normalize to their own scale. */
  pitch: PitchSchema.optional(),
  /** Speech rate (0–2, default 1 = normal). Providers may normalize to their own scale. */
  rate: RateSchema.optional(),
  /** Volume (0–1, default 1 = full). */
  volume: VolumeSchema.optional(),
});
/** Inferred from {@link SpeechParamsSchema}. */
export type SpeechParams = z.infer<typeof SpeechParamsSchema>;

// ============================================================================
// API Types
// ============================================================================

/**
 * Request parameters for text-to-speech synthesis
 */
export const SynthesizeRequestSchema = z
  .object({
    /** Text to synthesize (max 4000 characters) */
    text: z.string(),

    /** ResponsiveVoice name (e.g., "UK English Male"). Resolved server-side to engine + lang. */
    voice: z.string().optional(),

    /** BCP-47 language code (e.g., "en-US"). Required unless voice is provided. */
    lang: z.string().optional(),

    /** TTS service engine to use */
    engine: TTSServiceSchema.optional(),

    /** System voice name */
    name: z.string().optional(),

    /** Voice gender preference */
    gender: VoiceGenderSchema.optional(),

    ...SpeechParamsSchema.shape,

    /** Audio output format */
    format: AudioFormatSchema.optional(),
  })
  .refine((data) => data.voice || data.lang, {
    message: 'Either "voice" or "lang" must be provided',
    path: ['voice'],
  })
  .superRefine((data, ctx) => {
    if (data.engine && data.format && !isFormatSupportedByEngine(data.engine, data.format)) {
      ctx.addIssue({
        code: 'custom',
        message: `Engine "${data.engine}" does not support "${data.format}" format. Supported formats: ${ENGINE_SUPPORTED_FORMATS[data.engine].join(', ')}`,
        path: ['format'],
      });
    }
  })
  .meta({ ref: 'SynthesizeRequest', description: 'Text-to-speech synthesis request' });
/** Inferred from {@link SynthesizeRequestSchema}. */
export type SynthesizeRequest = z.infer<typeof SynthesizeRequestSchema>;

/**
 * Response from text-to-speech synthesis
 */
export const SynthesizeResponseSchema = z.object({
  /** Audio data as ArrayBuffer */
  audio: z.instanceof(ArrayBuffer),

  /** MIME type of the audio */
  contentType: z.string(),

  /** Duration of the audio in seconds */
  duration: z.number().optional(),

  /** Size of the audio in bytes */
  size: z.number(),
});
/** Inferred from {@link SynthesizeResponseSchema}. */
export type SynthesizeResponse = z.infer<typeof SynthesizeResponseSchema>;

/**
 * Audio response wrapper with metadata
 */
export const AudioResponseSchema = z.object({
  /** Audio blob for playback */
  blob: z.custom<Blob>(
    (val) => typeof val === 'object' && val !== null && 'size' in val && 'type' in val
  ),

  /** URL for the audio blob */
  url: z.string(),

  /** Audio format */
  format: AudioFormatSchema,

  /** Duration in seconds */
  duration: z.number().optional(),

  /**
   * Prosody knobs the server applied upstream for this call. Parsed from
   * the `RV-Prosody-Applied` response header. Empty when no knobs were
   * applied (legacy server, or none requested).
   */
  prosodyApplied: z.array(z.enum(['pitch', 'rate', 'volume'])),
});
/** Inferred from {@link AudioResponseSchema}. */
export type AudioResponse = z.infer<typeof AudioResponseSchema>;

// ============================================================================
// Configuration Types
// ============================================================================

/**
 * ResponsiveVoice client configuration
 */
export const ResponsiveVoiceConfigSchema = z.object({
  /** API key — the account identifier; never functions as a credential. */
  apiKey: z.string(),

  /**
   * Server-issued secret paired with `apiKey` for server-to-server callers.
   * When set, the client attaches `X-API-Key` + `X-API-Secret` headers to
   * every request. Should not be used in browser code — use the browser
   * handshake (`/v2/config` → JWT) instead. Generated and rotated in the
   * dashboard's per-website "Server-to-server API secrets" section.
   */
  apiSecret: z.string().optional(),

  /** Base URL for the API (default: production URL) */
  baseUrl: z.string().optional(),

  /** Default voice to use */
  defaultVoice: z.string().optional(),

  /** Default language */
  defaultLang: z.string().optional(),

  /** Enable debug logging */
  debug: z.boolean().optional(),

  /** Request timeout in milliseconds */
  timeout: z.number().optional(),

  /** Number of retry attempts */
  retryAttempts: z.number().optional(),

  /** Whether to prefer native Web Speech API */
  preferNative: z.boolean().optional(),
});
/** Inferred from {@link ResponsiveVoiceConfigSchema}. */
export type ResponsiveVoiceConfig = z.infer<typeof ResponsiveVoiceConfigSchema>;

/**
 * Speech parameters for speak() method
 */
export const SpeakParamsSchema = z.object({
  ...SpeechParamsSchema.shape,

  /** Per-call override for client-side prosody fallback (see config). */
  prosodyFallback: z.boolean().optional(),

  /** Callback when speech starts */
  onstart: z.function().optional(),

  /** Callback when speech ends */
  onend: z.function().optional(),

  /** Callback on error */
  onerror: z.function().optional(),
});

// Manually define type for proper callback typing (z.function() infers as generic Function)
/**
 * Parameters accepted by `ResponsiveVoice.speak()`. Controls pitch, rate,
 * volume, and the speech lifecycle event callbacks (`onstart`, `onend`,
 * `onerror`, `onvoiceschanged`, `onboundary`). Defined as a hand-authored
 * TypeScript type rather than `z.infer<>` so callback signatures stay
 * precise.
 */
export type SpeakParams = {
  pitch?: number;
  rate?: number;
  volume?: number;
  /** Per-call override for client-side prosody fallback. See {@link ResponsiveVoiceConfigSchema} for the default. */
  prosodyFallback?: boolean;
  onstart?: () => void;
  onend?: () => void;
  onerror?: (error: Error) => void;
  /**
   * Called when speech crosses a word or sentence boundary
   * @param charIndex - Character index in the original text
   * @param name - Type of boundary ('word' or 'sentence')
   * @remarks Only supported by native Web Speech API engine, not fallback audio engine
   */
  onboundary?: (charIndex: number, name: string) => void;
};
