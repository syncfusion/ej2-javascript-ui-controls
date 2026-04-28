import { PdfStringFormat } from './../../fonts/pdf-string-format';
import { PdfTrueTypeFont, _UnicodeLine }  from './../../fonts/pdf-standard-font';
import { _UnicodeTrueTypeFont } from './../../fonts/unicode-true-type-font';
import { _TrueTypeReader, _TrueTypeGlyph } from './../../fonts/ttf-reader';
import { _ArabicShapeRenderer} from './../../graphics/rightToLeft/text-shape';
import { _Bidirectional} from './../../graphics/rightToLeft/bidirectional';
import { PdfTextDirection} from './../../enumerator';
import { _stringToUnicodeArray, _bytesToString } from './../../utils';
/**
 * Renderer for right to left (RTL) scripts that handles BiDi reordering,
 * Arabic shaping, and TrueType glyph encoding needed for PDF text output.
 *
 * @private
 */
export class _RtlRenderer {
    /**
     * Opening bracket character for bracket pairing resolution.
     *
     * @private
     */
    _openBracket: string = '(';
    /**
     * Closing bracket character for bracket pairing resolution.
     *
     * @private
     */
    _closeBracket: string = ')';
    /**
     * Produces a shaped and visually ordered representation of the input line for the
     * specified font and layout settings, returning encoded chunks ready for drawing.
     * For non Unicode fonts, the input line is returned as a single chunk.
     *
     * @private
     * @param {string} line The input text line (logical order).
     * @param {PdfTrueTypeFont} font The TTF font used for shaping/encoding.
     * @param {boolean} rtl Paragraph base direction (true = RTL).
     * @param {boolean} wordSpace When true, returns an array split into characters; otherwise a single item.
     * @param {PdfStringFormat} format String format providing text direction.
     * @returns {string[]} The shaped and reordered text chunks encoded for the font.
     */
    _layout(line: string, font: PdfTrueTypeFont, rtl: boolean, wordSpace: boolean, format: PdfStringFormat): string[] {
        let result: string[] = [];
        if (font !== null && typeof font !== 'undefined' && line !== null && typeof line !== 'undefined') {
            if (font._isUnicode) {
                result = this._customLayout(line, rtl, format, font, wordSpace);
            } else {
                result = [];
                result[0] = line;
            }
        }
        return result;
    }
    /**
     * Splits the shaped and visually ordered result into character sized chunks,
     * suitable for per glyph placement and spacing logic.
     *
     * @private
     * @param {string} line The input text line (logical order).
     * @param {PdfTrueTypeFont} font The TTF font used for shaping/encoding.
     * @param {boolean} rtl Paragraph base direction (true = RTL).
     * @param {boolean} wordSpace When true, returns an array of single character chunks.
     * @param {PdfStringFormat} format String format providing text direction.
     * @returns {string[]} An array of encoded character chunks.
     */
    _splitLayout(line: string, font: PdfTrueTypeFont, rtl: boolean, wordSpace: boolean, format: PdfStringFormat): string[] {
        let words: string[] = [];
        if (font !== null && typeof font !== 'undefined' && line !== null && typeof line !== 'undefined') {
            const system: boolean = false;
            if (!system) {
                words = this._customSplitLayout(line, font, rtl, wordSpace, format);
            }
        }
        return words;
    }
    /**
     * Shapes the input line, resolves glyph indices via the font's
     * TrueType reader, and returns the glyph index array packaged in `_UnicodeLine`.
     *
     * @private
     * @param {string} line The input text line to map to glyphs.
     * @param {PdfTrueTypeFont} font The TTF font used to resolve glyph indices.
     * @param {number[]} glyphs Output glyph index array (ignored on input).
     * @returns {_UnicodeLine} A result object containing the glyph index list.
     */
    _getGlyphIndex(line: string, font: PdfTrueTypeFont, glyphs: number[]): _UnicodeLine {
        glyphs = [];
        if (font !== null && typeof font !== 'undefined' && line !== null && typeof line !== 'undefined') {
            if (line.length === 0) {
                return {_result: false, _glyphIndex: glyphs};
            }
            const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
            const text: string = renderer._shape(line);
            const internalFont: _UnicodeTrueTypeFont = font._fontInternal as _UnicodeTrueTypeFont;
            const ttfReader: _TrueTypeReader = internalFont._ttfReader;
            glyphs = [text.length];
            let i: number = 0;
            for (let k: number = 0, len: number = text.length; k < len; k++) {
                const ch: string = text[<number>k];
                const glyphInfo: _TrueTypeGlyph = ttfReader._getGlyph(ch);
                if (glyphInfo !== null && typeof glyphInfo !== 'undefined') {
                    glyphs[i++] = (glyphInfo)._index as number;
                }
            }
        }
        const unicodeLine: _UnicodeLine = new _UnicodeLine();
        unicodeLine._result = true;
        unicodeLine._glyphIndex = glyphs;
        return unicodeLine;
    }
    /**
     * Performs RTL/BiDi visual reordering and when the full signature is used
     * Arabic shaping + TrueType encoding. When called without `font`/`wordSpace`,
     * returns a visually ordered string; otherwise returns encoded chunks.
     *
     * @private
     * @param {string} line The input text line (logical order).
     * @param {boolean} rtl Paragraph base direction (true = RTL).
     * @param {PdfStringFormat} format String format providing text direction.
     * @param {PdfTrueTypeFont} [font] The font to encode with (required when `wordSpace` is provided).
     * @param {boolean} [wordSpace] When true, returns per character encoded chunks; otherwise a single encoded string.
     * @returns {string | string[]} A visually ordered string (no `font`/`wordSpace`) or encoded chunk(s).
     */
    _customLayout(line: string, rtl: boolean, format: PdfStringFormat): string
    _customLayout(line: string, rtl: boolean, format: PdfStringFormat, font: PdfTrueTypeFont, wordSpace: boolean): string[]
    _customLayout(line: string, rtl: boolean, format: PdfStringFormat, font?: PdfTrueTypeFont, wordSpace?: boolean): string[] | string {
        if (wordSpace === null || typeof wordSpace === 'undefined' ) {
            let result: string = null;
            if (line !== null && typeof line !== 'undefined') {
                if (format !== null && typeof format !== 'undefined' && format.textDirection !== PdfTextDirection.none) {
                    const bidi : _Bidirectional = new _Bidirectional();
                    result = bidi._getLogicalToVisualString(line, rtl);
                }
            }
            return result;
        } else {
            let layouted: string = '';
            let result: string[] = [];
            if (line !== null && typeof line !== 'undefined' && font !== null && typeof font !== 'undefined') {
                if (format !== null && typeof format !== 'undefined' && format.textDirection !== PdfTextDirection.none) {
                    const renderer: _ArabicShapeRenderer = new _ArabicShapeRenderer();
                    const txt: string = renderer._shape(line);
                    layouted = this._customLayout(txt, rtl, format);
                }
                if (wordSpace) {
                    let words: string[] = layouted.split('');
                    words = words.map((word: string) => this._addCharacter(font, word));
                    result = words;
                } else {
                    result = [];
                    result[0] = this._addCharacter(font, layouted);
                }
            }
            return result;
        }
    }
    /**
     * Encodes a string into the fonts TrueType encoding by setting symbols,
     * converting text through the TTF reader, and returning a PDF safe byte string.
     *
     * @private
     * @param {PdfTrueTypeFont} font The TrueType font used for encoding.
     * @param {string} glyphs The input text (already shaped/reordered).
     * @returns {string} The encoded string suitable for PDF content streams.
     */
    _addCharacter(font: PdfTrueTypeFont, glyphs: string): string {
        if (font !== null && typeof font !== 'undefined' && glyphs !== null && typeof glyphs !== 'undefined') {
            const internalFont: _UnicodeTrueTypeFont = font._fontInternal as _UnicodeTrueTypeFont;
            const ttfReader: _TrueTypeReader = internalFont._ttfReader;
            font._setSymbols(glyphs);
            glyphs = ttfReader._convertString(glyphs);
            const bytes: Uint8Array = _stringToUnicodeArray(glyphs);
            glyphs = _bytesToString(bytes);
        }
        return glyphs;
    }
    /**
     * A convenience wrapper that runs RTL reordering + shaping and splits the
     * result into per character segments.
     *
     * @private
     * @param {string} line The input text line.
     * @param {PdfTrueTypeFont} font The TrueType font.
     * @param {boolean} rtl Paragraph base direction.
     * @param {boolean} wordSpace Whether to split into single character segments.
     * @param {PdfStringFormat} format String format providing text direction.
     * @returns {string[]} The visually ordered characters.
     */
    _customSplitLayout(line: string, font: PdfTrueTypeFont, rtl: boolean, wordSpace: boolean, format: PdfStringFormat): string[] {
        let words: string[] = [];
        if (line !== null && typeof line !== 'undefined') {
            const reversedLine: string = this._customLayout(line, rtl, format);
            words = reversedLine.split('');
        }
        return words;
    }
}
