import { Marker } from '@neshan-maps-platform/mapbox-gl';
import { forwardRef, useImperativeHandle } from 'react';
import { MapProvider } from './context';
import type { ComponentElementHook } from './element';
import type { MapComponent } from './types';
import type { PropsWithChildren, ReactNode, Ref } from 'react';

function createContainerComponent<E, P extends PropsWithChildren>(
  useElement: ComponentElementHook<E, P>
): MapComponent<E, P> {
  function ContainerComponent(props: P, ref: Ref<E>): ReactNode {
    const { instance, context } = useElement(props).current;

    useImperativeHandle(ref, () => instance);

    return instance instanceof Marker ? (
      <MapProvider
        value={{
          ...context,
          marker: instance,
        }}>
        {props.children}
      </MapProvider>
    ) : (
      props.children
    );
  }

  return forwardRef(ContainerComponent) as MapComponent<E, P>;
}

export { createContainerComponent };
