import { createMapElement } from '@/element';
import { createLayerComponent } from '@/generic';
import { default as CircleClass } from './base';
import type { CircleOptions, CircleType } from './base';
import type { LngLat } from '@/types';
import type { PropsWithChildren } from 'react';

interface CircleProps extends CircleOptions, PropsWithChildren {
  lngLat: LngLat | LngLat[];
}

const Circle = createLayerComponent<CircleType, CircleProps>(
  function createCircle(props, context) {
    const { lngLat, ...other } = props;
    const circle = new CircleClass(lngLat, other);

    return createMapElement(circle, context);
  },
  function updateCircle(circle, props, prevProps) {
    if (props.lngLat !== prevProps.lngLat) {
      circle.setLatLng(props.lngLat);
    }

    if (
      props.radius !== prevProps.radius ||
      props.color !== prevProps.color ||
      props.blur !== prevProps.blur ||
      props.opacity !== prevProps.opacity ||
      props.translate !== prevProps.translate ||
      props.translateAnchor !== prevProps.translateAnchor ||
      props.pitchScale !== prevProps.pitchScale ||
      props.pitchAlignment !== prevProps.pitchAlignment ||
      props.strokeWidth !== prevProps.strokeWidth ||
      props.strokeColor !== prevProps.strokeColor ||
      props.strokeOpacity !== prevProps.strokeOpacity ||
      props['circle-sort-key'] !== prevProps['circle-sort-key'] ||
      props.visibility !== prevProps.visibility ||
      props.transitions?.radius !== prevProps.transitions?.radius ||
      props.transitions?.color !== prevProps.transitions?.color ||
      props.transitions?.blur !== prevProps.transitions?.blur ||
      props.transitions?.opacity !== prevProps.transitions?.opacity ||
      props.transitions?.translate !== prevProps.transitions?.translate ||
      props.transitions?.strokeWidth !== prevProps.transitions?.strokeWidth ||
      props.transitions?.strokeColor !== prevProps.transitions?.strokeColor ||
      props.transitions?.strokeOpacity !== prevProps.transitions?.strokeOpacity
    ) {
      circle.setStyles(props);
    }
  }
);

export default Circle;
export type { CircleProps };
