import type { HourlyConditions, Spot } from '@tonnta/types';

import { isNumberArray, isRecord, isStringArray } from '../guards';
import { classifyWind } from '../verdict';

/**
 * Open-Meteo — hourly wave forecast (Marine API, MFWAM ~8 km grid) merged
 * with hourly wind (forecast API, gusts included). Keyless; free tier is
 * non-commercial, so all calls route through our own cached proxy and the
 * paid Standard plan is the flip-a-switch upgrade at monetisation.
 */

const MARINE_URL = 'https://marine-api.open-meteo.com/v1/marine';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

interface HourlySeries {
  time: string[];
  series: Map<string, number[]>;
}

function parseHourly(payload: unknown, keys: string[]): HourlySeries {
  if (!isRecord(payload) || !isRecord(payload.hourly)) {
    throw new Error('Open-Meteo: unexpected response shape');
  }
  const hourly = payload.hourly;
  if (!isStringArray(hourly.time)) {
    throw new Error('Open-Meteo: missing hourly.time');
  }
  const series = new Map<string, number[]>();
  for (const key of keys) {
    const values = hourly[key];
    if (!isNumberArray(values) || values.length !== hourly.time.length) {
      throw new Error(`Open-Meteo: missing or malformed hourly.${key}`);
    }
    series.set(key, values);
  }
  return { time: hourly.time, series };
}

function seriesValue(data: HourlySeries, key: string, index: number): number {
  const values = data.series.get(key);
  const value = values?.[index];
  if (value === undefined) {
    throw new Error(`Open-Meteo: missing ${key}[${index}]`);
  }
  return value;
}

export async function fetchHourlyConditions(
  spot: Spot,
  fetchImpl: typeof fetch = fetch
): Promise<HourlyConditions[]> {
  const marineParams = new URLSearchParams({
    latitude: String(spot.latitude),
    longitude: String(spot.longitude),
    hourly: 'wave_height,wave_period,wave_direction,sea_surface_temperature',
    timezone: 'UTC',
    forecast_days: '7',
  });
  const windParams = new URLSearchParams({
    latitude: String(spot.latitude),
    longitude: String(spot.longitude),
    hourly: 'wind_speed_10m,wind_direction_10m,wind_gusts_10m',
    wind_speed_unit: 'kmh',
    timezone: 'UTC',
    forecast_days: '7',
  });

  const [marineRes, windRes] = await Promise.all([
    fetchImpl(`${MARINE_URL}?${marineParams}`),
    fetchImpl(`${FORECAST_URL}?${windParams}`),
  ]);
  if (!marineRes.ok) {
    throw new Error(`Open-Meteo marine: HTTP ${marineRes.status}`);
  }
  if (!windRes.ok) {
    throw new Error(`Open-Meteo forecast: HTTP ${windRes.status}`);
  }

  const marine = parseHourly(await marineRes.json(), [
    'wave_height',
    'wave_period',
    'wave_direction',
    'sea_surface_temperature',
  ]);
  const wind = parseHourly(await windRes.json(), [
    'wind_speed_10m',
    'wind_direction_10m',
    'wind_gusts_10m',
  ]);

  const windIndexByTime = new Map(wind.time.map((time, index) => [time, index]));

  const hours: HourlyConditions[] = [];
  for (let i = 0; i < marine.time.length; i += 1) {
    const time = marine.time[i];
    if (time === undefined) continue;
    const windIndex = windIndexByTime.get(time);
    if (windIndex === undefined) continue;

    const windSpeedKmh = seriesValue(wind, 'wind_speed_10m', windIndex);
    const windDirectionDeg = seriesValue(wind, 'wind_direction_10m', windIndex);
    hours.push({
      // Open-Meteo emits "2026-07-03T11:00" with timezone=UTC; normalise to full ISO
      time: `${time}:00Z`,
      waveHeightM: seriesValue(marine, 'wave_height', i),
      wavePeriodS: seriesValue(marine, 'wave_period', i),
      waveDirectionDeg: seriesValue(marine, 'wave_direction', i),
      windSpeedKmh,
      windGustKmh: seriesValue(wind, 'wind_gusts_10m', windIndex),
      windDirectionDeg,
      windState: classifyWind(windDirectionDeg, windSpeedKmh, spot),
      seaTempC: seriesValue(marine, 'sea_surface_temperature', i),
    });
  }
  return hours;
}
