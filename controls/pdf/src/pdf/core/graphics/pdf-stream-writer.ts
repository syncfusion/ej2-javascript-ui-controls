import { _PdfContentStream } from './../base-stream';
import { _PdfTransformationMatrix } from './pdf-graphics';
import { _PdfName } from './../pdf-primitives';
import { _escapePdfName } from './../utils';
export class _PdfStreamWriter {
    _stream: _PdfContentStream;
    _newLine: string = '\r\n';
    _whiteSpace: string = ' ';
    constructor(stream: _PdfContentStream) {
        this._stream = stream;
    }
    _writeOperator(value: string): void {
        this._stream.write(value);
        this._stream.write(this._newLine);
    }
    _saveGraphicsState(): void {
        this._writeOperator('q');
    }
    _restoreGraphicsState(): void {
        this._writeOperator('Q');
    }
    _writeComment(comment: string): void {
        if (comment && comment.length > 0) {
            this._writeOperator('% ' + comment);
        }
    }
    _setGraphicsState(value: _PdfName): void {
        this._stream.write(`/${_escapePdfName(value.name)} `);
        this._writeOperator('gs');
    }
    _modifyCtm(matrix: _PdfTransformationMatrix): void {
        this._stream.write(`${matrix._toString()} `);
        this._writeOperator('cm');
    }
    _modifyTM(matrix: _PdfTransformationMatrix): void {
        this._stream.write(`${matrix._toString()} `);
        this._writeOperator('Tm');
    }
    _setColorSpace(value: string, forStroking: boolean): void {
        this._stream.write(`/${value} `);
        this._writeOperator(forStroking ? 'CS' : 'cs');
    }
    _setColor(color: number[], forStroking: boolean): void {
        this._stream.write(`${(color[0] / 255).toFixed(3)} ${(color[1] / 255).toFixed(3)} ${(color[2] / 255).toFixed(3)} `);
        this._writeOperator(forStroking ? 'RG' : 'rg');
    }
    _appendRectangle(x: number, y: number, width: number, height: number): void {
        this._writePoint(x, y);
        this._writePoint(width, height);
        this._writeOperator('re');
    }
    _writePoint(x: number, y: number): void {
        this._stream.write(`${x.toFixed(3)} ${(-y).toFixed(3)} `);
    }
    _clipPath(isEvenOdd: boolean): void {
        this._stream.write(`${isEvenOdd ? 'W*' : 'W'} n${this._newLine}`);
    }
    _fillPath(isEvenOdd: boolean): void {
        this._writeOperator(isEvenOdd ? 'f*' : 'f');
    }
    _closeFillPath(isEvenOdd: boolean): void {
        this._writeOperator('h');
        this._fillPath(isEvenOdd);
    }
    _strokePath(): void {
        this._writeOperator('S');
    }
    _closeStrokePath(): void {
        this._writeOperator('s');
    }
    _fillStrokePath(isEvenOdd: boolean): void {
        this._writeOperator(isEvenOdd ? 'B*' : 'B');
    }
    _closeFillStrokePath(isEvenOdd: boolean): void {
        this._writeOperator(isEvenOdd ? 'b*' : 'b');
    }
    _endPath(): void {
        this._writeOperator('n');
    }
    _setFont(name: string, size: number): void {
        this._stream.write(`/${name} ${size.toFixed(3)} `);
        this._writeOperator('Tf');
    }
    _setTextScaling(textScaling: number): void {
        this._stream.write(`${textScaling.toFixed(3)} `);
        this._writeOperator('Tz');
    }
    _closePath(): void {
        this._writeOperator('h');
    }
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
    _showText(text: string): void {
        this._writeText(text);
        this._writeOperator('Tj');
    }
    _write(string: string): void {
        let builder: string = '';
        builder += string;
        builder += '\r\n';
        this._writeOperator(builder);
    }
    _writeText(text: string): void {
        let result: string = '';
        const data: number[] = this._escapeSymbols(text);
        for (let i: number = 0; i < data.length; i++) {
            result += String.fromCharCode(data[i]); // eslint-disable-line
        }
        result = '(' + result + ')';
        this._stream.write(result);
    }
    _beginText(): void {
        this._writeOperator('BT');
    }
    _endText(): void {
        this._writeOperator('ET');
    }
    _beginPath(x: number, y: number): void {
        this._writePoint(x, y);
        this._writeOperator('m');
    }
    _appendLineSegment(x: number, y: number): void {
        this._writePoint(x, y);
        this._writeOperator('l');
    }
    _appendBezierSegment(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): void {
        this._writePoint(x1, y1);
        this._writePoint(x2, y2);
        this._writePoint(x3, y3);
        this._writeOperator('c');
    }
    _setTextRenderingMode(renderingMode: number): void {
        this._stream.write(`${renderingMode.toString()} `);
        this._writeOperator('Tr');
    }
    _setCharacterSpacing(charSpacing: number): void {
        this._stream.write(`${charSpacing.toFixed(3)} `);
        this._writeOperator('Tc');
    }
    _setWordSpacing(wordSpacing: number): void {
        this._stream.write(`${wordSpacing.toFixed(3)} `);
        this._writeOperator('Tw');
    }
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
    _setLineDashPattern(pattern: number[], patternOffset: number): void {
        let tempPattern: string = '[';
        if (pattern.length > 1) {
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
    _setMiterLimit(miterLimit: number): void {
        this._stream.write(`${miterLimit.toFixed(3)} `);
        this._writeOperator('M');
    }
    _setLineWidth(width: number): void {
        this._stream.write(`${width.toFixed(3)} `);
        this._writeOperator('w');
    }
    _setLineCap(lineCapStyle: number): void {
        this._stream.write(`${lineCapStyle} `);
        this._writeOperator('J');
    }
    _setLineJoin(lineJoinStyle: number): void {
        this._stream.write(`${lineJoinStyle} `);
        this._writeOperator('j');
    }
    _executeObject(name: _PdfName): void {
        this._stream.write(`/${name.name} `);
        this._writeOperator('Do');
    }
    _beginMarkupSequence(name: string): void {
        this._stream.write(`/${name} `);
        this._writeOperator('BMC');
    }
    _endMarkupSequence(): void {
        this._writeOperator('EMC');
    }
    _clear(): void {
        this._stream._bytes = [];
    }
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
