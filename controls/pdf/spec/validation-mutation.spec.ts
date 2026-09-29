import { RevocationStatus, RevocationType, SignatureStatus } from "../src/pdf/core/enumerator";
import { PdfSignatureField } from "../src/pdf/core/form/field";
import { _PdfDictionary } from "../src/pdf/core/pdf-primitives";
import { _PdfBasicEncodingElement } from "../src/pdf/core/security/digital-signature/asn1/basic-encoding-element";
import { _ConstructionType, _UniversalType } from "../src/pdf/core/security/digital-signature/asn1/enumerator";
import { _PdfUniqueEncodingElement } from "../src/pdf/core/security/digital-signature/asn1/unique-encoding-element";
describe('1041530 - Validation Basic Encoding Element', () => {
    it('should throw when recursion limit is exceeded during serialization', () => {
        const element: any = new _PdfBasicEncodingElement();
        element._construction = _ConstructionType.constructed;
        element._recursionCount = 1;
        element._nestingRecursionLimit = 1;
        element._getSequence = (): any[] => [];
        element._getTagNumber = () => _UniversalType.sequence;
        expect(() => { element._serialize('SEQUENCE'); }).toThrowError(/Exceeded recursion limit while deconstructing SEQUENCE/);
    });
    it('should serialize constructed element by concatenating child values only', () => {
        const child1: any = new _PdfBasicEncodingElement();
        child1._setValue(new Uint8Array([1, 2]));
        const child2: any = new _PdfBasicEncodingElement();
        child2._setValue(new Uint8Array([3, 4]));
        const element: any = new _PdfBasicEncodingElement();
        element._construction = _ConstructionType.constructed;
        element._getSequence = () => [child1, child2];
        element._getTagNumber = () => _UniversalType.sequence;
        const result = element._serialize('SEQUENCE');
        expect(Array.from(result)).toEqual([1, 2, 3, 4]);
    });
});
describe('1041547 - Validation Unique Encoding Element ', () => {
    it('1041547 - should throw when remaining buffer contains fewer than two bytes', () => {
        const element: any = new _PdfUniqueEncodingElement();
        element._value = new Uint8Array([0x30]);
        element._getValue = () => new Uint8Array([0x30]);
        expect(() => { element._getComponents(); }).toThrowError(/ASN.1 parsing error: element too short/);
    });
    it('1041547 - should throw when raw value is detected without ASN.1 tag and length encoding', () => {
        const element: any = new _PdfUniqueEncodingElement();
        element._value = new Uint8Array([0x2A, 0x01]);
        element._getValue = () => new Uint8Array([0x2A, 0x01]);
        try {
            element._getComponents();
            fail('Expected exception was not thrown.');
        } catch (e) {
            expect(e.message).toBe('ASN.1 parsing error: raw value detected (missing tag + length encoding)');
        }
    });
    it('1041547 - should throw when a parsed element consumes zero bytes', () => {
        const element: any = new _PdfUniqueEncodingElement();
        element._value = new Uint8Array([0x30, 0x00]);
        element._getValue = () => new Uint8Array([0x30, 0x00]);
        spyOn(_PdfUniqueEncodingElement.prototype as any, '_fromBytes').and.returnValue(0);
        expect(() => { element._getComponents(); }).toThrowError(/ASN.1 parsing error: invalid element size/);
    });
    it('1041547 - should throw when parsed element consumes zero bytes', () => {
        const element: any = new _PdfUniqueEncodingElement();
        element._value = new Uint8Array([0x30, 0x00]);
        element._getValue = () => new Uint8Array([0x30, 0x00]);
        spyOn(_PdfUniqueEncodingElement.prototype as any, '_fromBytes').and.returnValue(0);
        expect(() => { element._getComponents(); }).toThrowError(/ASN.1 parsing error: invalid element size/);
    });
    it('1041547 - should throw when parsed element size exceeds remaining buffer length', () => {
        const element: any = new _PdfUniqueEncodingElement();
        element._value = new Uint8Array([0x30, 0x00]);
        element._getValue = () => new Uint8Array([0x30, 0x00]);
        spyOn(_PdfUniqueEncodingElement.prototype as any, '_fromBytes').and.returnValue(10);
        expect(() => { element._getComponents(); }).toThrowError(/ASN.1 parsing error: length exceeds buffer/);
    });
});
describe('1041690 - Validation Enum mutation', () => {
    it('1041690 - should have correct forward and reverse mapping for RevocationType.none', () => {
        expect(RevocationType.none).toBe(4);
        expect(RevocationType[4]).toBe('none');
    });
    it('1041690 - should have correct forward and reverse mappings for RevocationStatus enum', () => {
        expect(RevocationStatus.none).toBe(0);
        expect(RevocationStatus[0]).toBe('none');
        expect(RevocationStatus.good).toBe(1);
        expect(RevocationStatus[1]).toBe('good');
        expect(RevocationStatus.unknown).toBe(2);
        expect(RevocationStatus[2]).toBe('unknown');
        expect(RevocationStatus.revoked).toBe(3);
        expect(RevocationStatus[3]).toBe('revoked');
    });
    it('1041690 - should have correct forward and reverse mappings for SignatureStatus enum', () => {
        expect(SignatureStatus.invalid).toBe(0);
        expect(SignatureStatus[0]).toBe('invalid');
        expect(SignatureStatus.valid).toBe(1);
        expect(SignatureStatus[1]).toBe('valid');
        expect(SignatureStatus.unknown).toBe(2);
        expect(SignatureStatus[2]).toBe('unknown');
    });
});
describe('1027254 - signature field mutation', () => {
    it('1027254 - should create RSA public key parameters from modulus and exponent', () => {
        const signatureField: any = new PdfSignatureField();
        const pub: any = {
            _modulus: new Uint8Array([1, 2, 3]),
            _exponent: new Uint8Array([1, 0, 1]),
            _isPrivate: false
        };
        const result = signatureField._toICipherParam(pub);
        expect(result).not.toEqual(undefined);
        expect(result._modulus).toEqual(pub._modulus);
        expect(result._exponent).toEqual(pub._exponent);
    });
    it('1027254 - should create a new RSA key parameter object when input is not already a cipher parameter', () => {
        const signatureField: any = new PdfSignatureField();
        const pub: any = {
            _modulus: new Uint8Array([1, 2, 3]),
            _exponent: new Uint8Array([1, 0, 1]),
            _isPrivate: false
        };
        const result: any = signatureField._toICipherParam(pub);
        expect(result).not.toEqual(pub);
    });
    it('1027254 - should not return input object when only _equals function exists', () => {
        const signatureField: any = new PdfSignatureField();
        const pub: any = {
            _equals: () => true,
            _modulus: new Uint8Array([1, 2, 3]),
            _exponent: new Uint8Array([1, 0, 1]),
            _isPrivate: false
        };
        const result = signatureField._toICipherParam(pub);
        expect(result).not.toEqual(pub);
    });
    it('1027254 - should return the same object when _getHashCode and _equals are functions', () => {
        const signatureField: any = new PdfSignatureField();
        const cipherParam: any = {
            _getHashCode: () => 1,
            _equals: () => true
        };
        const result = signatureField._toICipherParam(cipherParam);
        expect(result).toEqual(cipherParam);
    });
    it('1027254 - should not return the input object when only _getHashCode exists', () => {
        const signatureField: any = new PdfSignatureField();
        const pub: any = {
            _getHashCode: () => 1,
            _modulus: new Uint8Array([1, 2, 3]),
            _exponent: new Uint8Array([1, 0, 1]),
            _isPrivate: false
        };
        const result = signatureField._toICipherParam(pub);
        expect(result).not.toEqual(pub);
    });
    it('1027254 - should return the same object when both _getHashCode and _equals are functions', () => {
        const signatureField: any = new PdfSignatureField();
        const cipherParam: any = {
            _getHashCode: () => 1,
            _equals: () => true
        };
        const result = signatureField._toICipherParam(cipherParam);
        expect(result).toEqual(cipherParam);
    });
    it('1027254 - should return the same object when both _getHashCode and _equals are functions', () => {
        const signatureField: any = new PdfSignatureField();
        const cipherParam: any = {
            _getHashCode: () => 1,
            _equals: () => true
        };
        const result = signatureField._toICipherParam(cipherParam);
        expect(result).toEqual(cipherParam);
    });
    it('1027254 - should return the same object when both _getHashCode and _equals are functions', () => {
        const signatureField: any = new PdfSignatureField();
        const cipherParam: any = {
            _getHashCode: () => 1,
            _equals: () => true
        };
        const result = signatureField._toICipherParam(cipherParam);
        expect(result).toEqual(cipherParam);
    });
    it('1027254 - should throw when exponent is not a Uint8Array', () => {
        const signatureField: any = new PdfSignatureField();
        const pub: any = { _modulus: new Uint8Array([1, 2, 3]), _exponent: [1, 0, 1], _isPrivate: false };
        expect(() => { signatureField._toICipherParam(pub); }).toThrowError('Invalid RSA public key parameter: missing modulus/exponent.');
    });
    it('1027254 - should create RSA key parameter for valid modulus and exponent', () => {
        const signatureField: any = new PdfSignatureField();
        const pub: any = { _modulus: new Uint8Array([1, 2, 3]), _exponent: new Uint8Array([1, 0, 1]), _isPrivate: false };
        expect(() => { signatureField._toICipherParam(pub); }).not.toThrow();
    });
    it('1027254 - should return a cipher parameter object for valid modulus and exponent', () => {
        const signatureField: any = new PdfSignatureField();
        const pub: any = { _modulus: new Uint8Array([1, 2, 3]), _exponent: new Uint8Array([1, 0, 1]), _isPrivate: false };
        const result = signatureField._toICipherParam(pub);
        expect(result).not.toEqual(undefined);
    });
    it('1027254 - should throw when exponent is not Uint8Array', () => {
        const signatureField: any = new PdfSignatureField();
        const pub: any = { _modulus: new Uint8Array([1, 2, 3]), _exponent: [1, 0, 1], _isPrivate: false };
        expect(() => { signatureField._toICipherParam(pub); }).toThrowError('Invalid RSA public key parameter: missing modulus/exponent.');
    });
    it('1027254 - should not throw for valid modulus and exponent', () => {
        const signatureField: any = new PdfSignatureField();
        const pub: any = { _modulus: new Uint8Array([1, 2, 3]), _exponent: new Uint8Array([1, 0, 1]), _isPrivate: false };
        expect(() => { signatureField._toICipherParam(pub); }).not.toThrow();
    });
    it('1027254 - should return RSA key parameter when modulus and exponent are valid Uint8Arrays', () => {
        const signatureField: any = new PdfSignatureField();
        const pub: any = { _modulus: new Uint8Array([1, 2, 3]), _exponent: new Uint8Array([1, 0, 1]), _isPrivate: false };
        const result = signatureField._toICipherParam(pub);
        expect(result).not.toEqual(undefined);
    });
    it('1027254 - should enable certification verification for public key', () => {
        const signatureField: any = new PdfSignatureField();
        const pub: any = { _modulus: new Uint8Array([1, 2, 3]), _exponent: new Uint8Array([1, 0, 1]), _isPrivate: false };
        const result: any = signatureField._toICipherParam(pub);
        expect(result._enableCertificationVerification).toEqual(true);
        expect(result._isPrivate).toEqual(false);
    });
    it('1027254 - should enable certification verification for public key', () => {
        const signatureField: any = new PdfSignatureField();
        const pub: any = { _modulus: new Uint8Array([1, 2, 3]), _exponent: new Uint8Array([1, 0, 1]), _isPrivate: false };
        const result: any = signatureField._toICipherParam(pub);
        expect(result._enableCertificationVerification).toEqual(true);
        expect(result._isPrivate).toEqual(false);
    });
    it('1027254 - should not enable certification verification for private key', () => {
        const signatureField: any = new PdfSignatureField();
        const pub: any = { _modulus: new Uint8Array([1, 2, 3]), _exponent: new Uint8Array([1, 0, 1]), _isPrivate: true };
        const result: any = signatureField._toICipherParam(pub);
        expect(result._enableCertificationVerification).not.toEqual(true);
    });
    it('1027254 - should enable certification verification for public key', () => {
        const signatureField: any = new PdfSignatureField();
        const pub: any = { _modulus: new Uint8Array([1, 2, 3]), _exponent: new Uint8Array([1, 0, 1]), _isPrivate: false };
        const result: any = signatureField._toICipherParam(pub);
        expect(result._enableCertificationVerification).toEqual(true);
        expect(result._isPrivate).toEqual(false);
    });
    it('1027254 - should enable certification verification for public key', () => {
        const signatureField: any = new PdfSignatureField();
        const pub: any = { _modulus: new Uint8Array([1, 2, 3]), _exponent: new Uint8Array([1, 0, 1]), _isPrivate: false };
        const result: any = signatureField._toICipherParam(pub);
        expect(result._enableCertificationVerification).toEqual(true);
        expect(result._isPrivate).toEqual(false);
    });
    it('1027254 - should mark the returned key parameter as non-private for public keys', () => {
        const signatureField: any = new PdfSignatureField();
        const pub: any = { _modulus: new Uint8Array([1, 2, 3]), _exponent: new Uint8Array([1, 0, 1]), _isPrivate: false };
        const result: any = signatureField._toICipherParam(pub);
        expect(result._isPrivate).toEqual(false);
    });
    it('1027254 - should enable certification verification for public key', () => {
        const signatureField: any = new PdfSignatureField();
        const pub: any = { _modulus: new Uint8Array([1, 2, 3]), _exponent: new Uint8Array([1, 0, 1]), _isPrivate: false };
        const result: any = signatureField._toICipherParam(pub);
        expect(result._enableCertificationVerification).toEqual(true);
    });
    it('1027254 - should return false when CRL validation throws an exception', () => {
        const signatureField: any = new PdfSignatureField();
        signatureField._cmsSigner = { _checkCertificateSerialInCrl: () => { throw new Error('Test exception'); } };
        const cert: any = { _structure: { _toBeSignedCertificate: { _serialNumber: { toString: () => '12345' } } } };
        const result = signatureField._validateLtvCrl(new Uint8Array([1, 2, 3]), cert);
        expect(result).toEqual(false);
    });
    it('1027254 - should return CRL validation result from cms signer', () => {
        const signatureField: any = new PdfSignatureField();
        signatureField._cmsSigner = { _checkCertificateSerialInCrl: function () { return true; } };
        const cert: any = { _structure: { _toBeSignedCertificate: { _serialNumber: { toString: function () { return '12345'; } } } } };
        const result = signatureField._validateLtvCrl(new Uint8Array([1, 2, 3]), cert);
        expect(result).toEqual(true);
    });
    it('1027254 - should return VRI dictionary when DSS contains a valid VRI entry', () => {
        const signatureField: any = new PdfSignatureField();
        const vriDictionary: any = new _PdfDictionary();
        signatureField._getDssDictionary = function () { return { has: function (key: string): boolean { return key === 'VRI'; }, get: function (key: string): any { return key === 'VRI' ? vriDictionary : undefined; } }; };
        const result = signatureField._getVriDictionary();
        expect(result).toEqual(vriDictionary);
    });
    it('1027254 - should return VRI dictionary when DSS contains VRI entry', () => {
        const signatureField: any = new PdfSignatureField();
        const vriDictionary: any = new _PdfDictionary();
        signatureField._getDssDictionary = function () { return { has: function (key: string): boolean { return key === 'VRI'; }, get: function (key: string): any { return vriDictionary; } }; };
        const result = signatureField._getVriDictionary();
        expect(result).toEqual(vriDictionary);
    });
    it('1027254 - should return VRI dictionary when DSS contains VRI entry', () => {
        const signatureField: any = new PdfSignatureField();
        const vriDictionary: any = new _PdfDictionary();
        signatureField._getDssDictionary = function () { return { has: function (key: string): boolean { return key === 'VRI'; }, get: function (key: string): any { return vriDictionary; } }; };
        const result = signatureField._getVriDictionary();
        expect(result).toEqual(vriDictionary);
    });
    it('1027254 - should return null when DSS dictionary does not contain VRI', () => {
        const signatureField: any = new PdfSignatureField();
        signatureField._getDssDictionary = function () { return { has: function (_key: string): boolean { return false; } }; };
        const result = signatureField._getVriDictionary();
        expect(result).toEqual(null);
    });
    it('1027254 - should return null when DSS dictionary does not contain VRI', () => {
        const signatureField: any = new PdfSignatureField();
        signatureField._getDssDictionary = function () { return { has: function (_key: string): boolean { return false; } }; };
        const result = signatureField._getVriDictionary();
        expect(result).toEqual(null);
    });
    it('1027254 - should return VRI dictionary when DSS contains VRI entry', () => {
        const signatureField: any = new PdfSignatureField();
        const vriDictionary: any = new _PdfDictionary();
        signatureField._getDssDictionary = function () { return { has: function (key: string): boolean { return key === 'VRI'; }, get: function (key: string): any { return vriDictionary; } }; };
        const result = signatureField._getVriDictionary();
        expect(result).toEqual(vriDictionary);
    });
    it('1027254 - should return VRI dictionary when DSS contains VRI entry', () => {
        const signatureField: any = new PdfSignatureField();
        const vriDictionary: any = new _PdfDictionary();
        signatureField._getDssDictionary = () => ({ has: (key: string) => key === 'VRI', get: (_key: string) => vriDictionary });
        const result = signatureField._getVriDictionary();
        expect(result).toEqual(vriDictionary);
    });
    it('1027254 - should return VRI dictionary when VRI key exists in DSS dictionary', () => {
        const signatureField: any = new PdfSignatureField();
        const vriDictionary: any = new _PdfDictionary();
        signatureField._getDssDictionary = function () { return { has: function (key: string): boolean { return key === 'VRI'; }, get: function (_key: string): any { return vriDictionary; } }; };
        const result = signatureField._getVriDictionary();
        expect(result).toEqual(vriDictionary);
    });
    it('1027254 - should return null when DSS dictionary does not contain VRI', () => {
        const signatureField: any = new PdfSignatureField();
        signatureField._getDssDictionary = function () { return { has: function (_key: string): boolean { return false; } }; };
        const result = signatureField._getVriDictionary();
        expect(result).toEqual(null);
    });
    it('1027254 - should return VRI dictionary from DSS dictionary', () => {
        const signatureField: any = new PdfSignatureField();
        const vriDictionary: any = new _PdfDictionary();
        signatureField._getDssDictionary = function () { return { has: function (key: string): boolean { return key === 'VRI'; }, get: function (key: string): any { return key === 'VRI' ? vriDictionary : null; } }; };
        const result = signatureField._getVriDictionary();
        expect(result).toEqual(vriDictionary);
    });
    it('1027254 - should return VRI dictionary when VRI value is a PdfDictionary', () => {
        const signatureField: any = new PdfSignatureField();
        const vriDictionary: any = new _PdfDictionary();
        signatureField._getDssDictionary = function () { return { has: function (key: string): boolean { return key === 'VRI'; }, get: function (_key: string): any { return vriDictionary; } }; };
        const result = signatureField._getVriDictionary();
        expect(result).toEqual(vriDictionary);
    });
    it('1027254 - should return VRI dictionary when VRI value is a PdfDictionary', () => {
        const signatureField: any = new PdfSignatureField();
        const vriDictionary: any = new _PdfDictionary();
        signatureField._getDssDictionary = function () { return { has: function (key: string): boolean { return key === 'VRI'; }, get: function (_key: string): any { return vriDictionary; } }; };
        const result = signatureField._getVriDictionary();
        expect(result).toEqual(vriDictionary);
    });
    it('1027254 - should return DSS dictionary when catalog contains DSS entry', () => {
        const signatureField: any = new PdfSignatureField();
        const dssDictionary: any = new _PdfDictionary();
        signatureField._crossReference = { _root: { has: function (key: string): boolean { return key === 'DSS'; }, get: function (key: string): any { return key === 'DSS' ? dssDictionary : null; } } };
        const result = signatureField._getDssDictionary();
        expect(result).toEqual(dssDictionary);
    });
    it('1027254 - should return null when cross reference is not available', () => {
        const signatureField: any = new PdfSignatureField();
        signatureField._crossReference = null;
        signatureField._page = null;
        const result = signatureField._getDssDictionary();
        expect(result).toEqual(null);
    });
    it('1027254 - should return DSS dictionary from page cross reference when direct cross reference is unavailable', () => {
        const signatureField: any = new PdfSignatureField();
        const dssDictionary: any = new _PdfDictionary();
        signatureField._crossReference = null;
        signatureField._page = { _crossReference: { _root: { has: function (key: string): boolean { return key === 'DSS'; }, get: function (key: string): any { return key === 'DSS' ? dssDictionary : null; } } } };
        const result = signatureField._getDssDictionary();
        expect(result).toEqual(dssDictionary);
    });
    it('1027254 - should return DSS dictionary when direct cross reference contains DSS entry', () => {
        const signatureField: any = new PdfSignatureField();
        const dssDictionary: any = new _PdfDictionary();
        signatureField._crossReference = { _root: { has: function (key: string): boolean { return key === 'DSS'; }, get: function (key: string): any { return key === 'DSS' ? dssDictionary : null; } } };
        const result = signatureField._getDssDictionary();
        expect(result).toEqual(dssDictionary);
    });
    it('1027254 - should return DSS dictionary when cross reference contains a DSS entry', () => {
        const signatureField: any = new PdfSignatureField();
        const dssDictionary: any = new _PdfDictionary();
        signatureField._crossReference = { _root: { has: function (key: string): boolean { return key === 'DSS'; }, get: function (key: string): any { return key === 'DSS' ? dssDictionary : null; } } };
        const result = signatureField._getDssDictionary();
        expect(result).toEqual(dssDictionary);
    });
    it('1027254 - should return DSS dictionary when cross reference contains DSS entry', () => {
        const signatureField: any = new PdfSignatureField();
        const dssDictionary: any = new _PdfDictionary();
        signatureField._crossReference = { _root: { has: function (key: string): boolean { return key === 'DSS'; }, get: function (key: string): any { return key === 'DSS' ? dssDictionary : null; } } };
        const result = signatureField._getDssDictionary();
        expect(result).toEqual(dssDictionary);
    });
    it('1027254 - should return null when cross reference is not available', () => {
        const signatureField: any = new PdfSignatureField();
        signatureField._crossReference = null;
        signatureField._page = null;
        const result = signatureField._getDssDictionary();
        expect(result).toEqual(null);
    });
    it('1027254 - should return DSS dictionary when catalog contains DSS entry', () => {
        const signatureField: any = new PdfSignatureField();
        const dssDictionary: any = new _PdfDictionary();
        signatureField._crossReference = { _root: { has: function (key: string): boolean { return key === 'DSS'; }, get: function (key: string): any { return key === 'DSS' ? dssDictionary : null; } } };
        const result = signatureField._getDssDictionary();
        expect(result).toEqual(dssDictionary);
    });
    it('1027254 - should return DSS dictionary when catalog contains DSS entry', () => {
        const signatureField: any = new PdfSignatureField();
        const dssDictionary: any = new _PdfDictionary();
        signatureField._crossReference = { _root: { has: function (key: string): boolean { return key === 'DSS'; }, get: function (key: string): any { return key === 'DSS' ? dssDictionary : null; } } };
        const result = signatureField._getDssDictionary();
        expect(result).toEqual(dssDictionary);
    });
    it('1027254 - should return null when catalog does not contain DSS entry', () => {
        const signatureField: any = new PdfSignatureField();
        signatureField._crossReference = { _root: { has: function (_key: string): boolean { return false; } } };
        const result = signatureField._getDssDictionary();
        expect(result).toEqual(null);
    });
    it('1027254 - should return null when catalog does not contain DSS entry', () => {
        const signatureField: any = new PdfSignatureField();
        signatureField._crossReference = { _root: { has: function (_key: string): boolean { return false; } } };
        const result = signatureField._getDssDictionary();
        expect(result).toEqual(null);
    });
    it('1027254 - should return DSS dictionary when catalog contains DSS entry', () => {
        const signatureField: any = new PdfSignatureField();
        const dssDictionary: any = new _PdfDictionary();
        signatureField._crossReference = { _root: { has: function (key: string): boolean { return key === 'DSS'; }, get: function (key: string): any { return key === 'DSS' ? dssDictionary : null; } } };
        const result = signatureField._getDssDictionary();
        expect(result).toEqual(dssDictionary);
    });
    it('1027254 - should return DSS dictionary when catalog contains DSS entry', () => {
        const signatureField: any = new PdfSignatureField();
        const dssDictionary: any = new _PdfDictionary();
        signatureField._crossReference = { _root: { has: function (key: string): boolean { return key === 'DSS'; }, get: function (key: string): any { return key === 'DSS' ? dssDictionary : null; } } };
        const result = signatureField._getDssDictionary();
        expect(result).toEqual(dssDictionary);
    });
    it('1027254 - should return null when catalog does not contain DSS entry', () => {
        const signatureField: any = new PdfSignatureField();
        signatureField._crossReference = { _root: { has: function (_key: string): boolean { return false; } } };
        const result = signatureField._getDssDictionary();
        expect(result).toEqual(null);
    });
    it('1027254 - should return DSS dictionary when catalog contains DSS entry', () => {
        const signatureField: any = new PdfSignatureField();
        const dssDictionary: any = new _PdfDictionary();
        signatureField._crossReference = { _root: { has: function (key: string): boolean { return key === 'DSS'; }, get: function (key: string): any { return key === 'DSS' ? dssDictionary : null; } } };
        const result = signatureField._getDssDictionary();
        expect(result).toEqual(dssDictionary);
    });
    it('1027254 - should return null when DSS entry is not a PdfDictionary', () => {
        const signatureField: any = new PdfSignatureField();
        signatureField._crossReference = { _root: { has: function (key: string): boolean { return key === 'DSS'; }, get: function (_key: string): any { return 'InvalidDssObject'; } } };
        const result = signatureField._getDssDictionary();
        expect(result).toEqual(null);
    });
    it('1027254 - should return DSS dictionary when DSS entry is a PdfDictionary', () => {
        const signatureField: any = new PdfSignatureField();
        const dssDictionary: any = new _PdfDictionary();
        signatureField._crossReference = { _root: { has: function (key: string): boolean { return key === 'DSS'; }, get: function (_key: string): any { return dssDictionary; } } };
        const result = signatureField._getDssDictionary();
        expect(result).toEqual(dssDictionary);
    });
    it('1027254 - should return DSS dictionary when DSS entry is a PdfDictionary', () => {
        const signatureField: any = new PdfSignatureField();
        const dssDictionary: any = new _PdfDictionary();
        signatureField._crossReference = { _root: { has: function (key: string): boolean { return key === 'DSS'; }, get: function (_key: string): any { return dssDictionary; } } };
        const result = signatureField._getDssDictionary();
        expect(result).toEqual(dssDictionary);
    });
})