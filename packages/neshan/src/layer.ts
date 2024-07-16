import { useEffect } from 'react';
import { generateId } from '@/util';
import type { MapContextInterface } from './context';
import type { MapElement } from './element';
import type { PartiallyOptional } from '@/types';
import type { Map, AnyLayer, AnySourceData } from 'mapbox-gl';

interface LayerImpl {
  addTo: (map: Map) => this;
  remove: () => this;
}

interface LayerOptions {
  sourceId?: string;
  layerId?: string;
}

class Layer<L extends AnyLayer, S extends AnySourceData> implements LayerImpl {
  private _map: Map | null | undefined;
  private _layerId: string;
  private _sourceId: string;
  private _source: S;
  private _layer: L;

  constructor(
    layer: PartiallyOptional<L, 'id'>,
    source: S,
    options: LayerOptions = {}
  ) {
    this._layerId = options.layerId ?? layer.id ?? generateId();
    this._sourceId = options.sourceId ?? generateId();
    this._source = source;
    this._layer = { id: this._layerId, ...layer } as unknown as L;
  }

  addTo(map: Map): this {
    if (map === this._map) return this;

    this._map = map;
    this._map.addLayer(this._layer);
    this._map.addSource(this._sourceId, this._source);

    return this;
  }

  getSource(): S {
    return this._source;
  }

  getSourceId(): string {
    return this._sourceId;
  }

  getLayer(): L {
    return this._layer;
  }

  getLayerId(): string {
    return this._layerId;
  }

  remove(): this {
    const map = this._map;
    if (!map) return this;

    map.removeLayer(this._layerId);
    map.removeSource(this._sourceId);
    return this;
  }

  protected _setSource(source: S): this {
    this._source = source;
    return this;
  }

  protected _setLayer(layer: L): this {
    this._layer = layer;
    return this;
  }
}

function useLayerLifeCycle<L extends LayerImpl>(
  element: MapElement<L>,
  context: MapContextInterface
): void {
  useEffect(
    function addLayer() {
      const { instance } = element;
      const { map } = context;

      instance.addTo(map);

      return function removeLayer() {
        instance.remove();
      };
    },
    [element, context]
  );
}

export default Layer;
export { useLayerLifeCycle };
export type { LayerOptions, LayerImpl };
