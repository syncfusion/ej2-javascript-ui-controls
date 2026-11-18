/**
 * Read shape-level `hlinkClick` / `hlinkHover` under `cNvPr`.
 *
 * @remarks
 * Elements live on `CT_NonVisualDrawingProps`. Namespaces may be DrawingML or
 * empty/PML in instance markup — dual lookup matches walk identity rules.
 * Callers pass host-part relationships from
 * `Presentation.getRelationships(partName)` so resolution never touches
 * the network. Citation: Transitional `dml-main.xsd` `CT_NonVisualDrawingProps`
 * (~812–813); `CT_Hyperlink`.
 */
import { PackageRelationship } from '../../core/package/relationships';
import { Shape } from '../../core/shapes/shape';
import { findShapeCNvPr } from './find-c-nv-pr';
import { findHyperlinkChild } from './find-hyperlink-child';
import { parseHyperlinkElement } from './parse-hyperlink';
import { HyperlinkInfo } from './types';
import { OoxmlElement } from '../../core/xml/dom';
/**
 * Shape hyperlink kind: click → `hlinkClick`; hover → `hlinkHover`.
 *
 * @public
 */
export type ShapeHyperlinkKind = 'click' | 'hover';
/**
 * Reads a shape-level hyperlink view, or `undefined` when the element is absent.
 *
 * @public
 * @param {Shape} shape - Shape handle (`sp`, `pic`, etc.).
 * @param {ShapeHyperlinkKind} kind - `click` (`hlinkClick`) or `hover` (`hlinkHover`).
 * @param {*} relationships - Relationships for the **host part** that owns the markup
 * @returns {HyperlinkInfo | undefined} Frozen {@link HyperlinkInfo}, or `undefined` if no matching child.
 */
export function readShapeHyperlink(shape: Shape, kind: ShapeHyperlinkKind,
                                   relationships: ReadonlyArray<PackageRelationship>): HyperlinkInfo | undefined {
    const cNvPr: OoxmlElement = findShapeCNvPr(shape);
    if (cNvPr === undefined) {
        return undefined;
    }
    const localName: 'hlinkClick' | 'hlinkHover' = kind === 'click' ? 'hlinkClick' : 'hlinkHover';
    const source: 'shape-click' | 'shape-hover' = kind === 'click' ? 'shape-click' : 'shape-hover';
    const el: OoxmlElement = findHyperlinkChild(cNvPr, localName, { includePml: true });
    if (el === undefined) {
        return undefined;
    }
    return parseHyperlinkElement(el, source, relationships);
}
