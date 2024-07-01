import { useEffect, useRef } from 'react';
import type { MapContextInterface } from './context';
import type { MutableRefObject } from 'react';

type ElementHook<E, P> = (
  props: P,
  context: MapContextInterface
) => MutableRefObject<E>;

type CreateElementFn<E, P> = (props: P, context: MapContextInterface) => E;
type UpdateElementFn<E, P> = (instance: E, props: P, prevProps: P) => void;

function createElementHook<E, P>(
  createElement: CreateElementFn<E, P>,
  updateElement?: UpdateElementFn<E, P>
): ElementHook<E, P> {
  if (updateElement === undefined) {
    return function useImmutableNeshanElement(props, context) {
      const elementRef = useRef<E>();
      elementRef.current ??= createElement(props, context);
      return elementRef as MutableRefObject<E>;
    };
  }
  return function useMutableNeshanElement(props, context) {
    const elementRef = useRef<E>();
    elementRef.current ??= createElement(props, context);
    const propsRef = useRef(props);
    const instance = elementRef.current;

    useEffect(
      function updateElementProps() {
        if (propsRef.current !== props) {
          updateElement(instance, props, propsRef.current);
          propsRef.current = props;
        }
      },
      [instance, props]
    );

    return elementRef as MutableRefObject<E>;
  };
}

export { createElementHook };
export type { ElementHook, CreateElementFn, UpdateElementFn };
