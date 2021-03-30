/**
 * RTL-Renderer.ts class for EJ2-PDF
 */
import { PdfStringFormat } from './pdf-string-format';
import { PdfTrueTypeFont}  from './pdf-true-type-font';
import { UnicodeTrueTypeFont } from './unicode-true-type-font';
import { TtfReader} from './ttf-reader';
import { PdfString} from './../../primitives/pdf-string';
import { ArabicShapeRenderer} from './rtl/rtl-text-shape';
import { PdfTextDirection} from './../enum';
import { Bidi} from './rtl/rtl-bidirectional';
import { TtfGlyphInfo } from './ttf-glyph-info';
/**
 * `Metrics` of the font.
 * @private
 */
export class RtlRenderer {
//region Constants
        /// Open bracket symbol.
        /// </summary>
        private readonly openBracket : string = '(';
        /// <summary>
        /// Close bracket symbol.
        /// </summary>
        private readonly closeBracket : string = ')';
        //#region Constructors
        /// <summary>
        /// Initializes a new instance of the <see cref="RtlRenderer"/> class.
        /// </summary>
        // public constructor() {
        // }
        //#region Public Methods
        /// <summary>
        /// Layouts text. Changes blocks position in the RTL text.
        /// Ligates the text if needed.
        /// </summary>
        /// <param name="line">Line of the text.</param>
        /// <param name="font">Font to be used for string printing.</param>
        /// <param name="rtl">Font alignment.</param>
        /// <param name="wordSpace">Indicates whether Word Spacing used or not.</param>
        /// <returns>Layout string.</returns>
        public layout(line : string,  font : PdfTrueTypeFont, rtl : boolean, wordSpace : boolean,  format : PdfStringFormat) : string[] {
            if (line == null) {
                throw new Error('ArgumentNullException : line');
            }
            if (font == null) {
                throw new Error('ArgumentNullException : font');
            }
            let result : string[] = [];
            if (font.Unicode) {
                result = this.customLayout(line, rtl, format , font , wordSpace);
            } else {
                result = [];
                result[0] = line;
            }
            return result;
        }
        /// <summary>
        /// Layouts a string and splits it by the words and using correct lay outing.
        /// </summary>
        /// <param name="line">Text line.</param>
        /// <param name="font">Font object.</param>
        /// <param name="rtl">Indicates whether RTL should be applied.</param>
        /// <param name="wordSpace">Indicates whether word spacing is used.</param>
        /// <returns>Array of words if converted, null otherwise.</returns>
        public splitLayout( line : string, font : PdfTrueTypeFont, rtl : boolean, wordSpace : boolean, format : PdfStringFormat): string[] {
            if (line == null) {
                throw new Error('ArgumentNullException : line');
            }
            if (font == null) {
                throw new Error('ArgumentNullException : font');
            }
            let words : string[] = [];
            let system : boolean = false;
            if (!system || words == null) {
                words = this.customSplitLayout(line, font, rtl, wordSpace, format);
            }
            return words;
        }
//#endregion
//#region Implementation
            // private isEnglish( word : string) : boolean
            // {
            //     let c : string = (word.length > 0) ? word[0] : '';
            //     return (c >= '0' && c < 'ÿ');
            // }
            // private keepOrder( words : string, startIndex : number, count: number, result : string[], resultIndex : number) : void
            // {
            //     for (let i : number = 0, ri = resultIndex - count + 1; i < count; ++i, ++ri) {
            //         result[ri] = words[i + startIndex];
            //     }
            // }
        /// <summary>
        /// Uses system API to layout the text.
        /// </summary>
        /// <param name="line">Line of the text to be layouted.</param>
        /// <param name="font">Font which is used for text printing.</param>
        /// <param name="rtl">Indicates whether we use RTL or RTL lay outing of the text container.</param>
        /// <returns>Layout string.</returns>
        /* tslint:disable-next-line:max-line-length */
        public getGlyphIndex( line : string, font : PdfTrueTypeFont, rtl : boolean, /*out*/ glyphs : Uint16Array, custom ?: boolean | null) : { success : boolean, glyphs : Uint16Array } {
                let success : boolean = true;
                let fail : boolean = false;
                if (line == null) {
                    throw new Error('ArgumentNullException : line');
                }
                if (font == null) {
                    throw new Error('ArgumentNullException : font');
                }
                glyphs = null;
                if (line.length === 0) {
                    return { success : fail, glyphs : glyphs };
                }
                let renderer : ArabicShapeRenderer = new ArabicShapeRenderer();
                let text : string = renderer.shape(line, 0);
                let internalFont : UnicodeTrueTypeFont = font.fontInternal as UnicodeTrueTypeFont;
                let ttfReader : TtfReader = internalFont.ttfReader;
                glyphs = new Uint16Array(text.length);
                let i : number = 0;
                for (let k : number = 0, len : number = text.length; k < len; k++) {
                    let ch : string = text[k];
                    let glyphInfo : TtfGlyphInfo = ttfReader.getGlyph(ch);
                    if ( glyphInfo !== null && typeof glyphInfo !== 'undefined' ) {
                        glyphs[i++] = (glyphInfo).index as number;
                    }
                }
                return { success : success, glyphs : glyphs };
        }
        /// <summary>
        /// Uses manual algorithm for text lay outing.
        /// </summary>
        /// <param name="line">Line of the text to be layouted.</param>
        /// <param name="font">Font which is used for text printing.</param>
        /// <param name="rtl">Indicates whether we use RTL or RTL lay outing of the text container.</param>
        /// <param name="wordSpace">If true - word spacing is used.</param>
        /// <returns>layout string array.</returns>
        public customLayout(line : string, rtl : boolean, format : PdfStringFormat) : string
        public customLayout(line : string, rtl : boolean, format : PdfStringFormat, font : PdfTrueTypeFont, wordSpace : boolean): string[]
        /* tslint:disable-next-line:max-line-length */
        public customLayout(line : string, rtl : boolean, format : PdfStringFormat, font ?: PdfTrueTypeFont, wordSpace ?: boolean): string[] | string {
            if (wordSpace === null || typeof wordSpace === 'undefined' ) {
                if (line == null) {
                    throw new Error('ArgumentNullException : line');
                }
                let result : string = null;
                //bidirectional order.
                if (format !== null && typeof format !== 'undefined' && format.textDirection !== PdfTextDirection.None) {
                    let bidi : Bidi = new Bidi();
                    result = bidi.getLogicalToVisualString(line, rtl);
                }
                return result;
            } else {
                if (line == null) {
                    throw new Error('ArgumentNullException : line');
                }
                if (font == null) {
                    throw new Error('ArgumentNullException : font');
                }
                let layouted : string = null;
                if (format !== null && typeof format !== 'undefined' && format.textDirection !== PdfTextDirection.None) {
                    let renderer : ArabicShapeRenderer = new ArabicShapeRenderer();
                    let txt : string = renderer.shape(line, 0);
                    layouted = this.customLayout(txt, rtl, format);
                }
                // else {
                //     layouted = this.customLayout(line, rtl, format);
                // }
                // We have unicode font, but from the file.        
                let result : string[] = [];
                // Split the text by words if word spacing is not default.
                if (wordSpace) {
                    let words : string[] = layouted.split('');
                    let count : number = words.length;
                    for (let i : number = 0; i < count; i++) {
                        words[i] = this.addChars(font, words[i]);
                    }
                    result = words;
                } else {
                    result = [];
                    result[0] = this.addChars(font, layouted);
                }
                return result;
            }
        }

        /// <summary>
        /// Add information about used glyphs to the font.
        /// </summary>
        /// <param name="font">Font used for text rendering.</param>
        /// <param name="glyphs">Array of used glyphs.</param>
        /// <returns>String in the form to be written to the file.</returns>
        public addChars( font : PdfTrueTypeFont,  glyphs : string) : string {
                let line : string = glyphs;
                if (font == null) {
                    throw new Error('ArgumentNullException : font');
                }
                if (line == null) {
                    throw new Error('ArgumentNullException : line');
                }
                let text : string = line;
                let internalFont : UnicodeTrueTypeFont = font.fontInternal as UnicodeTrueTypeFont;
                let ttfReader : TtfReader = internalFont.ttfReader;
                font.setSymbols(text);
                // Reconvert string according to unicode standard.
                text = ttfReader.convertString(text);
                let bytes : number[] = PdfString.toUnicodeArray(text, false);
                text = PdfString.byteToString(bytes);
                return text;
            // else {
            //     if (font == null) {
            //         throw new Error('ArgumentNullException : font');
            //     }
            //     if (glyphs == null) {
            //         throw new Error('ArgumentNullException : glyphs');
            //     }
            //     // Mark the chars as used.
            //     let text : string = '';
            //     font.setSymbols(glyphs);
            //     // Create string from the glyphs.
            //     
            //     let chars : string[] = [];
            //     for (let i : number = 0; i < glyphs.length; i++) {
            //         chars[i] = glyphs[i].toString();
            //     }
            //     for (let j : number = 0 ; j < chars.length; j++) {
            //         text = text + chars[j];
            //     }
            //     let bytes : number[] = PdfString.toUnicodeArray(text, false);
            //     text = PdfString.byteToString(bytes);
            //     return text;
            // }
        }

        /// <summary>
        /// Layouts a string and splits it by the words by using custom lay outing.
        /// </summary>
        /// <param name="line">Text line.</param>
        /// <param name="font">Font object.</param>
        /// <param name="rtl">Indicates whether RTL should be applied.</param>
        /// <param name="wordSpace">Indicates whether word spacing is used.</param>
        /// <returns>Array of words if converted, null otherwise.</returns>
        /* tslint:disable-next-line:max-line-length */
        public customSplitLayout(line : string, font : PdfTrueTypeFont, rtl : boolean, wordSpace : boolean, format : PdfStringFormat) : string[] {
            if (line == null) {
                throw new Error('ArgumentNullException : line');
            }
            if (font == null) {
                throw new Error('ArgumentNullException : font');
            }
            let reversedLine : string  = this.customLayout(line, rtl, format);
            let words : string[]  = reversedLine.split('');
            return words;
        }
//#endregion
    }