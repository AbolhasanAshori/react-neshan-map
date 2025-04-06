import { Marker } from '@neshan-maps-platform/mapbox-gl';
import { useEffect, useImperativeHandle, useState } from 'react';
import { MapContext } from './context';
import type { ComponentElementHook } from './element';
import type { PropsWithChildren, RefAttributes } from 'react';

function createContainerComponent<
  E,
  P extends PropsWithChildren<RefAttributes<E>>,
>(useElement: ComponentElementHook<E, P>) {
  function ContainerComponent(props: P) {
    const { children, ref } = props;
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
      <MapContext
        value={{
          ...context,
          marker: instance,
        }}>
        {content}
      </MapContext>
    ) : (
      content
    );
  }

  return ContainerComponent;
}

export { createContainerComponent };
