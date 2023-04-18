/* eslint-disable jsdoc/check-param-names */
/* eslint-disable @typescript-eslint/tslint/config */
/* eslint-disable max-len */
/* eslint-disable no-case-declarations */
/* eslint-disable valid-jsdoc */
/* eslint-disable jsdoc/require-param */
import { Chart } from '../chart';
import { DateFormatOptions, createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { DataUtil } from '@syncfusion/ej2-data';
import { Axis, Row, Column, VisibleRangeModel, VisibleLabels } from '../axis/axis';
import { Orientation } from '../utils/enum';
import { subtractThickness, valueToCoefficient, sum, redrawElement, isBreakLabel, ChartLocation, withInBounds } from '../../common/utils/helper';
import { subArray, inside, appendChildElement, stringToNumber } from '../../common/utils/helper';
import { TextAlignment } from '../../common/utils/enum';
import { Thickness, logBase, createZoomingLabels, getElement } from '../../common/utils/helper';
import { Size, Rect, measureText, TextOption, PathOption } from '@syncfusion/ej2-svg-base';
import { textElement, textTrim, getRotatedRectangleCoordinates, isRotatedRectIntersect, isZoomSet } from '../../common/utils/helper';
import { BorderModel } from '../../common/model/base-model';
import { MajorGridLinesModel, MinorGridLinesModel, MajorTickLinesModel, MinorTickLinesModel } from './axis-model';
import { IThemeStyle } from '../model/chart-interface';
/**
 * Specifies the Cartesian Axis Layout.
 */
const axisPadding: number = 10;

export class CartesianAxisLayoutPanel {

    private chart: Chart;
    private initialClipRect: Rect;
    private htmlObject: HTMLElement;
    private element: Element;
    private padding: number;
    /** @private */
    public leftSize: number;
    /** @private */
    public rightSize: number;
    /** @private */
    public topSize: number;
    /** @private */
    public bottomSize: number;
    /** @private */
    public seriesClipRect: Rect;
    /** @private */
    constructor(chartModule?: Chart) {
        this.chart = chartModule;
        this.padding = 5;
    }

    /**
     * Measure the axis size.
     *
     * @returns {void}
     * @private
     */

    public measureAxis(rect: Rect): void {

        const chart: Chart = this.chart;

        const chartAreaWidth: number = chart.chartArea.width ? stringToNumber(chart.chartArea.width, chart.availableSize.width) : null;

        this.crossAt(chart);

        this.seriesClipRect = new Rect(rect.x, rect.y, rect.width, rect.height);

        this.initialClipRect = rect;

        this.leftSize = 0; this.rightSize = 0; this.topSize = 0; this.bottomSize = 0;

        //Measure Axis size with initial Rect

        this.measureRowAxis(chart, this.initialClipRect);

        this.initialClipRect = subtractThickness(this.initialClipRect, new Thickness(this.leftSize, this.rightSize, 0, 0));

        this.measureColumnAxis(chart, this.initialClipRect);

        this.initialClipRect = subtractThickness(this.initialClipRect, new Thickness(0, 0, this.topSize, this.bottomSize));

        if (!this.chart.delayRedraw) {
            this.calculateAxisSize(this.initialClipRect);
        }

        this.leftSize = 0; this.rightSize = 0; this.topSize = 0; this.bottomSize = 0;

        //Measure Axis size with series Rect

        this.measureRowAxis(chart, this.initialClipRect);

        this.seriesClipRect = subtractThickness(this.seriesClipRect, new Thickness(this.leftSize, this.rightSize, 0, 0));

        this.measureColumnAxis(chart, this.initialClipRect);

        this.seriesClipRect = subtractThickness(this.seriesClipRect, new Thickness(0, 0, this.topSize, this.bottomSize));

        if (chartAreaWidth) {
            this.calculateFixedChartArea(chart, chartAreaWidth);
        }

        if (!this.chart.delayRedraw) {
            chart.refreshAxis();
            this.calculateAxisSize(this.seriesClipRect);
        }
    }

    private calculateFixedChartArea(chart: Chart, chartAreaWidth: number): void {
        this.seriesClipRect.width = chartAreaWidth;
        this.seriesClipRect.x = chart.availableSize.width - chart.margin.right - chartAreaWidth -
                (chart.legendSettings.position === 'Right' ? chart.legendModule.legendBounds.width : 0);
        for (const item of chart.rows) {
            this.seriesClipRect.x -= sum((<Row>item).farSizes);
        }
    }

    private measureRowAxis(chart: Chart, rect: Rect): void {
        let row: Row;
        this.calculateRowSize(rect);
        for (const item of chart.rows) {
            row = <Row>item;
            row.nearSizes = [];
            row.farSizes = [];
            row.insideNearSizes = [];
            row.insideFarSizes = [];
            this.arrangeAxis(row);
            this.measureDefinition(row, chart, new Size(chart.availableSize.width, row.computedHeight));
            if (this.leftSize < sum(row.nearSizes)) {
                this.leftSize = sum(row.nearSizes);
            }
            if (this.rightSize < sum(row.farSizes)) {
                this.rightSize = sum(row.farSizes);
            }
        }
    }

    private measureColumnAxis(chart: Chart, rect: Rect): void {
        let column: Column;
        this.calculateColumnSize(rect);
        for (const item of chart.columns) {
            column = <Column>item;
            column.farSizes = [];
            column.nearSizes = [];
            column.insideNearSizes = [];
            column.insideFarSizes = [];
            this.arrangeAxis(column);
            this.measureDefinition(column, chart, new Size(column.computedWidth, chart.availableSize.height));
            if (this.bottomSize < sum(column.nearSizes)) {
                this.bottomSize = sum(column.nearSizes);
            }
            if (this.topSize < sum(column.farSizes)) {
                this.topSize = sum(column.farSizes);
            }
        }
    }

    /**
     * Measure the column and row in chart.
     *
     * @returns {void}
     * @private
     */

    public measureDefinition(definition: Row | Column, chart: Chart, size: Size): void {
        const ele: number = 16; // scrollbar element height is 16.
        for (const axis of definition.axes) {
            axis.scrollBarHeight = chart.scrollBarModule && chart.zoomModule && chart.zoomSettings.enableScrollbar &&
                axis.enableScrollbarOnZooming && chart.zoomModule.isZoomed && (axis.zoomFactor < 1 || axis.zoomPosition > 0) ? ele : 0;
            axis.scrollBarHeight = chart.scrollBarModule && (chart.zoomModule && chart.zoomSettings.enableScrollbar &&
                axis.enableScrollbarOnZooming && chart.zoomModule.isZoomed && (axis.zoomFactor < 1 || axis.zoomPosition > 0)
                || axis.scrollbarSettings.enable) ? ele : 0;
            axis.getModule(chart);
            axis.baseModule.calculateRangeAndInterval(size, axis);
            definition.computeSize(axis, axis.scrollBarHeight, definition, chart);
        }
        if (definition.farSizes.length > 0) {
            definition.farSizes[definition.farSizes.length - 1] -= axisPadding;
        }
        if (definition.nearSizes.length > 0) {
            definition.nearSizes[definition.nearSizes.length - 1] -= axisPadding;
        }
    }

    /**
     * Measure the axis.
     *
     * @returns {void}
     * @private
     */
    private calculateAxisSize(rect: Rect): void {

        const chart: Chart = this.chart;

        let row: Row;

        let column: Column;

        let definition: Row | Column;

        let axis: Axis;

        let nearCount: number = 0;

        let farCount: number = 0;

        let size: number = 0;

        let x: number; let y: number;
        let axisOffset: number;

        this.calculateRowSize(rect);

        for (let i: number = 0, len: number = chart.rows.length; i < len; i++) {
            row = <Row>chart.rows[i as number];
            nearCount = 0; farCount = 0;
            for (let j: number = 0, len: number = row.axes.length; j < len; j++) {
                axis = row.axes[j as number];
                axisOffset = axis.plotOffset;
                if (axis.rect.height === 0) {
                    axis.rect.height = row.computedHeight;
                    size = 0;
                    for (let k: number = i + 1, len: number = i + axis.span; k < len; k++) {
                        definition = <Row>chart.rows[k as number];
                        size += definition.computedHeight;
                    }
                    axis.rect.y = (row.computedTop - size) + (axis.plotOffsetTop ? axis.plotOffsetTop : axisOffset);
                    axis.rect.height = (axis.rect.height + size) -
                                      (this.getAxisOffsetValue(axis.plotOffsetTop, axis.plotOffsetBottom, axis.plotOffset));
                    axis.rect.width = 0;
                }
                if (axis.isAxisOpposedPosition) {
                    if (axis.labelPosition === 'Inside' && axis.orientation === 'Vertical') {
                        x = rect.x + rect.width - sum(subArray(row.insideFarSizes, farCount));
                    }
                    else {
                        x = rect.x + rect.width + sum(subArray(row.farSizes, farCount));
                    }
                    axis.rect.x = axis.rect.x >= x ? axis.rect.x : x;
                    farCount++;
                } else {
                    if (axis.labelPosition === 'Inside' && axis.orientation === 'Vertical') {
                        x = rect.x + sum(subArray(row.insideNearSizes, nearCount));
                    }
                    else{
                        x = rect.x - sum(subArray(row.nearSizes, nearCount));
                    }
                    axis.rect.x = axis.rect.x <= x ? axis.rect.x : x;
                    nearCount++;
                }

            }
        }

        this.calculateColumnSize(rect);

        for (let i: number = 0, len: number = chart.columns.length; i < len; i++) {
            column = <Column>chart.columns[i as number];
            nearCount = 0;
            farCount = 0;
            for (let j: number = 0, len: number = column.axes.length; j < len; j++) {
                axis = column.axes[j as number];
                axisOffset = axis.plotOffset;
                if (axis.rect.width === 0) {
                    for (let k: number = i, len: number = (i + axis.span); k < len; k++) {
                        definition = <Column>chart.columns[k as number];
                        axis.rect.width += definition.computedWidth;
                    }
                    axis.rect.x = column.computedLeft + (axis.plotOffsetLeft ? axis.plotOffsetLeft : axisOffset);
                    axis.rect.width -= (this.getAxisOffsetValue(axis.plotOffsetLeft, axis.plotOffsetRight, axis.plotOffset));
                    axis.rect.height = 0;
                }
                if (axis.isAxisOpposedPosition) {
                    if (axis.labelPosition === 'Inside' && axis.orientation === 'Horizontal') {
                        y = rect.y + sum(subArray(column.insideFarSizes, farCount));
                    }
                    else {
                        y = rect.y - sum(subArray(column.farSizes, farCount));
                    }
                    axis.rect.y = axis.rect.y <= y ? axis.rect.y : y;
                    farCount++;
                } else {
                    if (axis.labelPosition === 'Inside' && axis.orientation === 'Horizontal') {
                        y = rect.y + rect.height - sum(subArray(column.insideNearSizes, nearCount));
                    }
                    else {
                        y = rect.y + rect.height + sum(subArray(column.nearSizes, nearCount));
                    }
                    axis.rect.y = axis.rect.y >= y ? axis.rect.y : y;
                    nearCount++;
                }
            }
        }
    }

    /**
     * Measure the axis.
     *
     * @returns {void}
     * @private
     */
    public measure(): void {
        const chart: Chart = this.chart;
        let row: Row;
        let column: Column;
        let definition: Row | Column;
        let actualIndex: number;
        let span: number;
        for (const axis of chart.axisCollections) {
            //definition.Axes = axis;
            if (axis.orientation === 'Vertical') {
                chart.verticalAxes.push(axis);
                actualIndex = this.getActualRow(axis);
                row = <Row>chart.rows[actualIndex as number];
                this.pushAxis(row, axis);
                span = ((actualIndex + axis.span) > chart.rows.length ? chart.rows.length : (actualIndex + axis.span));
                for (let j: number = actualIndex + 1; j < span; j++) {
                    definition = <Row>chart.rows[j as number];
                    definition.axes[row.axes.length - 1] = axis;
                    chart.rows[j as number] = definition;
                }
                chart.rows[actualIndex as number] = row;
            } else {
                chart.horizontalAxes.push(axis);
                actualIndex = this.getActualColumn(axis);
                column = <Column>chart.columns[actualIndex as number];
                this.pushAxis(column, axis);
                span = ((actualIndex + axis.span) > chart.columns.length ? chart.columns.length : (actualIndex + axis.span));
                for (let j: number = actualIndex + 1; j < span; j++) {
                    definition = <Column>chart.columns[j as number];
                    definition.axes[column.axes.length - 1] = axis;
                    chart.columns[j as number] = definition;
                }
                chart.columns[actualIndex as number] = column;
            }
            axis.isRTLEnabled = chart.enableRtl;
            axis.setIsInversedAndOpposedPosition();
        }
    }

    private getAxisOffsetValue(position1: number, position2: number, plotOffset: number): number {
        const rangeOffset: number = position1 ? (position1 + (position2 ? position2 :
            plotOffset)) : (position2 ? position2 + plotOffset : 2 * plotOffset);
        return rangeOffset;
    }

    private crossAt(chart: Chart): void {
        for (const axis of chart.axisCollections) {
            if (axis.crossesAt === null) {
                continue;
            }
            if (!axis.crossesInAxis) {
                if (chart.requireInvertedAxis) {
                    axis.crossInAxis = ((axis.orientation === 'Horizontal')) ? <Axis>chart.primaryXAxis : <Axis>chart.primaryYAxis;
                } else {
                    axis.crossInAxis = ((axis.orientation === 'Horizontal')) ? <Axis>chart.primaryYAxis : <Axis>chart.primaryXAxis;
                }
                axis.crossAt = this.updateCrossAt(axis.crossInAxis, axis.crossesAt);
                continue;
            } else {
                for (let i: number = 2, len: number = chart.axisCollections.length; i < len; i++) {
                    if (axis.crossesInAxis === chart.axisCollections[i as number].name) {
                        axis.crossInAxis = chart.axisCollections[i as number];
                        axis.crossAt = this.updateCrossAt(axis.crossInAxis, axis.crossesAt);
                        continue;
                    }
                }
            }
        }
    }
    private updateCrossAt(axis: Axis, crossAt: Object): number {
        switch (axis.valueType) {
        case 'DateTime':
            const option: DateFormatOptions = {
                skeleton: 'full',
                type: 'dateTime'
            };
            const dateParser: Function = this.chart.intl.getDateParser(option);
            const dateFormatter: Function = this.chart.intl.getDateFormat(option);
            return Date.parse(dateParser(dateFormatter(new Date(
                DataUtil.parse.parseJson({ val: crossAt }).val))));

        case 'Category':
            return parseFloat(<string>crossAt) ? parseFloat(<string>crossAt) : axis.labels.indexOf(<string>crossAt);
        case 'Logarithmic':
            return logBase(<number>crossAt, axis.logBase);
        default:
            return <number>crossAt;
        }
    }

    private pushAxis(definition: Row | Column, axis: Axis): void {
        for (let i: number = 0, len: number = definition.axes.length; i <= len; i++) {
            if (!definition.axes[i as number]) {
                definition.axes[i as number] = axis;
                break;
            }
        }
    }

    private arrangeAxis(definition: Row | Column): void {
        const axisCollection: Axis[] = [];
        for (let i: number = 0, len: number = definition.axes.length; i <= len; i++) {
            if (definition.axes[i as number]) {
                axisCollection.push(definition.axes[i as number]);
            }
        }
        definition.axes = axisCollection;
    }

    private getActualColumn(axis: Axis): number {
        const actualLength: number = this.chart.columns.length;
        const pos: number = axis.columnIndex;
        const result: number = pos >= actualLength ? actualLength - 1 : (pos < 0 ? 0 : pos);
        return result;
    }

    private getActualRow(axis: Axis): number {
        const actualLength: number = this.chart.rows.length;
        const pos: number = axis.rowIndex;
        const result: number = pos >= actualLength ? actualLength - 1 : (pos < 0 ? 0 : pos);
        return result;
    }

    /**
     * Measure the row size.
     *
     * @returns {void}
     */

    private calculateRowSize(rect: Rect): void {
        /*! Calculate row size */
        const chart: Chart = this.chart;
        let row: Row;
        let rowTop: number = rect.y + rect.height;
        let height: number = 0;

        let remainingHeight: number = Math.max(0, rect.height);
        for (let i: number = 0, len: number = chart.rows.length; i < len; i++) {
            row = <Row>chart.rows[i as number];
            if (row.height.indexOf('%') !== -1) {
                height = Math.min(remainingHeight, (rect.height * parseInt(row.height, 10) / 100));
            } else {
                height = Math.min(remainingHeight, parseInt(row.height, 10));
            }

            height = (i !== (len - 1)) ? height : remainingHeight;
            row.computedHeight = height;
            rowTop -= height;
            row.computedTop = rowTop;
            remainingHeight -= height;
        }
    }

    /**
     * Measure the row size.
     *
     * @param {Rect} rect rect
     * @returns {void}
     */
    private calculateColumnSize(rect: Rect): void {
        /*! Calculate column size */

        const chart: Chart = this.chart;
        let column: Column;
        let columnLeft: number = rect.x;
        let width: number = 0;

        let remainingWidth: number = Math.max(0, rect.width);

        for (let i: number = 0, len: number = chart.columns.length; i < len; i++) {
            column = <Column>chart.columns[i as number];
            if (column.width.indexOf('%') !== -1) {
                width = Math.min(remainingWidth, (rect.width * parseInt(column.width, 10) / 100));
            } else {
                width = Math.min(remainingWidth, parseInt(column.width, 10));
            }
            width = (i !== (len - 1)) ? width : remainingWidth;
            column.computedWidth = width;
            column.computedLeft = columnLeft;
            columnLeft += width;
            remainingWidth -= width;
        }
    }

    /**
     * To render the axis element.
     *
     * @returns {void}
     * @private
     */
    // tslint:disable-next-line:max-func-body-length
    public renderAxes(): Element {

        const chart: Chart = this.chart;
        let axis: Axis;
        const axisElement: Element = chart.renderer.createGroup({ id: chart.element.id + 'AxisInsideCollection' });
        const axisLineElement: Element = chart.renderer.createGroup({ id: chart.element.id + 'AxisOutsideCollection' });
        if (axisLineElement) { axisLineElement.setAttribute('aria-hidden', 'true'); }
        let outsideElement: Element; let isInside: boolean;

        for (let i: number = 0, len: number = chart.axisCollections.length; i < len; i++) {
            let axisVisibility: boolean = true;

            axis = chart.axisCollections[i as number];
            this.element = chart.renderer.createGroup({ id: chart.element.id + 'AxisGroup' + i + 'Inside' });
            if (this.element) { this.element.setAttribute('aria-hidden', 'true'); }
            outsideElement = chart.renderer.createGroup({ id: chart.element.id + 'AxisGroup' + i + 'Outside' });
            if (outsideElement) { outsideElement.setAttribute('aria-hidden', 'true'); }
            for (const series of axis.series) {
                if (axis.name === series.yAxisName || axis.name === series.xAxisName) {
                    axisVisibility = series.visible;
                    if (!axisVisibility) {
                        continue;
                    } else {
                        break;
                    }
                }
            }
            if (!axisVisibility) { continue; }
            isInside = this.findAxisPosition(axis);
            if (axis.orientation === 'Horizontal') {

                axis.updateCrossValue();

                if (axis.visible && axis.internalVisibility && axis.lineStyle.width > 0) {
                    this.drawAxisLine(
                        axis, i, axis.plotOffset, 0, 0, 0, axis.plotOffsetLeft, axis.plotOffsetRight, isInside ? outsideElement : this.element, axis.updatedRect
                    );
                }
                if (axis.majorGridLines.width > 0 || axis.majorTickLines.width > 0) {
                    this.drawXAxisGridLine(
                        axis, i, (isInside || axis.tickPosition === 'Inside') ? outsideElement : this.element, axis.updatedRect
                    );
                }
                if (axis.visible && axis.internalVisibility) {
                    this.drawXAxisLabels(
                        axis, i, (isInside || axis.labelPosition === 'Inside') ? outsideElement : this.element,
                        (axis.placeNextToAxisLine ? axis.updatedRect : axis.rect)
                    );
                    this.drawXAxisBorder(
                        axis, i, (isInside || axis.labelPosition === 'Inside') ? outsideElement : this.element,
                        (axis.placeNextToAxisLine ? axis.updatedRect : axis.rect)
                    );
                    this.drawXAxisTitle(
                        axis, i, isInside ? outsideElement : this.element, (axis.placeNextToAxisLine ? axis.updatedRect : axis.rect)
                    );
                }
            } else {
                axis.updateCrossValue();
                if (axis.visible && axis.internalVisibility && axis.lineStyle.width > 0) {
                    this.drawAxisLine(axis, i, 0, axis.plotOffset, axis.plotOffsetBottom, axis.plotOffsetTop, 0, 0, isInside ? outsideElement : this.element, axis.updatedRect);
                }
                if (axis.majorGridLines.width > 0 || axis.majorTickLines.width > 0) {
                    this.drawYAxisGridLine(
                        axis, i, (isInside || axis.tickPosition === 'Inside') ? outsideElement : this.element, axis.updatedRect
                    );
                }

                if (axis.visible && axis.internalVisibility) {
                    this.drawYAxisLabels(
                        axis, i, (isInside || axis.labelPosition === 'Inside') ? outsideElement : this.element,
                        (axis.placeNextToAxisLine ? axis.updatedRect : axis.rect)
                    );
                    this.drawYAxisBorder(
                        axis, i, (isInside || axis.labelPosition === 'Inside') ? outsideElement : this.element,
                        (axis.placeNextToAxisLine ? axis.updatedRect : axis.rect)
                    );
                    this.drawYAxisTitle(
                        axis, i, isInside ? outsideElement : this.element, (axis.placeNextToAxisLine ? axis.updatedRect : axis.rect)
                    );
                }
            }
            if (!this.chart.enableCanvas) {
                axisElement.appendChild(this.element);
                if (outsideElement && outsideElement.childNodes.length > 0) {
                    axisLineElement.appendChild(outsideElement);
                }
            }
            if (chart.scrollBarModule && ((chart.zoomSettings.enableScrollbar && axis.enableScrollbarOnZooming) ||
                axis.scrollbarSettings.enable)) {
                this.renderScrollbar(chart, axis);
            }
        }
        this.element = chart.renderer.createGroup({ id: chart.element.id + 'DefinitionLine' });
        for (let j: number = 0, len: number = chart.rows.length; j < len; j++) {
            const row: Row = <Row>chart.rows[j as number];
            if (row.border.color) {
                this.drawBottomLine(row, j, true);
            }
        }
        for (let j: number = 0, len: number = chart.columns.length; j < len; j++) {
            const column: Column = <Column>chart.columns[j as number];
            if (column.border.color) {
                this.drawBottomLine(column, j, false);
            }
        }
        if (!this.chart.enableCanvas) {
            axisElement.appendChild(this.element);
        }
        appendChildElement(chart.enableCanvas, chart.svgObject, axisElement, chart.redraw);

        return axisLineElement;
    }

    /**
     * To render the axis scrollbar
     *
     * @param {Chart} chart chart
     * @param {Axis} axis axis
     * @returns {void}
     */
    private renderScrollbar(chart: Chart, axis: Axis): void {
        const isZoomed: boolean = isNullOrUndefined(chart.zoomModule) ? false : chart.zoomModule.isZoomed;
        if (((isZoomed && (axis.zoomFactor < 1 || axis.zoomPosition > 0)) || (axis.scrollbarSettings.enable &&
            (axis.zoomFactor <= 1 || axis.zoomPosition >= 0))) &&
            (!axis.zoomingScrollBar.isScrollUI || chart.visibleSeries[0].type.indexOf('Bar') >= 0)) {
            if (!chart.scrollElement) {
                chart.scrollElement = redrawElement(chart.redraw, chart.element.id + '_scrollElement') || createElement(
                    'div', { id: chart.element.id + '_scrollElement' }
                );
            }
            appendChildElement(false, chart.scrollElement, axis.zoomingScrollBar.render(true), true);
        } else if (axis.zoomFactor === 1 && axis.zoomPosition === 0 && axis.zoomingScrollBar.svgObject && !axis.scrollbarSettings.enable) {
            axis.zoomingScrollBar.destroy();
        }
        if (axis.zoomingScrollBar.isScrollUI) {
            axis.zoomingScrollBar.isScrollUI = false;
        }
    }

    /**
     * To find the axis position
     *
     * @param {Axis} axis axis
     * @returns {boolean} axis position
     */
    private findAxisPosition(axis: Axis): boolean {
        return axis.crossAt !== null && axis.isInside(axis.crossInAxis.visibleRange);
    }

    /**
     * To render the bootom line of the columns and rows
     *
     * @param {Row | Column} definition definition
     * @param {number} index index
     * @param {boolean} isRow isRow
     * @returns {void}
     */
    private drawBottomLine(definition: Row | Column, index: number, isRow: boolean): void {
        const chart: Chart = this.chart;
        let optionsLine: Object = {};
        let x1: number; let x2: number;
        let y1: number; let y2: number;
        let definitionName: string;
        if (isRow) {
            definition = <Row>definition;
            y1 = y2 = definition.computedTop + definition.computedHeight;
            x1 = this.seriesClipRect.x;
            x2 = x1 + this.seriesClipRect.width;
            definitionName = 'Row';
        } else {
            definition = <Column>definition;
            x1 = x2 = definition.computedLeft;
            y1 = this.seriesClipRect.y;
            y2 = y1 + this.seriesClipRect.height;
            definitionName = 'Column';
        }
        optionsLine = {
            'id': chart.element.id + '_AxisBottom_' + definitionName + index,
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
            'stroke-width': definition.border.width,
            'stroke': definition.border.color
        };

        this.htmlObject = chart.renderer.drawLine(optionsLine) as HTMLElement;
        this.element.appendChild(this.htmlObject);
    }

    /**
     * To render the axis line
     *
     * @param {Axis} axis axis
     * @param {number} index index
     * @param {number} plotX plotX
     * @param {number} plotY plotY
     * @param {Element} parent parent
     * @param {Rect} rect rect
     * @returns {void}
     */
    private drawAxisLine(
        axis: Axis, index: number, plotX: number, plotY: number, plotBottom: number, plotTop: number, plotLeft: number, plotRight: number, parent: Element, rect: Rect
    ): void {
        const chart: Chart = this.chart;
        let optionsLine: Object = {};
        let element: Element = getElement(chart.element.id + 'AxisLine_' + index);
        const direction: string = element ? element.getAttribute('d') : '';
        element = null;
        optionsLine = {
            'id': chart.element.id + 'AxisLine_' + index,
            'd': 'M ' + (rect.x - plotX - plotLeft) + ' ' + (rect.y - plotY - plotTop) +
                ' L ' + (rect.x + rect.width + plotX + plotRight) + ' ' + (rect.y + rect.height + plotY + plotBottom),
            'stroke-dasharray': axis.lineStyle.dashArray,
            'stroke-width': axis.lineStyle.width,
            'stroke': axis.lineStyle.color || chart.themeStyle.axisLine
        };

        this.htmlObject = chart.renderer.drawPath(optionsLine) as HTMLElement;
        appendChildElement(chart.enableCanvas, parent, this.htmlObject, chart.redraw, true, 'x', 'y', null, direction);
    }

    /**
     * To render the yAxis grid line
     *
     * @param {Axis} axis axis
     * @param {number} index index
     * @param {Element} parent parent
     * @param {Rect} rect rect
     * @returns {void}
     */
    private drawYAxisGridLine(axis: Axis, index: number, parent: Element, rect: Rect): void {
        const isLogAxis: boolean = axis.valueType === 'Logarithmic';
        const isCategoryAxis: boolean = axis.valueType.indexOf('Category') > -1;
        let tempInterval: number;
        let pointY: number = 0;
        let majorGrid: string = '';
        let majorTick: string = '';
        let minorGridDirection: string[];
        const isOpposed : boolean = axis.isAxisOpposedPosition;
        const tickSize: number = isOpposed ? axis.majorTickLines.height : -axis.majorTickLines.height;
        const axisLineSize: number = (isOpposed) ? axis.lineStyle.width * 0.5 : -axis.lineStyle.width * 0.5;
        const ticksbwtLabel: number = (axis.valueType === 'Category' && axis.labelPlacement === 'BetweenTicks') ?
            0.5 : 0;
        const scrollBarHeight: number = isNullOrUndefined(axis.crossesAt) ? isOpposed ? axis.scrollBarHeight :
            -axis.scrollBarHeight : 0;
        const isTickInside: boolean = axis.tickPosition === 'Inside';
        const ticks: number = isTickInside ? (rect.x - tickSize - axisLineSize) : (rect.x + tickSize + axisLineSize + scrollBarHeight);
        let length: number = axis.visibleLabels.length;
        const chartThemeStyle: IThemeStyle = this.chart.themeStyle;
        if (axis.valueType.indexOf('Category') > -1 && axis.labelPlacement === 'BetweenTicks' && length > 0) {
            length += 1;
        }
        const minorGridLines: MinorGridLinesModel = axis.minorGridLines;
        const minorTickLines: MinorTickLinesModel = axis.minorTickLines;
        //Gridlines
        for (let i: number = 0; i < length; i++) {
            tempInterval = !axis.visibleLabels[i as number] ? (axis.visibleLabels[i - 1].value + axis.visibleRange.interval) - ticksbwtLabel
                : axis.visibleLabels[i as number].value - ticksbwtLabel;

            pointY = valueToCoefficient(tempInterval, axis) * rect.height;

            pointY = (pointY * -1) + (rect.y + rect.height);

            if (pointY >= rect.y && (rect.y + rect.height) >= pointY) {
                if ((inside(tempInterval, axis.visibleRange)) || this.isBorder(axis, i, pointY)) {
                    majorGrid = 'M ' + this.seriesClipRect.x + ' ' + (pointY) +
                        ' L ' + (this.seriesClipRect.x + this.seriesClipRect.width) + ' ' + pointY;
                    this.renderGridLine(
                        axis, index, majorGrid, axis.majorGridLines, '_MajorGridLine_', i, this.element,
                        chartThemeStyle.majorGridLine, axis.majorGridLines.dashArray
                    );
                }
                majorTick = 'M ' + (rect.x + axisLineSize + (isTickInside ? scrollBarHeight : 0)) + ' ' + pointY +
                    ' L ' + (ticks) + ' ' + pointY;
                this.renderGridLine(
                    axis, index, majorTick, axis.majorTickLines,
                    '_MajorTickLine_', i, parent, chartThemeStyle.majorTickLine
                );
                if ((minorGridLines.width > 0 || minorTickLines.width > 0) && axis.minorTicksPerInterval > 0) {
                    if (i === 0 && isZoomSet(axis) && !isLogAxis && !isCategoryAxis) {
                        this.renderMinorGridOnZooming(axis, tempInterval, rect, i, index, chartThemeStyle, parent);
                    }
                    minorGridDirection = this.drawAxisMinorLine(axis, tempInterval, rect, i);
                    this.renderGridLine(
                        axis, index, minorGridDirection[0], minorGridLines, '_MinorGridLine_', i, this.element,
                        chartThemeStyle.minorGridLine, minorGridLines.dashArray
                    );
                    this.renderGridLine(
                        axis, index, minorGridDirection[1], minorTickLines, '_MinorTickLine_', i,
                        parent, chartThemeStyle.minorTickLine
                    );
                    if (i === length - 1 && isZoomSet(axis) && isLogAxis && !isCategoryAxis) {
                        this.renderMinorGridOnZooming(
                            axis, (tempInterval + axis.visibleRange.interval), rect, i, index, chartThemeStyle, parent
                        );
                    }
                }
            }
        }
    }

    /**
     * To check the border of the axis
     *
     * @param {Axis} axis axis
     * @param {number} index index
     * @param {number} value value
     * @returns {boolean} check the border of the axis
     */
    private isBorder(axis: Axis, index: number, value: number): boolean {
        const border: BorderModel = this.chart.chartArea.border;
        const rect: Rect = this.seriesClipRect;
        const orientation: Orientation = axis.orientation;
        const start: number = (orientation === 'Horizontal') ? rect.x : rect.y;
        const size: number = (orientation === 'Horizontal') ? rect.width : rect.height;
        const startIndex: number = (orientation === 'Horizontal') ? 0 : axis.visibleLabels.length - 1;
        const endIndex: number = (orientation === 'Horizontal') ? axis.visibleLabels.length - 1 : 0;
        if (axis.plotOffset > 0) {
            return true;
        } else if ((value === start || value === (start + size)) && (border.width <= 0 || border.color === 'transparent')) {
            return true;
        } else if ((value !== start && index === startIndex) || (value !== (start + size) && index === endIndex)) {
            return true;
        }
        return false;
    }

    /**
     * To render the yAxis label
     *
     * @param {Axis} axis axis
     * @param {number} index index
     * @param {Element} parent parent
     * @param {Rect} rect rect
     * @returns {void}
     * @private
     */
    public drawYAxisLabels(axis: Axis, index: number, parent: Element, rect: Rect): void {
        const chart: Chart = this.chart; let label: VisibleLabels;
        let pointX: number = 0; let pointY: number = 0; let elementSize: Size;
        const labelSpace: number = axis.labelPadding;
        let options: TextOption; let isAxisBreakLabel: boolean;
        const isLabelInside: boolean = axis.labelPosition === 'Inside';
        const isOpposed: boolean = axis.isAxisOpposedPosition;
        const tickSpace: number = axis.labelPosition === axis.tickPosition ? axis.majorTickLines.height : 0;
        let padding: number = tickSpace + labelSpace + axis.lineStyle.width * 0.5;
        const angle: number = axis.angle % 360;
        const isVerticalAngle: boolean = (angle === -90 || angle === 90 || angle === 270 || angle === -270);
        padding += (isVerticalAngle) ? (isLabelInside ? 5 : -5) : 0;
        padding = (isOpposed) ? padding : -padding;
        const labelElement: Element = chart.renderer.createGroup({ id: chart.element.id + 'AxisLabels' + index });
        const scrollBarHeight: number = isNullOrUndefined(axis.crossesAt) ? axis.scrollBarHeight * (isOpposed ? 1 : -1) : 0;
        let textHeight: number; let textPadding: number; let maxLineWidth: number; const pixel: number = 10;
        const isInverse: boolean = axis.isAxisInverse;
        let previousEnd: number = isInverse ? rect.y : (rect.y + rect.height);
        let labelPadding: number; let intervalLength: number; let labelHeight: number; let yAxisLabelX: number;
        const isLabelOnAxisLineLeft: boolean = ((!isOpposed && !isLabelInside) || (isOpposed && isLabelInside));
        if (isLabelInside) {
            labelPadding = !isLabelOnAxisLineLeft ? -padding : padding;
        } else {
            labelPadding = !isLabelOnAxisLineLeft ? -padding + scrollBarHeight : padding + scrollBarHeight;
        }
        const sizeWidth: number[] = []; const breakLabelSizeWidth: number[] = [];
        axis.visibleLabels.map(item => {
            sizeWidth.push(item.size['width']);
            breakLabelSizeWidth.push(item.breakLabelSize['width']);
        });
        const LabelMaxWidth: number = Math.max(...sizeWidth);
        const breakLabelMaxWidth: number = Math.max(...breakLabelSizeWidth);
        for (let i: number = 0, len: number = axis.visibleLabels.length; i < len; i++) {
            label = axis.visibleLabels[i as number];
            isAxisBreakLabel = isBreakLabel(axis.visibleLabels[i as number].originalText);
            elementSize =  isAxisBreakLabel ? axis.visibleLabels[i as number].breakLabelSize : axis.visibleLabels[i as number].size;
            pointY = (valueToCoefficient(axis.visibleLabels[i as number].value, axis) * rect.height) + (chart.stockChart ? 7 : 0);
            pointY = Math.floor((pointY * -1) + (rect.y + rect.height));
            textHeight = ((elementSize.height / 8) * axis.visibleLabels[i as number].text.length / 2);
            textPadding = ((elementSize.height / 4) * 3) + 3;
            intervalLength = rect.height / axis.visibleLabels.length;
            labelHeight = ((axis.labelIntersectAction === 'Trim' || axis.labelIntersectAction === 'Wrap') && angle !== 0 &&
                elementSize.width > intervalLength) ? intervalLength : elementSize.width;
            pointY = (isAxisBreakLabel ? (axis.labelPosition === 'Inside' ? (pointY - (elementSize.height / 2) - textHeight + textPadding)
                : (pointY - textHeight)) : (axis.labelPosition === 'Inside' ? pointY + textPadding :  pointY));
            if (axis.labelPosition === 'Inside' && ((i === 0 && !axis.isInversed) || (i === len - 1 && axis.isInversed))) {
                if (chart.stockChart) { pointY -= (textPadding); }
                else { pointY -= (textPadding - (axis.opposedPosition ? -padding : padding)); }
            }
            if (axis.majorGridLines.width > axis.majorTickLines.width) {
                maxLineWidth = axis.majorGridLines.width;
            } else {
                maxLineWidth = axis.majorTickLines.width;
            }

            if (axis.labelStyle.textAlignment === 'Far') {
                pointY = pointY - maxLineWidth - pixel;
            } else if (axis.labelStyle.textAlignment === 'Near') {
                pointY = pointY + maxLineWidth + pixel;
            } else if (axis.labelStyle.textAlignment === 'Center') {
                // eslint-disable-next-line no-self-assign
                pointY = pointY;
            }

            // label X value adjustment (Start)
            if (isLabelInside) {
                yAxisLabelX = labelPadding + ((angle === 0 ? elementSize.width : (isAxisBreakLabel ? breakLabelMaxWidth : LabelMaxWidth)) / 2);
            } else {
                yAxisLabelX = labelPadding - ((angle === 0 ? elementSize.width : (isAxisBreakLabel ? breakLabelMaxWidth : LabelMaxWidth)) / 2);
            }
            pointX = isOpposed ? (rect.x - yAxisLabelX) : (rect.x + yAxisLabelX);
            if (isVerticalAngle) {
                pointX += (isOpposed) ? -10 : 10;
            }
            yAxisLabelX = labelPadding;
            options = new TextOption(chart.element.id + index + '_AxisLabel_' + i, pointX, pointY, 'middle', label.text, '', 'middle');
            switch (axis.edgeLabelPlacement) {
            case 'None':
                break;
            case 'Hide':
                if (((i === 0 || (isInverse && i === len - 1)) && options.y > rect.y) ||
                            (((i === len - 1) || (isInverse && i === 0)) && options.y - elementSize.height * 0.5 < rect.y)) {
                    options.text = '';
                }
                break;
            case 'Shift':
                if ((i === 0 || (isInverse && i === len - 1)) && options.y > rect.y) {
                    options.y = pointY = rect.y + rect.height;
                } else if (((i === len - 1) || (isInverse && i === 0)) && (options.y - elementSize.height * 0.5 < rect.y)) {
                    options.y = pointY = rect.y + elementSize.height * 0.5;
                }
                break;
            }

            // ------- Hide Calculation (Start) -------------
            let previousYValue: number = options.y; let currentYValue: number = options.y - labelHeight;
            if (isAxisBreakLabel) {
                previousYValue = (options.y - (labelHeight / 2)); currentYValue = options.y + (labelHeight / 2);
            }
            if ((angle === 90 || angle === 270) && axis.labelIntersectAction === 'Hide' && i !== 0 &&
                (!isInverse ? previousYValue >= previousEnd : currentYValue <= previousEnd)) {
                continue;
            }
            previousEnd = isInverse ? previousYValue : currentYValue;
            // ------- Hide Calculation (End) -------------
            options.transform = 'rotate(' + angle + ',' + pointX + ',' + pointY + ')';
            textElement(
                chart.renderer, options, label.labelStyle, label.labelStyle.color || chart.themeStyle.axisLabel,
                labelElement, false, chart.redraw, true, true, null, null, null, null, chart.enableCanvas
            );
        }
        if (!this.chart.enableCanvas) {
            if (!chart.delayRedraw) {
                appendChildElement(chart.enableCanvas, parent, labelElement, chart.redraw);
            } else if (axis.visible && axis.internalVisibility) {
                this.createZoomingLabel(this.chart, labelElement, axis, index, rect);
            }
        }
    }
    /**
     * To get X value based on lineBreakAlignment for Y axis line break labels only.
     *
     * @param {number} x text x position
     * @param {Axis} axis y axis values
     * @param {number} textWidth axis label width
     * @returns {number} returns suitable axis label x position
     */
    private getAxisLabelXvalue(x: number, axis: Axis, textWidth: number): number {
        const anchor: TextAlignment = axis.lineBreakAlignment;
        const isLabelInside: boolean = axis.labelPosition === 'Inside';
        const isOpposed: boolean = axis.isAxisOpposedPosition;
        if ((isOpposed && isLabelInside) || (!isOpposed && !isLabelInside)) {
            return (anchor === 'Right' ? x : (anchor === 'Center' ? (x - textWidth / 2) : (x - textWidth)));
        } else {
            return (anchor === 'Left' ? x : (anchor === 'Center' ? (x + textWidth / 2) : (x + textWidth)));
        }
    }

    /**
     * To render the yAxis label border.
     *
     * @param {Axis} axis axis
     * @param {number} index index
     * @param {Element} parent parent
     * @param {Rect} rect rect
     * @returns {void}
     */
    private drawYAxisBorder(axis: Axis, index: number, parent: Element, rect: Rect): void {
        if (axis.border.width > 0) {
            let startY: number; let pointY: number;
            let scrollBarHeight: number = axis.labelPosition === 'Outside' ? axis.scrollBarHeight : 0;
            const isOpposed: boolean = axis.isAxisOpposedPosition;
            scrollBarHeight = (isOpposed ? 1 : -1) * scrollBarHeight;
            const gap: number = (rect.height / axis.visibleRange.delta) * (axis.valueType === 'DateTime' ? axis.dateTimeInterval
                : axis.visibleRange.interval);
            let endY: number;
            const length: number = axis.maxLabelSize.width + 10 + ((axis.tickPosition === axis.labelPosition) ?
                axis.majorTickLines.height : 0);
            let labelBorder: string = '';
            const ticksbwtLabel: number = (axis.valueType === 'Category' && axis.labelPlacement === 'BetweenTicks') ? -0.5 : 0;
            const endX: number = ((isOpposed && axis.labelPosition === 'Inside') || (!isOpposed
                && axis.labelPosition === 'Outside')) ? rect.x - length + scrollBarHeight : rect.x + length + scrollBarHeight;
            for (let i: number = 0, len: number = axis.visibleLabels.length; i < len; i++) {
                pointY = valueToCoefficient(axis.visibleLabels[i as number].value + ticksbwtLabel, axis);
                pointY = (axis.isAxisInverse ? (1 - pointY) : pointY) * rect.height;
                if (axis.valueType === 'Category' && axis.labelPlacement === 'BetweenTicks') {
                    startY = (pointY * -1) + (rect.y + rect.height);
                    endY = (pointY * -1) - (gap) + (rect.y + rect.height);
                } else {
                    startY = (pointY * -1) + gap / 2 + (rect.y + rect.height);
                    endY = (pointY * -1) - gap / 2 + (rect.y + rect.height);
                }
                switch (axis.border.type) {
                case 'Rectangle':
                case 'WithoutTopBorder':
                    if (startY > (rect.y + rect.height)) {
                        labelBorder += ('M' + ' ' + endX + ' ' + (rect.y + rect.height) + ' ' + 'L' + ' ' + endX + ' ' + endY + ' ');
                    } else if (Math.floor(rect.y) > (endY)) {
                        labelBorder += ('M' + ' ' + (rect.x + scrollBarHeight) + ' ' + startY + ' ' + 'L' + ' ' + endX
                                + ' ' + startY + ' ' + 'L' + ' ' + endX + ' ' + (rect.y) + ' ');
                    } else {
                        labelBorder += ('M' + ' ' + (rect.x + scrollBarHeight) + ' ' + startY + ' ' + 'L' + ' ' + endX +
                                ' ' + startY + ' ' + 'L' + ' ' + endX + ' ' + endY + ' ');
                        if (i === axis.visibleLabels.length - 1) {
                            labelBorder += ('M' + ' ' + (rect.x + scrollBarHeight) + ' ' + endY + ' ' + 'L' + ' ' +
                                    endX + ' ' + endY + ' ');
                        }
                    }
                    break;
                case 'WithoutTopandBottomBorder':
                    if (!(startY > rect.y + rect.height) && !((endY) < Math.floor(rect.y))) {
                        labelBorder += ('M' + ' ' + (rect.x + scrollBarHeight) + ' ' + startY + ' ' + 'L' + ' ' + endX +
                                ' ' + startY + ' ' + 'M' + ' ' + endX + ' ' + endY + ' ' +
                                'L' + ' ' + (rect.x + scrollBarHeight) + ' ' + endY);
                    }
                    break;
                }
            }
            labelBorder += (axis.border.type === 'Rectangle') ? ('M' + ' ' + (rect.x + scrollBarHeight) + ' ' + rect.y + ' ' + 'L' + ' ' +
                (rect.x + scrollBarHeight) + ' ' + (rect.y + rect.height) + ' ') : '';
            if (labelBorder !== '') { this.createAxisBorderElement(axis, index, labelBorder, parent); }
        }
        if (axis.multiLevelLabels.length > 0 && this.chart.multiLevelLabelModule) {
            this.chart.multiLevelLabelModule.renderYAxisMultiLevelLabels(axis, index, parent, rect);
        }
    }

    /**
     * To render the yAxis title
     *
     * @param {Axis} axis axis
     * @param {number} index index
     * @param {Element} parent parent
     * @param {Rect} rect rect
     * @returns {void}
     */
    private drawYAxisTitle(axis: Axis, index: number, parent: Element, rect: Rect): void {
        if (axis.title) {
            const chart: Chart = this.chart; let isRotated: boolean = false;
            const isOpposed: boolean = axis.isAxisOpposedPosition;
            const labelRotation: number = (axis.titleRotation == null ? (isOpposed ? 90 : -90) : axis.titleRotation) % 360;
            let padding: number = (axis.tickPosition === 'Inside' ? 0 : axis.majorTickLines.height + axis.titlePadding) +
                (axis.labelPosition === 'Inside' ? 0 :
                    (axis.maxLabelSize.width + axis.multiLevelLabelHeight + this.padding));

            padding = isOpposed ? padding + axis.scrollBarHeight : -padding - axis.scrollBarHeight;

            if ((labelRotation !== -90 && !isOpposed) || (labelRotation !== 90 && isOpposed)) {
                padding += axis.isAxisOpposedPosition ? axis.titleSize.width / 2 + axis.labelPadding : -axis.titleSize.width / 2 - axis.labelPadding;
                isRotated = true;
            }
            const x: number =  rect.x + padding;

            const y: number = rect.y + rect.height * 0.5;
            const titleSize: number = (axis.titleSize.height * (axis.titleCollection.length - 1));
            const options: TextOption = new TextOption(
                chart.element.id + '_AxisTitle_' + index, x, y + (isRotated ? - titleSize : - axis.labelPadding - titleSize), 'middle',
                axis.titleCollection, 'rotate(' + labelRotation + ',' + (x) + ',' + (y) + ')', null, labelRotation
            );
            const element: Element = textElement(
                chart.renderer, options, axis.titleStyle, axis.titleStyle.color || chart.themeStyle.axisTitle, parent, null, null,
                null, null, null, null, null, null, chart.enableCanvas
            );
            element.setAttribute('aria-hidden', 'true');
        }
    }

    /**
     * xAxis grid line calculation performed here
     *
     * @param {Axis} axis axis
     * @param {number} index index
     * @param {Element} parent parent
     * @param {Rect} rect rect
     * @returns {void}
     */
    private drawXAxisGridLine(axis: Axis, index: number, parent: Element, rect: Rect): void {
        const isLogAxis: boolean = axis.valueType === 'Logarithmic';
        const isCategoryAxis: boolean = axis.valueType.indexOf('Category') > -1;
        let tempInterval: number;
        let pointX: number = 0;
        let majorGrid: string = '';
        let majorTick: string = '';
        let minorDirection: string[];
        const isOpposed : boolean = axis.isAxisOpposedPosition;
        const tickSize: number = (isOpposed) ? -axis.majorTickLines.height : axis.majorTickLines.height;
        const axisLineSize: number = (isOpposed) ? -axis.lineStyle.width * 0.5 : axis.lineStyle.width * 0.5;
        const scrollBarHeight: number = isNullOrUndefined(axis.crossesAt) ? isOpposed ? -axis.scrollBarHeight :
            axis.scrollBarHeight : 0;
        const ticksbwtLabel: number = (axis.valueType.indexOf('Category') > -1 && axis.labelPlacement === 'BetweenTicks') ?
            0.5 : 0;
        let length: number = axis.visibleLabels.length;
        const isTickInside: boolean = axis.tickPosition === 'Inside';
        const ticks: number = isTickInside ? (rect.y - tickSize - axisLineSize) : (rect.y + tickSize + axisLineSize + scrollBarHeight);
        const chartThemeStyle: IThemeStyle = this.chart.themeStyle;
        if (axis.valueType.indexOf('Category') > -1 && length > 0 && axis.labelPlacement === 'BetweenTicks') {
            length += 1;
        }
        //Gridlines
        for (let i: number = 0; i < length; i++) {
            if (axis.valueType !== 'DateTimeCategory') {
                tempInterval = axis.visibleLabels[i as number] ? axis.visibleLabels[i as number].value - ticksbwtLabel
                    : (axis.visibleLabels[i - 1].value + axis.visibleRange.interval) - ticksbwtLabel;
            } else {
                tempInterval = axis.visibleLabels[i as number] ?
                    axis.visibleLabels[i as number].value - ticksbwtLabel : axis.visibleRange.max;
            }

            pointX = (valueToCoefficient(tempInterval, axis) * rect.width) + rect.x;

            if (pointX >= rect.x && (rect.x + rect.width) >= pointX) {
                if (inside(tempInterval, axis.visibleRange) || this.isBorder(axis, i, pointX)) {
                    majorGrid = 'M ' + pointX + ' ' + (this.seriesClipRect.y + this.seriesClipRect.height) +
                        ' L ' + pointX + ' ' + this.seriesClipRect.y;
                    this.renderGridLine(
                        axis, index, majorGrid, axis.majorGridLines, '_MajorGridLine_', i,
                        this.element, chartThemeStyle.majorGridLine, axis.majorGridLines.dashArray
                    );
                }
                majorTick = 'M ' + (pointX) + ' ' + (rect.y + axisLineSize + (isTickInside ? scrollBarHeight : 0))
                    + ' L ' + (pointX) + ' ' + ticks;
                this.renderGridLine(
                    axis, index, majorTick, axis.majorTickLines, '_MajorTickLine_', i,
                    parent, chartThemeStyle.majorTickLine
                );
                if (axis.minorTicksPerInterval > 0 && (axis.minorGridLines.width > 0 || axis.minorTickLines.width > 0)) {
                    if (i === 0 && isZoomSet(axis) && !isLogAxis && !isCategoryAxis) {
                        this.renderMinorGridOnZooming(axis, tempInterval, rect, i, index, chartThemeStyle, parent);
                    }
                    minorDirection = this.drawAxisMinorLine(axis, tempInterval, rect, i);
                    this.renderGridLine(
                        axis, index, minorDirection[0], axis.minorGridLines, '_MinorGridLine_', i,
                        this.element, chartThemeStyle.minorGridLine, axis.minorGridLines.dashArray
                    );
                    this.renderGridLine(
                        axis, index, minorDirection[1], axis.minorTickLines, '_MinorTickLine_',
                        i, parent, chartThemeStyle.minorTickLine
                    );
                    if (i === length - 1 && isZoomSet(axis) && isLogAxis && !isCategoryAxis) {
                        this.renderMinorGridOnZooming(
                            axis, (tempInterval + axis.visibleRange.interval), rect, i, index, chartThemeStyle, parent
                        );
                    }
                }
            }
        }
    }
    /**
     * To render missing minor grid lines while zooming
     *
     * @param {Axis} axis axis
     * @param {number} tempInterval tempInterval
     * @param {Rect} rect rect
     * @param {number} i i
     * @param {number} index index
     * @param {IThemeStyle} chartThemeStyle chartThemeStyle
     * @param {Element} parent parent
     * @returns {void}
     */
    private renderMinorGridOnZooming(
        axis: Axis, tempInterval: number, rect: Rect, i: number, index: number, chartThemeStyle: IThemeStyle, parent: Element
    ): void {
        const minorDirection: string[] = this.drawAxisMinorLine(axis, tempInterval, rect, i, true);
        this.renderGridLine(
            axis, index, minorDirection[0], axis.minorGridLines, '_MinorGridLine_', -1,
            this.element, chartThemeStyle.minorGridLine, axis.minorGridLines.dashArray
        );
        this.renderGridLine(
            axis, index, minorDirection[1], axis.minorTickLines, '_MinorTickLine_',
            -1, parent, chartThemeStyle.minorTickLine
        );
    }

    /**
     * To calcualte the axis minor line
     *
     * @param {Axis} axis axis
     * @param {number} tempInterval tempInterval
     * @param {Rect} rect rect
     * @param {number} labelIndex labelIndex
     * @param {boolean} isFirstLabel isFirstLabel
     * @returns {string[]} axis minor line path
     */
    private drawAxisMinorLine(
        axis: Axis, tempInterval: number, rect: Rect, labelIndex: number, isFirstLabel?: boolean): string[] {
        let value: number = tempInterval;
        let coor: number = 0;
        let position: number = 0;
        const range: VisibleRangeModel = axis.visibleRange;
        const isTickInside: boolean = axis.tickPosition === 'Inside';
        const direction: string[] = [];
        const tickSize: number = axis.isAxisOpposedPosition ? -axis.minorTickLines.height : axis.minorTickLines.height;
        let logStart: number;
        let logEnd: number;
        let logInterval: number = 1;
        let logPosition: number = 1;
        const ticksX: number = isTickInside ? (rect.y - tickSize) : (rect.y + tickSize);
        const ticksY: number = isTickInside ? (rect.x + tickSize) : (rect.x - tickSize);
        let minorGird: string = '';
        let minorTick: string = '';
        const isInverse: boolean = axis.isAxisInverse;
        if (axis.valueType === 'Logarithmic') {
            logStart = Math.pow(axis.logBase, value - range.interval);
            logEnd = Math.pow(axis.logBase, value);
            logInterval = (logEnd - logStart) / (axis.minorTicksPerInterval + 1);
            logPosition = logStart + logInterval;
        }
        if (axis.orientation === 'Horizontal') {
            for (let j: number = 0; j < axis.minorTicksPerInterval; j++) {
                value = this.findLogNumeric(axis, logPosition, value, labelIndex, isFirstLabel);
                logPosition += logInterval;
                if (inside(value, range)) {
                    position = ((value - range.min) / (range.max - range.min));
                    position = Math.ceil((isInverse ? (1 - position) : position) * rect.width);
                    coor = (Math.floor(position + rect.x));
                    minorGird = minorGird.concat('M' + ' ' + coor + ' ' + (this.seriesClipRect.y)
                        + 'L ' + coor + ' ' + (this.seriesClipRect.y + this.seriesClipRect.height));
                    coor = (Math.floor(position + rect.x));
                    minorTick = minorTick.concat('M' + ' ' + coor + ' ' + (rect.y)
                        + 'L ' + coor + ' ' + (ticksX + axis.scrollBarHeight));
                }
            }
        } else {
            for (let j: number = 0; j < axis.minorTicksPerInterval; j++) {
                value = this.findLogNumeric(axis, logPosition, value, labelIndex, isFirstLabel);
                if (inside(value, range)) {
                    position = ((value - range.min) / (range.max - range.min));
                    position = Math.ceil(((isInverse ? (1 - position) : position)) * rect.height) * -1; // For inversed axis
                    coor = (Math.floor(position + rect.y + rect.height));
                    minorGird = minorGird.concat('M' + ' ' + (this.seriesClipRect.x) + ' ' + coor
                        + 'L ' + (this.seriesClipRect.x + this.seriesClipRect.width) + ' ' + coor + ' ');
                    coor = (Math.floor(position + rect.y + rect.height));
                    minorTick = minorTick.concat('M' + ' ' + rect.x + ' ' + coor + 'L ' + (ticksY - axis.scrollBarHeight) +
                        ' ' + coor + ' ');
                }
                logPosition += logInterval;
            }
        }
        direction.push(minorGird);
        direction.push(minorTick);
        return direction;
    }

    /**
     * To find the numeric value of the log
     *
     * @param {Axis} axis axis
     * @param {number} logPosition logPosition
     * @param {number} value value
     * @param {number} labelIndex labelIndex
     * @param {boolean} isFirstLabel isFirstLabel
     * @returns {number} value
     */
    private findLogNumeric(axis: Axis, logPosition: number, value: number, labelIndex: number, isFirstLabel?: boolean): number {
        const range: VisibleRangeModel = axis.visibleRange;
        let tempValue: number;
        if (axis.valueType === 'Logarithmic') {
            value = logBase(logPosition, axis.logBase);
        } else if (axis.valueType === 'DateTime') {
            tempValue = axis.dateTimeInterval / (axis.minorTicksPerInterval + 1);
            value = isFirstLabel ? (value - tempValue) : (value + tempValue);
        } else if (axis.valueType === 'DateTimeCategory') {
            const padding: number = axis.labelPlacement === 'BetweenTicks' ? 0.5 : 0;
            value += ((axis.visibleLabels[labelIndex + 1] ?
                axis.visibleLabels[labelIndex + 1].value - padding : axis.visibleRange.max) -
                (axis.visibleLabels[labelIndex as number] ?
                    axis.visibleLabels[labelIndex as number].value - padding : axis.visibleRange.min)) /
                (axis.minorTicksPerInterval + 1);
        } else {
            tempValue = range.interval / (axis.minorTicksPerInterval + 1);
            value = isFirstLabel ? (value - tempValue) : (value + tempValue);
        }
        return value;
    }

    /**
     * To render the xAxis Labels
     *
     * @param {Axis} axis axis
     * @param {number} index index
     * @param {Element} parent parent
     * @param {Rect} rect rect
     * @returns {void}
     * @private
     */
    public drawXAxisLabels(axis: Axis, index: number, parent: Element, rect: Rect): void {
        const chart: Chart = this.chart; let pointX: number = 0; let pointY: number = 0;
        const labelSpace: number = axis.labelPadding; let labelHeight: number;
        let elementSize: Size; let labelPadding: number; let anchor: string; const pixel: number = 10;
        const labelElement: Element = chart.renderer.createGroup({ id: chart.element.id + 'AxisLabels' + index });
        const islabelInside: boolean = axis.labelPosition === 'Inside'; const isOpposed: boolean = axis.isAxisOpposedPosition;
        const tickSpace: number = axis.labelPosition === axis.tickPosition ? axis.majorTickLines.height : 0;
        let padding: number = tickSpace + labelSpace + axis.lineStyle.width * 0.5;
        const angle: number = axis.angle % 360;
        const isHorizontalAngle: boolean = (angle === 0 || angle === -180 || angle === 180);
        let options: TextOption; let labelWidth: number;
        const isInverse: boolean = axis.isAxisInverse;
        let previousEnd: number = isInverse ? (rect.x + rect.width) : rect.x;
        let width: number = 0; const length: number = axis.visibleLabels.length;
        let intervalLength: number; let label: VisibleLabels; let isAxisBreakLabel: boolean;
        const scrollBarHeight: number = axis.scrollbarSettings.enable || (!islabelInside && isNullOrUndefined(axis.crossesAt)
            && (axis.zoomFactor < 1 || axis.zoomPosition > 0)) ? axis.scrollBarHeight : 0;
        const newPoints: ChartLocation[][] = []; let isRotatedLabelIntersect: boolean = false;
        const textPoints: ChartLocation[][] = [];
        padding += (angle === 90 || angle === 270 || angle === -90 || angle === -270) ? (islabelInside ? 5 : -5) : 0;
        const isLabelUnderAxisLine: boolean = ((!isOpposed && !islabelInside) || (isOpposed && islabelInside));
        const isEndAnchor: boolean = isLabelUnderAxisLine ?
            ((360 >= angle && angle >= 180) || (-1 >= angle && angle >= -180)) :
            ((1 <= angle && angle <= 180) || (-181 >= angle && angle >= -360));
        for (let i: number = 0, len: number = length; i < len; i++) {
            label = axis.visibleLabels[i as number];
            isAxisBreakLabel = isBreakLabel(label.originalText);
            pointX = (valueToCoefficient(label.value, axis) * rect.width) + rect.x;
            elementSize = label.size;
            intervalLength = rect.width / length;
            labelWidth = isAxisBreakLabel ? label.breakLabelSize.width : elementSize.width;
            width = ((axis.labelIntersectAction === 'Trim' || axis.labelIntersectAction === 'Wrap') && angle === 0 &&
                    labelWidth > intervalLength) ? intervalLength : labelWidth;
            labelHeight = elementSize.height / 4;
            pointX -= (isAxisBreakLabel || angle !== 0) ? 0 : (width / 2);

            // label X value adjustment for label rotation (Start)
            if (angle !== 0) {
                if (isAxisBreakLabel) {
                    pointX -= axis.lineBreakAlignment === 'Left' ? (label.breakLabelSize.width / 2) : axis.lineBreakAlignment === 'Right' ?
                        -(label.breakLabelSize.width / 2) : 0;
                } else {
                    pointX -= (angle === -90 || angle === 270 ? -labelHeight : (angle === 90 || angle === -270) ? labelHeight : 0);
                }
            }
            // label X value adjustment for label rotation (End)

            if (axis.labelStyle.textAlignment === 'Far') {
                pointX = pointX + width - pixel;
            } else if (axis.labelStyle.textAlignment === 'Near') {
                pointX = pointX - width + pixel;
            } else if (axis.labelStyle.textAlignment === 'Center') {
                // eslint-disable-next-line no-self-assign
                pointX = pointX;
            }

            // For line break label alignment like left, right & center in angle 0
            if (isAxisBreakLabel && axis.lineBreakAlignment !== 'Center' && angle === 0) {
                pointX += axis.lineBreakAlignment === 'Left' ? -(width / 2) : (width / 2);
            }
            const paddingForBreakLabel: number = isAxisBreakLabel ?
                (isHorizontalAngle ? (elementSize.height) : (label.breakLabelSize.width / 2)) : 0;
            padding = isAxisBreakLabel ? (tickSpace + labelSpace + axis.lineStyle.width * 0.5) : padding;

            // label Y value adjustment (Start)
            if (islabelInside && angle) {
                if (isAxisBreakLabel) {
                    pointY = isOpposed ? (rect.y + padding + (paddingForBreakLabel)) : (rect.y - padding - (paddingForBreakLabel));
                } else {
                    pointY = isOpposed ? (rect.y + padding + labelHeight) : (rect.y - padding - labelHeight);
                }
            } else {
                if (isAxisBreakLabel) {
                    labelPadding = !isLabelUnderAxisLine ? -(padding + scrollBarHeight + (paddingForBreakLabel)) :
                        padding + scrollBarHeight + (angle ? paddingForBreakLabel : (3 * labelHeight));
                } else {
                    labelPadding = !isLabelUnderAxisLine ?
                        -(padding + scrollBarHeight + (angle ? labelHeight : (label.index > 1 ? (2 * labelHeight) : 0))) :
                        padding + scrollBarHeight + ((angle ? 1 : 3) * labelHeight);
                }
                pointY = (rect.y + (labelPadding * label.index));
            }
            // label Y value adjustment (End)

            if (isAxisBreakLabel) {
                anchor = this.getAnchor(axis); // for break label self alignment
            } else {
                anchor = (chart.enableRtl) ? ((isEndAnchor) ? '' : 'end') : (chart.isRtlEnabled || isEndAnchor) ? 'end' : '';
            }
            options = new TextOption(chart.element.id + index + '_AxisLabel_' + i, pointX, pointY, anchor);
            if (axis.edgeLabelPlacement) {
                switch (axis.edgeLabelPlacement) {
                case 'None':
                    break;
                case 'Hide':
                    if (((i === 0 || (isInverse && i === len - 1)) && options.x < rect.x) ||
                            ((i === len - 1 || (isInverse && i === 0)) && (options.x + width > rect.x + rect.width))) {
                        continue;
                    }
                    break;
                case 'Shift':
                    if ((i === 0 || (isInverse && i === len - 1)) && options.x < rect.x) {
                        intervalLength -= (rect.x - options.x);
                        if (!(anchor === 'start' && options.x > 0)) {
                            options.x = pointX = !isHorizontalAngle ? rect.x + padding : rect.x;
                        }
                    } else if ((i === len - 1 || (isInverse && i === 0)) && ((options.x + width) > rect.x + rect.width)) {
                        if (elementSize.width > intervalLength && axis.labelIntersectAction === 'Trim') {
                            intervalLength -= (options.x + width - (rect.x + rect.width));
                        } else {
                            intervalLength = width;
                        }
                        options.x = pointX = !isHorizontalAngle ? rect.x + rect.width - intervalLength / 2 : rect.x + rect.width - intervalLength;
                    }
                    if (this.chart.primaryYAxis.opposedPosition && i === 0 && options.x <= rect.x) {
                        intervalLength -= (rect.x - options.x);
                        options.x += rect.x + (width / 2);
                        pointX += rect.x + (width / 2);
                    }
                    break;
                }
            }
            options.text =  this.getLabelText(label, axis, intervalLength);

            // ------- Hide Calculation (Start) -------------
            // Currect label actual start value (Start)
            let xValue: number; let xValue2: number;
            if (isAxisBreakLabel && angle === 0) {
                if (axis.lineBreakAlignment === 'Right') {
                    xValue = (options.x - width); xValue2 = options.x;
                } else if (axis.lineBreakAlignment === 'Center') {
                    xValue = (options.x - (width / 2)); xValue2 = options.x + (width / 2);
                } else {
                    xValue = options.x; xValue2 = options.x + width;
                }

            } else {
                xValue = options.x; xValue2 = options.x + width;
            }
            // Currect label actual start value (End)

            if (angle === 0 && axis.labelIntersectAction === 'Hide' && i !== 0 &&
                (!isInverse ? xValue <= previousEnd : xValue2 >= previousEnd)) {
                continue;
            }

            // Previous label actual end value (Start)
            if (isAxisBreakLabel) {
                if (axis.lineBreakAlignment === 'Right') {
                    previousEnd = isInverse ? (options.x - width) : options.x;
                } else if (axis.lineBreakAlignment === 'Center') {
                    previousEnd = isInverse ? (options.x - (width / 2)) : options.x + (width / 2);
                } else {
                    previousEnd = isInverse ? options.x : options.x + width;
                }
            } else {
                previousEnd = isInverse ? options.x : options.x + width;
            }
            // Previous label actual end value (End)
            // ------- Hide Calculation (End) -------------

            // label Rotataion calculation (Start)
            if (angle !== 0) {
                let height: number; let rect: Rect;
                if (isAxisBreakLabel) {
                    let xAdjustment: number = 0; let yAdjustment: number = 0;
                    height = (label.breakLabelSize.height);
                    yAdjustment = (label.breakLabelSize.height) - 4; // 4 for label bound correction

                    // xAdjustment (Start)
                    if (axis.lineBreakAlignment === 'Center') {
                        xAdjustment = -(label.breakLabelSize.width / 2);
                    } else if (axis.lineBreakAlignment === 'Right') {
                        xAdjustment = -label.breakLabelSize.width;
                    }
                    // xAdjustment (End)

                    if (isLabelUnderAxisLine) {
                        yAdjustment = (label.breakLabelSize.height) / (options.text.length + 1);
                    }
                    rect = new Rect(options.x + xAdjustment, options.y - (yAdjustment), label.breakLabelSize.width, height);
                } else {
                    height = (pointY) - (options.y - ((label.size.height / 2)));
                    rect = new Rect(options.x, options.y - ((label.size.height / 2) - 5), label.size.width, height);
                }
                const rectCoordinates: ChartLocation[] = this.getRectanglePoints(rect);
                const rectCenterX: number = isAxisBreakLabel ? rect.x + (rect.width / 2) : pointX;
                const rectCenterY: number = isAxisBreakLabel ? rect.y + (rect.height / 2) : (pointY - (height / 2));
                if (isAxisBreakLabel) {
                    options.transform = 'rotate(' + angle + ',' + rectCenterX + ',' + rectCenterY + ')';
                } else {
                    options.transform = 'rotate(' + angle + ',' + pointX + ',' + pointY + ')';
                }
                newPoints.push(getRotatedRectangleCoordinates(rectCoordinates, rectCenterX, rectCenterY, angle));
                isRotatedLabelIntersect = false;
                if (axis.labelIntersectAction !== 'None') {
                    for (let index: number = i; index > 0; index--) {
                        if (newPoints[i as number] && newPoints[index - 1] && isRotatedRectIntersect(newPoints[i as number], newPoints[index - 1])) {
                            isRotatedLabelIntersect = true; newPoints[i as number] = null;
                            break;
                        }
                    }
                }
                const rotateAngle: boolean = ((angle > 0 && angle < 90) || (angle > 180 && angle < 270) || (angle < -90 && angle > -180) || (angle < -270 && angle > -360));
                const textRect: Rect = new Rect(options.x, options.y - (elementSize.height / 2 + padding / 2), label.size.width, height);
                const textRectCoordinates: ChartLocation[] = this.getRectanglePoints(textRect);
                const rectPoints = [];
                rectPoints.push(new ChartLocation(rotateAngle ? this.chart.availableSize.width - padding : this.padding, axis.rect.y));
                rectPoints.push(new ChartLocation(rotateAngle ? this.chart.availableSize.width - padding : this.padding, axis.rect.y + axis.maxLabelSize.height));
                textPoints.push(getRotatedRectangleCoordinates(textRectCoordinates, rectCenterX, rectCenterY, angle));
                const newRect: Rect = new Rect(0, axis.rect.y, this.chart.availableSize.width - padding, axis.maxLabelSize.height * 2);
                for (let k: number = 0; k < textPoints[i as number].length; k++) {
                    if (!axis.opposedPosition && !withInBounds(textPoints[i as number][k as number].x, textPoints[i as number][k as number].y, newRect) && typeof options.text === 'string') {
                        const interSectPoint: ChartLocation = this.calculateIntersection(textPoints[i as number][0], textPoints[i as number][1], rectPoints[0], rectPoints[1]);
                        const rectPoint1: number = rotateAngle ? this.chart.availableSize.width - padding- pointX : pointX;
                        const rectPoint2: number = interSectPoint.y - axis.rect.y;
                        const trimValue: number = Math.sqrt((rectPoint1 * rectPoint1) + (rectPoint2 * rectPoint2));
                        options.text = textTrim(trimValue, label.text as string, label.labelStyle);
                    }
                }
            }
            // label Rotataion calculation (End)

            textElement(
                chart.renderer, options, label.labelStyle, label.labelStyle.color || chart.themeStyle.axisLabel,
                labelElement, (axis.isAxisOpposedPosition !== (axis.labelPosition === 'Inside')), chart.redraw, true,
                null, null, null, label.size, isRotatedLabelIntersect, chart.enableCanvas
            );
        }
        if (!this.chart.enableCanvas) {
            if (!chart.delayRedraw) {
                parent.appendChild(labelElement);
            } else if (axis.visible && axis.internalVisibility) {
                this.createZoomingLabel(this.chart, labelElement, axis, index, rect);
            }
        }
    }

    public calculateIntersection(p1: ChartLocation, p2: ChartLocation, p3: ChartLocation, p4: ChartLocation): ChartLocation {
        const c2x: number = p3.x - p4.x;
        const c3x: number = p1.x - p2.x;
        const c2y: number = p3.y - p4.y;
        const c3y: number = p1.y - p2.y;
        const d: number = c3x * c2y - c3y * c2x;
        const u1: number = p1.x * p2.y - p1.y * p2.x;
        const u4: number = p3.x * p4.y - p3.y * p4.x;
        const px: number = (u1 * c2x - c3x * u4) / d;
        const py: number = (u1 * c2y - c3y * u4) / d;
        const p: ChartLocation = { x: px, y: py };
        return p;
    }
    /**
     * To get text anchor value for line break labels.
     *
     * @param {Axis} axis axis model
     * @returns {string} returns text anchor
     */
    private getAnchor(axis: Axis): string {
        return (axis.lineBreakAlignment === 'Center' ? 'middle' : (this.chart.enableRtl) ? (axis.lineBreakAlignment === 'Left' ? 'end' : 'start') : (axis.lineBreakAlignment === 'Left' ? 'start' : 'end'));
    }
    /**
     * Get rect coordinates
     *
     * @param {Rect} rect rect
     * @returns {ChartLocation[]} rectangle points
     */
    private getRectanglePoints(rect: Rect): ChartLocation[] {
        const point1: ChartLocation = new ChartLocation(rect.x, rect.y);
        const point2: ChartLocation = new ChartLocation(rect.x + rect.width, rect.y);
        const point3: ChartLocation = new ChartLocation(rect.x + rect.width, rect.y + rect.height);
        const point4: ChartLocation = new ChartLocation(rect.x, rect.y + rect.height);
        return [point1, point2, point3, point4];
    }

    /**
     * To get axis label text
     *
     * @param {VisibleLabels} label label
     * @param {Axis} axis axis
     * @param {number} intervalLength intervalLength
     * @returns {string | string[]} label or label collection
     */
    private getLabelText(label: VisibleLabels, axis: Axis, intervalLength: number): string | string[] {
        if (isBreakLabel(label.originalText)) {
            const result: string[] = []; let str: string;
            for (let index: number = 0; index < label.text.length; index++) {
                str = this.findAxisLabel(axis, <string>label.text[index as number], intervalLength);
                result.push(str);
            }
            return result;
        } else {
            return this.findAxisLabel(axis, <string>label.text, intervalLength);
        }
    }

    /**
     * To render the x-axis label border.
     *
     * @param {Axis} axis axis
     * @param {number} index index
     * @param {Element} parent parent
     * @param {Rect} axisRect axisRect
     * @returns {void}
     */
    private drawXAxisBorder(axis: Axis, index: number, parent: Element, axisRect: Rect): void {
        if (axis.border.width > 0) {
            const scrollBarHeight: number = axis.labelPosition === 'Outside' ? axis.scrollBarHeight : 0;
            const isOpposed : boolean = axis.isAxisOpposedPosition;
            let startX: number; const startY: number = axisRect.y + ((isOpposed ? -1 : 1) * scrollBarHeight);
            const padding: number = 10; let pointX: number;
            const gap: number = (axisRect.width / axis.visibleRange.delta) * (axis.valueType === 'DateTime' ? axis.dateTimeInterval
                : axis.visibleRange.interval);
            let endX: number;
            const length: number = axis.maxLabelSize.height +
                ((axis.tickPosition === axis.labelPosition) ? axis.majorTickLines.height : 0);
            let labelBorder: string = '';
            const ticksbwtLabel: number = (axis.valueType === 'Category' && axis.labelPlacement === 'BetweenTicks') ? -0.5 : 0;
            const endY: number = ((isOpposed && axis.labelPosition === 'Inside') ||
                (!isOpposed && axis.labelPosition === 'Outside')) ?
                (axisRect.y + length + padding + scrollBarHeight) : (axisRect.y - length - padding - scrollBarHeight);
            for (let i: number = 0, len: number = axis.visibleLabels.length; i < len; i++) {
                pointX = valueToCoefficient(axis.visibleLabels[i as number].value + ticksbwtLabel, axis);
                pointX = (axis.isAxisInverse ? (1 - pointX) : pointX) * axisRect.width;
                if (axis.valueType === 'Category' && axis.labelPlacement === 'BetweenTicks') {
                    startX = pointX + axisRect.x; endX = pointX + (gap) + axisRect.x;
                } else {
                    startX = pointX - gap * 0.5 + axisRect.x; endX = pointX + gap * 0.5 + axisRect.x;
                }
                switch (axis.border.type) {
                case 'Rectangle':
                case 'WithoutTopBorder':
                    if (startX < axisRect.x && axis.labelPlacement !== 'OnTicks') {
                        labelBorder += ('M' + ' ' + axisRect.x + ' ' + endY + ' ' + 'L' + ' ' + endX + ' ' + endY + ' ');
                    } else if (Math.floor(endX) > axisRect.width + axisRect.x && !(axis.visibleLabels.length === 1) && !(i === axis.visibleLabels.length - 1)) {
                        labelBorder += ('M' + ' ' + startX + ' ' + startY + ' ' + 'L' + ' ' + startX + ' ' + endY + ' ' +
                                'L' + ' ' + (axisRect.width + axisRect.x) + ' ' + endY + ' ');
                    } else {
                        startX = (i === 0 && axis.labelPlacement === 'OnTicks') ? axisRect.x : startX;
                        endX = ((i === axis.visibleLabels.length - 1) && axis.labelPlacement === 'OnTicks') ? endX - gap * 0.5 : endX;
                        labelBorder += ('M' + ' ' + startX + ' ' + startY + ' ' + 'L' + ' ' + startX + ' ' +
                                endY + ' ' + 'L' + ' ' + endX + ' ' + endY + ' ');
                        if (i === 0) {
                            labelBorder += ('M' + ' ' + startX + ' ' + startY + ' ' + 'L' + ' ' + startX + ' ' + endY + ' ' +
                                    'M ' + startX + ' ' + endY + ' L ' + (axisRect.x) + ' ' + endY);
                        }
                        if (i === axis.visibleLabels.length - 1) {
                            labelBorder += ('M' + ' ' + endX + ' ' + startY + ' ' + 'L' + ' ' + endX + ' ' + endY + ' ' +
                                    'M ' + endX + ' ' + endY + ' L ' + (axisRect.width + axisRect.x) + ' ' + endY);
                        }
                    }
                    break;
                case 'WithoutTopandBottomBorder':
                    if (!(startX < axisRect.x) && !(Math.floor(endX) > axisRect.width + axisRect.x)) {
                        labelBorder += ('M' + ' ' + startX + ' ' + startY + ' ' + 'L' + ' ' + startX + ' ' + endY + ' ' +
                                'M ' + endX + ' ' + startY + ' L ' + endX + ' ' + endY);
                    }
                    break;
                }
            }
            labelBorder += (axis.border.type === 'Rectangle' ? ('M ' + ' ' + axisRect.x + ' ' + startY + 'L' + ' ' +
                (axisRect.x + axisRect.width) + ' ' + startY) : '');
            if (labelBorder !== '') { this.createAxisBorderElement(axis, index, labelBorder, parent); }
        }
        if (this.chart.multiLevelLabelModule && axis.multiLevelLabels.length > 0) {
            this.chart.multiLevelLabelModule.renderXAxisMultiLevelLabels(axis, index, parent, axisRect);
        }
    }

    /**
     * To create border element of the axis
     *
     * @param {Axis} axis axis
     * @param {number} index index
     * @param {string} labelBorder labelBorder
     * @param {Element} parent parent
     * @returns {void}
     */
    private createAxisBorderElement(axis: Axis, index: number, labelBorder: string, parent: Element): void {
        const element: Element = getElement(this.chart.element.id + '_BorderLine_' + index);
        const direction: string = element ? element.getAttribute('d') : '';
        const borderElement: Element = this.chart.renderer.drawPath(new PathOption(
            this.chart.element.id + '_BorderLine_' + index, 'transparent', axis.border.width,
            axis.border.color || this.chart.themeStyle.axisLine, 1, '', labelBorder
        )) as HTMLElement;
        (borderElement as HTMLElement).style.pointerEvents = 'none';
        appendChildElement(this.chart.enableCanvas, parent, borderElement, this.chart.redraw, false, 'x', 'y', null, direction, true);
    }

    /**
     * To find the axis label of the intersect action
     *
     * @param {Axis} axis axis
     * @param {string} label label
     * @param {number} width width
     * @returns {string} label
     */
    private findAxisLabel(axis: Axis, label: string, width: number): string {
        return(axis.labelIntersectAction === 'Trim' ?
            ((axis.angle % 360 === 0 && !axis.enableTrim) ? textTrim(width, label, axis.labelStyle) : label) : label);
    }

    /**
     * X-Axis Title function performed
     *
     * @param {Axis} axis axis
     * @param {number} index index
     * @param {Element} parent parent
     * @param {Rect} rect rect
     * @returns {void}
     */
    private drawXAxisTitle(axis: Axis, index: number, parent: Element, rect: Rect): void {
        if (axis.title) {
            const chart: Chart = this.chart;
            const elementSize: Size = measureText(axis.title, axis.titleStyle);
            const scrollBarHeight: number = isNullOrUndefined(axis.crossesAt) ? axis.scrollBarHeight : 0;
            let padding: number = (axis.tickPosition === 'Inside' ? 0 : axis.majorTickLines.height + axis.titlePadding) +
                (axis.labelPosition === 'Inside' ? 0 :
                    axis.maxLabelSize.height + axis.multiLevelLabelHeight + axis.labelPadding);
            const titleSize: number = (axis.titleSize.height * (axis.titleCollection.length - 1));
            padding = axis.isAxisOpposedPosition ? -(padding + elementSize.height / 4 + scrollBarHeight + titleSize) : (padding + (3 *
                elementSize.height / 4) + scrollBarHeight);
            const labelRotation: number = axis.titleRotation ? axis.titleRotation : 0;
            const x: number = rect.x + rect.width * 0.5;
            let y: number = rect.y + padding;
            if (labelRotation !== 0) {
                y += axis.opposedPosition ? - (axis.titleSize.height / 2 + elementSize.height / 4) :
                    axis.titleSize.height / 2 - elementSize.height / 4;
            }
            const options: TextOption = new TextOption(
                chart.element.id + '_AxisTitle_' + index, x,
                y, 'middle', axis.titleCollection, 'rotate(' + labelRotation + ',' + (x) + ',' + (y) + ')', null, labelRotation
            );
            const element: Element = textElement(
                chart.renderer, options, axis.titleStyle, axis.titleStyle.color || chart.themeStyle.axisTitle, parent,
                null, null, null, null, null, null, null, null, chart.enableCanvas
            );
            element.setAttribute('aria-hidden', 'true');
        }
    }

    /**
     * To render the axis grid and tick lines(Both Major and Minor)
     *
     * @param {Axis} axis axis
     * @param {number} index index
     * @param {string} gridDirection gridDirection
     * @param {MajorTickLinesModel | MinorTickLinesModel | MajorGridLinesModel | MinorGridLinesModel} gridModel gridModel
     * @param {string} gridId gridId
     * @param {number} gridIndex gridIndex
     * @param {Element} parent parent
     * @param {string} themeColor themeColor
     * @param {string} dashArray dashArray
     * @returns {void}
     */
    private renderGridLine(
        axis: Axis, index: number, gridDirection: string,
        gridModel: MajorTickLinesModel | MinorTickLinesModel | MajorGridLinesModel | MinorGridLinesModel,
        gridId: string, gridIndex: number, parent: Element, themeColor: string, dashArray: string = null
    ): void {
        const chart: Chart = this.chart;
        let direction: string;
        let element: Element;
        if (gridModel.width > 0 && axis.visible && axis.internalVisibility && gridDirection) {
            element = getElement(chart.element.id + gridId + index + '_' + gridIndex);
            direction = element ? element.getAttribute('d') : null;
            element = null;
            this.htmlObject = chart.renderer.drawPath(new PathOption(
                chart.element.id + gridId + index + '_' + gridIndex, 'transparent', gridModel.width,
                gridModel.color || themeColor,
                null, dashArray, gridDirection
            )) as HTMLElement;
            appendChildElement(chart.enableCanvas, parent, this.htmlObject, chart.redraw, true, 'x', 'y', null, direction, true);
        }
    }

    /**
     * To Find the parent node of the axis
     *
     * @param {string} elementId elementId
     * @param {Element} label label
     * @param {number} index index
     * @returns {Element} parent node of the axis
     */
    private findParentNode(elementId: string, label: Element, index: number): Element {
        if (document.getElementById(elementId + 'AxisGroup' + index + 'Inside').contains(document.getElementById(label.id))) {
            return document.getElementById(elementId + 'AxisGroup' + index + 'Inside');
        } else {
            return document.getElementById(elementId + 'AxisGroup' + index + 'Outside');
        }
    }

    /**
     * Create Zooming Labels Function Called here
     *
     * @param {Chart} chart chart
     * @param {Element} labelElement labelElement
     * @param {Axis} axis axis
     * @param {number} index index
     * @param {Rect} rect rect
     * @returns {void}
     */
    private createZoomingLabel(chart: Chart, labelElement: Element, axis: Axis, index: number, rect: Rect): void {
        const parentNode: Element = this.findParentNode(chart.element.id, labelElement, index);
        labelElement.setAttribute('opacity', '0.3');
        let zoomElement: Element = chart.renderer.createGroup({
            id: chart.element.id + 'AxisLabels_Zoom' + index
        });
        zoomElement = createZoomingLabels(chart, axis, zoomElement, index, axis.orientation === 'Vertical', rect);
        parentNode.replaceChild(labelElement, document.getElementById(labelElement.id));
        if (getElement(chart.element.id + 'AxisLabels_Zoom' + index)) {
            parentNode.replaceChild(zoomElement, document.getElementById(zoomElement.id));
        } else {
            parentNode.appendChild(zoomElement);
        }
    }


    // /**
    //  * To get Rotate text size
    //  *
    //  * @param isBreakLabel
    //  * @param axis
    //  * @param label
    //  * @param angle
    //  * @param chart
    //  */
    // private getRotateText(isBreakLabel: boolean, axis: Axis, label: VisibleLabels, angle: number, chart: Chart): Size {
    //     if (isBreakLabel) {
    //         return new Size(
    //             measureText(label.originalText, axis.labelStyle).height,
    //             measureText(label.originalText, axis.labelStyle).width
    //         );
    //     } else {
    //         return rotateTextSize(axis.labelStyle, <string>label.text, angle, chart);
    //     }
    // }

}
