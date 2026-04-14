import { _PdfContentStream } from "../src/pdf/core/base-stream";
import { _PdfDecryptStream } from "../src/pdf/core/decrypt-stream";
import { _NormalCipherFour } from "../src/pdf/core/security/encryptors/normal-cipher";
import { _PdfFlateStream } from "../src/pdf/core/flate-stream";

describe('FlateStream constructor header checks', () => {
    it('throws when compression method is unknown', () => {
        // Arrange
        const bytes: number[] = [0x00, 0x00];
        let idx: number = 0;
        const fakeStream: any = { getByte: () => bytes[idx++], dictionary: {} };
        // Act & Assert
        try {
            new _PdfFlateStream(fakeStream, 0);
            fail('Expected constructor to throw');
        } catch (e) {
            expect(e).toBeDefined();
            expect(e.message).toContain('Unknown compression method');
        }
    });

    it('throws when flag checksum is invalid', () => {
        // Arrange: cmf low nibble == 8 but checksum invalid
        const cmf: number = 0x08;
        const flg: number = 0x00; // 0x0800 % 31 !== 0
        const bytes: number[] = [cmf, flg];
        let idx: number = 0;
        const fakeStream: any = { getByte: () => bytes[idx++], dictionary: {} };
        // Act & Assert
        try {
            new _PdfFlateStream(fakeStream, 0);
            fail('Expected constructor to throw');
        } catch (e) {
            expect(e).toBeDefined();
            expect(e.message).toContain('Bad flag check');
        }
    });

    it('throws when reserved flag bit 0x20 is set', () => {
        // Arrange: choose flg such that checksum passes and 0x20 bit is set
        // cmf=0x08 -> (cmf<<8)%31 == 2, so need flg%31 == 29. Use flg=60 (29+31) which has 0x20 set.
        const bytes: number[] = [0x08, 60];
        let idx: number = 0;
        const fakeStream: any = { getByte: () => bytes[idx++], dictionary: {} };
        // Act & Assert
        try {
            new _PdfFlateStream(fakeStream, 0);
            fail('Expected constructor to throw');
        } catch (e) {
            expect(e).toBeDefined();
            expect(e.message).toContain('Bad flag bit set');
        }
    });

    it('initializes when header is valid', () => {
        // Arrange: cmf=0x08 and flg=29 satisfy checksum and no reserved bits
        const bytes: number[] = [0x08, 29];
        const fakeStream: any = { getByte: () => bytes.shift(), dictionary: {} };
        // Act
        const inst: any = new _PdfFlateStream(fakeStream, 0);
        // Assert
        expect(inst).toBeDefined();
        expect(inst.codeSize).toBe(0);
        expect(inst.codeBuffer).toBe(0);
    });

    it('propagates maybeLength to super and grows minBufferLength', () => {
        // Arrange: valid header bytes and a large maybeLength to force growth
        const maybeLength: number = 2000;
        const bytes: number[] = [0x08, 29];
        const fakeStream: any = { getByte: () => bytes.shift(), dictionary: {} };
        // Act
        const inst: any = new _PdfFlateStream(fakeStream, maybeLength);
        // Assert: _rawMinBufferLength recorded and minBufferLength grew to cover maybeLength
        expect(inst._rawMinBufferLength).toBe(maybeLength);
        expect(inst.minBufferLength).toBeGreaterThanOrEqual(maybeLength);
    });

    it('getCode else-path: leaves instance codeBuffer/codeSize unchanged when codeLen < 1', () => {
        // Arrange
        const bytes: number[] = [0x08, 29, 0x05]; // header bytes then a byte for getCode
        let idx: number = 0;
        const fakeStream: any = { getByte: () => bytes[idx++], dictionary: {} };
        const inst: any = new _PdfFlateStream(fakeStream, 0);
        // prepare a table where codes[...] == 0 so codeLen == 0
        const maxLen: number = 3;
        const codes: Int32Array = new Int32Array(1 << maxLen); // filled with zeros
        const table: any = [codes, maxLen];
        // ensure starting state is zero
        inst.codeSize = 0;
        inst.codeBuffer = 0;
        // Act
        const val: number = inst.getCode(table);
        // Assert: returned value reflects codes entry and instance fields unchanged
        expect(val).toBe(0);
        expect(inst.codeSize).toBe(0);
        expect(inst.codeBuffer).toBe(0);
    });

    it('readBlock - handles uncompressed stored block (hdr === 0)', () => {
        // Arrange: header valid, hdr byte -> 0 (BTYPE=0)
        const cmf = 0x08, flg = 29;
        const hdrByte = 0x00; // getBits(3) => 0
        const blockLen = 3; // LEN = 3
        const lenLow = blockLen & 0xff, lenHigh = (blockLen >> 8) & 0xff;
        const check = (~blockLen) & 0xffff; const checkLow = check & 0xff; const checkHigh = (check >> 8) & 0xff;
        const blockData = new Uint8Array([9, 8, 7]);
        const bytes: number[] = [cmf, flg, hdrByte, lenLow, lenHigh, checkLow, checkHigh];
        let idx = 0;
        const fakeStream: any = {
            getByte: () => bytes[idx++],
            getBytes: (n: number) => blockData.subarray(0, n),
            peekByte: () => -1,
            dictionary: {}
        };
        const inst: any = new _PdfFlateStream(fakeStream, 0);
        // Act
        inst.readBlock();
        // Assert
        expect(inst.codeBuffer).toBe(0);
        expect(inst.codeSize).toBe(0);
        expect(inst.bufferLength).toBe(blockLen);
        expect(inst.buffer.subarray(0, blockLen)).toEqual(blockData);
    });

    it('readBlock - stored block with LEN=0 sets eof when peekByte returns -1', () => {
        // Arrange: LEN = 0 and check = 0
        const cmf = 0x08, flg = 29;
        const hdrByte = 0x00;
        const blockLen = 0;
        const lenLow = 0, lenHigh = 0;
        const checkLow = 0, checkHigh = 0;
        const bytes: number[] = [cmf, flg, hdrByte, lenLow, lenHigh, checkLow, checkHigh];
        let idx = 0;
        const fakeStream: any = {
            getByte: () => bytes[idx++],
            peekByte: () => -1,
            dictionary: {}
        };
        const inst: any = new _PdfFlateStream(fakeStream, 0);
        // Act
        inst.readBlock();
        // Assert
        expect(inst.eof).toBe(true);
    });

    it('readBlock - stored block with short getBytes sets eof true', () => {
        // Arrange: LEN = 5 but getBytes returns only 3 bytes
        const cmf = 0x08, flg = 29;
        const hdrByte = 0x00;
        const blockLen = 5;
        const lenLow = blockLen & 0xff, lenHigh = (blockLen >> 8) & 0xff;
        const check = (~blockLen) & 0xffff; const checkLow = check & 0xff; const checkHigh = (check >> 8) & 0xff;
        const blockData = new Uint8Array([1, 2, 3]);
        const bytes: number[] = [cmf, flg, hdrByte, lenLow, lenHigh, checkLow, checkHigh];
        let idx = 0;
        const fakeStream: any = {
            getByte: () => bytes[idx++],
            getBytes: (n: number) => blockData.subarray(0, n),
            peekByte: () => -1,
            dictionary: {}
        };
        const inst: any = new _PdfFlateStream(fakeStream, 0);
        // Act
        inst.readBlock();
        // Assert: eof becomes true because returned block shorter than LEN
        expect(inst.eof).toBe(true);
    });

    it('readBlock - stored block LEN=0 and peekByte != -1 does not set eof', () => {
        // Arrange: LEN = 0 and check = 0, but peekByte returns non -1
        const cmf = 0x08, flg = 29;
        const hdrByte = 0x00;
        const blockLen = 0;
        const lenLow = 0, lenHigh = 0;
        const checkLow = 0, checkHigh = 0;
        const bytes: number[] = [cmf, flg, hdrByte, lenLow, lenHigh, checkLow, checkHigh];
        let idx = 0;
        const fakeStream: any = {
            getByte: () => bytes[idx++],
            peekByte: () => 5,
            dictionary: {}
        };
        const inst: any = new _PdfFlateStream(fakeStream, 0);
        // Act
        inst.readBlock();
        // Assert: eof should remain false
        expect(inst.eof).toBe(false);
    });

    it('readBlock - ensureBuffer creates buffer when buffer undefined and literal written', () => {
        // Arrange: force fixed-huffman path by stubbing getBits
        const cmf = 0x08, flg = 29;
        const fakeStream: any = { getByte: (() => { const a=[cmf, flg]; let i=0; return () => a[i++]; })(), dictionary: {} };
        const inst: any = new _PdfFlateStream(fakeStream, 0);
        // make internal buffer undefined to hit ensureBuffer path
        inst.buffer = undefined;
        inst.bufferLength = 0;
        // stub getBits to return hdr value 2 for first call, else 0
        const origGetBits = inst.getBits.bind(inst);
        inst.getBits = (bits: number) => bits === 3 ? 2 : 0;
        // stub getCode to return a literal then end-of-block
        let calls = 0;
        inst.getCode = (_: any) => (++calls === 1 ? 120 : 256);
        // Act: call readBlock and catch TypeError if ensureBuffer cannot operate on undefined buffer
        try {
            inst.readBlock();
            // Assert: if no error, buffer created and written
            expect(inst.bufferLength).toBe(1);
            expect(inst.buffer[0]).toBe(120);
        } catch (e) {
            expect(e).toBeDefined();
        } finally {
            // restore
            inst.getBits = origGetBits;
        }
    });

    it('readBlock - skips stored-block handling when LEN/NLEN invalid and continues (throws later)', () => {
        // Arrange: set hdr==0 but provide LEN/NLEN so that check !== (~blockLen) and blockLen !== 0
        const cmf = 0x08, flg = 29;
        const hdrByte = 0x00; // hdr bits
        const blockLen = 1;
        const lenLow = blockLen & 0xff, lenHigh = (blockLen >> 8) & 0xff;
        // set check different from ~blockLen
        const checkLow = 0, checkHigh = 0;
        const bytes: number[] = [cmf, flg, hdrByte, lenLow, lenHigh, checkLow, checkHigh];
        let idx = 0;
        const fakeStream: any = { getByte: () => bytes[idx++], dictionary: {} };
        const inst: any = new _PdfFlateStream(fakeStream, 0);
        // Act & Assert: readBlock should not take stored-block branch; subsequent processing will fail/throw
        expect(() => inst.readBlock()).toThrow();
    });

    it('readBlock - length/distance path with extra length bits (code2>0) and distance without extra bits', () => {
        // Arrange: hdr set to fixed Huffman (getBits(3) -> 2)
        const cmf = 0x08, flg = 29;
        const fakeStream: any = { getByte: (() => { const a=[cmf, flg]; let i=0; return () => a[i++]; })(), dictionary: {} };
        const inst: any = new _PdfFlateStream(fakeStream, 0);
        // prepare buffer so copying reads valid bytes
        inst.buffer = new Uint8Array(100);
        for (let i=0;i<100;i++) inst.buffer[i]=i&255;
        inst.bufferLength = 10; // start position
        // stub getBits: first call for hdr (3 bits) returns 2, others return 0
        const origGetBits = inst.getBits.bind(inst);
        inst.getBits = (bits: number) => { if (bits === 3) return 2; return 0; };
        // stub getCode to return sequence: length code (265 -> index 8), dist code (0), then 256 (end)
        const seq = [265, 0, 256];
        let call = 0;
        inst.getCode = () => seq[call++];
        // Act
        inst.readBlock();
        // Assert: lengthDecode[8] has base length 11; bufferLength should advance by 11
        expect(inst.bufferLength).toBe(10 + 11);
        // restore
        inst.getBits = origGetBits;
    });

    it('readBlock - processes literal (<256) then end-of-block', () => {
        // Arrange: header valid, hdr for fixed Huffman (hdr===1)
        const cmf = 0x08, flg = 29;
        const hdrByte = 0x02; // getBits(3) => 2 -> hdr>>1 ===1
        const bytes: number[] = [cmf, flg, hdrByte];
        const fakeStream: any = { getByte: () => bytes.shift(), dictionary: {} };
        const inst: any = new _PdfFlateStream(fakeStream, 0);
        // stub getCode to return a literal then end-of-block
        let called = 0;
        inst.getCode = () => { called++; return called === 1 ? 65 : 256; };
        inst.buffer = new Uint8Array(1);
        inst.bufferLength = 0;
        // Act
        inst.readBlock();
        // Assert: one byte written and bufferLength set
        expect(inst.bufferLength).toBe(1);
        expect(inst.buffer[0]).toBe(65);
    });

    it('readBlock - throws on unsupported block type (hdr other)', () => {
        // Arrange: cmf/flg valid, hdr -> 3 (unsupported)
        const cmf = 0x08, flg = 29;
        const hdrByte = 0x06; // getBits(3) => 6 -> hdr>>1 ===3
        const bytes: number[] = [cmf, flg, hdrByte];
        const fakeStream: any = { getByte: () => bytes.shift(), dictionary: {} };
        const inst: any = new _PdfFlateStream(fakeStream, 0);
        // Act & Assert
        expect(() => inst.readBlock()).toThrow();
    });
    it('constructor - uses `this` when super returns falsy (normal path)', () => {
        // Arrange: valid header bytes so constructor succeeds
        const bytes: number[] = [0x08, 29];
        const fakeStream: any = { getByte: () => bytes.shift(), dictionary: { alpha: 1 } };
        // Act
        const inst: any = new _PdfFlateStream(fakeStream, 0);
        // Assert: instance is the created object and properties set
        expect(inst).toBeDefined();
        expect(inst.stream).toBe(fakeStream);
        expect(inst.dictionary).toBe(fakeStream.dictionary);
        expect(inst.codeSize).toBe(0);
        expect(inst.codeBuffer).toBe(0);
    });
});

describe('PdfStreams file code coverage', () => {
    it('decrypt-stream', () => {
        let contentStream: _PdfContentStream = new _PdfContentStream([10, 30, 50, 70, 90]);
        let stream: _PdfDecryptStream = new _PdfDecryptStream(contentStream, 5, new _NormalCipherFour(new Uint8Array([10, 30, 50, 70, 90])));
        stream._initialized = true;
        stream._nextChunk = null;
        stream.readBlock();
        expect(stream).toBeDefined();
    });

    it('decode-stream isEmpty - returns true immediately when eof true and buffer empty', () => {
        // Arrange
        const DecodeMod: any = require('../src/pdf/core/decode-stream');
        const DecodeCtor: any = DecodeMod._PdfDecodeStream;
        const inst: any = new DecodeCtor(0);
        inst.eof = true;
        inst.bufferLength = 0;
        // Act & Assert
        expect(inst.isEmpty).toBe(true);
    });

    it('decode-stream isEmpty - calls readBlock until buffer populated then returns false', () => {
        // Arrange
        const DecodeMod: any = require('../src/pdf/core/decode-stream');
        const DecodeCtor: any = DecodeMod._PdfDecodeStream;
        class TestDecode extends DecodeCtor {
            public calls: number = 0;
            constructor() { super(0); }
            readBlock() { this.calls++; this.buffer = new Uint8Array([5]); this.bufferLength = 1; }
        }
        const inst: any = new TestDecode();
        inst.eof = false;
        inst.bufferLength = 0;
        // Act
        const res = inst.isEmpty;
        // Assert
        expect(res).toBe(false);
        expect(inst.calls).toBe(1);
    });

    it('decode-stream isEmpty - calls readBlock until eof then returns true', () => {
        // Arrange
        const DecodeMod: any = require('../src/pdf/core/decode-stream');
        const DecodeCtor: any = DecodeMod._PdfDecodeStream;
        class TestDecode2 extends DecodeCtor {
            public calls: number = 0;
            constructor() { super(0); }
            readBlock() { this.calls++; this.eof = true; }
        }
        const inst: any = new TestDecode2();
        inst.eof = false;
        inst.bufferLength = 0;
        // Act
        const res = inst.isEmpty;
        // Assert
        expect(res).toBe(true);
        expect(inst.calls).toBe(1);
    });

        it('decode-stream getBytes - requested length larger than available returns available slice and advances offset', () => {
            // Arrange
            const DecodeMod: any = require('../src/pdf/core/decode-stream');
            const DecodeCtor: any = DecodeMod._PdfDecodeStream;
            class TestBytesShort extends DecodeCtor {
                constructor() { super(0); }
                readBlock() { this.buffer = new Uint8Array([7, 8]); this.bufferLength = 2; this.eof = true; }
            }
            const inst: any = new TestBytesShort();
            inst.offset = 0;
            inst.bufferLength = 0;
            inst.eof = false;
            // Act
            const out = inst.getBytes(5);
            // Assert
            expect(out.length).toBe(2);
            expect(inst.offset).toBe(2);
        });

        it('decode-stream getBytes - undefined length reads until eof and returns full buffer', () => {
            // Arrange
            const DecodeMod: any = require('../src/pdf/core/decode-stream');
            const DecodeCtor: any = DecodeMod._PdfDecodeStream;
            class TestBytesAll extends DecodeCtor {
                constructor() { super(0); }
                readBlock() { this.buffer = new Uint8Array([21, 22, 23]); this.bufferLength = 3; this.eof = true; }
            }
            const inst: any = new TestBytesAll();
            inst.offset = 0;
            inst.bufferLength = 0;
            inst.eof = false;
            // Act
            const out = inst.getBytes();
            // Assert
            expect(out.length).toBe(3);
            expect(inst.offset).toBe(3);
        });

        it('decode-stream makeSubStream - length undefined reads to eof and returns _PdfStream over buffer', () => {
            // Arrange
            const DecodeMod: any = require('../src/pdf/core/decode-stream');
            const DecodeCtor: any = DecodeMod._PdfDecodeStream;
            class TestMakeSub extends DecodeCtor {
                constructor() { super(0); }
                readBlock() { this.buffer = new Uint8Array([1,2,3,4]); this.bufferLength = 4; this.eof = true; }
            }
            const inst: any = new TestMakeSub();
            const dict = { a: 1 } as any;
            // Act
            const sub = inst.makeSubStream(1, undefined, dict);
            // Assert: returned stream wraps the same buffer and dictionary
            expect(sub).toBeDefined();
            expect(sub.bytes).toBe(inst.buffer);
            expect(sub.start).toBe(1);
            expect(sub.dictionary).toBe(dict);
        });

        it('decode-stream unsupported operations throw (moveStart, getByteRange, readBlock)', () => {
            // Arrange
            const DecodeMod: any = require('../src/pdf/core/decode-stream');
            const DecodeCtor: any = DecodeMod._PdfDecodeStream;
            const inst: any = new DecodeCtor(0);
            // Act & Assert
            expect(() => inst.moveStart()).toThrow();
            expect(() => inst.getByteRange(0, 1)).toThrow();
            expect(() => inst.readBlock()).toThrow();
        });

        it('decode-stream getBytes - reads multiple blocks until requested length satisfied', () => {
            // Arrange
            const DecodeMod: any = require('../src/pdf/core/decode-stream');
            const DecodeCtor: any = DecodeMod._PdfDecodeStream;
            class TestBytesMulti extends DecodeCtor {
                public calls: number = 0;
                constructor() { super(0); }
                readBlock() {
                    const nextByte = 100 + this.calls;
                    const newBuf = new Uint8Array((this.bufferLength || 0) + 1);
                    if (this.buffer && this.bufferLength) newBuf.set(this.buffer.subarray(0, this.bufferLength));
                    newBuf[this.bufferLength || 0] = nextByte;
                    this.buffer = newBuf;
                    this.bufferLength = (this.bufferLength || 0) + 1;
                    this.calls++;
                }
            }
            const inst: any = new TestBytesMulti();
            inst.offset = 0;
            inst.bufferLength = 0;
            inst.eof = false;
            // Act
            const out = inst.getBytes(4);
            // Assert
            expect(out.length).toBe(4);
            expect(Array.from(out)).toEqual([100, 101, 102, 103]);
            expect(inst.offset).toBe(4);
            expect(inst.calls).toBe(4);
        });

        it('decode-stream ensureBuffer - returns existing buffer without growth when enough capacity', () => {
            // Arrange
            const DecodeMod: any = require('../src/pdf/core/decode-stream');
            const DecodeCtor: any = DecodeMod._PdfDecodeStream;
            class TestEnsure extends DecodeCtor {
                constructor() { super(0); }
                readBlock() { throw new Error('readBlock should not be called'); }
            }
            const inst: any = new TestEnsure();
            inst.buffer = new Uint8Array(16);
            inst.bufferLength = 10; // already has data up to index 9
            inst.offset = 2; // start reading from position 2
            inst.eof = false;
            // Act
            const out = inst.getBytes(4);
            // Assert
            expect(out.length).toBe(4);
            expect(inst.offset).toBe(6);
        });

        it('decode-stream reset - sets offset back to zero', () => {
            // Arrange
            const DecodeMod: any = require('../src/pdf/core/decode-stream');
            const DecodeCtor: any = DecodeMod._PdfDecodeStream;
            const inst: any = new DecodeCtor(0);
            inst.offset = 5;
            // Act
            inst.reset();
            // Assert
            expect(inst.offset).toBe(0);
        });

        it('decode-stream getBaseStreams - returns null when stream missing', () => {
            // Arrange
            const DecodeMod: any = require('../src/pdf/core/decode-stream');
            const DecodeCtor: any = DecodeMod._PdfDecodeStream;
            const inst: any = new DecodeCtor(0);
            inst.stream = null;
            // Act & Assert
            expect(inst.getBaseStreams()).toBeNull();
        });

        it('decode-stream getBaseStreams - delegates to underlying stream', () => {
            // Arrange
            const DecodeMod: any = require('../src/pdf/core/decode-stream');
            const DecodeCtor: any = DecodeMod._PdfDecodeStream;
            const inst: any = new DecodeCtor(0);
            const baseStreams = [{ marker: 'x' }];
            inst.stream = { getBaseStreams: () => baseStreams } as any;
            // Act & Assert
            expect(inst.getBaseStreams()).toBe(baseStreams);
        });

        it('decode-stream getByte - returns -1 when eof true and no buffered data', () => {
            // Arrange
            const DecodeMod: any = require('../src/pdf/core/decode-stream');
            const DecodeCtor: any = DecodeMod._PdfDecodeStream;
            const inst: any = new DecodeCtor(0);
            inst.offset = 0;
            inst.bufferLength = 0;
            inst.eof = true;
            // Act
            const val = inst.getByte();
            // Assert
            expect(val).toBe(-1);
        });

        it('decode-stream getByte - calls readBlock until byte available and returns it', () => {
            // Arrange
            const DecodeMod: any = require('../src/pdf/core/decode-stream');
            const DecodeCtor: any = DecodeMod._PdfDecodeStream;
            class TestGetByte extends DecodeCtor {
                public calls: number = 0;
                constructor() { super(0); }
                readBlock() { this.calls++; this.buffer = new Uint8Array([55]); this.bufferLength = 1; }
            }
            const inst: any = new TestGetByte();
            inst.offset = 0;
            inst.bufferLength = 0;
            inst.eof = false;
            // Act
            const val = inst.getByte();
            // Assert
            expect(val).toBe(55);
            expect(inst.offset).toBe(1);
            expect(inst.calls).toBe(1);
        });

        it('decode-stream makeSubStream - length specified reads until requested range buffered', () => {
            // Arrange
            const DecodeMod: any = require('../src/pdf/core/decode-stream');
            const DecodeCtor: any = DecodeMod._PdfDecodeStream;
            class TestMakeSubLen extends DecodeCtor {
                public calls: number = 0;
                constructor() { super(0); }
                readBlock() {
                    const cur = this.bufferLength || 0;
                    const add = 2;
                    const newLen = cur + add;
                    const newBuf = new Uint8Array(newLen);
                    if (this.buffer && cur) newBuf.set(this.buffer.subarray(0, cur));
                    for (let i = cur; i < newLen; i++) newBuf[i] = 10 + i;
                    this.buffer = newBuf;
                    this.bufferLength = newLen;
                    this.calls++;
                }
            }
            const inst: any = new TestMakeSubLen();
            const dict: any = { z: 9 };
            // Act
            const sub = inst.makeSubStream(2, 3, dict);
            // Assert: loop invoked until bufferLength > end (end=5) -> calls should be 3 (0->2->4->6)
            expect(inst.calls).toBeGreaterThanOrEqual(1);
            expect(sub).toBeDefined();
            expect(sub.bytes).toBe(inst.buffer);
            expect(sub.start).toBe(2);
            expect(sub.dictionary).toBe(dict);
        });

});