/* eslint-disable @typescript-eslint/no-explicit-any */
import { Save } from '@syncfusion/ej2-file-utils';
import { _PdfStream } from "../src/pdf/core/base-stream";
import { _PdfFlateStream } from "../src/pdf/core/flate-stream";
import { PdfCjkFontFamily, PdfCjkStandardFont, PdfFontFamily, PdfFontStyle, PdfStandardFont, PdfTrueTypeFont } from "../src/pdf/core/fonts/pdf-standard-font";
import { PdfTextBoxField } from "../src/pdf/core/form/field";
import { PdfAnnotationExportSettings, PdfDocument, PdfFormFieldExportSettings, PdfPageSettings } from "../src/pdf/core/pdf-document";
import { PdfDocumentInformation } from "../src/pdf/core/pdf-document-information";
import { _PdfNamedDestinationCollection, PdfBookmark, PdfBookmarkBase, PdfNamedDestination } from "../src/pdf/core/pdf-outline";
import { PdfDestination, PdfPage } from "../src/pdf/core/pdf-page";
import { _Linearization } from "../src/pdf/core/pdf-parser";
import { _PdfDictionary, _PdfReference } from "../src/pdf/core/pdf-primitives";
import { PdfSection } from "../src/pdf/core/pdf-section";
import { PdfDocumentTemplate, PdfSecurityOptions } from "../src/pdf/core/pdf-type";
import { PdfCustomMetadata } from "../src/pdf/core/xmp/pdf-custom-metadata";
import { PdfXmpMetadata } from "../src/pdf/core/xmp/pdf-xmp-metadata";
import { _FdfDocument } from '../src/pdf/core/import-export/fdf-document';
import { DataFormat, PdfEncryptionType, PdfPermissionFlag, PdfTemplateLayerMode } from '../src/pdf/core/enumerator';
import { _XfdfDocument } from '../src/pdf/core/import-export/xfdf-document';
import { _JsonDocument } from '../src/pdf/core/import-export/json-document';
import { _XmlDocument } from '../src/pdf/core/import-export/xml-document';
import { PdfForm } from '../src/pdf/core/form/form';
describe('1041642 - PdfDocument constructor initialization', () => {
    it('1041642 - initializes constructor signatures, flags and collections', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        expect(internalDocument._headerSignature).toEqual(
            new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d])
        );
        expect(internalDocument._headerSignature.length).toBe(5);
        expect(internalDocument._endObjSignature).toEqual(
            new Uint8Array([0x65, 0x6e, 0x64, 0x6f, 0x62, 0x6a])
        );
        expect(internalDocument._endObjSignature.length).toBe(6);
        expect(document.isEncrypted).toBeFalsy();
        expect(document.isUserPassword).toBeFalsy();
        expect(internalDocument._hasUserPasswordOnly).toBeFalsy();
        expect(internalDocument._encryptOnlyAttachment).toBeFalsy();
        expect(internalDocument._encryptMetaData).toBeFalsy();
        expect(internalDocument._isExport).toBeFalsy();
        expect(internalDocument._allowCustomData).toBeFalsy();
        expect(internalDocument._isSplitDocument).toBeFalsy();
        expect(internalDocument._printLayer).toEqual([]);
        expect(internalDocument._printLayer.length).toBe(0);
        document.destroy();
    });
    it('1041642 - initializes new document stream and version', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        expect(document._stream).toBeDefined();
        expect(document._stream.end).toBe(0);
        expect(document._stream.start).toBe(0);
        expect(document._stream.position).toBe(0);
        expect(internalDocument._version).toBe('1.4');
        expect(document._crossReference._version).toBe('1.4');
        expect(document.fileStructure.isIncrementalUpdate).toBeFalsy();
        document.destroy();
    });
    it('1041642 - creates catalog reference object identifier with separator', () => {
        const document: PdfDocument = new PdfDocument();
        const catalogDictionary: _PdfDictionary = document._crossReference._root;
        const catalogReference: _PdfReference =
            document._crossReference._trailer.getRaw('Root') as _PdfReference;
        const expectedObjectIdentifier: string =
            catalogReference.objectNumber + ' ' + catalogReference.generationNumber;
        expect(catalogDictionary.objId).toBe(expectedObjectIdentifier);
        expect(catalogDictionary.objId).toContain(' ');
        expect(catalogDictionary.objId).not.toBe(
            catalogReference.objectNumber.toString() +
            catalogReference.generationNumber.toString()
        );
        document.destroy();
    });
    it('1041642 - creates top pages dictionary with empty Kids collection', () => {
        const document: PdfDocument = new PdfDocument();
        const catalogDictionary: _PdfDictionary = document._crossReference._root;
        const topPagesReference: _PdfReference =
            catalogDictionary.getRaw('Pages') as _PdfReference;
        const topPagesDictionary: _PdfDictionary =
            document._crossReference._fetch(topPagesReference) as _PdfDictionary;
        const pageKids: _PdfReference[] = topPagesDictionary.get('Kids');
        expect(topPagesDictionary.has('Kids')).toBeTruthy();
        expect(Array.isArray(pageKids)).toBeTruthy();
        expect(pageKids.length).toBe(0);
        expect(topPagesDictionary.has('')).toBeFalsy();
        expect(topPagesDictionary.get('Count')).toBe(0);
        expect(topPagesDictionary.get('Type').name).toBe('Pages');
        document.destroy();
    });
});
describe('1041642 - PdfDocument constructor parse recovery', () => {
    it('1041642 - rethrows errors other than XRefParseException', () => {
        const originalCheckHeader: () => void =
            PdfDocument.prototype._checkHeader;
        const originalParse: (recoveryMode: boolean) => void =
            PdfDocument.prototype._parse;
        const parseModes: boolean[] = [];
        const sourceData: Uint8Array = new Uint8Array([
            0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34,
            0x0a, 0x73, 0x74, 0x61, 0x72, 0x74, 0x78, 0x72,
            0x65, 0x66, 0x0a, 0x30, 0x0a
        ]);
        PdfDocument.prototype._checkHeader = function (): void {
            (this as any)._version = '1.4';
        };
        PdfDocument.prototype._parse = function (recoveryMode: boolean): void {
            parseModes.push(recoveryMode);
            if (!recoveryMode) {
                const parseError: Error = new Error('Unexpected parse failure.');
                parseError.name = 'FormatError';
                throw parseError;
            }
        };
        expect(() => new PdfDocument(sourceData)).toThrowError(
            'Unexpected parse failure.'
        );
        expect(parseModes.length).toBe(1);
        expect(parseModes[0]).toBeFalsy();
        PdfDocument.prototype._checkHeader = originalCheckHeader;
        PdfDocument.prototype._parse = originalParse;
        expect(PdfDocument.prototype._checkHeader).toBe(originalCheckHeader);
        expect(PdfDocument.prototype._parse).toBe(originalParse);
    });
});
describe('1041642 - _allowImportCustomData accessor', () => {
    it('1041642 - gets and sets custom data using the expected property name', () => {
        const document: PdfDocument = new PdfDocument();
        document._allowImportCustomData = true;
        expect(document._allowImportCustomData).toBeTruthy();
        expect((document as any)._allowCustomData).toBeTruthy();
        expect((document as any)['']).toBeUndefined();
        document._allowImportCustomData = false;
        expect(document._allowImportCustomData).toBeFalsy();
        expect((document as any)._allowCustomData).toBeFalsy();
        expect((document as any)['']).toBeUndefined();
        document.destroy();
    });
});
describe('1041642 - PdfDocument _linearization getter', () => {
    it('1041642 - creates and caches linearization when cache is empty', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        internalDocument._linear = undefined;
        const firstLinearization: _Linearization = document._linearization;
        const secondLinearization: _Linearization = document._linearization;
        expect(firstLinearization).toBeDefined();
        expect(firstLinearization instanceof _Linearization).toBeTruthy();
        expect(firstLinearization.isValid).toBeFalsy();
        expect(internalDocument._linear).toBe(firstLinearization);
        expect(secondLinearization).toBe(firstLinearization);
        document.destroy();
    });
    it('1041642 - returns the existing cached linearization', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const cachedLinearization: _Linearization =
            new _Linearization(document._stream);
        internalDocument._linear = cachedLinearization;
        const result: _Linearization = document._linearization;
        expect(result).toBe(cachedLinearization);
        expect(internalDocument._linear).toBe(cachedLinearization);
        document.destroy();
    });
});
describe('1041642 PdfDocument _linearization getter', () => {
    it('1041642 returns existing cached linearization', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const cachedLinearization: any = { isValid: true };
        internalDocument._linear = cachedLinearization;
        const result: _Linearization = document._linearization;
        expect(result).toBe(cachedLinearization);
        expect(internalDocument._linear).toBe(cachedLinearization);
        document.destroy();
    });
});
describe('1041642 PdfDocument _startXRef getter', () => {
    it('1041642 finds startxref using the backward search step', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const documentBytes: Uint8Array = new Uint8Array(2040);
        const startXRefText: string = 'startxref\n321\n';
        const startXRefPosition: number = 2026;
        for (let index: number = 0; index < startXRefText.length; index++) {
            documentBytes[startXRefPosition + index] =
                startXRefText.charCodeAt(index);
        }
        internalDocument._stream = new _PdfStream(documentBytes);
        internalDocument._linear = { isValid: false };
        const startXRef: number = document._startXRef;
        expect(internalDocument._linear.isValid).toBeFalsy();
        expect(startXRef).toBe(321);
        document.destroy();
    });
    it('1041642 resets a negative search position to zero', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const startXRefText: string = 'startxref\n45\n';
        const documentBytes: Uint8Array =
            new Uint8Array(startXRefText.length);
        for (let index: number = 0; index < startXRefText.length; index++) {
            documentBytes[index] = startXRefText.charCodeAt(index);
        }
        internalDocument._stream = new _PdfStream(documentBytes);
        internalDocument._linear = { isValid: false };
        const startXRef: number = document._startXRef;
        expect(internalDocument._stream.start).toBe(0);
        expect(startXRef).toBe(45);
        document.destroy();
    });
    it('1041642 does not parse a value when startxref is not found', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const documentText: string = '         25';
        const documentBytes: Uint8Array =
            new Uint8Array(documentText.length);
        for (let index: number = 0; index < documentText.length; index++) {
            documentBytes[index] = documentText.charCodeAt(index);
        }
        internalDocument._stream = new _PdfStream(documentBytes);
        internalDocument._linear = { isValid: false };
        const startXRef: number = document._startXRef;
        expect(startXRef).toBe(0);
        document.destroy();
    });
    it('1041642 stops reading when the character is below numeric range', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const documentBytes: Uint8Array = new Uint8Array([
            0x73, 0x74, 0x61, 0x72, 0x74,
            0x78, 0x72, 0x65, 0x66,
            0x0a,
            0x01,
            0x3a
        ]);
        internalDocument._stream = new _PdfStream(documentBytes);
        internalDocument._linear = { isValid: false };
        const startXRef: number = document._startXRef;
        expect(startXRef).toBe(0);
        expect(internalDocument._stream.position).toBe(11);
        document.destroy();
    });
});
describe('1041642 - PdfDocument _startXRef getter', () => {
    it('1041642 - skips startxref parsing when signature is not found', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const documentText: string = '         \n25';
        const documentBytes: Uint8Array =
            new Uint8Array(documentText.length);
        for (let index: number = 0; index < documentText.length; index++) {
            documentBytes[index] = documentText.charCodeAt(index);
        }
        internalDocument._stream = new _PdfStream(documentBytes);
        internalDocument._linear = new _Linearization(
            internalDocument._stream
        );
        const startXRef: number = document._startXRef;
        expect(internalDocument._linear.isValid).toBeFalsy();
        expect(startXRef).toBe(0);
        document.destroy();
    });
    it('1041642 - stops reading startxref at value below numeric range', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const startXRefPrefix: string = 'startxref\n';
        const documentBytes: Uint8Array = new Uint8Array([
            0x73, 0x74, 0x61, 0x72, 0x74, 0x78, 0x72, 0x65, 0x66,
            0x0a, 0x01, 0x32, 0x35
        ]);
        internalDocument._stream = new _PdfStream(documentBytes);
        internalDocument._linear = new _Linearization(
            internalDocument._stream
        );
        const startXRef: number = document._startXRef;
        expect(startXRefPrefix.length).toBe(10);
        expect(internalDocument._linear.isValid).toBeFalsy();
        expect(startXRef).toBe(0);
        expect(internalDocument._stream.position).toBe(11);
        document.destroy();
    });
    it('1041642 - includes character at lower numeric boundary', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const documentText: string = 'startxref\n12 3X';
        const documentBytes: Uint8Array =
            new Uint8Array(documentText.length);
        for (let index: number = 0; index < documentText.length; index++) {
            documentBytes[index] = documentText.charCodeAt(index);
        }
        internalDocument._stream = new _PdfStream(documentBytes);
        internalDocument._linear = new _Linearization(
            internalDocument._stream
        );
        const startXRef: number = document._startXRef;
        expect(internalDocument._linear.isValid).toBeFalsy();
        expect(startXRef).toBe(12);
        expect(internalDocument._stream.position).toBe(15);
        document.destroy();
    });
});
describe('1041642 PdfDocument _getDecompressedStreamBytes', () => {
    it('1041642 returns complete bytes for a regular PDF stream', () => {
        const document: PdfDocument = new PdfDocument();
        const sourceBytes: Uint8Array = new Uint8Array([10, 20, 30, 40]);
        const stream: _PdfStream = new _PdfStream(sourceBytes);
        stream.position = 2;
        const result: Uint8Array =
            document._getDecompressedStreamBytes(stream);
        expect(result).toBe(stream.bytes);
        expect(result).toEqual(sourceBytes);
        expect(result.length).toBe(4);
        expect(stream.position).toBe(2);
        document.destroy();
    });
    it('1041642 uses buffer length when flate stream bytes are unavailable', () => {
        const document: PdfDocument = new PdfDocument();
        const compressedBytes: Uint8Array = new Uint8Array([
            0x78, 0x9c, 0x73, 0x74, 0x72,
            0x06, 0x00, 0x01, 0x8d, 0x00, 0xc7
        ]);
        const sourceStream: _PdfStream =
            new _PdfStream(compressedBytes);
        const flateStream: _PdfFlateStream =
            new _PdfFlateStream(sourceStream, compressedBytes.length);
        const internalFlateStream: any = flateStream as any;
        const decompressedBytes: Uint8Array = flateStream.getBytes(3);
        const decompressedLength: number = decompressedBytes.length;
        flateStream.reset();
        internalFlateStream.bytes = undefined;
        internalFlateStream.bufferLength = decompressedLength;
        const result: Uint8Array =
            document._getDecompressedStreamBytes(flateStream);
        expect(decompressedLength).toBe(3);
        expect(internalFlateStream.bytes).toBeUndefined();
        expect(internalFlateStream.bufferLength).toBe(3);
        expect(result).toEqual(new Uint8Array([65, 66, 67]));
        expect(result.length).toBe(3);
        document.destroy();
    });
});
describe('1041642 PdfDocument _getMetadataValue', () => {
    it('1041642 returns existing cached XMP metadata', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const cachedMetadata: PdfXmpMetadata = new PdfXmpMetadata();
        internalDocument._xmpMetadata = cachedMetadata;
        const result: PdfXmpMetadata = document._getMetadataValue();
        expect(result).toBe(cachedMetadata);
        expect(internalDocument._xmpMetadata).toBe(cachedMetadata);
        document.destroy();
    });
    it('1041642 creates default metadata when catalog is unavailable', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        internalDocument._catalog = undefined;
        internalDocument._xmpMetadata = undefined;
        const result: PdfXmpMetadata = document._getMetadataValue();
        expect(result).toBeDefined();
        expect(result instanceof PdfXmpMetadata).toBeTruthy();
        expect(internalDocument._xmpMetadata).toBe(result);
        document.destroy();
    });
    it('1041642 reads metadata from a direct PDF stream', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const sourceMetadata: PdfXmpMetadata = new PdfXmpMetadata();
        const originalGetBytes:
            (stream: any) => Uint8Array =
            document._getDecompressedStreamBytes;
        let getBytesCallCount: number = 0;
        sourceMetadata._serializeToStream();
        document._catalog._catalogDictionary.update(
            'Metadata',
            sourceMetadata._xmpStream
        );
        document._getDecompressedStreamBytes =
            function (stream: any): Uint8Array {
                getBytesCallCount++;
                return originalGetBytes.call(document, stream);
            };
        const result: PdfXmpMetadata = document._getMetadataValue();
        expect(result).toBeDefined();
        expect(result instanceof PdfXmpMetadata).toBeTruthy();
        expect(getBytesCallCount).toBe(1);
        expect(internalDocument._xmpMetadata).toBe(result);
        document._getDecompressedStreamBytes = originalGetBytes;
        sourceMetadata._destroy();
        document.destroy();
    });
    it('1041642 ignores referenced metadata when fetched value is not a stream', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const metadataReference: _PdfReference =
            document._crossReference._getNextReference();
        const metadataDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        const validMetadata: PdfXmpMetadata = new PdfXmpMetadata();
        const originalGetBytes:
            (stream: any) => Uint8Array =
            document._getDecompressedStreamBytes;
        let getBytesCallCount: number = 0;
        validMetadata._serializeToStream();
        document._crossReference._cacheMap.set(
            metadataReference,
            metadataDictionary
        );
        document._catalog._catalogDictionary.update(
            'Metadata',
            metadataReference
        );
        document._getDecompressedStreamBytes =
            function (_stream: any): Uint8Array {
                getBytesCallCount++;
                return validMetadata._xmpStream.bytes;
            };
        const result: PdfXmpMetadata = document._getMetadataValue();
        expect(result).toBeDefined();
        expect(result instanceof PdfXmpMetadata).toBeTruthy();
        expect(getBytesCallCount).toBe(0);
        expect(internalDocument._xmpMetadata).toBe(result);
        document._getDecompressedStreamBytes = originalGetBytes;
        validMetadata._destroy();
        document.destroy();
    });
    it('1041642 ignores direct metadata value when it is not a stream', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const metadataDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        const validMetadata: PdfXmpMetadata = new PdfXmpMetadata();
        const originalGetBytes:
            (stream: any) => Uint8Array =
            document._getDecompressedStreamBytes;
        let getBytesCallCount: number = 0;
        validMetadata._serializeToStream();
        document._catalog._catalogDictionary.update(
            'Metadata',
            metadataDictionary
        );
        document._getDecompressedStreamBytes =
            function (_stream: any): Uint8Array {
                getBytesCallCount++;
                return validMetadata._xmpStream.bytes;
            };
        const result: PdfXmpMetadata = document._getMetadataValue();
        expect(result).toBeDefined();
        expect(result instanceof PdfXmpMetadata).toBeTruthy();
        expect(getBytesCallCount).toBe(0);
        expect(internalDocument._xmpMetadata).toBe(result);
        document._getDecompressedStreamBytes = originalGetBytes;
        validMetadata._destroy();
        document.destroy();
    });
});
describe('1041642 PdfDocument bookmarks getter', () => {
    it('1041642 ignores Outlines when dictionary value is unavailable', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        document._catalog._catalogDictionary.update('Outlines', null);
        internalDocument._bookmarkBase = undefined;
        const result: PdfBookmarkBase = document.bookmarks;
        expect(
            document._catalog._catalogDictionary.has('Outlines')
        ).toBeTruthy();
        expect(
            document._catalog._catalogDictionary.get('Outlines')
        ).toBeNull();
        expect(result).toBeUndefined();
        expect(internalDocument._bookmarkBase).toBeUndefined();
        document.destroy();
    });
    it('1041642 does not reproduce bookmark tree without First entry', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const outlinesDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        const originalReproduceTree: () => void =
            PdfBookmarkBase.prototype._reproduceTree;
        let reproduceTreeCallCount: number = 0;
        document._catalog._catalogDictionary.update(
            'Outlines',
            outlinesDictionary
        );
        internalDocument._bookmarkBase = undefined;
        PdfBookmarkBase.prototype._reproduceTree = function (): void {
            reproduceTreeCallCount++;
        };
        const result: PdfBookmarkBase = document.bookmarks;
        expect(outlinesDictionary.has('First')).toBeFalsy();
        expect(result).toBeDefined();
        expect(result instanceof PdfBookmarkBase).toBeTruthy();
        expect(reproduceTreeCallCount).toBe(0);
        expect(internalDocument._bookmarkBase).toBe(result);
        PdfBookmarkBase.prototype._reproduceTree = originalReproduceTree;
        expect(PdfBookmarkBase.prototype._reproduceTree).toBe(
            originalReproduceTree
        );
        document.destroy();
    });
    it('1041642 enables catalog update when creating Outlines', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        document._crossReference._allowCatalog = false;
        internalDocument._bookmarkBase = undefined;
        const result: PdfBookmarkBase = document.bookmarks;
        const outlinesReference: _PdfReference =
            document._catalog._catalogDictionary.getRaw(
                'Outlines'
            ) as _PdfReference;
        const outlinesDictionary: _PdfDictionary =
            document._crossReference._fetch(
                outlinesReference
            ) as _PdfDictionary;
        expect(result).toBeDefined();
        expect(result instanceof PdfBookmarkBase).toBeTruthy();
        expect(
            document._catalog._catalogDictionary.has('Outlines')
        ).toBeTruthy();
        expect(outlinesReference).toBeDefined();
        expect(outlinesReference instanceof _PdfReference).toBeTruthy();
        expect(outlinesDictionary).toBeDefined();
        expect(result._reference).toBe(outlinesReference);
        expect(document._crossReference._allowCatalog).toBeTruthy();
        document.destroy();
    });
});
describe('1041642 PdfDocument template getter', () => {
    it('1041642 creates template for a new document', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        internalDocument._template = undefined;
        const result: PdfDocumentTemplate = document.template;
        expect(internalDocument._isLoaded).toBeFalsy();
        expect(result).toBeDefined();
        expect(result).not.toBeNull();
        expect(internalDocument._template).toBe(result);
        document.destroy();
    });
    it('1041642 returns existing template for a loaded document', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const existingTemplate: PdfDocumentTemplate = {};
        internalDocument._isLoaded = true;
        internalDocument._template = existingTemplate;
        const result: PdfDocumentTemplate = document.template;
        expect(internalDocument._isLoaded).toBeTruthy();
        expect(result).toBe(existingTemplate);
        expect(internalDocument._template).toBe(existingTemplate);
        document.destroy();
    });
});
describe('1041642 PdfDocument getRevisions', () => {
    it('1041642 returns empty revisions when start cross-reference cache is unavailable', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalFind: any = internalDocument._find;
        let findCallCount: number = 0;
        internalDocument._isLoaded = true;
        internalDocument._revisions = undefined;
        internalDocument._startXRefParsedCache = undefined;
        internalDocument._find = (
            _stream: _PdfStream,
            _signature: Uint8Array,
            _limit: number,
            _backwards: boolean
        ): boolean => {
            findCallCount++;
            return false;
        };
        const result: number[] = document.getRevisions();
        expect(result).toEqual([]);
        expect(findCallCount).toBe(0);
        expect(internalDocument._revisions).toBe(result);
        internalDocument._find = originalFind;
        expect(internalDocument._find).toBe(originalFind);
        document.destroy();
    });
    it('1041642 calculates remaining bytes by subtracting stream position', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalFind: any = internalDocument._find;
        const sourceBytes: Uint8Array = new Uint8Array(10);
        let receivedLimit: number = 0;
        let findCallCount: number = 0;
        internalDocument._isLoaded = true;
        internalDocument._revisions = undefined;
        internalDocument._stream = new _PdfStream(sourceBytes);
        internalDocument._startXRefParsedCache = [3];
        internalDocument._find = (
            _stream: _PdfStream,
            _signature: Uint8Array,
            limit: number,
            _backwards: boolean
        ): boolean => {
            findCallCount++;
            receivedLimit = limit;
            return false;
        };
        const result: number[] = document.getRevisions();
        expect(result).toEqual([]);
        expect(findCallCount).toBe(1);
        expect(receivedLimit).toBe(7);
        internalDocument._find = originalFind;
        expect(internalDocument._find).toBe(originalFind);
        document.destroy();
    });
    it('1041642 skips EOF search when remaining bytes are shorter than signature', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalFind: any = internalDocument._find;
        const sourceBytes: Uint8Array = new Uint8Array(4);
        let findCallCount: number = 0;
        internalDocument._isLoaded = true;
        internalDocument._revisions = undefined;
        internalDocument._stream = new _PdfStream(sourceBytes);
        internalDocument._startXRefParsedCache = [1];
        internalDocument._find = (
            _stream: _PdfStream,
            _signature: Uint8Array,
            _limit: number,
            _backwards: boolean
        ): boolean => {
            findCallCount++;
            return false;
        };
        const result: number[] = document.getRevisions();
        expect(result).toEqual([]);
        expect(findCallCount).toBe(0);
        internalDocument._find = originalFind;
        expect(internalDocument._find).toBe(originalFind);
        document.destroy();
    });
    it('1041642 searches EOF signature in forward direction', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalFind: any = internalDocument._find;
        const sourceBytes: Uint8Array = new Uint8Array(10);
        let receivedBackwards: boolean = true;
        let findCallCount: number = 0;
        internalDocument._isLoaded = true;
        internalDocument._revisions = undefined;
        internalDocument._stream = new _PdfStream(sourceBytes);
        internalDocument._startXRefParsedCache = [0];
        internalDocument._find = (
            _stream: _PdfStream,
            _signature: Uint8Array,
            _limit: number,
            backwards: boolean
        ): boolean => {
            findCallCount++;
            receivedBackwards = backwards;
            return false;
        };
        const result: number[] = document.getRevisions();
        expect(result).toEqual([]);
        expect(findCallCount).toBe(1);
        expect(receivedBackwards).toBeFalsy();
        internalDocument._find = originalFind;
        expect(internalDocument._find).toBe(originalFind);
        document.destroy();
    });
    it('1041642 does not read after EOF marker at stream end', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const sourceBytes: Uint8Array = new Uint8Array([
            0x25, 0x25, 0x45, 0x4f, 0x46
        ]);
        const stream: _PdfStream = new _PdfStream(sourceBytes);
        const internalStream: any = stream as any;
        const originalFind: any = internalDocument._find;
        const originalGetByte: any = internalStream.getByte;
        let findCallCount: number = 0;
        let getByteCallCount: number = 0;
        internalDocument._isLoaded = true;
        internalDocument._revisions = undefined;
        internalDocument._stream = stream;
        internalDocument._startXRefParsedCache = [0];
        internalDocument._find = (
            targetStream: _PdfStream,
            signature: Uint8Array,
            limit: number,
            backwards: boolean
        ): boolean => {
            findCallCount++;
            expect(targetStream).toBe(stream);
            expect(signature).toEqual(
                new Uint8Array([
                    0x25, 0x25, 0x45, 0x4f, 0x46
                ])
            );
            expect(limit).toBe(5);
            expect(backwards).toBeFalsy();
            return true;
        };
        internalStream.getByte = function (): number {
            getByteCallCount++;
            return originalGetByte.call(stream);
        };
        const result: number[] = document.getRevisions();
        expect(findCallCount).toBe(1);
        expect(result).toEqual([5]);
        expect(result.length).toBe(1);
        expect(result[0]).toBe(5);
        expect(stream.position).toBe(5);
        expect(stream.end).toBe(5);
        expect(getByteCallCount).toBe(0);
        expect(internalDocument._revisions).toBe(result);
        internalDocument._find = originalFind;
        internalStream.getByte = originalGetByte;
        expect(internalDocument._find).toBe(originalFind);
        expect(internalStream.getByte).toBe(originalGetByte);
        document.destroy();
    });
    it('1041642 handles line feed after EOF without reading following byte', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const sourceBytes: Uint8Array = new Uint8Array([
            0x25, 0x25, 0x45, 0x4f, 0x46,
            0x0a, 0x58
        ]);
        internalDocument._isLoaded = true;
        internalDocument._revisions = undefined;
        internalDocument._stream = new _PdfStream(sourceBytes);
        internalDocument._startXRefParsedCache = [0];
        const result: number[] = document.getRevisions();
        expect(result).toEqual([6]);
        expect(internalDocument._stream.position).toBe(6);
        expect(internalDocument._stream.getByte()).toBe(0x58);
        document.destroy();
    });
    it('1041642 does not increment revision position for non-line-feed after carriage return', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const sourceBytes: Uint8Array = new Uint8Array([
            0x25, 0x25, 0x45, 0x4f, 0x46,
            0x0d, 0x58
        ]);
        internalDocument._isLoaded = true;
        internalDocument._revisions = undefined;
        internalDocument._stream = new _PdfStream(sourceBytes);
        internalDocument._startXRefParsedCache = [0];
        const result: number[] = document.getRevisions();
        expect(result).toEqual([6]);
        expect(internalDocument._stream.position).toBe(7);
        document.destroy();
    });
    it('1041642 does not read after carriage return at stream end', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const sourceBytes: Uint8Array = new Uint8Array([
            0x25, 0x25, 0x45, 0x4f, 0x46,
            0x0d
        ]);
        const stream: _PdfStream = new _PdfStream(sourceBytes);
        const internalStream: any = stream as any;
        const originalGetByte: any = internalStream.getByte;
        let getByteCallCount: number = 0;
        internalStream.getByte = function (): number {
            getByteCallCount++;
            return originalGetByte.call(stream);
        };
        internalDocument._isLoaded = true;
        internalDocument._revisions = undefined;
        internalDocument._stream = stream;
        internalDocument._startXRefParsedCache = [0];
        const result: number[] = document.getRevisions();
        expect(result).toEqual([6]);
        expect(stream.position).toBe(6);
        expect(stream.end).toBe(6);
        expect(getByteCallCount).toBe(1);
        internalStream.getByte = originalGetByte;
        expect(internalStream.getByte).toBe(originalGetByte);
        document.destroy();
    });
    it('1041642 does not treat another character as line feed', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const sourceBytes: Uint8Array = new Uint8Array([
            0x25, 0x25, 0x45, 0x4f, 0x46,
            0x58
        ]);
        internalDocument._isLoaded = true;
        internalDocument._revisions = undefined;
        internalDocument._stream = new _PdfStream(sourceBytes);
        internalDocument._startXRefParsedCache = [0];
        const result: number[] = document.getRevisions();
        expect(result).toEqual([5]);
        expect(internalDocument._stream.position).toBe(6);
        document.destroy();
    });
});
describe('1041642 PdfDocument embedFont TrueType styles', () => {
    const fontData: string =
        'AAEAAAAKAIAAAwAgT1MvMkUhRP0AAAEoAAAAYGNtYXAADACUAAABkAAAADRnbHlmAvU7mwAAAcwAAAAaaGVhZDAbRNoAAACsAAAANmhoZWEGQgPrAAAA5AAAACRobXR4BkAAAAAAAYgAAAAIbG9jYQANAAAAAAHEAAAABm1heHAABAAFAAABCAAAACBuYW1lohTv5AAAAegAAAHgcG9zdAAoAAAAAAPIAAAAJgABAAAAAQAAV30mI18PPPUAAQPoAAAAAOaPgG0AAAAA5o+AbQBkAAADhAMgAAAAAwACAAAAAAAAAAEAAAMg/zgAAAPoAAAAyAMgAAEAAAAAAAAAAAAAAAAAAAACAAEAAAACAAMAAQAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAwMgAZAABQAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAPz8/PwAAAEEAQQMg/zgAAAMgAMgAAAAAAAAAAAAAAAAAAAAgAAACWAAAA+gAAAAAAAIAAAADAAAAFAADAAEAAAAUAAQAIAAAAAQABAABAAAAQf//AAAAQf///8AAAQAAAAAAAAAAAA0AAAABAGQAAAOEAyAAAgAAMwEBZAGQAZADIPzgAAAAAAAMAJYAAQAAAAAAAQAQAAAAAQAAAAAAAgAHABAAAQAAAAAAAwAcABcAAQAAAAAABAAYADMAAQAAAAAABQALAEsAAQAAAAAABgAYAFYAAwABBAkAAQAgAG4AAwABBAkAAgAOAI4AAwABBAkAAwA4AJwAAwABBAkABAAwANQAAwABBAkABQAWAQQAAwABBAkABgAwARpNdXRhdGlvblRlc3RGb250UmVndWxhck11dGF0aW9uVGVzdEZvbnQgUmVndWxhciAxLjBNdXRhdGlvblRlc3RGb250IFJlZ3VsYXJWZXJzaW9uIDEuME11dGF0aW9uVGVzdEZvbnQtUmVndWxhcgBNAHUAdABhAHQAaQBvAG4AVABlAHMAdABGAG8AbgB0AFIAZQBnAHUAbABhAHIATQB1AHQAYQB0AGkAbwBuAFQAZQBzAHQARgBvAG4AdAAgAFIAZQBnAHUAbABhAHIAIAAxAC4AMABNAHUAdABhAHQAaQBvAG4AVABlAHMAdABGAG8AbgB0ACAAUgBlAGcAdQBsAGEAcgBWAGUAcgBzAGkAbwBuACAAMQAuADAATQB1AHQAYQB0AGkAbwBuAFQAZQBzAHQARgBvAG4AdAAtAFIAZQBnAHUAbABhAHIAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAJAAA';
    it('1041642 applies underline style to embedded TrueType font', () => {
        const document: PdfDocument = new PdfDocument();
        const result: PdfTrueTypeFont = document.embedFont(
            fontData,
            12,
            {
                shouldUnderline: true
            }
        );
        expect(result).toBeDefined();
        expect(result instanceof PdfTrueTypeFont).toBeTruthy();
        expect(result.style).toBe(PdfFontStyle.underline);
        expect(result.style).not.toBe(PdfFontStyle.regular);
        expect(result._document).toBe(document);
        document.destroy();
    });
    it('1041642 applies strikeout style to embedded TrueType font', () => {
        const document: PdfDocument = new PdfDocument();
        const result: PdfTrueTypeFont = document.embedFont(
            fontData,
            12,
            {
                shouldStrikeout: true
            }
        );
        expect(result).toBeDefined();
        expect(result instanceof PdfTrueTypeFont).toBeTruthy();
        expect(result.style).toBe(PdfFontStyle.strikeout);
        expect(result.style).not.toBe(PdfFontStyle.regular);
        expect(result._document).toBe(document);
        document.destroy();
    });
    it('1041642 gives strikeout precedence when both styles are enabled', () => {
        const document: PdfDocument = new PdfDocument();
        const result: PdfTrueTypeFont = document.embedFont(
            fontData,
            12,
            {
                shouldUnderline: true,
                shouldStrikeout: true
            }
        );
        expect(result).toBeDefined();
        expect(result instanceof PdfTrueTypeFont).toBeTruthy();
        expect(result.style).toBe(PdfFontStyle.strikeout);
        expect(result.style).not.toBe(PdfFontStyle.underline);
        expect(result._document).toBe(document);
        document.destroy();
    });
    it('1041642 marks TrueType font metrics as Unicode', () => {
        const document: PdfDocument = new PdfDocument();
        const decodedFontData: string = window.atob(fontData);
        const fontBytes: Uint8Array =
            new Uint8Array(decodedFontData.length);
        for (
            let index: number = 0;
            index < decodedFontData.length;
            index++
        ) {
            fontBytes[index] =
                decodedFontData.charCodeAt(index);
        }
        const result: any =
            document._getOrCreateFontPrimitive(
                'ttf-mutation-test-font',
                {
                    type: 'ttf',
                    data: fontBytes
                }
            );
        expect(result).toBeDefined();
        expect(result.dictionary).toBeDefined();
        expect(result.metrices).toBeDefined();
        expect(result.fontInternal).toBeDefined();
        expect(
            result.metrices._isUnicodeFont
        ).toBeTruthy();
        expect(
            result.fontInternal._metrics._isUnicodeFont
        ).toBeTruthy();
        expect(
            (document as any)._fontCollection.get(
                'ttf-mutation-test-font'
            )
        ).toBe(result);
        document.destroy();
    });
});
describe('1041642 PdfDocument embedFont routing and keys', () => {
    it('1041642 ignores non-boolean CJK argument', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalGetOrCreateFontPrimitive: any =
            document._getOrCreateFontPrimitive;
        const originalCreateFontFromPrimitive: any =
            document._createFontFromPrimitive;
        let receivedKey: string = '';
        let receivedFontData: any;
        let receivedSize: number = 0;
        let receivedStyle: PdfFontStyle = PdfFontStyle.regular;
        const expectedFont: PdfStandardFont =
            new PdfStandardFont(
                PdfFontFamily.helvetica,
                12,
                PdfFontStyle.regular
            );
        document._getOrCreateFontPrimitive = (
            key: string,
            fontInformation: any
        ): any => {
            receivedKey = key;
            receivedFontData = fontInformation;
            return fontInformation;
        };
        document._createFontFromPrimitive = (
            _primitive: any,
            size: number,
            style: PdfFontStyle
        ): PdfStandardFont => {
            receivedSize = size;
            receivedStyle = style;
            return expectedFont;
        };
        const result: PdfStandardFont = internalDocument.embedFont(
            PdfFontFamily.helvetica,
            12,
            PdfFontStyle.regular,
            'true'
        );
        expect(result).toBe(expectedFont);
        expect(receivedKey).toBe(
            'standard_' +
            PdfFontFamily.helvetica +
            '_' +
            PdfFontStyle.regular
        );
        expect(receivedFontData.type).toBe('standard');
        expect(receivedFontData.family).toBe(
            PdfFontFamily.helvetica
        );
        expect(receivedFontData.style).toBe(
            PdfFontStyle.regular
        );
        expect(receivedSize).toBe(12);
        expect(receivedStyle).toBe(PdfFontStyle.regular);
        document._getOrCreateFontPrimitive =
            originalGetOrCreateFontPrimitive;
        document._createFontFromPrimitive =
            originalCreateFontFromPrimitive;
        expect(document._getOrCreateFontPrimitive).toBe(
            originalGetOrCreateFontPrimitive
        );
        expect(document._createFontFromPrimitive).toBe(
            originalCreateFontFromPrimitive
        );
        document.destroy();
    });
    it('1041642 creates complete CJK font cache key', () => {
        const document: PdfDocument = new PdfDocument();
        const originalGetOrCreateFontPrimitive: any =
            document._getOrCreateFontPrimitive;
        const originalCreateFontFromPrimitive: any =
            document._createFontFromPrimitive;
        let receivedKey: string = '';
        let receivedFontData: any;
        const expectedFont: PdfCjkStandardFont =
            new PdfCjkStandardFont(
                PdfCjkFontFamily.hanyangSystemsGothicMedium,
                14,
                PdfFontStyle.bold
            );
        document._getOrCreateFontPrimitive = (
            key: string,
            fontInformation: any
        ): any => {
            receivedKey = key;
            receivedFontData = fontInformation;
            return fontInformation;
        };
        document._createFontFromPrimitive = (
            _primitive: any,
            _size: number,
            _style: PdfFontStyle
        ): PdfCjkStandardFont => {
            return expectedFont;
        };
        const result: PdfCjkStandardFont = document.embedFont(
            PdfCjkFontFamily.hanyangSystemsGothicMedium,
            14,
            PdfFontStyle.bold,
            true
        );
        const expectedKey: string =
            'cjk_' +
            PdfCjkFontFamily.hanyangSystemsGothicMedium +
            '_' +
            PdfFontStyle.bold;
        expect(result).toBe(expectedFont);
        expect(receivedKey).toBe(expectedKey);
        expect(receivedKey.indexOf('cjk_')).toBe(0);
        expect(
            receivedKey.indexOf(
                '_' + PdfFontStyle.bold
            )
        ).not.toBe(-1);
        expect(receivedFontData.type).toBe('cjk');
        expect(receivedFontData.family).toBe(
            PdfCjkFontFamily.hanyangSystemsGothicMedium
        );
        expect(receivedFontData.style).toBe(
            PdfFontStyle.bold
        );
        document._getOrCreateFontPrimitive =
            originalGetOrCreateFontPrimitive;
        document._createFontFromPrimitive =
            originalCreateFontFromPrimitive;
        expect(document._getOrCreateFontPrimitive).toBe(
            originalGetOrCreateFontPrimitive
        );
        expect(document._createFontFromPrimitive).toBe(
            originalCreateFontFromPrimitive
        );
        document.destroy();
    });
    it('1041642 creates complete standard font cache key', () => {
        const document: PdfDocument = new PdfDocument();
        const originalGetOrCreateFontPrimitive: any =
            document._getOrCreateFontPrimitive;
        const originalCreateFontFromPrimitive: any =
            document._createFontFromPrimitive;
        let receivedKey: string = '';
        let receivedFontData: any;
        const expectedFont: PdfStandardFont =
            new PdfStandardFont(
                PdfFontFamily.helvetica,
                12,
                PdfFontStyle.bold
            );
        document._getOrCreateFontPrimitive = (
            key: string,
            fontInformation: any
        ): any => {
            receivedKey = key;
            receivedFontData = fontInformation;
            return fontInformation;
        };
        document._createFontFromPrimitive = (
            _primitive: any,
            _size: number,
            _style: PdfFontStyle
        ): PdfStandardFont => {
            return expectedFont;
        };
        const result: PdfStandardFont = document.embedFont(
            PdfFontFamily.helvetica,
            12,
            PdfFontStyle.bold
        );
        const expectedKey: string =
            'standard_' +
            PdfFontFamily.helvetica +
            '_' +
            PdfFontStyle.bold;
        expect(result).toBe(expectedFont);
        expect(receivedKey).toBe(expectedKey);
        expect(receivedKey.indexOf('standard_')).toBe(0);
        expect(
            receivedKey.indexOf(
                '_' + PdfFontStyle.bold
            )
        ).not.toBe(-1);
        expect(receivedFontData.type).toBe('standard');
        expect(receivedFontData.family).toBe(
            PdfFontFamily.helvetica
        );
        expect(receivedFontData.style).toBe(
            PdfFontStyle.bold
        );
        document._getOrCreateFontPrimitive =
            originalGetOrCreateFontPrimitive;
        document._createFontFromPrimitive =
            originalCreateFontFromPrimitive;
        expect(document._getOrCreateFontPrimitive).toBe(
            originalGetOrCreateFontPrimitive
        );
        expect(document._createFontFromPrimitive).toBe(
            originalCreateFontFromPrimitive
        );
        document.destroy();
    });
});
describe('1041642 PdfDocument _getOrCreateFontPrimitive', () => {
    it('1041642 does not use cached primitive for a non-string key', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const numericKey: number = 1041642;
        const cachedPrimitive: any = {
            dictionary: new _PdfDictionary(),
            metrices: undefined
        };
        internalDocument._fontCollection.set(
            numericKey,
            cachedPrimitive
        );
        const result: any =
            internalDocument._getOrCreateFontPrimitive(
                numericKey,
                {
                    type: 'standard',
                    family: PdfFontFamily.helvetica,
                    style: PdfFontStyle.regular
                }
            );
        expect(result).toBeDefined();
        expect(result).not.toBe(cachedPrimitive);
        expect(result.dictionary).toBeDefined();
        expect(result.dictionary.has('Type')).toBeTruthy();
        expect(result.dictionary.get('Type').name).toBe('Font');
        document.destroy();
    });
    it('1041642 creates standard font dictionary properties', () => {
        const document: PdfDocument = new PdfDocument();
        const key: string = 'standard-helvetica-regular';
        const result: any =
            document._getOrCreateFontPrimitive(
                key,
                {
                    type: 'standard',
                    family: PdfFontFamily.helvetica,
                    style: PdfFontStyle.regular
                }
            );
        const dictionary: _PdfDictionary = result.dictionary;
        expect(result).toBeDefined();
        expect(result.metrices).toBeDefined();
        expect(dictionary._updated).toBeTruthy();
        expect(dictionary.has('Type')).toBeTruthy();
        expect(dictionary.get('Type').name).toBe('Font');
        expect(dictionary.get('Type').name).not.toBe('');
        expect(dictionary.has('Subtype')).toBeTruthy();
        expect(dictionary.get('Subtype').name).toBe('Type1');
        expect(dictionary.has('BaseFont')).toBeTruthy();
        expect(dictionary.get('BaseFont').name.length).toBeGreaterThan(0);
        expect(dictionary.has('Encoding')).toBeTruthy();
        expect(dictionary.get('Encoding').name).toBe(
            'WinAnsiEncoding'
        );
        expect(dictionary.get('Encoding').name).not.toBe('');
        expect(dictionary.has('')).toBeFalsy();
        expect(
            (document as any)._fontCollection.get(key)
        ).toBe(result);
        document.destroy();
    });
    it('1041642 does not set encoding for symbol font', () => {
        const document: PdfDocument = new PdfDocument();
        const key: string = 'standard-symbol-regular';
        const result: any =
            document._getOrCreateFontPrimitive(
                key,
                {
                    type: 'standard',
                    family: PdfFontFamily.symbol,
                    style: PdfFontStyle.regular
                }
            );
        const dictionary: _PdfDictionary = result.dictionary;
        expect(result).toBeDefined();
        expect(dictionary._updated).toBeTruthy();
        expect(dictionary.has('Type')).toBeTruthy();
        expect(dictionary.get('Type').name).toBe('Font');
        expect(dictionary.has('Encoding')).toBeFalsy();
        expect(dictionary.has('')).toBeFalsy();
        document.destroy();
    });
    it('1041642 does not set encoding for Zapf Dingbats font', () => {
        const document: PdfDocument = new PdfDocument();
        const key: string = 'standard-zapf-regular';
        const result: any =
            document._getOrCreateFontPrimitive(
                key,
                {
                    type: 'standard',
                    family: PdfFontFamily.zapfDingbats,
                    style: PdfFontStyle.regular
                }
            );
        const dictionary: _PdfDictionary = result.dictionary;
        expect(result).toBeDefined();
        expect(dictionary._updated).toBeTruthy();
        expect(dictionary.has('Type')).toBeTruthy();
        expect(dictionary.get('Type').name).toBe('Font');
        expect(dictionary.has('Encoding')).toBeFalsy();
        expect(dictionary.has('')).toBeFalsy();
        document.destroy();
    });
    it('1041642 returns cached primitive for a string key', () => {
        const document: PdfDocument = new PdfDocument();
        const key: string = 'cached-standard-font';
        const firstResult: any =
            document._getOrCreateFontPrimitive(
                key,
                {
                    type: 'standard',
                    family: PdfFontFamily.helvetica,
                    style: PdfFontStyle.regular
                }
            );
        const secondResult: any =
            document._getOrCreateFontPrimitive(
                key,
                {
                    type: 'standard',
                    family: PdfFontFamily.timesRoman,
                    style: PdfFontStyle.bold
                }
            );
        expect(firstResult).toBeDefined();
        expect(secondResult).toBe(firstResult);
        expect(
            (document as any)._fontCollection.get(key)
        ).toBe(firstResult);
        document.destroy();
    });
    it('1041642 creates CJK font dictionary properties', () => {
        const document: PdfDocument = new PdfDocument();
        const key: string = 'cjk-hanyang-bold';
        const result: any =
            document._getOrCreateFontPrimitive(
                key,
                {
                    type: 'cjk',
                    family:
                        PdfCjkFontFamily
                            .hanyangSystemsGothicMedium,
                    style: PdfFontStyle.bold
                }
            );
        const dictionary: _PdfDictionary = result.dictionary;
        const encoding: any = dictionary.get('Encoding');
        expect(result).toBeDefined();
        expect(result.metrices).toBeDefined();
        expect(dictionary._updated).toBeTruthy();
        expect(dictionary.has('Type')).toBeTruthy();
        expect(dictionary.get('Type').name).toBe('Font');
        expect(dictionary.get('Type').name).not.toBe('');
        expect(dictionary.has('Subtype')).toBeTruthy();
        expect(dictionary.get('Subtype').name).toBe('Type0');
        expect(dictionary.has('BaseFont')).toBeTruthy();
        expect(dictionary.get('BaseFont').name.length).toBeGreaterThan(0);
        expect(dictionary.has('Encoding')).toBeTruthy();
        expect(encoding).toBeDefined();
        expect(encoding.name).toBeDefined();
        expect(encoding.name.length).toBeGreaterThan(0);
        expect(dictionary.has('DescendantFonts')).toBeTruthy();
        expect(dictionary.get('DescendantFonts')).toBeDefined();
        expect(dictionary.has('')).toBeFalsy();
        expect(
            (document as any)._fontCollection.get(key)
        ).toBe(result);
        document.destroy();
    });
});
describe('1041642 PdfDocument _computeFontHash', () => {
    it('1041642 computes hexadecimal hash for font data', () => {
        const document: PdfDocument = new PdfDocument();
        const fontData: Uint8Array = new Uint8Array([
            1, 2, 3, 4, 5
        ]);
        const result: string =
            document._computeFontHash(fontData);
        expect(result).toBeDefined();
        expect(typeof result).toBe('string');
        expect(result).toBe(
            '7CFDD07889B3295D6A550914AB35E068'
        );
        expect(result.length).toBe(32);
        expect(result).not.toBe('');
        document.destroy();
    });
    it('1041642 returns same hash for identical font data', () => {
        const document: PdfDocument = new PdfDocument();
        const firstFontData: Uint8Array = new Uint8Array([
            10, 20, 30, 40
        ]);
        const secondFontData: Uint8Array = new Uint8Array([
            10, 20, 30, 40
        ]);
        const firstResult: string =
            document._computeFontHash(firstFontData);
        const secondResult: string =
            document._computeFontHash(secondFontData);
        expect(firstResult).toBeDefined();
        expect(secondResult).toBeDefined();
        expect(firstResult).toBe(secondResult);
        expect(firstResult.length).toBe(32);
        document.destroy();
    });
    it('1041642 returns different hashes for different font data', () => {
        const document: PdfDocument = new PdfDocument();
        const firstFontData: Uint8Array = new Uint8Array([
            1, 2, 3
        ]);
        const secondFontData: Uint8Array = new Uint8Array([
            1, 2, 4
        ]);
        const firstResult: string =
            document._computeFontHash(firstFontData);
        const secondResult: string =
            document._computeFontHash(secondFontData);
        expect(firstResult).toBeDefined();
        expect(secondResult).toBeDefined();
        expect(firstResult).not.toBe(secondResult);
        expect(firstResult.length).toBe(32);
        expect(secondResult.length).toBe(32);
        document.destroy();
    });
});
describe('1041642 PdfDocument getPage linearization condition', () => {
    it('1041642 uses catalog when matching linearization is invalid', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const catalog: any = document._catalog as any;
        document.addPage();
        const originalGetLinearizationPage: any =
            internalDocument._getLinearizationPage;
        const originalGetPageDictionary: any =
            catalog._getPageDictionary;
        const pageData: any =
            originalGetPageDictionary.call(catalog, 0);
        let linearizationCallCount: number = 0;
        let catalogCallCount: number = 0;
        internalDocument._pages.delete(0);
        internalDocument._linear = {
            isValid: false,
            pageFirst: 0
        };
        internalDocument._getLinearizationPage = (
            _pageIndex: number
        ): any => {
            linearizationCallCount++;
            return pageData;
        };
        catalog._getPageDictionary = (
            _pageIndex: number
        ): any => {
            catalogCallCount++;
            return pageData;
        };
        const result: PdfPage = document.getPage(0);
        expect(result).toBeDefined();
        expect(result instanceof PdfPage).toBeTruthy();
        expect(result._pageIndex).toBe(0);
        expect(catalogCallCount).toBe(1);
        expect(linearizationCallCount).toBe(0);
        expect(internalDocument._pages.get(0)).toBe(result);
        internalDocument._getLinearizationPage =
            originalGetLinearizationPage;
        catalog._getPageDictionary =
            originalGetPageDictionary;
        expect(internalDocument._getLinearizationPage).toBe(
            originalGetLinearizationPage
        );
        expect(catalog._getPageDictionary).toBe(
            originalGetPageDictionary
        );
        document.destroy();
    });
});
describe('1041642 PdfDocument addPage', () => {
    it('1041642 uses supplied index and settings', () => {
        const document: PdfDocument = new PdfDocument();
        const firstPage: PdfPage = document.addPage();
        const settings: PdfPageSettings = new PdfPageSettings();
        const result: PdfPage = document.addPage(
            0,
            settings
        );
        expect(firstPage).toBeDefined();
        expect(result).toBeDefined();
        expect(result instanceof PdfPage).toBeTruthy();
        expect(result._pageIndex).toBe(0);
        expect(result._pageSettings).toBe(settings);
        expect(result._isNew).toBeTruthy();
        expect(document.pageCount).toBe(2);
        expect(document.getPage(0)).toBe(result);
        document.destroy();
    });
    it('1041642 creates first page and section dictionaries correctly', () => {
        const document: PdfDocument = new PdfDocument();
        const result: PdfPage = document.addPage();
        const pageDictionary: _PdfDictionary =
            result._pageDictionary;
        const sectionReference: _PdfReference =
            pageDictionary.getRaw('Parent') as _PdfReference;
        const sectionDictionary: _PdfDictionary =
            document._crossReference._fetch(
                sectionReference
            ) as _PdfDictionary;
        const sectionKids: _PdfReference[] =
            sectionDictionary.get('Kids');
        expect(result).toBeDefined();
        expect(result._isNew).toBeTruthy();
        expect(pageDictionary.has('Type')).toBeTruthy();
        expect(pageDictionary.get('Type').name).toBe('Page');
        expect(pageDictionary.get('Type').name).not.toBe('');
        expect(pageDictionary.has('')).toBeFalsy();
        expect(sectionDictionary.has('Type')).toBeTruthy();
        expect(sectionDictionary.get('Type').name).toBe('Pages');
        expect(sectionDictionary.has('Count')).toBeTruthy();
        expect(sectionDictionary.get('Count')).toBe(1);
        expect(sectionDictionary.has('')).toBeFalsy();
        expect(sectionDictionary.has('Kids')).toBeTruthy();
        expect(Array.isArray(sectionKids)).toBeTruthy();
        expect(sectionKids.length).toBe(1);
        expect(sectionKids[0]).toBe(result._ref);
        expect(document.pageCount).toBe(1);
        expect(document.getPage(0)).toBe(result);
        document.destroy();
    });
    it('1041642 appends first section to top pages Kids', () => {
        const document: PdfDocument = new PdfDocument();
        const topPagesDictionary: _PdfDictionary =
            document._catalog._topPagesDictionary;
        const initialKids: _PdfReference[] =
            topPagesDictionary.get('Kids');
        expect(Array.isArray(initialKids)).toBeTruthy();
        expect(initialKids.length).toBe(0);
        const result: PdfPage = document.addPage();
        const pageDictionary: _PdfDictionary =
            result._pageDictionary;
        const sectionReference: _PdfReference =
            pageDictionary.getRaw('Parent') as _PdfReference;
        const updatedKids: _PdfReference[] =
            topPagesDictionary.get('Kids');
        expect(topPagesDictionary.has('Kids')).toBeTruthy();
        expect(Array.isArray(updatedKids)).toBeTruthy();
        expect(updatedKids.length).toBe(1);
        expect(updatedKids[0]).toBe(sectionReference);
        expect(topPagesDictionary.has('')).toBeFalsy();
        expect(topPagesDictionary.get('Count')).toBe(1);
        document.destroy();
    });
    it('1041642 creates top pages Kids when existing value is unavailable', () => {
        const document: PdfDocument = new PdfDocument();
        const topPagesDictionary: _PdfDictionary =
            document._catalog._topPagesDictionary;
        topPagesDictionary.update('Kids', null);
        const result: PdfPage = document.addPage();
        const sectionReference: _PdfReference =
            result._pageDictionary.getRaw(
                'Parent'
            ) as _PdfReference;
        const updatedKids: _PdfReference[] =
            topPagesDictionary.get('Kids');
        expect(result).toBeDefined();
        expect(topPagesDictionary.has('Kids')).toBeTruthy();
        expect(Array.isArray(updatedKids)).toBeTruthy();
        expect(updatedKids.length).toBe(1);
        expect(updatedKids[0]).toBe(sectionReference);
        expect(topPagesDictionary.get('Count')).toBe(1);
        document.destroy();
    });
    it('1041642 inserts page section before requested page', () => {
        const document: PdfDocument = new PdfDocument();
        const firstPage: PdfPage = document.addPage();
        const secondPage: PdfPage = document.addPage();
        const thirdPage: PdfPage = document.addPage();
        const targetParentReference: _PdfReference =
            secondPage._pageDictionary.getRaw(
                'Parent'
            ) as _PdfReference;
        const targetParentDictionary: _PdfDictionary =
            document._crossReference._fetch(
                targetParentReference
            ) as _PdfDictionary;
        const previousKids: _PdfReference[] =
            targetParentDictionary.get('Kids');
        expect(document.pageCount).toBe(3);
        expect(previousKids.length).toBe(2);
        expect(previousKids[0]).toBe(secondPage._ref);
        const thirdSectionReference: _PdfReference =
            thirdPage._pageDictionary.getRaw(
                'Parent'
            ) as _PdfReference;
        expect(previousKids[1]).toBe(thirdSectionReference);
        const insertedPage: PdfPage = document.addPage(
            1,
            new PdfPageSettings()
        );
        const insertedSectionReference: _PdfReference =
            insertedPage._pageDictionary.getRaw(
                'Parent'
            ) as _PdfReference;
        const updatedKids: _PdfReference[] =
            targetParentDictionary.get('Kids');
        expect(document.pageCount).toBe(4);
        expect(insertedPage._pageIndex).toBe(1);
        expect(insertedPage._isNew).toBeTruthy();
        expect(updatedKids.length).toBe(3);
        expect(updatedKids[0]).toBe(
            insertedSectionReference
        );
        expect(updatedKids[1]).toBe(secondPage._ref);
        expect(updatedKids[2]).toBe(
            thirdSectionReference
        );
        expect(
            targetParentDictionary.has('Kids')
        ).toBeTruthy();
        expect(
            targetParentDictionary.has('')
        ).toBeFalsy();
        expect(document.getPage(1)).toBe(insertedPage);
        document.destroy();
    });
    it('1041642 appends page section after the final page', () => {
        const document: PdfDocument = new PdfDocument();
        const firstPage: PdfPage = document.addPage();
        const secondPage: PdfPage = document.addPage();
        const targetParentReference: _PdfReference =
            secondPage._pageDictionary.getRaw(
                'Parent'
            ) as _PdfReference;
        const targetParentDictionary: _PdfDictionary =
            document._crossReference._fetch(
                targetParentReference
            ) as _PdfDictionary;
        const previousKids: _PdfReference[] =
            targetParentDictionary.get('Kids');
        expect(document.pageCount).toBe(2);
        expect(previousKids.length).toBe(1);
        expect(previousKids[0]).toBe(secondPage._ref);
        const appendedPage: PdfPage = document.addPage(
            document.pageCount,
            new PdfPageSettings()
        );
        const appendedSectionReference: _PdfReference =
            appendedPage._pageDictionary.getRaw(
                'Parent'
            ) as _PdfReference;
        const updatedKids: _PdfReference[] =
            targetParentDictionary.get('Kids');
        expect(document.pageCount).toBe(3);
        expect(appendedPage._pageIndex).toBe(2);
        expect(appendedPage._isNew).toBeTruthy();
        expect(updatedKids.length).toBe(2);
        expect(updatedKids[0]).toBe(secondPage._ref);
        expect(updatedKids[1]).toBe(
            appendedSectionReference
        );
        expect(
            targetParentDictionary.has('Kids')
        ).toBeTruthy();
        expect(
            targetParentDictionary.has('')
        ).toBeFalsy();
        expect(document.getPage(2)).toBe(appendedPage);
        document.destroy();
    });
    it('1041642 skips existing-page update when page dictionary is unavailable', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const existingPage: PdfPage = document.addPage();
        existingPage._pageDictionary = undefined as any;
        internalDocument._pages.set(0, existingPage);
        const result: PdfPage = document.addPage(
            0,
            new PdfPageSettings()
        );
        expect(result).toBeDefined();
        expect(result instanceof PdfPage).toBeTruthy();
        expect(result._pageIndex).toBe(0);
        expect(result._isNew).toBeTruthy();
        expect(document.pageCount).toBe(1);
        expect(internalDocument._pages.get(0)).toBe(result);
        document.destroy();
    });
    it('1041642 skips page-tree update when parent dictionary is unavailable', () => {
        const document: PdfDocument = new PdfDocument();
        const existingPage: PdfPage = document.addPage();
        const missingParentReference: _PdfReference =
            document._crossReference._getNextReference();
        existingPage._pageDictionary.update(
            'Parent',
            missingParentReference
        );
        const result: PdfPage = document.addPage(
            0,
            new PdfPageSettings()
        );
        expect(result).toBeDefined();
        expect(result instanceof PdfPage).toBeTruthy();
        expect(result._pageIndex).toBe(0);
        expect(result._isNew).toBeTruthy();
        expect(document.pageCount).toBe(1);
        document.destroy();
    });
    it('1041642 skips page-tree update when parent Kids value is unavailable', () => {
        const document: PdfDocument = new PdfDocument();
        const existingPage: PdfPage = document.addPage();
        const parentReference: _PdfReference =
            existingPage._pageDictionary.getRaw(
                'Parent'
            ) as _PdfReference;
        const parentDictionary: _PdfDictionary =
            document._crossReference._fetch(
                parentReference
            ) as _PdfDictionary;
        parentDictionary.update('Kids', null);
        const result: PdfPage = document.addPage(
            0,
            new PdfPageSettings()
        );
        expect(result).toBeDefined();
        expect(result instanceof PdfPage).toBeTruthy();
        expect(result._pageIndex).toBe(0);
        expect(result._isNew).toBeTruthy();
        expect(parentDictionary.get('Kids')).toBeNull();
        expect(document.pageCount).toBe(1);
        document.destroy();
    });
});
describe('1041642 PdfDocument addSection', () => {
    it('1041642 does not add section to a loaded document', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const existingSectionCount: number =
            internalDocument._sections.length;
        internalDocument._isLoaded = true;
        const result: PdfSection = document.addSection();
        expect(internalDocument._isLoaded).toBeTruthy();
        expect(result).toBeUndefined();
        expect(internalDocument._sections.length).toBe(
            existingSectionCount
        );
        document.destroy();
    });
    it('1041642 adds section to a new document', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const settings: PdfPageSettings =
            new PdfPageSettings();
        const result: PdfSection =
            document.addSection(settings);
        expect(internalDocument._isLoaded).toBeFalsy();
        expect(result).toBeDefined();
        expect(result instanceof PdfSection).toBeTruthy();
        expect(internalDocument._sections.length).toBe(1);
        expect(internalDocument._sections[0]).toBe(result);
        document.destroy();
    });
});
describe('1041642 PdfDocument getDocumentInformation', () => {
    it('1041642 skips XMP metadata by default when information dictionary is unavailable', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalGetMetadataValue: any =
            internalDocument._getMetadataValue;
        let metadataCallCount: number = 0;
        internalDocument._getMetadataValue =
            (): PdfXmpMetadata => {
                metadataCallCount++;
                return new PdfXmpMetadata();
            };
        const result: PdfDocumentInformation =
            document.getDocumentInformation();
        expect(result).toBeDefined();
        expect(result.xmpMetadata).toBeUndefined();
        expect(result.customMetadata).toBeDefined();
        expect(
            result.customMetadata instanceof PdfCustomMetadata
        ).toBeTruthy();
        expect(metadataCallCount).toBe(0);
        internalDocument._getMetadataValue =
            originalGetMetadataValue;
        expect(internalDocument._getMetadataValue).toBe(
            originalGetMetadataValue
        );
        document.destroy();
    });
    it('1041642 includes XMP metadata when skip metadata is false', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalGetMetadataValue: any =
            internalDocument._getMetadataValue;
        const expectedMetadata: PdfXmpMetadata =
            new PdfXmpMetadata();
        let metadataCallCount: number = 0;
        internalDocument._getMetadataValue =
            (): PdfXmpMetadata => {
                metadataCallCount++;
                return expectedMetadata;
            };
        const result: PdfDocumentInformation =
            document.getDocumentInformation(false);
        expect(result).toBeDefined();
        expect(result.xmpMetadata).toBe(expectedMetadata);
        expect(result.customMetadata).toBeDefined();
        expect(metadataCallCount).toBe(1);
        internalDocument._getMetadataValue =
            originalGetMetadataValue;
        expect(internalDocument._getMetadataValue).toBe(
            originalGetMetadataValue
        );
        document.destroy();
    });
    it('1041642 does not create information dictionary while reading document information', () => {
        const document: PdfDocument = new PdfDocument();
        const trailerDictionary: _PdfDictionary =
            document._crossReference._trailer;
        expect(trailerDictionary.has('Info')).toBeFalsy();
        const result: PdfDocumentInformation =
            document.getDocumentInformation();
        expect(result).toBeDefined();
        expect(result.customMetadata).toBeDefined();
        expect(trailerDictionary.has('Info')).toBeFalsy();
        document.destroy();
    });
    it('1041642 excludes standard date and trapped entries from custom metadata', () => {
        const document: PdfDocument = new PdfDocument();
        const infoDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        infoDictionary.update(
            'CreationDate',
            'D:20260729120000'
        );
        infoDictionary.update(
            'ModDate',
            'D:20260729130000'
        );
        infoDictionary.update(
            'Trapped',
            'False'
        );
        infoDictionary.update(
            'Department',
            'PDF Development'
        );
        document._crossReference._trailer.update(
            'Info',
            infoDictionary
        );
        const result: PdfDocumentInformation =
            document.getDocumentInformation();
        const customMetadata: any =
            result.customMetadata as any;
        const customData: Map<string, string> =
            customMetadata._customData;
        expect(result).toBeDefined();
        expect(result.creationDate).toBeDefined();
        expect(result.modificationDate).toBeDefined();
        expect(result.customMetadata).toBeDefined();
        expect(customData.has('CreationDate')).toBeFalsy();
        expect(customData.has('ModDate')).toBeFalsy();
        expect(customData.has('Trapped')).toBeFalsy();
        expect(customData.has('Department')).toBeTruthy();
        expect(customData.get('Department')).toBe(
            'PDF Development'
        );
        expect(customData.size).toBe(1);
        document.destroy();
    });
    it('1041642 excludes non-string values from custom metadata', () => {
        const document: PdfDocument = new PdfDocument();
        const infoDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        infoDictionary.update(
            'Department',
            'PDF Development'
        );
        infoDictionary.update(
            'RevisionNumber',
            1041642
        );
        infoDictionary.update(
            'IsReviewed',
            true
        );
        document._crossReference._trailer.update(
            'Info',
            infoDictionary
        );
        const result: PdfDocumentInformation =
            document.getDocumentInformation();
        const customMetadata: any =
            result.customMetadata as any;
        const customData: Map<string, string> =
            customMetadata._customData;
        expect(result).toBeDefined();
        expect(result.customMetadata).toBeDefined();
        expect(customData.has('Department')).toBeTruthy();
        expect(customData.get('Department')).toBe(
            'PDF Development'
        );
        expect(customData.has('RevisionNumber')).toBeFalsy();
        expect(customData.has('IsReviewed')).toBeFalsy();
        expect(customData.size).toBe(1);
        document.destroy();
    });
});
describe('1041642 PdfDocument _readInfoString', () => {
    it('1041642 returns string value from information dictionary', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const infoDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        infoDictionary.update(
            'Department',
            'PDF Development'
        );
        const result: string =
            internalDocument._readInfoString(
                infoDictionary,
                'Department'
            );
        expect(result).toBe('PDF Development');
        expect(typeof result).toBe('string');
        document.destroy();
    });
    it('1041642 returns undefined for non-string information value', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const infoDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        infoDictionary.update(
            'RevisionNumber',
            1041642
        );
        const result: string =
            internalDocument._readInfoString(
                infoDictionary,
                'RevisionNumber'
            );
        expect(result).toBeUndefined();
        expect(typeof result).not.toBe('string');
        document.destroy();
    });
    it('1041642 returns undefined when information key is unavailable', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const infoDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        const result: string =
            internalDocument._readInfoString(
                infoDictionary,
                'UnavailableKey'
            );
        expect(
            infoDictionary.has('UnavailableKey')
        ).toBeFalsy();
        expect(result).toBeUndefined();
        document.destroy();
    });
});
describe('1041642 PdfDocument setDocumentInformation', () => {
    it('1041642 writes custom metadata when XMP metadata is unavailable', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const customMetadata: PdfCustomMetadata =
            new PdfCustomMetadata();
        customMetadata.set(
            'Department',
            'PDF Development'
        );
        internalDocument._xmpMetadata = undefined;
        document.setDocumentInformation({
            customMetadata
        });
        const infoDictionary: _PdfDictionary =
            internalDocument._getInfoDictionary(false);
        expect(
            internalDocument._xmpMetadata
        ).toBeUndefined();
        expect(infoDictionary).toBeDefined();
        expect(
            infoDictionary.has('Department')
        ).toBeTruthy();
        expect(
            infoDictionary.get('Department')
        ).toBe('PDF Development');
        expect(infoDictionary._updated).toBeTruthy();
        document.destroy();
    });
    it('1041642 writes only string custom metadata entries', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const customMetadata: PdfCustomMetadata =
            new PdfCustomMetadata();
        const internalCustomMetadata: any =
            customMetadata as any;
        const customData: Map<any, any> =
            internalCustomMetadata._customData;
        const originalWriteInfoString: any =
            internalDocument._writeInfoString;
        const receivedEntries:
            { key: any; value: any }[] = [];
        customData.set(
            'Department',
            'PDF Development'
        );
        customData.set(
            1041642,
            'Numeric key'
        );
        customData.set(
            'RevisionNumber',
            1041642
        );
        customData.set(
            false,
            true
        );
        internalDocument._xmpMetadata = undefined;
        internalDocument._writeInfoString = (
            dictionary: _PdfDictionary,
            key: any,
            value: any
        ): void => {
            receivedEntries.push({
                key,
                value
            });
            originalWriteInfoString.call(
                document,
                dictionary,
                key,
                value
            );
        };
        document.setDocumentInformation({
            customMetadata
        });
        const infoDictionary: _PdfDictionary =
            internalDocument._getInfoDictionary(false);
        expect(
            infoDictionary.has('Department')
        ).toBeTruthy();
        expect(
            infoDictionary.get('Department')
        ).toBe('PDF Development');
        expect(
            infoDictionary.has('RevisionNumber')
        ).toBeFalsy();
        expect(
            infoDictionary.has(1041642 as any)
        ).toBeFalsy();
        expect(
            infoDictionary.has(false as any)
        ).toBeFalsy();
        let departmentCallCount: number = 0;
        let invalidCallCount: number = 0;
        receivedEntries.forEach(
            (entry: { key: any; value: any }): void => {
                if (
                    entry.key === 'Department' &&
                    entry.value === 'PDF Development'
                ) {
                    departmentCallCount++;
                }
                if (
                    entry.key === 1041642 ||
                    entry.key === false ||
                    entry.key === 'RevisionNumber'
                ) {
                    invalidCallCount++;
                }
            }
        );
        expect(departmentCallCount).toBe(1);
        expect(invalidCallCount).toBe(0);
        internalDocument._writeInfoString =
            originalWriteInfoString;
        expect(
            internalDocument._writeInfoString
        ).toBe(originalWriteInfoString);
        document.destroy();
    });
    it('1041642 preserves existing XMP custom schema value', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const customMetadata: PdfCustomMetadata =
            new PdfCustomMetadata();
        const xmpMetadata: PdfXmpMetadata =
            new PdfXmpMetadata();
        const schemaData: Map<string, string> =
            xmpMetadata.customSchema.customData;
        customMetadata.set(
            'Department',
            'New Department'
        );
        schemaData.set(
            'Department',
            'Existing Department'
        );
        internalDocument._xmpMetadata = xmpMetadata;
        document.setDocumentInformation({
            customMetadata
        });
        expect(
            xmpMetadata.customSchema.customData.has(
                'Department'
            )
        ).toBeTruthy();
        expect(
            xmpMetadata.customSchema.customData.get(
                'Department'
            )
        ).toBe('Existing Department');
        document.destroy();
    });
    it('1041642 adds custom value to existing XMP metadata', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const customMetadata: PdfCustomMetadata =
            new PdfCustomMetadata();
        const xmpMetadata: PdfXmpMetadata =
            new PdfXmpMetadata();
        customMetadata.set(
            'Department',
            'PDF Development'
        );
        internalDocument._xmpMetadata = xmpMetadata;
        expect(
            xmpMetadata.customSchema.customData.has(
                'Department'
            )
        ).toBeFalsy();
        document.setDocumentInformation({
            customMetadata
        });
        expect(
            internalDocument._xmpMetadata
        ).toBe(xmpMetadata);
        expect(
            xmpMetadata.customSchema.customData.has(
                'Department'
            )
        ).toBeTruthy();
        expect(
            xmpMetadata.customSchema.customData.get(
                'Department'
            )
        ).toBe('PDF Development');
        document.destroy();
    });
});
describe('1041642 PdfDocument _writeInfoString', () => {
    it('1041642 writes string value to information dictionary', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const infoDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        internalDocument._writeInfoString(
            infoDictionary,
            'Department',
            'PDF Development'
        );
        expect(infoDictionary.has('Department')).toBeTruthy();
        expect(infoDictionary.get('Department')).toBe(
            'PDF Development'
        );
        document.destroy();
    });
    it('1041642 does not write null information value', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const infoDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        internalDocument._writeInfoString(
            infoDictionary,
            'Department',
            null
        );
        expect(infoDictionary.has('Department')).toBeFalsy();
        document.destroy();
    });
    it('1041642 does not write non-string information value', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const infoDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        internalDocument._writeInfoString(
            infoDictionary,
            'RevisionNumber',
            1041642
        );
        expect(infoDictionary.has('RevisionNumber')).toBeFalsy();
        document.destroy();
    });
});
describe('1041642 PdfDocument _getInfoDictionary', () => {
    it('1041642 creates information dictionary when existing Info value is invalid', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const trailerDictionary: _PdfDictionary =
            document._crossReference._trailer;
        trailerDictionary.update(
            'Info',
            'Invalid information value'
        );
        const result: _PdfDictionary =
            internalDocument._getInfoDictionary(true);
        const informationReference: _PdfReference =
            trailerDictionary.getRaw(
                'Info'
            ) as _PdfReference;
        expect(result).toBeDefined();
        expect(result instanceof _PdfDictionary).toBeTruthy();
        expect(result).not.toBe(
            'Invalid information value' as any
        );
        expect(informationReference).toBeDefined();
        expect(
            informationReference instanceof _PdfReference
        ).toBeTruthy();
        expect(
            document._crossReference._fetch(
                informationReference
            )
        ).toBe(result);
        expect(result.objId).toBe(
            informationReference.toString()
        );
        document.destroy();
    });
    it('1041642 returns existing direct information dictionary', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const trailerDictionary: _PdfDictionary =
            document._crossReference._trailer;
        const existingDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        existingDictionary.update(
            'Title',
            'PDF Document'
        );
        trailerDictionary.update(
            'Info',
            existingDictionary
        );
        const result: _PdfDictionary =
            internalDocument._getInfoDictionary(false);
        expect(result).toBe(existingDictionary);
        expect(result.get('Title')).toBe('PDF Document');
        document.destroy();
    });
    it('1041642 returns existing referenced information dictionary', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const trailerDictionary: _PdfDictionary =
            document._crossReference._trailer;
        const existingDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        const informationReference: _PdfReference =
            document._crossReference._getNextReference();
        existingDictionary.update(
            'Title',
            'Referenced PDF Document'
        );
        document._crossReference._cacheMap.set(
            informationReference,
            existingDictionary
        );
        trailerDictionary.update(
            'Info',
            informationReference
        );
        const result: _PdfDictionary =
            internalDocument._getInfoDictionary(false);
        expect(result).toBe(existingDictionary);
        expect(result.get('Title')).toBe(
            'Referenced PDF Document'
        );
        document.destroy();
    });
});
describe('1041642 PdfDocument _updatePageCache', () => {
    it('1041642 increments cached page indexes from specified index', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const firstPage: PdfPage = document.addPage();
        const secondPage: PdfPage = document.addPage();
        const thirdPage: PdfPage = document.addPage();
        const originalPageCount: number =
            internalDocument._pageCount;
        internalDocument._updatePageCache(1);
        expect(internalDocument._pages.size).toBe(3);
        expect(internalDocument._pages.get(0)).toBe(firstPage);
        expect(firstPage._pageIndex).toBe(0);
        expect(internalDocument._pages.has(1)).toBeFalsy();
        expect(internalDocument._pages.get(2)).toBe(secondPage);
        expect(secondPage._pageIndex).toBe(2);
        expect(internalDocument._pages.get(3)).toBe(thirdPage);
        expect(thirdPage._pageIndex).toBe(3);
        expect(internalDocument._pageCount).toBe(
            originalPageCount
        );
        document.destroy();
    });
    it('1041642 removes specified cached page and decrements following indexes', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const firstPage: PdfPage = document.addPage();
        const secondPage: PdfPage = document.addPage();
        const thirdPage: PdfPage = document.addPage();
        internalDocument._updatePageCache(
            1,
            false
        );
        expect(internalDocument._pages.size).toBe(2);
        expect(internalDocument._pageCount).toBe(2);
        expect(internalDocument._pages.get(0)).toBe(firstPage);
        expect(firstPage._pageIndex).toBe(0);
        expect(internalDocument._pages.get(1)).toBe(thirdPage);
        expect(thirdPage._pageIndex).toBe(1);
        expect(internalDocument._pages.has(2)).toBeFalsy();
        expect(
            internalDocument._pages.get(0)
        ).not.toBe(secondPage);
        expect(
            internalDocument._pages.get(1)
        ).not.toBe(secondPage);
        document.destroy();
    });
});
describe('1041642 PdfDocument _removePage', () => {
    it('1041642 removes page when bookmark destination map is unavailable', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const pageToRemove: PdfPage = document.addPage();
        const originalParseBookmarkDestination: any =
            internalDocument._parseBookmarkDestination;
        internalDocument._parseBookmarkDestination =
            (): Map<PdfPage, PdfBookmarkBase[]> => {
                return undefined as any;
            };
        internalDocument._removePage(pageToRemove);
        expect(document.pageCount).toBe(0);
        expect(
            document._catalog._topPagesDictionary.get('Kids')
        ).toEqual([]);
        internalDocument._parseBookmarkDestination =
            originalParseBookmarkDestination;
        expect(
            internalDocument._parseBookmarkDestination
        ).toBe(originalParseBookmarkDestination);
        document.destroy();
    });
    it('1041642 ignores unavailable bookmark entry while removing page', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const pageToRemove: PdfPage = document.addPage();
        const bookmarkMap:
            Map<PdfPage, PdfBookmarkBase[]> = new Map();
        const originalParseBookmarkDestination: any =
            internalDocument._parseBookmarkDestination;
        bookmarkMap.set(
            pageToRemove,
            [undefined as any]
        );
        internalDocument._parseBookmarkDestination =
            (): Map<PdfPage, PdfBookmarkBase[]> => {
                return bookmarkMap;
            };
        internalDocument._removePage(pageToRemove);
        expect(document.pageCount).toBe(0);
        expect(
            document._catalog._topPagesDictionary.get('Kids')
        ).toEqual([]);
        internalDocument._parseBookmarkDestination =
            originalParseBookmarkDestination;
        expect(
            internalDocument._parseBookmarkDestination
        ).toBe(originalParseBookmarkDestination);
        document.destroy();
    });
    it('1041642 clears bookmark action and destination', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const pageToRemove: PdfPage = document.addPage();
        const bookmarkDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        const bookmark: PdfBookmarkBase =
            document.bookmarks.add('Page bookmark');
        const bookmarkMap:
            Map<PdfPage, PdfBookmarkBase[]> = new Map();
        const originalParseBookmarkDestination: any =
            internalDocument._parseBookmarkDestination;
        bookmarkDictionary.update(
            'A',
            new _PdfDictionary(document._crossReference)
        );
        bookmarkDictionary.update(
            'Dest',
            'PageDestination'
        );
        bookmark._dictionary = bookmarkDictionary;
        bookmarkMap.set(
            pageToRemove,
            [bookmark]
        );
        internalDocument._parseBookmarkDestination =
            (): Map<PdfPage, PdfBookmarkBase[]> => {
                return bookmarkMap;
            };
        internalDocument._removePage(pageToRemove);
        expect(bookmarkDictionary.has('A')).toBeTruthy();
        expect(bookmarkDictionary.get('A')).toBeNull();
        expect(bookmarkDictionary.has('Dest')).toBeTruthy();
        expect(bookmarkDictionary.get('Dest')).toBeNull();
        expect(document.pageCount).toBe(0);
        internalDocument._parseBookmarkDestination =
            originalParseBookmarkDestination;
        expect(
            internalDocument._parseBookmarkDestination
        ).toBe(originalParseBookmarkDestination);
        document.destroy();
    });
    it('1041642 marks removed page dictionary as not updated', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const pageToRemove: PdfPage = document.addPage();
        const pageDictionary: _PdfDictionary =
            pageToRemove._pageDictionary;
        const originalParseBookmarkDestination: any =
            internalDocument._parseBookmarkDestination;
        internalDocument._parseBookmarkDestination =
            (): Map<PdfPage, PdfBookmarkBase[]> => {
                return undefined as any;
            };
        expect(
            document._crossReference._cacheMap.has(
                pageToRemove._ref
            )
        ).toBeTruthy();
        pageDictionary._updated = true;
        internalDocument._removePage(pageToRemove);
        expect(pageDictionary._updated).toBeFalsy();
        internalDocument._parseBookmarkDestination =
            originalParseBookmarkDestination;
        document.destroy();
    });
    it('1041642 does not change updated state when removed page is not cached', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const firstPage: PdfPage = document.addPage();
        const pageToRemove: PdfPage = document.addPage();
        const pageDictionary: _PdfDictionary =
            pageToRemove._pageDictionary;
        const originalParseBookmarkDestination: any =
            internalDocument._parseBookmarkDestination;
        internalDocument._parseBookmarkDestination =
            (): Map<PdfPage, PdfBookmarkBase[]> => {
                return undefined as any;
            };
        document._crossReference._cacheMap.delete(
            pageToRemove._ref
        );
        pageDictionary._updated = true;
        internalDocument._removePage(pageToRemove);
        expect(firstPage).toBeDefined();
        expect(document.pageCount).toBe(1);
        expect(pageDictionary._updated).toBeTruthy();
        internalDocument._parseBookmarkDestination =
            originalParseBookmarkDestination;
        document.destroy();
    });
    it('1041642 clears top page Kids after removing final page', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const pageToRemove: PdfPage = document.addPage();
        const originalParseBookmarkDestination: any =
            internalDocument._parseBookmarkDestination;
        internalDocument._parseBookmarkDestination =
            (): Map<PdfPage, PdfBookmarkBase[]> => {
                return undefined as any;
            };
        expect(document.pageCount).toBe(1);
        internalDocument._removePage(pageToRemove);
        const kids: _PdfReference[] =
            document._catalog._topPagesDictionary.get(
                'Kids'
            );
        expect(document.pageCount).toBe(0);
        expect(Array.isArray(kids)).toBeTruthy();
        expect(kids.length).toBe(0);
        internalDocument._parseBookmarkDestination =
            originalParseBookmarkDestination;
        document.destroy();
    });
    it('1041642 retains top page Kids while pages remain', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const firstPage: PdfPage = document.addPage();
        const pageToRemove: PdfPage = document.addPage();
        const originalParseBookmarkDestination: any =
            internalDocument._parseBookmarkDestination;
        internalDocument._parseBookmarkDestination =
            (): Map<PdfPage, PdfBookmarkBase[]> => {
                return undefined as any;
            };
        internalDocument._removePage(pageToRemove);
        const kids: _PdfReference[] =
            document._catalog._topPagesDictionary.get(
                'Kids'
            );
        expect(firstPage).toBeDefined();
        expect(document.pageCount).toBe(1);
        expect(Array.isArray(kids)).toBeTruthy();
        expect(kids.length).toBeGreaterThan(0);
        internalDocument._parseBookmarkDestination =
            originalParseBookmarkDestination;
        document.destroy();
    });
    it('1041642 removes form field at index zero from removed page', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const pageToRemove: PdfPage = document.addPage();
        const field: PdfTextBoxField =
            new PdfTextBoxField(
                pageToRemove,
                'CustomerName',
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 20
                }
            );
        const originalParseBookmarkDestination: any =
            internalDocument._parseBookmarkDestination;
        document.form.add(field);
        internalDocument._parseBookmarkDestination =
            (): Map<PdfPage, PdfBookmarkBase[]> => {
                return undefined as any;
            };
        expect(document.form.count).toBe(1);
        expect(document.form.fieldAt(0)).toBe(field);
        internalDocument._removePage(pageToRemove);
        expect(document.form.count).toBe(0);
        internalDocument._parseBookmarkDestination =
            originalParseBookmarkDestination;
        document.destroy();
    });
});
describe('1041642 PdfDocument _removeParent', () => {
    it('1041642 removes reference from parent Kids and decrements count', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const childDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        const parentDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        const parentReference: _PdfReference =
            document._crossReference._getNextReference();
        const retainedReference: _PdfReference =
            document._crossReference._getNextReference();
        const referenceToRemove: _PdfReference =
            document._crossReference._getNextReference();
        parentDictionary.update(
            'Kids',
            [
                retainedReference,
                referenceToRemove
            ]
        );
        parentDictionary.update('Count', 2);
        document._crossReference._cacheMap.set(
            parentReference,
            parentDictionary
        );
        childDictionary.update(
            'Parent',
            parentReference
        );
        internalDocument._removeParent(
            referenceToRemove,
            childDictionary
        );
        const updatedKids: _PdfReference[] =
            parentDictionary.get('Kids');
        expect(Array.isArray(updatedKids)).toBeTruthy();
        expect(updatedKids.length).toBe(1);
        expect(updatedKids[0]).toBe(retainedReference);
        expect(updatedKids[0]).not.toBe(referenceToRemove);
        expect(parentDictionary.get('Count')).toBe(1);
        document.destroy();
    });
    it('1041642 skips parent update when parent dictionary is unavailable', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const childDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        const missingParentReference: _PdfReference =
            document._crossReference._getNextReference();
        const referenceToRemove: _PdfReference =
            document._crossReference._getNextReference();
        childDictionary.update(
            'Parent',
            missingParentReference
        );
        internalDocument._removeParent(
            referenceToRemove,
            childDictionary
        );
        expect(childDictionary.has('Parent')).toBeTruthy();
        expect(
            childDictionary.getRaw('Parent')
        ).toBe(missingParentReference);
        document.destroy();
    });
    it('1041642 skips parent update when Kids entry is unavailable', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const childDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        const parentDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        const parentReference: _PdfReference =
            document._crossReference._getNextReference();
        const referenceToRemove: _PdfReference =
            document._crossReference._getNextReference();
        parentDictionary.update('Count', 1);
        document._crossReference._cacheMap.set(
            parentReference,
            parentDictionary
        );
        childDictionary.update(
            'Parent',
            parentReference
        );
        internalDocument._removeParent(
            referenceToRemove,
            childDictionary
        );
        expect(parentDictionary.has('Kids')).toBeFalsy();
        expect(parentDictionary.get('Count')).toBe(1);
        document.destroy();
    });
});
describe('1041642 PdfDocument _parseBookmarkDestination', () => {
    it('1041642 groups direct destination bookmarks by page', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const page: PdfPage = document.addPage();
        const firstBookmark: PdfBookmark =
            document.bookmarks.add('First bookmark');
        const secondBookmark: PdfBookmark =
            document.bookmarks.add('Second bookmark');
        firstBookmark.destination =
            new PdfDestination(page);
        secondBookmark.destination =
            new PdfDestination(page);
        internalDocument._bookmarkHashTable = undefined;
        const result:
            Map<PdfPage, PdfBookmarkBase[]> =
            internalDocument._parseBookmarkDestination();
        let mappedPage: PdfPage | undefined;
        let pageBookmarks: PdfBookmarkBase[] | undefined;
        result.forEach(
            (
                bookmarks: PdfBookmarkBase[],
                destinationPage: PdfPage
            ): void => {
                mappedPage = destinationPage;
                pageBookmarks = bookmarks;
            }
        );
        expect(result).toBeDefined();
        expect(result.size).toBe(1);
        expect(mappedPage).toBeDefined();
        expect((mappedPage as any)._ref).toBe(page._ref);
        expect(pageBookmarks).toBeDefined();
        expect((pageBookmarks as any).length).toBe(2);
        expect(
            (pageBookmarks as any)[0]._dictionary
        ).toBe(firstBookmark._dictionary);
        expect(
            (pageBookmarks as any)[1]._dictionary
        ).toBe(secondBookmark._dictionary);
        document.destroy();
    });
    it('1041642 visits child bookmark destinations', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const page: PdfPage = document.addPage();
        const parentBookmark: PdfBookmark =
            document.bookmarks.add(
                'Parent bookmark'
            );
        const childBookmark: PdfBookmark =
            parentBookmark.add(
                'Child bookmark'
            );
        childBookmark.destination =
            new PdfDestination(page);
        internalDocument._bookmarkHashTable = undefined;
        const result:
            Map<PdfPage, PdfBookmarkBase[]> =
            internalDocument._parseBookmarkDestination();
        let mappedPage: PdfPage | undefined;
        let pageBookmarks: PdfBookmarkBase[] | undefined;
        result.forEach(
            (
                bookmarks: PdfBookmarkBase[],
                destinationPage: PdfPage
            ): void => {
                mappedPage = destinationPage;
                pageBookmarks = bookmarks;
            }
        );
        expect(parentBookmark.count).toBeGreaterThan(0);
        expect(result).toBeDefined();
        expect(result.size).toBe(1);
        expect(mappedPage).toBeDefined();
        expect((mappedPage as any)._ref).toBe(page._ref);
        expect(pageBookmarks).toBeDefined();
        expect((pageBookmarks as any).length).toBe(1);
        expect(
            (pageBookmarks as any)[0]._dictionary
        ).toBe(childBookmark._dictionary);
        document.destroy();
    });
});
describe('1041642 PdfDocument _removeInternalTemplates', () => {
    it('1041642 updates named page templates after removing matching page', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const page: PdfPage = document.addPage();
        const dictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        const namedObject: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        const templateName: string = 'TemplateOne';
        namedObject.update(
            'Names',
            [
                templateName,
                page._pageDictionary
            ]
        );
        dictionary.update(
            'Templates',
            namedObject
        );
        internalDocument._removeInternalTemplates(
            dictionary,
            'Templates',
            page
        );
        const updatedReference: _PdfReference =
            dictionary.getRaw(
                'Templates'
            ) as _PdfReference;
        const updatedDictionary: _PdfDictionary =
            document._crossReference._fetch(
                updatedReference
            ) as _PdfDictionary;
        const updatedNames: any[] =
            updatedDictionary.getArray('Names') as any;
        expect(
            dictionary.has('Templates')
        ).toBeTruthy();
        expect(updatedReference).toBeDefined();
        expect(
            updatedReference instanceof _PdfReference
        ).toBeTruthy();
        expect(updatedDictionary).toBeDefined();
        expect(updatedDictionary.has('Names')).toBeTruthy();
        expect(updatedDictionary.has('')).toBeFalsy();
        expect(Array.isArray(updatedNames)).toBeTruthy();
        expect(updatedNames.length).toBe(0);
        expect(updatedDictionary.objId).toBe(
            updatedReference.toString()
        );
        document.destroy();
    });
    it('1041642 does not update dictionary when template key is unavailable', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const page: PdfPage = document.addPage();
        const dictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        internalDocument._removeInternalTemplates(
            dictionary,
            'Templates',
            page
        );
        expect(
            dictionary.has('Templates')
        ).toBeFalsy();
        expect(dictionary.has('')).toBeFalsy();
        document.destroy();
    });
    it('1041642 ignores template value without Names entry', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const page: PdfPage = document.addPage();
        const dictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        const namedObject: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        dictionary.update(
            'Templates',
            namedObject
        );
        internalDocument._removeInternalTemplates(
            dictionary,
            'Templates',
            page
        );
        expect(
            dictionary.get('Templates')
        ).toBe(namedObject);
        expect(namedObject.has('Names')).toBeFalsy();
        expect(namedObject.has('')).toBeFalsy();
        document.destroy();
    });
    it('1041642 ignores null named template object', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const page: PdfPage = document.addPage();
        const dictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        dictionary.update(
            'Templates',
            null
        );
        internalDocument._removeInternalTemplates(
            dictionary,
            'Templates',
            page
        );
        expect(
            dictionary.has('Templates')
        ).toBeTruthy();
        expect(
            dictionary.get('Templates')
        ).toBeNull();
        document.destroy();
    });
    it('1041642 ignores empty named page template collection', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const page: PdfPage = document.addPage();
        const dictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        const namedObject: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        const emptyNames: any[] = [];
        namedObject.update(
            'Names',
            emptyNames
        );
        dictionary.update(
            'Templates',
            namedObject
        );
        internalDocument._removeInternalTemplates(
            dictionary,
            'Templates',
            page
        );
        const retainedObject: _PdfDictionary =
            dictionary.get('Templates');
        const retainedNames: any[] =
            retainedObject.getArray('Names') as any;
        expect(retainedObject).toBe(namedObject);
        expect(retainedObject.has('Names')).toBeTruthy();
        expect(Array.isArray(retainedNames)).toBeTruthy();
        expect(retainedNames).toEqual([]);
        expect(retainedNames.length).toBe(0);
        expect(dictionary.has('')).toBeFalsy();
        document.destroy();
    });
    it('1041642 groups direct destination bookmarks by page', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const page: PdfPage = document.addPage();
        const firstBookmark: PdfBookmark =
            document.bookmarks.add('First bookmark');
        const secondBookmark: PdfBookmark =
            document.bookmarks.add('Second bookmark');
        const mappedPages: PdfPage[] = [];
        const mappedBookmarkCollections: PdfBookmarkBase[][] = [];
        firstBookmark.destination =
            new PdfDestination(page);
        secondBookmark.destination =
            new PdfDestination(page);
        internalDocument._bookmarkHashTable = undefined;
        const result: Map<PdfPage, PdfBookmarkBase[]> =
            internalDocument._parseBookmarkDestination();
        result.forEach((
            bookmarks: PdfBookmarkBase[],
            destinationPage: PdfPage
        ): void => {
            mappedPages.push(destinationPage);
            mappedBookmarkCollections.push(bookmarks);
        });
        expect(result).toBeDefined();
        expect(result.size).toBe(1);
        expect(mappedPages.length).toBe(1);
        expect(mappedPages[0]._ref).toBe(page._ref);
        expect(mappedBookmarkCollections.length).toBe(1);
        expect(mappedBookmarkCollections[0].length).toBe(2);
        expect(
            mappedBookmarkCollections[0][0]._dictionary
        ).toBe(firstBookmark._dictionary);
        expect(
            mappedBookmarkCollections[0][1]._dictionary
        ).toBe(secondBookmark._dictionary);
        document.destroy();
    });
});
describe('1041642 PdfDocument _getUpdatedPageTemplates', () => {
    it('1041642 removes matching template pair', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const page: PdfPage = document.addPage();
        const namedPages: any[] = [
            'TemplateOne',
            page._pageDictionary
        ];
        const result: any[] =
            internalDocument._getUpdatedPageTemplates(
                namedPages,
                page
            );
        expect(result).toBe(namedPages);
        expect(result.length).toBe(0);
        document.destroy();
    });
    it('1041642 retains template pair for different page dictionary', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const page: PdfPage = document.addPage();
        const otherPage: PdfPage = document.addPage();
        const namedPages: any[] = [
            'TemplateOne',
            otherPage._pageDictionary
        ];
        const result: any[] =
            internalDocument._getUpdatedPageTemplates(
                namedPages,
                page
            );
        expect(result).toBe(namedPages);
        expect(result.length).toBe(2);
        expect(result[0]).toBe('TemplateOne');
        expect(result[1]).toBe(
            otherPage._pageDictionary
        );
        expect(result[1]).not.toBe(
            page._pageDictionary
        );
        document.destroy();
    });
    it('1041642 returns empty template collection unchanged', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const page: PdfPage = document.addPage();
        const namedPages: any[] = [];
        const result: any[] =
            internalDocument._getUpdatedPageTemplates(
                namedPages,
                page
            );
        expect(result).toBe(namedPages);
        expect(result.length).toBe(0);
        document.destroy();
    });
    it('1041642 retains template when page dictionary is unavailable', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const page: PdfPage = document.addPage();
        const namedPages: any[] = [
            'TemplateOne',
            undefined
        ];
        const result: any[] =
            internalDocument._getUpdatedPageTemplates(
                namedPages,
                page
            );
        expect(result).toBe(namedPages);
        expect(result.length).toBe(2);
        expect(result[0]).toBe('TemplateOne');
        expect(result[1]).toBeUndefined();
        document.destroy();
    });
});
describe('1041642 PdfDocument _sortedArray', () => {
    it('1041642 removes duplicate values while preserving order', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const order: number[] = [
            3,
            1,
            3,
            2,
            1,
            4,
            2
        ];
        const result: number[] =
            internalDocument._sortedArray(order);
        expect(result).toEqual([
            3,
            1,
            2,
            4
        ]);
        expect(result.length).toBe(4);
        expect(result[0]).toBe(3);
        expect(result[1]).toBe(1);
        expect(result[2]).toBe(2);
        expect(result[3]).toBe(4);
        document.destroy();
    });
    it('1041642 returns empty array for empty order', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const result: number[] =
            internalDocument._sortedArray([]);
        expect(result).toEqual([]);
        expect(result.length).toBe(0);
        document.destroy();
    });
});
describe('1041642 PdfDocument reorderPages', () => {
    it('1041642 validates every page number before reordering', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        expect((): void => {
            document.reorderPages([
                0,
                5
            ]);
        }).toThrowError('Index out of range');
        expect(document.pageCount).toBe(2);
        document.destroy();
    });
    it('1041642 preserves input order array while reordering pages', () => {
        const document: PdfDocument = new PdfDocument();
        const firstPage: PdfPage = document.addPage();
        const secondPage: PdfPage = document.addPage();
        const thirdPage: PdfPage = document.addPage();
        const firstReference: _PdfReference =
            firstPage._ref;
        const secondReference: _PdfReference =
            secondPage._ref;
        const thirdReference: _PdfReference =
            thirdPage._ref;
        const order: number[] = [
            2,
            0,
            1
        ];
        document.reorderPages(order);
        expect(order).toEqual([
            2,
            0,
            1
        ]);
        expect(document.pageCount).toBe(3);
        expect(document.getPage(0)._ref).toBe(
            thirdReference
        );
        expect(document.getPage(1)._ref).toBe(
            firstReference
        );
        expect(document.getPage(2)._ref).toBe(
            secondReference
        );
        document.destroy();
    });
    it('1041642 creates valid section dictionaries for reordered pages', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        document.reorderPages([
            2,
            0,
            1
        ]);
        const topPagesDictionary: _PdfDictionary =
            document._catalog._topPagesDictionary;
        const topPageKids: _PdfReference[] =
            topPagesDictionary.get('Kids');
        expect(Array.isArray(topPageKids)).toBeTruthy();
        expect(topPageKids.length).toBe(3);
        expect(topPagesDictionary.has('')).toBeFalsy();
        for (
            let index: number = 0;
            index < topPageKids.length;
            index++
        ) {
            const sectionReference: _PdfReference =
                topPageKids[index];
            const sectionDictionary: _PdfDictionary =
                document._crossReference._fetch(
                    sectionReference
                ) as _PdfDictionary;
            const sectionKids: _PdfReference[] =
                sectionDictionary.get('Kids');
            const page: PdfPage =
                document.getPage(index);
            expect(sectionDictionary).toBeDefined();
            expect(sectionDictionary.has('Type')).toBeTruthy();
            expect(
                sectionDictionary.get('Type').name
            ).toBe('Pages');
            expect(
                sectionDictionary.get('Type').name
            ).not.toBe('');
            expect(sectionDictionary.has('Count')).toBeTruthy();
            expect(sectionDictionary.get('Count')).toBe(1);
            expect(sectionDictionary.has('Parent')).toBeTruthy();
            expect(
                sectionDictionary.getRaw('Parent')
            ).toBe(
                document._catalog._catalogDictionary.getRaw(
                    'Pages'
                )
            );
            expect(sectionDictionary.has('Kids')).toBeTruthy();
            expect(Array.isArray(sectionKids)).toBeTruthy();
            expect(sectionKids.length).toBe(1);
            expect(sectionKids[0]).toBe(page._ref);
            expect(sectionDictionary.has('')).toBeFalsy();
            expect(
                page._pageDictionary.getRaw('Parent')
            ).toBe(sectionReference);
            expect(
                page._pageDictionary.has('')
            ).toBeFalsy();
        }
        document.destroy();
    });
    it('1041642 replaces top page Kids with reordered sections', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        document.addPage();
        document.addPage();
        document.addPage();
        document.reorderPages([
            1,
            2,
            0
        ]);
        const topPagesDictionary: _PdfDictionary =
            document._catalog._topPagesDictionary;
        const sectionReferences: _PdfReference[] =
            topPagesDictionary.get('Kids');
        expect(internalDocument._catalog).toBeDefined();
        expect(topPagesDictionary).toBeDefined();
        expect(topPagesDictionary.has('Kids')).toBeTruthy();
        expect(topPagesDictionary.has('')).toBeFalsy();
        expect(Array.isArray(sectionReferences)).toBeTruthy();
        expect(sectionReferences.length).toBe(3);
        sectionReferences.forEach(
            (
                sectionReference: _PdfReference,
                index: number
            ): void => {
                const sectionDictionary: _PdfDictionary =
                    document._crossReference._fetch(
                        sectionReference
                    ) as _PdfDictionary;
                const sectionKids: _PdfReference[] =
                    sectionDictionary.get('Kids');
                expect(sectionDictionary).toBeDefined();
                expect(sectionKids.length).toBe(1);
                expect(sectionKids[0]).toBe(
                    document.getPage(index)._ref
                );
            }
        );
        document.destroy();
    });
    it('1041642 does not copy custom values from a non-Pages parent', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const parentReference: _PdfReference =
            page._pageDictionary.getRaw(
                'Parent'
            ) as _PdfReference;
        const parentDictionary: _PdfDictionary =
            document._crossReference._fetch(
                parentReference
            ) as _PdfDictionary;
        const pageType: any =
            page._pageDictionary.get('Type');
        parentDictionary.update(
            'Type',
            pageType
        );
        parentDictionary.update(
            'SectionLabel',
            'Not a Pages dictionary'
        );
        document.reorderPages([
            0
        ]);
        const reorderedPage: PdfPage =
            document.getPage(0);
        const reorderedParentReference: _PdfReference =
            reorderedPage._pageDictionary.getRaw(
                'Parent'
            ) as _PdfReference;
        const reorderedSection: _PdfDictionary =
            document._crossReference._fetch(
                reorderedParentReference
            ) as _PdfDictionary;
        expect(pageType.name).toBe('Page');
        expect(
            reorderedSection.has('SectionLabel')
        ).toBeFalsy();
        document.destroy();
    });
});
describe('1041642 PdfDocument _cloneResources', () => {
    it('1041642 sets source resources when target has no resources', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const sourceResources: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        const targetDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        sourceResources.update(
            'ProcSet',
            'PDF'
        );
        internalDocument._cloneResources(
            sourceResources,
            targetDictionary
        );
        expect(targetDictionary.has('Resources')).toBeTruthy();
        expect(
            targetDictionary.get('Resources')
        ).toBe(sourceResources);
        expect(
            targetDictionary.get('Resources').get(
                'ProcSet'
            )
        ).toBe('PDF');
        document.destroy();
    });
    it('1041642 adds missing primitive resource to target', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const sourceResources: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        const targetResources: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        const targetDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        sourceResources.update(
            'ProcSet',
            'PDF'
        );
        targetDictionary.update(
            'Resources',
            targetResources
        );
        internalDocument._cloneResources(
            sourceResources,
            targetDictionary
        );
        expect(targetDictionary.has('Resources')).toBeTruthy();
        expect(targetResources.has('ProcSet')).toBeTruthy();
        expect(targetResources.get('ProcSet')).toBe('PDF');
        document.destroy();
    });
    it('1041642 merges existing resource arrays', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const sourceResources: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        const targetResources: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        const targetDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        const sourceArray: string[] = [
            'PDF',
            'Text'
        ];
        const targetArray: string[] = [
            'PDF'
        ];
        sourceResources.update(
            'ProcSet',
            sourceArray
        );
        targetResources.update(
            'ProcSet',
            targetArray
        );
        targetDictionary.update(
            'Resources',
            targetResources
        );
        internalDocument._cloneResources(
            sourceResources,
            targetDictionary
        );
        const result: string[] =
            targetResources.get('ProcSet');
        expect(Array.isArray(result)).toBeTruthy();
        expect(result).toEqual([
            'PDF',
            'Text'
        ]);
        expect(result.length).toBe(2);
        expect(result[0]).toBe('PDF');
        expect(result[1]).toBe('Text');
        expect(targetResources._updated).toBeTruthy();
        document.destroy();
    });
});
describe('1041642 PdfDocument _cloneInnerResources', () => {
    it('1041642 does not mark dictionary updated without new inner values', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const resourceDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        const existingFontResources: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        const incomingFontResources: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        existingFontResources.update(
            'F1',
            'ExistingFont'
        );
        incomingFontResources.update(
            'F1',
            'IncomingFont'
        );
        resourceDictionary.update(
            'Font',
            existingFontResources
        );
        resourceDictionary._updated = false;
        internalDocument._cloneInnerResources(
            'Font',
            incomingFontResources,
            resourceDictionary
        );
        expect(resourceDictionary._updated).toBeFalsy();
        expect(
            resourceDictionary.get('Font')
        ).toBe(existingFontResources);
        expect(
            existingFontResources.get('F1')
        ).toBe('ExistingFont');
        document.destroy();
    });
    it('1041642 ignores primitive inner resource value', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const resourceDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        resourceDictionary._updated = false;
        internalDocument._cloneInnerResources(
            'ProcSet',
            'PDF',
            resourceDictionary
        );
        expect(resourceDictionary.has('ProcSet')).toBeFalsy();
        expect(resourceDictionary._updated).toBeFalsy();
        document.destroy();
    });
    it('1041642 adds only missing inner array entries', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const resourceDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        const existingArray: string[] = [
            'PDF'
        ];
        const incomingArray: string[] = [
            'PDF',
            'Text'
        ];
        resourceDictionary.update(
            'ProcSet',
            existingArray
        );
        resourceDictionary._updated = false;
        internalDocument._cloneInnerResources(
            'ProcSet',
            incomingArray,
            resourceDictionary
        );
        const result: string[] =
            resourceDictionary.get('ProcSet');
        expect(result).toBe(existingArray);
        expect(result).toEqual([
            'PDF',
            'Text'
        ]);
        expect(result.length).toBe(2);
        expect(resourceDictionary._updated).toBeTruthy();
        document.destroy();
    });
    it('1041642 does not update resources when array contains no new entries', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const resourceDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        const existingArray: string[] = [
            'PDF',
            'Text'
        ];
        const incomingArray: string[] = [
            'PDF',
            'Text'
        ];
        resourceDictionary.update(
            'ProcSet',
            existingArray
        );
        resourceDictionary._updated = false;
        internalDocument._cloneInnerResources(
            'ProcSet',
            incomingArray,
            resourceDictionary
        );
        const result: string[] =
            resourceDictionary.get('ProcSet');
        expect(result).toBe(existingArray);
        expect(result).toEqual([
            'PDF',
            'Text'
        ]);
        expect(result.length).toBe(2);
        expect(resourceDictionary._updated).toBeFalsy();
        document.destroy();
    });
});
describe('1041642 PdfDocument save', () => {
    it('1041642 saves PDF bytes with application PDF content type', (done: DoneFn) => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalSave: any = Save.save;
        const originalCrossReferenceSave: any =
            document._crossReference._save;
        const originalPostProcess: any =
            internalDocument._doPostProcess;
        const expectedBytes: Uint8Array =
            new Uint8Array([
                37, 80, 68, 70, 45,
                49, 46, 52
            ]);
        let receivedFileName: string = '';
        let receivedBlob: Blob | undefined;
        document.addPage();
        internalDocument._doPostProcess =
            (_flatten: boolean): void => {
                return;
            };
        document._crossReference._save =
            (): Uint8Array => {
                return expectedBytes;
            };
        Save.save = (
            fileName: string,
            blob: Blob
        ): void => {
            receivedFileName = fileName;
            receivedBlob = blob;
        };
        document.save('output.pdf');
        expect(receivedFileName).toBe('output.pdf');
        expect(receivedBlob).toBeDefined();
        expect((receivedBlob as any).type).toBe('application/pdf');
        expect((receivedBlob as any).type).not.toBe('');
        expect((receivedBlob as any).size).toBe(expectedBytes.length);
        expect((receivedBlob as any).size).toBeGreaterThan(0);
        Save.save = originalSave;
        document._crossReference._save =
            originalCrossReferenceSave;
        internalDocument._doPostProcess =
            originalPostProcess;
        expect(Save.save).toBe(originalSave);
        expect(document._crossReference._save).toBe(
            originalCrossReferenceSave
        );
        expect(internalDocument._doPostProcess).toBe(
            originalPostProcess
        );
        (receivedBlob as any).arrayBuffer().then(
            (buffer: ArrayBuffer): void => {
                const actualBytes: Uint8Array =
                    new Uint8Array(buffer);
                expect(actualBytes).toEqual(expectedBytes);
                expect(actualBytes.length).toBe(
                    expectedBytes.length
                );
                document.destroy();
                done();
            }
        );
    });
});
describe('1041642 PdfDocument saveAsync', () => {
    it('1041642 does not add page to a loaded empty document', (done: DoneFn) => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalAddSection: any =
            document.addSection;
        const originalPostProcess: any =
            internalDocument._doPostProcess;
        const originalSaveAsync: any =
            document._crossReference._saveAsync;
        const expectedBytes: Uint8Array =
            new Uint8Array([
                37, 80, 68, 70
            ]);
        let addSectionCallCount: number = 0;
        internalDocument._isLoaded = true;
        internalDocument._pageCount = 0;
        document.addSection =
            (): PdfSection => {
                addSectionCallCount++;
                return originalAddSection.call(
                    document
                );
            };
        internalDocument._doPostProcess =
            (_flatten: boolean): void => {
                return;
            };
        document._crossReference._saveAsync =
            (): Promise<Uint8Array> => {
                return Promise.resolve(expectedBytes);
            };
        document.saveAsync().then(
            (result: Uint8Array): void => {
                expect(result).toEqual(expectedBytes);
                expect(addSectionCallCount).toBe(0);
                expect(document.pageCount).toBe(0);
                document.addSection =
                    originalAddSection;
                internalDocument._doPostProcess =
                    originalPostProcess;
                document._crossReference._saveAsync =
                    originalSaveAsync;
                expect(document.addSection).toBe(
                    originalAddSection
                );
                expect(internalDocument._doPostProcess).toBe(
                    originalPostProcess
                );
                expect(
                    document._crossReference._saveAsync
                ).toBe(originalSaveAsync);
                document.destroy();
                done();
            }
        );
    });
    it('1041642 returns asynchronous PDF bytes when filename is unavailable', (done: DoneFn) => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalPostProcess: any =
            internalDocument._doPostProcess;
        const originalSaveAsync: any =
            document._crossReference._saveAsync;
        const expectedBytes: Uint8Array =
            new Uint8Array([
                37, 80, 68, 70
            ]);
        document.addPage();
        internalDocument._doPostProcess =
            (_flatten: boolean): void => {
                return;
            };
        document._crossReference._saveAsync =
            (): Promise<Uint8Array> => {
                return Promise.resolve(expectedBytes);
            };
        document.saveAsync().then(
            (result: Uint8Array): void => {
                expect(result).toBeDefined();
                expect(result).toEqual(expectedBytes);
                expect(result.length).toBe(
                    expectedBytes.length
                );
                internalDocument._doPostProcess =
                    originalPostProcess;
                document._crossReference._saveAsync =
                    originalSaveAsync;
                expect(internalDocument._doPostProcess).toBe(
                    originalPostProcess
                );
                expect(
                    document._crossReference._saveAsync
                ).toBe(originalSaveAsync);
                document.destroy();
                done();
            }
        );
    });
});
describe('1041642 PdfDocument saveAsBlob', () => {
    it('1041642 saves PDF bytes with application PDF content type', (done: DoneFn) => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalSave: any =
            Save.save;
        const originalCrossReferenceSave: any =
            document._crossReference._save;
        const originalPostProcess: any =
            internalDocument._doPostProcess;
        const expectedBytes: Uint8Array =
            new Uint8Array([
                37, 80, 68, 70, 45,
                49, 46, 52
            ]);
        let receivedFileName: string = '';
        let receivedBlob: Blob | undefined;
        document.addPage();
        internalDocument._doPostProcess =
            (_flatten: boolean): void => {
                return;
            };
        document._crossReference._save =
            (): Uint8Array => {
                return expectedBytes;
            };
        Save.save = (
            fileName: string,
            blob: Blob
        ): void => {
            receivedFileName = fileName;
            receivedBlob = blob;
        };
        document.save('output.pdf');
        expect(receivedFileName).toBe('output.pdf');
        expect(receivedBlob).toBeDefined();
        const savedBlob: Blob = receivedBlob as Blob;
        expect(savedBlob.type).toBe('application/pdf');
        expect(savedBlob.type).not.toBe('');
        expect(savedBlob.size).toBe(expectedBytes.length);
        expect(savedBlob.size).toBeGreaterThan(0);
        Save.save = originalSave;
        document._crossReference._save =
            originalCrossReferenceSave;
        internalDocument._doPostProcess =
            originalPostProcess;
        expect(Save.save).toBe(originalSave);
        expect(document._crossReference._save).toBe(
            originalCrossReferenceSave
        );
        expect(internalDocument._doPostProcess).toBe(
            originalPostProcess
        );
        const reader: FileReader = new FileReader();
        reader.onload = (): void => {
            const buffer: ArrayBuffer =
                reader.result as ArrayBuffer;
            const actualBytes: Uint8Array =
                new Uint8Array(buffer);
            expect(actualBytes).toEqual(expectedBytes);
            expect(actualBytes.length).toBe(
                expectedBytes.length
            );
            document.destroy();
            done();
        };
        reader.readAsArrayBuffer(savedBlob);
    });
});
describe('1041642 PdfDocument exportAnnotations', () => {
    it('1041642 enables export state while exporting annotations', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalExportAnnotations: any =
            _XfdfDocument.prototype._exportAnnotations;
        const expectedBytes: Uint8Array =
            new Uint8Array([1, 2, 3]);
        _XfdfDocument.prototype._exportAnnotations =
            function (_document: PdfDocument): Uint8Array {
                return expectedBytes;
            };
        internalDocument._isExport = false;
        const result: Uint8Array =
            document.exportAnnotations();
        expect(internalDocument._isExport).toBeTruthy();
        expect(result).toBe(expectedBytes);
        expect(result).toEqual(expectedBytes);
        _XfdfDocument.prototype._exportAnnotations =
            originalExportAnnotations;
        expect(
            _XfdfDocument.prototype._exportAnnotations
        ).toBe(originalExportAnnotations);
        document.destroy();
    });
    it('1041642 uses annotation settings supplied as second argument', () => {
        const document: PdfDocument = new PdfDocument();
        const settings: PdfAnnotationExportSettings =
            new PdfAnnotationExportSettings();
        const originalJsonExport: any =
            _JsonDocument.prototype._exportAnnotations;
        const originalXfdfExport: any =
            _XfdfDocument.prototype._exportAnnotations;
        const expectedBytes: Uint8Array =
            new Uint8Array([10, 20, 30]);
        const defaultBytes: Uint8Array =
            new Uint8Array([40, 50]);
        let jsonCallCount: number = 0;
        let xfdfCallCount: number = 0;
        settings.dataFormat = DataFormat.json;
        _JsonDocument.prototype._exportAnnotations =
            function (_document: PdfDocument): Uint8Array {
                jsonCallCount++;
                return expectedBytes;
            };
        _XfdfDocument.prototype._exportAnnotations =
            function (_document: PdfDocument): Uint8Array {
                xfdfCallCount++;
                return defaultBytes;
            };
        const result: Uint8Array =
            document.exportAnnotations(
                undefined as any,
                settings
            ) as any;
        expect(result).toBe(expectedBytes);
        expect(result).toEqual(expectedBytes);
        expect(jsonCallCount).toBe(1);
        expect(xfdfCallCount).toBe(0);
        _JsonDocument.prototype._exportAnnotations =
            originalJsonExport;
        _XfdfDocument.prototype._exportAnnotations =
            originalXfdfExport;
        expect(
            _JsonDocument.prototype._exportAnnotations
        ).toBe(originalJsonExport);
        expect(
            _XfdfDocument.prototype._exportAnnotations
        ).toBe(originalXfdfExport);
        document.destroy();
    });
    it('1041642 ignores invalid second annotation settings argument', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalXfdfExport: any =
            _XfdfDocument.prototype._exportAnnotations;
        const expectedBytes: Uint8Array =
            new Uint8Array([35, 36]);
        let xfdfCallCount: number = 0;
        _XfdfDocument.prototype._exportAnnotations =
            function (_document: PdfDocument): Uint8Array {
                xfdfCallCount++;
                return expectedBytes;
            };
        const result: Uint8Array =
            internalDocument.exportAnnotations(
                undefined,
                'invalid settings'
            );
        expect(result).toBe(expectedBytes);
        expect(result).toEqual(expectedBytes);
        expect(xfdfCallCount).toBe(1);
        _XfdfDocument.prototype._exportAnnotations =
            originalXfdfExport;
        expect(
            _XfdfDocument.prototype._exportAnnotations
        ).toBe(originalXfdfExport);
        document.destroy();
    });
    it('1041642 saves annotation bytes using text plain Blob', (done: DoneFn) => {
        const document: PdfDocument = new PdfDocument();
        const originalFileSave: any =
            Save.save;
        const originalExportAnnotations: any =
            _XfdfDocument.prototype._exportAnnotations;
        const expectedBytes: Uint8Array =
            new Uint8Array([
                60, 120, 102, 100, 102, 62
            ]);
        let receivedFileName: string = '';
        let receivedBlob: Blob | undefined;
        _XfdfDocument.prototype._exportAnnotations =
            function (_document: PdfDocument): Uint8Array {
                return expectedBytes;
            };
        Save.save = (
            fileName: string,
            blob: Blob
        ): void => {
            receivedFileName = fileName;
            receivedBlob = blob;
        };
        document.exportAnnotations(
            'annotations.xfdf'
        );
        expect(receivedFileName).toBe(
            'annotations.xfdf'
        );
        expect(receivedBlob).toBeDefined();
        const savedBlob: Blob =
            receivedBlob as Blob;
        expect(savedBlob.type).toBe('text/plain');
        expect(savedBlob.type).not.toBe('');
        expect(savedBlob.size).toBe(
            expectedBytes.length
        );
        expect(savedBlob.size).toBeGreaterThan(0);
        Save.save =
            originalFileSave;
        _XfdfDocument.prototype._exportAnnotations =
            originalExportAnnotations;
        expect(Save.save).toBe(
            originalFileSave
        );
        expect(
            _XfdfDocument.prototype._exportAnnotations
        ).toBe(originalExportAnnotations);
        const reader: FileReader =
            new FileReader();
        reader.onload = (): void => {
            const buffer: ArrayBuffer =
                reader.result as ArrayBuffer;
            const actualBytes: Uint8Array =
                new Uint8Array(buffer);
            expect(actualBytes).toEqual(
                expectedBytes
            );
            expect(actualBytes.length).toBe(
                expectedBytes.length
            );
            document.destroy();
            done();
        };
        reader.readAsArrayBuffer(savedBlob);
    });
});
describe('1041642 PdfDocument exportFormData', () => {
    it('1041642 uses form export settings supplied as second argument', () => {
        const document: PdfDocument = new PdfDocument();
        const settings: PdfFormFieldExportSettings =
            new PdfFormFieldExportSettings();
        const originalJsonExport: any =
            _JsonDocument.prototype._exportFormFields;
        const originalXfdfExport: any =
            _XfdfDocument.prototype._exportFormFields;
        const expectedBytes: Uint8Array =
            new Uint8Array([11, 22, 33]);
        const defaultBytes: Uint8Array =
            new Uint8Array([44, 55]);
        let jsonCallCount: number = 0;
        let xfdfCallCount: number = 0;
        settings.dataFormat = DataFormat.json;
        _JsonDocument.prototype._exportFormFields =
            function (_document: PdfDocument): Uint8Array {
                jsonCallCount++;
                return expectedBytes;
            };
        _XfdfDocument.prototype._exportFormFields =
            function (_document: PdfDocument): Uint8Array {
                xfdfCallCount++;
                return defaultBytes;
            };
        const result: Uint8Array =
            document.exportFormData(
                undefined as any,
                settings
            ) as any;
        expect(result).toBe(expectedBytes);
        expect(result).toEqual(expectedBytes);
        expect(jsonCallCount).toBe(1);
        expect(xfdfCallCount).toBe(0);
        _JsonDocument.prototype._exportFormFields =
            originalJsonExport;
        _XfdfDocument.prototype._exportFormFields =
            originalXfdfExport;
        expect(
            _JsonDocument.prototype._exportFormFields
        ).toBe(originalJsonExport);
        expect(
            _XfdfDocument.prototype._exportFormFields
        ).toBe(originalXfdfExport);
        document.destroy();
    });
    it('1041642 ignores invalid second form export settings argument', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalXfdfExport: any =
            _XfdfDocument.prototype._exportFormFields;
        const expectedBytes: Uint8Array =
            new Uint8Array([65, 66]);
        let xfdfCallCount: number = 0;
        _XfdfDocument.prototype._exportFormFields =
            function (_document: PdfDocument): Uint8Array {
                xfdfCallCount++;
                return expectedBytes;
            };
        const result: Uint8Array =
            internalDocument.exportFormData(
                undefined,
                'invalid settings'
            );
        expect(result).toBe(expectedBytes);
        expect(result).toEqual(expectedBytes);
        expect(xfdfCallCount).toBe(1);
        _XfdfDocument.prototype._exportFormFields =
            originalXfdfExport;
        expect(
            _XfdfDocument.prototype._exportFormFields
        ).toBe(originalXfdfExport);
        document.destroy();
    });
    it('1041642 disables specification mode for default form export', () => {
        const document: PdfDocument = new PdfDocument();
        const originalXfdfExport: any =
            _XfdfDocument.prototype._exportFormFields;
        const expectedBytes: Uint8Array =
            new Uint8Array([70, 71]);
        let receivedSpecificationMode: boolean = true;
        _XfdfDocument.prototype._exportFormFields =
            function (_document: PdfDocument): Uint8Array {
                receivedSpecificationMode =
                    (this as any)._asPerSpecification;
                return expectedBytes;
            };
        const result: Uint8Array =
            document.exportFormData();
        expect(result).toBe(expectedBytes);
        expect(receivedSpecificationMode).toBeFalsy();
        _XfdfDocument.prototype._exportFormFields =
            originalXfdfExport;
        expect(
            _XfdfDocument.prototype._exportFormFields
        ).toBe(originalXfdfExport);
        document.destroy();
    });
    it('1041642 saves form bytes using text plain Blob', (done: DoneFn) => {
        const document: PdfDocument = new PdfDocument();
        const originalFileSave: any =
            Save.save;
        const originalXfdfExport: any =
            _XfdfDocument.prototype._exportFormFields;
        const expectedBytes: Uint8Array =
            new Uint8Array([
                60, 102, 105, 101, 108, 100, 115, 62
            ]);
        let receivedFileName: string = '';
        let receivedBlob: Blob | undefined;
        _XfdfDocument.prototype._exportFormFields =
            function (_document: PdfDocument): Uint8Array {
                return expectedBytes;
            };
        Save.save = (
            fileName: string,
            blob: Blob
        ): void => {
            receivedFileName = fileName;
            receivedBlob = blob;
        };
        document.exportFormData(
            'form-data.xfdf'
        );
        expect(receivedFileName).toBe(
            'form-data.xfdf'
        );
        expect(receivedBlob).toBeDefined();
        const savedBlob: Blob =
            receivedBlob as Blob;
        expect(savedBlob.type).toBe('text/plain');
        expect(savedBlob.type).not.toBe('');
        expect(savedBlob.size).toBe(
            expectedBytes.length
        );
        expect(savedBlob.size).toBeGreaterThan(0);
        Save.save =
            originalFileSave;
        _XfdfDocument.prototype._exportFormFields =
            originalXfdfExport;
        expect(Save.save).toBe(
            originalFileSave
        );
        expect(
            _XfdfDocument.prototype._exportFormFields
        ).toBe(originalXfdfExport);
        const reader: FileReader =
            new FileReader();
        reader.onload = (): void => {
            const buffer: ArrayBuffer =
                reader.result as ArrayBuffer;
            const actualBytes: Uint8Array =
                new Uint8Array(buffer);
            expect(actualBytes).toEqual(
                expectedBytes
            );
            expect(actualBytes.length).toBe(
                expectedBytes.length
            );
            document.destroy();
            done();
        };
        reader.readAsArrayBuffer(savedBlob);
    });
});
describe('1041642 PdfDocument importAnnotations', () => {
    it('1041642 decodes XFDF string before importing annotations', () => {
        const document: PdfDocument = new PdfDocument();
        const originalImportAnnotations: any =
            _XfdfDocument.prototype._importAnnotations;
        const encodedData: string = 'AQIDBA==';
        let receivedDocument: PdfDocument | undefined;
        let receivedData: Uint8Array | string | undefined;
        let importCallCount: number = 0;
        _XfdfDocument.prototype._importAnnotations =
            function (
                targetDocument: PdfDocument,
                data: Uint8Array | string
            ): void {
                importCallCount++;
                receivedDocument = targetDocument;
                receivedData = data;
            };
        document.importAnnotations(
            encodedData,
            DataFormat.xfdf
        );
        expect(importCallCount).toBe(1);
        expect(receivedDocument).toBe(document);
        expect(receivedData).toBeDefined();
        expect(
            receivedData instanceof Uint8Array
        ).toBeTruthy();
        expect(typeof receivedData).not.toBe('string');
        expect(receivedData).not.toBe(encodedData);
        const decodedData: Uint8Array =
            receivedData as Uint8Array;
        expect(decodedData.length).toBeGreaterThan(0);
        _XfdfDocument.prototype._importAnnotations =
            originalImportAnnotations;
        expect(
            _XfdfDocument.prototype._importAnnotations
        ).toBe(originalImportAnnotations);
        document.destroy();
    });
    it('1041642 decodes FDF string before importing annotations', () => {
        const document: PdfDocument = new PdfDocument();
        const originalImportAnnotations: any =
            _FdfDocument.prototype._importAnnotations;
        const encodedData: string = 'BQYHCA==';
        let receivedDocument: PdfDocument | undefined;
        let receivedData: Uint8Array | string | undefined;
        let importCallCount: number = 0;
        _FdfDocument.prototype._importAnnotations =
            function (
                targetDocument: PdfDocument,
                data: Uint8Array | string
            ): void {
                importCallCount++;
                receivedDocument = targetDocument;
                receivedData = data;
            };
        document.importAnnotations(
            encodedData,
            DataFormat.fdf
        );
        expect(importCallCount).toBe(1);
        expect(receivedDocument).toBe(document);
        expect(receivedData).toBeDefined();
        expect(
            receivedData instanceof Uint8Array
        ).toBeTruthy();
        expect(typeof receivedData).not.toBe('string');
        expect(receivedData).not.toBe(encodedData);
        const decodedData: Uint8Array =
            receivedData as Uint8Array;
        expect(decodedData.length).toBeGreaterThan(0);
        _FdfDocument.prototype._importAnnotations =
            originalImportAnnotations;
        expect(
            _FdfDocument.prototype._importAnnotations
        ).toBe(originalImportAnnotations);
        document.destroy();
    });
    it('1041642 does not import unsupported annotation format as FDF', () => {
        const document: PdfDocument = new PdfDocument();
        const originalFdfImport: any =
            _FdfDocument.prototype._importAnnotations;
        const sourceData: Uint8Array =
            new Uint8Array([9, 10]);
        let fdfCallCount: number = 0;
        _FdfDocument.prototype._importAnnotations =
            function (
                _document: PdfDocument,
                _data: Uint8Array
            ): void {
                fdfCallCount++;
            };
        document.importAnnotations(
            sourceData,
            DataFormat.xml
        );
        expect(fdfCallCount).toBe(0);
        _FdfDocument.prototype._importAnnotations =
            originalFdfImport;
        expect(
            _FdfDocument.prototype._importAnnotations
        ).toBe(originalFdfImport);
        document.destroy();
    });
});
describe('1041642 PdfDocument importFormData', () => {
    it('1041642 skips form post-processing when it is not required', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const page: PdfPage = document.addPage();
        const field: PdfTextBoxField =
            new PdfTextBoxField(
                page,
                'CustomerName',
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 20
                }
            );
        const originalPostProcess: any =
            internalDocument._doPostProcessOnFormFields;
        const originalImportFormData: any =
            _XfdfDocument.prototype._importFormData;
        let postProcessCallCount: number = 0;
        let importCallCount: number = 0;
        document.form.add(field);
        internalDocument._form._requiresPostProcessing = false;
        internalDocument._doPostProcessOnFormFields =
            (): void => {
                postProcessCallCount++;
            };
        _XfdfDocument.prototype._importFormData =
            function (
                _document: PdfDocument,
                _data: Uint8Array
            ): void {
                importCallCount++;
            };
        document.importFormData(
            new Uint8Array([1, 2, 3]),
            DataFormat.xfdf
        );
        expect(document.form.count).toBe(1);
        expect(postProcessCallCount).toBe(0);
        expect(importCallCount).toBe(1);
        expect(internalDocument._isFormImport).toBeTruthy();
        internalDocument._doPostProcessOnFormFields =
            originalPostProcess;
        _XfdfDocument.prototype._importFormData =
            originalImportFormData;
        expect(
            internalDocument._doPostProcessOnFormFields
        ).toBe(originalPostProcess);
        expect(
            _XfdfDocument.prototype._importFormData
        ).toBe(originalImportFormData);
        document.destroy();
    });
    it('1041642 does not import form data when form has no fields', () => {
        const document: PdfDocument = new PdfDocument();
        const originalImportFormData: any =
            _XfdfDocument.prototype._importFormData;
        let importCallCount: number = 0;
        _XfdfDocument.prototype._importFormData =
            function (
                _document: PdfDocument,
                _data: Uint8Array
            ): void {
                importCallCount++;
            };
        document.importFormData(
            new Uint8Array([1, 2, 3]),
            DataFormat.xfdf
        );
        expect(document.form.count).toBe(0);
        expect(importCallCount).toBe(0);
        _XfdfDocument.prototype._importFormData =
            originalImportFormData;
        expect(
            _XfdfDocument.prototype._importFormData
        ).toBe(originalImportFormData);
        document.destroy();
    });
    it('1041642 decodes XFDF string before importing form data', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfTextBoxField =
            new PdfTextBoxField(
                page,
                'CustomerName',
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 20
                }
            );
        const originalImportFormData: any =
            _XfdfDocument.prototype._importFormData;
        const encodedData: string = 'AQIDBA==';
        let receivedData: Uint8Array | string | undefined;
        let importCallCount: number = 0;
        document.form.add(field);
        _XfdfDocument.prototype._importFormData =
            function (
                _document: PdfDocument,
                data: Uint8Array | string
            ): void {
                importCallCount++;
                receivedData = data;
            };
        document.importFormData(
            encodedData,
            DataFormat.xfdf
        );
        expect(importCallCount).toBe(1);
        expect(receivedData).toBeDefined();
        expect(
            receivedData instanceof Uint8Array
        ).toBeTruthy();
        expect(typeof receivedData).not.toBe('string');
        expect(receivedData).not.toBe(encodedData);
        const decodedData: Uint8Array =
            receivedData as Uint8Array;
        expect(decodedData.length).toBeGreaterThan(0);
        _XfdfDocument.prototype._importFormData =
            originalImportFormData;
        document.destroy();
    });
    it('1041642 decodes JSON string before importing form data', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfTextBoxField =
            new PdfTextBoxField(
                page,
                'CustomerName',
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 20
                }
            );
        const originalImportFormData: any =
            _JsonDocument.prototype._importFormData;
        const encodedData: string = 'AQIDBA==';
        let receivedData: Uint8Array | string | undefined;
        let importCallCount: number = 0;
        document.form.add(field);
        _JsonDocument.prototype._importFormData =
            function (
                _document: PdfDocument,
                data: Uint8Array | string
            ): void {
                importCallCount++;
                receivedData = data;
            };
        document.importFormData(
            encodedData,
            DataFormat.json
        );
        expect(importCallCount).toBe(1);
        expect(
            receivedData instanceof Uint8Array
        ).toBeTruthy();
        expect(typeof receivedData).not.toBe('string');
        expect(receivedData).not.toBe(encodedData);
        _JsonDocument.prototype._importFormData =
            originalImportFormData;
        document.destroy();
    });
    it('1041642 decodes FDF string before importing form data', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfTextBoxField =
            new PdfTextBoxField(
                page,
                'CustomerName',
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 20
                }
            );
        const originalImportFormData: any =
            _FdfDocument.prototype._importFormData;
        const encodedData: string = 'AQIDBA==';
        let receivedData: Uint8Array | string | undefined;
        let importCallCount: number = 0;
        document.form.add(field);
        _FdfDocument.prototype._importFormData =
            function (
                _document: PdfDocument,
                data: Uint8Array | string
            ): void {
                importCallCount++;
                receivedData = data;
            };
        document.importFormData(
            encodedData,
            DataFormat.fdf
        );
        expect(importCallCount).toBe(1);
        expect(
            receivedData instanceof Uint8Array
        ).toBeTruthy();
        expect(typeof receivedData).not.toBe('string');
        expect(receivedData).not.toBe(encodedData);
        _FdfDocument.prototype._importFormData =
            originalImportFormData;
        document.destroy();
    });
    it('1041642 decodes XML string before importing form data', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const field: PdfTextBoxField =
            new PdfTextBoxField(
                page,
                'CustomerName',
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 20
                }
            );
        const originalImportFormData: any =
            _XmlDocument.prototype._importFormData;
        const encodedData: string = 'AQIDBA==';
        let receivedData: Uint8Array | string | undefined;
        let importCallCount: number = 0;
        document.form.add(field);
        _XmlDocument.prototype._importFormData =
            function (
                _document: PdfDocument,
                data: Uint8Array | string
            ): void {
                importCallCount++;
                receivedData = data;
            };
        document.importFormData(
            encodedData,
            DataFormat.xml
        );
        expect(importCallCount).toBe(1);
        expect(
            receivedData instanceof Uint8Array
        ).toBeTruthy();
        expect(typeof receivedData).not.toBe('string');
        expect(receivedData).not.toBe(encodedData);
        _XmlDocument.prototype._importFormData =
            originalImportFormData;
        document.destroy();
    });
    it('1041642 does not import unsupported format as XML', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const page: PdfPage = document.addPage();
        const field: PdfTextBoxField =
            new PdfTextBoxField(
                page,
                'CustomerName',
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 20
                }
            );
        const originalImportFormData: any =
            _XmlDocument.prototype._importFormData;
        let importCallCount: number = 0;
        document.form.add(field);
        _XmlDocument.prototype._importFormData =
            function (
                _document: PdfDocument,
                _data: Uint8Array
            ): void {
                importCallCount++;
            };
        internalDocument.importFormData(
            new Uint8Array([1, 2, 3]),
            1041642
        );
        expect(importCallCount).toBe(0);
        _XmlDocument.prototype._importFormData =
            originalImportFormData;
        document.destroy();
    });
});
describe('1041642 PdfDocument setSecurity', () => {
    it('1041642 rejects undefined security options', () => {
        const document: PdfDocument = new PdfDocument();
        expect((): void => {
            document.setSecurity(undefined as any);
        }).toThrowError(
            'Options should not be null'
        );
        document.destroy();
    });
    it('1041642 initializes security for a new document', () => {
        const document: PdfDocument = new PdfDocument();
        const internalCrossReference: any =
            document._crossReference as any;
        const originalInitialize: any =
            internalCrossReference._initializeEncryptionState;
        const originalUpdate: any =
            internalCrossReference._updateEncryptionSettings;
        const options: any = {
            userPassword: 'user',
            ownerPassword: 'owner'
        };
        let initializeCallCount: number = 0;
        let updateCallCount: number = 0;
        let receivedOptions: any;
        internalCrossReference._initializeEncryptionState =
            (value: any): void => {
                initializeCallCount++;
                receivedOptions = value;
            };
        internalCrossReference._updateEncryptionSettings =
            (_value: any): void => {
                updateCallCount++;
            };
        document.setSecurity(options);
        expect((document as any)._isLoaded).toBeFalsy();
        expect(initializeCallCount).toBe(1);
        expect(updateCallCount).toBe(0);
        expect(receivedOptions).toBe(options);
        internalCrossReference._initializeEncryptionState =
            originalInitialize;
        internalCrossReference._updateEncryptionSettings =
            originalUpdate;
        document.destroy();
    });
    it('1041642 initializes security for loaded document without encryption', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const internalCrossReference: any =
            document._crossReference as any;
        const originalInitialize: any =
            internalCrossReference._initializeEncryptionState;
        const originalUpdate: any =
            internalCrossReference._updateEncryptionSettings;
        const options: any = {
            userPassword: 'user',
            ownerPassword: 'owner'
        };
        let initializeCallCount: number = 0;
        let updateCallCount: number = 0;
        internalDocument._isLoaded = true;
        internalCrossReference._encrypt = undefined;
        internalCrossReference._encryptionState = undefined;
        internalCrossReference._initializeEncryptionState =
            (_value: any): void => {
                initializeCallCount++;
            };
        internalCrossReference._updateEncryptionSettings =
            (_value: any): void => {
                updateCallCount++;
            };
        document.setSecurity(options);
        expect(initializeCallCount).toBe(1);
        expect(updateCallCount).toBe(0);
        internalCrossReference._initializeEncryptionState =
            originalInitialize;
        internalCrossReference._updateEncryptionSettings =
            originalUpdate;
        document.destroy();
    });
    it('1041642 updates security for loaded encrypted document', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const internalCrossReference: any =
            document._crossReference as any;
        const originalInitialize: any =
            internalCrossReference._initializeEncryptionState;
        const originalUpdate: any =
            internalCrossReference._updateEncryptionSettings;
        const options: any = {
            userPassword: 'user',
            ownerPassword: 'owner'
        };
        let initializeCallCount: number = 0;
        let updateCallCount: number = 0;
        let receivedOptions: any;
        internalDocument._isLoaded = true;
        internalCrossReference._encryptionState = {
            userPassword: '',
            ownerPassword: ''
        };
        internalCrossReference._initializeEncryptionState =
            (_value: any): void => {
                initializeCallCount++;
            };
        internalCrossReference._updateEncryptionSettings =
            (value: any): void => {
                updateCallCount++;
                receivedOptions = value;
            };
        document.setSecurity(options);
        expect(updateCallCount).toBe(1);
        expect(initializeCallCount).toBe(0);
        expect(receivedOptions).toBe(options);
        internalCrossReference._initializeEncryptionState =
            originalInitialize;
        internalCrossReference._updateEncryptionSettings =
            originalUpdate;
        document.destroy();
    });
});
describe('1041642 PdfDocument getSecurity', () => {
    it('1041642 returns default security when encryption is unavailable', () => {
        const document: PdfDocument = new PdfDocument();
        const result: PdfSecurityOptions =
            document.getSecurity();
        expect(result.userPassword).toBe('');
        expect(result.ownerPassword).toBe('');
        expect(result.permissions).toBe(
            PdfPermissionFlag.default
        );
        expect(result.encryptionType).toBe(
            PdfEncryptionType.rc4Bit40
        );
        document.destroy();
    });
    it('1041642 resolves RC4 40-bit encryption', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const dictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        dictionary.update('V', 1);
        dictionary.update('R', 2);
        dictionary.update('P', PdfPermissionFlag.default);
        document._crossReference._newEncrypt = {
            _dictionary: dictionary,
            _algorithm: 5
        } as any;
        document._crossReference._password = 'owner';
        internalDocument._isUserPassword = false;
        const result: PdfSecurityOptions =
            document.getSecurity();
        expect(result.encryptionType).toBe(
            PdfEncryptionType.rc4Bit40
        );
        document.destroy();
    });
    it('1041642 resolves RC4 128-bit encryption', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const dictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        dictionary.update('V', 2);
        dictionary.update('R', 3);
        dictionary.update('P', PdfPermissionFlag.default);
        document._crossReference._newEncrypt = {
            _dictionary: dictionary,
            _algorithm: 5
        } as any;
        document._crossReference._password = 'owner';
        internalDocument._isUserPassword = false;
        const result: PdfSecurityOptions =
            document.getSecurity();
        expect(result.encryptionType).toBe(
            PdfEncryptionType.rc4Bit128
        );
        document.destroy();
    });
    it('1041642 resolves AES 128-bit encryption', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const dictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        dictionary.update('V', 4);
        dictionary.update('R', 4);
        dictionary.update('P', PdfPermissionFlag.default);
        document._crossReference._newEncrypt = {
            _dictionary: dictionary,
            _algorithm: 5
        } as any;
        document._crossReference._password = 'owner';
        internalDocument._isUserPassword = false;
        const result: PdfSecurityOptions =
            document.getSecurity();
        expect(result.encryptionType).toBe(
            PdfEncryptionType.aesBit128
        );
        document.destroy();
    });
    it('1041642 resolves AES 256-bit revision 5 encryption', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const dictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        dictionary.update('V', 5);
        dictionary.update('R', 5);
        dictionary.update('P', PdfPermissionFlag.default);
        document._crossReference._newEncrypt = {
            _dictionary: dictionary,
            _algorithm: 5
        } as any;
        document._crossReference._password = 'owner';
        internalDocument._isUserPassword = false;
        const result: PdfSecurityOptions =
            document.getSecurity();
        expect(result.encryptionType).toBe(
            PdfEncryptionType.aesBit256Rev5
        );
        document.destroy();
    });
    it('1041642 resolves AES 256-bit revision 6 encryption', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const dictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        dictionary.update('V', 5);
        dictionary.update('R', 6);
        dictionary.update('P', PdfPermissionFlag.default);
        document._crossReference._newEncrypt = {
            _dictionary: dictionary,
            _algorithm: 5
        } as any;
        document._crossReference._password = 'owner';
        internalDocument._isUserPassword = false;
        const result: PdfSecurityOptions =
            document.getSecurity();
        expect(result.encryptionType).toBe(
            PdfEncryptionType.aesBit256Rev6
        );
        document.destroy();
    });
    it('1041642 rejects version 2 with revision 2', () => {
        const document: PdfDocument = new PdfDocument();
        const dictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        dictionary.update('V', 2);
        dictionary.update('R', 2);
        document._crossReference._newEncrypt = {
            _dictionary: dictionary,
            _algorithm: 5
        } as any;
        expect((): void => {
            document.getSecurity();
        }).toThrow();
        document.destroy();
    });
    it('1041642 rejects version 1 with revision 3', () => {
        const document: PdfDocument = new PdfDocument();
        const dictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        dictionary.update('V', 1);
        dictionary.update('R', 3);
        document._crossReference._newEncrypt = {
            _dictionary: dictionary,
            _algorithm: 5
        } as any;
        expect((): void => {
            document.getSecurity();
        }).toThrow();
        document.destroy();
    });
    it('1041642 rejects version 2 with revision 4', () => {
        const document: PdfDocument = new PdfDocument();
        const dictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        dictionary.update('V', 2);
        dictionary.update('R', 4);
        document._crossReference._newEncrypt = {
            _dictionary: dictionary,
            _algorithm: 5
        } as any;
        expect((): void => {
            document.getSecurity();
        }).toThrow();
        document.destroy();
    });
    it('1041642 rejects version 4 with revision 5', () => {
        const document: PdfDocument = new PdfDocument();
        const dictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        dictionary.update('V', 4);
        dictionary.update('R', 5);
        document._crossReference._newEncrypt = {
            _dictionary: dictionary,
            _algorithm: 5
        } as any;
        expect((): void => {
            document.getSecurity();
        }).toThrow();
        document.destroy();
    });
    it('1041642 rejects version 4 with revision 6', () => {
        const document: PdfDocument = new PdfDocument();
        const dictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        dictionary.update('V', 4);
        dictionary.update('R', 6);
        document._crossReference._newEncrypt = {
            _dictionary: dictionary,
            _algorithm: 5
        } as any;
        expect((): void => {
            document.getSecurity();
        }).toThrow();
        document.destroy();
    });
    it('1041642 leaves user password empty for modern owner-password encryption', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const dictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        const originalExtractRealPassword: any =
            internalDocument._extractRealPassword;
        let extractPasswordCallCount: number = 0;
        dictionary.update('V', 5);
        dictionary.update('R', 6);
        dictionary.update('P', PdfPermissionFlag.default);
        document._crossReference._newEncrypt = {
            _dictionary: dictionary,
            _algorithm: 5,
            _decodePassword: new Uint8Array([]),
            _defaultPasswordBytes: new Uint8Array([])
        } as any;
        document._crossReference._encrypt =
            document._crossReference._newEncrypt;
        document._crossReference._password =
            'owner-password';
        internalDocument._isUserPassword = false;
        internalDocument._extractRealPassword =
            (
                _decodedPassword: Uint8Array,
                _defaultPassword: Uint8Array
            ): Uint8Array => {
                extractPasswordCallCount++;
                return new Uint8Array([
                    117, 115, 101, 114
                ]);
            };
        const result: PdfSecurityOptions =
            document.getSecurity();
        expect(result.encryptionType).toBe(
            PdfEncryptionType.aesBit256Rev6
        );
        expect(result.ownerPassword).toBe(
            'owner-password'
        );
        expect(result.userPassword).toBe('');
        expect(result.userPassword).not.toBe(
            'Stryker was here!'
        );
        expect(extractPasswordCallCount).toBe(0);
        internalDocument._extractRealPassword =
            originalExtractRealPassword;
        expect(
            internalDocument._extractRealPassword
        ).toBe(originalExtractRealPassword);
        document.destroy();
    });
});
describe('1041642 PdfDocument destroy', () => {
    it('1041642 destroys XMP metadata', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const xmpMetadata: PdfXmpMetadata =
            new PdfXmpMetadata();
        const originalDestroy: any =
            xmpMetadata._destroy;
        let destroyCallCount: number = 0;
        xmpMetadata._destroy = (): void => {
            destroyCallCount++;
        };
        internalDocument._xmpMetadata =
            xmpMetadata;
        document.destroy();
        expect(destroyCallCount).toBe(1);
        xmpMetadata._destroy =
            originalDestroy;
        expect(xmpMetadata._destroy).toBe(
            originalDestroy
        );
    });
    it('1041642 destroys every cached page', () => {
        const document: PdfDocument =
            new PdfDocument();
        const internalDocument: any =
            document as any;
        const firstPage: PdfPage =
            document.addPage();
        const secondPage: PdfPage =
            document.addPage();
        const originalFirstDestroy: any =
            firstPage._destroy;
        const originalSecondDestroy: any =
            secondPage._destroy;
        let firstDestroyCallCount: number = 0;
        let secondDestroyCallCount: number = 0;
        firstPage._destroy = (): void => {
            firstDestroyCallCount++;
        };
        secondPage._destroy = (): void => {
            secondDestroyCallCount++;
        };
        document.destroy();
        expect(firstDestroyCallCount).toBe(1);
        expect(secondDestroyCallCount).toBe(1);
        expect(internalDocument._pages).toBeUndefined();
        firstPage._destroy =
            originalFirstDestroy;
        secondPage._destroy =
            originalSecondDestroy;
        expect(firstPage._destroy).toBe(
            originalFirstDestroy
        );
        expect(secondPage._destroy).toBe(
            originalSecondDestroy
        );
    });
    it('1041642 clears form font cache and form reference', () => {
        const document: PdfDocument =
            new PdfDocument();
        const internalDocument: any =
            document as any;
        const form: PdfForm = document.form;
        const internalForm: any = form as any;
        internalForm._fontCache =
            new Map<string, any>();
        internalForm._fontCache.set(
            'F1',
            'CachedFont'
        );
        document.destroy();
        expect(
            internalForm._fontCache
        ).toBeUndefined();
        expect(
            internalDocument._form
        ).toBeUndefined();
    });
    it('1041642 disposes merge helper cache values', () => {
        const document: PdfDocument =
            new PdfDocument();
        const internalDocument: any =
            document as any;
        let firstDisposeCallCount: number = 0;
        let secondDisposeCallCount: number = 0;
        const firstMergeHelper: any = {
            _objectDispose: (): void => {
                firstDisposeCallCount++;
            }
        };
        const secondMergeHelper: any = {
            _objectDispose: (): void => {
                secondDisposeCallCount++;
            }
        };
        const mergeHelperCache: Map<string, any> =
            new Map<string, any>();
        mergeHelperCache.set(
            'First',
            firstMergeHelper
        );
        mergeHelperCache.set(
            'Unavailable',
            undefined
        );
        mergeHelperCache.set(
            'Second',
            secondMergeHelper
        );
        internalDocument._mergeHelperCache =
            mergeHelperCache;
        document.destroy();
        expect(firstDisposeCallCount).toBe(1);
        expect(secondDisposeCallCount).toBe(1);
        expect(mergeHelperCache.size).toBe(0);
        expect(
            internalDocument._mergeHelperCache
        ).toBeUndefined();
    });
});
describe('1041642 PdfDocument _destinationCollection', () => {
    it('1041642 returns existing named destination collection', () => {
        const document: PdfDocument =
            new PdfDocument();
        const internalDocument: any =
            document as any;
        const cachedCollection:
            _PdfNamedDestinationCollection =
            new _PdfNamedDestinationCollection();
        internalDocument._namedDestinationCollection =
            cachedCollection;
        const firstResult:
            _PdfNamedDestinationCollection =
            internalDocument._destinationCollection;
        const secondResult:
            _PdfNamedDestinationCollection =
            internalDocument._destinationCollection;
        expect(firstResult).toBe(
            cachedCollection
        );
        expect(secondResult).toBe(
            cachedCollection
        );
        expect(
            internalDocument._namedDestinationCollection
        ).toBe(cachedCollection);
        document.destroy();
    });
    it('1041642 creates collection when cached value is null', () => {
        const document: PdfDocument =
            new PdfDocument();
        const internalDocument: any =
            document as any;
        internalDocument._namedDestinationCollection =
            null;
        const result:
            _PdfNamedDestinationCollection =
            internalDocument._destinationCollection;
        expect(result).toBeDefined();
        expect(
            result instanceof
            _PdfNamedDestinationCollection
        ).toBeTruthy();
        expect(
            internalDocument._namedDestinationCollection
        ).toBe(result);
        document.destroy();
    });
    it('1041642 creates collection when cached value is undefined', () => {
        const document: PdfDocument =
            new PdfDocument();
        const internalDocument: any =
            document as any;
        internalDocument._namedDestinationCollection =
            undefined;
        const result:
            _PdfNamedDestinationCollection =
            internalDocument._destinationCollection;
        expect(result).toBeDefined();
        expect(
            result instanceof
            _PdfNamedDestinationCollection
        ).toBeTruthy();
        expect(
            internalDocument._namedDestinationCollection
        ).toBe(result);
        document.destroy();
    });
    it('1041642 uses catalog Names dictionary for destination collection', () => {
        const document: PdfDocument =
            new PdfDocument();
        const internalDocument: any =
            document as any;
        const namesDictionary: _PdfDictionary =
            new _PdfDictionary(
                document._crossReference
            );
        document._catalog._catalogDictionary.update(
            'Names',
            namesDictionary
        );
        internalDocument._namedDestinationCollection =
            undefined;
        const result:
            _PdfNamedDestinationCollection =
            internalDocument._destinationCollection;
        expect(
            document._catalog._catalogDictionary.has(
                'Names'
            )
        ).toBeTruthy();
        expect(
            document._catalog._catalogDictionary.has('')
        ).toBeFalsy();
        expect(result).toBeDefined();
        expect(
            result instanceof
            _PdfNamedDestinationCollection
        ).toBeTruthy();
        expect(
            internalDocument._namedDestinationCollection
        ).toBe(result);
        document.destroy();
    });
});
describe('1041642 PdfDocument _extractRealPassword', () => {
    it('1041642 extracts bytes preceding password padding', () => {
        const document: PdfDocument =
            new PdfDocument();
        const internalDocument: any =
            document as any;
        const decoded: Uint8Array =
            new Uint8Array([
                117, 115, 101, 114,
                9, 9
            ]);
        const padding: Uint8Array =
            new Uint8Array([
                9, 9
            ]);
        const result: Uint8Array =
            internalDocument._extractRealPassword(
                decoded,
                padding
            );
        expect(result).toEqual(
            new Uint8Array([
                117, 115, 101, 114
            ])
        );
        expect(result.length).toBe(4);
        expect(result[0]).toBe(117);
        expect(result[1]).toBe(115);
        expect(result[2]).toBe(101);
        expect(result[3]).toBe(114);
        document.destroy();
    });
    it('1041642 returns original decoded value when padding is unavailable', () => {
        const document: PdfDocument =
            new PdfDocument();
        const internalDocument: any =
            document as any;
        const decoded: Uint8Array =
            new Uint8Array([
                1, 2, 3
            ]);
        const padding: Uint8Array =
            new Uint8Array([
                4, 5
            ]);
        const result: Uint8Array =
            internalDocument._extractRealPassword(
                decoded,
                padding
            );
        expect(result).toBe(decoded);
        expect(result).toEqual(
            new Uint8Array([
                1, 2, 3
            ])
        );
        document.destroy();
    });
    it('1041642 matches a partial padding sequence at decoded boundary', () => {
        const document: PdfDocument =
            new PdfDocument();
        const internalDocument: any =
            document as any;
        const decoded: Uint8Array =
            new Uint8Array([
                117, 115, 101, 114,
                9
            ]);
        const padding: Uint8Array =
            new Uint8Array([
                9, 9
            ]);
        const result: Uint8Array =
            internalDocument._extractRealPassword(
                decoded,
                padding
            );
        expect(result).toEqual(
            new Uint8Array([
                117, 115, 101, 114
            ])
        );
        expect(result.length).toBe(4);
        document.destroy();
    });
});
describe('1041642 PdfDocument _checkHeader', () => {
    it('1041642 limits PDF header version token to twelve characters', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalFind: any =
            internalDocument._find;
        const headerText: string =
            '%PDF-123456789012345 ';
        const headerBytes: Uint8Array =
            new Uint8Array(headerText.length);
        for (
            let index: number = 0;
            index < headerText.length;
            index++
        ) {
            headerBytes[index] =
                headerText.charCodeAt(index);
        }
        internalDocument._stream =
            new _PdfStream(headerBytes);
        internalDocument._version = '';
        internalDocument._find = (
            _stream: _PdfStream,
            _signature: Uint8Array
        ): boolean => {
            return true;
        };
        internalDocument._checkHeader();
        expect(internalDocument._version).toBe(
            '1234567'
        );
        expect(
            internalDocument._version.length
        ).toBe(7);
        internalDocument._find =
            originalFind;
        expect(internalDocument._find).toBe(
            originalFind
        );
        document.destroy();
    });
    it('1041642 preserves an existing PDF version', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalFind: any =
            internalDocument._find;
        const headerText: string =
            '%PDF-1.7 ';
        const headerBytes: Uint8Array =
            new Uint8Array(headerText.length);
        for (
            let index: number = 0;
            index < headerText.length;
            index++
        ) {
            headerBytes[index] =
                headerText.charCodeAt(index);
        }
        internalDocument._stream =
            new _PdfStream(headerBytes);
        internalDocument._version = '1.4';
        internalDocument._find = (
            _stream: _PdfStream,
            _signature: Uint8Array
        ): boolean => {
            return true;
        };
        internalDocument._checkHeader();
        expect(internalDocument._version).toBe(
            '1.4'
        );
        expect(internalDocument._version).not.toBe(
            '1.7'
        );
        internalDocument._find =
            originalFind;
        document.destroy();
    });
});
describe('1041642 PdfDocument _find', () => {
    it('1041642 respects explicit forward search limit', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const stream: _PdfStream =
            new _PdfStream(
                new Uint8Array([
                    0x41, 0x41, 0x41, 0x41,
                    0x58, 0x59, 0x5a,
                    0x41
                ])
            );
        const signature: Uint8Array =
            new Uint8Array([
                0x58, 0x59, 0x5a
            ]);
        const result: boolean =
            internalDocument._find(
                stream,
                signature,
                4,
                false
            );
        expect(result).toBeFalsy();
        expect(stream.position).toBe(0);
        document.destroy();
    });
    it('1041642 respects explicit backward search direction', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const stream: _PdfStream =
            new _PdfStream(
                new Uint8Array([
                    0x58, 0x59, 0x5a,
                    0x41, 0x41,
                    0x58, 0x59, 0x5a,
                    0x41
                ])
            );
        const signature: Uint8Array =
            new Uint8Array([
                0x58, 0x59, 0x5a
            ]);
        const result: boolean =
            internalDocument._find(
                stream,
                signature,
                9,
                true
            );
        expect(result).toBeTruthy();
        expect(stream.position).toBe(5);
        document.destroy();
    });
    it('1041642 returns false when scan length equals signature length', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const stream: _PdfStream =
            new _PdfStream(
                new Uint8Array([
                    0x58, 0x59, 0x5a
                ])
            );
        const signature: Uint8Array =
            new Uint8Array([
                0x58, 0x59, 0x5a
            ]);
        const result: boolean =
            internalDocument._find(
                stream,
                signature,
                3,
                false
            );
        expect(result).toBeFalsy();
        expect(stream.position).toBe(0);
        document.destroy();
    });
    it('1041642 returns false for short nonmatching scan data', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const stream: _PdfStream =
            new _PdfStream(
                new Uint8Array([
                    0x41, 0x42
                ])
            );
        const signature: Uint8Array =
            new Uint8Array([
                0x58, 0x59, 0x5a
            ]);
        const result: boolean =
            internalDocument._find(
                stream,
                signature,
                2,
                false
            );
        expect(result).toBeFalsy();
        expect(stream.position).toBe(0);
        document.destroy();
    });
    it('1041642 finds backward signature at final valid position', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const stream: _PdfStream =
            new _PdfStream(
                new Uint8Array([
                    0x41, 0x41,
                    0x58, 0x59, 0x5a,
                    0x41
                ])
            );
        const signature: Uint8Array =
            new Uint8Array([
                0x58, 0x59, 0x5a
            ]);
        const result: boolean =
            internalDocument._find(
                stream,
                signature,
                6,
                true
            );
        expect(result).toBeTruthy();
        expect(stream.position).toBe(2);
        document.destroy();
    });
    it('1041642 finds forward signature at last valid scan position', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const stream: _PdfStream =
            new _PdfStream(
                new Uint8Array([
                    0x41, 0x41, 0x41,
                    0x58, 0x59, 0x5a,
                    0x41
                ])
            );
        const signature: Uint8Array =
            new Uint8Array([
                0x58, 0x59, 0x5a
            ]);
        const result: boolean =
            internalDocument._find(
                stream,
                signature,
                6,
                false
            );
        expect(result).toBeTruthy();
        expect(stream.position).toBe(3);
        document.destroy();
    });
    it('1041642 returns false when signature is unavailable', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const stream: _PdfStream =
            new _PdfStream(
                new Uint8Array([
                    0x41, 0x42, 0x43,
                    0x44, 0x45, 0x46
                ])
            );
        const signature: Uint8Array =
            new Uint8Array([
                0x58, 0x59, 0x5a
            ]);
        const result: boolean =
            internalDocument._find(
                stream,
                signature,
                6,
                false
            );
        expect(result).toBeFalsy();
        expect(stream.position).toBe(0);
        document.destroy();
    });
});
describe('1041642 PdfDocument _getLinearizationPage', () => {
    it('1041642 falls back when linearization object is not a dictionary', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const catalog: any = document._catalog as any;
        const crossReference: any =
            document._crossReference as any;
        const originalFetch: any =
            crossReference._fetch;
        const originalGetPageDictionary: any =
            catalog._getPageDictionary;
        const fallbackDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        const fallbackReference: _PdfReference =
            document._crossReference._getNextReference();
        const fallbackResult: any = {
            dictionary: fallbackDictionary,
            reference: fallbackReference
        };
        let fallbackCallCount: number = 0;
        internalDocument._linear = {
            objectNumberFirst: 1041642
        };
        crossReference._fetch = (
            _reference: _PdfReference
        ): string => {
            return 'Invalid page object';
        };
        catalog._getPageDictionary = (
            pageIndex: number
        ): any => {
            fallbackCallCount++;
            expect(pageIndex).toBe(0);
            return fallbackResult;
        };
        const result: any =
            internalDocument._getLinearizationPage(0);
        expect(result).toBe(fallbackResult);
        expect(result.dictionary).toBe(
            fallbackDictionary
        );
        expect(result.reference).toBe(
            fallbackReference
        );
        expect(fallbackCallCount).toBe(1);
        crossReference._fetch =
            originalFetch;
        catalog._getPageDictionary =
            originalGetPageDictionary;
        expect(crossReference._fetch).toBe(
            originalFetch
        );
        expect(catalog._getPageDictionary).toBe(
            originalGetPageDictionary
        );
        document.destroy();
    });
    it('1041642 falls back when dictionary has Kids but no Page type', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const catalog: any = document._catalog as any;
        const crossReference: any =
            document._crossReference as any;
        const originalFetch: any =
            crossReference._fetch;
        const originalGetPageDictionary: any =
            catalog._getPageDictionary;
        const invalidDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        const fallbackDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        const fallbackReference: _PdfReference =
            document._crossReference._getNextReference();
        const fallbackResult: any = {
            dictionary: fallbackDictionary,
            reference: fallbackReference
        };
        let fallbackCallCount: number = 0;
        invalidDictionary.update('Kids', []);
        internalDocument._linear = {
            objectNumberFirst: 1041642
        };
        crossReference._fetch = (
            _reference: _PdfReference
        ): _PdfDictionary => {
            return invalidDictionary;
        };
        catalog._getPageDictionary = (
            pageIndex: number
        ): any => {
            fallbackCallCount++;
            expect(pageIndex).toBe(0);
            return fallbackResult;
        };
        const result: any =
            internalDocument._getLinearizationPage(0);
        expect(
            invalidDictionary.has('Type')
        ).toBeFalsy();
        expect(
            invalidDictionary.has('Kids')
        ).toBeTruthy();
        expect(
            invalidDictionary.has('')
        ).toBeFalsy();
        expect(result).toBe(fallbackResult);
        expect(fallbackCallCount).toBe(1);
        crossReference._fetch =
            originalFetch;
        catalog._getPageDictionary =
            originalGetPageDictionary;
        expect(crossReference._fetch).toBe(
            originalFetch
        );
        expect(catalog._getPageDictionary).toBe(
            originalGetPageDictionary
        );
        document.destroy();
    });
    it('1041642 falls back when dictionary has non-Page type and no Kids', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const catalog: any = document._catalog as any;
        const crossReference: any =
            document._crossReference as any;
        const originalFetch: any =
            crossReference._fetch;
        const originalGetPageDictionary: any =
            catalog._getPageDictionary;
        const invalidDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        const fallbackDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        const fallbackReference: _PdfReference =
            document._crossReference._getNextReference();
        const fallbackResult: any = {
            dictionary: fallbackDictionary,
            reference: fallbackReference
        };
        const pagesType: any =
            document._catalog._topPagesDictionary.get(
                'Type'
            );
        let fallbackCallCount: number = 0;
        invalidDictionary.update(
            'Type',
            pagesType
        );
        internalDocument._linear = {
            objectNumberFirst: 1041642
        };
        crossReference._fetch = (
            _reference: _PdfReference
        ): _PdfDictionary => {
            return invalidDictionary;
        };
        catalog._getPageDictionary = (
            _pageIndex: number
        ): any => {
            fallbackCallCount++;
            return fallbackResult;
        };
        const result: any =
            internalDocument._getLinearizationPage(0);
        expect(
            invalidDictionary.has('Type')
        ).toBeTruthy();
        expect(
            invalidDictionary.get('Type').name
        ).toBe('Pages');
        expect(
            invalidDictionary.has('Kids')
        ).toBeFalsy();
        expect(
            invalidDictionary.has('')
        ).toBeFalsy();
        expect(result).toBe(fallbackResult);
        expect(fallbackCallCount).toBe(1);
        crossReference._fetch =
            originalFetch;
        catalog._getPageDictionary =
            originalGetPageDictionary;
        expect(crossReference._fetch).toBe(
            originalFetch
        );
        expect(catalog._getPageDictionary).toBe(
            originalGetPageDictionary
        );
        document.destroy();
    });
    it('1041642 preserves existing linearization page cache values', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const catalog: any = document._catalog as any;
        const crossReference: any =
            document._crossReference as any;
        const originalFetch: any =
            crossReference._fetch;
        const page: PdfPage = document.addPage();
        const pageDictionary: _PdfDictionary =
            page._pageDictionary;
        internalDocument._linear = {
            objectNumberFirst: 1041642
        };
        crossReference._fetch = (
            _reference: _PdfReference
        ): _PdfDictionary => {
            return pageDictionary;
        };
        const linearizedReference: _PdfReference =
            _PdfReference.get(
                1041642,
                0
            );
        catalog.pageKidsCountCache.put(
            linearizedReference,
            7
        );
        catalog.pageIndexCache.put(
            linearizedReference,
            9
        );
        const result: any =
            internalDocument._getLinearizationPage(0);
        expect(result).toBeDefined();
        expect(result.dictionary).toBe(
            pageDictionary
        );
        expect(result.reference).toBe(
            linearizedReference
        );
        expect(
            catalog.pageKidsCountCache.get(
                linearizedReference
            )
        ).toBe(7);
        expect(
            catalog.pageIndexCache.get(
                linearizedReference
            )
        ).toBe(9);
        crossReference._fetch =
            originalFetch;
        expect(crossReference._fetch).toBe(
            originalFetch
        );
        document.destroy();
    });
});
describe('1041642 PdfDocument _doPostProcess', () => {
    it('1041642 uses false as default flatten value', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalRenderTemplates: any =
            internalDocument._renderDocumentTemplates;
        const originalFormPostProcess: any =
            internalDocument._doPostProcessOnFormFields;
        const originalAnnotationPostProcess: any =
            internalDocument._doPostProcessOnAnnotations;
        const originalAddXmpMetadata: any =
            internalDocument._addXmpMetadata;
        const templateModes: any[] = [];
        let formFlattenValue: boolean | undefined;
        let annotationFlattenValue: boolean | undefined;
        let metadataCallCount: number = 0;
        internalDocument._renderDocumentTemplates =
            (mode: PdfTemplateLayerMode): void => {
                templateModes.push(mode);
            };
        internalDocument._doPostProcessOnFormFields =
            (isFlatten: boolean): void => {
                formFlattenValue = isFlatten;
            };
        internalDocument._doPostProcessOnAnnotations =
            (isFlatten: boolean): void => {
                annotationFlattenValue = isFlatten;
            };
        internalDocument._addXmpMetadata =
            (): void => {
                metadataCallCount++;
            };
        internalDocument._doPostProcess();
        expect(formFlattenValue).toBeFalsy();
        expect(formFlattenValue).toBe(false);
        expect(annotationFlattenValue).toBeFalsy();
        expect(annotationFlattenValue).toBe(false);
        expect(templateModes.length).toBe(3);
        expect(templateModes[0]).toBe(
            PdfTemplateLayerMode.background
        );
        expect(templateModes[1]).toBeUndefined();
        expect(templateModes[2]).toBe(
            PdfTemplateLayerMode.foreground
        );
        expect(metadataCallCount).toBe(1);
        internalDocument._renderDocumentTemplates =
            originalRenderTemplates;
        internalDocument._doPostProcessOnFormFields =
            originalFormPostProcess;
        internalDocument._doPostProcessOnAnnotations =
            originalAnnotationPostProcess;
        internalDocument._addXmpMetadata =
            originalAddXmpMetadata;
        expect(
            internalDocument._renderDocumentTemplates
        ).toBe(originalRenderTemplates);
        expect(
            internalDocument._doPostProcessOnFormFields
        ).toBe(originalFormPostProcess);
        expect(
            internalDocument._doPostProcessOnAnnotations
        ).toBe(originalAnnotationPostProcess);
        expect(
            internalDocument._addXmpMetadata
        ).toBe(originalAddXmpMetadata);
        document.destroy();
    });
    it('1041642 forwards explicit flatten value', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalRenderTemplates: any =
            internalDocument._renderDocumentTemplates;
        const originalFormPostProcess: any =
            internalDocument._doPostProcessOnFormFields;
        const originalAnnotationPostProcess: any =
            internalDocument._doPostProcessOnAnnotations;
        const originalAddXmpMetadata: any =
            internalDocument._addXmpMetadata;
        let formFlattenValue: boolean = false;
        let annotationFlattenValue: boolean = false;
        internalDocument._renderDocumentTemplates =
            (_mode: PdfTemplateLayerMode): void => {
                return;
            };
        internalDocument._doPostProcessOnFormFields =
            (isFlatten: boolean): void => {
                formFlattenValue = isFlatten;
            };
        internalDocument._doPostProcessOnAnnotations =
            (isFlatten: boolean): void => {
                annotationFlattenValue = isFlatten;
            };
        internalDocument._addXmpMetadata =
            (): void => {
                return;
            };
        internalDocument._doPostProcess(true);
        expect(formFlattenValue).toBeTruthy();
        expect(annotationFlattenValue).toBeTruthy();
        internalDocument._renderDocumentTemplates =
            originalRenderTemplates;
        internalDocument._doPostProcessOnFormFields =
            originalFormPostProcess;
        internalDocument._doPostProcessOnAnnotations =
            originalAnnotationPostProcess;
        internalDocument._addXmpMetadata =
            originalAddXmpMetadata;
        document.destroy();
    });
});
describe('1041642 PdfDocument _renderDocumentTemplates', () => {
    it('1041642 skips page rendering when document has no templates', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalRenderPageTemplates: any =
            internalDocument._renderPageTemplates;
        let renderCallCount: number = 0;
        document.addPage();
        internalDocument._template = undefined;
        internalDocument._sections = [];
        internalDocument._renderPageTemplates =
            (
                _page: PdfPage,
                _isOddPage: boolean,
                _mode: PdfTemplateLayerMode
            ): void => {
                renderCallCount++;
            };
        internalDocument._renderDocumentTemplates(
            PdfTemplateLayerMode.background
        );
        expect(internalDocument._template).toBeUndefined();
        expect(internalDocument._sections.length).toBe(0);
        expect(renderCallCount).toBe(0);
        internalDocument._renderPageTemplates =
            originalRenderPageTemplates;
        expect(
            internalDocument._renderPageTemplates
        ).toBe(originalRenderPageTemplates);
        document.destroy();
    });
    describe('1041642 PdfDocument _renderDocumentTemplates', () => {
        it('1041642 skips page rendering when document has no templates', () => {
            const document: PdfDocument = new PdfDocument();
            const internalDocument: any = document as any;
            const originalRenderPageTemplates: any =
                internalDocument._renderPageTemplates;
            let renderCallCount: number = 0;
            document.addPage();
            internalDocument._template = undefined;
            internalDocument._sections = [];
            internalDocument._renderPageTemplates =
                (
                    _page: PdfPage,
                    _isOddPage: boolean,
                    _mode: PdfTemplateLayerMode
                ): void => {
                    renderCallCount++;
                };
            internalDocument._renderDocumentTemplates(
                PdfTemplateLayerMode.background
            );
            expect(internalDocument._template).toBeUndefined();
            expect(internalDocument._sections.length).toBe(0);
            expect(renderCallCount).toBe(0);
            internalDocument._renderPageTemplates =
                originalRenderPageTemplates;
            expect(
                internalDocument._renderPageTemplates
            ).toBe(originalRenderPageTemplates);
            document.destroy();
        });
        it('1041642 detects template from document section', () => {
            const document: PdfDocument = new PdfDocument();
            const internalDocument: any = document as any;
            const originalRenderPageTemplates: any =
                internalDocument._renderPageTemplates;
            const section: PdfSection =
                document.addSection();
            const sectionTemplate: any =
                section.template;
            const page: PdfPage =
                section.addPage();
            let renderCallCount: number = 0;
            let renderedPage: PdfPage | undefined;
            let receivedOddPage: boolean = false;
            internalDocument._template = undefined;
            internalDocument._renderPageTemplates =
                (
                    currentPage: PdfPage,
                    isOddPage: boolean,
                    _mode: PdfTemplateLayerMode
                ): void => {
                    renderCallCount++;
                    renderedPage = currentPage;
                    receivedOddPage = isOddPage;
                };
            internalDocument._renderDocumentTemplates(
                PdfTemplateLayerMode.foreground
            );
            expect(sectionTemplate).toBeDefined();
            expect(internalDocument._template).toBeUndefined();
            expect(internalDocument._sections.length).toBe(1);
            expect(renderCallCount).toBe(1);
            expect(renderedPage).toBe(page);
            expect(receivedOddPage).toBeTruthy();
            internalDocument._renderPageTemplates =
                originalRenderPageTemplates;
            expect(
                internalDocument._renderPageTemplates
            ).toBe(originalRenderPageTemplates);
            document.destroy();
        });
    });
    it('1041642 detects lazily created template from document section', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalRenderPageTemplates: any =
            internalDocument._renderPageTemplates;
        const section: PdfSection =
            document.addSection();
        const page: PdfPage =
            section.addPage();
        let renderCallCount: number = 0;
        let renderedPage: PdfPage | undefined;
        let receivedOddPage: boolean = false;
        let receivedMode:
            PdfTemplateLayerMode | undefined;
        internalDocument._template = undefined;
        (section as any)._template = undefined;
        internalDocument._renderPageTemplates = (
            currentPage: PdfPage,
            isOddPage: boolean,
            mode: PdfTemplateLayerMode
        ): void => {
            renderCallCount++;
            renderedPage = currentPage;
            receivedOddPage = isOddPage;
            receivedMode = mode;
        };
        internalDocument._renderDocumentTemplates(
            PdfTemplateLayerMode.background
        );
        expect(internalDocument._template).toBeUndefined();
        expect(internalDocument._sections.length).toBe(1);
        expect(
            (section as any)._template
        ).toBeDefined();
        expect(renderCallCount).toBe(1);
        expect(renderedPage).toBe(page);
        expect(receivedOddPage).toBeTruthy();
        expect(receivedMode).toBe(
            PdfTemplateLayerMode.background
        );
        internalDocument._renderPageTemplates =
            originalRenderPageTemplates;
        expect(
            internalDocument._renderPageTemplates
        ).toBe(originalRenderPageTemplates);
        document.destroy();
    });
    it('1041642 skips rendering when document has no templates or sections', () => {
        const document: PdfDocument = new PdfDocument();
        const internalDocument: any = document as any;
        const originalRenderPageTemplates: any =
            internalDocument._renderPageTemplates;
        let renderCallCount: number = 0;
        document.addPage();
        internalDocument._template = undefined;
        internalDocument._sections = [];
        internalDocument._renderPageTemplates = (
            _page: PdfPage,
            _isOddPage: boolean,
            _mode: PdfTemplateLayerMode
        ): void => {
            renderCallCount++;
        };
        internalDocument._renderDocumentTemplates(
            PdfTemplateLayerMode.background
        );
        expect(internalDocument._template).toBeUndefined();
        expect(internalDocument._sections.length).toBe(0);
        expect(renderCallCount).toBe(0);
        internalDocument._renderPageTemplates =
            originalRenderPageTemplates;
        expect(
            internalDocument._renderPageTemplates
        ).toBe(originalRenderPageTemplates);
        document.destroy();
    });
});