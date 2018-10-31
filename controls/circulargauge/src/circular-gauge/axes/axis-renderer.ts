import { CircularGauge } from '../circular-gauge';
import { Axis, Label, Range, Tick } from './axis';
import { getLocationFromAngle, PathOption, stringToNumber, TextOption, textElement, appendPath, toPixel } from '../utils/helper';
import { GaugeLocation, VisibleLabels, getAngleFromValue, isCompleteAngle, getPathArc,
    getRoundedPathArc, getRangeColor } from '../utils/helper';
import { TickModel } from './axis-model';
import { getRangePalette } from '../model/theme';

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
        if (axis.lineStyle.width > 0) {
            startAngle = !isCompleteAngle(startAngle, endAngle) ? startAngle : [0, endAngle = 360][0];
            appendPath(
                new PathOption(
                    gauge.element.id + '_AxisLine_' + index, 'transparent', axis.lineStyle.width,
                    axis.lineStyle.color,
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
    public drawAxisLabels(axis: Axis, index: number, element: Element, gauge: CircularGauge): void {
        let labelElement: Element = gauge.renderer.createGroup({
            id: gauge.element.id + '_Axis_Labels_' + index
        });
        let min: number = axis.visibleRange.min;
        let max: number = axis.visibleRange.max;
        let labelCollection: VisibleLabels[] = axis.visibleLabels;
        let location: GaugeLocation;
        let style: Label = <Label>axis.labelStyle;
        let anchor: string;
        let angle: number;
        let label: VisibleLabels;
        let radius: number = axis.currentRadius;
        let labelPadding: number = 10;
        if (style.position === 'Outside') {
            radius += (axis.nearSize - (axis.maxLabelSize.height + axis.lineStyle.width / 2)) +
                (labelPadding / 2);
        } else {
            radius -= (axis.farSize - (axis.maxLabelSize.height + axis.lineStyle.width / 2) +
                (style.autoAngle ? labelPadding : 0));
        }

        for (let i: number = 0, length: number = labelCollection.length; i < length; i++) {
            if ((i === 0 && style.hiddenLabel === 'First') ||
                (i === (length - 1) && style.hiddenLabel === 'Last')) {
                continue;
            }
            label = labelCollection[i];
            angle = Math.round(getAngleFromValue(label.value, max, min, axis.startAngle, axis.endAngle, axis.direction === 'ClockWise'));
            location = getLocationFromAngle(angle, radius, gauge.midPoint);
            anchor = this.findAnchor(location, style, angle, label);
            textElement(
                new TextOption(
                    gauge.element.id + '_Axis_' + index + '_Label_' + i,
                    location.x, location.y, anchor, label.text,
                    style.autoAngle ? 'rotate(' + (angle + 90) + ',' + (location.x) + ',' + location.y + ')' : '',
                    'auto'),
                style.font, style.useRangeColor ? getRangeColor(label.value, <Range[]>axis.ranges, style.font.color) : style.font.color,
                labelElement, 'pointer-events:none;');
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
        if (minorLineStyle.width && minorLineStyle.height && minorInterval) {
            for (let i: number = axis.visibleRange.min, max: number = axis.visibleRange.max; i <= max; i += minorInterval) {
                if (this.majorValues.indexOf(+i.toFixed(3)) < 0) {
                    appendPath(
                        new PathOption(
                            gauge.element.id + '_Axis_Minor_TickLine_' + index + '_' + i, 'transparent', minorLineStyle.width,
                            isRangeColor ? getRangeColor(i, <Range[]>axis.ranges, minorLineStyle.color) : minorLineStyle.color,
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
        if (majorLineStyle.width && majorLineStyle.height && axis.visibleRange.interval) {
            for (let i: number = axis.visibleRange.min, max: number = axis.visibleRange.max,
                interval: number = axis.visibleRange.interval; i <= max; i += interval) {
                this.majorValues.push(+i.toFixed(3));
                appendPath(
                    new PathOption(
                        gauge.element.id + '_Axis_Major_TickLine_' + index + '_' + i, 'transparent', majorLineStyle.width,
                        isRangeColor ? getRangeColor(i, <Range[]>axis.ranges, majorLineStyle.color) : majorLineStyle.color,
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
        let isOutside: boolean = options.position === 'Outside';
        let angle: number = getAngleFromValue(
            value, axis.visibleRange.max, axis.visibleRange.min,
            axis.startAngle, axis.endAngle, axis.direction === 'ClockWise'
        );
        let start: GaugeLocation = getLocationFromAngle(
            angle, axis.currentRadius +
            (isOutside ? axisLineWidth : -axisLineWidth),
            this.gauge.midPoint
        );
        let end: GaugeLocation = getLocationFromAngle(
            angle, axis.currentRadius +
            (isOutside ? axisLineWidth : -axisLineWidth) +
            (isOutside ? options.height : -options.height),
            this.gauge.midPoint
        );
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
            this.calculateRangeRadius(axis, range);
            startValue = Math.min(Math.max(range.start, min), range.end);
            endValue = Math.min(Math.max(range.start, range.end), max);
            if (startValue !== endValue) {
                startAngle = getAngleFromValue(startValue, max, min, axis.startAngle, axis.endAngle, isClockWise);
                endAngle = getAngleFromValue(endValue, max, min, axis.startAngle, axis.endAngle, isClockWise);
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
                endAngle = isClockWise ? endAngle : [startAngle, startAngle = endAngle][0];
                endWidth = isClockWise ? endWidth : [startWidth, startWidth = endWidth][0];
                oldStart = ((((range.currentRadius - (startWidth / 2)) * ((startAngle * Math.PI) / 180) -
                    (range.roundedCornerRadius / 4)) / (range.currentRadius - (startWidth / 2))) * 180) / Math.PI;
                oldEnd = ((((range.currentRadius - (endWidth / 2)) * ((endAngle * Math.PI) / 180) +
                    (range.roundedCornerRadius / 4)) / (range.currentRadius - (endWidth / 2))) * 180) / Math.PI;
                roundedStartAngle = ((((range.currentRadius) * ((startAngle * Math.PI) / 180) +
                    range.roundedCornerRadius) / (range.currentRadius)) * 180) / Math.PI;
                roundedEndAngle = ((((range.currentRadius) * ((endAngle * Math.PI) / 180) -
                    range.roundedCornerRadius) / (range.currentRadius)) * 180) / Math.PI;
                if (range.roundedCornerRadius) {
                    appendPath(
                        new PathOption(
                            gauge.element.id + '_Axis_' + index + '_Range_' + rangeIndex, range.rangeColor,
                            0, range.rangeColor, 1, '0',
                            getRoundedPathArc(
                                gauge.midPoint,
                                Math.floor(roundedStartAngle), Math.ceil(roundedEndAngle), Math.floor(oldStart), Math.ceil(oldEnd),
                                range.currentRadius, startWidth, endWidth
                            ),
                            '', 'pointer-events:none;'
                        ),
                        rangeElement, gauge
                    );
                } else {
                    appendPath(
                        new PathOption(
                            gauge.element.id + '_Axis_' + index + '_Range_' + rangeIndex, range.rangeColor,
                            0, range.rangeColor, 1, '0',
                            getPathArc(
                                gauge.midPoint,
                                Math.floor(startAngle), Math.ceil(endAngle),
                                range.currentRadius, startWidth, endWidth
                            ),
                            '', 'pointer-events:none;'
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