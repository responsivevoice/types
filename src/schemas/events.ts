// ResponsiveVoice lifecycle events and the listener callback contract.

import { z } from 'zod';
import { RVEventTypeSchema, TTSServiceSchema } from './core';

// ============================================================================
// Event Types
// ============================================================================

/**
 * Base event interface
 */
export const RVEventSchema = z.object({
  /** Event type */
  type: RVEventTypeSchema,

  /** Event timestamp */
  timestamp: z.number(),
});
/** Inferred from {@link RVEventSchema}. */
export type RVEvent = z.infer<typeof RVEventSchema>;

/**
 * Event callback function type
 */
// Note: z.function() in Zod 4 validates that value is a function
// The TypeScript type is defined explicitly for proper callback typing
/** Runtime validator for event callbacks. See {@link RVEventCallback} for the TS signature. */
export const RVEventCallbackSchema = z.function();
/** Listener invoked by `ResponsiveVoice` for each dispatched {@link RVEvent}. */
export type RVEventCallback = (event: RVEvent) => void;

/**
 * Error event with additional error information
 */
export const RVErrorEventSchema = RVEventSchema.extend({
  type: z.literal('OnError'),

  /** Error message */
  message: z.string(),

  /** Error code */
  code: z.string().optional(),
});
/** Inferred from {@link RVErrorEventSchema}. */
export type RVErrorEvent = z.infer<typeof RVErrorEventSchema>;

/**
 * Service or native source for service switching
 */
export const ServiceOrNativeSchema = z.union([TTSServiceSchema, z.literal('native')]);
/** Inferred from {@link ServiceOrNativeSchema}. */
export type ServiceOrNative = z.infer<typeof ServiceOrNativeSchema>;

/**
 * Service switched event
 */
export const RVServiceSwitchedEventSchema = RVEventSchema.extend({
  type: z.literal('OnServiceSwitched'),

  /** Previous service */
  from: ServiceOrNativeSchema,

  /** New service */
  to: ServiceOrNativeSchema,
});
/** Inferred from {@link RVServiceSwitchedEventSchema}. */
export type RVServiceSwitchedEvent = z.infer<typeof RVServiceSwitchedEventSchema>;
