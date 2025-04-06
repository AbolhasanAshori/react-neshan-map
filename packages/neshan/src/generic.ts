import { createContainerComponent } from './component';
import { createElementHook } from './element';
import { useLayerLifeCycle } from './layer';
import { createElementRef } from './ref';
import type { CreateElementFn, UpdateElementFn } from './element';
import type { LayerImpl } from './layer';
import type { PropsWithChildren } from 'react';

function createLayerComponent<E extends LayerImpl, P extends PropsWithChildren>(
  createElement: CreateElementFn<E, P>,
  updateElement: UpdateElementFn<E, P>
) {
  const useElement = createElementHook(createElement, updateElement);
  const useLayer = createElementRef(useElement, useLayerLifeCycle);
  return createContainerComponent(useLayer);
}

export { createLayerComponent };
