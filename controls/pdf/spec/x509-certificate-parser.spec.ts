import { _PdfX509CertificateStructure } from
    '../src/pdf/core/security/digital-signature/x509/x509-certificate-structure';
import { _PdfX509Certificate } from
    '../src/pdf/core/security/digital-signature/x509/x509-certificate';
import { _PdfX509CertificateParser } from
    '../src/pdf/core/security/digital-signature/x509/x509-certificate-parser';
import { _PdfBasicEncodingElement } from
    '../src/pdf/core/security/digital-signature/asn1/basic-encoding-element';
import { _PdfAbstractSyntaxElement } from '../src/pdf/core/security/digital-signature/asn1/abstract-syntax';

describe('_PdfX509CertificateParser _readDistinguishEncoderCertificate sequence length guards', () => {

    it('throws for a single SignedData OID sequence instead of reading cached certificate data', () => {
        // Arrange
        const parser: _PdfX509CertificateParser =
            new _PdfX509CertificateParser();

        /*
         * ASN.1 structure:
         *
         * SEQUENCE
         *   OBJECT IDENTIFIER 1.2.840.113549.1.7.2
         *
         * The outer sequence contains exactly one element.
         */
        const signedDataOidBytes: Uint8Array = new Uint8Array([
            0x30, 0x0B,
            0x06, 0x09,
            0x2A, 0x86, 0x48, 0x86, 0xF7, 0x0D, 0x01, 0x07, 0x02
        ]);

        const originalGetCertificate:
            (isCertificateParsing?: boolean) => _PdfX509Certificate =
            parser._getCertificate;

        let getCertificateCalls: number = 0;

        parser._getCertificate =
            (_isCertificateParsing?: boolean):
                _PdfX509Certificate => {
                getCertificateCalls++;
                return undefined as any;
            };

        // Act
        const readSingleElementSequence: () => _PdfX509Certificate =
            (): _PdfX509Certificate => {
                return parser._readDistinguishEncoderCertificate(
                    signedDataOidBytes,
                    false
                );
            };

        // Assert
        expect(readSingleElementSequence).toThrowError(
            Error,
            'Invalid certificate sequence length: 1'
        );
        expect(getCertificateCalls).toBe(0);

        parser._getCertificate = originalGetCertificate;
    });
});

describe('_PdfX509CertificateParser _readDistinguishEncoderCertificate SignedData extraction', () => {
    it('extracts certificate set when SignedData contains exactly two outer elements', () => {
        // Arrange
        const parser: _PdfX509CertificateParser =
            new _PdfX509CertificateParser();

        /*
         * ASN.1 structure:
         *
         * SEQUENCE
         *   OBJECT IDENTIFIER 1.2.840.113549.1.7.2
         *   [0]
         *     SEQUENCE
         *       [0]
         *         SET
         *           SEQUENCE
         *             NULL
         *
         * The outer sequence contains exactly two elements:
         * 1. SignedData object identifier
         * 2. Context-specific SignedData content
         */
        const signedDataBytes: Uint8Array = new Uint8Array([
            0x30, 0x17,
            0x06, 0x09,
            0x2A, 0x86, 0x48, 0x86, 0xF7, 0x0D, 0x01, 0x07, 0x02,
            0xA0, 0x0A,
            0x30, 0x08,
            0xA0, 0x06,
            0x31, 0x04,
            0x30, 0x02,
            0x05, 0x00
        ]);

        const originalGetCertificate:
            (isCertificateParsing?: boolean) => _PdfX509Certificate =
            parser._getCertificate;

        let getCertificateCalls: number = 0;
        let receivedParsingMode: boolean = true;
        let extractedDataLength: number = 0;

        parser._getCertificate =
            (isCertificateParsing?: boolean):
                _PdfX509Certificate => {
                getCertificateCalls++;
                receivedParsingMode = isCertificateParsing === true;

                const extractedData: _PdfBasicEncodingElement[] =
                    (parser as any)._sData;

                if (extractedData) {
                    extractedDataLength = extractedData.length;
                }

                return undefined as any;
            };

        // Act
        const result: _PdfX509Certificate =
            parser._readDistinguishEncoderCertificate(
                signedDataBytes,
                false
            );

        const storedCertificateData: _PdfBasicEncodingElement[] =
            (parser as any)._sData;

        parser._getCertificate = originalGetCertificate;

        // Assert
        expect(result).toBeUndefined();
        expect(storedCertificateData).toBeDefined();
        expect(storedCertificateData.length).toBe(1);
        expect(extractedDataLength).toBe(1);
        expect(receivedParsingMode).toBe(false);
        expect(getCertificateCalls).toBe(1);
    });

    it('extracts sequence data when certificate parsing mode is enabled', () => {
        // Arrange
        const parser: _PdfX509CertificateParser =
            new _PdfX509CertificateParser();

        /*
         * ASN.1 structure:
         *
         * SEQUENCE
         *   OBJECT IDENTIFIER 1.2.840.113549.1.7.2
         *   [0]
         *     SEQUENCE
         *       [0]
         *         SEQUENCE
         *           NULL
         *
         * The inner certificate container uses a sequence because
         * certificate parsing mode is enabled.
         */
        const signedDataBytes: Uint8Array = new Uint8Array([
            0x30, 0x15,
            0x06, 0x09,
            0x2A, 0x86, 0x48, 0x86, 0xF7, 0x0D, 0x01, 0x07, 0x02,
            0xA0, 0x08,
            0x30, 0x06,
            0xA0, 0x04,
            0x30, 0x02,
            0x05, 0x00
        ]);

        const originalGetCertificate:
            (isCertificateParsing?: boolean) => _PdfX509Certificate =
            parser._getCertificate;

        let getCertificateCalls: number = 0;
        let receivedParsingMode: boolean = false;
        let extractedDataLength: number = 0;

        parser._getCertificate =
            (isCertificateParsing?: boolean):
                _PdfX509Certificate => {
                getCertificateCalls++;
                receivedParsingMode = isCertificateParsing === true;

                const extractedData: _PdfBasicEncodingElement[] =
                    (parser as any)._sData;

                if (extractedData) {
                    extractedDataLength = extractedData.length;
                }

                return undefined as any;
            };

        // Act
        const result: _PdfX509Certificate =
            parser._readDistinguishEncoderCertificate(
                signedDataBytes,
                true
            );

        const storedCertificateData: _PdfBasicEncodingElement[] =
            (parser as any)._sData;

        parser._getCertificate = originalGetCertificate;

        // Assert
        expect(result).toBeUndefined();
        expect(storedCertificateData).toBeDefined();
        expect(storedCertificateData.length).toBe(1);
        expect(extractedDataLength).toBe(1);
        expect(receivedParsingMode).toBe(true);
        expect(getCertificateCalls).toBe(1);
    });

    it('does not extract certificate data when the outer sequence has more than two elements', () => {
        // Arrange
        const parser: _PdfX509CertificateParser =
            new _PdfX509CertificateParser();

        /*
         * ASN.1 structure:
         *
         * SEQUENCE
         *   OBJECT IDENTIFIER 1.2.840.113549.1.7.2
         *   [0]
         *     SEQUENCE
         *       [0]
         *         SET
         *           SEQUENCE
         *             NULL
         *   NULL
         *
         * The outer sequence contains three elements.
         */
        const signedDataBytes: Uint8Array = new Uint8Array([
            0x30, 0x19,
            0x06, 0x09,
            0x2A, 0x86, 0x48, 0x86, 0xF7, 0x0D, 0x01, 0x07, 0x02,
            0xA0, 0x0A,
            0x30, 0x08,
            0xA0, 0x06,
            0x31, 0x04,
            0x30, 0x02,
            0x05, 0x00,
            0x05, 0x00
        ]);

        const originalGetCertificate:
            (isCertificateParsing?: boolean) => _PdfX509Certificate =
            parser._getCertificate;

        let getCertificateCalls: number = 0;
        let extractedDataLength: number = 0;

        parser._getCertificate =
            (_isCertificateParsing?: boolean):
                _PdfX509Certificate => {
                getCertificateCalls++;

                const extractedData: _PdfBasicEncodingElement[] =
                    (parser as any)._sData;

                if (extractedData) {
                    extractedDataLength = extractedData.length;
                }

                return undefined as any;
            };

        // Act
        const result: _PdfX509Certificate =
            parser._readDistinguishEncoderCertificate(
                signedDataBytes,
                false
            );

        const storedCertificateData: _PdfBasicEncodingElement[] =
            (parser as any)._sData;

        parser._getCertificate = originalGetCertificate;

        // Assert
        expect(result).toBeUndefined();
        expect(storedCertificateData).toBeDefined();
        expect(storedCertificateData.length).toBe(1);
        expect(extractedDataLength).toBe(1);
        expect(getCertificateCalls).toBe(1);
    });
});

describe('_PdfX509CertificateParser _readDistinguishEncoderCertificate SignedData guards', () => {
    it('does not extract data when SignedData contains an empty signed sequence', () => {
        /*
         * SEQUENCE
         *   OBJECT IDENTIFIER 1.2.840.113549.1.7.2
         *   [0]
         *     SEQUENCE
         *
         * signedSequence.length is zero.
         */
        const parser: _PdfX509CertificateParser =
            new _PdfX509CertificateParser();

        const signedDataBytes: Uint8Array = new Uint8Array([
            0x30, 0x0F,
            0x06, 0x09,
            0x2A, 0x86, 0x48, 0x86, 0xF7, 0x0D, 0x01, 0x07, 0x02,
            0xA0, 0x02,
            0x30, 0x00
        ]);

        const result: _PdfX509Certificate =
            parser._readDistinguishEncoderCertificate(
                signedDataBytes,
                false
            );

        const storedCertificateData: _PdfAbstractSyntaxElement[] =
            (parser as any)._sData;

        expect(result).toBeNull();
        expect(storedCertificateData).toBeUndefined();
    });

    it('does not extract application-class element with tag number zero', () => {
        /*
         * SEQUENCE
         *   OBJECT IDENTIFIER 1.2.840.113549.1.7.2
         *   [0]
         *     SEQUENCE
         *       [APPLICATION 0]
         *         SET
         *           NULL
         *
         * The candidate:
         * - is a _PdfBasicEncodingElement
         * - does not have context tag class
         * - has tag number zero
         *
         * The source condition must reject it because its tag class is not
         * _TagClassType.context.
         */
        const parser: _PdfX509CertificateParser =
            new _PdfX509CertificateParser();

        const signedDataBytes: Uint8Array = new Uint8Array([
            0x30, 0x15,
            0x06, 0x09,
            0x2A, 0x86, 0x48, 0x86, 0xF7, 0x0D, 0x01, 0x07, 0x02,
            0xA0, 0x08,
            0x30, 0x06,
            0x60, 0x04,
            0x31, 0x02,
            0x05, 0x00
        ]);

        const result: _PdfX509Certificate =
            parser._readDistinguishEncoderCertificate(
                signedDataBytes,
                false
            );

        const storedCertificateData: _PdfAbstractSyntaxElement[] =
            (parser as any)._sData;

        expect(result).toBeNull();
        expect(storedCertificateData).toBeUndefined();
    });

    it('does not extract context-class element with nonzero tag number', () => {
        /*
         * SEQUENCE
         *   OBJECT IDENTIFIER 1.2.840.113549.1.7.2
         *   [0]
         *     SEQUENCE
         *       [1]
         *         SET
         *           NULL
         *
         * The candidate:
         * - is a _PdfBasicEncodingElement
         * - has context tag class
         * - has tag number one
         *
         * The source condition must reject it because its tag number is not
         * zero.
         */
        const parser: _PdfX509CertificateParser =
            new _PdfX509CertificateParser();

        const signedDataBytes: Uint8Array = new Uint8Array([
            0x30, 0x15,
            0x06, 0x09,
            0x2A, 0x86, 0x48, 0x86, 0xF7, 0x0D, 0x01, 0x07, 0x02,
            0xA0, 0x08,
            0x30, 0x06,
            0xA1, 0x04,
            0x31, 0x02,
            0x05, 0x00
        ]);

        const result: _PdfX509Certificate =
            parser._readDistinguishEncoderCertificate(
                signedDataBytes,
                false
            );

        const storedCertificateData: _PdfAbstractSyntaxElement[] =
            (parser as any)._sData;

        expect(result).toBeNull();
        expect(storedCertificateData).toBeUndefined();
    });

    it('extracts abstract set data for context-class element with tag number zero', () => {
        /*
         * SEQUENCE
         *   OBJECT IDENTIFIER 1.2.840.113549.1.7.2
         *   [0]
         *     SEQUENCE
         *       [0]
         *         SET
         *           NULL
         *
         * isCertificateParsing is false, so the parser must use
         * _getAbstractSetValue().
         */
        const parser: _PdfX509CertificateParser =
            new _PdfX509CertificateParser();

        const signedDataBytes: Uint8Array = new Uint8Array([
            0x30, 0x15,
            0x06, 0x09,
            0x2A, 0x86, 0x48, 0x86, 0xF7, 0x0D, 0x01, 0x07, 0x02,
            0xA0, 0x08,
            0x30, 0x06,
            0xA0, 0x04,
            0x31, 0x02,
            0x05, 0x00
        ]);

        const result: _PdfX509Certificate =
            parser._readDistinguishEncoderCertificate(
                signedDataBytes,
                false
            );

        const storedCertificateData: _PdfAbstractSyntaxElement[] =
            (parser as any)._sData;

        expect(result).toBeNull();
        expect(storedCertificateData).toBeDefined();
        expect(storedCertificateData.length).toBe(1);
        expect(storedCertificateData[0]._getTagNumber()).toBe(5);
    });

    it('uses sequence extraction when certificate parsing mode is enabled', () => {
        /*
         * SEQUENCE
         *   OBJECT IDENTIFIER 1.2.840.113549.1.7.2
         *   [0]
         *     SEQUENCE
         *       [0]
         *         SEQUENCE
         *
         * isCertificateParsing is true, so the parser must use
         * _getSequence().
         *
         * The extracted sequence is intentionally empty. _getCertificate()
         * subsequently validates the empty certificate structure and throws.
         * Parser state can still be asserted after the Jasmine expectation.
         */
        const parser: _PdfX509CertificateParser =
            new _PdfX509CertificateParser();

        const signedDataBytes: Uint8Array = new Uint8Array([
            0x30, 0x13,
            0x06, 0x09,
            0x2A, 0x86, 0x48, 0x86, 0xF7, 0x0D, 0x01, 0x07, 0x02,
            0xA0, 0x06,
            0x30, 0x04,
            0xA0, 0x02,
            0x30, 0x00
        ]);

        const readCertificateSequence: () => _PdfX509Certificate =
            (): _PdfX509Certificate => {
                return parser._readDistinguishEncoderCertificate(
                    signedDataBytes,
                    true
                );
            };

        expect(readCertificateSequence).toThrow();

        const storedCertificateData: _PdfAbstractSyntaxElement[] =
            (parser as any)._sData;

        expect(storedCertificateData).toBeDefined();
        expect(storedCertificateData.length).toBe(0);
    });
});

describe('_PdfX509CertificateParser _readDistinguishEncoderCertificate remaining mutations', () => {
    it('returns null when SignedData contains an empty signed sequence', () => {
        // Arrange
        const parser: _PdfX509CertificateParser =
            new _PdfX509CertificateParser();

        // ASN.1 SignedData with exactly two outer elements.
        // The inner signed sequence is empty.
        const signedDataBytes: Uint8Array = new Uint8Array([
            0x30, 0x0F,
            0x06, 0x09,
            0x2A, 0x86, 0x48, 0x86, 0xF7, 0x0D, 0x01, 0x07, 0x02,
            0xA0, 0x02,
            0x30, 0x00
        ]);

        // Act
        const result: _PdfX509Certificate =
            parser._readDistinguishEncoderCertificate(
                signedDataBytes,
                false
            );

        const storedCertificateData: _PdfAbstractSyntaxElement[] =
            (parser as any)._sData;

        // Assert
        expect(result).toBeNull();
        expect(storedCertificateData).toBeUndefined();
    });

    it('uses abstract set extraction when certificate parsing is false', () => {
        // Arrange
        const parser: _PdfX509CertificateParser =
            new _PdfX509CertificateParser();

        // ASN.1 SignedData containing a context element whose inner value
        // is a SET containing a NULL element.
        const signedDataBytes: Uint8Array = new Uint8Array([
            0x30, 0x15,
            0x06, 0x09,
            0x2A, 0x86, 0x48, 0x86, 0xF7, 0x0D, 0x01, 0x07, 0x02,
            0xA0, 0x08,
            0x30, 0x06,
            0xA0, 0x04,
            0x31, 0x02,
            0x05, 0x00
        ]);

        // Act
        const result: _PdfX509Certificate =
            parser._readDistinguishEncoderCertificate(
                signedDataBytes,
                false
            );

        const storedCertificateData: _PdfAbstractSyntaxElement[] =
            (parser as any)._sData;

        // Assert
        expect(result).toBeNull();
        expect(storedCertificateData).toBeDefined();
        expect(storedCertificateData.length).toBe(1);
        expect(storedCertificateData[0]).toBeDefined();
        expect(storedCertificateData[0]._getTagNumber()).toBe(5);
    });

    it('uses sequence extraction when certificate parsing is true', () => {
        // Arrange
        const parser: _PdfX509CertificateParser =
            new _PdfX509CertificateParser();

        // ASN.1 SignedData containing a context element whose inner value
        // is an empty SEQUENCE.
        const signedDataBytes: Uint8Array = new Uint8Array([
            0x30, 0x13,
            0x06, 0x09,
            0x2A, 0x86, 0x48, 0x86, 0xF7, 0x0D, 0x01, 0x07, 0x02,
            0xA0, 0x06,
            0x30, 0x04,
            0xA0, 0x02,
            0x30, 0x00
        ]);

        const readCertificate: () => _PdfX509Certificate =
            (): _PdfX509Certificate => {
                return parser._readDistinguishEncoderCertificate(
                    signedDataBytes,
                    true
                );
            };

        // Act and Assert
        expect(readCertificate).toThrow();

        const storedCertificateData: _PdfAbstractSyntaxElement[] =
            (parser as any)._sData;

        expect(storedCertificateData).toBeDefined();
        expect(storedCertificateData.length).toBe(0);
    });
});

describe('_PdfX509CertificateParser._readCertificate default parameter', () => {
    it('_readCertificate passes false when isCertificateParsing is omitted', () => {
        const parser: _PdfX509CertificateParser = new _PdfX509CertificateParser();
        const input: Uint8Array = new Uint8Array([48, 0]);
        const expectedCertificate: _PdfX509Certificate =
            undefined as unknown as _PdfX509Certificate;
        const originalReadCertificateFromStream:
            (stream: Uint8Array, isCertificateParsing: boolean) => _PdfX509Certificate =
            parser._readCertificateFromStream;

        let receivedInput: Uint8Array = new Uint8Array(0);
        let receivedCertificateParsing: boolean = true;
        let invocationCount: number = 0;

        parser._readCertificateFromStream = (
            stream: Uint8Array,
            isCertificateParsing: boolean
        ): _PdfX509Certificate => {
            receivedInput = stream;
            receivedCertificateParsing = isCertificateParsing;
            invocationCount++;
            return expectedCertificate;
        };

        const result: _PdfX509Certificate = parser._readCertificate(input);

        parser._readCertificateFromStream = originalReadCertificateFromStream;

        expect(result).toBeUndefined();
        expect(receivedInput).toBe(input);
        expect(receivedCertificateParsing).toBe(false);
        expect(receivedCertificateParsing).toBeFalsy();
        expect(invocationCount).toBe(1);
        expect(parser._readCertificateFromStream).toBe(originalReadCertificateFromStream);
    });

    it('_readCertificate passes false when isCertificateParsing is undefined', () => {
        const parser: _PdfX509CertificateParser = new _PdfX509CertificateParser();
        const input: Uint8Array = new Uint8Array([48, 0]);
        const expectedCertificate: _PdfX509Certificate =
            undefined as unknown as _PdfX509Certificate;
        const originalReadCertificateFromStream:
            (stream: Uint8Array, isCertificateParsing: boolean) => _PdfX509Certificate =
            parser._readCertificateFromStream;

        let receivedInput: Uint8Array = new Uint8Array(0);
        let receivedCertificateParsing: boolean = true;
        let invocationCount: number = 0;

        parser._readCertificateFromStream = (
            stream: Uint8Array,
            isCertificateParsing: boolean
        ): _PdfX509Certificate => {
            receivedInput = stream;
            receivedCertificateParsing = isCertificateParsing;
            invocationCount++;
            return expectedCertificate;
        };

        const result: _PdfX509Certificate = parser._readCertificate(
            input,
            undefined
        );

        parser._readCertificateFromStream = originalReadCertificateFromStream;

        expect(result).toBeUndefined();
        expect(receivedInput).toBe(input);
        expect(receivedCertificateParsing).toBe(false);
        expect(receivedCertificateParsing).toBeFalsy();
        expect(invocationCount).toBe(1);
        expect(parser._readCertificateFromStream).toBe(originalReadCertificateFromStream);
    });

    it('_readCertificate preserves explicitly provided false', () => {
        const parser: _PdfX509CertificateParser = new _PdfX509CertificateParser();
        const input: Uint8Array = new Uint8Array([48, 0]);
        const expectedCertificate: _PdfX509Certificate =
            undefined as unknown as _PdfX509Certificate;
        const originalReadCertificateFromStream:
            (stream: Uint8Array, isCertificateParsing: boolean) => _PdfX509Certificate =
            parser._readCertificateFromStream;

        let receivedInput: Uint8Array = new Uint8Array(0);
        let receivedCertificateParsing: boolean = true;
        let invocationCount: number = 0;

        parser._readCertificateFromStream = (
            stream: Uint8Array,
            isCertificateParsing: boolean
        ): _PdfX509Certificate => {
            receivedInput = stream;
            receivedCertificateParsing = isCertificateParsing;
            invocationCount++;
            return expectedCertificate;
        };

        const result: _PdfX509Certificate = parser._readCertificate(
            input,
            false
        );

        parser._readCertificateFromStream = originalReadCertificateFromStream;

        expect(result).toBeUndefined();
        expect(receivedInput).toBe(input);
        expect(receivedCertificateParsing).toBe(false);
        expect(receivedCertificateParsing).toBeFalsy();
        expect(invocationCount).toBe(1);
        expect(parser._readCertificateFromStream).toBe(originalReadCertificateFromStream);
    });

    it('_readCertificate preserves explicitly provided true', () => {
        const parser: _PdfX509CertificateParser = new _PdfX509CertificateParser();
        const input: Uint8Array = new Uint8Array([48, 0]);
        const expectedCertificate: _PdfX509Certificate =
            undefined as unknown as _PdfX509Certificate;
        const originalReadCertificateFromStream:
            (stream: Uint8Array, isCertificateParsing: boolean) => _PdfX509Certificate =
            parser._readCertificateFromStream;

        let receivedInput: Uint8Array = new Uint8Array(0);
        let receivedCertificateParsing: boolean = false;
        let invocationCount: number = 0;

        parser._readCertificateFromStream = (
            stream: Uint8Array,
            isCertificateParsing: boolean
        ): _PdfX509Certificate => {
            receivedInput = stream;
            receivedCertificateParsing = isCertificateParsing;
            invocationCount++;
            return expectedCertificate;
        };

        const result: _PdfX509Certificate = parser._readCertificate(
            input,
            true
        );

        parser._readCertificateFromStream = originalReadCertificateFromStream;

        expect(result).toBeUndefined();
        expect(receivedInput).toBe(input);
        expect(receivedCertificateParsing).toBe(true);
        expect(receivedCertificateParsing).toBeTruthy();
        expect(invocationCount).toBe(1);
        expect(parser._readCertificateFromStream).toBe(originalReadCertificateFromStream);
    });

    it('_readCertificate forwards the same input instance', () => {
        const parser: _PdfX509CertificateParser = new _PdfX509CertificateParser();
        const input: Uint8Array = new Uint8Array([48, 3, 2, 1, 1]);
        const expectedCertificate: _PdfX509Certificate =
            undefined as unknown as _PdfX509Certificate;
        const originalReadCertificateFromStream:
            (stream: Uint8Array, isCertificateParsing: boolean) => _PdfX509Certificate =
            parser._readCertificateFromStream;

        let receivedInput: Uint8Array = new Uint8Array(0);
        let invocationCount: number = 0;

        parser._readCertificateFromStream = (
            stream: Uint8Array,
            _isCertificateParsing: boolean
        ): _PdfX509Certificate => {
            receivedInput = stream;
            invocationCount++;
            return expectedCertificate;
        };

        parser._readCertificate(input, false);

        parser._readCertificateFromStream = originalReadCertificateFromStream;

        expect(receivedInput).toBe(input);
        expect(receivedInput.length).toBe(input.length);
        expect(receivedInput[0]).toBe(48);
        expect(receivedInput[4]).toBe(1);
        expect(invocationCount).toBe(1);
        expect(parser._readCertificateFromStream).toBe(originalReadCertificateFromStream);
    });

    it('_readCertificate returns the result from _readCertificateFromStream', () => {
        const parser: _PdfX509CertificateParser = new _PdfX509CertificateParser();
        const input: Uint8Array = new Uint8Array([48, 0]);
        const expectedCertificate: _PdfX509Certificate =
            undefined as unknown as _PdfX509Certificate;
        const originalReadCertificateFromStream:
            (stream: Uint8Array, isCertificateParsing: boolean) => _PdfX509Certificate =
            parser._readCertificateFromStream;

        let invocationCount: number = 0;

        parser._readCertificateFromStream = (
            _stream: Uint8Array,
            _isCertificateParsing: boolean
        ): _PdfX509Certificate => {
            invocationCount++;
            return expectedCertificate;
        };

        const result: _PdfX509Certificate = parser._readCertificate(input, false);

        parser._readCertificateFromStream = originalReadCertificateFromStream;

        expect(result).toBe(expectedCertificate);
        expect(result).toBeUndefined();
        expect(invocationCount).toBe(1);
        expect(parser._readCertificateFromStream).toBe(originalReadCertificateFromStream);
    });

    it('_readCertificate calls _readCertificateFromStream only once', () => {
        const parser: _PdfX509CertificateParser = new _PdfX509CertificateParser();
        const input: Uint8Array = new Uint8Array([48, 0]);
        const expectedCertificate: _PdfX509Certificate =
            undefined as unknown as _PdfX509Certificate;
        const originalReadCertificateFromStream:
            (stream: Uint8Array, isCertificateParsing: boolean) => _PdfX509Certificate =
            parser._readCertificateFromStream;

        let invocationCount: number = 0;

        parser._readCertificateFromStream = (
            _stream: Uint8Array,
            _isCertificateParsing: boolean
        ): _PdfX509Certificate => {
            invocationCount++;
            return expectedCertificate;
        };

        parser._readCertificate(input);

        parser._readCertificateFromStream = originalReadCertificateFromStream;

        expect(invocationCount).toBe(1);
        expect(parser._readCertificateFromStream).toBe(originalReadCertificateFromStream);
    });
});

describe('_PdfX509CertificateParser._readCertificateFromStream state handling', () => {
    it('_readCertificateFromStream resets parser state for a different stream', () => {
        const parser: _PdfX509CertificateParser = new _PdfX509CertificateParser();
        const previousStream: Uint8Array = new Uint8Array([1]);
        const currentStream: Uint8Array = new Uint8Array([48, 0]);
        const cachedElement: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();
        const cachedData: _PdfAbstractSyntaxElement[] = [cachedElement];

        const originalReadDistinguishEncoderCertificate:
            (bytes: Uint8Array, isCertificateParsing: boolean) => _PdfX509Certificate =
            parser._readDistinguishEncoderCertificate;

        let receivedStream: Uint8Array = new Uint8Array(0);
        let receivedCertificateParsing: boolean = true;
        let distinguishInvocationCount: number = 0;

        (parser as any)._currentStream = previousStream;
        (parser as any)._sData = cachedData;
        (parser as any)._sDataObjectCount = cachedData.length;

        parser._readDistinguishEncoderCertificate = (
            bytes: Uint8Array,
            isCertificateParsing: boolean
        ): _PdfX509Certificate => {
            receivedStream = bytes;
            receivedCertificateParsing = isCertificateParsing;
            distinguishInvocationCount++;
            return null as any;
        };

        const result: _PdfX509Certificate =
            parser._readCertificateFromStream(currentStream, false);

        parser._readDistinguishEncoderCertificate =
            originalReadDistinguishEncoderCertificate;

        expect(result).toBeNull();
        expect((parser as any)._currentStream).toBe(currentStream);
        expect((parser as any)._currentStream).not.toBe(previousStream);
        expect((parser as any)._sData).toBeNull();
        expect((parser as any)._sDataObjectCount).toBe(0);
        expect(receivedStream).toBe(currentStream);
        expect(receivedCertificateParsing).toBe(false);
        expect(distinguishInvocationCount).toBe(1);
        expect(parser._readDistinguishEncoderCertificate)
            .toBe(originalReadDistinguishEncoderCertificate);
    });

    it('_readCertificateFromStream preserves state for the same stream', () => {
        const parser: _PdfX509CertificateParser = new _PdfX509CertificateParser();
        const stream: Uint8Array = new Uint8Array([48, 0]);
        const cachedElement: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();
        const cachedData: _PdfAbstractSyntaxElement[] = [cachedElement];

        const originalReadDistinguishEncoderCertificate:
            (bytes: Uint8Array, isCertificateParsing: boolean) => _PdfX509Certificate =
            parser._readDistinguishEncoderCertificate;

        let distinguishInvocationCount: number = 0;

        (parser as any)._currentStream = stream;
        (parser as any)._sData = cachedData;
        (parser as any)._sDataObjectCount = cachedData.length;

        parser._readDistinguishEncoderCertificate = (
            _bytes: Uint8Array,
            _isCertificateParsing: boolean
        ): _PdfX509Certificate => {
            distinguishInvocationCount++;
            return null as any;
        };

        const result: _PdfX509Certificate =
            parser._readCertificateFromStream(stream, false);

        parser._readDistinguishEncoderCertificate =
            originalReadDistinguishEncoderCertificate;

        expect(result).toBeNull();
        expect((parser as any)._currentStream).toBe(stream);
        expect((parser as any)._sData).toBe(cachedData);
        expect((parser as any)._sDataObjectCount).toBe(cachedData.length);
        expect(distinguishInvocationCount).toBe(1);
        expect(parser._readDistinguishEncoderCertificate)
            .toBe(originalReadDistinguishEncoderCertificate);
    });
    it('should throw an error for duplicate ASN.1 tags when certificate parsing is disabled', () => {
        // Arrange
        const certificateParser: _PdfX509CertificateParser =
            new _PdfX509CertificateParser();
        const signedDataWithDuplicateTags: Uint8Array = new Uint8Array([
            0x30, 0x19,
            // OBJECT IDENTIFIER: 1.2.840.113549.1.7.2
            0x06, 0x09,
            0x2A, 0x86, 0x48, 0x86, 0xF7,
            0x0D, 0x01, 0x07, 0x02,
            // Outer context-specific constructed element [0]
            0xA0, 0x0C,
            // SignedData sequence
            0x30, 0x0A,
            // Context-specific constructed element [0]
            0xA0, 0x08,
            // A single inner SEQUENCE required by _getInner(false)
            0x30, 0x06,
            // Duplicate universal INTEGER tags
            0x02, 0x01, 0x01,
            0x02, 0x01, 0x02
        ]);
        // Act and Assert
        expect((): void => {
            certificateParser._readCertificateFromStream(
                signedDataWithDuplicateTags,
                false
            );
        }).toThrowError(Error, 'Duplicate tag in Set.');
    });
});

describe('_PdfX509CertificateParser._readCertificateFromStream cached data boundary', () => {
    it('_readCertificateFromStream uses cached certificate when objects remain', () => {
        const parser: _PdfX509CertificateParser = new _PdfX509CertificateParser();
        const stream: Uint8Array = new Uint8Array([48, 0]);
        const firstElement: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();
        const secondElement: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();
        const cachedData: _PdfAbstractSyntaxElement[] = [
            firstElement,
            secondElement
        ];

        const originalGetCertificate:
            (isCertificateParsing?: boolean) => _PdfX509Certificate =
            parser._getCertificate;
        const originalReadDistinguishEncoderCertificate:
            (bytes: Uint8Array, isCertificateParsing: boolean) => _PdfX509Certificate =
            parser._readDistinguishEncoderCertificate;

        let getCertificateInvocationCount: number = 0;
        let distinguishInvocationCount: number = 0;

        (parser as any)._currentStream = stream;
        (parser as any)._sData = cachedData;
        (parser as any)._sDataObjectCount = 1;

        parser._getCertificate = (
            _isCertificateParsing?: boolean
        ): _PdfX509Certificate => {
            getCertificateInvocationCount++;
            return null as any;
        };

        parser._readDistinguishEncoderCertificate = (
            _bytes: Uint8Array,
            _isCertificateParsing: boolean
        ): _PdfX509Certificate => {
            distinguishInvocationCount++;
            return null as any;
        };

        const result: _PdfX509Certificate =
            parser._readCertificateFromStream(stream, false);

        parser._getCertificate = originalGetCertificate;
        parser._readDistinguishEncoderCertificate =
            originalReadDistinguishEncoderCertificate;

        expect(result).toBeNull();
        expect((parser as any)._sData).toBe(cachedData);
        expect((parser as any)._sDataObjectCount).toBe(1);
        expect((parser as any)._sDataObjectCount)
            .toBeLessThan((parser as any)._sData.length);
        expect(getCertificateInvocationCount).toBe(1);
        expect(distinguishInvocationCount).toBe(0);
        expect(parser._getCertificate).toBe(originalGetCertificate);
        expect(parser._readDistinguishEncoderCertificate)
            .toBe(originalReadDistinguishEncoderCertificate);
    });

    it('_readCertificateFromStream does not use cached certificate at collection length', () => {
        const parser: _PdfX509CertificateParser = new _PdfX509CertificateParser();
        const stream: Uint8Array = new Uint8Array([48, 0]);
        const cachedElement: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();
        const cachedData: _PdfAbstractSyntaxElement[] = [cachedElement];

        const originalGetCertificate:
            (isCertificateParsing?: boolean) => _PdfX509Certificate =
            parser._getCertificate;
        const originalReadDistinguishEncoderCertificate:
            (bytes: Uint8Array, isCertificateParsing: boolean) => _PdfX509Certificate =
            parser._readDistinguishEncoderCertificate;

        let getCertificateInvocationCount: number = 0;
        let distinguishInvocationCount: number = 0;
        let receivedCertificateParsing: boolean = true;

        (parser as any)._currentStream = stream;
        (parser as any)._sData = cachedData;
        (parser as any)._sDataObjectCount = cachedData.length;

        parser._getCertificate = (
            _isCertificateParsing?: boolean
        ): _PdfX509Certificate => {
            getCertificateInvocationCount++;
            return null as any;
        };

        parser._readDistinguishEncoderCertificate = (
            _bytes: Uint8Array,
            isCertificateParsing: boolean
        ): _PdfX509Certificate => {
            distinguishInvocationCount++;
            receivedCertificateParsing = isCertificateParsing;
            return null as any;
        };

        const result: _PdfX509Certificate =
            parser._readCertificateFromStream(stream, false);

        parser._getCertificate = originalGetCertificate;
        parser._readDistinguishEncoderCertificate =
            originalReadDistinguishEncoderCertificate;

        expect(result).toBeNull();
        expect((parser as any)._sDataObjectCount).toBe(cachedData.length);
        expect((parser as any)._sDataObjectCount)
            .not.toBeLessThan((parser as any)._sData.length);
        expect(getCertificateInvocationCount).toBe(0);
        expect(distinguishInvocationCount).toBe(1);
        expect(receivedCertificateParsing).toBe(false);
        expect(parser._getCertificate).toBe(originalGetCertificate);
        expect(parser._readDistinguishEncoderCertificate)
            .toBe(originalReadDistinguishEncoderCertificate);
    });

    it('_readCertificateFromStream does not use cached certificate above collection length', () => {
        const parser: _PdfX509CertificateParser = new _PdfX509CertificateParser();
        const stream: Uint8Array = new Uint8Array([48, 0]);
        const cachedElement: _PdfBasicEncodingElement = new _PdfBasicEncodingElement();
        const cachedData: _PdfAbstractSyntaxElement[] = [cachedElement];

        const originalGetCertificate:
            (isCertificateParsing?: boolean) => _PdfX509Certificate =
            parser._getCertificate;
        const originalReadDistinguishEncoderCertificate:
            (bytes: Uint8Array, isCertificateParsing: boolean) => _PdfX509Certificate =
            parser._readDistinguishEncoderCertificate;

        let getCertificateInvocationCount: number = 0;
        let distinguishInvocationCount: number = 0;

        (parser as any)._currentStream = stream;
        (parser as any)._sData = cachedData;
        (parser as any)._sDataObjectCount = cachedData.length + 1;

        parser._getCertificate = (
            _isCertificateParsing?: boolean
        ): _PdfX509Certificate => {
            getCertificateInvocationCount++;
            return null as any;
        };

        parser._readDistinguishEncoderCertificate = (
            _bytes: Uint8Array,
            _isCertificateParsing: boolean
        ): _PdfX509Certificate => {
            distinguishInvocationCount++;
            return null as any;
        };

        const result: _PdfX509Certificate =
            parser._readCertificateFromStream(stream, false);

        parser._getCertificate = originalGetCertificate;
        parser._readDistinguishEncoderCertificate =
            originalReadDistinguishEncoderCertificate;

        expect(result).toBeNull();
        expect((parser as any)._sDataObjectCount).toBe(cachedData.length + 1);
        expect((parser as any)._sDataObjectCount)
            .toBeGreaterThan((parser as any)._sData.length);
        expect(getCertificateInvocationCount).toBe(0);
        expect(distinguishInvocationCount).toBe(1);
        expect(parser._getCertificate).toBe(originalGetCertificate);
        expect(parser._readDistinguishEncoderCertificate)
            .toBe(originalReadDistinguishEncoderCertificate);
    });
});

describe('_PdfX509CertificateParser._readCertificateFromStream tag boundary', () => {
    it('_readCertificateFromStream processes a zero tag value', () => {
        const parser: _PdfX509CertificateParser = new _PdfX509CertificateParser();
        const stream: Uint8Array = new Uint8Array([0]);

        const originalReadDistinguishEncoderCertificate:
            (bytes: Uint8Array, isCertificateParsing: boolean) => _PdfX509Certificate =
            parser._readDistinguishEncoderCertificate;

        let receivedStream: Uint8Array = new Uint8Array(0);
        let receivedCertificateParsing: boolean = false;
        let distinguishInvocationCount: number = 0;

        parser._readDistinguishEncoderCertificate = (
            bytes: Uint8Array,
            isCertificateParsing: boolean
        ): _PdfX509Certificate => {
            receivedStream = bytes;
            receivedCertificateParsing = isCertificateParsing;
            distinguishInvocationCount++;
            return null as any;
        };

        const result: _PdfX509Certificate =
            parser._readCertificateFromStream(stream, true);

        parser._readDistinguishEncoderCertificate =
            originalReadDistinguishEncoderCertificate;

        expect(result).toBeNull();
        expect(stream[0]).toBe(0);
        expect(stream[0]).not.toBeLessThan(0);
        expect(receivedStream).toBe(stream);
        expect(receivedCertificateParsing).toBe(true);
        expect(distinguishInvocationCount).toBe(1);
        expect((parser as any)._currentStream).toBe(stream);
        expect(parser._readDistinguishEncoderCertificate)
            .toBe(originalReadDistinguishEncoderCertificate);
    });
});
describe('_PdfX509CertificateParser constructor', () => {
    it('_PdfX509CertificateParser initializes certificate data object count to zero', () => {
        const parser: _PdfX509CertificateParser = new _PdfX509CertificateParser();

        const certificateDataObjectCount: number =
            (parser as any)._sDataObjectCount;

        expect(certificateDataObjectCount).toBeDefined();
        expect(certificateDataObjectCount).toBe(0);
        expect(certificateDataObjectCount).not.toBeUndefined();
        expect(certificateDataObjectCount).not.toBeNull();
        expect(certificateDataObjectCount).not.toBe(1);
    });
});