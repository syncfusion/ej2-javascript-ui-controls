/* eslint-disable max-len */
import { CircularGauge } from '../circular-gauge';
import { Pointer, Axis, NeedleTail, Cap } from './axis';
import { stringToNumber, textElement, appendPath, getAngleFromValue, getLocationFromAngle, getRoundedPathArc, calculateShapes, PathOption, Size, GaugeLocation, TextOption } from '../utils/helper-common';
import { linear, getCompleteArc } from '../utils/helper-pointer-renderer';
import { Animation, AnimationOptions, isNullOrUndefined, animationMode } from '@syncfusion/ej2-base';
import { animationComplete } from '../model/constants';
import { GaugeShape } from '../utils/enum';
import { FontModel } from '../model/base-model';

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
        if (this.gauge.allowComponentRender) {
            axis.pointers.map((pointer: Pointer, pointerIndex: number) => {
                if (!isNullOrUndefined(pointer.offset) && (<string>pointer.offset).length > 0) {
                    pointer.currentDistanceFromScale = stringToNumber(<string>pointer.offset, axis.currentRadius);
                } else {
                    pointer.currentDistanceFromScale = <number>pointer.offset;
                }
                pointer.pathElement = [];
                this.calculatePointerRadius(axis, pointer);
                childElement = gauge.renderer.createGroup({
                    id: gauge.element.id + '_Axis_' + axisIndex + '_Pointer_' + pointerIndex
                });
                if (pointer.value != null) {
                    childElement.setAttribute('aria-label', pointer.description || 'Pointer:' + pointer.value.toString());
                    childElement.setAttribute('role', 'region');
                }
                this['draw' + pointer.type + 'Pointer'](axis, axisIndex, pointerIndex, childElement, gauge);
                if (this.gauge.allowLoadingAnimation) {
                    (childElement as HTMLElement).style.visibility = 'hidden';
                } else {
                    this.setPointerValue(axis, pointer, pointer.currentValue);
                }
                pointerElement.appendChild(childElement);
                if (!this.gauge.allowLoadingAnimation && ((animate || pointer.animation.enable) || animationMode === 'Enable') && (!this.gauge.isPropertyChange || pointer.isPointerAnimation)) {
                    pointer.previousValue = !this.gauge.isPropertyChange ? axis.minimum : pointer.previousValue;
                    this.doPointerAnimation(childElement, pointer, axis, axisIndex);
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
        const pointer: Pointer = <Pointer>axis.pointers[index as number];
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
                pointer.border.width, pointer.border.color, null, pointer.border.dashArray, direction
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
                    pointer.needleTail.border.width, pointer.needleTail.border.color, null, pointer.needleTail.border.dashArray, direction
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
                        pointer.cap.border.color, null, pointer.cap.border.dashArray, '', ''
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
        let radius: number = pointer.roundedCornerRadius;
        let minRadius: number = (radius * 0.25);
        if (radius > 0 && radius <= 5) {
            radius = 6;
            minRadius = (radius * 0.25);
        }
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
                    Math.round(endAngle) - (pointer.roundedCornerRadius > 0 ? 1.5 : 0.5) : Math.round(endAngle);
            }
            else {
                endAngle = startAngle === endAngle && !checkMinValue ? endAngle + 1 : endAngle;
            }
        } else {
            endAngle = Math.round(startAngle) === Math.round(endAngle) && !checkMinValue ?
                [startAngle, startAngle = (endAngle > startAngle ? endAngle + (pointer.roundedCornerRadius > 0 ? 1.5 : 0.5) : endAngle - 1)][0]
                : [startAngle, startAngle = endAngle][0];
        }
        if (value <= (axis.visibleRange.min + axis.visibleRange.interval) && pointer.roundedCornerRadius) {
            radius = value === axis.visibleRange.min || (axis.visibleRange.min + 1) ? 8 : radius;
            radius /= 2;
            minRadius = radius * 0.25;
        }
        const oldStartValue: number = ((((pointer.currentRadius - (pointer.pointerWidth / 2)) * ((startAngle * Math.PI) / 180) -
            (radius / minRadius)) / (pointer.currentRadius - (pointer.pointerWidth / 2))) * 180) / Math.PI;
        const oldEndValue: number = ((((pointer.currentRadius - (pointer.pointerWidth / 2)) * ((endAngle * Math.PI) / 180) +
                (radius / minRadius)) / (pointer.currentRadius - (pointer.pointerWidth / 2))) * 180) / Math.PI;
        const angleValue: number = value === axis.maximum && (axis.startAngle === axis.endAngle ||
            Math.abs(axis.startAngle - axis.endAngle) === 360) && pointer.type === 'RangeBar' ? 45 : 180;
        let roundStartAngle: number = ((((pointer.currentRadius) * ((startAngle * Math.PI) / angleValue) +
                radius) / (pointer.currentRadius)) * angleValue) / Math.PI;
        let roundEndAngle: number = ((((pointer.currentRadius) * ((endAngle * Math.PI) / angleValue) -
                radius) / (pointer.currentRadius)) * angleValue) / Math.PI;
        if (roundStartAngle > roundEndAngle && (roundStartAngle - roundEndAngle) <= 36 && pointer.type === 'RangeBar') {
            roundStartAngle = startAngle;
            roundEndAngle = endAngle;
        }
        if (isNullOrUndefined(pointer.currentRadius)) {
            this.calculatePointerRadius(axis, pointer);
        }

        pointer.pathElement.map((element: Element) => {
            if (pointer.type === 'RangeBar') {
                if (radius && !checkMinValue) {
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
                    this.calculateTextElement(axis, pointer, value, element);
                } else {
                    element.setAttribute(
                        'transform', 'rotate(' + getAngleFromValue(
                            value, axis.visibleRange.max, axis.visibleRange.min,
                            axis.startAngle, axis.endAngle, isClockWise
                        ) + ',' + location.x + ',' + location.y + ')'
                    );
                }
            }
        });
    }

    /**
     * Method to set the text value of the circular gauge.
     *
     * @param {Axis} axis - Specifies the axis.
     * @param {Pointer} pointer - Specifies the pointer.
     * @param {number} value - Specifies the value.
     * @param {Element} element - Specifies the text element.
     * @returns {void}
     * @private
     */
    public calculateTextElement(axis: Axis, pointer: Pointer, value: number, element: Element): void {
        const textangle: number = getAngleFromValue(value, axis.visibleRange.max, axis.visibleRange.min, axis.startAngle, axis.endAngle, axis.direction === 'ClockWise');
        const textlocation: GaugeLocation = getLocationFromAngle( textangle, pointer.currentRadius, this.gauge.midPoint);
        element.setAttribute(
            'transform', 'rotate(' + (textangle + 90) + ',' + textlocation.x + ',' + textlocation.y + ')'
        );
        element.setAttribute('x', String(textlocation.x));
        element.setAttribute('y', String(textlocation.y));
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
        const pointer: Pointer = <Pointer>axis.pointers[index as number];
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
            const style: FontModel = {
                size: pointer.textStyle.size,
                color: pointer.textStyle.color || this.gauge.themeStyle.pointerColor,
                fontFamily: pointer.textStyle.fontFamily,
                fontStyle: pointer.textStyle.fontStyle,
                fontWeight: pointer.textStyle.fontWeight || this.gauge.themeStyle.fontWeight,
                opacity: pointer.textStyle.opacity
            };
            const textOption: TextOption =
                new TextOption(
                    gauge.element.id + '_Axis_' + axisIndex + '_Pointer_Marker_' + index, location.x, location.y, 'middle',
                    pointer.text, 'rotate(' + (angle + 90) + ',' +
                    (location.x) + ',' + location.y + ')',
                    'auto');
            const textObject: Element = textElement(textOption, style, style.color, parentElement, 'pointer-events : auto; ');
            (textObject as HTMLElement).style.visibility = ((pointer.animation.enable || animationMode === 'Enable') && (!this.gauge.isPropertyChange || pointer.isPointerAnimation) && this.gauge.animatePointer) ? 'hidden' : 'visible';
            pointer.pathElement.push(textObject);
        } else {
            pointer.pathElement.push(appendPath(
                calculateShapes(
                    location, shapeBasedOnPosition, new Size(pointer.markerWidth, pointer.markerHeight),
                    pointer.imageUrl, new PathOption
                    (
                        gauge.element.id + '_Axis_' + axisIndex + '_Pointer_Marker_' + index,
                        gradientMarkerColor ? gradientMarkerColor : pointer.color || this.gauge.themeStyle.pointerColor,
                        pointer.border.width, pointer.border.color, null, pointer.border.dashArray, '', ''
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
        const pointer: Pointer = <Pointer>axis.pointers[index as number];
        let gradientBarColor: string;
        if (gauge.gradientModule) {
            gradientBarColor = gauge.gradientModule.getGradientColorString(pointer);
        }
        pointer.pathElement.push(appendPath(
            new PathOption(
                gauge.element.id + '_Axis_' + axisIndex + '_Pointer_RangeBar_' + index, gradientBarColor ? gradientBarColor :
                    pointer.color || this.gauge.themeStyle.pointerColor,
                pointer.border.width, pointer.border.color,
                1, pointer.border.dashArray, ''
            ),
            parentElement, gauge
        ));
    }

    /**
     * Method to perform the animation of the pointer in circular gauge.
     *
     * @param {Element} pointerElement - specifies the pointer element.
     * @param {Pointer} pointer - Specifies the pointer.
     * @param {Axis} axis - Specifies the axis.
     * @returns {void}
     * @private
     */
    public doPointerAnimation(pointerElement: Element, pointer: Pointer, axis: Axis, axisIndex: number): void {
        const startValue: number = !isNullOrUndefined(pointer.previousValue) ? pointer.previousValue : axis.visibleRange.min;
        const endValue: number = pointer.currentValue;
        if (((pointer.animation.enable || animationMode === 'Enable') && startValue !== endValue && this.gauge.animatePointer) ||
            (!isNullOrUndefined(this.gauge.loadingAnimationDuration) && this.gauge.loadingAnimationDuration[axisIndex as number] > 0)) {
            pointer.pathElement.map((element: Element) => {
                if (pointer.type === 'RangeBar') {
                    this.performRangeBarAnimation(element as HTMLElement, startValue, endValue, axis, pointer, axisIndex);
                } else {
                    if (pointer.type === 'Marker' && pointer.markerShape === 'Text') {
                        this.performTextAnimation(pointerElement as HTMLElement, startValue, endValue, axis, pointer, axisIndex);
                    }
                    else {
                        this.performNeedleAnimation(
                            element as HTMLElement, startValue, endValue, axis, pointer, axisIndex);
                    }
                }
            });
        }
    }

    /**
     * @param {HTMLElement} element - specifies the element.
     * @param {number} start - specifies the start.
     * @param {number} end - specifies the end.
     * @param {Axis} axis - specifies the axis.
     * @param {Pointer} pointer - specfies the pointer.
     * @returns {void}
     * @private
     */
    public performTextAnimation(element: HTMLElement, start: number, end: number, axis: Axis, pointer: Pointer, axisIndex: number): void {
        const isClockWise: boolean = axis.direction === 'ClockWise';
        let textangle: number;
        let textlocation: GaugeLocation;
        let pointerValue: number = 0;
        let timeStamp: number;
        start = typeof(start) === 'string' ? parseInt(start, 10) : start;
        end = typeof(end) === 'string' ? parseInt(end, 10) : end;
        element = !isNullOrUndefined(element.children[0]) ? element.children[0] as HTMLElement : element;
        const val: number = Math.abs(start - end);
        new Animation({}).animate(element, {
            duration: this.gauge.isAnimationProgress ? (isNullOrUndefined(pointer.value) || pointer.value === axis.minimum ? 0 :
                (animationMode === 'Enable' && (((!pointer.animation.enable || pointer.animation.duration === 0)
                    && !this.gauge.allowLoadingAnimation) || (this.gauge.allowLoadingAnimation && (this.gauge.animationDuration === 0
                        && pointer.animation.enable && pointer.animation.duration === 0)))) ? 1000 :
                    (this.gauge.allowLoadingAnimation ? (pointer.animation.enable && pointer.animation.duration > 0 ? pointer.animation.duration
                        : this.gauge.loadingAnimationDuration[axisIndex as number]) : pointer.animation.duration)) : 0,
            progress: (args: AnimationOptions): void => {
                if (this.gauge.isAnimationProgress) {
                    if (args.timeStamp > args.delay) {
                        timeStamp = (args.timeStamp / pointer.animation.duration);
                        pointerValue = end > start ? start + (timeStamp * val) : start - (timeStamp * val);
                        textangle = getAngleFromValue(pointerValue, axis.visibleRange.max, axis.visibleRange.min, axis.startAngle, axis.endAngle, isClockWise);
                        textlocation = getLocationFromAngle(textangle, pointer.currentRadius, this.gauge.midPoint);
                        element.setAttribute(
                            'transform', 'rotate(' + (textangle + 90) + ',' + textlocation.x + ',' + textlocation.y + ')'
                        );
                        element.setAttribute('x', String(textlocation.x));
                        element.setAttribute('y', String(textlocation.y));
                        element.style.visibility = 'visible';
                    }
                }
            },
            end: () => {
                if (this.gauge.isAnimationProgress) {
                    this.setPointerValue(axis, pointer, end);
                    pointer.isPointerAnimation = false;
                }
                this.gauge.trigger(animationComplete, { axis: axis, pointer: pointer });
                if (!isNullOrUndefined(this.gauge.loadingAnimationDuration) && (this.gauge.loadingAnimationDuration[axisIndex as number] > 0 && !isNullOrUndefined(this.gauge.annotationsModule))) {
                    this.gauge.annotationsModule.annotationAnimation(this.gauge);
                } else {
                    this.gauge.isOverAllAnimationComplete = true;
                }
            }
        });
    }

    /**
     * Perform the needle and marker pointer animation for circular gauge.
     *
     * @param {HTMLElement} element - Specifies the element
     * @param {number} start - Specifies the start
     * @param {number} end - Specifies the end
     * @param {Axis} axis - Specifies the axis
     * @param {Pointer} pointer - Specifies the pointer.
     * @returns {void}
     * @private
     */
    public performNeedleAnimation(
        element: HTMLElement, start: number, end: number, axis: Axis, pointer: Pointer, axisIndex: number): void {
        const isClockWise: boolean = axis.direction === 'ClockWise';
        start = typeof(start) === 'string' ? parseInt(start, 10) : start;
        end = typeof(end) === 'string' ? parseInt(end, 10) : end;
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
            duration: this.gauge.isAnimationProgress ? (isNullOrUndefined(pointer.value) || pointer.value === axis.minimum ? 0 :
                (animationMode === 'Enable' && (((!pointer.animation.enable || pointer.animation.duration === 0)
                    && !this.gauge.allowLoadingAnimation) || (this.gauge.allowLoadingAnimation && (this.gauge.animationDuration === 0
                        && pointer.animation.enable && pointer.animation.duration === 0)))) ? 1000 :
                    (this.gauge.allowLoadingAnimation ? (pointer.animation.enable && pointer.animation.duration > 0 ? pointer.animation.duration
                        : this.gauge.loadingAnimationDuration[axisIndex as number]) : pointer.animation.duration)) : 0,
            progress: (args: AnimationOptions): void => {
                if (this.gauge.isAnimationProgress) {
                    sweepAngle = (start < end || Math.round(startAngle) === Math.round(endAngle)) ?
                        isClockWise ? (endAngle - startAngle) : (endAngle - startAngle - 360) :
                        isClockWise ? (endAngle - startAngle - 360) : (endAngle - startAngle);
                    element.style.animation = 'None';
                    if (start !== end) {
                        element.setAttribute(
                            'transform', 'rotate(' + linear(args.timeStamp, startAngle, sweepAngle, args.duration) + ',' +
                            this.gauge.midPoint.x.toString() + ',' + this.gauge.midPoint.y.toString() + ')'
                        );
                        element.style.visibility = 'visible';
                    }
                }
            },
            end: () => {
                if (this.gauge.isAnimationProgress) {
                    this.setPointerValue(axis, pointer, end);
                    if (this.gauge.animationDuration > 0) {
                        element.style.visibility = 'visible';
                    }
                    pointer.isPointerAnimation = false;
                }
                if (pointer.type === 'Marker' || (element.id.indexOf('_Pointer_NeedleCap') >= 0)) {
                    this.gauge.trigger(animationComplete, { axis: axis, pointer: pointer });
                }
                if (!isNullOrUndefined(this.gauge.loadingAnimationDuration) && this.gauge.loadingAnimationDuration[axisIndex as number] > 0 && !isNullOrUndefined(this.gauge.annotationsModule)) {
                    this.gauge.annotationsModule.annotationAnimation(this.gauge);
                } else {
                    this.gauge.isOverAllAnimationComplete = true;
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
     * @returns {void}
     * @private
     */
    public performRangeBarAnimation(element: HTMLElement, start: number, end: number, axis: Axis, pointer: Pointer, axisIndex: number): void {
        start = typeof(start) === 'string' ? parseInt(start, 10) : start;
        end = typeof(end) === 'string' ? parseInt(end, 10) : end;
        let pointerValue: number;
        let timeStamp: number;
        element.style.visibility = 'visible';
        const val: number = Math.abs(start - end);
        new Animation({}).animate(element, {
            duration: this.gauge.isAnimationProgress ? (isNullOrUndefined(pointer.value) || pointer.value === axis.minimum ? 0 :
                (animationMode === 'Enable' && (((!pointer.animation.enable || pointer.animation.duration === 0)
                    && !this.gauge.allowLoadingAnimation) || (this.gauge.allowLoadingAnimation && (this.gauge.animationDuration === 0
                        && pointer.animation.enable && pointer.animation.duration === 0)))) ? 1000 :
                    (this.gauge.allowLoadingAnimation ? (pointer.animation.enable && pointer.animation.duration > 0 ? pointer.animation.duration
                        : this.gauge.loadingAnimationDuration[axisIndex as number]) : pointer.animation.duration)) : 0,
            progress: (arg: AnimationOptions): void => {
                if (this.gauge.isAnimationProgress) {
                    arg.duration = !this.gauge.isAnimationProgress ? 0 : arg.duration;
                    timeStamp = (arg.timeStamp / arg.duration);
                    pointerValue = end > start ? start + (timeStamp * val) : start - (timeStamp * val);
                    this.setPointerValue(axis, pointer, pointerValue);
                }
            },
            end: () => {
                if (this.gauge.isAnimationProgress) {
                    this.setPointerValue(axis, pointer, end);
                    pointer.isPointerAnimation = false;
                }
                this.gauge.trigger(animationComplete, { axis: axis, pointer: pointer });
                if (!isNullOrUndefined(this.gauge.loadingAnimationDuration) && this.gauge.loadingAnimationDuration[axisIndex as number] > 0 && !isNullOrUndefined(this.gauge.annotationsModule)) {
                    this.gauge.annotationsModule.annotationAnimation(this.gauge);
                } else {
                    this.gauge.isOverAllAnimationComplete = true;
                }
            }
        });
    }

    /**
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        this.gauge = null;
    }
}
