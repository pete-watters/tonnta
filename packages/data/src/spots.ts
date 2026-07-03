import type { Spot } from '@tonnta/types';

/**
 * Spot registry. Donabate is the launch spot; everything downstream is
 * driven by this config so new spots are entries, not features.
 */
export const SPOTS: readonly Spot[] = [
  {
    id: 'donabate',
    name: 'Donabate',
    irishName: 'Domhnach Bat',
    region: 'North County Dublin',
    country: 'IE',
    latitude: 53.487,
    longitude: -6.107,
    timezone: 'Europe/Dublin',
    facing: 70,
    buoyStationId: 'M2',
    tideStationId: 'Skerries',
  },
] as const;

export const DEFAULT_SPOT_ID = 'donabate';

export function getSpot(id: string): Spot | undefined {
  return SPOTS.find((spot) => spot.id === id);
}
