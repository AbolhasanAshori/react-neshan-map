import { createContext, useContext } from 'react';
import type { default as NeshanMap } from '@neshan-maps-platform/mapbox-gl/dist/src/core/Map';
import type { Marker as NmpMarker } from 'mapbox-gl';
import type { Context } from 'react';

interface MapContextInterface {
  map: NeshanMap;
  marker?: NmpMarker;
}

function createNeshanContext(map: NeshanMap): MapContextInterface {
  return { map };
}

function useNeshanContext(): MapContextInterface {
  const context = useContext(MapContext);

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- intended runtime check
  if (context === null)
    throw new Error(
      'No context provided: useNeshanContext() can only be used in a descendant of <MapContainer>'
    );

  return context;
}

const MapContext = createContext(
  null
) as unknown as Context<MapContextInterface>;
const MapProvider = MapContext.Provider;

export { createNeshanContext, useNeshanContext, MapContext, MapProvider };
export type { MapContextInterface };
