/**
 * Parse / serialize SpreadsheetML styles part (`CT_Stylesheet`).
 *
 * Citations:
 * - ECMA-376-1 §12.3.20 Styles Part; §18.8 Styles
 * - `CT_Stylesheet` sequence in transitional `sml.xsd`:
 *   numFmts → fonts → fills → borders → cellStyleXfs → cellXfs →
 *   cellStyles → dxfs → tableStyles → colors → extLst
 *
 * @private
 */

import { InvalidStylesError, PackageLimitError } from '../core/errors';
import { SPREADSHEETML_NS_TRANSITIONAL } from '../core/package/constants';
import { attrsToXmlExcluding, decodeUtf8, encodeUtf8, escapeXml, parseAttrMap } from '../core/xml/minimal-xml';

/** Default security ceiling for style table entry counts. */
export const DEFAULT_MAX_STYLE_ENTRIES: 1000000 = 1_000_000;

/**
 * Ordered known `styleSheet` children (schema sequence).
 * Citations: transitional `sml.xsd` `CT_Stylesheet`.
 */
export const STYLESHEET_CHILD_ORDER: string[] = [
    'numFmts',
    'fonts',
    'fills',
    'borders',
    'cellStyleXfs',
    'cellXfs',
    'cellStyles',
    'dxfs',
    'tableStyles',
    'colors',
    'extLst'
];

/**
 * StylesheetChildName.
 */
export type StylesheetChildName = (typeof STYLESHEET_CHILD_ORDER)[number];

/**
 * Highest built-in `numFmtId` (0–163). Custom formats use ids ≥ 164.
 * Citations: ECMA-376-1 §18.8.31; engineering pack styles-and-formats.md.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const BUILTIN_NUM_FMT_ID_MAX: 163 = 163;

/**
 * First custom `numFmtId` allocated by the library.
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const FIRST_CUSTOM_NUM_FMT_ID: 164 = 164;

/**
 * Implied `formatCode` values (en-US, as Excel / XlsIO report them) for built-in
 * `numFmtId`s that are **not** written as `numFmt` rows in the package.
 *
 * Follows ECMA-376-1 §18.8.30 ids with the Microsoft Excel deltas from
 * [MS-OE376] §2.1.739 / [MS-OI29500] (e.g. id 14 = `m/d/yyyy`, ids 5–8 currency,
 * 41–44 accounting). Locale-specific built-ins (ids 23–36 / 50–81) are
 * intentionally omitted — resolution remains undefined until a package row
 * supplies `formatCode`. Never serialized into `numFmts`.
 *
 * Citations: ECMA-376-1 §18.8.30 `numFmt` (All Languages table);
 * [MS-OE376] §2.1.739 (Excel delta note only).
 */
export const BUILTIN_NUM_FMT_FORMAT_CODES: Readonly<Record<number, string>> = {
    0: 'General',
    1: '0',
    2: '0.00',
    3: '#,##0',
    4: '#,##0.00',
    5: '$#,##0_);($#,##0)',
    6: '$#,##0_);[Red]($#,##0)',
    7: '$#,##0.00_);($#,##0.00)',
    8: '$#,##0.00_);[Red]($#,##0.00)',
    9: '0%',
    10: '0.00%',
    11: '0.00E+00',
    12: '# ?/?',
    13: '# ??/??',
    14: 'm/d/yyyy',
    15: 'd-mmm-yy',
    16: 'd-mmm',
    17: 'mmm-yy',
    18: 'h:mm AM/PM',
    19: 'h:mm:ss AM/PM',
    20: 'h:mm',
    21: 'h:mm:ss',
    22: 'm/d/yyyy h:mm',
    37: '#,##0_);(#,##0)',
    38: '#,##0_);[Red](#,##0)',
    39: '#,##0.00_);(#,##0.00)',
    40: '#,##0.00_);[Red](#,##0.00)',
    41: '_(* #,##0_);_(* (#,##0);_(* "-"_);_(@_)',
    42: '_($* #,##0_);_($* (#,##0);_($* "-"_);_(@_)',
    43: '_(* #,##0.00_);_(* (#,##0.00);_(* "-"??_);_(@_)',
    44: '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)',
    45: 'mm:ss',
    46: '[h]:mm:ss',
    47: 'mm:ss.0',
    48: '##0.0E+0',
    49: '@'
};

/**
 * Implied built-in `formatCode` for `numFmtId`, or `undefined` when the id is
 * not in the table (locale-only ids and ids above 163).
 *
 * Does not consult package `numFmts` rows — callers that prefer disk rows must
 * look those up first (see `WorkbookStyles.getFormatCode`).
 *
 * @param {number} numFmtId - Built-in number format id (0–163).
 * @returns {string | undefined} Implied format code, or undefined when unlisted.
 * @private
 */
export function getBuiltinFormatCode(numFmtId: number): string | undefined {
    if (!Number.isFinite(numFmtId) || !Number.isInteger(numFmtId)) {
        return undefined;
    }
    if (numFmtId < 0 || numFmtId > BUILTIN_NUM_FMT_ID_MAX) {
        return undefined;
    }
    // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
    return BUILTIN_NUM_FMT_FORMAT_CODES[numFmtId];
}

/**
 * Strip OOXML locale prefix tokens from a number format code.
 *
 * Format codes may include locale identifiers like `[$-409]`, `[$-F400]`, `[$-F800]`
 * at the start (ECMA-376-1 §18.8.31). Callers expect the code without those tokens.
 *
 * @param {string} formatCode - Format code, possibly with a leading locale prefix.
 * @returns {string} Format code with leading `[$-…]` tokens removed.
 */
export function stripFormatLocalePrefix(formatCode: string): string {
  if (typeof formatCode !== 'string' || formatCode.length === 0) {
    return formatCode;
  }
  // Match and remove all leading [$-XXXX] tokens (locale prefix).
  // A global /^.../ replace stops after the first hit in JavaScript, so consecutive
  // prefixes such as [$-F400][$-409] must be one match.
  return formatCode.replace(/^(?:\[\$-[0-9A-Fa-f]+\])+/, '');
}

/**
 * Convert a numeric indent level to a pixel CSS string.
 *
 * One Excel indent level is about 20 pixels (Calibri 11pt baseline). Used to
 * populate {@link Alignment.textIndent} from {@link Alignment.indent}.
 *
 * @param {number | undefined} indent - Numeric indent level.
 * @returns {string | undefined} CSS pixel string, or undefined when indent is missing or zero.
 * @private
 */
export function indentToTextIndent(indent: number | undefined): string | undefined {
    if (indent === undefined || indent === 0) {
        return undefined;
    }
    const pixels: number = Math.round(indent * 20);
    return pixels + 'px';
}

/**
 * One `numFmt` row under `numFmts` (`CT_NumFmt`).
`
 * Citations: transitional `sml.xsd` `CT_NumFmt` — required `numFmtId`, `formatCode`.
 */
export interface NumFmtEntry {
    readonly numFmtId: number;
    readonly formatCode: string;
    /** Full original `<numFmt .../>` when loaded (round-trip). */
    readonly xmlPreserve?: string;
}

/** Specifies the alignment of text across the width of a cell. */
export type HorizontalAlignment = 'general' | 'left' | 'center' | 'right' | 'fill' | 'justify' | 'centerContinuous' | 'distributed';

/** Specifies the vertical placement of text within a cell's height. */
export type VerticalAlignment = 'top' | 'center' | 'bottom' | 'justify' | 'distributed';

/**
 * Controls how cell contents are positioned and displayed, including
 * horizontal and vertical placement, text rotation, indentation, and text
 * wrapping.
 */
export interface Alignment {
    /**
     * Specifies how text is aligned horizontally within the cell — left,
     * center, right, or justified. See {@link HorizontalAlignment} for all
     * supported values.
     */
    readonly horizontal?: string;
    /**
     * Specifies how text is aligned vertically within the cell — top, center,
     * or bottom. See {@link VerticalAlignment} for all supported values.
     */
    readonly vertical?: string;
    /**
     * Specifies the angle to rotate the text, in degrees from 0 to 180. Use
     * 255 to stack the text vertically, one character per line.
     */
    readonly textRotation?: number;
    /**
     * Specifies whether text that is too wide for the cell wraps onto multiple
     * lines instead of overflowing.
     */
    readonly wrapText?: boolean;
    /**
     * Specifies how many indent levels to shift the text away from the aligned
     * edge of the cell.
     */
    readonly indent?: number;
    /**
     * Pixel-based text indent as a CSS-compatible string (e.g., `"24px"`).
     * Computed from the numeric `indent` level: 1 level ≈ 20 pixels (Excel
     * Calibri 11pt baseline). Read-only when accessed via {@link CellFormat}.
     * Ignored on input (set numeric `indent` instead); stored as numeric
     * indent level only.
     */
    readonly textIndent?: string;
    /**
     * Specifies the indent shift, in character widths, relative to the cell's
     * existing indent — used in conditional formatting highlights.
     */
    readonly relativeIndent?: number;
    /**
     * Specifies whether the last line of wrapped text is also spread across
     * the full cell width when using distributed alignment.
     */
    readonly justifyLastLine?: boolean;
    /**
     * Specifies whether text automatically shrinks to a smaller font size so
     * it fits within the cell without wrapping.
     */
    readonly shrinkToFit?: boolean;
    /**
     * Specifies the text direction of the cell: `0` uses the document's
     * default, `1` reads left to right, and `2` reads right to left.
     */
    readonly readingOrder?: number;
}

/**
 * Controls whether a cell's contents are locked or hidden when the
 * worksheet is protected.
 */
export interface Protection {
    /**
     * Whether the cell is locked against editing. Takes effect only when
     * the sheet is protected.
     */
    readonly locked?: boolean;
    /**
     * Whether the cell's formula is hidden from the formula bar. Takes
     * effect only when the sheet is protected.
     */
    readonly hidden?: boolean;
}

/**
 * Specifies a number format to use in the highlight formatting of a
 * conditional formatting rule.
 *
 * @private
 */
export interface DifferentialNumFmtInput {
    /**
     * The number-format code the rule applies — for example `'"$"#,##0.00'`
     * or `'0.0%'`.
     */
    readonly formatCode: string;
    /** The numeric id stored with the format. Default `0` when omitted. */
    readonly numFmtId?: number;
}

/**
 * Defines the highlight formatting for a conditional formatting rule,
 * combining font, number format, fill, and border settings.
 *
 * @private
 */
export interface DifferentialFormatInput {
    /** The font styling the format applies, such as bold text or a color. */
    readonly font?: Font;
    /**
     * The number format the rule applies, given as a format code — for
     * example `'0.0%'`.
     */
    readonly numFmt?: DifferentialNumFmtInput;
    /** The background fill the format applies, such as a solid color. */
    readonly fill?: Fill;
    /** The borders the format applies. */
    readonly border?: Border;
}

/**
 * One structured `dxf` row (positional index → `cfRule/@dxfId`).
 * Internal wire model: full `CT_Dxf` children including alignment/protection
 * for round-trip. Public authoring uses {@link DifferentialFormatInput}.
 * Citations: transitional sml.xsd `CT_Dxf` / `CT_Dxfs`; ECMA-376-1 §18.8.14 / §18.8.15.
 *
 * @private
 */
export interface DxfEntry {
    readonly font?: FontEntry;
    readonly numFmt?: NumFmtEntry;
    readonly fill?: FillEntry;
    readonly alignment?: Alignment;
    readonly border?: CellBorder;
    readonly protection?: Protection;
    /** Unknown children under dxf other than modeled ones (e.g. extLst). */
    readonly extraChildrenXml?: ReadonlyArray<string>;
    /** Full original `<dxf>...</dxf>` when present (round-trip). */
    readonly xmlPreserve?: string;
}

/**
 * @private
 */
export interface DifferentialFormatView {
    /** The font styling the format applies, such as bold text or a color. */
    readonly font?: Font;
    /**
     * The number format the rule applies, including its format code — for
     * example `'0.0%'`.
     */
    readonly numFmt?: { readonly numFmtId: number; readonly formatCode: string };
    /** The background fill the format applies, such as a solid color. */
    readonly fill?: Fill;
    /** The borders the format applies. */
    readonly border?: Border;
}

/**
 * Defines the complete formatting for a cell — number format, font, fill,
 * border, alignment, and protection — so you can apply or update its
 * appearance in one step.
 */
export interface CellStyle {
    /**
     * The number format to display values with, given as a format identifier.
     */
    readonly numFmtId?: number;
    /** The font applied to the cell's text. */
    readonly font?: Font;
    /** The background fill behind the cell's contents. */
    readonly fill?: Fill;
    /** The lines drawn around the cell. */
    readonly border?: Border;
    /** How the cell's text is positioned and fitted within the cell. */
    readonly alignment?: Alignment;
    /**
     * Whether the cell is locked or its formula is hidden when the sheet is
     * protected. Takes effect only on protected sheets.
     */
    readonly protection?: Protection;
    /**
     * Parent named-style xf index (`cellStyleXfs`); `0` is Normal.
     * Wire detail until named-style authoring is public — not part of the
     * shipped package surface (`stripInternal`).
     *
     * @private
     */
    readonly xfId?: number;
    /**
     * When `true`, Excel keeps the cell's text exactly as typed — even when it
     * starts with characters that normally form a formula (`=`, `+`, `-`, `@`).
     * Preserved and applied on the wire; not part of the shipped package
     * surface until a dedicated public API exists (`stripInternal`).
     *
     * @private
     */
    readonly quotePrefix?: boolean;
    /** When `true`, Excel shows the PivotTable drop-down button on the cell. */
    readonly pivotButton?: boolean;
}

/**
 * Provides a read-only snapshot of a cell's format, showing which font,
 * fill, border, number format, and alignment settings it references.
 *
 * Font and fill colors returned by `Cell.style` may include
 * {@link Color.rgbColor}. Assigning the object back through `Cell.style`
 * does not write `rgbColor`.
 */
export interface CellFormat {
    /** The number format used, given as its format identifier. */
    readonly numFmtId: number | undefined;
    /** The font used, given as its position in the workbook's shared font list. */
    readonly fontId: number | undefined;
    /** The background fill used, given as its position in the workbook's shared fill list. */
    readonly fillId: number | undefined;
    /** The border used, given as its position in the workbook's shared border list. */
    readonly borderId: number | undefined;
    /**
     * Parent named-style xf index (`cellStyleXfs`); `0` is Normal.
     * Wire detail — not part of the shipped package surface (`stripInternal`).
     *
     * @private
     */
    readonly xfId: number | undefined;
    /**
     * When `true`, the cell's text is kept exactly as typed, even if it looks
     * like a formula. Wire/preserve detail — not part of the shipped package
     * surface (`stripInternal`).
     *
     * @private
     */
    readonly quotePrefix: boolean | undefined;
    /**
     * When `true`, Excel shows the PivotTable drop-down button on cells using
     * this format.
     */
    readonly pivotButton: boolean | undefined;
    /** Whether this format's number format overrides the one from its base style. */
    readonly applyNumberFormat: boolean | undefined;
    /** Whether this format's font overrides the one from its base style. */
    readonly applyFont: boolean | undefined;
    /** Whether this format's fill overrides the one from its base style. */
    readonly applyFill: boolean | undefined;
    /** Whether this format's border overrides the one from its base style. */
    readonly applyBorder: boolean | undefined;
    /** Whether this format's alignment overrides the one from its base style. */
    readonly applyAlignment: boolean | undefined;
    /** Whether this format's lock settings the one from its base style. */
    readonly applyProtection: boolean | undefined;
    /** The text alignment settings this format includes, if any. */
    readonly alignment: Alignment | undefined;
    /** The lock and hide settings this format includes, if any. */
    readonly protection: Protection | undefined;
    /**
     * Unknown `xf` child markup kept for round-trip. Not part of the shipped
     * package surface (`stripInternal`).
     *
     * @private
     */
    readonly extraChildrenXml: ReadonlyArray<string> | undefined;
    /**
     * Original `xf` element markup for round-trip. Not part of the shipped
     * package surface (`stripInternal`).
     *
     * @private
     */
    readonly xmlPreserve: string;
}

/**
 * One `xf` row under stylesheet `cellXfs` (wire / table model).
 * Authors use {@link CellStyle}; read snapshots use {@link CellFormat}.
 * Not part of the public package API (`stripInternal`).
 *
 * @private
 */
export interface CellXfEntry {
    /** The number format used, given as its format identifier. */
    readonly numFmtId: number | undefined;
    /** The font used, given as its position in the workbook's shared font list. */
    readonly fontId: number | undefined;
    /** The background fill used, given as its position in the workbook's shared fill list. */
    readonly fillId: number | undefined;
    /** The border used, given as its position in the workbook's shared border list. */
    readonly borderId: number | undefined;
    /**
     * The built-in style this format builds on; `0` means the default Normal
     * style.
     */
    readonly xfId: number | undefined;
    /** When `true`, the cell's text is kept exactly as typed, even if it looks like a formula. */
    readonly quotePrefix: boolean | undefined;
    /**
     * When `true`, Excel shows the PivotTable drop-down button on cells using
     * this format.
     */
    readonly pivotButton: boolean | undefined;
    /** Whether this format's number format overrides the one from its base style. */
    readonly applyNumberFormat: boolean | undefined;
    /** Whether this format's font overrides the one from its base style. */
    readonly applyFont: boolean | undefined;
    /** Whether this format's fill overrides the one from its base style. */
    readonly applyFill: boolean | undefined;
    /** Whether this format's border overrides the one from its base style. */
    readonly applyBorder: boolean | undefined;
    /** Whether this format's alignment overrides the one from its base style. */
    readonly applyAlignment: boolean | undefined;
    /** Whether this format's lock settings the one from its base style. */
    readonly applyProtection: boolean | undefined;
    /** The text alignment settings this format includes, if any. */
    readonly alignment: Alignment | undefined;
    /** The lock and hide settings this format includes, if any. */
    readonly protection: Protection | undefined;
    /**
     * Any formatting parts the library does not model, kept unchanged so
     * loaded files save back exactly.
     */
    readonly extraChildrenXml: ReadonlyArray<string> | undefined;
    readonly xmlPreserve: string | undefined;
}

/**
 * One collection under `styleSheet`, stored as ordered opaque child elements.
 */
export interface StylesCollectionXml {
    /** Local name (`fonts`, `fills`, …). */
    readonly name: string;
    /** Full element XML including open/close tags, or empty string when absent. */
    readonly xml: string;
    /** Direct child element count (e.g. number of `font` under `fonts`). */
    readonly count: number;
}

/**
 * Parsed `styleSheet` model (preserve-first for M1.2 skeleton).
 */
export interface StylesXmlModel {
    readonly collections: ReadonlyArray<StylesCollectionXml>;
    /** Ordered unknown children under `styleSheet` (not in schema list). */
    readonly unknownChildrenXml: ReadonlyArray<string>;
    /** Extra root attribute text excluding xmlns. */
    readonly rootExtraAttrsXml: string;
}

const SML_NS: 'http://schemas.openxmlformats.org/spreadsheetml/2006/main' = SPREADSHEETML_NS_TRANSITIONAL;

const KNOWN_CHILD_SET: Set<string> = new Set<string>(STYLESHEET_CHILD_ORDER);

/**
 * Parse styles part bytes.
 *
 * @param {Uint8Array} bytes - The bytes parameter.
 * @param {string} partName - The partName parameter.
 * @param {Object} options - The options parameter.
 * @param {*} [options.maxEntries] - Optional maxEntries field.
 * @returns {StylesXmlModel} - Returns the result.
 */
export function parseStylesXml(bytes: Uint8Array, partName: string, options?: { readonly maxEntries?: number }): StylesXmlModel {
    const maxEntries: number = ((__t: number): number => (__t != null ? __t : DEFAULT_MAX_STYLE_ENTRIES))(
        options == null ? undefined : options.maxEntries
    );
    const xml: string = decodeUtf8(bytes);
    const trimmed: string = stripPrologAndComments(xml);
    const root: { inner: string; openAttrs: string } = matchRoot(trimmed, partName);
    const attrs: Map<string, string> = parseAttrMap(root.openAttrs);
    const rootExtraAttrsXml: string = attrsToXmlExcluding(attrs, new Set(['xmlns']));

    const children: string[] = splitTopLevelElements(root.inner);
    const byName: Map<string, StylesCollectionXml> = new Map<string, StylesCollectionXml>();
    const unknownChildrenXml: string[] = [];

    for (const child of children) {
        const local: string = elementLocalName(child);
        if (KNOWN_CHILD_SET.has(local)) {
            const inner: string = elementInner(child);
            const itemCount: number = splitTopLevelElements(inner).length;
            if (itemCount > maxEntries) {
                throw new PackageLimitError(`Styles collection "${local}" in "${partName}" exceeds maximum of ${maxEntries} entries`, {
                    partName
                });
            }
            // Last wins if duplicate names (malformed); still preserve last full XML.
            byName.set(local, { name: local, xml: child.trim(), count: itemCount });
            continue;
        }
        unknownChildrenXml.push(child.trim());
    }

    const collections: StylesCollectionXml[] = [];
    for (const name of STYLESHEET_CHILD_ORDER) {
        const found: StylesCollectionXml = byName.get(name);
        if (found !== undefined) {
            collections.push(found);
        }
    }

    return {
        collections,
        unknownChildrenXml,
        rootExtraAttrsXml
    };
}

/**
 * Serialize styles model to Transitional SpreadsheetML bytes. Emits known children in schema order, then unknown children.
 *
 * @param {*} model - model value.
 * @param {*} [options] - options value.
 * @returns {Uint8Array} Function result.
 */
export function serializeStylesXml(
    model: {
        readonly collections: ReadonlyArray<StylesCollectionXml>;
        readonly unknownChildrenXml?: ReadonlyArray<string>;
        readonly rootExtraAttrsXml?: string;
    },
    options?: { readonly maxEntries?: number }
): Uint8Array {
    const maxEntries: number = ((__t: number): number => (__t != null ? __t : DEFAULT_MAX_STYLE_ENTRIES))(
        options == null ? undefined : options.maxEntries
    );
    const byName: Map<string, StylesCollectionXml> = new Map<string, StylesCollectionXml>();
    for (const c of model.collections) {
        if (c.count > maxEntries) {
            throw new PackageLimitError(`Styles collection "${c.name}" exceeds maximum of ${maxEntries} entries`);
        }
        if (c.xml.trim().length > 0) {
            byName.set(c.name, c);
        }
    }

    const lines: string[] = [];
    lines.push('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
    const extra: string =
        model.rootExtraAttrsXml !== undefined && model.rootExtraAttrsXml.trim().length > 0 ? ` ${model.rootExtraAttrsXml.trim()}` : '';
    lines.push(`<styleSheet xmlns="${SML_NS}"${extra}>`);

    for (const name of STYLESHEET_CHILD_ORDER) {
        const c: StylesCollectionXml = byName.get(name);
        if (c !== undefined && c.xml.trim().length > 0) {
            lines.push(c.xml.trim());
        }
    }

    for (const child of model.unknownChildrenXml != null ? model.unknownChildrenXml : []) {
        if (child.trim().length > 0) {
            lines.push(child.trim());
        }
    }

    lines.push('</styleSheet>');
    return encodeUtf8(lines.join(''));
}

/**
 * Build Excel-compatible baseline collections for a new library-created styles part. fonts(1), fills(none+gray125), borders(1), cellStyleXfs(1), cellXfs(1), cellStyles(Normal). Citations: ECMA-376-1 §18.8; presetCellStyles sample shape.
 *
 * @returns {StylesCollectionXml[]} - Returns the result.
 */
export function buildBaselineStylesCollections(): StylesCollectionXml[] {
    const font: string =
        '<font>' +
        '<sz val="11"/>' +
        '<color theme="1"/>' +
        '<name val="Calibri"/>' +
        '<family val="2"/>' +
        '<scheme val="minor"/>' +
        '</font>';
    // eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
    const fillNone: '<fill><patternFill patternType="none"/></fill>' = '<fill><patternFill patternType="none"/></fill>';
    // eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
    const fillGray: '<fill><patternFill patternType="gray125"/></fill>' = '<fill><patternFill patternType="gray125"/></fill>';
    const border: string = '<border>' + '<left/>' + '<right/>' + '<top/>' + '<bottom/>' + '<diagonal/>' + '</border>';
    // Default xf: numFmtId/fontId/fillId/borderId 0, xfId 0 on cell xf.
    // eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
    const styleXf: '<xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>' = '<xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>';
    // eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
    const cellXf: '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>' =
        '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>';
    // eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
    const cellStyle: '<cellStyle name="Normal" xfId="0" builtinId="0"/>' = '<cellStyle name="Normal" xfId="0" builtinId="0"/>';
    // Per MS Excel behavior: include empty tableStyles with defaults (count=0, no custom table styles yet)
    const tableStyles: any = '<tableStyles count="0" defaultTableStyle="TableStyleMedium2" defaultPivotStyle="PivotStyleLight16"/>';

    return [
        {
            name: 'fonts',
            xml: `<fonts count="1">${font}</fonts>`,
            count: 1
        },
        {
            name: 'fills',
            xml: `<fills count="2">${fillNone}${fillGray}</fills>`,
            count: 2
        },
        {
            name: 'borders',
            xml: `<borders count="1">${border}</borders>`,
            count: 1
        },
        {
            name: 'cellStyleXfs',
            xml: `<cellStyleXfs count="1">${styleXf}</cellStyleXfs>`,
            count: 1
        },
        {
            name: 'cellXfs',
            xml: `<cellXfs count="1">${cellXf}</cellXfs>`,
            count: 1
        },
        {
            name: 'cellStyles',
            xml: `<cellStyles count="1">${cellStyle}</cellStyles>`,
            count: 1
        },
        {
            name: 'tableStyles',
            xml: tableStyles,
            count: 0
        }
    ];
}

/**
 * Parse a single `<numFmt>` element (`CT_NumFmt`). Returns `undefined` when required attributes are missing or invalid.
 *
 * @param {string} numFmtXml - The numFmtXml parameter.
 * @returns {*} - Returns the result.
 */
export function parseNumFmtElement(numFmtXml: string): NumFmtEntry | undefined {
    const trimmed: string = numFmtXml.trim();
    if (trimmed.length === 0) {
        return undefined;
    }
    const openEnd: number = findTagEnd(trimmed, 0);
    const openTag: string = openEnd >= 0 ? trimmed.slice(0, openEnd + 1) : trimmed;
    const attrs: Map<string, string> = parseAttrMap(openTag.replace(/^<\S+/, '').replace(/\/?>$/, ''));
    const numFmtId: number = parseOptionalNonNegInt(attrs.get('numFmtId'));
    const formatCode: string = attrs.get('formatCode');
    if (numFmtId === undefined || formatCode === undefined) {
        return undefined;
    }
    return {
        numFmtId,
        formatCode,
        xmlPreserve: trimmed
    };
}

/**
 * Parse all `numFmt` children from a `numFmts` collection element. Skips malformed children; preserves document order.
 *
 * @param {string} collectionXml - The collectionXml parameter.
 * @returns {NumFmtEntry[]} - Returns the result.
 */
export function parseNumFmtsCollection(collectionXml: string): NumFmtEntry[] {
    const items: string[] = collectionItemXmls(collectionXml);
    const entries: NumFmtEntry[] = [];
    for (const item of items) {
        const entry: NumFmtEntry = parseNumFmtElement(item);
        if (entry !== undefined) {
            entries.push(entry);
        }
    }
    return entries;
}

/**
 * Serialize custom/loaded `numFmt` rows to a `numFmts` collection element. Omits the collection entirely when `entries` is empty (caller should drop it). Does not invent built-in 0–163 rows — emits exactly the provided entries. Citations: `CT_NumFmts` / `CT_NumFmt` in transitional `sml.xsd`; §18.8.31.
 *
 * @param {Object} entries - The entries parameter.
 * @returns {*} - Returns the result.
 */
export function serializeNumFmtsCollection(entries: ReadonlyArray<NumFmtEntry>): StylesCollectionXml | undefined {
    if (entries.length === 0) {
        return undefined;
    }
    const body: string = entries
        .map((e: NumFmtEntry): string => {
            if (e.xmlPreserve !== undefined && e.xmlPreserve.trim().length > 0) {
                return e.xmlPreserve.trim();
            }
            return `<numFmt numFmtId="${e.numFmtId}" formatCode="${escapeXml(e.formatCode)}"/>`;
        })
        .join('');
    return {
        name: 'numFmts',
        xml: `<numFmts count="${entries.length}">${body}</numFmts>`,
        count: entries.length
    };
}

/**
 * Next custom `numFmtId`: `max(existing ids, 163) + 1` (always ≥ 164). Never renumbers existing ids.
 *
 * @param {number} existingIds - The existingIds parameter.
 * @returns {number} - Returns the result.
 */
export function allocateNextCustomNumFmtId(existingIds: ReadonlyArray<number>): number {
    let maxId: number = BUILTIN_NUM_FMT_ID_MAX;
    for (const id of existingIds) {
        if (Number.isFinite(id) && id > maxId) {
            maxId = id;
        }
    }
    return maxId + 1;
}

/**
 * Parse a single `<xf>` element into a view (best-effort attributes).
 */
/**
 * Describes a color used in cell formatting, either as a raw RGB value, a
 * theme color with tint, an indexed palette entry, or automatic.
 *
 * Stored attributes (`auto`, `indexed`, `rgb`, `theme`, `tint`) are written
 * back unchanged. {@link Color.rgbColor} is a read-only resolved view and is
 * never serialized.
 */
export interface Color {
    /**
     * When `true`, the color is automatic — the viewer chooses it (usually
     * black text or no fill).
     */
    readonly auto?: boolean;
    /**
     * A color from the workbook's legacy indexed palette, by index.
     * Indexes 64 and 65 stay unresolved.
     */
    readonly indexed?: number;
    /** The exact color, as `RRGGBB` or `AARRGGBB` hex digits. */
    readonly rgb?: string;
    /**
     * SpreadsheetML theme color index (ECMA-376 §18.8.3). Excel writes
     * `0` = `lt1`, `1` = `dk1` (Normal font / black), `2` = `lt2`,
     * `3` = `dk2`, then `accent1`–`folHlink` at 4–11. The stored integer
     * is not rewritten. `rgbColor` applies that mapping.
     */
    readonly theme?: number;
    /**
     * How much to lighten or darken a theme or indexed color: 0 leaves it
     * unchanged, positive values lighten, negative values darken.
     * SpreadsheetML HLS tint (ECMA-376 §18.3.1.15), not DrawingML tint.
     */
    readonly tint?: number;
    /**
     * Resolved `#RRGGBB` view of this color, with no alpha. Present only on
     * colors the library returns (for example from `Cell.style`). Not written,
     * and not used when matching styles. Undefined for automatic colors and
     * for theme or palette colors the library could not resolve. A
     * caller-built `{ theme, tint }` does not carry it — read the cell style
     * again after the color has been stored.
     */
    readonly rgbColor?: string;
}

/** Specifies the underline style applied to cell text. */
export type UnderlineValue = 'single' | 'double' | 'singleAccounting' | 'doubleAccounting' | 'none';

/** Specifies which of a theme's font pairs (major or minor) a font belongs to. */
export type FontSchemeValue = 'none' | 'major' | 'minor';

/**
 * Describes the font applied to cell text, including its name, size, style,
 * color, and effects such as underline and strikethrough.
 *
 * @private
 */
export interface Font {
    /** The font face name — for example `'Calibri'` or `'Arial'`. */
    readonly name?: string;
    /** The font size in points — for example `11`. */
    readonly size?: number;
    /** Whether the text is bold. */
    readonly bold?: boolean;
    /** Whether the text is italic. */
    readonly italic?: boolean;
    /**
     * The underline style. Pass `true` for a plain single underline, `false`
     * for none, or one of the style strings such as `'single'` or
     * `'double'`.
     */
    readonly underline?: UnderlineValue | boolean;
    /** Whether the text is struck through. */
    readonly strike?: boolean;
    /** The color of the text. */
    readonly color?: Color;
    /**
     * The font family id — a numeric classification of the font, such as
     * `1` for Roman serif or `2` for Swiss sans-serif.
     */
    readonly family?: number;
    /**
     * The character-set id of the font — used for selecting an appropriate
     * character variant, such as `0` for ANSI or `2` for Symbol.
     */
    readonly charset?: number;
    /**
     * Whether the font belongs to the workbook's theme fonts: `'major'`
     * (headings), `'minor'` (body), or `'none'` (a regular font).
     */
    readonly scheme?: FontSchemeValue;
    /**
     * The vertical position of the text: `'baseline'`, `'superscript'`, or
     * `'subscript'`.
     */
    readonly vertAlign?: string;
    /** Whether the text is rendered as an outline (hollow glyphs). */
    readonly outline?: boolean;
    /** Whether the text is drawn with a shadow. */
    readonly shadow?: boolean;
    /** Whether the text is condensed (squeezed together) on Macintosh. */
    readonly condense?: boolean;
    /** Whether the text is stretched on Macintosh. */
    readonly extend?: boolean;
}

/**
 * One `font` row under stylesheet `fonts` (wire / table model).
 * Authors use {@link Font}; cells and CF surfaces map rows back to `Font`.
 * Not part of the public package API (`stripInternal`).
 *
 * @private
 */
export interface FontEntry {
    /** The font face name — for example `'Calibri'` or `'Arial'`. */
    readonly name?: string;
    /** The font size in points — for example `11`. */
    readonly size?: number;
    /** Whether the text is bold. */
    readonly bold?: boolean;
    /** Whether the text is italic. */
    readonly italic?: boolean;
    /** The underline style, such as `'single'` or `'double'`. */
    readonly underline?: UnderlineValue;
    /** Whether the text is struck through. */
    readonly strike?: boolean;
    /** The color of the text. */
    readonly color?: Color;
    /**
     * The font family id — a numeric classification of the font, such as
     * `1` for Roman serif or `2` for Swiss sans-serif.
     */
    readonly family?: number;
    /**
     * The character-set id of the font — used for selecting an appropriate
     * character variant, such as `0` for ANSI or `2` for Symbol.
     */
    readonly charset?: number;
    /**
     * Whether the font belongs to the workbook's theme fonts: `'major'`
     * (headings), `'minor'` (body), or `'none'` (a regular font).
     */
    readonly scheme?: FontSchemeValue;
    /**
     * The vertical position of the text: `'baseline'`, `'superscript'`, or
     * `'subscript'`.
     */
    readonly vertAlign?: string;
    /** Whether the text is rendered as an outline (hollow glyphs). */
    readonly outline?: boolean;
    /** Whether the text is drawn with a shadow. */
    readonly shadow?: boolean;
    /** Whether the text is condensed (squeezed together) on Macintosh. */
    readonly condense?: boolean;
    /** Whether the text is stretched on Macintosh. */
    readonly extend?: boolean;
    /** Full original `<font>...</font>` when loaded (round-trip). */
    readonly xmlPreserve?: string;
}

/**
 * Specifies the pattern drawn in a cell's background fill, such as solid or
 * gray stripes.
 *
 * Values beyond the common kinds are accepted as plain strings.
 */
export type PatternType =
    | 'none'
    | 'solid'
    | 'mediumGray'
    | 'darkGray'
    | 'lightGray'
    | 'darkHorizontal'
    | 'darkVertical'
    | 'darkDown'
    | 'darkUp'
    | 'darkGrid'
    | 'darkTrellis'
    | 'lightHorizontal'
    | 'lightVertical'
    | 'lightDown'
    | 'lightUp'
    | 'lightGrid'
    | 'lightTrellis'
    | 'gray125'
    | 'gray0625'
    | (string & {});

/**
 * Describes a cell's background fill, either as a colored pattern or a
 * gradient.
 */
export type Fill =
    | {
        readonly type: 'pattern';
        readonly patternType: PatternType;
        readonly fgColor?: Color;
        readonly bgColor?: Color;
    }
    | {
        readonly type: 'gradient';
        /** Full `<gradientFill ...>...</gradientFill>` element (or full `<fill>`). */
        readonly gradientXml: string;
    };

/*
 * @private Wire model for styles `fills` rows. Not part of the published
 * package surface; public authoring uses {@link Fill}.
 **
 * Represents one saved background fill definition in a workbook's style
 * collection, holding a pattern or gradient with its colors.
 */
/**
 * FillEntry.
 */
export interface FillEntry {
    /**
     * The kind of fill: a repeating pattern (`'pattern'`), a smooth color
     * blend (`'gradient'`), or an unrecognized format kept as-is
     * (`'unknown'`).
     */
    readonly type: 'pattern' | 'gradient' | 'unknown';
    /**
     * The pattern style — for example `'solid'` for a plain color or
     * `'gray125'` for a fine dot grid.
     */
    readonly patternType?: string;
    /** The pattern's foreground color — the color of the pattern itself. */
    readonly fgColor?: Color;
    /** The pattern's background color — the color behind the pattern. */
    readonly bgColor?: Color;
    /**
     * The full gradient definition as raw markup, when the fill is a
     * gradient.
     */
    readonly gradientXml?: string;
    /**
     * The full original `<fill>...</fill>` markup as loaded from the file;
     * always set for loaded and authored rows.
     */
    readonly xmlPreserve: string;
}

/** Specifies the styles available for a cell's border line. */
export enum BorderStyle {
    /** No border line. */
    None = 'none',
    /** A thin solid line. */
    Thin = 'thin',
    /** A medium-weight solid line. */
    Medium = 'medium',
    /** A thin line broken into dashes. */
    Dashed = 'dashed',
    /** A thin line made of dots. */
    Dotted = 'dotted',
    /** A thick solid line. */
    Thick = 'thick',
    /** Two parallel thin lines. */
    Double = 'double',
    /** The thinnest printable line. */
    Hair = 'hair',
    /** A medium-weight line broken into dashes. */
    MediumDashed = 'mediumDashed',
    /** An alternating thin dash-dot pattern. */
    DashDot = 'dashDot',
    /** A medium-weight dash-dot pattern. */
    MediumDashDot = 'mediumDashDot',
    /** An alternating thin dash-dot-dot pattern. */
    DashDotDot = 'dashDotDot',
    /** A medium-weight dash-dot-dot pattern. */
    MediumDashDotDot = 'mediumDashDotDot',
    /** A dash-dot pattern with slanted dashes. */
    SlantDashDot = 'slantDashDot'
}

/**
 * Represents one of the valid {@link BorderStyle} settings as a plain
 * string, such as `'thin'`.
 *
 * Prefer {@link BorderStyle} members when authoring.
 *
 * Typed as the enum member values (string-enum union) for TypeScript 3.3
 * compatibility — equivalent to a template-literal of {@link BorderStyle}.
 */
export type BorderStyleName = (typeof BorderStyle)[keyof typeof BorderStyle];

/**
 * Defines the appearance of a single border line, including its style and
 * color.
 */
export interface BorderEdge {
    /**
     * Specifies how the line is drawn — its weight and dash pattern. Use a
     * {@link BorderStyle} value such as `BorderStyle.Thin`.
     */
    readonly style?: BorderStyle | BorderStyleName | string;
    /** Specifies the color of the border line. */
    readonly color?: Color;
}

/**
 * Describes the lines drawn around a cell, covering each edge plus
 * diagonals so you can outline or accent cells.
 */
export interface Border {
    /** The line drawn on the cell's left edge. */
    readonly left?: BorderEdge;
    /** The line drawn on the cell's right edge. */
    readonly right?: BorderEdge;
    /** The line drawn on the cell's top edge. */
    readonly top?: BorderEdge;
    /** The line drawn on the cell's bottom edge. */
    readonly bottom?: BorderEdge;
    /**
     * The line drawn diagonally across the cell, used together with
     * `diagonalUp` and `diagonalDown`.
     */
    readonly diagonal?: BorderEdge;
    /**
     * When `true`, draws the diagonal line from the bottom-left corner to the
     * top-right corner of the cell.
     */
    readonly diagonalUp?: boolean;
    /**
     * When `true`, draws the diagonal line from the top-left corner to the
     * bottom-right corner of the cell.
     */
    readonly diagonalDown?: boolean;
    /**
     * When `true`, Excel applies the left, right, top, and bottom borders only
     * to the outside edges of the selected cell range rather than to every
     * cell.
     */
    readonly outline?: boolean;
}

/**
 * Internal stored border row in the workbook style table (includes round-trip
 * bags). Public authoring/reading uses {@link Border}. Renamed from
 * `BorderEntry`.
 *
 * @private
 */
export interface CellBorder {
    /** The line drawn on the cell's left edge. */
    readonly left?: BorderEdge;
    /** The line drawn on the cell's right edge. */
    readonly right?: BorderEdge;
    /** The line drawn on the cell's top edge. */
    readonly top?: BorderEdge;
    /** The line drawn on the cell's bottom edge. */
    readonly bottom?: BorderEdge;
    /**
     * The line drawn diagonally across the cell, used together with
     * `diagonalUp` and `diagonalDown`.
     */
    readonly diagonal?: BorderEdge;
    /**
     * When `true`, draws the diagonal line from the bottom-left corner to the
     * top-right corner of the cell.
     */
    readonly diagonalUp?: boolean;
    /**
     * When `true`, draws the diagonal line from the top-left corner to the
     * bottom-right corner of the cell.
     */
    readonly diagonalDown?: boolean;
    /**
     * When `true`, Excel applies the left, right, top, and bottom borders only
     * to the outside edges of the selected cell range rather than to every
     * cell.
     */
    readonly outline?: boolean;
    /**
     * Holds any border elements the library does not model (such as additional
     * edge kinds), kept unchanged so loaded files save back exactly.
     *
     * @private
     */
    readonly extraChildrenXml?: ReadonlyArray<string>;
    /**
     * The complete original border markup from the loaded file, used to save it
     * back unchanged.
     *
     * @private
     */
    readonly xmlPreserve: string;
}

/**
 * Reserved fill indexes for Excel-compatible parts. Internal: baseline fills 0
 * (`none`) and 1 (`gray125`) are implicit library constants, not public API.
 *
 * @private
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const FILL_INDEX_NONE: 0 = 0;
/**
 * @private
 */
// eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
export const FILL_INDEX_GRAY125: 1 = 1;

/**
 * Copy stored color attributes, dropping the computed {@link Color.rgbColor}
 * view so match keys and writers never see it.
 *
 * @private
 * @param {Color} color - The color whose stored attributes are kept.
 * @returns {Color} Stored attributes only.
 */
export function storedColor(color: Color): Color {
    return {
        ...(color.auto !== undefined ? { auto: color.auto } : {}),
        ...(color.indexed !== undefined ? { indexed: color.indexed } : {}),
        ...(color.rgb !== undefined ? { rgb: color.rgb } : {}),
        ...(color.theme !== undefined ? { theme: color.theme } : {}),
        ...(color.tint !== undefined ? { tint: color.tint } : {})
    };
}

/**
 * Parse `CT_Color` attributes from an open-tag attribute map.
 *
 * @param {string} attrs - The attrs parameter.
 * @returns {*} - Returns the result.
 */
export function parseColorAttrs(attrs: ReadonlyMap<string, string>): Color | undefined {
    const auto: boolean = parseOptionalBool(attrs.get('auto'));
    const indexed: number = parseOptionalNonNegInt(attrs.get('indexed'));
    const rgb: string = attrs.get('rgb');
    const theme: number = parseOptionalNonNegInt(attrs.get('theme'));
    const tintRaw: string = attrs.get('tint');
    let tint: number | undefined;
    if (tintRaw !== undefined && tintRaw !== '') {
        const t: number = Number.parseFloat(tintRaw);
        if (Number.isFinite(t)) {
            tint = t;
        }
    }
    if (auto === undefined && indexed === undefined && (rgb === undefined || rgb === '') && theme === undefined && tint === undefined) {
        return undefined;
    }
    return {
        ...(auto !== undefined ? { auto } : {}),
        ...(indexed !== undefined ? { indexed } : {}),
        ...(rgb !== undefined && rgb !== '' ? { rgb } : {}),
        ...(theme !== undefined ? { theme } : {}),
        ...(tint !== undefined ? { tint } : {})
    };
}

/**
 * Serialize `CT_Color` as `<localName .../>`.
 *
 * @param {string} localName - The localName parameter.
 * @param {*} color - The color parameter.
 * @returns {string} - Returns the result.
 */
export function serializeColorElement(localName: string, color: Color | undefined): string {
    if (color === undefined) {
        return '';
    }
    const parts: string[] = [];
    if (color.auto !== undefined) {
        parts.push(`auto="${color.auto ? '1' : '0'}"`);
    }
    if (color.indexed !== undefined) {
        parts.push(`indexed="${color.indexed}"`);
    }
    if (color.rgb !== undefined) {
        parts.push(`rgb="${escapeXml(color.rgb)}"`);
    }
    if (color.theme !== undefined) {
        parts.push(`theme="${color.theme}"`);
    }
    if (color.tint !== undefined) {
        parts.push(`tint="${color.tint}"`);
    }
    if (parts.length === 0) {
        return `<${localName}/>`;
    }
    return `<${localName} ${parts.join(' ')}/>`;
}

/**
 * parseBooleanProperty function.
 *
 * @param {string} el - The el parameter.
 * @returns {boolean} - Returns the result.
 */
function parseBooleanProperty(el: string): boolean {
    const openEnd: number = findTagEnd(el.trim(), 0);
    const openTag: string = openEnd >= 0 ? el.trim().slice(0, openEnd + 1) : el;
    const attrs: Map<string, string> = parseAttrMap(openTag.replace(/^<\S+/, '').replace(/\/?>$/, ''));
    const v: boolean = parseOptionalBool(attrs.get('val'));
    // CT_BooleanProperty default true when element present without val.
    return v === undefined ? true : v;
}

/**
 * parseValString function.
 *
 * @param {string} el - The el parameter.
 * @returns {string} - Returns the result.
 */
function parseValString(el: string): string | undefined {
    const openEnd: number = findTagEnd(el.trim(), 0);
    const openTag: string = openEnd >= 0 ? el.trim().slice(0, openEnd + 1) : el;
    const attrs: Map<string, string> = parseAttrMap(openTag.replace(/^<\S+/, '').replace(/\/?>$/, ''));
    return attrs.get('val');
}

/**
 * parseValNumber function.
 *
 * @param {string} el - The el parameter.
 * @returns {number} - Returns the result.
 */
function parseValNumber(el: string): number | undefined {
    const raw: string = parseValString(el);
    if (raw === undefined || raw === '') {
        return undefined;
    }
    const n: number = Number.parseFloat(raw);
    return Number.isFinite(n) ? n : undefined;
}

/**
 * parseValInt function.
 *
 * @param {string} el - The el parameter.
 * @returns {number} - Returns the result.
 */
function parseValInt(el: string): number | undefined {
    const raw: string = parseValString(el);
    if (raw === undefined || raw === '') {
        return undefined;
    }
    const n: number = Number.parseInt(raw, 10);
    return Number.isFinite(n) ? n : undefined;
}

/**
 * parseColorChild function.
 *
 * @param {string} el - The el parameter.
 * @returns {*} - Returns the result.
 */
function parseColorChild(el: string): Color | undefined {
    const openEnd: number = findTagEnd(el.trim(), 0);
    const openTag: string = openEnd >= 0 ? el.trim().slice(0, openEnd + 1) : el;
    const attrs: Map<string, string> = parseAttrMap(openTag.replace(/^<\S+/, '').replace(/\/?>$/, ''));
    return parseColorAttrs(attrs);
}

/**
 * colorMatchKey function.
 *
 * @param {*} c - The c parameter.
 * @returns {string} - Returns the result.
 */
function colorMatchKey(c: Color | undefined): string {
    if (c === undefined) {
        return '';
    }
    return [
        c.auto === true ? '1' : c.auto === false ? '0' : '',
        c.indexed != null ? c.indexed : '',
        c.rgb != null ? c.rgb : '',
        c.theme != null ? c.theme : '',
        c.tint != null ? c.tint : ''
    ].join(',');
}

/**
 * Parse a single `<font>` element (`CT_Font`).
 *
 * @param {string} fontXml - The fontXml parameter.
 * @returns {FontEntry} - Returns the result.
 */
export function parseFontElement(fontXml: string): FontEntry {
    const trimmed: string = fontXml.trim();
    let name: string | undefined;
    let size: number | undefined;
    let bold: boolean | undefined;
    let italic: boolean | undefined;
    let underline: UnderlineValue | undefined;
    let strike: boolean | undefined;
    let color: Color | undefined;
    let family: number | undefined;
    let charset: number | undefined;
    let scheme: FontSchemeValue | undefined;
    let vertAlign: string | undefined;
    let outline: boolean | undefined;
    let shadow: boolean | undefined;
    let condense: boolean | undefined;
    let extend: boolean | undefined;

    for (const child of splitTopLevelElements(elementInner(trimmed))) {
        const local: string = elementLocalName(child);
        switch (local) {
        case 'name':
            name = parseValString(child);
            break;
        case 'sz':
            size = parseValNumber(child);
            break;
        case 'b':
            bold = parseBooleanProperty(child);
            break;
        case 'i':
            italic = parseBooleanProperty(child);
            break;
        case 'strike':
            strike = parseBooleanProperty(child);
            break;
        case 'outline':
            outline = parseBooleanProperty(child);
            break;
        case 'shadow':
            shadow = parseBooleanProperty(child);
            break;
        case 'condense':
            condense = parseBooleanProperty(child);
            break;
        case 'extend':
            extend = parseBooleanProperty(child);
            break;
        case 'color':
            color = parseColorChild(child);
            break;
        case 'u': {
            const u: string = parseValString(child);
            underline = (u as UnderlineValue | undefined) != null ? (u as UnderlineValue | undefined) : 'single';
            break;
        }
        case 'family':
            family = parseValInt(child);
            break;
        case 'charset':
            charset = parseValInt(child);
            break;
        case 'scheme': {
            const sch: string = parseValString(child);
            if (sch === 'none' || sch === 'major' || sch === 'minor') {
                scheme = sch;
            }
            break;
        }
        case 'vertAlign':
            vertAlign = parseValString(child);
            break;
        default:
            break;
        }
    }

    return {
        ...(name !== undefined ? { name } : {}),
        ...(size !== undefined ? { size } : {}),
        ...(bold !== undefined ? { bold } : {}),
        ...(italic !== undefined ? { italic } : {}),
        ...(underline !== undefined ? { underline } : {}),
        ...(strike !== undefined ? { strike } : {}),
        ...(color !== undefined ? { color } : {}),
        ...(family !== undefined ? { family } : {}),
        ...(charset !== undefined ? { charset } : {}),
        ...(scheme !== undefined ? { scheme } : {}),
        ...(vertAlign !== undefined ? { vertAlign } : {}),
        ...(outline !== undefined ? { outline } : {}),
        ...(shadow !== undefined ? { shadow } : {}),
        ...(condense !== undefined ? { condense } : {}),
        ...(extend !== undefined ? { extend } : {}),
        xmlPreserve: trimmed
    };
}

/**
 * Parse all `font` children from a `fonts` collection.
 *
 * @param {string} collectionXml - The collectionXml parameter.
 * @returns {FontEntry[]} - Returns the result.
 */
export function parseFontsCollection(collectionXml: string): FontEntry[] {
    return collectionItemXmls(collectionXml).map((item: string): FontEntry => parseFontElement(item));
}

/**
 * serializeBooleanProp function.
 *
 * @param {string} name - The name parameter.
 * @param {boolean} value - The value parameter.
 * @returns {string} - Returns the result.
 */
function serializeBooleanProp(name: string, value: boolean | undefined): string {
    if (value === undefined) {
        return '';
    }
    if (value) {
        return `<${name}/>`;
    }
    return `<${name} val="0"/>`;
}

/**
 * Serialize a font entry to a `<font>` element. Prefer `xmlPreserve` when set (loaded rows / previously serialized).
 *
 * @param {Object} entry - The entry parameter.
 * @returns {string} - Returns the result.
 */
export function serializeFontElement(entry: Font | FontEntry): string {
    if ('xmlPreserve' in entry && entry.xmlPreserve !== undefined && entry.xmlPreserve.trim().length > 0) {
        return entry.xmlPreserve.trim();
    }
    const parts: string[] = [];
    if (entry.name !== undefined) {
        parts.push(`<name val="${escapeXml(entry.name)}"/>`);
    }
    if (entry.charset !== undefined) {
        parts.push(`<charset val="${entry.charset}"/>`);
    }
    if (entry.family !== undefined) {
        parts.push(`<family val="${entry.family}"/>`);
    }
    parts.push(serializeBooleanProp('b', entry.bold));
    parts.push(serializeBooleanProp('i', entry.italic));
    parts.push(serializeBooleanProp('strike', entry.strike));
    parts.push(serializeBooleanProp('outline', entry.outline));
    parts.push(serializeBooleanProp('shadow', entry.shadow));
    parts.push(serializeBooleanProp('condense', entry.condense));
    parts.push(serializeBooleanProp('extend', entry.extend));
    parts.push(serializeColorElement('color', entry.color));
    if (entry.size !== undefined) {
        parts.push(`<sz val="${entry.size}"/>`);
    }
    if (entry.underline !== undefined) {
        if (entry.underline === true || entry.underline === 'single') {
            parts.push('<u/>');
        } else if (entry.underline === false) {
            parts.push('<u val="none"/>');
        } else {
            parts.push(`<u val="${entry.underline}"/>`);
        }
    }
    if (entry.vertAlign !== undefined) {
        parts.push(`<vertAlign val="${escapeXml(entry.vertAlign)}"/>`);
    }
    if (entry.scheme !== undefined) {
        parts.push(`<scheme val="${entry.scheme}"/>`);
    }
    return `<font>${parts.filter((p: string): boolean => p.length > 0).join('')}</font>`;
}

/**
 * Canonical match key for exact-match font reuse (order-independent fields).
 *
 * @param {Object} entry - The entry parameter.
 * @returns {string} - Returns the result.
 */
export function fontMatchKey(entry: Font | FontEntry): string {
    const u: UnderlineValue = entry.underline === true ? 'single' : entry.underline === false ? 'none' : entry.underline;
    return [
        entry.name != null ? entry.name : '',
        entry.size != null ? entry.size : '',
        entry.bold === true ? '1' : entry.bold === false ? '0' : '',
        entry.italic === true ? '1' : entry.italic === false ? '0' : '',
        u != null ? u : '',
        entry.strike === true ? '1' : entry.strike === false ? '0' : '',
        colorMatchKey(entry.color),
        entry.family != null ? entry.family : '',
        entry.charset != null ? entry.charset : '',
        entry.scheme != null ? entry.scheme : '',
        entry.vertAlign != null ? entry.vertAlign : '',
        entry.outline === true ? '1' : entry.outline === false ? '0' : '',
        entry.shadow === true ? '1' : entry.shadow === false ? '0' : '',
        entry.condense === true ? '1' : entry.condense === false ? '0' : '',
        entry.extend === true ? '1' : entry.extend === false ? '0' : ''
    ].join('|');
}

/**
 * Build FontEntry from input (library-authored).
 *
 * @param {Font} input - The input parameter.
 * @returns {FontEntry} - Returns the result.
 */
export function fontEntryFromInput(input: Font): FontEntry {
    const underline: UnderlineValue | undefined =
        input.underline === true ? 'single' : input.underline === false ? 'none' : input.underline;
    const entry: FontEntry = {
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.size !== undefined ? { size: input.size } : {}),
        ...(input.bold !== undefined ? { bold: input.bold } : {}),
        ...(input.italic !== undefined ? { italic: input.italic } : {}),
        ...(underline !== undefined ? { underline } : {}),
        ...(input.strike !== undefined ? { strike: input.strike } : {}),
        ...(input.color !== undefined ? { color: storedColor(input.color) } : {}),
        ...(input.family !== undefined ? { family: input.family } : {}),
        ...(input.charset !== undefined ? { charset: input.charset } : {}),
        ...(input.scheme !== undefined ? { scheme: input.scheme } : {}),
        ...(input.vertAlign !== undefined ? { vertAlign: input.vertAlign } : {}),
        ...(input.outline !== undefined ? { outline: input.outline } : {}),
        ...(input.shadow !== undefined ? { shadow: input.shadow } : {}),
        ...(input.condense !== undefined ? { condense: input.condense } : {}),
        ...(input.extend !== undefined ? { extend: input.extend } : {})
    };
    return {
        ...entry,
        xmlPreserve: serializeFontElement(entry)
    };
}

/**
 * Serialize fonts collection. Always emits when entries non-empty.
 *
 * @param {Object} entries - The entries parameter.
 * @returns {*} - Returns the result.
 */
export function serializeFontsCollection(entries: ReadonlyArray<FontEntry>): StylesCollectionXml | undefined {
    if (entries.length === 0) {
        return undefined;
    }
    const body: string = entries.map((e: FontEntry): string => serializeFontElement(e)).join('');
    return {
        name: 'fonts',
        xml: `<fonts count="${entries.length}">${body}</fonts>`,
        count: entries.length
    };
}

/**
 * Parse a single `<fill>` element (`CT_Fill`).
 *
 * @param {string} fillXml - The fillXml parameter.
 * @returns {FillEntry} - Returns the result.
 */
export function parseFillElement(fillXml: string): FillEntry {
    const trimmed: string = fillXml.trim();
    const children: string[] = splitTopLevelElements(elementInner(trimmed));
    for (const child of children) {
        const local: string = elementLocalName(child);
        if (local === 'patternFill') {
            const openEnd: number = findTagEnd(child.trim(), 0);
            const openTag: string = openEnd >= 0 ? child.trim().slice(0, openEnd + 1) : child;
            const attrs: Map<string, string> = parseAttrMap(openTag.replace(/^<\S+/, '').replace(/\/?>$/, ''));
            const patternType: string = attrs.get('patternType');
            let fgColor: Color | undefined;
            let bgColor: Color | undefined;
            for (const nested of splitTopLevelElements(elementInner(child))) {
                const n: string = elementLocalName(nested);
                if (n === 'fgColor') {
                    fgColor = parseColorChild(nested);
                } else if (n === 'bgColor') {
                    bgColor = parseColorChild(nested);
                }
            }
            return {
                type: 'pattern',
                ...(patternType !== undefined ? { patternType } : {}),
                ...(fgColor !== undefined ? { fgColor } : {}),
                ...(bgColor !== undefined ? { bgColor } : {}),
                xmlPreserve: trimmed
            };
        }
        if (local === 'gradientFill') {
            return {
                type: 'gradient',
                gradientXml: child.trim(),
                xmlPreserve: trimmed
            };
        }
    }
    return { type: 'unknown', xmlPreserve: trimmed };
}

/**
 * Parse all `fill` children from a `fills` collection.
 *
 * @param {string} collectionXml - The collectionXml parameter.
 * @returns {FillEntry[]} - Returns the result.
 */
export function parseFillsCollection(collectionXml: string): FillEntry[] {
    return collectionItemXmls(collectionXml).map((item: string): FillEntry => parseFillElement(item));
}

/**
 * Serialize a fill from input or entry.
 *
 * @param {Object} entry - The entry parameter.
 * @returns {string} - Returns the result.
 */
export function serializeFillElement(entry: Fill | FillEntry): string {
    if ('xmlPreserve' in entry && entry.xmlPreserve.trim().length > 0) {
        return entry.xmlPreserve.trim();
    }
    if (entry.type === 'gradient') {
        const g: string = ((__t: string): string => (__t != null ? __t : ''))(
            entry.gradientXml == null ? undefined : entry.gradientXml.trim()
        );
        if (g.length === 0) {
            return '<fill></fill>';
        }
        if (g.startsWith('<fill')) {
            return g;
        }
        return `<fill>${g}</fill>`;
    }
    if (entry.type === 'pattern') {
        const fg: string = serializeColorElement('fgColor', entry.fgColor);
        const bg: string = serializeColorElement('bgColor', entry.bgColor);
        return `<fill><patternFill patternType="${escapeXml(String(entry.patternType))}">${fg}${bg}</patternFill></fill>`;
    }
    return '<fill></fill>';
}

/**
 * Build a FillEntry from Fill (library-authored).
 *
 * @param {Fill} input - The input parameter.
 * @returns {FillEntry} - Returns the result.
 */
export function fillEntryFromInput(input: Fill): FillEntry {
    if (input.type === 'gradient') {
        const g: string = input.gradientXml.trim();
        const withoutPreserve: Fill = { type: 'gradient', gradientXml: g };
        const xml: string = serializeFillElement(withoutPreserve);
        return {
            type: 'gradient',
            ...(g.startsWith('<fill') ? {} : { gradientXml: g }),
            xmlPreserve: xml
        };
    }
    const withoutPreserve: Fill = {
        type: 'pattern',
        patternType: input.patternType,
        ...(input.fgColor !== undefined ? { fgColor: storedColor(input.fgColor) } : {}),
        ...(input.bgColor !== undefined ? { bgColor: storedColor(input.bgColor) } : {})
    };
    const xml: string = serializeFillElement(withoutPreserve);
    return {
        type: 'pattern',
        patternType: String(input.patternType),
        ...(input.fgColor !== undefined ? { fgColor: storedColor(input.fgColor) } : {}),
        ...(input.bgColor !== undefined ? { bgColor: storedColor(input.bgColor) } : {}),
        xmlPreserve: xml
    };
}

/**
 * Canonical match key for fills.
 *
 * @param {Object} entry - The entry parameter.
 * @returns {string} - Returns the result.
 */
export function fillMatchKey(entry: Fill | FillEntry): string {
    if (entry.type === 'gradient') {
        const g: string =
            entry.gradientXml !== undefined ? entry.gradientXml.trim() : 'xmlPreserve' in entry ? entry.xmlPreserve.trim() : '';
        return `gradient|${g}`;
    }
    if (entry.type === 'pattern') {
        return [
            'pattern',
            String(entry.patternType != null ? entry.patternType : ''),
            colorMatchKey(entry.fgColor),
            colorMatchKey(entry.bgColor)
        ].join('|');
    }
    if ('xmlPreserve' in entry) {
        return `unknown|${entry.xmlPreserve.trim()}`;
    }
    return 'unknown|';
}

/**
 * Serialize fills collection.
 *
 * @param {Object} entries - The entries parameter.
 * @returns {*} - Returns the result.
 */
export function serializeFillsCollection(entries: ReadonlyArray<FillEntry>): StylesCollectionXml | undefined {
    if (entries.length === 0) {
        return undefined;
    }
    const body: string = entries.map((e: FillEntry): string => serializeFillElement(e)).join('');
    return {
        name: 'fills',
        xml: `<fills count="${entries.length}">${body}</fills>`,
        count: entries.length
    };
}

/**
 * parseBorderEdge function.
 *
 * @param {string} el - The el parameter.
 * @returns {BorderEdge} - Returns the result.
 */
function parseBorderEdge(el: string): BorderEdge {
    const openEnd: number = findTagEnd(el.trim(), 0);
    const openTag: string = openEnd >= 0 ? el.trim().slice(0, openEnd + 1) : el;
    const attrs: Map<string, string> = parseAttrMap(openTag.replace(/^<\S+/, '').replace(/\/?>$/, ''));
    const style: string = attrs.get('style');
    let color: Color | undefined;
    for (const nested of splitTopLevelElements(elementInner(el))) {
        if (elementLocalName(nested) === 'color') {
            color = parseColorChild(nested);
        }
    }
    return {
        ...(style !== undefined ? { style } : {}),
        ...(color !== undefined ? { color } : {})
    };
}

/**
 * Parse a single `<border>` element (`CT_Border`).
 *
 * @param {string} borderXml - The borderXml parameter.
 * @returns {CellBorder} - Returns the result.
 */
export function parseBorderElement(borderXml: string): CellBorder {
    const trimmed: string = borderXml.trim();
    const openEnd: number = findTagEnd(trimmed, 0);
    const openTag: string = openEnd >= 0 ? trimmed.slice(0, openEnd + 1) : trimmed;
    const attrs: Map<string, string> = parseAttrMap(openTag.replace(/^<\S+/, '').replace(/\/?>$/, ''));
    const diagonalUp: boolean = parseOptionalBool(attrs.get('diagonalUp'));
    const diagonalDown: boolean = parseOptionalBool(attrs.get('diagonalDown'));
    const outline: boolean = parseOptionalBool(attrs.get('outline'));

    let left: BorderEdge | undefined;
    let right: BorderEdge | undefined;
    let top: BorderEdge | undefined;
    let bottom: BorderEdge | undefined;
    let diagonal: BorderEdge | undefined;
    const extra: string[] = [];

    for (const child of splitTopLevelElements(elementInner(trimmed))) {
        const local: string = elementLocalName(child);
        switch (local) {
        case 'left':
            left = parseBorderEdge(child);
            break;
        case 'right':
            right = parseBorderEdge(child);
            break;
        case 'top':
            top = parseBorderEdge(child);
            break;
        case 'bottom':
            bottom = parseBorderEdge(child);
            break;
        case 'diagonal':
            diagonal = parseBorderEdge(child);
            break;
        default:
            extra.push(child.trim());
            break;
        }
    }

    return {
        ...(left !== undefined ? { left } : {}),
        ...(right !== undefined ? { right } : {}),
        ...(top !== undefined ? { top } : {}),
        ...(bottom !== undefined ? { bottom } : {}),
        ...(diagonal !== undefined ? { diagonal } : {}),
        ...(diagonalUp !== undefined ? { diagonalUp } : {}),
        ...(diagonalDown !== undefined ? { diagonalDown } : {}),
        ...(outline !== undefined ? { outline } : {}),
        ...(extra.length > 0 ? { extraChildrenXml: extra } : {}),
        xmlPreserve: trimmed
    };
}

/**
 * parseBordersCollection function.
 *
 * @param {string} collectionXml - The collectionXml parameter.
 * @returns {CellBorder[]} - Returns the result.
 */
export function parseBordersCollection(collectionXml: string): CellBorder[] {
    return collectionItemXmls(collectionXml).map((item: string): CellBorder => parseBorderElement(item));
}

/**
 * serializeBorderEdge function.
 *
 * @param {string} name - The name parameter.
 * @param {*} edge - The edge parameter.
 * @returns {string} - Returns the result.
 */
function serializeBorderEdge(name: string, edge: BorderEdge | undefined): string {
    if (edge === undefined) {
        return `<${name}/>`;
    }
    const styleAttr: string = edge.style !== undefined ? ` style="${escapeXml(edge.style)}"` : '';
    const color: string = serializeColorElement('color', edge.color);
    if (color.length === 0 && styleAttr.length === 0) {
        return `<${name}/>`;
    }
    if (color.length === 0) {
        return `<${name}${styleAttr}/>`;
    }
    return `<${name}${styleAttr}>${color}</${name}>`;
}

/**
 * Serialize a border entry using Transitional edge names for known edges.
 *
 * @param {Object} entry - The entry parameter.
 * @returns {string} - Returns the result.
 */
export function serializeBorderElement(entry: Border | CellBorder): string {
    if ('xmlPreserve' in entry && entry.xmlPreserve !== undefined && entry.xmlPreserve.trim().length > 0) {
        return entry.xmlPreserve.trim();
    }
    const attrs: string[] = [];
    if (entry.diagonalUp !== undefined) {
        attrs.push(`diagonalUp="${entry.diagonalUp ? '1' : '0'}"`);
    }
    if (entry.diagonalDown !== undefined) {
        attrs.push(`diagonalDown="${entry.diagonalDown ? '1' : '0'}"`);
    }
    if (entry.outline !== undefined) {
        attrs.push(`outline="${entry.outline ? '1' : '0'}"`);
    }
    const attrStr: string = attrs.length > 0 ? ` ${attrs.join(' ')}` : '';
    const extra: string = 'extraChildrenXml' in entry && entry.extraChildrenXml !== undefined ? entry.extraChildrenXml.join('') : '';
    const body: string =
        serializeBorderEdge('left', entry.left) +
        serializeBorderEdge('right', entry.right) +
        serializeBorderEdge('top', entry.top) +
        serializeBorderEdge('bottom', entry.bottom) +
        serializeBorderEdge('diagonal', entry.diagonal) +
        extra;
    return `<border${attrStr}>${body}</border>`;
}

/**
 * Build an internal {@link CellBorder} from public {@link Border} input.
 *
 * @param {Border} input - The input parameter.
 * @returns {CellBorder} - Returns the result.
 */
export function cellBorderFromInput(input: Border): CellBorder {
    const withoutPreserve: Border = {
        ...(input.left !== undefined ? { left: input.left } : {}),
        ...(input.right !== undefined ? { right: input.right } : {}),
        ...(input.top !== undefined ? { top: input.top } : {}),
        ...(input.bottom !== undefined ? { bottom: input.bottom } : {}),
        ...(input.diagonal !== undefined ? { diagonal: input.diagonal } : {}),
        ...(input.diagonalUp !== undefined ? { diagonalUp: input.diagonalUp } : {}),
        ...(input.diagonalDown !== undefined ? { diagonalDown: input.diagonalDown } : {}),
        ...(input.outline !== undefined ? { outline: input.outline } : {})
    };
    // Empty input still needs Transitional empty edges (Excel-compatible).
    const xml: string = serializeBorderElement(withoutPreserve);
    return {
        ...withoutPreserve,
        xmlPreserve: xml
    };
}

/**
 * edgeMatchKey function.
 *
 * @param {*} e - The e parameter.
 * @returns {string} - Returns the result.
 */
function edgeMatchKey(e: BorderEdge | undefined): string {
    if (e === undefined) {
        return '';
    }
    // Empty edge object is equivalent to omitted edge (baseline empty borders).
    if (e.style === undefined && e.color === undefined) {
        return '';
    }
    return `${e.style != null ? e.style : ''};${colorMatchKey(e.color)}`;
}

/**
 * borderMatchKey function.
 *
 * @param {Object} entry - The entry parameter.
 * @returns {string} - Returns the result.
 */
export function borderMatchKey(entry: Border | CellBorder): string {
    return [
        edgeMatchKey(entry.left),
        edgeMatchKey(entry.right),
        edgeMatchKey(entry.top),
        edgeMatchKey(entry.bottom),
        edgeMatchKey(entry.diagonal),
        entry.diagonalUp === true ? '1' : entry.diagonalUp === false ? '0' : '',
        entry.diagonalDown === true ? '1' : entry.diagonalDown === false ? '0' : '',
        entry.outline === true ? '1' : entry.outline === false ? '0' : '',
        'extraChildrenXml' in entry && entry.extraChildrenXml !== undefined ? entry.extraChildrenXml.join('') : ''
    ].join('|');
}

/**
 * Serialize borders collection.
 *
 * @param {Object} entries - The entries parameter.
 * @returns {*} - Returns the result.
 */
export function serializeBordersCollection(entries: ReadonlyArray<CellBorder>): StylesCollectionXml | undefined {
    if (entries.length === 0) {
        return undefined;
    }
    const body: string = entries.map((e: CellBorder): string => serializeBorderElement(e)).join('');
    return {
        name: 'borders',
        xml: `<borders count="${entries.length}">${body}</borders>`,
        count: entries.length
    };
}

/**
 * Baseline fill entries: index 0 none, index 1 gray125.
 *
 * @returns {FillEntry[]} - Returns the result.
 */
export function buildBaselineFillEntries(): FillEntry[] {
    return [fillEntryFromInput({ type: 'pattern', patternType: 'none' }), fillEntryFromInput({ type: 'pattern', patternType: 'gray125' })];
}

/**
 * Baseline default font (Calibri 11, theme 1, minor). Matches historical baseline child order used by buildBaselineStylesCollections.
 *
 * @returns {FontEntry[]} - Returns the result.
 */
export function buildBaselineFontEntries(): FontEntry[] {
    // Prefer a fixed XML matching prior baseline to avoid churn in no-op fixtures.
    const xml: string =
        '<font>' +
        '<sz val="11"/>' +
        '<color theme="1"/>' +
        '<name val="Calibri"/>' +
        '<family val="2"/>' +
        '<scheme val="minor"/>' +
        '</font>';
    return [
        {
            name: 'Calibri',
            size: 11,
            color: { theme: 1 },
            family: 2,
            scheme: 'minor',
            xmlPreserve: xml
        }
    ];
}

/**
 * Baseline empty border (left/right/top/bottom/diagonal empty).
 *
 * @returns {CellBorder[]} - Returns the result.
 */
export function buildBaselineCellBorders(): CellBorder[] {
    // eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
    const xml: '<border><left/><right/><top/><bottom/><diagonal/></border>' = '<border><left/><right/><top/><bottom/><diagonal/></border>';
    return [
        {
            left: {},
            right: {},
            top: {},
            bottom: {},
            diagonal: {},
            xmlPreserve: xml
        }
    ];
}

/**
 * Parse `CT_CellAlignment` open-tag attributes into Alignment. Citations: transitional sml.xsd `CT_CellAlignment`.
 *
 * @param {string} el - The el parameter.
 * @returns {Alignment} - Returns the result.
 */
export function parseAlignmentElement(el: string): Alignment {
    const trimmed: string = el.trim();
    const openEnd: number = findTagEnd(trimmed, 0);
    const openTag: string = openEnd >= 0 ? trimmed.slice(0, openEnd + 1) : trimmed;
    const attrs: Map<string, string> = parseAttrMap(openTag.replace(/^<\S+/, '').replace(/\/?>$/, ''));
    const horizontal: string = attrs.get('horizontal');
    const vertical: string = attrs.get('vertical');
    const textRotation: number = parseOptionalIntAllowNeg(attrs.get('textRotation'));
    const wrapText: boolean = parseOptionalBool(attrs.get('wrapText'));
    const indent: number = parseOptionalNonNegInt(attrs.get('indent'));
    const relativeIndent: number = parseOptionalIntAllowNeg(attrs.get('relativeIndent'));
    const justifyLastLine: boolean = parseOptionalBool(attrs.get('justifyLastLine'));
    const shrinkToFit: boolean = parseOptionalBool(attrs.get('shrinkToFit'));
    const readingOrder: number = parseOptionalNonNegInt(attrs.get('readingOrder'));
    return {
        ...(horizontal !== undefined ? { horizontal } : {}),
        ...(vertical !== undefined ? { vertical } : {}),
        ...(textRotation !== undefined ? { textRotation } : {}),
        ...(wrapText !== undefined ? { wrapText } : {}),
        ...(indent !== undefined ? { indent } : {}),
        ...(relativeIndent !== undefined ? { relativeIndent } : {}),
        ...(justifyLastLine !== undefined ? { justifyLastLine } : {}),
        ...(shrinkToFit !== undefined ? { shrinkToFit } : {}),
        ...(readingOrder !== undefined ? { readingOrder } : {})
    };
}

/**
 * Parse `CT_CellProtection` attributes. Citations: transitional sml.xsd `CT_CellProtection`.
 *
 * @param {string} el - The el parameter.
 * @returns {Protection} - Returns the result.
 */
export function parseProtectionElement(el: string): Protection {
    const trimmed: string = el.trim();
    const openEnd: number = findTagEnd(trimmed, 0);
    const openTag: string = openEnd >= 0 ? trimmed.slice(0, openEnd + 1) : trimmed;
    const attrs: Map<string, string> = parseAttrMap(openTag.replace(/^<\S+/, '').replace(/\/?>$/, ''));
    const locked: boolean = parseOptionalBool(attrs.get('locked'));
    const hidden: boolean = parseOptionalBool(attrs.get('hidden'));
    return {
        ...(locked !== undefined ? { locked } : {}),
        ...(hidden !== undefined ? { hidden } : {})
    };
}

/**
 * Serialize alignment child. Empty object still emits `<alignment/>` when caller sets applyAlignment (caller decides whether to include).
 *
 * @param {Alignment} alignment - The alignment parameter.
 * @returns {string} - Returns the result.
 */
export function serializeAlignmentElement(alignment: Alignment): string {
    const attrs: string[] = [];
    if (alignment.horizontal !== undefined) {
        attrs.push(`horizontal="${escapeXml(String(alignment.horizontal))}"`);
    }
    if (alignment.vertical !== undefined) {
        attrs.push(`vertical="${escapeXml(String(alignment.vertical))}"`);
    }
    if (alignment.textRotation !== undefined) {
        attrs.push(`textRotation="${alignment.textRotation}"`);
    }
    if (alignment.wrapText !== undefined) {
        attrs.push(`wrapText="${alignment.wrapText ? '1' : '0'}"`);
    }
    if (alignment.indent !== undefined) {
        attrs.push(`indent="${alignment.indent}"`);
    }
    if (alignment.relativeIndent !== undefined) {
        attrs.push(`relativeIndent="${alignment.relativeIndent}"`);
    }
    if (alignment.justifyLastLine !== undefined) {
        attrs.push(`justifyLastLine="${alignment.justifyLastLine ? '1' : '0'}"`);
    }
    if (alignment.shrinkToFit !== undefined) {
        attrs.push(`shrinkToFit="${alignment.shrinkToFit ? '1' : '0'}"`);
    }
    if (alignment.readingOrder !== undefined) {
        attrs.push(`readingOrder="${alignment.readingOrder}"`);
    }
    if (attrs.length === 0) {
        return '<alignment/>';
    }
    return `<alignment ${attrs.join(' ')}/>`;
}

/**
 * Serialize protection child.
 *
 * @param {Protection} protection - The protection parameter.
 * @returns {string} - Returns the result.
 */
export function serializeProtectionElement(protection: Protection): string {
    const attrs: string[] = [];
    if (protection.locked !== undefined) {
        attrs.push(`locked="${protection.locked ? '1' : '0'}"`);
    }
    if (protection.hidden !== undefined) {
        attrs.push(`hidden="${protection.hidden ? '1' : '0'}"`);
    }
    if (attrs.length === 0) {
        return '<protection/>';
    }
    return `<protection ${attrs.join(' ')}/>`;
}

/**
 * Serialize one inline `numFmt` element for nesting under `dxf`. Citations: `CT_NumFmt` — required `numFmtId`, `formatCode`.
 *
 * @param {Object} entry - The entry parameter.
 * @returns {string} - Returns the result.
 */
export function serializeNumFmtElement(entry: NumFmtEntry | DifferentialNumFmtInput): string {
    if ('xmlPreserve' in entry && entry.xmlPreserve !== undefined && entry.xmlPreserve.trim().length > 0) {
        return entry.xmlPreserve.trim();
    }
    const numFmtId: number = entry.numFmtId != null ? entry.numFmtId : 0;
    return `<numFmt numFmtId="${numFmtId}" formatCode="${escapeXml(entry.formatCode)}"/>`;
}

/**
 * Parse a single `<dxf>` element (`CT_Dxf`). Citations: transitional sml.xsd `CT_Dxf` child sequence.
 *
 * @param {string} dxfXml - The dxfXml parameter.
 * @returns {DxfEntry} - Returns the result.
 */
export function parseDxfElement(dxfXml: string): DxfEntry {
    const trimmed: string = dxfXml.trim();
    let font: FontEntry | undefined;
    let numFmt: NumFmtEntry | undefined;
    let fill: FillEntry | undefined;
    let alignment: Alignment | undefined;
    let border: CellBorder | undefined;
    let protection: Protection | undefined;
    const extra: string[] = [];

    for (const child of splitTopLevelElements(elementInner(trimmed))) {
        const local: string = elementLocalName(child);
        if (local === 'font') {
            font = parseFontElement(child);
        } else if (local === 'numFmt') {
            numFmt = parseNumFmtElement(child);
        } else if (local === 'fill') {
            fill = parseFillElement(child);
        } else if (local === 'alignment') {
            alignment = parseAlignmentElement(child);
        } else if (local === 'border') {
            border = parseBorderElement(child);
        } else if (local === 'protection') {
            protection = parseProtectionElement(child);
        } else if (child.trim().length > 0) {
            extra.push(child.trim());
        }
    }

    return {
        ...(font !== undefined ? { font } : {}),
        ...(numFmt !== undefined ? { numFmt } : {}),
        ...(fill !== undefined ? { fill } : {}),
        ...(alignment !== undefined ? { alignment } : {}),
        ...(border !== undefined ? { border } : {}),
        ...(protection !== undefined ? { protection } : {}),
        ...(extra.length > 0 ? { extraChildrenXml: extra } : {}),
        xmlPreserve: trimmed
    };
}

/**
 * Parse all `dxf` children from a `dxfs` collection element.
 *
 * @param {string} collectionXml - The collectionXml parameter.
 * @returns {DxfEntry[]} - Returns the result.
 */
export function parseDxfsCollection(collectionXml: string): DxfEntry[] {
    return collectionItemXmls(collectionXml).map((item: string): DxfEntry => parseDxfElement(item));
}

/**
 * Serialize one `<dxf>` element. Prefer xmlPreserve when set. Nested children use schema order: font → numFmt → fill → alignment → border → protection → extras.
 *
 * @param {DxfEntry} entry - The entry parameter.
 * @returns {string} - Returns the result.
 */
export function serializeDxfElement(entry: DxfEntry): string {
    if (entry.xmlPreserve !== undefined && entry.xmlPreserve.trim().length > 0) {
        return entry.xmlPreserve.trim();
    }
    const bodyParts: string[] = [];
    if (entry.font !== undefined) {
        bodyParts.push(serializeFontElement(entry.font));
    }
    if (entry.numFmt !== undefined) {
        bodyParts.push(serializeNumFmtElement(entry.numFmt));
    }
    if (entry.fill !== undefined) {
        bodyParts.push(serializeFillElement(entry.fill));
    }
    if (entry.alignment !== undefined) {
        bodyParts.push(serializeAlignmentElement(entry.alignment));
    }
    if (entry.border !== undefined) {
        bodyParts.push(serializeBorderElement(entry.border));
    }
    if (entry.protection !== undefined) {
        bodyParts.push(serializeProtectionElement(entry.protection));
    }
    if (entry.extraChildrenXml !== undefined) {
        for (const child of entry.extraChildrenXml) {
            if (child.trim().length > 0) {
                bodyParts.push(child.trim());
            }
        }
    }
    if (bodyParts.length === 0) {
        return '<dxf/>';
    }
    return `<dxf>${bodyParts.join('')}</dxf>`;
}

/**
 * Canonical match key for dxf exact-match reuse. Alignment/protection participate when present on internal {@link DxfEntry}
 *
 * @param {Object} entry - The entry parameter.
 * @returns {string} - Returns the result.
 */
export function dxfMatchKey(entry: DxfEntry | DifferentialFormatInput | DifferentialFormatView): string {
    const numFmtKey: string =
        entry.numFmt !== undefined
            ? `${'numFmtId' in entry.numFmt && entry.numFmt.numFmtId !== undefined ? entry.numFmt.numFmtId : 0}|${entry.numFmt.formatCode}`
            : '';
    const fontKey: string = entry.font !== undefined ? fontMatchKey(entry.font) : '';
    const fillKey: string = entry.fill !== undefined ? fillMatchKey(entry.fill) : '';
    const borderKey: string = entry.border !== undefined ? borderMatchKey(entry.border) : '';
    const alignment: Alignment = 'alignment' in entry && entry.alignment !== undefined ? entry.alignment : undefined;
    const protection: Protection = 'protection' in entry && entry.protection !== undefined ? entry.protection : undefined;
    const extras: string = 'extraChildrenXml' in entry && entry.extraChildrenXml !== undefined ? entry.extraChildrenXml.join('') : '';
    return [fontKey, numFmtKey, fillKey, alignmentMatchKey(alignment), borderKey, protectionMatchKey(protection), extras].join('||');
}

/**
 * Build a library-authored `DxfEntry` from public input and pre-serialize xmlPreserve.
 *
 * @param {DifferentialFormatInput} input - The input parameter.
 * @returns {DxfEntry} - Returns the result.
 */
export function dxfEntryFromInput(input: DifferentialFormatInput): DxfEntry {
    const font: FontEntry = input.font !== undefined ? fontEntryFromInput(input.font) : undefined;
    const fill: FillEntry = input.fill !== undefined ? fillEntryFromInput(input.fill) : undefined;
    const border: CellBorder = input.border !== undefined ? cellBorderFromInput(input.border) : undefined;
    let numFmt: NumFmtEntry | undefined;
    if (input.numFmt !== undefined) {
        if (typeof input.numFmt.formatCode !== 'string' || input.numFmt.formatCode.length === 0) {
            throw new InvalidStylesError('Differential format numFmt.formatCode must be a non-empty string');
        }
        numFmt = {
            numFmtId: input.numFmt.numFmtId != null ? input.numFmt.numFmtId : 0,
            formatCode: input.numFmt.formatCode
        };
    }
    const entry: DxfEntry = {
        ...(font !== undefined ? { font } : {}),
        ...(numFmt !== undefined ? { numFmt } : {}),
        ...(fill !== undefined ? { fill } : {}),
        ...(border !== undefined ? { border } : {})
    };
    return {
        ...entry,
        xmlPreserve: serializeDxfElement(entry)
    };
}

/**
 * Snapshot view of a dxf row (public font / numFmt / fill / border only).
 *
 * @param {DxfEntry} entry - The entry parameter.
 * @returns {DifferentialFormatView} - Returns the result.
 */
export function dxfEntryToView(entry: DxfEntry): DifferentialFormatView {
    const view: DifferentialFormatView = {
        ...(entry.font !== undefined
            ? {
                font: {
                    ...(entry.font.name !== undefined ? { name: entry.font.name } : {}),
                    ...(entry.font.size !== undefined ? { size: entry.font.size } : {}),
                    ...(entry.font.bold !== undefined ? { bold: entry.font.bold } : {}),
                    ...(entry.font.italic !== undefined ? { italic: entry.font.italic } : {}),
                    ...(entry.font.underline !== undefined ? { underline: entry.font.underline } : {}),
                    ...(entry.font.strike !== undefined ? { strike: entry.font.strike } : {}),
                    ...(entry.font.color !== undefined ? { color: entry.font.color } : {}),
                    ...(entry.font.family !== undefined ? { family: entry.font.family } : {}),
                    ...(entry.font.charset !== undefined ? { charset: entry.font.charset } : {}),
                    ...(entry.font.scheme !== undefined ? { scheme: entry.font.scheme } : {}),
                    ...(entry.font.vertAlign !== undefined ? { vertAlign: entry.font.vertAlign } : {}),
                    ...(entry.font.outline !== undefined ? { outline: entry.font.outline } : {}),
                    ...(entry.font.shadow !== undefined ? { shadow: entry.font.shadow } : {}),
                    ...(entry.font.condense !== undefined ? { condense: entry.font.condense } : {}),
                    ...(entry.font.extend !== undefined ? { extend: entry.font.extend } : {})
                }
            }
            : {}),
        ...(entry.numFmt !== undefined
            ? {
                numFmt: {
                    numFmtId: entry.numFmt.numFmtId,
                    formatCode: entry.numFmt.formatCode
                }
            }
            : {}),
        ...(entry.fill !== undefined
            ? {
                fill:
                      entry.fill.type === 'gradient'
                          ? {
                              type: 'gradient',
                              gradientXml: entry.fill.gradientXml != null ? entry.fill.gradientXml : entry.fill.xmlPreserve
                          }
                          : {
                              type: 'pattern',
                              patternType: entry.fill.patternType != null ? entry.fill.patternType : 'none',
                              ...(entry.fill.fgColor !== undefined ? { fgColor: entry.fill.fgColor } : {}),
                              ...(entry.fill.bgColor !== undefined ? { bgColor: entry.fill.bgColor } : {})
                          }
            }
            : {}),
        // alignment / protection intentionally omitted from public view (internal preserve).
        ...(entry.border !== undefined
            ? {
                border: {
                    ...(entry.border.left !== undefined ? { left: entry.border.left } : {}),
                    ...(entry.border.right !== undefined ? { right: entry.border.right } : {}),
                    ...(entry.border.top !== undefined ? { top: entry.border.top } : {}),
                    ...(entry.border.bottom !== undefined ? { bottom: entry.border.bottom } : {}),
                    ...(entry.border.diagonal !== undefined ? { diagonal: entry.border.diagonal } : {}),
                    ...(entry.border.diagonalUp !== undefined ? { diagonalUp: entry.border.diagonalUp } : {}),
                    ...(entry.border.diagonalDown !== undefined ? { diagonalDown: entry.border.diagonalDown } : {}),
                    ...(entry.border.outline !== undefined ? { outline: entry.border.outline } : {})
                }
            }
            : {})
    };
    return view;
}

/**
 * Serialize `dxfs` collection. Omits the collection when empty.
 *
 * @param {Object} entries - The entries parameter.
 * @returns {*} - Returns the result.
 */
export function serializeDxfsCollection(entries: ReadonlyArray<DxfEntry>): StylesCollectionXml | undefined {
    if (entries.length === 0) {
        return undefined;
    }
    const body: string = entries.map((e: DxfEntry): string => serializeDxfElement(e)).join('');
    return {
        name: 'dxfs',
        xml: `<dxfs count="${entries.length}">${body}</dxfs>`,
        count: entries.length
    };
}

/**
 * alignmentMatchKey function.
 *
 * @param {*} a - The a parameter.
 * @returns {string} - Returns the result.
 */
function alignmentMatchKey(a: Alignment | undefined): string {
    if (a === undefined) {
        return '';
    }
    return [
        a.horizontal != null ? a.horizontal : '',
        a.vertical != null ? a.vertical : '',
        a.textRotation != null ? a.textRotation : '',
        a.wrapText === true ? '1' : a.wrapText === false ? '0' : '',
        a.indent != null ? a.indent : '',
        a.relativeIndent != null ? a.relativeIndent : '',
        a.justifyLastLine === true ? '1' : a.justifyLastLine === false ? '0' : '',
        a.shrinkToFit === true ? '1' : a.shrinkToFit === false ? '0' : '',
        a.readingOrder != null ? a.readingOrder : ''
    ].join(',');
}

/**
 * protectionMatchKey function.
 *
 * @param {*} p - The p parameter.
 * @returns {string} - Returns the result.
 */
function protectionMatchKey(p: Protection | undefined): string {
    if (p === undefined) {
        return '';
    }
    return [p.locked === true ? '1' : p.locked === false ? '0' : '', p.hidden === true ? '1' : p.hidden === false ? '0' : ''].join(',');
}

/**
 * boolAttrMatchKey function.
 *
 * @param {boolean} v - The v parameter.
 * @returns {string} - Returns the result.
 */
function boolAttrMatchKey(v: boolean | undefined): string {
    return v === true ? '1' : v === false ? '0' : '';
}

/**
 * Canonical match key for cell xf exact-match reuse. Includes id attrs, apply* flags, alignment, protection, extras.
 *
 * @param {Object} entry - The entry parameter.
 * @returns {string} - Returns the result.
 */
export function cellXfMatchKey(entry: CellXfEntry | CellFormat): string {
    return [
        entry.numFmtId != null ? entry.numFmtId : '',
        entry.fontId != null ? entry.fontId : '',
        entry.fillId != null ? entry.fillId : '',
        entry.borderId != null ? entry.borderId : '',
        entry.xfId != null ? entry.xfId : '',
        boolAttrMatchKey(entry.quotePrefix),
        boolAttrMatchKey(entry.pivotButton),
        boolAttrMatchKey(entry.applyNumberFormat),
        boolAttrMatchKey(entry.applyFont),
        boolAttrMatchKey(entry.applyFill),
        boolAttrMatchKey(entry.applyBorder),
        boolAttrMatchKey(entry.applyAlignment),
        boolAttrMatchKey(entry.applyProtection),
        alignmentMatchKey(entry.alignment),
        protectionMatchKey(entry.protection),
        entry.extraChildrenXml !== undefined ? entry.extraChildrenXml.join('') : ''
    ].join('|');
}

/**
 * Serialize one `<xf>` element. Prefer xmlPreserve when set. Citations: `CT_Xf` sequence alignment → protection → extLst.
 *
 * @param {CellXfEntry} entry - The entry parameter.
 * @returns {string} - Returns the result.
 */
export function serializeXfElement(entry: CellXfEntry): string {
    if (entry.xmlPreserve !== undefined && entry.xmlPreserve.trim().length > 0) {
        return entry.xmlPreserve.trim();
    }
    const attrs: string[] = [];
    if (entry.numFmtId !== undefined) {
        attrs.push(`numFmtId="${entry.numFmtId}"`);
    }
    if (entry.fontId !== undefined) {
        attrs.push(`fontId="${entry.fontId}"`);
    }
    if (entry.fillId !== undefined) {
        attrs.push(`fillId="${entry.fillId}"`);
    }
    if (entry.borderId !== undefined) {
        attrs.push(`borderId="${entry.borderId}"`);
    }
    if (entry.xfId !== undefined) {
        attrs.push(`xfId="${entry.xfId}"`);
    }
    if (entry.quotePrefix !== undefined) {
        attrs.push(`quotePrefix="${entry.quotePrefix ? '1' : '0'}"`);
    }
    if (entry.pivotButton !== undefined) {
        attrs.push(`pivotButton="${entry.pivotButton ? '1' : '0'}"`);
    }
    if (entry.applyNumberFormat !== undefined) {
        attrs.push(`applyNumberFormat="${entry.applyNumberFormat ? '1' : '0'}"`);
    }
    if (entry.applyFont !== undefined) {
        attrs.push(`applyFont="${entry.applyFont ? '1' : '0'}"`);
    }
    if (entry.applyFill !== undefined) {
        attrs.push(`applyFill="${entry.applyFill ? '1' : '0'}"`);
    }
    if (entry.applyBorder !== undefined) {
        attrs.push(`applyBorder="${entry.applyBorder ? '1' : '0'}"`);
    }
    if (entry.applyAlignment !== undefined) {
        attrs.push(`applyAlignment="${entry.applyAlignment ? '1' : '0'}"`);
    }
    if (entry.applyProtection !== undefined) {
        attrs.push(`applyProtection="${entry.applyProtection ? '1' : '0'}"`);
    }
    const attrStr: string = attrs.length > 0 ? ` ${attrs.join(' ')}` : '';
    const bodyParts: string[] = [];
    if (entry.alignment !== undefined) {
        bodyParts.push(serializeAlignmentElement(entry.alignment));
    }
    if (entry.protection !== undefined) {
        bodyParts.push(serializeProtectionElement(entry.protection));
    }
    if (entry.extraChildrenXml !== undefined) {
        for (const child of entry.extraChildrenXml) {
            if (child.trim().length > 0) {
                bodyParts.push(child.trim());
            }
        }
    }
    if (bodyParts.length === 0) {
        return `<xf${attrStr}/>`;
    }
    return `<xf${attrStr}>${bodyParts.join('')}</xf>`;
}

/**
 * Build a library-authored CellXfEntry and pre-serialize xmlPreserve.
 *
 * @param {*} fields - fields value.
 * @returns {CellXfEntry} Function result.
 */
export function cellXfEntryFromResolved(fields: {
    readonly numFmtId?: number;
    readonly fontId?: number;
    readonly fillId?: number;
    readonly borderId?: number;
    readonly xfId?: number;
    readonly quotePrefix?: boolean;
    readonly pivotButton?: boolean;
    readonly applyNumberFormat?: boolean;
    readonly applyFont?: boolean;
    readonly applyFill?: boolean;
    readonly applyBorder?: boolean;
    readonly applyAlignment?: boolean;
    readonly applyProtection?: boolean;
    readonly alignment?: Alignment;
    readonly protection?: Protection;
}): CellXfEntry {
    const entry: CellXfEntry = {
        numFmtId: fields.numFmtId,
        fontId: fields.fontId,
        fillId: fields.fillId,
        borderId: fields.borderId,
        xfId: fields.xfId,
        quotePrefix: fields.quotePrefix,
        pivotButton: fields.pivotButton,
        applyNumberFormat: fields.applyNumberFormat,
        applyFont: fields.applyFont,
        applyFill: fields.applyFill,
        applyBorder: fields.applyBorder,
        applyAlignment: fields.applyAlignment,
        applyProtection: fields.applyProtection,
        alignment: fields.alignment,
        protection: fields.protection,
        extraChildrenXml: undefined,
        xmlPreserve: undefined
    };
    return {
        ...entry,
        xmlPreserve: serializeXfElement(entry)
    };
}

/**
 * Parse a single `<xf>` element into a view (attributes + alignment/protection). Citations: `CT_Xf` in transitional sml.xsd.
 *
 * @param {string} xfXml - The xfXml parameter.
 * @returns {CellFormat} - Returns the result.
 */
export function parseXfElement(xfXml: string): CellFormat {
    const trimmed: string = xfXml.trim();
    const openEnd: number = findTagEnd(trimmed, 0);
    const openTag: string = openEnd >= 0 ? trimmed.slice(0, openEnd + 1) : trimmed;
    // Strip element name and optional trailing `/>` / `>` so only attributes remain.
    const attrs: Map<string, string> = parseAttrMap(openTag.replace(/^<\S+/, '').replace(/\/?>$/, ''));

    let alignment: Alignment | undefined;
    let protection: Protection | undefined;
    const extra: string[] = [];
    for (const child of splitTopLevelElements(elementInner(trimmed))) {
        const local: string = elementLocalName(child);
        if (local === 'alignment') {
            alignment = parseAlignmentElement(child);
        } else if (local === 'protection') {
            protection = parseProtectionElement(child);
        } else {
            extra.push(child.trim());
        }
    }

    return {
        numFmtId: parseOptionalNonNegInt(attrs.get('numFmtId')),
        fontId: parseOptionalNonNegInt(attrs.get('fontId')),
        fillId: parseOptionalNonNegInt(attrs.get('fillId')),
        borderId: parseOptionalNonNegInt(attrs.get('borderId')),
        xfId: parseOptionalNonNegInt(attrs.get('xfId')),
        quotePrefix: parseOptionalBool(attrs.get('quotePrefix')),
        pivotButton: parseOptionalBool(attrs.get('pivotButton')),
        applyNumberFormat: parseOptionalBool(attrs.get('applyNumberFormat')),
        applyFont: parseOptionalBool(attrs.get('applyFont')),
        applyFill: parseOptionalBool(attrs.get('applyFill')),
        applyBorder: parseOptionalBool(attrs.get('applyBorder')),
        applyAlignment: parseOptionalBool(attrs.get('applyAlignment')),
        applyProtection: parseOptionalBool(attrs.get('applyProtection')),
        alignment,
        protection,
        extraChildrenXml: extra.length > 0 ? extra : undefined,
        xmlPreserve: trimmed
    };
}

/**
 * Parse all `xf` children from a `cellXfs` (or cellStyleXfs) collection.
 *
 * @param {string} collectionXml - The collectionXml parameter.
 * @returns {CellXfEntry[]} - Returns the result.
 */
export function parseCellXfsCollection(collectionXml: string): CellXfEntry[] {
    return collectionItemXmls(collectionXml).map((item: string): CellXfEntry => {
        const view: CellFormat = parseXfElement(item);
        const entry: CellXfEntry = {
            numFmtId: view.numFmtId,
            fontId: view.fontId,
            fillId: view.fillId,
            borderId: view.borderId,
            xfId: view.xfId,
            quotePrefix: view.quotePrefix,
            pivotButton: view.pivotButton,
            applyNumberFormat: view.applyNumberFormat,
            applyFont: view.applyFont,
            applyFill: view.applyFill,
            applyBorder: view.applyBorder,
            applyAlignment: view.applyAlignment,
            applyProtection: view.applyProtection,
            alignment: view.alignment,
            protection: view.protection,
            extraChildrenXml: view.extraChildrenXml,
            xmlPreserve: view.xmlPreserve
        };
        return entry;
    });
}

/**
 * Serialize cellXfs collection.
 *
 * @param {Object} entries - The entries parameter.
 * @returns {*} - Returns the result.
 */
export function serializeCellXfsCollection(entries: ReadonlyArray<CellXfEntry>): StylesCollectionXml | undefined {
    if (entries.length === 0) {
        return undefined;
    }
    const body: string = entries.map((e: CellXfEntry): string => serializeXfElement(e)).join('');
    return {
        name: 'cellXfs',
        xml: `<cellXfs count="${entries.length}">${body}</cellXfs>`,
        count: entries.length
    };
}

/**
 * Baseline default cell xf (ids 0, xfId 0). Matches historical baseline used by buildBaselineStylesCollections.
 *
 * @returns {CellXfEntry[]} - Returns the result.
 */
export function buildBaselineCellXfEntries(): CellXfEntry[] {
    // eslint-disable-next-line @typescript-eslint/prefer-as-const -- literal typedef required by tslint:typedef bridge
    const xml: '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>' =
        '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>';
    return [
        {
            numFmtId: 0,
            fontId: 0,
            fillId: 0,
            borderId: 0,
            xfId: 0,
            quotePrefix: undefined,
            pivotButton: undefined,
            applyNumberFormat: undefined,
            applyFont: undefined,
            applyFill: undefined,
            applyBorder: undefined,
            applyAlignment: undefined,
            applyProtection: undefined,
            alignment: undefined,
            protection: undefined,
            extraChildrenXml: undefined,
            xmlPreserve: xml
        }
    ];
}

/**
 * parseOptionalIntAllowNeg function.
 *
 * @param {string} raw - The raw parameter.
 * @returns {number} - Returns the result.
 */
function parseOptionalIntAllowNeg(raw: string | undefined): number | undefined {
    if (raw === undefined || raw === '') {
        return undefined;
    }
    const n: number = Number.parseInt(raw, 10);
    if (!Number.isFinite(n)) {
        return undefined;
    }
    return n;
}

/**
 * Extract ordered child element XML strings from a collection element body.
 *
 * @param {string} collectionXml - The collectionXml parameter.
 * @returns {string[]} - Returns the result.
 */
export function collectionItemXmls(collectionXml: string): string[] {
    const inner: string = elementInner(collectionXml);
    return splitTopLevelElements(inner);
}

/**
 * parseOptionalNonNegInt function.
 *
 * @param {string} raw - The raw parameter.
 * @returns {number} - Returns the result.
 */
function parseOptionalNonNegInt(raw: string | undefined): number | undefined {
    if (raw === undefined || raw === '') {
        return undefined;
    }
    const n: number = Number.parseInt(raw, 10);
    if (!Number.isFinite(n) || n < 0) {
        return undefined;
    }
    return n;
}

/**
 * parseOptionalBool function.
 *
 * @param {string} raw - The raw parameter.
 * @returns {boolean} - Returns the result.
 */
function parseOptionalBool(raw: string | undefined): boolean | undefined {
    if (raw === undefined) {
        return undefined;
    }
    if (raw === '1' || raw.toLowerCase() === 'true') {
        return true;
    }
    if (raw === '0' || raw.toLowerCase() === 'false') {
        return false;
    }
    return undefined;
}

/**
 * matchRoot function.
 *
 * @param {string} xml - The xml parameter.
 * @param {string} partName - The partName parameter.
 * @returns {Object} - Returns the result.
 */
function matchRoot(xml: string, partName: string): { inner: string; openAttrs: string } {
    // eslint-disable-next-line security/detect-unsafe-regex -- fixed OOXML/token grammar literal
    const m: RegExpExecArray = /^<([A-Za-z_][\w.-]*:)?styleSheet\b([^>]*)>/i.exec(xml);
    if (m == null) {
        throw new InvalidStylesError(`Styles part "${partName}" is missing root element styleSheet`, { partName });
    }

    const openAttrs: string = (m[2] != null ? m[2] : '').replace(/\/\s*$/, '');
    const openEnd: number = findTagEnd(xml, 0);
    if (openEnd < 0) {
        throw new InvalidStylesError(`Styles part "${partName}" has malformed styleSheet open tag`, { partName });
    }
    const openTag: string = xml.slice(0, openEnd + 1);
    if (/\/\s*>$/.test(openTag)) {
        return { inner: '', openAttrs };
    }
    const close: number = findClosing(xml, 'styleSheet', openEnd + 1);
    if (close < 0) {
        throw new InvalidStylesError(`Styles part "${partName}" has unclosed styleSheet element`, { partName });
    }
    const closeStart: number = xml.lastIndexOf('</', close);
    const inner: string = xml.slice(openEnd + 1, closeStart);
    return { inner, openAttrs };
}

/**
 * stripPrologAndComments function.
 *
 * @param {string} xml - The xml parameter.
 * @returns {string} - Returns the result.
 */
function stripPrologAndComments(xml: string): string {
    return xml
        .replace(/^\uFEFF/, '')
        .replace(/<\?xml[\s\S]*?\?>/i, '')
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/^\s+/, '');
}

/**
 * splitTopLevelElements function.
 *
 * @param {string} s - The s parameter.
 * @returns {string[]} - Returns the result.
 */
function splitTopLevelElements(s: string): string[] {
    const result: string[] = [];
    let i: number = 0;
    while (i < s.length) {
        const lt: number = s.indexOf('<', i);
        if (lt < 0) {
            break;
        }
        if (s.startsWith('</', lt)) {
            break;
        }
        if (s.startsWith('<?', lt) || s.startsWith('<!', lt)) {
            const endPi: number = s.indexOf('>', lt);
            i = endPi < 0 ? s.length : endPi + 1;
            continue;
        }
        const openEnd: number = findTagEnd(s, lt);
        if (openEnd < 0) {
            break;
        }
        const openTag: string = s.slice(lt, openEnd + 1);
        if (openTag.endsWith('/>') || /\/\s*>$/.test(openTag)) {
            result.push(s.slice(lt, openEnd + 1));
            i = openEnd + 1;
            continue;
        }
        const local: string = elementLocalName(openTag);
        const close: number = findClosing(s, local, openEnd + 1);
        if (close < 0) {
            result.push(s.slice(lt).trim());
            break;
        }
        result.push(s.slice(lt, close).replace(/\s+$/, ''));
        i = close;
    }
    return result.map((x: string): string => x.trim()).filter((x: string): boolean => x.length > 0);
}

/**
 * findTagEnd function.
 *
 * @param {string} s - The s parameter.
 * @param {number} from - The from parameter.
 * @returns {number} - Returns the result.
 */
function findTagEnd(s: string, from: number): number {
    let inQuote: '"' | '\'' | null = null;
    for (let i: number = from; i < s.length; i += 1) {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const ch: string = s[i];
        if (inQuote !== null) {
            if (ch === inQuote) {
                inQuote = null;
            }
            continue;
        }
        if (ch === '"' || ch === '\'') {
            inQuote = ch;
            continue;
        }
        if (ch === '>') {
            return i;
        }
    }
    return -1;
}

/**
 * findClosing function.
 *
 * @param {string} s - The s parameter.
 * @param {string} localName - The localName parameter.
 * @param {number} from - The from parameter.
 * @returns {number} - Returns the result.
 */
function findClosing(s: string, localName: string, from: number): number {
    // eslint-disable-next-line security/detect-non-literal-regexp -- RegExp built from escapeRegExp(localName) only
    const openPat: RegExp = new RegExp(`<([A-Za-z_][\\w.-]*:)?${escapeRegExp(localName)}(?=[\\s>/])`, 'g');
    // eslint-disable-next-line security/detect-non-literal-regexp -- RegExp built from escapeRegExp(localName) only
    const closePat: RegExp = new RegExp(`</([A-Za-z_][\\w.-]*:)?${escapeRegExp(localName)}\\s*>`, 'g');
    let depth: number = 1;
    let i: number = from;
    while (i < s.length && depth > 0) {
        openPat.lastIndex = i;
        closePat.lastIndex = i;
        const om: RegExpExecArray = openPat.exec(s);
        const cm: RegExpExecArray = closePat.exec(s);
        if (cm === null) {
            return -1;
        }
        if (om !== null && om.index < cm.index) {
            const tagEnd: number = findTagEnd(s, om.index);
            if (tagEnd >= 0) {
                const tag: string = s.slice(om.index, tagEnd + 1);
                if (!/\/\s*>$/.test(tag)) {
                    depth += 1;
                }
                i = tagEnd + 1;
                continue;
            }
        }
        depth -= 1;
        if (depth === 0) {
            return cm.index + cm[0].length;
        }
        i = cm.index + cm[0].length;
    }
    return -1;
}

/**
 * elementLocalName function.
 *
 * @param {string} el - The el parameter.
 * @returns {string} - Returns the result.
 */
function elementLocalName(el: string): string {
    // eslint-disable-next-line security/detect-unsafe-regex -- fixed OOXML/token grammar literal
    const m: RegExpExecArray = /^<([A-Za-z_][\w.-]*:)?([A-Za-z_][\w.-]*)/.exec(el.trim());
    return ((__t: string): string => (__t != null ? __t : ''))(m == null ? undefined : m[2]);
}

/**
 * elementInner function.
 *
 * @param {string} el - The el parameter.
 * @returns {string} - Returns the result.
 */
function elementInner(el: string): string {
    const trimmed: string = el.trim();
    if (/\/>$/.test(trimmed)) {
        return '';
    }
    const openEnd: number = findTagEnd(trimmed, 0);
    if (openEnd < 0) {
        return '';
    }
    const closeStart: number = trimmed.lastIndexOf('</');
    if (closeStart < 0 || closeStart <= openEnd) {
        return '';
    }
    return trimmed.slice(openEnd + 1, closeStart);
}

/**
 * escapeRegExp function.
 *
 * @param {string} value - The value parameter.
 * @returns {string} - Returns the result.
 */
function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
