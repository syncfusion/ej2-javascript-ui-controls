import { OoxmlElement, OoxmlText } from '../xml/dom';
import { findChild, getAttr } from '../shapes/dom-utils';
import { ShapeTextError } from '../shapes/errors';
import { getGradientDrawingNamespace } from '../theme/read-gradient';
import { buildHaystackFromRunTexts } from './find/haystack';
import { ParagraphHaystack } from './find/types';

/** Canonical internal source index; fields count glyph text, breaks have zero advance. @internal */
export interface TextRangeContent {
    readonly text: string;
    readonly key: string;
    readonly elements: ReadonlyArray<OoxmlElement>;
    readonly map: ParagraphHaystack;
}
/**
 * Reuses the existing find-engine string/run map without changing search's
 * regular-run-only semantics. The internal ordinal here indexes content nodes.
 *
 * @param {OoxmlElement} paragraph - Actual DrawingML paragraph in either known dialect.
 * @returns {TextRangeContent} Canonical glyph stream and structural identity.
 * @internal
 */
export function readTextRangeContent(paragraph: OoxmlElement): TextRangeContent {
    const ns: string | undefined = getGradientDrawingNamespace(paragraph.namespaceUri);
    if (!ns || paragraph.namespaceUri !== ns || paragraph.localName !== 'p') {
        throw new ShapeTextError('Invalid text range paragraph');
    }
    const elements: OoxmlElement[] = []; const texts: string[] = [];
    const markers: Array<ReadonlyArray<string | number | undefined>> = []; let offset: number = 0;
    paragraph.children.forEach((child: OoxmlElement | OoxmlText): void => {
        if (child.kind !== 'element' || child.namespaceUri !== ns || ['r', 'fld', 'br'].indexOf(child.localName) < 0) { return; }
        const element: OoxmlElement | undefined = findChild(child, ns, 't');
        const text: string = child.localName === 'br' || !element ? '' : element.children.map((node: OoxmlElement | OoxmlText): string =>
            node.kind === 'text' ? node.text : '').join('');
        if (child.localName !== 'r') { markers.push([child.localName, offset, getAttr(child, '', 'id'), getAttr(child, '', 'type')]); }
        elements.push(child); texts.push(text); offset += text.length;
    });
    const map: ParagraphHaystack = buildHaystackFromRunTexts(texts);
    return { text: map.haystack, key: JSON.stringify([map.haystack, markers]), elements, map };
}
