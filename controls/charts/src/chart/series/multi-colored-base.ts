/* eslint-disable jsdoc/require-param */
/* eslint-disable valid-jsdoc */
/* eslint-disable jsdoc/require-returns */
import { getPoint, ChartLocation, appendClipElement, pathAnimation } from '../../common/utils/helper';
import { PathOption, SvgRenderer } from '@syncfusion/ej2-svg-base';
import { Chart } from '../chart';
import { Series, Points } from './chart-series';
import { Axis } from '../../chart/axis/axis';
import { LineBase } from './line-base';
import { RectOption, getElement } from '../../common/utils/helper';
import { ChartSegment } from './chart-series';
import { ChartSegmentModel } from './chart-series-model';
import { DataUtil } from '@syncfusion/ej2-data';
import { DateFormatOptions } from '@syncfusion/ej2-base';
import {PathAttributes }  from '@syncfusion/ej2-svg-base';
/**
 * Base class for multi colored series
 */

export class MultiColoredSeries extends LineBase {
    /**
     * To Generate the area path direction.
     *
     * @param {number} xValue xValue
     * @param {number} yValue yValue
     * @param {Series} series series
     * @param {boolean} isInverted isInverted
     * @param {Function} getPointLocation getPointLocation
     * @param {ChartLocation} startPoint startPoint
     * @param {string} startPath startPath
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
     * To Generate the empty point direction.
     *
     * @param {ChartLocation} firstPoint firstPoint
     * @param {ChartLocation} secondPoint secondPoint
     * @param {Series} series series
     * @param {boolean} isInverted isInverted
     * @param {Function} getPointLocation getPointLocation
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
     * To set point color.
     */
    public setPointColor(currentPoint: Points, previous: Points, series: Series, isXSegment : boolean,
                         segments: ChartSegmentModel[]): boolean {
        if (series.pointColorMapping === '') {
            let segment : ChartSegmentModel;
            let value : number;
            for (let i : number = 0; i < segments.length ; i++) {
                segment = segments[i as number];
                value = isXSegment ? currentPoint.xValue : currentPoint.yValue;
                if (value <= this.getAxisValue(segment.value, isXSegment ? series.xAxis : series.yAxis, series.chart) ||
                    (!segment.value && segment.value !== 0)) {
                    currentPoint.interior = segment.color;
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
        const axis: Axis = series.segmentAxis === 'X' ? series.xAxis : series.yAxis;
        const segments: ChartSegmentModel[] = [].concat(chartSegments);
        return segments.sort((a : ChartSegmentModel, b : ChartSegmentModel) => {
            return this.getAxisValue(a.value, axis, series.chart) -  this.getAxisValue(b.value, axis, series.chart);
        });
    }

    /**
     * Segment calculation performed here.
     *
     * @param {Series} series series
     * @param {PathOption[]} options options
     * @param {ChartSegmentModel[]} segments chartSegments
     */
    public applySegmentAxis(series: Series, options: PathOption[], segments: ChartSegmentModel[]): void {
        if (series.pointColorMapping !== '') {
            options.map((option: PathOption) => {
                this.appendLinePath(option, series, '');
            });
            return null;
        }
        const isXSegment: boolean = series.segmentAxis === 'X';
        const axis: Axis = isXSegment ? series.xAxis : series.yAxis;
        const chart: Chart = series.chart;
        let segment: ChartSegment;
        this.includeSegment(segments, axis, series, segments.length);
        const length: number = segments.length;
        let value : number;
        let clipPath : string;
        let attributeOptions: PathAttributes;
        let areaBorderCount: number = 0;
        for (let index: number = 0; index < length; index++) {
            segment = segments[index as number] as ChartSegment;
            value = this.getAxisValue(segment.value, axis, series.chart);
            clipPath = this.createClipRect(index ? this.getAxisValue(segments[index - 1].value, axis, series.chart)
                : axis.visibleRange.min,
                                           value, series, index, isXSegment);
            if (clipPath) {
                options.map((option: PathOption) => {
                    areaBorderCount += 1;
                    attributeOptions = {
                        'clip-path': clipPath,
                        'stroke-dasharray': segment.dashArray,
                        'opacity': option.opacity,
                        'stroke': series.type.indexOf('Line') > -1 ? segment.color || series.interior : option['stroke'],
                        'stroke-width': option['stroke-width'],
                        'fill': series.type.indexOf('Line') > -1 ? 'none' : segment.color || series.interior,
                        'id': option.id + '_Segment_' + index,
                        'd': option.d
                    };
                    if (areaBorderCount % 2 === 0 && this.chart.multiColoredAreaSeriesModule && series.border.color !== 'transparent' &&  attributeOptions['stroke-width'] !== 0) {
                        attributeOptions.fill = 'transparent';
                    }
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
     * To create clip rect for segment axis.
     *
     * @param {number} startValue startValue
     * @param {number} endValue endValue
     * @param {Series} series series
     * @param {number} index index
     * @param {boolean} isX isX
     */
    public createClipRect(
        startValue: number, endValue: number, series: Series,
        index: number, isX: boolean
    ): string {
        const isRequired: boolean = series.chart.requireInvertedAxis;
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
                series.chart.element.id + '_ChartSegment' + series.index + 'ClipRect_' + index,
                'transparent', { width: 1, color: 'Gray' }, 1,
                {
                    x: startPointLocation.x,
                    y: startPointLocation.y,
                    width: endPointLocation.x - startPointLocation.x,
                    height: endPointLocation.y - startPointLocation.y
                }
            );
            series.seriesElement.appendChild(
                appendClipElement(series.chart.redraw, options, series.chart.renderer as SvgRenderer)
            );
            return 'url(#' + series.chart.element.id + '_ChartSegment' + series.index + 'ClipRect_' + index + ')';
        }
        return null;
    }
    /**
     * To get exact value from segment value.
     *
     * @param {Object} segmentValue segmentValue
     * @param {Axis} axis axis
     * @param {Chart} chart chart
     */
    public getAxisValue(segmentValue: Object, axis: Axis, chart: Chart): number {
        if (segmentValue === null) {
            segmentValue = axis.visibleRange.max;
        }
        if (axis.valueType === 'DateTime') {
            const option: DateFormatOptions = { skeleton: 'full', type: 'dateTime' };
            return Date.parse(chart.intl.getDateParser(option)(
                chart.intl.getDateFormat(option)(new Date(
                    DataUtil.parse.parseJson({ val: segmentValue }).val
                ))
            ));
        } else if (axis.valueType.indexOf('Category') > -1) {
            const xValue: string = axis.valueType === 'DateTimeCategory' ?
                ((segmentValue as Date).getTime()).toString() :
                <string>segmentValue;
            return (axis.labels.indexOf(xValue) < 0) ? +segmentValue : axis.labels.indexOf(xValue);
        } else {
            return +segmentValue;
        }
    }

}
