import { _PdfCatalog } from '../src/pdf/core/pdf-catalog';
import { PdfDocument } from '../src/pdf/core/pdf-document';
import { PdfPage } from '../src/pdf/core/pdf-page';
import { _PdfDictionary, _PdfName, _PdfReference } from '../src/pdf/core/pdf-primitives';
import { FormatError } from '../src/pdf/core/utils';
describe('1041589 _PdfCatalog constructor', () => {
    it('1041589 constructor initializes catalog and page caches', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        expect(catalog._catalogDictionary instanceof _PdfDictionary).toBe(true);
        expect(catalog._catalogDictionary.isCatalog).toBe(true);
        expect(catalog._topPagesDictionary instanceof _PdfDictionary).toBe(true);
        expect(catalog.pageKidsCountCache).toBeDefined();
        expect(catalog.pageIndexCache).toBeDefined();
        expect(catalog._parsedPages).toEqual([]);
        expect(catalog._parsedPages.length).toBe(0);
        expect(catalog._pageCache instanceof Map).toBe(true);
        expect(catalog._pageCache.size).toBe(0);
        document.destroy();
    });
});
describe('1041589 _PdfCatalog version', () => {
    it('1041589 version returns undefined when Version is absent', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        expect(catalog._catalogDictionary.has('Version')).toBe(false);
        expect(catalog.version).toBeUndefined();
        document.destroy();
    });
    it('1041589 version returns Version name', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        const versionName: _PdfName = new _PdfName('1.7');
        catalog._catalogDictionary.update('Version', versionName);
        expect(catalog._catalogDictionary.has('Version')).toBe(true);
        expect(catalog._catalogDictionary.get('Version')).toBe(versionName);
        expect(catalog.version).toBe('1.7');
        expect(catalog.version).not.toBeUndefined();
        document.destroy();
    });
    it('1041589 version reads exact Version key', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        catalog._catalogDictionary.update('', new _PdfName('Wrong'));
        catalog._catalogDictionary.update('Version', new _PdfName('2.0'));
        expect(catalog._catalogDictionary.get('').name).toBe('Wrong');
        expect(catalog._catalogDictionary.get('Version').name).toBe('2.0');
        expect(catalog.version).toBe('2.0');
        expect(catalog.version).not.toBe('Wrong');
        document.destroy();
    });
    it('1041589 version returns undefined for null Version', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        catalog._catalogDictionary.update('Version', null);
        expect(catalog._catalogDictionary.has('Version')).toBe(true);
        expect(catalog._catalogDictionary.get('Version')).toBeNull();
        expect(catalog.version).toBeUndefined();
        document.destroy();
    });
});
describe('1041589 _PdfCatalog pageCount', () => {
    it('1041589 pageCount returns integer Count', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        document.addPage();
        const catalog: any = document._catalog;
        expect(catalog._topPagesDictionary.get('Count')).toBe(2);
        expect(Number.isInteger(catalog.pageCount)).toBe(true);
        expect(catalog.pageCount).toBe(2);
        document.destroy();
    });
    it('1041589 pageCount throws when Count is undefined', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        const originalCount: number =
            catalog._topPagesDictionary.get('Count');
        catalog._topPagesDictionary.update('Count', undefined);
        expect(catalog._topPagesDictionary.get('Count')).toBeUndefined();
        expect((): number => catalog.pageCount).toThrow();
        catalog._topPagesDictionary.update('Count', originalCount);
        document.destroy();
    });
    it('1041589 pageCount throws when Count is not integer', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        const originalCount: number =
            catalog._topPagesDictionary.get('Count');
        catalog._topPagesDictionary.update('Count', 1.5);
        expect(catalog._topPagesDictionary.get('Count')).toBe(1.5);
        expect(
            Number.isInteger(
                catalog._topPagesDictionary.get('Count')
            )
        ).toBe(false);
        expect((): number => catalog.pageCount).toThrow();
        catalog._topPagesDictionary.update('Count', originalCount);
        document.destroy();
    });
});
describe('1041589 _PdfCatalog AcroForm', () => {
    it('1041589 acroForm returns existing form', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        const existingForm: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        catalog._catalogDictionary.update('AcroForm', existingForm);
        expect(catalog._catalogDictionary.has('AcroForm')).toBe(true);
        expect(catalog.acroForm).toBe(existingForm);
        document.destroy();
    });
    it('1041589 acroForm creates form when absent', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        expect(catalog._catalogDictionary.has('AcroForm')).toBe(false);
        const createdForm: _PdfDictionary = catalog.acroForm;
        const formReference: _PdfReference =
            catalog._catalogDictionary.getRaw('AcroForm');
        expect(createdForm instanceof _PdfDictionary).toBe(true);
        expect(formReference instanceof _PdfReference).toBe(true);
        expect(
            document._crossReference._cacheMap.get(formReference)
        ).toBe(createdForm);
        expect(catalog._catalogDictionary._updated).toBe(true);
        expect(document._crossReference._allowCatalog).toBe(true);
        expect(createdForm._updated).toBe(true);
        document.destroy();
    });
    it('1041589 acroForm creates form when entry is null', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        catalog._catalogDictionary.update('AcroForm', null);
        expect(catalog._catalogDictionary.has('AcroForm')).toBe(true);
        expect(catalog._catalogDictionary.get('AcroForm')).toBeNull();
        const createdForm: _PdfDictionary = catalog.acroForm;
        expect(createdForm instanceof _PdfDictionary).toBe(true);
        expect(createdForm._updated).toBe(true);
        expect(document._crossReference._allowCatalog).toBe(true);
        document.destroy();
    });
});
describe('1041589 _PdfCatalog _addToCache', () => {
    it('1041589 _addToCache stores all page information', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const catalog: any = document._catalog;
        const pageDictionary: _PdfDictionary = page._pageDictionary;
        const parentDictionary: _PdfDictionary =
            pageDictionary.get('Parent');
        catalog._pageCache.clear();
        catalog._parsedPages = [];
        catalog._addToCache(0, pageDictionary, page._ref);
        const cachedPage: any = catalog._pageCache.get(0);
        expect(catalog._pageCache.size).toBe(1);
        expect(cachedPage).toBeDefined();
        expect(cachedPage.dictionary).toBe(pageDictionary);
        expect(cachedPage.reference).toBe(page._ref);
        expect(cachedPage.parent).toBe(parentDictionary);
        expect(catalog._parsedPages).toEqual([0]);
        document.destroy();
    });
    it('1041589 _addToCache reads exact Parent key', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const catalog: any = document._catalog;
        const pageDictionary: _PdfDictionary = page._pageDictionary;
        const parentDictionary: _PdfDictionary =
            pageDictionary.get('Parent');
        catalog._pageCache.clear();
        catalog._parsedPages = [];
        catalog._addToCache(4, pageDictionary, page._ref);
        const cachedPage: any = catalog._pageCache.get(4);
        expect(cachedPage).toBeDefined();
        expect(cachedPage.dictionary).toBe(pageDictionary);
        expect(cachedPage.reference).toBe(page._ref);
        expect(cachedPage.parent).toBe(parentDictionary);
        expect(cachedPage.parent).not.toBeUndefined();
        expect(catalog._parsedPages).toEqual([4]);
        document.destroy();
    });
});
describe('1041589 _PdfCatalog _checkPageTreeFormat', () => {
    it('1041589 returns true when Count equals Kids length', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        const originalKids: any =
            catalog._topPagesDictionary.getRaw('Kids');
        const originalCount: any =
            catalog._topPagesDictionary.getRaw('Count');
        const firstPage: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const secondPage: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        firstPage.update('Type', new _PdfName('Page'));
        secondPage.update('Type', new _PdfName('Page'));
        catalog._topPagesDictionary.update(
            'Kids',
            [firstPage, secondPage]
        );
        catalog._topPagesDictionary.update('Count', 2);
        catalog._hasInvalidPageTree = undefined;
        const kids: any[] =
            catalog._topPagesDictionary.get('Kids');
        expect(Array.isArray(kids)).toBe(true);
        expect(kids.length).toBe(2);
        expect(catalog.pageCount).toBe(2);
        expect(catalog._checkPageTreeFormat()).toBe(true);
        expect(catalog._hasInvalidPageTree).toBe(true);
        catalog._topPagesDictionary.update('Kids', originalKids);
        catalog._topPagesDictionary.update('Count', originalCount);
        document.destroy();
    });
    it('1041589 returns false when Count differs from Kids length', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        const originalKids: any =
            catalog._topPagesDictionary.getRaw('Kids');
        const originalCount: any =
            catalog._topPagesDictionary.getRaw('Count');
        const firstPage: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const secondPage: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        firstPage.update('Type', new _PdfName('Page'));
        secondPage.update('Type', new _PdfName('Page'));
        catalog._topPagesDictionary.update(
            'Kids',
            [firstPage, secondPage]
        );
        catalog._topPagesDictionary.update('Count', 3);
        catalog._hasInvalidPageTree = undefined;
        const kids: any[] =
            catalog._topPagesDictionary.get('Kids');
        expect(Array.isArray(kids)).toBe(true);
        expect(kids.length).toBe(2);
        expect(catalog.pageCount).toBe(3);
        expect(catalog._checkPageTreeFormat()).toBe(false);
        expect(catalog._hasInvalidPageTree).toBe(false);
        catalog._topPagesDictionary.update('Kids', originalKids);
        catalog._topPagesDictionary.update('Count', originalCount);
        document.destroy();
    });
    it('1041589 uses cached true result', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        const originalKids: any =
            catalog._topPagesDictionary.getRaw('Kids');
        catalog._hasInvalidPageTree = true;
        catalog._topPagesDictionary.update('Kids', null);
        expect(catalog._checkPageTreeFormat()).toBe(true);
        expect(catalog._hasInvalidPageTree).toBe(true);
        catalog._topPagesDictionary.update('Kids', originalKids);
        document.destroy();
    });
    it('1041589 uses cached false result', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        const originalKids: any =
            catalog._topPagesDictionary.getRaw('Kids');
        catalog._hasInvalidPageTree = false;
        catalog._topPagesDictionary.update('Kids', null);
        expect(catalog._checkPageTreeFormat()).toBe(false);
        expect(catalog._hasInvalidPageTree).toBe(false);
        catalog._topPagesDictionary.update('Kids', originalKids);
        document.destroy();
    });
    it('1041589 returns undefined for non-array Kids', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        const originalKids: any =
            catalog._topPagesDictionary.getRaw('Kids');
        catalog._topPagesDictionary.update('Kids', null);
        catalog._hasInvalidPageTree = undefined;
        expect(
            Array.isArray(catalog._topPagesDictionary.get('Kids'))
        ).toBe(false);
        expect(catalog._checkPageTreeFormat()).toBeUndefined();
        expect(catalog._hasInvalidPageTree).toBeUndefined();
        catalog._topPagesDictionary.update('Kids', originalKids);
        document.destroy();
    });
});
describe('1041589 _PdfCatalog _findNearestIndex', () => {
    it('1041589 finds nearest parsed page', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        catalog._parsedPages = [1, 5, 10];
        expect(catalog._findNearestIndex(6)).toBe(5);
        expect(catalog._findNearestIndex(9)).toBe(10);
        document.destroy();
    });
    it('1041589 evaluates indexes after first index', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        catalog._parsedPages = [1, 8, 15];
        expect(catalog._findNearestIndex(14)).toBe(15);
        expect(catalog._findNearestIndex(7)).toBe(8);
        document.destroy();
    });
    it('1041589 retains first index for equal distance', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        catalog._parsedPages = [2, 8];
        expect(catalog._findNearestIndex(5)).toBe(2);
        document.destroy();
    });
    it('1041589 calculates distance using subtraction', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        catalog._parsedPages = [2, 9, 20];
        expect(catalog._findNearestIndex(10)).toBe(9);
        expect(catalog._findNearestIndex(18)).toBe(20);
        document.destroy();
    });
});
describe('1041589 _PdfCatalog _findNextPage', () => {
    it('1041589 returns next page', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        const parentDictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const firstPage: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const secondPage: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        firstPage.update('Type', new _PdfName('Page'));
        firstPage.update('Parent', parentDictionary);
        secondPage.update('Type', new _PdfName('Page'));
        secondPage.update('Parent', parentDictionary);
        parentDictionary.update(
            'Kids',
            [firstPage, secondPage]
        );
        const result: any = catalog._findNextPage(
            firstPage,
            parentDictionary,
            1
        );
        expect(result).toBeDefined();
        expect(result.dictionary).toBe(secondPage);
        expect(result.reference).toBeNull();
        document.destroy();
    });
    it('1041589 returns previous page including zero boundary', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        const parentDictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const firstPage: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const secondPage: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        firstPage.update('Type', new _PdfName('Page'));
        firstPage.update('Parent', parentDictionary);
        secondPage.update('Type', new _PdfName('Page'));
        secondPage.update('Parent', parentDictionary);
        parentDictionary.update(
            'Kids',
            [firstPage, secondPage]
        );
        const result: any = catalog._findNextPage(
            secondPage,
            parentDictionary,
            -1
        );
        expect(result).toBeDefined();
        expect(result.dictionary).toBe(firstPage);
        expect(result.reference).toBeNull();
        document.destroy();
    });
    it('1041589 returns null without parent', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const catalog: any = document._catalog;
        expect(
            catalog._findNextPage(page._pageDictionary, null, 1)
        ).toBeNull();
        document.destroy();
    });
    it('1041589 returns null when parent has no Kids', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const catalog: any = document._catalog;
        const parentDictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        expect(parentDictionary.has('Kids')).toBe(false);
        expect(
            catalog._findNextPage(
                page._pageDictionary,
                parentDictionary,
                1
            )
        ).toBeNull();
        document.destroy();
    });
    it('1041589 returns null when current page is absent from Kids', () => {
        const document: PdfDocument = new PdfDocument();
        const firstPage: PdfPage = document.addPage();
        document.addPage();
        const catalog: any = document._catalog;
        const unrelatedPage: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const parentDictionary: _PdfDictionary =
            firstPage._pageDictionary.get('Parent');
        unrelatedPage.update('Type', new _PdfName('Page'));
        expect(
            catalog._findNextPage(
                unrelatedPage,
                parentDictionary,
                1
            )
        ).toBeNull();
        document.destroy();
    });
    it('1041589 returns null before first page', () => {
        const document: PdfDocument = new PdfDocument();
        const firstPage: PdfPage = document.addPage();
        document.addPage();
        const catalog: any = document._catalog;
        const parentDictionary: _PdfDictionary =
            firstPage._pageDictionary.get('Parent');
        expect(
            catalog._findNextPage(
                firstPage._pageDictionary,
                parentDictionary,
                -1
            )
        ).toBeNull();
        document.destroy();
    });
    it('1041589 returns null after final page', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const finalPage: PdfPage = document.addPage();
        const catalog: any = document._catalog;
        const parentDictionary: _PdfDictionary =
            finalPage._pageDictionary.get('Parent');
        expect(
            catalog._findNextPage(
                finalPage._pageDictionary,
                parentDictionary,
                1
            )
        ).toBeNull();
        document.destroy();
    });
    it('1041589 resolves indirect Kids', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        const parentDictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const firstPage: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const secondPage: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const kidsReference: _PdfReference =
            document._crossReference._getNextReference();
        const kids: _PdfDictionary[] = [
            firstPage,
            secondPage
        ];
        firstPage.update('Type', new _PdfName('Page'));
        firstPage.update('Parent', parentDictionary);
        secondPage.update('Type', new _PdfName('Page'));
        secondPage.update('Parent', parentDictionary);
        document._crossReference._cacheMap.set(
            kidsReference,
            kids
        );
        parentDictionary.update('Kids', kidsReference);
        expect(
            parentDictionary.getRaw('Kids') instanceof _PdfReference
        ).toBe(true);
        const result: any = catalog._findNextPage(
            firstPage,
            parentDictionary,
            1
        );
        expect(result).toBeDefined();
        expect(result.dictionary).toBe(secondPage);
        expect(result.reference).toBeNull();
        document.destroy();
    });
    it('1041589 returns direct dictionary with null reference', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        const firstPage: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const secondPage: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const parentDictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        firstPage.update('Type', new _PdfName('Page'));
        secondPage.update('Type', new _PdfName('Page'));
        parentDictionary.update('Kids', [firstPage, secondPage]);
        const result: any = catalog._findNextPage(
            firstPage,
            parentDictionary,
            1
        );
        expect(result).toBeDefined();
        expect(result.dictionary).toBe(secondPage);
        expect(result.reference).toBeNull();
        document.destroy();
    });
    it('1041589 throws when Kids is not array', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        const parentDictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const pageDictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        pageDictionary.update('Type', new _PdfName('Page'));
        parentDictionary.update(
            'Kids',
            new _PdfName('InvalidKids')
        );
        expect((): any => catalog._findNextPage(
            pageDictionary,
            parentDictionary,
            1
        )).toThrow();
        document.destroy();
    });
    it('1041589 throws when next child is not dictionary', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        const parentDictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const pageDictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        pageDictionary.update('Type', new _PdfName('Page'));
        pageDictionary.update('Parent', parentDictionary);
        parentDictionary.update(
            'Kids',
            [pageDictionary, 100]
        );
        expect((): any => catalog._findNextPage(
            pageDictionary,
            parentDictionary,
            1
        )).toThrow();
        document.destroy();
    });
});
describe('1041589 _PdfCatalog _traverseFromCached', () => {
    it('1041589 returns same cached page for matching target', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const catalog: any = document._catalog;
        const cachedPage: any = {
            dictionary: page._pageDictionary,
            reference: page._ref,
            parent: page._pageDictionary.get('Parent')
        };
        const result: any = catalog._traverseFromCached(
            0,
            cachedPage,
            0
        );
        expect(result).toBeDefined();
        expect(result.dictionary).toBe(page._pageDictionary);
        expect(result.reference).toBe(page._ref);
        document.destroy();
    });
    it('1041589 moves forward and caches target page', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        const parentDictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const firstPage: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const secondPage: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        firstPage.update('Type', new _PdfName('Page'));
        firstPage.update('Parent', parentDictionary);
        secondPage.update('Type', new _PdfName('Page'));
        secondPage.update('Parent', parentDictionary);
        parentDictionary.update(
            'Kids',
            [firstPage, secondPage]
        );
        const cachedPage: any = {
            dictionary: firstPage,
            reference: null,
            parent: parentDictionary
        };
        catalog._pageCache.clear();
        catalog._parsedPages = [];
        const result: any = catalog._traverseFromCached(
            0,
            cachedPage,
            1
        );
        const storedPage: any =
            catalog._pageCache.get(1);
        expect(result).toBeDefined();
        expect(result.dictionary).toBe(secondPage);
        expect(result.reference).toBeNull();
        expect(storedPage).toBeDefined();
        expect(storedPage.dictionary).toBe(secondPage);
        expect(storedPage.reference).toBeNull();
        expect(catalog._parsedPages).toEqual([1]);
        document.destroy();
    });
    it('1041589 moves backward and caches target page', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        const parentDictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const firstPage: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const secondPage: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        firstPage.update('Type', new _PdfName('Page'));
        firstPage.update('Parent', parentDictionary);
        secondPage.update('Type', new _PdfName('Page'));
        secondPage.update('Parent', parentDictionary);
        parentDictionary.update(
            'Kids',
            [firstPage, secondPage]
        );
        const cachedPage: any = {
            dictionary: secondPage,
            reference: null,
            parent: parentDictionary
        };
        catalog._pageCache.clear();
        catalog._parsedPages = [];
        const result: any = catalog._traverseFromCached(
            1,
            cachedPage,
            0
        );
        const storedPage: any =
            catalog._pageCache.get(0);
        expect(result).toBeDefined();
        expect(result.dictionary).toBe(firstPage);
        expect(result.reference).toBeNull();
        expect(storedPage).toBeDefined();
        expect(storedPage.dictionary).toBe(firstPage);
        expect(storedPage.reference).toBeNull();
        expect(catalog._parsedPages).toEqual([0]);
        document.destroy();
    });
    it('1041589 stops when requested page is reached', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        const parentDictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const firstPage: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const secondPage: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const thirdPage: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        firstPage.update('Type', new _PdfName('Page'));
        firstPage.update('Parent', parentDictionary);
        secondPage.update('Type', new _PdfName('Page'));
        secondPage.update('Parent', parentDictionary);
        thirdPage.update('Type', new _PdfName('Page'));
        thirdPage.update('Parent', parentDictionary);
        parentDictionary.update(
            'Kids',
            [firstPage, secondPage, thirdPage]
        );
        const cachedPage: any = {
            dictionary: firstPage,
            reference: null,
            parent: parentDictionary
        };
        catalog._pageCache.clear();
        catalog._parsedPages = [];
        const result: any = catalog._traverseFromCached(
            0,
            cachedPage,
            1
        );
        expect(result).toBeDefined();
        expect(result.dictionary).toBe(secondPage);
        expect(result.reference).toBeNull();
        expect(catalog._pageCache.has(1)).toBe(true);
        expect(catalog._pageCache.has(2)).toBe(false);
        expect(catalog._parsedPages).toEqual([1]);
        document.destroy();
    });
    it('1041589 returns null when target is outside page range', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const catalog: any = document._catalog;
        const cachedPage: any = {
            dictionary: page._pageDictionary,
            reference: page._ref,
            parent: page._pageDictionary.get('Parent')
        };
        expect(
            catalog._traverseFromCached(0, cachedPage, 1)
        ).toBeNull();
        document.destroy();
    });
    it('1041589 does not return matching non-Page dictionary', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        const dictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const parentDictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const cachedPage: any = {
            dictionary: dictionary,
            reference: null,
            parent: parentDictionary
        };
        dictionary.update('Type', new _PdfName('Pages'));
        parentDictionary.update('Kids', [dictionary]);
        expect(
            catalog._traverseFromCached(0, cachedPage, 0)
        ).toBeNull();
        document.destroy();
    });
});
describe('1041589 _PdfCatalog _getPageDictionary', () => {
    it('1041589 retrieves page zero from root', () => {
        const document: PdfDocument = new PdfDocument();
        const firstPage: PdfPage = document.addPage();
        const catalog: any = document._catalog;
        const result: any =
            catalog._getPageDictionary(0);
        const cachedPage: any =
            catalog._pageCache.get(0);
        expect(result.dictionary).toBe(firstPage._pageDictionary);
        expect(result.reference).toBe(firstPage._ref);
        expect(cachedPage).toBeDefined();
        expect(cachedPage.dictionary).toBe(firstPage._pageDictionary);
        document.destroy();
    });
    it('1041589 returns successful cached traversal result', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const secondPage: PdfPage = document.addPage();
        const thirdPage: PdfPage = document.addPage();
        const catalog: any = document._catalog;
        catalog._pageCache.clear();
        catalog._parsedPages = [];
        catalog._hasInvalidPageTree = true;
        catalog._addToCache(
            1,
            secondPage._pageDictionary,
            secondPage._ref
        );
        const result: any =
            catalog._getPageDictionary(2);
        const cachedPage: any =
            catalog._pageCache.get(2);
        expect(result.dictionary).toBe(thirdPage._pageDictionary);
        expect(result.reference).toBe(thirdPage._ref);
        expect(cachedPage).toBeDefined();
        expect(cachedPage.dictionary).toBe(thirdPage._pageDictionary);
        document.destroy();
    });
    it('1041589 falls back to root when nearest index is zero', () => {
        const document: PdfDocument = new PdfDocument();
        const firstPage: PdfPage = document.addPage();
        const secondPage: PdfPage = document.addPage();
        const catalog: any = document._catalog;
        catalog._pageCache.clear();
        catalog._parsedPages = [];
        catalog._hasInvalidPageTree = true;
        catalog._addToCache(
            0,
            firstPage._pageDictionary,
            firstPage._ref
        );
        const result: any =
            catalog._getPageDictionary(1);
        expect(result.dictionary).toBe(secondPage._pageDictionary);
        expect(result.reference).toBe(secondPage._ref);
        document.destroy();
    });
    it('1041589 falls back to root when cache entry is missing', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const secondPage: PdfPage = document.addPage();
        const catalog: any = document._catalog;
        catalog._pageCache.clear();
        catalog._parsedPages = [1];
        catalog._hasInvalidPageTree = true;
        expect(catalog._pageCache.has(1)).toBe(false);
        const result: any =
            catalog._getPageDictionary(1);
        expect(result.dictionary).toBe(secondPage._pageDictionary);
        expect(result.reference).toBe(secondPage._ref);
        document.destroy();
    });
    it('1041589 falls back to root when cached traversal returns null', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        const originalKids: any =
            catalog._topPagesDictionary.getRaw('Kids');
        const originalCount: any =
            catalog._topPagesDictionary.getRaw('Count');
        const firstPage: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const secondPage: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const thirdPage: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const unavailablePage: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        firstPage.update('Type', new _PdfName('Page'));
        secondPage.update('Type', new _PdfName('Page'));
        thirdPage.update('Type', new _PdfName('Page'));
        unavailablePage.update('Type', new _PdfName('Page'));
        catalog._topPagesDictionary.update(
            'Kids',
            [firstPage, secondPage, thirdPage]
        );
        catalog._topPagesDictionary.update('Count', 3);
        catalog._pageCache.clear();
        catalog._parsedPages = [1];
        catalog._hasInvalidPageTree = true;
        catalog._pageCache.set(1, {
            dictionary: unavailablePage,
            reference: null,
            parent: null
        });
        const result: any =
            catalog._getPageDictionary(2);
        expect(result).toBeDefined();
        expect(result.dictionary).toBe(thirdPage);
        expect(result.reference).toBeNull();
        expect(result.dictionary).not.toBe(unavailablePage);
        catalog._topPagesDictionary.update('Kids', originalKids);
        catalog._topPagesDictionary.update('Count', originalCount);
        document.destroy();
    });
    it('1041589 uses root when page tree format is false', () => {
        const document: PdfDocument = new PdfDocument();
        const firstPage: PdfPage = document.addPage();
        const secondPage: PdfPage = document.addPage();
        const catalog: any = document._catalog;
        const originalCount: number =
            catalog._topPagesDictionary.get('Count');
        catalog._pageCache.clear();
        catalog._parsedPages = [1];
        catalog._topPagesDictionary.update('Count', 3);
        catalog._hasInvalidPageTree = undefined;
        expect(catalog._checkPageTreeFormat()).toBe(false);
        const result: any =
            catalog._getPageDictionary(1);
        expect(result.dictionary).toBe(secondPage._pageDictionary);
        expect(result.dictionary).not.toBe(firstPage._pageDictionary);
        expect(result.reference).toBe(secondPage._ref);
        catalog._topPagesDictionary.update('Count', originalCount);
        document.destroy();
    });
});
describe('1041589 _PdfCatalog _traverseFromRoot', () => {
    it('1041589 returns first indirect page and populates caches', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const catalog: any = document._catalog;
        catalog.pageKidsCountCache.clear();
        catalog.pageIndexCache.clear();
        catalog._pageCache.clear();
        catalog._parsedPages = [];
        const result: any =
            catalog._traverseFromRoot(0);
        const cachedPage: any =
            catalog._pageCache.get(0);
        expect(result.dictionary).toBe(page._pageDictionary);
        expect(result.reference).toBe(page._ref);
        expect(catalog.pageKidsCountCache.get(page._ref)).toBe(1);
        expect(catalog.pageIndexCache.get(page._ref)).toBe(0);
        expect(cachedPage).toBeDefined();
        expect(cachedPage.dictionary).toBe(page._pageDictionary);
        expect(catalog._parsedPages).toEqual([0]);
        document.destroy();
    });
    it('1041589 skips page for zero cached count', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const catalog: any = document._catalog;
        catalog.pageKidsCountCache.clear();
        catalog.pageKidsCountCache.put(page._ref, 0);
        expect(catalog.pageKidsCountCache.has(page._ref)).toBe(true);
        expect(catalog.pageKidsCountCache.get(page._ref)).toBe(0);
        expect((): void => {
            catalog._traverseFromRoot(0);
        }).toThrow();
        document.destroy();
    });
    it('1041589 does not skip page for negative cached count', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const catalog: any = document._catalog;
        catalog.pageKidsCountCache.clear();
        catalog.pageKidsCountCache.put(page._ref, -1);
        const result: any =
            catalog._traverseFromRoot(0);
        expect(result.dictionary).toBe(page._pageDictionary);
        expect(result.reference).toBe(page._ref);
        expect(catalog.pageKidsCountCache.get(page._ref)).toBe(-1);
        document.destroy();
    });
    it('1041589 does not skip page for zero cached count', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const catalog: any = document._catalog;
        catalog.pageKidsCountCache.clear();
        catalog.pageKidsCountCache.put(page._ref, 0);
        expect(catalog.pageKidsCountCache.has(page._ref)).toBe(true);
        expect(catalog.pageKidsCountCache.get(page._ref)).toBe(0);
        const traversePage: () => void = (): void => {
            catalog._traverseFromRoot(0);
        };
        expect(traversePage).toThrowError(
            'Page index 0 not found.'
        );
        document.destroy();
    });
    it('1041589 resolves indirect page Type', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const catalog: any = document._catalog;
        const originalType: any =
            page._pageDictionary.getRaw('Type');
        const typeReference: _PdfReference =
            document._crossReference._getNextReference();
        document._crossReference._cacheMap.set(
            typeReference,
            new _PdfName('Page')
        );
        page._pageDictionary.update('Type', typeReference);
        const result: any =
            catalog._traverseFromRoot(0);
        expect(result.dictionary).toBe(page._pageDictionary);
        expect(result.reference).toBe(page._ref);
        page._pageDictionary.update('Type', originalType);
        document.destroy();
    });
    it('1041589 treats direct Page dictionary as page', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        const originalKids: any =
            catalog._topPagesDictionary.getRaw('Kids');
        const originalCount: any =
            catalog._topPagesDictionary.getRaw('Count');
        const pageDictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        pageDictionary.update('Type', new _PdfName('Page'));
        catalog._topPagesDictionary.update('Kids', [pageDictionary]);
        catalog._topPagesDictionary.update('Count', 1);
        const result: any =
            catalog._traverseFromRoot(0);
        expect(result.dictionary).toBe(pageDictionary);
        expect(result.reference).toBeNull();
        catalog._topPagesDictionary.update('Kids', originalKids);
        catalog._topPagesDictionary.update('Count', originalCount);
        document.destroy();
    });
    it('1041589 treats dictionary without Kids as page', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        const originalKids: any =
            catalog._topPagesDictionary.getRaw('Kids');
        const originalCount: any =
            catalog._topPagesDictionary.getRaw('Count');
        const pageDictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        pageDictionary.update(
            'Type',
            new _PdfName('CustomPageType')
        );
        catalog._topPagesDictionary.update('Kids', [pageDictionary]);
        catalog._topPagesDictionary.update('Count', 1);
        const result: any =
            catalog._traverseFromRoot(0);
        expect(pageDictionary.has('Kids')).toBe(false);
        expect(result.dictionary).toBe(pageDictionary);
        expect(result.reference).toBeNull();
        catalog._topPagesDictionary.update('Kids', originalKids);
        catalog._topPagesDictionary.update('Count', originalCount);
        document.destroy();
    });
    it('1041589 does not overwrite existing child count cache', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const catalog: any = document._catalog;
        catalog.pageKidsCountCache.clear();
        catalog.pageKidsCountCache.put(page._ref, 7);
        const result: any =
            catalog._traverseFromRoot(0);
        expect(result.dictionary).toBe(page._pageDictionary);
        expect(catalog.pageKidsCountCache.get(page._ref)).toBe(7);
        document.destroy();
    });
    it('1041589 does not overwrite existing page index cache', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const catalog: any = document._catalog;
        catalog.pageIndexCache.clear();
        catalog.pageIndexCache.put(page._ref, 6);
        const result: any =
            catalog._traverseFromRoot(0);
        expect(result.dictionary).toBe(page._pageDictionary);
        expect(catalog.pageIndexCache.get(page._ref)).toBe(6);
        document.destroy();
    });
    it('1041589 skips zero Count subtree at target boundary', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        const originalKids: any =
            catalog._topPagesDictionary.getRaw('Kids');
        const originalCount: any =
            catalog._topPagesDictionary.getRaw('Count');
        const childPage: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const childPages: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        childPage.update('Type', new _PdfName('Page'));
        childPages.update('Type', new _PdfName('Pages'));
        childPages.update('Count', 0);
        childPages.update('Kids', [childPage]);
        catalog._topPagesDictionary.update('Count', 1);
        catalog._topPagesDictionary.update('Kids', [childPages]);
        expect(childPages.get('Count')).toBe(0);
        expect(Number.isInteger(childPages.get('Count'))).toBe(true);
        expect((): void => {
            catalog._traverseFromRoot(0);
        }).toThrow();
        catalog._topPagesDictionary.update('Kids', originalKids);
        catalog._topPagesDictionary.update('Count', originalCount);
        document.destroy();
    });
    it('1041589 ignores null Count and traverses Kids', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        const originalKids: any =
            catalog._topPagesDictionary.getRaw('Kids');
        const originalCount: any =
            catalog._topPagesDictionary.getRaw('Count');
        const pageDictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const pagesDictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        pageDictionary.update('Type', new _PdfName('Page'));
        pagesDictionary.update('Type', new _PdfName('Pages'));
        pagesDictionary.update('Count', null);
        pagesDictionary.update('Kids', [pageDictionary]);
        catalog._topPagesDictionary.update('Count', 1);
        catalog._topPagesDictionary.update('Kids', [pagesDictionary]);
        const result: any =
            catalog._traverseFromRoot(0);
        expect(result.dictionary).toBe(pageDictionary);
        catalog._topPagesDictionary.update('Kids', originalKids);
        catalog._topPagesDictionary.update('Count', originalCount);
        document.destroy();
    });
    it('1041589 ignores non-integer Count and traverses Kids', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        const originalKids: any =
            catalog._topPagesDictionary.getRaw('Kids');
        const originalCount: any =
            catalog._topPagesDictionary.getRaw('Count');
        const pageDictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const pagesDictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        pageDictionary.update('Type', new _PdfName('Page'));
        pagesDictionary.update('Type', new _PdfName('Pages'));
        pagesDictionary.update('Count', 1.5);
        pagesDictionary.update('Kids', [pageDictionary]);
        catalog._topPagesDictionary.update('Count', 1);
        catalog._topPagesDictionary.update('Kids', [pagesDictionary]);
        const result: any =
            catalog._traverseFromRoot(0);
        expect(result.dictionary).toBe(pageDictionary);
        catalog._topPagesDictionary.update('Kids', originalKids);
        catalog._topPagesDictionary.update('Count', originalCount);
        document.destroy();
    });
    it('1041589 ignores negative Count and traverses Kids', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        const originalKids: any =
            catalog._topPagesDictionary.getRaw('Kids');
        const originalCount: any =
            catalog._topPagesDictionary.getRaw('Count');
        const pageDictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const pagesDictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        pageDictionary.update('Type', new _PdfName('Page'));
        pagesDictionary.update('Type', new _PdfName('Pages'));
        pagesDictionary.update('Count', -1);
        pagesDictionary.update('Kids', [pageDictionary]);
        catalog._topPagesDictionary.update('Count', 1);
        catalog._topPagesDictionary.update('Kids', [pagesDictionary]);
        const result: any =
            catalog._traverseFromRoot(0);
        expect(result.dictionary).toBe(pageDictionary);
        catalog._topPagesDictionary.update('Kids', originalKids);
        catalog._topPagesDictionary.update('Count', originalCount);
        document.destroy();
    });
    it('1041589 skips zero Count subtree at page zero boundary', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        const originalKids: any =
            catalog._topPagesDictionary.getRaw('Kids');
        const originalCount: any =
            catalog._topPagesDictionary.getRaw('Count');
        const childPage: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const childPages: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        childPage.update('Type', new _PdfName('Page'));
        childPages.update('Type', new _PdfName('Pages'));
        childPages.update('Count', 0);
        childPages.update('Kids', [childPage]);
        catalog._topPagesDictionary.update('Count', 1);
        catalog._topPagesDictionary.update('Kids', [childPages]);
        expect(childPages.get('Count')).toBe(0);
        expect(Number.isInteger(childPages.get('Count'))).toBe(true);
        expect((): any => catalog._traverseFromRoot(0)).toThrow();
        catalog._topPagesDictionary.update('Kids', originalKids);
        catalog._topPagesDictionary.update('Count', originalCount);
        document.destroy();
    });
    it('1041589 preserves Kids source order', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        const originalKids: any =
            catalog._topPagesDictionary.getRaw('Kids');
        const originalCount: any =
            catalog._topPagesDictionary.getRaw('Count');
        const firstPage: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const secondPage: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const thirdPage: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        firstPage.update('Type', new _PdfName('Page'));
        secondPage.update('Type', new _PdfName('Page'));
        thirdPage.update('Type', new _PdfName('Page'));
        catalog._topPagesDictionary.update(
            'Kids',
            [firstPage, secondPage, thirdPage]
        );
        catalog._topPagesDictionary.update('Count', 3);
        expect(
            catalog._traverseFromRoot(0).dictionary
        ).toBe(firstPage);
        expect(
            catalog._traverseFromRoot(1).dictionary
        ).toBe(secondPage);
        expect(
            catalog._traverseFromRoot(2).dictionary
        ).toBe(thirdPage);
        catalog._topPagesDictionary.update('Kids', originalKids);
        catalog._topPagesDictionary.update('Count', originalCount);
        document.destroy();
    });
    it('1041589 throws for invalid child type', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        const originalKids: any =
            catalog._topPagesDictionary.getRaw('Kids');
        const originalCount: any =
            catalog._topPagesDictionary.getRaw('Count');
        catalog._topPagesDictionary.update('Kids', [100]);
        catalog._topPagesDictionary.update('Count', 1);
        expect((): any => catalog._traverseFromRoot(0)).toThrow();
        catalog._topPagesDictionary.update('Kids', originalKids);
        catalog._topPagesDictionary.update('Count', originalCount);
        document.destroy();
    });
    it('1041589 throws when Pages Kids is not array', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        const originalKids: any =
            catalog._topPagesDictionary.getRaw('Kids');
        const originalCount: any =
            catalog._topPagesDictionary.getRaw('Count');
        const pagesDictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        pagesDictionary.update('Type', new _PdfName('Pages'));
        pagesDictionary.update('Count', 1);
        pagesDictionary.update(
            'Kids',
            new _PdfName('InvalidKids')
        );
        catalog._topPagesDictionary.update(
            'Kids',
            [pagesDictionary]
        );
        catalog._topPagesDictionary.update('Count', 1);
        expect((): any => catalog._traverseFromRoot(0)).toThrow();
        catalog._topPagesDictionary.update('Kids', originalKids);
        catalog._topPagesDictionary.update('Count', originalCount);
        document.destroy();
    });
    it('1041589 throws when page index does not exist', () => {
        const document: PdfDocument = new PdfDocument();
        document.addPage();
        const catalog: any = document._catalog;
        expect((): any => catalog._traverseFromRoot(2)).toThrowError(
            Error,
            'Page index 2 not found.'
        );
        document.destroy();
    });
});
describe('1041589 _PdfCatalog destroy', () => {
    it('1041589 _destroy clears catalog resources', () => {
        const document: PdfDocument = new PdfDocument();
        const page: PdfPage = document.addPage();
        const catalog: any = document._catalog;
        catalog._addToCache(
            0,
            page._pageDictionary,
            page._ref
        );
        catalog.pageKidsCountCache.put(page._ref, 1);
        catalog.pageIndexCache.put(page._ref, 0);
        catalog._hasInvalidPageTree = true;
        const pageIndexCache: any =
            catalog.pageIndexCache;
        const childCountCache: any =
            catalog.pageKidsCountCache;
        expect(catalog._pageCache.size).toBe(1);
        expect(catalog._parsedPages).toEqual([0]);
        catalog._destroy();
        expect(catalog._catalogDictionary).toBeUndefined();
        expect(catalog._topPagesDictionary).toBeUndefined();
        expect(pageIndexCache.has(page._ref)).toBe(false);
        expect(childCountCache.has(page._ref)).toBe(false);
        expect(catalog.pageIndexCache).toBeUndefined();
        expect(catalog.pageKidsCountCache).toBeUndefined();
        expect(catalog._hasInvalidPageTree).toBeUndefined();
        expect(catalog._pageCache.size).toBe(0);
        expect(catalog._parsedPages).toEqual([]);
        expect(catalog._parsedPages.length).toBe(0);
    });
    it('1041589 _destroy resets populated parsed pages', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        catalog._parsedPages = [1, 3, 5];
        catalog._destroy();
        expect(catalog._parsedPages).toEqual([]);
        expect(catalog._parsedPages.length).toBe(0);
        expect(catalog._parsedPages).not.toEqual([
            'Stryker was here'
        ]);
    });
    it('1041589 _destroy works without catalog dictionary', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        catalog._catalogDictionary = undefined;
        expect((): void => catalog._destroy()).not.toThrow();
        expect(catalog._catalogDictionary).toBeUndefined();
        expect(catalog._topPagesDictionary).toBeUndefined();
        expect(catalog.pageIndexCache).toBeUndefined();
        expect(catalog.pageKidsCountCache).toBeUndefined();
        expect(catalog._pageCache.size).toBe(0);
        expect(catalog._parsedPages).toEqual([]);
    });
    it('1041589 _destroy works without top Pages dictionary', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        catalog._topPagesDictionary = undefined;
        expect((): void => catalog._destroy()).not.toThrow();
        expect(catalog._topPagesDictionary).toBeUndefined();
        expect(catalog._parsedPages).toEqual([]);
    });
    it('1041589 _destroy works without page index cache', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        catalog.pageIndexCache = undefined;
        expect((): void => catalog._destroy()).not.toThrow();
        expect(catalog.pageIndexCache).toBeUndefined();
        expect(catalog._parsedPages).toEqual([]);
    });
    it('1041589 _destroy works without child count cache', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        catalog.pageKidsCountCache = undefined;
        expect((): void => catalog._destroy()).not.toThrow();
        expect(catalog.pageKidsCountCache).toBeUndefined();
        expect(catalog._parsedPages).toEqual([]);
    });
    it('1041589 _destroy works when optional resources are undefined', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        catalog._catalogDictionary = undefined;
        catalog._topPagesDictionary = undefined;
        catalog.pageIndexCache = undefined;
        catalog.pageKidsCountCache = undefined;
        catalog._hasInvalidPageTree = true;
        catalog._parsedPages = [2];
        expect((): void => catalog._destroy()).not.toThrow();
        expect(catalog._catalogDictionary).toBeUndefined();
        expect(catalog._topPagesDictionary).toBeUndefined();
        expect(catalog.pageIndexCache).toBeUndefined();
        expect(catalog.pageKidsCountCache).toBeUndefined();
        expect(catalog._hasInvalidPageTree).toBeUndefined();
        expect(catalog._pageCache.size).toBe(0);
        expect(catalog._parsedPages).toEqual([]);
    });
});
describe('1041589 _PdfCatalog version remaining mutation', () => {
    it('1041589 version does not read Version when entry is absent', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        const dictionary: any = catalog._catalogDictionary;
        const originalHas: (key: string) => boolean =
            dictionary.has.bind(dictionary);
        const originalGet: (key: string) => any =
            dictionary.get.bind(dictionary);
        let getCallCount: number = 0;
        dictionary.has = (key: string): boolean => {
            expect(key).toBe('Version');
            return false;
        };
        dictionary.get = (key: string): any => {
            getCallCount++;
            return originalGet(key);
        };
        const result: string = catalog.version;
        expect(result).toBeUndefined();
        expect(getCallCount).toBe(0);
        dictionary.has = originalHas;
        dictionary.get = originalGet;
        document.destroy();
    });
});
describe('1041589 _PdfCatalog pageCount remaining mutations', () => {
    it('1041589 pageCount throws for non-integer Count', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        const originalCount: any =
            catalog._topPagesDictionary.getRaw('Count');
        catalog._topPagesDictionary.update('Count', 1.5);
        expect(catalog._topPagesDictionary.get('Count')).toBe(1.5);
        expect(Number.isInteger(1.5)).toBe(false);
        const getPageCount: () => number = (): number => {
            return catalog.pageCount;
        };
        expect(getPageCount).toThrow();
        catalog._topPagesDictionary.update('Count', originalCount);
        document.destroy();
    });
});
describe('1041589 _PdfCatalog AcroForm remaining mutation', () => {
    it('1041589 acroForm does not read absent AcroForm before creating it', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        const dictionary: any = catalog._catalogDictionary;
        const originalHas: (key: string) => boolean =
            dictionary.has.bind(dictionary);
        const originalGet: (key: string) => any =
            dictionary.get.bind(dictionary);
        let getCallCount: number = 0;
        dictionary.has = (key: string): boolean => {
            if (key === 'AcroForm') {
                return false;
            }
            return originalHas(key);
        };
        dictionary.get = (key: string): any => {
            if (key === 'AcroForm') {
                getCallCount++;
            }
            return originalGet(key);
        };
        const result: _PdfDictionary = catalog.acroForm;
        expect(result instanceof _PdfDictionary).toBe(true);
        expect(getCallCount).toBe(0);
        expect(dictionary.has('AcroForm')).toBe(false);
        dictionary.has = originalHas;
        dictionary.get = originalGet;
        document.destroy();
    });
});
describe('1041589 _PdfCatalog _getPageDictionary remaining mutations', () => {
    it('1041589 page zero goes directly to root without checking page tree format', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        const originalCheck: () => boolean =
            catalog._checkPageTreeFormat.bind(catalog);
        const originalRoot: (index: number) => any =
            catalog._traverseFromRoot.bind(catalog);
        let checkCallCount: number = 0;
        let rootCallCount: number = 0;
        const expectedResult: any = {
            dictionary: catalog._topPagesDictionary,
            reference: null
        };
        catalog._checkPageTreeFormat = (): boolean => {
            checkCallCount++;
            return true;
        };
        catalog._traverseFromRoot = (index: number): any => {
            rootCallCount++;
            expect(index).toBe(0);
            return expectedResult;
        };
        const result: any = catalog._getPageDictionary(0);
        expect(result).toBe(expectedResult);
        expect(checkCallCount).toBe(0);
        expect(rootCallCount).toBe(1);
        catalog._checkPageTreeFormat = originalCheck;
        catalog._traverseFromRoot = originalRoot;
        document.destroy();
    });
    it('1041589 nonzero page uses root when page tree format is false', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        const originalCheck: () => boolean =
            catalog._checkPageTreeFormat.bind(catalog);
        const originalFind: (index: number) => number =
            catalog._findNearestIndex.bind(catalog);
        const originalRoot: (index: number) => any =
            catalog._traverseFromRoot.bind(catalog);
        let checkCallCount: number = 0;
        let findCallCount: number = 0;
        let rootCallCount: number = 0;
        const expectedResult: any = {
            dictionary: catalog._topPagesDictionary,
            reference: null
        };
        catalog._checkPageTreeFormat = (): boolean => {
            checkCallCount++;
            return false;
        };
        catalog._findNearestIndex = (_index: number): number => {
            findCallCount++;
            return 1;
        };
        catalog._traverseFromRoot = (index: number): any => {
            rootCallCount++;
            expect(index).toBe(2);
            return expectedResult;
        };
        const result: any = catalog._getPageDictionary(2);
        expect(result).toBe(expectedResult);
        expect(checkCallCount).toBe(1);
        expect(findCallCount).toBe(0);
        expect(rootCallCount).toBe(1);
        catalog._checkPageTreeFormat = originalCheck;
        catalog._findNearestIndex = originalFind;
        catalog._traverseFromRoot = originalRoot;
        document.destroy();
    });
    it('1041589 nearest index zero uses root traversal', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        const originalCheck: () => boolean =
            catalog._checkPageTreeFormat.bind(catalog);
        const originalFind: (index: number) => number =
            catalog._findNearestIndex.bind(catalog);
        const originalRoot: (index: number) => any =
            catalog._traverseFromRoot.bind(catalog);
        let rootCallCount: number = 0;
        const expectedResult: any = {
            dictionary: catalog._topPagesDictionary,
            reference: null
        };
        catalog._checkPageTreeFormat = (): boolean => true;
        catalog._findNearestIndex = (_index: number): number => 0;
        catalog._traverseFromRoot = (index: number): any => {
            rootCallCount++;
            expect(index).toBe(2);
            return expectedResult;
        };
        const result: any = catalog._getPageDictionary(2);
        expect(result).toBe(expectedResult);
        expect(rootCallCount).toBe(1);
        catalog._checkPageTreeFormat = originalCheck;
        catalog._findNearestIndex = originalFind;
        catalog._traverseFromRoot = originalRoot;
        document.destroy();
    });
    it('1041589 missing nearest cache entry falls back to root', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        const originalCheck: () => boolean =
            catalog._checkPageTreeFormat.bind(catalog);
        const originalFind: (index: number) => number =
            catalog._findNearestIndex.bind(catalog);
        const originalTraverse: (
            index: number,
            page: any,
            target: number
        ) => any = catalog._traverseFromCached.bind(catalog);
        const originalRoot: (index: number) => any =
            catalog._traverseFromRoot.bind(catalog);
        let cachedTraverseCallCount: number = 0;
        let rootCallCount: number = 0;
        const expectedResult: any = {
            dictionary: catalog._topPagesDictionary,
            reference: null
        };
        catalog._pageCache.clear();
        catalog._checkPageTreeFormat = (): boolean => true;
        catalog._findNearestIndex = (_index: number): number => 1;
        catalog._traverseFromCached = (
            _index: number,
            _page: any,
            _target: number
        ): any => {
            cachedTraverseCallCount++;
            return null;
        };
        catalog._traverseFromRoot = (_index: number): any => {
            rootCallCount++;
            return expectedResult;
        };
        const result: any = catalog._getPageDictionary(2);
        expect(result).toBe(expectedResult);
        expect(cachedTraverseCallCount).toBe(0);
        expect(rootCallCount).toBe(1);
        catalog._checkPageTreeFormat = originalCheck;
        catalog._findNearestIndex = originalFind;
        catalog._traverseFromCached = originalTraverse;
        catalog._traverseFromRoot = originalRoot;
        document.destroy();
    });
    it('1041589 null cached traversal result falls back to root', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        const originalCheck: () => boolean =
            catalog._checkPageTreeFormat.bind(catalog);
        const originalFind: (index: number) => number =
            catalog._findNearestIndex.bind(catalog);
        const originalTraverse: (
            index: number,
            page: any,
            target: number
        ) => any = catalog._traverseFromCached.bind(catalog);
        const originalRoot: (index: number) => any =
            catalog._traverseFromRoot.bind(catalog);
        let cachedTraverseCallCount: number = 0;
        let rootCallCount: number = 0;
        const cachedPage: any = {
            dictionary: catalog._topPagesDictionary,
            reference: null,
            parent: null
        };
        const expectedResult: any = {
            dictionary: catalog._topPagesDictionary,
            reference: null
        };
        catalog._pageCache.clear();
        catalog._pageCache.set(1, cachedPage);
        catalog._checkPageTreeFormat = (): boolean => true;
        catalog._findNearestIndex = (_index: number): number => 1;
        catalog._traverseFromCached = (
            index: number,
            page: any,
            target: number
        ): any => {
            cachedTraverseCallCount++;
            expect(index).toBe(1);
            expect(page).toBe(cachedPage);
            expect(target).toBe(2);
            return null;
        };
        catalog._traverseFromRoot = (_index: number): any => {
            rootCallCount++;
            return expectedResult;
        };
        const result: any = catalog._getPageDictionary(2);
        expect(result).toBe(expectedResult);
        expect(cachedTraverseCallCount).toBe(1);
        expect(rootCallCount).toBe(1);
        catalog._checkPageTreeFormat = originalCheck;
        catalog._findNearestIndex = originalFind;
        catalog._traverseFromCached = originalTraverse;
        catalog._traverseFromRoot = originalRoot;
        document.destroy();
    });
    it('1041589 valid cached traversal result is returned without root traversal', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        const originalCheck: () => boolean =
            catalog._checkPageTreeFormat.bind(catalog);
        const originalFind: (index: number) => number =
            catalog._findNearestIndex.bind(catalog);
        const originalTraverse: (
            index: number,
            page: any,
            target: number
        ) => any = catalog._traverseFromCached.bind(catalog);
        const originalRoot: (index: number) => any =
            catalog._traverseFromRoot.bind(catalog);
        let rootCallCount: number = 0;
        const cachedPage: any = {
            dictionary: catalog._topPagesDictionary,
            reference: null,
            parent: null
        };
        const expectedResult: any = {
            dictionary: new _PdfDictionary(document._crossReference),
            reference: null
        };
        catalog._pageCache.clear();
        catalog._pageCache.set(1, cachedPage);
        catalog._checkPageTreeFormat = (): boolean => true;
        catalog._findNearestIndex = (_index: number): number => 1;
        catalog._traverseFromCached = (
            _index: number,
            _page: any,
            _target: number
        ): any => expectedResult;
        catalog._traverseFromRoot = (_index: number): any => {
            rootCallCount++;
            return null;
        };
        const result: any = catalog._getPageDictionary(2);
        expect(result).toBe(expectedResult);
        expect(rootCallCount).toBe(0);
        catalog._checkPageTreeFormat = originalCheck;
        catalog._findNearestIndex = originalFind;
        catalog._traverseFromCached = originalTraverse;
        catalog._traverseFromRoot = originalRoot;
        document.destroy();
    });
});
describe('1041589 _PdfCatalog _checkPageTreeFormat cached mutation', () => {
    it('1041589 cached false page tree result is not recalculated', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        const originalKids: any =
            catalog._topPagesDictionary.getRaw('Kids');
        const originalCount: any =
            catalog._topPagesDictionary.getRaw('Count');
        const firstPage: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const secondPage: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        firstPage.update('Type', new _PdfName('Page'));
        secondPage.update('Type', new _PdfName('Page'));
        catalog._topPagesDictionary.update(
            'Kids',
            [firstPage, secondPage]
        );
        catalog._topPagesDictionary.update('Count', 2);
        catalog._hasInvalidPageTree = false;
        expect(catalog._checkPageTreeFormat()).toBe(false);
        expect(catalog._hasInvalidPageTree).toBe(false);
        catalog._topPagesDictionary.update('Kids', originalKids);
        catalog._topPagesDictionary.update('Count', originalCount);
        document.destroy();
    });
});
describe('1041589 _PdfCatalog _traverseFromCached remaining mutations', () => {
    it('1041589 nonmatching cached Page continues to target page', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        const parentDictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const firstPage: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const secondPage: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const cachedPage: any = {
            dictionary: firstPage,
            reference: null,
            parent: parentDictionary
        };
        firstPage.update('Type', new _PdfName('Page'));
        secondPage.update('Type', new _PdfName('Page'));
        parentDictionary.update('Kids', [firstPage, secondPage]);
        const result: any = catalog._traverseFromCached(
            0,
            cachedPage,
            1
        );
        expect(result).toBeDefined();
        expect(result.dictionary).toBe(secondPage);
        expect(result.dictionary).not.toBe(firstPage);
        document.destroy();
    });
    it('1041589 equal index non-Page does not enter traversal loop', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        const currentDictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const invalidParent: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const cachedPage: any = {
            dictionary: currentDictionary,
            reference: null,
            parent: invalidParent
        };
        currentDictionary.update('Type', new _PdfName('Pages'));
        invalidParent.update(
            'Kids',
            new _PdfName('InvalidKids')
        );
        const result: any = catalog._traverseFromCached(
            1,
            cachedPage,
            1
        );
        expect(result).toBeNull();
        document.destroy();
    });
    it('1041589 null current dictionary does not enter traversal loop', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        const invalidParent: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const cachedPage: any = {
            dictionary: null,
            reference: null,
            parent: invalidParent
        };
        invalidParent.update(
            'Kids',
            new _PdfName('InvalidKids')
        );
        const result: any = catalog._traverseFromCached(
            0,
            cachedPage,
            1
        );
        expect(result).toBeNull();
        document.destroy();
    });
});
describe('1041589 _PdfCatalog _findNextPage current index mutation', () => {
    it('1041589 first direct child returns second direct child', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        const parentDictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const firstPage: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const secondPage: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        firstPage.update('Type', new _PdfName('Page'));
        secondPage.update('Type', new _PdfName('Page'));
        parentDictionary.update('Kids', [firstPage, secondPage]);
        const result: any = catalog._findNextPage(
            firstPage,
            parentDictionary,
            1
        );
        expect(result).toBeDefined();
        expect(result.dictionary).toBe(secondPage);
        expect(result.reference).toBeNull();
        document.destroy();
    });
});
describe('1041589 _PdfCatalog _traverseFromRoot remaining mutations', () => {
    it('1041589 indirect Page type is resolved and returned before its Kids', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        const originalKids: any =
            catalog._topPagesDictionary.getRaw('Kids');
        const originalCount: any =
            catalog._topPagesDictionary.getRaw('Count');
        const pageReference: _PdfReference =
            document._crossReference._getNextReference();
        const typeReference: _PdfReference =
            document._crossReference._getNextReference();
        const indirectPage: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const childPage: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        document._crossReference._cacheMap.set(
            typeReference,
            new _PdfName('Page')
        );
        childPage.update('Type', new _PdfName('Page'));
        indirectPage.update('Type', typeReference);
        indirectPage.update('Kids', [childPage]);
        document._crossReference._cacheMap.set(
            pageReference,
            indirectPage
        );
        catalog._topPagesDictionary.update(
            'Kids',
            [pageReference]
        );
        catalog._topPagesDictionary.update('Count', 1);
        catalog.pageKidsCountCache.clear();
        catalog.pageIndexCache.clear();
        const result: any =
            catalog._traverseFromRoot(0);
        expect(result).toBeDefined();
        expect(result.dictionary).toBe(indirectPage);
        expect(result.dictionary).not.toBe(childPage);
        expect(result.reference).toBe(pageReference);
        catalog._topPagesDictionary.update('Kids', originalKids);
        catalog._topPagesDictionary.update('Count', originalCount);
        document.destroy();
    });
    it('1041589 non-integer Count does not skip valid child pages', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        const originalKids: any =
            catalog._topPagesDictionary.getRaw('Kids');
        const originalCount: any =
            catalog._topPagesDictionary.getRaw('Count');
        const branch: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const firstPage: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const secondPage: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const thirdPage: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        firstPage.update('Type', new _PdfName('Page'));
        secondPage.update('Type', new _PdfName('Page'));
        thirdPage.update('Type', new _PdfName('Page'));
        branch.update('Type', new _PdfName('Pages'));
        branch.update('Count', 1.5);
        branch.update(
            'Kids',
            [firstPage, secondPage, thirdPage]
        );
        catalog._topPagesDictionary.update('Kids', [branch]);
        catalog._topPagesDictionary.update('Count', 3);
        const result: any =
            catalog._traverseFromRoot(2);
        expect(result).toBeDefined();
        expect(result.dictionary).toBe(thirdPage);
        expect(result.reference).toBeNull();
        catalog._topPagesDictionary.update('Kids', originalKids);
        catalog._topPagesDictionary.update('Count', originalCount);
        document.destroy();
    });
    it('1041589 subtree Count advances page index by addition', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        const originalKids: any =
            catalog._topPagesDictionary.getRaw('Kids');
        const originalCount: any =
            catalog._topPagesDictionary.getRaw('Count');
        const skippedBranch: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const skippedPage: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        const targetPage: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        skippedPage.update('Type', new _PdfName('Page'));
        targetPage.update('Type', new _PdfName('Page'));
        skippedBranch.update('Type', new _PdfName('Pages'));
        skippedBranch.update('Count', 1);
        skippedBranch.update('Kids', [skippedPage]);
        catalog._topPagesDictionary.update(
            'Kids',
            [skippedBranch, targetPage]
        );
        catalog._topPagesDictionary.update('Count', 2);
        const result: any =
            catalog._traverseFromRoot(1);
        expect(result).toBeDefined();
        expect(result.dictionary).toBe(targetPage);
        expect(result.dictionary).not.toBe(skippedPage);
        catalog._topPagesDictionary.update('Kids', originalKids);
        catalog._topPagesDictionary.update('Count', originalCount);
        document.destroy();
    });
    it('1041589 direct Page resolves indirect Type before invalid Kids handling', () => {
        const document: PdfDocument = new PdfDocument();
        const catalog: any = document._catalog;
        const originalKids: any =
            catalog._topPagesDictionary.getRaw('Kids');
        const originalCount: any =
            catalog._topPagesDictionary.getRaw('Count');
        const typeReference: _PdfReference =
            document._crossReference._getNextReference();
        const pageDictionary: _PdfDictionary = new _PdfDictionary(
            document._crossReference
        );
        document._crossReference._cacheMap.set(
            typeReference,
            new _PdfName('Page')
        );
        pageDictionary.update('Type', typeReference);
        pageDictionary.update(
            'Kids',
            new _PdfName('InvalidKids')
        );
        catalog._topPagesDictionary.update(
            'Kids',
            [pageDictionary]
        );
        catalog._topPagesDictionary.update('Count', 1);
        const result: any =
            catalog._traverseFromRoot(0);
        expect(result).toBeDefined();
        expect(result.dictionary).toBe(pageDictionary);
        expect(result.reference).toBeNull();
        catalog._topPagesDictionary.update('Kids', originalKids);
        catalog._topPagesDictionary.update('Count', originalCount);
        document.destroy();
    });
});
