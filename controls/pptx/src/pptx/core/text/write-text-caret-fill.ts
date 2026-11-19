import { locateTextCaret, TextCaretContext, TextCaretNode, createTextInsertionRun } from './text-caret-context';
import { OoxmlElement, OoxmlText } from '../xml/dom';
import { asMutable, findChild } from '../shapes/dom-utils';
import { ShapeTextError } from '../shapes/errors';
import { commitCharacterGlyphFill } from '../shapes/mutate-decoration-fill';
import { TextRangeContent } from './text-range-content';
import { assertSplittable, cloneElement, setText } from './text-range-write-utils';
/**
 * @param {OoxmlElement} paragraph - Live source paragraph.
 * @param {TextRangeContent} content - Canonical current glyph stream and markers.
 * @param {number} point - Validated UTF-16 caret offset.
 * @param {string} affinity - Side of zero-advance boundaries.
 * @param {OoxmlElement | undefined} fill - Validated detached fill or reset.
 * @param {string | undefined} partName - Diagnostic owner part.
 * @param {number} breakOffset - Optional bounded ordinal between hard breaks.
 * @returns {boolean} Whether one atomic insertion-format change occurred.
 * @internal
 */
export function applyCaretGlyphFill(
    paragraph: OoxmlElement, content: TextRangeContent, point: number, affinity: 'before' | 'after',
    fill: OoxmlElement | undefined, partName: string | undefined, breakOffset?: number
): boolean {
    const ns: string = paragraph.namespaceUri;
    const location: TextCaretContext = locateTextCaret(paragraph, content, point, affinity, partName, breakOffset);
    if (location.atEnd) { return applyEndFill(paragraph, fill, partName); }
    if (location.empty) {
        const changed: OoxmlElement = cloneElement(location.empty);
        return formatRun(changed, fill, partName) ? replaceNode(paragraph, location.empty, [changed]) : false;
    }
    const inside: TextCaretNode | undefined = location.inside;
    if (inside) {
        const insertion: OoxmlElement = cloneElement(inside.element);
        if (!formatRun(insertion, fill, partName)) { return false; }
        assertSplittable(inside.element, ns, partName);
        const before: OoxmlElement = cloneElement(inside.element); const after: OoxmlElement = cloneElement(inside.element);
        setText(before, inside.text.slice(0, point - inside.start)); setText(insertion, '');
        setText(after, inside.text.slice(point - inside.start));
        return replaceNode(paragraph, inside.element, [before, insertion, after]);
    }
    const insertion: OoxmlElement = createTextInsertionRun(ns, location.donor);
    if (!formatRun(insertion, fill, partName)) { return false; }
    const children: (OoxmlElement | OoxmlText)[] = paragraph.children.slice();
    children.splice(location.at, 0, insertion); asMutable(paragraph).children = children; return true;
}
/**
 * @param {OoxmlElement} paragraph - Current source paragraph.
 * @param {OoxmlElement | undefined} fill - Detached glyph paint or reset.
 * @param {string | undefined} partName - Diagnostic owner.
 * @returns {boolean} Whether end/insertion formatting changed without adding visible runs.
 */
function applyEndFill(paragraph: OoxmlElement, fill: OoxmlElement | undefined, partName: string | undefined): boolean {
    const existing: OoxmlElement | undefined = findChild(paragraph, paragraph.namespaceUri, 'endParaRPr');
    if (!existing && fill === undefined) { return false; }
    const properties: OoxmlElement = existing ? cloneElement(existing) : {
        kind: 'element', namespaceUri: paragraph.namespaceUri, localName: 'endParaRPr',
        prefixHint: paragraph.prefixHint || 'a', attributes: [], children: [] };
    if (!commitCharacterGlyphFill(properties, fill ? cloneElement(fill) : undefined, partName)) { return false; }
    if (existing) { return replaceNode(paragraph, existing, [properties]); }
    asMutable(paragraph).children = paragraph.children.concat([properties]); return true;
}
/**
 * @param {OoxmlElement} run - Detached insertion run.
 * @param {OoxmlElement | undefined} fill - Detached desired paint or reset.
 * @param {string | undefined} partName - Diagnostic owner.
 * @returns {boolean} Whether only glyph formatting changes in this detached run.
 */
function formatRun(run: OoxmlElement, fill: OoxmlElement | undefined, partName: string | undefined): boolean {
    let properties: OoxmlElement | undefined = findChild(run, run.namespaceUri, 'rPr');
    if (!properties && fill === undefined) { return false; }
    if (!properties) {
        properties = { kind: 'element', namespaceUri: run.namespaceUri, localName: 'rPr', prefixHint: run.prefixHint || 'a',
            attributes: [], children: [] };
        asMutable(run).children.unshift(properties);
    }
    return commitCharacterGlyphFill(properties, fill ? cloneElement(fill) : undefined, partName);
}
/**
 * @param {OoxmlElement} paragraph - Actual source parent.
 * @param {OoxmlElement} original - Exact node being replaced.
 * @param {ReadonlyArray<OoxmlElement>} replacement - Fully prepared pieces.
 * @returns {boolean} Publishes one prepared change; never edits adjacent source objects.
 */
function replaceNode(paragraph: OoxmlElement, original: OoxmlElement, replacement: ReadonlyArray<OoxmlElement>): boolean {
    const index: number = paragraph.children.indexOf(original);
    if (index < 0) { throw new ShapeTextError('stale text node ownership'); }
    const children: (OoxmlElement | OoxmlText)[] = paragraph.children.slice();
    children.splice(index, 1, ...replacement); asMutable(paragraph).children = children; return true;
}
