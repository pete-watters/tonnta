/**
 * Tonnta domain types
 * -------------------
 * Everything is spot-driven: Donabate is the launch spot, but famous Irish
 * spots (Bundoran, Lahinch, Strandhill…) and Fuerteventura are config
 * entries, not rebuilds. A spot's `facing` bearing is what turns a wind
 * direction into onshore/offshore — the core of the verdict.
 */

export type SpotId = string;

export interface Spot {
  id: SpotId;
  name: string;
  /** Irish-language name where one exists (brand layer, shown as eyebrow). */
  irishName?: string;
  region: string;
  country: 'IE' | 'ES';
  latitude: number;
  longitude: number;
  timezone: string;
  /** Compass bearing (deg true) the beach faces — Donabate ≈ 70 (ENE). */
  facing: number;
  /** Nearest live buoy station on Marine Institute ERDDAP (e.g. "M2"). */
  buoyStationId?: string;
  /** Nearest tide-prediction station on ERDDAP (e.g. "Skerries"). */
  tideStationId?: string;
}

export type WindState = 'offshore' | 'cross-off' | 'cross' | 'cross-on' | 'onshore' | 'glassy';

export interface HourlyConditions {
  time: string; // ISO 8601, UTC
  waveHeightM: number;
  wavePeriodS: number;
  waveDirectionDeg: number;
  windSpeedKmh: number;
  windGustKmh: number;
  windDirectionDeg: number;
  windState: WindState;
  seaTempC?: number;
}

export type Verdict = 'go' | 'maybe' | 'flat' | 'blown';

export type Board = 'sup' | 'foamie' | 'longboard';

export interface VerdictResult {
  verdict: Verdict;
  /** Primary board pick, present when the verdict is surfable. */
  board?: Board;
  /** One human sentence: "Worth a look after work — 0.5m and the wind drops at 4." */
  reason: string;
}

export interface DailySummary {
  date: string; // YYYY-MM-DD in spot-local time
  verdict: Verdict;
  board?: Board;
  maxWaveHeightM: number;
  dominantWindState: WindState;
  /** Best surfable window in spot-local time, when one exists. */
  bestWindow?: { start: string; end: string };
}

export interface TideEvent {
  time: string; // ISO 8601, UTC
  kind: 'high' | 'low';
  heightM: number;
}

export interface BuoyObservation {
  stationId: string;
  time: string; // ISO 8601, UTC
  waveHeightM?: number;
  wavePeriodS?: number;
  windSpeedKmh?: number;
  windDirectionDeg?: number;
  seaTempC?: number;
  source: 'marine-institute' | 'cil-dublin-bay';
}
