/**
 * HeatMap Axis-Helper file
 */
import { HeatMap } from '../heatmap';
import { Rect, Size, measureText, TextOption, rotateTextSize, textTrim, CanvasTooltip, PathOption, textWrap } from '../utils/helper';
import { Axis } from './axis';
import { sum, titlePositionX, LineOption, Line, DrawSvgCanvas, TextBasic, titlePositionY, MultiLevelPosition } from '../utils/helper';
import { extend, Browser } from '@syncfusion/ej2-base';
import { TitleModel } from '../model/base-model';
import { DataModel } from '../datasource/adaptor-model';
import { MultiLevelLabels, MultiLevelCategories } from '../model/base';
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
            if (axis.multiLevelLabels.length > 0) {
                this.drawMultiLevels(element, axis);
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
        let titlepadding: number = ( axis.textStyle.size === '0px' ? 0 : 10);
        let y: number = rect.y + (!axis.opposedPosition ? (axis.maxLabelSize.height + titlepadding +
            sum(axis.xAxisMultiLabelHeight)) : - (axis.maxLabelSize.height + titlepadding + sum(axis.xAxisMultiLabelHeight)));
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
            let titlepadding: number = ( axis.textStyle.size === '0px' ? 0 : padding);
            let x: number = rect.x + titlepadding + ((axis.opposedPosition) ? axis.maxLabelSize.width + sum(axis.yAxisMultiLabelHeight) :
                -(axis.maxLabelSize.width + sum(axis.yAxisMultiLabelHeight)));
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
        let data: DataModel = this.heatMap.dataSourceSettings;
        let processLabels: boolean = !(data && data.isJsonData && data.adaptorType === 'Cell');
        for (let i: number = 0, len: number = axisCollection.length; i < len; i++) {
            axis = axisCollection[i];
            if (axis.valueType === 'Numeric' && processLabels) {
                axis.clearAxisLabel();
                axis.calculateNumericAxisLabels(this.heatMap);
            } else if (axis.valueType === 'DateTime' && processLabels) {
                axis.clearAxisLabel();
                axis.calculateDateTimeAxisLabel(this.heatMap);
            } else if (axis.valueType === 'Category') {
                axis.clearAxisLabel();
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
            axis.computeSize(axis, heatmap, rect);
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
            axis.multiLevelPosition = [];
            for (let i: number = 0; i < axis.multiLevelLabels.length; i++) {
                let multiPosition: MultiLevelPosition = axis.multiPosition(axis, i);
                axis.multiLevelPosition.push(multiPosition);
            }
        }
    }

    private drawXAxisLabels(axis: Axis, parent: Element, rect: Rect): void {
        let heatMap: HeatMap = this.heatMap; let labels: string[] = axis.axisLabels;
        let interval: number = rect.width / axis.axisLabelSize; let compactInterval: number = 0;
        let axisInterval: number = axis.interval ? axis.interval : 1;
        let tempintervel: number = rect.width / (axis.axisLabelSize / axis.axisLabelInterval);
        let temp: number = axis.axisLabelInterval;
        if (tempintervel > 0) {
            while (tempintervel < parseInt(axis.textStyle.size, 10)) {
                temp = temp + 1;
                tempintervel = rect.width / (axis.axisLabelSize / temp);
            }
        } else { temp = axis.tooltipLabels.length; }
        if (axis.axisLabelInterval < temp) {
            compactInterval = temp;
            labels = axis.tooltipLabels;
            axisInterval = temp;
        }
        let y: number; let padding: number = 10;
        let lableStrtX: number = rect.x + (!axis.isInversed ? 0 : rect.width);
        let labelPadding: number; let angle: number = axis.angle;
        padding = this.padding; let labelElement: Element; let borderElement: Element;
        if (!heatMap.enableCanvasRendering) {
            labelElement = this.heatMap.renderer.createGroup({ id: heatMap.element.id + 'XAxisLabels' });
            borderElement = this.heatMap.renderer.createGroup({ id: heatMap.element.id + 'XAxisLabelBorder' });
        }
        if (axis.isInversed && axis.labelIntersectAction === 'MultipleRows') { axis.multipleRow.reverse(); }
        for (let i: number = 0, len: number = labels.length; i < len; i++) {
            let lableRect: Rect = new Rect(lableStrtX, rect.y, interval, rect.height);
            let label: string = (axis.labelIntersectAction === 'Trim' && axis.isIntersect) ? axis.valueType !== 'DateTime' ||
                axis.showLabelOn === 'None' ? textTrim(interval * axisInterval, labels[i], axis.textStyle) :
                textTrim(axis.dateTimeAxisLabelInterval[i] * interval, labels[i], axis.textStyle) : labels[i];
            label = axis.enableTrim ? textTrim( axis.maxLabelLength, labels[i], axis.textStyle) :  label ;
            let elementSize: Size = measureText(label, axis.textStyle);
            let transform: string;
            labelPadding = (axis.opposedPosition) ? -(padding) : (padding + ((angle % 360) === 0 ? (elementSize.height / 2) : 0));
            let x: number = lableRect.x + ((!axis.isInversed) ?
                (lableRect.width / 2) - (elementSize.width / 2) : -((lableRect.width / 2) + (elementSize.width / 2)));
            if (axis.labelIntersectAction === 'Trim') {
                x = (!axis.isInversed) ? (x >= lableRect.x ? x : lableRect.x) : (x > (lableStrtX - interval) ? x : (lableStrtX - interval));
            } else if (angle % 180 === 0) {
                x = x < rect.x ? rect.x : x;
                x = ((x + elementSize.width) > (rect.x + rect.width)) ? (rect.x + rect.width - elementSize.width) : x;
            }
            if (axis.labelIntersectAction === 'MultipleRows' && axis.labelRotation === 0) {
                let a: number = axis.opposedPosition ?  -(axis.multipleRow[i].index - 1) : (axis.multipleRow[i].index - 1);
                if (axis.multipleRow[i].index > 1 ) {
                    y = rect.y + labelPadding + (elementSize.height * a) + (axis.opposedPosition ?
                        -(((elementSize.height * 0.5) / 2) * axis.multipleRow[i].index) :
                        (((elementSize.height * 0.5) / 2) * axis.multipleRow[i].index));
                } else {
                    y = rect.y + labelPadding + (axis.opposedPosition ? - ((elementSize.height * 0.5) / 2) :
                    ((elementSize.height * 0.5) / 2));
                }
            } else { y = rect.y + labelPadding ; }
            this.drawXAxisBorder(axis, borderElement, axis.rect, x, elementSize.width, i);
            if (angle % 360 !== 0) {
                angle = (angle > 360) ? angle % 360 : angle;
                let rotateSize: Size = rotateTextSize(axis.textStyle, <string>label, angle);
                let diffHeight: number = axis.maxLabelSize.height - Math.ceil(rotateSize.height - elementSize.height);
                let yLocation: number = axis.opposedPosition ? diffHeight / 2 : - diffHeight / 2;
                x = lableRect.x + (axis.isInversed ? -(lableRect.width / 2) : (lableRect.width / 2));
                y = y + (axis.opposedPosition ? -(rotateSize.height / 2) :
                    (((angle % 360) === 180 || (angle % 360) === -180) ? 0 : (rotateSize.height) / 2));
                transform = 'rotate(' + angle + ',' + x + ',' + y + ')';
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
            if (label.indexOf('...') !== -1) {
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
            parent.appendChild(borderElement);
        }
    }
    private drawYAxisLabels(axis: Axis, parent: Element, rect: Rect): void {
        let heatMap: HeatMap = this.heatMap;
        let labels: string[] = axis.axisLabels;
        let interval: number = rect.height / axis.axisLabelSize;
        let compactInterval: number = 0;
        let tempintervel: number = rect.height / (axis.axisLabelSize / axis.axisLabelInterval);
        let temp: number = axis.axisLabelInterval;
        let label: string;
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
        let labelElement: Element; let borderElement: Element;
        if (!heatMap.enableCanvasRendering) {
            labelElement = this.heatMap.renderer.createGroup({ id: heatMap.element.id + 'YAxisLabels' });
            borderElement = this.heatMap.renderer.createGroup({ id: heatMap.element.id + 'YAxisLabelBorder' });
        }
        for (let i: number = 0, len: number = labels.length; i < len; i++) {
            let labelRect: Rect = new Rect(rect.x, lableStartY, rect.width, interval);
            let position: number = labelRect.height / 2; //titlePositionY(lableRect, 0, 0, axis.textStyle);
            let x: number = labelRect.x + padding;
            let y: number = labelRect.y + (axis.isInversed ? position : -position);
            label = axis.enableTrim ? textTrim( axis.maxLabelLength, labels[i], axis.textStyle) : labels[i];
            let options: TextOption = new TextOption(
                heatMap.element.id + '_YAxis_Label' + i,
                new TextBasic(x, y, anchor, label, 0, 'rotate(' + 0 + ',' + (x) + ',' + (y) + ')', 'middle'),
                axis.textStyle, axis.textStyle.color || heatMap.themeStyle.axisLabel);
            if (Browser.isIE && !heatMap.enableCanvasRendering) {
                options.dy = '1ex';
            }
            this.drawSvgCanvas.createText(options, labelElement, label);
            if (compactInterval === 0) {
                let labelInterval: number = (axis.valueType === 'DateTime' && axis.showLabelOn !== 'None') ?
                    axis.dateTimeAxisLabelInterval[i] : axis.axisLabelInterval;
                lableStartY = lableStartY + (axis.isInversed ? (labelInterval * interval) :
                    -(labelInterval * interval));
            } else {
                lableStartY = lableStartY + (axis.isInversed ? (compactInterval * interval) : -(compactInterval * interval));
                i = i + (compactInterval - 1);
            }
            let elementSize: Size = measureText(label, axis.textStyle);
            this.drawYAxisBorder(axis, borderElement, axis.rect, y, elementSize.height, i);
            if (label.indexOf('...') !== -1) {
                let xValue: number = axis.opposedPosition ? x : (x - elementSize.width);
                this.heatMap.tooltipCollection.push(
                    new CanvasTooltip(
                        labels[i],
                        new Rect(
                            xValue, y - elementSize.height, elementSize.width, elementSize.height)));
            }
        }
        if (!heatMap.enableCanvasRendering) {
            parent.appendChild(labelElement);
            parent.appendChild(borderElement);
        }
    }

    private drawXAxisBorder(axis: Axis, parent: Element, rect: Rect, lableX: number, width: number, index: number): void {
        let interval: number = rect.width / axis.axisLabelSize;
        let path: string = ''; let padding: number = 10;
        let axisInterval: number = axis.interval ? axis.interval : 1;
        let startX: number = axis.isInversed ? rect.x + rect.width - (interval * index * axisInterval) :
            rect.x + (interval * index * axisInterval);
        let startY: number = rect.y;
        let endX: number; let endY: number;
        endY = startY + (axis.opposedPosition ? -(axis.maxLabelSize.height + padding) : axis.maxLabelSize.height + padding);
        endX = axis.isInversed ? startX - interval : startX + interval;
        switch (axis.border.type) {
            case 'Rectangle':
                path = ('M' + ' ' + startX + ' ' + startY + ' ' + 'L' + ' ' + startX + ' ' + endY + ' ' +
                    'L' + ' ' + endX + ' ' + endY + ' ' + 'L' + ' ' + endX + ' ' + startY + ' ' + 'L' + ' ' + startX + ' ' + startY);
                break;
            case 'WithoutTopBorder':
                path = 'M' + ' ' + startX + ' ' + startY + ' ' + 'L' + ' ' + startX + ' ' + endY + ' ' +
                    'L' + ' ' + endX + ' ' + endY + ' ' + 'L' + ' ' + endX + ' ' + startY + ' ';
                break;
            case 'WithoutBottomBorder':
                path = 'M' + ' ' + startX + ' ' + endY + ' ' + 'L' + ' ' + startX + ' ' + startY + ' ' +
                    'L' + ' ' + endX + ' ' + startY + ' ' + 'L' + ' ' + endX + ' ' + endY + ' ';
                break;
            case 'WithoutTopandBottomBorder':
                path = 'M' + ' ' + startX + ' ' + startY + ' ' + 'L' + ' ' + startX + ' ' + endY + ' ' +
                    'M' + ' ' + endX + ' ' + startY + ' ' + 'L' + ' ' + endX + ' ' + endY + ' ';
                break;
            case 'Brace':
            let padding: number = 3;
                endY = startY + ((endY - startY) / 2) + (axis.opposedPosition ? 0 : 5);
                let endY1: number = axis.isInversed ? (lableX + width + padding) : (lableX - padding);
                let endY2: number = axis.isInversed ? (lableX - padding) : (lableX + width + padding);
                path = 'M' + ' ' + startX + ' ' + startY + ' ' + 'L' + ' ' + startX + ' ' + endY + ' ' +
                        'L' + ' ' + endY1 + ' ' + endY + ' ' + 'M' + ' ' + endY2 +
                        ' ' + endY + ' ' + 'L' +
                        ' ' + endX + ' ' + endY + ' ' + 'L' + ' ' + endX + ' ' + startY + ' ';
                break;
        }
        if (axis.border.width > 0 && axis.border.type !== 'WithoutBorder') {
            this.createAxisBorderElement(axis, path, parent, index);
        }
    }

    private drawYAxisBorder(axis: Axis, parent: Element, rect: Rect, lableY: number, height: number, index: number): void {
        let interval: number = rect.height / axis.axisLabelSize;
        let path: string = ''; let padding: number = 20;
        let axisInterval: number = axis.interval ? axis.interval : 1;
        let startX: number = rect.x;
        let startY: number = axis.isInversed ? rect.y + (interval * index * axisInterval) :
         rect.y + rect.height - (interval * index * axisInterval);
        let endX: number; let endY: number;
        endX = startX + (!axis.opposedPosition ? -(axis.maxLabelSize.width + padding) : axis.maxLabelSize.width + padding);
        endY = axis.isInversed ? startY + interval : startY - interval;
        switch (axis.border.type) {
            case 'Rectangle':
                path = 'M' + ' ' + startX + ' ' + startY + ' ' + 'L' + ' ' + startX + ' ' + endY + ' ' +
                    'L' + ' ' + endX + ' ' + endY + ' ' + 'L' + ' ' + endX + ' ' + startY + ' ' + 'L' + ' ' + startX + ' ' + startY;
                break;
            case 'WithoutTopBorder':
                path = 'M' + ' ' + startX + ' ' + startY + ' ' + 'L' + ' ' + endX + ' ' + startY + ' ' +
                    'L' + ' ' + endX + ' ' + endY + ' ' + 'L' + ' ' + startX + ' ' + endY + ' ';
                break;
            case 'WithoutBottomBorder':
                path = 'M' + ' ' + endX + ' ' + startY + ' ' + 'L' + ' ' + startX + ' ' + startY + ' ' +
                    'L' + ' ' + startX + ' ' + endY + ' ' + 'L' + ' ' + endX + ' ' + endY + ' ';
                break;
            case 'WithoutTopandBottomBorder':
                path = 'M' + ' ' + startX + ' ' + startY + ' ' + 'L' + ' ' + endX + ' ' + startY + ' ' +
                    'M' + ' ' + endX + ' ' + endY + ' ' + 'L' + ' ' + startX + ' ' + endY + ' ';
                break;
            case 'Brace':
                endX = startX - (startX - endX) / 2;
                let endY1: number = axis.isInversed ? lableY - height / 2 : lableY + height / 2;
                let endY2: number = axis.isInversed ? lableY + height / 2 : lableY - height / 2;
                path = 'M' + ' ' + startX + ' ' + startY + ' ' + 'L' + ' ' + endX + ' ' + startY + ' ' +
                        'L' + ' ' + endX + ' ' + endY1 + ' ' + 'M' + ' ' +
                        endX + ' ' + endY2 + ' ' + 'L' + ' ' + endX + ' ' + endY + ' ' +
                        'L' + ' ' + startX + ' ' + endY;
                break;

        }
        if (axis.border.width > 0 && axis.border.type !== 'WithoutBorder') {
            this.createAxisBorderElement(axis, path, parent, index);
        }
    }

    /**
     * To create border element for axis.
     * @return {void}
     * @private
     */
    private createAxisBorderElement(axis: Axis, labelBorder: string, parent: Element, index: number): void {
        let canvasTranslate: Int32Array;
        let id: string = axis.orientation === 'Horizontal' ? '_XAxis_Label_Border' : '_YAxis_Label_Border';
        let pathOptions: PathOption = new PathOption(
            this.heatMap.element.id + id + index, 'transparent', axis.border.width, axis.border.color, 1, 'none', labelBorder);
        if (!this.heatMap.enableCanvasRendering) {
            let borderElement: Element = this.heatMap.renderer.drawPath(pathOptions);
            parent.appendChild(borderElement);
        } else {
            this.heatMap.canvasRenderer.drawPath(pathOptions, canvasTranslate);
        }
    }

    private drawMultiLevels(parent: Element, axis: Axis): void {
        let element: Element;
        if (!this.heatMap.enableCanvasRendering) {
            element = this.heatMap.renderer.createGroup({ id: this.heatMap.element.id + '_' + axis.orientation + '_MultiLevelLabel' });
        }
        axis.orientation === 'Horizontal' ? this.renderXAxisMultiLevelLabels(axis, element, axis.rect) :
            this.renderYAxisMultiLevelLabels(axis, element, axis.rect);
        if (!this.heatMap.enableCanvasRendering) {
            parent.appendChild(element);
        }
    }

    /**
     * render x axis multi level labels
     * @private
     * @return {void}
     */
    public renderXAxisMultiLevelLabels(axis: Axis, parent: Element, rect: Rect): void {
        let x: number = 0; let y: number; let padding: number = 10;
        let startX: number; let startY: number;
        let endX: number = 0; let tooltip: boolean;
        let start: number | Date; let end: number | Date;
        let labelSize: Size; let anchor: string; let isInversed: boolean = axis.isInversed;
        let labelElement: Element; let opposedPosition: boolean = axis.opposedPosition;
        let pathRect: string = ''; let gap: number;
        let width: number; let textLength: number;
        let position: number = (isInversed ? axis.rect.width : 0) + axis.rect.x;
        axis.multiLevelLabels.map((multiLevel: MultiLevelLabels, level: number) => {
            labelElement = this.heatMap.renderer.createGroup({ id: this.heatMap.element.id + '_XAxisMultiLevelLabel' + level });
            multiLevel.categories.map((categoryLabel: MultiLevelCategories, i: number) => {
                tooltip = false;
                start = typeof categoryLabel.start === 'number' ? categoryLabel.start : Number(new Date(<string>categoryLabel.start));
                end = typeof categoryLabel.end === 'number' ? categoryLabel.end : Number(new Date(<string>categoryLabel.end));
                startX = position + this.calculateLeftPosition(axis, start, categoryLabel.start, axis.rect);
                startY = axis.multiLevelPosition[level].y;
                endX = position + this.calculateWidth(axis, categoryLabel.end, end, axis.rect);
                labelSize = measureText(categoryLabel.text, multiLevel.textStyle);
                gap = ((categoryLabel.maximumTextWidth === null) ? Math.abs(endX - startX) : categoryLabel.maximumTextWidth) - padding;
                y = startY + (opposedPosition ? -((axis.xAxisMultiLabelHeight[level] - labelSize.height)) : labelSize.height);
                width = categoryLabel.maximumTextWidth ? categoryLabel.maximumTextWidth : labelSize.width;
                x = !isInversed ? startX + padding : startX - gap;
                if (multiLevel.alignment === 'Center') {
                    x = ((endX - startX) / 2) + startX;
                    x -= (labelSize.width > gap ? gap : labelSize.width) / 2;
                } else if (multiLevel.alignment === 'Far') {
                    x = !isInversed ? endX - padding : startX - padding;
                    x -= (labelSize.width > gap ? gap : labelSize.width);
                } else {
                    x = !isInversed ? startX + padding : endX + padding;
                }
                if (multiLevel.overflow === 'None' && labelSize.width > Math.abs(endX - startX)) {
                    x = !isInversed ? startX + padding : startX - labelSize.width - padding;
                    anchor = 'start';
                }
                let textBasic: TextBasic = new TextBasic(
                    x, y, anchor, categoryLabel.text, 0,
                    'translate(0,0)');

                let options: TextOption = new TextOption(
                    this.heatMap.element.id + '_XAxis_MultiLevel' + level + '_Text' + i, textBasic, multiLevel.textStyle,
                    multiLevel.textStyle.color || this.heatMap.themeStyle.axisLabel);
                if (multiLevel.overflow === 'Wrap') {
                    options.text = textWrap(categoryLabel.text, gap, multiLevel.textStyle);
                    textLength = options.text.length;
                } else if (multiLevel.overflow === 'Trim') {
                    options.text = textTrim(gap, categoryLabel.text, multiLevel.textStyle);
                    textLength = 1;
                }
                if (multiLevel.overflow === 'Wrap' && options.text.length > 1) {
                    this.drawSvgCanvas.createWrapText(options, multiLevel.textStyle, labelElement);
                    for (let i: number = 0; i < options.text.length; i++) {
                        if (options.text[i].indexOf('...') !== -1) {
                            tooltip = true;
                            break;
                        }
                    }
                } else {
                    this.drawSvgCanvas.createText(options, labelElement, options.text);
                }
                if (!this.heatMap.enableCanvasRendering) {
                    parent.appendChild(labelElement);
                }
                if (options.text.indexOf('...') !== -1 || options.text[0].indexOf('...') !== -1 || tooltip) {
                    this.heatMap.tooltipCollection.push(
                        new CanvasTooltip(
                            categoryLabel.text,
                            new Rect(x, y - labelSize.height, gap, labelSize.height * textLength)));
                }
                if (multiLevel.border.width > 0 && multiLevel.border.type !== 'WithoutBorder') {
                    pathRect = this.renderXAxisLabelBorder(
                        level, axis, startX, startY, endX, pathRect, level, labelSize, gap, x
                    );
                }
            });
            if (pathRect !== '') {
                this.createBorderElement(level, axis, pathRect, parent);
                pathRect = '';
            }
        });
        if (!this.heatMap.enableCanvasRendering) {
            parent.appendChild(labelElement);
        }
    }

    /**
     * render x axis multi level labels border
     * @private
     * @return {void}
     */
    private renderXAxisLabelBorder(
        labelIndex: number, axis: Axis, startX: number, startY: number, endX: number,
        path: string, level: number, labelSize: Size, gap: number, x: number): string {
        let path1: number; let path2: number;
        let endY: number = startY + (axis.opposedPosition ? - (axis.xAxisMultiLabelHeight[labelIndex]) :
            axis.xAxisMultiLabelHeight[labelIndex]);
        switch (axis.multiLevelLabels[level].border.type) {
            case 'Rectangle':
                path += 'M' + ' ' + startX + ' ' + startY + ' ' + 'L' + ' ' + startX + ' ' + endY + ' ' +
                    'L' + ' ' + endX + ' ' + endY + ' ' + 'L' + ' ' + endX + ' ' + startY + ' ' + 'L' + ' ' + startX + ' ' + startY + ' ';
                break;
            case 'WithoutTopBorder':
                path += 'M' + ' ' + startX + ' ' + startY + ' ' + 'L' + ' ' + startX + ' ' + endY + ' ' +
                    'L' + ' ' + endX + ' ' + endY + ' ' + 'L' + ' ' + endX + ' ' + startY + ' ';
                break;
            case 'WithoutBottomBorder':
                path += 'M' + ' ' + startX + ' ' + endY + ' ' + 'L' + ' ' + startX + ' ' + startY + ' ' +
                    'L' + ' ' + endX + ' ' + startY + ' ' + 'L' + ' ' + endX + ' ' + endY + ' ';
                break;
            case 'WithoutTopandBottomBorder':
                path += 'M' + ' ' + startX + ' ' + startY + ' ' + 'L' + ' ' + startX + ' ' + endY + ' ' +
                    'M' + ' ' + endX + ' ' + startY + ' ' + 'L' + ' ' + endX + ' ' + endY + ' ';
                break;
            case 'Brace':
            let padding: number = 3;
                path1 = axis.isInversed ? (labelSize.width > gap ? gap : labelSize.width) + x + padding : x - padding;
                path2 = axis.isInversed ? x - padding : (labelSize.width > gap ? gap : labelSize.width) + x + padding;
                path += 'M' + ' ' + startX + ' ' + startY + ' ' + 'L' + ' ' + startX + ' ' + (startY + (endY - startY) / 2) + ' ' +
                    'L' + ' ' + path1 + ' ' + (startY + (endY - startY) / 2) + ' ' + 'M' + ' ' + path2 + ' ' + (startY +
                        (endY - startY) / 2) + ' ' + 'L' + ' ' + endX + ' ' + (startY + (endY - startY) / 2) +
                    ' ' + 'L' + ' ' + endX + ' ' + startY + ' ';
                break;
        }
        return path;
    }

    /**
     * render y axis multi level labels
     * @private
     * @return {void}
     */
    public renderYAxisMultiLevelLabels(axis: Axis, parent: Element, rect: Rect): void {
        let x: number = 0; let y: number; let padding: number = 10;
        let startX: number;
        let startY: number;
        let startY2: number;
        let endY: number;
        let start: number | Date; let end: number | Date;
        let labelSize: Size; let anchor: string; let isInversed: boolean = axis.isInversed;
        let labelElement: Element; let opposedPosition: boolean = axis.opposedPosition;
        let pathRect: string = ''; let gap: number;
        let interval: number = (axis.rect.height / axis.axisLabelSize) / axis.increment;
        let text: string | string[];
        let position: number = (!isInversed ? axis.rect.height : 0) + axis.rect.y;
        axis.multiLevelLabels.map((multiLevel: MultiLevelLabels, level: number) => {
            startY2 = axis.multiLevelPosition[level].y;
            labelElement = this.heatMap.renderer.createGroup({ id: this.heatMap.element.id + '_YAxisMultiLevelLabel' + level });

            multiLevel.categories.map((categoryLabel: MultiLevelCategories, i: number) => {
                start = typeof categoryLabel.start === 'number' ? categoryLabel.start : Number(new Date(<string>categoryLabel.start));
                end = typeof categoryLabel.end === 'number' ? categoryLabel.end : Number(new Date(<string>categoryLabel.end));
                startY = position + this.calculateLeftPosition(axis, start, categoryLabel.start, axis.rect);
                startX = axis.multiLevelPosition[level].x;
                endY = position + this.calculateWidth(axis, categoryLabel.start, end, axis.rect);
                labelSize = measureText(categoryLabel.text, multiLevel.textStyle);
                gap = ((categoryLabel.maximumTextWidth === null) ? Math.abs(startX) : categoryLabel.maximumTextWidth) - padding;
                let maxWidth: number = Math.abs(startX - (startX - axis.multiLevelSize[level].width - 2 * padding)) / 2 -
                 (labelSize.width / 2);
                x = (axis.opposedPosition ? startX : startX - axis.multiLevelSize[level].width - 2 * padding) + maxWidth;
                y = startY + padding;
                if (multiLevel.overflow !== 'None') {
                    if (multiLevel.overflow === 'Wrap') {
                        text = textWrap(categoryLabel.text, gap, multiLevel.textStyle);
                    } else {
                        text = textTrim(gap, categoryLabel.text, multiLevel.textStyle);
                    }
                }
                if (multiLevel.alignment === 'Center') {
                    y += ((endY - startY) / 2 - (text.length * labelSize.height) / 2);

                } else if (multiLevel.alignment === 'Far') {
                    y = isInversed ? endY - labelSize.height / 2 : y - labelSize.height;
                } else {
                    y = isInversed ? y + labelSize.height / 2 : endY + labelSize.height;
                }
                if (multiLevel.border.width > 0 && multiLevel.border.type !== 'WithoutBorder') {
                    pathRect = this.renderYAxisLabelBorder(level, axis, startX, startY, endY, pathRect, level, labelSize, gap, y);
                }
                let textBasic: TextBasic = new TextBasic(
                    x, y, 'start', categoryLabel.text, 0,
                    'translate(0,0)');
                let options: TextOption = new TextOption(
                    this.heatMap.element.id + '_YAxis_MultiLevel' + level + '_Text' + i, textBasic, multiLevel.textStyle,
                    multiLevel.textStyle.color || this.heatMap.themeStyle.axisLabel);
                options.text = text;
                this.drawSvgCanvas.createText(options, labelElement, options.text);
                if (options.text.indexOf('...') !== -1) {
                    this.heatMap.tooltipCollection.push(
                        new CanvasTooltip(
                            categoryLabel.text,
                            new Rect(x, y - labelSize.height, gap, labelSize.height)));
                }
                if (!this.heatMap.enableCanvasRendering) {
                    parent.appendChild(labelElement);
                }
            });
            if (pathRect !== '') {
                this.createBorderElement(level, axis, pathRect, parent);
                pathRect = '';
            }
        });
        if (!this.heatMap.enableCanvasRendering) {
            parent.appendChild(labelElement);
        }
    }

    /**
     * render x axis multi level labels border
     * @private
     * @return {void}
     */
    private renderYAxisLabelBorder(
        labelIndex: number, axis: Axis, startX: number, startY: number, endY: number,
        path: string, level: number, labelSize: Size, gap: number, y: number): string {
        let padding: number = 20; let path1: number; let path2: number;
        let endX: number = startX - (axis.opposedPosition ? -(axis.multiLevelSize[labelIndex].width + padding) :
            (axis.multiLevelSize[labelIndex].width + padding));
        switch (axis.multiLevelLabels[level].border.type) {
            case 'Rectangle':
                path += 'M' + ' ' + startX + ' ' + startY + ' ' + 'L' + ' ' + endX + ' ' + startY + ' ' +
                    'L' + ' ' + endX + ' ' + endY + ' ' + 'L' + ' ' + startX + ' ' + endY + ' ' + 'L' + ' ' + startX + ' ' + startY + ' ';
                break;
            case 'WithoutTopBorder':
                path += 'M' + ' ' + startX + ' ' + startY + ' ' + 'L' + ' ' + endX + ' ' + startY + ' ' +
                    'L' + ' ' + endX + ' ' + endY + ' ' + 'L' + ' ' + startX + ' ' + endY + ' ';
                break;
            case 'WithoutBottomBorder':
                path += 'M' + ' ' + endX + ' ' + startY + ' ' + 'L' + ' ' + startX + ' ' + startY + ' ' +
                    'L' + ' ' + startX + ' ' + endY + ' ' + 'L' + ' ' + endX + ' ' + endY + ' ';
                break;
            case 'WithoutTopandBottomBorder':
                path += 'M' + ' ' + startX + ' ' + startY + ' ' + 'L' + ' ' + endX + ' ' + startY + ' ' +
                    'M' + ' ' + startX + ' ' + endY + ' ' + 'L' + ' ' + endX + ' ' + endY + ' ';
                break;
            case 'Brace':
            let padding: number = 10;
                path1 = axis.isInversed ? (y - padding - 5) : (y + (labelSize.height) - padding);
                path2 = axis.isInversed ? (y + (labelSize.height) - padding) : (y - padding - 5);
                path += 'M' + ' ' + startX + ' ' + startY + ' ' + 'L' + ' ' + (startX + (endX - startX) / 2) + ' ' + startY + ' ' +
                    'L' + ' ' + (startX + (endX - startX) / 2) + ' ' + path1 + ' ' + 'M' + ' ' + (startX + (endX - startX) / 2) +
                    ' ' + path2 + ' ' + 'L' + ' ' + (startX + (endX - startX) / 2) + ' ' +
                    endY + ' ' + 'L' + ' ' + startX + ' ' + endY + ' ';
                break;
        }
        return path;
    }

    /**
     * create borer element
     * @return {void}
     * @private
     */

    public createBorderElement(borderIndex: number, axis: Axis, path: string, parent: Element): void {
        let canvasTranslate: Int32Array;
        let id: string = axis.orientation === 'Horizontal' ? 'XAxis' : 'YAxis';
        let pathOptions: PathOption = new PathOption(
            this.heatMap.element.id + '_' + id + '_MultiLevel_Rect_' + borderIndex, 'Transparent',
            axis.multiLevelLabels[borderIndex].border.width, axis.multiLevelLabels[borderIndex].border.color,
            1, '', path
        );
        let borderElement: Element = this.heatMap.renderer.drawPath(pathOptions) as HTMLElement;
        if (!this.heatMap.enableCanvasRendering) {
            parent.appendChild(borderElement);
        } else {
            this.heatMap.canvasRenderer.drawPath(pathOptions, canvasTranslate);
        }
    }

    /**
     * calculate left position of border element
     * @private
     */
    public calculateLeftPosition(axis: Axis, start: number, label: number | Date | string, rect: Rect): number {
        let value: number;
        let interval: number;
        if (typeof label === 'number') {
            if (axis.valueType === 'Numeric' && (axis.minimum || axis.maximum)) {
                let min: number = axis.minimum ? <number>axis.minimum : 0;
                start -= min;
            }
            let size: number = axis.orientation === 'Horizontal' ? rect.width : rect.height;
            interval = size / (axis.axisLabelSize * axis.increment);
            value = (axis.isInversed ? -1 : 1) * start * interval;
            value = axis.orientation === 'Horizontal' ? value : -value;
        } else {
            interval = this.calculateNumberOfDays(start, axis, true, rect);
            value = axis.isInversed ? -interval : interval;
            value = axis.orientation === 'Horizontal' ? value : -value;
        }
        return value;
    }

    /**
     * calculate width of border element
     * @private
     */
    public calculateWidth(axis: Axis, label: number | Date | string, end: number, rect: Rect): number {
        let interval: number;
        let value: number;
        if (typeof label === 'number') {
            if (axis.valueType === 'Numeric' && (axis.minimum || axis.maximum)) {
                let min: number = axis.minimum ? <number>axis.minimum : 0;
                end -= min;
            }
            let size: number = axis.orientation === 'Horizontal' ? rect.width : rect.height;
            interval = size / (axis.axisLabelSize * axis.increment);
            value = (axis.isInversed ? -1 : 1) * (end + 1) * interval;
            value = axis.orientation === 'Horizontal' ? value : -value;
        } else {
            interval = this.calculateNumberOfDays(end, axis, false, rect);
            value = interval;
            value = axis.isInversed ? -value : value;
            value = axis.orientation === 'Horizontal' ? value : -value;
        }
        return value;
    }

    private calculateNumberOfDays(date: number, axis: Axis, start: boolean, rect: Rect): number {
        let oneDay: number = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        let oneMinute: number = 60 * 1000;
        let oneHour: number = 60 * 60 * 1000;
        let firstDate: Date;
        let secondDate: Date;
        let labels: (string | number | Date)[] = axis.labelValue;
        let position: number;
        let interval: number = (axis.orientation === 'Horizontal' ? rect.width : rect.height) / axis.axisLabelSize;
        let givenDate: Date = new Date(Number(date));

        let days: number = 0;
        for (let index: number = 0; index < axis.axisLabelSize; index++) {
            firstDate = new Date(Number(labels[index]));
            secondDate = axis.isInversed ? new Date(Number(labels[index - 1])) : new Date(Number(labels[index + 1]));
            if (index === (axis.isInversed ? 0 : axis.axisLabelSize - 1)) {
                secondDate = new Date(Number(labels[index]));
                if (axis.intervalType === 'Hours') {
                    secondDate = new Date(Number(secondDate.setHours(secondDate.getHours() + 1)));
                } else if ((axis.intervalType === 'Minutes')) {
                    secondDate = new Date(Number(secondDate.setMinutes(secondDate.getMinutes() + 1)));
                } else if ((axis.intervalType === 'Days')) {
                    secondDate = new Date(Number(secondDate.setDate(secondDate.getDate() + 1)));
                } else {
                    let numberOfDays: number = axis.intervalType === 'Months' ?
                        new Date(secondDate.getFullYear(), secondDate.getMonth() + 1, 0).getDate() :
                        secondDate.getFullYear() % 4 === 0 ? 366 : 365;
                    secondDate = new Date(Number(secondDate.setDate(secondDate.getDate() + numberOfDays)));
                }
            }
            if (Number(firstDate) <= date && Number(secondDate) >= date) {
                if (axis.intervalType === 'Minutes' || axis.intervalType === 'Hours') {
                    let totalMinutes: number = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneMinute)));
                    let minutesInHours: number = Math.abs((firstDate.getTime() - givenDate.getTime()) / (oneMinute));
                    days = (interval / totalMinutes) * minutesInHours;
                    index = axis.isInversed ? axis.axisLabelSize - 1 - index : index;
                    position = index * interval + days;
                    break;
                } else {
                    let numberOfDays: number = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
                    start ? givenDate.getDate() : givenDate.setDate(givenDate.getDate() + 1);
                    if (numberOfDays !== 0) {
                        days = (interval / numberOfDays) * (Math.abs((firstDate.getTime() - givenDate.getTime()) / (oneDay)));
                    }
                    index = axis.isInversed ? axis.axisLabelSize - 1 - index : index;
                    position = index * interval + days;
                    break;
                }
            }
        }
        return position;
    }
}