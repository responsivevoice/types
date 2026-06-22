// API response schemas — voice reports (browser → server feedback) and the
// HATEOAS-decorated voice list / detail responses returned by the v2 voice
// endpoints, plus the standard error shape.

import { z } from 'zod';
import 'zod-openapi';
import { SystemVoiceSchema, VoiceSchema } from './voice';

// ============================================================================
// Voice Reporting Types
// ============================================================================

/**
 * Device type classification for voice reporting
 */
export const DeviceTypeSchema = z.enum(['desktop', 'mobile', 'tablet']);
/** Inferred from {@link DeviceTypeSchema}. */
export type DeviceType = z.infer<typeof DeviceTypeSchema>;

/**
 * Browser voice information from Web Speech API
 * Represents a SpeechSynthesisVoice as reported by the browser
 */
export const BrowserVoiceInfoSchema = z
  .object({
    /** Voice name as reported by the browser */
    name: z.string(),

    /** BCP-47 language tag */
    lang: z.string(),

    /** Whether the voice is local (true) or network-based (false) */
    localService: z.boolean(),

    /** Voice URI (unique identifier within browser) */
    voiceURI: z.string(),

    /** Whether this is the default voice for its language */
    default: z.boolean().optional(),
  })
  .meta({ ref: 'BrowserVoiceInfo', description: 'Browser voice from Web Speech API' });
/** Inferred from {@link BrowserVoiceInfoSchema}. */
export type BrowserVoiceInfo = z.infer<typeof BrowserVoiceInfoSchema>;

/**
 * Platform information for voice reporting
 */
export const PlatformReportSchema = z
  .object({
    /** Browser name (e.g., "Chrome", "Safari", "Firefox") */
    browser: z.string(),

    /** Browser version (e.g., "120.0.6099.109") */
    browserVersion: z.string(),

    /** OS name (e.g., "Windows", "macOS", "iOS", "Android") */
    os: z.string(),

    /** OS version (e.g., "14.2", "11", "10") */
    osVersion: z.string(),

    /** Device type hint */
    deviceType: DeviceTypeSchema.optional(),
  })
  .meta({ ref: 'PlatformReport', description: 'Client platform information' });
/** Inferred from {@link PlatformReportSchema}. */
export type PlatformReport = z.infer<typeof PlatformReportSchema>;

/**
 * Voice report request - sent by client to report available browser voices
 */
export const VoiceReportRequestSchema = z
  .object({
    /** Platform information */
    platform: PlatformReportSchema,

    /** List of available browser voices */
    voices: z.array(BrowserVoiceInfoSchema),

    /** Client timestamp (ISO 8601) */
    timestamp: z.iso.datetime(),

    /** Client SDK version */
    sdkVersion: z.string().optional(),
  })
  .meta({ ref: 'VoiceReportRequest', description: 'Browser voice availability report' });
/** Inferred from {@link VoiceReportRequestSchema}. */
export type VoiceReportRequest = z.infer<typeof VoiceReportRequestSchema>;

/**
 * Voice report response - returns personalized voice collection
 */
export const VoiceReportResponseSchema = z
  .object({
    /** Personalized voice collection for this browser/tier */
    voices: z.array(VoiceSchema),

    /** Dense array of system voices reachable from `voices[*].voiceIDs`. Each entry carries its `id`. */
    systemVoices: z.array(SystemVoiceSchema),

    /** Number of voices in the collection */
    count: z.number(),
  })
  .meta({ ref: 'VoiceReportResponse', description: 'Personalized voice collection response' });
/** Inferred from {@link VoiceReportResponseSchema}. */
export type VoiceReportResponse = z.infer<typeof VoiceReportResponseSchema>;

// ============================================================================
// Error Response
// ============================================================================

/**
 * Standard API error response matching error-handler.ts format
 */
export const ErrorResponseSchema = z
  .object({
    error: z.object({
      /** Human-readable error message */
      message: z.string(),

      /** Machine-readable error code */
      code: z.string().optional(),

      /** HTTP status code */
      statusCode: z.number(),

      /** Validation errors (present for VALIDATION_ERROR) */
      errors: z.unknown().optional(),
    }),
  })
  .meta({ ref: 'ErrorResponse', description: 'API error response' });
/** Inferred from {@link ErrorResponseSchema}. */
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

// ============================================================================
// HATEOAS Links — navigation metadata attached to voice API responses
// ============================================================================

/** Simple HATEOAS link with an absolute URL. */
export const HrefLinkSchema = z
  .object({
    href: z.string(),
  })
  .meta({ ref: 'HrefLink', description: 'HATEOAS link with absolute URL' });
/** Inferred from {@link HrefLinkSchema}. */
export type HrefLink = z.infer<typeof HrefLinkSchema>;

/** Synthesize action link on a voice resource. */
export const SynthesizeLinkSchema = z
  .object({
    href: z.string(),
    method: z.literal('POST'),
    body: z.object({ voice: z.string(), lang: z.string().optional() }),
  })
  .meta({ ref: 'SynthesizeLink', description: 'HATEOAS synthesize action link' });
/** Inferred from {@link SynthesizeLinkSchema}. */
export type SynthesizeLink = z.infer<typeof SynthesizeLinkSchema>;

/** Streaming synthesize action link (HTTP audio streaming). */
export const SynthesizeStreamLinkSchema = z
  .object({
    href: z.string(),
    method: z.literal('POST'),
    body: z.object({
      voice: z.string(),
      lang: z.string().optional(),
      stream: z.boolean(),
    }),
    accept: z.literal('text/event-stream'),
    premium: z.boolean(),
  })
  .meta({
    ref: 'SynthesizeStreamLink',
    description: 'HATEOAS streaming synthesize link (HTTP audio streaming)',
  });
/** Inferred from {@link SynthesizeStreamLinkSchema}. */
export type SynthesizeStreamLink = z.infer<typeof SynthesizeStreamLinkSchema>;

/** WebSocket stream action link. */
export const StreamWebsocketLinkSchema = z
  .object({
    href: z.string(),
    protocol: z.literal('websocket'),
    message: z.object({
      type: z.string(),
      voice: z.string(),
      lang: z.string().optional(),
    }),
    premium: z.boolean(),
  })
  .meta({ ref: 'StreamWebsocketLink', description: 'HATEOAS WebSocket stream link' });
/** Inferred from {@link StreamWebsocketLinkSchema}. */
export type StreamWebsocketLink = z.infer<typeof StreamWebsocketLinkSchema>;

/** Voice-level HATEOAS links present on every voice in an API response. */
export const VoiceLinksSchema = z
  .object({
    self: HrefLinkSchema,
    synthesize: SynthesizeLinkSchema,
    'synthesize:stream': SynthesizeStreamLinkSchema,
    'stream:websocket': StreamWebsocketLinkSchema,
  })
  .meta({ ref: 'VoiceLinks', description: 'HATEOAS links on a voice resource' });
/** Inferred from {@link VoiceLinksSchema}. */
export type VoiceLinks = z.infer<typeof VoiceLinksSchema>;

/**
 * Voice-detail HATEOAS links: voice-level links plus navigation back to the
 * collection and the by-language list (only present on `GET /v2/voices/{name}`).
 */
export const VoiceDetailLinksSchema = VoiceLinksSchema.extend({
  collection: HrefLinkSchema,
  byLanguage: HrefLinkSchema,
}).meta({
  ref: 'VoiceDetailLinks',
  description: 'HATEOAS links on a voice detail response',
});
/** Inferred from {@link VoiceDetailLinksSchema}. */
export type VoiceDetailLinks = z.infer<typeof VoiceDetailLinksSchema>;

/** Collection-level HATEOAS links on GET /v2/voices. */
export const CollectionLinksSchema = z
  .object({
    self: HrefLinkSchema,
  })
  .meta({
    ref: 'CollectionLinks',
    description: 'HATEOAS links on the voice collection',
  });
/** Inferred from {@link CollectionLinksSchema}. */
export type CollectionLinks = z.infer<typeof CollectionLinksSchema>;

/** Collection-level HATEOAS links on `GET /v2/voices/by-language/{lang}`. */
export const ByLanguageLinksSchema = z
  .object({
    self: HrefLinkSchema,
    allVoices: HrefLinkSchema,
  })
  .meta({
    ref: 'ByLanguageLinks',
    description: 'HATEOAS links on a by-language voice collection',
  });
/** Inferred from {@link ByLanguageLinksSchema}. */
export type ByLanguageLinks = z.infer<typeof ByLanguageLinksSchema>;

/** Voice resource as returned by API endpoints — core voice fields plus HATEOAS links. */
export const VoiceWithLinksSchema = VoiceSchema.extend({
  _links: VoiceLinksSchema,
}).meta({
  ref: 'VoiceWithLinks',
  description: 'User-facing voice with HATEOAS links',
});
/** Inferred from {@link VoiceWithLinksSchema}. */
export type VoiceWithLinks = z.infer<typeof VoiceWithLinksSchema>;

// ============================================================================
// Voice list response schemas — the shape returned by the three GET voice
// endpoints. These embed VoiceWithLinks so every voice carries HATEOAS links.
// ============================================================================

/** Response body for GET /v2/voices. */
export const VoicesListResponseSchema = z
  .object({
    voices: z.array(VoiceWithLinksSchema),
    systemVoices: z.array(SystemVoiceSchema),
    count: z.number(),
    _links: CollectionLinksSchema,
  })
  .meta({
    ref: 'VoicesListResponse',
    description: 'Voice collection with HATEOAS navigation',
  });
/** Inferred from {@link VoicesListResponseSchema}. */
export type VoicesListResponse = z.infer<typeof VoicesListResponseSchema>;

/** Response body for `GET /v2/voices/by-language/{lang}`. */
export const VoicesByLanguageResponseSchema = z
  .object({
    language: z.string(),
    voices: z.array(VoiceWithLinksSchema),
    count: z.number(),
    _links: ByLanguageLinksSchema,
  })
  .meta({
    ref: 'VoicesByLanguageResponse',
    description: 'Voices for a specific language with HATEOAS navigation',
  });
/** Inferred from {@link VoicesByLanguageResponseSchema}. */
export type VoicesByLanguageResponse = z.infer<typeof VoicesByLanguageResponseSchema>;

/** Response body for `GET /v2/voices/{name}`. */
export const VoiceDetailResponseSchema = z
  .object({
    voice: VoiceSchema,
    _links: VoiceDetailLinksSchema,
  })
  .meta({
    ref: 'VoiceDetailResponse',
    description: 'Single voice detail with HATEOAS navigation',
  });
/** Inferred from {@link VoiceDetailResponseSchema}. */
export type VoiceDetailResponse = z.infer<typeof VoiceDetailResponseSchema>;
