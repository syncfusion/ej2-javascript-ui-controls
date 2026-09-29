import { PdfXmpMetadata } from '../src/pdf/core/xmp/pdf-xmp-metadata';
import { _bytesToString, _stringToBytes } from '../src/pdf/core/utils';
describe('PdfXmpMetadata _build mutation coverage', () => {
    it('PdfXmpMetadata _build preserves existing create date', () => {
        // Arrange
        const metadata: PdfXmpMetadata = new PdfXmpMetadata();
        const existingCreateDate: Date = new Date('2024-02-03T04:05:06.000Z');
        metadata.basicSchema.createDate = existingCreateDate;
        // Act
        const result: Uint8Array = metadata._build();
        // Assert
        expect(result).toBeDefined();
        expect(result.length).toBeGreaterThan(0);
        expect(metadata.basicSchema.createDate).toBe(existingCreateDate);
        expect(metadata.basicSchema.createDate.getTime()).toBe(existingCreateDate.getTime());
        metadata._destroy();
    });
    it('PdfXmpMetadata _build preserves existing Dublin Core format', () => {
        // Arrange
        const metadata: PdfXmpMetadata = new PdfXmpMetadata();
        const existingFormat: string = 'application/custom-pdf';
        metadata.dublinCoreSchema.format = existingFormat;
        // Act
        const result: Uint8Array = metadata._build();
        // Assert
        expect(result).toBeDefined();
        expect(result.length).toBeGreaterThan(0);
        expect(metadata.dublinCoreSchema.format).toBe(existingFormat);
        expect(metadata.dublinCoreSchema.format).not.toBe('application/pdf');
        metadata._destroy();
    });
    it('PdfXmpMetadata _build removes a valid XML declaration with supported whitespace', () => {
        // Arrange
        const metadata: PdfXmpMetadata = new PdfXmpMetadata();
        const originalSave: () => Uint8Array = _XmlWriter.prototype._save;
        const declarationWithWhitespace: string =
            '<?xml  version = "1.0"  encoding = "utf-8" ?><sample></sample>';
        _XmlWriter.prototype._save = (): Uint8Array => {
            return _stringToBytes(declarationWithWhitespace) as Uint8Array;
        };
        // Act
        const result: Uint8Array = metadata._build();
        const xmlContent: string = _bytesToString(result);
        // Assert
        expect(result).toBeDefined();
        expect(xmlContent.indexOf(
            '<?xml version="1.0" encoding="utf-8"?>'
        )).toBe(0);
        expect(xmlContent.indexOf(
            '<?xml  version = "1.0"  encoding = "utf-8" ?>'
        )).toBe(-1);
        expect(xmlContent.indexOf('<sample>')).toBeGreaterThan(-1);
        expect(xmlContent.indexOf('</sample>')).toBeGreaterThan(-1);
        _XmlWriter.prototype._save = originalSave;
        metadata._destroy();
    });
    it('PdfXmpMetadata _build preserves an XML declaration that is not at the beginning', () => {
        // Arrange
        const metadata: PdfXmpMetadata = new PdfXmpMetadata();
        const originalSave: () => Uint8Array = _XmlWriter.prototype._save;
        const generatedDeclaration: string =
            '<?xml version="1.0" encoding="utf-8"?>';
        const contentBeforeDeclaration: string =
            '<sample>' + generatedDeclaration + '</sample>';
        _XmlWriter.prototype._save = (): Uint8Array => {
            return _stringToBytes(contentBeforeDeclaration) as Uint8Array;
        };
        // Act
        const result: Uint8Array = metadata._build();
        const xmlContent: string = _bytesToString(result);
        const firstDeclarationIndex: number =
            xmlContent.indexOf(generatedDeclaration);
        const secondDeclarationIndex: number =
            xmlContent.indexOf(
                generatedDeclaration,
                firstDeclarationIndex + generatedDeclaration.length
            );
        // Assert
        expect(result).toBeDefined();
        expect(firstDeclarationIndex).toBe(0);
        expect(secondDeclarationIndex).toBeGreaterThan(firstDeclarationIndex);
        expect(xmlContent.indexOf(
            '<sample>\n' + generatedDeclaration
        )).toBeGreaterThan(-1);
        expect(xmlContent.indexOf(
            generatedDeclaration + '\n</sample>'
        )).toBeGreaterThan(-1);
        _XmlWriter.prototype._save = originalSave;
        metadata._destroy();
    });
    it('PdfXmpMetadata _build separates the XML declaration from the xpacket instruction', () => {
        // Arrange
        const metadata: PdfXmpMetadata = new PdfXmpMetadata();
        const generatedDeclaration: string =
            '<?xml version="1.0" encoding="utf-8"?>';
        const xpacketStart: string = '<?xpacket begin=';
        const separatedPacketStart: string =
            generatedDeclaration + '\n' + xpacketStart;
        const joinedPacketStart: string =
            generatedDeclaration + xpacketStart;
        // Act
        const result: Uint8Array = metadata._build();
        const xmlContent: string = _bytesToString(result);
        // Assert
        expect(result).toBeDefined();
        expect(result.length).toBeGreaterThan(0);
        expect(xmlContent.indexOf(generatedDeclaration)).toBe(0);
        expect(xmlContent.indexOf(separatedPacketStart)).toBe(0);
        expect(xmlContent.indexOf(joinedPacketStart)).toBe(-1);
        expect(xmlContent.indexOf(xpacketStart)).toBe(
            generatedDeclaration.length + 1
        );
        metadata._destroy();
    });
});
import { PdfCustomSchema } from '../src/pdf/core/xmp/pdf-custom-schema';
import { PdfBasicSchema } from '../src/pdf/core/xmp/pdf-basic-schema';
describe('PdfXmpMetadata _writeSchemas mutation coverage', () => {
    it('PdfXmpMetadata _writeSchemas excludes uninitialized standard schemas', () => {
        // Arrange
        const metadata: PdfXmpMetadata = new PdfXmpMetadata();
        const writer: _XmlWriter = new _XmlWriter();
        const writtenSchemas: PdfXmpSchema[] = [];
        const originalWriteSchema: (_writer: _XmlWriter, _schema: PdfXmpSchema) => void =
            (metadata as any)._writeSchema;
        (metadata as any)._writeSchema = (
            _writer: _XmlWriter,
            schema: PdfXmpSchema
        ): void => {
            writtenSchemas.push(schema);
        };
        // Act
        (metadata as any)._writeSchemas(writer);
        // Assert
        expect((metadata as any)._basicSchema).toBeUndefined();
        expect((metadata as any)._dublinCoreSchema).toBeUndefined();
        expect((metadata as any)._pdfSchema).toBeUndefined();
        expect((metadata as any)._pagedTextSchema).toBeUndefined();
        expect((metadata as any)._basicJobTicketSchema).toBeUndefined();
        expect((metadata as any)._rightsManagementSchema).toBeUndefined();
        expect(writtenSchemas.length).toBe(0);
        (metadata as any)._writeSchema = originalWriteSchema;
        metadata._destroy();
    });
    it('PdfXmpMetadata _writeSchemas excludes initialized standard schemas with empty properties', () => {
        // Arrange
        const metadata: PdfXmpMetadata = new PdfXmpMetadata();
        const writer: _XmlWriter = new _XmlWriter();
        const basicSchema = metadata.basicSchema;
        const dublinCoreSchema = metadata.dublinCoreSchema;
        const pdfSchema = metadata.pdfSchema;
        const pagedTextSchema = metadata.pagedTextSchema;
        const basicJobTicketSchema = metadata.basicJobTicketSchema;
        const rightsManagementSchema = metadata.rightsManagementSchema;
        const writtenSchemas: PdfXmpSchema[] = [];
        const originalWriteSchema: (_writer: _XmlWriter, _schema: PdfXmpSchema) => void =
            (metadata as any)._writeSchema;
        (metadata as any)._writeSchema = (
            _writer: _XmlWriter,
            schema: PdfXmpSchema
        ): void => {
            writtenSchemas.push(schema);
        };
        // Act
        (metadata as any)._writeSchemas(writer);
        // Assert
        expect(basicSchema._properties.size).toBe(0);
        expect(dublinCoreSchema._properties.size).toBe(0);
        expect(pdfSchema._properties.size).toBe(0);
        expect(pagedTextSchema._properties.size).toBe(0);
        expect(basicJobTicketSchema._properties.size).toBe(0);
        expect(rightsManagementSchema._properties.size).toBe(0);
        expect(writtenSchemas.length).toBe(0);
        (metadata as any)._writeSchema = originalWriteSchema;
        metadata._destroy();
    });
    it('PdfXmpMetadata _writeSchemas writes every populated standard schema in order', () => {
        // Arrange
        const metadata: PdfXmpMetadata = new PdfXmpMetadata();
        const writer: _XmlWriter = new _XmlWriter();
        const writtenSchemas: PdfXmpSchema[] = [];
        const originalWriteSchema: (_writer: _XmlWriter, _schema: PdfXmpSchema) => void =
            (metadata as any)._writeSchema;
        metadata.basicSchema.creatorTool = 'Mutation coverage application';
        metadata.dublinCoreSchema.format = 'application/pdf';
        metadata.pdfSchema.keywords = 'metadata';
        metadata.pagedTextSchema.pageCount = 4;
        metadata.basicJobTicketSchema.jobRef = ['Job001'];
        metadata.rightsManagementSchema.isMarked = true;
        const basicSchema = metadata.basicSchema;
        const dublinCoreSchema = metadata.dublinCoreSchema;
        const pdfSchema = metadata.pdfSchema;
        const pagedTextSchema = metadata.pagedTextSchema;
        const basicJobTicketSchema = metadata.basicJobTicketSchema;
        const rightsManagementSchema = metadata.rightsManagementSchema;
        (metadata as any)._writeSchema = (
            _writer: _XmlWriter,
            schema: PdfXmpSchema
        ): void => {
            writtenSchemas.push(schema);
        };
        // Act
        (metadata as any)._writeSchemas(writer);
        // Assert
        expect(basicSchema._properties.size).toBeGreaterThan(0);
        expect(dublinCoreSchema._properties.size).toBeGreaterThan(0);
        expect(pdfSchema._properties.size).toBeGreaterThan(0);
        expect(pagedTextSchema._properties.size).toBeGreaterThan(0);
        expect(basicJobTicketSchema._properties.size).toBeGreaterThan(0);
        expect(rightsManagementSchema._properties.size).toBeGreaterThan(0);
        expect(writtenSchemas.length).toBe(6);
        expect(writtenSchemas[0]).toBe(basicSchema);
        expect(writtenSchemas[1]).toBe(dublinCoreSchema);
        expect(writtenSchemas[2]).toBe(pdfSchema);
        expect(writtenSchemas[3]).toBe(pagedTextSchema);
        expect(writtenSchemas[4]).toBe(basicJobTicketSchema);
        expect(writtenSchemas[5]).toBe(rightsManagementSchema);
        (metadata as any)._writeSchema = originalWriteSchema;
        metadata._destroy();
    });
    it('PdfXmpMetadata _writeSchemas excludes an empty custom schema collection', () => {
        // Arrange
        const metadata: PdfXmpMetadata = new PdfXmpMetadata();
        const writer: _XmlWriter = new _XmlWriter();
        const writtenSchemas: PdfXmpSchema[] = [];
        const originalWriteSchema: (_writer: _XmlWriter, _schema: PdfXmpSchema) => void =
            (metadata as any)._writeSchema;
        (metadata as any)._writeSchema = (
            _writer: _XmlWriter,
            schema: PdfXmpSchema
        ): void => {
            writtenSchemas.push(schema);
        };
        // Act
        (metadata as any)._writeSchemas(writer);
        // Assert
        expect(metadata._customSchemas).toBeDefined();
        expect(metadata._customSchemas.length).toBe(0);
        expect(writtenSchemas.length).toBe(0);
        (metadata as any)._writeSchema = originalWriteSchema;
        metadata._destroy();
    });
    it('PdfXmpMetadata _writeSchemas writes a custom schema containing map data', () => {
        // Arrange
        const metadata: PdfXmpMetadata = new PdfXmpMetadata();
        const writer: _XmlWriter = new _XmlWriter();
        const customSchema: PdfCustomSchema = new PdfCustomSchema(
            metadata,
            'custom',
            'http://example.com/custom/1.0/'
        );
        const writtenSchemas: PdfXmpSchema[] = [];
        const originalWriteSchema: (_writer: _XmlWriter, _schema: PdfXmpSchema) => void =
            (metadata as any)._writeSchema;
        customSchema.customData.set('DocumentCode', 'PDF-001');
        metadata._customSchemas.push(customSchema);
        (metadata as any)._writeSchema = (
            _writer: _XmlWriter,
            schema: PdfXmpSchema
        ): void => {
            writtenSchemas.push(schema);
        };
        // Act
        (metadata as any)._writeSchemas(writer);
        // Assert
        expect(metadata._customSchemas.length).toBe(2);
        expect(customSchema.customData instanceof Map).toBeTruthy();
        expect(customSchema.customData.size).toBe(1);
        expect(writtenSchemas.length).toBe(2);
        expect(writtenSchemas[0]).toBe(customSchema);
        (metadata as any)._writeSchema = originalWriteSchema;
        metadata._destroy();
    });
    it('PdfXmpMetadata _writeSchemas excludes empty custom schema through properties fallback', () => {
        // Arrange
        const metadata: PdfXmpMetadata = new PdfXmpMetadata();
        const writer: _XmlWriter = new _XmlWriter();
        const customSchema: PdfCustomSchema = new PdfCustomSchema(
            metadata,
            'custom',
            'http://example.com/custom/1.0/'
        );
        const writtenSchemas: PdfXmpSchema[] = [];
        const originalWriteSchema: (_writer: _XmlWriter, _schema: PdfXmpSchema) => void =
            (metadata as any)._writeSchema;
        const originalCustomData: Map<string, string> = (customSchema as any).customData;
        (customSchema as any).customData = undefined;
        metadata._customSchemas.push(customSchema);
        (metadata as any)._writeSchema = (
            _writer: _XmlWriter,
            schema: PdfXmpSchema
        ): void => {
            writtenSchemas.push(schema);
        };
        // Act
        (metadata as any)._writeSchemas(writer);
        // Assert
        expect((customSchema as any).customData).toBeUndefined();
        expect((customSchema as any)._properties).toBeDefined();
        expect((customSchema as any)._properties.size).toBe(0);
        expect(writtenSchemas.length).toBe(0);
        (customSchema as any).customData = originalCustomData;
        (metadata as any)._writeSchema = originalWriteSchema;
        metadata._destroy();
    });
    it('PdfXmpMetadata _writeSchemas skips custom schema processing when collection is undefined', () => {
        // Arrange
        const metadata: PdfXmpMetadata = new PdfXmpMetadata();
        const writer: _XmlWriter = new _XmlWriter();
        const writtenSchemas: PdfXmpSchema[] = [];
        const originalWriteSchema: (_writer: _XmlWriter, _schema: PdfXmpSchema) => void =
            (metadata as any)._writeSchema;
        const originalCustomSchemas: PdfCustomSchema[] = metadata._customSchemas;
        (metadata as any)._customSchemas = undefined;
        (metadata as any)._writeSchema = (
            _writer: _XmlWriter,
            schema: PdfXmpSchema
        ): void => {
            writtenSchemas.push(schema);
        };
        // Act
        (metadata as any)._writeSchemas(writer);
        // Assert
        expect((metadata as any)._customSchemas).toBeUndefined();
        expect(writtenSchemas.length).toBe(0);
        metadata._customSchemas = originalCustomSchemas;
        (metadata as any)._writeSchema = originalWriteSchema;
        metadata._destroy();
    });
});
describe('PdfXmpMetadata _writeSchema mutation coverage', () => {
    it('PdfXmpMetadata _writeSchema writes exact attributes and registers namespace once', () => {
        // Arrange
        const metadata: PdfXmpMetadata = new PdfXmpMetadata();
        const writer: _XmlWriter = new _XmlWriter();
        const schema: PdfBasicSchema = metadata.basicSchema;
        const rdfNamespace: string =
            'http://www.w3.org/1999/02/22-rdf-syntax-ns#';
        const xmlnsNamespace: string =
            'http://www.w3.org/2000/xmlns/';
        const schemaPrefix: string = (schema as any)._prefix;
        const schemaNamespace: string =
            (schema as any)._getNamespaceUri();
        const attributeCalls: {
            localName: string;
            value: string;
            prefix: string;
            namespaceUri: string;
        }[] = [];
        const originalWriteAttributeString: (
            localName: string,
            value: string,
            prefix: string,
            namespaceUri: string
        ) => void = (writer as any)._writeAttributeString;
        (writer as any)._writeAttributeString = (
            localName: string,
            value: string,
            prefix: string,
            namespaceUri: string
        ): void => {
            attributeCalls.push({
                localName,
                value,
                prefix,
                namespaceUri
            });
        };
        writer._writeStartElement(
            'RDF',
            'rdf',
            rdfNamespace
        );
        // Act
        (metadata as any)._writeSchema(writer, schema);
        (metadata as any)._writeSchema(writer, schema);
        let aboutAttributeCount: number = 0;
        let namespaceAttributeCount: number = 0;
        let aboutAttributeValue: string;
        let aboutAttributePrefix: string;
        let aboutAttributeNamespace: string;
        let namespaceAttributeValue: string;
        let namespaceAttributePrefix: string;
        let namespaceAttributeNamespace: string;
        for (const attributeCall of attributeCalls) {
            if (attributeCall.localName === 'about') {
                aboutAttributeCount++;
                aboutAttributeValue = attributeCall.value;
                aboutAttributePrefix = attributeCall.prefix;
                aboutAttributeNamespace = attributeCall.namespaceUri;
            }
            if (attributeCall.localName === schemaPrefix) {
                namespaceAttributeCount++;
                namespaceAttributeValue = attributeCall.value;
                namespaceAttributePrefix = attributeCall.prefix;
                namespaceAttributeNamespace =
                    attributeCall.namespaceUri;
            }
        }
        // Assert
        expect(aboutAttributeCount).toBe(2);
        expect(aboutAttributeValue).toBe('');
        expect(aboutAttributePrefix).toBe('rdf');
        expect(aboutAttributeNamespace).toBe(rdfNamespace);
        expect(namespaceAttributeCount).toBe(1);
        expect(namespaceAttributeValue).toBe(schemaNamespace);
        expect(namespaceAttributePrefix).toBe('xmlns');
        expect(namespaceAttributeNamespace).toBe(xmlnsNamespace);
        expect(metadata._namespaceRegistry.size).toBe(1);
        expect(metadata._namespaceRegistry.has(schemaPrefix)).toBeTruthy();
        (writer as any)._writeAttributeString =
            originalWriteAttributeString;
        metadata._destroy();
    });
    it('PdfXmpMetadata _writeSchemas excludes a custom schema containing an empty map', () => {
        // Arrange
        const metadata: PdfXmpMetadata = new PdfXmpMetadata();
        const writer: _XmlWriter = new _XmlWriter();
        const writtenSchemas: PdfXmpSchema[] = [];
        const originalWriteSchema: (
            _writer: _XmlWriter,
            _schema: PdfXmpSchema
        ) => void = (metadata as any)._writeSchema;
        const customSchema: PdfCustomSchema = new PdfCustomSchema(
            metadata,
            'custom',
            'http://example.com/custom/1.0/'
        );
        (metadata as any)._writeSchema = (
            _writer: _XmlWriter,
            schema: PdfXmpSchema
        ): void => {
            writtenSchemas.push(schema);
        };
        // Act
        (metadata as any)._writeSchemas(writer);
        // Assert
        expect(metadata._customSchemas.length).toBe(1);
        expect(metadata._customSchemas[0]).toBe(customSchema);
        expect(customSchema.customData instanceof Map).toBeTruthy();
        expect(customSchema.customData.size).toBe(0);
        expect(writtenSchemas.length).toBe(0);
        (metadata as any)._writeSchema = originalWriteSchema;
        metadata._destroy();
    });
});
describe('PdfXmpMetadata remaining mutation coverage', () => {
    it('PdfXmpMetadata _build creates missing default metadata values', () => {
        // Arrange
        const metadata: PdfXmpMetadata = new PdfXmpMetadata();
        // Act
        const result: Uint8Array = metadata._build();
        // Assert
        expect(result).toBeDefined();
        expect(result.length).toBeGreaterThan(0);
        expect(metadata.basicSchema.createDate).toBeDefined();
        expect(metadata.basicSchema.modifyDate).toBeDefined();
        expect(metadata.dublinCoreSchema.format).toBe('application/pdf');
        metadata._destroy();
    });
    it('PdfXmpMetadata _build preserves all explicitly assigned metadata values', () => {
        // Arrange
        const metadata: PdfXmpMetadata = new PdfXmpMetadata();
        const expectedCreateDate: Date =
            new Date('2024-01-02T03:04:05.000Z');
        const expectedModifyDate: Date =
            new Date('2025-06-07T08:09:10.000Z');
        const expectedFormat: string = 'application/custom-pdf';
        metadata.basicSchema.createDate = expectedCreateDate;
        metadata.basicSchema.modifyDate = expectedModifyDate;
        metadata.dublinCoreSchema.format = expectedFormat;
        // Act
        const result: Uint8Array = metadata._build();
        // Assert
        expect(result).toBeDefined();
        expect(result.length).toBeGreaterThan(0);
        expect(metadata.basicSchema.createDate).toBe(expectedCreateDate);
        expect(metadata.basicSchema.modifyDate).toBe(expectedModifyDate);
        expect(metadata.dublinCoreSchema.format).toBe(expectedFormat);
        metadata._destroy();
    });
    it('PdfXmpMetadata _build removes only a declaration at the beginning', () => {
        // Arrange
        const metadata: PdfXmpMetadata = new PdfXmpMetadata();
        const originalSave: () => Uint8Array =
            _XmlWriter.prototype._save;
        const xmlDeclaration: string =
            '<?xml version = "1.0" encoding = "utf-8" ?>';
        const writerContent: string =
            xmlDeclaration + '<sample></sample>';
        _XmlWriter.prototype._save = (): Uint8Array => {
            return _stringToBytes(writerContent) as Uint8Array;
        };
        // Act
        const result: Uint8Array = metadata._build();
        const xmlContent: string = _bytesToString(result);
        const generatedDeclaration: string =
            '<?xml version="1.0" encoding="utf-8"?>';
        const secondDeclarationIndex: number = xmlContent.indexOf(
            '<?xml',
            generatedDeclaration.length
        );
        // Assert
        expect(xmlContent.indexOf(generatedDeclaration)).toBe(0);
        expect(xmlContent.indexOf(xmlDeclaration)).toBe(-1);
        expect(secondDeclarationIndex).toBe(-1);
        expect(xmlContent.indexOf('<sample>')).toBeGreaterThan(-1);
        expect(xmlContent.indexOf('</sample>')).toBeGreaterThan(-1);
        _XmlWriter.prototype._save = originalSave;
        metadata._destroy();
    });
    it('PdfXmpMetadata _build writes the canonical declaration and packet boundary', () => {
        // Arrange
        const metadata: PdfXmpMetadata = new PdfXmpMetadata();
        const expectedDeclaration: string =
            '<?xml version="1.0" encoding="utf-8"?>';
        const expectedPacketStart: string = '<?xpacket begin=';
        const expectedBoundary: string =
            expectedDeclaration + '\n' + expectedPacketStart;
        // Act
        const result: Uint8Array = metadata._build();
        const xmlContent: string = _bytesToString(result);
        // Assert
        expect(result.length).toBeGreaterThan(0);
        expect(xmlContent.indexOf(expectedDeclaration)).toBe(0);
        expect(xmlContent.indexOf(expectedBoundary)).toBe(0);
        expect(xmlContent.indexOf(expectedPacketStart)).toBe(
            expectedDeclaration.length + 1
        );
        expect(xmlContent.indexOf(
            '<?xpacket end="r"?>'
        )).toBeGreaterThan(-1);
        metadata._destroy();
    });
    it('PdfXmpMetadata _writeSchemas does not process undefined custom schema collection', () => {
        // Arrange
        const metadata: PdfXmpMetadata = new PdfXmpMetadata();
        const writer: _XmlWriter = new _XmlWriter();
        const writtenSchemas: PdfXmpSchema[] = [];
        const originalCustomSchemas: PdfCustomSchema[] =
            metadata._customSchemas;
        const originalWriteSchema: (
            _writer: _XmlWriter,
            _schema: PdfXmpSchema
        ) => void = (metadata as any)._writeSchema;
        (metadata as any)._customSchemas = undefined;
        (metadata as any)._writeSchema = (
            _writer: _XmlWriter,
            schema: PdfXmpSchema
        ): void => {
            writtenSchemas.push(schema);
        };
        // Act
        (metadata as any)._writeSchemas(writer);
        // Assert
        expect((metadata as any)._customSchemas).toBeUndefined();
        expect(writtenSchemas.length).toBe(0);
        metadata._customSchemas = originalCustomSchemas;
        (metadata as any)._writeSchema = originalWriteSchema;
        metadata._destroy();
    });
    it('PdfXmpMetadata _writeSchemas writes populated custom schema exactly once', () => {
        // Arrange
        const metadata: PdfXmpMetadata = new PdfXmpMetadata();
        const writer: _XmlWriter = new _XmlWriter();
        const customSchema: PdfCustomSchema = new PdfCustomSchema(
            metadata,
            'custom',
            'http://example.com/custom/1.0/'
        );
        const writtenSchemas: PdfXmpSchema[] = [];
        const originalWriteSchema: (
            _writer: _XmlWriter,
            _schema: PdfXmpSchema
        ) => void = (metadata as any)._writeSchema;
        customSchema.customData.set(
            'DocumentCode',
            'PDF-001'
        );
        (metadata as any)._writeSchema = (
            _writer: _XmlWriter,
            schema: PdfXmpSchema
        ): void => {
            writtenSchemas.push(schema);
        };
        // Act
        (metadata as any)._writeSchemas(writer);
        // Assert
        expect(metadata._customSchemas.length).toBe(1);
        expect(metadata._customSchemas[0]).toBe(customSchema);
        expect(customSchema.customData.size).toBe(1);
        expect(writtenSchemas.length).toBe(1);
        expect(writtenSchemas[0]).toBe(customSchema);
        (metadata as any)._writeSchema = originalWriteSchema;
        metadata._destroy();
    });
    it('PdfXmpMetadata _writeSchemas excludes custom schema with empty map data', () => {
        // Arrange
        const metadata: PdfXmpMetadata = new PdfXmpMetadata();
        const writer: _XmlWriter = new _XmlWriter();
        const customSchema: PdfCustomSchema = new PdfCustomSchema(
            metadata,
            'custom',
            'http://example.com/custom/1.0/'
        );
        const writtenSchemas: PdfXmpSchema[] = [];
        const originalWriteSchema: (
            _writer: _XmlWriter,
            _schema: PdfXmpSchema
        ) => void = (metadata as any)._writeSchema;
        (metadata as any)._writeSchema = (
            _writer: _XmlWriter,
            schema: PdfXmpSchema
        ): void => {
            writtenSchemas.push(schema);
        };
        // Act
        (metadata as any)._writeSchemas(writer);
        // Assert
        expect(metadata._customSchemas.length).toBe(1);
        expect(metadata._customSchemas[0]).toBe(customSchema);
        expect(customSchema.customData instanceof Map).toBeTruthy();
        expect(customSchema.customData.size).toBe(0);
        expect(writtenSchemas.length).toBe(0);
        (metadata as any)._writeSchema = originalWriteSchema;
        metadata._destroy();
    });
});
import { _XmlWriter } from '../src/pdf/core/import-export/xml-writer';
import { PdfXmpSchemaType } from '../src/pdf/core/enumerator';
import { PdfXmpSchema } from '../src/pdf/core/xmp/pdf-xmp-schema';
class PdfXmpSchemaStub extends PdfXmpSchema {
    get schemaType(): PdfXmpSchemaType {
        return PdfXmpSchemaType.basic;
    }
}
interface XmlCall {
    method: string;
    name?: string;
    value?: string;
    prefix?: string;
    namespaceUri?: string;
}
interface XmlWriterMethods {
    _writeStartElement(name: string, prefix?: string, namespaceUri?: string): void;
    _writeAttributeString(name: string, value: string, prefix?: string, namespaceUri?: string): void;
    _writeElementString(name: string, value: string, prefix?: string, namespaceUri?: string): void;
    _writeString(value: string): void;
    _writeEndElement(): void;
}
function configureWriter(writer: _XmlWriter, calls: XmlCall[]): XmlWriterMethods {
    const methods: XmlWriterMethods = writer as unknown as XmlWriterMethods;
    const originalMethods: XmlWriterMethods = {
        _writeStartElement: methods._writeStartElement,
        _writeAttributeString: methods._writeAttributeString,
        _writeElementString: methods._writeElementString,
        _writeString: methods._writeString,
        _writeEndElement: methods._writeEndElement
    };
    methods._writeStartElement = (name: string, prefix?: string, namespaceUri?: string): void => {
        calls.push({ method: 'start', name, prefix, namespaceUri });
    };
    methods._writeAttributeString = (name: string, value: string, prefix?: string, namespaceUri?: string): void => {
        calls.push({ method: 'attribute', name, value, prefix, namespaceUri });
    };
    methods._writeElementString = (name: string, value: string, prefix?: string, namespaceUri?: string): void => {
        calls.push({ method: 'element', name, value, prefix, namespaceUri });
    };
    methods._writeString = (value: string): void => {
        calls.push({ method: 'text', value });
    };
    methods._writeEndElement = (): void => {
        calls.push({ method: 'end' });
    };
    return originalMethods;
}
function restoreWriter(writer: _XmlWriter, originalMethods: XmlWriterMethods): void {
    const methods: XmlWriterMethods = writer as unknown as XmlWriterMethods;
    methods._writeStartElement = originalMethods._writeStartElement;
    methods._writeAttributeString = originalMethods._writeAttributeString;
    methods._writeElementString = originalMethods._writeElementString;
    methods._writeString = originalMethods._writeString;
    methods._writeEndElement = originalMethods._writeEndElement;
}
describe('PdfXmpSchema survived mutation coverage', () => {
    const xapNamespace: string = 'http://ns.adobe.com/xap/1.0/';
    const dcNamespace: string = 'http://purl.org/dc/elements/1.1/';
    const rdfNamespace: string = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';
    const xmlNamespace: string = 'http://www.w3.org/XML/1998/namespace';
    it('kills undefined and null short-circuit mutations in _setProperty', () => {
        const schema: PdfXmpSchemaStub = new PdfXmpSchemaStub();
        schema._properties.set('existing', 'preserved');
        schema._setProperty('undefinedValue', undefined);
        schema._setProperty('nullValue', null);
        expect(schema._getProperty('existing')).toBe('preserved');
        expect(schema._getProperty('undefinedValue')).toBeUndefined();
        expect(schema._getProperty('nullValue')).toBeUndefined();
        expect(schema._properties.size).toBe(1);
    });
    it('kills the date regular expression end-anchor mutation', () => {
        const schema: PdfXmpSchemaStub = new PdfXmpSchemaStub();
        const date: Date = new Date('2026-08-12T09:01:09.123Z');
        const originalToISOString: () => string = date.toISOString;
        date.toISOString = (): string => '2026-08-12T09:01:09.123Z-tail';
        schema._setProperty('xap:ModifyDate', date);
        const result: string = schema._getProperty('xap:ModifyDate') as string;
        date.toISOString = originalToISOString;
        expect(result).toBe('2026-08-12T09:01:09.123Z-tail');
        expect(result).not.toBe('2026-08-12T09:01:09Z-tail');
    });
    it('kills the null custom namespace condition mutation', () => {
        const schema: PdfXmpSchemaStub = new PdfXmpSchemaStub();
        schema._prefix = 'custom';
        schema._customNamespaceUri = null as unknown as string;
        const result: string = schema._getNamespaceUri();
        expect(result).toBe('');
        expect(result).not.toBeNull();
    });
    it('kills sorting and first-element namespace mutations', () => {
        const schema: PdfXmpSchemaStub = new PdfXmpSchemaStub();
        const writer: _XmlWriter = new _XmlWriter();
        const calls: XmlCall[] = [];
        const originalMethods: XmlWriterMethods = configureWriter(writer, calls);
        schema._properties.set('dc:Zeta', 'second');
        schema._properties.set('dc:Alpha', 'first');
        schema._writeXml(writer);
        restoreWriter(writer, originalMethods);
        expect(calls.length).toBe(2);
        expect(calls[0].name).toBe('Alpha');
        expect(calls[0].value).toBe('first');
        expect(calls[0].prefix).toBe('dc');
        expect(calls[0].namespaceUri).toBe(dcNamespace);
        expect(calls[1].name).toBe('Zeta');
        expect(calls[1].value).toBe('second');
        expect(calls[1].namespaceUri).toBeUndefined();
    });
    it('kills null and undefined value mutations in _writeXml', () => {
        const schema: PdfXmpSchemaStub = new PdfXmpSchemaStub();
        const writer: _XmlWriter = new _XmlWriter();
        const calls: XmlCall[] = [];
        const originalMethods: XmlWriterMethods = configureWriter(writer, calls);
        schema._properties.set('dc:Alpha', undefined);
        schema._properties.set('dc:Beta', null);
        schema._properties.set('dc:Gamma', 'written');
        schema._writeXml(writer);
        restoreWriter(writer, originalMethods);
        expect(calls.length).toBe(1);
        expect(calls[0].name).toBe('Gamma');
        expect(calls[0].value).toBe('written');
        expect(calls[0].namespaceUri).toBe(dcNamespace);
    });
    it('kills local-name prefix and namespace conditional mutations', () => {
        // Arrange
        const localNameSchema: PdfXmpSchemaStub = new PdfXmpSchemaStub();
        const localNameWriter: _XmlWriter = new _XmlWriter();
        const localNameCalls: XmlCall[] = [];
        const originalLocalNameMethods: XmlWriterMethods =
            configureWriter(localNameWriter, localNameCalls);
        localNameSchema._properties.set(':Alpha', 'first');
        const namespaceSchema: PdfXmpSchemaStub = new PdfXmpSchemaStub();
        const namespaceWriter: _XmlWriter = new _XmlWriter();
        const namespaceCalls: XmlCall[] = [];
        const originalNamespaceMethods: XmlWriterMethods =
            configureWriter(namespaceWriter, namespaceCalls);
        namespaceSchema._properties.set('dc:Alpha', 'first');
        namespaceSchema._properties.set('pdf:Beta', 'second');
        // Act
        localNameSchema._writeXml(localNameWriter);
        namespaceSchema._writeXml(namespaceWriter);
        restoreWriter(localNameWriter, originalLocalNameMethods);
        restoreWriter(namespaceWriter, originalNamespaceMethods);
        // Assert
        expect(localNameCalls.length).toBe(1);
        expect(localNameCalls[0].name).toBe('Alpha');
        expect(localNameCalls[0].prefix).toBe('');
        expect(localNameCalls[0].namespaceUri).toBeUndefined();
        expect(namespaceCalls.length).toBe(2);
        expect(namespaceCalls[0].name).toBe('Alpha');
        expect(namespaceCalls[0].prefix).toBe('dc');
        expect(namespaceCalls[0].namespaceUri).toBe(dcNamespace);
        expect(namespaceCalls[1].name).toBe('Beta');
        expect(namespaceCalls[1].prefix).toBe('pdf');
        expect(namespaceCalls[1].namespaceUri).toBeUndefined();
    });
    it('kills local-name and prefix conditional mutations', () => {
        // Arrange
        const schema: PdfXmpSchemaStub = new PdfXmpSchemaStub();
        const writer: _XmlWriter = new _XmlWriter();
        const calls: XmlCall[] = [];
        const originalMethods: XmlWriterMethods = configureWriter(writer, calls);
        schema._properties.set(':Alpha', 'first');
        // Act
        schema._writeXml(writer);
        restoreWriter(writer, originalMethods);
        // Assert
        expect(calls.length).toBe(1);
        expect(calls[0].name).toBe('Alpha');
        expect(calls[0].prefix).toBe('');
        expect(calls[0].namespaceUri).toBeUndefined();
    });
    it('kills first-element namespace conditional mutations', () => {
        // Arrange
        const schema: PdfXmpSchemaStub = new PdfXmpSchemaStub();
        const writer: _XmlWriter = new _XmlWriter();
        const calls: XmlCall[] = [];
        const originalMethods: XmlWriterMethods = configureWriter(writer, calls);
        schema._properties.set('dc:Alpha', 'first');
        schema._properties.set('pdf:Beta', 'second');
        // Act
        schema._writeXml(writer);
        restoreWriter(writer, originalMethods);
        // Assert
        expect(calls.length).toBe(2);
        expect(calls[0].name).toBe('Alpha');
        expect(calls[0].prefix).toBe('dc');
        expect(calls[0].namespaceUri).toBe(dcNamespace);
        expect(calls[1].name).toBe('Beta');
        expect(calls[1].prefix).toBe('pdf');
        expect(calls[1].namespaceUri).toBeUndefined();
    });
    it('kills empty-array branch mutations and preserves first-element state', () => {
        const schema: PdfXmpSchemaStub = new PdfXmpSchemaStub();
        const writer: _XmlWriter = new _XmlWriter();
        const calls: XmlCall[] = [];
        const originalMethods: XmlWriterMethods = configureWriter(writer, calls);
        schema._properties.set('dc:Alpha', []);
        schema._properties.set('dc:Beta', 'written');
        schema._writeXml(writer);
        restoreWriter(writer, originalMethods);
        expect(calls.length).toBe(1);
        expect(calls[0].method).toBe('element');
        expect(calls[0].name).toBe('Beta');
        expect(calls[0].namespaceUri).toBe(dcNamespace);
    });
    it('kills thumbnail logical-operator and RDF-prefix mutations', () => {
        const schema: PdfXmpSchemaStub = new PdfXmpSchemaStub();
        const writer: _XmlWriter = new _XmlWriter();
        const calls: XmlCall[] = [];
        const originalMethods: XmlWriterMethods = configureWriter(writer, calls);
        schema._properties.set('dc:subject', [{ width: 1, height: 2, format: 'JPEG', image: 'data' }]);
        schema._properties.set('xap:Thumbnails', [{ width: 10, height: 20, format: 'JPEG', image: 'image-data' }]);
        schema._writeXml(writer);
        restoreWriter(writer, originalMethods);
        expect(calls[2].method).toBe('element');
        expect(calls[2].name).toBe('li');
        expect(calls[2].value).toBe('[object Object]');
        expect(calls[7].method).toBe('start');
        expect(calls[7].name).toBe('li');
        expect(calls[7].prefix).toBe('rdf');
        expect(calls[7].namespaceUri).toBe(rdfNamespace);
        expect(calls[8].method).toBe('attribute');
        expect(calls[8].name).toBe('parseType');
        expect(calls[8].value).toBe('Resource');
        expect(calls[8].prefix).toBe('rdf');
        expect(calls[8].namespaceUri).toBe(rdfNamespace);
        expect(calls[9].name).toBe('Width');
        expect(calls[9].value).toBe('10');
        expect(calls[9].prefix).toBe('xap');
        expect(calls[9].namespaceUri).toBe(xapNamespace);
    });
    it('kills language XML namespace and RDF-prefix mutations', () => {
        const schema: PdfXmpSchemaStub = new PdfXmpSchemaStub();
        const writer: _XmlWriter = new _XmlWriter();
        const calls: XmlCall[] = [];
        const originalMethods: XmlWriterMethods = configureWriter(writer, calls);
        schema._properties.set('dc:title', { 'x-default': 'Default title' });
        schema._writeXml(writer);
        restoreWriter(writer, originalMethods);
        expect(calls.length).toBe(8);
        expect(calls[2].method).toBe('start');
        expect(calls[2].name).toBe('li');
        expect(calls[2].prefix).toBe('rdf');
        expect(calls[2].namespaceUri).toBe(rdfNamespace);
        expect(calls[3].method).toBe('attribute');
        expect(calls[3].name).toBe('lang');
        expect(calls[3].value).toBe('x-default');
        expect(calls[3].prefix).toBe('xml');
        expect(calls[3].namespaceUri).toBe(xmlNamespace);
        expect(calls[4].method).toBe('text');
        expect(calls[4].value).toBe('Default title');
    });
    it('kills all three post-write first-element assignment mutations', () => {
        const schema: PdfXmpSchemaStub = new PdfXmpSchemaStub();
        const writer: _XmlWriter = new _XmlWriter();
        const calls: XmlCall[] = [];
        const originalMethods: XmlWriterMethods = configureWriter(writer, calls);
        schema._properties.set('dc:Array', ['value']);
        schema._properties.set('dc:Language', { 'en-US': 'value' });
        schema._properties.set('dc:Scalar', 'value');
        schema._properties.set('dc:Trailing', 'value');
        schema._writeXml(writer);
        restoreWriter(writer, originalMethods);
        expect(calls[0].namespaceUri).toBe(dcNamespace);
        expect(calls[5].name).toBe('Language');
        expect(calls[5].namespaceUri).toBeUndefined();
        expect(calls[13].name).toBe('Scalar');
        expect(calls[13].namespaceUri).toBeUndefined();
        expect(calls[14].name).toBe('Trailing');
        expect(calls[14].namespaceUri).toBeUndefined();
    });
});
class PdfXmpSchemaHarness extends PdfXmpSchema {
    get schemaType(): PdfXmpSchemaType {
        return 0 as unknown as PdfXmpSchemaType;
    }
}
interface PdfXmpSchemaPrivateMethods {
    _getArrayType(key: string): string;
    _getNamespaceUriForPrefix(prefix: string): string;
}
function createSchemaHarness(): PdfXmpSchemaPrivateMethods {
    const schema: PdfXmpSchema = new PdfXmpSchemaHarness();
    return schema as unknown as PdfXmpSchemaPrivateMethods;
}
describe('PdfXmpSchema array type and namespace URI mutation coverage', () => {
    it('returns Bag for every explicitly supported bag property', () => {
        // Arrange
        const schema: PdfXmpSchemaPrivateMethods = createSchemaHarness();
        // Act
        const contributorType: string = schema._getArrayType('dc:contributor');
        const publisherType: string = schema._getArrayType('dc:publisher');
        const relationType: string = schema._getArrayType('dc:relation');
        const subjectType: string = schema._getArrayType('dc:subject');
        const typeType: string = schema._getArrayType('dc:type');
        const ownerType: string = schema._getArrayType('xmpRights:Owner');
        const jobReferenceType: string = schema._getArrayType('xmpBJ:JobRef');
        const fontsType: string = schema._getArrayType('xmpTPg:Fonts');
        const thumbnailsType: string = schema._getArrayType('xap:Thumbnails');
        // Assert
        expect(contributorType).toBe('Bag');
        expect(publisherType).toBe('Bag');
        expect(relationType).toBe('Bag');
        expect(subjectType).toBe('Bag');
        expect(typeType).toBe('Bag');
        expect(ownerType).toBe('Bag');
        expect(jobReferenceType).toBe('Bag');
        expect(fontsType).toBe('Bag');
        expect(thumbnailsType).toBe('Bag');
    });
    it('returns Seq for every explicitly supported sequence property', () => {
        // Arrange
        const schema: PdfXmpSchemaPrivateMethods = createSchemaHarness();
        // Act
        const creatorType: string = schema._getArrayType('dc:creator');
        const dateType: string = schema._getArrayType('dc:date');
        const plateNamesType: string = schema._getArrayType('xmpTPg:PlateNames');
        const colorantsType: string = schema._getArrayType('xmpTPg:Colorants');
        // Assert
        expect(creatorType).toBe('Seq');
        expect(dateType).toBe('Seq');
        expect(plateNamesType).toBe('Seq');
        expect(colorantsType).toBe('Seq');
    });
    it('returns Bag for an unsupported property', () => {
        // Arrange
        const schema: PdfXmpSchemaPrivateMethods = createSchemaHarness();
        // Act
        const arrayType: string = schema._getArrayType('custom:Unsupported');
        // Assert
        expect(arrayType).toBe('Bag');
    });
    it('returns the PDF namespace URI for the pdf prefix', () => {
        // Arrange
        const schema: PdfXmpSchemaPrivateMethods = createSchemaHarness();
        // Act
        const namespaceUri: string = schema._getNamespaceUriForPrefix('pdf');
        // Assert
        expect(namespaceUri).toBe('http://ns.adobe.com/pdf/1.3/');
    });
    it('returns the XMP rights namespace URI for the xmpRights prefix', () => {
        // Arrange
        const schema: PdfXmpSchemaPrivateMethods = createSchemaHarness();
        // Act
        const namespaceUri: string = schema._getNamespaceUriForPrefix('xmpRights');
        // Assert
        expect(namespaceUri).toBe('http://ns.adobe.com/xap/1.0/rights/');
    });
});
