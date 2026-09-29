import { _DeflateStream } from "../src/pdf/core/compression/deflate-stream";

describe('_DeflateStream _readBytes mutation coverage', () => {
    it('1041672-notReadMoreThanBuffer', () => {
        const data: number[] = [];
        for (let i: number = 0; i < 9000; i++) {
            data.push(i % 256);
        }
        const stream: any = new _DeflateStream([], 9010);
        stream._data = data;
        const result = stream._readBytes();
        expect(result.count).toBe(0);
        expect(stream._offset).toBe(9010);
        expect(result.buffer.length).toBe(0);
    });
    it('1041672-notReadMoreThanBuffer1', () => {
        const data: number[] = [];
        for (let i: number = 0; i < 9000; i++) {
            data.push(i % 256);
        }
        const stream: any = new _DeflateStream([], 9000);
        stream._data = data;
        const result = stream._readBytes();
        expect(result.count).toBe(0);
        expect(stream._offset).toBe(9000);
        expect(result.buffer.length).toBe(0);
    });
    it('1041672-stopAtBufferBoundary', () => {
        const data: number[] = [];
        for (let i: number = 0; i < 8193; i++) {
            data.push(i);
        }
        const stream: any = new _DeflateStream([], 0);
        stream._data = data;
        const result = stream._readBytes();
        expect(result.count).toBe(8192);
        expect(stream._offset).toBe(8192);
    });
    it('1041672-respectOffset', () => {
        const data: number[] = [10, 20, 30, 40, 50];
        const stream: any = new _DeflateStream([], 4);
        stream._data = data;
        const result = stream._readBytes();
        expect(result.count).toBe(1);
        expect(result.buffer[0]).toBe(50);
        expect(stream._offset).toBe(5);
    });
    it('1041672-readRemainingBytes', () => {
        const data: number[] = [1, 2, 3, 4, 5];
        const stream: any = new _DeflateStream([], 3);
        stream._data = data;
        const result = stream._readBytes();
        expect(result.count).toBe(2);
        expect(result.buffer[0]).toBe(4);
        expect(result.buffer[1]).toBe(5);
        expect(stream._offset).toBe(5);
    });
    it('1041672-stopWhenInflaterFinished', () => {
        const stream: any = new _DeflateStream([], 0);
        let inflateCallCount: number = 0;
        stream._inflater = {
            _finished: true,
            _inflate: (array: number[], offset: number, count: number) => {
                inflateCallCount++;
                return {
                    count: 0,
                    data: array
                };
            },
            _setInput: () => {
                // no-op
            }
        };
        const result = stream._read([], 0, 10);
        expect(result.count).toBe(0);
        expect(stream._buffer.length).toBe(8192);
        expect(inflateCallCount).toBe(1);
    });
    it('1041672-stopWhenInflaterNotFinished1', () => {
        const stream: any = new _DeflateStream([], 0);
        let inflateCallCount: number = 0;
        stream._inflater = {
            _finished: false,
            _inflate: (array: number[], offset: number, count: number) => {
                inflateCallCount++;
                return {
                    count: 0,
                    data: array
                };
            },
            _setInput: () => {
                // no-op
            }
        };
        const result = stream._read([], 0, 10);
        expect(result.count).toBe(0);
        expect(stream._buffer.length).toBe(0);
        expect(inflateCallCount).toBe(1);
    });
    it('1041672-stopWhenInflaterNotFinished2', () => {
        const stream: any = new _DeflateStream([], 0);
        let inflateCallCount: number = 0;
        stream._inflater = {
            _finished: false,
            _inflate: (array: number[], offset: number, count: number) => {
                inflateCallCount++;
                return {
                    count: 0,
                    data: array
                };
            },
            _setInput: () => {
                // no-op
            }
        };
        const result = stream._read([], 0, 10);
        expect(result.count).toBe(0);
        expect(stream._buffer.length).toBe(0);
        expect(inflateCallCount).toBe(1);
    });
    it('1041672-doNotCallReadBytesWhenFinished', () => {
        const stream: any = new _DeflateStream([], 0);
        let readBytesCalled: boolean = false;
        stream._inflater = {
            _finished: true,
            _inflate: (array: number[], offset: number, count: number) => {
                return {
                    count: 0,
                    data: array
                };
            },
            _setInput: () => {
                // no-op
            }
        };
        stream._read([], 0, 5);
        expect(readBytesCalled).toBe(false);
    });
});
