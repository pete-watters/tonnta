import { AlertCard } from '@/components/alert-card';
import { AppFooter } from '@/components/app-footer';
import {
  BuoyCard,
  DayStrip,
  NextWindowCard,
  TideCard,
  Warnings,
} from '@/components/forecast-sections';
import { SeaHero } from '@/components/sea-hero';
import { loadSpotConditions } from '@/lib/conditions';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const conditions = await loadSpotConditions();

  return (
    <main>
      <SeaHero spot={conditions.spot} verdict={conditions.now} hour={conditions.currentHour} />
      <div
        style={{
          maxWidth: 720,
          margin: '0 auto',
          padding: '28px 24px 8px',
          display: 'grid',
          gap: 16,
        }}
      >
        <Warnings warnings={conditions.warnings} />
        {conditions.nextWindow !== undefined && conditions.now.verdict !== 'go' ? (
          <NextWindowCard window={conditions.nextWindow} spot={conditions.spot} />
        ) : null}
        <DayStrip days={conditions.days} spot={conditions.spot} />
        {conditions.buoy !== undefined ? (
          <BuoyCard buoy={conditions.buoy} spot={conditions.spot} />
        ) : null}
        <TideCard tides={conditions.tides} spot={conditions.spot} />
        <AlertCard spotId={conditions.spot.id} />
      </div>
      <AppFooter />
    </main>
  );
}
