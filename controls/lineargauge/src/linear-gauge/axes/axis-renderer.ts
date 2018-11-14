import { isNullOrUndefined, remove } from '@syncfusion/ej2-base';
import { LinearGauge } from '../../linear-gauge';
import { Axis, Tick, Pointer, Range } from './axis';
import { animationComplete } from '../model/constant';
import { AxisModel } from './axis-model';
import { Animations } from './animation';
import { Size, Rect, valueToCoefficient, PathOption, textElement, getElement } from '../utils/helper';
import { TextOption, RectOption, calculateShapes, getBox, getPathToRect, getRangeColor, VisibleRange } from '../utils/helper';

/**
 * @private
 * To render the axis elements
 */

export class AxisRenderer extends Animations {
    private htmlObject: Element;
    private axisObject: Element;
    private axisElements: Element[];
    constructor(gauge: LinearGauge) {
        super(gauge);
    }
    public renderAxes(): void {
        let axis: Axis;
        let major: Tick; let minor: Tick;
        this.axisElements = [];
        let gaugeAxesG: HTMLElement = this.gauge.svgObject.querySelector('#' + this.gauge.element.id + '_Axis_Collections');
        if (gaugeAxesG) {
            remove(gaugeAxesG);
        }
        this.axisObject = this.gauge.renderer.createGroup({
            id: this.gauge.element.id + '_Axis_Collections',
            transform: 'translate( 0, 0 )'
        });
        for (let i: number = 0; i < this.gauge.axes.length; i++) {
            axis = <Axis>this.gauge.axes[i];
            major = <Tick>axis.majorTicks;
            minor = <Tick>axis.minorTicks;
            this.htmlObject = this.gauge.renderer.createGroup({ id: this.gauge.element.id + '_Axis_Group_' + i });
            this.drawAxisLine(axis, this.htmlObject, i);
            this.drawRanges(axis, this.htmlObject, i);
            this.drawTicks(axis, major, this.htmlObject, 'MajorTicks', axis.majorTickBounds);
            this.drawTicks(axis, minor, this.htmlObject, 'MinorTicks', axis.minorTickBounds);
            this.drawAxisLabels(axis, this.htmlObject);
            this.drawPointers(axis, this.htmlObject, i);
            this.axisElements.push(this.htmlObject);
        }
        this.axisElements.forEach((axisElement: Element) => {
            this.axisObject.appendChild(axisElement);
        });
        this.gauge.svgObject.appendChild(this.axisObject);
        if (this.gauge.nearSizes.length !== this.gauge.farSizes.length && this.gauge.axes.length > 1) {
            this.axisAlign(this.gauge.axes);
        }
    }

    public axisAlign(axes: AxisModel[]): void {
        let nearAxisWidth: number = 0; let farAxisWidth: number = 0;
        let axis: Axis;
        let tranX: number; let transY: number;
        if (this.gauge.orientation === 'Vertical') {
            axes.forEach((axis: Axis, axisIndex: number) => {
                if (!axis.opposedPosition) {
                    nearAxisWidth += axis.bounds.width;
                } else {
                    farAxisWidth += axis.bounds.width;
                }
            });
            nearAxisWidth += this.gauge.containerBounds.width / 2;
            farAxisWidth += this.gauge.containerBounds.width / 2;
            tranX = (nearAxisWidth / 2) - (farAxisWidth / 2);
            this.axisObject.setAttribute('transform', 'translate(' + tranX + ',0)');
            if (!(isNullOrUndefined(this.gauge.containerObject))) {
                this.gauge.containerObject.setAttribute('transform', 'translate(' + tranX + ',0)');
            }
        } else {
            axes.forEach((axis: Axis, axisIndex: number) => {
                if (!axis.opposedPosition) {
                    nearAxisWidth += axis.bounds.height;
                } else {
                    farAxisWidth += axis.bounds.height;
                }
            });
            nearAxisWidth += (this.gauge.containerBounds.height / 2);
            farAxisWidth += (this.gauge.containerBounds.height / 2);
            transY = (nearAxisWidth / 2) - (farAxisWidth / 2);
            this.axisObject.setAttribute('transform', 'translate(0,' + transY + ')');
            if (!(isNullOrUndefined(this.gauge.containerObject))) {
                this.gauge.containerObject.setAttribute('transform', 'translate(0,' + transY + ')');
            }
        }
    }

    public drawAxisLine(axis: Axis, axisObject: Element, axisIndex: number): void {
        let options: PathOption;
        let rect: Rect = axis.lineBounds;
        let path: string = '';
        if (axis.line.width > 0) {
            path = 'M' + rect.x + ' ' + rect.y + ' L ' + (this.gauge.orientation === 'Vertical' ? rect.x : rect.x + rect.width) +
                ' ' + (this.gauge.orientation === 'Vertical' ? rect.y + rect.height : rect.y) + 'z';
            options = new PathOption(
                this.gauge.element.id + '_AxisLine_' + axisIndex, axis.line.color,
                axis.line.width, axis.line.color, 1, axis.line.dashArray, path);
            axisObject.appendChild(this.gauge.renderer.drawPath(options) as HTMLElement);
        }
    }

    public drawTicks(axis: Axis, ticks: Tick, axisObject: Element, tickID: string, tickBounds: Rect): void {
        let tickPath: string = '';
        let pointY: number; let pointX: number;
        let options: PathOption;
        let range: VisibleRange = axis.visibleRange;
        let line: Rect = axis.lineBounds;
        let interval: number = ((tickID === 'MajorTicks') ? axis.majorInterval : axis.minorInterval);
        for (let i: number = range.min; (i <= range.max && interval > 0); i += interval) {
            if ((tickID === 'MajorTicks') || (tickID === 'MinorTicks' && i !== range.min && i !== range.max
                && (i % axis.majorInterval) !== 0)) {
                if (this.gauge.orientation === 'Vertical') {
                    pointX = tickBounds.x;
                    pointY = (valueToCoefficient(i, axis, this.gauge.orientation, range) * line.height) + line.y;
                    tickPath = tickPath.concat('M' + pointX + ' ' + pointY + ' ' + 'L' + (pointX + ticks.height) + ' ' + pointY + ' ');
                } else {
                    pointX = (valueToCoefficient(i, axis, this.gauge.orientation, range) * line.width) + line.x;
                    pointY = tickBounds.y;
                    tickPath = tickPath.concat('M' + pointX + ' ' + pointY + ' ' + 'L' + pointX + ' ' + (pointY + ticks.height) + ' ');
                }
            }
        }
        options = new PathOption(
            this.gauge.element.id + '_' + tickID + 'Line_' + 0, ticks.color, ticks.width,
            ticks.color, 1, null, tickPath);
        axisObject.appendChild(this.gauge.renderer.drawPath(options) as SVGElement);
    }

    public drawAxisLabels(axis: Axis, axisObject: Element): void {
        let options: TextOption;
        let pointX: number; let pointY: number;
        let rect: Rect = axis.lineBounds;
        let bounds: Rect = axis.labelBounds;
        let tick: Rect = axis.majorTickBounds;
        let labelSize: Size;
        let range: VisibleRange = axis.visibleRange;
        let anchor: string; let baseline: string;
        let padding: number = 5;
        let labelColor: string;
        let offset: number = axis.labelStyle.offset;
        let labelElement: Element = this.gauge.renderer.createGroup({ id: this.gauge.element.id + '_AxisLabelsGroup' });
        for (let i: number = 0; i < axis.visibleLabels.length; i++) {
            labelSize = axis.visibleLabels[i].size;
            labelColor = axis.labelStyle.useRangeColor ? getRangeColor(axis.visibleLabels[i].value, <Range[]>axis.ranges) :
                null;
            labelColor = isNullOrUndefined(labelColor) ? axis.labelStyle.font.color : labelColor;
            if (this.gauge.orientation === 'Vertical') {
                pointY = (valueToCoefficient(axis.visibleLabels[i].value, axis, this.gauge.orientation, range) *
                    rect.height) + rect.y;
                pointX = (!axis.opposedPosition ? (tick.x - labelSize.width - padding) + offset : bounds.x);
                pointY += (labelSize.height / 4);
            } else {
                pointX = (valueToCoefficient(axis.visibleLabels[i].value, axis, this.gauge.orientation, range) *
                    rect.width) + rect.x;
                pointY = bounds.y;
                anchor = 'middle';
                baseline = '';
            }
            options = new TextOption(
                this.gauge.element.id + '_AxisLabel_' + i, pointX, pointY, anchor, axis.visibleLabels[i].text, null, baseline);
            textElement(options, axis.labelStyle.font, labelColor, labelElement);
        }
        axisObject.appendChild(labelElement);
    }

    public drawPointers(axis: Axis, axisObject: Element, axisIndex: number): void {
        let pointer: Pointer;
        let clipId: string;
        let pointesGroup: Element;
        let pointerClipRectGroup: Element;
        pointesGroup = this.gauge.renderer.createGroup({ id: this.gauge.element.id + '_PointersGroup' });
        for (let i: number = 0; i < axis.pointers.length; i++) {
            pointer = <Pointer>axis.pointers[i];
            clipId = 'url(#' + this.gauge.element.id + '_AxisIndex_' + axisIndex + '_' + '_' + pointer.type + 'ClipRect_' + i + ')';
            if (!(isNullOrUndefined(pointer.bounds))) {
                pointerClipRectGroup = this.gauge.renderer.createGroup({
                    'id': this.gauge.element.id + '_AxisIndex_' + axisIndex + '_' + pointer.type + 'Pointer_' + i,
                    'clip-path': clipId
                });
                if (isNullOrUndefined(pointer.startValue)) {
                    pointer.startValue = axis.visibleRange.min;
                }
                this['draw' + pointer.type + 'Pointer'](axis, axisIndex, pointer, i, pointerClipRectGroup);
                pointesGroup.appendChild(pointerClipRectGroup);
            }
        }
        axisObject.appendChild(pointesGroup);
    }

    public drawMarkerPointer(
        axis: Axis, axisIndex: number, pointer: Pointer,
        pointerIndex: number, parentElement: Element): void {
        let options: PathOption;
        let pointerID: string = this.gauge.element.id + '_AxisIndex_' + axisIndex + '_' + pointer.type + 'Pointer' + '_' + pointerIndex;
        let transform: string = 'translate( 0, 0 )';
        let pointerElement: Element;
        if (getElement(pointerID) && getElement(pointerID).childElementCount > 0) {
            remove(getElement(pointerID));
        }
        options = new PathOption(
            pointerID, pointer.color,
            pointer.border.width, pointer.border.color, pointer.opacity, null, null, transform);
        options = calculateShapes(
            pointer.bounds, pointer.markerType, new Size(pointer.width, pointer.height),
            pointer.imageUrl, options, this.gauge.orientation, axis, pointer);
        pointerElement = ((pointer.markerType === 'Circle' ? this.gauge.renderer.drawCircle(options) as SVGAElement
            : (pointer.markerType === 'Image') ? this.gauge.renderer.drawImage(options) :
                this.gauge.renderer.drawPath(options) as SVGAElement));
        parentElement.appendChild(pointerElement);
        if (pointer.animationDuration > 0 && !this.gauge.gaugeResized) {
            pointer.animationComplete = false;
            this.performMarkerAnimation(pointerElement, axis, pointer);
        }
        pointerElement.setAttribute('aria-label', pointer.description || 'Pointer:' + Number(pointer.currentValue).toString());
    }

    public drawBarPointer(axis: Axis, axisIndex: number, pointer: Pointer, pointerIndex: number, parentElement: Element): void {
        let rectOptions: RectOption;
        let clipRectElement: Element;
        let pointerElement: Element;
        let path: string = '';
        let options: PathOption;
        let box: Rect; let radius: number;
        let bottomRadius: number; let topRadius: number;
        let size: Size = new Size(this.gauge.availableSize.width, this.gauge.availableSize.height);
        let pointerID: string = this.gauge.element.id + '_AxisIndex_' + axisIndex + '_' + pointer.type + 'Pointer' + '_' + pointerIndex;
        if (getElement(pointerID) && getElement(pointerID).childElementCount > 0) {
            remove(getElement(pointerID));
        }
        if (this.gauge.container.type === 'Normal') {
            rectOptions = new RectOption(
                pointerID, pointer.color, pointer.border, pointer.opacity, pointer.bounds, null, null);
            box = pointer.bounds;
            pointerElement = this.gauge.renderer.drawRectangle(rectOptions) as SVGAElement;
        } else {
            path = getBox(
                pointer.bounds, this.gauge.container.type, this.gauge.orientation,
                new Size(pointer.bounds.width, pointer.bounds.height), 'bar',
                this.gauge.container.width, axis, pointer.roundedCornerRadius);
            options = new PathOption(
                pointerID, pointer.color, pointer.border.width, pointer.border.color, pointer.opacity, null, path);
            pointerElement = this.gauge.renderer.drawPath(options) as SVGAElement;
            box = getPathToRect(<SVGPathElement>pointerElement.cloneNode(true), size, this.gauge.element);
        }
        if (getElement(pointerID) && getElement(pointerID).childElementCount > 0) {
            let element: Element = getElement(pointerID).firstElementChild;
            if (this.gauge.container.type === 'Normal') {
                element.setAttribute('x', rectOptions.x + '');
                element.setAttribute('y', rectOptions.y + '');
                element.setAttribute('width', rectOptions.width + '');
                element.setAttribute('height', rectOptions.height + '');
            } else {
                element.setAttribute('d', options.d);
            }
        } else {
            parentElement.appendChild(pointerElement);
        }
        pointerElement.setAttribute('aria-label', pointer.description || 'Pointer:' + Number(pointer.currentValue).toString());
        if (pointer.animationDuration > 0 && !this.gauge.gaugeResized) {
            if (this.gauge.container.type === 'Thermometer' && pointer.startValue === 0) {
                clipRectElement = this.gauge.renderer.drawClipPath(
                    new RectOption(
                        this.gauge.element.id + '_AxisIndex_' + axisIndex + '_' + '_' + pointer.type + 'ClipRect_' + pointerIndex,
                        'transparent', { width: 1, color: 'Gray' }, 1, box));
                parentElement.appendChild(clipRectElement);
            }
            this.performBarAnimation(pointerElement, axis, pointer);
        }
    }


    public drawRanges(axis: Axis, axisObject: Element, axisIndex: number): void {
        let range: Range;
        let options: PathOption;
        let rangeElement: Element = this.gauge.renderer.createGroup({ id: this.gauge.element.id + '_RangesGroup' });
        for (let j: number = 0; j < axis.ranges.length; j++) {
            range = <Range>axis.ranges[j];
            if (!(isNullOrUndefined(range.path))) {
                options = new PathOption(
                    this.gauge.element.id + '_AxisIndex_' + axisIndex + '_Range_' + j, range.interior, range.border.width,
                    range.border.color, 1, null, range.path);
                rangeElement.appendChild(this.gauge.renderer.drawPath(options) as SVGAElement);
            }
        }
        axisObject.appendChild(rangeElement);
    }
}





