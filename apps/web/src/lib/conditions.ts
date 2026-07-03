import {
  DEFAULT_SPOT_ID,
  assessHour,
  fetchBuoyObservation,
  fetchHourlyConditions,
  fetchTideEvents,
  getSpot,
  nextGoodWindow,
  summarizeDays,
} from '@tonnta/data';
import type { GoodWindow } from '@tonnta/data';
import type {
  BuoyObservation,
  DailySummary,
  HourlyConditions,
  Spot,
  TideEvent,
  VerdictResult,
} from '@tonnta/types';

/**
 * Server-side data assembly for the home screen. Upstream calls are cached
 * via Next's fetch cache; a worker-side KV proxy takes over at scale
 * (tracked on the issues board).
 */

const FORECAST_REVALIDATE_S = 900; // 15 min — model updates are 6-hourly
const LIVE_REVALIDATE_S = 600; // 10 min — buoy reports hourly

function cachedFetch(revalidateS: number): typeof fetch {
  return (input, init) => fetch(input, { ...init, next: { revalidate: revalidateS } });
}

export interface SpotConditions {
  spot: Spot;
  /** Verdict for the current hour (or next session hour if it's night). */
  now: VerdictResult;
  currentHour?: HourlyConditions;
  nextWindow?: GoodWindow;
  days: DailySummary[];
  hours: HourlyConditions[];
  tides: TideEvent[];
  buoy?: BuoyObservation;
  /** Set when a source failed and the screen is degraded. */
  warnings: string[];
}

function currentOrNextHour(hours: HourlyConditions[]): HourlyConditions | undefined {
  const nowIso = new Date().toISOString();
  return hours.find((hour) => hour.time >= nowIso) ?? hours.at(-1);
}

export async function loadSpotConditions(
  spotId: string = DEFAULT_SPOT_ID
): Promise<SpotConditions> {
  const spot = getSpot(spotId);
  if (spot === undefined) {
    throw new Error(`Unknown spot: ${spotId}`);
  }

  const warnings: string[] = [];

  const [hoursResult, tidesResult, buoyResult] = await Promise.allSettled([
    fetchHourlyConditions(spot, cachedFetch(FORECAST_REVALIDATE_S)),
    spot.tideStationId !== undefined
      ? fetchTideEvents(spot.tideStationId, 3, cachedFetch(FORECAST_REVALIDATE_S))
      : Promise.resolve([]),
    spot.buoyStationId !== undefined
      ? fetchBuoyObservation(spot.buoyStationId, cachedFetch(LIVE_REVALIDATE_S))
      : Promise.resolve(undefined),
  ]);

  const hours = hoursResult.status === 'fulfilled' ? hoursResult.value : [];
  if (hoursResult.status === 'rejected') {
    warnings.push('The wave forecast is unavailable right now — showing what we have.');
  }
  const tides = tidesResult.status === 'fulfilled' ? tidesResult.value : [];
  if (tidesResult.status === 'rejected') {
    warnings.push('Tide times are unavailable right now.');
  }
  const buoy = buoyResult.status === 'fulfilled' ? buoyResult.value : undefined;
  if (buoyResult.status === 'rejected') {
    warnings.push("The buoy hasn't reported — forecast only.");
  }

  const currentHour = currentOrNextHour(hours);
  const now: VerdictResult =
    currentHour !== undefined
      ? assessHour(currentHour, spot)
      : { verdict: 'flat', reason: 'No forecast data — check back shortly.' };

  const result: SpotConditions = {
    spot,
    now,
    days: summarizeDays(hours, spot),
    hours,
    tides,
    warnings,
  };
  if (currentHour !== undefined) {
    result.currentHour = currentHour;
  }
  const window = nextGoodWindow(hours, spot);
  if (window !== undefined) {
    result.nextWindow = window;
  }
  if (buoy !== undefined) {
    result.buoy = buoy;
  }
  return result;
}
