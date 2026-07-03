'use client';

import { useEffect, useState } from 'react';

import {
  BuoyCard,
  DayStrip,
  NextWindowCard,
  TideCard,
  Warnings,
} from '@/components/forecast-sections';
import { SeaHero } from '@/components/sea-hero';
import { SnamhHero } from '@/components/snamh-hero';
import { SwimWindowsCard } from '@/components/snamh-sections';
import type { SpotConditions } from '@/lib/conditions';

/**
 * One spot, two audiences: Tonn (surf) and Snámh (swim) read the same sea.
 * The toggle persists per device — a swimmer opens straight into swim mode.
 */

type Mode = 'surf' | 'snamh';

const MODE_KEY = 'tonnta-mode';

function useMode(): [Mode, (mode: Mode) => void] {
  const [mode, setMode] = useState<Mode>('surf');

  useEffect(() => {
    const stored = window.localStorage.getItem(MODE_KEY);
    if (stored === 'snamh') {
      setMode('snamh');
    }
  }, []);

  function update(next: Mode): void {
    setMode(next);
    window.localStorage.setItem(MODE_KEY, next);
  }

  return [mode, update];
}

function ModeToggle({ mode, onChange }: { mode: Mode; onChange: (mode: Mode) => void }) {
  const options: { value: Mode; label: string }[] = [
    { value: 'surf', label: 'Tonn · surf' },
    { value: 'snamh', label: 'Snámh · swim' },
  ];
  return (
    <div
      role="tablist"
      aria-label="Surf or swim conditions"
      style={{
        display: 'inline-flex',
        gap: 4,
        padding: 4,
        borderRadius: 999,
        border: '1px solid #22404C',
        background: '#0E2129',
      }}
    >
      {options.map((option) => {
        const active = option.value === mode;
        return (
          <button
            key={option.value}
            role="tab"
            aria-selected={active}
            type="button"
            onClick={() => {
              onChange(option.value);
            }}
            style={{
              padding: '6px 14px',
              borderRadius: 999,
              border: 'none',
              cursor: 'pointer',
              fontFamily: "'General Sans', sans-serif",
              fontSize: 13,
              fontWeight: 600,
              background: active ? '#E8ECEB' : 'transparent',
              color: active ? '#0C1B22' : '#A9BDBF',
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function HomeView({ conditions }: { conditions: SpotConditions }) {
  const [mode, setMode] = useMode();
  const { spot } = conditions;

  return (
    <>
      <div style={{ background: '#0C1B22' }}>
        <nav
          style={{
            maxWidth: 720,
            margin: '0 auto',
            padding: '28px 24px 16px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span
              style={{
                fontFamily: "'Clash Display', sans-serif",
                fontWeight: 600,
                fontSize: 22,
                letterSpacing: -0.5,
              }}
            >
              tonnta<span style={{ color: '#E8A33D' }}>.</span>
            </span>
            <span
              style={{
                fontFamily: "'Spline Sans Mono', monospace",
                fontSize: 12,
                color: '#A9BDBF',
              }}
            >
              {spot.name} · {spot.region}
            </span>
          </div>
          <ModeToggle mode={mode} onChange={setMode} />
        </nav>
      </div>

      {mode === 'surf' ? (
        <SeaHero verdict={conditions.now} hour={conditions.currentHour} />
      ) : (
        <SnamhHero
          swim={conditions.swimNow}
          hour={conditions.currentHour}
          waterQuality={conditions.waterQuality}
        />
      )}

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
        {mode === 'surf' ? (
          <>
            {conditions.nextWindow !== undefined && conditions.now.verdict !== 'go' ? (
              <NextWindowCard window={conditions.nextWindow} spot={spot} />
            ) : null}
            <DayStrip days={conditions.days} spot={spot} />
          </>
        ) : (
          <SwimWindowsCard windows={conditions.swimWindows} spot={spot} />
        )}
        {conditions.buoy !== undefined ? <BuoyCard buoy={conditions.buoy} spot={spot} /> : null}
        <TideCard tides={conditions.tides} spot={spot} />
      </div>
    </>
  );
}
