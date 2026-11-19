/**
 * Internal sparse cell storage model (not public API).
 *
 * @private
 */
import { CellFormulaState } from './formula';
import { CellValue } from './types';
/**
 * Wire/storage kind for a cell payload.
 */
export declare type CellStorageKind = 'empty' | 'number' | 'sharedString' | 'inlineString' | 'boolean' | 'error' | 'str';
/**
 * One sparse cell entry.
 */
export interface CellModel {
    /** 1-based row. */
    readonly row: number;
    /** 1-based column. */
    readonly col: number;
    kind: CellStorageKind;
    /** Numeric / boolean / error code / shared-string index / inline plain / str text. */
    raw: string | number | boolean | undefined;
    /** Style index `s` when present. */
    styleIndex: number | undefined;
    /**
     * Structured formula state (`CT_CellFormula`) when present.
     * Replaces M1.1 opaque formulaXml.
     */
    formula: CellFormulaState | undefined;
    /** Full original `<is>…</is>` when inlineStr had structure we preserve. */
    inlineIsXml: string | undefined;
    /** Plain text extracted from inlineStr for getters. */
    inlinePlain: string | undefined;
    /** Extra cell attributes excluding r/t/s (escaped name="value" pairs). */
    extraAttrsXml: string;
    /** Unknown children other than f/v/is (full element strings). */
    preserveChildrenXml: string[];
    /** True when this cell was mutated via public API this session. */
    dirty: boolean;
    /**
     * 1-based value-metadata index (`c/@vm`, ECMA-376-1 §18.3.1.4) into
     * `xl/metadata.xml` `valueMetadata`. Picture in Cell uses it to bind the cell
     * to a rich value. Absent when the cell has no value metadata.
     */
    vm?: number;
}
/**
 * Create an empty cell shell at coordinates.
 *
 * @param {number} row - The row parameter.
 * @param {number} col - The col parameter.
 * @returns {CellModel} - Returns the result.
 */
export declare function createEmptyCellModel(row: number, col: number): CellModel;
/**
 * Whether the cell still needs a sparse entry after clear.
 *
 * @param {CellModel} model - The model parameter.
 * @returns {boolean} - Returns the result.
 */
export declare function cellModelHasResidue(model: CellModel): boolean;
/**
 * Resolve public {@link CellValue} from storage (SST resolve supplied by caller).
 *
 * @param {*} model - The model parameter.
 * @param {any} resolveShared - The resolveShared parameter.
 * @returns {CellValue} - Returns the result.
 */
export declare function modelToCellValue(model: CellModel | undefined, resolveShared: (index: number) => string): CellValue;
