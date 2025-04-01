import { PdfStringFormat } from './pdf-string-format';
import { PdfFont } from './pdf-standard-font';
import { _PdfWordWrapType } from './../enumerator';
export class _PdfStringLayouter {
    _font: PdfFont;
    _format: PdfStringFormat;
    _size: number[];
    _rectangle: number[];
    _pageHeight: number;
    _reader: _StringTokenizer;
    _layout(text: string, font: PdfFont, format: PdfStringFormat, size: number[]): _PdfStringLayoutResult {
        this._initialize(text, font, format, size);
        const result: _PdfStringLayoutResult = this._doLayout();
        this._clear();
        return result;
    }
    _initialize(text: string, font: PdfFont, format: PdfStringFormat, size: number[]): void {
        this._font = font;
        this._format = format;
        this._size = size;
        this._rectangle = [0, 0, size[0], size[1]];
        this._reader = new _StringTokenizer(text);
        this._pageHeight = 0;
    }
    _clear(): void {
        this._font = null;
        this._format = null;
        this._reader._close();
        this._reader = null;
    }
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
    _getLineIndent(firstLine: boolean): number {
        let lineIndent: number = 0;
        if (this._format) {
            lineIndent = (firstLine) ? this._format.firstLineIndent : this._format.paragraphIndent;
            lineIndent = (this._size[0] > 0) ? Math.min(this._size[0], lineIndent) : lineIndent;
        }
        return lineIndent;
    }
    _getLineHeight(): number {
        let height: number = this._font._metrics._getHeight();
        if (this._format && this._format.lineSpacing !== 0) {
            height = this._format.lineSpacing + this._font._metrics._getHeight();
        }
        return height;
    }
    _getLineWidth(line: string): number {
        return this._font.getLineWidth(line, this._format);
    }
    _layoutLine(line: string, lineIndent: number): _PdfStringLayoutResult {
        const lineResult: _PdfStringLayoutResult = new _PdfStringLayoutResult();
        lineResult._lineHeight = this._getLineHeight();
        let lines: _LineInfo[] = [];
        const maxWidth: number = this._size[0];
        let lineWidth: number = this._getLineWidth(line) + lineIndent;
        let lineType: _LineType = _LineType.firstParagraphLine;
        let readWord: boolean = true;
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
                            if (typeof this._format !== 'undefined' && this._format !== null ) {
                                this._format._wordWrap = _PdfWordWrapType.character;
                            }
                        } else {
                            if (typeof this._format !== 'undefined' && this._format !== null ) {
                                this._format._wordWrap = _PdfWordWrapType.word;
                            }
                        }
                        if (this._getWrapType() !== _PdfWordWrapType.character || !readWord) {
                            const stringValue : string = builder.toString();
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
        lines = [];
        return lineResult;
    }
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
        const size: number[] = lineResult._actualSize;
        size[1] = size[1] + this._getLineHeight();
        size[0] = Math.max(size[0], lineWidth);
        lineResult._size = size;
    }
    _copyToResult(result: _PdfStringLayoutResult,
                  lineResult: _PdfStringLayoutResult,
                  lines: _LineInfo[],
                  flag: number): { success: boolean, flag: number } {
        let success: boolean = true;
        const allowPartialLines: boolean = (this._format && !this._format.lineLimit);
        let height: number = result._actualSize[1];
        let maxHeight: number = this._size[1];
        if ((this._pageHeight > 0) && (maxHeight + this._rectangle[1] > this._pageHeight)) {
            maxHeight = this._rectangle[1] - this._pageHeight;
            maxHeight = Math.max(maxHeight, -maxHeight);
        }
        flag = 0;
        if (lineResult._lines !== null) {
            for (let i: number = 0, len: number = lineResult._lines.length; i < len; i++) {
                const expHeight: number = height + lineResult._lineHeight;
                if (expHeight <= maxHeight || maxHeight <= 0 || allowPartialLines) {
                    let info: _LineInfo = lineResult._lines[i]; // eslint-disable-line
                    flag += info._text.length;
                    info = this._trimLine(info, (lines.length === 0));
                    lines.push(info);
                    const size: number[] = result._actualSize;
                    size[0] = Math.max(size[0], info._width);
                    result._size = size;
                    height = expHeight;
                } else {
                    success = false;
                    break;
                }
            }
        }
        if (height !== result._size[1]) {
            result._size = [result._actualSize[0], height];
        }
        return { success: success, flag: flag };
    }
    _finalizeResult(result: _PdfStringLayoutResult, lines: _LineInfo[]): void {
        result._layoutLines = [];
        for (let index: number = 0; index < lines.length; index++) {
            result._layoutLines.push(lines[index]); // eslint-disable-line
        }
        result._lineHeight = this._getLineHeight();
        if (!this._reader._end) {
            result._remainder = this._reader._readToEnd();
        }
        lines = [];
    }
    _trimLine(info: _LineInfo, firstLine: boolean): _LineInfo {
        const line: string = info._text.trim();
        let lineWidth: number = info._width;
        if (line.length !== info._text.length) {
            lineWidth = this._getLineWidth(line);
            if ((info._lineType & _LineType.firstParagraphLine) > 0) {
                lineWidth += this._getLineIndent(firstLine);
            }
        }
        info._text = line;
        info._width = lineWidth;
        return info;
    }
    _getWrapType(): _PdfWordWrapType {
        const wrapType: _PdfWordWrapType = (this._format !== null && typeof this._format !== 'undefined') ?
            this._format._wordWrap : _PdfWordWrapType.word;
        return wrapType;
    }
}
export class _PdfStringLayoutResult {
    _layoutLines: _LineInfo[];
    _remainder: string;
    _size: number[];
    _lineHeight: number;
    get _actualSize(): number[] {
        if (typeof this._size === 'undefined') {
            this._size = [0, 0];
        }
        return this._size;
    }
    get _lines(): _LineInfo[] {
        return this._layoutLines;
    }
    get _empty(): boolean {
        return (this._layoutLines === null || this._layoutLines.length === 0);
    }
    get _lineCount(): number {
        return (!this._empty) ? this._layoutLines.length : 0;
    }
}
export class _LineInfo {
    _text: string;
    _width: number;
    _lineType: _LineType;
}
export enum _LineType {
    none = 0,
    newLineBreak = 0x0001,
    layoutBreak = 0x0002,
    firstParagraphLine = 0x0004,
    lastParagraphLine = 0x0008
}
export class _StringTokenizer {
    _text: string;
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
    get _length(): number {
        return this._text.length;
    }
    get _end(): boolean {
        return (this._position === this._text.length);
    }
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
    _peekLine(): string {
        const position: number = this._position;
        const line: string = this._readLine();
        this._position = position;
        return line;
    }
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
    _peekWord(): string {
        const position: number = this._position;
        const word: string = this._readWord();
        this._position = position;
        return word;
    }
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
    _peek(): string {
        return this._end ? '0' : this._text[this._position];
    }
    _close(): void {
        this._text = null;
    }
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
