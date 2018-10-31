/**
 * HeatMap Axis-Helper file
 */
import { HeatMap } from '../heatmap';
import { Rect, Size, measureText, TextOption, rotateTextSize, textTrim, CanvasTooltip } from '../utils/helper';
import { Axis } from './axis';
import { sum, titlePositionX, LineOption, Line, DrawSvgCanvas, TextBasic, titlePositionY } from '../utils/helper';
import { extend, Browser } from '@syncfusion/ej2-base';
import { TitleModel } from '../model/base-model';
export class AxisHelper {
    private heatMap: HeatMap;
    private initialClipRect: Rect;
    private htmlObject: HTMLElement;
    private element: Element;
    private padding: number;
    private drawSvgCanvas: DrawSvgCanvas;
    constructor(heatMap?: HeatMap) {
        this.heatMap = heatMap;
        this.padding = 10;
        this.drawSvgCanvas = new DrawSvgCanvas(heatMap);
    }
    /**
     * To render the x and y axis.
     *  @private
     */
    public renderAxes(): void {
        this.initialClipRect = this.heatMap.initialClipRect;
        let heatMap: HeatMap = this.heatMap;
        let axisElement: Element;
        let element: Element;
        if (!heatMap.enableCanvasRendering) {
            axisElement = this.heatMap.renderer.createGroup({ id: heatMap.element.id + 'AxisCollection' });
        }
        let axes: Axis[] = this.heatMap.axisCollections;
        for (let i: number = 0, len: number = axes.length; i < len; i++) {
            let axis: Axis = axes[i];
            let optionsLine: Object = {};
            if (axis.orientation === 'Horizontal') {
                if (!heatMap.enableCanvasRendering) {
                    element = this.heatMap.renderer.createGroup({ id: heatMap.element.id + 'XAxisGroup' });
                }
                this.drawXAxisLine(element, axis);
                this.drawXAxisTitle(axis, element, axis.rect);
                this.drawXAxisLabels(axis, element, axis.rect);
            } else {
                element = heatMap.renderer.createGroup({ id: heatMap.element.id + 'YAxisGroup' });
                this.drawYAxisLine(element, axis);
                this.drawYAxisTitle(axis, element, axis.rect);
                this.drawYAxisLabels(axis, element, axis.rect);
            }
            if (!heatMap.enableCanvasRendering) {
                axisElement.appendChild(element);
            }
        }
        if (!heatMap.enableCanvasRendering) {
            this.heatMap.svgObject.appendChild(axisElement);
        }
    }

    private drawXAxisLine(parent: Element, axis: Axis): void {
        let y: number = this.initialClipRect.y + (!axis.opposedPosition ? this.initialClipRect.height : 0);
        let line: LineOption = new LineOption(
            this.heatMap.element.id + '_XAxisLine',
            new Line(this.initialClipRect.x, y, this.initialClipRect.x + this.initialClipRect.width, y),
            'transparent', 0);
        this.drawSvgCanvas.drawLine(line, parent);
    }

    private drawYAxisLine(parent: Element, axis: Axis): void {
        let x: number = this.initialClipRect.x + ((!axis.opposedPosition) ? 0 : this.initialClipRect.width);
        let line: LineOption = new LineOption(
            this.heatMap.element.id + '_YAxisLine',
            new Line(x, this.initialClipRect.y, x, this.initialClipRect.height + this.initialClipRect.y),
            'transparent', 0);
        this.drawSvgCanvas.drawLine(line, parent);
    }
    private drawXAxisTitle(axis: Axis, parent: Element, rect: Rect): void {
        let y: number = rect.y + (!axis.opposedPosition ?
            (axis.maxLabelSize.height + this.padding) : - (axis.maxLabelSize.height + this.padding));
        if (axis.title.text) {
            let heatMap: HeatMap = this.heatMap;
            let title: TitleModel = axis.title;
            let elementSize: Size = measureText(title.text, title.textStyle);
            let padding: number = this.padding;
            let anchor: string = title.textStyle.textAlignment === 'Near' ? 'start' :
                title.textStyle.textAlignment === 'Far' ? 'end' : 'middle';
            padding = axis.opposedPosition ? - (padding + elementSize.height / 4) : (padding + (3 * elementSize.height / 4));

            let options: TextOption = new TextOption(
                heatMap.element.id + '_XAxisTitle',
                new TextBasic(rect.x + titlePositionX(rect.width, 0, 0, title.textStyle), y + padding, anchor, title.text),
                title.textStyle, title.textStyle.color || heatMap.themeStyle.axisTitle);
            this.drawSvgCanvas.createText(options, parent, title.text);
        }
    }

    private drawYAxisTitle(axis: Axis, parent: Element, rect: Rect): void {
        if (axis.title.text) {
            let title: TitleModel = axis.title;
            let heatMap: HeatMap = this.heatMap;
            let labelRotation: number = (axis.opposedPosition) ? 90 : -90;
            let elementSize: Size = measureText(title.text, title.textStyle);
            let anchor: string = title.textStyle.textAlignment === 'Near' ? 'start' :
                title.textStyle.textAlignment === 'Far' ? 'end' : 'middle';
            let padding: number = 10;
            padding = axis.opposedPosition ? padding : -padding;
            let x: number = rect.x + padding + ((axis.opposedPosition) ? axis.maxLabelSize.width : -axis.maxLabelSize.width);
            let y: number = rect.y + titlePositionY(rect, 0, 0, title.textStyle) + (axis.opposedPosition ? this.padding : -this.padding);
            let options: TextOption = new TextOption(
                heatMap.element.id + '_YAxisTitle',
                new TextBasic(
                    x, y - this.padding, anchor, title.text, labelRotation,
                    'rotate(' + labelRotation + ',' + (x) + ',' + (y) + ')', 'auto'),
                title.textStyle, title.textStyle.color || heatMap.themeStyle.axisTitle);
            if (!this.heatMap.enableCanvasRendering) {
                this.drawSvgCanvas.createText(options, parent, title.text);
            } else {
                this.drawSvgCanvas.canvasDrawText(options, title.text, x, y);
            }
        }
    }

    /**
     * Get the visible labels for both x and y axis
     * @private
     */
    public calculateVisibleLabels(): void {
        let heatmap: HeatMap = this.heatMap;
        let axis: Axis;
        let axisCollection: Axis[] = heatmap.axisCollections;
        for (let i: number = 0, len: number = axisCollection.length; i < len; i++) {
            axis = axisCollection[i];
            axis.axisLabels = [];
            axis.tooltipLabels = [];
            axis.dateTimeAxisLabelInterval = [];
            axis.labelValue = [];
            if (axis.valueType === 'Numeric') {
                axis.calculateNumericAxisLabels(this.heatMap);
            } else if (axis.valueType === 'DateTime') {
                axis.calculateDateTimeAxisLabel(this.heatMap);
            } else {
                axis.calculateCategoryAxisLabels();
            }
            axis.tooltipLabels = axis.isInversed ? axis.tooltipLabels.reverse() : axis.tooltipLabels;
        }
    }

    /**
     * Measure the title and labels rendering position for both X and Y axis.
     * @param rect
     * @private
     */
    public measureAxis(rect: Rect): void {
        let heatmap: HeatMap = this.heatMap;
        let axis: Axis;
        let axisCollection: Axis[] = heatmap.axisCollections;
        for (let i: number = axisCollection.length - 1; i >= 0; i--) {
            axis = axisCollection[i];
            let padding: number = axis.textStyle.size === '0px' ? 0 : this.padding;
            axis.nearSizes = [];
            axis.farSizes = [];
            axis.computeSize(axis, heatmap);
            if (!axis.opposedPosition) {
                if (axis.orientation === 'Horizontal') {
                    rect.height -= (sum(axis.nearSizes) + padding);
                } else {
                    rect.x += sum(axis.nearSizes) + padding;
                    rect.width -= sum(axis.nearSizes) + padding;
                }
            } else {
                if (axis.orientation === 'Horizontal') {
                    rect.y += sum(axis.farSizes) + padding;
                    rect.height -= sum(axis.farSizes) + padding;
                } else {
                    rect.width -= sum(axis.farSizes) + padding;
                }
            }

        }
    }

    /**
     * Calculate the X and Y axis line position
     * @param rect 
     * @private
     */
    public calculateAxisSize(rect: Rect): void {
        let heatmap: HeatMap = this.heatMap;
        let axis: Axis;
        let axisCollection: Axis[] = heatmap.axisCollections;
        for (let i: number = 0, len: number = axisCollection.length; i < len; i++) {
            let axis: Axis = axisCollection[i];
            axis.rect = <Rect>extend({}, rect, null, true);
            if (axis.orientation === 'Horizontal' && !axis.opposedPosition) {
                axis.rect.y = rect.y + rect.height;
                axis.rect.height = 0;
            }
            if (axis.orientation === 'Vertical' && axis.opposedPosition) {
                axis.rect.x = rect.x + rect.width;
                axis.rect.width = 0;
            }
        }
    }

    private drawXAxisLabels(axis: Axis, parent: Element, rect: Rect): void {
        let heatMap: HeatMap = this.heatMap;
        let labels: string[] = axis.axisLabels;
        let interval: number = rect.width / axis.axisLabelSize;
        let compactInterval: number = 0;
        let axisInterval: number = axis.interval ? axis.interval : 1;
        let tempintervel: number = rect.width / (axis.axisLabelSize / axis.axisLabelInterval);
        let temp: number = axis.axisLabelInterval;
        if (tempintervel > 0) {
            while (tempintervel < parseInt(axis.textStyle.size, 10)) {
                temp = temp + 1;
                tempintervel = rect.width / (axis.axisLabelSize / temp);
            }
        } else {
            temp = axis.tooltipLabels.length;
        }
        if (axis.axisLabelInterval < temp) {
            compactInterval = temp;
            labels = axis.tooltipLabels;
            axisInterval = temp;
        }
        let padding: number = 10;
        let lableStrtX: number = rect.x + (!axis.isInversed ? 0 : rect.width);
        let labelPadding: number;
        let angle: number = axis.angle;
        padding = this.padding;
        let anglePadding: number = ((angle === 90 || angle === -90)) ? -2 : 0;
        let labelElement: Element;
        if (!heatMap.enableCanvasRendering) {
            labelElement = this.heatMap.renderer.createGroup({ id: heatMap.element.id + 'XAxisLabels' });
        }
        for (let i: number = 0, len: number = labels.length; i < len; i++) {
            let lableRect: Rect = new Rect(lableStrtX, rect.y, interval, rect.height);
            let label: string = (axis.labelIntersectAction === 'Trim' && axis.isIntersect) ? axis.valueType !== 'DateTime' ||
                axis.showLabelOn === 'None' ? textTrim(interval * axisInterval, labels[i], axis.textStyle) :
                textTrim(axis.dateTimeAxisLabelInterval[i] * interval, labels[i], axis.textStyle) : labels[i];
            let elementSize: Size = measureText(label, axis.textStyle);
            let transform: string;
            labelPadding = (axis.opposedPosition) ?
                -(padding)
                : padding + (3 * (elementSize.height / 4));
            let x: number = lableRect.x + ((!axis.isInversed) ?
                (lableRect.width / 2) - (elementSize.width / 2) : -((lableRect.width / 2) + (elementSize.width / 2)));
            if (axis.labelIntersectAction === 'Trim') {
                x = (!axis.isInversed) ? (x >= lableRect.x ? x : lableRect.x) : (x > (lableStrtX - interval) ? x : (lableStrtX - interval));
            } else if (angle % 180 === 0) {
                x = x < rect.x ? rect.x : x;
                x = ((x + elementSize.width) > (rect.x + rect.width)) ? (rect.x + rect.width - elementSize.width) : x;
            }
            let y: number = rect.y + labelPadding;
            if (angle % 360 !== 0) {
                angle = (angle > 360) ? angle % 360 : angle;
                let rotateSize: Size = rotateTextSize(axis.textStyle, <string>label, angle);
                let diffHeight: number = axis.maxLabelSize.height - Math.ceil(rotateSize.height - elementSize.height);
                let yLocation: number = axis.opposedPosition ? diffHeight / 2 : - diffHeight / 2;
                x = lableRect.x + (axis.isInversed ? -(lableRect.width / 2) : (lableRect.width / 2));
                y = y + (axis.opposedPosition ? -(rotateSize.height / 2) : ((rotateSize.height - elementSize.height) / 2));
                transform = 'rotate(' + angle + ',' + x + ','
                    + y + ')';
            }
            let options: TextOption = new TextOption(
                heatMap.element.id + '_XAxis_Label' + i,
                new TextBasic(x, y, (angle % 360 === 0) ? 'start' : 'middle', label, angle, transform),
                axis.textStyle,
                axis.textStyle.color || heatMap.themeStyle.axisLabel
            );
            if (angle !== 0 && this.heatMap.enableCanvasRendering) {
                this.drawSvgCanvas.canvasDrawText(options, label);
            } else {
                this.drawSvgCanvas.createText(options, labelElement, label);
            }
            if (compactInterval === 0) {
                let labelInterval: number = (axis.valueType === 'DateTime' && axis.showLabelOn !== 'None') ?
                    axis.dateTimeAxisLabelInterval[i] : axis.axisLabelInterval;
                lableStrtX = lableStrtX + (!axis.isInversed ? (labelInterval * interval) :
                    -(labelInterval * interval));

            } else {
                lableStrtX = lableStrtX + (!axis.isInversed ? (compactInterval * interval) : -(compactInterval * interval));
            }
            if (label.indexOf('...') !== -1 && this.heatMap.enableCanvasRendering) {
                this.heatMap.tooltipCollection.push(
                    new CanvasTooltip(
                        labels[i],
                        new Rect(x, y - elementSize.height, elementSize.width, elementSize.height)));
            }
            if (compactInterval !== 0) {
                i = i + (compactInterval - 1);
            }
        }
        if (!heatMap.enableCanvasRendering) {
            parent.appendChild(labelElement);
        }
    }
    private drawYAxisLabels(axis: Axis, parent: Element, rect: Rect): void {
        let heatMap: HeatMap = this.heatMap;
        let labels: string[] = axis.axisLabels;
        let interval: number = rect.height / axis.axisLabelSize;
        let compactInterval: number = 0;
        let tempintervel: number = rect.height / (axis.axisLabelSize / axis.axisLabelInterval);
        let temp: number = axis.axisLabelInterval;
        if (tempintervel > 0) {
            while (tempintervel < parseInt(axis.textStyle.size, 10)) {
                temp = temp + 1;
                tempintervel = rect.height / (axis.axisLabelSize / temp);
            }
        } else {
            temp = axis.tooltipLabels.length;
        }
        if (axis.axisLabelInterval < temp) {
            compactInterval = temp;
            labels = axis.tooltipLabels;
        }
        let padding: number = 10;
        let lableStartY: number = rect.y + (axis.isInversed ? 0 : rect.height);
        let anchor: string = axis.opposedPosition ? 'start' : 'end';
        padding = axis.opposedPosition ? padding : -padding;
        let labelElement: Element;
        if (!heatMap.enableCanvasRendering) {
            labelElement = this.heatMap.renderer.createGroup({ id: heatMap.element.id + 'YAxisLabels' });
        }
        for (let i: number = 0, len: number = labels.length; i < len; i++) {
            let labelRect: Rect = new Rect(rect.x, lableStartY, rect.width, interval);
            let position: number = labelRect.height / 2; //titlePositionY(lableRect, 0, 0, axis.textStyle);
            let x: number = labelRect.x + padding;
            let y: number = labelRect.y + (axis.isInversed ? position : -position);
            let options: TextOption = new TextOption(
                heatMap.element.id + '_YAxis_Label' + i,
                new TextBasic(x, y, anchor, labels[i], 0, 'rotate(' + 0 + ',' + (x) + ',' + (y) + ')', 'middle'),
                axis.textStyle, axis.textStyle.color || heatMap.themeStyle.axisLabel);
            if (Browser.isIE && !heatMap.enableCanvasRendering) {
                options.dy = '1ex';
            }
            this.drawSvgCanvas.createText(options, labelElement, labels[i]);
            if (compactInterval === 0) {
                let labelInterval: number = (axis.valueType === 'DateTime' && axis.showLabelOn !== 'None') ?
                    axis.dateTimeAxisLabelInterval[i] : axis.axisLabelInterval;
                lableStartY = lableStartY + (axis.isInversed ? (labelInterval * interval) :
                    -(labelInterval * interval));
            } else {
                lableStartY = lableStartY + (axis.isInversed ? (compactInterval * interval) : -(compactInterval * interval));
                i = i + (compactInterval - 1);
            }
        }
        if (!heatMap.enableCanvasRendering) {
            parent.appendChild(labelElement);
        }
    }
}