import { PdfFontStyle, Rectangle, PdfColor } from '@syncfusion/ej2-pdf';
/**
 * Represents a single line of extracted text from the PDF page.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * // Initialize a new instance of the `PdfDataExtractor` class
 * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
 * // Extract `TextLine` from the PDF document.
 * let textLines: Array<TextLine> = extractor.extractTextLines({ startPageIndex: 0, endPageIndex: document.pageCount-1});
 * textLines.forEach((textLine: TextLine) => {
 *   // Gets the bounds of the text line.
 *   let lineBounds: Rectangle = textLine.bounds;
 *   // Gets the single line of extracted text from the PDF page.
 *   let line: string = textLine.text;
 *   // Gets the page index of the text line extracted.
 *   let pageIndex: number = textLine.pageIndex;
 *   // Gets the collection of text words extracted from a specified page in a PDF document.
 *   let words: TextWord[] = textLine.words;
 *   // Gets the name of the font used for a particular line of text.
 *   let fontName: string = textLine.fontName;
 *   // Gets the font style used for a particular line of text.
 *   let fontStyle: PdfFontStyle = textLine.fontStyle;
 *   // Gets the font size used for a particular line of text.
 *   let fontSize: number = textLine.fontSize;
 * });
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class TextLine {
    _text: string;
    _wordCollection: TextWord[] = [];
    _fontName: string;
    _fontSize: number;
    _fontStyle: PdfFontStyle;
    _bounds: Rectangle;
    _pageIndex: number;
    /**
     * Gets the single line of extracted text from the PDF page.
     *
     * @returns {string} The single line of extracted text from the PDF page.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Initialize a new instance of the `PdfDataExtractor` class
     * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
     * // Extract `TextLine` from the PDF document.
     * let textLines: Array<TextLine> = extractor.extractTextLines({ startPageIndex: 0, endPageIndex: document.pageCount-1});
     * textLines.forEach((textLine: TextLine) => {
     *   // Gets the single line of extracted text from the PDF page.
     *   let line: string = textLine.text;
     * });
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get text(): string {
        return this._text;
    }
    /**
     * Gets the collection of text words extracted from a specified page in a PDF document.
     *
     * @returns {TextWord[]} The collection of text words extracted from a specified page in a PDF document.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Initialize a new instance of the `PdfDataExtractor` class
     * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
     * // Extract `TextLine` from the PDF document.
     * let textLines: Array<TextLine> = extractor.extractTextLines({ startPageIndex: 0, endPageIndex: document.pageCount-1});
     * textLines.forEach((textLine: TextLine) => {
     *   // Gets the collection of text words extracted from a specified page in a PDF document.
     *   let words: TextWord[] = textLine.words;
     * });
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get words(): TextWord[] {
        return this._wordCollection;
    }
    /**
     * Gets the name of the font used for a particular line of text.
     *
     * @returns {string} The name of the font used for a particular line of text.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Initialize a new instance of the `PdfDataExtractor` class
     * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
     * // Extract `TextLine` from the PDF document.
     * let textLines: Array<TextLine> = extractor.extractTextLines({ startPageIndex: 0, endPageIndex: document.pageCount-1});
     * textLines.forEach((textLine: TextLine) => {
     *   // Gets the name of the font used for a particular line of text.
     *   let fontName: string = textLine.fontName;
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get fontName(): string {
        return this._fontName;
    }
    /**
     * Gets the font size used for a particular line of text.
     *
     * @returns {number} The font size used for a particular line of text.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Initialize a new instance of the `PdfDataExtractor` class
     * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
     * // Extract `TextLine` from the PDF document.
     * let textLines: Array<TextLine> = extractor.extractTextLines({ startPageIndex: 0, endPageIndex: document.pageCount-1});
     * textLines.forEach((textLine: TextLine) => {
     *   // Gets the font size used for a particular line of text.
     *   let fontSize: number = textLine.fontSize;
     * });
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get fontSize(): number {
        return this._fontSize;
    }
    /**
     * Gets the font style used for a particular line of text.
     *
     * @returns {PdfFontStyle} The font style used for a particular line of text.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Initialize a new instance of the `PdfDataExtractor` class
     * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
     * // Extract `TextLine` from the PDF document.
     * let textLines: Array<TextLine> = extractor.extractTextLines({ startPageIndex: 0, endPageIndex: document.pageCount-1});
     * textLines.forEach((textLine: TextLine) => {
     *   // Gets the font style used for a particular line of text.
     *   let fontStyle: number = textLine.fontStyle;
     * });
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get fontStyle(): PdfFontStyle {
        return this._fontStyle;
    }
    /**
     * Gets the bounds of the text line.
     *
     *  @returns {Rectangle} The bounds of the text line.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Initialize a new instance of the `PdfDataExtractor` class
     * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
     * // Extract `TextLine` from the PDF document.
     * let textLines: Array<TextLine> = extractor.extractTextLines({ startPageIndex: 0, endPageIndex: document.pageCount-1});
     * textLines.forEach((textLine: TextLine) => {
     *   // Gets the bounds of the text line.
     *   let lineBounds: Rectangle = textLine.bounds;
     * });
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get bounds(): Rectangle {
        return this._bounds;
    }
    /**
     * Gets the page index of the text line extracted.
     *
     * @returns {number} Gets the page index of the text line extracted.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Initialize a new instance of the `PdfDataExtractor` class
     * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
     * // Extract `TextLine` from the PDF document.
     * let textLines: Array<TextLine> = extractor.extractTextLines({ startPageIndex: 0, endPageIndex: document.pageCount-1});
     * textLines.forEach((textLine: TextLine) => {
     *   // Gets the page index of the text line extracted.
     *   let pageIndex: number = textLine.pageIndex;
     * });
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get pageIndex(): number {
        return this._pageIndex;
    }
}
/**
 * Represents a single word of extracted text from the PDF page.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * // Initialize a new instance of the `PdfDataExtractor` class
 * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
 * // Extract `TextLine` from the PDF document.
 * let textLines: Array<TextLine> = extractor.extractTextLines({ startPageIndex: 0, endPageIndex: document.pageCount-1});
 * textLines.forEach((textLine: TextLine) => {
 *   textLine.words.forEach((textWord: TextWord) => {
 *      // Gets the bounds of the text word.
 *      let wordBounds: Rectangle = textWord.bounds;
 *      // Gets the single word of extracted text from the PDF page.
 *      let word: string = textWord.text;
 *      // Gets the collection of text glyphs extracted from a specified page in a PDF document.
 *      let glyphs: TextGlyph[] = textword.glyphs;
 *      // Gets the name of the font used for a particular word.
 *      let wordFontName: string = textword.fontName;
 *      // Gets the style of the font used for a particular word.
 *      let wordFontStyle: PdfFontStyle = textword.fontStyle;
 *      // Gets the size of the font used for a particular word.
 *      let wordFontSize: number = textword.fontSize;
 *   });
 * });
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class TextWord {
    _text: string;
    _bounds: Rectangle;
    _glyphs: TextGlyph[] = [];
    _fontName: string;
    _fontSize: number;
    _fontStyle: PdfFontStyle;
    _words: string;
    /**
     * Gets the single word of extracted text from the PDF page.
     *
     * @returns {string} The single word of extracted text from the PDF page.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Initialize a new instance of the `PdfDataExtractor` class
     * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
     * // Extract `TextLine` from the PDF document.
     * let textLines: Array<TextLine> = extractor.extractTextLines({ startPageIndex: 0, endPageIndex: document.pageCount-1});
     * textLines.forEach((textLine: TextLine) => {
     *   textLine.words.forEach((textWord: TextWord) => {
     *      // Gets the single word of extracted text from the PDF page.
     *      let word: string = textWord.text;
     *   });
     * });
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get text(): string {
        return this._text;
    }
    /**
     * Gets the collection of text glyphs extracted from a specified page in a PDF document.
     *
     * @returns {TextGlyph[]} The collection of text glyphs extracted from a specified page in a PDF document.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Initialize a new instance of the `PdfDataExtractor` class
     * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
     * // Extract `TextLine` from the PDF document.
     * let textLines: Array<TextLine> = extractor.extractTextLines({ startPageIndex: 0, endPageIndex: document.pageCount-1});
     * textLines.forEach((textLine: TextLine) => {
     *   textLine.words.forEach((textWord: TextWord) => {
     *      // Gets the collection of text glyphs extracted from a specified page in a PDF document.
     *      let glyphs: TextGlyph[] = textword.glyphs;
     *   });
     * });
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get glyphs(): TextGlyph[] {
        return this._glyphs;
    }
    /**
     * Gets the name of the font used for a particular word.
     *
     * @returns {string} The name of the font used for a particular word.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Initialize a new instance of the `PdfDataExtractor` class
     * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
     * // Extract `TextLine` from the PDF document.
     * let textLines: Array<TextLine> = extractor.extractTextLines({ startPageIndex: 0, endPageIndex: document.pageCount-1});
     * textLines.forEach((textLine: TextLine) => {
     *   textLine.words.forEach((textWord: TextWord) => {
     *      // Gets the name of the font used for a particular word.
     *      let wordFontName: string = textword.fontName;
     *   });
     * });
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get fontName(): string {
        return this._fontName;
    }
    /**
     *  Gets the size of the font used for a particular word.
     *
     * @returns {number} The size of the font used for a particular word.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Initialize a new instance of the `PdfDataExtractor` class
     * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
     * // Extract `TextLine` from the PDF document.
     * let textLines: Array<TextLine> = extractor.extractTextLines({ startPageIndex: 0, endPageIndex: document.pageCount-1});
     * textLines.forEach((textLine: TextLine) => {
     *   textLine.words.forEach((textWord: TextWord) => {
     *      // Gets the size of the font used for a particular word.
     *      let wordFontSize: number = textword.fontSize;
     *   });
     * });
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get fontSize(): number {
        return this._fontSize;
    }
    /**
     * Gets the style of the font used for a particular word.
     *
     * @returns {PdfFontStyle} The style of the font used for a particular word.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Initialize a new instance of the `PdfDataExtractor` class
     * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
     * // Extract `TextLine` from the PDF document.
     * let textLines: Array<TextLine> = extractor.extractTextLines({ startPageIndex: 0, endPageIndex: document.pageCount-1});
     * textLines.forEach((textLine: TextLine) => {
     *   textLine.words.forEach((textWord: TextWord) => {
     *      // Gets the style of the font used for a particular word.
     *      let wordFontStyle: PdfFontStyle = textword.fontStyle;
     *   });
     * });
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get fontStyle(): PdfFontStyle {
        return this._fontStyle;
    }
    /**
     * Gets the bounds of the text word.
     *
     * @returns {Rectangle} The bounds of the text word.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Initialize a new instance of the `PdfDataExtractor` class
     * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
     * // Extract `TextLine` from the PDF document.
     * let textLines: Array<TextLine> = extractor.extractTextLines({ startPageIndex: 0, endPageIndex: document.pageCount-1});
     * textLines.forEach((textLine: TextLine) => {
     *   textLine.words.forEach((textWord: TextWord) => {
     *      // Gets the bounds of the text word.
     *      let wordBounds: Rectangle = textWord.bounds;
     *   });
     * });
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get bounds(): Rectangle {
        return this._bounds;
    }
}
/**
 * Represents a single glyph of extracted text from the PDF page.
 * ```typescript
 * // Load an existing PDF document
 * let document: PdfDocument = new PdfDocument(data);
 * // Initialize a new instance of the `PdfDataExtractor` class
 * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
 * // Extract `TextLine` from the PDF document.
 * let textLines: Array<TextLine> = extractor.extractTextLines({ startPageIndex: 0, endPageIndex: document.pageCount-1});
 * textLines.forEach((textLine: TextLine) => {
 *   textLine.words.forEach((textWord: TextWord) => {
 *      textWord.glyphs.forEach((textGlyph: TextGlyph) => {
 *           // Gets the bounds of the text glyph
 *           let glyphBounds: Rectangle = textGlyph.bounds;
 *           // Gets the single character of extracted text from the PDF page.
 *           let character: string = textGlyph.text;
 *           // Gets the font size used for a particular character of the text.
 *           let fontSize: number = textGlyph.fontSize;
 *           // Gets the name of the font used for a particular character of the text.
 *           let fontName: string = textGlyph.fontName;
 *           // Gets the font style used for a particular character of the text.
 *           let fontStyle: PdfFontStyle = textGlyph.fontStyle;
 *           // Gets the text color of the text glyph.
 *           let color: PdfColor = textGlyph.color;
 *           // Gets the value indicating whether the glyph is rotated or not.
 *           let isRotated: boolean = textGlyph.isRotated;
 *      });
 *   });
 * });
 * // Save the document
 * document.save('output.pdf');
 * // Destroy the document
 * document.destroy();
 * ```
 */
export class TextGlyph {
    _text: string;
    _width: number;
    _fontName: string;
    _isHex: boolean = false;
    _charSpacing: number;
    _wordSpacing: number;
    _fontSize: number;
    _isReplace: boolean = false;
    _fontStyle: PdfFontStyle;
    _bounds: Rectangle;
    _color: PdfColor;
    _isRotated: boolean;
    /**
     * Gets the single character of extracted text from the PDF page.
     *
     *  @returns {string} The single character of extracted text from the PDF page.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Initialize a new instance of the `PdfDataExtractor` class
     * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
     * // Extract `TextLine` from the PDF document.
     * let textLines: Array<TextLine> = extractor.extractTextLines({ startPageIndex: 0, endPageIndex: document.pageCount-1});
     * textLines.forEach((textLine: TextLine) => {
     *   textLine.words.forEach((textWord: TextWord) => {
     *      textWord.glyphs.forEach((textGlyph: TextGlyph) => {
     *           // Gets the single character of extracted text from the PDF page.
     *           let character: string = textGlyph.text;
     *      });
     *   });
     * });
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get text(): string {
        return this._text;
    }
    /**
     * Gets the name of the font used for a particular character of the text.
     *
     *  @returns {string} The name of the font used for a particular character of the text.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Initialize a new instance of the `PdfDataExtractor` class
     * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
     * // Extract `TextLine` from the PDF document.
     * let textLines: Array<TextLine> = extractor.extractTextLines({ startPageIndex: 0, endPageIndex: document.pageCount-1});
     * textLines.forEach((textLine: TextLine) => {
     *   textLine.words.forEach((textWord: TextWord) => {
     *      textWord.glyphs.forEach((textGlyph: TextGlyph) => {
     *           // Gets the name of the font used for a particular character of the text.
     *           let fontName: string = textGlyph.fontName;
     *      });
     *   });
     * });
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get fontName(): string {
        return this._fontName;
    }
    /**
     * Gets the font size used for a particular character of the text.
     *
     *  @returns {number} The font size used for a particular character of the text.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Initialize a new instance of the `PdfDataExtractor` class
     * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
     * // Extract `TextLine` from the PDF document.
     * let textLines: Array<TextLine> = extractor.extractTextLines({ startPageIndex: 0, endPageIndex: document.pageCount-1});
     * textLines.forEach((textLine: TextLine) => {
     *   textLine.words.forEach((textWord: TextWord) => {
     *      textWord.glyphs.forEach((textGlyph: TextGlyph) => {
     *           // Gets the font size used for a particular character of the text.
     *           let fontSize: number = textGlyph.fontSize;
     *      });
     *   });
     * });
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get fontSize(): number {
        return this._fontSize;
    }
    /**
     * Gets the font style used for a particular character of the text.
     *
     *  @returns {PdfFontStyle} The font style used for a particular character of the text.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Initialize a new instance of the `PdfDataExtractor` class
     * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
     * // Extract `TextLine` from the PDF document.
     * let textLines: Array<TextLine> = extractor.extractTextLines({ startPageIndex: 0, endPageIndex: document.pageCount-1});
     * textLines.forEach((textLine: TextLine) => {
     *   textLine.words.forEach((textWord: TextWord) => {
     *           // Gets the font style used for a particular character of the text.
     *           let fontStyle: PdfFontStyle = textGlyph.fontStyle;
     *      });
     *   });
     * });
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get fontStyle(): PdfFontStyle {
        return this._fontStyle;
    }
    /**
     * Gets the bounds of the text glyph.
     *
     *  @returns {string} The bounds of the text glyph.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Initialize a new instance of the `PdfDataExtractor` class
     * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
     * // Extract `TextLine` from the PDF document.
     * let textLines: Array<TextLine> = extractor.extractTextLines({ startPageIndex: 0, endPageIndex: document.pageCount-1});
     * textLines.forEach((textLine: TextLine) => {
     *   textLine.words.forEach((textWord: TextWord) => {
     *      textWord.glyphs.forEach((textGlyph: TextGlyph) => {
     *           // Gets the bounds of the text glyph
     *           let glyphBounds: Rectangle = textGlyph.bounds;
     *      });
     *   });
     * });
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get bounds(): Rectangle {
        return this._bounds;
    }
    /**
     * Gets the color of the text glyph.
     *
     *  @returns {PdfColor} Text color as an array of numbers.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Initialize a new instance of the `PdfDataExtractor` class
     * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
     * // Extract `TextLine` from the PDF document.
     * let textLines: Array<TextLine> = extractor.extractTextLines({ startPageIndex: 0, endPageIndex: document.pageCount-1});
     * textLines.forEach((textLine: TextLine) => {
     *   textLine.words.forEach((textWord: TextWord) => {
     *      textWord.glyphs.forEach((textGlyph: TextGlyph) => {
     *           // Gets the text color of the text glyph.
     *           let color: PdfColor = textGlyph.color;
     *      });
     *   });
     * });
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get color(): PdfColor {
        return this._color;
    }
    /**
     * Gets the value indicating whether the glyph is rotated or not.
     *
     *  @returns {boolean} The rotated value of text glyph.
     *
     * ```typescript
     * // Load an existing PDF document
     * let document: PdfDocument = new PdfDocument(data);
     * // Initialize a new instance of the `PdfDataExtractor` class
     * let extractor: PdfDataExtractor = new PdfDataExtractor(document);
     * // Extract `TextLine` from the PDF document.
     * let textLines: Array<TextLine> = extractor.extractTextLines({ startPageIndex: 0, endPageIndex: document.pageCount-1});
     * textLines.forEach((textLine: TextLine) => {
     *   textLine.words.forEach((textWord: TextWord) => {
     *      textWord.glyphs.forEach((textGlyph: TextGlyph) => {
     *           // Gets the value indicating whether the glyph is rotated or not.
     *           let isRotated: boolean = textGlyph.isRotated;
     *      });
     *   });
     * });
     * // Save the document
     * document.save('output.pdf');
     * // Destroy the document
     * document.destroy();
     * ```
     */
    get isRotated(): boolean {
        return this._isRotated;
    }
}
