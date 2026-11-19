/**
 * Worksheet sheet format properties (`CT_SheetFormatPr`).
 *
 * Citations:
 * - transitional sml.xsd `CT_SheetFormatPr` (~L2222–2232):
 *   `baseColWidth`, `defaultColWidth`, **`defaultRowHeight` (required)**,
 *   `customHeight`, `zeroHeight`, `thickTop`, `thickBottom`,
 *   `outlineLevelRow`, `outlineLevelCol`
 * - `CT_Worksheet` sequence: sheetPr → dimension → sheetViews →
 *   **sheetFormatPr** → cols → sheetData (~L2123–2125 / ~L2175–2177)
 * - docs/requirements/row-column-properties.md
 * - docs/specs/standard-height.md; docs/ooxml-mapping/standard-height.md
 *
 * Public authoring uses
 * {@link import('../workbook/worksheet').Worksheet.standardHeight} only.
 * Other `sheetFormatPr` attributes round-trip via `extraAttrsXml`.
 *
 * @private
 */

import { InvalidArgumentError } from '../core/errors';
import {
    attrsToXmlExcluding,
    escapeXml,
    parseAttrMap
} from '../core/xml/minimal-xml';

/**
 * Wire model for one `sheetFormatPr` element.
 *
 * @private
 */
export interface SheetFormatPrModel {
    /**
     * Whether a `sheetFormatPr` element is present (authored or loaded).
     * When false, the serializer omits the element entirely.
     */
    readonly present: boolean;
    /**
     * Sheet default row height in points (`@defaultRowHeight`).
     * XSD marks the attribute required when the element is present; authoring
     * always emits it. Soft-absent on parse when missing/non-finite/negative.
     */
    readonly defaultRowHeight: number | undefined;
    /**
     * Opaque extra attributes excluding the modeled `defaultRowHeight`.
     * Carries baseColWidth, defaultColWidth, customHeight, zeroHeight,
     * thick*, outlineLevel*, and any future unrecognized attrs.
     */
    readonly extraAttrsXml: string;
}

/** @private */
export interface SheetFormatPrHost {
    markDirty(): void;
}

/** Empty / absent element. @private */
export const EMPTY_SHEET_FORMAT_PR: SheetFormatPrModel = {
    present: false,
    defaultRowHeight: undefined,
    extraAttrsXml: ''
};

/**
 * `CT_Worksheet` local names that legally precede `sheetFormatPr`
 * (before `sheetData`).
 *
 * @private
 */
export const SHEET_FORMAT_PR_PREDECESSORS: ReadonlyArray<string> = [
    'sheetPr',
    'dimension',
    'sheetViews'
];

/**
 * `CT_Worksheet` local names that follow `sheetFormatPr` before `sheetData`.
 *
 * @private
 */
export const SHEET_FORMAT_PR_SUCCESSORS_BEFORE_SHEET_DATA: ReadonlyArray<string> = [
    'cols'
];

/**
 * Insert index for a modeled `sheetFormatPr` among before-sheetData children.
 * After the last predecessor; before the first successor; else append.
 *
 * @private
 *
 * @param {ReadonlyArray<string>} localNames - The localNames parameter.
 * @returns {number} - Returns the result.
 */
export function findSheetFormatPrInsertIndex(
    localNames: ReadonlyArray<string>
): number {
    let afterPred: number = 0;
    for (let i: number = 0; i < localNames.length; i++) {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const name: string = localNames[i];
        if (name !== undefined && SHEET_FORMAT_PR_PREDECESSORS.indexOf(name) >= 0) {
            afterPred = i + 1;
        }
    }
    for (let i: number = afterPred; i < localNames.length; i++) {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const name: string = localNames[i];
        if (
            name !== undefined &&
      SHEET_FORMAT_PR_SUCCESSORS_BEFORE_SHEET_DATA.indexOf(name) >= 0
        ) {
            return i;
        }
    }
    return localNames.length;
}

/**
 * Parse a `sheetFormatPr` element string into a model.
 * Soft-skips invalid `defaultRowHeight`; preserves all other attrs.
 *
 * @private
 *
 * @param {string} elementXml - The elementXml parameter.
 * @returns {SheetFormatPrModel} - Returns the result.
 */
export function parseSheetFormatPrXml(elementXml: string): SheetFormatPrModel {
    const attrs: Map<string, string> = parseAttrMap(elementOpenAttrsLocal(elementXml));
    const raw: string = attrs.get('defaultRowHeight');
    let defaultRowHeight: number | undefined;
    if (raw !== undefined && raw !== '') {
        const n: number = Number(raw);
        if (Number.isFinite(n) && n >= 0) {
            defaultRowHeight = n;
        }
    }
    return {
        present: true,
        defaultRowHeight,
        extraAttrsXml: attrsToXmlExcluding(attrs, new Set(['defaultRowHeight']))
    };
}

/**
 * Serialize a sheetFormatPr model. Omits when `present` is false and nothing
 * authored. When present, always emits required `@defaultRowHeight`
 * (XSD use="required"); uses `0` if height is still undefined so the element
 * stays schema-valid.
 *
 * @private
 *
 * @param {SheetFormatPrModel} model - The model parameter.
 * @returns {string | undefined} - Returns the result.
 */
export function serializeSheetFormatPrXml(
    model: SheetFormatPrModel
): string | undefined {
    if (!model.present) {
        return undefined;
    }
    const height: number =
    model.defaultRowHeight !== undefined &&
    Number.isFinite(model.defaultRowHeight) &&
    model.defaultRowHeight >= 0
        ? model.defaultRowHeight
        : 0;
    const parts: string[] = [
        `defaultRowHeight="${escapeXml(formatDouble(height))}"`
    ];
    if (model.extraAttrsXml.trim().length > 0) {
        parts.push(model.extraAttrsXml.trim());
    }
    return `<sheetFormatPr ${parts.join(' ')}/>`;
}

/**
 * Mutable sheet-format store for default row height.
 *
 * @private
 */
export class SheetFormatPrImpl {
    private present: boolean = false;
    private defaultRowHeight: number | undefined;
    private extraAttrsXml: string = '';
    private host: SheetFormatPrHost | undefined;

    public bindHost(host: SheetFormatPrHost): void {
        this.host = host;
    }

    public replaceFromParse(model: SheetFormatPrModel | undefined): void {
        if (model === undefined || !model.present) {
            this.present = false;
            this.defaultRowHeight = undefined;
            this.extraAttrsXml = '';
            return;
        }
        this.present = true;
        this.defaultRowHeight = model.defaultRowHeight;
        this.extraAttrsXml = model.extraAttrsXml;
    }

    public toModel(): SheetFormatPrModel {
        if (!this.present) {
            return EMPTY_SHEET_FORMAT_PR;
        }
        return {
            present: true,
            defaultRowHeight: this.defaultRowHeight,
            extraAttrsXml: this.extraAttrsXml
        };
    }

    /**
     * Public getter contract: `0` when the sheet has no authored/loaded
     * default row height (mirrors `getRowHeight` / `getColumnWidth`).
     *
     * @returns {number} - Returns the result.
     */
    public getStandardHeight(): number {
        if (
            this.defaultRowHeight === undefined ||
      !Number.isFinite(this.defaultRowHeight) ||
      this.defaultRowHeight < 0
        ) {
            return 0;
        }
        return this.defaultRowHeight;
    }

    public setStandardHeight(height: number): void {
        assertStandardHeight(height);
        if (
            this.present &&
      this.defaultRowHeight === height
        ) {
            return;
        }
        this.present = true;
        this.defaultRowHeight = height;
        this.markDirty();
    }

    private markDirty(): void {
        if (this.host !== undefined) {
            this.host.markDirty();
        }
    }
}

/**
 * assertStandardHeight.
 *
 * @param {number} height - The height parameter.
 * @returns {void} - Returns the result.
 */
function assertStandardHeight(height: number): void {
    if (typeof height !== 'number' || !Number.isFinite(height) || height < 0) {
        throw new InvalidArgumentError(
            `standardHeight must be a finite number ≥ 0, got ${String(height)}`
        );
    }
}

/**
 * formatDouble.
 *
 * @param {number} n - The n parameter.
 * @returns {string} - Returns the result.
 */
function formatDouble(n: number): string {
    return String(n);
}

/**
 * elementOpenAttrsLocal.
 *
 * @param {string} el - The el parameter.
 * @returns {string} - Returns the result.
 */
function elementOpenAttrsLocal(el: string): string {
    const trimmed: string = el.trim();
    const gt: number = trimmed.indexOf('>');
    if (gt < 0) {
        return '';
    }
    const open: string = trimmed.slice(0, gt);
    const sp: number = open.search(/\s/);
    if (sp < 0) {
        return '';
    }
    // Drop trailing `/` on empty elements.
    return open.slice(sp + 1).replace(/\/\s*$/, '').trim();
}
