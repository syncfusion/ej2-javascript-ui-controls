import { _PdfContentStream } from './../base-stream';
import { _PdfTransformationMatrix } from './pdf-graphics';
import { _PdfName } from './../pdf-primitives';
import { _escapePdfName } from './../utils';
import { _PdfColorSpace } from '../enumerator';
/**
 * Low level PDF content writer that emits PDF operators and operands into
 * a content stream. Provides helpers for graphics state, paths, text, color,
 * and resource execution.
 *
 * @private
 */
export class _PdfStreamWriter {
    /**
     * Underlying PDF content stream to write into.
     *
     * @private
     */
    _stream: _PdfContentStream;
    /**
     * Newline delimiter used when writing PDF operators.
     *
     * @private
     */
    _newLine: string = '\r\n';
    /**
     * Single whitespace used when separating PDF operator tokens.
     *
     * @private
     */
    _whiteSpace: string = ' ';
    /**
     * Creates a new stream writer bound to the given content stream.
     *
     * @param {_PdfContentStream} stream The target content stream to write to.
     *
     * @private
     */
    constructor(stream: _PdfContentStream) {
        this._stream = stream;
    }
    /**
     * Writes a raw PDF operator string followed by EOL.
     *
     * @param {string} value The operator string to write.
     * @returns {void} nothing.
     *
     * @private
     */
    _writeOperator(value: string): void {
        this._stream.write(value);
        this._stream.write(this._newLine);
    }
    /**
     * Saves the current graphics state `q`.
     *
     * @private
     * @returns {void} nothing.
     */
    _saveGraphicsState(): void {
        this._writeOperator('q');
    }
    /**
     * Restores the previous graphics state `Q`.
     *
     * @private
     * @returns {void} nothing.
     */
    _restoreGraphicsState(): void {
        this._writeOperator('Q');
    }
    /**
     * Writes a PDF comment line  when non-empty.
     *
     * @param {string} comment The comment text (no EOL needed).
     * @returns {void} nothing.
     *
     * @private
     */
    _writeComment(comment: string): void {
        if (comment && comment.length > 0) {
            this._writeOperator('% ' + comment);
        }
    }
    /**
     * Sets the extended graphics state.
     *
     * @param {_PdfName} value The ExtGState resource name.
     * @returns {void} nothing.
     *
     * @private
     */
    _setGraphicsState(value: _PdfName): void {
        this._stream.write(`/${_escapePdfName(value.name)} `);
        this._writeOperator('gs');
    }
    /**
     * Concatenates matrix with the current transformation matrix `cm`.
     *
     * @param {_PdfTransformationMatrix} matrix The transformation to apply.
     * @returns {void} nothing.
     *
     * @private
     */
    _modifyCtm(matrix: _PdfTransformationMatrix): void {
        this._stream.write(`${matrix._toString()} `);
        this._writeOperator('cm');
    }
    /**
     * Sets the text matrix and text line matrix `Tm`.
     *
     * @param {_PdfTransformationMatrix} matrix The text matrix to set.
     * @returns {void} nothing.
     *
     * @private
     */
    _modifyTM(matrix: _PdfTransformationMatrix): void {
        this._stream.write(`${matrix._toString()} `);
        this._writeOperator('Tm');
    }
    /**
     * Sets the current color space and/or color values.
     *
     * Overloads:
     * - `_setColorSpace(value: string, forStroking: boolean)`: sets named color space (`CS`/`cs`).
     * - `_setColorSpace(value: number[], colorSpace: _PdfColorSpace, forStroking: boolean)`: sets space and color.
     *
     * @param {string | number[]} value A color space name (e.g., `DeviceRGB`) or color components.
     * @param {boolean | _PdfColorSpace} arg2 Stroking flag when `value` is string; otherwise the color space.
     * @param {boolean} [arg3] Stroking flag when `value` is a component array.
     * @returns {void} nothing.
     *
     * @private
     */
    _setColorSpace(value: string, forStroking: boolean): void;
    _setColorSpace(value: number[], colorSpace: _PdfColorSpace, forStroking: boolean): void;
    _setColorSpace(value: string | number[], arg2: boolean | _PdfColorSpace, arg3?: boolean): void {
        if (typeof value === 'string' && typeof arg2 === 'boolean') {
            this._stream.write(`/${value} `);
            this._writeOperator(arg2 ? 'CS' : 'cs');
        } else if (Array.isArray(value) && typeof arg2 === 'number' && typeof arg3 === 'boolean') {
            let colorSpaceName: string;
            switch (arg2) {
            case _PdfColorSpace.rgb:
                colorSpaceName = 'DeviceRGB';
                break;
            case _PdfColorSpace.cmyk:
                colorSpaceName = 'DeviceCMYK';
                break;
            case _PdfColorSpace.grayScale:
                colorSpaceName = 'DeviceGray';
                break;
            default:
                colorSpaceName = 'DeviceRGB';
                break;
            }
            this._stream.write(`/${colorSpaceName} `);
            this._writeOperator(arg3 ? 'CS' : 'cs');
            this._setColor(value, arg3);
        }
    }
    /**
     * Sets the current color for DeviceRGB using 0..255 components.
     *
     * @param {number[]} color The RGB array `[r,g,b]` (0..255).
     * @param {boolean} forStroking True for stroking color (`RG`), false for non-stroking (`rg`).
     * @returns {void} nothing.
     *
     * @private
     */
    _setColor(color: number[], forStroking: boolean): void {
        this._stream.write(`${(color[0] / 255).toFixed(3)} ${(color[1] / 255).toFixed(3)} ${(color[2] / 255).toFixed(3)} `);
        this._writeOperator(forStroking ? 'RG' : 'rg');
    }
    /**
     * Appends a rectangle to the current path, using the current CTM.
     *
     * @param {number} x Left.
     * @param {number} y Top.
     * @param {number} width Width.
     * @param {number} height Height.
     * @returns {void} nothing.
     *
     * @private
     */
    _appendRectangle(x: number, y: number, width: number, height: number): void {
        this._writePoint(x, y);
        this._writePoint(width, height);
        this._writeOperator('re');
    }
    /**
     * Writes a point as two operands, auto flipping Y to PDF coordinates.
     *
     * @param {number} x X coordinate.
     * @param {number} y Y coordinate.
     * @returns {void} nothing.
     *
     * @private
     */
    _writePoint(x: number, y: number): void {
        this._stream.write(`${x.toFixed(3)} ${(-y).toFixed(3)} `);
    }
    /**
     * Applies the current path as a clipping path and ends path.
     *
     * @param {boolean} isEvenOdd True for evenodd rule, false for nonzero.
     * @returns {void} nothing.
     *
     * @private
     */
    _clipPath(isEvenOdd: boolean): void {
        this._stream.write(`${isEvenOdd ? 'W*' : 'W'} n${this._newLine}`);
    }
    /**
     * Fills the current path and ends the path.
     *
     * @param {boolean} isEvenOdd True for evenodd rule, false for nonzero.
     * @returns {void} nothing.
     *
     * @private
     */
    _fillPath(isEvenOdd: boolean): void {
        this._writeOperator(isEvenOdd ? 'f*' : 'f');
    }
    /**
     * Closes the current subpath then fill.
     *
     * @param {boolean} isEvenOdd True for evenodd rule, false for nonzero.
     * @returns {void} nothing.
     *
     * @private
     */
    _closeFillPath(isEvenOdd: boolean): void {
        this._writeOperator('h');
        this._fillPath(isEvenOdd);
    }
    /**
     * Strokes the current path `S` and ends the path.
     *
     * @private
     * @returns {void} nothing.
     */
    _strokePath(): void {
        this._writeOperator('S');
    }
    /**
     * Closes and strokes the current path `s` and ends the path.
     *
     * @private
     * @returns {void} nothing.
     */
    _closeStrokePath(): void {
        this._writeOperator('s');
    }
    /**
     * Fills and strokes the current path and ends the path.
     *
     * @param {boolean} isEvenOdd True for evenodd rule, false for nonzero.
     * @returns {void} nothing.
     *
     * @private
     */
    _fillStrokePath(isEvenOdd: boolean): void {
        this._writeOperator(isEvenOdd ? 'B*' : 'B');
    }
    /**
     * Closes, fills, and strokes the current path and ends the path.
     *
     * @param {boolean} isEvenOdd True for evenodd rule, false for nonzero.
     * @returns {void} nothing.
     *
     * @private
     */
    _closeFillStrokePath(isEvenOdd: boolean): void {
        this._writeOperator(isEvenOdd ? 'b*' : 'b');
    }
    /**
     * Ends the current path without filling or stroking `n`.
     *
     * @private
     * @returns {void} nothing.
     */
    _endPath(): void {
        this._writeOperator('n');
    }
    /**
     * Sets the current font and size.
     *
     * @param {string} name The font resource name.
     * @param {number} size The font size in user units.
     * @returns {void} nothing.
     *
     * @private
     */
    _setFont(name: string, size: number): void {
        this._stream.write(`/${name} ${size.toFixed(3)} `);
        this._writeOperator('Tf');
    }
    /**
     * Sets horizontal text scaling in percent.
     *
     * @param {number} textScaling The scaling factor in percent.
     * @returns {void} nothing.
     *
     * @private
     */
    _setTextScaling(textScaling: number): void {
        this._stream.write(`${textScaling.toFixed(3)} `);
        this._writeOperator('Tz');
    }
    /**
     * Closes the current subpath (`h`). Usually used before fill/stroke.
     *
     * @private
     * @returns {void} nothing.
     */
    _closePath(): void {
        this._writeOperator('h');
    }
    /**
     * Moves to the start of the next line in text state.
     *
     * Overloads:
     * - `_startNextLine()`: moves to next line.
     * - `_startNextLine(x, y)`: moves by x, y in text space.
     *
     * @param {number} [x] X translation in text space.
     * @param {number} [y] Y translation in text space.
     * @returns {void} nothing.
     *
     * @private
     */
    _startNextLine(): void
    _startNextLine(x: number, y: number): void
    _startNextLine(x?: number, y?: number): void {
        if (typeof x === 'undefined') {
            this._writeOperator('T*');
        } else {
            this._writePoint(x, y);
            this._writeOperator('Td');
        }
    }
    /**
     * Sets text leading `TL`, the vertical distance between baselines.
     *
     * @param {number} leading The leading in user units.
     * @returns {void} nothing.
     *
     * @private
     */
    _setLeading(leading: number): void {
        this._write(`${leading.toFixed(3)} `);
        this._write(this._whiteSpace);
        this._writeOperator('TL');
    }
    /**
     * Shows text using the literal string form. The text is escaped as needed.
     *
     * @param {string} text The literal text content.
     * @returns {void} nothing.
     *
     * @private
     */
    _showText(text: string): void {
        this._writeText(text);
        this._writeOperator('Tj');
    }
    /**
     * Writes a raw string + CRLF, then as an operator. Internal helper.
     *
     * @param {string} string The string to write.
     * @returns {void} nothing.
     *
     * @private
     */
    _write(string: string): void {
        let builder: string = '';
        builder += string;
        builder += '\r\n';
        this._writeOperator(builder);
    }
    /**
     * Writes a literal string operand with necessary escaping and parentheses wrapping.
     *
     * @param {string} text The unescaped text content.
     * @returns {void} nothing.
     *
     * @private
     */
    _writeText(text: string): void {
        let result: string = '';
        const data: number[] = this._escapeSymbols(text);
        for (let i: number = 0; i < data.length; i++) {
            result += String.fromCharCode(data[i]); // eslint-disable-line
        }
        result = '(' + result + ')';
        this._stream.write(result);
    }
    /**
     * Begins a text object.
     *
     * @private
     * @returns {void} nothing.
     */
    _beginText(): void {
        this._writeOperator('BT');
    }
    /**
     * Ends a text object.
     *
     * @private
     * @returns {void} nothing.
     */
    _endText(): void {
        this._writeOperator('ET');
    }
    /**
     * Begins a new subpath at the specified point.
     *
     * @param {number} x X coordinate.
     * @param {number} y Y coordinate.
     * @returns {void} nothing.
     *
     * @private
     */
    _beginPath(x: number, y: number): void {
        this._writePoint(x, y);
        this._writeOperator('m');
    }
    /**
     * Appends a line segment to the specified point.
     *
     * @param {number} x X coordinate.
     * @param {number} y Y coordinate.
     * @returns {void} nothing.
     *
     * @private
     */
    _appendLineSegment(x: number, y: number): void {
        this._writePoint(x, y);
        this._writeOperator('l');
    }
    /**
     * Appends a cubic Bezier curve segment with two control points and an endpoint.
     *
     * @param {number} x1 First control point X.
     * @param {number} y1 First control point Y.
     * @param {number} x2 Second control point X.
     * @param {number} y2 Second control point Y.
     * @param {number} x3 End point X.
     * @param {number} y3 End point Y.
     * @returns {void} nothing.
     *
     * @private
     */
    _appendBezierSegment(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): void {
        this._writePoint(x1, y1);
        this._writePoint(x2, y2);
        this._writePoint(x3, y3);
        this._writeOperator('c');
    }
    /**
     * Sets the text rendering mode, combining fill/stroke/clip flags.
     *
     * @private
     * @param {number} renderingMode The rendering mode integer.
     * @returns {void} nothing.
     */
    _setTextRenderingMode(renderingMode: number): void {
        this._stream.write(`${renderingMode.toString()} `);
        this._writeOperator('Tr');
    }
    /**
     * Sets character spacing in user units.
     *
     * @private
     * @param {number} charSpacing The character spacing.
     * @returns {void} nothing.
     */
    _setCharacterSpacing(charSpacing: number): void {
        this._stream.write(`${charSpacing.toFixed(3)} `);
        this._writeOperator('Tc');
    }
    /**
     * Sets word spacing in user units.
     *
     * @private
     * @param {number} wordSpacing The word spacing.
     * @returns {void} nothing.
     */
    _setWordSpacing(wordSpacing: number): void {
        this._stream.write(`${wordSpacing.toFixed(3)} `);
        this._writeOperator('Tw');
    }
    /**
     * Shows text on the next line using either:
     *  - literal string written directly (when `unicode` is falsy), or
     *  - escaped literal written via `_writeText` (when `unicode` is true).
     *
     * @returns {void} nothing.
     * @param {string} text The literal or escaped text.
     * @param {boolean} [unicode] When true, escapes and wraps the text before show.
     * @returns {void} nothing.
     */
    _showNextLineText(text: string): void
    _showNextLineText(text: string, unicode: boolean): void
    _showNextLineText(text: string, unicode?: boolean): void {
        if (unicode !== null && typeof unicode !== 'undefined' && unicode) {
            this._writeText(text);
            this._writeOperator('\'');
        } else {
            this._stream.write(text);
            this._writeOperator('\'');
        }
    }
    /**
     * Sets the line dash pattern. Pattern elements are lengths in user units.
     *
     * @private
     * @param {number[]} pattern The dash/gap pattern array.
     * @param {number} patternOffset The dash phase offset.
     * @returns {void} nothing.
     */
    _setLineDashPattern(pattern: number[], patternOffset: number): void {
        let tempPattern: string = '[';
        if (pattern.length >= 1) {
            for (let index: number = 0; index < pattern.length; index++) {
                if (index === pattern.length - 1) {
                    tempPattern += pattern[index].toString(); // eslint-disable-line
                } else {
                    tempPattern += pattern[index].toString() + ' '; // eslint-disable-line
                }
            }
        }
        tempPattern += '] ';
        tempPattern += patternOffset.toString();
        tempPattern += ' d';
        this._writeOperator(tempPattern);
    }
    /**
     * Sets the miter limit.
     *
     * @private
     * @param {number} miterLimit The miter limit value.
     * @returns {void} nothing.
     */
    _setMiterLimit(miterLimit: number): void {
        this._stream.write(`${miterLimit.toFixed(3)} `);
        this._writeOperator('M');
    }
    /**
     * Sets the line width (`w`).
     *
     * @private
     * @param {number} width The stroke width in user units.
     * @returns {void} nothing.
     */
    _setLineWidth(width: number): void {
        this._stream.write(`${width.toFixed(3)} `);
        this._writeOperator('w');
    }
    /**
     * Sets the line cap style.
     *
     * @private
     * @param {number} lineCapStyle The line cap style (0=butt, 1=round, 2=square).
     * @returns {void} nothing.
     */
    _setLineCap(lineCapStyle: number): void {
        this._stream.write(`${lineCapStyle} `);
        this._writeOperator('J');
    }
    /**
     * Sets the line join style.
     *
     * @private
     * @param {number} lineJoinStyle The join style (0=miter, 1=round, 2=bevel).
     * @returns {void} nothing.
     */
    _setLineJoin(lineJoinStyle: number): void {
        this._stream.write(`${lineJoinStyle} `);
        this._writeOperator('j');
    }
    /**
     * Executes a named XObject or other resource.
     *
     * @private
     * @param {_PdfName} name The resource name to execute.
     * @returns {void} nothing.
     */
    _executeObject(name: _PdfName): void {
        this._stream.write(`/${name.name} `);
        this._writeOperator('Do');
    }
    /**
     * Begins a markedcontent sequence.
     *
     * @private
     * @param {string} name The markedcontent tag name.
     * @returns {void} nothing.
     */
    _beginMarkupSequence(name: string): void {
        this._stream.write(`/${name} `);
        this._writeOperator('BMC');
    }
    /**
     * Ends a markedcontent sequence.
     *
     * @private
     * @returns {void} nothing.
     */
    _endMarkupSequence(): void {
        this._writeOperator('EMC');
    }
    /**
     * Clears the underlying content stream buffer.
     *
     * @private
     * @returns {void} nothing.
     */
    _clear(): void {
        this._stream._bytes = [];
    }
    /**
     * Escapes special characters for PDF literal strings.
     *
     * @param {string} value The unescaped text.
     * @returns {number[]} The escaped byte values.
     *
     * @private
     */
    _escapeSymbols(value: string): number[] {
        const data: number[] = [];
        for (let i: number = 0; i < value.length; i++) {
            const currentData: number = value.charCodeAt(i);
            switch (currentData) {
            case 40:
            case 41:
                data.push(92);
                data.push(currentData);
                break;
            case 13:
                data.push(92);
                data.push(114);
                break;
            case 92:
                data.push(92);
                data.push(currentData);
                break;

            default:
                data.push(currentData);
                break;
            }
        }
        return data;
    }
}
