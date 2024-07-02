import { drawSymbol, ChartLocation } from '../../common/utils/helper';
import { PathOption, Size } from '@syncfusion/ej2-svg-base';
import { Chart } from '../chart';
import { Border } from '../../common/model/base';
import { MarkerSettingsModel } from '../series/chart-series-model';
import { Series, Points } from './chart-series';
import { Browser, extend, remove, isNullOrUndefined, Animation, AnimationOptions } from '@syncfusion/ej2-base';
import { ChartData } from '../../chart/utils/get-data';
import { withInBounds, PointData, stopTimer } from '../../common/utils/helper';
import { ColorValue, colorNameToHex, convertHexToColor } from '../../common/utils/helper';
import { ChartShape } from '../../index';

/**
 * `Marker` Module used to render the marker for line type series.
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
        this.commonXvalues = [];
    }

    /**
     * Adds event listeners for the series.
     *
     * @returns {void}
     */
    public addEventListener(): void {
        if (this.chart.isDestroyed) { return; }
        this.chart.on(Browser.touchMoveEvent, this.mouseMoveHandler, this);
        this.chart.on(Browser.touchEndEvent, this.mouseUpHandler, this);

    }
    /**
     * Removes event listeners for the series.
     *
     * @returns {void}
     */
    public removeEventListener(): void {
        if (this.chart.isDestroyed) { return; }
        this.chart.off(Browser.touchMoveEvent, this.mouseMoveHandler);
        this.chart.off(Browser.touchEndEvent, this.mouseUpHandler);
    }

    /**
     * Handles the mouse up event.
     *
     * @returns {void}
     */
    private mouseUpHandler(): void {
        const chart: Chart = this.chart;
        if (chart.isTouch && !chart.crosshair.enable && !this.isSelected(chart)) {
            this.markerMove(true);
        }
    }

    /**
     * Handles the mouse move event.
     *
     * @returns {void}
     */
    public mouseMoveHandler(): void {
        const chart: Chart = this.chart;
        if ((chart.highlightMode !== 'None' || (chart.tooltip.enable)) && (!chart.isTouch || chart.startMove) && !this.isSelected(chart)) {
            this.markerMove(false);
        }
    }

    public markerMove(remove: boolean): void {
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
                if (!this.chart.tooltip.showNearestPoint) {
                    this.currentPoints = this.chart.tooltipModule.currentPoints;
                } else {
                    for (const chartSeries of chart.visibleSeries) {
                        if (!chartSeries.enableTooltip || chartSeries.category === 'Indicator') {
                            continue;
                        }
                        if (chart.chartAreaType === 'Cartesian' && chartSeries.visible) {
                            data = this.getClosestX(chart, chartSeries, this.commonXValue(this.chart.visibleSeries));
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
        }
        const length: number = this.previousPoints.length;
        if (this.currentPoints.length > 0 || (length > 0 && chart.tooltip.shared)) {
            if (length === 0 || chart.isPointMouseDown || (length > 0 && (this.currentPoints.length === 0 ||
                (this.previousPoints[0].point !== this.currentPoints[0].point)))) {
                if (length > 0) {
                    for (const previousPoint of this.previousPoints) {
                        if (!isNullOrUndefined(previousPoint)) {
                            this.removeHighlightedMarker(previousPoint.series as Series, previousPoint.point as Points);
                        }
                    }
                }
                for (const data of <PointData[]>this.currentPoints) {
                    if (
                        (data && data.point) || ((series.type !== 'Candle') &&
                            (series.type !== 'Hilo') && (series.type !== 'HiloOpenClose'))
                    ) {
                        stopTimer(this.markerExplode);
                        this.isRemove = true;
                        data.point.symbolLocations.map((location: ChartLocation, index: number) => {
                            if (data.series.marker.allowHighlight && (!data.series.isRectSeries || data.point.marker.visible)) {
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
            if (!isNullOrUndefined(this.previousPoints[0])) {
                this.markerExplode = +setTimeout(
                    (): void => {
                        if (this.previousPoints[0]) {
                            this.removeHighlightedMarker(this.previousPoints[0].series as Series, this.previousPoints[0].point as Points);
                        }
                    },
                    2000);
            }
        }
        this.currentPoints = [];
    }

    private animationDuration(): number {
        let duration: number = 200;
        if (this.chart.maxPointCount > 100) {
            duration = 10;
        }
        else if (this.chart.maxPointCount > 50) {
            duration = 100;
        }
        return duration;
    }

    private drawTrackBall(series: Series, point: Points, location: ChartLocation, index: number): void {
        const marker: MarkerSettingsModel = point.marker;
        const seriesMarker: MarkerSettingsModel = series.marker;
        const shape: ChartShape = marker.shape || seriesMarker.shape || 'Circle';
        let svg: Element;
        if (shape === 'None' || shape === 'Image') {
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
            (marker.width || seriesMarker.width) + 3,
            (marker.height || seriesMarker.height) + 3
        );
        const border: Border = <Border>(marker.border || series.border);
        const explodeSeries: boolean = (series.type === 'BoxAndWhisker' || series.type === 'Bubble' || series.type === 'Scatter');
        const borderColor: string = (border.color && border.color !== 'transparent') ? border.color :
            marker.fill || point.interior || (explodeSeries ? point.color : series.interior);
        const colorValue: ColorValue = convertHexToColor(colorNameToHex(borderColor));
        const borderWidth: number = marker.border ? marker.border.width : seriesMarker.border.width;
        const markerShadow: string = series.chart.themeStyle.markerShadow ||
            'rgba(' + colorValue.r + ',' + colorValue.g + ',' + colorValue.b + ',0.2)';
        const markerElement: Element = document.getElementById(this.elementId + '_Series_' + series.index + '_Point_' +
            point.index + '_Symbol');
        if (!isNullOrUndefined(markerElement)) {
            markerElement.setAttribute('visibility', 'hidden');
        }
        if (this.chart.enableCanvas) {
            const trackElement: HTMLElement = document.getElementById(this.chart.element.id + '_Secondary_Element');
            svg = this.chart.svgRenderer.createSvg({
                id: this.chart.element.id + '_trackball_svg',
                width: this.chart.availableSize.width,
                height: this.chart.availableSize.height
            });
            (svg as SVGElement).style.cssText = 'position: absolute; display:block; pointer-events: none';
            trackElement.appendChild(svg);
        }
        for (let i: number = 0; i < 2; i++) {
            const options: PathOption = new PathOption(
                symbolId + '_' + i,
                i ? (marker.fill || point.color || (explodeSeries ? series.interior : '#ffffff')) : 'transparent',
                borderWidth + (i ? 0 : 8),
                i ? borderColor : markerShadow,
                (marker.opacity || seriesMarker.opacity), series.marker.border.dashArray, null
            );
            const symbol: Element = drawSymbol(location, shape, size, marker.imageUrl, options, '',
                                               this.chart.svgRenderer, series.clipRect);
            // incident: 252450 point click selection not working while maker explode
            //symbol.setAttribute('style', 'pointer-events:none');
            symbol.setAttribute('class', this.elementId + '_EJ2-Trackball_Series_' + series.index + '_Point_' + point.index);
            const selectionId: string = element.id.indexOf('Symbol') !== -1 ? '_Symbol' : '';
            const seletionElem: Element = document.getElementById(this.elementId + '_Series_' + series.index + '_Point_' +
                point.index + selectionId);
            if (className !== '' && !isNullOrUndefined(className) && !isNullOrUndefined(seletionElem) &&
                seletionElem.hasAttribute('class') && (className === seletionElem.getAttribute('class'))) {
                symbol.classList.add(className);
            }
            symbol.setAttribute('clip-path', element.getAttribute('clip-path'));
            symbol.setAttribute('transform', element.getAttribute('transform'));
            if (this.chart.enableCanvas) {
                svg.appendChild(symbol);
            } else {
                this.chart.svgObject.appendChild(symbol);
            }
        }
        this.doAnimation(series, point, false);
    }

    /**
     * Perform animation for the series.
     *
     * @param {Series} series - The series to animate.
     * @param {Points} point - The point to animate.
     * @param {boolean} [endAnimate=false] - Flag to indicate if the animation is ending.
     * @returns {void}
     */
    public doAnimation(series: Series, point: Points, endAnimate: boolean = false): void {
        const duration: number = this.animationDuration();
        const delay: number = series.animation.delay;
        const rectElements: HTMLCollectionOf<Element> = document.getElementsByClassName(this.elementId + '_EJ2-Trackball_Series_' + series.index + '_Point_' + point.index);
        for (let i: number = 0, len: number = rectElements.length; i < len; i++) {
            this.trackballAnimate(
                <HTMLElement>rectElements[i as number], delay, duration, series,
                point.index, point.symbolLocations[0], false, endAnimate
            );
        }
    }

    /**
     * Perform animation for the trackball.
     *
     * @param {Element} elements - The elements to animate.
     * @param {number} delays - The delay duration for the animation.
     * @param {number} durations - The duration of the animation.
     * @param {Series} series - The series associated with the trackball.
     * @param {number} pointIndex - The index of the point to animate.
     * @param {ChartLocation} point - The location of the point to animate.
     * @param {boolean} isLabel - Flag to indicate if the animated element is a label.
     * @param {boolean} [endAnimate=false] - Flag to indicate if the animation is ending.
     * @returns {void}
     */
    public trackballAnimate(
        elements: Element, delays: number, durations: number, series: Series,
        pointIndex: number, point: ChartLocation, isLabel: boolean, endAnimate: boolean
    ): void {

        const centerX: number = point.x;
        const centerY: number = point.y;
        const clipX: number = (series.type !== 'Polar' && series.type !== 'Radar') ? series.clipRect.x : 0;
        const clipY: number = (series.type !== 'Polar' && series.type !== 'Radar') ? series.clipRect.y : 0;
        // let height: number = 0;
        //(<HTMLElement>elements).style.visibility = 'hidden';
        const transform: string = elements.getAttribute('transform');
        new Animation({}).animate(<HTMLElement>elements, {
            duration: durations,
            delay: delays,
            progress: (args: AnimationOptions): void => {
                if (args.timeStamp > args.delay) {
                    args.element.style.visibility = 'visible';
                    // height = ((args.timeStamp - args.delay) / args.duration);
                    elements.setAttribute('transform', 'translate(' + (centerX + clipX)
                         + ' ' + (centerY + clipY) + ') scale(1) translate(' + (-centerX) + ' ' + (-centerY) + ')');
                }
            },
            end: () => {
                (<HTMLElement>elements).style.visibility = '';
                elements.setAttribute('transform', transform);
                if (!isLabel && (pointIndex === series.points.length - 1)) {
                    series.chart.trigger('animationComplete', { series: series.chart.isBlazor ? {} : series });
                }

                if (endAnimate) {
                    remove(elements);
                }

            }
        });
    }

    /**
     * Remove the highlighted marker.
     *
     * @param {Series} [series=null] - The series associated with the marker to remove. Defaults to null.
     * @param {Points} [point=null] - The point associated with the marker to remove. Defaults to null.
     * @param {boolean} [fadeOut=false] - Flag to indicate if the removal should be faded out. Defaults to false.
     * @returns {void}
     */
    public removeHighlightedMarker(series: Series = null, point: Points = null, fadeOut: boolean = false): void {
        if (!isNullOrUndefined(series) && !isNullOrUndefined(point)) {
            const markerElement: Element = document.getElementById(this.elementId + '_Series_' + series.index + '_Point_' +
                point.index + '_Symbol');
            const trackballElements: HTMLCollectionOf<Element> = document.getElementsByClassName(this.elementId + '_EJ2-Trackball_Series_' + series.index + '_Point_' + point.index);
            if (trackballElements.length === 0) {
                const elements: NodeListOf<Element> = document.querySelectorAll(`[class*="${this.elementId + '_EJ2-Trackball_Series_' + series.index + '_Point_' + point.index}"]`);
                if (elements[1]) { elements[1].remove(); }
                if (elements[0]) { elements[0].remove(); }
            }
            for (let i: number = 0, len: number = trackballElements.length; i < len; i++) {
                remove(trackballElements[0]);
            }
            if (!isNullOrUndefined(markerElement)) {
                markerElement.setAttribute('visibility', 'visible');
            }
        }
        else {
            for (const point of series.points) {
                const elements: HTMLCollectionOf<Element> = document.getElementsByClassName(this.elementId + '_EJ2-Trackball_Series_' + series.index + '_Point_' + point.index);
                const markerElement: Element = document.getElementById(this.elementId + '_Series_' + series.index + '_Point_' +
                    point.index + '_Symbol');
                for (let i: number = 0, len: number = elements.length; i < len; i++) {
                    if (!isNullOrUndefined(markerElement)) {
                        markerElement.setAttribute('visibility', 'visible');
                    }
                    remove(elements[0]);
                }
            }
        }

        if (fadeOut) {
            this.previousPoints = [];
        }
    }
}
