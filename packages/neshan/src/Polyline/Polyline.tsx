import { createMapElement } from '@/element';
import { createLayerComponent } from '@/generic';
import { default as PolylineClass } from './base';
import type { PolylineOptions, PolylineType } from './base';
import type { LngLat } from '@/types';
import type { PropsWithChildren } from 'react';

interface PolylineProps extends PolylineOptions, PropsWithChildren {
  lngLats: LngLat[] | LngLat[][];
}

const Polyline = createLayerComponent<PolylineType, PolylineProps>(
  function createPolyline(props, context) {
    const { lngLats, ...other } = props;
    const polyline = new PolylineClass(lngLats, other);

    return createMapElement(polyline, context);
  },
  function updatePolyline(polyline, props, prevProps) {
    if (props.lngLats !== prevProps.lngLats) {
      polyline.setLatLngs(props.lngLats);
    }
  }
);

export default Polyline;
export type { PolylineProps };
