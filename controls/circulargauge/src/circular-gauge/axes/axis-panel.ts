import { CircularGauge } from '../circular-gauge';
import { createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { calculateSum, VisibleLabels, measureText, isCompleteAngle, GaugeLocation, getLocationFromAngle } from '../utils/helper';
import { Size, Rect, stringToNumber, getLabelFormat } from '../utils/helper';
import { Axis, Range, Label, Pointer } from './axis';
import { IAxisLabelRenderEventArgs } from '../model/interface';
import { axisLabelRender } from '../model/constants';
import { AxisRenderer } from './axis-renderer';
import { PointerRenderer } from './pointer-renderer';

/**
 * Specifies the CircularGauge Axis Layout
 */
const labelPadding: number = 10;
export class AxisLayoutPanel {

    private gauge: CircularGauge;
    private farSizes: number[];
    private axisRenderer: AxisRenderer;
    public pointerRenderer: PointerRenderer;

    constructor(gauge: CircularGauge) {
        this.gauge = gauge;
        this.axisRenderer = new AxisRenderer(gauge);
        this.pointerRenderer = new PointerRenderer(gauge);
    }

    /**
     * Measure the calculate the axis size and radius.
     * @return {void}
     * @private
     */

    public measureAxis(rect: Rect): void {

        this.measureAxisSize(this.gauge, rect);

        this.calculateAxesRadius();

    }

    /**
     * Measure to calculate the axis radius of the circular gauge.
     * @return {void}
     * @private
     */

    private calculateAxesRadius(): void {
        let totalRadius: number;
        let currentRadius: number;
        let rangeMaximumRadius: number = 0;
        let xMarginDiff: number = this.gauge.margin.left + this.gauge.margin.right;
        let yMarginDiff: number = this.gauge.margin.top + this.gauge.margin.bottom;
        for (let axis of <Axis[]>this.gauge.axes) {
            totalRadius = (Math.min(axis.rect.width, axis.rect.height) / 2);
            currentRadius = axis.radius != null ? stringToNumber(axis.radius, totalRadius) : totalRadius;
            rangeMaximumRadius = Math.max.apply(Math, axis.ranges.map((value: Range) => {
                return value.radius ?
                    (value.radius.indexOf('%') < 0 ? 100 : parseInt(value.radius, 10)) : 0;
            }));
            currentRadius = (rangeMaximumRadius > 100 && axis.radius == null) ?
                (currentRadius * 100) / rangeMaximumRadius : currentRadius;
            axis.currentRadius = currentRadius - axis.nearSize;
            if (this.gauge.moveToCenter && this.gauge.axes.length === 1 &&
                isNullOrUndefined(this.gauge.centerX) && isNullOrUndefined(this.gauge.centerY)) {
                let startAngle: number; let endAngle: number;
                startAngle = axis.startAngle;
                startAngle = !isCompleteAngle(startAngle, axis.endAngle) ? startAngle : [0, endAngle = 360][0];
                let startPoint: GaugeLocation = getLocationFromAngle(startAngle - 90, currentRadius, this.gauge.midPoint);
                endAngle = axis.endAngle;
                endAngle -= isCompleteAngle(startAngle, endAngle) ? 0.0001 : 0;
                let endPoint: GaugeLocation = getLocationFromAngle(endAngle - 90, currentRadius, this.gauge.midPoint);
                let xDiff: number; let yDiff: number; let startXDiff: number; let endXDiff: number;
                let startYDiff: number; let endYDiff: number; let newPoint: GaugeLocation;
                if ((startAngle >= 270 && startAngle <= 360) && ((endAngle > 270 && endAngle <= 360) ||
                    (endAngle >= 0 && endAngle <= 180))) {
                    startXDiff = Math.abs(this.gauge.gaugeRect.x - Math.abs(startPoint.x - this.gauge.gaugeRect.x));
                    newPoint = (endAngle <= 360 && endAngle >= 270) ? this.gauge.midPoint : (endAngle <= 90) ? endPoint :
                        getLocationFromAngle(90 - 90, currentRadius, this.gauge.midPoint);
                    endXDiff = Math.abs(newPoint.x - this.gauge.gaugeRect.width);
                    startPoint = (endAngle <= 360 && endAngle >= 270) ? endPoint :
                        getLocationFromAngle(360 - 90, currentRadius, this.gauge.midPoint);
                    startYDiff = Math.abs(startPoint.y - this.gauge.gaugeRect.y);
                    endPoint = (endAngle <= 360 && endAngle >= 270 || (endAngle >= 0 && endAngle < 90)) ?
                        this.gauge.midPoint : (endAngle >= 90 && endAngle <= 180) ? endPoint :
                            getLocationFromAngle(180 - 90, currentRadius, this.gauge.midPoint);
                    endYDiff = Math.abs(endPoint.y - (this.gauge.gaugeRect.y + this.gauge.gaugeRect.height));
                } else if ((startAngle >= 0 && startAngle < 90) && (endAngle >= 0 && endAngle <= 270)) {
                    startYDiff = Math.abs(startPoint.y - this.gauge.gaugeRect.y);
                    newPoint = (endAngle >= 180) ? getLocationFromAngle(180 - 90, currentRadius, this.gauge.midPoint) :
                        endPoint;
                    endYDiff = Math.abs(newPoint.y - (this.gauge.gaugeRect.y + this.gauge.gaugeRect.height));
                    startPoint = (endAngle >= 180) ? endPoint : this.gauge.midPoint;
                    startXDiff = Math.abs(this.gauge.gaugeRect.x - Math.abs(startPoint.x - this.gauge.gaugeRect.x));
                    endPoint = (endAngle >= 90) ? getLocationFromAngle(90 - 90, currentRadius, this.gauge.midPoint) : endPoint;
                    endXDiff = Math.abs(endPoint.x - this.gauge.gaugeRect.width);
                } else if ((startAngle >= 90 && startAngle < 180) && (endAngle > 90 && endAngle <= 360)) {
                    newPoint = (endAngle <= 180) ? this.gauge.midPoint : (endAngle >= 270) ?
                        getLocationFromAngle(270 - 90, currentRadius, this.gauge.midPoint) : endPoint;
                    startXDiff = Math.abs(newPoint.x - this.gauge.gaugeRect.x);
                    endXDiff = Math.abs(startPoint.x - this.gauge.gaugeRect.width);
                    startPoint = (endAngle > 270) ? getLocationFromAngle(endAngle - 90, currentRadius, this.gauge.midPoint) :
                        this.gauge.midPoint;
                    startYDiff = Math.abs(this.gauge.gaugeRect.y - startPoint.y);
                    endPoint = (endAngle >= 180) ? getLocationFromAngle(180 - 90, currentRadius, this.gauge.midPoint) : endPoint;
                    endYDiff = Math.abs(endPoint.y - (this.gauge.gaugeRect.y + this.gauge.gaugeRect.height));
                } else if ((startAngle >= 180 && startAngle <= 270) && ((endAngle <= 360 && endAngle >= 270) ||
                    (endAngle <= 90 && endAngle >= 0))) {
                    newPoint = (endAngle > 180 && endAngle < 270) ? endPoint :
                        getLocationFromAngle(270 - 90, currentRadius, this.gauge.midPoint);
                    startXDiff = Math.abs(this.gauge.gaugeRect.x - Math.abs(newPoint.x - this.gauge.gaugeRect.x));
                    newPoint = (endAngle >= 180 && endAngle <= 360) ? this.gauge.midPoint : endPoint;
                    endXDiff = Math.abs(newPoint.x - this.gauge.gaugeRect.width);
                    newPoint = (endAngle > 180 && endAngle < 270) ? this.gauge.midPoint : (endAngle >= 270 && endAngle <= 360) ? endPoint :
                        getLocationFromAngle(360 - 90, currentRadius, this.gauge.midPoint);
                    startYDiff = Math.abs(newPoint.y - this.gauge.gaugeRect.y);
                    endYDiff = Math.abs(startPoint.y - (this.gauge.gaugeRect.y + this.gauge.gaugeRect.height));
                }
                xDiff = Math.abs((startXDiff + endXDiff) - xMarginDiff);
                yDiff = Math.abs((startYDiff + endYDiff) - yMarginDiff);
                this.gauge.midPoint.x = this.gauge.midPoint.x - (startXDiff / 2) + (endXDiff / 2);
                this.gauge.midPoint.y = this.gauge.midPoint.y - (startYDiff / 2) + (endYDiff / 2);
                totalRadius = (Math.min(this.gauge.gaugeRect.width, this.gauge.gaugeRect.height) / 2) +
                    (Math.min(xDiff, yDiff) / 2);
                axis.currentRadius = (axis.radius != null ? stringToNumber(axis.radius, totalRadius) : totalRadius) - axis.nearSize;
            }
            axis.visibleRange.interval = this.calculateNumericInterval(axis, axis.rect);
            this.calculateVisibleLabels(axis);
        }
    }

    /**
     * Measure to calculate the axis size.
     * @return {void}
     * @private
     */

    private measureAxisSize(gauge: CircularGauge, rect: Rect): void {
        let sum: number;
        this.computeSize(<Axis[]>gauge.axes, rect);
        gauge.axes.map((axis: Axis, index: number) => {
            sum = calculateSum(index, this.farSizes.length - 1, this.farSizes);
            axis.rect = new Rect(
                rect.x + sum, rect.y + sum,
                rect.width - (sum * 2), rect.height - (sum * 2)
            );
        });
    }

    /**
     * Calculate the axis values of the circular gauge.
     * @return {void}
     * @private
     */

    private calculateAxisValues(rect?: Rect): void {
        for (let axis of <Axis[]>this.gauge.axes) {
            this.calculateVisibleRange(axis, rect);
            this.calculateVisibleLabels(axis);
        }
    }

    /**
     * Calculate the visible range of an axis.
     * @return {void}
     * @private
     */
    private calculateVisibleRange(axis: Axis, rect: Rect): void {
        let interval: number = axis.majorTicks.interval;
        let minimumValue: number = Math.min(axis.minimum === null ? 0 : axis.minimum, axis.maximum);
        let maximumValue: number = Math.max(axis.minimum, axis.maximum === null ? 100 : axis.maximum);

        axis.pointers.map((pointer: Pointer) => {
            pointer.currentValue = pointer.value !== null ?
                pointer.value < minimumValue ? minimumValue : pointer.value > maximumValue ? maximumValue : pointer.value
                : minimumValue;
            minimumValue = axis.minimum === null ? Math.min(pointer.currentValue, minimumValue) : minimumValue;
            maximumValue = axis.maximum === null ? Math.max(pointer.currentValue, maximumValue) : maximumValue;
        });
        minimumValue = (minimumValue === maximumValue) ?
            (interval !== null ? minimumValue - interval : minimumValue - 1) : minimumValue;
        axis.visibleRange = { min: minimumValue, max: maximumValue, interval: interval };
        axis.visibleRange.interval = this.calculateNumericInterval(axis, rect);
    }

    /**
     * Calculate the numeric intervals of an axis range.
     * @return {void}
     * @private
     */

    private calculateNumericInterval(axis: Axis, rect: Rect): number {
        if (axis.majorTicks.interval !== null) {
            return axis.majorTicks.interval;
        }
        let totalAngle: number = axis.endAngle - axis.startAngle;
        totalAngle = totalAngle <= 0 ? (totalAngle + 360) : totalAngle;
        return this.calculateNiceInterval(
            axis.visibleRange.max, axis.visibleRange.min,
            axis.currentRadius ? axis.currentRadius : (rect.width / 2),
            totalAngle
        );
    }

    /**
     * Calculate the nice interval of an axis range.
     * @return {void}
     * @private
     */

    private calculateNiceInterval(maxValue: number, minValue: number, radius: number, degree: number): number {
        let delta: number = maxValue - minValue;
        let circumference: number = 2 * Math.PI * radius * (degree / 360);
        let desiredIntervalsCount: number = Math.max((circumference * ((0.533 * 3) / 100)), 1);
        let niceInterval: number = delta / desiredIntervalsCount;
        let minInterval: number = Math.pow(10, Math.floor(Math.log(niceInterval) / Math.log(10)));
        for (let interval of [10, 5, 2, 1]) {
            let currentInterval: number = minInterval * interval;
            if (desiredIntervalsCount < (delta / currentInterval)) {
                break;
            }
            niceInterval = currentInterval;
        }
        return niceInterval;
    }

    /**
     * Calculate the visible labels of an axis.
     * @return {void}
     * @private
     */

    private calculateVisibleLabels(axis: Axis): void {
        let style: Label = <Label>axis.labelStyle;
        let customLabelFormat: boolean = style.format && style.format.match('{value}') !== null;
        let format: Function = this.gauge.intl.getNumberFormat({
            format: getLabelFormat(style.format), useGrouping: this.gauge.useGroupingSeparator
        });
        let argsData: IAxisLabelRenderEventArgs;
        axis.visibleLabels = [];
        for (let i: number = axis.visibleRange.min, interval: number = axis.visibleRange.interval,
            max: number = axis.visibleRange.max; (i <= max && interval); i += interval) {
            argsData = {
                cancel: false, name: axisLabelRender, axis: axis,
                text: customLabelFormat ? style.format.replace(new RegExp('{value}', 'g'), format(i)) :
                    format(i),
                value: i
            };
            this.gauge.trigger(axisLabelRender, argsData);
            if (!argsData.cancel) {
                axis.visibleLabels.push(new VisibleLabels(
                    argsData.text, i
                ));
            }
        }
        this.getMaxLabelWidth(this.gauge, axis);
    }

    /**
     * Measure the axes available size.
     * @return {void}
     * @private
     */

    private computeSize(axes: Axis[], rect: Rect): void {
        let lineSize: number;
        let outerHeight: number;
        let innerHeight: number;
        let isMajorTickOutside: boolean;
        let isMinorTickOutside: boolean;
        let isLabelOutside: boolean;
        let axisPadding: number = 5;
        let majorTickOffset: number = 0;
        let minorTickOffset: number = 0;
        let labelOffset: number = 0;
        this.farSizes = [];
        this.calculateAxisValues(rect);
        for (let axis of axes) {
            lineSize = (axis.lineStyle.width / 2);
            outerHeight = 0; innerHeight = 0;
            isMajorTickOutside = axis.majorTicks.position === 'Outside'; majorTickOffset = axis.majorTicks.offset;
            isMinorTickOutside = axis.minorTicks.position === 'Outside'; minorTickOffset = axis.minorTicks.offset;
            isLabelOutside = axis.labelStyle.position === 'Outside'; labelOffset = axis.labelStyle.offset;
            // Calculating the outer space of the axis
            outerHeight += !(isMajorTickOutside && isMinorTickOutside && isLabelOutside) ? axisPadding : 0;
            outerHeight += (isMajorTickOutside ? (axis.majorTicks.height + lineSize) : 0) +
                (isLabelOutside ? (axis.maxLabelSize.height + labelPadding + labelOffset) : 0) +
                ((isMinorTickOutside && !isMajorTickOutside) ? (axis.minorTicks.height + lineSize) : 0) + lineSize;

            outerHeight += (isMajorTickOutside && isMinorTickOutside) ? Math.max(majorTickOffset, minorTickOffset) :
                (isMajorTickOutside ? majorTickOffset : isMinorTickOutside ? minorTickOffset : 0);
            // Calculating the inner space of the axis
            innerHeight += (!isMajorTickOutside ? (axis.majorTicks.height + lineSize) : 0) +
                (!isLabelOutside ? (axis.maxLabelSize.height + labelPadding + labelOffset) : 0) +
                ((!isMinorTickOutside && isMajorTickOutside) ? (axis.minorTicks.height + lineSize) : 0) + lineSize;

            innerHeight += (!isMajorTickOutside && !isMinorTickOutside) ? Math.max(majorTickOffset, minorTickOffset) :
                (!isMajorTickOutside ? majorTickOffset : !isMinorTickOutside ? minorTickOffset : 0);
            if (this.farSizes[this.farSizes.length - 1]) {
                this.farSizes[this.farSizes.length - 1] += (innerHeight + outerHeight);
            }
            axis.nearSize = outerHeight - axisPadding;
            axis.farSize = innerHeight;
            outerHeight = (this.gauge.axes.length === (this.farSizes.length + 1)) ? 0 : outerHeight;
            this.farSizes.push(outerHeight);
        }
    }

    /**
     * To render the Axis element of the circular gauge. 
     * @return {void}
     * @private
     */

    public renderAxes(animate: boolean = true): void {
        let gauge: CircularGauge = this.gauge;
        let renderer: AxisRenderer = this.axisRenderer;
        let element: Element;
        let axesElements: Element = gauge.renderer.createGroup({
            'id': gauge.element.id + '_AxesCollection',
            'clip-path': 'url(#' + gauge.element.id + '_GaugeAreaClipRect_' + ')'
        });
        // To append the secondary element for annotation and tooltip
        gauge.element.appendChild(createElement('div', {
            id: gauge.element.id + '_Secondary_Element',
            styles: 'position: relative'
        }));
        gauge.axes.map((axis: Axis, index: number) => {
            element = gauge.renderer.createGroup({
                id: gauge.element.id + '_Axis_Group_' + index
            });
            renderer.drawAxisOuterLine(axis, index, element, gauge);
            renderer.drawAxisRange(axis, index, element, gauge);
            renderer.drawAxisLine(axis, index, element, gauge);
            renderer.drawMajorTickLines(axis, index, element, gauge);
            renderer.drawMinorTickLines(axis, index, element, gauge);
            renderer.drawAxisLabels(axis, index, element, gauge);
            this.pointerRenderer.drawPointers(axis, index, element, gauge, animate);
            if (gauge.annotationsModule) {
                gauge.annotationsModule.renderAnnotation(axis, index);
            }
            axesElements.appendChild(element);
        });
        // For append clip rect for axes
        gauge.svgObject.appendChild(gauge.renderer.drawClipPath({
            'id': gauge.element.id + '_GaugeAreaClipRect_',
            'x': 0, 'y': 0,
            'width': gauge.availableSize.width,
            'height': gauge.availableSize.height,
            'fill': 'transparent', 'stroke': 'transparent'
        }));
        gauge.svgObject.appendChild(axesElements);
    }

    /**
     * Calculate maximum label width for the axis.
     * @return {void}
     */
    private getMaxLabelWidth(gauge: CircularGauge, axis: Axis): void {
        axis.maxLabelSize = new Size(0, 0);
        for (let label of axis.visibleLabels) {
            label.size = measureText(label.text, axis.labelStyle.font);
            axis.maxLabelSize.width = label.size.width > axis.maxLabelSize.width ?
                label.size.width : axis.maxLabelSize.width;
            axis.maxLabelSize.height = label.size.height > axis.maxLabelSize.height ?
                label.size.height : axis.maxLabelSize.height;
        }
    }
}