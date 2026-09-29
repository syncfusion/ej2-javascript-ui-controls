
import {
    PdfDocument,
    PdfPage,
    PdfPath,
    PdfRotationAngle,
    _ContentParser,
    _PdfDictionary,
    _PdfReference
} from '@syncfusion/ej2-pdf';
import { _MatrixHelper } from '../../src/pdf-data-extract/core/text-extraction/matrix-helper';
import { _GraphicState, _TextState } from '../../src/pdf-data-extract/core/graphic-state';
import { _TextProcessingMode } from '../../src/pdf-data-extract/core/enum';
import { PdfDataExtractor } from '../../src/pdf-data-extract/core/pdf-data-extractor';
import { _PdfContentParserHelper } from '../../src/pdf-data-extract/core/content-parser-helper';
import { PdfStructureElement } from '../../src/pdf-data-extract/core/pdf-structure-element';
import { PdfTagType } from '../../src/pdf-data-extract/core/text-extraction/enumerator';
import * as utilsModule from '../../src/pdf-data-extract/core/utils';

describe('PdfDataExtractor strict AAA behavior coverage', () => {
    function createDictionary(values: { [key: string]: unknown }): _PdfDictionary {
        return {
            has: function (key: string): boolean {
                return Object.prototype.hasOwnProperty.call(values, key);
            },
            get: function (key: string): unknown {
                return values[key];
            },
            getArray: function (key: string): unknown {
                return values[key];
            },
            _reference: values._reference
        } as unknown as _PdfDictionary;
    }

    function createPage(pageIndex: number, rotation: PdfRotationAngle, resource?: _PdfDictionary): PdfPage {
        return {
            _pageIndex: pageIndex,
            rotation: rotation,
            size: { width: 200, height: 100 },
            _pageDictionary: createDictionary({
                Resources: resource
            }),
            _combineContent: jasmine.createSpy('_combineContent').and.returnValue(new Uint8Array([1, 2, 3]))
        } as unknown as PdfPage;
    }

    function createDocument(pages: PdfPage[]): PdfDocument {
        return {
            pageCount: pages.length,
            _crossReference: {
                _isDecoderSupport: false
            },
            _catalog: {
                _catalogDictionary: createDictionary({})
            },
            getPage: function (index: number): PdfPage {
                return pages[index];
            }
        } as unknown as PdfDocument;
    }

    
    it('should extract text with options, initialize contentParser, process page range and ignore escape sequences for resultant text', async() => {
        // Arrange
        const page: PdfPage = createPage(0, PdfRotationAngle.angle0);
        const document: PdfDocument = createDocument([page]);
        const extractor: PdfDataExtractor = new PdfDataExtractor(document);
        const processPagesSpy: jasmine.Spy = spyOn(extractor, '_processPdfPages')
        .and.callFake(async (): Promise<void> => {
            extractor._resultantText = 'A\\(B';
        });
        const ignoreEscapeSpy: jasmine.Spy = spyOn(utilsModule, '_ignoreEscapeSequence').and.returnValue('A(B');

        // Act
        const result: string = await extractor.extractText({
            isLayout: true,
            startPageIndex: 0,
            endPageIndex: 0
        });

        // Assert
        expect(processPagesSpy).toHaveBeenCalledWith(0, 0);
        expect(ignoreEscapeSpy).toHaveBeenCalledWith('A\\(B');
        expect(result).toBe('A(B');
        expect(extractor._isLayout).toBeFalsy();
        expect(extractor._contentParser).toBeDefined();
    });

    it('should extract text without options using the default full page range', async() => {
        // Arrange
        const pageOne: PdfPage = createPage(0, PdfRotationAngle.angle0);
        const pageTwo: PdfPage = createPage(1, PdfRotationAngle.angle0);
        const document: PdfDocument = createDocument([pageOne, pageTwo]);
        const extractor: PdfDataExtractor = new PdfDataExtractor(document);

        const processPagesSpy: jasmine.Spy = spyOn(extractor, '_processPdfPages')
        .and.callFake(async (): Promise<void> => {
            extractor._resultantText = 'Text';
        });

        // Act
        const result: string = await extractor.extractText();

        // Assert
        expect(processPagesSpy).toHaveBeenCalledWith(0, 1);
        expect(result).toBe('Text');
        expect(extractor._isLayout).toBeFalsy();
    });

    it('should render text in layout mode', () => {
        // Arrange
        const page: PdfPage = createPage(0, PdfRotationAngle.angle0);
        const document: PdfDocument = createDocument([page]);
        const extractor: PdfDataExtractor = new PdfDataExtractor(document);
        extractor._isLayout = true;

        const recordCollection: object[] = [{ _operator: 'Tj', _operands: ['(A)'] }];
        const getPageRecordCollectionSpy: jasmine.Spy = spyOn(_PdfContentParserHelper.prototype, '_getPageRecordCollection').and.returnValue(recordCollection as never);
        const renderLayoutSpy: jasmine.Spy = spyOn(extractor, '_renderTextAsLayOut').and.stub();

        // Act
        extractor._renderText(page, new Map<string, object>() as never, new Map<string, object>() as never, new _GraphicState());

        // Assert
        expect(getPageRecordCollectionSpy).toHaveBeenCalledWith(page);
        expect(renderLayoutSpy).toHaveBeenCalledWith(recordCollection, page, jasmine.any(Map), jasmine.any(Map));
    });

    it('should render text lines when _isExtractTextLines is true', () => {
        // Arrange
        const page: PdfPage = createPage(0, PdfRotationAngle.angle0);
        const document: PdfDocument = createDocument([page]);
        const extractor: PdfDataExtractor = new PdfDataExtractor(document);
        extractor._isExtractTextLines = true;

        const recordCollection: object[] = [{ _operator: 'TJ', _operands: ['[(A)]'] }];
        const extractedLines: object[] = [{ _text: 'line' }];

        spyOn(_PdfContentParserHelper.prototype, '_getPageRecordCollection').and.returnValue(recordCollection as never);
        const processRecordCollectionSpy: jasmine.Spy = spyOn(_PdfContentParserHelper.prototype, '_processRecordCollection').and.returnValue(extractedLines as never);

        // Act
        extractor._renderText(page, new Map<string, object>() as never, new Map<string, object>() as never, new _GraphicState());

        // Assert
        expect(processRecordCollectionSpy).toHaveBeenCalledWith(
            recordCollection,
            page,
            jasmine.any(Map),
            jasmine.any(Map),
            jasmine.any(_GraphicState)
        );
        expect(extractor._textLine).toBe(extractedLines as never);
    });

    it('should render tagged text lines and then layout when _extractTaggedText is true', () => {
        // Arrange
        const page: PdfPage = createPage(0, PdfRotationAngle.angle0);
        const document: PdfDocument = createDocument([page]);
        const extractor: PdfDataExtractor = new PdfDataExtractor(document);
        extractor._extractTaggedText = true;

        const recordCollection: object[] = [{ _operator: 'Tj', _operands: ['(A)'] }];
        const extractedLines: object[] = [{ _text: 'line' }];

        spyOn(_PdfContentParserHelper.prototype, '_getPageRecordCollection').and.returnValue(recordCollection as never);
        const processRecordCollectionSpy: jasmine.Spy = spyOn(_PdfContentParserHelper.prototype, '_processRecordCollection').and.returnValue(extractedLines as never);
        const renderLayoutSpy: jasmine.Spy = spyOn(extractor, '_renderTextAsLayOut').and.stub();

        // Act
        extractor._renderText(page, new Map<string, object>() as never, new Map<string, object>() as never, new _GraphicState());

        // Assert
        expect(processRecordCollectionSpy).toHaveBeenCalled();
        expect(extractor._textLine).toBe(extractedLines as never);
        expect(renderLayoutSpy).toHaveBeenCalledWith(recordCollection, page, jasmine.any(Map), jasmine.any(Map));
    });

    it('should render plain text into resultantText when neither layout nor line extraction nor tagged mode is enabled', () => {
        // Arrange
        const page: PdfPage = createPage(0, PdfRotationAngle.angle0);
        const document: PdfDocument = createDocument([page]);
        const extractor: PdfDataExtractor = new PdfDataExtractor(document);

        const recordCollection: object[] = [{ _operator: 'Tj', _operands: ['(A)'] }];

        spyOn(_PdfContentParserHelper.prototype, '_getPageRecordCollection').and.returnValue(recordCollection as never);
        const processRecordCollectionSpy: jasmine.Spy = spyOn(_PdfContentParserHelper.prototype, '_processRecordCollection').and.returnValue('Hello' as never);

        // Act
        extractor._renderText(page, new Map<string, object>() as never, new Map<string, object>() as never, new _GraphicState());

        // Assert
        expect(processRecordCollectionSpy).toHaveBeenCalled();
        expect(extractor._resultantText).toBe('Hello');
    });

    it('should extract image collection by delegating record collection and image record processing to contentParser', async () => {
        // Arrange
        const page: PdfPage = createPage(0, PdfRotationAngle.angle0);
        const document: PdfDocument = createDocument([page]);
        const extractor: PdfDataExtractor = new PdfDataExtractor(document);
        extractor._contentParser = new _PdfContentParserHelper(_TextProcessingMode.imageExtraction);

        const recordCollection: object[] = [{ _operator: 'Do', _operands: ['/Im1'] }];
        const imageCollection: object[] = [{ _resourceName: 'Im1' }];

        spyOn(extractor._contentParser, '_getPageRecordCollection').and.returnValue(recordCollection as never);
        const processImageRecordCollectionSpy: jasmine.Spy = spyOn(extractor._contentParser, '_processImageRecordCollection').and.returnValue(Promise.resolve(imageCollection as never));

        // Act
        await extractor._extractImagcollection(
            page,
            new Map<string, object>() as never,
            new Map<string, object>() as never,
            new _GraphicState()
        );

        // Assert
        expect(processImageRecordCollectionSpy).toHaveBeenCalledWith(
            recordCollection,
            page,
            jasmine.any(Map),
            jasmine.any(Map),
            jasmine.any(_GraphicState),
            extractor._canvas
        );
        expect(extractor._imageInfo).toBe(imageCollection as never);
    });

    it('should set text leading, move to next line and update text matrix correctly', () => {
        // Arrange
        const page: PdfPage = createPage(0, PdfRotationAngle.angle0);
        const document: PdfDocument = createDocument([page]);
        const extractor: PdfDataExtractor = new PdfDataExtractor(document);
        extractor._textMatrix = new _MatrixHelper(1, 0, 0, 1, 10, 20);
        extractor._textLineMatrix = new _MatrixHelper(1, 0, 0, 1, 10, 20);
        extractor._fontSize = 10;
        extractor._textHorizontalScaling = 100;

        // Act
        extractor._setTextLeading(12);
        extractor._moveToNextLine(5, -3, extractor._textLineMatrix);
        const updatedMatrix: _MatrixHelper = extractor._updateTextMatrix(120);

        // Assert
        expect(extractor._textLeading).toBe(-12);
        expect(extractor._textLineMatrix._offsetX).not.toBe(10);
        expect(extractor._textMatrix._offsetX).toBe(extractor._textLineMatrix._offsetX);
        expect(updatedMatrix).toBe(extractor._textLineMatrix);
    });

    it('should update text line matrix with and without word spacing', () => {
        // Arrange
        const page: PdfPage = createPage(0, PdfRotationAngle.angle0);
        const document: PdfDocument = createDocument([page]);
        const extractor: PdfDataExtractor = new PdfDataExtractor(document);
        extractor._textLineMatrix = new _MatrixHelper(1, 0, 0, 1, 0, 0);
        extractor._fontSize = 10;
        extractor._characterSpacing = 2;
        extractor._wordSpacing = 5;
        extractor._textHorizontalScaling = 100;

        // Act
        extractor._updateTextLineMatrix('A', 3);
        const afterLetterOffsetX: number = extractor._textLineMatrix._offsetX;
        extractor._updateTextLineMatrix(' ', 3);
        const afterSpaceOffsetX: number = extractor._textLineMatrix._offsetX;

        // Assert
        expect(afterLetterOffsetX).toBeGreaterThan(0);
        expect(afterSpaceOffsetX).toBeGreaterThan(afterLetterOffsetX);
    });

    it('should multiply affine matrices and compute type3 text height and rendering matrix', () => {
        // Arrange
        const page: PdfPage = createPage(0, PdfRotationAngle.angle0);
        const document: PdfDocument = createDocument([page]);
        const extractor: PdfDataExtractor = new PdfDataExtractor(document);
        extractor._fontSize = 1;
        extractor._textHorizontalScaling = 100;
        extractor._arise = 0;
        extractor._ctm = new _MatrixHelper(1, 0, 0, 1, 0, 0);
        extractor._textLineMatrix = new _MatrixHelper(1, 0, 0, 1, 4, 5);

        const font: {
            _fontMatrix: number[];
            _boundingBox: number[];
        } = {
            _fontMatrix: [0.002, 0, 0, 0.003, 0, 0],
            _boundingBox: [0, 0, 0, 10]
        };

        // Act
        const transformResult: number[] = extractor._transform(
            [1, 0, 0, 1, 2, 3],
            [2, 0, 0, 2, 4, 5]
        );
        const height: number = extractor._getTextHeight(font as never, new _MatrixHelper(1, 0, 0, 1, 0, 0));
        const textRenderingMatrix: _MatrixHelper = extractor._getTextRenderingMatrix();

        // Assert
        expect(transformResult).toEqual([2, 0, 0, 2, 6, 8]);
        expect(height).toBeGreaterThan(0);
        expect(textRenderingMatrix._offsetX).toBe(4);
        expect(textRenderingMatrix._offsetY).toBe(6);
    });

    it('should render font by extracting current font name and the following font size', () => {
        // Arrange
        const page: PdfPage = createPage(0, PdfRotationAngle.angle0);
        const document: PdfDocument = createDocument([page]);
        const extractor: PdfDataExtractor = new PdfDataExtractor(document);

        // Act
        extractor._renderFont(['1', '/F1', '12']);

        // Assert
        expect(extractor._currentFont).toBe('F1');
        expect(extractor._fontSize).toBe(12);
    });

it('should extract text lines with default and explicit page ranges', async () => {
    // Arrange
    const pageOne: PdfPage = createPage(0, PdfRotationAngle.angle0);
    const pageTwo: PdfPage = createPage(1, PdfRotationAngle.angle0);
    const document: PdfDocument = createDocument([pageOne, pageTwo]);
    const extractor: PdfDataExtractor = new PdfDataExtractor(document);

    const expectedLines = [{ _text: 'line' }] as never;

    const processPagesSpy: jasmine.Spy = spyOn(extractor, '_processPdfPages')
        .and.callFake(async (): Promise<void> => {
            extractor._textLine = expectedLines;
        });

    // Act
    const explicitResult = await extractor.extractTextLines({
        startPageIndex: 0,
        endPageIndex: 1
    });

    const defaultResult = await extractor.extractTextLines();

    // Assert
    expect(processPagesSpy).toHaveBeenCalledTimes(2);
    expect(processPagesSpy.calls.allArgs()).toEqual([
        [0, 1],
        [0, 1]
    ]);

    expect(explicitResult).toEqual(expectedLines);
    expect(defaultResult).toEqual(expectedLines);
    //WSexpect(extractor._isExtractTextLines).toBeFalse();
});

    it('should extract images with defaults, options and rotation/resource processing', async () => {
        // Arrange
        const resourceReference: { toString: () => string } = {
            toString: function (): string {
                return 'resource-1';
            }
        };
        const resourceDictionary: _PdfDictionary = createDictionary({
            _reference: resourceReference
        });
        const rotatedPage: PdfPage = createPage(0, PdfRotationAngle.angle90, resourceDictionary);
        const document: PdfDocument = createDocument([rotatedPage]);
        const extractor: PdfDataExtractor = new PdfDataExtractor(document);
        const imageInfo: object[] = [{ _resourceName: 'Image1' }];

        const extractImageCollectionSpy: jasmine.Spy = spyOn(extractor, '_extractImagcollection').and.returnValue(Promise.resolve(undefined));
        spyOn(utilsModule, '_getXObjectResources').and.returnValue(new Map<string, object>([['Im1', {}]]) as never);
        extractor._imageInfo = imageInfo as never;

        // Act
        const result: object[] = await extractor.extractImages({
            startPageIndex: 0,
            endPageIndex: 0
        }) as object[];

        // Assert
        expect((document as unknown as { _crossReference: { _isDecoderSupport: boolean } })._crossReference._isDecoderSupport).toBeTruthy();
        expect(extractImageCollectionSpy).toHaveBeenCalledWith(
            rotatedPage,
            undefined as never,
            jasmine.any(Map),
            jasmine.any(_GraphicState)
        );
        expect(result).toBe(imageInfo as never);
        expect(extractor._isRotatePage).toBeFalsy();
    });

    it('should process pages using caches and render text only when resources exist', () => {
        // Arrange
        const resourceReference: { toString: () => string } = {
            toString: function (): string {
                return 'resource-id';
            }
        };
        const resourceDictionary: _PdfDictionary = createDictionary({
            _reference: resourceReference
        });
        const pageOne: PdfPage = createPage(0, PdfRotationAngle.angle90, resourceDictionary);
        const pageTwo: PdfPage = createPage(1, PdfRotationAngle.angle90, resourceDictionary);
        const document: PdfDocument = createDocument([pageOne, pageTwo]);
        const extractor: PdfDataExtractor = new PdfDataExtractor(document);

        const addFontResourcesSpy: jasmine.Spy = spyOn(utilsModule, '_addFontResources').and.returnValue(new Map<string, object>([['F1', {}]]) as never);
        const getXObjectResourcesSpy: jasmine.Spy = spyOn(utilsModule, '_getXObjectResources').and.returnValue(new Map<string, object>([['X1', {}]]) as never);
        const renderTextSpy: jasmine.Spy = spyOn(extractor, '_renderText').and.stub();

        // Act
        extractor._processPages(0, 1);

        // Assert
        expect(addFontResourcesSpy.calls.count()).toBe(1);
        expect(getXObjectResourcesSpy.calls.count()).toBe(1);
        expect(renderTextSpy.calls.count()).toBe(2);
        expect(extractor._isRotatePage).toBeFalsy();
    });

    it('should cache and return the structure tree root once loaded', () => {
        // Arrange
        const page: PdfPage = createPage(0, PdfRotationAngle.angle0);
        const document: PdfDocument = createDocument([page]);
        const extractor: PdfDataExtractor = new PdfDataExtractor(document);
        const structureRoot: PdfStructureElement = PdfStructureElement._load(document);

        const getStructureTreeRootSpy: jasmine.Spy = spyOn(extractor, '_getStructureTreeRoot').and.returnValue(structureRoot);

        // Act
        const first = extractor.getStructureElement();
        const second = extractor.getStructureElement();

        // Assert
        expect(getStructureTreeRootSpy.calls.count()).toBe(1);
        expect(first).toBe(structureRoot);
        expect(second).toBe(structureRoot);
    });

    it('should collect page structure elements when pageElements is empty and root exists', () => {
        // Arrange
        const page: PdfPage = createPage(0, PdfRotationAngle.angle0);
        const document: PdfDocument = createDocument([page]);
        const extractor: PdfDataExtractor = new PdfDataExtractor(document);
        const childElement: PdfStructureElement = PdfStructureElement._load(document);
        childElement._page = page;
        childElement._tagType = PdfTagType.paragraph;
        childElement._childElements = [];

        const root: PdfStructureElement = PdfStructureElement._load(document);
        root._page = undefined as never;
        root._childElements = [childElement];
        root._tagType = PdfTagType.documentType;

        const nestedExtractorSpy: jasmine.Spy = spyOn(PdfDataExtractor.prototype, 'getStructureElement').and.returnValue(root);
        const getPageElementsSpy: jasmine.Spy = spyOn(extractor, '_getPageElements').and.callThrough();

        // Act
        const result: PdfStructureElement[] = extractor.getStructureElements(page);

        // Assert
        expect(nestedExtractorSpy).toHaveBeenCalled();
        expect(getPageElementsSpy).toHaveBeenCalledWith(root, page);
        expect(result.length).toBe(1);
        expect(result[0]).toBe(childElement);
    });

    it('should push page elements directly or recurse into child elements', () => {
        // Arrange
        const page: PdfPage = createPage(0, PdfRotationAngle.angle0);
        const document: PdfDocument = createDocument([page]);
        const extractor: PdfDataExtractor = new PdfDataExtractor(document);

        const matchingElement: PdfStructureElement = PdfStructureElement._load(document);
        matchingElement._page = page;
        matchingElement._tagType = PdfTagType.paragraph;
        matchingElement._childElements = [];

        const nestedMatch: PdfStructureElement = PdfStructureElement._load(document);
        nestedMatch._page = page;
        nestedMatch._tagType = PdfTagType.span;
        nestedMatch._childElements = [];

        const parentElement: PdfStructureElement = PdfStructureElement._load(document);
        parentElement._page = undefined as never;
        parentElement._tagType = PdfTagType.documentType;
        parentElement._childElements = [nestedMatch];

        // Act
        extractor._getPageElements(matchingElement, page);
        extractor._getPageElements(parentElement, page);

        // Assert
        expect(extractor._pageElements.length).toBe(2);
        expect(extractor._pageElements[0]).toBe(matchingElement);
        expect(extractor._pageElements[1]).toBe(nestedMatch);
    });

    it('should return true for a single root element and false when the StructTreeRoot contains multiple children', () => {
        // Arrange
        const page: PdfPage = createPage(0, PdfRotationAngle.angle0);
        const document: PdfDocument = createDocument([page]);
        const extractor: PdfDataExtractor = new PdfDataExtractor(document);

        const singleTreeRoot: _PdfDictionary = createDictionary({
            K: [1]
        });
        const multipleTreeRoot: _PdfDictionary = createDictionary({
            K: [1, 2]
        });

        // Act
        const singleResult: boolean = extractor._isSingleRootElement(singleTreeRoot);
        const multipleResult: boolean = extractor._isSingleRootElement(multipleTreeRoot);

        // Assert
        expect(singleResult).toBeTruthy();
        expect(multipleResult).toBeFalsy();
    });
});
describe('PdfDataExtractor._renderTextAsLayOut strict AAA coverage', () => {
    function createPage(pageIndex: number, rotation: PdfRotationAngle): PdfPage {
        return {
            _pageIndex: pageIndex,
            rotation: rotation,
            size: { width: 200, height: 100 }
        } as unknown as PdfPage;
    }

    function createRecord(operator: string, operands: string[]): { _operator: string; _operands: string[] } {
        return {
            _operator: operator,
            _operands: operands
        };
    }

    it('should process q, Q, Tc, Tw, Tm, Tf, TL, T*, BT, ET, re, RG, k, g and rg branches safely', () => {
        // Arrange
        const page: PdfPage = createPage(0, PdfRotationAngle.angle0);
        const extractor: PdfDataExtractor = new PdfDataExtractor({
            _crossReference: {},
            pageCount: 1,
            getPage: function (): PdfPage {
                return page;
            }
        } as never);

        extractor._isLayout = true;
        extractor._hasLeading = true;
        extractor._hasNoSpacing = true;
        extractor._tempBoundingRectangle = { x: 0, y: 0, width: 0, height: 0 };
        extractor._textLineMatrix = new _MatrixHelper(1, 0, 0, 1, 0, 0);
        extractor._textMatrix = new _MatrixHelper(1, 0, 0, 1, 0, 0);
        extractor._currentTextMatrix = new _MatrixHelper(1, 0, 0, 1, 0, 0);
        extractor._objects = [extractor._ctm];

        const recordCollection: { _operator: string; _operands: string[] }[] = [
            createRecord('q', []),
            createRecord('Tc', ['2']),
            createRecord('Tw', ['3']),
            createRecord('Tm', ['1', '0', '0', '1', '4', '5']),
            createRecord('Tf', ['/F1', '12']),
            createRecord('TL', ['7']),
            createRecord('T*', []),
            createRecord('BT', []),
            createRecord('ET', []),
            createRecord('re', ['1', '2', '3', '4']),
            createRecord('RG', ['1', '2', '3']),
            createRecord('k', ['4', '5', '6']),
            createRecord('g', ['7', '8', '9']),
            createRecord('rg', ['10', '11', '12']),
            createRecord('Q', [])
        ];

        // Act
        extractor._renderTextAsLayOut(
            recordCollection as never,
            page,
            new Map<string, never>(),
            new Map<string, never>()
        );

        // Assert
        expect(extractor._characterSpacing).toBe(0);
        expect(extractor._wordSpacing).toBe(0);
        expect(extractor._currentFont).toBe('F1');
        expect(extractor._fontSize).toBe(12);
        expect(extractor._textLeading).toBe(-7);
        expect(extractor._currentLocation).toEqual([]);
        expect(extractor._isTextMatrix).toBeFalsy();
        expect(extractor._resultantText).toBe(String.fromCharCode(32));
        expect(extractor._textColor).toEqual([10, 11, 12]);
        expect(extractor._objects.length).toBe(1);
        expect(extractor._objects[0]).toBe(extractor._ctm);
    });

    it('should process cm, BDC, TD, single quote, TJ, Td, Tj, Do and assign mcidTextMap safely in non-rotated flow', () => {
        // Arrange
        const page: PdfPage = createPage(0, PdfRotationAngle.angle0);
        const extractor: PdfDataExtractor = new PdfDataExtractor({
            _crossReference: {},
            pageCount: 1,
            getPage: function (): PdfPage {
                return page;
            }
        } as never);

        extractor._isLayout = false;
        extractor._fontSize = 6;
        extractor._textMatrix = new _MatrixHelper(1, 0, 0, 1, 0, 0);
        extractor._textLineMatrix = new _MatrixHelper(1, 0, 0, 1, 0, 0);
        extractor._currentTextMatrix = new _MatrixHelper(1, 0, 0, 1, 10, 0);
        extractor._previousTextMatrix = new _MatrixHelper(1, 0, 0, 1, 0, 5);
        extractor._previousFontSize = 10;
        extractor._resultantText = '\r\n';
        extractor._objects = [extractor._ctm];

        const parseContentSpy: jasmine.Spy = spyOn(PdfStructureElement.prototype, '_parseContent').and.returnValue(5);

        let moveToNextLineCallCount: number = 0;
        const moveToNextLineSpy: jasmine.Spy = spyOn(extractor, '_moveToNextLine').and.callFake(function (): void {
            moveToNextLineCallCount++;
            if (moveToNextLineCallCount === 1) {
                extractor._textLineMatrix = new _MatrixHelper(1, 0, 0, 1, 0, 2);
                extractor._textMatrix = extractor._textLineMatrix;
            } else if (moveToNextLineCallCount === 2) {
                extractor._textLineMatrix = new _MatrixHelper(1, 0, 0, 1, 0, 5);
                extractor._textMatrix = extractor._textLineMatrix;
            } else {
                extractor._textLineMatrix = new _MatrixHelper(1, 0, 0, 1, 20, 7);
                extractor._textMatrix = extractor._textLineMatrix;
            }
        });

        const setTextLeadingSpy: jasmine.Spy = spyOn(extractor, '_setTextLeading').and.callThrough();

        let renderTextCallCount: number = 0;
        const renderTextElementFromTJSpy: jasmine.Spy = spyOn(extractor, '_renderTextElementFromTJ').and.callFake((
            elementValue: string[]
        ): string => {
            renderTextCallCount++;
            if (renderTextCallCount === 3) {
                extractor._textLineMatrix = new _MatrixHelper(1, 0, 0, 1, 20, 7);
            }
            if (elementValue[0] === '(A)') {
                return 'A';
            }
            if (elementValue[0] === '[(B)]') {
                return 'B';
            }
            return 'C';
        });

        const getXObjectSpy: jasmine.Spy = spyOn(utilsModule, '_getXObject').and.returnValue(undefined);

        const recordCollection: { _operator: string; _operands: string[] }[] = [
            createRecord('Tm', ['1', '0', '0', '1', '0', '0']),
            createRecord('cm', ['1', '0', '0', '1', '0', '20']),
            createRecord('BDC', ['/P', '/<41> MCID 5']),
            createRecord('TD', ['1', '-2']),
            createRecord('\'', ['(A)']),
            createRecord('TJ', ['[(B)]']),
            createRecord('Td', ['3', '4']),
            createRecord('Tj', ['(C)']),
            createRecord('Do', ['/X1'])
        ];

        // Act
        extractor._renderTextAsLayOut(
            recordCollection as never,
            page,
            new Map<string, never>(),
            new Map<string, never>()
        );

        // Assert
        expect(parseContentSpy).toHaveBeenCalled();
        expect(setTextLeadingSpy).toHaveBeenCalledWith(2);
        expect(moveToNextLineSpy.calls.count()).toBe(3);
        expect(renderTextElementFromTJSpy.calls.count()).toBe(3);
        expect(getXObjectSpy).toHaveBeenCalledWith(
            ['/X1'],
            page,
            jasmine.any(Map),
            extractor
        );
        expect(extractor._mcidTextMap.size).toBe(1);
        expect(extractor._mcidTextMap.get(5)).toEqual(['A', 'B', 'C']);
        expect(extractor._differenceX).toBe(20);
        expect(extractor._previousExtractText).toBe('C');
        expect(extractor._previousFontSize).toBe(6);
        expect(extractor._resultantText).toBeTruthy();
    });

    it('should call _buildTextContentStream instead of _renderTextElementFromTJ for single quote, TJ and Tj when page is rotated', () => {
        // Arrange
        const page: PdfPage = createPage(0, PdfRotationAngle.angle90);
        const extractor: PdfDataExtractor = new PdfDataExtractor({
            _crossReference: {},
            pageCount: 1,
            getPage: function (): PdfPage {
                return page;
            }
        } as never);

        extractor._isRotatePage = true;
        extractor._fontSize = 10;
        extractor._textLeading = 5;
        extractor._textMatrix = new _MatrixHelper(1, 0, 0, 1, 0, 0);
        extractor._textLineMatrix = new _MatrixHelper(1, 0, 0, 1, 0, 0);
        extractor._currentTextMatrix = new _MatrixHelper(1, 0, 0, 1, 0, 0);
        extractor._objects = [extractor._ctm];

        const buildTextContentStreamSpy: jasmine.Spy = spyOn(extractor, '_buildTextContentStream').and.stub();
        const renderTextElementFromTJSpy: jasmine.Spy = spyOn(extractor, '_renderTextElementFromTJ').and.returnValue('text');
        const moveToNextLineSpy: jasmine.Spy = spyOn(extractor, '_moveToNextLine').and.callFake(function (): void {
            extractor._textLineMatrix = new _MatrixHelper(1, 0, 0, 1, 0, 0);
            extractor._textMatrix = extractor._textLineMatrix;
        });

        const recordCollection: { _operator: string; _operands: string[] }[] = [
            createRecord('\'', ['(A)']),
            createRecord('TJ', ['[(B)]']),
            createRecord('Tj', ['(C)'])
        ];

        // Act
        extractor._renderTextAsLayOut(
            recordCollection as never,
            page,
            new Map<string, never>(),
            new Map<string, never>()
        );

        // Assert
        expect(moveToNextLineSpy).toHaveBeenCalled();
        expect(buildTextContentStreamSpy.calls.count()).toBe(3);
        expect(renderTextElementFromTJSpy).not.toHaveBeenCalled();
    });
});
describe('PdfDataExtractor structure and figure coverage', () => {
    function createPage(pageIndex: number, rotation: PdfRotationAngle): PdfPage {
        return {
            _pageIndex: pageIndex,
            rotation: rotation,
            size: { width: 200, height: 100 },
            _combineContent: jasmine.createSpy('_combineContent').and.returnValue(new Uint8Array([1, 2, 3]))
        } as unknown as PdfPage;
    }

    function createPdfDictionary(values: { [key: string]: unknown }): _PdfDictionary {
        const dictionary: _PdfDictionary = Object.create(_PdfDictionary.prototype) as _PdfDictionary;
        Object.defineProperty(dictionary, 'has', {
            value: function (key: string): boolean {
                return Object.prototype.hasOwnProperty.call(values, key);
            },
            writable: true,
            configurable: true
        });
        Object.defineProperty(dictionary, 'get', {
            value: function (key: string): unknown {
                return values[key];
            },
            writable: true,
            configurable: true
        });
        Object.defineProperty(dictionary, 'getArray', {
            value: function (key: string): unknown {
                return values[key];
            },
            writable: true,
            configurable: true
        });
        return dictionary;
    }

    function createDocument(catalogDictionary: _PdfDictionary, page: PdfPage): PdfDocument {
        return {
            _crossReference: {},
            pageCount: 1,
            getPage: function (): PdfPage {
                return page;
            },
            _catalog: {
                _catalogDictionary: catalogDictionary
            }
        } as unknown as PdfDocument;
    }

    function createStructureDictionary(
        values: { [key: string]: unknown }
    ): _PdfDictionary {
        return createPdfDictionary(values);
    }

    it('should return undefined from _getStructureTreeRoot when StructTreeRoot is missing', () => {
        // Arrange
        const page: PdfPage = createPage(0, PdfRotationAngle.angle0);
        const catalogDictionary: _PdfDictionary = createPdfDictionary({});
        const document: PdfDocument = createDocument(catalogDictionary, page);
        const extractor: PdfDataExtractor = new PdfDataExtractor(document);

        // Act
        const result: PdfStructureElement = extractor._getStructureTreeRoot();

        // Assert
        expect(result).toBeUndefined();
    });

    it('should load a single structure tree root and call _getTaggedContent when elementCollection has values', () => {
        // Arrange
        const page: PdfPage = createPage(0, PdfRotationAngle.angle0);
        const treeRoot: _PdfDictionary = createStructureDictionary({
            K: [1]
        });
        const catalogDictionary: _PdfDictionary = createPdfDictionary({
            StructTreeRoot: treeRoot
        });
        const document: PdfDocument = createDocument(catalogDictionary, page);
        const extractor: PdfDataExtractor = new PdfDataExtractor(document);
        const structureRoot: PdfStructureElement = PdfStructureElement._load(document);

        extractor._elementCollection = [PdfStructureElement._load(document)];

        const isSingleRootElementSpy: jasmine.Spy = spyOn(extractor, '_isSingleRootElement').and.returnValue(true);
        const getStructureElementSpy: jasmine.Spy = spyOn(extractor, '_getStructureElement').and.returnValue(structureRoot);
        const getTaggedContentSpy: jasmine.Spy = spyOn(structureRoot, '_getTaggedContent').and.stub();

        // Act
        const result: PdfStructureElement = extractor._getStructureTreeRoot();

        // Assert
        expect(isSingleRootElementSpy).toHaveBeenCalledWith(treeRoot);
        expect(getStructureElementSpy).toHaveBeenCalledWith(treeRoot);
        expect(getTaggedContentSpy).toHaveBeenCalledWith(extractor._elementCollection);
        expect(result).toBe(structureRoot);
    });

    it('should load a multiple-root structure tree using PdfStructureElement._load and then call _getStructureElement with parent', () => {
        // Arrange
        const page: PdfPage = createPage(0, PdfRotationAngle.angle0);
        const treeRoot: _PdfDictionary = createStructureDictionary({
            K: [1, 2]
        });
        const catalogDictionary: _PdfDictionary = createPdfDictionary({
            StructTreeRoot: treeRoot
        });
        const document: PdfDocument = createDocument(catalogDictionary, page);
        const extractor: PdfDataExtractor = new PdfDataExtractor(document);
        const loadedRoot: PdfStructureElement = PdfStructureElement._load(document);

        extractor._elementCollection = [PdfStructureElement._load(document)];

        const isSingleRootElementSpy: jasmine.Spy = spyOn(extractor, '_isSingleRootElement').and.returnValue(false);
        const loadSpy: jasmine.Spy = spyOn(PdfStructureElement, '_load').and.returnValue(loadedRoot);
        const getStructureElementSpy: jasmine.Spy = spyOn(extractor, '_getStructureElement').and.returnValue(loadedRoot);
        const getTaggedContentSpy: jasmine.Spy = spyOn(loadedRoot, '_getTaggedContent').and.stub();

        // Act
        const result: PdfStructureElement = extractor._getStructureTreeRoot();

        // Assert
        expect(isSingleRootElementSpy).toHaveBeenCalledWith(treeRoot);
        expect(loadSpy).toHaveBeenCalledWith(document);
        expect(getStructureElementSpy).toHaveBeenCalledWith(treeRoot, loadedRoot);
        expect(getTaggedContentSpy).toHaveBeenCalledWith(extractor._elementCollection);
        expect(result).toBe(loadedRoot);
    });

    it('should process array-based K values in _getStructureElement including dictionary load, tag assignment, child recursion, page dictionary assignment and numeric content ids', () => {
        // Arrange
        const page: PdfPage = createPage(0, PdfRotationAngle.angle0);
        const document: PdfDocument = createDocument(createPdfDictionary({}), page);
        const extractor: PdfDataExtractor = new PdfDataExtractor(document);

        const pageDictionary: _PdfDictionary = createStructureDictionary({ Name: 'PageDictionary' });

        const nestedChildDictionary: _PdfDictionary = createStructureDictionary({
            Pg: pageDictionary
        });

        const parentDictionary: _PdfDictionary = createStructureDictionary({
            S: { name: 'P' },
            K: nestedChildDictionary,
            Pg: pageDictionary
        });

        const rootDictionary: _PdfDictionary = createStructureDictionary({
            K: [parentDictionary, 7]
        });

        const parentElement: PdfStructureElement = PdfStructureElement._load(document);
        parentElement._tagType = PdfTagType.documentType;
        parentElement._childElements = [];
        parentElement._contentId = [];

        // Act
        const result: PdfStructureElement = extractor._getStructureElement(
            rootDictionary,
            parentElement
        );

        // Assert
        expect(result).toBeNull();
        expect(parentElement._childElements.length).toBe(1);
        expect(parentElement._contentId).toEqual([7]);
        expect(extractor._elementCollection.length).toBe(2);
        expect(extractor._orderSet.size).toBe(2);
        expect(extractor._elementOrder).toBe(2);

        const firstElement: PdfStructureElement = extractor._elementCollection[0];
        const secondElement: PdfStructureElement = extractor._elementCollection[1];

        expect(firstElement._tagType).toBe(PdfTagType.paragraph);
        expect(firstElement._pageDictionary).toBe(pageDictionary);
        expect(firstElement._childElements.length).toBe(1);
        expect(secondElement._tagType).toBe(PdfTagType.paragraph);
        expect(secondElement._pageDictionary).toBe(pageDictionary);
    });

    it('should return the top-level structure element from array-based K values when no parent is passed', () => {
        // Arrange
        const page: PdfPage = createPage(0, PdfRotationAngle.angle0);
        const document: PdfDocument = createDocument(createPdfDictionary({}), page);
        const extractor: PdfDataExtractor = new PdfDataExtractor(document);

        const nestedChildDictionary: _PdfDictionary = createStructureDictionary({
            S: { name: 'Span' }
        });

        const parentDictionary: _PdfDictionary = createStructureDictionary({
            S: { name: 'P' },
            K: nestedChildDictionary
        });

        const rootDictionary: _PdfDictionary = createStructureDictionary({
            K: [parentDictionary]
        });

        // Act
        const result: PdfStructureElement = extractor._getStructureElement(rootDictionary);

        // Assert
        expect(result).toBeDefined();
        expect(result._tagType).toBe(PdfTagType.paragraph);
        expect(result._childElements.length).toBe(1);
        expect(result._childElements[0]._tagType).toBe(PdfTagType.span);
    });

    it('should process numeric K values directly into parent contentId in _getStructureElement', () => {
        // Arrange
        const page: PdfPage = createPage(0, PdfRotationAngle.angle0);
        const document: PdfDocument = createDocument(createPdfDictionary({}), page);
        const extractor: PdfDataExtractor = new PdfDataExtractor(document);

        const rootDictionary: _PdfDictionary = createStructureDictionary({
            K: 12
        });

        const parentElement: PdfStructureElement = PdfStructureElement._load(document);
        parentElement._contentId = [];

        // Act
        const result: PdfStructureElement = extractor._getStructureElement(rootDictionary, parentElement);

        // Assert
        expect(result).toBeUndefined();
        expect(parentElement._contentId).toEqual([12]);
    });

    it('should process a single dictionary K value, assign tag from parent fallback and assign page dictionary when tagType is not documentType', () => {
        // Arrange
        const page: PdfPage = createPage(0, PdfRotationAngle.angle0);
        const document: PdfDocument = createDocument(createPdfDictionary({}), page);
        const extractor: PdfDataExtractor = new PdfDataExtractor(document);

        const pageDictionary: _PdfDictionary = createStructureDictionary({ Name: 'PageDictionary' });

        const childDictionary: _PdfDictionary = createStructureDictionary({
            Pg: pageDictionary
        });

        const rootDictionary: _PdfDictionary = createStructureDictionary({
            K: childDictionary
        });

        const parentElement: PdfStructureElement = PdfStructureElement._load(document);
        parentElement._tagType = PdfTagType.link;
        parentElement._childElements = [];

        // Act
        const result: PdfStructureElement = extractor._getStructureElement(rootDictionary, parentElement);

        // Assert
        expect(result).toBeDefined();
        expect(result._tagType).toBe(PdfTagType.link);
        expect(result._pageDictionary).toBe(pageDictionary);
        expect(extractor._elementCollection.length).toBe(1);
        expect(extractor._orderSet.size).toBe(1);
        expect(extractor._elementOrder).toBe(1);
    });

    it('should return true by default and false when treeRoot.K contains more than one item', () => {
        // Arrange
        const page: PdfPage = createPage(0, PdfRotationAngle.angle0);
        const document: PdfDocument = createDocument(createPdfDictionary({}), page);
        const extractor: PdfDataExtractor = new PdfDataExtractor(document);

        const noKDictionary: _PdfDictionary = createStructureDictionary({});
        const singleKDictionary: _PdfDictionary = createStructureDictionary({
            K: [1]
        });
        const multipleKDictionary: _PdfDictionary = createStructureDictionary({
            K: [1, 2]
        });

        // Act
        const noKResult: boolean = extractor._isSingleRootElement(noKDictionary);
        const singleKResult: boolean = extractor._isSingleRootElement(singleKDictionary);
        const multipleKResult: boolean = extractor._isSingleRootElement(multipleKDictionary);

        // Assert
        expect(noKResult).toBeTruthy();
        expect(singleKResult).toBeTruthy();
        expect(multipleKResult).toBeFalsy();
    });

    function runFigureBoundsTest(
        rotation: PdfRotationAngle,
        cmMatrix: _MatrixHelper,
        finalTransform: _MatrixHelper
    ): { x: number; y: number; width: number; height: number } {
        const page: PdfPage = createPage(0, rotation);
        const document: PdfDocument = createDocument(createPdfDictionary({}), page);
        const extractor: PdfDataExtractor = new PdfDataExtractor(document);
        const structElement: PdfStructureElement = PdfStructureElement._load(document);
        structElement._contentId = [9];

        const parseContentSpy: jasmine.Spy = spyOn(structElement, '_parseContent').and.returnValue(9);

        const recordCollection: { _operator: string; _operands: string[] }[] = [
            createRecord('q', []),
            createRecord('cm', ['1', '0', '0', '1', '10', '20']),
            createRecord('BDC', ['/P', '/<41> MCID 9']),
            createRecord('Do', ['/Im1'])
        ];

        spyOn(_ContentParser.prototype, '_readContent').and.returnValue(recordCollection as never);

        let multiplyCallCount: number = 0;
        spyOn(_MatrixHelper.prototype, '_multiply').and.callFake(function (
            this: _MatrixHelper,
            other: _MatrixHelper
        ): _MatrixHelper {
            multiplyCallCount++;
            if (multiplyCallCount === 1) {
                return cmMatrix;
            }
            if (multiplyCallCount === 2) {
                return new _MatrixHelper(
                    finalTransform._m11,
                    finalTransform._m12,
                    finalTransform._m21,
                    finalTransform._m22,
                    finalTransform._offsetX,
                    finalTransform._offsetY
                );
            }
            return finalTransform;
        });

        // Act
        const result: { x: number; y: number; width: number; height: number } = extractor._getFigureBounds(
            structElement,
            page
        );

        // Assert
        expect(parseContentSpy).toHaveBeenCalled();
        return result;
    }

    function createRecord(operator: string, operands: string[]): { _operator: string; _operands: string[] } {
        return {
            _operator: operator,
            _operands: operands
        };
    }

    it('should compute angle270 bounds when transformMatrix._m11 and _m12 are non-zero', () => {
        // Arrange
        const cmMatrix: _MatrixHelper = new _MatrixHelper(11, 12, 13, 14, 15, 16);
        const finalTransform: _MatrixHelper = new _MatrixHelper(13.3, 2, 3, 4, 13.3, 26.6);

        // Act
        const result: { x: number; y: number; width: number; height: number } = runFigureBoundsTest(
            PdfRotationAngle.angle270,
            cmMatrix,
            finalTransform
        );

        // Assert
        expect(result).toEqual({
            x: 20,
            y: 205,
            width: 14,
            height: 12
        });
    });

    it('should compute angle270 bounds when transformMatrix._m11 and _m12 do not satisfy the first condition', () => {
        // Arrange
        const cmMatrix: _MatrixHelper = new _MatrixHelper(11, 12, 13, 14, 15, 16);
        const finalTransform: _MatrixHelper = new _MatrixHelper(0, 0, 3, 4, 13.3, 26.6);

        // Act
        const result: { x: number; y: number; width: number; height: number } = runFigureBoundsTest(
            PdfRotationAngle.angle270,
            cmMatrix,
            finalTransform
        );

        // Assert
        expect(result).toEqual({
            x: 20,
            y: 195,
            width: 12,
            height: 13
        });
    });

    it('should compute angle90 bounds when transformMatrix._m11 and _m21 are zero', () => {
        // Arrange
        const cmMatrix: _MatrixHelper = new _MatrixHelper(11, 12, -13, 14, 15, 16);
        const finalTransform: _MatrixHelper = new _MatrixHelper(0, 2, 0, 4, 13.3, 26.6);

        // Act
        const result: { x: number; y: number; width: number; height: number } = runFigureBoundsTest(
            PdfRotationAngle.angle90,
            cmMatrix,
            finalTransform
        );

        // Assert
        expect(result).toEqual({
            x: 80,
            y: 10,
            width: 12,
            height: 13
        });
    });

    it('should compute angle90 bounds when transformMatrix._m11 and _m21 are not both zero', () => {
        // Arrange
        const cmMatrix: _MatrixHelper = new _MatrixHelper(11, 12, -13, 14, 15, 16);
        const finalTransform: _MatrixHelper = new _MatrixHelper(1, 2, 3, 4, 13.3, 26.6);

        // Act
        const result: { x: number; y: number; width: number; height: number } = runFigureBoundsTest(
            PdfRotationAngle.angle90,
            cmMatrix,
            finalTransform
        );

        // Assert
        expect(result).toEqual({
            x: 66,
            y: 10,
            width: 14,
            height: 11
        });
    });

    it('should compute angle180 bounds', () => {
        // Arrange
        const cmMatrix: _MatrixHelper = new _MatrixHelper(11, 12, 13, 14, 15, 16);
        const finalTransform: _MatrixHelper = new _MatrixHelper(1, 2, 3, 4, 13.3, 26.6);

        // Act
        const result: { x: number; y: number; width: number; height: number } = runFigureBoundsTest(
            PdfRotationAngle.angle180,
            cmMatrix,
            finalTransform
        );

        // Assert
        expect(result).toEqual({
            x: 179,
            y: 66,
            width: 11,
            height: 16
        });
    });

    it('should compute default rotation bounds for transformMatrix._m11===0 and _m22>0 with m12<0 and m21>0', () => {
        // Arrange
        const cmMatrix: _MatrixHelper = new _MatrixHelper(11, 12, -13, 14, 15, 16);
        const finalTransform: _MatrixHelper = new _MatrixHelper(0, -2, 3, 4, 13.3, 26.6);

        // Act
        const result: { x: number; y: number; width: number; height: number } = runFigureBoundsTest(
            PdfRotationAngle.angle0,
            cmMatrix,
            finalTransform
        );

        // Assert
        expect(result).toEqual({
            x: 80,
            y: 10,
            width: 13,
            height: 12
        });
    });

    it('should compute default rotation bounds for transformMatrix._m11===0 and _m22>0 with m12>0 and m21<0', () => {
        // Arrange
        const cmMatrix: _MatrixHelper = new _MatrixHelper(11, 12, -13, 14, 15, 16);
        const finalTransform: _MatrixHelper = new _MatrixHelper(0, 2, -3, 4, 13.3, 26.6);

        // Act
        const result: { x: number; y: number; width: number; height: number } = runFigureBoundsTest(
            PdfRotationAngle.angle0,
            cmMatrix,
            finalTransform
        );

        // Assert
        expect(result).toEqual({
            x: 20,
            y: 190,
            width: 13,
            height: 12
        });
    });

    it('should compute default rotation bounds for transformMatrix._m11===0 and _m22>0 with m12<0 and m21<0', () => {
        // Arrange
        const cmMatrix: _MatrixHelper = new _MatrixHelper(11, 12, -13, 14, 15, 16);
        const finalTransform: _MatrixHelper = new _MatrixHelper(0, -2, -3, 4, 13.3, 26.6);

        // Act
        const result: { x: number; y: number; width: number; height: number } = runFigureBoundsTest(
            PdfRotationAngle.angle0,
            cmMatrix,
            finalTransform
        );

        // Assert
        expect(result).toEqual({
            x: 69,
            y: 93,
            width: 11,
            height: 14
        });
    });

    it('should compute default rotation bounds for transformMatrix._m11===0 and _m22>0 using the final else inner branch', () => {
        // Arrange
        const cmMatrix: _MatrixHelper = new _MatrixHelper(11, 12, 13, 14, 15, 16);
        const finalTransform: _MatrixHelper = new _MatrixHelper(0, 2, 3, 4, 13.3, 26.6);

        // Act
        const result: { x: number; y: number; width: number; height: number } = runFigureBoundsTest(
            PdfRotationAngle.angle0,
            cmMatrix,
            finalTransform
        );

        // Assert
        expect(result).toEqual({
            x: 179,
            y: 66,
            width: 11,
            height: 13
        });
    });

    it('should compute default rotation bounds using the outer final else branch', () => {
        // Arrange
        const cmMatrix: _MatrixHelper = new _MatrixHelper(11, 12, 13, 14, 15, 16);
        const finalTransform: _MatrixHelper = new _MatrixHelper(5, 2, 3, 0, 13.3, 26.6);

        // Act
        const result: { x: number; y: number; width: number; height: number } = runFigureBoundsTest(
            PdfRotationAngle.angle0,
            cmMatrix,
            finalTransform
        );

        // Assert
        expect(result).toEqual({
            x: 10,
            y: 20,
            width: 11,
            height: 14
        });
    });
});

import { PdfFontStyle} from '@syncfusion/ej2-pdf';
import { _PdfTextParser } from '../../src/pdf-data-extract/core/pdf-text-parser';

describe('PdfDataExtractor text rendering strict AAA coverage', () => {
    function createPage(rotation: PdfRotationAngle): PdfPage {
        return {
            _pageIndex: 0,
            rotation: rotation,
            size: { width: 200, height: 100 }
        } as unknown as PdfPage;
    }

    function createExtractor(page: PdfPage): PdfDataExtractor {
        return new PdfDataExtractor({
            _crossReference: {},
            pageCount: 1,
            getPage: function (): PdfPage {
                return page;
            }
        } as never);
    }

    function createFontCollection(font: object): Map<string, object> {
        const fontCollection: Map<string, object> = new Map<string, object>();
        fontCollection.set('F1', font);
        return fontCollection;
    }

    it('should cover _renderTextElementFromTJ number-token spacing branch and non-type3 layout glyph branch with inserted spaces', () => {
        // Arrange
        const page: PdfPage = createPage(PdfRotationAngle.angle0);
        const extractor: PdfDataExtractor = createExtractor(page);

        extractor._currentFont = 'F1';
        extractor._fontSize = 12;
        extractor._isLayout = true;
        extractor._hasBeginMarkedContent = false;
        extractor._initialTransForm = new _MatrixHelper(1, 0, 0, 1, 0, 0);
        extractor._textMatrix = new _MatrixHelper(1, 0, 0, 1, 0, 0);
        extractor._textLineMatrix = new _MatrixHelper(1, 0, 0, 1, 0, 0);
        extractor._tempBoundingRectangle = { x: 1, y: 0, width: 1, height: 1 };
        extractor._boundingRectangle = { x: 0, y: 0, width: 0, height: 0 };

        const font: {
            _name: string;
            _fontStyle: PdfFontStyle;
            _isType3Font: boolean;
            _fontMatrix: number[];
        } = {
            _name: 'Helvetica',
            _fontStyle: PdfFontStyle.regular,
            _isType3Font: false,
            _fontMatrix: [0.5, 0, 0, 0.5, 0, 0]
        };

        const fontCollection: Map<string, object> = createFontCollection(font);
        const parseEncodedTextSpy: jasmine.Spy = spyOn(utilsModule, '_parseEncodedText').and.returnValue([
            ['30', 'ABs'],
            [[5, 6]]
        ] as never);
        const ignoreEscapeSequenceSpy: jasmine.Spy = spyOn(utilsModule, '_ignoreEscapeSequence').and.callFake((value: string): string => {
            return value;
        });
        const updateTextMatrixSpy: jasmine.Spy = spyOn(extractor, '_updateTextMatrix').and.returnValue(
            new _MatrixHelper(1, 0, 0, 1, 20, 0)
        );
        const getTextRenderingMatrixSpy: jasmine.Spy = spyOn(extractor, '_getTextRenderingMatrix').and.returnValue(
            new _MatrixHelper(2, 0, 0, 2, 40, 20)
        );
        const updateTextLineMatrixSpy: jasmine.Spy = spyOn(extractor, '_updateTextLineMatrix').and.stub();
        const getCharacterWidthSpy: jasmine.Spy = spyOn(extractor._parser, '_getCharacterWidth').and.callFake((width: number): number => {
            return width + 1;
        });

        // Act
        const result: string = extractor._renderTextElementFromTJ(
            ['[(A) 30 (B)]'],
            page,
            fontCollection as never
        );

        // Assert
        expect(parseEncodedTextSpy).toHaveBeenCalledWith('[(A) 30 (B)]', font as never);
        expect(updateTextMatrixSpy).toHaveBeenCalledWith(30);
        expect(ignoreEscapeSequenceSpy).toHaveBeenCalledWith('AB');
        expect(getTextRenderingMatrixSpy.calls.count()).toBe(2);
        expect(getCharacterWidthSpy.calls.count()).toBe(2);
        expect(updateTextLineMatrixSpy.calls.count()).toBe(2);
        expect(result).toBe('  AB');
        expect(extractor._tempBoundingRectangle).toEqual(extractor._boundingRectangle);
        expect(extractor._textMatrix._offsetX).toBe(extractor._textLineMatrix._offsetX);
    });

    it('should cover _renderTextElementFromTJ type3 non-layout branch with negative m12 and m21 path', () => {
        // Arrange
        const page: PdfPage = createPage(PdfRotationAngle.angle0);
        const extractor: PdfDataExtractor = createExtractor(page);

        extractor._currentFont = 'F1';
        extractor._fontSize = 8;
        extractor._isLayout = false;
        extractor._hasBeginMarkedContent = true;
        extractor._initialTransForm = new _MatrixHelper(1, 0, 0, 1, 0, 0);
        extractor._textMatrix = new _MatrixHelper(0, -5, 6, 0, 0, 0);
        extractor._textLineMatrix = new _MatrixHelper(0, -5, 6, 0, 0, 0);
        extractor._tempBoundingRectangle = { x: 0, y: 0, width: 0, height: 0 };
        extractor._boundingRectangle = { x: 0, y: 0, width: 0, height: 0 };

        const font: {
            _name: string;
            _fontStyle: PdfFontStyle;
            _isType3Font: boolean;
            _fontMatrix?: number[];
        } = {
            _name: 'Type3Font',
            _fontStyle: PdfFontStyle.bold,
            _isType3Font: true
        };

        const fontCollection: Map<string, object> = createFontCollection(font);
        const parseEncodedTextSpy: jasmine.Spy = spyOn(utilsModule, '_parseEncodedText').and.returnValue([
            ['Zs'],
            [[4]]
        ] as never);
        const ignoreEscapeSequenceSpy: jasmine.Spy = spyOn(utilsModule, '_ignoreEscapeSequence').and.callFake((value: string): string => {
            return value;
        });
        const getTextRenderingMatrixSpy: jasmine.Spy = spyOn(extractor, '_getTextRenderingMatrix').and.returnValue(
            new _MatrixHelper(0, -3, 4, 0, 12, 16)
        );
        const getTextHeightSpy: jasmine.Spy = spyOn(extractor, '_getTextHeight').and.returnValue(9);
        const updateTextLineMatrixSpy: jasmine.Spy = spyOn(extractor, '_updateTextLineMatrix').and.stub();

        // Act
        const result: string = extractor._renderTextElementFromTJ(
            ['(Z)'],
            page,
            fontCollection as never
        );

        // Assert
        expect(parseEncodedTextSpy).toHaveBeenCalledWith('(Z)', font as never);
        expect(ignoreEscapeSequenceSpy).toHaveBeenCalledWith('Z');
        expect(getTextRenderingMatrixSpy).toHaveBeenCalled();
        expect(getTextHeightSpy).toHaveBeenCalledWith(font as never, jasmine.any(_MatrixHelper));
        expect(updateTextLineMatrixSpy).toHaveBeenCalledWith('Z', 0.004);
        expect(result).toBe('Z');
        expect(extractor._boundingRectangle.height).toBe(9);
        expect(extractor._boundingRectangle.width).toBeTruthy();
    });

    it('should cover _buildTextContentStream zero-spacing carry path and rotated final textWord bounds path', () => {
        // Arrange
        const page: PdfPage = createPage(PdfRotationAngle.angle90);
        const extractor: PdfDataExtractor = createExtractor(page);

        extractor._currentFont = 'F1';
        extractor._fontSize = 11;
        extractor._isRotatePage = true;
        extractor._textGlyph = [];
        extractor._textWord = [];
        extractor._textLine = [];
        extractor._textExtraction = [];
        extractor._extractedText = 'ROTATED';

        const font: {
            _name: string;
            _fontStyle: PdfFontStyle;
        } = {
            _name: 'Helvetica',
            _fontStyle: PdfFontStyle.italic
        };

        const fontCollection: Map<string, object> = createFontCollection(font);

        const parseEncodedTextSpy: jasmine.Spy = spyOn(utilsModule, '_parseEncodedText').and.returnValue([
            ['ABs', '0', 'Cs', '10'],
            []
        ] as never);

        const getTextWidthSpy: jasmine.Spy = spyOn(extractor, '_getTextWidth').and.callFake((
            textValue: string,
            extraSpacing: number,
            currentFontValue: object,
            pageValue: PdfPage,
            tempStringValue: string
        ): string => {
            extractor._textGlyph = [
                {
                    _bounds: { x: 5, y: 6, width: 7, height: 8 }
                } as never
            ];
            extractor._height = 30;
            extractor._width = 25;
            return tempStringValue + textValue;
        });

        // Act
        extractor._buildTextContentStream(
            ['[(AB) 0 (C) 10]'],
            page,
            fontCollection as never
        );

        // Assert
        expect(parseEncodedTextSpy).toHaveBeenCalledWith('[(AB) 0 (C) 10]', font as never);
        expect(getTextWidthSpy.calls.count()).toBe(2);
        expect(getTextWidthSpy.calls.argsFor(0)[0]).toBe('ABC');
        expect(getTextWidthSpy.calls.argsFor(0)[1]).toBe(-0.01);
        expect(getTextWidthSpy.calls.argsFor(1)[0]).toBe('ABC');
        expect(getTextWidthSpy.calls.argsFor(1)[1]).toBe(0);
        expect(extractor._textLine.length).toBe(1);
        expect(extractor._textLine[0]._text).toBe('ROTATED');
        expect(extractor._textLine[0]._fontName).toBe('Helvetica');
        expect(extractor._textLine[0]._fontStyle).toBe(PdfFontStyle.italic);
        expect(extractor._textLine[0]._fontSize).toBe(11);
        expect(extractor._textLine[0]._pageIndex).toBe(0);
        expect(extractor._textExtraction).toEqual(['ROTATED']);
        expect(extractor._extractedText).toBe('');
        expect(extractor._width).toBe(0);
        expect(extractor._textGlyph).toEqual([]);
        expect(extractor._textWord[0]._bounds).toEqual({
            x: 5,
            y: 6,
            width: 7,
            height: 30
        });
    });

    it('should cover _buildTextContentStream non-rotated final textWord bounds path', () => {
        // Arrange
        const page: PdfPage = createPage(PdfRotationAngle.angle0);
        const extractor: PdfDataExtractor = createExtractor(page);

        extractor._currentFont = 'F1';
        extractor._fontSize = 9;
        extractor._isRotatePage = false;
        extractor._textGlyph = [];
        extractor._textWord = [];
        extractor._textLine = [];
        extractor._textExtraction = [];
        extractor._extractedText = 'NORMAL';

        const font: {
            _name: string;
            _fontStyle: PdfFontStyle;
        } = {
            _name: 'Courier',
            _fontStyle: PdfFontStyle.bold
        };

        const fontCollection: Map<string, object> = createFontCollection(font);

        spyOn(utilsModule, '_parseEncodedText').and.returnValue([
            ['ABs'],
            []
        ] as never);

        spyOn(extractor, '_getTextWidth').and.callFake((
            textValue: string,
            extraSpacing: number,
            currentFontValue: object,
            pageValue: PdfPage,
            tempStringValue: string
        ): string => {
            extractor._textGlyph = [
                {
                    _bounds: { x: 2, y: 3, width: 4, height: 5 }
                } as never
            ];
            extractor._height = 12;
            extractor._width = 20;
            return tempStringValue + textValue;
        });

        // Act
        extractor._buildTextContentStream(
            ['[(AB)]'],
            page,
            fontCollection as never
        );

        // Assert
        expect(extractor._textWord[0]._bounds).toEqual({
            x: 2,
            y: 3,
            width: 20,
            height: 4
        });
        expect(extractor._textLine[0]._text).toBe('NORMAL');
        expect(extractor._textExtraction).toEqual(['NORMAL']);
        expect(extractor._extractedText).toBe('');
    });

    it('should cover _getTextWidth with fontMatrix branch, space branch, positive m11 branch, previousRect truthy path and charSpacing continue path', () => {
        // Arrange
        const page: PdfPage = createPage(PdfRotationAngle.angle0);
        const extractor: PdfDataExtractor = createExtractor(page);

        extractor._fontSize = 10;
        extractor._characterSpacing = 2;
        extractor._wordSpacing = 5;
        extractor._textHorizontalScaling = 100;
        extractor._textMatrix = new _MatrixHelper(2, 0, 0, 2, 10, 20);
        extractor._boundingRectangle = { x: 0, y: 0, width: 0, height: 0 };
        extractor._previousRect = { x: 1, y: 2, width: 3, height: 4 };
        extractor._extractedText = '';

        const currentFont: {
            _fontMatrix: number[];
            _name: string;
            _fontStyle: PdfFontStyle;
            _charsToGlyphs: (text: string) => { _unicode: string; _width: number }[];
        } = {
            _fontMatrix: [0.5, 0, 0, 0.5, 0, 0],
            _name: 'Helvetica',
            _fontStyle: PdfFontStyle.regular,
            _charsToGlyphs: function (): { _unicode: string; _width: number }[] {
                return [
                    { _unicode: 'A', _width: 3 },
                    { _unicode: ' ', _width: 4 }
                ];
            }
        };

        const translateTextMatrixSpy: jasmine.Spy = spyOn(extractor._parser, '_translateTextMatrix').and.callFake((
            xValue: number,
            yValue: number,
            matrixValue: _MatrixHelper
        ): _MatrixHelper => {
            return new _MatrixHelper(
                matrixValue._m11,
                matrixValue._m12,
                matrixValue._m21,
                matrixValue._m22,
                matrixValue._offsetX + xValue,
                matrixValue._offsetY + yValue
            );
        });

        const splitWordsSpy: jasmine.Spy = spyOn(extractor, '_splitWords').and.callFake((
            glyphValue: string,
            tempStringValue: string
        ): string => {
            return tempStringValue + glyphValue;
        });

        // Act
        const result: string = extractor._getTextWidth(
            'A ',
            1,
            currentFont as never,
            page,
            ''
        );

        // Assert
        expect(result).toBe('A ');
        expect(extractor._extractedText).toBe('A ');
        expect(splitWordsSpy.calls.count()).toBe(2);
        expect(translateTextMatrixSpy.calls.count()).toBe(3);
        expect(extractor._boundingRectangle.x).toBeGreaterThan(0);
        expect(extractor._boundingRectangle.y).toBeGreaterThan(0);
        expect(extractor._previousRect).toEqual({
            x: extractor._boundingRectangle.x,
            y: extractor._boundingRectangle.y,
            width: extractor._boundingRectangle.width,
            height: extractor._boundingRectangle.height
        });
    });

    it('should cover _getTextWidth with missing fontMatrix branch, negative m12 branch, non-space branch and previousRect null reset path', () => {
        // Arrange
        const page: PdfPage = createPage(PdfRotationAngle.angle0);
        const extractor: PdfDataExtractor = createExtractor(page);

        extractor._fontSize = 8;
        extractor._characterSpacing = 1;
        extractor._wordSpacing = 0;
        extractor._textHorizontalScaling = 100;
        extractor._textMatrix = new _MatrixHelper(0, -3, 4, -2, 6, 7);
        extractor._boundingRectangle = { x: 0, y: 0, width: 0, height: 0 };
        extractor._previousRect = null as never;
        extractor._extractedText = '';

        const currentFont: {
            _name: string;
            _fontStyle: PdfFontStyle;
            _charsToGlyphs: (text: string) => { _unicode: string; _width: number }[];
        } = {
            _name: 'Type3Like',
            _fontStyle: PdfFontStyle.bold,
            _charsToGlyphs: function (): { _unicode: string; _width: number }[] {
                return [
                    { _unicode: 'Z', _width: 2 }
                ];
            }
        };

        const translateTextMatrixSpy: jasmine.Spy = spyOn(extractor._parser, '_translateTextMatrix').and.callFake((
            xValue: number,
            yValue: number,
            matrixValue: _MatrixHelper
        ): _MatrixHelper => {
            return new _MatrixHelper(
                matrixValue._m11,
                matrixValue._m12,
                matrixValue._m21,
                matrixValue._m22,
                matrixValue._offsetX + xValue,
                matrixValue._offsetY + yValue
            );
        });

        const splitWordsSpy: jasmine.Spy = spyOn(extractor, '_splitWords').and.callFake((
            glyphValue: string,
            tempStringValue: string
        ): string => {
            return tempStringValue + glyphValue;
        });

        // Act
        const result: string = extractor._getTextWidth(
            'Z',
            0,
            currentFont as never,
            page,
            ''
        );

        // Assert
        expect(result).toBe('Z');
        expect(splitWordsSpy).toHaveBeenCalledWith('Z', '', 'Type3Like', PdfFontStyle.bold, page);
        expect(translateTextMatrixSpy.calls.count()).toBe(2);
        expect(extractor._previousRect).toEqual({ x: 0, y: 0, width: 0, height: 0 });
        expect(extractor._boundingRectangle.width).toBeGreaterThan(0);
        expect(extractor._boundingRectangle.height).toBeTruthy();
        expect(extractor._extractedText).toBe('Z');
    });

    it('should cover _splitWords space branch with tempString flush, color assignment, rotated glyph and reset state', () => {
        // Arrange
        const page: PdfPage = createPage(PdfRotationAngle.angle90);
        const extractor: PdfDataExtractor = createExtractor(page);

        extractor._fontSize = 10;
        extractor._boundingRectangle = { x: 1, y: 2, width: 3, height: 4 };
        extractor._textGlyph = [
            {
                _bounds: { x: 4, y: 5, width: 6, height: 7 }
            } as never
        ];
        extractor._textWord = [];
        extractor._width = 20;
        extractor._height = 30;
        extractor._previousRect = { x: 1, y: 2, width: 3, height: 4 };

        // Act
        const result: string = extractor._splitWords(
            ' ',
            'AB',
            'Arial',
            PdfFontStyle.regular,
            page,
            90,
            [1, 2, 3]
        );

        // Assert
        expect(result).toBe('');
        expect(extractor._textWord.length).toBe(2);
        expect(extractor._textWord[0]._text).toBe('AB');
        expect(extractor._textWord[1]._text).toBe(' ');
        expect(extractor._width).toBe(0);
        expect(extractor._height).toBe(0);
        expect(extractor._textGlyph).toEqual([]);
        expect(extractor._previousRect).toBeNull();
    });

    it('should cover _splitWords non-space spacing branch for angle90 and flush previous glyphs', () => {
        // Arrange
        const page: PdfPage = createPage(PdfRotationAngle.angle90);
        const extractor: PdfDataExtractor = createExtractor(page);

        extractor._fontSize = 10;
        extractor._boundingRectangle = { x: 1, y: 0, width: 4, height: 10 };
        extractor._previousRect = { x: 0, y: 20, width: 4, height: 10 };
        extractor._textGlyph = [
            {
                _bounds: { x: 0, y: 20, width: 4, height: 10 }
            } as never
        ];
        extractor._textWord = [];
        extractor._height = 10;
        extractor._width = 0;

        // Act
        const result: string = extractor._splitWords(
            'B',
            'A',
            'Arial',
            PdfFontStyle.regular,
            page
        );

        // Assert
        expect(result).toBe('B');
        expect(extractor._textWord.length).toBe(1);
        expect(extractor._textWord[0]._text).toBe('A');
        expect(extractor._height).toBe(10);
        expect(extractor._width).toBe(0);
        expect(extractor._previousRect).toEqual({ x: 0, y: 0, width: 0, height: 0 });
        expect(extractor._textGlyph.length).toBe(1);
        expect(extractor._textGlyph[0]._text).toBe('B');
        expect(extractor._textGlyph[0]._isRotated).toBeFalsy();
    });

    it('should cover _splitWords non-space spacing branches for rotation 90, angle180 and default difference paths', () => {
        // Arrange
        const pageAngle0: PdfPage = createPage(PdfRotationAngle.angle0);
        const pageAngle180: PdfPage = createPage(PdfRotationAngle.angle180);
        const extractor: PdfDataExtractor = createExtractor(pageAngle0);

        extractor._fontSize = 11;

        extractor._boundingRectangle = { x: 0, y: 20, width: 5, height: 10 };
        extractor._previousRect = { x: 0, y: 0, width: 5, height: 5 };
        extractor._textGlyph = [{ _bounds: { x: 0, y: 0, width: 5, height: 5 } } as never];
        extractor._textWord = [];
        extractor._height = 5;
        extractor._width = 5;

        const rotation90Result: string = extractor._splitWords(
            'C',
            'B',
            'Arial',
            PdfFontStyle.bold,
            pageAngle0,
            90,
            [4, 5, 6]
        );

        extractor._boundingRectangle = { x: 20, y: 0, width: 10, height: 10 };
        extractor._previousRect = { x: 5, y: 0, width: 5, height: 5 };
        extractor._textGlyph = [{ _bounds: { x: 5, y: 0, width: 5, height: 5 } } as never];
        extractor._height = 0;
        extractor._width = 5;

        const angle180Result: string = extractor._splitWords(
            'D',
            'C',
            'Arial',
            PdfFontStyle.bold,
            pageAngle180
        );

        extractor._boundingRectangle = { x: 40, y: 0, width: 10, height: 10 };
        extractor._previousRect = { x: 5, y: 0, width: 5, height: 5 };
        extractor._textGlyph = [{ _bounds: { x: 5, y: 0, width: 5, height: 5 } } as never];
        extractor._height = 0;
        extractor._width = 5;

        const defaultResult: string = extractor._splitWords(
            'E',
            'D',
            'Arial',
            PdfFontStyle.bold,
            pageAngle0
        );

        // Assert
        expect(rotation90Result).toBe('C');
        expect(angle180Result).toBe('D');
        expect(defaultResult).toBe('E');
        expect(extractor._textWord.length).toBeGreaterThan(0);
        expect(extractor._textGlyph.length).toBe(1);
        expect(extractor._textGlyph[0]._text).toBe('E');
        expect(extractor._textGlyph[0]._color).toBeUndefined();
        expect(extractor._textGlyph[0]._isRotated).toBeFalsy();
    });
});
describe('PdfDataExtractor strict AAA highlighted coverage', () => {
    function createPage(rotation: PdfRotationAngle): PdfPage {
        return {
            _pageIndex: 0,
            rotation: rotation,
            size: { width: 200, height: 100 }
        } as unknown as PdfPage;
    }

    function createExtractor(page: PdfPage): PdfDataExtractor {
        return new PdfDataExtractor({
            _crossReference: {},
            pageCount: 1,
            getPage: function (): PdfPage {
                return page;
            }
        } as never);
    }

    function createFontCollection(font: object): Map<string, object> {
        const fontCollection: Map<string, object> = new Map<string, object>();
        fontCollection.set('F1', font);
        return fontCollection;
    }

    function createPdfDictionary(values: { [key: string]: unknown }): _PdfDictionary {
        const dictionary: _PdfDictionary = Object.create(_PdfDictionary.prototype) as _PdfDictionary;
        Object.defineProperty(dictionary, 'has', {
            value: function (key: string): boolean {
                return Object.prototype.hasOwnProperty.call(values, key);
            },
            writable: true,
            configurable: true
        });
        Object.defineProperty(dictionary, 'get', {
            value: function (key: string): unknown {
                return values[key];
            },
            writable: true,
            configurable: true
        });
        Object.defineProperty(dictionary, 'getArray', {
            value: function (key: string): unknown {
                return values[key];
            },
            writable: true,
            configurable: true
        });
        return dictionary;
    }

    function createRecord(operator: string, operands: string[]): { _operator: string; _operands: string[] } {
        return {
            _operator: operator,
            _operands: operands
        };
    }

    it('should cover highlighted single-quote, TJ and Tj lines in _renderTextAsLayOut for rotated flow using _buildTextContentStream', () => {
        // Arrange
        const page: PdfPage = createPage(PdfRotationAngle.angle90);
        const extractor: PdfDataExtractor = createExtractor(page);

        extractor._isLayout = false;
        extractor._isRotatePage = true;
        extractor._fontSize = 9;
        extractor._textLeading = 4;
        extractor._textMatrix = new _MatrixHelper(1, 0, 0, 1, 0, 5);
        extractor._textLineMatrix = new _MatrixHelper(1, 0, 0, 1, 0, 5);
        extractor._currentTextMatrix = new _MatrixHelper(1, 0, 0, 1, 1, 1);
        extractor._objects = [extractor._ctm];

        const buildTextContentStreamSpy: jasmine.Spy = spyOn(extractor, '_buildTextContentStream').and.stub();
        const renderTextElementFromTJSpy: jasmine.Spy = spyOn(extractor, '_renderTextElementFromTJ').and.returnValue('SHOULD_NOT_RUN');
        const moveToNextLineSpy: jasmine.Spy = spyOn(extractor, '_moveToNextLine').and.callFake(function (): void {
            extractor._textLineMatrix = new _MatrixHelper(1, 0, 0, 1, 0, 5);
            extractor._textMatrix = extractor._textLineMatrix;
        });

        const recordCollection: { _operator: string; _operands: string[] }[] = [
            createRecord('\'', ['(A)']),
            createRecord('TJ', ['[(B)]']),
            createRecord('Tj', ['(C)'])
        ];

        // Act
        extractor._renderTextAsLayOut(
            recordCollection as never,
            page,
            new Map<string, never>(),
            new Map<string, never>()
        );

        // Assert
        expect(moveToNextLineSpy).toHaveBeenCalled();
        expect(buildTextContentStreamSpy.calls.count()).toBe(3);
        expect(renderTextElementFromTJSpy).not.toHaveBeenCalled();
    });

    it('should cover _renderTextElementFromTJ number-token spacing branch and non-type3 layout glyph branch with inserted spaces', () => {
        // Arrange
        const page: PdfPage = createPage(PdfRotationAngle.angle0);
        const extractor: PdfDataExtractor = createExtractor(page);

        extractor._currentFont = 'F1';
        extractor._fontSize = 12;
        extractor._isLayout = true;
        extractor._hasBeginMarkedContent = false;
        extractor._initialTransForm = new _MatrixHelper(1, 0, 0, 1, 0, 0);
        extractor._textMatrix = new _MatrixHelper(1, 0, 0, 1, 0, 0);
        extractor._textLineMatrix = new _MatrixHelper(1, 0, 0, 1, 0, 0);
        extractor._tempBoundingRectangle = { x: 1, y: 0, width: 1, height: 1 };
        extractor._boundingRectangle = { x: 0, y: 0, width: 0, height: 0 };

        const font: {
            _name: string;
            _fontStyle: PdfFontStyle;
            _isType3Font: boolean;
            _fontMatrix: number[];
        } = {
            _name: 'Helvetica',
            _fontStyle: PdfFontStyle.regular,
            _isType3Font: false,
            _fontMatrix: [0.5, 0, 0, 0.5, 0, 0]
        };

        const fontCollection: Map<string, object> = createFontCollection(font);

        const parseEncodedTextSpy: jasmine.Spy = spyOn(utilsModule, '_parseEncodedText').and.returnValue([
            ['30', 'ABs'],
            [[5, 6]]
        ] as never);

        const ignoreEscapeSequenceSpy: jasmine.Spy = spyOn(utilsModule, '_ignoreEscapeSequence').and.callFake(function (value: string): string {
            return value;
        });

        const updateTextMatrixSpy: jasmine.Spy = spyOn(extractor, '_updateTextMatrix').and.returnValue(
            new _MatrixHelper(1, 0, 0, 1, 20, 0)
        );

        const getTextRenderingMatrixSpy: jasmine.Spy = spyOn(extractor, '_getTextRenderingMatrix').and.returnValue(
            new _MatrixHelper(2, 0, 0, 2, 40, 20)
        );

        const updateTextLineMatrixSpy: jasmine.Spy = spyOn(extractor, '_updateTextLineMatrix').and.stub();

        const getCharacterWidthSpy: jasmine.Spy = spyOn(extractor._parser, '_getCharacterWidth').and.callFake(function (width: number): number {
            return width + 1;
        });

        // Act
        const result: string = extractor._renderTextElementFromTJ(
            ['[(A) 30 (B)]'],
            page,
            fontCollection as never
        );

        // Assert
        expect(parseEncodedTextSpy).toHaveBeenCalledWith('[(A) 30 (B)]', font as never);
        expect(updateTextMatrixSpy).toHaveBeenCalledWith(30);
        expect(ignoreEscapeSequenceSpy).toHaveBeenCalledWith('AB');
        expect(getTextRenderingMatrixSpy.calls.count()).toBe(2);
        expect(getCharacterWidthSpy.calls.count()).toBe(2);
        expect(updateTextLineMatrixSpy.calls.count()).toBe(2);
        expect(result).toBe('  AB');
        expect(extractor._tempBoundingRectangle).toEqual(extractor._boundingRectangle);
        expect(extractor._textMatrix._offsetX).toBe(extractor._textLineMatrix._offsetX);
    });

    it('should cover _renderTextElementFromTJ type3 non-layout branch with negative m12 and m21 path', () => {
        // Arrange
        const page: PdfPage = createPage(PdfRotationAngle.angle0);
        const extractor: PdfDataExtractor = createExtractor(page);

        extractor._currentFont = 'F1';
        extractor._fontSize = 8;
        extractor._isLayout = false;
        extractor._hasBeginMarkedContent = true;
        extractor._initialTransForm = new _MatrixHelper(1, 0, 0, 1, 0, 0);
        extractor._textMatrix = new _MatrixHelper(0, -5, 6, 0, 0, 0);
        extractor._textLineMatrix = new _MatrixHelper(0, -5, 6, 0, 0, 0);
        extractor._tempBoundingRectangle = { x: 0, y: 0, width: 0, height: 0 };
        extractor._boundingRectangle = { x: 0, y: 0, width: 0, height: 0 };

        const font: {
            _name: string;
            _fontStyle: PdfFontStyle;
            _isType3Font: boolean;
            _fontMatrix?: number[];
        } = {
            _name: 'Type3Font',
            _fontStyle: PdfFontStyle.bold,
            _isType3Font: true
        };

        const fontCollection: Map<string, object> = createFontCollection(font);

        const parseEncodedTextSpy: jasmine.Spy = spyOn(utilsModule, '_parseEncodedText').and.returnValue([
            ['Zs'],
            [[4]]
        ] as never);

        const ignoreEscapeSequenceSpy: jasmine.Spy = spyOn(utilsModule, '_ignoreEscapeSequence').and.callFake(function (value: string): string {
            return value;
        });

        const getTextRenderingMatrixSpy: jasmine.Spy = spyOn(extractor, '_getTextRenderingMatrix').and.returnValue(
            new _MatrixHelper(0, -3, 4, 0, 12, 16)
        );

        const getTextHeightSpy: jasmine.Spy = spyOn(extractor, '_getTextHeight').and.returnValue(9);

        const updateTextLineMatrixSpy: jasmine.Spy = spyOn(extractor, '_updateTextLineMatrix').and.stub();

        // Act
        const result: string = extractor._renderTextElementFromTJ(
            ['(Z)'],
            page,
            fontCollection as never
        );

        // Assert
        expect(parseEncodedTextSpy).toHaveBeenCalledWith('(Z)', font as never);
        expect(ignoreEscapeSequenceSpy).toHaveBeenCalledWith('Z');
        expect(getTextRenderingMatrixSpy).toHaveBeenCalled();
        expect(getTextHeightSpy).toHaveBeenCalledWith(font as never, jasmine.any(_MatrixHelper));
        expect(updateTextLineMatrixSpy).toHaveBeenCalledWith('Z', 0.004);
        expect(result).toBe('Z');
        expect(extractor._boundingRectangle.height).toBe(9);
        expect(extractor._boundingRectangle.width).toBeTruthy();
    });

    it('should cover _buildTextContentStream zero-spacing carry path and rotated final textWord bounds path', () => {
        // Arrange
        const page: PdfPage = createPage(PdfRotationAngle.angle90);
        const extractor: PdfDataExtractor = createExtractor(page);

        extractor._currentFont = 'F1';
        extractor._fontSize = 11;
        extractor._isRotatePage = true;
        extractor._textGlyph = [];
        extractor._textWord = [];
        extractor._textLine = [];
        extractor._textExtraction = [];
        extractor._extractedText = 'ROTATED';

        const font: {
            _name: string;
            _fontStyle: PdfFontStyle;
        } = {
            _name: 'Helvetica',
            _fontStyle: PdfFontStyle.italic
        };

        const fontCollection: Map<string, object> = createFontCollection(font);

        const parseEncodedTextSpy: jasmine.Spy = spyOn(utilsModule, '_parseEncodedText').and.returnValue([
            ['ABs', '0', 'Cs', '10'],
            []
        ] as never);

        const getTextWidthSpy: jasmine.Spy = spyOn(extractor, '_getTextWidth').and.callFake(function (
            textValue: string,
            extraSpacing: number,
            currentFontValue: object,
            pageValue: PdfPage,
            tempStringValue: string
        ): string {
            extractor._textGlyph = [
                {
                    _bounds: { x: 5, y: 6, width: 7, height: 8 }
                } as never
            ];
            extractor._height = 30;
            extractor._width = 25;
            return tempStringValue + textValue;
        });

        // Act
        extractor._buildTextContentStream(
            ['[(AB) 0 (C) 10]'],
            page,
            fontCollection as never
        );

        // Assert
        expect(parseEncodedTextSpy).toHaveBeenCalledWith('[(AB) 0 (C) 10]', font as never);
        expect(getTextWidthSpy.calls.count()).toBe(2);
        expect(getTextWidthSpy.calls.argsFor(0)[0]).toBe('ABC');
        expect(getTextWidthSpy.calls.argsFor(0)[1]).toBe(-0.01);
        expect(getTextWidthSpy.calls.argsFor(1)[0]).toBe('ABC');
        expect(getTextWidthSpy.calls.argsFor(1)[1]).toBe(0);
        expect(extractor._textLine.length).toBe(1);
        expect(extractor._textLine[0]._text).toBe('ROTATED');
        expect(extractor._textLine[0]._fontName).toBe('Helvetica');
        expect(extractor._textLine[0]._fontStyle).toBe(PdfFontStyle.italic);
        expect(extractor._textLine[0]._fontSize).toBe(11);
        expect(extractor._textLine[0]._pageIndex).toBe(0);
        expect(extractor._textExtraction).toEqual(['ROTATED']);
        expect(extractor._extractedText).toBe('');
        expect(extractor._width).toBe(0);
        expect(extractor._textGlyph).toEqual([]);
        expect(extractor._textWord[0]._bounds).toEqual({
            x: 5,
            y: 6,
            width: 7,
            height: 30
        });
    });

    it('should cover _buildTextContentStream non-rotated final textWord bounds path', () => {
        // Arrange
        const page: PdfPage = createPage(PdfRotationAngle.angle0);
        const extractor: PdfDataExtractor = createExtractor(page);

        extractor._currentFont = 'F1';
        extractor._fontSize = 9;
        extractor._isRotatePage = false;
        extractor._textGlyph = [];
        extractor._textWord = [];
        extractor._textLine = [];
        extractor._textExtraction = [];
        extractor._extractedText = 'NORMAL';

        const font: {
            _name: string;
            _fontStyle: PdfFontStyle;
        } = {
            _name: 'Courier',
            _fontStyle: PdfFontStyle.bold
        };

        const fontCollection: Map<string, object> = createFontCollection(font);

        spyOn(utilsModule, '_parseEncodedText').and.returnValue([
            ['ABs'],
            []
        ] as never);

        spyOn(extractor, '_getTextWidth').and.callFake(function (
            textValue: string,
            extraSpacing: number,
            currentFontValue: object,
            pageValue: PdfPage,
            tempStringValue: string
        ): string {
            extractor._textGlyph = [
                {
                    _bounds: { x: 2, y: 3, width: 4, height: 5 }
                } as never
            ];
            extractor._height = 12;
            extractor._width = 20;
            return tempStringValue + textValue;
        });

        // Act
        extractor._buildTextContentStream(
            ['[(AB)]'],
            page,
            fontCollection as never
        );

        // Assert
        expect(extractor._textWord[0]._bounds).toEqual({
            x: 2,
            y: 3,
            width: 20,
            height: 4
        });
        expect(extractor._textLine[0]._text).toBe('NORMAL');
        expect(extractor._textExtraction).toEqual(['NORMAL']);
        expect(extractor._extractedText).toBe('');
    });

    it('should cover _getTextWidth with fontMatrix branch, space branch, positive m11 branch, previousRect truthy path and charSpacing continue path', () => {
        // Arrange
        const page: PdfPage = createPage(PdfRotationAngle.angle0);
        const extractor: PdfDataExtractor = createExtractor(page);

        extractor._fontSize = 10;
        extractor._characterSpacing = 2;
        extractor._wordSpacing = 5;
        extractor._textHorizontalScaling = 100;
        extractor._textMatrix = new _MatrixHelper(2, 0, 0, 2, 10, 20);
        extractor._boundingRectangle = { x: 0, y: 0, width: 0, height: 0 };
        extractor._previousRect = { x: 1, y: 2, width: 3, height: 4 };
        extractor._extractedText = '';

        const currentFont: {
            _fontMatrix: number[];
            _name: string;
            _fontStyle: PdfFontStyle;
            _charsToGlyphs: (text: string) => { _unicode: string; _width: number }[];
        } = {
            _fontMatrix: [0.5, 0, 0, 0.5, 0, 0],
            _name: 'Helvetica',
            _fontStyle: PdfFontStyle.regular,
            _charsToGlyphs: function (): { _unicode: string; _width: number }[] {
                return [
                    { _unicode: 'A', _width: 3 },
                    { _unicode: ' ', _width: 4 }
                ];
            }
        };

        const translateTextMatrixSpy: jasmine.Spy = spyOn(extractor._parser, '_translateTextMatrix').and.callFake(function (
            xValue: number,
            yValue: number,
            matrixValue: _MatrixHelper
        ): _MatrixHelper {
            return new _MatrixHelper(
                matrixValue._m11,
                matrixValue._m12,
                matrixValue._m21,
                matrixValue._m22,
                matrixValue._offsetX + xValue,
                matrixValue._offsetY + yValue
            );
        });

        const splitWordsSpy: jasmine.Spy = spyOn(extractor, '_splitWords').and.callFake(function (
            glyphValue: string,
            tempStringValue: string
        ): string {
            return tempStringValue + glyphValue;
        });

        // Act
        const result: string = extractor._getTextWidth(
            'A ',
            1,
            currentFont as never,
            page,
            ''
        );

        // Assert
        expect(result).toBe('A ');
        expect(extractor._extractedText).toBe('A ');
        expect(splitWordsSpy.calls.count()).toBe(2);
        expect(translateTextMatrixSpy.calls.count()).toBe(3);
        expect(extractor._boundingRectangle.x).toBeGreaterThan(0);
        expect(extractor._boundingRectangle.y).toBeGreaterThan(0);
        expect(extractor._previousRect).toEqual({
            x: extractor._boundingRectangle.x,
            y: extractor._boundingRectangle.y,
            width: extractor._boundingRectangle.width,
            height: extractor._boundingRectangle.height
        });
    });

    it('should cover _getTextWidth with missing fontMatrix branch, negative m12 branch, non-space branch and previousRect null reset path', () => {
        // Arrange
        const page: PdfPage = createPage(PdfRotationAngle.angle0);
        const extractor: PdfDataExtractor = createExtractor(page);

        extractor._fontSize = 8;
        extractor._characterSpacing = 1;
        extractor._wordSpacing = 0;
        extractor._textHorizontalScaling = 100;
        extractor._textMatrix = new _MatrixHelper(0, -3, 4, -2, 6, 7);
        extractor._boundingRectangle = { x: 0, y: 0, width: 0, height: 0 };
        extractor._previousRect = null as never;
        extractor._extractedText = '';

        const currentFont: {
            _name: string;
            _fontStyle: PdfFontStyle;
            _charsToGlyphs: (text: string) => { _unicode: string; _width: number }[];
        } = {
            _name: 'Type3Like',
            _fontStyle: PdfFontStyle.bold,
            _charsToGlyphs: function (): { _unicode: string; _width: number }[] {
                return [
                    { _unicode: 'Z', _width: 2 }
                ];
            }
        };

        const translateTextMatrixSpy: jasmine.Spy = spyOn(extractor._parser, '_translateTextMatrix').and.callFake(function (
            xValue: number,
            yValue: number,
            matrixValue: _MatrixHelper
        ): _MatrixHelper {
            return new _MatrixHelper(
                matrixValue._m11,
                matrixValue._m12,
                matrixValue._m21,
                matrixValue._m22,
                matrixValue._offsetX + xValue,
                matrixValue._offsetY + yValue
            );
        });

        const splitWordsSpy: jasmine.Spy = spyOn(extractor, '_splitWords').and.callFake(function (
            glyphValue: string,
            tempStringValue: string,
            fontNameValue: string,
            fontStyleValue: PdfFontStyle,
            pageValue: PdfPage
        ): string {
            return tempStringValue + glyphValue;
        });

        // Act
        const result: string = extractor._getTextWidth(
            'Z',
            0,
            currentFont as never,
            page,
            ''
        );

        // Assert
        expect(result).toBe('Z');
        expect(splitWordsSpy).toHaveBeenCalledWith('Z', '', 'Type3Like', PdfFontStyle.bold, page);
        expect(translateTextMatrixSpy.calls.count()).toBe(2);
        expect(extractor._previousRect).toEqual({ x: 0, y: 0, width: 0, height: 0 });
        expect(extractor._boundingRectangle.width).toBeGreaterThan(0);
        expect(extractor._boundingRectangle.height).toBeTruthy();
        expect(extractor._extractedText).toBe('Z');
    });

    it('should cover _splitWords space branch with tempString flush, color assignment, rotated glyph and reset state', () => {
        // Arrange
        const page: PdfPage = createPage(PdfRotationAngle.angle90);
        const extractor: PdfDataExtractor = createExtractor(page);

        extractor._fontSize = 10;
        extractor._boundingRectangle = { x: 1, y: 2, width: 3, height: 4 };
        extractor._textGlyph = [
            {
                _bounds: { x: 4, y: 5, width: 6, height: 7 }
            } as never
        ];
        extractor._textWord = [];
        extractor._width = 20;
        extractor._height = 30;
        extractor._previousRect = { x: 1, y: 2, width: 3, height: 4 };

        // Act
        const result: string = extractor._splitWords(
            ' ',
            'AB',
            'Arial',
            PdfFontStyle.regular,
            page,
            90,
            [1, 2, 3]
        );

        // Assert
        expect(result).toBe('');
        expect(extractor._textWord.length).toBe(2);
        expect(extractor._textWord[0]._text).toBe('AB');
        expect(extractor._textWord[1]._text).toBe(' ');
        expect(extractor._width).toBe(0);
        expect(extractor._height).toBe(0);
        expect(extractor._textGlyph).toEqual([]);
        expect(extractor._previousRect).toBeNull();
    });

    it('should cover _splitWords non-space spacing branch for angle90 and flush previous glyphs', () => {
        // Arrange
        const page: PdfPage = createPage(PdfRotationAngle.angle90);
        const extractor: PdfDataExtractor = createExtractor(page);

        extractor._fontSize = 10;
        extractor._boundingRectangle = { x: 1, y: 0, width: 4, height: 10 };
        extractor._previousRect = { x: 0, y: 20, width: 4, height: 10 };
        extractor._textGlyph = [
            {
                _bounds: { x: 0, y: 20, width: 4, height: 10 }
            } as never
        ];
        extractor._textWord = [];
        extractor._height = 10;
        extractor._width = 0;

        // Act
        const result: string = extractor._splitWords(
            'B',
            'A',
            'Arial',
            PdfFontStyle.regular,
            page
        );

        // Assert
        expect(result).toBe('B');
        expect(extractor._textWord.length).toBe(1);
        expect(extractor._textWord[0]._text).toBe('A');
        expect(extractor._height).toBe(10);
        expect(extractor._width).toBe(0);
        expect(extractor._previousRect).toEqual({ x: 0, y: 0, width: 0, height: 0 });
        expect(extractor._textGlyph.length).toBe(1);
        expect(extractor._textGlyph[0]._text).toBe('B');
        expect(extractor._textGlyph[0]._isRotated).toBeFalsy();
    });

    it('should cover _splitWords non-space spacing branches for rotation 90, angle180 and default difference paths', () => {
        // Arrange
        const pageAngle0: PdfPage = createPage(PdfRotationAngle.angle0);
        const pageAngle180: PdfPage = createPage(PdfRotationAngle.angle180);
        const extractor: PdfDataExtractor = createExtractor(pageAngle0);

        extractor._fontSize = 11;

        extractor._boundingRectangle = { x: 0, y: 20, width: 5, height: 10 };
        extractor._previousRect = { x: 0, y: 0, width: 5, height: 5 };
        extractor._textGlyph = [{ _bounds: { x: 0, y: 0, width: 5, height: 5 } } as never];
        extractor._textWord = [];
        extractor._height = 5;
        extractor._width = 5;

        const rotation90Result: string = extractor._splitWords(
            'C',
            'B',
            'Arial',
            PdfFontStyle.bold,
            pageAngle0,
            90,
            [4, 5, 6]
        );

        extractor._boundingRectangle = { x: 20, y: 0, width: 10, height: 10 };
        extractor._previousRect = { x: 5, y: 0, width: 5, height: 5 };
        extractor._textGlyph = [{ _bounds: { x: 5, y: 0, width: 5, height: 5 } } as never];
        extractor._height = 0;
        extractor._width = 5;

        const angle180Result: string = extractor._splitWords(
            'D',
            'C',
            'Arial',
            PdfFontStyle.bold,
            pageAngle180
        );

        extractor._boundingRectangle = { x: 40, y: 0, width: 10, height: 10 };
        extractor._previousRect = { x: 5, y: 0, width: 5, height: 5 };
        extractor._textGlyph = [{ _bounds: { x: 5, y: 0, width: 5, height: 5 } } as never];
        extractor._height = 0;
        extractor._width = 5;

        const defaultResult: string = extractor._splitWords(
            'E',
            'D',
            'Arial',
            PdfFontStyle.bold,
            pageAngle0
        );

        // Assert
        expect(rotation90Result).toBe('C');
        expect(angle180Result).toBe('D');
        expect(defaultResult).toBe('E');
        expect(extractor._textWord.length).toBeGreaterThan(0);
        expect(extractor._textGlyph.length).toBe(1);
        expect(extractor._textGlyph[0]._text).toBe('E');
        expect(extractor._textGlyph[0]._color).toBeUndefined();
        expect(extractor._textGlyph[0]._isRotated).toBeFalsy();
    });

    it('should cover highlighted _getStructureElement lines for parent-tag fallback, orderSet add, duplicate-protected push and single-dictionary no-parent path', () => {
        // Arrange
        const page: PdfPage = createPage(PdfRotationAngle.angle0);
        const extractor: PdfDataExtractor = createExtractor(page);

        const parentPageDictionary: _PdfDictionary = createPdfDictionary({ Name: 'Pg' });

        const leafDictionary: _PdfDictionary = createPdfDictionary({
            Pg: parentPageDictionary
        });

        const nestedDictionary: _PdfDictionary = createPdfDictionary({
            K: leafDictionary
        });

        const arrayDictionary: _PdfDictionary = createPdfDictionary({
            K: [nestedDictionary]
        });

        const parentElement: PdfStructureElement = PdfStructureElement._load((extractor as unknown as { _document: object })._document as never);
        parentElement._tagType = PdfTagType.link;
        parentElement._childElements = [];
        parentElement._contentId = [];

        // Act
        const arrayResult: PdfStructureElement = extractor._getStructureElement(
            arrayDictionary,
            parentElement
        );

        const singleDictionaryRoot: _PdfDictionary = createPdfDictionary({
            K: leafDictionary
        });

        const singleResult: PdfStructureElement = extractor._getStructureElement(
            singleDictionaryRoot
        );

        // Assert
        expect(arrayResult).toBeNull();
        expect(parentElement._childElements.length).toBe(1);
        expect(parentElement._childElements[0]._tagType).toBe(PdfTagType.link);
        expect(extractor._elementCollection.length).toBeGreaterThan(0);
        expect(extractor._orderSet.size).toBeGreaterThan(0);
        expect(singleResult).toBeDefined();
        expect(singleResult._pageDictionary).toBe(parentPageDictionary);
    });
});
describe('PdfDataExtractor strict AAA highlighted coverage', () => {
    function createPage(rotation: PdfRotationAngle): PdfPage {
        return {
            _pageIndex: 0,
            rotation: rotation,
            size: { width: 200, height: 100 }
        } as unknown as PdfPage;
    }

    function createDocument(page: PdfPage): PdfDocument {
        return {
            pageCount: 1,
            _crossReference: {} as _PdfCrossReference,
            getPage: function (): PdfPage {
                return page;
            },
            _catalog: {
                _catalogDictionary: createPdfDictionary({})
            }
        } as unknown as PdfDocument;
    }

    function createExtractor(page: PdfPage): PdfDataExtractor {
        return new PdfDataExtractor(createDocument(page));
    }

    function createPdfDictionary(values: { [key: string]: unknown }): _PdfDictionary {
        const dictionary: _PdfDictionary = Object.create(_PdfDictionary.prototype) as _PdfDictionary;
        Object.defineProperty(dictionary, 'has', {
            value: function (key: string): boolean {
                return Object.prototype.hasOwnProperty.call(values, key);
            },
            writable: true,
            configurable: true
        });
        Object.defineProperty(dictionary, 'get', {
            value: function (key: string): unknown {
                return values[key];
            },
            writable: true,
            configurable: true
        });
        Object.defineProperty(dictionary, 'getArray', {
            value: function (key: string): unknown {
                return values[key];
            },
            writable: true,
            configurable: true
        });
        return dictionary;
    }

    function createFontCollection(font: object): Map<string, object> {
        const fontCollection: Map<string, object> = new Map<string, object>();
        fontCollection.set('F1', font);
        return fontCollection;
    }

    function createRecord(operator: string, operands: string[]): { _operator: string; _operands: string[] } {
        return {
            _operator: operator,
            _operands: operands
        };
    }

    it('should initialize constructor fields with and without callback and push the CTM object', () => {
        // Arrange
        const page: PdfPage = createPage(PdfRotationAngle.angle0);
        const document: PdfDocument = createDocument(page);
        const callbackResult: { canvas: object; applicationPlatform: ApplicationPlatform } = {
            canvas: { marker: 'canvas' },
            applicationPlatform: ApplicationPlatform.typescript
        };
        const callback: canvasRenderCallback = function (): { canvas: any; applicationPlatform: ApplicationPlatform } {
            return callbackResult;
        };
        const crossReference: _PdfCrossReference =
            (document as unknown as { _crossReference: _PdfCrossReference })._crossReference;

        // Act
        const extractorWithoutCallback: PdfDataExtractor = new PdfDataExtractor(document);
        const extractorWithCallback: PdfDataExtractor = new PdfDataExtractor(document, callback);

        // Assert
        expect(extractorWithoutCallback._document).toBe(document);
        expect(extractorWithoutCallback._crossReference).toBe(crossReference);
        expect(extractorWithoutCallback._objects.length).toBe(1);
        expect(extractorWithoutCallback._objects[0]).toBe(extractorWithoutCallback._ctm);

        expect(extractorWithCallback._document).toBe(document);
        expect(extractorWithCallback._crossReference).toBe(crossReference);
        expect(extractorWithCallback._canvas).toEqual(callbackResult);
        expect(extractorWithCallback._objects.length).toBe(1);
        expect(extractorWithCallback._objects[0]).toBe(extractorWithCallback._ctm);
    });

    it('should cover the highlighted _updateTextMatrix offsetY path when point[0] equals point2[0]', () => {
        // Arrange
        const extractor: PdfDataExtractor = createExtractor(createPage(PdfRotationAngle.angle0));
        extractor._fontSize = 10;
        extractor._textHorizontalScaling = 100;
        extractor._textLineMatrix = new _MatrixHelper(0, 2, 1, 0, 10, 20);

        // Act
        const result: _MatrixHelper = extractor._updateTextMatrix(100);

        // Assert
        expect(result).toBe(extractor._textLineMatrix);
        expect(extractor._textLineMatrix._offsetX).toBe(10);
        expect(extractor._textLineMatrix._offsetY).not.toBe(20);
    });

    it('should cover the highlighted tempFontSize positive m12 branch in _renderTextElementFromTJ', () => {
        // Arrange
        const page: PdfPage = createPage(PdfRotationAngle.angle0);
        const extractor: PdfDataExtractor = createExtractor(page);

        extractor._currentFont = 'F1';
        extractor._fontSize = 8;
        extractor._isLayout = false;
        extractor._hasBeginMarkedContent = true;
        extractor._initialTransForm = new _MatrixHelper(1, 0, 0, 1, 0, 0);
        extractor._textMatrix = new _MatrixHelper(0, 3, 4, 0, 0, 0);
        extractor._textLineMatrix = new _MatrixHelper(0, 3, 4, 0, 0, 0);
        extractor._tempBoundingRectangle = { x: 0, y: 0, width: 0, height: 0 };
        extractor._boundingRectangle = { x: 0, y: 0, width: 0, height: 0 };

        const font: {
            _name: string;
            _fontStyle: PdfFontStyle;
            _isType3Font: boolean;
            _fontMatrix?: number[];
        } = {
            _name: 'TypeLike',
            _fontStyle: PdfFontStyle.bold,
            _isType3Font: false
        };

        const fontCollection: Map<string, object> = createFontCollection(font);

        const parseEncodedTextSpy: jasmine.Spy = spyOn(utilsModule, '_parseEncodedText').and.returnValue([
            ['Xs'],
            [[2]]
        ] as never);

        const ignoreEscapeSequenceSpy: jasmine.Spy = spyOn(utilsModule, '_ignoreEscapeSequence').and.callFake(function (value: string): string {
            return value;
        });

        const getTextRenderingMatrixSpy: jasmine.Spy = spyOn(extractor, '_getTextRenderingMatrix').and.returnValue(
            new _MatrixHelper(0, 3, 4, 0, 12, 16)
        );

        const updateTextLineMatrixSpy: jasmine.Spy = spyOn(extractor, '_updateTextLineMatrix').and.stub();

        // Act
        const result: string = extractor._renderTextElementFromTJ(
            ['(X)'],
            page,
            fontCollection as never
        );

        // Assert
        expect(parseEncodedTextSpy).toHaveBeenCalledWith('(X)', font as never);
        expect(ignoreEscapeSequenceSpy).toHaveBeenCalledWith('X');
        expect(getTextRenderingMatrixSpy).toHaveBeenCalled();
        expect(updateTextLineMatrixSpy).toHaveBeenCalled();
        expect(result).toBe('X');
        expect(extractor._boundingRectangle.width).toBeCloseTo(0.006, 10);
        expect(extractor._boundingRectangle.height).toBe(3);
    });
    it('should cover highlighted single-quote, TJ and Tj lines in _renderTextAsLayOut for rotated flow using _buildTextContentStream', () => {
        // Arrange
        const page: PdfPage = createPage(PdfRotationAngle.angle90);
        const extractor: PdfDataExtractor = createExtractor(page);

        extractor._isLayout = false;
        extractor._isRotatePage = true;
        extractor._fontSize = 9;
        extractor._textLeading = 4;
        extractor._textMatrix = new _MatrixHelper(1, 0, 0, 1, 0, 5);
        extractor._textLineMatrix = new _MatrixHelper(1, 0, 0, 1, 0, 5);
        extractor._currentTextMatrix = new _MatrixHelper(1, 0, 0, 1, 1, 1);
        extractor._objects = [extractor._ctm];

        const buildTextContentStreamSpy: jasmine.Spy = spyOn(extractor, '_buildTextContentStream').and.stub();
        const renderTextElementFromTJSpy: jasmine.Spy = spyOn(extractor, '_renderTextElementFromTJ').and.returnValue('SHOULD_NOT_RUN');
        const moveToNextLineSpy: jasmine.Spy = spyOn(extractor, '_moveToNextLine').and.callFake(function (): void {
            extractor._textLineMatrix = new _MatrixHelper(1, 0, 0, 1, 0, 5);
            extractor._textMatrix = extractor._textLineMatrix;
        });

        const recordCollection: { _operator: string; _operands: string[] }[] = [
            createRecord('\'', ['(A)']),
            createRecord('TJ', ['[(B)]']),
            createRecord('Tj', ['(C)'])
        ];

        // Act
        extractor._renderTextAsLayOut(
            recordCollection as never,
            page,
            new Map<string, never>(),
            new Map<string, never>()
        );

        // Assert
        expect(moveToNextLineSpy).toHaveBeenCalled();
        expect(buildTextContentStreamSpy.calls.count()).toBe(3);
        expect(renderTextElementFromTJSpy).not.toHaveBeenCalled();
    });

    it('should cover _buildTextContentStream zero-spacing carry path and rotated final textWord bounds path', () => {
        // Arrange
        const page: PdfPage = createPage(PdfRotationAngle.angle90);
        const extractor: PdfDataExtractor = createExtractor(page);

        extractor._currentFont = 'F1';
        extractor._fontSize = 11;
        extractor._isRotatePage = true;
        extractor._textGlyph = [];
        extractor._textWord = [];
        extractor._textLine = [];
        extractor._textExtraction = [];
        extractor._extractedText = 'ROTATED';

        const font: {
            _name: string;
            _fontStyle: PdfFontStyle;
        } = {
            _name: 'Helvetica',
            _fontStyle: PdfFontStyle.italic
        };

        const fontCollection: Map<string, object> = createFontCollection(font);

        const parseEncodedTextSpy: jasmine.Spy = spyOn(utilsModule, '_parseEncodedText').and.returnValue([
            ['ABs', '0', 'Cs', '10'],
            []
        ] as never);

        const getTextWidthSpy: jasmine.Spy = spyOn(extractor, '_getTextWidth').and.callFake(function (
            textValue: string,
            extraSpacing: number,
            currentFontValue: object,
            pageValue: PdfPage,
            tempStringValue: string
        ): string {
            extractor._textGlyph = [
                {
                    _bounds: { x: 5, y: 6, width: 7, height: 8 }
                } as never
            ];
            extractor._height = 30;
            extractor._width = 25;
            return tempStringValue + textValue;
        });

        // Act
        extractor._buildTextContentStream(
            ['[(AB) 0 (C) 10]'],
            page,
            fontCollection as never
        );

        // Assert
        expect(parseEncodedTextSpy).toHaveBeenCalledWith('[(AB) 0 (C) 10]', font as never);
        expect(getTextWidthSpy.calls.count()).toBe(2);
        expect(getTextWidthSpy.calls.argsFor(0)[0]).toBe('ABC');
        expect(getTextWidthSpy.calls.argsFor(0)[1]).toBe(-0.01);
        expect(getTextWidthSpy.calls.argsFor(1)[0]).toBe('ABC');
        expect(getTextWidthSpy.calls.argsFor(1)[1]).toBe(0);
        expect(extractor._textLine.length).toBe(1);
        expect(extractor._textLine[0]._text).toBe('ROTATED');
        expect(extractor._textLine[0]._fontName).toBe('Helvetica');
        expect(extractor._textLine[0]._fontStyle).toBe(PdfFontStyle.italic);
        expect(extractor._textLine[0]._fontSize).toBe(11);
        expect(extractor._textLine[0]._pageIndex).toBe(0);
        expect(extractor._textExtraction).toEqual(['ROTATED']);
        expect(extractor._extractedText).toBe('');
        expect(extractor._width).toBe(0);
        expect(extractor._textGlyph).toEqual([]);
        expect(extractor._textWord[0]._bounds).toEqual({
            x: 5,
            y: 6,
            width: 7,
            height: 30
        });
    });

    it('should cover _buildTextContentStream non-rotated final textWord bounds path', () => {
        // Arrange
        const page: PdfPage = createPage(PdfRotationAngle.angle0);
        const extractor: PdfDataExtractor = createExtractor(page);

        extractor._currentFont = 'F1';
        extractor._fontSize = 9;
        extractor._isRotatePage = false;
        extractor._textGlyph = [];
        extractor._textWord = [];
        extractor._textLine = [];
        extractor._textExtraction = [];
        extractor._extractedText = 'NORMAL';

        const font: {
            _name: string;
            _fontStyle: PdfFontStyle;
        } = {
            _name: 'Courier',
            _fontStyle: PdfFontStyle.bold
        };

        const fontCollection: Map<string, object> = createFontCollection(font);

        spyOn(utilsModule, '_parseEncodedText').and.returnValue([
            ['ABs'],
            []
        ] as never);

        spyOn(extractor, '_getTextWidth').and.callFake(function (
            textValue: string,
            extraSpacing: number,
            currentFontValue: object,
            pageValue: PdfPage,
            tempStringValue: string
        ): string {
            extractor._textGlyph = [
                {
                    _bounds: { x: 2, y: 3, width: 4, height: 5 }
                } as never
            ];
            extractor._height = 12;
            extractor._width = 20;
            return tempStringValue + textValue;
        });

        // Act
        extractor._buildTextContentStream(
            ['[(AB)]'],
            page,
            fontCollection as never
        );

        // Assert
        expect(extractor._textWord[0]._bounds).toEqual({
            x: 2,
            y: 3,
            width: 20,
            height: 4
        });
        expect(extractor._textLine[0]._text).toBe('NORMAL');
        expect(extractor._textExtraction).toEqual(['NORMAL']);
        expect(extractor._extractedText).toBe('');
    });

    it('should cover _getTextWidth with fontMatrix branch, space branch, positive m11 branch, previousRect truthy path and charSpacing continue path', () => {
        // Arrange
        const page: PdfPage = createPage(PdfRotationAngle.angle0);
        const extractor: PdfDataExtractor = createExtractor(page);

        extractor._fontSize = 10;
        extractor._characterSpacing = 2;
        extractor._wordSpacing = 5;
        extractor._textHorizontalScaling = 100;
        extractor._textMatrix = new _MatrixHelper(2, 0, 0, 2, 10, 20);
        extractor._boundingRectangle = { x: 0, y: 0, width: 0, height: 0 };
        extractor._previousRect = { x: 1, y: 2, width: 3, height: 4 };
        extractor._extractedText = '';

        const currentFont: {
            _fontMatrix: number[];
            _name: string;
            _fontStyle: PdfFontStyle;
            _charsToGlyphs: (text: string) => { _unicode: string; _width: number }[];
        } = {
            _fontMatrix: [0.5, 0, 0, 0.5, 0, 0],
            _name: 'Helvetica',
            _fontStyle: PdfFontStyle.regular,
            _charsToGlyphs: function (): { _unicode: string; _width: number }[] {
                return [
                    { _unicode: 'A', _width: 3 },
                    { _unicode: ' ', _width: 4 }
                ];
            }
        };

        const translateTextMatrixSpy: jasmine.Spy = spyOn(extractor._parser, '_translateTextMatrix').and.callFake(function (
            xValue: number,
            yValue: number,
            matrixValue: _MatrixHelper
        ): _MatrixHelper {
            return new _MatrixHelper(
                matrixValue._m11,
                matrixValue._m12,
                matrixValue._m21,
                matrixValue._m22,
                matrixValue._offsetX + xValue,
                matrixValue._offsetY + yValue
            );
        });

        const splitWordsSpy: jasmine.Spy = spyOn(extractor, '_splitWords').and.callFake(function (
            glyphValue: string,
            tempStringValue: string
        ): string {
            return tempStringValue + glyphValue;
        });

        // Act
        const result: string = extractor._getTextWidth(
            'A ',
            1,
            currentFont as never,
            page,
            ''
        );

        // Assert
        expect(result).toBe('A ');
        expect(extractor._extractedText).toBe('A ');
        expect(splitWordsSpy.calls.count()).toBe(2);
        expect(translateTextMatrixSpy.calls.count()).toBe(3);
        expect(extractor._boundingRectangle.x).toBeGreaterThan(0);
        expect(extractor._boundingRectangle.y).toBeGreaterThan(0);
        expect(extractor._previousRect).toEqual({
            x: extractor._boundingRectangle.x,
            y: extractor._boundingRectangle.y,
            width: extractor._boundingRectangle.width,
            height: extractor._boundingRectangle.height
        });
    });
    it('should cover _splitWords space branch with tempString flush, color assignment, rotated glyph and reset state', () => {
        // Arrange
        const page: PdfPage = createPage(PdfRotationAngle.angle90);
        const extractor: PdfDataExtractor = createExtractor(page);

        extractor._fontSize = 10;
        extractor._boundingRectangle = { x: 1, y: 2, width: 3, height: 4 };
        extractor._textGlyph = [
            {
                _bounds: { x: 4, y: 5, width: 6, height: 7 }
            } as never
        ];
        extractor._textWord = [];
        extractor._width = 20;
        extractor._height = 30;
        extractor._previousRect = { x: 1, y: 2, width: 3, height: 4 };

        // Act
        const result: string = extractor._splitWords(
            ' ',
            'AB',
            'Arial',
            PdfFontStyle.regular,
            page,
            90,
            [1, 2, 3]
        );

        // Assert
        expect(result).toBe('');
        expect(extractor._textWord.length).toBe(2);
        expect(extractor._textWord[0]._text).toBe('AB');
        expect(extractor._textWord[1]._text).toBe(' ');
        expect(extractor._width).toBe(0);
        expect(extractor._height).toBe(0);
        expect(extractor._textGlyph).toEqual([]);
        expect(extractor._previousRect).toBeNull();
    });

    it('should cover _splitWords non-space spacing branch for angle90 and flush previous glyphs', () => {
        // Arrange
        const page: PdfPage = createPage(PdfRotationAngle.angle90);
        const extractor: PdfDataExtractor = createExtractor(page);

        extractor._fontSize = 10;
        extractor._boundingRectangle = { x: 1, y: 0, width: 4, height: 10 };
        extractor._previousRect = { x: 0, y: 20, width: 4, height: 10 };
        extractor._textGlyph = [
            {
                _bounds: { x: 0, y: 20, width: 4, height: 10 }
            } as never
        ];
        extractor._textWord = [];
        extractor._height = 10;
        extractor._width = 0;

        // Act
        const result: string = extractor._splitWords(
            'B',
            'A',
            'Arial',
            PdfFontStyle.regular,
            page
        );

        // Assert
        expect(result).toBe('B');
        expect(extractor._textWord.length).toBe(1);
        expect(extractor._textWord[0]._text).toBe('A');
        expect(extractor._height).toBe(10);
        expect(extractor._width).toBe(0);
        expect(extractor._previousRect).toEqual({ x: 0, y: 0, width: 0, height: 0 });
        expect(extractor._textGlyph.length).toBe(1);
        expect(extractor._textGlyph[0]._text).toBe('B');
        expect(extractor._textGlyph[0]._isRotated).toBeFalsy();
    });

    it('should cover _splitWords non-space spacing branches for rotation 90, angle180 and default difference paths', () => {
        // Arrange
        const pageAngle0: PdfPage = createPage(PdfRotationAngle.angle0);
        const pageAngle180: PdfPage = createPage(PdfRotationAngle.angle180);
        const extractor: PdfDataExtractor = createExtractor(pageAngle0);

        extractor._fontSize = 11;

        extractor._boundingRectangle = { x: 0, y: 20, width: 5, height: 10 };
        extractor._previousRect = { x: 0, y: 0, width: 5, height: 5 };
        extractor._textGlyph = [{ _bounds: { x: 0, y: 0, width: 5, height: 5 } } as never];
        extractor._textWord = [];
        extractor._height = 5;
        extractor._width = 5;

        const rotation90Result: string = extractor._splitWords(
            'C',
            'B',
            'Arial',
            PdfFontStyle.bold,
            pageAngle0,
            90,
            [4, 5, 6]
        );

        extractor._boundingRectangle = { x: 20, y: 0, width: 10, height: 10 };
        extractor._previousRect = { x: 5, y: 0, width: 5, height: 5 };
        extractor._textGlyph = [{ _bounds: { x: 5, y: 0, width: 5, height: 5 } } as never];
        extractor._height = 0;
        extractor._width = 5;

        const angle180Result: string = extractor._splitWords(
            'D',
            'C',
            'Arial',
            PdfFontStyle.bold,
            pageAngle180
        );

        extractor._boundingRectangle = { x: 40, y: 0, width: 10, height: 10 };
        extractor._previousRect = { x: 5, y: 0, width: 5, height: 5 };
        extractor._textGlyph = [{ _bounds: { x: 5, y: 0, width: 5, height: 5 } } as never];
        extractor._height = 0;
        extractor._width = 5;

        const defaultResult: string = extractor._splitWords(
            'E',
            'D',
            'Arial',
            PdfFontStyle.bold,
            pageAngle0
        );

        // Assert
        expect(rotation90Result).toBe('C');
        expect(angle180Result).toBe('D');
        expect(defaultResult).toBe('E');
        expect(extractor._textWord.length).toBeGreaterThan(0);
        expect(extractor._textGlyph.length).toBe(1);
        expect(extractor._textGlyph[0]._text).toBe('E');
        expect(extractor._textGlyph[0]._color).toBeUndefined();
        expect(extractor._textGlyph[0]._isRotated).toBeFalsy();
    });

    it('should cover highlighted _getStructureElement lines for array recursion tempElement push and parent duplicate-protected push', () => {
        // Arrange
        const page: PdfPage = createPage(PdfRotationAngle.angle0);
        const extractor: PdfDataExtractor = createExtractor(page);

        const leafDictionary: _PdfDictionary = createPdfDictionary({});
        const nestedDictionary: _PdfDictionary = createPdfDictionary({
            K: leafDictionary
        });
        const rootDictionary: _PdfDictionary = createPdfDictionary({
            K: [nestedDictionary]
        });

        const parentElement: PdfStructureElement = PdfStructureElement._load((extractor as unknown as { _document: PdfDocument })._document);
        parentElement._tagType = PdfTagType.link;
        parentElement._childElements = [];
        parentElement._contentId = [];

        // Act
        const result: PdfStructureElement = extractor._getStructureElement(
            rootDictionary,
            parentElement
        );

        // Assert
        expect(result).toBeNull();
        expect(parentElement._childElements.length).toBe(1);
        expect(parentElement._childElements[0]._childElements.length).toBe(1);
        expect(extractor._elementCollection.length).toBe(2);
        expect(extractor._orderSet.size).toBe(2);
    });

    it('should cover highlighted _getStructureElement lines for single dictionary parent-tag fallback, nested K tempElement push and Pg assignment', () => {
        // Arrange
        const page: PdfPage = createPage(PdfRotationAngle.angle0);
        const extractor: PdfDataExtractor = createExtractor(page);

        const pageDictionary: _PdfDictionary = createPdfDictionary({ Name: 'Pg' });
        const childDictionary: _PdfDictionary = createPdfDictionary({
            Pg: pageDictionary
        });
        const elementsDictionary: _PdfDictionary = createPdfDictionary({
            K: childDictionary,
            Pg: pageDictionary
        });
        const rootDictionary: _PdfDictionary = createPdfDictionary({
            K: elementsDictionary
        });

        const parentElement: PdfStructureElement = PdfStructureElement._load((extractor as unknown as { _document: PdfDocument })._document);
        parentElement._tagType = PdfTagType.annotation;
        parentElement._childElements = [];

        // Act
        const result: PdfStructureElement = extractor._getStructureElement(
            rootDictionary,
            parentElement
        );

        // Assert
        expect(result).toBeDefined();
        expect(result._tagType).toBe(PdfTagType.annotation);
        expect(result._childElements.length).toBe(1);
        expect(result._pageDictionary).toBe(pageDictionary);
        expect(extractor._elementCollection.length).toBe(2);
        expect(extractor._orderSet.size).toBe(2);
    });
});

import {
    _PdfCrossReference,
} from '@syncfusion/ej2-pdf';
import { canvasRenderCallback } from '../../src/pdf-data-extract/core/utils';
import { ApplicationPlatform } from '../../src/pdf-data-extract/core/image-extraction/image';

describe('PdfDataExtractor strict AAA highlighted coverage', () => {
    function createPage(rotation: PdfRotationAngle): PdfPage {
        return {
            _pageIndex: 0,
            rotation: rotation,
            size: { width: 200, height: 100 }
        } as unknown as PdfPage;
    }

    function createDocument(page: PdfPage): PdfDocument {
        return {
            pageCount: 1,
            _crossReference: {} as _PdfCrossReference,
            getPage: function (): PdfPage {
                return page;
            },
            _catalog: {
                _catalogDictionary: createPdfDictionary({})
            }
        } as unknown as PdfDocument;
    }

    function createExtractor(page: PdfPage): PdfDataExtractor {
        return new PdfDataExtractor(createDocument(page));
    }

    function createPdfDictionary(values: { [key: string]: unknown }): _PdfDictionary {
        const dictionary: _PdfDictionary = Object.create(_PdfDictionary.prototype) as _PdfDictionary;
        Object.defineProperty(dictionary, 'has', {
            value: function (key: string): boolean {
                return Object.prototype.hasOwnProperty.call(values, key);
            },
            writable: true,
            configurable: true
        });
        Object.defineProperty(dictionary, 'get', {
            value: function (key: string): unknown {
                return values[key];
            },
            writable: true,
            configurable: true
        });
        Object.defineProperty(dictionary, 'getArray', {
            value: function (key: string): unknown {
                return values[key];
            },
            writable: true,
            configurable: true
        });
        return dictionary;
    }

    function createFontCollection(font: object): Map<string, object> {
        const fontCollection: Map<string, object> = new Map<string, object>();
        fontCollection.set('F1', font);
        return fontCollection;
    }

    function createRecord(operator: string, operands: string[]): { _operator: string; _operands: string[] } {
        return {
            _operator: operator,
            _operands: operands
        };
    }

    it('should initialize constructor fields with and without callback and push the CTM object', () => {
        // Arrange
        const page: PdfPage = createPage(PdfRotationAngle.angle0);
        const document: PdfDocument = createDocument(page);
        const callbackResult: { canvas: object; applicationPlatform: ApplicationPlatform } = {
            canvas: { marker: 'canvas' },
            applicationPlatform: ApplicationPlatform.typescript
        };
        const callback: canvasRenderCallback = function (): { canvas: any; applicationPlatform: ApplicationPlatform } {
            return callbackResult;
        };
        const crossReference: _PdfCrossReference =
            (document as unknown as { _crossReference: _PdfCrossReference })._crossReference;

        // Act
        const extractorWithoutCallback: PdfDataExtractor = new PdfDataExtractor(document);
        const extractorWithCallback: PdfDataExtractor = new PdfDataExtractor(document, callback);

        // Assert
        expect(extractorWithoutCallback._document).toBe(document);
        expect(extractorWithoutCallback._crossReference).toBe(crossReference);
        expect(extractorWithoutCallback._objects.length).toBe(1);
        expect(extractorWithoutCallback._objects[0]).toBe(extractorWithoutCallback._ctm);

        expect(extractorWithCallback._document).toBe(document);
        expect(extractorWithCallback._crossReference).toBe(crossReference);
        expect(extractorWithCallback._canvas).toEqual(callbackResult);
        expect(extractorWithCallback._objects.length).toBe(1);
        expect(extractorWithCallback._objects[0]).toBe(extractorWithCallback._ctm);
    });

    it('should cover the highlighted _updateTextMatrix offsetY branch when point[0] equals point2[0]', () => {
        // Arrange
        const extractor: PdfDataExtractor = createExtractor(createPage(PdfRotationAngle.angle0));
        extractor._fontSize = 10;
        extractor._textHorizontalScaling = 100;
        extractor._textLineMatrix = new _MatrixHelper(0, 2, 1, 0, 10, 20);

        // Act
        const result: _MatrixHelper = extractor._updateTextMatrix(100);

        // Assert
        expect(result).toBe(extractor._textLineMatrix);
        expect(extractor._textLineMatrix._offsetX).toBe(10);
        expect(extractor._textLineMatrix._offsetY).not.toBe(20);
    });

    it('should cover highlighted single-quote, TJ and Tj lines in _renderTextAsLayOut for rotated flow using _buildTextContentStream', () => {
        // Arrange
        const page: PdfPage = createPage(PdfRotationAngle.angle90);
        const extractor: PdfDataExtractor = createExtractor(page);

        extractor._isLayout = false;
        extractor._isRotatePage = true;
        extractor._fontSize = 9;
        extractor._textLeading = 4;
        extractor._textMatrix = new _MatrixHelper(1, 0, 0, 1, 0, 5);
        extractor._textLineMatrix = new _MatrixHelper(1, 0, 0, 1, 0, 5);
        extractor._currentTextMatrix = new _MatrixHelper(1, 0, 0, 1, 1, 1);
        extractor._objects = [extractor._ctm];

        const buildTextContentStreamSpy: jasmine.Spy = spyOn(extractor, '_buildTextContentStream').and.stub();
        const renderTextElementFromTJSpy: jasmine.Spy = spyOn(extractor, '_renderTextElementFromTJ').and.returnValue('SHOULD_NOT_RUN');
        const moveToNextLineSpy: jasmine.Spy = spyOn(extractor, '_moveToNextLine').and.callFake(function (): void {
            extractor._textLineMatrix = new _MatrixHelper(1, 0, 0, 1, 0, 5);
            extractor._textMatrix = extractor._textLineMatrix;
        });

        const recordCollection: { _operator: string; _operands: string[] }[] = [
            createRecord('\'', ['(A)']),
            createRecord('TJ', ['[(B)]']),
            createRecord('Tj', ['(C)'])
        ];

        // Act
        extractor._renderTextAsLayOut(
            recordCollection as never,
            page,
            new Map<string, never>(),
            new Map<string, never>()
        );

        // Assert
        expect(moveToNextLineSpy).toHaveBeenCalled();
        expect(buildTextContentStreamSpy.calls.count()).toBe(3);
        expect(renderTextElementFromTJSpy).not.toHaveBeenCalled();
    });

    it('should cover the highlighted tempFontSize positive m12 branch in _renderTextElementFromTJ', () => {
        // Arrange
        const page: PdfPage = createPage(PdfRotationAngle.angle0);
        const extractor: PdfDataExtractor = createExtractor(page);

        extractor._currentFont = 'F1';
        extractor._fontSize = 8;
        extractor._isLayout = false;
        extractor._hasBeginMarkedContent = true;
        extractor._initialTransForm = new _MatrixHelper(1, 0, 0, 1, 0, 0);
        extractor._textMatrix = new _MatrixHelper(0, 3, 4, 0, 0, 0);
        extractor._textLineMatrix = new _MatrixHelper(0, 3, 4, 0, 0, 0);
        extractor._tempBoundingRectangle = { x: 0, y: 0, width: 0, height: 0 };
        extractor._boundingRectangle = { x: 0, y: 0, width: 0, height: 0 };

        const font: {
            _name: string;
            _fontStyle: PdfFontStyle;
            _isType3Font: boolean;
            _fontMatrix?: number[];
        } = {
            _name: 'TypeLike',
            _fontStyle: PdfFontStyle.bold,
            _isType3Font: false
        };

        const fontCollection: Map<string, object> = createFontCollection(font);

        const parseEncodedTextSpy: jasmine.Spy = spyOn(utilsModule, '_parseEncodedText').and.returnValue([
            ['Xs'],
            [[2]]
        ] as never);

        const ignoreEscapeSequenceSpy: jasmine.Spy = spyOn(utilsModule, '_ignoreEscapeSequence').and.callFake(function (value: string): string {
            return value;
        });

        const getTextRenderingMatrixSpy: jasmine.Spy = spyOn(extractor, '_getTextRenderingMatrix').and.returnValue(
            new _MatrixHelper(0, 3, 4, 0, 12, 16)
        );

        const updateTextLineMatrixSpy: jasmine.Spy = spyOn(extractor, '_updateTextLineMatrix').and.stub();

        // Act
        const result: string = extractor._renderTextElementFromTJ(
            ['(X)'],
            page,
            fontCollection as never
        );

        // Assert
        expect(parseEncodedTextSpy).toHaveBeenCalledWith('(X)', font as never);
        expect(ignoreEscapeSequenceSpy).toHaveBeenCalledWith('X');
        expect(getTextRenderingMatrixSpy).toHaveBeenCalled();
        expect(updateTextLineMatrixSpy).toHaveBeenCalled();
        expect(result).toBe('X');
        expect(extractor._boundingRectangle.width).toBeCloseTo(0.006, 10);
        expect(extractor._boundingRectangle.height).toBe(3);
    });

    it('should cover _buildTextContentStream zero-spacing carry path and rotated final textWord bounds path', () => {
        // Arrange
        const page: PdfPage = createPage(PdfRotationAngle.angle90);
        const extractor: PdfDataExtractor = createExtractor(page);

        extractor._currentFont = 'F1';
        extractor._fontSize = 11;
        extractor._isRotatePage = true;
        extractor._textGlyph = [];
        extractor._textWord = [];
        extractor._textLine = [];
        extractor._textExtraction = [];
        extractor._extractedText = 'ROTATED';

        const font: {
            _name: string;
            _fontStyle: PdfFontStyle;
        } = {
            _name: 'Helvetica',
            _fontStyle: PdfFontStyle.italic
        };

        const fontCollection: Map<string, object> = createFontCollection(font);

        const parseEncodedTextSpy: jasmine.Spy = spyOn(utilsModule, '_parseEncodedText').and.returnValue([
            ['ABs', '0', 'Cs', '10'],
            []
        ] as never);

        const getTextWidthSpy: jasmine.Spy = spyOn(extractor, '_getTextWidth').and.callFake(function (
            textValue: string,
            extraSpacing: number,
            currentFontValue: object,
            pageValue: PdfPage,
            tempStringValue: string
        ): string {
            extractor._textGlyph = [
                {
                    _bounds: { x: 5, y: 6, width: 7, height: 8 }
                } as never
            ];
            extractor._height = 30;
            extractor._width = 25;
            return tempStringValue + textValue;
        });

        // Act
        extractor._buildTextContentStream(
            ['[(AB) 0 (C) 10]'],
            page,
            fontCollection as never
        );

        // Assert
        expect(parseEncodedTextSpy).toHaveBeenCalledWith('[(AB) 0 (C) 10]', font as never);
        expect(getTextWidthSpy.calls.count()).toBe(2);
        expect(getTextWidthSpy.calls.argsFor(0)[0]).toBe('ABC');
        expect(getTextWidthSpy.calls.argsFor(0)[1]).toBe(-0.01);
        expect(getTextWidthSpy.calls.argsFor(1)[0]).toBe('ABC');
        expect(getTextWidthSpy.calls.argsFor(1)[1]).toBe(0);
        expect(extractor._textLine.length).toBe(1);
        expect(extractor._textLine[0]._text).toBe('ROTATED');
        expect(extractor._textLine[0]._fontName).toBe('Helvetica');
        expect(extractor._textLine[0]._fontStyle).toBe(PdfFontStyle.italic);
        expect(extractor._textLine[0]._fontSize).toBe(11);
        expect(extractor._textLine[0]._pageIndex).toBe(0);
        expect(extractor._textExtraction).toEqual(['ROTATED']);
        expect(extractor._extractedText).toBe('');
        expect(extractor._width).toBe(0);
        expect(extractor._textGlyph).toEqual([]);
        expect(extractor._textWord[0]._bounds).toEqual({
            x: 5,
            y: 6,
            width: 7,
            height: 30
        });
    });

    it('should cover _buildTextContentStream non-rotated final textWord bounds path', () => {
        // Arrange
        const page: PdfPage = createPage(PdfRotationAngle.angle0);
        const extractor: PdfDataExtractor = createExtractor(page);

        extractor._currentFont = 'F1';
        extractor._fontSize = 9;
        extractor._isRotatePage = false;
        extractor._textGlyph = [];
        extractor._textWord = [];
        extractor._textLine = [];
        extractor._textExtraction = [];
        extractor._extractedText = 'NORMAL';

        const font: {
            _name: string;
            _fontStyle: PdfFontStyle;
        } = {
            _name: 'Courier',
            _fontStyle: PdfFontStyle.bold
        };

        const fontCollection: Map<string, object> = createFontCollection(font);

        spyOn(utilsModule, '_parseEncodedText').and.returnValue([
            ['ABs'],
            []
        ] as never);

        spyOn(extractor, '_getTextWidth').and.callFake(function (
            textValue: string,
            extraSpacing: number,
            currentFontValue: object,
            pageValue: PdfPage,
            tempStringValue: string
        ): string {
            extractor._textGlyph = [
                {
                    _bounds: { x: 2, y: 3, width: 4, height: 5 }
                } as never
            ];
            extractor._height = 12;
            extractor._width = 20;
            return tempStringValue + textValue;
        });

        // Act
        extractor._buildTextContentStream(
            ['[(AB)]'],
            page,
            fontCollection as never
        );

        // Assert
        expect(extractor._textWord[0]._bounds).toEqual({
            x: 2,
            y: 3,
            width: 20,
            height: 4
        });
        expect(extractor._textLine[0]._text).toBe('NORMAL');
        expect(extractor._textExtraction).toEqual(['NORMAL']);
        expect(extractor._extractedText).toBe('');
    });

    it('should cover _getTextWidth with fontMatrix branch, space branch, positive m11 branch, previousRect truthy path and charSpacing continue path', () => {
        // Arrange
        const page: PdfPage = createPage(PdfRotationAngle.angle0);
        const extractor: PdfDataExtractor = createExtractor(page);

        extractor._fontSize = 10;
        extractor._characterSpacing = 2;
        extractor._wordSpacing = 5;
        extractor._textHorizontalScaling = 100;
        extractor._textMatrix = new _MatrixHelper(2, 0, 0, 2, 10, 20);
        extractor._boundingRectangle = { x: 0, y: 0, width: 0, height: 0 };
        extractor._previousRect = { x: 1, y: 2, width: 3, height: 4 };
        extractor._extractedText = '';

        const currentFont: {
            _fontMatrix: number[];
            _name: string;
            _fontStyle: PdfFontStyle;
            _charsToGlyphs: (text: string) => { _unicode: string; _width: number }[];
        } = {
            _fontMatrix: [0.5, 0, 0, 0.5, 0, 0],
            _name: 'Helvetica',
            _fontStyle: PdfFontStyle.regular,
            _charsToGlyphs: function (): { _unicode: string; _width: number }[] {
                return [
                    { _unicode: 'A', _width: 3 },
                    { _unicode: ' ', _width: 4 }
                ];
            }
        };

        const translateTextMatrixSpy: jasmine.Spy = spyOn(extractor._parser, '_translateTextMatrix').and.callFake(function (
            xValue: number,
            yValue: number,
            matrixValue: _MatrixHelper
        ): _MatrixHelper {
            return new _MatrixHelper(
                matrixValue._m11,
                matrixValue._m12,
                matrixValue._m21,
                matrixValue._m22,
                matrixValue._offsetX + xValue,
                matrixValue._offsetY + yValue
            );
        });

        const splitWordsSpy: jasmine.Spy = spyOn(extractor, '_splitWords').and.callFake(function (
            glyphValue: string,
            tempStringValue: string
        ): string {
            return tempStringValue + glyphValue;
        });

        // Act
        const result: string = extractor._getTextWidth(
            'A ',
            1,
            currentFont as never,
            page,
            ''
        );

        // Assert
        expect(result).toBe('A ');
        expect(extractor._extractedText).toBe('A ');
        expect(splitWordsSpy.calls.count()).toBe(2);
        expect(translateTextMatrixSpy.calls.count()).toBe(3);
        expect(extractor._boundingRectangle.x).toBeGreaterThan(0);
        expect(extractor._boundingRectangle.y).toBeGreaterThan(0);
        expect(extractor._previousRect).toEqual({
            x: extractor._boundingRectangle.x,
            y: extractor._boundingRectangle.y,
            width: extractor._boundingRectangle.width,
            height: extractor._boundingRectangle.height
        });
    });
    it('should cover _splitWords space branch with tempString flush, color assignment, rotated glyph and reset state', () => {
        // Arrange
        const page: PdfPage = createPage(PdfRotationAngle.angle90);
        const extractor: PdfDataExtractor = createExtractor(page);

        extractor._fontSize = 10;
        extractor._boundingRectangle = { x: 1, y: 2, width: 3, height: 4 };
        extractor._textGlyph = [
            {
                _bounds: { x: 4, y: 5, width: 6, height: 7 }
            } as never
        ];
        extractor._textWord = [];
        extractor._width = 20;
        extractor._height = 30;
        extractor._previousRect = { x: 1, y: 2, width: 3, height: 4 };

        // Act
        const result: string = extractor._splitWords(
            ' ',
            'AB',
            'Arial',
            PdfFontStyle.regular,
            page,
            90,
            [1, 2, 3]
        );

        // Assert
        expect(result).toBe('');
        expect(extractor._textWord.length).toBe(2);
        expect(extractor._textWord[0]._text).toBe('AB');
        expect(extractor._textWord[1]._text).toBe(' ');
        expect(extractor._width).toBe(0);
        expect(extractor._height).toBe(0);
        expect(extractor._textGlyph).toEqual([]);
        expect(extractor._previousRect).toBeNull();
    });

    it('should cover _splitWords non-space spacing branch for angle90 and flush previous glyphs', () => {
        // Arrange
        const page: PdfPage = createPage(PdfRotationAngle.angle90);
        const extractor: PdfDataExtractor = createExtractor(page);

        extractor._fontSize = 10;
        extractor._boundingRectangle = { x: 1, y: 0, width: 4, height: 10 };
        extractor._previousRect = { x: 0, y: 20, width: 4, height: 10 };
        extractor._textGlyph = [
            {
                _bounds: { x: 0, y: 20, width: 4, height: 10 }
            } as never
        ];
        extractor._textWord = [];
        extractor._height = 10;
        extractor._width = 0;

        // Act
        const result: string = extractor._splitWords(
            'B',
            'A',
            'Arial',
            PdfFontStyle.regular,
            page
        );

        // Assert
        expect(result).toBe('B');
        expect(extractor._textWord.length).toBe(1);
        expect(extractor._textWord[0]._text).toBe('A');
        expect(extractor._height).toBe(10);
        expect(extractor._width).toBe(0);
        expect(extractor._previousRect).toEqual({ x: 0, y: 0, width: 0, height: 0 });
        expect(extractor._textGlyph.length).toBe(1);
        expect(extractor._textGlyph[0]._text).toBe('B');
        expect(extractor._textGlyph[0]._isRotated).toBeFalsy();
    });

    it('should cover _splitWords non-space spacing branches for rotation 90, angle180 and default difference paths', () => {
        // Arrange
        const pageAngle0: PdfPage = createPage(PdfRotationAngle.angle0);
        const pageAngle180: PdfPage = createPage(PdfRotationAngle.angle180);
        const extractor: PdfDataExtractor = createExtractor(pageAngle0);

        extractor._fontSize = 11;

        extractor._boundingRectangle = { x: 0, y: 20, width: 5, height: 10 };
        extractor._previousRect = { x: 0, y: 0, width: 5, height: 5 };
        extractor._textGlyph = [{ _bounds: { x: 0, y: 0, width: 5, height: 5 } } as never];
        extractor._textWord = [];
        extractor._height = 5;
        extractor._width = 5;

        const rotation90Result: string = extractor._splitWords(
            'C',
            'B',
            'Arial',
            PdfFontStyle.bold,
            pageAngle0,
            90,
            [4, 5, 6]
        );

        extractor._boundingRectangle = { x: 20, y: 0, width: 10, height: 10 };
        extractor._previousRect = { x: 5, y: 0, width: 5, height: 5 };
        extractor._textGlyph = [{ _bounds: { x: 5, y: 0, width: 5, height: 5 } } as never];
        extractor._height = 0;
        extractor._width = 5;

        const angle180Result: string = extractor._splitWords(
            'D',
            'C',
            'Arial',
            PdfFontStyle.bold,
            pageAngle180
        );

        extractor._boundingRectangle = { x: 40, y: 0, width: 10, height: 10 };
        extractor._previousRect = { x: 5, y: 0, width: 5, height: 5 };
        extractor._textGlyph = [{ _bounds: { x: 5, y: 0, width: 5, height: 5 } } as never];
        extractor._height = 0;
        extractor._width = 5;

        const defaultResult: string = extractor._splitWords(
            'E',
            'D',
            'Arial',
            PdfFontStyle.bold,
            pageAngle0
        );

        // Assert
        expect(rotation90Result).toBe('C');
        expect(angle180Result).toBe('D');
        expect(defaultResult).toBe('E');
        expect(extractor._textWord.length).toBeGreaterThan(0);
        expect(extractor._textGlyph.length).toBe(1);
        expect(extractor._textGlyph[0]._text).toBe('E');
        expect(extractor._textGlyph[0]._color).toBeUndefined();
        expect(extractor._textGlyph[0]._isRotated).toBeFalsy();
    });

    it('should cover highlighted _getStructureElement array-recursion tempElement push and parent duplicate-protected push', () => {
        // Arrange
        const page: PdfPage = createPage(PdfRotationAngle.angle0);
        const extractor: PdfDataExtractor = createExtractor(page);

        const leafDictionary: _PdfDictionary = createPdfDictionary({});
        const nestedDictionary: _PdfDictionary = createPdfDictionary({
            K: leafDictionary
        });
        const rootDictionary: _PdfDictionary = createPdfDictionary({
            K: [nestedDictionary]
        });

        const parentElement: PdfStructureElement = PdfStructureElement._load((extractor as unknown as { _document: PdfDocument })._document);
        parentElement._tagType = PdfTagType.link;
        parentElement._childElements = [];
        parentElement._contentId = [];

        // Act
        const result: PdfStructureElement = extractor._getStructureElement(
            rootDictionary,
            parentElement
        );

        // Assert
        expect(result).toBeNull();
        expect(parentElement._childElements.length).toBe(1);
        expect(parentElement._childElements[0]._childElements.length).toBe(1);
        expect(extractor._elementCollection.length).toBe(2);
        expect(extractor._orderSet.size).toBe(2);
    });

    it('should cover highlighted _getStructureElement single-dictionary parent-tag fallback, nested K tempElement push and Pg assignment', () => {
        // Arrange
        const page: PdfPage = createPage(PdfRotationAngle.angle0);
        const extractor: PdfDataExtractor = createExtractor(page);

        const pageDictionary: _PdfDictionary = createPdfDictionary({ Name: 'Pg' });
        const childDictionary: _PdfDictionary = createPdfDictionary({
            Pg: pageDictionary
        });
        const elementsDictionary: _PdfDictionary = createPdfDictionary({
            K: childDictionary,
            Pg: pageDictionary
        });
        const rootDictionary: _PdfDictionary = createPdfDictionary({
            K: elementsDictionary
        });

        const parentElement: PdfStructureElement = PdfStructureElement._load((extractor as unknown as { _document: PdfDocument })._document);
        parentElement._tagType = PdfTagType.annotation;
        parentElement._childElements = [];

        // Act
        const result: PdfStructureElement = extractor._getStructureElement(
            rootDictionary,
            parentElement
        );

        // Assert
        expect(result).toBeDefined();
        expect(result._tagType).toBe(PdfTagType.annotation);
        expect(result._childElements.length).toBe(1);
        expect(result._pageDictionary).toBe(pageDictionary);
        expect(extractor._elementCollection.length).toBe(2);
        expect(extractor._orderSet.size).toBe(2);
    });
});
