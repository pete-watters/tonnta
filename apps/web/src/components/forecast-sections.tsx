'use client';

import type { GoodWindow } from '@tonnta/data';
import type { BuoyObservation, DailySummary, Spot, TideEvent } from '@tonnta/types';

import {
  BOARD_LABEL,
  VERDICT_LABEL,
  WIND_STATE_LABEL,
  compassPoint,
  formatDayDate,
  formatDayName,
  formatHour,
} from '@/lib/format';

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

const VERDICT_SWATCH: Record<string, string> = {
  go: '#5E9A8C',
  maybe: '#557D86',
  flat: '#9FB8B3',
  blown: '#4A5A61',
};

export function NextWindowCard({ window, spot }: { window: GoodWindow; spot: Spot }) {
  const first = window.hours[0];
  return (
    <section style={{ ...CARD, borderColor: 'rgba(232,163,61,0.4)' }}>
      <p style={EYEBROW}>An chéad fhuinneog · Next good window</p>
      <p
        style={{
          margin: '8px 0 4px',
          fontFamily: "'Clash Display', sans-serif",
          fontWeight: 600,
          fontSize: 24,
          color: '#E8A33D',
        }}
      >
        {formatDayName(window.start, spot.timezone)} {formatHour(window.start, spot.timezone)}–
        {formatHour(window.end, spot.timezone)}
      </p>
      {first !== undefined ? (
        <p style={{ ...MONO, margin: 0, fontSize: 13, color: '#A9BDBF' }}>
          {first.waveHeightM.toFixed(1)}m · {WIND_STATE_LABEL[first.windState]}{' '}
          {Math.round(first.windSpeedKmh)}km/h
          {window.board !== undefined ? ` · bring the ${BOARD_LABEL[window.board]}` : ''}
        </p>
      ) : null}
    </section>
  );
}

export function DayStrip({ days, spot }: { days: DailySummary[]; spot: Spot }) {
  return (
    <section>
      <p style={{ ...EYEBROW, marginBottom: 12 }}>An tseachtain · The week ahead</p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(88px, 1fr))',
          gap: 8,
        }}
      >
        {days.map((day) => {
          const swatch = VERDICT_SWATCH[day.verdict] ?? '#557D86';
          const isGo = day.verdict === 'go';
          return (
            <div
              key={day.date}
              style={{
                ...CARD,
                padding: 12,
                textAlign: 'center',
                borderColor: isGo ? 'rgba(232,163,61,0.4)' : '#22404C',
              }}
            >
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#A9BDBF' }}>
                {formatDayName(`${day.date}T12:00:00Z`, spot.timezone)}
              </p>
              <p style={{ ...MONO, margin: '2px 0 8px', fontSize: 10, color: '#6E8A90' }}>
                {formatDayDate(`${day.date}T12:00:00Z`, spot.timezone)}
              </p>
              <div
                aria-hidden
                style={{
                  height: 34,
                  borderRadius: 8,
                  background: `linear-gradient(180deg, transparent 30%, ${swatch} 130%)`,
                  border: `1px solid ${swatch}55`,
                  marginBottom: 8,
                }}
              />
              <p
                style={{
                  margin: 0,
                  fontFamily: "'Clash Display', sans-serif",
                  fontWeight: 600,
                  fontSize: 18,
                  color: isGo ? '#E8A33D' : '#E8ECEB',
                }}
              >
                {day.maxWaveHeightM.toFixed(1)}m
              </p>
              <p style={{ margin: 0, fontSize: 11, color: '#6E8A90' }}>
                {VERDICT_LABEL[day.verdict].english.toLowerCase()}
                {day.bestWindow !== undefined
                  ? ` · ${formatHour(day.bestWindow.start, spot.timezone)}`
                  : ''}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function TideCard({ tides, spot }: { tides: TideEvent[]; spot: Spot }) {
  const upcoming = tides.slice(0, 4);
  return (
    <section style={CARD}>
      <p style={EYEBROW}>Taoidí · Tides at {spot.tideStationId}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
        {upcoming.map((tide) => (
          <div key={tide.time} style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: tide.kind === 'high' ? '#8FC1B5' : '#6E8A90',
                width: 36,
              }}
            >
              {tide.kind}
            </span>
            <span style={{ ...MONO, fontSize: 15, color: '#E8ECEB' }}>
              {formatDayName(tide.time, spot.timezone)} {formatHour(tide.time, spot.timezone)}
            </span>
            <span style={{ ...MONO, fontSize: 11, color: '#6E8A90' }}>
              {tide.heightM.toFixed(1)}m
            </span>
          </div>
        ))}
        {upcoming.length === 0 ? (
          <p style={{ margin: 0, fontSize: 13, color: '#6E8A90' }}>
            Tide times are unavailable right now.
          </p>
        ) : null}
      </div>
    </section>
  );
}

export function BuoyCard({ buoy, spot }: { buoy: BuoyObservation; spot: Spot }) {
  return (
    <section style={CARD}>
      <p style={EYEBROW}>
        <span
          data-tonnta-animated
          style={{
            display: 'inline-block',
            width: 7,
            height: 7,
            borderRadius: 999,
            background: '#8FC1B5',
            marginRight: 8,
            animation: 'tonntaPulse 1.6s ease-in-out infinite',
          }}
        />
        Anois ar an mbaoi · Now at {buoy.stationId}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, marginTop: 12 }}>
        {buoy.waveHeightM !== undefined ? (
          <Stat label="waves" value={`${buoy.waveHeightM.toFixed(2)}m`} />
        ) : null}
        {buoy.wavePeriodS !== undefined ? (
          <Stat label="period" value={`${buoy.wavePeriodS.toFixed(1)}s`} />
        ) : null}
        {buoy.windSpeedKmh !== undefined ? (
          <Stat
            label="wind"
            value={`${Math.round(buoy.windSpeedKmh)}km/h${
              buoy.windDirectionDeg !== undefined ? ` ${compassPoint(buoy.windDirectionDeg)}` : ''
            }`}
          />
        ) : null}
        {buoy.seaTempC !== undefined ? (
          <Stat label="sea temp" value={`${buoy.seaTempC.toFixed(1)}°C`} />
        ) : null}
      </div>
      <p style={{ ...MONO, margin: '14px 0 0', fontSize: 11, color: '#6E8A90' }}>
        reported {formatDayName(buoy.time, spot.timezone)} {formatHour(buoy.time, spot.timezone)} ·
        Marine Institute
      </p>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{ ...MONO, margin: 0, fontSize: 20, fontWeight: 500, color: '#E8ECEB' }}>{value}</p>
      <p style={{ margin: 0, fontSize: 11, color: '#6E8A90' }}>{label}</p>
    </div>
  );
}

export function Warnings({ warnings }: { warnings: string[] }) {
  if (warnings.length === 0) return null;
  return (
    <div
      role="status"
      style={{
        ...CARD,
        borderColor: 'rgba(196,85,59,0.5)',
        padding: '12px 16px',
      }}
    >
      {warnings.map((warning) => (
        <p key={warning} style={{ margin: 0, fontSize: 13, color: '#C6D2D2' }}>
          {warning}
        </p>
      ))}
    </div>
  );
}
