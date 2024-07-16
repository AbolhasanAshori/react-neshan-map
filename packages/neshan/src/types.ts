import type { ForwardRefExoticComponent, RefAttributes } from 'react';

// base types
/**
 * Remove properties `K` from `T`.
 * Distributive for union types.
 *
 * @internal
 */
/* eslint-disable-next-line @typescript-eslint/no-explicit-any -- required */
export type DistributiveOmit<T, K extends keyof any> = T extends any
  ? Omit<T, K>
  : never;

/**
 * Changes the properties K from T to optional
 */
export type PartiallyOptional<T, K extends keyof T> = DistributiveOmit<T, K> & {
  [P in K]?: T[P];
};

export type LngLat = [number, number];

export type MapComponent<E, P> = ForwardRefExoticComponent<
  P & RefAttributes<E>
>;
