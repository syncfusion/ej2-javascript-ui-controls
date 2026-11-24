/**
 * `wps:bodyPr` text-body properties codec.
 *
 * Schema cites (transitional `dml-main.xsd` + `dml-wordprocessingDrawing.xsd`):
 * - `CT_TextBodyProperties` attributes: `rot`, `spcFirstLastPara`,
 *   `vertOverflow` (`ST_TextVertOverflowType`), `horzOverflow`
 *   (`ST_TextHorzOverflowType`), `vert` (`ST_TextVerticalType`), `wrap`
 *   (`ST_TextWrappingType` = `none|square` only), `lIns`/`tIns`/`rIns`/`bIns`
 *   (`ST_Coordinate32` EMU), `numCol`, `spcCol`, `rtlCol`, `fromWordArt`,
 *   `anchor` (`ST_TextAnchoringType`), `anchorCtr`, `forceAA`, `upright`
 *   (default false), `compatLnSpc`
 * - Sequence: `prstTxWarp?`, `EG_TextAutofit?` (`a:noAutofit` |
 *   `a:normAutofit` | `a:spAutoFit`), `scene3d?`, `EG_Text3D?`, `extLst?`
 * - `CT_TextNormalAutofit`: `@fontScale` (`ST_TextFontScalePercent` 1000…100000,
 *   default 100%), `@lnSpcReduction` (default 0%)
 * - Wire element: **`wps:bodyPr`** (type `a:CT_TextBodyProperties`); autofit
 *   children use the DrawingML `a:` namespace
 * - `CT_WordprocessingShape` (dml-wordprocessingDrawing): after `style?` /
 *   `extLst?` / `txbx|linkedTxbx?`, **`bodyPr` minOccurs=1**
 *
 * Unknown attrs and residual children (`prstTxWarp`, `scene3d`, Text3D,
 * `extLst`) stay residual — never invent OOXML.
 *
 * @packageDocumentation
 */
import { Emus, emuToPoint, pointToCoordinateEmus } from '../document/length';
import { DocxError } from '../../core/errors/docx-error';
import { OpenXmlAttribute, OpenXmlElement } from '../../core/xml/index';
import { A_NS, WPS_NS } from './host-codec';
import { OpenXmlChild } from '../../core/xml/model';
/**
 * DrawingML text anchoring (`ST_TextAnchoringType`).
 *
 * @private
 */
export const TEXT_ANCHORING_VALUES: string[] = ['t', 'ctr', 'b', 'just', 'dist'];
/**
 * DrawingML text anchoring token.
 *
 * @private
 */
export type TextAnchoring = (typeof TEXT_ANCHORING_VALUES)[number];
/**
 * DrawingML vertical text overflow (`ST_TextVertOverflowType`).
 *
 * @private
 */
export const TEXT_VERT_OVERFLOW_VALUES: string[] = ['overflow', 'ellipsis', 'clip'];
/**
 * DrawingML vertical text overflow token.
 *
 * @private
 */
export type TextVertOverflow = (typeof TEXT_VERT_OVERFLOW_VALUES)[number];
/**
 * DrawingML horizontal text overflow (`ST_TextHorzOverflowType`).
 *
 * @private
 */
export const TEXT_HORZ_OVERFLOW_VALUES: string[] = ['overflow', 'clip'];
/**
 * DrawingML horizontal text overflow token.
 *
 * @private
 */
export type TextHorzOverflow = (typeof TEXT_HORZ_OVERFLOW_VALUES)[number];
/**
 * DrawingML text vertical type (`ST_TextVerticalType`).
 *
 * @private
 */
export const TEXT_VERTICAL_TYPE_VALUES: string[] = [
    'horz',
    'vert',
    'vert270',
    'wordArtVert',
    'eaVert',
    'mongolianVert',
    'wordArtVertRtl'
];
/**
 * DrawingML text vertical type token.
 *
 * @private
 */
export type TextVerticalType = (typeof TEXT_VERTICAL_TYPE_VALUES)[number];
/**
 * DrawingML text wrapping inside the shape (`ST_TextWrappingType`).
 * Schema allows **`none` | `square` only**.
 *
 * @private
 */
export const TEXT_BODY_WRAP_VALUES: string[] = ['none', 'square'];
/**
 * DrawingML text body wrap token (`none` | `square`).
 *
 * @private
 */
export type TextBodyWrap = (typeof TEXT_BODY_WRAP_VALUES)[number];
/**
 * Autofit choice (`EG_TextAutofit`): `a:noAutofit` | `a:normAutofit` | `a:spAutoFit`.
 *
 * @private
 */
export type TextAutoFit = {
    readonly kind: 'none';
} | {
    readonly kind: 'normal';
    readonly fontScale?: number;
    readonly lineSpaceReduction?: number;
} | {
    readonly kind: 'shape';
};
/** ST_TextFontScalePercent: 1000…100000 (percent × 1000; 100000 = 100%). */
const FONT_SCALE_MIN: number = 1000;
const FONT_SCALE_MAX: number = 100000;
const TEXT_ANCHORING_SET: ReadonlySet<string> = new Set(TEXT_ANCHORING_VALUES);
const TEXT_VERT_OVERFLOW_SET: ReadonlySet<string> = new Set(TEXT_VERT_OVERFLOW_VALUES);
const TEXT_HORZ_OVERFLOW_SET: ReadonlySet<string> = new Set(TEXT_HORZ_OVERFLOW_VALUES);
const TEXT_VERTICAL_TYPE_SET: ReadonlySet<string> = new Set(TEXT_VERTICAL_TYPE_VALUES);
const TEXT_BODY_WRAP_SET: ReadonlySet<string> = new Set(TEXT_BODY_WRAP_VALUES);
/**
 * Whether `value` is a schema `ST_TextAnchoringType` token.
 *
 * @param {string} value - The value.
 * @returns {*} The result.
 * @private
 */
export function isTextAnchoring(value: string): value is TextAnchoring {
    return TEXT_ANCHORING_SET.has(value);
}
/**
 * Whether `value` is a schema `ST_TextVertOverflowType` token.
 *
 * @param {string} value - The value.
 * @returns {*} The result.
 * @private
 */
export function isTextVertOverflow(value: string): value is TextVertOverflow {
    return TEXT_VERT_OVERFLOW_SET.has(value);
}
/**
 * Whether `value` is a schema `ST_TextHorzOverflowType` token.
 *
 * @param {string} value - The value.
 * @returns {*} The result.
 * @private
 */
export function isTextHorzOverflow(value: string): value is TextHorzOverflow {
    return TEXT_HORZ_OVERFLOW_SET.has(value);
}
/**
 * Whether `value` is a schema `ST_TextVerticalType` token.
 *
 * @param {string} value - The value.
 * @returns {*} The result.
 * @private
 */
export function isTextVerticalType(value: string): value is TextVerticalType {
    return TEXT_VERTICAL_TYPE_SET.has(value);
}
/**
 * Whether `value` is a schema `ST_TextWrappingType` token (`none`|`square`).
 *
 * @param {string} value - The value.
 * @returns {*} The result.
 * @private
 */
export function isTextBodyWrap(value: string): value is TextBodyWrap {
    return TEXT_BODY_WRAP_SET.has(value);
}
/**
 * Text-body insets from `wps:bodyPr` (`lIns`/`tIns`/`rIns`/`bIns`,
 * `ST_Coordinate32`, ≥0).
 *
 * @private
 */
export interface BodyInsets {
    readonly left?: number | undefined;
    readonly top?: number | undefined;
    readonly right?: number | undefined;
    readonly bottom?: number | undefined;
}
/**
 * @private
 * Typed MVP state read from `wps:bodyPr`.
 * Residual `prstTxWarp` / 3D / extLst / unknown attrs are flagged, not modeled.
 */
export interface BodyPropertiesState {
    readonly verticalAnchor: TextAnchoring | undefined;
    readonly anchorCenter: boolean | undefined;
    readonly textDirection: TextVerticalType | undefined;
    readonly textWrapInside: TextBodyWrap | undefined;
    readonly verticalOverflow: TextVertOverflow | undefined;
    readonly horizontalOverflow: TextHorzOverflow | undefined;
    readonly fromWordArt: boolean | undefined;
    readonly insets: BodyInsets | undefined;
    readonly autoFit: TextAutoFit | undefined;
    /** `a:prstTxWarp` present — residual WordArt warp path. */
    readonly hasPresetTextWarp: boolean;
    /** Unknown residual children (scene3d / Text3D / extLst) or unmodeled attrs. */
    readonly residual: boolean;
}
function elementChildren(el: OpenXmlElement): ReadonlyArray<OpenXmlElement> {
    return el.children.filter((c: OpenXmlChild): c is OpenXmlElement => c.kind === 'element');
}
function isElement(el: OpenXmlElement, namespaceUri: string, localName: string): boolean {
    return el.namespaceUri === namespaceUri && el.localName === localName;
}
/**
 * Shallow child lookup under `root` (direct element children only).
 *
 * @param {OpenXmlElement} root - The root.
 * @param {string} namespaceUri - The namespace uri.
 * @param {string} localName - The local name.
 * @returns {OpenXmlElement | undefined} The result.
 * @private
 */
export function findBodyPrChild(root: OpenXmlElement, namespaceUri: string, localName: string): OpenXmlElement | undefined {
    for (const child of elementChildren(root)) {
        if (isElement(child, namespaceUri, localName)) {
            return child;
        }
    }
    return undefined;
}
/**
 * Deep first-match walker under `root` (including `root` itself).
 * Local so residual dual-AC hosts can be searched without circular imports.
 *
 * @param {OpenXmlElement} root - Specifies the root.
 * @param {string} namespaceUri - Specifies the namespace uri.
 * @param {string} localName - Specifies the local name.
 * @returns {OpenXmlElement | undefined} Returns the result.
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
function attrValue(el: OpenXmlElement, localName: string): string | undefined {
    let ts330: any;
    return ((ts330 = el.attributes.find((a: OpenXmlAttribute) => a.namespaceUri === '' && a.localName === localName)), ts330 == null ? undefined : ts330.value);
}
/**
 * Parse OOXML boolean attribute wire (`"1"`/`"true"`/`"0"`/`"false"`).
 * Returns `undefined` when absent or unrecognized.
 *
 * @param {string | undefined} raw - Specifies the raw.
 * @returns {boolean | undefined} Returns the result.
 */
function parseXmlBoolean(raw: string | undefined): boolean | undefined {
    if (raw === undefined) {
        return undefined;
    }
    if (raw === '1' || raw === 'true') {
        return true;
    }
    if (raw === '0' || raw === 'false') {
        return false;
    }
    return undefined;
}
/**
 * Parse `ST_Coordinate32` EMU attribute to branded Point.
 * Accepts non-negative integers only (insets are physical margins ≥ 0).
 * Uses `emuToPoint()` so 0 is legal (unlike `lengthToEmus`, which requires > 0).
 *
 * @param {string | undefined} raw - Specifies the raw.
 * @returns {number | undefined} Returns the result.
 */
function parseInsetEmu(raw: string | undefined): number | undefined {
    if (raw === undefined || !/^-?\d+$/.test(raw)) {
        return undefined;
    }
    const n: number = Number.parseInt(raw, 10);
    if (!Number.isFinite(n) || n < 0) {
        return undefined;
    }
    return emuToPoint(n);
}
/**
 * Parse percent-ish autofit attributes.
 * Accepts either plain decimal (`100000`) or percent-string (`100%`).
 * fontScale schema range is 1000…100000 when decimal.
 *
 * @param {string | undefined} raw - Specifies the raw.
 * @returns {number | undefined} Returns the result.
 */
function parsePercentAttr(raw: string | undefined): number | undefined {
    if (raw === undefined) {
        return undefined;
    }
    if (/^\d+%$/.test(raw)) {
        const pct: number = Number.parseInt(raw.slice(0, -1), 10);
        if (!Number.isFinite(pct)) {
            return undefined;
        }
        // Map "100%" → 100000, "50%" → 50000 (percent × 1000).
        return pct * 1000;
    }
    if (/^\d+$/.test(raw)) {
        return Number.parseInt(raw, 10);
    }
    return undefined;
}
function parseAutoFit(bodyPr: OpenXmlElement): TextAutoFit | undefined {
    if (findBodyPrChild(bodyPr, A_NS, 'noAutofit') !== undefined) {
        return { kind: 'none' };
    }
    if (findBodyPrChild(bodyPr, A_NS, 'spAutoFit') !== undefined) {
        return { kind: 'shape' };
    }
    const norm: OpenXmlElement = findBodyPrChild(bodyPr, A_NS, 'normAutofit');
    if (norm !== undefined) {
        const fontScale: number = parsePercentAttr(attrValue(norm, 'fontScale'));
        const lineSpaceReduction: number = parsePercentAttr(attrValue(norm, 'lnSpcReduction'));
        const result: {
            kind: 'normal';
            fontScale?: number;
            lineSpaceReduction?: number;
        } = { kind: 'normal' };
        if (fontScale !== undefined) {
            result.fontScale = fontScale;
        }
        if (lineSpaceReduction !== undefined) {
            result.lineSpaceReduction = lineSpaceReduction;
        }
        return result;
    }
    return undefined;
}
/**
 * Locate `wps:bodyPr` under a residual dual-AC drawing host.
 *
 * @param {OpenXmlElement} residual - The residual.
 * @returns {OpenXmlElement | undefined} The result.
 * @private
 */
export function findBodyPrElement(residual: OpenXmlElement): OpenXmlElement | undefined {
    return findDeepElement(residual, WPS_NS, 'bodyPr');
}
/**
 * Locate `wps:txbx` under a residual dual-AC drawing host.
 *
 * @param {OpenXmlElement} residual - The residual.
 * @returns {OpenXmlElement | undefined} The result.
 * @private
 */
export function findTxbxElement(residual: OpenXmlElement): OpenXmlElement | undefined {
    return findDeepElement(residual, WPS_NS, 'txbx');
}
/**
 * Locate `w:txbxContent` under a residual host (WML namespace, local `txbxContent`).
 *
 * @param {OpenXmlElement} residual - The residual.
 * @returns {OpenXmlElement | undefined} The result.
 * @private
 */
export function findTxbxContentElement(residual: OpenXmlElement): OpenXmlElement | undefined {
    // Walk from txbx first when present; fall back to deep search.
    const txbx: OpenXmlElement = findTxbxElement(residual);
    if (txbx !== undefined) {
        for (const child of elementChildren(txbx)) {
            if (child.localName === 'txbxContent') {
                return child;
            }
        }
    }
    // Deep fallback (any namespace with localName txbxContent).
    const walk: (root: OpenXmlElement) => OpenXmlElement = (root: OpenXmlElement): OpenXmlElement | undefined => {
        if (root.localName === 'txbxContent') {
            return root;
        }
        for (const child of elementChildren(root)) {
            const found: OpenXmlElement = walk(child);
            if (found !== undefined) {
                return found;
            }
        }
        return undefined;
    };
    return walk(residual);
}
/**
 * Read `wps:bodyPr` MVP state from residual DrawingML host.
 *
 * Residual hosts are dual MC AlternateContent trees, so `wps:bodyPr` is
 * located with a deep walk. Children of the found bodyPr stay shallow.
 *
 * Cites: `CT_TextBodyProperties` + `EG_TextAutofit` (dml-main.xsd);
 * `CT_WordprocessingShape/bodyPr` (dml-wordprocessingDrawing.xsd).
 *
 * @param {OpenXmlElement} residual - The residual.
 * @returns {BodyPropertiesState} The result.
 * @private
 */
export function readBodyPropertiesState(residual: OpenXmlElement): BodyPropertiesState {
    const bodyPr: OpenXmlElement = findBodyPrElement(residual);
    if (bodyPr === undefined) {
        return {
            verticalAnchor: undefined,
            anchorCenter: undefined,
            textDirection: undefined,
            textWrapInside: undefined,
            verticalOverflow: undefined,
            horizontalOverflow: undefined,
            fromWordArt: undefined,
            insets: undefined,
            autoFit: undefined,
            hasPresetTextWarp: false,
            residual: false
        };
    }
    const anchorRaw: string = attrValue(bodyPr, 'anchor');
    const vertRaw: string = attrValue(bodyPr, 'vert');
    const wrapRaw: string = attrValue(bodyPr, 'wrap');
    const vertOverflowRaw: string = attrValue(bodyPr, 'vertOverflow');
    const horzOverflowRaw: string = attrValue(bodyPr, 'horzOverflow');
    const left: number = parseInsetEmu(attrValue(bodyPr, 'lIns'));
    const top: number = parseInsetEmu(attrValue(bodyPr, 'tIns'));
    const right: number = parseInsetEmu(attrValue(bodyPr, 'rIns'));
    const bottom: number = parseInsetEmu(attrValue(bodyPr, 'bIns'));
    const hasAnyInset: boolean = left !== undefined || top !== undefined || right !== undefined || bottom !== undefined;
    let insets: BodyInsets | undefined;
    if (hasAnyInset) {
        const insetOut: {
            left?: typeof left;
            top?: typeof top;
            right?: typeof right;
            bottom?: typeof bottom;
        } = {};
        if (left !== undefined) {
            insetOut.left = left;
        }
        if (top !== undefined) {
            insetOut.top = top;
        }
        if (right !== undefined) {
            insetOut.right = right;
        }
        if (bottom !== undefined) {
            insetOut.bottom = bottom;
        }
        insets = insetOut;
    }
    const hasPresetTextWarp: boolean = findBodyPrChild(bodyPr, A_NS, 'prstTxWarp') !== undefined;
    const hasScene3d: boolean = findBodyPrChild(bodyPr, A_NS, 'scene3d') !== undefined;
    const hasSp3d: boolean = findBodyPrChild(bodyPr, A_NS, 'sp3d') !== undefined;
    const hasFlatTx: boolean = findBodyPrChild(bodyPr, A_NS, 'flatTx') !== undefined;
    const hasExtLst: boolean = findBodyPrChild(bodyPr, A_NS, 'extLst') !== undefined;
    // Modeled attrs only; any other bodyPr attrs count as residual.
    const modeledAttrNames: Set<string> = new Set([
        'anchor',
        'anchorCtr',
        'vert',
        'wrap',
        'vertOverflow',
        'horzOverflow',
        'fromWordArt',
        'lIns',
        'tIns',
        'rIns',
        'bIns'
    ]);
    const hasUnknownAttrs: boolean = bodyPr.attributes.some((a: OpenXmlAttribute) => a.namespaceUri === '' && !modeledAttrNames.has(a.localName));
    return {
        verticalAnchor: anchorRaw !== undefined && isTextAnchoring(anchorRaw) ? anchorRaw : undefined,
        anchorCenter: parseXmlBoolean(attrValue(bodyPr, 'anchorCtr')),
        textDirection: vertRaw !== undefined && isTextVerticalType(vertRaw) ? vertRaw : undefined,
        textWrapInside: wrapRaw !== undefined && isTextBodyWrap(wrapRaw) ? wrapRaw : undefined,
        verticalOverflow: vertOverflowRaw !== undefined && isTextVertOverflow(vertOverflowRaw)
            ? vertOverflowRaw
            : undefined,
        horizontalOverflow: horzOverflowRaw !== undefined && isTextHorzOverflow(horzOverflowRaw)
            ? horzOverflowRaw
            : undefined,
        fromWordArt: parseXmlBoolean(attrValue(bodyPr, 'fromWordArt')),
        insets,
        autoFit: parseAutoFit(bodyPr),
        hasPresetTextWarp,
        residual: hasPresetTextWarp || hasScene3d || hasSp3d || hasFlatTx || hasExtLst || hasUnknownAttrs
    };
}
function buildEmptyAElement(localName: string): OpenXmlElement {
    return {
        kind: 'element',
        namespaceUri: A_NS,
        localName,
        prefix: 'a',
        attributes: [],
        namespaceDeclarations: [],
        children: []
    };
}
function buildNormAutofit(fontScale: number | undefined, lineSpaceReduction: number | undefined): OpenXmlElement {
    const attributes: OpenXmlAttribute[] = [];
    if (fontScale !== undefined) {
        if (!Number.isInteger(fontScale) ||
            fontScale < FONT_SCALE_MIN ||
            fontScale > FONT_SCALE_MAX) {
            throw new DocxError('content/invalid-shape', `normAutofit fontScale ${String(fontScale)} outside ST_TextFontScalePercent range ${String(FONT_SCALE_MIN)}…${String(FONT_SCALE_MAX)}`);
        }
        attributes.push({
            namespaceUri: '',
            localName: 'fontScale',
            prefix: '',
            value: String(fontScale)
        });
    }
    if (lineSpaceReduction !== undefined) {
        if (!Number.isInteger(lineSpaceReduction) || lineSpaceReduction < 0) {
            throw new DocxError('content/invalid-shape', `normAutofit lnSpcReduction ${String(lineSpaceReduction)} must be a non-negative integer`);
        }
        attributes.push({
            namespaceUri: '',
            localName: 'lnSpcReduction',
            prefix: '',
            value: String(lineSpaceReduction)
        });
    }
    return {
        kind: 'element',
        namespaceUri: A_NS,
        localName: 'normAutofit',
        prefix: 'a',
        attributes,
        namespaceDeclarations: [],
        children: []
    };
}
function buildAutoFitChild(autoFit: TextAutoFit): OpenXmlElement {
    if (autoFit.kind === 'none') {
        return buildEmptyAElement('noAutofit');
    }
    if (autoFit.kind === 'shape') {
        return buildEmptyAElement('spAutoFit');
    }
    return buildNormAutofit(autoFit.fontScale, autoFit.lineSpaceReduction);
}
/**
 * Convert inset points to a non-negative wire EMU integer string.
 * 0 is legal for insets; uses pointToCoordinateEmus (allows 0).
 *
 * @param {number} value - Specifies the value.
 * @returns {string} Returns the result.
 */
function insetToEmuString(value: number): string {
    const emu: Emus = pointToCoordinateEmus(value);
    if (!Number.isInteger(emu as number) || (emu as number) < 0) {
        throw new DocxError('content/invalid-shape', `bodyPr inset must be a non-negative point value convertible to EMU, got ${String(value)}`);
    }
    return String(emu);
}
/**
 * Build `wps:bodyPr` from the modeled MVP subset.
 *
 * Always emits the element (schema requires bodyPr on `wps:wsp`). When no
 * modeled fields are set, emits empty `<wps:bodyPr/>`.
 *
 * Autofit children use the DrawingML `a:` namespace. Residual warp/3d/extLst
 * are not re-emitted on the full structure rebuild path.
 *
 * @param {Object} state - The state.
 * @returns {OpenXmlElement} The result.
 * @private
 */
export function buildBodyPrElement(state: {
    readonly verticalAnchor?: TextAnchoring | undefined;
    readonly anchorCenter?: boolean | undefined;
    readonly textDirection?: TextVerticalType | undefined;
    readonly textWrapInside?: TextBodyWrap | undefined;
    readonly verticalOverflow?: TextVertOverflow | undefined;
    readonly horizontalOverflow?: TextHorzOverflow | undefined;
    readonly fromWordArt?: boolean | undefined;
    readonly insets?: BodyInsets | undefined;
    readonly autoFit?: TextAutoFit | undefined;
}): OpenXmlElement {
    const attributes: OpenXmlAttribute[] = [];
    if (state.verticalAnchor !== undefined) {
        if (!isTextAnchoring(state.verticalAnchor)) {
            throw new DocxError('content/invalid-shape', `Invalid bodyPr anchor "${String(state.verticalAnchor)}"`);
        }
        attributes.push({
            namespaceUri: '',
            localName: 'anchor',
            prefix: '',
            value: state.verticalAnchor
        });
    }
    if (state.anchorCenter !== undefined) {
        attributes.push({
            namespaceUri: '',
            localName: 'anchorCtr',
            prefix: '',
            value: state.anchorCenter ? '1' : '0'
        });
    }
    if (state.textDirection !== undefined) {
        if (!isTextVerticalType(state.textDirection)) {
            throw new DocxError('content/invalid-shape', `Invalid bodyPr vert "${String(state.textDirection)}"`);
        }
        attributes.push({
            namespaceUri: '',
            localName: 'vert',
            prefix: '',
            value: state.textDirection
        });
    }
    if (state.textWrapInside !== undefined) {
        if (!isTextBodyWrap(state.textWrapInside)) {
            throw new DocxError('content/invalid-shape', `Invalid bodyPr wrap "${String(state.textWrapInside)}" (schema: none|square only)`);
        }
        attributes.push({
            namespaceUri: '',
            localName: 'wrap',
            prefix: '',
            value: state.textWrapInside
        });
    }
    if (state.verticalOverflow !== undefined) {
        if (!isTextVertOverflow(state.verticalOverflow)) {
            throw new DocxError('content/invalid-shape', `Invalid bodyPr vertOverflow "${String(state.verticalOverflow)}"`);
        }
        attributes.push({
            namespaceUri: '',
            localName: 'vertOverflow',
            prefix: '',
            value: state.verticalOverflow
        });
    }
    if (state.horizontalOverflow !== undefined) {
        if (!isTextHorzOverflow(state.horizontalOverflow)) {
            throw new DocxError('content/invalid-shape', `Invalid bodyPr horzOverflow "${String(state.horizontalOverflow)}"`);
        }
        attributes.push({
            namespaceUri: '',
            localName: 'horzOverflow',
            prefix: '',
            value: state.horizontalOverflow
        });
    }
    if (state.fromWordArt !== undefined) {
        attributes.push({
            namespaceUri: '',
            localName: 'fromWordArt',
            prefix: '',
            value: state.fromWordArt ? '1' : '0'
        });
    }
    const insets: BodyInsets = state.insets;
    if (insets !== undefined) {
        if (insets.left !== undefined) {
            attributes.push({
                namespaceUri: '',
                localName: 'lIns',
                prefix: '',
                value: insetToEmuString(insets.left)
            });
        }
        if (insets.top !== undefined) {
            attributes.push({
                namespaceUri: '',
                localName: 'tIns',
                prefix: '',
                value: insetToEmuString(insets.top)
            });
        }
        if (insets.right !== undefined) {
            attributes.push({
                namespaceUri: '',
                localName: 'rIns',
                prefix: '',
                value: insetToEmuString(insets.right)
            });
        }
        if (insets.bottom !== undefined) {
            attributes.push({
                namespaceUri: '',
                localName: 'bIns',
                prefix: '',
                value: insetToEmuString(insets.bottom)
            });
        }
    }
    const children: OpenXmlElement[] = [];
    if (state.autoFit !== undefined) {
        children.push(buildAutoFitChild(state.autoFit));
    }
    return {
        kind: 'element',
        namespaceUri: WPS_NS,
        localName: 'bodyPr',
        prefix: 'wps',
        attributes,
        namespaceDeclarations: [],
        children
    };
}
/**
 * Whether any modeled bodyPr field is present (used by encode path to decide
 * empty vs populated bodyPr emission — empty is still required on wsp).
 *
 * @param {Object} state - The state.
 * @returns {boolean} The result.
 * @private
 */
export function hasModeledBodyPrFields(state: {
    readonly verticalAnchor?: TextAnchoring | undefined;
    readonly anchorCenter?: boolean | undefined;
    readonly textDirection?: TextVerticalType | undefined;
    readonly textWrapInside?: TextBodyWrap | undefined;
    readonly verticalOverflow?: TextVertOverflow | undefined;
    readonly horizontalOverflow?: TextHorzOverflow | undefined;
    readonly fromWordArt?: boolean | undefined;
    readonly insets?: BodyInsets | undefined;
    readonly autoFit?: TextAutoFit | undefined;
}): boolean {
    return (state.verticalAnchor !== undefined ||
        state.anchorCenter !== undefined ||
        state.textDirection !== undefined ||
        state.textWrapInside !== undefined ||
        state.verticalOverflow !== undefined ||
        state.horizontalOverflow !== undefined ||
        state.fromWordArt !== undefined ||
        state.insets !== undefined ||
        state.autoFit !== undefined);
}
/**
 * @private
 * Re-export Emus brand helper for encode callers that store inset EMUs. */
export type BodyInsetEmus = Emus;

/**
 * Public text direction inside a shape text frame.
 *
 * @public
 */
export enum TextDirection {
    /** Specifies the horizontal direction. */
    Horizontal = 'horz',
    /** Specifies the vertical direction. */
    Vertical = 'vert',
    /** Specifies the vertical270 direction. */
    Vertical270 = 'vert270',
    /** Specifies the word art vertical direction. */
    WordArtVertical = 'wordArtVert',
    /** Specifies the east asian vertical direction. */
    EastAsianVertical = 'eaVert',
    /** Specifies the mongolian vertical direction. */
    MongolianVertical = 'mongolianVert',
    /** Specifies the word art vertical rtl direction. */
    WordArtVerticalRtl = 'wordArtVertRtl'
}
/**
 * Public vertical alignment of text inside a shape text frame.
 *
 * @public
 */
export enum TextVerticalAlignment {
    /** Specifies the top alignment. */
    Top = 't',
    /** Specifies the center alignment. */
    Center = 'ctr',
    /** Specifies the bottom alignment. */
    Bottom = 'b',
    /** Specifies the justified alignment. */
    Justified = 'just',
    /** Specifies the distributed alignment. */
    Distributed = 'dist'
}
