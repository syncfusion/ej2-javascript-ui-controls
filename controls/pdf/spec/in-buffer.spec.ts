import { _InBuffer } from '../src/pdf/core/compression/in-buffer';

describe('_InBuffer mutation coverage', () => {
    it('1041681-needsInput', () => {
        const buf: any = new _InBuffer();
        buf._setInput([0x10, 0x20, 0x30], 0, 3);
        expect(buf._needsInput()).toBe(false);
    });

    it('1041681-load16Bits', () => {
        const buf: any = new _InBuffer();
        buf._setInput([0xAA, 0xBB], 0, 2);
        buf._bInBuffer = 8;
        buf._bBuffer = 0;
        buf._load16Bits();
        expect(buf._bInBuffer).toBe(16);
        expect(buf._begin).toBe(1);
        expect(buf._bBuffer).toBe(0xAA00);
    });

    it('1041681-copyToAndOr', () => {
        const buf: any = new _InBuffer();
        buf._setInput([], 0, 0);
        buf._bInBuffer = 8;
        buf._bBuffer = 0x42;
        const output: number[] = new Array(10).fill(0xFF);
        const copied: number = buf._copyTo(output, 0, 1);
        expect(copied).toBe(1);
    });

    it('1041681-copyToLengthZero', () => {
        const buf: any = new _InBuffer();
        buf._setInput([], 0, 0);
        buf._bInBuffer = 8;
        buf._bBuffer = 0x77;
        const output: number[] = new Array(10).fill(0xFF);
        const copied: number = buf._copyTo(output, 0, 0);
        expect(copied).toBe(0);
    });

    it('1041681-copyToBInBufferZero', () => {
        const buf: any = new _InBuffer();
        buf._setInput([1, 2, 3], 0, 3);
        buf._bInBuffer = 0;
        const output: number[] = new Array(10).fill(0xFF);
        const copied: number = buf._copyTo(output, 0, 5);
        expect(copied).toBe(3);
    });

    it('1041681-copyToLow8Bits', () => {
        const buf: any = new _InBuffer();
        buf._setInput([0x00], 0, 1);
        buf._bInBuffer = 8;
        buf._bBuffer = 0x123400;
        const output: number[] = new Array(5).fill(0);
        buf._copyTo(output, 0, 1);
        expect(buf._bBuffer).toBe(0x1234);
    });

    it('1041681-copyTO', () => {
        const buf: any = new _InBuffer();
        buf._setInput([0x00], 0, 1);
        buf._bInBuffer = 16;
        buf._bBuffer = 0;
        const output: number[] = new Array(5).fill(0);
        buf._copyTo(output, 0, 1);
        expect(buf._bInBuffer).toBe(8);
    });

    it('1041681-copyToLengthDec', () => {
        const buf: any = new _InBuffer();
        buf._setInput([0x00], 0, 1);
        buf._bInBuffer = 16;
        buf._bBuffer = 0;
        const output: number[] = new Array(5).fill(0);
        const copied: number = buf._copyTo(output, 0, 2);
        expect(buf._bInBuffer).toBe(0);
        expect(copied).toBe(2);
    });

    it('1041681-copyToBitBufferCount', () => {
        const buf: any = new _InBuffer();
        buf._setInput([0x00], 0, 1);
        buf._bInBuffer = 8;
        buf._bBuffer = 0xAA;
        const output: number[] = new Array(5).fill(0);
        const copied: number = buf._copyTo(output, 0, 1);
        expect(copied).toBe(1);
        expect(buf._begin).toBe(0);
    });

    it('1041681-copyToEarlyReturn', () => {
        const buf: any = new _InBuffer();
        buf._setInput([0x55, 0x66, 0x77], 0, 3);
        buf._bInBuffer = 8;
        buf._bBuffer = 0xAA;
        const output: number[] = new Array(10).fill(0);
        buf._copyTo(output, 0, 1);
        expect(buf._begin).toBe(0);
    });

    it('1041681-copyToAvailMinus', () => {
        const buf: any = new _InBuffer();
        buf._setInput([0x10, 0x20, 0x30, 0x40], 1, 2);
        buf._bInBuffer = 0;
        const output: number[] = new Array(10).fill(0);
        const copied: number = buf._copyTo(output, 0, 10);
        expect(copied).toBe(2);
        expect(output[0]).toBe(0x20);
        expect(output[1]).toBe(0x30);
    });

    it('1041681-copyToNotCap', () => {
        const buf: any = new _InBuffer();
        buf._setInput([0x10, 0x20, 0x30, 0x40], 0, 4);
        buf._bInBuffer = 0;
        const output: number[] = new Array(10).fill(0);
        const copied: number = buf._copyTo(output, 0, 2);
        expect(copied).toBe(2);
    });

    it('1041681-copyToStrictGT', () => {
        const buf: any = new _InBuffer();
        buf._setInput([0x10, 0x20, 0x30], 0, 3);
        buf._bInBuffer = 0;
        const output: number[] = new Array(10).fill(0);
        const copied: number = buf._copyTo(output, 0, 3);
        expect(copied).toBe(3);
    });

    it('1041681-copyToForAnd', () => {
        const buf: any = new _InBuffer();
        buf._setInput([0x10, 0x20, 0x30], 0, 3);
        buf._bInBuffer = 0;
        const output: number[] = new Array(3).fill(0);
        const copied: number = buf._copyTo(output, 0, 0);
        expect(copied).toBe(0);
    });

    it('1041681-copyToForLengthStrict', () => {
        const buf: any = new _InBuffer();
        buf._setInput([0x10, 0x20, 0x30, 0x40], 0, 4);
        buf._bInBuffer = 0;
        const output: number[] = new Array(10).fill(0);
        const copied: number = buf._copyTo(output, 0, 2);
        expect(copied).toBe(2);
        expect(output[0]).toBe(0x10);
        expect(output[1]).toBe(0x20);
        expect(output[2]).toBe(0);
    });

    it('1041681-copyToForBufferStrict', () => {
        const buf: any = new _InBuffer();
        buf._setInput([0x10, 0x20, 0x30], 0, 3);
        buf._bInBuffer = 0;
        const output: number[] = new Array(10).fill(0);
        const copied: number = buf._copyTo(output, 0, 3);
        expect(copied).toBe(3);
        expect(output[0]).toBe(0x10);
        expect(output[1]).toBe(0x20);
        expect(output[2]).toBe(0x30);
    });

    it('1041681-copyToForOutputStrict', () => {
        const buf: any = new _InBuffer();
        buf._setInput([0x10, 0x20, 0x30, 0x40, 0x50], 0, 5);
        buf._bInBuffer = 0;
        const output: number[] = new Array(2).fill(0xFF);
        const copied: number = buf._copyTo(output, 0, 5);
        expect(copied).toBe(5);
        expect(output.length).toBe(2);
    });

    it('1041681-copyToBeginAdvance', () => {
        const buf: any = new _InBuffer();
        buf._setInput([0x10, 0x20, 0x30, 0x40, 0x50], 2, 5);
        buf._bInBuffer = 0;
        const output: number[] = new Array(10).fill(0);
        buf._copyTo(output, 0, 3);
        expect(buf._begin).toBe(5);
    });

    it('1041681-skipBitsBInBuffer', () => {
        const buf: any = new _InBuffer();
        buf._bInBuffer = 16;
        buf._bBuffer = 0;
        buf._skipBits(5);
        expect(buf._bInBuffer).toBe(11);
    });

    it('1041681-skipBitsBBuffer', () => {
        const buf: any = new _InBuffer();
        buf._bInBuffer = 16;
        buf._bBuffer = 0xF0;
        buf._skipBits(4);
        expect(buf._bBuffer).toBe(0x0F);
    });

    it('1041681-skipByteBoundaryShift', () => {
        const buf: any = new _InBuffer();
        buf._bInBuffer = 12;
        buf._bBuffer = 0xF0;
        buf._skipByteBoundary();
        expect(buf._bBuffer).toBe(0x0F);
    });

    it('1041681-skipByteBoundaryMod', () => {
        const buf: any = new _InBuffer();
        buf._bInBuffer = 4;
        buf._bBuffer = 0xFF;
        buf._skipByteBoundary();
        expect(buf._bBuffer).toBe(0x0F);
    });

    it('1041681-skipByteBoundaryRound', () => {
        const buf: any = new _InBuffer();
        buf._bInBuffer = 12;
        buf._bBuffer = 0;
        buf._skipByteBoundary();
        expect(buf._bInBuffer).toBe(8);
    });
});