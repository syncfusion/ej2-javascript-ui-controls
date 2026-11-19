/**
 * Parse `p:ph` under application non-visual props (`nvPr`).
 */
import { PML_NS } from '../presentation/constants';
import { DML_NS } from '../shapes/constants';
import { findChild, getAttr } from '../shapes/dom-utils';
import { ShapeElementKind } from '../shapes/shape';
import { OoxmlElement } from '../xml/index';
import { DEFAULT_PLACEHOLDER_TYPE } from './constants';
import { PlaceholderInfo } from './placeholder-info';
/**
 * Returns direct {@link PlaceholderInfo} when the shape element has `p:ph`, else `undefined`.
 *
 * @remarks Looks up `nv*Pr` → `nvPr` → `ph` in the PresentationML namespace (also accepts unprefixed/`a:` nvPr/`ph` when present). Unknown
 * attributes and children under `p:ph` remain on the live DOM for preserve; only known attrs are surfaced here. Citation: Transitional
 * `pml.xsd` `CT_ApplicationNonVisualDrawingProps`, `CT_Placeholder`, `CT_ShapeNonVisual` / `CT_PictureNonVisual`.
 * @internal
 * @param {OoxmlElement} element - Shape-like element (`p:sp`, `p:pic`, …).
 * @param {ShapeElementKind} kind - Shape-tree kind (selects nv* container).
 * @param {string} shapeId - Authored `cNvPr/@id` for the info record.
 * @returns {PlaceholderInfo | undefined} Placeholder metadata with XSD defaults applied, or `undefined`.
 */
export function readPlaceholderInfo(element: OoxmlElement, kind: ShapeElementKind, shapeId: string): PlaceholderInfo | undefined {
    const ph: OoxmlElement = findPhElement(element, kind);
    if (ph === undefined) {
        return undefined;
    }
    const typeAttr: string = getAttr(ph, '', 'type');
    const idxAttr: string = getAttr(ph, '', 'idx');
    const orient: string = getAttr(ph, '', 'orient');
    const sz: string = getAttr(ph, '', 'sz');
    const hasCustomPrompt: string = getAttr(ph, '', 'hasCustomPrompt');
    const type: string = typeAttr === undefined || typeAttr.length === 0 ? DEFAULT_PLACEHOLDER_TYPE : typeAttr;
    const idx: number = parsePlaceholderIdx(idxAttr);
    return {
        type,
        idx,
        shapeId,
        ...(orient !== undefined ? { orient } : {}),
        ...(sz !== undefined ? { sz } : {}),
        ...(hasCustomPrompt !== undefined ? { hasCustomPrompt } : {})
    };
}
/**
 * True when the shape element carries `p:ph` under `nvPr`.
 *
 * @internal
 * @param {OoxmlElement} element - The element value.
 * @param {ShapeElementKind} kind - The kind value.
 * @returns {boolean} The result.
 */
export function shapeElementIsPlaceholder(element: OoxmlElement, kind: ShapeElementKind): boolean {
    return findPhElement(element, kind) !== undefined;
}
/**
 *
 * @param {string | undefined} raw - The raw value.
 * @returns {number} The result.
 */
export { parsePlaceholderIdx } from './match-key';
import { parsePlaceholderIdx } from './match-key';
/**
 *
 * @param {OoxmlElement} element - The element value.
 * @param {ShapeElementKind} kind - The kind value.
 * @returns {OoxmlElement | undefined} The result.
 */
function findPhElement(element: OoxmlElement, kind: ShapeElementKind): OoxmlElement | undefined {
    const nvLocal: string = nvContainerLocalName(kind);
    const nv: OoxmlElement = findChild(element, PML_NS, nvLocal);
    if (nv === undefined) {
        return undefined;
    }
    let nvPr: OoxmlElement | undefined = findChild(nv, PML_NS, 'nvPr');
    if (nvPr === undefined) {
        nvPr = findChild(nv, DML_NS, 'nvPr');
    }
    if (nvPr === undefined) {
        nvPr = findChild(nv, '', 'nvPr');
    }
    if (nvPr === undefined) {
        return undefined;
    }
    let ph: OoxmlElement | undefined = findChild(nvPr, PML_NS, 'ph');
    if (ph === undefined) {
        ph = findChild(nvPr, DML_NS, 'ph');
    }
    if (ph === undefined) {
        ph = findChild(nvPr, '', 'ph');
    }
    return ph;
}
/**
 *
 * @param {ShapeElementKind} kind - The kind value.
 * @returns {string} The result.
 */
function nvContainerLocalName(kind: ShapeElementKind): string {
    switch (kind) {
    case 'sp':
        return 'nvSpPr';
    case 'grpSp':
        return 'nvGrpSpPr';
    case 'pic':
        return 'nvPicPr';
    case 'cxnSp':
        return 'nvCxnSpPr';
    case 'graphicFrame':
        return 'nvGraphicFramePr';
    case 'contentPart':
        return 'nvContentPartPr';
    default: {
        const _exhaustive: never = kind;
        return _exhaustive;
    }
    }
}
