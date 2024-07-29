import {
  FullscreenControl,
  Map as NmpMap,
} from '@neshan-maps-platform/mapbox-gl';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  useMemo,
} from 'react';
import { MapProvider, createNeshanContext } from '@/context';
import type { MapContextInterface } from '@/context';
import type { MapBoxSKDOptionsModel } from '@neshan-maps-platform/mapbox-gl/dist/src/parameters/parameters';
import type { Map as MbMap } from 'mapbox-gl';
import type { CSSProperties, PropsWithChildren, Ref } from 'react';
import '@neshan-maps-platform/mapbox-gl/dist/NeshanMapboxGl.css';

type MapType = MbMap;

interface MapProps
  extends Omit<MapBoxSKDOptionsModel, 'container' | 'style'>,
    PropsWithChildren {
  style?: CSSProperties;
  id?: string;
  className?: string;
  fullscreen?: boolean;
}

const Map = forwardRef<MapType | null, MapProps>(function Map(props, ref) {
  const {
    children,
    style,
    id,
    className,
    center,
    zoom,
    minZoom,
    maxZoom,
    fullscreen,
    ...options
  } = props;
  const propsRef = useRef(props);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- these props usually doesn't change
  const containerProps = useMemo(() => ({ className, id, style }), []);
  const [context, setContext] = useState<MapContextInterface | null>(null);
  const [loaded, setLoaded] = useState(false);

  useImperativeHandle(ref as Ref<MapType | null>, () => context?.map ?? null, [
    context,
  ]);

  useEffect(() => {
    const map = context?.map as unknown as MbMap | undefined;
    if (!map) return;

    if (
      props.center !== undefined &&
      props.center !== propsRef.current.center
    ) {
      map.setCenter(props.center);
    }
    if (props.zoom !== undefined && props.zoom !== propsRef.current.zoom) {
      map.setZoom(props.zoom);
    }
  }, [context?.map, props]);

  const mapRef = useCallback(function createMap(
    container: HTMLDivElement | null
  ) {
    if (!container || context) return;
    const map = new NmpMap({
      ...options,
      center,
      zoom: zoom ?? 0,
      minZoom: !minZoom || minZoom < 2 ? 2 : minZoom,
      maxZoom: !maxZoom || maxZoom > 17 ? 17 : maxZoom,
      container,
    }) as unknown as MbMap;

    if (center !== undefined) {
      map.setCenter(center);
    }

    if (zoom !== undefined) {
      map.setZoom(zoom);
    }

    if (fullscreen) {
      map.addControl(new FullscreenControl());
    }

    map.once('load', () => {
      setLoaded(true);
    });

    setContext(createNeshanContext(map));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- ref callback
  }, []);

  const contents =
    loaded && context ? (
      <MapProvider value={context}>{children}</MapProvider>
    ) : null;

  return (
    <div {...containerProps} ref={mapRef}>
      {contents}
    </div>
  );
});

export default Map;
export type { MapType, MapProps };
