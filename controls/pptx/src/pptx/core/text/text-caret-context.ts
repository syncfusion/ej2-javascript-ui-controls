import { cloneElement } from './text-range-write-utils';
import { OoxmlElement, OoxmlText } from '../xml/dom';
import { findChild } from '../shapes/dom-utils';
import { ShapeTextError, partNameOptions } from '../shapes/errors';
import { arrayAt } from '../util/es5-compat';
import { TextRangeContent } from './text-range-content';
import { HaystackRun } from './find/types';
/** One actual source content node, indexed by the shared glyph stream. @internal */
export interface TextCaretNode {
    readonly element: OoxmlElement; readonly start: number; readonly end: number; readonly text: string;
}
/** Exact insertion position/donor, retained only inside canonical synchronous writers. @internal */
export interface TextCaretContext {
    readonly atEnd: boolean; readonly at: number; readonly donor?: OoxmlElement;
    readonly empty?: OoxmlElement; readonly inside?: TextCaretNode;
}
/** @param {OoxmlElement} paragraph - Actual source paragraph.
 * @param {TextRangeContent} content - Current canonical content index.
 * @param {number} point - Collapsed validated glyph offset.
 * @param {string} affinity - Side of zero-advance source boundaries.
 * @param {string | undefined} partName - Diagnostic owner.
 * @param {number} breakOffset - Optional hard-break ordinal at this offset.
 * @returns {TextCaretContext} Exact source location, without mutation or copied field identities. */
export function locateTextCaret(paragraph: OoxmlElement, content: TextRangeContent, point: number,
                                affinity: 'before' | 'after', partName: string | undefined, breakOffset?: number): TextCaretContext {
    if (!Number.isSafeInteger(point) || point < 0 || point > content.text.length ||
        (affinity !== 'before' && affinity !== 'after')) { throw new ShapeTextError('Invalid text caret', partNameOptions(partName)); }
    const positions: Map<OoxmlElement, number> = new Map();
    paragraph.children.forEach((child: OoxmlElement | OoxmlText, index: number): void => {
        if (child.kind === 'element') { positions.set(child, index); }
    });
    const points: TextCaretNode[] = content.map.runs.map((run: HaystackRun, index: number): TextCaretNode =>
        ({ element: arrayAt(content.elements, index), start: run.startInHaystack,
            end: run.startInHaystack + run.text.length, text: run.text }));
    if (points.some((node: TextCaretNode): boolean => node.element.localName === 'fld' && point > node.start && point < node.end)) {
        throw new ShapeTextError('Caret inside a field cannot be split for insertion formatting', partNameOptions(partName));
    }
    const breaks: TextCaretNode[] = points.filter((node: TextCaretNode): boolean => node.element.localName === 'br' && node.start === point);
    const breakPositions: number[] = breaks.map((node: TextCaretNode): number => {
        const index: number | undefined = positions.get(node.element);
        if (index === undefined) { throw new ShapeTextError('stale text break ownership', partNameOptions(partName)); }
        return index;
    });
    const ordinal: number = breakOffset === undefined ? (affinity === 'before' ? 0 : breaks.length) : breakOffset;
    if (!Number.isSafeInteger(ordinal) || ordinal < 0 || ordinal > breaks.length) {
        throw new ShapeTextError('Invalid caret hard-break ordinal', partNameOptions(partName));
    }
    const endIndex: number = paragraph.children.findIndex((child: OoxmlElement | OoxmlText): boolean =>
        child.kind === 'element' && child.namespaceUri === paragraph.namespaceUri && child.localName === 'endParaRPr');
    if (point === content.text.length && ordinal === breaks.length) {
        return { atEnd: true, at: endIndex < 0 ? paragraph.children.length : endIndex,
            donor: findChild(paragraph, paragraph.namespaceUri, 'endParaRPr') };
    }
    const previousBreak: number = ordinal > 0 ? arrayAt(breakPositions, ordinal - 1) : -1;
    const nextBreak: number = ordinal < breaks.length ? arrayAt(breakPositions, ordinal) : paragraph.children.length;
    const empty: TextCaretNode[] = points.filter((node: TextCaretNode): boolean => {
        if (node.element.localName !== 'r' || node.start !== point || node.end !== point) { return false; }
        const index: number | undefined = positions.get(node.element);
        return index !== undefined && (breaks.length === 0 || (index > previousBreak && index < nextBreak));
    });
    if (empty.length) {
        const node: TextCaretNode = arrayAt(empty, affinity === 'before' ? empty.length - 1 : 0);
        return { atEnd: false, at: position(positions, node.element, partName), donor: node.element, empty: node.element };
    }
    const inside: TextCaretNode | undefined = points.find((node: TextCaretNode): boolean => point > node.start && point < node.end);
    if (inside) { return { atEnd: false, at: position(positions, inside.element, partName), donor: inside.element, inside }; }
    const next: TextCaretNode | undefined = points.find((node: TextCaretNode): boolean => node.start === point && node.end > point);
    const previous: TextCaretNode | undefined = points.slice().reverse().find((node: TextCaretNode): boolean =>
        node.end === point && node.start < point);
    const context: TextCaretNode | undefined = breaks.length > 0 ?
        (ordinal === 0 ? previous || arrayAt(breaks, 0) : ordinal === breaks.length ? next || arrayAt(breaks, ordinal - 1) :
            arrayAt(breaks, ordinal)) : affinity === 'before' ? previous || next : next || previous;
    const nextIndex: number | undefined = next && positions.get(next.element);
    const at: number = breaks.length > 0 ? (ordinal < breaks.length ? nextBreak : previousBreak + 1) :
        nextIndex !== undefined ? nextIndex : endIndex < 0 ? paragraph.children.length : endIndex;
    return { atEnd: false, at, donor: context && context.element };
}
/** @param {ReadonlyMap<OoxmlElement, number>} positions - Native source child identities.
 * @param {OoxmlElement} node - Required existing child.
 * @param {string | undefined} partName - Diagnostic owner.
 * @returns {number} Exact source child ordinal. */
function position(positions: ReadonlyMap<OoxmlElement, number>, node: OoxmlElement, partName: string | undefined): number {
    const index: number | undefined = positions.get(node);
    if (index === undefined) { throw new ShapeTextError('stale text caret ownership', partNameOptions(partName)); }
    return index;
}

/**
 * @param {string} ns - Exact owning dialect.
 * @param {OoxmlElement | undefined} context - Source formatting donor; field identity is never copied.
 * @returns {OoxmlElement} Schema-valid empty regular run with independent source formatting/bindings.
 */
export function createTextInsertionRun(ns: string, context: OoxmlElement | undefined): OoxmlElement {
    const copy: OoxmlElement | undefined = context && cloneElement(context);
    const properties: OoxmlElement | undefined = copy && (copy.localName === 'endParaRPr' ?
        { ...copy, localName: 'rPr' } : findChild(copy, ns, 'rPr'));
    const text: OoxmlElement = { kind: 'element', namespaceUri: ns, localName: 't', prefixHint: copy ? copy.prefixHint : 'a',
        attributes: [], children: [] };
    return { kind: 'element', namespaceUri: ns, localName: 'r', prefixHint: copy ? copy.prefixHint : 'a', attributes: [],
        children: properties ? [properties, text] : [text],
        ...(copy && copy.namespaceDeclarations !== undefined ? { namespaceDeclarations: copy.namespaceDeclarations } : {}) };
}
