/**
 * Centralized built-in style catalog — immutable templates for every built-in
 * style the library recognizes, references, or requires.
 *
 * Design (the format specification §2):
 * - Templates are structured data (`BuiltinStyleTemplate`), never serialized
 *   XML strings — the serializer consumes the `DocxStyle` graph produced by
 *   {@link instantiateBuiltinStyle}.
 * - The catalog is built once at module load into frozen entries held in a
 *   `ReadonlyMap`; templates are shared but never mutated (deep-cloned on
 *   every instantiation).
 * - Formatting payloads reuse the modeled property subsets from
 * the owning module / the owning module (single source of truth for
 *   parse/serialize/clone) — no duplicate formatting models.
 *
 * Value sourcing (never-invent-OOXML, spec §2.5):
 * - `Normal`, `Heading1`, `Heading2` — normative, mandated by the requirement
 *   (spec §2.2–§2.4): Times New Roman 12 pt; Arial 16 pt bold / Arial 14 pt
 *   bold-italic, keepNext, spacing before 240 after 60, outlineLvl 0/1.
 * - Style ID ↔ display name and style *type* for every entry —
 *   `[MS-OI29500]` §2.1.238/§2.1.242 Word reserved built-in style name table
 *   (Word reserves these names with these types).
 * - Heading 3–9 shells (basedOn/next/qFormat/keepNext/240/60/outlineLvl)
 *   follow the mandated heading shell (spec §2.5) with the Word heading
 *   scale (Arial, bold, 13/12/11/11/11/11/11 pt per level).
 * - `DefaultParagraphFont`, `TableNormal`, `NoList`, `TableGrid`,
 *   `Hyperlink` — re-sourced from the shipped Word "Hello World" create-path
 * evidence (the owning module).
 * - Other character/paragraph defaults (`Strong` bold, `Emphasis` italic,
 *   reference styles superscript, `FollowedHyperlink` 800080 + single
 *   underline, `NoSpacing` suppresses doc-default spacing) — semantic
 *   defaults from the style names' documented meaning (ECMA-376-1 §17.7)
 *   encoded as the catalog's built-in default; a document's parsed
 *   definition always wins (spec §11.1).
 *
 * @private
 */

import { ownGet } from '../../core/compat/object-compat';
import { wmlAttr, wmlElement } from '../document/wml';
import { OpenXmlElement } from '../../core/xml/index';
import { EMPTY_MODELED_PARAGRAPH_PROPERTIES, serializeModeledParagraphProperties, ModeledParagraphProperties } from './paragraph-properties';
import { EMPTY_MODELED_RUN_PROPERTIES, serializeModeledRunProperties, ModeledRunProperties } from './run-properties';
import { DocxStyle, DocxStyleType } from './style';
import { OpenXmlAttribute, NamespaceDeclaration, OpenXmlChild } from '../../core/xml/model';
// ---------------------------------------------------------------------------
// Template structure
// ---------------------------------------------------------------------------
/**
 * One immutable built-in style template. Instances are created exclusively
 * via {@link instantiateBuiltinStyle}, which deep-clones every nested value.
 *
 * @private
 */
export interface BuiltinStyleTemplate {
    /** Canonical `w:styleId` (e.g. "Heading1"). */
    readonly styleId: string;
    /** Canonical `w:name/@w:val` display name (e.g. "Heading 1"). */
    readonly displayName: string;
    readonly type: DocxStyleType;
    /** `@w:default` — default style for its type. */
    readonly isDefault?: boolean;
    /** Canonical ID of the base style (`w:basedOn`). */
    readonly basedOn?: string;
    /** Canonical ID of the next-paragraph style (`w:next`). */
    readonly next?: string;
    /** Canonical ID of the linked style of the other type (`w:link`). */
    readonly link?: string;
    /** `w:uiPriority/@w:val`. */
    readonly uiPriority?: number;
    /** `w:qFormat` — quick-format (style gallery) state. */
    readonly isQuickFormat?: boolean;
    /** `w:semiHidden`. */
    readonly isSemiHidden?: boolean;
    /** `w:unhideWhenUsed`. */
    readonly unhideWhenUsed?: boolean;
    /** → `w:pPr` (only this style's own deltas; inheritance stays via basedOn). */
    readonly paragraphFormatting?: ModeledParagraphProperties;
    /** → `w:rPr`. */
    readonly characterFormatting?: ModeledRunProperties;
    /**
     * `w:tblPr` payload for table styles, carried as typed `wmlElement` parts
     * (the shipped create-path structure — see `TableStyleFormatting` note,
     * spec §2.1). Undefined for non-table styles.
     */
    readonly tableFormatting?: ReadonlyArray<OpenXmlElement>;
}
// ---------------------------------------------------------------------------
// Name normalization and identity
// ---------------------------------------------------------------------------
/**
 * Normalize a style name or ID for lookup: lowercase, collapse internal
 * whitespace, strip it entirely. "Heading 1", "heading1", "HEADING 1" all
 * normalize identically.
 *
 * @param {string} name - The name.
 * @returns {string} The result.
 * @private
 */
export function normalizeStyleName(name: string): string {
    return name.trim().toLowerCase().replace(/\s+/g, '');
}
// ---------------------------------------------------------------------------
// Template payloads (typed, per spec §2.2–§2.5)
// ---------------------------------------------------------------------------
/** `w:lang` values carried on the Normal style (spec §2.2). */
const NORMAL_LANG: { val: string; eastAsia: string; bidi: string; } = {
    val: 'en-US',
    eastAsia: 'zh-TW',
    bidi: 'ar-SA'
};
/**
 * `Normal` rPr payload — Times New Roman 12 pt (spec §2.2, normative).
 * Half-points: 12 pt → 24.
 */
const NORMAL_RPR: ModeledRunProperties = {
    ...EMPTY_MODELED_RUN_PROPERTIES,
    asciiFont: 'Times New Roman',
    hAnsiFont: 'Times New Roman',
    eastAsiaFont: 'Times New Roman',
    fontSize: (12),
    fontSizeCs: (12),
    lang: NORMAL_LANG
};
/**
 * `Normal` pPr payload — structural `w:spacing` (spec §2.2). The empty
 * spacing element carries defined semantic meaning ("no doc-default spacing
 * override on this style"), so it is serialized, not dropped.
 */
const NORMAL_PPR: ModeledParagraphProperties = {
    ...EMPTY_MODELED_PARAGRAPH_PROPERTIES,
    spacing: {}
};
/**
 * Shared heading shell pPr (spec §2.5): keepNext, before 240 / after 60
 * (twentieths of a point: 12 pt / 3 pt), outlineLvl per level.
 *
 * @param {number} outlineLevel - Specifies the outline level.
 * @returns {ModeledParagraphProperties} Returns the result.
 */
function headingPpr(outlineLevel: number): ModeledParagraphProperties {
    return {
        ...EMPTY_MODELED_PARAGRAPH_PROPERTIES,
        keepNext: true,
        spacing: { before: (12), after: (3) },
        outlineLevel
    };
}
/**
 * Heading rPr shell: Arial with ascii/hAnsi/cs attributes (spec §2.3/§2.4
 * — eastAsia omitted because the mandated definitions omit it; `kern` is
 * mandated on Heading 1 only; italic is carried on Heading 2 only — an
 * omitted property is `undefined`, never an explicit false).
 *
 * @param {number} size - Specifies the size.
 * @param {boolean} italic - Specifies the italic.
 * @param {boolean} kerning - Specifies the kerning.
 * @returns {ModeledRunProperties} Returns the result.
 */
function headingRpr(size: number, italic: boolean, kerning: boolean): ModeledRunProperties {
    return {
        ...EMPTY_MODELED_RUN_PROPERTIES,
        asciiFont: 'Arial',
        hAnsiFont: 'Arial',
        csFont: 'Arial',
        bold: true,
        boldCs: true,
        ...(italic ? { italic: true, italicCs: true } : {}),
        ...(kerning ? { kerning: (16) } : {}),
        fontSize: size,
        fontSizeCs: size
    };
}
/**
 * The Word heading scale (font sizes in points per level, evidence: the
 * mandated Heading1/Heading2 values 16/14 pt continuing Word's level scale).
 * Sizes: 16, 14, 13, 12, 12, 11, 11, 11, 11.
 */
const HEADING_SIZES: ReadonlyArray<number> = [16, 14, 13, 12, 12, 11, 11, 11, 11];
function headingTemplate(level: number): BuiltinStyleTemplate {
    let ts330: any;
    const size: number = ((ts330 = HEADING_SIZES[level - 1]), ts330 != null ? ts330 : 11);
    const levelText: string = String(level);
    return {
        styleId: `Heading${levelText}`,
        displayName: `Heading ${levelText}`,
        type: 'paragraph',
        basedOn: 'Normal',
        next: 'Normal',
        uiPriority: 9,
        isQuickFormat: true,
        paragraphFormatting: headingPpr(level - 1),
        characterFormatting: headingRpr((size), level === 2, level === 1)
    };
}
/**
 *  Reference character style shell: superscript (spec §1.4).
 *
 * @param {string} styleId - Specifies the style id.
 * @param {string} displayName - Specifies the display name.
 * @returns {BuiltinStyleTemplate} Returns the result.
 */
function referenceStyle(styleId: string, displayName: string): BuiltinStyleTemplate {
    return {
        styleId,
        displayName,
        type: 'character',
        basedOn: 'DefaultParagraphFont',
        uiPriority: 99,
        isSemiHidden: true,
        unhideWhenUsed: true,
        characterFormatting: { ...EMPTY_MODELED_RUN_PROPERTIES, vertAlign: 'superscript' }
    };
}
/**
 *  Note text style shell (footnote/endnote/comment text).
 *
 * @param {string} styleId - Specifies the style id.
 * @param {string} displayName - Specifies the display name.
 * @returns {BuiltinStyleTemplate} Returns the result.
 */
function noteTextStyle(styleId: string, displayName: string): BuiltinStyleTemplate {
    return {
        styleId,
        displayName,
        type: 'paragraph',
        basedOn: 'Normal',
        next: 'Normal',
        uiPriority: 99,
        isSemiHidden: true,
        unhideWhenUsed: true,
        paragraphFormatting: { ...EMPTY_MODELED_PARAGRAPH_PROPERTIES },
        characterFormatting: {
            ...EMPTY_MODELED_RUN_PROPERTIES,
            ...EMPTY_MODELED_RUN_PROPERTIES,
            fontSize: (10),
            fontSizeCs: (10)
        }
    };
}
/**
 * Table cell margin structure shared by `TableNormal`/`TableGrid` (shipped
 * create-path evidence, the owning module).
 *
 * @returns {OpenXmlElement[]} Returns the result.
 */
function tableNormalChildren(): OpenXmlElement[] {
    const tblInd: OpenXmlElement = wmlElement('tblInd', {
        attributes: [wmlAttr('w', '0'), wmlAttr('type', 'dxa')]
    });
    const cellMar: (side: string, width: string) => OpenXmlElement = (side: string, width: string): OpenXmlElement => wmlElement(side, { attributes: [wmlAttr('w', width), wmlAttr('type', 'dxa')] });
    const tblCellMar: OpenXmlElement = wmlElement('tblCellMar', {
        children: [
            cellMar('top', '0'),
            cellMar('left', '108'),
            cellMar('bottom', '0'),
            cellMar('right', '108')
        ]
    });
    return [wmlElement('tblPr', { children: [tblInd, tblCellMar] })];
}
/**
 *  `TableGrid` tblPr: single black sz=4 borders on all six sides.
 *
 * @returns {OpenXmlElement[]} Returns the result.
 */
function tableGridChildren(): OpenXmlElement[] {
    const tblInd: OpenXmlElement = wmlElement('tblInd', {
        attributes: [wmlAttr('w', '0'), wmlAttr('type', 'dxa')]
    });
    const border: (side: string) => OpenXmlElement = (side: string): OpenXmlElement => wmlElement(side, {
        attributes: [
            wmlAttr('val', 'single'),
            wmlAttr('sz', '4'),
            wmlAttr('space', '0'),
            wmlAttr('color', '000000')
        ]
    });
    const tblBorders: OpenXmlElement = wmlElement('tblBorders', {
        children: [
            border('top'),
            border('left'),
            border('bottom'),
            border('right'),
            border('insideH'),
            border('insideV')
        ]
    });
    return [wmlElement('tblPr', { children: [tblInd, tblBorders] })];
}

/**
 * Light Shading family: subtle theme/accent header row + light band shading.
 * Color may be a fixed RGB hex or a theme color token (`accent1`…`accent6`).
 *
 * @param {string} headerColor - Specifies the header color.
 * @param {string} bandColor - Specifies the band color.
 * @returns {OpenXmlElement[]} Returns the result.
 */
function lightShadingChildren(headerColor: string, bandColor: string): OpenXmlElement[] {
    const isTheme: boolean = headerColor.indexOf('accent') === 0;
    const border: (side: string) => OpenXmlElement = (side: string): OpenXmlElement => {
        const attrs: OpenXmlAttribute[] = [
            wmlAttr('val', 'single'),
            wmlAttr('sz', '4'),
            wmlAttr('space', '0')
        ];
        if (isTheme) {
            attrs.push(wmlAttr('themeColor', headerColor));
        } else {
            attrs.push(wmlAttr('color', headerColor));
        }
        return wmlElement(side, { attributes: attrs });
    };
    const tblBorders: OpenXmlElement = wmlElement('tblBorders', {
        children: [
            border('top'),
            border('left'),
            border('bottom'),
            border('right'),
            border('insideH'),
            border('insideV')
        ]
    });
    const headerShdAttrs: OpenXmlAttribute[] = isTheme
        ? [wmlAttr('val', 'clear'), wmlAttr('themeFill', headerColor)]
        : [wmlAttr('val', 'clear'), wmlAttr('fill', headerColor)];
    const bandShdAttrs: OpenXmlAttribute[] = [wmlAttr('val', 'clear'), wmlAttr('fill', bandColor)];
    const firstRow: OpenXmlElement = wmlElement('tblStylePr', {
        attributes: [wmlAttr('type', 'firstRow')],
        children: [
            wmlElement('tcPr', {
                children: [wmlElement('shd', { attributes: headerShdAttrs })]
            }),
            wmlElement('rPr', {
                children: [wmlElement('b'), wmlElement('color', {
                    attributes: [wmlAttr('val', 'FFFFFF')]
                })]
            })
        ]
    });
    const band1: OpenXmlElement = wmlElement('tblStylePr', {
        attributes: [wmlAttr('type', 'band1Horz')],
        children: [
            wmlElement('tcPr', {
                children: [wmlElement('shd', { attributes: bandShdAttrs })]
            })
        ]
    });
    return [
        wmlElement('tblPr', { children: [tblBorders] }),
        firstRow,
        band1
    ];
}

function lightShadingTemplate(
    styleId: string,
    displayName: string,
    headerColor: string,
    bandColor: string
): BuiltinStyleTemplate {
    return {
        styleId: styleId,
        displayName: displayName,
        type: 'table',
        basedOn: 'TableNormal',
        uiPriority: 60,
        isQuickFormat: true,
        tableFormatting: lightShadingChildren(headerColor, bandColor)
    };
}

/**
 * Specifies the built-in paragraph styles.
 *
 * Use these values with {@link Paragraph.applyStyle} instead of hard-coding style names.
 *
 * @public
 */
export enum BuiltInStyle {
    /** Specifies the normal style. */
    Normal = 'Normal',
    /** Specifies the heading1 style. */
    Heading1 = 'Heading1',
    /** Specifies the heading2 style. */
    Heading2 = 'Heading2'
}


/**
 * Specifies the built-in table styles.
 *
 * Use these values with {@link Table.applyStyle} instead of hard-coding style names.
 *
 * @public
 */
export enum BuiltinTableStyle {
    /** Specifies the table normal style. */
    TableNormal = 'TableNormal',
    /** Specifies the table grid style. */
    TableGrid = 'TableGrid',
    /** Specifies the light shading style. */
    LightShading = 'LightShading',
    /** Specifies the light shading accent1 style. */
    LightShadingAccent1 = 'LightShading-Accent1',
    /** Specifies the light shading accent2 style. */
    LightShadingAccent2 = 'LightShading-Accent2',
    /** Specifies the light shading accent3 style. */
    LightShadingAccent3 = 'LightShading-Accent3',
    /** Specifies the light shading accent4 style. */
    LightShadingAccent4 = 'LightShading-Accent4',
    /** Specifies the light shading accent5 style. */
    LightShadingAccent5 = 'LightShading-Accent5',
    /** Specifies the light shading accent6 style. */
    LightShadingAccent6 = 'LightShading-Accent6'
}

// ---------------------------------------------------------------------------
// The catalog (built once, frozen)
// ---------------------------------------------------------------------------
/**
 * Deep-freeze a template and every nested payload object so catalog entries
 * are fully immutable (spec §7). Formatted payloads are plain data; the
 * `wmlElement` table payloads are frozen shallowly (element trees are
 * structurally immutable by construction and cloned on instantiation).
 *
 * @param {BuiltinStyleTemplate} template - Specifies the template.
 * @returns {BuiltinStyleTemplate} Returns the result.
 */
function deepFreezeTemplate(template: BuiltinStyleTemplate): BuiltinStyleTemplate {
    const queue: unknown[] = [template];
    while (queue.length > 0) {
        const value: unknown = queue.pop();
        if (value === null || value === undefined || typeof value !== 'object' || Object.isFrozen(value)) {
            continue;
        }
        Object.freeze(value);
        // TS 3.3 / ES5 parity: avoid Object.values.
        const record: Record<string, unknown> = value as Record<string, unknown>;
        for (const key in record) {
            if (!Object.prototype.hasOwnProperty.call(record, key)) {
                continue;
            }
            const child: unknown = ownGet(record, key);
            if (child !== null && typeof child === 'object') {
                queue.push(child);
            }
        }
    }
    return template;
}
const RAW_TEMPLATES: ReadonlyArray<BuiltinStyleTemplate> = [
    // -- Mandatory / create-path (spec §1.2) --------------------------------
    {
        styleId: 'Normal',
        displayName: 'Normal',
        type: 'paragraph',
        isDefault: true,
        isQuickFormat: true,
        paragraphFormatting: NORMAL_PPR,
        characterFormatting: NORMAL_RPR
    },
    {
        styleId: 'DefaultParagraphFont',
        displayName: 'Default Paragraph Font',
        type: 'character',
        isDefault: true,
        uiPriority: 1,
        isSemiHidden: true,
        unhideWhenUsed: true
    },
    {
        styleId: 'TableNormal',
        displayName: 'Normal Table',
        type: 'table',
        isDefault: true,
        uiPriority: 99,
        isSemiHidden: true,
        unhideWhenUsed: true,
        tableFormatting: tableNormalChildren()
    },
    {
        styleId: 'NoList',
        displayName: 'No List',
        type: 'numbering',
        isDefault: true,
        uiPriority: 99,
        isSemiHidden: true,
        unhideWhenUsed: true
    },
    {
        styleId: 'TableGrid',
        displayName: 'Table Grid',
        type: 'table',
        basedOn: 'TableNormal',
        tableFormatting: tableGridChildren()
    },
    lightShadingTemplate('LightShading', 'Light Shading', '000000', 'E7E6E6'),
    lightShadingTemplate('LightShading-Accent1', 'Light Shading Accent 1', 'accent1', 'D6DCE4'),
    lightShadingTemplate('LightShading-Accent2', 'Light Shading Accent 2', 'accent2', 'F7D9C8'),
    lightShadingTemplate('LightShading-Accent3', 'Light Shading Accent 3', 'accent3', 'E2EFD9'),
    lightShadingTemplate('LightShading-Accent4', 'Light Shading Accent 4', 'accent4', 'FFF2CC'),
    lightShadingTemplate('LightShading-Accent5', 'Light Shading Accent 5', 'accent5', 'DDEBF7'),
    lightShadingTemplate('LightShading-Accent6', 'Light Shading Accent 6', 'accent6', 'FCE4D6'),
    {
        styleId: 'Hyperlink',
        displayName: 'Hyperlink',
        type: 'character',
        basedOn: 'DefaultParagraphFont',
        characterFormatting: {
            ...EMPTY_MODELED_RUN_PROPERTIES,
            color: '0000FF',
            underline: { kind: 'single', color: undefined }
        }
    },
    // -- Headings (spec §1.3; §2.3/§2.4 normative for 1/2) -------------------
    headingTemplate(1),
    headingTemplate(2),
    headingTemplate(3),
    headingTemplate(4),
    headingTemplate(5),
    headingTemplate(6),
    headingTemplate(7),
    headingTemplate(8),
    headingTemplate(9),
    // -- WordDocument structure paragraph styles --------------------------------
    {
        styleId: 'NoSpacing',
        displayName: 'No Spacing',
        type: 'paragraph',
        basedOn: 'Normal',
        next: 'Normal',
        uiPriority: 1,
        isQuickFormat: true,
        paragraphFormatting: { ...EMPTY_MODELED_PARAGRAPH_PROPERTIES, spacing: { after: (0), lineSpacing: (12), lineRule: 'auto' } }
    },
    {
        styleId: 'Title',
        displayName: 'Title',
        type: 'paragraph',
        basedOn: 'Normal',
        next: 'Normal',
        uiPriority: 10,
        isQuickFormat: true,
        paragraphFormatting: { ...EMPTY_MODELED_PARAGRAPH_PROPERTIES, spacing: { after: (0), lineSpacing: (12), lineRule: 'auto' } },
        characterFormatting: {
            ...EMPTY_MODELED_RUN_PROPERTIES,
            asciiFont: 'Calibri Light',
            hAnsiFont: 'Calibri Light',
            eastAsiaFont: 'Calibri Light',
            csFont: 'Calibri Light',
            fontSize: (28),
            fontSizeCs: (28),
            kerning: (14)
        }
    },
    {
        styleId: 'Subtitle',
        displayName: 'Subtitle',
        type: 'paragraph',
        basedOn: 'Normal',
        next: 'Normal',
        uiPriority: 11,
        isQuickFormat: true,
        characterFormatting: {
            ...EMPTY_MODELED_RUN_PROPERTIES,
            color: '595959',
            asciiFont: 'Calibri Light',
            hAnsiFont: 'Calibri Light',
            eastAsiaFont: 'Calibri Light',
            csFont: 'Calibri Light',
            fontSize: (12),
            fontSizeCs: (12),
            italic: true,
            italicCs: true
        }
    },
    {
        styleId: 'NormalWeb',
        displayName: 'Normal (Web)',
        // eslint-disable-next-line @typescript-eslint/prefer-as-const -- `as const` needs TypeScript 3.4+; this project compiles with 3.3
        type: 'paragraph' as 'paragraph',
        basedOn: 'Normal',
        uiPriority: 99,
        isSemiHidden: true,
        unhideWhenUsed: true,
        paragraphFormatting: { ...EMPTY_MODELED_PARAGRAPH_PROPERTIES, spacing: { before: (5), after: (5) } }
    },
    {
        styleId: 'HTMLPreformatted',
        displayName: 'HTML Preformatted',
        // eslint-disable-next-line @typescript-eslint/prefer-as-const -- `as const` needs TypeScript 3.4+; this project compiles with 3.3
        type: 'paragraph' as 'paragraph',
        basedOn: 'Normal',
        uiPriority: 99,
        isSemiHidden: true,
        unhideWhenUsed: true,
        characterFormatting: {
            ...EMPTY_MODELED_RUN_PROPERTIES,
            asciiFont: 'Courier New',
            hAnsiFont: 'Courier New',
            eastAsiaFont: 'Courier New',
            csFont: 'Courier New',
            fontSize: (10),
            fontSizeCs: (10)
        }
    },
    {
        styleId: 'BodyText',
        displayName: 'Body Text',
        type: 'paragraph',
        basedOn: 'Normal',
        next: 'Normal',
        uiPriority: 99,
        isSemiHidden: true,
        unhideWhenUsed: true
    },
    {
        styleId: 'BodyText2',
        displayName: 'Body Text 2',
        type: 'paragraph',
        basedOn: 'BodyText',
        next: 'BodyText',
        uiPriority: 99,
        isSemiHidden: true,
        unhideWhenUsed: true,
        characterFormatting: { ...EMPTY_MODELED_RUN_PROPERTIES, fontSize: (11), fontSizeCs: (11) }
    },
    {
        styleId: 'BodyText3',
        displayName: 'Body Text 3',
        type: 'paragraph',
        basedOn: 'BodyText',
        next: 'BodyText',
        uiPriority: 99,
        isSemiHidden: true,
        unhideWhenUsed: true,
        characterFormatting: { ...EMPTY_MODELED_RUN_PROPERTIES, fontSize: (10), fontSizeCs: (10) }
    },
    {
        styleId: 'Caption',
        displayName: 'Caption',
        type: 'paragraph',
        basedOn: 'Normal',
        next: 'Normal',
        uiPriority: 35,
        isQuickFormat: true,
        paragraphFormatting: { ...EMPTY_MODELED_PARAGRAPH_PROPERTIES, spacing: { after: (6), lineSpacing: (12), lineRule: 'auto' } },
        characterFormatting: {
            ...EMPTY_MODELED_RUN_PROPERTIES,
            color: '595959',
            italic: true,
            italicCs: true,
            fontSize: (9),
            fontSizeCs: (9)
        }
    },
    {
        styleId: 'Quote',
        displayName: 'Quote',
        type: 'paragraph',
        basedOn: 'Normal',
        next: 'Normal',
        uiPriority: 29,
        isQuickFormat: true,
        paragraphFormatting: { ...EMPTY_MODELED_PARAGRAPH_PROPERTIES, indentation: { left: (18), right: (18) } },
        characterFormatting: {
            ...EMPTY_MODELED_RUN_PROPERTIES,
            color: '595959',
            italic: true,
            italicCs: true
        }
    },
    {
        styleId: 'IntenseQuote',
        displayName: 'Intense Quote',
        type: 'paragraph',
        basedOn: 'Normal',
        next: 'Normal',
        uiPriority: 30,
        isQuickFormat: true,
        paragraphFormatting: { ...EMPTY_MODELED_PARAGRAPH_PROPERTIES, indentation: { left: (18), right: (18) } },
        characterFormatting: {
            ...EMPTY_MODELED_RUN_PROPERTIES,
            color: '595959',
            italic: true,
            italicCs: true
        }
    },
    {
        styleId: 'ListParagraph',
        displayName: 'List Paragraph',
        type: 'paragraph',
        basedOn: 'Normal',
        next: 'Normal',
        uiPriority: 34,
        isQuickFormat: true,
        paragraphFormatting: {
            ...EMPTY_MODELED_PARAGRAPH_PROPERTIES,
            contextualSpacing: true,
            indentation: { left: (18), hanging: (18) }
        }
    },
    // -- List paragraph styles (spec §1.3; numId never hard-wired, §1.6) ----
    {
        styleId: 'List',
        displayName: 'List',
        type: 'paragraph',
        basedOn: 'Normal',
        next: 'Normal',
        uiPriority: 99,
        isSemiHidden: true,
        unhideWhenUsed: true
    },
    {
        styleId: 'List2',
        displayName: 'List 2',
        type: 'paragraph',
        basedOn: 'List',
        next: 'List',
        uiPriority: 99,
        isSemiHidden: true,
        unhideWhenUsed: true,
        paragraphFormatting: { ...EMPTY_MODELED_PARAGRAPH_PROPERTIES, indentation: { left: (36) } }
    },
    {
        styleId: 'List3',
        displayName: 'List 3',
        type: 'paragraph',
        basedOn: 'List',
        next: 'List',
        uiPriority: 99,
        isSemiHidden: true,
        unhideWhenUsed: true,
        paragraphFormatting: { ...EMPTY_MODELED_PARAGRAPH_PROPERTIES, indentation: { left: (54) } }
    },
    {
        styleId: 'ListBullet',
        displayName: 'List Bullet',
        type: 'paragraph',
        basedOn: 'Normal',
        next: 'Normal',
        uiPriority: 99,
        isQuickFormat: true,
        paragraphFormatting: { ...EMPTY_MODELED_PARAGRAPH_PROPERTIES, indentation: { left: (36), hanging: (18) } }
    },
    {
        styleId: 'ListBullet2',
        displayName: 'List Bullet 2',
        type: 'paragraph',
        basedOn: 'ListBullet',
        next: 'ListBullet',
        uiPriority: 99,
        isSemiHidden: true,
        unhideWhenUsed: true,
        paragraphFormatting: { ...EMPTY_MODELED_PARAGRAPH_PROPERTIES, indentation: { left: (72), hanging: (18) } }
    },
    {
        styleId: 'ListBullet3',
        displayName: 'List Bullet 3',
        type: 'paragraph',
        basedOn: 'ListBullet',
        next: 'ListBullet',
        uiPriority: 99,
        isSemiHidden: true,
        unhideWhenUsed: true,
        paragraphFormatting: { ...EMPTY_MODELED_PARAGRAPH_PROPERTIES, indentation: { left: (108), hanging: (18) } }
    },
    {
        styleId: 'ListNumber',
        displayName: 'List Number',
        type: 'paragraph',
        basedOn: 'Normal',
        next: 'Normal',
        uiPriority: 99,
        isQuickFormat: true,
        paragraphFormatting: { ...EMPTY_MODELED_PARAGRAPH_PROPERTIES, indentation: { left: (36), hanging: (18) } }
    },
    {
        styleId: 'ListNumber2',
        displayName: 'List Number 2',
        type: 'paragraph',
        basedOn: 'ListNumber',
        next: 'ListNumber',
        uiPriority: 99,
        isSemiHidden: true,
        unhideWhenUsed: true,
        paragraphFormatting: { ...EMPTY_MODELED_PARAGRAPH_PROPERTIES, indentation: { left: (72), hanging: (18) } }
    },
    {
        styleId: 'ListNumber3',
        displayName: 'List Number 3',
        type: 'paragraph',
        basedOn: 'ListNumber',
        next: 'ListNumber',
        uiPriority: 99,
        isSemiHidden: true,
        unhideWhenUsed: true,
        paragraphFormatting: { ...EMPTY_MODELED_PARAGRAPH_PROPERTIES, indentation: { left: (108), hanging: (18) } }
    },
    // -- Header/footer/note text --------------------------------------------
    {
        styleId: 'Header',
        displayName: 'Header',
        type: 'paragraph',
        basedOn: 'Normal',
        next: 'Normal',
        uiPriority: 99,
        isSemiHidden: true,
        unhideWhenUsed: true,
        paragraphFormatting: {
            ...EMPTY_MODELED_PARAGRAPH_PROPERTIES,
            spacing: { after: (0), lineSpacing: (12), lineRule: 'auto' }
        },
        characterFormatting: { ...EMPTY_MODELED_RUN_PROPERTIES }
    },
    {
        styleId: 'Footer',
        displayName: 'Footer',
        type: 'paragraph',
        basedOn: 'Normal',
        next: 'Normal',
        uiPriority: 99,
        isSemiHidden: true,
        unhideWhenUsed: true,
        paragraphFormatting: {
            ...EMPTY_MODELED_PARAGRAPH_PROPERTIES,
            spacing: { after: (0), lineSpacing: (12), lineRule: 'auto' }
        },
        characterFormatting: { ...EMPTY_MODELED_RUN_PROPERTIES }
    },
    noteTextStyle('FootnoteText', 'Footnote Text'),
    noteTextStyle('EndnoteText', 'Endnote Text'),
    noteTextStyle('CommentText', 'Annotation Text'),
    // -- TOC -----------------------------------------------------------------
    {
        styleId: 'TOCHeading',
        displayName: 'TOC Heading',
        type: 'paragraph',
        basedOn: 'Heading1',
        next: 'Normal',
        uiPriority: 39,
        isSemiHidden: true,
        unhideWhenUsed: true,
        isQuickFormat: true
    },
    {
        styleId: 'TOC1',
        displayName: 'toc 1',
        type: 'paragraph',
        basedOn: 'Normal',
        next: 'Normal',
        uiPriority: 39,
        isSemiHidden: true,
        unhideWhenUsed: true,
        paragraphFormatting: { ...EMPTY_MODELED_PARAGRAPH_PROPERTIES, spacing: { after: (5) } }
    },
    {
        styleId: 'TOC2',
        displayName: 'toc 2',
        type: 'paragraph',
        basedOn: 'Normal',
        next: 'Normal',
        uiPriority: 39,
        isSemiHidden: true,
        unhideWhenUsed: true,
        paragraphFormatting: { ...EMPTY_MODELED_PARAGRAPH_PROPERTIES, indentation: { left: (11) } }
    },
    {
        styleId: 'TOC3',
        displayName: 'toc 3',
        type: 'paragraph',
        basedOn: 'Normal',
        next: 'Normal',
        uiPriority: 39,
        isSemiHidden: true,
        unhideWhenUsed: true,
        paragraphFormatting: { ...EMPTY_MODELED_PARAGRAPH_PROPERTIES, indentation: { left: (22) } }
    },
    {
        styleId: 'TOC4',
        displayName: 'toc 4',
        type: 'paragraph',
        basedOn: 'Normal',
        next: 'Normal',
        uiPriority: 39,
        isSemiHidden: true,
        unhideWhenUsed: true,
        paragraphFormatting: { ...EMPTY_MODELED_PARAGRAPH_PROPERTIES, indentation: { left: (33) } }
    },
    {
        styleId: 'TOC5',
        displayName: 'toc 5',
        type: 'paragraph',
        basedOn: 'Normal',
        next: 'Normal',
        uiPriority: 39,
        isSemiHidden: true,
        unhideWhenUsed: true,
        paragraphFormatting: { ...EMPTY_MODELED_PARAGRAPH_PROPERTIES, indentation: { left: (44) } }
    },
    {
        styleId: 'TOC6',
        displayName: 'toc 6',
        type: 'paragraph',
        basedOn: 'Normal',
        next: 'Normal',
        uiPriority: 39,
        isSemiHidden: true,
        unhideWhenUsed: true,
        paragraphFormatting: { ...EMPTY_MODELED_PARAGRAPH_PROPERTIES, indentation: { left: (55) } }
    },
    {
        styleId: 'TOC7',
        displayName: 'toc 7',
        type: 'paragraph',
        basedOn: 'Normal',
        next: 'Normal',
        uiPriority: 39,
        isSemiHidden: true,
        unhideWhenUsed: true,
        paragraphFormatting: { ...EMPTY_MODELED_PARAGRAPH_PROPERTIES, indentation: { left: (66) } }
    },
    {
        styleId: 'TOC8',
        displayName: 'toc 8',
        type: 'paragraph',
        basedOn: 'Normal',
        next: 'Normal',
        uiPriority: 39,
        isSemiHidden: true,
        unhideWhenUsed: true,
        paragraphFormatting: { ...EMPTY_MODELED_PARAGRAPH_PROPERTIES, indentation: { left: (77) } }
    },
    {
        styleId: 'TOC9',
        displayName: 'toc 9',
        type: 'paragraph',
        basedOn: 'Normal',
        next: 'Normal',
        uiPriority: 39,
        isSemiHidden: true,
        unhideWhenUsed: true,
        paragraphFormatting: { ...EMPTY_MODELED_PARAGRAPH_PROPERTIES, indentation: { left: (88) } }
    },
    // -- Character styles ----------------------------------------------------
    {
        styleId: 'FollowedHyperlink',
        displayName: 'Followed Hyperlink',
        type: 'character',
        basedOn: 'DefaultParagraphFont',
        uiPriority: 99,
        isSemiHidden: true,
        unhideWhenUsed: true,
        characterFormatting: {
            ...EMPTY_MODELED_RUN_PROPERTIES,
            color: '800080',
            underline: { kind: 'single', color: undefined }
        }
    },
    {
        styleId: 'Strong',
        displayName: 'Strong',
        type: 'character',
        basedOn: 'DefaultParagraphFont',
        uiPriority: 99,
        isSemiHidden: true,
        unhideWhenUsed: true,
        characterFormatting: { ...EMPTY_MODELED_RUN_PROPERTIES, bold: true, boldCs: true }
    },
    {
        styleId: 'Emphasis',
        displayName: 'Emphasis',
        type: 'character',
        basedOn: 'DefaultParagraphFont',
        uiPriority: 99,
        isSemiHidden: true,
        unhideWhenUsed: true,
        characterFormatting: { ...EMPTY_MODELED_RUN_PROPERTIES, italic: true, italicCs: true }
    },
    {
        styleId: 'IntenseEmphasis',
        displayName: 'Intense Emphasis',
        type: 'character',
        basedOn: 'DefaultParagraphFont',
        uiPriority: 99,
        isSemiHidden: true,
        unhideWhenUsed: true,
        characterFormatting: { ...EMPTY_MODELED_RUN_PROPERTIES, color: '0070C0' }
    },
    {
        styleId: 'SubtleEmphasis',
        displayName: 'Subtle Emphasis',
        type: 'character',
        basedOn: 'DefaultParagraphFont',
        uiPriority: 99,
        isSemiHidden: true,
        unhideWhenUsed: true,
        characterFormatting: { ...EMPTY_MODELED_RUN_PROPERTIES, color: '0070C0' }
    },
    {
        styleId: 'BookTitle',
        displayName: 'Book Title',
        type: 'character',
        basedOn: 'DefaultParagraphFont',
        uiPriority: 99,
        isSemiHidden: true,
        unhideWhenUsed: true,
        characterFormatting: {
            ...EMPTY_MODELED_RUN_PROPERTIES,
            asciiFont: 'Times New Roman',
            hAnsiFont: 'Times New Roman',
            eastAsiaFont: 'Times New Roman',
            csFont: 'Times New Roman',
            fontSize: (20),
            fontSizeCs: (20),
            kerning: (10),
            italic: true,
            italicCs: true
        }
    },
    referenceStyle('FootnoteReference', 'Footnote Reference'),
    referenceStyle('EndnoteReference', 'Endnote Reference'),
    referenceStyle('CommentReference', 'Annotation Reference')
];
const TEMPLATES: ReadonlyArray<BuiltinStyleTemplate> = Object.freeze(RAW_TEMPLATES.map(deepFreezeTemplate));
/**
 * The catalog: canonical ID → template. Built once at module load; entries
 * are frozen and shared immutably.
 */
const CATALOG: ReadonlyMap<string, BuiltinStyleTemplate> = new Map(
    TEMPLATES.map((template: BuiltinStyleTemplate): [string, BuiltinStyleTemplate] => [template.styleId, template])
);
/** Display-name lookup index (normalized). */
const CATALOG_BY_NAME: ReadonlyMap<string, BuiltinStyleTemplate> = new Map(
    TEMPLATES.map((template: BuiltinStyleTemplate): [string, BuiltinStyleTemplate] => [normalizeStyleName(template.displayName), template])
);
// ---------------------------------------------------------------------------
// Lookup API (internal — consumed by the resolver)
// ---------------------------------------------------------------------------
/**
 * Look up a template by canonical style ID.
 *
 * @param {string} styleId - The style id.
 * @returns {BuiltinStyleTemplate | undefined} The result.
 * @private
 */
export function getBuiltinStyleTemplate(styleId: string): BuiltinStyleTemplate | undefined {
    return CATALOG.get(styleId);
}
/**
 * Look up a template by display name (normalization applied).
 *
 * @param {string} name - The name.
 * @returns {BuiltinStyleTemplate | undefined} The result.
 * @private
 */
export function getBuiltinStyleTemplateByDisplayName(name: string): BuiltinStyleTemplate | undefined {
    return CATALOG_BY_NAME.get(normalizeStyleName(name));
}
/**
 * Canonical ID for any known built-in form: canonical ID itself, or the
 * canonical ID whose display name matches (normalized). `undefined` for
 * unknown values — no best-effort guessing.
 *
 * @param {string} nameOrId - The name or id.
 * @returns {string | undefined} The result.
 * @private
 */
export function canonicalBuiltinStyleId(nameOrId: string): string | undefined {
    let ts331: any;
    const direct: BuiltinStyleTemplate = CATALOG.get(nameOrId);
    if (direct !== undefined) {
        return direct.styleId;
    }
    return ((ts331 = CATALOG_BY_NAME.get(normalizeStyleName(nameOrId))), ts331 == null ? undefined : ts331.styleId);
}
/**
 * Frozen snapshot for tests and tooling.
 *
 * @returns {ReadonlyArray<BuiltinStyleTemplate>} The result.
 * @private
 */
export function listBuiltinStyleTemplates(): ReadonlyArray<BuiltinStyleTemplate> {
    return TEMPLATES;
}
// ---------------------------------------------------------------------------
// Instantiation (deep clone into a document-owned DocxStyle)
// ---------------------------------------------------------------------------
function cloneCharacterFormatting(formatting: ModeledRunProperties | undefined): ModeledRunProperties | undefined {
    if (formatting === undefined) {
        return undefined;
    }
    return {
        ...formatting,
        ...(formatting.underline !== undefined
            ? { underline: { ...formatting.underline } }
            : {}),
        ...(formatting.lang !== undefined ? { lang: { ...formatting.lang } } : {})
    };
}
function cloneParagraphFormatting(formatting: ModeledParagraphProperties | undefined): ModeledParagraphProperties | undefined {
    if (formatting === undefined) {
        return undefined;
    }
    return {
        ...formatting,
        ...(formatting.spacing !== undefined ? { spacing: { ...formatting.spacing } } : {}),
        ...(formatting.indentation !== undefined
            ? { indentation: { ...formatting.indentation } }
            : {})
    };
}
function cloneOpenXmlChildren(children: ReadonlyArray<OpenXmlElement> | undefined): OpenXmlElement[] | undefined {
    if (children === undefined) {
        return undefined;
    }
    return children.map((child: OpenXmlElement) => cloneOpenXmlElement(child));
}
function cloneOpenXmlElement(element: OpenXmlElement): OpenXmlElement {
    return {
        ...element,
        attributes: element.attributes.map((attribute: OpenXmlAttribute) => ({ ...attribute })),
        namespaceDeclarations: element.namespaceDeclarations.map((nd: NamespaceDeclaration) => ({ ...nd })),
        children: element.children.map((child: OpenXmlChild) => child.kind === 'element' ? cloneOpenXmlElement(child) : { ...child })
    };
}
/**
 * Instantiate a catalog template as a document-owned `DocxStyle`: deep-clones
 * the shell fields and every nested formatting object into typed `wmlElement`
 * children (via the modeled payload serializers), sharing nothing with the
 * template, the catalog, or any other instantiation.
 *
 * Dependency styles (`basedOn`/`next`/`link`) are referenced by canonical ID
 * and resolved by the resolver, not here.
 *
 * @param {BuiltinStyleTemplate} template - The template.
 * @returns {DocxStyle} The result.
 * @private
 */
export function instantiateBuiltinStyle(template: BuiltinStyleTemplate): DocxStyle {
    const children: OpenXmlElement[] = [
        wmlElement('name', { attributes: [wmlAttr('val', template.displayName)] })
    ];
    if (template.basedOn !== undefined) {
        children.push(wmlElement('basedOn', { attributes: [wmlAttr('val', template.basedOn)] }));
    }
    if (template.next !== undefined) {
        children.push(wmlElement('next', { attributes: [wmlAttr('val', template.next)] }));
    }
    if (template.link !== undefined) {
        children.push(wmlElement('link', { attributes: [wmlAttr('val', template.link)] }));
    }
    if (template.uiPriority !== undefined) {
        children.push(wmlElement('uiPriority', { attributes: [wmlAttr('val', String(template.uiPriority))] }));
    }
    if (template.isSemiHidden !== undefined && template.isSemiHidden) {
        children.push(wmlElement('semiHidden'));
    }
    if (template.unhideWhenUsed !== undefined && template.unhideWhenUsed) {
        children.push(wmlElement('unhideWhenUsed'));
    }
    if (template.isQuickFormat !== undefined && template.isQuickFormat) {
        children.push(wmlElement('qFormat'));
    }
    const tableFormatting: OpenXmlElement[] = cloneOpenXmlChildren(template.tableFormatting);
    if (tableFormatting !== undefined) {
        children.push(...tableFormatting);
    }
    const paragraphFormatting: ModeledParagraphProperties = cloneParagraphFormatting(template.paragraphFormatting);
    const pPr: OpenXmlElement = paragraphFormatting === undefined
        ? undefined
        : serializeModeledParagraphProperties(paragraphFormatting);
    if (pPr !== undefined) {
        children.push(pPr);
    }
    const characterFormatting: ModeledRunProperties = cloneCharacterFormatting(template.characterFormatting);
    const rPr: OpenXmlElement = characterFormatting === undefined
        ? undefined
        : serializeModeledRunProperties(characterFormatting);
    if (rPr !== undefined) {
        children.push(rPr);
    }
    return new DocxStyle(template.styleId, template.type, template.isDefault,
    /* customStyle */ undefined, children);
}
