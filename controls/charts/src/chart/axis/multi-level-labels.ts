/* eslint-disable no-self-assign */
/* eslint-disable no-case-declarations */
/* eslint-disable max-len */
/* eslint-disable jsdoc/require-returns */
/* eslint-disable valid-jsdoc */
/* eslint-disable jsdoc/require-param */
/**
 * MultiLevel Labels src
 */
import { Chart } from '../chart';
import { Axis } from '../axis/axis';
import { FontModel } from '../../common/model/base-model';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { textWrap, appendClipElement, appendChildElement } from '../../common/utils/helper';
import { valueToCoefficient, textTrim, textElement, withInBounds } from '../../common/utils/helper';
import { Size, measureText, TextOption, PathOption, Rect, SvgRenderer } from '@syncfusion/ej2-svg-base';
import { MultiLevelLabels, MultiLevelCategories } from '../model/chart-base';
import { IAxisMultiLabelRenderEventArgs, IMultiLevelLabelClickEventArgs } from '../../chart/model/chart-interface';
import { axisMultiLabelRender, multiLevelLabelClick } from '../../common/model/constants';
import { Alignment } from '../../common/utils/enum';
import { MultiLevelCategoriesModel } from '../model/chart-base-model';
import { BorderType } from '../utils/enum';

/**
 * `MultiLevelLabel` module is used to render the multi level label in chart.
 */
export class MultiLevelLabel {
    /** @private */
    public chart: Chart;
    /** @private */
    public xAxisPrevHeight: number[] = [];
    /** @private */
    public xAxisMultiLabelHeight: number[] = [];
    /** @private */
    public yAxisPrevHeight: number[] = [];
    /** @private */
    public yAxisMultiLabelHeight: number[] = [];
    /** @private */
    public multiElements: Element;
    /** @private */
    public labelElement: Element;
    /** @private */
    public multiLevelLabelRectXRegion: Rect[] = [];
    /** @private */
    public xLabelCollection: TextOption[] = [];
    /**
     * Constructor for the logerithmic module.
     *
     * @private
     */
    constructor(chart: Chart) {
        this.chart = chart;
        this.addEventListener();
    }

    /**
     * Binding events for multi level module.
     */
    private addEventListener(): void {
        if (this.chart.isDestroyed) { return; }
        this.chart.on('click', this.click, this);
    }

    /**
     * Finds multilevel label height.
     *
     * @returns {void}
     */
    public getMultilevelLabelsHeight(axis: Axis): void {
        let value: number = 0;
        const multiLevelLabelsHeight: number[] = [];
        const prevHeight: number[] = [];
        const isVertical: boolean = axis.orientation === 'Vertical';
        const axisValue: number = isVertical ? axis.rect.height : axis.rect.width;
        let labelSize: Size;
        let height: number; const padding: number = 10;
        let gap: number;
        axis.multiLevelLabels.map((multiLevel: MultiLevelLabels, index: number) => {
            multiLevel.categories.map((categoryLabel: MultiLevelCategories, i: number) => {
                if (categoryLabel.text !== '' && categoryLabel.start !== null && categoryLabel.end !== null) {
                    labelSize = measureText(categoryLabel.text, multiLevel.textStyle, this.chart.themeStyle.axisLabelFont);
                    height = isVertical ? labelSize.width : labelSize.height;
                    height += 2 * multiLevel.border.width +
                        (multiLevel.border.type === 'CurlyBrace' ? padding : 0);
                    gap = (categoryLabel.maximumTextWidth !== null) ? categoryLabel.maximumTextWidth :
                        (valueToCoefficient(typeof categoryLabel.end === 'string' ? Number(new Date(categoryLabel.end)) :
                                            <number>categoryLabel.end,
                                            axis) * axisValue) -
                        (valueToCoefficient(typeof categoryLabel.start === 'string' ? Number(new Date(categoryLabel.start)) :
                                           <number>categoryLabel.start,
                                            axis) * axisValue);
                    const len: number = axis.multiLevelLabels[index as number].categories.length;
                    gap = ((i === 0 || i === len - 1) && axis.labelPlacement === 'OnTicks' && axis.edgeLabelPlacement === 'Shift') ? gap / 2 : gap;
                    if ((labelSize.width > gap - padding) && gap > 0 && (multiLevel.overflow === 'Wrap') && !isVertical) {
                        height = (height * (textWrap(categoryLabel.text, gap - padding, multiLevel.textStyle, null, null, this.chart.themeStyle.axisLabelFont).length));
                    }
                    multiLevelLabelsHeight[index as number] = !multiLevelLabelsHeight[index as number] ? height :
                        ((multiLevelLabelsHeight[index as number] < height) ? height : multiLevelLabelsHeight[index as number]);
                }
            });
            prevHeight[index as number] = value;
            value += multiLevelLabelsHeight[index as number] ? (multiLevelLabelsHeight[index as number] + padding) : 0;
        });
        axis.multiLevelLabelHeight = value + ((axis.title !== '' || (this.chart.legendModule && this.chart.legendSettings.visible))
            ? padding / 2 : 0);
        if (isVertical) {
            this.yAxisMultiLabelHeight = multiLevelLabelsHeight;
            this.yAxisPrevHeight = prevHeight;
        } else {
            this.xAxisMultiLabelHeight = multiLevelLabelsHeight;
            this.xAxisPrevHeight = prevHeight;
        }
    }
    /**
     * render x axis multi level labels
     *
     * @private
     * @returns {void}
     */
    public renderXAxisMultiLevelLabels(axis: Axis, index: number, parent: Element, axisRect: Rect): void {
        let x: number; let y: number; const padding: number = 10; let startX: number;
        let pointIndex: number;
        const startY: number = (axis.labelPosition === axis.tickPosition ? axis.majorTickLines.height : 0) +
            (axis.maxLabelSize.height) + padding;
        let endX: number; let pathRect: string = '';
        let start: number | Date; let end: number | Date;
        let labelSize: Size; const isOutside: boolean = axis.labelPosition === 'Outside';
        let gap: number; let anchor: string; const isInversed: boolean = axis.isAxisInverse;
        let argsData: IAxisMultiLabelRenderEventArgs; const opposedPosition: boolean = axis.isAxisOpposedPosition;
        let len: number;
        const scrollBarHeight: number = axis.scrollbarSettings.enable || (isOutside && isNullOrUndefined(axis.crossesAt)) ?
            axis.scrollBarHeight : 0;
        const clipY: number = ((opposedPosition && !isOutside) || (!opposedPosition && isOutside)) ?
            (axisRect.y + startY - axis.majorTickLines.width) : (axisRect.y - startY - axis.multiLevelLabelHeight);
        this.createClipRect(
            axisRect.x - axis.majorTickLines.width, clipY + scrollBarHeight, axis.multiLevelLabelHeight + padding,
            axisRect.width + 2 * axis.majorTickLines.width,
            this.chart.element.id + '_XAxis_Clippath_' + index, this.chart.element.id + 'XAxisMultiLevelLabel' + index);
        axis.multiLevelLabels.map((multiLevel: MultiLevelLabels, level: number) => {
            pointIndex = 0;
            this.labelElement = this.chart.renderer.createGroup({ id: this.chart.element.id + index + '_MultiLevelLabel' + level });
            multiLevel.categories.map((categoryLabel: MultiLevelCategories, i: number) => {
                len = multiLevel.categories.length;
                pathRect = '';
                start = typeof categoryLabel.start === 'string' ? Number(new Date(categoryLabel.start)) : categoryLabel.start;
                end = typeof categoryLabel.end === 'string' ? Number(new Date(categoryLabel.end)) : categoryLabel.end;
                argsData = this.triggerMultiLabelRender(
                    axis, categoryLabel.text, axis.multiLevelLabels[level as number].textStyle,
                    axis.multiLevelLabels[level as number].alignment, categoryLabel.customAttributes);
                if (!argsData.cancel) {
                    startX = valueToCoefficient(<number>start, axis) * axisRect.width;
                    endX = valueToCoefficient(<number>end, axis) * axisRect.width;
                    endX = isInversed ? [startX, startX = endX][0] : endX;
                    labelSize = measureText(<string>argsData.text, argsData.textStyle, this.chart.themeStyle.axisLabelFont);
                    gap = ((categoryLabel.maximumTextWidth === null) ? endX - startX : categoryLabel.maximumTextWidth) - padding;
                    x = startX + axisRect.x + padding;
                    y = (((opposedPosition && !isOutside) || (!opposedPosition && isOutside)) ? (startY + axisRect.y +
                            labelSize.height / 2 + padding + this.xAxisPrevHeight[level as number]) : (axisRect.y - startY + labelSize.height / 2 -
                                this.xAxisMultiLabelHeight[level as number] - this.xAxisPrevHeight[level as number])) + scrollBarHeight;
                    if (argsData.alignment === 'Center') {
                        x += (endX - startX - padding) / 2; anchor = 'middle';
                    } else if (argsData.alignment === 'Far') {
                        x = x + (endX - startX - padding) - multiLevel.border.width / 2;
                        if (axis.labelPlacement === 'OnTicks' && (i === 0 || i === len - 1)) {
                            x += (endX - startX - padding) / 2;
                            x = x - labelSize.width / 2;
                        }
                        anchor = 'end';
                    } else {
                        anchor = 'start'; x += multiLevel.border.width / 2;
                    }
                    y = multiLevel.border.type === 'CurlyBrace' ?
                        (((!opposedPosition && isOutside) || (opposedPosition && !isOutside)) ? y + padding : y - padding / 2) : y;
                    const options: TextOption = new TextOption(
                        this.chart.element.id + index + '_Axis_MultiLevelLabel_Level_' + level + '_Text_' + i, x, y,
                        anchor, argsData.text
                    );
                    if (multiLevel.overflow !== 'None') {
                        if (axis.edgeLabelPlacement && axis.labelPlacement === 'OnTicks') {
                            switch (axis.edgeLabelPlacement) {
                            case 'None':
                                break;
                            case 'Shift':
                                if ((i === 0 || (isInversed && i === len - 1))) {
                                    if (argsData.alignment === 'Center' && ((options.x < axisRect.x + padding) || (options.x - labelSize.width / 2)) < axis.rect.x) {
                                        options.x += axisRect.x / 2;
                                        if ((options.x / 2) < axisRect.x) {
                                            options.x = axisRect.x + padding / 2;
                                            options.anchor = 'start';
                                        }
                                    }
                                    else if (argsData.alignment === 'Far' && ((options.x < axisRect.x + padding) || (options.x > axisRect.x + padding))) {
                                        options.x += labelSize.width / 2 - gap / 2;
                                    }
                                    else if (argsData.alignment === 'Near' && ((options.x < axisRect.x + padding) || (options.x > axisRect.x + padding))) {
                                        options.x = axisRect.x + padding;
                                    }
                                    gap = gap / 2;
                                }
                                else if ((i === len - 1 || (isInversed && i === 0))) {
                                    if (argsData.alignment === 'Center' && (options.x) > axisRect.x + axisRect.width) {
                                        options.x -= padding;
                                        if (options.x > axisRect.width) {
                                            options.x = axisRect.width + axisRect.x;
                                            options.anchor = 'end';
                                        }
                                    }
                                    else if (argsData.alignment === 'Far') {
                                        options.x = axisRect.width + axisRect.x;
                                    }
                                    else {
                                        options.x = options.x;
                                    }
                                    gap = gap / 2;
                                }
                                break;
                            }
                        }
                        options.text = (multiLevel.overflow === 'Wrap') ?
                            textWrap(argsData.text, gap, argsData.textStyle, null, null, this.chart.themeStyle.axisLabelFont) : textTrim(gap, argsData.text, argsData.textStyle, this.chart.themeStyle.axisLabelFont);
                        options.x = options.x - padding / 2;
                    }
                    textElement(
                        this.chart.renderer, options, argsData.textStyle, argsData.textStyle.color || this.chart.themeStyle.axisLabelFont.color,
                        this.labelElement, false, this.chart.redraw, true, null, null, null, null, null, this.chart.enableCanvas, null, this.chart.themeStyle.axisLabelFont
                    );
                    if (this.chart.enableCanvas) {
                        const textSize: Size = measureText(argsData.text, argsData.textStyle, this.chart.themeStyle.axisLabelFont);
                        this.multiLevelLabelRectXRegion.push(new Rect(options.x, options.y, textSize.width, textSize.height));
                        this.xLabelCollection.push(options);
                    }
                    if (multiLevel.border.width > 0 && multiLevel.border.type !== 'WithoutBorder') {
                        pathRect = this.renderXAxisLabelBorder(
                            level, endX - startX - padding, axis, startX, startY, labelSize, options, axisRect, argsData.alignment,
                            pathRect, isOutside, opposedPosition, pointIndex
                        );
                        // fix for generating seperate rect
                        if (pathRect !== '') { this.createBorderElement(level, index, axis, pathRect, pointIndex); pointIndex++; }
                    }
                    if (!this.chart.enableCanvas) {
                        this.multiElements.appendChild(this.labelElement);
                    }
                }
            });
        });
        if (!this.chart.enableCanvas) {
            parent.appendChild(this.multiElements);
        }
    }
    /**
     * render x axis multi level labels border
     *
     * @private
     * @returns {void}
     */
    private renderXAxisLabelBorder(
        labelIndex: number, gap: number, axis: Axis, startX: number, startY: number, labelSize: Size, textOptions: TextOption,
        axisRect: Rect, alignment: Alignment, path: string, isOutside: boolean, opposedPosition: boolean, categoryIndex: number): string {
        let padding: number = 10; let padding1: number; let padding2: number;
        let value: number; let value1: number;
        const groupLabel: MultiLevelLabels = <MultiLevelLabels>axis.multiLevelLabels[labelIndex as number];
        const categoryType: BorderType = groupLabel.categories[categoryIndex as number].type;
        const width: number = gap + padding;
        let height: number = this.xAxisMultiLabelHeight[labelIndex as number] + padding;
        const scrollBarHeight: number = axis.labelPosition === 'Outside' ? axis.scrollBarHeight : 0;
        const x: number = startX + axisRect.x;
        const y: number = ((!opposedPosition && isOutside) || (opposedPosition && !isOutside)) ? (startY + axisRect.y +
            this.xAxisPrevHeight[labelIndex as number] + scrollBarHeight) : (axisRect.y - startY -
                this.xAxisPrevHeight[labelIndex as number] - scrollBarHeight);
        const borderType: BorderType = categoryType ? categoryType : groupLabel.border.type;
        switch (borderType) {
        case 'WithoutTopandBottomBorder':
        case 'Rectangle':
        case 'WithoutTopBorder':
            const len: number = axis.multiLevelLabels[labelIndex as number].categories.length;
            const lastX: number = (categoryIndex === len - 1 && (x + width > axisRect.width)) ? axisRect.width + axisRect.x : x + width;
            const initialX: number = (categoryIndex === 0 && axis.multiLevelLabels[labelIndex as number].categories[0].start <= 0 ) ? axisRect.x : x;
            height = ((!opposedPosition && isOutside) || (opposedPosition && !isOutside)) ? height : -height;
            path += 'M ' + initialX + ' ' + y + ' L ' + initialX + ' ' + (y + height) + ' M ' + (lastX) + ' '
                    + y + ' L ' + (lastX) + ' ' + (y + height);
            path += (borderType !== 'WithoutTopandBottomBorder') ? (' L' + ' ' + (initialX) + ' ' + (y + height) + ' ') : ' ';
            path += (borderType === 'Rectangle') ? ('M ' + initialX + ' ' + y + ' L ' + (lastX) + ' ' + y) : ' ';
            break;
        case 'Brace':
            if (alignment === 'Near') {
                value = textOptions.x; value1 = textOptions.x + labelSize.width + 2;
            } else if (alignment === 'Center') {
                value = textOptions.x - labelSize.width / 2 - 2;
                value1 = textOptions.x + labelSize.width / 2 + 2;
            } else {
                value = textOptions.x - labelSize.width - 2; value1 = textOptions.x;
            }
            height = ((!opposedPosition && isOutside) || (opposedPosition && !isOutside)) ? height : -height;
            path += 'M ' + x + ' ' + y + ' L ' + x + ' ' + (y + height / 2) +
                    ' M ' + x + ' ' + (y + height / 2) + ' L ' + (value - 2) + ' ' + (y + height / 2) +
                    ' M ' + (value1) + ' ' + (y + height / 2) + ' L ' + (x + width) + ' ' + (y + height / 2) +
                    ' M ' + (x + width) + ' ' + (y + height / 2) + ' L ' + (x + width) + ' ' + (y);
            break;
        case 'CurlyBrace':
            if ((!opposedPosition && isOutside) || (opposedPosition && !isOutside)) {
                padding = 10; padding1 = 15; padding2 = 5;
            } else {
                padding = -10; padding1 = -15; padding2 = -5;
            }
            if (alignment === 'Center') {
                path += 'M ' + x + ' ' + y + ' C ' + x + ' ' + y + ' ' + (x + 5) + ' ' + (y + padding) + ' ' + (x + 10) + ' ' +
                        (y + padding) + ' L ' + (x + width / 2 - 5) + ' ' + (y + padding) + ' L ' + (x + width / 2) + ' ' + (y + padding1) +
                        ' L ' + (x + width / 2 + 5) + ' ' + (y + padding) + ' L ' + (x + width - 10) + ' ' + (y + padding) + ' C ' +
                        (x + width - 10) + ' ' + (y + padding) + ' ' + (x + width) + ' ' + (y + padding2) + ' ' + (x + width) + ' ' + (y);
            } else if (alignment === 'Near') {
                path += 'M ' + x + ' ' + y + ' C ' + x + ' ' + y + ' ' + (x + 5) + ' ' + (y + padding) + ' ' + (x + 10) + ' ' +
                        (y + padding) + ' L ' + (x + 15) + ' ' + (y + padding1) + ' L ' + (x + 20) + ' ' + (y + padding) + ' L ' +
                        (x + width - 10) + ' ' + (y + padding) + ' C ' + (x + width - 10) + ' ' + (y + padding) + ' ' + (x + width) + ' '
                        + (y + padding2) + ' ' + (x + width) + ' ' + (y);
            } else {
                path += 'M ' + x + ' ' + y + ' C ' + x + ' ' + y + ' ' + (x + 5) + ' ' + (y + padding) + ' ' + (x + 10) + ' ' +
                        (y + padding) + ' L ' + (x + width - 20) + ' ' + (y + padding) + ' L ' + (x + width - 15) + ' ' + (y + padding1) +
                        ' L ' + (x + width - 10) + ' ' + (y + padding) + ' L ' + (x + width - 10) + ' ' + (y + padding) + ' C '
                        + (x + width - 10) + ' ' + (y + padding) + ' ' + (x + width) + ' ' + (y + padding2) + ' ' + (x + width) + ' ' + (y);
            }
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
    public renderYAxisMultiLevelLabels(axis: Axis, index: number, parent: Element, rect: Rect): void {
        let labelSize: Size;
        const isOutside: boolean = axis.labelPosition === 'Outside';
        let x: number; let y: number; const padding: number = 10;
        const startX: number = (axis.tickPosition === axis.labelPosition ? axis.majorTickLines.height : 0) +
            (axis.maxLabelSize.width) + padding;
        let startY: number; let path: string = '';
        let endY: number; let argsData: IAxisMultiLabelRenderEventArgs;
        let pointIndex: number;
        const isInversed: boolean = axis.isAxisInverse;
        let start: number | Date; let end: number | Date;
        let gap: number; const anchor: string = 'middle'; const opposedPosition: boolean = axis.isAxisOpposedPosition;
        let scrollBarHeight: number = isOutside && isNullOrUndefined(axis.crossesAt) ? axis.scrollBarHeight : 0;
        scrollBarHeight = scrollBarHeight * (opposedPosition ? 1 : -1);
        const clipX: number = ((opposedPosition && !isOutside) || (!opposedPosition && isOutside)) ?
            (rect.x - axis.multiLevelLabelHeight - startX - padding) : (rect.x + startX);
        this.createClipRect(
            clipX + scrollBarHeight, rect.y - axis.majorTickLines.width, rect.height + 2 * axis.majorTickLines.width,
            axis.multiLevelLabelHeight + padding, this.chart.element.id + '_YAxis_Clippath_' + index, this.chart.element.id
            + 'YAxisMultiLevelLabel' + index);
        axis.multiLevelLabels.map((multiLevel: MultiLevelLabels, level: number) => {
            this.labelElement = this.chart.renderer.createGroup({ id: this.chart.element.id + index + '_MultiLevelLabel' + level });
            pointIndex = 0;
            multiLevel.categories.map((categoryLabel: MultiLevelCategories, i: number) => {
                path = '';
                end = typeof categoryLabel.end === 'string' ? Number(new Date(categoryLabel.end)) : categoryLabel.end;
                start = typeof categoryLabel.start === 'string' ? Number(new Date(categoryLabel.start)) : categoryLabel.start;
                startY = valueToCoefficient(<number>(start), axis) * (rect.height);
                endY = valueToCoefficient(<number>(end), axis) * (rect.height);
                endY = isInversed ? [startY, startY = endY][0] : endY;
                argsData = this.triggerMultiLabelRender(
                    axis, categoryLabel.text, multiLevel.textStyle, multiLevel.alignment, categoryLabel.customAttributes);
                if (!argsData.cancel) {
                    const maximumWidth: number = ((categoryLabel.maximumTextWidth === null ? (this.yAxisMultiLabelHeight[level as number] / 2) : categoryLabel.maximumTextWidth / 2));
                    labelSize = measureText(argsData.text, argsData.textStyle, this.chart.themeStyle.axisLabelFont);
                    gap = endY - startY;
                    x = rect.x - startX - this.yAxisPrevHeight[level as number] -
                        (maximumWidth) - padding / 2;
                    y = rect.height + rect.y - startY - (gap / 2);
                    if (opposedPosition) {
                        x = isOutside ? rect.x + startX + padding / 2 + (maximumWidth) +
                            this.yAxisPrevHeight[level as number] + scrollBarHeight : rect.x - startX - (maximumWidth) -
                            this.yAxisPrevHeight[level as number] - padding / 2;
                    } else {
                        x = isOutside ? x + scrollBarHeight : rect.x + startX + padding / 2 + (maximumWidth) +
                            this.yAxisPrevHeight[level as number];
                    }
                    if (argsData.alignment === 'Center') {
                        y += labelSize.height / 4;
                    } else if (argsData.alignment === 'Far') {
                        y += gap / 2 - labelSize.height / 2;
                    } else {
                        y = y - gap / 2 + labelSize.height;
                    }
                    x = multiLevel.border.type === 'CurlyBrace' ? (((!opposedPosition && isOutside) ||
                        (opposedPosition && !isOutside)) ? x - padding : x + padding) : x;
                    const options: TextOption = new TextOption(
                        this.chart.element.id + index + '_Axis_MultiLevelLabel_Level_' + level + '_Text_' + i, x, y, anchor,
                        argsData.text
                    );
                    options.text = (multiLevel.overflow === 'Trim') ?
                        textTrim(
                            (categoryLabel.maximumTextWidth === null ? this.yAxisMultiLabelHeight[level as number] :
                                categoryLabel.maximumTextWidth),
                            argsData.text, argsData.textStyle, this.chart.themeStyle.axisLabelFont) : options.text;
                    options.text = (multiLevel.overflow === 'Wrap') ?
                        textWrap(argsData.text, (categoryLabel.maximumTextWidth === null ? this.yAxisMultiLabelHeight[level as number] :
                            categoryLabel.maximumTextWidth), argsData.textStyle, null, null, this.chart.themeStyle.axisLabelFont) : options.text;
                    if (typeof options.text !== 'string' && options.text.length > 1) {
                        options.y -= (padding * options.text.length / 2);
                    }
                    textElement(
                        this.chart.renderer, options, argsData.textStyle, argsData.textStyle.color || this.chart.themeStyle.axisLabelFont.color,
                        this.labelElement, this.chart.redraw, true, null, null, null, null, null, null, this.chart.enableCanvas, null, this.chart.themeStyle.axisLabelFont
                    );
                    if (multiLevel.border.width > 0 && multiLevel.border.type !== 'WithoutBorder') {
                        path = this.renderYAxisLabelBorder(
                            level, gap, axis, endY, startX, startY, labelSize, options, rect, argsData.alignment, path,
                            isOutside, opposedPosition, pointIndex
                        );
                        if (path !== '') { this.createBorderElement(level, index, axis, path, pointIndex); pointIndex++; }
                    }
                    if (!this.chart.enableCanvas) {
                        this.multiElements.appendChild(this.labelElement);
                    }
                }
            });
        });
        if (!this.chart.enableCanvas) {
            parent.appendChild(this.multiElements);
        }
    }
    /**
     * render y axis multi level labels border
     *
     * @private
     * @returns {void}
     */
    private renderYAxisLabelBorder(
        labelIndex: number, gap: number, axis: Axis, endY: number, startX: number, startY: number, labelSize: Size, textOptions: TextOption,
        rect: Rect, alignment: Alignment, path: string, isOutside: boolean, opposedPosition: boolean, categoryIndex: number ): string {
        const height: number = endY - startY;
        let padding: number = 10; let padding1: number; let padding2: number;
        const groupLabel: MultiLevelLabels = <MultiLevelLabels>axis.multiLevelLabels[labelIndex as number];
        const categoryType: BorderType = groupLabel.categories[categoryIndex as number].type;
        const y: number = rect.y + rect.height - endY;
        let scrollBarHeight: number = isOutside && isNullOrUndefined(axis.crossesAt) ? axis.scrollBarHeight : 0;
        scrollBarHeight = scrollBarHeight * (opposedPosition ? 1 : -1);
        let width: number = (groupLabel.categories[categoryIndex as number].maximumTextWidth === null ? this.yAxisMultiLabelHeight[labelIndex as number] :
            (groupLabel.categories[categoryIndex as number].maximumTextWidth)) + padding;
        const x: number = (((!opposedPosition && isOutside) || (opposedPosition && !isOutside)) ? rect.x - startX -
            this.yAxisPrevHeight[labelIndex as number] : rect.x + startX + this.yAxisPrevHeight[labelIndex as number]) + scrollBarHeight;
        const borderType: BorderType = categoryType ? categoryType : groupLabel.border.type;
        switch (borderType) {
        case 'WithoutTopandBottomBorder':
        case 'Rectangle':
        case 'WithoutTopBorder':
            width = ((!opposedPosition && isOutside) || (opposedPosition && !isOutside)) ? -width : width;
            path += 'M ' + x + ' ' + y + ' L ' + (x + width) + ' ' + y +
                    ' M ' + x + ' ' + (y + height) + ' L ' + (x + width) + ' ' + (y + height);
            path += (borderType !== 'WithoutTopandBottomBorder') ? (' L' + ' ' + (x + width) + ' ' + y + ' ') : ' ';
            path += (borderType === 'Rectangle') ? ('M ' + (x) + ' ' + (y + height) + 'L' + ' ' + (x) + ' ' + y + ' ') : ' ';
            break;
        case 'Brace':
            width = ((!opposedPosition && isOutside) || (opposedPosition && !isOutside)) ? width : -width;
            path += 'M ' + (x) + ' ' + y + ' L ' + (x - width / 2) + ' ' + y + ' L ' + (x - width / 2) + ' ' +
                    (textOptions.y - labelSize.height / 2 - 4) + ' M ' + (x - width / 2) + ' ' +
                    (textOptions.y + labelSize.height / 4 + 2) +
                    ' L ' + (x - width / 2) + ' ' + (y + height) + ' L ' + (x) + ' ' + (y + height);
            break;
        case 'CurlyBrace':
            if ((!opposedPosition && isOutside) || (opposedPosition && !isOutside)) {
                padding = -10; padding1 = -15; padding2 = -5;
            } else {
                padding = 10; padding1 = 15; padding2 = 5;
            }
            if (alignment === 'Center') {
                path += 'M ' + x + ' ' + y + ' C ' + x + ' ' + y + ' ' + (x + padding) + ' ' + y + ' ' + (x + padding) + ' ' + (y + 10)
                        + ' L ' + (x + padding) + ' ' + (y + (height - 10) / 2) + ' L ' + (x + padding1) + ' ' + (y + (height - 10) / 2 + 5)
                        + ' L ' + (x + padding) + ' ' + (y + (height - 10) / 2 + 10) + ' L ' + (x + padding) + ' ' + (y + (height - 10)) +
                        ' C ' + (x + padding) + ' ' + (y + (height - 10)) + ' ' + (x + padding2) + ' ' + (y + height) + ' '
                        + x + ' ' + (y + height);
            } else if (alignment === 'Far') {
                path += 'M ' + x + ' ' + y + ' C ' + x + ' ' + y + ' ' + (x + padding) + ' ' + y + ' ' + (x + padding) + ' ' + (y + 10)
                        + ' L ' + (x + padding) + ' ' + (y + height - 20) + ' ' + ' L ' + (x + padding1) + ' ' + (y + (height - 15)) +
                        ' L ' + (x + padding) + ' ' + (y + (height - 10)) + ' L ' + (x + padding) + ' ' + (y + (height - 10)) +
                        ' C ' + (x + padding) + ' ' + (y + (height - 10)) + ' ' + (x + padding) + ' ' + (y + height) + ' ' + x + ' '
                        + (y + height);
            } else {
                path += 'M ' + x + ' ' + y + ' C ' + x + ' ' + y + ' ' + (x + padding) + ' ' + y + ' ' + (x + padding) + ' ' + (y + 10)
                        + ' L ' + (x + padding1) + ' ' + (y + 15) +
                        ' L ' + (x + padding) + ' ' + (y + 20) + ' L ' + (x + padding) + ' ' + (y + (height - 10)) +
                        ' C ' + (x + padding) + ' ' + (y + (height - 10)) + ' ' + (x + padding2) + ' ' + (y + height) + ' ' + x +
                        ' ' + (y + height);
            }
            break;
        }
        return path;
    }
    /**
     * create cliprect
     *
     * @returns {void}
     * @private
     */

    public createClipRect(x: number, y: number, height: number, width: number, clipId: string, axisId: string): void {
        this.multiElements = this.chart.renderer.createGroup({
            'id': axisId,
            'clip-path': 'url(#' + clipId + ')'
        });
        if (!this.chart.enableCanvas) {
            this.multiElements.appendChild(
                appendClipElement(
                    this.chart.redraw, {
                        'id': clipId,
                        'x': x,
                        'y': y,
                        'width': width,
                        'height': height,
                        'fill': 'white',
                        'stroke-width': 1, 'stroke': 'Gray'
                    },
                    this.chart.renderer as SvgRenderer
                )
            );
        }
    }
    /**
     * create borer element
     *
     * @returns {void}
     * @private
     */

    public createBorderElement(borderIndex: number, axisIndex: number, axis: Axis, path: string, pointIndex?: number): void {
        const direction: string = path;
        const borderElement: Element = this.chart.renderer.drawPath(new PathOption(
            this.chart.element.id + axisIndex + '_Axis_MultiLevelLabel_Rect_' + borderIndex + '_' + pointIndex, 'Transparent',
            axis.multiLevelLabels[borderIndex as number].border.width,
            axis.multiLevelLabels[borderIndex as number].border.color || this.chart.themeStyle.axisLine,
            1, '', path
        )) as HTMLElement;
        (borderElement as HTMLElement).style.pointerEvents = 'none';
        appendChildElement( this.chart.enableCanvas, this.labelElement, borderElement, this.chart.redraw, true, 'x', 'y', null, direction);
    }
    /**
     * Triggers the event.
     *
     * @returns {void}
     * @private
     */

    public triggerMultiLabelRender(
        axis: Axis, text: string, textStyle: FontModel, textAlignment: Alignment,
        customAttributes: object): IAxisMultiLabelRenderEventArgs {
        const argsData: IAxisMultiLabelRenderEventArgs = {
            cancel: false, name: axisMultiLabelRender, axis: axis,
            text: text, textStyle: textStyle, alignment: textAlignment, customAttributes: customAttributes
        };
        this.chart.trigger(axisMultiLabelRender, argsData);
        return argsData;
    }
    /**
     * Triggers the event.
     *
     * @returns {void}
     * @private
     */
    public MultiLevelLabelClick(labelIndex: string, axisIndex: number): IMultiLevelLabelClickEventArgs {
        const level: number =  parseInt(labelIndex.substr(0, 1), 10);
        const textElement: number = parseInt(labelIndex.substr(7), 10);
        const chart: Chart = <Chart>this.chart;
        const axis: Axis = chart.axisCollections[axisIndex as number];
        const categories: MultiLevelCategoriesModel[] = axis.multiLevelLabels[level as number].categories;
        const text: string = categories[textElement as number].text;
        const start: number | Date | string = categories[textElement as number].start;
        const end: number | Date | string = categories[textElement as number].end;
        const customAttributes: object = categories[textElement as number].customAttributes;
        const multilevelclickArgs: IMultiLevelLabelClickEventArgs = {
            axis: axis, level: level, text: text, customAttributes: customAttributes,
            start: start, end: end, name: multiLevelLabelClick, cancel: false
        };
        this.chart.trigger(multiLevelLabelClick, multilevelclickArgs);
        return multilevelclickArgs;
    }
    /**
     * To click the multi level label
     *
     * @returns {void}
     * @private
     */
    public click(event: Event): void {
        let targetId: string = (<HTMLElement>event.target).id;
        const multiLevelID: string = '_Axis_MultiLevelLabel_Level_';
        let textId: string;
        let elementId: string;
        let axisIndex: number;
        if (this.chart.enableCanvas) {
            for (let i: number = 0; i < this.multiLevelLabelRectXRegion.length; i++) {
                if (withInBounds(
                    event['x'], event['y'], this.multiLevelLabelRectXRegion[i as number],
                    this.multiLevelLabelRectXRegion[i as number].width, this.multiLevelLabelRectXRegion[i as number].height)) {
                    targetId = this.xLabelCollection[i as number].id;
                }
            }
        }
        if (targetId.indexOf(multiLevelID) > -1) {
            textId = targetId.split(multiLevelID)[1];
            elementId = targetId.split(multiLevelID)[0];
            axisIndex = parseInt(elementId.charAt(elementId.length - 1), 10);
            this.MultiLevelLabelClick(textId, axisIndex);
        }
    }
    /**
     * To get the module name for `MultiLevelLabel`.
     *
     * @private
     */
    public getModuleName(): string {
        return 'MultiLevelLabel';
    }
    /**
     * To destroy the `MultiLevelLabel` module.
     *
     * @private
     */
    public destroy(): void {
        // destroy peform here
    }
}
