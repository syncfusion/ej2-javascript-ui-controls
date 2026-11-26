import { PdfStringFormat } from './pdf-string-format';
import { PdfFont, PdfTrueTypeFont } from './pdf-standard-font';
import { _OtfGlyphInfoList, _OtfLayoutEngine } from './complex-script';
import { _detectOtfScript } from '../utils';
import { _UnicodeTrueTypeFont } from './unicode-true-type-font';
import { _OtfScript, _PdfWordWrapType, PdfTextDirection } from './../enumerator';
import { Size } from '../pdf-document-helper';
/**
 * Lays out text into lines within a given size using the specified font and format.
 *
 * @private
 */
export class _PdfStringLayouter {
    /**
     * Font used to measure and lay out the text.
     *
     * @private
     */
    _font: PdfFont;
    /**
     * String format settings guiding the layout process.
     *
     * @private
     */
    _format: PdfStringFormat;
    /**
     * Target width and height used for layout calculations.
     *
     * @private
     */
    _size: number[];
    /**
     * Target rectangle specified as [x, y, width, height].
     *
     * @private
     */
    _rectangle: number[];
    /**
     * Page height used for pagination decisions.
     *
     * @private
     */
    _pageHeight: number;
    /**
     * Tokenizer used to split the input string into layout units.
     *
     * @private
     */
    _reader: _StringTokenizer;
    /**
     * Performs the full layout pass and returns the computed layout result.
     *
     * @private
     * @param {string} text - Text to layout.
     * @param {PdfFont} font - Font used for measuring and layout.
     * @param {PdfStringFormat} format - String formatting and wrapping options.
     * @param {number[]} size - Target size as [width, height].
     * @returns {_PdfStringLayoutResult} The result of the layout operation.
     */
    _layout(text: string, font: PdfFont, format: PdfStringFormat, size: number[]): _PdfStringLayoutResult {
        this._initialize(text, font, format, size);
        const result: _PdfStringLayoutResult = this._doLayout();
        this._clear();
        return result;
    }
    /**
     * Initializes the layouter with input text font format and target size.
     *
     * @private
     * @param {string} text - Text to layout.
     * @param {PdfFont} font - Font used for measuring and drawing.
     * @param {PdfStringFormat} format - Formatting options to apply.
     * @param {number[]} size - Target size as [width, height].
     * @returns {void} nothing.
     */
    _initialize(text: string, font: PdfFont, format: PdfStringFormat, size: number[]): void {
        this._font = font;
        this._format = format;
        this._size = size;
        this._rectangle = [0, 0, size[0], size[1]];
        this._reader = new _StringTokenizer(text);
        this._pageHeight = 0;
    }
    /**
     * Releases references and closes the tokenizer after layout completes.
     *
     * @private
     * @returns {void} nothing.
     */
    _clear(): void {
        this._font = null;
        this._format = null;
        this._reader._close();
        this._reader = null;
    }
    /**
     * Iterates through input lines and builds the layout using wrapping rules.
     *
     * @private
     * @returns {_PdfStringLayoutResult} The final aggregated layout result.
     */
    _doLayout(): _PdfStringLayoutResult {
        const result: _PdfStringLayoutResult = new _PdfStringLayoutResult();
        let lineResult: _PdfStringLayoutResult = new _PdfStringLayoutResult();
        const lines: _LineInfo[] = [];
        let line: string = this._reader._peekLine();
        let lineIndent: number = this._getLineIndent(true);
        while (line !== null) {
            lineResult = this._layoutLine(line, lineIndent);
            if (typeof lineResult !== 'undefined' && lineResult !== null) {
                let numSymbolsInserted: number = 0;
                const returnedValue: { success: boolean, flag: number } = this._copyToResult(result,
                                                                                             lineResult,
                                                                                             lines,
                                                                                             numSymbolsInserted);
                const success: boolean = returnedValue.success;
                numSymbolsInserted = returnedValue.flag;
                if (!success) {
                    this._reader._read(numSymbolsInserted);
                    break;
                }
            }
            this._reader._readLine();
            line = this._reader._peekLine();
            lineIndent = this._getLineIndent(false);
        }
        this._finalizeResult(result, lines);
        return result;
    }
    /**
     * Calculates the indent for the current line based on format and line position.
     *
     * @private
     * @param {boolean} firstLine - Whether the current line is the first in the paragraph.
     * @returns {number} The computed indent in points.
     */
    _getLineIndent(firstLine: boolean): number {
        let lineIndent: number = 0;
        if (this._format) {
            lineIndent = (firstLine) ? this._format.firstLineIndent : this._format.paragraphIndent;
            lineIndent = (this._size[0] > 0) ? Math.min(this._size[0], lineIndent) : lineIndent;
        }
        return lineIndent;
    }
    /**
     * Returns the line height using font metrics and optional line spacing.
     *
     * @private
     * @returns {number} The line height in points.
     */
    _getLineHeight(): number {
        let height: number = this._font._getHeight();
        if (this._format && this._format.lineSpacing !== 0) {
            height = this._format.lineSpacing + this._font._getHeight();
        }
        return height;
    }
    /**
     * Returns the line width using font metrics and optional line spacing.
     *
     * @private
     * @param {string} line to get the width.
     * @returns {number} The  width in points.
     */
    _getLineWidth(line: string): number {
        return this._font.getLineWidth(line, this._format);
    }
    /**
     * Shapes the specified line when eligible.
     *
     * @private
     * @param {string} line Line to shape.
     * @returns {_OtfGlyphInfoList} Shaped glyph list or null.
     */
    _shapeLine(line: string): _OtfGlyphInfoList {
        const formatEnabled: boolean = this._format !== null && typeof this._format !== 'undefined' &&
            this._format.complexScript;
        if (!formatEnabled) {
            const retained: _OtfGlyphInfoList = this._retainedShapedList(line);
            if (retained !== null) {
                return retained;
            }
            return null;
        }
        if (!(this._font instanceof PdfTrueTypeFont)) {
            return null;
        }
        const ttfFont: PdfTrueTypeFont = this._font as PdfTrueTypeFont;
        if (!ttfFont.isUnicode || !(ttfFont._fontInternal instanceof _UnicodeTrueTypeFont)) {
            return null;
        }
        return new _OtfLayoutEngine()._shapeTextForFont(line, ttfFont, ttfFont._fontInternal);
    }
    /**
     * Returns the shaped glyph list retained on the font for the exact text, or
     * null when no complex-script shaping has been produced for it.
     *
     * @private
     * @param {string} line - Text to look up.
     * @returns {_OtfGlyphInfoList} Retained shaped list or null.
     */
    private _retainedShapedList(line: string): _OtfGlyphInfoList {
        if (!(this._font instanceof PdfTrueTypeFont)) {
            return null;
        }
        const ttfFont: PdfTrueTypeFont = this._font as PdfTrueTypeFont;
        const retained: any = ttfFont._retainedShapedList(line); // eslint-disable-line
        return (retained !== null && typeof retained !== 'undefined') ? retained as _OtfGlyphInfoList : null;
    }
    /**
     * Computes the scaled width in points of a shaped glyph list including format
     * adjustments, used for single-line shaped measurement.
     *
     * @private
     * @param {_OtfGlyphInfoList} list - Shaped glyph list.
     * @returns {number} Width in points.
     */
    private _getShapedWidthInternal(list: _OtfGlyphInfoList): number {
        const ttfFont: PdfTrueTypeFont = this._font as PdfTrueTypeFont;
        let units: number = 0;
        for (let i: number = 0; i < list._length; i++) {
            const glyph: any = list._glyphs[i]; // eslint-disable-line
            units += glyph._width + glyph._xAdvance;
        }
        let width: number = units * (0.001 * ttfFont.size);
        if (this._format !== null && typeof this._format !== 'undefined') {
            if (this._format.characterSpacing !== 0) {
                width += list._length * this._format.characterSpacing;
            }
        }
        return width;
    }
    /**
     * Computes the shaped width of a glyph list for line layout, including the
     * pending line indent handling of the caller.
     *
     * @private
     * @param {_OtfGlyphInfoList} list - Shaped glyph list to measure.
     * @returns {number} Width in points.
     */
    private _getShapedLineWidth(list: _OtfGlyphInfoList): number {
        return this._getShapedWidthInternal(list);
    }
    /**
     * Attaches shaped lines to a per-line layout result and resolves the line
     * direction for later visual ordering (RTL for Arabic/Hebrew runs).
     *
     * @private
     * @param {_PdfStringLayoutResult} lineResult - Per-line result to finalize.
     * @param {_LineInfo[]} lines - Shaped lines to attach.
     * @returns {void} nothing.
     */
    private _finalizeShapedResult(lineResult: _PdfStringLayoutResult, lines: _LineInfo[]): void {
        lineResult._layoutLines = lines;
        const script: _OtfScript = _detectOtfScript(this._reader._text);
        const rtl: boolean = (this._format !== null && typeof this._format !== 'undefined' &&
            this._format.textDirection === PdfTextDirection.rightToLeft) ||
            script === _OtfScript.arabic || script === _OtfScript.hebrew;
        for (let i: number = 0; i < lines.length; i++) {
            lines[<number>i]._bidiLevels = rtl ? [2] : [1];
        }
    }
    /**
     * Breaks a single input line into layout chunks according to wrap rules.
     *
     * @private
     * @param {string} line - Source line to be laid out.
     * @param {number} lineIndent - Current line indent to apply.
     * @returns {_PdfStringLayoutResult} The layout result for this line.
     */
    _layoutLine(line: string, lineIndent: number): _PdfStringLayoutResult {
        const lineResult: _PdfStringLayoutResult = new _PdfStringLayoutResult();
        lineResult._lineHeight = this._getLineHeight();
        const lines: _LineInfo[] = [];
        const maxWidth: number = this._size[0];
        let lineType: _LineType = _LineType.firstParagraphLine;
        let readWord: boolean = true;
        const shapedList: _OtfGlyphInfoList = this._shapeLine(line);
        let lineWidth: number = 0;
        if (shapedList === null) {
            lineWidth = this._getLineWidth(line) + lineIndent;
        }
        if (shapedList !== null) {
            const shapedWidth: number = this._getShapedLineWidth(shapedList);
            const shapedInfo: _LineInfo = new _LineInfo();
            shapedInfo._text = line;
            shapedInfo._width = shapedWidth + lineIndent;
            shapedInfo._lineType = _LineType.newLineBreak | lineType;
            shapedInfo._openTypeGlyphList = shapedList;
            if (maxWidth <= 0 || Math.round(shapedInfo._width) <= Math.round(maxWidth)) {
                lines.push(shapedInfo);
                const size: Size = lineResult._actualSize;
                size.height = size.height + this._getLineHeight();
                size.width = Math.max(size.width, shapedInfo._width);
                lineResult._size = size;
            } else {
                let rest: string = line;
                let indent: number = lineIndent;
                let type: _LineType = lineType;
                while (rest.length > 0) {
                    let breakAt: number = -1;
                    let fittedList: _OtfGlyphInfoList = null;
                    let fittedWidth: number = 0;
                    let end: number = 0;
                    while (end < rest.length) {
                        end = rest.indexOf(' ', end + 1);
                        if (end < 0) {
                            end = rest.length;
                        }
                        const candidate: string = rest.substring(0, end);
                        const candidateList: _OtfGlyphInfoList = this._shapeLine(candidate);
                        const candidateWidth: number = (candidateList !== null) ?
                            this._getShapedWidthInternal(candidateList) : this._getLineWidth(candidate);
                        if (breakAt >= 0 && Math.round(candidateWidth + indent) > Math.round(maxWidth)) {
                            break;
                        }
                        breakAt = end;
                        fittedList = candidateList;
                        fittedWidth = candidateWidth;
                    }
                    if (breakAt <= 0) {
                        breakAt = rest.indexOf(' ');
                        if (breakAt < 0) {
                            breakAt = rest.length;
                        }
                        fittedList = this._shapeLine(rest.substring(0, breakAt));
                        fittedWidth = (fittedList !== null) ?
                            this._getShapedWidthInternal(fittedList) : this._getLineWidth(rest.substring(0, breakAt));
                    }
                    const fitted: string = rest.substring(0, breakAt);
                    const fittedInfo: _LineInfo = new _LineInfo();
                    fittedInfo._text = fitted;
                    fittedInfo._width = fittedWidth + indent;
                    fittedInfo._lineType = ((breakAt < rest.length) ? _LineType.layoutBreak : _LineType.newLineBreak) | type;
                    fittedInfo._openTypeGlyphList = fittedList;
                    lines.push(fittedInfo);
                    const size: Size = lineResult._actualSize;
                    size.height = size.height + this._getLineHeight();
                    size.width = Math.max(size.width, fittedInfo._width);
                    lineResult._size = size;
                    rest = rest.substring(breakAt).replace(/^\s+/, '');
                    indent = 0;
                    type = _LineType.none;
                }
            }
            this._finalizeShapedResult(lineResult, lines);
            return lineResult;
        }
        if (maxWidth <= 0 || Math.round(lineWidth) <= Math.round(maxWidth)) {
            this._addToLineResult(lineResult, lines, line, lineWidth, _LineType.newLineBreak | lineType);
        } else {
            let builder: string = '';
            let curLine: string = '';
            lineWidth = lineIndent;
            let curIndent: number = lineIndent;
            const reader: _StringTokenizer = new _StringTokenizer(line);
            let word: string = reader._peekWord();
            if (word.length !== reader._length) {
                if (word === ' ') {
                    curLine = curLine + word;
                    builder = builder + word;
                    reader._position += 1;
                    word = reader._peekWord();
                }
            }
            while (word !== null) {
                curLine = curLine + word;
                let curLineWidth: number = this._getLineWidth(curLine.toString()) + curIndent;
                if (curLine.toString() === ' ') {
                    curLine = '';
                    curLineWidth = 0;
                }
                if (curLineWidth > maxWidth) {
                    if (this._getWrapType() === _PdfWordWrapType.none) {
                        break;
                    }
                    if (curLine.length === word.length) {
                        if (this._getWrapType() === _PdfWordWrapType.wordOnly) {
                            lineResult._remainder = line.substring(reader._position);
                            break;
                        } else if (curLine.length === 1) {
                            builder = builder + word;
                            break;
                        } else {
                            readWord = false;
                            curLine = '';
                            word = reader._peek().toString();
                            continue;
                        }
                    } else {
                        if (this._getLineWidth(word.toString()) > maxWidth) {
                            if (typeof this._format !== 'undefined' && this._format !== null) {
                                this._format._wordWrap = _PdfWordWrapType.character;
                            }
                        } else {
                            if (typeof this._format !== 'undefined' && this._format !== null) {
                                this._format._wordWrap = _PdfWordWrapType.word;
                            }
                        }
                        if (this._getWrapType() !== _PdfWordWrapType.character || !readWord) {
                            const stringValue: string = builder.toString();
                            if (stringValue !== ' ') {
                                this._addToLineResult(lineResult, lines, stringValue, lineWidth, _LineType.layoutBreak | lineType);
                            }
                            curLine = '';
                            builder = '';
                            lineWidth = 0;
                            curIndent = 0;
                            curLineWidth = 0;
                            lineType = _LineType.none;
                            word = (readWord) ? word : reader._peekWord();
                            readWord = true;
                        } else {
                            readWord = false;
                            curLine = '';
                            curLine = curLine + builder.toString();
                            word = reader._peek().toString();
                        }
                        continue;
                    }
                }
                builder = builder + word;
                lineWidth = curLineWidth;
                if (readWord) {
                    reader._readWord();
                    word = reader._peekWord();
                } else {
                    reader._read();
                    word = reader._peek().toString();
                }
            }
            if (builder.length > 0) {
                this._addToLineResult(lineResult,
                                      lines,
                                      builder.toString(),
                                      lineWidth,
                                      _LineType.newLineBreak | _LineType.lastParagraphLine);
            }
            reader._close();
        }
        lineResult._layoutLines = [];
        for (let index: number = 0; index < lines.length; index++) {
            lineResult._layoutLines.push(lines[index]); // eslint-disable-line
        }
        return lineResult;
    }
    /**
     * Adds a computed line to the result and updates accumulated size.
     *
     * @private
     * @param {_PdfStringLayoutResult} lineResult - The per-line layout result to update.
     * @param {_LineInfo[]} lines - Accumulated lines buffer.
     * @param {string} line - Text of the current line.
     * @param {number} lineWidth - Measured line width.
     * @param {_LineType} breakType - Line break flags for this line.
     * @returns {void} nothing.
     */
    _addToLineResult(lineResult: _PdfStringLayoutResult,
                     lines: _LineInfo[],
                     line: string,
                     lineWidth: number,
                     breakType: _LineType): void {
        const info: _LineInfo = new _LineInfo();
        info._text = line;
        info._width = lineWidth;
        info._lineType = breakType;
        lines.push(info);
        const size: Size = lineResult._actualSize;
        size.height = size.height + this._getLineHeight();
        size.width = Math.max(size.width, lineWidth);
        lineResult._size = size;
    }
    /**
     * Copies laid out lines into the final result respecting height limits.
     *
     * @private
     * @param {_PdfStringLayoutResult} result - Aggregated layout result to append to.
     * @param {_PdfStringLayoutResult} lineResult - Per line layout result to consume.
     * @param {_LineInfo[]} lines - Temporary buffer for accepted lines.
     * @param {number} flag - Placeholder/offset reference; updated with consumed char count.
     * @returns {{ success: boolean, flag: number }} Copy outcome and consumed character count.
     */
    _copyToResult(result: _PdfStringLayoutResult,
                  lineResult: _PdfStringLayoutResult,
                  lines: _LineInfo[],
                  flag: number): { success: boolean, flag: number } {
        let success: boolean = true;
        const allowPartialLines: boolean = (this._format && !this._format.lineLimit);
        let height: number = result._actualSize.height;
        let maxHeight: number = this._size[1];
        if ((this._pageHeight > 0) && (maxHeight + this._rectangle[1] > this._pageHeight)) {
            maxHeight = this._rectangle[1] - this._pageHeight;
            maxHeight = Math.max(maxHeight, -maxHeight);
        }
        flag = 0;
        if (lineResult._lines !== null) {
            for (let i: number = 0, len: number = lineResult._lines.length; i < len; i++) {
                const expHeight: number = height + lineResult._lineHeight;
                const value: number = Math.floor(expHeight);
                if (value <= maxHeight || maxHeight <= 0 || allowPartialLines) {
                    let info: _LineInfo = lineResult._lines[i]; // eslint-disable-line
                    flag += info._text.length;
                    info = this._trimLine(info, (lines.length === 0));
                    lines.push(info);
                    const size: Size = result._actualSize;
                    size.width = Math.max(size.width, info._width);
                    result._size = size;
                    if (expHeight >= maxHeight && maxHeight > 0 && this._format && !this._format.noClip && !this._format.lineLimit) {
                        const exceededHeight: number = expHeight - maxHeight;
                        const fitHeight: number = lineResult._lineHeight - exceededHeight;
                        height = height + fitHeight;
                        success = false;
                        break;
                    } else {
                        height = expHeight;
                    }
                } else {
                    success = false;
                    break;
                }
            }
        }
        if (height !== result._size.height) {
            result._size = {width: result._actualSize.width, height: height};
        }
        return { success: success, flag: flag };
    }
    /**
     * Finalizes the layout result with remaining text and line metrics.
     *
     * @private
     * @param {_PdfStringLayoutResult} result - The layout result to finalize.
     * @param {_LineInfo[]} lines - Accepted lines to attach to the result.
     * @returns {void} nothing.
     */
    _finalizeResult(result: _PdfStringLayoutResult, lines: _LineInfo[]): void {
        result._layoutLines = [];
        for (let index: number = 0; index < lines.length; index++) {
            result._layoutLines.push(lines[index]); // eslint-disable-line
        }
        result._lineHeight = this._getLineHeight();
        if (!this._reader._end) {
            result._remainder = this._reader._readToEnd();
        }
    }
    /**
     * Trims leading and trailing spaces and recomputes the line width if needed.
     *
     * @private
     * @param {_LineInfo} info - Line information to trim/update.
     * @param {boolean} firstLine - Whether this is the first paragraph line.
     * @returns {_LineInfo} The updated line information.
     */
    _trimLine(info: _LineInfo, firstLine: boolean): _LineInfo {
        const line: string = info._text.trim();
        let lineWidth: number = info._width;
        if (line.length !== info._text.length) {
            if (info._openTypeGlyphList) {
                const trimmedList: _OtfGlyphInfoList = this._shapeLine(line);
                if (trimmedList !== null) {
                    info._openTypeGlyphList = trimmedList;
                    lineWidth = this._getShapedWidthInternal(trimmedList);
                } else {
                    lineWidth = this._getLineWidth(line);
                }
            } else {
                lineWidth = this._getLineWidth(line);
            }
            if ((info._lineType & _LineType.firstParagraphLine) > 0) {
                lineWidth += this._getLineIndent(firstLine);
            }
        }
        info._text = line;
        info._width = lineWidth;
        return info;
    }
    /**
     * Resolves the active word wrap mode from the current format.
     *
     * @private
     * @returns {_PdfWordWrapType} Active word wrap mode.
     */
    _getWrapType(): _PdfWordWrapType {
        const wrapType: _PdfWordWrapType = (this._format !== null && typeof this._format !== 'undefined') ?
            this._format._wordWrap : _PdfWordWrapType.word;
        return wrapType;
    }
}
/**
 * Holds the outcome of a text layout operation including lines and sizes.
 *
 * @private
 */
export class _PdfStringLayoutResult {
    /**
     * Lines produced as the result of the string layout.
     *
     * @private
     */
    _layoutLines: _LineInfo[];
    /**
     * Remaining text that did not fit in the layout area.
     *
     * @private
     */
    _remainder: string;
    /**
     * Final size occupied by the laid out text.
     *
     * @private
     */
    _size: Size;
    /**
     * Height of each laid out line.
     *
     * @private
     */
    _lineHeight: number;
    /**
     * Gets the measured size of the laid out content with lazy initialization.
     *
     * @private
     * @returns {Size} The measured size.
     */
    get _actualSize(): Size {
        if (typeof this._size === 'undefined') {
            this._size = {width: 0, height: 0};
        }
        return this._size;
    }
    /**
     * Gets the array of laid out line information entries.
     *
     * @private
     * @returns {_LineInfo[]} The laid out lines.
     */
    get _lines(): _LineInfo[] {
        return this._layoutLines;
    }
    /**
     * Indicates whether the layout result contains no lines.
     *
     * @private
     * @returns {boolean} `true` if empty; otherwise `false`.
     */
    get _empty(): boolean {
        return (this._layoutLines === null || this._layoutLines.length === 0);
    }
    /**
     * Gets the total number of lines in the layout result.
     *
     * @private
     * @returns {number} The line count.
     */
    get _lineCount(): number {
        return (!this._empty) ? this._layoutLines.length : 0;
    }
}

/**
 * Represents a single laid out line with its text width and break flags.
 *
 * @private
 */
export class _LineInfo {
    /**
     * Text content of the current line.
     *
     * @private
     */
    _text: string;
    /**
     * Measured width of the current line.
     *
     * @private
     */
    _width: number;
    /**
     * Indicates the type of the line (e.g., first, middle, last).
     *
     * @private
     */
    _lineType: _LineType;
    /**
     * Shaped glyph list retained for measurement and drawing parity.
     * Present only when the complex-script shaped path produced this line.
     *
     * @private
     */
    _openTypeGlyphList?: _OtfGlyphInfoList;
    /**
     * Text direction resolved for the line: 1 = LTR, 2 = RTL (complex-script path).
     *
     * @private
     */
    _bidiLevels?: number[];
}
/**
 * Specifies flags that describe how a line is broken and positioned.
 *
 * @private
 */
export enum _LineType {
    none = 0,
    newLineBreak = 0x0001,
    layoutBreak = 0x0002,
    firstParagraphLine = 0x0004,
    lastParagraphLine = 0x0008
}
/**
 * Parses text into lines words and characters while tracking position.
 *
 * @private
 */
export class _StringTokenizer {
    /**
     * Source text to be tokenized.
     *
     * @private
     */
    _text: string;
    /**
     * Current reading position within the source text.
     *
     * @private
     */
    _position: number = 0;
    static readonly _whiteSpace: string = ' ';
    static readonly _tab: string = '\t';
    static readonly _spaces: string[] = [_StringTokenizer._whiteSpace, _StringTokenizer._tab];
    constructor(textValue: string) {
        if (typeof textValue === 'undefined' || textValue === null) {
            throw new Error('ArgumentNullException:text');
        }
        this._text = textValue;
    }
    /**
     * Gets the total length of the underlying text.
     *
     * @private
     * @returns {number} The total text length.
     */
    get _length(): number {
        return this._text.length;
    }
    /**
     * Indicates whether the tokenizer has reached the end of the text.
     *
     * @private
     * @returns {boolean} `true` if end of text; otherwise `false`.
     */
    get _end(): boolean {
        return (this._position === this._text.length);
    }
    /**
     * Reads the next line from the current position and advances the cursor.
     *
     * @private
     * @returns {string} The next line, or `null` when no lines remain.
     */
    _readLine(): string {
        let position: number = this._position;
        while (position < this._length) {
            const ch: string = this._text[position]; // eslint-disable-line
            let text: string;
            switch (ch) {
            case '\r':
            case '\n':
                text = this._text.substring(this._position, position);
                this._position = position + 1;
                if (((ch === '\r') && (this._position < this._length)) && (this._text[this._position] === '\n')) {
                    this._position++;
                }
                return text;
            }
            position++;
        }
        if (position > this._position) {
            const text2: string = this._text.substring(this._position, position);
            this._position = position;
            return text2;
        }
        return null;
    }
    /**
     * Peeks the next line without advancing the current position.
     *
     * @private
     * @returns {string} The next line, or `null` if none.
     */
    _peekLine(): string {
        const position: number = this._position;
        const line: string = this._readLine();
        this._position = position;
        return line;
    }
    /**
     * Reads the next word or delimiter run and advances the position.
     *
     * @private
     * @returns {string} The next word or delimiter sequence, or `null` if none.
     */
    _readWord(): string {
        let position: number = this._position;
        while (position < this._length) {
            const ch: string = this._text[position]; // eslint-disable-line
            let text: string;
            switch (ch) {
            case '\r':
            case '\n':
                text = this._text.substring(this._position, position - this._position);
                this._position = position + 1;
                if (((ch === '\r') && (this._position < this._length)) && (this._text[this._position] === '\n')) {
                    this._position++;
                }
                return text;
            case ' ':
            case '\t':
                if (position === this._position) {
                    position++;
                }
                text = this._text.substring(this._position, position);
                this._position = position;
                return text;
            }
            position++;
        }
        if (position > this._position) {
            const text2: string = this._text.substring(this._position, position);
            this._position = position;
            return text2;
        }
        return null;
    }
    /**
     * Peeks the next word or delimiter run without moving the position.
     *
     * @private
     * @returns {string} The next word or delimiter sequence, or `null` if none.
     */
    _peekWord(): string {
        const position: number = this._position;
        const word: string = this._readWord();
        this._position = position;
        return word;
    }
    /**
     * Reads one character or the requested number of characters from the current position.
     *
     * @private
     * @returns {string} The next character.
     */
    _read(): string
    _read(count: number): string
    _read(count?: number): string {
        if (typeof count === 'undefined') {
            let character: string = '0';
            if (!this._end) {
                character = this._text[this._position];
                this._position++;
            }
            return character;
        } else {
            let value: number = 0;
            let builder: string = '';
            while (!this._end && value < count) {
                builder += this._read();
                value++;
            }
            return builder;
        }
    }
    /**
     * Returns the current character without advancing the position.
     *
     * @private
     * @returns {string} The current character, or '0' if at end.
     */
    _peek(): string {
        return this._end ? '0' : this._text[this._position];
    }
    /**
     * Releases tokenizer resources by clearing the backing text.
     *
     * @private
     * @returns {void} nothing.
     */
    _close(): void {
        this._text = null;
    }
    /**
     * Reads all remaining text from the current position and advances to the end.
     *
     * @private
     * @returns {string} The remaining text from the current position.
     */
    _readToEnd(): string {
        let text: string;
        if (this._position === 0) {
            text = this._text;
        } else {
            text = this._text.substring(this._position);
        }
        this._position = this._length;
        return text;
    }
}
