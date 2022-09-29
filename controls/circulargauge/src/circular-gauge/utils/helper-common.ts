/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/**
 * Specifies Circular-Gauge Common Helper methods
 */

import { compile as templateComplier, isNullOrUndefined, remove, createElement, merge } from '@syncfusion/ej2-base';
import { CircularGauge } from '../circular-gauge';
import { Range, Axis } from '../axes/axis';
import { IVisiblePointer } from '../model/interface';
import { FontModel, BorderModel } from '../model/base-model';
import { SvgRenderer } from '@syncfusion/ej2-svg-base';

/**
 * Function to measure the height and width of the text.
 *
 * @param  {string} text - Specifies the text.
 * @param  {FontModel} font - Specifies the font.
 * @param  {string} id - Specifies the id of the text.
 * @returns {Size} - Returns the size of the text.
 * @private
 */
export function measureText(text: string, font: FontModel): Size {
    let htmlObject: HTMLElement = document.getElementById('gauge-measuretext');
    if (htmlObject === null) {
        htmlObject = createElement('text', { id: 'gauge-measuretext' });
        document.body.appendChild(htmlObject);
    }
    const style: string = 'position: absolute; visibility: hidden;' +
        ';left: 0px; top: -100px; white-space: nowrap;' + getFontStyle(font);
    htmlObject.innerHTML = text;
    htmlObject.setAttribute('style', style);
    return new Size(htmlObject.clientWidth, htmlObject.clientHeight);
}

/**
 * Function to find number from string
 *
 * @param {string} value - Specifies the value.
 * @param {number} maxDimension - Specifies the  maximum dimension.
 * @returns {number} - Returns the number.
 * @private
 */
export function toPixel(value: string, maxDimension: number): number {
    if (value !== null && value !== undefined) {
        return value.indexOf('%') !== -1 ? (maxDimension / 100) * parseInt(value, 10) : parseInt(value, 10);
    }
    return null;
}

/**
 * Function to get the style from FontModel.
 *
 * @param {FontModel} font - Specifies the font.
 * @returns {string} - Returns the string.
 * @private
 */
export function getFontStyle(font: FontModel): string {
    let style: string = '';
    style = 'font-size:' + font.size +
        '; font-style:' + font.fontStyle + '; font-weight:' + font.fontWeight +
        '; font-family:' + font.fontFamily + ';opacity:' + font.opacity +
        '; color:' + font.color + ';';
    return style;
}

/**
 * Function to create the text element.
 *
 * @param {TextOption} options - Specifies the options.
 * @param {FontModel} font - Specifies the font.
 * @param {string} color - Specifies the color.
 * @param {HTMLElement | Element} parent - Specifies the html element.
 * @param {string} styles - Specifies the style.
 * @returns {Element} - Returns the element.
 * @private
 */
export function textElement(options: TextOption, font: FontModel, color: string, parent: HTMLElement | Element, styles?: string): Element {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let renderOptions: any = {};
    const renderer: SvgRenderer = new SvgRenderer('');
    const style: string = styles + ' font-size:' + font.size + '; font-style:' + font.fontStyle +
        ' ; font-weight:' + font.fontWeight + '; font-family:' + font.fontFamily + ';';
    renderOptions = {
        'id': options.id,
        'x': options.x,
        'y': options.y,
        'fill': color,
        'text-anchor': options.anchor,
        'transform': options.transform,
        'opacity': font.opacity,
        'dominant-baseline': options.baseLine,
        'style': style
    };
    const htmlObject: Element = renderer.createText(renderOptions, options.text);
    parent.appendChild(htmlObject);
    return htmlObject;
}

/**
 * Function to append the path to the element.
 *
 * @param {PathOption} options - Specifies the options.
 * @param {Element} element - Specifies the element.
 * @param {CircularGauge} gauge - Specifies the gauge.
 * @param {string} functionName - Specifies the function name.
 * @returns {Element} - Returns the element.
 * @private
 */
export function appendPath(options: PathOption, element: Element, gauge: CircularGauge, functionName?: string): Element {
    functionName = functionName ? functionName : 'Path';
    const htmlObject: HTMLElement = gauge.renderer['draw' + functionName](options) as HTMLElement;
    htmlObject.setAttribute('transform', options.transform);
    htmlObject.setAttribute('style', options.style);
    element.appendChild(htmlObject);
    return htmlObject;
}

/**
 * Function to check whether it's a complete circle for circular gauge.
 *
 * @param {number} startAngle - Specifies the startAngle.
 * @param {number} endAngle - Specifies the endAngle.
 * @returns {boolean} Returns the boolean value.
 * @private
 */
export function isCompleteAngle(startAngle: number, endAngle: number): boolean {
    let totalAngle: number = endAngle - startAngle;
    totalAngle = totalAngle <= 0 ? (totalAngle + 360) : totalAngle;
    return Math.floor(totalAngle / 360) !== 0;
}

/**
 * Function to get the degree for circular gauge.
 *
 * @param {number} startAngle - Specifies the startAngle.
 * @param {number} endAngle - Specifies the endAngle.
 * @returns {number} - Returns the number.
 * @private
 */
export function getDegree(startAngle: number, endAngle: number): number {
    const degree: number = endAngle - startAngle;
    return degree < 0 ? (degree + 360) : degree;
}

/**
 * Function to get the angle from value for circular gauge.
 *
 * @param {number} value - Specifies the value.
 * @param {number} maximumValue - Specifies the maximumValue.
 * @param {number} minimumValue - Specifies the minimumValue.
 * @param {number} startAngle - Specifies the startAngle.
 * @param {number} endAngle - Specifies the endAngle.
 * @param {boolean} isClockWise - Specifies the isClockWise.
 * @returns {number} - Returns the number.
 * @private
 */
export function getAngleFromValue(
    value: number, maximumValue: number, minimumValue: number, startAngle: number, endAngle: number, isClockWise: boolean
): number {
    let angle: number;
    endAngle -= isCompleteAngle(startAngle, endAngle) ? 0.0001 : 0;
    startAngle -= 90; endAngle -= 90;
    if (isClockWise) {
        angle = ((value - minimumValue) * (getDegree(startAngle, endAngle) / (maximumValue - minimumValue))) + startAngle;
    } else {
        angle = endAngle - ((value - minimumValue) * (getDegree(startAngle, endAngle) / (maximumValue - minimumValue)));
        angle = angle < 0 ? 360 + angle : angle;
    }
    angle = Math.round(angle) >= 360 ? (angle - 360) : Math.round(angle) < 0 ? (360 + angle) : angle;
    return angle;
}

/**
 * Function to get angle from location for circular gauge.
 *
 * @param {GaugeLocation} center - Specifies the center.
 * @param {GaugeLocation} point - Specifies the point.
 * @returns {number} - Returns the number.
 * @private
 */
export function getAngleFromLocation(center: GaugeLocation, point: GaugeLocation): number {
    let angle: number = Math.atan2((point.y - center.y), (point.x - center.x));
    angle = Math.round((angle < 0 ? (6.283 + angle) : angle) * (180 / Math.PI)) - 270;
    angle += angle < 0 ? 360 : 0;
    return angle;
}

/**
 * Function to get the location from angle for circular gauge.
 *
 * @param {number} degree - Specifies the degree.
 * @param {number} radius - Specifies the radius.
 * @param {GaugeLocation} center - Specifies the center.
 * @returns {GaugeLocation} - Returns the gauge location.
 * @private
 */
export function getLocationFromAngle(degree: number, radius: number, center: GaugeLocation): GaugeLocation {
    const radian: number = (degree * Math.PI) / 180;
    return new GaugeLocation(
        Math.cos(radian) * radius + center.x,
        Math.sin(radian) * radius + center.y
    );
}

/**
 * Function to get the path direction of the circular gauge.
 *
 * @param {GaugeLocation} center - Specifies the center.
 * @param {number} start - Specifies the start.
 * @param {number} end - Specifies the end.
 * @param {number} radius - Specifies the radius.
 * @param {number} startWidth - Specifies the startWidth.
 * @param {number} endWidth - Specifies the endWidth.
 * @param {Range} range - Specifies the range.
 * @param {Axis} axis - Specifies the axis.
 * @returns {string} - Returns the string.
 * @private
 */
export function getPathArc(
    center: GaugeLocation, start: number, end: number, radius: number,
    startWidth?: number, endWidth?: number, range?: Range, axis?: Axis
): string {
    if (isNullOrUndefined(range) || (range.start !== range.end)) {
        end -= isCompleteAngle(start, end) ? 0.0001 : 0;
    }
    const degree: number = getDegree(start, end);
    const startRadius: number = !isNullOrUndefined(range) ? (range.position === 'Outside' && !range.isLinearCircularGradient
        ? radius + startWidth : range.position === 'Cross'
            && axis.direction === 'AntiClockWise' ? radius - (endWidth + startWidth) / 2 : radius - startWidth) : radius - startWidth;
    const endRadius: number = !isNullOrUndefined(range) ? (range.position === 'Outside'
        && !range.isLinearCircularGradient ? radius + endWidth : range.position === 'Cross' &&
            axis.direction === 'ClockWise' ? radius - (endWidth + startWidth) / 2 : radius - endWidth) : radius - endWidth;
    const arcRadius: number = !isNullOrUndefined(range) ? (range.position === 'Outside' && !range.isLinearCircularGradient
        ? radius + ((startWidth + endWidth) / 2) :
        range.position === 'Cross' ? (radius - ((startWidth + endWidth) / 4) - (axis.direction === 'ClockWise' ? startWidth : endWidth)
            / 2) : radius - ((startWidth + endWidth) / 2)) : radius - ((startWidth + endWidth) / 2);
    const insideArcRadius: number = !isNullOrUndefined(range) && range.position === 'Cross' ?
        radius + ((startWidth + endWidth) / 4)
            - (axis.direction === 'ClockWise' ? startWidth : endWidth) / 2 : radius;
    let insideEndRadius: number = !isNullOrUndefined(range) && range.position === 'Cross' && axis.direction === 'ClockWise' ?
        radius - ((startWidth - endWidth) / 2) : radius;
    const insideStartRadius: number = !isNullOrUndefined(range) && range.position === 'Cross' && axis.direction === 'AntiClockWise' ?
        radius + ((startWidth - endWidth) / 2) : radius;
    if (startWidth !== undefined && endWidth !== undefined) {
        insideEndRadius = range.position === 'Cross' ? (degree > 325 ? insideStartRadius : insideEndRadius) : insideEndRadius;
        return getRangePath(
            getLocationFromAngle(start, insideStartRadius, center),
            getLocationFromAngle(end, insideEndRadius, center),
            getLocationFromAngle(start, startRadius, center),
            getLocationFromAngle(end, endRadius, center),
            insideArcRadius, startRadius, endRadius, arcRadius,
            (degree < 180) ? 0 : 1, center, degree, range, axis
        );
    } else {
        return getCirclePath(
            getLocationFromAngle(start, radius, center),
            getLocationFromAngle(end, radius, center), radius, (degree < 180) ? 0 : 1
        );
    }
}

/**
 * Function to get the range path arc direction of the circular gauge.
 *
 * @param {GaugeLocation} start - Specifies the start.
 * @param {GaugeLocation} end - Specifies the end.
 * @param {number} radius - Specifies the radius.
 * @param {number} arcStartOne - Specifies the arcStartOne.
 * @param {number} arcEndOne - Specifies the arcEndOne.
 * @param {number} arcStartTwo - Specifies the arcStartTwo.
 * @param {number} arcEndTwo - Specifies the arcEndTwo.
 * @param {number} clockWise - Specifies the clockWise.
 * @param {GaugeLocation} innerStart - Specifies the innerStart.
 * @param {GaugeLocation} innerEnd - Specifies the innerEnd.
 * @param {GaugeLocation} pointPosition - Specifies the pointPosition.
 * @returns {string} - Returns the string.
 * @private
 */
export function arcPath(
    start: GaugeLocation, end: GaugeLocation, radius: number, arcStartOne: number,
    arcEndOne: number, arcStartTwo: number, arcEndTwo: number,
    clockWise: number, innerStart: GaugeLocation, innerEnd: GaugeLocation,
    pointPosition: GaugeLocation
): string {
    return 'M ' + start.x + ' ' + start.y + ' A ' + radius + ' ' + radius + ' 0 ' +
        clockWise + ' 1 ' + end.x + ' ' + end.y + ' L ' + innerEnd.x + ' ' + innerEnd.y +
        ' A ' + arcStartOne + ' ' + arcEndOne + ' 0 ' + clockWise + ' 0 ' + pointPosition.x
        + ' ' + pointPosition.y + ' ' + ' A ' + arcStartTwo + ' ' + arcEndTwo
        + ' 0 ' + clockWise + ' 0 ' + innerStart.x + ' ' + innerStart.y + ' Z ';
}

/**
 * Function to get the range path arc direction of the circular gauge.
 *
 * @param {GaugeLocation} start - Specifies the start.
 * @param {GaugeLocation} end - Specifies the end.
 * @param {number} radius - Specifies the radius.
 * @param {GaugeLocation} outerOldEnd - Specifies the outerOldEnd.
 * @param {GaugeLocation} innerOldEnd - Specifies the innerOldEnd.
 * @param {number} arcStartOne - Specifies the arcStartOne.
 * @param {number} arcEndOne - Specifies the arcEndOne.
 * @param {number} arcStartTwo - Specifies the arcStartTwo.
 * @param {number} arcEndTwo - Specifies the arcEndTwo.
 * @param {number} clockWise - Specifies the clockWise.
 * @param {GaugeLocation} innerStart - Specifies the innerStart.
 * @param {GaugeLocation} innerEnd - Specifies the innerEnd.
 * @param {GaugeLocation} innerOldStart - Specifies the innerOldStart.
 * @param {GaugeLocation} outerOldStart - Specifies the outerOldStart.
 * @param {GaugeLocation} pointPosition - Specifies the pointPosition.
 * @returns {string} - Returns the string.
 * @private
 */
export function arcRoundedPath(
    start: GaugeLocation, end: GaugeLocation, radius: number, outerOldEnd: GaugeLocation, innerOldEnd: GaugeLocation,
    arcStartOne: number, arcEndOne: number, arcStartTwo: number, arcEndTwo: number,
    clockWise: number, innerStart: GaugeLocation, innerEnd: GaugeLocation, innerOldStart: GaugeLocation,
    outerOldStart: GaugeLocation, pointPosition: GaugeLocation
): string {
    const roundedPath: string = 'M ' + start.x + ' ' + start.y + ' A ' + radius + ' ' + radius + ' 0 ' +
        clockWise + ' 1 ' + end.x + ' ' + end.y + ' C ' + outerOldEnd.x + ' ' + outerOldEnd.y + ' ' + innerOldEnd.x + ' ' +
        innerOldEnd.y + ' ' + innerEnd.x + ' ' + innerEnd.y;
    if (isNullOrUndefined(arcStartTwo) && isNullOrUndefined(arcEndTwo)) {
        return roundedPath + ' A ' + arcStartOne + ' ' + arcEndOne + ' 0 ' + clockWise + ' 0 ' + innerStart.x + ' '
            + innerStart.y + ' C ' + innerOldStart.x + ' ' + innerOldStart.y + ' ' + outerOldStart.x + ' ' +
            outerOldStart.y + ' ' + start.x + ' ' + start.y + ' Z';
    } else {
        return roundedPath + ' A ' + arcStartOne + ' ' + arcEndOne + ' 0 ' + clockWise + ' 0 '
            + pointPosition.x + ' ' + pointPosition.y + ' ' + ' A ' + arcStartTwo + ' ' + arcEndTwo + ' 0 ' + clockWise + ' 0 '
            + innerStart.x + ' ' + innerStart.y + ' C ' + innerOldStart.x + ' ' + innerOldStart.y + ' ' + outerOldStart.x + ' ' +
            outerOldStart.y + ' ' + start.x + ' ' + start.y + ' Z';
    }
}

/**
 * Function to get the range path direction for different start and end width of the circular gauge.
 *
 * @param {GaugeLocation} start - Specifies the options.
 * @param {GaugeLocation} end - Specifies the end.
 * @param {GaugeLocation} innerStart - Specifies the innerStart.
 * @param {GaugeLocation} innerEnd - Specifies the innerEnd.
 * @param {number} radius - Specifies the radius.
 * @param {number} startRadius - Specifies the startRadius.
 * @param {number} endRadius - Specifies the endRadius.
 * @param {number} clockWise - Specifies the clockWise.
 * @returns {string} - Returns the string.
 * @private
 */
export function arcWidthPath(
    start: GaugeLocation, end: GaugeLocation,
    innerStart: GaugeLocation, innerEnd: GaugeLocation,
    radius: number, startRadius: number,
    endRadius: number, clockWise: number
): string {
    return 'M ' + start.x + ' ' + start.y +
        ' A ' + radius + ' ' + radius + ' 0 ' +
        clockWise + ' 1 ' + end.x + ' ' + end.y +
        ' L ' + innerEnd.x + ' ' + innerEnd.y +
        ' A ' + endRadius + ' ' + startRadius + ' 0 ' +
        clockWise + ' 0 ' + innerStart.x + ' ' + innerStart.y + ' Z';
}

/**
 * Function to get the range path direction of the circular gauge.
 *
 * @param {GaugeLocation} start - Specifies the start values.
 * @param {GaugeLocation} end - Specifies the end values.
 * @param {GaugeLocation} innerStart - Specifies the innerStart values.
 * @param {GaugeLocation} innerEnd - Specifies the innerEnd values.
 * @param {number} radius - Specifies the radius value.
 * @param {number} startRadius - Specifies the startRadius value.
 * @param {number} endRadius - Specifies the endRadius value.
 * @param {number} arcRadius - Specifies the arcRadius value.
 * @param {number} clockWise - Specifies the clockWise value.
 * @param {GaugeLocation} center - Specifies the center value.
 * @param {number} degree - Specifies the degree value.
 * @param {Range} range - Specifies the range value.
 * @param {Axis} axis - Specifies the axis value.
 * @returns {string} - Returns the string value.
 * @private
 */
export function getRangePath(
    start: GaugeLocation, end: GaugeLocation,
    innerStart: GaugeLocation, innerEnd: GaugeLocation, radius: number, startRadius: number, endRadius: number,
    arcRadius: number, clockWise: number, center: GaugeLocation, degree: number,
    range?: Range, axis?: Axis

): string {
    const startWidth: number = range.startWidth as number;
    const endWidth: number = range.endWidth as number;
    const widthDifference: number = Math.abs(startWidth - endWidth);
    let endArc: number; let startArc: number;
    if (startWidth > endWidth && degree <= 260 && range.position !== 'Cross' && range.position !== 'Outside') {
        endArc = (endRadius + (axis.direction === 'ClockWise' ? -(widthDifference / 2) : (widthDifference / 2)));
        startArc = (startRadius + (axis.direction === 'ClockWise' ? (widthDifference / 2) : -(widthDifference / 2)));
        return arcWidthPath(start, end, innerStart, innerEnd, radius, startArc, endArc, clockWise);
    } else if (endWidth > startWidth && degree <= 260 && range.position !== 'Cross' && range.position !== 'Outside') {
        endArc = (startRadius + (axis.direction === 'ClockWise' ? -(widthDifference / 2) : (widthDifference / 2)));
        startArc = (endRadius + (axis.direction === 'ClockWise' ? (widthDifference / 2) : -(widthDifference / 2)));
        return arcWidthPath(start, end, innerStart, innerEnd, radius, startArc, endArc, clockWise);
    } else if ((endWidth === startWidth) && (axis.startAngle !== 0 || axis.endAngle !== 0)) {
        return arcWidthPath(start, end, innerStart, innerEnd, radius, startRadius, endRadius, clockWise);
    } else if ((degree > 260) || (!range.isLinearCircularGradient && axis.startAngle === 0 && axis.endAngle === 0)) {
        if (range.roundedCornerRadius <= 0 && range.startWidth === range.endWidth) {
            return arcWidthPath(start, end, innerStart, innerEnd, radius, startRadius, endRadius, clockWise);
        } else {
            return arcWidthPathCalculation(start, end, innerStart, innerEnd, radius, startRadius, endRadius, arcRadius, clockWise,
                                        center, null, null, null, null,
                                        startWidth, endWidth, degree, range, axis
            );
        }
    } else {
        if (range.position === 'Cross' || range.position === 'Outside') {
            return arcWidthPath(start, end, innerStart, innerEnd, radius, arcRadius, arcRadius, clockWise);
        } else {
            return arcWidthPath(start, end, innerStart, innerEnd, radius, startRadius, endRadius, clockWise);
        }
    }
}

/**
 * Function to get start and end width range path calculation to the circular gauge.
 *
 * @param {GaugeLocation} start - Specifies the start value.
 * @param {GaugeLocation} end - Specifies the end value.
 * @param {GaugeLocation} innerStart - Specifies the innerStart value.
 * @param {GaugeLocation} innerEnd - Specifies the innerEnd value.
 * @param {number} radius - Specifies the radius value.
 * @param {number} startRadius - Specifies the startRadius value.
 * @param {number} endRadius - Specifies the endRadius value.
 * @param {number} arcRadius - Specifies the arcRadius value.
 * @param {number} clockWise - Specifies the clockWise value.
 * @param {GaugeLocation} center - Specifies the center value.
 * @param {GaugeLocation} outerOldEnd - Specifies the outerOldEnd value.
 * @param {GaugeLocation} innerOldEnd - Specifies the innerOldEnd value.
 * @param {GaugeLocation} outerOldStart - Specifies the outerOldStart value.
 * @param {GaugeLocation} innerOldStart - Specifies the innerOldStart value.
 * @param {number} startWidth - Specifies the startWidth value.
 * @param {number} endWidth - Specifies the endWidth value.
 * @param {number} degree - Specifies the degree value.
 * @param {Range} range - Specifies the range value.
 * @param {Axis} axis - Specifies the axis value.
 * @returns {string} - Returns the svg path.
 * @private
 */
export function arcWidthPathCalculation(
    start: GaugeLocation, end: GaugeLocation, innerStart: GaugeLocation, innerEnd: GaugeLocation,
    radius: number, startRadius: number, endRadius: number, arcRadius: number, clockWise: number, center: GaugeLocation,
    outerOldEnd: GaugeLocation, innerOldEnd: GaugeLocation, outerOldStart: GaugeLocation,
    innerOldStart: GaugeLocation, startWidth: number, endWidth: number, degree: number, range?: Range, axis?: Axis
): string {
    if (!isNullOrUndefined(range)) {
        let arcStartOne: number; let arcEndOne: number;
        let widthDifference: number = Math.abs(startWidth - endWidth); let arcStartTwo: number; let arcEndTwo: number;
        const startValueToAngle: number = getAngleFromValue(((range.start + range.end) / 2), axis.maximum, axis.minimum, axis.startAngle,
                                                            axis.endAngle, axis.direction === 'ClockWise');
        const pointPosition: GaugeLocation = (startWidth < ((endWidth))) ?
            getLocationFromAngle(startValueToAngle, endRadius, center) : getLocationFromAngle(startValueToAngle, startRadius, center);
        // eslint-disable-next-line max-len
        const endDistance: number = Math.sqrt((Math.pow((innerEnd.x - pointPosition.x), 2)) + (Math.pow((innerEnd.y - pointPosition.y), 2)));
        const endRadii: number = endDistance / 2;
        const centerStartDistance: number = Math.sqrt((Math.pow((center.x - innerStart.x), 2)) + (Math.pow((center.y - innerStart.y), 2)));
        const centerDistance: number = Math.sqrt((Math.pow((center.x - pointPosition.x), 2)) + (Math.pow((center.y - pointPosition.y), 2)));
        if (range.roundedCornerRadius <= 0) {
            widthDifference = widthDifference === 0 ? 1 : widthDifference;
            innerEnd.y = (range.position === 'Cross' && axis.direction === 'ClockWise') ? degree > 325 ?
                innerEnd.y - (widthDifference / 2) : innerEnd.y : innerEnd.y;
            const degreeValue: number = range.position === 'Cross' ? 330 : 325;
            if (((degreeValue <= degree && degree <= 360))) {
                arcStartTwo = (axis.direction === 'ClockWise' ? (centerDistance / 2)
                    : (degree >= 345 ? (startRadius - (widthDifference / 2) - (endWidth / 2))
                        : range.position === 'Cross' ? (startRadius + (widthDifference / 4) - (startWidth / 2))
                            : (startRadius - (widthDifference / 2) - (startWidth / 2))));
                arcEndTwo = (axis.direction === 'ClockWise' ? (centerStartDistance / 2)
                    : range.position === 'Cross' ?
                        (endRadius + (widthDifference / 4)) - (endWidth / 4) :
                        (range.position === 'Outside' && axis.direction === 'AntiClockWise') ? degree < 345 ?
                            (startRadius - (widthDifference) - (endWidth / 4))
                            : (startRadius - (widthDifference / 2))
                            : (endRadius + (widthDifference / 2)) - (endWidth / 2));
                return arcPath(start, end, radius, endRadii, endRadii, arcStartTwo, arcEndTwo, clockWise,
                               innerStart, innerEnd, pointPosition);
            } else if ((degree > 260 && degree < 325) && range.position !== 'Cross' && range.position !== 'Outside') {
                let arcStart: number = (arcRadius - (widthDifference / 2));
                const arcEnd: number = (arcRadius - (widthDifference / 2));
                const angleValueDirection: boolean = axis.direction === 'ClockWise' ? degree >= 310 : degree < 345;
                if (degree < 310) {
                    return arcWidthPath(start, end, innerStart, innerEnd, radius, arcStart, arcEnd, clockWise);
                } else if (degree >= 310 || angleValueDirection) {
                    arcStart = (arcRadius - (widthDifference));
                    return arcWidthPath(start, end, innerStart, innerEnd, radius, arcEnd, arcStart, clockWise);
                } else {
                    return arcWidthPath(start, end, innerStart, innerEnd, radius, startRadius, endRadius, clockWise);
                }
            } else {
                if (range.position === 'Cross') {
                    const endRadiusValue: number = axis.direction === 'ClockWise' ? degree <= 300 && degree >= 260 ?
                        endRadius - (widthDifference / 2) - (startWidth / 4) : endRadius
                        - (widthDifference) - (startWidth / 2) : degree <= 300 && degree >= 260 ?
                        endRadius + (widthDifference / 4) - (startWidth / 4) :
                        endRadius + (widthDifference / 4) - (startWidth / 2);
                    const startRadiusValue: number = axis.direction === 'ClockWise' ? degree > 325 ? degree > 340 ? (startRadius - startWidth)
                            - (widthDifference / 4) : startRadius - (widthDifference / 4)
                        : startRadius : startRadius - (widthDifference / 4);
                    return arcWidthPath(start, end, innerStart, innerEnd, radius, startRadiusValue, endRadiusValue, clockWise);
                } else if (range.position === 'Outside') {
                    if (degree < 325 && degree > 285) {
                        let arcTwo: number;
                        const startGreater: number = startWidth / 2;
                        const endGreater: number = endWidth / 2;
                        const arcOne: number = arcTwo = arcRadius + (widthDifference / 2) + startGreater + endGreater;
                        innerEnd.y = axis.direction === 'ClockWise' && startWidth !== endWidth && startWidth > widthDifference ?
                            innerEnd.y - (widthDifference / 2) : innerEnd.y + startGreater;
                        return arcWidthPath(start, end, innerStart, innerEnd, radius, arcOne, arcTwo, clockWise);
                    } else {
                        return arcWidthPath(start, end, innerStart, innerEnd, radius, arcRadius, arcRadius, clockWise);
                    }
                } else {
                    return arcWidthPath(start, end, innerStart, innerEnd, radius, startRadius, endRadius, clockWise);
                }
            }
        } else {
            const degreeAngle: number = axis.endAngle < 4 ? 356 : 360;
            clockWise = degree > degreeAngle ? 0 : clockWise;
            const degreeValueOne: number = axis.direction === 'ClockWise' ? 327 : 322;
            const degreeValueTwo: number = axis.direction === 'ClockWise' ? 328 : 325;
            if ((endWidth === startWidth) && (axis.startAngle !== 0 || axis.endAngle !== 0)) {
                return roundedArcWidthPathCalculation(start, end, innerStart, innerEnd, radius, startRadius, endRadius,
                                                      clockWise, outerOldEnd, innerOldEnd, outerOldStart, innerOldStart);
            } else if ((degree <= degreeAngle && degree > degreeValueOne) && range.roundedCornerRadius > 0) {
                arcStartOne = axis.direction === 'ClockWise' ? degree < 334 && degree > 324 ? endRadii - (widthDifference / 2) :
                    endRadii - (widthDifference / 4) : endRadii;
                arcStartTwo = (centerDistance / 2);
                arcEndTwo = axis.direction === 'ClockWise' ? ((centerStartDistance / 2) + (widthDifference / 2)) :
                    (centerStartDistance / 2);
                return arcRoundedPath(start, end, radius, outerOldEnd, innerOldEnd, arcStartOne, endRadii,
                                      arcStartTwo, arcEndTwo, clockWise, innerStart, innerEnd,
                                      innerOldStart, outerOldStart, pointPosition);
            } else if (degree > 270 && degree < degreeValueTwo) {
                const startAddArc: number = endRadius + (widthDifference / 2) - (endWidth / 2);
                const startSubArc: number = endRadius - (widthDifference / 2) - (endWidth / 2);
                arcStartOne = (startRadius - (widthDifference / 2) - (startWidth / 2));
                arcEndOne = (axis.direction === 'ClockWise' ? startSubArc : startAddArc);
                return arcRoundedPath(start, end, radius, outerOldEnd, innerOldEnd, arcStartOne, arcEndOne,
                                      null, null, clockWise, innerStart, innerEnd, innerOldStart, outerOldStart, null);
            } else {
                return roundedArcWidthPathCalculation(start, end, innerStart, innerEnd,
                                                      radius, startRadius, endRadius, clockWise,
                                                      outerOldEnd, innerOldEnd, outerOldStart, innerOldStart);
            }
        }
    } else {
        return roundedArcWidthPathCalculation(start, end, innerStart, innerEnd,
                                              radius, startRadius, endRadius, clockWise,
                                              outerOldEnd, innerOldEnd, outerOldStart, innerOldStart);
    }
}

/**
 * Function to get start and end width range rounded path calculation to the circular gauge.
 *
 * @param {GaugeLocation} start - Specifies the start value.
 * @param {GaugeLocation} end - Specifies the end value.
 * @param {GaugeLocation} innerStart - Specifies the innerStart value.
 * @param {GaugeLocation} innerEnd - Specifies the innerEnd value.
 * @param {number} radius - Specifies the radius value.
 * @param {number} startRadius - Specifies the startRadius value.
 * @param {number} endRadius - Specifies the endRadius value.
 * @param {number} clockWise - Specifies the clockWise value.
 * @param {GaugeLocation} outerOldEnd - Specifies the outerOldEnd value.
 * @param {GaugeLocation} innerOldEnd - Specifies the innerOldEnd value.
 * @param {GaugeLocation} outerOldStart - Specifies the outerOldStart value.
 * @param {GaugeLocation} innerOldStart - Specifies the innerOldStart value.
 * @returns {string} - Returns the path value.
 * @private
 */
export function roundedArcWidthPathCalculation(
    start: GaugeLocation, end: GaugeLocation, innerStart: GaugeLocation, innerEnd: GaugeLocation,
    radius: number, startRadius: number, endRadius: number, clockWise: number,
    outerOldEnd: GaugeLocation, innerOldEnd: GaugeLocation, outerOldStart: GaugeLocation,
    innerOldStart: GaugeLocation
): string {
    return 'M ' + start.x + ' ' + start.y + ' A ' + radius + ' ' + radius + ' 0 ' +
        clockWise + ' 1 ' + end.x + ' ' + end.y + ' C ' + outerOldEnd.x + ' ' + outerOldEnd.y + ' ' + innerOldEnd.x + ' ' +
        innerOldEnd.y + ' ' + innerEnd.x + ' ' + innerEnd.y +
        ' A ' + endRadius + ' ' + startRadius + ' 0 ' +
        clockWise + ' 0 ' + innerStart.x + ' ' + innerStart.y +
        ' C ' + innerOldStart.x + ' ' + innerOldStart.y + ' ' + outerOldStart.x + ' ' +
        outerOldStart.y + ' ' + start.x + ' ' + start.y + ' Z';
}

/**
 * Function to get the rounded path direction of the circular gauge.
 *
 * @param {GaugeLocation} center - Specifies the center value.
 * @param {number} actualStart - Specifies the actualStart value.
 * @param {number} actualEnd - Specifies the actualEnd value.
 * @param {number} oldStart - Specifies the oldStart value.
 * @param {number} oldEnd - Specifies the oldEnd value.
 * @param {number} radius - Specifies the radius value.
 * @param {number} startWidth - Specifies the startWidth value.
 * @param {number} endWidth - Specifies the endWidth value.
 * @param {Range} range - Specifies the range value.
 * @param {Axis} axis - Specifies the axis value.
 * @returns {string} - Returns the path value.
 * @private
 */
export function getRoundedPathArc(
    center: GaugeLocation, actualStart: number, actualEnd: number, oldStart: number, oldEnd: number,
    radius: number, startWidth?: number, endWidth?: number, range?: Range, axis?: Axis
): string {
    actualEnd -= isCompleteAngle(actualStart, actualEnd) ? 0.0001 : 0;
    const degree: number = getDegree(actualStart, actualEnd);
    const startRadius: number = radius - startWidth;
    const endRadius: number = radius - endWidth;
    const arcRadius: number = radius - ((startWidth + endWidth) / 2);
    return arcWidthPathCalculation(
        getLocationFromAngle(actualStart, radius, center),
        getLocationFromAngle(actualEnd, radius, center),
        getLocationFromAngle(actualStart, startRadius, center),
        getLocationFromAngle(actualEnd, endRadius, center),
        radius, arcRadius, arcRadius, arcRadius,
        (degree < 180) ? 0 : 1, center,
        getLocationFromAngle(oldEnd, radius, center),
        getLocationFromAngle(oldEnd, endRadius, center),
        getLocationFromAngle(oldStart, radius, center),
        getLocationFromAngle(oldStart, startRadius, center),
        startWidth, endWidth, degree, range, axis
    );
}

/**
 * Function to get the circular path direction of the circular gauge.
 *
 * @param {GaugeLocation} start - Specifies the start value.
 * @param {GaugeLocation} end - Specifies the end value.
 * @param {number} radius - Specifies the radius value.
 * @param {number} clockWise - Specifies the clockWise.
 * @returns {string} - Returns the path.
 * @private
 */
export function getCirclePath(start: GaugeLocation, end: GaugeLocation, radius: number, clockWise: number): string {
    return 'M ' + start.x + ' ' + start.y + ' A ' + radius + ' ' +
        radius + ' 0 ' + clockWise + ' 1 ' + end.x + ' ' + end.y;
}

/**
 * Function to compile the template function for circular gauge.
 *
 * @param {string} template - Specifies the template.
 * @param {CircularGauge} gauge - Specifies the gauge instance.
 * @returns {Function} - Returns the template function.
 * @private
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getTemplateFunction(template: string, gauge: CircularGauge): any {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let templateFn: any = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let e: any;
    try {
        if (isNaN(parseFloat(template)) && document.querySelectorAll(template).length) {
            if ((template.charAt(0) !== 'a' || template.charAt(0) !== 'A') && template.length !== 1) {
                templateFn = templateComplier(document.querySelector(template).innerHTML.trim());
            }
        } else if ((gauge as any).isVue || (gauge as any).isVue3) {
            templateFn = templateComplier(template);
        }
    } catch (e) {
        templateFn = templateComplier(template);
    }

    return templateFn;
}

/**
 * Function to remove the element from id.
 *
 * @param {string} id Specifies the id
 * @returns {void}
 * @private
 */
export function removeElement(id: string): void {
    const element: Element = getElement(id);
    if (element) {
        remove(element);
    }
}

/**
 * Function to get element from id.
 *
 * @param {string} id - Specifies the id.
 * @returns {Element} - Returns the element.
 * @private
 */
export function getElement(id: string): Element {
    return document.getElementById(id);
}

/**
 * Function to convert the number from string.
 *
 * @param {string} value - Specifies the value.
 * @param {number} containerSize - Specifies the container size.
 * @returns {number} - Returns the number.
 * @private
 */
export function stringToNumber(value: string, containerSize: number): number {
    if (value !== null && value !== undefined) {
        return value.indexOf('%') !== -1 ? (containerSize / 100) * parseInt(value, 10) : parseInt(value, 10);
    }
    return null;
}

/**
 * Function to get current point for circular gauge using element id.
 *
 * @param {string} targetId - Specifies the target id.
 * @param {CircularGauge} gauge - Specifies the gauge instance.
 * @returns {IVisiblePointer} - Returns the pointer and axis index.
 * @private
 */
export function getPointer(targetId: string, gauge: CircularGauge): IVisiblePointer {
    const tempString: string = targetId.replace(gauge.element.id, '').split('_Axis_')[1];
    return {
        axisIndex: +tempString[0],
        pointerIndex: +tempString[tempString.length - 1]
    };
}

/**
 * Function to convert the label using format for cirular gauge.
 *
 * @param {string} format - Specifies the format.
 * @returns {string} - Returns th string.
 * @private
 */
export function getLabelFormat(format: string): string {
    const customLabelFormat: boolean = format && format.match('{value}') !== null;
    const skeleton: string = customLabelFormat ? '' : format;
    return skeleton;
}

/**
 * Function to calculate the marker shape for circular gauge.
 *
 * @param {GaugeLocation} location - Specifies the location.
 * @param {string} shape - Specifies the shape.
 * @param {Size} size - Specifies the size.
 * @param {string} url - Specifies the url.
 * @param {PathOption} options - Specifies the path option.
 * @returns {PathOption} - Returns the path.
 * @private
 */
export function calculateShapes(location: GaugeLocation, shape: string, size: Size, url: string, options: PathOption): PathOption {
    let path: string;
    const width: number = size.width;
    const height: number = size.height;
    const locX: number = location.x;
    const locY: number = location.y;
    const x: number = location.x + (-width / 2);
    const y: number = location.y + (-height / 2);
    const isLegend: boolean = options.id.indexOf('Shape') > -1;
    let space: number;
    switch (shape) {
    case 'Circle':
        merge(options, { 'rx': width / 2, 'ry': height / 2, 'cx': locX, 'cy': locY });
        break;
    case 'Diamond':
        path = 'M' + ' ' + x + ' ' + locY + ' ' +
            'L' + ' ' + locX + ' ' + (locY + (-height / 2)) + ' ' +
            'L' + ' ' + (locX + (width / 2)) + ' ' + locY + ' ' +
            'L' + ' ' + locX + ' ' + (locY + (height / 2)) + ' ' +
            'L' + ' ' + x + ' ' + locY + ' Z';
        merge(options, { 'd': path });
        break;
    case 'Rectangle':
        path = 'M' + ' ' + x + ' ' + (locY + (-height / 2)) + ' ' +
            'L' + ' ' + (locX + (width / 2)) + ' ' + (locY + (-height / 2)) + ' ' +
            'L' + ' ' + (locX + (width / 2)) + ' ' + (locY + (height / 2)) + ' ' +
            'L' + ' ' + x + ' ' + (locY + (height / 2)) + ' ' +
            'L' + ' ' + x + ' ' + (locY + (-height / 2)) + ' Z';
        merge(options, { 'd': path });
        break;
    case 'Triangle':
        if (isLegend) {
            path = 'M' + ' ' + (x + (width / 2)) + ' ' + y + ' ' + 'L' + ' ' + (x + width) + ' ' +
                (y + height) + 'L' + ' ' + x + ' ' + (y + height) + ' Z';
        } else {
            path = 'M' + ' ' + locX + ' ' + locY + ' ' +
                'L' + ' ' + (locX - height) + ' ' + (locY - (width / 2)) +
                'L' + ' ' + (locX - height) + ' ' + (locY + (width / 2)) + ' Z';
        }
        merge(options, { 'd': path });
        break;
    case 'InvertedTriangle':
        if (isLegend) {
            path = 'M' + ' ' + (x + width) + ' ' + y + ' ' + 'L' + ' ' + (x + (width / 2)) + ' ' + (y + height) +
                'L' + ' ' + x + ' ' + (y) + ' Z';
        } else {
            path = 'M' + ' ' + locX + ' ' + locY + ' ' +
                'L' + ' ' + (locX + height) + ' ' + (locY - (width / 2)) +
                'L' + ' ' + (locX + height) + ' ' + (locY + (width / 2)) + ' Z';
        }
        merge(options, { 'd': path });
        break;
    case 'Image':
        merge(options, { 'href': url, 'height': height, 'width': width, x: x, y: y });
        break;
    case 'RightArrow':
        space = 2;
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
    }
    return options;
}

/** @private */
export class CustomizeOption {
    public id: string;
    constructor(id?: string) {
        this.id = id;
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
    public transform: string;
    public style: string;

    constructor(
        id: string, fill: string, width: number, color: string,
        opacity?: number, dashArray?: string, d?: string, transform: string = '', style: string = ''
    ) {
        super(id);
        this.opacity = opacity;
        this.fill = fill;
        this.stroke = color;
        this['stroke-width'] = width;
        this['stroke-dasharray'] = dashArray;
        this.d = d;
        this.transform = transform;
        this.style = style;
    }
}

/** @private */
export class RectOption extends CustomizeOption {

    public x: number;
    public y: number;
    public height: number;
    public width: number;
    public opacity: number;
    public fill: string;
    public stroke: string;
    public ['stroke-width']: number;
    public ['stroke-dasharray']: string;
    constructor(
        id: string, fill: string, border: BorderModel, opacity: number, rect: Rect
    ) {
        super(id);
        this.y = rect.y;
        this.x = rect.x;
        this.height = rect.height;
        this.width = rect.width;
        this.opacity = opacity;
        this.fill = fill;
        this.stroke = border.color;
        this['stroke-width'] = border.width;
        this['stroke-dasharray'] = border.dashArray;
    }
}

/**
 * Internal class size
 */
export class Size {

    /**
     * Specifies the height.
     */
    public height: number;
    /**
     * Specifies the width.
     */
    public width: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }
}

/**
 * Internal use of circular gauge location
 */
export class GaugeLocation {
    /**
     * To specify x value
     */
    public x: number;
    /**
     * To specify y value
     */
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
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
export class TextOption extends CustomizeOption {

    public anchor: string;
    public text: string;
    public transform: string = '';
    public x: number;
    public y: number;
    public baseLine: string = 'auto';

    constructor(id?: string, x?: number, y?: number, anchor?: string, text?: string, transform: string = '', baseLine?: string) {
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
export class VisibleLabels {
    public text: string;
    public value: number;
    public size: Size;

    constructor(text: string, value: number, size?: Size) {
        this.text = text;
        this.value = value;
        this.size = size;
    }
}
