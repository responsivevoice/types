// Website configuration — feature flags, web-player config, default voice
// profile, and analytics. The shape returned by `GET /v2/config`.

import { z } from 'zod';
import 'zod-openapi';
import { PitchSchema, RateSchema, SpeechParamsSchema, VolumeSchema } from './synthesis';
import { VoiceSelectorSchema } from './voice-query';

// ============================================================================
// Website Config — GET /v1/config response schemas
// ============================================================================

/**
 * Per-feature configuration. Each feature has `enabled` and optional text/settings.
 */
export const WelcomeMessageFeatureSchema = z.object({
  enabled: z.boolean().default(false),
  text: z.string().nullable().default(null),
});
/** Inferred from {@link WelcomeMessageFeatureSchema}. */
export type WelcomeMessageFeature = z.infer<typeof WelcomeMessageFeatureSchema>;

/** Feature toggle with optional custom text (`speakInactivity`, `speakEndPage`, `exitIntent`). */
export const TextFeatureSchema = z.object({
  enabled: z.boolean().default(false),
  text: z.string().nullable().default(null),
});
/** Inferred from {@link TextFeatureSchema}. */
export type TextFeature = z.infer<typeof TextFeatureSchema>;

/** Simple on/off feature toggle without custom text (`speakSelectedText`, `speakLinks`, etc.). */
export const ToggleFeatureSchema = z.object({
  enabled: z.boolean().default(false),
});
/** Inferred from {@link ToggleFeatureSchema}. */
export type ToggleFeature = z.infer<typeof ToggleFeatureSchema>;

/**
 * Colour tokens that drive the web player's appearance. Each value is a CSS
 * colour string. Applied as CSS custom properties on the player and the
 * article container so paragraph styles inherit them.
 */
export const WebPlayerThemeTokensSchema = z.object({
  /** Mini-player background and the play button icon colour. */
  bg: z.string().optional(),
  /** Foreground text colour — speed label and skip-back / skip-forward icons. */
  fg: z.string().optional(),
  /** Secondary text colour — time label and mini-player status text. */
  muted: z.string().optional(),
  /** Reserved for custom themes; not used by built-in styles. */
  accent: z.string().optional(),
  /** Background colour for the currently-playing paragraph highlight. */
  accentSoft: z.string().optional(),
  /** Paragraph hover background. */
  hover: z.string().optional(),
  /** Mini-player border colour. */
  border: z.string().optional(),
  /** Main player background and the mini-player progress ring track. */
  track: z.string().optional(),
  /** Play button face, progress bar fill, and mini-player ring fill. */
  fill: z.string().optional(),
});
/** Inferred from {@link WebPlayerThemeTokensSchema}. */
export type WebPlayerThemeTokens = z.infer<typeof WebPlayerThemeTokensSchema>;

/**
 * Theme input — either a preset name or a partial token record merged
 * over the `neutral` baseline.
 */
export const WebPlayerThemeSchema = z.union([
  z.enum(['neutral', 'responsivevoice']),
  WebPlayerThemeTokensSchema,
]);
/** Inferred from {@link WebPlayerThemeSchema}. */
export type WebPlayerTheme = z.infer<typeof WebPlayerThemeSchema>;

/**
 * Toggles for the player's in-line controls. The play / pause button is
 * always shown — without it the widget is not a player. `skip` pairs the
 * skip-back and skip-forward buttons together because hiding one but not
 * the other looks visually broken in the reference design.
 */
export const WebPlayerControlsSchema = z.object({
  /** Progress bar showing how much of the article has been narrated. */
  progress: z.boolean().default(true),
  /** Elapsed / total time label (e.g. `0:42 / 3:15`). */
  time: z.boolean().default(true),
  /** Skip-back and skip-forward buttons (jump one paragraph at a time). */
  skip: z.boolean().default(true),
  /** Playback speed button — click to cycle 0.5× through 3×. */
  speed: z.boolean().default(true),
  /** ResponsiveVoice brand icon (links to responsivevoice.org). */
  brand: z.boolean().default(true),
});
/** Inferred from {@link WebPlayerControlsSchema}. */
export type WebPlayerControls = z.infer<typeof WebPlayerControlsSchema>;

/**
 * Toggles for article-level interactions. `paragraphHighlight` is the
 * visual "currently playing" indicator on each paragraph;
 * `paragraphClick` is click-to-jump navigation. They are independent —
 * highlight-only without click is "follow along, no skipping ahead";
 * click-only without highlight is unusual but valid.
 */
export const WebPlayerNavigationSchema = z.object({
  /** Visual "currently playing" indicator on each narrated paragraph. */
  paragraphHighlight: z.boolean().default(true),
  /** Click-to-jump: clicking any paragraph starts narration from that point. */
  paragraphClick: z.boolean().default(true),
});
/** Inferred from {@link WebPlayerNavigationSchema}. */
export type WebPlayerNavigation = z.infer<typeof WebPlayerNavigationSchema>;

/** Mini-player corner placement keywords. */
export const MiniPlayerCornerSchema = z.enum([
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
]);
/** Inferred from {@link MiniPlayerCornerSchema}. */
export type MiniPlayerCorner = z.infer<typeof MiniPlayerCornerSchema>;

/**
 * Mini-player CSS-offset placement. Each side is a CSS length string
 * (e.g. `'80px'`, `'2rem'`, `'5%'`). At least one side is required;
 * `top`+`bottom` and `left`+`right` combinations are rejected.
 */
export const MiniPlayerOffsetSchema = z
  .object({
    top: z.string().optional(),
    right: z.string().optional(),
    bottom: z.string().optional(),
    left: z.string().optional(),
  })
  .refine(
    (v) =>
      v.top !== undefined ||
      v.right !== undefined ||
      v.bottom !== undefined ||
      v.left !== undefined,
    { message: 'at least one offset side must be provided' }
  )
  .refine((v) => !(v.top !== undefined && v.bottom !== undefined), {
    message: 'cannot specify both top and bottom',
  })
  .refine((v) => !(v.left !== undefined && v.right !== undefined), {
    message: 'cannot specify both left and right',
  });
/** Inferred from {@link MiniPlayerOffsetSchema}. */
export type MiniPlayerOffset = z.infer<typeof MiniPlayerOffsetSchema>;

/**
 * Mini-player configuration — visibility and viewport placement. `position`
 * accepts a corner keyword or an offset object; default is `bottom-left`.
 */
export const MiniPlayerSchema = z.object({
  /** Show the floating mini-player when the main player scrolls out of view. */
  enabled: z.boolean().default(true),
  /** Viewport placement — a corner keyword or a CSS-offset object. */
  position: z.union([MiniPlayerCornerSchema, MiniPlayerOffsetSchema]).default('bottom-left'),
  /**
   * Entrance/exit animation. `none` is instant; `fade` opacity-only; `slide`
   * fades and slides from the docked corner; `pop` scales in with a bounce.
   * Forced instant under `prefers-reduced-motion: reduce`.
   */
  animation: z.enum(['none', 'fade', 'slide', 'pop']).default('slide'),
});
/** Inferred from {@link MiniPlayerSchema}. */
export type MiniPlayer = z.infer<typeof MiniPlayerSchema>;

/**
 * Player layout — width and how the main pill sits on the page. Defaults
 * to `shrink + block` (player sized to its content, on its own line),
 * which is the safe choice for arbitrary host pages. Use `fill + inline`
 * to reproduce a full-width player that flows with surrounding text.
 */
export const WebPlayerLayoutSchema = z.object({
  /** Player width: `shrink` sizes to its content, `fill` stretches to fill its container. */
  mode: z.enum(['shrink', 'fill']).default('shrink'),
  /** How the player sits on the page: `block` takes its own line, `inline` flows with surrounding text. */
  display: z.enum(['inline', 'block']).default('block'),
});
/** Inferred from {@link WebPlayerLayoutSchema}. */
export type WebPlayerLayout = z.infer<typeof WebPlayerLayoutSchema>;

/**
 * Narration text sanitization. When `enabled`, non-rendered nodes
 * (`script`/`style`), interactive controls, embedded media, and hidden
 * content are excluded from narrated text; `false` narrates raw text.
 */
export const WebPlayerSanitizeSchema = z.object({
  /** Strip non-narratable nodes from narrated text. */
  enabled: z.boolean().default(true),
  /** Extra CSS selectors to exclude, composed with the built-in list. */
  exclude: z.array(z.string()).default([]),
});
/** Inferred from {@link WebPlayerSanitizeSchema}. */
export type WebPlayerSanitize = z.infer<typeof WebPlayerSanitizeSchema>;

/**
 * Web player feature — an article-scoped player with paragraph
 * highlighting, click-to-jump navigation, and a floating mini-player that
 * appears when the main player scrolls out of view.
 *
 * Per-player playback overrides (`voice`, `rate`, `pitch`, `volume`) mirror
 * the arguments of `core.speak(text, voice, params)`. Each is optional and
 * leaf-merges over the website default voice profile from
 * {@link WebsiteVoiceSchema}.
 */
export const WebPlayerFeatureSchema = z.object({
  /** Turn the player on. */
  enabled: z.boolean().default(false),
  /** CSS selector for the article element to attach the player to (default: the first `<article>` on the page). */
  selector: z.string().default('article'),
  /** CSS selector for the elements inside the article to narrate (paragraphs, headings, list items). */
  paragraphSelector: z.string().default('p, h2, h3, li'),
  /**
   * Where the player is placed. Either a keyword (relative to `selector`)
   * or an object specifying a custom mount target.
   *
   * - `'before' | 'after' | 'inline'` — sibling before/after, or first
   *   child of `selector`.
   * - `{ target, at }` — relative to the element matching `target`. `at`
   *   accepts `'inside' | 'before' | 'after'`, defaults to `'inside'`.
   */
  position: z
    .union([
      z.enum(['inline', 'before', 'after']),
      z.object({
        target: z.string({
          error:
            'target is required when position is an object; ' +
            "use a keyword ('inline' | 'before' | 'after') for the article-relative case",
        }),
        at: z.enum(['inside', 'before', 'after']).default('inside'),
      }),
    ])
    .default('before'),
  /** Colour theme — a preset name or a partial set of overrides merged over the `'neutral'` defaults. */
  theme: WebPlayerThemeSchema.default('neutral'),
  /** Show or hide individual controls (progress bar, time, skip, speed, brand). */
  controls: WebPlayerControlsSchema.default(() => WebPlayerControlsSchema.parse({})),
  /** Toggle paragraph highlighting and click-to-jump navigation. */
  navigation: WebPlayerNavigationSchema.default(() => WebPlayerNavigationSchema.parse({})),
  /** Main-pill width and page flow. */
  layout: WebPlayerLayoutSchema.default(() => WebPlayerLayoutSchema.parse({})),
  /**
   * Floating mini-player. Boolean shorthand maps to `{ enabled, position }`
   * with the default `'bottom-left'` corner.
   */
  miniPlayer: z
    .preprocess((v) => (typeof v === 'boolean' ? { enabled: v } : v), MiniPlayerSchema)
    .default(() => MiniPlayerSchema.parse({})),
  /**
   * Voice to narrate this player. Same {@link VoiceSelector} grammar as
   * `core.speak()`'s second argument — name string, regex literal, or
   * structured query. Inherits the website default voice when omitted.
   */
  voice: VoiceSelectorSchema.optional(),
  /** Exclude non-narratable content (scripts, styles, controls, media) from narration. */
  sanitize: WebPlayerSanitizeSchema.default(() => WebPlayerSanitizeSchema.parse({})),
  ...SpeechParamsSchema.shape,
});
/** Inferred from {@link WebPlayerFeatureSchema}. */
export type WebPlayerFeature = z.infer<typeof WebPlayerFeatureSchema>;

/** Baseline defaults applied when a website config omits a feature flag. */
export const DEFAULT_WEBSITE_FEATURES = {
  welcomeMessage: { enabled: false, text: null },
  speakSelectedText: { enabled: false },
  speakLinks: { enabled: false },
  speakInactivity: { enabled: false, text: null },
  speakEndPage: { enabled: false, text: null },
  exitIntent: { enabled: false, text: null },
  accessibilityNavigation: { enabled: false },
  paragraphNavigation: { enabled: false },
  webPlayer: {
    enabled: false,
    selector: 'article',
    paragraphSelector: 'p, h2, h3, li',
    position: 'before',
    theme: 'neutral',
    controls: {
      progress: true,
      time: true,
      skip: true,
      speed: true,
      brand: true,
    },
    navigation: {
      paragraphHighlight: true,
      paragraphClick: true,
    },
    layout: {
      mode: 'shrink',
      display: 'block',
    },
    miniPlayer: { enabled: true, position: 'bottom-left', animation: 'slide' },
    sanitize: { enabled: true, exclude: [] as string[] },
  },
  welcomeMessageOnce: false,
} as const;

/** Aggregated per-website feature flags returned by `GET /v2/config`. */
export const WebsiteFeaturesSchema = z.object({
  welcomeMessage: WelcomeMessageFeatureSchema.default(
    () => DEFAULT_WEBSITE_FEATURES.welcomeMessage
  ),
  speakSelectedText: ToggleFeatureSchema.default(() => DEFAULT_WEBSITE_FEATURES.speakSelectedText),
  speakLinks: ToggleFeatureSchema.default(() => DEFAULT_WEBSITE_FEATURES.speakLinks),
  speakInactivity: TextFeatureSchema.default(() => DEFAULT_WEBSITE_FEATURES.speakInactivity),
  speakEndPage: TextFeatureSchema.default(() => DEFAULT_WEBSITE_FEATURES.speakEndPage),
  exitIntent: TextFeatureSchema.default(() => DEFAULT_WEBSITE_FEATURES.exitIntent),
  accessibilityNavigation: ToggleFeatureSchema.default(
    () => DEFAULT_WEBSITE_FEATURES.accessibilityNavigation
  ),
  paragraphNavigation: ToggleFeatureSchema.default(
    () => DEFAULT_WEBSITE_FEATURES.paragraphNavigation
  ),
  webPlayer: WebPlayerFeatureSchema.default(() => DEFAULT_WEBSITE_FEATURES.webPlayer),
  welcomeMessageOnce: z.boolean().default(DEFAULT_WEBSITE_FEATURES.welcomeMessageOnce),
});
/** Inferred from {@link WebsiteFeaturesSchema}. */
export type WebsiteFeatures = z.infer<typeof WebsiteFeaturesSchema>;

/**
 * Voice profile from the dashboard — curated subset of voice_profiles table.
 */
export const WebsiteVoiceSchema = z.object({
  name: z.string().default('UK English Female'),
  pitch: PitchSchema.default(1),
  rate: RateSchema.default(1),
  volume: VolumeSchema.default(1),
});
/** Inferred from {@link WebsiteVoiceSchema}. */
export type WebsiteVoice = z.infer<typeof WebsiteVoiceSchema>;

/**
 * Analytics configuration.
 */
export const WebsiteAnalyticsSchema = z.object({
  enabled: z.boolean().default(false),
});
/** Inferred from {@link WebsiteAnalyticsSchema}. */
export type WebsiteAnalytics = z.infer<typeof WebsiteAnalyticsSchema>;

/**
 * Short-lived bearer token returned by `/v2/config`. The SDK carries it as
 * `Authorization: Bearer <token>` on subsequent /v2/* requests. May be absent.
 */
export const AuthTokenSchema = z
  .object({
    /** Bearer token. */
    token: z.string(),
    /** Token expiry, unix seconds. */
    exp: z.number(),
  })
  .meta({ ref: 'AuthToken' });
/** Inferred from {@link AuthTokenSchema}. */
export type AuthToken = z.infer<typeof AuthTokenSchema>;

/**
 * Full website config response from GET /v2/config.
 */
export const WebsiteConfigResponseSchema = z
  .object({
    features: WebsiteFeaturesSchema.default(() => DEFAULT_WEBSITE_FEATURES),
    voice: WebsiteVoiceSchema.default(() => ({
      name: 'UK English Female',
      pitch: 1,
      rate: 1,
      volume: 1,
    })),
    analytics: WebsiteAnalyticsSchema.default(() => ({ enabled: false })),
    auth: AuthTokenSchema.optional(),
  })
  .meta({ ref: 'WebsiteConfigResponse', description: 'Website configuration response' });
/** Inferred from {@link WebsiteConfigResponseSchema}. */
export type WebsiteConfigResponse = z.infer<typeof WebsiteConfigResponseSchema>;
