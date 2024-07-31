import Layer from '@/layer';
import { generateId, pickResult, removeUndefined } from '@/util';
import { isMultiPoint } from './util';
import type { LayerOptions } from '@/layer';
import type { LngLat } from '@/types';
import type {
  CircleLayer,
  CircleLayout,
  CirclePaint,
  GeoJSONSourceRaw,
} from 'mapbox-gl';

function getStyles(options: CircleStyleOptions): CircleStyle {
  const [
    layout,
    {
      blur,
      color,
      opacity,
      pitchAlignment,
      pitchScale,
      radius,
      strokeColor,
      strokeOpacity,
      strokeWidth,
      translate,
      translateAnchor,
      transitions,
    },
  ] = pickResult(options, ['circle-sort-key', 'visibility']);

  const paint: CirclePaint = removeUndefined({
    'circle-radius': radius,
    'circle-color': color,
    'circle-blur': blur,
    'circle-opacity': opacity,
    'circle-translate': translate,
    'circle-translate-anchor': translateAnchor,
    'circle-pitch-scale': pitchScale,
    'circle-pitch-alignment': pitchAlignment,
    'circle-stroke-width': strokeWidth,
    'circle-stroke-color': strokeColor,
    'circle-stroke-opacity': strokeOpacity,
    'circle-radius-transition': transitions?.radius,
    'circle-color-transition': transitions?.color,
    'circle-blur-transition': transitions?.blur,
    'circle-opacity-transition': transitions?.opacity,
    'circle-translate-transition': transitions?.translate,
    'circle-stroke-width-transition': transitions?.strokeWidth,
    'circle-stroke-color-transition': transitions?.strokeColor,
    'circle-stroke-opacity-transition': transitions?.strokeOpacity,
  });

  return {
    layout,
    paint,
  };
}

interface CircleTransitionOptions {
  radius?: CirclePaint['circle-radius-transition'];
  color?: CirclePaint['circle-color-transition'];
  blur?: CirclePaint['circle-blur-transition'];
  opacity?: CirclePaint['circle-opacity-transition'];
  translate?: CirclePaint['circle-translate-transition'];
  strokeWidth?: CirclePaint['circle-stroke-width-transition'];
  strokeColor?: CirclePaint['circle-stroke-color-transition'];
  strokeOpacity?: CirclePaint['circle-stroke-opacity-transition'];
}

interface CircleStyleOptions extends CircleLayout {
  radius?: CirclePaint['circle-radius'];
  color?: CirclePaint['circle-color'];
  blur?: CirclePaint['circle-blur'];
  opacity?: CirclePaint['circle-opacity'];
  translate?: CirclePaint['circle-translate'];
  translateAnchor?: CirclePaint['circle-translate-anchor'];
  pitchScale?: CirclePaint['circle-pitch-scale'];
  pitchAlignment?: CirclePaint['circle-pitch-alignment'];
  strokeWidth?: CirclePaint['circle-stroke-width'];
  strokeColor?: CirclePaint['circle-stroke-color'];
  strokeOpacity?: CirclePaint['circle-stroke-opacity'];
  transitions?: CircleTransitionOptions;
}

interface CircleOptions extends CircleStyleOptions, LayerOptions {}

interface CircleStyle {
  layout: CircleLayout;
  paint: CirclePaint;
}

type CircleType = Circle;

class Circle extends Layer<CircleLayer, GeoJSONSourceRaw> {
  private _lngLat: LngLat | LngLat[];

  constructor(lngLat: LngLat | LngLat[], options: CircleOptions) {
    const { layerId, sourceId = generateId(), ...styleOptions } = options;

    super(
      {
        type: 'circle',
        source: sourceId,
        ...getStyles(styleOptions),
      },
      {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: isMultiPoint(lngLat)
            ? { type: 'MultiPoint', coordinates: lngLat }
            : { type: 'Point', coordinates: lngLat },
        },
      },
      {
        sourceId,
        layerId,
      }
    );

    this._lngLat = lngLat;
  }

  getLatLng(): LngLat | LngLat[] {
    return this._lngLat;
  }

  setLatLng(lngLat: LngLat | LngLat[]): this {
    this._lngLat = lngLat;
    this._updateSource(lngLat);
    return this;
  }

  setStyles(options: CircleStyleOptions): this {
    const styles = getStyles(options);

    return this._updateLayer(styles);
  }

  private _updateLayer(styles: CircleStyle): this {
    return this._setLayer({
      ...this._layer,
      ...styles,
    }).reset();
  }

  private _updateSource(lngLat: LngLat | LngLat[]): this {
    return this._setSource({
      ...this._source,
      data: {
        type: 'Feature',
        properties: {},
        geometry: isMultiPoint(lngLat)
          ? { type: 'MultiPoint', coordinates: lngLat }
          : { type: 'Point', coordinates: lngLat },
      },
    }).reset();
  }
}

export default Circle;
export type {
  CircleType,
  CircleOptions,
  CircleStyleOptions,
  CircleTransitionOptions,
};
