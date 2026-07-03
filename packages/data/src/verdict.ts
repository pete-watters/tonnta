import type { Board, HourlyConditions, Spot, VerdictResult, WindState } from '@tonnta/types';

/**
 * The verdict engine — Tonnta's whole point in ~100 lines.
 *
 * Thresholds are the launch defaults for Donabate (east coast, small-wave
 * spot): waves ≥ 0.4 m with manageable wind is a GO. They become per-user
 * settings later, so everything routes through `VerdictThresholds`.
 */

export interface VerdictThresholds {
  /** Below this the sea is flat (m). */
  flatBelowM: number;
  /** At or above this it's rideable (m). */
  goFromM: number;
  /** Max wind for a clean GO (km/h). */
  maxWindKmh: number;
  /** Wind allowance when it's blowing offshore (km/h). */
  maxWindOffshoreKmh: number;
  /** Onshore wind above this kills the day regardless of waves (km/h). */
  blownOnshoreKmh: number;
}

export const DEFAULT_THRESHOLDS: VerdictThresholds = {
  flatBelowM: 0.3,
  goFromM: 0.4,
  maxWindKmh: 25,
  maxWindOffshoreKmh: 30,
  blownOnshoreKmh: 35,
};

const GLASSY_BELOW_KMH = 8;

/** Smallest angle between two compass bearings, 0–180. */
function angleBetween(a: number, b: number): number {
  return Math.abs(((a - b + 540) % 360) - 180);
}

/**
 * Classify wind relative to the beach. Wind direction is where the wind
 * comes FROM; offshore means it comes from behind the beach (facing + 180).
 */
export function classifyWind(
  windDirectionDeg: number,
  windSpeedKmh: number,
  spot: Spot
): WindState {
  if (windSpeedKmh < GLASSY_BELOW_KMH) {
    return 'glassy';
  }
  const offshoreFrom = (spot.facing + 180) % 360;
  const delta = angleBetween(windDirectionDeg, offshoreFrom);
  if (delta <= 45) return 'offshore';
  if (delta <= 80) return 'cross-off';
  if (delta <= 100) return 'cross';
  if (delta <= 135) return 'cross-on';
  return 'onshore';
}

function isOff(state: WindState): boolean {
  return state === 'offshore' || state === 'cross-off' || state === 'glassy';
}

function isOn(state: WindState): boolean {
  return state === 'onshore' || state === 'cross-on';
}

function pickBoard(hour: HourlyConditions): Board | undefined {
  const { waveHeightM, wavePeriodS, windSpeedKmh } = hour;
  if (waveHeightM >= 0.5 && waveHeightM <= 1.2 && wavePeriodS >= 5 && windSpeedKmh <= 20) {
    return 'longboard';
  }
  if (waveHeightM >= 0.4) {
    return 'foamie';
  }
  if (windSpeedKmh <= 15) {
    return 'sup';
  }
  return undefined;
}

function formatWave(heightM: number): string {
  return `${heightM.toFixed(1)}m`;
}

export function assessHour(
  hour: HourlyConditions,
  spot: Spot,
  thresholds: VerdictThresholds = DEFAULT_THRESHOLDS
): VerdictResult {
  const windState = classifyWind(hour.windDirectionDeg, hour.windSpeedKmh, spot);
  const { waveHeightM, windSpeedKmh } = hour;

  if (isOn(windState) && windSpeedKmh > thresholds.blownOnshoreKmh) {
    return {
      verdict: 'blown',
      reason: `Onshore ${Math.round(windSpeedKmh)}km/h has it blown out — save it for another day.`,
    };
  }

  if (waveHeightM < thresholds.flatBelowM) {
    const board = pickBoard(hour);
    if (board === 'sup' && windState === 'glassy') {
      return {
        verdict: 'flat',
        board,
        reason: 'Flat and glassy — no surf, but a lovely SUP.',
      };
    }
    return { verdict: 'flat', reason: 'Under 0.3m — nothing to ride today.' };
  }

  const windCap = isOff(windState) ? thresholds.maxWindOffshoreKmh : thresholds.maxWindKmh;
  const rideable = waveHeightM >= thresholds.goFromM;

  if (rideable && windSpeedKmh <= windCap) {
    const board = pickBoard(hour);
    const windWord = isOff(windState) ? 'clean' : 'manageable';
    const result: VerdictResult = {
      verdict: 'go',
      reason: `${formatWave(waveHeightM)} at ${Math.round(hour.wavePeriodS)}s and the wind is ${windWord} — worth going down.`,
    };
    if (board !== undefined) {
      result.board = board;
    }
    return result;
  }

  if (rideable) {
    const result: VerdictResult = {
      verdict: 'maybe',
      reason: `${formatWave(waveHeightM)} showing but ${Math.round(windSpeedKmh)}km/h ${windState} wind — could be messy.`,
    };
    const board = pickBoard(hour);
    if (board !== undefined) {
      result.board = board;
    }
    return result;
  }

  return {
    verdict: 'maybe',
    reason: `${formatWave(waveHeightM)} — borderline; take the foamie if you're passing anyway.`,
  };
}
