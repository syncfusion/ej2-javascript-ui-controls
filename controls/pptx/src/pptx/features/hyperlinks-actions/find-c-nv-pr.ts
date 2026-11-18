/**
 * Locate shape `cNvPr` for hyperlink child lookup.
 *
 * @remarks
 * Mirrors `walk.ts` dual-namespace acceptance: instance markup may place `cNvPr`
 * under PML default xmlns or DrawingML. Citation: Transitional `pml.xsd` nv*
 * containers; `dml-main.xsd` `CT_NonVisualDrawingProps`.
 */
import { PML_NS } from '../../core/presentation/constants';
import { DML_NS } from '../../core/shapes/constants';
import { findChild } from '../../core/shapes/dom-utils';
import { Shape, ShapeElementKind } from '../../core/shapes/shape';
import { OoxmlElement } from '../../core/xml/index';
/**
 * Returns the non-visual drawing props element (`cNvPr`) for a shape, if present.
 *
 * @internal
 * @param {Shape} shape - Shape handle from the slide/group walk.
 * @returns {OoxmlElement | undefined} Live `cNvPr`, or `undefined` when the nv container / cNvPr is missing.
 */
export function findShapeCNvPr(shape: Shape): OoxmlElement | undefined {
    const nvLocal: string = nvContainerLocalName(shape.elementKind);
    const root: OoxmlElement = shape.getElement();
    const nv: OoxmlElement = findChild(root, PML_NS, nvLocal);
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
 * Kind-specific non-visual container local name (PresentationML).
 *
 * @internal
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
