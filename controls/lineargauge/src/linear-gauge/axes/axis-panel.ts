/* eslint-disable valid-jsdoc */
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { LinearGauge } from '../../linear-gauge';
import { Axis, Label, Tick, Pointer, Range } from './axis';
import { Orientation, Position } from '../utils/enum';
import { axisLabelRender } from '../model/constant';
import { IAxisLabelRenderEventArgs } from '../model/interface';
import { VisibleLabels, Size, Align, measureText, Rect, textFormatter, formatValue, stringToNumber} from '../utils/helper';
import { valueToCoefficient, getRangePalette, VisibleRange, withInRange, calculateNiceInterval } from '../utils/helper';

/**
 * To calculate the overall axis bounds for gauge.
 *
 * @private
 */
export class AxisLayoutPanel {
    private gauge: LinearGauge;
    constructor(gauge: LinearGauge) {
        this.gauge = gauge;
    }

    /**
     * To calculate the axis bounds
     */

    public calculateAxesBounds(): void {
        let axis: Axis; let bounds: Rect;
        this.gauge.nearSizes = [];
        this.gauge.farSizes = [];
        let x: number; let y: number; let width: number; let height: number;
        const axisPadding: number = 8;
        this.checkThermometer();
        for (let i: number = 0; i < this.gauge.axes.length; i++) {
            axis = <Axis>this.gauge.axes[i as number];
            axis.checkAlign = new Align(i, ((!axis.opposedPosition) ? 'Near' : 'Far'));
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            (!axis.opposedPosition) ? this.gauge.nearSizes.push(1) : this.gauge.farSizes.push(1);
            this.calculateLineBounds(axis, i);
            this.calculateTickBounds(axis);
            this.calculateLabelBounds(axis);
            if (axis.pointers.length > 0) {
                this.calculatePointerBounds(axis);
            }
            if (axis.ranges.length > 0) {
                this.calculateRangesBounds(axis);
            }
            bounds = axis.labelBounds;
            const offset: number = this.gauge.axes[i as number].labelStyle.offset;
            if (this.gauge.orientation === 'Vertical') {
                x = (!axis.opposedPosition) ? bounds.x - offset - axisPadding : axis.lineBounds.x;
                y = axis.lineBounds.y;
                height = axis.lineBounds.height;
                width = Math.abs((!axis.opposedPosition) ? (axis.lineBounds.x - x) :
                    ((bounds.x + bounds.width + axisPadding) - x - offset));
            } else {
                y = (!axis.opposedPosition) ? bounds.y - bounds.height - offset - axisPadding : axis.lineBounds.y;
                x = axis.lineBounds.x;
                width = axis.lineBounds.width;
                height = Math.abs((!axis.opposedPosition) ? Math.abs(axis.lineBounds.y - y) : (bounds.y + axisPadding) - y - offset);
            }
            axis.bounds = new Rect(x, y, width, height);
        }
    }

    /**
     * Calculate axis line bounds
     *
     * @param axis
     * @param axisIndex
     */

    public calculateLineBounds(axis: Axis, axisIndex: number): void {
        let x: number; let y: number; let width: number; let height: number;
        let prevAxis: Axis;
        let lineHeight: number = axis.line.height;
        const orientation: Orientation = this.gauge.orientation;
        const containerRect: Rect = this.gauge.containerBounds;
        lineHeight = (axis.line.width > 0) ? lineHeight : null;
        if (orientation === 'Vertical') {
            y = (isNullOrUndefined(lineHeight)) ? containerRect.y :
                containerRect.y + ((containerRect.height / 2) - (lineHeight / 2));
            width = axis.line.width;
            height = (isNullOrUndefined(lineHeight)) ? containerRect.height : lineHeight;
        } else {
            x = (isNullOrUndefined(lineHeight)) ? containerRect.x :
                containerRect.x + ((containerRect.width / 2) - (lineHeight / 2));
            height = axis.line.width;
            width = (isNullOrUndefined(lineHeight)) ? containerRect.width : lineHeight;
        }
        let index: number = this.checkPreviousAxes(axis, axisIndex);
        let count: number = 0;
        if (!isNullOrUndefined(index)) {
            for (let i: number = index; i >= 0; i--) {
                if (this.gauge.axes[i as number].minimum !== this.gauge.axes[i as number].maximum) {
                    index = i;
                    count++;
                    break;
                }
            }
            if (count === 0) {
                index = null;
            }
        }
        if (isNullOrUndefined(index)) {
            if (orientation === 'Vertical') {
                x = (!axis.opposedPosition ? containerRect.x : containerRect.x + containerRect.width) + axis.line.offset;
            } else {
                y = (!axis.opposedPosition ? containerRect.y : containerRect.y + containerRect.height) + axis.line.offset;
            }
        } else {
            prevAxis = <Axis>this.gauge.axes[index as number];
            if (orientation === 'Vertical') {
                x = ((!axis.opposedPosition) ? prevAxis.bounds.x : (prevAxis.bounds.x + prevAxis.bounds.width)) + axis.line.offset;
            } else {
                y = ((!axis.opposedPosition) ? prevAxis.bounds.y : (prevAxis.bounds.y + prevAxis.bounds.height)) + axis.line.offset;
            }
        }
        axis.lineBounds = new Rect(x, y, width, height);
        if (axis.minimum === axis.maximum) {
            axis.lineBounds = new Rect(0, 0, 0, 0);
        }
    }

    /**
     * Calculate axis tick bounds
     *
     * @param axis
     */

    public calculateTickBounds(axis: Axis): void {
        let x: number; let y: number;
        let min: number = Math.min(axis.minimum, axis.maximum);
        const max: number = Math.max(axis.minimum, axis.maximum);
        min = (min === max) ? max - 1 : min;
        const bounds: Rect = axis.lineBounds;
        const major: Tick = <Tick>axis.majorTicks;
        const minor: Tick = <Tick>axis.minorTicks;
        axis.majorInterval = major.interval;
        axis.minorInterval = minor.interval;
        const size: number = (this.gauge.orientation === 'Vertical' ? bounds.height : bounds.width);
        const lineSize: number = (this.gauge.orientation === 'Vertical' ? bounds.width : bounds.height) / 2;
        axis.majorInterval = isNullOrUndefined(axis.majorInterval) ? calculateNiceInterval(min, max, size, this.gauge.orientation)
            : major.interval;
        axis.visibleRange = new VisibleRange(min, max, axis.majorInterval, (max - min));
        axis.minorInterval = (isNullOrUndefined(axis.minorInterval)) ? axis.majorInterval / 2 : axis.minorInterval;
        if (this.gauge.orientation === 'Vertical') {
            x = axis.majorTicks.position === 'Auto' ? ((!axis.opposedPosition ? (bounds.x - lineSize - major.height) : bounds.x + lineSize)
                + major.offset) : x;
            x = axis.majorTicks.position !== 'Auto' ? (axis.majorTicks.position === 'Cross' ? bounds.x - major.height / 2 - major.offset :
                ((axis.majorTicks.position === 'Inside' && !axis.opposedPosition) ||
                    (axis.majorTicks.position === 'Outside' && axis.opposedPosition)) ? (bounds.x - lineSize - major.height - major.offset)
                    : (bounds.x + lineSize + major.offset)) : x;
            axis.majorTickBounds = new Rect(x, bounds.y, major.height, bounds.height);
            if (axis.minimum === axis.maximum) {
                axis.majorTickBounds = new Rect(0, 0, 0, 0);
            }
            x = axis.minorTicks.position === 'Auto' ? ((!axis.opposedPosition ? (bounds.x - lineSize - minor.height) : bounds.x + lineSize)
                + minor.offset) : x;
            x = axis.minorTicks.position !== 'Auto' ? (axis.minorTicks.position === 'Cross' ? bounds.x - minor.height / 2 - minor.offset :
                ((axis.minorTicks.position === 'Inside' && !axis.opposedPosition) ||
                    (axis.minorTicks.position === 'Outside' && axis.opposedPosition)) ? (bounds.x - lineSize - minor.height - minor.offset)
                    : (bounds.x + lineSize + minor.offset)) : x;
            axis.minorTickBounds = new Rect(x, bounds.y, minor.height, bounds.height);
            if (axis.minimum === axis.maximum) {
                axis.minorTickBounds = new Rect(0, 0, 0, 0);
            }
        } else {
            y = axis.majorTicks.position === 'Auto' ? ((!axis.opposedPosition ? (bounds.y - lineSize - major.height) : bounds.y + lineSize)
                + major.offset) : y;
            y = axis.majorTicks.position !== 'Auto' ? ((axis.majorTicks.position === 'Cross' ? bounds.y - major.height / 2 - major.offset :
                ((axis.majorTicks.position === 'Inside' && !axis.opposedPosition) ||
                    (axis.majorTicks.position === 'Outside' && axis.opposedPosition)) ?
                    (bounds.y - lineSize - major.height) - major.offset : bounds.y + lineSize + major.offset)) : y;
            axis.majorTickBounds = new Rect(bounds.x, y, bounds.width, major.height);
            if (axis.minimum === axis.maximum) {
                axis.majorTickBounds = new Rect(0, 0, 0, 0);
            }
            y = axis.minorTicks.position === 'Auto' ? ((!axis.opposedPosition ? (bounds.y - lineSize - minor.height) : bounds.y + lineSize)
                + minor.offset) : y;
            y = axis.minorTicks.position !== 'Auto' ? ((axis.minorTicks.position === 'Cross' ? bounds.y - minor.height / 2 - major.offset :
                ((axis.minorTicks.position === 'Inside' && !axis.opposedPosition) ||
                    (axis.minorTicks.position === 'Outside' && axis.opposedPosition)) ?
                    (bounds.y - lineSize - minor.height) - minor.offset : bounds.y + lineSize + minor.offset)) : y;
            axis.minorTickBounds = new Rect(bounds.x, y, bounds.width, minor.height);
            if (axis.minimum === axis.maximum) {
                axis.minorTickBounds = new Rect(0, 0, 0, 0);
            }
        }
    }

    /**
     * To Calculate axis label bounds
     *
     * @param axis
     */

    public calculateLabelBounds(axis: Axis): void {
        let x: number; let y: number;
        const padding: number = 5;
        const applyPositionBounds: boolean = (axis.labelStyle.position !== 'Auto' && axis.majorTicks.position !== 'Auto' &&
            axis.minorTicks.position !== 'Auto');
        const bounds: Rect = applyPositionBounds ? (axis.labelStyle.position === axis.minorTicks.position &&
            axis.minorTicks.position !== axis.majorTicks.position ? axis.minorTickBounds : axis.majorTickBounds) :
            axis.majorTickBounds;
        const offset: number = axis.labelStyle.offset;
        this.calculateVisibleLabels(axis);
        if (axis.minimum === axis.maximum) {
            axis.labelBounds = new Rect(0, 0, 0, 0);
        } else {
            const width: number = axis.maxLabelSize.width;
            const height: number = axis.maxLabelSize.height / 2;
            if (this.gauge.orientation === 'Vertical') {
                x = axis.labelStyle.position === 'Auto' ? ((!axis.opposedPosition ? (bounds.x - width - padding) :
                    (bounds.x + bounds.width + padding)) + offset) : x;
                let boundx: number = bounds.x;
                const offsetForCross: number = axis.majorTicks.position === 'Cross' || axis.minorTicks.position === 'Cross' ?
                    (bounds.width > axis.lineBounds.width ? bounds.width / 2 : axis.lineBounds.width / 2) : axis.lineBounds.width / 2;
                boundx = applyPositionBounds ? ((axis.labelStyle.position !== axis.minorTicks.position &&
                    axis.labelStyle.position !== axis.majorTicks.position) ?
                    (axis.minorTicks.position !== 'Cross' && axis.majorTicks.position !== 'Cross' ? (axis.labelStyle.position === 'Inside' ?
                        bounds.x - axis.lineBounds.width : axis.labelStyle.position === 'Outside' ?
                            bounds.x + axis.lineBounds.width : bounds.x) : (axis.labelStyle.position === 'Inside' ?
                        axis.lineBounds.x - offsetForCross : axis.labelStyle.position === 'Outside' ?
                            axis.lineBounds.x - bounds.width + offsetForCross : bounds.x)) : bounds.x) : bounds.x;
                x = axis.labelStyle.position !== 'Auto' ? (axis.labelStyle.position === 'Cross' ? axis.lineBounds.x -
                    axis.maxLabelSize.width / 4 - offset : ((axis.labelStyle.position === 'Inside' && !axis.opposedPosition) ||
                        (axis.labelStyle.position === 'Outside' && axis.opposedPosition)) ?
                    ((boundx - width - padding) - offset) : ((boundx + bounds.width + padding) + offset)) : x;
                y = axis.lineBounds.y;
            } else {
                y = axis.labelStyle.position === 'Auto' ? ((!axis.opposedPosition ?
                    (bounds.y - padding) : ((bounds.y + bounds.height + padding) + height)) + offset) : y;
                let boundy: number = bounds.y;
                const offsetForCross: number = axis.majorTicks.position === 'Cross' || axis.minorTicks.position === 'Cross' ?
                    (bounds.height > axis.lineBounds.height ? bounds.height / 2 : axis.lineBounds.height / 2) : axis.lineBounds.height / 2;
                boundy = applyPositionBounds ? ((axis.labelStyle.position !== axis.minorTicks.position &&
                    axis.labelStyle.position !== axis.majorTicks.position) ?
                    (axis.minorTicks.position !== 'Cross' && axis.majorTicks.position !== 'Cross' ?
                        (axis.labelStyle.position === 'Inside' ? bounds.y - axis.lineBounds.height : axis.labelStyle.position === 'Outside' ?
                            bounds.y + axis.lineBounds.height : bounds.y) : (axis.labelStyle.position === 'Inside' ?
                            axis.lineBounds.y - offsetForCross : axis.labelStyle.position === 'Outside' ?
                                axis.lineBounds.y - bounds.height + offsetForCross : bounds.y)) : bounds.y) : bounds.y;
                y = axis.labelStyle.position !== 'Auto' ? (axis.labelStyle.position === 'Cross' ? axis.lineBounds.y +
                    axis.maxLabelSize.height / 4 - offset : ((axis.labelStyle.position === 'Inside' && !axis.opposedPosition) ||
                        (axis.labelStyle.position === 'Outside' && axis.opposedPosition)) ?
                    (boundy - padding) - offset : ((boundy + bounds.height + padding) + height) + offset) : y;
                x = axis.lineBounds.x;
            }
            axis.labelBounds = new Rect(x, y, width, height);
        }
    }

    /**
     * Calculate pointer bounds
     *
     * @param {Axis} axis - Specifies the axis.
     * @returns {void}
     */
    public calculatePointerBounds(axis: Axis): void {
        let pointer: Pointer;
        const range: VisibleRange = axis.visibleRange;
        const minimumValue: number = Math.min(range.min, range.max);
        const maximumValue: number = Math.max(range.min, range.max);
        for (let i: number = 0; i < axis.pointers.length; i++) {
            pointer = <Pointer>axis.pointers[i as number];
            if ((<string>pointer.offset).length > 0) {
                pointer.currentOffset = stringToNumber(<string>pointer.offset, (this.gauge.orientation === 'Horizontal' ?
                    this.gauge.availableSize.height / 2 : this.gauge.availableSize.width / 2));
            } else {
                pointer.currentOffset = <number>pointer.offset;
            }
            pointer.currentValue = pointer.value !== null ?
                pointer.value < minimumValue ? minimumValue : pointer.value > maximumValue ? maximumValue : pointer.value
                : minimumValue;
            if (pointer.width > 0 && withInRange(pointer.currentValue, null, null, range.max, range.min, 'pointer')) {
                this['calculate' + pointer.type + 'Bounds'](axis, pointer);
            }
        }
    }

    /**
     * Calculate marker pointer bounds
     *
     * @param axis
     * @param pointer
     */

    public calculateMarkerBounds(axis: Axis, pointer: Pointer): void {
        let x: number; let y: number;
        const line: Rect = axis.lineBounds;
        const offset: number = pointer.currentOffset;
        const range: VisibleRange = axis.visibleRange;
        const placement: string = pointer.placement;
        const tick: Rect = axis.majorTickBounds;
        const label: Rect = axis.labelBounds;
        const border: number = pointer.border.width;
        const textSize : Size = measureText(pointer.text, pointer.textStyle);
        if (this.gauge.orientation === 'Vertical') {
            if (pointer.position === 'Auto') {
                x = (!axis.opposedPosition) ? (placement === 'Near') ? label.x : (placement === 'Center') ? tick.x : line.x :
                    placement === 'Far' ? label.x + label.width : (placement === 'Center' ? tick.x + tick.width : line.x);
                x = !axis.opposedPosition ? ((pointer.placement === 'Far' ? ((pointer.markerType === 'Triangle' || pointer.markerType === 'Arrow') ? x - border : x + border) : ((pointer.markerType === 'InvertedTriangle' || pointer.markerType === 'InvertedArrow') ? x + border : x - border)) + (offset)) :
                    ((pointer.placement === 'Near' ? ((pointer.markerType === 'InvertedTriangle' || pointer.markerType === 'InvertedArrow') ? x + border : x - border) : ((pointer.markerType === 'Triangle' || pointer.markerType === 'Arrow') ? x - border : x + border)) + (offset));
            } else {
                x = (pointer.position === 'Cross' ? line.x - (pointer.markerType === 'Text' ? textSize.width : pointer.width / 2) - offset :
                    ((pointer.position === 'Inside' && !axis.opposedPosition) ||
                        (pointer.position === 'Outside' && axis.opposedPosition)) ?
                        (line.x - line.width / 2 - (pointer.markerType !== 'InvertedTriangle' && pointer.markerType !== 'Triangle' ?
                            (pointer.markerType === 'Text' ? textSize.width : pointer.width) : 0)) - offset : ((line.x + line.width / 2) + offset));
            }
            y = ((valueToCoefficient(pointer.currentValue, axis, this.gauge.orientation, range) * line.height) + line.y);
        } else {
            if (pointer.position === 'Auto') {
                y = (!axis.opposedPosition) ? (placement === 'Near') ? label.y - label.height : (placement === 'Center') ? tick.y :
                    line.y : (placement === 'Far') ? label.y : (placement === 'Center') ? tick.y + tick.height : line.y;
                y = !axis.opposedPosition ? ((pointer.placement === 'Far' ? ((pointer.markerType === 'Triangle' || pointer.markerType === 'Arrow') ? y - border : y + border) : ((pointer.markerType === 'InvertedTriangle' || pointer.markerType === 'InvertedArrow') ? y + border : y - border)) + (offset)) :
                    ((pointer.placement === 'Near' ? ((pointer.markerType === 'InvertedTriangle' || pointer.markerType === 'InvertedArrow') ? y + border : y - border) : ((pointer.markerType === 'Triangle' || pointer.markerType === 'Arrow') ? y - border : y + border)) + (offset));
            } else {
                y = (pointer.position === 'Cross' ? line.y - ((pointer.markerType === 'Text' ? textSize.height : pointer.height) / 2) - offset :
                    ((pointer.position === 'Inside' && !axis.opposedPosition) ||
                        (pointer.position === 'Outside' && axis.opposedPosition)) ?
                        (line.y - line.height / 2 - (pointer.markerType !== 'InvertedTriangle' && pointer.markerType !== 'Triangle' ?
                            (pointer.markerType === 'Text' ? textSize.height : pointer.height) : 0)) - offset : ((line.y + line.height / 2) + offset));
            }
            x = ((valueToCoefficient(pointer.currentValue, axis, this.gauge.orientation, range) * line.width) + line.x);
        }
        pointer.bounds = new Rect(x, y, pointer.width, pointer.height);
        if (axis.minimum === axis.maximum) {
            pointer.bounds = new Rect(0, 0, 0, 0);
            pointer.width = 0;
            pointer.height = 0;
        }
    }

    /**
     * Calculate bar pointer bounds
     *
     * @param axisIndex
     * @param axis
     * @param pointerIndex
     * @param pointer
     */

    public calculateBarBounds(axis: Axis, pointer: Pointer): void {
        let x1: number; let x2: number; let y1: number;
        let y2: number; let height: number; let width: number;
        const line: Rect = axis.lineBounds;
        const padding: number = 10;
        const range: VisibleRange = axis.visibleRange;
        const orientation: Orientation = this.gauge.orientation;
        const offset: number = pointer.currentOffset;
        const container: Rect = this.gauge.containerBounds;
        if (orientation === 'Vertical') {
            if (pointer.position === 'Auto') {
                x1 = (container.width > 0) ? container.x + ((container.width / 2) - (pointer.width / 2)) :
                    (!axis.opposedPosition) ? (line.x + padding) : (line.x - pointer.width - padding);
                x1 += (offset);
            } else {
                x1 = (pointer.position === 'Cross' ? line.x - pointer.width / 2 - offset :
                    ((pointer.position === 'Inside' && !axis.opposedPosition) ||
                        (pointer.position === 'Outside' && axis.opposedPosition)) ?
                        (line.x - line.width / 2 - pointer.width) - offset : ((line.x + line.width / 2) + offset));
            }
            y1 = ((valueToCoefficient(pointer.currentValue, axis, orientation, range) * line.height) + line.y);
            y2 = ((valueToCoefficient(range.min, axis, orientation, range) * line.height) + line.y);
            height = Math.abs(y2 - y1);
            y1 = (!axis.isInversed) ? y1 : y2;
            width = pointer.width;
        } else {
            if (pointer.position === 'Auto') {
                y1 = (container.height > 0) ? (container.y + (container.height / 2) - (pointer.height) / 2) :
                    (!axis.opposedPosition) ? (line.y + padding) : (line.y - pointer.height - padding);
                y1 += (offset);
            } else {
                y1 = (pointer.position === 'Cross' ? line.y - pointer.height / 2 - offset :
                    ((pointer.position === 'Inside' && !axis.opposedPosition) ||
                        (pointer.position === 'Outside' && axis.opposedPosition)) ?
                        (line.y - line.height / 2 - pointer.height) - offset : ((line.y + line.height / 2) + offset));
            }
            height = pointer.height;
            x1 = ((valueToCoefficient(range.min, axis, orientation, range) * line.width) + line.x);
            x2 = ((valueToCoefficient(pointer.currentValue, axis, orientation, range) * line.width) + line.x);
            width = Math.abs(x2 - x1);
            x1 = (!axis.isInversed) ? x1 : x2;
        }
        pointer.bounds = new Rect(x1, y1, width, height);
        if (axis.minimum === axis.maximum) {
            pointer.bounds = new Rect(0, 0, 0, 0);
            pointer.width = 0;
            pointer.height = 0;
        }
    }

    /**
     * Calculate ranges bounds
     *
     * @param axis
     * @param axisIndex
     */

    public calculateRangesBounds(axis: Axis): void {
        let range: Range;
        let start: number; let end: number;
        const line: Rect = axis.lineBounds;
        const visibleRange: VisibleRange = axis.visibleRange;
        const orientation: Orientation = this.gauge.orientation;
        let startVal: number; let endVal: number;
        let pointX: number; let pointY: number;
        let width: number; let height: number;
        let position: Position;
        let gradientRangeColor: string;
        let startWidth: number; let endWidth: number;
        let colors: string[];
        for (let i: number = 0; i < axis.ranges.length; i++) {
            range = <Range>axis.ranges[i as number];
            if (this.gauge.gradientModule) {
                gradientRangeColor = this.gauge.gradientModule.getGradientColorString(range);
            }
            if ((<string>range.offset).length > 0) {
                range.currentOffset = stringToNumber(<string>range.offset, (this.gauge.orientation === 'Horizontal' ?
                    this.gauge.availableSize.height / 2 : this.gauge.availableSize.width / 2));
            } else {
                range.currentOffset = <number>range.offset;
            }
            start = Math.max(range.start, visibleRange.min);
            end = Math.min(range.end, visibleRange.max);
            if (withInRange(null, start, end, visibleRange.max, visibleRange.min, 'range')) {
                end = Math.max(start, end);
                start = Math.min(start, range.end);
                position = range.position;
                startWidth = range.startWidth;
                endWidth = range.endWidth;
                colors = this.gauge.rangePalettes.length ? this.gauge.rangePalettes : getRangePalette(this.gauge.theme);
                range.interior = (gradientRangeColor) ? gradientRangeColor :
                    (range.color) ? range.color : colors[i % colors.length];
                if (this.gauge.orientation === 'Vertical') {
                    pointX = line.x + (range.currentOffset) + (position === 'Cross' ? startWidth / 2 :
                        (position === 'Outside' || position === 'Auto') ?
                            - (line.width / 2) : position === 'Inside' ? line.width / 2 : 0);
                    pointY = (valueToCoefficient(end, axis, orientation, visibleRange) * line.height) + line.y;
                    height = (valueToCoefficient(start, axis, orientation, visibleRange) * line.height) + line.y;
                    height -= pointY;
                    startVal = !axis.opposedPosition ? (position === 'Inside' ? (pointX + startWidth) : position === 'Cross' ?
                        (pointX - startWidth) : (pointX - startWidth)) : (position === 'Inside' ? (pointX - startWidth) :
                        position === 'Cross' ? (pointX - startWidth) : (pointX + startWidth));
                    endVal = !axis.opposedPosition ? position === 'Inside' ? (pointX + endWidth) : position === 'Cross' ?
                        (pointX - endWidth) : (pointX - endWidth) : position === 'Inside' ? (pointX - endWidth) :
                        position === 'Cross' ? (pointX - endWidth) : (pointX + endWidth);
                    range.path = 'M' + pointX + ' ' + pointY + ' L ' + pointX + ' ' + (pointY + height) +
                        ' L ' + startVal + ' ' + (pointY + height) + ' L ' + endVal + ' ' + pointY +
                        ' L ' + pointX + ' ' + pointY + ' z ';
                } else {
                    pointX = (valueToCoefficient(end, axis, orientation, visibleRange) * line.width) + line.x;
                    pointY = axis.lineBounds.y + (range.currentOffset) + (position === 'Cross' ? startWidth / 2 :
                        (position === 'Outside' || position === 'Auto') ? -(line.height / 2) : position === 'Inside' ? line.height / 2 : 0);
                    width = (valueToCoefficient(start, axis, orientation, visibleRange) * line.width) + line.x;
                    width = pointX - width;
                    startVal = !axis.opposedPosition ? position === 'Inside' ? (pointY + startWidth) : position === 'Cross' ?
                        (pointY - startWidth) : (pointY - startWidth) : (position === 'Inside') ? (pointY - startWidth) :
                        position === 'Cross' ? (pointY - startWidth) : (pointY + startWidth);
                    endVal = !axis.opposedPosition ? position === 'Inside' ? (pointY + endWidth) : position === 'Cross' ?
                        (pointY - endWidth) : (pointY - endWidth) : (position === 'Inside') ? (pointY - endWidth) :
                        position === 'Cross' ? (pointY - endWidth) : (pointY + endWidth);
                    range.path = 'M' + pointX + ' ' + pointY + ' L ' + (pointX - width) + ' ' + pointY +
                        ' L ' + (pointX - width) + ' ' + startVal + ' L ' + pointX + ' ' + endVal +
                        ' L ' + pointX + ' ' + pointY + ' z ';
                }
            }
        }
    }

    private checkPreviousAxes(currentAxis: Axis, axisIndex: number): number {
        let index: number = axisIndex - 1;
        let prevAxis: Axis;
        const isPositive: boolean = (index >= 0) ? true : false;
        if (isPositive) {
            prevAxis = <Axis>this.gauge.axes[index as number];
            index = (prevAxis.checkAlign.align === currentAxis.checkAlign.align) ? index : this.checkPreviousAxes(currentAxis, index);
        } else {
            index = null;
        }
        return index;
    }

    /**
     *
     * @param {Axis} axis - Specifies the axis to which labels are to be rendered.
     * @returns {void}
     */
    public calculateVisibleLabels(axis: Axis): void {
        axis.visibleLabels = [];
        if (axis.minimum !== axis.maximum) {
            const min: number = axis.visibleRange.min;
            const max: number = axis.visibleRange.max;
            const interval: number = axis.visibleRange.interval;
            let argsData: IAxisLabelRenderEventArgs;
            const style: Label = <Label>axis.labelStyle; let labelSize: Size;
            const customLabelFormat: boolean = style.format && style.format.match('{value}') !== null;
            for (let i: number = min; (i <= max && interval > 0); i += interval) {
                let currentAxisValue: number = i;
                if (currentAxisValue.toString().indexOf('e') !== -1 && isNullOrUndefined(this.gauge.format)) {
                    const exponent: number = parseInt(currentAxisValue.toString().split('-')[1], 10);
                    currentAxisValue = parseInt(currentAxisValue.toFixed(exponent as number), 10);
                }
                argsData = {
                    cancel: false, name: axisLabelRender, axis: axis,
                    text: customLabelFormat ? textFormatter(style.format, { value: currentAxisValue }, this.gauge) :
                        formatValue(currentAxisValue, this.gauge).toString(),
                    value: currentAxisValue
                };
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const axisLabelRenderSuccess: any = (argsData: IAxisLabelRenderEventArgs) => {
                    if (!argsData.cancel) {
                        axis.visibleLabels.push(new VisibleLabels(
                            argsData.text, currentAxisValue, labelSize
                        ));
                    }
                };
                axisLabelRenderSuccess.bind(this);
                this.gauge.trigger(axisLabelRender, argsData, axisLabelRenderSuccess);

            }
            const lastLabel: number = axis.visibleLabels.length ? axis.visibleLabels[axis.visibleLabels.length - 1].value : null;
            const maxVal: number = axis.visibleRange.max;
            if (lastLabel !== maxVal && axis.showLastLabel === true) {
                argsData = {
                    cancel: false, name: axisLabelRender, axis: axis,
                    text: customLabelFormat ? textFormatter(style.format, { value: maxVal }, this.gauge) :
                        formatValue(maxVal, this.gauge).toString(),
                    value: maxVal
                };
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const axisLabelRenderSuccess: any = (argsData: IAxisLabelRenderEventArgs) => {
                    labelSize = measureText(argsData.text, axis.labelStyle.font);
                    if (!argsData.cancel) {
                        axis.visibleLabels.push(new VisibleLabels(
                            argsData.text, maxVal, labelSize
                        ));
                    }
                };
                axisLabelRenderSuccess.bind(this);
                this.gauge.trigger(axisLabelRender, argsData, axisLabelRenderSuccess);
            }
            this.getMaxLabelWidth(axis);
        }
    }

    /**
     * Calculate maximum label width for the axis.
     *
     * @param {Axis} axis - Specifies the axis to which the labels are to be rendered.
     * @return {void}
     * @private
     */

    private getMaxLabelWidth(axis: Axis): void {
        axis.maxLabelSize = new Size(0, 0);
        let label: VisibleLabels;
        for (let i: number = 0; i < axis.visibleLabels.length; i++) {
            label = axis.visibleLabels[i as number];
            label.size = measureText(label.text, axis.labelStyle.font);
            if (label.size.width > axis.maxLabelSize.width) {
                axis.maxLabelSize.width = label.size.width;
            }
            if (label.size.height > axis.maxLabelSize.height) {
                axis.maxLabelSize.height = label.size.height;
            }
        }
    }

    private checkThermometer(): void {
        if (this.gauge.container.type === 'Thermometer') {
            this.gauge.axes.map((axis: Axis) => {
                if (axis.isInversed) {
                    axis.pointers.map((pointer: Pointer) => {
                        if (pointer.type === 'Bar') {
                            axis.isInversed = false;
                        }
                    });
                }
            });
        }
    }

    /**
     * @private
     */
    public destroy(): void {
        this.gauge = null;
    }
}
