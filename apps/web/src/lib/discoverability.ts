import type { Metadata, MetadataRoute } from 'next';

/**
 * Crawler-facing artefacts: the robots.txt body and the sitemap entries.
 *
 * These live here rather than in the `app/` file-convention routes so they
 * are plain functions we can assert on — the route handlers are thin shells
 * that pass the request host in and hand the string back out.
 */

/** Machine-facing paths a crawler gains nothing from fetching. */
const DISALLOWED_PATHS: readonly string[] = ['/mcp', '/api/'];

/** Public routes, in the order a reader would meet them. */
const PUBLIC_PATHS: readonly { path: string; priority: number }[] = [
  { path: '/', priority: 1 },
  { path: '/log', priority: 0.6 },
  { path: '/pro', priority: 0.5 },
];

export interface RobotsOptions {
  /** Absolute origin used for the Sitemap: line, no trailing slash. */
  siteUrl: string;
  /** False for previews and local dev — the whole host is then disallowed. */
  indexable: boolean;
}

function trimOrigin(siteUrl: string): string {
  return siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl;
}

/**
 * Hand-written rather than Next's `MetadataRoute.Robots`: that API has no
 * escape hatch for the Content Signals `Content-Signal:` directive, which is
 * the point of shipping our own robots.txt at all.
 */
export function buildRobotsTxt({ siteUrl, indexable }: RobotsOptions): string {
  const origin = trimOrigin(siteUrl);

  if (!indexable) {
    return [
      '# Not the live site — a preview or local build of tonnta.surf.',
      '# Nothing served from this host should be indexed or reused.',
      'User-agent: *',
      'Disallow: /',
      '',
    ].join('\n');
  }

  return [
    '# Tonnta — surf conditions for Donabate, Co. Dublin.',
    '#',
    '# Content Signals Policy — https://developers.cloudflare.com/ai-crawl-control/',
    '#   search:   search engines building an index and showing links/excerpts',
    '#   ai-input: real-time use in generative AI answers (e.g. RAG)',
    '#   ai-train: use as training or fine-tuning data',
    'User-agent: *',
    'Content-Signal: search=yes, ai-input=yes, ai-train=no',
    'Allow: /',
    ...DISALLOWED_PATHS.map((path) => `Disallow: ${path}`),
    '',
    '# Agent-facing endpoints — not worth crawling, but here is where they live:',
    `#   MCP (JSON-RPC 2.0 over POST): ${origin}/mcp`,
    `#   Site guide for LLMs:          ${origin}/llms.txt`,
    '',
    `Sitemap: ${origin}/sitemap.xml`,
    '',
  ].join('\n');
}

/** Every public route, newest-modified first is irrelevant here — order is stable. */
export function buildSitemapEntries(siteUrl: string, lastModified: Date): MetadataRoute.Sitemap {
  const origin = trimOrigin(siteUrl);
  return PUBLIC_PATHS.map(({ path, priority }) => ({
    url: path === '/' ? `${origin}/` : `${origin}${path}`,
    lastModified,
    changeFrequency: path === '/' ? 'hourly' : 'monthly',
    priority,
  }));
}

/**
 * The `<meta name="robots">` directives for a host.
 *
 * This is applied per public page rather than in the root layout on purpose:
 * reading the request host in the root layout would opt `/_not-found` into
 * dynamic rendering, which @cloudflare/next-on-pages refuses to build. Every
 * URL in the sitemap goes through a page that calls this, so the coverage is
 * the same.
 */
export function buildRobotsMetadata(indexable: boolean): Metadata['robots'] {
  if (!indexable) {
    return { index: false, follow: false };
  }
  return {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  };
}
