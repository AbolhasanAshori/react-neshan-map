import {
  LngLat,
  Map,
  MapProps,
  MapType,
  MarkerProps,
  Polyline,
} from '@abolhasanashori/react-neshan-map';
import { MapStyleNameType } from '@neshan-maps-platform/mapbox-gl/dist/src/parameters/parameters';
import { Attributes, useState } from 'react';
import './App.css';

const defaultProps = {
  mapKey: import.meta.env.VITE_MAP_KEY,
  center: [
    +import.meta.env.VITE_MAP_LONGITUDE,
    +import.meta.env.VITE_MAP_LATITUDE,
  ],
  zoom: +import.meta.env.VITE_MAP_ZOOM,
  mapType: import.meta.env.VITE_MAP_TYPE as MapStyleNameType,
} satisfies MapProps;

interface MarkerInstance extends MarkerProps, Attributes {}

function randomizer(num: number): number {
  return Math.floor(Math.random() * 400) / 1e4 + num;
}

function generateMarkers(center: LngLat, count = 10): MarkerInstance[] {
  return new Array(count).fill('').map(() => {
    const randomed = center.map(randomizer) as LngLat;

    return {
      key: randomed.join(','),
      lngLat: randomed,
    };
  });
}

const markers: MarkerInstance[] = generateMarkers(defaultProps.center);

function setMapToGlobal(map: MapType) {
  // @ts-expect-error -- intended
  window.map = map;
}

function App() {
  const [marks] = useState(markers);

  return (
    <Map
      ref={setMapToGlobal}
      style={{
        width: '100%',
        height: '100%',
      }}
      poi={false}
      traffic={false}
      {...defaultProps}>
      <Polyline
        ref={console.dir}
        color="#2C61C9"
        width={4}
        lngLats={marks.map(({ lngLat }) => lngLat)}
      />
      <Polyline
        color="#fff080"
        width={4}
        lngLats={[
          generateMarkers(defaultProps.center, 2).map(({ lngLat }) => lngLat),
          generateMarkers(defaultProps.center, 2).map(({ lngLat }) => lngLat),
        ]}
      />
    </Map>
  );
}

export default App;
