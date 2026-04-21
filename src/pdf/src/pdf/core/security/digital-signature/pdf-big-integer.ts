import { _getBigInt } from '../../utils';
/**
 * Arbitrary-precision integer helper using decimal digit arrays for internal math.
 *
 * @private
 */
export class _PdfBigInt {
    private digits: number[];
    constructor(decimalStr: string = '0') {
        this.digits = this._parseDecimalString(decimalStr);
    }
    /**
     * Parse a decimal string into an internal reversed-digit array.
     *
     * @private
     * @param {string} str - Decimal string to parse.
     * @returns {number[]} Reversed array of decimal digits.
     */
    _parseDecimalString(str: string): number[] {
        return str.split('').reverse().map((d: string) => parseInt(d, 10));
    }
    /**
     * Serialize the internal big integer to its decimal string representation.
     *
     * @private
     * @returns {string} Decimal string representation of the integer.
     */
    _toString(): string {
        return this.digits.slice().reverse().join('').replace(/^0+/, '') || '0';
    }
    /**
     * Convert the internal decimal representation to a JavaScript `bigint`.
     *
     * @private
     * @returns {bigint} The numeric value as a `bigint`.
     */
    _toBigInt(): bigint {
        const str: string = this.digits.slice().reverse().join('').replace(/^0+/, '') || '0';
        const bigIntConstructor: (value: string | number | boolean) => bigint = _getBigInt();
        return bigIntConstructor(str);
    }
    /**
     * Add a small integer value to this big integer (in-place).
     *
     * @private
     * @param {number} n - Small integer to add.
     * @returns {void}
     */
    _add(n: number): void {
        let carry: number = n;
        for (let i: number = 0; i < this.digits.length || carry > 0; i++) {
            const sum: number = (this.digits[<number>i] || 0) + carry;
            this.digits[<number>i] = sum % 10;
            carry = Math.floor(sum / 10);
        }
    }
    /**
     * Multiply this big integer by 256 (in-place), used when decoding binary data.
     *
     * @private
     * @returns {void}
     */
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
    /**
     * Compute the bit-length of the integer value.
     *
     * @private
     * @returns {number} Number of bits required to represent the value.
     */
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
