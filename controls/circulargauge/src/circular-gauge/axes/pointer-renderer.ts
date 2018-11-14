import { CircularGauge } from '../circular-gauge';
import { Axis, Pointer, VisibleRangeModel } from './axis';
import { stringToNumber, GaugeLocation, Size, calculateShapes, appendPath } from '../utils/helper';
import { getLocationFromAngle, PathOption } from '../utils/helper';
import { linear, getAngleFromValue, getCompleteArc, getRoundedPathArc } from '../utils/helper';
import { Animation, AnimationOptions } from '@syncfusion/ej2-base';
import { animationComplete } from '../model/constants';

/**
 * Specifies the Axis rendering for circular gauge
 */

export class PointerRenderer {

    private gauge: CircularGauge;
    /**
     * Constructor for pointer renderer.
     * @private.
     */
    constructor(gauge: CircularGauge) {
        this.gauge = gauge;
    }

    /**
     * Method to render the axis pointers of the circular gauge.
     * @return {void}
     * @private
     */
    public drawPointers(axis: Axis, axisIndex: number, element: Element, gauge: CircularGauge, animate: boolean = true): void {
        let pointerElement: Element = gauge.renderer.createGroup({
            id: gauge.element.id + '_Axis_Pointers_' + axisIndex
        });
        let childElement: Element;
        let range: VisibleRangeModel;
        axis.pointers.map((pointer: Pointer, pointerIndex: number) => {
            range = axis.visibleRange;
            pointer.pathElement = [];
            this.calculatePointerRadius(axis, pointer);
            childElement = gauge.renderer.createGroup({
                id: gauge.element.id + '_Axis_' + axisIndex + '_Pointer_' + pointerIndex
            });
            this['draw' + pointer.type + 'Pointer'](axis, axisIndex, pointerIndex, childElement, gauge);
            this.setPointerValue(axis, pointer, pointer.currentValue);
            pointerElement.appendChild(childElement);
            if (animate) {
                this.doPointerAnimation(pointer, axis);
            }
        });
        element.appendChild(pointerElement);
    }

    /**
     * Measure the pointer length of the circular gauge.
     * @return {void}
     */

    private calculatePointerRadius(axis: Axis, pointer: Pointer): void {
        let padding: number = 5;
        pointer.currentRadius = pointer.radius === null ?
            (axis.currentRadius - (axis.farSize + padding)) :
            stringToNumber(pointer.radius, axis.currentRadius);
    }

    /**
     * Method to render the needle pointer of the ciruclar gauge.
     * @return {void}
     */
    private drawNeedlePointer(axis: Axis, axisIndex: number, index: number, parentElement: Element, gauge: CircularGauge): void {
        let pointer: Pointer = <Pointer>axis.pointers[index];
        let pointerRadius: number;
        let location: GaugeLocation;
        let direction: string;
        let mid: GaugeLocation = gauge.midPoint;
        let width: number = pointer.pointerWidth / 2;
        let rectDirection: string;
        // To render the needle
        location = getLocationFromAngle(0, pointer.currentRadius, mid);
        direction = 'M ' + mid.x + ' ' + (mid.y - width) + ' L ' + (location.x) + ' ' + mid.y +
            ' L ' + (mid.x) + ' ' + (mid.y + width) + ' Z';
        pointer.pathElement.push(appendPath(
            new PathOption(
                gauge.element.id + '_Axis_' + axisIndex + '_Pointer_Needle_' + index, pointer.color,
                pointer.border.width, pointer.border.color, null, '0', direction
            ),
            parentElement, gauge)
        );
        pointerRadius = stringToNumber(
            pointer.needleTail.length, pointer.currentRadius
        );

        // To render the rect element for touch

        rectDirection = 'M ' + mid.x + ' ' + (mid.y - width) + ' L ' + (location.x) + ' ' + (mid.y - width) +
            ' L ' + location.x + ' ' + (mid.y + width) + ' L ' + mid.x + ' ' + (mid.y + width);

        // To render the needle tail
        if (pointerRadius) {
            location = getLocationFromAngle(180, pointerRadius, gauge.midPoint);
            direction = 'M ' + mid.x + ' ' + (mid.y - width) +
                ' L ' + (location.x) + ' ' + (mid.y - width) +
                ' L ' + (location.x) + ' ' + (mid.y + width) +
                ' L ' + (mid.x) + ' ' + (mid.y + width) + ' Z';

            pointer.pathElement.push(appendPath(
                new PathOption(
                    gauge.element.id + '_Axis_' + axisIndex + '_Pointer_NeedleTail_' + index, pointer.needleTail.color,
                    pointer.needleTail.border.width, pointer.needleTail.border.color, null, '0', direction
                ),
                parentElement, gauge)
            );

            rectDirection += ' L ' + location.x + ' ' + (mid.y + width) + ' L ' + location.x + ' ' + (mid.y - width);
        }
        // To render the cap
        if (pointer.cap.radius) {
            pointer.pathElement.push(appendPath(
                calculateShapes(
                    mid, 'Circle', new Size(pointer.cap.radius * 2, pointer.cap.radius * 2),
                    '', new PathOption(
                        gauge.element.id + '_Axis_' + axisIndex + '_Pointer_NeedleCap_' + index,
                        pointer.cap.color, pointer.cap.border.width, pointer.cap.border.color, null, '0', '', ''
                    )
                ),
                parentElement, gauge, 'Ellipse')
            );
        }

        pointer.pathElement.push(appendPath(
            new PathOption(
                gauge.element.id + '_Axis_' + axisIndex + '_Pointer_NeedleRect_' + index, 'transparent',
                0, 'transpanret', null, '0', rectDirection + ' Z'
            ),
            parentElement, gauge)
        );

    }

    /**
     * Method to set the pointer value of the circular gauge.
     * @return {void}
     * @private
     */
    public setPointerValue(axis: Axis, pointer: Pointer, value: number): void {
        let location: GaugeLocation = this.gauge.midPoint;
        let isClockWise: boolean = axis.direction === 'ClockWise';
        let startAngle: number = getAngleFromValue(
            axis.visibleRange.min, axis.visibleRange.max, axis.visibleRange.min,
            axis.startAngle, axis.endAngle, isClockWise
        );
        let endAngle: number = getAngleFromValue(
            value, axis.visibleRange.max, axis.visibleRange.min,
            axis.startAngle, axis.endAngle, isClockWise
        );
        if (isClockWise) {
            endAngle = startAngle === endAngle ? endAngle + 1 : endAngle;
        } else {
            endAngle  = startAngle === endAngle ? [startAngle, startAngle = endAngle - 1][0] : [startAngle, startAngle = endAngle][0];
        }
        let roundedStartAngle: number;
        let roundedEndAngle: number;
        let oldStart: number;
        let oldEnd: number;
        oldStart = ((((pointer.currentRadius - (pointer.pointerWidth / 2)) * ((startAngle * Math.PI) / 180) -
            (pointer.roundedCornerRadius / 4)) / (pointer.currentRadius - (pointer.pointerWidth / 2))) * 180) / Math.PI;
        oldEnd = ((((pointer.currentRadius - (pointer.pointerWidth / 2)) * ((endAngle * Math.PI) / 180) +
            (pointer.roundedCornerRadius / 4)) / (pointer.currentRadius - (pointer.pointerWidth / 2))) * 180) / Math.PI;
        roundedStartAngle = ((((pointer.currentRadius) * ((startAngle * Math.PI) / 180) +
            pointer.roundedCornerRadius) / (pointer.currentRadius)) * 180) / Math.PI;
        roundedEndAngle = ((((pointer.currentRadius) * ((endAngle * Math.PI) / 180) -
            pointer.roundedCornerRadius) / (pointer.currentRadius)) * 180) / Math.PI;
        pointer.pathElement.map((element: Element) => {
            if (pointer.type === 'RangeBar') {
                if (pointer.roundedCornerRadius) {
                    element.setAttribute('d', getRoundedPathArc(
                        location, roundedStartAngle, roundedEndAngle, oldStart, oldEnd, pointer.currentRadius,
                        pointer.pointerWidth, pointer.pointerWidth
                    ));
                } else {
                    element.setAttribute('d', getCompleteArc(
                        location, startAngle, endAngle, pointer.currentRadius, (pointer.currentRadius - pointer.pointerWidth)
                    ));
                }
            } else {
                element.setAttribute(
                    'transform', 'rotate(' + getAngleFromValue(
                        value, axis.visibleRange.max, axis.visibleRange.min,
                        axis.startAngle, axis.endAngle, isClockWise
                    ) + ',' + location.x + ',' + location.y + ')'
                );
            }
            element.setAttribute('aria-label', pointer.description || 'Pointer:' + value.toString());
        });
    }

    /**
     * Method to render the marker pointer of the ciruclar gauge.
     * @return {void}
     */
    private drawMarkerPointer(axis: Axis, axisIndex: number, index: number, parentElement: Element, gauge: CircularGauge): void {
        let pointer: Pointer = <Pointer>axis.pointers[index];
        let location: GaugeLocation = getLocationFromAngle(
            0, pointer.currentRadius,
            gauge.midPoint
        );
        pointer.pathElement.push(appendPath(
            calculateShapes(
                location, pointer.markerShape, new Size(pointer.markerWidth, pointer.markerHeight),
                pointer.imageUrl, new PathOption(
                    gauge.element.id + '_Axis_' + axisIndex + '_Pointer_Marker_' + index,
                    pointer.color, pointer.border.width, pointer.border.color, null, '0', '', ''
                )
            ),
            parentElement, gauge,
            pointer.markerShape === 'Circle' ? 'Ellipse' : (pointer.markerShape === 'Image' ? 'Image' : 'Path'))
        );
    }

    /**
     * Method to render the range bar pointer of the ciruclar gauge.
     * @return {void}
     */
    private drawRangeBarPointer(axis: Axis, axisIndex: number, index: number, parentElement: Element, gauge: CircularGauge): void {
        let pointer: Pointer = <Pointer>axis.pointers[index];
        pointer.pathElement.push(appendPath(
            new PathOption(
                gauge.element.id + '_Axis_' + axisIndex + '_Pointer_RangeBar_' + index, pointer.color,
                pointer.border.width, pointer.border.color,
                1, '0', ''
            ),
            parentElement, gauge
        ));
    }

    /**
     * Method to perform the animation of the pointer in circular gauge.
     * @return {void}
     */
    private doPointerAnimation(pointer: Pointer, axis: Axis): void {
        let startValue: number = axis.visibleRange.min;
        let endValue: number = pointer.currentValue;
        if (pointer.animation.enable && startValue !== endValue && this.gauge.animatePointer) {
            pointer.pathElement.map((element: Element) => {
                if (pointer.type === 'RangeBar') {
                    this.performRangeBarAnimation(
                        element as HTMLElement, startValue, endValue, axis, pointer,
                        pointer.currentRadius, (pointer.currentRadius - pointer.pointerWidth)
                    );
                } else {
                    this.performNeedleAnimation(
                        element as HTMLElement, startValue, endValue, axis, pointer,
                        pointer.currentRadius, (pointer.currentRadius - pointer.pointerWidth)
                    );
                }
            });
        }
    }

    /**
     * Perform the needle and marker pointer animation for circular gauge.
     * @return {void}
     * @private
     */
    public performNeedleAnimation(
        element: HTMLElement, start: number, end: number, axis: Axis, pointer: Pointer, radius?: number,
        innerRadius?: number
    ): void {
        let isClockWise: boolean = axis.direction === 'ClockWise';
        let startAngle: number = getAngleFromValue(
            start, axis.visibleRange.max, axis.visibleRange.min,
            axis.startAngle, axis.endAngle, isClockWise
        );
        let pointAngle: number = getAngleFromValue(
            end, axis.visibleRange.max, axis.visibleRange.min,
            axis.startAngle, axis.endAngle, isClockWise
        );
        let endAngle: number = startAngle > pointAngle ? (pointAngle + 360) : pointAngle;
        let sweepAngle: number;
        new Animation({}).animate(element, {
            duration: pointer.animation.duration,
            progress: (args: AnimationOptions): void => {
                sweepAngle = (start < end || Math.round(startAngle) === Math.round(endAngle)) ?
                    isClockWise ? (endAngle - startAngle) : (endAngle - startAngle - 360) :
                    isClockWise ? (endAngle - startAngle - 360) : (endAngle - startAngle);
                element.style.animation = 'None';
                element.setAttribute(
                    'transform', 'rotate(' + linear(args.timeStamp, startAngle, sweepAngle, args.duration) + ',' +
                    this.gauge.midPoint.x.toString() + ',' + this.gauge.midPoint.y.toString() + ')'
                );
            },
            end: (model: AnimationOptions) => {
                this.setPointerValue(axis, pointer, end);
                if (pointer.type === 'Marker' || (element.id.indexOf('_Pointer_NeedleCap') >= 0)) {
                    this.gauge.trigger(animationComplete, { axis: axis, pointer: pointer });
                }
            }
        });
    }

    /**
     * Perform the range bar pointer animation for circular gauge.
     * @return {void}
     * @private
     */
    public performRangeBarAnimation(
        element: HTMLElement, start: number, end: number, axis: Axis, pointer: Pointer, radius: number, innerRadius?: number): void {
        let isClockWise: boolean = axis.direction === 'ClockWise';
        let startAngle: number = getAngleFromValue(
            start, axis.visibleRange.max, axis.visibleRange.min,
            axis.startAngle, axis.endAngle, isClockWise
        );
        let minAngle: number = getAngleFromValue(
            axis.visibleRange.min, axis.visibleRange.max, axis.visibleRange.min,
            axis.startAngle, axis.endAngle, isClockWise
        );
        let pointAngle: number = getAngleFromValue(
            end, axis.visibleRange.max, axis.visibleRange.min,
            axis.startAngle, axis.endAngle, isClockWise
        );
        let sweepAngle: number;
        let endAngle: number = startAngle > pointAngle ? (pointAngle + 360) : pointAngle;
        new Animation({}).animate(element, {
            duration: pointer.animation.duration,
            progress: (arg: AnimationOptions): void => {
                element.style.animation = 'None';
                sweepAngle = (start < end || Math.round(startAngle) === Math.round(endAngle)) ?
                    isClockWise ? (endAngle - startAngle) : (endAngle - startAngle - 360) :
                    isClockWise ? (endAngle - startAngle - 360) : (endAngle - startAngle);
                if (isClockWise) {
                    element.setAttribute('d', getCompleteArc(
                        this.gauge.midPoint, minAngle,
                        linear(arg.timeStamp, startAngle, sweepAngle, arg.duration) + 0.0001, radius, innerRadius)
                    );
                } else {
                    element.setAttribute('d', getCompleteArc(
                        this.gauge.midPoint, linear(arg.timeStamp, startAngle, sweepAngle, arg.duration),
                        minAngle + 0.0001, radius, innerRadius)
                    );
                }
            },
            end: (model: AnimationOptions) => {
                this.setPointerValue(axis, pointer, end);
                this.gauge.trigger(animationComplete, { axis: axis, pointer: pointer });
            }
        });
    }
}