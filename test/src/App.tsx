import {
  Circle,
  LngLat,
  Map,
  MapProps,
  MapType,
  Marker,
  MarkerProps,
  Polyline,
  Popup,
} from '@abolhasanashori/react-neshan-map';
import { MapStyleNameType } from '@neshan-maps-platform/mapbox-gl/dist/src/parameters/parameters';
import { Attributes, useEffect, useState } from 'react';
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

function generateMarker(center: LngLat): MarkerInstance {
  const randomed = center.map(randomizer) as LngLat;

  return {
    key: randomed.join(','),
    lngLat: randomed,
  };
}

const markers: MarkerInstance[] = generateMarkers(defaultProps.center);

function setMapToGlobal(map: MapType) {
  // @ts-expect-error -- intended
  window.map = map;
}

function App() {
  const [marks, setMarks] = useState(markers);

  useEffect(() => {
    const interval = setInterval(() => {
      setMarks(prevMarks => [
        ...prevMarks,
        generateMarker(defaultProps.center),
      ]);
    }, 10000);
    return () => {
      clearInterval(interval);
    };
  }, []);

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
        color="#2C61C9"
        width={4}
        lngLats={marks.map(({ lngLat }) => lngLat)}
      />
      {marks.map(({ lngLat, key }) => (
        <Circle key={key} radius={5} lngLat={lngLat} color="#fff080" />
      ))}
      <Marker lngLat={marks.at(-1)!.lngLat}>
        <Popup show>Hello World</Popup>
      </Marker>
    </Map>
  );
}

export default App;
