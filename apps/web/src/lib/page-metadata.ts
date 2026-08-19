import type { Metadata } from 'next';
import { headers } from 'next/headers';

import { buildRobotsMetadata } from '@/lib/discoverability';
import { isProductionHost } from '@/lib/site';

/**
 * Indexing directives for whichever host served this request. Cloudflare
 * Pages does not put `X-Robots-Tag: noindex` on this project's previews
 * (verified against the live *.pages.dev hosts), so the app has to say it.
 */
export async function indexingMetadata(): Promise<Pick<Metadata, 'robots'>> {
  const requestHeaders = await headers();
  return { robots: buildRobotsMetadata(isProductionHost(requestHeaders.get('host'))) };
}
