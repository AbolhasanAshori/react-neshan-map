import Layer from '@/layer';
import { generateId, pickResult, removeUndefined } from '@/util';
import { isFlat } from './util';
import type { LayerOptions } from '@/layer';
import type { LngLat } from '@/types';
import type {
  GeoJSONSourceRaw,
  LineLayer,
  LineLayout,
  LinePaint,
} from 'mapbox-gl';

function getStyles(options: PolylineStyleOptions): PolylineStyle {
  const [
    layout,
    {
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
    },
  ] = pickResult(options, [
    'line-cap',
    'line-join',
    'line-miter-limit',
    'line-round-limit',
    'line-sort-key',
    'visibility',
  ]);

  const paint: LinePaint = removeUndefined({
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
  });

  return {
    layout: { 'line-cap': 'round', 'line-join': 'round', ...layout },
    paint,
  };
}

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

interface PolylineStyleOptions extends LineLayout {
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

interface PolylineOptions extends PolylineStyleOptions, LayerOptions {}

interface PolylineStyle {
  layout: LineLayout;
  paint: LinePaint;
}

type PolylineType = Polyline;

class Polyline extends Layer<LineLayer, GeoJSONSourceRaw> {
  private _lngLats: LngLat[] | LngLat[][];

  constructor(lngLats: LngLat[] | LngLat[][], options: PolylineOptions = {}) {
    const { layerId, sourceId = generateId(), ...styleOptions } = options;

    super(
      {
        type: 'line',
        source: sourceId,
        ...getStyles(styleOptions),
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

  setStyles(options: PolylineStyleOptions): this {
    const styles = getStyles(options);

    return this._updateLayer(styles);
  }

  private _updateLayer(styles: PolylineStyle): this {
    return this._setLayer({
      ...this._layer,
      ...styles,
    }).reset();
  }

  private _updateSource(lngLats: LngLat[] | LngLat[][]): this {
    return this._setSource({
      ...this._source,
      data: {
        type: 'Feature',
        properties: {},
        geometry: isFlat(lngLats)
          ? { type: 'LineString', coordinates: lngLats }
          : { type: 'MultiLineString', coordinates: lngLats },
      },
    }).reset();
  }
}

export default Polyline;
export type {
  PolylineType,
  PolylineOptions,
  PolylineStyleOptions,
  PolylineTransitionOptions,
};
