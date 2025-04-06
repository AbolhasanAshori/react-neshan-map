import { createContext, use } from 'react';
import type { Map, Marker as NmpMarker } from 'mapbox-gl';
import type { Context } from 'react';

interface MapContextInterface {
  map: Map;
  marker?: NmpMarker;
}

function createNeshanContext(map: Map): MapContextInterface {
  return { map };
}

function useNeshanContext(): MapContextInterface {
  const context = use(MapContext);

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

export { createNeshanContext, useNeshanContext, MapContext };
export type { MapContextInterface };
