import { CircularGauge } from '../circular-gauge';
import { createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { stringToNumber, measureText, getLocationFromAngle, getLabelFormat, VisibleLabels, isCompleteAngle, Size, GaugeLocation, Rect } from '../utils/helper-common';
import { calculateSum } from '../utils/helper-axis-panel';
import { Axis, Range, Label, Pointer } from './axis';
import { IAxisLabelRenderEventArgs, IRadiusCalculateEventArgs } from '../model/interface';
import { axisLabelRender, radiusCalculate } from '../model/constants';
import { AxisRenderer } from './axis-renderer';
import { PointerRenderer } from './pointer-renderer';

/**
 * Specifies the CircularGauge Axis Layout
 */
export class AxisLayoutPanel {

    private gauge: CircularGauge;
    private farSizes: number[];
    private axisRenderer: AxisRenderer;
    public pointerRenderer: PointerRenderer;
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    constructor(gauge: CircularGauge) {
        this.gauge = gauge;
        this.axisRenderer = new AxisRenderer(gauge);
        this.pointerRenderer = new PointerRenderer(gauge);
    }

    /**
     * Measure the calculate the axis size and radius.
     *
     * @return {void}
     * @private
     */

    public measureAxis(rect: Rect): void {

        this.measureAxisSize(this.gauge, rect);

        this.calculateAxesRadius();

    }

    /**
     * Measure to calculate the axis radius of the circular gauge.
     *
     * @returns {void}
     * @private
     */
    private calculateAxesRadius(): void {
        let totalRadius: number; let currentRadius: number;
        let rangeMaximumRadius: number = 0;
        const xMarginDiff: number = this.gauge.margin.left + this.gauge.margin.right;
        const yMarginDiff: number = this.gauge.margin.top + this.gauge.margin.bottom;
        for (const axis of <Axis[]>this.gauge.axes) {
            totalRadius = (Math.min(axis.rect.width, axis.rect.height) / 2);
            currentRadius = axis.radius != null ? stringToNumber(axis.radius, totalRadius) : totalRadius;
            // eslint-disable-next-line prefer-spread
            rangeMaximumRadius = Math.max.apply(Math, axis.ranges.map((value: Range) => {
                return value.radius ?
                    (value.radius.indexOf('%') < 0 ? 100 : parseInt(value.radius, 10)) : 0;
            }));
            currentRadius = (rangeMaximumRadius > 100 && axis.radius == null) ?
                (currentRadius * 100) / rangeMaximumRadius : currentRadius;
            axis.currentRadius = currentRadius - axis.nearSize;
            if (this.gauge.moveToCenter && this.gauge.axes.length === 1 &&
                isNullOrUndefined(this.gauge.centerXpoint) && isNullOrUndefined(this.gauge.centerYpoint)) {
                let endAngle: number;
                const startAngle: number = axis.startAngle;
                let startPoint: GaugeLocation = getLocationFromAngle(startAngle - 90, currentRadius, this.gauge.midPoint);
                endAngle = axis.endAngle;
                endAngle -= isCompleteAngle(startAngle, endAngle) ? 0.0001 : 0;
                let endPoint: GaugeLocation = getLocationFromAngle(endAngle - 90, currentRadius, this.gauge.midPoint);
                let xDiff: number; let yDiff: number; let startXDiff: number; let endXDiff: number;
                let startYDiff: number; let endYDiff: number; let newPoint: GaugeLocation;
                if (startAngle > endAngle ? Math.abs(startAngle - endAngle) > 90 ? true : false : true) {
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
                        (endAngle <= 180 && endAngle >= 0))) {
                        newPoint = (endAngle > 180 && endAngle < 270) ? endPoint :
                            getLocationFromAngle(270 - 90, currentRadius, this.gauge.midPoint);
                        startXDiff = Math.abs(this.gauge.gaugeRect.x - Math.abs(newPoint.x - this.gauge.gaugeRect.x));
                        newPoint = (endAngle >= 180 && endAngle <= 360) ? this.gauge.midPoint : (endAngle <= 90) ? endPoint :
                            getLocationFromAngle(0, currentRadius, this.gauge.midPoint);
                        endXDiff = Math.abs(newPoint.x - this.gauge.gaugeRect.width);
                        newPoint = (endAngle > 180 && endAngle < 270) ? this.gauge.midPoint : (endAngle >= 270 && endAngle <= 360) ?
                            endPoint : getLocationFromAngle(360 - 90, currentRadius, this.gauge.midPoint);
                        startYDiff = Math.abs(newPoint.y - this.gauge.gaugeRect.y);
                        endPoint = (endAngle <= 360 && endAngle >= 270 || (endAngle >= 0 && endAngle < 90)) ?
                            startPoint : ((270 - startAngle) < (endAngle - 90)) ? endPoint : startPoint;
                        endYDiff = Math.abs(endPoint.y - (this.gauge.gaugeRect.y + this.gauge.gaugeRect.height));
                    }
                    if ((!isNullOrUndefined(startXDiff) && !isNullOrUndefined(endXDiff) && !isNullOrUndefined(startYDiff) &&
                        !isNullOrUndefined(endYDiff)) && ((startXDiff > 0 || endXDiff > 0) && (startYDiff > 0 || endYDiff > 0))) {
                        xDiff = Math.abs((startXDiff + endXDiff) - xMarginDiff);
                        yDiff = Math.abs((startYDiff + endYDiff) - yMarginDiff);
                        this.gauge.midPoint.x = this.gauge.midPoint.x - (startXDiff / 2) + (endXDiff / 2);
                        this.gauge.midPoint.y = this.gauge.midPoint.y - (startYDiff / 2) + (endYDiff / 2);
                        totalRadius = (Math.min(this.gauge.gaugeRect.width, this.gauge.gaugeRect.height) / 2) +
                            (Math.min(xDiff, yDiff) / 2);
                        axis.currentRadius = (axis.radius != null ? stringToNumber(axis.radius, totalRadius) : totalRadius) - axis.nearSize;
                    }
                }
            }
            axis.visibleRange.interval = this.calculateNumericInterval(axis, axis.rect);
            let args: IRadiusCalculateEventArgs = {
                cancel: false, name: radiusCalculate, currentRadius: axis.currentRadius, gauge: this.gauge,
                midPoint: this.gauge.midPoint, axis: axis
            };
            this.gauge.trigger('radiusCalculate', args, () => {
                axis.currentRadius = args.currentRadius;
                this.gauge.midPoint = args.midPoint;
                this.calculateVisibleLabels(axis);
            });
        }
    }

    /**
     * Measure to calculate the axis size.
     *
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
     *
     * @return {void}
     * @private
     */

    private calculateAxisValues(rect?: Rect): void {
        for (const axis of <Axis[]>this.gauge.axes) {
            this.calculateVisibleRange(axis, rect);
            this.calculateVisibleLabels(axis);
        }
    }

    /**
     * Calculate the visible range of an axis.
     *
     * @param {Axis} axis - Specifies the axis.
     * @param {Rect} rect - Specifies the rect.
     * @returns {void}
     * @private
     */
    private calculateVisibleRange(axis: Axis, rect: Rect): void {
        const interval: number = axis.majorTicks.interval;
        let minimumValue: number = Math.min(axis.minimum === null ? 0 : axis.minimum, axis.maximum !== null ? axis.maximum : 100);
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
     *
     * @return {void}
     * @private
     */

    private calculateNumericInterval(axis: Axis, rect: Rect): number {
        const allowComponentRender: boolean = ((!isNullOrUndefined(axis.minimum) && !isNullOrUndefined(axis.maximum) && axis.minimum !== axis.maximum) || (isNullOrUndefined(axis.minimum) || isNullOrUndefined(axis.maximum)));
        if (!allowComponentRender) {
            return 0;
        } else if (axis.majorTicks.interval !== null) {
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
     *
     * @return {void}
     * @private
     */

    private calculateNiceInterval(maxValue: number, minValue: number, radius: number, degree: number): number {
        const delta: number = maxValue - minValue;
        const circumference: number = 2 * Math.PI * radius * (degree / 360);
        const desiredIntervalsCount: number = Math.max((circumference * ((0.533 * 3) / 100)), 1);
        let niceInterval: number = delta / desiredIntervalsCount;
        const minInterval: number = Math.pow(10, Math.floor(Math.log(niceInterval) / Math.log(10)));
        for (const interval of [10, 5, 2, 1]) {
            const currentInterval: number = minInterval * interval;
            if (desiredIntervalsCount < (delta / currentInterval)) {
                break;
            }
            niceInterval = currentInterval;
        }
        return niceInterval;
    }

    /**
     * Calculate the visible labels of an axis.
     *
     * @return {void}
     * @private
     */

    private calculateVisibleLabels(axis: Axis): void {
        const style: Label = <Label>axis.labelStyle;
        const customLabelFormat: boolean = style.format && style.format.match('{value}') !== null;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const format: any = this.gauge.intl.getNumberFormat({
            format: getLabelFormat(style.format), useGrouping: this.gauge.useGroupingSeparator
        });
        let argsData: IAxisLabelRenderEventArgs;
        axis.visibleLabels = [];
        let roundValue: number;
        const interval: number = axis.visibleRange.interval;
        const max: number = axis.visibleRange.max;
        if ((isNullOrUndefined(axis.minimum) && isNullOrUndefined(axis.maximum)) || axis.minimum !== axis.maximum) {
            for (let i: number = axis.visibleRange.min; (i <= max && interval); i += interval) {
                roundValue = axis.roundingPlaces ? parseFloat(i.toFixed(axis.roundingPlaces)) : i;
                argsData = {
                    cancel: false, name: axisLabelRender, axis: axis,
                    text: customLabelFormat ? style.format.replace(new RegExp('{value}', 'g'), format(roundValue)) :
                        format(roundValue),
                    value: roundValue
                };
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const axisLabelRenderSuccess: any = (argsData: IAxisLabelRenderEventArgs) => {
                    if (!argsData.cancel) {
                        axis.visibleLabels.push(new VisibleLabels(
                            argsData.text, i
                        ));
                    }
                };
                axisLabelRenderSuccess.bind(this);
                this.gauge.trigger(axisLabelRender, argsData, axisLabelRenderSuccess);
            }
        }
        const lastLabel: number = axis.visibleLabels.length ? axis.visibleLabels[axis.visibleLabels.length - 1].value : null;
        const maxVal: number = axis.visibleRange.max;
        if (!isNullOrUndefined(lastLabel) && lastLabel !== maxVal && axis.showLastLabel === true) {
            argsData = {
                cancel: false, name: axisLabelRender, axis: axis,
                text: customLabelFormat ? style.format.replace(new RegExp('{value}', 'g'), format(maxVal)) :
                    format(maxVal),
                value: maxVal
            };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const axisLabelRenderSuccess: any = (argsData: IAxisLabelRenderEventArgs) => {
                if (!argsData.cancel) {
                    axis.visibleLabels.push(new VisibleLabels(
                        argsData.text, maxVal
                    ));
                }
            };
            axisLabelRenderSuccess.bind(this);
            this.gauge.trigger(axisLabelRender, argsData, axisLabelRenderSuccess);
        }
        this.getMaxLabelWidth(this.gauge, axis);
    }

    /**
     * Measure the axes available size.
     *
     * @return {void}
     * @private
     */

    private computeSize(axes: Axis[], rect: Rect): void {
        let lineSize: number;
        let outerHeight: number;
        let innerHeight: number;
        let heightForCross: number;
        const axisPadding: number = 5;
        let majorTickOffset: number = 0;
        let minorTickOffset: number = 0;
        let labelOffset: number = 0;
        let labelPadding: number = 10;
        this.farSizes = [];
        this.calculateAxisValues(rect);
        for (const axis of axes) {
            lineSize = (axis.lineStyle.width / 2);
            outerHeight = 0; innerHeight = 0;
            heightForCross = axis.majorTicks.position === 'Cross' ? axis.majorTicks.height / 2 : heightForCross;
            heightForCross = (axis.minorTicks.position === 'Cross' && heightForCross < axis.minorTicks.height / 2) ?
                axis.minorTicks.height / 2 : heightForCross;
            heightForCross = (axis.labelStyle.position === 'Cross' && heightForCross < axis.maxLabelSize.height / 2) ?
                axis.maxLabelSize.height / 2 : heightForCross;
            lineSize = lineSize < heightForCross ? heightForCross : lineSize;
            majorTickOffset = axis.majorTicks.offset;
            minorTickOffset = axis.minorTicks.offset;
            labelOffset = axis.labelStyle.offset;
            labelPadding = axis.labelStyle.shouldMaintainPadding ? 10 : 0;
            // Calculating the outer space of the axis
            outerHeight += !(axis.majorTicks.position === 'Outside' && axis.minorTicks.position === 'Outside' &&
                axis.labelStyle.position === 'Outside') ? axisPadding : 0;
            outerHeight += (axis.majorTicks.position === 'Outside' ? (axis.majorTicks.height + lineSize) : 0) +
                (axis.labelStyle.position === 'Outside' ? (axis.maxLabelSize.height + labelOffset + labelPadding) : 0) +
                ((axis.minorTicks.position === 'Outside' && !(axis.majorTicks.position === 'Outside')) ?
                    (axis.minorTicks.height + lineSize) : 0) + lineSize;
            outerHeight += (axis.majorTicks.position === 'Outside' && axis.minorTicks.position === 'Outside') ?
                Math.max(majorTickOffset, minorTickOffset) : (axis.majorTicks.position === 'Outside' ?
                    majorTickOffset : axis.minorTicks.position === 'Outside' ? minorTickOffset : 0);
            // Calculating the inner space of the axis
            innerHeight += ((axis.majorTicks.position === 'Inside') ? (axis.majorTicks.height + lineSize) : 0) +
                ((axis.labelStyle.position === 'Inside') ? (axis.maxLabelSize.height + labelOffset + labelPadding) : 0) +
                ((axis.minorTicks.position === 'Inside' && axis.majorTicks.position === 'Outside') ?
                    (axis.minorTicks.height + lineSize) : 0) + lineSize;
            innerHeight += ((axis.majorTicks.position === 'Inside') && (axis.minorTicks.position === 'Inside')) ?
                Math.max(majorTickOffset, minorTickOffset) : ((axis.majorTicks.position === 'Inside') ?
                    majorTickOffset : (axis.minorTicks.position === 'Inside') ? minorTickOffset : 0);
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
     *
     * @return {void}
     * @private
     */

    public renderAxes(animate: boolean = true): void {
        const gauge: CircularGauge = this.gauge;
        const renderer: AxisRenderer = this.axisRenderer;
        let element: Element;
        const axesElements: Element = gauge.renderer.createGroup({
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
            this.gauge.allowComponentRender = ((!isNullOrUndefined(axis.minimum) && !isNullOrUndefined(axis.maximum) && axis.minimum !== axis.maximum) || (isNullOrUndefined(axis.minimum) || isNullOrUndefined(axis.maximum)));
            renderer.checkAngles(axis);
            renderer.drawAxisOuterLine(axis, index, element, gauge);
            renderer.drawAxisRange(axis, index, element);
            renderer.drawAxisLine(axis, index, element, gauge);
            renderer.drawMajorTickLines(axis, index, element, gauge);
            renderer.drawMinorTickLines(axis, index, element, gauge);
            renderer.drawAxisLabels(axis, index, element, gauge);
            this.pointerRenderer.drawPointers(axis, index, element, gauge, animate);
            if (gauge.annotationsModule) {
                gauge.annotationsModule.renderAnnotation(axis, index, gauge);
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
     *
     * @param {CircularGauge} gauge - Specifies the instance of the gauge.
     * @param {Axis} axis - Specifies the axis.
     * @returns {void}
     */
    private getMaxLabelWidth(gauge: CircularGauge, axis: Axis): void {
        axis.maxLabelSize = new Size(0, 0);
        for (const label of axis.visibleLabels) {
            label.size = measureText(label.text, axis.labelStyle.font);
            axis.maxLabelSize.width = label.size.width > axis.maxLabelSize.width ?
                label.size.width : axis.maxLabelSize.width;
            axis.maxLabelSize.height = label.size.height > axis.maxLabelSize.height ?
                label.size.height : axis.maxLabelSize.height;
        }
    }

    public destroy(): void {
        this.gauge = null;
        this.farSizes = [];
        if (!isNullOrUndefined(this.axisRenderer)) {
            this.axisRenderer.destroy();
        }
        this.axisRenderer = null;
        if (!isNullOrUndefined(this.pointerRenderer)) {
            this.pointerRenderer.destroy();
        }
        this.pointerRenderer = null;
    }
}
