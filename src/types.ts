import type { ForwardRefExoticComponent, RefAttributes } from 'react';

export type Coordination = [number, number];

export type MapComponent<E, P> = ForwardRefExoticComponent<
  P & RefAttributes<E>
>;
