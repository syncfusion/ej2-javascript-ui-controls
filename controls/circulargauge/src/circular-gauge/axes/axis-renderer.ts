import { CircularGauge } from '../circular-gauge';
import { Axis, Label, Range, Tick } from './axis';
import { getLocationFromAngle, PathOption, stringToNumber, TextOption, textElement, appendPath, toPixel } from '../utils/helper';
import {
    GaugeLocation, VisibleLabels, getAngleFromValue, isCompleteAngle, getPathArc,
    getRoundedPathArc, getRangeColor
} from '../utils/helper';
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
     * @private.
     */
    constructor(gauge: CircularGauge) {
        this.gauge = gauge;
    }

    /**
     * Method to render the axis element of the circular gauge.
     * @return {void}
     * @private
     */
    public drawAxisOuterLine(axis: Axis, index: number, element: Element, gauge: CircularGauge): void {
        let background: string = axis.background;
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
     * Method to render the axis line of the circular gauge.
     * @return {void}
     * @private
     */
    public drawAxisLine(axis: Axis, index: number, element: Element, gauge: CircularGauge): void {
        let startAngle: number = axis.startAngle;
        let endAngle: number = axis.endAngle;
        let color: string = axis.lineStyle.color || this.gauge.themeStyle.lineColor;
        if (axis.lineStyle.width > 0) {
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
     * @return {void}
     * @private
     */
    /* tslint:disable:no-string-literal */
    /* tslint:disable:max-func-body-length */
    public drawAxisLabels(axis: Axis, index: number, element: Element, gauge: CircularGauge): void {
        let labelElement: Element = gauge.renderer.createGroup({
            id: gauge.element.id + '_Axis_Labels_' + index
        });
        let min: number = axis.visibleRange.min;
        let max: number = axis.visibleRange.max;
        let labelCollection: VisibleLabels[] = axis.visibleLabels;
        let location: GaugeLocation;
        let textWidth: number; let textHeight: number; let labelsVisible: boolean = true;
        let currentTextWidth: number; let currentTextHeight: number;
        let previousLocation: GaugeLocation; let currentLocation: GaugeLocation;
        let lastLabelLocation: GaugeLocation;
        let lastLabelAngle: number; let lastLabelAnchor: string;
        let lastTextWidth: number; let lastTextHeight: number;
        let style: Label = <Label>axis.labelStyle; let anchor: string; let angle: number;
        let label: VisibleLabels; let radius: number = axis.currentRadius;
        let checkLabelOpposed: number = 0;
        checkLabelOpposed = (style.position === 'Inside' && axis.majorTicks.position === 'Outside' &&
                            axis.minorTicks.position === 'Outside') || (style.position === 'Outside' &&
                            axis.minorTicks.position === 'Inside' && axis.majorTicks.position === 'Inside') ?
                            axis.lineStyle.width + axis.currentRadius / 20 :
                            (style.position === axis.majorTicks.position ? axis.currentRadius / 20 : axis.currentRadius / 40);
        let labelPadding: number = axis.labelStyle.shouldMaintainPadding ? 10 : checkLabelOpposed;
        let color: string = style.font.color || this.gauge.themeStyle.labelColor;
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
            style.font.fontFamily = this.gauge.themeStyle.labelFontFamily || style.font.fontFamily;
            if (axis.hideIntersectingLabel && (i !== 0)) {
                //To remove the labels which is intersecting with last label.
                let lastlabel: boolean = ((i !== (labelCollection.length - 1)) && ((isCompleteAngle(axis.startAngle, axis.endAngle) ||
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
     * @private
     */
    private findAnchor(location: GaugeLocation, style: Label, angle: number, label: VisibleLabels): string {
        if (style.autoAngle) {
            return 'middle';
        }
        let anchor: string = style.position === 'Inside' ?
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
     * @private
     */
    private FindAxisLabelCollision(previousLocation: GaugeLocation, previousWidth: number, previousHeight: number,
                                   currentLocation: GaugeLocation, currentWidth: number, currentHeight: number): boolean {
        let labelVisisble: boolean = ((previousLocation.x > (currentLocation.x + (currentWidth))) ||
            ((previousLocation.x + (previousWidth)) < (currentLocation.x)) ||
            ((previousLocation.y + (previousHeight)) < (currentLocation.y)) ||
            ((previousLocation.y) > (currentLocation.y + (currentHeight))));
        return labelVisisble;
    }

    /**
     * Methode to get anchor position of label as start.
     * @private
     */
    private getAxisLabelStartPosition(actualLocation: GaugeLocation, textWidth: number, style: Label, textHeight: number,
                                      anchorPosition: string, angle: number): GaugeLocation {
        if (anchorPosition === 'end') {
            actualLocation.x = actualLocation.x - textWidth;
        } else if (anchorPosition === 'middle') {
            actualLocation.x = actualLocation.x - (textWidth / 2);
        } else {
            actualLocation.x = actualLocation.x;
        }
        return actualLocation;
    }

    /**
     * Methode to offset label height and width based on angle.
     * @private
     */
    private offsetAxisLabelsize(angle: number, size: number): number {
        let finalSize: number = ((angle >= 20 && angle <= 60) || (angle >= 120 && angle <= 160) || (angle >= 200 && angle <= 240) ||
            (angle >= 300 && angle <= 340)) ? size / 5 : 0;
        return finalSize;
    }

    /**
     * Method to render the axis minor tick lines of the circular gauge.
     * @return {void}
     * @private
     */
    public drawMinorTickLines(axis: Axis, index: number, element: Element, gauge: CircularGauge): void {
        let minorTickElements: Element = gauge.renderer.createGroup({
            id: gauge.element.id + '_Axis_MinorTickLines_' + index
        });
        let minorLineStyle: TickModel = axis.minorTicks;
        let minorInterval: number = minorLineStyle.interval !== null ?
            minorLineStyle.interval : (axis.visibleRange.interval / 2);
        let isRangeColor: boolean = minorLineStyle.useRangeColor;
        let color: string = minorLineStyle.color || this.gauge.themeStyle.minorTickColor;
        if (minorLineStyle.width && minorLineStyle.height && minorInterval) {
            for (let i: number = axis.visibleRange.min, max: number = axis.visibleRange.max; i <= max; i += minorInterval) {
                if (this.majorValues.indexOf(+i.toFixed(3)) < 0) {
                    appendPath(
                        new PathOption(
                            gauge.element.id + '_Axis_Minor_TickLine_' + index + '_' + i, 'transparent', minorLineStyle.width,
                            isRangeColor ? getRangeColor(i, <Range[]>axis.ranges, color) : color,
                            null, '0', this.calculateTicks(i, <Tick>minorLineStyle, axis), '', 'pointer-events:none;'
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
     * @return {void}
     * @private
     */
    public drawMajorTickLines(axis: Axis, index: number, element: Element, gauge: CircularGauge): void {
        let majorTickElements: Element = gauge.renderer.createGroup({
            id: gauge.element.id + '_Axis_MajorTickLines_' + index
        });
        let majorLineStyle: TickModel = axis.majorTicks;
        let isRangeColor: boolean = majorLineStyle.useRangeColor;
        this.majorValues = [];
        let color: string = majorLineStyle.color || this.gauge.themeStyle.majorTickColor;
        if (majorLineStyle.width && majorLineStyle.height && axis.visibleRange.interval) {
            for (let i: number = axis.visibleRange.min, max: number = axis.visibleRange.max,
                interval: number = axis.visibleRange.interval; i <= max; i += interval) {
                this.majorValues.push(+i.toFixed(3));
                appendPath(
                    new PathOption(
                        gauge.element.id + '_Axis_Major_TickLine_' + index + '_' + i, 'transparent', majorLineStyle.width,
                        isRangeColor ? getRangeColor(i, <Range[]>axis.ranges, color) : color,
                        null, '0', this.calculateTicks(i, <Tick>majorLineStyle, axis), '', 'pointer-events:none;'
                    ),
                    majorTickElements, gauge
                );
            }
            element.appendChild(majorTickElements);
        }
    }

    /**
     * Method to calcualte the tick elements for the circular gauge.
     * @return {void}
     * @private
     */
    public calculateTicks(value: number, options: Tick, axis: Axis): string {
        let axisLineWidth: number = (axis.lineStyle.width / 2) + options.offset;
        let angle: number = getAngleFromValue(
            value, axis.visibleRange.max, axis.visibleRange.min,
            axis.startAngle, axis.endAngle, axis.direction === 'ClockWise'
        );
        let start: GaugeLocation =
        getLocationFromAngle(angle, axis.currentRadius +
                             (options.position === 'Outside' ? axisLineWidth : options.position === 'Cross' ?
                             options.height / 2 - options.offset : -axisLineWidth),
                             this.gauge.midPoint);
        let end: GaugeLocation =
        getLocationFromAngle(angle, axis.currentRadius +
                             (options.position === 'Outside' ? axisLineWidth : options.position === 'Cross' ?
                              options.height / 2 - options.offset : -axisLineWidth) +
                             (options.position === 'Outside' ? options.height : -options.height),
                             this.gauge.midPoint);
        return 'M ' + start.x + ' ' + start.y + ' L ' + end.x + ' ' + end.y + ' ';
    }

    /**
     * Method to render the axis range of the circular gauge.
     * @return {void}
     * @private
     */
    public drawAxisRange(axis: Axis, index: number, element: Element, gauge: CircularGauge): void {
        let rangeElement: Element = gauge.renderer.createGroup({
            id: gauge.element.id + '_Axis_Ranges_' + index
        });
        let location: GaugeLocation = this.gauge.midPoint;
        let startAngle: number;
        let endAngle: number;
        let isClockWise: boolean = axis.direction === 'ClockWise';
        let startValue: number;
        let endValue: number;
        let min: number = axis.visibleRange.min;
        let max: number = axis.visibleRange.max;
        let startWidth: number;
        let endWidth: number;
        let roundedStartAngle: number;
        let roundedEndAngle: number;
        let oldStart: number;
        let oldEnd: number;
        axis.ranges.map((range: Range, rangeIndex: number) => {
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
            startValue = Math.min(Math.max(range.start, min), range.end);
            endValue = Math.min(Math.max(range.start, range.end), max);
            startAngle = getAngleFromValue(startValue, max, min, axis.startAngle, axis.endAngle, isClockWise);
            endAngle = getAngleFromValue(endValue, max, min, axis.startAngle, axis.endAngle, isClockWise);
            let isAngleCross360: boolean = (startAngle > endAngle);
            if (axis.rangeGap != null && axis.rangeGap > 0) {
                startAngle = (rangeIndex === 0 && !axis.startAndEndRangeGap) ? startAngle : startAngle + (axis.rangeGap / Math.PI);
                endAngle = (rangeIndex === axis.ranges.length - 1 && !axis.startAndEndRangeGap) ? endAngle : endAngle -
                    (axis.rangeGap / Math.PI);
            }
            if ((startValue !== endValue) && (isAngleCross360 ? startAngle < (endAngle + 360) : (startAngle < endAngle))) {
                endAngle = isClockWise ? endAngle : [startAngle, startAngle = endAngle][0];
                endWidth = isClockWise ? endWidth : [startWidth, startWidth = endWidth][0];
                let radius: number = range.roundedCornerRadius;
                let process: number = (radius * 0.25);
                oldStart = ((((range.currentRadius - (startWidth / 2)) * ((startAngle * Math.PI) / 180) -
                    (radius / process)) / (range.currentRadius - (startWidth / 2))) * 180) / Math.PI;
                oldEnd = ((((range.currentRadius - (endWidth / 2)) * ((endAngle * Math.PI) / 180) +
                    (radius / process)) / (range.currentRadius - (endWidth / 2))) * 180) / Math.PI;
                roundedStartAngle = ((((range.currentRadius) * ((startAngle * Math.PI) / 180) +
                    radius) / (range.currentRadius)) * 180) / Math.PI;
                roundedEndAngle = ((((range.currentRadius) * ((endAngle * Math.PI) / 180) -
                    radius) / (range.currentRadius)) * 180) / Math.PI;
                if (range.roundedCornerRadius) {
                    appendPath(
                        new PathOption(
                            gauge.element.id + '_Axis_' + index + '_Range_' + rangeIndex, range.rangeColor,
                            0, range.rangeColor, range.opacity, '0',
                            getRoundedPathArc(
                                location,
                                Math.floor(roundedStartAngle), Math.ceil(roundedEndAngle), oldStart, oldEnd,
                                range.currentRadius, startWidth, endWidth
                            ),
                            '', ''
                        ),
                        rangeElement, gauge
                    );
                } else {
                    appendPath(
                        new PathOption(
                            gauge.element.id + '_Axis_' + index + '_Range_' + rangeIndex, range.rangeColor,
                            0, range.rangeColor, range.opacity, '0',
                            getPathArc(
                                gauge.midPoint,
                                Math.floor(startAngle), Math.ceil(endAngle),
                                range.currentRadius, startWidth, endWidth, range, axis
                            ),
                            '', ''
                        ),
                        rangeElement, gauge
                    );
                }
            }
        });
        element.appendChild(rangeElement);
    }

    /**
     * Method to calculate the radius of the axis range.
     * @return {void}
     */

    private calculateRangeRadius(axis: Axis, range: Range): void {
        let radius: string = range.radius !== null ? range.radius : '100%';
        range.currentRadius = stringToNumber(
            radius, axis.currentRadius
        );
    }

    private calculateRangeRadiusWithPosition(axis: Axis, range: Range, startWidth: number): number {
        let actualRadius: number;
        actualRadius = !isNullOrUndefined(range.position) && range.position !== 'Auto' && isNullOrUndefined(range.radius) ?
            (range.position === 'Outside' ? (range.currentRadius + axis.lineStyle.width / 2 + range.currentDistanceFromScale) :
                range.position === 'Inside' ? (range.currentRadius - axis.lineStyle.width / 2 - range.currentDistanceFromScale) :
                    (range.currentRadius + startWidth / 2 - range.currentDistanceFromScale)) : range.currentRadius;
        return actualRadius;
    }

    /**
     * Method to get the range color of the circular gauge.
     * @return {void}
     * @private
     */
    public setRangeColor(axis: Axis): void {
        let rangeColors: string[] = getRangePalette(this.gauge.theme);
        axis.ranges.map((range: Range, index: number) => {
            range.rangeColor = range.color ? range.color : rangeColors[index % rangeColors.length];
        });
    }
}