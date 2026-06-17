// Core enums, primitives, and transport constants. These are the leaf
// dependencies — every other topical file in `./schemas/` imports from here.

import { z } from 'zod';
import 'zod-openapi';

// ============================================================================
// API Version
// ============================================================================

/** Current API version used by the SDK and documented in OpenAPI */
export const API_VERSION = 'v2' as const;

// ============================================================================
// Core Types - Enums and Literals
// ============================================================================

/**
 * Voice gender classification
 */
export const VoiceGenderSchema = z.enum(['male', 'female']).meta({
  ref: 'VoiceGender',
  description: 'Voice gender classification',
});
/** Inferred from {@link VoiceGenderSchema}. */
export type VoiceGender = z.infer<typeof VoiceGenderSchema>;

/** Valid voice gender values for runtime validation */
export const VOICE_GENDERS = VoiceGenderSchema.options;

/**
 * Short form gender used internally
 */
export const VoiceGenderShortSchema = z.enum(['f', 'm']);
/** Inferred from {@link VoiceGenderShortSchema}. */
export type VoiceGenderShort = z.infer<typeof VoiceGenderShortSchema>;

/** Valid short gender values for runtime validation */
export const VOICE_GENDERS_SHORT = VoiceGenderShortSchema.options;

/**
 * Available TTS service backends
 * - g1: Primary fallback service
 * - g2: Secondary fallback service
 * - g3: Male voice fallbacks
 * - g5: Specialty languages (Armenian, Esperanto, Macedonian, Welsh)
 * - gwn: Google Cloud WaveNet (premium, requires BYOK credentials)
 * - msv: Microsoft Azure Speech (premium, requires BYOK credentials)
 * - oai: OpenAI TTS (premium, requires BYOK credentials)
 */
export const TTSServiceSchema = z.enum(['g1', 'g2', 'g3', 'g5', 'gwn', 'msv', 'oai']).meta({
  ref: 'TTSService',
  description: 'Available TTS service backends',
});
/** Inferred from {@link TTSServiceSchema}. */
export type TTSService = z.infer<typeof TTSServiceSchema>;

/** Valid TTS service values for runtime validation */
export const TTS_SERVICES = TTSServiceSchema.options;

/**
 * Supported audio output formats
 */
export const AudioFormatSchema = z.enum(['mp3', 'ogg', 'wav']).meta({
  ref: 'AudioFormat',
  description: 'Supported audio output formats',
});
/** Inferred from {@link AudioFormatSchema}. */
export type AudioFormat = z.infer<typeof AudioFormatSchema>;

/** Valid audio format values for runtime validation */
export const AUDIO_FORMATS = AudioFormatSchema.options;

/**
 * Supported audio formats per TTS engine.
 *
 * - Free providers (g1, g2, g3) only produce MP3
 * - g5 only produces OGG
 * - BYOK providers support multiple formats via their native APIs:
 *   - gwn (Google Cloud): MP3 and OGG_OPUS
 *   - msv (Azure): MP3, OGG, and WAV
 *   - oai (OpenAI): MP3, OGG (Opus), and WAV
 */
export const ENGINE_SUPPORTED_FORMATS: Record<TTSService, readonly AudioFormat[]> = {
  g1: ['mp3'],
  g2: ['mp3'],
  g3: ['mp3'],
  g5: ['ogg'],
  gwn: ['mp3', 'ogg'],
  msv: ['mp3', 'ogg', 'wav'],
  oai: ['mp3', 'ogg', 'wav'],
} as const;

/**
 * Default audio format for each TTS engine.
 * Used when no explicit format is requested.
 */
export const DEFAULT_ENGINE_FORMAT: Record<TTSService, AudioFormat> = {
  g1: 'mp3',
  g2: 'mp3',
  g3: 'mp3',
  g5: 'ogg',
  gwn: 'mp3',
  msv: 'mp3',
  oai: 'mp3',
} as const;

/**
 * Check whether a given audio format is supported by a TTS engine.
 */
export function isFormatSupportedByEngine(engine: TTSService, format: AudioFormat): boolean {
  const supported = ENGINE_SUPPORTED_FORMATS[engine];
  return supported.includes(format);
}

/**
 * Get the default audio format for a TTS engine.
 */
export function getDefaultFormat(engine: TTSService): AudioFormat {
  return DEFAULT_ENGINE_FORMAT[engine];
}

/**
 * ResponsiveVoice event types
 */
export const RVEventTypeSchema = z.enum([
  'OnLoad',
  'OnReady',
  'OnStart',
  'OnEnd',
  'OnError',
  'OnPause',
  'OnResume',
  'OnServiceSwitched',
  'OnClickEvent',
  'OnAllowSpeechClicked',
  'OnPartStart',
  'OnPartEnd',
  'OnVoiceResolved',
]);
/** Inferred from {@link RVEventTypeSchema}. */
export type RVEventType = z.infer<typeof RVEventTypeSchema>;

/** Valid event type values for runtime validation */
export const EVENT_TYPES = RVEventTypeSchema.options;

// ============================================================================
// Transport Modes
// ============================================================================

/**
 * Audio transport mode for fallback (HTTP) voices.
 * - `'chunks'` (default): full download per text chunk, then play
 * - `'stream'`: HTTP audio streaming with MSE progressive playback
 * - `'websocket'`: persistent WebSocket connection with MSE progressive playback
 */
export const TransportModeSchema = z.enum(['chunks', 'stream', 'websocket']).meta({
  ref: 'TransportMode',
  description: 'Audio transport mode for fallback voices',
});
/** Inferred from {@link TransportModeSchema}. */
export type TransportMode = z.infer<typeof TransportModeSchema>;

/** Valid transport mode values for runtime validation */
export const TRANSPORT_MODES = TransportModeSchema.options;

/**
 * Streaming-only transport modes (excludes 'chunks').
 * Used when MSE progressive playback is required.
 */
export const StreamingTransportModeSchema = TransportModeSchema.extract(['stream', 'websocket']);
/** Inferred from {@link StreamingTransportModeSchema}. */
export type StreamingTransportMode = z.infer<typeof StreamingTransportModeSchema>;

// ============================================================================
// Streaming Constants
// ============================================================================

/**
 * The Accept header value that clients MUST send for streaming synthesis requests.
 * Used by both the client (to set the header) and the server (to validate it).
 * This acts as a protocol-level signal alongside `stream: true` in the body,
 * enabling infrastructure (e.g. Traefik) to route streaming requests correctly
 * and providing defense-in-depth against forged requests.
 */
export const STREAMING_ACCEPT_TYPE = 'text/event-stream' as const;
