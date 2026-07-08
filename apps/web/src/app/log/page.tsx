import Link from 'next/link';

import { SessionLogger } from '@/components/diary/session-logger';
import { loadSpotConditions } from '@/lib/conditions';
import type { SessionConditions } from '@/lib/diary';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Session log',
};

export default async function LogPage() {
  const conditions = await loadSpotConditions();

  let current: SessionConditions | undefined;
  if (conditions.currentHour !== undefined) {
    current = {
      waveHeightM: conditions.currentHour.waveHeightM,
      wavePeriodS: conditions.currentHour.wavePeriodS,
      windSpeedKmh: conditions.currentHour.windSpeedKmh,
      windState: conditions.currentHour.windState,
      verdict: conditions.now.verdict,
    };
    if (conditions.currentHour.seaTempC !== undefined) {
      current.seaTempC = conditions.currentHour.seaTempC;
    }
  }

  return (
    <main
      style={{
        maxWidth: 720,
        margin: '0 auto',
        padding: '28px 24px 48px',
        display: 'grid',
        gap: 16,
      }}
    >
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Link
          href="/"
          style={{
            fontFamily: "'Clash Display', sans-serif",
            fontWeight: 600,
            fontSize: 22,
            letterSpacing: -0.5,
          }}
        >
          tonnta<span style={{ color: '#E8A33D' }}>.</span>
        </Link>
        <span
          style={{ fontFamily: "'Spline Sans Mono', monospace", fontSize: 12, color: '#A9BDBF' }}
        >
          {conditions.spot.name}
        </span>
      </nav>

      <header>
        <p
          style={{
            margin: 0,
            fontSize: 11,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: '#6E8A90',
          }}
        >
          Loga · Session log
        </p>
        <h1
          style={{
            margin: '4px 0 0',
            fontFamily: "'Clash Display', sans-serif",
            fontWeight: 700,
            fontSize: 32,
            letterSpacing: '-0.02em',
          }}
        >
          How was it?
        </h1>
      </header>

      <SessionLogger spotId={conditions.spot.id} current={current} />
    </main>
  );
}
