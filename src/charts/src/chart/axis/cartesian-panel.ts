import { Chart } from '../chart';
import { DateFormatOptions, createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { DataUtil } from '@syncfusion/ej2-data';
import { Axis, Row, Column, VisibleRangeModel, VisibleLabels } from '../axis/axis';
import { Orientation, AxisPosition } from '../utils/enum';
import { subtractThickness, valueToCoefficient, sum, redrawElement } from '../../common/utils/helper';
import { subArray, TextOption, inside, measureText, appendChildElement } from '../../common/utils/helper';
import { Size, Rect, Thickness, PathOption, logBase, createZoomingLabels, getElement, rotateTextSize } from '../../common/utils/helper';
import { textElement, textTrim } from '../../common/utils/helper';
import { BorderModel } from '../../common/model/base-model';
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
     * @return {void}
     * @private
     */

    public measureAxis(rect: Rect): void {

        let chart: Chart = this.chart;

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

        if (!this.chart.delayRedraw) {
            chart.refreshAxis();
            this.calculateAxisSize(this.seriesClipRect);
        }
    }

    private measureRowAxis(chart: Chart, rect: Rect): void {
        let row: Row;
        this.calculateRowSize(rect);
        for (let item of chart.rows) {
            row = <Row>item;
            row.nearSizes = [];
            row.farSizes = [];
            this.arrangeAxis(row);
            this.measureDefinition(row, chart, new Size(chart.availableSize.width, row.computedHeight), rect);
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
        for (let item of chart.columns) {
            column = <Column>item;
            column.farSizes = [];
            column.nearSizes = [];
            this.arrangeAxis(column);
            this.measureDefinition(column, chart, new Size(column.computedWidth, chart.availableSize.height), rect);
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
     * @return {void}
     * @private
     */

    public measureDefinition(definition: Row | Column, chart: Chart, size: Size, clipRect: Rect): void {
        let axis: Axis;
        let axisType: string;

        for (let axis of definition.axes) {
            axis.scrollBarHeight = chart.scrollBarModule && chart.zoomSettings.enableScrollbar && chart.zoomModule.isZoomed
                && (axis.zoomFactor < 1 || axis.zoomPosition > 0) ? 16 : 0;
            axis.scrollBarHeight = chart.delayRedraw ? (axis.zoomingScrollBar && axis.zoomingScrollBar.svgObject &&
                axis.zoomingScrollBar.svgObject.childElementCount) ? 16 : 0 : axis.scrollBarHeight;
            axis.getModule(chart);
            axis.baseModule.calculateRangeAndInterval(size, axis);
            definition.computeSize(axis, clipRect, axis.scrollBarHeight);
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
     * @return {void}
     * @private
     */
    private calculateAxisSize(rect: Rect): void {

        let chart: Chart = this.chart;

        let row: Row;

        let column: Column;

        let definition: Row | Column;

        let axis: Axis;

        let nearCount: number = 0;

        let farCount: number = 0;

        let size: number = 0;

        let x: number; let y: number;

        this.calculateRowSize(rect);

        for (let i: number = 0, len: number = chart.rows.length; i < len; i++) {
            row = <Row>chart.rows[i];
            nearCount = 0; farCount = 0;
            for (let j: number = 0, len: number = row.axes.length; j < len; j++) {
                axis = row.axes[j];
                if (axis.rect.height === 0) {
                    axis.rect.height = row.computedHeight;
                    size = 0;
                    for (let k: number = i + 1, len: number = i + axis.span; k < len; k++) {
                        definition = <Row>chart.rows[k];
                        size += definition.computedHeight;
                    }
                    axis.rect.y = (row.computedTop - size) + axis.plotOffset;
                    axis.rect.height = (axis.rect.height + size) - (2 * axis.plotOffset);
                    axis.rect.width = 0;
                }
                if (axis.opposedPosition) {
                    x = rect.x + rect.width + sum(subArray(row.farSizes, farCount));
                    axis.rect.x = axis.rect.x >= x ? axis.rect.x : x;
                    farCount++;
                } else {
                    x = rect.x - sum(subArray(row.nearSizes, nearCount));
                    axis.rect.x = axis.rect.x <= x ? axis.rect.x : x;
                    nearCount++;
                }

            }
        }

        this.calculateColumnSize(rect);

        for (let i: number = 0, len: number = chart.columns.length; i < len; i++) {
            column = <Column>chart.columns[i];
            nearCount = 0;
            farCount = 0;
            for (let j: number = 0, len: number = column.axes.length; j < len; j++) {
                axis = column.axes[j];
                if (axis.rect.width === 0) {
                    for (let k: number = i, len: number = (i + axis.span); k < len; k++) {
                        definition = <Column>chart.columns[k];
                        axis.rect.width += definition.computedWidth;
                    }
                    axis.rect.x = column.computedLeft + axis.plotOffset;
                    axis.rect.width -= (2 * axis.plotOffset);
                    axis.rect.height = 0;
                }
                if (axis.opposedPosition) {
                    y = rect.y - sum(subArray(column.farSizes, farCount));
                    axis.rect.y = axis.rect.y <= y ? axis.rect.y : y;
                    farCount++;
                } else {
                    y = rect.y + rect.height + sum(subArray(column.nearSizes, nearCount));
                    axis.rect.y = axis.rect.y >= y ? axis.rect.y : y;
                    nearCount++;
                }
            }
        }
    }

    /**
     * Measure the axis.
     * @return {void}
     * @private
     */
    public measure(): void {
        let chart: Chart = this.chart;
        let row: Row;
        let column: Column;
        let definition: Row | Column;
        let axis: Axis;
        let actualIndex: number;
        let span: number;
        let axisLength: number;
        for (let axis of chart.axisCollections) {
            //definition.Axes = axis;
            if (axis.orientation === 'Vertical') {
                chart.verticalAxes.push(axis);
                actualIndex = this.getActualRow(axis);
                row = <Row>chart.rows[actualIndex];
                this.pushAxis(row, axis);
                span = ((actualIndex + axis.span) > chart.rows.length ? chart.rows.length : (actualIndex + axis.span));
                for (let j: number = actualIndex + 1; j < span; j++) {
                    definition = <Row>chart.rows[j];
                    definition.axes[row.axes.length - 1] = axis;
                    chart.rows[j] = definition;
                }
                chart.rows[actualIndex] = row;
            } else {
                chart.horizontalAxes.push(axis);
                actualIndex = this.getActualColumn(axis);
                column = <Column>chart.columns[actualIndex];
                this.pushAxis(column, axis);
                span = ((actualIndex + axis.span) > chart.columns.length ? chart.columns.length : (actualIndex + axis.span));
                for (let j: number = actualIndex + 1; j < span; j++) {
                    definition = <Column>chart.columns[j];
                    definition.axes[column.axes.length - 1] = axis;
                    chart.columns[j] = definition;
                }
                chart.columns[actualIndex] = column;
            }
        }
    }

    private crossAt(chart: Chart): void {
        for (let axis of chart.axisCollections) {
            if (axis.crossesAt === null) {
                continue;
            }
            let isTransposed: boolean = chart.isTransposed;
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
                    if (axis.crossesInAxis === chart.axisCollections[i].name) {
                        axis.crossInAxis = chart.axisCollections[i];
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
                let option: DateFormatOptions = {
                    skeleton: 'full',
                    type: 'dateTime'
                };
                let dateParser: Function = this.chart.intl.getDateParser(option);
                let dateFormatter: Function = this.chart.intl.getDateFormat(option);
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
            if (!definition.axes[i]) {
                definition.axes[i] = axis;
                break;
            }
        }
    }

    private arrangeAxis(definition: Row | Column): void {
        let axisCollection: Axis[] = [];
        for (let i: number = 0, len: number = definition.axes.length; i <= len; i++) {
            if (definition.axes[i]) {
                axisCollection.push(definition.axes[i]);
            }
        }
        definition.axes = axisCollection;
    }

    private getActualColumn(axis: Axis): number {
        let actualLength: number = this.chart.columns.length;
        let pos: number = axis.columnIndex;
        let result: number = pos >= actualLength ? actualLength - 1 : (pos < 0 ? 0 : pos);
        return result;
    }

    private getActualRow(axis: Axis): number {
        let actualLength: number = this.chart.rows.length;
        let pos: number = axis.rowIndex;
        let result: number = pos >= actualLength ? actualLength - 1 : (pos < 0 ? 0 : pos);
        return result;
    }

    /**
     * Measure the row size.
     * @return {void}
     */

    private calculateRowSize(rect: Rect): void {
        /*! Calculate row size */
        let chart: Chart = this.chart;
        let row: Row;
        let rowTop: number = rect.y + rect.height;
        let height: number = 0;

        let remainingHeight: number = Math.max(0, rect.height);
        for (let i: number = 0, len: number = chart.rows.length; i < len; i++) {
            row = <Row>chart.rows[i];
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
     * @return {void}
     */

    private calculateColumnSize(rect: Rect): void {
        /*! Calculate column size */

        let chart: Chart = this.chart;
        let column: Column;
        let columnLeft: number = rect.x;
        let width: number = 0;

        let remainingWidth: number = Math.max(0, rect.width);

        for (let i: number = 0, len: number = chart.columns.length; i < len; i++) {
            column = <Column>chart.columns[i];
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
     * @return {void}
     * @private
     */

    public renderAxes(): Element {

        let chart: Chart = this.chart;
        let axis: Axis;
        let axisElement: Element = chart.renderer.createGroup({ id: chart.element.id + 'AxisInsideCollection' });
        let axisLineElement: Element = chart.renderer.createGroup({ id: chart.element.id + 'AxisOutsideCollection' });
        let outsideElement: Element; let isInside: boolean;

        for (let i: number = 0, len: number = chart.axisCollections.length; i < len; i++) {

            axis = chart.axisCollections[i];
            this.element = chart.renderer.createGroup({ id: chart.element.id + 'AxisGroup' + i + 'Inside' });
            outsideElement = chart.renderer.createGroup({ id: chart.element.id + 'AxisGroup' + i + 'Outside' });
            isInside = this.findAxisPosition(axis);
            if (axis.orientation === 'Horizontal') {

                axis.updateCrossValue(chart);

                if (axis.visible && axis.lineStyle.width > 0) {
                    this.drawAxisLine(
                        axis, i, axis.plotOffset, 0, isInside ? outsideElement : this.element, axis.updatedRect
                    );
                }
                if (axis.majorGridLines.width > 0 || axis.majorTickLines.width > 0) {
                    this.drawXAxisGridLine(
                        axis, i, (isInside || axis.tickPosition === 'Inside') ? outsideElement : this.element, axis.updatedRect
                    );
                }
                if (axis.visible) {
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
                axis.updateCrossValue(chart);
                if (axis.visible && axis.lineStyle.width > 0) {
                    this.drawAxisLine(axis, i, 0, axis.plotOffset, isInside ? outsideElement : this.element, axis.updatedRect);
                }
                if (axis.majorGridLines.width > 0 || axis.majorTickLines.width > 0) {
                    this.drawYAxisGridLine(
                        axis, i, (isInside || axis.tickPosition === 'Inside') ? outsideElement : this.element, axis.updatedRect
                    );
                }

                if (axis.visible) {
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
            axisElement.appendChild(this.element);
            if (outsideElement && outsideElement.childNodes.length > 0) {
                axisLineElement.appendChild(outsideElement);
            }
            if (chart.scrollBarModule && chart.zoomSettings.enableScrollbar) {
                this.renderScrollbar(chart, axis);
            }
        }

        this.element = chart.renderer.createGroup({ id: chart.element.id + 'DefinitionLine' });

        for (let j: number = 0, len: number = chart.rows.length; j < len; j++) {
            let row: Row = <Row>chart.rows[j];
            if (row.border.color) {
                this.drawBottomLine(row, j, true);
            }
        }

        for (let j: number = 0, len: number = chart.columns.length; j < len; j++) {
            let column: Column = <Column>chart.columns[j];
            if (column.border.color) {
                this.drawBottomLine(column, j, false);
            }
        }
        axisElement.appendChild(this.element);
        appendChildElement(chart.svgObject, axisElement, chart.redraw);

        return axisLineElement;
    }
    /**
     * To render scrollbar
     * @param chart
     * @param axis
     */
    private renderScrollbar(chart: Chart, axis: Axis): void {
        if (chart.zoomModule.isZoomed && (axis.zoomFactor < 1 || axis.zoomPosition > 0) && !axis.zoomingScrollBar.isScrollUI) {
            if (!chart.scrollElement) {
                chart.scrollElement = redrawElement(chart.redraw, chart.element.id + '_scrollElement') || createElement(
                    'div', { id: chart.element.id + '_scrollElement' }
                );
            }
            appendChildElement(chart.scrollElement, axis.zoomingScrollBar.render(), true);
        } else if (axis.zoomFactor === 1 && axis.zoomPosition === 0 && axis.zoomingScrollBar.svgObject) {
            axis.zoomingScrollBar.destroy();
        }
        if (axis.zoomingScrollBar.isScrollUI) {
            axis.zoomingScrollBar.isScrollUI = false;
        }
    }

    private findAxisPosition(axis: Axis): boolean {
        return axis.crossAt !== null && axis.isInside(axis.crossInAxis.visibleRange);
    }

    private drawBottomLine(definition: Row | Column, index: number, isRow: boolean): void {
        let chart: Chart = this.chart;
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
            'stroke': definition.border.color,
        };

        this.htmlObject = chart.renderer.drawLine(optionsLine) as HTMLElement;
        this.element.appendChild(this.htmlObject);
    }

    private drawAxisLine(
        axis: Axis, index: number, plotX: number, plotY: number, parent: Element, rect: Rect
    ): void {
        let chart: Chart = this.chart;
        let optionsLine: Object = {};
        optionsLine = {
            'id': chart.element.id + 'AxisLine_' + index,
            x1: rect.x - plotX,
            y1: rect.y - plotY,
            x2: rect.x + rect.width + plotX,
            y2: rect.y + rect.height + plotY,
            'stroke-dasharray': axis.lineStyle.dashArray,
            'stroke-width': axis.lineStyle.width,
            'stroke': axis.lineStyle.color || chart.themeStyle.axisLine
        };

        this.htmlObject = chart.renderer.drawLine(optionsLine) as HTMLElement;
        parent.appendChild(this.htmlObject);
    }

    private drawYAxisGridLine(axis: Axis, index: number, parent: Element, rect: Rect): void {

        let chart: Chart = this.chart;
        let tempInterval: number;
        let pointY: number = 0;
        let majorGrid: string = '';
        let majorTick: string = '';
        let minorGird: string = '';
        let minorTick: string = '';
        let minorDirection: string[];
        let tickSize: number = axis.opposedPosition ? axis.majorTickLines.height : -axis.majorTickLines.height;
        let axisLineSize: number = (axis.opposedPosition) ? axis.lineStyle.width / 2 : -axis.lineStyle.width / 2;
        let ticksbwtLabel: number = (axis.valueType === 'Category' && axis.labelPlacement === 'BetweenTicks') ?
            0.5 : 0;
        let scrollBarHeight: number = isNullOrUndefined(axis.crossesAt) ? axis.opposedPosition ? axis.scrollBarHeight :
            -axis.scrollBarHeight : 0;
        let isTickInside: boolean = axis.tickPosition === 'Inside';
        let ticks: number = isTickInside ? (rect.x - tickSize - axisLineSize) : (rect.x + tickSize + axisLineSize + scrollBarHeight);
        let length: number = axis.visibleLabels.length;
        if (axis.valueType.indexOf('Category') && axis.labelPlacement === 'BetweenTicks' && length > 0) {
            length += 1;
        }
        //Gridlines
        for (let i: number = 0; i < length; i++) {
            tempInterval = !axis.visibleLabels[i] ? (axis.visibleLabels[i - 1].value + axis.visibleRange.interval) - ticksbwtLabel
                : axis.visibleLabels[i].value - ticksbwtLabel;

            pointY = valueToCoefficient(tempInterval, axis) * rect.height;

            pointY = (pointY * -1) + (rect.y + rect.height);

            if (pointY >= rect.y && (rect.y + rect.height) >= pointY) {
                if ((inside(tempInterval, axis.visibleRange)) || this.isBorder(axis, i, pointY)) {
                    majorGrid = majorGrid.concat('M ' + this.seriesClipRect.x + ' ' + (pointY) +
                        ' L ' + (this.seriesClipRect.x + this.seriesClipRect.width) + ' ' + pointY + ' ');
                }

                majorTick = majorTick.concat('M ' + (rect.x + axisLineSize + (isTickInside ? scrollBarHeight : 0)) + ' ' + pointY +
                    ' L ' + (ticks) + ' ' + pointY + ' ');
            }

            if ((axis.minorGridLines.width > 0 || axis.minorTickLines.width > 0) && axis.minorTicksPerInterval > 0) {
                minorDirection = this.drawAxisMinorLine(axis, tempInterval, minorGird, minorTick, rect, i);
                minorGird = minorDirection[0];
                minorTick = minorDirection[1];
            }

        }

        this.renderGridLine(axis, index, majorGrid, minorGird);
        this.renderTickLine(axis, index, majorTick, minorTick, parent);
    }

    private isBorder(axis: Axis, index: number, value: number): boolean {
        let chart: Chart = this.chart;
        let border: BorderModel = chart.chartArea.border;
        let rect: Rect = this.seriesClipRect;
        let orientation: Orientation = axis.orientation;
        let start: number = (orientation === 'Horizontal') ? rect.x : rect.y;
        let size: number = (orientation === 'Horizontal') ? rect.width : rect.height;
        let startIndex: number = (orientation === 'Horizontal') ? 0 : axis.visibleLabels.length - 1;
        let endIndex: number = (orientation === 'Horizontal') ? axis.visibleLabels.length - 1 : 0;
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
     * To render the axis label.
     * @return {void}
     * @private
     */
    public drawYAxisLabels(axis: Axis, index: number, parent: Element, rect: Rect): void {

        let chart: Chart = this.chart;
        let pointX: number = 0;
        let pointY: number = 0;
        let elementSize: Size;
        let options: TextOption;
        let isLabelInside: boolean = axis.labelPosition === 'Inside';
        let isTickInside: boolean = axis.tickPosition === 'Inside';
        let isOpposed: boolean = axis.opposedPosition;
        let tickSpace: number = axis.labelPosition === axis.tickPosition ? axis.majorTickLines.height : 0;
        let padding: number = tickSpace + this.padding + axis.lineStyle.width / 2;
        padding = (axis.opposedPosition) ? padding : -padding;
        let anchor: string = ((isOpposed && isLabelInside) || (!isOpposed && !isLabelInside)) ? 'end' : 'start';
        let labelElement: Element = chart.renderer.createGroup({ id: chart.element.id + 'AxisLabels' + index });
        let scrollBarHeight: number = isNullOrUndefined(axis.crossesAt) ? axis.scrollBarHeight * (isOpposed ? 1 : -1) : 0;
        for (let i: number = 0, len: number = axis.visibleLabels.length; i < len; i++) {

            pointX = isLabelInside ? (rect.x - padding) : (rect.x + padding + scrollBarHeight);

            elementSize = axis.visibleLabels[i].size;

            pointY = valueToCoefficient(axis.visibleLabels[i].value, axis) * rect.height;

            pointY = Math.floor((pointY * -1) + (rect.y + rect.height));

            options = new TextOption(
                chart.element.id + index + '_AxisLabel_' + i, pointX, pointY + (elementSize.height / 4),
                anchor, axis.visibleLabels[i].text);
            if (axis.edgeLabelPlacement) {
                switch (axis.edgeLabelPlacement) {
                    case 'None':
                        break;
                    case 'Hide':
                        if (((i === 0 || (axis.isInversed && i === len - 1)) && options.y > rect.y + rect.height) ||
                            (((i === len - 1) || (axis.isInversed && i === 0)) && options.y - elementSize.height / 2 < rect.y)) {
                            options.text = '';
                        }
                        break;
                    case 'Shift':
                        if ((i === 0 || (axis.isInversed && i === len - 1)) && options.y > rect.y + rect.height) {
                            options.y = pointY = rect.y + rect.height;
                        } else if (((i === len - 1) || (axis.isInversed && i === 0)) && (options.y - elementSize.height / 2 < rect.y)) {
                            options.y = pointY = rect.y + elementSize.height / 2;
                        }
                        break;
                }
            }
            textElement(
                options, axis.labelStyle, axis.labelStyle.color || chart.themeStyle.axisLabel,
                labelElement, false, false).setAttribute('text-content', options.text as string
            );
        }

        if (!chart.delayRedraw) {
            parent.appendChild(labelElement);
        } else if (axis.visible) {
            this.createZoomingLabel(this.chart, labelElement, axis, index, rect);
        }
    }

    /**
     * To render the axis label border.
     * @return {void}
     * @private
     */
    private drawYAxisBorder(axis: Axis, index: number, parent: Element, rect: Rect): void {
        if (axis.border.width > 0) {
            let startY: number; let pointY: number;
            let scrollBarHeight: number = axis.labelPosition === 'Outside' ? axis.scrollBarHeight : 0;
            scrollBarHeight = (axis.opposedPosition ? 1 : -1) * scrollBarHeight;
            let gap: number = (rect.height / axis.visibleRange.delta) * (axis.valueType === 'DateTime' ? axis.dateTimeInterval
                : axis.visibleRange.interval);
            let endY: number;
            let length: number = axis.maxLabelSize.width + 10 + ((axis.tickPosition === axis.labelPosition) ?
                axis.majorTickLines.height : 0);
            let labelBorder: string = '';
            let ticksbwtLabel: number = (axis.valueType === 'Category' && axis.labelPlacement === 'BetweenTicks') ? -0.5 : 0;
            let endX: number = ((axis.opposedPosition && axis.labelPosition === 'Inside') || (!axis.opposedPosition
                && axis.labelPosition === 'Outside')) ? rect.x - length + scrollBarHeight : rect.x + length + scrollBarHeight;
            for (let i: number = 0; i < axis.visibleLabels.length; i++) {
                pointY = valueToCoefficient(axis.visibleLabels[i].value + ticksbwtLabel, axis);
                pointY = (axis.isInversed ? (1 - pointY) : pointY) * rect.height;
                if (axis.valueType === 'Category' && axis.labelPlacement === 'BetweenTicks') {
                    startY = Math.floor((pointY * -1) + (rect.y + rect.height));
                    endY = Math.floor((pointY * -1) - (gap) + (rect.y + rect.height));
                } else {
                    startY = Math.floor((pointY * -1) + gap / 2 + (rect.y + rect.height));
                    endY = Math.floor((pointY * -1) - gap / 2 + (rect.y + rect.height));
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
    private drawYAxisTitle(axis: Axis, index: number, parent: Element, rect: Rect): void {

        let chart: Chart = this.chart;

        let labelRotation: number = (axis.opposedPosition) ? 90 : -90;

        let elementSize: Size = measureText(axis.title, axis.titleStyle);

        let padding: number = (axis.tickPosition === 'Inside' ? 0 : axis.majorTickLines.height + this.padding) +
            (axis.labelPosition === 'Inside' ? 0 :
                (axis.maxLabelSize.width + axis.multiLevelLabelHeight + this.padding));

        padding = axis.opposedPosition ? padding + axis.scrollBarHeight : -padding - axis.scrollBarHeight;

        let x: number = rect.x + padding;

        let y: number = rect.y + rect.height / 2;


        let options: TextOption = new TextOption(
            chart.element.id + '_AxisTitle_' + index, x, y - this.padding, 'middle',
            axis.title, 'rotate(' + labelRotation + ',' + (x) + ',' + (y) + ')'
        );

        let element: Element = textElement(
            options, axis.titleStyle, axis.titleStyle.color || chart.themeStyle.axisTitle, parent
        );
        element.setAttribute('tabindex', axis.tabIndex.toString());
        element.setAttribute('aria-label', axis.description || axis.title);
    }

    private drawXAxisGridLine(axis: Axis, index: number, parent: Element, rect: Rect): void {
        let chart: Chart = this.chart;
        let tempInterval: number;
        let pointX: number = 0;
        let majorGrid: string = '';
        let majorTick: string = '';
        let minorGird: string = '';
        let minorTick: string = '';
        let minorDirection: string[];
        let tickSize: number = (axis.opposedPosition) ? -axis.majorTickLines.height : axis.majorTickLines.height;
        let axisLineSize: number = (axis.opposedPosition) ? -axis.lineStyle.width / 2 : axis.lineStyle.width / 2;
        let scrollBarHeight: number = isNullOrUndefined(axis.crossesAt) ? axis.opposedPosition ? -axis.scrollBarHeight :
            axis.scrollBarHeight : 0;
        let ticksbwtLabel: number = (axis.valueType.indexOf('Category') > -1 && axis.labelPlacement === 'BetweenTicks') ?
            0.5 : 0;
        let length: number = axis.visibleLabels.length;
        let isTickInside: boolean = axis.tickPosition === 'Inside';
        let ticks: number = isTickInside ? (rect.y - tickSize - axisLineSize) : (rect.y + tickSize + axisLineSize + scrollBarHeight);
        if (axis.valueType.indexOf('Category') > -1 && length > 0 && axis.labelPlacement === 'BetweenTicks') {
            length += 1;
        }
        //Gridlines
        for (let i: number = 0; i < length; i++) {
            if (axis.valueType !== 'DateTimeCategory') {
                tempInterval = axis.visibleLabels[i] ? axis.visibleLabels[i].value - ticksbwtLabel
                    : (axis.visibleLabels[i - 1].value + axis.visibleRange.interval) - ticksbwtLabel;
            } else {
                tempInterval = axis.visibleLabels[i] ?
                    axis.visibleLabels[i].value - ticksbwtLabel : axis.visibleRange.max;
            }

            pointX = (valueToCoefficient(tempInterval, axis) * rect.width) + rect.x;

            if (pointX >= rect.x && (rect.x + rect.width) >= pointX) {
                if (inside(tempInterval, axis.visibleRange) || this.isBorder(axis, i, pointX)) {

                    majorGrid = majorGrid.concat('M ' + pointX + ' ' + (this.seriesClipRect.y + this.seriesClipRect.height) +
                        ' L ' + pointX + ' ' + this.seriesClipRect.y + ' ');
                }

                majorTick = majorTick.concat('M ' + (pointX) + ' ' + (rect.y + axisLineSize + (isTickInside ? scrollBarHeight : 0))
                    + ' L ' + (pointX) + ' ' + ticks + ' ');
            }

            if (axis.minorTicksPerInterval > 0 && (axis.minorGridLines.width > 0 || axis.minorTickLines.width > 0)) {
                minorDirection = this.drawAxisMinorLine(axis, tempInterval, minorGird, minorTick, rect, i);
                minorTick = minorDirection[1];
                minorGird = minorDirection[0];
            }
        }
        this.renderGridLine(axis, index, majorGrid, minorGird);
        this.renderTickLine(axis, index, majorTick, minorTick, parent);
    }


    private drawAxisMinorLine(
        axis: Axis, tempInterval: number, minorGird: string, minorTick: string, rect: Rect, labelIndex: number): string[] {
        let value: number = tempInterval;
        let coor: number = 0;
        let position: number = 0;
        let range: VisibleRangeModel = axis.visibleRange;
        let isTickInside: boolean = axis.tickPosition === 'Inside';
        let direction: string[] = [];
        let tickSize: number = axis.opposedPosition ? -axis.minorTickLines.height : axis.minorTickLines.height;
        let logStart: number;
        let logEnd: number;
        let logInterval: number = 1;
        let logPosition: number = 1;
        let ticksX: number = isTickInside ? (rect.y - tickSize) : (rect.y + tickSize);
        let ticksY: number = isTickInside ? (rect.x + tickSize) : (rect.x - tickSize);
        if (axis.valueType === 'Logarithmic') {
            logStart = Math.pow(axis.logBase, value - range.interval);
            logEnd = Math.pow(axis.logBase, value);
            logInterval = (logEnd - logStart) / (axis.minorTicksPerInterval + 1);
            logPosition = logStart + logInterval;
        }
        if (axis.orientation === 'Horizontal') {
            for (let j: number = 0; j < axis.minorTicksPerInterval; j++) {
                value = this.findLogNumeric(axis, logPosition, logInterval, value, labelIndex);
                logPosition += logInterval;
                if (inside(value, range)) {
                    position = ((value - range.min) / (range.max - range.min));
                    position = Math.ceil((axis.isInversed ? (1 - position) : position) * rect.width);
                    coor = (Math.floor(position + rect.x));
                    minorGird = minorGird.concat('M' + ' ' + coor + ' ' + (this.seriesClipRect.y)
                        + 'L ' + coor + ' ' + (this.seriesClipRect.y + this.seriesClipRect.height));
                    coor = (Math.floor(position + rect.x));
                    minorTick = minorTick.concat('M' + ' ' + coor + ' ' + (rect.y)
                        + 'L ' + coor + ' ' + ticksX);
                }
            }
        } else {
            tickSize = axis.opposedPosition ? axis.minorTickLines.height : -axis.minorTickLines.height;
            for (let j: number = 0; j < axis.minorTicksPerInterval; j++) {
                value = this.findLogNumeric(axis, logPosition, logInterval, value, labelIndex);
                if (inside(value, range)) {
                    position = Math.ceil(((value - range.min) / (range.max - range.min)) * rect.height) * -1;
                    coor = (Math.floor(position + rect.y + rect.height));
                    minorGird = minorGird.concat('M' + ' ' + (this.seriesClipRect.x) + ' ' + coor
                        + 'L ' + (this.seriesClipRect.x + this.seriesClipRect.width) + ' ' + coor);
                    coor = (Math.floor(position + rect.y + rect.height));
                    minorTick = minorTick.concat('M' + ' ' + rect.x + ' ' + coor + 'L ' + ticksY + ' ' + coor);
                }
                logPosition += logInterval;
            }
        }
        direction.push(minorGird);
        direction.push(minorTick);
        return direction;
    }
    private findLogNumeric(axis: Axis, logPosition: number, logInterval: number, value: number, labelIndex: number): number {
        let range: VisibleRangeModel = axis.visibleRange;
        if (axis.valueType === 'Logarithmic') {
            value = logBase(logPosition, axis.logBase);
        } else if (axis.valueType === 'DateTime') {
            value += axis.dateTimeInterval / (axis.minorTicksPerInterval + 1);
        } else if (axis.valueType === 'DateTimeCategory') {
            let padding: number = axis.labelPlacement === 'BetweenTicks' ? 0.5 : 0;
            value += ((axis.visibleLabels[labelIndex + 1] ?
                axis.visibleLabels[labelIndex + 1].value - padding : axis.visibleRange.max) -
                (axis.visibleLabels[labelIndex] ?
                    axis.visibleLabels[labelIndex].value - padding : axis.visibleRange.min)) /
                (axis.minorTicksPerInterval + 1);
        } else {
            value += range.interval / (axis.minorTicksPerInterval + 1);
        }
        return value;
    }
    /**
     * To render the axis label.
     * @return {void}
     * @private
     */
    public drawXAxisLabels(axis: Axis, index: number, parent: Element, rect: Rect): void {

        let chart: Chart = this.chart;
        let pointX: number = 0;
        let pointY: number = 0;
        let elementSize: Size;
        let labelElement: Element = chart.renderer.createGroup({ id: chart.element.id + 'AxisLabels' + index });
        let labelPosition: AxisPosition = axis.labelPosition;
        let islabelInside: boolean = axis.labelPosition === 'Inside';
        let isTickInside: boolean = axis.tickPosition === 'Inside';
        let isOpposed: boolean = axis.opposedPosition;
        let tickSpace: number = axis.labelPosition === axis.tickPosition ? axis.majorTickLines.height : 0;
        let labelPadding: number;
        let padding: number = tickSpace + this.padding + axis.lineStyle.width / 2;
        let rotateSize: Size;
        let diffHeight: number;
        let angle: number = axis.angle % 360 ;
        let anglePadding: number = ((angle === 90 || angle === -90)) ? -2 : 0;
        let options: TextOption;
        let yLocation: number;
        let previousEnd: number = axis.isInversed ? (rect.x + rect.width) : rect.x;
        let width: number = 0;
        let length: number = axis.visibleLabels.length;
        let intervalLength: number;
        let label: VisibleLabels;
        let scrollBarHeight: number = !islabelInside && isNullOrUndefined(axis.crossesAt) && (axis.zoomFactor < 1 || axis.zoomPosition > 0)
            ? axis.scrollBarHeight : 0;

        for (let i: number = 0, len: number = length; i < len; i++) {

            label = axis.visibleLabels[i];
            pointX = (valueToCoefficient(label.value, axis) * rect.width) + rect.x;
            elementSize = label.size;
            intervalLength = rect.width / length;
            width = ((axis.labelIntersectAction === 'Trim' || axis.labelIntersectAction === 'Wrap') && angle === 0
                && elementSize.width > intervalLength) ? intervalLength : elementSize.width;
            pointX -= width / 2;
            if (islabelInside && angle) {
                pointY = isOpposed ? (rect.y + padding) : (rect.y - padding);
            } else {
                labelPadding = ((isOpposed && !islabelInside) || (!isOpposed && islabelInside)) ?
                    -(padding + scrollBarHeight + (angle ? ((elementSize.height / 2) + (2 * axis.maxLabelSize.height / 5)) :
                        (label.index > 1 ? (2 * (elementSize.height / 4)) : 0))) :
                    padding + scrollBarHeight + (angle ? (axis.maxLabelSize.height / 2) : (3 * (elementSize.height / 4)));
                pointY = (rect.y + (labelPadding * label.index));
            }

            options = new TextOption(
                chart.element.id + index + '_AxisLabel_' + i, pointX, pointY, '');
            if (axis.edgeLabelPlacement) {
                switch (axis.edgeLabelPlacement) {
                    case 'None':
                        break;
                    case 'Hide':
                        if (((i === 0 || (axis.isInversed && i === len - 1)) && options.x < rect.x) ||
                            ((i === len - 1 || (axis.isInversed && i === 0)) && (options.x + width > rect.x + rect.width))) {
                            continue;
                        }
                        break;
                    case 'Shift':
                        if ((i === 0 || (axis.isInversed && i === len - 1)) && options.x < rect.x) {
                            intervalLength -= (rect.x - options.x);
                            options.x = pointX = rect.x;
                        } else if ((i === len - 1 || (axis.isInversed && i === 0)) && ((options.x + width) > rect.x + rect.width)) {
                            if (elementSize.width > intervalLength && axis.labelIntersectAction === 'Trim') {
                                intervalLength -= (options.x + width - (rect.x + rect.width));
                            } else {
                                intervalLength = width;
                            }
                            options.x = pointX = rect.x + rect.width - intervalLength;
                        }
                        break;
                }
            }
            options.text = this.findAxisLabel(axis, <string>label.text, intervalLength);
            if (angle === 0 && axis.labelIntersectAction === 'Hide' && i !== 0 &&
                (!axis.isInversed ? options.x <= previousEnd : options.x + width >= previousEnd)) {
                continue;
            }
            previousEnd = axis.isInversed ? options.x : options.x + width;
            if (angle !== 0) {
                rotateSize = rotateTextSize(axis.labelStyle, <string>label.text, angle, chart);
                diffHeight = islabelInside ? rotateSize.height :
                    axis.maxLabelSize.height - Math.ceil(rotateSize.height);
                yLocation = axis.opposedPosition ? diffHeight / 2 : - diffHeight / 2;
                options.transform = 'rotate(' + angle + ',' + (pointX + width / 2 + anglePadding) + ','
                    + (pointY + yLocation) + ')';
                options.y += yLocation;
            }
            textElement(
                options, label.labelStyle, label.labelStyle.color || chart.themeStyle.axisLabel,
                labelElement, (axis.opposedPosition !== (axis.labelPosition === 'Inside'))
            ).setAttribute('style', 'cursor: default');
        }
        if (!chart.delayRedraw) {
            parent.appendChild(labelElement);
        } else if (axis.visible) {
            this.createZoomingLabel(this.chart, labelElement, axis, index, rect);
        }
    }
    /**
     * To render the axis label border.
     * @return {void}
     * @private
     */
    private drawXAxisBorder(axis: Axis, index: number, parent: Element, axisRect: Rect): void {
        if (axis.border.width > 0) {
            let scrollBarHeight: number = axis.labelPosition === 'Outside' ? axis.scrollBarHeight : 0;
            let startX: number; let startY: number = axisRect.y + ((axis.opposedPosition ? -1 : 1) * scrollBarHeight);
            let padding: number = 10; let pointX: number;
            let gap: number = (axisRect.width / axis.visibleRange.delta) * (axis.valueType === 'DateTime' ? axis.dateTimeInterval
                : axis.visibleRange.interval);
            let endX: number;
            let length: number = axis.maxLabelSize.height +
                ((axis.tickPosition === axis.labelPosition) ? axis.majorTickLines.height : 0);
            let labelBorder: string = '';
            let ticksbwtLabel: number = (axis.valueType === 'Category' && axis.labelPlacement === 'BetweenTicks') ? -0.5 : 0;
            let endY: number = ((axis.opposedPosition && axis.labelPosition === 'Inside') ||
                (!axis.opposedPosition && axis.labelPosition === 'Outside')) ?
                (axisRect.y + length + padding + scrollBarHeight) : (axisRect.y - length - padding - scrollBarHeight);
            for (let i: number = 0; i < axis.visibleLabels.length; i++) {
                pointX = valueToCoefficient(axis.visibleLabels[i].value + ticksbwtLabel, axis);
                pointX = (axis.isInversed ? (1 - pointX) : pointX) * axisRect.width;
                if (axis.valueType === 'Category' && axis.labelPlacement === 'BetweenTicks') {
                    startX = pointX + axisRect.x; endX = pointX + (gap) + axisRect.x;
                } else {
                    startX = pointX - gap / 2 + axisRect.x; endX = pointX + gap / 2 + axisRect.x;
                }
                switch (axis.border.type) {
                    case 'Rectangle':
                    case 'WithoutTopBorder':
                        if (startX < axisRect.x) {
                            labelBorder += ('M' + ' ' + axisRect.x + ' ' + endY + ' ' + 'L' + ' ' + endX + ' ' + endY + ' ');
                        } else if (Math.floor(endX) > axisRect.width + axisRect.x) {
                            labelBorder += ('M' + ' ' + startX + ' ' + startY + ' ' + 'L' + ' ' + startX + ' ' + endY + ' ' +
                                'L' + ' ' + (axisRect.width + axisRect.x) + ' ' + endY + ' ');
                        } else {
                            labelBorder += ('M' + ' ' + startX + ' ' + startY + ' ' + 'L' + ' ' + startX + ' ' +
                                endY + ' ' + 'L' + ' ' + endX + ' ' + endY + ' ');
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
     * To create border element for axis.
     * @return {void}
     * @private
     */
    private createAxisBorderElement(axis: Axis, index: number, labelBorder: string, parent: Element): void {
        let borderElement: Element = this.chart.renderer.drawPath(new PathOption(
            this.chart.element.id + '_BorderLine_' + index, 'transparent', axis.border.width,
            axis.border.color || this.chart.themeStyle.axisLine, 1, '', labelBorder
        )) as HTMLElement;
        borderElement.setAttribute('style', 'pointer-events: none');
        parent.appendChild(borderElement);
    }
    private findAxisLabel(axis: Axis, label: string, width: number): string {
        switch (axis.labelIntersectAction) {
            case 'Trim':
                return (axis.angle === 0 && !axis.enableTrim) ? textTrim(width, label, axis.labelStyle) : label;
            default:
                return label;
        }
    }


    private drawXAxisTitle(axis: Axis, index: number, parent: Element, rect: Rect): void {
        let chart: Chart = this.chart;
        let elementSize: Size = measureText(axis.title, axis.titleStyle);
        let scrollBarHeight: number = isNullOrUndefined(axis.crossesAt) ? axis.scrollBarHeight : 0;
        let padding: number = (axis.tickPosition === 'Inside' ? 0 : axis.majorTickLines.height + this.padding) +
            (axis.labelPosition === 'Inside' ? 0 :
                axis.maxLabelSize.height + axis.multiLevelLabelHeight + this.padding);

        padding = axis.opposedPosition ? -(padding + elementSize.height / 4 + scrollBarHeight) : (padding + (3 *
            elementSize.height / 4) + scrollBarHeight);

        let options: TextOption = new TextOption(
            chart.element.id + '_AxisTitle_' + index, rect.x + rect.width / 2,
            rect.y + padding, 'middle', axis.title
        );

        let element: Element = textElement(
            options, axis.titleStyle, axis.titleStyle.color || chart.themeStyle.axisTitle, parent
        );
        element.setAttribute('aria-label', axis.description || axis.title);
        element.setAttribute('tabindex', axis.tabIndex.toString());
    }

    private renderTickLine(axis: Axis, index: number, majorTick: string, minorTick: string, parent: Element): void {

        let options: PathOption;
        let chart: Chart = this.chart;

        if (axis.majorTickLines.width > 0 && axis.visible) {

            options = new PathOption(
                chart.element.id + '_MajorTickLine_' + index, 'transparent', axis.majorTickLines.width,
                axis.majorTickLines.color || chart.themeStyle.majorTickLine, null, null, majorTick
            );

            this.htmlObject = chart.renderer.drawPath(options) as HTMLElement;
            parent.appendChild(this.htmlObject);

        }
        if (axis.minorTickLines.width > 0 && axis.visible) {

            options = new PathOption(
                chart.element.id + '_MinorTickLine_' + index, 'transparent', axis.minorTickLines.width,
                axis.minorTickLines.color || chart.themeStyle.minorTickLine, null, null, minorTick
            );

            this.htmlObject = chart.renderer.drawPath(options) as HTMLElement;
            parent.appendChild(this.htmlObject);

        }
    }

    private renderGridLine(axis: Axis, index: number, majorGrid: string, minorGird: string): void {
        let chart: Chart = this.chart;
        let options: PathOption;
        if (axis.majorGridLines.width > 0) {
            options = new PathOption(
                chart.element.id + '_MajorGridLine_' + index, 'transparent', axis.majorGridLines.width,
                axis.majorGridLines.color || chart.themeStyle.majorGridLine,
                null, axis.majorGridLines.dashArray, majorGrid
            );

            this.htmlObject = chart.renderer.drawPath(options) as HTMLElement;
            this.element.appendChild(this.htmlObject);

        }
        if (axis.minorGridLines.width > 0) {
            options = new PathOption(
                chart.element.id + '_MinorGridLine_' + index, 'transparent', axis.minorGridLines.width,
                axis.minorGridLines.color || chart.themeStyle.minorGridLine,
                null, axis.minorGridLines.dashArray, minorGird
            );

            this.htmlObject = chart.renderer.drawPath(options) as HTMLElement;
            this.element.appendChild(this.htmlObject);
        }
    }

    private findParentNode(chart: Chart, label: Element, axis: Axis, index: number): Element {
        if (axis.crossAt === null) {
            return document.getElementById(chart.element.id + 'AxisGroup' + index + 'Inside');
        }
        if (document.getElementById(chart.element.id + 'AxisGroup' + index + 'Inside').contains(document.getElementById(label.id))) {
            return document.getElementById(chart.element.id + 'AxisGroup' + index + 'Inside');
        } else {
            return document.getElementById(chart.element.id + 'AxisGroup' + index + 'Outside');
        }
    }

    private createZoomingLabel(chart: Chart, labelElement: Element, axis: Axis, index: number, rect: Rect): void {
        let parentNode: Element = this.findParentNode(chart, labelElement, axis, index);
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
}