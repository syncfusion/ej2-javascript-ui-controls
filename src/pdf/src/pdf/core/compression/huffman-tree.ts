import { _InBuffer } from './in-buffer';
import { _toUnsigned, _toSigned16 } from './../utils';

export class _HuffmanTree {
    static _maxLengthTree: number = 288;
    static _maxDepthTree: number = 32;
    static _nCLength: number = 19;
    _tBits: number;
    _table: number[];
    _left: number[];
    _right: number[];
    _clArray: number[];
    _tMask: number;
    _load(code: number[]) : void {
        this._clArray = code;
        this._initialize();
    }
    _loadTree(isLengthTree: boolean): void {
        this._clArray = isLengthTree ? this._getLengthTree() : this._getDepthTree();
        this._initialize();
    }
    _initialize(): void {
        if (this._clArray.length === _HuffmanTree._maxLengthTree) {
            this._tBits = 9;
        } else {
            this._tBits = 7;
        }
        this._tMask = (1 << this._tBits) - 1;
        this._createTable();
    }
    _getLengthTree(): number[] {
        const lTree: number[] = Array<number>(_HuffmanTree._maxLengthTree).fill(0);
        for (let i: number = 0; i <= 143; i++) {
            lTree[Number.parseInt(i.toString(), 10)] = _toUnsigned(8, 8);
        }
        for (let i: number = 144; i <= 255; i++) {
            lTree[Number.parseInt(i.toString(), 10)] = _toUnsigned(9, 8);
        }
        for (let i: number = 256; i <= 279; i++) {
            lTree[Number.parseInt(i.toString(), 10)] = _toUnsigned(7, 8);
        }
        for (let i: number = 280; i <= 287; i++) {
            lTree[Number.parseInt(i.toString(), 10)] = _toUnsigned(8, 8);
        }
        return lTree;
    }
    _getDepthTree(): number[] {
        return Array<number>(_HuffmanTree._maxDepthTree).fill(5);
    }
    _calculateHashCode(): number[] {
        const bit: number[] = Array<number>(17).fill(0);
        for (let i: number = 0; i < this._clArray.length; i++) {
            bit[this._clArray[Number.parseInt(i.toString(), 10)]]++;
        }
        bit[0] = 0;
        const next: number[] = Array<number>(17).fill(0);
        let temp: number = 0;
        for (let bits: number = 1; bits <= 16; bits++) {
            temp = (temp + bit[bits - 1]) << 1;
            next[Number.parseInt(bits.toString(), 10)] = temp;
        }
        const code: number[] = Array<number>(_HuffmanTree._maxLengthTree).fill(0);
        for (let i: number = 0; i < this._clArray.length; i++) {
            const len: number = this._clArray[Number.parseInt(i.toString(), 10)];
            if (len > 0) {
                code[Number.parseInt(i.toString(), 10)] = this._bitReverse(next[Number.parseInt(len.toString(), 10)], len);
                next[Number.parseInt(len.toString(), 10)]++;
            }
        }
        return code;
    }
    _bitReverse(code: number, length: number): number {
        let newcode: number = 0;
        do {
            newcode |= code & 1;
            newcode <<= 1;
            code >>= 1;
        } while (--length > 0);
        return newcode >> 1;
    }
    _createTable(): void {
        const codeArray: number[] = this._calculateHashCode();
        this._table = Array<number>(1 << this._tBits).fill(0);
        this._left = Array<number>(2 * this._clArray.length).fill(0);
        this._right = Array<number>(2 * this._clArray.length).fill(0);
        let avail: number = _toSigned16(this._clArray.length);
        for (let ch: number = 0; ch < this._clArray.length; ch++) {
            const len: number = this._clArray[Number.parseInt(ch.toString(), 10)];
            if (len > 0) {
                let start: number = codeArray[Number.parseInt(ch.toString(), 10)];
                if (len <= this._tBits) {
                    const i: number = 1 << len;
                    if (start >= i) {
                        throw new Error('Invalid Data.');
                    }
                    const l: number = 1 << (this._tBits - len);
                    for (let j: number = 0; j < l; j++) {
                        this._table[Number.parseInt(start.toString(), 10)] = _toSigned16(ch);
                        start += i;
                    }
                } else {
                    let ofBits: number = len - this._tBits;
                    let bitMask: number = 1 << this._tBits;
                    let index: number = start & ((1 << this._tBits) - 1);
                    let array: number[] = this._table;
                    do {
                        let value: number = _toSigned16(array[Number.parseInt(index.toString(), 10)]);
                        if (value === 0) {
                            array[Number.parseInt(index.toString(), 10)] = _toSigned16(-avail);
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
                    array[Number.parseInt(index.toString(), 10)] = _toSigned16(ch);
                }
            }
        }
    }
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
                    symbol = this._left[Number.parseInt(symbol.toString(), 10)];
                } else {
                    symbol = this._right[Number.parseInt(symbol.toString(), 10)];
                }
                mask <<= 1;
            } while (symbol < 0);
        }
        const codeLength: number = this._clArray[Number.parseInt(symbol.toString(), 10)];
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
