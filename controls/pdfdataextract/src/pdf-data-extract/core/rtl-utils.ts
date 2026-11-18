/**
 * Utilities for converting visually ordered RTL text (as stored inside PDF content
 * streams) into logical Unicode reading order, and for normalizing Arabic
 * presentation forms back to their base Unicode code points.
 *
 * @private
 */
/**
 * Checks whether the character is an Arabic presentation form (isolated, final,
 * initial or medial shape) in the Arabic Presentation Forms A/B blocks.
 *
 * @param {string} ch - Character to check.
 * @returns {boolean} True when the character is an Arabic presentation form.
 * @private
 */
export function _isArabicPresentationForm(ch: string): boolean {
    const code: number = ch.charCodeAt(0);
    return (code >= 0xFB50 && code <= 0xFDFF) || (code >= 0xFE70 && code <= 0xFEFF);
}
/**
 * Checks whether the character belongs to a right-to-left script (Arabic, Hebrew,
 * Syriac, Thaana and related presentation blocks).
 *
 * @param {string} ch - Character to check.
 * @returns {boolean} True when the character is an RTL character.
 * @private
 */
export function _isRtlCharacter(ch: string): boolean {
    const code: number = ch.charCodeAt(0);
    if (code < 0x0590 || code > 0x08FF) {
        if (code < 0xFB1D || code > 0xFEFF) {
            return false;
        }
    }
    if (code >= 0x0600 && code <= 0x0605) {
        return false;
    }
    if (code >= 0x0660 && code <= 0x0669) {
        return false;
    }
    if (code >= 0x06F0 && code <= 0x06F9) {
        return false;
    }
    if (code >= 0x064B && code <= 0x065F) {
        return false;
    }
    if (code === 0x0640) {
        return false;
    }
    return true;
}
/**
 * Checks whether the character is a neutral character (space, punctuation) that
 * takes its direction from surrounding strong characters.
 *
 * @param {string} ch - Character to check.
 * @returns {boolean} True when the character is directionally neutral.
 * @private
 */
export function _isNeutralCharacter(ch: string): boolean {
    const code: number = ch.charCodeAt(0);
    if (code < 0x20) {
        return true;
    }
    if (code === 0x20 || code === 0xA0) {
        return true;
    }
    if (code >= 0x2000 && code <= 0x200F) {
        return true;
    }
    if (code >= 0x060C && code <= 0x060C) {
        return true;
    }
    if (code === 0x061B || code === 0x061F || code === 0x06D4) {
        return true;
    }
    if (code >= 0x066A && code <= 0x066D) {
        return true;
    }
    if (code >= 0x21 && code <= 0x2F) {
        return true;
    }
    if (code >= 0x3A && code <= 0x3F) {
        return true;
    }
    if (code >= 0x5B && code <= 0x60) {
        return true;
    }
    if (code >= 0x7B && code <= 0x7E) {
        return true;
    }
    if (code === 0x2013 || code === 0x2014 || code === 0x2026 || code === 0xAB || code === 0xBB) {
        return true;
    }
    return false;
}
/**
 * Checks whether the character is a left-to-right character (Latin letters,
 * digits and other common LTR characters).
 *
 * @param {string} ch - Character to check.
 * @returns {boolean} True when the character is an LTR character.
 * @private
 */
export function _isLtrCharacter(ch: string): boolean {
    const code: number = ch.charCodeAt(0);
    if (code >= 0x41 && code <= 0x5A) {
        return true;
    }
    if (code >= 0x61 && code <= 0x7A) {
        return true;
    }
    if (code >= 0x30 && code <= 0x39) {
        return true;
    }
    if (code >= 0x0660 && code <= 0x0669) {
        return true;
    }
    if (code >= 0x06F0 && code <= 0x06F9) {
        return true;
    }
    return (code >= 0xC0 && code <= 0x24F) && !((code >= 0x0590 && code <= 0x08FF));
}
/**
 * Maps Arabic presentation form characters (U+FB50–U+FDFF, U+FE70–U+FEFF) to their
 * base Arabic code points (U+0600–U+06FF and supplement ranges). Ligature
 * presentation forms are mapped to their multi-character logical equivalents.
 *
 * @param {string} ch - Character to normalize.
 * @returns {string} The base (logical) Unicode representation of the character.
 * @private
 */
export function _normalizeArabicCharacter(ch: string): string {
    const code: number = ch.charCodeAt(0);
    const mapped: string | undefined = Object.prototype.hasOwnProperty.call(arabicPresentationForms, code)
        ? arabicPresentationForms[<number>code] : undefined;
    if (typeof(mapped) === 'string') {
        return mapped;
    }
    return ch;
}
/**
 * Reverses a copy of the given array between the specified bounds (inclusive).
 *
 * @param {string[]} items - Array to reverse a portion of.
 * @param {number} start - Start index.
 * @param {number} end - End index (inclusive).
 * @returns {void}
 * @private
 */
function _reverseRange(items: string[], start: number, end: number): void {
    while (start < end) {
        const temp: string = items[<number>start];
        items[<number>start] = items[<number>end];
        items[<number>end] = temp;
        start++;
        end--;
    }
}
/**
 * Converts visually ordered text containing RTL content into logical Unicode order.
 * LTR runs are left untouched, so mixed RTL/LTR text is preserved. Characters are
 * handled as UTF-16 code units to match the rest of the extraction pipeline.
 *
 * @param {string} text - Text in visual order as extracted from the PDF content stream.
 * @returns {string} Text in logical reading order.
 * @private
 */
export function _convertVisualToLogicalOrder(text: string): string {
    if (typeof(text) !== 'string' || text.length === 0) {
        return text;
    }
    if (text.indexOf('\r') !== -1 || text.indexOf('\n') !== -1) {
        const lines: string[] = text.split(/(\r\n|\r|\n)/);
        let result: string = '';
        for (let i: number = 0; i < lines.length; i++) {
            const part: string = lines[Number.parseInt(i.toString(), 10)];
            if (part === '\r\n' || part === '\r' || part === '\n') {
                result += part;
            } else {
                result += _convertVisualToLogicalOrder(part);
            }
        }
        return result;
    }
    const characters: string[] = [];
    for (let i: number = 0; i < text.length; i++) {
        characters.push(text[Number.parseInt(i.toString(), 10)]);
    }
    if (!_containsRtlCharacter(text)) {
        return characters.join('');
    }
    const length: number = characters.length;
    _reverseRange(characters, 0, length - 1);
    if (_isWholeLineReversalStorage(text)) {
        return characters.join('');
    }
    let index: number = 0;
    while (index < length) {
        const character: string = characters[Number.parseInt(index.toString(), 10)];
        if (!_isRtlCharacter(character) && !_isNeutralCharacter(character)) {
            let runEnd: number = index;
            for (let j: number = index + 1; j < length; j++) {
                const next: string = characters[Number.parseInt(j.toString(), 10)];
                if (_isRtlCharacter(next)) {
                    break;
                }
                if (_isNeutralCharacter(next)) {
                    let after: number = j + 1;
                    while (after < length && _isNeutralCharacter(characters[Number.parseInt(after.toString(), 10)])) {
                        after++;
                    }
                    if (after < length && !_isRtlCharacter(characters[Number.parseInt(after.toString(), 10)])) {
                        runEnd = after - 1;
                        j = after - 1;
                    } else {
                        break;
                    }
                } else {
                    runEnd = j;
                }
            }
            _reverseRange(characters, index, runEnd);
            index = runEnd + 1;
        } else {
            index++;
        }
    }
    return characters.join('');
}
/**
 * Mirrored (swapped) forms of the paired bracket characters. RTL visual
 * layout stores these glyphs mirrored (Unicode BiDi rule L4), so converting
 * a visual fragment back to logical order must swap the pair members.
 *
 * @private
 */
const mirroredBrackets: { [key: string]: string } = {
    '(': ')', ')': '(',
    '[': ']', ']': '[',
    '{': '}', '}': '{',
    '\u00AB': '\u00BB', '\u00BB': '\u00AB'
};
/**
 * Swaps mirrored paired bracket characters (parentheses, square brackets, curly
 * braces, angle quotes) back to their logical pair member. RTL visual layout
 * paints these glyphs mirrored (Unicode BiDi rule L4), so a visual-order line
 * must be un-mirrored to yield the logical text Adobe extracts.
 *
 * @param {string} text - Text containing mirrored bracket glyphs.
 * @returns {string} Text with pair members swapped back.
 * @private
 */
export function _unmirrorPairedBrackets(text: string): string {
    if (typeof(text) !== 'string' || text.length === 0) {
        return text;
    }
    let result: string = '';
    for (let i: number = 0; i < text.length; i++) {
        const ch: string = text[Number.parseInt(i.toString(), 10)];
        if (Object.prototype.hasOwnProperty.call(mirroredBrackets, ch)) {
            result += mirroredBrackets[ch]; // eslint-disable-line
        } else {
            result += ch;
        }
    }
    return result;
}
/**
 * Converts a visual-order fragment that contains no RTL characters (Latin
 * tokens, digits, neutral punctuation) into logical order for an RTL line.
 *
 * @param {string} text - Fragment in visual order.
 * @returns {string} Fragment in logical order (bracket glyphs unchanged).
 * @private
 */
export function _invertVisualLtrFragment(text: string): string {
    if (typeof(text) !== 'string' || text.length === 0) {
        return text;
    }
    const characters: string[] = text.split('');
    _reverseRange(characters, 0, characters.length - 1);
    let index: number = 0;
    while (index < characters.length) {
        if (_isLtrCharacter(characters[Number.parseInt(index.toString(), 10)])) {
            let runEnd: number = index;
            while (runEnd + 1 < characters.length &&
                _isLtrCharacter(characters[Number.parseInt((runEnd + 1).toString(), 10)])) {
                runEnd++;
            }
            _reverseRange(characters, index, runEnd);
            index = runEnd + 1;
        } else {
            index++;
        }
    }
    return characters.join('');
}
/**
 * Checks whether the paired brackets in the given text form a balanced
 * sequence (every closing bracket is preceded by a matching opener and no
 * depth underflow). Text without brackets is balanced by definition.
 *
 * @param {string} text - Text to inspect.
 * @returns {boolean} True when the bracket sequence is balanced.
 * @private
 */
function _isBracketSequenceBalanced(text: string): boolean {
    if (typeof(text) !== 'string' || text.length === 0) {
        return true;
    }
    const openers: { [key: string]: string } = { '(': ')', '[': ']', '{': '}', '\u00AB': '\u00BB' };
    const closers: { [key: string]: string } = { ')': '(', ']': '[', '}': '{', '\u00BB': '\u00AB' };
    const stack: string[] = [];
    for (let i: number = 0; i < text.length; i++) {
        const ch: string = text[Number.parseInt(i.toString(), 10)];
        if (Object.prototype.hasOwnProperty.call(openers, ch)) {
            stack.push(openers[ch]); // eslint-disable-line
        } else if (Object.prototype.hasOwnProperty.call(closers, ch)) {
            const expected: string | undefined = stack.length > 0 ? stack.pop() : undefined;
            if (expected !== undefined && expected !== ch) {
                return false;
            }
            if (expected === undefined) {
                return false;
            }
        }
    }
    return stack.length === 0;
}
/**
 * Resolves paired-bracket glyph mirroring for a logical-order RTL line.
 *
 * @param {string} text - Line text in logical order.
 * @returns {string} Text with mirrored bracket glyphs restored when needed.
 * @private
 */
export function _resolveMirroredBrackets(text: string): string {
    if (typeof(text) !== 'string' || text.length === 0) {
        return text;
    }
    if (_isBracketSequenceBalanced(text)) {
        return text;
    }
    const unmirrored: string = _unmirrorPairedBrackets(text);
    return _isBracketSequenceBalanced(unmirrored) ? unmirrored : text;
}
/**
 * Detects the naive whole-line-reversal storage convention using digit runs
 * embedded in RTL text. In canonical visual storage digit runs read
 * left-to-right in ascending significance order ("2010"); if a stored digit
 * run instead reads like a plain reversal of an ascending run ("0102"), the
 * producer wrote the whole logical string reversed (convention B).
 *
 * @param {string} text - Text in visual order as extracted from the PDF.
 * @returns {boolean} True when the text appears whole-line-reversal stored.
 * @private
 */
function _isWholeLineReversalStorage(text: string): boolean {
    const runs: string[] = [];
    let current: string = '';
    for (let i: number = 0; i < text.length; i++) {
        const code: number = text.charCodeAt(i);
        const isDigit: boolean = (code >= 0x30 && code <= 0x39) || (code >= 0x0660 && code <= 0x0669);
        if (isDigit) {
            current += text[<number>i];
        } else if (current.length > 0) {
            runs.push(current);
            current = '';
        }
    }
    if (current.length > 0) {
        runs.push(current);
    }
    let reversedCount: number = 0;
    let total: number = 0;
    for (let i: number = 0; i < runs.length; i++) {
        const run: string = runs[Number.parseInt(i.toString(), 10)];
        if (run.length < 2) {
            continue;
        }
        total++;
        if (run === run.split('').reverse().join('')) {
            if (run.length >= 2 && new Set(run).size === 1) {
                total--;
            }
            continue;
        }
        if (run[0] === '0' || run[0] === String.fromCharCode(0x0660)) {
            reversedCount++;
        }
    }
    if (total === 0) {
        return false;
    }
    return reversedCount / total >= 0.5;
}
/**
 * Converts visually ordered RTL text into logical order and normalizes Arabic
 * presentation forms to their base Unicode code points. This produces text
 * comparable to Adobe text extraction for Arabic, Hebrew, Persian and Urdu.
 *
 * @param {string} text - Text in visual order as extracted from the PDF.
 * @returns {string} Normalized text in logical reading order.
 * @private
 */
export function _normalizeRtlText(text: string): string {
    if (typeof(text) !== 'string' || text.length === 0) {
        return text;
    }
    const reordered: string = _convertVisualToLogicalOrder(text);
    if (!_containsRtlCharacter(reordered)) {
        return reordered;
    }
    let normalized: string = '';
    for (let i: number = 0; i < reordered.length; i++) {
        normalized += _normalizeArabicCharacter(reordered[Number.parseInt(i.toString(), 10)]);
    }
    return normalized;
}
/**
 * Checks whether the given string contains any RTL script character.
 *
 * @param {string} text - Text to inspect.
 * @returns {boolean} True when the text contains an RTL character.
 * @private
 */
export function _containsRtlCharacter(text: string): boolean {
    if (typeof(text) !== 'string') {
        return false;
    }
    for (let i: number = 0; i < text.length; i++) {
        if (_isRtlCharacter(text[Number.parseInt(i.toString(), 10)])) {
            return true;
        }
    }
    return false;
}
/**
 * Checks whether the given text contains at least one Arabic presentation form
 * character. Producers that store text in visual glyph order typically emit
 * presentation forms, so this is used as a visual-order signal.
 *
 * @param {string} text - Text to inspect.
 * @returns {boolean} True when a presentation form character is present.
 * @private
 */
export function _containsArabicPresentationForm(text: string): boolean {
    if (typeof(text) !== 'string') {
        return false;
    }
    for (let i: number = 0; i < text.length; i++) {
        if (_isArabicPresentationForm(text[Number.parseInt(i.toString(), 10)])) {
            return true;
        }
    }
    return false;
}
/**
 * Maps Arabic presentation form characters in the given text to their base
 * Unicode code points WITHOUT any reordering. Used when the text is already
 * in logical order and only character normalization is needed.
 *
 * @param {string} text - Text to map.
 * @returns {string} Text with presentation forms replaced by base characters.
 * @private
 */
export function _mapArabicPresentationForms(text: string): string {
    if (typeof(text) !== 'string' || text.length === 0) {
        return text;
    }
    if (!_containsRtlCharacter(text)) {
        return text;
    }
    let mapped: string = '';
    for (let i: number = 0; i < text.length; i++) {
        const ch: string = text[Number.parseInt(i.toString(), 10)];
        if (_isArabicPresentationForm(ch)) {
            mapped += _normalizeArabicCharacter(ch);
        } else {
            mapped += ch;
        }
    }
    return mapped;
}
/**
 * Determines whether the given RTL text is stored in visual (right-to-left
 * glyph) order rather than logical order, using the horizontal position of
 * consecutive glyphs/words. When the second fragment is placed to the RIGHT of
 * the first fragment, the text advances leftward and is visual-ordered RTL.
 *
 * @param {{ x: number, width: number }} firstBounds - Bounds of the earlier extracted fragment.
 * @param {number} firstBounds.x - X-coordinate of the first fragment.
 * @param {number} firstBounds.width - Width of the first fragment.
 * @param {{ x: number, width: number }} secondBounds - Bounds of the next extracted fragment.
 * @param {number} secondBounds.x - X-coordinate of the second fragment.
 * @param {number} secondBounds.width - Width of the second fragment.
 * @returns {boolean} True when the fragments indicate visual RTL ordering.
 * @private
 */
export function _isVisualOrderRtl(firstBounds: { x: number, width: number }, secondBounds: { x: number, width: number }): boolean {
    if (!firstBounds || !secondBounds) {
        return false;
    }
    return secondBounds.x > firstBounds.x + firstBounds.width * 0.5;
}
/**
 * Normalizes a search input string for comparison. Search input is expected in
 * logical order; Arabic presentation forms are mapped to base code points so a
 * search value typed in logical Arabic matches extracted logical text.
 *
 * @param {string} text - Search text to normalize.
 * @returns {string} Normalized search text.
 * @private
 */
export function _normalizeSearchText(text: string): string {
    if (typeof(text) !== 'string' || text.length === 0) {
        return text;
    }
    if (!_containsRtlCharacter(text)) {
        return text;
    }
    let normalized: string = '';
    for (let i: number = 0; i < text.length; i++) {
        const ch: string = text[Number.parseInt(i.toString(), 10)];
        if (_isArabicPresentationForm(ch)) {
            normalized += _normalizeArabicCharacter(ch);
        } else {
            normalized += ch;
        }
    }
    return normalized;
}
/**
 * Extracted text fragment with bounds used for RTL reading-order reconstruction.
 *
 * @private
 */
export type _TextFragment = {
    text: string;
    bounds: { x: number; y: number; width: number; height: number };
};
/**
 * Rebuilds reading order for extracted fragments: groups fragments that share
 * the same baseline (row) and, for rows containing RTL content, emits the
 * right-most fragment first (Adobe-style RTL line reconstruction). LTR-only
 * rows keep the original (left-to-right) order.
 *
 * @param {_TextFragment[]} fragments - Fragments in content stream order.
 * @returns {_TextFragment[]} Fragments in reading order.
 * @private
 */
export function _reorderFragmentsForRtlReading(fragments: _TextFragment[]): _TextFragment[] {
    if (!fragments || fragments.length < 2) {
        return fragments;
    }
    let hasRtl: boolean = false;
    for (let i: number = 0; i < fragments.length; i++) {
        const fragment: _TextFragment = fragments[Number.parseInt(i.toString(), 10)];
        if (fragment && _containsRtlCharacter(fragment.text)) {
            hasRtl = true;
            break;
        }
    }
    if (!hasRtl) {
        return fragments;
    }
    const tolerance: number = _getRtlRowTolerance(fragments);
    const rows: _TextFragment[][] = [];
    for (let i: number = 0; i < fragments.length; i++) {
        const fragment: _TextFragment = fragments[Number.parseInt(i.toString(), 10)];
        if (!fragment || !fragment.bounds) {
            continue;
        }
        let placed: boolean = false;
        for (let r: number = 0; r < rows.length; r++) {
            const row: _TextFragment[] = rows[Number.parseInt(r.toString(), 10)];
            const reference: _TextFragment = row[0];
            if (_isSameRtlRow(reference.bounds, fragment.bounds, tolerance)) {
                row.push(fragment);
                placed = true;
                break;
            }
        }
        if (!placed) {
            rows.push([fragment]);
        }
    }
    const ordered: _TextFragment[] = [];
    rows.sort((a: _TextFragment[], b: _TextFragment[]): number => a[0].bounds.y - b[0].bounds.y);
    for (let r: number = 0; r < rows.length; r++) {
        const row: _TextFragment[] = rows[Number.parseInt(r.toString(), 10)];
        const rowHasRtl: boolean = row.some((fragment: _TextFragment): boolean => _containsRtlCharacter(fragment.text));
        if (rowHasRtl) {
            row.sort((a: _TextFragment, b: _TextFragment): number => b.bounds.x - a.bounds.x);
        } else {
            row.sort((a: _TextFragment, b: _TextFragment): number => a.bounds.x - b.bounds.x);
        }
        for (let i: number = 0; i < row.length; i++) {
            ordered.push(row[Number.parseInt(i.toString(), 10)]);
        }
    }
    return ordered;
}
/**
 * Computes the vertical tolerance used to decide whether two fragments share
 * the same text row (fraction of the dominant fragment height).
 *
 * @param {_TextFragment[]} fragments - Fragments being grouped.
 * @returns {number} Row-grouping tolerance in page units.
 * @private
 */
function _getRtlRowTolerance(fragments: _TextFragment[]): number {
    let totalHeight: number = 0;
    let count: number = 0;
    for (let i: number = 0; i < fragments.length; i++) {
        const fragment: _TextFragment = fragments[Number.parseInt(i.toString(), 10)];
        if (fragment && fragment.bounds && fragment.bounds.height > 0) {
            totalHeight += fragment.bounds.height;
            count++;
        }
    }
    if (count === 0) {
        return 2;
    }
    return Math.max(2, (totalHeight / count) * 0.5);
}
/**
 * Determines whether two fragment bounds belong to the same text row.
 *
 * @param {{ y: number, height: number }} first - First fragment bounds.
 * @param {number} first.y - Y-coordinate of the first fragment.
 * @param {number} first.height - Height of the first fragment.
 * @param {{ y: number, height: number }} second - Second fragment bounds.
 * @param {number} second.y - Y-coordinate of the second fragment.
 * @param {number} second.height - Height of the second fragment.
 * @param {number} tolerance - Vertical tolerance for row grouping.
 * @returns {boolean} True when both fragments are on the same row.
 * @private
 */
function _isSameRtlRow(first: { y: number, height: number }, second: { y: number, height: number }, tolerance: number): boolean {
    const firstCenter: number = first.y + first.height / 2;
    const secondCenter: number = second.y + second.height / 2;
    return Math.abs(firstCenter - secondCenter) <= tolerance;
}
const arabicPresentationForms: { [key: number]: string } = {
    0xFB50: '\u0671',
    0xFB51: '\u0671',
    0xFB52: '\u067b',
    0xFB53: '\u067b',
    0xFB54: '\u067b',
    0xFB55: '\u067b',
    0xFB56: '\u067e',
    0xFB57: '\u067e',
    0xFB58: '\u067e',
    0xFB59: '\u067e',
    0xFB5A: '\u0680',
    0xFB5B: '\u0680',
    0xFB5C: '\u0680',
    0xFB5D: '\u0680',
    0xFB5E: '\u067a',
    0xFB5F: '\u067a',
    0xFB60: '\u067a',
    0xFB61: '\u067a',
    0xFB62: '\u067f',
    0xFB63: '\u067f',
    0xFB64: '\u067f',
    0xFB65: '\u067f',
    0xFB66: '\u0679',
    0xFB67: '\u0679',
    0xFB68: '\u0679',
    0xFB69: '\u0679',
    0xFB6A: '\u06a4',
    0xFB6B: '\u06a4',
    0xFB6C: '\u06a4',
    0xFB6D: '\u06a4',
    0xFB6E: '\u06a6',
    0xFB6F: '\u06a6',
    0xFB70: '\u06a6',
    0xFB71: '\u06a6',
    0xFB72: '\u0684',
    0xFB73: '\u0684',
    0xFB74: '\u0684',
    0xFB75: '\u0684',
    0xFB76: '\u0683',
    0xFB77: '\u0683',
    0xFB78: '\u0683',
    0xFB79: '\u0683',
    0xFB7A: '\u0686',
    0xFB7B: '\u0686',
    0xFB7C: '\u0686',
    0xFB7D: '\u0686',
    0xFB7E: '\u0687',
    0xFB7F: '\u0687',
    0xFB80: '\u0687',
    0xFB81: '\u0687',
    0xFB82: '\u068d',
    0xFB83: '\u068d',
    0xFB84: '\u068c',
    0xFB85: '\u068c',
    0xFB86: '\u068e',
    0xFB87: '\u068e',
    0xFB88: '\u0688',
    0xFB89: '\u0688',
    0xFB8A: '\u0698',
    0xFB8B: '\u0698',
    0xFB8C: '\u0691',
    0xFB8D: '\u0691',
    0xFB8E: '\u06a9',
    0xFB8F: '\u06a9',
    0xFB90: '\u06a9',
    0xFB91: '\u06a9',
    0xFB92: '\u06af',
    0xFB93: '\u06af',
    0xFB94: '\u06af',
    0xFB95: '\u06af',
    0xFB96: '\u06b3',
    0xFB97: '\u06b3',
    0xFB98: '\u06b3',
    0xFB99: '\u06b3',
    0xFB9A: '\u06b1',
    0xFB9B: '\u06b1',
    0xFB9C: '\u06b1',
    0xFB9D: '\u06b1',
    0xFB9E: '\u06ba',
    0xFB9F: '\u06ba',
    0xFBA0: '\u06bb',
    0xFBA1: '\u06bb',
    0xFBA2: '\u06bb',
    0xFBA3: '\u06bb',
    0xFBA4: '\u06c0',
    0xFBA5: '\u06c0',
    0xFBA6: '\u06c1',
    0xFBA7: '\u06c1',
    0xFBA8: '\u06c1',
    0xFBA9: '\u06c1',
    0xFBAA: '\u06be',
    0xFBAB: '\u06be',
    0xFBAC: '\u06be',
    0xFBAD: '\u06be',
    0xFBAE: '\u06d2',
    0xFBAF: '\u06d2',
    0xFBB0: '\u06d3',
    0xFBB1: '\u06d3',
    0xFBD3: '\u06ad',
    0xFBD4: '\u06ad',
    0xFBD5: '\u06ad',
    0xFBD6: '\u06ad',
    0xFBD7: '\u06c7',
    0xFBD8: '\u06c7',
    0xFBD9: '\u06c6',
    0xFBDA: '\u06c6',
    0xFBDB: '\u06c8',
    0xFBDC: '\u06c8',
    0xFBDD: '\u06c7\u0674',
    0xFBDE: '\u06cb',
    0xFBDF: '\u06cb',
    0xFBE0: '\u06c5',
    0xFBE1: '\u06c5',
    0xFBE2: '\u06c9',
    0xFBE3: '\u06c9',
    0xFBE4: '\u06d0',
    0xFBE5: '\u06d0',
    0xFBE6: '\u06d0',
    0xFBE7: '\u06d0',
    0xFBE8: '\u0649',
    0xFBE9: '\u0649',
    0xFBEA: '\u0626\u0627',
    0xFBEB: '\u0626\u0627',
    0xFBEC: '\u0626\u06d5',
    0xFBED: '\u0626\u06d5',
    0xFBEE: '\u0626\u0648',
    0xFBEF: '\u0626\u0648',
    0xFBF0: '\u0626\u06c7',
    0xFBF1: '\u0626\u06c7',
    0xFBF2: '\u0626\u06c6',
    0xFBF3: '\u0626\u06c6',
    0xFBF4: '\u0626\u06c8',
    0xFBF5: '\u0626\u06c8',
    0xFBF6: '\u0626\u06d0',
    0xFBF7: '\u0626\u06d0',
    0xFBF8: '\u0626\u06d0',
    0xFBF9: '\u0626\u0649',
    0xFBFA: '\u0626\u0649',
    0xFBFB: '\u0626\u0649',
    0xFBFC: '\u06cc',
    0xFBFD: '\u06cc',
    0xFBFE: '\u06cc',
    0xFBFF: '\u06cc',
    0xFC00: '\u0626\u062c',
    0xFC01: '\u0626\u062d',
    0xFC02: '\u0626\u0645',
    0xFC03: '\u0626\u0649',
    0xFC04: '\u0626\u064a',
    0xFC05: '\u0628\u062c',
    0xFC06: '\u0628\u062d',
    0xFC07: '\u0628\u062e',
    0xFC08: '\u0628\u0645',
    0xFC09: '\u0628\u0649',
    0xFC0A: '\u0628\u064a',
    0xFC0B: '\u062a\u062c',
    0xFC0C: '\u062a\u062d',
    0xFC0D: '\u062a\u062e',
    0xFC0E: '\u062a\u0645',
    0xFC0F: '\u062a\u0649',
    0xFC10: '\u062a\u064a',
    0xFC11: '\u062b\u062c',
    0xFC12: '\u062b\u0645',
    0xFC13: '\u062b\u0649',
    0xFC14: '\u062b\u064a',
    0xFC15: '\u062c\u062d',
    0xFC16: '\u062c\u0645',
    0xFC17: '\u062d\u062c',
    0xFC18: '\u062d\u0645',
    0xFC19: '\u062e\u062c',
    0xFC1A: '\u062e\u062d',
    0xFC1B: '\u062e\u0645',
    0xFC1C: '\u0633\u062c',
    0xFC1D: '\u0633\u062d',
    0xFC1E: '\u0633\u062e',
    0xFC1F: '\u0633\u0645',
    0xFC20: '\u0635\u062d',
    0xFC21: '\u0635\u0645',
    0xFC22: '\u0636\u062c',
    0xFC23: '\u0636\u062d',
    0xFC24: '\u0636\u062e',
    0xFC25: '\u0636\u0645',
    0xFC26: '\u0637\u062d',
    0xFC27: '\u0637\u0645',
    0xFC28: '\u0638\u0645',
    0xFC29: '\u0639\u062c',
    0xFC2A: '\u0639\u0645',
    0xFC2B: '\u063a\u062c',
    0xFC2C: '\u063a\u0645',
    0xFC2D: '\u0641\u062c',
    0xFC2E: '\u0641\u062d',
    0xFC2F: '\u0641\u062e',
    0xFC30: '\u0641\u0645',
    0xFC31: '\u0641\u0649',
    0xFC32: '\u0641\u064a',
    0xFC33: '\u0642\u062d',
    0xFC34: '\u0642\u0645',
    0xFC35: '\u0642\u0649',
    0xFC36: '\u0642\u064a',
    0xFC37: '\u0643\u0627',
    0xFC38: '\u0643\u062c',
    0xFC39: '\u0643\u062d',
    0xFC3A: '\u0643\u062e',
    0xFC3B: '\u0643\u0644',
    0xFC3C: '\u0643\u0645',
    0xFC3D: '\u0643\u0649',
    0xFC3E: '\u0643\u064a',
    0xFC3F: '\u0644\u062c',
    0xFC40: '\u0644\u062d',
    0xFC41: '\u0644\u062e',
    0xFC42: '\u0644\u0645',
    0xFC43: '\u0644\u0649',
    0xFC44: '\u0644\u064a',
    0xFC45: '\u0645\u062c',
    0xFC46: '\u0645\u062d',
    0xFC47: '\u0645\u062e',
    0xFC48: '\u0645\u0645',
    0xFC49: '\u0645\u0649',
    0xFC4A: '\u0645\u064a',
    0xFC4B: '\u0646\u062c',
    0xFC4C: '\u0646\u062d',
    0xFC4D: '\u0646\u062e',
    0xFC4E: '\u0646\u0645',
    0xFC4F: '\u0646\u0649',
    0xFC50: '\u0646\u064a',
    0xFC51: '\u0647\u062c',
    0xFC52: '\u0647\u0645',
    0xFC53: '\u0647\u0649',
    0xFC54: '\u0647\u064a',
    0xFC55: '\u064a\u062c',
    0xFC56: '\u064a\u062d',
    0xFC57: '\u064a\u062e',
    0xFC58: '\u064a\u0645',
    0xFC59: '\u064a\u0649',
    0xFC5A: '\u064a\u064a',
    0xFC5B: '\u0630\u0670',
    0xFC5C: '\u0631\u0670',
    0xFC5D: '\u0649\u0670',
    0xFC5E: '\u064c\u0651',
    0xFC5F: '\u064d\u0651',
    0xFC60: '\u064e\u0651',
    0xFC61: '\u064f\u0651',
    0xFC62: '\u0650\u0651',
    0xFC63: '\u0651\u0670',
    0xFC64: '\u0626\u0631',
    0xFC65: '\u0626\u0632',
    0xFC66: '\u0626\u0645',
    0xFC67: '\u0626\u0646',
    0xFC68: '\u0626\u0649',
    0xFC69: '\u0626\u064a',
    0xFC6A: '\u0628\u0631',
    0xFC6B: '\u0628\u0632',
    0xFC6C: '\u0628\u0645',
    0xFC6D: '\u0628\u0646',
    0xFC6E: '\u0628\u0649',
    0xFC6F: '\u0628\u064a',
    0xFC70: '\u062a\u0631',
    0xFC71: '\u062a\u0632',
    0xFC72: '\u062a\u0645',
    0xFC73: '\u062a\u0646',
    0xFC74: '\u062a\u0649',
    0xFC75: '\u062a\u064a',
    0xFC76: '\u062b\u0631',
    0xFC77: '\u062b\u0632',
    0xFC78: '\u062b\u0645',
    0xFC79: '\u062b\u0646',
    0xFC7A: '\u062b\u0649',
    0xFC7B: '\u062b\u064a',
    0xFC7C: '\u0641\u0649',
    0xFC7D: '\u0641\u064a',
    0xFC7E: '\u0642\u0649',
    0xFC7F: '\u0642\u064a',
    0xFC80: '\u0643\u0627',
    0xFC81: '\u0643\u0644',
    0xFC82: '\u0643\u0645',
    0xFC83: '\u0643\u0649',
    0xFC84: '\u0643\u064a',
    0xFC85: '\u0644\u0645',
    0xFC86: '\u0644\u0649',
    0xFC87: '\u0644\u064a',
    0xFC88: '\u0645\u0627',
    0xFC89: '\u0645\u0645',
    0xFC8A: '\u0646\u0631',
    0xFC8B: '\u0646\u0632',
    0xFC8C: '\u0646\u0645',
    0xFC8D: '\u0646\u0646',
    0xFC8E: '\u0646\u0649',
    0xFC8F: '\u0646\u064a',
    0xFC90: '\u0649\u0670',
    0xFC91: '\u064a\u0631',
    0xFC92: '\u064a\u0632',
    0xFC93: '\u064a\u0645',
    0xFC94: '\u064a\u0646',
    0xFC95: '\u064a\u0649',
    0xFC96: '\u064a\u064a',
    0xFC97: '\u0626\u062c',
    0xFC98: '\u0626\u062d',
    0xFC99: '\u0626\u062e',
    0xFC9A: '\u0626\u0645',
    0xFC9B: '\u0626\u0647',
    0xFC9C: '\u0628\u062c',
    0xFC9D: '\u0628\u062d',
    0xFC9E: '\u0628\u062e',
    0xFC9F: '\u0628\u0645',
    0xFCA0: '\u0628\u0647',
    0xFCA1: '\u062a\u062c',
    0xFCA2: '\u062a\u062d',
    0xFCA3: '\u062a\u062e',
    0xFCA4: '\u062a\u0645',
    0xFCA5: '\u062a\u0647',
    0xFCA6: '\u062b\u0645',
    0xFCA7: '\u062c\u062d',
    0xFCA8: '\u062c\u0645',
    0xFCA9: '\u062d\u062c',
    0xFCAA: '\u062d\u0645',
    0xFCAB: '\u062e\u062c',
    0xFCAC: '\u062e\u0645',
    0xFCAD: '\u0633\u062c',
    0xFCAE: '\u0633\u062d',
    0xFCAF: '\u0633\u062e',
    0xFCB0: '\u0633\u0645',
    0xFCB1: '\u0635\u062d',
    0xFCB2: '\u0635\u062e',
    0xFCB3: '\u0635\u0645',
    0xFCB4: '\u0636\u062c',
    0xFCB5: '\u0636\u062d',
    0xFCB6: '\u0636\u062e',
    0xFCB7: '\u0636\u0645',
    0xFCB8: '\u0637\u062d',
    0xFCB9: '\u0638\u0645',
    0xFCBA: '\u0639\u062c',
    0xFCBB: '\u0639\u0645',
    0xFCBC: '\u063a\u062c',
    0xFCBD: '\u063a\u0645',
    0xFCBE: '\u0641\u062c',
    0xFCBF: '\u0641\u062d',
    0xFCC0: '\u0641\u062e',
    0xFCC1: '\u0641\u0645',
    0xFCC2: '\u0642\u062d',
    0xFCC3: '\u0642\u0645',
    0xFCC4: '\u0643\u062c',
    0xFCC5: '\u0643\u062d',
    0xFCC6: '\u0643\u062e',
    0xFCC7: '\u0643\u0644',
    0xFCC8: '\u0643\u0645',
    0xFCC9: '\u0644\u062c',
    0xFCCA: '\u0644\u062d',
    0xFCCB: '\u0644\u062e',
    0xFCCC: '\u0644\u0645',
    0xFCCD: '\u0644\u0647',
    0xFCCE: '\u0645\u062c',
    0xFCCF: '\u0645\u062d',
    0xFCD0: '\u0645\u062e',
    0xFCD1: '\u0645\u0645',
    0xFCD2: '\u0646\u062c',
    0xFCD3: '\u0646\u062d',
    0xFCD4: '\u0646\u062e',
    0xFCD5: '\u0646\u0645',
    0xFCD6: '\u0646\u0647',
    0xFCD7: '\u0647\u062c',
    0xFCD8: '\u0647\u0645',
    0xFCD9: '\u0647\u0670',
    0xFCDA: '\u064a\u062c',
    0xFCDB: '\u064a\u062d',
    0xFCDC: '\u064a\u062e',
    0xFCDD: '\u064a\u0645',
    0xFCDE: '\u064a\u0647',
    0xFCDF: '\u0626\u0645',
    0xFCE0: '\u0626\u0647',
    0xFCE1: '\u0628\u0645',
    0xFCE2: '\u0628\u0647',
    0xFCE3: '\u062a\u0645',
    0xFCE4: '\u062a\u0647',
    0xFCE5: '\u062b\u0645',
    0xFCE6: '\u062b\u0647',
    0xFCE7: '\u0633\u0645',
    0xFCE8: '\u0633\u0647',
    0xFCE9: '\u0634\u0645',
    0xFCEA: '\u0634\u0647',
    0xFCEB: '\u0643\u0644',
    0xFCEC: '\u0643\u0645',
    0xFCED: '\u0644\u0645',
    0xFCEE: '\u0646\u0645',
    0xFCEF: '\u0646\u0647',
    0xFCF0: '\u064a\u0645',
    0xFCF1: '\u064a\u0647',
    0xFCF2: '\u0640\u064e\u0651',
    0xFCF3: '\u0640\u064f\u0651',
    0xFCF4: '\u0640\u0650\u0651',
    0xFCF5: '\u0637\u0649',
    0xFCF6: '\u0637\u064a',
    0xFCF7: '\u0639\u0649',
    0xFCF8: '\u0639\u064a',
    0xFCF9: '\u063a\u0649',
    0xFCFA: '\u063a\u064a',
    0xFCFB: '\u0633\u0649',
    0xFCFC: '\u0633\u064a',
    0xFCFD: '\u0634\u0649',
    0xFCFE: '\u0634\u064a',
    0xFCFF: '\u062d\u0649',
    0xFD00: '\u062d\u064a',
    0xFD01: '\u062c\u0649',
    0xFD02: '\u062c\u064a',
    0xFD03: '\u062e\u0649',
    0xFD04: '\u062e\u064a',
    0xFD05: '\u0635\u0649',
    0xFD06: '\u0635\u064a',
    0xFD07: '\u0636\u0649',
    0xFD08: '\u0636\u064a',
    0xFD09: '\u0634\u062c',
    0xFD0A: '\u0634\u062d',
    0xFD0B: '\u0634\u062e',
    0xFD0C: '\u0634\u0645',
    0xFD0D: '\u0634\u0631',
    0xFD0E: '\u0633\u0631',
    0xFD0F: '\u0635\u0631',
    0xFD10: '\u0636\u0631',
    0xFD11: '\u0637\u0649',
    0xFD12: '\u0637\u064a',
    0xFD13: '\u0639\u0649',
    0xFD14: '\u0639\u064a',
    0xFD15: '\u063a\u0649',
    0xFD16: '\u063a\u064a',
    0xFD17: '\u0633\u0649',
    0xFD18: '\u0633\u064a',
    0xFD19: '\u0634\u0649',
    0xFD1A: '\u0634\u064a',
    0xFD1B: '\u062d\u0649',
    0xFD1C: '\u062d\u064a',
    0xFD1D: '\u062c\u0649',
    0xFD1E: '\u062c\u064a',
    0xFD1F: '\u062e\u0649',
    0xFD20: '\u062e\u064a',
    0xFD21: '\u0635\u0649',
    0xFD22: '\u0635\u064a',
    0xFD23: '\u0636\u0649',
    0xFD24: '\u0636\u064a',
    0xFD25: '\u0634\u062c',
    0xFD26: '\u0634\u062d',
    0xFD27: '\u0634\u062e',
    0xFD28: '\u0634\u0645',
    0xFD29: '\u0634\u0631',
    0xFD2A: '\u0633\u0631',
    0xFD2B: '\u0635\u0631',
    0xFD2C: '\u0636\u0631',
    0xFD2D: '\u0634\u062c',
    0xFD2E: '\u0634\u062d',
    0xFD2F: '\u0634\u062e',
    0xFD30: '\u0634\u0645',
    0xFD31: '\u0633\u0647',
    0xFD32: '\u0634\u0647',
    0xFD33: '\u0637\u0645',
    0xFD34: '\u0633\u062c',
    0xFD35: '\u0633\u062d',
    0xFD36: '\u0633\u062e',
    0xFD37: '\u0634\u062c',
    0xFD38: '\u0634\u062d',
    0xFD39: '\u0634\u062e',
    0xFD3A: '\u0637\u0645',
    0xFD3B: '\u0638\u0645',
    0xFD3C: '\u0627\u064b',
    0xFD3D: '\u0627\u064b',
    0xFD50: '\u062a\u062c\u0645',
    0xFD51: '\u062a\u062d\u062c',
    0xFD52: '\u062a\u062d\u062c',
    0xFD53: '\u062a\u062d\u0645',
    0xFD54: '\u062a\u062e\u0645',
    0xFD55: '\u062a\u0645\u062c',
    0xFD56: '\u062a\u0645\u062d',
    0xFD57: '\u062a\u0645\u062e',
    0xFD58: '\u062c\u0645\u062d',
    0xFD59: '\u062c\u0645\u062d',
    0xFD5A: '\u062d\u0645\u064a',
    0xFD5B: '\u062d\u0645\u0649',
    0xFD5C: '\u0633\u062d\u062c',
    0xFD5D: '\u0633\u062c\u062d',
    0xFD5E: '\u0633\u062c\u0649',
    0xFD5F: '\u0633\u0645\u062d',
    0xFD60: '\u0633\u0645\u062d',
    0xFD61: '\u0633\u0645\u062c',
    0xFD62: '\u0633\u0645\u0645',
    0xFD63: '\u0633\u0645\u0645',
    0xFD64: '\u0635\u062d\u062d',
    0xFD65: '\u0635\u062d\u062d',
    0xFD66: '\u0635\u0645\u0645',
    0xFD67: '\u0634\u062d\u0645',
    0xFD68: '\u0634\u062d\u0645',
    0xFD69: '\u0634\u062c\u064a',
    0xFD6A: '\u0634\u0645\u062e',
    0xFD6B: '\u0634\u0645\u062e',
    0xFD6C: '\u0634\u0645\u0645',
    0xFD6D: '\u0634\u0645\u0645',
    0xFD6E: '\u0636\u062d\u0649',
    0xFD6F: '\u0636\u062e\u0645',
    0xFD70: '\u0636\u062e\u0645',
    0xFD71: '\u0637\u0645\u062d',
    0xFD72: '\u0637\u0645\u062d',
    0xFD73: '\u0637\u0645\u0645',
    0xFD74: '\u0637\u0645\u064a',
    0xFD75: '\u0639\u062c\u0645',
    0xFD76: '\u0639\u0645\u0645',
    0xFD77: '\u0639\u0645\u0645',
    0xFD78: '\u0639\u0645\u0649',
    0xFD79: '\u063a\u0645\u0645',
    0xFD7A: '\u063a\u0645\u064a',
    0xFD7B: '\u063a\u0645\u0649',
    0xFD7C: '\u0641\u062e\u0645',
    0xFD7D: '\u0641\u062e\u0645',
    0xFD7E: '\u0642\u0645\u062d',
    0xFD7F: '\u0642\u0645\u0645',
    0xFD80: '\u0644\u062d\u0645',
    0xFD81: '\u0644\u062d\u064a',
    0xFD82: '\u0644\u062d\u0649',
    0xFD83: '\u0644\u062c\u062c',
    0xFD84: '\u0644\u062c\u062c',
    0xFD85: '\u0644\u062e\u0645',
    0xFD86: '\u0644\u062e\u0645',
    0xFD87: '\u0644\u0645\u062d',
    0xFD88: '\u0644\u0645\u062d',
    0xFD89: '\u0645\u062d\u062c',
    0xFD8A: '\u0645\u062d\u0645',
    0xFD8B: '\u0645\u062d\u064a',
    0xFD8C: '\u0645\u062c\u062d',
    0xFD8D: '\u0645\u062c\u0645',
    0xFD8E: '\u0645\u062e\u062c',
    0xFD8F: '\u0645\u062e\u0645',
    0xFD92: '\u0645\u062c\u062e',
    0xFD93: '\u0647\u0645\u062c',
    0xFD94: '\u0647\u0645\u0645',
    0xFD95: '\u0646\u062d\u0645',
    0xFD96: '\u0646\u062d\u0649',
    0xFD97: '\u0646\u062c\u0645',
    0xFD98: '\u0646\u062c\u0645',
    0xFD99: '\u0646\u062c\u0649',
    0xFD9A: '\u0646\u0645\u064a',
    0xFD9B: '\u0646\u0645\u0649',
    0xFD9C: '\u064a\u0645\u0645',
    0xFD9D: '\u064a\u0645\u0645',
    0xFD9E: '\u0628\u062e\u064a',
    0xFD9F: '\u062a\u062c\u064a',
    0xFDA0: '\u062a\u062c\u0649',
    0xFDA1: '\u062a\u062e\u064a',
    0xFDA2: '\u062a\u062e\u0649',
    0xFDA3: '\u062a\u0645\u064a',
    0xFDA4: '\u062a\u0645\u0649',
    0xFDA5: '\u062c\u0645\u064a',
    0xFDA6: '\u062c\u062d\u0649',
    0xFDA7: '\u062c\u0645\u0649',
    0xFDA8: '\u0633\u062e\u0649',
    0xFDA9: '\u0635\u062d\u064a',
    0xFDAA: '\u0634\u062d\u064a',
    0xFDAB: '\u0636\u062d\u064a',
    0xFDAC: '\u0644\u062c\u064a',
    0xFDAD: '\u0644\u0645\u064a',
    0xFDAE: '\u064a\u062d\u064a',
    0xFDAF: '\u064a\u062c\u064a',
    0xFDB0: '\u064a\u0645\u064a',
    0xFDB1: '\u0645\u0645\u064a',
    0xFDB2: '\u0642\u0645\u064a',
    0xFDB3: '\u0646\u062d\u064a',
    0xFDB4: '\u0642\u0645\u062d',
    0xFDB5: '\u0644\u062d\u0645',
    0xFDB6: '\u0639\u0645\u064a',
    0xFDB7: '\u0643\u0645\u064a',
    0xFDB8: '\u0646\u062c\u062d',
    0xFDB9: '\u0645\u062e\u064a',
    0xFDBA: '\u0644\u062c\u0645',
    0xFDBB: '\u0643\u0645\u0645',
    0xFDBC: '\u0644\u062c\u0645',
    0xFDBD: '\u0646\u062c\u062d',
    0xFDBE: '\u062c\u062d\u064a',
    0xFDBF: '\u062d\u062c\u064a',
    0xFDC0: '\u0645\u062c\u064a',
    0xFDC1: '\u0641\u0645\u064a',
    0xFDC2: '\u0628\u062d\u064a',
    0xFDC3: '\u0643\u0645\u0645',
    0xFDC4: '\u0639\u062c\u0645',
    0xFDC5: '\u0635\u0645\u0645',
    0xFDC6: '\u0633\u062e\u064a',
    0xFDC7: '\u0646\u062c\u064a',
    0xFDF0: '\u0635\u0644\u06d2',
    0xFDF1: '\u0642\u0644\u06d2',
    0xFDF2: '\u0627\u0644\u0644\u0647',
    0xFDF3: '\u0627\u0643\u0628\u0631',
    0xFDF4: '\u0645\u062d\u0645\u062f',
    0xFDF5: '\u0635\u0644\u0639\u0645',
    0xFDF6: '\u0631\u0633\u0648\u0644',
    0xFDF7: '\u0639\u0644\u064a\u0647',
    0xFDF8: '\u0648\u0633\u0644\u0645',
    0xFDF9: '\u0635\u0644\u0649',
    0xFDFA: '\u0635\u0644\u0649\u0627\u0644\u0644\u0647\u0639\u0644\u064a\u0647\u0648\u0633\u0644\u0645',
    0xFDFB: '\u062c\u0644\u062c\u0644\u0627\u0644\u0647',
    0xFDFC: '\u0631\u06cc\u0627\u0644',
    0xFE70: '\u064b',
    0xFE71: '\u0640\u064b',
    0xFE72: '\u064c',
    0xFE74: '\u064d',
    0xFE76: '\u064e',
    0xFE77: '\u0640\u064e',
    0xFE78: '\u064f',
    0xFE79: '\u0640\u064f',
    0xFE7A: '\u0650',
    0xFE7B: '\u0640\u0650',
    0xFE7C: '\u0651',
    0xFE7D: '\u0640\u0651',
    0xFE7E: '\u0652',
    0xFE7F: '\u0640\u0652',
    0xFE80: '\u0621',
    0xFE81: '\u0622',
    0xFE82: '\u0622',
    0xFE83: '\u0623',
    0xFE84: '\u0623',
    0xFE85: '\u0624',
    0xFE86: '\u0624',
    0xFE87: '\u0625',
    0xFE88: '\u0625',
    0xFE89: '\u0626',
    0xFE8A: '\u0626',
    0xFE8B: '\u0626',
    0xFE8C: '\u0626',
    0xFE8D: '\u0627',
    0xFE8E: '\u0627',
    0xFE8F: '\u0628',
    0xFE90: '\u0628',
    0xFE91: '\u0628',
    0xFE92: '\u0628',
    0xFE93: '\u0629',
    0xFE94: '\u0629',
    0xFE95: '\u062a',
    0xFE96: '\u062a',
    0xFE97: '\u062a',
    0xFE98: '\u062a',
    0xFE99: '\u062b',
    0xFE9A: '\u062b',
    0xFE9B: '\u062b',
    0xFE9C: '\u062b',
    0xFE9D: '\u062c',
    0xFE9E: '\u062c',
    0xFE9F: '\u062c',
    0xFEA0: '\u062c',
    0xFEA1: '\u062d',
    0xFEA2: '\u062d',
    0xFEA3: '\u062d',
    0xFEA4: '\u062d',
    0xFEA5: '\u062e',
    0xFEA6: '\u062e',
    0xFEA7: '\u062e',
    0xFEA8: '\u062e',
    0xFEA9: '\u062f',
    0xFEAA: '\u062f',
    0xFEAB: '\u0630',
    0xFEAC: '\u0630',
    0xFEAD: '\u0631',
    0xFEAE: '\u0631',
    0xFEAF: '\u0632',
    0xFEB0: '\u0632',
    0xFEB1: '\u0633',
    0xFEB2: '\u0633',
    0xFEB3: '\u0633',
    0xFEB4: '\u0633',
    0xFEB5: '\u0634',
    0xFEB6: '\u0634',
    0xFEB7: '\u0634',
    0xFEB8: '\u0634',
    0xFEB9: '\u0635',
    0xFEBA: '\u0635',
    0xFEBB: '\u0635',
    0xFEBC: '\u0635',
    0xFEBD: '\u0636',
    0xFEBE: '\u0636',
    0xFEBF: '\u0636',
    0xFEC0: '\u0636',
    0xFEC1: '\u0637',
    0xFEC2: '\u0637',
    0xFEC3: '\u0637',
    0xFEC4: '\u0637',
    0xFEC5: '\u0638',
    0xFEC6: '\u0638',
    0xFEC7: '\u0638',
    0xFEC8: '\u0638',
    0xFEC9: '\u0639',
    0xFECA: '\u0639',
    0xFECB: '\u0639',
    0xFECC: '\u0639',
    0xFECD: '\u063a',
    0xFECE: '\u063a',
    0xFECF: '\u063a',
    0xFED0: '\u063a',
    0xFED1: '\u0641',
    0xFED2: '\u0641',
    0xFED3: '\u0641',
    0xFED4: '\u0641',
    0xFED5: '\u0642',
    0xFED6: '\u0642',
    0xFED7: '\u0642',
    0xFED8: '\u0642',
    0xFED9: '\u0643',
    0xFEDA: '\u0643',
    0xFEDB: '\u0643',
    0xFEDC: '\u0643',
    0xFEDD: '\u0644',
    0xFEDE: '\u0644',
    0xFEDF: '\u0644',
    0xFEE0: '\u0644',
    0xFEE1: '\u0645',
    0xFEE2: '\u0645',
    0xFEE3: '\u0645',
    0xFEE4: '\u0645',
    0xFEE5: '\u0646',
    0xFEE6: '\u0646',
    0xFEE7: '\u0646',
    0xFEE8: '\u0646',
    0xFEE9: '\u0647',
    0xFEEA: '\u0647',
    0xFEEB: '\u0647',
    0xFEEC: '\u0647',
    0xFEED: '\u0648',
    0xFEEE: '\u0648',
    0xFEEF: '\u0649',
    0xFEF0: '\u0649',
    0xFEF1: '\u064a',
    0xFEF2: '\u064a',
    0xFEF3: '\u064a',
    0xFEF4: '\u064a',
    0xFEF5: '\u0644\u0622',
    0xFEF6: '\u0644\u0622',
    0xFEF7: '\u0644\u0623',
    0xFEF8: '\u0644\u0623',
    0xFEF9: '\u0644\u0625',
    0xFEFA: '\u0644\u0625',
    0xFEFB: '\u0644\u0627',
    0xFEFC: '\u0644\u0627'
};
