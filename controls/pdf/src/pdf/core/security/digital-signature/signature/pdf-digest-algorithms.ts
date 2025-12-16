import { _NistObjectIdentifiers, _PdfCryptographicObjectIdentifier } from './pdf-object-identifiers';
import { _Sha256 } from '../../encryptors/secureHash-algorithm256';
import { _Sha1 } from '../../encryptors/secureHash-algorithm1';
import { _Sha384, _Sha512 } from '../../encryptors/secureHash-algorithm512';
import { _RaceEvaluationMessageDigest } from '../../encryptors/evaluation-digest';
export class _PdfMessageDigestAlgorithms {
    readonly _secureHash1: string = 'SHA-1';
    readonly _secureHash256: string = 'SHA-256';
    readonly _secureHash384: string = 'SHA-384';
    readonly _secureHash512: string = 'SHA-512';
    private _names: Map<string, string>;
    private _digests: Map<string, string>;
    private _algorithms: Map<string, string>;
    constructor() {
        this._names = new Map<string, string>();
        this._digests = new Map<string, string>();
        this._algorithms = new Map<string, string>();
        this._initializeNameMappings();
        this._initializeDigestMappings();
        this._initializeAlgorithmMappings();
    }
    _initializeNameMappings(): void {
        this._names.set('1.2.840.113549.2.5', 'MD5');
        this._names.set('1.3.14.3.2.26', 'SHA1');
        this._names.set('2.16.840.1.101.3.4.2.1', 'SHA256');
        this._names.set('2.16.840.1.101.3.4.2.2', 'SHA384');
        this._names.set('2.16.840.1.101.3.4.2.3', 'SHA512');
        this._names.set('1.3.36.3.2.1', 'RIPEMD160');
        this._names.set('1.2.840.113549.1.1.4', 'MD5');
        this._names.set('1.2.840.113549.1.1.5', 'SHA1');
        this._names.set('1.2.840.113549.1.1.11', 'SHA256');
        this._names.set('1.2.840.113549.1.1.12', 'SHA384');
        this._names.set('1.2.840.113549.1.1.13', 'SHA512');
        this._names.set('1.2.840.10040.4.3', 'SHA1');
        this._names.set('2.16.840.1.101.3.4.3.2', 'SHA256');
        this._names.set('2.16.840.1.101.3.4.3.3', 'SHA384');
        this._names.set('2.16.840.1.101.3.4.3.4', 'SHA512');
        this._names.set('1.3.36.3.3.1.2', 'RIPEMD160');
    }
    _initializeDigestMappings(): void {
        this._digests.set('MD5', '1.2.840.113549.2.5');
        this._digests.set('MD-5', '1.2.840.113549.2.5');
        this._digests.set('SHA1', '1.3.14.3.2.26');
        this._digests.set('SHA-1', '1.3.14.3.2.26');
        this._digests.set('SHA256', '2.16.840.1.101.3.4.2.1');
        this._digests.set('SHA-256', '2.16.840.1.101.3.4.2.1');
        this._digests.set('SHA384', '2.16.840.1.101.3.4.2.2');
        this._digests.set('SHA-384', '2.16.840.1.101.3.4.2.2');
        this._digests.set('SHA512', '2.16.840.1.101.3.4.2.3');
        this._digests.set('SHA-512', '2.16.840.1.101.3.4.2.3');
        this._digests.set('RIPEMD160', '1.3.36.3.2.1');
        this._digests.set('RIPEMD-160', '1.3.36.3.2.1');
    }
    _initializeAlgorithmMappings(): void {
        const identifiers: _NistObjectIdentifiers = new _NistObjectIdentifiers();
        const algorithmIdentifiers: _PdfCryptographicObjectIdentifier = new _PdfCryptographicObjectIdentifier();
        this._algorithms.set('SHA1', 'SHA-1');
        this._algorithms.set('1.3.14.3.2.26', 'SHA-1');
        this._algorithms.set('SHA256', 'SHA-256');
        this._algorithms.set(identifiers._secureHash256AlgorithmIdentifier.id, 'SHA-256');
        this._algorithms.set('SHA384', 'SHA-384');
        this._algorithms.set(identifiers._secureHash384AlgorithmIdentifier.id, 'SHA-384');
        this._algorithms.set('SHA512', 'SHA-512');
        this._algorithms.set(identifiers._secureHash512AlgorithmIdentifier.id, 'SHA-512');
        this._algorithms.set('MD5', 'MD5');
        this._algorithms.set(algorithmIdentifiers._messageDigest5.id, 'MD5');
        this._algorithms.set('RIPEMD-160', 'RIPEMD160');
        this._algorithms.set('RIPEMD160', 'RIPEMD160');
        this._algorithms.set(identifiers._raceEvaluationMessageDigestAlgorithmIdentifier.id, 'RIPEMD160');
    }
    _getDigest(id: string): string {
        if (!id) {
            return null;
        }
        return this._names.get(id) || id;
    }
    _getAllowedDigests(name: string): string {
        const lower: string = name.toLowerCase();
        let result: string;
        this._digests.forEach((value: string, key: string) => {
            if ((typeof result === 'undefined' || result === null) && lower === key.toLowerCase()) {
                result = value;
            }
        });
        return result;
    }
    _getMessageDigest(hashAlgorithm: string): any { // eslint-disable-line
        const lower: string = hashAlgorithm.toLowerCase();
        let digest: string = lower;
        let found: boolean = false;
        this._algorithms.forEach((value: string, key: string) => {
            if (!found && key && key.toLowerCase() === lower) {
                digest = value;
                found = true;
            }
        });
        const normalizedDigest: string = digest.toLowerCase();
        if (normalizedDigest === 'sha1' || normalizedDigest === 'sha-1' || normalizedDigest === 'sha_1') {
            return new _Sha1();
        } else if (normalizedDigest === 'sha256' || normalizedDigest === 'sha-256' || normalizedDigest === 'sha_256') {
            return new _Sha256();
        } else if (normalizedDigest === 'sha384' || normalizedDigest === 'sha-384' || normalizedDigest === 'sha_384') {
            return new _Sha384();
        } else if (normalizedDigest === 'sha512' || normalizedDigest === 'sha-512' || normalizedDigest === 'sha_512') {
            return new _Sha512();
        } else if (normalizedDigest === 'ripemd160' || normalizedDigest === 'ripemd-160' || normalizedDigest === 'ripemd_160') {
            return new _RaceEvaluationMessageDigest();
        } else {
            throw new Error(`Invalid message digest algorithm: ${hashAlgorithm}`);
        }
    }
    _digest(data: Uint8Array, hashAlgorithm: string): Uint8Array {
        return this._getMessageDigest(hashAlgorithm)._hash(data, 0, data.length);
    }
}
