import { PdfXmpMetadata } from '../src/pdf/core/xmp/pdf-xmp-metadata';
import { _XmlWriter } from '../src/pdf/core/import-export/xml-writer';
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
import { PdfXmpSchema } from '../src/pdf/core/xmp/pdf-xmp-schema';
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