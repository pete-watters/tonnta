import { createAnimations } from '@tamagui/animations-react-native';
import { shorthands } from '@tamagui/shorthands';
import { createFont, createTamagui, createTokens } from 'tamagui';

import { colors } from './src/theme/colors';
import { radius, size, space, zIndex } from './src/theme/spacing';

/**
 * Tonnta Tamagui Configuration
 * ----------------------------
 * Tokens are documented in docs/DESIGN.md ("Irish Sea, dawn patrol").
 * `src/theme/*` is the single source of truth for raw values; this file maps
 * them into Tamagui tokens, fonts and the two themes (dawn = dark default,
 * day = light).
 */

// ─────────────────────────────────────────────────────────────────────────────
// Animations
// ─────────────────────────────────────────────────────────────────────────────

const animations = createAnimations({
  fast: {
    type: 'timing',
    duration: 120,
  },
  medium: {
    type: 'timing',
    duration: 250,
  },
  slow: {
    type: 'timing',
    duration: 350,
  },
  // Verdict reveal on load — one orchestrated moment, ease-out
  swell: {
    type: 'timing',
    duration: 900,
  },
  // Ambient loop (live buoy freshness dot)
  pulse: {
    type: 'timing',
    duration: 1500,
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Fonts
// ─────────────────────────────────────────────────────────────────────────────

/** Display — verdicts, wave heights, the big numbers. */
const clashDisplay = createFont({
  family: 'Clash Display, -apple-system, BlinkMacSystemFont, sans-serif',
  size: {
    1: 14, // board pill
    2: 16, // card feature numbers
    3: 20, // section feature
    4: 24, // day-strip wave height
    5: 32, // secondary hero stats
    6: 44, // wave height hero
    7: 64, // verdict, mobile
    8: 88, // verdict, desktop
  },
  lineHeight: {
    1: 18,
    2: 20,
    3: 24,
    4: 28,
    5: 36,
    6: 48,
    7: 66,
    8: 90,
  },
  weight: {
    1: '500',
    2: '600',
    3: '700',
  },
  letterSpacing: {
    1: 0,
    2: -0.5,
    3: -1,
    4: -1.5,
    5: -2,
  },
  face: {
    500: { normal: 'ClashDisplay-Medium' },
    600: { normal: 'ClashDisplay-Semibold' },
    700: { normal: 'ClashDisplay-Bold' },
  },
});

/** Body/UI — labels, copy, settings. */
const generalSans = createFont({
  family: 'General Sans, -apple-system, BlinkMacSystemFont, sans-serif',
  size: {
    1: 11, // tiny meta / eyebrow
    2: 12, // captions, chips
    3: 13, // secondary body
    4: 14, // body
    5: 15, // emphasised body
    6: 16, // card headings
    7: 18, // section headings
    8: 22, // page titles
  },
  lineHeight: {
    1: 14,
    2: 16,
    3: 18,
    4: 20,
    5: 22,
    6: 22,
    7: 24,
    8: 28,
  },
  weight: {
    1: '400',
    2: '500',
    3: '600',
    4: '700',
  },
  letterSpacing: {
    1: 0,
    2: 0.02,
    3: 0.08, // uppercase eyebrows (Irish labels)
  },
  face: {
    400: { normal: 'GeneralSans-Regular' },
    500: { normal: 'GeneralSans-Medium' },
    600: { normal: 'GeneralSans-Semibold' },
    700: { normal: 'GeneralSans-Bold' },
  },
});

/** Data — forecast tables, tide times, buoy readouts. Tabular, instrument-like. */
const splineMono = createFont({
  family: 'Spline Sans Mono, ui-monospace, SFMono-Regular, monospace',
  size: {
    1: 10, // dense table meta
    2: 11, // tide times
    3: 12, // table data
    4: 13, // emphasised data
    5: 15, // inline readouts
    6: 20, // buoy live numbers
  },
  lineHeight: {
    1: 14,
    2: 15,
    3: 16,
    4: 18,
    5: 20,
    6: 26,
  },
  weight: {
    1: '400',
    2: '500',
    3: '600',
  },
  letterSpacing: {
    1: 0,
    2: 0.04,
  },
  face: {
    400: { normal: 'SplineSansMono-Regular' },
    500: { normal: 'SplineSansMono-Medium' },
    600: { normal: 'SplineSansMono-SemiBold' },
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Tokens
// ─────────────────────────────────────────────────────────────────────────────

const tokens = createTokens({
  color: colors,
  space,
  size,
  radius,
  zIndex,
});

// ─────────────────────────────────────────────────────────────────────────────
// Themes — dawn (dark, default) and day (light)
// ─────────────────────────────────────────────────────────────────────────────

const dawn = {
  // Surfaces
  background: colors.harbour,
  surface: colors.harbour2,
  surfaceRaised: colors.harbour3,
  border: colors.borderOnDark,
  borderStrong: colors.borderStrongOnDark,

  // Text
  color: colors.inkOnDark,
  colorMuted: colors.mutedOnDark,
  colorSubtle: colors.subtleOnDark,

  // Signal — spent only on verdict, alerts, primary CTA
  accent: colors.dawnAmber,
  accentContrast: colors.harbour,

  // Semantic
  positive: colors.seaGlass,
  danger: colors.kelpRed,

  // Verdict washes
  goBg: colors.goBg,
  maybeBg: colors.maybeBg,
  blownBg: colors.blownBg,

  // Sea-state ladder (hero + day swatches)
  seaFlat: colors.seaFlat,
  seaClean: colors.seaClean,
  seaMarginal: colors.seaMarginal,
  seaBlown: colors.seaBlown,
  seaBase: colors.seaNight,
};

const day = {
  ...dawn,
  background: colors.fog,
  surface: colors.fog2,
  surfaceRaised: colors.white,
  border: colors.borderOnLight,
  borderStrong: colors.borderStrongOnLight,

  color: colors.inkOnLight,
  colorMuted: colors.mutedOnLight,
  colorSubtle: colors.subtleOnLight,

  accent: colors.dawnAmberDeep,
  accentContrast: colors.white,

  positive: colors.seaGlassDeep,
  danger: colors.kelpRedDeep,

  goBg: colors.goBgLight,
  maybeBg: colors.maybeBgLight,
  blownBg: colors.blownBgLight,

  seaBase: colors.seaFlat,
};

// ─────────────────────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────────────────────

export const config = createTamagui({
  settings: {
    defaultFont: 'body',
    shouldAddPrefersColorThemes: false,
    addThemeClassName: false,
  },
  animations,
  fonts: {
    display: clashDisplay,
    body: generalSans,
    mono: splineMono,
  },
  themes: {
    dawn,
    day,
  },
  tokens,
  shorthands,
  media: {
    sm: { maxWidth: 680 },
    md: { maxWidth: 960 },
    lg: { minWidth: 961 },
  },
});

export default config;

export type AppConfig = typeof config;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}
