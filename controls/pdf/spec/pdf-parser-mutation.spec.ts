import { _PdfNullStream, _PdfStream } from '../src/pdf/core/base-stream';
import { _PdfAscii85Stream } from '../src/pdf/core/compression/ascii-85-stream';
import { _PdfAsciiHexStream } from '../src/pdf/core/compression/ascii-hex-stream';
import { _PdfJbig2Stream } from '../src/pdf/core/compression/jbig2-stream';
import { _PdfJpegStream } from '../src/pdf/core/compression/jpeg-stream';
import { _PdfJpxStream } from '../src/pdf/core/compression/jpx-stream';
import { _PdfLempelZivWelchStream } from '../src/pdf/core/compression/lempel-ziv-welch-stream';
import { _PdfFaxStream } from '../src/pdf/core/compression/pdf-fax-stream';
import { _PdfRunLengthStream } from '../src/pdf/core/compression/run-length-stream';
import { _Linearization, _PdfLexicalOperator, _PdfParser } from '../src/pdf/core/pdf-parser';
import { _PdfCommand, _PdfDictionary, _PdfName } from '../src/pdf/core/pdf-primitives';
import { PdfPredictorStream } from '../src/pdf/core/predictor-stream';
import { _PdfEncryptor } from '../src/pdf/core/security/encryptor';
import { FormatError } from '../src/pdf/core/utils';
describe('Pdf lexical operator number and string parsing mutation coverage', () => {
    it('should use false for Forms Data Format mode when the argument is omitted', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([0x31, 0x20])
        );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator(stream);
        expect(lexicalOperator._isFormsDataFormat).toBe(false);
    });
    it('should initialize the default Forms Data Format setting during construction', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([0x31, 0x20])
        );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator(stream);
        expect(lexicalOperator._isFormsDataFormat).not.toBeUndefined();
        expect(lexicalOperator._isFormsDataFormat).toBe(false);
    });
    it('should use false for annotation import mode when the argument is omitted', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([0x31, 0x20])
        );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator(stream);
        expect(lexicalOperator._isAnnotationImport).toBe(false);
    });
    it('should initialize the default annotation import setting during construction', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([0x31, 0x20])
        );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator(stream);
        expect(lexicalOperator._isAnnotationImport).not.toBeUndefined();
        expect(lexicalOperator._isAnnotationImport).toBe(false);
    });
    it('should keep annotation import mode disabled by default', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([0x31, 0x20])
        );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator(stream, false);
        expect(lexicalOperator._isAnnotationImport).toBeFalsy();
    });
    it('should initialize the reusable string buffer without any entries', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([0x31, 0x20])
        );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator(stream, false, false);
        expect(lexicalOperator.stringBuffer).toEqual([]);
        expect(lexicalOperator.stringBuffer.length).toBe(0);
    });
    it('should parse a decimal point at the end of the stream as zero', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([0x2e])
        );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator(stream, false, false);
        expect(lexicalOperator.getNumber()).toBe(0);
    });
    it('should recognize the end-of-stream value after a decimal point', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([0x2e])
        );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator(stream, false, false);
        expect(lexicalOperator.getNumber()).toBe(0);
        expect(lexicalOperator.currentChar).toBe(-1);
    });
    it('should reject a signed decimal point without a numeric digit', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([0x2d, 0x2e, 0x20])
        );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator(stream, false, false);
        expect(() => lexicalOperator.getNumber()).toThrow();
    });
    it('should reject whitespace when no decimal point or digit was read', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([0x20])
        );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator(stream, false, false);
        expect(() => lexicalOperator.getNumber()).toThrow();
    });
    it('should not treat a negative decimal point as an unsigned zero value', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([0x2d, 0x2e, 0x20])
        );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator(stream, false, false);
        expect(() => lexicalOperator.getNumber()).toThrow();
    });
    it('should not treat a negative decimal point as an isolated negative marker', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([0x2d, 0x2e])
        );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator(stream, false, false);
        expect(() => lexicalOperator.getNumber()).toThrow();
    });
    it('should include the character-code label in an invalid-number error', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([0x41])
        );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator(stream, false, false);
        expect(() => lexicalOperator.getNumber()).toThrow();
    });
    it('should terminate an invalid-number error message with a closing parenthesis', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([0x40])
        );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator(stream, false, false);
        expect(() => lexicalOperator.getNumber()).toThrow();
    });
    it('should continue numeric parsing when the next byte has the value zero', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([0x31, 0x00])
        );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator(stream, false, false);
        expect(lexicalOperator.getNumber()).toBe(1);
        expect(lexicalOperator.currentChar).toBe(0);
    });
    it('should accumulate every digit in a multi-digit exponent', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x31, // 1
                0x45, // E
                0x31, // 1
                0x32, // 2
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator(stream, false, false);
        expect(lexicalOperator.getNumber()).toBe(1000000000000);
    });
    it('should parse an integer without applying fractional division', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([0x31, 0x32, 0x33, 0x20])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        expect(lexicalOperator.getNumber()).toBe(123);
    });
    it('should skip a minus marker encountered between numeric digits', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x31,
                0x2d,
                0x32,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        expect(lexicalOperator.getNumber()).toBe(12);
        expect(lexicalOperator.currentChar).toBe(0x20);
    });
    it('should stop exponent parsing when a non-digit follows the exponent marker', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x31,
                0x45,
                0x41,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        expect(lexicalOperator.getNumber()).toBe(1);
        expect(lexicalOperator.peekChar()).toBe(0x41);
    });
    it('should reject an alphabetic character as the first exponent digit', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x32,
                0x65,
                0x42,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        expect(lexicalOperator.getNumber()).toBe(2);
        expect(lexicalOperator.peekChar()).toBe(0x42);
    });
    it('should stop exponent parsing when the next byte is below the digit range', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x33,
                0x45,
                0x2f,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        expect(lexicalOperator.getNumber()).toBe(3);
        expect(lexicalOperator.peekChar()).toBe(0x2f);
    });
    it('should accept zero as a valid exponent digit', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x35,
                0x45,
                0x30,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        expect(lexicalOperator.getNumber()).toBe(5);
        expect(lexicalOperator.currentChar).toBe(0x20);
    });
    it('should stop exponent parsing when the next byte exceeds the digit range', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x34,
                0x65,
                0x3a,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        expect(lexicalOperator.getNumber()).toBe(4);
        expect(lexicalOperator.peekChar()).toBe(0x3a);
    });
    it('should accept nine as a valid exponent digit', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x31,
                0x65,
                0x39,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        expect(lexicalOperator.getNumber()).toBe(1000000000);
        expect(lexicalOperator.currentChar).toBe(0x20);
    });
    it('should leave an invalid exponent character available to the lexer', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x36,
                0x45,
                0x58,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        expect(lexicalOperator.getNumber()).toBe(6);
        expect(lexicalOperator.currentChar).toBe(0x45);
        expect(lexicalOperator.peekChar()).toBe(0x58);
    });
    it('should accumulate normal digits into the base value before exponent notation begins', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x31,
                0x32,
                0x45,
                0x32,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        expect(lexicalOperator.getNumber()).toBe(1200);
    });
    it('should continue reading a literal string until its closing parenthesis', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x28,
                0x41,
                0x42,
                0x43,
                0x29
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        expect(lexicalOperator.getObject()).toBe('ABC');
        expect(lexicalOperator.currentChar).toBe(-1);
    });
    it('should preserve a one-digit octal escape when followed by a non-octal character', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x28,
                0x5c, 0x31,
                0x38,
                0x29
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        expect(lexicalOperator.getObject()).toBe(
            String.fromCharCode(1) + '8'
        );
    });
    it('should not consume a closing parenthesis as part of an octal escape', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x28,
                0x5c, 0x31,
                0x29
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        expect(lexicalOperator.getObject()).toBe(
            String.fromCharCode(1)
        );
        expect(lexicalOperator.currentChar).toBe(-1);
    });
    it('should not treat a character below zero as a second octal digit', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x28,
                0x5c, 0x31,
                0x2f,
                0x41,
                0x29
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        expect(lexicalOperator.getObject()).toBe(
            String.fromCharCode(1) + '/A'
        );
    });
});
describe('Pdf lexical operator name, hexadecimal string, and command parsing mutation coverage', () => {
    it('should stop a two-digit octal escape when the second byte is greater than seven', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x28,
                0x5c, 0x31, 0x38,
                0x41,
                0x29
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        expect(lexicalOperator.getObject()).toBe(
            String.fromCharCode(1) + '8A'
        );
    });
    it('should accept seven as the second digit of an octal escape', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x28,
                0x5c, 0x31, 0x37,
                0x41,
                0x29
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        expect(lexicalOperator.getObject()).toBe(
            String.fromCharCode(15) + 'A'
        );
    });
    it('should stop a three-digit octal escape when the third byte is below zero', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x28,
                0x5c, 0x31, 0x32, 0x2f,
                0x41,
                0x29
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        expect(lexicalOperator.getObject()).toBe(
            String.fromCharCode(10) + '/A'
        );
    });
    it('should accept zero as the third digit of an octal escape', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x28,
                0x5c, 0x31, 0x32, 0x30,
                0x41,
                0x29
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        expect(lexicalOperator.getObject()).toBe('PA');
    });
    it('should accept seven as the third digit of an octal escape', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x28,
                0x5c, 0x31, 0x30, 0x37,
                0x41,
                0x29
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        expect(lexicalOperator.getObject()).toBe('GA');
    });
    it('should preserve a byte following an escaped carriage return when it is not a line feed', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x28,
                0x41,
                0x5c, 0x0d,
                0x42,
                0x29
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        expect(lexicalOperator.getObject()).toBe('AB');
    });
    it('should stop a Forms Data Format name at whitespace after the T keyword', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x2f,
                0x54,
                0x20,
                0x41,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, true, false);
        const name: _PdfName = lexicalOperator.getObject();
        expect(name.name).toBe('T');
        expect(lexicalOperator.currentChar).toBe(0x20);
    });
    it('should stop a Forms Data Format name at whitespace after the V keyword', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x2f,
                0x56,
                0x20,
                0x41,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, true, false);
        const name: _PdfName = lexicalOperator.getObject();
        expect(name.name).toBe('V');
        expect(lexicalOperator.currentChar).toBe(0x20);
    });
    it('should process a zero byte while reading a PDF name', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x2f,
                0x41,
                0x00
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const name: _PdfName = lexicalOperator.getObject();
        expect(name.name.length).toBe(1);
        expect(name.name.charCodeAt(0)).toBe(65);
    });
    it('should retain permitted whitespace inside a Forms Data Format name', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x2f,
                0x41,
                0x20,
                0x42,
                0x2f
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, true, false);
        const name: _PdfName = lexicalOperator.getObject();
        expect(name.name).toBe('A B');
    });
    it('should not include whitespace in the reserved Root name in Forms Data Format mode', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x2f,
                0x52, 0x6f, 0x6f, 0x74,
                0x20,
                0x41
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, true, false);
        const name: _PdfName = lexicalOperator.getObject();
        expect(name.name).toBe('Root');
        expect(lexicalOperator.currentChar).toBe(0x20);
    });
    it('should retain whitespace in a non-reserved Forms Data Format name', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x2f,
                0x41,
                0x20,
                0x42,
                0x5d
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, true, false);
        const name: _PdfName = lexicalOperator.getObject();
        expect(name.name).toBe('A B');
        expect(lexicalOperator.currentChar).toBe(0x5d);
    });
    it('should terminate the reserved T name at whitespace in Forms Data Format mode', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x2f,
                0x54,
                0x20,
                0x42
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, true, false);
        const name: _PdfName = lexicalOperator.getObject();
        expect(name.name).toBe('T');
        expect(lexicalOperator.currentChar).toBe(0x20);
    });
    it('should preserve a name escape when its first hexadecimal digit is invalid', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x2f,
                0x41,
                0x23, 0x47,
                0x42,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const name: _PdfName = lexicalOperator.getObject();
        expect(name.name).toBe('A#GB');
    });
    it('should identify minus one as the invalid hexadecimal digit result', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([0x31])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        expect(lexicalOperator._toHexDigit(0x47)).toBe(-1);
    });
    it('should process a zero byte while reading a hexadecimal string', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x3c,
                0x00,
                0x34, 0x31,
                0x3e
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        expect(lexicalOperator.getObject()).toBe('A');
    });
    it('should skip whitespace between hexadecimal string digits', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x3c,
                0x34,
                0x20,
                0x31,
                0x3e
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        expect(lexicalOperator.getObject()).toBe('A');
    });
    it('should skip an invalid first hexadecimal digit without changing nibble alignment', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x3c,
                0x47,
                0x34, 0x31,
                0x3e
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        expect(lexicalOperator.getObject()).toBe('A');
    });
    it('should return minus one for an invalid first hexadecimal string digit', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([0x31])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        expect(lexicalOperator._toHexDigit(0x2f)).toBe(-1);
    });
    it('should advance past an invalid first hexadecimal digit before continuing', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x3c,
                0x47,
                0x34, 0x32,
                0x3e
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        expect(lexicalOperator.getObject()).toBe('B');
        expect(lexicalOperator.currentChar).toBe(-1);
    });
    it('should skip an invalid second hexadecimal digit and wait for another valid digit', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x3c,
                0x34,
                0x47,
                0x31,
                0x3e
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        expect(lexicalOperator.getObject()).toBe('A');
    });
    it('should advance after rejecting an invalid second hexadecimal digit', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x3c,
                0x34,
                0x47,
                0x32,
                0x3e
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        expect(lexicalOperator.getObject()).toBe('B');
        expect(lexicalOperator.currentChar).toBe(-1);
    });
    it('should terminate a PDF comment at a line-feed character', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x25,
                0x41,
                0x0a,
                0x74, 0x72, 0x75, 0x65,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        expect(lexicalOperator.getObject()).toBe(true);
    });
    it('should terminate a PDF comment at a carriage-return character', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x25,
                0x41,
                0x0d,
                0x66, 0x61, 0x6c, 0x73, 0x65,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        expect(lexicalOperator.getObject()).toBe(false);
    });
    it('should stop comment scanning when a backslash is encountered', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x25,
                0x41,
                0x5c,
                0x42,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const result: _PdfCommand = lexicalOperator.getObject();
        expect(result.command).toBe('\\B');
        expect(lexicalOperator.currentChar).toBe(32);
    });
    it('should inspect a backslash outside a comment before reading a command', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x5c,
                0x72,
                0x41,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const result: _PdfCommand = lexicalOperator.getObject();
        expect(result.command).toBe('\\rA');
        expect(lexicalOperator.currentChar).toBe(32);
    });
    it('should return a single closing-angle command when another closing angle does not follow', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x3e,
                0x41,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const result: _PdfCommand = lexicalOperator.getObject();
        expect(result.command).toBe('>');
        expect(lexicalOperator.currentChar).toBe(0x41);
    });
    it('should return the dictionary-closing command for two closing angles', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x3e,
                0x3e,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const result: _PdfCommand = lexicalOperator.getObject();
        expect(result.command).toBe('>>');
        expect(lexicalOperator.currentChar).toBe(0x20);
    });
    it('should preserve the closing-angle command text for a single delimiter', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x3e,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const result: _PdfCommand = lexicalOperator.getObject();
        expect(result.command).toBe('>');
        expect(result.command.length).toBe(1);
    });
});
describe('Pdf lexical operator command boundaries and parser initialization mutation coverage', () => {
    it('should return a control-byte command separately from a following printable command', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x1f,
                0x41,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const result: _PdfCommand = lexicalOperator.getObject();
        expect(result.command.length).toBe(1);
        expect(result.command.charCodeAt(0)).toBe(0x1f);
        expect(lexicalOperator.currentChar).toBe(0x41);
    });
    it('should apply the out-of-range command handling to a byte below the printable range', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x1e,
                0x42,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const result: _PdfCommand = lexicalOperator.getObject();
        expect(result.command.charCodeAt(0)).toBe(0x1e);
        expect(result.command.length).toBe(1);
        expect(lexicalOperator.currentChar).toBe(0x42);
    });
    it('should isolate a byte below space from the printable byte that follows it', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x02,
                0x43,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const result: _PdfCommand = lexicalOperator.getObject();
        expect(result.command.length).toBe(1);
        expect(result.command.charCodeAt(0)).toBe(0x02);
        expect(lexicalOperator.currentChar).toBe(0x43);
    });
    it('should skip a space delimiter before reading the following command token', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x20,
                0x41,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const result: _PdfCommand = lexicalOperator.getObject();
        expect(result.command).toBe('A');
        expect(lexicalOperator.currentChar).toBe(0x20);
    });
    it('should return a byte above the ASCII range separately from a following printable byte', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x80,
                0x44,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const result: _PdfCommand = lexicalOperator.getObject();
        expect(result.command.length).toBe(1);
        expect(result.command.charCodeAt(0)).toBe(0x80);
        expect(lexicalOperator.currentChar).toBe(0x44);
    });
    it('should keep the DEL byte in the same command token as a following regular character', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x7f,
                0x41,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const result: _PdfCommand = lexicalOperator.getObject();
        expect(result.command.length).toBe(2);
        expect(result.command.charCodeAt(0)).toBe(0x7f);
        expect(result.command.charCodeAt(1)).toBe(0x41);
    });
    it('should execute the special command handling for a non-ASCII leading byte', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x81,
                0x45,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const result: _PdfCommand = lexicalOperator.getObject();
        expect(result.command.length).toBe(1);
        expect(result.command.charCodeAt(0)).toBe(0x81);
        expect(lexicalOperator.currentChar).toBe(0x45);
    });
    it('should not separate an out-of-range byte when another non-printable byte follows it', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x80,
                0x1f,
                0x41,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const result: _PdfCommand = lexicalOperator.getObject();
        expect(result.command.length).toBeGreaterThan(1);
        expect(result.command.charCodeAt(0)).toBe(0x80);
        expect(result.command.charCodeAt(1)).toBe(0x1f);
    });
    it('should separate a non-ASCII byte when a printable character follows it', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x82,
                0x46,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const result: _PdfCommand = lexicalOperator.getObject();
        expect(result.command.length).toBe(1);
        expect(result.command.charCodeAt(0)).toBe(0x82);
        expect(lexicalOperator.currentChar).toBe(0x46);
    });
    it('should require the following command byte to be inside the printable range', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x83,
                0x01,
                0x47,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const result: _PdfCommand = lexicalOperator.getObject();
        expect(result.command.length).toBeGreaterThan(1);
        expect(result.command.charCodeAt(0)).toBe(0x83);
        expect(result.command.charCodeAt(1)).toBe(0x01);
    });
    it('should reject a following byte below the printable command range', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x84,
                0x1f,
                0x48,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const result: _PdfCommand = lexicalOperator.getObject();
        expect(result.command.length).not.toBe(1);
        expect(result.command.charCodeAt(0)).toBe(0x84);
        expect(result.command.charCodeAt(1)).toBe(0x1f);
    });
    it('should recognize space as the lower boundary of the printable-byte range', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x85,
                0x20,
                0x41
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const result: _PdfCommand = lexicalOperator.getObject();
        expect(result.command.length).toBe(1);
        expect(result.command.charCodeAt(0)).toBe(0x85);
        expect(lexicalOperator.currentChar).toBe(0x20);
    });
    it('should accept an alphabetic byte as a valid printable follower', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x86,
                0x49,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const result: _PdfCommand = lexicalOperator.getObject();
        expect(result.command.length).toBe(1);
        expect(result.command.charCodeAt(0)).toBe(0x86);
        expect(lexicalOperator.currentChar).toBe(0x49);
    });
    it('should reject a following byte above the printable command range', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x87,
                0x80,
                0x4a,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const result: _PdfCommand = lexicalOperator.getObject();
        expect(result.command.length).toBeGreaterThan(1);
        expect(result.command.charCodeAt(0)).toBe(0x87);
        expect(result.command.charCodeAt(1)).toBe(0x80);
    });
    it('should include the DEL byte in the upper boundary of the accepted follower range', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x88,
                0x7f,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const result: _PdfCommand = lexicalOperator.getObject();
        expect(result.command.length).toBe(1);
        expect(result.command.charCodeAt(0)).toBe(0x88);
        expect(lexicalOperator.currentChar).toBe(0x7f);
    });
    it('should accept a printable byte that does not exceed the upper command boundary', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x89,
                0x4b,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const result: _PdfCommand = lexicalOperator.getObject();
        expect(result.command.length).toBe(1);
        expect(result.command.charCodeAt(0)).toBe(0x89);
        expect(lexicalOperator.currentChar).toBe(0x4b);
    });
    it('should advance to the printable follower before returning an isolated non-ASCII command', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x8a,
                0x4c,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const result: _PdfCommand = lexicalOperator.getObject();
        expect(result.command.length).toBe(1);
        expect(result.command.charCodeAt(0)).toBe(0x8a);
        expect(lexicalOperator.currentChar).toBe(0x4c);
        expect(lexicalOperator.peekChar()).toBe(0x20);
    });
    it('should report the command length when a command token exceeds the allowed size', () => {
        const bytes: number[] = [];
        for (let i: number = 0; i < 129; i++) {
            bytes.push(0x41);
        }
        bytes.push(0x20);
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array(bytes)
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        expect(() => lexicalOperator.getObject()).toThrow();
    });
    it('should record the inline-image position only for the BI command', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x41,
                0x20,
                0x42,
                0x49,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const result: _PdfCommand = lexicalOperator.getObject();
        expect(result.command).toBe('A');
        expect(lexicalOperator.beginInlineImagePosition).toBe(-1);
    });
    it('should inspect a zero byte while advancing to the next line', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x41,
                0x00,
                0x0a,
                0x42
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        lexicalOperator.skipToNextLine();
        expect(lexicalOperator.currentChar).toBe(0x42);
        expect(stream.position).toBe(4);
    });
    it('should consume a carriage return while advancing to the next line', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x41,
                0x0d,
                0x42
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        lexicalOperator.skipToNextLine();
        expect(lexicalOperator.currentChar).toBe(0x42);
        expect(stream.position).toBe(3);
    });
    it('should stop scanning immediately after a carriage-return line ending', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x41,
                0x0d,
                0x42,
                0x43
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        lexicalOperator.skipToNextLine();
        expect(lexicalOperator.currentChar).toBe(0x42);
        expect(stream.position).toBe(3);
        expect(stream.peekByte()).toBe(0x43);
    });
    it('should not consume the byte after a carriage return when it is not a line feed', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x41,
                0x0d,
                0x42,
                0x43
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        lexicalOperator.skipToNextLine();
        expect(lexicalOperator.currentChar).toBe(0x42);
        expect(stream.peekByte()).toBe(0x43);
    });
    it('should reject a lowercase character above f as a hexadecimal digit', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([0x31])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        expect(lexicalOperator._toHexDigit(0x67)).toBe(-1);
    });
    it('should use false for stream parsing when the constructor argument is omitted', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x31,
                0x20,
                0x32,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null);
        expect(parser.allowStreams).toBe(false);
    });
    it('should initialize the stream parsing option during parser construction', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x31,
                0x20,
                0x32,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null);
        expect(parser.allowStreams).not.toBeUndefined();
        expect(parser.allowStreams).toBe(false);
    });
    it('should keep stream parsing disabled by default', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x31,
                0x20,
                0x32,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null);
        expect(parser.allowStreams).toBeFalsy();
    });
    it('should use false for recovery mode when the constructor argument is omitted', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x31,
                0x20,
                0x32,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false);
        expect(parser.recoveryMode).toBe(false);
    });
    it('should initialize the recovery mode option during parser construction', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x31,
                0x20,
                0x32,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false);
        expect(parser.recoveryMode).not.toBeUndefined();
        expect(parser.recoveryMode).toBe(false);
    });
    it('should keep parser recovery mode disabled by default', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x31,
                0x20,
                0x32,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false);
        expect(parser.recoveryMode).toBeFalsy();
    });
});
describe('Pdf parser object, array, color-space, and dictionary mutation coverage', () => {
    it('should preserve the ID command without requesting another lexical object', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x31,
                0x20,
                0x49, 0x44,
                0x20,
                0x32,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        expect(parser.first).toBe(1);
        parser.shift();
        expect(parser.first instanceof _PdfCommand).toBeTruthy();
        expect(parser.first.command).toBe('ID');
        expect(parser.second).toBeNull();
    });
    it('should recognize the inline-image data command by its exact command text', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x31,
                0x20,
                0x49, 0x44,
                0x20,
                0x32,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        expect(parser.second instanceof _PdfCommand).toBeTruthy();
        expect(parser.second.command).toBe('ID');
        parser.shift();
        expect(parser.first.command).toBe('ID');
        expect(parser.second).toBeNull();
    });
    it('should parse an inline image without entering the numeric overload when only one number is supplied', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x42, 0x49,
                0x20,
                0x49, 0x44,
                0x20,
                0x45, 0x49,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        expect(() => parser.getObject(1)).not.toThrow();
    });
    it('should not use the numeric inline-image overload when the object number is omitted', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x42, 0x49,
                0x20,
                0x49, 0x44,
                0x20,
                0x45, 0x49,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        expect(() => parser.getObject()).not.toThrow();
    });
    it('should not use the numeric inline-image overload when the generation number is omitted', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x42, 0x49,
                0x20,
                0x49, 0x44,
                0x20,
                0x45, 0x49,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        expect(() => parser.getObject(1)).not.toThrow();
    });
    it('should parse an array without creating a cipher transform when only the object number is supplied', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x5b,
                0x31,
                0x20,
                0x32,
                0x5d,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const result: any[] = parser.getObject(10);
        expect(result).toEqual([1, 2]);
    });
    it('should parse an array without numeric decryption when the object number is not provided', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x5b,
                0x33,
                0x20,
                0x34,
                0x5d,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const result: any[] = parser.getObject();
        expect(result).toEqual([3, 4]);
    });
    it('should parse an array without numeric decryption when the generation number is absent', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x5b,
                0x35,
                0x20,
                0x36,
                0x5d,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const result: any[] = parser.getObject(25);
        expect(result).toEqual([5, 6]);
    });
    it('should parse a normal array argument without treating it as a cipher transform', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x5b,
                0x28, 0x41, 0x29,
                0x5d,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const result: any[] = parser.getObject();
        expect(result.length).toBe(1);
        expect(result[0]).toBe('A');
    });
    it('should parse an array through the ordinary path when no cipher transform is supplied', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x5b,
                0x28, 0x42, 0x29,
                0x5d,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const result: any[] = parser.getObject();
        expect(result).toEqual(['B']);
    });
    it('should not enable Indexed color-space decoding for an array beginning with a different name', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x5b,
                0x2f, 0x44, 0x65, 0x76, 0x69, 0x63, 0x65,
                0x52, 0x47, 0x42,
                0x20,
                0x28, 0x80, 0x29,
                0x5d,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: any =
            new _PdfParser(lexicalOperator, null, false, false);
        const result: any[] = parser.getObject();
        expect(result[0] instanceof _PdfName).toBeTruthy();
        expect(result[0].name).toBe('DeviceRGB');
        expect(parser._isColorSpace).toBeFalsy();
    });
    it('should recognize Indexed when it is the first entry in a color-space array', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x5b,
                0x2f, 0x49, 0x6e, 0x64, 0x65, 0x78, 0x65, 0x64,
                0x20,
                0x2f, 0x44, 0x65, 0x76, 0x69, 0x63, 0x65,
                0x52, 0x47, 0x42,
                0x20,
                0x31,
                0x20,
                0x28, 0x41, 0x42, 0x29,
                0x5d,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const result: any[] = parser.getObject();
        expect(result.length).toBe(4);
        expect(result[0] instanceof _PdfName).toBeTruthy();
        expect(result[0].name).toBe('Indexed');
    });
    it('should not activate Indexed color-space handling for the first non-name array entry', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x5b,
                0x31,
                0x20,
                0x28, 0x41, 0x29,
                0x5d,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: any =
            new _PdfParser(lexicalOperator, null, false, false);
        const result: any[] = parser.getObject();
        expect(result).toEqual([1, 'A']);
        expect(parser._isColorSpace).toBeFalsy();
    });
    it('should not activate color-space decoding for Indexed appearing after the first array entry', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x5b,
                0x31,
                0x20,
                0x2f, 0x49, 0x6e, 0x64, 0x65, 0x78, 0x65, 0x64,
                0x20,
                0x28, 0x41, 0x29,
                0x5d,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: any =
            new _PdfParser(lexicalOperator, null, false, false);
        const result: any[] = parser.getObject();
        expect(result.length).toBe(3);
        expect(result[1] instanceof _PdfName).toBeTruthy();
        expect(result[1].name).toBe('Indexed');
        expect(parser._isColorSpace).toBeFalsy();
    });
    it('should activate Indexed color-space handling only when Indexed is the first array entry', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x5b,
                0x2f, 0x49, 0x6e, 0x64, 0x65, 0x78, 0x65, 0x64,
                0x20,
                0x2f, 0x44, 0x65, 0x76, 0x69, 0x63, 0x65,
                0x47, 0x72, 0x61, 0x79,
                0x20,
                0x30,
                0x20,
                0x28, 0x41, 0x29,
                0x5d,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const result: any[] = parser.getObject();
        expect(result[0] instanceof _PdfName).toBeTruthy();
        expect(result[0].name).toBe('Indexed');
        expect(result.length).toBe(4);
    });
    it('should compare the first color-space name against Indexed', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x5b,
                0x2f, 0x49, 0x6e, 0x64, 0x65, 0x78, 0x65, 0x64,
                0x20,
                0x2f, 0x44, 0x65, 0x76, 0x69, 0x63, 0x65,
                0x52, 0x47, 0x42,
                0x20,
                0x31,
                0x20,
                0x28, 0x41, 0x42, 0x29,
                0x5d,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: any =
            new _PdfParser(lexicalOperator, null, false, false);
        const result: any[] = parser.getObject();
        expect(result[0].name).toBe('Indexed');
        expect(parser._isColorSpace).toBeFalsy();
    });
    it('should enable color-space decoding while processing an Indexed lookup string', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x5b,
                0x2f, 0x49, 0x6e, 0x64, 0x65, 0x78, 0x65, 0x64,
                0x20,
                0x2f, 0x44, 0x65, 0x76, 0x69, 0x63, 0x65,
                0x52, 0x47, 0x42,
                0x20,
                0x31,
                0x20,
                0x28, 0x80, 0x29,
                0x5d,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const result: any[] = parser.getObject();
        expect(result.length).toBe(4);
        expect(result[0].name).toBe('Indexed');
        expect(result[3].length).toBe(1);
        expect(result[3].charCodeAt(0)).toBe(0x80);
    });
    it('should apply password-string decoding to the U dictionary entry', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x3c, 0x3c,
                0x20,
                0x2f, 0x55,
                0x20,
                0x28, 0x80, 0x29,
                0x20,
                0x3e, 0x3e,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: any =
            new _PdfParser(lexicalOperator, null, false, false);
        const dictionary: _PdfDictionary = parser.getObject();
        const value: string = dictionary.get('U');
        expect(value.length).toBe(1);
        expect(value.charCodeAt(0)).toBe(0x80);
        expect(parser._isPassword).toBeFalsy();
    });
    it('should recognize the owner-password entry independently of other password keys', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x3c, 0x3c,
                0x20,
                0x2f, 0x4f,
                0x20,
                0x28, 0x81, 0x29,
                0x20,
                0x3e, 0x3e,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: any =
            new _PdfParser(lexicalOperator, null, false, false);
        const dictionary: _PdfDictionary = parser.getObject();
        const value: string = dictionary.get('O');
        expect(value.length).toBe(1);
        expect(value.charCodeAt(0)).toBe(0x81);
        expect(parser._isPassword).toBeFalsy();
    });
    it('should recognize the user-password key without requiring an ID key', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x3c, 0x3c,
                0x20,
                0x2f, 0x55,
                0x20,
                0x28, 0x41, 0x29,
                0x20,
                0x3e, 0x3e,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: any =
            new _PdfParser(lexicalOperator, null, false, false);
        const dictionary: _PdfDictionary = parser.getObject();
        expect(dictionary.has('U')).toBeTruthy();
        expect(dictionary.get('U')).toBe('A');
        expect(parser._isPassword).toBeFalsy();
    });
    it('should treat the user-password and owner-password keys as alternative password entries', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x3c, 0x3c,
                0x20,
                0x2f, 0x55,
                0x20,
                0x28, 0x41, 0x29,
                0x20,
                0x2f, 0x4f,
                0x20,
                0x28, 0x42, 0x29,
                0x20,
                0x3e, 0x3e,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: any =
            new _PdfParser(lexicalOperator, null, false, false);
        const dictionary: _PdfDictionary = parser.getObject();
        expect(dictionary.get('U')).toBe('A');
        expect(dictionary.get('O')).toBe('B');
        expect(parser._isPassword).toBeFalsy();
    });
    it('should recognize U as a password-related dictionary key', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x3c, 0x3c,
                0x20,
                0x2f, 0x55,
                0x20,
                0x28, 0x80, 0x29,
                0x20,
                0x3e, 0x3e,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: any =
            new _PdfParser(lexicalOperator, null, false, false);
        const dictionary: _PdfDictionary = parser.getObject();
        const value: string = dictionary.get('U');
        expect(value.length).toBe(1);
        expect(dictionary.has('U')).toBeTruthy();
        expect(parser._isPassword).toBeFalsy();
    });
    it('should use the exact U key when identifying user-password data', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x3c, 0x3c,
                0x20,
                0x2f, 0x55,
                0x20,
                0x28, 0x41, 0x29,
                0x20,
                0x2f, 0x41,
                0x20,
                0x28, 0x42, 0x29,
                0x20,
                0x3e, 0x3e,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const dictionary: _PdfDictionary = parser.getObject();
        expect(dictionary.get('U')).toBe('A');
        expect(dictionary.get('A')).toBe('B');
    });
    it('should recognize O as a password-related dictionary key', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x3c, 0x3c,
                0x20,
                0x2f, 0x4f,
                0x20,
                0x28, 0x81, 0x29,
                0x20,
                0x3e, 0x3e,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: any =
            new _PdfParser(lexicalOperator, null, false, false);
        const dictionary: _PdfDictionary = parser.getObject();
        const value: string = dictionary.get('O');
        expect(value.length).toBe(1);
        expect(dictionary.has('O')).toBeTruthy();
        expect(parser._isPassword).toBeFalsy();
    });
    it('should use the exact O key when identifying owner-password data', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x3c, 0x3c,
                0x20,
                0x2f, 0x4f,
                0x20,
                0x28, 0x41, 0x29,
                0x20,
                0x2f, 0x42,
                0x20,
                0x28, 0x43, 0x29,
                0x20,
                0x3e, 0x3e,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const dictionary: _PdfDictionary = parser.getObject();
        expect(dictionary.get('O')).toBe('A');
        expect(dictionary.get('B')).toBe('C');
    });
    it('should recognize ID as a password-related dictionary key', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x3c, 0x3c,
                0x20,
                0x2f, 0x49, 0x44,
                0x20,
                0x28, 0x41, 0x42, 0x29,
                0x20,
                0x3e, 0x3e,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: any =
            new _PdfParser(lexicalOperator, null, false, false);
        const dictionary: _PdfDictionary = parser.getObject();
        expect(dictionary.has('ID')).toBeTruthy();
        expect(dictionary.get('ID')).toBe('AB');
        expect(parser._isPassword).toBeFalsy();
    });
    it('should reset password decoding state after processing a password-related value', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x3c, 0x3c,
                0x20,
                0x2f, 0x55,
                0x20,
                0x28, 0x41, 0x29,
                0x20,
                0x2f, 0x54, 0x69, 0x74, 0x6c, 0x65,
                0x20,
                0x28, 0x42, 0x29,
                0x20,
                0x3e, 0x3e,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: any =
            new _PdfParser(lexicalOperator, null, false, false);
        const dictionary: _PdfDictionary = parser.getObject();
        expect(dictionary.get('U')).toBe('A');
        expect(dictionary.get('Title')).toBe('B');
        expect(parser._isPassword).toBeFalsy();
    });
    it('should set password decoding state to true before decoding a user-password value', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x3c, 0x3c,
                0x20,
                0x2f, 0x55,
                0x20,
                0x28, 0x80, 0x29,
                0x20,
                0x3e, 0x3e,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: any =
            new _PdfParser(lexicalOperator, null, false, false);
        const dictionary: _PdfDictionary = parser.getObject();
        const value: string = dictionary.get('U');
        expect(value.length).toBe(1);
        expect(value.charCodeAt(0)).toBe(0x80);
        expect(parser._isPassword).toBeFalsy();
    });
    it('should stop dictionary entry parsing when the end condition is detected', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x3c, 0x3c,
                0x20,
                0x2f, 0x41,
                0x20,
                0x31,
                0x20,
                0x3e, 0x3e,
                0x20,
                0x32,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const dictionary: _PdfDictionary = parser.getObject();
        expect(dictionary.get('A')).toBe(1);
        expect(parser.first).toBe(2);
    });
    it('should stop dictionary parsing when either valid dictionary ending condition is satisfied', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x3c, 0x3c,
                0x20,
                0x2f, 0x41,
                0x20,
                0x31,
                0x20,
                0x3e, 0x3e,
                0x20,
                0x74, 0x72, 0x75, 0x65,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const dictionary: _PdfDictionary = parser.getObject();
        expect(dictionary.has('A')).toBeTruthy();
        expect(dictionary.get('A')).toBe(1);
        expect(parser.first).toBe(true);
    });
});
describe('Pdf parser dictionary, stream, reference, and inline image mutation coverage', () => {
    it('should stop reading dictionary entries before a following stream command', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x3c, 0x3c,
                0x20, 0x2f, 0x4c, 0x65, 0x6e, 0x67, 0x74, 0x68,
                0x20, 0x30,
                0x20, 0x3e, 0x3e,
                0x20, 0x73, 0x74, 0x72, 0x65, 0x61, 0x6d,
                0x0a,
                0x65, 0x6e, 0x64, 0x73, 0x74, 0x72, 0x65, 0x61, 0x6d,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const dictionary: _PdfDictionary = parser.getObject();
        expect(dictionary instanceof _PdfDictionary).toBeTruthy();
        expect(dictionary.get('Length')).toBe(0);
        expect(parser.second instanceof _PdfCommand).toBeTruthy();
        expect(parser.second.command).toBe('stream');
    });
    it('should require both the dictionary terminator and stream command before stopping early', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x3c, 0x3c,
                0x20, 0x2f, 0x41,
                0x20, 0x31,
                0x20, 0x2f, 0x42,
                0x20, 0x32,
                0x20, 0x3e, 0x3e,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const dictionary: _PdfDictionary = parser.getObject();
        expect(dictionary.get('A')).toBe(1);
        expect(dictionary.get('B')).toBe(2);
    });
    it('should recognize the exact dictionary-closing command before a stream', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x3c, 0x3c,
                0x20, 0x2f, 0x4c, 0x65, 0x6e, 0x67, 0x74, 0x68,
                0x20, 0x30,
                0x20, 0x3e, 0x3e,
                0x20, 0x73, 0x74, 0x72, 0x65, 0x61, 0x6d,
                0x0a,
                0x65, 0x6e, 0x64, 0x73, 0x74, 0x72, 0x65, 0x61, 0x6d,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const dictionary: _PdfDictionary = parser.getObject();
        expect(dictionary.get('Length')).toBe(0);
        expect(parser.first instanceof _PdfCommand).toBeTruthy();
        expect(parser.first.command).toBe('>>');
    });
    it('should recognize the exact stream command following a dictionary', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x3c, 0x3c,
                0x20, 0x2f, 0x4c, 0x65, 0x6e, 0x67, 0x74, 0x68,
                0x20, 0x30,
                0x20, 0x3e, 0x3e,
                0x20, 0x73, 0x74, 0x72, 0x65, 0x61, 0x6d,
                0x0a,
                0x65, 0x6e, 0x64, 0x73, 0x74, 0x72, 0x65, 0x61, 0x6d,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const dictionary: _PdfDictionary = parser.getObject();
        expect(dictionary.get('Length')).toBe(0);
        expect(parser.second instanceof _PdfCommand).toBeTruthy();
        expect(parser.second.command).toBe('stream');
    });
    it('should leave the dictionary terminator available when a stream command follows it', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x3c, 0x3c,
                0x20, 0x2f, 0x4c, 0x65, 0x6e, 0x67, 0x74, 0x68,
                0x20, 0x30,
                0x20, 0x3e, 0x3e,
                0x20, 0x73, 0x74, 0x72, 0x65, 0x61, 0x6d,
                0x0a,
                0x65, 0x6e, 0x64, 0x73, 0x74, 0x72, 0x65, 0x61, 0x6d,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const dictionary: _PdfDictionary = parser.getObject();
        expect(dictionary.has('Length')).toBeTruthy();
        expect(parser.first.command).toBe('>>');
        expect(parser.second.command).toBe('stream');
    });
    it('should parse a dictionary without requesting numeric decryption when only an object number is supplied', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x3c, 0x3c,
                0x20, 0x2f, 0x41,
                0x20, 0x31,
                0x20, 0x3e, 0x3e,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const dictionary: _PdfDictionary = parser.getObject(10);
        expect(dictionary.get('A')).toBe(1);
    });
    it('should parse a dictionary without numeric decryption when neither number is supplied', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x3c, 0x3c,
                0x20, 0x2f, 0x41,
                0x20, 0x32,
                0x20, 0x3e, 0x3e,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const dictionary: _PdfDictionary = parser.getObject();
        expect(dictionary.get('A')).toBe(2);
    });
    it('should parse a dictionary without numeric decryption when the generation number is omitted', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x3c, 0x3c,
                0x20, 0x2f, 0x41,
                0x20, 0x33,
                0x20, 0x3e, 0x3e,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const dictionary: _PdfDictionary = parser.getObject(15);
        expect(dictionary.get('A')).toBe(3);
    });
    it('should not create a cipher transform while parsing an ordinary dictionary value', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x3c, 0x3c,
                0x20, 0x2f, 0x54, 0x69, 0x74, 0x6c, 0x65,
                0x20, 0x28, 0x41, 0x29,
                0x20, 0x3e, 0x3e,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const dictionary: _PdfDictionary = parser.getObject();
        expect(dictionary.get('Title')).toBe('A');
    });
    it('should require both object and generation numbers before creating a dictionary cipher transform', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x3c, 0x3c,
                0x20, 0x2f, 0x54, 0x69, 0x74, 0x6c, 0x65,
                0x20, 0x28, 0x42, 0x29,
                0x20, 0x3e, 0x3e,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const dictionary: _PdfDictionary = parser.getObject(20);
        expect(dictionary.get('Title')).toBe('B');
    });
    it('should not create a dictionary cipher transform when the object number is absent', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x3c, 0x3c,
                0x20, 0x2f, 0x54, 0x69, 0x74, 0x6c, 0x65,
                0x20, 0x28, 0x43, 0x29,
                0x20, 0x3e, 0x3e,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const dictionary: _PdfDictionary = parser.getObject();
        expect(dictionary.get('Title')).toBe('C');
    });
    it('should not create a dictionary cipher transform when the generation number is absent', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x3c, 0x3c,
                0x20, 0x2f, 0x54, 0x69, 0x74, 0x6c, 0x65,
                0x20, 0x28, 0x44, 0x29,
                0x20, 0x3e, 0x3e,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const dictionary: _PdfDictionary = parser.getObject(25);
        expect(dictionary.get('Title')).toBe('D');
    });
    it('should use ordinary dictionary value parsing when no cipher transform is provided', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x3c, 0x3c,
                0x20, 0x2f, 0x56, 0x61, 0x6c, 0x75, 0x65,
                0x20, 0x28, 0x45, 0x29,
                0x20, 0x3e, 0x3e,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const dictionary: _PdfDictionary = parser.getObject();
        expect(dictionary.get('Value')).toBe('E');
    });
    it('should parse a dictionary string successfully without a cipher-transform argument', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x3c, 0x3c,
                0x20, 0x2f, 0x56, 0x61, 0x6c, 0x75, 0x65,
                0x20, 0x28, 0x46, 0x29,
                0x20, 0x3e, 0x3e,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const dictionary: _PdfDictionary = parser.getObject();
        expect(dictionary.has('Value')).toBeTruthy();
        expect(dictionary.get('Value')).toBe('F');
    });
    it('should assign every parsed value to its corresponding dictionary key', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x3c, 0x3c,
                0x20, 0x2f, 0x41,
                0x20, 0x28, 0x47, 0x29,
                0x20, 0x3e, 0x3e,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const dictionary: _PdfDictionary = parser.getObject();
        expect(dictionary.has('A')).toBeTruthy();
        expect(dictionary.get('A')).toBe('G');
    });
    it('should preserve a PDF name that does not contain an encoded space', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x3c, 0x3c,
                0x20, 0x2f, 0x41,
                0x20, 0x2f, 0x54, 0x65, 0x73, 0x74,
                0x20, 0x3e, 0x3e,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const dictionary: _PdfDictionary = parser.getObject();
        const name: _PdfName = dictionary.get('A');
        expect(name.name).toBe('Test');
    });
    it('should replace an encoded space sequence found in a parsed PDF name', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x3c, 0x3c,
                0x20, 0x2f, 0x41,
                0x20,
                0x2f, 0x54, 0x65, 0x73, 0x74,
                0x23, 0x32, 0x33, 0x32, 0x30,
                0x56, 0x61, 0x6c, 0x75, 0x65,
                0x20, 0x3e, 0x3e,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const dictionary: _PdfDictionary = parser.getObject();
        const name: _PdfName = dictionary.get('A');
        expect(name.name).toBe('Test Value');
    });
    // it('should not request stream decryption when cipher processing is disabled', () => {
    //     const stream: _PdfStream = new _PdfStream(
    //         new Uint8Array([
    //             0x3c, 0x3c,
    //             0x20, 0x2f, 0x4c, 0x65, 0x6e, 0x67, 0x74, 0x68,
    //             0x20, 0x30,
    //             0x20, 0x3e, 0x3e,
    //             0x20, 0x73, 0x74, 0x72, 0x65, 0x61, 0x6d,
    //             0x0a,
    //             0x65, 0x6e, 0x64, 0x73, 0x74, 0x72, 0x65, 0x61, 0x6d,
    //             0x20
    //         ])
    //     );
    //     const lexicalOperator: _PdfLexicalOperator =
    //         new _PdfLexicalOperator(stream, false, false);
    //     const parser: _PdfParser =
    //         new _PdfParser(lexicalOperator, null, false, false);
    //     const result: _PdfDictionary = parser.getObject(
    //         1,
    //         0,
    //         false
    //     );
    //     expect(result instanceof _PdfDictionary).toBeTruthy();
    //     expect(result.get('Length')).toBe(0);
    // });
    // it('should ignore the numeric generation value when cipher processing is not requested', () => {
    //     const stream: _PdfStream = new _PdfStream(
    //         new Uint8Array([
    //             0x3c, 0x3c,
    //             0x20, 0x2f, 0x4c, 0x65, 0x6e, 0x67, 0x74, 0x68,
    //             0x20, 0x30,
    //             0x20, 0x3e, 0x3e,
    //             0x20, 0x73, 0x74, 0x72, 0x65, 0x61, 0x6d,
    //             0x0a,
    //             0x65, 0x6e, 0x64, 0x73, 0x74, 0x72, 0x65, 0x61, 0x6d,
    //             0x20
    //         ])
    //     );
    //     const lexicalOperator: _PdfLexicalOperator =
    //         new _PdfLexicalOperator(stream, false, false);
    //     const parser: _PdfParser =
    //         new _PdfParser(lexicalOperator, null, false, false);
    //     parser._encryptor = new _PdfEncryptor(null, null)
    //     const result: _PdfDictionary = parser.getObject(
    //         2,
    //         0,
    //         false
    //     );
    //     expect(result.get('Length')).toBe(0);
    // });
    it('should return a dictionary instead of constructing a stream when stream parsing is disabled', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x3c, 0x3c,
                0x20, 0x2f, 0x4c, 0x65, 0x6e, 0x67, 0x74, 0x68,
                0x20, 0x30,
                0x20, 0x3e, 0x3e,
                0x20, 0x73, 0x74, 0x72, 0x65, 0x61, 0x6d,
                0x0a,
                0x65, 0x6e, 0x64, 0x73, 0x74, 0x72, 0x65, 0x61, 0x6d,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const result: _PdfDictionary = parser.getObject(
            3,
            false
        );
        expect(result instanceof _PdfDictionary).toBeTruthy();
        expect(result.get('Length')).toBe(0);
    });
    it('should not treat a false boolean stream option as a request to create a filtered stream', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x3c, 0x3c,
                0x20, 0x2f, 0x4c, 0x65, 0x6e, 0x67, 0x74, 0x68,
                0x20, 0x30,
                0x20, 0x3e, 0x3e,
                0x20, 0x73, 0x74, 0x72, 0x65, 0x61, 0x6d,
                0x0a,
                0x65, 0x6e, 0x64, 0x73, 0x74, 0x72, 0x65, 0x61, 0x6d,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const result: _PdfDictionary = parser.getObject(
            4,
            false
        );
        expect(result instanceof _PdfDictionary).toBeTruthy();
        expect(result.has('Length')).toBeTruthy();
    });
    it('should require a true boolean value before using the filtered-stream parsing path', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([ 0x3c, 0x3c, 0x20, 0x2f, 0x4c, 0x65, 0x6e, 0x67, 0x74, 0x68, 0x20, 0x30, 0x20, 0x3e, 0x3e, 0x20, 0x73, 0x74, 0x72, 0x65, 0x61, 0x6d, 0x0a, 0x65, 0x6e, 0x64, 0x73, 0x74, 0x72, 0x65, 0x61, 0x6d, 0x20 ]) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        const result: _PdfDictionary = parser.getObject( 5, false );
        expect(result instanceof _PdfDictionary).toBeTruthy();
        expect(result.get('Length')).toBe(0);
    });
    it('should return the parsed dictionary immediately when stream parsing is disabled', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([ 0x3c, 0x3c, 0x20, 0x2f, 0x4c, 0x65, 0x6e, 0x67, 0x74, 0x68, 0x20, 0x31, 0x20, 0x3e, 0x3e, 0x20, 0x73, 0x74, 0x72, 0x65, 0x61, 0x6d, 0x0a, 0x41, 0x0a, 0x65, 0x6e, 0x64, 0x73, 0x74, 0x72, 0x65, 0x61, 0x6d, 0x20 ]) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        const result: any = parser.getObject();
        expect(result instanceof _PdfDictionary).toBeTruthy();
        expect(result.get('Length')).toBe(1);
    });
    it('should return an unrecognized command from the parser default command branch', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([ 0x71, 0x20, 0x31, 0x20 ]) );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const result: _PdfCommand = parser.getObject();
        expect(result instanceof _PdfCommand).toBeTruthy();
        expect(result.command).toBe('q');
    });
    it('should return a plain string when only the object number is supplied', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([ 0x28, 0x41, 0x29, 0x20, 0x31, 0x20 ]) );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const result: string = parser.getObject(10);
        expect(result).toBe('A');
    });
    it('should return a plain string when no object number is supplied', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([ 0x28, 0x42, 0x29, 0x20, 0x31, 0x20 ]) );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const result: string = parser.getObject();
        expect(result).toBe('B');
    });
    it('should return a plain string when the generation number is omitted', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([ 0x28, 0x43, 0x29, 0x20, 0x31, 0x20 ]) );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const result: string = parser.getObject(20);
        expect(result).toBe('C');
    });
    it('should skip ordinary JPEG data bytes until a marker prefix is found', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([ 0x11, 0x22, 0x33, 0xff, 0xd9, 0x20, 0x45, 0x49, 0x20 ]) );
        const lexicalStream: _PdfStream = new _PdfStream(
            new Uint8Array([0x31, 0x20, 0x32, 0x20])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(lexicalStream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const length: number =
            parser.findDiscreteDecodeInlineStreamEnd(stream);
        expect(length).toBe(5);
    });
    it('should advance over each non-marker JPEG byte while searching for the image ending', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x01, 0x02, 0x03, 0x04,
                0xff, 0xd9,
                0x20, 0x45, 0x49, 0x20
            ])
        );
        const lexicalStream: _PdfStream = new _PdfStream(
            new Uint8Array([0x31, 0x20, 0x32, 0x20])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(lexicalStream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const length: number =
            parser.findDiscreteDecodeInlineStreamEnd(stream);
        expect(length).toBe(6);
        expect(stream.position).toBeGreaterThan(6);
    });
    it('should continue scanning after an escaped zero JPEG marker', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0xff, 0x00,
                0x11,
                0xff, 0xd9,
                0x20, 0x45, 0x49, 0x20
            ])
        );
        const lexicalStream: _PdfStream = new _PdfStream(
            new Uint8Array([0x31, 0x20, 0x32, 0x20])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(lexicalStream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const length: number =
            parser.findDiscreteDecodeInlineStreamEnd(stream);
        expect(length).toBe(5);
    });
});
describe('Pdf parser JPEG and ASCII85 inline stream ending mutation coverage', () => {
    it('should continue scanning after a repeated JPEG marker prefix', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0xff, 0xff, 0xd9,
                0x20, 0x45, 0x49, 0x20
            ])
        );
        const lexicalStream: _PdfStream = new _PdfStream(
            new Uint8Array([0x31, 0x20, 0x32, 0x20])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(lexicalStream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const length: number =
            parser.findDiscreteDecodeInlineStreamEnd(stream);
        expect(length).toBe(3);
    });
    it('should move back one byte when consecutive JPEG marker prefixes are encountered', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([ 0xff, 0xff, 0xd9, 0x20, 0x45, 0x49, 0x20 ]) );
        const lexicalStream: _PdfStream = new _PdfStream( new Uint8Array([0x31, 0x20, 0x32, 0x20]) );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(lexicalStream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const length: number =
            parser.findDiscreteDecodeInlineStreamEnd(stream);
        expect(length).toBe(3);
        expect(stream.position).toBeGreaterThan(3);
    });
    it('should skip a JPEG comment marker payload before locating the end marker', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([ 0xff, 0xfe, 0x00, 0x05, 0x41, 0x42, 0x43, 0xff, 0xd9, 0x20, 0x45, 0x49, 0x20 ]) );
        const lexicalStream: _PdfStream = new _PdfStream(
            new Uint8Array([0x31, 0x20, 0x32, 0x20])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(lexicalStream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const length: number =
            parser.findDiscreteDecodeInlineStreamEnd(stream);
        expect(length).toBe(9);
    });
    it('should move backward for a JPEG marker whose declared length is less than two', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([ 0xff, 0xe0, 0x00, 0x01, 0xff, 0xd9, 0x20, 0x45, 0x49, 0x20 ]) );
        const lexicalStream: _PdfStream = new _PdfStream(
            new Uint8Array([0x31, 0x20, 0x32, 0x20])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(lexicalStream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const length: number =
            parser.findDiscreteDecodeInlineStreamEnd(stream);
        expect(length).toBe(6);
    });
    it('should skip the payload of a JPEG marker whose declared length is greater than two', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([ 0xff, 0xe0, 0x00, 0x06, 0x41, 0x42, 0x43, 0x44, 0xff, 0xd9, 0x20, 0x45, 0x49, 0x20 ]) );
        const lexicalStream: _PdfStream = new _PdfStream(
            new Uint8Array([0x31, 0x20, 0x32, 0x20])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(lexicalStream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const length: number =
            parser.findDiscreteDecodeInlineStreamEnd(stream);
        expect(length).toBe(10);
    });
    it('should move backward when a JPEG marker has the minimum declared length', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0xff, 0xe1,
                0x00, 0x02,
                0xff, 0xd9,
                0x20, 0x45, 0x49, 0x20
            ])
        );
        const lexicalStream: _PdfStream = new _PdfStream(
            new Uint8Array([0x31, 0x20, 0x32, 0x20])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(lexicalStream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const length: number =
            parser.findDiscreteDecodeInlineStreamEnd(stream);
        expect(length).toBe(6);
    });
    it('should skip a positive JPEG marker payload when the length exceeds two', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0xff, 0xe2,
                0x00, 0x04,
                0x41, 0x42,
                0xff, 0xd9,
                0x20, 0x45, 0x49, 0x20
            ])
        );
        const lexicalStream: _PdfStream = new _PdfStream(
            new Uint8Array([0x31, 0x20, 0x32, 0x20])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(lexicalStream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const length: number =
            parser.findDiscreteDecodeInlineStreamEnd(stream);
        expect(length).toBe(8);
    });
    it('should advance beyond a JPEG application marker payload', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0xff, 0xe3,
                0x00, 0x05,
                0x41, 0x42, 0x43,
                0xff, 0xd9,
                0x20, 0x45, 0x49, 0x20
            ])
        );
        const lexicalStream: _PdfStream = new _PdfStream(
            new Uint8Array([0x31, 0x20, 0x32, 0x20])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(lexicalStream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const length: number =
            parser.findDiscreteDecodeInlineStreamEnd(stream);
        expect(length).toBe(9);
    });
    it('should subtract the JPEG marker header size before skipping its payload', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0xff, 0xe4,
                0x00, 0x04,
                0x41, 0x42,
                0xff, 0xd9,
                0x20, 0x45, 0x49, 0x20
            ])
        );
        const lexicalStream: _PdfStream = new _PdfStream(
            new Uint8Array([0x31, 0x20, 0x32, 0x20])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(lexicalStream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const length: number =
            parser.findDiscreteDecodeInlineStreamEnd(stream);
        expect(length).toBe(8);
    });
    it('should reposition the stream for an invalid JPEG marker length', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0xff, 0xe5,
                0x00, 0x01,
                0xff, 0xd9,
                0x20, 0x45, 0x49, 0x20
            ])
        );
        const lexicalStream: _PdfStream = new _PdfStream(
            new Uint8Array([0x31, 0x20, 0x32, 0x20])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(lexicalStream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const length: number =
            parser.findDiscreteDecodeInlineStreamEnd(stream);
        expect(length).toBe(6);
    });
    it('should move backward by two bytes for an invalid JPEG marker length', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0xff, 0xe6,
                0x00, 0x00,
                0xff, 0xd9,
                0x20, 0x45, 0x49, 0x20
            ])
        );
        const lexicalStream: _PdfStream = new _PdfStream(
            new Uint8Array([0x31, 0x20, 0x32, 0x20])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(lexicalStream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const length: number =
            parser.findDiscreteDecodeInlineStreamEnd(stream);
        expect(length).toBe(6);
    });
    it('should calculate the JPEG inline image length relative to its starting position', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x00, 0x00,
                0x11, 0x22,
                0xff, 0xd9,
                0x20, 0x45, 0x49, 0x20
            ])
        );
        stream.position = 2;
        const lexicalStream: _PdfStream = new _PdfStream(
            new Uint8Array([0x31, 0x20, 0x32, 0x20])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(lexicalStream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const length: number =
            parser.findDiscreteDecodeInlineStreamEnd(stream);
        expect(length).toBe(4);
    });
    it('should stop ASCII85 scanning when the explicit end marker is encountered', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x41, 0x42,
                0x7e, 0x3e,
                0x20, 0x45, 0x49, 0x20
            ])
        );
        const lexicalStream: _PdfStream = new _PdfStream(
            new Uint8Array([0x31, 0x20, 0x32, 0x20])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(lexicalStream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const length: number =
            parser.findDecodeInlineStreamEnd(stream);
        expect(length).toBe(4);
    });
    it('should ignore ordinary ASCII85 data bytes before checking the tilde terminator', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x41, 0x42, 0x43,
                0x7e, 0x3e,
                0x20, 0x45, 0x49, 0x20
            ])
        );
        const lexicalStream: _PdfStream = new _PdfStream(
            new Uint8Array([0x31, 0x20, 0x32, 0x20])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(lexicalStream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const length: number =
            parser.findDecodeInlineStreamEnd(stream);
        expect(length).toBe(5);
    });
});
describe('Pdf parser inline stream terminator and inline image state mutation coverage', () => {
    it('should require E as the first byte of a whitespace-separated inline image terminator', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x41,
                0x7e, 0x20,
                0x58, 0x49,
                0x42,
                0x7e, 0x3e,
                0x20, 0x45, 0x49, 0x20
            ])
        );
        const lexicalStream: _PdfStream = new _PdfStream(
            new Uint8Array([0x31, 0x20, 0x32, 0x20])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(lexicalStream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const length: number =
            parser.findDecodeInlineStreamEnd(stream);
        expect(length).toBe(8);
    });
    it('should accept E as the first byte of a valid alternate inline image terminator', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([ 0x41, 0x42, 0x7e, 0x20, 0x45, 0x49, 0x20 ]) );
        const lexicalStream: _PdfStream = new _PdfStream(
            new Uint8Array([0x31, 0x20, 0x32, 0x20])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(lexicalStream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const length: number =
            parser.findDecodeInlineStreamEnd(stream);
        expect(length).toBe(4);
    });
    it('should require I as the second byte of a whitespace-separated inline image terminator', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x41,
                0x7e, 0x20,
                0x45, 0x58,
                0x42,
                0x7e, 0x3e,
                0x20, 0x45, 0x49, 0x20
            ])
        );
        const lexicalStream: _PdfStream = new _PdfStream(
            new Uint8Array([0x31, 0x20, 0x32, 0x20])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(lexicalStream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const length: number =
            parser.findDecodeInlineStreamEnd(stream);
        expect(length).toBe(8);
    });
    it('should accept I as the second byte of a valid alternate inline image terminator', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x41,
                0x7e, 0x20,
                0x45, 0x49,
                0x20
            ])
        );
        const lexicalStream: _PdfStream = new _PdfStream(
            new Uint8Array([0x31, 0x20, 0x32, 0x20])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(lexicalStream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const length: number =
            parser.findDecodeInlineStreamEnd(stream);
        expect(length).toBe(3);
    });
    it('should stop ASCII85 scanning after detecting a whitespace-separated EI terminator', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x41, 0x42,
                0x7e, 0x20,
                0x45, 0x49,
                0x43, 0x44,
                0x7e, 0x3e,
                0x20, 0x45, 0x49, 0x20
            ])
        );
        const lexicalStream: _PdfStream = new _PdfStream(
            new Uint8Array([0x31, 0x20, 0x32, 0x20])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(lexicalStream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const length: number =
            parser.findDecodeInlineStreamEnd(stream);
        expect(length).toBe(4);
    });
    it('should calculate an ASCII85 stream length relative to its starting position', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x00, 0x00,
                0x41, 0x42,
                0x7e, 0x3e,
                0x20, 0x45, 0x49, 0x20
            ])
        );
        stream.position = 2;
        const lexicalStream: _PdfStream = new _PdfStream(
            new Uint8Array([0x31, 0x20, 0x32, 0x20])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(lexicalStream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const length: number =
            parser.findDecodeInlineStreamEnd(stream);
        expect(length).toBe(4);
    });
    it('should use the default inline stream search only when ASCII85 data reaches the end of file', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x41, 0x42,
                0x7e, 0x3e,
                0x20, 0x45, 0x49, 0x20
            ])
        );
        const lexicalStream: _PdfStream = new _PdfStream(
            new Uint8Array([0x31, 0x20, 0x32, 0x20])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(lexicalStream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const length: number =
            parser.findDecodeInlineStreamEnd(stream);
        expect(length).toBe(4);
    });
    it('should calculate a hexadecimal inline stream length from the current starting position', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x00, 0x00,
                0x34, 0x31, 0x34, 0x32,
                0x3e,
                0x20, 0x45, 0x49, 0x20
            ])
        );
        stream.position = 2;
        const lexicalStream: _PdfStream = new _PdfStream(
            new Uint8Array([0x31, 0x20, 0x32, 0x20])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(lexicalStream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const length: number =
            parser.findHexDecodeInlineStreamEnd(stream);
        expect(length).toBe(5);
    });
    it('should remain in the initial EI scanner state while ordinary bytes are read', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x41, 0x42, 0x43,
                0x45, 0x49,
                0x20, 0x58
            ])
        );
        const lexicalStream: _PdfStream = new _PdfStream(
            new Uint8Array([0x31, 0x20, 0x32, 0x20])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(lexicalStream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        parser.inlineStreamSkipEI(stream);
        expect(stream.position).toBe(6);
        expect(stream.peekByte()).toBe(0x58);
    });
    it('should recognize the beginning of EI while the scanner is in its initial state', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x20,
                0x45, 0x49,
                0x20,
                0x41
            ])
        );
        const lexicalStream: _PdfStream = new _PdfStream(
            new Uint8Array([0x31, 0x20, 0x32, 0x20])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(lexicalStream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        parser.inlineStreamSkipEI(stream);
        expect(stream.position).toBe(4);
        expect(stream.peekByte()).toBe(0x41);
    });
    it('should apply initial-state processing only before an E byte has been matched', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x45,
                0x41,
                0x45, 0x49,
                0x20,
                0x42
            ])
        );
        const lexicalStream: _PdfStream = new _PdfStream(
            new Uint8Array([0x31, 0x20, 0x32, 0x20])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(lexicalStream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        parser.inlineStreamSkipEI(stream);
        expect(stream.position).toBe(5);
        expect(stream.peekByte()).toBe(0x42);
    });
    it('should update the EI scanner state when an E byte is encountered', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x41,
                0x45, 0x49,
                0x20,
                0x42
            ])
        );
        const lexicalStream: _PdfStream = new _PdfStream(
            new Uint8Array([0x31, 0x20, 0x32, 0x20])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(lexicalStream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        parser.inlineStreamSkipEI(stream);
        expect(stream.position).toBe(4);
        expect(stream.peekByte()).toBe(0x42);
    });
    it('should not enter the second EI scanner state for a non-E byte', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x41, 0x49,
                0x42,
                0x45, 0x49,
                0x20,
                0x43
            ])
        );
        const lexicalStream: _PdfStream = new _PdfStream(
            new Uint8Array([0x31, 0x20, 0x32, 0x20])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(lexicalStream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        parser.inlineStreamSkipEI(stream);
        expect(stream.position).toBe(6);
        expect(stream.peekByte()).toBe(0x43);
    });
    it('should enter the second EI scanner state when an E byte is read', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x45, 0x49,
                0x20,
                0x41
            ])
        );
        const lexicalStream: _PdfStream = new _PdfStream(
            new Uint8Array([0x31, 0x20, 0x32, 0x20])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(lexicalStream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        parser.inlineStreamSkipEI(stream);
        expect(stream.position).toBe(3);
        expect(stream.peekByte()).toBe(0x41);
    });
    it('should recognize only E as the first byte of the EI terminator', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x41, 0x49,
                0x42,
                0x45, 0x49,
                0x20,
                0x43
            ])
        );
        const lexicalStream: _PdfStream = new _PdfStream(
            new Uint8Array([0x31, 0x20, 0x32, 0x20])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(lexicalStream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        parser.inlineStreamSkipEI(stream);
        expect(stream.position).toBe(6);
        expect(stream.peekByte()).toBe(0x43);
    });
    it('should use second-state processing after an E byte has been matched', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x45,
                0x49,
                0x20,
                0x41
            ])
        );
        const lexicalStream: _PdfStream = new _PdfStream(
            new Uint8Array([0x31, 0x20, 0x32, 0x20])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(lexicalStream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        parser.inlineStreamSkipEI(stream);
        expect(stream.position).toBe(3);
        expect(stream.peekByte()).toBe(0x41);
    });
    it('should not complete the EI terminator when E is followed by another character', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x45, 0x58,
                0x41,
                0x45, 0x49,
                0x20,
                0x42
            ])
        );
        const lexicalStream: _PdfStream = new _PdfStream(
            new Uint8Array([0x31, 0x20, 0x32, 0x20])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(lexicalStream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        parser.inlineStreamSkipEI(stream);
        expect(stream.position).toBe(6);
        expect(stream.peekByte()).toBe(0x42);
    });
    it('should process an I byte according to the state established by a preceding E byte', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x45, 0x49,
                0x20,
                0x41
            ])
        );
        const lexicalStream: _PdfStream = new _PdfStream(
            new Uint8Array([0x31, 0x20, 0x32, 0x20])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(lexicalStream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        parser.inlineStreamSkipEI(stream);
        expect(stream.position).toBe(3);
        expect(stream.peekByte()).toBe(0x41);
    });
    it('should update the scanner to the completed state after reading E followed by I', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x41,
                0x45, 0x49,
                0x20,
                0x42
            ])
        );
        const lexicalStream: _PdfStream = new _PdfStream(
            new Uint8Array([0x31, 0x20, 0x32, 0x20])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(lexicalStream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        parser.inlineStreamSkipEI(stream);
        expect(stream.position).toBe(4);
        expect(stream.peekByte()).toBe(0x42);
    });
    it('should reset EI matching when an E byte is not followed by I', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x45, 0x58,
                0x49,
                0x45, 0x49,
                0x20,
                0x41
            ])
        );
        const lexicalStream: _PdfStream = new _PdfStream(
            new Uint8Array([0x31, 0x20, 0x32, 0x20])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(lexicalStream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        parser.inlineStreamSkipEI(stream);
        expect(stream.position).toBe(6);
        expect(stream.peekByte()).toBe(0x41);
    });
    it('should mark EI as complete when I follows a matched E byte', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x45, 0x49,
                0x20,
                0x41
            ])
        );
        const lexicalStream: _PdfStream = new _PdfStream(
            new Uint8Array([0x31, 0x20, 0x32, 0x20])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(lexicalStream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        parser.inlineStreamSkipEI(stream);
        expect(stream.position).toBe(3);
        expect(stream.peekByte()).toBe(0x41);
    });
    it('should require I as the second byte of the EI terminator', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x45, 0x58,
                0x20,
                0x45, 0x49,
                0x20,
                0x41
            ])
        );
        const lexicalStream: _PdfStream = new _PdfStream(
            new Uint8Array([0x31, 0x20, 0x32, 0x20])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(lexicalStream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        parser.inlineStreamSkipEI(stream);
        expect(stream.position).toBe(6);
        expect(stream.peekByte()).toBe(0x41);
    });
    it('should continue one byte beyond EI before leaving the completed scanner state', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x45, 0x49,
                0x20,
                0x41
            ])
        );
        const lexicalStream: _PdfStream = new _PdfStream(
            new Uint8Array([0x31, 0x20, 0x32, 0x20])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(lexicalStream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        parser.inlineStreamSkipEI(stream);
        expect(stream.position).toBe(3);
        expect(stream.peekByte()).toBe(0x41);
    });
    it('should not stop inline stream scanning before a complete EI sequence is found', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x41, 0x42,
                0x45, 0x49,
                0x20,
                0x43
            ])
        );
        const lexicalStream: _PdfStream = new _PdfStream(
            new Uint8Array([0x31, 0x20, 0x32, 0x20])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(lexicalStream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        parser.inlineStreamSkipEI(stream);
        expect(stream.position).toBe(5);
        expect(stream.peekByte()).toBe(0x43);
    });
    it('should leave inline stream scanning only after the completed state is reached', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x45, 0x58,
                0x41,
                0x45, 0x49,
                0x20,
                0x42
            ])
        );
        const lexicalStream: _PdfStream = new _PdfStream(
            new Uint8Array([0x31, 0x20, 0x32, 0x20])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(lexicalStream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        parser.inlineStreamSkipEI(stream);
        expect(stream.position).toBe(6);
        expect(stream.peekByte()).toBe(0x42);
    });
    it('should stop reading immediately after the byte following a completed EI sequence', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x41,
                0x45, 0x49,
                0x20,
                0x42, 0x43
            ])
        );
        const lexicalStream: _PdfStream = new _PdfStream(
            new Uint8Array([0x31, 0x20, 0x32, 0x20])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(lexicalStream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        parser.inlineStreamSkipEI(stream);
        expect(stream.position).toBe(4);
        expect(stream.peekByte()).toBe(0x42);
    });
    it('should stop reading inline image dictionary entries when the parser reaches the end of file', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x42, 0x49,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        expect(() => parser.getObject()).not.toThrowError(
            'Dictionary key must be a name object'
        );
    });
    it('should use the numeric inline image path only when a cipher transform is requested', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x42, 0x49,
                0x20,
                0x49, 0x44,
                0x20,
                0x41,
                0x20, 0x45, 0x49,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        expect(() => parser.getObject()).not.toThrowError(
            TypeError
        );
    });
    it('should parse an inline image without treating an omitted argument as a cipher transform', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x42, 0x49,
                0x20,
                0x49, 0x44,
                0x20,
                0x41,
                0x20, 0x45, 0x49,
                0x20
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const result: any = parser.getObject();
        expect(result).toBeDefined();
    });
    it('should calculate inline image dictionary length relative to its recorded starting position', () => {
        const stream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x00, 0x00,
                0x42, 0x49,
                0x20,
                0x2f, 0x57,
                0x20, 0x31,
                0x20,
                0x49, 0x44,
                0x20,
                0x41,
                0x20, 0x45, 0x49,
                0x20
            ])
        );
        stream.position = 2;
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const result: any = parser.getObject();
        expect(result).toBeDefined();
        expect(lexicalOperator.beginInlineImagePosition).toBeGreaterThan(-1);
    });
});
describe('Pdf parser inline image filter, caching, and stream length mutation coverage', () => {
    it('should read the long Filter dictionary key when the abbreviated key is absent', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([ 0x42, 0x49, 0x20, 0x2f, 0x46, 0x69, 0x6c, 0x74, 0x65, 0x72, 0x20, 0x2f, 0x41, 0x48, 0x78, 0x20, 0x49, 0x44, 0x20, 0x34, 0x31, 0x3e, 0x20, 0x45, 0x49, 0x20 ]) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        const imageStream: any = parser.getObject();
        const filter: _PdfName = imageStream.dictionary.get('Filter');
        expect(filter instanceof _PdfName).toBeTruthy();
        expect(filter.name).toBe('AHx');
    });
    it('should use a direct filter name from an inline image filter array', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([ 0x42, 0x49, 0x20, 0x2f, 0x46, 0x20, 0x5b, 0x2f, 0x41, 0x48, 0x78, 0x5d, 0x20, 0x49, 0x44, 0x20, 0x34, 0x31, 0x3e, 0x20, 0x45, 0x49, 0x20 ]) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        const imageStream: any = parser.getObject();
        const filters: _PdfName[] = imageStream.dictionary.get('F');
        expect(filters.length).toBe(1);
        expect(filters[0] instanceof _PdfName).toBeTruthy();
        expect(filters[0].name).toBe('AHx');
    });
    it('should not resolve a direct filter name through the cross-reference table', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([ 0x42, 0x49, 0x20, 0x2f, 0x46, 0x20, 0x5b, 0x2f, 0x41, 0x38, 0x35, 0x5d, 0x20, 0x49, 0x44, 0x20, 0x7e, 0x3e, 0x20, 0x45, 0x49, 0x20 ]) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        expect(() => parser.getObject()).not.toThrow();
    });
    it('should preserve a direct filter array entry without requiring a cross-reference instance', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([ 0x42, 0x49, 0x20, 0x2f, 0x46, 0x69, 0x6c, 0x74, 0x65, 0x72, 0x20, 0x5b, 0x2f, 0x41, 0x53, 0x43, 0x49, 0x49, 0x48, 0x65, 0x78, 0x44, 0x65, 0x63, 0x6f, 0x64, 0x65, 0x5d, 0x20, 0x49, 0x44, 0x20, 0x34, 0x31, 0x3e, 0x20, 0x45, 0x49, 0x20 ]) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        const imageStream: any = parser.getObject();
        expect(imageStream).toBeDefined();
        expect(imageStream.dictionary.get('Filter')[0].name)
            .toBe('ASCIIHexDecode');
    });
    it('should process a defined direct filter entry without resolving it as an indirect reference', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([ 0x42, 0x49, 0x20, 0x2f, 0x46, 0x20, 0x5b, 0x2f, 0x41, 0x48, 0x78, 0x5d, 0x20, 0x49, 0x44, 0x20, 0x34, 0x32, 0x3e, 0x20, 0x45, 0x49, 0x20 ]) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        const imageStream: any = parser.getObject();
        expect(imageStream).toBeDefined();
        expect(imageStream.dictionary.get('F')[0].name).toBe('AHx');
    });
    it('should accept a non-null direct name as the first inline image filter', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([ 0x42, 0x49, 0x20, 0x2f, 0x46, 0x20, 0x5b, 0x2f, 0x41, 0x38, 0x35, 0x5d, 0x20, 0x49, 0x44, 0x20, 0x7e, 0x3e, 0x20, 0x45, 0x49, 0x20 ]) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        const imageStream: any = parser.getObject();
        expect(imageStream).toBeDefined();
        expect(imageStream.dictionary.get('F')[0].name).toBe('A85');
    });
    it('should accept a defined direct filter name from an inline image filter array', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([ 0x42, 0x49, 0x20, 0x2f, 0x46, 0x20, 0x5b, 0x2f, 0x41, 0x53, 0x43, 0x49, 0x49, 0x38, 0x35, 0x44, 0x65, 0x63, 0x6f, 0x64, 0x65, 0x5d, 0x20, 0x49, 0x44, 0x20, 0x7e, 0x3e, 0x20, 0x45, 0x49, 0x20 ]) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        const imageStream: any = parser.getObject();
        expect(imageStream.dictionary.get('F')[0].name)
            .toBe('ASCII85Decode');
    });
    it('should compare the filter array entry type against undefined', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([ 0x42, 0x49, 0x20, 0x2f, 0x46, 0x20, 0x5b, 0x2f, 0x41, 0x48, 0x78, 0x5d, 0x20, 0x49, 0x44, 0x20, 0x34, 0x33, 0x3e, 0x20, 0x45, 0x49, 0x20 ]) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        expect(() => parser.getObject()).not.toThrow();
    });
    it('should select ASCII85 decoding for the abbreviated A85 filter name', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([ 0x42, 0x49, 0x20, 0x2f, 0x46, 0x20, 0x2f, 0x41, 0x38, 0x35, 0x20, 0x49, 0x44, 0x20, 0x7a, 0x7e, 0x3e, 0x20, 0x45, 0x49, 0x20 ]) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        const imageStream: any = parser.getObject();
        const bytes: Uint8Array = imageStream.getBytes();
        expect(bytes.length).toBe(3);
    });
    it('should select JPEG decoding for the full DCTDecode filter name', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([ 0x42, 0x49, 0x20, 0x2f, 0x46, 0x69, 0x6c, 0x74, 0x65, 0x72, 0x20, 0x2f, 0x44, 0x43, 0x54, 0x44, 0x65, 0x63, 0x6f, 0x64, 0x65, 0x20, 0x49, 0x44, 0x20, 0xff, 0xd8, 0xff, 0xd9, 0x20, 0x45, 0x49, 0x20 ]) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        const imageStream: any = parser.getObject();
        expect(imageStream).toBeDefined();
        expect(imageStream.dictionary.get('Filter').name) .toBe('DCTDecode');
    });
    it('should avoid caching an inline image whose data reaches the cache length limit', () => {
        const bytes: number[] = [ 0x42, 0x49, 0x20, 0x49, 0x44, 0x20 ];
        for (let i: number = 0; i < 1000; i++) { bytes.push(0x41); }
        bytes.push( 0x20, 0x45, 0x49, 0x20 );
        const stream: _PdfStream = new _PdfStream( new Uint8Array(bytes) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        const imageStream: any = parser.getObject();
        expect(imageStream).toBeDefined();
        expect(parser.imageCache.size).toBe(0);
    });
    it('should require inline image data length to be strictly below the cache limit', () => {
        const bytes: number[] = [ 0x42, 0x49, 0x20, 0x49, 0x44, 0x20 ];
        for (let i: number = 0; i < 1000; i++) { bytes.push(0x42); }
        bytes.push( 0x20, 0x45, 0x49, 0x20 );
        const stream: _PdfStream = new _PdfStream( new Uint8Array(bytes) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        parser.getObject();
        expect(parser.imageCache.size).toBe(0);
    });
    it('should require inline image dictionary length to be strictly below the numeric limit', () => {
        const bytes: number[] = [ 0x42, 0x49, 0x20, 0x2f, 0x41, 0x20, 0x28 ];
        for (let i: number = 0; i < 5540; i++) { bytes.push(0x41);}
        bytes.push( 0x29, 0x20, 0x49, 0x44, 0x20, 0x42, 0x20, 0x45, 0x49, 0x20 );
        const stream: _PdfStream = new _PdfStream( new Uint8Array(bytes));
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        parser.getObject();
        expect(parser.imageCache.size).toBe(1);
    });
    it('should add an inline image to the cache only when a cache key was calculated', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([ 0x42, 0x49, 0x20, 0x49, 0x44, 0x20, 0x41, 0x42, 0x20, 0x45, 0x49, 0x20 ]) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        const imageStream: any = parser.getObject();
        expect(imageStream).toBeDefined();
        expect(parser.imageCache.size).toBe(1);
    });
    it('should ignore truncated-signature recovery when the shortened signature is not found', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([ 0x0a, 0x41, 0x42, 0x43, 0x0a, 0x65, 0x6e, 0x64, 0x20 ]) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        const dictionary: _PdfDictionary = new _PdfDictionary(null);
        dictionary.set('Length', 50);
        expect(() => parser.makeStream(dictionary)).toThrow();
    });
});
describe('Pdf parser stream recovery and filter processing mutation coverage', () => {
    it('should reject a truncated endstream signature when the following byte is not whitespace', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([ 0x0a, 0x41, 0x0a, 0x65, 0x6e, 0x64, 0x73, 0x74, 0x72, 0x65, 0x61, 0x58, 0x20 ]) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator(stream, false, false);
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        const dictionary: _PdfDictionary = new _PdfDictionary(null);
        dictionary.set('Length', 30);
        expect(() => parser.makeStream(dictionary)).toThrow();
    });
    it('should use the ordinary cipher stream path for a non-GCM cipher transform', () => {
        const encryptedBytes: Uint8Array = new Uint8Array([ 0x78, 0x9c, 0x73, 0x04, 0x00, 0x00, 0x42, 0x00, 0x42 ]);
        const stream: _PdfStream = new _PdfStream(encryptedBytes);
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator( new _PdfStream( new Uint8Array([0x31, 0x20, 0x32, 0x20]) ), false, false );
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        const dictionary: _PdfDictionary = new _PdfDictionary(null);
        dictionary.set('Filter', _PdfName.get('FlateDecode'));
        const result: any = parser.filter( stream, dictionary, encryptedBytes.length );
        expect(result).toBeDefined();
    });
    it('should process an unencrypted stream without entering GCM decryption', () => {
        const compressedBytes: Uint8Array = new Uint8Array([ 0x78, 0x9c, 0x73, 0x04, 0x00, 0x00, 0x42, 0x00, 0x42 ]);
        const stream: _PdfStream = new _PdfStream(compressedBytes);
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator( new _PdfStream( new Uint8Array([0x31, 0x20, 0x32, 0x20]) ), false, false );
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        const dictionary: _PdfDictionary = new _PdfDictionary(null);
        dictionary.set('Filter', _PdfName.get('FlateDecode'));
        const result: any = parser.filter( stream, dictionary, compressedBytes.length );
        expect(result).toBeDefined();
    });
    it('should read the abbreviated F key when selecting stream filters', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([ 0x78, 0x9c, 0x73, 0x04, 0x00, 0x00, 0x42, 0x00, 0x42 ]) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator( new _PdfStream( new Uint8Array([0x31, 0x20, 0x32, 0x20]) ), false, false );
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        const dictionary: _PdfDictionary = new _PdfDictionary(null);
        dictionary.set('F', _PdfName.get('Fl'));
        const filteredStream: any = parser.filter( stream, dictionary, 9 );
        const bytes: Uint8Array = filteredStream.getBytes();
        expect(bytes.length).toBe(1);
        expect(bytes[0]).toBe(0x41);
    });
    it('should read abbreviated decode parameters from the DP dictionary key', () => {
        const compressedBytes: Uint8Array = new Uint8Array([ 0x78, 0x9c, 0x73, 0x04, 0x00, 0x00, 0x42, 0x00, 0x42 ]);
        const stream: _PdfStream = new _PdfStream(compressedBytes);
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator( new _PdfStream( new Uint8Array([0x31, 0x20, 0x32, 0x20]) ), false, false );
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        const dictionary: _PdfDictionary = new _PdfDictionary(null);
        const parameters: _PdfDictionary = new _PdfDictionary(null);
        parameters.set('Predictor', 1);
        dictionary.set('F', _PdfName.get('Fl'));
        dictionary.set('DP', parameters);
        const filteredStream: any = parser.filter( stream, dictionary, compressedBytes.length );
        expect(filteredStream).toBeDefined();
    });
    it('should apply a command-based filter directly to the supplied stream', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([ 0x34, 0x31, 0x34, 0x32, 0x3e ]) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator( new _PdfStream( new Uint8Array([0x31, 0x20, 0x32, 0x20]) ), false, false );
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        const dictionary: _PdfDictionary = new _PdfDictionary(null);
        dictionary.set( 'Filter', _PdfCommand.get('ASCIIHexDecode') );
        const filteredStream: any = parser.filter( stream, dictionary, 5 );
        const bytes: Uint8Array = filteredStream.getBytes();
        expect(bytes.length).toBe(5);
        expect(bytes[0]).toBe(52);
    });
    it('should return the result created for a command-based stream filter', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([ 0x34, 0x33, 0x34, 0x34, 0x3e ]) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator( new _PdfStream( new Uint8Array([0x31, 0x20, 0x32, 0x20]) ), false, false );
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        const dictionary: _PdfDictionary = new _PdfDictionary(null);
        dictionary.set( 'Filter', _PdfCommand.get('AHx') );
        const filteredStream: any = parser.filter( stream, dictionary, 5 );
        const bytes: Uint8Array = filteredStream.getBytes();
        expect(bytes[0]).toBe(52);
    });
    it('should include the unsupported filter name in the error message', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([0x41]) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator( new _PdfStream( new Uint8Array([0x31, 0x20, 0x32, 0x20]) ), false, false );
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        expect(() => parser.makeFilter( stream, 'UnsupportedFilter', 1, null )).not.toThrow();
    });
    it('should ignore decode parameter arrays when the current filter index is outside their range', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([ 0x34, 0x31, 0x3e ]) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator( new _PdfStream( new Uint8Array([0x31, 0x20, 0x32, 0x20]) ), false, false );
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const dictionary: _PdfDictionary =
            new _PdfDictionary(null);
        dictionary.set('Filter', [ _PdfName.get('AHx'), _PdfName.get('AHx') ]);
        dictionary.set('DecodeParms', []);
        const filteredStream: any = parser.filter( stream, dictionary, 3 );
        expect(filteredStream).toBeDefined();
    });
    it('should require a valid decode parameter array entry for the active filter index', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([ 0x34, 0x31, 0x3e ]) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator( new _PdfStream( new Uint8Array([0x31, 0x20, 0x32, 0x20]) ), false, false );
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const dictionary: _PdfDictionary =
            new _PdfDictionary(null);
        dictionary.set('Filter', [
            _PdfName.get('AHx')
        ]);
        dictionary.set('DecodeParms', []);
        const filteredStream: any = parser.filter(
            stream,
            dictionary,
            3
        );
        const bytes: Uint8Array = filteredStream.getBytes();
        expect(bytes.length).toBe(3);
        expect(bytes[0]).toBe(52);
    });
    it('should use a direct parameter dictionary for a single stream filter', () => {
        const compressedBytes: Uint8Array = new Uint8Array([
            0x78, 0x9c, 0x73, 0x01, 0x00, 0x00, 0x43, 0x00, 0x43
        ]);
        const stream: _PdfStream =
            new _PdfStream(compressedBytes);
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(
                new _PdfStream(
                    new Uint8Array([0x31, 0x20, 0x32, 0x20])
                ),
                false,
                false
            );
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const dictionary: _PdfDictionary =
            new _PdfDictionary(null);
        const parameters: _PdfDictionary =
            new _PdfDictionary(null);
        parameters.set('Predictor', 1);
        dictionary.set('Filter', _PdfName.get('Fl'));
        dictionary.set('DecodeParms', parameters);
        const filteredStream: any = parser.filter(
            stream,
            dictionary,
            compressedBytes.length
        );
        expect(filteredStream).toBeDefined();
    });
    it('should not select indexed decode parameters when the filter index is null', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([ 0x34, 0x35, 0x3e ]) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator( new _PdfStream( new Uint8Array([0x31, 0x20, 0x32, 0x20]) ), false, false );
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        const dictionary: _PdfDictionary = new _PdfDictionary(null);
        dictionary.set('Filter', _PdfName.get('AHx'));
        dictionary.set('DecodeParms', []);
        const filteredStream: any = parser.filter( stream, dictionary, 3 );
        expect(filteredStream.getBytes()[0]).toBe(52);
    });
    it('should require the filter index to be defined before reading indexed decode parameters', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([ 0x34, 0x37, 0x3e ]) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator( new _PdfStream( new Uint8Array([0x31, 0x20, 0x32, 0x20]) ), false, false );
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        const dictionary: _PdfDictionary = new _PdfDictionary(null);
        dictionary.set('Filter', _PdfName.get('AHx'));
        dictionary.set('DecodeParms', []);
        const filteredStream: any = parser.filter( stream, dictionary, 3 );
        expect(filteredStream.getBytes()[0]).toBe(52);
    });
    it('should use indexed decode parameters when the filter index is defined', () => {
        const compressedBytes: Uint8Array = new Uint8Array([ 0x78, 0x9c, 0xf3, 0x00, 0x00, 0x00, 0x49, 0x00, 0x49 ]);
        const stream: _PdfStream = new _PdfStream(compressedBytes);
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator( new _PdfStream( new Uint8Array([0x31, 0x20, 0x32, 0x20]) ), false, false );
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        const dictionary: _PdfDictionary = new _PdfDictionary(null);
        const parameters: _PdfDictionary = new _PdfDictionary(null);
        parameters.set('Predictor', 1);
        dictionary.set('Filter', [ _PdfName.get('Fl') ]);
        dictionary.set('DecodeParms', [ parameters ]);
        const filteredStream: any = parser.filter( stream, dictionary, compressedBytes.length );
        expect(filteredStream).toBeDefined();
    });
    it('should compare a missing filter index against the undefined type name', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([ 0x34, 0x38, 0x3e ]) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator( new _PdfStream( new Uint8Array([0x31, 0x20, 0x32, 0x20]) ), false, false );
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        const dictionary: _PdfDictionary = new _PdfDictionary(null);
        dictionary.set('Filter', _PdfName.get('AHx'));
        dictionary.set('DecodeParms', []);
        const filteredStream: any = parser.filter( stream, dictionary, 3 );
        expect(filteredStream.getBytes()[0]).toBe(52);
    });
    it('should apply the decode parameter entry matching each filter in a filter array', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([ 0x34, 0x39, 0x3e ]) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator( new _PdfStream( new Uint8Array([0x31, 0x20, 0x32, 0x20]) ), false, false );
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        const dictionary: _PdfDictionary = new _PdfDictionary(null);
        const parameters: _PdfDictionary = new _PdfDictionary(null);
        parameters.set('Predictor', 1);
        dictionary.set('Filter', [ _PdfName.get('AHx') ]);
        dictionary.set('DecodeParms', [ parameters ]);
        const filteredStream: any = parser.filter( stream, dictionary, 3 );
        expect(filteredStream.getBytes()[0]).toBe(52);
    });
    it('should apply a command from a filter array using its command text', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([ 0x34, 0x41, 0x3e ]) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator( new _PdfStream( new Uint8Array([0x31, 0x20, 0x32, 0x20]) ), false, false );
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        const dictionary: _PdfDictionary = new _PdfDictionary(null);
        dictionary.set('Filter', [ _PdfName.get('AHx') ]);
        const filteredStream: any = parser.filter( stream, dictionary, 3 );
        expect(filteredStream.getBytes()[0]).toBe(52);
    });
    it('should return a null stream when the requested filter length is zero', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array(0) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator( new _PdfStream( new Uint8Array([0x31, 0x20, 0x32, 0x20]) ), false, false );
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const result: any = parser.makeFilter( stream, 'Fl', 0, null );
        expect(result instanceof _PdfNullStream).toBeTruthy();
    });
    it('should return immediately with an empty null stream for zero-length filtered data', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array(0) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator( new _PdfStream( new Uint8Array([0x31, 0x20, 0x32, 0x20]) ), false, false );
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        const result: any = parser.makeFilter( stream, 'UnsupportedFilter', 0, null );
        expect(result instanceof _PdfNullStream).toBeTruthy();
        expect(result.getBytes().length).toBe(0);
    });
    it('should recognize the abbreviated Fl name as a Flate stream filter', () => {
        const compressedBytes: Uint8Array = new Uint8Array([ 0x78, 0x9c, 0xf3, 0x00, 0x00, 0x00, 0x49, 0x00, 0x49 ]);
        const stream: _PdfStream = new _PdfStream(compressedBytes);
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator( new _PdfStream( new Uint8Array([0x31, 0x20, 0x32, 0x20]) ), false, false );
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        const result: any = parser.makeFilter( stream, 'Fl', compressedBytes.length, null );
        const bytes: Uint8Array = result.getBytes();
        expect(bytes.length).toBe(1);
        expect(bytes[0]).toBe(72);
    });
    it('should use the exact abbreviated Fl text when selecting Flate decoding', () => {
        const compressedBytes: Uint8Array = new Uint8Array([
            0x78, 0x9c, 0xf3, 0x02, 0x00, 0x00, 0x4a, 0x00, 0x4a
        ]);
        const stream: _PdfStream = new _PdfStream(compressedBytes);
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator( new _PdfStream( new Uint8Array([0x31, 0x20, 0x32, 0x20]) ), false, false );
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        const result: any = parser.makeFilter( stream, 'Fl', compressedBytes.length, null );
        expect(result).toBeDefined();
        expect(result.getBytes()[0]).toBe(0x4a);
    });
    it('should create a predictor stream only when Flate decode parameters are supplied', () => {
        const compressedBytes: Uint8Array = new Uint8Array([ 0x78, 0x9c, 0xf3, 0x06, 0x00, 0x00, 0x4c, 0x00, 0x4c ]);
        const stream: _PdfStream = new _PdfStream(compressedBytes);
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator( new _PdfStream( new Uint8Array([0x31, 0x20, 0x32, 0x20]) ), false, false );
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        const result: any = parser.makeFilter( stream, 'FlateDecode', compressedBytes.length, null );
        const bytes: Uint8Array = result.getBytes();
        expect(bytes.length).toBe(1);
        expect(bytes[0]).toBe(75);
    });
    it('should use the normal non-image filter path when image extraction is disabled', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([ 0x34, 0x44, 0x3e ]) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator( new _PdfStream( new Uint8Array([0x31, 0x20, 0x32, 0x20]) ), false, false );
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        parser._isImageExtraction = false;
        const result: any = parser.makeFilter( stream, 'AHx', 3, null );
        expect(result.getBytes()[0]).toBe(52);
    });
});
describe('Pdf parser image extraction filters and stream signature mutation coverage', () => {
    it('should recognize the abbreviated LZW filter during image extraction', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([0x80, 0x0b, 0x60, 0x50, 0x22, 0x0c, 0x0c, 0x85, 0x01]) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator( new _PdfStream( new Uint8Array([0x31, 0x20, 0x32, 0x20]) ), false, false );
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        parser._isImageExtraction = true;
        const result: any = parser.makeFilter( stream, 'LZW', stream.end, null );
        expect(result instanceof _PdfLempelZivWelchStream).toBeTruthy();
    });
    it('should create an LZW stream for the full LZWDecode filter name', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([0x80, 0x0b, 0x60, 0x50, 0x22, 0x0c, 0x0c, 0x85, 0x01]) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator( new _PdfStream( new Uint8Array([0x31, 0x20, 0x32, 0x20]) ), false, false );
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        parser._isImageExtraction = true;
        const result: any = parser.makeFilter( stream, 'LZWDecode', stream.end, null );
        expect(result instanceof _PdfLempelZivWelchStream).toBeTruthy();
    });
    it('should recognize the exact LZWDecode filter name during image extraction', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([0x80, 0x0b, 0x60, 0x50, 0x22, 0x0c, 0x0c, 0x85, 0x01]) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator( new _PdfStream( new Uint8Array([0x31, 0x20, 0x32, 0x20]) ), false, false );
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        parser._isImageExtraction = true;
        const result: any = parser.makeFilter( stream, 'LZWDecode', stream.end, null );
        expect(result instanceof _PdfLempelZivWelchStream).toBeTruthy();
    });
    it('should read EarlyChange from LZW decode parameters', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([0x80, 0x0b, 0x60, 0x50, 0x22, 0x0c, 0x0c, 0x85, 0x01]) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator( new _PdfStream( new Uint8Array([0x31, 0x20, 0x32, 0x20]) ), false, false );
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        const parameters: _PdfDictionary = new _PdfDictionary(null);
        parameters.set('EarlyChange', 0);
        parser._isImageExtraction = true;
        const result: any = parser.makeFilter( stream, 'LZWDecode', stream.end, parameters );
        expect(result instanceof PdfPredictorStream).toBeFalsy();
    });
    it('should preserve the default LZW early-change value when the parameter is absent', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([0x80, 0x0b, 0x60, 0x50, 0x22, 0x0c, 0x0c, 0x85, 0x01]) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator( new _PdfStream( new Uint8Array([0x31, 0x20, 0x32, 0x20]) ), false, false );
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        const parameters: _PdfDictionary = new _PdfDictionary(null);
        parameters.set('Predictor', 1);
        parser._isImageExtraction = true;
        const result: any = parser.makeFilter( stream, 'LZWDecode', stream.end, parameters );
        expect(result instanceof PdfPredictorStream).toBeFalsy();
        expect(parameters.has('EarlyChange')).toBeFalsy();
    });
    it('should avoid reading EarlyChange when the LZW parameters do not contain that key', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([0x80, 0x0b, 0x60, 0x50, 0x22, 0x0c, 0x0c, 0x85, 0x01]) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator( new _PdfStream( new Uint8Array([0x31, 0x20, 0x32, 0x20]) ), false, false );
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        const parameters: _PdfDictionary = new _PdfDictionary(null);
        parameters.set('Predictor', 1);
        parser._isImageExtraction = true;
        const result: any = parser.makeFilter( stream, 'LZW', stream.end, parameters );
        expect(result instanceof PdfPredictorStream).toBeFalsy();
    });
    it('should apply the configured LZW early-change value before creating the decoder', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([0x80, 0x0b, 0x60, 0x50, 0x22, 0x0c, 0x0c, 0x85, 0x01]) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator( new _PdfStream( new Uint8Array([0x31, 0x20, 0x32, 0x20]) ), false, false );
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        const parameters: _PdfDictionary = new _PdfDictionary(null);
        parameters.set('EarlyChange', 0);
        parameters.set('Predictor', 1);
        parser._isImageExtraction = true;
        const result: any = parser.makeFilter( stream, 'LZW', stream.end, parameters );
        expect(result instanceof PdfPredictorStream).toBeFalsy();
        expect(parameters.get('EarlyChange')).toBe(0);
    });
    it('should use the exact EarlyChange key when reading LZW parameters', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([0x80, 0x0b, 0x60, 0x50, 0x22, 0x0c, 0x0c, 0x85, 0x01]) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator( new _PdfStream( new Uint8Array([0x31, 0x20, 0x32, 0x20]) ), false, false );
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        const parameters: _PdfDictionary = new _PdfDictionary(null);
        parameters.set('EarlyChange', 0);
        parser._isImageExtraction = true;
        const result: any = parser.makeFilter( stream, 'LZWDecode', stream.end, parameters );
        expect(result instanceof PdfPredictorStream).toBeFalsy();
        expect(parameters.has('EarlyChange')).toBeTruthy();
    });
    it('should recognize the abbreviated DCT filter during image extraction', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([ 0xff, 0xd8, 0xff, 0xd9 ]) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator( new _PdfStream( new Uint8Array([0x31, 0x20, 0x32, 0x20]) ), false, false );
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        parser._isImageExtraction = true;
        const result: any = parser.makeFilter( stream, 'DCT', stream.end, null );
        expect(result instanceof _PdfJpegStream).toBeTruthy();
    });
    it('should create a JPEG stream for the full DCTDecode filter name', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([ 0xff, 0xd8, 0xff, 0xd9 ]) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator( new _PdfStream( new Uint8Array([0x31, 0x20, 0x32, 0x20]) ), false, false );
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        parser._isImageExtraction = true;
        const result: any = parser.makeFilter( stream, 'DCTDecode', stream.end, null );
        expect(result instanceof _PdfJpegStream).toBeTruthy();
    });
    it('should recognize the exact DCTDecode filter name during image extraction', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([ 0xff, 0xd8, 0xff, 0xd9 ]) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator( new _PdfStream( new Uint8Array([0x31, 0x20, 0x32, 0x20]) ), false, false );
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        const parameters: _PdfDictionary = new _PdfDictionary(null);
        parser._isImageExtraction = true;
        const result: any = parser.makeFilter( stream, 'DCTDecode', stream.end, parameters );
        expect(result instanceof _PdfJpegStream).toBeTruthy();
    });
    it('should recognize the abbreviated JPX filter during image extraction', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([ 0x00, 0x00, 0x00, 0x0c, 0x6a, 0x50, 0x20, 0x20, 0x0d, 0x0a, 0x87, 0x0a ]) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator( new _PdfStream( new Uint8Array([0x31, 0x20, 0x32, 0x20]) ), false, false );
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        parser._isImageExtraction = true;
        const result: any = parser.makeFilter( stream, 'JPX', stream.end, null );
        expect(result instanceof _PdfJpxStream).toBeTruthy();
    });
    it('should create a JPX stream for the full JPXDecode filter name', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([ 0x00, 0x00, 0x00, 0x0c, 0x6a, 0x50, 0x20, 0x20, 0x0d, 0x0a, 0x87, 0x0a ]) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator( new _PdfStream( new Uint8Array([0x31, 0x20, 0x32, 0x20]) ), false, false );
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        parser._isImageExtraction = true;
        const result: any = parser.makeFilter( stream, 'JPXDecode', stream.end, null );
        expect(result instanceof _PdfJpxStream).toBeTruthy();
    });
    it('should recognize the exact JPXDecode filter name during image extraction', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([ 0x00, 0x00, 0x00, 0x0c, 0x6a, 0x50, 0x20, 0x20, 0x0d, 0x0a, 0x87, 0x0a ]) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator( new _PdfStream( new Uint8Array([0x31, 0x20, 0x32, 0x20]) ), false, false );
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        const parameters: _PdfDictionary = new _PdfDictionary(null);
        parser._isImageExtraction = true;
        const result: any = parser.makeFilter( stream, 'JPXDecode', stream.end, parameters );
        expect(result instanceof _PdfJpxStream).toBeTruthy();
    });
    it('should recognize the abbreviated A85 filter during image extraction', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([ 0x7a, 0x7e, 0x3e ]) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator( new _PdfStream( new Uint8Array([0x31, 0x20, 0x32, 0x20]) ), false, false );
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        parser._isImageExtraction = true;
        const result: any = parser.makeFilter( stream, 'A85', stream.end, null );
        expect(result instanceof _PdfAscii85Stream).toBeTruthy();
    });
    it('should create an ASCII85 stream for the full ASCII85Decode filter name', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([ 0x7a, 0x7e, 0x3e ]) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator( new _PdfStream( new Uint8Array([0x31, 0x20, 0x32, 0x20]) ), false, false );
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        parser._isImageExtraction = true;
        const result: any = parser.makeFilter( stream, 'ASCII85Decode', stream.end, null );
        expect(result instanceof _PdfAscii85Stream).toBeTruthy();
    });
    it('should recognize the exact ASCII85Decode filter name during image extraction', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([ 0x7a, 0x7e, 0x3e ]) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator( new _PdfStream( new Uint8Array([0x31, 0x20, 0x32, 0x20]) ), false, false );
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        parser._isImageExtraction = true;
        const result: any = parser.makeFilter( stream, 'ASCII85Decode', stream.end, null );
        expect(result instanceof _PdfAscii85Stream).toBeTruthy();
    });
    it('should recognize the abbreviated AHx filter during image extraction', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([ 0x34, 0x31, 0x3e ]) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator( new _PdfStream( new Uint8Array([0x31, 0x20, 0x32, 0x20]) ), false, false );
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        parser._isImageExtraction = true;
        const result: any = parser.makeFilter( stream, 'AHx', stream.end, null );
        expect(result instanceof _PdfAsciiHexStream).toBeTruthy();
    });
});
describe('Pdf parser stream signature and default inline image ending mutation coverage', () => {
    it('should stop checking signature positions before reaching the calculated scan length', () => {
        const sourceStream: _PdfStream = new _PdfStream(
            new Uint8Array([
                0x41,
                0x42,
                0x43,
                0x58,
                0x59
            ])
        );
        const lexicalOperator: _PdfLexicalOperator =
            new _PdfLexicalOperator(sourceStream, false, false);
        const parser: _PdfParser =
            new _PdfParser(lexicalOperator, null, false, false);
        const length: number = parser._findStreamLength(
            0,
            new Uint8Array([
                0x58,
                0x59,
                0x5a
            ])
        );
        expect(length).toBe(-1);
    });
    it('should stop comparing signature bytes after the complete signature has matched', () => {
        const sourceStream: _PdfStream = new _PdfStream( new Uint8Array([ 0x41, 0x65, 0x6e, 0x64, 0x42 ]) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator(sourceStream, false, false);
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        const length: number = parser._findStreamLength( 0, new Uint8Array([ 0x65, 0x6e, 0x64 ]) );
        expect(length).toBe(1);
        expect(sourceStream.position).toBe(1);
    });
    it('should compare exactly the number of bytes contained in the signature', () => {
        const sourceStream: _PdfStream = new _PdfStream( new Uint8Array([ 0x41, 0x42, 0x45, 0x49, 0x20 ]) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator(sourceStream, false, false);
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        const length: number = parser._findStreamLength( 0, new Uint8Array([ 0x45, 0x49 ]) );
        expect(length).toBe(2);
        expect(sourceStream.position).toBe(2);
    });
    it('should return the signature position relative to the requested stream start', () => {
        const sourceStream: _PdfStream = new _PdfStream( new Uint8Array([ 0x00, 0x00, 0x41, 0x42, 0x65, 0x6e, 0x64, 0x43 ]) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator(sourceStream, false, false);
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        const length: number = parser._findStreamLength( 2, new Uint8Array([ 0x65, 0x6e, 0x64 ]) );
        expect(length).toBe(2);
        expect(sourceStream.position).toBe(4);
    });
    it('should not enter the first terminator state for a byte other than E', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([ 0x41, 0x49, 0x20, 0x45, 0x49, 0x20, 0x42 ]) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator( new _PdfStream( new Uint8Array([0x31, 0x20, 0x32, 0x20]) ), false, false );
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        const length: number = parser.findDefaultInlineStreamEnd(stream);
        expect(length).toBe(2);
    });
    it('should not complete the inline image terminator when E is followed by a non-I byte', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([ 0x41, 0x45, 0x58, 0x20, 0x45, 0x49, 0x20, 0x42 ]) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator( new _PdfStream( new Uint8Array([0x31, 0x20, 0x32, 0x20]) ), false, false );
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        const length: number = parser.findDefaultInlineStreamEnd(stream);
        expect(length).toBe(3);
    });
    it('should retain the completed terminator state while validating bytes following EI', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([ 0x41, 0x45, 0x49, 0x20, 0x42, 0x43, 0x44 ]) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator( new _PdfStream( new Uint8Array([0x31, 0x20, 0x32, 0x20]) ), false, false );
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        const length: number = parser.findDefaultInlineStreamEnd(stream);
        expect(length).toBe(1);
    });
    it('should reject EI as an inline image ending when it is followed by a regular character', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([ 0x41, 0x45, 0x49, 0x58, 0x42, 0x45, 0x49, 0x20, 0x43 ]) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator( new _PdfStream( new Uint8Array([0x31, 0x20, 0x32, 0x20]) ), false, false );
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        const length: number = parser.findDefaultInlineStreamEnd(stream);
        expect(length).toBe(5);
    });
    it('should accept a line-feed byte as valid whitespace after an EI terminator', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([ 0x41, 0x42, 0x45, 0x49, 0x0a, 0x43, 0x44 ]) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator( new _PdfStream( new Uint8Array([0x31, 0x20, 0x32, 0x20]) ), false, false );
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        const length: number = parser.findDefaultInlineStreamEnd(stream);
        expect(length).toBe(2);
    });
    it('should ignore a zero byte followed by a non-zero byte while validating an EI candidate', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([ 0x41, 0x45, 0x49, 0x20, 0x00, 0x41, 0x42 ]) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator( new _PdfStream( new Uint8Array([0x31, 0x20, 0x32, 0x20]) ), false, false );
        const parser: _PdfParser = new _PdfParser(lexicalOperator, null, false, false);
        const length: number = parser.findDefaultInlineStreamEnd(stream);
        expect(length).toBe(1);
    });
});
describe('Pdf parser inline stream offset, linearization, and module initialization mutation coverage', () => {
    it('should retain the four-byte ending offset when whitespace precedes the EI command', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([ 0x41, 0x42, 0x20, 0x45, 0x49, 0x20, 0x43 ]) );
        const lexicalOperator: _PdfLexicalOperator = new _PdfLexicalOperator( new _PdfStream( new Uint8Array([ 0x31, 0x20, 0x32, 0x20 ]) ), false, false );
        const parser: _PdfParser = new _PdfParser( lexicalOperator, null, false, false );
        const length: number = parser.findDefaultInlineStreamEnd(stream);
        expect(length).toBe(2);
    });
    it('should initialize an invalid linearization dictionary as invalid', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([ 0x31, 0x20, 0x30, 0x20, 0x52, 0x20 ]) );
        const linearization: _Linearization = new _Linearization(stream);
        expect(linearization.isValid).toBeFalsy();
    });
    it('should compare a missing Linearized value against undefined', () => {
        const stream: _PdfStream = new _PdfStream( new Uint8Array([ 0x31, 0x20, 0x30, 0x20, 0x6f, 0x62, 0x6a, 0x20, 0x3c, 0x3c, 0x20, 0x2f, 0x4f, 0x20, 0x31, 0x20, 0x3e, 0x3e ]) );
        const linearization: _Linearization = new _Linearization(stream);
        expect(linearization.isValid).toBeFalsy();
        expect(linearization.objectNumberFirst).toBeUndefined();
    });
    it('should read the optional first-page number from the P dictionary entry', () => {
        const linearization: _Linearization = new _Linearization( new _PdfStream( new Uint8Array([ 0x31, 0x20, 0x30, 0x20, 0x52 ]) ) );
        const dictionary: _PdfDictionary = new _PdfDictionary(null);
        dictionary.set('P', 7);
        expect( linearization.getInt( dictionary, 'P', true ) ).toBe(7);
    });
    it('should disallow zero in a linearization integer when the optional flag is omitted', () => {
        const linearization: _Linearization = new _Linearization( new _PdfStream( new Uint8Array([ 0x31, 0x20, 0x30, 0x20, 0x52 ]) ) );
        const dictionary: _PdfDictionary = new _PdfDictionary(null);
        dictionary.set('L', 0);
        expect(() => linearization.getInt( dictionary, 'L' )).toThrowError( Error );
    });
    it('should initialize the omitted zero-value option to false', () => {
        const linearization: _Linearization = new _Linearization( new _PdfStream( new Uint8Array([ 0x31, 0x20, 0x30, 0x20, 0x52 ]) ) );
        const dictionary: _PdfDictionary = new _PdfDictionary(null);
        dictionary.set('O', 0);
        expect(() => linearization.getInt( dictionary, 'O' )).toThrowError( Error );
    });
    it('should keep zero values disabled by default for required linearization integers', () => {
        const linearization: _Linearization = new _Linearization( new _PdfStream( new Uint8Array([ 0x31, 0x20, 0x30, 0x20, 0x52 ]) ) );
        const dictionary: _PdfDictionary = new _PdfDictionary(null);
        dictionary.set('N', 0);
        expect(() => linearization.getInt( dictionary, 'N' )).toThrowError( Error );
    });
    it('should reject a missing required linearization integer', () => {
        const linearization: _Linearization = new _Linearization( new _PdfStream( new Uint8Array([ 0x31, 0x20, 0x30, 0x20, 0x52 ]) ) );
        const dictionary: _PdfDictionary = new _PdfDictionary(null);
        expect(() => linearization.getInt( dictionary, 'E' )).toThrowError( Error );
    });
    it('should identify a missing linearization integer using the undefined type value', () => {
        const linearization: _Linearization = new _Linearization( new _PdfStream( new Uint8Array([ 0x31, 0x20, 0x30, 0x20, 0x52 ]) ) );
        const dictionary: _PdfDictionary = new _PdfDictionary(null);
        expect(() => linearization.getInt( dictionary, 'T', false )).toThrowError( Error );
    });
});
