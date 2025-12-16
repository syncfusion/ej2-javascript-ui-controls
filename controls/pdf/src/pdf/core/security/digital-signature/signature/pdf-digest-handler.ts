import { _PdfNativeAlgorithmIdentifier } from './pdf-accumulator';
export class _PdfDigestInformation {
    private _algorithm: _PdfNativeAlgorithmIdentifier;
    private _digest: Uint8Array;
    constructor(algorithm: _PdfNativeAlgorithmIdentifier, digest: Uint8Array) {
        this._algorithm = algorithm;
        this._digest = digest;
    }
    _getUniqueEncoded(): Uint8Array {
        const algorithmBytes: Uint8Array = this._algorithm._getEncoded();
        const digestBytes: Uint8Array = this._digest;
        const algorithmLength: number = algorithmBytes.length;
        const digestLength: number = digestBytes.length;
        const contentLength: number = algorithmLength + digestLength + 1 + this._getLengthBytes(digestLength).length;
        const result: number[] = [];
        result.push(0x30);
        const lengthBytes: number[] = this._getLengthBytes(contentLength);
        if (lengthBytes.length === 1) {
            result.push(lengthBytes[0]);
        } else {
            result.push(0x80 | (lengthBytes.length - 1));
            for (let i: number = 1; i < lengthBytes.length; i++) {
                result.push(lengthBytes[<number>i]);
            }
        }
        result.push(...Array.from(algorithmBytes));
        result.push(0x04);
        const digestLengthBytes: number[] = this._getLengthBytes(digestLength);
        if (digestLengthBytes.length === 1) {
            result.push(digestLengthBytes[0]);
        } else {
            result.push(0x80 | (digestLengthBytes.length - 1));
            for (let i: number = 1; i < digestLengthBytes.length; i++) {
                result.push(digestLengthBytes[<number>i]);
            }
        }
        result.push(...Array.from(digestBytes));
        return new Uint8Array(result);
    }
    _getLengthBytes(length: number): number[] {
        if (length < 128) {
            return [length];
        }
        const bytes: number[] = [];
        let tempLength: number = length;
        while (tempLength > 0) {
            bytes.unshift(tempLength & 0xFF);
            tempLength = Math.floor(tempLength / 256);
        }
        return [0x80 | bytes.length, ...bytes];
    }
}
