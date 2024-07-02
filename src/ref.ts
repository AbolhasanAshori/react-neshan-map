import { useNeshanContext } from './context';
import type { MapContextInterface } from './context';
import type { ElementHook, MapElement } from './element';

type DisclosureFn = (open: boolean) => void;

type LifeCycleHook<E, P> = (
  element: MapElement<E>,
  context: MapContextInterface,
  props?: P,
  setOpen?: DisclosureFn
) => void;

function createElementRef<E, P>(
  useElement: ElementHook<E, P>,
  useLifeCycle: LifeCycleHook<E, P>
): (props: P, setOpen?: DisclosureFn) => ReturnType<ElementHook<E, P>> {
  return function useElementRef(props, setOpen) {
    const context = useNeshanContext();
    const elementRef = useElement(props, context);

    useLifeCycle(elementRef.current, context, props, setOpen);

    return elementRef;
  };
}

export { createElementRef };
export type { DisclosureFn, LifeCycleHook };
