// Streaming chunk schemas — the wire shapes emitted by the HTTP audio streaming
// and WebSocket streaming transports.

import { z } from 'zod';
import { ProsodyKnobSchema } from './prosody';

// ============================================================================
// Streaming Types
// ============================================================================

/**
 * Metadata about a streaming synthesis session.
 * First chunk emitted when streaming begins.
 */
export const StreamMetadataSchema = z.object({
  type: z.literal('metadata'),
  /** MIME type of the audio (e.g., "audio/mpeg") */
  contentType: z.string(),
  /**
   * Prosody knobs the server applied upstream. Subset of the requested knobs.
   * Client uses this to skip its own fallback for any knob already applied.
   */
  prosodyApplied: z.array(ProsodyKnobSchema),
});
/** Inferred from {@link StreamMetadataSchema}. */
export type StreamMetadata = z.infer<typeof StreamMetadataSchema>;

/**
 * A chunk of audio data from the stream
 */
export const StreamAudioChunkSchema = z.object({
  type: z.literal('audio'),
  /** Audio data */
  data: z.instanceof(Uint8Array),
  /** 0-based chunk index */
  chunkIndex: z.number(),
});
/** Inferred from {@link StreamAudioChunkSchema}. */
export type StreamAudioChunk = z.infer<typeof StreamAudioChunkSchema>;

/**
 * End-of-stream marker with summary statistics
 */
export const StreamEndSchema = z.object({
  type: z.literal('end'),
  /** Total bytes received */
  totalBytes: z.number(),
  /** Total chunks received */
  totalChunks: z.number(),
});
/** Inferred from {@link StreamEndSchema}. */
export type StreamEnd = z.infer<typeof StreamEndSchema>;

/**
 * Stream error event
 */
export const StreamErrorSchema = z.object({
  type: z.literal('error'),
  /** Error message */
  message: z.string(),
  /** Whether the request can be retried */
  retryable: z.boolean(),
});
/** Inferred from {@link StreamErrorSchema}. */
export type StreamError = z.infer<typeof StreamErrorSchema>;

/**
 * Union of all streaming chunk types
 */
export type StreamChunk = StreamMetadata | StreamAudioChunk | StreamEnd | StreamError;
