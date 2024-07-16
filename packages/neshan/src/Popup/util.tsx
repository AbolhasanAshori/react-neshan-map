import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { createElementHook } from '@/element';
import { createElementRef } from '@/ref';
import type { PopupProps, PopupType } from './Popup';
import type { ComponentElementHook, CreateElementFn } from '@/element';
import type { LifeCycleHook } from '@/ref';
import type { MapComponent } from '@/types';
import type { ReactNode, Ref } from 'react';

function createPopupContainer(
  usePopup: ComponentElementHook<PopupType, PopupProps>
): MapComponent<PopupType, PopupProps> {
  function PopupContainer(props: PopupProps, ref: Ref<PopupType>): ReactNode {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- for future uses
    const [opened, setOpened] = useState(false);
    const contentRef = useRef(document.createElement('div'));
    const { instance: popup } = usePopup(props, setOpened).current;

    useImperativeHandle(ref, () => popup);

    useEffect(
      function attachContent() {
        popup.setDOMContent(contentRef.current);
      },
      [popup]
    );

    return createPortal(props.children, contentRef.current);
  }

  return forwardRef(PopupContainer);
}

function createPopupComponent(
  createElement: CreateElementFn<PopupType, PopupProps>,
  useLifeCycle: LifeCycleHook<PopupType, PopupProps>
): MapComponent<PopupType, PopupProps> {
  const usePopupHook = createElementHook(createElement);
  const usePopupRef = createElementRef(usePopupHook, useLifeCycle);
  return createPopupContainer(usePopupRef);
}

export { createPopupComponent };
