/* eslint-disable max-len */
import { CircularGauge } from '../circular-gauge';
import { Axis, Label, Range, Tick } from './axis';
import { stringToNumber, toPixel, textElement, appendPath, getAngleFromValue, getLocationFromAngle, getPathArc, getRoundedPathArc, VisibleLabels, getDegree, isCompleteAngle, PathOption, GaugeLocation, TextOption } from '../utils/helper-common';
import { getRangeColor } from '../utils/helper-axis-renderer';
import { TickModel } from './axis-model';
import { getRangePalette } from '../model/theme';
import { isNullOrUndefined } from '@syncfusion/ej2-base';

/**
 * Specifies the Axis rendering for circular gauge
 */

export class AxisRenderer {

    private majorValues: number[];
    private gauge: CircularGauge;
    /**
     * Constructor for axis renderer.
     *
     * @param {CircularGauge} gauge - Specifies the instance of the gauge
     * @private.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    constructor(gauge: CircularGauge) {
        this.gauge = gauge;
    }

    /**
     * Method to render the axis element of the circular gauge.
     *
     * @param {Axis} axis - Specifies the axis.
     * @param {number} index - Specifies the index.
     * @param {Element} element - Specifies the element.
     * @param {CircularGauge} gauge - Specifies the gauge.
     * @returns {void}
     * @private
     */
    public drawAxisOuterLine(axis: Axis, index: number, element: Element, gauge: CircularGauge): void {
        const background: string = axis.background;
        this.setRangeColor(axis);
        if (background !== null) {
            appendPath(
                new PathOption(
                    gauge.element.id + '_AxisOuterLine_' + index,
                    background, 0, 'transparent', null, '0',
                    getPathArc(gauge.midPoint, 0, 360, (Math.min(axis.rect.width, axis.rect.height) / 2)), '',
                    'pointer-events:none;'),
                element, gauge
            );
        }
    }

    /**
     * Method to check the angles.
     *
     * @param {Axis} axis - Specifies the axis.
     * @returns {void}
     * @private
     */
    public checkAngles(axis: Axis): void {
        axis.startAngle = axis.startAngle >= 360 ? 360 : axis.startAngle <= -360 ? -360 : axis.startAngle;
        axis.endAngle = axis.endAngle >= 360 ? 360 : axis.endAngle <= -360 ? -360 : axis.endAngle;
    }

    /**
     * Method to render the axis line of the circular gauge.
     *
     * @param {Axis} axis - Specifies the axis.
     * @param {number} index - Specifies the index.
     * @param {Element} element - Specifies the element.
     * @param {CircularGauge} gauge - Specifies the gauge.
     * @returns {void}
     * @private
     */
    public drawAxisLine(axis: Axis, index: number, element: Element, gauge: CircularGauge): void {
        let startAngle: number = axis.startAngle;
        let endAngle: number = axis.endAngle;
        const color: string = axis.lineStyle.color || this.gauge.themeStyle.lineColor;
        if (axis.lineStyle.width > 0 && this.gauge.allowComponentRender) {
            startAngle = !isCompleteAngle(startAngle, endAngle) ? startAngle : [0, endAngle = 360][0];
            appendPath(
                new PathOption(
                    gauge.element.id + '_AxisLine_' + index, 'transparent', axis.lineStyle.width, color,
                    null, axis.lineStyle.dashArray,
                    getPathArc(gauge.midPoint, startAngle - 90, endAngle - 90, axis.currentRadius),
                    '', 'pointer-events:none;'),
                element, gauge
            );
        }
    }

    /**
     * Method to render the axis labels of the circular gauge.
     *
     * @param {Axis} axis - Specifies the axis.
     * @param {number} index - Specifies the index.
     * @param {Element} element - Specifies the element.
     * @param {CircularGauge} gauge - Specifies the gauge.
     * @returns {void}
     * @private
     */
    public drawAxisLabels(axis: Axis, index: number, element: Element, gauge: CircularGauge): void {
        const labelElement: Element = gauge.renderer.createGroup({
            id: gauge.element.id + '_Axis_Labels_' + index
        });
        const min: number = axis.visibleRange.min;
        const max: number = axis.visibleRange.max;
        const labelCollection: VisibleLabels[] = axis.visibleLabels;
        let location: GaugeLocation;
        let textWidth: number; let textHeight: number; let labelsVisible: boolean = true;
        let currentTextWidth: number; let currentTextHeight: number;
        let previousLocation: GaugeLocation; let currentLocation: GaugeLocation;
        let lastLabelLocation: GaugeLocation;
        let lastLabelAngle: number; let lastLabelAnchor: string;
        let lastTextWidth: number; let lastTextHeight: number;
        const style: Label = <Label>axis.labelStyle; let anchor: string; let angle: number;
        let label: VisibleLabels; let radius: number = axis.currentRadius;
        let checkLabelOpposed: number = 0;
        checkLabelOpposed = (style.position === 'Inside' && axis.majorTicks.position === 'Outside' &&
            axis.minorTicks.position === 'Outside') || (style.position === 'Outside' &&
                axis.minorTicks.position === 'Inside' && axis.majorTicks.position === 'Inside') ?
            axis.lineStyle.width + axis.currentRadius / 20 :
            (style.position === axis.majorTicks.position ? axis.currentRadius / 20 : axis.currentRadius / 40);
        const labelPadding: number = axis.labelStyle.shouldMaintainPadding ? 10 : checkLabelOpposed;
        const color: string = style.font.color || this.gauge.themeStyle.labelColor;
        if (style.position === 'Outside') {
            radius += (axis.nearSize - (axis.maxLabelSize.height + axis.lineStyle.width / 2)) + (labelPadding / 2);
        } else if (style.position === 'Cross') {
            radius = radius - (axis.maxLabelSize.height / 4) - axis.labelStyle.offset;
        } else {
            radius -= (axis.farSize - (axis.maxLabelSize.height + axis.lineStyle.width / 2) + (style.autoAngle ? labelPadding : 0));
        }
        //To get and store lastlabelposition
        if (axis.hideIntersectingLabel) {
            lastLabelAngle = Math.round(getAngleFromValue(labelCollection[labelCollection.length - 1].value, max,
                                                          min, axis.startAngle, axis.endAngle, axis.direction === 'ClockWise'));
            lastLabelLocation = getLocationFromAngle(lastLabelAngle, radius, gauge.midPoint);
            lastLabelAnchor = this.findAnchor(lastLabelLocation, style, lastLabelAngle, labelCollection[labelCollection.length - 1]);
            lastTextWidth = (!axis.showLastLabel && (isCompleteAngle(axis.startAngle, axis.endAngle)) && (style.hiddenLabel !== 'First')) ?
                labelCollection[0].size.width : labelCollection[labelCollection.length - 1].size.width;
            lastTextHeight = (!axis.showLastLabel && (isCompleteAngle(axis.startAngle, axis.endAngle)) && (style.hiddenLabel !== 'First')) ?
                (!style.autoAngle ? labelCollection[0].size.height : labelCollection[0].size.width) :
                (!style.autoAngle ? labelCollection[labelCollection.length - 1].size.height :
                    labelCollection[labelCollection.length - 1].size.width);
            lastTextHeight = lastTextHeight - this.offsetAxisLabelsize(lastLabelAngle, lastTextHeight);
            lastLabelLocation = this.getAxisLabelStartPosition(lastLabelLocation, lastTextWidth, style, lastTextHeight, lastLabelAnchor,
                                                               lastLabelAngle);
        }
        for (let i: number = 0, length: number = labelCollection.length; i < length; i++) {
            label = labelCollection[i];
            angle = Math.round(getAngleFromValue(label.value, max, min, axis.startAngle, axis.endAngle, axis.direction === 'ClockWise'));
            location = getLocationFromAngle(angle, radius, gauge.midPoint);
            anchor = this.findAnchor(location, style, angle, label);
            //To get the current label and previous label position for initial stage
            if (axis.hideIntersectingLabel) {
                currentLocation = getLocationFromAngle(angle, radius, gauge.midPoint);
                currentTextWidth = label.size.width;
                currentTextHeight = !style.autoAngle ? label.size.height : currentTextWidth;
                currentTextHeight = currentTextHeight - this.offsetAxisLabelsize(angle, currentTextHeight);
                currentLocation = this.getAxisLabelStartPosition(currentLocation, currentTextWidth, style, currentTextHeight, anchor,
                                                                 angle);
                if (i === 0) {
                    previousLocation = getLocationFromAngle(angle, radius, gauge.midPoint);
                    textWidth = label.size.width;
                    textHeight = !style.autoAngle ? label.size.height : textWidth;
                    textHeight = textHeight - this.offsetAxisLabelsize(angle, textHeight);
                    previousLocation = this.getAxisLabelStartPosition(previousLocation, textWidth, style, textHeight, anchor, angle);
                }
            }
            if ((i === 0 && style.hiddenLabel === 'First') || (i === (length - 1) && style.hiddenLabel === 'Last')) {
                continue;
            }
            style.font.fontFamily = style.font.fontFamily || this.gauge.themeStyle.labelFontFamily;
            if (axis.hideIntersectingLabel && (i !== 0)) {
                //To remove the labels which is intersecting with last label.
                const lastlabel: boolean = ((i !== (labelCollection.length - 1)) && ((isCompleteAngle(axis.startAngle, axis.endAngle) ||
                    axis.showLastLabel))) ? this.FindAxisLabelCollision(lastLabelLocation, lastTextWidth, lastTextHeight, currentLocation,
                                                                        currentTextWidth, currentTextHeight) : true;
                //Checking wether the axis label is intersecting with previous label or not.
                labelsVisible = (this.FindAxisLabelCollision(previousLocation, textWidth, textHeight, currentLocation, currentTextWidth,
                                                             currentTextHeight) && lastlabel);
            } else {
                labelsVisible = true;
            }
            if (labelsVisible || (i === labelCollection.length - 1)) {
                //To hide first and last label based on requirement
                label.text = (!axis.showLastLabel && ((isCompleteAngle(axis.startAngle, axis.endAngle) && style.hiddenLabel !== 'First') ||
                    !labelsVisible)
                    && axis.hideIntersectingLabel && (i === (length - 1))) ? '' : label.text;
                label.text = (axis.showLastLabel && axis.hideIntersectingLabel && isCompleteAngle(axis.startAngle, axis.endAngle)
                    && (i === 0)) ? '' : label.text;
                textElement(
                    new TextOption(
                        gauge.element.id + '_Axis_' + index + '_Label_' + i,
                        location.x, location.y, anchor, label.text,
                        style.autoAngle ? 'rotate(' + (angle + 90) + ',' + (location.x) + ',' + location.y + ')' : '', 'auto'
                    ),
                    style.font, style.useRangeColor ? getRangeColor(label.value, <Range[]>axis.ranges, color) : color,
                    labelElement, 'pointer-events:none;'
                );
                if (axis.hideIntersectingLabel) {
                    textWidth = label.size.width;
                    textHeight = !style.autoAngle ? label.size.height : textWidth;
                    textHeight = textHeight - this.offsetAxisLabelsize(angle, textHeight);
                    previousLocation.x = currentLocation.x;
                    previousLocation.y = currentLocation.y;
                }
            }
        }
        element.appendChild(labelElement);
    }

    /**
     * Method to find the anchor of the axis label.
     *
     * @param {GaugeLocation} location - Specifies the location.
     * @param {Label} style - Specifies the label style.
     * @param {number} angle - Specifies the angle.
     * @param {VisibleLabels} label - Specifies the labels.
     * @returns {string} - Returns the anchor.
     * @private
     */
    private findAnchor(location: GaugeLocation, style: Label, angle: number, label: VisibleLabels): string {
        if (style.autoAngle) {
            return 'middle';
        }
        const anchor: string = style.position === 'Inside' ?
            ((angle > 120 && angle < 240) ? 'start' : ((300 < angle || angle < 60) ? 'end' : 'middle')) :
            ((angle > 120 && angle < 240) ? 'end' : ((300 < angle || angle < 60) ? 'start' : 'middle'));
        location.y += style.position === 'Inside' ?
            ((angle >= 240 && angle <= 300) ? (label.size.height / 2) :
                (angle >= 60 && angle <= 120) ? 0 : label.size.height / 4) :
            ((angle >= 240 && angle <= 300) ? 0 :
                (angle >= 60 && angle <= 120) ? label.size.height / 2 : label.size.height / 4);
        return anchor;
    }

    /**
     * Methode to check whether the labels are intersecting or not.
     *
     * @param {GaugeLocation} previousLocation - Specifies the previous location.
     * @param {number} previousWidth - Specifies the previous width.
     * @param {number} previousHeight - Specifies the previous height.
     * @param {GaugeLocation} currentLocation - Specifies the current location.
     * @param {number} currentWidth - Specifies the current width.
     * @param {number} currentHeight - Specifies the current height.
     * @returns {boolean} - Returns the boolean value.
     * @private
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    private FindAxisLabelCollision(previousLocation: GaugeLocation, previousWidth: number, previousHeight: number,
                                   currentLocation: GaugeLocation, currentWidth: number, currentHeight: number): boolean {
        const labelVisisble: boolean = ((previousLocation.x > (currentLocation.x + (currentWidth))) ||
            ((previousLocation.x + (previousWidth)) < (currentLocation.x)) ||
            ((previousLocation.y + (previousHeight)) < (currentLocation.y)) ||
            ((previousLocation.y) > (currentLocation.y + (currentHeight))));
        return labelVisisble;
    }

    /**
     * Methode to get anchor position of label as start.
     *
     * @param {GaugeLocation} actualLocation - Specifies the actual location.
     * @param {number} textWidth - Specifies the text width.
     * @param {Label} style - Specifies the label style.
     * @param {number} textHeight - Specifies the text height.
     * @param {string} anchorPosition - Specifies the anchor position.
     * @param {number} angle - Specifies the angle.
     * @returns {GaugeLocation} - Returns the gauge location.
     * @private
     */
    private getAxisLabelStartPosition(actualLocation: GaugeLocation, textWidth: number, style: Label, textHeight: number,
                                      anchorPosition: string, angle: number): GaugeLocation {
        if (anchorPosition === 'end') {
            actualLocation.x = actualLocation.x - textWidth;
        } else if (anchorPosition === 'middle') {
            actualLocation.x = actualLocation.x - (textWidth / 2);
        }
        return actualLocation;
    }

    /**
     * Methode to offset label height and width based on angle.
     *
     * @param {number} angle - Specifies the angle.
     * @param {number} size - Specifies the size.
     * @returns {number} - Returns the fineal size.
     * @private
     */
    private offsetAxisLabelsize(angle: number, size: number): number {
        const finalSize: number = ((angle >= 20 && angle <= 60) || (angle >= 120 && angle <= 160) || (angle >= 200 && angle <= 240) ||
            (angle >= 300 && angle <= 340)) ? size / 5 : 0;
        return finalSize;
    }

    /**
     * Method to render the axis minor tick lines of the circular gauge.
     *
     * @param {Axis} axis - Specifies the axis.
     * @param {number} index - Specifies the index.
     * @param {Element} element - Specifies the element.
     * @param {CircularGauge} gauge - Specifies the gauge.
     * @returns {void}
     * @private
     */
    public drawMinorTickLines(axis: Axis, index: number, element: Element, gauge: CircularGauge): void {
        const minorTickElements: Element = gauge.renderer.createGroup({
            id: gauge.element.id + '_Axis_MinorTickLines_' + index
        });
        const minorLineStyle: TickModel = axis.minorTicks;
        const minorInterval: number = minorLineStyle.interval !== null ?
            minorLineStyle.interval : (axis.visibleRange.interval / 2);
        const isRangeColor: boolean = minorLineStyle.useRangeColor;
        const color: string = minorLineStyle.color || this.gauge.themeStyle.minorTickColor;
        if (minorLineStyle.width && minorLineStyle.height && minorInterval) {
            for (let i: number = axis.visibleRange.min, max: number = axis.visibleRange.max; i <= max; i += minorInterval) {
                if (this.majorValues.indexOf(+i.toFixed(3)) < 0) {
                    appendPath(
                        new PathOption(
                            gauge.element.id + '_Axis_Minor_TickLine_' + index + '_' + i, 'transparent', minorLineStyle.width,
                            isRangeColor ? getRangeColor(i, <Range[]>axis.ranges, color) : color,
                            null, minorLineStyle.dashArray, this.calculateTicks(i, <Tick>minorLineStyle, axis), '', 'pointer-events:none;'
                        ),
                        minorTickElements, gauge
                    );
                }
            }
            element.appendChild(minorTickElements);
        }
    }

    /**
     * Method to render the axis major tick lines of the circular gauge.
     *
     * @param {Axis} axis - Specifies the axis.
     * @param {number} index - Specifies the index.
     * @param {Element} element - Specifies the element.
     * @param {CircularGauge} gauge - Specifies the gauge.
     * @returns {void}
     * @private
     */
    public drawMajorTickLines(axis: Axis, index: number, element: Element, gauge: CircularGauge): void {
        const majorTickElements: Element = gauge.renderer.createGroup({
            id: gauge.element.id + '_Axis_MajorTickLines_' + index
        });
        const majorLineStyle: TickModel = axis.majorTicks;
        const isRangeColor: boolean = majorLineStyle.useRangeColor;
        this.majorValues = [];
        const color: string = majorLineStyle.color || this.gauge.themeStyle.majorTickColor;
        if (majorLineStyle.width && majorLineStyle.height && axis.visibleRange.interval) {
            for (let i: number = axis.visibleRange.min, max: number = axis.visibleRange.max,
                interval: number = axis.visibleRange.interval; i <= max; i += interval) {
                this.majorValues.push(+i.toFixed(3));
                appendPath(
                    new PathOption(
                        gauge.element.id + '_Axis_Major_TickLine_' + index + '_' + i, 'transparent', majorLineStyle.width,
                        isRangeColor ? getRangeColor(i, <Range[]>axis.ranges, color) : color,
                        null, majorLineStyle.dashArray, this.calculateTicks(i, <Tick>majorLineStyle, axis), '', 'pointer-events:none;'
                    ),
                    majorTickElements, gauge
                );
            }
            element.appendChild(majorTickElements);
        }
    }

    /**
     * Method to calcualte the tick elements for the circular gauge.
     *
     * @param {number} value - Specifies the value.
     * @param {Tick} options - Specifies the options.
     * @param {Axis} axis - Specifies the axis.
     * @returns {string} - Returns the string.
     * @private
     */
    public calculateTicks(value: number, options: Tick, axis: Axis): string {
        const axisLineWidth: number = (axis.lineStyle.width / 2) + options.offset;
        const angle: number = getAngleFromValue(
            value, axis.visibleRange.max, axis.visibleRange.min,
            axis.startAngle, axis.endAngle, axis.direction === 'ClockWise'
        );
        const start: GaugeLocation =
            getLocationFromAngle(angle, axis.currentRadius +
                (options.position === 'Outside' ? axisLineWidth : options.position === 'Cross' ?
                    options.height / 2 - options.offset : -axisLineWidth),
                                 this.gauge.midPoint);
        const end: GaugeLocation =
            getLocationFromAngle(angle, axis.currentRadius +
                (options.position === 'Outside' ? axisLineWidth : options.position === 'Cross' ?
                    options.height / 2 - options.offset : -axisLineWidth) +
                (options.position === 'Outside' ? options.height : -options.height),
                                 this.gauge.midPoint);
        return 'M ' + start.x + ' ' + start.y + ' L ' + end.x + ' ' + end.y + ' ';
    }

    /**
     * Method to render the range path of the circular gauge.
     *
     * @param {Axis} axis - Specifies the axis.
     * @param {Range} range - Specifies the range.
     * @param {number} startWidth - Specifies the startwidth for the range.
     * @param {number} endWidth - Specifies the endwidth for the range.
     * @param {number} rangeIndex - Specifies the index of the range.
     * @param {number} index - Specifies the index of the axis.
     * @param {Element} rangeElement - Specifies the element.
     * @param {number} colorIndex - Specifies the index of the lineargradient colorstop.
     * @returns {void}
     * @private
     */
    /* eslint-disable @typescript-eslint/dot-notation */
    public drawRangePath(
        axis: Axis, range: Range, startWidth: number, endWidth: number,
        rangeIndex: number, index: number, rangeElement: Element, colorIndex: number
    ): void {
        let startValue: number; let direction: string;
        let endValue: number;
        const location: GaugeLocation = this.gauge.midPoint;
        let startAngle: number;
        let endAngle: number;
        const isClockWise: boolean = axis.direction === 'ClockWise';
        const min: number = axis.visibleRange.min;
        const max: number = axis.visibleRange.max;
        let roundedStartAngle: number;
        let roundedEndAngle: number;
        let oldStart: number;
        let oldEnd: number;
        let gradientRangeColor: string;
        if (range.isLinearCircularGradient) {
            const rangeSplitValue: number = ((range.end - range.start) / range.linearGradient.colorStop.length);
            const rangeStart: number = range.linearGradient.colorStop.length > 1 ?
                (range.start + (rangeSplitValue * (colorIndex))) : range.start;
            const rangeEnd: number = range.linearGradient.colorStop.length > 1 ? (rangeStart + rangeSplitValue) : range.end;
            startValue = Math.min(Math.max(rangeStart, min), rangeEnd);
            endValue = Math.min(Math.max(rangeStart, rangeEnd), max);
        } else {
            startValue = Math.min(Math.max(range.start, min), range.end);
            endValue = Math.min(Math.max(range.start, range.end), max);
        }
        startAngle = getAngleFromValue(startValue, max, min, axis.startAngle, axis.endAngle, isClockWise);
        endAngle = getAngleFromValue(endValue, max, min, axis.startAngle, axis.endAngle, isClockWise);
        const isAngleCross360: boolean = (startAngle > endAngle);
        if (axis.rangeGap != null && axis.rangeGap > 0 && range.start !== range.end
            || (!isNullOrUndefined(range.linearGradient) && !range.isLinearCircularGradient
                && (colorIndex === range.linearGradient.colorStop.length - 1))) {
            startAngle = (rangeIndex === 0 && !axis.startAndEndRangeGap) ? startAngle :
                colorIndex === 0 && range.isLinearCircularGradient ? axis.direction === 'AntiClockWise' ?
                    startAngle - (axis.rangeGap / Math.PI) :
                    startAngle + (axis.rangeGap / Math.PI) : !range.isLinearCircularGradient
                    ? (axis.direction === 'AntiClockWise' ? startAngle - (axis.rangeGap / Math.PI) :  startAngle + (axis.rangeGap / Math.PI)) : startAngle;
            endAngle = (rangeIndex === axis.ranges.length - 1 && !axis.startAndEndRangeGap) ? endAngle :
                !isNullOrUndefined(range.linearGradient) && colorIndex === range.linearGradient.colorStop.length - 1
				&& range.isLinearCircularGradient ?
                    axis.direction === 'AntiClockWise' ? endAngle + (axis.rangeGap / Math.PI) :
                        endAngle - (axis.rangeGap / Math.PI) : !range.isLinearCircularGradient ?
                        (axis.direction === 'AntiClockWise' ? endAngle + (axis.rangeGap / Math.PI) : endAngle - (axis.rangeGap / Math.PI)) : endAngle;
        }
        if (this.gauge.allowComponentRender) {
            if ((startValue !== endValue) && (isAngleCross360 ? startAngle < (endAngle + 360) : (startAngle < endAngle)) && ((range.start >= min && range.end <= max) || (range.end >= min && range.start <= max))) {
                endAngle = isClockWise ? endAngle : [startAngle, startAngle = endAngle][0];
                endWidth = isClockWise ? endWidth : [startWidth, startWidth = endWidth][0];
                const radius: number = typeof range.roundedCornerRadius === 'string' ? parseFloat(<string>range.roundedCornerRadius) : range.roundedCornerRadius;
                const process: number = (radius * 0.25);
                const degreeValue: number = getDegree(startAngle, endAngle);
                oldStart = ((((range.currentRadius - (startWidth / 2)) * ((startAngle * Math.PI) / 180) -
                    (radius / process)) / (range.currentRadius - (startWidth / 2))) * 180) / Math.PI;
                oldEnd = ((((range.currentRadius - (endWidth / 2)) * ((endAngle * Math.PI) / 180) +
                    (radius / process)) / (range.currentRadius - (endWidth / 2))) * 180) / Math.PI;
                roundedStartAngle = ((((range.currentRadius) * ((startAngle * Math.PI) / 180) +
                    (degreeValue < (range.roundedCornerRadius / 2) && range.isLinearCircularGradient
                        ? degreeValue <= 1 ? 0 : (radius / 4) : radius)) / (range.currentRadius)) * 180) / Math.PI;
                roundedEndAngle = ((((range.currentRadius) * ((endAngle * Math.PI) / 180) -
                    (degreeValue < (range.roundedCornerRadius / 2) && range.isLinearCircularGradient
                        ? degreeValue <= 1 ? 0 : (radius / 4) : radius)) / (range.currentRadius)) * 180) / Math.PI;
                if (roundedStartAngle > roundedEndAngle && (roundedStartAngle - roundedEndAngle) <= radius) {
                    roundedStartAngle = startAngle;
                    roundedEndAngle = endAngle;
                }
                if (this.gauge.gradientModule && ((!isNullOrUndefined(range.linearGradient)
                    && !isNullOrUndefined(range.linearGradient.colorStop)) || (!isNullOrUndefined(range.radialGradient)
                        && !isNullOrUndefined(range.radialGradient.colorStop)))) {
                    if (range.isLinearCircularGradient) {
                        endAngle -= isCompleteAngle(startAngle, endAngle) ? 0.0001 : 0;
                        const degree: number = getDegree(startAngle, endAngle);
                        const rangeColorLength: number = range.linearGradient.colorStop.length;
                        const degreeRange: number = ((axis.startAngle === axis.endAngle ?
                            (axis.startAngle === 0 && axis.endAngle === 0 ? 360 : axis.startAngle) :
                            (axis.endAngle - axis.startAngle)) - degree * (rangeColorLength - 1));
                        let degreeRangeValue: number;
                        if (degreeRange <= 360 && degreeRange >= 270) {
                            degreeRangeValue = 270;
                        } else if (degreeRange <= 270 && degreeRange >= 180) {
                            degreeRangeValue = 180;
                        } else if (degreeRange <= 180 && degreeRange >= 90) {
                            degreeRangeValue = 90;
                        } else if (degreeRange <= 90 && degreeRange >= 0) {
                            degreeRangeValue = 0;
                        }
                        const gradientDegree: number = axis.direction === 'AntiClockWise' ?
                            (axis.startAngle === axis.endAngle ? 0 : axis.startAngle) + degree * ((rangeColorLength - 1) - colorIndex)
                            : axis.startAngle + degree * (colorIndex);
                        let gradientAngle: number = axis.startAngle < axis.endAngle ? axis.direction === 'AntiClockWise'
                            ? axis.ranges.length > 1 ? rangeIndex === 0 ? (360 - (axis.startAngle
                                + (degree * (colorIndex)))) : (axis.startAngle + (degree * (colorIndex + 1))) :
                                axis.startAngle + (degreeRangeValue + degree * ((rangeColorLength - 1) - colorIndex)) : axis.startAngle
                            + (degree * (colorIndex)) : axis.endAngle === 360 || axis.startAngle === axis.endAngle
                            ? axis.direction === 'AntiClockWise' ? axis.startAngle === axis.endAngle ?
                                (axis.startAngle === 0 && axis.endAngle === 0 ? 0 : 360) - axis.startAngle +
                                degreeRangeValue + (degree * ((rangeColorLength - 1) - colorIndex))
                                : degree * ((rangeColorLength - 1) - colorIndex) : degree * (colorIndex) :
                            gradientDegree < 360 ? gradientDegree : gradientDegree - 360;
                        range.gradientAngle = rangeIndex === 0 ? axis.rangeGap ? gradientAngle + axis.rangeGap
                            : gradientAngle : axis.rangeGap > 0 ? axis.ranges[rangeIndex - 1]['gradientAngle'] + axis.rangeGap
                            : axis.ranges[rangeIndex - 1]['gradientAngle'];
                        if (axis.direction === 'AntiClockWise' && (axis.ranges.length > 1
                            ? colorIndex === rangeColorLength - 1 : colorIndex === 0)) {
                            range.gradientAntiAngle = gradientAngle;
                        }
                        if (rangeIndex !== 0) {
                            gradientAngle = axis.direction === 'AntiClockWise' ? axis.ranges.length > 1 ?
                                axis.ranges[rangeIndex - 1]['gradientAntiAngle'] - gradientAngle + axis.startAngle :
                                axis.ranges[rangeIndex - 1]['gradientAntiAngle'] + gradientAngle :
                                range.gradientAngle + gradientAngle - axis.startAngle;
                            range.gradientAngle = axis.rangeGap != null && axis.rangeGap > 0 ? colorIndex === rangeColorLength - 1 ?
                                gradientAngle + axis.ranges[rangeIndex - 1]['gradientAngle'] : gradientAngle : gradientAngle;
                            if (axis.direction === 'AntiClockWise' && (axis.ranges.length > 1
                                ? colorIndex === rangeColorLength - 1 : colorIndex === 0)) {
                                range.gradientAntiAngle = gradientAngle;
                            }
                        }
                        if (gradientAngle > 45 && gradientAngle <= 115
                            || (gradientAngle >= 0 && gradientAngle <= 45 && (rangeColorLength - 1) <= 2)) {
                            direction = axis.direction === 'AntiClockWise' ? 'bottom' : 'top';
                        } else if (gradientAngle > 115 && gradientAngle < 170) {
                            direction = axis.direction === 'AntiClockWise' ? 'left' : 'right';
                        } else if (gradientAngle >= 170 && gradientAngle <= 280) {
                            direction = axis.direction === 'AntiClockWise' ? 'top' : 'bottom';
                        } else if (gradientAngle > 280 && gradientAngle <= 360
                            || (gradientAngle >= 0 && gradientAngle <= 45 && (rangeColorLength - 1) >= 2)) {
                            direction = axis.direction === 'AntiClockWise' ? 'right' : 'left';
                        }
                    }
                    gradientRangeColor = this.gauge.gradientModule.getGradientColorString(
                        range, colorIndex, direction, rangeIndex
                    );
                }
                range.rangeColor = gradientRangeColor ? gradientRangeColor : range.rangeColor;
                if (range.roundedCornerRadius) {
                    if (range.isLinearCircularGradient && range.linearGradient.colorStop.length > 1) {
                        if (colorIndex === 0 || colorIndex === range.linearGradient.colorStop.length - 1) {
                            if (axis.direction === 'ClockWise') {
                                this.roundedRangeAppendPathCalculation(
                                    range, rangeIndex, index, startWidth, endWidth, rangeElement,
                                    (colorIndex === range.linearGradient.colorStop.length - 1
                                        ? Math.floor(startAngle) : Math.floor(roundedStartAngle)),
                                    (colorIndex !== 0 ? Math.ceil(roundedEndAngle) : Math.ceil(endAngle)),
                                    ((colorIndex === range.linearGradient.colorStop.length - 1) ? startAngle : oldStart),
                                    (colorIndex !== 0 ? oldEnd : endAngle), location, colorIndex
                                );
                            } else {
                                this.roundedRangeAppendPathCalculation(
                                    range, rangeIndex, index, startWidth, endWidth, rangeElement,
                                    (colorIndex === 0 ? Math.floor(startAngle) : Math.floor(roundedStartAngle)),
                                    (colorIndex === range.linearGradient.colorStop.length - 1
                                        ? Math.ceil(endAngle) : Math.ceil(roundedEndAngle)),
                                    ((colorIndex === 0) ? startAngle : oldStart),
                                    (colorIndex === range.linearGradient.colorStop.length - 1 ? endAngle : oldEnd),
                                    location, colorIndex
                                );
                            }
                        } else {
                            this.rangeAppendPathCalculation(
                                range, rangeIndex, index, startWidth, endWidth, rangeElement,
                                Math.floor(startAngle), Math.ceil(endAngle), colorIndex
                            );
                        }
                    } else {
                        this.roundedRangeAppendPathCalculation(
                            range, rangeIndex, index, startWidth, endWidth, rangeElement,
                            Math.floor(roundedStartAngle), Math.ceil(roundedEndAngle), oldStart,
                            oldEnd, location, colorIndex
                        );
                    }
                } else {
                    this.rangeAppendPathCalculation(
                        range, rangeIndex, index, startWidth, endWidth, rangeElement,
                        Math.floor(startAngle), Math.ceil(endAngle), colorIndex
                    );
                }
            } else if ((range.start === range.end) && ((range.start >= min && range.end <= max) || (range.end >= min && range.start <= max))) {
                this.rangeAppendPathCalculation(
                    range, rangeIndex, index, startWidth, endWidth, rangeElement,
                    Math.floor(startAngle), Math.ceil(endAngle), colorIndex
                );
            }
        }
    }

    /**
     * Method to render the rounded range path of the circular gauge.
     *
     * @param {Range} range - Specifies the range.
     * @param {number} rangeIndex - Specifies the index of the range.
     * @param {number} index - Specifies the index of the axis.
     * @param {number} startWidth - Specifies the startwidth for the range.
     * @param {number} endWidth - Specifies the endwidth for the range.
     * @param {Element} rangeElement - Specifies the element.
     * @param {number} roundedStartAngle - Specifies the rounded path of the start angle.
     * @param {number} roundedEndAngle - Specifies the rounded path of the end angle.
     * @param {number} oldStart - Specifies the rounded path of the old start value.
     * @param {number} oldEnd - Specifies the rounded path of the old end value..
     * @param {GaugeLocation} location - Specifies the location.
     * @param {number} colorIndex - Specifies the index of the lineargradient colorstop.
     * @param {Axis} axis - Specifies the axis.
     * @returns {void}
     * @private
     */
    public roundedRangeAppendPathCalculation(
        range: Range, rangeIndex: number,
        index: number, startWidth: number, endWidth: number, rangeElement: Element,
        roundedStartAngle: number, roundedEndAngle: number, oldStart: number, oldEnd: number,
        location: GaugeLocation, colorIndex?: number
    ): void {
        range.pathElement.push(appendPath(
            new PathOption(
                (!range.isLinearCircularGradient ? this.gauge.element.id + '_Axis_' + index + '_Range_' + rangeIndex
                    : this.gauge.element.id + '_Axis_' + index + '_Range_' + rangeIndex + '_Circular_' + colorIndex),
                range.rangeColor, 0, range.rangeColor, range.opacity, '0',
                getRoundedPathArc(
                    location,
                    Math.floor(roundedStartAngle), Math.ceil(roundedEndAngle), oldStart, oldEnd,
                    range.currentRadius, startWidth, endWidth, range, this.gauge.axes[index] as Axis
                ),
                '', ''
            ),
            rangeElement, this.gauge
        ));
    }

    /**
     * Method to render the rounded range path of the circular gauge.
     *
     * @param {Range} range - Specifies the range.
     * @param {number} rangeIndex - Specifies the index of the range.
     * @param {number} index - Specifies the index of the axis.
     * @param {number} startWidth - Specifies the startwidth for the range.
     * @param {number} endWidth - Specifies the endwidth for the range.
     * @param {Element} rangeElement - Specifies the element.
     * @param {number} startAngle - Specifies the rounded path of the start angle.
     * @param {number} endAngle - Specifies the rounded path of the end angle.
     * @param {number} colorIndex - Specifies the index of the lineargradient colorstop.
     * @returns {void}
     * @private
     */
    public rangeAppendPathCalculation(
        range: Range, rangeIndex: number,
        index: number, startWidth: number, endWidth: number, rangeElement: Element, startAngle: number,
        endAngle: number, colorIndex?: number
    ): void {
        range.pathElement.push(appendPath(
            new PathOption(
                !range.isLinearCircularGradient ? this.gauge.element.id + '_Axis_' + index + '_Range_' +
                    rangeIndex : this.gauge.element.id + '_Axis_' + index + '_Range_' +
                    rangeIndex + '_Circular_' + colorIndex,
                range.rangeColor,
                0, range.rangeColor, range.opacity, '0',
                getPathArc(
                    this.gauge.midPoint,
                    Math.floor(startAngle), Math.ceil(endAngle),
                    range.currentRadius, startWidth,
                    endWidth, range, this.gauge.axes[index] as Axis
                ),
                '', ''
            ),
            rangeElement, this.gauge
        ));
    }

    /**
     * Method to render the axis range of the circular gauge.
     *
     * @param {Axis} axis - Specifies the axis.
     * @param {number} index - Specifies the index.
     * @param {Element} element - Specifies the element.
     * @param {CircularGauge} gauge - Specifies the gauge instance.
     * @returns {void}
     * @private
     */
    public drawAxisRange(axis: Axis, index: number, element: Element): void {
        const ele: Element = (document.getElementById(this.gauge.element.id + '_Axis_Ranges_ ' + index));
        const rangeElement: Element = (ele) ? document.getElementById(this.gauge.element.id + '_Axis_Ranges_ ' + index) :
            this.gauge.renderer.createGroup({ id: this.gauge.element.id + '_Axis_Ranges_' + index });
        let startWidth: number; let startEndDifference: number;
        let endWidth: number; let previousEndWidth: number; let previousStartWidth: number;
        axis.ranges.map((range: Range, rangeIndex: number) => {
            range.isLinearCircularGradient = !isNullOrUndefined(this.gauge.gradientModule)
            && !isNullOrUndefined(range.linearGradient) && isNullOrUndefined(range.linearGradient.startValue)
            && isNullOrUndefined(range.linearGradient.endValue) && !isNullOrUndefined(range.linearGradient.colorStop);
            range.pathElement = [];
            if (!isNullOrUndefined(range.offset) && (<string>range.offset).length > 0) {
                range.currentDistanceFromScale = stringToNumber(<string>range.offset, axis.currentRadius);
            } else {
                range.currentDistanceFromScale = <number>range.offset;
            }
            this.calculateRangeRadius(axis, range);
            if ((<string>range.startWidth).length > 0) {
                startWidth = toPixel(<string>range.startWidth, range.currentRadius);
            } else {
                startWidth = <number>range.startWidth;
            }
            if ((<string>range.endWidth).length > 0) {
                endWidth = toPixel(<string>range.endWidth, range.currentRadius);
            } else {
                endWidth = <number>range.endWidth;
            }
            range.currentRadius = this.calculateRangeRadiusWithPosition(axis, range, startWidth);
            if (range.isLinearCircularGradient) {
                for (let i: number = 0; i < range.linearGradient.colorStop.length; i++) {
                    if (i <= (range.linearGradient.colorStop.length - 1)) {
                        previousEndWidth = i === 0 ? endWidth : previousEndWidth;
                        previousStartWidth = i === 0 ? startWidth : previousStartWidth;
                        startEndDifference = (Math.abs(previousStartWidth - previousEndWidth) / (range.linearGradient.colorStop.length));
                        if (i > 0) {
                            startWidth = endWidth;
                            endWidth = previousStartWidth > previousEndWidth ? startWidth - startEndDifference
                                : startWidth + startEndDifference;
                        } else {
                            endWidth = previousStartWidth > previousEndWidth ? startWidth - startEndDifference
                                : startWidth + startEndDifference;
                        }
                    } else {
                        startWidth = previousStartWidth > previousEndWidth ? startWidth - startEndDifference
                            : startWidth + startEndDifference;
                        endWidth = (previousEndWidth);
                    }
                    this.drawRangePath(axis, range, startWidth, endWidth, rangeIndex, index, rangeElement, i);
                }
            } else {
                if(!(range.start === range.end && axis.direction === 'AntiClockWise' && axis.startAngle === axis.endAngle)) {
                    this.drawRangePath(axis, range, startWidth, endWidth, rangeIndex, index, rangeElement, null);
                }
            }
        }
        );
        element.appendChild(rangeElement);
    }

    /**
     * Method to calculate the radius of the axis range.
     *
     * @return {void}
     */

    private calculateRangeRadius(axis: Axis, range: Range): void {
        const radius: string = range.radius !== null ? range.radius : '100%';
        range.currentRadius = stringToNumber(
            radius, axis.currentRadius
        );
    }

    private calculateRangeRadiusWithPosition(axis: Axis, range: Range, startWidth: number): number {
        const actualRadius: number = !isNullOrUndefined(range.position) && range.position !== 'Auto' && isNullOrUndefined(range.radius) ?
            (range.position === 'Outside' ? (range.currentRadius + axis.lineStyle.width / 2 + range.currentDistanceFromScale) :
                range.position === 'Inside' ? (range.currentRadius - axis.lineStyle.width / 2 - range.currentDistanceFromScale) :
                    (range.currentRadius + startWidth / 2 - range.currentDistanceFromScale)) : range.currentRadius;
        return actualRadius;
    }

    /**
     * Method to get the range color of the circular gauge.
     *
     * @param {Axis} axis - Specifies the axis
     * @returns {void}
     * @private
     */
    public setRangeColor(axis: Axis): void {
        const rangeColors: string[] = getRangePalette(this.gauge.theme);
        axis.ranges.map((range: Range, index: number) => {
            range.rangeColor = range.color ? range.color : rangeColors[index % rangeColors.length];
        });
    }

    /**
     *
     * @returns {void}
     * @private
     */
     public destroy(): void {
        this.gauge = null;
        this.majorValues = [];
    }
}
