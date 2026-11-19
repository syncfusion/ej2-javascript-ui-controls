/**
 * Read run-level `hlinkClick` / `hlinkMouseOver` under `a:rPr`.
 *
 * @remarks
 * Run hover local name is **`hlinkMouseOver`**, not `hlinkHover` (shape-level).
 * Citation: Transitional `dml-main.xsd` text run properties (~2919–2920);
 * `CT_Hyperlink`. Relationships must be the host part's list; never fetched.
 */
import { PackageRelationship } from '../../core/package/relationships';
import { DML_NS } from '../../core/shapes/constants';
import { findChild } from '../../core/shapes/dom-utils';
import { TextPart } from '../../core/text/text-part';
import { findHyperlinkChild } from './find-hyperlink-child';
import { parseHyperlinkElement } from './parse-hyperlink';
import { HyperlinkInfo } from './types';
import { OoxmlElement } from '../../core/xml/dom';
/**
 * Run hyperlink kind: click → `hlinkClick`; mouseOver → `hlinkMouseOver`.
 *
 * @public
 */
export type RunHyperlinkKind = 'click' | 'mouseOver';
/**
 * Reads a run-level hyperlink view, or `undefined` when the element is absent.
 *
 * @public
 * @param {TextPart} run - Direct text run (`a:r`).
 * @param {RunHyperlinkKind} kind - `click` or `mouseOver` (not shape `hover`).
 * @param {*} relationships - Host-part relationships for `r:id` resolve only.
 * @returns {HyperlinkInfo | undefined} Frozen {@link HyperlinkInfo}, or `undefined` if no matching child / no `rPr`.
 */
export function readRunHyperlink(run: TextPart, kind: RunHyperlinkKind,
                                 relationships: ReadonlyArray<PackageRelationship>): HyperlinkInfo | undefined {
    let rPr: OoxmlElement | undefined = findChild(run.getElement(), DML_NS, 'rPr');
    if (rPr === undefined) {
        rPr = findChild(run.getElement(), '', 'rPr');
    }
    if (rPr === undefined) {
        return undefined;
    }
    const localName: 'hlinkClick' | 'hlinkMouseOver' = kind === 'click' ? 'hlinkClick' : 'hlinkMouseOver';
    const source: 'run-click' | 'run-mouseOver' = kind === 'click' ? 'run-click' : 'run-mouseOver';
    const el: OoxmlElement = findHyperlinkChild(rPr, localName);
    if (el === undefined) {
        return undefined;
    }
    return parseHyperlinkElement(el, source, relationships);
}
