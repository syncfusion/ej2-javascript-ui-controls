import { assertSplittable, cloneElement, setText } from './text-range-write-utils';
import { applyCaretGlyphFill } from './write-text-caret-fill';
import { OoxmlElement, OoxmlText } from '../xml/dom';
import { asMutable, findChild } from '../shapes/dom-utils';
import { ShapeTextError, partNameOptions } from '../shapes/errors';
import { GradientFillOptions } from '../shapes/gradient-fill-options';
import { buildGradientFill, buildSolidFill } from '../shapes/write-gradient-fill';
import { commitCharacterGlyphFill } from '../shapes/mutate-decoration-fill';
import { ColorValue } from '../theme/color-value';
import { arrayAt } from '../util/es5-compat';
import { TextRangeContent, readTextRangeContent } from './text-range-content';
import { HaystackRun } from './find/types';
/** Detached authored range paint; not a resolved RGB replacement. @internal */
export type TextRangeGlyphEdit = { readonly kind: 'gradient'; readonly options: GradientFillOptions } |
{ readonly kind: 'solid'; readonly color: ColorValue } | { readonly kind: 'none' | 'reset' };
interface SelectedNode { readonly element: OoxmlElement; readonly text: string; readonly start: number; readonly end: number; }
/**
 * @param {OoxmlElement} paragraph - Live source paragraph, validated by canonical range ownership.
 * @param {number} start - Inclusive glyph offset.
 * @param {number} end - Exclusive glyph offset.
 * @param {TextRangeGlyphEdit} edit - Explicit authored operation.
 * @param {string | undefined} partName - Owning part for diagnostics.
 * @param {string} affinity - Before/after zero-advance caret boundary, default after.
 * @param {number} breakOffset - Optional explicit caret ordinal between hard breaks.
 * @returns {boolean} Whether one atomic paragraph update occurred.
 * @internal
 */
export function applyTextRangeGlyphFill(
    paragraph: OoxmlElement, start: number, end: number, edit: TextRangeGlyphEdit, partName: string | undefined,
    affinity: 'before' | 'after' = 'after', breakOffset?: number
): boolean {
    const content: TextRangeContent = readTextRangeContent(paragraph); const ns: string = paragraph.namespaceUri;
    const fill: OoxmlElement | undefined = edit.kind === 'gradient' ? buildGradientFill(edit.options, ns, partName) :
        edit.kind === 'solid' ? buildSolidFill(edit.color, ns, partName) : edit.kind === 'none' ?
            { kind: 'element', namespaceUri: ns, localName: 'noFill', prefixHint: 'a', attributes: [], children: [] } : undefined;
    if (start === end) { return applyCaretGlyphFill(paragraph, content, start, affinity, fill, partName, breakOffset); }
    const selected: SelectedNode[] = [];
    content.map.runs.forEach((run: HaystackRun, index: number): void => {
        const from: number = Math.max(0, start - run.startInHaystack);
        const to: number = Math.min(run.text.length, end - run.startInHaystack);
        if (from >= to) { return; }
        const element: OoxmlElement = arrayAt(content.elements, index);
        if (element.localName === 'fld' && (from !== 0 || to !== run.text.length)) {
            throw new ShapeTextError('Partial field formatting requires a whole field selection', partNameOptions(partName));
        }
        selected.push({ element, text: run.text, start: from, end: to });
    });
    const replacements: Map<OoxmlElement, ReadonlyArray<OoxmlElement>> = new Map();
    selected.forEach((node: SelectedNode): void => {
        if (!findChild(node.element, ns, 'rPr') && fill === undefined) { return; }
        const changed: OoxmlElement = cloneElement(node.element);
        let properties: OoxmlElement | undefined = findChild(changed, ns, 'rPr');
        if (!properties) {
            properties = { kind: 'element', namespaceUri: ns, localName: 'rPr', prefixHint: changed.prefixHint || 'a',
                attributes: [], children: [] };
            asMutable(changed).children.unshift(properties);
        }
        if (!commitCharacterGlyphFill(properties, fill ? cloneElement(fill) : undefined, partName)) { return; }
        if (node.start === 0 && node.end === node.text.length) { replacements.set(node.element, [changed]); return; }
        assertSplittable(node.element, ns, partName);
        const pieces: OoxmlElement[] = [];
        if (node.start > 0) {
            const before: OoxmlElement = cloneElement(node.element);
            setText(before, node.text.slice(0, node.start)); pieces.push(before);
        }
        setText(changed, node.text.slice(node.start, node.end)); pieces.push(changed);
        if (node.end < node.text.length) {
            const after: OoxmlElement = cloneElement(node.element);
            setText(after, node.text.slice(node.end)); pieces.push(after);
        }
        replacements.set(node.element, pieces);
    });
    if (replacements.size === 0) { return false; }
    const children: (OoxmlElement | OoxmlText)[] = [];
    paragraph.children.forEach((child: OoxmlElement | OoxmlText): void => {
        const replacement: ReadonlyArray<OoxmlElement> | undefined = child.kind === 'element' ? replacements.get(child) : undefined;
        if (replacement) { replacement.forEach((node: OoxmlElement): void => { children.push(node); }); }
        else { children.push(child); }
    });
    asMutable(paragraph).children = children; return true;
}
