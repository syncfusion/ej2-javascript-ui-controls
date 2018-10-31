import { RangeNavigator } from '../range-navigator';
import {
    measureText, TextOption, Rect, valueToCoefficient, textElement, PathOption,
    firstToLowerCase,
} from '../../common/utils/helper';
import { DateTime, FontModel, IntervalType } from '../../chart/index';
import { RangeIntervalType } from '..//utils/enum';
import { Axis, VisibleLabels, MajorGridLinesModel, VisibleLabelsModel, MajorTickLinesModel } from '../../chart/index';
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
        let control: RangeNavigator = this.rangeNavigator;
        let majorGridLines: MajorGridLinesModel = control.majorGridLines;
        let majorTickLines: MajorTickLinesModel = control.majorTickLines;
        let majorGrid: string = '';
        let majorTick: string = '';
        let rect: Rect = control.bounds;
        let chartAxis: Axis = control.chartSeries.xAxis;
        let labelLength: number;
        let range: VisibleLabelsModel = chartAxis.visibleRange;
        let disabledColor: string = (control.disableRangeSelector) ? 'transparent' : null;
        this.gridLines = control.renderer.createGroup({ id: control.element.id + '_GridLines' });
        let tick: number = (control.tickPosition === 'Outside' || control.series.length === 0) ?
            rect.y + rect.height + majorTickLines.height : rect.y + rect.height - majorTickLines.height;
        //Gridlines
        this.firstLevelLabels = [];
        chartAxis.labelStyle = control.labelStyle;
        chartAxis.skeleton = control.skeleton;
        chartAxis.skeletonType = control.skeletonType;
        chartAxis.isChart = false;
        if (control.valueType === 'DateTime') {
            this.calculateDateTimeNiceInterval(
                chartAxis, rect, chartAxis.doubleRange.start,
                chartAxis.doubleRange.end, chartAxis.isChart
            );
            this.actualIntervalType = chartAxis.actualIntervalType;
            this.findAxisLabels(chartAxis);
        }
        this.firstLevelLabels = chartAxis.visibleLabels;
        this.lowerValues = [];
        labelLength = chartAxis.visibleLabels.length;
        for (let i: number = 0; i < labelLength; i++) {
            this.lowerValues.push(this.firstLevelLabels[i].value);
            pointX = (valueToCoefficient(this.firstLevelLabels[i].value, chartAxis) * rect.width) + rect.x;
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
        let axis: Axis = this.rangeNavigator.chartSeries.xAxis;
        let control: RangeNavigator = this.rangeNavigator;
        let pointY: number;
        let rect: Rect = control.bounds;
        let labelElement: Element = control.renderer.createGroup({ id: control.element.id + '_AxisLabels' });
        let firstLevelElement: Element = control.renderer.createGroup({ id: control.element.id + '_FirstLevelAxisLabels' });
        let secondLevelElement: Element = control.renderer.createGroup({ id: control.element.id + '_SecondLevelAxisLabels' });
        let secondaryAxis: Axis = axis;
        pointY = this.findLabelY(control, false);
        this.placeAxisLabels(axis, pointY, '_AxisLabel_', control, firstLevelElement);
        secondaryAxis.intervalType = secondaryAxis.actualIntervalType = (control.groupBy ||
            this.getSecondaryLabelType(axis.actualIntervalType)) as IntervalType;
        if (control.enableGrouping && control.valueType === 'DateTime' && this.actualIntervalType !== 'Years') {
            secondaryAxis.visibleRange.interval = 1;
            secondaryAxis.visibleLabels = [];
            this.findAxisLabels(secondaryAxis);
            this.secondLevelLabels = secondaryAxis.visibleLabels;
            pointY = this.findLabelY(control, true);
            let border: string = this.placeAxisLabels(secondaryAxis, pointY, '_SecondaryLabel_', control, secondLevelElement);
            let path: PathOption = new PathOption(
                control.element.id + '_SecondaryMajorLines', 'transparent', control.majorTickLines.width,
                control.majorTickLines.color || control.themeStyle.gridLineColor, 1, control.majorGridLines.dashArray, border
            );
            this.gridLines.appendChild(control.renderer.drawPath(path) as HTMLElement);
        }
        control.chartSeries.xAxis.visibleLabels = control.chartSeries.xAxis.visibleLabels.concat(secondaryAxis.visibleLabels);
        labelElement.appendChild(firstLevelElement);
        labelElement.appendChild(secondLevelElement);

        //gridlines and axis label append to element
        control.svgObject.appendChild(this.gridLines);
        control.svgObject.appendChild(labelElement);
    }

    /**
     * To find secondary level label type
     * @param type
     */
    private getSecondaryLabelType(type: RangeIntervalType): RangeIntervalType {
        let types: RangeIntervalType[] = ['Years', 'Quarter', 'Months', 'Weeks', 'Days', 'Hours', 'Minutes', 'Seconds'];
        return (type === 'Years' ? 'Years' : types[types.indexOf(type) - 1]);
    }

    /**
     * To find labels for date time axis
     * @param axis
     */
    private findAxisLabels(axis: Axis): void {
        axis.visibleLabels = [];
        let start: Date = new Date(axis.visibleRange.min);
        let nextInterval: number;
        let text: string;
        let interval: number = this.rangeNavigator.interval ? this.rangeNavigator.interval : 1;
        switch (axis.actualIntervalType as RangeIntervalType) {
            case 'Years':
                start = new Date(start.getFullYear().toString());
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
            format: axis.labelFormat, type: firstToLowerCase(axis.skeletonType), skeleton: this.getSkeleton(axis, null, null)
        });
        while (nextInterval < axis.visibleRange.max) {
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
     * @param text
     * @param axis
     * @param index
     */
    private dateFormats(text: string, axis: Axis, index: number): string {
        let changedText: string = text;
        let isFirstLevel: boolean = this.rangeNavigator.enableGrouping && this.firstLevelLabels.length === 0;
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
     * @param control - rangeNavigator
     * @param isSecondary sets true if the axis is secondary axis
     */
    private findLabelY(control: RangeNavigator, isSecondary: boolean): number {
        let pointY: number;
        let reference: number = control.bounds.y + control.bounds.height;
        let tickHeight: number = control.majorTickLines.height;
        let textHeight: number = measureText('Quarter1 2011', control.labelStyle).height;
        let padding: number = 8;
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
     * @param axis axis for the lables placed
     * @param pointY y co-ordinate for axis labels
     * @param id id for the axis elements
     * @param control range navigator
     * @param labelElement parent element in which axis labels appended
     */
    private placeAxisLabels(axis: Axis, pointY: number, id: string, control: RangeNavigator, labelElement: Element): string {
        let maxLabels: number = axis.visibleLabels.length;
        let label: VisibleLabels;
        let prevLabel: VisibleLabels;
        let pointX: number;
        let rect: Rect = control.bounds;
        let border: string = '';
        let pointXGrid: number;
        let disabledColor: string = (control.disableRangeSelector) ? 'transparent' : null;
        let prevX: number = control.enableRtl ? (rect.x + rect.width) : rect.x;
        let intervalType: RangeIntervalType = axis.actualIntervalType as RangeIntervalType;
        let intervalInTime: number = control.valueType === 'DateTime' ?
            maxLabels > 1 ? (axis.visibleLabels[1].value - axis.visibleLabels[0].value) :
                (axis.visibleRange.max - axis.visibleLabels[0].value) / 2 : 0;
        if (control.valueType === 'DateTime' && (intervalType === 'Quarter' || intervalType === 'Weeks')) {
            this.findSuitableFormat(axis, control);
        }
        for (let i: number = 0, len: number = maxLabels; i < len; i++) {
            label = axis.visibleLabels[i];
            label.size = measureText(<string>label.text, axis.labelStyle);
            if (control.secondaryLabelAlignment === 'Middle') {
                pointX = (valueToCoefficient((label.value + intervalInTime / 2), axis) * rect.width) + rect.x;
            } else if ((id.indexOf('Secondary') > -1)) {
                pointX = this.findAlignment(axis, i);
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
            //labelrender event
            let argsData: ILabelRenderEventsArgs;
            let labelStyle: FontModel = control.labelStyle;
            let style: FontModel = {
                size: labelStyle.size, color: disabledColor || labelStyle.color || control.themeStyle.labelFontColor,
                fontFamily: labelStyle.fontFamily,
                fontStyle: labelStyle.fontStyle || control.labelStyle.fontStyle,
                fontWeight: labelStyle.fontWeight || control.labelStyle.fontWeight,
                opacity: labelStyle.opacity || control.labelStyle.opacity,
                textAlignment: labelStyle.textAlignment || control.labelStyle.textAlignment,
                textOverflow: labelStyle.textOverflow || control.labelStyle.textOverflow
            };

            argsData = {
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
            textElement(
                new TextOption(
                    this.rangeNavigator.element.id + id + i, pointX, pointY, 'middle', argsData.text),
                argsData.labelStyle, argsData.labelStyle.color || control.themeStyle.labelFontColor,
                labelElement).setAttribute(
                    'style', axis.valueType === 'DateTime' ? 'cursor: pointer' : 'cursor: default'
                );
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
     * @param axis
     * @param control
     */
    private findSuitableFormat(axis: Axis, control: RangeNavigator): void {
        let labels: VisibleLabels[] = axis.visibleLabels;
        let labelLength: number = labels.length;
        let bounds: Rect = control.bounds;
        let prevX: number;
        let currentX: number;
        let interval: number = control.valueType === 'DateTime' ?
            labelLength > 1 ? (labels[1].value - labels[0].value) : axis.visibleRange.interval
            : 0;

        for (let i: number = 0; i < labelLength; i++) {
            currentX = (valueToCoefficient((labels[i].value + interval / 2), axis) * bounds.width) + bounds.x;
            labels[i].size = measureText(<string>labels[i].text, axis.labelStyle);
            //edgelabelPlacements
            if (i === 0 && currentX < bounds.x) {
                currentX = bounds.x + labels[i].size.width / 2;
            }
            if ((axis.actualIntervalType as RangeIntervalType) === 'Quarter') {
                if (i !== 0) {
                    if ((labels[i].text.indexOf('Quarter') > -1) &&
                        (this.isIntersect(axis, currentX, labels[i].size.width, prevX, labels[i - 1].size.width))) {
                        labels.every((label: VisibleLabels) => {
                            label.text = label.text.toString().replace('Quarter', 'QTR'); return true;
                        });
                        axis.visibleLabels = labels;
                        this.findSuitableFormat(axis, control);
                    } else {
                        if (this.isIntersect(axis, currentX, labels[i].size.width, prevX, labels[i - 1].size.width)) {
                            labels.every((label: VisibleLabels) => {
                                label.text = label.text.toString().replace('QTR', 'Q'); return true;
                            });
                            axis.visibleLabels = labels;
                        }
                    }
                }
            } else if ((axis.actualIntervalType as RangeIntervalType) === 'Weeks') {
                if ((i !== 0) && ((labels[i].text.indexOf('Week') > -1) &&
                    (this.isIntersect(axis, currentX, labels[i].size.width, prevX, labels[i - 1].size.width)))) {
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
     * @param axis
     * @param index
     */
    private findAlignment(axis: Axis, index: number): number {
        let label: VisibleLabels = axis.visibleLabels[index];
        let nextLabel: VisibleLabels = axis.visibleLabels[index + 1];
        let bounds: Rect = this.rangeNavigator.bounds;
        return (this.rangeNavigator.secondaryLabelAlignment === 'Near' ?
            (valueToCoefficient((label.value), axis) * bounds.width) + bounds.x + label.size.width / 2 :
            (valueToCoefficient((nextLabel ? nextLabel.value : axis.visibleRange.max), axis) * bounds.width) + bounds.x - label.size.width);
    }
}
