/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable valid-jsdoc */
import { drawSymbol, ChartLocation } from '../../common/utils/helper';
import { PathOption, Size } from '@syncfusion/ej2-svg-base';
import { Chart } from '../chart';
import { Border } from '../../common/model/base';
import { MarkerSettingsModel } from '../series/chart-series-model';
import { Series, Points } from './chart-series';
import { Browser, extend, remove, isNullOrUndefined } from '@syncfusion/ej2-base';
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
     *
     * @private
     */

    constructor(chart: Chart) {
        super(chart);
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
    public removeEventListener(): void {
        if (this.chart.isDestroyed) { return; }
        this.chart.off(Browser.touchMoveEvent, this.mouseMoveHandler);
        this.chart.off(Browser.touchEndEvent, this.mouseUpHandler);
    }

    /**
     * @hidden
     */
    private mouseUpHandler(): void {
        const chart: Chart = this.chart;
        if (chart.isTouch && !chart.crosshair.enable && !this.isSelected(chart)) {
            this.markerMove(true);
        }
    }

    /**
     * @hidden
     */
    private mouseMoveHandler(): void {
        const chart: Chart = this.chart;
        if ((!chart.crosshair.enable || (chart.tooltip.enable)) && (!chart.isTouch || chart.startMove) && !this.isSelected(chart)) {
            this.markerMove(false);
        }
    }

    private markerMove(remove: boolean): void {
        const chart: Chart = this.chart;
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
            if (data.point && explodeSeries && chart.isPointMouseDown) {
                (<PointData[]>this.currentPoints).push(data);
            }
        } else {
            if (!withInBounds(chart.mouseX, chart.mouseY, chart.chartAxisLayoutPanel.seriesClipRect)) {
                return null;
            }
            if (chart.tooltip.enable) {
                const pointData: PointData = chart.chartAreaType === 'PolarRadar' ? this.getData() : null;
                const commonXvalues: number[] = this.mergeXvalues(this.chart.visibleSeries);
                for (const chartSeries of chart.visibleSeries) {
                    if (!chartSeries.enableTooltip || chartSeries.category === 'Indicator') {
                        continue;
                    }
                    if (chart.chartAreaType === 'Cartesian' && chartSeries.visible) {
                        data = this.getClosestX(chart, chartSeries, commonXvalues);
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
        const length: number = this.previousPoints.length;
        if (this.currentPoints.length > 0) {
            if (length === 0 || chart.isPointMouseDown || (length > 0 && this.previousPoints[0].point !== this.currentPoints[0].point)) {
                if (this.previousPoints.length > 0) {
                    this.removeHighlightedMarker();
                }
                for (const data of <PointData[]>this.currentPoints) {
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
            this.markerExplode = +setTimeout(
                (): void => {
                    this.removeHighlightedMarker();
                },
                2000);
        }
        this.currentPoints = [];
    }

    private drawTrackBall(series: Series, point: Points, location: ChartLocation, index: number): void {
        const marker: MarkerSettingsModel = point.marker;
        const seriesMarker: MarkerSettingsModel = series.marker;
        const shape: ChartShape = marker.shape || seriesMarker.shape;
        if (shape === 'None') {
            return null;
        }
        const element: Element = series.symbolElement || series.seriesElement;
        let className: string;
        if (this.chart.highlightModule && this.chart.highlightMode !== 'None') {
            className = this.chart.highlightModule.generateStyle(series);
        }
        if (this.chart.selectionModule && this.chart.selectionMode !== 'None') {
            className = this.chart.selectionModule.generateStyle(series);
        }

        const symbolId: string = this.elementId + '_Series_' + series.index + '_Point_' + point.index + '_Trackball' +
            (index ? index : '');
        const size: Size = new Size(
            (marker.width || seriesMarker.width) + 5,
            (marker.height || seriesMarker.height) + 5
        );
        const border: Border = <Border>(marker.border || series.border);
        const explodeSeries: boolean = (series.type === 'BoxAndWhisker' || series.type === 'Bubble' || series.type === 'Scatter');
        const borderColor: string = (border.color && border.color !== 'transparent') ? border.color :
            marker.fill || point.interior || (explodeSeries ? point.color : series.interior);
        const colorValue: ColorValue = convertHexToColor(colorNameToHex(borderColor));
        const borderWidth: number = marker.border ? marker.border.width : seriesMarker.border.width;
        const markerShadow: string = series.chart.themeStyle.markerShadow ||
            'rgba(' + colorValue.r + ',' + colorValue.g + ',' + colorValue.b + ',0.2)';
        for (let i: number = 0; i < 2; i++) {
            const options: PathOption = new PathOption(
                symbolId + '_' + i,
                i ? (marker.fill || point.color || (explodeSeries ? series.interior : '#ffffff')) : 'transparent',
                borderWidth + (i ? 0 : 8),
                i ? borderColor : markerShadow,
                (marker.opacity || seriesMarker.opacity), null, null
            );
            const symbol: Element = drawSymbol(location, shape, size, marker.imageUrl, options, '',
                                               this.chart.svgRenderer, series.clipRect);
            // incident: 252450 point click selection not working while maker explode
            //symbol.setAttribute('style', 'pointer-events:none');
            symbol.setAttribute('class', 'EJ2-Trackball');
            const selectionId: string = element.id.indexOf('Symbol') !== -1 ? '_Symbol' : '';
            const seletionElem: Element = document.getElementById(this.elementId + '_Series_' + series.index + '_Point_' +
                point.index + selectionId);
            if (className !== '' && !isNullOrUndefined(className) && !isNullOrUndefined(seletionElem) &&
                seletionElem.hasAttribute('class') && (className === seletionElem.getAttribute('class'))) {
                symbol.classList.add(className);
            }
            symbol.setAttribute('clip-path', element.getAttribute('clip-path'));
            symbol.setAttribute('transform', element.getAttribute('transform'));
            this.chart.svgObject.appendChild(symbol);
        }
    }

    /**
     * @hidden
     */
    public removeHighlightedMarker(): void {
        const elements: HTMLCollectionOf<Element> = document.getElementsByClassName('EJ2-Trackball');
        for (let i: number = 0, len: number = elements.length; i < len; i++) {
            remove(elements[0]);
        }
        this.previousPoints = [];
    }
}
