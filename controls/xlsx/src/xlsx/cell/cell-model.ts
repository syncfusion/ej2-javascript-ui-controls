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
export type CellStorageKind = 'empty' | 'number' | 'sharedString' | 'inlineString' | 'boolean' | 'error' | 'str';

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
export function createEmptyCellModel(row: number, col: number): CellModel {
    return {
        row,
        col,
        kind: 'empty',
        raw: undefined,
        styleIndex: undefined,
        formula: undefined,
        inlineIsXml: undefined,
        inlinePlain: undefined,
        extraAttrsXml: '',
        preserveChildrenXml: [],
        dirty: false
    };
}

/**
 * Whether the cell still needs a sparse entry after clear.
 *
 * @param {CellModel} model - The model parameter.
 * @returns {boolean} - Returns the result.
 */
export function cellModelHasResidue(model: CellModel): boolean {
    if (model.kind !== 'empty') {
        return true;
    }
    if (model.styleIndex !== undefined) {
        return true;
    }
    if (model.formula !== undefined) {
        return true;
    }
    if (model.extraAttrsXml.length > 0) {
        return true;
    }
    if (model.vm !== undefined) {
        return true;
    }
    if (model.preserveChildrenXml.length > 0) {
        return true;
    }
    if (model.inlineIsXml !== undefined) {
        return true;
    }
    return false;
}

/**
 * Resolve public {@link CellValue} from storage (SST resolve supplied by caller).
 *
 * @param {*} model - The model parameter.
 * @param {any} resolveShared - The resolveShared parameter.
 * @returns {CellValue} - Returns the result.
 */
export function modelToCellValue(model: CellModel | undefined, resolveShared: (index: number) => string): CellValue {
    if (model === undefined || model.kind === 'empty') {
        return null;
    }
    switch (model.kind) {
    case 'number': {
        const n: number = typeof model.raw === 'number' ? model.raw : Number(model.raw);
        return Number.isFinite(n) ? n : null;
    }
    case 'boolean':
        return model.raw === true || model.raw === 1 || model.raw === '1';
    case 'error':
        return { type: 'error', code: String(model.raw != null ? model.raw : '#N/A') };
    case 'sharedString': {
        const idx: number =
                typeof model.raw === 'number' ? model.raw : Number.parseInt(String(model.raw != null ? model.raw : '0'), 10);
        return resolveShared(idx);
    }
    case 'inlineString':
        return model.inlinePlain != null ? model.inlinePlain : '';
    case 'str':
        return String(model.raw != null ? model.raw : '');
    default:
        return null;
    }
}
