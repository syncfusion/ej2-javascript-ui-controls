
import { _PdfBigInt } from '../src/pdf/core/security/digital-signature/pdf-big-integer';

describe('PdfBigInt basic behaviors', () => {
    it('constructor default and zero string produce "0" and bigint 0', () => {
        const a: _PdfBigInt = new _PdfBigInt();
        const b: _PdfBigInt = new _PdfBigInt('000');
        const sA: string = a._toString();
        const sB: string = b._toString();
        const nA: bigint = a._toBigInt();
        const nB: bigint = b._toBigInt();
        expect(sA).toBe('0');
        expect(sB).toBe('0');
        expect(nA.toString()).toBe('0');
        expect(nB.toString()).toBe('0');
    });
    it('parses decimal string and preserves value in toString / toBigInt', () => {
        const big: _PdfBigInt = new _PdfBigInt('00123');
        expect(big._toString()).toBe('123');
        expect(big._toBigInt().toString()).toBe('123');
    });
    it('_add handles digit carry correctly', () => {
        const a: _PdfBigInt = new _PdfBigInt('9');
        const b: _PdfBigInt = new _PdfBigInt('19');
        a._add(1);
        b._add(5);
        expect(a._toString()).toBe('10');
        expect(b._toString()).toBe('24');
    });
    it('_multiply multiplies value by 256 correctly', () => {
        const value: _PdfBigInt = new _PdfBigInt('1');
        value._multiply();
        expect(value._toString()).toBe('256');
    });
    it('_bitLength returns correct values for small numbers (no timeout)', () => {
        expect(new _PdfBigInt('0')._bitLength()).toBe(0);
        expect(new _PdfBigInt('1')._bitLength()).toBe(1);
        expect(new _PdfBigInt('2')._bitLength()).toBe(2);
        expect(new _PdfBigInt('3')._bitLength()).toBe(2);
    });
    function multiplyTracker(this: any, originalMultiply: Function, counter: { count: number }): any {
        counter.count++;
        return originalMultiply.call(this);
    }
    function addTracker(this: any,originalAdd: Function,counter: { count: number },x: number): any {counter.count++;
        return originalAdd.call(this, x);
    }
    function emptyMultiply(): void {
        // intentionally empty
    }
    function emptyAdd(_x: number): void {
        // intentionally empty
    }
    it('_fromBytesBE should process every input byte exactly once', () => {
        const value: any = new _PdfBigInt();
        const multiplyCounter: { count: number } = { count: 0 };
        const addCounter: { count: number } = { count: 0 };
        const originalMultiply: Function = value._multiply;
        const originalAdd: Function = value._add;
        value._multiply = function (): any {return multiplyTracker.call(this, originalMultiply, multiplyCounter);};
        value._add = function (x: number): any {return addTracker.call(this, originalAdd, addCounter, x);};
        value._fromBytesBE(new Uint8Array([1, 2, 3]));
        expect(multiplyCounter.count).toBe(3);
        expect(addCounter.count).toBe(3);
    });
    it('_fromBytesBE should correctly convert single byte values', () => {
        const value: any = new _PdfBigInt();
        value._fromBytesBE(new Uint8Array([1]));
        expect(value.digits).toBeDefined();
        expect(value._bitLength()).toBe(1);
    });
    it('_fromBytesBE should initialize digits with a single zero element', () => {
        const value: any = new _PdfBigInt();
        const originalMultiply: Function = value._multiply;
        const originalAdd: Function = value._add;
        value._multiply = emptyMultiply;
        value._add = emptyAdd;
        value._fromBytesBE(new Uint8Array([1]));
        expect(value.digits).toBeDefined();
        expect(value.digits.length).toBe(1);
        expect(value.digits[0]).toBe(0);
        value._multiply = originalMultiply;
        value._add = originalAdd;
    });
});
