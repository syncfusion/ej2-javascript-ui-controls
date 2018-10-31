import { RectOption, ChartLocation, appendChildElement, getElement, appendClipElement } from '../../common/utils/helper';
import { findlElement, drawSymbol, PathOption, Size, Rect, markerAnimate, CircleOption,  } from '../../common/utils/helper';
import { Chart } from '../chart';
import { SvgRenderer, isNullOrUndefined, BaseAttibutes } from '@syncfusion/ej2-base';
import { BorderModel } from '../../common/model/base-model';
import { MarkerSettingsModel } from '../series/chart-series-model';
import { Series, Points } from './chart-series';
import { IPointRenderEventArgs } from '../../common/model/interface';
import { pointRender } from '../../common/model/constants';
import { MarkerExplode } from './marker-explode';
import { getSaturationColor } from '../../common/utils/helper';

/**
 * Marker module used to render the marker for line type series.
 */
export class Marker extends MarkerExplode {

    /**
     * Constructor for the marker module.
     * @private
     */

    constructor(chart: Chart) {
        super(chart);
        this.addEventListener();
    }


    /**
     * Render the marker for series.
     * @return {void}
     * @private
     */

    public render(series: Series): void {
        let redraw: boolean = series.chart.redraw;
        this.createElement(series, redraw);
        for (let point of series.points) {
            if (point.visible && point.symbolLocations.length) {
                point.symbolLocations.map((location: ChartLocation, index: number) => {
                    this.renderMarker(series, point, location, index, redraw);
                });
            }
        }
    }

    private renderMarker(
        series: Series, point: Points,
        location: ChartLocation, index: number, redraw: boolean
    ): void {
        let seriesIndex: number | String = series.index === undefined ? series.category : series.index;
        let marker: MarkerSettingsModel = series.marker;
        let border: BorderModel = {
            color: marker.border.color,
            width: marker.border.width
        };
        let borderColor: string = marker.border.color;
        let symbolId: string;
        let previousLocation: ChartLocation;
        let previousPath: string;
        let circlePath: string;
        let shapeOption: PathOption;
        let isBoxPlot: boolean = series.type === 'BoxAndWhisker';
        let fill: string = marker.fill || (isBoxPlot ? point.interior || series.interior : '#ffffff');
        let argsData: IPointRenderEventArgs;
        let markerElement: Element;
        let parentElement: Element = isBoxPlot ?
            findlElement(series.seriesElement.childNodes, 'Series_' + series.index + '_Point_' + point.index)
            : series.symbolElement;
        border.color = borderColor || series.setPointColor(point, series.interior);
        symbolId = this.elementId + '_Series_' + seriesIndex + '_Point_' + point.index + '_Symbol' +
            (index ? index : '');
        argsData = {
            cancel: false, name: pointRender, series: series, point: point,
            fill: point.isEmpty ? (series.emptyPointSettings.fill || fill) : fill,
            border: {
                color: series.type === 'BoxAndWhisker' ?
                    (!isNullOrUndefined(borderColor) && borderColor !== 'transparent') ? borderColor :
                        getSaturationColor(fill, -0.6)
                    : border.color,
                width: border.width
            },
            height: marker.height,
            width: marker.width,
            shape: marker.shape
        };
        argsData.border = series.setBorderColor(point, { width: argsData.border.width, color: argsData.border.color });
        if (!series.isRectSeries || series.type === 'BoxAndWhisker') {
            this.chart.trigger(pointRender, argsData);
            point.color = argsData.fill;
        }
        point.color = argsData.fill;
        if (!argsData.cancel) {
            let y: Object;
            if (series.type === 'RangeArea' || series.type === 'RangeColumn') {
                y = index ? point.low : point.high;
            } else if (isBoxPlot) {
                y = point.outliers[index];
            } else {
                y = point.y;
            }
            shapeOption = new PathOption(
                symbolId, argsData.fill,
                argsData.border.width,
                argsData.border.color,
                marker.opacity, null
            );
            if (parentElement !== undefined && parentElement !== null) {
                if (redraw && getElement(shapeOption.id)) {
                    markerElement = getElement(shapeOption.id);
                    circlePath = argsData.shape === 'Circle' ? 'c' : '';
                    previousLocation = {
                        x: +markerElement.getAttribute(circlePath + 'x'), y: +markerElement.getAttribute(circlePath + 'y')
                    };
                    previousPath = markerElement.getAttribute('d');
                }
                markerElement = drawSymbol(
                    location, argsData.shape,
                    new Size(argsData.width, argsData.height),
                    marker.imageUrl, shapeOption,
                    point.x.toString() + ':' + y.toString()
                );
                appendChildElement(
                    parentElement, markerElement, redraw, true, circlePath + 'x', circlePath + 'y',
                    previousLocation, previousPath
                );
            }
            point.marker = {
                border: argsData.border,
                fill: argsData.fill,
                height: argsData.height,
                visible: true,
                shape: argsData.shape,
                width: argsData.width
            };
        } else {
            location = null;
            point.marker = {
                visible: false
            };
        }
    }

    public createElement(series: Series, redraw: boolean): void {
        let markerClipRect: Element;
        let marker: MarkerSettingsModel = series.marker;
        // 8 for extend border value 5 for extend size value
        let explodeValue: number = marker.border.width + 8 + 5;
        let render: SvgRenderer = series.chart.renderer;
        let transform: string;
        let index: number | string = series.index === undefined ? series.category : series.index;
        let options: RectOption | CircleOption | BaseAttibutes;
        transform = series.chart.chartAreaType === 'Cartesian' ? 'translate(' + series.clipRect.x + ',' + (series.clipRect.y) + ')' : '';
        if (marker.visible) {
            let markerHeight: number = (marker.height + explodeValue) / 2;
            let markerWidth: number = (marker.width + explodeValue) / 2;
            if (series.chart.chartAreaType === 'Cartesian') {
                options = new RectOption(this.elementId + '_ChartMarkerClipRect_' + index, 'transparent', { width: 1, color: 'Gray' }, 1, {
                    x: -markerWidth, y: -markerHeight,
                    width: series.clipRect.width + markerWidth * 2,
                    height: series.clipRect.height + markerHeight * 2
                });
                markerClipRect = appendClipElement(redraw, options, render);
            } else {
                options = new CircleOption(
                    this.elementId + '_ChartMarkerClipRect_' + index, 'transparent', { width: 1, color: 'Gray' }, 1,
                    series.clipRect.width / 2 + series.clipRect.x, series.clipRect.height / 2 + series.clipRect.y,
                    series.chart.radius + Math.max(markerHeight, markerWidth)
                );
                markerClipRect = appendClipElement(redraw, options, render, 'drawCircularClipPath');
            }
            options = {
                'id': this.elementId + 'SymbolGroup' + index,
                'transform': transform,
                'clip-path': 'url(#' + this.elementId + '_ChartMarkerClipRect_' + index + ')'
            };
            series.symbolElement = render.createGroup(options);
            series.symbolElement.appendChild(markerClipRect);
        }
    }

    private getRangeLowPoint(region: Rect, series: Series): ChartLocation {
        let x: number = region.x;
        let y: number = region.y;
        if (series.chart.requireInvertedAxis) {
            y += region.height / 2;
            x += series.yAxis.isInversed ? region.width : 0;
        } else {
            y += series.yAxis.isInversed ? 0 : region.height;
            x += region.width / 2;
        }
        return { x: x, y: y };
    }

    /**
     * Animates the marker.
     * @return {void}.
     * @private
     */
    public doMarkerAnimation(series: Series): void {
        if (!(series.type === 'Scatter' || series.type === 'Bubble' || series.type === 'Candle' || series.type === 'Hilo' ||
            series.type === 'HiloOpenClose' || (series.chart.chartAreaType === 'PolarRadar' && (series.drawType === 'Scatter')))) {
            let markerElements: NodeList = series.symbolElement.childNodes;
            let delay: number = series.animation.delay + series.animation.duration;
            let j: number = 1;
            let incFactor: number = (series.type === 'RangeArea' || series.type === 'RangeColumn') ? 2 : 1;
            for (let i: number = 0; i < series.points.length; i++) {
                if (!series.points[i].symbolLocations.length || !markerElements[j]) {
                    continue;
                }
                markerAnimate(markerElements[j] as HTMLElement, delay, 200, series, i, series.points[i].symbolLocations[0], false);
                if (incFactor === 2) {
                    let lowPoint: ChartLocation = this.getRangeLowPoint(series.points[i].regions[0], series);
                    markerAnimate(markerElements[j + 1] as HTMLElement, delay, 200, series, i, lowPoint, false);
                }
                j += incFactor;
            }
        }
    }
}