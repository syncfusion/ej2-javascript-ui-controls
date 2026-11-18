/**
 * Matrix (`m:m`) function.
 */

import { arrayItem } from '../../../core/array-item';
import { OfficeMath } from './office-math';
import { MathFunctionType, MathVerticalAlignment, MathHorizontalAlignment, SpacingRule } from './enums';
import { K } from './keys';
import { checkRowSpacing } from './functions-multi';
import { OfficeMathFunctionBase } from './function-base';
import { OfficeMathEntity } from './entity';
import { OfficeMathMatrixRow } from './matrix-row';
import { OfficeMathMatrixColumn } from './matrix-column';
import { OfficeMathMatrixRowCollection, OfficeMathMatrixColumnCollection } from './matrix-collections';

/** A run of consecutive columns that share the same horizontal alignment (`m:mcs`). @public */
export interface MatrixColumnGroup {
    /** Index of the first column in the group. */
    startIndex: number;
    /** Number of columns in the group. */
    count: number;
    /** Shared horizontal alignment. */
    horizontalAlignment: MathHorizontalAlignment;
}

/**
 * Matrix whose rows and columns are kept synchronized: every row always has one cell per column.
 *
 * @public
 */
export class OfficeMathMatrix extends OfficeMathFunctionBase {
    readonly type: MathFunctionType.Matrix = MathFunctionType.Matrix;
    private readonly _rows: OfficeMathMatrixRowCollection;
    private readonly _columns: OfficeMathMatrixColumnCollection;

    constructor(owner?: OfficeMathEntity) {
        super(owner);
        this._rows = new OfficeMathMatrixRowCollection(this);
        this._columns = new OfficeMathMatrixColumnCollection(this);
    }

    /** Rows of the matrix. */
    get rows(): OfficeMathMatrixRowCollection { return this._rows; }
    /** Columns of the matrix. */
    get columns(): OfficeMathMatrixColumnCollection { return this._columns; }

    /** Vertical alignment. Default center. */
    get verticalAlignment(): MathVerticalAlignment { return this.getProperty(K.MatrixAlign, () => MathVerticalAlignment.Center); }
    set verticalAlignment(value: MathVerticalAlignment) { this.setProperty(K.MatrixAlign, value); }
    /** Hides placeholders for empty cells. Default false. */
    get hidePlaceholder(): boolean { return this.getProperty(K.PlaceHoldHidden, () => false); }
    set hidePlaceholder(value: boolean) { this.setProperty(K.PlaceHoldHidden, value); }

    /** Row spacing; unit depends on `rowSpacingRule`. Default 0. */
    get rowSpacing(): number { return this.getProperty(K.RowSpacing, () => 0); }
    set rowSpacing(value: number) {
        checkRowSpacing(value, this.rowSpacingRule);
        this.setProperty(K.RowSpacing, value);
    }
    /** Row spacing rule (`m:rSpRule`). Default single. */
    get rowSpacingRule(): SpacingRule { return this.getProperty(K.RowSpacingRule, () => SpacingRule.Single); }
    set rowSpacingRule(value: SpacingRule) { this.setProperty(K.RowSpacingRule, value); }
    /** Column gap (`m:cGp`). Default 0. */
    get columnGap(): number { return this.getProperty(K.ColumnGap, () => 0); }
    set columnGap(value: number) { this.setProperty(K.ColumnGap, value); }
    /** Column gap rule (`m:cGpRule`). Default single. */
    get columnGapRule(): SpacingRule { return this.getProperty(K.ColumnGapRule, () => SpacingRule.Single); }
    set columnGapRule(value: SpacingRule) { this.setProperty(K.ColumnGapRule, value); }
    /** DocIO-compatible alias of `hidePlaceholder` (`m:plcHide`). */
    get hidePlaceHolders(): boolean { return this.hidePlaceholder; }
    set hidePlaceHolders(value: boolean) { this.hidePlaceholder = value; }
    /** DocIO-compatible alias of `columnGapRule` (`m:cGpRule`). */
    get columnSpacingRule(): SpacingRule { return this.columnGapRule; }
    set columnSpacingRule(value: SpacingRule) { this.columnGapRule = value; }
    /** DocIO-compatible name for the column width (`m:cSp`); shares storage with `columnSpacing`. */
    get columnWidth(): number { return this.columnSpacing; }
    set columnWidth(value: number) { this.columnSpacing = value; }
    /** Column spacing (`m:cSp`). Default 0. */
    get columnSpacing(): number { return this.getProperty(K.ColumnSpacing, () => 0); }
    set columnSpacing(value: number) { this.setProperty(K.ColumnSpacing, value); }

    /** Column groups: consecutive columns with identical alignment, in order. */
    get columnGroups(): MatrixColumnGroup[] {
        const groups: MatrixColumnGroup[] = [];
        this._columns.toArray().forEach((column: OfficeMathMatrixColumn, index: number) => {
            const last: MatrixColumnGroup = groups[groups.length - 1];
            if (last !== undefined && last.horizontalAlignment === column.horizontalAlignment) {
                last.count++;
            } else {
                groups.push({ startIndex: index, count: 1, horizontalAlignment: column.horizontalAlignment });
            }
        });
        return groups;
    }

    /**
     * Re-links every cell to its row and column after a structural change.
     *
     * @returns {void} Nothing is returned.
     * @private
     */
    relink(): void {
        const columns: OfficeMathMatrixColumn[] = this._columns.toArray();
        this._rows.toArray().forEach((row: OfficeMathMatrixRow) => {
            row.arguments.toArray().forEach((cell: OfficeMath, i: number) => cell.setOwnerColumn(arrayItem(columns, i)));
        });
    }

    /** @private */
    get rowItems(): OfficeMathMatrixRow[] { return this._rows.toArray(); }
}
