import { _InBuffer } from './in-buffer';
import { _toUnsigned, _toSigned16 } from './../utils';
/**
 * Implements a Huffman decoding table with fast lookup and tree traversal.
 *
 * @private
 */
export class _HuffmanTree {
    /**
     * Maximum number of codes in the length/literal tree.
     *
     * @private
     */
    static _maxLengthTree: number = 288;
    /**
     * Maximum tree depth supported.
     *
     * @private
     */
    static _maxDepthTree: number = 32;
    /**
     * Number of code length codes.
     *
     * @private
     */
    static _nCLength: number = 19;
    /**
     * Number of bits used for initial table lookup.
     *
     * @private
     */
    _tBits: number;
    /**
     * Lookup table for fast Huffman decoding.
     *
     * @private
     */
    _table: number[];
    /**
     * Left child indices for the Huffman tree.
     *
     * @private
     */
    _left: number[];
    /**
     * Right child indices for the Huffman tree.
     *
     * @private
     */
    _right: number[];
    /**
     * Array of code lengths for symbols.
     *
     * @private
     */
    _clArray: number[];
    /**
     * Bit mask applied to table lookups.
     *
     * @private
     */
    _tMask: number;
    /**
     * Loads the code length array and builds the decoding structures.
     *
     * @private
     * @param {number[]} code Code length array.
     * @returns {void} nothing.
     */
    _load(code: number[]) : void {
        this._clArray = code;
        this._initialize();
    }
    /**
     * Loads the predefined length or distance tree and builds the decoding structures.
     *
     * @private
     * @param {boolean} isLengthTree Whether the tree is a literal/length tree.
     * @returns {void} nothing.
     */
    _loadTree(isLengthTree: boolean): void {
        this._clArray = isLengthTree ? this._getLengthTree() : this._getDepthTree();
        this._initialize();
    }
    /**
     * Initializes table size and bit mask and creates the primary decode table.
     *
     * @private
     * @returns {void} nothing.
     */
    _initialize(): void {
        if (this._clArray.length === _HuffmanTree._maxLengthTree) {
            this._tBits = 9;
        } else {
            this._tBits = 7;
        }
        this._tMask = (1 << this._tBits) - 1;
        this._createTable();
    }
    /**
     * Returns the fixed Huffman code lengths for the literal/length alphabet.
     *
     * @private
     * @returns {number[]} lengthTree.
     */
    _getLengthTree(): number[] {
        const lTree: number[] = Array<number>(_HuffmanTree._maxLengthTree).fill(0);
        for (let i: number = 0; i <= 143; i++) {
            lTree[<number>i] = _toUnsigned(8, 8);
        }
        for (let i: number = 144; i <= 255; i++) {
            lTree[<number>i] = _toUnsigned(9, 8);
        }
        for (let i: number = 256; i <= 279; i++) {
            lTree[<number>i] = _toUnsigned(7, 8);
        }
        for (let i: number = 280; i <= 287; i++) {
            lTree[<number>i] = _toUnsigned(8, 8);
        }
        return lTree;
    }
    /**
     * Returns the fixed Huffman code lengths for the distance alphabet.
     *
     * @private
     * @returns {number[]} depthTree.
     */
    _getDepthTree(): number[] {
        return Array<number>(_HuffmanTree._maxDepthTree).fill(5);
    }
    /**
     * Computes canonical Huffman codes for symbols based on code lengths.
     *
     * @private
     * @returns {number[]} canonicalCodes.
     */
    _calculateHashCode(): number[] {
        const bit: number[] = Array<number>(17).fill(0);
        for (let i: number = 0; i < this._clArray.length; i++) {
            bit[this._clArray[<number>i]]++;
        }
        bit[0] = 0;
        const next: number[] = Array<number>(17).fill(0);
        let temp: number = 0;
        for (let bits: number = 1; bits <= 16; bits++) {
            temp = (temp + bit[bits - 1]) << 1;
            next[<number>bits] = temp;
        }
        const code: number[] = Array<number>(_HuffmanTree._maxLengthTree).fill(0);
        for (let i: number = 0; i < this._clArray.length; i++) {
            const len: number = this._clArray[<number>i];
            if (len > 0) {
                code[<number>i] = this._bitReverse(next[<number>len], len);
                next[<number>len]++;
            }
        }
        return code;
    }
    /**
     * Reverses the lowest `length` bits of the given value.
     *
     * @private
     * @param {number} code Code value.
     * @param {number} length Number of bits to reverse.
     * @returns {number} reversedCode.
     */
    _bitReverse(code: number, length: number): number {
        let newcode: number = 0;
        do {
            newcode |= code & 1;
            newcode <<= 1;
            code >>= 1;
        } while (--length > 0);
        return newcode >> 1;
    }
    /**
     * Builds the fast lookup table and associated tree nodes for Huffman decoding.
     *
     * @private
     * @returns {void} nothing.
     */
    _createTable(): void {
        const codeArray: number[] = this._calculateHashCode();
        this._table = Array<number>(1 << this._tBits).fill(0);
        this._left = Array<number>(2 * this._clArray.length).fill(0);
        this._right = Array<number>(2 * this._clArray.length).fill(0);
        let avail: number = _toSigned16(this._clArray.length);
        for (let ch: number = 0; ch < this._clArray.length; ch++) {
            const len: number = this._clArray[<number>ch];
            if (len > 0) {
                let start: number = codeArray[<number>ch];
                if (len <= this._tBits) {
                    const i: number = 1 << len;
                    if (start >= i) {
                        throw new Error('Invalid Data.');
                    }
                    const l: number = 1 << (this._tBits - len);
                    for (let j: number = 0; j < l; j++) {
                        this._table[<number>start] = _toSigned16(ch);
                        start += i;
                    }
                } else {
                    let ofBits: number = len - this._tBits;
                    let bitMask: number = 1 << this._tBits;
                    let index: number = start & ((1 << this._tBits) - 1);
                    let array: number[] = this._table;
                    do {
                        let value: number = _toSigned16(array[<number>index]);
                        if (value === 0) {
                            array[<number>index] = _toSigned16(-avail);
                            value = _toSigned16(-avail);
                            avail++;
                        }
                        if (value > 0) {
                            throw new Error('Invalid Data.');
                        }
                        if ((start & bitMask) === 0) {
                            array = this._left;
                        } else {
                            array = this._right;
                        }
                        index = -value;
                        bitMask <<= 1;
                        ofBits--;
                    } while (ofBits !== 0);
                    array[<number>index] = _toSigned16(ch);
                }
            }
        }
    }
    /**
     * Decodes and returns the next symbol from the input bit buffer.
     *
     * @private
     * @param {_InBuffer} input Bitwise input buffer.
     * @returns {number} symbol or -1 if insufficient bits.
     */
    _getNextSymbol(input: _InBuffer): number {
        const bitBuffer: number = input._load16Bits();
        if (input._bInBuffer === 0) {
            return -1;
        }
        let symbol: number = this._table[bitBuffer & this._tMask];
        if (symbol < 0) {
            let mask: number = _toUnsigned((1 << this._tBits), 32);
            do {
                symbol = -symbol;
                if ((bitBuffer & mask) === 0) {
                    symbol = this._left[<number>symbol];
                } else {
                    symbol = this._right[<number>symbol];
                }
                mask <<= 1;
            } while (symbol < 0);
        }
        const codeLength: number = this._clArray[<number>symbol];
        if (codeLength <= 0) {
            throw new Error('Invalid Data.');
        }
        if (codeLength > input._bInBuffer) {
            return -1;
        }
        input._skipBits(codeLength);
        return symbol;
    }
}
