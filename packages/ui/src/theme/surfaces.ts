import type { ThemeName } from '@tonnta/types';

import { seaDawnGradient, seaDayGradient, seaHeroGradient } from './gradients';

export function resolveThemeName(name: string): ThemeName {
  return name === 'day' ? 'day' : 'dawn';
}

export type FeatureSurfaceVariant = 'panel' | 'hero';

export interface FeatureSurfaceStyle {
  backgroundImage?: string;
  borderWidth: number;
}

export function featureSurfaceStyle(
  theme: ThemeName,
  variant: FeatureSurfaceVariant
): FeatureSurfaceStyle {
  if (theme === 'day') {
    return variant === 'hero'
      ? { backgroundImage: seaDayGradient, borderWidth: 0 }
      : { borderWidth: 1 };
  }
  return {
    backgroundImage: variant === 'hero' ? seaHeroGradient : seaDawnGradient,
    borderWidth: 0,
  };
}
