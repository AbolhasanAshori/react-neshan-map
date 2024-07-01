import { forwardRef, useEffect, useImperativeHandle } from 'react';
import { MapProvider, useNeshanContext } from '@/context';
import { createElementHook } from '@/element';
import type { MarkerProps } from './Marker';
import type { MapContextInterface } from '@/context';
import type { CreateElementFn, ElementHook, UpdateElementFn } from '@/element';
import type { Map, Marker as NmpMarkerType } from 'mapbox-gl';
import type {
  Ref,
  ReactNode,
  ForwardRefExoticComponent,
  RefAttributes,
} from 'react';

function useMarkerLifeCycle(
  marker: NmpMarkerType,
  context: MapContextInterface
): void {
  useEffect(
    function addMarker() {
      const { map } = context;

      marker.addTo(map as unknown as Map);

      return function removeMarker() {
        marker.remove();
      };
    },
    [marker, context]
  );
}

function createMarkerRef(
  useElement: ElementHook<NmpMarkerType, MarkerProps>
): (props: MarkerProps) => ReturnType<ElementHook<NmpMarkerType, MarkerProps>> {
  return function useMarkerRef(props) {
    const context = useNeshanContext();
    const markerRef = useElement(props, context);

    useMarkerLifeCycle(markerRef.current, context);

    return markerRef;
  };
}

function createMarkerContainer(
  useMarker: ElementHook<NmpMarkerType, MarkerProps>
): ForwardRefExoticComponent<MarkerProps & RefAttributes<NmpMarkerType>> {
  function MarkerContainer(
    props: MarkerProps,
    ref: Ref<NmpMarkerType>
  ): ReactNode {
    const context = useNeshanContext();
    const marker = useMarker(props, context).current;

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
  createElement: CreateElementFn<NmpMarkerType, MarkerProps>,
  updateElement: UpdateElementFn<NmpMarkerType, MarkerProps>
): ForwardRefExoticComponent<MarkerProps & RefAttributes<NmpMarkerType>> {
  const useMarkerHook = createElementHook(createElement, updateElement);
  const useMarkerRef = createMarkerRef(useMarkerHook);
  return createMarkerContainer(useMarkerRef);
}

export { createMarkerComponent };
