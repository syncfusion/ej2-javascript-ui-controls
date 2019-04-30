import { Animation, AnimationOptions } from '@syncfusion/ej2-base';
import { LinearGauge } from '../../linear-gauge';
import { Axis, Pointer } from './axis';
import { animationComplete } from '../model/constant';
import { Size, Rect, valueToCoefficient, PathOption } from '../utils/helper';
import { calculateShapes, getBox, VisibleRange } from '../utils/helper';

/**
 * @private
 * To handle the animation for gauge
 */
export class Animations {

    public gauge: LinearGauge;

    constructor(gauge: LinearGauge) {
        this.gauge = gauge;
    }

    /**
     * To do the marker pointer animation. 
     * @return {void}
     * @private
     */
    public performMarkerAnimation(element: Element, axis: Axis, pointer: Pointer): void {
        let markerElement: HTMLElement = <HTMLElement>element;
        let options: PathOption; let timeStamp: number;
        let range: VisibleRange = axis.visibleRange;
        let rectHeight: number = (this.gauge.orientation === 'Vertical') ? axis.lineBounds.height : axis.lineBounds.width;
        let rectY: number = (this.gauge.orientation === 'Vertical') ? axis.lineBounds.y : axis.lineBounds.x;
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
        let start: number = pointer.startValue;
        let end: number = pointer.currentValue;
        start = (start === end) ? range.min : start;
        let val: number = Math.abs(start - end);
        let currentPath: string = options.d;
        new Animation({}).animate(markerElement, {
            duration: pointer.animationDuration,
            progress: (args: AnimationOptions): void => {
                if (args.timeStamp >= args.delay) {
                    timeStamp = ((args.timeStamp - args.delay) / args.duration);
                    currentValue = (start < end) ? start + (timeStamp * val) : start - (timeStamp * val);
                    if (this.gauge.orientation === 'Vertical') {
                        pointer.bounds.y = (valueToCoefficient(currentValue, axis, this.gauge.orientation, range) *
                            rectHeight) + rectY;
                    } else {
                        pointer.bounds.x = (valueToCoefficient(currentValue, axis, this.gauge.orientation, range) *
                            rectHeight) + rectY;
                    }
                    options = calculateShapes(
                        pointer.bounds, pointer.markerType, new Size(pointer.width, pointer.height),
                        pointer.imageUrl, options, this.gauge.orientation, axis, pointer);
                    markerElement.setAttribute('d', options.d);
                }
            },
            end: (model: AnimationOptions) => {
                markerElement.setAttribute('d', currentPath);
                pointer.startValue = pointer.currentValue;
                pointer.animationComplete = true;
                this.gauge.trigger(animationComplete, { axis: axis, pointer: pointer });
            }
        });
    }

    /**
     * Perform the bar pointer animation
     * @param element 
     * @param axis 
     * @param pointer 
     */

    public performBarAnimation(element: Element, axis: Axis, pointer: Pointer): void {
        let val: number; let radix: number = 10; let timeStamp: number; let value2: number; let value1: number;
        let height: number; let currentValue: number;
        let clipHeight: string; let clipY: string; let clipX: string; let clipVal: number;
        let rectHeight: number; let rectY: number; let rectX: number; let rectWidth: number;
        let clipWidth: string; let currentHeight: number; let clipElement: HTMLElement;
        let range: VisibleRange = axis.visibleRange;
        let pointerElement: HTMLElement = <HTMLElement>element;
        let pathElement: Element; let svgPathElement: SVGPathElement; let clipRect: Rect;
        let lineHeight: number = (this.gauge.orientation === 'Vertical') ? axis.lineBounds.height : axis.lineBounds.width;
        let lineY: number = (this.gauge.orientation === 'Vertical') ? axis.lineBounds.y : axis.lineBounds.x;
        let size: Size = new Size(this.gauge.availableSize.width, this.gauge.availableSize.height);
        let start: number = pointer.startValue; let end: number = pointer.currentValue;
        start = (start === end) ? range.min : start;
        let path: string = ''; let currentPath: string = '';
        let tagName: string = pointerElement.tagName;
        val = Math.abs(start - end);
        let pointerValue: number = (valueToCoefficient(end, axis, this.gauge.orientation, range) * lineHeight) + lineY;
        let startPointerVal: number = (valueToCoefficient(range.min, axis, this.gauge.orientation, range) *
            lineHeight) + lineY;
        rectY = (this.gauge.orientation === 'Vertical') ? !axis.isInversed ? pointerValue : startPointerVal :
            axis.isInversed ? pointerValue : startPointerVal;
        rectHeight = Math.abs(startPointerVal - pointerValue);
        if (this.gauge.container.type === 'Thermometer' && start === 0) {
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
        path = getBox(
            pointer.bounds, this.gauge.container.type, this.gauge.orientation,
            new Size(pointer.bounds.width, pointer.bounds.height), 'bar', this.gauge.container.width, axis, pointer.roundedCornerRadius);
        new Animation({}).animate(pointerElement, {
            duration: pointer.animationDuration,
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
                            (this.gauge.orientation === 'Vertical') ?
                                clipElement.setAttribute('y', (clipVal - (timeStamp * parseInt(clipHeight, radix))).toString()) :
                                clipElement.setAttribute('width', (timeStamp * parseInt(clipWidth, radix)).toString());
                        }
                        currentPath = getBox(
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
            end: (model: AnimationOptions) => {
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
                pointer.startValue = pointer.currentValue;
                this.gauge.trigger(animationComplete, { axis: axis, pointer: pointer });
            }
        });
    }
}