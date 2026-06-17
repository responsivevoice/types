/**
 * Type guard functions for ResponsiveVoice types
 * These functions enable runtime type checking and type narrowing
 * Implementation uses Zod schema safeParse() for validation
 */

import type {
  AudioFormat,
  BrowserVoiceInfo,
  PlatformReport,
  RVErrorEvent,
  RVEvent,
  RVEventType,
  RVServiceSwitchedEvent,
  SynthesizeRequest,
  SystemVoice,
  TTSService,
  Voice,
  VoiceGender,
  VoiceGenderShort,
  VoiceReportRequest,
  VoiceReportResponse,
} from './schemas';

import {
  AUDIO_FORMATS,
  AudioFormatSchema,
  BrowserVoiceInfoSchema,
  EVENT_TYPES,
  PlatformReportSchema,
  RVErrorEventSchema,
  RVEventSchema,
  RVEventTypeSchema,
  RVServiceSwitchedEventSchema,
  SynthesizeRequestSchema,
  SystemVoiceSchema,
  TTS_SERVICES,
  TTSServiceSchema,
  VOICE_GENDERS,
  VOICE_GENDERS_SHORT,
  VoiceGenderSchema,
  VoiceGenderShortSchema,
  VoiceReportRequestSchema,
  VoiceReportResponseSchema,
  VoiceSchema,
} from './schemas';

// Re-export constant arrays for backward compatibility
export { AUDIO_FORMATS, EVENT_TYPES, TTS_SERVICES, VOICE_GENDERS, VOICE_GENDERS_SHORT };

// ============================================================================
// Primitive Type Guards
// ============================================================================

/**
 * Check if a value is a valid TTS service
 */
export function isTTSService(value: unknown): value is TTSService {
  return TTSServiceSchema.safeParse(value).success;
}

/**
 * Check if a value is a valid audio format
 */
export function isAudioFormat(value: unknown): value is AudioFormat {
  return AudioFormatSchema.safeParse(value).success;
}

/**
 * Check if a value is a valid voice gender
 */
export function isVoiceGender(value: unknown): value is VoiceGender {
  return VoiceGenderSchema.safeParse(value).success;
}

/**
 * Check if a value is a valid short gender
 */
export function isVoiceGenderShort(value: unknown): value is VoiceGenderShort {
  return VoiceGenderShortSchema.safeParse(value).success;
}

/**
 * Check if a value is a valid event type
 */
export function isRVEventType(value: unknown): value is RVEventType {
  return RVEventTypeSchema.safeParse(value).success;
}

// ============================================================================
// Object Type Guards
// ============================================================================

/**
 * Check if a value is a valid Voice object
 * @param value - The value to check
 * @returns True if the value is a valid Voice object
 */
export function isVoice(value: unknown): value is Voice {
  return VoiceSchema.safeParse(value).success;
}

/**
 * Check if a value is a valid SystemVoice object
 * @param value - The value to check
 * @returns True if the value is a valid SystemVoice object
 */
export function isSystemVoice(value: unknown): value is SystemVoice {
  return SystemVoiceSchema.safeParse(value).success;
}

/**
 * Check if a value is a valid SynthesizeRequest object
 * @param value - The value to check
 * @returns True if the value is a valid SynthesizeRequest object
 */
export function isSynthesizeRequest(value: unknown): value is SynthesizeRequest {
  return SynthesizeRequestSchema.safeParse(value).success;
}

/**
 * Check if a value is a valid RVEvent object
 * @param value - The value to check
 * @returns True if the value is a valid RVEvent object
 */
export function isRVEvent(value: unknown): value is RVEvent {
  return RVEventSchema.safeParse(value).success;
}

/**
 * Check if a value is a valid RVErrorEvent object
 * @param value - The value to check
 * @returns True if the value is a valid RVErrorEvent object
 */
export function isRVErrorEvent(value: unknown): value is RVErrorEvent {
  return RVErrorEventSchema.safeParse(value).success;
}

/**
 * Check if a value is a valid RVServiceSwitchedEvent object
 * @param value - The value to check
 * @returns True if the value is a valid RVServiceSwitchedEvent object
 */
export function isRVServiceSwitchedEvent(value: unknown): value is RVServiceSwitchedEvent {
  return RVServiceSwitchedEventSchema.safeParse(value).success;
}

// ============================================================================
// Voice Reporting Type Guards
// ============================================================================

/**
 * Check if a value is a valid BrowserVoiceInfo object
 * @param value - The value to check
 * @returns True if the value is a valid BrowserVoiceInfo object
 */
export function isBrowserVoiceInfo(value: unknown): value is BrowserVoiceInfo {
  return BrowserVoiceInfoSchema.safeParse(value).success;
}

/**
 * Check if a value is a valid PlatformReport object
 * @param value - The value to check
 * @returns True if the value is a valid PlatformReport object
 */
export function isPlatformReport(value: unknown): value is PlatformReport {
  return PlatformReportSchema.safeParse(value).success;
}

/**
 * Check if a value is a valid VoiceReportRequest object
 * @param value - The value to check
 * @returns True if the value is a valid VoiceReportRequest object
 */
export function isVoiceReportRequest(value: unknown): value is VoiceReportRequest {
  return VoiceReportRequestSchema.safeParse(value).success;
}

/**
 * Check if a value is a valid VoiceReportResponse object
 * @param value - The value to check
 * @returns True if the value is a valid VoiceReportResponse object
 */
export function isVoiceReportResponse(value: unknown): value is VoiceReportResponse {
  return VoiceReportResponseSchema.safeParse(value).success;
}
