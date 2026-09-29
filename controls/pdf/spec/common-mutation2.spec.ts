import { _BlockType, _InflaterState } from "../src/pdf/core/compression/enum";
import { _HuffmanTree } from "../src/pdf/core/compression/huffman-tree";
import { _Inflater } from "../src/pdf/core/compression/inflater";

describe('1038509 _Inflater constructor initialization', () => {
    it('1038509 static distance tree table initialized with expected entries', () => {
        const inflater: any = new _Inflater();
        expect(Array.isArray(inflater._staticDistanceTreeTable)).toBe(true);
        expect(inflater._staticDistanceTreeTable.length).toBe(32);
        expect(inflater._staticDistanceTreeTable[0]).toBe(0x00);
        expect(inflater._staticDistanceTreeTable[1]).toBe(0x10);
        expect(inflater._staticDistanceTreeTable[15]).toBe(0x1e);
        expect(inflater._staticDistanceTreeTable[31]).toBe(0x1f);
    });
    it('1038509 blBuffer initialized with four zero values', () => {
        const inflater: any = new _Inflater();
        expect(Array.isArray(inflater._blBuffer)).toBe(true);
        expect(inflater._blBuffer.length).toBe(4);
        expect(inflater._blBuffer[0]).toBe(0);
        expect(inflater._blBuffer[1]).toBe(0);
        expect(inflater._blBuffer[2]).toBe(0);
        expect(inflater._blBuffer[3]).toBe(0);
    });
    it('1038509 codeList initialized using maxLengthTree plus maxDepthTree', () => {
        const inflater: any = new _Inflater();
        const expectedLength: number = _HuffmanTree._maxLengthTree + _HuffmanTree._maxDepthTree;
        expect(Array.isArray(inflater._codeList)).toBe(true);
        expect(inflater._codeList.length).toBe(expectedLength);
        expect(inflater._codeList.length).not.toBe(0);
        expect(inflater._codeList.length).not.toBe(_HuffmanTree._maxLengthTree - _HuffmanTree._maxDepthTree);
    });
    it('1038509 codeList initialized with zero filled entries', () => {
        const inflater: any = new _Inflater();
        expect(inflater._codeList[0]).toBe(0);
        expect(inflater._codeList[1]).toBe(0);
        const lastIndex: number = inflater._codeList.length - 1;
        expect(inflater._codeList[lastIndex]).toBe(0);
    });
    it('1038509 cltcl initialized using nCLength size', () => {
        const inflater: any = new _Inflater();
        expect(Array.isArray(inflater._cltcl)).toBe(true);
        expect(inflater._cltcl.length).toBe(_HuffmanTree._nCLength);
        expect(inflater._cltcl.length).not.toBe(0);
    });
    it('1038509 cltcl initialized with zero filled values', () => {
        const inflater: any = new _Inflater();
        expect(inflater._cltcl[0]).toBe(0);
        expect(inflater._cltcl[1]).toBe(0);
        const lastIndex: number = inflater._cltcl.length - 1;
        expect(inflater._cltcl[lastIndex]).toBe(0);
    });
    it('1038509 finished returns true for done state', () => {
        const inflater: any = new _Inflater();
        inflater._inflaterState = _InflaterState.done;
        expect(inflater._finished).toBe(true);
    });
    it('1038509 finished returns true for vFooter state', () => {
        const inflater: any = new _Inflater();
        inflater._inflaterState = _InflaterState.vFooter;
        expect(inflater._finished).toBe(true);
    });
    it('1038509 finished returns false for readingBFinal state', () => {
        const inflater: any = new _Inflater();
        inflater._inflaterState = _InflaterState.readingBFinal;
        expect(inflater._finished).toBe(false);
    });
    it('1038509 finished returns false for decodeTop state', () => {
        const inflater: any = new _Inflater();
        inflater._inflaterState = _InflaterState.decodeTop;
        expect(inflater._finished).toBe(false);
    });
    it('1038509 inflate calls decode when copyTo returns zero bytes', () => {
        const inflater: any = new _Inflater();
        let decodeCallCount: number = 0;
        inflater._output = {
            _copyTo: (_bytes: Uint8Array, _offset: number, _length: number): any => {
                return { count: 0, data: _bytes };
            }
        };
        inflater._decode = (): boolean => {decodeCallCount++; return false;};
        inflater._inflaterState = _InflaterState.readingBFinal;
        const buffer: Uint8Array = new Uint8Array(8);
        const result: any = inflater._inflate(buffer, 0, 5);
        expect(result.count).toBe(0);
        expect(result.data).toBe(buffer);
        expect(decodeCallCount).toBe(1);
    });
    it('1038509 inflate does not finish when copyTo returns zero and length remains unchanged', () => {
        const inflater: any = new _Inflater();
        let receivedLength: number = -1;
        inflater._output = {
            _copyTo: (_bytes: Uint8Array, _offset: number, length: number): any => {
                receivedLength = length;
                return { count: 0, data: _bytes };
            }
        };
        inflater._decode = (): boolean => false;
        inflater._inflaterState = _InflaterState.readingBFinal;
        const buffer: Uint8Array = new Uint8Array(10);
        const result: any = inflater._inflate(buffer, 0, 6);
        expect(receivedLength).toBe(6);
        expect(result.count).toBe(0);
    });
    it('1038509 static block creates separate distance tree', () => {
        const inflater: any = new _Inflater();
        inflater._inflaterState = _InflaterState.readingBType;
        let bitCallCount: number = 0;
        inflater._input = {
            _availableBits: (_count: number): boolean => true,
            _getBits: (_count: number): number => { bitCallCount++; return 1; }
        };
        inflater._decodeBlock = (eob: boolean): any => {
            return { result: true, eob, output: inflater._output };
        };
        inflater._decode();
        expect(inflater._llTree).toBeDefined();
        expect(inflater._distanceTree).toBeDefined();
        expect(inflater._distanceTree).not.toBe(inflater._llTree);
        expect(inflater._inflaterState).toBe(_InflaterState.decodeTop);
    });
    it('1038509 static type calls decodeBlock and skips uncompressed block', () => {
        const inflater: any = new _Inflater();
        inflater._blockType = _BlockType.staticType;
        inflater._inflaterState = _InflaterState.decodeTop;
        let decodeBlockCalled: boolean = false;
        let decodeUncompressedCalled: boolean = false;
        inflater._decodeBlock = (_eob: boolean): any => {
            decodeBlockCalled = true;
            return { result: true, eob: false, output: inflater._output };
        };
        inflater._decodeUncompressedBlock = (_eob: boolean): any => {
            decodeUncompressedCalled = true;
            return { result: true, eob: false, output: inflater._output };
        };
        inflater._decode();
        expect(decodeBlockCalled).toBe(true);
        expect(decodeUncompressedCalled).toBe(false);
    });
    it('1038509 decode sets state to done when final block reached', () => {
        const inflater: any = new _Inflater();
        inflater._blockType = _BlockType.staticType;
        inflater._inflaterState = _InflaterState.decodeTop;
        inflater._bfinal = 1;
        inflater._decodeBlock = (_eob: boolean): any => {
            return { result: true, eob: true, output: inflater._output };
        };
        const result: boolean = inflater._decode();
        expect(result).toBe(true);
        expect(inflater._inflaterState).toBe(_InflaterState.done);
    });
    it('1038509 distance tree loads with false parameter', () => {
        const inflater: any = new _Inflater();
        const receivedValues: boolean[] = [];
        function TestTree(): void {}
        (TestTree as any).prototype._loadTree = (value: boolean): void => { receivedValues.push(value); };
        inflater._input = {
            _availableBits: (_count: number): boolean => true,
            _getBits: (count: number): number => {
                if (count === 1) {
                    return 0;
                }
                return _BlockType.staticType;
            }
        };
        const previousTree: any = _HuffmanTree;
        (_HuffmanTree as any) = TestTree;
        inflater._decodeBlock = (_eob: boolean): any => {
            return {
                result: true,
                eob: false,
                output: inflater._output
            };
        };
        inflater._decode();
        expect(receivedValues.length).toBe(2);
        expect(receivedValues[0]).toBe(true);
        expect(receivedValues[1]).toBe(false);
        (_HuffmanTree as any) = previousTree;
    });
    it('1038509 aligning state returns false when uncompressed byte fails', () => {
        const inflater: any = new _Inflater();
        let skipBoundaryCalled: boolean = false;
        inflater._inflaterState = _InflaterState.unCompressedAligning;
        inflater._input = { _skipByteBoundary: (): void => { skipBoundaryCalled = true; }};
        inflater._unCompressedByte = (): boolean => false;
        const result: any = inflater._decodeUncompressedBlock(false);
        expect(skipBoundaryCalled).toBe(true);
        expect(result.result).toBe(false);
        expect(result.eob).toBe(false);
        expect(inflater._inflaterState).toBe(_InflaterState.unCompressedByte1);
    });
    it('1038509 byte state returns false when uncompressed byte fails', () => {
        const inflater: any = new _Inflater();
        inflater._inflaterState = _InflaterState.unCompressedByte1;
        let invocationCount: number = 0;
        inflater._unCompressedByte = (): boolean => {
            invocationCount++;
            return false;
        };
        const result: any = inflater._decodeUncompressedBlock(false);
        expect(invocationCount).toBe(1);
        expect(result.result).toBe(false);
        expect(result.eob).toBe(false);
    });
    it('1038509 decodeUncompressedBlock invokes unCompressedByte from aligning state', () => {
        const inflater: any = new _Inflater();
        inflater._inflaterState = _InflaterState.unCompressedAligning;
        let callCount: number = 0;
        inflater._input = {_skipByteBoundary: (): void => {}};
        inflater._unCompressedByte = (): boolean => {
            callCount++;
            throw new Error('Expected path reached');
        };
        expect(() => {inflater._decodeUncompressedBlock(false);}).toThrow();
        expect(callCount).toBe(1);
    });
    it('1038509 decodeUncompressedBlock exits when unCompressedByte returns false', () => {
        const inflater: any = new _Inflater();
        inflater._inflaterState = _InflaterState.unCompressedByte1;
        inflater._unCompressedByte = (): boolean => false;
        const result: any = inflater._decodeUncompressedBlock(false);
        expect(result.result).toBe(false);
    });
});
describe('1038509 _readingCodes line _clCodeCount less than zero', () => {
    it('1038509 _readingCodes accepts zero code count', () => {
        const inflater: any = new _Inflater();
        inflater._input = {
            _getBits: (_count: number): number => 0
        };
        let readingCLCodesCalled: boolean = false;
        inflater._readingCLCodes = (): boolean => {
            readingCLCodesCalled = true;
            return true;
        };
        const result: boolean = inflater._readingCodes();
        expect(result).toBe(true);
        expect(readingCLCodesCalled).toBe(true);
        expect(inflater._clCodeCount).toBe(4);
        expect(inflater._loopCounter).toBe(0);
        expect(inflater._inflaterState).toBe(_InflaterState.readingClCodes);
    });
    it('1038509 _inLength throws when length equals lengthBase length', () => {
        const inflater: any = new _Inflater();
        inflater._extraBits = 1;
        inflater._length = inflater._lengthBase.length;
        inflater._input = { _getBits: (_count: number): number => 0};
        expect(() => {inflater._inLength(100);}).toThrow();
    });
    it('1038509 maps distance code using static distance table', () => {
        const inflater: any = new _Inflater();
        inflater._blockType = _BlockType.staticType;
        inflater._input = { _getBits: (_count: number): number => 1 };
        let receivedDistanceCode: number;
        inflater._dcode = (fb: number): any => {
            receivedDistanceCode = inflater._distanceCode;
            return { value: true, fb: fb };
        };
        const result: any = inflater._fLength(50);
        expect(result.value).toBe(true);
        expect(receivedDistanceCode).toBe(16);
        expect(inflater._distanceCode).toBe(16);
        expect(inflater._inflaterState).toBe(_InflaterState.dCode);
    });
    it('1038509 accepts zero llCodeCount value', () => {
        const inflater: any = new _Inflater();
        inflater._inflaterState = _InflaterState.readingNlCodes;
        inflater._input = { _getBits: (_count: number): number => 0};
        let readingNDCodesCalled: boolean = false;
        inflater._readingNDCodes = (): boolean => {
            readingNDCodesCalled = true;
            return false;
        };
        const result: boolean = inflater._decodeDynamicBlockHeader();
        expect(result).toBe(false);
        expect(readingNDCodesCalled).toBe(true);
        expect(inflater._llCodeCount).toBe(257);
    });
    it('1038509 returns false when llCodeCount is negative', () => {
        const inflater: any = new _Inflater();
        inflater._inflaterState = _InflaterState.readingNlCodes;
        inflater._input = { _getBits: (_count: number): number => -1};
        let readingNDCodesCalled: boolean = false;
        inflater._readingNDCodes = (): boolean => {
            readingNDCodesCalled = true;
            return true;
        };
        const result: boolean = inflater._decodeDynamicBlockHeader();
        expect(result).toBe(false);
        expect(readingNDCodesCalled).toBe(false);
    });
    it('1038509 creates distance tree array using maxDepthTree length', () => {
        const inflater: any = new _Inflater();
        inflater._inflaterState = _InflaterState.readingNdCodes;
        inflater._llCodeCount = 5;
        inflater._dCodeCount = 3;
        inflater._readingNDCodes = (): boolean => true;
        let llLength: number = -1;
        let distanceLength: number = -1;
        inflater._llTree = {_load: (data: number[]): void => {llLength = data.length;}};
        inflater._distanceTree = { _load: (data: number[]): void => {distanceLength = data.length;}};
        function Tree(): void {}
        let invocationCount: number = 0;
        (Tree as any).prototype._load = (data: number[]): void => {
            invocationCount++;
            if (invocationCount === 1) {
                llLength = data.length;
            } else {
                distanceLength = data.length;
            }
        };
        const previousTree: any = _HuffmanTree;
        (_HuffmanTree as any) = Tree;
        const result: boolean = inflater._decodeDynamicBlockHeader();
        expect(result).toBe(true);
        expect(distanceLength).toBeGreaterThan(0);
        (_HuffmanTree as any) = previousTree;
    });
    it('1038509 accepts literal length code fifteen', () => {
        const inflater: any = new _Inflater();
        inflater._caSize = 1;
        inflater._loopCounter = 0;
        inflater._inflaterState = _InflaterState.readingTcBefore;
        inflater._clTree = {_getNextSymbol: (_input: any): number => 15};
        const result: boolean = inflater._readingTCBefore();
        expect(result).toBe(true);
        expect(inflater._loopCounter).toBe(1);
        expect(inflater._codeList[0]).toBe(15);
        expect(inflater._inflaterState).toBe(_InflaterState.readingTcBefore);
    });
    it('1038509 throws when repeat sixteen appears at first position', () => {
        const inflater: any = new _Inflater();
        inflater._caSize = 1;
        inflater._loopCounter = 0;
        inflater._inflaterState = _InflaterState.readingTcBefore;
        inflater._clTree = { _getNextSymbol: (_input: any): number => 16};
        inflater._input = {
            _availableBits: (_count: number): boolean => true,
            _getBits: (_count: number): number => 0
        };
        expect(() => {inflater._readingTCBefore();}).toThrow();
    });
});
