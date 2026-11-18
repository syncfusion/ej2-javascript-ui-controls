import { measureText, Rect, Size, TextOption } from '@syncfusion/ej2-svg-base';
import { Chart } from '../chart';
import { Points, Series } from './chart-series';
import { SeriesLabelSettingsModel } from './chart-series-model';
import { extend, getValue } from '@syncfusion/ej2-base';
import { getVisiblePoints, ChartLocation, convertHexToColor, colorNameToHex, textElement, ColorValue, isCollide, RectOption, appendChildElement } from '../../common/utils/helper';
import { BorderModel, FontModel } from '../../common/model/base-model';
import { ErrorBarDirection } from '../utils/enum';
import { Axis } from '../axis/axis';
import { VisibleRangeModel } from '../../common';

/**
 * The 'SeriesLabel' module is used to render the series name near the series.
 */
export class SeriesLabel {

    private chart: Chart;

    /**
     * Constructor for the series label module.
     *
     * @param {Chart} chart - The parent chart.
     */
    constructor(chart: Chart) {
        this.chart = chart as Chart;
    }

    /**
     * Render the series label for series.
     *
     * @param {Series} series - The series to render.
     * @param {Chart} chart - The parent chart.
     * @param {SeriesLabelSettingsModel} seriesLabel - The settings for series labels.
     * @returns {void}
     * @private
     */
    public render(series: Series, chart: Chart, seriesLabel: SeriesLabelSettingsModel): void {
        if (!series.visible || !seriesLabel.visible) { return; }

        const group: HTMLElement = chart.seriesLabelElements as HTMLElement;
        const visiblePoints: Points[] = this.getZoomVisiblePoints(series);
        if (visiblePoints.length < 1) { return; }

        this.renderSeriesLabel(series, visiblePoints, group, seriesLabel);
    }

    /**
     * Render series label per series in proper anchor position.
     *
     * @param {Series} series - The current series object.
     * @param {Points[]} visiblePoints - the array of visible points in the series.
     * @param {HTMLElement} element - element that contains the series label elements
     * @param {SeriesLabelSettingsModel} seriesLabel - series label setting model.
     * @returns {Element[]} - Returns the created series label elements (empty if not placed).
     * @private
     */
    public renderSeriesLabel(series: Series, visiblePoints: Points[], element: HTMLElement, seriesLabel: SeriesLabelSettingsModel)
        : Element[] {
        const labelElements: Element[] = [];

        const labelText: string = series.labelSettings.text ? series.labelSettings.text : series.name;
        const font: FontModel = <FontModel>extend({}, getValue('properties', seriesLabel.font), null, true);
        const textSize: Size = measureText(labelText, font, this.chart.themeStyle.seriesLabelFont);
        const seriesRect: Rect[] = [];
        const clip: Rect = series.clipRect;
        const offset: number = 5;
        const errorBarRects: Rect[] = this.buildErrorBarRects(series);
        const blockers: Rect[] = [...this.chart.seriesLabelCollections, ...this.chart.dataLabelCollections as Rect[],
            ...this.chart.axisLabelCollections as Rect[], ...this.chart.markerCollections as Rect[], ...errorBarRects];
        const allowOverlap: boolean = seriesLabel.showOverlapText;
        const validPoints: Points[] = visiblePoints.filter((point: Points): boolean => {
            return !!(point && point.symbolLocations && point.symbolLocations[0]);
        });
        const finalOpacity: number = series.labelSettings.opacity ? series.labelSettings.opacity : series.labelSettings.font.opacity;
        const animationDelay: number = series.animation.enable ? (series.animation.duration + series.animation.delay) : 0;
        const isInitialRender: boolean = !this.chart.redraw && series.animation.enable;

        // Early return if no valid points
        if (validPoints.length === 0 || !clip) {
            return labelElements;
        }

        // Get the last valid point (or first if only one)
        const lastPoint: Points = validPoints[validPoints.length - 1];
        const lastSymbolLocation: ChartLocation = lastPoint.symbolLocations[0];

        // Find peak point (point with minimum Y value)
        const peakPoint: Points = validPoints.reduce((prev: Points, curr: Points) => {
            const prevY: number = prev.symbolLocations[0].y;
            const currY: number = curr.symbolLocations[0].y;
            return currY < prevY ? curr : prev;
        }, validPoints[0]);

        const anchorCandidates: ChartLocation[] = [
            this.addClipRectToPosition(lastSymbolLocation, clip),
            this.addClipRectToPosition(peakPoint.symbolLocations[0], clip)
        ];

        const padding: number = 4;
        const background: string = seriesLabel.background;
        const border: BorderModel = seriesLabel.border;
        const useShape: boolean = (background && background !== 'transparent') || (border && border.width && border.width > 0);
        const effectiveWidth: number = textSize.width + (useShape ? padding * 2 : 0);

        for (let j: number = 0; j < this.chart.visibleSeries.length; j++) {
            const currentSeries: Series = this.chart.visibleSeries[j as number];
            const seriesPoints: Points[] = currentSeries.points;
            if (!currentSeries || !currentSeries.visible || !seriesPoints || !Array.isArray(seriesPoints)) { continue; }
            const lineWidth: number = currentSeries.border.width || 2;

            for (let pointIndex: number = seriesPoints.length - 1; pointIndex > 0; pointIndex--) {
                const currPoint: Points = seriesPoints[pointIndex as number];
                const prevPoint: Points = seriesPoints[pointIndex - 1];

                if (
                    currPoint && prevPoint &&
                    currPoint.symbolLocations && prevPoint.symbolLocations &&
                    currPoint.symbolLocations[0] && prevPoint.symbolLocations[0]
                ) {
                    const currentPosition: ChartLocation = this.addClipRectToPosition(
                        currPoint.symbolLocations[0], currentSeries.clipRect );

                    const previousPosition: ChartLocation = this.addClipRectToPosition(
                        prevPoint.symbolLocations[0], currentSeries.clipRect );

                    const segmentRect: Rect = this.createRectFromPoints(currentPosition, previousPosition);
                    const halfWidth: number = lineWidth / 2;
                    segmentRect.y -= halfWidth;
                    segmentRect.height += lineWidth;
                    seriesRect.push(segmentRect);

                    if (Math.abs(currentPosition.x - previousPosition.x) < effectiveWidth) {
                        if (
                            pointIndex - 2 >= 0 && seriesPoints[pointIndex - 2] &&
                            seriesPoints[pointIndex - 2].symbolLocations &&
                            seriesPoints[pointIndex - 2].symbolLocations[0]
                        ) {
                            const adjRect: Rect = this.createRectFromPoints(
                                previousPosition,
                                this.addClipRectToPosition(seriesPoints[pointIndex - 2].symbolLocations[0], clip)
                            );
                            adjRect.y -= halfWidth;
                            adjRect.height += lineWidth;
                            seriesRect.push(adjRect);
                        }

                        if (
                            pointIndex + 1 < seriesPoints.length && seriesPoints[pointIndex + 1] &&
                            seriesPoints[pointIndex + 1].symbolLocations && seriesPoints[pointIndex + 1].symbolLocations[0]
                        ) {
                            const adjRect: Rect = this.createRectFromPoints(
                                currentPosition, this.addClipRectToPosition(seriesPoints[pointIndex + 1].symbolLocations[0], clip)
                            );
                            adjRect.y -= halfWidth;
                            adjRect.height += lineWidth;
                            seriesRect.push(adjRect);
                        }
                    }
                }
            }
        }
        if (validPoints.length > 1) {
            for (let i: number = validPoints.length - 1; i > 0; i--) {
                const currentPoint: Points = validPoints[i as number];
                const previousPoint: Points = validPoints[i - 1];

                if (currentPoint && previousPoint &&
                    currentPoint.symbolLocations && previousPoint.symbolLocations &&
                    currentPoint.symbolLocations[0] && previousPoint.symbolLocations[0]) {

                    const currentSegmentPoint: ChartLocation = this.addClipRectToPosition(currentPoint.symbolLocations[0], clip);
                    const previousSegmentPoint: ChartLocation = this.addClipRectToPosition(previousPoint.symbolLocations[0], clip);

                    if (currentSegmentPoint && previousSegmentPoint) {
                        anchorCandidates.push({
                            x: (currentSegmentPoint.x + previousSegmentPoint.x) / 2,
                            y: (currentSegmentPoint.y + previousSegmentPoint.y) / 2
                        });
                    }
                }
            }
        }
        let lastTriedInClipPosition: { x: number; y: number } | null = null;
        for (const anchor of anchorCandidates) {
            const isFilled: boolean = this.isFilledSeries(series);
            const candidatePositions: { x: number, y: number }[] = isFilled
                ? [{ x: anchor.x - textSize.width / 2, y: anchor.y + offset + 5 }]
                : [
                    { x: anchor.x - textSize.width / 2, y: anchor.y - offset - textSize.height },
                    { x: anchor.x - textSize.width / 2, y: anchor.y + offset + 5 }
                ];

            for (const position of candidatePositions) {
                if (!this.withinClip(position, textSize, clip)) { continue; }
                lastTriedInClipPosition = { x: position.x, y: position.y };

                let rectToPush: Rect = new Rect(position.x, position.y, textSize.width, textSize.height);
                if (useShape) {
                    rectToPush = new Rect(position.x - padding, position.y - padding,
                                          textSize.width + padding * 2, textSize.height + padding * 2);
                }
                const emptyRect: Rect = { x: 0, y: 0, width: 0, height: 0 };

                if (!isCollide(rectToPush, blockers, emptyRect) && !isCollide(rectToPush, seriesRect, emptyRect)) {
                    this.chart.seriesLabelCollections.push(rectToPush);
                    blockers.push(rectToPush);
                    const color: string = this.getLabelColor(series, font);
                    const labelId: string = this.chart.element.id + '_Point_' + (series.index) + '_Text_' + (series.index);

                    // draw background shape if required
                    let shapeElement: HTMLElement = null;
                    if (useShape) {
                        const shapeId: string = labelId + '_Shape';
                        const rectOption: RectOption = new RectOption(shapeId, background, border, seriesLabel.opacity, rectToPush, 0, 0, '');
                        shapeElement = this.chart.renderer.drawRectangle(rectOption, new Int32Array([clip.x, clip.y])) as HTMLElement;
                        appendChildElement(this.chart.enableCanvas, element, shapeElement, this.chart.redraw, true, 'x', 'y', null, '', false, false, null, series.animation.duration);
                        if (shapeElement) {
                            if (isInitialRender) {
                                shapeElement.setAttribute('opacity', '0');
                                this.animateElementOpacity(shapeElement as HTMLElement, 200, finalOpacity, animationDelay);
                            } else {
                                // On redraw (touch/click): set final opacity immediately, no animation
                                shapeElement.setAttribute('opacity', finalOpacity.toString());
                            }
                        }
                    }

                    const labelElement: Element = textElement(
                        this.chart.renderer,
                        new TextOption(labelId, position.x + textSize.width / 2, position.y + textSize.height / 1.5,
                                       'middle', labelText), font, color, element, false, this.chart.redraw, true, false,
                        series.animation.duration, clip, null, null, this.chart.enableCanvas, null, this.chart.themeStyle.seriesLabelFont,
                        new ChartLocation(position.x, position.y)
                    );
                    if (labelElement) {
                        if (isInitialRender) {
                            labelElement.setAttribute('opacity', '0');
                            this.animateElementOpacity(labelElement as HTMLElement, 200, finalOpacity, animationDelay);
                        } else {
                            // On redraw (touch/click): set final opacity immediately, no animation
                            labelElement.setAttribute('opacity', finalOpacity.toString());
                        }
                        labelElements.push(labelElement);
                    }
                    return labelElements;
                }
            }
        }
        if (allowOverlap && lastTriedInClipPosition) {
            const position: { x: number; y: number; } = lastTriedInClipPosition;
            const color: string = this.getLabelColor(series, font);
            const labelId: string = this.chart.element.id + '_Point_' + (series.index) + '_Text_' + (series.index);

            let rectToPush: Rect = new Rect(position.x, position.y, textSize.width, textSize.height);
            if (useShape) {
                rectToPush = new Rect(position.x - padding, position.y - padding,
                                      textSize.width + padding * 2, textSize.height + padding * 2);
            }

            this.chart.seriesLabelCollections.push(rectToPush);
            blockers.push(rectToPush);

            if (useShape) {
                const shapeId: string = labelId + '_Shape';
                const rectOption: RectOption = new RectOption(shapeId, background, border, seriesLabel.opacity, rectToPush, 0, 0, '');
                const shapeElement: HTMLElement = this.chart.renderer.drawRectangle(
                    rectOption, new Int32Array([clip.x, clip.y])) as HTMLElement;
                appendChildElement(this.chart.enableCanvas, element, shapeElement, this.chart.redraw, true, 'x', 'y', null, '', false, false, null, series.animation.duration);
                if (shapeElement) {
                    if (isInitialRender) {
                        shapeElement.setAttribute('opacity', '0');
                        this.animateElementOpacity(shapeElement as HTMLElement, 200, finalOpacity, animationDelay);
                    } else {
                        shapeElement.setAttribute('opacity', finalOpacity.toString());
                    }
                }
            }

            const labelElement: Element = textElement(
                this.chart.renderer,
                new TextOption(labelId, position.x + textSize.width / 2, position.y + textSize.height / 1.5,
                               'middle', labelText), font, color, element, false, this.chart.redraw, true, false,
                series.animation.duration, clip, null, null, this.chart.enableCanvas, null, this.chart.themeStyle.seriesLabelFont,
                new ChartLocation(position.x, position.y)
            );
            if (labelElement) {
                if (isInitialRender) {
                    labelElement.setAttribute('opacity', '0');
                    this.animateElementOpacity(labelElement as HTMLElement, 200, finalOpacity, animationDelay);
                } else {
                    labelElement.setAttribute('opacity', finalOpacity.toString());
                }
                labelElements.push(labelElement);
            }
        }
        return labelElements;
    }

    /**
     * Create rect by using two points as diagonal from the top-left and bottom-right points.
     *
     * @param {ChartLocation} startPoint - the first point's position on the chart
     * @param {ChartLocation} endPoint - the second point's position on the chart.
     * @returns {Rect} - a rect created with 2 points.
     */
    private createRectFromPoints(startPoint: ChartLocation, endPoint: ChartLocation): Rect {
        const x: number = Math.min(startPoint.x, endPoint.x);
        const y: number = Math.min(startPoint.y, endPoint.y);
        const width: number = Math.abs(endPoint.x - startPoint.x);
        const height: number = Math.abs(endPoint.y - startPoint.y);
        return new Rect(x, y, width, height);
    }

    /**
     * Adding clip rect to the positions of each data points before placing labels.
     *
     * @param {ChartLocation} position - Location of the point in the chart.
     * @param {Rect} clipRect - created imaginary rect per point.
     * @returns {ChartLocation} Suitable rect position for anchors.
     */
    private addClipRectToPosition(position: ChartLocation, clipRect: Rect): ChartLocation {
        if (!position || typeof position.x !== 'number' || typeof position.y !== 'number' ||
            !clipRect || typeof clipRect.x !== 'number' || typeof clipRect.y !== 'number') {
            return { x: 0, y: 0 };
        }
        return {
            x: position.x + clipRect.x,
            y: position.y + clipRect.y
        };
    }

    /**
     * Check the point is within the clip rectangle.
     *
     * @param {ChartLocation} pos - position of data points in chart.
     * @param {Size} size - size of label text.
     * @param {Rect} clip - created imaginary Rect for data points.
     * @returns {boolean} true if within the rect, else false.
     */
    private withinClip(pos: ChartLocation, size: Size, clip: Rect): boolean {
        return (
            pos.x >= clip.x && pos.y >= clip.y && pos.x + size.width <= clip.x + clip.width &&
            pos.y + size.height <= clip.y + clip.height
        );
    }

    /**
     * Render the series labels with animation.
     *
     * @param {HTMLElement} element - current label element per series.
     * @param {number} duration - animation duration.
     * @param {number} finalOpacity - opacity set by user.
     * @param {number} delay - animation delay.
     * @returns {void}
     * @private
     */
    public animateElementOpacity(element: HTMLElement, duration: number, finalOpacity: number, delay?: number): void {
        // Animate ONLY during initial series animation, not during redraw interactions.
        const isInitialSeriesAnimation: boolean = !this.chart.redraw && (this.chart).animateSeries;
        if (!isInitialSeriesAnimation || duration <= 0) {
            element.setAttribute('opacity', finalOpacity.toString());
            return;
        }
        element.setAttribute('opacity', '0');
        const startAnimation: () => void = () => {
            let startTime: number | null = null;
            const animate: FrameRequestCallback = (time: number) => {
                if (startTime === null) { startTime = time; }
                const progress: number = Math.min((time - startTime) / duration, 1);
                element.setAttribute('opacity', (progress * finalOpacity).toString());
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    element.setAttribute('opacity', finalOpacity.toString());
                }
            };
            requestAnimationFrame(animate);
        };
        if (delay && delay > 0) {
            setTimeout(startAnimation, delay);
        } else {
            startAnimation();
        }
    }

    /**
     * Determine the color for each label based on the background & theme.
     *
     * @param {Series} series - current series.
     * @param {FontModel} font - font properties.
     * @returns {string} - the color of label.
     */
    private getLabelColor(series: Series, font: FontModel): string {
        if (this.isFilledSeries(series)) {
            const baseColor: string =
                series.interior;
            const rgb: ColorValue = convertHexToColor(colorNameToHex(baseColor));
            const brightness: number = Math.round((rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000);
            const contrastColor: string = brightness >= 128 ? 'black' : 'white';
            return font.color || contrastColor;
        }
        return font.color || series.border.color || series.interior;
    }

    /**
     * Check whether the current series is a filled-type series.
     *
     * @param {Series} series - current series.
     * @returns {boolean} true if filled-type, else false.
     */
    private isFilledSeries(series: Series): boolean {
        return (series.type === 'Area' || series.type === 'StackingArea' || series.type === 'RangeArea' ||
            series.type === 'StepArea' || series.type === 'SplineArea' || series.type === 'RangeStepArea');
    }

    /**
     * Calculate the dimensions for error bars if present.
     *
     * @param {Series} series - current series.
     * @returns {Rect[]} a rect for error bars.
     */
    private buildErrorBarRects(series: Series): Rect[] {
        const rects: Rect[] = [];

        if (!series || !series.errorBar || !series.errorBar.visible) { return rects; }
        if (!series.chart || !series.chart.errorBarModule) { return rects; }

        const positiveHeight: number = series.chart.errorBarModule.positiveHeight || 0;
        const negativeHeight: number = series.chart.errorBarModule.negativeHeight || 0;

        // Decide which spans to include based on direction
        const direction: ErrorBarDirection = series.errorBar.direction as ErrorBarDirection;
        const includePlus: boolean = (direction === 'Plus' || direction === 'Both');
        const includeMinus: boolean = (direction === 'Minus' || direction === 'Both');

        // Cap width (fallback to a small width if not set)
        const capWidth: number = Math.max(6, series.errorBar.errorBarCap.width as number);
        for (const points of series.points as Points[]) {
            if (!points || !points.visible || !points.symbolLocations || !points.symbolLocations[0]) { continue; }
            const symbolLocation: ChartLocation = points.symbolLocations[0];

            // Base point in chart coords
            const cx: number = symbolLocation.x + series.clipRect.x;
            const cy: number = symbolLocation.y + series.clipRect.y;

            // Vertical span for blockers:
            const up: number = includePlus ? positiveHeight : 0;
            const down: number = includeMinus ? Math.abs(negativeHeight) : 0;

            if (up === 0 && down === 0) { continue; }

            const top: number = cy - up;
            const bottom: number = cy + down;

            rects.push(new Rect(cx - capWidth / 2, Math.min(top, bottom), capWidth, Math.abs(bottom - top)));
        }

        return rects;
    }

    /**
     * Get visible points based on current axis zoom state.
     *
     * @param {Series} series - The series to filter.
     * @returns {Points[]} - Array of points within the visible axis range.
     * @private
     */
    private getZoomVisiblePoints(series: Series): Points[] {
        const allVisiblePoints: Points[] = getVisiblePoints(series);
        if (!series.xAxis || !series.yAxis) { return allVisiblePoints; }
        const xAxis: Axis = series.xAxis;
        const yAxis: Axis = series.yAxis;

        // Check if chart is zoomed
        const isZoomed: boolean = (xAxis.zoomFactor !== 1 || xAxis.zoomPosition !== 0 ||
            yAxis.zoomFactor !== 1 || yAxis.zoomPosition !== 0);

        if (!isZoomed) { return allVisiblePoints; }
        // Get visible ranges
        const xRange: VisibleRangeModel = xAxis.visibleRange;
        const yRange: VisibleRangeModel = yAxis.visibleRange;
        // Filter points within visible range
        return allVisiblePoints.filter((point: Points) => {
            if (!point || point.x === null || point.y === null) { return false; }
            const xValue: number = typeof point.x === 'number' ? point.x :
                point.x instanceof Date ? point.x.getTime() :
                    parseFloat(point.x as string);
            if (xValue < xRange.min || xValue > xRange.max) { return false; }
            const yValue: number = typeof point.y === 'number' ? point.y : parseFloat(point.y as string);
            if (yValue < yRange.min || yValue > yRange.max) { return false; }
            return true;
        });
    }

    /**
     * Clear existing series labels from the chart.
     *
     * @returns {void}
     * @private
     */
    public clearLabels(): void {
        if (this.chart.seriesLabelElements) {
            while (this.chart.seriesLabelElements.firstChild) {
                this.chart.seriesLabelElements.removeChild(this.chart.seriesLabelElements.firstChild);
            }
        }
        // Clear the collision collection
        this.chart.seriesLabelCollections = [];
    }

    /**
     * Get module name.
     *
     * @returns {string} - Returns the module name.
     */
    protected getModuleName(): string {
        // Returns the module name
        return 'SeriesLabel';
    }
    /**
     * To destroy the series label module.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        // Destroy method performed here
    }
}
