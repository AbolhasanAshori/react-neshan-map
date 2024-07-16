import { useEffect, useRef } from 'react';
import type { MapContextInterface } from './context';
import type { DisclosureFn } from './ref';
import type { MutableRefObject } from 'react';

interface MapElement<T> {
  readonly instance: T;
  readonly context: MapContextInterface;
}

type ComponentElementHook<E, P> = (
  props: P,
  setOpen?: DisclosureFn
) => MutableRefObject<MapElement<E>>;

type ElementHook<E, P> = (
  props: P,
  context: MapContextInterface
) => MutableRefObject<MapElement<E>>;

type CreateElementFn<E, P> = (
  props: P,
  context: MapContextInterface
) => MapElement<E>;
type UpdateElementFn<E, P> = (instance: E, props: P, prevProps: P) => void;
type ElementHookResult<E, P> = (
  props: P,
  context: MapContextInterface
) => MutableRefObject<MapElement<E>>;

function createElementHook<E, P>(
  createElement: CreateElementFn<E, P>,
  updateElement?: UpdateElementFn<E, P>
): ElementHookResult<E, P> {
  if (updateElement === undefined) {
    return function useImmutableNeshanElement(props, context) {
      const elementRef = useRef<MapElement<E>>();
      elementRef.current ??= createElement(props, context);
      return elementRef as MutableRefObject<MapElement<E>>;
    };
  }
  return function useMutableNeshanElement(props, context) {
    const elementRef = useRef<MapElement<E>>();
    elementRef.current ??= createElement(props, context);
    const propsRef = useRef(props);
    const { instance } = elementRef.current;

    useEffect(
      function updateElementProps() {
        if (propsRef.current !== props) {
          updateElement(instance, props, propsRef.current);
          propsRef.current = props;
        }
      },
      [instance, props]
    );

    return elementRef as MutableRefObject<MapElement<E>>;
  };
}

function createMapElement<T>(
  instance: T,
  context: MapContextInterface
): MapElement<T> {
  return Object.freeze({
    instance,
    context,
  });
}

export { createElementHook, createMapElement };
export type {
  MapElement,
  ComponentElementHook,
  ElementHook,
  CreateElementFn,
  UpdateElementFn,
};
