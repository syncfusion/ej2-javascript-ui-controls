import { _getBigInt } from '../../utils';
export class _PdfBigInt {
    private digits: number[];
    constructor(decimalStr: string = '0') {
        this.digits = this._parseDecimalString(decimalStr);
    }
    _parseDecimalString(str: string): number[] {
        return str.split('').reverse().map((d: string) => parseInt(d, 10));
    }
    _toString(): string {
        return this.digits.slice().reverse().join('').replace(/^0+/, '') || '0';
    }
    _toBigInt(): bigint {
        const str: string = this.digits.slice().reverse().join('').replace(/^0+/, '') || '0';
        const bigIntConstructor: (value: string | number | boolean) => bigint = _getBigInt();
        return bigIntConstructor(str);
    }
    _add(n: number): void {
        let carry: number = n;
        for (let i: number = 0; i < this.digits.length || carry > 0; i++) {
            const sum: number = (this.digits[<number>i] || 0) + carry;
            this.digits[<number>i] = sum % 10;
            carry = Math.floor(sum / 10);
        }
    }
    _multiply(): void {
        let carry: number = 0;
        for (let i: number = 0; i < this.digits.length; i++) {
            const product: number = this.digits[<number>i] * 256 + carry;
            this.digits[<number>i] = product % 10;
            carry = Math.floor(product / 10);
        }
        while (carry > 0) {
            this.digits.push(carry % 10);
            carry = Math.floor(carry / 10);
        }
    }
    _bitLength(): number {
        const digits: number[] = this.digits.slice();
        let bits: number = 0;
        while (digits.length > 1 || digits[0] !== 0) {
            let carry: number = 0;
            for (let i: number = digits.length - 1; i >= 0; i--) {
                const current: number = carry * 10 + digits[<number>i];
                digits[<number>i] = Math.floor(current / 2);
                carry = current % 2;
            }
            while (digits.length > 1 && digits[digits.length - 1] === 0) {
                digits.pop();
            }
            bits++;
        }
        return bits;
    }
}
