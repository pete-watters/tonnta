/**
 * Tonnta colour tokens — "Irish Sea, dawn patrol"
 * ------------------------------------------------
 * The Irish Sea is cold green-grey water under silver light; the palette is
 * built from that, not from tropical-surf blue. `dawnAmber` is the single
 * signal colour and is spent only on the verdict, alerts and primary CTAs.
 *
 * Source of truth for every surface in web + native. Documented in
 * docs/DESIGN.md.
 */

export const colors = {
  // Core brand
  harbour: '#0C1B22', // deep ink-navy — dark background / ink text on light
  harbour2: '#122630', // raised surface on dark
  harbour3: '#1A343F', // higher elevation / hover on dark
  seaGlass: '#8FC1B5', // cold green — positive, clean conditions
  seaGlassDeep: '#4E8577', // sea-glass with AA contrast on fog
  slateSwell: '#3E5C66', // mid sea tone — secondary text on light, borders on dark
  fog: '#E8ECEB', // silver light — light background / text on dark
  fog2: '#F4F6F5', // raised surface on light
  dawnAmber: '#E8A33D', // THE signal: GO verdict, alerts, CTA
  dawnAmberDeep: '#B77A1E', // amber with AA contrast on fog
  kelpRed: '#C4553B', // blown out / warnings only
  kelpRedDeep: '#A33F28',

  // Text ladders
  inkOnLight: '#0C1B22',
  mutedOnLight: '#3E5C66',
  subtleOnLight: '#64808A',
  inkOnDark: '#E8ECEB',
  mutedOnDark: '#A9BDBF',
  subtleOnDark: '#6E8A90',

  // Borders
  borderOnLight: '#D5DDDC',
  borderStrongOnLight: '#B9C6C5',
  borderOnDark: '#22404C',
  borderStrongOnDark: '#31525F',

  // Sea-state ladder (drives the living hero + day swatches)
  seaFlat: '#9FB8B3', // ciúin — pale, still
  seaClean: '#5E9A8C', // téigh — ordered green rollers
  seaMarginal: '#557D86', // b'fhéidir — greyer, mixed
  seaBlown: '#4A5A61', // séidte — desaturated chop
  seaNight: '#0E2129', // hero base at night

  // Verdict tints (background washes behind verdict content)
  goBg: '#123229',
  goBgLight: '#E3F0EB',
  maybeBg: '#20323A',
  maybeBgLight: '#E7EDEF',
  blownBg: '#331F1A',
  blownBgLight: '#F4E6E2',

  // Utility
  white: '#FFFFFF',
  transparent: 'rgba(0,0,0,0)',
} as const;

export type ColorToken = keyof typeof colors;
