import { Animation, AnimationOptions, animationMode, isNullOrUndefined, remove } from '@syncfusion/ej2-base';
import { DoubleRange } from '../utils/double-range';
import { appendChildElement, redrawElement, pathAnimation, valueToCoefficient, getVisiblePoints, colorNameToHex, checkColorFormat, applyZLight, markerAnimate } from '../../common/utils/helper';
import { getAnimationFunction, getPoint, ChartLocation, getMinPointsDelta } from '../../common/utils/helper';
import { PathOption, Rect } from '@syncfusion/ej2-svg-base';
import { Chart } from '../chart';
import { Column, Row } from '../axis/axis';
import { Series, Points } from './chart-series';
import { AnimationModel, BorderModel } from '../../common/model/base-model';
import { IPointRenderEventArgs } from '../../chart/model/chart-interface';
import { pointRender } from '../../common/model/constants';
import { CylinderSeriesOption } from './column-series';
import { SeriesModel } from './chart-series-model';

/**
 * Base class for column series.
 * This class provides common properties and methods for column series in the chart.
 *
 * @private
 */

export class ColumnBase {

    /**
     * To get the position of the column series.
     *
     * @returns {DoubleRange} doubleRange
     * @private
     */
    public options: PathOption;
    public element: HTMLElement;
    protected getSideBySideInfo(series: Series): DoubleRange {
        series.isRectSeries = true;
        if ((series.chart.enableSideBySidePlacement && !series.position) || !isNullOrUndefined(series.columnWidthInPixel)) {
            this.getSideBySidePositions(series);
        }
        if (series.columnWidthInPixel) {
            return new DoubleRange(0, 0);
        }
        const position: number = series.type === 'Histogram' || !series.chart.enableSideBySidePlacement ? 0 : series.position;
        const rectCount: number = series.type === 'Histogram' || !series.chart.enableSideBySidePlacement ? 1 : series.rectCount;
        const visibleSeries: Series[] = series.chart.visibleSeries;
        const seriesSpacing: number = series.chart.enableSideBySidePlacement ? series.columnSpacing : 0; // Column Spacing
        const pointSpacing: number = (series.columnWidth === null || isNaN(+series.columnWidth)) ? ((series.type === 'Histogram') ? 1 : 0.7) :
            Math.min(series.columnWidth, 1); // Column width
        const minimumPointDelta: number = getMinPointsDelta(series.xAxis, visibleSeries);
        const width: number = minimumPointDelta * pointSpacing;
        let radius: number;
        const location: number = (position) / rectCount - 0.5;
        let doubleRange: DoubleRange = new DoubleRange(location, location + (1 / rectCount));
        if (!(isNaN(doubleRange.start) || isNaN(doubleRange.end))) {
            if (series.groupName && series.type.indexOf('Stacking') === -1) {
                let mainColumnWidth: number = 0.7;
                series.chart.series.filter(function(series: SeriesModel): void {
                    if (series.columnWidth > mainColumnWidth) {mainColumnWidth = series.columnWidth; } });
                const mainWidth: number = minimumPointDelta * mainColumnWidth;
                const mainDoubleRange: DoubleRange = new DoubleRange(doubleRange.start * mainWidth, doubleRange.end * mainWidth);
                const difference: number = ((mainDoubleRange.delta) - (doubleRange.end * width - doubleRange.start * width)) / 2;
                doubleRange = new DoubleRange(mainDoubleRange.start + difference, mainDoubleRange.end - difference);
            } else {
                doubleRange = new DoubleRange(doubleRange.start * width, doubleRange.end * width);
            }
            radius = seriesSpacing * doubleRange.delta;
            doubleRange = new DoubleRange(doubleRange.start + radius / 2, doubleRange.end - radius / 2);
        }
        return doubleRange;
    }
    /**
     * Gets the rectangle bounds based on two points.
     *
     * @param {number} x1 - The x-coordinate of the first point.
     * @param {number} y1 - The y-coordinate of the first point.
     * @param {number} x2 - The x-coordinate of the second point.
     * @param {number} y2 - The y-coordinate of the second point.
     * @param {Series} series - The series associated with the rectangle.
     * @returns {Rect} - The rectangle bounds.
     */
    protected getRectangle(x1: number, y1: number, x2: number, y2: number, series: Series): Rect {
        const point1: ChartLocation = getPoint(x1, y1, series.xAxis, series.yAxis, series.chart.requireInvertedAxis);
        const point2: ChartLocation = getPoint(x2, y2, series.xAxis, series.yAxis, series.chart.requireInvertedAxis);
        return new Rect(
            Math.min(point1.x, point2.x), Math.min(point1.y, point2.y),
            Math.abs(point2.x - point1.x), Math.abs(point2.y - point1.y)
        );
    }
    /**
     * Draws a cylinder using the provided options and element.
     *
     * @param {PathOption} options - The path options for drawing the cylinder.
     * @param {HTMLElement} element - The HTML element to which the cylinder is drawn.
     * @param {CylinderSeriesOption} cylinderSeriesOption - The options specific to the cylinder series.
     * @param {Rect} rect - The rectangle bounds within which the cylinder is drawn.
     * @param {Series} series - The series associated with the cylinder.
     * @returns {void}
     */
    protected drawCylinder(options: PathOption, element: HTMLElement, cylinderSeriesOption: CylinderSeriesOption,
                           rect: Rect, series: Series): void {
        const width: number = rect.width; const height: number = rect.height;
        if (series.chart.enableCanvas) {
            let ctx: CanvasRenderingContext2D = series.chart.canvasRender.ctx;
            const canvasCtx: CanvasRenderingContext2D = ctx;
            ctx.save();
            const gradientColor: string = colorNameToHex(options.fill);
            const x: number = rect.x + series.clipRect.x; const y: number = rect.y + series.clipRect.y; let arc: number = 2 * Math.PI + 0.1;
            let rx: number; let ry: number; let cx1: number; let cx2: number; let cy1: number; let cy2: number; let x1: number;
            let x2: number; let y1: number; let y2: number; let cx: number; let cy: number; let xl: number; let yl: number;
            let xPos: number; let yPos: number; let step: number; let rxt: number; let ryt: number; let gx1: number = 0;
            let gx2: number = 0; let gy1: number = 0; let gy2: number = 0; let ini: number = 0;
            ctx.fillStyle = applyZLight(gradientColor, 0.9);
            ctx.lineWidth = 0;
            ctx.strokeStyle = applyZLight(gradientColor, 0.9);
            ctx.globalAlpha = options.opacity;
            if (cylinderSeriesOption.isColumn) {
                gx1 = x;
                gx2 = width + x;
                rx = width / 2;
                ry = rx / 4;
                cx2 = cx1 = x + rx;
                y2 = cy1 = y - ry;
                x2 = x;
                x1 = x + width;
                cy2 = y1 = y + height - ry;
                step = Math.PI;
                rxt = -rx;
                ryt = ry;
                if (cylinderSeriesOption.stacking) {
                    if (!cylinderSeriesOption.isLastSeries) {
                        y2 = cy1 = y + ry;

                    }
                }
            }
            else {
                gy2 = height + y;
                gy1 = y;
                ry = height / 2;
                rx = ry / 4;
                x2 = cx1 = x + rx;
                x1 = cx2 = x + width + rx;
                y1 = y + height;
                y2 = y;
                cy2 = cy1 = y + ry;
                ini = Math.PI / 2;
                step = Math.PI * 1.5;
                if (cylinderSeriesOption.stacking) {
                    if (!cylinderSeriesOption.isLastSeries) {
                        x1 = cx2 = x + width - rx;
                    }
                }
                ry = -ry;
                rx = -rx;
                rxt = rx;
                ryt = -ry;
            }
            const color: string = applyZLight(gradientColor, 0.7);
            const gradient: CanvasGradient = ctx.createLinearGradient(gx1, gy1, gx2, gy2);
            gradient.addColorStop(0, gradientColor);
            gradient.addColorStop(0.3, color);
            gradient.addColorStop(0.7, color);
            gradient.addColorStop(1, gradientColor);
            for (let j: number = 1; j <= 4; j++) {
                let i: number = 0;
                if (j < 4) {
                    ctx.beginPath();
                }
                if (j % 2 === 0) {
                    cx = cx2; cy = cy2; xl = x2; yl = y2;
                }
                else {
                    cx = cx1; cy = cy1; xl = x1; yl = y1;
                }
                if (j === 4) {
                    rx = rxt;
                    ry = ryt;
                    ctx.fillStyle = gradient;
                }
                if (j > 2) {
                    i = ini;
                    arc = step;
                }
                for (; i <= arc; i += 0.1) {
                    xPos = cx - (rx * Math.cos(i));
                    yPos = cy + (ry * Math.sin(i));
                    if (i === 0) {
                        ctx.moveTo(xPos, yPos);
                    } else {
                        ctx.lineTo(xPos, yPos);
                    }
                }
                if (j > 2) {
                    ctx.lineTo(xl, yl);
                }
                if (j !== 3) {
                    ctx.stroke();
                    ctx.fill();
                }
            }
            if (options.id.indexOf('Series') >= 0) {
                ctx.clip();
                ctx.restore();
                ctx = canvasCtx;
            }
        }
        else {
            const chart: Chart = series.chart;
            const x: number = rect.x;
            const y: number = rect.y;
            const id: string = options.id;
            let gradientColor: string = options.fill;
            const fillColor: string = gradientColor;
            const format: boolean = checkColorFormat(gradientColor);
            if (!format) {
                gradientColor = colorNameToHex(gradientColor);
            }
            let AEx: number = 0; let AEy: number = 0; let LX: number = 0; let LY: number = 0; let GX: number = 0; let GY: number = 0;
            let X: number; let Y: number; let X1: number; let Y1: number; let X2: number; let Y2: number; let rx: number;
            let ry: number; let i: number = 2;
            if (cylinderSeriesOption.isColumn) {
                rx = width / 2;
                ry = rx / 4;
                X = X1 = x;
                Y = ry < y ? y - ry : cylinderSeriesOption.stacking ? y + ry : (y - ry);
                Y1 = Y;
                AEx = 2 * rx;
                LY = ry < y ? height : (height < 2 * ry ? height : cylinderSeriesOption.stacking ? height - (2 * ry) : height);
                X2 = X;
                Y2 = ry < y ? Y + height : (height < Y ? height + Y : cylinderSeriesOption.stacking ? height + (y - ry) : height + Y);
                GX = 100;
                if (cylinderSeriesOption.stacking) {
                    if (!cylinderSeriesOption.isLastSeries) {
                        Y = Y1 = y + ry;
                        LY = height < rx / 2 ? height : height - rx / 2;
                    }
                }
            }
            else {
                ry = height / 2;
                rx = ry / 4;
                Y = Y1 = y;
                X = X1 = Math.abs(x - rx);
                AEy = 2 * ry;
                LX = width;
                X2 = X + width;
                Y2 = Y;
                GY = 100;
                if (cylinderSeriesOption.stacking) {
                    if (!cylinderSeriesOption.isLastSeries) {
                        X2 = (X + width - rx * 2);
                        LX = width - rx * 2;
                    }
                }
            }
            remove(this.element);
            while (i--) {
                options.d = 'M' + X.toString() + ',' + Y.toString() + 'a' + rx.toString() + ',' + ry.toString() + ' 0 1,0 ' + AEx.toString() + ',' + AEy.toString() + 'a' + rx.toString() + ',' + ry.toString() + ' 0 1,0 ' + (-1 * AEx).toString() + ',' + (-1 * AEy).toString();
                options.id = id + '_' + 'Region_' + i;
                options.fill = applyZLight(gradientColor, 0.9);
                if ( i % 2 === 0 && series.type !== 'StackingBar100' && series.type !== 'StackingBar' && series.type !== 'Bar' ) {
                    options.fill = options.fill + '10';
                }
                this.element = chart.renderer.drawPath(
                    this.options, new Int32Array([series.clipRect.x, series.clipRect.y])
                ) as HTMLElement;
                appendChildElement(series.chart.enableCanvas, series.seriesElement, this.element, chart.redraw);
                X = X2;
                Y = Y2;
            }
            options.d = 'M' + X1.toString() + ',' + Y1.toString() + 'a' + rx.toString() + ',' + ry.toString() + ' 0 1,0 ' + AEx.toString() + ',' + AEy.toString() + 'l' + LX.toString() + ' ' + LY.toString() + 'a' + rx.toString() + ',' + ry.toString() + ' 0 1,1 ' + (-1 * AEx).toString() + ',' + (-1 * AEy).toString() + ' z';
            options.id = id + '_' + 'Region_2';
            options.fill = applyZLight(gradientColor, 0.7);
            let optiong: OptionGradient;
            if (fillColor.indexOf('url') === -1) {
                if (!document.getElementById(id)) {
                    optiong = { 'id': id, x1: '0%', y1: '0%', x2: GX.toString() + '%', y2: GY.toString() + '%' };
                    const gradientElement: GradientStop[] = [{ colorStop: '0%', color: gradientColor }, { colorStop: '30%', color: applyZLight(gradientColor, 0.7) }, { colorStop: '70%', color: applyZLight(gradientColor, 0.7) }, { colorStop: '100%', color: gradientColor }];
                    this.drawGradient(optiong, gradientElement, series);
                }
                options.fill = 'url(#' + optiong.id + ')';
            }
            this.element = chart.renderer.drawPath(
                this.options, new Int32Array([series.clipRect.x, series.clipRect.y])
            ) as HTMLElement;
            appendChildElement(series.chart.enableCanvas, series.seriesElement, this.element, chart.redraw);
        }
    }
    /**
     * Draws a gradient using the provided options and gradient element.
     *
     * @param {OptionGradient} optiong - The gradient options for drawing the gradient.
     * @param {Object} gradientElement - The gradient element to which the gradient is applied.
     * @param {Series} series - The series associated with the gradient.
     * @returns {void}
     */
    private drawGradient(optiong: OptionGradient, gradientElement: Object, series: Series): void {
        const chart: Chart = series.chart;
        const defElement: Element = chart.renderer.createDefs();
        const xmlns: string = 'http://www.w3.org/2000/svg';
        const linearGradientElement: Element = document.createElementNS(xmlns, 'linearGradient');
        linearGradientElement.setAttribute('id', optiong.id);
        linearGradientElement.setAttribute('x1', optiong.x1);
        linearGradientElement.setAttribute('y1', optiong.y1);
        linearGradientElement.setAttribute('x2', optiong.x2);
        linearGradientElement.setAttribute('y2', optiong.y2);
        for (let i: number = 0; i < (gradientElement as GradientStop[]).length; i++) {
            const stopElement: Element = document.createElementNS(xmlns, 'stop');
            stopElement.setAttribute('offset', gradientElement[i as number].colorStop);
            stopElement.setAttribute('stop-color', gradientElement[i as number].color);
            stopElement.setAttribute('stop-opacity', '1');
            linearGradientElement.appendChild(stopElement);
        }
        series.seriesElement.appendChild(defElement);
        defElement.appendChild(linearGradientElement);
    }

    /**
     * To get the position of each series.
     *
     * @param {Series} series - The series for which side-by-side positions are calculated.
     * @returns {void}
     * @private
     */
    private getSideBySidePositions(series: Series): void {
        const chart: Chart = series.chart;
        for (const columnItem of chart.columns) {
            for (const item of chart.rows) {
                this.findRectPosition(series.findSeriesCollection(<Column>columnItem, <Row>item, false));
            }
        }
    }
    private findRectPosition(seriesCollection: Series[]): void {
        const groupingValues: string[] = [];
        const vSeries: RectPosition = { rectCount: 0, position: null };
        for (let i: number = 0; i < seriesCollection.length; i++) {
            const value: Series = seriesCollection[i as number];
            if (value.type.indexOf('Stacking') !== -1 || value.groupName !== '') {
                const groupName: string = value.type.indexOf('Stacking') !== -1 ? value.stackingGroup : value.type + value.groupName;
                if (groupName) {
                    if (groupingValues[groupName as string] === undefined) {
                        value.position = vSeries.rectCount;
                        groupingValues[groupName as string] = vSeries.rectCount++;
                    } else {
                        value.position = groupingValues[groupName as string];
                    }
                } else {
                    if (vSeries.position === null) {
                        value.position = vSeries.rectCount;
                        vSeries.position = vSeries.rectCount++;
                    } else {
                        value.position = vSeries.position;
                    }
                }
            } else {
                value.position = vSeries.rectCount++;
            }
        }
        for (let i: number = 0; i < seriesCollection.length; i++) {
            const value: Series = seriesCollection[i as number];
            value.rectCount = vSeries.rectCount;
        }
    }

    /**
     * Updates the location of the symbol based on the point and rect coordinates.
     *
     * @param {Points} point - The point for which the symbol location is updated.
     * @param {Rect} rect - The rect representing the symbol location.
     * @param {Series} series - The series to which the point belongs.
     * @returns {void}
     */
    protected updateSymbolLocation(point: Points, rect: Rect, series: Series): void {
        if (!series.chart.requireInvertedAxis) {
            this.updateXRegion(point, rect, series);
        } else {
            this.updateYRegion(point, rect, series);
        }
        if (series.type === 'Histogram') {
            point.minimum = +point.x - series.histogramValues.binWidth / 2;
            point.maximum = +point.x + series.histogramValues.binWidth / 2;
        }
    }

    /**
     * Updates the x-region of the symbol based on the point and rect coordinates.
     *
     * @param {Points} point - The point for which the x-region is updated.
     * @param {Rect} rect - The rect representing the x-region.
     * @param {Series} series - The series to which the point belongs.
     * @returns {void}
     */
    protected updateXRegion(point: Points, rect: Rect, series: Series): void {
        point.symbolLocations.push({
            x: rect.x + (rect.width) / 2,
            y: (series.seriesType === 'BoxPlot' || series.seriesType.indexOf('HighLow') !== -1 ||
                (point.yValue >= 0 === !series.yAxis.isAxisInverse)) ? rect.y : (rect.y + rect.height)
        });
        this.getRegion(point, rect, series);
        if (series.type === 'RangeColumn') {
            point.symbolLocations.push({
                x: rect.x + (rect.width) / 2,
                y: rect.y + rect.height
            });
        }
    }
    /**
     * Updates the y-region of the symbol based on the point and rect coordinates.
     *
     * @param {Points} point - The point for which the y-region is updated.
     * @param {Rect} rect - The rect representing the y-region.
     * @param {Series} series - The series to which the point belongs.
     * @returns {void}
     */
    protected updateYRegion(point: Points, rect: Rect, series: Series): void {
        point.symbolLocations.push({
            x: (series.seriesType === 'BoxPlot' || series.seriesType.indexOf('HighLow') !== -1 ||
                (point.yValue >= 0 === !series.yAxis.isAxisInverse)) ? rect.x + rect.width : rect.x,
            y: rect.y + rect.height / 2
        });
        this.getRegion(point, rect, series);
        if (series.type === 'RangeColumn') {
            point.symbolLocations.push({
                x: rect.x,
                y: rect.y + rect.height / 2
            });
        }
    }
    /**
     * To render the marker for the series.
     *
     * @param {Series} series - The series for which markers are rendered.
     * @returns {void}
     * @private
     */
    public renderMarker(series: Series): void {
        if (series.marker && series.marker.visible) {
            series.chart.markerRender.render(series);
        }
    }
    /**
     * To get the marker region when Y value is 0
     *
     * @param {Points} point point
     * @param {rect} rect rect
     * @param {Series} series series
     * @returns {void}
     */
    private getRegion(point: Points, rect: Rect, series: Series): void {
        if (point.y === 0) {
            const markerWidth: number = (series.marker && series.marker.width) ? series.marker.width : 0;
            const markerHeight: number = (series.marker && series.marker.height) ? series.marker.height : 0;
            point.regions.push(new Rect(
                point.symbolLocations[0].x - markerWidth,
                point.symbolLocations[0].y - markerHeight,
                2 * markerWidth,
                2 * markerHeight
            ));
        } else {
            point.regions.push(rect);
        }
    }
    /**
     * Triggers the point render event.
     *
     * @param {Series} series - The series associated with the point.
     * @param {Points} point - The data point for which the event is triggered.
     * @param {string} fill - The fill color of the point.
     * @param {BorderModel} border - The border settings of the point.
     * @returns {IPointRenderEventArgs} - The event arguments.
     */
    protected triggerEvent(series: Series, point: Points, fill: string, border: BorderModel): IPointRenderEventArgs {
        const argsData: IPointRenderEventArgs = {
            cancel: false, name: pointRender, series: series, point: point,
            fill: series.setPointColor(point, fill),
            border: series.setBorderColor(point, border),
            cornerRadius: series.cornerRadius
        };
        series.chart.trigger(pointRender, argsData);
        point.color = argsData.fill;
        return argsData;
    }

    /**
     * Draws a rectangle for the data point.
     *
     * @param {Series} series - The series associated with the point.
     * @param {Points} point - The data point for which the rectangle is drawn.
     * @param {Rect} rect - The rect bounds.
     * @param {IPointRenderEventArgs} argsData - The event arguments.
     * @returns {void}
     */
    protected drawRectangle(
        series: Series, point: Points, rect: Rect, argsData: IPointRenderEventArgs
    ): void {
        const chart: Chart = series.chart;
        const check: number = chart.requireInvertedAxis ? rect.height : rect.width;
        if (check <= 0) {
            return null;
        }
        let direction: string;
        if (point.y === 0) {
            // For 0 values corner radius will not calculate
            direction = this.calculateRoundedRectPath(rect, 0, 0, 0, 0);
        } else {
            let topLeft: number;
            let topRight: number;
            let bottomLeft: number;
            let bottomRight: number;
            const isNegative: boolean = point.y as number < 0;
            if (chart.requireInvertedAxis) {
                topLeft = isNegative ? argsData.cornerRadius.topRight : argsData.cornerRadius.topLeft;
                topRight = isNegative ? argsData.cornerRadius.topLeft : argsData.cornerRadius.topRight;
                bottomLeft = isNegative ? argsData.cornerRadius.bottomRight : argsData.cornerRadius.bottomLeft;
                bottomRight = isNegative ? argsData.cornerRadius.bottomLeft : argsData.cornerRadius.bottomRight;
            }
            else {
                topLeft = isNegative ? argsData.cornerRadius.bottomLeft : argsData.cornerRadius.topLeft;
                topRight = isNegative ? argsData.cornerRadius.bottomRight : argsData.cornerRadius.topRight;
                bottomLeft = isNegative ? argsData.cornerRadius.topLeft : argsData.cornerRadius.bottomLeft;
                bottomRight = isNegative ? argsData.cornerRadius.topRight : argsData.cornerRadius.bottomRight;
            }
            direction = this.calculateRoundedRectPath(
                rect, topLeft, topRight, bottomLeft, bottomRight, chart.requireInvertedAxis
            );
        }
        const name: string = series.category === 'Indicator' ? chart.element.id + '_Indicator_' + series.index + '_' + series.name +
            '_Point_' + point.index : chart.element.id + '_Series_' + series.index + '_Point_' + ((series.removedPointIndex !== null && series.removedPointIndex <= point.index) ? (point.index + 1) : point.index);
        const previousElement: Element = redrawElement(chart.redraw, name);
        const previousDirection: string = previousElement ? previousElement.getAttribute('d') : '';
        this.options = new PathOption(
            name, argsData.fill, argsData.border.width, argsData.border.color, series.opacity, series.border.dashArray, (series.columnFacet === 'Cylinder') ? '' : direction);
        this.element = chart.renderer.drawPath(
            this.options, new Int32Array([series.clipRect.x, series.clipRect.y])
        ) as HTMLElement;
        if (series.removedPointIndex !== null && series.removedPointIndex <= point.index) {
            this.element.id = chart.element.id + '_Series_' + series.index + '_Point_' + point.index;
        }
        switch (series.seriesType) {
        case 'XY':
            this.element.setAttribute('role', 'img');
            this.element.setAttribute('aria-label', series.accessibility.accessibilityDescriptionFormat ? series.formatAccessibilityDescription(point, series) : (point.x + ':' + point.yValue + ', ' + series.name));
            break;
        case 'HighLow':
            this.element.setAttribute('role', 'img');
            this.element.setAttribute('aria-label', series.accessibility.accessibilityDescriptionFormat ? series.formatAccessibilityDescription(point, series) : (point.x + ':' + point.high + ', ' + point.low + ', ' + series.name));
            break;
        }
        if (!(series.columnFacet === 'Cylinder' && (chart.redraw || !chart.enableAnimation) && series.seriesElement.querySelector('#' + this.element.id))) {
            appendChildElement(series.chart.enableCanvas, series.seriesElement, this.element, chart.redraw);
        }
        if (!series.chart.enableCanvas) {
            pathAnimation(this.element, (series.columnFacet === 'Cylinder') ? '' : direction, chart.redraw, previousDirection, chart.duration);
        }
    }
    /**
     * To animate the series.
     *
     * @param {Series} series - The series to be animated.
     * @returns {void}
     * @private
     */
    public animate(series: Series): void {
        const rectElements: NodeList = series.seriesElement.childNodes;
        let count: number = series.category === 'Indicator' ? 0 : 1;
        const visiblePoints: Points[] = getVisiblePoints(series);
        for (const point of visiblePoints) {
            if (!point.symbolLocations.length && !(series.type === 'BoxAndWhisker' && point.regions.length)) {
                continue;
            }
            if ((series.type === 'Column' || series.type === 'Bar' || series.type === 'StackingColumn' || series.type === 'StackingColumn100' || series.type === 'StackingBar' || series.type === 'StackingBar100') && series.columnFacet === 'Cylinder') {
                for (let j: number = 0; j < rectElements.length; j++) {
                    this.animateRect(<HTMLElement>rectElements[j as number], series, point);
                }
            }
            else {
                this.animateRect(<HTMLElement>rectElements[count as number], series, point);
                count++;
            }
        }
    }
    /**
     * Animates the rect element.
     *
     * @param {HTMLElement} element - The rect element to be animated.
     * @param {Series} series - The series associated with the rect.
     * @param {Points} point - The data point associated with the rect.
     * @returns {void}
     */
    private animateRect(element: HTMLElement, series: Series, point: Points): void {
        const option: AnimationModel = series.animation;
        const duration: number = series.chart.animated ? series.chart.duration : option.duration;
        const effect: Function = getAnimationFunction('Linear');
        const isPlot: boolean = point.yValue < 0;
        let x: number;
        let y: number;
        let elementHeight: number = +point.regions[0].height;
        let elementWidth: number = +point.regions[0].width;
        let centerX: number;
        let centerY: number;
        if (!series.chart.requireInvertedAxis) {
            x = +point.regions[0].x;
            if (series.type.indexOf('Stacking') > -1) {
                y = (1 - valueToCoefficient(0, series.yAxis)) * (series.yAxis.rect.height);
                centerX = x;
                centerY = y;
            } else {
                y = +point.regions[0].y;
                centerY = (series.seriesType.indexOf('HighLow') !== -1 || series.type.indexOf('Waterfall') !== -1) ? y + elementHeight / 2 :
                    (isPlot !== series.yAxis.isAxisInverse) ? y : y + elementHeight;
                centerX = isPlot ? x : x + elementWidth;
            }
        } else {
            y = +point.regions[0].y;
            if (series.type.indexOf('Stacking') > -1) {
                x = (valueToCoefficient(0, series.yAxis)) * series.yAxis.rect.width;
                centerX = x;
                centerY = y;
            } else {
                x = +point.regions[0].x;
                centerY = isPlot ? y : y + elementHeight;
                centerX = (series.seriesType.indexOf('HighLow') !== -1 || series.type.indexOf('Waterfall') !== -1) ? x + elementWidth / 2 :
                    (isPlot !== series.yAxis.isAxisInverse) ? x + elementWidth : x;
            }
        }

        let value: number;
        if (!isNullOrUndefined(element)) {
            element.style.visibility = 'hidden';
            new Animation({}).animate(element, {
                duration: (duration === 0 && animationMode === 'Enable') ? 1000 : duration,
                delay: option.delay,
                progress: (args: AnimationOptions): void => {
                    if (args.timeStamp >= args.delay) {
                        element.style.visibility = 'visible';
                        if (!series.chart.requireInvertedAxis) {
                            elementHeight = elementHeight ? elementHeight : 1;
                            value = effect(args.timeStamp - args.delay, 0, elementHeight, args.duration);
                            element.setAttribute('transform', 'translate(' + centerX + ' ' + centerY +
                                ') scale(1,' + (value / elementHeight) + ') translate(' + (-centerX) + ' ' + (-centerY) + ')');
                        } else {
                            elementWidth = elementWidth ? elementWidth : 1;
                            value = effect(args.timeStamp - args.delay, 0, elementWidth, args.duration);
                            element.setAttribute('transform', 'translate(' + centerX + ' ' + centerY +
                                ') scale(' + (value / elementWidth) + ', 1) translate(' + (-centerX) + ' ' + (-centerY) + ')');
                        }
                    }
                },
                end: () => {
                    const annotations: HTMLElement = <HTMLElement>document.getElementById(series.chart.element.id + '_Annotation_Collections');
                    if (annotations) {
                        annotations.style.visibility = 'visible';
                    }
                    if (series.lastValueLabelElement) {
                        series.lastValueLabelElement.setAttribute('visibility', 'visible');
                    }
                    const stackLabelGroup: HTMLElement = <HTMLElement>document.getElementById(series.chart.element.id + '_StackLabelGroup');
                    if (stackLabelGroup) {
                        markerAnimate(stackLabelGroup, 0, duration, series, null, null, false);
                        stackLabelGroup.setAttribute('visibility', 'visible');
                    }
                    element.setAttribute('transform', 'translate(0,0)');
                    const seriesElement: Element = series.seriesElement;
                    if (element === seriesElement.lastElementChild || point.index === series.points.length - 1 ||
                        (series.type === 'Waterfall' && element === seriesElement.children[seriesElement.childElementCount - 2])) {
                        series.chart.trigger('animationComplete', { series: series });
                        if (series.type === 'Waterfall') {
                            const rectElements: NodeList = seriesElement.childNodes;
                            for (let i: number = 0; i < rectElements.length; i++) {
                                if ((rectElements[i as number] as HTMLElement).id.indexOf('Connector') !== -1) {
                                    (rectElements[i as number] as HTMLElement).style.visibility = 'visible';
                                    (rectElements[i as number] as HTMLElement).setAttribute('transform', 'translate(0,0)');
                                }
                            }
                        }
                    }
                }
            });
        }
    }
    /**
     * Calculates the path for a rounded rectangle.
     *
     * @param {Rect} rect - The bounding rectangle.
     * @param {number} topLeft - The radius of the top-left corner.
     * @param {number} topRight - The radius of the top-right corner.
     * @param {number} bottomLeft - The radius of the bottom-left corner.
     * @param {number} bottomRight - The radius of the bottom-right corner.
     * @param {boolean} inverted - Indicates whether the rectangle is inverted.
     * @returns {string} The SVG path string representing the rounded rectangle.
     */
    private calculateRoundedRectPath(
        rect: Rect, topLeft: number, topRight: number,
        bottomLeft: number, bottomRight: number, inverted: boolean = false
    ): string {
        const halfWidth: number = rect.width / 2;
        const halfHeight: number = rect.height / 2;
        topLeft = Math.min(topLeft, halfWidth, halfHeight);
        topRight = Math.min(topRight, halfWidth, halfHeight);
        bottomLeft = Math.min(bottomLeft, halfWidth, halfHeight);
        bottomRight = Math.min(bottomRight, halfWidth, halfHeight);
        return 'M' + ' ' + rect.x + ' ' + (topLeft + rect.y) +
            ' Q ' + rect.x + ' ' + rect.y + ' ' + (rect.x + topLeft) + ' ' +
            rect.y + ' ' + 'L' + ' ' + (rect.x + rect.width - topRight) + ' ' + rect.y +
            ' Q ' + (rect.x + rect.width) + ' ' + rect.y + ' ' +
            (rect.x + rect.width) + ' ' + (rect.y + topRight) + ' ' + 'L ' +
            (rect.x + rect.width) + ' ' + (rect.y + rect.height - bottomRight)
            + ' Q ' + (rect.x + rect.width) + ' ' + (rect.y + rect.height) + ' ' + (rect.x + rect.width - bottomRight) + ' ' +
            (rect.y + rect.height) + ' ' + 'L ' + (rect.x + bottomLeft) + ' ' + (rect.y + rect.height) + ' Q ' + rect.x + ' ' +
            (rect.y + rect.height) + ' ' + rect.x + ' ' + (rect.y + rect.height - bottomLeft) + ' ' + 'L' + ' ' + rect.x + ' ' +
            (topLeft + rect.y) + ' ' + 'Z';
    }

}
export interface RectPosition {
    position: number;
    rectCount: number;
}

export interface OptionGradient {
    id: string;
    x1: string;
    y1: string;
    x2: string;
    y2: string;
}

export interface GradientStop {
    colorStop: string;
    color: string;
}
