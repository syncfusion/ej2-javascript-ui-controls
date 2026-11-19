/**
 * HeatMap Axis-Helper file
 */
import { HeatMap } from '../heatmap';
import { Rect, Size, measureText, TextOption, rotateTextSize, textTrim, CanvasTooltip, PathOption, textWrap, getIsLineBreakLabel } from '../utils/helper';
import { Axis } from './axis';
import { sum, titlePositionX, LineOption, Line, DrawSvgCanvas, TextBasic, titlePositionY, MultiLevelPosition, getTitle } from '../utils/helper';
import { extend, Browser, isNullOrUndefined, SanitizeHtmlHelper } from '@syncfusion/ej2-base';
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
     *
     * @private
     */

    public renderAxes(): void {
        this.initialClipRect = this.heatMap.initialClipRect;
        const heatMap: HeatMap = this.heatMap;
        let axisElement: Element;
        let element: Element;
        if (!heatMap.enableCanvasRendering) {
            axisElement = this.heatMap.renderer.createGroup({ id: heatMap.element.id + 'AxisCollection' });
        }
        const axes: Axis[] = this.heatMap.axisCollections;
        for (let i: number = 0, len: number = axes.length; i < len; i++) {
            const axis: Axis = axes[i as number];
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
        const y: number = this.initialClipRect.y + (!axis.opposedPosition ? this.initialClipRect.height : 0);
        const line: LineOption = new LineOption(
            this.heatMap.element.id + '_XAxisLine',
            new Line(this.initialClipRect.x, y, this.initialClipRect.x + this.initialClipRect.width, y),
            'transparent', 0);
        this.drawSvgCanvas.drawLine(line, parent);
    }

    private drawYAxisLine(parent: Element, axis: Axis): void {
        const x: number = this.initialClipRect.x + ((!axis.opposedPosition) ? 0 : this.initialClipRect.width);
        const line: LineOption = new LineOption(
            this.heatMap.element.id + '_YAxisLine',
            new Line(x, this.initialClipRect.y, x, this.initialClipRect.height + this.initialClipRect.y),
            'transparent', 0);
        this.drawSvgCanvas.drawLine(line, parent);
    }
    private drawXAxisTitle(axis: Axis, parent: Element, rect: Rect): void {
        const titlepadding: number = (axis.textStyle.size === '0px' ? 0 : 10);
        const y: number = rect.y + (!axis.opposedPosition ? (axis.maxLabelSize.height + titlepadding +
            sum(axis.xAxisMultiLabelHeight)) : - (axis.maxLabelSize.height + titlepadding + sum(axis.xAxisMultiLabelHeight)));
        if (axis.title.text) {
            const heatMap: HeatMap = this.heatMap;
            const title: TitleModel = axis.title;
            const axisTitleText: string = this.heatMap.enableHtmlSanitizer ? (SanitizeHtmlHelper.sanitize(title.text)) : title.text;
            const elementSize: Size = measureText(axisTitleText, title.textStyle);
            let padding: number = this.padding;
            const anchor: string = title.textStyle.textAlignment === 'Near' ? 'start' :
                title.textStyle.textAlignment === 'Far' ? 'end' : 'middle';
            padding = axis.opposedPosition ? - (padding + elementSize.height / 4) : (padding + (3 * elementSize.height / 4));
            const options: TextOption = new TextOption(
                heatMap.element.id + '_XAxisTitle',
                new TextBasic(rect.x + titlePositionX(rect.width, 0, 0, title.textStyle), y + padding, anchor, axisTitleText),
                title.textStyle, title.textStyle.color || heatMap.themeStyle.axisTitle);
            this.drawSvgCanvas.createText(options, parent, axisTitleText);
        }
    }

    private drawYAxisTitle(axis: Axis, parent: Element, rect: Rect): void {
        if (axis.title.text) {
            const title: TitleModel = axis.title;
            const heatMap: HeatMap = this.heatMap;
            const labelRotation: number = (axis.opposedPosition) ? 90 : -90;
            const anchor: string = title.textStyle.textAlignment === 'Near' ? 'start' :
                title.textStyle.textAlignment === 'Far' ? 'end' : 'middle';
            let padding: number = 10;
            padding = axis.opposedPosition ? padding : -padding;
            const titlepadding: number = (axis.textStyle.size === '0px' ? 0 : padding);
            const x: number = rect.x + titlepadding + ((axis.opposedPosition) ? axis.maxLabelSize.width + sum(axis.yAxisMultiLabelHeight) :
                -(axis.maxLabelSize.width + sum(axis.yAxisMultiLabelHeight)));
            const y: number = rect.y + titlePositionY(rect, 0, 0, title.textStyle) + (axis.opposedPosition ? this.padding : -this.padding);
            const axisTitleText: string = this.heatMap.enableHtmlSanitizer ? (SanitizeHtmlHelper.sanitize(title.text)) : title.text;
            const options: TextOption = new TextOption(
                heatMap.element.id + '_YAxisTitle',
                new TextBasic(
                    x, y - this.padding, anchor, axisTitleText, labelRotation,
                    'rotate(' + labelRotation + ',' + (x) + ',' + (y) + ')', 'auto'),
                title.textStyle, title.textStyle.color || heatMap.themeStyle.axisTitle);
            if (!this.heatMap.enableCanvasRendering) {
                this.drawSvgCanvas.createText(options, parent, axisTitleText);
            } else {
                this.drawSvgCanvas.canvasDrawText(options, axisTitleText, x, y);
            }
        }
    }

    /**
     * Get the visible labels for both x and y axis
     *
     * @private
     */

    public calculateVisibleLabels(): void {
        const heatmap: HeatMap = this.heatMap;
        let axis: Axis;
        const axisCollection: Axis[] = heatmap.axisCollections;
        const data: DataModel = this.heatMap.dataSourceSettings;
        const processLabels: boolean = !(data && data.isJsonData && data.adaptorType === 'Cell');
        for (let i: number = 0, len: number = axisCollection.length; i < len; i++) {
            axis = axisCollection[i as number];
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
     *
     * @param rect
     * @private
     */

    public measureAxis(rect: Rect): void {
        const heatmap: HeatMap = this.heatMap;
        let axis: Axis;
        const axisCollection: Axis[] = heatmap.axisCollections;
        for (let i: number = axisCollection.length - 1; i >= 0; i--) {
            axis = axisCollection[i as number];
            const padding: number = axis.textStyle.size === '0px' ? 0 : this.padding;
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
     *
     * @param rect
     * @private
     */

    public calculateAxisSize(rect: Rect): void {
        const heatmap: HeatMap = this.heatMap;
        const axisCollection: Axis[] = heatmap.axisCollections;
        for (let i: number = 0, len: number = axisCollection.length; i < len; i++) {
            const axis: Axis = axisCollection[i as number];
            axis.rect = <Rect>extend({}, rect, null, true);
            if (axis.orientation === 'Horizontal' && axis.multiLevelLabels.length !== 0) {
                if (axis.opposedPosition) {
                    axis.rect.y += (axis.angle === 0 || axis.angle === 180 || axis.angle === 360 ? 0 : this.padding);
                    this.heatMap.initialClipRect.y += (axis.angle === 0 || axis.angle === 180 || axis.angle === 360 ? 0 : this.padding);
                }
                rect.height -= (axis.angle === 0 || axis.angle === 180 || axis.angle === 360 ? 0 : this.padding);
            }
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
                const multiPosition: MultiLevelPosition = axis.multiPosition(axis, i);
                axis.multiLevelPosition.push(multiPosition);
            }
        }
    }

    private drawXAxisLabels(axis: Axis, parent: Element, rect: Rect): void {
        const heatMap: HeatMap = this.heatMap; let labels: string[] = axis.axisLabels; let isLineBreak: boolean = false;
        const borderWidth: number = this.heatMap.cellSettings.border.width > 5 ? (this.heatMap.cellSettings.border.width / 2) : 0;
        const interval: number = (rect.width - borderWidth) / axis.axisLabelSize; let compactInterval: number = 0;
        let axisInterval: number = axis.interval ? axis.interval : 1;
        let tempintervel: number = rect.width / (axis.axisLabelSize / axis.axisLabelInterval);
        let temp: number = axis.axisLabelInterval;
        if (tempintervel > 0) {
            while (tempintervel < parseInt(axis.textStyle.size, 10)) {
                temp = temp + 1; tempintervel = rect.width / (axis.axisLabelSize / temp);
            }
        } else { temp = axis.tooltipLabels.length; }
        if (axis.axisLabelInterval < temp) {
            compactInterval = temp; labels = axis.tooltipLabels;
            axisInterval = temp;
        }
        let y: number; let padding: number = 10; let lableStrtX: number = rect.x + (!axis.isInversed ? 0 : rect.width);
        let labelPadding: number; let angle: number = axis.angle;
        padding = this.padding; let labelElement: Element; let borderElement: Element;
        if (!heatMap.enableCanvasRendering) {
            labelElement = this.heatMap.renderer.createGroup({ id: heatMap.element.id + 'XAxisLabels' });
            borderElement = this.heatMap.renderer.createGroup({ id: heatMap.element.id + 'XAxisLabelBorder' });
        }
        if (axis.isInversed && axis.labelIntersectAction === 'MultipleRows') { axis.multipleRow.reverse(); }
        isLineBreak = getIsLineBreakLabel(labels);
        for (let i: number = 0, len: number = labels.length; i < len; i++) {
            const lableRect: Rect = new Rect(lableStrtX, rect.y, interval, rect.height);
            let elementSize: Size = measureText(labels[i as number], axis.textStyle);
            let label: string = (axis.textStyle.textOverflow !== 'Wrap' && !(isLineBreak) && axis.textStyle.textOverflow !== 'Trim' && axis.labelIntersectAction === 'Trim' && (axis.isIntersect || elementSize.width > interval)) ? axis.valueType !== 'DateTime' ||
                axis.showLabelOn === 'None' ? textTrim(interval * axisInterval, labels[i as number], axis.textStyle) :
                textTrim(axis.dateTimeAxisLabelInterval[i as number] * interval, labels[i as number], axis.textStyle) : labels[i as number];
            label = ((axis.enableTrim || axis.textStyle.textOverflow === 'Trim') && !isLineBreak) ? textTrim((axis.textStyle.textOverflow === 'Trim' ? interval - (axis.border.width / 2) : axis.maxLabelLength), labels[i as number], axis.textStyle) : label;
            if (heatMap.enableHtmlSanitizer) {
                label = SanitizeHtmlHelper.sanitize(label);
            }
            let wrappedLabel: string = <string>label;
            let wrappedlabels: string[] = [];
            let rotateSize: Size = new Size(0, 0);
            if ((axis.textStyle.textOverflow === 'Wrap' || isLineBreak) && !axis.enableTrim) {
                wrappedlabels = this.getLabels(wrappedLabel, interval - (axis.border.width / 2), axis, isLineBreak);
                wrappedLabel = this.getMaxLabel(wrappedlabels, axis);
            } else {
                if (isLineBreak && axis.enableTrim) {
                    wrappedlabels = this.getLabels(wrappedLabel, interval - (axis.border.width / 2), axis, isLineBreak);
                    wrappedLabel = textTrim(axis.maxLabelLength, wrappedlabels[0], axis.textStyle);
                    wrappedLabel = (label.indexOf('<br>') !== -1 || label.indexOf('<br/>') !== -1) && wrappedLabel.indexOf('...') === -1 ? wrappedLabel + '...' : wrappedLabel;
                    wrappedlabels = [];
                }
                wrappedlabels.push(wrappedLabel);
            }
            elementSize = measureText(wrappedLabel, axis.textStyle); let transform: string;
            labelPadding = (axis.opposedPosition) ? -(padding) : (padding + ((angle % 360) === 0 ? (elementSize.height / 2) : 0));
            elementSize.width = axis.isInversed ? (elementSize.width > interval ? interval : elementSize.width) : elementSize.width;
            let x: number = lableRect.x + ((!axis.isInversed) ?
                (lableRect.width / 2) - (elementSize.width / 2) : -((lableRect.width / 2) + (elementSize.width / 2)));
            if (axis.textStyle.textAlignment === 'Near') {
                x = lableRect.x - ((!axis.isInversed) ? 0 : lableRect.width);
            } else if (axis.textStyle.textAlignment === 'Far') {
                x = lableRect.x + ((!axis.isInversed) ?
                    (lableRect.width - elementSize.width) : -(elementSize.width));
            }
            if (axis.labelIntersectAction === 'Trim') {
                x = (!axis.isInversed) ? (x >= lableRect.x ? x : lableRect.x) : (x > (lableStrtX - interval) ? x : (lableStrtX - interval));
            } else if (angle % 180 === 0) {
                x = x < rect.x ? rect.x : x;
                x = ((x + elementSize.width) > (rect.x + rect.width)) ? (rect.x + rect.width - elementSize.width) : x;
            }
            if ((axis.textStyle.textOverflow === 'Wrap' || isLineBreak) && !axis.isInversed){
                x = x < lableRect.x ? lableRect.x : x;
            }
            if (axis.labelIntersectAction === 'MultipleRows' && axis.textStyle.textOverflow !== 'Wrap' && axis.textStyle.textOverflow !== 'Trim' && axis.labelRotation === 0) {
                const a: number = axis.opposedPosition ? -(axis.multipleRow[i as number].index - 1) :
                    (axis.multipleRow[i as number].index - 1);
                if (axis.multipleRow[i as number].index > 1) {
                    y = rect.y + labelPadding + (elementSize.height * a) + (axis.opposedPosition ?
                        -(((elementSize.height * 0.5) / 2) * axis.multipleRow[i as number].index) :
                        (((elementSize.height * 0.5) / 2) * axis.multipleRow[i as number].index));
                } else {
                    y = rect.y + labelPadding + (axis.opposedPosition ? - ((elementSize.height * 0.5) / 2) :
                        ((elementSize.height * 0.5) / 2));
                }
            } else { y = rect.y + ((axis.textStyle.textOverflow === 'Wrap' || isLineBreak) && axis.opposedPosition && angle % 360 === 0 ? - (axis.farSizes.length >= 1 ? axis.farSizes[1] : 0) + padding : labelPadding); }
            this.drawXAxisBorder(axis, borderElement, axis.rect, x, elementSize.width, i);
            x = (axis.textStyle.textAlignment === 'Center' && wrappedlabels.length > 1) ? x + (elementSize.width / 2) : axis.textStyle.textAlignment === 'Near' ? x + padding / 2 : axis.textStyle.textAlignment === 'Far' ? x - padding / 2 : x;
            if (angle % 360 !== 0) {
                angle = (angle > 360) ? angle % 360 : angle;
                rotateSize = rotateTextSize(axis.textStyle, wrappedlabels, angle);
                /* eslint-disable max-len */
                x = lableRect.x + (axis.isInversed ? -(lableRect.width / 2) : (lableRect.width / 2)) + (angle === 90 ? (elementSize.height * ((wrappedlabels.length - 1) / 2)) : angle === 270 ? -(elementSize.height * (wrappedlabels.length - 1) / 2) : 0);
                /* eslint-disable max-len */
                y = y + (axis.opposedPosition ? (((axis.textStyle.textOverflow === 'Wrap' || isLineBreak) && !axis.enableTrim ? (((angle % 360) === 180) ? padding : 0) + (rotateSize.height / 2) - (axis.farSizes.length >= 1 ? axis.farSizes[1] : 0) : -(rotateSize.height / 2)) + (axis.border.width / 2)) :
                    (((angle % 360) === 0) ? 0 : ((angle % 360) === 180) ? (rotateSize.height / 2) - (axis.border.width) + padding : (rotateSize.height / 2) - (axis.border.width)));
                if (wrappedlabels.length > 1) {
                    y = y - ((angle > 0 && angle < 80) || (angle > 300 && angle < 360) ? elementSize.height * ((wrappedlabels.length - 1) / 2) : (angle > 120 && angle < 240) && angle !== 180 &&  wrappedlabels.length > 2 ? -(elementSize.height * ((wrappedlabels.length - 2) / 2)) : 0);
                    x = x + ((angle > 0 && angle < 70) ? elementSize.height * ((wrappedlabels.length - 1) / 2) : 0);
                }
                transform = 'rotate(' + angle + ',' + x + ',' + y + ')';
            }
            if (this.heatMap.cellSettings.border.width > 5 && axis.opposedPosition) {
                y = y - (this.heatMap.cellSettings.border.width / 2);
            }
            if (this.heatMap.yAxis.opposedPosition && this.heatMap.cellSettings.border.width > 5) {
                x = x + (this.heatMap.cellSettings.border.width / 2);
            }
            if (this.heatMap.xAxis.isInversed && this.heatMap.cellSettings.border.width > 5) {
                x = x - (this.heatMap.cellSettings.border.width / 2);
            }
            if (elementSize.width >= interval){
                x = axis.border.width ? x + (axis.border.width / 2) : x;
            }
            x = axis.textStyle.textAlignment === 'Near' ? x + (axis.border.width / 2) : axis.textStyle.textAlignment === 'Far' ?
                x - (axis.border.width / 2) : x;
            x = (angle % 360 === 0) && axis.textStyle.textAlignment === 'Center' && elementSize.width > interval ? lableRect.x + ((!axis.isInversed) ?
                (elementSize.width / 2) : -((elementSize.width / 2))) : x;
            const options: TextOption = new TextOption(
                heatMap.element.id + '_XAxis_Label' + i,
                new TextBasic(x, y, (angle % 360 === 0) ? (axis.textStyle.textAlignment === 'Center' && wrappedlabels.length > 1) ? 'middle' : 'start' : 'middle', label, angle, transform), axis.textStyle,
                axis.textStyle.color || heatMap.themeStyle.axisLabel
            );
            /* eslint-disable max-len */
            options.text = isLineBreak ? wrappedlabels : getTitle(options.text as string, axis.textStyle, lableRect.width - (axis.border.width / 2));
            if (angle !== 0 && this.heatMap.enableCanvasRendering) {
                this.drawSvgCanvas.canvasDrawText(options, null, null, null, wrappedlabels, elementSize.height, true);
            } else {
                if (axis.textStyle.textOverflow === 'Wrap' || isLineBreak) {
                    this.drawSvgCanvas.createWrapText(options, axis.textStyle, labelElement);
                } else {
                    this.drawSvgCanvas.createText(options, labelElement, label);
                }
            }
            if (compactInterval === 0) {
                const labelInterval: number = (axis.valueType === 'DateTime' && axis.showLabelOn !== 'None') ?
                    axis.dateTimeAxisLabelInterval[i as number] : axis.axisLabelInterval;
                lableStrtX = lableStrtX + (!axis.isInversed ? (labelInterval * interval) :
                    -(labelInterval * interval));
            } else {
                lableStrtX = lableStrtX + (!axis.isInversed ? (compactInterval * interval) : -(compactInterval * interval));
            }
            if (wrappedLabel.indexOf('...') !== -1) {
                const xValue: number = axis.angle % 360 !== 0 ? x - (rotateSize.width / 2) : (axis.textStyle.textAlignment === 'Center' ? x - (elementSize.width / 2) : x);
                const yValue: number = y - (axis.angle % 360 !== 0 ? (rotateSize.height / 2) : elementSize.height);
                label = labels[i as number].indexOf('<br>') !== -1 || labels[i as number].indexOf('<br/>') !== -1 ? labels[i as number].replace(/<br\s*\/?>/g, ' ') : labels[i as number];
                this.heatMap.tooltipCollection.push(
                    new CanvasTooltip(
                        label,
                        new Rect(xValue, yValue, axis.angle % 360 !== 0 ? rotateSize.width : elementSize.width, axis.angle % 360 !== 0 ? rotateSize.height : elementSize.height * wrappedlabels.length)));
            }
            if (compactInterval !== 0) { i = i + (compactInterval - 1); }
        }
        if (!heatMap.enableCanvasRendering) {
            parent.appendChild(labelElement);
            parent.appendChild(borderElement);
        }
    }

    private getWrappedLabels(wrappedLabel: string, labelInterval: number, axis: Axis): string[]{
        const wrappedlabels: string[] = wrappedLabel.split(/<br\s*\/?>/, -1);
        for (let i: number = 0 ; i < wrappedlabels.length; i++)
        {
            const label: string = wrappedlabels[i as number];
            wrappedlabels[i as number] = textTrim(labelInterval, label, axis.textStyle);
        }
        return wrappedlabels;
    }

    private getMaxLabel(wrappedlabels: string[], axis: Axis): string{
        let label: string = '';
        let labelWidth: number = 0;
        let wrappedlabelSize: Size = new Size(0, 0);
        for (let index: number = 0; index < wrappedlabels.length; index++){
            wrappedlabelSize = measureText(wrappedlabels[index as number], axis.textStyle);
            if (wrappedlabelSize.width > labelWidth){
                labelWidth = wrappedlabelSize.width;
                label = wrappedlabels[index as number];
            }
        }
        return label;
    }

    private getLabels(label: string, labelInterval: number, axis: Axis, isLineBreak: boolean): string[]{
        let wrappedlabels: string[] = [];
        if (isLineBreak){
            wrappedlabels = this.getWrappedLabels(label, labelInterval, axis);
        } else {
            wrappedlabels = textWrap(label, labelInterval, axis.textStyle);
        }
        return wrappedlabels;
    }
    private drawYAxisLabels(axis: Axis, parent: Element, rect: Rect): void {
        const heatMap: HeatMap = this.heatMap;
        let labels: string[] = axis.axisLabels;
        const interval: number = rect.height / axis.axisLabelSize;
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
        const labelPadding: number = 5;
        let lableStartY: number = rect.y + (axis.isInversed ? 0 : rect.height);
        let anchor: string = axis.opposedPosition ? 'start' : 'end';
        padding = axis.opposedPosition ? padding : -padding;
        let labelElement: Element; let borderElement: Element;
        if (!heatMap.enableCanvasRendering) {
            labelElement = this.heatMap.renderer.createGroup({ id: heatMap.element.id + 'YAxisLabels' });
            borderElement = this.heatMap.renderer.createGroup({ id: heatMap.element.id + 'YAxisLabelBorder' });
        }
        const isLineBreak: boolean = getIsLineBreakLabel(labels);
        for (let i: number = 0, len: number = labels.length; i < len; i++) {
            const labelRect: Rect = new Rect(rect.x, lableStartY, rect.width, interval);
            let position: number = axis.isInversed ? labelRect.height / 2 : -(labelRect.height / 2); //titlePositionY(lableRect, 0, 0, axis.textStyle);
            const axisWidth: number = this.heatMap.cellSettings.border.width >= 20 ? (this.heatMap.cellSettings.border.width / 2) : 0;
            const indexValue: number = this.heatMap.cellSettings.border.width > 5 ?
                (((this.heatMap.cellSettings.border.width / 2) / len) * (axis.isInversed ? (i) : (len - i))) : 0;
            label = (axis.enableTrim || axis.textStyle.textOverflow === 'Trim') && !isLineBreak ? textTrim(axis.maxLabelLength, labels[i as number], axis.textStyle) : labels[i as number];
            if (heatMap.enableHtmlSanitizer) {
                label = SanitizeHtmlHelper.sanitize(label);
            }
            const elementSize: Size = measureText(label, axis.textStyle);
            let labelLength: number = 1;
            let wrappedLabel: string[] = [];
            let rotateSize: Size = new Size(0, 0);
            if ((axis.textStyle.textOverflow === 'Wrap' || isLineBreak) && !axis.enableTrim) {
                wrappedLabel = this.getLabels(label, axis.maxLabelLength, axis, isLineBreak);
                for (let index: number = 0; index < wrappedLabel.length; index++){
                    if ((elementSize.height * wrappedLabel.length) > (tempintervel + (labelPadding)) && wrappedLabel.length > 0 && (axis.angle !== 90 && axis.angle !== 270)){
                        wrappedLabel.pop();
                        if (wrappedLabel.length > 0) {
                            wrappedLabel[wrappedLabel.length - 1] = wrappedLabel[wrappedLabel.length - 1] + '...';
                            /* eslint-disable max-len */
                            wrappedLabel[wrappedLabel.length - 1] = textTrim(axis.maxLabelLength, wrappedLabel[wrappedLabel.length - 1], axis.textStyle);
                        }
                    }
                }
                if (!(isLineBreak))
                {
                    label = wrappedLabel.length !== 0 ? '' : label;
                    for (let labelIndex: number = 0; labelIndex < wrappedLabel.length; labelIndex++){
                        label = isNullOrUndefined(label) ? wrappedLabel[labelIndex as number] : label + ' ' + wrappedLabel[labelIndex as number];
                    }
                }
                labelLength = wrappedLabel.length;
            } else {
                if (isLineBreak && axis.enableTrim) {
                    wrappedLabel = this.getLabels(label, axis.maxLabelLength, axis, isLineBreak);
                    const trimmedLabel: string = textTrim(axis.maxLabelLength, wrappedLabel[0], axis.textStyle);
                    label = (label.indexOf('<br>') !== -1 || label.indexOf('<br/>') !== -1) && trimmedLabel.indexOf('...') === -1 ? trimmedLabel + '...' : trimmedLabel;
                    wrappedLabel = [];
                }
                wrappedLabel.push(label);
            }
            let x: number = labelRect.x + padding + (axis.opposedPosition ? (axis.textStyle.textOverflow === 'Wrap' && axis.angle % 360 !== 0 ? labelLength * (elementSize.height / 2) : 0) + axisWidth : -axisWidth);
            if (axis.textStyle.textAlignment === 'Far' && axis.angle % 360 === 0) {
                /* eslint-disable max-len */
                position = axis.isInversed ? labelRect.height - (labelLength > 1 ? (elementSize.height * labelLength) - (elementSize.height / 2) : (elementSize.height / 2)) :
                    - (labelLength > 1 ? (elementSize.height * labelLength) - (elementSize.height / 2) : (elementSize.height / 2));
            } else if (axis.textStyle.textAlignment === 'Near' && axis.angle % 360 === 0) {
                /* eslint-disable max-len */
                position = (axis.isInversed ? elementSize.height / 2 : ((elementSize.height / 2) - labelRect.height)) + (axis.border.width / 2);
            }
            let y: number = (labelRect.y - indexValue) + position - ((labelLength > 1 && axis.textStyle.textAlignment === 'Center') || (axis.angle % 360 !== 0 && axis.opposedPosition) ? (((elementSize.height * labelLength) / 2) - (elementSize.height / 2)) : 0);
            if (axis.angle % 360 !== 0) {
                anchor = 'middle';
                axis.angle = (axis.angle > 360) ? axis.angle % 360 : axis.angle;
                rotateSize = rotateTextSize(axis.textStyle, wrappedLabel, axis.angle);
                x = labelRect.x + (axis.opposedPosition ? (rotateSize.width / 2 + padding) : -(rotateSize.width / 2 - padding)) + (axis.angle === 90 ? (elementSize.height * ((wrappedLabel.length - 1) / 2)) : axis.angle === 270 ? -(elementSize.height * (wrappedLabel.length - 1) / 2) : 0);
                y = labelRect.y + (axis.isInversed ? (labelRect.height / 2) : (-labelRect.height / 2)) + (axis.angle === 180 ? (elementSize.height * ((wrappedLabel.length - 1) / 2)) : 0);
                if (wrappedLabel.length > 1){
                    const value: number = elementSize.height * ((wrappedLabel.length - 1) / 2);
                    y = y - ((axis.angle > 0 && axis.angle < 60) || (axis.angle > 290 && axis.angle < 360) ? value : (axis.angle > 115 && axis.angle < 240) && axis.angle !== 180 ? -value : 0);
                    x = x + (axis.angle > 20 && axis.angle < 160 && axis.angle !== 90 ? value : axis.angle > 200 && axis.angle < 330 && axis.angle !== 270 ? - value - (axis.angle > 200 && axis.angle < 240 && !axis.opposedPosition && wrappedLabel.length > 2 ? -(elementSize.height * ((wrappedLabel.length - 2) / 2)) : 0) :
                        (axis.angle >= 330 && axis.angle < 350 ? - value / 2 : 0));
                }
            }
            const options: TextOption = new TextOption(
                heatMap.element.id + '_YAxis_Label' + i,
                new TextBasic(x, y, anchor, label, axis.angle, 'rotate(' + axis.angle + ',' + (x) + ',' + (y) + ')', 'middle'),
                axis.textStyle, axis.textStyle.color || heatMap.themeStyle.axisLabel);
            if (Browser.isIE && !heatMap.enableCanvasRendering) {
                options.dy = '1ex';
            }
            options.text = isLineBreak ? wrappedLabel : getTitle(options.text as string, axis.textStyle, axis.maxLabelLength);
            if (axis.angle !== 0 && this.heatMap.enableCanvasRendering) {
                this.drawSvgCanvas.canvasDrawText(options, null, null, null, wrappedLabel, elementSize.height, true);
            } else {
                if (axis.textStyle.textOverflow === 'Wrap' || isLineBreak) {
                    this.drawSvgCanvas.createWrapText(options, axis.textStyle, labelElement);
                } else {
                    this.drawSvgCanvas.createText(options, labelElement, label);
                }
            }
            label = this.getMaxLabel(wrappedLabel, axis);
            if (label.indexOf('...') !== -1) {
                const xValue: number = axis.opposedPosition ? x : (x - ( axis.angle % 360 !== 0 ? (rotateSize.width / 2) : elementSize.width));
                const yValue: number = y - (axis.angle % 360 !== 0 ? (rotateSize.height / 2) : elementSize.height);
                label = labels[i as number].indexOf('<br>') !== -1 || labels[i as number].indexOf('<br/>') !== -1 ? labels[i as number].replace(/<br\s*\/?>/g, ' ') : labels[i as number];
                this.heatMap.tooltipCollection.push(
                    new CanvasTooltip(
                        label,
                        new Rect(
                            xValue, yValue, (axis.angle % 360 !== 0 ? rotateSize.width : elementSize.width),
                            (axis.angle % 360 !== 0 ? rotateSize.height : elementSize.height * wrappedLabel.length))));
            }
            if (compactInterval === 0) {
                const labelInterval: number = (axis.valueType === 'DateTime' && axis.showLabelOn !== 'None') ?
                    axis.dateTimeAxisLabelInterval[i as number] : axis.axisLabelInterval;
                lableStartY = lableStartY + (axis.isInversed ? (labelInterval * interval) :
                    -(labelInterval * interval));
            } else {
                lableStartY = lableStartY + (axis.isInversed ? (compactInterval * interval) : -(compactInterval * interval));
                i = i + (compactInterval - 1);
            }
            this.drawYAxisBorder(axis, borderElement, axis.rect, y, elementSize.height, i);
        }
        if (!heatMap.enableCanvasRendering) {
            parent.appendChild(labelElement);
            parent.appendChild(borderElement);
        }
    }

    private drawXAxisBorder(axis: Axis, parent: Element, rect: Rect, lableX: number, width: number, index: number): void {
        const interval: number = rect.width / axis.axisLabelSize;
        let path: string = ''; const padding: number = 10;
        const axisInterval: number = axis.interval ? axis.interval : 1;
        const startX: number = axis.isInversed ? rect.x + rect.width - (interval * index * axisInterval) :
            rect.x + (interval * index * axisInterval);
        const startY: number = rect.y;
        let endX: number; let endY: number;
        endY = startY + (axis.opposedPosition ? -(axis.maxLabelSize.height + padding) : axis.maxLabelSize.height + padding);
        // eslint-disable-next-line prefer-const
        endX = axis.isInversed ? startX - interval : startX + interval;
        let endY1: number = axis.isInversed ? (lableX + width + padding) : (lableX - padding);
        let endY2: number = axis.isInversed ? (lableX - padding) : (lableX + width + padding);
        endY2 = axis.textStyle.textAlignment === 'Near' && axis.isInversed ? endY2 + padding : axis.textStyle.textAlignment === 'Far' && !axis.isInversed ? endY2 - padding : endY2;
        endY1 = axis.textStyle.textAlignment === 'Far' && axis.isInversed ? endY1 - padding : axis.textStyle.textAlignment === 'Near' && !axis.isInversed ? endY1 + padding : endY1;
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
            endY = startY + ((endY - startY) / 2) + (axis.opposedPosition ? 0 : 5);
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
        const interval: number = rect.height / axis.axisLabelSize;
        let path: string = ''; const padding: number = 20;
        const axisInterval: number = axis.interval ? axis.interval : 1;
        const startX: number = rect.x;
        const startY: number = axis.isInversed ? rect.y + (interval * index * axisInterval) :
            rect.y + rect.height - (interval * index * axisInterval);
        let endX: number; let endY: number;
        endX = startX + (!axis.opposedPosition ? -(axis.maxLabelSize.width + padding) : axis.maxLabelSize.width + padding);
        // eslint-disable-next-line prefer-const
        endY = axis.isInversed ? startY + interval : startY - interval;
        const endY1: number = axis.isInversed ? lableY - height / 2 : lableY + height / 2;
        const endY2: number = axis.isInversed ? lableY + height / 2 : lableY - height / 2;
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
     *
     * @returns {void}
     * @private
     */

    private createAxisBorderElement(axis: Axis, labelBorder: string, parent: Element, index: number): void {
        let canvasTranslate: Int32Array;
        const id: string = axis.orientation === 'Horizontal' ? '_XAxis_Label_Border' : '_YAxis_Label_Border';
        const pathOptions: PathOption = new PathOption(
            this.heatMap.element.id + id + index, 'transparent', axis.border.width, axis.border.color, 1, 'none', labelBorder);
        if (!this.heatMap.enableCanvasRendering) {
            const borderElement: Element = this.heatMap.renderer.drawPath(pathOptions);
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
        if ( axis.orientation === 'Horizontal' ) {
            this.renderXAxisMultiLevelLabels(axis, element) ; }
        else{
            this.renderYAxisMultiLevelLabels(axis, element); }
        if (!this.heatMap.enableCanvasRendering) {
            parent.appendChild(element);
        }
    }

    /**
     * render x axis multi level labels
     *
     * @private
     * @returns {void}
     */

    public renderXAxisMultiLevelLabels(axis: Axis, parent: Element): void {
        let x: number = 0; let y: number; const padding: number = 10;
        let startX: number; let startY: number;
        let endX: number = 0; let tooltip: boolean;
        let start: number | Date; let end: number | Date;
        let labelSize: Size; let anchor: string; const isInversed: boolean = axis.isInversed;
        let labelElement: Element; const opposedPosition: boolean = axis.opposedPosition;
        let pathRect: string = ''; let gap: number;
        let textLength: number;
        const position: number = (isInversed ? axis.rect.width : 0) + axis.rect.x;
        axis.multiLevelLabels.map((multiLevel: MultiLevelLabels, level: number) => {
            labelElement = this.heatMap.renderer.createGroup({ id: this.heatMap.element.id + '_XAxisMultiLevelLabel' + level });
            multiLevel.categories.map((categoryLabel: MultiLevelCategories, i: number) => {
                if (!isNullOrUndefined(categoryLabel.start) && !isNullOrUndefined(categoryLabel.end)) {
                    if (this.heatMap.theme === 'Tailwind' || this.heatMap.theme === 'TailwindDark') {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (multiLevel as any).setProperties({ textStyle: { fontFamily: 'Inter' } }, true);
                    }
                    if (this.heatMap.theme === 'Tailwind3' || this.heatMap.theme === 'Tailwind3Dark') {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (multiLevel as any).setProperties({ textStyle: { color: this.heatMap.themeStyle.axisLabel, fontFamily: 'Inter', fontWeight: '400' } }, true);
                    }
                    if (this.heatMap.theme === 'Material3' || this.heatMap.theme === 'Material3Dark') {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (multiLevel as any).setProperties({ textStyle: { fontFamily: 'Roboto' } }, true);
                    }
                    if (this.heatMap.theme === 'Fluent' || this.heatMap.theme === 'FluentDark') {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (multiLevel as any).setProperties({ textStyle: { fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica Neue", sans-serif' } }, true);
                    }
                    if (this.heatMap.theme === 'Fluent2') {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (multiLevel as any).setProperties({ textStyle: { color: '#242424', size: '12px', fontWeight: '400', fontFamily: 'Segoe UI' } }, true);
                    }
                    if (this.heatMap.theme === 'Fluent2Dark' || this.heatMap.theme === 'Fluent2HighContrast') {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (multiLevel as any).setProperties({ textStyle: { color: '#FFFFFF', size: '12px', fontWeight: '400', fontFamily: 'Segoe UI' } }, true);
                    }
                    if (this.heatMap.theme === 'Bootstrap5') {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (multiLevel as any).setProperties({ textStyle: { color: '#212529', size: '12px', fontWeight: '400', fontFamily: 'Segoe UI' } }, true);
                    }
                    if (this.heatMap.theme === 'Bootstrap5Dark') {
                        //eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (multiLevel as any).setProperties({ textStyle: { color: '#DEE2E6', size: '12px', fontWeight: '400', fontFamily: 'Segoe UI'} }, true );
                    }
                    tooltip = false;
                    start = typeof categoryLabel.start === 'number' ? categoryLabel.start : Number(new Date(<string>categoryLabel.start));
                    end = typeof categoryLabel.end === 'number' ? categoryLabel.end : Number(new Date(<string>categoryLabel.end));
                    startX = position + this.calculateLeftPosition(axis, start, categoryLabel.start, axis.rect);
                    startY = axis.multiLevelPosition[level as number].y;
                    endX = position + this.calculateWidth(axis, categoryLabel.end, end, axis.rect);
                    const text: string = this.heatMap.enableHtmlSanitizer ? SanitizeHtmlHelper.sanitize(categoryLabel.text) : categoryLabel.text;
                    labelSize = measureText(text, multiLevel.textStyle);
                    gap = ((categoryLabel.maximumTextWidth === null) ? Math.abs(endX - startX) : categoryLabel.maximumTextWidth) - padding;
                    y = startY + (opposedPosition ? -((axis.xAxisMultiLabelHeight[level as number] - labelSize.height)) : labelSize.height);
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
                    const textBasic: TextBasic = new TextBasic(
                        x, y, anchor, text, 0,
                        'translate(0,0)');

                    const options: TextOption = new TextOption(
                        this.heatMap.element.id + '_XAxis_MultiLevel' + level + '_Text' + i, textBasic, multiLevel.textStyle,
                        multiLevel.textStyle.color || this.heatMap.themeStyle.axisLabel);
                    if (multiLevel.overflow === 'Wrap') {
                        options.text = textWrap(text, gap, multiLevel.textStyle);
                        textLength = options.text.length;
                    } else if (multiLevel.overflow === 'Trim') {
                        options.text = textTrim(gap, text, multiLevel.textStyle);
                        textLength = 1;
                    }
                    if (multiLevel.overflow === 'Wrap' && options.text.length > 1) {
                        this.drawSvgCanvas.createWrapText(options, multiLevel.textStyle, labelElement);
                        for (let i: number = 0; i < options.text.length; i++) {
                            if (options.text[i as number].indexOf('...') !== -1) {
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
     *
     * @private
     * @returns {void}
     */

    private renderXAxisLabelBorder(
        labelIndex: number, axis: Axis, startX: number, startY: number, endX: number,
        path: string, level: number, labelSize: Size, gap: number, x: number): string {
        let path1: number; let path2: number;
        const endY: number = startY + (axis.opposedPosition ? - (axis.xAxisMultiLabelHeight[labelIndex as number]) :
            axis.xAxisMultiLabelHeight[labelIndex as number]);
        const padding: number = 3;
        switch (axis.multiLevelLabels[level as number].border.type) {
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
     *
     * @private
     * @returns {void}
     */

    public renderYAxisMultiLevelLabels(axis: Axis, parent: Element): void {
        let x: number = 0; let y: number; const padding: number = 10;
        let startX: number;
        let startY: number;
        let endY: number;
        let start: number | Date; let end: number | Date;
        let labelSize: Size; const isInversed: boolean = axis.isInversed;
        let labelElement: Element;
        let pathRect: string = ''; let gap: number;
        let text: string | string[];
        const position: number = (!isInversed ? axis.rect.height : 0) + axis.rect.y;
        axis.multiLevelLabels.map((multiLevel: MultiLevelLabels, level: number) => {
            startY = axis.multiLevelPosition[level as number].y;
            labelElement = this.heatMap.renderer.createGroup({ id: this.heatMap.element.id + '_YAxisMultiLevelLabel' + level });
            multiLevel.categories.map((categoryLabel: MultiLevelCategories, i: number) => {
                if (this.heatMap.theme === 'Tailwind' || this.heatMap.theme === 'TailwindDark') {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (multiLevel as any).setProperties({ textStyle : { fontFamily: 'Inter' }}, true);
                }
                if (this.heatMap.theme === 'Tailwind3' || this.heatMap.theme === 'Tailwind3Dark') {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (multiLevel as any).setProperties({ textStyle : { color: this.heatMap.themeStyle.axisLabel, fontFamily: 'Inter', fontWeight: '400' }}, true);
                }
                if (this.heatMap.theme === 'Material3' || this.heatMap.theme === 'Material3Dark') {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (multiLevel as any).setProperties({ textStyle : { fontFamily: 'Roboto' }}, true);
                }
                if (this.heatMap.theme === 'Bootstrap5' || this.heatMap.theme === 'Bootstrap5Dark') {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (multiLevel as any).setProperties({ textStyle : { fontFamily: 'Segoe UI' }}, true);
                }
                if (this.heatMap.theme === 'Fluent2') {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (multiLevel as any).setProperties({ textStyle : { color: '#242424', size: '12px', fontWeight: '400', fontFamily: 'Segoe UI' }}, true);
                }
                if (this.heatMap.theme === 'Fluent2Dark' || this.heatMap.theme === 'Fluent2HighContrast') {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (multiLevel as any).setProperties({ textStyle : { color: '#FFFFFF', size: '12px', fontWeight: '400', fontFamily: 'Segoe UI' }}, true);
                }
                start = typeof categoryLabel.start === 'number' ? categoryLabel.start : Number(new Date(<string>categoryLabel.start));
                end = typeof categoryLabel.end === 'number' ? categoryLabel.end : Number(new Date(<string>categoryLabel.end));
                startY = position + this.calculateLeftPosition(axis, start, categoryLabel.start, axis.rect);
                startX = axis.multiLevelPosition[level as number].x;
                endY = position + this.calculateWidth(axis, categoryLabel.start, end, axis.rect);
                const categoryText: string = this.heatMap.enableHtmlSanitizer ? SanitizeHtmlHelper.sanitize(categoryLabel.text) : categoryLabel.text;
                labelSize = measureText(categoryText, multiLevel.textStyle);
                gap = ((categoryLabel.maximumTextWidth === null) ? Math.abs(startX) : categoryLabel.maximumTextWidth) - padding;
                const maxWidth: number = Math.abs(startX - (startX - axis.multiLevelSize[level as number].width - 2 * padding)) / 2 -
                    (labelSize.width / 2);
                x = (axis.opposedPosition ? startX : startX - axis.multiLevelSize[level as number].width - 2 * padding) + maxWidth;
                y = startY + padding;
                if (multiLevel.overflow !== 'None') {
                    if (multiLevel.overflow === 'Wrap') {
                        text = textWrap(categoryText, gap, multiLevel.textStyle);
                    } else {
                        text = textTrim(gap, categoryText, multiLevel.textStyle);
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
                const textBasic: TextBasic = new TextBasic(
                    x, y, 'start', this.heatMap.enableHtmlSanitizer ? SanitizeHtmlHelper.sanitize(categoryLabel.text) : categoryLabel.text, 0,
                    'translate(0,0)');
                const options: TextOption = new TextOption(
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
     *
     * @private
     * @returns {void}
     */

    private renderYAxisLabelBorder(
        labelIndex: number, axis: Axis, startX: number, startY: number, endY: number,
        path: string, level: number, labelSize: Size, gap: number, y: number): string {
        let padding: number = 20; let path1: number; let path2: number;
        const endX: number = startX - (axis.opposedPosition ? -(axis.multiLevelSize[labelIndex as number].width + padding) :
            (axis.multiLevelSize[labelIndex as number].width + padding));
        switch (axis.multiLevelLabels[level as number].border.type) {
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
            padding = 10;
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
     *
     * @returns {void}
     * @private
     */

    public createBorderElement(borderIndex: number, axis: Axis, path: string, parent: Element): void {
        let canvasTranslate: Int32Array;
        const id: string = axis.orientation === 'Horizontal' ? 'XAxis' : 'YAxis';
        const pathOptions: PathOption = new PathOption(
            this.heatMap.element.id + '_' + id + '_MultiLevel_Rect_' + borderIndex, 'Transparent',
            axis.multiLevelLabels[borderIndex as number].border.width, axis.multiLevelLabels[borderIndex as number].border.color,
            1, '', path
        );
        const borderElement: Element = this.heatMap.renderer.drawPath(pathOptions) as HTMLElement;
        if (!this.heatMap.enableCanvasRendering) {
            parent.appendChild(borderElement);
        } else {
            this.heatMap.canvasRenderer.drawPath(pathOptions, canvasTranslate);
        }
    }

    /**
     * calculate left position of border element
     *
     * @private
     */

    public calculateLeftPosition(axis: Axis, start: number, label: number | Date | string, rect: Rect): number {
        let value: number;
        let interval: number;
        if (typeof label === 'number') {
            if (axis.valueType === 'Numeric' && (axis.minimum || axis.maximum)) {
                const min: number = axis.minimum ? <number>axis.minimum : 0;
                start -= min;
            }
            const size: number = axis.orientation === 'Horizontal' ? rect.width : rect.height;
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
     *
     * @private
     */

    public calculateWidth(axis: Axis, label: number | Date | string, end: number, rect: Rect): number {
        let interval: number;
        let value: number;
        if (typeof label === 'number') {
            if (axis.valueType === 'Numeric' && (axis.minimum || axis.maximum)) {
                const min: number = axis.minimum ? <number>axis.minimum : 0;
                end -= min;
            }
            const size: number = axis.orientation === 'Horizontal' ? rect.width : rect.height;
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
        const oneDay: number = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        const oneMinute: number = 60 * 1000;
        let firstDate: Date;
        let secondDate: Date;
        const labels: (string | number | Date)[] = axis.labelValue;
        let position: number;
        const interval: number = (axis.orientation === 'Horizontal' ? rect.width : rect.height) / axis.axisLabelSize;
        const givenDate: Date = new Date(Number(date));

        let days: number = 0;
        for (let index: number = 0; index < axis.axisLabelSize; index++) {
            firstDate = new Date(Number(labels[index as number]));
            secondDate = axis.isInversed ? new Date(Number(labels[index - 1])) : new Date(Number(labels[index + 1]));
            if (index === (axis.isInversed ? 0 : axis.axisLabelSize - 1)) {
                secondDate = new Date(Number(labels[index as number]));
                if (axis.intervalType === 'Hours') {
                    secondDate = new Date(Number(secondDate.setHours(secondDate.getHours() + 1)));
                } else if ((axis.intervalType === 'Minutes')) {
                    secondDate = new Date(Number(secondDate.setMinutes(secondDate.getMinutes() + 1)));
                } else if ((axis.intervalType === 'Days')) {
                    secondDate = new Date(Number(secondDate.setDate(secondDate.getDate() + 1)));
                } else {
                    const numberOfDays: number = axis.intervalType === 'Months' ?
                        new Date(secondDate.getFullYear(), secondDate.getMonth() + 1, 0).getDate() :
                        secondDate.getFullYear() % 4 === 0 ? 366 : 365;
                    secondDate = new Date(Number(secondDate.setDate(secondDate.getDate() + numberOfDays)));
                }
            }
            if (Number(firstDate) <= date && Number(secondDate) >= date) {
                if (axis.intervalType === 'Minutes' || axis.intervalType === 'Hours') {
                    const totalMinutes: number = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneMinute)));
                    const minutesInHours: number = Math.abs((firstDate.getTime() - givenDate.getTime()) / (oneMinute));
                    days = (interval / totalMinutes) * minutesInHours;
                    index = axis.isInversed ? axis.axisLabelSize - 1 - index : index;
                    position = index * interval + days;
                    break;
                } else {
                    const numberOfDays: number = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
                    // eslint-disable-next-line
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

    /**
     * @returns {void}
     * @private
     */
    public destroy(): void {
        this.drawSvgCanvas = null;
        this.element = null;
        this.htmlObject = null;
        this.initialClipRect = null;
        this.heatMap = null;
    }
}
