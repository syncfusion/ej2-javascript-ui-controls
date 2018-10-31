import { getPoint, ChartLocation, PathOption, appendClipElement, pathAnimation } from '../../common/utils/helper';
import { Chart } from '../chart';
import { Series, Points } from './chart-series';
import { Axis } from '../../chart/axis/axis';
import { LineBase } from './line-base';
import { RectOption, sort, getElement } from '../../common/utils/helper';
import { ChartSegment } from './chart-series';
import { ChartSegmentModel } from './chart-series-model';
import { DataUtil } from '@syncfusion/ej2-data';
import { DateFormatOptions, PathAttributes } from '@syncfusion/ej2-base';
/**
 * Base class for multi colored series
 */

export class MultiColoredSeries extends LineBase {
    /**
     * To Generate the area path direction
     * @param xValue 
     * @param yValue 
     * @param series 
     * @param isInverted 
     * @param getPointLocation 
     * @param startPoint 
     * @param startPath 
     */
    public getAreaPathDirection(
        xValue: number, yValue: number, series: Series,
        isInverted: boolean, getPointLocation: Function, startPoint: ChartLocation,
        startPath: string
    ): string {
        let direction: string = '';
        let firstPoint: ChartLocation;
        if (startPoint === null) {
            firstPoint = getPointLocation(xValue, yValue, series.xAxis, series.yAxis, isInverted, series);
            direction += (startPath + ' ' + (firstPoint.x) + ' ' + (firstPoint.y) + ' ');
        }
        return direction;
    }
    /**
     * To Generate the empty point direction
     * @param firstPoint 
     * @param secondPoint 
     * @param series 
     * @param isInverted 
     * @param getPointLocation 
     */
    public getAreaEmptyDirection(
        firstPoint: ChartLocation, secondPoint: ChartLocation, series: Series,
        isInverted: boolean, getPointLocation: Function
    ): string {
        let direction: string = '';
        direction += this.getAreaPathDirection(
            firstPoint.x, firstPoint.y, series, isInverted, getPointLocation, null,
            'L'
        );
        direction += this.getAreaPathDirection(
            secondPoint.x, secondPoint.y, series, isInverted, getPointLocation, null,
            'L'
        );
        return direction;
    }
    /**
     * To set point color
     * @param points 
     */
    public setPointColor(currentPoint: Points, previous: Points, series: Series, isXSegment : boolean,
                         segments: ChartSegmentModel[]): boolean {
        if (series.pointColorMapping === '') {
            let segment : ChartSegmentModel;
            let value : number;
            for (let i : number = 0; i < segments.length ; i++) {
                segment = segments[i];
                value = isXSegment ? currentPoint.xValue : currentPoint.yValue;
                if (value <= this.getAxisValue(segment.value, isXSegment ? series.xAxis : series.yAxis, series.chart) || !segment.value) {
                    currentPoint.interior =  segment.color;
                    break;
                }
            }
            if (currentPoint.interior == null) {
                currentPoint.interior = series.interior;
            }
            return false;
        } else {
            if (previous) {
              return series.setPointColor(currentPoint, series.interior) !== series.setPointColor(previous, series.interior);
            } else {
                return false;
            }
        }
    }

    public sortSegments(series: Series, chartSegments: ChartSegmentModel[]) : ChartSegmentModel[] {
        let axis: Axis = series.segmentAxis === 'X' ? series.xAxis : series.yAxis;
        let segments: ChartSegmentModel[] = [].concat(chartSegments);
        let access : this = this;
        return segments.sort((a : ChartSegmentModel, b : ChartSegmentModel) => {
            return access.getAxisValue(a.value, axis, series.chart) -  access.getAxisValue(b.value, axis, series.chart);
        });
    }

    /**
     * Segment calculation performed here
     * @param series 
     * @param options 
     * @param chartSegments 
     */
    public applySegmentAxis(series: Series, options: PathOption[], segments: ChartSegmentModel[]): void {
        if (series.pointColorMapping !== '') {
            options.map((option: PathOption) => {
                this.appendLinePath(option, series, '');
            });
            return null;
        }
        let isXSegment: boolean = series.segmentAxis === 'X';
        let axis: Axis = isXSegment ? series.xAxis : series.yAxis;
        let chart: Chart = series.chart;
        let segment: ChartSegment;
        this.includeSegment(segments, axis, series, segments.length);
        let length: number = segments.length;
        let value : number;
        let clipPath : string;
        let attributeOptions: PathAttributes;
        for (let index: number = 0; index < length; index++) {
            segment = segments[index] as ChartSegment;
            value = this.getAxisValue(segment.value, axis, series.chart);
            clipPath = this.createClipRect(index ? this.getAxisValue(segments[index - 1].value, axis, series.chart)
                                                 : axis.visibleRange.min,
                                           value, series, index, isXSegment);
            if (clipPath) {
            options.map((option: PathOption) => {
                attributeOptions = {
                    'clip-path': clipPath,
                    'stroke-dasharray': segment.dashArray,
                    'opacity': option.opacity,
                    'stroke': series.type.indexOf('Line') > -1 ? segment.color || series.interior : series.border.color,
                    'stroke-width': option['stroke-width'],
                    'fill': series.type.indexOf('Line') > -1 ? 'none' : segment.color || series.interior,
                    'id': option.id + '_Segment_' + index,
                    'd': option.d
                };
                pathAnimation(getElement(attributeOptions.id), attributeOptions.d, chart.redraw);
                series.seriesElement.appendChild(
                    chart.renderer.drawPath(attributeOptions)
                );
            });
         }
        }
    }
    private includeSegment(segments : ChartSegmentModel[], axis : Axis, series : Series, length : number) : void {
        if (length <= 0) {
            segments.push({ value: axis.visibleRange.max, color: series.interior });
            return null;
        }
        if (this.getAxisValue(segments[length - 1].value, axis, series.chart) < axis.visibleRange.max) {
          segments.push({value : axis.visibleRange.max, color : series.interior});
        }
    }
    /**
     * To create clip rect for segment axis
     * @param startValue 
     * @param endValue 
     * @param series 
     * @param index 
     * @param isX 
     * @param chart 
     */
    public createClipRect(
        startValue: number, endValue: number, series: Series,
        index: number, isX: boolean
    ): string {
        let isRequired: boolean = series.chart.requireInvertedAxis;
        let startPointLocation: ChartLocation = getPoint(
            isX ? startValue : series.xAxis.visibleRange.min,
            isX ? series.yAxis.visibleRange.max : endValue,
            series.xAxis, series.yAxis, isRequired
        );
        let endPointLocation: ChartLocation = getPoint(
            isX ? endValue : series.xAxis.visibleRange.max,
            isX ? series.yAxis.visibleRange.min : startValue,
            series.xAxis, series.yAxis, isRequired
        );
        endPointLocation = isRequired ?
            [startPointLocation, startPointLocation = endPointLocation][0] : endPointLocation;
        let options: RectOption;
        if ((endPointLocation.x - startPointLocation.x > 0) && (endPointLocation.y - startPointLocation.y > 0)) {
            options = new RectOption(
                series.chart.element.id + '_ChartSegmentClipRect_' + index,
                'transparent', { width: 1, color: 'Gray' }, 1,
                {
                    x: startPointLocation.x,
                    y: startPointLocation.y,
                    width: endPointLocation.x - startPointLocation.x,
                    height: endPointLocation.y - startPointLocation.y
                }
            );
            series.seriesElement.appendChild(
                appendClipElement(series.chart.redraw, options, series.chart.renderer)
            );
            return 'url(#' + series.chart.element.id + '_ChartSegmentClipRect_' + index + ')';
        }
        return null;
    }
    /**
     * To get exact value from segment value
     * @param segmentValue 
     * @param axis 
     * @param chart 
     */
    public getAxisValue(segmentValue: Object, axis: Axis, chart: Chart): number {
        if (segmentValue === null) {
            segmentValue = axis.visibleRange.max;
        }
        if (axis.valueType === 'DateTime') {
            let option: DateFormatOptions = { skeleton: 'full', type: 'dateTime' };
            return Date.parse(chart.intl.getDateParser(option)(
                chart.intl.getDateFormat(option)(new Date(
                    DataUtil.parse.parseJson({ val: segmentValue }).val
                ))
            ));
        } else if (axis.valueType.indexOf('Category') > -1) {
            let xValue: string = axis.valueType === 'DateTimeCategory' ?
                ((segmentValue as Date).getTime()).toString() :
                <string>segmentValue;
            return (axis.labels.indexOf(xValue) < 0) ? +segmentValue : axis.labels.indexOf(xValue);
        } else {
            return +segmentValue;
        }
    }
}