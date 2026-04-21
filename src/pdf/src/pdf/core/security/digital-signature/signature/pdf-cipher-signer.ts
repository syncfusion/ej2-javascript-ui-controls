import { _Sha256 } from '../../encryptors/secureHash-algorithm256';
import { _Sha1 } from '../../encryptors/secureHash-algorithm1';
import { _PdfRsaAlgorithm } from './algorithm-handler';
import { _PdfCryptographicEncoding } from './cryptographic-encoder';
import { _PdfNativeAccumulatorSink, _PdfNativeAlgorithmIdentifier, _PdfNativeHashInput } from './pdf-accumulator';
import { _PdfDigestInformation } from './pdf-digest-handler';
import { _ISigner } from './pdf-interfaces';
import { _Sha384, _Sha512 } from '../../encryptors/secureHash-algorithm512';
import { _RaceEvaluationMessageDigest } from '../../encryptors/evaluation-digest';
/**
 * Provides an internal RSA‑based message‑digest signer that computes a hash,
 * DER‑encodes the DigestInfo, and produces an RSA signature using PKCS#1 padding.
 *
 * @private
 */
export class _PdfRmdSigner implements _ISigner {
    private _digest: any; //eslint-disable-line
    private _output: _PdfNativeAccumulatorSink;
    private _input: _PdfNativeHashInput;
    private _isSigning: boolean = false;
    private _ronCipherEngine: _PdfCryptographicEncoding;
    private _id: _PdfNativeAlgorithmIdentifier;
    private _map: Map<string, string>;
    /**
     * Contains the requested digest algorithm name (e.g., "sha256").
     *
     * @private
     */
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
    /**
     * Populates the internal digest‑to‑OID map.
     *
     * @private
     * @returns {void} This method does not return a value.
     */
    _initializeMap(): void {
        this._map.set('sha1', '1.3.14.3.2.26');
        this._map.set('sha256', '2.16.840.1.101.3.4.2.1');
        this._map.set('sha384', '2.16.840.1.101.3.4.2.2');
        this._map.set('sha512', '2.16.840.1.101.3.4.2.3');
        this._map.set('md5', '1.3.36.3.2.1');
    }
    /**
     * Selects and returns the internal digest implementation for the given algorithm name.
     *
     * @private
     * @param {string} digest The requested digest algorithm (e.g., "sha256").
     * @returns {any} The digest implementation instance corresponding to the algorithm.
     */
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
    /**
     * Resolves the AlgorithmIdentifier for the given digest by looking up its OID.
     *
     * @private
     * @param {string} digest The requested digest algorithm (normalized case-insensitive).
     * @returns {_PdfNativeAlgorithmIdentifier} The AlgorithmIdentifier for the digest.
     * @throws {Error} If the digest is unsupported.
     */
    _getAlgorithmIdentifier(digest: string): _PdfNativeAlgorithmIdentifier {
        const normalizedDigest: string = digest.toLowerCase();
        const oid: string = this._getMap().get(normalizedDigest);
        if (!oid) {
            throw new Error(`Unsupported digest: ${digest}`);
        }
        return new _PdfNativeAlgorithmIdentifier(oid);
    }
    /**
     * Initializes the signer for signing or verification and prepares the RSA engine.
     *
     * @private
     * @param {boolean} isSigning Specifies whether to initialize for signature generation (true) or verification (false).
     * @param {any} parameters The RSA key parameters to use.
     * @returns {void} This method does not return a value.
     * @throws {Error} If a private key is missing for signing, or a public key is expected for verification.
     */
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
    /**
     * Feeds a segment of bytes into the ongoing digest computation.
     *
     * @private
     * @param {Uint8Array} input The source buffer containing data.
     * @param {number} inOff The start index within the buffer.
     * @param {number} length The number of bytes to read.
     * @returns {void} This method does not return a value.
     */
    _blockUpdate(input: Uint8Array, inOff: number, length: number): void {
        const data: Uint8Array = input.subarray(inOff, inOff + length);
        this._input._add(data);
    }
    /**
     * Finalizes the digest, DER‑encodes the DigestInfo, and produces the RSA signature.
     *
     * @private
     * @returns {Uint8Array | null} The generated signature, or null if no hash output is available.
     * @throws {Error} If the signer is not initialized for signing.
     */
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
    /**
     * Builds the DER‑encoded DigestInfo structure for the given hash value.
     *
     * @private
     * @param {Uint8Array} hash The raw digest bytes to wrap in DigestInfo.
     * @returns {Uint8Array} The DER‑encoded DigestInfo; may return the hash directly if no identifier is set.
     */
    _derEncode(hash: Uint8Array): Uint8Array {
        if (!this._id) {
            return hash;
        } else if (this._id && hash && hash.length > 0) {
            return new _PdfDigestInformation(this._id, hash)._getUniqueEncoded();
        }
        return new Uint8Array(0);
    }
    /**
     * Resets the internal accumulators and restarts chunked hashing.
     *
     * @private
     * @returns {void} This method does not return a value.
     */
    _reset(): void {
        this._output = new _PdfNativeAccumulatorSink();
        this._input = this._digest._startChunkedConversion(this._output);
    }
    /**
     * Updates the digest with a single byte value.
     *
     * @private
     * @param {number} input The byte value to add.
     * @returns {void} This method does not return a value.
     */
    _update(input: number): void {
        this._input._add(new Uint8Array([input]));
    }
    /**
     * Compares two byte arrays in constant order to determine equality.
     *
     * @private
     * @param {Uint8Array} a The first byte array.
     * @param {Uint8Array} b The second byte array.
     * @returns {boolean} True if the arrays are equal in length and content; otherwise, false.
     */
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
