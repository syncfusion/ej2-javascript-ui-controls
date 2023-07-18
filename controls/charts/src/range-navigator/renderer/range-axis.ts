/* eslint-disable jsdoc/require-param */
/* eslint-disable jsdoc/require-returns */
/* eslint-disable valid-jsdoc */
import { RangeNavigator } from '../range-navigator';
import { valueToCoefficient, textElement, firstToLowerCase } from '../../common/utils/helper';
import { PathOption, Rect, measureText, TextOption, SvgRenderer } from '@syncfusion/ej2-svg-base';
import { DateTime } from '../../chart/axis/date-time-axis';
import { IntervalType } from '../../chart/utils/enum';
import { RangeIntervalType } from '../../common/utils/enum';
import { FontModel } from '../../common/model/base-model';
import { Axis, VisibleLabels } from '../../chart/axis/axis';
import { MajorGridLinesModel, MajorTickLinesModel } from '../../chart/axis/axis-model';
import { ILabelRenderEventsArgs } from '../model/range-navigator-interface';


/**
 * class for axis
 */
export class RangeNavigatorAxis extends DateTime {
    constructor(range: RangeNavigator) {
        super();
        this.rangeNavigator = range;
    }
    public actualIntervalType: RangeIntervalType;
    public rangeNavigator: RangeNavigator;
    public firstLevelLabels: VisibleLabels[] = [];
    public secondLevelLabels: VisibleLabels[] = [];
    public lowerValues: number[];
    public gridLines: Element;

    /**
     * To render grid lines of axis
     */
    public renderGridLines(): void {
        let pointX: number = 0;
        const control: RangeNavigator = this.rangeNavigator;
        const majorGridLines: MajorGridLinesModel = control.majorGridLines;
        const majorTickLines: MajorTickLinesModel = control.majorTickLines;
        let majorGrid: string = '';
        let majorTick: string = '';
        const rect: Rect = control.bounds;
        const chartAxis: Axis = control.chartSeries.xAxis;
        const disabledColor: string = (control.disableRangeSelector) ? 'transparent' : null;
        this.gridLines = control.renderer.createGroup({ id: control.element.id + '_GridLines' });
        const tick: number = (control.tickPosition === 'Outside' || control.series.length === 0) ?
            rect.y + rect.height + majorTickLines.height : rect.y + rect.height - majorTickLines.height;
        //Gridlines
        this.firstLevelLabels = [];
        chartAxis.labelStyle = control.labelStyle;
        chartAxis.skeleton = control.skeleton;
        chartAxis.skeletonType = control.skeletonType;
        chartAxis.isChart = false;
        if (control.valueType === 'DateTime') {
            const interval: number = this.calculateDateTimeNiceInterval(
                chartAxis, rect, chartAxis.doubleRange.start,
                chartAxis.doubleRange.end, chartAxis.isChart
            );
            this.actualIntervalType = chartAxis.actualIntervalType;
            this.findAxisLabels(chartAxis, interval);
        }
        this.firstLevelLabels = chartAxis.visibleLabels;
        this.lowerValues = [];
        const labelLength: number = chartAxis.visibleLabels.length;
        for (let i: number = 0; i < labelLength; i++) {
            this.lowerValues.push(this.firstLevelLabels[i as number].value);
            pointX = (valueToCoefficient(this.firstLevelLabels[i as number].value, chartAxis) * rect.width) + rect.x;
            if (pointX >= rect.x && (rect.x + rect.width) >= pointX) {
                majorGrid = majorGrid.concat('M ' + pointX + ' ' + (control.bounds.y + control.bounds.height) +
                    ' L ' + pointX + ' ' + control.bounds.y + ' ');

                majorTick = majorTick.concat('M ' + (pointX) + ' ' + (rect.y + rect.height) +
                    ' L ' + (pointX) + ' ' + tick + ' ');
            }
        }
        let options: PathOption = new PathOption(
            control.element.id + '_MajorGridLine', 'transparent',
            majorGridLines.width,
            control.series.length ? disabledColor || majorGridLines.color || control.themeStyle.gridLineColor : 'transparent',
            1, majorGridLines.dashArray, majorGrid
        );
        this.gridLines.appendChild(control.renderer.drawPath(options) as HTMLElement);
        options = new PathOption(
            control.element.id + '_MajorTickLine', 'transparent', majorTickLines.width,
            disabledColor || majorTickLines.color || control.themeStyle.gridLineColor,
            1, majorGridLines.dashArray, majorTick
        );
        this.gridLines.appendChild(control.renderer.drawPath(options) as HTMLElement);
    }

    /**
     * To render of axis labels
     */
    public renderAxisLabels(): void {
        const axis: Axis = this.rangeNavigator.chartSeries.xAxis;
        const control: RangeNavigator = this.rangeNavigator;
        let pointY: number;
        const labelElement: Element = control.renderer.createGroup({ id: control.element.id + '_AxisLabels' });
        const firstLevelElement: Element = control.renderer.createGroup({ id: control.element.id + '_FirstLevelAxisLabels' });
        const secondLevelElement: Element = control.renderer.createGroup({ id: control.element.id + '_SecondLevelAxisLabels' });
        const secondaryAxis: Axis = axis;
        pointY = this.findLabelY(control, false);
        this.placeAxisLabels(axis, pointY, '_AxisLabel_', control, firstLevelElement);
        secondaryAxis.intervalType = secondaryAxis.actualIntervalType = (control.groupBy ||
            this.getSecondaryLabelType(axis.actualIntervalType)) as IntervalType;
        secondaryAxis.labelFormat = '';
        if (control.enableGrouping && control.valueType === 'DateTime' && this.actualIntervalType !== 'Years') {
            secondaryAxis.visibleRange.interval = 1;
            secondaryAxis.visibleLabels = [];
            const interval: number = this.calculateDateTimeNiceInterval(
                secondaryAxis, control.bounds, secondaryAxis.doubleRange.start,
                secondaryAxis.doubleRange.end, secondaryAxis.isChart
            );
            this.findAxisLabels(secondaryAxis, interval);
            this.secondLevelLabels = secondaryAxis.visibleLabels;
            pointY = this.findLabelY(control, true);
            const border: string = this.placeAxisLabels(secondaryAxis, pointY, '_SecondaryLabel_', control, secondLevelElement);
            const path: PathOption = new PathOption(
                control.element.id + '_SecondaryMajorLines', 'transparent', control.majorTickLines.width,
                control.majorTickLines.color || control.themeStyle.gridLineColor, 1, control.majorGridLines.dashArray, border
            );
            this.gridLines.appendChild(control.renderer.drawPath(path) as HTMLElement);
        }
        control.chartSeries.xAxis.visibleLabels = control.chartSeries.xAxis.visibleLabels.concat(secondaryAxis.visibleLabels);
        (labelElement as HTMLElement).style.cursor = axis.valueType === 'DateTime' ? 'cursor: pointer' : 'cursor: default';
        labelElement.appendChild(firstLevelElement);
        labelElement.appendChild(secondLevelElement);

        //gridlines and axis label append to element
        control.svgObject.appendChild(this.gridLines);
        control.svgObject.appendChild(labelElement);
    }

    /**
     * To find secondary level label type
     *
     * @param {RangeIntervalType} type type of range interval
     */
    private getSecondaryLabelType(type: RangeIntervalType): RangeIntervalType {
        const types: RangeIntervalType[] = ['Years', 'Quarter', 'Months', 'Weeks', 'Days', 'Hours', 'Minutes', 'Seconds'];
        return (type === 'Years' ? 'Years' : types[types.indexOf(type) - 1]);
    }

    /**
     * To find labels for date time axis
     *
     * @param {Axis} axis range axis
     */
    private findAxisLabels(axis: Axis, interval: number): void {
        axis.visibleLabels = [];
        let start: Date = new Date(axis.visibleRange.min);
        let nextInterval: number;
        let text: string;
        interval = this.rangeNavigator.interval ? this.rangeNavigator.interval : interval;

        switch (axis.actualIntervalType as RangeIntervalType) {
        case 'Years':
            start = new Date(start.getFullYear(), 0, 1);
            break;
        case 'Quarter':
            if (start.getMonth() <= 2) {
                start = new Date(start.getFullYear(), 0, 1);
            } else if (start.getMonth() <= 5) {
                start = new Date(start.getFullYear(), 3, 1);
            } else if (start.getMonth() <= 8) {
                start = new Date(start.getFullYear(), 6, 1);
            } else {
                start = new Date(start.getFullYear(), 9, 1);
            }
            break;
        case 'Months':
            start = new Date(start.getFullYear(), start.getMonth());
            break;
        case 'Weeks':
            start = new Date(start.getFullYear(), start.getMonth(), start.getDate() - start.getDay());
            break;
        case 'Days':
            start = new Date(start.getFullYear(), start.getMonth(), start.getDate());
            break;
        case 'Hours':
            start = new Date(start.getFullYear(), start.getMonth(), start.getDate(), start.getHours());
            break;
        case 'Minutes':
            start = new Date(start.getFullYear(), start.getMonth(), start.getDate(), start.getHours(), start.getMinutes());
            break;
        case 'Seconds':
            start = new Date(
                start.getFullYear(), start.getMonth(), start.getDate(),
                start.getHours(), start.getMinutes(), start.getSeconds()
            );
            break;
        }
        nextInterval = start.getTime();
        this.rangeNavigator.format = this.rangeNavigator.intl.getDateFormat({
            format: axis.labelFormat || '',
            type: firstToLowerCase(axis.skeletonType), skeleton: this.getSkeleton(axis, null, null)
        });
        while (nextInterval <= axis.visibleRange.max) {
            text = this.dateFormats(this.rangeNavigator.format(new Date(nextInterval)), axis, axis.visibleLabels.length);
            axis.visibleLabels.push(
                new VisibleLabels(
                    text, nextInterval, this.rangeNavigator.labelStyle, text
                )
            );
            nextInterval = this.increaseDateTimeInterval(axis, nextInterval, interval).getTime();
        }
    }

    /**
     * To find date time formats for Quarter and week interval type
     *
     * @param {string} text text
     * @param {Axis} axis axis
     * @param {number} index index
     */
    private dateFormats(text: string, axis: Axis, index: number): string {
        let changedText: string = text;
        const isFirstLevel: boolean = this.rangeNavigator.enableGrouping && this.firstLevelLabels.length === 0;
        switch (axis.actualIntervalType as RangeIntervalType) {
        case 'Quarter':
            if (text.indexOf('Jan') > -1) {
                changedText = !isFirstLevel ? text.replace('Jan', 'Quarter1') : 'Quarter1';
            } else if (text.indexOf('Apr') > -1) {
                changedText = !isFirstLevel ? text.replace('Apr', 'Quarter2') : 'Quarter2';
            } else if (text.indexOf('Jul') > -1) {
                changedText = !isFirstLevel ? text.replace('Jul', 'Quarter3') : 'Quarter3';
            } else if (text.indexOf('Oct') > -1) {
                changedText = !isFirstLevel ? text.replace('Oct', 'Quarter4') : 'Quarter4';
            }
            break;
        case 'Weeks':
            changedText = 'Week' + ++index;
            break;
        default:
            changedText = text;
            break;
        }
        return changedText;
    }

    /**
     * To find the y co-ordinate for axis labels
     *
     * @param {RangeNavigator} control - rangeNavigator
     * @param {boolean} isSecondary sets true if the axis is secondary axis
     */
    private findLabelY(control: RangeNavigator, isSecondary: boolean): number {
        let pointY: number;
        const reference: number = control.bounds.y + control.bounds.height;
        const tickHeight: number = control.majorTickLines.height;
        const textHeight: number = measureText('Quarter1 2011', control.labelStyle, control.themeStyle.axisLabelFont).height;
        let padding: number = control.labelPosition === 'Inside' ? 3 : 8;
        if ((control.labelPosition === 'Outside' && control.tickPosition === 'Outside') || control.series.length === 0) {
            pointY = reference + tickHeight + padding + textHeight * 0.75;
        } else if (control.labelPosition === 'Inside' && control.tickPosition === 'Inside') {
            pointY = reference - tickHeight - padding;
        } else if (control.labelPosition === 'Inside' && control.tickPosition === 'Outside') {
            pointY = reference - padding;
        } else {
            pointY = reference + padding + (textHeight * 0.75);
        }
        if (isSecondary) {
            padding = 15;
            if (control.labelPosition === 'Outside' || control.series.length === 0) {
                pointY += padding + textHeight * 0.75;
            } else {
                pointY = (control.tickPosition === 'Outside' || control.series.length === 0) ?
                    reference + tickHeight + padding + textHeight * 0.75 : reference + padding + textHeight * 0.75;
            }
        }
        return pointY;
    }

    /**
     * It places the axis labels and returns border for secondary axis labels
     *
     * @param {Axis} axis axis for the lables placed
     * @param {number} pointY y co-ordinate for axis labels
     * @param {string} id id for the axis elements
     * @param {RangeNavigator} control range navigator
     * @param {Element} labelElement parent element in which axis labels appended
     */
    private placeAxisLabels(axis: Axis, pointY: number, id: string, control: RangeNavigator, labelElement: Element): string {
        const maxLabels: number = axis.visibleLabels.length;
        let label: VisibleLabels;
        let prevLabel: VisibleLabels;
        let pointX: number;
        const padding: number = 2;
        const rect: Rect = control.bounds;
        let border: string = '';
        let pointXGrid: number;
        const disabledColor: string = (control.disableRangeSelector) ? 'transparent' : null;
        let prevX: number = control.enableRtl ? (rect.x + rect.width) : rect.x;
        const intervalType: RangeIntervalType = axis.actualIntervalType as RangeIntervalType;
        const intervalInTime: number = ((control.labelPlacement === 'Auto' && control.valueType === 'DateTime') || control.labelPlacement === 'BetweenTicks') ?
            maxLabels > 1 ? (axis.visibleLabels[1].value - axis.visibleLabels[0].value) :
                (axis.visibleRange.max - axis.visibleLabels[0].value) / 2 : 0;
        if (control.valueType === 'DateTime' && (intervalType === 'Quarter' || intervalType === 'Weeks')) {
            this.findSuitableFormat(axis, control);
        }
        for (let i: number = 0, len: number = maxLabels; i < len; i++) {
            label = axis.visibleLabels[i as number];
            label.size = measureText(<string>label.text, axis.labelStyle, control.themeStyle.axisLabelFont);
            if ((control.secondaryLabelAlignment === 'Middle' || id.indexOf('_AxisLabel_') > -1)  && (control.labelPlacement === 'Auto' || control.labelPlacement === 'BetweenTicks')) {
                pointX = (valueToCoefficient((label.value + intervalInTime / 2), axis) * rect.width) + rect.x;
            } else if ((id.indexOf('Secondary') > -1)) {
                pointX = this.findAlignment(axis, i);
            }
            if (control.labelPlacement === 'OnTicks' && control.labelPosition === 'Inside') {
                pointX = (valueToCoefficient(label.value, axis) * rect.width) + rect.x + label.size.width / 2 + padding;
            }
            else if (control.labelPlacement === 'OnTicks' && control.labelPosition === 'Outside') {
                pointX = (valueToCoefficient(label.value, axis) * rect.width) + rect.x;
            }
            pointXGrid = (valueToCoefficient((label.value), axis) * rect.width) + rect.x;

            //edgelabelPlacements
            if ((i === 0 || (i === axis.visibleLabels.length - 1 && control.enableRtl)) && pointX < rect.x) {
                pointX = rect.x + label.size.width / 2;
            }
            if (
                (i === axis.visibleLabels.length - 1 || (i === 0 && control.enableRtl)) &&
                ((pointX + label.size.width) > (rect.x + rect.width))
            ) {
                pointX = rect.x + rect.width - label.size.width / 2;
            }
            //secondary axis grid lines
            if (id.indexOf('_SecondaryLabel_') > -1) {
                if (pointX >= rect.x && (rect.x + rect.width) >= pointX) {
                    border = border.concat('M ' + pointXGrid + ' ' + pointY +
                        ' L ' + pointXGrid + ' ' + (pointY - label.size.height));
                }
            }
            //smart axis label position,
            if (
                control.labelIntersectAction === 'Hide' &&
                i !== 0 && this.isIntersect(axis, pointX, label.size.width, prevX, prevLabel.size.width)) {
                continue;
            }
            //label alignment for single visible label
            if (control.secondaryLabelAlignment === 'Middle' && axis.visibleLabels.length === 1) {
                pointX = valueToCoefficient(label.value, axis) + (rect.x + (rect.width / 2));
            }
            //labelrender event
            const labelStyle: FontModel = control.labelStyle;
            const style: FontModel = {
                size: labelStyle.size, color: disabledColor || labelStyle.color || control.themeStyle.axisLabelFont.color,
                fontFamily: labelStyle.fontFamily,
                fontStyle: labelStyle.fontStyle || control.labelStyle.fontStyle,
                fontWeight: labelStyle.fontWeight || control.labelStyle.fontWeight,
                opacity: labelStyle.opacity || control.labelStyle.opacity,
                textAlignment: labelStyle.textAlignment || control.labelStyle.textAlignment,
                textOverflow: labelStyle.textOverflow || control.labelStyle.textOverflow
            };

            const argsData: ILabelRenderEventsArgs = {
                cancel: false, name: 'labelRender',
                text: <string>label.text, value: label.value, labelStyle: style,
                region: new Rect(pointX, pointY, label.size.width, label.size.height)
            };
            control.trigger('labelRender', argsData);
            if (!argsData.cancel) {
                control.labels.push(argsData);
            } else {
                continue;
            }
            (textElement(
                this.rangeNavigator.renderer as unknown as SvgRenderer,
                new TextOption(
                    this.rangeNavigator.element.id + id + i, pointX, pointY, 'middle', argsData.text),
                argsData.labelStyle, argsData.labelStyle.color || control.themeStyle.labelFontColor,
                labelElement, null, null, null, null, null, null, null, null, null, null, control.themeStyle.axisLabelFont) as HTMLElement).style.cursor = axis.valueType === 'DateTime' ? 'cursor: pointer' : 'cursor: default';
            prevX = pointX;
            prevLabel = label;
        }
        return border;
    }

    /**
     * To check label is intersected with successive label or not
     */
    private isIntersect(axis: Axis, currentX: number, currentWidth: number, prevX: number, prevWidth: number): boolean {
        return (axis.isInversed) ? (currentX + currentWidth / 2 > prevX - prevWidth / 2) :
            (currentX - currentWidth / 2 < prevX + prevWidth / 2);
    }
    /**
     * To find suitable label format for Quarter and week Interval types
     *
     * @param {Axis} axis RangeNavigator axis
     * @param {RangeNavigator} control RangeNavigator instance
     */
    private findSuitableFormat(axis: Axis, control: RangeNavigator): void {
        const labels: VisibleLabels[] = axis.visibleLabels;
        const labelLength: number = labels.length;
        const bounds: Rect = control.bounds;
        let prevX: number;
        let currentX: number;
        const interval: number = control.valueType === 'DateTime' ?
            labelLength > 1 ? (labels[1].value - labels[0].value) : axis.visibleRange.interval
            : 0;

        for (let i: number = 0; i < labelLength; i++) {
            currentX = (valueToCoefficient((labels[i as number].value + interval / 2), axis) * bounds.width) + bounds.x;
            labels[i as number].size = measureText(<string>labels[i as number].text, axis.labelStyle, control.themeStyle.axisLabelFont);
            //edgelabelPlacements
            if (i === 0 && currentX < bounds.x) {
                currentX = bounds.x + labels[i as number].size.width / 2;
            }
            if ((axis.actualIntervalType as RangeIntervalType) === 'Quarter') {
                if (i !== 0) {
                    if ((labels[i as number].text.indexOf('Quarter') > -1) &&
                        (this.isIntersect(axis, currentX, labels[i as number].size.width, prevX, labels[i - 1].size.width))) {
                        labels.every((label: VisibleLabels) => {
                            label.text = label.text.toString().replace('Quarter', 'QTR'); return true;
                        });
                        axis.visibleLabels = labels;
                        this.findSuitableFormat(axis, control);
                    } else {
                        if (this.isIntersect(axis, currentX, labels[i as number].size.width, prevX, labels[i - 1].size.width)) {
                            labels.every((label: VisibleLabels) => {
                                label.text = label.text.toString().replace('QTR', 'Q'); return true;
                            });
                            axis.visibleLabels = labels;
                        }
                    }
                }
            } else if ((axis.actualIntervalType as RangeIntervalType) === 'Weeks') {
                if ((i !== 0) && ((labels[i as number].text.indexOf('Week') > -1) &&
                    (this.isIntersect(axis, currentX, labels[i as number].size.width, prevX, labels[i - 1].size.width)))) {
                    labels.every((label: VisibleLabels) => {
                        label.text = label.text.toString().replace('Week', 'W'); return true;
                    });
                    axis.visibleLabels = labels;
                }
            }
            prevX = currentX;
        }
    }

    /**
     * Alignment position for secondary level labels in date time axis
     *
     * @param {Axis} axis axis
     * @param {number} index label index
     */
    private findAlignment(axis: Axis, index: number): number {
        const label: VisibleLabels = axis.visibleLabels[index as number];
        const nextLabel: VisibleLabels = axis.visibleLabels[index + 1];
        const bounds: Rect = this.rangeNavigator.bounds;
        return (this.rangeNavigator.secondaryLabelAlignment === 'Near' ?
            (valueToCoefficient((label.value), axis) * bounds.width) + bounds.x + label.size.width / 2 :
            (valueToCoefficient((nextLabel ? nextLabel.value : axis.visibleRange.max), axis) * bounds.width) + bounds.x - label.size.width);
    }
}
