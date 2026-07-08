/**
 * Theme registry — the three redesign directions become selectable looks
 * over one shared skeleton. Components never hard-code colour: they read
 * tokens from the active theme. Heroes are the one per-theme structural
 * element, resolved by the `hero` discriminator in home-view.
 *
 * This PR ships `eiri` (default) and `dawn-v1` (the launch look, kept
 * pixel-identical). `cairt` and `postaer` land as follow-ups on the same
 * token contract.
 */

export type ThemeId = 'eiri' | 'dawn-v1';

export type HeroKind = 'eiri' | 'legacy';

export interface SeaTokens {
  go: string;
  maybe: string;
  flat: string;
  blown: string;
}

export interface ThemeTokens {
  /** Page + chrome */
  bg: string;
  nav: string;
  surface: string;
  border: string;
  accentBorder: string;
  /** Text ladder */
  text: string;
  textMuted: string;
  textSoft: string;
  textSubtle: string;
  /** Signal + semantic */
  accent: string;
  accentContrast: string;
  accentSoftBg: string;
  positive: string;
  danger: string;
  dangerBorder: string;
  dangerBg: string;
  /** Toggle */
  toggleActiveBg: string;
  toggleActiveText: string;
  /** Sea-state ladder (bands + day-strip swatches) */
  sea: SeaTokens;
  /** Static hero wash used by legacy + Snámh heroes */
  heroGradient: string;
}

export interface AppTheme {
  id: ThemeId;
  name: string;
  irishName: string;
  description: string;
  swatch: [string, string, string];
  hero: HeroKind;
  tokens: ThemeTokens;
}

/** The launch palette, unchanged — components migrated to tokens must render
 *  exactly these values under dawn-v1. */
const DAWN_V1_TOKENS: ThemeTokens = {
  bg: '#0C1B22',
  nav: '#0C1B22',
  surface: '#122630',
  border: '#22404C',
  accentBorder: 'rgba(232,163,61,0.4)',
  text: '#E8ECEB',
  textMuted: '#C6D2D2',
  textSoft: '#A9BDBF',
  textSubtle: '#6E8A90',
  accent: '#E8A33D',
  accentContrast: '#0C1B22',
  accentSoftBg: 'rgba(232,163,61,0.14)',
  positive: '#8FC1B5',
  danger: '#C4553B',
  dangerBorder: 'rgba(196,85,59,0.5)',
  dangerBg: 'rgba(196,85,59,0.12)',
  toggleActiveBg: '#E8ECEB',
  toggleActiveText: '#0C1B22',
  sea: { go: '#5E9A8C', maybe: '#557D86', flat: '#9FB8B3', blown: '#4A5A61' },
  heroGradient: 'linear-gradient(180deg, #0C1B22 0%, #0E2129 60%, #16323B 100%)',
};

/** Éirí chrome sits slightly deeper and warmer than dawn-v1 so the sky owns
 *  the light; the hero itself is painted live by the solar engine. */
const EIRI_TOKENS: ThemeTokens = {
  ...DAWN_V1_TOKENS,
  bg: '#0B161E',
  nav: '#0B161E',
  surface: '#10222B',
  border: '#1F3A46',
  text: '#F2EDE4',
  textMuted: '#D5D5C9',
  textSoft: '#AEC0BD',
  heroGradient: 'linear-gradient(180deg, #10142E 0%, #16323B 55%, #1D3D44 100%)',
};

export const THEMES: readonly AppTheme[] = [
  {
    id: 'eiri',
    name: 'Éirí',
    irishName: 'Éirí',
    description: 'The dawn window — the sky in the app is the sky outside, minute by minute.',
    swatch: ['#10142E', '#E8A33D', '#12333A'],
    hero: 'eiri',
    tokens: EIRI_TOKENS,
  },
  {
    id: 'dawn-v1',
    name: 'Dawn patrol',
    irishName: 'Camchuairt na maidine',
    description: 'The launch look — harbour ink and the living sea bands.',
    swatch: ['#0C1B22', '#8FC1B5', '#E8A33D'],
    hero: 'legacy',
    tokens: DAWN_V1_TOKENS,
  },
];

export const DEFAULT_THEME_ID: ThemeId = 'eiri';

export function resolveThemeId(stored: unknown): ThemeId {
  if (typeof stored === 'string') {
    const match = THEMES.find((theme) => theme.id === stored);
    if (match !== undefined) {
      return match.id;
    }
  }
  return DEFAULT_THEME_ID;
}

export function getTheme(id: ThemeId): AppTheme {
  const match = THEMES.find((theme) => theme.id === id);
  if (match !== undefined) {
    return match;
  }
  const fallback = THEMES[0];
  if (fallback === undefined) {
    throw new Error('Theme registry is empty');
  }
  return fallback;
}
