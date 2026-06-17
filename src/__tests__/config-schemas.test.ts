import { describe, expect, it } from 'vitest';
import {
  DEFAULT_WEBSITE_FEATURES,
  MiniPlayerOffsetSchema,
  MiniPlayerSchema,
  VoiceSelectorSchema,
  WebPlayerFeatureSchema,
  WebsiteConfigResponseSchema,
  WebsiteFeaturesSchema,
  WebsiteVoiceSchema,
} from '../schemas';

describe('WebsiteConfigResponseSchema', () => {
  it('should parse a complete valid config', () => {
    const input = {
      features: {
        ...DEFAULT_WEBSITE_FEATURES,
        welcomeMessage: { enabled: true, text: 'Hello!' },
        speakSelectedText: { enabled: true },
        welcomeMessageOnce: true,
      },
      voice: { name: 'US English Female', pitch: 1, rate: 1, volume: 1 },
      analytics: { enabled: true },
    };
    const result = WebsiteConfigResponseSchema.parse(input);
    expect(result.features.welcomeMessage.enabled).toBe(true);
    expect(result.features.welcomeMessage.text).toBe('Hello!');
    expect(result.voice.name).toBe('US English Female');
  });

  it('should apply all defaults for empty object', () => {
    const result = WebsiteConfigResponseSchema.parse({});
    expect(result.features.welcomeMessage.enabled).toBe(false);
    expect(result.features.welcomeMessage.text).toBeNull();
    expect(result.features.speakSelectedText.enabled).toBe(false);
    expect(result.features.welcomeMessageOnce).toBe(false);
    expect(result.voice.name).toBe('UK English Female');
    expect(result.voice.pitch).toBe(1);
    expect(result.analytics.enabled).toBe(false);
  });

  it('should accept partial features', () => {
    const result = WebsiteConfigResponseSchema.parse({
      features: { welcomeMessage: { enabled: true, text: 'Hi' } },
    });
    expect(result.features.welcomeMessage.enabled).toBe(true);
    expect(result.features.speakLinks.enabled).toBe(false);
  });
});

describe('WebsiteFeaturesSchema', () => {
  it('should reject invalid feature shape', () => {
    expect(() => WebsiteFeaturesSchema.parse({ welcomeMessage: 'invalid' })).toThrow();
  });
});

describe('WebPlayerFeatureSchema', () => {
  it('applies defaults when empty', () => {
    const result = WebPlayerFeatureSchema.parse({});
    expect(result.enabled).toBe(false);
    expect(result.selector).toBe('article');
    expect(result.paragraphSelector).toBe('p, h2, h3, li');
    expect(result.position).toBe('before');
    expect(result.theme).toBe('neutral');
    expect(result.controls).toEqual({
      progress: true,
      time: true,
      skip: true,
      speed: true,
      brand: true,
    });
    expect(result.navigation).toEqual({
      paragraphHighlight: true,
      paragraphClick: true,
    });
    expect(result.layout).toEqual({
      mode: 'shrink',
      display: 'block',
    });
    expect(result.miniPlayer).toEqual({
      enabled: true,
      position: 'bottom-left',
      animation: 'slide',
    });
    expect(result.sanitize).toEqual({ enabled: true, exclude: [] });
  });

  it('accepts partial sanitize overrides', () => {
    const result = WebPlayerFeatureSchema.parse({
      sanitize: { enabled: false, exclude: ['.ad', 'nav'] },
    });
    expect(result.sanitize).toEqual({ enabled: false, exclude: ['.ad', 'nav'] });
  });

  it('accepts partial controls overrides and fills the rest with defaults', () => {
    const result = WebPlayerFeatureSchema.parse({
      controls: { progress: false, brand: false },
    });
    expect(result.controls).toEqual({
      progress: false,
      time: true,
      skip: true,
      speed: true,
      brand: false,
    });
  });

  it('accepts partial navigation overrides', () => {
    const result = WebPlayerFeatureSchema.parse({
      navigation: { paragraphClick: false },
    });
    expect(result.navigation).toEqual({
      paragraphHighlight: true,
      paragraphClick: false,
    });
  });

  it('accepts partial layout overrides', () => {
    const result = WebPlayerFeatureSchema.parse({
      layout: { mode: 'fill', display: 'inline' },
    });
    expect(result.layout).toEqual({
      mode: 'fill',
      display: 'inline',
    });
  });

  it('rejects an unknown layout.mode value', () => {
    expect(() => WebPlayerFeatureSchema.parse({ layout: { mode: 'auto' } })).toThrow();
  });

  it('rejects an unknown layout.display value', () => {
    expect(() => WebPlayerFeatureSchema.parse({ layout: { display: 'flex' } })).toThrow();
  });

  it('rejects non-boolean control toggles', () => {
    expect(() => WebPlayerFeatureSchema.parse({ controls: { progress: 'yes' } })).toThrow();
  });

  it('accepts a preset theme name', () => {
    const result = WebPlayerFeatureSchema.parse({ theme: 'responsivevoice' });
    expect(result.theme).toBe('responsivevoice');
  });

  it('accepts a partial theme token override', () => {
    const result = WebPlayerFeatureSchema.parse({
      theme: { accent: '#ff0000', fill: '#00ff00' },
    });
    expect(result.theme).toEqual({ accent: '#ff0000', fill: '#00ff00' });
  });

  it('rejects an unknown preset name', () => {
    expect(() => WebPlayerFeatureSchema.parse({ theme: 'midnight' })).toThrow();
  });

  it('accepts custom selectors', () => {
    const result = WebPlayerFeatureSchema.parse({
      enabled: true,
      selector: 'main.post',
      paragraphSelector: 'p.body',
      position: 'inline',
    });
    expect(result.enabled).toBe(true);
    expect(result.selector).toBe('main.post');
    expect(result.paragraphSelector).toBe('p.body');
    expect(result.position).toBe('inline');
  });

  it('rejects non-string selector', () => {
    expect(() => WebPlayerFeatureSchema.parse({ selector: 42 })).toThrow();
  });

  it('rejects unknown position value', () => {
    expect(() => WebPlayerFeatureSchema.parse({ position: 'floating' })).toThrow();
  });

  it('accepts a custom mount target via the position object form', () => {
    const result = WebPlayerFeatureSchema.parse({
      position: { target: '#article-header', at: 'after' },
    });
    expect(result.position).toEqual({ target: '#article-header', at: 'after' });
  });

  it('defaults `at` to "inside" when omitted from the position object form', () => {
    const result = WebPlayerFeatureSchema.parse({
      position: { target: '#player-slot' },
    });
    expect(result.position).toEqual({ target: '#player-slot', at: 'inside' });
  });

  it('rejects the position object form when target is omitted', () => {
    expect(() => WebPlayerFeatureSchema.parse({ position: { at: 'inside' } })).toThrow();
  });

  it('rejects the position object form with an unknown `at` value', () => {
    expect(() =>
      WebPlayerFeatureSchema.parse({ position: { target: '#x', at: 'inline' } })
    ).toThrow();
  });

  it('is included in WebsiteFeaturesSchema defaults', () => {
    const result = WebsiteFeaturesSchema.parse({});
    expect(result.webPlayer.enabled).toBe(false);
    expect(result.webPlayer.selector).toBe('article');
  });
});

describe('WebsiteVoiceSchema', () => {
  it('should clamp pitch/rate/volume to valid ranges', () => {
    expect(() =>
      WebsiteVoiceSchema.parse({ name: 'Test', pitch: 5, rate: 1, volume: 1 })
    ).toThrow();
  });

  it('should accept valid voice', () => {
    const result = WebsiteVoiceSchema.parse({
      name: 'US English Male',
      pitch: 0.8,
      rate: 1.2,
      volume: 0.5,
    });
    expect(result.name).toBe('US English Male');
    expect(result.pitch).toBe(0.8);
  });
});

describe('VoiceSelectorSchema', () => {
  it('accepts an exact name string', () => {
    expect(VoiceSelectorSchema.parse('UK English Female')).toBe('UK English Female');
  });

  it('accepts a structured query', () => {
    const result = VoiceSelectorSchema.parse({ lang: 'pt', gender: 'female' });
    expect(result).toEqual({ lang: 'pt', gender: 'female' });
  });

  it('accepts a regex literal with flags', () => {
    const result = VoiceSelectorSchema.parse({ regex: 'Portuguese', flags: 'i' });
    expect(result).toEqual({ regex: 'Portuguese', flags: 'i' });
  });

  it('accepts a regex literal without flags', () => {
    const result = VoiceSelectorSchema.parse({ regex: 'Portuguese' });
    expect(result).toEqual({ regex: 'Portuguese' });
  });

  it('accepts a real RegExp and normalizes to the literal form', () => {
    const result = VoiceSelectorSchema.parse(/Portuguese/i);
    expect(result).toEqual({ regex: 'Portuguese', flags: 'i' });
  });

  it('accepts a real RegExp without flags', () => {
    const result = VoiceSelectorSchema.parse(/UK English/);
    expect(result).toEqual({ regex: 'UK English', flags: '' });
  });
});

describe('MiniPlayerSchema', () => {
  it('applies defaults when empty', () => {
    const result = MiniPlayerSchema.parse({});
    expect(result).toEqual({ enabled: true, position: 'bottom-left', animation: 'slide' });
  });

  it('accepts each animation preset', () => {
    for (const animation of ['none', 'fade', 'slide', 'pop'] as const) {
      const result = MiniPlayerSchema.parse({ animation });
      expect(result.animation).toBe(animation);
    }
  });

  it('rejects an unknown animation preset', () => {
    expect(() => MiniPlayerSchema.parse({ animation: 'spin' })).toThrow();
  });

  it('accepts each corner keyword', () => {
    for (const corner of ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const) {
      const result = MiniPlayerSchema.parse({ position: corner });
      expect(result.position).toBe(corner);
    }
  });

  it('rejects an unknown corner keyword', () => {
    expect(() => MiniPlayerSchema.parse({ position: 'top-center' })).toThrow();
  });

  it('accepts a CSS-offset object with one side', () => {
    const result = MiniPlayerSchema.parse({ position: { top: '80px' } });
    expect(result.position).toEqual({ top: '80px' });
  });

  it('accepts a CSS-offset object with two non-opposing sides', () => {
    const result = MiniPlayerSchema.parse({
      position: { top: '80px', right: '20px' },
    });
    expect(result.position).toEqual({ top: '80px', right: '20px' });
  });

  it('rejects an empty offset object', () => {
    expect(() => MiniPlayerSchema.parse({ position: {} })).toThrow();
  });

  it('rejects opposing top + bottom offsets', () => {
    expect(() => MiniPlayerSchema.parse({ position: { top: '10px', bottom: '10px' } })).toThrow();
  });

  it('rejects opposing left + right offsets', () => {
    expect(() => MiniPlayerSchema.parse({ position: { left: '0', right: '0' } })).toThrow();
  });

  it('rejects non-string offset values', () => {
    expect(() => MiniPlayerOffsetSchema.parse({ top: 80 } as unknown as { top: string })).toThrow();
  });
});

describe('WebPlayerFeatureSchema miniPlayer', () => {
  it('expands `miniPlayer: true` to the canonical object with default position', () => {
    const result = WebPlayerFeatureSchema.parse({ miniPlayer: true });
    expect(result.miniPlayer).toEqual({
      enabled: true,
      position: 'bottom-left',
      animation: 'slide',
    });
  });

  it('expands `miniPlayer: false` to the canonical object with default position', () => {
    const result = WebPlayerFeatureSchema.parse({ miniPlayer: false });
    expect(result.miniPlayer).toEqual({
      enabled: false,
      position: 'bottom-left',
      animation: 'slide',
    });
  });

  it('accepts `miniPlayer` as a partial object and fills missing fields with defaults', () => {
    const result = WebPlayerFeatureSchema.parse({ miniPlayer: { position: 'top-right' } });
    expect(result.miniPlayer).toEqual({
      enabled: true,
      position: 'top-right',
      animation: 'slide',
    });
  });

  it('accepts `miniPlayer` with an explicit animation preset', () => {
    const result = WebPlayerFeatureSchema.parse({ miniPlayer: { animation: 'pop' } });
    expect(result.miniPlayer).toEqual({
      enabled: true,
      position: 'bottom-left',
      animation: 'pop',
    });
  });

  it('accepts `miniPlayer` with an offset object position', () => {
    const result = WebPlayerFeatureSchema.parse({
      miniPlayer: { enabled: false, position: { bottom: '120px', left: '24px' } },
    });
    expect(result.miniPlayer).toEqual({
      enabled: false,
      position: { bottom: '120px', left: '24px' },
      animation: 'slide',
    });
  });
});

describe('WebPlayerFeatureSchema playback overrides', () => {
  it('omits voice/rate/pitch/volume by default (inherit from website default)', () => {
    const result = WebPlayerFeatureSchema.parse({});
    expect(result.voice).toBeUndefined();
    expect(result.rate).toBeUndefined();
    expect(result.pitch).toBeUndefined();
    expect(result.volume).toBeUndefined();
  });

  it('accepts a string voice selector', () => {
    const result = WebPlayerFeatureSchema.parse({ voice: 'US English Male' });
    expect(result.voice).toBe('US English Male');
  });

  it('accepts a regex-literal voice selector', () => {
    const result = WebPlayerFeatureSchema.parse({
      voice: { regex: 'Portuguese', flags: 'i' },
    });
    expect(result.voice).toEqual({ regex: 'Portuguese', flags: 'i' });
  });

  it('accepts a structured-query voice selector', () => {
    const result = WebPlayerFeatureSchema.parse({
      voice: { lang: 'pt-BR', gender: 'female' },
    });
    expect(result.voice).toEqual({ lang: 'pt-BR', gender: 'female' });
  });

  it('accepts rate-only override', () => {
    const result = WebPlayerFeatureSchema.parse({ enabled: true, rate: 1.2 });
    expect(result.rate).toBe(1.2);
    expect(result.voice).toBeUndefined();
  });

  it('accepts voice + rate together', () => {
    const result = WebPlayerFeatureSchema.parse({
      voice: 'US English Male',
      rate: 0.9,
    });
    expect(result.voice).toBe('US English Male');
    expect(result.rate).toBe(0.9);
  });

  it('rejects out-of-range rate', () => {
    expect(() => WebPlayerFeatureSchema.parse({ rate: 5 })).toThrow();
  });

  it('rejects out-of-range volume', () => {
    expect(() => WebPlayerFeatureSchema.parse({ volume: 1.5 })).toThrow();
  });
});
