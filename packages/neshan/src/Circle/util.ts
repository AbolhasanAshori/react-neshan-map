import type { LngLat } from '@/types';

function isMultiPoint(LngLat: LngLat | LngLat[]): LngLat is LngLat[] {
  return Array.isArray(LngLat[0]);
}

export { isMultiPoint };
