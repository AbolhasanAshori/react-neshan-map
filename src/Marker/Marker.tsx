import { Marker as NmpMarker } from '@neshan-maps-platform/mapbox-gl';
import { createMapElement } from '@/element';
import { createMarkerComponent } from './util';
import type { Coordination } from '@/types';
import type {
  MarkerOptions as NmpMarkerOptions,
  Marker as NmpMarkerType,
} from 'mapbox-gl';
import type { PropsWithChildren } from 'react';

type MarkerType = NmpMarkerType;

interface MarkerProps extends NmpMarkerOptions, PropsWithChildren {
  lngLat: Coordination;
}

const Marker = createMarkerComponent(
  function createMarker(props, context) {
    const { lngLat, ...other } = props;
    const marker = new NmpMarker(other);
    marker.setLngLat(lngLat);

    return createMapElement(marker, context);
  },
  function updateMarker(marker, props, prevProps) {
    if (props.lngLat !== prevProps.lngLat) {
      marker.setLngLat(props.lngLat);
    }
    if (
      props.draggable !== undefined &&
      props.draggable !== prevProps.draggable
    ) {
      marker.setDraggable(props.draggable);
    }
    if (props.rotation !== undefined && props.rotation !== prevProps.rotation) {
      marker.setRotation(props.rotation);
    }
    if (
      props.rotationAlignment !== undefined &&
      props.rotationAlignment !== prevProps.rotationAlignment
    ) {
      marker.setRotationAlignment(props.rotationAlignment);
    }
    if (props.offset !== undefined && props.offset !== prevProps.offset) {
      marker.setOffset(props.offset);
    }
    if (
      props.occludedOpacity !== undefined &&
      props.occludedOpacity !== prevProps.occludedOpacity
    ) {
      marker.setOccludedOpacity(props.occludedOpacity);
    }
    if (
      props.pitchAlignment !== undefined &&
      props.pitchAlignment !== prevProps.pitchAlignment
    ) {
      marker.setPitchAlignment(props.pitchAlignment);
    }
  }
);

export default Marker;
export type { MarkerProps, MarkerType };
