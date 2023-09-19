import { PdfStringFormat } from './../../fonts/pdf-string-format';
import { PdfTrueTypeFont, _UnicodeLine }  from './../../fonts/pdf-standard-font';
import { _UnicodeTrueTypeFont } from './../../fonts/unicode-true-type-font';
import { _TrueTypeReader, _TrueTypeGlyph } from './../../fonts/ttf-reader';
import { _ArabicShapeRenderer} from './../../graphics/rightToLeft/text-shape';
import { _Bidirectional} from './../../graphics/rightToLeft/bidirectional';
import { PdfTextDirection} from './../../enumerator';
import { _stringToUnicodeArray, _bytesToString } from './../../utils';
export class _RtlRenderer {
    _openBracket: string = '(';
    _closeBracket: string = ')';
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
                const ch: string = text[Number.parseInt(k.toString(), 10)];
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
                    const words: string[] = layouted.split('');
                    const count: number = words.length;
                    for (let i: number = 0; i < count; i++) {
                        words[Number.parseInt(i.toString(), 10)] = this._addCharacter(font, words[Number.parseInt(i.toString(), 10)]);
                    }
                    result = words;
                } else {
                    result = [];
                    result[0] = this._addCharacter(font, layouted);
                }
            }
            return result;
        }
    }
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
    _customSplitLayout(line: string, font: PdfTrueTypeFont, rtl: boolean, wordSpace: boolean, format: PdfStringFormat): string[] {
        let words: string[] = [];
        if (line !== null && typeof line !== 'undefined') {
            const reversedLine: string = this._customLayout(line, rtl, format);
            words = reversedLine.split('');
        }
        return words;
    }
}
