import { _PdfContentParserHelper } from '../../src/pdf-data-extract/core/content-parser-helper';
import { _TextProcessingMode } from '../../src/pdf-data-extract/core/enum';
import { TextGlyph, TextLine, TextWord } from '../../src/pdf-data-extract/core/text-structure';
import { _TextState, _GraphicState } from '../../src/pdf-data-extract/core/graphic-state';
import { _FontStructure } from '../../src/pdf-data-extract/core/text-extraction';
import { PdfRedactor } from '../../src/pdf-data-extract/core/redaction/pdf-redactor';
import { _PdfRecord } from '@syncfusion/ej2-pdf';
describe('_PdfContentParserHelper', () => {
    let helper: _PdfContentParserHelper;
    let mockDocument: any;
    let mockPage: any;
    let mockTextState: any;
    let mockFontStructure: any;
    let mockRecord: any;
    let mockGraphicState: any;
    let mockRedactor: any;
    let mockParser: any;
    let mockCrossReference: any;
    function createMockFont(): any {
        return {
            _name: 'Arial',
            _fontStyle: 0,
            _vertical: false,
            _encoding: {},
            _charsToGlyphs: (text: string) => {
                return text.split('').map(ch => ({
                    unicode: ch,
                    width: 500
                }));
            },
            _widths: new Map(),
            _fontMatrix: [0.001, 0, 0, 0.001, 0, 0]
        };
    }
    beforeEach(() => {
        mockCrossReference = {
            _cacheMap: new Map()
        };
        mockDocument = {
            pageCount: 2,
            _crossReference: mockCrossReference
        };
        mockParser = {
            _getTextFont: jasmine.createSpy('_getTextFont').and.callFake(() => mockFontStructure),
            _getSplitText: jasmine.createSpy('_getSplitText').and.returnValue({
                decodedList: [],
                inputType: []
            }),
            _processCommand: jasmine.createSpy('_processCommand'),
            _setTextMatrix: jasmine.createSpy('_setTextMatrix'),
            _beginText: jasmine.createSpy('_beginText'),
            _setFont: jasmine.createSpy('_setFont'),
            _setCharSpacing: jasmine.createSpy('_setCharSpacing'),
            _setWordSpacing: jasmine.createSpy('_setWordSpacing'),
            _setTextHorizontalScale: jasmine.createSpy('_setTextHorizontalScale'),
            _updateTextLeading: jasmine.createSpy('_updateTextLeading'),
            _moveTextPlacement: jasmine.createSpy('_moveTextPlacement'),
            _moveTextPlacementAndSetLeading: jasmine.createSpy('_moveTextPlacementAndSetLeading'),
            _setTextRise: jasmine.createSpy('_setTextRise'),
            _setNewLineWithLeading: jasmine.createSpy('_setNewLineWithLeading'),
            _isFoundText: jasmine.createSpy('_isFoundText').and.returnValue(false),
            _getTextContentItem: jasmine.createSpy('_getTextContentItem').and.returnValue({
                tempString: 'test',
                extractedText: 'test',
                fontSize: 12,
                textGlyphs: [],
                encodedText: [],
                previousRect: { x: 0, y: 0, width: 0, height: 0 },
                index: 0
            }),
            _splitHexString: jasmine.createSpy('_splitHexString').and.returnValue([])
        };
        mockTextState = {
            _textMatrix: [1, 0, 0, 1, 0, 0],
            _fontSize: 12,
            _carriageReturn: jasmine.createSpy('_carriageReturn'),
            _wordSpacing: 0,
            _charSpacing: 0,
            _ctm: [1, 0, 0, 1, 0, 0],
            _textColor: { r: 0, g: 0, b: 0 }
        };
        mockGraphicState = {
            _state: mockTextState,
            _processCommand: jasmine.createSpy('_processCommand')
        };
        mockFontStructure = createMockFont();
        mockPage = {
            _pageIndex: 0,
            _combineContent: jasmine.createSpy('_combineContent').and.returnValue(new Uint8Array(0)),
            size: { width: 612, height: 792 },
            rotation: 0
        };
        mockRecord = {
            _operator: 'Tj',
            _operands: ['(test)'],
            _splitText: []
        };
        mockRedactor = {
            _document: mockDocument,
            _redactionRegion: [],
            _replacedText: jasmine.createSpy('_replacedText').and.returnValue('replaced'),
            _optimizeContent: jasmine.createSpy('_optimizeContent')
        };
    });
    it('should initialize constructor without mode parameter', () => {
        // Arrange
        const expectedMode: _TextProcessingMode = undefined;
        // Act
        helper = new _PdfContentParserHelper();
        // Assert
        expect(helper).toBeDefined();
        expect(helper._mode).toBe(expectedMode);
        expect(helper._document).toBeUndefined();
        expect(helper._redaction).toBeUndefined();
        expect(helper._width).toBe(0);
        expect(helper._height).toBe(0);
    });
    it('should initialize constructor with textExtraction mode', () => {
        // Arrange
        const mode: _TextProcessingMode = _TextProcessingMode.textExtraction;
        // Act
        helper = new _PdfContentParserHelper(mode);
        // Assert
        expect(helper).toBeDefined();
        expect(helper._mode).toBe(mode);
        expect(helper._document).toBeUndefined();
        expect(helper._redaction).toBeUndefined();
    });
    it('should initialize constructor with textLineExtraction mode', () => {
        // Arrange
        const mode: _TextProcessingMode = _TextProcessingMode.textLineExtraction;
        // Act
        helper = new _PdfContentParserHelper(mode);
        // Assert
        expect(helper._mode).toBe(mode);
        expect(helper._textLine).toBeDefined();
        expect(helper._textLine.length).toBe(0);
    });
    it('should initialize constructor with redaction mode and redactor', () => {
        // Arrange
        const mode: _TextProcessingMode = _TextProcessingMode.redaction;
        // Act
        helper = new _PdfContentParserHelper(mode, mockRedactor);
        // Assert
        expect(helper._mode).toBe(mode);
        expect(helper._redaction).toBe(mockRedactor);
        expect(helper._document).toBe(mockDocument);
    });
    it('should get page record collection from page content', () => {
        // Arrange
        helper = new _PdfContentParserHelper();
        const mockContentParser: any = {
            _readContent: jasmine.createSpy('_readContent').and.returnValue([
                { _operator: 'Tj', _operands: ['(test)'] }
            ])
        };
        // Act
        const result: _PdfRecord[] = helper._getPageRecordCollection(mockPage);
        // Assert
        expect(mockPage._combineContent).toHaveBeenCalled();
        expect(result).toBeDefined();
    });
    it('should process Tj operator in text extraction mode', () => {
        // Arrange
        helper = new _PdfContentParserHelper(_TextProcessingMode.textExtraction);
        helper._parser = mockParser;
        mockRecord._operator = 'Tj';
        mockRecord._operands = ['(test)'];
        // Act
        const result: any = helper._processTjOperator(mockRecord, mockTextState, mockFontStructure, mockPage, new Map());
        // Assert
        expect(result).toBeUndefined();
        expect(helper._parser._getTextFont).toHaveBeenCalled();
    });
    it('should process Tj operator with double-quote operator indicator', () => {
        // Arrange
        helper = new _PdfContentParserHelper(_TextProcessingMode.textExtraction);
        helper._parser = mockParser;
        mockRecord._operator = '"';
        mockRecord._operands = ['0', '0', '(test)'];
        // Act
        const result: any = helper._processTjOperator(mockRecord, mockTextState, mockFontStructure, mockPage, new Map());
        // Assert
        expect(result).toBeUndefined();
        expect(helper._resultantText).toContain('\r\n');
    });
    it('should process Tj operator with single-quote operator indicator', () => {
        // Arrange
        helper = new _PdfContentParserHelper(_TextProcessingMode.textExtraction);
        helper._parser = mockParser;
        mockRecord._operator = "'";
        mockRecord._operands = ['(test)'];
        // Act
        const result: any = helper._processTjOperator(mockRecord, mockTextState, mockFontStructure, mockPage, new Map());
        // Assert
        expect(helper._resultantText).toContain('\r\n');
    });
    it('should process Tj operator in redaction mode without redaction text', () => {
        // Arrange
        helper = new _PdfContentParserHelper(_TextProcessingMode.redaction, mockRedactor);
        helper._parser = mockParser;
        helper._isContainsRedactionText = false;
        mockRecord._operator = 'Tj';
        // Act
        const result: any = helper._processTjOperator(mockRecord, mockTextState, mockFontStructure, mockPage, new Map());
        // Assert
        expect(result).toBeUndefined();
    });
    it('should set text line collection with non-empty text', () => {
        // Arrange
        helper = new _PdfContentParserHelper();
        helper._fontSize = 12;
        const textWord: TextWord = new TextWord();
        textWord._bounds = { x: 0, y: 0, width: 100, height: 20 };
        helper._textGlyph = [];
        const textGlyph: TextGlyph = new TextGlyph();
        textGlyph._bounds = { x: 0, y: 0, width: 10, height: 20 };
        helper._textGlyph.push(textGlyph);
        // Act
        helper._setTextLineCollection('test', mockFontStructure, mockTextState, mockPage, 'test line');
        // Assert
        expect(helper._textLine.length).toBe(1);
        expect(helper._textLine[0]._text).toBe('test line');
        expect(helper._width).toBe(0);
        expect(helper._textGlyph.length).toBe(0);
    });
    it('should set text line collection with empty text', () => {
        // Arrange
        helper = new _PdfContentParserHelper();
        helper._fontSize = 12;
        // Act
        helper._setTextLineCollection('', mockFontStructure, mockTextState, mockPage, '');
        // Assert
        expect(helper._textLine.length).toBe(1);
        expect(helper._width).toBe(0);
        expect(helper._textGlyph.length).toBe(0);
    });
    it('should set text line collection with multiple words', () => {
        // Arrange
        helper = new _PdfContentParserHelper();
        helper._fontSize = 12;
        helper._textWord = [];
        const textWord: TextWord = new TextWord();
        textWord._bounds = { x: 0, y: 0, width: 50, height: 20 };
        helper._textWord.push(textWord);
        // Act
        helper._setTextLineCollection('word1', mockFontStructure, mockTextState, mockPage, 'word1 word2');
        // Assert
        expect(helper._textLine.length).toBe(1);
        expect(helper._textLine[0]._wordCollection.length).toBeGreaterThanOrEqual(0);
    });
    it('should process TJ operator in textExtraction mode', () => {
        // Arrange
        helper = new _PdfContentParserHelper(_TextProcessingMode.textExtraction);
        helper._parser = mockParser;
        mockRecord._operator = 'TJ';
        mockRecord._operands = [['(test)', 0]];
        // Act
        const result: any = helper._processTJOperator(mockRecord, mockTextState, mockFontStructure, mockPage, new Map());
        // Assert
        expect(result.updatedText).toBeDefined();
        expect(result.isChangeOperator).toBe(false);
    });
    it('should process TJ operator with single-quote and add newline', () => {
        // Arrange
        helper = new _PdfContentParserHelper(_TextProcessingMode.textExtraction);
        helper._parser = mockParser;
        mockRecord._operator = "'";
        mockRecord._operands = [['(test)']];
        // Act
        const result: any = helper._processTJOperator(mockRecord, mockTextState, mockFontStructure, mockPage, new Map());
        // Assert
        expect(helper._resultantText).toContain('\r\n');
    });
    it('should process TJ operator in redaction mode with redaction text', () => {
        // Arrange
        helper = new _PdfContentParserHelper(_TextProcessingMode.redaction, mockRedactor);
        helper._parser = mockParser;
        helper._isContainsRedactionText = true;
        mockRecord._operator = 'TJ';
        mockRecord._operands = [['(test)']];
        // Act
        const result: any = helper._processTJOperator(mockRecord, mockTextState, mockFontStructure, mockPage, new Map());
        // Assert
        expect(result.updatedText).toBeDefined();
        expect(result.isChangeOperator).toBeDefined();
    });
    it('should process TJ operator in redaction mode without redaction text', () => {
        // Arrange
        helper = new _PdfContentParserHelper(_TextProcessingMode.redaction, mockRedactor);
        helper._parser = mockParser;
        helper._isContainsRedactionText = false;
        mockRecord._operator = 'TJ';
        mockRecord._operands = [['(test)']];
        // Act
        const result: any = helper._processTJOperator(mockRecord, mockTextState, mockFontStructure, mockPage, new Map());
        // Assert
        expect(result.updatedText).toBe('');
        expect(result.isChangeOperator).toBe(false);
    });
    it('should process single quote operator by calling carriageReturn', () => {
        // Arrange
        helper = new _PdfContentParserHelper(_TextProcessingMode.textExtraction);
        helper._parser = mockParser;
        mockRecord._operator = "'";
        mockRecord._operands = ['(test)'];
        // Act
        const result: any = helper._processSingleQuoteOperator(mockRecord, mockTextState, mockFontStructure, mockPage, new Map());
        // Assert
        expect(mockTextState._carriageReturn).toHaveBeenCalled();
    });
    it('should test rectangle intersection when rectangles overlap', () => {
        // Arrange
        helper = new _PdfContentParserHelper();
        const rect1: any = { x: 0, y: 0, width: 100, height: 100 };
        const rect2: any = { x: 50, y: 50, width: 100, height: 100 };
        // Act
        const result: boolean = helper._intersect(rect1, rect2);
        // Assert
        expect(result).toBe(true);
    });
    it('should test rectangle intersection when rectangles do not overlap', () => {
        // Arrange
        helper = new _PdfContentParserHelper();
        const rect1: any = { x: 0, y: 0, width: 100, height: 100 };
        const rect2: any = { x: 150, y: 150, width: 100, height: 100 };
        // Act
        const result: boolean = helper._intersect(rect1, rect2);
        // Assert
        expect(result).toBe(false);
    });
    it('should test rectangle intersection when rectangles touch at edge', () => {
        // Arrange
        helper = new _PdfContentParserHelper();
        const rect1: any = { x: 0, y: 0, width: 100, height: 100 };
        const rect2: any = { x: 100, y: 0, width: 100, height: 100 };
        // Act
        const result: boolean = helper._intersect(rect1, rect2);
        // Assert
        expect(result).toBe(true);
    });
    it('should test rectangle intersection when one contains other', () => {
        // Arrange
        helper = new _PdfContentParserHelper();
        const rect1: any = { x: 0, y: 0, width: 200, height: 200 };
        const rect2: any = { x: 50, y: 50, width: 50, height: 50 };
        // Act
        const result: boolean = helper._intersect(rect1, rect2);
        // Assert
        expect(result).toBe(true);
    });
    it('should multiply two identity matrices', () => {
        // Arrange
        helper = new _PdfContentParserHelper();
        const matrix1: number[] = [1, 0, 0, 1, 0, 0];
        const matrix2: number[] = [1, 0, 0, 1, 0, 0];
        // Act
        const result: number[] = helper._multiply(matrix1, matrix2);
        // Assert
        expect(result.length).toBe(6);
        expect(result[0]).toBe(1);
        expect(result[1]).toBe(0);
        expect(result[2]).toBe(0);
        expect(result[3]).toBe(1);
        expect(result[4]).toBe(0);
        expect(result[5]).toBe(0);
    });
    it('should multiply two scale matrices', () => {
        // Arrange
        helper = new _PdfContentParserHelper();
        const matrix1: number[] = [2, 0, 0, 2, 0, 0];
        const matrix2: number[] = [3, 0, 0, 3, 0, 0];
        // Act
        const result: number[] = helper._multiply(matrix1, matrix2);
        // Assert
        expect(result[0]).toBe(6);
        expect(result[3]).toBe(6);
    });
    it('should multiply matrices with translation', () => {
        // Arrange
        helper = new _PdfContentParserHelper();
        const matrix1: number[] = [1, 0, 0, 1, 10, 20];
        const matrix2: number[] = [1, 0, 0, 1, 5, 10];
        // Act
        const result: number[] = helper._multiply(matrix1, matrix2);
        // Assert
        expect(result.length).toBe(6);
        expect(result[4]).toBe(15);
        expect(result[5]).toBe(30);
    });
    it('should multiply matrices with rotation', () => {
        // Arrange
        helper = new _PdfContentParserHelper();
        const cos90: number = 0;
        const sin90: number = 1;
        const matrix1: number[] = [cos90, sin90, -sin90, cos90, 0, 0];
        const matrix2: number[] = [1, 0, 0, 1, 0, 0];
        // Act
        const result: number[] = helper._multiply(matrix1, matrix2);
        // Assert
        expect(result.length).toBe(6);
    });
    it('should process double quote operator setting word and char spacing', () => {
        // Arrange
        helper = new _PdfContentParserHelper(_TextProcessingMode.textExtraction);
        helper._parser = mockParser;
        mockRecord._operator = '"';
        mockRecord._operands = ['5', '10', '(test)'];
        // Act
        const result: any = helper._processDoubleQuoteOperator(mockRecord, mockTextState, mockFontStructure, mockPage, new Map());
        // Assert
        expect(mockTextState._wordSpacing).toBe(5);
        expect(mockTextState._charSpacing).toBe(10);
        expect(mockTextState._carriageReturn).toHaveBeenCalled();
    });
    it('should process record collection in textExtraction mode', () => {
        // Arrange
        helper = new _PdfContentParserHelper(_TextProcessingMode.textExtraction);
        helper._parser = mockParser;
        mockRecord._operator = 'BT';
        const recordCollection: any[] = [mockRecord];
        const fontCollection: Map<string, _FontStructure> = new Map();
        const xObjectCollection: Map<string, any> = new Map();
        // Act
        const result: any = helper._processRecordCollection(recordCollection, mockPage, fontCollection, xObjectCollection, mockGraphicState);
        // Assert
        expect(helper._parser._processCommand).toHaveBeenCalled();
        expect(result).toBe(helper._resultantText);
    });
    it('should process record collection in textLineExtraction mode', () => {
        // Arrange
        helper = new _PdfContentParserHelper(_TextProcessingMode.textLineExtraction);
        helper._parser = mockParser;
        mockRecord._operator = 'BT';
        const recordCollection: any[] = [mockRecord];
        const fontCollection: Map<string, _FontStructure> = new Map();
        const xObjectCollection: Map<string, any> = new Map();
        // Act
        const result: any = helper._processRecordCollection(recordCollection, mockPage, fontCollection, xObjectCollection, mockGraphicState);
        // Assert
        expect(result).toEqual(helper._textLine);
    });
    it('should process record collection in redaction mode', () => {
        // Arrange
        helper = new _PdfContentParserHelper(_TextProcessingMode.redaction, mockRedactor);
        helper._parser = mockParser;
        mockRecord._operator = 'BT';
        const recordCollection: any[] = [mockRecord];
        const fontCollection: Map<string, _FontStructure> = new Map();
        const xObjectCollection: Map<string, any> = new Map();
        // Act
        const result: any = helper._processRecordCollection(recordCollection, mockPage, fontCollection, xObjectCollection, mockGraphicState);
        // Assert
        expect(result).toBeDefined();
    });
    it('should process record collection with empty records', () => {
        // Arrange
        helper = new _PdfContentParserHelper();
        helper._parser = mockParser;
        const recordCollection: any[] = [];
        const fontCollection: Map<string, _FontStructure> = new Map();
        const xObjectCollection: Map<string, any> = new Map();
        // Act
        const result: any = helper._processRecordCollection(recordCollection, mockPage, fontCollection, xObjectCollection, mockGraphicState);
        // Assert
        expect(result).toBeUndefined();
    });
    it('should extract text element and decode it', () => {
        // Arrange
        helper = new _PdfContentParserHelper();
        const elements: string = '(Hello)';
        const inputText: string[] = [];
        // Act
        helper._extractTextElement(elements, mockFontStructure, inputText);
        // Assert
        expect(helper._resultantText).toBeDefined();
    });
    it('should get text elements from Tj operator with glyphs', () => {
        // Arrange
        helper = new _PdfContentParserHelper();
        helper._parser = mockParser;
        const decodedList: string[] = ['H', 'e', 'l', 'l', 'o'];
        const textGlyphs: TextGlyph[] = [];
        const inputType: string[] = ['H', 'e', 'l', 'l', 'o'];
        // Act
        const result: any = helper._getTextElementsFromTjOperator(decodedList, mockFontStructure, mockTextState, mockPage, textGlyphs, inputType);
        // Assert
        expect(result).toBeDefined();
    });
    it('should get text elements from Tj operator without glyphs', () => {
        // Arrange
        helper = new _PdfContentParserHelper();
        helper._parser = mockParser;
        const decodedList: string[] = ['test'];
        // Act
        const result: any = helper._getTextElementsFromTjOperator(decodedList, mockFontStructure, mockTextState, mockPage);
        // Assert
        expect(result).toBeDefined();
        expect(result.tempString).toBeDefined();
    });
    it('should get text elements from Tj operator with empty decodedList', () => {
        // Arrange
        helper = new _PdfContentParserHelper();
        const decodedList: string[] = [];
        // Act
        const result: any = helper._getTextElementsFromTjOperator(decodedList, mockFontStructure, mockTextState, mockPage);
        // Assert
        expect(result).toBeUndefined();
    });
    it('should get text elements from TJ operator with numeric values', () => {
        // Arrange
        helper = new _PdfContentParserHelper();
        helper._parser = mockParser;
        const decodedList: string[] = ['test', '100', 'word'];
        const textGlyphs: TextGlyph[] = [];
        const inputType: string[] = ['test', '100', 'word'];
        mockFontStructure._vertical = false;
        // Act
        const result: any = helper._getTextElementsFromTJOperator(decodedList, mockFontStructure, mockTextState, mockPage, textGlyphs, inputType);
        // Assert
        expect(result).toBeDefined();
    });
    it('should get text elements from TJ operator without glyphs', () => {
        // Arrange
        helper = new _PdfContentParserHelper();
        helper._parser = mockParser;
        const decodedList: string[] = ['test', '50', 'word'];
        // Act
        const result: any = helper._getTextElementsFromTJOperator(decodedList, mockFontStructure, mockTextState, mockPage);
        // Assert
        expect(result).toBeDefined();
    });
    it('should get text elements from TJ operator with zero digit', () => {
        // Arrange
        helper = new _PdfContentParserHelper();
        helper._parser = mockParser;
        const decodedList: string[] = ['test', '0', 'word'];
        // Act
        const result: any = helper._getTextElementsFromTJOperator(decodedList, mockFontStructure, mockTextState, mockPage);
        // Assert
        expect(result.tempString).toBeDefined();
    });
    it('should get text elements from TJ operator with vertical font', () => {
        // Arrange
        helper = new _PdfContentParserHelper();
        helper._parser = mockParser;
        const decodedList: string[] = ['test'];
        mockFontStructure._vertical = true;
        // Act
        const result: any = helper._getTextElementsFromTJOperator(decodedList, mockFontStructure, mockTextState, mockPage);
        // Assert
        expect(result).toBeDefined();
    });
    it('should split words when glyph is space', () => {
        // Arrange
        helper = new _PdfContentParserHelper();
        const textGlyph: TextGlyph = new TextGlyph();
        textGlyph._bounds = { x: 0, y: 0, width: 10, height: 20 };
        helper._textGlyph.push(textGlyph);
        const textBounds: any = { x: 20, y: 0, width: 5, height: 20 };
        // Act
        const result: any = helper._splitWords(' ', 'word', 'Arial', 0, mockPage, 0, { r: 0, g: 0, b: 0 }, 12, textBounds, null);
        // Assert
        expect(result.tempString).toBe('');
        expect(result.previousRect).toBeNull();
    });
    it('should split words when glyph is non-space', () => {
        // Arrange
        helper = new _PdfContentParserHelper();
        const textBounds: any = { x: 0, y: 0, width: 10, height: 20 };
        // Act
        const result: any = helper._splitWords('a', '', 'Arial', 0, mockPage, 0, { r: 0, g: 0, b: 0 }, 12, textBounds, null);
        // Assert
        expect(result.tempString).toBe('a');
    });
    it('should split words with page rotation angle90', () => {
        // Arrange
        helper = new _PdfContentParserHelper();
        mockPage.rotation = 1; // angle90
        const textGlyph: TextGlyph = new TextGlyph();
        textGlyph._bounds = { x: 0, y: 0, width: 10, height: 20 };
        helper._textGlyph.push(textGlyph);
        const textBounds: any = { x: 0, y: 0, width: 10, height: 20 };
        // Act
        const result: any = helper._splitWords(' ', 'word', 'Arial', 0, mockPage, 0, undefined, 12, textBounds);
        // Assert
        expect(result.tempString).toBe('');
    });
    it('should split words with page rotation angle270', () => {
        // Arrange
        helper = new _PdfContentParserHelper();
        mockPage.rotation = 3; // angle270
        const textGlyph: TextGlyph = new TextGlyph();
        textGlyph._bounds = { x: 0, y: 0, width: 10, height: 20 };
        helper._textGlyph.push(textGlyph);
        const textBounds: any = { x: 0, y: 0, width: 10, height: 20 };
        // Act
        const result: any = helper._splitWords(' ', 'word', 'Arial', 0, mockPage, 0, undefined, 12, textBounds);
        // Assert
        expect(result.tempString).toBe('');
    });
    it('should split words with large spacing difference', () => {
        // Arrange
        helper = new _PdfContentParserHelper();
        mockPage.rotation = 0;
        const previousRect: any = { x: 0, y: 0, width: 10, height: 20 };
        const currentRect: any = { x: 50, y: 0, width: 10, height: 20 };
        // Act
        const result: any = helper._splitWords('a', 'word', 'Arial', 0, mockPage, 0, undefined, 12, currentRect, previousRect);
        // Assert
        expect(result).toBeDefined();
    });
    it('should split words with small spacing difference', () => {
        // Arrange
        helper = new _PdfContentParserHelper();
        mockPage.rotation = 0;
        const previousRect: any = { x: 0, y: 0, width: 10, height: 20 };
        const currentRect: any = { x: 12, y: 0, width: 10, height: 20 };
        // Act
        const result: any = helper._splitWords('b', 'word', 'Arial', 0, mockPage, 0, undefined, 12, currentRect, previousRect);
        // Assert
        expect(result.tempString).toContain('b');
    });
    it('should process Pdf record collection for Tm operator in redaction mode', () => {
        // Arrange
        helper = new _PdfContentParserHelper(_TextProcessingMode.redaction, mockRedactor);
        helper._parser = mockParser;
        mockRecord._operator = 'Tm';
        mockRecord._operands = ['1', '0', '0', '1', '10', '20'];
        const recordCollection: any[] = [mockRecord];
        const fontCollection: Map<string, _FontStructure> = new Map();
        const xObjectCollection: Map<string, any> = new Map();
        mockTextState._textMatrix = [1, 0, 0, 1, 10, 20];
        // Act
        const result: number = helper._processPdfRecordCollection(mockTextState, 0, '', mockPage, recordCollection, fontCollection, xObjectCollection, mockGraphicState, null, 0, 0, 0, -1, null);
        // Assert
        expect(result).toBe(0);
    });
    it('should process Pdf record collection for cm operator in redaction mode', () => {
        // Arrange
        helper = new _PdfContentParserHelper(_TextProcessingMode.redaction, mockRedactor);
        helper._parser = mockParser;
        mockRecord._operator = 'cm';
        mockRecord._operands = ['1', '0', '0', '1', '10', '20'];
        const recordCollection: any[] = [mockRecord];
        const fontCollection: Map<string, _FontStructure> = new Map();
        const xObjectCollection: Map<string, any> = new Map();
        // Act
        const result: number = helper._processPdfRecordCollection(mockTextState, 0, '', mockPage, recordCollection, fontCollection, xObjectCollection, mockGraphicState, null, 0, 0, 0, -1, null);
        // Assert
        expect(result).toBe(0);
    });
    it('should process Pdf record collection for BT operator', () => {
        // Arrange
        helper = new _PdfContentParserHelper(_TextProcessingMode.textLineExtraction);
        helper._parser = mockParser;
        mockRecord._operator = 'BT';
        const recordCollection: any[] = [mockRecord];
        const fontCollection: Map<string, _FontStructure> = new Map();
        const xObjectCollection: Map<string, any> = new Map();
        // Act
        const result: number = helper._processPdfRecordCollection(mockTextState, 0, '', mockPage, recordCollection, fontCollection, xObjectCollection, mockGraphicState, null, 0, 0, 0, -1, null);
        // Assert
        expect(result).toBe(0);
    });
    it('should process Pdf record collection for ET operator in textExtraction mode', () => {
        // Arrange
        helper = new _PdfContentParserHelper(_TextProcessingMode.textExtraction);
        helper._parser = mockParser;
        mockRecord._operator = 'ET';
        const recordCollection: any[] = [mockRecord];
        const fontCollection: Map<string, _FontStructure> = new Map();
        const xObjectCollection: Map<string, any> = new Map();
        // Act
        const result: number = helper._processPdfRecordCollection(mockTextState, 0, '', mockPage, recordCollection, fontCollection, xObjectCollection, mockGraphicState, null, 0, 0, 0, -1, null);
        // Assert
        expect(helper._resultantText).toContain('\r\n');
    });
    it('should process Pdf record collection for ET operator in redaction mode', () => {
        // Arrange
        helper = new _PdfContentParserHelper(_TextProcessingMode.redaction, mockRedactor);
        helper._parser = mockParser;
        mockRecord._operator = 'ET';
        const recordCollection: any[] = [mockRecord];
        const fontCollection: Map<string, _FontStructure> = new Map();
        const xObjectCollection: Map<string, any> = new Map();
        // Act
        const result: number = helper._processPdfRecordCollection(mockTextState, 0, '', mockPage, recordCollection, fontCollection, xObjectCollection, mockGraphicState, null, 0, 0, 0, -1, null);
        // Assert
        expect(helper._isContainsRedactionText).toBe(false);
        expect(helper._xPosition).toBe(0);
        expect(helper._yPosition).toBe(0);
    });
    it('should process Pdf record collection for Tf operator', () => {
        // Arrange
        helper = new _PdfContentParserHelper();
        helper._parser = mockParser;
        mockRecord._operator = 'Tf';
        mockRecord._operands = ['F1', '12'];
        const recordCollection: any[] = [mockRecord];
        const fontCollection: Map<string, _FontStructure> = new Map();
        const xObjectCollection: Map<string, any> = new Map();
        // Act
        const result: number = helper._processPdfRecordCollection(mockTextState, 0, '', mockPage, recordCollection, fontCollection, xObjectCollection, mockGraphicState, null, 0, 0, 0, -1, null);
        // Assert
        expect(helper._parser._setFont).toHaveBeenCalled();
    });
    it('should process Pdf record collection for Tc operator', () => {
        // Arrange
        helper = new _PdfContentParserHelper(_TextProcessingMode.textLineExtraction);
        helper._parser = mockParser;
        mockRecord._operator = 'Tc';
        mockRecord._operands = ['5'];
        const recordCollection: any[] = [mockRecord];
        const fontCollection: Map<string, _FontStructure> = new Map();
        const xObjectCollection: Map<string, any> = new Map();
        // Act
        const result: number = helper._processPdfRecordCollection(mockTextState, 0, '', mockPage, recordCollection, fontCollection, xObjectCollection, mockGraphicState, null, 0, 0, 0, -1, null);
        // Assert
        expect(helper._parser._setCharSpacing).toHaveBeenCalled();
    });
    it('should process Pdf record collection for Tw operator', () => {
        // Arrange
        helper = new _PdfContentParserHelper(_TextProcessingMode.textLineExtraction);
        helper._parser = mockParser;
        mockRecord._operator = 'Tw';
        mockRecord._operands = ['10'];
        const recordCollection: any[] = [mockRecord];
        const fontCollection: Map<string, _FontStructure> = new Map();
        const xObjectCollection: Map<string, any> = new Map();
        // Act
        const result: number = helper._processPdfRecordCollection(mockTextState, 0, '', mockPage, recordCollection, fontCollection, xObjectCollection, mockGraphicState, null, 0, 0, 0, -1, null);
        // Assert
        expect(helper._parser._setWordSpacing).toHaveBeenCalled();
    });
    it('should process Pdf record collection for Tz operator', () => {
        // Arrange
        helper = new _PdfContentParserHelper(_TextProcessingMode.textLineExtraction);
        helper._parser = mockParser;
        mockRecord._operator = 'Tz';
        mockRecord._operands = ['100'];
        const recordCollection: any[] = [mockRecord];
        const fontCollection: Map<string, _FontStructure> = new Map();
        const xObjectCollection: Map<string, any> = new Map();
        // Act
        const result: number = helper._processPdfRecordCollection(mockTextState, 0, '', mockPage, recordCollection, fontCollection, xObjectCollection, mockGraphicState, null, 0, 0, 0, -1, null);
        // Assert
        expect(helper._parser._setTextHorizontalScale).toHaveBeenCalled();
    });
    it('should process Pdf record collection for TL operator', () => {
        // Arrange
        helper = new _PdfContentParserHelper(_TextProcessingMode.textLineExtraction);
        helper._parser = mockParser;
        mockRecord._operator = 'TL';
        mockRecord._operands = ['15'];
        const recordCollection: any[] = [mockRecord];
        const fontCollection: Map<string, _FontStructure> = new Map();
        const xObjectCollection: Map<string, any> = new Map();
        // Act
        const result: number = helper._processPdfRecordCollection(mockTextState, 0, '', mockPage, recordCollection, fontCollection, xObjectCollection, mockGraphicState, null, 0, 0, 0, -1, null);
        // Assert
        expect(helper._parser._updateTextLeading).toHaveBeenCalled();
    });
    it('should process Pdf record collection for Td operator', () => {
        // Arrange
        helper = new _PdfContentParserHelper(_TextProcessingMode.textLineExtraction);
        helper._parser = mockParser;
        mockRecord._operator = 'Td';
        mockRecord._operands = ['10', '20'];
        const recordCollection: any[] = [mockRecord];
        const fontCollection: Map<string, _FontStructure> = new Map();
        const xObjectCollection: Map<string, any> = new Map();
        // Act
        const result: number = helper._processPdfRecordCollection(mockTextState, 0, '', mockPage, recordCollection, fontCollection, xObjectCollection, mockGraphicState, null, 0, 0, 0, -1, null);
        // Assert
        expect(helper._parser._moveTextPlacement).toHaveBeenCalled();
    });
    it('should process Pdf record collection for Td operator in redaction mode', () => {
        // Arrange
        helper = new _PdfContentParserHelper(_TextProcessingMode.redaction, mockRedactor);
        helper._parser = mockParser;
        mockRecord._operator = 'Td';
        mockRecord._operands = ['10', '20'];
        const recordCollection: any[] = [mockRecord];
        const fontCollection: Map<string, _FontStructure> = new Map();
        const xObjectCollection: Map<string, any> = new Map();
        // Act
        const result: number = helper._processPdfRecordCollection(mockTextState, 0, '', mockPage, recordCollection, fontCollection, xObjectCollection, mockGraphicState, null, 0, 0, 0, -1, null);
        // Assert
        expect(helper._xPosition).toBe(10);
        expect(helper._yPosition).toBe(-20);
    });
    it('should process Pdf record collection for TD operator', () => {
        // Arrange
        helper = new _PdfContentParserHelper(_TextProcessingMode.textLineExtraction);
        helper._parser = mockParser;
        mockRecord._operator = 'TD';
        mockRecord._operands = ['5', '10'];
        const recordCollection: any[] = [mockRecord];
        const fontCollection: Map<string, _FontStructure> = new Map();
        const xObjectCollection: Map<string, any> = new Map();
        // Act
        const result: number = helper._processPdfRecordCollection(mockTextState, 0, '', mockPage, recordCollection, fontCollection, xObjectCollection, mockGraphicState, null, 0, 0, 0, -1, null);
        // Assert
        expect(helper._parser._moveTextPlacementAndSetLeading).toHaveBeenCalled();
    });
    it('should process Pdf record collection for Ts operator', () => {
        // Arrange
        helper = new _PdfContentParserHelper(_TextProcessingMode.textLineExtraction);
        helper._parser = mockParser;
        mockRecord._operator = 'Ts';
        mockRecord._operands = ['2'];
        const recordCollection: any[] = [mockRecord];
        const fontCollection: Map<string, _FontStructure> = new Map();
        const xObjectCollection: Map<string, any> = new Map();
        // Act
        const result: number = helper._processPdfRecordCollection(mockTextState, 0, '', mockPage, recordCollection, fontCollection, xObjectCollection, mockGraphicState, null, 0, 0, 0, -1, null);
        // Assert
        expect(helper._parser._setTextRise).toHaveBeenCalled();
    });
    it('should process Pdf record collection for T* operator in textExtraction mode', () => {
        // Arrange
        helper = new _PdfContentParserHelper(_TextProcessingMode.textExtraction);
        helper._parser = mockParser;
        mockRecord._operator = 'T*';
        const recordCollection: any[] = [mockRecord];
        const fontCollection: Map<string, _FontStructure> = new Map();
        const xObjectCollection: Map<string, any> = new Map();
        // Act
        const result: number = helper._processPdfRecordCollection(mockTextState, 0, '', mockPage, recordCollection, fontCollection, xObjectCollection, mockGraphicState, null, 0, 0, 0, -1, null);
        // Assert
        expect(helper._resultantText).toContain('\r\n');
    });
    it('should process Pdf record collection for T* operator in other modes', () => {
        // Arrange
        helper = new _PdfContentParserHelper(_TextProcessingMode.textLineExtraction);
        helper._parser = mockParser;
        mockRecord._operator = 'T*';
        const recordCollection: any[] = [mockRecord];
        const fontCollection: Map<string, _FontStructure> = new Map();
        const xObjectCollection: Map<string, any> = new Map();
        // Act
        const result: number = helper._processPdfRecordCollection(mockTextState, 0, '', mockPage, recordCollection, fontCollection, xObjectCollection, mockGraphicState, null, 0, 0, 0, -1, null);
        // Assert
        expect(helper._parser._setNewLineWithLeading).toHaveBeenCalled();
    });
    it('should process Pdf record collection for RG color operator', () => {
        // Arrange
        helper = new _PdfContentParserHelper();
        helper._parser = mockParser;
        mockRecord._operator = 'RG';
        mockRecord._operands = ['0.5', '0.6', '0.7'];
        const recordCollection: any[] = [mockRecord];
        const fontCollection: Map<string, _FontStructure> = new Map();
        const xObjectCollection: Map<string, any> = new Map();
        // Act
        const result: number = helper._processPdfRecordCollection(mockTextState, 0, '', mockPage, recordCollection, fontCollection, xObjectCollection, mockGraphicState, null, 0, 0, 0, -1, null);
        // Assert
        expect(mockTextState._textColor.r).toBe(0.5);
        expect(mockTextState._textColor.g).toBe(0.6);
        expect(mockTextState._textColor.b).toBe(0.7);
    });
    it('should process Pdf record collection for k, g, rg color operators', () => {
        // Arrange
        helper = new _PdfContentParserHelper();
        helper._parser = mockParser;
        mockRecord._operator = 'rg';
        mockRecord._operands = ['0.1', '0.2', '0.3'];
        const recordCollection: any[] = [mockRecord];
        const fontCollection: Map<string, _FontStructure> = new Map();
        const xObjectCollection: Map<string, any> = new Map();
        // Act
        const result: number = helper._processPdfRecordCollection(mockTextState, 0, '', mockPage, recordCollection, fontCollection, xObjectCollection, mockGraphicState, null, 0, 0, 0, -1, null);
        // Assert
        expect(mockTextState._textColor.r).toBe(0.1);
        expect(mockTextState._textColor.g).toBe(0.2);
        expect(mockTextState._textColor.b).toBe(0.3);
    });
    it('should process Pdf record collection for Tj operator in textExtraction mode', () => {
        // Arrange
        helper = new _PdfContentParserHelper(_TextProcessingMode.textExtraction);
        helper._parser = mockParser;
        mockRecord._operator = 'Tj';
        mockRecord._operands = ['(hello)'];
        const recordCollection: any[] = [mockRecord];
        const fontCollection: Map<string, _FontStructure> = new Map();
        const xObjectCollection: Map<string, any> = new Map();
        // Act
        const result: number = helper._processPdfRecordCollection(mockTextState, 0, '', mockPage, recordCollection, fontCollection, xObjectCollection, mockGraphicState, null, 0, 0, 0, -1, null);
        // Assert
        expect(result).toBe(0);
    });
    it('should process Pdf record collection for TJ operator', () => {
        // Arrange
        helper = new _PdfContentParserHelper(_TextProcessingMode.textExtraction);
        helper._parser = mockParser;
        mockRecord._operator = 'TJ';
        mockRecord._operands = [['(text)', 50]];
        const recordCollection: any[] = [mockRecord];
        const fontCollection: Map<string, _FontStructure> = new Map();
        const xObjectCollection: Map<string, any> = new Map();
        // Act
        const result: number = helper._processPdfRecordCollection(mockTextState, 0, '', mockPage, recordCollection, fontCollection, xObjectCollection, mockGraphicState, null, 0, 0, 0, -1, null);
        // Assert
        expect(result).toBe(0);
    });
    it('should process Pdf record collection for single quote operator', () => {
        // Arrange
        helper = new _PdfContentParserHelper(_TextProcessingMode.textExtraction);
        helper._parser = mockParser;
        mockRecord._operator = "'";
        mockRecord._operands = ['(text)'];
        const recordCollection: any[] = [mockRecord];
        const fontCollection: Map<string, _FontStructure> = new Map();
        const xObjectCollection: Map<string, any> = new Map();
        // Act
        const result: number = helper._processPdfRecordCollection(mockTextState, 0, '', mockPage, recordCollection, fontCollection, xObjectCollection, mockGraphicState, null, 0, 0, 0, -1, null);
        // Assert
        expect(result).toBe(0);
    });
    it('should process Pdf record collection for double quote operator', () => {
        // Arrange
        helper = new _PdfContentParserHelper(_TextProcessingMode.textExtraction);
        helper._parser = mockParser;
        mockRecord._operator = '"';
        mockRecord._operands = ['5', '10', '(text)'];
        const recordCollection: any[] = [mockRecord];
        const fontCollection: Map<string, _FontStructure> = new Map();
        const xObjectCollection: Map<string, any> = new Map();
        // Act
        const result: number = helper._processPdfRecordCollection(mockTextState, 0, '', mockPage, recordCollection, fontCollection, xObjectCollection, mockGraphicState, null, 0, 0, 0, -1, null);
        // Assert
        expect(result).toBe(0);
    });
});
