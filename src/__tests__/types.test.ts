/**
 * @responsivevoice/types - Test Suite
 * Comprehensive tests for type definitions, type guards, and Zod schemas
 */

import { describe, expect, expectTypeOf, it } from 'vitest';
import {
  isAudioFormat,
  isBrowserVoiceInfo,
  isPlatformReport,
  isRVErrorEvent,
  isRVEvent,
  isRVEventType,
  isRVServiceSwitchedEvent,
  isSynthesizeRequest,
  isSystemVoice,
  isTTSService,
  isVoice,
  isVoiceGender,
  isVoiceGenderShort,
  isVoiceReportRequest,
  isVoiceReportResponse,
} from '../guards';
import type {
  AudioFormat,
  AudioResponse,
  ResponsiveVoiceConfig,
  RVErrorEvent,
  RVEvent,
  RVEventType,
  RVServiceSwitchedEvent,
  SpeakParams,
  SynthesizeRequest,
  SystemVoice,
  TTSService,
  Voice,
  VoiceCollection,
  VoiceGender,
  VoiceGenderShort,
} from '../index';
import {
  AUDIO_FORMATS,
  AudioFormatSchema,
  EVENT_TYPES,
  ResponsiveVoiceConfigSchema,
  RVErrorEventSchema,
  RVEventSchema,
  RVEventTypeSchema,
  RVServiceSwitchedEventSchema,
  ServiceOrNativeSchema,
  SynthesizeRequestSchema,
  SystemVoiceSchema,
  TTS_SERVICES,
  TTSServiceSchema,
  VOICE_GENDERS,
  VOICE_GENDERS_SHORT,
  VoiceCollectionSchema,
  VoiceGenderSchema,
  VoiceGenderShortSchema,
  VoiceSchema,
} from '../schemas';

// ============================================================================
// Type Compilation Tests
// ============================================================================

describe('Type Compilation Tests', () => {
  describe('Core Types', () => {
    it('should compile VoiceGender type correctly', () => {
      const male: VoiceGender = 'male';
      const female: VoiceGender = 'female';

      expectTypeOf(male).toMatchTypeOf<VoiceGender>();
      expectTypeOf(female).toMatchTypeOf<VoiceGender>();
    });

    it('should compile VoiceGenderShort type correctly', () => {
      const f: VoiceGenderShort = 'f';
      const m: VoiceGenderShort = 'm';

      expectTypeOf(f).toMatchTypeOf<VoiceGenderShort>();
      expectTypeOf(m).toMatchTypeOf<VoiceGenderShort>();
    });

    it('should compile TTSService type correctly', () => {
      const services: TTSService[] = ['g1', 'g2', 'g3', 'g5', 'gwn', 'msv', 'oai'];

      expectTypeOf(services).toMatchTypeOf<TTSService[]>();
    });

    it('should compile AudioFormat type correctly', () => {
      const formats: AudioFormat[] = ['mp3', 'ogg', 'wav'];

      expectTypeOf(formats).toMatchTypeOf<AudioFormat[]>();
    });
  });

  describe('Voice Types', () => {
    it('should compile Voice interface correctly', () => {
      const voice: Voice = {
        name: 'UK English Female',
        flag: 'gb',
        gender: 'f',
        lang: 'en-GB',
        voiceIDs: [1, 2, 3],
      };

      expectTypeOf(voice).toMatchTypeOf<Voice>();
      expectTypeOf(voice.name).toBeString();
      expectTypeOf(voice.voiceIDs).toMatchTypeOf<number[]>();
    });

    it('should allow optional deprecated field on Voice', () => {
      const activeVoice: Voice = {
        name: 'Test Voice',
        flag: 'us',
        gender: 'm',
        lang: 'en-US',
        voiceIDs: [1],
      };

      const deprecatedVoice: Voice = {
        name: 'Old Voice',
        flag: 'us',
        gender: 'm',
        lang: 'en-US',
        voiceIDs: [1],
        deprecated: true,
      };

      expectTypeOf(activeVoice).toMatchTypeOf<Voice>();
      expectTypeOf(deprecatedVoice).toMatchTypeOf<Voice>();
    });

    it('should compile SystemVoice interface correctly', () => {
      const systemVoice: SystemVoice = {
        id: 1,
        name: 'Google UK English Female',
        lang: 'en-GB',
        rate: 1.0,
        pitch: 1.0,
        service: 'g1',
      };

      expectTypeOf(systemVoice).toMatchTypeOf<SystemVoice>();
    });

    it('should compile VoiceCollection interface correctly', () => {
      const collection: VoiceCollection = {
        voices: [],
        systemVoices: [],
        version: '1.0.0',
        lastUpdated: '2025-01-01T00:00:00Z',
      };

      expectTypeOf(collection).toMatchTypeOf<VoiceCollection>();
      expectTypeOf(collection.voices).toMatchTypeOf<Voice[]>();
      expectTypeOf(collection.systemVoices).toMatchTypeOf<SystemVoice[]>();
    });
  });

  describe('API Types', () => {
    it('should compile SynthesizeRequest interface correctly', () => {
      const request: SynthesizeRequest = {
        text: 'Hello, world!',
        lang: 'en-US',
      };

      expectTypeOf(request).toMatchTypeOf<SynthesizeRequest>();
    });

    it('should compile SynthesizeRequest with all optional fields', () => {
      const fullRequest: SynthesizeRequest = {
        text: 'Hello, world!',
        lang: 'en-US',
        engine: 'g1',
        name: 'Google US English',
        gender: 'female',
        pitch: 0.5,
        rate: 0.5,
        volume: 1.0,
        format: 'mp3',
      };

      expectTypeOf(fullRequest).toMatchTypeOf<SynthesizeRequest>();
    });

    it('should compile AudioResponse interface correctly', () => {
      // Create a mock Blob for testing
      const mockBlob = new Blob(['test'], { type: 'audio/mpeg' });
      const audioResponse: AudioResponse = {
        blob: mockBlob,
        url: 'blob:http://example.com/123',
        format: 'mp3',
        duration: 5.5,
      };

      expectTypeOf(audioResponse).toMatchTypeOf<AudioResponse>();
      expectTypeOf(audioResponse.format).toMatchTypeOf<'mp3' | 'ogg' | 'wav'>();
    });
  });

  describe('Event Types', () => {
    it('should compile RVEventType correctly', () => {
      const events: RVEventType[] = [
        'OnLoad',
        'OnReady',
        'OnStart',
        'OnEnd',
        'OnError',
        'OnPause',
        'OnResume',
        'OnServiceSwitched',
      ];

      expectTypeOf(events).toMatchTypeOf<RVEventType[]>();
    });

    it('should compile RVEvent interface correctly', () => {
      const event: RVEvent = {
        type: 'OnStart',
        timestamp: Date.now(),
      };

      expectTypeOf(event).toMatchTypeOf<RVEvent>();
    });

    it('should compile RVErrorEvent interface correctly', () => {
      const errorEvent: RVErrorEvent = {
        type: 'OnError',
        timestamp: Date.now(),
        message: 'Something went wrong',
        code: 'ERR_SYNTHESIS_FAILED',
      };

      expectTypeOf(errorEvent).toMatchTypeOf<RVErrorEvent>();
    });

    it('should compile RVServiceSwitchedEvent interface correctly', () => {
      const switchEvent: RVServiceSwitchedEvent = {
        type: 'OnServiceSwitched',
        timestamp: Date.now(),
        from: 'native',
        to: 'g1',
      };

      expectTypeOf(switchEvent).toMatchTypeOf<RVServiceSwitchedEvent>();
    });
  });

  describe('Configuration Types', () => {
    it('should compile ResponsiveVoiceConfig interface correctly', () => {
      const config: ResponsiveVoiceConfig = {
        apiKey: 'test-api-key',
      };

      expectTypeOf(config).toMatchTypeOf<ResponsiveVoiceConfig>();
    });

    it('should compile ResponsiveVoiceConfig with all options', () => {
      const fullConfig: ResponsiveVoiceConfig = {
        apiKey: 'test-api-key',
        baseUrl: 'https://api.example.com',
        defaultVoice: 'UK English Female',
        defaultLang: 'en-GB',
        debug: true,
        timeout: 5000,
        retryAttempts: 3,
        preferNative: true,
      };

      expectTypeOf(fullConfig).toMatchTypeOf<ResponsiveVoiceConfig>();
    });

    it('should compile SpeakParams interface correctly', () => {
      const params: SpeakParams = {
        pitch: 1.0,
        rate: 1.0,
        volume: 1.0,
        onstart: () => {},
        onend: () => {},
        onerror: () => {},
      };

      expectTypeOf(params).toMatchTypeOf<SpeakParams>();
    });
  });
});

// ============================================================================
// Type Guard Tests
// ============================================================================

describe('Type Guard Tests', () => {
  describe('Primitive Type Guards', () => {
    describe('isTTSService', () => {
      it('should return true for valid TTS services', () => {
        expect(isTTSService('g1')).toBe(true);
        expect(isTTSService('g2')).toBe(true);
        expect(isTTSService('g3')).toBe(true);
        expect(isTTSService('g5')).toBe(true);
        expect(isTTSService('gwn')).toBe(true);
        expect(isTTSService('msv')).toBe(true);
        expect(isTTSService('oai')).toBe(true);
      });

      it('should return false for invalid TTS services', () => {
        expect(isTTSService('g4')).toBe(false);
        expect(isTTSService('invalid')).toBe(false);
        expect(isTTSService('')).toBe(false);
        expect(isTTSService(null)).toBe(false);
        expect(isTTSService(undefined)).toBe(false);
        expect(isTTSService(123)).toBe(false);
        expect(isTTSService({})).toBe(false);
      });
    });

    describe('isAudioFormat', () => {
      it('should return true for valid audio formats', () => {
        expect(isAudioFormat('mp3')).toBe(true);
        expect(isAudioFormat('ogg')).toBe(true);
        expect(isAudioFormat('wav')).toBe(true);
      });

      it('should return false for invalid audio formats', () => {
        expect(isAudioFormat('aac')).toBe(false);
        expect(isAudioFormat('flac')).toBe(false);
        expect(isAudioFormat('')).toBe(false);
        expect(isAudioFormat(null)).toBe(false);
        expect(isAudioFormat(undefined)).toBe(false);
      });
    });

    describe('isVoiceGender', () => {
      it('should return true for valid voice genders', () => {
        expect(isVoiceGender('male')).toBe(true);
        expect(isVoiceGender('female')).toBe(true);
      });

      it('should return false for invalid voice genders', () => {
        expect(isVoiceGender('m')).toBe(false);
        expect(isVoiceGender('f')).toBe(false);
        expect(isVoiceGender('other')).toBe(false);
        expect(isVoiceGender(null)).toBe(false);
      });
    });

    describe('isVoiceGenderShort', () => {
      it('should return true for valid short genders', () => {
        expect(isVoiceGenderShort('f')).toBe(true);
        expect(isVoiceGenderShort('m')).toBe(true);
      });

      it('should return false for invalid short genders', () => {
        expect(isVoiceGenderShort('male')).toBe(false);
        expect(isVoiceGenderShort('female')).toBe(false);
        expect(isVoiceGenderShort('')).toBe(false);
      });
    });

    describe('isRVEventType', () => {
      it('should return true for valid event types', () => {
        expect(isRVEventType('OnLoad')).toBe(true);
        expect(isRVEventType('OnReady')).toBe(true);
        expect(isRVEventType('OnStart')).toBe(true);
        expect(isRVEventType('OnEnd')).toBe(true);
        expect(isRVEventType('OnError')).toBe(true);
        expect(isRVEventType('OnPause')).toBe(true);
        expect(isRVEventType('OnResume')).toBe(true);
        expect(isRVEventType('OnServiceSwitched')).toBe(true);
      });

      it('should return false for invalid event types', () => {
        expect(isRVEventType('onstart')).toBe(false);
        expect(isRVEventType('OnStop')).toBe(false);
        expect(isRVEventType('')).toBe(false);
        expect(isRVEventType(null)).toBe(false);
      });
    });
  });

  describe('Object Type Guards', () => {
    describe('isVoice', () => {
      it('should return true for valid Voice objects', () => {
        const voice = {
          name: 'UK English Female',
          flag: 'gb',
          gender: 'f',
          lang: 'en-GB',
          voiceIDs: [1, 2, 3],
        };

        expect(isVoice(voice)).toBe(true);
      });

      it('should return true for Voice with deprecated field', () => {
        const voice = {
          name: 'Old Voice',
          flag: 'us',
          gender: 'm',
          lang: 'en-US',
          voiceIDs: [1],
          deprecated: true,
        };

        expect(isVoice(voice)).toBe(true);
      });

      it('should return false for invalid Voice objects', () => {
        expect(isVoice(null)).toBe(false);
        expect(isVoice(undefined)).toBe(false);
        expect(isVoice({})).toBe(false);
        expect(isVoice({ name: 'Test' })).toBe(false);

        // Missing required field
        expect(
          isVoice({
            name: 'Test',
            flag: 'us',
            gender: 'f',
            lang: 'en-US',
            // missing voiceIDs
          })
        ).toBe(false);

        // Invalid gender
        expect(
          isVoice({
            name: 'Test',
            flag: 'us',
            gender: 'invalid',
            lang: 'en-US',
            voiceIDs: [1],
          })
        ).toBe(false);

        // Invalid voiceIDs
        expect(
          isVoice({
            name: 'Test',
            flag: 'us',
            gender: 'f',
            lang: 'en-US',
            voiceIDs: ['a', 'b'],
          })
        ).toBe(false);
      });
    });

    describe('isSystemVoice', () => {
      it('should return true for valid SystemVoice objects', () => {
        const systemVoice = {
          id: 1,
          name: 'Google UK English Female',
        };

        expect(isSystemVoice(systemVoice)).toBe(true);
      });

      it('should return true for SystemVoice with all optional fields', () => {
        const systemVoice = {
          id: 1,
          name: 'Google UK English Female',
          lang: 'en-GB',
          rate: 1.0,
          pitch: 1.0,
          timerSpeed: 1,
          fallbackvoice: false,
          service: 'g1',
          voicename: 'English Female',
          gender: 'female',
          volume: 1.0,
          deprecated: false,
        };

        expect(isSystemVoice(systemVoice)).toBe(true);
      });

      it('should return false for invalid SystemVoice objects', () => {
        expect(isSystemVoice(null)).toBe(false);
        expect(isSystemVoice(undefined)).toBe(false);
        expect(isSystemVoice({})).toBe(false);
        expect(isSystemVoice({ name: 123 })).toBe(false);

        // Invalid service
        expect(
          isSystemVoice({
            name: 'Test',
            service: 'invalid',
          })
        ).toBe(false);

        // Invalid rate type
        expect(
          isSystemVoice({
            name: 'Test',
            rate: 'fast',
          })
        ).toBe(false);
      });
    });

    describe('isSynthesizeRequest', () => {
      it('should return true for valid minimal SynthesizeRequest', () => {
        const request = {
          text: 'Hello, world!',
          lang: 'en-US',
        };

        expect(isSynthesizeRequest(request)).toBe(true);
      });

      it('should return true for SynthesizeRequest with all optional fields', () => {
        const request = {
          text: 'Hello, world!',
          lang: 'en-US',
          engine: 'g1',
          name: 'Google US English',
          gender: 'female',
          pitch: 0.5,
          rate: 0.5,
          volume: 1.0,
          format: 'mp3',
        };

        expect(isSynthesizeRequest(request)).toBe(true);
      });

      it('should return false for invalid SynthesizeRequest objects', () => {
        expect(isSynthesizeRequest(null)).toBe(false);
        expect(isSynthesizeRequest(undefined)).toBe(false);
        expect(isSynthesizeRequest({})).toBe(false);

        // Missing required fields
        expect(isSynthesizeRequest({ text: 'Hello' })).toBe(false);
        expect(isSynthesizeRequest({ lang: 'en-US' })).toBe(false);

        // Invalid engine
        expect(
          isSynthesizeRequest({
            text: 'Hello',
            lang: 'en-US',
            engine: 'invalid',
          })
        ).toBe(false);

        // Invalid gender
        expect(
          isSynthesizeRequest({
            text: 'Hello',
            lang: 'en-US',
            gender: 'm',
          })
        ).toBe(false);

        // Pitch out of range
        expect(
          isSynthesizeRequest({
            text: 'Hello',
            lang: 'en-US',
            pitch: 2.1,
          })
        ).toBe(false);

        // Negative rate
        expect(
          isSynthesizeRequest({
            text: 'Hello',
            lang: 'en-US',
            rate: -0.5,
          })
        ).toBe(false);

        // Invalid format
        expect(
          isSynthesizeRequest({
            text: 'Hello',
            lang: 'en-US',
            format: 'aac',
          })
        ).toBe(false);
      });
    });

    describe('isRVEvent', () => {
      it('should return true for valid RVEvent objects', () => {
        const event = {
          type: 'OnStart',
          timestamp: Date.now(),
        };

        expect(isRVEvent(event)).toBe(true);
      });

      it('should return false for invalid RVEvent objects', () => {
        expect(isRVEvent(null)).toBe(false);
        expect(isRVEvent({})).toBe(false);
        expect(isRVEvent({ type: 'OnStart' })).toBe(false);
        expect(isRVEvent({ type: 'Invalid', timestamp: 123 })).toBe(false);
      });
    });

    describe('isRVErrorEvent', () => {
      it('should return true for valid RVErrorEvent objects', () => {
        const errorEvent = {
          type: 'OnError',
          timestamp: Date.now(),
          message: 'Something went wrong',
        };

        expect(isRVErrorEvent(errorEvent)).toBe(true);
      });

      it('should return true for RVErrorEvent with code', () => {
        const errorEvent = {
          type: 'OnError',
          timestamp: Date.now(),
          message: 'Something went wrong',
          code: 'ERR_001',
        };

        expect(isRVErrorEvent(errorEvent)).toBe(true);
      });

      it('should return false for non-error events', () => {
        const startEvent = {
          type: 'OnStart',
          timestamp: Date.now(),
        };

        expect(isRVErrorEvent(startEvent)).toBe(false);
      });

      it('should return false for invalid RVErrorEvent objects', () => {
        expect(isRVErrorEvent(null)).toBe(false);
        expect(
          isRVErrorEvent({
            type: 'OnError',
            timestamp: Date.now(),
            // missing message
          })
        ).toBe(false);
      });
    });

    describe('isRVServiceSwitchedEvent', () => {
      it('should return true for valid RVServiceSwitchedEvent objects', () => {
        const switchEvent = {
          type: 'OnServiceSwitched',
          timestamp: Date.now(),
          from: 'native',
          to: 'g1',
        };

        expect(isRVServiceSwitchedEvent(switchEvent)).toBe(true);
      });

      it('should return true for service-to-service switch', () => {
        const switchEvent = {
          type: 'OnServiceSwitched',
          timestamp: Date.now(),
          from: 'g1',
          to: 'g2',
        };

        expect(isRVServiceSwitchedEvent(switchEvent)).toBe(true);
      });

      it('should return false for non-switch events', () => {
        const startEvent = {
          type: 'OnStart',
          timestamp: Date.now(),
        };

        expect(isRVServiceSwitchedEvent(startEvent)).toBe(false);
      });

      it('should return false for invalid services', () => {
        expect(
          isRVServiceSwitchedEvent({
            type: 'OnServiceSwitched',
            timestamp: Date.now(),
            from: 'invalid',
            to: 'g1',
          })
        ).toBe(false);
      });
    });

    describe('isBrowserVoiceInfo', () => {
      it('should return true for valid BrowserVoiceInfo with required fields', () => {
        const voiceInfo = {
          name: 'Google UK English Female',
          lang: 'en-GB',
          localService: false,
          voiceURI: 'Google UK English Female',
        };

        expect(isBrowserVoiceInfo(voiceInfo)).toBe(true);
      });

      it('should return true for BrowserVoiceInfo with optional default field', () => {
        const voiceInfo = {
          name: 'Microsoft David',
          lang: 'en-US',
          localService: true,
          voiceURI: 'Microsoft David - English (United States)',
          default: true,
        };

        expect(isBrowserVoiceInfo(voiceInfo)).toBe(true);
      });

      it('should return false for invalid BrowserVoiceInfo objects', () => {
        expect(isBrowserVoiceInfo(null)).toBe(false);
        expect(isBrowserVoiceInfo(undefined)).toBe(false);
        expect(isBrowserVoiceInfo({})).toBe(false);
        expect(isBrowserVoiceInfo({ name: 'Test' })).toBe(false);

        // Missing required field (localService)
        expect(
          isBrowserVoiceInfo({
            name: 'Test Voice',
            lang: 'en-US',
            voiceURI: 'test-uri',
          })
        ).toBe(false);

        // Wrong type for boolean field
        expect(
          isBrowserVoiceInfo({
            name: 'Test Voice',
            lang: 'en-US',
            localService: 'true',
            voiceURI: 'test-uri',
          })
        ).toBe(false);

        // Wrong type for string field
        expect(
          isBrowserVoiceInfo({
            name: 123,
            lang: 'en-US',
            localService: true,
            voiceURI: 'test-uri',
          })
        ).toBe(false);
      });
    });

    describe('isPlatformReport', () => {
      it('should return true for valid PlatformReport with required fields', () => {
        const platform = {
          browser: 'Chrome',
          browserVersion: '120.0.6099.109',
          os: 'Windows',
          osVersion: '11',
        };

        expect(isPlatformReport(platform)).toBe(true);
      });

      it('should return true for PlatformReport with optional deviceType', () => {
        const platform = {
          browser: 'Safari',
          browserVersion: '17.2',
          os: 'macOS',
          osVersion: '14.2',
          deviceType: 'desktop',
        };

        expect(isPlatformReport(platform)).toBe(true);
      });

      it('should return true for all valid deviceType values', () => {
        const baseReport = {
          browser: 'Chrome',
          browserVersion: '120.0',
          os: 'Android',
          osVersion: '14',
        };

        expect(isPlatformReport({ ...baseReport, deviceType: 'desktop' })).toBe(true);
        expect(isPlatformReport({ ...baseReport, deviceType: 'mobile' })).toBe(true);
        expect(isPlatformReport({ ...baseReport, deviceType: 'tablet' })).toBe(true);
      });

      it('should return false for invalid PlatformReport objects', () => {
        expect(isPlatformReport(null)).toBe(false);
        expect(isPlatformReport(undefined)).toBe(false);
        expect(isPlatformReport({})).toBe(false);

        // Missing required field (osVersion)
        expect(
          isPlatformReport({
            browser: 'Chrome',
            browserVersion: '120.0',
            os: 'Windows',
          })
        ).toBe(false);

        // Invalid deviceType value
        expect(
          isPlatformReport({
            browser: 'Chrome',
            browserVersion: '120.0',
            os: 'Windows',
            osVersion: '11',
            deviceType: 'laptop',
          })
        ).toBe(false);

        // Wrong type for string field
        expect(
          isPlatformReport({
            browser: 123,
            browserVersion: '120.0',
            os: 'Windows',
            osVersion: '11',
          })
        ).toBe(false);
      });
    });

    describe('isVoiceReportRequest', () => {
      const validPlatform = {
        browser: 'Chrome',
        browserVersion: '120.0.6099.109',
        os: 'Windows',
        osVersion: '11',
      };

      const validVoice = {
        name: 'Google UK English Female',
        lang: 'en-GB',
        localService: false,
        voiceURI: 'Google UK English Female',
      };

      it('should return true for valid VoiceReportRequest with required fields', () => {
        const request = {
          platform: validPlatform,
          voices: [],
          timestamp: '2025-01-15T10:30:00Z',
        };

        expect(isVoiceReportRequest(request)).toBe(true);
      });

      it('should return true for VoiceReportRequest with populated voices', () => {
        const request = {
          platform: validPlatform,
          voices: [validVoice],
          timestamp: '2025-01-15T10:30:00Z',
        };

        expect(isVoiceReportRequest(request)).toBe(true);
      });

      it('should return true for VoiceReportRequest with optional sdkVersion', () => {
        const request = {
          platform: validPlatform,
          voices: [validVoice],
          timestamp: '2025-01-15T10:30:00Z',
          sdkVersion: '2.0.0',
        };

        expect(isVoiceReportRequest(request)).toBe(true);
      });

      it('should return false for invalid VoiceReportRequest objects', () => {
        expect(isVoiceReportRequest(null)).toBe(false);
        expect(isVoiceReportRequest(undefined)).toBe(false);
        expect(isVoiceReportRequest({})).toBe(false);

        // Missing platform
        expect(
          isVoiceReportRequest({
            voices: [],
            timestamp: '2025-01-15T10:30:00Z',
          })
        ).toBe(false);

        // Missing voices
        expect(
          isVoiceReportRequest({
            platform: validPlatform,
            timestamp: '2025-01-15T10:30:00Z',
          })
        ).toBe(false);

        // Missing timestamp
        expect(
          isVoiceReportRequest({
            platform: validPlatform,
            voices: [],
          })
        ).toBe(false);

        // Invalid timestamp format (not ISO 8601)
        expect(
          isVoiceReportRequest({
            platform: validPlatform,
            voices: [],
            timestamp: 'January 15, 2025',
          })
        ).toBe(false);

        // Invalid nested platform object
        expect(
          isVoiceReportRequest({
            platform: { browser: 'Chrome' },
            voices: [],
            timestamp: '2025-01-15T10:30:00Z',
          })
        ).toBe(false);

        // Invalid voice in voices array
        expect(
          isVoiceReportRequest({
            platform: validPlatform,
            voices: [{ name: 'Invalid Voice' }],
            timestamp: '2025-01-15T10:30:00Z',
          })
        ).toBe(false);
      });
    });

    describe('isVoiceReportResponse', () => {
      const validVoice = {
        name: 'UK English Female',
        flag: 'gb',
        gender: 'f',
        lang: 'en-GB',
        voiceIDs: [1, 2, 3],
      };

      const validSystemVoice = {
        id: 1,
        name: 'Google UK English Female',
      };

      it('should return true for valid VoiceReportResponse with required fields', () => {
        const response = {
          voices: [],
          systemVoices: [],
          count: 0,
        };

        expect(isVoiceReportResponse(response)).toBe(true);
      });

      it('should return true for VoiceReportResponse with populated voices', () => {
        const response = {
          voices: [validVoice],
          systemVoices: [],
          count: 1,
        };

        expect(isVoiceReportResponse(response)).toBe(true);
      });

      it('should return true for VoiceReportResponse with systemVoices', () => {
        const response = {
          voices: [validVoice],
          systemVoices: [validSystemVoice],
          count: 1,
        };

        expect(isVoiceReportResponse(response)).toBe(true);
      });

      it('should return false for VoiceReportResponse with null entries in systemVoices', () => {
        // Dense wire shape: nulls are no longer accepted.
        const response = {
          voices: [validVoice],
          systemVoices: [validSystemVoice, null, validSystemVoice],
          count: 1,
        };

        expect(isVoiceReportResponse(response)).toBe(false);
      });

      it('should return false for invalid VoiceReportResponse objects', () => {
        expect(isVoiceReportResponse(null)).toBe(false);
        expect(isVoiceReportResponse(undefined)).toBe(false);
        expect(isVoiceReportResponse({})).toBe(false);

        // Missing voices array
        expect(
          isVoiceReportResponse({
            count: 0,
          })
        ).toBe(false);

        // Missing count
        expect(
          isVoiceReportResponse({
            voices: [],
          })
        ).toBe(false);

        // Invalid count type (string instead of number)
        expect(
          isVoiceReportResponse({
            voices: [],
            count: '5',
          })
        ).toBe(false);

        // Invalid voice in voices array
        expect(
          isVoiceReportResponse({
            voices: [{ name: 'Invalid Voice' }],
            count: 1,
          })
        ).toBe(false);

        // Invalid systemVoice in systemVoices array (not null and not valid)
        expect(
          isVoiceReportResponse({
            voices: [],
            systemVoices: [{ invalid: 'data' }],
            count: 0,
          })
        ).toBe(false);
      });
    });
  });
});

// ============================================================================
// Export Validation Tests
// ============================================================================

describe('Export Validation', () => {
  it('should export all type definitions', () => {
    // This test validates that types are exported correctly
    // by creating typed variables that would fail to compile if exports were missing
    const voice: Voice = {
      name: 'Test',
      flag: 'us',
      gender: 'f',
      lang: 'en-US',
      voiceIDs: [1],
    };

    const systemVoice: SystemVoice = {
      id: 1,
      name: 'Test System Voice',
    };

    const request: SynthesizeRequest = {
      text: 'Test',
      lang: 'en-US',
    };

    expect(voice).toBeDefined();
    expect(systemVoice).toBeDefined();
    expect(request).toBeDefined();
  });

  it('should export all type guard functions', () => {
    expect(typeof isVoice).toBe('function');
    expect(typeof isSystemVoice).toBe('function');
    expect(typeof isSynthesizeRequest).toBe('function');
    expect(typeof isTTSService).toBe('function');
    expect(typeof isAudioFormat).toBe('function');
    expect(typeof isVoiceGender).toBe('function');
    expect(typeof isVoiceGenderShort).toBe('function');
    expect(typeof isRVEventType).toBe('function');
    expect(typeof isRVEvent).toBe('function');
    expect(typeof isRVErrorEvent).toBe('function');
    expect(typeof isRVServiceSwitchedEvent).toBe('function');
  });
});

// ============================================================================
// Zod Schema Validation Tests
// ============================================================================

describe('Zod Schema Validation Tests', () => {
  describe('Enum Schemas', () => {
    describe('VoiceGenderSchema', () => {
      it('should validate correct gender values', () => {
        expect(VoiceGenderSchema.safeParse('male').success).toBe(true);
        expect(VoiceGenderSchema.safeParse('female').success).toBe(true);
      });

      it('should reject invalid gender values', () => {
        expect(VoiceGenderSchema.safeParse('other').success).toBe(false);
        expect(VoiceGenderSchema.safeParse('m').success).toBe(false);
        expect(VoiceGenderSchema.safeParse('f').success).toBe(false);
        expect(VoiceGenderSchema.safeParse(null).success).toBe(false);
        expect(VoiceGenderSchema.safeParse(123).success).toBe(false);
      });
    });

    describe('VoiceGenderShortSchema', () => {
      it('should validate correct short gender values', () => {
        expect(VoiceGenderShortSchema.safeParse('f').success).toBe(true);
        expect(VoiceGenderShortSchema.safeParse('m').success).toBe(true);
      });

      it('should reject invalid short gender values', () => {
        expect(VoiceGenderShortSchema.safeParse('male').success).toBe(false);
        expect(VoiceGenderShortSchema.safeParse('female').success).toBe(false);
        expect(VoiceGenderShortSchema.safeParse('x').success).toBe(false);
      });
    });

    describe('TTSServiceSchema', () => {
      it('should validate all TTS service values', () => {
        expect(TTSServiceSchema.safeParse('g1').success).toBe(true);
        expect(TTSServiceSchema.safeParse('g2').success).toBe(true);
        expect(TTSServiceSchema.safeParse('g3').success).toBe(true);
        expect(TTSServiceSchema.safeParse('g5').success).toBe(true);
        expect(TTSServiceSchema.safeParse('gwn').success).toBe(true);
        expect(TTSServiceSchema.safeParse('msv').success).toBe(true);
        expect(TTSServiceSchema.safeParse('oai').success).toBe(true);
      });

      it('should reject invalid TTS service values', () => {
        expect(TTSServiceSchema.safeParse('g4').success).toBe(false);
        expect(TTSServiceSchema.safeParse('g6').success).toBe(false);
        expect(TTSServiceSchema.safeParse('').success).toBe(false);
        expect(TTSServiceSchema.safeParse(null).success).toBe(false);
      });
    });

    describe('AudioFormatSchema', () => {
      it('should validate all audio format values', () => {
        expect(AudioFormatSchema.safeParse('mp3').success).toBe(true);
        expect(AudioFormatSchema.safeParse('ogg').success).toBe(true);
        expect(AudioFormatSchema.safeParse('wav').success).toBe(true);
      });

      it('should reject invalid audio format values', () => {
        expect(AudioFormatSchema.safeParse('aac').success).toBe(false);
        expect(AudioFormatSchema.safeParse('flac').success).toBe(false);
        expect(AudioFormatSchema.safeParse('').success).toBe(false);
      });
    });

    describe('RVEventTypeSchema', () => {
      it('should validate all event type values', () => {
        expect(RVEventTypeSchema.safeParse('OnLoad').success).toBe(true);
        expect(RVEventTypeSchema.safeParse('OnReady').success).toBe(true);
        expect(RVEventTypeSchema.safeParse('OnStart').success).toBe(true);
        expect(RVEventTypeSchema.safeParse('OnEnd').success).toBe(true);
        expect(RVEventTypeSchema.safeParse('OnError').success).toBe(true);
        expect(RVEventTypeSchema.safeParse('OnPause').success).toBe(true);
        expect(RVEventTypeSchema.safeParse('OnResume').success).toBe(true);
        expect(RVEventTypeSchema.safeParse('OnServiceSwitched').success).toBe(true);
      });

      it('should reject invalid event type values', () => {
        expect(RVEventTypeSchema.safeParse('onstart').success).toBe(false);
        expect(RVEventTypeSchema.safeParse('OnStop').success).toBe(false);
        expect(RVEventTypeSchema.safeParse('').success).toBe(false);
      });
    });

    describe('ServiceOrNativeSchema', () => {
      it('should validate TTS services and native', () => {
        expect(ServiceOrNativeSchema.safeParse('g1').success).toBe(true);
        expect(ServiceOrNativeSchema.safeParse('g2').success).toBe(true);
        expect(ServiceOrNativeSchema.safeParse('native').success).toBe(true);
      });

      it('should reject invalid values', () => {
        expect(ServiceOrNativeSchema.safeParse('invalid').success).toBe(false);
        expect(ServiceOrNativeSchema.safeParse('').success).toBe(false);
      });
    });
  });

  describe('Object Schemas', () => {
    describe('VoiceSchema', () => {
      it('should validate a correct Voice object', () => {
        const voice = {
          name: 'UK English Female',
          flag: 'gb',
          gender: 'f',
          lang: 'en-GB',
          voiceIDs: [1, 2, 3],
        };
        expect(VoiceSchema.safeParse(voice).success).toBe(true);
      });

      it('should validate Voice with optional deprecated field', () => {
        const voice = {
          name: 'Old Voice',
          flag: 'us',
          gender: 'm',
          lang: 'en-US',
          voiceIDs: [1],
          deprecated: true,
        };
        expect(VoiceSchema.safeParse(voice).success).toBe(true);
      });

      it('should reject Voice with missing required fields', () => {
        const incomplete = {
          name: 'Test',
          flag: 'us',
        };
        expect(VoiceSchema.safeParse(incomplete).success).toBe(false);
      });

      it('should reject Voice with invalid gender', () => {
        const invalidGender = {
          name: 'Test',
          flag: 'us',
          gender: 'invalid',
          lang: 'en-US',
          voiceIDs: [1],
        };
        expect(VoiceSchema.safeParse(invalidGender).success).toBe(false);
      });

      it('should reject Voice with invalid voiceIDs', () => {
        const invalidVoiceIDs = {
          name: 'Test',
          flag: 'us',
          gender: 'f',
          lang: 'en-US',
          voiceIDs: ['a', 'b'],
        };
        expect(VoiceSchema.safeParse(invalidVoiceIDs).success).toBe(false);
      });

      it('should validate Voice with isByok and provider fields', () => {
        const byokVoice = {
          name: 'Google Wavenet US Female',
          flag: 'us',
          gender: 'f',
          lang: 'en-US',
          voiceIDs: [300],
          isByok: true,
          provider: 'Google Cloud WaveNet',
        };
        expect(VoiceSchema.safeParse(byokVoice).success).toBe(true);
      });

      it('should validate Voice without isByok and provider fields', () => {
        const standardVoice = {
          name: 'UK English Female',
          flag: 'gb',
          gender: 'f',
          lang: 'en-GB',
          voiceIDs: [1, 2, 3],
        };
        expect(VoiceSchema.safeParse(standardVoice).success).toBe(true);
      });

      it('should reject Voice with non-boolean isByok', () => {
        const invalidByok = {
          name: 'Test',
          flag: 'us',
          gender: 'f',
          lang: 'en-US',
          voiceIDs: [1],
          isByok: 'yes',
        };
        expect(VoiceSchema.safeParse(invalidByok).success).toBe(false);
      });

      it('should reject Voice with non-string provider', () => {
        const invalidProvider = {
          name: 'Test',
          flag: 'us',
          gender: 'f',
          lang: 'en-US',
          voiceIDs: [1],
          provider: 123,
        };
        expect(VoiceSchema.safeParse(invalidProvider).success).toBe(false);
      });
    });

    describe('SystemVoiceSchema', () => {
      it('should validate a minimal SystemVoice object', () => {
        const systemVoice = {
          id: 1,
          name: 'Google UK English Female',
        };
        expect(SystemVoiceSchema.safeParse(systemVoice).success).toBe(true);
      });

      it('should validate SystemVoice with all optional fields', () => {
        const systemVoice = {
          id: 1,
          name: 'Google UK English Female',
          lang: 'en-GB',
          rate: 1.0,
          pitch: 1.0,
          timerSpeed: 1,
          fallbackvoice: false,
          service: 'g1',
          voicename: 'English Female',
          gender: 'female',
          volume: 1.0,
          deprecated: false,
        };
        expect(SystemVoiceSchema.safeParse(systemVoice).success).toBe(true);
      });

      it('should reject SystemVoice with invalid service', () => {
        const invalidService = {
          id: 1,
          name: 'Test',
          service: 'invalid',
        };
        expect(SystemVoiceSchema.safeParse(invalidService).success).toBe(false);
      });

      it('should reject SystemVoice with missing name', () => {
        const noName = {
          id: 1,
          lang: 'en-GB',
        };
        expect(SystemVoiceSchema.safeParse(noName).success).toBe(false);
      });

      it('should reject SystemVoice with missing id', () => {
        const noId = {
          name: 'Google UK English Female',
        };
        expect(SystemVoiceSchema.safeParse(noId).success).toBe(false);
      });
    });

    describe('SynthesizeRequestSchema', () => {
      it('should validate a minimal SynthesizeRequest', () => {
        const request = {
          text: 'Hello, world!',
          lang: 'en-US',
        };
        expect(SynthesizeRequestSchema.safeParse(request).success).toBe(true);
      });

      it('should validate SynthesizeRequest with all optional fields', () => {
        const request = {
          text: 'Hello, world!',
          lang: 'en-US',
          engine: 'g1',
          name: 'Google US English',
          gender: 'female',
          pitch: 0.5,
          rate: 0.5,
          volume: 1.0,
          format: 'mp3',
        };
        expect(SynthesizeRequestSchema.safeParse(request).success).toBe(true);
      });

      it('should reject SynthesizeRequest with missing required fields', () => {
        expect(SynthesizeRequestSchema.safeParse({ text: 'Hello' }).success).toBe(false);
        expect(SynthesizeRequestSchema.safeParse({ lang: 'en-US' }).success).toBe(false);
      });

      it('should reject SynthesizeRequest with out-of-range pitch', () => {
        const invalidPitch = {
          text: 'Hello',
          lang: 'en-US',
          pitch: 2.1,
        };
        expect(SynthesizeRequestSchema.safeParse(invalidPitch).success).toBe(false);
      });

      it('should reject SynthesizeRequest with negative rate', () => {
        const invalidRate = {
          text: 'Hello',
          lang: 'en-US',
          rate: -0.5,
        };
        expect(SynthesizeRequestSchema.safeParse(invalidRate).success).toBe(false);
      });

      it('should reject SynthesizeRequest with invalid format', () => {
        const invalidFormat = {
          text: 'Hello',
          lang: 'en-US',
          format: 'aac',
        };
        expect(SynthesizeRequestSchema.safeParse(invalidFormat).success).toBe(false);
      });
    });

    describe('RVEventSchema', () => {
      it('should validate a correct RVEvent object', () => {
        const event = {
          type: 'OnStart',
          timestamp: Date.now(),
        };
        expect(RVEventSchema.safeParse(event).success).toBe(true);
      });

      it('should reject RVEvent with missing fields', () => {
        expect(RVEventSchema.safeParse({ type: 'OnStart' }).success).toBe(false);
        expect(RVEventSchema.safeParse({ timestamp: 123 }).success).toBe(false);
      });

      it('should reject RVEvent with invalid type', () => {
        const invalidType = {
          type: 'Invalid',
          timestamp: 123,
        };
        expect(RVEventSchema.safeParse(invalidType).success).toBe(false);
      });
    });

    describe('RVErrorEventSchema', () => {
      it('should validate a correct RVErrorEvent', () => {
        const errorEvent = {
          type: 'OnError',
          timestamp: Date.now(),
          message: 'Something went wrong',
        };
        expect(RVErrorEventSchema.safeParse(errorEvent).success).toBe(true);
      });

      it('should validate RVErrorEvent with optional code', () => {
        const errorEvent = {
          type: 'OnError',
          timestamp: Date.now(),
          message: 'Something went wrong',
          code: 'ERR_001',
        };
        expect(RVErrorEventSchema.safeParse(errorEvent).success).toBe(true);
      });

      it('should reject RVErrorEvent with wrong type', () => {
        const wrongType = {
          type: 'OnStart',
          timestamp: Date.now(),
          message: 'Something went wrong',
        };
        expect(RVErrorEventSchema.safeParse(wrongType).success).toBe(false);
      });

      it('should reject RVErrorEvent without message', () => {
        const noMessage = {
          type: 'OnError',
          timestamp: Date.now(),
        };
        expect(RVErrorEventSchema.safeParse(noMessage).success).toBe(false);
      });
    });

    describe('RVServiceSwitchedEventSchema', () => {
      it('should validate a correct RVServiceSwitchedEvent', () => {
        const switchEvent = {
          type: 'OnServiceSwitched',
          timestamp: Date.now(),
          from: 'native',
          to: 'g1',
        };
        expect(RVServiceSwitchedEventSchema.safeParse(switchEvent).success).toBe(true);
      });

      it('should validate service-to-service switch', () => {
        const switchEvent = {
          type: 'OnServiceSwitched',
          timestamp: Date.now(),
          from: 'g1',
          to: 'g2',
        };
        expect(RVServiceSwitchedEventSchema.safeParse(switchEvent).success).toBe(true);
      });

      it('should reject RVServiceSwitchedEvent with wrong type', () => {
        const wrongType = {
          type: 'OnStart',
          timestamp: Date.now(),
          from: 'native',
          to: 'g1',
        };
        expect(RVServiceSwitchedEventSchema.safeParse(wrongType).success).toBe(false);
      });

      it('should reject RVServiceSwitchedEvent with invalid service', () => {
        const invalidService = {
          type: 'OnServiceSwitched',
          timestamp: Date.now(),
          from: 'invalid',
          to: 'g1',
        };
        expect(RVServiceSwitchedEventSchema.safeParse(invalidService).success).toBe(false);
      });
    });

    describe('VoiceCollectionSchema', () => {
      it('should validate a correct VoiceCollection', () => {
        const collection = {
          voices: [
            {
              name: 'UK English Female',
              flag: 'gb',
              gender: 'f',
              lang: 'en-GB',
              voiceIDs: [1, 2],
            },
          ],
          systemVoices: [
            {
              id: 1,
              name: 'Google UK English Female',
              lang: 'en-GB',
            },
          ],
          version: '1.0.0',
          lastUpdated: '2025-01-01T00:00:00Z',
        };
        expect(VoiceCollectionSchema.safeParse(collection).success).toBe(true);
      });

      it('should validate empty VoiceCollection', () => {
        const emptyCollection = {
          voices: [],
          systemVoices: [],
          version: '1.0.0',
          lastUpdated: '2025-01-01T00:00:00Z',
        };
        expect(VoiceCollectionSchema.safeParse(emptyCollection).success).toBe(true);
      });

      it('should reject VoiceCollection with missing fields', () => {
        const incomplete = {
          voices: [],
          systemVoices: [],
        };
        expect(VoiceCollectionSchema.safeParse(incomplete).success).toBe(false);
      });
    });

    describe('ResponsiveVoiceConfigSchema', () => {
      it('should validate a minimal config', () => {
        const config = {
          apiKey: 'test-api-key',
        };
        expect(ResponsiveVoiceConfigSchema.safeParse(config).success).toBe(true);
      });

      it('should validate config with all optional fields', () => {
        const fullConfig = {
          apiKey: 'test-api-key',
          baseUrl: 'https://api.example.com',
          defaultVoice: 'UK English Female',
          defaultLang: 'en-GB',
          debug: true,
          timeout: 5000,
          retryAttempts: 3,
          preferNative: true,
        };
        expect(ResponsiveVoiceConfigSchema.safeParse(fullConfig).success).toBe(true);
      });

      it('should reject config without apiKey', () => {
        const noApiKey = {
          baseUrl: 'https://api.example.com',
        };
        expect(ResponsiveVoiceConfigSchema.safeParse(noApiKey).success).toBe(false);
      });
    });
  });

  describe('Constant Arrays', () => {
    it('should export TTS_SERVICES array with correct values', () => {
      expect(TTS_SERVICES).toEqual(['g1', 'g2', 'g3', 'g5', 'gwn', 'msv', 'oai']);
    });

    it('should export AUDIO_FORMATS array with correct values', () => {
      expect(AUDIO_FORMATS).toEqual(['mp3', 'ogg', 'wav']);
    });

    it('should export VOICE_GENDERS array with correct values', () => {
      expect(VOICE_GENDERS).toEqual(['male', 'female']);
    });

    it('should export VOICE_GENDERS_SHORT array with correct values', () => {
      expect(VOICE_GENDERS_SHORT).toEqual(['f', 'm']);
    });

    it('should export EVENT_TYPES array with correct values', () => {
      expect(EVENT_TYPES).toEqual([
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
    });
  });

  describe('Schema and Guard Consistency', () => {
    it('guards should produce same results as schema safeParse for primitive types', () => {
      // Test TTS services
      for (const service of TTS_SERVICES) {
        expect(isTTSService(service)).toBe(TTSServiceSchema.safeParse(service).success);
      }
      expect(isTTSService('invalid')).toBe(TTSServiceSchema.safeParse('invalid').success);

      // Test audio formats
      for (const format of AUDIO_FORMATS) {
        expect(isAudioFormat(format)).toBe(AudioFormatSchema.safeParse(format).success);
      }
      expect(isAudioFormat('invalid')).toBe(AudioFormatSchema.safeParse('invalid').success);

      // Test voice genders
      for (const gender of VOICE_GENDERS) {
        expect(isVoiceGender(gender)).toBe(VoiceGenderSchema.safeParse(gender).success);
      }
      expect(isVoiceGender('invalid')).toBe(VoiceGenderSchema.safeParse('invalid').success);

      // Test short genders
      for (const gender of VOICE_GENDERS_SHORT) {
        expect(isVoiceGenderShort(gender)).toBe(VoiceGenderShortSchema.safeParse(gender).success);
      }
      expect(isVoiceGenderShort('invalid')).toBe(
        VoiceGenderShortSchema.safeParse('invalid').success
      );

      // Test event types
      for (const eventType of EVENT_TYPES) {
        expect(isRVEventType(eventType)).toBe(RVEventTypeSchema.safeParse(eventType).success);
      }
      expect(isRVEventType('invalid')).toBe(RVEventTypeSchema.safeParse('invalid').success);
    });

    it('guards should produce same results as schema safeParse for object types', () => {
      const validVoice = {
        name: 'Test Voice',
        flag: 'us',
        gender: 'f',
        lang: 'en-US',
        voiceIDs: [1, 2],
      };
      const invalidVoice = { name: 'Test' };

      expect(isVoice(validVoice)).toBe(VoiceSchema.safeParse(validVoice).success);
      expect(isVoice(invalidVoice)).toBe(VoiceSchema.safeParse(invalidVoice).success);

      const validRequest = { text: 'Hello', lang: 'en-US' };
      const invalidRequest = { text: 'Hello' };

      expect(isSynthesizeRequest(validRequest)).toBe(
        SynthesizeRequestSchema.safeParse(validRequest).success
      );
      expect(isSynthesizeRequest(invalidRequest)).toBe(
        SynthesizeRequestSchema.safeParse(invalidRequest).success
      );

      const validEvent = { type: 'OnStart', timestamp: 123 };
      const invalidEvent = { type: 'OnStart' };

      expect(isRVEvent(validEvent)).toBe(RVEventSchema.safeParse(validEvent).success);
      expect(isRVEvent(invalidEvent)).toBe(RVEventSchema.safeParse(invalidEvent).success);
    });
  });
});
