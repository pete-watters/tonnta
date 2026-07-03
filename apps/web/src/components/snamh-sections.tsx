'use client';

import type { SwimWindow } from '@tonnta/data';
import type { Spot } from '@tonnta/types';

import { formatDayName, formatHour } from '@/lib/format';

const CARD: React.CSSProperties = {
  background: '#122630',
  border: '1px solid #22404C',
  borderRadius: 16,
  padding: 20,
};

const EYEBROW: React.CSSProperties = {
  margin: 0,
  fontSize: 11,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.14em',
  color: '#6E8A90',
};

const MONO: React.CSSProperties = {
  fontFamily: "'Spline Sans Mono', monospace",
};

export function SwimWindowsCard({ windows, spot }: { windows: SwimWindow[]; spot: Spot }) {
  return (
    <section style={{ ...CARD, borderColor: 'rgba(143,193,181,0.4)' }}>
      <p style={EYEBROW}>Fuinneoga snámha · Swim windows</p>
      {windows.length === 0 ? (
        <p style={{ margin: '10px 0 0', fontSize: 14, color: '#C6D2D2' }}>
          No swimmable windows in the next few days — the sea needs to settle first.
        </p>
      ) : (
        <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
          {windows.map((window) => {
            const first = window.hours[0];
            return (
              <div key={window.start} style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <span
                  style={{
                    fontFamily: "'Clash Display', sans-serif",
                    fontWeight: 600,
                    fontSize: 18,
                    color: window.nearHighTide ? '#8FC1B5' : '#E8ECEB',
                    minWidth: 150,
                  }}
                >
                  {formatDayName(window.start, spot.timezone)}{' '}
                  {formatHour(window.start, spot.timezone)}–{formatHour(window.end, spot.timezone)}
                </span>
                <span style={{ ...MONO, fontSize: 12, color: '#A9BDBF' }}>
                  {window.nearHighTide ? 'near high tide' : 'low-ish tide — long walk out'}
                  {first?.seaTempC !== undefined ? ` · ${first.seaTempC.toFixed(1)}°C` : ''}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
