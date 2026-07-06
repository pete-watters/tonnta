import { AppFooter } from '@/components/app-footer';
import { HomeView } from '@/components/home-view';
import { loadSpotConditions } from '@/lib/conditions';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const conditions = await loadSpotConditions();

  return (
    <main>
      <HomeView conditions={conditions} />
      <AppFooter />
    </main>
  );
}
