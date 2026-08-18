import type { Metadata } from 'next';

import { AppFooter } from '@/components/app-footer';
import { HomeView } from '@/components/home-view';
import { JsonLd } from '@/components/json-ld';
import { WebMcpTools } from '@/components/webmcp-tools';
import { loadSpotConditions } from '@/lib/conditions';
import { indexingMetadata } from '@/lib/page-metadata';
import { buildHomeGraph } from '@/lib/structured-data';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const BASE_METADATA: Metadata = {
  title: 'Is it worth surfing in Donabate today?',
  description:
    'Is it worth surfing in Donabate today? Live verdict, wave height, wind, tides and the board call for Donabate beach, Co. Dublin — rechecked every 15 minutes.',
  alternates: { canonical: '/' },
};

export async function generateMetadata(): Promise<Metadata> {
  return { ...BASE_METADATA, ...(await indexingMetadata()) };
}

export default async function HomePage() {
  const conditions = await loadSpotConditions();

  return (
    <>
      <HomeView conditions={conditions} />
      <AppFooter />
      <JsonLd data={buildHomeGraph(conditions.spot, new Date())} />
      <WebMcpTools />
    </>
  );
}
