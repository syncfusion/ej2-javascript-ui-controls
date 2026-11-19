/**
 * Office Math equation (`m:oMath`): a container of Math functions.
 */

import { OwnerHolder } from './owner-holder';
import { OfficeMathEntity } from './entity';
import { OfficeMathFunctionCollection } from './function-collection';
import { OfficeMathBreakCollection } from './break';
import { K } from './keys';
import { OpenXmlElement } from '../openxml';

/** Column back-reference used by matrix synchronization. */
interface ColumnLink {
    readonly columnIndex: number;
}

/**
 * Equation that holds an ordered list of Math functions.
 *
 * @public
 */
export class OfficeMath extends OwnerHolder {
    private readonly _functions: OfficeMathFunctionCollection;
    private readonly _breaks: OfficeMathBreakCollection;
    private _column: ColumnLink | undefined;
    private _preservedControl: OpenXmlElement | undefined;

    constructor(owner?: OfficeMathEntity) {
        super(owner);
        this._functions = new OfficeMathFunctionCollection(this);
        this._breaks = new OfficeMathBreakCollection(this);
    }

    /** Manual breaks owned by this equation; a box references one of them. */
    get breaks(): OfficeMathBreakCollection { return this._breaks; }

    /** Functions of this equation. */
    get functions(): OfficeMathFunctionCollection { return this._functions; }

    /**
     * Argument size (`m:argPr/m:argSz`), from -2 to 2. Default 0.
     *
     * @returns {number} The argument size.
     */
    get argumentSize(): number { return this.getProperty(K.ArgumentSize, () => 0); }
    set argumentSize(value: number) {
        if (value < -2 || value > 2 || Math.floor(value) !== value) {
            throw new RangeError('ArgumentSize must be an integer between -2 and 2.');
        }
        this.setProperty(K.ArgumentSize, value);
    }

    /**
     * The original `m:ctrlPr` of an argument, kept verbatim for round trips.
     *
     * @returns {OpenXmlElement | undefined} The preserved element, when present.
     * @private
     */
    get preservedControlProperties(): OpenXmlElement | undefined { return this._preservedControl; }
    set preservedControlProperties(value: OpenXmlElement | undefined) {
        this._preservedControl = value;
        this.notifyMutated();
    }

    /** The nearest enclosing equation, or `undefined` for a top-level equation. */
    get ownerMath(): OfficeMath | undefined {
        let entity: OfficeMathEntity | undefined = this.ownerMathEntity;
        while (entity !== undefined) {
            if (entity instanceof OfficeMath) { return entity; }
            entity = entity.ownerMathEntity;
        }
        return undefined;
    }

    /** The matrix row that owns this cell, or `undefined` when it is not a matrix cell. */
    get ownerRow(): OfficeMathEntity | undefined {
        const owner: OfficeMathEntity | undefined = this.ownerMathEntity;
        return owner !== undefined && 'arguments' in owner ? owner : undefined;
    }

    /** The matrix column that contains this cell, or `undefined` when it is not a matrix cell. */
    get ownerColumn(): ColumnLink | undefined { return this._column; }

    /**
     * @private
     * @param {ColumnLink | undefined} column The column the equation belongs to.
     * @returns {void}
     */
    setOwnerColumn(column: ColumnLink | undefined): void { this._column = column; }
}
