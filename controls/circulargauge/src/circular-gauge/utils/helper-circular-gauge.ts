/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/**
 * Specifies Circular-Gauge Helper methods
 */

import { setStyleAttribute } from '@syncfusion/ej2-base';
import { BorderModel } from '../model/base-model';
import { CircularGauge } from '../circular-gauge';
import { isCompleteAngle, getDegree } from './helper-common';
import { IVisibleRange } from '../model/interface';

/**
 * Function to set style to the element.
 *
 * @param {HTMLElement} element - Specifies the element.
 * @param {string} fill - Specifies the fill of the element.
 * @param {BorderModel} border - Specifies the border of the element.
 * @returns {void}
 * @private
 */
export function setStyles(element: HTMLElement, fill: string, border: BorderModel): void {
    setStyleAttribute(element, {
        'stroke': border.color, 'stroke-width': border.width,
        'fill': fill
    });
}

/**
 * Function to get the value from angle for circular gauge.
 *
 * @param {number} angle - Specifies the angle.
 * @param {number} maximumValue - Specifies the maximumValue.
 * @param {number} minimumValue - Specifies the minimumValue.
 * @param {number} startAngle - Specifies the startAngle.
 * @param {number} endAngle - Specifies the endAngle.
 * @param {boolean} isClockWise - Specifies the isClockWise.
 * @returns {number} - Returs the number.
 * @private
 */
export function getValueFromAngle(
    angle: number, maximumValue: number, minimumValue: number, startAngle: number, endAngle: number, isClockWise: boolean
): number {
    endAngle -= isCompleteAngle(startAngle, endAngle) ? 0.0001 : 0;
    angle = angle < startAngle ? (angle + 360) : angle;
    if (isClockWise) {
        return (((angle - startAngle) / getDegree(startAngle, endAngle)) * (maximumValue - minimumValue)) + minimumValue;
    } else {
        return maximumValue - ((((angle - startAngle) / getDegree(startAngle, endAngle)) * (maximumValue - minimumValue)));
    }
}

/**
 * Function to get current point for circular gauge using element id.
 *
 * @param {string} targetId - Specifies the target id.
 * @param {CircularGauge} gauge - Specifies the gauge instance.
 * @returns {IVisibleRange} - Returns the current point.
 * @private
 */
export function getRange(targetId: string, gauge: CircularGauge): IVisibleRange {
    const tempString: string = targetId.replace(gauge.element.id, '').split('_Axis_')[1];
    return {
        axisIndex: +tempString[0],
        rangeIndex: +tempString.split('Range_')[1]
    };
}
