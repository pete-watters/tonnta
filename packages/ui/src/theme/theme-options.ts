import type { ThemeName } from '@tonnta/types';

export interface ThemeOption {
  name: ThemeName;
  label: string;
  description: string;
  swatch: [string, string, string];
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    name: 'dawn',
    label: 'Dawn',
    description: 'Dark harbour water before first light — the default.',
    swatch: ['#0C1B22', '#122630', '#E8A33D'],
  },
  {
    name: 'day',
    label: 'Day',
    description: 'Silver fog and sea glass, for daylight checking.',
    swatch: ['#E8ECEB', '#F4F6F5', '#4E8577'],
  },
];
