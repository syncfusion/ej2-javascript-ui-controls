/**
 * Locate the live hyperlink element for shape or run mutation.
 *
 * @remarks
 * Shared by retarget / clear / add. Does not resolve relationships.
 *
 * @internal
 */
import { DML_NS } from '../../core/shapes/constants';
import { findChild } from '../../core/shapes/dom-utils';
import { Shape } from '../../core/shapes/shape';
import { TextPart } from '../../core/text/text-part';
import { OoxmlElement } from '../../core/xml/index';
import { findShapeCNvPr } from './find-c-nv-pr';
import { findHyperlinkChild } from './find-hyperlink-child';
import { RunHyperlinkKind } from './read-run-hyperlink';
import { ShapeHyperlinkKind } from './read-shape-hyperlink';
/**
 * Shape hyperlink local name for a kind.
 *
 * @internal
 * @param {ShapeHyperlinkKind} kind - The kind value.
 * @returns {string} The result.
 */
export function shapeHyperlinkLocalName(kind: ShapeHyperlinkKind): string {
    return kind === 'click' ? 'hlinkClick' : 'hlinkHover';
}
/**
 * Run hyperlink local name for a kind.
 *
 * @internal
 * @param {RunHyperlinkKind} kind - The kind value.
 * @returns {string} The result.
 */
export function runHyperlinkLocalName(kind: RunHyperlinkKind): string {
    return kind === 'click' ? 'hlinkClick' : 'hlinkMouseOver';
}
/**
 * Finds shape hyperlink parent (`cNvPr`) and child element when present.
 *
 * @internal
 * @param {Shape} shape - The shape value.
 * @param {ShapeHyperlinkKind} kind - The kind value.
 * @returns {*} The result.
 */
export function locateShapeHyperlink(shape: Shape, kind: ShapeHyperlinkKind): {
    readonly parent: OoxmlElement;
    readonly element: OoxmlElement | undefined;
} | undefined {
    const parent: OoxmlElement = findShapeCNvPr(shape);
    if (parent === undefined) {
        return undefined;
    }
    const localName: string = shapeHyperlinkLocalName(kind);
    const element: OoxmlElement = findHyperlinkChild(parent, localName, { includePml: true });
    return { parent, element };
}
/**
 * Finds run hyperlink parent (`a:rPr`) and child element when present.
 *
 * @remarks Returns `undefined` only when the run element cannot host properties (should not happen for a normal `a:r`). Missing `rPr`
 * yields `{ parent: undefined, … }` via a dedicated result so add can create `rPr`.
 * @internal
 * @param {TextPart} run - The run value.
 * @param {RunHyperlinkKind} kind - The kind value.
 * @returns {*} The result.
 */
export function locateRunHyperlink(run: TextPart, kind: RunHyperlinkKind): {
    readonly runElement: OoxmlElement;
    readonly parent: OoxmlElement | undefined;
    readonly element: OoxmlElement | undefined;
} {
    const runElement: OoxmlElement = run.getElement();
    let parent: OoxmlElement | undefined = findChild(runElement, DML_NS, 'rPr');
    if (parent === undefined) {
        parent = findChild(runElement, '', 'rPr');
    }
    if (parent === undefined) {
        return { runElement, parent: undefined, element: undefined };
    }
    const localName: string = runHyperlinkLocalName(kind);
    const element: OoxmlElement = findHyperlinkChild(parent, localName);
    return { runElement, parent, element };
}
