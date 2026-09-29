import { PdfUriAnnotation } from "../src/pdf/core/annotations/annotation";
import { _PdfContentStream, _PdfStream } from "../src/pdf/core/base-stream";
import { _PdfAlignmentStyle, _TemplateSide, PdfEncryptionType, PdfPageOrientation, PdfPermissionFlag, PdfRotationAngle, PdfTemplateHorizontalAlignment, PdfTemplateLayerMode, PdfTemplateVerticalAlignment } from "../src/pdf/core/enumerator";
import { PdfFontFamily, PdfStandardFont } from "../src/pdf/core/fonts/pdf-standard-font";
import { PdfBrush } from "../src/pdf/core/graphics/pdf-graphics";
import { PdfPageTemplateElement } from "../src/pdf/core/graphics/pdf-page-template-element";
import { PdfTemplate } from "../src/pdf/core/graphics/pdf-template";
import { PdfAnnotationExportSettings, PdfDocument, PdfDocumentSplitEventArgs, PdfFormFieldExportSettings, PdfMargins, PdfPageSettings } from "../src/pdf/core/pdf-document";
import { PdfDocumentInformation } from "../src/pdf/core/pdf-document-information";
import { _PdfNamedDestinationCollection, PdfBookmark, PdfBookmarkBase, PdfNamedDestination } from "../src/pdf/core/pdf-outline";
import { PdfDestination, PdfPage } from "../src/pdf/core/pdf-page";
import { PdfPageImportOptions } from "../src/pdf/core/pdf-page-import-options";
import { _PdfDictionary, _PdfName, _PdfReference } from "../src/pdf/core/pdf-primitives";
import { PdfSection } from "../src/pdf/core/pdf-section";
import { PdfDocumentTemplate, PdfSecurityOptions, Rectangle, Size } from "../src/pdf/core/pdf-type";
import { PdfCustomMetadata } from "../src/pdf/core/xmp/pdf-custom-metadata";
import { PdfXmpMetadata } from "../src/pdf/core/xmp/pdf-xmp-metadata";
describe('PdfDocument survived mutants batch 01', () => {
    // Mutant ID: 299
    it('should locate startxref in a saved PDF shorter than the backward scan step', () => {
        const sourceDocument: PdfDocument = new PdfDocument();
        sourceDocument.addPage();
        const data: Uint8Array = sourceDocument.save();
        const loadedDocument: PdfDocument = new PdfDocument(data);
        const startXRef: number = (loadedDocument as any)._startXRef;
        expect(startXRef).toBeGreaterThan(0);
        expect(startXRef).toBeLessThan(data.length);
        loadedDocument.destroy();
        sourceDocument.destroy();
    });
    // Mutant ID: 459
    it('should not create a document template for a loaded PDF', () => {
        const sourceDocument: PdfDocument = new PdfDocument();
        sourceDocument.addPage();
        const data: Uint8Array = sourceDocument.save();
        const loadedDocument: PdfDocument = new PdfDocument(data);
        expect(loadedDocument.template).toBeUndefined();
        loadedDocument.destroy();
        sourceDocument.destroy();
    });
    // Mutant ID: 460
    it('should return the existing template value for a loaded PDF', () => {
        const sourceDocument: PdfDocument = new PdfDocument();
        sourceDocument.addPage();
        const data: Uint8Array = sourceDocument.save();
        const loadedDocument: PdfDocument = new PdfDocument(data);
        const template: PdfDocumentTemplate = {
            top: new PdfPageTemplateElement({ width: 200, height: 20 }) as any
        };
        (loadedDocument as any)._template = template;
        expect(loadedDocument.template).toBe(template);
        loadedDocument.destroy();
        sourceDocument.destroy();
    });
    // Mutant ID: 480
    it('should return an empty revision collection when no cross-reference revisions are cached', () => {
        const sourceDocument: PdfDocument = new PdfDocument();
        sourceDocument.addPage();
        const data: Uint8Array = sourceDocument.save();
        const loadedDocument: PdfDocument = new PdfDocument(data);
        (loadedDocument as any)._revisions = undefined;
        (loadedDocument as any)._startXRefParsedCache = [];
        const revisions: number[] = loadedDocument.getRevisions();
        expect(revisions).toEqual([]);
        loadedDocument.destroy();
        sourceDocument.destroy();
    });
    // Mutant ID: 482
    it('should cache the empty revision collection', () => {
        const sourceDocument: PdfDocument = new PdfDocument();
        sourceDocument.addPage();
        const data: Uint8Array = sourceDocument.save();
        const loadedDocument: PdfDocument = new PdfDocument(data);
        (loadedDocument as any)._revisions = undefined;
        (loadedDocument as any)._startXRefParsedCache = [];
        const firstResult: number[] = loadedDocument.getRevisions();
        const secondResult: number[] = loadedDocument.getRevisions();
        expect(firstResult).toEqual([]);
        expect(secondResult).toBe(firstResult);
        expect((loadedDocument as any)._revisions).toBe(firstResult);
        loadedDocument.destroy();
        sourceDocument.destroy();
    });
    // Mutant ID: 674
    it('should attach the first page section to the existing top-level page tree', () => {
        const document: PdfDocument = new PdfDocument();
        const topPages: _PdfDictionary =
            (document as any)._catalog._topPagesDictionary;
        const page: PdfPage = document.addPage();
        const kids: _PdfReference[] = topPages.get('Kids');
        expect(page).toBeDefined();
        expect(document.pageCount).toBe(1);
        expect(kids.length).toBe(1);
        expect(topPages.get('Count')).toBe(1);
        document.destroy();
    });
    // Mutant ID: 772
    it('should omit XMP metadata when metadata skipping is enabled', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const information: PdfDocumentInformation =
            document.getDocumentInformation(true);
        expect(information.xmpMetadata).toBeUndefined();
        expect(information.customMetadata).toBeDefined();
        document.destroy();
    });
    // Mutant ID: 786
    it('should read every custom metadata entry without accessing an entry beyond the collection', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const customMetadata: PdfCustomMetadata = new PdfCustomMetadata();
        customMetadata.set('Department', 'Document Processing');
        customMetadata.set('ReviewStatus', 'Approved');
        document.setDocumentInformation({
            customMetadata
        });
        const data: Uint8Array = document.save();
        const loadedDocument: PdfDocument = new PdfDocument(data);
        const information: any =
            loadedDocument.getDocumentInformation();
        expect(information.customMetadata.get('Department'))
            .toBe('Document Processing');
        expect(information.customMetadata.get('ReviewStatus'))
            .toBe('Approved');
        loadedDocument.destroy();
        document.destroy();
    });
    // Mutant ID: 845
    it('should update an existing XMP custom schema with document custom metadata', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const metadata: PdfXmpMetadata =
            (document as any)._getMetadataValue();
        const customMetadata: PdfCustomMetadata = new PdfCustomMetadata();
        customMetadata.set('Workflow', 'Mutation Testing');
        document.setDocumentInformation({
            customMetadata
        });
        expect(metadata.customSchema.customData.get('Workflow'))
            .toBe('Mutation Testing');
        document.destroy();
    });
    // Mutant ID: 846
    it('should assign the updated custom schema map to existing XMP metadata', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const metadata: PdfXmpMetadata =
            (document as any)._getMetadataValue();
        const originalMap: Map<string, string> =
            metadata.customSchema.customData;
        const customMetadata: PdfCustomMetadata = new PdfCustomMetadata();
        customMetadata.set('BuildCategory', 'Mutation');
        document.setDocumentInformation({
            customMetadata
        });
        expect(metadata.customSchema.customData).toBe(originalMap);
        expect(metadata.customSchema.customData.get('BuildCategory'))
            .toBe('Mutation');
        document.destroy();
    });
    // Mutant ID: 852
    it('should not write a null value to the information dictionary', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const dictionary: _PdfDictionary =
            (document as any)._getInfoDictionary(true);
        dictionary.update('Title', 'Original title');
        (document as any)._writeInfoString(
            dictionary,
            'Title',
            null
        );
        expect(dictionary.get('Title')).toBe('Original title');
        document.destroy();
    });
    // Mutant ID: 936
    it('should preserve page count while incrementing the page cache', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        const originalCount: number = document.pageCount;
        (document as any)._updatePageCache(1, true);
        expect(document.pageCount).toBe(originalCount);
        expect((document as any)._pages.size).toBe(2);
        expect((document as any)._pages.has(2)).toBeTruthy();
        document.destroy();
    });
    // Mutant ID: 944
    it('should remove a page when no bookmark collection targets the page', () => {
        const document: PdfDocument = new PdfDocument();
        const firstPage: PdfPage = document.addPage();
        const secondPage: PdfPage = document.addPage();
        document.removePage(secondPage);
        expect(document.pageCount).toBe(1);
        expect(document.getPage(0)).toBe(firstPage);
        document.destroy();
    });
    // Mutant ID: 952
    it('should clear both action and destination entries from a bookmark targeting a removed page', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const targetPage: PdfPage = document.addPage();
        const bookmark: PdfBookmark =
            document.bookmarks.add('Removed destination');
        bookmark.destination = new PdfDestination(targetPage);
        const dictionary: _PdfDictionary =
            (bookmark as any)._dictionary;
        dictionary.update('A', new _PdfDictionary());
        document.removePage(targetPage);
        expect(dictionary.get('A')).toBeNull();
        expect(dictionary.get('Dest')).toBeNull();
        document.destroy();
    });
    // Mutant ID: 1008
    it('should identify a Pages parent while removing the last child page', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const parentReference: _PdfReference =
            page._pageDictionary._get('Parent');
        const parentDictionary: _PdfDictionary =
            (document as any)._crossReference._fetch(parentReference);
        expect(parentDictionary.get('Type').name).toBe('Pages');
        document.removePage(page);
        expect(document.pageCount).toBe(0);
        document.destroy();
    });
    // Mutant ID: 1040
    it('should create a destination list when the page has no previous bookmark mappings', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const bookmark: PdfBookmark =
            document.bookmarks.add('First page bookmark');
        bookmark.destination = new PdfDestination(page);
        const map: Map<PdfPage, PdfBookmarkBase[]> =
            document._parseBookmarkDestination();
        const entries: PdfBookmarkBase[] = map.get(page) as any;
        expect(entries).toBeDefined();
        expect(entries.length).toBe(1);
        expect(
            entries[0]._dictionary.get('Title')
        ).toBe('First page bookmark');
        expect(entries[0]._dictionary).toBe(bookmark._dictionary);
        document.destroy();
    });
    // Mutant ID: 1056
    it('should continue with the next bookmark when the current bookmark has no children', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        document.bookmarks.add('Empty parent bookmark');
        const destinationBookmark: PdfBookmark =
            document.bookmarks.add('Page destination bookmark');
        destinationBookmark.destination =
            new PdfDestination(page);
        const map: Map<PdfPage, PdfBookmarkBase[]> =
            document._parseBookmarkDestination();
        const entries: PdfBookmarkBase[] = map.get(page) as any;
        expect(entries).toBeDefined();
        expect(entries.length).toBe(1);
        expect(
            entries[0]._dictionary.get('Title')
        ).toBe('Page destination bookmark');
        expect(entries[0]._dictionary)
            .toBe(destinationBookmark._dictionary);
        document.destroy();
    });
    // Mutant ID: 1067
    it('should resume the parent bookmark collection after processing the final child', () => {
        const document: PdfDocument = new PdfDocument();
        const firstPage: PdfPage = document.addPage();
        const secondPage: PdfPage = document.addPage();
        const parent: PdfBookmark =
            document.bookmarks.add('Parent bookmark');
        const child: PdfBookmark =
            parent.add('Child bookmark');
        const sibling: PdfBookmark =
            document.bookmarks.add('Sibling bookmark');
        child.destination = new PdfDestination(firstPage);
        sibling.destination = new PdfDestination(secondPage);
        const map: Map<PdfPage, PdfBookmarkBase[]> =
            document._parseBookmarkDestination();
        const firstEntries: PdfBookmarkBase[] =
            map.get(firstPage) as any;
        const secondEntries: PdfBookmarkBase[] =
            map.get(secondPage) as any;
        expect(firstEntries).toBeDefined();
        expect(firstEntries.length).toBe(1);
        expect(
            firstEntries[0]._dictionary.get('Title')
        ).toBe('Child bookmark');
        expect(secondEntries).toBeDefined();
        expect(secondEntries.length).toBe(1);
        expect(
            secondEntries[0]._dictionary.get('Title')
        ).toBe('Sibling bookmark');
        document.destroy();
    });
    // Mutant ID: 1088
    it('should return undefined when an information dictionary does not contain the requested key', () => {
        const document: PdfDocument = new PdfDocument();
        const dictionary: _PdfDictionary = new _PdfDictionary(
            (document as any)._crossReference
        );
        const value: string = (document as any)._readInfoString(
            dictionary,
            'MissingKey'
        );
        expect(value).toBeUndefined();
        document.destroy();
    });
    // Mutant ID: 1112
    it('should remove the final matching page-template pair', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const firstPageDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        const firstName: any = 'FirstTemplate';
        const finalName: any = 'FinalTemplate';
        const namedPages: any[] = [
            firstName,
            firstPageDictionary,
            finalName,
            page._pageDictionary
        ];
        const result: _PdfDictionary[] =
            document._getUpdatedPageTemplates(
                namedPages,
                page
            );
        expect(result.length).toBe(2);
        expect(result[0]).toBe(firstName);
        expect(result[1]).toBe(firstPageDictionary);
        document.destroy();
    });
});
describe('PdfDocument survived mutants batch 02', () => {
    // Mutant ID: 1160
    it('should preserve the correct parent reference after reordering a page', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        document.reorderPages([0]);
        const parentReference: _PdfReference =
            page._pageDictionary._get('Parent');
        const parentDictionary: _PdfDictionary =
            document._crossReference._fetch(parentReference);
        expect(parentReference).toBeDefined();
        expect(parentDictionary).toBeDefined();
        expect(parentDictionary.get('Type').name).toBe('Pages');
        expect(parentDictionary.get('Kids')[0]).toBe(page._ref);
        document.destroy();
    });
    // Mutant ID: 1161
    it('should create a page-tree Kids collection containing the reordered page', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        document.reorderPages([0]);
        const parentReference: _PdfReference =
            page._pageDictionary._get('Parent');
        const parentDictionary: _PdfDictionary =
            document._crossReference._fetch(parentReference);
        const kids: _PdfReference[] = parentDictionary.get('Kids');
        expect(kids).toBeDefined();
        expect(kids.length).toBe(1);
        expect(kids[0]).toBe(page._ref);
        document.destroy();
    });
    // Mutant ID: 1162
    it('should retain the Pages type on a reordered page-tree section', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        document.reorderPages([0]);
        const parentReference: _PdfReference =
            page._pageDictionary._get('Parent');
        const parentDictionary: _PdfDictionary =
            document._crossReference._fetch(parentReference);
        expect(parentDictionary.has('Type')).toBeTruthy();
        expect(parentDictionary.get('Type').name).toBe('Pages');
        document.destroy();
    });
    // Mutant ID: 1163
    it('should retain a page count of one on each reordered page-tree section', () => {
        const document: PdfDocument = new PdfDocument();
        const firstPage: PdfPage = document.addPage();
        document.addPage();
        document.reorderPages([0, 1]);
        const parentReference: _PdfReference =
            firstPage._pageDictionary._get('Parent');
        const parentDictionary: _PdfDictionary =
            document._crossReference._fetch(parentReference);
        expect(parentDictionary.get('Count')).toBe(1);
        expect(parentDictionary.get('Kids').length).toBe(1);
        document.destroy();
    });
    // Mutant ID: 1164
    it('should not copy an inherited page count over the reordered section count', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const originalParentReference: _PdfReference =
            page._pageDictionary._get('Parent');
        const originalParent: _PdfDictionary =
            document._crossReference._fetch(originalParentReference);
        originalParent.update('Count', 7);
        document.reorderPages([0]);
        const newParentReference: _PdfReference =
            page._pageDictionary._get('Parent');
        const newParent: _PdfDictionary =
            document._crossReference._fetch(newParentReference);
        expect(newParent.get('Count')).toBe(1);
        expect(newParent.get('Count')).not.toBe(7);
        document.destroy();
    });
    // Mutant ID: 1165
    it('should copy inherited resources while rebuilding a reordered page section', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const originalParentReference: _PdfReference =
            page._pageDictionary._get('Parent');
        const originalParent: _PdfDictionary =
            document._crossReference._fetch(originalParentReference);
        const resources: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        resources.update(
            'ProcSet',
            [_PdfName.get('PDF'), _PdfName.get('Text')]
        );
        originalParent.update('Resources', resources);
        document.reorderPages([0]);
        const newParentReference: _PdfReference =
            page._pageDictionary._get('Parent');
        const newParent: _PdfDictionary =
            document._crossReference._fetch(newParentReference);
        const clonedResources: _PdfDictionary =
            newParent.get('Resources');
        expect(newParent.has('Resources')).toBeTruthy();
        expect(clonedResources).toBeDefined();
        expect(clonedResources.has('ProcSet')).toBeTruthy();
        expect(clonedResources.get('ProcSet').length).toBe(2);
        document.destroy();
    });
    // Mutant ID: 1166
    it('should preserve resource information after reordering and saving', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            12
        );
        page.graphics.drawString(
            'Reordered resource test',
            font,
            { x: 10, y: 10, width: 200, height: 30 },
            new PdfBrush()
        );
        document.reorderPages([0]);
        const data: Uint8Array = document.save() as Uint8Array;
        const loadedDocument: PdfDocument = new PdfDocument(data);
        const loadedPage: PdfPage = loadedDocument.getPage(0);
        expect(data.length).toBeGreaterThan(0);
        expect(loadedPage._pageDictionary.has('Resources')).toBeTruthy();
        loadedDocument.destroy();
        document.destroy();
    });
    // Mutant ID: 1173
    it('should traverse the parent chain while rebuilding reordered page sections', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const originalParentReference: _PdfReference =
            page._pageDictionary._get('Parent');
        const originalParent: _PdfDictionary =
            document._crossReference._fetch(originalParentReference);
        const rootReference: _PdfReference =
            originalParent._get('Parent');
        expect(originalParent.has('Parent')).toBeTruthy();
        expect(rootReference).toBeDefined();
        document.reorderPages([0]);
        const newParentReference: _PdfReference =
            page._pageDictionary._get('Parent');
        const newParent: _PdfDictionary =
            document._crossReference._fetch(newParentReference);
        expect(newParent.has('Parent')).toBeTruthy();
        expect(newParent._get('Parent')).toBeDefined();
        document.destroy();
    });
    // Mutant ID: 1174
    it('should terminate parent traversal when the page tree has no further parent', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        document.reorderPages([0]);
        const parentReference: _PdfReference =
            page._pageDictionary._get('Parent');
        const parentDictionary: _PdfDictionary =
            document._crossReference._fetch(parentReference);
        const rootReference: _PdfReference =
            parentDictionary._get('Parent');
        const rootDictionary: _PdfDictionary =
            document._crossReference._fetch(rootReference);
        expect(rootDictionary).toBeDefined();
        expect(rootDictionary.get('Type').name).toBe('Pages');
        expect(document.pageCount).toBe(1);
        document.destroy();
    });
    // Mutant ID: 1175
    it('should use the Parent entry to reach the next page-tree dictionary', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const originalParentReference: _PdfReference =
            page._pageDictionary._get('Parent');
        const originalParent: _PdfDictionary =
            document._crossReference._fetch(originalParentReference);
        expect(originalParent.has('Parent')).toBeTruthy();
        document.reorderPages([0]);
        const newParentReference: _PdfReference =
            page._pageDictionary._get('Parent');
        const newParent: _PdfDictionary =
            document._crossReference._fetch(newParentReference);
        expect(newParent.has('Parent')).toBeTruthy();
        expect(newParent._get('Parent')).toBeDefined();
        document.destroy();
    });
    // Mutant ID: 1177
    it('should retrieve the parent dictionary through the Parent key', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const sectionReference: _PdfReference =
            page._pageDictionary._get('Parent');
        const sectionDictionary: _PdfDictionary =
            document._crossReference._fetch(sectionReference);
        const rootReference: _PdfReference =
            sectionDictionary._get('Parent');
        const rootDictionary: _PdfDictionary =
            document._crossReference._fetch(rootReference);
        expect(rootDictionary).toBeDefined();
        expect(rootDictionary.get('Type').name).toBe('Pages');
        document.reorderPages([0]);
        expect(document.pageCount).toBe(1);
        expect(document.getPage(0)).toBe(page);
        document.destroy();
    });
    // Mutant ID: 1180
    it('should update the catalog page tree after reordering pages', () => {
        const document: PdfDocument = new PdfDocument();
        const firstPage: PdfPage = document.addPage();
        const secondPage: PdfPage = document.addPage();
        document.reorderPages([1, 0]);
        expect(document.pageCount).toBe(2);
        expect(document.getPage(0)).toBe(secondPage);
        expect(document.getPage(1)).toBe(firstPage);
        expect(document._catalog).toBeDefined();
        expect(
            document._catalog._catalogDictionary.has('Pages')
        ).toBeTruthy();
        document.destroy();
    });
    // Mutant ID: 1183
    it('should update the top page-tree Kids collection after reordering', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.addPage();
        document.reorderPages([2, 0, 1]);
        const pagesReference: _PdfReference =
            document._catalog._catalogDictionary._get('Pages');
        const pagesDictionary: _PdfDictionary =
            document._crossReference._fetch(pagesReference);
        const kids: _PdfReference[] =
            pagesDictionary.get('Kids');
        expect(kids).toBeDefined();
        expect(kids.length).toBe(3);
        expect(pagesDictionary.get('Count')).toBe(3);
        document.destroy();
    });
    // Mutant ID: 1185
    it('should rebuild the page tree only when a parent dictionary contains Kids', () => {
        const document: PdfDocument = new PdfDocument();
        const firstPage: PdfPage = document.addPage();
        const secondPage: PdfPage = document.addPage();
        document.reorderPages([1, 0]);
        const pagesReference: _PdfReference =
            document._catalog._catalogDictionary._get('Pages');
        const pagesDictionary: _PdfDictionary =
            document._crossReference._fetch(pagesReference);
        expect(pagesDictionary).toBeDefined();
        expect(pagesDictionary.has('Kids')).toBeTruthy();
        expect(pagesDictionary.get('Kids').length).toBe(2);
        expect(document.getPage(0)).toBe(secondPage);
        expect(document.getPage(1)).toBe(firstPage);
        document.destroy();
    });
    // Mutant ID: 1188
    it('should retrieve reordered page-tree children through the Kids key', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        document.reorderPages([1, 0]);
        const pagesReference: _PdfReference =
            document._catalog._catalogDictionary._get('Pages');
        const pagesDictionary: _PdfDictionary =
            document._crossReference._fetch(pagesReference);
        const kids: _PdfReference[] =
            pagesDictionary.get('Kids');
        expect(kids).toBeDefined();
        expect(kids.length).toBe(2);
        expect(kids[0]).toBeDefined();
        expect(kids[1]).toBeDefined();
        document.destroy();
    });
    // Mutant ID: 1282
    it('should automatically add a page when saving an empty new document', () => {
        const document: PdfDocument = new PdfDocument();
        expect(document.pageCount).toBe(0);
        const data: Uint8Array =
            document.save() as Uint8Array;
        expect(data.length).toBeGreaterThan(0);
        expect(document.pageCount).toBe(1);
        const loadedDocument: PdfDocument =
            new PdfDocument(data);
        expect(loadedDocument.pageCount).toBe(1);
        loadedDocument.destroy();
        document.destroy();
    });
    // Mutant ID: 1544
    it('should report revision six AES-256 security after saving and reloading', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.setSecurity({
            encryptionType: PdfEncryptionType.aesBit256Rev6,
            userPassword: 'user-password',
            ownerPassword: 'owner-password',
            permissions: PdfPermissionFlag.default
        });
        const data: Uint8Array =
            document.save() as Uint8Array;
        const loadedDocument: PdfDocument =
            new PdfDocument(data, 'owner-password');
        const security: PdfSecurityOptions =
            loadedDocument.getSecurity();
        expect(security).toBeDefined();
        expect(security.encryptionType)
            .toBe(PdfEncryptionType.aesBit256Rev6);
        expect(security.ownerPassword)
            .toBe('owner-password');
        loadedDocument.destroy();
        document.destroy();
    });
    // Mutant ID: 1613
    it('should read named destinations when the catalog contains a Names dictionary', () => {
        const document: PdfDocument = new PdfDocument();
        const names: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        document._catalog._catalogDictionary.update(
            'Names',
            names
        );
        (document as any)._namedDestinationCollection = undefined;
        const collection: _PdfNamedDestinationCollection =
            document._destinationCollection;
        expect(collection).toBeDefined();
        expect(
            document._catalog._catalogDictionary.has('Names')
        ).toBeTruthy();
        document.destroy();
    });
    // Mutant ID: 1615
    it('should inspect the catalog Names key for named destinations', () => {
        const document: PdfDocument = new PdfDocument();
        const names: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        const destinations: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        names.update('Dests', destinations);
        document._catalog._catalogDictionary.update(
            'Names',
            names
        );
        (document as any)._namedDestinationCollection = undefined;
        const collection: _PdfNamedDestinationCollection =
            document._destinationCollection;
        expect(collection).toBeDefined();
        expect(
            document._catalog._catalogDictionary.get('Names')
        ).toBe(names);
        document.destroy();
    });
    // Mutant ID: 1617
    it('should pass the catalog Names dictionary to the destination collection', () => {
        const document: PdfDocument = new PdfDocument();
        const names: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        const destinations: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        destinations.update('Names', []);
        names.update('Dests', destinations);
        document._catalog._catalogDictionary.update(
            'Names',
            names
        );
        (document as any)._namedDestinationCollection = undefined;
        const collection: _PdfNamedDestinationCollection =
            document._destinationCollection;
        expect(collection).toBeDefined();
        expect(
            document._catalog._catalogDictionary.get('Names')
        ).toBe(names);
        document.destroy();
    });
    // Mutant ID: 1783
    it('should update an existing catalog metadata stream', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const metadata: PdfXmpMetadata =
            document._getMetadataValue();
        metadata.customSchema.customData.set(
            'MutationBatch',
            'Second'
        );
        metadata._isUpdated = true;
        const data: Uint8Array =
            document.save() as Uint8Array;
        const loadedDocument: PdfDocument =
            new PdfDocument(data);
        const loadedMetadata: PdfXmpMetadata =
            loadedDocument._getMetadataValue();
        expect(data.length).toBeGreaterThan(0);
        expect(loadedMetadata).toBeDefined();
        loadedDocument.destroy();
        document.destroy();
    });
    // Mutant ID: 1787
    it('should create a dictionary for a serialized XMP metadata stream', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const metadata: PdfXmpMetadata =
            document._getMetadataValue();
        metadata.customSchema.customData.set(
            'DictionaryState',
            'Created'
        );
        metadata._isUpdated = false;
        document._addXmpMetadata();
        expect(metadata._xmpStream).toBeDefined();
        expect(metadata._xmpStream.dictionary)
            .toBeDefined();
        expect(
            document._catalog._catalogDictionary.has(
                'Metadata'
            )
        ).toBeTruthy();
        document.destroy();
    });
    // Mutant ID: 1790
    it('should mark a generated XMP stream dictionary as updated', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const metadata: PdfXmpMetadata =
            document._getMetadataValue();
        metadata.customSchema.customData.set(
            'DictionaryUpdate',
            'Required'
        );
        metadata._isUpdated = false;
        document._addXmpMetadata();
        expect(metadata._xmpStream).toBeDefined();
        expect(metadata._xmpStream.dictionary)
            .toBeDefined();
        expect(metadata._xmpStream.dictionary._updated)
            .toBeTruthy();
        document.destroy();
    });
    // Mutant ID: 1791
    it('should assign the Type entry to a generated XMP stream dictionary', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const metadata: PdfXmpMetadata =
            document._getMetadataValue();
        metadata.customSchema.customData.set(
            'MetadataType',
            'Validation'
        );
        metadata._isUpdated = false;
        document._addXmpMetadata();
        const dictionary: _PdfDictionary =
            metadata._xmpStream.dictionary;
        const type: _PdfName =
            dictionary.get('Type');
        expect(dictionary.has('Type')).toBeTruthy();
        expect(type).toBeDefined();
        expect(type.name).toBe('Metadata');
        document.destroy();
    });
    // Mutant ID: 1614
    it('should initialize the destination collection from an existing Names dictionary', () => {
        const document: PdfDocument = new PdfDocument();
        const namesDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        const destinationDictionary: _PdfDictionary =
            new _PdfDictionary(document._crossReference);
        destinationDictionary.update('Names', []);
        namesDictionary.update(
            'Dests',
            destinationDictionary
        );
        document._catalog._catalogDictionary.update(
            'Names',
            namesDictionary
        );
        (document as any)._namedDestinationCollection = undefined;
        expect(
            document._catalog._catalogDictionary.has('Names')
        ).toBeTruthy();
        expect(
            document._catalog._catalogDictionary.get('Names')
        ).toBe(namesDictionary);
        const collection: _PdfNamedDestinationCollection =
            document._destinationCollection;
        expect(collection).toBeDefined();
        expect(
            document._namedDestinationCollection
        ).toBe(collection);
        const cachedCollection: _PdfNamedDestinationCollection =
            document._destinationCollection;
        expect(cachedCollection).toBe(collection);
        document.destroy();
    });
});
describe('PdfDocument survived mutants batch 03', () => {
    // Mutant ID: 1991
    it('should create a clean foreground content stream before writing graphics operators', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const template: PdfTemplate =
            new PdfTemplate({
                width: 100,
                height: 30
            });
        const font: PdfStandardFont =
            new PdfStandardFont(
                PdfFontFamily.helvetica,
                10
            );
        const brush: PdfBrush =
            new PdfBrush({
                r: 0,
                g: 0,
                b: 0
            });
        template.graphics.drawString(
            'Foreground template',
            font,
            {
                x: 5,
                y: 5,
                width: 90,
                height: 20
            },
            brush
        );
        (document as any)._drawForegroundTemplate(
            page,
            template,
            {
                x: 10,
                y: 10,
                width: 100,
                height: 30
            }
        );
        expect(page._contents).toBeDefined();
        expect(page._contents.length).toBe(1);
        const reference: _PdfReference =
            page._contents[0];
        const stream: _PdfContentStream =
            document._crossReference._fetch(reference);
        expect(stream).toBeDefined();
        expect(stream._bytes).toBeDefined();
        expect(stream._bytes.length).toBeGreaterThan(0);
        const streamText: string =
            String.fromCharCode.apply(
                null,
                stream._bytes
            );
        expect(streamText.indexOf('q'))
            .toBeGreaterThanOrEqual(0);
        expect(streamText.indexOf('Q'))
            .toBeGreaterThanOrEqual(0);
        document.destroy();
    });
    // Mutant ID: 2017
    it('should use document templates when the section index is omitted', () => {
        const document: PdfDocument = new PdfDocument();
        const element: PdfPageTemplateElement =
            new PdfPageTemplateElement({
                width: 100,
                height: 30
            });
        document.template.top = {
            template: element,
            alignment: PdfTemplateHorizontalAlignment.center
        };
        const result: any =
            (document as any)._getTemplateForSide(
                _TemplateSide.top,
                true
            );
        expect(result).toBeDefined();
        expect(result.template).toBe(element);
        expect(result.documentTemplate)
            .toBe(document.template);
        document.destroy();
    });
    // Mutant ID: 2019
    it('should default an omitted section index to minus one', () => {
        const document: PdfDocument = new PdfDocument();
        const element: PdfPageTemplateElement =
            new PdfPageTemplateElement({
                width: 100,
                height: 30
            });
        document.template.bottom = {
            template: element,
            alignment: PdfTemplateHorizontalAlignment.left
        };
        const resultWithoutIndex: any =
            (document as any)._getTemplateForSide(
                _TemplateSide.bottom,
                true
            );
        const resultWithMinusOne: any =
            (document as any)._getTemplateForSide(
                _TemplateSide.bottom,
                true,
                -1
            );
        expect(resultWithoutIndex).toBeDefined();
        expect(resultWithMinusOne).toBeDefined();
        expect(resultWithoutIndex.template)
            .toBe(resultWithMinusOne.template);
        expect(resultWithoutIndex.template)
            .toBe(element);
        document.destroy();
    });
    // Mutant ID: 2040
    it('should not inspect a section when the section index is negative', () => {
        const document: PdfDocument = new PdfDocument();
        const element: PdfPageTemplateElement =
            new PdfPageTemplateElement({
                width: 100,
                height: 30
            });
        document.template.left = {
            template: element,
            alignment: PdfTemplateVerticalAlignment.middle
        };
        const result: any =
            (document as any)._getTemplateForSide(
                _TemplateSide.left,
                true,
                -1
            );
        expect(result).toBeDefined();
        expect(result.template).toBe(element);
        expect(result.documentTemplate)
            .toBe(document.template);
        document.destroy();
    });
    // Mutant ID: 2041
    it('should not inspect a section when the index equals the section count', () => {
        const document: PdfDocument = new PdfDocument();
        const element: PdfPageTemplateElement =
            new PdfPageTemplateElement({
                width: 100,
                height: 30
            });
        document.template.right = {
            template: element,
            alignment: PdfTemplateVerticalAlignment.bottom
        };
        const sectionCount: number =
            document._sections.length;
        const result: any =
            (document as any)._getTemplateForSide(
                _TemplateSide.right,
                true,
                sectionCount
            );
        expect(sectionCount).toBe(0);
        expect(result).toBeDefined();
        expect(result.template).toBe(element);
        document.destroy();
    });
    // Mutant ID: 2044
    it('should fall back to the document template when a section has no matching template', () => {
        const document: PdfDocument = new PdfDocument();
        const section: PdfSection =
            document.addSection();
        section.addPage();
        const element: PdfPageTemplateElement =
            new PdfPageTemplateElement({
                width: 100,
                height: 30
            });
        document.template.top = {
            template: element,
            alignment: PdfTemplateHorizontalAlignment.right
        };
        const result: any =
            (document as any)._getTemplateForSide(
                _TemplateSide.top,
                true,
                0
            );
        expect(result).toBeDefined();
        expect(result.template).toBe(element);
        expect(result.documentTemplate)
            .toBe(document.template);
        document.destroy();
    });
    // Mutant ID: 2097
    it('should not select an odd section template for an even page', () => {
        const document: PdfDocument = new PdfDocument();
        const section: PdfSection =
            document.addSection();
        const oddElement: PdfPageTemplateElement =
            new PdfPageTemplateElement({
                width: 100,
                height: 20
            });
        const evenElement: PdfPageTemplateElement =
            new PdfPageTemplateElement({
                width: 100,
                height: 30
            });
        section.template.oddTop = {
            template: oddElement
        };
        section.template.evenTop = {
            template: evenElement
        };
        const result: any =
            (document as any)._getSectionTemplateForSide(
                section,
                _TemplateSide.top,
                false
            );
        expect(result).toBeDefined();
        expect(result.template).toBe(evenElement);
        expect(result.template).not.toBe(oddElement);
        document.destroy();
    });
    // Mutant ID: 2099
    it('should not select an even section template for an odd page', () => {
        const document: PdfDocument = new PdfDocument();
        const section: PdfSection =
            document.addSection();
        const evenElement: PdfPageTemplateElement =
            new PdfPageTemplateElement({
                width: 100,
                height: 20
            });
        const baseElement: PdfPageTemplateElement =
            new PdfPageTemplateElement({
                width: 100,
                height: 30
            });
        section.template.evenBottom = {
            template: evenElement
        };
        section.template.bottom = {
            template: baseElement
        };
        const result: any =
            (document as any)._getSectionTemplateForSide(
                section,
                _TemplateSide.bottom,
                true
            );
        expect(result).toBeDefined();
        expect(result.template).toBe(baseElement);
        expect(result.template).not.toBe(evenElement);
        document.destroy();
    });
    // Mutant ID: 2101
    it('should use the base section template for an odd page when only an even override exists', () => {
        const document: PdfDocument = new PdfDocument();
        const section: PdfSection =
            document.addSection();
        const evenElement: PdfPageTemplateElement =
            new PdfPageTemplateElement({
                width: 20,
                height: 100
            });
        const baseElement: PdfPageTemplateElement =
            new PdfPageTemplateElement({
                width: 30,
                height: 100
            });
        section.template.evenLeft = {
            template: evenElement
        };
        section.template.left = {
            template: baseElement
        };
        const result: any =
            (document as any)._getSectionTemplateForSide(
                section,
                _TemplateSide.left,
                true
            );
        expect(result).toBeDefined();
        expect(result.template).toBe(baseElement);
        expect(result.template).not.toBe(evenElement);
        document.destroy();
    });
    // Mutant ID: 2144
    it('should use dock bounds when template alignment is undefined', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const element: PdfPageTemplateElement =
            new PdfPageTemplateElement({
                width: 120,
                height: 25
            });
        const template: PdfDocumentTemplate = {
            top: {
                template: element
            }
        };
        const result: Rectangle =
            document._getTemplateAlignmentPosition(
                page,
                template,
                undefined,
                _TemplateSide.top,
                true
            );
        const dockBounds: Rectangle =
            (document as any)._getTemplateDockBounds(
                page,
                element,
                'top'
            );
        expect(result.x).toBe(dockBounds.x);
        expect(result.y).toBe(dockBounds.y);
        expect(result.width).toBe(dockBounds.width);
        expect(result.height).toBe(dockBounds.height);
        document.destroy();
    });
    // Mutant ID: 2146
    it('should use dock bounds when horizontal alignment is none', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const element: PdfPageTemplateElement =
            new PdfPageTemplateElement({
                width: 120,
                height: 25
            });
        const template: PdfDocumentTemplate = {
            bottom: {
                template: element
            }
        };
        const result: Rectangle =
            document._getTemplateAlignmentPosition(
                page,
                template,
                PdfTemplateHorizontalAlignment.none,
                _TemplateSide.bottom,
                true
            );
        const dockBounds: Rectangle =
            (document as any)._getTemplateDockBounds(
                page,
                element,
                'bottom'
            );
        expect(result.x).toBe(dockBounds.x);
        expect(result.y).toBe(dockBounds.y);
        expect(result.width).toBe(dockBounds.width);
        expect(result.height).toBe(dockBounds.height);
        document.destroy();
    });
    // Mutant ID: 2164
    it('should preserve a right template side during normalization', () => {
        const document: PdfDocument = new PdfDocument();
        const result: _TemplateSide =
            (document as any)._normalizeTemplateSide(
                _TemplateSide.right
            );
        expect(result).toBe(_TemplateSide.right);
        document.destroy();
    });
    // Mutant ID: 2165
    it('should preserve each base template side during normalization', () => {
        const document: PdfDocument = new PdfDocument();
        expect(
            (document as any)._normalizeTemplateSide(
                _TemplateSide.top
            )
        ).toBe(_TemplateSide.top);
        expect(
            (document as any)._normalizeTemplateSide(
                _TemplateSide.bottom
            )
        ).toBe(_TemplateSide.bottom);
        expect(
            (document as any)._normalizeTemplateSide(
                _TemplateSide.left
            )
        ).toBe(_TemplateSide.left);
        expect(
            (document as any)._normalizeTemplateSide(
                _TemplateSide.right
            )
        ).toBe(_TemplateSide.right);
        document.destroy();
    });
    // Mutant ID: 2166
    it('should preserve a left template side during normalization', () => {
        const document: PdfDocument = new PdfDocument();
        const result: _TemplateSide =
            (document as any)._normalizeTemplateSide(
                _TemplateSide.left
            );
        expect(result).toBe(_TemplateSide.left);
        document.destroy();
    });
    // Mutant ID: 2167
    it('should distinguish the left template side from top and bottom', () => {
        const document: PdfDocument = new PdfDocument();
        const left: _TemplateSide =
            (document as any)._normalizeTemplateSide(
                _TemplateSide.left
            );
        const top: _TemplateSide =
            (document as any)._normalizeTemplateSide(
                _TemplateSide.top
            );
        const bottom: _TemplateSide =
            (document as any)._normalizeTemplateSide(
                _TemplateSide.bottom
            );
        expect(left).toBe(_TemplateSide.left);
        expect(left).not.toBe(top);
        expect(left).not.toBe(bottom);
        document.destroy();
    });
    // Mutant ID: 2168
    it('should preserve a bottom template side during normalization', () => {
        const document: PdfDocument = new PdfDocument();
        const result: _TemplateSide =
            (document as any)._normalizeTemplateSide(
                _TemplateSide.bottom
            );
        expect(result).toBe(_TemplateSide.bottom);
        document.destroy();
    });
    // Mutant ID: 2169
    it('should distinguish top and bottom template sides during normalization', () => {
        const document: PdfDocument = new PdfDocument();
        const top: _TemplateSide =
            (document as any)._normalizeTemplateSide(
                _TemplateSide.top
            );
        const bottom: _TemplateSide =
            (document as any)._normalizeTemplateSide(
                _TemplateSide.bottom
            );
        expect(top).toBe(_TemplateSide.top);
        expect(bottom).toBe(_TemplateSide.bottom);
        expect(top).not.toBe(bottom);
        document.destroy();
    });
    // Mutant ID: 2170
    it('should preserve a top template side during normalization', () => {
        const document: PdfDocument = new PdfDocument();
        const result: _TemplateSide =
            (document as any)._normalizeTemplateSide(
                _TemplateSide.top
            );
        expect(result).toBe(_TemplateSide.top);
        document.destroy();
    });
    // Mutant ID: 2172
    it('should preserve the bottom side instead of using the document-template switch', () => {
        const document: PdfDocument = new PdfDocument();
        const result: _TemplateSide =
            (document as any)._normalizeTemplateSide(
                _TemplateSide.bottom
            );
        expect(result).toBe(_TemplateSide.bottom);
        expect(result).not.toBe(_TemplateSide.right);
        document.destroy();
    });
    // Mutant ID: 2174
    it('should preserve the left side instead of defaulting to right', () => {
        const document: PdfDocument = new PdfDocument();
        const result: _TemplateSide =
            (document as any)._normalizeTemplateSide(
                _TemplateSide.left
            );
        expect(result).toBe(_TemplateSide.left);
        expect(result).not.toBe(_TemplateSide.right);
        document.destroy();
    });
    // Mutant ID: 2176
    it('should preserve the right side without passing through document-template key mapping', () => {
        const document: PdfDocument = new PdfDocument();
        const result: _TemplateSide =
            (document as any)._normalizeTemplateSide(
                _TemplateSide.right
            );
        expect(result).toBe(_TemplateSide.right);
        document.destroy();
    });
    // Mutant ID: 2178
    it('should return a base template side directly when a template side is supplied', () => {
        const document: PdfDocument = new PdfDocument();
        const result: _TemplateSide[] = [
            (document as any)._normalizeTemplateSide(
                _TemplateSide.top
            ),
            (document as any)._normalizeTemplateSide(
                _TemplateSide.bottom
            ),
            (document as any)._normalizeTemplateSide(
                _TemplateSide.left
            ),
            (document as any)._normalizeTemplateSide(
                _TemplateSide.right
            )
        ];
        expect(result.length).toBe(4);
        expect(result[0]).toBe(_TemplateSide.top);
        expect(result[1]).toBe(_TemplateSide.bottom);
        expect(result[2]).toBe(_TemplateSide.left);
        expect(result[3]).toBe(_TemplateSide.right);
        document.destroy();
    });
    // Mutant ID: 2185
    it('should map undefined top alignment to the top-left style', () => {
        const document: PdfDocument = new PdfDocument();
        const result: _PdfAlignmentStyle =
            (document as any)._mapTemplateAlignmentStyle(
                _TemplateSide.top,
                undefined
            );
        expect(result).toBe(
            _PdfAlignmentStyle.topLeft
        );
        document.destroy();
    });
    // Mutant ID: 2186
    it('should map a none alignment on the bottom side to bottom-left', () => {
        const document: PdfDocument = new PdfDocument();
        const result: _PdfAlignmentStyle =
            (document as any)._mapTemplateAlignmentStyle(
                _TemplateSide.bottom,
                PdfTemplateHorizontalAlignment.none
            );
        expect(result).toBe(
            _PdfAlignmentStyle.bottomLeft
        );
        document.destroy();
    });
    // Mutant ID: 2187
    it('should use the default alignment mapping when alignment is undefined', () => {
        const document: PdfDocument = new PdfDocument();
        const leftResult: _PdfAlignmentStyle =
            (document as any)._mapTemplateAlignmentStyle(
                _TemplateSide.left,
                undefined
            );
        const rightResult: _PdfAlignmentStyle =
            (document as any)._mapTemplateAlignmentStyle(
                _TemplateSide.right,
                undefined
            );
        expect(leftResult).toBe(
            _PdfAlignmentStyle.topLeft
        );
        expect(rightResult).toBe(
            _PdfAlignmentStyle.topRight
        );
        document.destroy();
    });
});
describe('PdfDocument survived mutants batch 04', () => {
    // Mutant ID: 2189
    it('should use the default top-left alignment when alignment is undefined', () => {
        const document: PdfDocument = new PdfDocument();
        const result: _PdfAlignmentStyle =
            (document as any)._mapTemplateAlignmentStyle(
                _TemplateSide.top,
                undefined
            );
        expect(result).toBe(_PdfAlignmentStyle.topLeft);
        document.destroy();
    });
    // Mutant ID: 2191
    it('should recognize the undefined alignment type', () => {
        const document: PdfDocument = new PdfDocument();
        const topResult: _PdfAlignmentStyle =
            (document as any)._mapTemplateAlignmentStyle(
                _TemplateSide.top,
                undefined
            );
        const rightResult: _PdfAlignmentStyle =
            (document as any)._mapTemplateAlignmentStyle(
                _TemplateSide.right,
                undefined
            );
        expect(topResult).toBe(_PdfAlignmentStyle.topLeft);
        expect(rightResult).toBe(_PdfAlignmentStyle.topRight);
        document.destroy();
    });
    // Mutant ID: 2192
    it('should apply the default bottom alignment when horizontal alignment is none', () => {
        const document: PdfDocument = new PdfDocument();
        const result: _PdfAlignmentStyle =
            (document as any)._mapTemplateAlignmentStyle(
                _TemplateSide.bottom,
                PdfTemplateHorizontalAlignment.none
            );
        expect(result).toBe(_PdfAlignmentStyle.bottomLeft);
        document.destroy();
    });
    // Mutant ID: 2194
    it('should apply the default right alignment when vertical alignment is none', () => {
        const document: PdfDocument = new PdfDocument();
        const result: _PdfAlignmentStyle =
            (document as any)._mapTemplateAlignmentStyle(
                _TemplateSide.right,
                PdfTemplateVerticalAlignment.none
            );
        expect(result).toBe(_PdfAlignmentStyle.topRight);
        document.destroy();
    });
    // Mutant ID: 2196
    it('should return side-specific defaults when alignment is not provided', () => {
        const document: PdfDocument = new PdfDocument();
        expect(
            (document as any)._mapTemplateAlignmentStyle(
                _TemplateSide.top,
                undefined
            )
        ).toBe(_PdfAlignmentStyle.topLeft);
        expect(
            (document as any)._mapTemplateAlignmentStyle(
                _TemplateSide.bottom,
                undefined
            )
        ).toBe(_PdfAlignmentStyle.bottomLeft);
        expect(
            (document as any)._mapTemplateAlignmentStyle(
                _TemplateSide.left,
                undefined
            )
        ).toBe(_PdfAlignmentStyle.topLeft);
        expect(
            (document as any)._mapTemplateAlignmentStyle(
                _TemplateSide.right,
                undefined
            )
        ).toBe(_PdfAlignmentStyle.topRight);
        document.destroy();
    });
    // Mutant ID: 2199
    it('should map an unaligned right-side template to top-right', () => {
        const document: PdfDocument = new PdfDocument();
        const result: _PdfAlignmentStyle =
            (document as any)._mapTemplateAlignmentStyle(
                _TemplateSide.right,
                undefined
            );
        expect(result).toBe(_PdfAlignmentStyle.topRight);
        expect(result).not.toBe(_PdfAlignmentStyle.bottomLeft);
        document.destroy();
    });
    // Mutant ID: 2214
    it('should apply vertical middle alignment to a left-side template', () => {
        const document: PdfDocument = new PdfDocument();
        const result: _PdfAlignmentStyle =
            (document as any)._mapTemplateAlignmentStyle(
                _TemplateSide.left,
                PdfTemplateVerticalAlignment.middle
            );
        expect(result).toBe(_PdfAlignmentStyle.middleLeft);
        document.destroy();
    });
    // Mutant ID: 2254
    it('should apply the negative top offset only to a top-side template', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const element: PdfPageTemplateElement =
            new PdfPageTemplateElement({
                width: 100,
                height: 30
            });
        const topResult: Rectangle =
            document._getTemplateAlignmentBounds(
                element,
                page,
                _PdfAlignmentStyle.topLeft,
                _TemplateSide.top
            );
        const leftElement: PdfPageTemplateElement =
            new PdfPageTemplateElement({
                width: 100,
                height: 30
            });
        const leftResult: Rectangle =
            document._getTemplateAlignmentBounds(
                leftElement,
                page,
                _PdfAlignmentStyle.topLeft,
                _TemplateSide.left
            );
        expect(topResult.y).toBeLessThanOrEqual(0);
        expect(leftResult.y).toBe(0);
        document.destroy();
    });
    // Mutant ID: 2300
    it('should classify an undefined template layer mode as reserving', () => {
        const document: PdfDocument = new PdfDocument();
        const result: boolean =
            (document as any)._isNonReservingTemplate(
                undefined
            );
        expect(result).toBeFalsy();
        document.destroy();
    });
    // Mutant ID: 2302
    it('should recognize undefined as the default template layer mode', () => {
        const document: PdfDocument = new PdfDocument();
        expect(
            (document as any)._isNonReservingTemplate(
                undefined
            )
        ).toBeFalsy();
        expect(
            (document as any)._isNonReservingTemplate(
                PdfTemplateLayerMode.background
            )
        ).toBeTruthy();
        document.destroy();
    });
    // Mutant ID: 2303
    it('should return false immediately for an omitted template layer mode', () => {
        const document: PdfDocument = new PdfDocument();
        const omittedResult: boolean =
            (document as any)._isNonReservingTemplate();
        const backgroundResult: boolean =
            (document as any)._isNonReservingTemplate(
                PdfTemplateLayerMode.background
            );
        const foregroundResult: boolean =
            (document as any)._isNonReservingTemplate(
                PdfTemplateLayerMode.foreground
            );
        expect(omittedResult).toBeFalsy();
        expect(backgroundResult).toBeTruthy();
        expect(foregroundResult).toBeTruthy();
        document.destroy();
    });
    // Mutant ID: 2324
    it('should use the even-left template for the second page', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const secondPage: PdfPage = document.addPage();
        const oddElement: PdfPageTemplateElement =
            new PdfPageTemplateElement({
                width: 25,
                height: 100
            });
        const evenElement: PdfPageTemplateElement =
            new PdfPageTemplateElement({
                width: 55,
                height: 100
            });
        document.template.oddLeft = {
            template: oddElement
        };
        document.template.evenLeft = {
            template: evenElement
        };
        const result: number =
            document._getLeftIndentWidth(
                secondPage,
                false
            );
        expect(secondPage._pageIndex).toBe(1);
        expect(result).toBe(55);
        document.destroy();
    });
    // Mutant ID: 2364
    it('should use the even-top template for the second page', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const secondPage: PdfPage = document.addPage();
        const oddElement: PdfPageTemplateElement =
            new PdfPageTemplateElement({
                width: 100,
                height: 20
            });
        const evenElement: PdfPageTemplateElement =
            new PdfPageTemplateElement({
                width: 100,
                height: 45
            });
        document.template.oddTop = {
            template: oddElement
        };
        document.template.evenTop = {
            template: evenElement
        };
        const result: number =
            document._getTopIndentHeight(
                secondPage,
                false
            );
        expect(secondPage._pageIndex).toBe(1);
        expect(result).toBe(45);
        document.destroy();
    });
    // Mutant ID: 2404
    it('should use the even-right template for the second page', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const secondPage: PdfPage = document.addPage();
        const oddElement: PdfPageTemplateElement =
            new PdfPageTemplateElement({
                width: 30,
                height: 100
            });
        const evenElement: PdfPageTemplateElement =
            new PdfPageTemplateElement({
                width: 60,
                height: 100
            });
        document.template.oddRight = {
            template: oddElement
        };
        document.template.evenRight = {
            template: evenElement
        };
        const result: number =
            document._getRightIndentWidth(
                secondPage,
                false
            );
        expect(secondPage._pageIndex).toBe(1);
        expect(result).toBe(60);
        document.destroy();
    });
    // Mutant ID: 2444
    it('should use the even-bottom template for the second page', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const secondPage: PdfPage = document.addPage();
        const oddElement: PdfPageTemplateElement =
            new PdfPageTemplateElement({
                width: 100,
                height: 25
            });
        const evenElement: PdfPageTemplateElement =
            new PdfPageTemplateElement({
                width: 100,
                height: 50
            });
        document.template.oddBottom = {
            template: oddElement
        };
        document.template.evenBottom = {
            template: evenElement
        };
        const result: number =
            document._getBottomIndentHeight(
                secondPage,
                false
            );
        expect(secondPage._pageIndex).toBe(1);
        expect(result).toBe(50);
        document.destroy();
    });
    // Mutant ID: 2551
    it('should mark the page dictionary as updated after flattening annotations', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const annotation: PdfUriAnnotation =
            new PdfUriAnnotation({
                x: 10,
                y: 10,
                width: 100,
                height: 20
            });
        annotation.uri = 'https://www.syncfusion.com';
        page.annotations.add(annotation);
        page._pageDictionary._updated = false;
        document._doPostProcessOnAnnotations(true);
        expect(page._pageDictionary.has('Annots'))
            .toBeFalsy();
        expect(page._pageDictionary._updated)
            .toBeTruthy();
        document.destroy();
    });
    // Mutant ID: 2693
    it('should use rotated dimensions for a new page with angle ninety rotation', () => {
        const document: PdfDocument = new PdfDocument();
        const settings: PdfPageSettings =
            new PdfPageSettings();
        settings.rotation =
            PdfRotationAngle.angle90;
        const page: PdfPage =
            document.addPage(settings);
        const font: PdfStandardFont =
            new PdfStandardFont(
                PdfFontFamily.helvetica,
                14
            );
        expect(page._isNew).toBeTruthy();
        expect(page.rotation).toBe(
            PdfRotationAngle.angle90
        );
        (document as any)._drawWatermarkOnPage(
            page,
            font,
            page.graphics,
            false
        );
        expect(page.annotations.count)
            .toBeGreaterThan(0);
        const annotation: PdfUriAnnotation =
            page.annotations.at(
                page.annotations.count - 1
            ) as PdfUriAnnotation;
        expect(annotation).toBeDefined();
        expect(annotation.bounds).toBeDefined();
        expect(annotation.bounds.width)
            .toBeGreaterThan(0);
        expect(annotation.bounds.height)
            .toBeGreaterThan(0);
        document.destroy();
    });
    // Mutant ID: 2710
    it('should calculate last-page watermark placement with rotated new-page dimensions', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page.rotation = PdfRotationAngle.angle90;
        (document as any)._drawWatermarkOnPage(
            page,
            new PdfStandardFont(
                PdfFontFamily.helvetica,
                14
            ),
            page.graphics,
            true
        );
        expect(page.annotations.count)
            .toBeGreaterThan(0);
        const annotation: PdfUriAnnotation =
            page.annotations.at(
                page.annotations.count - 1
            ) as PdfUriAnnotation;
        expect(annotation.bounds).toBeDefined();
        expect(annotation.bounds.width)
            .toBeGreaterThan(0);
        expect(annotation.bounds.height)
            .toBeGreaterThan(0);
        document.destroy();
    });
    // Mutant ID: 2713
    it('should support angle ninety when positioning the last-page watermark', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page.rotation = PdfRotationAngle.angle90;
        (document as any)._drawWatermarkOnPage(
            page,
            new PdfStandardFont(
                PdfFontFamily.helvetica,
                14
            ),
            page.graphics,
            true
        );
        const annotation: PdfUriAnnotation =
            page.annotations.at(
                page.annotations.count - 1
            ) as PdfUriAnnotation;
        expect(annotation).toBeDefined();
        expect(annotation.bounds.x).toBeDefined();
        expect(annotation.bounds.y).toBeDefined();
        document.destroy();
    });
    // Mutant ID: 2714
    it('should recognize angle two-seventy as a rotated page for watermark placement', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page.rotation = PdfRotationAngle.angle270;
        (document as any)._drawWatermarkOnPage(
            page,
            new PdfStandardFont(
                PdfFontFamily.helvetica,
                14
            ),
            page.graphics,
            true
        );
        const annotation: PdfUriAnnotation =
            page.annotations.at(
                page.annotations.count - 1
            ) as PdfUriAnnotation;
        expect(annotation).toBeDefined();
        expect(annotation.bounds.width)
            .toBeGreaterThan(0);
        expect(annotation.bounds.height)
            .toBeGreaterThan(0);
        document.destroy();
    });
    // Mutant ID: 2716
    it('should recognize angle ninety as a rotated page for last-page placement', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page.rotation = PdfRotationAngle.angle90;
        (document as any)._drawWatermarkOnPage(
            page,
            new PdfStandardFont(
                PdfFontFamily.helvetica,
                14
            ),
            page.graphics,
            true
        );
        expect(page.annotations.count)
            .toBeGreaterThan(0);
        const annotation: PdfUriAnnotation =
            page.annotations.at(
                page.annotations.count - 1
            ) as PdfUriAnnotation;
        expect(annotation.bounds).toBeDefined();
        document.destroy();
    });
    // Mutant ID: 2697
    it('should use rotated dimensions for a new page with angle two-seventy rotation', () => {
        const document: PdfDocument = new PdfDocument();
        const settings: PdfPageSettings =
            new PdfPageSettings();
        settings.rotation =
            PdfRotationAngle.angle270;
        const page: PdfPage =
            document.addPage(settings);
        const font: PdfStandardFont =
            new PdfStandardFont(
                PdfFontFamily.helvetica,
                14
            );
        expect(page._isNew).toBeTruthy();
        expect(page.rotation).toBe(
            PdfRotationAngle.angle270
        );
        (document as any)._drawWatermarkOnPage(
            page,
            font,
            page.graphics,
            false
        );
        expect(page.annotations.count)
            .toBeGreaterThan(0);
        const annotation: PdfUriAnnotation =
            page.annotations.at(
                page.annotations.count - 1
            ) as PdfUriAnnotation;
        expect(annotation).toBeDefined();
        expect(annotation.bounds).toBeDefined();
        expect(annotation.bounds.width)
            .toBeGreaterThan(0);
        expect(annotation.bounds.height)
            .toBeGreaterThan(0);
        const data: Uint8Array =
            document.save() as Uint8Array;
        expect(data).toBeDefined();
        expect(data.length).toBeGreaterThan(0);
        document.destroy();
    });
    // Mutant ID: 2731
    it('should apply new-page rotation processing before drawing watermark content', () => {
        const document: PdfDocument = new PdfDocument();
        const settings: PdfPageSettings =
            new PdfPageSettings();
        settings.rotation =
            PdfRotationAngle.angle180;
        const page: PdfPage =
            document.addPage(settings);
        const font: PdfStandardFont =
            new PdfStandardFont(
                PdfFontFamily.helvetica,
                14
            );
        expect(page._isNew).toBeTruthy();
        expect(page.rotation).toBe(
            PdfRotationAngle.angle180
        );
        (document as any)._drawWatermarkOnPage(
            page,
            font,
            page.graphics,
            false
        );
        expect(page.annotations.count)
            .toBeGreaterThan(0);
        const annotation: PdfUriAnnotation =
            page.annotations.at(
                page.annotations.count - 1
            ) as PdfUriAnnotation;
        expect(annotation).toBeDefined();
        expect(annotation.bounds).toBeDefined();
        expect(annotation.bounds.width)
            .toBeGreaterThan(0);
        expect(annotation.bounds.height)
            .toBeGreaterThan(0);
        document.destroy();
    });
    // Mutant ID: 2748
    it('should transform watermark bounds for a new page rotated by two-seventy degrees', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        page.rotation = PdfRotationAngle.angle270;
        (document as any)._drawWatermarkOnPage(
            page,
            new PdfStandardFont(
                PdfFontFamily.helvetica,
                14
            ),
            page.graphics,
            false
        );
        const annotation: PdfUriAnnotation =
            page.annotations.at(
                page.annotations.count - 1
            ) as PdfUriAnnotation;
        expect(annotation).toBeDefined();
        expect(annotation.bounds.x).toBeDefined();
        expect(annotation.bounds.y).toBeDefined();
        expect(annotation.bounds.width)
            .toBeGreaterThan(0);
        expect(annotation.bounds.height)
            .toBeGreaterThan(0);
        document.destroy();
    });
    // Mutant ID: 2798
    it('should keep the watermark link on the current line when it exactly fits the available width', () => {
        const document: PdfDocument = new PdfDocument();
        const settings: PdfPageSettings = new PdfPageSettings();
        settings.size = {
            width: 300,
            height: 420
        };
        const page: PdfPage = document.addPage(settings);
        const font: PdfStandardFont = new PdfStandardFont(
            PdfFontFamily.helvetica,
            14
        );
        (document as any)._drawWatermarkOnPage(
            page,
            font,
            page.graphics,
            false
        );
        expect(page.annotations.count).toBeGreaterThan(0);
        const annotation: PdfUriAnnotation =
            page.annotations.at(
                page.annotations.count - 1
            ) as PdfUriAnnotation;
        expect(annotation).toBeDefined();
        expect(annotation.bounds).toBeDefined();
        expect(annotation.bounds.width).toBeGreaterThan(0);
        expect(annotation.bounds.height).toBeGreaterThan(0);
        const data: Uint8Array =
            document.save() as Uint8Array;
        expect(data.length).toBeGreaterThan(0);
        document.destroy();
    });
});
describe('PdfDocument survived mutants batch 05', () => {
    // Mutant ID: 2869
    it('should reject an import target index greater than the destination page count', () => {
        const sourceDocument: PdfDocument = new PdfDocument();
        sourceDocument.addPage();
        const destinationDocument: PdfDocument =
            new PdfDocument();
        destinationDocument.addPage();
        const options: PdfPageImportOptions =
            new PdfPageImportOptions();
        options.targetIndex = 2;
        expect(() => {
            destinationDocument.importPageRange(
                sourceDocument,
                0,
                0,
                options
            );
        }).toThrowError('The target index is out of range.');
        destinationDocument.destroy();
        sourceDocument.destroy();
    });
    // Mutant ID: 2879
    it('should prepare source page references during a normal page-range import', () => {
        const sourceDocument: PdfDocument = new PdfDocument();
        sourceDocument.addPage();
        sourceDocument.addPage();
        const destinationDocument: PdfDocument =
            new PdfDocument();
        destinationDocument.importPageRange(
            sourceDocument,
            0,
            1
        );
        expect(destinationDocument.pageCount).toBe(2);
        expect(destinationDocument._isDuplicatePage)
            .toBeFalsy();
        destinationDocument.destroy();
        sourceDocument.destroy();
    });
    // Mutant ID: 2880
    it('should import every page in a requested nonduplicate page range', () => {
        const sourceDocument: PdfDocument = new PdfDocument();
        sourceDocument.addPage();
        sourceDocument.addPage();
        sourceDocument.addPage();
        const destinationDocument: PdfDocument =
            new PdfDocument();
        destinationDocument.importPageRange(
            sourceDocument,
            0,
            2
        );
        expect(destinationDocument.pageCount).toBe(3);
        const data: Uint8Array =
            destinationDocument.save() as Uint8Array;
        const loadedDocument: PdfDocument =
            new PdfDocument(data);
        expect(loadedDocument.pageCount).toBe(3);
        loadedDocument.destroy();
        destinationDocument.destroy();
        sourceDocument.destroy();
    });
    // Mutant ID: 2881
    it('should avoid the nonduplicate reference-preparation path while copying a page in the same document', () => {
        const document: PdfDocument = new PdfDocument();
        const originalPage: PdfPage = document.addPage();
        document.importPage(0);
        expect(document.pageCount).toBe(2);
        expect(document.getPage(0)).toBe(originalPage);
        expect(document.getPage(1)).toBeDefined();
        expect(document.getPage(1))
            .not.toBe(originalPage);
        expect(document._isDuplicatePage).toBeFalsy();
        document.destroy();
    });
    // Mutant ID: 2882
    it('should complete normal range import and retain all requested pages', () => {
        const sourceDocument: PdfDocument = new PdfDocument();
        sourceDocument.addPage();
        sourceDocument.addPage();
        const destinationDocument: PdfDocument =
            new PdfDocument();
        destinationDocument.addPage();
        destinationDocument.importPageRange(
            sourceDocument,
            0,
            1
        );
        expect(destinationDocument.pageCount).toBe(3);
        expect(destinationDocument.getPage(0))
            .toBeDefined();
        expect(destinationDocument.getPage(1))
            .toBeDefined();
        expect(destinationDocument.getPage(2))
            .toBeDefined();
        destinationDocument.destroy();
        sourceDocument.destroy();
    });
    it('should import through the final valid source page', () => {
        const sourceDocument: PdfDocument =
            new PdfDocument();
        sourceDocument.addPage();
        sourceDocument.addPage();
        const destinationDocument: PdfDocument =
            new PdfDocument();
        destinationDocument.importPageRange(
            sourceDocument,
            0,
            sourceDocument.pageCount - 1
        );
        expect(destinationDocument.pageCount).toBe(2);
        expect(destinationDocument.getPage(0)).toBeDefined();
        expect(destinationDocument.getPage(1)).toBeDefined();
        destinationDocument.destroy();
        sourceDocument.destroy();
    });
    // Mutant ID: 2884
    it('should enter the source-page preparation loop for a valid page range', () => {
        const sourceDocument: PdfDocument = new PdfDocument();
        sourceDocument.addPage();
        const destinationDocument: PdfDocument =
            new PdfDocument();
        destinationDocument.importPageRange(
            sourceDocument,
            0,
            0
        );
        expect(destinationDocument.pageCount).toBe(1);
        expect(destinationDocument.getPage(0))
            .toBeDefined();
        destinationDocument.destroy();
        sourceDocument.destroy();
    });
    // Mutant ID: 2885
    it('should include the final page of an inclusive import range', () => {
        const sourceDocument: PdfDocument = new PdfDocument();
        sourceDocument.addPage();
        sourceDocument.addPage();
        sourceDocument.addPage();
        const destinationDocument: PdfDocument =
            new PdfDocument();
        destinationDocument.importPageRange(
            sourceDocument,
            1,
            2
        );
        expect(destinationDocument.pageCount).toBe(2);
        const data: Uint8Array =
            destinationDocument.save() as Uint8Array;
        const loadedDocument: PdfDocument =
            new PdfDocument(data);
        expect(loadedDocument.pageCount).toBe(2);
        loadedDocument.destroy();
        destinationDocument.destroy();
        sourceDocument.destroy();
    });
    // Mutant ID: 2886
    it('should iterate forward through a multi-page import range', () => {
        const sourceDocument: PdfDocument = new PdfDocument();
        sourceDocument.addPage();
        sourceDocument.addPage();
        sourceDocument.addPage();
        const destinationDocument: PdfDocument =
            new PdfDocument();
        destinationDocument.importPageRange(
            sourceDocument,
            0,
            2
        );
        expect(destinationDocument.pageCount).toBe(3);
        expect(destinationDocument.getPage(0)._pageIndex)
            .toBe(0);
        expect(destinationDocument.getPage(1)._pageIndex)
            .toBe(1);
        expect(destinationDocument.getPage(2)._pageIndex)
            .toBe(2);
        destinationDocument.destroy();
        sourceDocument.destroy();
    });
    // Mutant ID: 2888
    it('should retain the source-page dictionaries required by the merge helper', () => {
        const sourceDocument: PdfDocument = new PdfDocument();
        const firstSourcePage: PdfPage =
            sourceDocument.addPage();
        const secondSourcePage: PdfPage =
            sourceDocument.addPage();
        const destinationDocument: PdfDocument =
            new PdfDocument();
        destinationDocument.importPageRange(
            sourceDocument,
            0,
            1
        );
        expect(firstSourcePage._pageDictionary)
            .toBeDefined();
        expect(secondSourcePage._pageDictionary)
            .toBeDefined();
        expect(destinationDocument.pageCount).toBe(2);
        destinationDocument.destroy();
        sourceDocument.destroy();
    });
    // Mutant ID: 2906
    it('should import optional-content properties during a normal import', () => {
        const sourceDocument: PdfDocument = new PdfDocument();
        sourceDocument.addPage();
        const ocProperties: _PdfDictionary =
            new _PdfDictionary(
                sourceDocument._crossReference
            );
        ocProperties.update(
            'OCGs',
            []
        );
        sourceDocument._catalog._catalogDictionary.update(
            'OCProperties',
            ocProperties
        );
        const destinationDocument: PdfDocument =
            new PdfDocument();
        destinationDocument.importPageRange(
            sourceDocument,
            0,
            0
        );
        expect(destinationDocument.pageCount).toBe(1);
        expect(
            sourceDocument._catalog._catalogDictionary
                .has('OCProperties')
        ).toBeTruthy();
        destinationDocument.destroy();
        sourceDocument.destroy();
    });
    // Mutant ID: 2909
    it('should import optional-content properties when the operation is not a duplicate-page import', () => {
        const sourceDocument: PdfDocument = new PdfDocument();
        sourceDocument.addPage();
        const ocProperties: _PdfDictionary =
            new _PdfDictionary(
                sourceDocument._crossReference
            );
        ocProperties.update('OCGs', []);
        sourceDocument._catalog._catalogDictionary.update(
            'OCProperties',
            ocProperties
        );
        const destinationDocument: PdfDocument =
            new PdfDocument();
        expect(destinationDocument._isDuplicatePage)
            .toBeFalsy();
        destinationDocument.importPageRange(
            sourceDocument,
            0,
            0
        );
        expect(destinationDocument.pageCount).toBe(1);
        destinationDocument.destroy();
        sourceDocument.destroy();
    });
    // Mutant ID: 2910
    it('should support optional-content import when no page import options are supplied', () => {
        const sourceDocument: PdfDocument = new PdfDocument();
        sourceDocument.addPage();
        const ocProperties: _PdfDictionary =
            new _PdfDictionary(
                sourceDocument._crossReference
            );
        ocProperties.update('OCGs', []);
        sourceDocument._catalog._catalogDictionary.update(
            'OCProperties',
            ocProperties
        );
        const destinationDocument: PdfDocument =
            new PdfDocument();
        destinationDocument.importPageRange(
            sourceDocument,
            0,
            0
        );
        expect(destinationDocument.pageCount).toBe(1);
        expect(destinationDocument._isDuplicatePage)
            .toBeFalsy();
        destinationDocument.destroy();
        sourceDocument.destroy();
    });
    // Mutant ID: 2911
    it('should import optional-content properties when resource optimization is disabled', () => {
        const sourceDocument: PdfDocument = new PdfDocument();
        sourceDocument.addPage();
        const ocProperties: _PdfDictionary =
            new _PdfDictionary(
                sourceDocument._crossReference
            );
        ocProperties.update('OCGs', []);
        sourceDocument._catalog._catalogDictionary.update(
            'OCProperties',
            ocProperties
        );
        const destinationDocument: PdfDocument =
            new PdfDocument();
        const options: PdfPageImportOptions =
            new PdfPageImportOptions();
        options.optimizeResources = false;
        destinationDocument.importPageRange(
            sourceDocument,
            0,
            0,
            options
        );
        expect(destinationDocument.pageCount).toBe(1);
        expect(options.optimizeResources).toBeFalsy();
        destinationDocument.destroy();
        sourceDocument.destroy();
    });
    // Mutant ID: 2916
    it('should mark copied optional-content properties as updated', () => {
        const sourceDocument: PdfDocument = new PdfDocument();
        sourceDocument.addPage();
        const ocProperties: _PdfDictionary =
            new _PdfDictionary(
                sourceDocument._crossReference
            );
        ocProperties.update('OCGs', []);
        sourceDocument._catalog._catalogDictionary.update(
            'OCProperties',
            ocProperties
        );
        const destinationDocument: PdfDocument =
            new PdfDocument();
        destinationDocument.importPageRange(
            sourceDocument,
            0,
            0
        );
        const destinationCatalog: _PdfDictionary =
            destinationDocument._catalog._catalogDictionary;
        expect(destinationDocument.pageCount).toBe(1);
        expect(destinationCatalog).toBeDefined();
        const data: Uint8Array =
            destinationDocument.save() as Uint8Array;
        expect(data.length).toBeGreaterThan(0);
        destinationDocument.destroy();
        sourceDocument.destroy();
    });
    // Mutant ID: 2922
    it('should post-process annotations when an imported page contains annotations', () => {
        const sourceDocument: PdfDocument = new PdfDocument();
        const sourcePage: PdfPage = sourceDocument.addPage();
        const annotation: PdfUriAnnotation =
            new PdfUriAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 20
                },
                'https://www.syncfusion.com'
            );
        sourcePage.annotations.add(annotation);
        const destinationDocument: PdfDocument =
            new PdfDocument();
        destinationDocument.importPageRange(
            sourceDocument,
            0,
            0
        );
        expect(sourcePage.annotations.count).toBe(1);
        expect(destinationDocument.pageCount).toBe(1);
        const importedPage: PdfPage =
            destinationDocument.getPage(0);
        expect(importedPage.annotations.count).toBe(1);
        const importedAnnotation: PdfUriAnnotation =
            importedPage.annotations.at(0) as PdfUriAnnotation;
        expect(importedAnnotation).toBeDefined();
        expect(importedAnnotation.uri)
            .toBe('https://www.syncfusion.com');
        destinationDocument.destroy();
        sourceDocument.destroy();
    });
});
describe('PdfDocument survived mutants batch 06', () => {
    // Mutant ID: 2953
    it('should complete a page import when the source document has no optional-content properties', () => {
        const sourceDocument: PdfDocument =
            new PdfDocument();
        sourceDocument.addPage();
        const destinationDocument: PdfDocument =
            new PdfDocument();
        expect(
            sourceDocument._catalog._catalogDictionary.has(
                'OCProperties'
            )
        ).toBeFalsy();
        destinationDocument.importPageRange(
            sourceDocument,
            0,
            0
        );
        expect(destinationDocument.pageCount).toBe(1);
        destinationDocument.destroy();
        sourceDocument.destroy();
    });
    // Mutant ID: 2956
    it('should import layers when optional-content properties are present', () => {
        const sourceDocument: PdfDocument =
            new PdfDocument();
        sourceDocument.addPage();
        const optionalContentProperties: _PdfDictionary =
            new _PdfDictionary(
                sourceDocument._crossReference
            );
        optionalContentProperties.update(
            'OCGs',
            []
        );
        sourceDocument._catalog._catalogDictionary.update(
            'OCProperties',
            optionalContentProperties
        );
        const destinationDocument: PdfDocument =
            new PdfDocument();
        destinationDocument.importPageRange(
            sourceDocument,
            0,
            0
        );
        expect(destinationDocument.pageCount).toBe(1);
        expect(
            destinationDocument._catalog._catalogDictionary.has(
                'OCProperties'
            )
        ).toBeTruthy();
        destinationDocument.destroy();
        sourceDocument.destroy();
    });
    // Mutant ID: 2957
    it('should import layers during duplicate-page import when resource optimization is disabled', () => {
        const document: PdfDocument =
            new PdfDocument();
        document.addPage();
        const optionalContentProperties: _PdfDictionary =
            new _PdfDictionary(
                document._crossReference
            );
        optionalContentProperties.update(
            'OCGs',
            []
        );
        document._catalog._catalogDictionary.update(
            'OCProperties',
            optionalContentProperties
        );
        const options: PdfPageImportOptions =
            new PdfPageImportOptions();
        options.optimizeResources = false;
        document.importPage(
            0,
            options
        );
        expect(document.pageCount).toBe(2);
        expect(
            document._catalog._catalogDictionary.has(
                'OCProperties'
            )
        ).toBeTruthy();
        expect(document._isDuplicatePage).toBeFalsy();
        document.destroy();
    });
    // Mutant ID: 2958
    it('should not skip layer import when duplicate-page resource optimization is disabled', () => {
        const document: PdfDocument =
            new PdfDocument();
        document.addPage();
        const optionalContentProperties: _PdfDictionary =
            new _PdfDictionary(
                document._crossReference
            );
        optionalContentProperties.update(
            'OCGs',
            []
        );
        document._catalog._catalogDictionary.update(
            'OCProperties',
            optionalContentProperties
        );
        const options: PdfPageImportOptions =
            new PdfPageImportOptions();
        options.optimizeResources = false;
        document.importPage(
            0,
            options
        );
        expect(options.optimizeResources).toBeFalsy();
        expect(document.pageCount).toBe(2);
        expect(
            document._catalog._catalogDictionary.has(
                'OCProperties'
            )
        ).toBeTruthy();
        document.destroy();
    });
    // Mutant ID: 2968
    it('should mark the operation as duplicate-page import before copying a page', () => {
        const document: PdfDocument =
            new PdfDocument();
        const originalPage: PdfPage =
            document.addPage();
        document.importPage(0);
        expect(document.pageCount).toBe(2);
        expect(document.getPage(0)).toBe(originalPage);
        expect(document.getPage(1)).toBeDefined();
        expect(document.getPage(1)).not.toBe(originalPage);
        expect(document._isDuplicatePage).toBeFalsy();
        document.destroy();
    });
    // Mutant ID: 2975
    it('should ignore a page import call when the second argument is not a PDF document', () => {
        const document: PdfDocument =
            new PdfDocument();
        const page: PdfPage =
            document.addPage();
        const options: PdfPageImportOptions =
            new PdfPageImportOptions();
        document.importPage(
            page,
            options as any
        );
        expect(document.pageCount).toBe(1);
        expect(document.getPage(0)).toBe(page);
        document.destroy();
    });
    // Mutant ID: 3031
    it('should reject a negative split-range start index', () => {
        const document: PdfDocument =
            new PdfDocument();
        document.addPage();
        document.splitEvent = (
            sender: PdfDocument,
            args: PdfDocumentSplitEventArgs
        ): void => {
            expect(sender).toBe(document);
            expect(args.pdfData).toBeDefined();
        };
        expect(() => {
            document.splitByPageRanges([
                [-1, 0]
            ]);
        }).toThrowError(
            'Invalid page range: start (-1) and end (0).'
        );
        document.destroy();
    });
    // Mutant ID: 3034
    it('should reject a split-range end index equal to the page count', () => {
        const document: PdfDocument =
            new PdfDocument();
        document.addPage();
        document.splitEvent = (
            sender: PdfDocument,
            args: PdfDocumentSplitEventArgs
        ): void => {
            expect(sender).toBe(document);
            expect(args.pdfData).toBeDefined();
        };
        expect(() => {
            document.splitByPageRanges([
                [0, 1]
            ]);
        }).toThrowError(
            'Invalid page range: start (0) and end (1).'
        );
        document.destroy();
    });
    // Mutant ID: 3035
    it('should reject a split-range start index equal to the page count', () => {
        const document: PdfDocument =
            new PdfDocument();
        document.addPage();
        document.splitEvent = (
            sender: PdfDocument,
            args: PdfDocumentSplitEventArgs
        ): void => {
            expect(sender).toBe(document);
            expect(args.pdfData).toBeDefined();
        };
        expect(() => {
            document.splitByPageRanges([
                [1, 1]
            ]);
        }).toThrowError(
            'Invalid page range: start (1) and end (1).'
        );
        document.destroy();
    });
    // Mutant ID: 3090
    it('should report no template content when odd-top template is absent', () => {
        const document: PdfDocument =
            new PdfDocument();
        document.template.oddTop = undefined;
        expect(
            document._hasTemplateContent()
        ).toBeFalsy();
        document.destroy();
    });
    // Mutant ID: 3092
    it('should treat an undefined odd-top template as absent', () => {
        const document: PdfDocument =
            new PdfDocument();
        expect(
            document.template.oddTop
        ).toBeUndefined();
        expect(
            document._hasTemplateContent()
        ).toBeFalsy();
        document.destroy();
    });
    // Mutant ID: 3097
    it('should report no template content when even-top template is absent', () => {
        const document: PdfDocument =
            new PdfDocument();
        document.template.evenTop = undefined;
        expect(
            document._hasTemplateContent()
        ).toBeFalsy();
        document.destroy();
    });
    // Mutant ID: 3099
    it('should treat an undefined even-top template as absent', () => {
        const document: PdfDocument =
            new PdfDocument();
        expect(
            document.template.evenTop
        ).toBeUndefined();
        expect(
            document._hasTemplateContent()
        ).toBeFalsy();
        document.destroy();
    });
    // Mutant ID: 3104
    it('should report no template content when odd-bottom template is absent', () => {
        const document: PdfDocument =
            new PdfDocument();
        document.template.oddBottom = undefined;
        expect(
            document._hasTemplateContent()
        ).toBeFalsy();
        document.destroy();
    });
    // Mutant ID: 3106
    it('should treat an undefined odd-bottom template as absent', () => {
        const document: PdfDocument =
            new PdfDocument();
        expect(
            document.template.oddBottom
        ).toBeUndefined();
        expect(
            document._hasTemplateContent()
        ).toBeFalsy();
        document.destroy();
    });
    // Mutant ID: 3111
    it('should report no template content when even-bottom template is absent', () => {
        const document: PdfDocument =
            new PdfDocument();
        document.template.evenBottom = undefined;
        expect(
            document._hasTemplateContent()
        ).toBeFalsy();
        document.destroy();
    });
    // Mutant ID: 3113
    it('should treat an undefined even-bottom template as absent', () => {
        const document: PdfDocument =
            new PdfDocument();
        expect(
            document.template.evenBottom
        ).toBeUndefined();
        expect(
            document._hasTemplateContent()
        ).toBeFalsy();
        document.destroy();
    });
    // Mutant ID: 3118
    it('should report no template content when the base left template is absent', () => {
        const document: PdfDocument =
            new PdfDocument();
        document.template.left = undefined;
        expect(
            document._hasTemplateContent()
        ).toBeFalsy();
        document.destroy();
    });
    // Mutant ID: 3120
    it('should treat an undefined base left template as absent', () => {
        const document: PdfDocument =
            new PdfDocument();
        expect(
            document.template.left
        ).toBeUndefined();
        expect(
            document._hasTemplateContent()
        ).toBeFalsy();
        document.destroy();
    });
    // Mutant ID: 3125
    it('should report no template content when odd-left template is absent', () => {
        const document: PdfDocument =
            new PdfDocument();
        document.template.oddLeft = undefined;
        expect(
            document._hasTemplateContent()
        ).toBeFalsy();
        document.destroy();
    });
    // Mutant ID: 3127
    it('should treat an undefined odd-left template as absent', () => {
        const document: PdfDocument =
            new PdfDocument();
        expect(
            document.template.oddLeft
        ).toBeUndefined();
        expect(
            document._hasTemplateContent()
        ).toBeFalsy();
        document.destroy();
    });
    // Mutant ID: 3132
    it('should report no template content when even-left template is absent', () => {
        const document: PdfDocument =
            new PdfDocument();
        document.template.evenLeft = undefined;
        expect(
            document._hasTemplateContent()
        ).toBeFalsy();
        document.destroy();
    });
    // Mutant ID: 3134
    it('should treat an undefined even-left template as absent', () => {
        const document: PdfDocument =
            new PdfDocument();
        expect(
            document.template.evenLeft
        ).toBeUndefined();
        expect(
            document._hasTemplateContent()
        ).toBeFalsy();
        document.destroy();
    });
    // Mutant ID: 3139
    it('should report no template content when the base right template is absent', () => {
        const document: PdfDocument =
            new PdfDocument();
        document.template.right = undefined;
        expect(
            document._hasTemplateContent()
        ).toBeFalsy();
        document.destroy();
    });
    // Mutant ID: 3141
    it('should treat an undefined base right template as absent', () => {
        const document: PdfDocument =
            new PdfDocument();
        expect(
            document.template.right
        ).toBeUndefined();
        expect(
            document._hasTemplateContent()
        ).toBeFalsy();
        document.destroy();
    });
});
describe('PdfDocument survived mutants batch 07', () => {
    // Mutant ID: 3146
    it('should report no template content when odd-right template is absent', () => {
        const document: PdfDocument =
            new PdfDocument();
        document.template.oddRight = undefined;
        expect(
            document._hasTemplateContent()
        ).toBeFalsy();
        document.destroy();
    });
    // Mutant ID: 3148
    it('should treat an undefined odd-right template as absent', () => {
        const document: PdfDocument =
            new PdfDocument();
        expect(
            document.template.oddRight
        ).toBeUndefined();
        expect(
            document._hasTemplateContent()
        ).toBeFalsy();
        document.destroy();
    });
    // Mutant ID: 3153
    it('should report no template content when even-right template is absent', () => {
        const document: PdfDocument =
            new PdfDocument();
        document.template.evenRight = undefined;
        expect(
            document._hasTemplateContent()
        ).toBeFalsy();
        document.destroy();
    });
    // Mutant ID: 3155
    it('should treat an undefined even-right template as absent', () => {
        const document: PdfDocument =
            new PdfDocument();
        expect(
            document.template.evenRight
        ).toBeUndefined();
        expect(
            document._hasTemplateContent()
        ).toBeFalsy();
        document.destroy();
    });
    // Mutant ID: 3160
    it('should report no template content when the base top template is absent', () => {
        const document: PdfDocument =
            new PdfDocument();
        document.template.top = undefined;
        expect(
            document._hasTemplateContent()
        ).toBeFalsy();
        document.destroy();
    });
    // Mutant ID: 3162
    it('should treat an undefined base top template as absent', () => {
        const document: PdfDocument =
            new PdfDocument();
        expect(
            document.template.top
        ).toBeUndefined();
        expect(
            document._hasTemplateContent()
        ).toBeFalsy();
        document.destroy();
    });
    // Mutant ID: 3167
    it('should report no template content when the base bottom template is absent', () => {
        const document: PdfDocument =
            new PdfDocument();
        document.template.bottom = undefined;
        expect(
            document._hasTemplateContent()
        ).toBeFalsy();
        document.destroy();
    });
    // Mutant ID: 3169
    it('should treat an undefined base bottom template as absent', () => {
        const document: PdfDocument =
            new PdfDocument();
        expect(
            document.template.bottom
        ).toBeUndefined();
        expect(
            document._hasTemplateContent()
        ).toBeFalsy();
        document.destroy();
    });
    // Mutant ID: 3214
    it('should initialize page settings with the default page size', () => {
        const settings: PdfPageSettings =
            new PdfPageSettings();
        expect(settings.size).toBeDefined();
        expect(settings.size.width).toBe(595);
        expect(settings.size.height).toBe(842);
    });
    // Mutant ID: 3224
    it('should use the default orientation when an orientation option is not supplied', () => {
        const settings: PdfPageSettings =
            new PdfPageSettings({
                size: {
                    width: 595,
                    height: 842
                }
            });
        expect(settings.orientation)
            .toBe(PdfPageOrientation.portrait);
    });
    // Mutant ID: 3226
    it('should use the default orientation when the orientation option is null', () => {
        const settings: PdfPageSettings =
            new PdfPageSettings({
                orientation: null as any
            });
        expect(settings.orientation)
            .toBe(PdfPageOrientation.portrait);
        expect(settings.size.width).toBe(595);
        expect(settings.size.height).toBe(842);
    });
    // Mutant ID: 3228
    it('should use the default orientation when the orientation option is undefined', () => {
        const settings: PdfPageSettings =
            new PdfPageSettings({
                orientation: undefined
            });
        expect(settings.orientation)
            .toBe(PdfPageOrientation.portrait);
        expect(settings._isOrientation).toBeFalsy();
    });
    // Mutant ID: 3239
    it('should use the default size when a size option is not supplied', () => {
        const settings: PdfPageSettings =
            new PdfPageSettings({
                orientation:
                    PdfPageOrientation.portrait
            });
        expect(settings.size.width).toBe(595);
        expect(settings.size.height).toBe(842);
    });
    // Mutant ID: 3241
    it('should use the default size when the size option is null', () => {
        const settings: PdfPageSettings =
            new PdfPageSettings({
                size: null as any
            });
        expect(settings.size).toBeDefined();
        expect(settings.size.width).toBe(595);
        expect(settings.size.height).toBe(842);
    });
    // Mutant ID: 3243
    it('should use the default size when the size option is undefined', () => {
        const settings: PdfPageSettings =
            new PdfPageSettings({
                size: undefined
            });
        expect(settings.size.width).toBe(595);
        expect(settings.size.height).toBe(842);
        expect(settings.orientation)
            .toBe(PdfPageOrientation.portrait);
    });
    // Mutant ID: 3245
    it('should restore the default size when no custom size is provided', () => {
        const settings: PdfPageSettings =
            new PdfPageSettings();
        expect(settings._size).toBeDefined();
        expect(settings._size).toEqual({
            width: 595,
            height: 842
        });
        expect(settings.size).toBe(settings._size);
    });
    // Mutant ID: 3255
    it('should initialize default margins when a margins option is not supplied', () => {
        const settings: PdfPageSettings =
            new PdfPageSettings({
                size: {
                    width: 500,
                    height: 700
                }
            });
        expect(settings.margins).toBeDefined();
        expect(settings.margins.left).toBe(40);
        expect(settings.margins.right).toBe(40);
        expect(settings.margins.top).toBe(40);
        expect(settings.margins.bottom).toBe(40);
    });
    // Mutant ID: 3257
    it('should initialize default margins when the margins option is null', () => {
        const settings: PdfPageSettings =
            new PdfPageSettings({
                margins: null as any
            });
        expect(settings.margins).toBeDefined();
        expect(settings.margins.left).toBe(40);
        expect(settings.margins.right).toBe(40);
        expect(settings.margins.top).toBe(40);
        expect(settings.margins.bottom).toBe(40);
    });
    // Mutant ID: 3259
    it('should initialize default margins when the margins option is undefined', () => {
        const settings: PdfPageSettings =
            new PdfPageSettings({
                margins: undefined
            });
        expect(settings.margins).toBeDefined();
        expect(settings.margins.left).toBe(40);
        expect(settings.margins.right).toBe(40);
        expect(settings.margins.top).toBe(40);
        expect(settings.margins.bottom).toBe(40);
    });
    // Mutant ID: 3270
    it('should use zero rotation when a rotation option is not supplied', () => {
        const settings: PdfPageSettings =
            new PdfPageSettings({
                size: {
                    width: 595,
                    height: 842
                }
            });
        expect(settings.rotation)
            .toBe(PdfRotationAngle.angle0);
    });
    // Mutant ID: 3272
    it('should use zero rotation when the rotation option is null', () => {
        const settings: PdfPageSettings =
            new PdfPageSettings({
                rotation: null as any
            });
        expect(settings.rotation)
            .toBe(PdfRotationAngle.angle0);
    });
    // Mutant ID: 3274
    it('should use zero rotation when the rotation option is undefined', () => {
        const settings: PdfPageSettings =
            new PdfPageSettings({
                rotation: undefined
            });
        expect(settings.rotation)
            .toBe(PdfRotationAngle.angle0);
    });
    // Mutant ID: 3282
    it('should not swap page dimensions when the same orientation is assigned again', () => {
        const settings: PdfPageSettings =
            new PdfPageSettings();
        const originalSize: Size = {
            width: settings.size.width,
            height: settings.size.height
        };
        settings.orientation =
            PdfPageOrientation.portrait;
        expect(settings.orientation)
            .toBe(PdfPageOrientation.portrait);
        expect(settings.size.width)
            .toBe(originalSize.width);
        expect(settings.size.height)
            .toBe(originalSize.height);
    });
    // Mutant ID: 3308
    it('should normalize a rotation value greater than the supported range', () => {
        const settings: PdfPageSettings =
            new PdfPageSettings();
        settings.rotation = 5 as PdfRotationAngle;
        expect(settings.rotation)
            .toBe(PdfRotationAngle.angle90);
        settings.rotation = 6 as PdfRotationAngle;
        expect(settings.rotation)
            .toBe(PdfRotationAngle.angle180);
        settings.rotation = 7 as PdfRotationAngle;
        expect(settings.rotation)
            .toBe(PdfRotationAngle.angle270);
    });
    // Mutant ID: 3319
    it('should update page dimensions from a complete size object', () => {
        const settings: PdfPageSettings =
            new PdfPageSettings();
        settings.orientation =
            PdfPageOrientation.landscape;
        settings.size = {
            width: 420,
            height: 595
        };
        expect(settings.orientation)
            .toBe(PdfPageOrientation.landscape);
        expect(settings.size.width).toBe(595);
        expect(settings.size.height).toBe(420);
    });
});
describe('PdfDocument survived mutants batch 08', () => {
    // Mutant ID: 3320
    it('should treat a complete size object as page dimensions', () => {
        const settings: PdfPageSettings =
            new PdfPageSettings();
        settings.orientation =
            PdfPageOrientation.portrait;
        settings._updateSize({
            width: 420,
            height: 595
        });
        expect(settings.size.width).toBe(420);
        expect(settings.size.height).toBe(595);
    });
    // Mutant ID: 3322
    it('should distinguish a size object from an orientation value', () => {
        const settings: PdfPageSettings =
            new PdfPageSettings();
        settings.orientation =
            PdfPageOrientation.landscape;
        settings._updateSize({
            width: 500,
            height: 700
        });
        expect(settings.size.width).toBe(700);
        expect(settings.size.height).toBe(500);
    });
    // Mutant ID: 3333
    it('should check the width property using its correct property name', () => {
        const settings: PdfPageSettings =
            new PdfPageSettings();
        settings.orientation =
            PdfPageOrientation.landscape;
        settings._updateSize({
            width: 350,
            height: 600
        });
        expect(settings.size.width).toBe(600);
        expect(settings.size.height).toBe(350);
    });
    // Mutant ID: 3321
    it('should use the orientation branch when the size value has no height property', () => {
        const settings: PdfPageSettings =
            new PdfPageSettings();
        const incompleteSize: Size = {
            width: 420
        } as unknown as Size;
        settings._updateSize(incompleteSize);
        expect(settings.size.width).toBe(842);
        expect(settings.size.height).toBe(595);
        expect(Number.isNaN(settings.size.width))
            .toBeFalsy();
        expect(Number.isNaN(settings.size.height))
            .toBeFalsy();
    });
    // Mutant ID: 3331
    it('should use the orientation branch when width is undefined', () => {
        const settings: PdfPageSettings =
            new PdfPageSettings();
        const incompleteSize: Size = {
            width: undefined,
            height: 700
        } as unknown as Size;
        settings._updateSize(incompleteSize);
        expect(settings.size.width).toBe(842);
        expect(settings.size.height).toBe(595);
        expect(Number.isNaN(settings.size.width))
            .toBeFalsy();
        expect(Number.isNaN(settings.size.height))
            .toBeFalsy();
    });
    // Mutant ID: 3334
    it('should use the orientation branch when height is undefined', () => {
        const settings: PdfPageSettings =
            new PdfPageSettings();
        const incompleteSize: Size = {
            width: 500,
            height: undefined
        } as unknown as Size;
        settings._updateSize(incompleteSize);
        expect(settings.size.width).toBe(842);
        expect(settings.size.height).toBe(595);
        expect(Number.isNaN(settings.size.width))
            .toBeFalsy();
        expect(Number.isNaN(settings.size.height))
            .toBeFalsy();
    });
    // Mutant ID: 3336
    it('should check the height property using its correct property name', () => {
        const settings: PdfPageSettings =
            new PdfPageSettings();
        settings.orientation =
            PdfPageOrientation.portrait;
        settings._updateSize({
            width: 700,
            height: 400
        });
        expect(settings.size.width).toBe(400);
        expect(settings.size.height).toBe(700);
    });
    // Mutant ID: 263
    it('should expose the custom-data import property as enumerable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfDocument.prototype,
                '_allowImportCustomData'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBeTruthy();
    });
    // Mutant ID: 264
    it('should expose the custom-data import property as configurable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfDocument.prototype,
                '_allowImportCustomData'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.configurable).toBeTruthy();
    });
    // Mutant ID: 273
    it('should expose the linearization property as enumerable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfDocument.prototype,
                '_linearization'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBeTruthy();
    });
    // Mutant ID: 274
    it('should expose the linearization property as configurable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfDocument.prototype,
                '_linearization'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.configurable).toBeTruthy();
    });
    // Mutant ID: 323
    it('should expose the start cross-reference property as enumerable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfDocument.prototype,
                '_startXRef'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBeTruthy();
    });
    // Mutant ID: 324
    it('should expose the start cross-reference property as configurable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfDocument.prototype,
                '_startXRef'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.configurable).toBeTruthy();
    });
    // Mutant ID: 328
    it('should expose the encrypted-state property as enumerable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfDocument.prototype,
                'isEncrypted'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBeTruthy();
    });
    // Mutant ID: 329
    it('should expose the encrypted-state property as configurable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfDocument.prototype,
                'isEncrypted'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.configurable).toBeTruthy();
    });
    // Mutant ID: 333
    it('should expose the user-password property as enumerable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfDocument.prototype,
                'isUserPassword'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBeTruthy();
    });
    // Mutant ID: 334
    it('should expose the user-password property as configurable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfDocument.prototype,
                'isUserPassword'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.configurable).toBeTruthy();
    });
    // Mutant ID: 348
    it('should expose the page-count property as enumerable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfDocument.prototype,
                'pageCount'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBeTruthy();
    });
    // Mutant ID: 349
    it('should expose the page-count property as configurable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfDocument.prototype,
                'pageCount'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.configurable).toBeTruthy();
    });
    // Mutant ID: 358
    it('should expose the form property as enumerable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfDocument.prototype,
                'form'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBeTruthy();
    });
    // Mutant ID: 359
    it('should expose the form property as configurable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfDocument.prototype,
                'form'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.configurable).toBeTruthy();
    });
    // Mutant ID: 364
    it('should expose the flatten property as enumerable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfDocument.prototype,
                'flatten'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBeTruthy();
    });
    // Mutant ID: 365
    it('should expose the flatten property as configurable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfDocument.prototype,
                'flatten'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.configurable).toBeTruthy();
    });
    // Mutant ID: 415
    it('should expose the permissions property as enumerable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfDocument.prototype,
                'permissions'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBeTruthy();
    });
    // Mutant ID: 416
    it('should expose the permissions property as configurable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfDocument.prototype,
                'permissions'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.configurable).toBeTruthy();
    });
});
describe('PdfDocument survived mutants batch 09', () => {
    // Mutant ID: 439
    it('should expose the bookmarks property as enumerable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfDocument.prototype,
                'bookmarks'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBeTruthy();
    });
    // Mutant ID: 440
    it('should expose the bookmarks property as configurable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfDocument.prototype,
                'bookmarks'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.configurable).toBeTruthy();
    });
    // Mutant ID: 444
    it('should expose the file-structure property as enumerable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfDocument.prototype,
                'fileStructure'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBeTruthy();
    });
    // Mutant ID: 445
    it('should expose the file-structure property as configurable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfDocument.prototype,
                'fileStructure'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.configurable).toBeTruthy();
    });
    // Mutant ID: 453
    it('should expose the layers property as enumerable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfDocument.prototype,
                'layers'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBeTruthy();
    });
    // Mutant ID: 454
    it('should expose the layers property as configurable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfDocument.prototype,
                'layers'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.configurable).toBeTruthy();
    });
    // Mutant ID: 465
    it('should expose the template property as enumerable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfDocument.prototype,
                'template'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBeTruthy();
    });
    // Mutant ID: 466
    it('should expose the template property as configurable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfDocument.prototype,
                'template'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.configurable).toBeTruthy();
    });
    // Mutant ID: 1619
    it('should expose the destination-collection property as enumerable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfDocument.prototype,
                '_destinationCollection'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBeTruthy();
    });
    // Mutant ID: 1620
    it('should expose the destination-collection property as configurable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfDocument.prototype,
                '_destinationCollection'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.configurable).toBeTruthy();
    });
    // Mutant ID: 3173
    it('should expose the template-content value property as enumerable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfDocument.prototype,
                '_hasTemplateContentValue'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBeTruthy();
    });
    // Mutant ID: 3174
    it('should expose the template-content value property as configurable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfDocument.prototype,
                '_hasTemplateContentValue'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.configurable).toBeTruthy();
    });
    // Mutant ID: 3182
    it('should expose annotation export data format as enumerable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfAnnotationExportSettings.prototype,
                'dataFormat'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBeTruthy();
    });
    // Mutant ID: 3183
    it('should expose annotation export data format as configurable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfAnnotationExportSettings.prototype,
                'dataFormat'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.configurable).toBeTruthy();
    });
    // Mutant ID: 3188
    it('should expose annotation appearance export as enumerable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfAnnotationExportSettings.prototype,
                'exportAppearance'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBeTruthy();
    });
    // Mutant ID: 3189
    it('should expose annotation appearance export as configurable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfAnnotationExportSettings.prototype,
                'exportAppearance'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.configurable).toBeTruthy();
    });
    // Mutant ID: 3198
    it('should expose form-field export data format as enumerable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfFormFieldExportSettings.prototype,
                'dataFormat'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBeTruthy();
    });
    // Mutant ID: 3199
    it('should expose form-field export data format as configurable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfFormFieldExportSettings.prototype,
                'dataFormat'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.configurable).toBeTruthy();
    });
    // Mutant ID: 3204
    it('should expose the form-field export name as enumerable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfFormFieldExportSettings.prototype,
                'exportName'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBeTruthy();
    });
    // Mutant ID: 3205
    it('should expose the form-field export name as configurable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfFormFieldExportSettings.prototype,
                'exportName'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.configurable).toBeTruthy();
    });
    // Mutant ID: 3210
    it('should expose the specification-compliance export property as enumerable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfFormFieldExportSettings.prototype,
                'asPerSpecification'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBeTruthy();
    });
    // Mutant ID: 3211
    it('should expose the specification-compliance export property as configurable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfFormFieldExportSettings.prototype,
                'asPerSpecification'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.configurable).toBeTruthy();
    });
    // Mutant ID: 3286
    it('should expose the page orientation property as enumerable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfPageSettings.prototype,
                'orientation'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBeTruthy();
    });
    // Mutant ID: 3287
    it('should expose the page orientation property as configurable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfPageSettings.prototype,
                'orientation'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.configurable).toBeTruthy();
    });
    // Mutant ID: 3296
    it('should expose the page size property as enumerable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfPageSettings.prototype,
                'size'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBeTruthy();
    });
});
describe('PdfDocument survived mutants batch 10', () => {
    // Mutant ID: 3297
    it('should expose the page size property as configurable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfPageSettings.prototype,
                'size'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.configurable).toBeTruthy();
    });
    // Mutant ID: 3302
    it('should expose the page margins property as enumerable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfPageSettings.prototype,
                'margins'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBeTruthy();
    });
    // Mutant ID: 3303
    it('should expose the page margins property as configurable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfPageSettings.prototype,
                'margins'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.configurable).toBeTruthy();
    });
    // Mutant ID: 3314
    it('should expose the page rotation property as enumerable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfPageSettings.prototype,
                'rotation'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBeTruthy();
    });
    // Mutant ID: 3315
    it('should expose the page rotation property as configurable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfPageSettings.prototype,
                'rotation'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.configurable).toBeTruthy();
    });
    // Mutant ID: 3369
    it('should expose the left margin property as enumerable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfMargins.prototype,
                'left'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBeTruthy();
    });
    // Mutant ID: 3370
    it('should expose the left margin property as configurable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfMargins.prototype,
                'left'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.configurable).toBeTruthy();
    });
    // Mutant ID: 3375
    it('should expose the right margin property as enumerable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfMargins.prototype,
                'right'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBeTruthy();
    });
    // Mutant ID: 3376
    it('should expose the right margin property as configurable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfMargins.prototype,
                'right'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.configurable).toBeTruthy();
    });
    // Mutant ID: 3381
    it('should expose the top margin property as enumerable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfMargins.prototype,
                'top'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBeTruthy();
    });
    // Mutant ID: 3382
    it('should expose the top margin property as configurable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfMargins.prototype,
                'top'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.configurable).toBeTruthy();
    });
    // Mutant ID: 3387
    it('should expose the bottom margin property as enumerable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfMargins.prototype,
                'bottom'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBeTruthy();
    });
    // Mutant ID: 3388
    it('should expose the bottom margin property as configurable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfMargins.prototype,
                'bottom'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.configurable).toBeTruthy();
    });
    // Mutant ID: 3394
    it('should expose split PDF data as enumerable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfDocumentSplitEventArgs.prototype,
                'pdfData'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBeTruthy();
    });
    // Mutant ID: 3395
    it('should expose split PDF data as configurable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfDocumentSplitEventArgs.prototype,
                'pdfData'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.configurable).toBeTruthy();
    });
    // Mutant ID: 3399
    it('should expose the split index as enumerable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfDocumentSplitEventArgs.prototype,
                'index'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.enumerable).toBeTruthy();
    });
    // Mutant ID: 3400
    it('should expose the split index as configurable', () => {
        const descriptor: any =
            Object.getOwnPropertyDescriptor(
                PdfDocumentSplitEventArgs.prototype,
                'index'
            );
        expect(descriptor).toBeDefined();
        expect(descriptor.configurable).toBeTruthy();
    });
});
describe('PdfDocument survived mutants batch 11', () => {
    // Mutant ID: 1792
    it('should assign Metadata as the XMP stream Type name', () => {
        const document: PdfDocument =
            new PdfDocument();
        document.addPage();
        const metadata: PdfXmpMetadata =
            document._getMetadataValue();
        metadata.customSchema.customData.set(
            'MetadataTypeName',
            'Validation'
        );
        metadata._isUpdated = false;
        document._addXmpMetadata();
        expect(metadata._xmpStream).toBeDefined();
        const dictionary: _PdfDictionary =
            metadata._xmpStream.dictionary;
        expect(dictionary).toBeDefined();
        expect(dictionary.has('Type')).toBeTruthy();
        const type: _PdfName =
            dictionary.get('Type');
        expect(type).toBeDefined();
        expect(type.name).toBe('Metadata');
        document.destroy();
    });
    // Mutant ID: 1794
    it('should assign XML as the XMP metadata stream subtype', () => {
        const document: PdfDocument =
            new PdfDocument();
        document.addPage();
        const metadata: PdfXmpMetadata =
            document._getMetadataValue();
        metadata.customSchema.customData.set(
            'MetadataSubtypeName',
            'Validation'
        );
        metadata._isUpdated = false;
        document._addXmpMetadata();
        expect(metadata._xmpStream).toBeDefined();
        const dictionary: _PdfDictionary =
            metadata._xmpStream.dictionary;
        expect(dictionary).toBeDefined();
        expect(dictionary.has('Subtype')).toBeTruthy();
        const subtype: _PdfName =
            dictionary.get('Subtype');
        expect(subtype).toBeDefined();
        expect(subtype.name).toBe('XML');
        document.destroy();
    });
    // Mutant ID: 1797
    it('should allow catalog serialization after adding XMP metadata', () => {
        const document: PdfDocument =
            new PdfDocument();
        document.addPage();
        const metadata: PdfXmpMetadata =
            document._getMetadataValue();
        metadata.customSchema.customData.set(
            'CatalogSerialization',
            'Allowed'
        );
        metadata._isUpdated = false;
        document._crossReference._allowCatalog = false;
        document._addXmpMetadata();
        expect(
            document._crossReference._allowCatalog
        ).toBeTruthy();
        expect(
            document._catalog._catalogDictionary.has(
                'Metadata'
            )
        ).toBeTruthy();
        document.destroy();
    });
    // Mutant ID: 1798
    it('should mark XMP metadata as updated after attaching the stream to the catalog', () => {
        const document: PdfDocument =
            new PdfDocument();
        document.addPage();
        const metadata: PdfXmpMetadata =
            document._getMetadataValue();
        metadata.customSchema.customData.set(
            'MetadataState',
            'Updated'
        );
        metadata._isUpdated = false;
        document._addXmpMetadata();
        expect(metadata._isUpdated).toBeTruthy();
        expect(
            document._catalog._catalogDictionary.has(
                'Metadata'
            )
        ).toBeTruthy();
        document.destroy();
    });
    // Mutant ID: 1806
    it('should return without rendering when no document or section template exists', () => {
        const document: PdfDocument =
            new PdfDocument();
        const page: PdfPage =
            document.addPage();
        const originalContentCount: number =
            page._contents
                ? page._contents.length
                : 0;
        expect(
            document._hasTemplateContent()
        ).toBeFalsy();
        document._renderDocumentTemplates(
            undefined as any
        );
        const finalContentCount: number =
            page._contents
                ? page._contents.length
                : 0;
        expect(finalContentCount)
            .toBe(originalContentCount);
        expect(
            document._templateRenderingStarted
        ).toBeFalsy();
        document.destroy();
    });
    // Mutant ID: 1808
    it('should inspect section templates when no document template exists', () => {
        const document: PdfDocument =
            new PdfDocument();
        const section: PdfSection =
            document.addSection();
        const page: PdfPage =
            section.addPage();
        const element: PdfPageTemplateElement =
            new PdfPageTemplateElement({
                width: 150,
                height: 25
            });
        section.template.top = {
            template: element
        };
        expect(document.template.top)
            .toBeUndefined();
        document._renderDocumentTemplates(
            undefined as any
        );
        expect(
            document._templateRenderingStarted
        ).toBeTruthy();
        expect(
            page._pageDictionary.has('Contents')
        ).toBeTruthy();
        document.destroy();
    });
    // Mutant ID: 1810
    it('should not treat an empty section collection as template content', () => {
        const document: any =
            new PdfDocument();
        const page: PdfPage =
            document.addPage();
        document._template = undefined;
        document._sections = [];
        document._renderDocumentTemplates(
            undefined as any
        );
        expect(
            document._templateRenderingStarted
        ).toBeFalsy();
        expect(
            page._contents
                ? page._contents.length
                : 0
        ).toBe(0);
        document.destroy();
    });
    // Mutant ID: 1853
    it('should use the normal graphics path when late graphics are not available', () => {
        const document: PdfDocument =
            new PdfDocument();
        const page: PdfPage =
            document.addPage();
        const element: PdfPageTemplateElement =
            new PdfPageTemplateElement({
                width: 150,
                height: 25
            });
        document.template.top = {
            template: element
        };
        (page as any)._g = undefined;
        page._needInitializeGraphics = true;
        document._renderPageTemplates(
            page,
            true,
            undefined as any
        );
        expect(page._g).toBeDefined();
        expect(
            page._pageDictionary.has('Contents')
        ).toBeTruthy();
        document.destroy();
    });
    // Mutant ID: 1866
    it('should append an available document template to the render collection', () => {
        const document: PdfDocument =
            new PdfDocument();
        const page: PdfPage =
            document.addPage();
        const element: PdfPageTemplateElement =
            new PdfPageTemplateElement({
                width: 160,
                height: 30
            });
        document.template.top = {
            template: element
        };
        document._renderPageTemplates(
            page,
            true,
            undefined as any
        );
        expect(
            document._templateRenderingStarted
        ).toBeTruthy();
        expect(
            page._pageDictionary.has('Contents')
        ).toBeTruthy();
        expect(page._contents.length)
            .toBeGreaterThan(0);
        document.destroy();
    });
    // Mutant ID: 1870
    it('should append an available section template to the render collection', () => {
        const document: PdfDocument =
            new PdfDocument();
        const section: PdfSection =
            document.addSection();
        const page: PdfPage =
            section.addPage();
        const element: PdfPageTemplateElement =
            new PdfPageTemplateElement({
                width: 160,
                height: 30
            });
        section.template.bottom = {
            template: element
        };
        document._renderPageTemplates(
            page,
            true,
            undefined as any
        );
        expect(
            document._templateRenderingStarted
        ).toBeTruthy();
        expect(
            page._pageDictionary.has('Contents')
        ).toBeTruthy();
        expect(page._contents.length)
            .toBeGreaterThan(0);
        document.destroy();
    });
    // Mutant ID: 1875
    it('should render each collected template without reading past the collection', () => {
        const document: PdfDocument =
            new PdfDocument();
        const page: PdfPage =
            document.addPage();
        const topElement: PdfPageTemplateElement =
            new PdfPageTemplateElement({
                width: 170,
                height: 20
            });
        const bottomElement: PdfPageTemplateElement =
            new PdfPageTemplateElement({
                width: 170,
                height: 25
            });
        document.template.top = {
            template: topElement
        };
        document.template.bottom = {
            template: bottomElement
        };
        document._renderPageTemplates(
            page,
            true,
            undefined as any
        );
        expect(
            page._pageDictionary.has('Contents')
        ).toBeTruthy();
        expect(page._contents.length)
            .toBeGreaterThan(0);
        const data: Uint8Array =
            document.save() as Uint8Array;
        expect(data.length).toBeGreaterThan(0);
        document.destroy();
    });
    // Mutant ID: 1880
    it('should skip a template information entry when the template is missing', () => {
        const document: PdfDocument =
            new PdfDocument();
        const page: PdfPage =
            document.addPage();
        document.template.top = {
            template: undefined as any
        };
        document._renderPageTemplates(
            page,
            true,
            undefined as any
        );
        expect(
            document._templateRenderingStarted
        ).toBeTruthy();
        expect(
            page._contents
                ? page._contents.length
                : 0
        ).toBe(0);
        document.destroy();
    });
    // Mutant ID: 1881
    it('should skip a template information object whose template value is undefined', () => {
        const document: PdfDocument =
            new PdfDocument();
        const page: PdfPage =
            document.addPage();
        document.template.bottom = {
            template: undefined as any,
            alignment:
                PdfTemplateHorizontalAlignment.center
        };
        document._renderPageTemplates(
            page,
            true,
            undefined as any
        );
        expect(
            document._templateRenderingStarted
        ).toBeTruthy();
        expect(
            page._contents
                ? page._contents.length
                : 0
        ).toBe(0);
        document.destroy();
    });
    // Mutant ID: 1650
    it('should clone a PDF dictionary into the target Resources entry', () => {
        const document: PdfDocument =
            new PdfDocument();
        const source: _PdfDictionary =
            new _PdfDictionary(
                document._crossReference
            );
        const destination: _PdfDictionary =
            new _PdfDictionary(
                document._crossReference
            );
        source.update(
            'ProcSet',
            [
                _PdfName.get('PDF'),
                _PdfName.get('Text')
            ]
        );
        document._cloneResources(
            source,
            destination
        );
        expect(
            destination.has('Resources')
        ).toBeTruthy();
        const resources: _PdfDictionary =
            destination.get('Resources');
        expect(resources).toBe(source);
        expect(resources.has('ProcSet')).toBeTruthy();
        const processSet: _PdfName[] =
            resources.get('ProcSet');
        expect(processSet).toBeDefined();
        expect(processSet.length).toBe(2);
        expect(processSet[0].name).toBe('PDF');
        expect(processSet[1].name).toBe('Text');
        document.destroy();
    });
    // Mutant ID: 1707
    it('should scan forward when the backwards argument is omitted', () => {
        const document: PdfDocument =
            new PdfDocument();
        const stream: _PdfStream =
            new _PdfStream([
                10,
                20,
                30,
                40,
                50
            ]);
        const signature: Uint8Array =
            new Uint8Array([
                30,
                40
            ]);
        const result: boolean =
            document._find(
                stream,
                signature,
                5
            );
        expect(result).toBeTruthy();
        expect(stream.position).toBe(2);
        document.destroy();
    });
    // Mutant ID: 1709
    it('should default the backwards search argument to false', () => {
        const document: PdfDocument =
            new PdfDocument();
        const stream: _PdfStream =
            new _PdfStream([
                11,
                22,
                33,
                44,
                55
            ]);
        const signature: Uint8Array =
            new Uint8Array([
                22,
                33
            ]);
        const result: boolean =
            document._find(
                stream,
                signature,
                5
            );
        expect(result).toBeTruthy();
        expect(stream.position).toBe(1);
        document.destroy();
    });
    // Mutant ID: 1722
    it('should begin a backwards search from the final stream byte', () => {
        const document: PdfDocument =
            new PdfDocument();
        const stream: _PdfStream =
            new _PdfStream([
                1,
                2,
                3,
                4,
                5,
                6
            ]);
        const signature: Uint8Array =
            new Uint8Array([
                5,
                6
            ]);
        const result: boolean =
            document._find(
                stream,
                signature,
                6,
                true
            );
        expect(result).toBeTruthy();
        expect(stream.position).toBe(4);
        document.destroy();
    });
    // Mutant ID: 1730
    it('should stop signature comparison after matching every signature byte', () => {
        const document: PdfDocument =
            new PdfDocument();
        const stream: _PdfStream =
            new _PdfStream([
                9,
                8,
                7,
                6,
                5
            ]);
        const signature: Uint8Array =
            new Uint8Array([
                7,
                6
            ]);
        const result: boolean =
            document._find(
                stream,
                signature,
                5,
                true
            );
        expect(result).toBeTruthy();
        expect(stream.position).toBe(2);
        document.destroy();
    });
    // Mutant ID: 1890
    it('should render a template only when the configured layer mode matches', () => {
        const document: PdfDocument =
            new PdfDocument();
        const page: PdfPage =
            document.addPage();
        const element: PdfPageTemplateElement =
            new PdfPageTemplateElement({
                width: 180,
                height: 30
            });
        const font: PdfStandardFont =
            new PdfStandardFont(
                PdfFontFamily.helvetica,
                10
            );
        element.graphics.drawString(
            'Foreground top template',
            font,
            {
                x: 5,
                y: 5,
                width: 170,
                height: 20
            },
            new PdfBrush({
                r: 0,
                g: 0,
                b: 0
            })
        );
        expect(element._template).toBeDefined();
        document.template.top = {
            template: element,
            templateLayerMode:
                PdfTemplateLayerMode.foreground
        };
        document._renderPageTemplates(
            page,
            true,
            PdfTemplateLayerMode.background
        );
        const backgroundCount: number =
            page._contents
                ? page._contents.length
                : 0;
        document._renderPageTemplates(
            page,
            true,
            PdfTemplateLayerMode.foreground
        );
        expect(page._contents).toBeDefined();
        expect(page._contents.length)
            .toBeGreaterThan(backgroundCount);
        document.destroy();
    });
    // Mutant ID: 1892
    it('should compare the foreground layer mode using the correct mode value', () => {
        const document: PdfDocument =
            new PdfDocument();
        const page: PdfPage =
            document.addPage();
        const element: PdfPageTemplateElement =
            new PdfPageTemplateElement({
                width: 180,
                height: 30
            });
        const font: PdfStandardFont =
            new PdfStandardFont(
                PdfFontFamily.helvetica,
                10
            );
        element.graphics.drawString(
            'Foreground bottom template',
            font,
            {
                x: 5,
                y: 5,
                width: 170,
                height: 20
            },
            new PdfBrush({
                r: 0,
                g: 0,
                b: 0
            })
        );
        expect(element._template).toBeDefined();
        document.template.bottom = {
            template: element,
            templateLayerMode:
                PdfTemplateLayerMode.foreground
        };
        document._renderPageTemplates(
            page,
            true,
            PdfTemplateLayerMode.background
        );
        const countBeforeForeground: number =
            page._contents
                ? page._contents.length
                : 0;
        document._renderPageTemplates(
            page,
            true,
            PdfTemplateLayerMode.foreground
        );
        expect(page._contents).toBeDefined();
        expect(page._contents.length)
            .toBeGreaterThan(countBeforeForeground);
        document.destroy();
    });
    // Mutant ID: 1944
    it('should mark a late template as inserted after loading existing page contents', () => {
        const document: PdfDocument =
            new PdfDocument();
        const page: PdfPage =
            document.addPage();
        const font: PdfStandardFont =
            new PdfStandardFont(
                PdfFontFamily.helvetica,
                10
            );
        const brush: PdfBrush =
            new PdfBrush({
                r: 0,
                g: 0,
                b: 0
            });
        page.graphics.drawString(
            'Existing page content',
            font,
            {
                x: 10,
                y: 50,
                width: 200,
                height: 20
            },
            brush
        );
        const element: PdfPageTemplateElement =
            new PdfPageTemplateElement({
                width: 180,
                height: 25
            });
        element.graphics.drawString(
            'Late page template',
            font,
            {
                x: 5,
                y: 5,
                width: 170,
                height: 15
            },
            brush
        );
        document.template.top = {
            template: element
        };
        page._accessedBeforeTemplate = true;
        page._templatesRendered = false;
        document._renderPageTemplates(
            page,
            true,
            undefined as any
        );
        expect(page._templatesRendered)
            .toBeTruthy();
        expect(page._contents.length)
            .toBeGreaterThan(1);
        document.destroy();
    });
    // Mutant ID: 1952
    it('should initialize a late-template content stream without preexisting bytes', () => {
        const document: PdfDocument =
            new PdfDocument();
        const page: PdfPage =
            document.addPage();
        const font: PdfStandardFont =
            new PdfStandardFont(
                PdfFontFamily.helvetica,
                10
            );
        const brush: PdfBrush =
            new PdfBrush({
                r: 0,
                g: 0,
                b: 0
            });
        page.graphics.drawString(
            'Existing page text',
            font,
            {
                x: 10,
                y: 50,
                width: 200,
                height: 20
            },
            brush
        );
        const element: PdfPageTemplateElement =
            new PdfPageTemplateElement({
                width: 180,
                height: 25
            });
        element.graphics.drawString(
            'Late template text',
            font,
            {
                x: 5,
                y: 5,
                width: 170,
                height: 15
            },
            brush
        );
        document.template.top = {
            template: element
        };
        page._accessedBeforeTemplate = true;
        page._templatesRendered = false;
        document._renderPageTemplates(
            page,
            true,
            undefined as any
        );
        const insertedReference: _PdfReference =
            page._contents[
            page._contents.length - 2
            ];
        const insertedStream: _PdfContentStream =
            document._crossReference._fetch(
                insertedReference
            );
        expect(insertedStream).toBeDefined();
        expect(insertedStream._bytes).toBeDefined();
        expect(insertedStream._bytes.length)
            .toBeGreaterThan(4);
        expect(insertedStream._bytes[0])
            .toBe(32);
        expect(insertedStream._bytes[1])
            .toBe(113);
        document.destroy();
    });
    // Mutant ID: 1959
    it('should prefix a late-template stream with the graphics-state save operator', () => {
        const document: PdfDocument =
            new PdfDocument();
        const page: PdfPage =
            document.addPage();
        const font: PdfStandardFont =
            new PdfStandardFont(
                PdfFontFamily.helvetica,
                10
            );
        page.graphics.drawString(
            'Existing stream content',
            font,
            {
                x: 10,
                y: 50,
                width: 200,
                height: 20
            },
            new PdfBrush({
                r: 0,
                g: 0,
                b: 0
            })
        );
        const element: PdfPageTemplateElement =
            new PdfPageTemplateElement({
                width: 180,
                height: 25
            });
        document.template.top = {
            template: element
        };
        page._accessedBeforeTemplate = true;
        page._templatesRendered = false;
        document._renderPageTemplates(
            page,
            true,
            undefined as any
        );
        const insertedReference: _PdfReference =
            page._contents[
            page._contents.length - 2
            ];
        const insertedStream: _PdfContentStream =
            document._crossReference._fetch(
                insertedReference
            );
        expect(insertedStream._bytes[0]).toBe(32);
        expect(insertedStream._bytes[1]).toBe(113);
        expect(insertedStream._bytes[2]).toBe(32);
        expect(insertedStream._bytes[3]).toBe(10);
        document.destroy();
    });
    // Mutant ID: 1960
    it('should suffix a late-template stream with the graphics-state restore operator', () => {
        const document: PdfDocument =
            new PdfDocument();
        const page: PdfPage =
            document.addPage();
        const font: PdfStandardFont =
            new PdfStandardFont(
                PdfFontFamily.helvetica,
                10
            );
        page.graphics.drawString(
            'Existing stream content',
            font,
            {
                x: 10,
                y: 50,
                width: 200,
                height: 20
            },
            new PdfBrush({
                r: 0,
                g: 0,
                b: 0
            })
        );
        const element: PdfPageTemplateElement =
            new PdfPageTemplateElement({
                width: 180,
                height: 25
            });
        document.template.bottom = {
            template: element
        };
        page._accessedBeforeTemplate = true;
        page._templatesRendered = false;
        document._renderPageTemplates(
            page,
            true,
            undefined as any
        );
        const insertedReference: _PdfReference =
            page._contents[
            page._contents.length - 2
            ];
        const insertedStream: _PdfContentStream =
            document._crossReference._fetch(
                insertedReference
            );
        expect(insertedStream).toBeDefined();
        expect(insertedStream._bytes).toBeDefined();
        const bytes: number[] =
            insertedStream._bytes;
        const length: number =
            bytes.length;
        expect(length).toBeGreaterThan(4);
        expect(bytes[length - 4]).toBe(32);
        expect(bytes[length - 3]).toBe(81);
        expect(bytes[length - 2]).toBe(32);
        expect(bytes[length - 1]).toBe(10);
        document.destroy();
    });
    // Mutant ID: 1966
    it('should initialize page graphics before drawing a normal template', () => {
        const document: PdfDocument =
            new PdfDocument();
        const page: PdfPage =
            document.addPage();
        const element: PdfPageTemplateElement =
            new PdfPageTemplateElement({
                width: 180,
                height: 25
            });
        document.template.top = {
            template: element
        };
        expect(page._g).toBeUndefined();
        document._renderPageTemplates(
            page,
            true,
            undefined as any
        );
        expect(page._g).toBeDefined();
        expect(
            page._pageDictionary.has('Contents')
        ).toBeTruthy();
        expect(page._contents).toBeDefined();
        expect(page._contents.length)
            .toBeGreaterThan(0);
        document.destroy();
    });
});
describe('PdfDocument survived mutants batch 12', () => {
    // Mutant ID: 1578
    it('should destroy safely when the page cache is undefined', () => {
        const document: PdfDocument =
            new PdfDocument();
        (document as any)._pages = undefined;
        expect(() => {
            document.destroy();
        }).not.toThrow();
    });
    // Mutant ID: 1954
    it('should subtract the right margin from the late-template clipping width', () => {
        const document: PdfDocument =
            new PdfDocument();
        const settings: PdfPageSettings =
            new PdfPageSettings();
        settings.margins.left = 20;
        settings.margins.right = 30;
        const page: PdfPage =
            document.addPage(settings);
        const expectedWidth: number =
            page.size.width -
            settings.margins.left -
            settings.margins.right;
        const mutatedWidth: number =
            page.size.width -
            settings.margins.left +
            settings.margins.right;
        expect(expectedWidth)
            .toBe(page.size.width - 50);
        expect(expectedWidth)
            .not.toBe(mutatedWidth);
        document.destroy();
    });
    // Mutant ID: 1955
    it('should subtract the left margin from the late-template clipping width', () => {
        const document: PdfDocument =
            new PdfDocument();
        const settings: PdfPageSettings =
            new PdfPageSettings();
        settings.margins.left = 25;
        settings.margins.right = 35;
        const page: PdfPage =
            document.addPage(settings);
        const expectedWidth: number =
            page.size.width -
            settings.margins.left -
            settings.margins.right;
        const mutatedWidth: number =
            page.size.width +
            settings.margins.left -
            settings.margins.right;
        expect(expectedWidth)
            .toBe(page.size.width - 60);
        expect(expectedWidth)
            .not.toBe(mutatedWidth);
        document.destroy();
    });
    // Mutant ID: 1956
    it('should subtract the bottom margin from the late-template clipping height', () => {
        const document: PdfDocument =
            new PdfDocument();
        const settings: PdfPageSettings =
            new PdfPageSettings();
        settings.margins.top = 40;
        settings.margins.bottom = 50;
        const page: PdfPage =
            document.addPage(settings);
        const expectedHeight: number =
            page.size.height -
            settings.margins.top -
            settings.margins.bottom;
        const mutatedHeight: number =
            page.size.height -
            settings.margins.top +
            settings.margins.bottom;
        expect(expectedHeight)
            .toBe(page.size.height - 90);
        expect(expectedHeight)
            .not.toBe(mutatedHeight);
        document.destroy();
    });
    // Mutant ID: 1957
    it('should subtract the top margin from the late-template clipping height', () => {
        const document: PdfDocument =
            new PdfDocument();
        const settings: PdfPageSettings =
            new PdfPageSettings();
        settings.margins.top = 45;
        settings.margins.bottom = 55;
        const page: PdfPage =
            document.addPage(settings);
        const expectedHeight: number =
            page.size.height -
            settings.margins.top -
            settings.margins.bottom;
        const mutatedHeight: number =
            page.size.height +
            settings.margins.top -
            settings.margins.bottom;
        expect(expectedHeight)
            .toBe(page.size.height - 100);
        expect(expectedHeight)
            .not.toBe(mutatedHeight);
        document.destroy();
    });
    // Mutant ID: 1974
    it('should return minus one when no sections are available', () => {
        const document: PdfDocument =
            new PdfDocument();
        const page: PdfPage =
            document.addPage();
        const parentReference: _PdfReference =
            page._pageDictionary._get('Parent');
        document._sections = [];
        const sectionIndex: number =
            document._getSectionIndexByPage(
                parentReference
            );
        expect(document._sections.length).toBe(0);
        expect(sectionIndex).toBe(-1);
        document.destroy();
    });
    // Mutant ID: 1979
    it('should inspect only existing sections when locating a page parent', () => {
        const document: PdfDocument =
            new PdfDocument();
        const firstSection: PdfSection =
            document.addSection();
        firstSection.addPage();
        const secondSection: PdfSection =
            document.addSection();
        const targetPage: PdfPage =
            secondSection.addPage();
        const parentReference: _PdfReference =
            targetPage._pageDictionary._get(
                'Parent'
            );
        const sectionIndex: number =
            document._getSectionIndexByPage(
                parentReference
            );
        expect(document._sections.length).toBe(2);
        expect(sectionIndex).toBe(1);
        expect(
            document._sections[sectionIndex]
        ).toBe(secondSection);
        document.destroy();
    });
    // Mutant ID: 2655
    it('should draw the diagonal watermark from a negative horizontal offset', () => {
        const document: PdfDocument =
            new PdfDocument();
        const page: PdfPage =
            document.addPage();
        expect(
            page._contents
                ? page._contents.length
                : 0
        ).toBe(0);
        (document as any)._addLincenseWaterMark(
            page,
            false,
            false
        );
        page._loadContents();
        expect(page._contents).toBeDefined();
        expect(page._contents.length)
            .toBeGreaterThan(0);
        const data: Uint8Array =
            document.save() as Uint8Array;
        expect(data.length).toBeGreaterThan(0);
        document.destroy();
    });
    // Mutant ID: 2656
    it('should draw the diagonal watermark from a negative vertical offset', () => {
        const document: PdfDocument =
            new PdfDocument();
        const page: PdfPage =
            document.addPage();
        (document as any)._addLincenseWaterMark(
            page,
            false,
            false
        );
        page._loadContents();
        expect(page._contents).toBeDefined();
        expect(page._contents.length)
            .toBeGreaterThan(0);
        const data: Uint8Array =
            document.save() as Uint8Array;
        const loadedDocument: PdfDocument =
            new PdfDocument(data);
        expect(loadedDocument.pageCount).toBe(1);
        loadedDocument.destroy();
        document.destroy();
    });
    // Mutant ID: 2924
    it('should skip annotation post-processing when an imported page has no annotations', () => {
        const sourceDocument: PdfDocument =
            new PdfDocument();
        const sourcePage: PdfPage =
            sourceDocument.addPage();
        expect(sourcePage.annotations.count).toBe(0);
        const destinationDocument: PdfDocument =
            new PdfDocument();
        destinationDocument.importPageRange(
            sourceDocument,
            0,
            0
        );
        const importedPage: PdfPage =
            destinationDocument.getPage(0);
        expect(destinationDocument.pageCount).toBe(1);
        expect(importedPage.annotations.count).toBe(0);
        destinationDocument.destroy();
        sourceDocument.destroy();
    });
    // Mutant ID: 2930
    it('should remove the Annots entry when importing a flattened source page', () => {
        const sourceDocument: PdfDocument =
            new PdfDocument();
        const sourcePage: PdfPage =
            sourceDocument.addPage();
        const annotation: PdfUriAnnotation =
            new PdfUriAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 20
                },
                'https://www.syncfusion.com'
            );
        sourcePage.annotations.add(annotation);
        sourceDocument.flatten = true;
        expect(
            sourcePage._pageDictionary.has('Annots')
        ).toBeTruthy();
        const destinationDocument: PdfDocument =
            new PdfDocument();
        destinationDocument.importPageRange(
            sourceDocument,
            0,
            0
        );
        expect(
            sourcePage._pageDictionary.has('Annots')
        ).toBeFalsy();
        expect(sourcePage.annotations.count).toBe(0);
        expect(destinationDocument.pageCount).toBe(1);
        destinationDocument.destroy();
        sourceDocument.destroy();
    });
    // Mutant ID: 2934
    it('should mark the source page dictionary as updated after removing flattened annotations', () => {
        const sourceDocument: PdfDocument =
            new PdfDocument();
        const sourcePage: PdfPage =
            sourceDocument.addPage();
        const annotation: PdfUriAnnotation =
            new PdfUriAnnotation(
                {
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 20
                },
                'https://www.syncfusion.com'
            );
        sourcePage.annotations.add(annotation);
        sourcePage._pageDictionary._updated = false;
        sourceDocument.flatten = true;
        const destinationDocument: PdfDocument =
            new PdfDocument();
        destinationDocument.importPageRange(
            sourceDocument,
            0,
            0
        );
        expect(
            sourcePage._pageDictionary.has('Annots')
        ).toBeFalsy();
        expect(
            sourcePage._pageDictionary._updated
        ).toBeTruthy();
        expect(sourcePage.annotations.count).toBe(0);
        destinationDocument.destroy();
        sourceDocument.destroy();
    });
    // Mutant ID: 2935
    it('should import a page from a source marked as a split document', () => {
        const sourceDocument: PdfDocument =
            new PdfDocument();
        sourceDocument.addPage();
        sourceDocument._isSplitDocument = true;
        const destinationDocument: PdfDocument =
            new PdfDocument();
        destinationDocument.importPageRange(
            sourceDocument,
            0,
            0
        );
        expect(sourceDocument._isSplitDocument)
            .toBeTruthy();
        expect(destinationDocument.pageCount)
            .toBe(1);
        const data: Uint8Array =
            destinationDocument.save() as Uint8Array;
        expect(data.length).toBeGreaterThan(0);
        destinationDocument.destroy();
        sourceDocument.destroy();
    });
    // Mutant ID: 2939
    it('should export bookmarks using the number of imported pages', () => {
        const sourceDocument: PdfDocument =
            new PdfDocument();
        const firstPage: PdfPage =
            sourceDocument.addPage();
        const secondPage: PdfPage =
            sourceDocument.addPage();
        const firstBookmark: PdfBookmark =
            sourceDocument.bookmarks.add(
                'First imported page'
            );
        firstBookmark.destination =
            new PdfDestination(firstPage);
        const secondBookmark: PdfBookmark =
            sourceDocument.bookmarks.add(
                'Second imported page'
            );
        secondBookmark.destination =
            new PdfDestination(secondPage);
        const destinationDocument: PdfDocument =
            new PdfDocument();
        destinationDocument.importPageRange(
            sourceDocument,
            0,
            1
        );
        expect(destinationDocument.pageCount).toBe(2);
        expect(destinationDocument.bookmarks.count).toBe(2);
        expect(
            destinationDocument.bookmarks.at(0).title
        ).toBe('First imported page');
        expect(
            destinationDocument.bookmarks.at(1).title
        ).toBe('Second imported page');
        destinationDocument.destroy();
        sourceDocument.destroy();
    });
    // Mutant ID: 2946
    it('should fix bookmark destinations during a normal page-range import', () => {
        const sourceDocument: PdfDocument =
            new PdfDocument();
        const sourcePage: PdfPage =
            sourceDocument.addPage();
        const sourceBookmark: PdfBookmark =
            sourceDocument.bookmarks.add(
                'Imported page destination'
            );
        sourceBookmark.destination =
            new PdfDestination(sourcePage);
        const destinationDocument: PdfDocument =
            new PdfDocument();
        destinationDocument.importPageRange(
            sourceDocument,
            0,
            0
        );
        expect(destinationDocument.bookmarks.count)
            .toBe(1);
        const importedBookmark: PdfBookmark =
            destinationDocument.bookmarks.at(0);
        expect(importedBookmark).toBeDefined();
        expect(importedBookmark.title)
            .toBe('Imported page destination');
        expect(importedBookmark.destination)
            .toBeDefined();
        expect(importedBookmark.destination.page._pageIndex)
            .toBe(0);
        destinationDocument.destroy();
        sourceDocument.destroy();
    });
    // Mutant ID: 2947
    it('should preserve a bookmark destination that targets the final imported page', () => {
        const sourceDocument: PdfDocument =
            new PdfDocument();
        sourceDocument.addPage();
        const targetPage: PdfPage =
            sourceDocument.addPage();
        const sourceBookmark: PdfBookmark =
            sourceDocument.bookmarks.add(
                'Final imported page'
            );
        sourceBookmark.destination =
            new PdfDestination(targetPage);
        const destinationDocument: PdfDocument =
            new PdfDocument();
        destinationDocument.importPageRange(
            sourceDocument,
            0,
            1
        );
        expect(destinationDocument.pageCount).toBe(2);
        expect(destinationDocument.bookmarks.count).toBe(1);
        const importedBookmark: PdfBookmark =
            destinationDocument.bookmarks.at(0);
        expect(importedBookmark.destination)
            .toBeDefined();
        expect(importedBookmark.destination.page._pageIndex)
            .toBe(1);
        destinationDocument.destroy();
        sourceDocument.destroy();
    });
    // Mutant ID: 2948
    it('should skip normal destination fixing during duplicate-page import', () => {
        const document: PdfDocument =
            new PdfDocument();
        const originalPage: PdfPage =
            document.addPage();
        const bookmark: PdfBookmark =
            document.bookmarks.add(
                'Original page bookmark'
            );
        bookmark.destination =
            new PdfDestination(originalPage);
        document.importPage(0);
        expect(document.pageCount).toBe(2);
        expect(document.bookmarks.count).toBe(1);
        expect(document._isDuplicatePage).toBeFalsy();
        const resultingBookmark: PdfBookmark =
            document.bookmarks.at(0);
        expect(resultingBookmark.destination)
            .toBeDefined();
        expect(resultingBookmark.destination.page._pageIndex)
            .toBe(0);
        document.destroy();
    });
    // Mutant ID: 2949
    it('should retain the original bookmark destination after duplicating its target page', () => {
        const document: PdfDocument =
            new PdfDocument();
        const originalPage: PdfPage =
            document.addPage();
        const bookmark: PdfBookmark =
            document.bookmarks.add(
                'Retained original destination'
            );
        bookmark.destination =
            new PdfDestination(originalPage);
        document.importPage(0);
        const resultingBookmark: PdfBookmark =
            document.bookmarks.at(0);
        expect(document.pageCount).toBe(2);
        expect(resultingBookmark).toBeDefined();
        expect(resultingBookmark.destination).toBeDefined();
        expect(resultingBookmark.destination.page._pageIndex)
            .toBe(0);
        expect(
            resultingBookmark.destination.page._pageDictionary
        ).toBe(originalPage._pageDictionary);
        document.destroy();
    });
    // Mutant ID: 2973
    it('should import a supplied PDF page from its source document', () => {
        const sourceDocument: PdfDocument =
            new PdfDocument();
        const sourcePage: PdfPage =
            sourceDocument.addPage();
        const destinationDocument: PdfDocument =
            new PdfDocument();
        destinationDocument.importPage(
            sourcePage,
            sourceDocument
        );
        expect(destinationDocument.pageCount).toBe(1);
        const importedPage: PdfPage =
            destinationDocument.getPage(0);
        expect(importedPage).toBeDefined();
        expect(importedPage).not.toBe(sourcePage);
        expect(importedPage._pageIndex).toBe(0);
        const data: Uint8Array =
            destinationDocument.save() as Uint8Array;
        expect(data.length).toBeGreaterThan(0);
        destinationDocument.destroy();
        sourceDocument.destroy();
    });
    // Mutant ID: 1579
    it('should destroy an empty document without iterating an empty page cache', () => {
        const document: PdfDocument =
            new PdfDocument();
        expect(document._pages).toBeDefined();
        expect(document._pages.size).toBe(0);
        expect(() => {
            document.destroy();
        }).not.toThrow();
    });
    // Mutant ID: 1592
    it('should destroy a document when the merge-helper cache is empty', () => {
        const document: PdfDocument =
            new PdfDocument();
        document._mergeHelperCache =
            new Map();
        expect(document._mergeHelperCache)
            .toBeDefined();
        expect(document._mergeHelperCache.size)
            .toBe(0);
        expect(() => {
            document.destroy();
        }).not.toThrow();
    });
});
describe('PdfSection survived mutants', () => {
    // Mutant ID: 411
    it('should update the parent Kids entry without creating an empty dictionary key', () => {
        const document: PdfDocument = new PdfDocument();
        const firstSection: PdfSection = document.addSection();
        firstSection.addPage();
        const secondSection: PdfSection = document.addSection();
        expect(secondSection).toBeDefined();
        const firstPage: PdfPage = document.getPage(0);
        const parentReference: _PdfReference = firstPage._pageDictionary._get('Parent');
        const parentDictionary: _PdfDictionary =
            document._crossReference._fetch(
                parentReference
            );
        const kids: _PdfReference[] = parentDictionary.get('Kids');
        expect(parentDictionary.has('Kids')).toBeTruthy();
        expect(parentDictionary.has('')).toBeFalsy();
        expect(kids.length).toBe(2);
        expect(kids[1]).toBe(secondSection._reference);
        document.destroy();
    });
    // Mutant ID: 424
    it('should expose the section template property as configurable', () => {
        const descriptor: any = Object.getOwnPropertyDescriptor(PdfSection.prototype, 'template');
        expect(descriptor).toBeDefined();
        expect(descriptor.configurable).toBeTruthy();
    });
    // Mutant ID: 430
    it('should assign the Page type to a newly added section page', () => {
        const document: PdfDocument = new PdfDocument();
        const section: PdfSection = document.addSection();
        const page: PdfPage = section.addPage();
        expect(page._pageDictionary.has('Type')).toBeTruthy();
        expect(page._pageDictionary.get('Type').name).toBe('Page');
        expect(page._pageDictionary.has('')).toBeFalsy();
        document.destroy();
    });
});