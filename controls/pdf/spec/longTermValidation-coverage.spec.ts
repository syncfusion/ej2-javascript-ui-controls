import { _PdfAbstractSyntaxElement } from "../src/pdf/core/security/digital-signature/asn1/abstract-syntax";
import { _TagClassType, _UniversalType } from "../src/pdf/core/security/digital-signature/asn1/enumerator";
import { _PdfObjectIdentifier } from "../src/pdf/core/security/digital-signature/asn1/identifier-mapping";
import { _PdfUniqueEncodingElement } from "../src/pdf/core/security/digital-signature/asn1/unique-encoding-element";
import { _PdfCertificateIdentity, _PdfCertificateIdentityHelper } from "../src/pdf/core/security/digital-signature/ocsp/certificate-identity";
import { _PdfCertificateUtility, _PdfSubjectKeyID } from "../src/pdf/core/security/digital-signature/ocsp/certificate-utils";
import { _PdfOcsp, _PdfOcspTag } from "../src/pdf/core/security/digital-signature/ocsp/ocsp-client";
import { _PdfOcspRequestCreator, _PdfRequestCreatorHelper, _PdfRevocationListRequest, _PdfRevocationRequest } from "../src/pdf/core/security/digital-signature/ocsp/ocsp-request";
import { _PdfOcspResponseHelper, _PdfResponseInformation, _PdfRevocationResponseBytes, _PdfRevocationResponseIdentifier } from "../src/pdf/core/security/digital-signature/ocsp/ocsp-response";
import { _PdfOcspStatus, _PdfOneTimeResponseHelper } from "../src/pdf/core/security/digital-signature/ocsp/ocsp-response-model";
import { _PdfGeneralizedTime, _PdfOcspHelper } from "../src/pdf/core/security/digital-signature/ocsp/ocsp-response-utils";
import { _PdfRevocationDistribution, _PdfRevocationDistributionType, _PdfRevocationList, _PdfRevocationName, _PdfRevocationPointList } from "../src/pdf/core/security/digital-signature/ocsp/revocation";
import { _PdfAlgorithms } from "../src/pdf/core/security/digital-signature/x509/x509-algorithm";
import { _PdfX509Certificate } from "../src/pdf/core/security/digital-signature/x509/x509-certificate";
import { _PdfPublicKeyInformation } from "../src/pdf/core/security/digital-signature/x509/x509-certificate-key";
import { _PdfX509Extension, _PdfX509ExtensionBase, _PdfX509Extensions } from '../src/pdf/core/security/digital-signature/x509/x509-extensions';
import { _Sha1 } from "../src/pdf/core/security/encryptors/secureHash-algorithm1";
import { _PdfRmdSigner } from "../src/pdf/core/security/digital-signature/signature/pdf-cipher-signer";
import { _PdfCryptographicMessageSyntaxSigner } from "../src/pdf/core/security/digital-signature/signature/cryptographic-signer";
import { _PdfBasicEncodingElement } from "../src/pdf/core/security/digital-signature/asn1/basic-encoding-element";
import { _PdfX509CertificateParser } from "../src/pdf/core/security/digital-signature/x509/x509-certificate-parser";
import { _PdfSignerUtilities } from "../src/pdf/core/security/digital-signature/signature/signature-utilities";
import { PdfDocument } from "../src/pdf/core/pdf-document";
import { PdfPage } from "../src/pdf/core/pdf-page";
import { PdfSignatureField } from "../src/pdf/core/form/field";
import { PdfSignature } from "../src/pdf/core/security/digital-signature/signature/pdf-signature";
import { CryptographicStandard, DigestAlgorithm, RevocationType } from "../src/pdf/core/enumerator";
import { _decode } from "../src/pdf/core/utils";
import { certain1Pfx, EJDOTNETCORE3040Pfx, EJDOTNETCORE_4693Pfx, publicCert1, publicCert2 } from "./longTermValidation-inputs.spec";
describe('966967 - OCSP coverage test cases 1', () => {
    it('should throw "Invalid certificate ID" when an internal error occurs', () => {
        const mockIssuerCert: any = {
            _getTobeSignedCertificate: jasmine.createSpy().and.returnValue({}),
            _getPublicKey: jasmine.createSpy().and.returnValue({}),
            _publicKeyBytes: new Uint8Array([1, 2, 3])
        };
        const serialNumber = new Uint8Array([10, 20, 30]);
        const originalFromString = (_PdfObjectIdentifier.prototype as any)._fromString;
        (_PdfObjectIdentifier.prototype as any)._fromString = function () { return { _getDotDelimitedNotation: () => '1.2' } as any; };
        spyOn<any>(_PdfCertificateIdentity.prototype, '_getIssuer').and.throwError('Mock failure');
        expect(() => {
            new _PdfCertificateIdentity('SHA256', mockIssuerCert, serialNumber);
        }).toThrowError('Invalid certificate ID');
        (_PdfObjectIdentifier.prototype as any)._fromString = originalFromString;
    });
    it('should throw error when sequence length is not equal to 4', () => {
        const mockSequence: any = {
            _getSequence: jasmine.createSpy().and.returnValue([
                {}, {}, {} // length = 3 (invalid)
            ])
        };
        const helper = new _PdfCertificateIdentityHelper(
            {} as any,
            {} as any,
            {} as any,
            new Uint8Array([])
        );
        expect(() => {
            (helper as any)._fromSequence(mockSequence);
        }).toThrowError('Invalid length in sequence');
    });
    it('should return the same object when it is already a _PdfCertificateIdentityHelper', () => {
        const helperInstance = new _PdfCertificateIdentityHelper(
            {} as any,
            {} as any,
            {} as any,
            new Uint8Array([])
        );
        const instance = new _PdfCertificateIdentityHelper(
            {} as any,
            {} as any,
            {} as any,
            new Uint8Array([])
        );
        const result = (instance as any)._getCertificateIdentity(helperInstance);
        expect(result).toBe(helperInstance);
    });
    it('should call _fromSequence when object is _PdfAbstractSyntaxElement', () => {
        const mockElement: any = {
            _getSequence: jasmine.createSpy().and.returnValue([])
        };
        Object.setPrototypeOf(mockElement, _PdfAbstractSyntaxElement.prototype);
        const instance = new _PdfCertificateIdentityHelper(
            {} as any,
            {} as any,
            {} as any,
            new Uint8Array([])
        );
        const mockReturn = {} as _PdfCertificateIdentityHelper;
        const spy = spyOn<any>(instance, '_fromSequence')
            .and.returnValue(mockReturn);

        const result = (instance as any)._getCertificateIdentity(mockElement);
        expect(spy).toHaveBeenCalledWith(mockElement);
        expect(result).toBe(mockReturn);
    });
    it('should return null when extension value is not present', () => {
        const utility = new _PdfCertificateUtility();
        spyOn<any>(utility, '_getExtensionValue').and.returnValue(null);
        const mockCert = {} as _PdfX509Certificate;
        const result = utility._getOcspUrl(mockCert);
        expect(result).toBeNull();
    });
    it('should throw error when exception occurs while parsing', () => {
        const utility = new _PdfCertificateUtility();
        spyOn<any>(utility, '_getExtensionValue')
            .and.throwError('Parsing failed');
        const mockCert = {} as _PdfX509Certificate;
        expect(() => {
            utility._getOcspUrl(mockCert);
        }).toThrowError('Parsing failed');
    });
    it('should return null when no OCSP URL is found in sequence', () => {
        const utility = new _PdfCertificateUtility();
        const mockSequenceItem: any = {
            _getSequence: jasmine.createSpy().and.returnValue([
                {
                    _getObjectIdentifier: () => ({
                        _getDotDelimitedNotation: () => '1.2.3.4' // NOT OCSP OID
                    })
                },
                {}
            ])
        };
        const mockAsn1Element: any = {
            _getSequence: jasmine.createSpy().and.returnValue([mockSequenceItem])
        };
        spyOn<any>(utility, '_getExtensionValue')
            .and.returnValue(mockAsn1Element);

        const result = utility._getOcspUrl({} as _PdfX509Certificate);
        expect(result).toBeNull();
    });
    it('should skip entries where innerSequence length is not 2', () => {
        const utility = new _PdfCertificateUtility();
        const invalidItem: any = {
            _getSequence: jasmine.createSpy().and.returnValue([
                {}
            ])
        };
        const mockAsn1Element: any = {
            _getSequence: jasmine.createSpy().and.returnValue([invalidItem])
        };
        spyOn<any>(utility, '_getExtensionValue')
            .and.returnValue(mockAsn1Element);
        const result = utility._getOcspUrl({} as _PdfX509Certificate);
        expect(result).toBeNull();
    });
    it('should return InternationalAlphabetString when UTF8 string is not available', () => {
        const utility = new _PdfCertificateUtility();
        const mockElement: any = {
            _getUtf8String: jasmine.createSpy().and.returnValue(null),
            _getInternationalAlphabetString: jasmine.createSpy().and.returnValue('fallback-value')
        };
        const result = (utility as any)._getStringFromGeneralName(mockElement);
        expect(mockElement._getUtf8String).toHaveBeenCalled();
        expect(mockElement._getInternationalAlphabetString).toHaveBeenCalled();
        expect(result).toBe('fallback-value');
    });
    it('should return null when an exception occurs', () => {
        const utility = new _PdfCertificateUtility();
        const mockElement: any = {
            _getUtf8String: jasmine.createSpy().and.throwError('failure'),
            _getInternationalAlphabetString: jasmine.createSpy()
        };
        const result = (utility as any)._getStringFromGeneralName(mockElement);
        expect(result).toBeNull();
    });
    it('should return null when extension is not found', () => {
        const utility = new _PdfCertificateUtility();
        const mockCertificate: any = {
            _getExtension: jasmine.createSpy().and.returnValue(null)
        };
        const result = (utility as any)._getExtensionValue(
            mockCertificate,
            '1.2.3'
        );
        expect(mockCertificate._getExtension).toHaveBeenCalled();
        expect(result).toBeNull();
    });
    it('should return null when extension bytes are not available', () => {
        const utility = new _PdfCertificateUtility();
        const mockExtension: any = {
            _toEncodedBytes: jasmine.createSpy().and.returnValue(null)
        };
        const mockCertificate: any = {
            _getExtension: jasmine.createSpy().and.returnValue(mockExtension)
        };
        const result = (utility as any)._getExtensionValue(
            mockCertificate,
            '1.2.3'
        );
        expect(mockExtension._toEncodedBytes).toHaveBeenCalled();
        expect(result).toBeNull();
    });
    it('should return null when CRL extension is not present', async () => {
        const utility = new _PdfCertificateUtility();
        spyOn<any>(utility, '_getExtensionValue').and.returnValue(null);
        const result = await utility._getCrlUrls({} as _PdfX509Certificate);
        expect(result).toBeNull();
    });
    it('should skip distribution entries with invalid pointType', async () => {
        const utility = new _PdfCertificateUtility();
        const entry: any = {
            _distributionPointName: {
                _pointType: 1,
                _fullName: 2
            }
        };
        spyOn(_PdfRevocationPointList.prototype, '_getCrlPointList').and.returnValue({
            _getDistributionPoints: () => [entry]
        } as any);
        spyOn<any>(utility, '_getExtensionValue').and.returnValue({});
        const result = await utility._getCrlUrls({} as any);
        expect(result).toEqual([]);
    });
    it('should skip names where tagNumber is not 6', async () => {
        const utility = new _PdfCertificateUtility();
        const entry: any = {
            _distributionPointName: {
                _pointType: 1,
                _fullName: 1,
                _name: {
                    _names: [
                        { _tagNumber: 5 }
                    ]
                }
            }
        };
        spyOn(_PdfRevocationPointList.prototype, '_getCrlPointList').and.returnValue({
            _getDistributionPoints: () => [entry]
        } as any);
        spyOn<any>(utility, '_getExtensionValue').and.returnValue({});
        const result = await utility._getCrlUrls({} as any);
        expect(result).toEqual([]);
    });
    it('should not add URL when it is invalid', async () => {
        const utility = new _PdfCertificateUtility();
        spyOn<any>(utility, '_isValidUrl').and.returnValue(false);
        const entry: any = {
            _distributionPointName: {
                _pointType: 1,
                _fullName: 1,
                _name: {
                    _names: [{
                        _tagNumber: 6,
                        _encode: {
                            _getObjectIdResourceIdentifier: () => 'http://test.crl'
                        }
                    }]
                }
            }
        };
        spyOn(_PdfRevocationPointList.prototype, '_getCrlPointList').and.returnValue({
            _getDistributionPoints: () => [entry]
        } as any);
        spyOn<any>(utility, '_getExtensionValue').and.returnValue({});
        const result = await utility._getCrlUrls({} as any);
        expect(result).toEqual([]);
    });
    it('should add valid CRL URLs to list', async () => {
        const utility = new _PdfCertificateUtility();
        spyOn<any>(utility, '_isValidUrl').and.returnValue(true);
        const entry: any = {
            _distributionPointName: {
                _pointType: 1,
                _fullName: 1,
                _name: {
                    _names: [{
                        _tagNumber: 6,
                        _encode: {
                            _getObjectIdResourceIdentifier: () => 'http://test.crl'
                        }
                    }]
                }
            }
        };
        spyOn(_PdfRevocationPointList.prototype, '_getCrlPointList').and.returnValue({
            _getDistributionPoints: () => [entry]
        } as any);
        spyOn<any>(utility, '_getExtensionValue').and.returnValue({});
        const result = await utility._getCrlUrls({} as any);
        expect(result).toEqual(['http://test.crl']);
    });
    it('should not add URL if it does not end with .crl', async () => {
        const utility = new _PdfCertificateUtility();
        spyOn<any>(utility, '_isValidUrl').and.returnValue(true);
        const entry: any = {
            _distributionPointName: {
                _pointType: 1,
                _fullName: 1,
                _name: {
                    _names: [{
                        _tagNumber: 6,
                        _encode: {
                            _getObjectIdResourceIdentifier: () => 'http://test.txt'
                        }
                    }]
                }
            }
        };
        spyOn(_PdfRevocationPointList.prototype, '_getCrlPointList').and.returnValue({
            _getDistributionPoints: () => [entry]
        } as any);
        spyOn<any>(utility, '_getExtensionValue').and.returnValue({});
        const result = await utility._getCrlUrls({} as any);
        expect(result).toEqual([]);
    });
    it('should return true for https URL', () => {
        const utility = new _PdfCertificateUtility();
        const result = (utility as any)._isValidUrl('https://example.com');
        expect(result).toBeTruthy();
    });
    it('should return false when URL is invalid', () => {
        const utility = new _PdfCertificateUtility();
        const result = (utility as any)._isValidUrl('invalid-url');
        expect(result).toBeFalsy();
    });
    it('should extract bytes when param is _PdfAbstractSyntaxElement', () => {
        const mockElement: any = {
            _getOctetString: jasmine.createSpy().and.returnValue(new Uint8Array([1, 2, 3]))
        };
        Object.setPrototypeOf(mockElement, _PdfAbstractSyntaxElement.prototype);
        const obj: any = new _PdfSubjectKeyID(mockElement);
        expect(mockElement._getOctetString).toHaveBeenCalled();
        expect(obj._bytes).toEqual(new Uint8Array([1, 2, 3]));
    });
    it('should compute digest when param is _PdfPublicKeyInformation', () => {
        const mockPublicKey: any = {};
        Object.setPrototypeOf(mockPublicKey, _PdfPublicKeyInformation.prototype);
        const expectedBytes = new Uint8Array([9, 9, 9]);
        spyOn<any>(_PdfSubjectKeyID.prototype, '_getDigest')
            .and.returnValue(expectedBytes);

        const obj: any = new _PdfSubjectKeyID(mockPublicKey);
        expect(obj._bytes).toEqual(expectedBytes);
    });
    it('should throw error for invalid constructor argument', () => {
        expect(() => {
            new _PdfSubjectKeyID(123 as any);
        }).toThrowError('Invalid constructor argument');
    });
    it('should throw error when publicKey is not _PdfRonCipherParameter', () => {
        const subjectKeyID = new _PdfSubjectKeyID();
        const invalidKey: any = {}; // not instance of _PdfRonCipherParameter
        const id = new Uint8Array([1, 2, 3]);
        expect(() => {
            (subjectKeyID as any)._createSubjectKeyID(invalidKey, id);
        }).toThrowError('Invalid Key');
    });
    it('should compute digest using SHA1 hash', () => {
        const subjectKeyID = new _PdfSubjectKeyID();
        const mockBytes = new Uint8Array([1, 2, 3, 4]);
        const mockPublicKey: any = {
            _publicKey: {
                _getBytes: jasmine.createSpy().and.returnValue(mockBytes)
            }
        };
        const expectedHash = new Uint8Array([9, 9, 9]);
        spyOn(_Sha1.prototype, '_hash').and.returnValue(expectedHash);
        const result = (subjectKeyID as any)._getDigest(mockPublicKey);
        expect(mockPublicKey._publicKey._getBytes).toHaveBeenCalled();
        expect(_Sha1.prototype._hash).toHaveBeenCalledWith(mockBytes, 0, mockBytes.length);
        expect(result).toEqual(expectedHash);
    });
});
describe('966967 - OCSP Coverage test cases 2', () => {
    it('should return encoded bytes when response is valid', async () => {
        const ocsp = new _PdfOcsp();
        const mockResponse = {
            _responses: [{
                _certificateStatus: { _tagNumber: 0 }
            }],
            _encodedBytes: new Uint8Array([1, 2, 3])
        };
        spyOn<any>(ocsp, '_getBasicOCSPResponse')
            .and.returnValue(Promise.resolve(mockResponse));

        const result = await ocsp._getEncodedOcspResponse({} as any, {} as any);
        expect(result).toEqual(new Uint8Array([1, 2, 3]));
    });
    it('should return null when multiple responses exist', async () => {
        const ocsp = new _PdfOcsp();
        const mockResponse = {
            _responses: [{}, {}]
        };
        spyOn<any>(ocsp, '_getBasicOCSPResponse')
            .and.returnValue(Promise.resolve(mockResponse));
        const result = await ocsp._getEncodedOcspResponse({} as any, {} as any);
        expect(result).toBeNull();
    });
    it('should return null when certificate status is not valid', async () => {
        const ocsp = new _PdfOcsp();
        const mockResponse = {
            _responses: [{
                _certificateStatus: { _tagNumber: 1 }
            }]
        };
        spyOn<any>(ocsp, '_getBasicOCSPResponse')
            .and.returnValue(Promise.resolve(mockResponse));

        const result = await ocsp._getEncodedOcspResponse({} as any, {} as any);
        expect(result).toBeNull();
    });
    it('should return null when _getOcspResponse throws error', async () => {
        const ocsp = new _PdfOcsp();
        spyOn<any>(ocsp, '_getOcspResponse')
            .and.returnValue(Promise.reject(new Error('failure')));
        const result = await ocsp._getBasicOCSPResponse(
            {} as any,
            {} as any
        );
        expect(result).toBeNull();
    });
    it('should return null when ocspResponse status is not 0', async () => {
        const ocsp = new _PdfOcsp();
        const mockResponse = {
            _status: 1
        };
        spyOn<any>(ocsp, '_getOcspResponse')
            .and.returnValue(Promise.resolve(mockResponse));
        const result = await ocsp._getBasicOCSPResponse({} as any, {} as any);
        expect(result).toBeNull();
    });
    it('should return response object when status is 0', async () => {
        const ocsp = new _PdfOcsp();
        const expected: any = {};
        const mockResponse = {
            _status: 0,
            _getResponseObject: jasmine.createSpy().and.returnValue(expected)
        };
        spyOn<any>(ocsp, '_getOcspResponse')
            .and.returnValue(Promise.resolve(mockResponse));

        const result = await ocsp._getBasicOCSPResponse({} as any, {} as any);
        expect(result).toBe(expected);
    });
    it('should return null when checkCertificate or rootCertificate is missing', async () => {
        const ocsp = new _PdfOcsp();
        let result = await ocsp._getOcspResponse(
            null as any,
            {} as any
        );
        expect(result).toBeNull();
        result = await ocsp._getOcspResponse(
            {} as any,
            null as any
        );
        expect(result).toBeNull();
    });
    it('should return null when URL is not resolved', async () => {
        const ocsp = new _PdfOcsp();
        spyOn(_PdfCertificateUtility.prototype, '_getOcspUrl')
            .and.returnValue(null);
        const mockCert: any = {
            _structure: {
                _toBeSignedCertificate: {
                    _serialNumber: new Uint8Array([1])
                }
            }
        };
        const result = await ocsp._getOcspResponse(
            mockCert,
            mockCert
        );
        expect(result).toBeNull();
    });
    it('should return object as is when null, undefined, or already _PdfOcspTag', () => {
        const instance = new _PdfOcspTag();
        expect((instance as any)._getOcspName(undefined)).toBeUndefined();
        expect((instance as any)._getOcspName(null)).toBeNull();
        const tag = new _PdfOcspTag(1);
        expect((instance as any)._getOcspName(tag)).toBe(tag);
    });
    [1, 2, 6].forEach(tagNumber => {
        it(`should create _PdfOcspTag for tagNumber ${tagNumber}`, () => {
            const instance = new _PdfOcspTag();
            const mockElement: any = {
                _getTagNumber: jasmine.createSpy().and.returnValue(tagNumber)
            };
            Object.setPrototypeOf(mockElement, _PdfAbstractSyntaxElement.prototype);
            const result = (instance as any)._getOcspName(mockElement);
            expect(result instanceof _PdfOcspTag).toBeTruthy();
            expect(result._tagNumber).toBe(tagNumber);
        });
    });
    it('should throw error for tag number 3', () => {
        const instance = new _PdfOcspTag();
        const mockElement: any = {
            _getTagNumber: jasmine.createSpy().and.returnValue(3)
        };
        Object.setPrototypeOf(mockElement, _PdfAbstractSyntaxElement.prototype);
        expect(() => {
            (instance as any)._getOcspName(mockElement);
        }).toThrowError('Invalid tag number specified 3');
    });
    it('should throw error for invalid object type', () => {
        const instance = new _PdfOcspTag();
        expect(() => {
            (instance as any)._getOcspName(123);
        }).toThrowError('Invalid entry in sequence');
    });
    it('should throw error when request creation fails', () => {
        const creator = new _PdfOcspRequestCreator();
        const mockHelper: any = {
            _toRequest: jasmine.createSpy().and.throwError('failure')
        };
        (creator as any)._list = [mockHelper];
        expect(() => {
            (creator as any)._createRequest();
        }).toThrowError('Invalid request creation');
    });
    it('should set extensions when provided', () => {
        const mockId = {} as _PdfCertificateIdentity;
        const mockExtensions = {} as _PdfX509Extensions;
        const helper: any = new _PdfRequestCreatorHelper(mockId, mockExtensions);
        expect(helper._extensions).toBe(mockExtensions);
    });
    it('should throw error when certificateID is null', () => {
        const mockExtensions = {} as _PdfX509Extensions;
        expect(() => {
            new _PdfRevocationRequest(null as any, mockExtensions);
        }).toThrowError('certificateID cannot be null');
    });
    it('should throw error when certificateID is undefined', () => {
        const mockExtensions = {} as _PdfX509Extensions;
        expect(() => {
            new _PdfRevocationRequest(undefined as any, mockExtensions);
        }).toThrowError('certificateID cannot be null');
    });
    it('should include singleRequestExtensions in ASN1 sequence', () => {
        const mockCertId: any = {
            _getASN1: jasmine.createSpy().and.returnValue({})
        };
        const mockExtensions: any = {
            _getAsn1: jasmine.createSpy().and.returnValue({})
        };
        const request: any = new _PdfRevocationRequest(mockCertId, mockExtensions);
        const result = request._getAsn1();
        expect(mockExtensions._getAsn1).toHaveBeenCalled();
        expect(result).toBeDefined();
    });
    it('should throw error when requests is null', () => {
        expect(() => {
            new _PdfRevocationListRequest(null as any);
        }).toThrowError('requests cannot be null');
    });
    it('should return -1 when response status length is not equal to 1', () => {
        const helper: any = Object.create(_PdfOcspResponseHelper.prototype);
        helper._response = {
            _responseStatus: [1, 2]
        };
        const result = helper._status;
        expect(result).toBe(-1);
    });
    it('should return null when responseBytes is null', () => {
        const helper: any = Object.create(_PdfOcspResponseHelper.prototype);
        helper._response = {
            _responseBytes: null
        };
        const result = helper._getResponseObject();
        expect(result).toBeNull();
    });
    it('should return raw response when responseType is not OCSP', () => {
        const helper: any = Object.create(_PdfOcspResponseHelper.prototype);
        const mockResponse = { data: 'raw' };
        helper._response = {
            _responseBytes: {
                _responseType: {
                    _getDotDelimitedNotation: () => '1.2.3.4'
                },
                _response: mockResponse
            }
        };
        const result = helper._getResponseObject();
        expect(result).toBe(mockResponse);
    });
    it('should throw error when sequence length is not equal to 2', () => {
        const mockSequence: any = {
            _getInner: jasmine.createSpy().and.returnValue({
                _getSequence: jasmine.createSpy().and.returnValue([
                    {}, {}, {} // length = 3 → invalid
                ])
            })
        };
        expect(() => {
            new _PdfRevocationResponseBytes(mockSequence);
        }).toThrowError('Invalid length in sequence');
    });
    it('should return object as is when undefined, null, or instance of _PdfRevocationResponseBytes', () => {
        const instance: any = new (class {
            _getResponseBytes = _PdfRevocationResponseBytes.prototype._getResponseBytes;
        })();
        expect(instance._getResponseBytes(undefined)).toBeUndefined();
        expect(instance._getResponseBytes(null)).toBeNull();
        const responseBytes = new _PdfRevocationResponseBytes();
        expect(instance._getResponseBytes(responseBytes)).toBe(responseBytes);
    });
    it('should return object as-is when undefined, null, or instance', () => {
        const instance = new _PdfRevocationResponseIdentifier();
        expect((instance as any)._getResponseID(undefined)).toBeUndefined();
        expect((instance as any)._getResponseID(null)).toBeNull();
        const identifier = new _PdfRevocationResponseIdentifier();
        expect((instance as any)._getResponseID(identifier)).toBe(identifier);
    });
})
describe('966967 - OCSP Coverage test cases 3', () => {
    it('should create identifier from X509Name for other object types', () => {
        const instance = new _PdfRevocationResponseIdentifier();
        const minimalSequence: any[] = [];
        const result = (instance as any)._getResponseID(minimalSequence);
        expect(result instanceof _PdfRevocationResponseIdentifier).toBeTruthy();
    });
    it('should set versionPresent when tagNumber is 0', () => {
        const mockTag: any = {
            _getTagNumber: () => 0
        };
        Object.setPrototypeOf(mockTag, _PdfUniqueEncodingElement.prototype);
        const responderMock: any = {};
        Object.setPrototypeOf(responderMock, _PdfAbstractSyntaxElement.prototype);
        const sequenceMock: any = {
            _getSequence: () => [
                mockTag,
                responderMock,
                {}, 
                {}
            ]
        };
        const obj: any = new _PdfResponseInformation(sequenceMock);
        expect(obj._versionPresent).toBeTruthy();
        expect(obj._version).toBe(0);
    });
    it('should set default version when tagNumber is not 0', () => {
        const mockTag: any = {
            _getTagNumber: () => 5
        };
        Object.setPrototypeOf(mockTag, _PdfUniqueEncodingElement.prototype);
        const responderMock2: any = {};
        Object.setPrototypeOf(responderMock2, _PdfAbstractSyntaxElement.prototype);
        const sequenceMock: any = {
            _getSequence: () => [
                mockTag,
                responderMock2,
                {}
            ]
        };
        const obj: any = new _PdfResponseInformation(sequenceMock);
        expect(obj._version).toBe(0); // default version1
    });
    it('should set default version when first element is not unique encoding element', () => {
        const responderMock3: any = {};
        Object.setPrototypeOf(responderMock3, _PdfAbstractSyntaxElement.prototype);
        const firstElement: any = { _getSequence: jasmine.createSpy().and.returnValue([]) };
        Object.setPrototypeOf(firstElement, _PdfAbstractSyntaxElement.prototype);
        const sequenceMock: any = {
            _getSequence: () => [
                firstElement,
                responderMock3,
                {} // producedTime
            ]
        };
        const obj: any = new _PdfResponseInformation(sequenceMock);
        expect(obj._version).toBe(0);
    });
    it('should set responseExtensions when extra elements exist', () => {
        const mockTag: any = {
            _getTagNumber: () => 0
        };
        Object.setPrototypeOf(mockTag, _PdfUniqueEncodingElement.prototype);
        const mockExtensions = {};
        spyOn(_PdfX509Extensions.prototype, '_getInstance')
            .and.returnValue(mockExtensions as any);
        const responderMock4: any = {};
        Object.setPrototypeOf(responderMock4, _PdfAbstractSyntaxElement.prototype);
        const sequenceMock: any = {
            _getSequence: () => [
                mockTag,
                responderMock4,
                {},
                {},
                {}
            ]
        };
        const obj: any = new _PdfResponseInformation(sequenceMock);
        expect(obj._responseExtensions).toBe(mockExtensions);
    });
    it('should return object as-is for undefined, null, or instance', () => {
        const instance = new _PdfResponseInformation();
        expect((instance as any)._getInformation(undefined)).toBeUndefined();
        expect((instance as any)._getInformation(null)).toBeNull();
        const obj = new _PdfResponseInformation();
        expect((instance as any)._getInformation(obj)).toBe(obj);
    });
    it('should create new instance when object is ASN element', () => {
        const instance = new _PdfResponseInformation();
        const mockElement: any = {
            _getSequence: (): any[] => []
        };
        Object.setPrototypeOf(mockElement, _PdfAbstractSyntaxElement.prototype);
        const result = (instance as any)._getInformation(mockElement);
        expect(result instanceof _PdfResponseInformation).toBeTruthy();
    });
    it('should throw error for invalid object type', () => {
        const instance = new _PdfResponseInformation();
        expect(() => {
            (instance as any)._getInformation(123);
        }).toThrowError('Invalid entry in sequence');
    });
    it('should include version element when versionPresent is true', () => {
        const instance: any = new _PdfResponseInformation();
        instance._versionPresent = true;
        instance._version = 5; // any value
        instance._responderIdentifier = {
            _getasn1: () => ({})
        };
        instance._producedTime = {};
        instance.sequence = {};
        const result = instance._getAsn1();
        expect(result).toBeDefined();
    });
    it('should include version when version differs from default', () => {
        const instance: any = new _PdfResponseInformation();
        instance._versionPresent = false;
        instance._version = 2;
        instance._responderIdentifier = {
            _getasn1: () => ({})
        };
        instance._producedTime = {};
        instance.sequence = {};
        const result = instance._getAsn1();
        expect(result).toBeDefined();
    });
    it('should include responseExtensions when present', () => {
        const instance: any = new _PdfResponseInformation();
        instance._versionPresent = false;
        instance._version = 0;
        instance._responderIdentifier = {
            _getasn1: () => ({})
        };
        instance._producedTime = {};
        instance.sequence = {};
        instance._responseExtensions = {
            _getAsn1: jasmine.createSpy().and.returnValue({})
        };
        const result = instance._getAsn1();
        expect(instance._responseExtensions._getAsn1).toHaveBeenCalled();
        expect(result).toBeDefined();
    });
    it('should return same object and throw for invalid type in _PdfOcspStatus._getStatus', () => {
        const statusInstance = new _PdfOcspStatus();
        const returned = (statusInstance as any)._getStatus(statusInstance);
        expect(returned).toBe(statusInstance);
        expect(() => {
            (statusInstance as any)._getStatus({} as any);
        }).toThrowError('Invalid entry in sequence');
    });
    it('PdfOneTimeResponseHelper - throws when sequence has less than 3 elements', () => {
        const mockSequence: any = {
            _getSequence: jasmine.createSpy().and.returnValue([{}, {}]) // length 2
        };
        expect(() => {
            new _PdfOneTimeResponseHelper(mockSequence as any);
        }).toThrowError('OneTimeResponseHelper: SEQUENCE must contain at least 3 elements.');
    });
    it('PdfOneTimeResponseHelper - handles nextUpdate and extensions when elements length > 4', () => {
        spyOn<any>(_PdfCertificateIdentityHelper.prototype, '_getCertificateIdentity').and.returnValue({} as any);
        spyOn<any>(_PdfOcspStatus.prototype, '_getStatus').and.returnValue(new _PdfOcspStatus());
        const genSpy = spyOn<any>(_PdfGeneralizedTime.prototype, '_getGeneralizedTimeFromTag').and.returnValue({ when: 'now' } as any);
        const extSpy = spyOn<any>(_PdfX509Extensions.prototype, '_getInstance').and.returnValue({ ext: true } as any);
        const elements = [{}, {}, {}, { tag: 3 }, { tag: 4 }];
        const mockSequence: any = { _getSequence: jasmine.createSpy().and.returnValue(elements) };
        const helper = new _PdfOneTimeResponseHelper(mockSequence as any);
        expect(genSpy).toHaveBeenCalledWith(elements[3], true);
        expect(extSpy).toHaveBeenCalledWith(elements[4]);
        expect((helper as any)._nextUpdate).toBeDefined();
        expect((helper as any)._extensions).toBeDefined();

    });
    it('PdfOcspHelper constructor sets sequence when elements length > 3', () => {
        spyOn<any>(_PdfResponseInformation.prototype, '_getInformation').and.returnValue({} as any);
        spyOn<any>(_PdfAlgorithms.prototype, '_getAlgorithms').and.returnValue({} as any);
        const inner = { inner: true };
        const elements = [{}, {}, {}, { _getInner: jasmine.createSpy().and.returnValue(inner) }];
        const mockSequence: any = { _getSequence: jasmine.createSpy().and.returnValue(elements) };
        Object.setPrototypeOf(mockSequence, _PdfAbstractSyntaxElement.prototype);
        const helper = new _PdfOcspHelper(mockSequence as any);
        expect(mockSequence._getSequence).toHaveBeenCalled();
        expect((helper as any).sequence).toBe(inner);
    });
    it('should parse when inner ASN.1 tag is dateTime', () => {
        const bytes = new Uint8Array([65, 66, 67]);
        const inner: any = {
            _getTagNumber: jasmine.createSpy().and.returnValue(_UniversalType.dateTime),
            _getValue: jasmine.createSpy().and.returnValue(bytes)
        };
        const tag: any = { _getInner: jasmine.createSpy().and.returnValue(inner) };
        const spy = spyOn<any>(_PdfGeneralizedTime.prototype, '_bytesToAscii').and.callThrough();
        const result = new _PdfGeneralizedTime()._getGeneralizedTimeFromTag(tag as any, true);
        expect(tag._getInner).toHaveBeenCalled();
        expect(inner._getTagNumber).toHaveBeenCalled();
        expect(inner._getValue).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(bytes);
        expect(result instanceof _PdfGeneralizedTime).toBeTruthy();
    });
    it('should return generalized time from _getValue when _getOctetString throws', () => {
        const bytes = new Uint8Array([90]);
        const asn1: any = {
            _getTagNumber: jasmine.createSpy().and.returnValue(999),
            _getOctetString: jasmine.createSpy().and.throwError('no octets'),
            _getValue: jasmine.createSpy().and.returnValue(bytes)
        };
        const spy = spyOn<any>(_PdfGeneralizedTime.prototype, '_bytesToAscii').and.callThrough();
        const result = new _PdfGeneralizedTime()._getGeneralizedTimeFromTag(asn1 as any, false);
        expect(asn1._getOctetString).toHaveBeenCalled();
        expect(asn1._getValue).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(bytes);
        expect(result instanceof _PdfGeneralizedTime).toBeTruthy();
    });
    it('PdfOneTimeResponseHelper - handles tagged element when tagNo === 0', () => {
        spyOn<any>(_PdfCertificateIdentityHelper.prototype, '_getCertificateIdentity').and.returnValue({} as any);
        spyOn<any>(_PdfOcspStatus.prototype, '_getStatus').and.returnValue(new _PdfOcspStatus());
        const genSpy = spyOn<any>(_PdfGeneralizedTime.prototype, '_getGeneralizedTimeFromTag').and.returnValue({ when: 'later' } as any);
        const elements = [{}, {}, {}, { _getTagNumber: () => 0 }];
        const mockSequence: any = { _getSequence: jasmine.createSpy().and.returnValue(elements) };
        const helper = new _PdfOneTimeResponseHelper(mockSequence as any);
        expect(genSpy).toHaveBeenCalledWith(elements[3], true);
        expect((helper as any)._nextUpdate).toBeDefined();
    });
    it('PdfOneTimeResponseHelper - handles tagged element when tagNo !== 0 (extensions)', () => {
        spyOn<any>(_PdfCertificateIdentityHelper.prototype, '_getCertificateIdentity').and.returnValue({} as any);
        spyOn<any>(_PdfOcspStatus.prototype, '_getStatus').and.returnValue(new _PdfOcspStatus());
        const extSpy = spyOn<any>(_PdfX509Extensions.prototype, '_getInstance').and.returnValue({ ext: true } as any);
        const elements = [{}, {}, {}, { _getTagNumber: () => 1 }];
        const mockSequence: any = { _getSequence: jasmine.createSpy().and.returnValue(elements) };
        const helper = new _PdfOneTimeResponseHelper(mockSequence as any);
        expect(extSpy).toHaveBeenCalledWith(elements[3]);
        expect((helper as any)._extensions).toBeDefined();
    });
    it('PdfOneTimeResponseHelper._getResponse returns new helper when passed ASN.1 element', () => {
        spyOn<any>(_PdfCertificateIdentityHelper.prototype, '_getCertificateIdentity').and.returnValue({} as any);
        spyOn<any>(_PdfOcspStatus.prototype, '_getStatus').and.returnValue(new _PdfOcspStatus());
        const mockElement: any = { _getSequence: jasmine.createSpy().and.returnValue([{}, {}, {}]) };
        Object.setPrototypeOf(mockElement, _PdfAbstractSyntaxElement.prototype);
        const helper = new _PdfOneTimeResponseHelper();
        const result = (helper as any)._getResponse(mockElement);
        expect(result instanceof _PdfOneTimeResponseHelper).toBeTruthy();
    });
    it('PdfOneTimeResponseHelper._getResponse throws for invalid object types', () => {
        const helper = new _PdfOneTimeResponseHelper();
        expect(() => {
            (helper as any)._getResponse({} as any);
        }).toThrowError('Invalid entry in sequence');
    });
});
describe('966967 - OCSP Coverage test cases 4', () => {
    it('RevocationList._getEncoded returns null when certificate is falsy', async () => {
        const list = new _PdfRevocationList();
        const result = await (list as any)._getEncoded(null as any);
        expect(result).toBeNull();
    });
    it('RevocationList._getEncoded uses provided url and returns bytes from ltvCallback', async () => {
        const list = new _PdfRevocationList();
        const sample = new Uint8Array([1, 2, 3]);
        (list as any)._ltvCallback = async (u: string) => ({ response: sample });
        const mockCert: any = {};
        const res = await (list as any)._getEncoded(mockCert, 'http://example/crl');
        expect(res).toBeDefined();
        expect(res.length).toBe(1);
        expect(res[0]).toBe(sample);
    });
    it('RevocationList._getEncoded returns empty array when _getCrlUrls returns null', async () => {
        spyOn<any>(_PdfCertificateUtility.prototype, '_getCrlUrls').and.returnValue(Promise.resolve(null));
        const list = new _PdfRevocationList();
        const mockCert: any = {};
        (list as any)._ltvCallback = async (u: string) => ({ response: new Uint8Array([9]) });
        const res = await (list as any)._getEncoded(mockCert);
        expect(Array.isArray(res)).toBeTruthy();
        expect(res.length).toBe(0);
    });
    it('RevocationList._getEncoded iterates urls and uses next url when first callback throws', async () => {
        const list = new _PdfRevocationList();
        (list as any)._urls = ['u1', 'u2'];
        let callCount = 0;
        (list as any)._ltvCallback = async (u: string) => {
            callCount++;
            if (u === 'u1') {
                throw new Error('network');
            }
            return { response: new Uint8Array([7, 8, 9]) };
        };
        const mockCert: any = {};
        const res = await (list as any)._getEncoded(mockCert);
        expect(callCount).toBeGreaterThanOrEqual(2);
        expect(res.length).toBe(1);
        expect(res[0].length).toBe(3);
    });
    it('_getCrlPointList throws for invalid object', () => {
        const list = new _PdfRevocationPointList();
        expect(() => {
            (list as any)._getCrlPointList({} as any);
        }).toThrowError('Invalid entry in sequence');
    });
    it('_PdfRevocationDistribution sets issuer when tag number is 2', () => {
        const mockTag: any = { _getTagNumber: () => 2 };
        const seq: any = { _getSequence: jasmine.createSpy().and.returnValue([mockTag]) };
        const spy = spyOn<any>(_PdfRevocationName.prototype, '_getCrlNameFromTag').and.returnValue({ issuer: true } as any);
        const obj = new _PdfRevocationDistribution(seq as any);
        expect(spy).toHaveBeenCalledWith(mockTag);
        expect((obj as any)._issuer).toBeDefined();
    });
    it('_getCrlDistribution returns instance when passed ASN.1 element', () => {
        const tagA: any = { _getTagNumber: () => 5 };
        const tagB: any = { _getTagNumber: () => 7 };
        const mockElement: any = { _getSequence: jasmine.createSpy().and.returnValue([tagA, tagB]) };
        Object.setPrototypeOf(mockElement, _PdfAbstractSyntaxElement.prototype);
        const distribution = new _PdfRevocationDistribution();
        const result = (distribution as any)._getCrlDistribution(mockElement);
        expect(result instanceof _PdfRevocationDistribution).toBeTruthy();
    });
    it('_getCrlDistribution throws for invalid object types', () => {
        const distribution = new _PdfRevocationDistribution();
        expect(() => {
            (distribution as any)._getCrlDistribution({} as any);
        }).toThrowError('Invalid entry in CRL distribution point');
    });
    it('_getCrlName throws for invalid object types', () => {
        const name = new _PdfRevocationName();
        expect(() => {
            (name as any)._getCrlName({} as any);
        }).toThrowError('Invalid entry in sequence');
    });
    it('_PdfRevocationDistributionType handles context-specific fullName tag', () => {
        const mockTag: any = { _getTagNumber: () => 0, _tagClass: _TagClassType.context };
        Object.setPrototypeOf(mockTag, _PdfAbstractSyntaxElement.prototype);
        const spy = spyOn<any>(_PdfRevocationName.prototype, '_getCrlNameFromTag').and.returnValue({ names: [] } as any);
        const instance = new _PdfRevocationDistributionType(mockTag);
        expect(spy).toHaveBeenCalledWith(mockTag);
        expect(instance._pointType).toBe(0);
    });
    it('_PdfRevocationDistributionType throws when tag class is not context', () => {
        const mockTag: any = { _getTagNumber: () => 0, _tagClass: 999 };
        Object.setPrototypeOf(mockTag, _PdfAbstractSyntaxElement.prototype);
        expect(() => {
            new _PdfRevocationDistributionType(mockTag);
        }).toThrowError(`Expected a context-specific tag, got class ${mockTag._tagClass}`);
    });
    it('_PdfRevocationDistributionType throws for unsupported distribution point type', () => {
        const invalidType = 5;
        const mockTag: any = { _getTagNumber: () => invalidType, _tagClass: _TagClassType.context };
        Object.setPrototypeOf(mockTag, _PdfAbstractSyntaxElement.prototype);
        expect(() => {
            new _PdfRevocationDistributionType(mockTag);
        }).toThrowError(`Invalid CRL distribution point type: [${invalidType}]`);
    });
    it('_getDistributionType throws for invalid object types', () => {
        const instance = new _PdfRevocationDistributionType();
        expect(() => {
            (instance as any)._getDistributionType({} as any);
        }).toThrowError('Invalid entry in sequence');
    });
    it('throws when in signing mode', () => {
        const signer = new _PdfRmdSigner('sha256');
        (signer as any)._isSigning = true;
        expect(() => {
            (signer as any)._validateSignature(new Uint8Array([1]));
        }).toThrowError('Invalid operation: not in signing mode');
    });
    it('returns null when hash is empty', () => {
        const signer = new _PdfRmdSigner('sha256');
        spyOn((signer as any)._output, '_getResult').and.returnValue(new Uint8Array([]));
        const res = (signer as any)._validateSignature(new Uint8Array([1]));
        expect(res).toBeFalsy();
    });
    it('returns false when _processBlock throws', () => {
        const signer = new _PdfRmdSigner('sha256');
        spyOn((signer as any)._output, '_getResult').and.returnValue(new Uint8Array([9, 9]));
        spyOn((signer as any)._ronCipherEngine, '_processBlock').and.throwError('fail');
        const res = (signer as any)._validateSignature(new Uint8Array([1, 2, 3]));
        expect(res).toBeFalsy();
    });
    it('returns true when signature matches expected bytes', () => {
        const signer = new _PdfRmdSigner('sha256');
        spyOn((signer as any)._output, '_getResult').and.returnValue(new Uint8Array([1, 2, 3]));
        const expected = new Uint8Array([10, 11, 12]);
        spyOn<any>(signer, '_derEncode').and.returnValue(expected);
        spyOn((signer as any)._ronCipherEngine, '_processBlock').and.returnValue(expected);
        const res = (signer as any)._validateSignature(new Uint8Array([5, 6, 7]));
        expect(res).toBeTruthy();
    });
});
describe('966967 - OCSP Coverage test cases 5', () => {
    it('returns false when signature length matches but content differs', () => {
        const signer = new _PdfRmdSigner('sha256');
        spyOn((signer as any)._output, '_getResult').and.returnValue(new Uint8Array([1, 2, 3]));
        const expected = new Uint8Array([10, 11, 12]);
        spyOn<any>(signer, '_derEncode').and.returnValue(expected);
        spyOn((signer as any)._ronCipherEngine, '_processBlock').and.returnValue(new Uint8Array([10, 99, 12]));
        const res = (signer as any)._validateSignature(new Uint8Array([5, 6, 7]));
        expect(res).toBeFalsy();
    });
    it('handles sig length == expected.length - 2 branch and returns true', () => {
        const signer = new _PdfRmdSigner('sha256');
        // make hash length = 1
        spyOn((signer as any)._output, '_getResult').and.returnValue(new Uint8Array([9]));
        // expected length = hash + 6 => 7
        const expected = new Uint8Array([11, 2, 7, 5, 9, 0, 0]);
        spyOn<any>(signer, '_derEncode').and.returnValue(expected);
        // processBlock returns expected.length - 2 = 5 bytes
        const sig = new Uint8Array([11, 0, 9, 0, 0]);
        spyOn((signer as any)._ronCipherEngine, '_processBlock').and.returnValue(sig);
        const res = (signer as any)._validateSignature(new Uint8Array([1]));
        expect(res).toBeTruthy();
    });
    it('_getChildrenWithFallback returns abstract-set-of when available', () => {
        const signer = new _PdfCryptographicMessageSyntaxSigner({ modulus: 1, exponent: 1 } as any, [] as any, 'SHA256', false);
        const childA: any = { a: 1 };
        const el: any = {
            _getAbstractSetOf: jasmine.createSpy().and.returnValue([childA])
        };
        const out = (signer as any)._getChildrenWithFallback(el);
        expect(el._getAbstractSetOf).toHaveBeenCalled();
        expect(out).toEqual([childA]);
    });
    it('_getChildrenWithFallback falls back to sequence when abstract-set-of empty', () => {
        const signer = new _PdfCryptographicMessageSyntaxSigner({ modulus: 1, exponent: 1 } as any, [] as any, 'SHA256', false);
        const childB: any = { b: 2 };
        const el: any = {
            _getAbstractSetOf: jasmine.createSpy().and.returnValue([]),
            _getSequence: jasmine.createSpy().and.returnValue([childB])
        };
        const out = (signer as any)._getChildrenWithFallback(el);
        expect(el._getAbstractSetOf).toHaveBeenCalled();
        expect(el._getSequence).toHaveBeenCalled();
        expect(out).toEqual([childB]);
    });
    it('_getChildrenWithFallback uses _decodeChildrenFromContentOctets when others empty', () => {
        const signer = new _PdfCryptographicMessageSyntaxSigner({ modulus: 1, exponent: 1 } as any, [] as any, 'SHA256', false);
        const childC: any = { c: 3 };
        const el: any = {
            _getAbstractSetOf: jasmine.createSpy().and.returnValue([]),
            _getSequence: jasmine.createSpy().and.returnValue([]),
            _getValue: jasmine.createSpy().and.returnValue(new Uint8Array([1, 2, 3]))
        };
        spyOn<any>(signer, '_decodeChildrenFromContentOctets').and.returnValue([childC]);
        const out = (signer as any)._getChildrenWithFallback(el);
        expect(el._getAbstractSetOf).toHaveBeenCalled();
        expect(el._getSequence).toHaveBeenCalled();
        expect((signer as any)._decodeChildrenFromContentOctets).toHaveBeenCalledWith(el);
        expect(out).toEqual([childC]);
    });
    it('_getAlgorithmName returns mapping for known OID', () => {
        const utils = new _PdfSignerUtilities();
        const res = (utils as any)._getAlgorithmName('SHA-1withRSA');
        expect(res).toBeDefined();
    });
    it('_getAlgorithmName returns undefined for unknown OID', () => {
        const utils = new _PdfSignerUtilities();
        const res = (utils as any)._getAlgorithmName('1.2.3.999');
        expect(res).toBeUndefined();
    });
});
describe('966967 - OCSP Coverage test cases 6', () => {
    async function mockLTVCallback(url: string, requestbytes?: Uint8Array): Promise<{ response: Uint8Array }> {
        return { response: new Uint8Array([1, 2, 3]) };
    }
    it('966967 - enableLTV with undefined arg1 should use default empty certificates array', async () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'field', { x: 50, y: 50, width: 100, height: 100 });
        const certData = certain1Pfx;
        const password = 'moorthy';
        let sign: PdfSignature = PdfSignature.create(
            certData,
            password,
            {
                cryptographicStandard: CryptographicStandard.cms,
                digestAlgorithm: DigestAlgorithm.sha256
            }
        );
        document.form.add(field);
        field.setSignature(sign);
        const result: boolean = await (sign as any).enableLTV(undefined, RevocationType.ocspAndCrl, false);
        expect(result).toBeDefined();
        document.destroy();
    });
    it('966967 - enableLTV with empty array and RevocationType number should process correctly', async () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'field', { x: 50, y: 50, width: 100, height: 100 });
        const certData = certain1Pfx;
        const password = 'moorthy';
        let sign: PdfSignature = PdfSignature.create(
            certData,
            password,
            {
                cryptographicStandard: CryptographicStandard.cms,
                digestAlgorithm: DigestAlgorithm.sha256
            }
        );
        document.form.add(field);
        field.setSignature(sign);
        const emptyArray: Uint8Array[] = [];
        const revocationType: RevocationType = RevocationType.crl;
        const result: boolean = await (sign as any).enableLTV(emptyArray, revocationType, false);
        expect(result).toBeDefined();
        document.destroy();
    });
    it('enableLTV with array and boolean arg3 should set includePublicCertificates', async () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'field', { x: 50, y: 50, width: 100, height: 100 });
        const certData = certain1Pfx;
        const password = 'moorthy';
        let sign: PdfSignature = PdfSignature.create(
            certData,
            password,
            {
                cryptographicStandard: CryptographicStandard.cms,
                digestAlgorithm: DigestAlgorithm.sha256
            }
        );
        document.form.add(field);
        field.setSignature(sign);
        const emptyArray: Uint8Array[] = [];
        const result: boolean = await (sign as any).enableLTV(emptyArray, RevocationType.ocsp, true);
        expect(result).toBeDefined();
        document.destroy();
    });
    it('enableLTV should throw error for invalid arguments', async () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'field', { x: 50, y: 50, width: 100, height: 100 });
        const certData = certain1Pfx;
        const password = 'moorthy';
        let sign: PdfSignature = PdfSignature.create(
            certData,
            password,
            {
                cryptographicStandard: CryptographicStandard.cms,
                digestAlgorithm: DigestAlgorithm.sha256
            }
        );
        document.form.add(field);
        field.setSignature(sign);
        const invalidArg: any = { invalid: 'object' };
        let errorThrown: boolean = false;
        try {
            await (sign as any).enableLTV(invalidArg);
        } catch (error) {
            errorThrown = true;
            expect(error.message).toBe('Invalid arguments passed to enableLTV.');
        }
        expect(errorThrown).toBe(true);
        document.destroy();
    });
    it('enableLTV should return false when no certificate data is available', async () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'field', { x: 50, y: 50, width: 100, height: 100 });
        let sign: PdfSignature = new (PdfSignature as any)();
        sign._certificate = null;
        document.form.add(field);
        const emptyArray: Uint8Array[] = [];
        const result: boolean = await (sign as any).enableLTV(emptyArray, mockLTVCallback);
        expect(result).toBe(false);
        document.destroy();
    });
    it('enableLTV should use _certificate._chains when available', async () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'field', { x: 50, y: 50, width: 100, height: 100 });
        const certData = certain1Pfx;
        const password = 'moorthy';
        let sign: PdfSignature = PdfSignature.create(
            certData,
            password,
            {
                cryptographicStandard: CryptographicStandard.cms,
                digestAlgorithm: DigestAlgorithm.sha256
            }
        );
        document.form.add(field);
        field.setSignature(sign);
        (sign as any)._certificate._publicKeyCryptographyCertificate = null;
        const result: boolean = await sign.enableLTV(mockLTVCallback);
        expect(result).toBeDefined();
        document.destroy();
    });
    it('enableLTV with undefined arg2 when arg1 is undefined should use default type', async () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'field', { x: 50, y: 50, width: 100, height: 100 });
        const certData = certain1Pfx;
        const password = 'moorthy';
        let sign: PdfSignature = PdfSignature.create(
            certData,
            password,
            {
                cryptographicStandard: CryptographicStandard.cms,
                digestAlgorithm: DigestAlgorithm.sha256
            }
        );
        document.form.add(field);
        field.setSignature(sign);
        const result: boolean = await (sign as any).enableLTV(undefined, undefined, false);
        expect(result).toBeDefined();
        document.destroy();
    });
    it('isRevocationTypeLocal should return false for null value', async () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'field', { x: 50, y: 50, width: 100, height: 100 });
        const certData = certain1Pfx;
        const password = 'moorthy';
        let sign: PdfSignature = PdfSignature.create(
            certData,
            password,
            {
                cryptographicStandard: CryptographicStandard.cms,
                digestAlgorithm: DigestAlgorithm.sha256
            }
        );
        document.form.add(field);
        field.setSignature(sign);
        const result: boolean = await (sign as any).enableLTV([], null, false);
        expect(result).toBeDefined();
        document.destroy();
    });
    it('isRevocationTypeLocal should handle valid RevocationType number', async () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'field', { x: 50, y: 50, width: 100, height: 100 });
        const certData = certain1Pfx;
        const password = 'moorthy';
        let sign: PdfSignature = PdfSignature.create(
            certData,
            password,
            {
                cryptographicStandard: CryptographicStandard.cms,
                digestAlgorithm: DigestAlgorithm.sha256
            }
        );
        document.form.add(field);
        field.setSignature(sign);
        const validRevocationType: number = 0;
        const result: boolean = await (sign as any).enableLTV([], validRevocationType, false);
        expect(result).toBeDefined();
        document.destroy();
    });
    it('isRevocationTypeLocal should handle invalid number for RevocationType', async () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'field', { x: 50, y: 50, width: 100, height: 100 });
        const certData = certain1Pfx;
        const password = 'moorthy';
        let sign: PdfSignature = PdfSignature.create(
            certData,
            password,
            {
                cryptographicStandard: CryptographicStandard.cms,
                digestAlgorithm: DigestAlgorithm.sha256
            }
        );
        document.form.add(field);
        field.setSignature(sign);
        const invalidRevocationType: number = 999;
        const result: boolean = await (sign as any).enableLTV([], invalidRevocationType, false);
        expect(result).toBeDefined();
        document.destroy();
    });
    it('enableLTV should handle arg2 as non-function when arg1 is array', async () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'field', { x: 50, y: 50, width: 100, height: 100 });
        const certData = certain1Pfx;
        const password = 'moorthy';
        let sign: PdfSignature = PdfSignature.create(
            certData,
            password,
            {
                cryptographicStandard: CryptographicStandard.cms,
                digestAlgorithm: DigestAlgorithm.sha256
            }
        );
        document.form.add(field);
        field.setSignature(sign);
        const emptyArray: Uint8Array[] = [];
        const nonFunctionArg: any = 'not-a-function';
        const result: boolean = await (sign as any).enableLTV(emptyArray, nonFunctionArg, false);
        expect(result).toBeDefined();
        document.destroy();
    });
    it('enableLTV should return false when certificate chains are not available', async () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'field', { x: 50, y: 50, width: 100, height: 100 });
        let sign: PdfSignature = new (PdfSignature as any)();
        sign._certificate = { _publicKeyCryptographyCertificate: null } as any;
        document.form.add(field);
        const emptyArray: Uint8Array[] = [];
        const result: boolean = await (sign as any).enableLTV(emptyArray, mockLTVCallback);
        expect(result).toBe(false);
        document.destroy();
    });
    it('_getLTVData should process certificate list with RevocationType.crl', async () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'field', { x: 50, y: 50, width: 100, height: 100 });
        const certData = certain1Pfx;
        const password = 'moorthy';
        let sign: PdfSignature = PdfSignature.create(
            certData,
            password,
            {
                cryptographicStandard: CryptographicStandard.cms,
                digestAlgorithm: DigestAlgorithm.sha256
            }
        );
        document.form.add(field);
        field.setSignature(sign);
        const publicCert1Bytes: Uint8Array = _decode(publicCert1) as Uint8Array;
        const publicCert2Bytes: Uint8Array = _decode(publicCert2) as Uint8Array;
        const result: boolean = await sign.enableLTV([publicCert1Bytes, publicCert2Bytes], RevocationType.crl, mockLTVCallback);
        expect(result).toBeDefined();
        document.destroy();
    });
    it('_getLTVData should process certificate list with RevocationType.ocsp', async () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'field', { x: 50, y: 50, width: 100, height: 100 });
        const certData = certain1Pfx;
        const password = 'moorthy';
        let sign: PdfSignature = PdfSignature.create(
            certData,
            password,
            {
                cryptographicStandard: CryptographicStandard.cms,
                digestAlgorithm: DigestAlgorithm.sha256
            }
        );
        document.form.add(field);
        field.setSignature(sign);
        const publicCert1Bytes: Uint8Array = _decode(publicCert1) as Uint8Array;
        const publicCert2Bytes: Uint8Array = _decode(publicCert2) as Uint8Array;
        const result: boolean = await sign.enableLTV([publicCert1Bytes, publicCert2Bytes], RevocationType.ocsp, mockLTVCallback);
        expect(result).toBeDefined();
        document.destroy();
    });
    it('_getLTVData should process certificate list with RevocationType.ocspOrCrl', async () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'field', { x: 50, y: 50, width: 100, height: 100 });
        const certData = certain1Pfx;
        const password = 'moorthy';
        let sign: PdfSignature = PdfSignature.create(
            certData,
            password,
            {
                cryptographicStandard: CryptographicStandard.cms,
                digestAlgorithm: DigestAlgorithm.sha256
            }
        );
        document.form.add(field);
        field.setSignature(sign);
        const publicCert1Bytes: Uint8Array = _decode(publicCert1) as Uint8Array;
        const publicCert2Bytes: Uint8Array = _decode(publicCert2) as Uint8Array;
        const result: boolean = await sign.enableLTV([publicCert1Bytes, publicCert2Bytes], RevocationType.ocspOrCrl, mockLTVCallback);
        expect(result).toBeDefined();
        document.destroy();
    });
    it('_getLTVData should process with includePublicCertificates flag true', async () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'field', { x: 50, y: 50, width: 100, height: 100 });
        const certData = certain1Pfx;
        const password = 'moorthy';
        let sign: PdfSignature = PdfSignature.create(
            certData,
            password,
            {
                cryptographicStandard: CryptographicStandard.cms,
                digestAlgorithm: DigestAlgorithm.sha256
            }
        );
        document.form.add(field);
        field.setSignature(sign);
        const publicCert1Bytes: Uint8Array = _decode(publicCert1) as Uint8Array;
        const publicCert2Bytes: Uint8Array = _decode(publicCert2) as Uint8Array;
        const result: boolean = await sign.enableLTV([publicCert1Bytes, publicCert2Bytes], RevocationType.ocspAndCrl, true, mockLTVCallback);
        expect(result).toBeDefined();
        document.destroy();
    });
    it('_getLTVData should handle external signature callback with CRL bytes', async () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'field', { x: 50, y: 50, width: 100, height: 100 });
        const certData = certain1Pfx;
        const password = 'moorthy';
        let sign: PdfSignature = PdfSignature.create(
            certData,
            password,
            {
                cryptographicStandard: CryptographicStandard.cms,
                digestAlgorithm: DigestAlgorithm.sha256
            }
        );
        document.form.add(field);
        field.setSignature(sign);
        const publicCert1Bytes: Uint8Array = _decode(publicCert1) as Uint8Array;
        const publicCert2Bytes: Uint8Array = _decode(publicCert2) as Uint8Array;
        const result: boolean = await sign.enableLTV([publicCert1Bytes, publicCert2Bytes], RevocationType.crl, true, mockLTVCallback);
        expect(result).toBeDefined();
        expect(sign._certificate).toBeDefined();
        document.destroy();
    });
    it('_getLTVData should handle empty certificate list', async () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'field', { x: 50, y: 50, width: 100, height: 100 });
        const certData = certain1Pfx;
        const password = 'moorthy';
        let sign: PdfSignature = PdfSignature.create(
            certData,
            password,
            {
                cryptographicStandard: CryptographicStandard.cms,
                digestAlgorithm: DigestAlgorithm.sha256
            }
        );
        document.form.add(field);
        field.setSignature(sign);
        const emptyArray: Uint8Array[] = [];
        const result: boolean = await sign.enableLTV(emptyArray, RevocationType.ocspAndCrl, false, mockLTVCallback);
        expect(result).toBeDefined();
        document.destroy();
    });
    it('_encodeObjectIdentifier should process OID through OCSP response building', async () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'field', { x: 50, y: 50, width: 100, height: 100 });
        const certData = certain1Pfx;
        const password = 'moorthy';
        let sign: PdfSignature = PdfSignature.create(
            certData,
            password,
            {
                cryptographicStandard: CryptographicStandard.cms,
                digestAlgorithm: DigestAlgorithm.sha256
            }
        );
        document.form.add(field);
        field.setSignature(sign);
        async function ocspCallback(url: string, requestbytes?: Uint8Array): Promise<{ response: Uint8Array }> {
            const responseData = new Uint8Array([48, 130, 1, 45, 10, 1, 0, 160, 130, 1, 36, 48, 130, 1, 32]);
            return { response: responseData };
        }
        const publicCert1Bytes: Uint8Array = _decode(publicCert1) as Uint8Array;
        const publicCert2Bytes: Uint8Array = _decode(publicCert2) as Uint8Array;
        const result: boolean = await sign.enableLTV([publicCert1Bytes, publicCert2Bytes], RevocationType.ocsp, ocspCallback);
        expect(result).toBeDefined();
        expect(sign._enableLtv).toBe(true);
        document.destroy();
    });
    it('_buildOcspResponse should construct valid OCSP response structure', async () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'field', { x: 50, y: 50, width: 100, height: 100 });
        const certData = certain1Pfx;
        const password = 'moorthy';
        let sign: PdfSignature = PdfSignature.create(
            certData,
            password,
            {
                cryptographicStandard: CryptographicStandard.cms,
                digestAlgorithm: DigestAlgorithm.sha256
            }
        );
        document.form.add(field);
        field.setSignature(sign);
        const publicCert1Bytes: Uint8Array = _decode(publicCert1) as Uint8Array;
        const publicCert2Bytes: Uint8Array = _decode(publicCert2) as Uint8Array;
        const result: boolean = await sign.enableLTV([publicCert1Bytes, publicCert2Bytes], RevocationType.ocspAndCrl, false, mockLTVCallback);
        expect(result).toBeDefined();
        expect(sign._ltvCallback).toBeDefined();
        document.destroy();
    });
    it('_encodeObjectIdentifier with complex OID should handle multi-byte encoding', async () => {
        const EJDOTNETCORE3040Pfx: string = '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';
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'field', { x: 50, y: 50, width: 100, height: 100 });
        const certData = EJDOTNETCORE3040Pfx;
        const password = 'chinnu@123';
        let sign: PdfSignature = PdfSignature.create(
            certData,
            password,
            {
                cryptographicStandard: CryptographicStandard.cms,
                digestAlgorithm: DigestAlgorithm.sha256
            }
        );
        document.form.add(field);
        field.setSignature(sign);
        async function complexOcspCallback(url: string, requestbytes?: Uint8Array): Promise<{ response: Uint8Array }> {
            const mockOcspResponse = new Uint8Array(200);
            for (let i = 0; i < mockOcspResponse.length; i++) {
                mockOcspResponse[i] = i % 256;
            }
            return { response: mockOcspResponse };
        }
        const result: boolean = await sign.enableLTV(complexOcspCallback);
        expect(result).toBeDefined();
        document.destroy();
    });
    it('enableLTV should process OCSP responses with _buildOcspResponse', async () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'field', { x: 50, y: 50, width: 100, height: 100 });
        const certData = EJDOTNETCORE_4693Pfx;
        const password = 'moorthy';
        let sign: PdfSignature = PdfSignature.create(
            certData,
            password,
            {
                cryptographicStandard: CryptographicStandard.cms,
                digestAlgorithm: DigestAlgorithm.sha256
            }
        );
        document.form.add(field);
        field.setSignature(sign);
        async function ocspOnlyCallback(url: string, requestbytes?: Uint8Array): Promise<{ response: Uint8Array }> {
            if (requestbytes) {
                return { response: new Uint8Array([48, 3, 10, 1, 0]) };
            }
            return { response: new Uint8Array([1, 2, 3]) };
        }
        const result: boolean = await sign.enableLTV(ocspOnlyCallback);
        expect(result).toBeDefined();
        document.destroy();
    });
    it('_getDssDetails should process certificates when includePublicCertificates is true', async () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'field', { x: 50, y: 50, width: 100, height: 100 });
        const certData = certain1Pfx;
        const password = 'moorthy';
        let sign: PdfSignature = PdfSignature.create(
            certData,
            password,
            {
                cryptographicStandard: CryptographicStandard.cms,
                digestAlgorithm: DigestAlgorithm.sha256
            }
        );
        document.form.add(field);
        field.setSignature(sign);
        const publicCert1Bytes: Uint8Array = _decode(publicCert1) as Uint8Array;
        const publicCert2Bytes: Uint8Array = _decode(publicCert2) as Uint8Array;
        const result: boolean = await sign.enableLTV([publicCert1Bytes, publicCert2Bytes], RevocationType.ocsp, true, mockLTVCallback);
        expect(result).toBeDefined();
        expect(sign._dssDictionary).toBeDefined();
        document.destroy();
    });
    it('_getDssDetails should handle existing DSS Certs dictionary entries', async () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'field', { x: 50, y: 50, width: 100, height: 100 });
        const certData = EJDOTNETCORE3040Pfx;
        const password = 'chinnu@123';
        let sign: PdfSignature = PdfSignature.create(
            certData,
            password,
            {
                cryptographicStandard: CryptographicStandard.cms,
                digestAlgorithm: DigestAlgorithm.sha256
            }
        );
        document.form.add(field);
        field.setSignature(sign);
        const publicCert1Bytes: Uint8Array = _decode(publicCert1) as Uint8Array;
        const publicCert2Bytes: Uint8Array = _decode(publicCert2) as Uint8Array;
        const result: boolean = await sign.enableLTV([publicCert1Bytes, publicCert2Bytes], RevocationType.crl, true, mockLTVCallback);
        let savedData: Uint8Array = document.save();
        expect(result).toBeDefined();
        expect(sign._dssDictionary).toBeDefined();
        expect(savedData.length).toBeGreaterThan(0);
        document.destroy();
    });
    it('_getDssDetails should iterate through certsArray when processing existing certificates', async () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'field', { x: 50, y: 50, width: 100, height: 100 });
        const certData = EJDOTNETCORE_4693Pfx;
        const password = 'moorthy';
        let sign: PdfSignature = PdfSignature.create(
            certData,
            password,
            {
                cryptographicStandard: CryptographicStandard.cms,
                digestAlgorithm: DigestAlgorithm.sha256
            }
        );
        document.form.add(field);
        field.setSignature(sign);
        const publicCert1Bytes: Uint8Array = _decode(publicCert1) as Uint8Array;
        const publicCert2Bytes: Uint8Array = _decode(publicCert2) as Uint8Array;
        const result: boolean = await sign.enableLTV([publicCert1Bytes, publicCert2Bytes], RevocationType.ocspOrCrl, true, mockLTVCallback);
        let savedData: Uint8Array = document.save();
        expect(result).toBeDefined();
        expect(sign._dssDictionary).toBeDefined();
        expect(savedData.length).toBeGreaterThan(0);
        document.destroy();
    });
    it('_getDssDetails should compute hash for each certificate in certsArray', async () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'field', { x: 50, y: 50, width: 100, height: 100 });
        const certData = certain1Pfx;
        const password = 'moorthy';
        let sign: PdfSignature = PdfSignature.create(
            certData,
            password,
            {
                cryptographicStandard: CryptographicStandard.cms,
                digestAlgorithm: DigestAlgorithm.sha256
            }
        );
        document.form.add(field);
        field.setSignature(sign);
        const publicCert1Bytes: Uint8Array = _decode(publicCert1) as Uint8Array;
        const publicCert2Bytes: Uint8Array = _decode(publicCert2) as Uint8Array;
        const result: boolean = await sign.enableLTV([publicCert1Bytes, publicCert2Bytes], RevocationType.ocspAndCrl, true, mockLTVCallback);
        let savedData: Uint8Array = document.save();
        expect(result).toBeDefined();
        expect(sign._dssDictionary).toBeDefined();
        expect(savedData.length).toBeGreaterThan(0);
        document.destroy();
    });
    it('_getDssDetails should handle certStream fetch and getBytes operations', async () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'field', { x: 50, y: 50, width: 100, height: 100 });
        const certData = EJDOTNETCORE3040Pfx;
        const password = 'chinnu@123';
        let sign: PdfSignature = PdfSignature.create(
            certData,
            password,
            {
                cryptographicStandard: CryptographicStandard.cms,
                digestAlgorithm: DigestAlgorithm.sha256
            }
        );
        document.form.add(field);
        field.setSignature(sign);
        const publicCert1Bytes: Uint8Array = _decode(publicCert1) as Uint8Array;
        const result: boolean = await sign.enableLTV([publicCert1Bytes], RevocationType.crl, true, mockLTVCallback);
        let savedData: Uint8Array = document.save();
        expect(result).toBeDefined();
        expect(sign._crossReference).toBeDefined();
        expect(savedData.length).toBeGreaterThan(0);
        document.destroy();
    });
    it('_getDssDetails should process all lines in Certs dictionary branch', async () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'field', { x: 50, y: 50, width: 100, height: 100 });
        const certData = EJDOTNETCORE_4693Pfx;
        const password = 'moorthy';
        let sign: PdfSignature = PdfSignature.create(
            certData,
            password,
            {
                cryptographicStandard: CryptographicStandard.cms,
                digestAlgorithm: DigestAlgorithm.sha256
            }
        );
        document.form.add(field);
        field.setSignature(sign);
        const publicCert1Bytes: Uint8Array = _decode(publicCert1) as Uint8Array;
        const publicCert2Bytes: Uint8Array = _decode(publicCert2) as Uint8Array;
        const result: boolean = await sign.enableLTV([publicCert1Bytes, publicCert2Bytes], RevocationType.ocspAndCrl, true, mockLTVCallback);
        let savedData: Uint8Array = document.save();
        expect(result).toBeDefined();
        expect(savedData).toBeDefined();
        expect(savedData.length).toBeGreaterThan(0);
        document.destroy();
    });
    it('_checkSignature should validate certificate signature algorithm match', async () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'field', { x: 50, y: 50, width: 100, height: 100 });
        const certData = certain1Pfx;
        const password = 'moorthy';
        let sign: PdfSignature = PdfSignature.create(
            certData,
            password,
            {
                cryptographicStandard: CryptographicStandard.cms,
                digestAlgorithm: DigestAlgorithm.sha256
            }
        );
        document.form.add(field);
        field.setSignature(sign);
        const publicCert1Bytes: Uint8Array = _decode(publicCert1) as Uint8Array;
        const publicCert2Bytes: Uint8Array = _decode(publicCert2) as Uint8Array;
        const result: boolean = await sign.enableLTV([publicCert1Bytes, publicCert2Bytes], RevocationType.ocsp, true, mockLTVCallback);
        let savedData: Uint8Array = document.save();
        expect(result).toBeDefined();
        expect(savedData.length).toBeGreaterThan(0);
        document.destroy();
    });
    it('_checkSignature should process signature validation through certificate chain', async () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'field', { x: 50, y: 50, width: 100, height: 100 });
        const certData = EJDOTNETCORE_4693Pfx;
        const password = 'moorthy';
        let sign: PdfSignature = PdfSignature.create(
            certData,
            password,
            {
                cryptographicStandard: CryptographicStandard.cms,
                digestAlgorithm: DigestAlgorithm.sha256
            }
        );
        document.form.add(field);
        field.setSignature(sign);
        const publicCert1Bytes: Uint8Array = _decode(publicCert1) as Uint8Array;
        const publicCert2Bytes: Uint8Array = _decode(publicCert2) as Uint8Array;
        const publicCert3Bytes: Uint8Array = _decode(publicCert1) as Uint8Array;
        const result: boolean = await sign.enableLTV([publicCert1Bytes, publicCert2Bytes, publicCert3Bytes], RevocationType.crl, true, mockLTVCallback);
        let savedData: Uint8Array = document.save();
        expect(result).toBeDefined();
        expect(savedData.length).toBeGreaterThan(0);
        document.destroy();
    });
    it('_checkSignature should execute _verify during certificate validation', async () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'field', { x: 50, y: 50, width: 100, height: 100 });
        const certData = EJDOTNETCORE3040Pfx;
        const password = 'chinnu@123';
        let sign: PdfSignature = PdfSignature.create(
            certData,
            password,
            {
                cryptographicStandard: CryptographicStandard.cms,
                digestAlgorithm: DigestAlgorithm.sha256
            }
        );
        document.form.add(field);
        field.setSignature(sign);
        const publicCert1Bytes: Uint8Array = _decode(publicCert1) as Uint8Array;
        const publicCert2Bytes: Uint8Array = _decode(publicCert2) as Uint8Array;
        const publicCert3Bytes: Uint8Array = _decode(publicCert1) as Uint8Array;
        const publicCert4Bytes: Uint8Array = _decode(publicCert2) as Uint8Array;
        const result: boolean = await sign.enableLTV([publicCert1Bytes, publicCert2Bytes, publicCert3Bytes, publicCert4Bytes], RevocationType.ocspAndCrl, true, mockLTVCallback);
        let savedData: Uint8Array = document.save();
        expect(result).toBeDefined();
        expect(savedData.length).toBeGreaterThan(0);
        document.destroy();
    });
    it('_checkSignature signature validation with _validateSignature call', async () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'field', { x: 50, y: 50, width: 100, height: 100 });
        const certData = certain1Pfx;
        const password = 'moorthy';
        let sign: PdfSignature = PdfSignature.create(
            certData,
            password,
            {
                cryptographicStandard: CryptographicStandard.cms,
                digestAlgorithm: DigestAlgorithm.sha256
            }
        );
        document.form.add(field);
        field.setSignature(sign);
        const publicCert2Bytes: Uint8Array = _decode(publicCert2) as Uint8Array;
        const publicCert3Bytes: Uint8Array = _decode(publicCert1) as Uint8Array;
        const result: boolean = await sign.enableLTV([publicCert2Bytes, publicCert3Bytes], RevocationType.ocspOrCrl, true, mockLTVCallback);
        let savedData: Uint8Array = document.save();
        expect(result).toBeDefined();
        expect(savedData.length).toBeGreaterThan(0);
        document.destroy();
    });
    it('_checkSignature should process IssuerName and SubjectName comparison', async () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'field', { x: 50, y: 50, width: 100, height: 100 });
        const certData = EJDOTNETCORE_4693Pfx;
        const password = 'moorthy';
        let sign: PdfSignature = PdfSignature.create(
            certData,
            password,
            {
                cryptographicStandard: CryptographicStandard.cms,
                digestAlgorithm: DigestAlgorithm.sha256
            }
        );
        document.form.add(field);
        field.setSignature(sign);
        const publicCert1Bytes: Uint8Array = _decode(publicCert1) as Uint8Array;
        const publicCert4Bytes: Uint8Array = _decode(publicCert2) as Uint8Array;
        const result: boolean = await sign.enableLTV([publicCert1Bytes, publicCert4Bytes], RevocationType.ocsp, true, mockLTVCallback);
        let savedData: Uint8Array = document.save();
        expect(result).toBeDefined();
        expect(savedData.length).toBeGreaterThan(0);
        document.destroy();
    });
    it('_checkSignature should call _initialize and _blockUpdate on signature', async () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'field', { x: 50, y: 50, width: 100, height: 100 });
        const certData = EJDOTNETCORE3040Pfx;
        const password = 'chinnu@123';
        let sign: PdfSignature = PdfSignature.create(
            certData,
            password,
            {
                cryptographicStandard: CryptographicStandard.cms,
                digestAlgorithm: DigestAlgorithm.sha256
            }
        );
        document.form.add(field);
        field.setSignature(sign);
        const publicCert1Bytes: Uint8Array = _decode(publicCert1) as Uint8Array;
        const publicCert2Bytes: Uint8Array = _decode(publicCert2) as Uint8Array;
        const result: boolean = await sign.enableLTV([publicCert1Bytes, publicCert2Bytes], RevocationType.crl, true, mockLTVCallback);
        let savedData: Uint8Array = document.save();
        expect(result).toBeDefined();
        expect(savedData.length).toBeGreaterThan(0);
        document.destroy();
    });
    it('_checkSignature should retrieve tbsCertificate bytes with _getTobeSignedCertificate', async () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'field', { x: 50, y: 50, width: 100, height: 100 });
        const certData = certain1Pfx;
        const password = 'moorthy';
        let sign: PdfSignature = PdfSignature.create(
            certData,
            password,
            {
                cryptographicStandard: CryptographicStandard.cms,
                digestAlgorithm: DigestAlgorithm.sha256
            }
        );
        document.form.add(field);
        field.setSignature(sign);
        const publicCert1Bytes: Uint8Array = _decode(publicCert1) as Uint8Array;
        const publicCert3Bytes: Uint8Array = _decode(publicCert1) as Uint8Array;
        const publicCert4Bytes: Uint8Array = _decode(publicCert2) as Uint8Array;
        const result: boolean = await sign.enableLTV([publicCert1Bytes, publicCert3Bytes, publicCert4Bytes], RevocationType.ocspAndCrl, true, mockLTVCallback);
        let savedData: Uint8Array = document.save();
        expect(result).toBeDefined();
        expect(savedData.length).toBeGreaterThan(0);
        document.destroy();
    });
    it('_checkSignature comprehensive validation through multiple certificate chains', async () => {
        let document: PdfDocument = new PdfDocument();
        let page: PdfPage = document.addPage();
        let field: PdfSignatureField = new PdfSignatureField(page, 'field', { x: 50, y: 50, width: 100, height: 100 });
        const certData = EJDOTNETCORE_4693Pfx;
        const password = 'moorthy';
        let sign: PdfSignature = PdfSignature.create(
            certData,
            password,
            {
                cryptographicStandard: CryptographicStandard.cms,
                digestAlgorithm: DigestAlgorithm.sha256
            }
        );
        document.form.add(field);
        field.setSignature(sign);
        const publicCert1Bytes: Uint8Array = _decode(publicCert1) as Uint8Array;
        const publicCert2Bytes: Uint8Array = _decode(publicCert2) as Uint8Array;
        const publicCert3Bytes: Uint8Array = _decode(publicCert1) as Uint8Array;
        const publicCert4Bytes: Uint8Array = _decode(publicCert2) as Uint8Array;
        const result: boolean = await sign.enableLTV([publicCert1Bytes, publicCert2Bytes, publicCert3Bytes, publicCert4Bytes], RevocationType.ocspOrCrl, true, mockLTVCallback);
        let savedData: Uint8Array = document.save();
        expect(result).toBeDefined();
        expect(savedData.length).toBeGreaterThan(0);
        expect(sign._enableLtv).toBe(true);
        document.destroy();
    });   
    it('should encode OID with large values (trigger multi-byte encoding)', () => {
        const oid = '1.2.840.113549';
        let ext: _PdfX509Extensions = new _PdfX509Extensions();
        const result: Uint8Array = (ext as any)._encodeObjectIdentifier(oid);
        const expected = new Uint8Array([
            0x2A,
            0x86, 0x48,
            0x86, 0xF7, 0x0D
        ]);
        expect(Array.from(result)).toEqual(Array.from(expected));
    });
    it('should cover continue, critical true, and octetString branches', () => {
        let extensions: _PdfX509Extensions;
        const extMap = new Map<string, _PdfX509Extension>();
        const abstractValue = new _PdfBasicEncodingElement();
        extMap.set('1.2.3', new _PdfX509Extension(true, abstractValue));
        const rawValue = new Uint8Array([1, 2, 3]) as any;
        extMap.set('1.2.4', new _PdfX509Extension(false, rawValue));
        const ordering = ['1.2.3', '1.2.4', '1.2.999'];
        extensions = new _PdfX509Extensions(extMap, ordering);
        const result = extensions._getAsn1();
        expect(result).toBeDefined();
        const outerSeq = result._getSequence();
        expect(outerSeq.length).toBe(1);
        const innerSequence = outerSeq[0]._getSequence();
        expect(innerSequence.length).toBe(2);
    });
    it('should handle null or undefined revocation type', async () => {
        const obj: any = new PdfSignature();
        spyOn(obj, '_getLTVData').and.returnValue(Promise.resolve(true));
        const result = await obj.enableLTV([], null, true);
       expect(result).toBeFalsy();
    });
    it('should handle revocation type as number', async () => {
        const obj: any = new PdfSignature();
        spyOn(obj, '_getLTVData').and.returnValue(Promise.resolve(true));
        const result = await obj.enableLTV([], 0, true);
        expect(result).toBeFalsy();
    });
    it('should handle revocation type as string', async () => {
        const obj: any = new PdfSignature();
        spyOn(obj, '_getLTVData').and.returnValue(Promise.resolve(true));
        const result = await obj.enableLTV([], 'ocspAndCrl' as any, true);
        expect(result).toBeFalsy();
    });
    it('should return false for invalid revocation type value', async () => {
        const obj: any = new PdfSignature();
        spyOn(obj, '_getLTVData').and.returnValue(Promise.resolve(true));
        const result = await obj.enableLTV([], {} as any, true);
        expect(result).toBeFalsy();
    });
    it('should handle undefined revocation type argument', async () => {
        const obj: any = new PdfSignature();
        spyOn(obj, '_getLTVData').and.returnValue(Promise.resolve(true));
        const result = await obj.enableLTV([]);
        expect(result).toBeFalsy();
    });
    it('should throw when issuer and subject algorithms do not match', () => {
        const cert: any = Object.create(_PdfX509Certificate.prototype);
        cert._structure = {
            _signatureAlgorithmIdentifier: {
                _objectID: {
                    _getDotDelimitedNotation: () => '1.2.3'
                }
            },
            _toBeSignedCertificate: {
                _signature: {
                    _objectID: {
                        _getDotDelimitedNotation: () => '1.2.4' // ✅ mismatch
                    }
                }
            }
        };
        const signer: any = {
            _initialize: () => { },
            _blockUpdate: () => { },
            _validateSignature: () => true
        };
        expect(() => {
            cert._checkSignature({}, signer);
        }).toThrowError('signature algorithm in TBS certificate not same as outer certificate');
    });
    it('should throw when signature validation fails', () => {
        const cert: any = Object.create(_PdfX509Certificate.prototype);
        cert._structure = {
            _signatureAlgorithmIdentifier: {
                _objectID: {
                    _getDotDelimitedNotation: () => '1.2.3'
                }
            },
            _toBeSignedCertificate: {
                _signature: {
                    _objectID: {
                        _getDotDelimitedNotation: () => '1.2.3' // ✅ match
                    }
                }
            },
            _signature: {
                _getBytes: () => new Uint8Array([1, 2, 3])
            }
        };
        cert._getTobeSignedCertificate = () => new Uint8Array([10, 20]);
        const signer: any = {
            _initialize: () => { },
            _blockUpdate: () => { },
            _validateSignature: () => false // ✅ force failure
        };
        expect(() => {
            cert._checkSignature({}, signer);
        }).toThrowError('Public key presented not for certificate signature');
    });
});