import { Popup as NmpPopup } from '@neshan-maps-platform/mapbox-gl';
import { useEffect } from 'react';
import { createMapElement } from '@/element';
import { createPopupComponent } from './util';
import type { Coordination } from '@/types';
import type {
  PopupOptions as NmpPopupOptions,
  Popup as NmpPopupType,
} from 'mapbox-gl';
import type { PropsWithChildren } from 'react';

type PopupType = NmpPopupType;

interface PopupProps extends NmpPopupOptions, PropsWithChildren {
  show?: boolean;
  lngLat?: Coordination;
}

const Popup = createPopupComponent(
  function createPopup(props, context) {
    const popup = new NmpPopup(props);
    return createMapElement(popup, context);
  },
  function usePopupLifeCycle(element, context, props, setOpen) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- intended
    const { lngLat, show } = props!;
    const { map, marker } = context;
    useEffect(
      function addPopup() {
        const { instance: popup } = element;

        function handleOpen(): void {
          setOpen?.(true);
        }

        function handleClose(): void {
          setOpen?.(false);
        }

        if (marker === undefined) {
          if (lngLat !== undefined) {
            popup.setLngLat(lngLat);
          }
          popup.addTo(map);
        } else {
          marker.setPopup(popup);
          if (show && !popup.isOpen()) {
            marker.togglePopup();
          }
        }

        popup.on('open', handleOpen);
        popup.on('close', handleClose);

        return function removePopup() {
          popup.off('open', handleOpen);
          popup.off('close', handleClose);
          marker?.setPopup(undefined);
          popup.remove();
        };
      },
      [marker, element, lngLat, setOpen, map, show]
    );
  }
);

export default Popup;
export type { PopupProps, PopupType };
