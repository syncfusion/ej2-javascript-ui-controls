import { Chart3D } from '../chart3D';
import { Chart3DAxis, Chart3DRow, Chart3DColumn } from './axis';
import { subtractThickness, sum} from '../../common/utils/helper';
import { subArray } from '../../common/utils/helper';
import { Thickness } from '../../common/utils/helper';
import { Size, Rect } from '@syncfusion/ej2-svg-base';

/**
 * Specifies the Cartesian Axis Layout.
 */
const axisPadding: number = 10;
/**
 * The `CartesianAxisLayoutPanel` class is responsible for managing the layout of Cartesian axes in a 3D chart.
 */
export class CartesianAxisLayoutPanel {

    private chart: Chart3D;
    private initialClipRect: Rect;
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
    /**
     *
     *
     * @param {Chart3D} chartModule - Specifies the chart module.
     * @private
     */
    constructor(chartModule?: Chart3D) {
        this.chart = chartModule;
    }

    /**
     * Measures and calculates the dimensions of the axis based on the provided rectangle.
     *
     * @param {Rect} rect - The rectangle used as a reference for axis measurement and sizing.
     * @returns {void}
     */
    public measureAxis(rect: Rect): void {

        const chart: Chart3D = this.chart;

        this.seriesClipRect = new Rect(rect.x, rect.y, rect.width, rect.height);

        this.initialClipRect = rect;

        this.leftSize = 0; this.rightSize = 0; this.topSize = 0; this.bottomSize = 0;

        this.measureRowAxis(chart, this.initialClipRect);

        this.initialClipRect = subtractThickness(this.initialClipRect, new Thickness(this.leftSize, this.rightSize, 0, 0));

        this.measureColumnAxis(chart, this.initialClipRect);

        this.initialClipRect = subtractThickness(this.initialClipRect, new Thickness(0, 0, this.topSize, this.bottomSize));

        if (!this.chart.delayRedraw) {
            this.calculateAxisSize(this.initialClipRect);
        }

        this.leftSize = 0; this.rightSize = 0; this.topSize = 0; this.bottomSize = 0;

        this.measureRowAxis(chart, this.initialClipRect);

        this.seriesClipRect = subtractThickness(this.seriesClipRect, new Thickness(this.leftSize, this.rightSize, 0, 0));

        this.measureColumnAxis(chart, this.initialClipRect);

        this.seriesClipRect = subtractThickness(this.seriesClipRect, new Thickness(0, 0, this.topSize, this.bottomSize));

        if (!this.chart.delayRedraw) {
            chart.refreshAxis();
            this.calculateAxisSize(this.seriesClipRect);
        }
    }

    /**
     * Measures and calculates the dimensions of the row axis within the 3D chart.
     *
     * @param {Chart3D} chart - The 3D chart containing the row axis.
     * @param {Rect} rect - The initial rect values.
     * @returns {void}
     */
    private measureRowAxis(chart: Chart3D, rect: Rect): void {
        let row: Chart3DRow;
        this.calculateRowSize(rect);
        for (const item of chart.rows) {
            row = <Chart3DRow>item;
            row.nearSizes = [];
            row.farSizes = [];
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

    /**
     * Measures and calculates the dimensions of the column axis within the 3D chart.
     *
     * @param {Chart3D} chart - The 3D chart containing the column axis.
     * @param {Rect} rect - The initial rect values.
     * @returns {void}
     */
    private measureColumnAxis(chart: Chart3D, rect: Rect): void {
        let column: Chart3DColumn;
        this.calculateColumnSize(rect);
        for (const item of chart.columns) {
            column = <Chart3DColumn>item;
            column.farSizes = [];
            column.nearSizes = [];
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
     * @param {Chart3DRow | Chart3DColumn} definition - Specifies the row or column.
     * @param {Chart3D} chart - Specifies the chart.
     * @param {Size} size - Specifies the size.
     * @returns {void}
     * @private
     */
    public measureDefinition(definition: Chart3DRow | Chart3DColumn, chart: Chart3D, size: Size): void {
        for (const axis of definition.axes) {
            axis.getModule(chart);
            axis.baseModule.calculateRangeAndInterval(size, axis);
            definition.computeSize(axis, chart);
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
     * @param {Rect} rect - The initial rect values.
     * @returns {void}
     * @private
     */
    private calculateAxisSize(rect: Rect): void {
        const chart: Chart3D = this.chart;
        let row: Chart3DRow;
        let column: Chart3DColumn;
        let definition: Chart3DRow | Chart3DColumn;
        let axis: Chart3DAxis;
        let nearCount: number = 0;
        let farCount: number = 0;
        let size: number = 0;
        let x: number; let y: number;
        let axisOffset: number;
        this.calculateRowSize(rect);
        for (let i: number = 0, len: number = chart.rows.length; i < len; i++) {
            row = <Chart3DRow>chart.rows[i as number];
            nearCount = 0; farCount = 0;
            for (let j: number = 0, len: number = row.axes.length; j < len; j++) {
                axis = row.axes[j as number];
                axisOffset = axis.plotOffset;
                if (axis.rect.height === 0) {
                    axis.rect.height = row.computedHeight;
                    size = 0;
                    for (let k: number = i + 1, len: number = i + axis.span; k < len; k++) {
                        definition = <Chart3DRow>chart.rows[k as number];
                        size += definition.computedHeight;
                    }
                    axis.rect.y = (row.computedTop - size) + (axis.plotOffsetTop ? axis.plotOffsetTop : axisOffset);
                    axis.rect.height = (axis.rect.height + size) -
                        (this.getAxisOffsetValue(axis.plotOffsetTop, axis.plotOffsetBottom, axis.plotOffset));
                    axis.rect.width = 0;
                }
                if (axis.isAxisOpposedPosition) {
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
            column = <Chart3DColumn>chart.columns[i as number];
            nearCount = 0;
            farCount = 0;
            for (let j: number = 0, len: number = column.axes.length; j < len; j++) {
                axis = column.axes[j as number];
                axisOffset = axis.plotOffset;
                if (axis.rect.width === 0) {
                    for (let k: number = i, len: number = (i + axis.span); k < len; k++) {
                        definition = <Chart3DColumn>chart.columns[k as number];
                        axis.rect.width += definition.computedWidth;
                    }
                    axis.rect.x = column.computedLeft + (axis.plotOffsetLeft ? axis.plotOffsetLeft : axisOffset);
                    axis.rect.width -= (this.getAxisOffsetValue(axis.plotOffsetLeft, axis.plotOffsetRight, axis.plotOffset));
                    axis.rect.height = 0;
                }
                if (axis.isAxisOpposedPosition) {
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
     *
     * @returns {void}
     * @private
     */
    public measure(): void {
        const chart: Chart3D = this.chart;
        let row: Chart3DRow;
        let column: Chart3DColumn;
        let definition: Chart3DRow | Chart3DColumn;
        let actualIndex: number;
        let span: number;
        for (const axis of chart.axisCollections) {
            if (axis.orientation === 'Vertical') {
                chart.verticalAxes.push(axis);
                actualIndex = this.getActualRow(axis);
                row = <Chart3DRow>chart.rows[actualIndex as number];
                this.pushAxis(row, axis);
                span = ((actualIndex + axis.span) > chart.rows.length ? chart.rows.length : (actualIndex + axis.span));
                for (let j: number = actualIndex + 1; j < span; j++) {
                    definition = <Chart3DRow>chart.rows[j as number];
                    definition.axes[row.axes.length - 1] = axis;
                    chart.rows[j as number] = definition;
                }
                chart.rows[actualIndex as number] = row;
            } else {
                chart.horizontalAxes.push(axis);
                actualIndex = this.getActualColumn(axis);
                column = <Chart3DColumn>chart.columns[actualIndex as number];
                this.pushAxis(column, axis);
                span = ((actualIndex + axis.span) > chart.columns.length ? chart.columns.length : (actualIndex + axis.span));
                for (let j: number = actualIndex + 1; j < span; j++) {
                    definition = <Chart3DColumn>chart.columns[j as number];
                    definition.axes[column.axes.length - 1] = axis;
                    chart.columns[j as number] = definition;
                }
                chart.columns[actualIndex as number] = column;
            }
            axis.isRTLEnabled = chart.enableRtl;
            axis.setIsInversedAndOpposedPosition();
        }
    }

    /**
     * Calculates the offset value for an axis based on positions and a plot offset.
     *
     * @param {number} position1 - The first position.
     * @param {number} position2 - The second position.
     * @param {number} plotOffset - The plot offset value.
     * @returns {number} - The calculated axis offset value.
     */
    private getAxisOffsetValue(position1: number, position2: number, plotOffset: number): number {
        const rangeOffset: number = position1 ? (position1 + (position2 ? position2 :
            plotOffset)) : (position2 ? position2 + plotOffset : 2 * plotOffset);
        return rangeOffset;
    }

    /**
     * Pushes an axis definition into the specified row or column within the 3D chart.
     *
     * @param {Chart3DRow | Chart3DColumn} definition - The row or column definition to which the axis is added.
     * @param {Chart3DAxis} axis - The axis to be pushed into the definition.
     * @returns {void}
     */
    private pushAxis(definition: Chart3DRow | Chart3DColumn, axis: Chart3DAxis): void {
        for (let i: number = 0, len: number = definition.axes.length; i <= len; i++) {
            if (!definition.axes[i as number]) {
                definition.axes[i as number] = axis;
                break;
            }
        }
    }

    /**
     * Arranges and positions axis elements within the specified row or column definition.
     *
     * @param {Chart3DRow | Chart3DColumn} definition - The row or column definition in which axis elements are arranged.
     * @returns {void}
     */
    private arrangeAxis(definition: Chart3DRow | Chart3DColumn): void {
        const axisCollection: Chart3DAxis[] = [];
        for (let i: number = 0, len: number = definition.axes.length; i <= len; i++) {
            if (definition.axes[i as number]) {
                axisCollection.push(definition.axes[i as number]);
            }
        }
        definition.axes = axisCollection;
    }

    /**
     * Retrieves the actual column index for the specified axis within the 3D chart.
     *
     * @param {Chart3DAxis} axis - The axis for which the actual column index is retrieved.
     * @returns {number} - The actual column index.
     */
    private getActualColumn(axis: Chart3DAxis): number {
        const actualLength: number = this.chart.columns.length;
        const pos: number = axis.columnIndex;
        const result: number = pos >= actualLength ? actualLength - 1 : (pos < 0 ? 0 : pos);
        return result;
    }

    /**
     * Retrieves the actual row index for the specified axis within the 3D chart.
     *
     * @param {Chart3DAxis} axis - The axis for which the actual row index is retrieved.
     * @returns {number} - The actual row index.
     */
    private getActualRow(axis: Chart3DAxis): number {
        const actualLength: number = this.chart.rows.length;
        const pos: number = axis.rowIndex;
        const result: number = pos >= actualLength ? actualLength - 1 : (pos < 0 ? 0 : pos);
        return result;
    }

    /**
     * Measure the row size.
     *
     * @param {Rect} rect - The available rect value.
     * @returns {void}
     */
    private calculateRowSize(rect: Rect): void {
        /*! Calculate row size */
        const chart: Chart3D = this.chart;
        let row: Chart3DRow;
        let rowTop: number = rect.y + rect.height;
        let height: number = 0;

        let remainingHeight: number = Math.max(0, rect.height);
        for (let i: number = 0, len: number = chart.rows.length; i < len; i++) {
            row = <Chart3DRow>chart.rows[i as number];
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
     * Measure the column size.
     *
     * @param {Rect} rect - The available rect value.
     * @returns {void}
     */
    private calculateColumnSize(rect: Rect): void {
        /*! Calculate column size */

        const chart: Chart3D = this.chart;
        let column: Chart3DColumn;
        let columnLeft: number = rect.x;
        let width: number = 0;

        let remainingWidth: number = Math.max(0, rect.width);

        for (let i: number = 0, len: number = chart.columns.length; i < len; i++) {
            column = <Chart3DColumn>chart.columns[i as number];
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
}
