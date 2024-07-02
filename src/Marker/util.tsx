import { forwardRef, useEffect, useImperativeHandle } from 'react';
import { MapProvider } from '@/context';
import { createElementHook } from '@/element';
import { createElementRef } from '@/ref';
import type { MarkerProps, MarkerType } from './Marker';
import type { MapContextInterface } from '@/context';
import type {
  ComponentElementHook,
  CreateElementFn,
  MapElement,
  UpdateElementFn,
} from '@/element';
import type { MapComponent } from '@/types';
import type { Map } from 'mapbox-gl';
import type { Ref, ReactNode } from 'react';

function useMarkerLifeCycle(
  element: MapElement<MarkerType>,
  context: MapContextInterface
): void {
  useEffect(
    function addMarker() {
      const { instance: marker } = element;
      const { map } = context;

      marker.addTo(map as unknown as Map);

      return function removeMarker() {
        marker.remove();
      };
    },
    [context, element]
  );
}

function createMarkerContainer(
  useMarker: ComponentElementHook<MarkerType, MarkerProps>
): MapComponent<MarkerType, MarkerProps> {
  function MarkerContainer(
    props: MarkerProps,
    ref: Ref<MarkerType>
  ): ReactNode {
    const { instance: marker, context } = useMarker(props).current;

    useImperativeHandle(ref, () => marker);

    return props.children === null || props.children === undefined ? null : (
      <MapProvider
        value={{
          ...context,
          marker,
        }}>
        {props.children}
      </MapProvider>
    );
  }

  return forwardRef(MarkerContainer);
}

function createMarkerComponent(
  createElement: CreateElementFn<MarkerType, MarkerProps>,
  updateElement: UpdateElementFn<MarkerType, MarkerProps>
): MapComponent<MarkerType, MarkerProps> {
  const useMarkerHook = createElementHook(createElement, updateElement);
  const useMarkerRef = createElementRef(useMarkerHook, useMarkerLifeCycle);
  return createMarkerContainer(useMarkerRef);
}

export { createMarkerComponent };
