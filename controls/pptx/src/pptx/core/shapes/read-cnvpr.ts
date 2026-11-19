/**
 * Read extended `cNvPr` fields from live shape DOM (preserve path).
 *
 * @remarks
 * `title`, `descr`, and `hidden` are optional attributes on
 * `CT_NonVisualDrawingProps`. Readers never invent missing attributes and never
 * renumber `@id`. Hyperlink children (`hlinkClick` / `hlinkHover`) are left on
 * the live DOM and are never executed.
 *
 * Citation: Transitional `dml-main.xsd` `CT_NonVisualDrawingProps`;
 * `pml.xsd` three-part `nv*Pr` / `cNvPr` pattern; eng-ref
 * `02-PRESENTATIONML/shapes-and-text.md`.
 *
 * @internal
 */
import { PML_NS } from '../presentation/constants';
import { OoxmlElement } from '../xml/index';
import { DML_NS } from './constants';
import { findChild, getAttr } from './dom-utils';
import { ShapeElementKind } from './shape';
/**
 * Locates the kind-specific non-visual container under a shape-tree element.
 *
 * @internal
 * @param {OoxmlElement} shapeElement - The shapeElement value.
 * @param {ShapeElementKind} elementKind - The elementKind value.
 * @returns {OoxmlElement | undefined} The result.
 */
export function findNvContainer(shapeElement: OoxmlElement, elementKind: ShapeElementKind): OoxmlElement | undefined {
    return findChild(shapeElement, PML_NS, nvContainerLocalName(elementKind));
}
/**
 * Locates `cNvPr` under the kind-specific nv container (`p:` / `a:` / empty NS).
 *
 * @internal
 * @param {OoxmlElement} shapeElement - The shapeElement value.
 * @param {ShapeElementKind} elementKind - The elementKind value.
 * @returns {OoxmlElement | undefined} The result.
 */
export function findCNvPr(shapeElement: OoxmlElement, elementKind: ShapeElementKind): OoxmlElement | undefined {
    const nv: OoxmlElement = findNvContainer(shapeElement, elementKind);
    if (nv === undefined) {
        return undefined;
    }
    let cNvPr: OoxmlElement | undefined = findChild(nv, PML_NS, 'cNvPr');
    if (cNvPr === undefined) {
        cNvPr = findChild(nv, DML_NS, 'cNvPr');
    }
    if (cNvPr === undefined) {
        cNvPr = findChild(nv, '', 'cNvPr');
    }
    return cNvPr;
}
/**
 * Authored `cNvPr/@title` when present; otherwise `undefined` (never invents empty).
 *
 * @internal
 * @param {OoxmlElement} shapeElement - The shapeElement value.
 * @param {ShapeElementKind} elementKind - The elementKind value.
 * @returns {string | undefined} The result.
 */
export function readCNvPrTitle(shapeElement: OoxmlElement, elementKind: ShapeElementKind): string | undefined {
    const cNvPr: OoxmlElement = findCNvPr(shapeElement, elementKind);
    if (cNvPr === undefined) {
        return undefined;
    }
    return getAttr(cNvPr, '', 'title');
}
/**
 * Authored `cNvPr/@descr` when present; otherwise `undefined` (never invents empty).
 *
 * @internal
 * @param {OoxmlElement} shapeElement - The shapeElement value.
 * @param {ShapeElementKind} elementKind - The elementKind value.
 * @returns {string | undefined} The result.
 */
export function readCNvPrDescr(shapeElement: OoxmlElement, elementKind: ShapeElementKind): string | undefined {
    const cNvPr: OoxmlElement = findCNvPr(shapeElement, elementKind);
    if (cNvPr === undefined) {
        return undefined;
    }
    return getAttr(cNvPr, '', 'descr');
}
/**
 * `cNvPr/@hidden` (`xsd:boolean`, default false when attribute absent).
 *
 * @remarks Missing attribute means not hidden (schema default). Present `1` / `true` → true.
 * @internal
 * @param {OoxmlElement} shapeElement - The shapeElement value.
 * @param {ShapeElementKind} elementKind - The elementKind value.
 * @returns {boolean} The result.
 */
export function readCNvPrHidden(shapeElement: OoxmlElement, elementKind: ShapeElementKind): boolean {
    const cNvPr: OoxmlElement = findCNvPr(shapeElement, elementKind);
    if (cNvPr === undefined) {
        return false;
    }
    const raw: string = getAttr(cNvPr, '', 'hidden');
    if (raw === undefined) {
        return false;
    }
    return raw === '1' || raw.toLowerCase() === 'true';
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
