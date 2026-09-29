import { _PdfRsaCoreAlgorithm } from "../src/pdf/core/security/digital-signature/signature/algorithm-handler";
import { _PdfCryptographicEncoding } from "../src/pdf/core/security/digital-signature/signature/cryptographic-encoder";
import { _PdfNativeAccumulatorSink, _PdfNativeAlgorithmIdentifier, _PdfNativeHashInput } from "../src/pdf/core/security/digital-signature/signature/pdf-accumulator";
import { _PdfRmdSigner } from "../src/pdf/core/security/digital-signature/signature/pdf-cipher-signer";
import { _PdfMessageDigestAlgorithms } from "../src/pdf/core/security/digital-signature/signature/pdf-digest-algorithms";
import { _PdfDigestInformation } from "../src/pdf/core/security/digital-signature/signature/pdf-digest-handler";
import { _NistObjectIdentifiers, _PdfCryptographicObjectIdentifier, _PdfDigitalIdentifiers } from "../src/pdf/core/security/digital-signature/signature/pdf-object-identifiers";
import { _RaceEvaluationMessageDigest } from "../src/pdf/core/security/encryptors/evaluation-digest";
import { _Sha1 } from "../src/pdf/core/security/encryptors/secureHash-algorithm1";
import { _Sha256 } from "../src/pdf/core/security/encryptors/secureHash-algorithm256";
import { _Sha384, _Sha512 } from "../src/pdf/core/security/encryptors/secureHash-algorithm512";
import { _getBigInt, _modPow } from "../src/pdf/core/utils";
describe('1038509 _NistObjectIdentifiers constructor', () => {
    it('1038509 initializes all NIST algorithm identifiers with expected values', () => {
        const identifiers: any = new _NistObjectIdentifiers();
        expect(identifiers._secureHash256AlgorithmIdentifier).toBeDefined();
        expect(identifiers._secureHash256AlgorithmIdentifier.id).toBeDefined();
        expect(identifiers._secureHash256AlgorithmIdentifier.id).not.toBe('');
        expect(identifiers._secureHash256AlgorithmIdentifier.id).toBe('2.16.840.1.101.3.4.2.1');
        expect(identifiers._secureHash384AlgorithmIdentifier).toBeDefined();
        expect(identifiers._secureHash384AlgorithmIdentifier.id).toBeDefined();
        expect(identifiers._secureHash384AlgorithmIdentifier.id).not.toBe('');
        expect(identifiers._secureHash384AlgorithmIdentifier.id).toBe('2.16.840.1.101.3.4.2.2');
        expect(identifiers._secureHash512AlgorithmIdentifier).toBeDefined();
        expect(identifiers._secureHash512AlgorithmIdentifier.id).toBeDefined();
        expect(identifiers._secureHash512AlgorithmIdentifier.id).not.toBe('');
        expect(identifiers._secureHash512AlgorithmIdentifier.id).toBe('2.16.840.1.101.3.4.2.3');
        expect(identifiers._raceEvaluationMessageDigestAlgorithmIdentifier).toBeDefined();
        expect(identifiers._raceEvaluationMessageDigestAlgorithmIdentifier.id).toBeDefined();
        expect(identifiers._raceEvaluationMessageDigestAlgorithmIdentifier.id).not.toBe('');
        expect(identifiers._raceEvaluationMessageDigestAlgorithmIdentifier.id).toBe('1.3.36.3.2.1');
        expect(identifiers._digitalSignatureWithSecureHash256AlgorithmIdentifier).toBeDefined();
        expect(identifiers._digitalSignatureWithSecureHash256AlgorithmIdentifier.id).toBeDefined();
        expect(identifiers._digitalSignatureWithSecureHash256AlgorithmIdentifier.id).not.toBe('');
        expect(identifiers._digitalSignatureWithSecureHash256AlgorithmIdentifier.id).toBe('2.16.840.1.101.3.4.3.2');
        expect(identifiers._ronCipherWithRaceEvaluationAlgorithmIdentifier).toBeDefined();
        expect(identifiers._ronCipherWithRaceEvaluationAlgorithmIdentifier.id).toBeDefined();
        expect(identifiers._ronCipherWithRaceEvaluationAlgorithmIdentifier.id).not.toBe('');
        expect(identifiers._ronCipherWithRaceEvaluationAlgorithmIdentifier.id).toBe('1.3.36.3.3.1.2');
    });
    it('1038509 initializes messageDigest5 with exact oid value', () => {
        const identifiers: any = new _PdfCryptographicObjectIdentifier();
        expect(identifiers._messageDigest5).toBeDefined();
        expect(identifiers._messageDigest5.id).toBeDefined();
        expect(identifiers._messageDigest5.id).toBe('1.2.840.113549.2.5');
        expect(identifiers._messageDigest5.id).not.toBe('');
    });
    it('1038509 initializes all digital identifiers with expected values', () => {
        const identifiers: any = new _PdfDigitalIdentifiers();
        expect(identifiers._cryptographicData).toBe('1.2.840.113549.1.7.1');
        expect(identifiers._cryptographicSignedData).toBe('1.2.840.113549.1.7.2');
        expect(identifiers._rsaEncryption).toBe('1.2.840.113549.1.1.1');
        expect(identifiers._dsaSignature).toBe('1.2.840.10040.4.1');
        expect(identifiers._ecPublicKey).toBe('1.2.840.10045.2.1');
        expect(identifiers._contentType).toBe('1.2.840.113549.1.9.3');
        expect(identifiers._messageDigest).toBe('1.2.840.113549.1.9.4');
        expect(identifiers._signingCertificate).toBe('1.2.840.113549.1.9.16.2.47');
        expect(identifiers._revocation).toBe('1.2.840.113583.1.1.8');
    });
    it('1038509 _getLengthBytes encodes length 128 using long form encoding', () => {
        const algorithm: any = { _getEncoded: (): Uint8Array => new Uint8Array([1])};
        const digest: Uint8Array = new Uint8Array([1]);
        const information: _PdfDigestInformation = new _PdfDigestInformation(algorithm, digest);
        const result: number[] = information._getLengthBytes(128);
        expect(result).toBeDefined();
        expect(result.length).toBe(2);
        expect(result[0]).toBe(129);
        expect(result[1]).toBe(128);
        expect(result).not.toEqual([128]);
    });
});
describe('1038509 _PdfMessageDigestAlgorithms constructor', () => {
    it('1038509 initializes all secure hash names', () => {
        const algorithms: any = new _PdfMessageDigestAlgorithms();
        expect(algorithms._secureHash1).toBe('SHA-1');
        expect(algorithms._secureHash256).toBe('SHA-256');
        expect(algorithms._secureHash384).toBe('SHA-384');
        expect(algorithms._secureHash512).toBe('SHA-512');
        expect(algorithms._names.get('1.2.840.113549.2.5')).toBe('MD5');
        expect(algorithms._names.get('1.2.840.113549.1.1.4')).toBe('MD5');
        expect(algorithms._names.get('1.2.840.113549.2.5')).not.toBe('');
        expect(algorithms._names.get('1.3.14.3.2.26')).toBe('SHA1');
        expect(algorithms._names.get('1.2.840.113549.1.1.5')).toBe('SHA1');
        expect(algorithms._names.get('1.2.840.10040.4.3')).toBe('SHA1');
        expect(algorithms._names.get('1.3.14.3.2.26')).not.toBe('');
        expect(algorithms._names.get('1.2.840.113549.1.1.5')).not.toBe('');
        expect(algorithms._names.get('1.2.840.10040.4.3')).not.toBe('');
        expect(algorithms._names.get('2.16.840.1.101.3.4.2.1')).toBe('SHA256');
        expect(algorithms._names.get('1.2.840.113549.1.1.11')).toBe('SHA256');
        expect(algorithms._names.get('2.16.840.1.101.3.4.3.2')).toBe('SHA256');
        expect(algorithms._names.get('2.16.840.1.101.3.4.2.1')).not.toBe('');
        expect(algorithms._names.get('1.2.840.113549.1.1.11')).not.toBe('');
        expect(algorithms._names.get('2.16.840.1.101.3.4.3.2')).not.toBe('');
        expect(algorithms._names.get('2.16.840.1.101.3.4.2.2')).toBe('SHA384');
        expect(algorithms._names.get('1.2.840.113549.1.1.12')).toBe('SHA384');
        expect(algorithms._names.get('2.16.840.1.101.3.4.3.3')).toBe('SHA384');
        expect(algorithms._names.get('2.16.840.1.101.3.4.2.2')).not.toBe('');
        expect(algorithms._names.get('1.2.840.113549.1.1.12')).not.toBe('');
        expect(algorithms._names.get('2.16.840.1.101.3.4.3.3')).not.toBe('');
        expect(algorithms._names.get('2.16.840.1.101.3.4.2.3')).toBe('SHA512');
        expect(algorithms._names.get('1.2.840.113549.1.1.13')).toBe('SHA512');
        expect(algorithms._names.get('2.16.840.1.101.3.4.3.4')).toBe('SHA512');
        expect(algorithms._names.get('2.16.840.1.101.3.4.2.3')).not.toBe('');
        expect(algorithms._names.get('1.2.840.113549.1.1.13')).not.toBe('');
        expect(algorithms._names.get('2.16.840.1.101.3.4.3.4')).not.toBe('');
        expect(algorithms._names.get('1.3.36.3.2.1')).toBe('RIPEMD160');
        expect(algorithms._names.get('1.3.36.3.3.1.2')).toBe('RIPEMD160');
        expect(algorithms._names.get('1.3.36.3.2.1')).not.toBe('');
        expect(algorithms._names.get('1.3.36.3.3.1.2')).not.toBe('');
        expect(algorithms._digests.get('MD5')).toBe('1.2.840.113549.2.5');
        expect(algorithms._digests.get('MD-5')).toBe('1.2.840.113549.2.5');
        expect(algorithms._digests.get('MD5')).not.toBe('');
        expect(algorithms._digests.get('MD-5')).not.toBe('');
        expect(algorithms._digests.get('')).not.toBe('1.2.840.113549.2.5');
        expect(algorithms._digests.get('SHA1')).toBe('1.3.14.3.2.26');
        expect(algorithms._digests.get('SHA-1')).toBe('1.3.14.3.2.26');
        expect(algorithms._digests.get('SHA1')).not.toBe('');
        expect(algorithms._digests.get('SHA-1')).not.toBe('');
        expect(algorithms._digests.get('')).not.toBe('1.3.14.3.2.26');
        expect(algorithms._digests.get('SHA256')).toBe('2.16.840.1.101.3.4.2.1');
        expect(algorithms._digests.get('SHA-256')).toBe('2.16.840.1.101.3.4.2.1');
        expect(algorithms._digests.get('SHA256')).not.toBe('');
        expect(algorithms._digests.get('SHA-256')).not.toBe('');
        expect(algorithms._digests.get('')).not.toBe('2.16.840.1.101.3.4.2.1');
        expect(algorithms._digests.get('SHA384')).toBe('2.16.840.1.101.3.4.2.2');
        expect(algorithms._digests.get('SHA-384')).toBe('2.16.840.1.101.3.4.2.2');
        expect(algorithms._digests.get('SHA384')).not.toBe('');
        expect(algorithms._digests.get('SHA-384')).not.toBe('');
        expect(algorithms._digests.get('')).not.toBe('2.16.840.1.101.3.4.2.2');
        expect(algorithms._digests.get('SHA512')).toBe('2.16.840.1.101.3.4.2.3');
        expect(algorithms._digests.get('SHA-512')).toBe('2.16.840.1.101.3.4.2.3');
        expect(algorithms._digests.get('SHA512')).not.toBe('');
        expect(algorithms._digests.get('SHA-512')).not.toBe('');
        expect(algorithms._digests.get('')).not.toBe('2.16.840.1.101.3.4.2.3');
        expect(algorithms._digests.get('RIPEMD160')).toBe('1.3.36.3.2.1');
        expect(algorithms._digests.get('RIPEMD-160')).toBe('1.3.36.3.2.1');
        expect(algorithms._digests.get('RIPEMD160')).not.toBe('');
        expect(algorithms._digests.get('RIPEMD-160')).not.toBe('');
        expect(algorithms._digests.get('')).not.toBe('1.3.36.3.2.1');
        expect(algorithms._algorithms.get('SHA1')).toBe('SHA-1');
        expect(algorithms._algorithms.get('1.3.14.3.2.26')).toBe('SHA-1');
        expect(algorithms._algorithms.get('SHA1')).not.toBe('');
        expect(algorithms._algorithms.get('1.3.14.3.2.26')).not.toBe('');
        expect(algorithms._algorithms.get('')).not.toBe('SHA-1');
        expect(algorithms._algorithms.get('SHA256')).toBe('SHA-256');
        expect(algorithms._algorithms.get('2.16.840.1.101.3.4.2.1')).toBe('SHA-256');
        expect(algorithms._algorithms.get('SHA256')).not.toBe('');
        expect(algorithms._algorithms.get('2.16.840.1.101.3.4.2.1')).not.toBe('');
        expect(algorithms._algorithms.get('')).not.toBe('SHA-256');
        expect(algorithms._algorithms.get('SHA384')).toBe('SHA-384');
        expect(algorithms._algorithms.get('2.16.840.1.101.3.4.2.2')).toBe('SHA-384');
        expect(algorithms._algorithms.get('SHA384')).not.toBe('');
        expect(algorithms._algorithms.get('2.16.840.1.101.3.4.2.2')).not.toBe('');
        expect(algorithms._algorithms.get('')).not.toBe('SHA-384');
        expect(algorithms._algorithms.get('SHA512')).toBe('SHA-512');
        expect(algorithms._algorithms.get('2.16.840.1.101.3.4.2.3')).toBe('SHA-512');
        expect(algorithms._algorithms.get('SHA512')).not.toBe('');
        expect(algorithms._algorithms.get('2.16.840.1.101.3.4.2.3')).not.toBe('');
        expect(algorithms._algorithms.get('')).not.toBe('SHA-512');
        expect(algorithms._algorithms.get('MD5')).toBe('MD5');
        expect(algorithms._algorithms.get('1.2.840.113549.2.5')).toBe('MD5');
        expect(algorithms._algorithms.get('MD5')).not.toBe('');
        expect(algorithms._algorithms.get('1.2.840.113549.2.5')).not.toBe('');
        expect(algorithms._algorithms.get('')).not.toBe('MD5');
        expect(algorithms._algorithms.get('RIPEMD-160')).toBe('RIPEMD160');
        expect(algorithms._algorithms.get('RIPEMD160')).toBe('RIPEMD160');
        expect(algorithms._algorithms.get('1.3.36.3.2.1')).toBe('RIPEMD160');
        expect(algorithms._algorithms.get('RIPEMD-160')).not.toBe('');
        expect(algorithms._algorithms.get('RIPEMD160')).not.toBe('');
        expect(algorithms._algorithms.get('1.3.36.3.2.1')).not.toBe('');
        expect(algorithms._algorithms.get('')).not.toBe('RIPEMD160');
    });
    it('1038509 _getDigest returns null for undefined and empty values', () => {
        const algorithms: any = new _PdfMessageDigestAlgorithms();
        expect(algorithms._getDigest(undefined)).toBeNull();
        expect(algorithms._getDigest(null)).toBeNull();
        expect(algorithms._getDigest('')).toBeNull();
    });
});
describe('1038509 _getMessageDigest mutation coverage', () => {
    it('1038509 resolves mixed case SHA256 name', () => {
        const algorithms: _PdfMessageDigestAlgorithms = new _PdfMessageDigestAlgorithms();
        expect(() => algorithms._getMessageDigest('sha1')).not.toThrowError('Invalid message digest algorithm: sha1')
        expect(() => algorithms._getMessageDigest('sha_1')).not.toThrowError('Invalid message digest algorithm: sha_1')
        expect(() => algorithms._getMessageDigest('sha256')).not.toThrowError('Invalid message digest algorithm: sha256')
        expect(() => algorithms._getMessageDigest('sha_256')).not.toThrowError('Invalid message digest algorithm: sha_256')
        expect(() => algorithms._getMessageDigest('sha384')).not.toThrowError('Invalid message digest algorithm: sha384')
        expect(() => algorithms._getMessageDigest('sha_384')).not.toThrowError('Invalid message digest algorithm: sha_384')
        expect(() => algorithms._getMessageDigest('sha512')).not.toThrowError('Invalid message digest algorithm: sha512')
        expect(() => algorithms._getMessageDigest('sha_512')).not.toThrowError('Invalid message digest algorithm: sha_512')
        expect(() => algorithms._getMessageDigest('ripemd-160')).not.toThrowError('Invalid message digest algorithm: ripemd-160')
        expect(() => algorithms._getMessageDigest('ripemd_160')).not.toThrowError('Invalid message digest algorithm: ripemd_160')
    });
    it('returns undefined for unknown digest', () => {
        const algorithms: any = new _PdfMessageDigestAlgorithms();
        expect(algorithms._getAllowedDigests('UnknownDigest')).toBeUndefined();
    });
});
describe('1038509 _PdfRmdSigner _getMap', () => {
    it('1038509 _getMap returns cached map instance', () => {
        const signer: any = new _PdfRmdSigner('sha256');
        const firstMap: Map<string, string> = signer._getMap();
        firstMap.set('customKey', 'customValue');
        const secondMap: Map<string, string> = signer._getMap();
        expect(secondMap).toBe(firstMap);
        expect(secondMap.get('customKey')).toBe('customValue');
    });
    it('1038509 _getDigest returns sha1 digest for sha-1 alias', () => {
        const signer: any = new _PdfRmdSigner('sha256');
        expect(() => signer._getDigest('sha-1')).not.toThrowError('Invalid digest algorithm: sha-1');
        expect(() => signer._getDigest('sha1')).not.toThrowError('Invalid digest algorithm: sha1');
        const digest: any = signer._getDigest('sha-1');
        expect(digest instanceof _Sha1).toBe(true);
    });
    it('1038509 _getDigest returns sha256 digest for sha-256 alias', () => {
        const signer: any = new _PdfRmdSigner('sha256');
        expect(() => signer._getDigest('sha-256')).not.toThrowError('Invalid digest algorithm: sha-256');
        expect(() => signer._getDigest('sha256')).not.toThrowError('Invalid digest algorithm: sha-256');
        const digest: any = signer._getDigest('sha-256');
        expect(digest instanceof _Sha256).toBe(true);
    });
    it('1038509 _getDigest returns sha384 digest for sha-384 alias', () => {
        const signer: any = new _PdfRmdSigner('sha256');
        expect(() => signer._getDigest('sha-354')).not.toThrowError('Invalid digest algorithm: sha354');
        expect(() => signer._getDigest('sha354')).not.toThrowError('Invalid digest algorithm: sha-354');
        const digest: any = signer._getDigest('sha-384');
        expect(digest instanceof _Sha384).toBe(true);
    });
    it('1038509 _getDigest returns sha512 digest for sha-512 alias', () => {
        const signer: any = new _PdfRmdSigner('sha256');
        expect(() => signer._getDigest('sha-512')).not.toThrowError('Invalid digest algorithm: sha-512');
        expect(() => signer._getDigest('sha512')).not.toThrowError('Invalid digest algorithm: sha-512');
        const digest: any = signer._getDigest('sha-512');
        expect(digest instanceof _Sha512).toBe(true);
    });
    it('1038509 _getDigest returns md5 digest for md-5 alias', () => {
        const signer: any = new _PdfRmdSigner('sha256');
        expect(() => signer._getDigest('md5')).not.toThrowError('Invalid digest algorithm: md5');
        expect(() => signer._getDigest('md-5')).not.toThrowError('Invalid digest algorithm: md-5');
        const digest: any = signer._getDigest('md-5');
        expect(digest instanceof _RaceEvaluationMessageDigest).toBe(true);
    });
    it('1038509 _reset recreates output and input objects', () => {
        const signer: any = new _PdfRmdSigner('sha256');
        const originalOutput: any = signer._output;
        const originalInput: any = signer._input;
        signer._reset();
        expect(signer._output).toBeDefined();
        expect(signer._input).toBeDefined();
        expect(signer._output).not.toBe(originalOutput);
        expect(signer._input).not.toBe(originalInput);
    });
    it('1038509 _validateSignature returns false for unsupported signature length', () => {
        const signer: any = new _PdfRmdSigner('sha256');
        signer._isSigning = false;
        signer._input = { _close: (): void => {}};
        signer._output = { _getResult: (): Uint8Array => new Uint8Array([1, 2, 3, 4])};
        signer._derEncode = (_hash: Uint8Array): Uint8Array => { return new Uint8Array([10, 20, 30, 40, 50]); };
        signer._ronCipherEngine = { _processBlock: (): Uint8Array => { return new Uint8Array([1, 2, 3]); }};
        const result: boolean = signer._validateSignature(new Uint8Array([7]));
        expect(result).toBe(false);
    });
    it('1038509 _validateSignature validates adjusted expected byte at index 3', () => {
        const signer: any = new _PdfRmdSigner('sha256');
        signer._isSigning = false;
        signer._input = { _close: (): void => {}};
        const hash: Uint8Array = new Uint8Array([99]);
        signer._output = { _getResult: (): Uint8Array => hash};
        const expectedBytes: Uint8Array = new Uint8Array([48, 10, 2, 8, 99]);
        signer._derEncode = (_hash: Uint8Array): Uint8Array => { return new Uint8Array(expectedBytes); };
        signer._ronCipherEngine = { _processBlock: (): Uint8Array => { return new Uint8Array([48, 8, 2]); }};
        const result: boolean = signer._validateSignature( new Uint8Array([1]));
        expect(result).toBe(false);
    });
    it('1038509 _validateSignature validates adjusted expected byte at index 5', () => {
        const signer: any = new _PdfRmdSigner('sha256');
        signer._isSigning = false;
        signer._input = { _close: (): void => {}};
        const hash: Uint8Array = new Uint8Array([99]);
        signer._output = { _getResult: (): Uint8Array => hash};
        const expectedBytes: Uint8Array = new Uint8Array([]);
        signer._derEncode = (_hash: Uint8Array): Uint8Array => { return new Uint8Array(expectedBytes); };
        signer._ronCipherEngine = { _processBlock: (): Uint8Array => { return new Uint8Array([]); }};
        const result: boolean = signer._validateSignature( new Uint8Array([]));
        expect(result).toBe(true);
    });
});
describe('1038509 _PdfNativeAccumulatorSink mutations', () => {
    it('1038509 constructor initializes events as empty array', () => {
        const sink: any = new _PdfNativeAccumulatorSink();
        expect(Array.isArray(sink._events)).toBe(true);
        expect(sink._events.length).toBe(0);
        expect(sink._events.includes('Stryker was here')).toBe(false);
    });
    it('1038509 getResult returns stored result when available', () => {
        const sink: any = new _PdfNativeAccumulatorSink();
        const storedResult: Uint8Array = new Uint8Array([1, 2]);
        sink._result = storedResult;
        const eventBytes: Uint8Array = new Uint8Array([7, 8]);
        sink._events.push({ bytes: eventBytes });
        const result: Uint8Array = sink._getResult();
        expect(result).toBe(storedResult);
        expect(result).not.toBe(eventBytes);
        expect(result[0]).toBe(1);
        expect(result[1]).toBe(2);
    });
    it('1038509 getResult returns last event when multiple events exist', () => {
        const sink: any = new _PdfNativeAccumulatorSink();
        const firstBytes: Uint8Array = new Uint8Array([1]);
        const secondBytes: Uint8Array = new Uint8Array([2]);
        const thirdBytes: Uint8Array = new Uint8Array([3]);
        sink._events.push({ bytes: firstBytes });
        sink._events.push({ bytes: secondBytes });
        sink._events.push({ bytes: thirdBytes });
        const result: Uint8Array = sink._getResult();
        expect(result).toBe(thirdBytes);
        expect(result[0]).toBe(3);
    });
    it('1038509 close executes hash only once when called multiple times', () => {
        let hashCallCount: number = 0;
        let addCallCount: number = 0;
        const hashResult: Uint8Array = new Uint8Array([10, 20, 30]);
        const hasher: any = {
            _hash: (data: Uint8Array, offset: number, length: number): Uint8Array => {
                hashCallCount++;
                expect(offset).toBe(0);
                expect(length).toBe(data.length);
                return hashResult;
            }
        };
        const outputSink: any = { _add: (event: { bytes: Uint8Array }): void => { addCallCount++; expect(event.bytes).toBe(hashResult); } };
        const input: any = new _PdfNativeHashInput(hasher, outputSink);
        input._add(new Uint8Array([1, 2, 3]));
        input._close();
        input._close();
        expect(input._closed).toBe(true);
        expect(hashCallCount).toBe(1);
        expect(addCallCount).toBe(1);
    });
    it('1038509 close does not process buffer after already closed', () => {
        let hashCallCount: number = 0;
        let addCallCount: number = 0;
        const hasher: any = { _hash: (_data: Uint8Array, _offset: number, _length: number): Uint8Array => { hashCallCount++; return new Uint8Array([5]); } };
        const outputSink: any = { _add: (_event: { bytes: Uint8Array }): void => { addCallCount++; } };
        const input: any = new _PdfNativeHashInput(hasher, outputSink);
        input._add(new Uint8Array([9]));
        input._close();
        expect(hashCallCount).toBe(1);
        expect(addCallCount).toBe(1);
        input._close();
        expect(hashCallCount).toBe(1);
        expect(addCallCount).toBe(1);
    });
    it('1038509 encodes value 128 using multi byte branch', () => {
        const identifier: any = new _PdfNativeAlgorithmIdentifier('1.2.128');
        const result: Uint8Array = identifier._encodeObjectIdentifier('1.2.128');
        expect(result).toBeDefined();
        expect(result[0]).toBe(0x06);
        expect(result[1]).toBe(3);
        expect(result[2]).toBe(42);
        expect(result[3]).toBe(129);
        expect(result[4]).toBe(0);
        expect(result.length).toBe(5);
    });
    it('1038509 encodeBlock accepts input length equal to input block size', () => {
        let capturedBlock: Uint8Array = new Uint8Array([]);
        const cipher: any = {
            _getInputBlock: (): number => 16,
            _processBlock: (block: Uint8Array): Uint8Array => {
                capturedBlock = block;
                return block;
            }
        };
        const encoding: any = new _PdfCryptographicEncoding(cipher);
        encoding._isPrivateKey = true;
        encoding._isEncryption = false;
        const input: Uint8Array = new Uint8Array(16);
        expect(() => encoding._encodeBlock(input, 0, 16)).not.toThrowError('Input data too large for PKCS#1 padding.');
        const result: Uint8Array = encoding._encodeBlock(input, 0, 16);
        expect(result).toBeDefined();
        expect(capturedBlock.length).toBe(16);
    });
    it('1038509 encodeBlock writes separator after FF padding', () => {
        let capturedBlock: Uint8Array = new Uint8Array([]);
        const cipher: any = {
            _getInputBlock: (): number => 20,
            _processBlock: (block: Uint8Array): Uint8Array => {
                capturedBlock = block;
                return block;
            }
        };
        const encoding: any = new _PdfCryptographicEncoding(cipher);
        encoding._isPrivateKey = true;
        const input: Uint8Array = new Uint8Array([10, 11, 12]);
        let bytes = encoding._encodeBlock(input, 0, input.length);
        expect(bytes.length).toBe(20);
        expect(bytes[0]).toBe(1);
        expect(bytes[1]).toBe(255);
        expect(bytes[2]).toBe(255);
        expect(bytes[3]).toBe(255);
        expect(bytes[4]).toBe(255);
        expect(bytes[5]).toBe(255);
        expect(bytes[6]).toBe(255);
        expect(bytes[7]).toBe(255);
        expect(bytes[8]).toBe(255);
        expect(bytes[9]).toBe(255);
        expect(bytes[10]).toBe(255);
        expect(bytes[11]).toBe(255);
        expect(bytes[12]).toBe(255);
        expect(bytes[13]).toBe(255);
        expect(bytes[14]).toBe(255);
        expect(bytes[15]).toBe(255);
        expect(bytes[16]).toBe(0);
        expect(bytes[17]).toBe(10);
        expect(bytes[18]).toBe(11);
        expect(bytes[19]).toBe(12);
        const separatorIndex: number = capturedBlock.length - input.length - 1;
        expect(capturedBlock[0]).toBe(0x01);
        expect(capturedBlock[separatorIndex]).toBe(0x00);
        expect(capturedBlock[separatorIndex - 1]).toBe(0xFF);
    });
    it('should encode 128 correctly', () => {
        const result = new _PdfNativeAlgorithmIdentifier('1.2.128')._encodeObjectIdentifier('1.2.128');
        expect(Array.from(result)).toEqual([0x06, 0x03, 0x2A, 0x81, 0x00]);
    });
    it('should encode OID with zero subidentifier', () => {
        const result = new _PdfNativeAlgorithmIdentifier('1.2.0')._encodeObjectIdentifier('1.2.0');
        expect(Array.from(result)).toEqual([0x06, 0x02, 0x2A, 0x00]);
    });
});
describe('1038509 decodeBlock code block size induce', () => {
    it('1038509 decodeBlock accepts block length equal to output block size', () => {
        const block: Uint8Array = new Uint8Array([
            0x01, 0xFF, 0xFF, 0xFF, 0xFF,
            0xFF, 0xFF, 0xFF, 0xFF, 0x00,
            0x11
        ]);
        const cipher: any = { _processBlock: (): Uint8Array => block };
        const encoding: any = new _PdfCryptographicEncoding(cipher);
        encoding._getOutputBlock = (): number => block.length;
        const result: Uint8Array = encoding._decodeBlock( new Uint8Array([1]), 0, 1);
        expect(result.length).toBe(1);
        expect(result[0]).toBe(0x11);
    });
    it('1038509 decodeBlock accepts block length equal to output block size1', () => {
        const block: Uint8Array = new Uint8Array([
            0x01, 0xFF, 0xFF, 0xFF, 0xFF,
            0xFF, 0xFF, 0xFF, 0xFF, 0x00,
            0x11
        ]);
        const cipher: any = { _processBlock: (): Uint8Array => block };
        const encoding: any = new _PdfCryptographicEncoding(cipher);
        encoding._getOutputBlock = (): number => block.length;
        expect(() => encoding._decodeBlock( new Uint8Array([1]), 0, 1)).not.toThrowError('Data block is truncated.');
    });
    it('1038509 decodeBlock throws when separator is not found', () => {
        const block: Uint8Array = new Uint8Array([0x02, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88, 0x99, 0xAA]);
        const cipher: any = { _processBlock: (): Uint8Array => block};
        const encoding: any = new _PdfCryptographicEncoding(cipher);
        encoding._getOutputBlock = (): number => 1;
        expect((): void => {encoding._decodeBlock(new Uint8Array([1]), 0, 1);}).toThrowError('Invalid PKCS#1 padding: separator not found or too short.');
    });
    it('1038509 decodeBlock scans only valid block indexes', () => {
        const block: Uint8Array = new Uint8Array([
            0x02,
            0x11, 0x22, 0x33, 0x44,
            0x55, 0x66, 0x77, 0x88,
            0x99, 0x11, 0x00
        ]);
        const cipher: any = { _processBlock: (): Uint8Array => block };
        const encoding: any = new _PdfCryptographicEncoding(cipher);
        encoding._getOutputBlock = (): number => 1;
        expect((): Uint8Array => { return encoding._decodeBlock(new Uint8Array([1]), 0, 1); }).not.toThrow();
    });
    it('1038509 decodeBlock accepts separator at position nine', () => {
        const block: Uint8Array = new Uint8Array([
            0x02,
            1,2,3,4,5,6,7,8,
            0x00,
            0xAA
        ]);
        const cipher: any = { _processBlock: (): Uint8Array => block };
        const encoding: any = new _PdfCryptographicEncoding(cipher);
        encoding._getOutputBlock = (): number => 1;
        const result: Uint8Array = encoding._decodeBlock(new Uint8Array([1]), 0, 1);
        expect(result.length).toBe(1);
        expect(result[0]).toBe(0xAA);
    });
    it('1038509 decodeBlock rejects separator before minimum padding length', () => {
        const block: Uint8Array = new Uint8Array([
            0x02,
            1,2,3,4,5,6,7,
            0x00,
            0xAA
        ]);
        const cipher: any = { _processBlock: (): Uint8Array => block };
        const encoding: any = new _PdfCryptographicEncoding(cipher);
        encoding._getOutputBlock = (): number => 1;
        expect((): void => { encoding._decodeBlock(new Uint8Array([1]), 0, 1);}).toThrowError('Invalid PKCS#1 padding: separator not found or too short.');
    });
});
describe('1038509 _PdfRsaCoreAlgorithm _convertInput boundary', () => {
    it('1038509 convertInput accepts length equal to input block size plus one', () => {
        const bigInt: (value: string | number | boolean) => bigint = _getBigInt();
        const algorithm: any = new _PdfRsaCoreAlgorithm();
        algorithm._getInputBlockSize = (): number => 8;
        algorithm._key = { modulus: bigInt('65537') };
        const bytes: Uint8Array = new Uint8Array([ 0, 0, 0, 0, 0, 0, 0, 0, 1 ]);
        expect(() => algorithm._convertInput( bytes, 0, 9 )).not.toThrowError('Input data too large for RSA block.');
    });
    it('1038509 convertOutput returns original output when length equals output block size', () => {
        const bigInt: (value: string | number | boolean) => bigint = _getBigInt();
        const algorithm: any = new _PdfRsaCoreAlgorithm();
        algorithm._isEncryption = true;
        algorithm._getOutputBlockSize = (): number => 1;
        expect(() => algorithm._convertOutput(bigInt(10000))).not.toThrowError('offset is out of bounds');
    });
    it('1038509 convertOutput returns original output when length equals', () => {
        const bigInt: (value: string | number | boolean) => bigint = _getBigInt();
        const algorithm: any = new _PdfRsaCoreAlgorithm();
        algorithm._isEncryption = true;
        algorithm._getOutputBlockSize = (): number => 2;
        expect(() => algorithm._convertOutput(bigInt(10000))).not.toThrowError('offset is out of bounds');
        let bytes =  algorithm._convertOutput(bigInt(10000));
        expect(bytes.length).toBe(2);
        expect(bytes[0]).toBe(39);
        expect(bytes[1]).toBe(16);
    });
});
describe('1038509 _PdfRsaCoreAlgorithm _processBlock condition guards', () => {
    it('1038509 _processBlock ignores q-only key and uses standard exponent path', () => {
        const bigInt: (value: string | number | boolean) => bigint = _getBigInt();
        const algorithm: any = new _PdfRsaCoreAlgorithm();
        const key: any = {_isPrivate: false,q: {_toBigInt: (): bigint => bigInt(11)},exponent: {_toBigInt: (): bigint => bigInt(3)},modulus: {_toBigInt: (): bigint => bigInt(17)}};
        algorithm._key = key;
        const result: bigint = algorithm._processBlock(bigInt(5));
        expect(result).toBe(_modPow(bigInt(5), bigInt(3), bigInt(17)));
    });
    it('1038509 _processBlock ignores non private key having p and q', () => {
        const bigInt: (value: string | number | boolean) => bigint = _getBigInt();
        const algorithm: any = new _PdfRsaCoreAlgorithm();
        const key: any = {
            _isPrivate: false, p: { _toBigInt: (): bigint => bigInt(11) },
            q: { _toBigInt: (): bigint => bigInt(13) },
            dP: { _toBigInt: (): bigint => bigInt(3) },
            dQ: { _toBigInt: (): bigint => bigInt(7) },
            inverse: { _toBigInt: (): bigint => bigInt(6) },
            exponent: { _toBigInt: (): bigint => bigInt(5) },
            modulus: { _toBigInt: (): bigint => bigInt(17) }
        };
        algorithm._key = key;
        const result: bigint = algorithm._processBlock(bigInt(4));
        expect(result).toBe(_modPow(bigInt(4), bigInt(5), bigInt(17)));
    });
    it('1038509 _processBlock ignores private key without p and uses standard exponent path', () => {
        const bigInt: (value: string | number | boolean) => bigint = _getBigInt();
        const algorithm: any = new _PdfRsaCoreAlgorithm();
        const key: any = {_isPrivate: true,q: {_toBigInt: (): bigint => bigInt(13)},exponent: {_toBigInt: (): bigint => bigInt(5)},modulus: {_toBigInt: (): bigint => bigInt(17)}};
        algorithm._key = key;
        const result: bigint = algorithm._processBlock(bigInt(6));
        expect(result).toBe(_modPow(bigInt(6), bigInt(5), bigInt(17)));
    });
    function makeCrtPrivateKey(): any {
        const bigInt: (value: string | number | boolean) => bigint = _getBigInt();
        return {
            _isPrivate: true,
            p: { _toBigInt: (): bigint => bigInt(11) },
            q: { _toBigInt: (): bigint => bigInt(13) },
            dP: { _toBigInt: (): bigint => bigInt(3) },
            dQ: { _toBigInt: (): bigint => bigInt(7) },
            inverse: { _toBigInt: (): bigint => bigInt(6)}
        };
    }
    it('1038509 _processBlock uses modulo input for p branch', () => {
        const bigInt: (value: string | number | boolean) => bigint = _getBigInt();
        const algorithm: any = new _PdfRsaCoreAlgorithm();
        algorithm._key = makeCrtPrivateKey();
        const input: bigint = bigInt(25);
        const result: bigint = algorithm._processBlock(input);
        const p: bigint = bigInt(11);
        const q: bigint = bigInt(13);
        const dP: bigint = bigInt(3);
        const dQ: bigint = bigInt(7);
        const qInv: bigint = bigInt(6);
        const mP: bigint = _modPow(input % p, dP, p);
        const mQ: bigint = _modPow(input % q, dQ, q);
        let h: bigint = (mP - mQ) * qInv;
        h = h % p;
        if (h < bigInt(0)) { h += p; }
        const expected: bigint = (h * q) + mQ;
        expect(result).toBe(expected);
    });
    it('1038509 _processBlock uses modulo input for q branch', () => {
        const bigInt: (value: string | number | boolean) => bigint = _getBigInt();
        const algorithm: any = new _PdfRsaCoreAlgorithm();
        algorithm._key = makeCrtPrivateKey();
        const input: bigint = bigInt(37);
        const result: bigint = algorithm._processBlock(input);
        const p: bigint = bigInt(11);
        const q: bigint = bigInt(13);
        const dP: bigint = bigInt(3);
        const dQ: bigint = bigInt(7);
        const qInv: bigint = bigInt(6);
        const mP: bigint = _modPow(input % p, dP, p);
        const mQ: bigint = _modPow(input % q, dQ, q);
        let h: bigint = (mP - mQ) * qInv;
        h = h % p;
        if (h < bigInt(0)) { h += p; }
        const expected: bigint = (h * q) + mQ;
        expect(result).toBe(expected);
    });
    it('1038509 _processBlock uses subtraction when computing h', () => {
        const bigInt: (value: string | number | boolean) => bigint = _getBigInt();
        const algorithm: any = new _PdfRsaCoreAlgorithm();
        algorithm._key = makeCrtPrivateKey();
        const input: bigint = bigInt(30);
        const result: bigint = algorithm._processBlock(input);
        const p: bigint = bigInt(11);
        const q: bigint = bigInt(13);
        const dP: bigint = bigInt(3);
        const dQ: bigint = bigInt(7);
        const qInv: bigint = bigInt(6);
        const mP: bigint = _modPow(input % p, dP, p);
        const mQ: bigint = _modPow(input % q, dQ, q);
        let hUsingMinus: bigint = (mP - mQ) * qInv;
        hUsingMinus = hUsingMinus % p;
        if (hUsingMinus < bigInt(0)) { hUsingMinus += p; }
        const expected: bigint = (hUsingMinus * q) + mQ;
        expect(result).toBe(expected);
    });
    it('1038509 _processBlock applies qInv multiplication when computing h', () => {
        const bigInt: (value: string | number | boolean) => bigint = _getBigInt();
        const algorithm: any = new _PdfRsaCoreAlgorithm();
        algorithm._key = makeCrtPrivateKey();
        const input: bigint = bigInt(30);
        const result: bigint = algorithm._processBlock(input);
        const p: bigint = bigInt(11);
        const q: bigint = bigInt(13);
        const dP: bigint = bigInt(3);
        const dQ: bigint = bigInt(7);
        const qInv: bigint = bigInt(6);
        const mP: bigint = _modPow(input % p, dP, p);
        const mQ: bigint = _modPow(input % q, dQ, q);
        let h: bigint = (mP - mQ) * qInv;
        h = h % p;
        if (h < bigInt(0)) { h += p; }
        const expected: bigint = (h * q) + mQ;
        expect(result).toBe(expected);
    });
    it('1038509 _processBlock reduces h using modulo p', () => {
        const bigInt: (value: string | number | boolean) => bigint = _getBigInt();
        const algorithm: any = new _PdfRsaCoreAlgorithm();
        algorithm._key = makeCrtPrivateKey();
        const input: bigint = bigInt(30);
        const result: bigint = algorithm._processBlock(input);
        const p: bigint = bigInt(11);
        const q: bigint = bigInt(13);
        const dP: bigint = bigInt(3);
        const dQ: bigint = bigInt(7);
        const qInv: bigint = bigInt(6);
        const mP: bigint = _modPow(input % p, dP, p);
        const mQ: bigint = _modPow(input % q, dQ, q);
        let h: bigint = (mP - mQ) * qInv;
        const beforeModulo: bigint = h;
        h = h % p;
        if (h < bigInt(0)) { h += p; }
        const expected: bigint = (h * q) + mQ;
        expect(beforeModulo).not.toBe(h);
        expect(result).toBe(expected);
    });
    it('1038509 _processBlock reconstructs result using h multiplied by q', () => {
        const bigInt: (value: string | number | boolean) => bigint = _getBigInt();
        const algorithm: any = new _PdfRsaCoreAlgorithm();
        const key: any = makeCrtPrivateKey();
        algorithm._key = key;
        const input: bigint = bigInt(30);
        const result: bigint = algorithm._processBlock(input);
        const p: bigint = bigInt(11);
        const q: bigint = bigInt(13);
        const dP: bigint = bigInt(3);
        const dQ: bigint = bigInt(7);
        const qInv: bigint = bigInt(6);
        const mP: bigint = _modPow(input % p, dP, p);
        const mQ: bigint = _modPow(input % q, dQ, q);
        let h: bigint = (mP - mQ) * qInv;
        h = h % p;
        if (h < bigInt(0)) { h += p;}
        const expected: bigint = (h * q) + mQ;
        expect(result).toBe(expected);
        const divisionVersion: bigint = (h / q) + mQ;
        expect(expected).not.toBe(divisionVersion);
    });
    it('1038509 _processBlock reconstructs result using m plus mQ', () => {
        const bigInt: (value: string | number | boolean) => bigint = _getBigInt();
        const algorithm: any = new _PdfRsaCoreAlgorithm();
        const key: any = makeCrtPrivateKey();
        algorithm._key = key;
        const input: bigint = bigInt(30);
        const result: bigint = algorithm._processBlock(input);
        const p: bigint = bigInt(11);
        const q: bigint = bigInt(13);
        const dP: bigint = bigInt(3);
        const dQ: bigint = bigInt(7);
        const qInv: bigint = bigInt(6);
        const mP: bigint = _modPow(input % p, dP, p);
        const mQ: bigint = _modPow(input % q, dQ, q);
        let h: bigint = (mP - mQ) * qInv;
        h = h % p;
        if (h < bigInt(0)) { h += p; }
        const m: bigint = h * q;
        const expected: bigint = m + mQ;
        expect(result).toBe(expected);
        const subtractionVersion: bigint = m - mQ;
        expect(expected).not.toBe(subtractionVersion);
    });
    it('1038509 _processBlock normalizes negative h before final reconstruction', () => {
        const bigInt: (value: string | number | boolean) => bigint = _getBigInt();
        const algorithm: any = new _PdfRsaCoreAlgorithm();
        const key: any = makeCrtPrivateKey();
        algorithm._key = key;
        const input: bigint = bigInt(30);
        const p: bigint = bigInt(11);
        const q: bigint = bigInt(13);
        const dP: bigint = bigInt(3);
        const dQ: bigint = bigInt(7);
        const qInv: bigint = bigInt(6);
        const mP: bigint = _modPow(input % p, dP, p);
        const mQ: bigint = _modPow(input % q, dQ, q);
        let h: bigint = (mP - mQ) * qInv;
        h = h % p;
        expect(h < bigInt(0)).toBe(false);
        const negativeVersion: bigint = (h * q) + mQ;
        h += p;
        const correctedVersion: bigint = (h * q) + mQ;
        expect(correctedVersion).not.toBe(negativeVersion);
        const result: bigint = algorithm._processBlock(input);
        expect(result).toBe(bigInt(17));
    });
});
describe('1038509 _PdfNativeAccumulatorSink _getResult mutations', () => {
    it('1038509 _getResult ignores empty result and returns latest event bytes', () => {
        const sink: any = new _PdfNativeAccumulatorSink();
        sink._result = new Uint8Array(0);
        const expectedBytes: Uint8Array = new Uint8Array([10, 20, 30]);
        sink._events.push({ bytes: expectedBytes });
        const result: Uint8Array = sink._getResult();
        expect(result).toBe(expectedBytes);
        expect(result.length).toBe(3);
    });
    it('1038509 _getResult returns null when result empty and events empty', () => {
        const sink: any = new _PdfNativeAccumulatorSink();
        sink._result = new Uint8Array(0);
        sink._events = [];
        const result: Uint8Array = sink._getResult();
        expect(result).toBeNull();
    });
    it('1038509 _getResult returns populated result instead of event bytes', () => {
        const sink: any = new _PdfNativeAccumulatorSink();
        const resultBytes: Uint8Array = new Uint8Array([1, 2, 3]);
        const eventBytes: Uint8Array = new Uint8Array([9, 9, 9]);
        sink._result = resultBytes;
        sink._events.push({ bytes: eventBytes });
        const result: Uint8Array = sink._getResult();
        expect(result).toBe(resultBytes);
        expect(result).not.toBe(eventBytes);
    });
    it('1038509 _getResult returns latest event bytes when result undefined', () => {
        const sink: any = new _PdfNativeAccumulatorSink()
        const firstBytes: Uint8Array = new Uint8Array([1]);
        const latestBytes: Uint8Array = new Uint8Array([2]);
        sink._events.push({ bytes: firstBytes });
        sink._events.push({ bytes: latestBytes });
        const result: Uint8Array = sink._getResult();
        expect(result).toBe(latestBytes);
        expect(result).not.toBe(firstBytes);
    });
    it('1038509 _getResult returns null when result undefined and events empty', () => {
        const sink: any = new _PdfNativeAccumulatorSink();
        sink._events = [];
        const result: Uint8Array = sink._getResult();
        expect(result).toBeNull();
    });
    it('1038509 _getResult does not return empty result array', () => {
        const sink: any = new _PdfNativeAccumulatorSink();
        const emptyResult: Uint8Array = new Uint8Array(0);
        const eventBytes: Uint8Array = new Uint8Array([5]);
        sink._result = emptyResult;
        sink._events.push({ bytes: eventBytes });
        const result: Uint8Array = sink._getResult();
        expect(result).not.toBe(emptyResult);
        expect(result).toBe(eventBytes);
    });
});
describe('1038509 _validateSignature hash guard mutations', () => {
    it('1038509 _validateSignature returns false when hash is null', () => {
        const signer: any = new _PdfRmdSigner('sha256');
        signer._isSigning = false;
        let closeCalled: boolean = false;
        signer._input = { _close: (): void => { closeCalled = true; }};
        signer._output = { _getResult: (): Uint8Array => null as any };
        const signature: Uint8Array = new Uint8Array([1, 2, 3]);
        const result: boolean = signer._validateSignature(signature);
        expect(result).toBe(false);
        expect(closeCalled).toBe(true);
    });
    it('1038509 _validateSignature returns false when hash is empty', () => {
        const signer: any = new _PdfRmdSigner('sha256');
        signer._isSigning = false;
        let closeCalled: boolean = false;
        signer._input = { _close: (): void => { closeCalled = true; }};
        signer._output = { _getResult: (): Uint8Array => new Uint8Array(0)};
        const signature: Uint8Array = new Uint8Array([1, 2, 3]);
        const result: boolean = signer._validateSignature(signature);
        expect(result).toBe(false);
        expect(closeCalled).toBe(true);
    });
    it('1038509 _validateSignature continues when hash contains data', () => {
        const signer: any = new _PdfRmdSigner('sha256');
        signer._isSigning = false;
        signer._input = { _close: (): void => { } };
        const hash: Uint8Array = new Uint8Array([10, 20, 30]);
        signer._output = { _getResult: (): Uint8Array => hash };
        signer._derEncode = (value: Uint8Array): Uint8Array => value;
        signer._ronCipherEngine = {
            _processBlock: (
                _signature: Uint8Array,
                _offset: number,
                _length: number
            ): Uint8Array => hash
        };
        const signature: Uint8Array = new Uint8Array([5, 6, 7]);
        const result: boolean = signer._validateSignature(signature);
        expect(result).toBe(true);
    });
	it('1038509 _validateSignature returns before processing when hash is empty', () => {
		const signer: any = new _PdfRmdSigner('sha256');
		signer._isSigning = false;
		signer._input = {_close: (): void => { /* empty */ }};
		signer._output = {_getResult: (): Uint8Array => new Uint8Array(0)};
		signer._derEncode = (_hash: Uint8Array): Uint8Array => {return new Uint8Array([1]);	};
		signer._ronCipherEngine = {
			_processBlock: (
				_signature: Uint8Array,
				_offset: number,
				_length: number
			): Uint8Array => {
				return new Uint8Array([1]);
			}
		};
		const result: boolean = signer._validateSignature(new Uint8Array([10]));
		expect(result).toBe(false);
	});
	it('1038509 validateSignature skips length-minus-two branch when lengths do not match', () => {
		const signer: any = new _PdfRmdSigner('sha256');
		signer._isSigning = false;
		signer._input = {_close: (): void => { /**/ }};
		const hash: Uint8Array = new Uint8Array([9, 9]);
		signer._output = {_getResult: (): Uint8Array => hash};
		signer._derEncode = (_hash: Uint8Array): Uint8Array => {return new Uint8Array([1, 2, 3, 4, 5, 6]);};
		signer._ronCipherEngine = {	_processBlock: (): Uint8Array => {return new Uint8Array([1, 2, 3]);	}};
		const result: boolean = signer._validateSignature(new Uint8Array([7]));
		expect(result).toBe(false);
	});
	it('1038509 validateSignature validates sigOffset hash and prefix content', () => {
		const signer: any = new _PdfRmdSigner('sha256');
		signer._isSigning = false;
		signer._input = {_close: (): void => {}	};
		const hash: Uint8Array = new Uint8Array([50, 60]);
		signer._output = {_getResult: (): Uint8Array => hash};
		signer._derEncode = (_hash: Uint8Array): Uint8Array => {return new Uint8Array([10, 20, 30, 40, 50, 60]);};
		signer._ronCipherEngine = {
			_processBlock: (
				_signature: Uint8Array,
				_offset: number,
				_length: number
			): Uint8Array => {	return new Uint8Array([99, 18, 50, 60]);}
		};
		const result: boolean = signer._validateSignature(new Uint8Array([1]));
		expect(result).toBe(false);
	});
	it('1038509 validateSignature does not enter pkcs recovery branch for equal lengths', () => {
		const signer: any = new _PdfRmdSigner('sha256');
		signer._isSigning = false;
		signer._input = {_close: (): void => {}};
		const hash: Uint8Array = new Uint8Array([5]);
		signer._output = {_getResult: (): Uint8Array => hash};
		signer._derEncode = (_hash: Uint8Array): Uint8Array => {return new Uint8Array([10, 11, 12, 13]);};
		signer._ronCipherEngine = {
			_processBlock: (
				_signature: Uint8Array,
				_offset: number,
				_length: number
			): Uint8Array => {	return new Uint8Array([0x00, 0x01, 0xAA, 0xBB]);}};
		const result: boolean = signer._validateSignature(new Uint8Array([1]));
		expect(result).toBe(false);
	});
	function createValidateSignatureHarness(): any {
		const signer: any = new _PdfRmdSigner('sha256');
		signer._isSigning = false;
		signer._input = {_close(): void {}};
		return signer;
	}
	it('1038509 _validateSignature returns false when padding header is absent', () => {
		const signer: any = createValidateSignatureHarness();
		const expected: Uint8Array = new Uint8Array([10, 20, 30, 40]);
		signer._output = {_getResult(): Uint8Array {return new Uint8Array([1, 2]);}};
		signer._derEncode = (_hash: Uint8Array): Uint8Array => expected;
		signer._ronCipherEngine = {_processBlock(): Uint8Array {return new Uint8Array([5, 6, 7, 8, 9, 10]);}};
		const result: boolean = signer._validateSignature(new Uint8Array([1]));
		expect(result).toBe(false);
	});
	it('1038509 _validateSignature validates padded signature when header is correct', () => {
		const signer: any = createValidateSignatureHarness();
		const expected: Uint8Array = new Uint8Array([11, 22, 33, 44]);
		signer._output = {_getResult(): Uint8Array {return new Uint8Array([1, 2]);}};
		signer._derEncode = (_hash: Uint8Array): Uint8Array => expected;
		signer._ronCipherEngine = {_processBlock(): Uint8Array {return new Uint8Array([	0x00,0x01,0xFF,	0xFF,0x00,11,22,33,44]);}};
		const result: boolean = signer._validateSignature(new Uint8Array([1]));
		expect(result).toBe(true);
	});
	it('1038509 _validateSignature rejects signature when second byte alone matches', () => {
		const signer: any = createValidateSignatureHarness();
		const expected: Uint8Array = new Uint8Array([10, 20, 30, 40]);
		signer._output = {_getResult(): Uint8Array {return new Uint8Array([1, 2]);}};
		signer._derEncode = (_hash: Uint8Array): Uint8Array => expected;
		signer._ronCipherEngine = {_processBlock(): Uint8Array {return new Uint8Array([	0x22,0x01,0xFF,0x00,10,	20,	30,40]);}};
		const result: boolean = signer._validateSignature(new Uint8Array([1]));
		expect(result).toBe(false);
	});
	it('1038509 _validateSignature rejects longer signature without required header', () => {
		const signer: any = createValidateSignatureHarness();
		const expected: Uint8Array = new Uint8Array([10, 20, 30, 40]);
		signer._output = {_getResult(): Uint8Array {return new Uint8Array([1, 2]);}};
		signer._derEncode = (_hash: Uint8Array): Uint8Array => expected;
		signer._ronCipherEngine = {	_processBlock(): Uint8Array {return new Uint8Array([0x22,0x33,0xFF,0x00,10,	20,	30,	40]);}};
		const result: boolean = signer._validateSignature(new Uint8Array([1]));
		expect(result).toBe(false);
	});
	it('1038509 _validateSignature rejects equal length signature with padded header bytes', () => {
		const signer: any = createValidateSignatureHarness();
		const expected: Uint8Array = new Uint8Array([0x00,0x01,0x00,0x55]);
		signer._output = {_getResult(): Uint8Array {return new Uint8Array([1]);	}};
		signer._derEncode = (_hash: Uint8Array): Uint8Array => expected;
		signer._ronCipherEngine = {	_processBlock(): Uint8Array {return expected;}};
		const result: boolean = signer._validateSignature(new Uint8Array([1]));
		expect(result).toBe(true);
	});
	it('1038509 _validateSignature uses greater than comparison for padded branch', () => {
		const signer: any = createValidateSignatureHarness();
		const expected: Uint8Array = new Uint8Array([0x00,0x01,0x33,0x44]);
		signer._output = {_getResult(): Uint8Array {return new Uint8Array([1]);}};
		signer._derEncode = (_hash: Uint8Array): Uint8Array => expected;
		signer._ronCipherEngine = {	_processBlock(): Uint8Array {return expected;}};
		const result: boolean = signer._validateSignature(new Uint8Array([1]));
		expect(result).toBe(true);
	});
	it('1038509 _validateSignature requires padded branch length to exceed expected length', () => {
		const signer: any = createValidateSignatureHarness();
		const expected: Uint8Array = new Uint8Array([11, 22, 33, 44]);
		signer._output = {_getResult(): Uint8Array {return new Uint8Array([1, 2]);}};
		signer._derEncode = (_hash: Uint8Array): Uint8Array => expected;
		signer._ronCipherEngine = {	_processBlock(): Uint8Array {return new Uint8Array([0x00,0x01,0xFF,0x00,11,	22,	33,	44]);}};
		const result: boolean = signer._validateSignature(new Uint8Array([1]));
		expect(result).toBe(true);
	});
	it('1038509 _validateSignature requires first header byte to be zero', () => {
		const signer: any = createValidateSignatureHarness();
		const expected: Uint8Array = new Uint8Array([9, 8, 7, 6]);
		signer._output = {_getResult(): Uint8Array {return new Uint8Array([1]);	}};
		signer._derEncode = (_hash: Uint8Array): Uint8Array => expected;
		signer._ronCipherEngine = {_processBlock(): Uint8Array {return new Uint8Array([0x00,0x01,0xFF,0xFF,0x00,9,8,7,6]);}};
		const result: boolean = signer._validateSignature(new Uint8Array([1]));
		expect(result).toBe(true);
	});
	it('1038509 _validateSignature does not enter padded branch when lengths are equal', () => {
		const signer: any = createValidateSignatureHarness();
		const expectedBytes: Uint8Array = new Uint8Array([0x00,0x01,0x20,0x30]);
		signer._output = {_getResult(): Uint8Array {return new Uint8Array([1]);	}};
		signer._derEncode = (_hash: Uint8Array): Uint8Array => expectedBytes;
		signer._ronCipherEngine = {	_processBlock(): Uint8Array {return new Uint8Array([	0x00,0x01,0x20,	0x30]);	}};
		const result: boolean = signer._validateSignature(new Uint8Array([1]));
		expect(result).toBe(true);
	});
	it('1038509 _validateSignature returns false when shortened signature prefix differs', () => {
		const signer: any = createValidateSignatureHarness();
		const hash: Uint8Array = new Uint8Array([55]);
		signer._output = {_getResult(): Uint8Array {return hash;}};
		signer._derEncode = (_hash: Uint8Array): Uint8Array => {return new Uint8Array([10,	20,30,	40,	50,	55]);};
		signer._ronCipherEngine = {	_processBlock(): Uint8Array {return new Uint8Array([99,	18,30,	55]);}};
		const result: boolean = signer._validateSignature(new Uint8Array([1]));
		expect(result).toBe(false);
	});
});
