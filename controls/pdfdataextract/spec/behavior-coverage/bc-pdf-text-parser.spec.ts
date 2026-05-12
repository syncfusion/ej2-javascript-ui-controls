import { _PdfTextParser } from '../../src/pdf-data-extract/core/pdf-text-parser';
import { _PdfCrossReference, _PdfDictionary, _PdfName, PdfPage, PdfRotationAngle, Rectangle, Size } from '@syncfusion/ej2-pdf';
import { _GraphicState, _TextState } from '../../src/pdf-data-extract/core/graphic-state';
import { _FontStructure } from '../../src/pdf-data-extract/core/text-extraction/font-structure';
import { TextGlyph, TextLine, TextWord } from '../../src/pdf-data-extract/core/text-structure';
import { _MatrixHelper } from '../../src/pdf-data-extract/core/text-extraction/matrix-helper';
import { _PdfContentParserHelper } from '../../src/pdf-data-extract/core/content-parser-helper';
import { PdfRedactionRegion } from '../../src/pdf-data-extract/core/redaction/pdf-redaction-region';
describe('_PdfTextParser (Lines 1-777)', () => {
    let parser: _PdfTextParser;
    let mockXref: any;
    let mockPage: any;
    let mockTextState: any;
    let mockFont: any;
    let mockGraphicState: any;
    let mockContentParserHelper: any;
    beforeEach(() => {
        parser = new _PdfTextParser();
        mockXref = jasmine.createSpyObj('_PdfCrossReference', ['_fetch']);
        mockTextState = jasmine.createSpyObj('_TextState', [
            '_setTextMatrix', '_setTextLineMatrix', '_carriageReturn', '_translateTextLineMatrix', '_translateTextMatrix'
        ]);
        mockFont = jasmine.createSpyObj('_FontStructure', ['_charsToGlyphs']);
        mockGraphicState = jasmine.createSpyObj('_GraphicState', ['_save', '_restore', '_transform']);
        mockContentParserHelper = jasmine.createSpyObj('_PdfContentParserHelper', ['_splitWords']);
        mockTextState._textMatrix = [1, 0, 0, 1, 0, 0];
        mockTextState._textLineMatrix = [1, 0, 0, 1, 0, 0];
        mockTextState._fontSize = 12;
        mockTextState._textHScale = 1;
        mockTextState._textRise = 0;
        mockTextState._charSpacing = 0;
        mockTextState._wordSpacing = 0;
        mockTextState._font = 'Helvetica';
        mockTextState._ctm = [1, 0, 0, 1, 0, 0];
        mockTextState._textColor = 'black';
        mockFont._type = 'TrueType';
        mockFont._encoding = 'WinAnsiEncoding';
        mockFont._vertical = false;
        mockFont._fontMatrix = [0.001, 0, 0, 0.001, 0, 0];
        mockFont._isType3Font = false;
        mockFont._boundingBox = [0, 0, 100, 100];
        mockFont._name = 'Helvetica';
        mockFont._fontStyle = 'normal';
        mockFont._dictionary = jasmine.createSpyObj('_PdfDictionary', ['has']);
        mockFont._dictionary.has.and.returnValue(false);
        mockPage = jasmine.createSpyObj('PdfPage', [
            'getCropBox',
            'getMediaBox'
        ]);
        mockPage.rotation = PdfRotationAngle.angle0;
        mockPage.size = { width: 612, height: 792 };
        mockPage.cropBox = [0, 0, 0, 0];
        mockPage.mediaBox = [0, 0, 612, 792];
    });
    it('should initialize parser with default properties', () => {
        // Arrange & Act
        const newParser: _PdfTextParser = new _PdfTextParser();
        // Assert
        expect(newParser._textGlyph).toEqual([]);
        expect(newParser._textWord).toEqual([]);
        expect(newParser._textLine).toEqual([]);
        expect(newParser._extractedText).toBe('');
        expect(newParser._width).toBe(0);
        expect(newParser._height).toBe(0);
        expect(newParser._index).toBe(0);
        expect(newParser._fontSize).toBe(0);
        expect(newParser._encodedText).toEqual([]);
        expect(newParser._previousRect).toEqual({ x: 0, y: 0, width: 0, height: 0 });
        expect(newParser._boundingRectangle).toEqual({ x: 0, y: 0, width: 0, height: 0 });
    });
    it('should translate text matrix correctly', () => {
        // Arrange
        const x: number = 10;
        const y: number = 20;
        const textMatrix: _MatrixHelper = new _MatrixHelper(1, 0, 0, 1, 0, 0);
        // Act
        const result: _MatrixHelper = parser._translateTextMatrix(x, y, textMatrix);
        // Assert
        expect(result._m11).toBe(1);
        expect(result._m12).toBe(0);
        expect(result._m21).toBe(0);
        expect(result._m22).toBe(1);
        expect(result._offsetX).toBe(10);
        expect(result._offsetY).toBe(20);
    });
    it('should get character width for TrueType font', () => {
        // Arrange
        const width: number = 500;
        mockFont._type = 'TrueType';
        // Act
        const result: number = parser._getCharacterWidth(width, mockFont);
        // Assert
        expect(result).toBe(500);
    });
    it('should get character width for non-TrueType font', () => {
        // Arrange
        const width: number = 500;
        mockFont._type = 'Type1';
        // Act
        const result: number = parser._getCharacterWidth(width, mockFont);
        // Assert
        expect(result).toBe(1);
    });
    it('should set new line with leading', () => {
        // Arrange
        // Act
        parser._setNewLineWithLeading(mockTextState);
        // Assert
        expect(mockTextState._carriageReturn).toHaveBeenCalled();
    });
    it('should set text matrix from element array', () => {
        // Arrange
        const element: string[] = ['1.0', '0.0', '0.0', '1.0', '10', '20'];
        // Act
        parser._setTextMatrix(element, mockTextState);
        // Assert
        expect(mockTextState._setTextMatrix).toHaveBeenCalledWith(1, 0, 0, 1, 10, 20);
        expect(mockTextState._setTextLineMatrix).toHaveBeenCalledWith(1, 0, 0, 1, 10, 20);
    });
    it('should initialize text matrices to identity', () => {
        // Arrange
        const identityMatrix: number[] = [1, 0, 0, 1, 0, 0];
        // Act
        parser._beginText(mockTextState, identityMatrix);
        // Assert
        expect(mockTextState._textMatrix).toEqual([1, 0, 0, 1, 0, 0]);
        expect(mockTextState._textLineMatrix).toEqual([1, 0, 0, 1, 0, 0]);
    });
    it('should set font name and size from element array with slash', () => {
        // Arrange
        const element: string[] = ['/Helvetica', '12'];
        mockTextState._font = '';
        mockTextState._fontSize = 0;
        // Act
        parser._setFont(element, mockTextState);
        // Assert
        expect(mockTextState._font).toBe('Helvetica');
        expect(mockTextState._fontSize).toBe(12);
    });
    it('should set font name and size finding slash in multiple elements', () => {
        // Arrange
        const element: string[] = ['/Times', '14'];
        mockTextState._font = '';
        mockTextState._fontSize = 0;
        // Act
        parser._setFont(element, mockTextState);
        // Assert
        expect(mockTextState._font).toBe('Times');
        expect(mockTextState._fontSize).toBe(14);
    });
    it('should move text placement and set leading', () => {
        // Arrange
        const element: string[] = ['5', '-10'];
        // Act
        parser._moveTextPlacementAndSetLeading(element, mockTextState);
        // Assert
        expect(mockTextState._leading).toBe(10);
        expect(mockTextState._translateTextLineMatrix).toHaveBeenCalledWith(5, -10);
        expect(mockTextState._textMatrix).toEqual(mockTextState._textLineMatrix);
    });
    it('should set text rise value', () => {
        // Arrange
        const element: string[] = ['5'];
        mockTextState._textRise = 0;
        // Act
        parser._setTextRise(element, mockTextState);
        // Assert
        expect(mockTextState._textRise).toBe(5);
    });
    it('should set character spacing', () => {
        // Arrange
        const element: string[] = ['2.5'];
        mockTextState._charSpacing = 0;
        // Act
        parser._setCharSpacing(element, mockTextState);
        // Assert
        expect(mockTextState._charSpacing).toBe(2.5);
    });
    it('should set word spacing', () => {
        // Arrange
        const element: string[] = ['3.5'];
        mockTextState._wordSpacing = 0;
        // Act
        parser._setWordSpacing(element, mockTextState);
        // Assert
        expect(mockTextState._wordSpacing).toBe(3.5);
    });
    it('should set text horizontal scale', () => {
        // Arrange
        const element: string[] = ['80'];
        mockTextState._textHScale = 0;
        // Act
        parser._setTextHorizontalScale(element, mockTextState);
        // Assert
        expect(mockTextState._textHScale).toBe(0.8);
    });
    it('should update text leading', () => {
        // Arrange
        const element: string[] = ['-12'];
        mockTextState._leading = 0;
        // Act
        parser._updateTextLeading(element, mockTextState);
        // Assert
        expect(mockTextState._leading).toBe(-12);
    });
    it('should move text placement', () => {
        // Arrange
        const element: string[] = ['15', '25'];
        // Act
        parser._moveTextPlacement(element, mockTextState);
        // Assert
        expect(mockTextState._translateTextLineMatrix).toHaveBeenCalledWith(15, 25);
        expect(mockTextState._textMatrix).toEqual(mockTextState._textLineMatrix);
    });
    it('should get current transform for non-Type3 font', () => {
        // Arrange
        mockFont._isType3Font = false;
        mockTextState._fontSize = 12;
        mockTextState._textHScale = 1;
        mockTextState._textRise = 0;
        mockTextState._ctm = [1, 0, 0, 1, 0, 0];
        mockTextState._textMatrix = [1, 0, 0, 1, 0, 0];
        // Act
        const result: number[] = parser._getCurrentTransform(mockFont, mockFont._fontMatrix, mockTextState);
        // Assert
        expect(result.length).toBe(6);
        expect(result[4]).toBeDefined();
        expect(result[5]).toBeDefined();
    });
    it('should get current transform for Type3 font with small fontSize and non-default fontMatrix', () => {
        // Arrange
        mockFont._isType3Font = true;
        mockFont._boundingBox = [0, -200, 500, 800];
        mockTextState._fontSize = 0.5;
        mockTextState._textHScale = 1;
        mockTextState._textRise = 0;
        mockTextState._ctm = [1, 0, 0, 1, 0, 0];
        mockTextState._textMatrix = [1, 0, 0, 1, 0, 0];
        const fontMatrix: number[] = [0.002, 0, 0, 0.002, 0, 0];
        // Act
        const result: number[] = parser._getCurrentTransform(mockFont, fontMatrix, mockTextState);
        // Assert
        expect(result.length).toBe(6);
        expect(result[3]).toBeDefined();
    });
    it('should handle Type3 font with zero glyphHeight', () => {
        // Arrange
        mockFont._isType3Font = true;
        mockFont._boundingBox = [0, 0, 500, 0];
        mockTextState._fontSize = 0.5;
        mockTextState._textHScale = 1;
        mockTextState._textRise = 0;
        mockTextState._ctm = [1, 0, 0, 1, 0, 0];
        mockTextState._textMatrix = [1, 0, 0, 1, 0, 0];
        const fontMatrix: number[] = [0.002, 0, 0, 0.002, 0, 0];
        // Act
        const result: number[] = parser._getCurrentTransform(mockFont, fontMatrix, mockTextState);
        // Assert
        expect(result.length).toBe(6);
    });
    it('should detect text found at exact y position in redaction bounds', () => {
        // Arrange
        const x: number = 100;
        const y: number = 200;
        const redactionRegion: any = jasmine.createSpyObj('PdfRedactionRegion', ['_dummy']);
        redactionRegion._bounds = { x: 50, y: 200, width: 100, height: 50 };
        const redactBounds: PdfRedactionRegion[] = [redactionRegion];
        // Act
        const result: boolean = parser._isFoundText(x, y, mockPage, redactBounds);
        // Assert
        expect(result).toBe(true);
    });
    it('should detect text found one position above redaction bounds', () => {
        // Arrange
        const x: number = 100;
        const y: number = 201;
        const redactionRegion: any = jasmine.createSpyObj('PdfRedactionRegion', ['_dummy']);
        redactionRegion._bounds = { x: 50, y: 200, width: 100, height: 50 };
        const redactBounds: PdfRedactionRegion[] = [redactionRegion];
        // Act
        const result: boolean = parser._isFoundText(x, y, mockPage, redactBounds);
        // Assert
        expect(result).toBe(true);
    });
    it('should detect text found one position below redaction bounds', () => {
        // Arrange
        const x: number = 100;
        const y: number = 199;
        const redactionRegion: any = jasmine.createSpyObj('PdfRedactionRegion', ['_dummy']);
        redactionRegion._bounds = { x: 50, y: 200, width: 100, height: 50 };
        const redactBounds: PdfRedactionRegion[] = [redactionRegion];
        // Act
        const result: boolean = parser._isFoundText(x, y, mockPage, redactBounds);
        // Assert
        expect(result).toBe(true);
    });
    it('should handle negative y coordinate in isFoundText', () => {
        // Arrange
        const x: number = 100;
        const y: number = -200;
        const redactionRegion: any = jasmine.createSpyObj('PdfRedactionRegion', ['_dummy']);
        redactionRegion._bounds = { x: 50, y: 200, width: 100, height: 50 };
        const redactBounds: PdfRedactionRegion[] = [redactionRegion];
        // Act
        const result: boolean = parser._isFoundText(x, y, mockPage, redactBounds);
        // Assert
        expect(result).toBeDefined();
    });
    it('should return false for text not in redaction bounds', () => {
        // Arrange
        const x: number = 100;
        const y: number = 500;
        const redactionRegion: any = jasmine.createSpyObj('PdfRedactionRegion', ['_dummy']);
        redactionRegion._bounds = { x: 50, y: 200, width: 100, height: 50 };
        const redactBounds: PdfRedactionRegion[] = [redactionRegion];
        // Act
        const result: boolean = parser._isFoundText(x, y, mockPage, redactBounds);
        // Assert
        expect(result).toBe(false);
    });
    it('should get relative location for angle0 rotation', () => {
        // Arrange
        const x: number = 100;
        const y: number = 200;
        mockPage.rotation = PdfRotationAngle.angle0;
        // Act
        const result: number[] = parser._getRelativeLocation(x, y, mockPage);
        // Assert
        expect(result).toEqual([100, 200]);
    });
    it('should get relative location for angle90 rotation', () => {
        // Arrange
        const x: number = 100;
        const y: number = 200;
        mockPage.rotation = PdfRotationAngle.angle90;
        mockPage.size = { width: 612, height: 792 };
        // Act
        const result: number[] = parser._getRelativeLocation(x, y, mockPage);
        // Assert
        expect(result).toEqual([592, 100]);
    });
    it('should get relative location for angle270 rotation', () => {
        // Arrange
        const x: number = 100;
        const y: number = 200;
        mockPage.rotation = PdfRotationAngle.angle270;
        mockPage.size = { width: 612, height: 792 };
        // Act
        const result: number[] = parser._getRelativeLocation(x, y, mockPage);
        // Assert
        expect(result).toEqual([512, 200]);
    });
    it('should transform two matrices correctly', () => {
        // Arrange
        const m1: number[] = [1, 0, 0, 1, 10, 20];
        const m2: number[] = [2, 0, 0, 2, 5, 10];
        // Act
        const result: number[] = parser._transform(m1, m2);
        // Assert
        expect(result.length).toBe(6);
        expect(result[0]).toBe(2);
        expect(result[1]).toBe(0);
        expect(result[2]).toBe(0);
        expect(result[3]).toBe(2);
        expect(result[4]).toBe(15);
        expect(result[5]).toBe(30);
    });
    it('should get crop box values when non-zero', () => {
        // Arrange
        mockPage.cropBox = [10, 20, 602, 782];
        mockPage.mediaBox = [0, 0, 612, 792];
        // Act
        const result: number[] = parser._getCropOrMediaBox(mockPage);
        // Assert
        expect(result).toEqual([10, 602, 782]);
    });
    it('should get media box values when crop box is zero', () => {
        // Arrange
        mockPage.cropBox = [0, 0, 0, 0];
        mockPage.mediaBox = [0, 0, 612, 792];
        // Act
        const result: number[] = parser._getCropOrMediaBox(mockPage);
        // Assert
        expect(result).toEqual([0, 612, 792]);
    });
    it('should get empty array when both crop and media box are zero', () => {
        // Arrange
        mockPage.cropBox = [0, 0, 0, 0];
        mockPage.mediaBox = [0, 0, 0, 0];
        // Act
        const result: number[] = parser._getCropOrMediaBox(mockPage);
        // Assert
        expect(result).toEqual([]);
    });
    it('should split text with literal string notation', () => {
        // Arrange
        const encodedText: string = '(Hello World)';
        const inputText: string[] = [];
        // Act
        const result: any = parser._getSplitText(encodedText, mockFont, inputText, false);
        // Assert
        expect(result.decodedList).toBeDefined();
        expect(result.decodedList.length).toBeGreaterThan(0);
        expect(result.inputType).toBeUndefined();
    });
    it('should split text with array notation', () => {
        // Arrange
        const encodedText: string = '[...tokens...]';
        const inputText: string[] = ['(Hello)', '<48656C6C6F>'];
        // Act
        const result: any = parser._getSplitText(encodedText, mockFont, inputText, false);
        // Assert
        expect(result.decodedList).toBeDefined();
    });
    it('should split text with hex notation', () => {
        // Arrange
        const encodedText: string = '<48656C6C6F>';
        const inputText: string[] = [];
        // Act
        const result: any = parser._getSplitText(encodedText, mockFont, inputText, false);
        // Assert
        expect(result.decodedList).toBeDefined();
        expect(result.decodedList.length).toBeGreaterThan(0);
    });
    it('should split text with redaction flag', () => {
        // Arrange
        const encodedText: string = '(Hello)';
        const inputText: string[] = [];
        // Act
        const result: any = parser._getSplitText(encodedText, mockFont, inputText, true);
        // Assert
        expect(result.inputType).toBeDefined();
        expect(Array.isArray(result.inputType)).toBe(true);
    });
    it('should get page rotation 90 from text matrix', () => {
        // Arrange
        mockTextState._textMatrix = [0, 1, -1, 0, 0, 0];
        // Act
        const result: number = parser._getPageRotation(mockTextState);
        // Assert
        expect(result).toBe(90);
    });
    it('should get page rotation 270 from text matrix', () => {
        // Arrange
        mockTextState._textMatrix = [0, -1, 1, 0, 0, 0];
        // Act
        const result: number = parser._getPageRotation(mockTextState);
        // Assert
        expect(result).toBe(270);
    });
    it('should get page rotation 0 for identity matrix', () => {
        // Arrange
        mockTextState._textMatrix = [1, 0, 0, 1, 0, 0];
        // Act
        const result: number = parser._getPageRotation(mockTextState);
        // Assert
        expect(result).toBe(0);
    });
    it('should split hex string with 2-byte chunks', () => {
        // Arrange
        const hexString: string = '<48656C6C6F>';
        // Act
        const result: string[] = parser._splitHexString(hexString);
        // Assert
        expect(result.length).toBeGreaterThan(0);
        expect(result[0]).toBeDefined();
    });
    it('should split hex string with 4-byte chunks when starts with 0', () => {
        // Arrange
        const hexString: string = '<01FF02FE>';
        // Act
        const result: string[] = parser._splitHexString(hexString);
        // Assert
        expect(result.length).toBeGreaterThan(0);
    });
    it('should return empty array for undefined hex string', () => {
        // Arrange
        const hexString: string = undefined;
        // Act
        const result: string[] = parser._splitHexString(hexString);
        // Assert
        expect(result).toEqual([]);
    });
    it('should create fallback font dictionary', () => {
        // Arrange
        // Act
        const result: _PdfDictionary = parser._getFallBackFontDictionary(mockXref);
        // Assert
        expect(result).toBeDefined();
    });
    it('should process q command (save state)', () => {
        // Arrange
        const token: string = 'q';
        const element: string[] = [];
        // Act
        parser._processCommand(token, element, mockGraphicState);
        // Assert
        expect(mockGraphicState._save).toHaveBeenCalled();
    });
    it('should process Q command (restore state)', () => {
        // Arrange
        const token: string = 'Q';
        const element: string[] = [];
        // Act
        parser._processCommand(token, element, mockGraphicState);
        // Assert
        expect(mockGraphicState._restore).toHaveBeenCalled();
    });
    it('should process cm command (transform)', () => {
        // Arrange
        const token: string = 'cm';
        const element: string[] = ['1', '0', '0', '1', '10', '20'];
        // Act
        parser._processCommand(token, element, mockGraphicState);
        // Assert
        expect(mockGraphicState._transform).toHaveBeenCalledWith([1, 0, 0, 1, 10, 20]);
    });
    it('should get text font from collection when exists', () => {
        // Arrange
        const fontCollection: Map<string, _FontStructure> = new Map();
        fontCollection.set('Helvetica', mockFont);
        mockTextState._font = 'Helvetica';
        // Act
        const result: _FontStructure = parser._getTextFont(fontCollection, mockTextState, mockXref);
        // Assert
        expect(result).toBe(mockFont);
    });
    it('should get fallback text font when not in collection', () => {
        // Arrange
        const fontCollection: Map<string, _FontStructure> = new Map();
        mockTextState._font = 'UnknownFont';
        // Act
        const result: _FontStructure = parser._getTextFont(fontCollection, mockTextState, mockXref);
        // Assert
        expect(result).toBeDefined();
    });
    it('should get text content item with horizontal text', () => {
        // Arrange
        const text: string = 'Hellos';
        const extraSpacing: number = 0;
        const tempString: string = '';
        const previousRect: any = { x: 0, y: 0, width: 0, height: 0 };
        const extractedText: string = '';
        const glyph: any = { _unicode: 'H', _width: 500, _fontCharacter: 'H', vmetric: null };
        const glyphs: any = [glyph];
        mockFont._charsToGlyphs.and.returnValue(glyphs);
        mockFont._vertical = false;
        mockFont._fontMatrix = [0.001, 0, 0, 0.001, 0, 0];
        mockContentParserHelper._splitWords.and.returnValue({ tempString: '', previousRect: previousRect });
        // Act
        const result: any = parser._getTextContentItem(mockFont, text, extraSpacing, mockTextState, mockPage,
            tempString, previousRect, extractedText, mockContentParserHelper);
        // Assert
        expect(result).toBeDefined();
        expect(result.textGlyphs).toBeUndefined();
    });
    it('should get text content item with textGlyphs output mode', () => {
        // Arrange
        const text: string = 'As';
        const extraSpacing: number = 0;
        const tempString: string = '';
        const previousRect: any = { x: 0, y: 0, width: 0, height: 0 };
        const extractedText: string = '';
        const textGlyphs: TextGlyph[] = [];
        const encodedText: string[] = [];
        let index: number = 0;
        const glyph: any = { _unicode: 'A', _width: 500, _fontCharacter: 'A', vmetric: null };
        const glyphs: any = [glyph];
        mockFont._charsToGlyphs.and.returnValue(glyphs);
        mockFont._vertical = false;
        mockFont._fontMatrix = [0.001, 0, 0, 0.001, 0, 0];
        // Act
        const result: any = parser._getTextContentItem(mockFont, text, extraSpacing, mockTextState, mockPage,
            tempString, previousRect, extractedText, undefined, textGlyphs, undefined, index, encodedText);
        // Assert
        expect(result.textGlyphs).toBeDefined();
        expect(result.extractedText).toBeDefined();
        expect(result.encodedText).toBeDefined();
    });
    it('should handle space character in horizontal text', () => {
        // Arrange
        const text: string = ' s';
        const extraSpacing: number = 0;
        const tempString: string = '';
        const previousRect: any = { x: 0, y: 0, width: 0, height: 0 };
        const extractedText: string = '';
        const glyph: any = { _unicode: ' ', _width: 250, _fontCharacter: ' ', vmetric: null };
        const glyphs: any = [glyph];
        mockFont._charsToGlyphs.and.returnValue(glyphs);
        mockFont._vertical = false;
        mockFont._fontMatrix = [0.001, 0, 0, 0.001, 0, 0];
        mockContentParserHelper._splitWords.and.returnValue({ tempString: '', previousRect: previousRect });
        // Act
        const result: any = parser._getTextContentItem(mockFont, text, extraSpacing, mockTextState, mockPage,
            tempString, previousRect, extractedText, mockContentParserHelper);
        // Assert
        expect(result).toBeDefined();
    });
    it('should handle vertical font text', () => {
        // Arrange
        const text: string = 'Vs';
        const extraSpacing: number = 0;
        const tempString: string = '';
        const previousRect: any = { x: 0, y: 0, width: 0, height: 0 };
        const extractedText: string = '';
        const glyph: any = { _unicode: 'V', _width: 500, _fontCharacter: 'V', vmetric: [600, 0] };
        const glyphs: any = [glyph];
        mockFont._charsToGlyphs.and.returnValue(glyphs);
        mockFont._vertical = true;
        mockFont._fontMatrix = [0.001, 0, 0, 0.001, 0, 0];
        mockContentParserHelper._splitWords.and.returnValue({ tempString: '', previousRect: previousRect });
        // Act
        const result: any = parser._getTextContentItem(mockFont, text, extraSpacing, mockTextState, mockPage,
            tempString, previousRect, extractedText, mockContentParserHelper);
        // Assert
        expect(result).toBeDefined();
    });
    it('should handle page rotation angle90 with text bounds', () => {
        // Arrange
        const text: string = 'Rs';
        const extraSpacing: number = 0;
        const tempString: string = '';
        const previousRect: any = { x: 0, y: 0, width: 0, height: 0 };
        const extractedText: string = '';
        const glyph: any = { _unicode: 'R', _width: 500, _fontCharacter: 'R', vmetric: null };
        const glyphs: any = [glyph];
        mockFont._charsToGlyphs.and.returnValue(glyphs);
        mockFont._vertical = false;
        mockFont._fontMatrix = [0.001, 0, 0, 0.001, 0, 0];
        mockPage.rotation = PdfRotationAngle.angle90;
        mockContentParserHelper._splitWords.and.returnValue({ tempString: '', previousRect: previousRect });
        // Act
        const result: any = parser._getTextContentItem(mockFont, text, extraSpacing, mockTextState, mockPage,
            tempString, previousRect, extractedText, mockContentParserHelper);
        // Assert
        expect(result).toBeDefined();
    });
    it('should handle page rotation angle180 with text bounds', () => {
        // Arrange
        const text: string = '1s';
        const extraSpacing: number = 0;
        const tempString: string = '';
        const previousRect: any = { x: 0, y: 0, width: 0, height: 0 };
        const extractedText: string = '';
        const glyph: any = { _unicode: '1', _width: 500, _fontCharacter: '1', vmetric: null };
        const glyphs: any = [glyph];
        mockFont._charsToGlyphs.and.returnValue(glyphs);
        mockFont._vertical = false;
        mockFont._fontMatrix = [0.001, 0, 0, 0.001, 0, 0];
        mockPage.rotation = PdfRotationAngle.angle180;
        mockContentParserHelper._splitWords.and.returnValue({ tempString: '', previousRect: previousRect });
        // Act
        const result: any = parser._getTextContentItem(mockFont, text, extraSpacing, mockTextState, mockPage,
            tempString, previousRect, extractedText, mockContentParserHelper);
        // Assert
        expect(result).toBeDefined();
    });
    it('should handle page rotation angle270 with text bounds', () => {
        // Arrange
        const text: string = '2s';
        const extraSpacing: number = 0;
        const tempString: string = '';
        const previousRect: any = { x: 0, y: 0, width: 0, height: 0 };
        const extractedText: string = '';
        const glyph: any = { _unicode: '2', _width: 500, _fontCharacter: '2', vmetric: null };
        const glyphs: any = [glyph];
        mockFont._charsToGlyphs.and.returnValue(glyphs);
        mockFont._vertical = false;
        mockFont._fontMatrix = [0.001, 0, 0, 0.001, 0, 0];
        mockPage.rotation = PdfRotationAngle.angle270;
        mockContentParserHelper._splitWords.and.returnValue({ tempString: '', previousRect: previousRect });
        // Act
        const result: any = parser._getTextContentItem(mockFont, text, extraSpacing, mockTextState, mockPage,
            tempString, previousRect, extractedText, mockContentParserHelper);
        // Assert
        expect(result).toBeDefined();
    });
    it('should handle descendant fonts with height calculation', () => {
        // Arrange
        const text: string = 'Ds';
        const extraSpacing: number = 0;
        const tempString: string = '';
        const previousRect: any = { x: 0, y: 0, width: 0, height: 0 };
        const extractedText: string = '';
        const glyph: any = { _unicode: 'D', _width: 500, _fontCharacter: 'D', vmetric: null };
        const glyphs: any = [glyph];
        mockFont._charsToGlyphs.and.returnValue(glyphs);
        mockFont._vertical = false;
        mockFont._fontMatrix = [0.001, 0, 0, 0.001, 0, 0];
        mockFont._dictionary.has.and.returnValue(true);
        mockContentParserHelper._splitWords.and.returnValue({ tempString: '', previousRect: previousRect });
        // Act
        const result: any = parser._getTextContentItem(mockFont, text, extraSpacing, mockTextState, mockPage,
            tempString, previousRect, extractedText, mockContentParserHelper);
        // Assert
        expect(result).toBeDefined();
    });
    it('should handle hex input in text content item', () => {
        // Arrange
        const text: string = 'Hs';
        const extraSpacing: number = 0;
        const tempString: string = '';
        const previousRect: any = { x: 0, y: 0, width: 0, height: 0 };
        const extractedText: string = '';
        const textGlyphs: TextGlyph[] = [];
        const encodedText: string[] = [];
        let index: number = 0;
        const hex: string[] = ['48', '73'];
        const glyph: any = { _unicode: 'H', _width: 500, _fontCharacter: 'H', vmetric: null };
        const glyphs: any = [glyph];
        mockFont._charsToGlyphs.and.returnValue(glyphs);
        mockFont._vertical = false;
        mockFont._fontMatrix = [0.001, 0, 0, 0.001, 0, 0];
        // Act
        const result: any = parser._getTextContentItem(mockFont, text, extraSpacing, mockTextState, mockPage,
            tempString, previousRect, extractedText, undefined, textGlyphs, hex, index, encodedText);
        // Assert
        expect(result.textGlyphs).toBeDefined();
        expect(result.textGlyphs.length).toBeGreaterThan(0);
    });
    it('should handle extra spacing on last glyph', () => {
        // Arrange
        const text: string = 'Exs';
        const extraSpacing: number = 5;
        const tempString: string = '';
        const previousRect: any = { x: 0, y: 0, width: 0, height: 0 };
        const extractedText: string = '';
        const glyph: any = { _unicode: 'E', _width: 500, _fontCharacter: 'E', vmetric: null };
        const glyphs: any = [glyph, glyph];
        mockFont._charsToGlyphs.and.returnValue(glyphs);
        mockFont._vertical = false;
        mockFont._fontMatrix = [0.001, 0, 0, 0.001, 0, 0];
        mockContentParserHelper._splitWords.and.returnValue({ tempString: '', previousRect: previousRect });
        // Act
        const result: any = parser._getTextContentItem(mockFont, text, extraSpacing, mockTextState, mockPage,
            tempString, previousRect, extractedText, mockContentParserHelper);
        // Assert
        expect(result).toBeDefined();
    });
    it('should handle multiple redaction regions with early break', () => {
        // Arrange
        const x: number = 100;
        const y: number = 200;
        const redactionRegion1: any = jasmine.createSpyObj('PdfRedactionRegion', ['_dummy']);
        redactionRegion1._bounds = { x: 50, y: 200, width: 100, height: 50 };
        const redactionRegion2: any = jasmine.createSpyObj('PdfRedactionRegion', ['_dummy']);
        redactionRegion2._bounds = { x: 150, y: 300, width: 100, height: 50 };
        const redactBounds: PdfRedactionRegion[] = [redactionRegion1, redactionRegion2];
        // Act
        const result: boolean = parser._isFoundText(x, y, mockPage, redactBounds);
        // Assert
        expect(result).toBe(true);
    });
    it('should transform identity matrices', () => {
        // Arrange
        const m1: number[] = [1, 0, 0, 1, 0, 0];
        const m2: number[] = [1, 0, 0, 1, 0, 0];
        // Act
        const result: number[] = parser._transform(m1, m2);
        // Assert
        expect(result).toEqual([1, 0, 0, 1, 0, 0]);
    });
    it('should split text with escaped newline in literal', () => {
        // Arrange
        const encodedText: string = '(Hello\\nWorld)';
        const inputText: string[] = [];
        // Act
        const result: any = parser._getSplitText(encodedText, mockFont, inputText, false);
        // Assert
        expect(result.decodedList).toBeDefined();
    });
    it('should handle empty redaction bounds array', () => {
        // Arrange
        const x: number = 100;
        const y: number = 200;
        const redactBounds: PdfRedactionRegion[] = [];
        // Act
        const result: boolean = parser._isFoundText(x, y, mockPage, redactBounds);
        // Assert
        expect(result).toBe(false);
    });
    it('should cover yPosition >= (bounds.y - bounds.height) branch in _isFoundText', () => {
        // Arrange
        const x: number = 100;
        const y: number = 200;
        const mockRedaction: any = jasmine.createSpyObj('PdfRedactionRegion', ['_dummy']);
        mockRedaction._bounds = { x: 50, y: 250, width: 100, height: 100 };
        const redactBounds: PdfRedactionRegion[] = [mockRedaction];
        // Act
        const result: boolean = parser._isFoundText(x, y, mockPage, redactBounds);
        // Assert
        expect(result).toBe(true);
    });
    it('should cover bounds.y >= yPosition && yPosition >= (bounds.y - bounds.height) condition', () => {
        // Arrange
        const x: number = 100;
        const y: number = 300;
        const mockRedaction: any = jasmine.createSpyObj('PdfRedactionRegion', ['_dummy']);
        mockRedaction._bounds = { x: 50, y: 350, width: 100, height: 100 };
        const redactBounds: PdfRedactionRegion[] = [mockRedaction];
        mockPage.size = { width: 612, height: 792 };
        // Act
        const result: boolean = parser._isFoundText(x, y, mockPage, redactBounds);
        // Assert
        expect(result).toBe(true);
    });
    it('should handle rectValue.y !== 0 branch in _isFoundText', () => {
        // Arrange
        const x: number = 100;
        const y: number = 200;
        const mockRedaction: any = jasmine.createSpyObj('PdfRedactionRegion', ['_dummy']);
        mockRedaction._bounds = { x: 50, y: 220, width: 100, height: 50 };
        const redactBounds: PdfRedactionRegion[] = [mockRedaction];
        // Act
        const result: boolean = parser._isFoundText(x, y, mockPage, redactBounds);
        // Assert
        expect(result).toBe(true);
    });
    it('should cover _getCropOrMediaBox with non-zero crop box', () => {
        // Arrange
        mockPage.cropBox = [10, 20, 602, 782];
        // Act
        const result: number[] = parser._getCropOrMediaBox(mockPage);
        // Assert
        expect(result[0]).toBe(10);
        expect(result[1]).toBe(602);
        expect(result[2]).toBe(782);
    });
    it('should cover _getCropOrMediaBox with zero crop box and non-zero media box', () => {
        // Arrange
        mockPage.cropBox = [0, 0, 0, 0];
        mockPage.mediaBox = [0, 0, 612, 792];
        // Act
        const result: number[] = parser._getCropOrMediaBox(mockPage);
        // Assert
        expect(result[0]).toBe(0);
        expect(result[1]).toBe(612);
        expect(result[2]).toBe(792);
    });
    it('should cover _getCropOrMediaBox with both zero values returning empty array', () => {
        // Arrange
        mockPage.cropBox = [0, 0, 0, 0];
        mockPage.mediaBox = [0, 0, 0, 0];
        // Act
        const result: number[] = parser._getCropOrMediaBox(mockPage);
        // Assert
        expect(result.length).toBe(0);
    });
    it('should handle literal string case in _getSplitText with escape sequences', () => {
        // Arrange
        const encodedText: string = '(Hello\\nWorld)';
        mockFont._encoding = 'UTF-8';
        const result: any = { decodedList: ['tests'] };
        // Act
        const output: any = parser._getSplitText(encodedText, mockFont, [], false);
        // Assert
        expect(output.decodedList).toBeDefined();
        expect(Array.isArray(output.decodedList)).toBe(true);
    });
    it('should handle array case with hex input in _getSplitText', () => {
        // Arrange
        const encodedText: string = '[<48656C6C6F>]';
        const inputText: string[] = ['<48656C6C6F>'];
        mockFont._encoding = 'UTF-8';
        // Act
        const result: any = parser._getSplitText(encodedText, mockFont, inputText, false);
        // Assert
        expect(result.decodedList).toBeDefined();
        expect(Array.isArray(result.decodedList)).toBe(true);
    });
    it('should handle array case with literal string in _getSplitText', () => {
        // Arrange
        const encodedText: string = '[(Hello)]';
        const inputText: string[] = ['(Hello)'];
        mockFont._encoding = 'UTF-8';
        // Act
        const result: any = parser._getSplitText(encodedText, mockFont, inputText, false);
        // Assert
        expect(result.decodedList).toBeDefined();
    });
    it('should handle numeric width value in array in _getSplitText', () => {
        // Arrange
        const encodedText: string = '[100]';
        const inputText: string[] = ['100'];
        mockFont._encoding = 'UTF-8';
        // Act
        const result: any = parser._getSplitText(encodedText, mockFont, inputText, false);
        // Assert
        expect(result.decodedList).toBeDefined();
    });
    it('should handle hex case in _getSplitText', () => {
        // Arrange
        const encodedText: string = '<48656C6C6F>';
        mockFont._encoding = 'UTF-8';
        // Act
        const result: any = parser._getSplitText(encodedText, mockFont, [], false);
        // Assert
        expect(result.decodedList).toBeDefined();
        expect(Array.isArray(result.decodedList)).toBe(true);
    });
    it('should handle array case with isForRedaction in _getSplitText', () => {
        // Arrange
        const encodedText: string = '[(Test)]';
        const inputText: string[] = ['(Test)'];
        mockFont._encoding = 'UTF-8';
        // Act
        const result: any = parser._getSplitText(encodedText, mockFont, inputText, true);
        // Assert
        expect(result.decodedList).toBeDefined();
        expect(result.inputType).toBeDefined();
        expect(Array.isArray(result.inputType)).toBe(true);
    });
    it('should handle vertical font case with vmetric in _getTextContentItem', () => {
        // Arrange
        mockFont._vertical = true;
        const glyph: any = {
            _unicode: 'A',
            _width: 100,
            vmetric: [80, 20],
            _fontCharacter: 'A'
        };
        mockFont._charsToGlyphs.and.returnValue([glyph]);
        mockTextState._textMatrix = [0, 1, -1, 0, 0, 0];
        mockContentParserHelper._splitWords.and.returnValue({ previousRect: { x: 0, y: 0, width: 10, height: 12 }, tempString: 'A' });
        // Act
        const result: any = parser._getTextContentItem(mockFont, 'As', 0, mockTextState, mockPage, '', { x: 0, y: 0, width: 0, height: 0 }, '', mockContentParserHelper);
        // Assert
        expect(result.tempString).toBeDefined();
        expect(result.extractedText).toContain('A');
    });
    it('should handle vertical font case without vmetric in _getTextContentItem', () => {
        // Arrange
        mockFont._vertical = true;
        const glyph: any = {
            _unicode: 'B',
            _width: 80,
            _fontCharacter: 'B'
        };
        mockFont._charsToGlyphs.and.returnValue([glyph]);
        mockTextState._textMatrix = [0, 1, -1, 0, 0, 0];
        mockContentParserHelper._splitWords.and.returnValue({ previousRect: { x: 0, y: 0, width: 10, height: 12 }, tempString: 'B' });
        // Act
        const result: any = parser._getTextContentItem(mockFont, 'Bs', 0, mockTextState, mockPage, '', { x: 0, y: 0, width: 0, height: 0 }, '', mockContentParserHelper);
        // Assert
        expect(result.extractedText).toContain('B');
    });
    it('should handle -glyphWidth case when vmetric is undefined in vertical font', () => {
        // Arrange
        mockFont._vertical = true;
        const glyph: any = {
            _unicode: 'C',
            _width: 100,
            _fontCharacter: 'C'
        };
        mockFont._charsToGlyphs.and.returnValue([glyph]);
        mockTextState._textMatrix = [0, 1, -1, 0, 0, 0];
        mockContentParserHelper._splitWords.and.returnValue({ previousRect: { x: 0, y: 0, width: 10, height: 12 }, tempString: 'C' });
        // Act
        const result: any = parser._getTextContentItem(mockFont, 'Cs', 0, mockTextState, mockPage, '', { x: 0, y: 0, width: 0, height: 0 }, '', mockContentParserHelper);
        // Assert
        expect(result.extractedText).toContain('C');
    });
    it('should handle space character with rotation 90 in horizontal font', () => {
        // Arrange
        const glyph: any = {
            _unicode: ' ',
            _width: 50,
            _fontCharacter: 'space'
        };
        mockFont._charsToGlyphs.and.returnValue([glyph]);
        mockTextState._textMatrix = [0, 1, -1, 0, 0, 0];
        mockContentParserHelper._splitWords.and.returnValue({ previousRect: { x: 0, y: 0, width: 10, height: 12 }, tempString: '' });
        // Act
        const result: any = parser._getTextContentItem(mockFont, ' s', 0, mockTextState, mockPage, '', { x: 0, y: 0, width: 0, height: 0 }, '', mockContentParserHelper);
        // Assert
        expect(result.extractedText).toContain(' ');
    });
    it('should handle space character with angle90 page rotation', () => {
        // Arrange
        mockPage.rotation = PdfRotationAngle.angle90;
        const glyph: any = {
            _unicode: ' ',
            _width: 50,
            _fontCharacter: 'space'
        };
        mockFont._charsToGlyphs.and.returnValue([glyph]);
        mockTextState._textMatrix = [1, 0, 0, 1, 0, 0];
        mockContentParserHelper._splitWords.and.returnValue({ previousRect: { x: 0, y: 0, width: 10, height: 12 }, tempString: '' });
        // Act
        const result: any = parser._getTextContentItem(mockFont, ' s', 0, mockTextState, mockPage, '', { x: 0, y: 0, width: 0, height: 0 }, '', mockContentParserHelper);
        // Assert
        expect(result.extractedText).toContain(' ');
    });
    it('should handle space character with angle180 page rotation', () => {
        // Arrange
        mockPage.rotation = PdfRotationAngle.angle180;
        const glyph: any = {
            _unicode: ' ',
            _width: 50,
            _fontCharacter: 'space'
        };
        mockFont._charsToGlyphs.and.returnValue([glyph]);
        mockTextState._textMatrix = [1, 0, 0, 1, 0, 0];
        mockContentParserHelper._splitWords.and.returnValue({ previousRect: { x: 0, y: 0, width: 10, height: 12 }, tempString: '' });
        // Act
        const result: any = parser._getTextContentItem(mockFont, ' s', 0, mockTextState, mockPage, '', { x: 0, y: 0, width: 0, height: 0 }, '', mockContentParserHelper);
        // Assert
        expect(result.extractedText).toContain(' ');
    });
    it('should handle non-space character with rotation 90 in horizontal font', () => {
        // Arrange
        const glyph: any = {
            _unicode: 'X',
            _width: 100,
            _fontCharacter: 'X'
        };
        mockFont._charsToGlyphs.and.returnValue([glyph]);
        mockTextState._textMatrix = [0, 1, -1, 0, 0, 0];
        mockContentParserHelper._splitWords.and.returnValue({ previousRect: { x: 0, y: 0, width: 10, height: 12 }, tempString: 'X' });
        // Act
        const result: any = parser._getTextContentItem(mockFont, 'Xs', 0, mockTextState, mockPage, '', { x: 0, y: 0, width: 0, height: 0 }, '', mockContentParserHelper);
        // Assert
        expect(result.extractedText).toContain('X');
    });
    it('should handle text bounds with page rotation angle0 and rotation 90', () => {
        // Arrange
        mockPage.rotation = PdfRotationAngle.angle0;
        const glyph: any = {
            _unicode: 'T',
            _width: 100,
            _fontCharacter: 'T'
        };
        mockFont._charsToGlyphs.and.returnValue([glyph]);
        mockTextState._textMatrix = [0, 1, -1, 0, 0, 0];
        mockContentParserHelper._splitWords.and.returnValue({ previousRect: { x: 0, y: 0, width: 10, height: 12 }, tempString: 'T' });
        // Act
        const result: any = parser._getTextContentItem(mockFont, 'Ts', 0, mockTextState, mockPage, '', { x: 0, y: 0, width: 0, height: 0 }, '', mockContentParserHelper);
        // Assert
        expect(result.extractedText).toContain('T');
    });
    it('should handle text bounds with page rotation angle90', () => {
        // Arrange
        mockPage.rotation = PdfRotationAngle.angle90;
        const glyph: any = {
            _unicode: 'D',
            _width: 100,
            _fontCharacter: 'D'
        };
        mockFont._charsToGlyphs.and.returnValue([glyph]);
        mockTextState._textMatrix = [1, 0, 0, 1, 0, 0];
        mockContentParserHelper._splitWords.and.returnValue({ previousRect: { x: 0, y: 0, width: 10, height: 12 }, tempString: 'D' });
        // Act
        const result: any = parser._getTextContentItem(mockFont, 'Ds', 0, mockTextState, mockPage, '', { x: 0, y: 0, width: 0, height: 0 }, '', mockContentParserHelper);
        // Assert
        expect(result.extractedText).toContain('D');
    });
    it('should handle text bounds with page rotation angle180', () => {
        // Arrange
        mockPage.rotation = PdfRotationAngle.angle180;
        const glyph: any = {
            _unicode: 'E',
            _width: 100,
            _fontCharacter: 'E'
        };
        mockFont._charsToGlyphs.and.returnValue([glyph]);
        mockTextState._textMatrix = [1, 0, 0, 1, 0, 0];
        mockContentParserHelper._splitWords.and.returnValue({ previousRect: { x: 0, y: 0, width: 10, height: 12 }, tempString: 'E' });
        // Act
        const result: any = parser._getTextContentItem(mockFont, 'Es', 0, mockTextState, mockPage, '', { x: 0, y: 0, width: 0, height: 0 }, '', mockContentParserHelper);
        // Assert
        expect(result.extractedText).toContain('E');
    });
    it('should handle text bounds with page rotation angle270', () => {
        // Arrange
        mockPage.rotation = PdfRotationAngle.angle270;
        const glyph: any = {
            _unicode: 'F',
            _width: 100,
            _fontCharacter: 'F'
        };
        mockFont._charsToGlyphs.and.returnValue([glyph]);
        mockTextState._textMatrix = [1, 0, 0, 1, 0, 0];
        mockContentParserHelper._splitWords.and.returnValue({ previousRect: { x: 0, y: 0, width: 10, height: 12 }, tempString: 'F' });
        // Act
        const result: any = parser._getTextContentItem(mockFont, 'Fs', 0, mockTextState, mockPage, '', { x: 0, y: 0, width: 0, height: 0 }, '', mockContentParserHelper);
        // Assert
        expect(result.extractedText).toContain('F');
    });
    it('should handle descendant fonts with height calculation', () => {
        // Arrange
        mockFont._dictionary.has.and.returnValue(true);
        const glyph: any = {
            _unicode: 'G',
            _width: 100,
            _fontCharacter: 'G'
        };
        mockFont._charsToGlyphs.and.returnValue([glyph]);
        mockTextState._textMatrix = [1, 0, 0, 50, 0, 0];
        mockContentParserHelper._splitWords.and.returnValue({ previousRect: { x: 0, y: 0, width: 10, height: 12 }, tempString: 'G' });
        // Act
        const result: any = parser._getTextContentItem(mockFont, 'Gs', 0, mockTextState, mockPage, '', { x: 0, y: 0, width: 0, height: 0 }, '', mockContentParserHelper);
        // Assert
        expect(result.extractedText).toContain('G');
    });
    it('should handle char spacing with non-space character', () => {
        // Arrange
        mockTextState._charSpacing = 2;
        const glyph: any = {
            _unicode: 'H',
            _width: 100,
            _fontCharacter: 'H'
        };
        mockFont._charsToGlyphs.and.returnValue([glyph]);
        mockTextState._textMatrix = [1, 0, 0, 1, 0, 0];
        mockContentParserHelper._splitWords.and.returnValue({ previousRect: { x: 0, y: 0, width: 10, height: 12 }, tempString: 'H' });
        // Act
        const result: any = parser._getTextContentItem(mockFont, 'Hs', 0, mockTextState, mockPage, '', { x: 0, y: 0, width: 0, height: 0 }, '', mockContentParserHelper);
        // Assert
        expect(result.extractedText).toContain('H');
    });
    it('should handle textGlyph path with isHex true and sufficient hex length', () => {
        // Arrange
        const glyph: any = {
            _unicode: 'I',
            _width: 100,
            _fontCharacter: 'I'
        };
        mockFont._charsToGlyphs.and.returnValue([glyph]);
        mockTextState._textMatrix = [1, 0, 0, 1, 0, 0];
        const textGlyphs: TextGlyph[] = [];
        const encodedText: string[] = [''];
        const hex: string[] = ['49'];
        // Act
        const result: any = parser._getTextContentItem(mockFont, 'Is', 0, mockTextState, mockPage, '', { x: 0, y: 0, width: 0, height: 0 }, '', undefined, textGlyphs, hex, 0, encodedText);
        // Assert
        expect(result.textGlyphs.length).toBeGreaterThan(0);
        expect(result.textGlyphs[0]._text).toBe('I');
        expect(result.textGlyphs[0]._isHex).toBe(true);
    });
    it('should handle textGlyph path with isHex false and non-space character', () => {
        // Arrange
        const glyph: any = {
            _unicode: 'J',
            _width: 100,
            _fontCharacter: 'J'
        };
        mockFont._charsToGlyphs.and.returnValue([glyph]);
        mockTextState._textMatrix = [1, 0, 0, 1, 0, 0];
        const textGlyphs: TextGlyph[] = [];
        const encodedText: string[] = [''];
        // Act
        const result: any = parser._getTextContentItem(mockFont, 'Js', 0, mockTextState, mockPage, '', { x: 0, y: 0, width: 0, height: 0 }, '', undefined, textGlyphs, undefined, 0, encodedText);
        // Assert
        expect(result.textGlyphs.length).toBeGreaterThan(0);
        expect(result.textGlyphs[0]._isHex).toBe(false);
    });
    it('should handle page rotation !== angle0 for textGlyph rotation flag', () => {
        // Arrange
        mockPage.rotation = PdfRotationAngle.angle90;
        const glyph: any = {
            _unicode: 'K',
            _width: 100,
            _fontCharacter: 'K'
        };
        mockFont._charsToGlyphs.and.returnValue([glyph]);
        mockTextState._textMatrix = [1, 0, 0, 1, 0, 0];
        const textGlyphs: TextGlyph[] = [];
        const encodedText: string[] = [''];
        // Act
        const result: any = parser._getTextContentItem(mockFont, 'Ks', 0, mockTextState, mockPage, '', { x: 0, y: 0, width: 0, height: 0 }, '', undefined, textGlyphs, undefined, 0, encodedText);
        // Assert
        expect(result.textGlyphs[0]._isRotated).toBe(true);
    });
    it('should set _isRotated to false when page rotation is angle0', () => {
        // Arrange
        mockPage.rotation = PdfRotationAngle.angle0;
        const glyph: any = {
            _unicode: 'L',
            _width: 100,
            _fontCharacter: 'L'
        };
        mockFont._charsToGlyphs.and.returnValue([glyph]);
        mockTextState._textMatrix = [1, 0, 0, 1, 0, 0];
        const textGlyphs: TextGlyph[] = [];
        const encodedText: string[] = [''];
        // Act
        const result: any = parser._getTextContentItem(mockFont, 'Ls', 0, mockTextState, mockPage, '', { x: 0, y: 0, width: 0, height: 0 }, '', undefined, textGlyphs, undefined, 0, encodedText);
        // Assert
        expect(result.textGlyphs[0]._isRotated).toBe(false);
    });
    it('should return textGlyph result object with all properties', () => {
        // Arrange
        const glyph: any = {
            _unicode: 'M',
            _width: 100,
            _fontCharacter: 'M'
        };
        mockFont._charsToGlyphs.and.returnValue([glyph]);
        mockTextState._textMatrix = [1, 0, 0, 1, 0, 0];
        const textGlyphs: TextGlyph[] = [];
        const encodedText: string[] = ['M'];
        // Act
        const result: any = parser._getTextContentItem(mockFont, 'Ms', 0, mockTextState, mockPage, '', { x: 0, y: 0, width: 0, height: 0 }, '', undefined, textGlyphs, undefined, 0, encodedText);
        // Assert
        expect(result.textGlyphs).toBeDefined();
        expect(result.extractedText).toBeDefined();
        expect(result.encodedText).toBeDefined();
        expect(result.index).toBeDefined();
    });
    it('should return parser result object with all properties', () => {
        // Arrange
        const glyph: any = {
            _unicode: 'N',
            _width: 100,
            _fontCharacter: 'N'
        };
        mockFont._charsToGlyphs.and.returnValue([glyph]);
        mockTextState._textMatrix = [1, 0, 0, 1, 0, 0];
        mockContentParserHelper._splitWords.and.returnValue({ previousRect: { x: 0, y: 0, width: 10, height: 12 }, tempString: 'N' });
        // Act
        const result: any = parser._getTextContentItem(mockFont, 'Ns', 0, mockTextState, mockPage, '', { x: 0, y: 0, width: 0, height: 0 }, '', mockContentParserHelper);
        // Assert
        expect(result.tempString).toBeDefined();
        expect(result.extractedText).toBeDefined();
        expect(result.fontSize).toBeDefined();
        expect(result.previousRect).toBeDefined();
    });
    it('should handle vertical font space character with correct positioning', () => {
        // Arrange
        mockFont._vertical = true;
        const glyph: any = {
            _unicode: ' ',
            _width: 50,
            _fontCharacter: 'space'
        };
        mockFont._charsToGlyphs.and.returnValue([glyph]);
        mockTextState._textMatrix = [0, 1, -1, 0, 0, 0];
        mockContentParserHelper._splitWords.and.returnValue({ previousRect: { x: 0, y: 0, width: 10, height: 12 }, tempString: '' });
        // Act
        const result: any = parser._getTextContentItem(mockFont, ' s', 0, mockTextState, mockPage, '', { x: 0, y: 0, width: 0, height: 0 }, '', mockContentParserHelper);
        // Assert
        expect(result.extractedText).toContain(' ');
    });
    it('should set font name and size when no slash found in elements (else path for line 164-167)', () => {
        // Arrange
        mockTextState._font = 'DefaultFont';
        const element: string[] = ['NoSlash', '14'];
        // Act
        parser._setFont(element, mockTextState);
        // Assert
        expect(mockTextState._font).toBe('DefaultFont');
        expect(mockTextState._fontSize).toBe(14);
    });
    it('should handle redaction bounds with ypos exact match (line 305-330)', () => {
        // Arrange
        const redactionRegion: any = {
            _bounds: { x: 100, y: 200, width: 50, height: 50 }
        };
        mockPage.size = { width: 612, height: 792 };
        mockPage.rotation = PdfRotationAngle.angle0;
        // Act
        const result: boolean = parser._isFoundText(100, 200, mockPage, [redactionRegion]);
        // Assert
        expect(result).toBe(true);
    });
    it('should handle redaction bounds with ypos minus one (line 305-330)', () => {
        // Arrange
        const redactionRegion: any = {
            _bounds: { x: 100, y: 201, width: 50, height: 50 }
        };
        mockPage.size = { width: 612, height: 792 };
        mockPage.rotation = PdfRotationAngle.angle0;
        // Act
        const result: boolean = parser._isFoundText(100, 200, mockPage, [redactionRegion]);
        // Assert
        expect(result).toBe(true);
    });
    it('should handle redaction bounds with ypos plus one (line 305-330)', () => {
        // Arrange
        const redactionRegion: any = {
            _bounds: { x: 100, y: 199, width: 50, height: 50 }
        };
        mockPage.size = { width: 612, height: 792 };
        mockPage.rotation = PdfRotationAngle.angle0;
        // Act
        const result: boolean = parser._isFoundText(100, 200, mockPage, [redactionRegion]);
        // Assert
        expect(result).toBe(true);
    });
    it('should handle redaction bounds with yPosition >= bounds.y - bounds.height (line 305-330)', () => {
        // Arrange
        const redactionRegion: any = {
            _bounds: { x: 100, y: 250, width: 50, height: 100 }
        };
        mockPage.size = { width: 612, height: 792 };
        mockPage.rotation = PdfRotationAngle.angle0;
        // Act
        const result: boolean = parser._isFoundText(100, 200, mockPage, [redactionRegion]);
        // Assert
        expect(result).toBe(true);
    });
    it('should split text with bracket case and hex input (line 410-418)', () => {
        // Arrange
        mockFont._encoding = 'WinAnsiEncoding';
        const encodedText: string = '[<48656C6C6F>]';
        const inputText: string[] = ['<48656C6C6F>'];
        // Act
        const result: any = parser._getSplitText(encodedText, mockFont, inputText, false);
        // Assert
        expect(result.decodedList).toBeDefined();
        expect(result.decodedList.length).toBeGreaterThan(0);
    });
    it('should split text with bracket case and literal input (line 410-418)', () => {
        // Arrange
        mockFont._encoding = 'WinAnsiEncoding';
        const encodedText: string = '[(hello)]';
        const inputText: string[] = ['(hello)'];
        // Act
        const result: any = parser._getSplitText(encodedText, mockFont, inputText, false);
        // Assert
        expect(result.decodedList).toBeDefined();
    });
    it('should split text with angle bracket case (line 424)', () => {
        // Arrange
        mockFont._encoding = 'WinAnsiEncoding';
        const encodedText: string = '<48656C6C6F>';
        const inputText: string[] = [];
        // Act
        const result: any = parser._getSplitText(encodedText, mockFont, inputText, false);
        // Assert
        expect(result.decodedList).toBeDefined();
        expect(result.decodedList.length).toBeGreaterThan(0);
    });
    it('should detect page rotation 90 degrees (line 441)', () => {
        // Arrange
        mockTextState._textMatrix = [0, 1, -1, 0, 0, 0];
        // Act
        const result: number = parser._getPageRotation(mockTextState);
        // Assert
        expect(result).toBe(90);
    });
    it('should detect page rotation 0 degrees (else path for line 446)', () => {
        // Arrange
        mockTextState._textMatrix = [1, 0, 0, 1, 0, 0];
        // Act
        const result: number = parser._getPageRotation(mockTextState);
        // Assert
        expect(result).toBe(0);
    });
    it('should split hex string with size 4 starting with 0 (line 455)', () => {
        // Arrange
        const hexString: string = '<0123456789AB>';
        // Act
        const result: string[] = parser._splitHexString(hexString);
        // Assert
        expect(result.length).toBeGreaterThan(0);
    });
    it('should split hex string with size 2 not starting with 0 (line 455)', () => {
        // Arrange
        const hexString: string = '<123456789AB>';
        // Act
        const result: string[] = parser._splitHexString(hexString);
        // Assert
        expect(result.length).toBeGreaterThan(0);
    });
    it('should build hex chunks with newline handling (line 464)', () => {
        // Arrange
        const hexString: string = '<12\n34>';
        // Act
        const result: string[] = parser._splitHexString(hexString);
        // Assert
        expect(result).toBeDefined();
    });
    it('should handle Type3 font with glyph height > 0 (line 522-526)', () => {
        // Arrange
        mockFont._isType3Font = true;
        mockTextState._fontSize = 0.5;
        mockFont._fontMatrix = [0.01, 0, 0, 0.01, 0, 0];
        mockFont._boundingBox = [0, 0, 1000, 1000];
        mockTextState._ctm = [1, 0, 0, 1, 0, 0];
        // Act
        const result: number[] = parser._getCurrentTransform(mockFont, mockFont._fontMatrix, mockTextState);
        // Assert
        expect(result).toBeDefined();
        expect(result.length).toBe(6);
    });
    it('should set font matrix to default when undefined (line 623-626)', () => {
        // Arrange
        mockFont._fontMatrix = undefined;
        const glyph: any = {
            _unicode: 'A',
            _width: 600,
            _fontCharacter: 'A'
        };
        mockFont._charsToGlyphs.and.returnValue([glyph]);
        mockTextState._textMatrix = [1, 0, 0, 1, 0, 0];
        const textGlyphs: TextGlyph[] = [];
        const encodedText: string[] = ['A'];
        // Act
        const result: any = parser._getTextContentItem(mockFont, 'As', 0, mockTextState, mockPage, '', { x: 0, y: 0, width: 0, height: 0 }, '', undefined, textGlyphs, undefined, 0, encodedText);
        // Assert
        expect(mockFont._fontMatrix).toEqual([0.001, 0, 0, 0.001, 0, 0]);
    });
    it('should calculate tempFontSize from transform[1] when negative (line 660-662)', () => {
        // Arrange
        const glyph: any = {
            _unicode: 'B',
            _width: 600,
            _fontCharacter: 'B'
        };
        mockFont._charsToGlyphs.and.returnValue([glyph]);
        mockTextState._textMatrix = [0, -0.5, 0.5, 0, 0, 0];
        mockFont._dictionary.has.and.returnValue(false);
        const textGlyphs: TextGlyph[] = [];
        const encodedText: string[] = ['B'];
        // Act
        const result: any = parser._getTextContentItem(mockFont, 'Bs', 0, mockTextState, mockPage, '', { x: 0, y: 0, width: 0, height: 0 }, '', undefined, textGlyphs, undefined, 0, encodedText);
        // Assert
        expect(result.textGlyphs.length).toBe(1);
    });
    it('should handle non-space character in horizontal font (else path for line 655-665)', () => {
        // Arrange
        mockFont._vertical = false;
        const glyph: any = {
            _unicode: 'X',
            _width: 600,
            _fontCharacter: 'X'
        };
        mockFont._charsToGlyphs.and.returnValue([glyph]);
        mockTextState._textMatrix = [1, 0, 0, 1, 0, 0];
        const textGlyphs: TextGlyph[] = [];
        const encodedText: string[] = ['X'];
        // Act
        const result: any = parser._getTextContentItem(mockFont, 'Xs', 0, mockTextState, mockPage, '', { x: 0, y: 0, width: 0, height: 0 }, '', undefined, textGlyphs, undefined, 0, encodedText);
        // Assert
        expect(result.textGlyphs[0]._text).toBe('X');
    });
    it('should handle space character in vertical font (else path for line 467-475)', () => {
        // Arrange
        mockFont._vertical = true;
        const glyph: any = {
            _unicode: ' ',
            _width: 300,
            _fontCharacter: 'space'
        };
        mockFont._charsToGlyphs.and.returnValue([glyph]);
        mockTextState._textMatrix = [0, 1, -1, 0, 0, 0];
        const textGlyphs: TextGlyph[] = [];
        const encodedText: string[] = ['space'];
        // Act
        const result: any = parser._getTextContentItem(mockFont, ' s', 0, mockTextState, mockPage, '', { x: 0, y: 0, width: 0, height: 0 }, '', undefined, textGlyphs, undefined, 0, encodedText);
        // Assert
        expect(result.textGlyphs[0]._text).toBe(' ');
    });
    it('should apply textBounds for angle0 rotation with rotation 90 (line 765-767)', () => {
        // Arrange
        const glyph: any = {
            _unicode: 'C',
            _width: 600,
            _fontCharacter: 'C'
        };
        mockFont._charsToGlyphs.and.returnValue([glyph]);
        mockTextState._textMatrix = [0, 1, -1, 0, 100, 100];
        mockPage.rotation = PdfRotationAngle.angle0;
        const textGlyphs: TextGlyph[] = [];
        const encodedText: string[] = ['C'];
        // Act
        const result: any = parser._getTextContentItem(mockFont, 'Cs', 0, mockTextState, mockPage, '', { x: 0, y: 0, width: 0, height: 0 }, '', undefined, textGlyphs, undefined, 0, encodedText);
        // Assert
        expect(result.textGlyphs[0]._bounds).toBeDefined();
    });
    it('should apply textBounds for angle90 page rotation (line 758-760)', () => {
        // Arrange
        const glyph: any = {
            _unicode: 'D',
            _width: 600,
            _fontCharacter: 'D'
        };
        mockFont._charsToGlyphs.and.returnValue([glyph]);
        mockTextState._textMatrix = [1, 0, 0, 1, 0, 0];
        mockPage.rotation = PdfRotationAngle.angle90;
        mockPage.cropBox = [0, 0, 0, 0];
        const textGlyphs: TextGlyph[] = [];
        const encodedText: string[] = ['D'];
        // Act
        const result: any = parser._getTextContentItem(mockFont, 'Ds', 0, mockTextState, mockPage, '', { x: 0, y: 0, width: 0, height: 0 }, '', undefined, textGlyphs, undefined, 0, encodedText);
        // Assert
        expect(result.textGlyphs[0]._bounds).toBeDefined();
    });
    it('should handle hex data with isHex true (line 743)', () => {
        // Arrange
        const glyph: any = {
            _unicode: 'E',
            _width: 600,
            _fontCharacter: 'E'
        };
        mockFont._charsToGlyphs.and.returnValue([glyph]);
        mockTextState._textMatrix = [1, 0, 0, 1, 0, 0];
        const textGlyphs: TextGlyph[] = [];
        const encodedText: string[] = ['E'];
        const hexChunks: string[] = ['41'];
        // Act
        const result: any = parser._getTextContentItem(mockFont, 'Es', 0, mockTextState, mockPage, '', { x: 0, y: 0, width: 0, height: 0 }, '', undefined, textGlyphs, hexChunks, 0, encodedText);
        // Assert
        expect(result.textGlyphs[0]._isHex).toBe(true);
    });
    it('should apply charSpacing for non-space character (line 759)', () => {
        // Arrange
        mockTextState._charSpacing = 5;
        const glyph: any = {
            _unicode: 'F',
            _width: 600,
            _fontCharacter: 'F'
        };
        mockFont._charsToGlyphs.and.returnValue([glyph]);
        mockTextState._textMatrix = [1, 0, 0, 1, 0, 0];
        const textGlyphs: TextGlyph[] = [];
        const encodedText: string[] = ['F'];
        // Act
        const result: any = parser._getTextContentItem(mockFont, 'Fs', 0, mockTextState, mockPage, '', { x: 0, y: 0, width: 0, height: 0 }, '', undefined, textGlyphs, undefined, 0, encodedText);
        // Assert
        expect(result.textGlyphs.length).toBe(1);
    });
    it('should handle vertical font charSpacing application (line 766)', () => {
        // Arrange
        mockFont._vertical = true;
        mockTextState._charSpacing = 5;
        const glyph: any = {
            _unicode: 'G',
            _width: 600,
            _fontCharacter: 'G'
        };
        mockFont._charsToGlyphs.and.returnValue([glyph]);
        mockTextState._textMatrix = [0, 1, -1, 0, 0, 0];
        const textGlyphs: TextGlyph[] = [];
        const encodedText: string[] = ['G'];
        // Act
        const result: any = parser._getTextContentItem(mockFont, 'Gs', 0, mockTextState, mockPage, '', { x: 0, y: 0, width: 0, height: 0 }, '', undefined, textGlyphs, undefined, 0, encodedText);
        // Assert
        expect(result.textGlyphs.length).toBe(1);
    });
    it('should split text with redaction input type tracking (line 340-343)', () => {
        // Arrange
        mockFont._encoding = 'WinAnsiEncoding';
        const encodedText: string = '[(hello)]';
        const inputText: string[] = ['(hello)'];
        // Act
        const result: any = parser._getSplitText(encodedText, mockFont, inputText, true);
        // Assert
        expect(result.inputType).toBeDefined();
        expect(result.inputType.length).toBeGreaterThan(0);
    });
    it('should handle bracket case with numeric non-width values (line 409-419)', () => {
        // Arrange
        mockFont._encoding = 'WinAnsiEncoding';
        const encodedText: string = '[100 (test) 200]';
        const inputText: string[] = ['100', '(test)', '200'];
        // Act
        const result: any = parser._getSplitText(encodedText, mockFont, inputText, false);
        // Assert
        expect(result.decodedList).toBeDefined();
    });
    it('should handle vertical font with glyphWidth calculation via vmetric (line 635)', () => {
        // Arrange
        mockFont._vertical = true;
        const glyph: any = {
            _unicode: 'H',
            _width: 600,
            _fontCharacter: 'H',
            vmetric: [500, 0]
        };
        mockFont._charsToGlyphs.and.returnValue([glyph]);
        mockTextState._textMatrix = [0, 1, -1, 0, 0, 0];
        const textGlyphs: TextGlyph[] = [];
        const encodedText: string[] = ['H'];
        // Act
        const result: any = parser._getTextContentItem(mockFont, 'Hs', 0, mockTextState, mockPage, '', { x: 0, y: 0, width: 0, height: 0 }, '', undefined, textGlyphs, undefined, 0, encodedText);
        // Assert
        expect(result.textGlyphs[0]._text).toBe('H');
    });
    it('should handle vertical font without vmetric (line 635)', () => {
        // Arrange
        mockFont._vertical = true;
        const glyph: any = {
            _unicode: 'I',
            _width: 600,
            _fontCharacter: 'I',
            vmetric: undefined
        };
        mockFont._charsToGlyphs.and.returnValue([glyph]);
        mockTextState._textMatrix = [0, 1, -1, 0, 0, 0];
        const textGlyphs: TextGlyph[] = [];
        const encodedText: string[] = ['I'];
        // Act
        const result: any = parser._getTextContentItem(mockFont, 'Is', 0, mockTextState, mockPage, '', { x: 0, y: 0, width: 0, height: 0 }, '', undefined, textGlyphs, undefined, 0, encodedText);
        // Assert
        expect(result.textGlyphs[0]._text).toBe('I');
    });
    it('should apply textBounds for angle180 page rotation', () => {
        // Arrange
        const glyph: any = {
            _unicode: 'J',
            _width: 600,
            _fontCharacter: 'J'
        };
        mockFont._charsToGlyphs.and.returnValue([glyph]);
        mockTextState._textMatrix = [1, 0, 0, 1, 0, 0];
        mockPage.rotation = PdfRotationAngle.angle180;
        mockPage.cropBox = [0, 0, 0, 0];
        const textGlyphs: TextGlyph[] = [];
        const encodedText: string[] = ['J'];
        // Act
        const result: any = parser._getTextContentItem(mockFont, 'Js', 0, mockTextState, mockPage, '', { x: 0, y: 0, width: 0, height: 0 }, '', undefined, textGlyphs, undefined, 0, encodedText);
        // Assert
        expect(result.textGlyphs[0]._bounds).toBeDefined();
    });
    it('should apply textBounds for angle270 page rotation', () => {
        // Arrange
        const glyph: any = {
            _unicode: 'K',
            _width: 600,
            _fontCharacter: 'K'
        };
        mockFont._charsToGlyphs.and.returnValue([glyph]);
        mockTextState._textMatrix = [1, 0, 0, 1, 0, 0];
        mockPage.rotation = PdfRotationAngle.angle270;
        mockPage.cropBox = [0, 0, 0, 0];
        const textGlyphs: TextGlyph[] = [];
        const encodedText: string[] = ['K'];
        // Act
        const result: any = parser._getTextContentItem(mockFont, 'Ks', 0, mockTextState, mockPage, '', { x: 0, y: 0, width: 0, height: 0 }, '', undefined, textGlyphs, undefined, 0, encodedText);
        // Assert
        expect(result.textGlyphs[0]._bounds).toBeDefined();
    });
    it('should apply default textBounds for angle0 without rotation 90', () => {
        // Arrange
        const glyph: any = {
            _unicode: 'L',
            _width: 600,
            _fontCharacter: 'L'
        };
        mockFont._charsToGlyphs.and.returnValue([glyph]);
        mockTextState._textMatrix = [1, 0, 0, 1, 100, 100];
        mockPage.rotation = PdfRotationAngle.angle0;
        mockPage.cropBox = [0, 0, 0, 0];
        const textGlyphs: TextGlyph[] = [];
        const encodedText: string[] = ['L'];
        // Act
        const result: any = parser._getTextContentItem(mockFont, 'Ls', 0, mockTextState, mockPage, '', { x: 0, y: 0, width: 0, height: 0 }, '', undefined, textGlyphs, undefined, 0, encodedText);
        // Assert
        expect(result.textGlyphs[0]._bounds.x).toBeDefined();
        expect(result.textGlyphs[0]._bounds.y).toBeDefined();
    });
});
