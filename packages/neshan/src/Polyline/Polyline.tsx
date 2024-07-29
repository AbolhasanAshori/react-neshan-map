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

    if (
      props.color !== prevProps.color ||
      props.blur !== prevProps.blur ||
      props.dasharray !== prevProps.dasharray ||
      props.gapWidth !== prevProps.gapWidth ||
      props.gradient !== prevProps.gradient ||
      props.offset !== prevProps.offset ||
      props.opacity !== prevProps.opacity ||
      props.pattern !== prevProps.pattern ||
      props.translate !== prevProps.translate ||
      props.width !== prevProps.width ||
      props.translateAnchor !== prevProps.translateAnchor ||
      props['line-cap'] !== prevProps['line-cap'] ||
      props['line-join'] !== prevProps['line-join'] ||
      props['line-miter-limit'] !== prevProps['line-miter-limit'] ||
      props['line-round-limit'] !== prevProps['line-round-limit'] ||
      props['line-sort-key'] !== prevProps['line-sort-key'] ||
      props.visibility !== prevProps.visibility ||
      props.transitions?.blur !== prevProps.transitions?.blur ||
      props.transitions?.color !== prevProps.transitions?.color ||
      props.transitions?.dasharray !== prevProps.transitions?.dasharray ||
      props.transitions?.gapWidth !== prevProps.transitions?.gapWidth ||
      props.transitions?.offset !== prevProps.transitions?.offset ||
      props.transitions?.opacity !== prevProps.transitions?.opacity ||
      props.transitions?.pattern !== prevProps.transitions?.pattern ||
      props.transitions?.translate !== prevProps.transitions?.translate ||
      props.transitions?.width !== prevProps.transitions?.width
    ) {
      polyline.setStyles(props);
    }
  }
);

export default Polyline;
export type { PolylineProps };
