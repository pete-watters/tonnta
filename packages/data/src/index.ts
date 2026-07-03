export { SPOTS, DEFAULT_SPOT_ID, getSpot } from './spots';
export { DEFAULT_THRESHOLDS, assessHour, classifyWind } from './verdict';
export type { VerdictThresholds } from './verdict';
export { findGoodWindows, nextGoodWindow, summarizeDays } from './summary';
export type { GoodWindow } from './summary';
export { fetchHourlyConditions } from './sources/open-meteo';
export { fetchBuoyObservation, fetchTideEvents } from './sources/erddap';
export { isRecord, isNumberArray, isStringArray, asFiniteNumber } from './guards';
