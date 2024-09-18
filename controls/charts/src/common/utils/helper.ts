import { Animation, AnimationOptions, compile as templateComplier, Browser } from '@syncfusion/ej2-base';
import { merge, Effect, extend, isNullOrUndefined, resetBlazorTemplate } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { Index } from '../../common/model/base';
import { TextAttributes } from '@syncfusion/ej2-svg-base';
import { PathAttributes, RectAttributes, CircleAttributes, SVGCanvasAttributes, BaseAttibutes } from '@syncfusion/ej2-svg-base';
import { FontModel, BorderModel, MarginModel } from '../model/base-model';
import { VisibleLabels } from '../../chart/axis/axis';
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
import { measureText, Rect, TextOption, Size, PathOption, SvgRenderer, CanvasRenderer } from '@syncfusion/ej2-svg-base';
import { BulletChart } from '../../bullet-chart/bullet-chart';
import { RangeColorSettingModel } from '../../chart/chart-model';
import { AccumulationDataLabelSettingsModel, IAccTextRenderEventArgs } from '../../accumulation-chart';
import {Alignment} from './enum';
import { Chart3D } from '../../chart3d';
import { Chart3DAxis } from '../../chart3d/axis/axis';
import { Chart3DPoint, Chart3DSeries} from '../../chart3d/series/chart-series';
import { CircularChart3D } from '../../circularchart3d';
import { VisibleRangeModel } from '../model/interface';

/**
 * Function to sort the dataSource, by default it sort the data in ascending order.
 *
 * @param  {Object} data chart data
 * @param  {string} fields date fields
 * @param  {boolean} isDescending boolean values of descending
 * @returns {Object[]} It returns chart data which be sorted.
 */
export function sort(data: Object[], fields: string[], isDescending?: boolean): Object[] {
    const sortData: Object[] = <Object[]>extend([], data, null);
    for (let i: number = 0; i < sortData.length; i++) {
        for (let j: number = 0; j < fields.length; j++) {
            if (sortData[i as number][fields[j as number]] instanceof Date) {
                sortData[i as number][fields[j as number]] = sortData[i as number][fields[j as number]].getTime();
            }
        }
    }
    sortData.sort((a: Object, b: Object) => {
        let first: number = 0;
        let second: number = 0;
        for (let i: number = 0; i < fields.length; i++) {
            first += a[fields[i as number]];
            second += b[fields[i as number]];
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

/**
 * Checks if a label contains a line break.
 *
 * @param {string} label - The label to check.
 * @returns {boolean} - True if the label contains a line break, otherwise false.
 */
export function isBreakLabel(label: string): boolean {
    return label.indexOf('<br>') !== -1;
}

/**
 * Retrieves the visible data points from a series.
 *
 * @param {Series | Chart3DSeries} series - The series to retrieve the visible data points.
 * @returns {Points[]} - An array containing the visible data points.
 */
export function getVisiblePoints(series: Series | Chart3DSeries): Points[] {
    const points: Points[] = extend([], series.points, null, true) as Points[];
    const tempPoints: Points[] = [];
    let tempPoint: Points;
    let pointIndex: number = 0;
    for (let i: number = 0; i < points.length; i++) {
        tempPoint = points[i as number];
        if (isNullOrUndefined(tempPoint.x)) {
            continue;
        } else {
            tempPoint.index = pointIndex++;
            tempPoints.push(tempPoint);
        }
    }
    return tempPoints;
}

/**
 * Rotates the size of text based on the provided angle.
 *
 * @param {FontModel} font - The font style of the text.
 * @param {string} text - The text to be rotated.
 * @param {number} angle - The angle of rotation.
 * @param {Chart | Chart3D} chart - The chart instance.
 * @param {FontModel} themeFontStyle - The font style based on the theme.
 * @returns {Size} - The rotated size of the text.
 */
export function rotateTextSize(font: FontModel, text: string, angle: number, chart: Chart| Chart3D, themeFontStyle: FontModel): Size {
    const transformValue: string = chart.element.style.transform;
    if (transformValue) {
        chart.element.style.transform = '';
    }
    const renderer: SvgRenderer = new SvgRenderer(chart.element.id);
    let labelText: string; let textCollection: string[] = [];
    let height: number; let dy: number; let label: string;
    let tspanElement: Element;
    const options: TextAttributes = {
        id: 'rotate_text',
        x: chart.initialClipRect.x,
        y: chart.initialClipRect.y,
        'font-size': font.size || themeFontStyle.size,
        'font-style': font.fontStyle || themeFontStyle.fontStyle,
        'font-family': font.fontFamily,
        'font-weight': font.fontWeight || themeFontStyle.fontWeight,
        'transform': 'rotate(' + angle + ', 0, 0)',
        'text-anchor': 'middle'
    };
    if (isBreakLabel(text)) {
        textCollection = text.split('<br>');
        labelText = textCollection[0];
    } else {
        labelText = text as string;
    }
    const htmlObject: HTMLElement = renderer.createText(options, labelText) as HTMLElement;
    if (!chart.delayRedraw && !chart.redraw && !(chart as Chart).stockChart) {
        chart.element.appendChild(chart.svgObject);
    }
    // for line break label
    if (typeof textCollection !== 'string' && textCollection.length > 1) {
        for (let i: number = 1, len: number = textCollection.length; i < len; i++) {
            height = (measureText(textCollection[i as number], font, chart.themeStyle.axisLabelFont).height);
            dy = (options.y) + ((i * height));
            label = textCollection[i as number];
            tspanElement = (renderer as SvgRenderer).createTSpan(
                {
                    'x': options.x, 'id': options.id,
                    'y': dy
                },
                label
            );
            htmlObject.appendChild(tspanElement);
        }
    }
    const axisSvgObject: Element = chart.svgRenderer.createSvg({ id: 'AxisLabelMax_svg' });
    if (chart.element.parentElement.style.transform.indexOf('scale') > -1) {
        document.body.appendChild(axisSvgObject);
        axisSvgObject.appendChild(htmlObject);
    } else {
        chart.svgObject.appendChild(htmlObject);
    }
    const box: ClientRect = htmlObject.getBoundingClientRect();
    if (transformValue) {
        chart.element.style.transform = transformValue;
    }
    if (chart.element.parentElement.style.transform.indexOf('scale') > -1) {
        remove(axisSvgObject);
    }
    else {
        remove(htmlObject);
    }
    if (!chart.delayRedraw && !chart.redraw && !(chart as Chart).stockChart && !(chart as Chart).pointsAdded) {
        remove(chart.svgObject);
    }
    if ((chart as Chart).enableCanvas) {
        const textWidth: number = measureText(text, font, chart.themeStyle.axisLabelFont).width;
        const textHeight: number = measureText(text, font, chart.themeStyle.axisLabelFont).height;
        const angleInRadians: number = (angle * Math.PI) / 180; // Convert the rotation angle to radians
        const rotatedTextWidth: number = Math.abs(Math.cos(angleInRadians) * textWidth) + Math.abs(Math.sin(angleInRadians) * textHeight);
        const rotatedTextHeight: number = Math.abs(Math.sin(angleInRadians) * textWidth) + Math.abs(Math.cos(angleInRadians) * textHeight);
        return new Size(rotatedTextWidth, rotatedTextHeight);
    }
    return new Size((box.right - box.left), (box.bottom - box.top));
}
/**
 * Removes the specified element.
 *
 * @param {string | Element} id - The id or reference of the element to be removed.
 * @returns {void}
 */
export function removeElement(id: string | Element): void {
    if (!id) {
        return null;
    }
    const element: Element = typeof id === 'string' ? getElement(id) : id;
    if (element) {
        remove(element);
    }
}
/**
 * Calculates the logarithm of a specified value with respect to a specified base.
 *
 * @param {number} value - The value for which to calculate the logarithm.
 * @param {number} base - The base of the logarithm.
 * @returns {number} - The logarithm of the value with respect to the specified base.
 */
export function logBase(value: number, base: number): number {
    return Math.log(value) / Math.log(base);
}
/**
 * Displays a tooltip at the specified coordinates with the given text.
 *
 * @param {string} text - The text content of the tooltip.
 * @param {number} x - The x-coordinate where the tooltip should be displayed.
 * @param {number} y - The y-coordinate where the tooltip should be displayed.
 * @param {number} areaWidth - The width of the area where the tooltip is displayed.
 * @param {string} id - The id of the tooltip element.
 * @param {Element} element - The element to which the tooltip is appended.
 * @param {boolean} isTouch - Indicates whether the tooltip is displayed on a touch device.
 * @param {boolean} isTitleOrLegendEnabled - Indicates whether the tooltip is enabled for title or legend.
 * @param {Rect} bound - The bounding rectangle in which the tooltip should be confined.
 * @returns {void}
 * @private
 */
export function showTooltip(
    text: string, x: number, y: number, areaWidth: number, id: string, element: Element,
    isTouch?: boolean, isTitleOrLegendEnabled?: boolean, bound?: Rect
): void {
    //let id1: string = 'EJ2_legend_tooltip';
    let tooltip: HTMLElement = document.getElementById(id);
    const size: Size = measureText(text, {
        fontFamily: 'Segoe UI', size: '12px',
        fontStyle: 'Normal', fontWeight: 'Regular'
    });
    const width: number = size.width + 5;
    x = (x + width > areaWidth) ? x - (width + 15) : x;
    if (bound && x < bound.x) {
        x = bound.x;
    }
    y = isTitleOrLegendEnabled ? (y - size.height / 2) : y + 15;
    if (!tooltip) {
        tooltip = createElement('div', {
            id: id,
            styles: 'top:' + (y).toString() + 'px;left:' + (x + 15).toString() +
                'px;background-color: rgb(255, 255, 255) !important; color:black !important; ' +
                'position:absolute;border:1px solid rgb(112, 112, 112); padding-left : 3px; padding-right : 2px;' +
                'padding-bottom : 2px; padding-top : 2px; font-size:12px; font-family: "Segoe UI"'
        });
        tooltip.innerText = text;
        element.appendChild(tooltip);
        const left: number = parseInt(tooltip.style.left.replace('px', ''), 10);
        if (left < 0) {
            tooltip.style.left = '0px';
        }
    } else {
        tooltip.innerText = text;
        tooltip.style.top = (y).toString() + 'px';
        tooltip.style.left = (x + 15).toString() + 'px';
    }
    if (isTouch) {
        setTimeout(() => { removeElement(id); }, 1500);
    }
}

/**
 * Checks if a value is within the specified range.
 *
 * @param {number} value - The value to check.
 * @param {VisibleRangeModel} range - The range to check against.
 * @returns {boolean} - True if the value is inside the range, otherwise false.
 */
export function inside(value: number, range: VisibleRangeModel): boolean {
    return (value < range.max) && (value > range.min);
}
/**
 * Checks if a value is within the specified range.
 *
 * @param {number} value - The value to check.
 * @param {VisibleRangeModel} range - The range to check against.
 * @returns {boolean} - True if the value is inside the range, otherwise false.
 */
export function withIn(value: number, range: VisibleRangeModel): boolean {
    return (value <= range.max) && (value >= range.min);
}
/**
 * Adjusts the value based on the axis type.
 *
 * @param {number} value - The value to adjust.
 * @param {Axis} axis - The axis used for adjustment.
 * @returns {number} - The adjusted value.
 */
export function logWithIn(value: number, axis: Axis): number {
    return axis.valueType === 'Logarithmic' ? logBase(value, axis.logBase) : value;
}
/**
 * Checks if a point is within the range of the previous and next points in a series.
 *
 * @param {Points} previousPoint - The previous point in the series.
 * @param {Points} currentPoint - The current point to check.
 * @param {Points} nextPoint - The next point in the series.
 * @param {Series} series - The series to which the points belong.
 * @returns {boolean} - A boolean indicating if the point is within the range.
 * @private
 */
export function withInRange(previousPoint: Points, currentPoint: Points, nextPoint: Points, series: Series): boolean {
    if (series.chart.zoomModule && series.chart.zoomSettings.enableAnimation) {
        return true;
    }
    const mX2: number = logWithIn(currentPoint.xValue, series.xAxis);
    const mX1: number = previousPoint ? logWithIn(previousPoint.xValue, series.xAxis) : mX2;
    const mX3: number = nextPoint ? logWithIn(nextPoint.xValue, series.xAxis) : mX2;
    const xStart: number = Math.floor(<number>series.xAxis.visibleRange.min);
    const xEnd: number = Math.ceil(<number>series.xAxis.visibleRange.max);
    return ((mX1 >= xStart && mX1 <= xEnd) || (mX2 >= xStart && mX2 <= xEnd) ||
        (mX3 >= xStart && mX3 <= xEnd) || (xStart >= mX1 && xStart <= mX3));
}
/**
 * Calculates the sum of an array of numbers.
 *
 * @param {number[]} values - An array of numbers.
 * @returns {number} - The sum of the numbers in the array.
 */
export function sum(values: number[]): number {
    let sum: number = 0;
    for (const value of values) {
        sum += value;
    }
    return sum;
}
/**
 * Calculates the sum of elements in a subarray.
 *
 * @param {Object[]} values - The array containing elements.
 * @param {number} first - The index of the first element in the subarray.
 * @param {number} last - The index of the last element in the subarray.
 * @param {number[]} index - The array of indices.
 * @param {Series} series - The series object.
 * @returns {number} - The sum of elements in the subarray.
 * @private
 */
export function subArraySum(values: Object[], first: number, last: number, index: number[], series: Series): number {
    let sum: number = 0;
    if (index !== null) {
        for (let i: number = (first + 1); i < last; i++) {
            if (index.indexOf(i) === -1) {
                sum += values[i as number][series.yName] as number;
            }
        }
    } else {

        for (let i: number = (first + 1); i < last; i++) {
            if (!isNullOrUndefined(values[i as number][series.yName])) {
                sum += values[i as number][series.yName] as number;
            }
        }
    }
    return sum;
}
/**
 * Subtracts thickness from the given rectangle.
 *
 * @param {Rect} rect - The rectangle from which to subtract thickness.
 * @param {Thickness} thickness - The thickness to subtract.
 * @returns {Rect} - The resulting rectangle after subtracting thickness.
 */
export function subtractThickness(rect: Rect, thickness: Thickness): Rect {
    rect.x += thickness.left;
    rect.y += thickness.top;
    rect.width -= thickness.left + thickness.right;
    rect.height -= thickness.top + thickness.bottom;
    return rect;
}
/**
 * Subtracts a rectangle representing thickness from the given rectangle.
 *
 * @param {Rect} rect - The rectangle from which to subtract the thickness rectangle.
 * @param {Thickness} thickness - The rectangle representing the thickness to subtract.
 * @returns {Rect} - The resulting rectangle after subtracting the thickness rectangle.
 */
export function subtractRect(rect: Rect, thickness: Rect): Rect {
    rect.x += thickness.x;
    rect.y += thickness.y;
    rect.width -= thickness.x + thickness.width;
    rect.height -= thickness.y + thickness.height;
    return rect;
}
/**
 * Converts a degree value to a location on the chart based on the provided radius and center point.
 *
 * @param {number} degree - The degree value to convert.
 * @param {number} radius - The radius from the center point.
 * @param {ChartLocation} center - The center point of the chart.
 * @returns {ChartLocation} - The location on the chart corresponding to the degree value.
 */
export function degreeToLocation(degree: number, radius: number, center: ChartLocation): ChartLocation {
    const radian: number = (degree * Math.PI) / 180;
    return new ChartLocation(Math.cos(radian) * radius + center.x, Math.sin(radian) * radius + center.y);
}
/**
 * Converts a degree value to radians.
 *
 * @param {number} degree - The degree value to convert.
 * @returns {number} - The equivalent value in radians.
 */
export function degreeToRadian(degree: number): number {
    return degree * (Math.PI / 180);
}
/**
 * Get the coordinates of a rotated rectangle.
 *
 * @param {ChartLocation[]} actualPoints - The coordinates of the original rectangle.
 * @param {number} centerX - The x-coordinate of the center of rotation.
 * @param {number} centerY - The y-coordinate of the center of rotation.
 * @param {number} angle - The angle of rotation in degrees.
 * @returns {ChartLocation[]} - The coordinates of the rotated rectangle.
 */
export function getRotatedRectangleCoordinates(
    actualPoints: ChartLocation[], centerX: number, centerY: number, angle: number
): ChartLocation[] {
    const coordinatesAfterRotation: ChartLocation[] = [];
    for (let i: number = 0; i < 4; i++) {
        const point: ChartLocation = actualPoints[i as number];
        // translate point to origin
        const tempX: number = point.x - centerX;
        const tempY: number = point.y - centerY;
        // now apply rotation
        const rotatedX: number = tempX * Math.cos(degreeToRadian(angle)) - tempY * Math.sin(degreeToRadian(angle));
        const rotatedY: number = tempX * Math.sin(degreeToRadian(angle)) + tempY * Math.cos(degreeToRadian(angle));
        // translate back
        point.x = rotatedX + centerX;
        point.y = rotatedY + centerY;
        coordinatesAfterRotation.push(new ChartLocation(point.x, point.y));
    }
    return coordinatesAfterRotation;
}

/**
 * Helper function to determine whether there is an intersection between the two polygons described
 * by the lists of vertices. Uses the Separating Axis Theorem.
 *
 * @param {ChartLocation[]} a an array of connected points [{x:, y:}, {x:, y:},...] that form a closed polygon.
 * @param {ChartLocation[]} b an array of connected points [{x:, y:}, {x:, y:},...] that form a closed polygon.
 * @returns {boolean} if there is any intersection between the 2 polygons, false otherwise.
 */
export function isRotatedRectIntersect(a: ChartLocation[], b: ChartLocation[]): boolean {
    const polygons: ChartLocation[][] = [a, b];
    let minA: number; let maxA: number; let projected: number; let i: number;
    let i1: number; let j: number; let minB: number; let maxB: number;

    for (i = 0; i < polygons.length; i++) {

        // for each polygon, look at each edge of the polygon, and determine if it separates
        // the two shapes
        const polygon: ChartLocation[] = polygons[i as number];
        for (i1 = 0; i1 < polygon.length; i1++) {

            // grab 2 vertices to create an edge
            const i2: number = (i1 + 1) % polygon.length;
            const p1: ChartLocation = polygon[i1 as number];
            const p2: ChartLocation = polygon[i2 as number];

            // find the line perpendicular to this edge
            const normal: ChartLocation = new ChartLocation(p2.y - p1.y, p1.x - p2.x);

            minA = maxA = undefined;
            // for each vertex in the first shape, project it onto the line perpendicular to the edge
            // and keep track of the min and max of these values
            for (j = 0; j < a.length; j++) {
                projected = normal.x * a[j as number].x + normal.y * a[j as number].y;
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
                projected = normal.x * b[j as number].x + normal.y * b[j as number].y;
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

/**
 * Generates the legend for accumulation chart.
 *
 * @param {number} locX - The x-coordinate of the legend position.
 * @param {number} locY - The y-coordinate of the legend position.
 * @param {number} r - The radius of the chart.
 * @param {number} height - The height of the legend.
 * @param {number} width - The width of the legend.
 * @returns {string} - The generated legend.
 */
function getAccumulationLegend(locX: number, locY: number, r: number, height: number, width: number): string {
    const cartesianlarge: ChartLocation = degreeToLocation(270, r, new ChartLocation(locX, locY));
    const cartesiansmall: ChartLocation = degreeToLocation(270, r, new ChartLocation(locX + (width / 10), locY));
    return 'M' + ' ' + locX + ' ' + locY + ' ' + 'L' + ' ' + (locX + r) + ' ' + (locY) + ' ' + 'A' + ' ' + (r) + ' ' + (r) +
        ' ' + 0 + ' ' + 1 + ' ' + 1 + ' ' + cartesianlarge.x + ' ' + cartesianlarge.y + ' ' + 'Z' + ' ' + 'M' + ' ' + (locX +
            (width / 10)) + ' ' + (locY - (height / 10)) + ' ' + 'L' + (locX + (r)) + ' ' + (locY - height / 10) + ' ' + 'A' + ' '
        + (r) + ' ' + (r) + ' ' + 0 + ' ' + 0 + ' ' + 0 + ' ' + cartesiansmall.x + ' ' + cartesiansmall.y + ' ' + 'Z';
}

/**
 * Calculates the angle between two points.
 *
 * @param {ChartLocation} center - The center point.
 * @param {ChartLocation} point - The point to calculate the angle from the center.
 * @returns {number} - The angle in degrees.
 */
export function getAngle(center: ChartLocation, point: ChartLocation): number {
    let angle: number = Math.atan2((point.y - center.y), (point.x - center.x));
    angle = angle < 0 ? (6.283 + angle) : angle;
    return angle * (180 / Math.PI);
}
/**
 * Returns a sub-array of values starting from the specified index.
 *
 * @param {number[]} values - The array of numbers.
 * @param {number} index - The index from which the sub-array starts.
 * @returns {number[]} - The sub-array of values.
 */
export function subArray(values: number[], index: number): number[] {
    const subArray: number[] = [];
    for (let i: number = 0; i <= index - 1; i++) {
        subArray.push(values[i as number]);
    }
    return subArray;
}
/**
 * Converts a value to its corresponding coefficient based on the axis range.
 *
 * @param {number} value - The value to be converted.
 * @param {Axis} axis - The axis object containing range information.
 * @returns {number} - The coefficient value corresponding to the input value.
 */
export function valueToCoefficient(value: number, axis: Axis): number {
    const range: VisibleRangeModel = axis.visibleRange;
    const result: number = (value - <number>range.min) / (range.delta);
    const isInverse: boolean = axis.isChart ? axis.isAxisInverse : axis.isInversed;
    return isInverse ? (1 - result) : result;

}
/**
 * Transforms a point to its visible position based on the axes range and inversion.
 *
 * @param {number} x - The x-coordinate of the point.
 * @param {number} y - The y-coordinate of the point.
 * @param {Axis} xAxis - The x-axis object containing range information.
 * @param {Axis} yAxis - The y-axis object containing range information.
 * @param {boolean} [isInverted=false] - Specifies if the chart is inverted.
 * @param {Series} [series] - The series object for additional information (optional).
 * @returns {ChartLocation} - The transformed visible position of the point.
 */
export function TransformToVisible(x: number, y: number, xAxis: Axis, yAxis: Axis, isInverted?: boolean, series?: Series): ChartLocation {
    x = (xAxis.valueType === 'Logarithmic' ? logBase(x > 1 ? x : 1, xAxis.logBase) : x);
    y = (yAxis.valueType === 'Logarithmic' ?
        logBase(y > 1 ? y : 1, yAxis.logBase) : y);
    x += xAxis.valueType === 'Category' && xAxis.labelPlacement === 'BetweenTicks' && series.type !== 'Radar' ? 0.5 : 0;
    const radius: number = series.chart.radius * valueToCoefficient(y, yAxis);
    const point: ChartLocation = CoefficientToVector(valueToPolarCoefficient(x, xAxis), series.chart.primaryXAxis.startAngle);
    return {
        x: (series.clipRect.width / 2 + series.clipRect.x) + radius * point.x,
        y: (series.clipRect.height / 2 + series.clipRect.y) + radius * point.y
    };

}
/**
 * Finds the index from the given id.
 *
 * @param {string} id - The id to search for.
 * @param {boolean} [isPoint=false] - Specifies if the id represents a data point (optional).
 * @returns {Index} - The index found from the id.
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

/**
 * Converts a coefficient value to a vector representing a point on the circumference of a circle.
 *
 * @param {number} coefficient - The coefficient value to convert.
 * @param {number} startAngle - The starting angle of the circle.
 * @returns {ChartLocation} - The vector representing the point on the circle.
 */
export function CoefficientToVector(coefficient: number, startAngle: number): ChartLocation {
    startAngle = startAngle < 0 ? startAngle + 360 : startAngle;
    let angle: number = Math.PI * (1.5 - 2 * coefficient);
    angle = angle + (startAngle * Math.PI) / 180;
    return { x: Math.cos(angle), y: Math.sin(angle) };
}

/**
 * Converts a value to a polar coefficient value based on the axis.
 *
 * @param {number} value - The value to convert.
 * @param {Axis} axis - The axis object.
 * @returns {number} - The polar coefficient value.
 */
export function valueToPolarCoefficient(value: number, axis: Axis): number {
    const range: VisibleRangeModel = axis.visibleRange;
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
    return axis.isAxisInverse ? ((value - <number>range.min) / delta) * (1 - 1 / (length)) :
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
/**
 * Creates a tooltip element with the specified id, text, position, and font size.
 *
 * @param {string} id - The id of the tooltip element.
 * @param {string} text - The text content of the tooltip.
 * @param {number} top - The top position of the tooltip.
 * @param {number} left - The left position of the tooltip.
 * @param {string} fontSize - The font size of the tooltip text.
 * @returns {void}
 */
export function createTooltip(id: string, text: string, top: number, left: number, fontSize: string): void {
    let tooltip: HTMLElement = getElement(id) as HTMLElement;
    const style: string = 'top:' + top.toString() + 'px;' +
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
/**
 * Creates zooming labels for the specified axis and adds them to the parent element.
 *
 * @param {Chart} chart - The chart instance.
 * @param {Axis} axis - The axis for which to create zooming labels.
 * @param {Element} parent - The parent element to which the labels will be appended.
 * @param {number} index - The index of the label.
 * @param {boolean} isVertical - Indicates whether the axis is vertical.
 * @param {Rect} rect - The bounding rectangle of the label.
 * @returns {Element} - The created zooming label element.
 */
export function createZoomingLabels(chart: Chart, axis: Axis, parent: Element, index: number, isVertical: boolean, rect: Rect): Element {
    const margin: number = 5;
    const opposedPosition: boolean = axis.isAxisOpposedPosition;
    const anchor: string = chart.enableRtl ? 'end' : isVertical ? 'start' : 'auto';
    let size: Size;
    const chartRect: number = chart.availableSize.width;
    let pathElement: Element;
    let x: number;
    let y: number;
    const rx: number = 3;
    let arrowLocation: ChartLocation;
    let direction: string;
    const scrollBarHeight: number = axis.scrollbarSettings.enable || (axis.zoomingScrollBar && axis.zoomingScrollBar.svgObject)
        ? axis.scrollBarHeight : 0;
    const isRtlEnabled: boolean = (chart.enableRtl && !isVertical && !axis.isInversed) ||
        (axis.isInversed && !(chart.enableRtl && !isVertical));
    for (let i: number = 0; i < 2; i++) {
        size = measureText(i ? (isRtlEnabled ? axis.startLabel : axis.endLabel) : (isRtlEnabled ? axis.endLabel : axis.startLabel),
                           axis.labelStyle, chart.themeStyle.axisLabelFont);
        if (isVertical) {
            arrowLocation = i ? new ChartLocation(rect.x - scrollBarHeight, rect.y + rx) :
                new ChartLocation(axis.rect.x - scrollBarHeight, (rect.y + rect.height - rx));
            x = (rect.x + (opposedPosition ? (rect.width + margin + scrollBarHeight) : -(size.width + margin + margin + scrollBarHeight)));
            y = (rect.y + (i ? 0 : rect.height - size.height - margin));
            x += (x < 0 || ((chartRect) < (x + size.width + margin))) ? (opposedPosition ? -(size.width / 2) : size.width / 2) : 0;
            direction = findCrosshairDirection(
                rx, rx, new Rect(x, y, size.width + margin, size.height + margin),
                arrowLocation, margin, false, false, !opposedPosition, arrowLocation.x, arrowLocation.y + (i ? -rx : rx));
        } else {
            arrowLocation = i ? new ChartLocation((rect.x + rect.width - rx), (rect.y + rect.height + scrollBarHeight)) :
                new ChartLocation(rect.x + rx, (rect.y + rect.height + scrollBarHeight));
            x = (rect.x + (i ? (rect.width - size.width - margin) : 0));
            y = (opposedPosition ? (rect.y - size.height - 10 - scrollBarHeight) : (rect.y + rect.height + margin + scrollBarHeight));
            direction = findCrosshairDirection(
                rx, rx, new Rect(x, y, size.width + margin, size.height + margin),
                arrowLocation, margin, opposedPosition, !opposedPosition, false, arrowLocation.x + (i ? rx : -rx), arrowLocation.y);
        }
        x = x + (margin / 2);
        y = y + (3 * (size.height / 4)) + (margin / 2);
        pathElement = chart.renderer.drawPath(
            {
                'id': chart.element.id + '_Zoom_' + index + '_AxisLabel_Shape_' + i,
                'fill': chart.themeStyle.crosshairFill, 'width': 2, 'color': chart.themeStyle.crosshairFill,
                'opacity': 1, 'stroke-dasharray': null, 'd': direction },
            null);
        parent.appendChild(pathElement);
        if (chart.theme === 'Fluent' || chart.theme === 'FluentDark') {
            const shadowId: string = chart.element.id + '_shadow';
            pathElement.setAttribute('filter', Browser.isIE ? '' : 'url(#' + shadowId + ')');

            let shadow: string = '<filter id="' + shadowId + '" height="130%"><feGaussianBlur in="SourceAlpha" stdDeviation="3"/>';
            shadow += '<feOffset dx="3" dy="3" result="offsetblur"/><feComponentTransfer><feFuncA type="linear" slope="0.5"/>';
            shadow += '</feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>';

            const defElement: Element = chart.renderer.createDefs();
            defElement.setAttribute('id', chart.element.id + 'SVG_tooltip_definition');
            parent.appendChild(defElement);

            defElement.innerHTML = shadow;
            pathElement.setAttribute('stroke', '#cccccc');
            pathElement.setAttribute('stroke-width', '0.5');
        }
        textElement(
            chart.renderer,
            new TextOption(
                chart.element.id + '_Zoom_' + index + '_AxisLabel_' + i, x, y, anchor, i ? (isRtlEnabled ? axis.startLabel : axis.endLabel) : (isRtlEnabled ? axis.endLabel : axis.startLabel)),
            { color: chart.themeStyle.crosshairLabelFont.color, fontFamily: 'Segoe UI', fontWeight: 'Regular', size: '11px' },
            chart.themeStyle.crosshairLabelFont.color, parent, null, null, null, null, null, null, null, null, null, null,
            chart.themeStyle.crosshairLabelFont
        );
    }

    return parent;
}
/**
 * Finds the direction of the crosshair based on the provided parameters.
 *
 * @param {number} rX - The x-coordinate of the crosshair line.
 * @param {number} rY - The y-coordinate of the crosshair line.
 * @param {Rect} rect - The bounding rectangle of the crosshair.
 * @param {ChartLocation} arrowLocation - The location of the arrow in the crosshair.
 * @param {number} arrowPadding - The padding for the arrow.
 * @param {boolean} top - Indicates whether the crosshair is positioned at the top.
 * @param {boolean} bottom - Indicates whether the crosshair is positioned at the bottom.
 * @param {boolean} left - Indicates whether the crosshair is positioned at the left.
 * @param {number} tipX - The x-coordinate of the crosshair tip.
 * @param {number} tipY - The y-coordinate of the crosshair tip.
 * @returns {string} - The direction of the crosshair ('Top', 'Bottom', 'Left', 'Right', 'Center').
 */
export function findCrosshairDirection(
    rX: number, rY: number, rect: Rect, arrowLocation: ChartLocation, arrowPadding: number,
    top: boolean, bottom: boolean, left: boolean, tipX: number, tipY: number
): string {
    let direction: string = '';
    const startX: number = rect.x;
    const startY: number = rect.y;
    const width: number = rect.x + rect.width;
    const height: number = rect.y + rect.height;

    if (top) {
        direction = direction.concat('M' + ' ' + (startX) + ' ' + (startY + rY) + ' Q ' + startX + ' '
            + startY + ' ' + (startX + rX) + ' ' + startY);
        direction = direction.concat(' L' + ' ' + (width - rX) + ' ' + (startY) + ' Q ' + width + ' '
            + startY + ' ' + (width) + ' ' + (startY + rY));
        direction = direction.concat(' L' + ' ' + (width) + ' ' + (height - rY) + ' Q ' + width + ' '
            + (height) + ' ' + (width - rX) + ' ' + (height));
        if (arrowPadding !== 0) {
            direction = direction.concat(' L' + ' ' + (arrowLocation.x + arrowPadding / 2) + ' ' + (height));
            direction = direction.concat(' L' + ' ' + (tipX) + ' ' + (height + arrowPadding)
                + ' L' + ' ' + (arrowLocation.x - arrowPadding / 2) + ' ' + height);
        }
        if ((arrowLocation.x - arrowPadding / 2) > startX) {
            direction = direction.concat(' L' + ' ' + (startX + rX) + ' ' + height + ' Q ' + startX + ' '
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
        direction = direction.concat(' L' + ' ' + (tipX) + ' ' + (arrowLocation.y));
        direction = direction.concat(' L' + ' ' + (arrowLocation.x + arrowPadding / 2) + ' ' + (startY));
        direction = direction.concat(' L' + ' ' + (width - rX) + ' ' + (startY)
            + ' Q ' + (width) + ' ' + (startY) + ' ' + (width) + ' ' + (startY + rY));
        direction = direction.concat(' L' + ' ' + (width) + ' ' + (height - rY) + ' Q ' + (width) + ' '
            + (height) + ' ' + (width - rX) + ' ' + (height));
        direction = direction.concat(' L' + ' ' + (startX + rX) + ' ' + (height) + ' Q ' + (startX) + ' '
            + (height) + ' ' + (startX) + ' ' + (height - rY) + ' z');
    } else if (left) {
        direction = direction.concat('M' + ' ' + (startX) + ' ' + (startY + rY) + ' Q ' + startX + ' '
            + (startY) + ' ' + (startX + rX) + ' ' + (startY));
        direction = direction.concat(' L' + ' ' + (width - rX) + ' ' + (startY) + ' Q ' + (width) + ' '
            + (startY) + ' ' + (width) + ' ' + (startY + rY) + ' L' + ' ' + (width) + ' ' + (arrowLocation.y - arrowPadding / 2));
        direction = direction.concat(' L' + ' ' + (width + arrowPadding) + ' ' + (tipY));
        direction = direction.concat(' L' + ' ' + (width) + ' ' + (arrowLocation.y + arrowPadding / 2));
        direction = direction.concat(' L' + ' ' + (width) + ' ' + (height - rY) + ' Q ' + width + ' ' + (height) + ' ' + (width - rX) + ' ' + (height));
        direction = direction.concat(' L' + ' ' + (startX + rX) + ' ' + (height) + ' Q ' + startX + ' '
            + (height) + ' ' + (startX) + ' ' + (height - rY) + ' z');
    } else {
        direction = direction.concat('M' + ' ' + (startX + rX) + ' ' + (startY) + ' Q ' + (startX) + ' '
            + (startY) + ' ' + (startX) + ' ' + (startY + rY) + ' L' + ' ' + (startX) + ' ' + (arrowLocation.y - arrowPadding / 2));
        direction = direction.concat(' L' + ' ' + (startX - arrowPadding) + ' ' + (tipY));
        direction = direction.concat(' L' + ' ' + (startX) + ' ' + (arrowLocation.y + arrowPadding / 2));
        direction = direction.concat(' L' + ' ' + (startX) + ' ' + (height - rY) + ' Q ' + startX + ' '
            + (height) + ' ' + (startX + rX) + ' ' + (height));
        direction = direction.concat(' L' + ' ' + (width - rX) + ' ' + (height) + ' Q ' + width + ' '
            + (height) + ' ' + (width) + ' ' + (height - rY));
        direction = direction.concat(' L' + ' ' + (width) + ' ' + (startY + rY) + ' Q ' + width + ' '
            + (startY) + ' ' + (width - rX) + ' ' + (startY) + ' z');
    }

    return direction;


}
//Within bounds
/**
 * Checks if the provided coordinates are within the bounds of the rectangle.
 *
 * @param {number} x - The x-coordinate to check.
 * @param {number} y - The y-coordinate to check.
 * @param {Rect} bounds - The bounding rectangle.
 * @param {number} width - The width of the area to include in the bounds check.
 * @param {number} height - The height of the area to include in the bounds check.
 * @returns {boolean} - Returns true if the coordinates are within the bounds; otherwise, false.
 */
export function withInBounds(x: number, y: number, bounds: Rect, width: number = 0, height: number = 0): boolean {
    return (x >= bounds.x - width && x <= bounds.x + bounds.width + width && y >= bounds.y - height
        && y <= bounds.y + bounds.height + height);
}
/**
 * Gets the x-coordinate value for a given point value on the axis.
 *
 * @param {number} value - The point value.
 * @param {number} size - The size of the axis.
 * @param {Axis} axis - The axis.
 * @returns {number} - Returns the x-coordinate value.
 */
export function getValueXByPoint(value: number, size: number, axis: Axis): number {
    const actualValue: number = !axis.isAxisInverse ? value / size : (1 - (value / size));
    return actualValue * (axis.visibleRange.delta) + axis.visibleRange.min;
}
/**
 * Gets the y-coordinate value for a given point value on the axis.
 *
 * @param {number} value - The point value.
 * @param {number} size - The size of the axis.
 * @param {Axis} axis - The axis.
 * @returns {number} - Returns the y-coordinate value.
 */
export function getValueYByPoint(value: number, size: number, axis: Axis): number {
    const actualValue: number = axis.isAxisInverse ? value / size : (1 - (value / size));
    return actualValue * (axis.visibleRange.delta) + axis.visibleRange.min;
}
/**
 * Finds the clip rectangle for a series.
 *
 * @param {Series} series - The series for which to find the clip rectangle.
 * @param {boolean} isCanvas - Indicates whether the rendering is on a canvas.
 * @returns {void}
 */
export function findClipRect(series: Series, isCanvas: boolean = false): void {
    const rect: Rect = series.clipRect;
    if (isCanvas && (series.type === 'Polar' || series.type === 'Radar'))
    {
        if (series.drawType === 'Scatter') {
            rect.x = series.xAxis.rect.x;
            rect.y = series.yAxis.rect.y;
            rect.width = series.xAxis.rect.width;
            rect.height = series.yAxis.rect.height;
        } else {
            rect.x = series.xAxis.rect.x / 2;
            rect.y = series.yAxis.rect.y / 2;
            rect.width = series.xAxis.rect.width;
            rect.height = series.yAxis.rect.height;
        }
    } else {
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
}
/**
 * Converts the first character of a string to lowercase.
 *
 * @param {string} str - The string to convert.
 * @returns {string} The converted string.
 */
export function firstToLowerCase(str: string): string {
    return str.substr(0, 1).toLowerCase() + str.substr(1);
}
/**
 * Gets the transformation of the chart area based on the provided axes and inverted axis state.
 *
 * @param {Axis} xAxis - The X-axis of the chart.
 * @param {Axis} yAxis - The Y-axis of the chart.
 * @param {boolean} invertedAxis - Indicates whether the chart axis is inverted.
 * @returns {Rect} The transformed chart area.
 */
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
/**
 * Calculates the minimum points delta between data points on the provided axis.
 *
 * @param {Axis | Chart3DAxis} axis - The axis for which to calculate the minimum points delta.
 * @param {Series[]} seriesCollection - The collection of series in the chart.
 * @returns {number} The minimum points delta.
 */
export function getMinPointsDelta(axis: Axis | Chart3DAxis, seriesCollection: Series[]): number {
    let minDelta: number = Number.MAX_VALUE;
    let xValues: Object[];
    let minVal: number;
    let seriesMin: number;
    const stackingGroups: string[] = [];
    for (let index: number = 0; index < seriesCollection.length; index++) {
        const series: Series = seriesCollection[index as number];
        xValues = [];
        if (series.visible &&
            (axis.name === series.xAxisName || (axis.name === 'primaryXAxis' && series.xAxisName === null)
                || (axis.name === series.chart.primaryXAxis.name && !series.xAxisName))) {
            if (series.type.indexOf('Stacking') > -1 && stackingGroups.indexOf(series.stackingGroup) === -1) {
                stackingGroups.push(series.stackingGroup);
            }
            xValues = series.points.map((point: Points) => {
                return point.xValue;
            });
            xValues.sort((first: Object, second: Object) => { return <number>first - <number>second; });
            if (xValues.length === 1) {
                const timeOffset: number = seriesCollection.length === 1 ? 25920000 : 2592000000;
                seriesMin = (axis.valueType === 'DateTime' && series.xMin === series.xMax) ? (series.xMin - timeOffset) : series.xMin;
                minVal = <number>xValues[0] - (!isNullOrUndefined(seriesMin) ?
                    seriesMin : axis.visibleRange.min);
                if (minVal !== 0) {
                    minDelta = Math.min(minDelta, minVal);
                }
            } else {
                for (let index: number = 0; index < xValues.length; index++) {
                    const value: Object = xValues[index as number];
                    if (index > 0 && value) {
                        minVal = series.type.indexOf('Stacking') > -1 && axis.valueType === 'Category' ? stackingGroups.length : <number>value - <number>xValues[index - 1];
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
/**
 * Retrieves the animation function based on the specified effect.
 *
 * @param {string} effect - The name of the animation effect.
 * @returns {Function} The animation function corresponding to the effect.
 */
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
 * Linear animation function.
 *
 * @param {number} currentTime - The current time of the animation.
 * @param {number} startValue - The starting value of the animation.
 * @param {number} endValue - The ending value of the animation.
 * @param {number} duration - The duration of the animation.
 * @returns {number} The interpolated value at the current time.
 * @private
 */
export function linear(currentTime: number, startValue: number, endValue: number, duration: number): number {
    return -endValue * Math.cos(currentTime / duration * (Math.PI / 2)) + endValue + startValue;
}

/**
 * Animates the marker element.
 *
 * @param {Element} element - The marker element to animate.
 * @param {number} delay - The delay before starting the animation.
 * @param {number} duration - The duration of the animation.
 * @param {Series | AccumulationSeries} series - The series associated with the marker.
 * @param {number} pointIndex - The index of the point in the series.
 * @param {ChartLocation} point - The location of the point.
 * @param {boolean} isLabel - Specifies whether the marker is a data label.
 * @returns {void}
 */
export function markerAnimate(
    element: Element, delay: number, duration: number, series: Series | AccumulationSeries,
    pointIndex: number, point: ChartLocation, isLabel: boolean
): void {
    (<HTMLElement>element).style.visibility = 'hidden';
    const transform: string = element.getAttribute('transform');
    new Animation({}).animate(<HTMLElement>element, {
        duration: duration,
        delay: delay,
        progress: (args: AnimationOptions): void => {
            if (args.timeStamp > args.delay) {
                args.element.style.visibility = 'visible';
            }
        },
        end: () => {
            const annotations: HTMLElement = <HTMLElement>document.getElementById((series as Series).chart.element.id + '_Annotation_Collections');
            if (annotations && series.type !== 'Line') {
                annotations.style.visibility = 'visible';
            }
            (<HTMLElement>element).style.visibility = '';
            element.setAttribute('transform', transform ? transform : '');
            if ((series.type === 'Scatter' || series.type === 'Bubble') && !isLabel && (pointIndex === series.points.length - 1)) {
                series.chart.trigger('animationComplete', { series: series.chart.isBlazor ? {} : series });
            }

        }
    });
}

/**
 * Animates the rectangle element.
 *
 * @param {Element} element - The rectangle element to animate.
 * @param {number} delay - The delay before starting the animation.
 * @param {number} duration - The duration of the animation.
 * @param {Rect} currentRect - The current rectangle dimensions.
 * @param {Rect} previousRect - The previous rectangle dimensions.
 * @returns {void}
 */
export function animateRectElement(
    element: Element, delay: number, duration: number, currentRect: Rect, previousRect: Rect
): void {
    const setStyle: Function = (rect: Rect): void => {
        element.setAttribute('x', rect.x + '');
        element.setAttribute('y', rect.y + '');
        element.setAttribute('width', rect.width + '');
        element.setAttribute('height', rect.height + '');
    };
    new Animation({}).animate(createElement('div'), {
        duration: duration,
        delay: delay,
        //name: name,
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
        }
    });
}

/**
 * Animation after legend click a path.
 *
 * @param {Element} element - element to be animated
 * @param {string} direction - current direction of the path
 * @param {boolean} redraw - chart redraw
 * @param {string} previousDirection - previous direction of the path
 * @param {number} animateDuration - animateDuration of the path
 * @returns {void}
 */
export function pathAnimation(
    element: Element, direction: string, redraw: boolean, previousDirection?: string, animateDuration?: number
): void {
    if (!redraw || (!previousDirection && !element)) {
        return null;
    }
    let duration: number = 300;
    if (!isNullOrUndefined(animateDuration)) {
        duration = animateDuration;
    }
    const startDirections: string = previousDirection || element.getAttribute('d');
    const splitDirections: string[] = startDirections.split(/(?=[LMCZAQ])/);
    const endDirections: string[] = direction.split(/(?=[LMCZAQ])/);
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
                endPath = endDirections[index as number] ? endDirections[index as number].split(' ') : startPath;
                if (startPath[0] === 'Z') {
                    currentDireciton += 'Z' + ' ';
                } else if (startPath[0] === '') {
                    currentDireciton = '';
                } else {
                    currentDireciton += startPath[0] + ' ' +
                        linear(args.timeStamp, +startPath[1], (+endPath[1] - +startPath[1]), args.duration) + ' ' +
                        linear(args.timeStamp, +startPath[2], (+endPath[2] - +startPath[2]), args.duration) + ' ';
                }
                if (startPath[0] === 'C' || startPath[0] === 'Q') {
                    c = 3;
                    end = startPath[0] === 'Q' ? 4 : 6;
                    while (c < end) {
                        currentDireciton += linear(args.timeStamp, +startPath[c as number], (+endPath[c as number] - +startPath[c as number]), args.duration) + ' ' +
                            linear(args.timeStamp, +startPath[++c], (+endPath[c as number] - +startPath[c as number]), args.duration) + ' ';
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
 * Point based animation in chart series.
 *
 * @param {Element} element element to be animated.
 * @param {string} direction current direction of the path.
 * @param {boolean} redraw chart redraw.
 * @param {string} previousDirection previous direction of the path.
 * @param {number} animateDuration animateDuration of the path.
 * @param {string} removeDirection removeDirection of the path.
 * @returns {void}
 */
export function animateAddPoints(
    element: Element, direction: string, redraw: boolean, previousDirection?: string, animateDuration?: number, removeDirection?: string
): void {
    if (!redraw || (!previousDirection && !element)) {
        return null;
    }
    let duration: number = 300;
    if (!isNullOrUndefined(animateDuration)) {
        duration = animateDuration;
    }
    const startDirections: string = previousDirection || element.getAttribute('d');
    const endDirections: string = direction;
    let currentDirection: string = '';
    element.setAttribute('d', startDirections);
    new Animation({}).animate(createElement('div'), {
        duration: duration,
        progress: (args: AnimationOptions): void => {
            currentDirection = '';
            const startPathCommands: string[] = startDirections.match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/g);
            const endPathCommands: string[] = endDirections.match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/g);
            const maxLength: number = Math.max(startPathCommands.length, endPathCommands.length);
            for (let i: number = 0; i < maxLength; i++) {
                const startPathCommand: string = startPathCommands[i as number] || '';
                const endPathCommand: string = endPathCommands[i as number] || '';
                const startCoords: string[] = startPathCommand.trim().split(/\s+/);
                const endCoords: string[] = endPathCommand.trim().split(/\s+/);
                const interpolatedCoords: number[] = [];
                for (let j: number = 1; j < startCoords.length; j++) {
                    const startCoord: number = parseFloat(startCoords[j as number]);
                    const endCoord: number = parseFloat(endCoords[j as number]);
                    if (!isNaN(startCoord) && !isNaN(endCoord) && startCoords.length === endCoords.length) {
                        const interpolatedValue: number = linear(args.timeStamp, startCoord, (endCoord - startCoord), duration);
                        if (i === maxLength - 1) {
                            interpolatedCoords.push(interpolatedValue);
                        }
                        else {
                            interpolatedCoords.push(interpolatedValue);
                        }
                    }
                }

                if (startCoords.length !== endCoords.length) {
                    currentDirection += 'L';
                }
                else {
                    currentDirection += startCoords[0];
                }
                currentDirection += ' ' + interpolatedCoords.join(' ');
                currentDirection += ' ';
            }
            element.setAttribute('d', currentDirection);
        },
        end: () => {
            element.setAttribute('d', removeDirection || direction);
        }
    });
}

/**
 * To append the clip rect element.
 *
 * @param {boolean} redraw - chart redraw value.
 * @param {BaseAttibutes} options - element options.
 * @param {SvgRenderer} renderer - svg renderer values.
 * @param {string} clipPath - clipPath of the element.
 * @returns {Element} - Returns clip rect element.
 */
export function appendClipElement(
    redraw: boolean, options: BaseAttibutes, renderer: SvgRenderer,
    clipPath: string = 'drawClipPath'
): Element {
    const clipElement: Element = redrawElement(
        redraw, options.id, options, renderer
    );
    if (clipElement) {
        const def: Element = renderer.createDefs();
        def.appendChild(clipElement);
        return def;
    } else {
        return renderer[clipPath as string](options);
    }
}

/**
 * Triggers the label render event.
 *
 * @param {Chart | RangeNavigator | Chart3D} chart - The chart or range navigator instance.
 * @param {number} tempInterval - The temporary interval value.
 * @param {string} text - The label text.
 * @param {FontModel} labelStyle - The style of the label.
 * @param {Axis | Chart3DAxis} axis - The axis associated with the label.
 * @returns {void}
 */
export function triggerLabelRender(
    chart: Chart | RangeNavigator| Chart3D, tempInterval: number, text: string, labelStyle: FontModel,
    axis: Axis | Chart3DAxis
): void {
    const argsData: IAxisLabelRenderEventArgs = {
        cancel: false, name: axisLabelRender, axis: axis as Axis,
        text: text, value: tempInterval, labelStyle: labelStyle
    };
    chart.trigger(axisLabelRender, argsData);
    if (!argsData.cancel) {
        const isLineBreakLabels: boolean = argsData.text.indexOf('<br>') !== -1;
        const text: string | string[] = (axis.enableTrim) ? (isLineBreakLabels ?
            lineBreakLabelTrim(axis.maximumLabelWidth, argsData.text, axis.labelStyle, chart.themeStyle.axisLabelFont) :
            textTrim(axis.maximumLabelWidth, argsData.text, axis.labelStyle, chart.enableRtl, chart.themeStyle.axisLabelFont))
            : argsData.text;
        axis.visibleLabels.push(new VisibleLabels(text, argsData.value, argsData.labelStyle, argsData.text));
    }
}
/**
 * The function used to find whether the range is set.
 *
 * @param {Axis | Chart3DAxis} axis - The axis to check.
 * @returns {boolean} - It returns true if the axis range is set otherwise false.
 * @private
 */
export function setRange(axis: Axis| Chart3DAxis): boolean {
    return (axis.minimum != null && axis.maximum != null);
}
/**
 * Checks if zooming is enabled for the axis.
 *
 * @param {Axis} axis - The axis to check for zooming.
 * @returns {boolean} - Returns true if zooming is enabled for the axis, otherwise false.
 */
export function isZoomSet(axis: Axis): boolean {
    return (axis.zoomFactor < 1 && axis.zoomPosition >= 0);
}
/**
 * Calculates the actual desired intervals count based on the available size and axis.
 *
 * @param {Size} availableSize - The available size for rendering.
 * @param {Axis | Chart3DAxis} axis - The axis for which to calculate the intervals count.
 * @returns {number} - The actual desired intervals count.
 */
export function getActualDesiredIntervalsCount(availableSize: Size, axis: Axis | Chart3DAxis): number {

    const size: number = axis.orientation === 'Horizontal' ? availableSize.width : availableSize.height;
    if (isNullOrUndefined(axis.desiredIntervals)) {
        let desiredIntervalsCount: number = (axis.orientation === 'Horizontal' ? 0.533 : 1) * axis.maximumLabels;
        desiredIntervalsCount = Math.max((size * (desiredIntervalsCount / 100)), 1);
        return desiredIntervalsCount;
    } else {
        return axis.desiredIntervals;
    }
}

/**
 * Animates the template element.
 *
 * @param {Element} element - The element to animate.
 * @param {number} delay - The delay before starting the animation.
 * @param {number} duration - The duration of the animation.
 * @param {Effect} name - The name of the animation effect.
 * @param {boolean} [isRemove] - Indicates whether to remove the element after animation completion.
 * @returns {void}
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
        }
    });
}

/**
 * Draws a symbol at the specified location.
 *
 * @param {ChartLocation} location - The location to draw the symbol.
 * @param {string} shape - The shape of the symbol.
 * @param {Size} size - The size of the symbol.
 * @param {string} url - The URL of the image symbol.
 * @param {PathOption} options - The options for drawing the symbol.
 * @param {string} label - The label for the symbol.
 * @param {SvgRenderer | CanvasRenderer} [renderer] - The renderer for drawing the symbol.
 * @param {Rect} [clipRect] - The clipping rectangle.
 * @param {boolean} [isChartControl] - Indicates whether it is a chart control.
 * @param {BulletChart} [control] - The bullet chart control.
 * @returns {Element} - The element representing the drawn symbol.
 */
export function drawSymbol(
    location: ChartLocation, shape: string, size: Size, url: string, options: PathOption, label: string,
    renderer?: SvgRenderer | CanvasRenderer, clipRect?: Rect, isChartControl?: boolean, control?: BulletChart
): Element {
    const chartRenderer: SvgRenderer | CanvasRenderer = renderer ? renderer : new SvgRenderer('');
    const shapeOption: IShapes = calculateShapes(location, size, shape, options, url, isChartControl, control);
    const drawElement: Element = chartRenderer['draw' + shapeOption.functionName](
        shapeOption.renderOption, clipRect ? new Int32Array([clipRect.x, clipRect.y]) : null
    );
    //drawElement.setAttribute('aria-label', label);
    return drawElement;
}
/**
 * Calculates the shapes based on the specified parameters.
 *
 * @param {ChartLocation} location - The location for the shapes.
 * @param {Size} size - The size of the shapes.
 * @param {string} shape - The shape of the symbols.
 * @param {PathOption} options - The options for drawing the shapes.
 * @param {string} url - The URL of the image symbols.
 * @param {boolean} [isChart] - Indicates whether it is a chart.
 * @param {BulletChart} [control] - The bullet chart control.
 * @returns {IShapes} - The calculated shapes.
 */
export function calculateShapes(
    location: ChartLocation, size: Size, shape: string, options: PathOption, url: string, isChart?: boolean,
    control?: BulletChart
): IShapes {
    let dir: string;
    let functionName: string = 'Path';
    const isBulletChart: boolean = isChart;
    const width: number = (isBulletChart && shape === 'Circle') ? (size.width - 2) : size.width;
    const height: number = (isBulletChart && shape === 'Circle') ? (size.height - 2) : size.height;
    const sizeBullet: number = (isBulletChart) ? control.targetWidth : 0;
    const lx: number = location.x;
    const ly: number = location.y;
    const y: number = location.y + (-height / 2);
    const x: number = location.x + (-width / 2);
    const eq: number = 72;
    let xVal: number;
    let yVal: number;
    switch (shape) {
    case 'Bubble':
    case 'Circle':
        functionName = 'Ellipse';
        merge(options, { 'rx': width / 2, 'ry': height / 2, 'cx': lx, 'cy': ly });
        break;
    case 'Plus':
        dir = 'M' + ' ' + x + ' ' + ly + ' ' + 'L' + ' ' + (lx + (width / 2)) + ' ' + ly + ' ' +
                'M' + ' ' + lx + ' ' + (ly + (height / 2)) + ' ' + 'L' + ' ' + lx + ' ' +
                (ly + (-height / 2));
        merge(options, { 'd': dir });
        break;
    case 'Cross':
        dir = 'M' + ' ' + x + ' ' + (ly + (-height / 2)) + ' ' + 'L' + ' ' + (lx + (width / 2)) + ' ' + (ly + (height / 2)) + ' ' +
                'M' + ' ' + x + ' ' + (ly + (height / 2)) + ' ' + 'L' + ' ' + (lx + (width / 2)) + ' ' + (ly + (-height / 2));
        merge(options, { 'd': dir });
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
    case 'RangeStepArea':
    case 'StackingStepArea':
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
    case 'Star': {
        const cornerPoints: number = 5;
        const outerRadius: number = Math.min(width, height) / 2;
        const innerRadius: number = outerRadius / 2;
        const angle: number = Math.PI / cornerPoints;
        let starPath: string = '';
        for (let i: number = 0; i < 2 * cornerPoints; i++) {
            const radius: number = (i % 2 === 0) ? outerRadius : innerRadius;
            const currentX: number = lx + radius * Math.cos(i * angle - Math.PI / 2);
            const currentY: number = ly + radius * Math.sin(i * angle - Math.PI / 2);
            starPath += (i === 0 ? 'M' : 'L') + currentX + ',' + currentY;
        }
        starPath += 'Z';
        merge(options, { 'd': starPath });
        break;
    }
    }
    options = <PathOption>calculateLegendShapes(location, new Size(width, height), shape, options).renderOption;
    return { renderOption: options, functionName: functionName };
}
/**
 * Gets the location of the rectangle based on the specified start and end locations and the outer rectangle.
 *
 * @param {ChartLocation} startLocation - The start location.
 * @param {ChartLocation} endLocation - The end location.
 * @param {Rect} outerRect - The outer rectangle.
 * @returns {Rect} - The location of the rectangle.
 */
export function getRectLocation(startLocation: ChartLocation, endLocation: ChartLocation, outerRect: Rect): Rect {
    const x: number = (endLocation.x < outerRect.x) ? outerRect.x :
        (endLocation.x > (outerRect.x + outerRect.width)) ? outerRect.x + outerRect.width : endLocation.x;
    const y: number = (endLocation.y < outerRect.y) ? outerRect.y :
        (endLocation.y > (outerRect.y + outerRect.height)) ? outerRect.y + outerRect.height : endLocation.y;
    return new Rect(
        (x > startLocation.x ? startLocation.x : x), (y > startLocation.y ? startLocation.y : y),
        Math.abs(x - startLocation.x), Math.abs(y - startLocation.y));
}
/**
 * Returns the value constrained within the specified minimum and maximum limits.
 *
 * @param {number} value - The input value.
 * @param {number} min - The minimum limit.
 * @param {number} max - The maximum limit.
 * @returns {number} - The constrained value.
 */
export function minMax(value: number, min: number, max: number): number {
    return value > max ? max : (value < min ? min : value);
}
/**
 * Retrieves the DOM element with the specified ID.
 *
 * @param {string} id - The ID of the element to retrieve.
 * @returns {Element} - The DOM element.
 */
export function getElement(id: string): Element {
    return document.getElementById(id);
}
/**
 * Gets the template function from the provided template string or function.
 *
 * @param {string | Function} template - The template string or function.
 * @returns {Function} - The template function.
 */
export function getTemplateFunction(template: string | Function): Function {
    let templateFn: Function = null;
    try {
        if (typeof template !== 'function' && document.querySelectorAll(template).length) {
            templateFn = templateComplier(document.querySelector(template).innerHTML.trim());
        } else {
            templateFn = templateComplier(template);
        }
    } catch (e) {
        templateFn = templateComplier(template);
    }

    return templateFn;
}
/**
 * Renders the accumulation chart data labels using template.
 *
 * @param {HTMLElement} childElement - The child element.
 * @param {AccumulationChart} chart - The accumulation chart instance.
 * @param {boolean} isTemplate - Defines whether the template is applied or not.
 * @param {AccPoints[]} points - The accumulation chart points.
 * @param {IAccTextRenderEventArgs} argsData - The accumulation chart text render event arguments.
 * @param {AccPoints} [point] - The accumulation chart point.
 * @param {Element} [datalabelGroup] - The data label group element.
 * @param {string} [id] - The id of the element.
 * @param {AccumulationDataLabelSettingsModel} [dataLabel] - The accumulation chart data label settings.
 * @param {boolean} [redraw] - Defines whether to redraw the chart or not.
 * @returns {void}
 */
export function accReactTemplate(
    childElement: HTMLElement, chart: AccumulationChart, isTemplate: boolean, points: AccPoints[],
    argsData: IAccTextRenderEventArgs, point?: AccPoints, datalabelGroup?: Element, id?: string,
    dataLabel?: AccumulationDataLabelSettingsModel, redraw?: boolean
): void {
    const clientRect: ClientRect = childElement.getBoundingClientRect();
    chart.accumulationDataLabelModule.calculateLabelSize(
        isTemplate, childElement, point, points, argsData, datalabelGroup, id, dataLabel, redraw, clientRect, true
    );
}
/**
 * Renders the chart data labels using template.
 *
 * @param {HTMLElement} childElement - The child element.
 * @param {Chart} chart - The chart instance.
 * @param {Points} point - The chart point.
 * @param {Series} series - The chart series.
 * @param {number} labelIndex - The index of the label.
 * @param {boolean} [redraw] - Defines whether to redraw the chart or not.
 * @returns {void}
 */
export function chartReactTemplate(
    childElement: HTMLElement, chart: Chart, point: Points, series: Series,
    labelIndex: number, redraw?: boolean
): void {
    const parentElement: HTMLElement = document.getElementById(
        chart.element.id + '_Series_' + (series.index === undefined ? series.category : series.index) + '_DataLabelCollections'
    );
    if (parentElement) {
        if (point.index === 0) {
            chart.dataLabelCollections = []; // clear old datalabel bounds for react callback
        }
        chart.dataLabelModule.calculateTemplateLabelSize(
            parentElement, childElement, point, series, series.marker.dataLabel,
            labelIndex, series.clipRect, redraw, true
        );
    }
}
/**
 * Creates a template.
 *
 * @param {HTMLElement} childElement - The child element of the template.
 * @param {number} pointIndex - The index of the point.
 * @param {string | Function} content - The content of the template.
 * @param {Chart | AccumulationChart | RangeNavigator} chart - The chart instance.
 * @param {Points | AccPoints} point - The chart or accumulation point.
 * @param {Series | AccumulationSeries} series - The chart or accumulation series.
 * @param {string} dataLabelId - The id of the data label.
 * @param {number} labelIndex - The index of the label.
 * @param {IAccTextRenderEventArgs} argsData - The event arguments for text rendering.
 * @param {boolean} isTemplate - Indicates whether it is a template.
 * @param {AccPoints[]} points - The accumulation points.
 * @param {Element} datalabelGroup - The group element of the data label.
 * @param {string} id - The id of the element.
 * @param {AccumulationDataLabelSettingsModel} dataLabel - The data label settings.
 * @param {boolean} redraw - Indicates whether to redraw.
 * @returns {HTMLElement} - The created template element.
 * @private
 */
export function createTemplate(
    childElement: HTMLElement, pointIndex: number, content: string | Function, chart: Chart | AccumulationChart | RangeNavigator,
    point?: Points | AccPoints, series?: Series | AccumulationSeries, dataLabelId?: string, labelIndex?: number,
    argsData?: IAccTextRenderEventArgs, isTemplate?: boolean, points?: AccPoints[], datalabelGroup?: Element, id?: string,
    dataLabel?: AccumulationDataLabelSettingsModel, redraw?: boolean
): HTMLElement {
    const templateFn: Function = getTemplateFunction(content);
    let templateElement: HTMLCollection;
    try {
        const blazor: string = 'Blazor';
        const tempObject: Object = window[blazor as string] ? (dataLabelId ? point : { point: point }) :
            { chart: chart, series: series, point: point };
        const templateId: string = dataLabelId ? dataLabelId + '_template' : 'template';
        const elementData: Element[] = templateFn ? templateFn(tempObject, chart, templateId, dataLabelId ||
            childElement.id.replace(/[^a-zA-Z0-9]/g, '')) : [];
        if (elementData.length) {
            templateElement = Array.prototype.slice.call(elementData);
            const len: number = templateElement.length;
            for (let i: number = 0; i < len; i++) {
                childElement.appendChild(templateElement[i as number]);
            }
        }
        let reactCallback: Function;
        if (chart.getModuleName() === 'accumulationchart') {
            reactCallback = accReactTemplate.bind(
                this, childElement, chart, isTemplate, points, argsData, points[pointIndex as number],
                datalabelGroup, id, dataLabel, redraw
            );
            if ((chart as any).isReact) { (chart as any).renderReactTemplates(reactCallback); }
        } else if (chart.getModuleName() === 'chart') {
            reactCallback = (point && series) ? chartReactTemplate.bind(
                this, childElement, chart, point, series, labelIndex, redraw
            ) : reactCallback;
            if ((chart as any).isReact) { (chart as any).renderReactTemplates(reactCallback); }
        }
    } catch (e) {
        return childElement;
    }
    return childElement;
}
/**
 * Gets the font style.
 *
 * @param {FontModel} font - The font settings.
 * @param {FontModel} themeFontStyle - The theme font settings.
 * @returns {string} - The font style.
 * @private
 */
export function getFontStyle(font: FontModel, themeFontStyle: FontModel): string {
    let style: string = '';
    style = 'font-size:' + (font.size || themeFontStyle.size) +
        '; font-style:' + (font.fontStyle || themeFontStyle.fontStyle) + '; font-weight:' + (font.fontWeight || themeFontStyle.fontWeight) +
        '; font-family:' + font.fontFamily + ';opacity:' + font.opacity +
        '; color:' + font.color + ';';
    return style;
}
/**
 * Measures the bounding rectangle of an HTML element.
 *
 * @param {HTMLElement} element - The HTML element to measure.
 * @param {boolean} redraw - Indicates whether to redraw.
 * @param {boolean} isReactCallback - Indicates whether it's a React callback.
 * @returns {ClientRect} - The bounding rectangle of the element.
 * @private
 */
export function measureElementRect(element: HTMLElement, redraw: boolean = false, isReactCallback?: boolean): ClientRect {
    if (!isReactCallback) { // If the element is already in DOM, no need to append in the body.
        document.body.appendChild(element);
    }
    const bounds: ClientRect = element.getBoundingClientRect();
    if (redraw) {
        remove(element);
    } else if (!isReactCallback) { // for react chart data label template - (callback function)
        removeElement(element.id);
    }
    return bounds;
}
/**
 * Finds an element in a NodeList based on its id.
 *
 * @param {NodeList} elements - The NodeList to search.
 * @param {string} id - The id of the element to find.
 * @returns {Element} - The found element.
 * @private
 */
export function findlElement(elements: NodeList, id: string): Element {
    let element: Element;
    for (let i: number = 0, length: number = elements.length; i < length; i++) {
        if ((<Element>elements[i as number]).id.indexOf(id) > -1) {
            element = <Element>elements[i as number];
            continue;
        }
    }
    return element;
}
/**
 * Gets the point on the chart based on the provided coordinates and axes.
 *
 * @param {number} x - The x-coordinate of the point.
 * @param {number} y - The y-coordinate of the point.
 * @param {Axis} xAxis - The x-axis of the chart.
 * @param {Axis} yAxis - The y-axis of the chart.
 * @param {boolean} isInverted - Indicates whether the chart is inverted.
 * @returns {ChartLocation} - The calculated point.
 * @private
 */
export function getPoint(x: number, y: number, xAxis: Axis, yAxis: Axis, isInverted?: boolean): ChartLocation {
    x = ((xAxis.valueType === 'Logarithmic') ?
        logBase(((x > 0) ? x : Math.pow(xAxis.logBase, xAxis.visibleRange.min)), xAxis.logBase) : x);
    y = ((yAxis.valueType === 'Logarithmic') ?
        logBase(((y > 0) ? y : Math.pow(yAxis.logBase, yAxis.visibleRange.min)), yAxis.logBase) : y);

    x = valueToCoefficient(x, xAxis);
    y = valueToCoefficient(y, yAxis);

    const xLength: number = (isInverted ? xAxis.rect.height : xAxis.rect.width);
    const yLength: number = (isInverted ? yAxis.rect.width : yAxis.rect.height);

    const locationX: number = isInverted ? y * (yLength) : x * (xLength);
    const locationY: number = isInverted ? (1 - x) * (xLength) : (1 - y) * (yLength);
    return new ChartLocation(locationX, locationY);
}
/**
 * Appends an element to a parent element.
 *
 * @param {Element} child - The child element to be appended.
 * @param {Element} parent - The parent element to which the child element will be appended.
 * @param {boolean} [redraw=false] - A boolean value indicating whether to redraw. Default is false.
 * @param {boolean} [animate=false] - A boolean value indicating whether to animate the appending operation. Default is false.
 * @param {string} [x='x'] - The x-coordinate for the position of the child element. Default is 'x'.
 * @param {string} [y='y'] - The y-coordinate for the position of the child element. Default is 'y'.
 * @param {number} duration - duration of the animation
 * @returns {void}
 */
export function appendElement(
    child: Element, parent: Element, redraw: boolean = false, animate: boolean = false,
    x: string = 'x', y: string = 'y', duration?: number
): void {
    if (child && child.hasChildNodes() && parent) {
        appendChildElement(false, parent, child, redraw, animate, x, y, undefined, undefined, undefined, undefined, undefined, duration);
    } else {
        return null;
    }
}
/**
 * Method to append child element.
 *
 * @param {boolean} isCanvas - canvas mode value
 * @param {Element | HTMLElement} parent - parent element
 * @param {Element | HTMLElement} childElement - childElement element
 * @param {boolean} redraw - chart redraw value
 * @param {boolean} isAnimate - animation value
 * @param {string} x - x position
 * @param {string} y - y position
 * @param {ChartLocation} start - start location value
 * @param {string} direction - direction of the element
 * @param {boolean} forceAnimate - forceAnimate
 * @param {boolean} isRect - isRect
 * @param {Rect} previousRect - previousRect
 * @param {number} animateDuration - duration of the animation
 * @param {boolean} scatterElement - The scatter element.
 * @param {number} angle - The angle of the element.
 * @param {ChartLocation} currentTransform - The current transform of the element.
 * @param {string} previousTranslate - The previous translate of the element.
 * @returns {void}
 * @private
 */
export function appendChildElement(
    isCanvas: boolean,
    parent: Element | HTMLElement, childElement: Element | HTMLElement,
    redraw?: boolean, isAnimate: boolean = false, x: string = 'x', y: string = 'y',
    start?: ChartLocation, direction?: string, forceAnimate: boolean = false,
    isRect: boolean = false, previousRect: Rect = null, animateDuration?: number, scatterElement: boolean = false,
    angle: number = 0, currentTransform?: ChartLocation, previousTranslate?: string
): void {
    if (isCanvas) {
        return null;
    }
    const existChild: HTMLElement = scatterElement ? null : parent.querySelector('#' + childElement.id);
    const element: HTMLElement = <HTMLElement>(existChild || getElement(childElement.id));
    const child: HTMLElement = <HTMLElement>childElement;
    const duration: number = !isNullOrUndefined(animateDuration) ? animateDuration : 300;
    if (redraw && isAnimate && element) {
        start = start || (element.tagName === 'DIV' ?
            new ChartLocation(+(element.style[x as string].split('px')[0]), +(element.style[y as string].split('px')[0])) :
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
            const end: ChartLocation = child.tagName === 'DIV' ?
                new ChartLocation(+(child.style[x as string].split('px')[0]), +(child.style[y as string].split('px')[0])) :
                new ChartLocation(+child.getAttribute(x), +child.getAttribute(y));
            const previousTranform: string = element.getAttribute('transform');
            animateRedrawElement(child, duration, start, end, x, y, angle, currentTransform, previousTranslate !== undefined ? new ChartLocation(previousTranslate.match(/\d+/g).map(Number)[0], previousTranslate.match(/\d+/g).map(Number)[1]) : previousTranform ? new ChartLocation(parseFloat(previousTranform.split(',')[1]), parseFloat(previousTranform.split(',')[2])) : new ChartLocation(0, 0), previousTranslate !== undefined);
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
/**
 * Calculates the location of the dragged rectangle.
 *
 * @param {number} x1 - The x-coordinate of the starting point.
 * @param {number} y1 - The y-coordinate of the starting point.
 * @param {number} x2 - The x-coordinate of the ending point.
 * @param {number} y2 - The y-coordinate of the ending point.
 * @param {Rect} outerRect - The outer rectangle containing the dragged rectangle.
 * @returns {Rect} - The location of the dragged rectangle.
 * @private
 */
export function getDraggedRectLocation(x1: number, y1: number, x2: number, y2: number, outerRect: Rect): Rect {
    const width: number = Math.abs(x1 - x2);
    const height: number = Math.abs(y1 - y2);
    const x: number = Math.max(checkBounds(Math.min(x1, x2), width, outerRect.x, outerRect.width), outerRect.x);
    const y: number = Math.max(checkBounds(Math.min(y1, y2), height, outerRect.y, outerRect.height), outerRect.y);
    return new Rect(x, y, Math.min(width, outerRect.width), Math.min(height, outerRect.height));
}
/**
 * Checks if a value is within bounds defined by minimum and maximum values.
 *
 * @param {number} start - The start value.
 * @param {number} size - The size of the value.
 * @param {number} min - The minimum value of the bound.
 * @param {number} max - The maximum value of the bound.
 * @returns {number} - The adjusted value within the bounds.
 * @private
 */
export function checkBounds(start: number, size: number, min: number, max: number): number {
    if (start < min) {
        start = min;
    } else if ((start + size) > (max + min)) {
        start = (max + min) - size;
    }
    return start;
}
/**
 * Retrieves label text for a data point.
 *
 * @param {Points} currentPoint - The current data point.
 * @param {Series} series - The series to which the data point belongs.
 * @param {Chart} chart - The chart instance.
 * @returns {string[]} - The label text.
 * @private
 */
export function getLabelText(currentPoint: Points, series: Series, chart: Chart): string[] {
    const labelFormat: string = series.marker.dataLabel.format ? series.marker.dataLabel.format : series.yAxis.labelFormat;
    const text: string[] = [];
    const customLabelFormat: boolean = labelFormat.match('{value}') !== null;
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
        for (const liers of currentPoint.outliers) {
            text.push(currentPoint.text || liers.toString());
        }
        break;

    }
    if ((labelFormat || chart.useGroupingSeparator) && !currentPoint.text) {
        series.yAxis.format = chart.intl.getNumberFormat({
            format: customLabelFormat ? '' : labelFormat,
            useGrouping: chart.useGroupingSeparator
        });
        for (let i: number = 0; i < text.length; i++) {
            text[i as number] = customLabelFormat ? labelFormat.replace('{value}', series.yAxis.format(parseFloat(text[i as number]))) :
                series.yAxis.format(parseFloat(text[i as number]));
        }
    }
    return text;
}
/**
 * Stops the specified timer.
 *
 * @param {number} timer - The timer to stop.
 * @returns {void}
 */
export function stopTimer(timer: number): void {
    window.clearInterval(timer);
}
/**
 * Checks if the specified rect collides with any of the rect in the collection within the given clip rect.
 *
 * @param {Rect} rect - The rect to check for collision.
 * @param {Rect[]} collections - The collection of rect to check against.
 * @param {Rect} clipRect - The clip rect.
 * @returns {boolean} - Returns true if collision occurs; otherwise, false.
 */
export function isCollide(rect: Rect, collections: Rect[], clipRect: Rect): boolean {
    const currentRect: Rect = new Rect(rect.x + clipRect.x, rect.y + clipRect.y, rect.width, rect.height);
    const isCollide: boolean = collections.some((rect: Rect) => {
        return (currentRect.x < rect.x + rect.width && currentRect.x + currentRect.width > rect.x &&
            currentRect.y < rect.y + rect.height && currentRect.height + currentRect.y > rect.y);
    });
    return isCollide;
}
/**
 * Checks if the specified rect overlap each other.
 *
 * @param {Rect} currentRect - The first rect.
 * @param {Rect} rect - The second rect.
 * @returns {boolean} - Returns true if the rect overlap; otherwise, false.
 */
export function isOverlap(currentRect: Rect, rect: Rect): boolean {
    return (currentRect.x < rect.x + rect.width && currentRect.x + currentRect.width > rect.x &&
        currentRect.y < rect.y + rect.height && currentRect.height + currentRect.y > rect.y);
}

/**
 * Checks if the specified rect is completely contained within another rect.
 *
 * @param {Rect} currentRect - The rect to check if it's contained.
 * @param {Rect} rect - The containing rect.
 * @returns {boolean} - Returns true if the specified rect is completely contained within the containing rect; otherwise, false.
 */
export function containsRect(currentRect: Rect, rect: Rect): boolean {
    return (currentRect.x <= rect.x && currentRect.x + currentRect.width >= rect.x + rect.width &&
        currentRect.y <= rect.y && currentRect.height + currentRect.y >= rect.y + rect.height);
}

/**
 * Calculates the rect based on the specified location, text size, and margin.
 *
 * @param {ChartLocation} location - The location of the rect.
 * @param {Size} textSize - The size of the text.
 * @param {MarginModel} margin - The margin to be applied around the text.
 * @returns {Rect} - Returns the calculated rect.
 */
export function calculateRect(location: ChartLocation, textSize: Size, margin: MarginModel): Rect {
    return new Rect(
        (location.x - (textSize.width / 2) - margin.left),
        (location.y - (textSize.height / 2) - margin.top),
        textSize.width + margin.left + margin.right,
        textSize.height + margin.top + margin.bottom
    );
}
/**
 * Converts the color value to hexadecimal code.
 *
 * @param {ColorValue} value - The color value to convert.
 * @returns {string} - Returns the hexadecimal representation of the color.
 */
export function convertToHexCode(value: ColorValue): string {
    return '#' + componentToHex(value.r) + componentToHex(value.g) + componentToHex(value.b);
}
/**
 * Converts a component value to its hexadecimal representation.
 *
 * @param {number} value - The component value to convert.
 * @returns {string} - Returns the hexadecimal representation of the component.
 */
export function componentToHex(value: number): string {
    const hex: string = value.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}

/**
 * Converts a hexadecimal color code to its RedGreenBlue representation.
 *
 * @param {string} hex - The hexadecimal color code to convert.
 * @returns {ColorValue} - Returns the RedGreenBlue representation of the hexadecimal color code.
 */
export function convertHexToColor(hex: string): ColorValue {
    const result: RegExpExecArray = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? new ColorValue(parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)) :
        new ColorValue(255, 255, 255);
}
/**
 * Converts a color name to its corresponding hexadecimal color code.
 *
 * @param {string} color - The color name to convert.
 * @returns {string} - Returns the hexadecimal color code.
 */
export function colorNameToHex(color: string): string {
    color = color === 'transparent' ? 'white' : color;
    document.body.appendChild(createElement('text', { id: 'chartmeasuretext' }));
    const element: HTMLElement = document.getElementById('chartmeasuretext');
    element.style.color = color;
    color = window.getComputedStyle(element).color;
    remove(element);
    let isRGBValue: string[];
    if (color.indexOf('rgb') === 0 || color.indexOf('hsl') === 0) {
        color = color.replace(/\s/g, '').replace(/[()]/g, '');
        isRGBValue = color.slice(3).split(',');
    }
    return convertToHexCode(
        new ColorValue(parseInt(isRGBValue[0], 10), parseInt(isRGBValue[1], 10), parseInt(isRGBValue[2], 10))
    );
}
/**
 * Checks if the provided color string is in a valid format.
 *
 * @param {string} color - The color string to check.
 * @returns {boolean} - Returns true if the color string is in a valid format, otherwise returns false.
 */
export function checkColorFormat(color: string): boolean {
    if (color.indexOf('rgba(') === 0 || color.indexOf('rgb(') === 0) {
        const rgbaValues: string[] = color.substring(color.indexOf('(') + 1, color.lastIndexOf(')')).split(',');
        if (rgbaValues.length === 3 || rgbaValues.length === 4) {
            return rgbaValues.every((val: string) => {
                const num: number = parseFloat(val);
                return !isNaN(num) && num >= 0 && num <= 255;
            });
        }
    } else if (color.indexOf('#') === 0) {
        const hex: string = color.substring(1);
        return (hex.length === 3 || hex.length === 6) && /^[0-9A-Fa-f]{3,6}$/.test(hex);
    }
    return false;
}
/**
 * Gets the color with adjusted saturation.
 *
 * @param {string} color - The input color string.
 * @param {number} factor - The factor by which to adjust the saturation.
 * @returns {string} - The modified color string.
 */
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
/**
 * Applies a lightness adjustment to the given color.
 *
 * @param {string} color - The input color string.
 * @param {number} value - The value by which to adjust the lightness.
 * @returns {string} - The modified color string.
 */
export function applyZLight(color: string, value: number): string {
    const RGB: ColorValue = convertHexToColor(color);
    RGB.r = parseInt(Math.floor(RGB.r * value).toString(), 10);
    RGB.g = parseInt(Math.floor(RGB.g * value).toString(), 10);
    RGB.b = parseInt(Math.floor(RGB.b * value).toString(), 10);
    return '#' + componentToHex(RGB.r).toUpperCase() + componentToHex(RGB.g).toUpperCase() + componentToHex(RGB.b).toUpperCase();
}
/**
 * Calculates the median value of an array of numbers.
 *
 * @param {number[]} values - The array of numbers.
 * @returns {number} - The median value.
 */
export function getMedian(values: number[]): number {
    const half: number = Math.floor(values.length / 2);
    return values.length % 2 ? values[half as number] : ((values[half - 1] + values[half as number]) / 2.0);
}
/**
 * Calculates the legend shapes based on the provided parameters.
 *
 * @param {ChartLocation} location - The location to position the legend shape.
 * @param {Size} size - The size of the legend shape.
 * @param {string} shape - The shape of the legend.
 * @param {PathOption} options - The options for drawing the legend shape.
 * @returns {IShapes} - The calculated legend shape.
 */
export function calculateLegendShapes(location: ChartLocation, size: Size, shape: string, options: PathOption): IShapes {
    const padding: number = 10;
    let dir: string = '';
    const space: number = 2;
    const height: number = size.height;
    const width: number = size.width;
    const lx: number = location.x;
    const ly: number = location.y;
    switch (shape) {
    case 'MultiColoredLine':
    case 'Line':
    case 'StackingLine':
    case 'StackingLine100':
        dir = 'M' + ' ' + (lx + (-width * (3 / 4))) + ' ' + (ly) + ' ' +
                'L' + ' ' + (lx + (width * (3 / 4))) + ' ' + (ly);
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
    case 'UpArrow':
        options.fill = options.stroke;
        options.stroke = 'transparent';
        dir = 'M' + ' ' + (lx + (-width / 2)) + ' ' + (ly + (height / 2)) + ' ' +
                'L' + ' ' + (lx) + ' ' + (ly - (height / 2)) + ' ' +
                'L' + ' ' + (lx + (width / 2)) + ' ' + (ly + (height / 2)) +
                'L' + ' ' + (lx + (width / 2) - space) + ' ' + (ly + (height / 2)) + ' ' +
                'L' + ' ' + (lx) + ' ' + (ly - (height / 2) + (2 * space)) +
                'L' + (lx - (width / 2) + space) + ' ' + (ly + (height / 2)) + ' Z';
        merge(options, { 'd': dir });
        break;
    case 'DownArrow':
        dir = 'M' + ' ' + (lx - (width / 2)) + ' ' + (ly - (height / 2)) + ' ' +
                'L' + ' ' + (lx) + ' ' + (ly + (height / 2)) + ' ' +
                'L' + ' ' + (lx + (width / 2)) + ' ' + (ly - (height / 2)) +
                'L' + ' ' + (lx + (width / 2) - space) + ' ' + (ly - (height / 2)) + ' ' +
                'L' + ' ' + (lx) + ' ' + (ly + (height / 2) - (2 * space)) +
                'L' + (lx - (width / 2) + space) + ' ' + (ly - (height / 2)) + ' Z';
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
    case 'SplineRangeArea':
        dir = 'M' + ' ' + (lx - (width / 2)) + ' ' + (ly + (height / 5)) + ' ' + 'Q' + ' ' + lx
                + ' ' + (ly - height) + ' ' + lx + ' ' + (ly + (height / 5)) + ' ' + 'Z' + ' ' + 'M'
                + ' ' + lx + ' ' + (ly + (height / 5)) + ' ' + 'Q' + ' ' + (lx + (width / 2)) + ' '
                + (ly + (height / 2)) + ' ' + (lx + (width / 2)) + ' '
                + (ly - (height / 2)) + ' ' + ' Z';
        merge(options, { 'd': dir });
        break;
    case 'Pie':
    case 'Doughnut': {
        options.stroke = 'transparent';
        const r: number = Math.min(height, width) / 2;
        dir = getAccumulationLegend(lx, ly, r, height, width);
        merge(options, { 'd': dir });
        break;
    }
    }
    return { renderOption: options };
}
/**
 * Trims the text to fit within the specified maximum width.
 *
 * @param {number} maxWidth - The maximum width for the text.
 * @param {string} text - The text to be trimmed.
 * @param {FontModel} font - The font settings for the text.
 * @param {boolean} isRtlEnabled - Indicates whether right-to-left text rendering is enabled.
 * @param {FontModel} [themeFontStyle] - The font style to be used for theme-specific settings.
 * @returns {string} - The trimmed text.
 */
export function textTrim(maxWidth: number, text: string, font: FontModel, isRtlEnabled: boolean, themeFontStyle?: FontModel): string {
    let label: string = text;
    let size: number = measureText(text, font, themeFontStyle).width;
    if (size > maxWidth) {
        const textLength: number = text.length;
        for (let i: number = textLength - 1; i >= 0; --i) {
            label = isRtlEnabled ? '...' + text.substring(0, i) : text.substring(0, i) + '...';
            size = measureText(label, font, themeFontStyle).width;
            if (size <= maxWidth) {
                return label;
            }
        }
    }
    return label;
}
/**
 * Trims the text and performs line breaks based on the maximum width and font settings.
 *
 * @param {number} maxWidth - The maximum width allowed for the text.
 * @param {string} text - The text to be trimmed.
 * @param {FontModel} font - The font settings for the text.
 * @param {FontModel} [themeFontStyle] - Optional. The font style based on the theme.
 * @returns {string[]} - An array of trimmed text lines with line breaks.
 */
export function lineBreakLabelTrim(maxWidth: number, text: string, font: FontModel, themeFontStyle?: FontModel): string[] {
    const labelCollection: string[] = [];
    const breakLabels: string[] = text.split('<br>');
    for (let i: number = 0; i < breakLabels.length; i++) {
        text = breakLabels[i as number];
        let size: number = measureText(text, font, themeFontStyle).width;
        if (size > maxWidth) {
            const textLength: number = text.length;
            for (let i: number = textLength - 1; i >= 0; --i) {
                text = text.substring(0, i) + '...';
                size = measureText(text, font, themeFontStyle).width;
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
/**
 * Converts a string value to a number, considering the container size for percentage values.
 *
 * @param {string} value - The string value to convert to a number.
 * @param {number} containerSize - The size of the container, used for percentage values.
 * @returns {number} - The converted numeric value.
 */
export function stringToNumber(value: string, containerSize: number): number {
    if (value !== null && value !== undefined) {
        return value.indexOf('%') !== -1 ? (containerSize / 100) * parseInt(value, 10) : parseInt(value, 10);
    }
    return null;
}
/**
 * Redraws the SVG or canvas element based on the provided options.
 *
 * @param {boolean} redraw - Specifies whether to redraw the element.
 * @param {string} id - The id of the element to redraw.
 * @param {PathAttributes | RectAttributes | CircleAttributes} [options] - The attributes of the element to redraw.
 * @param {SvgRenderer | CanvasRenderer} [renderer] - The renderer to use for redrawing.
 * @returns {Element} - The redrawn element.
 */
export function redrawElement(
    redraw: boolean, id: string, options?: PathAttributes | RectAttributes | CircleAttributes,
    renderer?: SvgRenderer | CanvasRenderer
): Element {
    if (!redraw) {
        return null;
    }
    const element: Element = getElement(id);
    if (element && options) {
        renderer.setElementAttributes(
            options as SVGCanvasAttributes,
            element.tagName === 'clipPath' ? <Element>element.childNodes[0] : element
        );
    }
    return element;
}
/**
 * Animates the redrawn element from its start to end location over a specified duration.
 *
 * @param {Element | HTMLElement} element - The element to animate.
 * @param {number} duration - The duration of the animation in milliseconds.
 * @param {ChartLocation} start - The start location of the element.
 * @param {ChartLocation} end - The end location of the element.
 * @param {string} [x='x'] - The attribute representing the horizontal position of the element.
 * @param {string} [y='y'] - The attribute representing the vertical position of the element.
 * @param {number} [angle=0] - The angle of rotation for the element.
 * @param {ChartLocation} [newTransform=new ChartLocation(0, 0)] - The new transform location of the element.
 * @param {ChartLocation} [previousTransform=new ChartLocation(0, 0)] - The previous transform location of the element.
 * @param {boolean} [pointAnimation] - Specifies the animation based on points.
 * @returns {void}
 */
export function animateRedrawElement(
    element: Element | HTMLElement, duration: number, start: ChartLocation, end: ChartLocation,
    x: string = 'x', y: string = 'y', angle: number = 0, newTransform: ChartLocation = new ChartLocation(0, 0), previousTransform: ChartLocation = new ChartLocation(0, 0), pointAnimation?: boolean
): void {
    const isDiv: boolean = element.tagName === 'DIV';
    const setStyle: Function = (xValue: number, yValue: number, rotateX?: number, rotateY?: number): void => {
        if (isDiv) {
            (element as HTMLElement).style[x as string] = xValue + 'px';
            (element as HTMLElement).style[y as string] = yValue + 'px';
        } else {
            element.setAttribute(x, xValue + '');
            element.setAttribute(y, yValue + '');
            if (angle && newTransform.x && newTransform.y && previousTransform.x && previousTransform.y && rotateX && rotateY) {
                element.setAttribute('transform', 'rotate(' + angle + ',' + rotateX + ',' + rotateY + ')');
            }
            if (pointAnimation) {
                element.setAttribute('transform', 'translate(' + rotateX + ',' + rotateY + ')');
            }
        }
    };
    setStyle(start.x, start.y, previousTransform.x, previousTransform.y);
    new Animation({}).animate(createElement('div'), {
        duration: duration,
        progress: (args: AnimationOptions): void => {
            setStyle(
                linear(args.timeStamp, start.x, end.x - start.x, args.duration),
                linear(args.timeStamp, start.y, end.y - start.y, args.duration),
                linear(args.timeStamp, previousTransform.x, newTransform.x - previousTransform.x, args.duration),
                linear(args.timeStamp, previousTransform.y, newTransform.y - previousTransform.y, args.duration)
            );
        },
        end: (): void => {
            setStyle(end.x, end.y, newTransform.x, newTransform.y);
        }
    });
}

/**
 * Animates the text content of an HTML element from a start value to an end value over a specified duration.
 *
 * @param {HTMLElement} element - The HTML element whose text content will be animated.
 * @param {number} duration - The duration of the animation in milliseconds.
 * @param {number} start - The starting value of the animation.
 * @param {number} end - The ending value of the animation.
 * @param {string} customLabelFormat - A custom format string that includes a placeholder for the value.
 * @returns {void}
 */
export function animateTextElement(element: HTMLElement, duration: number, start: number, end: number, customLabelFormat: string): void {
    if (element && start && end) {
        const formatText: (value: number) => string = (value: number): string => {
            return customLabelFormat ? customLabelFormat.replace('{value}', value.toString()) : value.toString();
        };
        new Animation({}).animate(createElement('div'), {
            duration: duration,
            progress: (args: AnimationOptions): void => {
                element.style.animation = '';
                const progress: number = args.timeStamp / args.duration;
                let currentValue: number = start + (end - start) * progress;
                if (start % 1 !== 0 || end % 1 !== 0) {
                    currentValue = parseFloat(currentValue.toFixed(1));
                }
                else {
                    currentValue = Math.round(currentValue);
                }
                element.textContent = formatText(currentValue);
            },
            end: (): void => {
                element.textContent = formatText(end);
            }
        });
    }
}

/**
 * Renders a text element using the specified renderer and options.
 *
 * @param {SvgRenderer | CanvasRenderer} renderer - The renderer used for rendering.
 * @param {TextOption} option - The options for the text element.
 * @param {FontModel} font - The font settings for the text.
 * @param {string} color - The color of the text.
 * @param {HTMLElement | Element} parent - The parent element to which the text element is appended.
 * @param {boolean} [isMinus=false] - Indicates whether the text represents a negative value.
 * @param {boolean} [redraw] - Indicates whether to redraw the element.
 * @param {boolean} [isAnimate] - Indicates whether to animate the element.
 * @param {boolean} [forceAnimate=false] - Indicates whether to force animation.
 * @param {number} [animateDuration] - The duration of the animation in milliseconds.
 * @param {Rect} [seriesClipRect] - The clipping rectangle for the series.
 * @param {Size} [labelSize] - The size of the label.
 * @param {boolean} [isRotatedLabelIntersect] - Indicates whether rotated labels intersect.
 * @param {boolean} [isCanvas] - Indicates whether the rendering is done on a canvas.
 * @param {boolean} [isDataLabelWrap] - Indicates whether data labels are wrapped.
 * @param {FontModel} [themeFontStyle] - The font settings based on the theme.
 * @param {ChartLocation} [transform] - The location to transform the text element.
 * @param {string} [previousTransform] - The previous transform of the text element.
 * @returns {Element} - The rendered text element.
 */
export function textElement(
    renderer: SvgRenderer | CanvasRenderer, option: TextOption, font: FontModel, color: string,
    parent: HTMLElement | Element, isMinus: boolean = false, redraw?: boolean, isAnimate?: boolean,
    forceAnimate: boolean = false, animateDuration?: number, seriesClipRect?: Rect,
    labelSize?: Size, isRotatedLabelIntersect?: boolean, isCanvas?: boolean, isDataLabelWrap?: boolean, themeFontStyle?: FontModel,
    transform?: ChartLocation, previousTransform?: string
): Element {
    let renderOptions: Object = {};
    let tspanElement: Element;
    //let renderer: SvgRenderer = new SvgRenderer('');
    let height: number;
    let dy: number;
    let label: string;
    let width: number = 0;
    let dx: number;
    let maxWidth: number = 0;
    if (option.text.length > 1 && isDataLabelWrap) {
        for (let i: number = 0, len: number = option.text.length; i < len; i++) {
            maxWidth = Math.max(maxWidth, measureText(option.text[i as number], font, themeFontStyle).width);
        }
        width = measureText(option.text[0], font, themeFontStyle).width;
    }
    dx = (option.text.length > 1 && isDataLabelWrap) ? (option.x + maxWidth / 2 - width / 2) : option.x;
    renderOptions = {
        'id': option.id,
        'x': dx,
        'y': option.y,
        'fill': color ? color : 'black',
        'font-size': font.size || themeFontStyle.size,
        'font-style': font.fontStyle || themeFontStyle.fontStyle,
        'font-family': font.fontFamily || themeFontStyle.fontFamily,
        'font-weight': font.fontWeight || themeFontStyle.fontWeight,
        'text-anchor': option.anchor,
        'labelRotation': option.labelRotation,
        'transform': option.transform,
        'opacity': font.opacity,
        'dominant-baseline': option.baseLine
    };
    const text: string = typeof option.text === 'string' ? option.text : isMinus ? option.text[option.text.length - 1] : option.text[0];
    const transX: number = seriesClipRect ? seriesClipRect.x : 0;
    const transY: number = seriesClipRect ? seriesClipRect.y : 0;
    const htmlObject: HTMLElement = renderer.createText(renderOptions, text, transX, transY) as HTMLElement;
    if (typeof option.text !== 'string' && option.text.length > 1) {
        for (let i: number = 1, len: number = option.text.length; i < len; i++) {
            height = (measureText(option.text[i as number], font, themeFontStyle).height);
            width = measureText(option.text[i as number], font, themeFontStyle).width;
            dy = (option.y) + ((isMinus) ? -(i * height) : (i * height));
            dx = isDataLabelWrap ? (option.x + maxWidth / 2 - width / 2) : option.x;
            label = isMinus ? option.text[option.text.length - (i + 1)] : option.text[i as number];
            if (isCanvas) {
                tspanElement = renderer.createText(renderOptions, label, null, null, dy, true);
            } else {
                tspanElement = (renderer as SvgRenderer).createTSpan(
                    {
                        'x': dx, 'id': option.id,
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
            forceAnimate, false, null, animateDuration, false, option.labelRotation, transform, previousTransform
        );
    }
    return htmlObject;
}

/**
 * Calculates the size of the chart.
 *
 * @param {Chart | AccumulationChart | RangeNavigator | StockChart | Chart3D | CircularChart3D} chart - The chart for which to calculate the size.
 * @returns {void}
 */
export function calculateSize(chart: Chart | AccumulationChart | RangeNavigator | StockChart | Chart3D | CircularChart3D): void {
    // fix for Chart rendered with default width in IE issue
    let containerWidth: number = chart.element.clientWidth || chart.element.offsetWidth;
    let containerHeight: number = chart.element.clientHeight;
    if ((chart as Chart).stockChart) {
        containerWidth = (chart as Chart).stockChart.availableSize.width;
        containerHeight = (chart as Chart).stockChart.availableSize.height;
    }
    let height: number = 450;
    let marginHeight: number;
    if (chart.getModuleName() === 'rangeNavigator') {
        const range: RangeNavigator = chart as RangeNavigator;
        const tooltipSpace: number = range.tooltip.enable ? 35 : 0;
        const periodHeight: number = range.periodSelectorSettings.periods.length ?
            range.periodSelectorSettings.height : 0;
        marginHeight = range.margin.top + range.margin.bottom + tooltipSpace;
        const labelSize: number = measureText('tempString', range.labelStyle, range.themeStyle.axisLabelFont).height;
        const labelPadding: number = 15;
        height = (chart.series.length ? (Browser.isDevice ? 80 : 120) : ((range.enableGrouping ? (40 + labelPadding + labelSize) : 40)
            + marginHeight)) + periodHeight;
        if (range.disableRangeSelector) {
            height = periodHeight;
        }
        if ((chart as RangeNavigator).stockChart && (chart as RangeNavigator).stockChart.chart.axisCollections[1].labelPosition === 'Outside') {
            const padding: number = (chart as RangeNavigator).stockChart.chart.axisCollections[1].labelPadding +
                (chart as RangeNavigator).stockChart.chart.axisCollections[1].lineStyle.width * 0.5;
            chart.width = ((chart as RangeNavigator).stockChart.availableSize.width -
                ((chart as RangeNavigator).stockChart.chart.axisCollections[1].maxLabelSize.width + padding)).toString();
        }
    }
    chart.availableSize = new Size(
        stringToNumber(chart.width, containerWidth) || containerWidth || 600,
        stringToNumber(chart.height, containerHeight || height) || containerHeight || height
    );
    if (chart.getModuleName() === 'chart') {
        let scaleX: number = 1; let scaleY: number = 1;
        if (chart.width === '' || chart.width === null || chart.width === '100%') {
            if (containerWidth && chart.element.parentElement && chart.element.parentElement.style.transform.indexOf('scale') > -1) {
                scaleX = 1;
            }
            else {
                scaleX = chart.element.getBoundingClientRect().width > 0 ?
                    chart.element.getBoundingClientRect().width / chart.availableSize.width : 1;
            }
            if (containerHeight && chart.element.parentElement && chart.element.parentElement.style.transform.indexOf('scale') > -1) {
                scaleY = 1;
            } else {
                scaleY = chart.element.getBoundingClientRect().height > 0 ?
                    chart.element.getBoundingClientRect().height / chart.availableSize.height : 1;
            }
            const transformValue: string = chart.element.style.transform;
            if (transformValue) {
                const scaleValue: number = parseFloat(transformValue.match(/scale\((.*?)\)/)[1]);
                scaleX = scaleValue ? scaleX / scaleValue : scaleX;
                scaleY = scaleValue ? scaleY / scaleValue : scaleY;
            }
            chart.availableSize.width = chart.availableSize.width * scaleX;
            chart.availableSize.height = chart.availableSize.height * scaleY;
        }
        (chart as Chart).scaleX = scaleX;
        (chart as Chart).scaleY = scaleY;
    }
}
/**
 * Creates an SVG element for the specified chart or chart element.
 *
 * @param {Chart | AccumulationChart | RangeNavigator | Chart3D | CircularChart3D} chart - The chart or chart element for which to create the SVG element.
 * @returns {void}
 */
export function createSvg(chart: Chart | AccumulationChart | RangeNavigator | Chart3D | CircularChart3D): void {
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
    if ((chart as Chart).enableCanvas) {
        (chart.renderer as CanvasRenderer).ctx.direction = chart.enableRtl ? 'rtl' : 'ltr';
    }
}

/**
 * Gets the title text with specified style and width, and supports right-to-left rendering.
 *
 * @param {string} title - The title text.
 * @param {FontModel} style - The font style for the title.
 * @param {number} width - The width available for rendering the title.
 * @param {boolean} isRtlEnabled - Specifies whether right-to-left rendering is enabled.
 * @param {FontModel} [themeFontStyle] - The font style used for theme rendering.
 * @returns {string[]} An array of strings containing the title text with line breaks if needed.
 */
export function getTitle(title: string, style: FontModel, width: number, isRtlEnabled: boolean, themeFontStyle?: FontModel): string[] {
    let titleCollection: string[] = [];
    switch (style.textOverflow) {
    case 'Wrap':
        titleCollection = textWrap(title, width, style, isRtlEnabled, title.indexOf(' ') < 0 ? true : null, null, themeFontStyle);
        break;
    case 'Trim':
        titleCollection.push(textTrim(width, title, style, isRtlEnabled, themeFontStyle));
        break;
    default:
        titleCollection.push(title);
        break;
    }
    return titleCollection;
}

/**
 * Calculates the x-coordinate position for rendering the title text within the specified rect.
 *
 * @param {Rect} rect - The rect within which the title text is to be rendered.
 * @param {FontModel} titleStyle - The font style used for rendering the title text.
 * @returns {number} The x-coordinate position for rendering the title text.
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
 * Wraps the input text into multiple lines based on the specified maximum width and font style.
 *
 * @param {string} currentLabel - The text to be wrapped.
 * @param {number} maximumWidth - The maximum width allowed for each line of text.
 * @param {FontModel} font - The font style used for rendering the text.
 * @param {boolean} isRtlEnabled - Specifies whether right-to-left text direction is enabled.
 * @param {boolean} [wrapAnyWhere=false] - Indicates whether the text can be wrapped at any position.
 * @param {boolean} [clip=false] - Specifies whether text exceeding the maximum width should be clipped.
 * @param {FontModel} [themeFontStyle] - The font style used as the base for the text wrapping operation.
 * @returns {string[]} An array of strings representing the wrapped lines of text.
 */
export function textWrap(currentLabel: string, maximumWidth: number, font: FontModel, isRtlEnabled : boolean, wrapAnyWhere ?: boolean,
                         clip ?: boolean, themeFontStyle?: FontModel): string[] {
    if (wrapAnyWhere) {
        return (textWrapAnyWhere(currentLabel, maximumWidth, font, themeFontStyle));
    }
    else {
        const textCollection: string[] = currentLabel.split(' ');
        let label: string = '';
        const labelCollection: string[] = [];
        let text: string;
        for (let i: number = 0, len: number = textCollection.length; i < len; i++) {
            text = textCollection[i as number];
            if (measureText(label.concat(label === '' ? '' : ' ' + text), font, themeFontStyle).width < maximumWidth) {
                label = label.concat((label === '' ? '' : ' ') + text);
            } else {
                if (label !== '') {
                    labelCollection.push(clip ? label : textTrim(maximumWidth, label, font, isRtlEnabled, themeFontStyle));
                    label = text;
                } else {
                    labelCollection.push(clip ? text : textTrim(maximumWidth, text, font, isRtlEnabled, themeFontStyle));
                    text = '';
                }
            }
            if (label && i === len - 1) {
                labelCollection.push(clip ? label : textTrim(maximumWidth, label, font, isRtlEnabled, themeFontStyle));
            }
        }
        return labelCollection;
    }
}
/**
 * Wraps the input text into multiple lines, allowing wrapping at any position.
 *
 * @param {string} currentLabel - The text to be wrapped.
 * @param {number} maximumWidth - The maximum width allowed for each line of text.
 * @param {FontModel} font - The font style used for rendering the text.
 * @param {FontModel} [themeFontStyle] - The font style used as the base for the text wrapping operation.
 * @returns {string[]} An array of strings representing the wrapped lines of text.
 * @private
 */
export function textWrapAnyWhere(currentLabel: string, maximumWidth: number, font: FontModel, themeFontStyle?: FontModel) : string[] {
    let size : number = measureText(currentLabel, font,  themeFontStyle).width;
    const labelCollection: string[] = [];
    if (size > maximumWidth) {
        let label : string = '';
        let startIndex : number = 0;
        let labelIndex : number = 1;
        while (labelIndex < currentLabel.length) {
            label = currentLabel.substring(startIndex, labelIndex);
            size = measureText(label, font, themeFontStyle).width;
            if (size < maximumWidth) {
                labelIndex ++;
            }
            else if (size === maximumWidth) {
                startIndex = labelIndex;
                labelCollection.push(label);
                labelIndex ++;
                label = '';
            }
            else if (size > maximumWidth) {
                label = label.slice(0, -1);
                startIndex = labelIndex - 1;
                labelCollection.push(label);
                label = '';
            }
        }
        if (label.length > 0) {
            labelCollection.push(label);
        }
    }
    else {
        labelCollection.push(currentLabel);
    }
    return labelCollection;
}

/**
 * Gets the Unicode text from the input string based on the provided regular expression.
 *
 * @param {string} text - The input string.
 * @param {RegExp} regexp - The regular expression pattern to match Unicode characters.
 * @returns {string} The Unicode text extracted from the input string.
 */
export function getUnicodeText(text: string, regexp: RegExp): string {
    const title: string = text.replace(regexp, ' ');
    const digit: string[] = text.match(regexp);
    let digitSpecific: string = ' ';
    let convertedText: string = ' ';
    let k: number = 0;
    const unicodeSub: object = {
        '0': '\u2080', '1': '\u2081', '2': '\u2082', '3': '\u2083', '4': '\u2084',
        '5': '\u2085', '6': '\u2086', '7': '\u2087', '8': '\u2088', '9': '\u2089'
    };
    const unicodeSup: object = {
        '0': '\u2070', '1': '\u00B9', '2': '\u00B2', '3': '\u00B3', '4': '\u2074',
        '5': '\u2075', '6': '\u2076', '7': '\u2077', '8': '\u2078', '9': '\u2079'
    };
    for (let i: number = 0; i <= title.length - 1; i++) {
        if (title[i as number] === ' ') {
            digitSpecific = (regexp === regSub) ? digit[k as number].replace(/~/g, '') : digit[k as number].replace(/\^/g, '');
            for (let j: number = 0; j < digitSpecific.length; j++) {
                convertedText += (regexp === regSub) ? unicodeSub[digitSpecific[j as number]] : unicodeSup[digitSpecific[j as number]];
            }
            k++;
        } else {
            convertedText += title[i as number];
        }
    }
    return convertedText.trim();
}

/**
 * Resets the Blazor templates of the given control (Chart or AccumulationChart).
 *
 * @param {Chart | AccumulationChart} control - The control to reset Blazor templates for.
 * @returns {void}
 */
export function blazorTemplatesReset(control: Chart | AccumulationChart): void {
    for (let i: number = 0; i < (control as Chart | AccumulationChart).annotations.length; i++) {
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
        this.stroke = (border.width !== 0 && this.stroke !== '') ? border.color === null ? '' : border.color : 'transparent';
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
export class LabelLocation {
    public x: number = 0;
    public y: number = 0;

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
    public index: number;
    constructor(point: AccPoints, series: AccumulationSeries, index: number = 0) {
        this.point = point;
        this.series = series;
        this.index = index;
    }
}

/** @private */
export class Point3D {

    public point: Chart3DPoint;
    public series: Chart3DSeries;
    /**
     * Initializes a new instance of the Chart3DData class.
     *
     * @param {Chart3DPoint} point - The 3D point object.
     * @param {Chart3DSeries} series - The 3D series object.
     * @private
     */
    constructor(point: Chart3DPoint, series: Chart3DSeries) {
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

/**
 * Gets the color from the range color setting model based on the specified value.
 *
 * @param {RangeColorSettingModel} colorMap - The range color setting model.
 * @param {number} value - The value for which to get the color.
 * @returns {string} - The color corresponding to the specified value.
 */
export function getColorByValue(colorMap: RangeColorSettingModel, value: number): string {
    let color: string = '';
    let rbgColorValue: ColorValue;
    if (Number(value) === colorMap.start) {
        color = colorMap.colors[0];
    } else if (Number(value) === colorMap.end) {
        color = colorMap.colors[colorMap.colors.length - 1];
    } else {
        rbgColorValue = getGradientColor(Number(value), colorMap);
        color = convertToHexCode(rbgColorValue);
    }
    return color;
}

/**
 * Gets the gradient color from the range color setting model based on the specified value.
 *
 * @param {number} value - The value for which to get the gradient color.
 * @param {RangeColorSettingModel} colorMap - The range color setting model.
 * @returns {ColorValue} - The gradient color corresponding to the specified value.
 */
export function getGradientColor(value: number, colorMap: RangeColorSettingModel): ColorValue {
    const previousOffset: number = colorMap.start;
    const nextOffset: number = colorMap.end;
    let percent: number = 0;
    const full: number = nextOffset - previousOffset; let midColor: string;
    percent = (value - previousOffset) / full; let previousColor: string; let nextColor: string;
    if (colorMap.colors.length <= 2) {
        previousColor = colorMap.colors[0].charAt(0) === '#' ? colorMap.colors[0] : colorNameToHex(colorMap.colors[0]);
        nextColor = colorMap.colors[colorMap.colors.length - 1].charAt(0) === '#' ?
            colorMap.colors[colorMap.colors.length - 1] : colorNameToHex(colorMap.colors[colorMap.colors.length - 1]);
    } else {
        previousColor = colorMap.colors[0].charAt(0) === '#' ? colorMap.colors[0] : colorNameToHex(colorMap.colors[0]);
        nextColor = colorMap.colors[colorMap.colors.length - 1].charAt(0) === '#' ?
            colorMap.colors[colorMap.colors.length - 1] : colorNameToHex(colorMap.colors[colorMap.colors.length - 1]);
        const a: number = full / (colorMap.colors.length - 1); let b: number; let c: number;

        const length: number = colorMap.colors.length - 1;
        const splitColorValueOffset: Object[] = []; let splitColor: Object = {};
        for (let j: number = 1; j < length; j++) {
            c = j * a;
            b = previousOffset + c;
            splitColor = { b: b, color: colorMap.colors[j as number] };
            splitColorValueOffset.push(splitColor);
        }
        for (let i: number = 0; i < splitColorValueOffset.length; i++) {
            if (previousOffset <= value && value <= splitColorValueOffset[i as number]['b'] && i === 0) {
                midColor = splitColorValueOffset[i as number]['color'].charAt(0) === '#' ?
                    splitColorValueOffset[i as number]['color'] : colorNameToHex(splitColorValueOffset[i as number]['color']);
                nextColor = midColor;
                percent = value <= splitColorValueOffset[i as number]['b'] ? 1 - Math.abs((value - splitColorValueOffset[i as number]['b']) / a)
                    : (value - splitColorValueOffset[i as number]['b']) / a;
            } else if (splitColorValueOffset[i as number]['b'] <= value && value <= nextOffset && i === (splitColorValueOffset.length - 1)) {
                midColor = splitColorValueOffset[i as number]['color'].charAt(0) === '#' ?
                    splitColorValueOffset[i as number]['color'] : colorNameToHex(splitColorValueOffset[i as number]['color']);
                previousColor = midColor;
                percent = value < splitColorValueOffset[i as number]['b'] ?
                    1 - Math.abs((value - splitColorValueOffset[i as number]['b']) / a) : (value - splitColorValueOffset[i as number]['b']) / a;
            }
            if (i !== splitColorValueOffset.length - 1 && i < splitColorValueOffset.length) {
                if (splitColorValueOffset[i as number]['b'] <= value && value <= splitColorValueOffset[i + 1]['b']) {
                    midColor = splitColorValueOffset[i as number]['color'].charAt(0) === '#' ?
                        splitColorValueOffset[i as number]['color'] : colorNameToHex(splitColorValueOffset[i as number]['color']);
                    previousColor = midColor;
                    nextColor = splitColorValueOffset[i + 1]['color'].charAt(0) === '#' ?
                        splitColorValueOffset[i + 1]['color'] : colorNameToHex(splitColorValueOffset[i + 1]['color']);
                    percent = Math.abs((value - splitColorValueOffset[i + 1]['b'])) / a;
                }
            }
        }
    }
    return getPercentageColor(percent, previousColor, nextColor);
}

/**
 * Calculates the color based on the percentage change between two values.
 *
 * @param {number} percent - The percentage change.
 * @param {string} previous - The color for the previous value.
 * @param {string} next - The color for the next value.
 * @returns {ColorValue} - The calculated color value.
 */
export function getPercentageColor(percent: number, previous: string, next: string): ColorValue {
    const nextColor: string = next.split('#')[1];
    const prevColor: string = previous.split('#')[1];
    const r: number = getPercentage(percent, parseInt(prevColor.substr(0, 2), 16), parseInt(nextColor.substr(0, 2), 16));
    const g: number = getPercentage(percent, parseInt(prevColor.substr(2, 2), 16), parseInt(nextColor.substr(2, 2), 16));
    const b: number = getPercentage(percent, parseInt(prevColor.substr(4, 2), 16), parseInt(nextColor.substr(4, 2), 16));
    return new ColorValue(r, g, b);
}

/**
 * Calculates the percentage change between two values.
 *
 * @param {number} percent - The percentage to calculate.
 * @param {number} previous - The previous value.
 * @param {number} next - The next value.
 * @returns {number} - The calculated percentage change.
 */
export function getPercentage(percent: number, previous: number, next: number): number {
    const full: number = next - previous;
    return Math.round((previous + (full * percent)));
}

/**
 * Gets the text anchor based on the specified alignment and Right-to-Left setting.
 *
 * @param {Alignment} alignment - The alignment of the text.
 * @param {boolean} enableRtl - Specifies whether Right-to-Left is enabled.
 * @returns {string} - The text anchor value.
 */
export function getTextAnchor(alignment: Alignment, enableRtl : boolean) : string {
    switch (alignment) {
    case 'Near':
        return enableRtl ? 'end' : 'start';
    case 'Far':
        return enableRtl ? 'start' : 'end';
    default:
        return 'middle';
    }
}
