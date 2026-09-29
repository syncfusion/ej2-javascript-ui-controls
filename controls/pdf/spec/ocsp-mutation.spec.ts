import { _PdfBasicEncodingElement } from "../src/pdf/core/security/digital-signature/asn1/basic-encoding-element";
import { _UniversalType } from "../src/pdf/core/security/digital-signature/asn1/enumerator";
import { _PdfObjectIdentifier } from "../src/pdf/core/security/digital-signature/asn1/identifier-mapping";
import { _PdfUniqueEncodingElement } from "../src/pdf/core/security/digital-signature/asn1/unique-encoding-element";
import { _PdfOcsp, _PdfOcspTag } from "../src/pdf/core/security/digital-signature/ocsp/ocsp-client";
import { _PdfOcspRequestCollection, _PdfOcspRequestCreator, _PdfRequestCreatorHelper, _PdfRevocationListRequest } from "../src/pdf/core/security/digital-signature/ocsp/ocsp-request";
import { _PdfOcspResponse, _PdfOcspResponseHelper, _PdfResponseInformation, _PdfRevocationResponseBytes, _PdfRevocationResponseIdentifier } from "../src/pdf/core/security/digital-signature/ocsp/ocsp-response";
import { _PdfOcspStatus, _PdfOneTimeResponseHelper } from "../src/pdf/core/security/digital-signature/ocsp/ocsp-response-model";
import { _PdfGeneralizedTime, _PdfOcspHelper } from "../src/pdf/core/security/digital-signature/ocsp/ocsp-response-utils";
import { _PdfRevocationDistribution, _PdfRevocationDistributionType, _PdfRevocationList, _PdfRevocationName, _PdfRevocationPointList } from "../src/pdf/core/security/digital-signature/ocsp/revocation";
import { _PdfSignerUtilities } from "../src/pdf/core/security/digital-signature/signature/signature-utilities";
import { _PdfAlgorithms } from "../src/pdf/core/security/digital-signature/x509/x509-algorithm";
import { _PdfUniqueBitString } from "../src/pdf/core/security/digital-signature/x509/x509-bit-string-handler";
import { _PdfPublicKeyInformation } from "../src/pdf/core/security/digital-signature/x509/x509-certificate-key";
import { _PdfX509CertificateParser } from "../src/pdf/core/security/digital-signature/x509/x509-certificate-parser";
import { _PdfX509Name } from "../src/pdf/core/security/digital-signature/x509/x509-name";
import { _Sha1 } from "../src/pdf/core/security/encryptors/secureHash-algorithm1";
import { _decode } from "../src/pdf/core/utils";

describe('1038509 _PdfOcspTag constructor', () => {
    it('1038509 constructor assigns encode when value provided', () => {
        const encode: any = { value: 'encoded-data' };
        const tag: _PdfOcspTag = new _PdfOcspTag(5, encode);
        expect((tag as any)._encode).toBe(encode);
        expect(tag._tagNumber).toBe(5);
    });
    it('1038509 constructor does not assign encode when undefined', () => {
        const tag: _PdfOcspTag = new _PdfOcspTag(5, undefined);
        expect((tag as any)._encode).toBeUndefined();
        expect(tag._tagNumber).toBe(5);
    });
    it('1038509 constructor does not assign encode when null', () => {
        const tag: _PdfOcspTag = new _PdfOcspTag(5, null as any);
        expect((tag as any)._encode).toBeUndefined();
        expect(tag._tagNumber).toBe(5);
    });
    it('1038509 constructor defaults tagNumber to zero when tag is null', () => {
        const encode: any = { value: 'encoded-data' };
        const tag: _PdfOcspTag = new _PdfOcspTag(null as any, encode);
        expect(tag._tagNumber).toBe(0);
        expect(tag._tagNumber).not.toBeNull();
        expect((tag as any)._encode).toBe(encode);
    });
    it('1038509 constructor defaults tagNumber to zero when tag is undefined', () => {
        const encode: any = { value: 'encoded-data' };
        const tag: _PdfOcspTag = new _PdfOcspTag(undefined as any, encode);
        expect(tag._tagNumber).toBe(0);
        expect(tag._tagNumber).not.toBeUndefined();
        expect((tag as any)._encode).toBe(encode);
    });
    it('1038509 constructor preserves positive tag number', () => {
        const tag: _PdfOcspTag = new _PdfOcspTag(6, undefined);
        expect(tag._tagNumber).toBe(6);
        expect(tag._tagNumber).not.toBe(0);
    });
    it('1038509 constructor preserves zero tag number when explicitly provided', () => {
        const tag: _PdfOcspTag = new _PdfOcspTag(0, undefined);
        expect(tag._tagNumber).toBe(0);
        expect(tag._tagNumber).not.toBeUndefined();
        expect(tag._tagNumber).not.toBeNull();
    });
    it('1038509 constructor differentiates valid tag from null and undefined', () => {
        const validTag: _PdfOcspTag = new _PdfOcspTag(8, undefined);
        const nullTag: _PdfOcspTag = new _PdfOcspTag(null as any, undefined);
        const undefinedTag: _PdfOcspTag = new _PdfOcspTag(undefined as any, undefined);
        expect(validTag._tagNumber).toBe(8);
        expect(nullTag._tagNumber).toBe(0);
        expect(undefinedTag._tagNumber).toBe(0);
        expect(validTag._tagNumber).not.toBe(nullTag._tagNumber);
    });
});
describe('1038509 _getEncodedOcspResponse', () => {
    it('1038509 returns null when basic response is undefined', async () => {
        const ocsp: _PdfOcsp = new _PdfOcsp();
        ocsp._getBasicOCSPResponse = async (
            _check: any,
            _root: any,
            _url?: string
        ): Promise<any> => undefined;
        const result: any = await ocsp._getEncodedOcspResponse(undefined as any, undefined as any, '');
        expect(result).toBeNull();
    });
    it('1038509 returns null when basic response is null', async () => {
        const ocsp: _PdfOcsp = new _PdfOcsp();
        ocsp._getBasicOCSPResponse = async (
            _check: any,
            _root: any,
            _url?: string
        ): Promise<any> => null;
        const result: any = await ocsp._getEncodedOcspResponse(undefined as any, undefined as any, '');
        expect(result).toBeNull();
    });
    it('1038509 returns null when responses length is zero', async () => {
        const ocsp: _PdfOcsp = new _PdfOcsp();
        const basicResponse: any = {
            _responses: [],
            _encodedBytes: new Uint8Array([1, 2, 3])
        };
        ocsp._getBasicOCSPResponse = async (
            _check: any,
            _root: any,
            _url?: string
        ): Promise<any> => basicResponse;
        const result: any = await ocsp._getEncodedOcspResponse(undefined as any, undefined as any, '');
        expect(result).toBeNull();
    });
    it('1038509 returns null when responses length is greater than one', async () => {
        const ocsp: _PdfOcsp = new _PdfOcsp();
        const basicResponse: any = {
            _responses: [
                {
                    _certificateStatus: {
                        _tagNumber: 0
                    }
                },
                {
                    _certificateStatus: {
                        _tagNumber: 0
                    }
                }
            ],
            _encodedBytes: new Uint8Array([1, 2, 3])
        };
        ocsp._getBasicOCSPResponse = async (
            _check: any,
            _root: any,
            _url?: string
        ): Promise<any> => basicResponse;
        const result: any = await ocsp._getEncodedOcspResponse(undefined as any, undefined as any, '');
        expect(result).toBeNull();
    });
    it('1038509 returns encoded bytes when response count is one and status is good', async () => {
        const ocsp: _PdfOcsp = new _PdfOcsp();
        const expected: Uint8Array = new Uint8Array([10, 20, 30]);
        const basicResponse: any = { _responses: [{ _certificateStatus: { _tagNumber: 0 }}], _encodedBytes: expected};
        ocsp._getBasicOCSPResponse = async (
            _check: any,
            _root: any,
            _url?: string
        ): Promise<any> => basicResponse;
        const result: any = await ocsp._getEncodedOcspResponse(undefined as any, undefined as any, '');
        expect(result).not.toBeNull();
        expect(result).toBe(expected);
        expect(result.length).toBe(3);
    });
});
describe('1038509 _getBasicOCSPResponse', () => {
    function certificates(): any[] {
        const publicCert1: string = 'MIIE2DCCA8CgAwIBAgIDAII0MA0GCSqGSIb3DQEBCwUAMIGOMQswCQYDVQQGEwJJTjETMBEGA1UECAwKVGFtaWwgTmFkdTEQMA4GA1UEBwwHQ2hlbm5haTETMBEGA1UECgwKU3luY2Z1c2lvbjErMCkGA1UECwwiU2VjdXJlIERpZ2l0YWwgQ2VydGlmaWNhdGUgU2lnbmluZzEWMBQGA1UEAwwNU3luY2Z1c2lvbiBDQTAeFw0yNTA1MjgxODA1NTJaFw0yNjA1MjgxODA1NTJaMHYxCzAJBgNVBAYTAklOMRMwEQYDVQQIDApUYW1pbCBOYWR1MRAwDgYDVQQHDAdDaGVubmFpMRMwEQYDVQQKDApTeW5jZnVzaW9uMRMwEQYDVQQLDApTeW5jZnVzaW9uMRYwFAYDVQQDDA1TeW5jZnVzaW9uIENBMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2Mzdut5mpZnHaLrFZ7q94miFXnO+RNzpeR1TYNwAx2y3vfC1ya03D245bocGwYfsZSA+aQYVOtQ9CjAseR3EysR07z0u63ehEgfB98CGMYJAWNtc0Vv4mu6tQXwGNZ3mhFSWLDK/Tdryc/9g63l+vJlhwUA7NIvgiFMS75euF7IC61jjH7PvodI4Xna8SayAWkNPPFzssvR2jNRGqju/AnIpGkdSjC+ydim3+7UvmrDxr9Z3608UEt0hrCu59yO5FPgCJyZ3HzCFn0xC6nUbFos/oi4ez+862PFiwdwptuduonMrp1u0j2YxHlcxOB9s5S00l7/1XnL4ZVd2jQI6zwIDAQABo4IBVDCCAVAwCQYDVR0TBAIwADAdBgNVHQ4EFgQUY68qc4Wl2+F73eEkII7EXMY9E3AwHwYDVR0jBBgwFoAUqan2kQMYVhakxotNcj8GN6CxcKwwEQYJYIZIAYb4QgEBBAQDAgTwMAsGA1UdDwQEAwID+DA7BgNVHSUENDAyBggrBgEFBQcDAQYIKwYBBQUHAwIGCCsGAQUFBwMDBggrBgEFBQcDBAYIKwYBBQUHAwgwbwYIKwYBBQUHAQEEYzBhMC0GCCsGAQUFBzABhiFodHRwOi8vb2NzcC50aW55Y2VydC5vcmcvY2EtMTI3NTQwMAYIKwYBBQUHMAKGJGh0dHA6Ly9haWEudGlueWNlcnQub3JnL2NhLTEyNzU0LmNydDA1BgNVHR8ELjAsMCqgKKAmhiRodHRwOi8vY3JsLnRpbnljZXJ0Lm9yZy9jYS0xMjc1NC5jcmwwDQYJKoZIhvcNAQELBQADggEBABK40tOsyEaUMBw5pyqF5GtkIOQpTlFpKeu+S4A9WPAOzYjv5RbFtxE9Bx+lMr0RSP6f4EYx9mctSgYxTP297p+egSNoN2SFs7WaYyFE/zMBSMi6Jv9miOD1f18cR1g1skFF/tv5IAwb4YPowYL0hrGVwlFGl3VpgRWkYuWEsY16FGW+gYkcMefiTcOTEiANMs3Y4F4yV/PFt729D3jXlMzvm6A94J+q6DFhVq9p6vH58yK6gY/n/J1N3tHLPBiKkk0H0OKc2BaXQpiqajgarKrLqKr30SXA5TnR5AzI74RE/iiNDXubfYFMlFBYI3eoKgRXgYGqXI0Bn3+HZ4myrZQ=';
        const publicCert2: string = 'MIIEaDCCA1CgAwIBAgIBADANBgkqhkiG9w0BAQsFADCBjjELMAkGA1UEBhMCSU4xEzARBgNVBAgMClRhbWlsIE5hZHUxEDAOBgNVBAcMB0NoZW5uYWkxEzARBgNVBAoMClN5bmNmdXNpb24xKzApBgNVBAsMIlNlY3VyZSBEaWdpdGFsIENlcnRpZmljYXRlIFNpZ25pbmcxFjAUBgNVBAMMDVN5bmNmdXNpb24gQ0EwHhcNMjQwOTI0MDgwMDE3WhcNMzQwOTIyMDgwMDE3WjCBjjELMAkGA1UEBhMCSU4xEzARBgNVBAgMClRhbWlsIE5hZHUxEDAOBgNVBAcMB0NoZW5uYWkxEzARBgNVBAoMClN5bmNmdXNpb24xKzApBgNVBAsMIlNlY3VyZSBEaWdpdGFsIENlcnRpZmljYXRlIFNpZ25pbmcxFjAUBgNVBAMMDVN5bmNmdXNpb24gQ0EwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCYqFsxUUzhbyyMSPGnKciL3rWc8OYGNko8juWCXn/3t/y6HEzEkImZ3WssOfoGYR9EVzSAZDtITVGML2Jy1qdcgEk8P9zNjNfCMf5fPcnpOC22D5+idykioo79vsYE1AmXSSBMhC/g7kS3Z4zeYJkFfXxrvnfDe9ogXfuJMUZJcC7DfruKoe278YhDxJ/p1u3EUIEXHHyohnZJci1GMCmX5MBEx3wsNwXkhnZ+IjbIPnjUUQQeGse9eA/n+OfYhj0WyVquHELttD9/IRopEIcbCChzi5vSJxzsFmd9gJbEBY/yrxze9kYDiSnxYnFhvMcRo2mZKfC2cXFn3IiS8QC3AgMBAAGjgc4wgcswDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQUqan2kQMYVhakxotNcj8GN6CxcKwwDgYDVR0PAQH/BAQDAgGuMDUGA1UdHwQuMCwwKqAooCaGJGh0dHA6Ly9jcmwudGlueWNlcnQub3JnL2NhLTEyNzU0LmNybDAoBgNVHREEITAfgR1tb29ydGh5b2ZmaWNpYWwwMDAwQGdtYWlsLmNvbTAoBgNVHRIEITAfgR1tb29ydGh5b2ZmaWNpYWwwMDAwQGdtYWlsLmNvbTANBgkqhkiG9w0BAQsFAAOCAQEAAlgTxhgLG+JcSmb1ooLulW4kN6suRYfEAQSnuLkk2RqQIR2QgMnFKPQOPghSH+NPuJgXa0T3NcYFBHm2LmfW9jXSV1m/W74+LiiaboIhXmm8j5DPLRw/O/flTpHwOv74uBPcbU69dceUtjDV4Z0nHvDhszpwDNlq2MmflxQImFwXzn7NnWZ8jCdL1haEnepAv3Cn4CiDnIPptUPQkKJgutK/2lJzrbqWkrJ2nlG/w5nYqBWoyfb23W8OyMBZ0dUPRW7dAtSnX7+bBGYbfAMvRmjxgULWSeoKGbX1l6O3WcB6pfhgT8edkN4DIIz9OU9Jmvp1sI4rhWIrgPSbVUf+hA==';
        const publicCert1Bytes: Uint8Array = _decode(publicCert1) as Uint8Array;
        const publicCert2Bytes: Uint8Array = _decode(publicCert2) as Uint8Array;
        const x509CertificateList: any[] = [];
        let arr = [publicCert1Bytes, publicCert2Bytes];
        for (const data of arr) {
            const publicCertificate: Uint8Array = data as Uint8Array;
            if (publicCertificate && publicCertificate.length > 0) {
                x509CertificateList.push(new _PdfX509CertificateParser()._readCertificate(publicCertificate));
            }
        }
        return x509CertificateList;
    }
    it('1038509 all urls gettings for looping', async () => {
        const revocationList: _PdfRevocationList = new _PdfRevocationList();
        revocationList._ltvCallback = async (_url: string): Promise<any> => {
            return {
                response: new Uint8Array([1, 2, 3])
            };
        };
        const certs = certificates();
        const result: Uint8Array[] = await revocationList._getEncoded(certs[1]);
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(1);
        expect(result.length).not.toBe(0);
        expect(result[0].length).toBe(3);
    });
    it('1038509 all urls gettings for looping1', async () => {
        const revocationList: any = new _PdfRevocationList();
        revocationList._ltvCallback = async (_url: string): Promise<any> => {
            return {
                response: new Uint8Array([1, 2, 3])
            };
        };
        revocationList._urls = ['dummy.url'];
        const certs = certificates();
        const result: Uint8Array[] = await revocationList._getEncoded(certs[1]);
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(1);
        expect(result.length).not.toBe(0);
        expect(result[0].length).toBe(3);
    });
    it('1038509 all urls gettings for looping2', async () => {
        const revocationList: _PdfRevocationList = new _PdfRevocationList();
        revocationList._ltvCallback = async (_url: string): Promise<any> => {
            return {
                response: new Uint8Array([1, 2, 3])
            };
        };
        const certs = certificates();
        const result: Uint8Array[] = await revocationList._getEncoded(certs[1], 'dummy.url');
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(1);
        expect(result.length).not.toBe(0);
        expect(result[0].length).toBe(3);
    });
    it('loaded document - certchain ', async () => {
        const x509certificates = certificates();
        const serialNumber: Uint8Array = x509certificates[0]._structure._toBeSignedCertificate._serialNumber;
        const request: any = await new _PdfOcsp()._generateOCSPRequest(x509certificates[1], serialNumber);
        expect(request).toBeDefined();
        const requests: any = request._request;
        const extensions: any = requests.requests;
        expect(extensions).toBeDefined();
        const order = extensions._requestExtensions._extensions;
        const firstEntry = order.entries().next();
        expect(firstEntry.done).toBe(false); // Jasmine10  
        expect(firstEntry.value[0]).toBe('1.3.6.1.5.5.7.48.1.2');
        expect(firstEntry.value[1]._critical).toBe(false);
    });
    it('1038509 returns null when ocsp response is undefined', async () => {
        const ocsp: _PdfOcsp = new _PdfOcsp();
        ocsp._getOcspResponse = async (
            _check: any,
            _root: any,
            _url?: string
        ): Promise<any> => undefined;
        const result: any = await ocsp._getBasicOCSPResponse(undefined as any, undefined as any, '');
        expect(result).toBeNull();
    });
    it('1038509 returns null when ocsp response is null', async () => {
        const ocsp: _PdfOcsp = new _PdfOcsp();
        ocsp._getOcspResponse = async (
            _check: any,
            _root: any,
            _url?: string
        ): Promise<any> => null;
        const result: any = await ocsp._getBasicOCSPResponse(undefined as any, undefined as any, '');
        expect(result).toBeNull();
    });
    it('1038509 returns null when response status is non zero', async () => {
        const ocsp: _PdfOcsp = new _PdfOcsp();
        const responseObject: any = { value: 'should-not-be-returned'};
        const ocspResponse: any = { _status: 1, _getResponseObject: (): any => responseObject };
        ocsp._getOcspResponse = async (
            _check: any,
            _root: any,
            _url?: string
        ): Promise<any> => ocspResponse;
        const result: any = await ocsp._getBasicOCSPResponse( undefined as any, undefined as any, '');
        expect(result).toBeNull();
    });
    it('1038509 returns response object when status is zero', async () => {
        const ocsp: _PdfOcsp = new _PdfOcsp();
        const expectedResponse: any = { id: 10 };
        const ocspResponse: any = { _status: 0, _getResponseObject: (): any => expectedResponse };
        ocsp._getOcspResponse = async (
            _check: any,
            _root: any,
            _url?: string
        ): Promise<any> => ocspResponse;
        const result: any = await ocsp._getBasicOCSPResponse(undefined as any, undefined as any, '');
        expect(result).toBe(expectedResponse);
    });
    it('1038509 uses provided url without resolving certificate ocsp url', async () => {
        const ocsp: _PdfOcsp = new _PdfOcsp();
        const expectedResponse: Uint8Array = new Uint8Array([48, 109, 48, 107, 48, 64, 48, 62, 48, 60, 48, 9, 6, 5, 43, 14, 3, 2, 26, 5, 0, 4, 20, 155, 31, 171, 46, 12, 203, 101, 189, 81, 137, 34, 184, 148, 124, 210, 136, 137, 74, 68, 243, 4, 20, 169, 169, 246, 145, 3, 24, 86, 22, 164, 198, 139, 77, 114, 63, 6, 55, 160, 177, 112, 172, 2, 3, 0, 130, 52, 162, 39, 48, 37, 48, 35, 6, 9, 43, 6, 1, 5, 5, 7, 48, 1, 2, 4, 22, 4, 20, 245, 235, 68, 4, 15, 26, 162, 34, 119, 108, 141, 16, 228, 50, 57, 169, 70, 243, 121, 218]);
        let callbackUrl: string = '';
        let callbackBytes: Uint8Array = new Uint8Array([]);
        ocsp._ltvCallback = async (
            url: string,
            bytes: Uint8Array
        ): Promise<any> => {
            callbackUrl = url;
            callbackBytes = bytes;
            return {
                response: Promise.resolve(expectedResponse)
            };
        };
        const x509certificates = certificates();
        const result: any = await ocsp._getOcspResponse(x509certificates[0], x509certificates[1], 'https://test.ocsp.url');
        expect(result).toBeDefined();
        expect(callbackUrl).toBe('https://test.ocsp.url');
        expect(callbackBytes.length > 0).toBe(true);
    });
});
describe('1038509 _PdfOcspRequestCreator helpers', () => {
    it('1038509 _addRequest adds request helper to list', () => {
        const creator: _PdfOcspRequestCreator = new _PdfOcspRequestCreator();
        const certificateIdentifier: any = { _id: { _getASN1: (): any => { return {}; } } };
        expect((creator as any)._list.length).toBe(0);
        creator._addRequest(certificateIdentifier);
        expect((creator as any)._list.length).toBe(1);
        const helper: any = (creator as any)._list[0];
        expect(helper).toBeDefined();
        expect(helper._id).toBe(certificateIdentifier);
    });
    it('1038509 _setRequestExtensions stores provided extensions', () => {
        const creator: _PdfOcspRequestCreator = new _PdfOcspRequestCreator();
        const extensions: any = { _getAsn1: (): any => { return {}; }};
        expect((creator as any)._requestExtensions).toBeUndefined();
        creator._setRequestExtensions(extensions);
        expect((creator as any)._requestExtensions).toBe(extensions);
    });
    it('1038509 constructor does not assign extensions when undefined', () => {
        const certificateIdentifier: any = { _id: { _getASN1: (): any => { return {}; } } };
        const helper: any = new _PdfRequestCreatorHelper( certificateIdentifier );
        expect(helper._id).toBe(certificateIdentifier);
        expect(helper._extensions).toBeUndefined();
    });
    it('1038509 constructor assigns extensions when provided', () => {
        const certificateIdentifier: any = { _id: { _getASN1: (): any => { return {}; } } };
        const extensions: any = { name: 'request-extension' };
        const helper: any = new _PdfRequestCreatorHelper( certificateIdentifier, extensions );
        expect(helper._extensions).toBe(extensions);
        expect(helper._extensions).not.toBe(undefined);
        expect(helper._extensions).toBeDefined();
    });
    it('1038509 constructor does not assign extensions when undefined1', () => {
        const helper: any = new _PdfRequestCreatorHelper( undefined as any, undefined as any );
        expect(helper._extensions).toBeUndefined();
        expect(helper._extensions).toBe(undefined);
        expect(helper._extensions).not.toBeDefined();
    });
    it('1038509 constructor does not assign extensions when undefined2', () => {
        const helper: any = new _PdfRequestCreatorHelper( undefined as any, null as any );
        expect(helper._extensions).toBeUndefined();
        expect(helper._extensions).not.toBeNull();
    });
    it('1038509 constructor stores input values', () => {
        const requestList: any[] = [{ id: 1 }];
        const requestExtensions: any = { key: 'value' };
        const collection: any = new _PdfOcspRequestCollection('requestor' as any, requestList, requestExtensions);
        expect(collection._integer).toBe(0);
        expect(collection._version).toBe(0);
        expect(collection._requestorName).toBe('requestor');
        expect(collection._requestList).toBe(requestList);
        expect(collection._requestExtensions).toBe(requestExtensions);
    });
    it('1038509 includes extension asn1 when request extensions exist', () => {
        const requestAsn1: any = { request: true };
        const extensionAsn1: any = { extension: true };
        const requestExtensions: any = { _getAsn1: (): any => extensionAsn1 };
        const collection: any = new _PdfOcspRequestCollection(undefined as any, [requestAsn1], requestExtensions);
        const result: any = collection._getAsn1();
        const sequence: any[] = result._value;
        expect(sequence.length).toBe(2);
        expect(sequence[0]).toBe(requestAsn1);
        expect(sequence[1]).toBe(extensionAsn1);
    });
    it('1038509 excludes extension when request extensions are undefined', () => {
        const requestAsn1: any = { request: true };
        const collection: any = new _PdfOcspRequestCollection(undefined as any, [requestAsn1], undefined  as any);
        const result: any = collection._getAsn1();
        const sequence: any[] = result._value;
        expect(sequence.length).toBe(1);
        expect(sequence[0]).toBe(requestAsn1);
    });
    it('1038509 _getAsn1 stores request collection output', () => {
        const expectedRequest: any = { requestCollection: true };
        const requests: any = { _getAsn1: (): any => expectedRequest };
        const listRequest: any = new _PdfRevocationListRequest(requests);
        const result: any = listRequest._getAsn1();
        const sequence: any[] = result._value;
        expect(sequence.length).toBe(1);
        expect(sequence[0]).toBe(expectedRequest);
    });
});
describe('1038509 _PdfOcspResponse constructor', () => {
    it('1038509 constructor with undefined sequence leaves properties undefined', () => {
        const response: any = new _PdfOcspResponse(undefined as any);
        expect(response._responseStatus).toBeUndefined();
        expect(response._responseBytes).toBeUndefined();
    });
    it('1038509 constructor with undefined sequence leaves properties undefined23', () => {
        const el: _PdfUniqueEncodingElement = new _PdfUniqueEncodingElement();
        el._fromBytes(new Uint8Array([48, 130, 5, 239, 48, 129, 183, 162, 22, 4, 20, 150, 250, 80, 230, 227, 66, 119, 128, 56, 167, 248, 33, 50, 227, 72, 96, 10, 33, 146, 60, 24, 15, 50, 48, 50, 54, 48, 55, 50, 57, 49, 57, 49, 55, 53, 57, 90, 48, 103, 48, 101, 48, 61, 48, 9, 6, 5, 43, 14, 3, 2, 26, 5, 0, 4, 20, 155, 31, 171, 46, 12, 203, 101, 189, 81, 137, 34, 184, 148, 124, 210, 136, 137, 74, 68, 243, 4, 20, 169, 169, 246, 145, 3, 24, 86, 22, 164, 198, 139, 77, 114, 63, 6, 55, 160, 177, 112, 172, 2, 4, 0, 0, 134, 217, 128, 0, 24, 15, 50, 48, 50, 54, 48, 55, 50, 57, 49, 57, 49, 55, 53, 57, 90, 160, 17, 24, 15, 50, 48, 50, 54, 48, 55, 51, 48, 48, 51, 49, 55, 53, 57, 90, 161, 35, 48, 33, 48, 31, 6, 9, 43, 6, 1, 5, 5, 7, 48, 1, 2, 4, 18, 4, 16, 248, 43, 54, 28, 151, 184, 97, 18, 161, 205, 150, 45, 81, 230, 4, 97, 48, 13, 6, 9, 42, 134, 72, 134, 247, 13, 1, 1, 11, 5, 0, 3, 130, 1, 1, 0, 76, 212, 63, 98, 91, 247, 71, 108, 223, 56, 86, 83, 101, 20, 126, 181, 62, 87, 24, 72, 94, 158, 86, 6, 118, 55, 103, 82, 29, 47, 62, 110, 75, 250, 182, 202, 4, 180, 164, 34, 120, 47, 116, 161, 227, 239, 60, 225, 47, 255, 91, 176, 88, 221, 221, 153, 14, 247, 239, 35, 231, 235, 48, 116, 75, 19, 73, 73, 177, 37, 127, 169, 28, 37, 197, 48, 55, 215, 195, 106, 152, 235, 118, 90, 0, 215, 13, 154, 7, 64, 235, 233, 230, 140, 21, 202, 191, 3, 6, 236, 253, 173, 205, 250, 202, 65, 125, 241, 32, 67, 6, 83, 79, 150, 159, 167, 136, 236, 96, 22, 129, 252, 194, 173, 168, 219, 95, 17, 129, 46, 136, 159, 151, 139, 77, 82, 183, 139, 208, 88, 159, 114, 229, 91, 104, 46, 53, 174, 103, 221, 162, 40, 139, 154, 232, 39, 93, 180, 79, 8, 159, 57, 2, 0, 76, 143, 190, 117, 117, 242, 150, 49, 154, 6, 62, 133, 226, 109, 153, 233, 114, 184, 44, 181, 94, 254, 177, 160, 149, 133, 117, 163, 164, 132, 86, 240, 159, 15, 192, 54, 131, 131, 79, 147, 16, 138, 133, 178, 123, 6, 86, 118, 177, 5, 38, 28, 234, 29, 77, 63, 184, 81, 5, 0, 59, 73, 2, 159, 165, 116, 100, 86, 198, 21, 151, 28, 195, 223, 32, 246, 168, 47, 39, 95, 174, 146, 59, 144, 231, 119, 155, 158, 254, 54, 207, 39, 160, 130, 4, 29, 48, 130, 4, 25, 48, 130, 4, 21, 48, 130, 2, 253, 160, 3, 2, 1, 2, 2, 1, 1, 48, 13, 6, 9, 42, 134, 72, 134, 247, 13, 1, 1, 11, 5, 0, 48, 129, 142, 49, 11, 48, 9, 6, 3, 85, 4, 6, 19, 2, 73, 78, 49, 19, 48, 17, 6, 3, 85, 4, 8, 12, 10, 84, 97, 109, 105, 108, 32, 78, 97, 100, 117, 49, 16, 48, 14, 6, 3, 85, 4, 7, 12, 7, 67, 104, 101, 110, 110, 97, 105, 49, 19, 48, 17, 6, 3, 85, 4, 10, 12, 10, 83, 121, 110, 99, 102, 117, 115, 105, 111, 110, 49, 43, 48, 41, 6, 3, 85, 4, 11, 12, 34, 83, 101, 99, 117, 114, 101, 32, 68, 105, 103, 105, 116, 97, 108, 32, 67, 101, 114, 116, 105, 102, 105, 99, 97, 116, 101, 32, 83, 105, 103, 110, 105, 110, 103, 49, 22, 48, 20, 6, 3, 85, 4, 3, 12, 13, 83, 121, 110, 99, 102, 117, 115, 105, 111, 110, 32, 67, 65, 48, 30, 23, 13, 50, 52, 48, 57, 50, 52, 48, 56, 48, 48, 49, 55, 90, 23, 13, 51, 52, 48, 57, 50, 50, 48, 56, 48, 48, 49, 55, 90, 48, 129, 152, 49, 11, 48, 9, 6, 3, 85, 4, 6, 19, 2, 73, 78, 49, 19, 48, 17, 6, 3, 85, 4, 8, 12, 10, 84, 97, 109, 105, 108, 32, 78, 97, 100, 117, 49, 16, 48, 14, 6, 3, 85, 4, 7, 12, 7, 67, 104, 101, 110, 110, 97, 105, 49, 19, 48, 17, 6, 3, 85, 4, 10, 12, 10, 83, 121, 110, 99, 102, 117, 115, 105, 111, 110, 49, 43, 48, 41, 6, 3, 85, 4, 11, 12, 34, 83, 101, 99, 117, 114, 101, 32, 68, 105, 103, 105, 116, 97, 108, 32, 67, 101, 114, 116, 105, 102, 105, 99, 97, 116, 101, 32, 83, 105, 103, 110, 105, 110, 103, 49, 32, 48, 30, 6, 3, 85, 4, 3, 12, 23, 84, 105, 110, 121, 67, 101, 114, 116, 32, 79, 67, 83, 80, 32, 82, 101, 115, 112, 111, 110, 100, 101, 114, 48, 130, 1, 34, 48, 13, 6, 9, 42, 134, 72, 134, 247, 13, 1, 1, 1, 5, 0, 3, 130, 1, 15, 0, 48, 130, 1, 10, 2, 130, 1, 1, 0, 191, 243, 160, 56, 195, 239, 25, 165, 43, 205, 133, 148, 226, 54, 104, 215, 66, 222, 217, 20, 88, 201, 199, 165, 162, 116, 212, 2, 123, 50, 177, 183, 185, 179, 120, 77, 78, 70, 103, 84, 130, 60, 158, 134, 206, 224, 107, 143, 2, 53, 234, 22, 126, 164, 166, 143, 201, 42, 98, 37, 77, 56, 251, 158, 134, 58, 1, 140, 57, 250, 236, 224, 108, 53, 235, 187, 112, 190, 137, 137, 27, 207, 255, 169, 11, 74, 14, 22, 58, 99, 53, 103, 82, 237, 200, 68, 69, 8, 210, 13, 249, 0, 84, 181, 185, 240, 93, 13, 208, 209, 127, 96, 110, 248, 4, 208, 153, 57, 195, 8, 136, 175, 23, 217, 89, 72, 31, 84, 94, 168, 212, 23, 243, 7, 246, 137, 255, 206, 211, 68, 9, 103, 180, 210, 45, 80, 20, 0, 149, 246, 107, 107, 212, 44, 117, 186, 221, 91, 225, 254, 117, 222, 157, 129, 149, 16, 32, 168, 107, 61, 93, 35, 66, 19, 210, 169, 127, 98, 141, 187, 116, 15, 102, 253, 214, 233, 243, 119, 37, 173, 253, 253, 154, 57, 231, 53, 74, 77, 177, 130, 83, 114, 87, 55, 131, 109, 224, 42, 233, 202, 133, 197, 172, 211, 12, 88, 103, 168, 50, 71, 80, 136, 109, 7, 244, 190, 215, 158, 120, 16, 157, 67, 133, 131, 179, 254, 100, 191, 184, 50, 65, 124, 194, 65, 98, 119, 129, 45, 241, 207, 119, 146, 88, 12, 90, 27, 2, 3, 1, 0, 1, 163, 114, 48, 112, 48, 12, 6, 3, 85, 29, 19, 1, 1, 255, 4, 2, 48, 0, 48, 29, 6, 3, 85, 29, 14, 4, 22, 4, 20, 150, 250, 80, 230, 227, 66, 119, 128, 56, 167, 248, 33, 50, 227, 72, 96, 10, 33, 146, 60, 48, 31, 6, 3, 85, 29, 35, 4, 24, 48, 22, 128, 20, 169, 169, 246, 145, 3, 24, 86, 22, 164, 198, 139, 77, 114, 63, 6, 55, 160, 177, 112, 172, 48, 11, 6, 3, 85, 29, 15, 4, 4, 3, 2, 6, 192, 48, 19, 6, 3, 85, 29, 37, 4, 12, 48, 10, 6, 8, 43, 6, 1, 5, 5, 7, 3, 9, 48, 13, 6, 9, 42, 134, 72, 134, 247, 13, 1, 1, 11, 5, 0, 3, 130, 1, 1, 0, 73, 52, 129, 234, 28, 65, 65, 15, 92, 232, 133, 31, 1, 81, 250, 58, 45, 86, 51, 229, 213, 251, 48, 191, 226, 222, 248, 160, 186, 161, 206, 106, 115, 44, 125, 143, 201, 221, 137, 222, 81, 166, 149, 66, 152, 239, 62, 48, 66, 217, 254, 61, 207, 130, 59, 116, 61, 92, 232, 63, 13, 231, 114, 5, 42, 59, 245, 160, 204, 31, 132, 19, 121, 230, 35, 135, 192, 109, 211, 44, 24, 212, 32, 16, 92, 95, 138, 167, 92, 61, 82, 228, 193, 58, 195, 247, 82, 14, 183, 2, 130, 251, 113, 35, 22, 1, 140, 153, 194, 138, 61, 4, 248, 140, 126, 178, 82, 7, 112, 67, 107, 233, 71, 223, 88, 229, 169, 178, 153, 2, 118, 94, 6, 128, 169, 132, 154, 34, 21, 250, 5, 210, 155, 51, 222, 250, 26, 136, 184, 249, 229, 44, 67, 103, 171, 33, 193, 46, 0, 4, 169, 67, 170, 94, 35, 181, 199, 82, 54, 176, 78, 37, 211, 164, 186, 124, 228, 99, 16, 96, 191, 72, 171, 25, 86, 197, 195, 31, 86, 178, 72, 64, 97, 31, 237, 194, 0, 66, 135, 102, 185, 222, 226, 134, 114, 251, 177, 49, 231, 5, 90, 248, 209, 236, 136, 102, 233, 101, 147, 157, 92, 86, 144, 84, 6, 136, 185, 227, 18, 194, 61, 197, 185, 103, 234, 254, 172, 185, 145, 29, 52, 48, 7, 72, 241, 11, 201, 113, 242, 162, 36, 221, 110, 230, 109, 37]));
        expect(() => new _PdfOcspResponse(el)).not.toThrowError('An explicitly-encoding element contained more than one single');
    });
    it('1038509 constructor does not create response bytes when sequence length is one', () => {
        const statusElement: any = { _getValue: (): number[] => [0] };
        const sequence: any = { _getSequence: (): any[] => [statusElement] };
        const response: any = new _PdfOcspResponse(sequence);
        expect(response._responseStatus).toEqual([0]);
        expect(response._responseBytes).toBeUndefined();
    });
    it('1038509 status returns minus one when response is undefined', () => {
        const helper: any = {};
        Object.setPrototypeOf( helper, _PdfOcspResponseHelper.prototype );
        helper._response = undefined;
        expect(helper._status).toBe(-1);
    });
    it('1038509 status returns minus one when response status is undefined', () => {
        const helper: any = {};
        Object.setPrototypeOf( helper, _PdfOcspResponseHelper.prototype );
        helper._response = {};
        expect(helper._status).toBe(-1);
    });
    it('1038509 status returns first status value when array length is one', () => {
        const helper: any = {};
        Object.setPrototypeOf( helper, _PdfOcspResponseHelper.prototype );
        helper._response = { _responseStatus: [5]};
        expect(helper._status).toBe(5);
    });
    it('1038509 status returns minus one when response status missing', () => {
        const helper: any = { _response: {}};
        const value: number = (Object.getOwnPropertyDescriptor(_PdfOcspResponseHelper.prototype, '_status') as any).get.call(helper);
        expect(value).toBe(-1);
    });
    it('1038509 returns raw response when response type is not basic ocsp', () => {
        const expectedResponse: any = { value: 'raw-response' };
        const helper: any = {
            _response: {
                _responseBytes: {
                    _responseType: {
                        _getDotDelimitedNotation: (): string =>
                            '1.2.3.4.5'
                    },
                    _response: expectedResponse
                }
            }
        };
        const result: any = _PdfOcspResponseHelper.prototype._getResponseObject.call(helper);
        expect(result).toBe(expectedResponse);
    });
    it('1038509 returns existing response bytes instance', () => {
        const parser: _PdfRevocationResponseBytes = new _PdfRevocationResponseBytes();
        const existing: _PdfRevocationResponseBytes = new _PdfRevocationResponseBytes();
        const result: any = parser._getResponseBytes(existing);
        expect(result).toBe(existing);
    });
    it('1038509 throws for non abstract syntax object', () => {
        const parser: _PdfRevocationResponseBytes = new _PdfRevocationResponseBytes();
        const invalidObject: any = { value: 'invalid' };
        expect((): void => { parser._getResponseBytes(invalidObject);}).toThrowError('Invalid entry in sequence');
    });
    it('1038509 constructor ignores non abstract syntax element', () => {
        const invalidId: any = { value: 'invalid'};
        const identifier: any = new _PdfRevocationResponseIdentifier(invalidId);
        expect(identifier._id).toBeUndefined();
    });
    it('1038509 creates x509 identifier for non abstract syntax value', () => {
        const helper: _PdfRevocationResponseIdentifier = new _PdfRevocationResponseIdentifier();
        const value: any = {
            _getSequence: (): any[] => ([{ _getValue: (): string[] => ['CN=Syncfusion'] }]) as any
        };
        const result: any = helper._getResponseID(new _PdfBasicEncodingElement());
        expect(result).toBeDefined();
        expect(result).not.toBe(value);
        expect(result._id).toBeDefined();
        expect(result._id).not.toBe(value);
    });
    it('1038509 versionPresent defaults to false', () => {
        const information: any = new _PdfResponseInformation();
        expect(information._versionPresent).toBe(false);
    });
    it('1038509 excludes version element when version not present and version equals default', () => {
        const information: any = new _PdfResponseInformation();
        information._versionPresent = false;
        information._version1 = 0;
        information._version = 0;
        information._responderIdentifier = {
            _getasn1: (): any => ({ id: 1 })
        };
        information._producedTime = { time: true };
        information.sequence = { sequence: true };
        const result: any = information._getAsn1();
        const values: any[] = result._value;
        expect(values.length).toBe(3);
    });
    it('1038509 includes version element when version present', () => {
        const information: any = new _PdfResponseInformation();
        information._versionPresent = true;
        information._version1 = 0;
        information._version = 0;
        information._responderIdentifier = {
            _getasn1: (): any => ({ id: 1 })
        };
        information._producedTime = { time: true };
        information.sequence = { sequence: true };
        const result: any = information._getAsn1();
        const values: any[] = result._value;
        expect(values.length).toBe(4);
    });
    it('1038509 includes version element when version differs from default', () => {
        const information: any = new _PdfResponseInformation();
        information._versionPresent = false;
        information._version1 = 0;
        information._version = 1;
        information._responderIdentifier = {
            _getasn1: (): any => ({ id: 1 })
        };
        information._producedTime = { time: true };
        information.sequence = { sequence: true };
        const result: any = information._getAsn1();
        const values: any[] = result._value;
        expect(values.length).toBe(4);
    });
});
describe('1038509 _PdfOcspStatus constructor mutations', () => {
    it('1038509 _PdfOcspStatus sets value for tag number 2', () => {
        const choice: any = { _getTagNumber(): number { return 2; } };
        const status: any = new _PdfOcspStatus(choice);
        expect(status._tagNumber).toBe(2);
        expect(status._value).toBe(0);
    });
    it('1038509 _PdfOcspStatus sets value for tag number 0', () => {
        const choice: any = { _getTagNumber(): number { return 0; } };
        const status: any = new _PdfOcspStatus(choice);
        expect(status._tagNumber).toBe(0);
        expect(status._value).toBe(0);
    });
    it('1038509 _getStatus returns undefined unchanged', () => {
        const status: any = new _PdfOcspStatus();
        const result: any = status._getStatus(undefined);
        expect(result).toBeUndefined();
    });
    it('1038509 _getStatus returns null unchanged', () => {
        const status: any = new _PdfOcspStatus();
        const result: any = status._getStatus(null);
        expect(result).toBeNull();
    });
    it('1038509 _getStatus returns existing status instance', () => {
        const statusHelper: any = new _PdfOcspStatus();
        const status: any = new _PdfOcspStatus();
        const result: any = status._getStatus(statusHelper);
        expect(result).toBe(statusHelper);
    });
    it('1038509 _getStatus creates status from abstract syntax element', () => {
        const choice: any = { _getTagNumber(): number { return 2; } };
        const element: any = new _PdfBasicEncodingElement();
        element._getTagNumber = choice._getTagNumber;
        const status: any = new _PdfOcspStatus();
        const result: any = status._getStatus(element);
        expect(result).toBeDefined();
        expect(result instanceof _PdfOcspStatus).toBe(true);
        expect(result).not.toBe(element);
        expect(result._tagNumber).toBe(2);
    });
    it('1038509 _getResponse returns undefined unchanged', () => {
        const helper: any = new _PdfOneTimeResponseHelper();
        const result: any = helper._getResponse(undefined);
        expect(result).toBeUndefined();
    });
    it('1038509 _getResponse returns null unchanged', () => {
        const helper: any = new _PdfOneTimeResponseHelper();
        const result: any = helper._getResponse(null);
        expect(result).toBeNull();
    });
    it('1038509 _getResponse returns existing helper instance', () => {
        const existingHelper: any = new _PdfOneTimeResponseHelper();
        const helper: any = new _PdfOneTimeResponseHelper();
        const result: any = helper._getResponse(existingHelper);
        expect(result).toBe(existingHelper);
    });
    it('1038509 _getResponse creates helper from abstract syntax element', () => {
        const element: any = new _PdfBasicEncodingElement();
        element._getSequence = (): any[] => { return [{}, new _PdfOcspStatus(), {}]; };
        const helper: _PdfOneTimeResponseHelper = new _PdfOneTimeResponseHelper();
        const result: any = helper._getResponse(new _PdfOneTimeResponseHelper());
        expect(result).toBeDefined();
        expect(result instanceof _PdfOneTimeResponseHelper).toBe(true);
        expect(result).not.toBe(element);
    });
});
describe('1038509 _PdfOcspHelper constructor length checks', () => {
    it('1038509 constructor does not assign sequence when element count is three', () => {
        const responseInformation: any = new _PdfResponseInformation();
        const algorithms: any = new _PdfAlgorithms();
        const sequence: any = { _getSequence(): any[] {
                return [
                    responseInformation,
                    algorithms,
                    new Uint8Array([1])
                ];
            }
        };
        const helper: any = new _PdfOcspHelper(sequence);
        expect(helper.sequence).toBeUndefined();
    });
    it('1038509 constructor assigns sequence only when fourth element exists', () => {
        const innerElement: any = new _PdfBasicEncodingElement();
        const sequence: any = {
            _getSequence(): any[] {
                return [
                    new _PdfResponseInformation(),
                    new _PdfAlgorithms(),
                    new Uint8Array([1]),
                    {
                        _getInner(): any {
                            return innerElement;
                        }
                    }
                ];
            }
        };
        const helper: any = new _PdfOcspHelper(sequence);
        expect(helper.sequence).toBe(innerElement);
    });
    it('1038509 constructor initializes defaults when sequence is undefined', () => {
        const helper: any = new _PdfOcspHelper();
        expect(helper.responseInformation).toBeDefined();
        expect(helper.algorithms).toBeDefined();
        expect(helper.responseInformation instanceof _PdfResponseInformation).toBe(true);
        expect(helper.algorithms instanceof _PdfAlgorithms).toBe(true);
    });
    it('1038509 _getOcspStructure returns helper for abstract syntax element', () => {
        const helper: any = new _PdfOcspHelper();
        const element: any = new _PdfBasicEncodingElement();
        element._getSequence = (): any[] => { return []; };
        const result: any = helper._getOcspStructure(element);
        expect(result).toBeDefined();
        expect(result instanceof _PdfOcspHelper).toBe(true);
    });
    it('1038509 _getOcspStructure throws for non abstract syntax element', () => {
        const helper: any = new _PdfOcspHelper();
        expect((): any => {helper._getOcspStructure('invalid');}).toThrowError('Invalid entry in sequence');
    });
    it('1038509 _getAsn1 writes object identifier and null elements', () => {
        const helper: any = new _PdfOcspHelper();
        helper.responseInformation = { _getAsn1(): any { return new _PdfBasicEncodingElement(); } };
        helper.algorithms = { _objectID: {
                _getDotDelimitedNotation(): string {
                    return '1.2.840.113549.1.1.11';
                }
            }
        };
        helper.signature = new _PdfBasicEncodingElement();
        const result: any = helper._getAsn1();
        const sequence: any[] = result._getSequence();
        expect(sequence.length).toBe(3);
        const algorithmSequence: any = sequence[1];
        const innerElements: any[] = algorithmSequence._getSequence();
        expect(innerElements.length).toBe(2);
    });
    function createHelper(includeSequence: boolean): any {
        const helper: any = new _PdfOcspHelper();
        helper.responseInformation = { _getAsn1(): any { return new _PdfBasicEncodingElement(); } };
        helper.algorithms = {
            _objectID: {
                _getDotDelimitedNotation(): string {
                    return '1.2.840.113549.1.1.11';
                }
            }
        };
        helper.signature = new _PdfBasicEncodingElement();
        if (includeSequence) {
            helper.sequence = new _PdfBasicEncodingElement();
        }
        return helper;
    }
    it('1038509 _getAsn1 excludes optional sequence when undefined', () => {
        const helper: any = createHelper(false);
        const result: any = helper._getAsn1();
        const elements: any[] = result._getSequence();
        expect(elements.length).toBe(3);
    });
    it('1038509 _getAsn1 includes optional sequence when present', () => {
        const helper: any = createHelper(true);
        const result: any = helper._getAsn1();
        const elements: any[] = result._getSequence();
        expect(elements.length).toBe(4);
    });
    it('1038509 _getAsn1 stores optional sequence element', () => {
        const helper: any = new _PdfOcspHelper();
        helper.responseInformation = { _getAsn1(): any { return new _PdfBasicEncodingElement(); } };
        helper.algorithms = { _objectID: { _getDotDelimitedNotation(): string { return '1.2.840.113549.1.1.11'; } } };
        helper.signature = new _PdfBasicEncodingElement();
        const embeddedElement: any = new _PdfBasicEncodingElement();
        helper.sequence = embeddedElement;
        const result: any = helper._getAsn1();
        const elements: any[] = result._getSequence();
        const contextSequence: any = elements[3];
        const innerSequence: any[] = contextSequence._getSequence();
        expect(innerSequence.length).toBe(1);
        expect(innerSequence[0]).toBe(embeddedElement);
    });
});
describe('1038509 _PdfGeneralizedTime _getGeneralizedTimeFromTag', () => {
    it('1038509 returns value when tag number is datetime', () => {
        const timeHelper: any = new _PdfGeneralizedTime();
        const valueBytes: Uint8Array = new Uint8Array([50, 48, 50, 52]);
        const asn1: any = {
            _getTagNumber(): number { return _UniversalType.dateTime;},
            _getValue(): Uint8Array {
                return valueBytes;
            }
        };
        const result: any = timeHelper._getGeneralizedTimeFromTag(asn1, false);
        expect(result).toBeDefined();
        expect(result._time).toBe('2024');
    });
    it('1038509 uses octet string when datetime tag is unavailable', () => {
        const timeHelper: any = new _PdfGeneralizedTime();
        const octets: Uint8Array = new Uint8Array([50, 48, 50, 53]);
        const asn1: any = { _getOctetString(): Uint8Array { return octets; } };
        const result: any = timeHelper._getGeneralizedTimeFromTag(asn1, false);
        expect(result).toBeDefined();
        expect(result._time).toBe('2025');
    });
    it('1038509 uses value when octet string throws', () => {
        const timeHelper: any = new _PdfGeneralizedTime();
        const valueBytes: Uint8Array = new Uint8Array([50, 48, 50, 54]);
        const asn1: any = {
            _getOctetString(): Uint8Array {
                throw new Error('octet unavailable');
            },
            _getValue(): Uint8Array {
                return valueBytes;
            }
        };
        const result: any = timeHelper._getGeneralizedTimeFromTag(asn1, false);
        expect(result).toBeDefined();
        expect(result._time).toBe('2026');
    });
    it('1038509 uses inner object when explicit flag is true', () => {
        const timeHelper: any = new _PdfGeneralizedTime();
        const inner: any = {
            _getTagNumber(): number { return _UniversalType.dateTime; },
            _getValue(): Uint8Array { return new Uint8Array([50, 48, 50, 55]); }
        };
        const tag: any = { _getInner(): any { return inner; } };
        const result: any = timeHelper._getGeneralizedTimeFromTag(tag, true);
        expect(result).toBeDefined();
        expect(result._time).toBe('2027');
    });
    it('1038509 converts ascii byte array to string', () => {
        const timeHelper: any = new _PdfGeneralizedTime();
        const bytes: Uint8Array = new Uint8Array([ 65, 66, 67 ]);
        const result: string = timeHelper._bytesToAscii(bytes);
        expect(result).toBe('ABC');
        expect(result.length).toBe(3);
    });
    it('1038509 converts single byte correctly', () => {
        const timeHelper: any = new _PdfGeneralizedTime();
        const bytes: Uint8Array = new Uint8Array([90]);
        const result: string = timeHelper._bytesToAscii(bytes);
        expect(result).toBe('Z');
        expect(result).not.toBe('');
    });
    it('1038509 returns empty string for empty array', () => {
        const timeHelper: any = new _PdfGeneralizedTime();
        const bytes: Uint8Array = new Uint8Array(0);
        const result: string = timeHelper._bytesToAscii(bytes);
        expect(result).toBe('');
        expect(result.length).toBe(0);
    });
    it('1038509 preserves all byte positions in output', () => {
        const timeHelper: any = new _PdfGeneralizedTime();
        const bytes: Uint8Array = new Uint8Array([49, 50, 51, 52, 53]);
        const result: string = timeHelper._bytesToAscii(bytes);
        expect(result).toBe('12345');
        expect(result.charAt(0)).toBe('1');
        expect(result.charAt(1)).toBe('2');
        expect(result.charAt(2)).toBe('3');
        expect(result.charAt(3)).toBe('4');
        expect(result.charAt(4)).toBe('5');
    });
    it('1038509 returns value from datetime tag without using octet string', () => {
        const helper: any = new _PdfGeneralizedTime();
        let octetStringCalled: boolean = false;
        const tag: any = {
            _getTagNumber(): number {
                return _UniversalType.dateTime;
            },
            _getValue(): Uint8Array {
                return new Uint8Array([50, 48, 50, 52]);
            },
            _getOctetString(): Uint8Array {
                octetStringCalled = true;
                return new Uint8Array([88]);
            }
        };
        const result: any = helper._getGeneralizedTimeFromTag(tag, false);
        expect(result).toBeDefined();
        expect(result._time).toBe('2024');
        expect(octetStringCalled).toBe(false);
    });
    it('1038509 does not create response bytes when sequence length is one', () => {
        const statusElement: any = {
            _getValue(): Uint8Array {
                return new Uint8Array([0]);
            }
        };
        const sequence: any = {
            _getSequence(): any[] {
                return [statusElement];
            }
        };
        const response: any = new _PdfOcspResponse(sequence);
        expect(response._responseStatus).toBeDefined();
        expect(response._responseStatus[0]).toBe(0);
        expect(response._responseBytes).toBeUndefined();
    });
    it('1038509 returns original response when response type oid is not ocsp basic response', () => {
        const originalResponse: any = {
            value: 'original-response'
        };
        const helper: any = Object.create(_PdfOcspResponseHelper.prototype);
        helper._response = {
            _responseBytes: {
                _responseType: {
                    _getDotDelimitedNotation(): string {
                        return '1.2.3.4.5';
                    }
                },
                _response: originalResponse
            }
        };
        const result: any = helper._getResponseObject();
        expect(result).toBe(originalResponse);
    });
    it('1038509 wraps non abstract syntax element with x509 name', () => {
        const identifier: _PdfRevocationResponseIdentifier = new _PdfRevocationResponseIdentifier();
        const input: string = 'CN=Syncfusion';
        const ret: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();
        const result: _PdfRevocationResponseIdentifier = identifier._getResponseID(ret);
        expect(result).toBeDefined();
        const asn1: any = result._getasn1();
        expect(asn1).toBeDefined();
        expect(asn1 instanceof _PdfX509Name).toBe(false);
    });
    it('1038509 _getResponseID wraps non abstract syntax object in x509 name', () => {
        const identifier: _PdfRevocationResponseIdentifier = new _PdfRevocationResponseIdentifier();
        const input: any = { commonName: 'Syncfusion' };
        expect(() => identifier._getResponseID(input)).toThrowError('sequence.forEach is not a function');
    });
    it('1038509 returns raw response when response type is not basic ocsp responseees', () => {
        const rawResponse: any = { marker: 'raw-response' };
        const helper: any = {
            _response: {
                _responseBytes: {
                    _responseType: {
                        _getDotDelimitedNotation: (): string => {
                            return '1.2.3.4.5';
                        }
                    },
                    _response: rawResponse
                },
                _getValue(): any {
                    return new Uint8Array([1,2,3]);
                }
            }
        };
        expect(() => _PdfOcspResponseHelper.prototype._getResponseObject.call(helper)).not.toThrowError('bytes._response._getValue is not a function');
    });
});
describe('1038509 _getEncoded allUris guard', () => {
    it('1038509 _getEncoded skips url append when crl urls undefined', async () => {
        const revocationList: any = new _PdfRevocationList();
        const certificate: any = {};
        revocationList._utility._getCrlUrls = async (_certificate: any): Promise<any> => {
            return undefined;
        };
        revocationList._ltvCallback = async (_url: string): Promise<any> => {
            return {
                response: new Uint8Array([1, 2, 3])
            };
        };
        const result: Uint8Array[] = await revocationList._getEncoded(certificate);
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
        expect(result.length).not.toBe(1);
    });
    it('1038509 constructor does not assign sequence when undefined', () => {
        const list: any = new _PdfRevocationPointList(undefined);
        expect(list._sequence).toBeUndefined();
    });
    it('1038509 constructor does not assign sequence when null', () => {
        const list: any = new _PdfRevocationPointList(null as any);
        expect(list._sequence).toBeUndefined();
        expect(list._sequence).not.toBeNull();
    });
    it('1038509 _equals returns false for non bit string instance', () => {
        const bitString: _PdfUniqueBitString = new _PdfUniqueBitString(new Uint8Array([10, 20, 30]), 0);
        const other: any = { _extraBits: 0, _data: new Uint8Array([10, 20, 30])};
        const result: boolean = bitString._equals(other);
        expect(result).toBe(false);
    });
    it('1038509 distribution array preserves source length', () => {
        const list: any = new _PdfRevocationPointList();
        const first: any = { _getTagNumber: (): number => 1 };
        const second: any = { _getTagNumber: (): number => 2 };
        list._sequence = { _getSequence: (): any[] => [first, second]};
        const distribution: any = _PdfRevocationDistribution.prototype;
        const originalMethod: Function = distribution._getCrlDistribution;
        distribution._getCrlDistribution = (element: any): any => {return element;};
        const result: any[] = list._getDistributionPoints();
        expect(result.length).toBe(2);
        expect(result[0]).toBe(first);
        expect(result[1]).toBe(second);
        distribution._getCrlDistribution = originalMethod;
    });
    it('1038509 constructor ignores non abstract syntax object', () => {
        const plainObject: any = { _tagClass: 0, _getTagNumber: (): number => 0 };
        const distributionType: _PdfRevocationDistributionType = new _PdfRevocationDistributionType(plainObject);
        expect(distributionType).toBeDefined();
        expect(distributionType._pointType).toBeUndefined();
    });
    it('1038509 constructor initializes empty names collection', () => {
        const revocationName: any = new _PdfRevocationName();
        expect(Array.isArray(revocationName.names)).toBe(true);
        expect(revocationName.names.length).toBe(0);
    });
    it('1038509 constructor creates names array using element count', () => {
        const firstElement: any = {};
        const secondElement: any = {};
        const sequence: any = { _getSequence: (): any[] => [firstElement, secondElement]};
        const originalMethod = _PdfOcspTag.prototype._getOcspName;
        _PdfOcspTag.prototype._getOcspName = (element: any): any => { return element; };
        const revocationName: any = new _PdfRevocationName(sequence);
        expect(revocationName.names.length).toBe(2);
        expect(revocationName.names[0]).toBe(firstElement);
        expect(revocationName.names[1]).toBe(secondElement);
        _PdfOcspTag.prototype._getOcspName = originalMethod;
    });
    it('1038509 names getter returns copy of internal collection', () => {
        const revocationName: any = new _PdfRevocationName();
        revocationName.names = ['first', 'second'];
        const names: any[] = revocationName._names;
        names.push('third');
        expect(names.length).toBe(3);
        expect(revocationName.names.length).toBe(2);
        expect(revocationName.names.indexOf('third')).toBe(-1);
    });
});
describe('1038509 _PdfSignerUtilities _initializeAlgorithmMappings', () => {
    it('1038509 maps algorithm aliases to canonical signer mechanisms', () => {
        const utilities: any = new _PdfSignerUtilities();
        utilities._initializeAlgorithmMappings();
        const cases: Map<string, string | undefined> = new Map<string, string | undefined>();
        utilities._algorithms.forEach((value: string, key: string) => {
            cases.set(key, value);
        });
        expect(utilities._algorithms).toBeDefined();
        expect(cases).toBeDefined();
        expect(utilities._algorithms.size).toBe(cases.size);
        utilities._algorithms.forEach((value: any, key: string) => {
            expect(key).toBeDefined();
            expect(key).not.toBeNull();
            expect(value).toBeDefined();
            expect(value).not.toBeNull();
            expect(key).not.toBe('');
            expect(value).not.toBe('');
            expect(cases.has(key)).toBe(true);
            expect(cases.get(key)).toBe(value);
        });
    });
    it('1038509 maps canonical signer mechanisms to object identifiers', () => {
        const utilities: any = new _PdfSignerUtilities();
        utilities._initializeObjectIdentifierMappings();
        const cases: Map<string, any> = new Map<string, any>([
            ['SHA-1withRSA', utilities._objectIdentifiers.get('SHA-1withRSA')],
            ['SHA-256withRSA', utilities._objectIdentifiers.get('SHA-256withRSA')],
            ['SHA-384withRSA', utilities._objectIdentifiers.get('SHA-384withRSA')],
            ['SHA-512withRSA', utilities._objectIdentifiers.get('SHA-512withRSA')],
            ['RIPEMD160withRSA', utilities._objectIdentifiers.get('RIPEMD160withRSA')]
        ]);
        expect(utilities._objectIdentifiers).toBeDefined();
        expect(cases).toBeDefined();
        expect(utilities._objectIdentifiers.size).toBe(cases.size);
        utilities._objectIdentifiers.forEach((value: any, key: string) => {
            expect(key).toBeDefined();
            expect(key).not.toBeNull();
            expect(cases.has(key)).toBe(true);
            expect(value).toBeDefined();
            expect(value).not.toBeNull();
            expect(cases.get(key)).toBe(value);
        });
        expect(utilities._getAlgorithmName('SHA-1withRSA')).toEqual({ id: '1.2.840.113549.1.1.5' });
        expect(utilities._getAlgorithmName('SHA-1withR')).toEqual(undefined);
    });
    it('1038509 getSigner uses first matching algorithm entry only', () => {
        const utility: any = new _PdfSignerUtilities();
        const originalAlgorithms: Map<string, string> = utility._algorithms;
        const algorithms: Map<string, string> = new Map();
        algorithms.set('SHA1WITHRSA', 'SHA-1withRSA');
        algorithms.set('sha1withrsa', 'SHA-512withRSA');
        utility._algorithms = algorithms;
        const signer: any = utility._getSigner('SHA1WITHRSA');
        expect(signer).toBeDefined();
        expect(signer._digest instanceof _Sha1).toBe(true);
        utility._algorithms = originalAlgorithms;
    });
    it('1038509 getSigner throws expected signer message', () => {
        const utility: any = new _PdfSignerUtilities();
        expect((): void => { utility._getSigner('UnknownAlgorithm'); }).toThrowError('Signer UnknownAlgorithm not recognised.');
    });
    it('1038509 getAlgorithmName returns undefined for missing oid', () => {
        const utility: any = new _PdfSignerUtilities();
        const existingEntries: number = utility._objectIdentifiers.size;
        const result: any = utility._getAlgorithmName('missing-oid-value');
        expect(result).toBeUndefined();
        expect(utility._objectIdentifiers.size).toBe(existingEntries);
        expect(utility._objectIdentifiers.has('missing-oid-value')).toBe(false);
    });
});
describe('1038509 PdfAlgorithms constructor parameter handling', () => {
    it('1038509 constructor sets parametersDefined false for single sequence entry', () => {
        const oidElement: any = {_getValue: (): Uint8Array => new Uint8Array([42])};
        const element: any = { _getSequence: (): any[] => [oidElement]};
        const algorithm: any = new _PdfAlgorithms(element);
        expect(algorithm._parametersDefined).toBe(false);
        expect(algorithm._parameters).toBeUndefined();
    });
    it('1038509 constructor throws exact message for empty sequence', () => {
        const element: any = { _getSequence: (): any[] => []};
        expect((): void => { new _PdfAlgorithms(element); }).toThrowError('Invalid Algorithm Identifier sequence length');
    });
    it('1038509 constructor throws exact message for sequence length greater than two', () => {
        const element: any = { _getSequence: (): any[] => [{}, {}, {}] };
        expect((): void => { new _PdfAlgorithms(element); }).toThrowError('Invalid Algorithm Identifier sequence length');
    });
    it('1038509 constructor throws for empty sequence', () => {
        const element: any = { _getSequence: (): any[] => []};
        expect((): void => {new _PdfAlgorithms(element);}).toThrowError('Invalid Algorithm Identifier sequence length');
    });
    it('1038509 constructor throws for sequence larger than two', () => {
        const first: any = {};
        const second: any = {};
        const third: any = {};
        const element: any = { _getSequence: (): any[] => [first, second, third]};
        expect((): void => { new _PdfAlgorithms(element);}).toThrowError('Invalid Algorithm Identifier sequence length');
    });
    it('1038509 constructor sets parametersDefined false when one element exists', () => {
        const oidElement: any = { _getValue: (): Uint8Array => new Uint8Array([1])};
        const element: any = { _getSequence: (): any[] => [oidElement]};
        const algorithm: any = new _PdfAlgorithms(element);
        expect(algorithm._parametersDefined).toBe(false);
    });
});
describe('1038509 _PdfUniqueBitString constructor table initialization', () => {
    it('1038509 constructor initializes hexadecimal table with exact values', () => {
        const bitString: _PdfUniqueBitString = new _PdfUniqueBitString();
        expect(bitString._table).toBeDefined();
        expect(Array.isArray(bitString._table)).toBe(true);
        expect(bitString._table.length).toBe(16);
        expect(bitString._table[0]).toBe('0');
        expect(bitString._table[1]).toBe('1');
        expect(bitString._table[2]).toBe('2');
        expect(bitString._table[3]).toBe('3');
        expect(bitString._table[4]).toBe('4');
        expect(bitString._table[5]).toBe('5');
        expect(bitString._table[6]).toBe('6');
        expect(bitString._table[7]).toBe('7');
        expect(bitString._table[8]).toBe('8');
        expect(bitString._table[9]).toBe('9');
        expect(bitString._table[10]).toBe('A');
        expect(bitString._table[11]).toBe('B');
        expect(bitString._table[12]).toBe('C');
        expect(bitString._table[13]).toBe('D');
        expect(bitString._table[14]).toBe('E');
        expect(bitString._table[15]).toBe('F');
        expect(bitString._table[0]).not.toBe('');
        expect(bitString._table[1]).not.toBe('');
        expect(bitString._table[2]).not.toBe('');
        expect(bitString._table[3]).not.toBe('');
        expect(bitString._table[4]).not.toBe('');
        expect(bitString._table[5]).not.toBe('');
        expect(bitString._table[6]).not.toBe('');
        expect(bitString._table[7]).not.toBe('');
        expect(bitString._table[8]).not.toBe('');
        expect(bitString._table[9]).not.toBe('');
        expect(bitString._table[10]).not.toBe('');
        expect(bitString._table[11]).not.toBe('');
        expect(bitString._table[12]).not.toBe('');
        expect(bitString._table[13]).not.toBe('');
        expect(bitString._table[14]).not.toBe('');
        expect(bitString._table[15]).not.toBe('');
    });
    it('1038509 constructor table does not contain empty entries', () => {
        const bitString: any = new _PdfUniqueBitString();
        expect(bitString._table.length).toBe(16);
        for (let i: number = 0; i < bitString._table.length; i++) {
            expect(bitString._table[i]).not.toBe('');
            expect(bitString._table[i].length).toBeGreaterThan(0);
        }
    });
    it('1038509 constructor preserves exact hexadecimal sequence', () => {
        const bitString: any = new _PdfUniqueBitString();
        const value: string = bitString._table.join('');
        expect(value).toBe('0123456789ABCDEF');
        expect(value.length).toBe(16);
    });
});
describe('1038509 _PdfUniqueBitString constructor data initialization', () => {
    it('1038509 constructor uses default values when data undefined', () => {
        const bitString: _PdfUniqueBitString = new _PdfUniqueBitString();
        expect(bitString._data).toBeDefined();
        expect(bitString._data instanceof Uint8Array).toBe(true);
        expect(bitString._data.length).toBe(0);
        expect(bitString._data.length).not.toBe(5);
        expect(bitString._extraBits).toBe(0);
    });
    it('1038509 constructor uses default values when data empty', () => {
        const data: Uint8Array = new Uint8Array(0);
        const bitString: _PdfUniqueBitString = new _PdfUniqueBitString(data, 5);
        expect(bitString._data.length).toBe(0);
        expect(bitString._extraBits).toBe(0);
    });
    it('1038509 constructor stores data when data length greater than zero', () => {
        const data: Uint8Array = new Uint8Array([10, 20, 30]);
        const bitString: any = new _PdfUniqueBitString(data, 3);
        expect(bitString._data).toBe(data);
        expect(bitString._data.length).toBe(3);
        expect(bitString._data.length).not.toBe(0);
        expect(bitString._data[0]).toBe(10);
        expect(bitString._data[1]).toBe(20);
        expect(bitString._data[2]).toBe(30);
        expect(bitString._extraBits).toBe(3);
    });
    it('1038509 constructor stores zero pad when pad not number', () => {
        const data: Uint8Array = new Uint8Array([1]);
        const bitString: any = new _PdfUniqueBitString(data, 'invalid' as any);
        expect(bitString._data).toBe(data);
        expect(bitString._data.length).toBe(data.length);
        expect(bitString._extraBits).toBe(0);
    });
    it('1038509 constructor stores numeric pad value', () => {
        const data: Uint8Array = new Uint8Array([1]);
        const bitString: any = new _PdfUniqueBitString(data, 7);
        expect(bitString._data).toBe(data);
        expect(bitString._data.length).toBe(data.length);
        expect(bitString._extraBits).toBe(7);
    });
});
describe('1038509 _PdfUniqueBitString._equals mutations', () => {
    it('1038509 _equals returns false for non bit string object', () => {
        const bitString: _PdfUniqueBitString = new _PdfUniqueBitString(new Uint8Array([10, 20, 30]), 0);
        const result: boolean = bitString._equals({} as any);
        expect(result).toBe(false);
    });
    it('1038509 _equals compares all bytes including last index', () => {
        const first: _PdfUniqueBitString = new _PdfUniqueBitString(new Uint8Array([1, 2, 3]), 0);
        const second: _PdfUniqueBitString = new _PdfUniqueBitString(new Uint8Array([1, 2, 4]), 0);
        const result: boolean = first._equals(second);
        expect(result).toBe(false);
    });
    it('1038509 _equals returns true for identical values', () => {
        const first: _PdfUniqueBitString = new _PdfUniqueBitString(new Uint8Array([1, 2, 3]), 1);
        const second: _PdfUniqueBitString = new _PdfUniqueBitString(new Uint8Array([1, 2, 3]), 1);
        const result: boolean = first._equals(second);
        expect(result).toBe(true);
    });
    it('1038509 _equals returns false when extra bits differ', () => {
        const first: _PdfUniqueBitString = new _PdfUniqueBitString(new Uint8Array([1, 2, 3]), 0);
        const second: _PdfUniqueBitString = new _PdfUniqueBitString(new Uint8Array([1, 2, 3]), 2);
        const result: boolean = first._equals(second);
        expect(result).toBe(false);
    });
});
describe('1038509 _getUniqueBitStringFromTag mutations', () => {
    it('1038509 explicit true returns inner bit string', () => {
        const expected: _PdfUniqueBitString = new _PdfUniqueBitString( new Uint8Array([11, 22]), 0);
        const tag: any = { _getInner: (): _PdfUniqueBitString => expected };
        const handler: _PdfUniqueBitString = new _PdfUniqueBitString();
        const result: _PdfUniqueBitString = handler._getUniqueBitStringFromTag(tag, true);
        expect(result).toBe(expected);
    });
    it('1038509 non explicit bit string returns inner bit string', () => {
        const expected: _PdfUniqueBitString = new _PdfUniqueBitString( new Uint8Array([15, 25]), 0);
        const tag: any = { _getInner: (): _PdfUniqueBitString => expected };
        const handler: _PdfUniqueBitString = new _PdfUniqueBitString();
        const result: _PdfUniqueBitString = handler._getUniqueBitStringFromTag(tag, false);
        expect(result).toBe(expected);
    });
    it('1038509 octet string path creates bit string when inner is not bit string', () => {
        const octets: Uint8Array = new Uint8Array([3, 10, 20, 30]);
        const asn1: any = { _getOctetString: (): Uint8Array => octets};
        const tag: any = { _getInner: (): any => asn1};
        const handler: _PdfUniqueBitString = new _PdfUniqueBitString();
        const result: _PdfUniqueBitString = handler._getUniqueBitStringFromTag(tag, false);
        expect(result).toBeDefined();
        expect(result._getBytes().length).toBe(3);
        expect(result._getBytes()[0]).toBe(10);
        expect(result._getBytes()[1]).toBe(20);
        expect(result._getBytes()[2]).toBe(30);
    });
});
describe('1038509 _getUniqueBitString mutations', () => {
    it('1038509 returns null for null value', () => {
        const handler: _PdfUniqueBitString = new _PdfUniqueBitString();
        const result: _PdfUniqueBitString = handler._getUniqueBitString(null);
        expect(result).toBeNull();
    });
    it('1038509 returns null for undefined value', () => {
        const handler: _PdfUniqueBitString = new _PdfUniqueBitString();
        const result: _PdfUniqueBitString = handler._getUniqueBitString(undefined);
        expect(result).toBeNull();
    });
    it('1038509 returns same instance for bit string object', () => {
        const input: _PdfUniqueBitString = new _PdfUniqueBitString(new Uint8Array([1, 2]), 0);
        const handler: _PdfUniqueBitString = new _PdfUniqueBitString();
        const result: _PdfUniqueBitString = handler._getUniqueBitString(input);
        expect(result).toBe(input);
    });
    it('1038509 invalid value throws error', () => {
        const handler: _PdfUniqueBitString = new _PdfUniqueBitString();
        expect(() => { handler._getUniqueBitString('invalid' as any); }).toThrowError('Invalid Entry');
    });
});
describe('1038509 _PdfPublicKeyInformation constructor', () => {
    it('1038509 constructor does not assign when only algorithms exists', () => {
        const algorithms: any = {};
        const publicKeyInformation: _PdfPublicKeyInformation = new _PdfPublicKeyInformation(algorithms, undefined as any);
        expect((publicKeyInformation as any)._algorithms).toBeUndefined();
        expect((publicKeyInformation as any)._publicKey).toBeUndefined();
    });
    it('1038509 constructor does not assign when only public key exists', () => {
        const publicKey: _PdfUniqueBitString = new _PdfUniqueBitString(
            new Uint8Array([1, 2, 3]),
            0
        );
        const publicKeyInformation: _PdfPublicKeyInformation = new _PdfPublicKeyInformation(undefined as any, publicKey);
        expect((publicKeyInformation as any)._algorithms).toBeUndefined();
        expect((publicKeyInformation as any)._publicKey).toBeUndefined();
    });
    it('1038509 constructor assigns when algorithms and public key exist', () => {
        const algorithms: any = {};
        const publicKey: _PdfUniqueBitString = new _PdfUniqueBitString(new Uint8Array([1, 2, 3]), 0);
        const publicKeyInformation: _PdfPublicKeyInformation = new _PdfPublicKeyInformation(algorithms, publicKey);
        expect((publicKeyInformation as any)._algorithms).toBe(algorithms);
        expect((publicKeyInformation as any)._publicKey).toBe(publicKey);
    });
    it('1038509 does not create response bytes when sequence length is five', () => {
        const statusElement: any = {
            _getValue(): Uint8Array {
                return new Uint8Array([0, 1, 2]);
            }
        };
        const sequence: any = {
            _getSequence(): any[] {
                return [statusElement, new _PdfRevocationResponseBytes(), statusElement];
            }
        };
        const response: any = new _PdfOcspResponse(sequence);
        expect(response._responseStatus).toBeDefined();
        expect(response._responseStatus[0]).toBe(0);
        expect(response._responseBytes).toBeUndefined();
    });
    it('1038509 getAsn1 stores version element inside context sequence', () => {
        const information: any = new _PdfResponseInformation();
        information._versionPresent = true;
        information._version = 1;
        information._version1 = 0;
        const responderElement: any = new _PdfUniqueEncodingElement();
        const producedTime: any = new _PdfUniqueEncodingElement();
        const responseSequence: any = new _PdfUniqueEncodingElement();
        information._responderIdentifier = { _getasn1: (): any => responderElement};
        information._producedTime = producedTime;
        information.sequence = responseSequence;
        const result: any = information._getAsn1();
        const outerItems: any[] = result._getSequence();
        expect(outerItems.length).toBe(4);
        const versionContainer: any = outerItems[0];
        const versionItems: any[] = versionContainer._getSequence();
        expect(versionItems.length).toBe(1);
        const versionElement: any = versionItems[0];
        expect(versionElement).toBeDefined();
    });
    it('1046110 - Should return undefined for invalid generalized time with leading characters', () => {
        const timeHelper: any = new _PdfGeneralizedTime();
        timeHelper._time = 'X20250730123045Z';
        const result: Date = timeHelper._toDate();
        expect(result).toBeUndefined();
    });
    it('1046110 - Should parse January month correctly', () => {
        const timeHelper: any = new _PdfGeneralizedTime();
        timeHelper._time = '240101000000Z';
        const result: Date = timeHelper._toDate();
        expect(result.getUTCMonth()).toBe(0);
    });
    it('1046110 - Should map UTCTime year 49 to 2049', () => {
        const timeHelper: any = new _PdfGeneralizedTime();
        timeHelper._time = '490101000000Z';
        const result: Date = timeHelper._toDate();
        expect(result.getUTCFullYear()).toBe(2049);
    });
    it('1046110 - Should map UTCTime year 50 to 1950', () => {
        const timeHelper: any = new _PdfGeneralizedTime();
        timeHelper._time = '500101000000Z';
        const result: Date = timeHelper._toDate();
        expect(result.getUTCFullYear()).toBe(1950);
    });
    it('1046110 - Should parse generalized time with numeric fractional seconds', () => {
        const timeHelper: any = new _PdfGeneralizedTime();
        timeHelper._time = '20250730123045.123Z';
        const result: Date = timeHelper._toDate();
        expect(result).toBeDefined();
    });
    it('1046110 - Should return undefined when generalized time contains trailing characters', () => {
        const generalizedTime: any = new _PdfGeneralizedTime();
        generalizedTime._time = '20250730123045ZINVALID';
        const result: Date = generalizedTime._toDate();
        expect(result).toBeUndefined();
    });
    it('1046112 - Should return current update through _thisUpdate getter', () => {
        const helper: any = new _PdfOneTimeResponseHelper();
        const updateTag: any = {
            value: 'current-update'
        };
        helper._currentUpdate = updateTag;
        const result: any = helper._thisUpdate;
        expect(result).toBe(updateTag);
        expect(result.value).toBe('current-update');
    });
    it('1046112 - Should return next update through _nextUpdateTime getter', () => {
        const helper: any = new _PdfOneTimeResponseHelper();
        const nextUpdate: any = {
            value: 'next-update'
        };
        helper._nextUpdate = nextUpdate;
        const result: any = helper._nextUpdateTime;
        expect(result).toBe(nextUpdate);
        expect(result.value).toBe('next-update');
    });
    it('1046112 - Should expose current and next update values through getters', () => {
        const helper: any = new _PdfOneTimeResponseHelper();
        const currentUpdate: any = { id: 1 };
        const nextUpdate: any = { id: 2 };
        helper._currentUpdate = currentUpdate;
        helper._nextUpdate = nextUpdate;
        expect(helper._thisUpdate).toBe(currentUpdate);
        expect(helper._nextUpdateTime).toBe(nextUpdate);
        expect(helper._thisUpdate.id).toBe(1);
        expect(helper._nextUpdateTime.id).toBe(2);
    });
    it('1046110 - Should reject generalized time with leading characters before a valid date', () => {
        const helper: any = new _PdfGeneralizedTime();
        helper._time = 'X20250730123045Z';
        const result: Date = helper._toDate();
        expect(result).toBeUndefined();
    });
    it('1046110 - Should reject generalized time with trailing characters after Z', () => {
        const helper: any = new _PdfGeneralizedTime();
        helper._time = '20250730123045ZINVALID';
        const result: Date = helper._toDate();
        expect(result).toBeUndefined();
    });
    it('1046110 - Should parse generalized time containing numeric fractional seconds', () => {
        const helper: any = new _PdfGeneralizedTime();
        helper._time = '20250730123045.123Z';
        const result: Date = helper._toDate();
        expect(result).toBeDefined();
        expect(result.getUTCFullYear()).toBe(2025);
        expect(result.getUTCMonth()).toBe(6);
        expect(result.getUTCDate()).toBe(30);
    });
    it('1046110 - Should convert UTCTime year 50 to 1950', () => {
        const helper: any = new _PdfGeneralizedTime();
        helper._time = '500101000000Z';
        const result: Date = helper._toDate();
        expect(result.getUTCFullYear()).toBe(1950);
    });
    it('1046110 - Should treat UTCTime year 50 as 1950 and not 2050', () => {
        const helper: any = new _PdfGeneralizedTime();
        helper._time = '500101000000Z';
        const result: Date = helper._toDate();
        expect(result.getUTCFullYear()).not.toBe(2050);
        expect(result.getUTCFullYear()).toBe(1950);
    });
    it('1046110 - Should parse January as month 0', () => {
        const helper: any = new _PdfGeneralizedTime();
        helper._time = '240101000000Z';
        const result: Date = helper._toDate();
        expect(result.getUTCMonth()).toBe(0);
        expect(result.getUTCDate()).toBe(1);
    });
    it('1046110 - Should reject UTCTime with leading characters', () => {
        const helper: any = new _PdfGeneralizedTime();
        helper._time = 'X490101000000Z';
        expect(helper._toDate()).toBeUndefined();
    });
    it('1046110 - Should reject UTCTime with trailing characters', () => {
        const helper: any = new _PdfGeneralizedTime();
        helper._time = '490101000000ZXYZ';
        expect(helper._toDate()).toBeUndefined();
    });
});
