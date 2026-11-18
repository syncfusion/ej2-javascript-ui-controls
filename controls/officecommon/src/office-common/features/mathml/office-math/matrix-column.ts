/**
 * Matrix column.
 */

import { setOwnValue } from '../../../core/own-value';
import { arrayItem } from '../../../core/array-item';
import { OfficeMathMatrixRow } from './matrix-row';
import { OwnerHolder } from './owner-holder';
import { MathHorizontalAlignment } from './enums';
import { K } from './keys';
import { OfficeMath } from './office-math';
import { OfficeMathMatrix } from './matrix';

/**
 * Read-only view of the cells of one column.
 *
 * @public
 */
export class OfficeMathMatrixColumnArguments {
    [index: number]: OfficeMath;
    private readonly _items: OfficeMath[];

    constructor(items: OfficeMath[]) {
        this._items = items;
        items.forEach((item: OfficeMath, i: number) => { setOwnValue(this, i, item); });
    }

    /** Number of cells. */
    get count(): number { return this._items.length; }
    /**
     * Returns the cell at `index`.
     *
     * @param {number} index - The index.
     * @returns {OfficeMath} The result.
     */
    getItem(index: number): OfficeMath {
        if (!(index >= 0 && index < this._items.length)) { throw new RangeError('Index ' + index + ' is out of range.'); }
        return arrayItem(this._items, index);
    }
    /**
     * Not supported: cells are created when rows are added.
     *
     * @returns {never} The result.
     */
    add(): never { throw new Error('Cells are managed by the matrix; add a row instead.'); }
    /**
     * Iterates the cells top to bottom.
     *
     * @returns {Iterator<OfficeMath>} The result.
     */
    [Symbol.iterator](): Iterator<OfficeMath> { return this._items[Symbol.iterator](); }
}

/**
 * Column of a matrix.
 *
 * @public
 */
export class OfficeMathMatrixColumn extends OwnerHolder {
    constructor(owner?: OfficeMathMatrix) { super(owner); }

    /** Horizontal alignment of the column. Default center. */
    get horizontalAlignment(): MathHorizontalAlignment {
        return this.getProperty(K.MatrixAlign, () => MathHorizontalAlignment.Center);
    }
    set horizontalAlignment(value: MathHorizontalAlignment) { this.setProperty(K.MatrixAlign, value); }

    /** Index of the column in its matrix, or -1 when detached. */
    get columnIndex(): number {
        const matrix: OfficeMathMatrix = this.ownerMathEntity as OfficeMathMatrix | undefined;
        return matrix === undefined ? -1 : matrix.columns.toArray().indexOf(this);
    }

    /** Cells of this column, one per row. */
    get arguments(): OfficeMathMatrixColumnArguments {
        const matrix: OfficeMathMatrix = this.ownerMathEntity as OfficeMathMatrix | undefined;
        const index: number = this.columnIndex;
        const cells: OfficeMath[] = matrix === undefined ?
            [] :
            matrix.rowItems.map((row: OfficeMathMatrixRow) => row.arguments.getItem(index));
        return new OfficeMathMatrixColumnArguments(cells);
    }
}
