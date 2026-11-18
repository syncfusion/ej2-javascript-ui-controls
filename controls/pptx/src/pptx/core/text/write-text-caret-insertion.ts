import { OoxmlElement, OoxmlText, parseXml, serializeXml } from '../xml/dom';
import { asMutable, findChild } from '../shapes/dom-utils';
import { ShapeTextError, partNameOptions } from '../shapes/errors';
import { SecurityLimits } from '../security/limits';
import { PackageLimitError } from '../security/errors';
import { TextRangeContent } from './text-range-content';
import { locateTextCaret, TextCaretContext, createTextInsertionRun } from './text-caret-context';
import { cloneElement, setText } from './text-range-write-utils';
/** @param {OoxmlElement} paragraph - Current canonical source paragraph.
 * @param {OoxmlElement} scope - Actual owning text body, or paragraph for an internal standalone handle.
 * @param {TextRangeContent} content - Current shared source index.
 * @param {number} point - Collapsed UTF-16 caret position.
 * @param {string} text - Single-paragraph literal insertion payload.
 * @param {string} affinity - Side of zero-advance boundaries.
 * @param {SecurityLimits} limits - Actual owning body limits.
 * @param {string | undefined} partName - Diagnostic owner.
 * @param {number} breakOffset - Actual hard-break ordinal when present.
 * @returns {boolean} Whether one fully prepared paragraph change was committed. */
export function insertTextAtCaret(paragraph: OoxmlElement, scope: OoxmlElement, content: TextRangeContent,
                                  point: number, text: string, affinity: 'before' | 'after', limits: SecurityLimits,
                                  partName: string | undefined, breakOffset?: number): boolean {
    validateText(text, partName);
    const location: TextCaretContext = locateTextCaret(paragraph, content, point, affinity, partName, breakOffset);
    if (!text.length) { return false; }
    const original: OoxmlElement | undefined = location.empty || (location.inside && location.inside.element);
    let run: OoxmlElement; let value: string;
    if (original) {
        const carrier: OoxmlElement | undefined = findChild(original, paragraph.namespaceUri, 't');
        if (!carrier || carrier.children.some((node: OoxmlElement | OoxmlText): boolean => node.kind !== 'text')) {
            throw new ShapeTextError('Unsupported text carrier cannot be edited safely', partNameOptions(partName));
        }
        const existing: string = location.inside ? location.inside.text : '';
        const offset: number = location.inside ? point - location.inside.start : 0;
        value = existing.slice(0, offset) + text + existing.slice(offset); run = cloneElement(original);
    } else { run = createTextInsertionRun(paragraph.namespaceUri, location.donor); value = text; }
    const size: number = new TextEncoder().encode(value).length;
    if (size > limits.textNodeLengthBytes) {
        throw new PackageLimitError('textNodeLengthBytes', { ...partNameOptions(partName), actual: size });
    }
    setText(run, value);
    const children: (OoxmlElement | OoxmlText)[] = paragraph.children.slice();
    if (original) {
        const index: number = children.indexOf(original);
        if (index < 0) { throw new ShapeTextError('stale caret insertion source', partNameOptions(partName)); }
        children.splice(index, 1, run);
    } else { children.splice(location.at, 0, run); }
    const replacement: OoxmlElement = { ...paragraph, children };
    let candidate: OoxmlElement = replacement;
    if (scope !== paragraph) {
        if (scope.children.filter((node: OoxmlElement | OoxmlText): boolean => node === paragraph).length !== 1) {
            throw new ShapeTextError('stale text body ownership', partNameOptions(partName));
        }
        candidate = { ...scope, children: scope.children.map((node: OoxmlElement | OoxmlText): OoxmlElement | OoxmlText =>
            node === paragraph ? replacement : node) };
    }
    const xml: string = serializeXml(candidate); const bytes: number = new TextEncoder().encode(xml).length;
    if (bytes > limits.singlePartUncompressedBytes) {
        throw new PackageLimitError('singlePartUncompressedBytes', { ...partNameOptions(partName), actual: bytes });
    }
    // Validate destination bindings/depth/attributes/text before any live write.
    // Whole package/part limits are additionally checked by the owning save/commit path.
    parseXml(xml, { limits, ...partNameOptions(partName) });
    asMutable(paragraph).children = children; return true;
}
/** @param {string} text - Literal user input, not XML source.
 * @param {string | undefined} partName - Diagnostic owner.
 * @returns {void} Rejects malformed UTF-16/XML characters and separate line/paragraph commands before mutation. */
function validateText(text: string, partName: string | undefined): void {
    if (typeof text !== 'string' || /[\r\n]/.test(text)) {
        throw new ShapeTextError('Caret insertion requires single-paragraph text; use break/paragraph editing for line breaks',
                                 partNameOptions(partName));
    }
    for (let i: number = 0; i < text.length; i++) {
        const code: number = text.charCodeAt(i);
        if (code < 0x20 && code !== 0x09 || code === 0xFFFE || code === 0xFFFF || code >= 0xDC00 && code <= 0xDFFF) {
            throw new ShapeTextError('Invalid XML text character', partNameOptions(partName));
        }
        if (code >= 0xD800 && code <= 0xDBFF) {
            const next: number = text.charCodeAt(i + 1);
            if (!(next >= 0xDC00 && next <= 0xDFFF)) { throw new ShapeTextError('Invalid UTF-16 text', partNameOptions(partName)); }
            i++;
        }
    }
}
