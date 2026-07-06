export const SITE_NAME = 'Tonnta';
export const SITE_TAGLINE = 'Is it worth going down?';
export const SITE_DESCRIPTION =
  'Live surf conditions, verdict and board call for Donabate — waves, wind, tides and alerts.';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tonnta.surf';

/** Alert worker origin + VAPID public key — deploy constants, not secrets. */
export const ALERTS_URL =
  process.env.NEXT_PUBLIC_ALERTS_URL ?? 'https://tonnta-worker.pete-9c4.workers.dev';
export const VAPID_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ??
  'BKlE-_RCvR9BEgzGRE4i51xQlYaG9yK-DxVHAldx_7rT7_Sin28Ua_AWhmj-mkKFaj77LkTRALJadRJMpcWH3O4';
