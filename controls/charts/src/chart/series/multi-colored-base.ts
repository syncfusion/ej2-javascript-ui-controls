import { getPoint, ChartLocation, appendClipElement, pathAnimation, animateAddPoints } from '../../common/utils/helper';
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
 * Base class for multi colored series.
 */

export class MultiColoredSeries extends LineBase {
    /**
     * To generate the area path direction.
     *
     * @param {number} xValue xValue
     * @param {number} yValue yValue
     * @param {Series} series series
     * @param {boolean} isInverted isInverted
     * @param {Function} getPointLocation getPointLocation
     * @param {ChartLocation} startPoint startPoint
     * @param {string} startPath startPath
     * @returns {string} Returns the area path direction.
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
     * To generate the empty point direction.
     *
     * @param {ChartLocation} firstPoint firstPoint
     * @param {ChartLocation} secondPoint secondPoint
     * @param {Series} series series
     * @param {boolean} isInverted isInverted
     * @param {Function} getPointLocation getPointLocation
     * @returns {string} Returns the empty point direction.
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
     * Set the color for a point based on its current state and previous state.
     *
     * @param {Points} currentPoint - The current point whose color needs to be set.
     * @param {Points} previous - The previous state of the point.
     * @param {Series} series - The series associated with the point.
     * @param {boolean} isXSegment - Indicates whether the point is in the x-segment.
     * @param {ChartSegmentModel[]} segments - The segments associated with the point.
     * @returns {boolean} - Returns true if the color is set successfully, false otherwise.
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
     * @param {boolean} pointAnimate pointAnimate
     * @returns {void}
     */
    public applySegmentAxis(series: Series, options: PathOption[], segments: ChartSegmentModel[], pointAnimate?: boolean): void {
        if (series.pointColorMapping !== '') {
            options.map((option: PathOption) => {
                this[pointAnimate ? 'addMulticolorPath' : 'appendLinePath'](option, series, '');
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
                    if (pointAnimate) {
                        this.addMulticolorPath(attributeOptions, series, '', true);
                    }
                    else {
                        pathAnimation(getElement(attributeOptions.id), attributeOptions.d, chart.redraw);
                    }
                    series.pathElement = chart.renderer.drawPath(attributeOptions);
                    if (!series.chart.enableCanvas && !pointAnimate) {
                        series.seriesElement.appendChild(
                            chart.renderer.drawPath(attributeOptions)
                        );
                    }
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
    private addMulticolorPath(options: PathAttributes, series: Series, clipRect: string, isSegnment?: boolean): void {
        const points: { element: Element; previousDirection: string; chart: Chart } =
            this.appendPathElement(options, series, clipRect);
        if (points.previousDirection === null || points.previousDirection === '') {
            points.previousDirection = 'M ' + (options.d).split(' ').slice(-3)[0] + ' ' + (options.d).split(' ').slice(-5)[0] + ' L ' + (options.d).split(' ').slice(-3)[0] + ' ' + (options.d).split(' ').slice(-5)[0] + ' L ' + (options.d).split(' ').slice(-3)[0] + ' ' + (options.d).split(' ').slice(-5)[0];
        }
        if (options.d === null || options.d === '') {
            options.d = 'M ' + (points.previousDirection).split(' ').slice(-3)[0] + ' ' + (points.previousDirection).split(' ').slice(-5)[0] + ' L ' + (points.previousDirection).split(' ').slice(-3)[0] + ' ' + (points.previousDirection).split(' ').slice(-5)[0];
        }
        if (isSegnment) {
            const startPathCommands: string[] = points.previousDirection.match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/g);
            const endPathCommands: string[] = (options.d).match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/g);
            const maxLength: number = Math.max(startPathCommands.length, endPathCommands.length);
            const minLength: number = Math.min(startPathCommands.length, endPathCommands.length);
            if (startPathCommands.length === endPathCommands.length) {
                animateAddPoints(getElement(options.id), options.d, series.chart.redraw, points.previousDirection, this.chart.duration);
            }
            if (startPathCommands.length < endPathCommands.length) {
                for (let i: number = minLength; i < maxLength; i++) {
                    if (endPathCommands.length !== startPathCommands.length) {
                        startPathCommands.splice(
                            startPathCommands.length - ((series.type.indexOf('Line') !== -1) ? 1 : 2),
                            0,
                            startPathCommands[startPathCommands.length - ((series.type.indexOf('Line') !== -1) ? 1 : 2)]
                        );
                    }
                }
                animateAddPoints(getElement(options.id), options.d, series.chart.redraw, startPathCommands.join(' '), this.chart.duration);
            }
            if (startPathCommands.length > endPathCommands.length) {
                for (let i: number = minLength; i < maxLength; i++) {
                    if (endPathCommands.length !== startPathCommands.length) {
                        endPathCommands.splice(1, 0, endPathCommands[1].replace('M', 'L'));
                    }
                }
                animateAddPoints(points.element, endPathCommands.join(''), series.chart.redraw, startPathCommands.join(''), this.chart.duration, options.d);
            }
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
     * @returns {string} clip rect for segment axis
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
        if (((series.xAxis.isInversed || series.xAxis.isAxisInverse)  ?
            startPointLocation.x - endPointLocation.x > 0 : endPointLocation.x - startPointLocation.x > 0) &&
            (series.yAxis.isInversed ? startPointLocation.y - endPointLocation.y > 0 : endPointLocation.y - startPointLocation.y > 0)) {
            options = new RectOption(
                series.chart.element.id + '_ChartSegment' + series.index + 'ClipRect_' + index,
                'transparent', { width: 1, color: 'Gray' }, 1,
                {
                    x: (series.xAxis.isInversed || series.xAxis.isAxisInverse) ? endPointLocation.x : startPointLocation.x,
                    y: series.yAxis.isInversed ? endPointLocation.y : startPointLocation.y,
                    width: (series.xAxis.isInversed || series.xAxis.isAxisInverse) ? startPointLocation.x - endPointLocation.x :
                        endPointLocation.x - startPointLocation.x,
                    height: series.yAxis.isInversed ? startPointLocation.y - endPointLocation.y : endPointLocation.y - startPointLocation.y
                }
            );
            if (!series.chart.enableCanvas) {
                series.seriesElement.appendChild(
                    appendClipElement(series.chart.redraw, options, series.chart.renderer as SvgRenderer)
                );
            }
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
     * @returns {number} - Returns segment value.
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
