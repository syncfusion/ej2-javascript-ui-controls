import { SvgRenderer, Animation, AnimationOptions, compile as templateComplier, Browser, BaseAttibutes } from '@syncfusion/ej2-base';
import { merge, Effect, extend, isNullOrUndefined, SVGCanvasAttributes } from '@syncfusion/ej2-base';
import { createElement, remove, PathAttributes, RectAttributes, CircleAttributes } from '@syncfusion/ej2-base';
import { Index } from '../../common/model/base';
import { FontModel, BorderModel, MarginModel } from '../model/base-model';
import { VisibleRangeModel, VisibleLabels } from '../../chart/axis/axis';
import { Series, Points } from '../../chart/series/chart-series';
import { Axis } from '../../chart/axis/axis';
import { Chart } from '../../chart/chart';
import { AccumulationChart } from '../../accumulation-chart/accumulation';
import { RangeNavigator } from '../../range-navigator/range-navigator';
import { AccumulationSeries, AccPoints } from '../../accumulation-chart/model/acc-base';
import { IShapes, IAxisLabelRenderEventArgs } from '../model/interface';
import { axisLabelRender } from '../model/constants';


/**
 * Methods for calculating the text size.
 */



/**
 * Function to measure the height and width of the text.
 * @param  {string} text
 * @param  {FontModel} font
 * @param  {string} id
 * @returns no
 * @private
 */
export function measureText(text: string, font: FontModel): Size {
    let htmlObject: HTMLElement = document.getElementById('chartmeasuretext');

    if (htmlObject === null) {
        htmlObject = createElement('text', { id: 'chartmeasuretext' });
        document.body.appendChild(htmlObject);
    }

    htmlObject.innerHTML = text;
    htmlObject.style.position = 'absolute';
    htmlObject.style.fontSize = font.size;
    htmlObject.style.fontWeight = font.fontWeight;
    htmlObject.style.fontStyle = font.fontStyle;
    htmlObject.style.fontFamily = font.fontFamily;
    htmlObject.style.visibility = 'hidden';
    htmlObject.style.top = '-100';
    htmlObject.style.left = '0';
    htmlObject.style.whiteSpace = 'nowrap';
    // For bootstrap line height issue
    htmlObject.style.lineHeight = 'normal';
    return new Size(htmlObject.clientWidth, htmlObject.clientHeight);
}
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
    x = (x + width > areaWidth) ? x - width : x;
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
        delta = range.delta;
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
        'position:absolute;border:1px solid #707070;font-size:' + fontSize + ';border-radius:2px;';
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
    let scrollBarHeight: number = axis.zoomingScrollBar && axis.zoomingScrollBar.svgObject ? axis.scrollBarHeight : 0;
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
        parent.appendChild(chart.renderer.drawPath(new PathOption(
            chart.element.id + '_Zoom_' + index + '_AxisLabel_Shape_' + i,
            chart.themeStyle.crosshairFill, 2, chart.themeStyle.crosshairFill, 1, null, direction)
        ) as HTMLElement);
        textElement(
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
export function getMinPointsDelta(axis: Axis, seriesCollection: Series[]): number {
    let minDelta: number = Number.MAX_VALUE;
    let xValues: Object[];
    let minVal: number;
    let seriesMin: number;
    seriesCollection.forEach((series: Series, index: number) => {
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
                xValues.forEach((value: Object, index: number, xValues: Object[]) => {
                    if (index > 0 && value) {
                        minVal = <number>value - <number>xValues[index - 1];
                        if (minVal !== 0) {
                            minDelta = Math.min(minDelta, minVal);
                        }
                    }
                });
            }
        }
    });
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
            element.removeAttribute('transform');
            if ((series.type === 'Scatter' || series.type === 'Bubble') && !isLabel && (pointIndex === series.points.length - 1)) {
                series.chart.trigger('animationComplete', { series: series });
            }

        }
    });
}

/**
 * Animation after legend click a path
 * @param element element to be animated
 * @param direction current direction of the path
 * @param previousDirection previous direction of the path
 */
export function pathAnimation(
    element: Element, direction: string, redraw: boolean, previousDirection?: string
): void {
    if (!redraw || (!previousDirection && !element)) {
        return null;
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
        duration: 300,
        progress: (args: AnimationOptions): void => {
            currentDireciton = '';
            splitDirections.map((directions: string, index: number) => {
                startPath = directions.split(' ');
                endPath = endDirections[index].split(' ');
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
        let text : string = (axis.enableTrim) ? textTrim(axis.maximumLabelWidth, argsData.text, axis.labelStyle) : argsData.text;
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
export function drawSymbol(location: ChartLocation, shape: string, size: Size, url: string, options: PathOption, label: string): Element {
    let functionName: string = 'Path';
    let renderer: SvgRenderer = new SvgRenderer('');
    let temp: IShapes = calculateShapes(location, size, shape, options, url);
    let htmlObject: Element = renderer['draw' + temp.functionName](temp.renderOption);
    htmlObject.setAttribute('aria-label', label);
    return htmlObject;
}
/** @private */
export function calculateShapes(location: ChartLocation, size: Size, shape: string, options: PathOption, url: string): IShapes {
    let path: string;
    let functionName: string = 'Path';
    let width: number = size.width;
    let height: number = size.height;
    let locX: number = location.x;
    let locY: number = location.y;
    let x: number = location.x + (-width / 2);
    let y: number = location.y + (-height / 2);
    switch (shape) {
        case 'Circle':
        case 'Bubble':
            functionName = 'Ellipse';
            merge(options, { 'rx': width / 2, 'ry': height / 2, 'cx': locX, 'cy': locY });
            break;
        case 'Cross':
            path = 'M' + ' ' + x + ' ' + locY + ' ' + 'L' + ' ' + (locX + (width / 2)) + ' ' + locY + ' ' +
                'M' + ' ' + locX + ' ' + (locY + (height / 2)) + ' ' + 'L' + ' ' + locX + ' ' +
                (locY + (-height / 2));
            merge(options, { 'd': path });
            break;
        case 'HorizontalLine':
            path = 'M' + ' ' + x + ' ' + locY + ' ' + 'L' + ' ' + (locX + (width / 2)) + ' ' + locY;
            merge(options, { 'd': path });
            break;
        case 'VerticalLine':
            path = 'M' + ' ' + locX + ' ' + (locY + (height / 2)) + ' ' + 'L' + ' ' + locX + ' ' + (locY + (-height / 2));
            merge(options, { 'd': path });
            break;
        case 'Diamond':
            path = 'M' + ' ' + x + ' ' + locY + ' ' +
                'L' + ' ' + locX + ' ' + (locY + (-height / 2)) + ' ' +
                'L' + ' ' + (locX + (width / 2)) + ' ' + locY + ' ' +
                'L' + ' ' + locX + ' ' + (locY + (height / 2)) + ' ' +
                'L' + ' ' + x + ' ' + locY + ' z';
            merge(options, { 'd': path });
            break;
        case 'Rectangle':
        case 'Hilo':
        case 'HiloOpenClose':
        case 'Candle':
        case 'Waterfall':
        case 'BoxAndWhisker':
        case 'StepArea':
            path = 'M' + ' ' + x + ' ' + (locY + (-height / 2)) + ' ' +
                'L' + ' ' + (locX + (width / 2)) + ' ' + (locY + (-height / 2)) + ' ' +
                'L' + ' ' + (locX + (width / 2)) + ' ' + (locY + (height / 2)) + ' ' +
                'L' + ' ' + x + ' ' + (locY + (height / 2)) + ' ' +
                'L' + ' ' + x + ' ' + (locY + (-height / 2)) + ' z';
            merge(options, { 'd': path });
            break;
        case 'Pyramid':
        case 'Triangle':
            path = 'M' + ' ' + x + ' ' + (locY + (height / 2)) + ' ' +
                'L' + ' ' + locX + ' ' + (locY + (-height / 2)) + ' ' +
                'L' + ' ' + (locX + (width / 2)) + ' ' + (locY + (height / 2)) + ' ' +
                'L' + ' ' + x + ' ' + (locY + (height / 2)) + ' z';
            merge(options, { 'd': path });
            break;
        case 'Funnel':
        case 'InvertedTriangle':
            path = 'M' + ' ' + (locX + (width / 2)) + ' ' + (locY - (height / 2)) + ' ' +
                'L' + ' ' + locX + ' ' + (locY + (height / 2)) + ' ' +
                'L' + ' ' + (locX - (width / 2)) + ' ' + (locY - (height / 2)) + ' ' +
                'L' + ' ' + (locX + (width / 2)) + ' ' + (locY - (height / 2)) + ' z';
            merge(options, { 'd': path });
            break;
        case 'Pentagon':
            let eq: number = 72;
            let xValue: number;
            let yValue: number;
            for (let i: number = 0; i <= 5; i++) {
                xValue = (width / 2) * Math.cos((Math.PI / 180) * (i * eq));
                yValue = (height / 2) * Math.sin((Math.PI / 180) * (i * eq));
                if (i === 0) {
                    path = 'M' + ' ' + (locX + xValue) + ' ' + (locY + yValue) + ' ';
                } else {
                    path = path.concat('L' + ' ' + (locX + xValue) + ' ' + (locY + yValue) + ' ');
                }
            }
            path = path.concat('Z');
            merge(options, { 'd': path });
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
    point?: Points | AccPoints, series?: Series | AccumulationSeries
): HTMLElement {
    let templateFn: Function;
    let templateElement: HTMLCollection;
    templateFn = getTemplateFunction(content);
    try {
        let elementData: Element[] = templateFn ? templateFn({ chart: chart, series: series, point: point }) : [];
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
        if (typeof element.remove === 'function') {
            element.remove();
        } else {
            element.parentNode.removeChild(element);
        }
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
    x = ((xAxis.valueType === 'Logarithmic') ? logBase(((x > 1) ? x : 1), xAxis.logBase) : x);
    y = ((yAxis.valueType === 'Logarithmic') ? logBase(((y > 1) ? y : 1), yAxis.logBase) : y);

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
        appendChildElement(parent, child, redraw, animate, x, y);
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
    parent: Element | HTMLElement, childElement: Element | HTMLElement,
    redraw?: boolean, isAnimate: boolean = false, x: string = 'x', y: string = 'y',
    start?: ChartLocation, direction?: string
): void {
    let existChild: HTMLElement = parent.querySelector('#' + childElement.id);
    let element: HTMLElement = <HTMLElement>(existChild || getElement(childElement.id));
    let child: HTMLElement = <HTMLElement>childElement;
    if (redraw && isAnimate && element) {
        start = start || (element.tagName === 'DIV' ?
            new ChartLocation(+(element.style[x].split('px')[0]), +(element.style[y].split('px')[0])) :
            new ChartLocation(+element.getAttribute(x), +element.getAttribute(y)));
        if (direction && direction !== 'undefined') {
            pathAnimation(childElement, childElement.getAttribute('d'), redraw, direction);
        } else {
            let end: ChartLocation = child.tagName === 'DIV' ?
                new ChartLocation(+(child.style[x].split('px')[0]), +(child.style[y].split('px')[0])) :
                new ChartLocation(+child.getAttribute(x), +child.getAttribute(y));
            animateRedrawElement(child, 300, start, end, x, y);
        }
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
            text.push(currentPoint.text || currentPoint.yValue.toString());
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
    if (typeof element.remove === 'function') {
        element.remove();
    } else {
        element.parentNode.removeChild(element);
    }
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
    let path: string = '';
    let height: number = size.height;
    let width: number = size.width;
    let locX: number = location.x;
    let locY: number = location.y;
    switch (shape) {
        case 'MultiColoredLine':
        case 'Line':
            path = 'M' + ' ' + (locX + (-width / 2)) + ' ' + (locY) + ' ' +
                'L' + ' ' + (locX + (width / 2)) + ' ' + (locY);
            merge(options, { 'd': path });
            break;
        case 'StepLine':
            options.fill = 'transparent';
            path = 'M' + ' ' + (locX + (-width / 2) - (padding / 4)) + ' ' + (locY + (height / 2)) + ' ' + 'L' + ' ' + (locX +
                (-width / 2) + (width / 10)) + ' ' + (locY + (height / 2)) + ' ' + 'L' + ' ' + (locX + (-width / 2) + (width / 10))
                + ' ' + (locY) + ' ' + 'L' + ' ' + (locX + (-width / 10)) + ' ' + (locY) + ' ' + 'L' + ' ' + (locX + (-width / 10))
                + ' ' + (locY + (height / 2)) + ' ' + 'L' + ' ' + (locX + (width / 5)) + ' ' + (locY + (height / 2)) + ' ' + 'L' +
                ' ' + (locX + (width / 5)) + ' ' + (locY + (-height / 2)) + ' ' + 'L' + ' ' + (locX + (width / 2)) + ' ' + (locY +
                    (-height / 2)) + 'L' + ' ' + (locX + (width / 2)) + ' ' + (locY + (height / 2)) + ' ' + 'L' + '' + (locX + (width / 2)
                        + (padding / 4)) + ' ' + (locY + (height / 2));
            merge(options, { 'd': path });
            break;
        case 'RightArrow':
            let space: number = 2;
            path = 'M' + ' ' + (locX + (-width / 2)) + ' ' + (locY - (height / 2)) + ' ' +
                'L' + ' ' + (locX + (width / 2)) + ' ' + (locY) + ' ' + 'L' + ' ' +
                (locX + (-width / 2)) + ' ' + (locY + (height / 2)) + ' L' + ' ' + (locX + (-width / 2)) + ' ' +
                (locY + (height / 2) - space) + ' ' + 'L' + ' ' + (locX + (width / 2) - (2 * space)) + ' ' + (locY) +
                ' L' + (locX + (-width / 2)) + ' ' + (locY - (height / 2) + space) + ' Z';
            merge(options, { 'd': path });
            break;
        case 'LeftArrow':
            options.fill = options.stroke;
            options.stroke = 'transparent';
            space = 2;
            path = 'M' + ' ' + (locX + (width / 2)) + ' ' + (locY - (height / 2)) + ' ' +
                'L' + ' ' + (locX + (-width / 2)) + ' ' + (locY) + ' ' + 'L' + ' ' +
                (locX + (width / 2)) + ' ' + (locY + (height / 2)) + ' ' + 'L' + ' ' +
                (locX + (width / 2)) + ' ' + (locY + (height / 2) - space) + ' L' + ' ' + (locX + (-width / 2) + (2 * space))
                + ' ' + (locY) + ' L' + (locX + (width / 2)) + ' ' + (locY - (height / 2) + space) + ' Z';
            merge(options, { 'd': path });
            break;
        case 'Column':
        case 'Pareto':
        case 'StackingColumn':
        case 'StackingColumn100':
        case 'RangeColumn':
        case 'Histogram':
            path = 'M' + ' ' + (locX - 3 * (width / 5)) + ' ' + (locY - (height / 5)) + ' ' + 'L' + ' ' +
                (locX + 3 * (-width / 10)) + ' ' + (locY - (height / 5)) + ' ' + 'L' + ' ' +
                (locX + 3 * (-width / 10)) + ' ' + (locY + (height / 2)) + ' ' + 'L' + ' ' + (locX - 3 *
                    (width / 5)) + ' ' + (locY + (height / 2)) + ' ' + 'Z' + ' ' + 'M' + ' ' +
                (locX + (-width / 10) - (width / 20)) + ' ' + (locY - (height / 4) - (padding / 2))
                + ' ' + 'L' + ' ' + (locX + (width / 10) + (width / 20)) + ' ' + (locY - (height / 4) -
                    (padding / 2)) + ' ' + 'L' + ' ' + (locX + (width / 10) + (width / 20)) + ' ' + (locY
                        + (height / 2)) + ' ' + 'L' + ' ' + (locX + (-width / 10) - (width / 20)) + ' ' + (locY +
                            (height / 2)) + ' ' + 'Z' + ' ' + 'M' + ' ' + (locX + 3 * (width / 10)) + ' ' + (locY) + ' ' +
                'L' + ' ' + (locX + 3 * (width / 5)) + ' ' + (locY) + ' ' + 'L' + ' '
                + (locX + 3 * (width / 5)) + ' ' + (locY + (height / 2)) + ' ' + 'L' + ' '
                + (locX + 3 * (width / 10)) + ' ' + (locY + (height / 2)) + ' ' + 'Z';
            merge(options, { 'd': path });
            break;
        case 'Bar':
        case 'StackingBar':
        case 'StackingBar100':
            path = 'M' + ' ' + (locX + (-width / 2) + (-padding / 4)) + ' ' + (locY - 3 * (height / 5)) + ' '
                + 'L' + ' ' + (locX + 3 * (width / 10)) + ' ' + (locY - 3 * (height / 5)) + ' ' + 'L' + ' ' +
                (locX + 3 * (width / 10)) + ' ' + (locY - 3 * (height / 10)) + ' ' + 'L' + ' ' +
                (locX - (width / 2) + (-padding / 4)) + ' ' + (locY - 3 * (height / 10)) + ' ' + 'Z' + ' '
                + 'M' + ' ' + (locX + (-width / 2) + (-padding / 4)) + ' ' + (locY - (height / 5)
                    + (padding / 20)) + ' ' + 'L' + ' ' + (locX + (width / 2) + (padding / 4)) + ' ' + (locY
                        - (height / 5) + (padding / 20)) + ' ' + 'L' + ' ' + (locX + (width / 2) + (padding / 4))
                + ' ' + (locY + (height / 10) + (padding / 20)) + ' ' + 'L' + ' ' + (locX - (width / 2)
                    + (-padding / 4)) + ' ' + (locY + (height / 10) + (padding / 20)) + ' ' + 'Z' + ' ' + 'M'
                + ' ' + (locX - (width / 2) + (-padding / 4)) + ' ' + (locY + (height / 5)
                    + (padding / 10)) + ' ' + 'L' + ' ' + (locX + (-width / 4)) + ' ' + (locY + (height / 5)
                        + (padding / 10)) + ' ' + 'L' + ' ' + (locX + (-width / 4)) + ' ' + (locY + (height / 2)
                            + (padding / 10)) + ' ' + 'L' + ' ' + (locX - (width / 2) + (-padding / 4))
                + ' ' + (locY + (height / 2) + (padding / 10)) + ' ' + 'Z';
            merge(options, { 'd': path });
            break;
        case 'Spline':
            options.fill = 'transparent';
            path = 'M' + ' ' + (locX - (width / 2)) + ' ' + (locY + (height / 5)) + ' ' + 'Q' + ' '
                + locX + ' ' + (locY - height) + ' ' + locX + ' ' + (locY + (height / 5))
                + ' ' + 'M' + ' ' + locX + ' ' + (locY + (height / 5)) + ' ' + 'Q' + ' ' + (locX
                    + (width / 2)) + ' ' + (locY + (height / 2)) + ' ' + (locX + (width / 2)) + ' '
                + (locY - (height / 2));
            merge(options, { 'd': path });
            break;
        case 'Area':
        case 'MultiColoredArea':
        case 'RangeArea':
        case 'StackingArea':
        case 'StackingArea100':
            path = 'M' + ' ' + (locX - (width / 2) - (padding / 4)) + ' ' + (locY + (height / 2))
                + ' ' + 'L' + ' ' + (locX + (-width / 4) + (-padding / 8)) + ' ' + (locY - (height / 2))
                + ' ' + 'L' + ' ' + (locX) + ' ' + (locY + (height / 4)) + ' ' + 'L' + ' ' + (locX
                    + (width / 4) + (padding / 8)) + ' ' + (locY + (-height / 2) + (height / 4)) + ' '
                + 'L' + ' ' + (locX + (height / 2) + (padding / 4)) + ' ' + (locY + (height / 2)) + ' ' + 'Z';
            merge(options, { 'd': path });
            break;
        case 'SplineArea':
            path = 'M' + ' ' + (locX - (width / 2)) + ' ' + (locY + (height / 5)) + ' ' + 'Q' + ' ' + locX
                + ' ' + (locY - height) + ' ' + locX + ' ' + (locY + (height / 5)) + ' ' + 'Z' + ' ' + 'M'
                + ' ' + locX + ' ' + (locY + (height / 5)) + ' ' + 'Q' + ' ' + (locX + (width / 2)) + ' '
                + (locY + (height / 2)) + ' ' + (locX + (width / 2)) + ' '
                + (locY - (height / 2)) + ' ' + ' Z';
            merge(options, { 'd': path });
            break;
        case 'Pie':
        case 'Doughnut':
            options.stroke = 'transparent';
            let r: number = Math.min(height, width) / 2;
            path = getAccumulationLegend(locX, locY, r, height, width, shape);
            merge(options, { 'd': path });
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
/** @private */
export function stringToNumber(value: string, containerSize: number): number {
    if (value !== null && value !== undefined) {
        return value.indexOf('%') !== -1 ? (containerSize / 100) * parseInt(value, 10) : parseInt(value, 10);
    }
    return null;
}
/** @private */
export function findDirection(
    rX: number, rY: number, rect: Rect, arrowLocation: ChartLocation, arrowPadding: number,
    top: boolean, bottom: boolean, left: boolean, tipX: number, tipY: number, tipRadius?: number
): string {
    let direction: string = '';

    let startX: number = rect.x;
    let startY: number = rect.y;
    let width: number = rect.x + rect.width;
    let height: number = rect.y + rect.height;
    tipRadius = tipRadius ? tipRadius : 0;

    if (top) {
        direction = direction.concat('M' + ' ' + (startX) + ' ' + (startY + rY) + ' Q ' + startX + ' '
            + startY + ' ' + (startX + rX) + ' ' + startY + ' ' +
            ' L' + ' ' + (width - rX) + ' ' + (startY) + ' Q ' + width + ' '
            + startY + ' ' + (width) + ' ' + (startY + rY));
        direction = direction.concat(' L' + ' ' + (width) + ' ' + (height - rY) + ' Q ' + width + ' '
            + (height) + ' ' + (width - rX) + ' ' + (height));
        if (arrowPadding !== 0) {
            direction = direction.concat(' L' + ' ' + (arrowLocation.x + arrowPadding / 2) + ' ' + (height));
            direction = direction.concat(' L' + ' ' + (tipX + tipRadius) + ' ' + (height + arrowPadding - tipRadius));
            direction += ' Q' + ' ' + (tipX) + ' ' + (height + arrowPadding) + ' ' + (tipX - tipRadius) +
                ' ' + (height + arrowPadding - tipRadius);
        }
        if ((arrowLocation.x - arrowPadding / 2) > startX) {
            direction = direction.concat(' L' + ' ' + (arrowLocation.x - arrowPadding / 2) + ' ' + height +
                ' L' + ' ' + (startX + rX) + ' ' + height + ' Q ' + startX + ' '
                + height + ' ' + (startX) + ' ' + (height - rY) + ' z');
        } else {
            if (arrowPadding === 0) {
                direction = direction.concat(' L' + ' ' + (startX + rX) + ' ' + height + ' Q ' + startX + ' '
                    + height + ' ' + (startX) + ' ' + (height - rY) + ' z');
            } else {
                direction = direction.concat(' L' + ' ' + (startX) + ' ' + (height + rY) + ' z');
            }
        }

    } else if (bottom) {
        direction = direction.concat('M' + ' ' + (startX) + ' ' + (startY + rY) + ' Q ' + startX + ' '
            + (startY) + ' ' + (startX + rX) + ' ' + (startY) + ' L' + ' ' + (arrowLocation.x - arrowPadding / 2) + ' ' + (startY));
        direction = direction.concat(' L' + ' ' + (tipX - tipRadius) + ' ' + (arrowLocation.y + tipRadius));
        direction += ' Q' + ' ' + (tipX) + ' ' + (arrowLocation.y) + ' ' + (tipX + tipRadius) + ' ' + (arrowLocation.y + tipRadius);
        direction = direction.concat(' L' + ' ' + (arrowLocation.x + arrowPadding / 2) + ' ' + (startY) + ' L' + ' '
            + (width - rX) + ' ' + (startY) + ' Q ' + (width) + ' ' + (startY) + ' ' + (width) + ' ' + (startY + rY));
        direction = direction.concat(' L' + ' ' + (width) + ' ' + (height - rY) + ' Q ' + (width) + ' '
            + (height) + ' ' + (width - rX) + ' ' + (height) +
            ' L' + ' ' + (startX + rX) + ' ' + (height) + ' Q ' + (startX) + ' '
            + (height) + ' ' + (startX) + ' ' + (height - rY) + ' z');
    } else if (left) {
        direction = direction.concat('M' + ' ' + (startX) + ' ' + (startY + rY) + ' Q ' + startX + ' '
            + (startY) + ' ' + (startX + rX) + ' ' + (startY));
        direction = direction.concat(' L' + ' ' + (width - rX) + ' ' + (startY) + ' Q ' + (width) + ' '
            + (startY) + ' ' + (width) + ' ' + (startY + rY) + ' L' + ' ' + (width) + ' ' + (arrowLocation.y - arrowPadding / 2));
        direction = direction.concat(' L' + ' ' + (width + arrowPadding - tipRadius) + ' ' + (tipY - tipRadius));
        direction += ' Q ' + (width + arrowPadding) + ' ' + (tipY) + ' ' + (width + arrowPadding - tipRadius) + ' ' + (tipY + tipRadius);
        direction = direction.concat(' L' + ' ' + (width) + ' ' + (arrowLocation.y + arrowPadding / 2) +
            ' L' + ' ' + (width) + ' ' + (height - rY) + ' Q ' + width + ' ' + (height) + ' ' + (width - rX) + ' ' + (height));
        direction = direction.concat(' L' + ' ' + (startX + rX) + ' ' + (height) + ' Q ' + startX + ' '
            + (height) + ' ' + (startX) + ' ' + (height - rY) + ' z');
    } else {
        direction = direction.concat('M' + ' ' + (startX + rX) + ' ' + (startY) + ' Q ' + (startX) + ' '
            + (startY) + ' ' + (startX) + ' ' + (startY + rY) + ' L' + ' ' + (startX) + ' ' + (arrowLocation.y - arrowPadding / 2));

        direction = direction.concat(' L' + ' ' + (startX - arrowPadding + tipRadius) + ' ' + (tipY - tipRadius));
        direction += ' Q ' + (startX - arrowPadding) + ' ' + (tipY) + ' ' + (startX - arrowPadding + tipRadius) + ' ' + (tipY + tipRadius);

        direction = direction.concat(' L' + ' ' + (startX) + ' ' + (arrowLocation.y + arrowPadding / 2) +
            ' L' + ' ' + (startX) + ' ' + (height - rY) + ' Q ' + startX + ' '
            + (height) + ' ' + (startX + rX) + ' ' + (height));

        direction = direction.concat(' L' + ' ' + (width - rX) + ' ' + (height) + ' Q ' + width + ' '
            + (height) + ' ' + (width) + ' ' + (height - rY) +
            ' L' + ' ' + (width) + ' ' + (startY + rY) + ' Q ' + width + ' '
            + (startY) + ' ' + (width - rX) + ' ' + (startY) + ' z');
    }

    return direction;
}
/** @private */
export function redrawElement(
    redraw: boolean, id: string, options?: PathAttributes | RectAttributes | CircleAttributes,
    renderer?: SvgRenderer
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
    options: TextOption, font: FontModel, color: string,
    parent: HTMLElement | Element, isMinus: boolean = false, redraw?: boolean, isAnimate?: boolean
): Element {
    let renderOptions: Object = {};
    let htmlObject: Element;
    let tspanElement: Element;
    let renderer: SvgRenderer = new SvgRenderer('');
    let text: string;
    let height: number;
    renderOptions = {
        'id': options.id,
        'x': options.x,
        'y': options.y,
        'fill': color,
        'font-size': font.size,
        'font-style': font.fontStyle,
        'font-family': font.fontFamily,
        'font-weight': font.fontWeight,
        'text-anchor': options.anchor,
        'transform': options.transform,
        'opacity': font.opacity,
        'dominant-baseline': options.baseLine
    };
    text = typeof options.text === 'string' ? options.text : isMinus ? options.text[options.text.length - 1] : options.text[0];
    htmlObject = renderer.createText(renderOptions, text);
    if (typeof options.text !== 'string' && options.text.length > 1) {
        for (let i: number = 1, len: number = options.text.length; i < len; i++) {
            height = (measureText(options.text[i], font).height);
            tspanElement = renderer.createTSpan(
                {
                    'x': options.x, 'id': options.id,
                    'y': (options.y) + ((isMinus) ? -(i * height) : (i * height))
                },
                isMinus ? options.text[options.text.length - (i + 1)] : options.text[i]
            );
            htmlObject.appendChild(tspanElement);
        }
    }
    appendChildElement(parent, htmlObject, redraw, isAnimate);
    return htmlObject;
}

/**
 * Method to calculate the width and height of the chart
 */

export function calculateSize(chart: Chart | AccumulationChart | RangeNavigator): void {
    let containerWidth: number = chart.element.clientWidth;
    let containerHeight: number = chart.element.clientHeight;
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
    chart.renderer = new SvgRenderer(chart.element.id);
    calculateSize(chart);
    chart.svgObject = chart.renderer.createSvg({
        id: chart.element.id + '_svg',
        width: chart.availableSize.width,
        height: chart.availableSize.height
    });
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
export class TextOption extends CustomizeOption {

    public anchor: string;
    public text: string | string[];
    public transform: string = '';
    public x: number;
    public y: number;
    public baseLine: string = 'auto';

    constructor(id?: string, x?: number, y?: number, anchor?: string, text?: string | string[], transform: string = '', baseLine?: string) {
        super(id);
        this.x = x;
        this.y = y;
        this.anchor = anchor;
        this.text = text;
        this.transform = transform;
        this.baseLine = baseLine;
    }
}
/** @private */
export class PathOption extends CustomizeOption {
    public opacity: number;
    public fill: string;
    public stroke: string;
    public ['stroke-width']: number;
    public ['stroke-dasharray']: string;
    public d: string;

    constructor(id: string, fill: string, width: number, color: string, opacity?: number, dashArray?: string, d?: string) {
        super(id);
        this.opacity = opacity;
        this.fill = fill;
        this.stroke = color;
        this['stroke-width'] = width;
        this['stroke-dasharray'] = dashArray;
        this.d = d;
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
export class Size {

    public height: number;
    public width: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }
}
/** @private */
export class Rect {

    public x: number;
    public y: number;
    public height: number;
    public width: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
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