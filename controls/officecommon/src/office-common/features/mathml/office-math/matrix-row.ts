/**
 * Matrix row.
 */

import { OwnerHolder } from './owner-holder';
import { OwnedCollection, CollectionOwner } from './collection';
import { OfficeMath } from './office-math';
import { OfficeMathMatrix } from './matrix';

/**
 * Cells of a row. Managed by matrix synchronization, so direct mutation is rejected.
 *
 * @public
 */
export class OfficeMathMatrixRowArguments extends OwnedCollection<OfficeMath> {
    constructor(owner: CollectionOwner) { super(owner); }

    /**
     * Not supported: cells are created when columns are added.
     *
     * @returns {never} The result.
     */
    add(): never { throw new Error('Cells are managed by the matrix; add a column instead.'); }
    /**
     * Not supported: cells are managed by the matrix.
     *
     * @returns {never} The result.
     */
    insert(): never { throw new Error('Cells are managed by the matrix.'); }
    /**
     * Not supported: cells are managed by the matrix.
     *
     * @returns {never} The result.
     */
    removeAt(): never { throw new Error('Cells are managed by the matrix; remove a column instead.'); }
    /**
     * Not supported: cells are managed by the matrix.
     *
     * @returns {never} The result.
     */
    remove(): never { throw new Error('Cells are managed by the matrix; remove a column instead.'); }
    /**
     * Not supported: cells are managed by the matrix.
     *
     * @returns {never} The result.
     */
    clear(): never { throw new Error('Cells are managed by the matrix; remove columns instead.'); }
}

/**
 * Row of a matrix holding one cell per column.
 *
 * @public
 */
export class OfficeMathMatrixRow extends OwnerHolder {
    private readonly _arguments: OfficeMathMatrixRowArguments;

    constructor(owner?: OfficeMathMatrix) {
        super(owner);
        this._arguments = new OfficeMathMatrixRowArguments(this);
    }

    /** Cells of the row. */
    get arguments(): OfficeMathMatrixRowArguments { return this._arguments; }

    /** Index of the row in its matrix, or -1 when detached. */
    get rowIndex(): number {
        const matrix: OfficeMathMatrix = this.ownerMathEntity as OfficeMathMatrix | undefined;
        return matrix === undefined ? -1 : matrix.rowItems.indexOf(this);
    }
}
