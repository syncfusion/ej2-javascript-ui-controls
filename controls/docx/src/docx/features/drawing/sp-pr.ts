/**
 * `wps:spPr` fill/line/geometry codec (TASK-8048).
 *
 * Schema cites (transitional `dml-main.xsd`; ECMA-376-1 §20.1):
 * - `CT_ShapeProperties` sequence: `a:xfrm`, `EG_Geometry` (`custGeom` |
 *   `prstGeom`), `EG_FillProperties`, `a:ln`, `EG_EffectProperties`, `scene3d`,
 *   `sp3d`, `extLst`
 * - `CT_PresetGeometry2D`: `@prst` (`ST_ShapeType`) + `a:avLst` child
 * - `CT_NoFillProperties` (empty); `CT_SolidColorFillProperties` (single
 *   `EG_ColorChoice` child — `a:srgbClr` here)
 * - `CT_LineProperties` sequence: `EG_LineFillProperties`, `EG_LineDashProperties`
 *   (`a:prstDash @val` `ST_PresetLineDashVal`), `EG_LineJoinProperties`,
 *   `a:headEnd`/`a:tailEnd` (`CT_LineEndProperties` `@type` `ST_LineEndType`);
 *   `@w` (`ST_LineWidth` EMU 0…20116800), `@cap` (`ST_LineCap`)
 * - `a:headEnd`/`a:tailEnd` arrow types are schema tokens (`ST_LineEndType`).
 *   ShapeRequirements Arrow Settings (begin/end type + size) maps to these;
 *   sizes (`sm|med|lg`) are residual-OK for MVP but the type enums are modeled.
 * - `wps:style` `lnRef`/`fillRef`/`effectRef`/`fontRef` — theme formatting is
 *   **residual**: getters return `undefined`/`'theme'` discriminant instead of
 *   inventing solid colors (GO: don't invent theme resolution).
 *
 * Unknown fill kinds (`gradFill`, `blipFill`, `pattFill`, `grpFill`) and effect
 * siblings (`effectLst`, `scene3d`, `sp3d`) stay residual — GO Q9 deferred.
 *
 * @packageDocumentation
 */
import { Emus } from '../document/length';
import { enumValues } from '../../core/compat/object-compat';
import { DocxError } from '../../core/errors/docx-error';
import { OpenXmlAttribute, OpenXmlElement } from '../../core/xml/index';
import { isStShapeType } from './shape-types';
import { A_NS, WPS_NS } from './host-codec';
import { OpenXmlChild } from '../../core/xml/model';
/**
 * DrawingML line preset dash (`ST_PresetLineDashVal` / `a:prstDash/@val`).
 *
 * Members are schema wire tokens. Prefer these constants over raw strings.
 *
 * @public
 */
/**
 * DrawingML line dash style for public LineFormat APIs.
 *
 * Preset members match `ST_PresetLineDashVal` / `a:prstDash/@val` wire tokens.
 * `Unknown` is model-only (custom dash, residual, or unrecognized). Never
 * serialize `Unknown` as `a:prstDash/@val`.
 *
 * @public
 */
export enum LineDashing {
    Solid = 'solid',
    Dot = 'dot',
    Dash = 'dash',
    LargeDash = 'lgDash',
    DashDot = 'dashDot',
    LargeDashDot = 'lgDashDot',
    LargeDashDotDot = 'lgDashDotDot',
    SystemDash = 'sysDash',
    SystemDot = 'sysDot',
    SystemDashDot = 'sysDashDot',
    SystemDashDotDot = 'sysDashDotDot',
    Unknown = 'unknown'
}


/**
 * Closed set of public LineDashing values.
 * @public
 */
export const LINE_DASHING_VALUES: ReadonlyArray<LineDashing> = enumValues<LineDashing>(LineDashing);

/**
 * Wire tokens for `a:prstDash/@val` (excludes model-only Unknown).
 *
 * @private
 */
const PRESET_LINE_DASH_WIRE_VALUES: ReadonlyArray<string> = LINE_DASHING_VALUES.filter(
    function (v: 'dash' | 'dot' | 'unknown' | 'solid' | 'lgDash' | 'dashDot' | 'lgDashDot' | 'lgDashDotDot' | 'sysDash' | 'sysDot' | 'sysDashDot' | 'sysDashDotDot'): boolean {
        return v !== LineDashing.Unknown;
    }
);

const LINE_DASHING_SET: ReadonlySet<string> = new Set(LINE_DASHING_VALUES);
const PRESET_LINE_DASH_WIRE_SET: ReadonlySet<string> = new Set(PRESET_LINE_DASH_WIRE_VALUES);

/**
 * Whether `value` is a public LineDashing token (including Unknown).
 *
 * @param {string} value - The value.
 * @returns {*} The result.
 * @private
 */
export function isLineDashing(value: string): value is LineDashing {
    return LINE_DASHING_SET.has(value);
}

/**
 * Whether `value` is a schema `ST_PresetLineDashVal` wire token.
 *
 * @param {string} value - The value.
 * @returns {boolean} The result.
 * @private
 */
function isPresetLineDashWire(value: string): boolean {
    return PRESET_LINE_DASH_WIRE_SET.has(value);
}

/**
 * Specifies how open line ends are capped (`ST_LineCap` / `a:ln/@cap`).
 *
 * Prefer these constants over raw strings when setting line cap style.
 *
 * @public
 */
export enum LineCap {
    /**
     * Round cap at each open end of the stroke.
     * @public
     */
    Round = 'rnd',
    /**
     * Square cap extending half the line width past each open end.
     * @public
     */
    Square = 'sq',
    /**
     * Flat cap that ends exactly at the line endpoint.
     * @public
     */
    Flat = 'flat'
}


/**
 * Closed set of `ST_LineCap` wire tokens.
 * @public
 */
export const LINE_CAP_VALUES: ReadonlyArray<LineCap> = enumValues<LineCap>(LineCap);

/**
 * Specifies the arrowhead shape drawn at the beginning or end of a line
 * (`ST_LineEndType` / `a:headEnd|a:tailEnd/@type`).
 *
 * Prefer these constants over raw strings when setting line end type.
 *
 * @public
 */
export enum LineEndType {
    /**
     * No arrowhead at the line end.
     * @public
     */
    None = 'none',
    /**
     * Filled triangular arrowhead.
     * @public
     */
    Triangle = 'triangle',
    /**
     * Stealth (indented) arrowhead.
     * @public
     */
    Stealth = 'stealth',
    /**
     * Diamond-shaped line end marker.
     * @public
     */
    Diamond = 'diamond',
    /**
     * Oval line end marker.
     * @public
     */
    Oval = 'oval',
    /**
     * Open arrowhead.
     * @public
     */
    Arrow = 'arrow'
}


/**
 * Closed set of `ST_LineEndType` wire tokens.
 * @public
 */
export const LINE_END_TYPE_VALUES: ReadonlyArray<LineEndType> = enumValues<LineEndType>(LineEndType);

/**
 * DrawingML arrow end size tokens (`ST_LineEndWidth` / `ST_LineEndLength`).
 * @public
 */
export const LINE_END_SIZE_VALUES: ReadonlyArray<'sm' | 'med' | 'lg'> = ['sm', 'med', 'lg'] as ReadonlyArray<'sm' | 'med' | 'lg'>;

/**
 * DrawingML arrow end size (`sm` | `med` | `lg`).
 * @public
 */
export type LineEndSize = (typeof LINE_END_SIZE_VALUES)[number];

/**
 * Shape line fill kind discriminant (`EG_LineFillProperties` MVP).
 *
 * Members are model tokens (not a single XSD enum). Prefer these constants
 * over raw strings when authoring {@link ShapeLine}.
 *
 * @public
 */
export enum ShapeLineKind {
    Solid = 'solid',
    None = 'none',
    Theme = 'theme',
    Unknown = 'unknown'
}


const LINE_CAP_SET: ReadonlySet<string> = new Set(LINE_CAP_VALUES);
const LINE_END_TYPE_SET: ReadonlySet<string> = new Set(LINE_END_TYPE_VALUES);
const LINE_END_SIZE_SET: ReadonlySet<string> = new Set(LINE_END_SIZE_VALUES);
/** Schema max for `ST_LineWidth` (`ST_Coordinate32Unqualified` ≤ 20116800). */
const LINE_WIDTH_MAX_EMU: number = 20116800;

/**
 * Whether `value` is a schema `ST_LineCap` token.
 *
 * @param {string} value - The value.
 * @returns {*} The result.
 * @private
 */
export function isLineCap(value: string): value is LineCap {
    return LINE_CAP_SET.has(value);
}
/**
 * Whether `value` is a schema `ST_LineEndType` token.
 *
 * @param {string} value - The value.
 * @returns {*} The result.
 * @private
 */
export function isLineEndType(value: string): value is LineEndType {
    return LINE_END_TYPE_SET.has(value);
}
/**
 * Whether `value` is a schema `ST_LineEndWidth`/`ST_LineEndLength` token.
 *
 * @param {string} value - The value.
 * @returns {*} The result.
 * @private
 */
export function isLineEndSize(value: string): value is LineEndSize {
    return LINE_END_SIZE_SET.has(value);
}
/**
 * Shape fill model (`EG_FillProperties` MVP subset).
 *
 * Discriminated by `kind`:
 * - `solid` — explicit `a:solidFill` with six-digit sRGB
 * - `none` — `a:noFill`
 * - `theme` — theme reference only (`wps:style` / non-sRGB color choice); not resolved
 * - `pattern` — residual `a:pattFill` (preset token when present)
 * - `unknown` — other residual fill kinds (`gradFill`, `blipFill`, `grpFill`, …)
 *
 * Only `solid` and `none` are authorable on {@link ShapeOptions.fill}.
 *
 * @public
 */
export type ShapeFill = {
    readonly kind: 'solid';
    readonly srgb: string;
    /**
     * DrawingML `a:alpha/@val` (0…100000 = 0%…100% opacity).
     * Omitted means fully opaque.
     * @private
     */
    readonly alpha?: number | undefined;
} | {
    readonly kind: 'none';
} | {
    readonly kind: 'theme';
} | {
    readonly kind: 'pattern';
    readonly preset: string | undefined;
} | {
    readonly kind: 'unknown';
};
/**
 * Shape line model (`CT_LineProperties` MVP subset).
 *
 * Discriminated by {@link ShapeLine.kind}. Only `solid` and `none` are
 * authorable on {@link ShapeOptions.line}. Theme and unknown paths preserve
 * residual markup without inventing colors or dash styles.
 *
 * Arrow begin/end types map to `a:headEnd`/`a:tailEnd` (`ST_LineEndType`).
 * Dash maps to `a:prstDash` (`ST_LineDashingVal`); custom dash stays residual.
 *
 * @public
 */
export interface ShapeLine {
    /**
     * Line fill kind (`solid` | `none` | `theme` | `unknown`).
     * Prefer {@link ShapeLineKind} constants when authoring.
     */
    readonly kind: ShapeLineKind;
    /**
     * `a:ln/@w` width in EMU (`ST_LineWidth`, 0…20116800).
     *
     * @private
     */
    readonly widthEmu: Emus | undefined;
    /** `a:ln/a:solidFill/a:srgbClr/@val` when line is solid (six hex digits). */
    readonly srgbColor: string | undefined;
    /**
     * DrawingML `a:alpha/@val` under line solid fill (0…100000 opacity).
     * @private
     */
    readonly alpha: number | undefined;
    /** `a:ln/a:prstDash/@val` (`ST_LineDashingVal`). Prefer {@link LineDashing}. */
    readonly dash: LineDashing | undefined;
    /** `a:ln/@cap` (`ST_LineCap`). Prefer {@link LineCap}. */
    readonly cap: LineCap | undefined;
    /** `a:ln/a:headEnd/@type` (`ST_LineEndType`). Prefer {@link LineEndType}. */
    readonly beginArrowType: LineEndType | undefined;
    /** `a:ln/a:headEnd/@w` (`ST_LineEndWidth`). */
    readonly beginArrowSize: LineEndSize | undefined;
    /** `a:ln/a:tailEnd/@type` (`ST_LineEndType`). Prefer {@link LineEndType}. */
    readonly endArrowType: LineEndType | undefined;
    /** `a:ln/a:tailEnd/@w` (and length when paired; see OOXML mapping). */
    readonly endArrowSize: LineEndSize | undefined;
    /**
     * True when residual line markup is present (`a:custDash`, unmodeled join, …)
     * and the line is not fully represented by the typed fields.
     *
     * @private
     */
    readonly residual: boolean;
}
/**
 * @private
 * Geometry + fill + line state read from `wps:spPr`. */
export interface ShapePropertiesState {
    /** `a:prstGeom/@prst` (validated ST_ShapeType); `custGeom` reads `undefined`. */
    readonly presetGeometry: string | undefined;
    readonly useCustomGeometry: boolean;
    readonly fill: ShapeFill | undefined;
    readonly line: ShapeLine | undefined;
    /** Theme formatting present (`wps:style` sibling). */
    readonly hasThemeStyle: boolean;
}
function elementChildren(el: OpenXmlElement): ReadonlyArray<OpenXmlElement> {
    return el.children.filter((c: OpenXmlChild): c is OpenXmlElement => c.kind === 'element');
}
function isElement(el: OpenXmlElement, namespaceUri: string, localName: string): boolean {
    return el.namespaceUri === namespaceUri && el.localName === localName;
}
/**
 * Shallow child lookup under `root` (direct element children only).
 * Use for children of a known `wps:spPr` or `a:ln` parent.
 *
 * @param {OpenXmlElement} root - The root.
 * @param {string} namespaceUri - The namespace uri.
 * @param {string} localName - The local name.
 * @returns {OpenXmlElement | undefined} The result.
 * @private
 */
export function findSpPrElement(root: OpenXmlElement, namespaceUri: string, localName: string): OpenXmlElement | undefined {
    for (const child of elementChildren(root)) {
        if (isElement(child, namespaceUri, localName)) {
            return child;
        }
    }
    return undefined;
}
/**
 * Deep first-match walker under `root` (including `root` itself).
 * Local to this module so residual dual-AC hosts can be searched without a
 * circular import on host-codec `findFirstElement`.
 *
 * @param {OpenXmlElement} root - The root.
 * @param {string} namespaceUri - The namespace uri.
 * @param {string} localName - The local name.
 * @returns {OpenXmlElement | undefined} The result.
 */
function findDeepElement(root: OpenXmlElement, namespaceUri: string, localName: string): OpenXmlElement | undefined {
    if (isElement(root, namespaceUri, localName)) {
        return root;
    }
    for (const child of elementChildren(root)) {
        const found: OpenXmlElement = findDeepElement(child, namespaceUri, localName);
        if (found !== undefined) {
            return found;
        }
    }
    return undefined;
}
/** s:ST_HexColorRGB — six hex digits. */
const HEX6: RegExp = /^[0-9a-fA-F]{6}$/;
/**
 * Read the sRGB color from a `CT_SolidColorFillProperties` (or `a:ln` fill).
 * Only `a:srgbClr` is typed (GO MVP); other `EG_ColorChoice` members read as
 * theme-ish `undefined` so the typed surface never invents values.
 *
 * @param {OpenXmlElement} parent - The parent.
 * @returns {string | undefined} The result.
 * @private
 */
export function solidFillSrgb(parent: OpenXmlElement): string | undefined {
    let ts330: any;
    const srgb: OpenXmlElement = findSpPrElement(parent, A_NS, 'srgbClr');
    if (srgb === undefined) {
        return undefined;
    }
    const val: string = ((ts330 = srgb.attributes.find((a: OpenXmlAttribute) => a.namespaceUri === '' && a.localName === 'val')), ts330 == null ? undefined : ts330.value);
    return val !== undefined && HEX6.test(val) ? val.toLowerCase() : undefined;
}
/**
 * Read DrawingML `a:alpha/@val` under a solid-fill parent (0…100000 opacity units).
 *
 * @param {OpenXmlElement} parent - The parent.
 * @returns {number | undefined} The result.
 * @private
 */
export function solidFillAlpha(parent: OpenXmlElement): number | undefined {
    let ts33a: any;
    const srgb: OpenXmlElement = findSpPrElement(parent, A_NS, 'srgbClr');
    if (srgb === undefined) {
        return undefined;
    }
    const alpha: OpenXmlElement = findSpPrElement(srgb, A_NS, 'alpha');
    if (alpha === undefined) {
        return undefined;
    }
    const raw: string = ((ts33a = alpha.attributes.find((a: OpenXmlAttribute) => a.namespaceUri === '' && a.localName === 'val')), ts33a == null ? undefined : ts33a.value);
    if (raw === undefined || !/^\d+$/.test(raw)) {
        return undefined;
    }
    const n: number = Number.parseInt(raw, 10);
    return n >= 0 && n <= 100000 ? n : undefined;
}
/**
 * Convert public transparency percent (0–100) to DrawingML alpha (0–100000 opacity).
 *
 * @param {number} transparency - The transparency.
 * @returns {number} The result.
 * @private
 */
export function transparencyToAlpha(transparency: number): number {
    const t: number = Math.max(0, Math.min(100, transparency));
    return Math.round((100 - t) * 1000);
}
/**
 * Convert DrawingML alpha (0–100000 opacity) to public transparency percent (0–100).
 *
 * @param {number | undefined} alpha - The alpha.
 * @returns {number} The result.
 * @private
 */
export function alphaToTransparency(alpha: number | undefined): number {
    if (alpha === undefined) {
        return 0;
    }
    const a: number = Math.max(0, Math.min(100000, alpha));
    return Math.round(100 - a / 1000);
}
/**
 * Read `wps:spPr` geometry/fill/line MVP state.
 *
 * Residual hosts are dual MC AlternateContent trees (`w:drawing` /
 * `mc:AlternateContent` / `mc:Choice` / `wp:anchor` / `a:graphic` /
 * `wps:wsp`), so `wps:spPr` and sibling `wps:style` are located with a deep
 * walk. Children of the found `spPr` stay shallow.
 *
 * Cites: `CT_ShapeProperties` sequence + `EG_FillProperties`/`CT_LineProperties`
 * (dml-main.xsd); `wps:style` residual theme formatting (CT_ShapeStyle).
 *
 * @param {OpenXmlElement} residual - The residual.
 * @returns {ShapePropertiesState} The result.
 * @private
 */
export function readShapePropertiesState(residual: OpenXmlElement): ShapePropertiesState {
    let ts331: any;
    const spPr: OpenXmlElement = findDeepElement(residual, WPS_NS, 'spPr');
    if (spPr === undefined) {
        return {
            presetGeometry: undefined,
            useCustomGeometry: false,
            fill: undefined,
            line: undefined,
            hasThemeStyle: false
        };
    }
    const prstGeom: OpenXmlElement = findSpPrElement(spPr, A_NS, 'prstGeom');
    const custGeom: OpenXmlElement = findSpPrElement(spPr, A_NS, 'custGeom');
    const prstRaw: string = prstGeom !== undefined
        ? (((ts331 = prstGeom.attributes.find((a: OpenXmlAttribute) => a.namespaceUri === '' && a.localName === 'prst')), ts331 == null ? undefined : ts331.value))
        : undefined;
    const presetGeometry: string = prstRaw !== undefined && isStShapeType(prstRaw) ? prstRaw : undefined;
    const fill: ShapeFill = parseFill(spPr);
    const line: ShapeLine = parseLine(spPr, findSpPrElement(spPr, A_NS, 'ln'));
    const hasThemeStyle: boolean = findDeepElement(residual, WPS_NS, 'style') !== undefined;
    return {
        presetGeometry,
        useCustomGeometry: prstGeom === undefined && custGeom !== undefined,
        fill,
        line,
        hasThemeStyle
    };
}
function parseFill(spPr: OpenXmlElement): ShapeFill | undefined {
    let ts332: any;
    if (findSpPrElement(spPr, A_NS, 'noFill') !== undefined) {
        return { kind: 'none' };
    }
    const solid: OpenXmlElement = findSpPrElement(spPr, A_NS, 'solidFill');
    if (solid !== undefined) {
        const srgb: string = solidFillSrgb(solid);
        if (srgb === undefined) {
            return { kind: 'theme' };
        }
        const alpha: number = solidFillAlpha(solid);
        return alpha !== undefined
            ? { kind: 'solid', srgb, alpha }
            : { kind: 'solid', srgb };
    }
    if (findSpPrElement(spPr, A_NS, 'pattFill') !== undefined) {
        const patt: OpenXmlElement = findSpPrElement(spPr, A_NS, 'pattFill');
        const prst: string = patt !== undefined
            ? (((ts332 = patt.attributes.find((a: OpenXmlAttribute) => a.namespaceUri === '' && a.localName === 'prst')), ts332 == null ? undefined : ts332.value))
            : undefined;
        return { kind: 'pattern', preset: prst };
    }
    // gradFill / blipFill / grpFill are residual by GO; unmodeled → undefined.
    return undefined;
}
function parseLineEnd(parent: OpenXmlElement, localName: 'headEnd' | 'tailEnd'): {
    readonly type: LineEndType | undefined;
    readonly size: LineEndSize | undefined;
} {
    let ts333: any; let ts334: any;
    const el: OpenXmlElement = findSpPrElement(parent, A_NS, localName);
    if (el === undefined) {
        return { type: undefined, size: undefined };
    }
    const typeRaw: string = ((ts333 = el.attributes.find((a: OpenXmlAttribute) => a.namespaceUri === '' && a.localName === 'type')), ts333 == null ? undefined : ts333.value);
    const sizeRaw: string = ((ts334 = el.attributes.find((a: OpenXmlAttribute) => a.namespaceUri === '' && a.localName === 'w')), ts334 == null ? undefined : ts334.value);
    return {
        type: typeRaw !== undefined && isLineEndType(typeRaw) ? typeRaw : undefined,
        size: sizeRaw !== undefined && isLineEndSize(sizeRaw) ? sizeRaw : undefined
    };
}
function parseLine(spPr: OpenXmlElement, lnElement: OpenXmlElement | undefined): ShapeLine {
    let ts335: any; let ts336: any; let ts337: any;
    if (lnElement === undefined) {
        // Absent a:ln: line formatting is inherited from wps:style lnRef (theme) —
        // never invent a solid color.
        return {
            kind: ShapeLineKind.Theme,
            widthEmu: undefined,
            srgbColor: undefined,
            alpha: undefined,
            dash: undefined,
            cap: undefined,
            beginArrowType: undefined,
            beginArrowSize: undefined,
            endArrowType: undefined,
            endArrowSize: undefined,
            residual: false
        };
    }
    // noFill inside a:ln == no line (EG_LineFillProperties choice).
    const lnNoFill: boolean = findSpPrElement(lnElement, A_NS, 'noFill') !== undefined;
    const lnSolid: OpenXmlElement = findSpPrElement(lnElement, A_NS, 'solidFill');
    const kind: ShapeLine['kind'] = lnSolid !== undefined ? ShapeLineKind.Solid : ShapeLineKind.Theme;
    const widthRaw: string = ((ts335 = lnElement.attributes.find((a: OpenXmlAttribute) => a.namespaceUri === '' && a.localName === 'w')), ts335 == null ? undefined : ts335.value);
    const widthEmu: Emus = widthRaw !== undefined && /^\d+$/.test(widthRaw)
        ? (Number.parseInt(widthRaw, 10) as Emus)
        : undefined;
    const capRaw: string = ((ts336 = lnElement.attributes.find((a: OpenXmlAttribute) => a.namespaceUri === '' && a.localName === 'cap')), ts336 == null ? undefined : ts336.value);
    const dashEl: OpenXmlElement = findSpPrElement(lnElement, A_NS, 'prstDash');
    const dashRaw: string = dashEl !== undefined
        ? ((ts337 = dashEl.attributes.find((a: OpenXmlAttribute) => a.namespaceUri === '' && a.localName === 'val')), ts337 == null ? undefined : ts337.value) : undefined;
    const head: { readonly type: LineEndType; readonly size: LineEndSize; } = parseLineEnd(lnElement, 'headEnd');
    const tail: { readonly type: LineEndType; readonly size: LineEndSize; } = parseLineEnd(lnElement, 'tailEnd');
    const residual: boolean = findSpPrElement(lnElement, A_NS, 'custDash') !== undefined ||
        findSpPrElement(lnElement, A_NS, 'round') !== undefined ||
        findSpPrElement(lnElement, A_NS, 'bevel') !== undefined ||
        findSpPrElement(lnElement, A_NS, 'miter') !== undefined ||
        (dashEl !== undefined && dashRaw !== undefined && !isPresetLineDashWire(dashRaw));
    return {
        kind: lnNoFill ? ShapeLineKind.None : kind,
        widthEmu,
        srgbColor: lnSolid !== undefined ? solidFillSrgb(lnSolid) : undefined,
        alpha: lnSolid !== undefined ? solidFillAlpha(lnSolid) : undefined,
        dash: dashRaw !== undefined && isPresetLineDashWire(dashRaw) ? (dashRaw as LineDashing) : undefined,
        cap: capRaw !== undefined && isLineCap(capRaw) ? capRaw : undefined,
        beginArrowType: head.type,
        beginArrowSize: head.size,
        endArrowType: tail.type,
        endArrowSize: tail.size,
        residual
    };
}
function buildSrgbClr(val: string, alpha?: number | undefined): OpenXmlElement {
    const children: OpenXmlElement[] = [];
    if (alpha !== undefined && alpha >= 0 && alpha < 100000) {
        children.push({
            kind: 'element',
            namespaceUri: A_NS,
            localName: 'alpha',
            prefix: 'a',
            attributes: [
                { namespaceUri: '', localName: 'val', prefix: '', value: String(Math.round(alpha)) }
            ],
            namespaceDeclarations: [],
            children: []
        });
    }
    return {
        kind: 'element',
        namespaceUri: A_NS,
        localName: 'srgbClr',
        prefix: 'a',
        attributes: [
            { namespaceUri: '', localName: 'val', prefix: '', value: val.toLowerCase() }
        ],
        namespaceDeclarations: [],
        children
    };
}
function buildSolidFill(srgb: string, alpha?: number | undefined): OpenXmlElement {
    return {
        kind: 'element',
        namespaceUri: A_NS,
        localName: 'solidFill',
        prefix: 'a',
        attributes: [],
        namespaceDeclarations: [],
        children: [buildSrgbClr(srgb, alpha)]
    };
}
function buildNoFill(): OpenXmlElement {
    return {
        kind: 'element',
        namespaceUri: A_NS,
        localName: 'noFill',
        prefix: 'a',
        attributes: [],
        namespaceDeclarations: [],
        children: []
    };
}
/**
 * Build the fill element for modeled fill MVP. Throws on non-solid/none kinds
 * (those go through residual).
 *
 * @param {ShapeFill} fill - The fill.
 * @returns {OpenXmlElement} The result.
 * @private
 */
export function buildFillElement(fill: ShapeFill): OpenXmlElement {
    if (fill.kind === 'solid') {
        return buildSolidFill(fill.srgb, fill.alpha);
    }
    if (fill.kind === 'none') {
        return buildNoFill();
    }
    throw new DocxError('content/invalid-shape', `Only solid or noFill can be authored; kind "${String(fill.kind)}" is residual`);
}
function buildHeadTail(localName: 'headEnd' | 'tailEnd', type: LineEndType | undefined, size: LineEndSize | undefined): OpenXmlElement | undefined {
    if (type === undefined && size === undefined) {
        return undefined;
    }
    const attributes: OpenXmlAttribute[] = [];
    if (type !== undefined) {
        attributes.push({ namespaceUri: '', localName: 'type', prefix: '', value: type });
    }
    if (size !== undefined) {
        attributes.push({ namespaceUri: '', localName: 'w', prefix: '', value: size });
    }
    return {
        kind: 'element',
        namespaceUri: A_NS,
        localName,
        prefix: 'a',
        attributes,
        namespaceDeclarations: [],
        children: []
    };
}
/**
 * Build `a:ln` from the modeled MVP subset; residual line children (join,
 * custDash) are not re-emitted on this path.
 *
 * @param {Object} line - The line.
 * @returns {OpenXmlElement} The result.
 * @private
 */
export function buildLineElement(line: {
    readonly kind: 'solid' | 'none';
    readonly widthEmu?: Emus | undefined;
    readonly srgb?: string | undefined;
    readonly alpha?: number | undefined;
    readonly dash?: LineDashing | undefined;
    readonly cap?: LineCap | undefined;
    readonly beginArrowType?: LineEndType | undefined;
    readonly beginArrowSize?: LineEndSize | undefined;
    readonly endArrowType?: LineEndType | undefined;
    readonly endArrowSize?: LineEndSize | undefined;
}): OpenXmlElement {
    const attributes: OpenXmlAttribute[] = [];
    if (line.widthEmu !== undefined) {
        if (line.widthEmu < 0 || line.widthEmu > LINE_WIDTH_MAX_EMU) {
            throw new DocxError('content/invalid-shape', `Line width ${String(line.widthEmu)} EMU outside ST_LineWidth range 0…20116800`);
        }
        attributes.push({
            namespaceUri: '',
            localName: 'w',
            prefix: '',
            value: String(line.widthEmu)
        });
    }
    if (line.cap !== undefined) {
        attributes.push({ namespaceUri: '', localName: 'cap', prefix: '', value: line.cap });
    }
    const children: OpenXmlElement[] = [];
    if (line.kind === 'solid') {
        if (line.srgb === undefined) {
            throw new DocxError('content/invalid-shape', 'Solid line requires an sRGB color');
        }
        children.push(buildSolidFill(line.srgb, line.alpha));
    }
    else {
        children.push(buildNoFill());
    }
    if (line.dash !== undefined) {
        children.push({
            kind: 'element',
            namespaceUri: A_NS,
            localName: 'prstDash',
            prefix: 'a',
            attributes: [
                { namespaceUri: '', localName: 'val', prefix: '', value: line.dash }
            ],
            namespaceDeclarations: [],
            children: []
        });
    }
    const head: OpenXmlElement = buildHeadTail('headEnd', line.beginArrowType, line.beginArrowSize);
    if (head !== undefined) {
        children.push(head);
    }
    const tail: OpenXmlElement = buildHeadTail('tailEnd', line.endArrowType, line.endArrowSize);
    if (tail !== undefined) {
        children.push(tail);
    }
    return {
        kind: 'element',
        namespaceUri: A_NS,
        localName: 'ln',
        prefix: 'a',
        attributes,
        namespaceDeclarations: [],
        children
    };
}

/**
 * Compound line style for shape outlines (public model).
 * Single is the only modeled style in the current codec; other values stay residual-safe.
 * @public
 */
export enum LineStyle {
    Single = 'single'
}
/**
 * Arrowhead style at a line end. Maps 1:1 to DrawingML `ST_LineEndType`.
 * @public
 */
export enum ArrowheadStyle {
    None = 'none',
    Triangle = 'triangle',
    Stealth = 'stealth',
    Diamond = 'diamond',
    Oval = 'oval',
    Arrow = 'arrow'
}
/**
 * Arrowhead size (`ST_LineEndWidth` / `ST_LineEndLength`).
 * @public
 */
export enum ArrowheadSize {
    Small = 'sm',
    Medium = 'med',
    Large = 'lg'
}
