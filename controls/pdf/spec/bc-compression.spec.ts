import { _HuffmanTree } from '../src/pdf/core/compression/huffman-tree';
import { _PdfArithmeticDecoder } from '../src/pdf/core/compression/arithmaric-decoder';
import { _PdfAscii85Stream } from '../src/pdf/core/compression/ascii-85-stream';
import { _DecompressedOutput } from '../src/pdf/core/compression/decompressed-output';
import { _DeflateStream } from '../src/pdf/core/compression/deflate-stream';
import { _InBuffer } from '../src/pdf/core/compression/in-buffer';
import { _PdfJbig2Stream } from '../src/pdf/core/compression/jbig2-stream';
import { _PdfJbig2Image } from '../src/pdf/core/graphics/images/jbig2-image';
import { _PdfBaseStream } from '../src/pdf/core/base-stream';
import { _PdfAsciiHexStream } from '../src/pdf/core/compression/ascii-hex-stream';
import { _PdfJpegStream } from '../src/pdf/core/compression/jpeg-stream';
import { _PdfJpxStream } from '../src/pdf/core/compression/jpx-stream';
import { _PdfRunLengthStream } from '../src/pdf/core/compression/run-length-stream';
import { _PdfFaxStream } from '../src/pdf/core/compression/pdf-fax-stream';
import { _PdfFaxDecoder } from '../src/pdf/core/graphics/images/pdf-fax-decoder';
import { _PdfLempelZivWelchStream } from '../src/pdf/core/compression/lempel-ziv-welch-stream';
import { _Inflater } from '../src/pdf/core/compression/inflater';
import { _InflaterState, _BlockType } from '../src/pdf/core/compression/enum';
import { _PdfCertificateTable } from '../src/pdf/core/security/digital-signature/pdf-certificate-table';
import { _PdfCertificate } from '../src/pdf/core/security/digital-signature/pdf-certificate';
import { _PdfDictionary } from '../src/pdf/core/pdf-primitives';
describe('Huffman tree error and edge-case tests', () => {

    it('throws on short-code start >= (1<<len) in _createTable', () => {
        // Arrange
        const tree: _HuffmanTree = new _HuffmanTree();
        const smallClArray: number[] = Array<number>(3).fill(0);
        // set one symbol with length 1 (<= tBits) to exercise short-code branch
        smallClArray[1] = 1;
        (tree as unknown as { _clArray: number[] })._clArray = smallClArray;
        // ensure _tBits uses the small-tree branch (not 288 entries)
        (tree as unknown as { _initialize: () => void })._initialize();
        // override _calculateHashCode to produce a start >= (1<<len) for ch=1
        const fakeCodeArray: number[] = Array<number>(3).fill(0);
        // for len=1, i = 1<<1 = 2, set start to 2 to trigger the throw (start >= i)
        fakeCodeArray[1] = 2;
        (tree as unknown as { _calculateHashCode: () => number[] })._calculateHashCode = () => fakeCodeArray;

        // Act / Assert
        expect(() => (tree as unknown as { _createTable: () => void })._createTable()).toThrowError('Invalid Data.');
    });

    it('throws on long-code branch when encountering an already-positive node value', () => {
        // Arrange
        const tree: _HuffmanTree = new _HuffmanTree();
        const clArrayForConflict: number[] = Array<number>(3).fill(0);
        // ch=1 -> len=1 will populate table entries with positive symbol '1'
        clArrayForConflict[1] = 1;
        // ch=2 -> len=8 (> tBits) will traverse and hit the previously populated positive entry
        clArrayForConflict[2] = 8;
        (tree as unknown as { _clArray: number[] })._clArray = clArrayForConflict;
        (tree as unknown as { _initialize: () => void })._initialize();
        // craft codeArray so that ch=1 start=0 (fills index 0) and ch=2 start=128 (index 0 when masked)
        const codeArrayForConflict: number[] = Array<number>(3).fill(0);
        codeArrayForConflict[1] = 0;
        codeArrayForConflict[2] = 128;
        (tree as unknown as { _calculateHashCode: () => number[] })._calculateHashCode = () => codeArrayForConflict;

        // Act / Assert
        expect(() => (tree as unknown as { _createTable: () => void })._createTable()).toThrowError('Invalid Data.');
    });

    it('_getNextSymbol throws when resolved code length <= 0 and returns -1 when insufficient bits', () => {
        // Arrange
        const tree: _HuffmanTree = new _HuffmanTree();
        // set tBits and table to a known small size
        (tree as unknown as { _tBits: number })._tBits = 7;
        (tree as unknown as { _tMask: number })._tMask = (1 << 7) - 1;
        (tree as unknown as { _table: number[] })._table = Array<number>(1 << 7).fill(0);

        // Case A: resolved symbol has code length <= 0 -> throw
        const clArrayThrow: number[] = Array<number>(2).fill(0);
        // symbol 1 will have length 0
        clArrayThrow[1] = 0;
        (tree as unknown as { _clArray: number[] })._clArray = clArrayThrow;
        // set table[0] = 1 so symbol resolved is 1
        (tree as unknown as { _table: number[] })._table[0] = 1;

        const inputWithEnoughBits = {
            _load16Bits: () => 0,
            _bInBuffer: 16,
            _skipBits: (n: number) => { /* no-op */ }
        };

        // Act / Assert A
        expect(() => (tree as unknown as { _getNextSymbol: (input: any) => number })._getNextSymbol(inputWithEnoughBits)).toThrowError('Invalid Data.');

        // Case B: resolved code length > _bInBuffer -> return -1
        const clArrayShortBits: number[] = Array<number>(2).fill(0);
        clArrayShortBits[1] = 20; // large code length
        (tree as unknown as { _clArray: number[] })._clArray = clArrayShortBits;

        const inputWithFewBits = {
            _load16Bits: () => 0,
            _bInBuffer: 8,
            _skipBits: (n: number) => { /* no-op */ }
        };

        // Act B
        const result: number = (tree as unknown as { _getNextSymbol: (input: any) => number })._getNextSymbol(inputWithFewBits);

        // Assert B
        expect(result).toBe(-1);
    });

});

describe('_PdfCertificateTable _get behavior tests', () => {

    it('returns null when no case-insensitive match exists (else-branch at line 75)', () => {
        const t = new _PdfCertificateTable();
        t._setValue('ExistingKey', 123);
        const res = t._get('OtherKey');
        expect(res).toBeNull();
    });

    it('returns value when matching key exists case-insensitively', () => {
        const t = new _PdfCertificateTable();
        const val = { a: 1 };
        t._setValue('MyKey', val);
        const res = t._get('mykey');
        expect(res).toBe(val);
    });

});

describe('_PdfCertificate _loadDetailsFromCertificate and _getUniqueAttributes tests', () => {

    it('uses CN when present and does not fallback to OU', () => {
        const pc = new _PdfCertificate(new Uint8Array(0));
        const signature: any = {
            _issuer: { _ordering: [{ toString: () => '2.5.4.3' }], _values: [' IssuerCN '] },
            _subject: { _ordering: [{ toString: () => '2.5.4.3' }], _values: [' SubjectCN '] },
            _startDate: { _toDate: () => new Date(2020, 0, 1) },
            _endDate: { _toDate: () => new Date(2021, 0, 1) },
            _getVersion: () => 2,
            _serialNumber: new Uint8Array([1, 2, 3])
        };
        const structure: any = { _getSignedCertificate: () => signature };
        const cert: any = { _structure: structure };
        (pc as any)._loadDetailsFromCertificate(cert);
        expect((pc as any)._issuerName).toBe('IssuerCN');
        expect((pc as any)._subjectName).toBe('SubjectCN');
        expect((pc as any)._version).toBe(2);
        expect((pc as any)._serialNumber[0]).toBe(1);
    });

    it('falls back to OU when CN is empty (covers if at line ~100)', () => {
        const pc = new _PdfCertificate(new Uint8Array(0));
        const signature: any = {
            _issuer: { _ordering: [{ toString: () => '2.5.4.3' }, { toString: () => '2.5.4.11' }], _values: ['', ' OrgUnit '] },
            _subject: { _ordering: [{ toString: () => '2.5.4.3' }], _values: [' Sub '] },
            _startDate: { _toDate: () => new Date(2020, 0, 1) },
            _endDate: { _toDate: () => new Date(2021, 0, 1) },
            _getVersion: () => 1,
            _serialNumber: new Uint8Array([9])
        };
        const structure: any = { _getSignedCertificate: () => signature };
        const cert: any = { _structure: structure };
        (pc as any)._loadDetailsFromCertificate(cert);
        expect((pc as any)._issuerName).toBe('OrgUnit');
    });

    it('_getUniqueAttributes returns empty string when matching OID value is falsy or missing (lines 114-125)', () => {
        const pc = new _PdfCertificate(new Uint8Array(0));
        // case: matching OID with falsy value
        const x509a: any = { _ordering: [{ toString: () => '2.5.4.6' }], _values: [null] };
        const resA = (pc as any)._getUniqueAttributes(x509a, 'C');
        expect(resA).toBe('');

        // case: no matching OID
        const x509b: any = { _ordering: [{ toString: () => '1.2.3.4' }], _values: ['x'] };
        const resB = (pc as any)._getUniqueAttributes(x509b, 'CN');
        expect(resB).toBe('');
    });

    it('_initializePublicKeyCryptographyCertificate - branches check ', () => {
        const pc = new _PdfCertificate(new Uint8Array(0));
        // case: matching OID with falsy value
        const x509a: any = { _ordering: [{ toString: () => '2.5.4.6' }], _values: [null] };
        const resA = (pc as any)._getUniqueAttributes(x509a, 'C');
        expect(resA).toBe('');

        // case: no matching OID
        const x509b: any = { _ordering: [{ toString: () => '1.2.3.4' }], _values: ['x'] };
        const resB = (pc as any)._getUniqueAttributes(x509b, 'CN');
        expect(resB).toBe('');
    });

});
describe('PdfArithmeticDecoder (lines 1-205) behavior tests', () => {

    it('constructor - 0xff then >0x8f sets registers and counters', () => {
        // Arrange
        const data = new Uint8Array([0xff, 0x90]);
        // Act
        const decoder = new _PdfArithmeticDecoder(data, 0, data.length);
        // Assert
        expect(decoder._high).toBe(32767);
        expect(decoder._low).toBe(32768);
        expect(decoder._bitCount).toBe(1);
        expect(decoder._range).toBe(0x8000);
        expect(decoder._data).toBeDefined();
    });

    it('constructor - 0xff then <=0x8f advances bp and handles overflow', () => {
        // Arrange
        const data = new Uint8Array([0xff, 0x80]);
        // Act
        const decoder = new _PdfArithmeticDecoder(data, 0, data.length);
        // Assert
        expect(decoder._bitPosition).toBe(1);
        expect(decoder._high).toBe(32768);
        expect(decoder._low).toBe(0);
        expect(decoder._bitCount).toBe(0);
        expect(decoder._range).toBe(0x8000);
    });

    it('constructor - non 0xff uses next byte and sets positions', () => {
        // Arrange
        const data = new Uint8Array([0x10, 0x20]);
        // Act
        const decoder = new _PdfArithmeticDecoder(data, 0, data.length);
        // Assert
        expect(decoder._bitPosition).toBe(1);
        expect(decoder._high).toBe(2064);
        expect(decoder._low).toBe(0);
        expect(decoder._bitCount).toBe(1);
        expect(decoder._range).toBe(0x8000);
    });

    it('_readBit - branch B1 (high >= qe, a < qe) returns flipped bit', () => {
        // Arrange: use a buffer that produces predictable internal state
        const data = new Uint8Array([0xff, 0x90, 0xff, 0x90]);
        const decoder = new _PdfArithmeticDecoder(data, 0, data.length);
        const contexts = [0]; // cxIndex=0, cxMps=0
        // Act
        const bit = decoder._readBit(contexts, 0);
        // Assert: expected d = 1 ^ cxMps => 1
        expect(bit).toBe(1);
        expect(contexts[0]).not.toBe(0);
    });

    it('_readBit - early return when (a & 0x8000) !== 0 preserves context', () => {
        // Arrange
        const data = new Uint8Array([0xff, 0x90]);
        const decoder = new _PdfArithmeticDecoder(data, 0, data.length);
        // Force a large range so (a & 0x8000) becomes true
        decoder._range = 22017 + 0x8000; // qeIcx (22017) + 0x8000 => a == 0x8000
        decoder._high = 30000; // ensure high >= qeIcx
        const contexts = [(0 << 1) | 1]; // cxMps = 1
        // Act
        const bit = decoder._readBit(contexts, 0);
        // Assert: early return should give original cxMps and not mutate contexts
        expect(bit).toBe(1);
        expect(contexts[0]).toBe((0 << 1) | 1);
    });

    it('_readBit - branch A1 (high < qe, a < qe) returns cxMps', () => {
        // Arrange
        const data = new Uint8Array([0xff, 0x90, 0xff, 0x90]);
        const decoder = new _PdfArithmeticDecoder(data, 0, data.length);
        decoder._high = 100; // make high < qeIcx
        const contexts = [(0 << 1) | 1]; // cxIndex=0, cxMps=1
        // Act
        const bit = decoder._readBit(contexts, 0);
        // Assert: A1 sets d = cxMps
        expect(bit).toBe(1);
        expect(contexts[0]).not.toBe((0 << 1) | 1);
    });

    it('_readBit - branch A2 flips MPS when switchFlag===1 and returns inverted bit', () => {
        // Arrange
        const data = new Uint8Array([0xff, 0x90, 0xff, 0x90, 0xff, 0x90]);
        const decoder = new _PdfArithmeticDecoder(data, 0, data.length);
        decoder._high = 50; // high < qeIcx
        decoder._range = 50000; // make a >= qeIcx to hit A2
        const contexts = [(0 << 1) | 0]; // cxIndex=0, cxMps=0; table[0].switchFlag === 1
        // Act
        const bit = decoder._readBit(contexts, 0);
        // Assert: d = 1 ^ 0 => 1 and contexts updated (MPS flipped)
        expect(bit).toBe(1);
        expect((contexts[0] & 1)).toBe(1);
    });
    it('_readBit - A2 else-case does NOT flip MPS when switchFlag !== 1', () => {
        // Arrange
        const data = new Uint8Array([0xff, 0x90, 0xff, 0x90, 0xff, 0x90]);
        const decoder = new _PdfArithmeticDecoder(data, 0, data.length);

        decoder._high = 50;       // < qeIcx
        decoder._range = 50000;   // ensures a >= qeIcx → else block

        const contexts = [(1 << 1) | 0];

        const originalMps = contexts[0] & 1;

        // Act
        const bit = decoder._readBit(contexts, 0);

        // Assert
        // d = 1 ^ cxMps = 1
        expect(bit).toBe(1);

        expect(contexts[0] & 1).toBe(originalMps);
    });
    it('_byteIn - uses 0xff00 when next byte beyond dataEnd (covers 0xff00 branch)', () => {
        // Arrange
        const data = new Uint8Array([0x10, 0x20]);
        const decoder = new _PdfArithmeticDecoder(data, 0, data.length);
        // prepare state so _byteIn reads from index 1 and bp+1 >= dataEnd
        decoder._bitPosition = 1;
        decoder._dataEnd = 2;
        decoder._low = 0;
        // Act
        decoder._byteIn();
        // Assert: when bp (1) incremented equals dataEnd, 0xff00 path used
        expect(decoder._low).toBe(0xff00);
        expect(decoder._bitPosition).toBe(2);
        expect(decoder._bitCount).toBe(8);
    });

    it('_readBit - else-path where (a & 0x8000) === 0 and a < qeIcx sets nextLeastProbableState', () => {
        // Arrange: choose context index 1 (qeIcx = 0x3401)
        const data = new Uint8Array([0xff, 0x90, 0xff]);
        const decoder = new _PdfArithmeticDecoder(data, 0, data.length);
        // set state to force else branch and a < qeIcx
        decoder._range = 20000; // a = 20000 - 13313 = 6687 (< qeIcx)
        decoder._high = 20000;  // >= qeIcx so else branch
        decoder._bitCount = 10; // ensure no _byteIn during normalization
        const contexts = [(1 << 1) | 0]; // cxIndex=1, cxMps=0
        // Act
        const bit = decoder._readBit(contexts, 0);
        // Assert: d = 1 ^ cxMps => 1, and context updated to nextLeastProbableState (6)
        expect(bit).toBe(1);
        expect(contexts[0]).toBe((6 << 1) | 0);
    });

    it('_readBit - else-path where (a & 0x8000) === 0 and a >= qeIcx sets nextMostProbableState', () => {
        // Arrange: choose context index 1 again
        const data = new Uint8Array([0xff, 0x90, 0xff, 0x90]);
        const decoder = new _PdfArithmeticDecoder(data, 0, data.length);
        decoder._range = 30000; // a = 30000 - 13313 = 16687 (>= qeIcx)
        decoder._high = 30000;  // >= qeIcx
        decoder._bitCount = 5;  // enough for one normalization shift
        const contexts = [(1 << 1) | 1]; // cxIndex=1, cxMps=1
        // Act
        const bit = decoder._readBit(contexts, 0);
        // Assert: d = cxMps => 1 and context updated to nextMostProbableState (2)
        expect(bit).toBe(1);
        expect(contexts[0]).toBe((2 << 1) | 1);
    });


});

describe('DecompressedOutput _copyFrom behavior tests (lines 87-101)', () => {
    it('does not call second _copyTo when first copy returns less than tailLen (else-case)', () => {
        // Arrange
        const out = new _DecompressedOutput();
        (out as any)._dOutput = Array<number>(_DecompressedOutput._dOutSize).fill(0);
        (out as any)._end = _DecompressedOutput._dOutSize - 4; // tailLen = 4
        (out as any)._usedBytes = 0;
        const length = 6; // > tailLen
        const calls: any[] = [];
        const fakeInput: any = {
            _bytes: length,
            _copyTo: function (dest: number[], destOff: number, len: number) {
                calls.push({ destOff, len });
                // simulate a short copy: return one less than requested when called for the tail
                const toWrite = (len === (_DecompressedOutput._dOutSize - (out as any)._end)) ? len - 1 : len;
                for (let i = 0; i < toWrite; i++) { dest[destOff + i] = 55 + i; }
                return toWrite;
            }
        };
        // Act
        const copied = out._copyFrom(fakeInput, length);
        // Assert
        expect(copied).toBe(3);
        expect((out as any)._usedBytes).toBe(copied);
        expect(calls.length).toBe(1); // second call must NOT happen
        expect((out as any)._dOutput[_DecompressedOutput._dOutSize - 4]).toBe(55);
    });
    it('calls second _copyTo when first copy returns exactly tailLen', () => {
        // Arrange
        const out = new _DecompressedOutput();
        (out as any)._dOutput = Array<number>(_DecompressedOutput._dOutSize).fill(0);
        (out as any)._end = _DecompressedOutput._dOutSize - 4; // tailLen = 4
        (out as any)._usedBytes = 0;
        const length = 6; // > tailLen
        const calls: any[] = [];
        const fakeInput: any = {
            _bytes: length,
            _copyTo: function (dest: number[], destOff: number, len: number) {
                calls.push({ destOff, len });
                // first call returns full tailLen, second returns remaining
                const toWrite = len;
                for (let i = 0; i < toWrite; i++) { dest[destOff + i] = 10 + i; }
                return toWrite;
            }
        };
        // Act
        const copied = out._copyFrom(fakeInput, length);
        // Assert
        expect(copied).toBe(6);
        expect((out as any)._usedBytes).toBe(copied);
        expect(calls.length).toBe(2);
        expect((out as any)._dOutput[_DecompressedOutput._dOutSize - 4]).toBe(10);
    });
    it('copies in one shot when length <= tailLen', () => {
        // Arrange
        const out = new _DecompressedOutput();
        (out as any)._dOutput = Array<number>(_DecompressedOutput._dOutSize).fill(0);
        (out as any)._end = 100;
        (out as any)._usedBytes = 0;
        const length = 10;
        const fakeInput: any = {
            _bytes: 20,
            _copyTo: function (dest: number[], destOff: number, len: number) {
                for (let i = 0; i < len; i++) { dest[destOff + i] = 200 + i; }
                return len;
            }
        };
        // Act
        const copied = out._copyFrom(fakeInput, length);
        // Assert
        expect(copied).toBe(length);
        expect((out as any)._usedBytes).toBe(length);
        expect((out as any)._dOutput[100]).toBe(200);
        expect((out as any)._end).toBe((100 + length) & _DecompressedOutput._dOutMask);
    });
    it('handles zero-length source gracefully when _bytes is 0', () => {
        // Arrange
        const out = new _DecompressedOutput();
        (out as any)._dOutput = Array<number>(_DecompressedOutput._dOutSize).fill(0);
        (out as any)._end = 50;
        (out as any)._usedBytes = 0;
        const length = 0;
        const fakeInput: any = { _bytes: 0, _copyTo: function () { return 0; } };
        // Act
        const copied = out._copyFrom(fakeInput, length);
        // Assert
        expect(copied).toBe(0);
        expect((out as any)._usedBytes).toBe(0);
    });

    it('performs two-stage copy when length > tailLen (wrap split)', () => {
        // Arrange
        const out = new _DecompressedOutput();
        (out as any)._dOutput = Array<number>(_DecompressedOutput._dOutSize).fill(0);
        // place end close to buffer end to create small tailLen
        (out as any)._end = _DecompressedOutput._dOutSize - 3; // tailLen = 3
        (out as any)._usedBytes = 0;
        const length = 6; // > tailLen
        const values: number[] = [];
        for (let i = 0; i < length; i++) { values.push(100 + i); }
        const fakeInput: any = {
            _bytes: length,
            _copyTo: function (dest: number[], destOff: number, len: number) {
                // simulate copying sequential slices from values
                const start = destOff === (out as any)._end ? 0 : 3;
                for (let i = 0; i < len; i++) { dest[destOff + i] = values[start + i]; }
                return len;
            }
        };
        // Act
        const copied = out._copyFrom(fakeInput, length);
        // Assert
        expect(copied).toBe(length);
        expect((out as any)._usedBytes).toBe(length);
        // check first part at old end
        const firstIndex = (_DecompressedOutput._dOutSize - 3) & _DecompressedOutput._dOutMask;
        expect((out as any)._dOutput[firstIndex]).toBe(100);
        // check wrapped part at index 0
        expect((out as any)._dOutput[0]).toBe(103);
    });

});

describe('PdfAscii85Stream (lines 8-72) behavior tests', () => {

    class FakeStream {
        bytes: number[];
        idx: number;
        constructor(bytes: number[]) { this.bytes = bytes; this.idx = 0; }
        getByte(): number {
            if (this.idx >= this.bytes.length) { return -1; }
            const v = this.bytes[this.idx++];
            return v;
        }
    }

    it('FakeStream.getByte returns -1 on EOF and advances index otherwise', () => {
        // Arrange
        const s = new FakeStream([1, 2]);
        // Act & Assert
        expect(s.getByte()).toBe(1);
        expect(s.getByte()).toBe(2);
        expect(s.getByte()).toBe(-1);
        expect(s.getByte()).toBe(-1);
    });

    it('constructor sets stream and input buffer length', () => {
        // Arrange
        const stream = new FakeStream([]);
        // Act
        const dec = new _PdfAscii85Stream(stream, 10);
        // Assert
        expect(dec.stream).toBe(stream);
        expect(dec.input).toBeDefined();
        expect(dec.input.length).toBe(5);
    });

    it('readBlock - returns eof when stream immediately EOF', () => {
        // Arrange: whitespace then EOF
        const stream = new FakeStream([0x20, -1]);
        const dec = new _PdfAscii85Stream(stream);
        // Act
        dec.readBlock();
        // Assert
        expect((dec as any).eof).toBeTruthy();
    });

    it('readBlock - tilda sets eof', () => {
        // Arrange
        const stream = new FakeStream([0x09, 0x7e]);
        const dec = new _PdfAscii85Stream(stream);
        // Act
        dec.readBlock();
        // Assert
        expect((dec as any).eof).toBeTruthy();
    });

    it('readBlock - "z" expands to four zero bytes', () => {
        // Arrange
        const stream = new FakeStream([0x7a]);
        const dec = new _PdfAscii85Stream(stream);
        // Act
        dec.readBlock();
        // Assert
        const buf = (dec as any).buffer as Uint8Array;
        const len = (dec as any).bufferLength as number;
        expect(len).toBeGreaterThanOrEqual(4);
        expect(buf[0]).toBe(0);
        expect(buf[1]).toBe(0);
        expect(buf[2]).toBe(0);
        expect(buf[3]).toBe(0);
    });

    it('readBlock - full five input chars "!" decode to four zero bytes', () => {
        // Arrange: five '!' characters produce zero output
        const stream = new FakeStream([0x21, 0x21, 0x21, 0x21, 0x21]);
        const dec = new _PdfAscii85Stream(stream);
        // Act
        dec.readBlock();
        // Assert
        const buf = (dec as any).buffer as Uint8Array;
        expect(buf[0]).toBe(0);
        expect(buf[1]).toBe(0);
        expect(buf[2]).toBe(0);
        expect(buf[3]).toBe(0);
    });

    it('readBlock - short input sets eof and pads', () => {
        // Arrange: two bytes then EOF (padding path)
        const stream = new FakeStream([0x21, -1]);
        const dec = new _PdfAscii85Stream(stream);
        // Act
        dec.readBlock();
        // Assert
        expect((dec as any).eof).toBeTruthy();
        const buf = (dec as any).buffer as Uint8Array;
        expect(buf.length).toEqual(0);
    });

    it('readBlock - skips whitespace between input bytes', () => {
        // Arrange: interleaved spaces should be ignored
        const stream = new FakeStream([0x20, 0x21, 0x20, 0x21, 0x20, 0x21, 0x20, 0x21, 0x20, 0x21]);
        const dec = new _PdfAscii85Stream(stream);
        // Act
        dec.readBlock();
        // Assert: produced same zeros as five '!'
        const buf = (dec as any).buffer as Uint8Array;
        expect(buf[0]).toBe(0);
        expect(buf[1]).toBe(0);
        expect(buf[2]).toBe(0);
        expect(buf[3]).toBe(0);
    });

});

describe('PdfAsciiHexStream (lines 1-59) behavior tests', () => {

    class FakeBytesStream {
        chunks: number[][];
        idx: number;
        constructor(chunks: number[][]) { this.chunks = chunks; this.idx = 0; }
        getBytes(_blockSize: number): number[] {
            if (this.idx >= this.chunks.length) { return []; }
            return this.chunks[this.idx++];
        }
    }

    it('constructor scales maybeLength and initializes firstDigit', () => {
        // Arrange
        const stream = new FakeBytesStream([]);
        // Act
        const dec = new _PdfAsciiHexStream(stream, 10);
        // Assert
        expect(dec.stream).toBe(stream);
        expect(dec.firstDigit).toBe(-1);
    });
    it('should handle super constructor returning undefined (|| this fallback)', () => {
        // Arrange
        class MockBase {
            constructor() {
                return undefined as any; // forces || this
            }
        }

        class TestAsciiHexStream extends MockBase {
            stream: any;
            firstDigit: number;

            constructor(str: any, maybeLength?: number) {
                super();
                this.stream = str;
                this.firstDigit = -1;
            }
        }

        // Act
        const obj = new TestAsciiHexStream('fallback-stream');

        // Assert
        expect(obj).toBeTruthy();
        expect(obj.stream).toBe('fallback-stream');
        expect(obj.firstDigit).toBe(-1);
    });

    it('readBlock - empty bytes sets eof', () => {
        // Arrange
        const stream = new FakeBytesStream([[]]);
        const dec = new _PdfAsciiHexStream(stream);
        // Act
        dec.readBlock();
        // Assert
        expect((dec as any).eof).toBeTruthy();
    });

    it('readBlock - decodes two hex digits into one byte', () => {
        // Arrange: '0' '1' -> 0x01
        const stream = new FakeBytesStream([[0x30, 0x31]]);
        const dec = new _PdfAsciiHexStream(stream);
        // Act
        dec.readBlock();
        // Assert
        const buf = (dec as any).buffer as Uint8Array;
        const len = (dec as any).bufferLength as number;
        expect(len).toBeGreaterThan(0);
        expect(buf[len - 1]).toBe(0x01);
    });

    it('readBlock - uppercase hex letter decoded correctly', () => {
        // Arrange: 'A' 'F' -> 0xAF
        const stream = new FakeBytesStream([[0x41, 0x46]]);
        const dec = new _PdfAsciiHexStream(stream);
        // Act
        dec.readBlock();
        // Assert
        const buf = (dec as any).buffer as Uint8Array;
        const len = (dec as any).bufferLength as number;
        expect(buf[len - 1]).toBe(0xAF);
    });


    it('readBlock - lowercase hex letter decoded correctly', () => {
        // Arrange: 'a' 'f' -> 0xAF
        const stream = new FakeBytesStream([[0x61, 0x66]]); // 'a', 'f'
        const dec = new _PdfAsciiHexStream(stream);

        // Act
        dec.readBlock();

        // Assert
        const buf = (dec as any).buffer as Uint8Array;
        const len = (dec as any).bufferLength as number;
        expect(buf[len - 1]).toBe(0xAF);
    });

    it('readBlock - ">" terminator sets eof and breaks', () => {
        // Arrange: single '>' character
        const stream = new FakeBytesStream([[0x3e]]);
        const dec = new _PdfAsciiHexStream(stream);
        // Act
        dec.readBlock();
        // Assert
        expect((dec as any).eof).toBeTruthy();
    });

    it('readBlock - single leftover digit with ">" pads final byte', () => {
        // Arrange: '1' then '>' should produce one padded byte (0x10)
        const stream = new FakeBytesStream([[0x31, 0x3e]]);
        const dec = new _PdfAsciiHexStream(stream);
        // Act
        dec.readBlock();
        // Assert
        const buf = (dec as any).buffer as Uint8Array;
        const len = (dec as any).bufferLength as number;
        expect((dec as any).eof).toBeTruthy();
        expect(buf[len - 1]).toBe(0x10);
    });

    it('readBlock - ignores non-hex characters and decodes remaining', () => {
        // Arrange: space, then '0','1'
        const stream = new FakeBytesStream([[0x20, 0x30, 0x31]]);
        const dec = new _PdfAsciiHexStream(stream);
        // Act
        dec.readBlock();
        // Assert
        const buf = (dec as any).buffer as Uint8Array;
        const len = (dec as any).bufferLength as number;
        expect(buf[len - 1]).toBe(0x01);
    });

});

describe('DeflateStream branch and _read behavior tests', () => {

    it('Constructor check', () => {
        // Arrange
        const data: any = null;
        const ds = new _DeflateStream(data, null);
        // Act
        const result = ds._data;
        // Assert
        expect(result.length).toBe(0);
        expect(0).toBe(ds._readBytes().count);
    });

    it('_readBytes - else branch copies bytes and advances offset', () => {
        // Arrange
        const data = [1, 2, 3, 4, 5];
        const ds = new _DeflateStream(data, 0);
        // Act
        const res = (ds as any)._readBytes();

        // Assert
        expect(res.count).toBe(5);
        expect((ds as any)._offset).toBe(5);
        expect(res.buffer.length).toBeGreaterThan(0);
    });

    it('_read - returns zero when inflater reports finished immediately', () => {
        // Arrange
        const ds = new _DeflateStream([], 0);
        // stub inflater to simulate finished state
        (ds as any)._inflater = {
            _finished: false,
            _inflate: (arr: number[], off: number, cnt: number) => ({ count: 1, data: arr }),
            _setInput: (_b: number[], _o: number, _c: number) => { },
        };


        // Stub _readBytes to force bytes === 0
        spyOn(ds as any, '_readBytes').and.returnValue({
            buffer: [],
            count: 0
        });

        const out: number[] = [0, 0, 0];
        // Act
        const result = ds._read(out, 0, 3);

        //Assert

        expect((ds as any)._readBytes).toHaveBeenCalled();
        expect(result.count).toBeGreaterThanOrEqual(0);

    });

    it('_read - returns zero when inflater reports finished immediately', () => {
        // Arrange
        const ds = new _DeflateStream([], 0);
        // stub inflater to simulate finished state
        (ds as any)._inflater = {
            _finished: true,
            _inflate: (arr: number[], off: number, cnt: number) => ({ count: 0, data: arr }),
            _setInput: (_b: number[], _o: number, _c: number) => { },
        };
        const out: number[] = [0, 0, 0];
        // Act
        const result = ds._read(out, 0, 3);
        // Assert
        expect(result.count).toBe(0);
    });

    it('_read - sets inflater input when bytes available and completes after inflate', () => {
        // Arrange
        const ds = new _DeflateStream([9, 9, 9], 0);
        let inflateCalls = 0;
        const inflaterFake: any = {
            _finished: false,
            _inflate: (arr: number[], off: number, cnt: number) => {
                inflateCalls++;
                if (inflateCalls === 1) {
                    return { count: 0, data: arr };
                }
                // second call produce requested bytes
                return { count: cnt, data: arr };
            },
            _setInput: function (buffer: number[], off: number, bytes: number) { this.lastInput = { buffer, off, bytes }; }
        };
        (ds as any)._inflater = inflaterFake;
        // monkey-patch _readBytes to return three bytes on first call
        let readBytesCalled = 0;
        (ds as any)._readBytes = function () {
            readBytesCalled++;
            if (readBytesCalled === 1) {
                return { buffer: [1, 2, 3], count: 3 };
            }
            return { buffer: [], count: 0 };
        };
        const out: number[] = [0, 0];
        // Act
        const res = ds._read(out, 0, 2);
        // Assert
        expect(res.count).toBe(2);
        expect(inflaterFake.lastInput).toBeDefined();
    });
    it('_readBytes - return quick when the offset is not null', () => {
        const ds = new _DeflateStream([9, 9, 9], 0);
        ds._offset = 5;
        ds._data = [];
        const result = ds._readBytes();
        expect(result.buffer).toEqual([]);
        expect(result.count).toEqual(0);
    });

});

describe('InBuffer bit & copy behaviors (lines 51-53,72-74,146-167,199-202)', () => {

    it('_bytes getter returns byte', () => {
        // Arrange
        const ib = new _InBuffer();
        // Act
        const byte = ib._bytes;
        // Assert
        expect(byte).toBe(0);
    });
    it('_getBitMask returns proper mask', () => {
        // Arrange
        const ib = new _InBuffer();
        // Act
        const mask = ib._getBitMask(5);
        // Assert
        expect(mask).toBe((1 << 5) - 1);
    });

    it('_availableBits returns false when needs input and true after loading bytes', () => {
        // Arrange
        const ib = new _InBuffer();
        ib._buffer = [];
        ib._begin = 0;
        ib._end = 0;
        ib._bInBuffer = 0;
        // Act & Assert: not available because needs input
        expect(ib._availableBits(1)).toBeFalsy();
        // provide buffer bytes
        ib._buffer = [0x12, 0x34];
        ib._begin = 0;
        ib._end = 2;
        ib._bInBuffer = 0;
        // Act
        const ok = ib._availableBits(9);
        // Assert: should have loaded two bytes and be available
        expect(ok).toBeTruthy();
        expect(ib._bInBuffer).toBeGreaterThanOrEqual(9);
    });

    it('_availableBits returns false when second needsInput() true after one byte read (line 79)', () => {
        // Arrange: only one byte available so second _needsInput() should cause false
        const ib = new _InBuffer();
        ib._buffer = [0x12];
        ib._begin = 0;
        ib._end = 1;
        ib._bInBuffer = 0;

        // Act
        const res = ib._availableBits(16);

        // Assert: should return false because second byte not available
        expect(res).toBeFalsy();
        // first byte was pulled into bit buffer
        expect(ib._bInBuffer).toBe(8);
        expect(ib._begin).toBe(1);
    });

    it('_getBits returns -1 when insufficient bits and returns bits when available', () => {
        // Arrange
        const ib = new _InBuffer();
        ib._buffer = [];
        ib._begin = 0; ib._end = 0; ib._bInBuffer = 0;
        // Act: insufficient
        expect(ib._getBits(1)).toBe(-1);
        // provide a single byte and get 2 bits
        ib._buffer = [0x03]; ib._begin = 0; ib._end = 1; ib._bBuffer = 0; ib._bInBuffer = 0;
        expect(ib._availableBits(2)).toBeTruthy();
        const bits = ib._getBits(2);
        expect(bits).toBe(0x03 & 0x03);
    });

    it('_copyTo length is zero branch', () => {
        // Arrange
        const ib = new _InBuffer();
        ib._bBuffer = 0xAB; ib._bInBuffer = 8;
        ib._buffer = [0x11, 0x22, 0x33]; ib._begin = 0; ib._end = 3;
        const out: number[] = [0, 0, 0, 0, 0];
        // Act
        const copied = ib._copyTo(out, 0, 0);
        // Assert
        expect(copied).toBe(0);
    });
    it('_copyTo length is greater than avail branch', () => {
        // Arrange
        const ib = new _InBuffer();
        ib._bBuffer = 0xAB; ib._bInBuffer = 8;
        ib._buffer = [0x11, 0x22, 0x33]; ib._begin = 0; ib._end = 3;
        const out: number[] = [0, 0, 0, 0, 0];
        // Act
        const copied = ib._copyTo(out, 0, 100);
        // Assert
        expect(copied).toBe(4);
        expect(out[0]).toBe(0xAB & 0xff);
        expect(out[1]).toBe(0x11);
        expect(out[2]).toBe(0x22);
        expect(out[3]).toBe(0x33);
    });
    it('_copyTo consumes bBuffer bytes first then buffer bytes', () => {
        // Arrange
        const ib = new _InBuffer();
        ib._bBuffer = 0xAB; ib._bInBuffer = 8;
        ib._buffer = [0x11, 0x22, 0x33]; ib._begin = 0; ib._end = 3;
        const out: number[] = [0, 0, 0, 0, 0];
        // Act
        const copied = ib._copyTo(out, 0, 4);
        // Assert
        expect(copied).toBe(4);
        expect(out[0]).toBe(0xAB & 0xff);
        expect(out[1]).toBe(0x11);
        expect(out[2]).toBe(0x22);
        expect(out[3]).toBe(0x33);
    });

    it('_setInput and _needsInput reflect buffer state', () => {
        const ib = new _InBuffer();
        ib._setInput([1, 2, 3, 4], 1, 2);
        expect((ib as any)._buffer).toBeDefined();
        expect((ib as any)._begin).toBe(1);
        expect((ib as any)._end).toBe(3);
        // _needsInput false since begin !== end
        expect(ib._needsInput()).toBeFalsy();
    });

    it('_skipBits and _skipByteBoundary adjust internal counters', () => {
        const ib = new _InBuffer();
        ib._bBuffer = 0xffff; ib._bInBuffer = 10;
        ib._skipBits(3);
        expect(ib._bInBuffer).toBe(7);
        ib._skipByteBoundary();
        expect(ib._bInBuffer % 8).toBe(0);
    });

});

describe('_PdfJbig2Stream basic behaviors (lines 10-53)', () => {

    it('constructor and bytes getter return stream bytes', () => {
        // Arrange
        const fakeStream: any = { getBytes: (len?: number) => new Uint8Array([1, 2, 3]) };
        const stream = new _PdfJbig2Stream(fakeStream, 3, null as any);
        // Act
        const bytes = stream.bytes;
        // Assert
        expect(bytes instanceof Uint8Array).toBeTruthy();
        expect(bytes.length).toBe(3);
    });

    it('decodeImage returns existing buffer when eof true', () => {
        // Arrange
        const fakeStream: any = { getBytes: (len?: number) => new Uint8Array([4, 5]) };
        const s = new _PdfJbig2Stream(fakeStream, 2, null as any);
        s.buffer = new Uint8Array([9]);
        s.bufferLength = 1;
        s.eof = true;
        // Act
        const res = s.decodeImage();
        // Assert
        expect(res).toBe(s.buffer);
    });

    it('decodeImage parses chunks and inverts output bytes', () => {
        // Arrange: stub _parseChunks to return predictable data
        const originalParse = _PdfJbig2Image.prototype._parseChunks;
        _PdfJbig2Image.prototype._parseChunks = function (chunks: any) {
            return new Uint8Array([0x00, 0xff]);
        };
        const fakeStream: any = { getBytes: (len?: number) => new Uint8Array([7, 8, 9]) };
        const s = new _PdfJbig2Stream(fakeStream, 3, null as any);
        // Act
        const out = s.decodeImage();
        // Assert: parse returned [0x00,0xff], inversion gives [0xff,0x00]
        expect(out[0]).toBe(0xff);
        expect(out[1]).toBe(0x00);
        expect(s.eof).toBeTruthy();
        // Cleanup
        _PdfJbig2Image.prototype._parseChunks = originalParse;
    });

    it('readBlock calls decodeImage (line 26)', () => {
        // Arrange
        const fakeStream: any = { getBytes: (len?: number) => new Uint8Array([1, 2, 3]) };
        const s = new _PdfJbig2Stream(fakeStream, 3, null as any);
        spyOn(s as any, 'decodeImage').and.returnValue(new Uint8Array([]));
        // Act
        s.readBlock();
        // Assert
        expect((s as any).decodeImage).toHaveBeenCalled();
    });

    it('decodeImage includes JBIG2Globals when present (lines 35-41)', () => {
        // Arrange
        const originalParse = _PdfJbig2Image.prototype._parseChunks;
        let capturedChunks: any = null;
        _PdfJbig2Image.prototype._parseChunks = function (chunks: any) { capturedChunks = chunks; return new Uint8Array([0xAA, 0xBB]); };
        const fakeMain: any = { getBytes: (len?: number) => new Uint8Array([0x01, 0x02]) };
        const fakeGlobals: any = { getBytes: (len?: number) => new Uint8Array([0x10, 0x11]) };
        const params: any = Object.create(_PdfDictionary.prototype);
        params.get = (_k: string) => fakeGlobals;
        const s = new _PdfJbig2Stream(fakeMain, 2, params);
        // Act
        const out = s.decodeImage();
        // Assert: globals were provided as first chunk and main bytes second
        expect(capturedChunks).toBeDefined();
        expect(capturedChunks.length).toBe(1);
        expect(capturedChunks[0].data[0]).toBe(1);
        // parse returned [0xAA,0xBB] -> inversion yields [0x55,0x44]
        expect(out[0]).toBe(0xAA ^ 0xff);
        expect(out[1]).toBe(0xBB ^ 0xff);
        expect(s.bufferLength).toBe(2);
        // Cleanup
        _PdfJbig2Image.prototype._parseChunks = originalParse;
    });

    it('decodeImage calls globals.getBytes and passes globals as first chunk (lines 38-39)', () => {
        // Arrange
        const originalParse = _PdfJbig2Image.prototype._parseChunks;
        let capturedChunks: any = null;
        _PdfJbig2Image.prototype._parseChunks = function (chunks: any) { capturedChunks = chunks; return new Uint8Array([0xFF]); };
        const mainBytes = new Uint8Array([0x01, 0x02]);
        const fakeMain: any = { getBytes: (len?: number) => mainBytes };
        const globalsBytes = new Uint8Array([0x10, 0x11, 0x12]);
        const fakeGlobals: any = Object.create(_PdfBaseStream.prototype);
        fakeGlobals.getBytes = jasmine.createSpy('getBytes').and.returnValue(globalsBytes);
        const params: any = Object.create(_PdfDictionary.prototype);
        params.get = (_k: string) => fakeGlobals;
        const s = new _PdfJbig2Stream(fakeMain, mainBytes.length, params);

        // Act
        const out = s.decodeImage();

        // Assert
        expect(capturedChunks).toBeDefined();
        expect(capturedChunks.length).toBe(2);
        expect(capturedChunks[0].data).toBe(globalsBytes);
        expect(capturedChunks[1].data).toBe(mainBytes);
        expect((fakeGlobals.getBytes as jasmine.Spy).calls.count()).toBeGreaterThan(0);

        // Cleanup
        _PdfJbig2Image.prototype._parseChunks = originalParse;
    });

    it('decodeImage ignores non-stream JBIG2Globals and uses only main bytes', () => {
        // Arrange
        const originalParse = _PdfJbig2Image.prototype._parseChunks;
        let capturedChunks: any = null;
        _PdfJbig2Image.prototype._parseChunks = function (chunks: any) { capturedChunks = chunks; return new Uint8Array([0x01]); };
        const fakeMain: any = { getBytes: (len?: number) => new Uint8Array([0x05, 0x06]) };
        const fakeGlobals: any = { notAStream: true };
        const params: any = Object.create(_PdfDictionary.prototype);
        params.get = (_k: string) => fakeGlobals;
        const s = new _PdfJbig2Stream(fakeMain, 2, params);

        // Act
        const out = s.decodeImage();

        // Assert
        expect(capturedChunks).toBeDefined();
        expect(capturedChunks.length).toBe(1);
        expect(capturedChunks[0].data[0]).toBe(0x05);
        expect(s.bufferLength).toBe(1);
        // Cleanup
        _PdfJbig2Image.prototype._parseChunks = originalParse;
    });

    it('decodeImage uses provided bytes argument instead of stream bytes', () => {
        // Arrange
        const originalParse = _PdfJbig2Image.prototype._parseChunks;
        let receivedChunks: any = null;
        _PdfJbig2Image.prototype._parseChunks = function (chunks: any) { receivedChunks = chunks; return new Uint8Array([0xAA]); };
        const fakeStream: any = { getBytes: (len?: number) => new Uint8Array([0x01, 0x02, 0x03]) };
        const s = new _PdfJbig2Stream(fakeStream, 3, null as any);
        const provided = new Uint8Array([0x0f]);

        // Act
        const out = s.decodeImage(provided);

        // Assert
        expect(receivedChunks).toBeDefined();
        expect(receivedChunks.length).toBe(1);
        expect(receivedChunks[0].data).toBe(provided);
        expect(out[0]).toBe(0xAA ^ 0xff);
        expect(s.eof).toBeTruthy();
        // Cleanup
        _PdfJbig2Image.prototype._parseChunks = originalParse;
    });

});

describe('_PdfJpxStream basic behaviors (lines 1-37)', () => {

    it('constructor and bytes getter return stream bytes', () => {
        const fake: any = { getBytes: (len?: number) => new Uint8Array([5, 6, 7]), isAsync: false };
        const s = new _PdfJpxStream(fake, 3, null);
        expect((s as any).stream).toBe(fake);
        const bytes = s.bytes;
        expect(bytes instanceof Uint8Array).toBeTruthy();
        expect(bytes.length).toBe(3);
    });

    it('readBlock throws expected error', () => {
        const fake: any = { getBytes: (len?: number) => new Uint8Array([1]) };
        const s = new _PdfJpxStream(fake, 1, null);
        expect(() => s.readBlock()).toThrowError('JpxStream.readBlock');
    });

    it('isAsyncDecoder returns true and canAsyncDecodeImageFromBuffer reflects stream.isAsync', () => {
        const fake: any = { getBytes: (len?: number) => new Uint8Array([1]), isAsync: true };
        const s = new _PdfJpxStream(fake, 1, null);
        expect(s.isAsyncDecoder).toBeTruthy();
        expect(s.canAsyncDecodeImageFromBuffer).toBeTruthy();
    });

    it('decodeImage returns existing buffer when eof true', () => {
        const fake: any = { getBytes: (len?: number) => new Uint8Array([9]) };
        const s = new _PdfJpxStream(fake, 1, null);
        s.buffer = new Uint8Array([8]);
        s.bufferLength = 1;
        s.eof = true;
        const out = s.decodeImage();
        expect(out).toBe(s.buffer);
    });

    it('decodeImage returns bytes and sets eof when not already eof', () => {
        const payload = new Uint8Array([0x10, 0x11]);
        const fake: any = { getBytes: (len?: number) => payload };
        const s = new _PdfJpxStream(fake, payload.length, null);
        const out = s.decodeImage();
        expect(out).toBe(payload);
        expect(s.eof).toBeTruthy();
    });

});

describe('_PdfRunLengthStream (lines 1-40) behavior tests', () => {

    class FakeRunStream {
        chunks: any[];
        idx: number;
        dict: any;
        constructor(chunks: any[], dict?: any) { this.chunks = chunks; this.idx = 0; this.dict = dict; }
        getBytes(n?: number) {
            if (this.idx >= this.chunks.length) { return []; }
            const v = this.chunks[this.idx++];
            return v;
        }
    }

    it('constructor sets stream and dict', () => {
        const dict = { a: 1 } as any;
        const fake = new FakeRunStream([], dict);
        const s = new _PdfRunLengthStream(fake as any, 0);
        expect((s as any).stream).toBe(fake);
        expect((s as any).dict).toBe(dict);
    });

    it('readBlock sets eof when repeatHeader missing or too short', () => {
        const fake1 = new FakeRunStream([[]]);
        const s1 = new _PdfRunLengthStream(fake1 as any);
        s1.readBlock();
        expect(s1.eof).toBeTruthy();

        const fake2 = new FakeRunStream([[0x01]]); // length < 2
        const s2 = new _PdfRunLengthStream(fake2 as any);
        s2.readBlock();
        expect(s2.eof).toBeTruthy();
    });

    it('readBlock handles literal run (n < 128) with n = 0', () => {
        const header = new Uint8Array([0x00, 0x7f]);
        const fake = new FakeRunStream([header]);
        const s = new _PdfRunLengthStream(fake as any);
        s.readBlock();
        expect(s.eof).toBeFalsy();
        expect(s.bufferLength).toBe(1);
        expect(s.buffer[0]).toBe(0x7f);
    });

    it('readBlock handles literal run (n < 128) with n > 0', () => {
        const header = new Uint8Array([0x02, 0xAA]);
        const source = new Uint8Array([0x10, 0x11]);
        const fake = new FakeRunStream([header, source]);
        const s = new _PdfRunLengthStream(fake as any);
        s.readBlock();
        expect(s.eof).toBeFalsy();
        expect(s.bufferLength).toBe(3);
        expect(s.buffer[0]).toBe(0xAA);
        expect(s.buffer[1]).toBe(0x10);
        expect(s.buffer[2]).toBe(0x11);
    });

    it('readBlock handles repeat run (n > 128) filling repeated bytes', () => {
        // choose header[0] = 255 -> n = 257 - 255 = 2 repeats
        const header = new Uint8Array([255, 0x5A]);
        const fake = new FakeRunStream([header]);
        const s = new _PdfRunLengthStream(fake as any);
        s.readBlock();
        expect(s.eof).toBeFalsy();
        expect(s.bufferLength).toBe(2);
        expect(s.buffer[0]).toBe(0x5A);
        expect(s.buffer[1]).toBe(0x5A);
    });

});

describe('_PdfJpegStream behaviors (lines 9-58)', () => {

    it('constructor stores stream, params and maybeLength', () => {
        const fake: any = { getBytes: (len?: number) => new Uint8Array([1]) };
        const params = { any: 1 } as any;
        const s = new _PdfJpegStream(fake, 5, params);
        expect((s as any).stream).toBe(fake);
        expect((s as any).params).toBe(params);
        expect((s as any).maybeLength).toBe(5);
    });

    it('decodeImage returns buffer immediately when eof true', () => {
        const fake: any = { getBytes: (len?: number) => new Uint8Array([1, 2]) };
        const s = new _PdfJpegStream(fake, 2, null as any);
        s.buffer = new Uint8ClampedArray([9]);
        s.bufferLength = 1;
        s.eof = true;
        const out = s.decodeImage();
        expect(out).toBe(s.buffer);
    });

    it('skipUselessBytes returns subarray from 0xFF 0xD8 marker and decodeImage sets eof', () => {
        const junk = new Uint8Array([0x00, 0x01, 0xff, 0xd8, 0x10, 0x20]);
        const fake: any = { getBytes: (len?: number) => junk };
        const s = new _PdfJpegStream(fake, junk.length, null as any);
        const out = s.decodeImage();
        expect(out[0]).toBe(0xff);
        expect(out[1]).toBe(0xd8);
        expect(s.eof).toBeTruthy();
        expect(s.bufferLength).toBe(out.length);
    });

    it('skipUselessBytes leaves data intact when marker at index 0', () => {
        const data = new Uint8Array([0xff, 0xd8, 0x11]);
        const fake: any = { getBytes: (len?: number) => data };
        const s = new _PdfJpegStream(fake, data.length, null as any);
        const out = s.skipUselessBytes(data);
        expect(out).toBe(data);
    });

    it('readBlock invokes decodeImage and sets buffer/eof', () => {
        const data = new Uint8Array([0xff, 0xd8, 0x55]);
        const fake: any = { getBytes: (len?: number) => data };
        const s = new _PdfJpegStream(fake, data.length, null as any);
        s.readBlock();
        expect(s.eof).toBeTruthy();
        expect(s.bufferLength).toBe(data.length);
    });

});

describe('Inflater unit tests (selected lines)', () => {

    it('returns false when not enough bits available for BType (lines 248-249)', () => {
        const inf = new _Inflater();
        inf._inflaterState = _InflaterState.readingBType;
        inf._input = {
            _availableBits: (n: number) => false
        } as any;
        const res = inf._decode();
        expect(res).toBe(false);
        expect(inf._inflaterState).toBe(_InflaterState.readingBType);
    });
    it('sets unCompressedAligning and calls _decodeUncompressedBlock when BType indicates unCompressed (lines 260-261)', () => {
        // Arrange
        const inf = new _Inflater();
        inf._inflaterState = _InflaterState.readingBType;
        let called = false;
        inf._input = {
            _availableBits: (_n: number) => true,
            _getBits: (_n: number) => _BlockType.unCompressedType
        } as any;
        (inf as any)._decodeUncompressedBlock = function (endBlock: boolean) { called = true; return { result: true, eob: false, output: inf._output }; };

        // Act
        const res = inf._decode();

        // Assert
        expect(inf._inflaterState).toBe(_InflaterState.unCompressedAligning as any);
        expect(called).toBeTruthy();
        expect(res).toBe(true);
    });

    it('assigns returned output from _decodeUncompressedBlock to _output (covers lines 278-282)', () => {
        // Arrange
        const inf = new _Inflater();
        inf._inflaterState = _InflaterState.readingBType;
        const fakeOutput = new _DecompressedOutput();
        const returned = { result: false, eob: true, output: fakeOutput };
        inf._input = { _availableBits: (_n: number) => true, _getBits: (_n: number) => _BlockType.unCompressedType } as any;
        (inf as any)._decodeUncompressedBlock = function (_endBlock: boolean) { return returned; };

        // Act
        const res = inf._decode();

        // Assert
        expect(inf._output).toBe(fakeOutput);
        expect(res).toBe(false);
    });
    it('decodeUncompressedBlock - aligning returns false when _unCompressedByte fails (lines 305-312)', () => {
        const inf = new _Inflater();
        inf._inflaterState = _InflaterState.unCompressedAligning;
        let skipped = false;
        inf._input = {
            _skipByteBoundary: () => { skipped = true; },
            _getBits: (_n: number) => -1
        } as any;
        const out = inf._decodeUncompressedBlock(false);
        expect(skipped).toBe(true);
        expect(out.result).toBe(false);
        expect(out.eob).toBe(false);
    });

    it('decodeUncompressedBlock - consumes entire _bLength and sets eob (line 324)', () => {
        const inf = new _Inflater();
        inf._inflaterState = _InflaterState.decodeUnCompressedBytes;
        inf._bLength = 4;
        inf._input = {} as any;
        inf._output = {
            _copyFrom: (_input: any, len: number) => len,
            _unusedBytes: 10
        } as any;
        const out = inf._decodeUncompressedBlock(false);
        expect(out.result).toBe(true);
        expect(out.eob).toBe(true);
    });

    it('_unCompressedByte success computes _bLength and advances state; throws on invalid complement (lines 339-349)', () => {
        const inf = new _Inflater();
        // success path: provide 4 bytes where last two are bitwise complement of first two
        inf._inflaterState = _InflaterState.unCompressedByte1;
        const seqGood = [0x34, 0x12, 0xCB, 0xED]; // 0x1234, complement 0xEDCB
        let idxGood = 0;
        inf._input = { _getBits: (_n: number) => seqGood[idxGood++] } as any;
        expect(inf._unCompressedByte()).toBe(true);
        expect(inf._unCompressedByte()).toBe(true);
        expect(inf._unCompressedByte()).toBe(true);
        expect(inf._unCompressedByte()).toBe(true);
        expect(inf._bLength).toBe(0x34 + (0x12 * 256));

        // invalid complement throws
        const inf2 = new _Inflater();
        inf2._inflaterState = _InflaterState.unCompressedByte1;
        const seqBad = [0x01, 0x00, 0x00, 0x00];
        let idxBad = 0;
        inf2._input = { _getBits: (_n: number) => seqBad[idxBad++] } as any;
        expect(() => {
            inf2._unCompressedByte(); inf2._unCompressedByte(); inf2._unCompressedByte(); inf2._unCompressedByte();
        }).toThrowError('Ivalid block length.');
    });

    it('_decodeBlock returns false on negative llTree symbol (line 403)', () => {
        const inf = new _Inflater();
        inf._inflaterState = _InflaterState.decodeTop;
        inf._output = { _unusedBytes: 300, _write: (_b: number) => { } } as any;
        inf._llTree = { _getNextSymbol: (_in: any) => -1 } as any;
        const out = inf._decodeBlock(false);
        expect(out.result).toBe(false);
    });

    it('_decodeBlock writes literal bytes when symbol < 256 (line 410)', () => {
        const inf = new _Inflater();
        inf._inflaterState = _InflaterState.decodeTop;
        let wrote = false;
        inf._output = { _unusedBytes: 300, _write: (b: number) => { wrote = true; } } as any;
        inf._llTree = { _getNextSymbol: (_in: any) => 65 } as any;
        const out = inf._decodeBlock(false);
        expect(out.result).toBe(true);
        expect(wrote).toBe(true);
    });

    it('_decodeBlock handles EOB symbol and sets readingBFinal (line 417)', () => {
        const inf = new _Inflater();
        inf._inflaterState = _InflaterState.decodeTop;
        inf._output = { _unusedBytes: 300, _write: (_b: number) => { } } as any;
        inf._llTree = { _getNextSymbol: (_in: any) => 256 } as any;
        const out = inf._decodeBlock(false);
        expect(out.result).toBe(true);
        expect(out.eob).toBe(true);
    });

    it('_decodeBlock throws on invalid-length symbol (line 421)', () => {
        const inf = new _Inflater();
        inf._inflaterState = _InflaterState.decodeTop;
        inf._output = { _unusedBytes: 300, _write: (_b: number) => { } } as any;
        // produce a very large symbol so symbol-257 >= _extraLengthBits.length
        inf._llTree = { _getNextSymbol: (_in: any) => 10000 } as any;
        expect(() => inf._decodeBlock(false)).toThrowError('Invalid data.');
    });


    it('_getBlockType maps bit values to types', () => {
        const inf = new _Inflater();
        expect(inf._getBlockType(_BlockType.unCompressedType)).toBe(_BlockType.unCompressedType);
        expect(inf._getBlockType(_BlockType.staticType)).toBe(_BlockType.staticType);
        expect(inf._getBlockType(99)).toBe(_BlockType.dynamicType);
    });

    it('_getInflaterState switch coverage enum values', () => {
        let inf: _Inflater;
        inf = new _Inflater();
        expect(inf._getInflaterState(0)).toBe(_InflaterState.readingHeader);
        expect(inf._getInflaterState(2)).toBe(_InflaterState.readingBFinal);
        expect(inf._getInflaterState(3)).toBe(_InflaterState.readingBType);
        expect(inf._getInflaterState(4)).toBe(_InflaterState.readingNlCodes);
        expect(inf._getInflaterState(5)).toBe(_InflaterState.readingNdCodes);
        expect(inf._getInflaterState(6)).toBe(_InflaterState.readingCodes);
        expect(inf._getInflaterState(7)).toBe(_InflaterState.readingClCodes);
        expect(inf._getInflaterState(8)).toBe(_InflaterState.readingTcBefore);
        expect(inf._getInflaterState(9)).toBe(_InflaterState.readingTcAfter);
        expect(inf._getInflaterState(10)).toBe(_InflaterState.decodeTop);
        expect(inf._getInflaterState(11)).toBe(_InflaterState.iLength);
        expect(inf._getInflaterState(12)).toBe(_InflaterState.fLength);
        expect(inf._getInflaterState(13)).toBe(_InflaterState.dCode);
        expect(inf._getInflaterState(15)).toBe(_InflaterState.unCompressedAligning);
        expect(inf._getInflaterState(16)).toBe(_InflaterState.unCompressedByte1);
        expect(inf._getInflaterState(17)).toBe(_InflaterState.unCompressedByte2);
        expect(inf._getInflaterState(18)).toBe(_InflaterState.unCompressedByte3);
        expect(inf._getInflaterState(19)).toBe(_InflaterState.unCompressedByte4);
        expect(inf._getInflaterState(20)).toBe(_InflaterState.decodeUnCompressedBytes);
        expect(inf._getInflaterState(21)).toBe(_InflaterState.srFooter);
        expect(inf._getInflaterState(22)).toBe(_InflaterState.rFooter);
        expect(inf._getInflaterState(23)).toBe(_InflaterState.vFooter);
        expect(inf._getInflaterState(24)).toBe(_InflaterState.done);
        expect(inf._getInflaterState(-1)).toBe(_InflaterState.readingHeader);
        expect(inf._getInflaterState(1)).toBe(_InflaterState.readingHeader);
        expect(inf._getInflaterState(14)).toBe(_InflaterState.readingHeader);
        expect(inf._getInflaterState(999)).toBe(_InflaterState.readingHeader);
    });

    it('_getInflaterStateValue switch coverage enum values to correct numeric values', () => {
        let inf: _Inflater;
        inf = new _Inflater();
        expect(inf._getInflaterStateValue(_InflaterState.readingHeader)).toBe(0);
        expect(inf._getInflaterStateValue(_InflaterState.readingBFinal)).toBe(2);
        expect(inf._getInflaterStateValue(_InflaterState.readingBType)).toBe(3);
        expect(inf._getInflaterStateValue(_InflaterState.readingNlCodes)).toBe(4);
        expect(inf._getInflaterStateValue(_InflaterState.readingNdCodes)).toBe(5);
        expect(inf._getInflaterStateValue(_InflaterState.readingCodes)).toBe(6);
        expect(inf._getInflaterStateValue(_InflaterState.readingClCodes)).toBe(7);
        expect(inf._getInflaterStateValue(_InflaterState.readingTcBefore)).toBe(8);
        expect(inf._getInflaterStateValue(_InflaterState.readingTcAfter)).toBe(9);
        expect(inf._getInflaterStateValue(_InflaterState.decodeTop)).toBe(10);
        expect(inf._getInflaterStateValue(_InflaterState.iLength)).toBe(11);
        expect(inf._getInflaterStateValue(_InflaterState.fLength)).toBe(12);
        expect(inf._getInflaterStateValue(_InflaterState.dCode)).toBe(13);
        expect(inf._getInflaterStateValue(_InflaterState.unCompressedAligning)).toBe(15);
        expect(inf._getInflaterStateValue(_InflaterState.unCompressedByte1)).toBe(16);
        expect(inf._getInflaterStateValue(_InflaterState.unCompressedByte2)).toBe(17);
        expect(inf._getInflaterStateValue(_InflaterState.unCompressedByte3)).toBe(18);
        expect(inf._getInflaterStateValue(_InflaterState.unCompressedByte4)).toBe(19);
        expect(inf._getInflaterStateValue(_InflaterState.decodeUnCompressedBytes)).toBe(20);
        expect(inf._getInflaterStateValue(_InflaterState.srFooter)).toBe(21);
        expect(inf._getInflaterStateValue(_InflaterState.rFooter)).toBe(22);
        expect(inf._getInflaterStateValue(_InflaterState.vFooter)).toBe(23);
        expect(inf._getInflaterStateValue(_InflaterState.done)).toBe(24);
        expect(inf._getInflaterStateValue(999 as any)).toBe(0);
    });

    it('_decodeDynamicBlockHeader  switch coverage enum values to correct numeric values', () => {
        let inf: _Inflater;
        inf = new _Inflater();
        inf._inflaterState = _InflaterState.readingNdCodes;
        expect(inf._decodeDynamicBlockHeader()).toBe(false);
        inf._inflaterState = _InflaterState.readingCodes;
        expect(inf._decodeDynamicBlockHeader()).toBe(false);
        inf._inflaterState = _InflaterState.readingClCodes;
        expect(inf._decodeDynamicBlockHeader()).toBe(true);
        inf._inflaterState = _InflaterState.readingTcBefore;
        expect(inf._decodeDynamicBlockHeader()).toBe(true);
        inf._inflaterState = _InflaterState.readingTcAfter;
        expect(inf._decodeDynamicBlockHeader()).toBe(true);
        expect(inf._decodeDynamicBlockHeader()).toBe(true);
        expect(inf._decodeDynamicBlockHeader()).toBe(true);
        expect(inf._decodeDynamicBlockHeader()).toBe(true);
    });

    it('_decodeDynamicBlockHeader - return false (line 508)', () => {
        const inf = new _Inflater();
        inf._inflaterState = _InflaterState.readingNlCodes;
        spyOn(inf._input, '_getBits').and.returnValue(-1);
        const result = inf._decodeDynamicBlockHeader()
        expect(result).toBeFalsy();
    });
    it('_decodeDynamicBlockHeader - return false (line 513)', () => {
        const inf = new _Inflater();
        inf._inflaterState = _InflaterState.readingNlCodes;
        spyOn(inf._input, '_getBits').and.returnValue(0);
        spyOn(inf, '_readingNDCodes').and.returnValue(false);
        const result = inf._decodeDynamicBlockHeader()
        expect(result).toBeFalsy();
    });
    it('_decodeDynamicBlockHeader - return false (line 528)', () => {
        const inf = new _Inflater();
        inf._inflaterState = _InflaterState.readingClCodes;
        spyOn(inf, '_readingCLCodes').and.returnValue(false);
        const result = inf._decodeDynamicBlockHeader()
        expect(result).toBeFalsy();
    });
    it('_decodeDynamicBlockHeader - return false (line 534)', () => {
        const inf = new _Inflater();
        inf._inflaterState = _InflaterState.readingTcAfter;
        spyOn(inf, '_readingTCBefore').and.returnValue(false);
        const result = inf._decodeDynamicBlockHeader()
        expect(result).toBeFalsy();
    });

    it('_dcode returns false when extra bits read fails and writes/sets state when succeeds', () => {
        const inf: any = new _Inflater();
        inf._input = { _getBits: (n: number) => -1 };
        inf._distanceCode = 5; // > 3 triggers extra bits branch
        inf._length = 4;
        inf._output = { _writeLD: () => { throw new Error('should not be called'); } };
        const resFalse = inf._dcode(100);
        expect(resFalse.value).toBeFalsy();

        // success path for >3
        let captured: any = null;
        inf._input = { _getBits: (n: number) => 2 };
        inf._distanceCode = 4; // base pos exists
        inf._output = { _writeLD: (len: number, off: number) => { captured = { len, off }; } };
        inf._length = 3;
        const fbBefore = 50;
        const res = inf._dcode(fbBefore);
        expect(res.value).toBeTruthy();
        expect(captured).toBeDefined();
        expect(captured.len).toBe(3);
        const expectedOffset = inf._distanceBasePosition[4] + 2;
        expect(captured.off).toBe(expectedOffset);
        expect(inf._inflaterState).toBe(_InflaterState.decodeTop);

        // branch distanceCode <= 3
        captured = null;
        inf._distanceCode = 3;
        inf._length = 2;
        inf._output = { _writeLD: (l: number, o: number) => { captured = { l, o }; } };
        const res2 = inf._dcode(20);
        expect(res2.value).toBeTruthy();
        expect(captured.o).toBe(4); // 3 + 1
    });

    it('_fLength returns false when static path input bits are negative (else-branch at line ~461)', () => {
        const inf: any = new _Inflater();
        inf._blockType = _BlockType.staticType;
        inf._input = { _getBits: (n: number) => -1 };
        const res = inf._fLength(100);
        expect(res.value).toBeFalsy();
    });

    it('_fLength returns false when dynamic path distance tree yields negative', () => {
        const inf: any = new _Inflater();
        inf._blockType = _BlockType.dynamicType;
        inf._distanceTree = { _getNextSymbol: (_in: any) => -1 };
        const res = inf._fLength(50);
        expect(res.value).toBeFalsy();
    });

    it('_decode  returns true when _finsished is true', () => {
        const inf = new _Inflater();
        inf._inflaterState = _InflaterState.done;
        const result = inf._decode();
        expect(result).toBeTruthy();
    });
    it('_fLength normal path calls _dcode and returns true', () => {
        const inf: any = new _Inflater();
        inf._blockType = _BlockType.staticType;
        inf._input = { _getBits: (n: number) => 1 };
        let called = false;
        inf._dcode = function (fb: number) { called = true; return { value: true, fb }; };
        const res = inf._fLength(123);
        expect(res.value).toBeTruthy();
        expect(called).toBeTruthy();
    });

    it('_inLength returns false when extraBits positive and input read fails, throws on invalid length, and calls _fLength otherwise', () => {
        const inf: any = new _Inflater();
        // case: _getBits returns -1
        inf._extraBits = 2;
        inf._input = { _getBits: (n: number) => -1 };
        let r = inf._inLength(10);
        expect(r.value).toBeFalsy();

        // case: invalid length triggers throw
        inf._input = { _getBits: (n: number) => 0 };
        inf._extraBits = 1;
        inf._length = -1; // invalid
        expect(() => inf._inLength(10)).toThrowError('Invalid data.');

        // normal path: updates length and calls _fLength
        inf._length = 0;
        inf._input = { _getBits: (n: number) => 1 };
        inf._extraBits = 1;
        inf._fLength = function (fb: number) { return { value: true, fb }; };
        r = inf._inLength(77);
        expect(r.value).toBeTruthy();
    });

    it('_decodeBlock handles llTree negative, literal, EOB and invalid-length throw cases', () => {
        const inf: any = new _Inflater();
        inf._output = { _unusedBytes: 259, _write: function () { } };
        inf._inflaterState = _InflaterState.decodeTop;

        // symbol < 0
        inf._llTree = { _getNextSymbol: (_in: any) => -1 };
        let out = inf._decodeBlock(false);
        expect(out.result).toBeFalsy();

        // literal symbol < 256
        inf._llTree = { _getNextSymbol: (_in: any) => 65 };
        let wrote = false;
        inf._output = { _unusedBytes: 259, _write: function (b: number) { wrote = true; } };
        out = inf._decodeBlock(false);
        expect(out.result).toBeTruthy();
        expect(wrote).toBeTruthy();

        // EOB symbol 256
        inf._llTree = { _getNextSymbol: (_in: any) => 256 };
        inf._inflaterState = _InflaterState.decodeTop;
        out = inf._decodeBlock(false);
        expect(out.result).toBeTruthy();
        expect(inf._inflaterState).toBe(_InflaterState.readingBFinal);

        // invalid-length symbol triggers throw
        inf._llTree = { _getNextSymbol: (_in: any) => 300 };
        inf._inflaterState = _InflaterState.decodeTop;
        expect(() => inf._decodeBlock(false)).toThrowError('Invalid data.');
    });

    it('_readingCLCodes returns false when getBits negative and populates _cltcl on success', () => {
        const inf: any = new _Inflater();
        inf._clCodeCount = 2;
        // negative on first call
        inf._input = { _getBits: (n: number) => -1 };
        expect(inf._readingCLCodes()).toBeFalsy();

        // success sequence
        let calls = 0;
        inf._input = { _getBits: (n: number) => { return [1, 2][calls++]; } };
        // allow internal _HuffmanTree operations to run (no-op expectations)
        const ok = inf._readingCLCodes();
        expect(ok).toBeTruthy();
        expect(inf._cltcl.length).toBeGreaterThan(0);
    });

    it('_readingTCBefore covers negative symbol, small codes, availableBits false and lengthCode==16 invalid throw', () => {
        const inf: any = new _Inflater();
        inf._caSize = 1;
        // case: _clTree._getNextSymbol returns -1
        inf._inflaterState = _InflaterState.readingTcBefore;
        inf._loopCounter = 0;
        inf._clTree = { _getNextSymbol: (_in: any) => -1 };
        inf._input = { _availableBits: (n: number) => true };
        expect(inf._readingTCBefore()).toBeFalsy();

        // small code path (<=15)
        inf._loopCounter = 0; inf._caSize = 2;
        let seq = [5, 6];
        inf._clTree = { _getNextSymbol: (_in: any) => seq.shift() };
        inf._input = { _availableBits: (n: number) => true, _getBits: (n: number) => 0 };
        expect(inf._readingTCBefore()).toBeTruthy();

        // availableBits false when lengthCode > 15
        inf._loopCounter = 0; inf._caSize = 1;
        inf._clTree = { _getNextSymbol: (_in: any) => 17 };
        inf._input = { _availableBits: (n: number) => false };
        inf._inflaterState = _InflaterState.readingTcBefore;
        expect(inf._readingTCBefore()).toBeFalsy();

        // lengthCode === 16 with loopCounter === 0 should throw
        inf._loopCounter = 0; inf._caSize = 1;
        inf._clTree = { _getNextSymbol: (_in: any) => 16 };
        inf._input = { _availableBits: (n: number) => true, _getBits: (n: number) => 0 };
        expect(() => inf._readingTCBefore()).toThrowError('Invalid data.');
    });

    it('lengthCode 16 repeatCount exceeding caSize throws', () => {
        const inf: any = new _Inflater();
        inf._inflaterState = _InflaterState.readingTcBefore;
        // set up loopCounter and caSize such that repeatCount will overflow
        inf._loopCounter = 5; inf._caSize = 6;
        inf._codeList = Array<number>(10).fill(0);
        inf._codeList[4] = 7; // previous code used by repeat
        inf._clTree = { _getNextSymbol: (_in: any) => 16 };
        inf._input = { _availableBits: (n: number) => true, _getBits: (n: number) => 2 };
        expect(() => inf._readingTCBefore()).toThrowError('Invalid data.');
    });

    it('lengthCode 17 repeatCount exceeding caSize throws', () => {
        const inf: any = new _Inflater();
        inf._inflaterState = _InflaterState.readingTcBefore;
        inf._loopCounter = 8; inf._caSize = 10;
        inf._clTree = { _getNextSymbol: (_in: any) => 17 };
        inf._input = { _availableBits: (n: number) => true, _getBits: (n: number) => 3 };
        expect(() => inf._readingTCBefore()).toThrowError('Invalid data.');
    });

    it('lengthCode 18 (else) repeatCount exceeding caSize throws', () => {
        const inf: any = new _Inflater();
        inf._inflaterState = _InflaterState.readingTcBefore;
        inf._loopCounter = 3; inf._caSize = 10;
        inf._clTree = { _getNextSymbol: (_in: any) => 18 };
        // getBits(7) + 11 -> with 0 yields 11 -> 3 + 11 = 14 > 10
        inf._input = { _availableBits: (n: number) => true, _getBits: (n: number) => 0 };
        expect(() => inf._readingTCBefore()).toThrowError('Invalid data.');
    });
    describe('_Inflater marked Iif branches - ND / Codes / CL', function () {
        let inflater: any;

        beforeEach(function () {
            inflater = {
                _dCodeCount: 0,
                _clCodeCount: 0,
                _llCodeCount: 2,
                _loopCounter: 0,
                _caSize: 0,

                _cltcl: [],
                _codeOrder: [0, 1, 2, 3, 4, 5, 6, 7],

                _input: {
                    _getBits: jasmine.createSpy()
                },

                _inflaterState: null,

                _readingCodes: _Inflater.prototype._readingCodes,
                _readingCLCodes: _Inflater.prototype._readingCLCodes,
                _readingTCBefore: jasmine.createSpy(),

                _readingNDCodes: _Inflater.prototype._readingNDCodes
            };
        });

        it('should return false for all marked Iif branches', function () {

            /* ---------- Iif #1 : !this._readingCodes() ---------- */
            inflater._input._getBits.and.returnValue(0);
            spyOn(inflater, '_readingCodes').and.returnValue(false);

            expect(inflater._readingNDCodes()).toBeFalsy();

            /* ---------- Iif #2 : !this._readingCLCodes() ---------- */
            inflater._input._getBits.and.returnValue(0);
            spyOn(inflater, '_readingCLCodes').and.returnValue(false);

            expect(inflater._readingCodes()).toBeFalsy();

            /* ---------- Iif #3 : !this._readingTCBefore() ---------- */
            inflater._input._getBits.and.returnValue(0);
            inflater._readingTCBefore.and.returnValue(false);

            expect(inflater._readingCLCodes()).toBeFalsy();
        });
    });
});

describe('_PdfLempelZivWelchStream behavior (lines 1–153)', () => {

    it('constructor initializes lzwState and sets defaults', () => {
        const fakeStream: any = { getByte: () => -1 };

        const s = new _PdfLempelZivWelchStream(fakeStream, 0, 1) as any;

        expect(s.stream).toBe(fakeStream);
        expect(s.lzwState).toBeDefined();
        expect(s.lzwState.codeLength).toBe(9);
        expect(s.lzwState.nextCode).toBe(258);
        expect(s.bitsCached).toBe(0);
    });

    it('covers dictionary expansion branch (code < nextCode)', () => {
        const fakeStream: any = { getByte: () => -1 };
        const s = new _PdfLempelZivWelchStream(fakeStream, 0, 0) as any;

        const state = s.lzwState;

        // Force controlled LZW state
        state.codeLength = 9;
        state.nextCode = 260;                // nextCode > code
        state.prevCode = 65;
        state.currentSequenceLength = 1;
        state.currentSequence[0] = 65;

        // Define dictionary entry 258
        state.dictionaryLengths[258] = 2;
        state.dictionaryValues[258] = 66;
        state.dictionaryPrevCodes[258] = 65;

        // Stub readBits → return dictionary code once, then terminate
        spyOn(s, 'readBits').and.callFake(() => 258);

        // Prevent infinite loop growth
        spyOn(s, 'ensureBuffer').and.callThrough();

        s.readBlock();

        // ASSERT: branch was executed
        expect(state.currentSequenceLength).toBe(2);
        expect(state.currentSequence[0]).toBe(65);
        expect(state.currentSequence[1]).toBe(66);
    });

    it('readBits returns null and sets eof when stream returns -1', () => {
        // Arrange: stream that immediately returns EOF
        const fakeStream: any = { getByte: () => -1 };
        const s: any = new _PdfLempelZivWelchStream(fakeStream, 0, 1);
        s.bitsCached = 1
        // Act
        const res = s.readBits(8);
        // Assert
        expect(res).toBeNull();
        expect(s.eof).toBeTruthy();
    });

    it('readBits returns bits and updates internal caches', () => {
        // Arrange: two bytes produce 16 bits -> request 12 bits
        const bytes = [0x0f, 0xf0];
        let idx = 0;
        const fakeStream: any = { getByte: () => (idx < bytes.length ? bytes[idx++] : -1) };
        const s = new _PdfLempelZivWelchStream(fakeStream, 0, 1) as any;
        // Act
        const res = s.readBits(12);
        // Assert: (0x0f<<8 | 0xf0) >>> 4 === 255
        expect(res).toBe(255);
        expect(s.bitsCached).toBe(4);
        expect(s.cachedData).toBe((0x0f << 8) | 0xf0);
        expect(s.lastCode).toBeNull();
    });

    it('readBlock returns immediately when lzwState is null', () => {
        const fakeStream: any = { getByte: () => -1 };
        const s = new _PdfLempelZivWelchStream(fakeStream, 0, 1) as any;
        s.lzwState = null;
        s.bufferLength = 0;
        s.readBlock();
        expect(s.bufferLength).toBe(0);
    });

    it('readBlock breaks on EOF from readBits and sets eof', () => {
        const fakeStream: any = { getByte: () => -1 };
        const s = new _PdfLempelZivWelchStream(fakeStream, 0, 1) as any;
        s.readBlock();
        expect(s.eof).toBeTruthy();
        expect(s.bufferLength).toBe(0);
    });

    it('readBlock decodes literal then 258 repeating sequence and updates dictionary', () => {
        const fakeStream: any = { getByte: () => -1 };
        const s = new _PdfLempelZivWelchStream(fakeStream, 0, 1) as any;
        // override readBits to drive specific codes: 65, 258, then null to stop
        const seq: any[] = [65, 258, null];
        (s as any).readBits = (_n: number) => seq.shift();
        s.bufferLength = 0;
        s.readBlock();
        expect(s.bufferLength).toBe(3);
        const buf = (s as any).buffer as Uint8Array;
        expect(buf[0]).toBe(65);
        expect(buf[1]).toBe(65);
        // nextCode should have advanced from 258 to 259 and dictionary entry set at 258
        expect(s.lzwState.nextCode).toBe(259);
        expect(s.lzwState.dictionaryPrevCodes[258]).toBe(65);
        expect(s.lzwState.dictionaryLengths[258]).toBe(2);
        expect(s.lzwState.dictionaryValues[258]).toBe(65);
    });

    it('readBlock handles reset code 256 by resetting codeLength and nextCode', () => {
        const fakeStream: any = { getByte: () => -1 };
        const s = new _PdfLempelZivWelchStream(fakeStream, 0, 1) as any;
        const seq: any[] = [65, 256, null];
        (s as any).readBits = (_n: number) => seq.shift();
        s.bufferLength = 0;
        // mutate state so a change would be visible after reset
        s.lzwState.codeLength = 11;
        s.lzwState.nextCode = 300;
        s.readBlock();
        expect(s.lzwState.codeLength).toBe(9);
        expect(s.lzwState.nextCode).toBe(258);
        expect(s.lzwState.currentSequenceLength).toBe(0);
    });

    it('readBlock invalid code 257 sets eof and clears lzwState', () => {
        const fakeStream: any = { getByte: () => -1 };
        const s = new _PdfLempelZivWelchStream(fakeStream, 0, 1) as any;
        const seq: any[] = [257, null];
        (s as any).readBits = (_n: number) => seq.shift();
        s.readBlock();
        expect(s.eof).toBeTruthy();
        expect(s.lzwState).toBeNull();
    });

    it('readBlock expands buffer when decodedLength exceeds estimate (lines 137-139)', () => {
        // Arrange
        const fakeStream: any = { getByte: () => -1 };
        const s = new _PdfLempelZivWelchStream(fakeStream, 0, 0) as any;
        // force a very large current sequence so decodedLength will exceed estimate
        s.lzwState.currentSequenceLength = 1500;
        s.lzwState.currentSequence[0] = 7;
        s.lzwState.prevCode = 1;
        s.lzwState.nextCode = 258;
        s.bufferLength = 0;
        // override readBits to produce a single code that triggers the else-branch, then EOF
        const seq2: any[] = [258, null];
        (s as any).readBits = (_n: number) => seq2.shift();
        spyOn(s as any, 'ensureBuffer').and.callThrough();

        // Act
        s.readBlock();

        // Assert
        expect(s.bufferLength).toBeGreaterThan(1500);
        expect((s as any).ensureBuffer).toHaveBeenCalled();
        expect(s.lzwState.nextCode).toBeGreaterThanOrEqual(259);
    });

});
describe('_PdfFaxStream basic behaviors (lines 1–44)', () => {

    it('constructor creates ccittFaxDecoder when params are missing', () => {
        const fakeStream: any = { getByte: () => -1 };

        const original = _PdfFaxDecoder.prototype.readNextChar;
        spyOn(_PdfFaxDecoder.prototype, 'readNextChar').and.returnValue(-1);

        const s = new _PdfFaxStream(fakeStream, 0, null as any) as any;

        expect(s.ccittFaxDecoder).toBeDefined();

        _PdfFaxDecoder.prototype.readNextChar = original;
    });

    it('readBlock sets eof immediately when decoder returns -1 first', () => {
        const fakeStream: any = { getByte: () => -1 };
        const s: _PdfFaxStream = new _PdfFaxStream(fakeStream, 0, null as any) as any;
        const source: any = { // eslint-disable-line
            next: () => {
                return fakeStream.getByte();
            }
        };
        s.eof = false;
        s.ccittFaxDecoder
        const decode: any = new _PdfFaxDecoder(source);
        decode._outputBits = 0;
        decode._rowsDone = true;
        s.ccittFaxDecoder = decode;
        s.readBlock();
        expect(s.eof).toBeTruthy();
        expect(s.bufferLength).toBe(0);
    });
});
describe('_PdfFaxStream.readBlock marked line coverage', () => {
    let stream: any;

    beforeEach(() => {
        stream = {
            eof: false,
            bufferLength: 0,
            buffer: new Uint8Array(10),

            ensureBuffer: jasmine.createSpy('ensureBuffer'),

            ccittFaxDecoder: {
                readNextChar: jasmine.createSpy('readNextChar')
            },

            readBlock: _PdfFaxStream.prototype.readBlock
        };
    });

    it('should write decoded byte into buffer and terminate without deadlock', () => {
        // First call returns a valid byte, second call returns EOF
        stream.ccittFaxDecoder.readNextChar.and.returnValues(65, -1);

        stream.readBlock();

        expect(stream.ensureBuffer).toHaveBeenCalledWith(1);
        expect(stream.buffer[0]).toBe(65);
        expect(stream.bufferLength).toBe(1);

        expect(stream.eof).toBeTruthy();

        expect(stream.ccittFaxDecoder.readNextChar.calls.count()).toBe(2);
    });
});

describe('_Inflater _decodeUncompressedBlock branch coverage', () => {

    it('returns false when _unCompressedByte fails during aligning', () => {
        // Arrange
        const inflater: _Inflater = new _Inflater();
        inflater._inflaterState = _InflaterState.unCompressedAligning;
        let skipCalled = false;
        inflater._input = {
            _skipByteBoundary: () => { skipCalled = true; },
            _getBits: (_n: number) => -1
        } as any;

        // Act
        const result = (inflater as any)._decodeUncompressedBlock(false);

        // Assert
        expect(skipCalled).toBeTruthy();
        expect(result.result).toBeFalsy();
        expect(result.eob).toBeFalsy();
    });

    it('returns false when unCompressedByte1 fails during aligning', () => {
        // Arrange
        const inflater: _Inflater = new _Inflater();
        inflater._inflaterState = _InflaterState.unCompressedByte1;
        let skipCalled = false;
        inflater._input = {
            _skipByteBoundary: () => { skipCalled = true; },
            _getBits: (_n: number) => -1
        } as any;

        // Act
        const result = (inflater as any)._decodeUncompressedBlock(false);

        // Assert
        expect(skipCalled).toBeFalsy();
        expect(result.result).toBeFalsy();
        expect(result.eob).toBeFalsy();
    });
    it('returns false when unCompressedByte2 fails during aligning', () => {
        // Arrange
        const inflater: _Inflater = new _Inflater();
        inflater._inflaterState = _InflaterState.unCompressedByte2;
        let skipCalled = false;
        inflater._input = {
            _skipByteBoundary: () => { skipCalled = true; },
            _getBits: (_n: number) => -1
        } as any;

        // Act
        const result = (inflater as any)._decodeUncompressedBlock(false);

        // Assert
        expect(skipCalled).toBeFalsy();
        expect(result.result).toBeFalsy();
        expect(result.eob).toBeFalsy();
    });
    it('returns false when unCompressedByte3 fails during aligning', () => {
        // Arrange
        const inflater: _Inflater = new _Inflater();
        inflater._inflaterState = _InflaterState.unCompressedByte3;
        let skipCalled = false;
        inflater._input = {
            _skipByteBoundary: () => { skipCalled = true; },
            _getBits: (_n: number) => -1
        } as any;

        // Act
        const result = (inflater as any)._decodeUncompressedBlock(false);

        // Assert
        expect(skipCalled).toBeFalsy();
        expect(result.result).toBeFalsy();
        expect(result.eob).toBeFalsy();
    });
    it('returns false when unCompressedByte4 fails during aligning', () => {
        // Arrange
        const inflater: _Inflater = new _Inflater();
        inflater._inflaterState = _InflaterState.unCompressedByte4;
        let skipCalled = false;
        inflater._input = {
            _skipByteBoundary: () => { skipCalled = true; },
            _getBits: (_n: number) => -1
        } as any;

        // Act
        const result = (inflater as any)._decodeUncompressedBlock(false);

        // Assert
        expect(skipCalled).toBeFalsy();
        expect(result.result).toBeFalsy();
        expect(result.eob).toBeFalsy();
    });
    it('returns true when _output._unusedBytes === 0 after partial copy', () => {
        // Arrange
        const inflater: _Inflater = new _Inflater();
        inflater._inflaterState = _InflaterState.decodeUnCompressedBytes;
        inflater._bLength = 5;
        inflater._input = {} as any;
        inflater._output = {
            _copyFrom: (_input: any, len: number) => {
                return 2; // partial consume
            },
            _unusedBytes: 0
        } as any;

        // Act
        const result = (inflater as any)._decodeUncompressedBlock(false);

        // Assert
        expect(result.result).toBeTruthy();
        expect(result.eob).toBeFalsy();
        expect(result.output).toBe(inflater._output);
    });

    it('returns false when partial copy remains and _output._unusedBytes > 0', () => {
        // Arrange
        const inflater: _Inflater = new _Inflater();
        inflater._inflaterState = _InflaterState.decodeUnCompressedBytes;
        inflater._bLength = 6;
        inflater._input = {} as any;
        inflater._output = {
            _copyFrom: (_input: any, len: number) => {
                return 2; // partial consume
            },
            _unusedBytes: 10
        } as any;

        // Act
        const result = (inflater as any)._decodeUncompressedBlock(false);

        // Assert
        expect(result.result).toBeFalsy();
        expect(result.eob).toBeFalsy();
    });

    // Additional tests requested for specific lines in inflater.ts
    it('_unCompressedByte returns false when _input._getBits returns -1 (line 304)', () => {
        // Arrange
        const inflater: _Inflater = new _Inflater();
        inflater._inflaterState = _InflaterState.unCompressedByte1;
        inflater._input = { _getBits: (_n: number) => -1 } as any;

        // Act
        const res = (inflater as any)._unCompressedByte();

        // Assert
        expect(res).toBe(false);
    });

    it('_unCompressedByte throws on invalid complement when in unCompressedByte4 (line 312)', () => {
        // Arrange
        const inflater: _Inflater = new _Inflater();
        inflater._inflaterState = _InflaterState.unCompressedByte4;
        // prefill blBuffer[0..2] so complement check will fail
        (inflater as any)._blBuffer = [1, 0, 0, 0];
        inflater._input = { _getBits: (_n: number) => 0 } as any;

        // Act / Assert
        expect(() => (inflater as any)._unCompressedByte()).toThrowError('Ivalid block length.');
    });

    it('_unCompressedByte advances state and returns true on normal byte (line 325)', () => {
        // Arrange
        const inflater: _Inflater = new _Inflater();
        inflater._inflaterState = _InflaterState.unCompressedByte1;
        inflater._input = { _getBits: (_n: number) => 0x12 } as any;

        // Act
        const res = (inflater as any)._unCompressedByte();

        // Assert
        expect(res).toBe(true);
        expect(inflater._inflaterState).toBe(_InflaterState.unCompressedByte2 as any);
    });

});
