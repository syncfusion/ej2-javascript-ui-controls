import { Animation, AnimationOptions, compile as templateComplier, Browser } from '@syncfusion/ej2-base';
import { merge, Effect, extend, isNullOrUndefined, resetBlazorTemplate } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { Index } from '../../common/model/base';
import { PathAttributes, RectAttributes, CircleAttributes, SVGCanvasAttributes, BaseAttibutes } from '@syncfusion/ej2-svg-base';
import { FontModel, BorderModel, MarginModel } from '../model/base-model';
import { VisibleRangeModel, VisibleLabels } from '../../chart/axis/axis';
import { Series, Points } from '../../chart/series/chart-series';
import { Axis } from '../../chart/axis/axis';
import { Chart } from '../../chart/chart';
import { AccumulationChart } from '../../accumulation-chart/accumulation';
import { RangeNavigator } from '../../range-navigator/range-navigator';
import { AccumulationSeries, AccPoints } from '../../accumulation-chart/model/acc-base';
import { IShapes } from '../model/interface';
import { IAxisLabelRenderEventArgs } from '../../chart/model/chart-interface';
import { axisLabelRender, regSub } from '../model/constants';
import { StockChart } from '../../stock-chart/stock-chart';
import { measureText, findDirection, Rect, TextOption, Size, PathOption, SvgRenderer, CanvasRenderer } from '@syncfusion/ej2-svg-base';
import { BulletChart } from '../../bullet-chart/bullet-chart';

/**
 * Function to sort the dataSource, by default it sort the data in ascending order.
 * @param  {Object} data
 * @param  {string} fields
 * @param  {boolean} isDescending
 * @returns Object
 */
export function sort(data: Object[], fields: string[], isDescending?: boolean): Object[] {
    let sortData: Object[] = <Object[]>extend([], data, null);
    sortData.sort((a: Object, b: Object) => {
        let first: number = 0;
        let second: number = 0;
        for (let i: number = 0; i < fields.length; i++) {
            first += a[fields[i]];
            second += b[fields[i]];
        }
        if ((!isDescending && first < second) || (isDescending && first > second)) {
            return -1;
        } else if (first === second) {
            return 0;
        }
        return 1;
    });
    return sortData;
}

/** @private */
export function isBreakLabel(label: string): boolean {
    return label.indexOf('<br>') !== -1;
}

export function getVisiblePoints(series: Series): Points[] {
    let points: Points[] = extend([], series.points, null, true) as Points[];
    let tempPoints: Points[] = [];
    let tempPoint: Points;
    let pointIndex: number = 0;
    for (let i: number = 0; i < points.length; i++) {
        tempPoint = points[i];
        if (isNullOrUndefined(tempPoint.x) || tempPoint.x === '') {
            continue;
        } else {
            tempPoint.index = pointIndex++;
            tempPoints.push(tempPoint);
        }
    }
    return tempPoints;
}

/** @private */
export function rotateTextSize(font: FontModel, text: string, angle: number, chart: Chart): Size {

    let renderer: SvgRenderer = new SvgRenderer(chart.element.id);
    let box: ClientRect;
    let options: Object;
    let htmlObject: HTMLElement;
    options = {
        'font-size': font.size,
        'font-style': font.fontStyle,
        'font-family': font.fontFamily,
        'font-weight': font.fontWeight,
        'transform': 'rotate(' + angle + ', 0, 0)',
        'text-anchor': 'middle'
    };
    htmlObject = renderer.createText(options, text) as HTMLElement;
    if (!chart.delayRedraw && !chart.redraw) {
        chart.element.appendChild(chart.svgObject);
    }
    chart.svgObject.appendChild(htmlObject);
    box = htmlObject.getBoundingClientRect();
    remove(htmlObject);
    if (!chart.delayRedraw && !chart.redraw) {
        remove(chart.svgObject);
    }
    return new Size((box.right - box.left), (box.bottom - box.top));
}
/** @private */
export function removeElement(id: string | Element): void {
    if (!id) {
        return null;
    }
    let element: Element = typeof id === 'string' ? getElement(id) : id;
    if (element) {
        remove(element);
    }
}
/** @private */
export function logBase(value: number, base: number): number {
    return Math.log(value) / Math.log(base);
}
/** @private */
export function showTooltip(
    text: string, x: number, y: number, areaWidth: number, id: string, element: Element,
    isTouch?: boolean
): void {
    //let id1: string = 'EJ2_legend_tooltip';
    let tooltip: HTMLElement = document.getElementById(id);
    let width: number = measureText(text, {
        fontFamily: 'Segoe UI', size: '12px',
        fontStyle: 'Normal', fontWeight: 'Regular'
    }).width + 5;
    x = (x + width > areaWidth) ? x - (width + 15) : x;
    if (!tooltip) {
        tooltip = createElement('div', {
            innerHTML: text,
            id: id,
            styles: 'top:' + (y + 15).toString() + 'px;left:' + (x + 15).toString() +
                'px;background-color: rgb(255, 255, 255) !important; color:black !important; ' +
                'position:absolute;border:1px solid rgb(112, 112, 112); padding-left : 3px; padding-right : 2px;' +
                'padding-bottom : 2px; padding-top : 2px; font-size:12px; font-family: "Segoe UI"'
        });
        element.appendChild(tooltip);
        let left: number = parseInt(tooltip.style.left.replace('px', ''), 10);
        if (left < 0) {
            tooltip.style.left = '0px';
        }
    } else {
        tooltip.innerHTML = text;
        tooltip.style.top = (y + 15).toString() + 'px';
        tooltip.style.left = (x + 15).toString() + 'px';
    }
    if (isTouch) {
        setTimeout(() => { removeElement(id); }, 1500);
    }
}

/** @private */
export function inside(value: number, range: VisibleRangeModel): boolean {
    return (value < range.max) && (value > range.min);
}
/** @private */
export function withIn(value: number, range: VisibleRangeModel): boolean {
    return (value <= range.max) && (value >= range.min);
}
/** @private */
export function logWithIn(value: number, axis: Axis): number {
    if (axis.valueType === 'Logarithmic') {
        value = logBase(value, axis.logBase);
    } else {
        value = value;
    }
    return value;
}
/** @private */
export function withInRange(previousPoint: Points, currentPoint: Points, nextPoint: Points, series: Series): boolean {
    let mX2: number = logWithIn(currentPoint.xValue, series.xAxis);
    let mX1: number = previousPoint ? logWithIn(previousPoint.xValue, series.xAxis) : mX2;
    let mX3: number = nextPoint ? logWithIn(nextPoint.xValue, series.xAxis) : mX2;
    let xStart: number = Math.floor(<number>series.xAxis.visibleRange.min);
    let xEnd: number = Math.ceil(<number>series.xAxis.visibleRange.max);
    return ((mX1 >= xStart && mX1 <= xEnd) || (mX2 >= xStart && mX2 <= xEnd) ||
        (mX3 >= xStart && mX3 <= xEnd) || (xStart >= mX1 && xStart <= mX3));
}
/** @private */
export function sum(values: number[]): number {
    let sum: number = 0;
    for (let value of values) {
        sum += value;
    }
    return sum;
}
/** @private */
export function subArraySum(values: Object[], first: number, last: number, index: number[], series: Series): number {
    let sum: number = 0;
    if (index !== null) {
        for (let i: number = (first + 1); i < last; i++) {
            if (index.indexOf(i) === -1) {
                sum += values[i][series.yName] as number;
            }
        }
    } else {

        for (let i: number = (first + 1); i < last; i++) {
            if (!isNullOrUndefined(values[i][series.yName])) {
                sum += values[i][series.yName] as number;
            }
        }
    }
    return sum;
}
/** @private */
export function subtractThickness(rect: Rect, thickness: Thickness): Rect {
    rect.x += thickness.left;
    rect.y += thickness.top;
    rect.width -= thickness.left + thickness.right;
    rect.height -= thickness.top + thickness.bottom;
    return rect;
}
/** @private */
export function subtractRect(rect: Rect, thickness: Rect): Rect {
    rect.x += thickness.x;
    rect.y += thickness.y;
    rect.width -= thickness.x + thickness.width;
    rect.height -= thickness.y + thickness.height;
    return rect;
}
/** @private */
export function degreeToLocation(degree: number, radius: number, center: ChartLocation): ChartLocation {
    let radian: number = (degree * Math.PI) / 180;
    return new ChartLocation(Math.cos(radian) * radius + center.x, Math.sin(radian) * radius + center.y);
}
/** @private */
export function degreeToRadian(degree: number): number {
    return degree * (Math.PI / 180);
}

/** @private */
export function getRotatedRectangleCoordinates(
    actualPoints: ChartLocation[], centerX: number, centerY: number, angle: number
): ChartLocation[] {
    let coordinatesAfterRotation: ChartLocation[] = [];
    for (let i: number = 0; i < 4; i++) {
        let point: ChartLocation = actualPoints[i];
        // translate point to origin
        let tempX: number = point.x - centerX;
        let tempY: number = point.y - centerY;
        // now apply rotation
        let rotatedX: number = tempX * Math.cos(degreeToRadian(angle)) - tempY * Math.sin(degreeToRadian(angle));
        let rotatedY: number = tempX * Math.sin(degreeToRadian(angle)) + tempY * Math.cos(degreeToRadian(angle));
        // translate back
        point.x = rotatedX + centerX;
        point.y = rotatedY + centerY;
        coordinatesAfterRotation.push(new ChartLocation(point.x, point.y));
    }
    return coordinatesAfterRotation;
}

/**
 * Helper function to determine whether there is an intersection between the two polygons described
 * by the lists of vertices. Uses the Separating Axis Theorem
 *
 * @param a an array of connected points [{x:, y:}, {x:, y:},...] that form a closed polygon
 * @param b an array of connected points [{x:, y:}, {x:, y:},...] that form a closed polygon
 * @return true if there is any intersection between the 2 polygons, false otherwise
 */
export function isRotatedRectIntersect(a: ChartLocation[], b: ChartLocation[]): boolean {
    let polygons: ChartLocation[][] = [a, b];
    let minA: number; let maxA: number; let projected: number; let i: number;
    let i1: number; let j: number; let minB: number; let maxB: number;

    for (i = 0; i < polygons.length; i++) {

        // for each polygon, look at each edge of the polygon, and determine if it separates
        // the two shapes
        let polygon: ChartLocation[] = polygons[i];
        for (i1 = 0; i1 < polygon.length; i1++) {

            // grab 2 vertices to create an edge
            let i2: number = (i1 + 1) % polygon.length;
            let p1: ChartLocation = polygon[i1];
            let p2: ChartLocation = polygon[i2];

            // find the line perpendicular to this edge
            let normal: ChartLocation = new ChartLocation(p2.y - p1.y, p1.x - p2.x);

            minA = maxA = undefined;
            // for each vertex in the first shape, project it onto the line perpendicular to the edge
            // and keep track of the min and max of these values
            for (j = 0; j < a.length; j++) {
                projected = normal.x * a[j].x + normal.y * a[j].y;
                if (isNullOrUndefined(minA) || projected < minA) {
                    minA = projected;
                }
                if (isNullOrUndefined(maxA) || projected > maxA) {
                    maxA = projected;
                }
            }

            // for each vertex in the second shape, project it onto the line perpendicular to the edge
            // and keep track of the min and max of these values
            minB = maxB = undefined;
            for (j = 0; j < b.length; j++) {
                projected = normal.x * b[j].x + normal.y * b[j].y;
                if (isNullOrUndefined(minB) || projected < minB) {
                    minB = projected;
                }
                if (isNullOrUndefined(maxB) || projected > maxB) {
                    maxB = projected;
                }
            }
            // if there is no overlap between the projects, the edge we are looking at separates the two
            // polygons, and we know there is no overlap
            if (maxA < minB || maxB < minA) {
                return false;
            }
        }
    }
    return true;
}
function getAccumulationLegend(locX: number, locY: number, r: number, height: number, width: number, mode: string): string {
    let cartesianlarge: ChartLocation = degreeToLocation(270, r, new ChartLocation(locX, locY));
    let cartesiansmall: ChartLocation = degreeToLocation(270, r, new ChartLocation(locX + (width / 10), locY));
    return 'M' + ' ' + locX + ' ' + locY + ' ' + 'L' + ' ' + (locX + r) + ' ' + (locY) + ' ' + 'A' + ' ' + (r) + ' ' + (r) +
        ' ' + 0 + ' ' + 1 + ' ' + 1 + ' ' + cartesianlarge.x + ' ' + cartesianlarge.y + ' ' + 'Z' + ' ' + 'M' + ' ' + (locX +
            (width / 10)) + ' ' + (locY - (height / 10)) + ' ' + 'L' + (locX + (r)) + ' ' + (locY - height / 10) + ' ' + 'A' + ' '
        + (r) + ' ' + (r) + ' ' + 0 + ' ' + 0 + ' ' + 0 + ' ' + cartesiansmall.x + ' ' + cartesiansmall.y + ' ' + 'Z';
}
/** @private */
export function getAngle(center: ChartLocation, point: ChartLocation): number {
    let angle: number = Math.atan2((point.y - center.y), (point.x - center.x));
    angle = angle < 0 ? (6.283 + angle) : angle;
    return angle * (180 / Math.PI);
}
/** @private */
export function subArray(values: number[], index: number): number[] {
    let subArray: number[] = [];
    for (let i: number = 0; i <= index - 1; i++) {
        subArray.push(values[i]);
    }
    return subArray;
}
/** @private */
export function valueToCoefficient(value: number, axis: Axis): number {
    let range: VisibleRangeModel = axis.visibleRange;
    let result: number = (value - <number>range.min) / (range.delta);
    return axis.isInversed ? (1 - result) : result;

}
/** @private */
export function TransformToVisible(x: number, y: number, xAxis: Axis, yAxis: Axis, isInverted?: boolean, series?: Series): ChartLocation {
    x = (xAxis.valueType === 'Logarithmic' ? logBase(x > 1 ? x : 1, xAxis.logBase) : x);
    y = (yAxis.valueType === 'Logarithmic' ?
        logBase(y > 1 ? y : 1, yAxis.logBase) : y);
    x += xAxis.valueType === 'Category' && xAxis.labelPlacement === 'BetweenTicks' && series.type !== 'Radar' ? 0.5 : 0;
    let radius: number = series.chart.radius * valueToCoefficient(y, yAxis);
    let point: ChartLocation = CoefficientToVector(valueToPolarCoefficient(x, xAxis), series.chart.primaryXAxis.startAngle);
    return {
        x: (series.clipRect.width / 2 + series.clipRect.x) + radius * point.x,
        y: (series.clipRect.height / 2 + series.clipRect.y) + radius * point.y
    };

}
/**
 * method to find series, point index by element id
 * @private
 */
export function indexFinder(id: string, isPoint: boolean = false): Index {
    let ids: string[] = ['NaN', 'NaN'];
    if (id.indexOf('_Point_') > -1) {
        ids = id.split('_Series_')[1].split('_Point_');
    } else if (id.indexOf('_shape_') > -1 && (!isPoint || (isPoint && id.indexOf('_legend_') === -1))) {
        ids = id.split('_shape_');
        ids[0] = '0';
    } else if (id.indexOf('_text_') > -1 && (!isPoint || (isPoint && id.indexOf('_legend_') === -1))) {
        ids = id.split('_text_');
        ids[0] = '0';
    }
    return new Index(parseInt(ids[0], 10), parseInt(ids[1], 10));
}

/** @private */
export function CoefficientToVector(coefficient: number, startAngle: number): ChartLocation {
    startAngle = startAngle < 0 ? startAngle + 360 : startAngle;
    let angle: number = Math.PI * (1.5 - 2 * coefficient);
    angle = angle + (startAngle * Math.PI) / 180;
    return { x: Math.cos(angle), y: Math.sin(angle) };
}

/** @private */
export function valueToPolarCoefficient(value: number, axis: Axis): number {
    let range: VisibleRangeModel = axis.visibleRange;
    let delta: number;
    let length: number;
    if (axis.valueType !== 'Category') {
        delta = (range.max - (axis.valueType === 'DateTime' ? axis.dateTimeInterval : range.interval)) - range.min;
        length = axis.visibleLabels.length - 1;
        delta = delta === 0 ? 1 : delta;
    } else {
        // To split an interval equally based on visible labels count
        delta = axis.visibleLabels.length === 1 ? 1 :
            (axis.visibleLabels[axis.visibleLabels.length - 1].value - axis.visibleLabels[0].value);
        length = axis.visibleLabels.length;
    }
    return axis.isInversed ? ((value - <number>range.min) / delta) * (1 - 1 / (length)) :
        1 - ((value - <number>range.min) / delta) * (1 - 1 / (length));
}
/** @private */
export class Mean {

    public verticalStandardMean: number;
    public horizontalStandardMean: number;
    public verticalSquareRoot: number;
    public horizontalSquareRoot: number;
    public verticalMean: number;
    public horizontalMean: number;

    constructor(
        verticalStandardMean: number, verticalSquareRoot: number, horizontalStandardMean: number,
        horizontalSquareRoot: number, verticalMean: number, horizontalMean: number
    ) {
        this.verticalStandardMean = verticalStandardMean;
        this.horizontalStandardMean = horizontalStandardMean;
        this.verticalSquareRoot = verticalSquareRoot;
        this.horizontalSquareRoot = horizontalSquareRoot;
        this.verticalMean = verticalMean;
        this.horizontalMean = horizontalMean;
    }
}

/** @private */
export class PolarArc {
    public startAngle: number;
    public endAngle: number;
    public innerRadius: number;
    public radius: number;
    public currentXPosition: number;

    constructor(startAngle?: number, endAngle?: number, innerRadius?: number, radius?: number, currentXPosition?: number) {
        this.startAngle = startAngle;
        this.endAngle = endAngle;
        this.innerRadius = innerRadius;
        this.radius = radius;
        this.currentXPosition = currentXPosition;
    }
}
/** @private */
export function createTooltip(id: string, text: string, top: number, left: number, fontSize: string): void {
    let tooltip: HTMLElement = getElement(id) as HTMLElement;
    let style: string = 'top:' + top.toString() + 'px;' +
        'left:' + left.toString() + 'px;' +
        'color:black !important; ' +
        'background:#FFFFFF !important; ' +
        'position:absolute;border:1px solid #707070;font-size:' + fontSize + ';border-radius:2px; z-index:1';
    if (!tooltip) {
        tooltip = createElement('div', {
            id: id, innerHTML: '&nbsp;' + text + '&nbsp;', styles: style
        });
        document.body.appendChild(tooltip);
    } else {
        tooltip.setAttribute('innerHTML', '&nbsp;' + text + '&nbsp;');
        tooltip.setAttribute('styles', style);
    }
}
/** @private */
export function createZoomingLabels(chart: Chart, axis: Axis, parent: Element, index: number, isVertical: boolean, rect: Rect): Element {
    let margin: number = 5;
    let opposedPosition: boolean = axis.opposedPosition;
    let anchor: string = isVertical ? 'start' : 'auto';
    let size: Size;
    let chartRect: number = chart.availableSize.width;
    let x: number;
    let y: number;
    let rx: number = 3;
    let arrowLocation: ChartLocation;
    let direction: string;
    let scrollBarHeight: number = axis.scrollbarSettings.enable || (axis.zoomingScrollBar && axis.zoomingScrollBar.svgObject)
        ? axis.scrollBarHeight : 0;
    for (let i: number = 0; i < 2; i++) {
        size = measureText(i ? axis.endLabel : axis.startLabel, axis.labelStyle);
        if (isVertical) {
            arrowLocation = i ? new ChartLocation(rect.x - scrollBarHeight, rect.y + rx) :
                new ChartLocation(axis.rect.x - scrollBarHeight, (rect.y + rect.height - rx));
            x = (rect.x + (opposedPosition ? (rect.width + margin + scrollBarHeight) : -(size.width + margin + margin + scrollBarHeight)));
            y = (rect.y + (i ? 0 : rect.height - size.height - margin));
            x += (x < 0 || ((chartRect) < (x + size.width + margin))) ? (opposedPosition ? -(size.width / 2) : size.width / 2) : 0;
            direction = findDirection(
                rx, rx, new Rect(x, y, size.width + margin, size.height + margin),
                arrowLocation, margin, false, false, !opposedPosition, arrowLocation.x, arrowLocation.y + (i ? -rx : rx));
        } else {
            arrowLocation = i ? new ChartLocation((rect.x + rect.width - rx), (rect.y + rect.height + scrollBarHeight)) :
                new ChartLocation(rect.x + rx, (rect.y + rect.height + scrollBarHeight));
            x = (rect.x + (i ? (rect.width - size.width - margin) : 0));
            y = (opposedPosition ? (rect.y - size.height - 10 - scrollBarHeight) : (rect.y + rect.height + margin + scrollBarHeight));
            direction = findDirection(
                rx, rx, new Rect(x, y, size.width + margin, size.height + margin),
                arrowLocation, margin, opposedPosition, !opposedPosition, false, arrowLocation.x + (i ? rx : -rx), arrowLocation.y);
        }
        x = x + (margin / 2);
        y = y + (3 * (size.height / 4)) + (margin / 2);
        parent.appendChild(chart.renderer.drawPath(
            new PathOption(
                chart.element.id + '_Zoom_' + index + '_AxisLabel_Shape_' + i,
                chart.themeStyle.crosshairFill, 2, chart.themeStyle.crosshairFill, 1, null, direction
            )
        ) as HTMLElement);
        textElement(
            chart.renderer,
            new TextOption(
                chart.element.id + '_Zoom_' + index + '_AxisLabel_' + i, x, y, anchor, i ? axis.endLabel : axis.startLabel),
            { color: chart.themeStyle.crosshairLabel, fontFamily: 'Segoe UI', fontWeight: 'Regular', size: '11px' },
            chart.themeStyle.crosshairLabel, parent
        );
    }

    return parent;
}
//Within bounds
/** @private */
export function withInBounds(x: number, y: number, bounds: Rect, width: number = 0, height: number = 0): boolean {
    return (x >= bounds.x - width && x <= bounds.x + bounds.width + width && y >= bounds.y - height
        && y <= bounds.y + bounds.height + height);
}
/** @private */
export function getValueXByPoint(value: number, size: number, axis: Axis): number {
    let actualValue: number = !axis.isInversed ? value / size : (1 - (value / size));
    return actualValue * (axis.visibleRange.delta) + axis.visibleRange.min;
}
/** @private */
export function getValueYByPoint(value: number, size: number, axis: Axis): number {
    let actualValue: number = axis.isInversed ? value / size : (1 - (value / size));
    return actualValue * (axis.visibleRange.delta) + axis.visibleRange.min;
}
/** @private */
export function findClipRect(series: Series): void {
    let rect: Rect = series.clipRect;
    if (series.chart.requireInvertedAxis) {
        rect.x = series.yAxis.rect.x;
        rect.y = series.xAxis.rect.y;
        rect.width = series.yAxis.rect.width;
        rect.height = series.xAxis.rect.height;
    } else {
        rect.x = series.xAxis.rect.x;
        rect.y = series.yAxis.rect.y;
        rect.width = series.xAxis.rect.width;
        rect.height = series.yAxis.rect.height;
    }
}
/** @private */
export function firstToLowerCase(str: string): string {
    return str.substr(0, 1).toLowerCase() + str.substr(1);
}
/** @private */
export function getTransform(xAxis: Axis, yAxis: Axis, invertedAxis: boolean): Rect {
    let x: number; let y: number; let width: number; let height: number;
    if (invertedAxis) {
        x = yAxis.rect.x;
        y = xAxis.rect.y;
        width = yAxis.rect.width;
        height = xAxis.rect.height;
    } else {
        x = xAxis.rect.x;
        y = yAxis.rect.y;
        width = xAxis.rect.width;
        height = yAxis.rect.height;
    }
    return new Rect(x, y, width, height);
}
/** @private */
export function getMinPointsDelta(axis: Axis, seriesCollection: Series[]): number {
    let minDelta: number = Number.MAX_VALUE;
    let xValues: Object[];
    let minVal: number;
    let seriesMin: number;
    for (let index: number = 0; index < seriesCollection.length; index++) {
        let series: Series = seriesCollection[index];
        xValues = [];
        if (series.visible &&
            (axis.name === series.xAxisName || (axis.name === 'primaryXAxis' && series.xAxisName === null)
                || (axis.name === series.chart.primaryXAxis.name && !series.xAxisName))) {
            xValues = series.points.map((point: Points, index: number) => {
                return point.xValue;
            });
            xValues.sort((first: Object, second: Object) => { return <number>first - <number>second; });
            if (xValues.length === 1) {
                seriesMin = (axis.valueType === 'DateTime' && series.xMin === series.xMax) ? (series.xMin - 2592000000) : series.xMin;
                minVal = <number>xValues[0] - (!isNullOrUndefined(seriesMin) ?
                    seriesMin : axis.visibleRange.min);
                if (minVal !== 0) {
                    minDelta = Math.min(minDelta, minVal);
                }
            } else {
                for (let index: number = 0; index < xValues.length; index++) {
                    let value: Object = xValues[index];
                    if (index > 0 && value) {
                        minVal = <number>value - <number>xValues[index - 1];
                        if (minVal !== 0) {
                            minDelta = Math.min(minDelta, minVal);
                        }
                    }
                }
            }
        }
    }
    if (minDelta === Number.MAX_VALUE) {
        minDelta = 1;
    }

    return minDelta;
}
/** @private */
export function getAnimationFunction(effect: string): Function {
    let functionName: Function;
    switch (effect) {
        case 'Linear':
            functionName = linear;
            break;
    }
    return functionName;
}

/**
 * Animation Effect Calculation Started Here
 * @param currentTime
 * @param startValue
 * @param endValue
 * @param duration
 * @private
 */


export function linear(currentTime: number, startValue: number, endValue: number, duration: number): number {
    return -endValue * Math.cos(currentTime / duration * (Math.PI / 2)) + endValue + startValue;
}

/**
 * Animation Effect Calculation End
 * @private
 */

export function markerAnimate(
    element: Element, delay: number, duration: number, series: Series | AccumulationSeries,
    pointIndex: number, point: ChartLocation, isLabel: boolean
): void {

    let centerX: number = point.x;
    let centerY: number = point.y;
    let height: number = 0;
    (<HTMLElement>element).style.visibility = 'hidden';
    new Animation({}).animate(<HTMLElement>element, {
        duration: duration,
        delay: delay,
        progress: (args: AnimationOptions): void => {
            if (args.timeStamp > args.delay) {
                args.element.style.visibility = 'visible';
                height = ((args.timeStamp - args.delay) / args.duration);
                element.setAttribute('transform', 'translate(' + centerX
                    + ' ' + centerY + ') scale(' + height + ') translate(' + (-centerX) + ' ' + (-centerY) + ')');
            }
        },
        end: (model: AnimationOptions) => {
            (<HTMLElement>element).style.visibility = '';
            if ((series.type === 'Scatter' || series.type === 'Bubble') && !isLabel && (pointIndex === series.points.length - 1)) {
                series.chart.trigger('animationComplete', { series: series.chart.isBlazor ? {} : series });
            }

        }
    });
}

/**
 * Animate the rect element
 */
export function animateRectElement(
    element: Element, delay: number, duration: number, currentRect: Rect, previousRect: Rect
): void {
    let setStyle: Function = (rect: Rect): void => {
        element.setAttribute('x', rect.x + '');
        element.setAttribute('y', rect.y + '');
        element.setAttribute('width', rect.width + '');
        element.setAttribute('height', rect.height + '');
    };
    new Animation({}).animate(createElement('div'), {
        duration: duration,
        delay: delay,
        name: name,
        progress: (args: AnimationOptions): void => {
            setStyle(
                new Rect(
                    linear(args.timeStamp, previousRect.x, currentRect.x - previousRect.x, args.duration),
                    linear(args.timeStamp, previousRect.y, currentRect.y - previousRect.y, args.duration),
                    linear(args.timeStamp, previousRect.width, currentRect.width - previousRect.width, args.duration),
                    linear(args.timeStamp, previousRect.height, currentRect.height - previousRect.height, args.duration)
                )
            );
        },
        end: (): void => {
            setStyle(currentRect);
        },
    });
}

/**
 * Animation after legend click a path
 * @param element element to be animated
 * @param direction current direction of the path
 * @param previousDirection previous direction of the path
 */
export function pathAnimation(
    element: Element, direction: string, redraw: boolean, previousDirection?: string, animateDuration?: number
): void {
    if (!redraw || (!previousDirection && !element)) {
        return null;
    }
    let duration: number = 300;
    if (animateDuration) {
        duration = animateDuration;
    }
    let startDirections: string = previousDirection || element.getAttribute('d');
    let splitDirections: string[] = startDirections.split(/(?=[LMCZAQ])/);
    let endDirections: string[] = direction.split(/(?=[LMCZAQ])/);
    let currentDireciton: string;
    let startPath: string[] = [];
    let endPath: string[] = [];
    let c: number;
    let end: number;
    element.setAttribute('d', startDirections);
    new Animation({}).animate(createElement('div'), {
        duration: duration,
        progress: (args: AnimationOptions): void => {
            currentDireciton = '';
            splitDirections.map((directions: string, index: number) => {
                startPath = directions.split(' ');
                endPath = endDirections[index] ? endDirections[index].split(' ') : startPath;
                if (startPath[0] === 'Z') {
                    currentDireciton += 'Z' + ' ';
                } else {
                    currentDireciton += startPath[0] + ' ' +
                        linear(args.timeStamp, +startPath[1], (+endPath[1] - +startPath[1]), args.duration) + ' ' +
                        linear(args.timeStamp, +startPath[2], (+endPath[2] - +startPath[2]), args.duration) + ' ';
                }
                if (startPath[0] === 'C' || startPath[0] === 'Q') {
                    c = 3;
                    end = startPath[0] === 'Q' ? 4 : 6;
                    while (c < end) {
                        currentDireciton += linear(args.timeStamp, +startPath[c], (+endPath[c] - +startPath[c]), args.duration) + ' ' +
                            linear(args.timeStamp, +startPath[++c], (+endPath[c] - +startPath[c]), args.duration) + ' ';
                        ++c;
                    }
                }
                if (startPath[0] === 'A') {
                    currentDireciton += 0 + ' ' + 0 + ' ' + 1 + ' ' +
                        linear(args.timeStamp, +startPath[6], (+endPath[6] - +startPath[6]), args.duration) + ' ' +
                        linear(args.timeStamp, +startPath[7], (+endPath[7] - +startPath[7]), args.duration) + ' ';
                }
            });
            element.setAttribute('d', currentDireciton);
        },
        end: () => {
            element.setAttribute('d', direction);
        }
    });
}
/**
 * To append the clip rect element
 * @param redraw
 * @param options
 * @param renderer
 * @param clipPath
 */
export function appendClipElement(
    redraw: boolean, options: BaseAttibutes, renderer: SvgRenderer,
    clipPath: string = 'drawClipPath'
): Element {
    let clipElement: Element = redrawElement(
        redraw, options.id, options, renderer
    );
    if (clipElement) {
        let def: Element = renderer.createDefs();
        def.appendChild(clipElement);
        return def;
    } else {
        return renderer[clipPath](options);
    }
}

/**
 * Triggers the event.
 * @return {void}
 * @private
 */
export function triggerLabelRender(
    chart: Chart | RangeNavigator, tempInterval: number, text: string, labelStyle: FontModel,
    axis: Axis
): void {
    let argsData: IAxisLabelRenderEventArgs;
    argsData = {
        cancel: false, name: axisLabelRender, axis: axis,
        text: text, value: tempInterval, labelStyle: labelStyle
    };
    chart.trigger(axisLabelRender, argsData);
    if (!argsData.cancel) {
        let isLineBreakLabels: boolean = argsData.text.indexOf('<br>') !== -1;
        let text: string | string[] = (axis.enableTrim) ? (isLineBreakLabels ?
            lineBreakLabelTrim(axis.maximumLabelWidth, argsData.text, axis.labelStyle) :
            textTrim(axis.maximumLabelWidth, argsData.text, axis.labelStyle)) : argsData.text;
        axis.visibleLabels.push(new VisibleLabels(text, argsData.value, argsData.labelStyle, argsData.text));
    }
}
/**
 * The function used to find whether the range is set.
 * @return {boolean}
 * @private
 */
export function setRange(axis: Axis): boolean {
    return (axis.minimum != null && axis.maximum != null);
}
/**
 * Calculate desired interval for the axis.
 * @return {void}
 * @private
 */
export function getActualDesiredIntervalsCount(availableSize: Size, axis: Axis): number {

    let size: number = axis.orientation === 'Horizontal' ? availableSize.width : availableSize.height;
    if (isNullOrUndefined(axis.desiredIntervals)) {
        let desiredIntervalsCount: number = (axis.orientation === 'Horizontal' ? 0.533 : 1) * axis.maximumLabels;
        desiredIntervalsCount = Math.max((size * (desiredIntervalsCount / 100)), 1);
        return desiredIntervalsCount;
    } else {
        return axis.desiredIntervals;
    }
}

/**
 * Animation for template
 * @private
 */

export function templateAnimate(
    element: Element, delay: number, duration: number, name: Effect, isRemove?: boolean
): void {
    new Animation({}).animate(<HTMLElement>element, {
        duration: duration,
        delay: delay,
        name: name,
        progress: (args: AnimationOptions): void => {
            args.element.style.visibility = 'visible';
        },
        end: (args: AnimationOptions): void => {
            if (isRemove) {
                remove(args.element);
            } else {
                args.element.style.visibility = 'visible';
            }
        },
    });
}

/** @private */
export function drawSymbol(
    location: ChartLocation, shape: string, size: Size, url: string, options: PathOption, label: string,
    renderer?: SvgRenderer | CanvasRenderer, clipRect?: Rect, isChartControl?: boolean, control?: BulletChart
): Element {
    let chartRenderer: SvgRenderer | CanvasRenderer = renderer ? renderer : new SvgRenderer('');
    let shapeOption: IShapes = calculateShapes(location, size, shape, options, url, isChartControl, control);
    let drawElement: Element = chartRenderer['draw' + shapeOption.functionName](
        shapeOption.renderOption, clipRect ? new Int32Array([clipRect.x, clipRect.y]) : null
    );
    //drawElement.setAttribute('aria-label', label);
    return drawElement;
}
/** @private */
// tslint:disable-next-line:max-func-body-length
export function calculateShapes(
    location: ChartLocation, size: Size, shape: string, options: PathOption, url: string, isChart?: boolean,
    control?: BulletChart
): IShapes {
    let dir: string;
    let functionName: string = 'Path';
    let isBulletChart: boolean = isChart;
    let width: number = (isBulletChart && shape === 'Circle') ? (size.width - 2) : size.width;
    let height: number = (isBulletChart && shape === 'Circle') ? (size.height - 2) : size.height;
    let sizeBullet: number = (isBulletChart) ? control.targetWidth : 0;
    let lx: number = location.x;
    let ly: number = location.y;
    let y: number = location.y + (-height / 2);
    let x: number = location.x + (-width / 2);
    switch (shape) {
        case 'Bubble':
        case 'Circle':
            functionName = 'Ellipse';
            merge(options, { 'rx': width / 2, 'ry': height / 2, 'cx': lx, 'cy': ly });
            break;
        case 'Cross':
            dir = 'M' + ' ' + x + ' ' + ly + ' ' + 'L' + ' ' + (lx + (width / 2)) + ' ' + ly + ' ' +
                'M' + ' ' + lx + ' ' + (ly + (height / 2)) + ' ' + 'L' + ' ' + lx + ' ' +
                (ly + (-height / 2));
            merge(options, { 'd': dir, stroke: options.fill });
            break;
        case 'Multiply':
            dir = 'M ' + (lx - sizeBullet) + ' ' + (ly - sizeBullet) + ' L ' +
                (lx + sizeBullet) + ' ' + (ly + sizeBullet) + ' M ' +
                (lx - sizeBullet) + ' ' + (ly + sizeBullet) + ' L ' + (lx + sizeBullet) + ' ' + (ly - sizeBullet);
            merge(options, { 'd': dir, stroke: options.fill });
            break;
        case 'HorizontalLine':
            dir = 'M' + ' ' + x + ' ' + ly + ' ' + 'L' + ' ' + (lx + (width / 2)) + ' ' + ly;
            merge(options, { 'd': dir });
            break;
        case 'VerticalLine':
            dir = 'M' + ' ' + lx + ' ' + (ly + (height / 2)) + ' ' + 'L' + ' ' + lx + ' ' + (ly + (-height / 2));
            merge(options, { 'd': dir });
            break;
        case 'Diamond':
            dir = 'M' + ' ' + x + ' ' + ly + ' ' +
                'L' + ' ' + lx + ' ' + (ly + (-height / 2)) + ' ' +
                'L' + ' ' + (lx + (width / 2)) + ' ' + ly + ' ' +
                'L' + ' ' + lx + ' ' + (ly + (height / 2)) + ' ' +
                'L' + ' ' + x + ' ' + ly + ' z';
            merge(options, { 'd': dir });
            break;
        case 'ActualRect':
            dir = 'M' + ' ' + x + ' ' + (ly + (-height / 8)) + ' ' +
                'L' + ' ' + (lx + (sizeBullet)) + ' ' + (ly + (-height / 8)) + ' ' +
                'L' + ' ' + (lx + (sizeBullet)) + ' ' + (ly + (height / 8)) + ' ' +
                'L' + ' ' + x + ' ' + (ly + (height / 8)) + ' ' +
                'L' + ' ' + x + ' ' + (ly + (-height / 8)) + ' z';
            merge(options, { 'd': dir });
            break;
        case 'TargetRect':
            dir = 'M' + ' ' + (x + (sizeBullet)) + ' ' + (ly + (-height / 2)) + ' ' +
                'L' + ' ' + (lx + (sizeBullet / 2)) + ' ' + (ly + (-height / 2)) + ' ' +
                'L' + ' ' + (lx + (sizeBullet / 2)) + ' ' + (ly + (height / 2)) + ' ' +
                'L' + ' ' + (x + (sizeBullet)) + ' ' + (ly + (height / 2)) + ' ' +
                'L' + ' ' + (x + (sizeBullet)) + ' ' + (ly + (-height / 2)) + ' z';
            merge(options, { 'd': dir });
            break;
        case 'Rectangle':
        case 'Hilo':
        case 'HiloOpenClose':
        case 'Candle':
        case 'Waterfall':
        case 'BoxAndWhisker':
        case 'StepArea':
        case 'Square':
        case 'Flag':
            dir = 'M' + ' ' + x + ' ' + (ly + (-height / 2)) + ' ' +
                'L' + ' ' + (lx + (width / 2)) + ' ' + (ly + (-height / 2)) + ' ' +
                'L' + ' ' + (lx + (width / 2)) + ' ' + (ly + (height / 2)) + ' ' +
                'L' + ' ' + x + ' ' + (ly + (height / 2)) + ' ' +
                'L' + ' ' + x + ' ' + (ly + (-height / 2)) + ' z';
            merge(options, { 'd': dir });
            break;
        case 'Pyramid':
        case 'Triangle':
            dir = 'M' + ' ' + x + ' ' + (ly + (height / 2)) + ' ' +
                'L' + ' ' + lx + ' ' + (ly + (-height / 2)) + ' ' +
                'L' + ' ' + (lx + (width / 2)) + ' ' + (ly + (height / 2)) + ' ' +
                'L' + ' ' + x + ' ' + (ly + (height / 2)) + ' z';
            merge(options, { 'd': dir });
            break;
        case 'Funnel':
        case 'InvertedTriangle':
            dir = 'M' + ' ' + (lx + (width / 2)) + ' ' + (ly - (height / 2)) + ' ' +
                'L' + ' ' + lx + ' ' + (ly + (height / 2)) + ' ' +
                'L' + ' ' + (lx - (width / 2)) + ' ' + (ly - (height / 2)) + ' ' +
                'L' + ' ' + (lx + (width / 2)) + ' ' + (ly - (height / 2)) + ' z';
            merge(options, { 'd': dir });
            break;
        case 'Pentagon':
            let eq: number = 72;
            let xVal: number;
            let yVal: number;
            for (let i: number = 0; i <= 5; i++) {
                xVal = (width / 2) * Math.cos((Math.PI / 180) * (i * eq));
                yVal = (height / 2) * Math.sin((Math.PI / 180) * (i * eq));
                if (i === 0) {
                    dir = 'M' + ' ' + (lx + xVal) + ' ' + (ly + yVal) + ' ';
                } else {
                    dir = dir.concat('L' + ' ' + (lx + xVal) + ' ' + (ly + yVal) + ' ');
                }
            }
            dir = dir.concat('Z');
            merge(options, { 'd': dir });
            break;
        case 'Image':
            functionName = 'Image';
            merge(options, { 'href': url, 'height': height, 'width': width, x: x, y: y });
            break;
    }
    options = <PathOption>calculateLegendShapes(location, new Size(width, height), shape, options).renderOption;
    return { renderOption: options, functionName: functionName };
}
/** @private */
export function getRectLocation(startLocation: ChartLocation, endLocation: ChartLocation, outerRect: Rect): Rect {
    let x: number;
    let y: number;
    x = (endLocation.x < outerRect.x) ? outerRect.x :
        (endLocation.x > (outerRect.x + outerRect.width)) ? outerRect.x + outerRect.width : endLocation.x;
    y = (endLocation.y < outerRect.y) ? outerRect.y :
        (endLocation.y > (outerRect.y + outerRect.height)) ? outerRect.y + outerRect.height : endLocation.y;
    return new Rect(
        (x > startLocation.x ? startLocation.x : x), (y > startLocation.y ? startLocation.y : y),
        Math.abs(x - startLocation.x), Math.abs(y - startLocation.y));
}
/** @private */
export function minMax(value: number, min: number, max: number): number {
    return value > max ? max : (value < min ? min : value);
}
/** @private */
export function getElement(id: string): Element {
    return document.getElementById(id);
}
/** @private */
export function getTemplateFunction(template: string): Function {
    let templateFn: Function = null;
    let e: Object;
    try {
        if (document.querySelectorAll(template).length) {
            templateFn = templateComplier(document.querySelector(template).innerHTML.trim());
        }
    } catch (e) {
        templateFn = templateComplier(template);
    }

    return templateFn;
}
/** @private */
export function createTemplate(
    childElement: HTMLElement, pointIndex: number, content: string,
    chart: Chart | AccumulationChart | RangeNavigator,
    point?: Points | AccPoints, series?: Series | AccumulationSeries, dataLabelId?: string
): HTMLElement {
    let templateFn: Function;
    let templateElement: HTMLCollection;
    templateFn = getTemplateFunction(content);
    try {
        let blazor: string = 'Blazor';
        let tempObject: Object = window[blazor] ? (dataLabelId ? point : { point: point }) : { chart: chart, series: series, point: point };
        let elementData: Element[] = templateFn ? templateFn(tempObject, null, null, dataLabelId ||
            childElement.id.replace(/[^a-zA-Z0-9]/g, '')) : [];
        if (elementData.length) {
            templateElement = Array.prototype.slice.call(elementData);
            let len: number = templateElement.length;
            for (let i: number = 0; i < len; i++) {
                childElement.appendChild(templateElement[i]);
            }
        }
    } catch (e) {
        return childElement;
    }
    return childElement;
}
/** @private */
export function getFontStyle(font: FontModel): string {
    let style: string = '';
    style = 'font-size:' + font.size +
        '; font-style:' + font.fontStyle + '; font-weight:' + font.fontWeight +
        '; font-family:' + font.fontFamily + ';opacity:' + font.opacity +
        '; color:' + font.color + ';';
    return style;
}
/** @private */
export function measureElementRect(element: HTMLElement, redraw: boolean = false): ClientRect {
    let bounds: ClientRect;
    document.body.appendChild(element);
    bounds = element.getBoundingClientRect();
    if (redraw) {
        remove(element);
    } else {
        removeElement(element.id);
    }
    return bounds;
}
/** @private */
export function findlElement(elements: NodeList, id: string): Element {
    let element: Element;
    for (let i: number = 0, length: number = elements.length; i < length; i++) {
        if ((<Element>elements[i]).id.indexOf(id) > -1) {
            element = <Element>elements[i];
            continue;
        }
    }
    return element;
}
/** @private */
export function getPoint(x: number, y: number, xAxis: Axis, yAxis: Axis, isInverted?: boolean, series?: Series): ChartLocation {
    x = ((xAxis.valueType === 'Logarithmic') ? logBase(((x > 0) ? x : 1), xAxis.logBase) : x);
    y = ((yAxis.valueType === 'Logarithmic') ? logBase(((y > 0) ? y : 1), yAxis.logBase) : y);

    x = valueToCoefficient(x, xAxis);
    y = valueToCoefficient(y, yAxis);

    let xLength: number = (isInverted ? xAxis.rect.height : xAxis.rect.width);
    let yLength: number = (isInverted ? yAxis.rect.width : yAxis.rect.height);

    let locationX: number = isInverted ? y * (yLength) : x * (xLength);
    let locationY: number = isInverted ? (1 - x) * (xLength) : (1 - y) * (yLength);
    return new ChartLocation(locationX, locationY);
}
/** @private */
export function appendElement(
    child: Element, parent: Element, redraw: boolean = false, animate: boolean = false,
    x: string = 'x', y: string = 'y'
): void {
    if (child && child.hasChildNodes() && parent) {
        appendChildElement(false, parent, child, redraw, animate, x, y);
    } else {
        return null;
    }
}
/**
 * Method to append child element
 * @param parent
 * @param childElement
 * @param isReplace
 */
export function appendChildElement(
    isCanvas: boolean,
    parent: Element | HTMLElement, childElement: Element | HTMLElement,
    redraw?: boolean, isAnimate: boolean = false, x: string = 'x', y: string = 'y',
    start?: ChartLocation, direction?: string, forceAnimate: boolean = false,
    isRect: boolean = false, previousRect: Rect = null, animateDuration?: number
): void {
    if (isCanvas) {
        return null;
    }
    let existChild: HTMLElement = parent.querySelector('#' + childElement.id);
    let element: HTMLElement = <HTMLElement>(existChild || getElement(childElement.id));
    let child: HTMLElement = <HTMLElement>childElement;
    let duration: number = animateDuration ? animateDuration : 300;
    if (redraw && isAnimate && element) {
        start = start || (element.tagName === 'DIV' ?
            new ChartLocation(+(element.style[x].split('px')[0]), +(element.style[y].split('px')[0])) :
            new ChartLocation(+element.getAttribute(x), +element.getAttribute(y)));
        if (direction && direction !== 'undefined') {
            pathAnimation(childElement, childElement.getAttribute('d'), redraw, direction, duration);
        } else if (isRect && previousRect) {
            animateRectElement(
                child, 0, duration, new Rect(
                    +element.getAttribute('x'), +element.getAttribute('y'),
                    +element.getAttribute('width'), +element.getAttribute('height')
                ),
                previousRect
            );
        } else {
            let end: ChartLocation = child.tagName === 'DIV' ?
                new ChartLocation(+(child.style[x].split('px')[0]), +(child.style[y].split('px')[0])) :
                new ChartLocation(+child.getAttribute(x), +child.getAttribute(y));
            animateRedrawElement(child, duration, start, end, x, y);
        }
    } else if (redraw && isAnimate && !element && forceAnimate) {
        templateAnimate(child, 0, 600, 'FadeIn');
    }
    if (existChild) {
        parent.replaceChild(child, element);
    } else {
        parent.appendChild(child);
    }
}
/** @private */
export function getDraggedRectLocation(x1: number, y1: number, x2: number, y2: number, outerRect: Rect): Rect {
    let width: number = Math.abs(x1 - x2);
    let height: number = Math.abs(y1 - y2);
    let x: number = Math.max(checkBounds(Math.min(x1, x2), width, outerRect.x, outerRect.width), outerRect.x);
    let y: number = Math.max(checkBounds(Math.min(y1, y2), height, outerRect.y, outerRect.height), outerRect.y);
    return new Rect(x, y, Math.min(width, outerRect.width), Math.min(height, outerRect.height));
}
/** @private */
export function checkBounds(start: number, size: number, min: number, max: number): number {
    if (start < min) {
        start = min;
    } else if ((start + size) > (max + min)) {
        start = (max + min) - size;
    }
    return start;
}
/** @private */
export function getLabelText(currentPoint: Points, series: Series, chart: Chart): string[] {
    let labelFormat: string = series.yAxis.labelFormat;
    let text: string[] = [];
    let customLabelFormat: boolean = labelFormat.match('{value}') !== null;
    switch (series.seriesType) {
        case 'XY':
            /**
             * I255790
             * For Polar radar series, the dataLabel appears out of range when axis range is given for yaxis
             * Cause: Since symbol location for the points which did not lies in within range, lies outside of seriesRect.
             * Fix: DataLabel rendered after checking WithIn for the points
             */
            if (series.chart.chartAreaType === 'PolarRadar') {
                if (series.drawType.indexOf('Stacking') !== -1) {
                    if ((series.yAxis.valueType === 'Logarithmic' &&
                        logWithIn(series.stackedValues.endValues[currentPoint.index], series.yAxis)) ||
                        withIn(series.stackedValues.endValues[currentPoint.index], series.yAxis.visibleRange)) {
                        text.push(currentPoint.text || currentPoint.yValue.toString());
                    }
                } else {
                    if ((series.yAxis.valueType === 'Logarithmic' && logWithIn(currentPoint.yValue, series.yAxis)) ||
                        withIn(currentPoint.yValue, series.yAxis.visibleRange)) {
                        text.push(currentPoint.text || currentPoint.yValue.toString());
                    }
                }
            } else {
                text.push(currentPoint.text || currentPoint.yValue.toString());
            }
            break;
        case 'HighLow':
            text.push(currentPoint.text || Math.max(<number>currentPoint.high, <number>currentPoint.low).toString());
            text.push(currentPoint.text || Math.min(<number>currentPoint.high, <number>currentPoint.low).toString());
            break;
        case 'HighLowOpenClose':
            text.push(currentPoint.text || Math.max(<number>currentPoint.high, <number>currentPoint.low).toString());
            text.push(currentPoint.text || Math.min(<number>currentPoint.high, <number>currentPoint.low).toString());
            text.push(currentPoint.text || Math.max(<number>currentPoint.open, <number>currentPoint.close).toString());
            text.push(currentPoint.text || Math.min(<number>currentPoint.open, <number>currentPoint.close).toString());
            break;
        case 'BoxPlot':
            text.push(currentPoint.text || currentPoint.median.toString());
            text.push(currentPoint.text || currentPoint.maximum.toString());
            text.push(currentPoint.text || currentPoint.minimum.toString());
            text.push(currentPoint.text || currentPoint.upperQuartile.toString());
            text.push(currentPoint.text || currentPoint.lowerQuartile.toString());
            for (let liers of currentPoint.outliers) {
                text.push(currentPoint.text || liers.toString());
            }
            break;

    }
    if (labelFormat && !currentPoint.text) {
        series.yAxis.format = chart.intl.getNumberFormat({
            format: customLabelFormat ? '' : labelFormat,
            useGrouping: chart.useGroupingSeparator
        });
        for (let i: number = 0; i < text.length; i++) {
            text[i] = customLabelFormat ? labelFormat.replace('{value}', series.yAxis.format(parseFloat(text[i]))) :
                series.yAxis.format(parseFloat(text[i]));
        }
    }
    return text;
}
/** @private */
export function stopTimer(timer: number): void {
    window.clearInterval(timer);
}
/** @private */
export function isCollide(rect: Rect, collections: Rect[], clipRect: Rect): boolean {
    let isCollide: boolean;
    let currentRect: Rect = new Rect(rect.x + clipRect.x, rect.y + clipRect.y, rect.width, rect.height);
    isCollide = collections.some((rect: Rect) => {
        return (currentRect.x < rect.x + rect.width && currentRect.x + currentRect.width > rect.x &&
            currentRect.y < rect.y + rect.height && currentRect.height + currentRect.y > rect.y);
    });
    return isCollide;
}
/** @private */
export function isOverlap(currentRect: Rect, rect: Rect): boolean {
    return (currentRect.x < rect.x + rect.width && currentRect.x + currentRect.width > rect.x &&
        currentRect.y < rect.y + rect.height && currentRect.height + currentRect.y > rect.y);
}

/** @private */
export function containsRect(currentRect: Rect, rect: Rect): boolean {
    return (currentRect.x <= rect.x && currentRect.x + currentRect.width >= rect.x + rect.width &&
        currentRect.y <= rect.y && currentRect.height + currentRect.y >= rect.y + rect.height);
}

/** @private */
export function calculateRect(location: ChartLocation, textSize: Size, margin: MarginModel): Rect {
    return new Rect(
        (location.x - (textSize.width / 2) - margin.left),
        (location.y - (textSize.height / 2) - margin.top),
        textSize.width + margin.left + margin.right,
        textSize.height + margin.top + margin.bottom
    );
}
/** @private */
export function convertToHexCode(value: ColorValue): string {
    return '#' + componentToHex(value.r) + componentToHex(value.g) + componentToHex(value.b);
}
/** @private */
export function componentToHex(value: number): string {
    let hex: string = value.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}

/** @private */
export function convertHexToColor(hex: string): ColorValue {
    let result: RegExpExecArray = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? new ColorValue(parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)) :
        new ColorValue(255, 255, 255);
}
/** @private */
export function colorNameToHex(color: string): string {
    let element: HTMLElement;
    color = color === 'transparent' ? 'white' : color;
    document.body.appendChild(createElement('text', { id: 'chartmeasuretext' }));
    element = document.getElementById('chartmeasuretext');
    element.style.color = color;
    color = window.getComputedStyle(element).color;
    remove(element);
    let exp: RegExp = /^(rgb|hsl)(a?)[(]\s*([\d.]+\s*%?)\s*,\s*([\d.]+\s*%?)\s*,\s*([\d.]+\s*%?)\s*(?:,\s*([\d.]+)\s*)?[)]$/;
    let isRGBValue: RegExpExecArray = exp.exec(color);
    return convertToHexCode(
        new ColorValue(parseInt(isRGBValue[3], 10), parseInt(isRGBValue[4], 10), parseInt(isRGBValue[5], 10))
    );
}
/** @private */
export function getSaturationColor(color: string, factor: number): string {
    color = colorNameToHex(color);
    color = color.replace(/[^0-9a-f]/gi, '');
    if (color.length < 6) {
        color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
    }
    factor = factor || 0;
    // convert to decimal and change luminosity
    let rgb: string = '#';
    let colorCode: number;
    for (let i: number = 0; i < 3; i++) {
        colorCode = parseInt(color.substr(i * 2, 2), 16);
        colorCode = Math.round(Math.min(Math.max(0, colorCode + (colorCode * factor)), 255));
        rgb += ('00' + colorCode.toString(16)).substr(colorCode.toString(16).length);
    }
    return rgb;
}
/** @private */
export function getMedian(values: number[]): number {
    let half: number = Math.floor(values.length / 2);
    return values.length % 2 ? values[half] : ((values[half - 1] + values[half]) / 2.0);
}
/** @private */
// tslint:disable-next-line:max-func-body-length
export function calculateLegendShapes(location: ChartLocation, size: Size, shape: string, options: PathOption): IShapes {
    let padding: number = 10;
    let dir: string = '';
    let space: number = 2;
    let height: number = size.height;
    let width: number = size.width;
    let lx: number = location.x;
    let ly: number = location.y;
    switch (shape) {
        case 'MultiColoredLine':
        case 'Line':
        case 'StackingLine':
        case 'StackingLine100':
            dir = 'M' + ' ' + (lx + (-width / 2)) + ' ' + (ly) + ' ' +
                'L' + ' ' + (lx + (width / 2)) + ' ' + (ly);
            merge(options, { 'd': dir });
            break;
        case 'StepLine':
            options.fill = 'transparent';
            dir = 'M' + ' ' + (lx + (-width / 2) - (padding / 4)) + ' ' + (ly + (height / 2)) + ' ' + 'L' + ' ' + (lx +
                (-width / 2) + (width / 10)) + ' ' + (ly + (height / 2)) + ' ' + 'L' + ' ' + (lx + (-width / 2) + (width / 10))
                + ' ' + (ly) + ' ' + 'L' + ' ' + (lx + (-width / 10)) + ' ' + (ly) + ' ' + 'L' + ' ' + (lx + (-width / 10))
                + ' ' + (ly + (height / 2)) + ' ' + 'L' + ' ' + (lx + (width / 5)) + ' ' + (ly + (height / 2)) + ' ' + 'L' +
                ' ' + (lx + (width / 5)) + ' ' + (ly + (-height / 2)) + ' ' + 'L' + ' ' + (lx + (width / 2)) + ' ' + (ly +
                    (-height / 2)) + 'L' + ' ' + (lx + (width / 2)) + ' ' + (ly + (height / 2)) + ' ' + 'L' + '' + (lx + (width / 2)
                        + (padding / 4)) + ' ' + (ly + (height / 2));
            merge(options, { 'd': dir });
            break;
        case 'RightArrow':
            dir = 'M' + ' ' + (lx + (-width / 2)) + ' ' + (ly - (height / 2)) + ' ' +
                'L' + ' ' + (lx + (width / 2)) + ' ' + (ly) + ' ' + 'L' + ' ' +
                (lx + (-width / 2)) + ' ' + (ly + (height / 2)) + ' L' + ' ' + (lx + (-width / 2)) + ' ' +
                (ly + (height / 2) - space) + ' ' + 'L' + ' ' + (lx + (width / 2) - (2 * space)) + ' ' + (ly) +
                ' L' + (lx + (-width / 2)) + ' ' + (ly - (height / 2) + space) + ' Z';
            merge(options, { 'd': dir });
            break;
        case 'LeftArrow':
            options.fill = options.stroke;
            options.stroke = 'transparent';
            dir = 'M' + ' ' + (lx + (width / 2)) + ' ' + (ly - (height / 2)) + ' ' +
                'L' + ' ' + (lx + (-width / 2)) + ' ' + (ly) + ' ' + 'L' + ' ' +
                (lx + (width / 2)) + ' ' + (ly + (height / 2)) + ' ' + 'L' + ' ' +
                (lx + (width / 2)) + ' ' + (ly + (height / 2) - space) + ' L' + ' ' + (lx + (-width / 2) + (2 * space))
                + ' ' + (ly) + ' L' + (lx + (width / 2)) + ' ' + (ly - (height / 2) + space) + ' Z';
            merge(options, { 'd': dir });
            break;
        case 'Column':
        case 'Pareto':
        case 'StackingColumn':
        case 'StackingColumn100':
        case 'RangeColumn':
        case 'Histogram':
            dir = 'M' + ' ' + (lx - 3 * (width / 5)) + ' ' + (ly - (height / 5)) + ' ' + 'L' + ' ' +
                (lx + 3 * (-width / 10)) + ' ' + (ly - (height / 5)) + ' ' + 'L' + ' ' +
                (lx + 3 * (-width / 10)) + ' ' + (ly + (height / 2)) + ' ' + 'L' + ' ' + (lx - 3 *
                    (width / 5)) + ' ' + (ly + (height / 2)) + ' ' + 'Z' + ' ' + 'M' + ' ' +
                (lx + (-width / 10) - (width / 20)) + ' ' + (ly - (height / 4) - (padding / 2))
                + ' ' + 'L' + ' ' + (lx + (width / 10) + (width / 20)) + ' ' + (ly - (height / 4) -
                    (padding / 2)) + ' ' + 'L' + ' ' + (lx + (width / 10) + (width / 20)) + ' ' + (ly
                        + (height / 2)) + ' ' + 'L' + ' ' + (lx + (-width / 10) - (width / 20)) + ' ' + (ly +
                            (height / 2)) + ' ' + 'Z' + ' ' + 'M' + ' ' + (lx + 3 * (width / 10)) + ' ' + (ly) + ' ' +
                'L' + ' ' + (lx + 3 * (width / 5)) + ' ' + (ly) + ' ' + 'L' + ' '
                + (lx + 3 * (width / 5)) + ' ' + (ly + (height / 2)) + ' ' + 'L' + ' '
                + (lx + 3 * (width / 10)) + ' ' + (ly + (height / 2)) + ' ' + 'Z';
            merge(options, { 'd': dir });
            break;
        case 'Bar':
        case 'StackingBar':
        case 'StackingBar100':
            dir = 'M' + ' ' + (lx + (-width / 2) + (-padding / 4)) + ' ' + (ly - 3 * (height / 5)) + ' '
                + 'L' + ' ' + (lx + 3 * (width / 10)) + ' ' + (ly - 3 * (height / 5)) + ' ' + 'L' + ' ' +
                (lx + 3 * (width / 10)) + ' ' + (ly - 3 * (height / 10)) + ' ' + 'L' + ' ' +
                (lx - (width / 2) + (-padding / 4)) + ' ' + (ly - 3 * (height / 10)) + ' ' + 'Z' + ' '
                + 'M' + ' ' + (lx + (-width / 2) + (-padding / 4)) + ' ' + (ly - (height / 5)
                    + (padding / 20)) + ' ' + 'L' + ' ' + (lx + (width / 2) + (padding / 4)) + ' ' + (ly
                        - (height / 5) + (padding / 20)) + ' ' + 'L' + ' ' + (lx + (width / 2) + (padding / 4))
                + ' ' + (ly + (height / 10) + (padding / 20)) + ' ' + 'L' + ' ' + (lx - (width / 2)
                    + (-padding / 4)) + ' ' + (ly + (height / 10) + (padding / 20)) + ' ' + 'Z' + ' ' + 'M'
                + ' ' + (lx - (width / 2) + (-padding / 4)) + ' ' + (ly + (height / 5)
                    + (padding / 10)) + ' ' + 'L' + ' ' + (lx + (-width / 4)) + ' ' + (ly + (height / 5)
                        + (padding / 10)) + ' ' + 'L' + ' ' + (lx + (-width / 4)) + ' ' + (ly + (height / 2)
                            + (padding / 10)) + ' ' + 'L' + ' ' + (lx - (width / 2) + (-padding / 4))
                + ' ' + (ly + (height / 2) + (padding / 10)) + ' ' + 'Z';
            merge(options, { 'd': dir });
            break;
        case 'Spline':
            options.fill = 'transparent';
            dir = 'M' + ' ' + (lx - (width / 2)) + ' ' + (ly + (height / 5)) + ' ' + 'Q' + ' '
                + lx + ' ' + (ly - height) + ' ' + lx + ' ' + (ly + (height / 5))
                + ' ' + 'M' + ' ' + lx + ' ' + (ly + (height / 5)) + ' ' + 'Q' + ' ' + (lx
                    + (width / 2)) + ' ' + (ly + (height / 2)) + ' ' + (lx + (width / 2)) + ' '
                + (ly - (height / 2));
            merge(options, { 'd': dir });
            break;
        case 'Area':
        case 'MultiColoredArea':
        case 'RangeArea':
        case 'StackingArea':
        case 'StackingArea100':
            dir = 'M' + ' ' + (lx - (width / 2) - (padding / 4)) + ' ' + (ly + (height / 2))
                + ' ' + 'L' + ' ' + (lx + (-width / 4) + (-padding / 8)) + ' ' + (ly - (height / 2))
                + ' ' + 'L' + ' ' + (lx) + ' ' + (ly + (height / 4)) + ' ' + 'L' + ' ' + (lx
                    + (width / 4) + (padding / 8)) + ' ' + (ly + (-height / 2) + (height / 4)) + ' '
                + 'L' + ' ' + (lx + (height / 2) + (padding / 4)) + ' ' + (ly + (height / 2)) + ' ' + 'Z';
            merge(options, { 'd': dir });
            break;
        case 'SplineArea':
            dir = 'M' + ' ' + (lx - (width / 2)) + ' ' + (ly + (height / 5)) + ' ' + 'Q' + ' ' + lx
                + ' ' + (ly - height) + ' ' + lx + ' ' + (ly + (height / 5)) + ' ' + 'Z' + ' ' + 'M'
                + ' ' + lx + ' ' + (ly + (height / 5)) + ' ' + 'Q' + ' ' + (lx + (width / 2)) + ' '
                + (ly + (height / 2)) + ' ' + (lx + (width / 2)) + ' '
                + (ly - (height / 2)) + ' ' + ' Z';
            merge(options, { 'd': dir });
            break;
        case 'Pie':
        case 'Doughnut':
            options.stroke = 'transparent';
            let r: number = Math.min(height, width) / 2;
            dir = getAccumulationLegend(lx, ly, r, height, width, shape);
            merge(options, { 'd': dir });
            break;
    }
    return { renderOption: options };
}
/** @private */
export function textTrim(maxWidth: number, text: string, font: FontModel): string {
    let label: string = text;
    let size: number = measureText(text, font).width;
    if (size > maxWidth) {
        let textLength: number = text.length;
        for (let i: number = textLength - 1; i >= 0; --i) {
            label = text.substring(0, i) + '...';
            size = measureText(label, font).width;
            if (size <= maxWidth) {
                return label;
            }
        }
    }
    return label;
}
/**
 * To trim the line break label
 * @param maxWidth
 * @param text
 * @param font
 */
export function lineBreakLabelTrim(maxWidth: number, text: string, font: FontModel): string[] {
    let labelCollection: string[] = [];
    let breakLabels: string[] = text.split('<br>');
    for (let i: number = 0; i < breakLabels.length; i++) {
        text = breakLabels[i];
        let size: number = measureText(text, font).width;
        if (size > maxWidth) {
            let textLength: number = text.length;
            for (let i: number = textLength - 1; i >= 0; --i) {
                text = text.substring(0, i) + '...';
                size = measureText(text, font).width;
                if (size <= maxWidth) {
                    labelCollection.push(text);
                    break;
                }
            }
        } else {
            labelCollection.push(text);
        }
    }
    return labelCollection;
}
/** @private */
export function stringToNumber(value: string, containerSize: number): number {
    if (value !== null && value !== undefined) {
        return value.indexOf('%') !== -1 ? (containerSize / 100) * parseInt(value, 10) : parseInt(value, 10);
    }
    return null;
}
/** @private */
export function redrawElement(
    redraw: boolean, id: string, options?: PathAttributes | RectAttributes | CircleAttributes,
    renderer?: SvgRenderer | CanvasRenderer
): Element {
    if (!redraw) {
        return null;
    }
    let element: Element = getElement(id);
    if (element && options) {
        renderer.setElementAttributes(
            options as SVGCanvasAttributes,
            element.tagName === 'clipPath' ? <Element>element.childNodes[0] : element
        );
    }
    return element;
}
/** @private */
export function animateRedrawElement(
    element: Element | HTMLElement, duration: number, start: ChartLocation, end: ChartLocation,
    x: string = 'x', y: string = 'y'
): void {
    let isDiv: boolean = element.tagName === 'DIV';
    let setStyle: Function = (xValue: number, yValue: number): void => {
        if (isDiv) {
            (element as HTMLElement).style[x] = xValue + 'px';
            (element as HTMLElement).style[y] = yValue + 'px';
        } else {
            element.setAttribute(x, xValue + '');
            element.setAttribute(y, yValue + '');
        }
    };
    setStyle(start.x, start.y);
    new Animation({}).animate(createElement('div'), {
        duration: duration,
        progress: (args: AnimationOptions): void => {
            setStyle(
                linear(args.timeStamp, start.x, end.x - start.x, args.duration),
                linear(args.timeStamp, start.y, end.y - start.y, args.duration)
            );
        },
        end: (): void => {
            setStyle(end.x, end.y);
        }
    });
}
/** @private */
export function textElement(
    renderer: SvgRenderer | CanvasRenderer, option: TextOption, font: FontModel, color: string,
    parent: HTMLElement | Element, isMinus: boolean = false, redraw?: boolean, isAnimate?: boolean,
    forceAnimate: boolean = false, animateDuration?: number, seriesClipRect?: Rect,
    labelSize?: Size, isRotatedLabelIntersect?: boolean, isCanvas?: boolean
): Element {
    let renderOptions: Object = {};
    let htmlObject: Element;
    let tspanElement: Element;
    //let renderer: SvgRenderer = new SvgRenderer('');
    let text: string;
    let height: number;
    let dy: number;
    let label: string;
    renderOptions = {
        'id': option.id,
        'x': option.x,
        'y': option.y,
        'fill': color ? color : 'black',
        'font-size': font.size,
        'font-style': font.fontStyle,
        'font-family': font.fontFamily,
        'font-weight': font.fontWeight,
        'text-anchor': option.anchor,
        'labelRotation': option.labelRotation,
        'transform': option.transform,
        'opacity': font.opacity,
        'dominant-baseline': option.baseLine
    };
    text = typeof option.text === 'string' ? option.text : isMinus ? option.text[option.text.length - 1] : option.text[0];
    htmlObject = renderer.createText(renderOptions, text, seriesClipRect ? seriesClipRect.x : 0, seriesClipRect ? seriesClipRect.y : 0);
    if (typeof option.text !== 'string' && option.text.length > 1) {
        for (let i: number = 1, len: number = option.text.length; i < len; i++) {
            height = (measureText(option.text[i], font).height);
            dy = (option.y) + ((isMinus) ? -(i * height) : (i * height));
            label = isMinus ? option.text[option.text.length - (i + 1)] : option.text[i];
            if (isCanvas) {
                tspanElement = renderer.createText(renderOptions, label, null, null, dy, true);
            } else {
                tspanElement = (renderer as SvgRenderer).createTSpan(
                    {
                        'x': option.x, 'id': option.id,
                        'y': dy
                    },
                    label
                );
                htmlObject.appendChild(tspanElement);
            }
        }
    }
    if (!isRotatedLabelIntersect) {
        appendChildElement(
            renderer instanceof CanvasRenderer, parent, htmlObject, redraw, isAnimate, 'x', 'y', null, null,
            forceAnimate, false, null, animateDuration
        );
    }
    return htmlObject;
}

/**
 * Method to calculate the width and height of the chart
 */

export function calculateSize(chart: Chart | AccumulationChart | RangeNavigator | StockChart): void {
    // fix for Chart rendered with default width in IE issue
    let containerWidth: number = chart.element.clientWidth || chart.element.offsetWidth;
    let containerHeight: number = chart.element.clientHeight;
    if ((chart as Chart).stockChart) {
        containerWidth = (chart as Chart).stockChart.element.clientWidth;
    }
    let height: number = 450;
    let marginHeight: number;
    if (chart.getModuleName() === 'rangeNavigator') {
        let range: RangeNavigator = chart as RangeNavigator;
        let tooltipSpace: number = range.tooltip.enable ? 35 : 0;
        let periodHeight: number = range.periodSelectorSettings.periods.length ?
            range.periodSelectorSettings.height : 0;
        marginHeight = range.margin.top + range.margin.bottom + tooltipSpace;
        let labelSize: number = measureText('tempString', range.labelStyle).height;
        let labelPadding: number = 15;
        height = (chart.series.length ? (Browser.isDevice ? 80 : 120) : ((range.enableGrouping ? (40 + labelPadding + labelSize) : 40)
            + marginHeight)) + periodHeight;
        if (range.disableRangeSelector) {
            height = periodHeight;
        }
    }
    chart.availableSize = new Size(
        stringToNumber(chart.width, containerWidth) || containerWidth || 600,
        stringToNumber(chart.height, containerHeight) || containerHeight || height
    );
}
export function createSvg(chart: Chart | AccumulationChart | RangeNavigator): void {
    (chart as Chart).canvasRender = new CanvasRenderer(chart.element.id);
    chart.renderer = (chart as Chart).enableCanvas ? (chart as Chart).canvasRender : new SvgRenderer(chart.element.id);
    calculateSize(chart);
    if ((chart as Chart).stockChart && chart.getModuleName() === 'chart') {
        chart.svgObject = (chart as Chart).stockChart.chartObject;
    } else if ((chart as RangeNavigator).stockChart && chart.getModuleName() === 'rangeNavigator') {
        chart.svgObject = (chart as RangeNavigator).stockChart.selectorObject;
    } else {
        if ((chart as Chart).enableCanvas) {
            chart.svgObject = chart.renderer.createCanvas({
                id: chart.element.id + '_canvas',
                width: chart.availableSize.width,
                height: chart.availableSize.height
            });
        } else {
            chart.svgObject = chart.renderer.createSvg({
                id: chart.element.id + '_svg',
                width: chart.availableSize.width,
                height: chart.availableSize.height
            });
        }
    }
}

/**
 * To calculate chart title and height
 * @param title
 * @param style
 * @param width
 */
export function getTitle(title: string, style: FontModel, width: number): string[] {
    let titleCollection: string[] = [];
    switch (style.textOverflow) {
        case 'Wrap':
            titleCollection = textWrap(title, width, style);
            break;
        case 'Trim':
            titleCollection.push(textTrim(width, title, style));
            break;
        default:
            titleCollection.push(title);
            break;
    }
    return titleCollection;
}

/**
 * Method to calculate x position of title
 */
export function titlePositionX(rect: Rect, titleStyle: FontModel): number {
    let positionX: number;
    if (titleStyle.textAlignment === 'Near') {
        positionX = rect.x;
    } else if (titleStyle.textAlignment === 'Center') {
        positionX = rect.x + rect.width / 2;
    } else {
        positionX = rect.x + rect.width;
    }
    return positionX;
}

/**
 * Method to find new text and element size based on textOverflow
 */
export function textWrap(currentLabel: string, maximumWidth: number, font: FontModel): string[] {
    let textCollection: string[] = currentLabel.split(' ');
    let label: string = '';
    let labelCollection: string[] = [];
    let text: string;
    for (let i: number = 0, len: number = textCollection.length; i < len; i++) {
        text = textCollection[i];
        if (measureText(label.concat(text), font).width < maximumWidth) {
            label = label.concat((label === '' ? '' : ' ') + text);
        } else {
            if (label !== '') {
                labelCollection.push(textTrim(maximumWidth, label, font));
                label = text;
            } else {
                labelCollection.push(textTrim(maximumWidth, text, font));
                text = '';
            }
        }
        if (label && i === len - 1) {
            labelCollection.push(textTrim(maximumWidth, label, font));
        }
    }
    return labelCollection;
}

/**
 * Method to support the subscript and superscript value to text
 */
export function getUnicodeText(text: string, regexp: RegExp): string {
    let title: string = text.replace(regexp, ' ');
    let digit: string[] = text.match(regexp);
    let digitSpecific: string = ' ';
    let convertedText: string = ' ';
    let k: number = 0;
    let unicodeSub: object = {
        '0': '\u2080', '1': '\u2081', '2': '\u2082', '3': '\u2083', '4': '\u2084',
        '5': '\u2085', '6': '\u2086', '7': '\u2087', '8': '\u2088', '9': '\u2089'
    };
    let unicodeSup: object = {
        '0': '\u2070', '1': '\u00B9', '2': '\u00B2', '3': '\u00B3', '4': '\u2074',
        '5': '\u2075', '6': '\u2076', '7': '\u2077', '8': '\u2078', '9': '\u2079'
    };
    for (let i: number = 0; i <= title.length - 1; i++) {
        if (title[i] === ' ') {
            digitSpecific = (regexp === regSub) ? digit[k].replace(/~/g, '') : digit[k].replace(/\^/g, '');
            for (let j: number = 0; j < digitSpecific.length; j++) {
                convertedText += (regexp === regSub) ? unicodeSub[digitSpecific[j]] : unicodeSup[digitSpecific[j]];
            }
            k++;
        } else {
            convertedText += title[i];
        }
    }
    return convertedText.trim();
}

/**
 * Method to reset the blazor templates
 */
export function blazorTemplatesReset(control: Chart | AccumulationChart): void {
    for (let i: number = 0; i < control.annotations.length; i++) {
        resetBlazorTemplate((control.element.id + '_Annotation_' + i).replace(/[^a-zA-Z0-9]/g, ''), 'ContentTemplate');
    }
    //This reset the tooltip templates
    resetBlazorTemplate(control.element.id + '_tooltipparent_template' + '_blazorTemplate', 'Template');

    //Datalabel templates reset
    resetBlazorTemplate(control.element.id + '_DataLabel');
}

/** @private */
export class CustomizeOption {

    public id: string;
    constructor(id?: string) {
        this.id = id;
    }
}
/** @private */
export class StackValues {
    public startValues?: number[];
    public endValues?: number[];

    constructor(startValue?: number[], endValue?: number[]) {
        this.startValues = startValue;
        this.endValues = endValue;
    }
}
/** @private */
export class RectOption extends PathOption {

    public x: number;
    public y: number;
    public height: number;
    public width: number;
    public rx: number;
    public ry: number;
    public transform: string;

    constructor(
        id: string, fill: string, border: BorderModel, opacity: number,
        rect: Rect, rx?: number, ry?: number, transform?: string, dashArray?: string
    ) {
        super(id, fill, border.width, border.color, opacity, dashArray);
        this.y = rect.y;
        this.x = rect.x;
        this.height = rect.height;
        this.width = rect.width;
        this.rx = rx ? rx : 0;
        this.ry = ry ? ry : 0;
        this.transform = transform ? transform : '';
        this.stroke = (border.width !== 0 && this.stroke !== '') ? border.color : 'transparent';
    }
}
/** @private */
export class ImageOption {

    public height: number;
    public width: number;
    public href: string;
    public x: number;
    public y: number;
    public id: string;
    public visibility: string;
    public preserveAspectRatio: string;

    constructor(
        height: number, width: number, href: string, x: number, y: number,
        id: string, visibility: string, preserveAspectRatio: string
    ) {
        this.height = height;
        this.width = width;
        this.href = href;
        this.x = x;
        this.y = y;
        this.id = id;
        this.visibility = visibility;
        this.preserveAspectRatio = preserveAspectRatio;
    }
}
/** @private */
export class CircleOption extends PathOption {
    public cy: number;
    public cx: number;
    public r: number;
    constructor(id: string, fill: string, border: BorderModel, opacity: number, cx: number, cy: number, r: number) {
        super(id, fill, border.width, border.color, opacity);
        this.cy = cy;
        this.cx = cx;
        this.r = r;
    }
}
/** @private */
export class PolygonOption {

    public id: string;
    public points: string;
    public fill: string;

    constructor(id: string, points: string, fill: string) {
        this.id = id;
        this.points = points;
        this.fill = fill;
    }
}
/** @private */
export class ChartLocation {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}
/** @private */
export class Thickness {

    public left: number;
    public right: number;
    public top: number;
    public bottom: number;

    constructor(left: number, right: number, top: number, bottom: number) {
        this.left = left;
        this.right = right;
        this.top = top;
        this.bottom = bottom;
    }
}
/** @private */
export class ColorValue {
    public r: number;
    public g: number;
    public b: number;

    constructor(r?: number, g?: number, b?: number) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
}
/** @private */
export class PointData {

    public point: Points;
    public series: Series;
    public lierIndex: number;

    constructor(point: Points, series: Series, index: number = 0) {
        this.point = point;
        this.series = series;
        this.lierIndex = index;
    }
}
/** @private */
export class AccPointData {
    public point: AccPoints;
    public series: AccumulationSeries;
    constructor(point: AccPoints, series: AccumulationSeries, index: number = 0) {
        this.point = point;
        this.series = series;
    }
}

/** @private */
export class ControlPoints {
    public controlPoint1: ChartLocation;
    public controlPoint2: ChartLocation;

    constructor(controlPoint1: ChartLocation, controlPoint2: ChartLocation) {
        this.controlPoint1 = controlPoint1;
        this.controlPoint2 = controlPoint2;
    }
}
/** @private */
export interface IHistogramValues {
    sDValue?: number;
    mean?: number;
    binWidth?: number;
    yValues?: number[];
}