/**
 * Matrix row and column collections that keep rows and columns synchronized.
 */

import { OwnedCollection } from './collection';
import { OfficeMath } from './office-math';
import { OfficeMathMatrixRow } from './matrix-row';
import { OfficeMathMatrixColumn } from './matrix-column';
import { OfficeMathMatrix } from './matrix';

/**
 * Rows of a matrix. New rows receive one cell per existing column.
 *
 * @public
 */
export class OfficeMathMatrixRowCollection extends OwnedCollection<OfficeMathMatrixRow> {
    private readonly matrix: OfficeMathMatrix;

    constructor(matrix: OfficeMathMatrix) {
        super(matrix);
        this.matrix = matrix;
    }

    /**
     * Creates a row and appends it, or inserts it at `index`.
     *
     * @param {number | undefined} index - The index.
     * @returns {OfficeMathMatrixRow} The result.
     */
    add(index?: number): OfficeMathMatrixRow {
        const row: OfficeMathMatrixRow = new OfficeMathMatrixRow();
        const columnCount: number = this.matrix.columns.count;
        for (let i: number = 0; i < columnCount; i++) {
            row.arguments.pushRaw(new OfficeMath(row));
        }
        this.insertItem(index === undefined ? this.count : index, row);
        return row;
    }

    protected afterChange(): void {
        this.matrix.relink();
        super.afterChange();
    }
}

/**
 * Columns of a matrix. Adding or removing a column adds or removes the cell in every row.
 *
 * @public
 */
export class OfficeMathMatrixColumnCollection extends OwnedCollection<OfficeMathMatrixColumn> {
    private readonly matrix: OfficeMathMatrix;

    constructor(matrix: OfficeMathMatrix) {
        super(matrix);
        this.matrix = matrix;
    }

    /**
     * Creates a column and appends it, or inserts it at `index`.
     *
     * @param {number | undefined} index - The index.
     * @returns {OfficeMathMatrixColumn} The result.
     */
    add(index?: number): OfficeMathMatrixColumn {
        const position: number = index === undefined ? this.count : index;
        const column: OfficeMathMatrixColumn = new OfficeMathMatrixColumn();
        this.insertItem(position, column);
        return column;
    }

    /**
     * Removes the column and its cell in every row.
     *
     * @param {number} index - The index.
     * @returns {void} Nothing is returned.
     */
    removeAt(index: number): void {
        super.removeAt(index);
        this.matrix.rowItems.forEach((row: OfficeMathMatrixRow) => row.arguments.removeRawAt(index));
        this.matrix.relink();
    }

    /**
     * Removes all columns and every cell.
     *
     * @returns {void} Nothing is returned.
     */
    clear(): void {
        super.clear();
        this.matrix.rowItems.forEach((row: OfficeMathMatrixRow) => {
            while (row.arguments.count > 0) { row.arguments.removeRawAt(row.arguments.count - 1); }
        });
    }

    protected afterChange(): void {
        this.matrix.relink();
        super.afterChange();
    }

    /**
     * Adds the matching cell to every row once the column is inserted.
     *
     * @param {number} index - The index.
     * @param {OfficeMathMatrixColumn} item - The item.
     * @returns {void} Nothing is returned.
     */
    insertItem(index: number, item: OfficeMathMatrixColumn): void {
        super.insertItem(index, item);
        this.matrix.rowItems.forEach((row: OfficeMathMatrixRow) => row.arguments.insertRaw(index, new OfficeMath(row)));
        this.matrix.relink();
    }
}
