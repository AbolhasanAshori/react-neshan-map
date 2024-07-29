import type { LngLat } from '@/types';

function isFlat(lngLats: LngLat[] | LngLat[][]): lngLats is LngLat[] {
  return !Array.isArray(lngLats[0]) || !Array.isArray(lngLats[0][0]);
}

export { isFlat };
