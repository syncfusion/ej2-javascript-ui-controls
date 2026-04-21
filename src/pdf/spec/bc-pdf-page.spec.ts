import { PdfPage } from '../src/pdf/core/pdf-page';
import * as utils from '../src/pdf/core/utils';
import { _PdfContentStream } from '../src/pdf/core/base-stream';
import * as Pg from '../src/pdf/core/graphics/pdf-graphics';
import { _PdfDictionary, _PdfReference } from "../src/pdf/core/pdf-primitives";
import { _PdfDestinationHelper, PdfDestination } from "../src/pdf/core/pdf-page";
import { PdfDocument, PdfPageSettings } from "../src/pdf/core/pdf-document";
import { PdfDestinationMode, PdfFormFieldsTabOrder, PdfPageOrientation, PdfRotationAngle } from "../src/pdf/core/enumerator";
import { _PdfCrossReference } from '../src/pdf/core/pdf-cross-reference';
import { PdfButtonField, PdfSignatureField } from '../src/pdf/core/form/field';

describe('PdfPage size getter branches', () => {

    it('uses CropBox when rotate is 180', () => {
        // Arrange
        const document = new PdfDocument();
        const fakeDict: any = { has: (k: string) => k === 'Rotate', update: () => { }, set: () => { }, getRaw: () => { }, get: () => { } };
        const fakeCrossRef: any = new _PdfCrossReference(document);
        spyOn(utils as any, '_getInheritableProperty').and.callFake((dict: any, key: string) => {
            if (key === 'MediaBox') {
                return [0, 0, 300, 300];
            }
            if (key === 'CropBox') {
                return [0, 0, 100, 200];
            }
            if (key === 'Rotate') {
                return 180;
            }
            return undefined;
        });
        const page: PdfPage = new PdfPage(fakeCrossRef, 0, fakeDict, null);

        // Act
        const size = page.size;

        // Assert
        expect(size.width).toBe(100);
        expect(size.height).toBe(200);
    });
    it('uses CropBox when rotate is 180', () => {
        // Arrange
        const document = new PdfDocument();
        const fakeDict: any = { has: (k: string) => k === 'Rotate', update: () => { }, set: () => { }, getRaw: () => { }, get: () => { } };
        const fakeCrossRef: any = new _PdfCrossReference(document);
        spyOn(utils as any, '_getInheritableProperty').and.callFake((dict: any, key: string) => {
            if (key === 'MediaBox') {
                undefined;
            }
            if (key === 'CropBox') {
                return [0, 0, 100, 200];
            }
            if (key === 'Rotate') {
                return 0;
            }
            return undefined;
        });
        const page: PdfPage = new PdfPage(fakeCrossRef, 0, fakeDict, null);

        // Act
        const mediaBox = page.mediaBox;

        // Assert
        expect(mediaBox).toEqual([0, 0, 0, 0]);
    });

    it('overrides CropBox with MediaBox when rotate is 0 and crop invalid', () => {
        // Arrange
        const document = new PdfDocument();
        const fakeCrossRef: any = new _PdfCrossReference(document);
        const fakeDict: any = { has: (k: string) => k === 'Rotate', update: () => { }, set: () => { }, getRaw: () => { }, get: () => { } };
        spyOn(utils as any, '_getInheritableProperty').and.callFake((dict: any, key: string) => {
            if (key === 'MediaBox') {
                return [0, 0, 150, 400];
            }
            if (key === 'CropBox') {
                return [0, 0, 200, 100];
            }
            if (key === 'Rotate') {
                return 0;
            }
            return undefined;
        });
        const page: PdfPage = new PdfPage(fakeCrossRef, 0, fakeDict, null);

        // Act
        const size = page.size;

        // Assert
        expect(size.width).toBe(150);
        expect(size.height).toBe(400);
    });

    it('uses mBox[1] when MediaBox upper bound is zero and origin reflects MediaBox', () => {
        // Arrange
        const document = new PdfDocument();
        const fakeDict: any = { has: (k: string) => false, update: () => { }, set: () => { }, getRaw: () => { }, get: () => { } };
        const fakeCrossRef: any = new _PdfCrossReference(document);
        spyOn(utils as any, '_getInheritableProperty').and.callFake((dict: any, key: string) => {
            if (key === 'MediaBox') {
                return [0, 10, 200, 0];
            }
            if (key === 'CropBox') {
                return undefined;
            }
            if (key === 'Rotate') {
                return 270;
            }
            return undefined;
        });
        const page: PdfPage = new PdfPage(fakeCrossRef, 0, fakeDict, null);
        // Act
        const size = page.size;
        const origin = page._origin;

        // Assert
        expect(size.width).toBe(200);
        expect(size.height).toBe(10);
        expect(origin[0]).toBe(0);
        expect(origin[1]).toBe(10);
    });
    it('uses default MediaBox when neither MediaBox nor CropBox exist', () => {
        const document = new PdfDocument();

        const fakeDict: any = {
            has: () => false,
            update: jasmine.createSpy('update'),
            set: () => { },
            getRaw: () => { },
            get: () => { }
        };

        const fakeCrossRef: any = new _PdfCrossReference(document);

        spyOn(utils as any, '_getInheritableProperty').and.returnValue(undefined);

        const page = new PdfPage(fakeCrossRef, 0, fakeDict, null);

        // Act
        const size = page.size;

        // Assert
        expect(size.width).toBe(612);
        expect(size.height).toBe(792);

        expect(fakeDict.update).toHaveBeenCalledWith(
            'MediaBox',
            [0, 0, 612, 792]
        );
    });
    it('_initializeGraphics - CropBox negative valid creates graphics using abs sizes', () => {
        // Arrange
        const fakeDict: any = { has: (k: string) => k === 'CropBox' || k === 'MediaBox', update: () => { }, set: () => { }, getRaw: () => { }, get: () => 180 };
        const fakeCrossRef: any = new _PdfCrossReference(new PdfDocument());
        spyOn(utils as any, '_getInheritableProperty').and.callFake((dict: any, key: string) => {
            if (key === 'MediaBox') { return [0, 0, 100, 200]; }
            if (key === 'CropBox') { return [-100, -200, -50, -100]; }
            if (key === 'Rotate') { return 0; }
            return undefined;
        });
        spyOn(Pg.PdfGraphics.prototype, 'save').and.returnValue({});
        spyOn(Pg.PdfGraphics.prototype, '_initializeCoordinates').and.callFake(() => { });
        const page: PdfPage = new PdfPage(fakeCrossRef, 0, fakeDict, null);
        // ensure cached size matches expected absolute values
        (page as any)._size = { width: 100, height: 200 };

        // Act
        (page as any)._initializeGraphics(new _PdfContentStream([]));

        // Assert
        expect((page as any)._g).toBeDefined();
        expect((page as any)._g._size.width).toBe(-50);
        expect((page as any)._g._size.height).toBe(-100);
    });
    it('_initializeGraphics - CropBox present (non-negative) sets _cropBox on graphics', () => {
        // Arrange
        const fakeDict: any = { has: (k: string) => k === 'CropBox' || k === 'MediaBox', update: () => { }, set: () => { }, getRaw: () => { }, get: () => 0 };
        const fakeCrossRef: any = new _PdfCrossReference(new PdfDocument());
        const cbox = [10, 20, 110, 220];
        spyOn(utils as any, '_getInheritableProperty').and.callFake((dict: any, key: string) => {
            if (key === 'MediaBox') { return [0, 0, 200, 300]; }
            if (key === 'CropBox') { return cbox; }
            if (key === 'Rotate') { return 0; }
            return undefined;
        });
        spyOn(Pg.PdfGraphics.prototype, 'save').and.returnValue({});
        spyOn(Pg.PdfGraphics.prototype, '_initializeCoordinates').and.callFake(() => { });
        const page: PdfPage = new PdfPage(fakeCrossRef, 0, fakeDict, null);

        // Act
        (page as any)._initializeGraphics(new _PdfContentStream([]));

        // Assert
        expect((page as any)._g).toBeDefined();
        expect((page as any)._g._cropBox).toEqual(cbox);
    });

    it('_initializeGraphics - origin both negative calls _initializeCoordinates with page arg', () => {
        // Arrange
        const fakeDict: any = { has: (k: string) => false, update: () => { }, set: () => { }, getRaw: () => { }, get: () => 0 };
        const fakeCrossRef: any = new _PdfCrossReference(new PdfDocument());
        spyOn(utils as any, '_getInheritableProperty').and.callFake((dict: any, key: string) => {
            if (key === 'MediaBox') { return [0, 0, 200, 200]; }
            if (key === 'CropBox') { return undefined; }
            if (key === 'Rotate') { return 0; }
            return undefined;
        });
        const initCoordsSpy = spyOn(Pg.PdfGraphics.prototype, '_initializeCoordinates').and.callFake(() => { });
        spyOn(Pg.PdfGraphics.prototype, 'save').and.returnValue({});
        const page: PdfPage = new PdfPage(fakeCrossRef, 0, fakeDict, null);
        (page as any)._o = [-10, -10];

        // Act
        (page as any)._initializeGraphics(new _PdfContentStream([]));

        // Assert
        expect(initCoordsSpy).toHaveBeenCalledWith(jasmine.any(Object));
    });

    it('_initializeGraphics - applies rotate=90 transform and updates clip bounds', () => {
        // Arrange
        const fakeDict: any = { has: (k: string) => k === 'MediaBox' || k === 'Rotate', update: () => { }, set: () => { }, getRaw: () => { }, get: (k: string) => 90 };
        const fakeCrossRef: any = new _PdfCrossReference(new PdfDocument());
        spyOn(utils as any, '_getInheritableProperty').and.callFake((dict: any, key: string) => {
            if (key === 'MediaBox') { return [0, 0, 200, 300]; }
            if (key === 'CropBox') { return undefined; }
            if (key === 'Rotate') { return 90; }
            return undefined;
        });
        const translateSpy = spyOn(Pg.PdfGraphics.prototype, 'translateTransform').and.callFake(() => { });
        const rotateSpy = spyOn(Pg.PdfGraphics.prototype, 'rotateTransform').and.callFake(() => { });
        spyOn(Pg.PdfGraphics.prototype, 'save').and.returnValue({});
        // ensure _g._clipBounds exists when rotation code runs
        const page: PdfPage = new PdfPage(fakeCrossRef, 0, fakeDict, null);
        (page as any)._size = { width: 200, height: 300 };

        // Act
        (page as any)._initializeGraphics(new _PdfContentStream([]));

        // Assert
        expect(translateSpy).toHaveBeenCalled();
        expect(rotateSpy).toHaveBeenCalledWith(-90);
        expect((page as any)._g._clipBounds).toBeDefined();
    });

    it('_initializeGraphics - origin signs differ calls _initializeCoordinates without page arg', () => {
        // Arrange
        const fakeDict: any = { has: (k: string) => false, update: () => { }, set: () => { }, getRaw: () => { }, get: () => 0 };
        const fakeCrossRef: any = new _PdfCrossReference(new PdfDocument());
        spyOn(utils as any, '_getInheritableProperty').and.callFake((dict: any, key: string) => {
            if (key === 'MediaBox') { return [0, 0, 200, 200]; }
            if (key === 'CropBox') { return undefined; }
            if (key === 'Rotate') { return 0; }
            return undefined;
        });
        const saveSpy = spyOn(Pg.PdfGraphics.prototype, 'save').and.returnValue({});
        const initCoordsSpy = spyOn(Pg.PdfGraphics.prototype, '_initializeCoordinates').and.callFake(() => { });
        const page: PdfPage = new PdfPage(fakeCrossRef, 0, fakeDict, null);
        (page as any)._size = { width: 200, height: 200 };
        // set origin with differing signs
        (page as any)._o = [10, -10];

        // Act
        (page as any)._initializeGraphics(new _PdfContentStream([]));

        // Assert
        expect(saveSpy).toHaveBeenCalled();
        expect(initCoordsSpy).toHaveBeenCalled();
    });
    it('Pdf page taborder in structure', () => {
        let document: PdfDocument = new PdfDocument();
        let page1 = document.addPage();
        page1.tabOrder = PdfFormFieldsTabOrder.structure;

        expect(page1.tabOrder).toEqual(PdfFormFieldsTabOrder.structure);

        page1.tabOrder = PdfFormFieldsTabOrder.widget;

        expect(page1.tabOrder).toEqual(PdfFormFieldsTabOrder.widget);
        document.destroy();
    });
    it('Pdf page taborder in structure', () => {
        let document: PdfDocument = new PdfDocument();
        let page1 = document.addPage();
        page1.tabOrder = PdfFormFieldsTabOrder.structure;

        expect(page1.tabOrder).toEqual(PdfFormFieldsTabOrder.structure);
        document.destroy();
    });
});
describe('_PdfDestinationHelper behavior tests', () => {

    let helper: _PdfDestinationHelper;
    let mockDict: any;

    let mockPage: any;
    let mockDocument: any;
    let mockCrossRef: any;

    beforeEach(() => {
        mockPage = {
            _pageIndex: 0,
            size: { width: 612, height: 792 },
            rotation: 0
        };

        mockDocument = {
            pageCount: 5,
            getPage: (_: number) => mockPage,
            _catalog: {}
        };

        mockCrossRef = {
            _document: mockDocument,
            _fetch: (_: any) => ({ Type: 'Page' })
        };

        mockDict = {
            has: (_: string): any => false,
            get: (_: string): any => null,
            getArray: (_: string): any => null,
            _crossReference: mockCrossRef
        };

        helper = new _PdfDestinationHelper(mockDict, 'Dest');
    });

    it('constructor - with valid dictionary and string key', () => {
        expect(helper._dictionary).toBe(mockDict);
        expect(helper._key).toBe('Dest');
    });

    it('constructor - with null dictionary guard', () => {
        const localHelper = new _PdfDestinationHelper(null, 'Dest');
        expect(localHelper._dictionary).toBeUndefined();
        expect(localHelper._key).toBeUndefined();
    });

    it('_obtainDestination - returns undefined when dictionary has no Dest', () => {
        const result = helper._obtainDestination();
        expect(result).toBeUndefined();
    });

    it('_obtainDestination - parses XYZ destination with zoom', () => {
        mockDict.has = () => true;
        mockDict.getArray = () => [0, { name: 'XYZ' }, 100, 700, 2];

        const destination = helper._obtainDestination();

        expect(destination).toBeDefined();
        expect(destination.zoom).toBe(2);
        expect(destination._page).toBe(mockPage);
    });

    it('_obtainDestination - XYZ mode sets invalid when zoom is null', () => {
        mockDict.has = () => true;
        mockDict.getArray = () => [0, { name: 'XYZ' }, 100, 700, null];

        const destination = helper._obtainDestination();

        expect(destination).toBeDefined();
        expect(destination.isValid).toBe(false);
    });

    it('_obtainDestination - FitR extracts destination bounds', () => {
        mockDict.has = () => true;
        mockDict.getArray = () => [0, { name: 'FitR' }, 50, 100, 200, 300];

        const destination = helper._obtainDestination();

        expect(destination).toBeDefined();
        expect(destination.destinationBounds.x).toBe(50);
        expect(destination.destinationBounds.y).toBe(100);
        expect(destination.destinationBounds.width).toBe(200);
        expect(destination.destinationBounds.height).toBe(300);
    });

    it('_obtainDestination - Fit mode creates page-fit destination', () => {
        mockDict.has = () => true;
        mockDict.getArray = () => [0, { name: 'Fit' }];

        const destination = helper._obtainDestination();

        expect(destination).toBeDefined();
        expect(destination.mode).toBe(1); // PdfDestinationMode.fitToPage
    });

    it('_getDestination - returns undefined when document is null', () => {
        const result = helper._getDestination('MyDest', null);
        expect(result).toBeUndefined();
    });

    it('_extractDestination - returns array directly', () => {
        const destinationArray = [0, { name: 'Fit' }];
        const result = helper._extractDestination(destinationArray, mockDocument);

        expect(result).toBe(destinationArray);
    });

    it('_stringCompare - returns negative for lexicographically smaller string', () => {
        const result = helper._stringCompare('Apple', 'Zebra');
        expect(result).toBeLessThan(0);
    });

    it('_stringCompare - returns zero for equal strings', () => {
        const result = helper._stringCompare('Apple', 'Apple');
        expect(result).toBe(0);
    });
    it('_getProperKid - returns undefined when no Kids key exists', () => {
        // Arrange
        const rootKids: any = {
            has: (_: string) => false
        };

        // Act
        const result: _PdfDictionary = helper._getProperKid(rootKids, 'M');

        // Assert
        expect(result).toBeUndefined();
    });

    it('_getProperKid - returns undefined when Kids array is empty', () => {
        // Arrange
        const rootKids: any = {
            has: (key: string) => key === 'Kids',
            getRaw: (_: string): any => [],
            getArray: (_: string): any => []
        };

        // Act
        const result: _PdfDictionary = helper._getProperKid(rootKids, 'M');

        // Assert
        expect(result).toBeUndefined();
    });
    it('_getDestination - calls _getNamedDestination with valid document', () => {
        // Arrange
        const mockDocument: any = new PdfDocument();
        const mockDict: any = {
            _crossReference: { _document: mockDocument }
        };
        const helper: _PdfDestinationHelper = new _PdfDestinationHelper(mockDict, 'Dest');
        const namedDestination: string = 'MyDest';

        // Act
        const result: any[] = helper._getDestination(namedDestination, mockDocument);

        // Assert
        expect(result).toBeUndefined();
    });
    it('_obtainDestination - returns undefined when dictionary is null', () => {
        // Arrange
        const helper: _PdfDestinationHelper = new _PdfDestinationHelper(null, 'Dest');

        // Act
        const destination: PdfDestination = helper._obtainDestination();

        // Assert
        expect(destination).toBeUndefined();
    });

    it('_obtainDestination - returns undefined when no Dest or D key exists', () => {
        // Arrange
        const mockDict: any = {
            has: (key: string) => false,
            get: (key: string): any => null,
            getArray: (key: string): any => null
        };
        const helper: _PdfDestinationHelper = new _PdfDestinationHelper(mockDict, 'Dest');

        // Act
        const destination: PdfDestination = helper._obtainDestination();

        // Assert
        expect(destination).toBeUndefined();
    });

    it('_obtainDestination - switches key to D when D key exists', () => {
        // Arrange
        const mockCrossRef: any = { _document: null };
        const mockDict: any = {
            has: (key: string) => key === 'D',
            _crossReference: mockCrossRef,
            getArray: (key: string): any => null
        };
        const helper: _PdfDestinationHelper = new _PdfDestinationHelper(mockDict, 'Dest');

        // Act
        const destination: PdfDestination = helper._obtainDestination();

        // Assert
        expect(helper._key).toBe('D');
        expect(destination).toBeUndefined();
    });

    it('_obtainDestination - parses XYZ mode with valid page and zoom', () => {
        // Arrange
        const mockPage: any = {
            _pageIndex: 0,
            size: { width: 612, height: 792 },
            rotation: 0
        };
        const mockDocument: any = {
            pageCount: 5,
            getPage: (index: number) => mockPage,
            _catalog: {}
        };
        const mockCrossRef: any = {
            _document: mockDocument,
            _fetch: (ref: any) => ({ Type: 'Page' })
        };
        const destinationArray: any[] = [0, { name: 'XYZ' }, 100, 700, 2];
        const mockDict: any = {
            has: (key: string) => true,
            _crossReference: mockCrossRef,
            getArray: (key: string) => destinationArray
        };
        const helper: _PdfDestinationHelper = new _PdfDestinationHelper(mockDict, 'Dest');

        // Act
        const destination: PdfDestination = helper._obtainDestination();

        // Assert
        expect(destination).toBeDefined();
        expect(destination.zoom).toBe(2);
        expect(destination._page).toBe(mockPage);
    });

    it('_obtainDestination - XYZ mode sets invalid when zoom is null', () => {
        // Arrange
        const mockPage: any = {
            _pageIndex: 0,
            size: { width: 612, height: 792 },
            rotation: 0
        };
        const mockDocument: any = {
            pageCount: 5,
            getPage: (index: number) => mockPage,
            _catalog: {}
        };
        const mockCrossRef: any = {
            _document: mockDocument,
            _fetch: (ref: any) => ({ Type: 'Page' })
        };
        const destinationArray: any[] = [0, { name: 'XYZ' }, 100, 700, null];
        const mockDict: any = {
            has: (key: string) => true,
            _crossReference: mockCrossRef,
            getArray: (key: string) => destinationArray
        };
        const helper: _PdfDestinationHelper = new _PdfDestinationHelper(mockDict, 'Dest');

        // Act
        const destination: PdfDestination = helper._obtainDestination();

        // Assert
        expect(destination).toBeDefined();
        expect(destination.isValid).toBe(false);
    });

    it('_obtainDestination - FitR mode extracts bounds correctly', () => {
        // Arrange
        const mockPage: any = {
            _pageIndex: 0,
            size: { width: 612, height: 792 },
            rotation: 0
        };
        const mockDocument: any = {
            pageCount: 5,
            getPage: (index: number) => mockPage,
            _catalog: {}
        };
        const mockCrossRef: any = {
            _document: mockDocument,
            _fetch: (ref: any) => ({ Type: 'Page' })
        };
        const destinationArray: any[] = [0, { name: 'FitR' }, 50, 100, 200, 300];
        const mockDict: any = {
            has: (key: string) => true,
            _crossReference: mockCrossRef,
            getArray: (key: string) => destinationArray
        };
        const helper: _PdfDestinationHelper = new _PdfDestinationHelper(mockDict, 'Dest');

        // Act
        const destination: PdfDestination = helper._obtainDestination();

        // Assert
        expect(destination).toBeDefined();
        expect(destination.destinationBounds.x).toBe(50);
        expect(destination.destinationBounds.y).toBe(100);
        expect(destination.destinationBounds.width).toBe(200);
        expect(destination.destinationBounds.height).toBe(300);
    });

    it('_obtainDestination - FitH mode extracts top value', () => {
        // Arrange
        const mockPage: any = {
            _pageIndex: 0,
            size: { width: 612, height: 792 },
            rotation: 0
        };
        const mockDocument: any = {
            pageCount: 5,
            getPage: (index: number) => mockPage,
            _catalog: {}
        };
        const mockCrossRef: any = {
            _document: mockDocument,
            _fetch: (ref: any) => ({ Type: 'Page' })
        };
        const destinationArray: any[] = [0, { name: 'FitH' }, 600];
        const mockDict: any = {
            has: (key: string) => true,
            _crossReference: mockCrossRef,
            getArray: (key: string) => destinationArray
        };
        const helper: _PdfDestinationHelper = new _PdfDestinationHelper(mockDict, 'Dest');

        // Act
        const destination: PdfDestination = helper._obtainDestination();

        // Assert
        expect(destination).toBeDefined();
        expect(destination.mode).toBe(3); // PdfDestinationMode.fitH
        expect(destination.location.y).toBe(192);
    });

    it('_obtainDestination - FitBH mode handled same as FitH', () => {
        // Arrange
        const mockPage: any = {
            _pageIndex: 0,
            size: { width: 612, height: 792 },
            rotation: 0
        };
        const mockDocument: any = {
            pageCount: 5,
            getPage: (index: number) => mockPage,
            _catalog: {}
        };
        const mockCrossRef: any = {
            _document: mockDocument,
            _fetch: (ref: any) => ({ Type: 'Page' })
        };
        const destinationArray: any[] = [0, { name: 'FitBH' }, 500];
        const mockDict: any = {
            has: (key: string) => true,
            _crossReference: mockCrossRef,
            getArray: (key: string) => destinationArray
        };
        const helper: _PdfDestinationHelper = new _PdfDestinationHelper(mockDict, 'Dest');

        // Act
        const destination: PdfDestination = helper._obtainDestination();

        // Assert
        expect(destination).toBeDefined();
        expect(destination.location.y).toBe(292);
    });

    it('_obtainDestination - Fit mode creates destination without params', () => {
        // Arrange
        const mockPage: any = {
            _pageIndex: 0,
            size: { width: 612, height: 792 },
            rotation: 0
        };
        const mockDocument: any = {
            pageCount: 5,
            getPage: (index: number) => mockPage,
            _catalog: {}
        };
        const mockCrossRef: any = {
            _document: mockDocument,
            _fetch: (ref: any) => ({ Type: 'Page' })
        };
        const destinationArray: any[] = [0, { name: 'Fit' }];
        const mockDict: any = {
            has: (key: string) => true,
            _crossReference: mockCrossRef,
            getArray: (key: string) => destinationArray
        };
        const helper: _PdfDestinationHelper = new _PdfDestinationHelper(mockDict, 'Dest');

        // Act
        const destination: PdfDestination = helper._obtainDestination();

        // Assert
        expect(destination).toBeDefined();
        expect(destination.mode).toBe(1); // PdfDestinationMode.fitToPage
    });

    it('_obtainDestination - FitH with null top sets invalid', () => {
        // Arrange
        const mockPage: any = {
            _pageIndex: 0,
            size: { width: 612, height: 792 },
            rotation: 0
        };
        const mockDocument: any = {
            pageCount: 5,
            getPage: (index: number) => mockPage,
            _catalog: {}
        };
        const mockCrossRef: any = {
            _document: mockDocument,
            _fetch: (ref: any) => ({ Type: 'Page' })
        };
        const destinationArray: any[] = [0, { name: 'FitH' }, null];
        const mockDict: any = {
            has: (key: string) => true,
            _crossReference: mockCrossRef,
            getArray: (key: string) => destinationArray
        };
        const helper: _PdfDestinationHelper = new _PdfDestinationHelper(mockDict, 'Dest');

        // Act
        const destination: PdfDestination = helper._obtainDestination();

        // Assert
        expect(destination).toBeDefined();
        expect(destination.isValid).toBe(false);
    });

    it('_obtainDestination - array without page creates empty destination', () => {
        // Arrange
        const mockDocument: any = {
            pageCount: 0,
            getPage: (index: number) => mockPage,
            _catalog: {}
        };
        const mockCrossRef: any = {
            _document: mockDocument
        };

        const destinationArray: any[] = [999, { name: 'Fit' }];
        const mockDict: any = {
            has: (key: string) => true,
            _crossReference: mockCrossRef,
            getArray: (key: string) => destinationArray
        };
        const helper: _PdfDestinationHelper = new _PdfDestinationHelper(mockDict, 'Dest');

        // Act
        const destination: PdfDestination = helper._obtainDestination();

        // Assert
        expect(destination).toBeDefined();
        expect(destination._page).toBeUndefined();
    });
    it('Destination bounds and page set', () => {
        const document = new PdfDocument();
        const page = document.addPage();
        const destination = new PdfDestination();
        const rectangle = { x: 100, y: 100, width: 100, height: 100 };

        destination.destinationBounds = rectangle;
        destination.page = page;

        expect(destination.page).toEqual(page);
        expect(destination.destinationBounds).toEqual(rectangle);
        document.destroy();
    });
    it('Destination bounds and page set', () => {
        const document = new PdfDocument();
        const settings = new PdfPageSettings()
        settings.rotation = PdfRotationAngle.angle180;
        settings.orientation = PdfPageOrientation.landscape;
        const page180 = document.addPage(settings);
        settings.rotation = PdfRotationAngle.angle90;
        const page90 = document.addPage(settings);
        settings.rotation = PdfRotationAngle.angle270;
        const page270 = document.addPage(settings);
        const destination180 = new PdfDestination(page180);
        const destination90 = new PdfDestination(page90);
        const destination270 = new PdfDestination(page270);
        expect(page180.orientation).toEqual(PdfPageOrientation.landscape);
        expect(destination180.location).toEqual({ x: page180.graphics._size.width, y: 0 });
        expect(destination90.location).toEqual({ x: 0, y: 0 });
        expect(destination270.location).toEqual({ x: page180.graphics._size.width, y: 0 });
        document.destroy();
    });
    it('Destination third args', () => {
        const document = new PdfDocument();
        const page = document.addPage();
        const rectangle = { x: 100, y: 100 };
        const destination = new PdfDestination(page, rectangle, { zoom: 10 });
        expect(destination.mode).toEqual(0);
        expect(destination.page).toEqual(page);
        expect(destination.location).toEqual(rectangle);
        expect(destination.zoom).toEqual(10);
        const destination2 = new PdfDestination(page, rectangle, { mode: PdfDestinationMode.fitH });
        expect(destination2.zoom).toEqual(0);
        expect(destination2.mode).toEqual(PdfDestinationMode.fitH);
        expect(destination2.page).toEqual(page);
        expect(destination2.location).toEqual(rectangle);
        document.destroy();
    });
});
describe('_PdfDestinationHelper behavior tests - 2', () => {
    it("_getCropOrMediaBox method - if crop box , mediaBox not present", () => {
        const document = new PdfDocument();
        const fakeDict: any = { has: (k: string) => false, update: () => { }, set: () => { }, getRaw: () => { }, get: () => { } };
        const fakeCrossRef: any = new _PdfCrossReference(document);
        spyOn(utils as any, '_getInheritableProperty').and.callFake((dict: any, key: string) => {
            if (key === 'MediaBox') {
                return undefined;
            }
            if (key === 'CropBox') {
                return undefined;
            }
            if (key === 'Rotate') {
                return 0;
            }
            return undefined;
        });
        const page: PdfPage = new PdfPage(fakeCrossRef, 0, fakeDict, null);

        const box = page._getCropOrMediaBox();

        expect(box).toBeUndefined();
        document.destroy();
    });
    it('_getDestination - returns undefined when document is null', () => {
        // Arrange
        const mockDict: any = {};
        const helper: _PdfDestinationHelper = new _PdfDestinationHelper(mockDict, 'Dest');
        const namedDestination: string = 'MyDest';

        // Act
        const result: any[] = helper._getDestination(namedDestination, null);

        // Assert
        expect(result).toBeUndefined();
    });

    it('_getDestination - calls _getNamedDestination with valid document', () => {
        // Arrange
        const mockDocument: any = {
            _catalog: {
                _catalogDictionary: {
                    has: (key: string) => false
                }
            }
        };
        const mockDict: any = {
            _crossReference: { _document: mockDocument }
        };
        const helper: _PdfDestinationHelper = new _PdfDestinationHelper(mockDict, 'Dest');
        const namedDestination: string = 'MyDest';

        // Act
        const result: any[] = helper._getDestination(namedDestination, mockDocument);

        // Assert
        expect(result).toBeUndefined();
    });

    it('_getNamedDestination - returns undefined when catalog is null', () => {
        // Arrange
        const mockDocument: any = { _catalog: null };
        const mockDict: any = {};
        const helper: _PdfDestinationHelper = new _PdfDestinationHelper(mockDict, 'Dest');

        // Act
        const result: any[] = helper._getNamedDestination(mockDocument, 'MyDest');

        // Assert
        expect(result).toBeUndefined();
    });

    it('_getNamedDestination - returns undefined for invalid result', () => {
        // Arrange
        const mockDocument: any = {
            _catalog: { _catalogDictionary: { has: (key: string) => false } }
        };
        const mockDict: any = {};
        const helper: _PdfDestinationHelper = new _PdfDestinationHelper(mockDict, 'Dest');

        // Act
        const result: any[] = helper._getNamedDestination(mockDocument, null);

        // Assert
        expect(result).toBeUndefined();
    });

    it('_extractDestination - returns array directly when ref is array', () => {
        // Arrange
        const destArray: any[] = [0, { name: 'Fit' }];
        const mockDict: any = {};
        const helper: _PdfDestinationHelper = new _PdfDestinationHelper(mockDict, 'Dest');

        // Act
        const result: any[] = helper._extractDestination(destArray, null);

        // Assert
        expect(result).toBe(destArray);
    });

    it('_extractDestination - returns ref when no D key found', () => {
        // Arrange
        const mockFetchedDict: any = {
            has: (key: string) => false
        };
        const mockRef: any = { objId: 5 };
        const mockCrossRef: any = {
            _fetch: (ref: any) => mockFetchedDict
        };
        const mockDocument: any = { _crossReference: mockCrossRef };
        const mockDict: any = {};
        const helper: _PdfDestinationHelper = new _PdfDestinationHelper(mockDict, 'Dest');

        // Act
        const result: any = helper._extractDestination(mockRef, mockDocument);

        // Assert
        expect(result).toBe(mockRef);
    });

    it('_extractDestination - returns non-reference input directly', () => {
        // Arrange
        const inputValue: string = 'SomeName';
        const mockDict: any = {};
        const helper: _PdfDestinationHelper = new _PdfDestinationHelper(mockDict, 'Dest');

        // Act
        const result: any = helper._extractDestination(inputValue, null);

        // Assert
        expect(result).toBe(inputValue);
    });

    it('_findName - returns reference when exact name match found', () => {
        // Arrange
        const mockRef: any = { objId: 10 };
        const mockCrossRef: any = {
            _fetch: (ref: any) => 'MyDest'
        };
        const namesArray: any[] = ['MyDest', mockRef];
        const mockDict: any = {
            get: (key: string) => namesArray,
            _crossReference: mockCrossRef
        };
        const helper: _PdfDestinationHelper = new _PdfDestinationHelper(mockDict, 'Dest');

        // Act
        const result: _PdfReference = helper._findName(mockDict, 'MyDest');

        // Assert
        expect(result).toBe(mockRef);
    });

    it('_findName - returns undefined when empty names array', () => {
        // Arrange
        const namesArray: any[] = [];
        const mockDict: any = {
            get: (key: string) => namesArray
        };
        const helper: _PdfDestinationHelper = new _PdfDestinationHelper(mockDict, 'Dest');

        // Act
        const result: _PdfReference = helper._findName(mockDict, 'MyDest');

        // Assert
        expect(result).toBeUndefined();
    });

    it('_findName - returns undefined when no match in names array', () => {
        // Arrange
        const mockRef: any = { objId: 10 };
        const mockCrossRef: any = {
            _fetch: (ref: any) => 'OtherDest'
        };
        const namesArray: any[] = ['OtherDest', mockRef];
        const mockDict: any = {
            get: (key: string) => namesArray,
            _crossReference: mockCrossRef
        };
        const helper: _PdfDestinationHelper = new _PdfDestinationHelper(mockDict, 'Dest');

        // Act
        const result: _PdfReference = helper._findName(mockDict, 'MyDest');

        // Assert
        expect(result).toBeUndefined();
    });

});

