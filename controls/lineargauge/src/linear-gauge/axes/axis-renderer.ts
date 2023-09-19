import { isNullOrUndefined, remove, animationMode } from '@syncfusion/ej2-base';
import { LinearGauge } from '../../linear-gauge';
import { Axis, Tick, Pointer, Range } from './axis';
import { AxisModel } from './axis-model';
import { Animations } from './animation';
import { Size, Rect, valueToCoefficient, PathOption, textElement,
    getElement, textTrim} from '../utils/helper';
import { TextOption, RectOption, calculateShapes, getBox, getPathToRect, getRangeColor, VisibleRange } from '../utils/helper';
import { MarkerType } from '../utils/enum';
import { FontModel } from '../model/base-model';

/**
 * To render the axis elements.
 *
 * @private
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
        const gaugeAxesG: HTMLElement = this.gauge.svgObject.querySelector('#' + this.gauge.element.id + '_Axis_Collections');
        if (gaugeAxesG) {
            remove(gaugeAxesG);
        }
        this.axisObject = this.gauge.renderer.createGroup({
            id: this.gauge.element.id + '_Axis_Collections',
            transform: 'translate( 0, 0 )'
        });
        for (let i: number = 0; i < this.gauge.axes.length; i++) {
            axis = <Axis>this.gauge.axes[i as number];
            major = <Tick>axis.majorTicks;
            minor = <Tick>axis.minorTicks;
            this.htmlObject = this.gauge.renderer.createGroup({ id: this.gauge.element.id + '_Axis_Group_' + i });
            this.drawAxisLine(axis, this.htmlObject, i);
            this.drawRanges(axis, this.htmlObject, i);
            this.drawTicks(axis, major, this.htmlObject, 'MajorTicks', axis.majorTickBounds, i);
            this.drawTicks(axis, minor, this.htmlObject, 'MinorTicks', axis.minorTickBounds, i);
            this.drawAxisLabels(axis, this.htmlObject, i);
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
        let tranX: number; let transY: number;
        if (this.gauge.orientation === 'Vertical') {
            axes.forEach((axis: Axis) => {
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
            axes.forEach((axis: Axis) => {
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
        const rect: Rect = axis.lineBounds;
        let path: string = '';
        const color: string = axis.line.color || this.gauge.themeStyle.lineColor;
        if (axis.line.width > 0) {
            path = 'M' + rect.x + ' ' + rect.y + ' L ' + (this.gauge.orientation === 'Vertical' ? rect.x : rect.x + rect.width) +
                ' ' + (this.gauge.orientation === 'Vertical' ? rect.y + rect.height : rect.y) + 'z';
            options = new PathOption(
                this.gauge.element.id + '_AxisLine_' + axisIndex, color,
                axis.line.width, color, 1, axis.line.dashArray, path);
            axisObject.appendChild(this.gauge.renderer.drawPath(options) as HTMLElement);
        }
    }

    public drawTicks(axis: Axis, ticks: Tick, axisObject: Element, tickID: string, tickBounds: Rect, axisIndex: number): void {
        let tickPath: string = '';
        let pointY: number; let pointX: number;
        const range: VisibleRange = axis.visibleRange;
        const line: Rect = axis.lineBounds;
        const majorTickColor: string = axis.majorTicks.color || this.gauge.themeStyle.majorTickColor;
        const minorTickColor: string = axis.minorTicks.color || this.gauge.themeStyle.minorTickColor;
        const tickColor: string = (tickID === 'MajorTicks') ? majorTickColor : minorTickColor;
        const interval: number = ((tickID === 'MajorTicks') ? axis.majorInterval : axis.minorInterval);
        const tickHeight: number = (axis.minimum !== axis.maximum) ? ticks.height : 0;
        // let position: string = (tickID === 'MajorTicks') ? axis.majorTicks.position : axis.minorTicks.position;
        for (let i: number = range.min; (i <= range.max && interval > 0); i += interval) {
            if ((tickID === 'MajorTicks') || (tickID === 'MinorTicks')) {
                if (this.gauge.orientation === 'Vertical') {
                    // pointX =  position === "Inside" ? tickBounds.x : tickBounds.x + ticks.height;
                    pointX = tickBounds.x;
                    pointY = (valueToCoefficient(i, axis, this.gauge.orientation, range) * line.height) + line.y;
                    tickPath = tickPath.concat('M' + pointX + ' ' + pointY + ' ' + 'L' + (pointX + tickHeight) + ' ' + pointY + ' ');
                } else {
                    pointX = (valueToCoefficient(i, axis, this.gauge.orientation, range) * line.width) + line.x;
                    // pointY = position === "Inside" ? tickBounds.y : (tickBounds.y + ticks.height);
                    pointY = tickBounds.y;
                    tickPath = tickPath.concat('M' + pointX + ' ' + pointY + ' ' + 'L' + pointX + ' ' + (pointY + tickHeight) + ' ');
                }
            }
        }
        const options: PathOption = new PathOption(
            this.gauge.element.id + '_' + tickID + 'Line_' + axisIndex, tickColor, ticks.width,
            tickColor, 1, null, tickPath);
        axisObject.appendChild(this.gauge.renderer.drawPath(options) as SVGElement);
    }

    public drawAxisLabels(axis: Axis, axisObject: Element, axisIndex: number): void {
        /* eslint-disable max-len */
        let options: TextOption; let pointX: number; let pointY: number;
        const rect: Rect = axis.lineBounds;
        const bounds: Rect = axis.labelBounds;
        const tick: Rect = axis.majorTickBounds;
        let labelSize: Size; const range: VisibleRange = axis.visibleRange;
        let anchor: string; let baseline: string; const padding: number = 5;
        const fontColor: string = this.gauge.themeStyle.labelColor;
        let labelColor: string; const offset: number = axis.labelStyle.offset;
        const labelLength: number = axis.visibleLabels.length - 1;
        const labelElement: Element = this.gauge.renderer.createGroup({ id: this.gauge.element.id + '_AxisLabelsGroup_' + axisIndex });
        for (let i: number = 0; i < axis.visibleLabels.length; i++) {
            labelSize = axis.visibleLabels[i as number].size;
            labelColor = axis.labelStyle.useRangeColor ? getRangeColor(axis.visibleLabels[i as number].value, <Range[]>axis.ranges) : null;
            labelColor = isNullOrUndefined(labelColor) ? (axis.labelStyle.font.color || fontColor) : labelColor;
            if (this.gauge.orientation === 'Vertical') {
                pointY = (valueToCoefficient(axis.visibleLabels[i as number].value, axis, this.gauge.orientation, range) * rect.height) + rect.y;
                pointX = axis.labelStyle.position === 'Auto' ? (!axis.opposedPosition ? (tick.x - labelSize.width - padding) + offset : bounds.x) : bounds.x;
                pointY += (labelSize.height / 4);
                axis.visibleLabels[i as number].x = pointX;
                axis.visibleLabels[i as number].y = pointY;
            } else {
                if ((i === 0 || i === labelLength) && this.gauge.edgeLabelPlacement !== 'None') {
                    if (this.gauge.edgeLabelPlacement === 'Shift') {
                        pointX = i === 0 ? (valueToCoefficient(axis.visibleLabels[i as number].value, axis, this.gauge.orientation, range) * rect.width) + rect.x + (!axis.isInversed ? (axis.visibleLabels[i as number].size.width / 2) : (-axis.visibleLabels[i as number].size.width / 2))
                            : (valueToCoefficient(axis.visibleLabels[i as number].value, axis, this.gauge.orientation, range) * rect.width) + rect.x - (!axis.isInversed ? (axis.visibleLabels[i as number].size.width / 2) : (-axis.visibleLabels[i as number].size.width / 2));
                        if (this.gauge.allowMargin) {
                            if (i === labelLength) {
                                if (!axis.isInversed && (pointX - (axis.visibleLabels[i as number].size.width / 2)) < (axis.visibleLabels[i - 1].x + (axis.visibleLabels[i - 1].size.width / 2))) {
                                    pointX += (axis.visibleLabels[i as number].size.width / 2);
                                } else if (axis.isInversed && (pointX + (axis.visibleLabels[i as number].size.width / 2)) > (axis.visibleLabels[i - 1].x - (axis.visibleLabels[i - 1].size.width / 2))) {
                                    pointX -= (axis.visibleLabels[i as number].size.width / 2);
                                }
                            }
                        }
                    } else if (this.gauge.edgeLabelPlacement === 'Trim') {
                        pointX = (valueToCoefficient(axis.visibleLabels[i as number].value, axis, this.gauge.orientation, range) * rect.width) + rect.x;
                        if (i === labelLength) {
                            if (!this.gauge.allowMargin) {
                                if (!axis.isInversed && this.gauge.margin.right <= 10) {
                                    const maxWidth: number = axis.visibleLabels[i as number].size.width * 0.75;
                                    axis.visibleLabels[i as number].text = textTrim(maxWidth, axis.visibleLabels[i as number].text, axis.labelStyle.font);
                                } else if (axis.isInversed && (pointX + (axis.visibleLabels[i as number].size.width / 2)) > (axis.visibleLabels[i - 1].x - (axis.visibleLabels[i - 1].size.width / 2))) {
                                    const maxWidth: number = axis.visibleLabels[i as number].size.width - ((pointX + (axis.visibleLabels[i as number].size.width / 2)) - (axis.visibleLabels[i - 1].x - (axis.visibleLabels[i - 1].size.width / 2)) + 2);
                                    axis.visibleLabels[i as number].text = textTrim(maxWidth, axis.visibleLabels[i as number].text, axis.labelStyle.font);
                                }
                            } else {
                                if (axis.isInversed && (pointX + (axis.visibleLabels[i as number].size.width / 2)) > (axis.visibleLabels[i - 1].x - (axis.visibleLabels[i - 1].size.width / 2))) {
                                    const width: number = axis.visibleLabels[i as number].size.width - ((pointX + (axis.visibleLabels[i as number].size.width / 2)) - (axis.visibleLabels[i - 1].x - (axis.visibleLabels[i - 1].size.width / 2)) + 2);
                                    axis.visibleLabels[i as number].text = textTrim(width, axis.visibleLabels[i as number].text, axis.labelStyle.font);
                                } else if (!axis.isInversed && (pointX - (axis.visibleLabels[i as number].size.width / 2)) < (axis.visibleLabels[i - 1].x + (axis.visibleLabels[i - 1].size.width / 2))) {
                                    const width: number = axis.visibleLabels[i as number].size.width - ((axis.visibleLabels[i - 1].x + (axis.visibleLabels[i - 1].size.width / 2)) - (pointX - (axis.visibleLabels[i as number].size.width / 2)) + 2);
                                    axis.visibleLabels[i as number].text = textTrim(width, axis.visibleLabels[i as number].text, axis.labelStyle.font);
                                }
                            }
                        }
                    } else if (this.gauge.edgeLabelPlacement === 'Auto') {
                        if (!this.gauge.allowMargin) {
                            pointX = i === labelLength ? (valueToCoefficient(axis.visibleLabels[i as number].value, axis, this.gauge.orientation, range) * rect.width) + rect.x - (!axis.isInversed ? (axis.visibleLabels[i as number].size.width / 2) : (-axis.visibleLabels[i as number].size.width / 2)) :
                                (valueToCoefficient(axis.visibleLabels[i as number].value, axis, this.gauge.orientation, range) * rect.width) + rect.x + (!axis.isInversed ? (axis.visibleLabels[i as number].size.width / 2) : (-axis.visibleLabels[i as number].size.width / 2));
                            if (i === labelLength) {
                                if (!axis.isInversed && (pointX - (axis.visibleLabels[i as number].size.width / 2)) < (axis.visibleLabels[i - 1].x + (axis.visibleLabels[i - 1].size.width / 2))) {
                                    pointX += (axis.visibleLabels[i as number].size.width / 2);
                                    const maxWidth: number = axis.visibleLabels[i as number].size.width * 0.75;
                                    axis.visibleLabels[i as number].text = textTrim(maxWidth, axis.visibleLabels[i as number].text, axis.labelStyle.font);
                                } else if (axis.isInversed && (pointX + (axis.visibleLabels[i as number].size.width / 2)) > (axis.visibleLabels[i - 1].x - (axis.visibleLabels[i - 1].size.width / 2))) {
                                    pointX -= (axis.visibleLabels[i as number].size.width / 2);
                                    const widthValue: number = axis.visibleLabels[i as number].size.width - ((pointX + (axis.visibleLabels[i as number].size.width / 2)) - (axis.visibleLabels[i - 1].x - (axis.visibleLabels[i - 1].size.width / 2)) + 2);
                                    axis.visibleLabels[i as number].text = textTrim(widthValue, axis.visibleLabels[i as number].text, axis.labelStyle.font);
                                }
                            }
                        } else {
                            pointX = (valueToCoefficient(axis.visibleLabels[i as number].value, axis, this.gauge.orientation, range) * rect.width) + rect.x;
                            if (i === labelLength && axis.isInversed && (pointX + (axis.visibleLabels[i as number].size.width / 2)) > (axis.visibleLabels[i - 1].x - (axis.visibleLabels[i - 1].size.width / 2))) {
                                const labelWidth: number = axis.visibleLabels[i as number].size.width - ((pointX + (axis.visibleLabels[i as number].size.width / 2)) - (axis.visibleLabels[i - 1].x - (axis.visibleLabels[i - 1].size.width / 2)) + 2);
                                axis.visibleLabels[i as number].text = textTrim(labelWidth, axis.visibleLabels[i as number].text, axis.labelStyle.font);
                            }
                        }
                    }
                    pointY = bounds.y;
                    axis.visibleLabels[i as number].x = pointX;
                    axis.visibleLabels[i as number].y = pointY;
                    anchor = 'middle';
                    baseline = '';
                } else {
                    pointX = (valueToCoefficient(axis.visibleLabels[i as number].value, axis, this.gauge.orientation, range) * rect.width) + rect.x;
                    pointY = bounds.y;
                    anchor = 'middle';
                    baseline = '';
                    axis.visibleLabels[i as number].x = pointX;
                    axis.visibleLabels[i as number].y = pointY;
                }
            }
            const style: FontModel = {
                size: axis.labelStyle.font.size,
                color: axis.labelStyle.font.color,
                fontFamily: axis.labelStyle.font.fontFamily,
                fontWeight: axis.labelStyle.font.fontWeight,
                fontStyle: axis.labelStyle.font.fontStyle,
                opacity: axis.labelStyle.font.opacity
            };
            style.fontFamily = style.fontFamily || this.gauge.themeStyle.labelFontFamily;
            style.fontStyle = style.fontStyle || this.gauge.themeStyle.labelStyle;
            style.fontWeight = style.fontWeight || this.gauge.themeStyle.labelWeight;
            options = new TextOption(this.gauge.element.id + '_Axis_' + axisIndex + '_Label_' + i, pointX, pointY, anchor, axis.visibleLabels[i as number].text, null, baseline);
            textElement(options, style, labelColor, labelElement);
        }
        axisObject.appendChild(labelElement);
    }

    public drawPointers(axis: Axis, axisObject: Element, axisIndex: number): void {
        let pointer: Pointer;
        let clipId: string;
        let pointerClipRectGroup: Element;
        const pointesGroup: Element = this.gauge.renderer.createGroup({ id: this.gauge.element.id + '_PointersGroup_' + axisIndex });
        for (let i: number = 0; i < axis.pointers.length; i++) {
            pointer = <Pointer>axis.pointers[i as number];
            clipId = 'url(#' + this.gauge.element.id + '_AxisIndex_' + axisIndex + '_' + '_' + pointer.type + 'ClipRect_' + i + ')';
            if (!(isNullOrUndefined(pointer.bounds))) {
                pointerClipRectGroup = this.gauge.renderer.createGroup({
                    'id': this.gauge.element.id + '_AxisIndex_' + axisIndex + '_' + pointer.type + 'PointerGroup_' + i
                });
                if (isNullOrUndefined(pointer.startValue)) {
                    pointer.startValue = axis.visibleRange.min;
                }
                if ((animationMode === 'Enable' || pointer.animationDuration > 0) && (!this.gauge.isPropertyChange || pointer['isPointerAnimation']) && !this.gauge.gaugeResized) {
                    pointer.startValue = !this.gauge.isPropertyChange ? axis.minimum : pointer.startValue;
                    if (this.gauge.container.type === 'Thermometer' && pointer.startValue === 0) {
                        pointerClipRectGroup.setAttribute('clip-path', clipId);
                    }
                }
                this['draw' + pointer.type + 'Pointer'](axis, axisIndex, pointer, i, pointerClipRectGroup);
                pointesGroup.appendChild(pointerClipRectGroup);
            }
        }
        this.gauge.gradientCount = 0;
        axisObject.appendChild(pointesGroup);
    }

    public drawMarkerPointer(
        axis: Axis, axisIndex: number, pointer: Pointer,
        pointerIndex: number, parentElement: Element): void {
        let options: PathOption;
        const pointerID: string = this.gauge.element.id + '_AxisIndex_' + axisIndex + '_' + pointer.type + 'Pointer' + '_' + pointerIndex;
        const transform: string = 'translate( 0, 0 )';
        let pointerElement: Element;
        let gradientMarkerColor: string;
        if (this.gauge.gradientModule) {
            gradientMarkerColor = this.gauge.gradientModule.getGradientColorString(pointer);
        }
        if (getElement(pointerID) && getElement(pointerID).childElementCount > 0) {
            remove(getElement(pointerID));
        }
        const pointerColor: string = pointer.color || this.gauge.themeStyle.pointerColor;
        let shapeBasedOnPosition: MarkerType = pointer.markerType;
        if (!isNullOrUndefined(pointer.position) && (pointer.markerType === 'InvertedTriangle' ||
            pointer.markerType === 'Triangle')) {
            shapeBasedOnPosition = (((pointer.position === 'Outside' && !axis.opposedPosition) ||
                (pointer.position === 'Inside' && axis.opposedPosition) || pointer.position === 'Cross')
                && pointer.markerType === 'Triangle' ? 'InvertedTriangle' as MarkerType :
                (((pointer.position === 'Inside' && !axis.opposedPosition) || (pointer.position === 'Outside' && axis.opposedPosition)) &&
                    pointer.markerType === 'InvertedTriangle' ? 'Triangle' as MarkerType : pointer.markerType));
        }
        options = new PathOption(
            pointerID, (gradientMarkerColor) ? gradientMarkerColor : pointerColor,
            pointer.border.width, pointer.border.color, pointer.opacity, pointer.border.dashArray, null, transform);
        options = calculateShapes(
            pointer.bounds, shapeBasedOnPosition, new Size(pointer.width, pointer.height),
            pointer.imageUrl, options, this.gauge.orientation, axis, pointer);
        // eslint-disable-next-line prefer-const
        pointerElement = ((pointer.markerType === 'Circle' ? this.gauge.renderer.drawCircle(options) as SVGAElement
            : (pointer.markerType === 'Image') ? this.gauge.renderer.drawImage(options) :
                this.gauge.renderer.drawPath(options) as SVGAElement));
        parentElement.appendChild(pointerElement);
        if (((pointer.animationDuration > 0 || animationMode === 'Enable') && (!this.gauge.isPropertyChange || pointer['isPointerAnimation']) && pointer['startValue'] !== pointer.currentValue) && !this.gauge.gaugeResized) {
            pointer.startValue = !this.gauge.isPropertyChange ? axis.minimum : pointer.startValue;
            pointer.animationComplete = false;
            this.performMarkerAnimation(pointerElement, axis, pointer);
        }
        if (pointer.animationDuration === 0) {
            pointer.startValue = pointer.currentValue;
        }
        pointerElement.setAttribute('aria-label', pointer.description || 'Pointer:' + Number(pointer.currentValue).toString());
        pointerElement.setAttribute('role', 'region');
    }

    public drawBarPointer(axis: Axis, axisIndex: number, pointer: Pointer, pointerIndex: number, parentElement: Element): void {
        let rectOptions: RectOption;
        let clipRectElement: Element;
        let pointerElement: Element;
        let path: string = '';
        let options: PathOption;
        let box: Rect;
        const size: Size = new Size(this.gauge.availableSize.width, this.gauge.availableSize.height);
        const pointerID: string = this.gauge.element.id + '_AxisIndex_' + axisIndex + '_' + pointer.type + 'Pointer' + '_' + pointerIndex;
        let gradientBarColor: string;

        if (this.gauge.gradientModule) {
            gradientBarColor = this.gauge.gradientModule.getGradientColorString(pointer);
        }
        if (getElement(pointerID) && getElement(pointerID).childElementCount > 0) {
            remove(getElement(pointerID));
        }
        if (this.gauge.container.type === 'Normal' || this.gauge.container.width === 0) {
            rectOptions = new RectOption(
                pointerID, (gradientBarColor) ?
                    gradientBarColor : pointer.color || this.gauge.themeStyle.pointerColor,
                pointer.border, pointer.opacity, pointer.bounds);
            box = pointer.bounds;
            pointerElement = this.gauge.renderer.drawRectangle(rectOptions) as SVGAElement;
        } else {
            path = pointer.value > axis.minimum || this.gauge.container.type === 'Thermometer' ? getBox(
                pointer.bounds, this.gauge.container.type, this.gauge.orientation,
                new Size(pointer.bounds.width, pointer.bounds.height), 'bar',
                this.gauge.container.width, axis, pointer.roundedCornerRadius) : '';
            options = new PathOption(
                pointerID, (gradientBarColor) ? gradientBarColor : pointer.color || this.gauge.themeStyle.pointerColor,
                pointer.border.width, pointer.border.color, pointer.opacity, pointer.border.dashArray, path);
            pointerElement = this.gauge.renderer.drawPath(options) as SVGAElement;
            box = getPathToRect(<SVGPathElement>pointerElement.cloneNode(true), size, this.gauge.element);
        }
        if (getElement(pointerID) && getElement(pointerID).childElementCount > 0) {
            const element: Element = getElement(pointerID).firstElementChild;
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
        pointerElement.setAttribute('role', 'region');
        if (((pointer.animationDuration > 0 || animationMode === 'Enable') && (!this.gauge.isPropertyChange || pointer['isPointerAnimation']) && pointer['startValue'] !== pointer.currentValue) && !this.gauge.gaugeResized) {
            pointer.startValue = !this.gauge.isPropertyChange ? axis.minimum : pointer.startValue;
            if (this.gauge.container.type === 'Thermometer' && pointer.startValue === 0 && this.gauge.container.width > 0) {
                clipRectElement = this.gauge.renderer.drawClipPath(
                    new RectOption(
                        this.gauge.element.id + '_AxisIndex_' + axisIndex + '_' + '_' + pointer.type + 'ClipRect_' + pointerIndex,
                        'transparent', { width: 1, color: 'Gray' }, 1, box));
                parentElement.appendChild(clipRectElement);
            }
            this.performBarAnimation(pointerElement, axis, pointer);
        }
        if (pointer.animationDuration === 0) {
            pointer.startValue = pointer.currentValue;
        }
    }


    public drawRanges(axis: Axis, axisObject: Element, axisIndex: number): void {
        let range: Range;
        let options: PathOption;
        const rangeElement: Element = this.gauge.renderer.createGroup({ id: this.gauge.element.id + '_RangesGroup_' + axisIndex });
        for (let j: number = 0; j < axis.ranges.length; j++) {
            range = <Range>axis.ranges[j as number];
            if (!(isNullOrUndefined(range.path))) {
                options = new PathOption(
                    this.gauge.element.id + '_AxisIndex_' + axisIndex + '_Range_' + j, range.interior, (range.start !== range.end) ? range.border.width : 0,
                    range.border.color, 1, range.border.dashArray, range.path);
                rangeElement.appendChild(this.gauge.renderer.drawPath(options) as SVGAElement);
            }
        }
        axisObject.appendChild(rangeElement);
    }

    /**
     * @private
     */

    public destroy(): void {
        this.htmlObject = null;
        this.axisObject = null;
        this.axisElements = [];
        this.gauge = null;
    }
}
