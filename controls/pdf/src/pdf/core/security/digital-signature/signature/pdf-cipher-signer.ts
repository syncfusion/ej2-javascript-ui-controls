import { _Sha256 } from '../../encryptors/secureHash-algorithm256';
import { _Sha1 } from '../../encryptors/secureHash-algorithm1';
import { _PdfRsaAlgorithm } from './algorithm-handler';
import { _PdfCryptographicEncoding } from './cryptographic-encoder';
import { _PdfNativeAccumulatorSink, _PdfNativeAlgorithmIdentifier, _PdfNativeHashInput } from './pdf-accumulator';
import { _PdfDigestInformation } from './pdf-digest-handler';
import { _ISigner } from './pdf-interfaces';
import { _Sha384, _Sha512 } from '../../encryptors/secureHash-algorithm512';
import { _RaceEvaluationMessageDigest } from '../../encryptors/evaluation-digest';
export class _PdfRmdSigner implements _ISigner {
    private _digest: any; //eslint-disable-line
    private _output: _PdfNativeAccumulatorSink;
    private _input: _PdfNativeHashInput;
    private _isSigning: boolean = false;
    private _ronCipherEngine: _PdfCryptographicEncoding;
    private _id: _PdfNativeAlgorithmIdentifier;
    private _map: Map<string, string>;
    _algorithmName: string;
    constructor(digest: string) {
        this._algorithmName = digest;
        this._digest = this._getDigest(digest);
        this._output = new _PdfNativeAccumulatorSink();
        this._input = this._digest._startChunkedConversion(this._output);
        this._ronCipherEngine = new _PdfCryptographicEncoding(new _PdfRsaAlgorithm());
        this._id = this._getAlgorithmIdentifier(digest);
    }
    private _getMap(): Map<string, string> {
        if (!this._map) {
            this._map = new Map<string, string>();
            this._initializeMap();
        }
        return this._map;
    }
    _initializeMap(): void {
        this._map.set('sha1', '1.3.14.3.2.26');
        this._map.set('sha256', '2.16.840.1.101.3.4.2.1');
        this._map.set('sha384', '2.16.840.1.101.3.4.2.2');
        this._map.set('sha512', '2.16.840.1.101.3.4.2.3');
        this._map.set('md5', '1.3.36.3.2.1');
    }
    _getDigest(digest: string): any { // eslint-disable-line
        const normalizedDigest: string = digest.toLowerCase();
        switch (normalizedDigest) {
        case 'sha1':
        case 'sha-1':
            return new _Sha1();
        case 'sha256':
        case 'sha-256':
            return new _Sha256();
        case 'sha384':
        case 'sha-384':
            return new _Sha384();
        case 'sha512':
        case 'sha-512':
            return new _Sha512();
        case 'md5':
        case 'md-5':
            return new _RaceEvaluationMessageDigest();
        default:
            throw new Error(`Invalid digest algorithm: ${digest}`);
        }
    }
    _getAlgorithmIdentifier(digest: string): _PdfNativeAlgorithmIdentifier {
        const normalizedDigest: string = digest.toLowerCase();
        const oid: string = this._getMap().get(normalizedDigest);
        if (!oid) {
            throw new Error(`Unsupported digest: ${digest}`);
        }
        return new _PdfNativeAlgorithmIdentifier(oid);
    }
    _initialize(isSigning: boolean, parameters: any): void { //eslint-disable-line
        this._isSigning = isSigning;
        if (isSigning && parameters && !parameters.privateExponent) {
            throw new Error('Private key required for signing.');
        }
        if (!isSigning && parameters && parameters.privateExponent) {
            throw new Error('Public key required for verification.');
        }
        this._reset();
        this._ronCipherEngine._initialize(isSigning, parameters);
    }
    _blockUpdate(input: Uint8Array, inOff: number, length: number): void {
        const data: Uint8Array = input.subarray(inOff, inOff + length);
        this._input._add(data);
    }
    _generateSignature(): Uint8Array | null {
        if (!this._isSigning) {
            throw new Error('Invalid operation: not in signing mode');
        }
        this._input._close();
        const hash: Uint8Array = this._output._getResult();
        if (!hash || hash.length === 0) {
            return null;
        }
        const data: Uint8Array = this._derEncode(hash);
        return this._ronCipherEngine._processBlock(data, 0, data.length);
    }
    _derEncode(hash: Uint8Array): Uint8Array {
        if (!this._id) {
            return hash;
        } else if (this._id && hash && hash.length > 0) {
            return new _PdfDigestInformation(this._id, hash)._getUniqueEncoded();
        }
        return new Uint8Array(0);
    }
    _reset(): void {
        this._output = new _PdfNativeAccumulatorSink();
        this._input = this._digest._startChunkedConversion(this._output);
    }
    _update(input: number): void {
        this._input._add(new Uint8Array([input]));
    }
    _compareArrays(a: Uint8Array, b: Uint8Array): boolean {
        if (a.length !== b.length) {
            return false;
        }
        for (let i: number = 0; i < a.length; i++) {
            if (a[<number>i] !== b[<number>i]) {
                return false;
            }
        }
        return true;
    }
}
