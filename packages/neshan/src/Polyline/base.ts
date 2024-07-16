import Layer from '@/layer';
import { generateId, pickResult } from '@/util';
import { isFlat } from './util';
import type { LayerOptions } from '@/layer';
import type { LngLat } from '@/types';
import type {
  GeoJSONSourceRaw,
  LineLayer,
  LineLayout,
  LinePaint,
} from 'mapbox-gl';

interface PolylineTransitionOptions {
  opacity?: LinePaint['line-opacity-transition'];
  color?: LinePaint['line-color-transition'];
  translate?: LinePaint['line-translate-transition'];
  width?: LinePaint['line-width-transition'];
  gapWidth?: LinePaint['line-gap-width-transition'];
  offset?: LinePaint['line-offset-transition'];
  blur?: LinePaint['line-blur-transition'];
  dasharray?: LinePaint['line-dasharray-transition'];
  pattern?: LinePaint['line-pattern-transition'];
}

interface PolylineOptions extends LineLayout, LayerOptions {
  opacity?: LinePaint['line-opacity'];
  color?: LinePaint['line-color'];
  dasharray?: LinePaint['line-dasharray'];
  translate?: LinePaint['line-translate'];
  translateAnchor?: LinePaint['line-translate-anchor'];
  width?: LinePaint['line-width'];
  gapWidth?: LinePaint['line-gap-width'];
  offset?: LinePaint['line-offset'];
  blur?: LinePaint['line-blur'];
  pattern?: LinePaint['line-pattern'];
  gradient?: LinePaint['line-gradient'];
  transitions?: PolylineTransitionOptions;
}

type PolylineType = PolyLine;

class PolyLine extends Layer<LineLayer, GeoJSONSourceRaw> {
  private _lngLats: LngLat[] | LngLat[][];

  constructor(lngLats: LngLat[] | LngLat[][], options: PolylineOptions = {}) {
    const [layout, other] = pickResult(options, [
      'line-cap',
      'line-join',
      'line-miter-limit',
      'line-round-limit',
      'line-sort-key',
      'visibility',
    ]);
    const {
      layerId,
      sourceId = generateId(),
      blur,
      color,
      dasharray,
      gapWidth,
      gradient,
      offset,
      opacity,
      pattern,
      translate,
      width,
      translateAnchor,
      transitions,
    } = other;

    super(
      {
        type: 'line',
        source: sourceId,
        layout: { 'line-cap': 'round', 'line-join': 'round', ...layout },
        paint: {
          'line-blur': blur,
          'line-color': color,
          'line-dasharray': dasharray,
          'line-gap-width': gapWidth,
          'line-gradient': gradient,
          'line-offset': offset,
          'line-opacity': opacity,
          'line-pattern': pattern,
          'line-translate': translate,
          'line-translate-anchor': translateAnchor,
          'line-width': width,
          'line-blur-transition': transitions?.blur,
          'line-color-transition': transitions?.color,
          'line-dasharray-transition': transitions?.dasharray,
          'line-gap-width-transition': transitions?.gapWidth,
          'line-offset-transition': transitions?.offset,
          'line-opacity-transition': transitions?.opacity,
          'line-pattern-transition': transitions?.pattern,
          'line-translate-transition': transitions?.translate,
          'line-width-transition': transitions?.width,
        },
      },
      {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: isFlat(lngLats)
            ? { type: 'LineString', coordinates: lngLats }
            : { type: 'MultiLineString', coordinates: lngLats },
        },
      },
      {
        sourceId,
        layerId,
      }
    );

    this._lngLats = lngLats;
  }

  getLatLngs(): LngLat[] | LngLat[][] {
    return this._lngLats;
  }

  setLatLngs(lngLats: LngLat[] | LngLat[][]): this {
    this._lngLats = lngLats;
    this._updateSource(lngLats);
    return this;
  }

  private _updateSource(lngLats: LngLat[] | LngLat[][]): this {
    this.getSource();
    this._setSource({
      ...this.getSource(),
      data: {
        type: 'Feature',
        properties: {},
        geometry: isFlat(lngLats)
          ? { type: 'LineString', coordinates: lngLats }
          : { type: 'MultiLineString', coordinates: lngLats },
      },
    });
    return this;
  }
}

export default PolyLine;
export type { PolylineOptions, PolylineType, PolylineTransitionOptions };
