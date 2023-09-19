import { Animation, AnimationOptions, isNullOrUndefined, animationMode } from '@syncfusion/ej2-base';
import { LinearGauge } from '../../linear-gauge';
import { Axis, Pointer } from './axis';
import { animationComplete } from '../model/constant';
import { Size, valueToCoefficient, PathOption } from '../utils/helper';
import { calculateShapes, getBox, VisibleRange } from '../utils/helper';

/**
 * To handle the animation for gauge
 *
 * @private
 */
export class Animations {

    public gauge: LinearGauge;
    constructor(gauge: LinearGauge) {
        this.gauge = gauge;
    }

    /**
     * To do the marker pointer animation.
     *
     * @param element - Specifies the element of the marker pointer to which animation must be propagated.
     * @param axis - Specifies the axis in which the marker pointer is available to which animation must be propagated.
     * @param pointer - Specifies the pointer to which the animation must be propagated.
     */

    public performMarkerAnimation(element: Element, axis: Axis, pointer: Pointer): void {
        const markerElement: HTMLElement = <HTMLElement>element;
        let options: PathOption; let timeStamp: number;
        const range: VisibleRange = axis.visibleRange;
        const rectHeight: number = (this.gauge.orientation === 'Vertical') ? axis.lineBounds.height : axis.lineBounds.width;
        const rectY: number = (this.gauge.orientation === 'Vertical') ? axis.lineBounds.y : axis.lineBounds.x;
        if (this.gauge.orientation === 'Vertical') {
            pointer.bounds.y = (valueToCoefficient(pointer.currentValue, axis, this.gauge.orientation, range) * rectHeight) + rectY;
        } else {
            pointer.bounds.x = (valueToCoefficient(pointer.currentValue, axis, this.gauge.orientation, range) * rectHeight) + rectY;
        }
        options = new PathOption(markerElement.id, null, null, null);
        options = calculateShapes(
            pointer.bounds, pointer.markerType, new Size(pointer.width, pointer.height),
            pointer.imageUrl, options, this.gauge.orientation, axis, pointer);
        let currentValue: number;
        let start: number = typeof(pointer.startValue) === 'string' ? parseInt(pointer.startValue, 10) : pointer.startValue;
        const end: number = pointer.currentValue;
        start = (start === end) ? range.min : start;
        const val: number = Math.abs(start - end);
        const currentPath: string = options.d;
        const cx: number = options['cx'];
        const cy: number = options['cy'];
        const x: number = options['x'];
        const y: number = options['y'];
        new Animation({}).animate(markerElement, {
            duration: (pointer.animationDuration === 0 && animationMode === 'Enable') ? 1000: pointer.animationDuration,
            progress: (args: AnimationOptions): void => {
                if (args.timeStamp >= args.delay) {
                    timeStamp = ((args.timeStamp - args.delay) / args.duration);
                    currentValue = (start < end) ? start + (timeStamp * val) : start - (timeStamp * val);
                    if (this.gauge.orientation === 'Vertical') {
                        pointer.bounds.y = (valueToCoefficient(currentValue, axis, this.gauge.orientation, range) *
                            rectHeight) + rectY;
                        options = calculateShapes(
                            pointer.bounds, pointer.markerType, new Size(pointer.width, pointer.height),
                            pointer.imageUrl, options, this.gauge.orientation, axis, pointer);
                        if (!isNullOrUndefined(options['r'])) {
                            markerElement.setAttribute('cy', options['cy'].toString());
                        }
                        else if (!isNullOrUndefined(options['y'])) {
                            markerElement.setAttribute('y', options['y'].toString());
                        }
                        else {
                            markerElement.setAttribute('d', options.d);
                        }
                    } else {
                        pointer.bounds.x = (valueToCoefficient(currentValue, axis, this.gauge.orientation, range) *
                            rectHeight) + rectY;
                        options = calculateShapes(
                            pointer.bounds, pointer.markerType, new Size(pointer.width, pointer.height),
                            pointer.imageUrl, options, this.gauge.orientation, axis, pointer);
                        if (!isNullOrUndefined(options['r'])) {
                            markerElement.setAttribute('cx', options['cx'].toString());
                        }
                        else if (!isNullOrUndefined(options['x'])) {
                            markerElement.setAttribute('x', options['x'].toString());
                        }
                        else {
                            markerElement.setAttribute('d', options.d);
                        }
                    }
                }
            },
            end: () => {
                if (!isNullOrUndefined(cy)) {
                    markerElement.setAttribute('cy', cy.toString());
                    markerElement.setAttribute('cx', cx.toString());
                }
                else if (!isNullOrUndefined(y)) {
                    markerElement.setAttribute('y', y.toString());
                    markerElement.setAttribute('x', x.toString());
                }
                else {
                    markerElement.setAttribute('d', currentPath);
                }
                pointer.isPointerAnimation = false;
                pointer.animationComplete = true;
                pointer.startValue = pointer.value = pointer.currentValue;
                this.gauge.trigger(animationComplete, { axis: axis, pointer: pointer });
            }
        });
    }

    /**
     * Perform the bar pointer animation
     *
     * @param element
     * @param axis
     * @param pointer
     */

    public performBarAnimation(element: Element, axis: Axis, pointer: Pointer): void {
        const radix: number = 10; let timeStamp: number; let value2: number; let value1: number;
        let currentValue: number;
        let clipHeight: string; let clipY: string; let clipX: string; let clipVal: number;
        let clipWidth: string; let currentHeight: number; let clipElement: HTMLElement;
        const range: VisibleRange = axis.visibleRange;
        const pointerElement: HTMLElement = <HTMLElement>element;
        const lineHeight: number = (this.gauge.orientation === 'Vertical') ? axis.lineBounds.height : axis.lineBounds.width;
        const lineY: number = (this.gauge.orientation === 'Vertical') ? axis.lineBounds.y : axis.lineBounds.x;
        let start: number = typeof(pointer.startValue) === 'string' ? parseInt(pointer.startValue, 10) : pointer.startValue;
        const end: number = pointer.currentValue;
        start = (start === end) ? range.min : start;
        let path: string = ''; let currentPath: string = '';
        const tagName: string = pointerElement.tagName;
        const val: number = Math.abs(start - end);
        const pointerValue: number = (valueToCoefficient(end, axis, this.gauge.orientation, range) * lineHeight) + lineY;
        const startPointerVal: number = (valueToCoefficient(range.min, axis, this.gauge.orientation, range) *
            lineHeight) + lineY;
        const rectY: number = (this.gauge.orientation === 'Vertical') ? !axis.isInversed ? pointerValue : startPointerVal :
            axis.isInversed ? pointerValue : startPointerVal;
        const rectHeight: number = Math.abs(startPointerVal - pointerValue);
        if (this.gauge.container.type === 'Thermometer' && start === 0  && this.gauge.container.width > 0) {
            clipElement = <HTMLElement>pointerElement.parentElement.childNodes[1].childNodes[0].childNodes[0];
            if (this.gauge.orientation === 'Vertical') {
                clipY = clipElement.getAttribute('y');
                clipHeight = clipElement.getAttribute('height');
                clipVal = parseInt(clipY, radix) + parseInt(clipHeight, radix);
                clipElement.setAttribute('y', clipVal.toString());
            } else {
                clipX = clipElement.getAttribute('x');
                clipWidth = clipElement.getAttribute('width');
                clipVal = parseInt(clipX, radix) + parseInt(clipWidth, radix);
                clipElement.setAttribute('width', '0');
            }
        }
        path = pointer.value === axis.minimum && this.gauge.container.type === 'RoundedRectangle' ? '' : getBox(
            pointer.bounds, this.gauge.container.type, this.gauge.orientation,
            new Size(pointer.bounds.width, pointer.bounds.height), 'bar', this.gauge.container.width, axis, pointer.roundedCornerRadius);
        new Animation({}).animate(pointerElement, {
            duration: (pointer.animationDuration === 0 && animationMode === 'Enable') ? 1000: pointer.animationDuration,
            progress: (animate: AnimationOptions): void => {
                if (animate.timeStamp >= animate.delay) {
                    timeStamp = ((animate.timeStamp - animate.delay) / animate.duration);
                    currentValue = (start < end) ? start + (timeStamp * val) : start - (timeStamp * val);
                    value2 = (valueToCoefficient(currentValue, axis, this.gauge.orientation, range) * lineHeight) + lineY;
                    value1 = (valueToCoefficient(range.min, axis, this.gauge.orientation, range) * lineHeight) + lineY;
                    currentHeight = Math.abs(value2 - value1);
                    if (this.gauge.orientation === 'Vertical') {
                        pointer.bounds.y = (!axis.isInversed) ? value2 : value1;
                        pointer.bounds.height = currentHeight;
                    } else {
                        pointer.bounds.x = (axis.isInversed) ? value2 : value1;
                        pointer.bounds.width = currentHeight;
                    }
                    if (tagName === 'path') {
                        if (start === 0 && this.gauge.container.type === 'Thermometer') {
                            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                            (this.gauge.orientation === 'Vertical') ?
                                clipElement.setAttribute('y', (clipVal - (timeStamp * parseInt(clipHeight, radix))).toString()) :
                                clipElement.setAttribute('width', (timeStamp * parseInt(clipWidth, radix)).toString());
                        }
                        currentPath = pointer.value === axis.minimum && this.gauge.container.type === 'RoundedRectangle' ? '' : getBox(
                            pointer.bounds, this.gauge.container.type, this.gauge.orientation,
                            new Size(pointer.bounds.width, pointer.bounds.height), 'bar',
                            this.gauge.container.width, axis, pointer.roundedCornerRadius);
                        pointerElement.setAttribute('d', currentPath);
                    } else {
                        if (this.gauge.orientation === 'Vertical') {
                            pointerElement.setAttribute('y', pointer.bounds.y.toString());
                            pointerElement.setAttribute('height', pointer.bounds.height.toString());
                        } else {
                            pointerElement.setAttribute('x', pointer.bounds.x.toString());
                            pointerElement.setAttribute('width', pointer.bounds.width.toString());
                        }
                    }
                }
            },
            end: () => {
                if (tagName === 'path') {
                    if (start === 0 && this.gauge.container.type === 'Thermometer') {
                        pointerElement.parentElement.children[1].remove();
                    } else {
                        pointerElement.setAttribute('d', path);
                    }
                } else {
                    if (this.gauge.orientation === 'Vertical') {
                        pointerElement.setAttribute('y', rectY.toString());
                        pointerElement.setAttribute('height', rectHeight.toString());
                    } else {
                        pointerElement.setAttribute('x', rectY.toString());
                        pointerElement.setAttribute('width', rectHeight.toString());
                    }
                }
                pointer.isPointerAnimation = false;
                pointer.startValue = pointer.value = pointer.currentValue;
                this.gauge.trigger(animationComplete, { axis: axis, pointer: pointer });
            }
        });
    }
}
