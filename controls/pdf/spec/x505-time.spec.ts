import { _PdfAbstractSyntaxElement } from "../src/pdf/core/security/digital-signature/asn1/abstract-syntax";
import { _PdfX509Time } from "../src/pdf/core/security/digital-signature/x509/x509-time";
describe('_PdfX509Time mutation coverage', () => {
    it('_toDate should return undefined when UTC time without seconds has a character before the year', () => {
        // Arrange
        const timeElement: _PdfAbstractSyntaxElement =
            <_PdfAbstractSyntaxElement><unknown>{
                _getTagNumber: (): number => 23,
                _getValue: (): string => 'X2401010102Z'
            };
        const x509Time: _PdfX509Time =
            new _PdfX509Time(timeElement);
        // Act
        const parsedDate: Date = x509Time._toDate();
        // Assert
        expect(parsedDate).toBeUndefined();
    });
    it('_toDate should return undefined when UTC time without seconds has a character after Z', () => {
        // Arrange
        const timeElement: _PdfAbstractSyntaxElement =
            <_PdfAbstractSyntaxElement><unknown>{
                _getTagNumber: (): number => 23,
                _getValue: (): string => '2401010102Z1'
            };
        const x509Time: _PdfX509Time =
            new _PdfX509Time(timeElement);
        // Act
        const parsedDate: Date = x509Time._toDate();
        // Assert
        expect(parsedDate).toBeUndefined();
    });
    it('_toDate should interpret the boundary year 50 as 1950', () => {
        // Arrange
        const timeElement: _PdfAbstractSyntaxElement =
            <_PdfAbstractSyntaxElement><unknown>{
                _getTagNumber: (): number => 23,
                _getValue: (): string => '500101000000Z'
            };
        const x509Time: _PdfX509Time =
            new _PdfX509Time(timeElement);
        // Act
        const parsedDate: Date = x509Time._toDate();
        // Assert
        expect(parsedDate).toEqual(
            new Date(Date.UTC(1950, 0, 1, 0, 0, 0))
        );
        expect(parsedDate.getUTCFullYear()).toBe(1950);
    });
    it('_toDate should use zero seconds when UTC time does not contain seconds', () => {
        // Arrange
        const timeElement: _PdfAbstractSyntaxElement =
            <_PdfAbstractSyntaxElement><unknown>{
                _getTagNumber: (): number => 23,
                _getValue: (): string => '2401010102Z'
            };
        const x509Time: _PdfX509Time =
            new _PdfX509Time(timeElement);
        // Act
        const parsedDate: Date = x509Time._toDate();
        // Assert
        expect(parsedDate).toEqual(
            new Date(Date.UTC(2024, 0, 1, 1, 2, 0))
        );
        expect(parsedDate.getUTCSeconds()).toBe(0);
    });
    it('_toDate should preserve seconds when UTC time contains seconds', () => {
        // Arrange
        const timeElement: _PdfAbstractSyntaxElement =
            <_PdfAbstractSyntaxElement><unknown>{
                _getTagNumber: (): number => 23,
                _getValue: (): string => '240101010259Z'
            };
        const x509Time: _PdfX509Time =
            new _PdfX509Time(timeElement);
        // Act
        const parsedDate: Date = x509Time._toDate();
        // Assert
        expect(parsedDate).toEqual(
            new Date(Date.UTC(2024, 0, 1, 1, 2, 59))
        );
        expect(parsedDate.getUTCSeconds()).toBe(59);
    });
    it('_toDate should return a valid date when the optional seconds capture is undefined', () => {
        // Arrange
        const timeElement: _PdfAbstractSyntaxElement =
            <_PdfAbstractSyntaxElement><unknown>{
                _getTagNumber: (): number => 23,
                _getValue: (): string => '4912312359Z'
            };
        const x509Time: _PdfX509Time =
            new _PdfX509Time(timeElement);
        // Act
        const parsedDate: Date = x509Time._toDate();
        // Assert
        expect(parsedDate).toEqual(
            new Date(Date.UTC(2049, 11, 31, 23, 59, 0))
        );
        expect(parsedDate.getTime()).not.toBeNaN();
        expect(parsedDate.getUTCSeconds()).toBe(0);
    });
    it('_toDate should use the captured seconds instead of an empty value', () => {
        // Arrange
        const timeElement: _PdfAbstractSyntaxElement =
            <_PdfAbstractSyntaxElement><unknown>{
                _getTagNumber: (): number => 23,
                _getValue: (): string => '491231235958Z'
            };
        const x509Time: _PdfX509Time =
            new _PdfX509Time(timeElement);
        // Act
        const parsedDate: Date = x509Time._toDate();
        // Assert
        expect(parsedDate).toEqual(
            new Date(Date.UTC(2049, 11, 31, 23, 59, 58))
        );
        expect(parsedDate.getUTCSeconds()).toBe(58);
    });
    it('_getUniversalTime should remove surrounding whitespace from a Uint8Array value', () => {
        // Arrange
        const encodedTime: Uint8Array = new Uint8Array([
            32,
            50, 52, 48, 49, 48, 49, 48, 49, 48, 50, 48, 51, 90,
            32
        ]);
        const timeElement: _PdfAbstractSyntaxElement =
            <_PdfAbstractSyntaxElement><unknown>{
                _getTagNumber: (): number => 23,
                _getValue: (): Uint8Array => encodedTime
            };
        const x509Time: _PdfX509Time = new _PdfX509Time(timeElement);
        // Act
        const universalTime: string = x509Time._getUniversalTime();
        // Assert
        expect(universalTime).toBe('240101010203Z');
        expect(universalTime.charCodeAt(0)).toBe(50);
        expect(universalTime.charCodeAt(universalTime.length - 1)).toBe(90);
        expect(universalTime.length).toBe(13);
    });
    it('_toDate should return undefined when a complete UTC time has a character before the year', () => {
        // Arrange
        const timeElement: _PdfAbstractSyntaxElement =
            <_PdfAbstractSyntaxElement><unknown>{
                _getTagNumber: (): number => 23,
                _getValue: (): string => 'X240101010203Z'
            };
        const x509Time: _PdfX509Time = new _PdfX509Time(timeElement);
        // Act
        const parsedDate: Date = x509Time._toDate();
        // Assert
        expect(parsedDate).toBeUndefined();
    });
    it('_toDate should return undefined when a complete UTC time has a character after Z', () => {
        // Arrange
        const timeElement: _PdfAbstractSyntaxElement =
            <_PdfAbstractSyntaxElement><unknown>{
                _getTagNumber: (): number => 23,
                _getValue: (): string => '240101010203Z1'
            };
        const x509Time: _PdfX509Time = new _PdfX509Time(timeElement);
        // Act
        const parsedDate: Date = x509Time._toDate();
        // Assert
        expect(parsedDate).toBeUndefined();
    });
});
import { _PdfSignedCertificate } from
    '../src/pdf/core/security/digital-signature/x509/x509-signed-certificate';
import * as signedCertificateModule from
    '../src/pdf/core/security/digital-signature/x509/x509-signed-certificate';
describe('_PdfSignedCertificate survived mutation coverage', () => {
    function createValueElement(
        tagNumber: number,
        tagClass: number,
        value: Uint8Array
    ): _PdfAbstractSyntaxElement {
        const element: {
            _tagClass: number;
            _getTagNumber: () => number;
            _getValue: () => Uint8Array;
            _getSequence: () => _PdfAbstractSyntaxElement[];
        } = {
            _tagClass: tagClass,
            _getTagNumber: (): number => tagNumber,
            _getValue: (): Uint8Array => value,
            _getSequence: (): _PdfAbstractSyntaxElement[] => []
        };
        return <_PdfAbstractSyntaxElement><unknown>element;
    }
    function createSequenceElement(
        sequence: _PdfAbstractSyntaxElement[],
        tagNumber: number = 16,
        tagClass: number = 0
    ): _PdfAbstractSyntaxElement {
        const element: {
            _tagClass: number;
            _getTagNumber: () => number;
            _getValue: () => Uint8Array;
            _getSequence: () => _PdfAbstractSyntaxElement[];
        } = {
            _tagClass: tagClass,
            _getTagNumber: (): number => tagNumber,
            _getValue: (): Uint8Array => new Uint8Array(0),
            _getSequence: (): _PdfAbstractSyntaxElement[] => sequence
        };
        return <_PdfAbstractSyntaxElement><unknown>element;
    }
    function createAlgorithmElement():
        _PdfAbstractSyntaxElement {
        const objectIdentifierElement: _PdfAbstractSyntaxElement =
            createValueElement(
                6,
                0,
                new Uint8Array([
                    42,
                    134,
                    72,
                    134,
                    247,
                    13,
                    1,
                    1,
                    11
                ])
            );
        return createSequenceElement([
            objectIdentifierElement
        ]);
    }
    function createNameElement(): _PdfAbstractSyntaxElement {
        return createSequenceElement([]);
    }
    function createTimeElement(
        value: string
    ): _PdfAbstractSyntaxElement {
        const element: {
            _tagClass: number;
            _getTagNumber: () => number;
            _getValue: () => string;
            _getSequence: () => _PdfAbstractSyntaxElement[];
        } = {
            _tagClass: 0,
            _getTagNumber: (): number => 23,
            _getValue: (): string => value,
            _getSequence: (): _PdfAbstractSyntaxElement[] => []
        };
        return <_PdfAbstractSyntaxElement><unknown>element;
    }
    function createValidityElement():
        _PdfAbstractSyntaxElement {
        const notBeforeElement: _PdfAbstractSyntaxElement =
            createTimeElement('240101000000Z');
        const notAfterElement: _PdfAbstractSyntaxElement =
            createTimeElement('350101000000Z');
        return createSequenceElement([
            notBeforeElement,
            notAfterElement
        ]);
    }
    function createPublicKeyInformationElement():
        _PdfAbstractSyntaxElement {
        const algorithmElement: _PdfAbstractSyntaxElement =
            createAlgorithmElement();
        const publicKeyElement: _PdfAbstractSyntaxElement =
            createValueElement(
                3,
                0,
                new Uint8Array([0, 1])
            );
        return createSequenceElement([
            algorithmElement,
            publicKeyElement
        ]);
    }
    function createVersionElement(
        tagNumber: number,
        tagClass: number
    ): _PdfAbstractSyntaxElement {
        const versionIntegerElement:
            _PdfAbstractSyntaxElement =
            createValueElement(
                2,
                0,
                new Uint8Array([2])
            );
        return createSequenceElement(
            [versionIntegerElement],
            tagNumber,
            tagClass
        );
    }
    function createCertificateElements(
        firstElement: _PdfAbstractSyntaxElement,
        hasExplicitVersion: boolean
    ): {
        certificateSequence: _PdfAbstractSyntaxElement;
        certificateElements: _PdfAbstractSyntaxElement[];
        serialNumber: Uint8Array;
    } {
        const serialNumber: Uint8Array =
            new Uint8Array([1, 2, 3, 4]);
        const serialNumberElement:
            _PdfAbstractSyntaxElement =
            createValueElement(
                2,
                0,
                serialNumber
            );
        const signatureElement:
            _PdfAbstractSyntaxElement =
            createAlgorithmElement();
        const issuerElement:
            _PdfAbstractSyntaxElement =
            createNameElement();
        const validityElement:
            _PdfAbstractSyntaxElement =
            createValidityElement();
        const subjectElement:
            _PdfAbstractSyntaxElement =
            createNameElement();
        const publicKeyInformationElement:
            _PdfAbstractSyntaxElement =
            createPublicKeyInformationElement();
        const certificateElements:
            _PdfAbstractSyntaxElement[] =
            hasExplicitVersion
                ? [
                    firstElement,
                    serialNumberElement,
                    signatureElement,
                    issuerElement,
                    validityElement,
                    subjectElement,
                    publicKeyInformationElement
                ]
                : [
                    firstElement,
                    signatureElement,
                    issuerElement,
                    validityElement,
                    subjectElement,
                    publicKeyInformationElement
                ];
        const certificateSequence:
            _PdfAbstractSyntaxElement =
            createSequenceElement(certificateElements);
        return {
            certificateSequence: certificateSequence,
            certificateElements: certificateElements,
            serialNumber: hasExplicitVersion
                ? serialNumber
                : firstElement._getValue()
        };
    }
    it('constructor returns version 3 when the version tag number and tag class match', () => {
        // Arrange
        const versionElement: _PdfAbstractSyntaxElement =
            createVersionElement(0, 2);
        const certificateData: {
            certificateSequence: _PdfAbstractSyntaxElement;
            certificateElements: _PdfAbstractSyntaxElement[];
            serialNumber: Uint8Array;
        } = createCertificateElements(
            versionElement,
            true
        );
        // Act
        const signedCertificate: _PdfSignedCertificate =
            new _PdfSignedCertificate(
                certificateData.certificateSequence
            );
        const certificateVersion: number =
            signedCertificate._getVersion();
        // Assert
        expect(certificateVersion).toBe(3);
        expect(signedCertificate._version).toBe(2);
        expect(signedCertificate._serialNumber).toEqual(
            certificateData.serialNumber
        );
        expect(signedCertificate._sequence).toBe(
            certificateData.certificateElements
        );
    });
    it('constructor returns version 1 when the tag number does not match and the tag class matches', () => {
        // Arrange
        const serialNumber: Uint8Array =
            new Uint8Array([1, 2, 3, 4]);
        const serialNumberElement:
            _PdfAbstractSyntaxElement =
            createValueElement(
                1,
                2,
                serialNumber
            );
        const certificateData: {
            certificateSequence: _PdfAbstractSyntaxElement;
            certificateElements: _PdfAbstractSyntaxElement[];
            serialNumber: Uint8Array;
        } = createCertificateElements(
            serialNumberElement,
            false
        );
        // Act
        const signedCertificate: _PdfSignedCertificate =
            new _PdfSignedCertificate(
                certificateData.certificateSequence
            );
        const certificateVersion: number =
            signedCertificate._getVersion();
        // Assert
        expect(certificateVersion).toBe(1);
        expect(signedCertificate._version).toBe(0);
        expect(signedCertificate._serialNumber).toEqual(
            serialNumber
        );
        expect(signedCertificate._sequence).toBe(
            certificateData.certificateElements
        );
    });
    it('constructor returns version 1 when the version tag number matches and the tag class does not match', () => {
        // Arrange
        const serialNumber: Uint8Array =
            new Uint8Array([1, 2, 3, 4]);
        const serialNumberElement:
            _PdfAbstractSyntaxElement =
            createValueElement(
                0,
                1,
                serialNumber
            );
        const certificateData: {
            certificateSequence: _PdfAbstractSyntaxElement;
            certificateElements: _PdfAbstractSyntaxElement[];
            serialNumber: Uint8Array;
        } = createCertificateElements(
            serialNumberElement,
            false
        );
        // Act
        const signedCertificate: _PdfSignedCertificate =
            new _PdfSignedCertificate(
                certificateData.certificateSequence
            );
        const certificateVersion: number =
            signedCertificate._getVersion();
        // Assert
        expect(certificateVersion).toBe(1);
        expect(signedCertificate._version).toBe(0);
        expect(signedCertificate._serialNumber).toEqual(
            serialNumber
        );
        expect(signedCertificate._sequence).toBe(
            certificateData.certificateElements
        );
    });
    it('constructor returns version 1 when neither the version tag number nor tag class matches', () => {
        // Arrange
        const serialNumber: Uint8Array =
            new Uint8Array([1, 2, 3, 4]);
        const serialNumberElement:
            _PdfAbstractSyntaxElement =
            createValueElement(
                1,
                1,
                serialNumber
            );
        const certificateData: {
            certificateSequence: _PdfAbstractSyntaxElement;
            certificateElements: _PdfAbstractSyntaxElement[];
            serialNumber: Uint8Array;
        } = createCertificateElements(
            serialNumberElement,
            false
        );
        // Act
        const signedCertificate: _PdfSignedCertificate =
            new _PdfSignedCertificate(
                certificateData.certificateSequence
            );
        const certificateVersion: number =
            signedCertificate._getVersion();
        // Assert
        expect(certificateVersion).toBe(1);
        expect(signedCertificate._version).toBe(0);
        expect(signedCertificate._serialNumber).toEqual(
            serialNumber
        );
        expect(signedCertificate._sequence).toBe(
            certificateData.certificateElements
        );
    });
    it('module exposes the generated ES module marker with the true value', () => {
        // Arrange
        const certificateModule: {
            __esModule?: boolean;
            _PdfSignedCertificate:
            typeof _PdfSignedCertificate;
        } = signedCertificateModule as {
            __esModule?: boolean;
            _PdfSignedCertificate:
            typeof _PdfSignedCertificate;
        };
        // Act
        const isEsModule: boolean | undefined =
            certificateModule.__esModule;
        const signedCertificateConstructor:
            typeof _PdfSignedCertificate =
            certificateModule._PdfSignedCertificate;
        // Assert
        expect(isEsModule).toBe(true);
        expect(signedCertificateConstructor).toBe(
            _PdfSignedCertificate
        );
    });
});
import { _PdfRonCipherParameter } from './../src/pdf/core/security/digital-signature/x509/x509-cipher-handler';
describe('_PdfCipherParameter', () => {
    it('should preserve the private-key state supplied to the constructor', () => {
        // Arrange
        const modulus: Uint8Array = new Uint8Array([1, 2, 3]);
        const exponent: Uint8Array = new Uint8Array([1, 0, 1]);
        // Act
        const privateCipherParameter: _PdfRonCipherParameter =
            new _PdfRonCipherParameter(true, modulus, exponent);
        const publicCipherParameter: _PdfRonCipherParameter =
            new _PdfRonCipherParameter(false, modulus, exponent);
        // Assert
        expect(privateCipherParameter._isPrivate).toBeTruthy();
        expect(publicCipherParameter._isPrivate).toBeFalsy();
    });
    it('should initialize _isPrivate as false when false is provided', () => {
        // Arrange
        const modulus: Uint8Array = new Uint8Array([1, 2, 3]);
        const exponent: Uint8Array = new Uint8Array([1, 0, 1]);
        // Act
        const cipherParameter: _PdfRonCipherParameter =
            new _PdfRonCipherParameter(false, modulus, exponent);
        // Assert
        expect(cipherParameter._isPrivate).toBeFalsy();
    });
    it('should initialize _isPrivate as false when false is provided', () => {
        // Arrange
        const modulus: Uint8Array = new Uint8Array([1, 2, 3]);
        const exponent: Uint8Array = new Uint8Array([1, 0, 1]);
        // Act
        const cipherParameter: _PdfRonCipherParameter =
            new _PdfRonCipherParameter(false, modulus, exponent);
        // Assert
        expect(cipherParameter._isPrivate).toBeFalsy();
    });
});
import { _XmlWriter } from '../src/pdf/core/import-export/xml-writer';
import { PdfXmpDimensionsStruct } from '../src/pdf/core/pdf-type';
import { PdfPagedTextSchema } from '../src/pdf/core/xmp/pdf-paged-text-schema';
import { _PdfX509CertificateStructure } from "../src/pdf/core/security/digital-signature/x509/x509-certificate-structure";
import { _PdfObjectIdentifier } from "../src/pdf/core/security/digital-signature/asn1/identifier-mapping";
interface PdfPagedTextSchemaInternals {
    _prefix: string;
    _name: string;
    _pageCount: string;
    _MaxPageSize: PdfXmpDimensionsStruct;
    _properties: Map<string, unknown>;
}
interface XmlStartElementCall {
    localName: string;
    prefix: string;
    namespaceUri: string;
}
interface XmlElementStringCall {
    localName: string;
    value: string;
    prefix: string;
    namespaceUri: string;
}
interface XmlNamespaceCall {
    prefix: string;
    namespaceUri: string;
}
describe('PdfPagedTextSchema mutation coverage', () => {
    it('should initialize the exact paged text schema values', () => {
        // Arrange
        const schema: PdfPagedTextSchema = new PdfPagedTextSchema();
        const schemaInternals: PdfPagedTextSchemaInternals =
            schema as unknown as PdfPagedTextSchemaInternals;
        // Act
        const schemaType: PdfXmpSchemaType = schema.schemaType;
        const prefix: string = schemaInternals._prefix;
        const name: string = schemaInternals._name;
        // Assert
        expect(schemaType).toBe(PdfXmpSchemaType.pagedText);
        expect(prefix).toBe('xmpTPg');
        expect(name).toBe('PagedText');
    });
    it('should return the assigned page count from the cached value', () => {
        // Arrange
        const schema: PdfPagedTextSchema = new PdfPagedTextSchema();
        // Act
        schema.pageCount = 25;
        const pageCount: number = schema.pageCount;
        // Assert
        expect(pageCount).toBe(25);
        expect(schema._getProperty('xmpTPg:NPages')).toBe('25');
    });
    it('should parse the page count stored in the property collection', () => {
        // Arrange
        const schema: PdfPagedTextSchema = new PdfPagedTextSchema();
        schema._setProperty('xmpTPg:NPages', '17');
        // Act
        const pageCount: number = schema.pageCount;
        // Assert
        expect(pageCount).toBe(17);
    });
    it('should return zero when the page count is not available', () => {
        // Arrange
        const schema: PdfPagedTextSchema = new PdfPagedTextSchema();
        // Act
        const pageCount: number = schema.pageCount;
        // Assert
        expect(pageCount).toBe(0);
    });
    it('should preserve zero when zero is assigned as the page count', () => {
        // Arrange
        const schema: PdfPagedTextSchema = new PdfPagedTextSchema();
        // Act
        schema.pageCount = 0;
        // Assert
        expect(schema.pageCount).toBe(0);
        expect(schema._getProperty('xmpTPg:NPages')).toBe('0');
    });
    it('should return the assigned maximum page size from the cached value', () => {
        // Arrange
        const schema: PdfPagedTextSchema = new PdfPagedTextSchema();
        const dimensions: PdfXmpDimensionsStruct = {
            width: 612,
            height: 792,
            unit: 'pt'
        };
        // Act
        schema.maxPageSize = dimensions;
        const actualDimensions: PdfXmpDimensionsStruct = schema.maxPageSize;
        // Assert
        expect(actualDimensions).toBe(dimensions);
        expect(actualDimensions.width).toBe(612);
        expect(actualDimensions.height).toBe(792);
        expect(actualDimensions.unit).toBe('pt');
        expect(schema._getProperty('xmpTPg:MaxPageSize')).toBe(dimensions);
    });
    it('should return maximum page size stored in the property collection', () => {
        // Arrange
        const schema: PdfPagedTextSchema = new PdfPagedTextSchema();
        const dimensions: PdfXmpDimensionsStruct = {
            width: 595,
            height: 842,
            unit: 'px'
        };
        schema._setProperty('xmpTPg:MaxPageSize', dimensions);
        // Act
        const actualDimensions: PdfXmpDimensionsStruct = schema.maxPageSize;
        // Assert
        expect(actualDimensions).toBe(dimensions);
        expect(actualDimensions.width).toBe(595);
        expect(actualDimensions.height).toBe(842);
        expect(actualDimensions.unit).toBe('px');
    });
    it('should return undefined when maximum page size is not available', () => {
        // Arrange
        const schema: PdfPagedTextSchema = new PdfPagedTextSchema();
        // Act
        const dimensions: PdfXmpDimensionsStruct = schema.maxPageSize;
        // Assert
        expect(dimensions).toBeUndefined();
    });
    it('should return assigned and property-backed collection values', () => {
        // Arrange
        const assignedSchema: PdfPagedTextSchema = new PdfPagedTextSchema();
        const propertySchema: PdfPagedTextSchema = new PdfPagedTextSchema();
        const fonts: string[] = ['Arial', 'Helvetica'];
        const plateNames: string[] = ['Cyan', 'Magenta'];
        const colorants: string[] = ['CMYK', 'RGB'];
        const propertyFonts: string[] = ['Times New Roman'];
        const propertyPlateNames: string[] = ['Yellow', 'Black'];
        const propertyColorants: string[] = ['Spot'];
        assignedSchema.fonts = fonts;
        assignedSchema.plateNames = plateNames;
        assignedSchema.colorants = colorants;
        propertySchema._setProperty('xmpTPg:Fonts', propertyFonts);
        propertySchema._setProperty('xmpTPg:PlateNames', propertyPlateNames);
        propertySchema._setProperty('xmpTPg:Colorants', propertyColorants);
        // Act
        const actualFonts: string[] = assignedSchema.fonts;
        const actualPlateNames: string[] = assignedSchema.plateNames;
        const actualColorants: string[] = assignedSchema.colorants;
        const storedFonts: string[] = propertySchema.fonts;
        const storedPlateNames: string[] = propertySchema.plateNames;
        const storedColorants: string[] = propertySchema.colorants;
        // Assert
        expect(actualFonts).toBe(fonts);
        expect(actualFonts).toEqual(['Arial', 'Helvetica']);
        expect(actualPlateNames).toBe(plateNames);
        expect(actualPlateNames).toEqual(['Cyan', 'Magenta']);
        expect(actualColorants).toBe(colorants);
        expect(actualColorants).toEqual(['CMYK', 'RGB']);
        expect(storedFonts).toBe(propertyFonts);
        expect(storedFonts).toEqual(['Times New Roman']);
        expect(storedPlateNames).toBe(propertyPlateNames);
        expect(storedPlateNames).toEqual(['Yellow', 'Black']);
        expect(storedColorants).toBe(propertyColorants);
        expect(storedColorants).toEqual(['Spot']);
    });
    it('should return empty collections when collection properties are unavailable', () => {
        // Arrange
        const schema: PdfPagedTextSchema = new PdfPagedTextSchema();
        // Act
        const fonts: string[] = schema.fonts;
        const plateNames: string[] = schema.plateNames;
        const colorants: string[] = schema.colorants;
        // Assert
        expect(fonts).toEqual([]);
        expect(fonts.length).toBe(0);
        expect(plateNames).toEqual([]);
        expect(plateNames.length).toBe(0);
        expect(colorants).toEqual([]);
        expect(colorants.length).toBe(0);
    });
    it('should serialize maximum page size with exact elements and namespaces', () => {
        // Arrange
        const schema: PdfPagedTextSchema = new PdfPagedTextSchema();
        const writer: _XmlWriter = new _XmlWriter();
        const startElementCalls: XmlStartElementCall[] = [];
        const elementStringCalls: XmlElementStringCall[] = [];
        const namespaceCalls: XmlNamespaceCall[] = [];
        let endElementCount: number = 0;
        const originalWriteStartElement: typeof writer._writeStartElement = writer._writeStartElement;
        const originalWriteElementString: typeof writer._writeElementString = writer._writeElementString;
        const originalWriteNamespaceDeclaration: typeof writer._writeNamespaceDeclaration = writer._writeNamespaceDeclaration;
        const originalWriteEndElement: typeof writer._writeEndElement = writer._writeEndElement;
        writer._writeStartElement = (localName: string, prefix: string, namespaceUri: string): void => {
            startElementCalls.push({ localName: localName, prefix: prefix, namespaceUri: namespaceUri });
        };
        writer._writeElementString = (localName: string, value: string, prefix: string, namespaceUri: string): void => {
            elementStringCalls.push({ localName: localName, value: value, prefix: prefix, namespaceUri: namespaceUri });
        };
        writer._writeNamespaceDeclaration = (prefix: string, namespaceUri: string): void => {
            namespaceCalls.push({ prefix: prefix, namespaceUri: namespaceUri });
        };
        writer._writeEndElement = (): void => {
            endElementCount++;
        };
        schema.maxPageSize = { width: 612, height: 792, unit: 'pt' };
        // Act
        schema._writeXml(writer);
        // Assert
        expect(startElementCalls.length).toBe(2);
        expect(startElementCalls[0]).toEqual({
            localName: 'MaxPageSize',
            prefix: 'xmpTPg',
            namespaceUri: 'http://ns.adobe.com/xap/1.0/t/pg/'
        });
        expect(startElementCalls[1]).toEqual({
            localName: 'Description',
            prefix: 'rdf',
            namespaceUri: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#'
        });
        expect(namespaceCalls.length).toBe(1);
        expect(namespaceCalls[0]).toEqual({
            prefix: 'stDim',
            namespaceUri: 'http://ns.adobe.com/xap/1.0/sType/Dimensions#'
        });
        expect(elementStringCalls.length).toBe(3);
        expect(elementStringCalls[0]).toEqual({
            localName: 'w', value: '612', prefix: 'stDim',
            namespaceUri: 'http://ns.adobe.com/xap/1.0/sType/Dimensions#'
        });
        expect(elementStringCalls[1]).toEqual({
            localName: 'h', value: '792', prefix: 'stDim',
            namespaceUri: 'http://ns.adobe.com/xap/1.0/sType/Dimensions#'
        });
        expect(elementStringCalls[2]).toEqual({
            localName: 'unit', value: 'pt', prefix: 'stDim',
            namespaceUri: 'http://ns.adobe.com/xap/1.0/sType/Dimensions#'
        });
        expect(endElementCount).toBe(2);
        writer._writeStartElement = originalWriteStartElement;
        writer._writeElementString = originalWriteElementString;
        writer._writeNamespaceDeclaration = originalWriteNamespaceDeclaration;
        writer._writeEndElement = originalWriteEndElement;
    });
    it('should omit maximum page size unit when unit is undefined', () => {
        // Arrange
        const schema: PdfPagedTextSchema = new PdfPagedTextSchema();
        const writer: _XmlWriter = new _XmlWriter();
        const elementStringCalls: XmlElementStringCall[] = [];
        const originalWriteStartElement: typeof writer._writeStartElement = writer._writeStartElement;
        const originalWriteElementString: typeof writer._writeElementString = writer._writeElementString;
        const originalWriteNamespaceDeclaration: typeof writer._writeNamespaceDeclaration = writer._writeNamespaceDeclaration;
        const originalWriteEndElement: typeof writer._writeEndElement = writer._writeEndElement;
        writer._writeStartElement = (_localName: string, _prefix: string, _namespaceUri: string): void => { return; };
        writer._writeElementString = (localName: string, value: string, prefix: string, namespaceUri: string): void => {
            elementStringCalls.push({ localName: localName, value: value, prefix: prefix, namespaceUri: namespaceUri });
        };
        writer._writeNamespaceDeclaration = (_prefix: string, _namespaceUri: string): void => { return; };
        writer._writeEndElement = (): void => { return; };
        schema.maxPageSize = { width: 144, height: 288 };
        // Act
        schema._writeXml(writer);
        // Assert
        expect(elementStringCalls.length).toBe(2);
        expect(elementStringCalls[0].localName).toBe('w');
        expect(elementStringCalls[0].value).toBe('144');
        expect(elementStringCalls[1].localName).toBe('h');
        expect(elementStringCalls[1].value).toBe('288');
        writer._writeStartElement = originalWriteStartElement;
        writer._writeElementString = originalWriteElementString;
        writer._writeNamespaceDeclaration = originalWriteNamespaceDeclaration;
        writer._writeEndElement = originalWriteEndElement;
    });
    it('should not write content when maximum page size and properties are unavailable', () => {
        // Arrange
        const schema: PdfPagedTextSchema = new PdfPagedTextSchema();
        const schemaInternals: PdfPagedTextSchemaInternals = schema as unknown as PdfPagedTextSchemaInternals;
        const writer: _XmlWriter = new _XmlWriter();
        const startElementCalls: XmlStartElementCall[] = [];
        const elementStringCalls: XmlElementStringCall[] = [];
        const originalProperties: Map<string, unknown> = schemaInternals._properties;
        const originalWriteStartElement: typeof writer._writeStartElement = writer._writeStartElement;
        const originalWriteElementString: typeof writer._writeElementString = writer._writeElementString;
        schemaInternals._properties = undefined as unknown as Map<string, unknown>;
        writer._writeStartElement = (localName: string, prefix: string, namespaceUri: string): void => {
            startElementCalls.push({ localName: localName, prefix: prefix, namespaceUri: namespaceUri });
        };
        writer._writeElementString = (localName: string, value: string, prefix: string, namespaceUri: string): void => {
            elementStringCalls.push({ localName: localName, value: value, prefix: prefix, namespaceUri: namespaceUri });
        };
        // Act
        schema._writeXml(writer);
        // Assert
        expect(startElementCalls.length).toBe(0);
        expect(elementStringCalls.length).toBe(0);
        schemaInternals._properties = originalProperties;
        writer._writeStartElement = originalWriteStartElement;
        writer._writeElementString = originalWriteElementString;
    });
    it('should sort scalar property keys and preserve exact scalar output', () => {
        // Arrange
        const schema: PdfPagedTextSchema = new PdfPagedTextSchema();
        const writer: _XmlWriter = new _XmlWriter();
        const elementStringCalls: XmlElementStringCall[] = [];
        const originalWriteElementString: typeof writer._writeElementString = writer._writeElementString;
        writer._writeElementString = (localName: string, value: string, prefix: string, namespaceUri: string): void => {
            elementStringCalls.push({ localName: localName, value: value, prefix: prefix, namespaceUri: namespaceUri });
        };
        schema._setProperty('xmpTPg:ZuluValue', 'Last');
        schema._setProperty('xmpTPg:AlphaValue', 'First');
        schema._setProperty('xmpTPg:MiddleValue', 'Middle');
        // Act
        schema._writeXml(writer);
        // Assert
        expect(elementStringCalls.length).toBe(3);
        expect(elementStringCalls[0].localName).toBe('AlphaValue');
        expect(elementStringCalls[0].value).toBe('First');
        expect(elementStringCalls[1].localName).toBe('MiddleValue');
        expect(elementStringCalls[1].value).toBe('Middle');
        expect(elementStringCalls[2].localName).toBe('ZuluValue');
        expect(elementStringCalls[2].value).toBe('Last');
        writer._writeElementString = originalWriteElementString;
    });
    it('should skip maximum page size in the regular property loop', () => {
        // Arrange
        const schema: PdfPagedTextSchema = new PdfPagedTextSchema();
        const writer: _XmlWriter = new _XmlWriter();
        const elementStringCalls: XmlElementStringCall[] = [];
        const originalWriteStartElement: typeof writer._writeStartElement = writer._writeStartElement;
        const originalWriteElementString: typeof writer._writeElementString = writer._writeElementString;
        const originalWriteNamespaceDeclaration: typeof writer._writeNamespaceDeclaration = writer._writeNamespaceDeclaration;
        const originalWriteEndElement: typeof writer._writeEndElement = writer._writeEndElement;
        writer._writeStartElement = (_localName: string, _prefix: string, _namespaceUri: string): void => { return; };
        writer._writeElementString = (localName: string, value: string, prefix: string, namespaceUri: string): void => {
            elementStringCalls.push({ localName: localName, value: value, prefix: prefix, namespaceUri: namespaceUri });
        };
        writer._writeNamespaceDeclaration = (_prefix: string, _namespaceUri: string): void => { return; };
        writer._writeEndElement = (): void => { return; };
        schema.maxPageSize = { width: 500, height: 700, unit: 'pt' };
        schema._setProperty('xmpTPg:CustomValue', 'Available');
        // Act
        schema._writeXml(writer);
        // Assert
        expect(elementStringCalls.length).toBe(4);
        expect(elementStringCalls[0].localName).toBe('w');
        expect(elementStringCalls[1].localName).toBe('h');
        expect(elementStringCalls[2].localName).toBe('unit');
        expect(elementStringCalls[3].localName).toBe('CustomValue');
        expect(elementStringCalls[3].value).toBe('Available');
        writer._writeStartElement = originalWriteStartElement;
        writer._writeElementString = originalWriteElementString;
        writer._writeNamespaceDeclaration = originalWriteNamespaceDeclaration;
        writer._writeEndElement = originalWriteEndElement;
    });
    it('should skip null undefined and empty array property values', () => {
        // Arrange
        const schema: PdfPagedTextSchema = new PdfPagedTextSchema();
        const writer: _XmlWriter = new _XmlWriter();
        const startElementCalls: XmlStartElementCall[] = [];
        const elementStringCalls: XmlElementStringCall[] = [];
        const originalWriteStartElement: typeof writer._writeStartElement = writer._writeStartElement;
        const originalWriteElementString: typeof writer._writeElementString = writer._writeElementString;
        writer._writeStartElement = (localName: string, prefix: string, namespaceUri: string): void => {
            startElementCalls.push({ localName: localName, prefix: prefix, namespaceUri: namespaceUri });
        };
        writer._writeElementString = (localName: string, value: string, prefix: string, namespaceUri: string): void => {
            elementStringCalls.push({ localName: localName, value: value, prefix: prefix, namespaceUri: namespaceUri });
        };
        schema._setProperty('xmpTPg:NullValue', null);
        schema._setProperty('xmpTPg:UndefinedValue', undefined);
        schema._setProperty('xmpTPg:EmptyValues', []);
        schema._setProperty('xmpTPg:ValidValue', 'Available');
        // Act
        schema._writeXml(writer);
        // Assert
        expect(startElementCalls.length).toBe(0);
        expect(elementStringCalls.length).toBe(1);
        expect(elementStringCalls[0].localName).toBe('ValidValue');
        expect(elementStringCalls[0].value).toBe('Available');
        writer._writeStartElement = originalWriteStartElement;
        writer._writeElementString = originalWriteElementString;
    });
    it('should derive exact local name and prefix for colon boundary cases', () => {
        // Arrange
        const schema: PdfPagedTextSchema = new PdfPagedTextSchema();
        const writer: _XmlWriter = new _XmlWriter();
        const elementStringCalls: XmlElementStringCall[] = [];
        const originalWriteElementString: typeof writer._writeElementString = writer._writeElementString;
        writer._writeElementString = (localName: string, value: string, prefix: string, namespaceUri: string): void => {
            elementStringCalls.push({ localName: localName, value: value, prefix: prefix, namespaceUri: namespaceUri });
        };
        schema._setProperty(':BoundaryValue', 'Boundary');
        schema._setProperty('CustomName', 'Unqualified');
        schema._setProperty('xmpTPg:CustomName', 'Qualified');
        // Act
        schema._writeXml(writer);
        // Assert
        expect(elementStringCalls.length).toBe(3);
        expect(elementStringCalls[0]).toEqual({
            localName: 'BoundaryValue', value: 'Boundary', prefix: '',
            namespaceUri: 'http://ns.adobe.com/xap/1.0/t/pg/'
        });
        expect(elementStringCalls[1]).toEqual({
            localName: 'CustomName', value: 'Unqualified', prefix: '',
            namespaceUri: 'http://ns.adobe.com/xap/1.0/t/pg/'
        });
        expect(elementStringCalls[2]).toEqual({
            localName: 'CustomName', value: 'Qualified', prefix: 'xmpTPg',
            namespaceUri: 'http://ns.adobe.com/xap/1.0/t/pg/'
        });
        writer._writeElementString = originalWriteElementString;
    });
    it('should write fonts as RDF bag and all values as RDF list items', () => {
        // Arrange
        const schema: PdfPagedTextSchema = new PdfPagedTextSchema();
        const writer: _XmlWriter = new _XmlWriter();
        const startElementCalls: XmlStartElementCall[] = [];
        const elementStringCalls: XmlElementStringCall[] = [];
        let endElementCount: number = 0;
        const originalWriteStartElement: typeof writer._writeStartElement = writer._writeStartElement;
        const originalWriteElementString: typeof writer._writeElementString = writer._writeElementString;
        const originalWriteEndElement: typeof writer._writeEndElement = writer._writeEndElement;
        writer._writeStartElement = (localName: string, prefix: string, namespaceUri: string): void => {
            startElementCalls.push({ localName: localName, prefix: prefix, namespaceUri: namespaceUri });
        };
        writer._writeElementString = (localName: string, value: string, prefix: string, namespaceUri: string): void => {
            elementStringCalls.push({ localName: localName, value: value, prefix: prefix, namespaceUri: namespaceUri });
        };
        writer._writeEndElement = (): void => { endElementCount++; };
        schema.fonts = ['Arial', 'Helvetica'];
        // Act
        schema._writeXml(writer);
        // Assert
        expect(startElementCalls.length).toBe(2);
        expect(startElementCalls[0].localName).toBe('Fonts');
        expect(startElementCalls[0].prefix).toBe('xmpTPg');
        expect(startElementCalls[1].localName).toBe('Bag');
        expect(startElementCalls[1].prefix).toBe('rdf');
        expect(elementStringCalls.length).toBe(2);
        expect(elementStringCalls[0].localName).toBe('li');
        expect(elementStringCalls[0].value).toBe('Arial');
        expect(elementStringCalls[1].localName).toBe('li');
        expect(elementStringCalls[1].value).toBe('Helvetica');
        expect(endElementCount).toBe(2);
        writer._writeStartElement = originalWriteStartElement;
        writer._writeElementString = originalWriteElementString;
        writer._writeEndElement = originalWriteEndElement;
    });
    it('should select RDF sequence only for plate names and colorants', () => {
        // Arrange
        const schema: PdfPagedTextSchema = new PdfPagedTextSchema();
        const writer: _XmlWriter = new _XmlWriter();
        const startElementCalls: XmlStartElementCall[] = [];
        const elementStringCalls: XmlElementStringCall[] = [];
        const originalWriteStartElement: typeof writer._writeStartElement = writer._writeStartElement;
        const originalWriteElementString: typeof writer._writeElementString = writer._writeElementString;
        const originalWriteEndElement: typeof writer._writeEndElement = writer._writeEndElement;
        writer._writeStartElement = (localName: string, prefix: string, namespaceUri: string): void => {
            startElementCalls.push({ localName: localName, prefix: prefix, namespaceUri: namespaceUri });
        };
        writer._writeElementString = (localName: string, value: string, prefix: string, namespaceUri: string): void => {
            elementStringCalls.push({ localName: localName, value: value, prefix: prefix, namespaceUri: namespaceUri });
        };
        writer._writeEndElement = (): void => { return; };
        schema.plateNames = ['Cyan'];
        schema.colorants = ['CMYK'];
        schema._setProperty('xmpTPg:CustomValues', ['Custom']);
        // Act
        schema._writeXml(writer);
        // Assert
        expect(startElementCalls.length).toBe(6);
        expect(startElementCalls[0].localName).toBe('Colorants');
        expect(startElementCalls[1].localName).toBe('Seq');
        expect(startElementCalls[2].localName).toBe('CustomValues');
        expect(startElementCalls[3].localName).toBe('Bag');
        expect(startElementCalls[4].localName).toBe('PlateNames');
        expect(startElementCalls[5].localName).toBe('Seq');
        expect(elementStringCalls.length).toBe(3);
        expect(elementStringCalls[0].value).toBe('CMYK');
        expect(elementStringCalls[1].value).toBe('Custom');
        expect(elementStringCalls[2].value).toBe('Cyan');
        writer._writeStartElement = originalWriteStartElement;
        writer._writeElementString = originalWriteElementString;
        writer._writeEndElement = originalWriteEndElement;
    });
    it('should convert zero and false scalar values to exact strings', () => {
        // Arrange
        const schema: PdfPagedTextSchema = new PdfPagedTextSchema();
        const writer: _XmlWriter = new _XmlWriter();
        const elementStringCalls: XmlElementStringCall[] = [];
        const originalWriteElementString: typeof writer._writeElementString = writer._writeElementString;
        writer._writeElementString = (localName: string, value: string, prefix: string, namespaceUri: string): void => {
            elementStringCalls.push({ localName: localName, value: value, prefix: prefix, namespaceUri: namespaceUri });
        };
        schema._setProperty('xmpTPg:BooleanValue', false);
        schema._setProperty('xmpTPg:ZeroValue', 0);
        // Act
        schema._writeXml(writer);
        // Assert
        expect(elementStringCalls.length).toBe(2);
        expect(elementStringCalls[0].localName).toBe('BooleanValue');
        expect(elementStringCalls[0].value).toBe('False');
        expect(elementStringCalls[1].localName).toBe('ZeroValue');
        expect(elementStringCalls[1].value).toBe('0');
        writer._writeElementString = originalWriteElementString;
    });
    it('should expose enumerable and configurable paged text accessors', () => {
        // Arrange
        const schemaPrototype: object = PdfPagedTextSchema.prototype;
        // Act
        const schemaTypeDescriptor: PropertyDescriptor = Object.getOwnPropertyDescriptor(
            schemaPrototype, 'schemaType') as PropertyDescriptor;
        const pageCountDescriptor: PropertyDescriptor = Object.getOwnPropertyDescriptor(
            schemaPrototype, 'pageCount') as PropertyDescriptor;
        const maxPageSizeDescriptor: PropertyDescriptor = Object.getOwnPropertyDescriptor(
            schemaPrototype, 'maxPageSize') as PropertyDescriptor;
        const fontsDescriptor: PropertyDescriptor = Object.getOwnPropertyDescriptor(
            schemaPrototype, 'fonts') as PropertyDescriptor;
        const plateNamesDescriptor: PropertyDescriptor = Object.getOwnPropertyDescriptor(
            schemaPrototype, 'plateNames') as PropertyDescriptor;
        const colorantsDescriptor: PropertyDescriptor = Object.getOwnPropertyDescriptor(
            schemaPrototype, 'colorants') as PropertyDescriptor;
        // Assert
        expect(schemaTypeDescriptor.enumerable).toBeTruthy();
        expect(schemaTypeDescriptor.configurable).toBeTruthy();
        expect(pageCountDescriptor.enumerable).toBeTruthy();
        expect(pageCountDescriptor.configurable).toBeTruthy();
        expect(maxPageSizeDescriptor.enumerable).toBeTruthy();
        expect(maxPageSizeDescriptor.configurable).toBeTruthy();
        expect(fontsDescriptor.enumerable).toBeTruthy();
        expect(fontsDescriptor.configurable).toBeTruthy();
        expect(plateNamesDescriptor.enumerable).toBeTruthy();
        expect(plateNamesDescriptor.configurable).toBeTruthy();
        expect(colorantsDescriptor.enumerable).toBeTruthy();
        expect(colorantsDescriptor.configurable).toBeTruthy();
    });
});
declare const validCertificateDer: Uint8Array;
function getValidCertificateSequence(): {
    certificateElements: _PdfAbstractSyntaxElement[];
    signatureElement: _PdfAbstractSyntaxElement;
} {
    function createValueElement(
        tagNumber: number,
        tagClass: number,
        value: Uint8Array
    ): _PdfAbstractSyntaxElement {
        const element: {
            _tagClass: number;
            _getTagNumber: () => number;
            _getValue: () => Uint8Array;
            _getSequence: () => _PdfAbstractSyntaxElement[];
        } = {
            _tagClass: tagClass,
            _getTagNumber: (): number => tagNumber,
            _getValue: (): Uint8Array => value,
            _getSequence: (): _PdfAbstractSyntaxElement[] => []
        };
        return <_PdfAbstractSyntaxElement><unknown>element;
    }
    function createSequenceElement(
        sequence: _PdfAbstractSyntaxElement[],
        tagNumber: number = 16,
        tagClass: number = 0
    ): _PdfAbstractSyntaxElement {
        const element: {
            _tagClass: number;
            _getTagNumber: () => number;
            _getValue: () => Uint8Array;
            _getSequence: () => _PdfAbstractSyntaxElement[];
        } = {
            _tagClass: tagClass,
            _getTagNumber: (): number => tagNumber,
            _getValue: (): Uint8Array => new Uint8Array(0),
            _getSequence: (): _PdfAbstractSyntaxElement[] => sequence
        };
        return <_PdfAbstractSyntaxElement><unknown>element;
    }
    function createAlgorithmElement(): _PdfAbstractSyntaxElement {
        const objectIdentifierElement: _PdfAbstractSyntaxElement =
            createValueElement(
                6,
                0,
                new Uint8Array([
                    42,
                    134,
                    72,
                    134,
                    247,
                    13,
                    1,
                    1,
                    11
                ])
            );
        return createSequenceElement([
            objectIdentifierElement
        ]);
    }
    function createNameElement(): _PdfAbstractSyntaxElement {
        return createSequenceElement([]);
    }
    function createTimeElement(value: string): _PdfAbstractSyntaxElement {
        const element: {
            _tagClass: number;
            _getTagNumber: () => number;
            _getValue: () => string;
            _getSequence: () => _PdfAbstractSyntaxElement[];
        } = {
            _tagClass: 0,
            _getTagNumber: (): number => 23,
            _getValue: (): string => value,
            _getSequence: (): _PdfAbstractSyntaxElement[] => []
        };
        return <_PdfAbstractSyntaxElement><unknown>element;
    }
    function createValidityElement(): _PdfAbstractSyntaxElement {
        return createSequenceElement([
            createTimeElement('240101000000Z'),
            createTimeElement('350101000000Z')
        ]);
    }
    function createPublicKeyInformationElement(): _PdfAbstractSyntaxElement {
        return createSequenceElement([
            createAlgorithmElement(),
            createValueElement(3, 0, new Uint8Array([0, 1]))
        ]);
    }
    function createVersionElement(): _PdfAbstractSyntaxElement {
        const versionIntegerElement: _PdfAbstractSyntaxElement =
            createValueElement(
                2,
                0,
                new Uint8Array([2])
            );
        return createSequenceElement(
            [versionIntegerElement],
            0,
            2
        );
    }
    const signatureElement: _PdfAbstractSyntaxElement =
        createValueElement(3, 0, new Uint8Array([0, 17, 34, 51]));
    const certificateElements: _PdfAbstractSyntaxElement[] = [
        createSequenceElement([
            createVersionElement(),
            createValueElement(2, 0, new Uint8Array([1, 2, 3, 4])),
            createAlgorithmElement(),
            createNameElement(),
            createValidityElement(),
            createNameElement(),
            createPublicKeyInformationElement()
        ]),
        createAlgorithmElement(),
        signatureElement
    ];
    return {
        certificateElements: certificateElements,
        signatureElement: signatureElement
    };
}
function applyCertificateSequence(
    certificate: _PdfX509CertificateStructure,
    sequence: _PdfAbstractSyntaxElement[]
): void {
    (certificate as any)._applySequence(sequence);
}
describe('_PdfX509CertificateStructure mutation coverage', () => {
    describe('_getSignatureAlgorithmOid', () => {
        it('returns an empty string when object identifier toString is not a function', () => {
            // Arrange
            const certificate: _PdfX509CertificateStructure =
                new _PdfX509CertificateStructure();
            certificate._signatureAlgorithmIdentifier = {
                _objectID: {
                    toString: undefined
                }
            } as any;
            // Act
            const actualOid: string =
                certificate._getSignatureAlgorithmOid();
            // Assert
            expect(actualOid).toBe('');
            expect(actualOid.length).toBe(0);
        });
        it('returns the exact signature algorithm object identifier', () => {
            // Arrange
            const certificate: _PdfX509CertificateStructure =
                new _PdfX509CertificateStructure();
            const expectedOid: string = '1.2.840.113549.1.1.11';
            certificate._signatureAlgorithmIdentifier = {
                _objectID: {
                    toString: (): string => expectedOid
                }
            } as any;
            // Act
            const actualOid: string =
                certificate._getSignatureAlgorithmOid();
            // Assert
            expect(actualOid).toBe('1.2.840.113549.1.1.11');
            expect(actualOid.length).toBeGreaterThan(0);
        });
        it('returns an empty string when the object identifier is unavailable', () => {
            // Arrange
            const certificate: _PdfX509CertificateStructure =
                new _PdfX509CertificateStructure();
            certificate._signatureAlgorithmIdentifier = {} as any;
            // Act
            const actualOid: string = certificate._getSignatureAlgorithmOid();
            // Assert
            expect(actualOid).toBe('');
            expect(actualOid.length).toBe(0);
        });
        it('returns an empty string when the object identifier has no callable toString method', () => {
            // Arrange
            const certificate: _PdfX509CertificateStructure =
                new _PdfX509CertificateStructure();
            certificate._signatureAlgorithmIdentifier = {
                _objectID: {
                    toString: undefined
                }
            } as any;
            // Act
            const actualOid: string =
                certificate._getSignatureAlgorithmOid();
            // Assert
            expect(actualOid).toBe('');
            expect(actualOid.length).toBe(0);
        });
    });
    describe('_getSignatureValue', () => {
        it('returns an empty Uint8Array when signature bytes are unavailable', () => {
            // Arrange
            const certificate: _PdfX509CertificateStructure =
                new _PdfX509CertificateStructure();
            certificate._signatureBytes = undefined;
            // Act
            const signatureValue: Uint8Array = certificate._getSignatureValue();
            // Assert
            expect(signatureValue).toEqual(new Uint8Array(0));
            expect(signatureValue.length).toBe(0);
            expect(signatureValue instanceof Uint8Array).toBeTruthy();
        });
        it('returns the exact certificate signature bytes', () => {
            // Arrange
            const certificate: _PdfX509CertificateStructure =
                new _PdfX509CertificateStructure();
            const signatureBytes: Uint8Array =
                new Uint8Array([16, 32, 48, 64]);
            certificate._signatureBytes = signatureBytes;
            // Act
            const signatureValue: Uint8Array = certificate._getSignatureValue();
            // Assert
            expect(signatureValue).toEqual(new Uint8Array([16, 32, 48, 64]));
            expect(signatureValue.length).toBe(4);
            expect(signatureValue).not.toBe(signatureBytes);
        });
        it('returns a defensive copy of the certificate signature bytes', () => {
            // Arrange
            const certificate: _PdfX509CertificateStructure =
                new _PdfX509CertificateStructure();
            const signatureBytes: Uint8Array =
                new Uint8Array([10, 20, 30]);
            certificate._signatureBytes = signatureBytes;
            // Act
            const signatureValue: Uint8Array = certificate._getSignatureValue();
            signatureValue[0] = 99;
            // Assert
            expect(signatureValue[0]).toBe(99);
            expect(certificate._signatureBytes[0]).toBe(10);
            expect(certificate._signatureBytes).toEqual(
                new Uint8Array([10, 20, 30])
            );
        });
    });
    describe('_applySequence signature BIT STRING handling', () => {
        it('removes the unused-bits byte from a multi-byte signature value', () => {
            // Arrange
            const certificate: _PdfX509CertificateStructure =
                new _PdfX509CertificateStructure();
            const sequenceData: {
                certificateElements: _PdfAbstractSyntaxElement[];
                signatureElement: _PdfAbstractSyntaxElement;
            } =
                getValidCertificateSequence();
            const sequence: _PdfAbstractSyntaxElement[] =
                sequenceData.certificateElements;
            const signatureElement: _PdfAbstractSyntaxElement =
                sequenceData.signatureElement;
            const originalGetValue: () => Uint8Array =
                signatureElement._getValue;
            const rawBitString: Uint8Array =
                new Uint8Array([0, 17, 34, 51]);
            signatureElement._getValue = (): Uint8Array => rawBitString;
            // Act
            applyCertificateSequence(certificate, sequence);
            signatureElement._getValue = originalGetValue;
            // Assert
            expect(certificate._signatureBytes).toEqual(
                new Uint8Array([17, 34, 51])
            );
            expect(certificate._getSignatureValue()).toEqual(
                new Uint8Array([17, 34, 51])
            );
            expect(certificate._signatureBytes.length).toBe(3);
            expect(certificate._signatureBytes.buffer)
                .toBe(rawBitString.buffer);
            expect(certificate._signatureBytes.byteOffset)
                .toBe(rawBitString.byteOffset + 1);
            expect(signatureElement._getValue).toBe(originalGetValue);
        });
        it('creates an empty signature view when the BIT STRING contains only the unused-bits byte', () => {
            // Arrange
            const certificate: _PdfX509CertificateStructure =
                new _PdfX509CertificateStructure();
            const sequenceData: {
                certificateElements: _PdfAbstractSyntaxElement[];
                signatureElement: _PdfAbstractSyntaxElement;
            } =
                getValidCertificateSequence();
            const sequence: _PdfAbstractSyntaxElement[] =
                sequenceData.certificateElements;
            const signatureElement: _PdfAbstractSyntaxElement =
                sequenceData.signatureElement;
            const originalGetValue: () => Uint8Array =
                signatureElement._getValue;
            const rawBitString: Uint8Array = new Uint8Array([0]);
            signatureElement._getValue = (): Uint8Array => rawBitString;
            // Act
            applyCertificateSequence(certificate, sequence);
            signatureElement._getValue = originalGetValue;
            // Assert
            expect(certificate._signatureBytes).toEqual(
                new Uint8Array(0)
            );
            expect(certificate._signatureBytes.length).toBe(0);
            expect(certificate._signatureBytes.buffer)
                .toBe(rawBitString.buffer);
            expect(certificate._signatureBytes.byteOffset)
                .toBe(rawBitString.byteOffset + 1);
            expect(signatureElement._getValue).toBe(originalGetValue);
        });
        it('keeps a separately allocated empty signature for an empty BIT STRING', () => {
            // Arrange
            const certificate: _PdfX509CertificateStructure =
                new _PdfX509CertificateStructure();
            const sequenceData: {
                certificateElements: _PdfAbstractSyntaxElement[];
                signatureElement: _PdfAbstractSyntaxElement;
            } =
                getValidCertificateSequence();
            const sequence: _PdfAbstractSyntaxElement[] =
                sequenceData.certificateElements;
            const signatureElement: _PdfAbstractSyntaxElement =
                sequenceData.signatureElement;
            const originalGetValue: () => Uint8Array =
                signatureElement._getValue;
            const rawBitString: Uint8Array = new Uint8Array(0);
            signatureElement._getValue = (): Uint8Array => rawBitString;
            // Act
            applyCertificateSequence(certificate, sequence);
            signatureElement._getValue = originalGetValue;
            // Assert
            expect(certificate._signatureBytes).toEqual(
                new Uint8Array(0)
            );
            expect(certificate._signatureBytes.length).toBe(0);
            expect(certificate._signatureBytes).not.toBe(rawBitString);
            expect(certificate._signatureBytes.buffer)
                .not.toBe(rawBitString.buffer);
            expect(signatureElement._getValue).toBe(originalGetValue);
        });
        it('keeps an empty signature when the BIT STRING value is unavailable', () => {
            // Arrange
            const certificate: _PdfX509CertificateStructure =
                new _PdfX509CertificateStructure();
            const sequenceData: {
                certificateElements: _PdfAbstractSyntaxElement[];
                signatureElement: _PdfAbstractSyntaxElement;
            } =
                getValidCertificateSequence();
            const sequence: _PdfAbstractSyntaxElement[] =
                sequenceData.certificateElements;
            const signatureElement: _PdfAbstractSyntaxElement =
                sequenceData.signatureElement;
            const originalGetValue: () => Uint8Array =
                signatureElement._getValue;
            signatureElement._getValue = (): Uint8Array => undefined;
            // Act
            applyCertificateSequence(certificate, sequence);
            signatureElement._getValue = originalGetValue;
            // Assert
            expect(certificate._signatureBytes).toEqual(
                new Uint8Array(0)
            );
            expect(certificate._signatureBytes.length).toBe(0);
            expect(certificate._getSignatureValue()).toEqual(
                new Uint8Array(0)
            );
            expect(signatureElement._getValue).toBe(originalGetValue);
        });
    });
});
describe('_PdfCipherParameter mutation coverage', () => {
    it('sets isPrivate to false when false is provided', () => {
        // Arrange
        const modulus: Uint8Array = new Uint8Array([1, 2, 3]);
        const exponent: Uint8Array = new Uint8Array([1, 0, 1]);
        // Act
        const cipherParameter: _PdfRonCipherParameter =
            new _PdfRonCipherParameter(false, modulus, exponent);
        // Assert
        expect(cipherParameter._isPrivate).toBeFalsy();
        expect(cipherParameter._isPrivate).toBeFalsy();
    });
});
describe('PdfPagedTextSchema cached getter mutation coverage', () => {
    it('returns the cached page count without reading the stored property', () => {
        // Arrange
        const pagedTextSchema: PdfPagedTextSchema =
            new PdfPagedTextSchema();
        const schemaAccess: any = pagedTextSchema;
        const originalGetProperty: (key: string) => any =
            schemaAccess._getProperty;
        let propertyReadCount: number = 0;
        schemaAccess._pageCount = '25';
        schemaAccess._getProperty = (key: string): string => {
            propertyReadCount++;
            expect(key).toBe('xmpTPg:NPages');
            return '75';
        };
        // Act
        const pageCount: number = pagedTextSchema.pageCount;
        schemaAccess._getProperty = originalGetProperty;
        // Assert
        expect(pageCount).toBe(25);
        expect(pageCount).not.toBe(75);
        expect(propertyReadCount).toBe(0);
        expect(schemaAccess._pageCount).toBe('25');
        expect(schemaAccess._getProperty).toBe(originalGetProperty);
    });
    it('returns the cached maximum page size without reading the stored property', () => {
        // Arrange
        const pagedTextSchema: PdfPagedTextSchema =
            new PdfPagedTextSchema();
        const schemaAccess: any = pagedTextSchema;
        const originalGetProperty: (key: string) => any =
            schemaAccess._getProperty;
        const cachedPageSize: PdfXmpDimensionsStruct = {
            width: 8.5,
            height: 11,
            unit: 'in'
        };
        const storedPageSize: PdfXmpDimensionsStruct = {
            width: 21,
            height: 29.7,
            unit: 'cm'
        };
        let propertyReadCount: number = 0;
        schemaAccess._MaxPageSize = cachedPageSize;
        schemaAccess._getProperty =
            (key: string): PdfXmpDimensionsStruct => {
                propertyReadCount++;
                expect(key).toBe('xmpTPg:MaxPageSize');
                return storedPageSize;
            };
        // Act
        const maximumPageSize: PdfXmpDimensionsStruct =
            pagedTextSchema.maxPageSize;
        schemaAccess._getProperty = originalGetProperty;
        // Assert
        expect(maximumPageSize).toBe(cachedPageSize);
        expect(maximumPageSize).not.toBe(storedPageSize);
        expect(maximumPageSize.width).toBe(8.5);
        expect(maximumPageSize.height).toBe(11);
        expect(maximumPageSize.unit).toBe('in');
        expect(propertyReadCount).toBe(0);
        expect(schemaAccess._MaxPageSize).toBe(cachedPageSize);
        expect(schemaAccess._getProperty).toBe(originalGetProperty);
    });
});
import { PdfDublinCoreSchema } from '../src/pdf/core/xmp/pdf-dublin-core-schema';
import { PdfXmpSchemaType } from '../src/pdf/core/enumerator';
import { PdfXmpLangArray } from '../src/pdf/core/pdf-type';
interface DublinCoreSchemaInternals {
    _prefix: string;
    _name: string;
    _getProperty: (propertyName: string) => unknown;
    _setProperty: (propertyName: string, value: unknown) => void;
}
describe('PdfDublinCoreSchema mutation coverage', () => {
    it('constructor initializes the Dublin Core schema values', () => {
        // Arrange
        const dublinCoreSchema: PdfDublinCoreSchema = new PdfDublinCoreSchema();
        const schemaInternals: DublinCoreSchemaInternals =
            dublinCoreSchema as unknown as DublinCoreSchemaInternals;
        // Act
        const prefix: string = schemaInternals._prefix;
        const name: string = schemaInternals._name;
        const schemaType: PdfXmpSchemaType = dublinCoreSchema.schemaType;
        // Assert
        expect(prefix).toBe('dc');
        expect(name).toBe('DublinCore');
        expect(schemaType).toBe(PdfXmpSchemaType.dublinCore);
    });
    it('getters load all Dublin Core values using their exact property names', () => {
        // Arrange
        const dublinCoreSchema: PdfDublinCoreSchema = new PdfDublinCoreSchema();
        const schemaInternals: DublinCoreSchemaInternals =
            dublinCoreSchema as unknown as DublinCoreSchemaInternals;
        const originalGetProperty: (propertyName: string) => unknown =
            schemaInternals._getProperty;
        const contributorValue: string[] = ['Contributor One'];
        const creatorValue: string[] = ['Creator One'];
        const dateValue: string[] = ['2026-08-09'];
        const publisherValue: string[] = ['Publisher One'];
        const relationValue: string[] = ['Related Document'];
        const subjectValue: string[] = ['PDF Metadata'];
        const typeValue: string[] = ['Document'];
        const titleValue: PdfXmpLangArray = {
            'en': 'Dublin Core Title'
        } as PdfXmpLangArray;
        const descriptionValue: PdfXmpLangArray = {
            'en': 'Dublin Core Description'
        } as PdfXmpLangArray;
        const rightsValue: PdfXmpLangArray = {
            'en': 'Copyright 2026'
        } as PdfXmpLangArray;
        const coverageValue: string = 'Global Coverage';
        const identifierValue: string = 'DOCUMENT-001';
        const sourceValue: string = 'Original Source';
        const formatValue: string = 'application/pdf';
        const requestedPropertyNames: string[] = [];
        schemaInternals._getProperty = (propertyName: string): unknown => {
            requestedPropertyNames.push(propertyName);
            switch (propertyName) {
                case 'dc:contributor':
                    return contributorValue;
                case 'dc:creator':
                    return creatorValue;
                case 'dc:date':
                    return dateValue;
                case 'dc:publisher':
                    return publisherValue;
                case 'dc:relation':
                    return relationValue;
                case 'dc:subject':
                    return subjectValue;
                case 'dc:type':
                    return typeValue;
                case 'dc:title':
                    return titleValue;
                case 'dc:description':
                    return descriptionValue;
                case 'dc:rights':
                    return rightsValue;
                case 'dc:coverage':
                    return coverageValue;
                case 'dc:identifier':
                    return identifierValue;
                case 'dc:source':
                    return sourceValue;
                case 'dc:format':
                    return formatValue;
                default:
                    return undefined;
            }
        };
        // Act
        const actualContributor: string[] = dublinCoreSchema.contributor;
        const actualCreator: string[] = dublinCoreSchema.creator;
        const actualDate: string[] = dublinCoreSchema.date;
        const actualPublisher: string[] = dublinCoreSchema.publisher;
        const actualRelation: string[] = dublinCoreSchema.relation;
        const actualSubject: string[] = dublinCoreSchema.subject;
        const actualType: string[] = dublinCoreSchema.type;
        const actualTitle: PdfXmpLangArray = dublinCoreSchema.title;
        const actualDescription: PdfXmpLangArray = dublinCoreSchema.description;
        const actualRights: PdfXmpLangArray = dublinCoreSchema.rights;
        const actualCoverage: string = dublinCoreSchema.coverage;
        const actualIdentifier: string = dublinCoreSchema.identifier;
        const actualSource: string = dublinCoreSchema.source;
        const actualFormat: string = dublinCoreSchema.format;
        schemaInternals._getProperty = originalGetProperty;
        // Assert
        expect(actualContributor).toBe(contributorValue);
        expect(actualCreator).toBe(creatorValue);
        expect(actualDate).toBe(dateValue);
        expect(actualPublisher).toBe(publisherValue);
        expect(actualRelation).toBe(relationValue);
        expect(actualSubject).toBe(subjectValue);
        expect(actualType).toBe(typeValue);
        expect(actualTitle).toBe(titleValue);
        expect(actualDescription).toBe(descriptionValue);
        expect(actualRights).toBe(rightsValue);
        expect(actualCoverage).toBe(coverageValue);
        expect(actualIdentifier).toBe(identifierValue);
        expect(actualSource).toBe(sourceValue);
        expect(actualFormat).toBe(formatValue);
        expect(requestedPropertyNames.length).toBe(14);
        expect(requestedPropertyNames[0]).toBe('dc:contributor');
        expect(requestedPropertyNames[1]).toBe('dc:creator');
        expect(requestedPropertyNames[2]).toBe('dc:date');
        expect(requestedPropertyNames[3]).toBe('dc:publisher');
        expect(requestedPropertyNames[4]).toBe('dc:relation');
        expect(requestedPropertyNames[5]).toBe('dc:subject');
        expect(requestedPropertyNames[6]).toBe('dc:type');
        expect(requestedPropertyNames[7]).toBe('dc:title');
        expect(requestedPropertyNames[8]).toBe('dc:description');
        expect(requestedPropertyNames[9]).toBe('dc:rights');
        expect(requestedPropertyNames[10]).toBe('dc:coverage');
        expect(requestedPropertyNames[11]).toBe('dc:identifier');
        expect(requestedPropertyNames[12]).toBe('dc:source');
        expect(requestedPropertyNames[13]).toBe('dc:format');
    });
    it('getters return assigned values without loading the properties again', () => {
        // Arrange
        const dublinCoreSchema: PdfDublinCoreSchema = new PdfDublinCoreSchema();
        const schemaInternals: DublinCoreSchemaInternals =
            dublinCoreSchema as unknown as DublinCoreSchemaInternals;
        const originalGetProperty: (propertyName: string) => unknown =
            schemaInternals._getProperty;
        const originalSetProperty: (propertyName: string, value: unknown) => void =
            schemaInternals._setProperty;
        const contributorValue: string[] = ['Assigned Contributor'];
        const creatorValue: string[] = ['Assigned Creator'];
        const dateValue: string[] = ['2026-08-09'];
        const publisherValue: string[] = ['Assigned Publisher'];
        const relationValue: string[] = ['Assigned Relation'];
        const subjectValue: string[] = ['Assigned Subject'];
        const typeValue: string[] = ['Assigned Type'];
        const titleValue: PdfXmpLangArray = {
            'en': 'Assigned Title'
        } as PdfXmpLangArray;
        const descriptionValue: PdfXmpLangArray = {
            'en': 'Assigned Description'
        } as PdfXmpLangArray;
        const rightsValue: PdfXmpLangArray = {
            'en': 'Assigned Rights'
        } as PdfXmpLangArray;
        const coverageValue: string = 'Assigned Coverage';
        const identifierValue: string = 'ASSIGNED-IDENTIFIER';
        const sourceValue: string = 'Assigned Source';
        const formatValue: string = 'application/pdf';
        const assignedPropertyNames: string[] = [];
        const assignedPropertyValues: unknown[] = [];
        let getPropertyCallCount: number = 0;
        schemaInternals._getProperty = (_propertyName: string): unknown => {
            getPropertyCallCount++;
            return 'Unexpected value';
        };
        schemaInternals._setProperty = (
            propertyName: string,
            value: unknown
        ): void => {
            assignedPropertyNames.push(propertyName);
            assignedPropertyValues.push(value);
        };
        // Act
        dublinCoreSchema.contributor = contributorValue;
        dublinCoreSchema.creator = creatorValue;
        dublinCoreSchema.date = dateValue;
        dublinCoreSchema.publisher = publisherValue;
        dublinCoreSchema.relation = relationValue;
        dublinCoreSchema.subject = subjectValue;
        dublinCoreSchema.type = typeValue;
        dublinCoreSchema.title = titleValue;
        dublinCoreSchema.description = descriptionValue;
        dublinCoreSchema.rights = rightsValue;
        dublinCoreSchema.coverage = coverageValue;
        dublinCoreSchema.identifier = identifierValue;
        dublinCoreSchema.source = sourceValue;
        dublinCoreSchema.format = formatValue;
        const actualContributor: string[] = dublinCoreSchema.contributor;
        const actualCreator: string[] = dublinCoreSchema.creator;
        const actualDate: string[] = dublinCoreSchema.date;
        const actualPublisher: string[] = dublinCoreSchema.publisher;
        const actualRelation: string[] = dublinCoreSchema.relation;
        const actualSubject: string[] = dublinCoreSchema.subject;
        const actualType: string[] = dublinCoreSchema.type;
        const actualTitle: PdfXmpLangArray = dublinCoreSchema.title;
        const actualDescription: PdfXmpLangArray = dublinCoreSchema.description;
        const actualRights: PdfXmpLangArray = dublinCoreSchema.rights;
        const actualCoverage: string = dublinCoreSchema.coverage;
        const actualIdentifier: string = dublinCoreSchema.identifier;
        const actualSource: string = dublinCoreSchema.source;
        const actualFormat: string = dublinCoreSchema.format;
        schemaInternals._getProperty = originalGetProperty;
        schemaInternals._setProperty = originalSetProperty;
        // Assert
        expect(actualContributor).toBe(contributorValue);
        expect(actualCreator).toBe(creatorValue);
        expect(actualDate).toBe(dateValue);
        expect(actualPublisher).toBe(publisherValue);
        expect(actualRelation).toBe(relationValue);
        expect(actualSubject).toBe(subjectValue);
        expect(actualType).toBe(typeValue);
        expect(actualTitle).toBe(titleValue);
        expect(actualDescription).toBe(descriptionValue);
        expect(actualRights).toBe(rightsValue);
        expect(actualCoverage).toBe(coverageValue);
        expect(actualIdentifier).toBe(identifierValue);
        expect(actualSource).toBe(sourceValue);
        expect(actualFormat).toBe(formatValue);
        expect(getPropertyCallCount).toBe(0);
        expect(assignedPropertyNames.length).toBe(14);
        expect(assignedPropertyNames[0]).toBe('dc:contributor');
        expect(assignedPropertyNames[1]).toBe('dc:creator');
        expect(assignedPropertyNames[2]).toBe('dc:date');
        expect(assignedPropertyNames[3]).toBe('dc:publisher');
        expect(assignedPropertyNames[4]).toBe('dc:relation');
        expect(assignedPropertyNames[5]).toBe('dc:subject');
        expect(assignedPropertyNames[6]).toBe('dc:type');
        expect(assignedPropertyNames[7]).toBe('dc:title');
        expect(assignedPropertyNames[8]).toBe('dc:description');
        expect(assignedPropertyNames[9]).toBe('dc:rights');
        expect(assignedPropertyNames[10]).toBe('dc:coverage');
        expect(assignedPropertyNames[11]).toBe('dc:identifier');
        expect(assignedPropertyNames[12]).toBe('dc:source');
        expect(assignedPropertyNames[13]).toBe('dc:format');
        expect(assignedPropertyValues[0]).toBe(contributorValue);
        expect(assignedPropertyValues[1]).toBe(creatorValue);
        expect(assignedPropertyValues[2]).toBe(dateValue);
        expect(assignedPropertyValues[3]).toBe(publisherValue);
        expect(assignedPropertyValues[4]).toBe(relationValue);
        expect(assignedPropertyValues[5]).toBe(subjectValue);
        expect(assignedPropertyValues[6]).toBe(typeValue);
        expect(assignedPropertyValues[7]).toBe(titleValue);
        expect(assignedPropertyValues[8]).toBe(descriptionValue);
        expect(assignedPropertyValues[9]).toBe(rightsValue);
        expect(assignedPropertyValues[10]).toBe(coverageValue);
        expect(assignedPropertyValues[11]).toBe(identifierValue);
        expect(assignedPropertyValues[12]).toBe(sourceValue);
        expect(assignedPropertyValues[13]).toBe(formatValue);
    });
});
import { PdfRightsManagementSchema } from
    '../src/pdf/core/xmp/pdf-rights-management-schema';
describe('PdfRightsManagementSchema mutation coverage', () => {
    it('certificateUrl getter returns the assigned certificate without reloading it', () => {
        // Arrange
        const rightsManagementSchema: PdfRightsManagementSchema =
            new PdfRightsManagementSchema();
        const schemaInternals: any = rightsManagementSchema as any;
        const originalGetProperty: (propertyName: string) => unknown =
            schemaInternals._getProperty;
        const originalSetProperty: (propertyName: string, value: unknown) => void =
            schemaInternals._setProperty;
        const certificateUrl: string = 'https://example.com/certificate';
        let getPropertyCallCount: number = 0;
        let assignedPropertyName: string = '';
        let assignedPropertyValue: unknown;
        schemaInternals._getProperty = (_propertyName: string): unknown => {
            getPropertyCallCount++;
            return 'https://example.com/unexpected-certificate';
        };
        schemaInternals._setProperty = (
            propertyName: string,
            value: unknown
        ): void => {
            assignedPropertyName = propertyName;
            assignedPropertyValue = value;
        };
        // Act
        rightsManagementSchema.certificateUrl = certificateUrl;
        const actualCertificateUrl: string =
            rightsManagementSchema.certificateUrl;
        schemaInternals._getProperty = originalGetProperty;
        schemaInternals._setProperty = originalSetProperty;
        // Assert
        expect(actualCertificateUrl).toBe(certificateUrl);
        expect(getPropertyCallCount).toBe(0);
        expect(assignedPropertyName).toBe('xmpRights:Certificate');
        expect(assignedPropertyValue).toBe(certificateUrl);
    });
    it('isMarked getter returns the assigned false value without loading the property', () => {
        // Arrange
        const rightsManagementSchema: PdfRightsManagementSchema =
            new PdfRightsManagementSchema();
        const schemaInternals: any = rightsManagementSchema as any;
        const originalGetProperty: (propertyName: string) => unknown =
            schemaInternals._getProperty;
        const originalSetProperty: (propertyName: string, value: unknown) => void =
            schemaInternals._setProperty;
        let getPropertyCallCount: number = 0;
        let assignedPropertyName: string = '';
        let assignedPropertyValue: unknown;
        schemaInternals._getProperty = (_propertyName: string): unknown => {
            getPropertyCallCount++;
            return 'True';
        };
        schemaInternals._setProperty = (
            propertyName: string,
            value: unknown
        ): void => {
            assignedPropertyName = propertyName;
            assignedPropertyValue = value;
        };
        // Act
        rightsManagementSchema.isMarked = false;
        const actualMarkedValue: boolean = rightsManagementSchema.isMarked;
        schemaInternals._getProperty = originalGetProperty;
        schemaInternals._setProperty = originalSetProperty;
        // Assert
        expect(actualMarkedValue).toBeFalsy();
        expect(actualMarkedValue).toBe(false);
        expect(getPropertyCallCount).toBe(0);
        expect(assignedPropertyName).toBe('xmpRights:Marked');
        expect(assignedPropertyValue).toBe(false);
    });
    it('isMarked getter returns the assigned true value without loading the property', () => {
        // Arrange
        const rightsManagementSchema: PdfRightsManagementSchema =
            new PdfRightsManagementSchema();
        const schemaInternals: any = rightsManagementSchema as any;
        const originalGetProperty: (propertyName: string) => unknown =
            schemaInternals._getProperty;
        const originalSetProperty: (propertyName: string, value: unknown) => void =
            schemaInternals._setProperty;
        let getPropertyCallCount: number = 0;
        schemaInternals._getProperty = (_propertyName: string): unknown => {
            getPropertyCallCount++;
            return 'False';
        };
        schemaInternals._setProperty = (
            _propertyName: string,
            _value: unknown
        ): void => {
            return;
        };
        // Act
        rightsManagementSchema.isMarked = true;
        const actualMarkedValue: boolean = rightsManagementSchema.isMarked;
        schemaInternals._getProperty = originalGetProperty;
        schemaInternals._setProperty = originalSetProperty;
        // Assert
        expect(actualMarkedValue).toBeTruthy();
        expect(actualMarkedValue).toBe(true);
        expect(getPropertyCallCount).toBe(0);
    });
    it('isMarked getter returns true when the stored value is the True string', () => {
        // Arrange
        const rightsManagementSchema: PdfRightsManagementSchema =
            new PdfRightsManagementSchema();
        const schemaInternals: any = rightsManagementSchema as any;
        const originalGetProperty: (propertyName: string) => unknown =
            schemaInternals._getProperty;
        const requestedPropertyNames: string[] = [];
        schemaInternals._getProperty = (propertyName: string): unknown => {
            requestedPropertyNames.push(propertyName);
            return 'True';
        };
        // Act
        const actualMarkedValue: boolean = rightsManagementSchema.isMarked;
        schemaInternals._getProperty = originalGetProperty;
        // Assert
        expect(actualMarkedValue).toBeTruthy();
        expect(actualMarkedValue).toBe(true);
        expect(requestedPropertyNames.length).toBe(1);
        expect(requestedPropertyNames[0]).toBe('xmpRights:Marked');
    });
    it('isMarked getter returns false when the stored string is not True', () => {
        // Arrange
        const rightsManagementSchema: PdfRightsManagementSchema =
            new PdfRightsManagementSchema();
        const schemaInternals: any = rightsManagementSchema as any;
        const originalGetProperty: (propertyName: string) => unknown =
            schemaInternals._getProperty;
        const requestedPropertyNames: string[] = [];
        schemaInternals._getProperty = (propertyName: string): unknown => {
            requestedPropertyNames.push(propertyName);
            return 'False';
        };
        // Act
        const actualMarkedValue: boolean = rightsManagementSchema.isMarked;
        schemaInternals._getProperty = originalGetProperty;
        // Assert
        expect(actualMarkedValue).toBeFalsy();
        expect(actualMarkedValue).toBe(false);
        expect(requestedPropertyNames.length).toBe(1);
        expect(requestedPropertyNames[0]).toBe('xmpRights:Marked');
    });
    it('isMarked getter returns false when the stored value is not a string', () => {
        // Arrange
        const rightsManagementSchema: PdfRightsManagementSchema =
            new PdfRightsManagementSchema();
        const schemaInternals: any = rightsManagementSchema as any;
        const originalGetProperty: (propertyName: string) => unknown =
            schemaInternals._getProperty;
        const requestedPropertyNames: string[] = [];
        schemaInternals._getProperty = (propertyName: string): unknown => {
            requestedPropertyNames.push(propertyName);
            return false;
        };
        // Act
        const actualMarkedValue: boolean = rightsManagementSchema.isMarked;
        schemaInternals._getProperty = originalGetProperty;
        // Assert
        expect(actualMarkedValue).toBeFalsy();
        expect(actualMarkedValue).toBe(false);
        expect(requestedPropertyNames.length).toBe(1);
        expect(requestedPropertyNames[0]).toBe('xmpRights:Marked');
    });
});
describe('PdfRightsManagementSchema mutation coverage', () => {
    it('constructor initializes the rights management schema name', () => {
        // Arrange
        const rightsManagementSchema: PdfRightsManagementSchema =
            new PdfRightsManagementSchema();
        // Act
        const schemaName: string =
            (rightsManagementSchema as unknown as {
                _name: string;
            })._name;
        // Assert
        expect(schemaName).toBe('RightsManagement');
        expect(schemaName).not.toBe(' ');
    });
    it('webStatement getter returns the existing cached value', () => {
        // Arrange
        const rightsManagementSchema: PdfRightsManagementSchema =
            new PdfRightsManagementSchema();
        const schemaInternals: {
            _webStatement: string;
            _getProperty: (propertyName: string) => unknown;
        } = rightsManagementSchema as unknown as {
            _webStatement: string;
            _getProperty: (propertyName: string) => unknown;
        };
        const originalGetProperty:
            (propertyName: string) => unknown =
            schemaInternals._getProperty;
        const cachedWebStatement: string =
            'https://example.com/cached-rights';
        const storedWebStatement: string =
            'https://example.com/stored-rights';
        schemaInternals._webStatement = cachedWebStatement;
        schemaInternals._getProperty =
            (_propertyName: string): string => {
                return storedWebStatement;
            };
        // Act
        const actualWebStatement: string =
            rightsManagementSchema.webStatement;
        schemaInternals._getProperty = originalGetProperty;
        // Assert
        expect(actualWebStatement).toBe(cachedWebStatement);
        expect(actualWebStatement).not.toBe(storedWebStatement);
        expect(rightsManagementSchema.webStatement)
            .toBe(cachedWebStatement);
    });
    it('isMarked getter returns false when stored value is not a string', () => {
        // Arrange
        const rightsManagementSchema: PdfRightsManagementSchema =
            new PdfRightsManagementSchema();
        const schemaInternals: {
            _getProperty: (propertyName: string) => unknown;
        } = rightsManagementSchema as unknown as {
            _getProperty: (propertyName: string) => unknown;
        };
        const originalGetProperty:
            (propertyName: string) => unknown =
            schemaInternals._getProperty;
        schemaInternals._getProperty =
            (_propertyName: string): boolean => {
                return true;
            };
        // Act
        const markedStatus: boolean =
            rightsManagementSchema.isMarked;
        schemaInternals._getProperty = originalGetProperty;
        // Assert
        expect(markedStatus).toBeFalsy();
        expect(markedStatus).toBe(false);
    });
    it('usageTerms getter returns the existing cached language array', () => {
        // Arrange
        const rightsManagementSchema: PdfRightsManagementSchema =
            new PdfRightsManagementSchema();
        const cachedUsageTerms: PdfXmpLangArray = {
            'en': 'For internal use only'
        } as PdfXmpLangArray;
        const storedUsageTerms: PdfXmpLangArray = {
            'en': 'Stored usage terms'
        } as PdfXmpLangArray;
        const schemaInternals: {
            _usageTerms: PdfXmpLangArray;
            _getProperty: (propertyName: string) => unknown;
        } = rightsManagementSchema as unknown as {
            _usageTerms: PdfXmpLangArray;
            _getProperty: (propertyName: string) => unknown;
        };
        const originalGetProperty:
            (propertyName: string) => unknown =
            schemaInternals._getProperty;
        schemaInternals._usageTerms = cachedUsageTerms;
        schemaInternals._getProperty =
            (_propertyName: string): PdfXmpLangArray => {
                return storedUsageTerms;
            };
        // Act
        const actualUsageTerms: PdfXmpLangArray =
            rightsManagementSchema.usageTerms;
        schemaInternals._getProperty = originalGetProperty;
        // Assert
        expect(actualUsageTerms).toBe(cachedUsageTerms);
        expect(actualUsageTerms).not.toBe(storedUsageTerms);
        expect(rightsManagementSchema.usageTerms)
            .toBe(cachedUsageTerms);
    });
});