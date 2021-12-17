/* eslint-disable max-len */
import { CircularGauge } from '../circular-gauge';
import { Pointer, VisibleRangeModel, Axis, NeedleTail, Cap } from './axis';
import { stringToNumber, textElement, appendPath, getAngleFromValue, getLocationFromAngle, getRoundedPathArc, calculateShapes, PathOption, Size, GaugeLocation, TextOption } from '../utils/helper-common';
import { linear, getCompleteArc } from '../utils/helper-pointer-renderer';
import { Animation, AnimationOptions, isNullOrUndefined } from '@syncfusion/ej2-base';
import { animationComplete } from '../model/constants';
import { GaugeShape } from '../utils/enum';

/**
 * Specifies the Axis rendering for circular gauge
 */

export class PointerRenderer {

    private gauge: CircularGauge;
    /**
     * Constructor for pointer renderer.
     *
     * @param {CircularGauge} gauge - Specifies the instance of the gauge.
     * @private.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    constructor(gauge: CircularGauge) {
        this.gauge = gauge;
    }

    /**
     * Method to render the axis pointers of the circular gauge.
     *
     * @param {Axis} axis - Specifies the axis.
     * @param {number} axisIndex - Specifies the axis index.
     * @param {Element} element - Specifies the element.
     * @param {CircularGauge} gauge - Specifies the instance of the gauge.
     * @param {boolean} animate - Specifies the boolean value.
     * @returns {void}
     * @private
     */
    public drawPointers(axis: Axis, axisIndex: number, element: Element, gauge: CircularGauge, animate: boolean = true): void {

        const pointerElement: Element = gauge.renderer.createGroup({
            id: gauge.element.id + '_Axis_Pointers_' + axisIndex
        });
        let childElement: Element;
        let range: VisibleRangeModel;
        if (this.gauge.allowComponentRender) {
            axis.pointers.map((pointer: Pointer, pointerIndex: number) => {
                if (!isNullOrUndefined(pointer.offset) && (<string>pointer.offset).length > 0) {
                    pointer.currentDistanceFromScale = stringToNumber(<string>pointer.offset, axis.currentRadius);
                } else {
                    pointer.currentDistanceFromScale = <number>pointer.offset;
                }
                range = axis.visibleRange;
                pointer.pathElement = [];
                this.calculatePointerRadius(axis, pointer);
                childElement = gauge.renderer.createGroup({
                    id: gauge.element.id + '_Axis_' + axisIndex + '_Pointer_' + pointerIndex
                });
                this['draw' + pointer.type + 'Pointer'](axis, axisIndex, pointerIndex, childElement, gauge);
                this.setPointerValue(axis, pointer, pointer.currentValue);
                pointerElement.appendChild(childElement);
                if (animate || pointer.animation.enable) {
                    this.doPointerAnimation(pointer, axis);
                }
            });
            element.appendChild(pointerElement);
        }
    }

    /**
     * Measure the pointer length of the circular gauge.
     *
     * @returns {void}
     */

    private calculatePointerRadius(axis: Axis, pointer: Pointer): void {
        const padding: number = 5;
        pointer.currentRadius = !isNullOrUndefined(pointer.radius) ?
            stringToNumber(pointer.radius, axis.currentRadius) : pointer.position !== 'Auto' ?
                this.pointerRadiusForPosition(axis, pointer) : (axis.currentRadius - (axis.farSize + padding));
    }

    /**
     * Measure the pointer length of the circular gauge based on pointer position.
     *
     * @returns {number}
     */

    private pointerRadiusForPosition(axis: Axis, pointer: Pointer): number {
        if (pointer.markerShape === 'Text') {
            let pointerRadius: number;
            const pointerSize: number = parseInt(pointer.textStyle.size, 10);
            const markerOffset: number = pointer.position === 'Cross' ? pointerSize / 5 : 0;
            // eslint-disable-next-line prefer-const
            pointerRadius = pointer.position === 'Inside' ?
                (axis.currentRadius - pointerSize / 1.2 - axis.lineStyle.width / 2 - markerOffset - pointer.currentDistanceFromScale) :
                pointer.position === 'Outside' ?
                    (axis.currentRadius + axis.lineStyle.width / 2 + pointerSize / 4 + markerOffset +
                        pointer.currentDistanceFromScale) :
                    (axis.currentRadius - pointerSize / 6 - markerOffset - pointer.currentDistanceFromScale);
            return pointerRadius;
        } else {
            let pointerRadius: number;
            const rangeBarOffset: number = pointer.type === 'RangeBar' ? pointer.pointerWidth : 0;
            const markerOffset: number = pointer.type === 'Marker' ? ((pointer.markerShape === 'InvertedTriangle' ||
                    pointer.markerShape === 'Triangle') ? (pointer.position === 'Cross' ? pointer.markerWidth / 2 : 0) :
                pointer.markerWidth / 2) : 0;
            // eslint-disable-next-line prefer-const
            pointerRadius = pointer.position === 'Inside' ?
                (axis.currentRadius - axis.lineStyle.width / 2 - markerOffset - pointer.currentDistanceFromScale) :
                pointer.position === 'Outside' ?
                    (axis.currentRadius + rangeBarOffset + axis.lineStyle.width / 2 + markerOffset + pointer.currentDistanceFromScale) :
                    (axis.currentRadius + rangeBarOffset / 2 - pointer.currentDistanceFromScale -
                            ((pointer.markerShape === 'InvertedTriangle' || pointer.markerShape === 'Triangle') ? markerOffset : 0));
            return pointerRadius;
        }
    }

    /**
     * Method to render the needle pointer of the ciruclar gauge.
     *
     * @param {Axis} axis - Specifies the axis
     * @param {number} axisIndex - Specifies the axis index.
     * @param {number} index - Specifies the index.
     * @param {Element} parentElement - Specifies the parent element.
     * @param {CircularGauge} gauge - Specifies the instance of the gauge.
     * @returns {void}
     */
    private drawNeedlePointer(axis: Axis, axisIndex: number, index: number, parentElement: Element, gauge: CircularGauge): void {
        const pointer: Pointer = <Pointer>axis.pointers[index];
        const needle: NeedleTail = <NeedleTail>pointer.needleTail;
        const cap: Cap = <Cap>pointer.cap;
        let pointerRadius: number;
        let location: GaugeLocation;
        let direction: string;
        const needleStartWidth: number = pointer.needleStartWidth;
        const needleEndWidth: number = pointer.needleEndWidth;
        const mid: GaugeLocation = gauge.midPoint;
        const width: number = pointer.pointerWidth / 2;
        let rectDirection: string;
        let gradientColor: string;
        let gradientTailColor: string;
        let gradientCapColor: string;
        // To render the needle
        location = getLocationFromAngle(0, pointer.currentRadius, mid);
        if ((needleStartWidth === 0) && (needleEndWidth === 0) && width) {
            direction = 'M ' + mid.x + ' ' + (mid.y) + ' L ' + (location.x) + ' ' + mid.y +
                ' L ' + (mid.x) + ' ' + (mid.y) + ' Z';
        } else {
            direction = 'M ' + mid.x + ' ' + (mid.y - width - needleEndWidth) + ' L ' + (location.x) + ' ' + mid.y +
                ' L ' + location.x + ' ' + (mid.y + needleStartWidth) + ' L ' + mid.x + ' ' + (mid.y + width + needleEndWidth) + ' Z';
        }
        if (gauge.gradientModule) {
            gradientColor = gauge.gradientModule.getGradientColorString(pointer);
        }
        pointer.pathElement.push(appendPath(
            new PathOption(
                gauge.element.id + '_Axis_' + axisIndex + '_Pointer_Needle_' + index, gradientColor ? gradientColor :
                    pointer.color || this.gauge.themeStyle.needleColor,
                pointer.border.width, pointer.border.color, null, '0', direction
            ),
            parentElement, gauge)
        );
        // eslint-disable-next-line prefer-const
        pointerRadius = stringToNumber(
            pointer.needleTail.length, pointer.currentRadius
        );

        // To render the rect element for touch

        rectDirection = 'M ' + mid.x + ' ' + (mid.y - width) + ' L ' + (location.x) + ' ' + (mid.y - width) +
            ' L ' + location.x + ' ' + (mid.y + width) + ' L ' + mid.x + ' ' + (mid.y + width);

        // To render the needle tail
        if (gauge.gradientModule) {
            gradientTailColor = gauge.gradientModule.getGradientColorString(needle);
        }
        if (pointerRadius) {
            location = getLocationFromAngle(180, pointerRadius, gauge.midPoint);
            direction = 'M ' + mid.x + ' ' + (mid.y - width) +
                ' L ' + (location.x) + ' ' + (mid.y - width) +
                ' L ' + (location.x) + ' ' + (mid.y + width) +
                ' L ' + (mid.x) + ' ' + (mid.y + width) + ' Z';
            pointer.pathElement.push(appendPath(
                new PathOption(
                    gauge.element.id + '_Axis_' + axisIndex + '_Pointer_NeedleTail_' + index,
                    gradientTailColor ? gradientTailColor : pointer.needleTail.color || this.gauge.themeStyle.needleTailColor,
                    pointer.needleTail.border.width, pointer.needleTail.border.color, null, '0', direction
                ),
                parentElement, gauge)
            );
            rectDirection += ' L ' + location.x + ' ' + (mid.y + width) + ' L ' + location.x + ' ' + (mid.y - width);
        }
        // To render the cap
        if (gauge.gradientModule) {
            gradientCapColor = gauge.gradientModule.getGradientColorString(cap);
        }
        if (pointer.cap.radius) {
            pointer.pathElement.push(appendPath(
                calculateShapes(
                    mid, 'Circle', new Size(pointer.cap.radius * 2, pointer.cap.radius * 2),
                    '', new PathOption(
                        gauge.element.id + '_Axis_' + axisIndex + '_Pointer_NeedleCap_' + index,
                        gradientCapColor ? gradientCapColor : pointer.cap.color || this.gauge.themeStyle.capColor, pointer.cap.border.width,
                        pointer.cap.border.color, null, '0', '', ''
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
     *
     * @param {Axis} axis - Specifies the axis.
     * @param {Pointer} pointer - Specifies the pointer.
     * @param {number} value - Specifies the value.
     * @returns {void}
     * @private
     */
    public setPointerValue(axis: Axis, pointer: Pointer, value: number): void {
        const checkMinValue: boolean = value === axis.visibleRange.min && pointer.type === 'RangeBar';
        const location: GaugeLocation = this.gauge.midPoint;
        const isClockWise: boolean = axis.direction === 'ClockWise';
        let startAngle: number = getAngleFromValue(
            axis.visibleRange.min, axis.visibleRange.max, axis.visibleRange.min,
            axis.startAngle, axis.endAngle, isClockWise
        );
        let endAngle: number = getAngleFromValue(
            value, axis.visibleRange.max, axis.visibleRange.min,
            axis.startAngle, axis.endAngle, isClockWise
        );
        if (isClockWise) {
            endAngle = startAngle === endAngle && !checkMinValue ? endAngle + 1 : endAngle;
        } else {
            endAngle = startAngle === endAngle && !checkMinValue ? [startAngle, startAngle = endAngle - 1][0]
                : [startAngle, startAngle = endAngle][0];
        }
        let radius: number = pointer.roundedCornerRadius;
        let minRadius: number = (radius * 0.25);
        if (value <= minRadius) {
            // eslint-disable-next-line no-constant-condition
            radius = value === 1 || 2 ? 8 : radius;
            radius /= 2;
            minRadius = radius * 0.25;
        }
        const oldStartValue: number = ((((pointer.currentRadius - (pointer.pointerWidth / 2)) * ((startAngle * Math.PI) / 180) -
            (radius / minRadius)) / (pointer.currentRadius - (pointer.pointerWidth / 2))) * 180) / Math.PI;
        const oldEndValue: number = ((((pointer.currentRadius - (pointer.pointerWidth / 2)) * ((endAngle * Math.PI) / 180) +
                (radius / minRadius)) / (pointer.currentRadius - (pointer.pointerWidth / 2))) * 180) / Math.PI;
        let roundStartAngle: number = ((((pointer.currentRadius) * ((startAngle * Math.PI) / 180) +
                radius) / (pointer.currentRadius)) * 180) / Math.PI;
        let roundEndAngle: number = ((((pointer.currentRadius) * ((endAngle * Math.PI) / 180) -
                radius) / (pointer.currentRadius)) * 180) / Math.PI;
        if (roundStartAngle > roundEndAngle && (roundStartAngle - roundEndAngle) <= radius && pointer.type === 'RangeBar') {
            roundStartAngle = startAngle;
            roundEndAngle = endAngle;
        }
        if (isNullOrUndefined(pointer.currentRadius)) {
            this.calculatePointerRadius(axis, pointer);
        }
        pointer.pathElement.map((element: Element) => {
            if (pointer.type === 'RangeBar') {
                if (pointer.roundedCornerRadius && value && !checkMinValue) {
                    element.setAttribute('d', getRoundedPathArc(
                        location, Math.floor(roundStartAngle), Math.ceil(roundEndAngle), oldStartValue, oldEndValue,
                        pointer.currentRadius, pointer.pointerWidth, pointer.pointerWidth
                    ));
                    radius = 0;
                } else {
                    element.setAttribute('d', getCompleteArc(
                        location, startAngle, endAngle, pointer.currentRadius, (pointer.currentRadius - pointer.pointerWidth),
                        checkMinValue
                    ));
                }
            } else {
                if (pointer.type === 'Marker' && pointer.markerShape === 'Text') {
                    const textangle: number = getAngleFromValue(pointer.value, axis.visibleRange.max, axis.visibleRange.min, axis.startAngle, axis.endAngle, axis.direction === 'ClockWise');
                    const textlocation: GaugeLocation = getLocationFromAngle((pointer.markerShape === 'Text') ? textangle : 0, pointer.currentRadius, this.gauge.midPoint);
                    element.setAttribute(
                        'transform', 'rotate(' + (textangle + 90) + ',' + textlocation.x + ',' + textlocation.y + ')'
                    );
                    element.setAttribute('x', String(textlocation.x));
                    element.setAttribute('y', String(textlocation.y));
                } else {
                    element.setAttribute(
                        'transform', 'rotate(' + getAngleFromValue(
                            value, axis.visibleRange.max, axis.visibleRange.min,
                            axis.startAngle, axis.endAngle, isClockWise
                        ) + ',' + location.x + ',' + location.y + ')'
                    );
                }
            }
            element.setAttribute('aria-label', pointer.description || 'Pointer:' + value.toString());
        });
    }

    /**
     * Method to render the marker pointer of the ciruclar gauge.
     *
     * @param {Axis} axis - Specifies the axis
     * @param {number} axisIndex - Specifies the axis index.
     * @param {number} index - Specifies the index.
     * @param {Element} parentElement - Specifies the parent element.
     * @param {CircularGauge} gauge - Specifies the instance of the gauge.
     * @returns {void}
     */
    private drawMarkerPointer(axis: Axis, axisIndex: number, index: number, parentElement: Element, gauge: CircularGauge): void {
        const pointer: Pointer = <Pointer>axis.pointers[index];
        const min: number = axis.visibleRange.min;
        const max: number = axis.visibleRange.max;
        let gradientMarkerColor: string;
        const angle: number = Math.round(getAngleFromValue(pointer.value, max, min, axis.startAngle, axis.endAngle, axis.direction === 'ClockWise'));
        let shapeBasedOnPosition: GaugeShape = pointer.markerShape;
        if (gauge.gradientModule) {
            gradientMarkerColor = gauge.gradientModule.getGradientColorString(pointer);
        }
        if (isNullOrUndefined(pointer.radius) && !isNullOrUndefined(pointer.position) && (pointer.markerShape === 'InvertedTriangle' ||
            pointer.markerShape === 'Triangle')) {
            shapeBasedOnPosition = ((pointer.position === 'Outside' || pointer.position === 'Cross') && pointer.markerShape === 'Triangle' ?
                'InvertedTriangle' as GaugeShape : (pointer.position === 'Inside' &&
                    pointer.markerShape === 'InvertedTriangle' ? 'Triangle' as GaugeShape : pointer.markerShape));
        }
        const location: GaugeLocation = getLocationFromAngle(
            (pointer.markerShape === 'Text') ? angle : 0, pointer.currentRadius,
            gauge.midPoint
        );
        if (pointer.markerShape === 'Text') {
            const textOption: TextOption =
                new TextOption(
                    gauge.element.id + '_Axis_' + axisIndex + '_Pointer_Marker_' + index, location.x, location.y, 'middle',
                    pointer.text, 'rotate(' + (angle + 90) + ',' +
                    (location.x) + ',' + location.y + ')',
                    'auto');
            textElement(textOption, pointer.textStyle, pointer.textStyle.color, parentElement, 'pointer-events : auto; ');
        } else {
            pointer.pathElement.push(appendPath(
                calculateShapes(
                    location, shapeBasedOnPosition, new Size(pointer.markerWidth, pointer.markerHeight),
                    pointer.imageUrl, new PathOption
                    (
                        gauge.element.id + '_Axis_' + axisIndex + '_Pointer_Marker_' + index,
                        gradientMarkerColor ? gradientMarkerColor : pointer.color || this.gauge.themeStyle.pointerColor,
                        pointer.border.width, pointer.border.color, null, '0', '', ''
                    )
                ),
                parentElement, gauge,
                pointer.markerShape === 'Circle' ? 'Ellipse' : (pointer.markerShape === 'Image' ? 'Image' : 'Path')
            )
            );
        }
    }

    /**
     * Method to render the range bar pointer of the ciruclar gauge.
     *
     * @param {Axis} axis - Specifies the axis
     * @param {number} axisIndex - Specifies the axis index.
     * @param {number} index - Specifies the index.
     * @param {Element} parentElement - Specifies the parent element.
     * @param {CircularGauge} gauge - Specifies the instance of the gauge.
     * @returns {void}
     */
    private drawRangeBarPointer(axis: Axis, axisIndex: number, index: number, parentElement: Element, gauge: CircularGauge): void {
        const pointer: Pointer = <Pointer>axis.pointers[index];
        let gradientBarColor: string;
        if (gauge.gradientModule) {
            gradientBarColor = gauge.gradientModule.getGradientColorString(pointer);
        }
        pointer.pathElement.push(appendPath(
            new PathOption(
                gauge.element.id + '_Axis_' + axisIndex + '_Pointer_RangeBar_' + index, gradientBarColor ? gradientBarColor :
                    pointer.color || this.gauge.themeStyle.pointerColor,
                pointer.border.width, pointer.border.color,
                1, '0', ''
            ),
            parentElement, gauge
        ));
    }

    /**
     * Method to perform the animation of the pointer in circular gauge.
     *
     * @param {Pointer} pointer - Specifies the pointer.
     * @param {Axis} axis - Specifies the axis.
     * @returns {void}
     */
    private doPointerAnimation(pointer: Pointer, axis: Axis): void {
        const startValue: number = !isNullOrUndefined(pointer.previousValue) ? pointer.previousValue : axis.visibleRange.min;
        const endValue: number = pointer.currentValue;
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
     *
     * @param {HTMLElement} element - Specifies the element
     * @param {number} start - Specifies the start
     * @param {number} end - Specifies the end
     * @param {Axis} axis - Specifies the axis
     * @param {Pointer} pointer - Specifies the pointer
     * @param {number} radius - Specifies the radius
     * @param {number} innerRadius - Specifies the innerRadius
     * @returns {void}
     * @private
     */
    public performNeedleAnimation(
        element: HTMLElement, start: number, end: number, axis: Axis, pointer: Pointer, radius?: number,
        innerRadius?: number
    ): void {
        const isClockWise: boolean = axis.direction === 'ClockWise';
        const startAngle: number = getAngleFromValue(
            start, axis.visibleRange.max, axis.visibleRange.min,
            axis.startAngle, axis.endAngle, isClockWise
        );
        const pointAngle: number = getAngleFromValue(
            end, axis.visibleRange.max, axis.visibleRange.min,
            axis.startAngle, axis.endAngle, isClockWise
        );
        const endAngle: number = startAngle > pointAngle ? (pointAngle + 360) : pointAngle;
        let sweepAngle: number;
        new Animation({}).animate(element, {
            duration: pointer.animation.duration,
            progress: (args: AnimationOptions): void => {
                sweepAngle = (start < end || Math.round(startAngle) === Math.round(endAngle)) ?
                    isClockWise ? (endAngle - startAngle) : (endAngle - startAngle - 360) :
                    isClockWise ? (endAngle - startAngle - 360) : (endAngle - startAngle);
                element.style.animation = 'None';
                if (start !== end) {
                    element.setAttribute(
                        'transform', 'rotate(' + linear(args.timeStamp, startAngle, sweepAngle, args.duration) + ',' +
                        this.gauge.midPoint.x.toString() + ',' + this.gauge.midPoint.y.toString() + ')'
                    );
                }
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
     *
     * @param {HTMLElement} element - Specifies the element.
     * @param {number} start - Specifies the start.
     * @param {number} end - Specifies the end.
     * @param {Axis} axis - Specifies the axis.
     * @param {Pointer} pointer - Specifies the pointer.
     * @param {number} radius - Specifies the radius.
     * @param {number} innerRadius - Specifies the innerRadius.
     * @returns {void}
     * @private
     */
    public performRangeBarAnimation(
        element: HTMLElement, start: number, end: number, axis: Axis, pointer: Pointer, radius: number, innerRadius?: number): void {
        const isClockWise: boolean = axis.direction === 'ClockWise';
        const startAngle: number = getAngleFromValue(
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
        const roundRadius: number = pointer.roundedCornerRadius;
        let sweepAngle: number;
        let endAngle: number;
        let oldStart: number;
        const minRadius: number = (radius * 0.25);
        if (roundRadius) {
            minAngle = ((((pointer.currentRadius) * ((minAngle * Math.PI) / 180) +
                roundRadius) / (pointer.currentRadius)) * 180) / Math.PI;
            pointAngle = ((((pointer.currentRadius) * ((pointAngle * Math.PI) / 180) -
                roundRadius) / (pointer.currentRadius)) * 180) / Math.PI;
            oldStart = ((((pointer.currentRadius - (pointer.pointerWidth / 2)) * ((startAngle * Math.PI) / 180) -
                (radius / minRadius)) / (pointer.currentRadius - (pointer.pointerWidth / 2))) * 180) / Math.PI;
        }
        // eslint-disable-next-line prefer-const
        endAngle = startAngle > pointAngle ? (pointAngle + 360) : pointAngle;
        new Animation({}).animate(element, {
            duration: pointer.animation.duration,
            progress: (arg: AnimationOptions): void => {
                element.style.animation = 'None';
                sweepAngle = (start < end || Math.round(startAngle) === Math.round(endAngle)) ?
                    isClockWise ? (endAngle - startAngle) : (endAngle - startAngle - 360) :
                    isClockWise ? (endAngle - startAngle - 360) : (endAngle - startAngle);
                if (isClockWise) {
                    if (!roundRadius) {
                        element.setAttribute('d', getCompleteArc(
                            this.gauge.midPoint, minAngle,
                            linear(arg.timeStamp, startAngle, sweepAngle, arg.duration) + 0.0001, radius, innerRadius)
                        );
                    } else {
                        element.setAttribute('d', getRoundedPathArc(
                            this.gauge.midPoint, Math.floor(minAngle),
                            linear(arg.timeStamp, Math.floor(minAngle), sweepAngle, arg.duration) + 0.0001, oldStart,
                            linear(arg.timeStamp, Math.floor(minAngle + (roundRadius / 2)), sweepAngle, arg.duration) + 0.0001,
                            radius, pointer.pointerWidth, pointer.pointerWidth
                        ));
                    }
                } else {
                    if (!roundRadius) {
                        element.setAttribute('d', getCompleteArc(
                            this.gauge.midPoint, linear(arg.timeStamp, startAngle, sweepAngle, arg.duration),
                            minAngle + 0.0001, radius, innerRadius)
                        );
                    } else {
                        sweepAngle += roundRadius;
                        element.setAttribute('d', getRoundedPathArc(
                            this.gauge.midPoint,
                            linear(arg.timeStamp, Math.floor(oldStart), sweepAngle, arg.duration),
                            Math.floor(oldStart) + 0.0001,
                            linear(arg.timeStamp, Math.floor(minAngle - roundRadius - (roundRadius / 2)), sweepAngle, arg.duration),
                            Math.floor(oldStart + (roundRadius / 2)) + 0.0001, radius, pointer.pointerWidth, pointer.pointerWidth
                        ));
                    }
                }
            },
            end: (model: AnimationOptions) => {
                this.setPointerValue(axis, pointer, end);
                this.gauge.trigger(animationComplete, { axis: axis, pointer: pointer });
            }
        });
    }
}
