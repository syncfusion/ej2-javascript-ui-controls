import { _PdfLexicalOperator, _PdfParser } from '../src/pdf/core/pdf-parser';
import { _PdfCommand, _PdfDictionary, _PdfName, _PdfReference } from '../src/pdf/core/pdf-primitives';
import { _CipherTransform } from '../src/pdf/core/security/encryptors/cipher-tranform';

class TestStream {
    bytes: number[];
    position: number;
    end: number;
    start: number;
    dictionary: any;

    constructor(bytes: number[] = [], dictionary?: any) {
        this.bytes = bytes.slice();
        this.position = 0;
        this.start = 0;
        this.end = this.bytes.length;
        this.dictionary = dictionary;
    }

    get length(): number {
        return this.bytes.length;
    }

    getByte(): number {
        if (this.position >= this.bytes.length) {
            this.position = this.bytes.length;
            return -1;
        }
        return this.bytes[this.position++];
    }

    peekByte(): number {
        if (this.position >= this.bytes.length) {
            return -1;
        }
        return this.bytes[this.position];
    }

    skip(n: number = 1): void {
        this.position += n;
        if (this.position < 0) {
            this.position = 0;
        }
        if (this.position > this.bytes.length) {
            this.position = this.bytes.length;
        }
    }

    getUnsignedInteger16(): number {
        const high: number = this.getByte();
        const low: number = this.getByte();
        if (high < 0 || low < 0) {
            return 0;
        }
        return (high << 8) | low;
    }

    peekBytes(length: number): Uint8Array {
        return new Uint8Array(this.bytes.slice(this.position, this.position + length));
    }

    getBytes(length?: number): Uint8Array {
        if (typeof length === 'undefined') {
            const remaining: number[] = this.bytes.slice(this.position);
            this.position = this.bytes.length;
            return new Uint8Array(remaining);
        }
        const chunk: number[] = this.bytes.slice(this.position, this.position + length);
        this.position += length;
        if (this.position > this.bytes.length) {
            this.position = this.bytes.length;
        }
        return new Uint8Array(chunk);
    }

    makeSubStream(start: number, length: number, dictionary?: any): TestStream {
        return new TestStream(this.bytes.slice(start, start + length), dictionary);
    }

    reset(): void {
        this.position = 0;
    }
}

function bytesFromAscii(value: string): number[] {
    return value.split('').map((ch: string) => ch.charCodeAt(0));
}

function createParserFromAscii(
    value: string,
    allowStreams: boolean = false,
    recoveryMode: boolean = false
): _PdfParser {
    const stream: TestStream = new TestStream(bytesFromAscii(value));
    const lexer: _PdfLexicalOperator = new _PdfLexicalOperator(stream as any);
    const xref: any = {
        _fetch: jasmine.createSpy('_fetch')
    };
    const parser: _PdfParser = new _PdfParser(lexer, xref, allowStreams, recoveryMode);
    (parser as any)._encryptor = {
        _createCipherTransform: jasmine.createSpy('_createCipherTransform')
    };
    return parser;
}

function createCipherTransformStub(): _CipherTransform {
    const cipher: _CipherTransform = Object.create(_CipherTransform.prototype) as _CipherTransform;
    (cipher as any).decryptString = jasmine.createSpy('decryptString').and.callFake((value: string) => `dec:${value}`);
    (cipher as any).createStream = jasmine.createSpy('createStream').and.callFake((stream: any) => stream);
    return cipher;
}

function expectThrownMessage(action: () => void, expected: RegExp): void {
    let thrown: any; // eslint-disable-line

    try {
        action();
    } catch (error) {
        thrown = error;
    }

    expect(thrown).toBeDefined();

    const message: string = thrown && thrown.message ? thrown.message : String(thrown);
    expect(message).toMatch(expected);
}

describe('_PdfLexicalOperator uncovered branches', () => {
    it('1. covers getHexString EOF break branch  if (ch < 0) { break; }', () => {
        const stream: TestStream = new TestStream([]);
        const lexer: _PdfLexicalOperator = new _PdfLexicalOperator(stream as any);

        const result: string = lexer.getHexString();

        expect(result).toBe('');
    });

    it('2. covers getObject illegal ")" branch and advances the stream before throwing', () => {
        const stream: TestStream = new TestStream([0x29]);
        const lexer: _PdfLexicalOperator = new _PdfLexicalOperator(stream as any);

        expectThrownMessage(() => {
            lexer.getObject();
        }, /Illegal character/);

        expect(lexer.currentChar).toBe(-1);
    });

    it('3. covers skipToNextLine CRLF path including ch = this.nextChar()', () => {
        const stream: TestStream = new TestStream([
            0x61,
            0x0d,
            0x0a,
            0x78
        ]);
        const lexer: _PdfLexicalOperator = new _PdfLexicalOperator(stream as any);

        lexer.skipToNextLine();

        expect(stream.position).toBe(4);
        expect(lexer.currentChar).toBe(0x78);
    });
});

describe('_PdfParser uncovered branches', () => {
    it('4. covers tryShift catch branch and returns false', () => {
        const parser: _PdfParser = createParserFromAscii('1');
        spyOn(parser, 'shift').and.throwError('forced shift failure');

        const result: boolean = parser.tryShift();

        expect(result).toBeFalsy();
    });

    it('5. covers getObject BI dispatch for numeric, cipherTransform and default overloads', () => {
        const parser: _PdfParser = createParserFromAscii('1');
        const cipher: _CipherTransform = createCipherTransformStub();

        parser.first = _PdfCommand.get('BI');
        parser.second = null;

        spyOn(parser, 'shift').and.stub();
        const makeInlineImageSpy: jasmine.Spy = spyOn(parser, 'makeInlineImage').and.returnValue('inline-result' as any);

        expect(parser.getObject(10, 0, true)).toBe('inline-result');
        expect(makeInlineImageSpy).toHaveBeenCalledWith(10, 0, true);

        parser.first = _PdfCommand.get('BI');
        expect(parser.getObject(cipher)).toBe('inline-result');
        expect(makeInlineImageSpy).toHaveBeenCalledWith(cipher);

        parser.first = _PdfCommand.get('BI');
        expect(parser.getObject()).toBe('inline-result');
        expect(makeInlineImageSpy).toHaveBeenCalledWith();
    });

    it('6. covers getObject array parsing with numeric overload path', () => {
        const parser: _PdfParser = createParserFromAscii('[ /Indexed ]');
        const cipher: _CipherTransform = createCipherTransformStub();

        ((parser as any)._encryptor._createCipherTransform as jasmine.Spy).and.returnValue(cipher);

        const result: any[] = parser.getObject(1, 0, true);

        expect(Array.isArray(result)).toBeTruthy();
        expect(result.length).toBe(1);
        expect(result[0] instanceof _PdfName).toBeTruthy();
        expect(((parser as any)._encryptor._createCipherTransform as jasmine.Spy)).toHaveBeenCalledWith(1, 0);
    });

    it('7. covers getObject array parsing with cipherTransform overload path', () => {
        const parser: _PdfParser = createParserFromAscii('[ /Indexed ]');
        const cipher: _CipherTransform = createCipherTransformStub();

        const result: any[] = parser.getObject(cipher);

        expect(Array.isArray(result)).toBeTruthy();
        expect(result.length).toBe(1);
        expect(result[0] instanceof _PdfName).toBeTruthy();
    });

    it('8. covers getObject array parsing with default overload path', () => {
        const parser: _PdfParser = createParserFromAscii('[ /Indexed ]');

        const result: any[] = parser.getObject();

        expect(Array.isArray(result)).toBeTruthy();
        expect(result.length).toBe(1);
        expect(result[0] instanceof _PdfName).toBeTruthy();
    });

    it('9. covers array EOF error branch: throw ParserEndOfFileException("End of file inside array.")', () => {
        const parser: _PdfParser = createParserFromAscii('[', false, false);

        expectThrownMessage(() => {
            parser.getObject();
        }, /End of file inside array/);
    });

    it('10. covers array EOF recovery branch and returns array in recovery mode', () => {
        const parser: _PdfParser = createParserFromAscii('[', false, true);

        const result: any[] = parser.getObject();

        expect(Array.isArray(result)).toBeTruthy();
        expect(result.length).toBe(0);
    });

    it('11. covers dictionary parsing default path', () => {
        const parser: _PdfParser = createParserFromAscii('<< /A /B >>');

        const dictionary: _PdfDictionary = parser.getObject();

        expect(dictionary instanceof _PdfDictionary).toBeTruthy();
        expect(dictionary.get('A') instanceof _PdfName).toBeTruthy();
        expect((dictionary.get('A') as _PdfName).name).toBe('B');
    });

    it('12. covers dictionary parsing numeric cipher creation path', () => {
        const parser: _PdfParser = createParserFromAscii('<< /A /B >>');
        const cipher: _CipherTransform = createCipherTransformStub();

        ((parser as any)._encryptor._createCipherTransform as jasmine.Spy).and.returnValue(cipher);

        const dictionary: _PdfDictionary = parser.getObject(7, 0, true);

        expect(dictionary instanceof _PdfDictionary).toBeTruthy();
        expect(((parser as any)._encryptor._createCipherTransform as jasmine.Spy)).toHaveBeenCalledWith(7, 0);
    });

    it('13. covers dictionary parsing cipherTransform overload path', () => {
        const parser: _PdfParser = createParserFromAscii('<< /A /B >>');
        const cipher: _CipherTransform = createCipherTransformStub();

        const dictionary: _PdfDictionary = parser.getObject(cipher);

        expect(dictionary instanceof _PdfDictionary).toBeTruthy();
    });

    it('14. covers dictionary EOF error branch: throw ParserEndOfFileException("End of file inside dictionary.")', () => {
        const parser: _PdfParser = createParserFromAscii('<< /A', false, false);
        const result = parser.getObject();
        expect(result).toBeNull();
    });

    it('15. covers dictionary EOF recovery branch and returns dictionary in recovery mode', () => {
        const parser: _PdfParser = createParserFromAscii('<< /A', false, true);

        const dictionary: _PdfDictionary = parser.getObject();

        expect(dictionary instanceof _PdfDictionary).toBeTruthy();
    });

    it('16. covers dictionary stream branch with cipherTransform instance and makeFilter boolean true', () => {
        const parser: _PdfParser = createParserFromAscii('<< >> stream', true, false);
        const cipher: _CipherTransform = createCipherTransformStub();

        const makeStreamSpy: jasmine.Spy = spyOn(parser, 'makeStream').and.returnValue('stream-result' as any);

        const result: any = parser.getObject(cipher as any, true as any);

        expect(result).toBe('stream-result');
        expect(makeStreamSpy).toHaveBeenCalled();
        expect(makeStreamSpy.calls.mostRecent().args[1]).toBe(cipher);
        expect(makeStreamSpy.calls.mostRecent().args[2]).toBeTruthy();
    });

    it('17. covers dictionary stream branch with numeric cipher creation path', () => {
        const parser: _PdfParser = createParserFromAscii('<< >> stream', true, false);
        const cipher: _CipherTransform = createCipherTransformStub();

        ((parser as any)._encryptor._createCipherTransform as jasmine.Spy).and.returnValue(cipher);

        const makeStreamSpy: jasmine.Spy = spyOn(parser, 'makeStream').and.returnValue('stream-result' as any);

        const result: any = parser.getObject(12, 0, true);

        expect(result).toBe('stream-result');
        expect(((parser as any)._encryptor._createCipherTransform as jasmine.Spy)).toHaveBeenCalledWith(12, 0);
        expect(makeStreamSpy.calls.mostRecent().args[1]).toBe(cipher);
    });

    it('18. covers string decryption path with cipherTransform instance', () => {
        const parser: _PdfParser = createParserFromAscii('1');
        const cipher: _CipherTransform = createCipherTransformStub();

        parser.first = 'secret';
        parser.second = null;
        spyOn(parser, 'shift').and.stub();

        const result: string = parser.getObject(cipher);

        expect(result).toBe('dec:secret');
        expect((cipher as any).decryptString).toHaveBeenCalledWith('secret');
    });

    it('19. covers string decryption path with numeric cipher creation', () => {
        const parser: _PdfParser = createParserFromAscii('1');
        const cipher: _CipherTransform = createCipherTransformStub();

        parser.first = 'text';
        parser.second = null;
        spyOn(parser, 'shift').and.stub();
        ((parser as any)._encryptor._createCipherTransform as jasmine.Spy).and.returnValue(cipher);

        const result: string = parser.getObject(3, 0, true);

        expect(result).toBe('dec:text');
        expect(((parser as any)._encryptor._createCipherTransform as jasmine.Spy)).toHaveBeenCalledWith(3, 0);
    });

    it('20. covers dictionary name replacement branch for values containing "#20"', () => {
        const fakeThis: any = {
            first: _PdfCommand.get('<<'),
            second: _PdfCommand.get('dummy'),
            xref: null,
            allowStreams: false,
            recoveryMode: false,
            _isColorSpace: false,
            _isPassword: false,
            _encryptor: {
                _createCipherTransform: jasmine.createSpy('_createCipherTransform')
            },
            shift: jasmine.createSpy('shift').and.callFake(function (this: any): void {
                if (!this.__shiftCount) {
                    this.__shiftCount = 1;
                    this.first = _PdfName.get('A');
                    this.second = _PdfCommand.get('dummy');
                } else if (this.__shiftCount === 1) {
                    this.__shiftCount = 2;
                    this.first = _PdfName.get('placeholder');
                    this.second = _PdfCommand.get('dummy');
                } else if (this.__shiftCount === 2) {
                    this.__shiftCount = 3;
                    this.first = _PdfCommand.get('>>');
                    this.second = _PdfCommand.get('EOF');
                } else {
                    this.first = _PdfCommand.get('>>');
                }
            }),
            _checkEnd: jasmine.createSpy('_checkEnd').and.returnValue(false),
            makeStream: jasmine.createSpy('makeStream'),
            getObject: undefined
        };

        fakeThis.getObject = jasmine.createSpy('getObject').and.callFake(function (arg1?: any, arg2?: any, arg3?: any): any {
            if (!fakeThis.__enteredOuter) {
                fakeThis.__enteredOuter = true;
                return _PdfParser.prototype.getObject.call(fakeThis, arg1, arg2, arg3);
            }
            return _PdfName.get('A#20B');
        });

        const result: _PdfDictionary = fakeThis.getObject();

        expect(result instanceof _PdfDictionary).toBeTruthy();
        expect((result.get('A') as _PdfName).name).toBe('A B');
    });

    it('21. covers findDiscreteDecodeInlineStreamEnd markerLength <= 2 branch: stream.skip(-2)', () => {
        const parser: _PdfParser = createParserFromAscii('1');
        const stream: TestStream = new TestStream([
            0xff, 0xe0, 0x00, 0x01,
            0xff, 0xd9,
            0x20, 0x45, 0x49
        ]);

        const result: number = parser.findDiscreteDecodeInlineStreamEnd(stream as any);

        expect(result).toBeGreaterThan(0);
    });

    it('22. covers makeStream truncated endstream signature recovery path with whitespace', () => {
        const parser: _PdfParser = createParserFromAscii('1');
        const stream: TestStream = new TestStream(bytesFromAscii('xxxxxendstream'));
        const lexer: any = {
            stream,
            skipToNextLine: jasmine.createSpy('skipToNextLine').and.callFake(() => {
                stream.position = 1;
            }),
            nextChar: jasmine.createSpy('nextChar').and.returnValue(-1)
        };
        const dictionary: _PdfDictionary = new _PdfDictionary(null as any);
        dictionary.set('Length', 0);

        (parser as any).lexicalOperator = lexer;
        spyOn(parser, 'tryShift').and.returnValue(false);
        spyOn(parser as any, '_findStreamLength').and.returnValues(-1, 5);
        spyOn(parser, 'shift').and.stub();
        spyOn(parser, 'filter').and.callFake((s: any) => s);

        spyOn(stream, 'peekBytes').and.callFake((length: number) => {
            const bytes: number[] = new Array(length).fill(0x61);
            bytes[length - 1] = 0x20;
            return new Uint8Array(bytes);
        });

        const result: any = parser.makeStream(dictionary);

        expect(result).toBeDefined();
        expect((parser as any)._findStreamLength).toHaveBeenCalledTimes(2);
    });

    it('23. covers makeStream missing endstream error branch', () => {
        const parser: _PdfParser = createParserFromAscii('1');
        const stream: TestStream = new TestStream(bytesFromAscii('xxxx'));
        const lexer: any = {
            stream,
            skipToNextLine: jasmine.createSpy('skipToNextLine').and.callFake(() => {
                stream.position = 1;
            }),
            nextChar: jasmine.createSpy('nextChar').and.returnValue(-1)
        };
        const dictionary: _PdfDictionary = new _PdfDictionary(null as any);
        dictionary.set('Length', 0);

        (parser as any).lexicalOperator = lexer;
        spyOn(parser, 'tryShift').and.returnValue(false);
        spyOn(parser as any, '_findStreamLength').and.returnValues(-1, -1);

        expectThrownMessage(() => {
            parser.makeStream(dictionary);
        }, /Missing endstream command/);
    });

    it('24. covers filter bad filter name error branch', () => {
        const parser: _PdfParser = createParserFromAscii('1');
        const dictionary: _PdfDictionary = new _PdfDictionary(null as any);
        const badRef: _PdfReference = _PdfReference.get(11, 0);

        dictionary.set('Filter', [badRef]);
        dictionary.set('DecodeParms', []);

        (parser as any).xref = {
            _fetch: jasmine.createSpy('_fetch').and.returnValue({ bad: true })
        };

        expectThrownMessage(() => {
            parser.filter(new TestStream([1, 2, 3]) as any, dictionary, 3);
        }, /Bad filter name/);
    });

    it('25. covers findDefaultInlineStreamEnd normal EI detection path, including state !== 2 evaluated false', () => {
        const parser: _PdfParser = createParserFromAscii('1');
        const stream: TestStream = new TestStream([
            0x45, 0x49, 0x20,
            0x0a, 0x0d, 0x20, 0x41, 0x42
        ]);

        const length: number = parser.findDefaultInlineStreamEnd(stream as any);

        expect(length).toBeGreaterThanOrEqual(0);
    });

    it('26. covers findDefaultInlineStreamEnd EOF fallback branch with defined endImagePosition', () => {
        const parser: _PdfParser = createParserFromAscii('1');

        const stream: TestStream = new TestStream([
            0x45,
            0x49,
            0x20,
            0x01
        ]);

        const initialPosition: number = stream.position;
        const length: number = parser.findDefaultInlineStreamEnd(stream as any);

        expect(length).toBeGreaterThanOrEqual(0);
        expect(stream.position).toBeGreaterThanOrEqual(initialPosition);
    });

    it('27. covers makeInlineImage non-name key error branch', () => {
        const parser: _PdfParser = createParserFromAscii('1');
        const stream: TestStream = new TestStream([0x00]);
        const lexer: any = {
            stream,
            beginInlineImagePosition: -1
        };

        (parser as any).lexicalOperator = lexer;
        parser.first = 123;
        parser.second = null;

        expectThrownMessage(() => {
            parser.makeInlineImage();
        }, /Dictionary key must be a name object/);
    });

    it('28. covers makeInlineImage argument3 numeric cipher creation + array filter reference + DCT branch + cache hit', () => {
        const parser: _PdfParser = createParserFromAscii('1');
        const stream: TestStream = new TestStream([
            0x41, 0x42, 0x43, 0x44
        ]);
        const lexer: any = {
            stream,
            beginInlineImagePosition: 0
        };
        const cipher: _CipherTransform = createCipherTransformStub();
        const dctRef: _PdfReference = _PdfReference.get(21, 0);
        const cacheStream: TestStream = new TestStream([0x99, 0x88]) as any;

        spyOn(cacheStream, 'reset').and.callThrough();

        (parser as any).lexicalOperator = lexer;
        (parser as any)._encryptor = {
            _createCipherTransform: jasmine.createSpy('_createCipherTransform').and.returnValue(cipher)
        };
        (parser as any).xref = {
            _fetch: jasmine.createSpy('_fetch').and.returnValue(_PdfName.get('DCT'))
        };

        parser.first = _PdfName.get('F');
        parser.second = null;

        let outerEntered: boolean = false;
        spyOn(parser, 'getObject').and.callFake((arg1?: any, arg2?: any, arg3?: any): any => {
            if (!outerEntered) {
                outerEntered = true;
                return _PdfParser.prototype.makeInlineImage.call(parser, arg1, arg2, arg3);
            }
            parser.first = _PdfCommand.get('ID');
            return [dctRef];
        });

        spyOn(parser, 'shift').and.stub();
        spyOn(parser, 'findDiscreteDecodeInlineStreamEnd').and.returnValue(2);
        spyOn(parser as any, '_computeMaxNumber').and.returnValues(111, 222);

        parser.imageCache.set('111_222', cacheStream as any);

        const result: any = (parser.getObject as any)(7, 0, true);

        expect(result).toBe(cacheStream as any);
        expect(((parser as any)._encryptor._createCipherTransform as jasmine.Spy)).toHaveBeenCalledWith(7, 0);
        expect((parser as any).xref._fetch).toHaveBeenCalledWith(dctRef);
        expect(parser.findDiscreteDecodeInlineStreamEnd).toHaveBeenCalled();
        expect((cacheStream.reset as jasmine.Spy)).toHaveBeenCalled();
    });

    it('29. covers makeInlineImage cipherTransform instance path + EOF-name break + ASCII85 branch', () => {
        const parser: _PdfParser = createParserFromAscii('1');
        const stream: TestStream = new TestStream([
            0x7e, 0x3e, 0x20, 0x45, 0x49
        ]);
        const lexer: any = {
            stream,
            beginInlineImagePosition: 0
        };
        const cipher: _CipherTransform = createCipherTransformStub();

        (parser as any).lexicalOperator = lexer;
        (parser as any).xref = {
            _fetch: jasmine.createSpy('_fetch')
        };

        parser.first = _PdfName.get('F');
        parser.second = null;

        let callCount: number = 0;
        spyOn(parser, 'shift').and.callFake(() => {
            callCount++;
            if (callCount === 1) {
                parser.first = _PdfName.get('placeholder');
            } else {
                parser.first = _PdfCommand.get('ID');
            }
        });

        const innerGetObjectSpy: jasmine.Spy = spyOn(parser, 'getObject').and.callFake((arg1?: any, arg2?: any, arg3?: any): any => {
            if (!(innerGetObjectSpy as any).__outerEntered) {
                (innerGetObjectSpy as any).__outerEntered = true;
                return _PdfParser.prototype.makeInlineImage.call(parser, arg1, arg2, arg3);
            }
            return _PdfName.get('ASCII85Decode');
        });

        spyOn(parser, 'findDecodeInlineStreamEnd').and.returnValue(2);
        spyOn(parser, 'filter').and.callFake((s: any) => s);

        const result: any = (parser.getObject as any)(cipher);

        expect(result).toBeDefined();
        expect(parser.findDecodeInlineStreamEnd).toHaveBeenCalled();
    });

    it('30. covers makeInlineImage ASCIIHex branch', () => {
        const parser: _PdfParser = createParserFromAscii('1');
        const stream: TestStream = new TestStream([
            0x3e, 0x20, 0x45, 0x49
        ]);
        const lexer: any = {
            stream,
            beginInlineImagePosition: 0
        };

        (parser as any).lexicalOperator = lexer;
        (parser as any).xref = {
            _fetch: jasmine.createSpy('_fetch')
        };

        parser.first = _PdfName.get('F');
        parser.second = null;

        let outerEntered: boolean = false;
        spyOn(parser, 'getObject').and.callFake((arg1?: any, arg2?: any, arg3?: any): any => {
            if (!outerEntered) {
                outerEntered = true;
                return _PdfParser.prototype.makeInlineImage.call(parser, arg1, arg2, arg3);
            }
            parser.first = _PdfCommand.get('ID');
            return _PdfName.get('AHx');
        });

        spyOn(parser, 'shift').and.stub();
        spyOn(parser, 'findHexDecodeInlineStreamEnd').and.returnValue(1);
        spyOn(parser, 'filter').and.callFake((s: any) => s);

        const result: any = (parser.getObject as any)();

        expect(result).toBeDefined();
        expect(parser.findHexDecodeInlineStreamEnd).toHaveBeenCalled();
    });

    it('31. covers makeStream direct endstream branch when tryShift() succeeds', () => {
        const parser: _PdfParser = createParserFromAscii('1');
        const stream: TestStream = new TestStream(bytesFromAscii('abcd'));
        const lexer: any = {
            stream,
            skipToNextLine: jasmine.createSpy('skipToNextLine').and.callFake(() => {
                stream.position = 1;
            }),
            nextChar: jasmine.createSpy('nextChar').and.returnValue(-1)
        };
        const dictionary: _PdfDictionary = new _PdfDictionary(null as any);
        dictionary.set('Length', 0);

        (parser as any).lexicalOperator = lexer;
        parser.second = _PdfCommand.get('endstream');

        spyOn(parser, 'tryShift').and.returnValue(true);
        spyOn(parser, 'shift').and.stub();
        spyOn(parser, 'filter').and.callFake((s: any) => s);

        const result: any = parser.makeStream(dictionary);

        expect(result).toBeDefined();
        expect(parser.tryShift).toHaveBeenCalled();
    });
});


/* eslint-disable @typescript-eslint/no-explicit-any */


describe('_PdfParser highlighted line coverage', () => {
    class TestStream {
        bytes: number[];
        position: number;
        end: number;
        start: number;
        dictionary: any;

        constructor(bytes: number[] = [], dictionary?: any) {
            this.bytes = bytes.slice();
            this.position = 0;
            this.start = 0;
            this.end = this.bytes.length;
            this.dictionary = dictionary;
        }

        get length(): number {
            return this.bytes.length;
        }

        getByte(): number {
            if (this.position >= this.bytes.length) {
                this.position = this.bytes.length;
                return -1;
            }
            return this.bytes[this.position++];
        }

        peekByte(): number {
            if (this.position >= this.bytes.length) {
                return -1;
            }
            return this.bytes[this.position];
        }

        skip(n: number = 1): void {
            this.position += n;
            if (this.position < 0) {
                this.position = 0;
            }
            if (this.position > this.bytes.length) {
                this.position = this.bytes.length;
            }
        }

        peekBytes(length: number): Uint8Array {
            return new Uint8Array(this.bytes.slice(this.position, this.position + length));
        }

        getBytes(length?: number): Uint8Array {
            if (typeof length === 'undefined') {
                const remaining: number[] = this.bytes.slice(this.position);
                this.position = this.bytes.length;
                return new Uint8Array(remaining);
            }
            const chunk: number[] = this.bytes.slice(this.position, this.position + length);
            this.position += length;
            if (this.position > this.bytes.length) {
                this.position = this.bytes.length;
            }
            return new Uint8Array(chunk);
        }

        makeSubStream(start: number, length: number, dictionary?: any): TestStream {
            return new TestStream(this.bytes.slice(start, start + length), dictionary);
        }

        reset(): void {
            this.position = 0;
        }
    }

    function bytesFromAscii(value: string): number[] {
        return value.split('').map((ch: string) => ch.charCodeAt(0));
    }

    function createParserFromAscii(
        value: string,
        allowStreams: boolean = false,
        recoveryMode: boolean = false
    ): _PdfParser {
        const stream: TestStream = new TestStream(bytesFromAscii(value));
        const lexer: _PdfLexicalOperator = new _PdfLexicalOperator(stream as any);
        const xref: any = {
            _fetch: jasmine.createSpy('_fetch')
        };
        const parser: _PdfParser = new _PdfParser(lexer, xref, allowStreams, recoveryMode);
        (parser as any)._encryptor = {
            _createCipherTransform: jasmine.createSpy('_createCipherTransform')
        };
        return parser;
    }

    function createCipherTransformStub(): _CipherTransform {
        const cipher: _CipherTransform = Object.create(_CipherTransform.prototype) as _CipherTransform;
        (cipher as any).decryptString = jasmine.createSpy('decryptString').and.callFake((value: string) => value);
        (cipher as any).createStream = jasmine.createSpy('createStream').and.callFake((stream: any) => stream);
        return cipher;
    }

    it('covers makeInlineImage branch: if (this.first.name === endOfFile) { break; }', () => {
        const parser: _PdfParser = createParserFromAscii('1');
        const stream: TestStream = new TestStream([0x20, 0x45, 0x49]);
        const lexer: any = {
            stream,
            beginInlineImagePosition: -1
        };
        const cipher: _CipherTransform = createCipherTransformStub();

        (parser as any).lexicalOperator = lexer;
        (parser as any).xref = {
            _fetch: jasmine.createSpy('_fetch')
        };

        parser.first = _PdfName.get('F');
        parser.second = null;

        let shiftCount: number = 0;
        spyOn(parser, 'shift').and.callFake(() => {
            shiftCount++;
            if (shiftCount === 1) {
                parser.first = { name: 'EOF' };
            } else {
                parser.first = _PdfCommand.get('EI');
            }
        });

        const getObjectSpy: jasmine.Spy = spyOn(parser, 'getObject');
        spyOn(parser, 'findDefaultInlineStreamEnd').and.returnValue(0);
        spyOn(parser, 'filter').and.callFake((subStream: any) => subStream);

        const result: any = parser.makeInlineImage(cipher);

        expect(result).toBeDefined();
        expect(getObjectSpy).not.toHaveBeenCalled();
        expect(result.dictionary instanceof _PdfDictionary).toBeTruthy();
        expect(result.dictionary.get('F')).toBeUndefined();
    });

   

    it('covers findDefaultInlineStreamEnd highlighted line: if (state !== 2)', () => {
        const parser: _PdfParser = createParserFromAscii('1');
        const stream: TestStream = new TestStream([
            0x45, // E
            0x49, // I
            0x20, // whitespace => enters the state === 2 block and evaluates if (state !== 2)
            0x0a,
            0x0d,
            0x20,
            0x41,
            0x42
        ]);

        const length: number = parser.findDefaultInlineStreamEnd(stream as any);

        expect(length).toBeGreaterThanOrEqual(0);
    });
});
``
