import { _PdfCommand, _PdfName, _PdfDictionary, _isCommand, _PdfReference, _isName } from './pdf-primitives';
import { _isWhiteSpace, FormatError, ParserEndOfFileException, _decodeText } from './utils';
import { _PdfStream, _PdfNullStream, _PdfBaseStream } from './base-stream';
import { PdfPredictorStream } from './predictor-stream';
import { _PdfFlateStream } from './flate-stream';
import { _PdfCrossReference } from './pdf-cross-reference';
import { _CipherTransform } from './security/encryptor';
const maxCacheLength: number = 1000;
const maxNumberLength: number = 5552;
const endOfFile: string = 'EOF';
const specialChars: Array<number> = [
    1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 0, 0, 0, 0, 2, 0, 0, 2, 2, 0, 0, 0, 0, 0, 2,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
];
export class _PdfLexicalOperator {
    stream: _PdfStream;
    stringBuffer: Array<string>;
    _hexStringNumber: number;
    beginInlineImagePosition: number;
    currentChar: number;
    constructor(stream: _PdfStream) {
        this.stream = stream;
        this.nextChar();
        this.stringBuffer = [];
        this._hexStringNumber = 0;
        this.beginInlineImagePosition = -1;
    }
    nextChar(): number {
        return (this.currentChar = this.stream.getByte());
    }
    peekChar(): number {
        return this.stream.peekByte();
    }
    getNumber(): number {
        let ch: number = this.currentChar;
        let eNotation: boolean = false;
        let divideBy: number = 0;
        let sign: number = 0;
        if (ch === 0x2d) {
            sign = -1;
            ch = this.nextChar();
            if (ch === 0x2d) {
                ch = this.nextChar();
            }
        } else if (ch === 0x2b) {
            sign = 1;
            ch = this.nextChar();
        }
        if (ch === 0x0a || ch === 0x0d) {
            do {
                ch = this.nextChar();
            } while (ch === 0x0a || ch === 0x0d);
        }
        if (ch === 0x2e) {
            divideBy = 10;
            ch = this.nextChar();
        }
        if (ch < 0x30 || ch > 0x39) {
            if (_isWhiteSpace(ch) || ch === -1) {
                if (divideBy === 10 && sign === 0) {
                    return 0;
                }
                if (divideBy === 0 && sign === -1) {
                    return 0;
                }
            }
            throw new FormatError(`Invalid number: ${String.fromCharCode(ch)} (charCode ${ch})`);
        }
        sign = sign || 1;
        let baseValue: number = ch - 0x30;
        let powerValue: number = 0;
        let powerValueSign: number = 1;
        ch = this.nextChar();
        while (ch >= 0) {
            if (ch >= 0x30 && ch <= 0x39) {
                const currentDigit: number = ch - 0x30;
                if (eNotation) {
                    powerValue = powerValue * 10 + currentDigit;
                } else {
                    if (divideBy !== 0) {
                        divideBy *= 10;
                    }
                    baseValue = baseValue * 10 + currentDigit;
                }
            } else if (ch === 0x2e) {
                if (divideBy === 0) {
                    divideBy = 1;
                } else {
                    break;
                }
            } else if (ch === 0x2d) {
                ch = this.nextChar();
                continue;
            } else if (ch === 0x45 || ch === 0x65) {
                ch = this.peekChar();
                if (ch === 0x2b || ch === 0x2d) {
                    powerValueSign = ch === 0x2d ? -1 : 1;
                    this.nextChar();
                } else if (ch < 0x30 || ch > 0x39) {
                    break;
                }
                eNotation = true;
            } else {
                break;
            }
            ch = this.nextChar();
        }
        if (divideBy !== 0) {
            baseValue /= divideBy;
        }
        if (eNotation) {
            baseValue *= 10 ** (powerValueSign * powerValue);
        }
        return sign * baseValue;
    }
    getString(): string {
        let numParen: number = 1;
        let done: boolean = false;
        const stringBuffer: string[] = this.stringBuffer;
        stringBuffer.length = 0;
        let ch: number = this.nextChar();
        while (true) { // eslint-disable-line
            let charBuffered: boolean = false;
            switch (ch | 0) {
            case -1:
                done = true;
                break;
            case 0x28:
                ++numParen;
                stringBuffer.push('(');
                break;
            case 0x29:
                if (--numParen === 0) {
                    this.nextChar();
                    done = true;
                } else {
                    stringBuffer.push(')');
                }
                break;
            case 0x5c:
                ch = this.nextChar();
                switch (ch) {
                case -1:
                    done = true;
                    break;
                case 0x6e:
                    stringBuffer.push('\n');
                    break;
                case 0x72:
                    stringBuffer.push('\r');
                    break;
                case 0x74:
                    stringBuffer.push('\t');
                    break;
                case 0x62:
                    stringBuffer.push('\b');
                    break;
                case 0x66:
                    stringBuffer.push('\f');
                    break;
                case 0x5c:
                case 0x28:
                case 0x29:
                    stringBuffer.push(String.fromCharCode(ch));
                    break;
                case 0x30:
                case 0x31:
                case 0x32:
                case 0x33:
                case 0x34:
                case 0x35:
                case 0x36:
                case 0x37:
                    let x: number = ch & 0x0f; // eslint-disable-line
                    ch = this.nextChar();
                    charBuffered = true;
                    if (ch >= 0x30 && ch <= 0x37) {
                        x = (x << 3) + (ch & 0x0f);
                        ch = this.nextChar();
                        if (ch >= 0x30 && ch <= 0x37) {
                            charBuffered = false;
                            x = (x << 3) + (ch & 0x0f);
                        }
                    }
                    stringBuffer.push(String.fromCharCode(x));
                    break;
                case 0x0d:
                    if (this.peekChar() === 0x0a) {
                        this.nextChar();
                    }
                    break;
                case 0x0a:
                    break;
                default:
                    stringBuffer.push(String.fromCharCode(ch));
                    break;
                }
                break;
            default:
                stringBuffer.push(String.fromCharCode(ch));
                break;
            }
            if (done) {
                break;
            }
            if (!charBuffered) {
                ch = this.nextChar();
            }
        }
        return stringBuffer.join('');
    }
    getName(): _PdfName {
        let ch: number;
        let previousCh: number;
        const stringBuffer: string[] = this.stringBuffer;
        stringBuffer.length = 0;
        ch = this.nextChar();
        while (ch >= 0 && !specialChars[ch]) { // eslint-disable-line
            if (ch === 0x23) {
                ch = this.nextChar();
                if (specialChars[ch]) { // eslint-disable-line
                    stringBuffer.push('#');
                    break;
                }
                const x: number = this._toHexDigit(ch);
                if (x !== -1) {
                    previousCh = ch;
                    ch = this.nextChar();
                    const x2: number = this._toHexDigit(ch);
                    if (x2 === -1) {
                        stringBuffer.push('#', String.fromCharCode(previousCh));
                        if (specialChars[ch]) { // eslint-disable-line
                            break;
                        }
                        stringBuffer.push(String.fromCharCode(ch));
                        ch = this.nextChar();
                        continue;
                    }
                    stringBuffer.push(String.fromCharCode((x << 4) | x2));
                } else {
                    stringBuffer.push('#', String.fromCharCode(ch));
                }
            } else {
                stringBuffer.push(String.fromCharCode(ch));
            }
            ch = this.nextChar();
        }
        return _PdfName.get(stringBuffer.join(''));
    }
    getHexString(): string {
        const stringBuffer: string[] = this.stringBuffer;
        stringBuffer.length = 0;
        let ch: number = this.currentChar;
        let isFirstHex: boolean = true;
        let firstDigit: number;
        let secondDigit: number;
        this._hexStringNumber = 0;
        while (true) { // eslint-disable-line
            if (ch < 0) {
                break;
            } else if (ch === 0x3e) {
                this.nextChar();
                break;
            } else if (specialChars[ch] === 1) { // eslint-disable-line
                ch = this.nextChar();
                continue;
            } else {
                if (isFirstHex) {
                    firstDigit = this._toHexDigit(ch);
                    if (firstDigit === -1) {
                        ch = this.nextChar();
                        continue;
                    }
                } else {
                    secondDigit = this._toHexDigit(ch);
                    if (secondDigit === -1) {
                        ch = this.nextChar();
                        continue;
                    }
                    stringBuffer.push(String.fromCharCode((firstDigit << 4) | secondDigit));
                }
                isFirstHex = !isFirstHex;
                ch = this.nextChar();
            }
        }
        return stringBuffer.join('');
    }
    getObject(): any { // eslint-disable-line
        let comment: boolean = false;
        let ch: number = this.currentChar;
        while (true) { // eslint-disable-line
            if (ch < 0) {
                return endOfFile;
            }
            if (comment) {
                if (ch === 0x0a || ch === 0x0d) {
                    comment = false;
                }
            } else if (ch === 0x25) {
                comment = true;
            } else if (specialChars[ch] !== 1) { // eslint-disable-line
                break;
            }
            ch = this.nextChar();
        }
        switch (ch | 0) {
        case 0x30:
        case 0x31:
        case 0x32:
        case 0x33:
        case 0x34:
        case 0x35:
        case 0x36:
        case 0x37:
        case 0x38:
        case 0x39:
        case 0x2b:
        case 0x2d:
        case 0x2e:
            return this.getNumber();
        case 0x28:
            return this.getString();
        case 0x2f:
            return this.getName();
        case 0x5b:
            this.nextChar();
            return _PdfCommand.get('[');
        case 0x5d:
            this.nextChar();
            return _PdfCommand.get(']');
        case 0x3c:
            ch = this.nextChar();
            if (ch === 0x3c) {
                this.nextChar();
                return _PdfCommand.get('<<');
            }
            return this.getHexString();
        case 0x3e:
            ch = this.nextChar();
            if (ch === 0x3e) {
                this.nextChar();
                return _PdfCommand.get('>>');
            }
            return _PdfCommand.get('>');
        case 0x7b:
            this.nextChar();
            return _PdfCommand.get('{');
        case 0x7d:
            this.nextChar();
            return _PdfCommand.get('}');
        case 0x29:
            this.nextChar();
            throw new FormatError(`Illegal character: ${ch}`);
        }
        let str: string = String.fromCharCode(ch);
        if (ch < 0x20 || ch > 0x7f) {
            const nextCh: number = this.peekChar();
            if (nextCh >= 0x20 && nextCh <= 0x7f) {
                this.nextChar();
                return _PdfCommand.get(str);
            }
        }
        ch = this.nextChar();
        while (ch >= 0 && !specialChars[ch]) { // eslint-disable-line
            const possibleCommand: string = str + String.fromCharCode(ch);
            if (str.length === 128) {
                throw new FormatError(`Command token too long: ${str.length}`);
            }
            str = possibleCommand;
            ch = this.nextChar();
        }
        if (str === 'true') {
            return true;
        }
        if (str === 'false') {
            return false;
        }
        if (str === 'null') {
            return null;
        }
        if (str === 'BI') {
            this.beginInlineImagePosition = this.stream.position;
        }
        return _PdfCommand.get(str);
    }
    peekObj(): any { // eslint-disable-line
        const streamPos: number = this.stream.position;
        const currentChar: number = this.currentChar;
        const beginInlineImagePosition: number = this.beginInlineImagePosition;
        let nextObj: any; // eslint-disable-line
        try {
            nextObj = this.getObject();
        } catch (ex) { } // eslint-disable-line
        this.stream.position = streamPos;
        this.currentChar = currentChar;
        this.beginInlineImagePosition = beginInlineImagePosition;
        return nextObj;
    }
    skipToNextLine(): void {
        let ch: number = this.currentChar;
        while (ch >= 0) {
            if (ch === 0x0d) {
                ch = this.nextChar();
                if (ch === 0x0a) {
                    this.nextChar();
                }
                break;
            } else if (ch === 0x0a) {
                this.nextChar();
                break;
            }
            ch = this.nextChar();
        }
    }
    _toHexDigit(ch: number): number {
        if (ch >= 0x30 && ch <= 0x39) {
            return ch & 0x0f;
        }
        if ((ch >= 0x41 && ch <= 0x46) || (ch >= 0x61 && ch <= 0x66)) {
            return (ch & 0x0f) + 9;
        }
        return -1;
    }
}
export class _PdfParser {
    lexicalOperator: _PdfLexicalOperator;
    xref: _PdfCrossReference;
    allowStreams: boolean;
    recoveryMode: boolean;
    imageCache: Map<string, _PdfBaseStream>;
    first: any; // eslint-disable-line
    second: any; // eslint-disable-line
    private _isColorSpace: boolean = false;
    private _isPassword: boolean = false;
    constructor(lexicalOperator: _PdfLexicalOperator,
                xref: _PdfCrossReference,
                allowStreams: boolean = false,
                recoveryMode: boolean = false) {
        this.lexicalOperator = lexicalOperator;
        this.xref = xref;
        this.allowStreams = allowStreams;
        this.recoveryMode = recoveryMode;
        this.imageCache = new Map<string, _PdfBaseStream>();
        this.refill();
    }
    refill(): void {
        this.first = this.lexicalOperator.getObject();
        this.second = this.lexicalOperator.getObject();
    }
    shift(): void {
        if (this.second instanceof _PdfCommand && this.second.command === 'ID') {
            this.first = this.second;
            this.second = null;
        } else {
            this.first = this.second;
            this.second = this.lexicalOperator.getObject();
        }
    }
    tryShift(): boolean {
        try {
            this.shift();
            return true;
        } catch (e) {
            return false;
        }
    }
    getObject(cipherTransform ?: _CipherTransform): any { // eslint-disable-line
        const first: any = this.first; // eslint-disable-line
        this.shift();
        if (first instanceof _PdfCommand) {
            switch (first.command) {
            case 'BI':
                return this.makeInlineImage(cipherTransform);
            case '[':
                const array = []; // eslint-disable-line
                while (!_isCommand(this.first, ']') && this.first !== endOfFile) {
                    let entry: any = this.getObject(cipherTransform); // eslint-disable-line
                    if (array.length === 0 && _isName(entry, 'Indexed')) {
                        this._isColorSpace = true;
                    }
                    entry = _decodeText(entry, this._isColorSpace, this._isPassword);
                    array.push(entry);
                }
                if (this.first === endOfFile) {
                    if (this.recoveryMode) {
                        return array;
                    }
                    throw new ParserEndOfFileException('End of file inside array.');
                }
                this._isColorSpace = false;
                this.shift();
                return array;
            case '<<':
                const dictionary: _PdfDictionary = new _PdfDictionary(this.xref); // eslint-disable-line
                while (!_isCommand(this.first, '>>') && this.first !== endOfFile) {
                    if (!(this.first instanceof _PdfName)) {
                        this.shift();
                        continue;
                    }
                    const key: string = this.first.name;
                    if (key === 'U' || key === 'O' || key === 'ID') {
                        this._isPassword = true;
                    }
                    this.shift();
                    const isEnd: boolean = this._checkEnd();
                    if (isEnd) {
                        break;
                    }
                    let value: any = this.getObject(cipherTransform); // eslint-disable-line
                    value = _decodeText(value, this._isColorSpace, this._isPassword);
                    this._isPassword = false;
                    dictionary.set(key, value);
                }
                if (this.first === endOfFile) {
                    if (this.recoveryMode) {
                        return dictionary;
                    }
                    throw new ParserEndOfFileException('End of file inside dictionary.');
                }
                if (_isCommand(this.second, 'stream')) {
                    if (this.allowStreams === true) {
                        return this.makeStream(dictionary, cipherTransform);
                    } else {
                        return dictionary;
                    }
                }
                this.shift();
                return dictionary;
            default:
                return first;
            }
        }
        if (Number.isInteger(first)) {
            if (Number.isInteger(this.first) && _isCommand(this.second, 'R')) {
                const ref: _PdfReference = _PdfReference.get(first, this.first);
                this.shift();
                this.shift();
                return ref;
            }
            return first;
        }
        if (typeof first === 'string') {
            if (cipherTransform) {
                return cipherTransform.decryptString(first);
            }
            return first;
        }
        return first;
    }
    findDiscreteDecodeInlineStreamEnd(stream: any) { // eslint-disable-line
        const startPos: number = stream.position;
        let foundEnd: boolean = false;
        let b: number;
        let markerLength: number;
        b = stream.getByte();
        while (b !== -1) {
            if (b !== 0xff) {
                b = stream.getByte();
                continue;
            }
            switch (stream.getByte()) {
            case 0x00:
                break;
            case 0xff:
                stream.skip(-1);
                break;
            case 0xd9:
                foundEnd = true;
                break;
            case 0xc0:
            case 0xc1:
            case 0xc2:
            case 0xc3:
            case 0xc5:
            case 0xc6:
            case 0xc7:
            case 0xc9:
            case 0xca:
            case 0xcb:
            case 0xcd:
            case 0xce:
            case 0xcf:
            case 0xc4:
            case 0xcc:
            case 0xda:
            case 0xdb:
            case 0xdc:
            case 0xdd:
            case 0xde:
            case 0xdf:
            case 0xe0:
            case 0xe1:
            case 0xe2:
            case 0xe3:
            case 0xe4:
            case 0xe5:
            case 0xe6:
            case 0xe7:
            case 0xe8:
            case 0xe9:
            case 0xea:
            case 0xeb:
            case 0xec:
            case 0xed:
            case 0xee:
            case 0xef:
            case 0xfe:
                markerLength = stream.getUnsignedInteger16();
                if (markerLength > 2) {
                    stream.skip(markerLength - 2);
                } else {
                    stream.skip(-2);
                }
                break;
            }
            if (foundEnd) {
                break;
            }
            b = stream.getByte();
        }
        const length: number = stream.position - startPos;
        if (b === -1) {
            stream.skip(-length);
            return this.findDefaultInlineStreamEnd(stream);
        }
        this.inlineStreamSkipEI(stream);
        return length;
    }
    findDecodeInlineStreamEnd(stream: any) { // eslint-disable-line
        const startPos: number = stream.position;
        let ch: number;
        while ((ch = stream.getByte()) !== -1) { // eslint-disable-line
            if (ch === 0x7e) {
                const tildePos: number = stream.position;
                ch = stream.peekByte();
                while (_isWhiteSpace(ch)) {
                    stream.skip();
                    ch = stream.peekByte();
                }
                if (ch === 0x3e) {
                    stream.skip();
                    break;
                }
                if (stream.position > tildePos) {
                    const maybeEI: Uint8Array = stream.peekBytes(2);
                    if (maybeEI[0] === 0x45 && maybeEI[1] === 0x49) {
                        break;
                    }
                }
            }
        }
        const length: number = stream.position - startPos;
        if (ch === -1) {
            stream.skip(-length);
            return this.findDefaultInlineStreamEnd(stream);
        }
        this.inlineStreamSkipEI(stream);
        return length;
    }
    findHexDecodeInlineStreamEnd(stream: any) { // eslint-disable-line
        const startPos: number = stream.position;
        let ch: number;
        ch = stream.getByte();
        while (ch !== -1) {
            if (ch === 0x3e) {
                break;
            }
            ch = stream.getByte();
        }
        const length: number = stream.position - startPos;
        if (ch === -1) {
            stream.skip(-length);
            return this.findDefaultInlineStreamEnd(stream);
        }
        this.inlineStreamSkipEI(stream);
        return length;
    }
    inlineStreamSkipEI(stream: any): void { // eslint-disable-line
        let state: number = 0;
        let ch: number;
        ch = stream.getByte();
        while (ch !== -1) {
            if (state === 0) {
                state = ch === 0x45 ? 1 : 0;
            } else if (state === 1) {
                state = ch === 0x49 ? 2 : 0;
            } else if (state === 2) {
                break;
            }
            ch = stream.getByte();
        }
    }
    makeInlineImage(cipherTransform ?: _CipherTransform): any { // eslint-disable-line
        const lexicalOperator: _PdfLexicalOperator = this.lexicalOperator;
        const stream: _PdfStream = lexicalOperator.stream;
        const dictionary: _PdfDictionary = new _PdfDictionary(this.xref);
        let dictLength: number;
        while (!_isCommand(this.first, 'ID') && this.first !== endOfFile) {
            if (!(this.first instanceof _PdfName)) {
                throw new FormatError('Dictionary key must be a name object');
            }
            const key: string = this.first.name;
            this.shift();
            if (this.first.name === endOfFile) {
                break;
            }
            dictionary.set(key, this.getObject(cipherTransform));
        }
        if (lexicalOperator.beginInlineImagePosition !== -1) {
            dictLength = stream.position - lexicalOperator.beginInlineImagePosition;
        }
        const filter: any = dictionary.get('F', 'Filter'); // eslint-disable-line
        let filterName: string;
        if (filter instanceof _PdfName) {
            filterName = filter.name;
        } else if (Array.isArray(filter)) {
            const reference: any = filter[0]; // eslint-disable-line
            const filterZero: _PdfName = (reference !== null && typeof reference !== 'undefined' && reference instanceof _PdfReference) ?
                this.xref._fetch(reference) :
                reference;
            if (filterZero) {
                filterName = filterZero.name;
            }
        }
        const startPos: number = stream.position;
        let length: number;
        switch (filterName) {
        case 'DCT':
        case 'DCTDecode':
            length = this.findDiscreteDecodeInlineStreamEnd(stream);
            break;
        case 'A85':
        case 'ASCII85Decode':
            length = this.findDecodeInlineStreamEnd(stream);
            break;
        case 'AHx':
        case 'ASCIIHexDecode':
            length = this.findHexDecodeInlineStreamEnd(stream);
            break;
        default:
            length = this.findDefaultInlineStreamEnd(stream);
        }
        let imageStream: any = stream.makeSubStream(startPos, length, dictionary); // eslint-disable-line
        let cacheKey: string;
        if (length < maxCacheLength && dictLength < maxNumberLength) {
            const imageBytes: Uint8Array = imageStream.getBytes();
            imageStream.reset();
            const initialStreamPos: number = stream.position;
            stream.position = lexicalOperator.beginInlineImagePosition;
            const dictBytes: Uint8Array = stream.getBytes(dictLength);
            stream.position = initialStreamPos;
            cacheKey = this._computeMaxNumber(imageBytes) + '_' + this._computeMaxNumber(dictBytes);
            const cacheEntry: _PdfBaseStream = this.imageCache.get(cacheKey);
            if (cacheEntry !== undefined) {
                this.second = _PdfCommand.get('EI');
                this.shift();
                cacheEntry.reset();
                return cacheEntry;
            }
        }
        if (cipherTransform) {
            imageStream = cipherTransform.createStream(imageStream, length);
        }
        imageStream = this.filter(imageStream, dictionary, length);
        imageStream.dictionary = dictionary;
        if (cacheKey !== undefined) {
            this.imageCache.set(cacheKey, imageStream);
        }
        this.second = _PdfCommand.get('EI');
        this.shift();
        return imageStream;
    }
    _computeMaxNumber(bytes: Uint8Array): number {
        const bytesLength: number = bytes.length;
        let a: number = 1;
        let b: number = 0;
        for (let i: number = 0; i < bytesLength; ++i) {
            a += bytes[i] & 0xff; // eslint-disable-line
            b += a;
        }
        return (b % 65521 << 16) | a % 65521;
    }
    makeStream(dictionary: _PdfDictionary, cipherTransform ?: _CipherTransform) : any { // eslint-disable-line
        const lexicalOperator: _PdfLexicalOperator = this.lexicalOperator;
        let stream: any = lexicalOperator.stream; // eslint-disable-line
        lexicalOperator.skipToNextLine();
        const startPosition: number = stream.position - 1;
        let length: number = dictionary.get('Length');
        if (!Number.isInteger(length)) {
            length = 0;
        }
        stream.position = startPosition + length;
        lexicalOperator.nextChar();
        if (this.tryShift() && _isCommand(this.second, 'endstream')) {
            this.shift();
        } else {
            const endStreamSignature: Uint8Array = new Uint8Array([0x65, 0x6e, 0x64, 0x73, 0x74, 0x72, 0x65, 0x61, 0x6d]);
            let actualLength: number = this._findStreamLength(startPosition, endStreamSignature);
            if (actualLength < 0) {
                const end: number = endStreamSignature.length - 1;
                const truncatedSignature: Uint8Array = endStreamSignature.slice(0, end);
                const maybeLength: number = this._findStreamLength(startPosition, truncatedSignature);
                if (maybeLength >= 0) {
                    const lastByte: number = stream.peekBytes(end + 1)[end]; // eslint-disable-line
                    if (_isWhiteSpace(lastByte)) {
                        actualLength = maybeLength;
                    }
                }
                if (actualLength < 0) {
                    throw new FormatError('Missing endstream command.');
                }
            }
            length = actualLength;
            lexicalOperator.nextChar();
            this.shift();
            this.shift();
        }
        this.shift();
        stream = stream.makeSubStream(startPosition, length, dictionary);
        if (cipherTransform) {
            stream = cipherTransform.createStream(stream, length);
        }
        stream = this.filter(stream, dictionary, length);
        stream.dictionary = dictionary;
        return stream;
    }
    filter(stream: any, dictionary: _PdfDictionary, length: number): any { // eslint-disable-line
        let filter: any = dictionary.get('F', 'Filter'); // eslint-disable-line
        let params: any = dictionary.get('DP', 'DecodeParms'); // eslint-disable-line
        if (filter instanceof _PdfName) {
            return this.makeFilter(stream, filter.name, length, params);
        }
        let maybeLength: number = length;
        if (Array.isArray(filter)) {
            const filterArray: any = filter; // eslint-disable-line
            const paramsArray: any = params; // eslint-disable-line
            for (let i: number = 0; i < filterArray.length; ++i) {
                const reference: any = filterArray[Number.parseInt(i.toString(), 10)]; // eslint-disable-line
                filter = reference instanceof _PdfReference ? this.xref._fetch(reference) : reference;
                if (!(filter instanceof _PdfName)) {
                    throw new FormatError(`Bad filter name '${filter}'`);
                }
                params = null;
                if (Array.isArray(paramsArray) && i in paramsArray) {
                    const ref: any = paramsArray[Number.parseInt(i.toString(), 10)]; // eslint-disable-line
                    params = ref instanceof _PdfReference ? this.xref._fetch(ref) : ref;
                }
                stream = this.makeFilter(stream, filter.name, maybeLength, params);
                maybeLength = null;
            }
        }
        return stream;
    }
    makeFilter(stream: any, name: string, maybeLength: number, params: any) : any { // eslint-disable-line
        if (maybeLength === 0) {
            return new _PdfNullStream();
        }
        try {
            if (name === 'Fl' || name === 'FlateDecode') {
                if (params) {
                    return new PdfPredictorStream(new _PdfFlateStream(stream, maybeLength), maybeLength, params);
                }
                return new _PdfFlateStream(stream, maybeLength);
            }
            return stream;
        } catch (ex) {
            return new _PdfNullStream();
        }
    }
    _findStreamLength(startPosition: number, signature: Uint8Array): number {
        const stream: _PdfStream = this.lexicalOperator.stream;
        stream.position = startPosition;
        const length: number = 2048;
        const signatureLength: number = signature.length;
        while (stream.position < stream.end) {
            const scanBytes: Uint8Array = stream.peekBytes(length);
            const scanLength: number = scanBytes.length - signatureLength;
            if (scanLength <= 0) {
                break;
            }
            let position: number = 0;
            while (position < scanLength) {
                let j: number = 0;
                while (j < signatureLength && scanBytes[position + j] === signature[j]) { // eslint-disable-line
                    j++;
                }
                if (j >= signatureLength) {
                    stream.position += position;
                    return stream.position - startPosition;
                }
                position++;
            }
            stream.position += scanLength;
        }
        return -1;
    }
    findDefaultInlineStreamEnd(stream: any): number { // eslint-disable-line
        const startPosition: number = stream.position;
        const n: number = 10;
        let state: number = 0;
        let ch: number;
        let endImagePosition: number;
        ch = stream.getByte();
        while (ch !== -1) {
            if (state === 0) {
                state = ch === 0x45 ? 1 : 0;
            } else if (state === 1) {
                state = ch === 0x49 ? 2 : 0;
            } else {
                if (state !== 2) {
                    throw new Error('findDefaultInlineStreamEnd - invalid state.');
                }
                if (ch === 0x20 || ch === 0xa || ch === 0xd) {
                    endImagePosition = stream.position;
                    const followingBytes: Uint8Array = stream.peekBytes(n);
                    for (let i: number = 0, ii: number = followingBytes.length; i < ii; i++) {
                        ch = followingBytes[i]; // eslint-disable-line
                        if (ch === 0x0 && followingBytes[i + 1] !== 0x0) {
                            continue;
                        }
                        if (ch !== 0xa && ch !== 0xd && (ch < 0x20 || ch > 0x7f)) {
                            state = 0;
                            break;
                        }
                    }
                    if (state !== 2) {
                        ch = stream.getByte();
                        continue;
                    }
                    if (state === 2) {
                        break;
                    }
                } else {
                    state = 0;
                }
            }
            ch = stream.getByte();
        }
        if (ch === -1) {
            if (typeof endImagePosition !== 'undefined') {
                stream.skip(-(stream.position - endImagePosition));
            }
        }
        let endOffset: number = 4;
        stream.skip(-endOffset);
        ch = stream.peekByte();
        stream.skip(endOffset);
        if (!_isWhiteSpace(ch)) {
            endOffset--;
        }
        return stream.position - endOffset - startPosition;
    }
    _checkEnd() : boolean {
        if (this.first === endOfFile) {
            return true;
        } else {
            return false;
        }
    }
}
/* eslint-disable */
export class _Linearization {
    length: number;
    xref: _PdfCrossReference;
    hints: number[];
    objectNumberFirst: number;
    endFirst: number;
    pageCount: number;
    mainXRefEntriesOffset: number;
    pageFirst: number;
    isValid: boolean = false;
    constructor(stream: _PdfStream) {
        const parser: _PdfParser = new _PdfParser(new _PdfLexicalOperator(stream), null);
        const obj1: number = parser.getObject();
        const obj2: number = parser.getObject();
        const obj3: _PdfCommand = parser.getObject();
        const dictionary: _PdfDictionary = parser.getObject();
        this.isValid = Number.isInteger(obj1) && Number.isInteger(obj2) && _isCommand(obj3, 'obj') && typeof dictionary !== 'undefined';
        if (this.isValid) {
            let obj: number = dictionary.get('Linearized');
            this.isValid = typeof obj !== 'undefined' && obj > 0;
        }                
        if (this.isValid) {
            const length: number = this.getInt(dictionary, 'L');
            if (length !== stream.length) {
                throw new Error('The L parameter in the linearization dictionary ' + 'does not equal the stream length.');
            }
            this.length = length;
            this.hints = this.getHints(dictionary);
            this.objectNumberFirst = this.getInt(dictionary, 'O');
            this.endFirst = this.getInt(dictionary, 'E');
            this.pageCount = this.getInt(dictionary, 'N');
            this.mainXRefEntriesOffset = this.getInt(dictionary, 'T');
            this.pageFirst = dictionary.has('P') ? this.getInt(dictionary, 'P', true) : 0;
        }
    }
    getInt(dictionary: _PdfDictionary, name: string, allowZeroValue: boolean = false) {
        const obj: number = dictionary.get(name);
        if (typeof obj !== 'undefined' && Number.isInteger(obj) && (allowZeroValue ? obj >= 0 : obj > 0)) {
            return obj;
        }
        throw new Error(`The '${name}' parameter in the linearization ` + 'dictionary is invalid.');
    }
    getHints(dictionary: _PdfDictionary) {
        const hints: Array<number> = dictionary.getArray('H');
        let hintsLength: number = hints.length;
        if (hints && (hintsLength === 2 || hintsLength === 4)) {
            for (let index: number = 0; index < hintsLength; index++) {
                const hint: number = hints[index];
                if (!(Number.isInteger(hint) && hint > 0)) {
                    throw new Error(`Hint (${index}) in the linearization dictionary is invalid.`);
                }
            }
            return hints;
        }
        throw new Error('Hint array in the linearization dictionary is invalid.');
    }
}
/* eslint-enable */
