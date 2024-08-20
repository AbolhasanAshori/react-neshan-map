import { Marker } from '@neshan-maps-platform/mapbox-gl';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { MapProvider } from './context';
import type { ComponentElementHook } from './element';
import type { MapComponent } from './types';
import type { PropsWithChildren, ReactNode, Ref } from 'react';

function createContainerComponent<E, P extends PropsWithChildren>(
  useElement: ComponentElementHook<E, P>
): MapComponent<E, P> {
  function ContainerComponent(props: P, ref: Ref<E>): ReactNode {
    const { children } = props;
    const { instance, context } = useElement(props).current;
    const [mounted, setMounted] = useState(false);

    useImperativeHandle(ref, () => instance);

    useEffect(() => {
      setMounted(true);
      return () => {
        setMounted(false);
      };
    }, []);

    const content = mounted ? children : null;

    return instance instanceof Marker ? (
      <MapProvider
        value={{
          ...context,
          marker: instance,
        }}>
        {content}
      </MapProvider>
    ) : (
      content
    );
  }

  return forwardRef(ContainerComponent) as MapComponent<E, P>;
}

export { createContainerComponent };
