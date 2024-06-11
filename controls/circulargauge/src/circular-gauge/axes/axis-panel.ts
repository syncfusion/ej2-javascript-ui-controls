import { CircularGauge } from '../circular-gauge';
import { createElement, isNullOrUndefined, AnimationOptions, Animation, animationMode } from '@syncfusion/ej2-base';
import { stringToNumber, measureText, getLocationFromAngle, getLabelFormat, VisibleLabels, isCompleteAngle, Size, GaugeLocation, Rect, getPathArc, getAngleFromValue } from '../utils/helper-common';
import { calculateSum } from '../utils/helper-axis-panel';
import { Axis, Range, Label, Pointer } from './axis';
import { IAxisLabelRenderEventArgs, IRadiusCalculateEventArgs, ICircularGaugeAnimation } from '../model/interface';
import { axisLabelRender, radiusCalculate } from '../model/constants';
import { AxisRenderer } from './axis-renderer';
import { PointerRenderer } from './pointer-renderer';
import { getCompleteArc } from '../utils/helper-pointer-renderer';

/**
 * Specifies the CircularGauge Axis Layout.
 */
export class AxisLayoutPanel {

    private gauge: CircularGauge;
    private farSizes: number[];
    private axisRenderer: AxisRenderer;
    public pointerRenderer: PointerRenderer;
    public axisOption : ICircularGaugeAnimation[] = [];
    private prevAnimatedMajorTickValue: number[] = [];
    private prevAnimatedMajorTickIndex: number[] = [];
    private prevAnimatedMinorTickValue: number[] = [];
    private prevAnimatedMinorTickIndex: number[] = [];
    private prevAnimatedTickType: string;
    private allowAxisCount: number[] = [];
    private rangeAnimationCount: number = 0;
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
            const args: IRadiusCalculateEventArgs = {
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
        const allowComponentRender: boolean = ((!isNullOrUndefined(axis.minimum) && !isNullOrUndefined(axis.maximum)
         && axis.minimum !== axis.maximum) || (isNullOrUndefined(axis.minimum) || isNullOrUndefined(axis.maximum)));
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
        const annotationElement: HTMLElement = createElement('div', {
            id: gauge.element.id + '_Secondary_Element'
        });
        annotationElement.style.position = 'relative';
        gauge.element.appendChild(annotationElement);
        gauge.axes.map((axis: Axis, index: number) => {
            element = gauge.renderer.createGroup({
                id: gauge.element.id + '_Axis_Group_' + index
            });
            this.gauge.allowComponentRender = ((!isNullOrUndefined(axis.minimum) && !isNullOrUndefined(axis.maximum)
            && axis.minimum !== axis.maximum) || (isNullOrUndefined(axis.minimum) || isNullOrUndefined(axis.maximum)));
            renderer.checkAngles(axis);
            renderer.drawAxisOuterLine(axis, index, element, gauge);
            if (gauge.allowRangePreRender) {
                renderer.drawAxisRange(axis, index, element);
            }
            renderer.drawAxisLine(axis, index, element, gauge);
            if (!gauge.allowRangePreRender) {
                renderer.drawAxisRange(axis, index, element);
            }
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
        if (gauge.allowLoadingAnimation) {
            this.durationSplitUp((gauge.animationDuration === 0 && animationMode === 'Enable') ? 3000 : gauge.animationDuration, axesElements);
        }
    }

    private labelElementAnimation(element: HTMLElement, axisIndex: number): void {
        if (element) {
            new Animation({}).animate(<HTMLElement>element, {
                duration: this.gauge.loadingAnimationDuration[axisIndex as number],
                progress: (): void => {
                    element.style.visibility = 'visible';
                },
                end: (): void => {
                    element.style.visibility = 'visible';
                    const axisElement: Element = document.getElementById(this.gauge.element.id + '_Axis_Labels_' + axisIndex);
                    if (this.gauge.axes[axisIndex as number].showLastLabel && parseInt(element.id.split('Label_')[1], 10) === (axisElement.childElementCount - 2)) {
                        (axisElement as HTMLElement).style.visibility = 'visible';
                        element = document.getElementById(this.gauge.element.id + '_Axis_' + axisIndex + '_Label_' + (axisElement.childElementCount - 1));
                        if (element) {
                            element.style.visibility = 'visible';
                        }
                    }
                }
            });
        }
    }

    private elementLabelAnimation(element: HTMLElement, axisIndex: number, tickIndex: number, gauge: CircularGauge): void {
        if (element) {
            new Animation({}).animate(<HTMLElement>element, {
                duration: gauge.axes[axisIndex as number].labelStyle.font.size != null &&
                    (gauge.axes[axisIndex as number].labelStyle.font.size === '0px' || gauge.axes[axisIndex as number].labelStyle.font.size === '0') ? 0 :
                    ((gauge.loadingAnimationDuration[axisIndex as number] / this.axisOption[axisIndex as number].axisLabelCount)),
                progress: (): void => {
                    element.style.visibility = 'visible';
                },
                end: (): void => {
                    tickIndex += 1;
                    this.elementLabelAnimation(document.getElementById(gauge.element.id + '_Axis_' + axisIndex + '_Label_' + tickIndex),
                                               axisIndex, tickIndex, gauge);
                    const axisElement: Element = document.getElementById(this.gauge.element.id + '_Axis_Labels_' + axisIndex);
                    if (this.gauge.axes[axisIndex as number].showLastLabel && parseInt(element.id.split('Label_')[1], 10) === (axisElement.childElementCount - 2)) {
                        element = document.getElementById(this.gauge.element.id + '_Axis_' + axisIndex + '_Label_' + (axisElement.childElementCount - 1));
                        if (element) {
                            element.style.visibility = 'visible';
                        }
                        (axisElement as HTMLElement).style.visibility = 'visible';
                    }
                    if (this.rangeAnimationCount === 0 && (this.axisOption[axisIndex as number].axisLabelCount - 1) === tickIndex) {
                        (axisElement as HTMLElement).style.visibility = 'visible';
                        this.rangeAnimationCount++;
                        this.rangeAnimation(gauge);
                    }
                }
            });
        }
    }

    public axisLineCalculation(axisElement: HTMLElement, axis: Axis, value: number, gauge: CircularGauge): void {
        const checkMinValue: boolean = value === axis.visibleRange.min;
        const location: GaugeLocation = gauge.midPoint;
        const isClockWise: boolean = axis.direction === 'ClockWise';
        const axisWidth: number = axis.lineStyle.width / 2;
        let startAngle: number = getAngleFromValue(
            axis.visibleRange.min, axis.visibleRange.max, axis.visibleRange.min,
            axis.startAngle, axis.endAngle, isClockWise
        );
        let endAngle: number = getAngleFromValue(
            value, axis.visibleRange.max, axis.visibleRange.min,
            axis.startAngle, axis.endAngle, isClockWise
        );
        if (isClockWise) {
            if (startAngle > endAngle) {
                endAngle = Math.round(startAngle) === Math.round(endAngle) && !checkMinValue ?
                    Math.round(endAngle) - 0.5 : Math.round(endAngle);
            }
            else {
                endAngle = startAngle === endAngle && !checkMinValue ? endAngle + 1 : endAngle;
            }
        } else {
            endAngle = Math.round(startAngle) === Math.round(endAngle) && !checkMinValue ?
                [startAngle, startAngle = (endAngle > startAngle ? endAngle + 0.5 : endAngle - 1)][0]
                : [startAngle, startAngle = endAngle][0];
        }
        axisElement.setAttribute('d', getCompleteArc(
            location, startAngle, endAngle, (axis.currentRadius + axisWidth), (axis.currentRadius - axisWidth),
            checkMinValue
        ));
    }

    public axisLineAnimation(axisIndex: number, duration: number, gauge: CircularGauge): void {
        // eslint-disable-next-line
        const axis: Axis = (gauge.axes[axisIndex] as Axis);
        this.prevAnimatedMajorTickValue.push(axis.minimum);
        this.prevAnimatedMinorTickValue.push(axis.minimum);
        this.prevAnimatedMinorTickIndex.push(0);
        this.prevAnimatedMajorTickIndex.push(0);
        this.prevAnimatedTickType = 'major';
        if (this.axisOption[axisIndex as number].isAxisLine) {
            const axisElement: HTMLElement = document.getElementById(gauge.element.id + '_AxisLine_' + axisIndex);
            const start: number =  axis.visibleRange.min;
            const end: number = axis.visibleRange.max;
            let pointerValue: number;
            let timeStamp: number;
            const val: number = Math.abs(start - end);
            new Animation({}).animate(axisElement, {
                duration: duration,
                progress: (arg: AnimationOptions): void => {
                    axisElement.style.visibility = 'visible';
                    axisElement.setAttribute('fill', axis.lineStyle.color);
                    axisElement.setAttribute('stroke-width', '0');
                    timeStamp = (arg.timeStamp / arg.duration);
                    pointerValue = end > start ? start + (timeStamp * val) : start - (timeStamp * val);
                    this.axisLineCalculation(axisElement, axis, pointerValue, gauge);
                },
                end: () => {
                    axisElement.setAttribute('fill', 'transparent');
                    axisElement.setAttribute('stroke-width', axis.lineStyle.width.toString());
                    axisElement.setAttribute('d', getPathArc(gauge.midPoint, axis.startAngle - 90, axis.endAngle - 90, axis.currentRadius));
                    axisElement.style.visibility = 'visible';
                    this.axisAnimation(axisIndex, duration, gauge);
                }
            });
        } else if (this.axisOption[axisIndex as number].isMajorTick || this.axisOption[axisIndex as number].isMinorTick) {
            if (this.axisOption[axisIndex as number].isMajorTick || (this.axisOption[axisIndex as number].isMajorTick &&
                this.axisOption[axisIndex as number].isMinorTick)) {
                this.tickElementAnimation(document.getElementById(gauge.element.id + '_Axis_Major_TickLine_' + axisIndex + '_' + 0),
                                          document.getElementById(gauge.element.id + '_Axis_' + axisIndex + '_Label_' + 0), duration,
                                          axisIndex, this.axisOption[axisIndex as number].isMajorTick &&
                                          this.axisOption[axisIndex as number].isMinorTick
                                              ? 0 : -1, 'major', this.axisOption[axisIndex as number], gauge);
            } else if (this.axisOption[axisIndex as number].isMinorTick) {
                this.tickElementAnimation(document.getElementById(gauge.element.id + '_Axis_Minor_TickLine_' + axisIndex + '_' + 0),
                                          document.getElementById(gauge.element.id + '_Axis_' + axisIndex + '_Label_' + 0), duration,
                                          axisIndex, -1, 'minor', this.axisOption[axisIndex as number], gauge);
            }
        } else if (!this.axisOption[axisIndex as number].isAxisLine) {
            this.labelRangeAnimation(gauge, axisIndex);
        }
    }

    public axisAnimation(axisIndex: number, duration: number, gauge: CircularGauge): void {
        const axisElement: HTMLElement = document.getElementById(gauge.element.id + '_AxisLine_' + axisIndex);
        const axisOption: ICircularGaugeAnimation = this.axisOption[axisIndex as number];
        new Animation({}).animate(axisElement, {
            duration: (this.axisOption[axisIndex as number].majorTickCount === 0 ? 0
                : duration / this.axisOption[axisIndex as number].majorTickCount),
            progress: (): void => {
                axisElement.style.visibility = 'visible';
            },
            end: () => {
                if (axisOption.isMajorTick) {
                    this.tickElementAnimation(document.getElementById(gauge.element.id + '_Axis_Major_TickLine_' + axisIndex + '_' + 0),
                                              document.getElementById(gauge.element.id + '_Axis_' + axisIndex + '_Label_' + 0), duration,
                                              axisIndex, axisOption.isMajorTick && axisOption.isMinorTick ? 0 : -1, 'major', axisOption, gauge);
                } else if (axisOption.isMinorTick) {
                    this.tickElementAnimation(document.getElementById(gauge.element.id + '_Axis_Minor_TickLine_' + axisIndex + '_' + 0),
                                              document.getElementById(gauge.element.id + '_Axis_' + axisIndex + '_Label_' + 0), duration,
                                              axisIndex, -1, 'minor', axisOption, gauge);
                }
                this.labelRangeAnimation(gauge, axisIndex);
            }
        });
    }

    private tickElementAnimation(tickElement: HTMLElement, labelElement: HTMLElement, duration: number, axisIndex: number,
        // eslint-disable-next-line
                                 tickIndex: number, type: string, axis: any, gauge: CircularGauge): void {
        if (tickElement && this.gauge.isAnimationProgress) {
            new Animation({}).animate(<HTMLElement>tickElement, {
                duration: (axis.isMinorTick ? axis.minorTickCount === 0 ? 0
                    : (duration / axis.minorTickCount) / this.allowAxisCount[axisIndex as number] :
                    axis.majorTickCount === 0 ? 0 : (duration / axis.majorTickCount) / this.allowAxisCount[axisIndex as number]),
                progress: (): void => {
                    tickElement.style.visibility = 'visible';
                },
                end: (): void => {
                    if (axis.isMajorTick && axis.isMinorTick && gauge.allowLoadingAnimation && this.gauge.isAnimationProgress) {
                        tickElement.style.visibility = 'visible';
                        const currentTickValue: number = parseFloat(tickElement.getAttribute('data-interval'));
                        this.prevAnimatedTickType = type;
                        if (type === 'major') {
                            this.prevAnimatedMajorTickValue[axisIndex as number] = currentTickValue;
                            this.prevAnimatedMajorTickIndex[axisIndex as number] = tickIndex;
                        } else {
                            this.prevAnimatedMinorTickValue[axisIndex as number] = currentTickValue;
                            this.prevAnimatedMinorTickIndex[axisIndex as number] = tickIndex;
                        }
                        const minorTickInterval: number = (gauge.axes[axisIndex as number].minorTicks.interval != null
                            ? gauge.axes[axisIndex as number].minorTicks.interval :
                            ((gauge.axes[axisIndex as number] as Axis).visibleRange.interval / 2));
                        const minorTickValue: number = minorTickInterval < (gauge.axes[axisIndex as number] as
                            Axis).visibleRange.interval ? currentTickValue +
                            minorTickInterval : this.prevAnimatedMinorTickValue[axisIndex as number] + minorTickInterval;
                        const majorTickValue: number = this.prevAnimatedMajorTickValue[axisIndex as number]
                        + (gauge.axes[axisIndex as number] as Axis).visibleRange.interval;
                        type = minorTickValue < majorTickValue ? 'minor' : 'major';
                        if (type === 'major' && axis.majorTickCount !== axis.minorTickCount && tickIndex !== 0 && this.prevAnimatedTickType === 'minor') {
                            tickIndex = this.prevAnimatedMajorTickIndex[axisIndex as number];
                        }
                        if (type === 'minor' && axis.majorTickCount !== axis.minorTickCount && tickIndex !== 0 && this.prevAnimatedTickType === 'major') {
                            tickIndex = this.prevAnimatedMinorTickIndex[axisIndex as number];
                        }
                        tickIndex = type === 'minor' ? axis.majorTickCount === axis.minorTickCount ? tickIndex : (currentTickValue ===
                            this.prevAnimatedMajorTickValue[axisIndex as number] ? tickIndex : tickIndex + 1) : tickIndex + 1;
                        tickElement = type === 'minor' ? document.getElementById(gauge.element.id + '_Axis_Minor_TickLine_' + axisIndex + '_' + tickIndex) :
                            document.getElementById(gauge.element.id + '_Axis_Major_TickLine_' + axisIndex + '_' + tickIndex);
                        labelElement = type === 'minor' ? null : document.getElementById(gauge.element.id + '_Axis_' + axisIndex + '_Label_' + tickIndex);
                        if (type === 'major' || tickIndex === 0) {
                            this.labelElementAnimation(document.getElementById(gauge.element.id + '_Axis_' + axisIndex + '_Label_' + tickIndex), axisIndex);
                        }
                        this.tickElementAnimation(tickElement, labelElement, duration, axisIndex, tickIndex, type, axis, gauge);
                        if (this.rangeAnimationCount === 0 && type === 'minor' && (tickIndex === axis.minorTickCount - 1 || tickIndex === axis.minorTickCount) && (gauge.axes.length - 1) === axisIndex) {
                            this.rangeAnimationCount++;
                            this.rangeAnimation(gauge);
                        }
                    } else if (gauge.allowLoadingAnimation && axis.isMajorTick && this.gauge.isAnimationProgress) {
                        tickElement.style.visibility = 'visible';
                        type = 'major';
                        tickIndex = tickIndex + 1;
                        tickElement = document.getElementById(gauge.element.id + '_Axis_Major_TickLine_' + axisIndex + '_' + tickIndex);
                        labelElement = document.getElementById(gauge.element.id + '_Axis_' + axisIndex + '_Label_' + tickIndex);
                        this.tickElementAnimation(tickElement, labelElement, duration, axisIndex, tickIndex, type, axis, gauge);
                        if (type === 'major' || tickIndex === 0) {
                            this.labelElementAnimation(document.getElementById(gauge.element.id + '_Axis_' + axisIndex + '_Label_' + tickIndex), axisIndex);
                        }
                        if (this.rangeAnimationCount === 0 && type === 'major' && tickIndex === axis.majorTickCount - 1 && (gauge.axes.length - 1) === axisIndex) {
                            this.rangeAnimationCount++;
                            this.rangeAnimation(gauge);
                        }
                    } else if (gauge.allowLoadingAnimation && this.gauge.isAnimationProgress && axis.isMinorTick) {
                        tickElement.style.visibility = 'visible';
                        type = 'minor';
                        tickIndex = tickIndex + 1;
                        tickElement = document.getElementById(gauge.element.id + '_Axis_Minor_TickLine_' + axisIndex + '_' + tickIndex);
                        labelElement = document.getElementById(gauge.element.id + '_Axis_' + axisIndex + '_Label_' + tickIndex);
                        this.tickElementAnimation(tickElement, labelElement, duration, axisIndex, tickIndex, type, axis, gauge);
                        if (type === 'minor') {
                            this.labelElementAnimation(document.getElementById(gauge.element.id + '_Axis_' + axisIndex + '_Label_' + tickIndex), axisIndex);
                        }
                        if (this.rangeAnimationCount === 0 && type === 'minor' && tickIndex === axis.minorTickCount - 1 && (gauge.axes.length - 1) === axisIndex) {
                            this.rangeAnimationCount++;
                            this.rangeAnimation(gauge);
                        }
                    }
                }
            });
        }
        this.labelRangeAnimation(gauge, axisIndex);
    }

    private labelRangeAnimation(gauge: CircularGauge, axisIndex: number): void {
        const options: ICircularGaugeAnimation = this.axisOption[axisIndex as number] as ICircularGaugeAnimation;
        if (!isNullOrUndefined(options)) {
            if (!options.isMajorTick && !options.isMinorTick && options.isAxisLabel) {
                if (options.axisLabelCount > 0) {
                    if (gauge.axes[axisIndex as number].labelStyle.hiddenLabel === 'First') {
                        this.elementLabelAnimation(document.getElementById(gauge.element.id + '_Axis_' + axisIndex + '_Label_' + 1),
                                                   axisIndex, 0, gauge);
                    } else {
                        this.elementLabelAnimation(document.getElementById(gauge.element.id + '_Axis_' + axisIndex + '_Label_' + 0),
                                                   axisIndex, 0, gauge);
                    }
                }
            } else if ((this.rangeAnimationCount === 0 && !options.isMajorTick &&
                        !options.isMinorTick && !options.isAxisLabel && options.isRange)
                        || this.rangeAnimationCount === 0 && this.gauge.isAnimationProgress
                        && !options.isMajorTick && !options.isMinorTick && !options.isAxisLabel && options.isRange) {
                this.rangeAnimationCount++;
                this.rangeAnimation(gauge);
            }
        }
    }

    private rangeAnimation(gauge: CircularGauge): void {
        for (let j: number = 0; j < gauge.axes.length; j++) {
            const rangesElement: Element = document.getElementById(gauge.element.id + '_Axis_Ranges_' + j);
            if (!isNullOrUndefined(rangesElement) && gauge.allowLoadingAnimation) {
                this.rangeElementAnimation(rangesElement, j, gauge);
            }
        }
    }

    private rangeElementAnimation(rangeElement: Element, axisIndex: number, gauge: CircularGauge): void {
        let height: number = 0;
        const opacity: number = 1;
        const isRangeAbsent: boolean = rangeElement.childElementCount > 0 &&
        gauge.axes[axisIndex as number].ranges[0].start !== gauge.axes[axisIndex as number].ranges[0].end;
        new Animation({}).animate(<HTMLElement>rangeElement, {
            duration: isRangeAbsent ? gauge.loadingAnimationDuration[axisIndex as number] : 0,
            progress: (args: AnimationOptions): void => {
                if (args.timeStamp > args.delay) {
                    height = ((args.timeStamp - args.delay) / args.duration);
                    rangeElement['style']['opacity'] = (opacity * height);
                }
            },
            end: (): void => {
                rangeElement['style']['opacity'] = opacity;
                const axisElement: Element = document.getElementById(this.gauge.element.id + '_Axis_Labels_' + axisIndex);
                if (!isNullOrUndefined(axisElement)) {
                    (axisElement as HTMLElement).style.visibility = 'visible';
                }
                if (gauge.allowLoadingAnimation && axisIndex === 0) {
                    this.axisOption = [];
                    gauge.axes.map((axis: Axis, axisindex: number) => {
                        axis.pointers.map((pointer: Pointer, pointerIndex: number) => {
                            const pointerElement: HTMLElement = document.getElementById(gauge.element.id + '_Axis_' + axisindex + '_Pointer_' + pointerIndex);
                            if (!isNullOrUndefined(pointerElement) && this.gauge.isAnimationProgress) {
                                pointer.previousValue = !this.gauge.isPropertyChange ? axis.minimum : pointer.previousValue;
                                gauge.gaugeAxisLayoutPanel.pointerRenderer.doPointerAnimation(pointerElement, pointer, axis, axisIndex);
                            }
                        });
                        if (axis.pointers.length === 0 && this.gauge.isAnimationProgress) {
                            if (this.gauge.loadingAnimationDuration[axisIndex as number] > 0 &&
                                !isNullOrUndefined(this.gauge.annotationsModule)) {
                                this.gauge.annotationsModule.annotationAnimation(this.gauge);
                            }
                        } else {
                            this.gauge.isOverAllAnimationComplete = true;
                        }
                    });
                }
            }
        });
    }

    private durationSplitUp(duration: number, axesElements: Element): void {
        let splitUpCount: number = 0;
        this.gauge.loadingAnimationDuration = [];
        for (let i: number = 0; i < axesElements.childElementCount; i++) {
            splitUpCount = 0;
            let axisCount: number = 0;
            const element: Element = axesElements.children[i as number] as Element;
            let isAxisLine: boolean = false; let isMajorTick: boolean = false; let majorTickCount: number = 0;
            let labelCount: number = 0; let isMinorTick: boolean = false; let minorTickCount: number = 0;
            let isLabel: boolean = false; let isrange: boolean = false; let isPointer: boolean = false;
            for (let j: number = 0; j < element.childElementCount; j++) {
                const elementId: string = element.children[j as number]['id'];
                if (elementId.indexOf('_AxisLine_') > 0) {
                    isAxisLine = true;
                    splitUpCount++;
                } else if (elementId.indexOf('MajorTickLines') > 0) {
                    isMajorTick = true;
                    axisCount++;
                    majorTickCount = element.children[j as number].childElementCount;
                    splitUpCount++;
                } else if (elementId.indexOf('MinorTickLines') > 0) {
                    isMinorTick = true;
                    axisCount++;
                    minorTickCount = element.children[j as number].childElementCount;
                    if (!isMajorTick) { splitUpCount++; }
                } else if (elementId.indexOf('_Axis_Labels_') > 0) {
                    isLabel = true;
                    axisCount++;
                    labelCount = element.children[j as number].childElementCount;
                    if (!isMajorTick && !isMinorTick && this.gauge.axes[i as number].labelStyle.font.size != null &&
                        (this.gauge.axes[i as number].labelStyle.font.size !== '0px' && this.gauge.axes[i as number].labelStyle.font.size !== '0')) { splitUpCount++; }
                } else if (elementId.indexOf('_Axis_Ranges_') > 0) {
                    isrange = true;
                    if (this.gauge.axes[i as number].ranges.length === 1
                        && (!isNullOrUndefined(this.gauge.axes[i as number].ranges)
                        && this.gauge.axes[i as number].ranges[0].start === 0
                        && this.gauge.axes[i as number].ranges[0].end === 0)) {
                        splitUpCount++;
                    }
                } else if (elementId.indexOf('_Axis_Pointers_') > 0) {
                    isPointer = true;
                    if (this.gauge.axes[i as number].pointers.length > 0 && this.gauge.axes[i as number].pointers.length !== 1 &&
                        this.gauge.axes[i as number].pointers[0].value !== this.gauge.axes[i as number].minimum) {
                        splitUpCount++;
                    }
                }
            }
            this.allowAxisCount.push(axisCount === 0 ? 1 : axisCount);
            this.axisOption.push({
                isAxisLine: isAxisLine, isMajorTick: isMajorTick, isMinorTick: isMinorTick,
                isAxisLabel: isLabel, isPointer: isPointer, isRange: isrange,
                axisLabelCount: labelCount, majorTickCount: majorTickCount, minorTickCount: minorTickCount
            });
            isAxisLine = false; isMajorTick = false; majorTickCount = 0;
            isMinorTick = false; labelCount = 0; minorTickCount = 0;
            isLabel = false; isrange = false; isPointer = false;
            if (this.gauge.axes[i as number].annotations != null
                && this.gauge.axes[i as number].annotations.length > 0
                && !isNullOrUndefined(this.gauge.annotationsModule)) {
                splitUpCount++;
            }
            this.gauge.loadingAnimationDuration.push(splitUpCount === 0 ? duration : duration / splitUpCount);
        }
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
        this.axisOption = null;
        this.prevAnimatedMajorTickValue = null;
        this.prevAnimatedMajorTickIndex = null;
        this.prevAnimatedMinorTickIndex = null;
        this.prevAnimatedMinorTickValue = null;
        this.allowAxisCount = null;
    }
}
