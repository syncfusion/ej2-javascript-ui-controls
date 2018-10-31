import { drawSymbol, PathOption, Size, ChartLocation } from '../../common/utils/helper';
import { Chart } from '../chart';
import { Border } from '../../common/model/base';
import { MarkerSettingsModel } from '../series/chart-series-model';
import { Series, Points } from './chart-series';
import { Browser, extend, remove } from '@syncfusion/ej2-base';
import { ChartData } from '../../chart/utils/get-data';
import { withInBounds, PointData, stopTimer } from '../../common/utils/helper';
import { ColorValue, colorNameToHex, convertHexToColor } from '../../common/utils/helper';
import { ChartShape } from '../../index';

/**
 * Marker Module used to render the marker for line type series.
 */
export class MarkerExplode extends ChartData {
    private markerExplode: number;
    private isRemove: boolean;
    /** @private */
    public elementId: string;

    /**
     * Constructor for the marker module.
     * @private
     */

    constructor(chart: Chart) {
        super(chart);
        this.addEventListener();
        this.elementId = chart.element.id;
    }

    /**
     * @hidden
     */
    public addEventListener(): void {
        if (this.chart.isDestroyed) { return; }
        this.chart.on(Browser.touchMoveEvent, this.mouseMoveHandler, this);
        this.chart.on(Browser.touchEndEvent, this.mouseUpHandler, this);

    }
    /**
     * @hidden
     */
    /* public removeEventListener(): void {
         if (this.chart.isDestroyed) { return; }
         this.chart.off(Browser.touchMoveEvent, this.mouseMoveHandler);
    }*/

    /**
     * @hidden
     */
    private mouseUpHandler(): void {
        let chart: Chart = this.chart;
        if (chart.isTouch && !chart.crosshair.enable && !this.isSelected(chart)) {
            this.markerMove(true);
        }
    }

    /**
     * @hidden
     */
    private mouseMoveHandler(): void {
        let chart: Chart = this.chart;
        if ((!chart.crosshair.enable || (chart.tooltip.enable)) && (!chart.isTouch || chart.startMove) && !this.isSelected(chart)) {
            this.markerMove(false);
        }
    }

    private markerMove(remove: boolean): void {
        let chart: Chart = this.chart;
        this.currentPoints = [];
        let data: PointData;
        let previous : PointData;
        let explodeSeries: boolean;
        let series: Series;
        if (!chart.tooltip.shared || !chart.tooltip.enable) {
            data = this.getData();
            series = data.series;
            previous = <PointData>this.previousPoints[0];
            explodeSeries = series && (
                (series.type === 'Bubble' || series.drawType === 'Scatter' || series.type === 'Scatter') ||
                (((series.type !== 'Candle') && (series.type !== 'Hilo') && (series.type !== 'HiloOpenClose')) &&
                    (series.marker.visible && series.marker.width !== 0 && series.marker.height !== 0))
            );
            data.lierIndex = this.lierIndex;
            if (
                data.point && explodeSeries && ((!previous || (previous.point !== data.point)) ||
                    (previous && previous.lierIndex > 3 && previous.lierIndex !== this.lierIndex))
            ) {
                (<PointData[]>this.currentPoints).push(data);
            }
        } else {
            if (!withInBounds(chart.mouseX, chart.mouseY, chart.chartAxisLayoutPanel.seriesClipRect)) {
                return null;
            }
            if (chart.tooltip.enable) {
             let pointData: PointData = chart.chartAreaType === 'PolarRadar' ? this.getData() : null;
             for (let chartSeries of chart.visibleSeries) {
                if (!chartSeries.enableTooltip || chartSeries.category === 'Indicator') {
                    continue;
                }
                if (chart.chartAreaType === 'Cartesian' && chartSeries.visible) {
                    data = this.getClosestX(chart, chartSeries);
                } else if (chart.chartAreaType === 'PolarRadar' && chartSeries.visible && pointData.point !== null) {
                    data = new PointData(chartSeries.points[pointData.point.index], chartSeries);
                }
                if (data) {
                    (<PointData[]>this.currentPoints).push(data);
                    data = null;
                }
              }
            }
        }
        let length: number = this.previousPoints.length;
        if (this.currentPoints.length > 0) {
             if (length === 0 || (length > 0 && this.previousPoints[0].point !== this.currentPoints[0].point)) {
                if (this.previousPoints.length > 0) {
                    this.removeHighlightedMarker();
                }
                for (let data of <PointData[]>this.currentPoints) {
                    if (
                        (data && data.point) || ((series.type !== 'Candle') &&
                            (series.type !== 'Hilo') && (series.type !== 'HiloOpenClose'))
                    ) {
                        stopTimer(this.markerExplode);
                        this.isRemove = true;
                        data.point.symbolLocations.map((location: ChartLocation, index: number) => {
                            if (!data.series.isRectSeries || data.point.marker.visible) {
                                this.drawTrackBall(data.series, data.point, location, index);
                            }
                        });
                    }
                }
                this.previousPoints = <PointData[]>extend([], this.currentPoints, null, true);
             }
        }
        if (!chart.tooltip.enable && ((this.currentPoints.length === 0 && this.isRemove) || (remove && this.isRemove) ||
                !withInBounds(chart.mouseX, chart.mouseY, chart.chartAxisLayoutPanel.seriesClipRect))) {
                this.isRemove = false;
                this.markerExplode = setTimeout(
                  (): void => {
                    this.removeHighlightedMarker();
                  },
                  2000);
        }
        this.currentPoints = [];
    }

    private drawTrackBall(series: Series, point: Points, location: ChartLocation, index: number): void {
        let marker: MarkerSettingsModel = point.marker;
        let seriesMarker: MarkerSettingsModel = series.marker;
        let shape: ChartShape = marker.shape || seriesMarker.shape;
        let element: Element = series.symbolElement || series.seriesElement;
        let symbolId: string = this.elementId + '_Series_' + series.index + '_Point_' + point.index + '_Trackball' +
            (index ? index : '');
        let size: Size = new Size(
            (marker.width || seriesMarker.width) + 5,
            (marker.height || seriesMarker.height) + 5
        );
        let border: Border = <Border>(marker.border || series.border);
        let explodeSeries: boolean = (series.type === 'BoxAndWhisker' || series.type === 'Bubble' || series.type === 'Scatter');
        let borderColor: string = (border.color && border.color !== 'transparent') ? border.color :
            marker.fill || point.interior || (explodeSeries ? point.color : series.interior);
        let colorValue: ColorValue = convertHexToColor(colorNameToHex(borderColor));
        let borderWidth: number = marker.border ? marker.border.width : seriesMarker.border.width;
        let markerShadow: string = series.chart.themeStyle.markerShadow ||
            'rgba(' + colorValue.r + ',' + colorValue.g + ',' + colorValue.b + ',0.2)';
        for (let i: number = 0; i < 2; i++) {
            let options: PathOption = new PathOption(
                symbolId + '_' + i,
                i ? (marker.fill || point.color || (explodeSeries ? series.interior : '#ffffff')) : 'transparent',
                borderWidth + (i ? 0 : 8),
                i ? borderColor : markerShadow,
                (marker.opacity || seriesMarker.opacity), null, null
            );
            let symbol: Element = drawSymbol(location, shape, size, seriesMarker.imageUrl, options, '');
            symbol.setAttribute('style', 'pointer-events:none');
            symbol.setAttribute('class', 'EJ2-Trackball');
            element.appendChild(symbol);
        }
    }

    /**
     * @hidden
     */
    public removeHighlightedMarker(): void {
        let elements: HTMLCollectionOf<Element> = document.getElementsByClassName('EJ2-Trackball');
        for (let i: number = 0, len: number = elements.length; i < len; i++) {
            remove(elements[0]);
        }
        this.previousPoints = [];
    }
}