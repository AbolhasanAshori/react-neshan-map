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
  protected _map: Map | null | undefined;
  protected _layerId: string;
  protected _sourceId: string;
  protected _source: S;
  protected _layer: L;

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
    this._map = map;

    return this._init();
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

  reset(): this {
    return this.remove()._init();
  }

  protected _init(): this {
    const map = this._map;
    if (!map) return this;
    map.addSource(this._sourceId, this._source);
    map.addLayer(this._layer);

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
