/**
 * Tonnta sea gradients
 * --------------------
 * The hero surface is a living sea; these are its base washes. The animated
 * bands render on top (see the SeaState component in apps/web), so the
 * gradients stay simple: water below, light above.
 */
import { colors } from './colors';

export const seaDawnGradient = `linear-gradient(180deg, ${colors.harbour} 0%, ${colors.seaNight} 45%, ${colors.seaClean} 140%)`;

export const seaDayGradient = `linear-gradient(180deg, ${colors.fog2} 0%, ${colors.fog} 40%, ${colors.seaFlat} 130%)`;

const DAWN_GLOW = `radial-gradient(90% 60% at 50% -10%, rgba(232,163,61,0.16), transparent 60%)`;

export const seaHeroGradient = `${DAWN_GLOW}, ${seaDawnGradient}`;
