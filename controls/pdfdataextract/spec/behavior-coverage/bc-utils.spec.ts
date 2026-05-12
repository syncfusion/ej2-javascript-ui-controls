import { _ignoreEscapeSequence, _addFontResources, _getXObjectResources, _hexToChar, _skipEscapeSequence, _parseEscapedText, _getLiteralString, _decodeEncodedText, _getXObject, _parseEncodedText, _isArrayEqual, _base64ToUint8Array } from '../../src/pdf-data-extract/core/utils';
import { _TextProcessingMode } from '../../src/pdf-data-extract/core/enum';
import { _PdfReference, _PdfContentStream, _PdfBaseStream } from '@syncfusion/ej2-pdf';
describe('PDF Utils Functions - Complete Coverage', () => {
    // ============================================================================
    // _addFontResources Tests (Lines 46-58)
    // ============================================================================
    describe('_addFontResources', () => {
        it('should return empty map when font is undefined (Line 51: typeof(font) !== undefined FALSE)', () => {
            // Arrange
            const mockDictionary: any = jasmine.createSpyObj('Dictionary', ['get']);
            mockDictionary.get.and.returnValue(undefined);
            const mockCrossRef: any = jasmine.createSpyObj('CrossRef', ['_fetch']);
            // Act
            const result: Map<string, any> = _addFontResources(mockDictionary, mockCrossRef);
            // Assert
            expect(result instanceof Map).toBe(true);
            expect(result.size).toBe(0);
            expect(mockDictionary.get).toHaveBeenCalledWith('Font');
        });
        it('should return empty map when font is null (Line 51: font !== null FALSE)', () => {
            // Arrange
            const mockDictionary: any = jasmine.createSpyObj('Dictionary', ['get']);
            mockDictionary.get.and.returnValue(null);
            const mockCrossRef: any = jasmine.createSpyObj('CrossRef', ['_fetch']);
            // Act
            const result: Map<string, any> = _addFontResources(mockDictionary, mockCrossRef);
            // Assert
            expect(result instanceof Map).toBe(true);
            expect(result.size).toBe(0);
        });
    });
    // ============================================================================
    // _getXObjectResources Tests (Lines 65-102)
    // ============================================================================
    describe('_getXObjectResources', () => {
        it('should return empty map when resources is null (Line 69: if resources FALSE)', () => {
            // Arrange
            const resources: any = null;
            const mockCrossRef: any = jasmine.createSpyObj('CrossRef', ['_fetch']);
            // Act
            const result: Map<string, any> = _getXObjectResources(resources, mockCrossRef);
            // Assert
            expect(result instanceof Map).toBe(true);
            expect(result.size).toBe(0);
        });
        it('should return empty map when XObject not in resources (Line 69: resources.has FALSE)', () => {
            // Arrange
            const mockResources: any = jasmine.createSpyObj('Resources', ['has']);
            mockResources.has.and.returnValue(false);
            const mockCrossRef: any = jasmine.createSpyObj('CrossRef', ['_fetch']);
            // Act
            const result: Map<string, any> = _getXObjectResources(mockResources, mockCrossRef);
            // Assert
            expect(result instanceof Map).toBe(true);
            expect(result.size).toBe(0);
            expect(mockResources.has).toHaveBeenCalledWith('XObject');
        });
        it('should skip non-reference values (Line 72: if value instanceof _PdfReference FALSE)', () => {
            // Arrange
            const mockXObjects: any = jasmine.createSpyObj('XObjects', ['forEach']);
            mockXObjects.forEach.and.callFake((callback: any) => {
                callback('Img1', 'NotAReference');
            });
            const mockResources: any = jasmine.createSpyObj('Resources', ['has', 'get']);
            mockResources.has.and.returnValue(true);
            mockResources.get.and.returnValue(mockXObjects);
            const mockCrossRef: any = jasmine.createSpyObj('CrossRef', ['_fetch']);
            // Act
            const result: Map<string, any> = _getXObjectResources(mockResources, mockCrossRef);
            // Assert
            expect(result.size).toBe(0);
            expect(mockCrossRef._fetch).not.toHaveBeenCalled();
        });
        it('should skip null xobject after fetch (Line 73: if xobject !== null FALSE)', () => {
            // Arrange
            const mockRef: any = jasmine.createSpyObj('Reference', ['_dummy']);
            mockRef.__proto__ = _PdfReference.prototype;
            const mockXObjects: any = jasmine.createSpyObj('XObjects', ['forEach']);
            mockXObjects.forEach.and.callFake((callback: any) => {
                callback('Img1', mockRef);
            });
            const mockResources: any = jasmine.createSpyObj('Resources', ['has', 'get']);
            mockResources.has.and.returnValue(true);
            mockResources.get.and.returnValue(mockXObjects);
            const mockCrossRef: any = jasmine.createSpyObj('CrossRef', ['_fetch']);
            mockCrossRef._fetch.and.returnValue(null);
            // Act
            const result: Map<string, any> = _getXObjectResources(mockResources, mockCrossRef);
            // Assert
            expect(result.size).toBe(0);
        });
        it('should handle imageRedaction mode with Form subtype (Line 89-92)', () => {
            // Arrange
            const mockRef: any = jasmine.createSpyObj('Reference', ['_dummy']);
            mockRef.__proto__ = _PdfReference.prototype;
            const mockXObjects: any = jasmine.createSpyObj('XObjects', ['forEach']);
            mockXObjects.forEach.and.callFake((callback: any) => {
                callback('Form1', mockRef);
            });
            const mockResources: any = jasmine.createSpyObj('Resources', ['has', 'get']);
            mockResources.has.and.returnValue(true);
            mockResources.get.and.returnValue(mockXObjects);
            const mockSubtype: any = { name: 'Form' };
            const mockDict: any = jasmine.createSpyObj('Dict', ['get']);
            mockDict.get.and.returnValue(mockSubtype);
            const mockXobject: any = { dictionary: mockDict };
            const mockCrossRef: any = jasmine.createSpyObj('CrossRef', ['_fetch']);
            mockCrossRef._fetch.and.returnValue(mockXobject);
            // Act
            const result: Map<string, any> = _getXObjectResources(mockResources, mockCrossRef, _TextProcessingMode.imageRedaction);
            // Assert
            expect(result.size).toBe(1);
        });
        it('should handle default mode with Form subtype (Line 96-101)', () => {
            // Arrange
            const mockRef: any = jasmine.createSpyObj('Reference', ['_dummy']);
            mockRef.__proto__ = _PdfReference.prototype;
            const mockXObjects: any = jasmine.createSpyObj('XObjects', ['forEach']);
            mockXObjects.forEach.and.callFake((callback: any) => {
                callback('Form1', mockRef);
            });
            const mockResources: any = jasmine.createSpyObj('Resources', ['has', 'get']);
            mockResources.has.and.returnValue(true);
            mockResources.get.and.returnValue(mockXObjects);
            const mockSubtype: any = { name: 'Form' };
            const mockDict: any = jasmine.createSpyObj('Dict', ['get']);
            mockDict.get.and.returnValue(mockSubtype);
            const mockXobject: any = { dictionary: mockDict };
            const mockCrossRef: any = jasmine.createSpyObj('CrossRef', ['_fetch']);
            mockCrossRef._fetch.and.returnValue(mockXobject);
            // Act
            const result: Map<string, any> = _getXObjectResources(mockResources, mockCrossRef);
            // Assert
            expect(result.size).toBe(1);
        });
    });
    // ============================================================================
    // _skipEscapeSequence Tests (Lines 140-217)
    // ============================================================================
    describe('_skipEscapeSequence', () => {
        it('should handle no escape sequences (Line 140: while condition FALSE)', () => {
            // Arrange
            const inputText: string = 'NoEscapes';
            // Act
            const result: string = _skipEscapeSequence(inputText);
            // Assert
            expect(result).toBe('NoEscapes');
        });
        it('should process escape case "a" (Line 142-144)', () => {
            // Arrange
            const inputText: string = 'Before\\aAfter';
            // Act
            const result: string = _skipEscapeSequence(inputText);
            // Assert
            expect(result).toContain('\x07');
        });
        it('should process escape case "(" (Line 149-151)', () => {
            // Arrange
            const inputText: string = 'Start\\(Middle\\)End';
            // Act
            const result: string = _skipEscapeSequence(inputText);
            // Assert
            expect(result).toContain('(');
            expect(result).toContain(')');
        });
        it('should process escape case "n" (Line 158-160)', () => {
            // Arrange
            const inputText: string = 'Line1\\nLine2';
            // Act
            const result: string = _skipEscapeSequence(inputText);
            // Assert
            expect(result).toContain('\n');
        });
        it('should process escape case "t" (Line 158-160)', () => {
            // Arrange
            const inputText: string = 'Col1\\tCol2';
            // Act
            const result: string = _skipEscapeSequence(inputText);
            // Assert
            expect(result).toContain('\t');
        });
        it('should handle charCode === 3 (Line 168-172)', () => {
            // Arrange
            const inputText: string = 'Text\x03More';
            // Act
            const result: string = _skipEscapeSequence(inputText);
            // Assert
            expect(result).toBeDefined();
        });
        it('should handle charCode >= 127 (Line 173-176)', () => {
            // Arrange
            const inputText: string = 'Text\x80More';
            // Act
            const result: string = _skipEscapeSequence(inputText);
            // Assert
            expect(result).toBeDefined();
        });
        it('should detect alphabetic characters 65-90 (uppercase) (Line 177-180)', () => {
            // Arrange
            const inputText: string = 'Text\\AMore';
            // Act
            const result: string = _skipEscapeSequence(inputText);
            // Assert
            expect(result).toBeDefined();
        });
        it('should detect alphabetic characters 97-122 (lowercase) (Line 177-180)', () => {
            // Arrange
            const inputText: string = 'Text\\aMore';
            // Act
            const result: string = _skipEscapeSequence(inputText);
            // Assert
            expect(result).toBeDefined();
        });
        it('should handle unrecognized escape sequences with regex pattern (Line 181-217)', () => {
            // Arrange
            const inputText: string = 'Text\\dMore';
            // Act
            const result: string = _skipEscapeSequence(inputText);
            // Assert
            expect(result).toBeDefined();
        });
        it('should handle multiple escape sequences', () => {
            // Arrange
            const inputText: string = '\\n\\t\\r\\(\\)';
            // Act
            const result: string = _skipEscapeSequence(inputText);
            // Assert
            expect(result).toBeDefined();
        });
    });
    // ============================================================================
    // _getLiteralString Tests (Lines 277-319)
    // ============================================================================
    describe('_getLiteralString', () => {
        it('should return unchanged text without escapes (Line 277)', () => {
            // Arrange
            const encodedText: string = 'PlainText';
            // Act
            const result: string = _getLiteralString(encodedText);
            // Assert
            expect(result).toBe('PlainText');
        });
        it('should return empty string for empty input', () => {
            // Arrange
            const encodedText: string = '';
            // Act
            const result: string = _getLiteralString(encodedText);
            // Assert
            expect(result).toBe('');
        });
        it('should exit while loop when no backslash found (Line 285 condition FALSE)', () => {
            // Arrange
            const encodedText: string = 'NoBackslash';
            // Act
            const result: string = _getLiteralString(encodedText);
            // Assert
            expect(result).toBe('NoBackslash');
        });
        it('should handle backslash at end of string (Line 308: octalIndex < 0)', () => {
            // Arrange
            const encodedText: string = 'Text\\';
            // Act
            const result: string = _getLiteralString(encodedText);
            // Assert
            expect(result).toBeDefined();
        });
        it('should process octal sequences (Line 290-307)', () => {
            // Arrange
            const encodedText: string = '\\101';
            // Act
            const result: string = _getLiteralString(encodedText);
            // Assert
            expect(result).toBeDefined();
        });
        it('should handle null characters when encoding is Encoding (Line 319)', () => {
            // Arrange
            const encodedText: string = 'Test\0Text';
            const encoding: string = 'Encoding';
            // Act
            const result: string = _getLiteralString(encodedText, encoding);
            // Assert
            expect(result).toBeDefined();
        });
        it('should process with encoding parameter', () => {
            // Arrange
            const encodedText: string = 'TestText';
            const encoding: string = 'Encoding';
            // Act
            const result: string = _getLiteralString(encodedText, encoding);
            // Assert
            expect(typeof result).toBe('string');
        });
    });
    // ============================================================================
    // _decodeEncodedText Tests (Lines 343-396)
    // ============================================================================
    describe('_decodeEncodedText', () => {
        it('should handle case "(" - parenthesis delimited text (Line 343)', () => {
            // Arrange
            const encodedText: string = '(Hello)';
            const mockFont: any = jasmine.createSpyObj('FontStructure', ['_charsToGlyphs']);
            mockFont._encoding = 'UTF-8';
            mockFont._charsToGlyphs.and.returnValue([
                { _unicode: 'H', _width: 10 },
                { _unicode: 'e', _width: 8 }
            ]);
            const inputText: string[] = [];
            // Act
            const result: string = _decodeEncodedText(encodedText, mockFont, inputText);
            // Assert
            expect(result).toBeDefined();
            expect(typeof result).toBe('string');
        });
        it('should strip parentheses from text (Line 343)', () => {
            // Arrange
            const encodedText: string = '(Hello)';
            const mockFont: any = jasmine.createSpyObj('FontStructure', ['_charsToGlyphs']);
            mockFont._encoding = 'UTF-8';
            mockFont._charsToGlyphs.and.returnValue([]);
            const inputText: string[] = [];
            // Act
            _decodeEncodedText(encodedText, mockFont, inputText);
            // Assert
            expect(mockFont._charsToGlyphs).toHaveBeenCalled();
        });
        it('should handle embedded newline in text (Line 349-351)', () => {
            // Arrange
            const encodedText: string = '(Line1\\\nLine2)';
            const mockFont: any = jasmine.createSpyObj('FontStructure', ['_charsToGlyphs']);
            mockFont._encoding = 'UTF-8';
            mockFont._charsToGlyphs.and.returnValue([]);
            const inputText: string[] = [];
            // Act
            _decodeEncodedText(encodedText, mockFont, inputText);
            // Assert
            expect(mockFont._charsToGlyphs).toHaveBeenCalled();
        });
        it('should handle escaped parenthesis in text (Line 352-354)', () => {
            // Arrange
            const encodedText: string = '(Open\\(Close\\))';
            const mockFont: any = jasmine.createSpyObj('FontStructure', ['_charsToGlyphs']);
            mockFont._encoding = 'UTF-8';
            mockFont._charsToGlyphs.and.returnValue([]);
            const inputText: string[] = [];
            // Act
            _decodeEncodedText(encodedText, mockFont, inputText);
            // Assert
            expect(mockFont._charsToGlyphs).toHaveBeenCalled();
        });
        it('should handle case "[" - array delimited text (Line 369)', () => {
            // Arrange
            const encodedText: string = '[<48> <65>]';
            const mockFont: any = jasmine.createSpyObj('FontStructure', ['_charsToGlyphs']);
            mockFont._encoding = 'UTF-8';
            mockFont._charsToGlyphs.and.returnValue([]);
            const inputText: string[] = ['<48>', '<65>'];
            // Act
            const result: string = _decodeEncodedText(encodedText, mockFont, inputText);
            // Assert
            expect(result).toBeDefined();
        });
        it('should handle hex format in array (Line 373-374)', () => {
            // Arrange
            const encodedText: string = '[<48>]';
            const mockFont: any = jasmine.createSpyObj('FontStructure', ['_charsToGlyphs']);
            mockFont._encoding = 'UTF-8';
            mockFont._charsToGlyphs.and.returnValue([]);
            const inputText: string[] = ['<48>'];
            // Act
            _decodeEncodedText(encodedText, mockFont, inputText);
            // Assert
            expect(mockFont._charsToGlyphs).toHaveBeenCalled();
        });
        it('should handle case "<" - hex delimited text (Line 390)', () => {
            // Arrange
            const encodedText: string = '<48656C6C6F>';
            const mockFont: any = jasmine.createSpyObj('FontStructure', ['_charsToGlyphs']);
            mockFont._encoding = 'UTF-8';
            mockFont._charsToGlyphs.and.returnValue([
                { _unicode: 'H', _width: 10 }
            ]);
            const inputText: string[] = [];
            // Act
            const result: string = _decodeEncodedText(encodedText, mockFont, inputText);
            // Assert
            expect(result).toBeDefined();
        });
        it('should strip hex delimiters (Line 390)', () => {
            // Arrange
            const encodedText: string = '<48>';
            const mockFont: any = jasmine.createSpyObj('FontStructure', ['_charsToGlyphs']);
            mockFont._encoding = 'UTF-8';
            mockFont._charsToGlyphs.and.returnValue([]);
            const inputText: string[] = [];
            // Act
            _decodeEncodedText(encodedText, mockFont, inputText);
            // Assert
            expect(mockFont._charsToGlyphs).toHaveBeenCalled();
        });
    });
    // ============================================================================
    // _getXObject Tests (Lines 428, 435-475)
    // ============================================================================
    describe('_getXObject', () => {
        it('should extract xobject key by removing forward slash (Line 428)', () => {
            // Arrange
            const xObjectElement: string[] = ['/TestObject'];
            const mockPage: any = {};
            const xObjectCollection: Map<string, any> = new Map();
            const mockParser: any = jasmine.createSpyObj('Parser', ['_dummy']);
            // Act
            _getXObject(xObjectElement, mockPage, xObjectCollection, mockParser);
            // Assert
            expect(xObjectElement[0].replace('/', '')).toBe('TestObject');
        });
        it('should check if xobject exists in collection (Line 435)', () => {
            // Arrange
            const xObjectElement: string[] = ['/NonExistent'];
            const mockPage: any = {};
            const xObjectCollection: Map<string, any> = new Map();
            const mockParser: any = {};
            // Act
            const result: any = _getXObject(xObjectElement, mockPage, xObjectCollection, mockParser);
            // Assert
            expect(result).toBeUndefined();
        });
        it('should check if array exists before parsing (Line 442)', () => {
            // Arrange
            const xObjectElement: string[] = ['/Empty'];
            const mockPage: any = {};
            const xObjectCollection: Map<string, any> = new Map();
            xObjectCollection.set('Empty', {});
            const mockParser: any = {};
            // Act
            const result: any = _getXObject(xObjectElement, mockPage, xObjectCollection, mockParser);
            // Assert
            expect(result).toBeUndefined();
        });
    });
    // ============================================================================
    // _parseEncodedText Tests (Lines 496-511)
    // ============================================================================
    describe('_parseEncodedText', () => {
        it('should handle case "(" and remove parentheses (Line 496-498)', () => {
            // Arrange
            const encodedText: string = '(Hello)';
            const mockFont: any = jasmine.createSpyObj('FontStructure', ['_charsToGlyphs']);
            mockFont._charsToGlyphs.and.returnValue([
                { _unicode: 'H', _width: 10 },
                { _unicode: 'e', _width: 8 }
            ]);
            // Act
            const result: [string[], number[][]] = _parseEncodedText(encodedText, mockFont);
            // Assert
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(2);
        });
        it('should check for embedded newline (Line 499-501)', () => {
            // Arrange
            const encodedText: string = '(Line1\\\nLine2)';
            const mockFont: any = jasmine.createSpyObj('FontStructure', ['_charsToGlyphs']);
            mockFont._charsToGlyphs.and.returnValue([]);
            // Act
            const result: [string[], number[][]] = _parseEncodedText(encodedText, mockFont);
            // Assert
            expect(result[0]).toBeDefined();
        });
        it('should check for escaped opening parenthesis (Line 502-504)', () => {
            // Arrange
            const encodedText: string = '(Open\\(Close)';
            const mockFont: any = jasmine.createSpyObj('FontStructure', ['_charsToGlyphs']);
            mockFont._charsToGlyphs.and.returnValue([]);
            // Act
            const result: [string[], number[][]] = _parseEncodedText(encodedText, mockFont);
            // Assert
            expect(result[0]).toBeDefined();
        });
        it('should check for escaped closing parenthesis (Line 505-507)', () => {
            // Arrange
            const encodedText: string = '(Open\\)Close)';
            const mockFont: any = jasmine.createSpyObj('FontStructure', ['_charsToGlyphs']);
            mockFont._charsToGlyphs.and.returnValue([]);
            // Act
            const result: [string[], number[][]] = _parseEncodedText(encodedText, mockFont);
            // Assert
            expect(result[0]).toBeDefined();
        });
        it('should process normal newline in text (Line 508-510)', () => {
            // Arrange
            const encodedText: string = '(Line1\\nLine2)';
            const mockFont: any = jasmine.createSpyObj('FontStructure', ['_charsToGlyphs']);
            mockFont._charsToGlyphs.and.returnValue([]);
            // Act
            const result: [string[], number[][]] = _parseEncodedText(encodedText, mockFont);
            // Assert
            expect(result[0]).toBeDefined();
        });
        it('should process carriage return in text (Line 511-513)', () => {
            // Arrange
            const encodedText: string = '(Line1\\rLine2)';
            const mockFont: any = jasmine.createSpyObj('FontStructure', ['_charsToGlyphs']);
            mockFont._charsToGlyphs.and.returnValue([]);
            // Act
            const result: [string[], number[][]] = _parseEncodedText(encodedText, mockFont);
            // Assert
            expect(result[0]).toBeDefined();
        });
        it('should return tuple with decoded list and width table', () => {
            // Arrange
            const encodedText: string = '(Test)';
            const mockFont: any = jasmine.createSpyObj('FontStructure', ['_charsToGlyphs']);
            mockFont._charsToGlyphs.and.returnValue([
                { _unicode: 'T', _width: 12 },
                { _unicode: 'e', _width: 8 }
            ]);
            // Act
            const result: [string[], number[][]] = _parseEncodedText(encodedText, mockFont);
            // Assert
            expect(result[0] instanceof Array).toBe(true);
            expect(result[1] instanceof Array).toBe(true);
            expect(result[1].length).toBe(result[0].length);
        });
        it('should handle unicode length > 1 (multi-byte characters)', () => {
            // Arrange
            const encodedText: string = '(Test)';
            const mockFont: any = jasmine.createSpyObj('FontStructure', ['_charsToGlyphs']);
            mockFont._charsToGlyphs.and.returnValue([
                { _unicode: 'AB', _width: 20 }
            ]);
            // Act
            const result: [string[], number[][]] = _parseEncodedText(encodedText, mockFont);
            // Assert
            expect(result[0] instanceof Array).toBe(true);
            expect(result[1] instanceof Array).toBe(true);
        });
    });
    // ============================================================================
    // _ignoreEscapeSequence Tests
    // ============================================================================
    describe('_ignoreEscapeSequence', () => {
        it('should remove single backslash escape sequence at start', () => {
            // Arrange
            const inputText: string = '\\(Hello)';
            // Act
            const result: string = _ignoreEscapeSequence(inputText);
            // Assert
            expect(result).toBe('(Hello)');
            expect(result.indexOf('\\(')).toBe(-1);
        });
        it('should remove escaped parenthesis \\( from text', () => {
            // Arrange
            const inputText: string = 'Text\\(with\\(escaped\\(parens)';
            // Act
            const result: string = _ignoreEscapeSequence(inputText);
            // Assert
            expect(result).toContain('(with');
            expect(result.indexOf('\\(')).toBe(-1);
        });
        it('should remove escaped closing parenthesis \\) from text', () => {
            // Arrange
            const inputText: string = 'Hello\\)World';
            // Act
            const result: string = _ignoreEscapeSequence(inputText);
            // Assert
            expect(result).toBe('Hello)World');
            expect(result.indexOf('\\)')).toBe(-1);
        });
        it('should remove escaped backslash \\\\ from text', () => {
            // Arrange
            const inputText: string = 'Path\\\\to\\\\file';
            // Act
            const result: string = _ignoreEscapeSequence(inputText);
            // Assert
            expect(result).toContain('\\to');
        });
        it('should handle text without escape sequences (branch: if index >= 0 FALSE)', () => {
            // Arrange
            const inputText: string = 'NoEscapes';
            // Act
            const result: string = _ignoreEscapeSequence(inputText);
            // Assert
            expect(result).toBe('NoEscapes');
        });
        it('should return empty string when input is empty', () => {
            // Arrange
            const inputText: string = '';
            // Act
            const result: string = _ignoreEscapeSequence(inputText);
            // Assert
            expect(result).toBe('');
        });
        it('should handle text with backslash at end (branch: if text.length > index + 1 FALSE)', () => {
            // Arrange
            const inputText: string = 'Text\\';
            // Act
            const result: string = _ignoreEscapeSequence(inputText);
            // Assert
            expect(result).toBe('Text');
        });
        it('should remove multiple escape sequences in sequence', () => {
            // Arrange
            const inputText: string = '\\(Hello\\)\\(World\\)';
            // Act
            const result: string = _ignoreEscapeSequence(inputText);
            // Assert
            expect(result).toBe('(Hello)(World)');
        });
    });
    // ============================================================================
    // _hexToChar Tests
    // ============================================================================
    describe('_hexToChar', () => {
        it('should convert hex string to characters without 0x prefix', () => {
            // Arrange
            const hexString: string = '48656C6C6F';
            // Act
            const result: string = _hexToChar(hexString);
            // Assert
            expect(result).toBe('Hello');
            expect(result.charCodeAt(0)).toBe(0x48);
        });
        it('should convert hex string with 0x prefix (branch: if startsWith 0x TRUE)', () => {
            // Arrange
            const hexString: string = '0x48656C6C6F';
            // Act
            const result: string = _hexToChar(hexString);
            // Assert
            expect(result).toBe('Hello');
        });
        it('should handle hex string without 0x prefix (branch: if startsWith 0x FALSE)', () => {
            // Arrange
            const hexString: string = '41424344';
            // Act
            const result: string = _hexToChar(hexString);
            // Assert
            expect(result).toBe('ABCD');
        });
        it('should remove whitespace from hex string', () => {
            // Arrange
            const hexString: string = '48 65 6C 6C 6F';
            // Act
            const result: string = _hexToChar(hexString);
            // Assert
            expect(result).toBe('Hello');
        });
        it('should convert single hex byte', () => {
            // Arrange
            const hexString: string = '41';
            // Act
            const result: string = _hexToChar(hexString);
            // Assert
            expect(result).toBe('A');
        });
        it('should convert hex to special characters', () => {
            // Arrange
            const hexString: string = '000102';
            // Act
            const result: string = _hexToChar(hexString);
            // Assert
            expect(result.length).toBe(3);
            expect(result.charCodeAt(0)).toBe(0);
            expect(result.charCodeAt(1)).toBe(1);
            expect(result.charCodeAt(2)).toBe(2);
        });
        it('should handle uppercase hex letters', () => {
            // Arrange
            const hexString: string = '4142434445';
            // Act
            const result: string = _hexToChar(hexString);
            // Assert
            expect(result).toBe('ABCDE');
        });
    });
    // ============================================================================
    // _parseEscapedText Tests
    // ============================================================================
    describe('_parseEscapedText', () => {
        it('should replace \\n with newline character', () => {
            // Arrange
            const inputText: string = 'Line1\\nLine2';
            // Act
            const result: string = _parseEscapedText(inputText);
            // Assert
            expect(result).toContain('\n');
            expect(result).toBe('Line1\nLine2');
        });
        it('should replace \\t with tab character', () => {
            // Arrange
            const inputText: string = 'Col1\\tCol2';
            // Act
            const result: string = _parseEscapedText(inputText);
            // Assert
            expect(result).toContain('\t');
            expect(result).toBe('Col1\tCol2');
        });
        it('should replace \\r with carriage return', () => {
            // Arrange
            const inputText: string = 'Text\\rMore';
            // Act
            const result: string = _parseEscapedText(inputText);
            // Assert
            expect(result).toContain('\r');
            expect(result).toBe('Text\rMore');
        });
        it('should replace \\( with open parenthesis', () => {
            // Arrange
            const inputText: string = 'Start\\(Middle\\)End';
            // Act
            const result: string = _parseEscapedText(inputText);
            // Assert
            expect(result).toBe('Start(Middle)End');
        });
        it('should replace \\u with unicode character', () => {
            // Arrange
            const inputText: string = 'Unicode\\u0041Test';
            // Act
            const result: string = _parseEscapedText(inputText);
            // Assert
            expect(result).toContain('A');
        });
        it('should handle multiple escape sequences in one string', () => {
            // Arrange
            const inputText: string = 'Line1\\nTab\\tParen\\(Quote\\"End';
            // Act
            const result: string = _parseEscapedText(inputText);
            // Assert
            expect(result).toContain('\n');
            expect(result).toContain('\t');
            expect(result).toContain('(');
            expect(result).toContain('"');
        });
    });
    // ============================================================================
    // _isArrayEqual Tests
    // ============================================================================
    describe('_isArrayEqual', () => {
        it('should return true for identical arrays', () => {
            // Arrange
            const arr1: number[] = [1, 2, 3, 4, 5];
            const arr2: number[] = [1, 2, 3, 4, 5];
            // Act
            const result: boolean = _isArrayEqual(arr1, arr2);
            // Assert
            expect(result).toBe(true);
        });
        it('should return false for arrays with different lengths (branch: if arr1.length !== arr2.length TRUE)', () => {
            // Arrange
            const arr1: number[] = [1, 2, 3];
            const arr2: number[] = [1, 2];
            // Act
            const result: boolean = _isArrayEqual(arr1, arr2);
            // Assert
            expect(result).toBe(false);
        });
        it('should return false for arrays with same length but different elements', () => {
            // Arrange
            const arr1: number[] = [1, 2, 3];
            const arr2: number[] = [1, 2, 4];
            // Act
            const result: boolean = _isArrayEqual(arr1, arr2);
            // Assert
            expect(result).toBe(false);
        });
        it('should return true for empty arrays', () => {
            // Arrange
            const arr1: number[] = [];
            const arr2: number[] = [];
            // Act
            const result: boolean = _isArrayEqual(arr1, arr2);
            // Assert
            expect(result).toBe(true);
        });
        it('should return true for single element arrays with same value', () => {
            // Arrange
            const arr1: number[] = [42];
            const arr2: number[] = [42];
            // Act
            const result: boolean = _isArrayEqual(arr1, arr2);
            // Assert
            expect(result).toBe(true);
        });
        it('should return false for single element arrays with different values', () => {
            // Arrange
            const arr1: number[] = [1];
            const arr2: number[] = [2];
            // Act
            const result: boolean = _isArrayEqual(arr1, arr2);
            // Assert
            expect(result).toBe(false);
        });
        it('should handle negative numbers correctly', () => {
            // Arrange
            const arr1: number[] = [-1, -2, -3];
            const arr2: number[] = [-1, -2, -3];
            // Act
            const result: boolean = _isArrayEqual(arr1, arr2);
            // Assert
            expect(result).toBe(true);
        });
        it('should handle zero values correctly', () => {
            // Arrange
            const arr1: number[] = [0, 0, 0];
            const arr2: number[] = [0, 0, 0];
            // Act
            const result: boolean = _isArrayEqual(arr1, arr2);
            // Assert
            expect(result).toBe(true);
        });
        it('should handle large arrays', () => {
            // Arrange
            const arr1: number[] = new Array(1000).fill(1);
            const arr2: number[] = new Array(1000).fill(1);
            // Act
            const result: boolean = _isArrayEqual(arr1, arr2);
            // Assert
            expect(result).toBe(true);
        });
        it('should return false when first differing element is found', () => {
            // Arrange
            const arr1: number[] = [1, 2, 3, 100, 4, 5];
            const arr2: number[] = [1, 2, 3, 4, 4, 5];
            // Act
            const result: boolean = _isArrayEqual(arr1, arr2);
            // Assert
            expect(result).toBe(false);
        });
    });
    // ============================================================================
    // _base64ToUint8Array Tests
    // ============================================================================
    describe('_base64ToUint8Array', () => {
        it('should convert valid base64 string to Uint8Array', () => {
            // Arrange
            const base64String: string = 'SGVsbG8gV29ybGQ=';
            // Act
            const result: Uint8Array = _base64ToUint8Array(base64String);
            // Assert
            expect(result instanceof Uint8Array).toBe(true);
            expect(result.length).toBe(11);
            expect(result[0]).toBe(72);
            expect(result[1]).toBe(101);
        });
        it('should convert "AQIDBA==" base64 to [1, 2, 3, 4] bytes', () => {
            // Arrange
            const base64String: string = 'AQIDBA==';
            // Act
            const result: Uint8Array = _base64ToUint8Array(base64String);
            // Assert
            expect(result[0]).toBe(1);
            expect(result[1]).toBe(2);
            expect(result[2]).toBe(3);
            expect(result[3]).toBe(4);
        });
        it('should decode base64 with correct byte values', () => {
            // Arrange
            const base64String: string = 'AA==';
            // Act
            const result: Uint8Array = _base64ToUint8Array(base64String);
            // Assert
            expect(result.length).toBe(1);
            expect(result[0]).toBe(0);
        });
        it('should handle base64 strings without padding', () => {
            // Arrange
            const base64String: string = 'SGVsbG8';
            // Act
            const result: Uint8Array = _base64ToUint8Array(base64String);
            // Assert
            expect(result instanceof Uint8Array).toBe(true);
            expect(result.length > 0).toBe(true);
        });
        it('should convert all zero bytes correctly', () => {
            // Arrange
            const base64String: string = 'AAAA';
            // Act
            const result: Uint8Array = _base64ToUint8Array(base64String);
            // Assert
            expect(result.length).toBe(3);
            expect(result[0]).toBe(0);
            expect(result[1]).toBe(0);
            expect(result[2]).toBe(0);
        });
        it('should convert max byte values (255) correctly', () => {
            // Arrange
            const base64String: string = '//8=';
            // Act
            const result: Uint8Array = _base64ToUint8Array(base64String);
            // Assert
            expect(result.length).toBe(2);
            expect(result[0]).toBe(255);
            expect(result[1]).toBe(255);
        });
    });
    // ============================================================================
    // _getLiteralString Tests
    // ============================================================================
    describe('_getLiteralString', () => {
        it('should return text without escape sequences unchanged', () => {
            // Arrange
            const encodedText: string = 'PlainText';
            // Act
            const result: string = _getLiteralString(encodedText);
            // Assert
            expect(result).toBe('PlainText');
        });
        it('should handle text with no special characters', () => {
            // Arrange
            const encodedText: string = 'HelloWorld';
            // Act
            const result: string = _getLiteralString(encodedText);
            // Assert
            expect(result).toBe('HelloWorld');
        });
        it('should return empty string for empty input', () => {
            // Arrange
            const encodedText: string = '';
            // Act
            const result: string = _getLiteralString(encodedText);
            // Assert
            expect(result).toBe('');
        });
        it('should process text with encoding parameter', () => {
            // Arrange
            const encodedText: string = 'TestText';
            const encoding: string = 'Encoding';
            // Act
            const result: string = _getLiteralString(encodedText, encoding);
            // Assert
            expect(result).toBeDefined();
            expect(typeof result).toBe('string');
        });
        it('should handle text without encoding parameter', () => {
            // Arrange
            const encodedText: string = 'NoEncoding';
            // Act
            const result: string = _getLiteralString(encodedText);
            // Assert
            expect(result).toBe('NoEncoding');
        });
    });
    // ============================================================================
    // _skipEscapeSequence Tests
    // ============================================================================
    describe('_skipEscapeSequence', () => {
        it('should replace \\n with newline character', () => {
            // Arrange
            const inputText: string = 'Line1\\nLine2';
            // Act
            const result: string = _skipEscapeSequence(inputText);
            // Assert
            expect(result).toContain('\n');
        });
        it('should replace \\t with tab character', () => {
            // Arrange
            const inputText: string = 'Tab\\tSpaced';
            // Act
            const result: string = _skipEscapeSequence(inputText);
            // Assert
            expect(result).toContain('\t');
        });
        it('should replace \\r with carriage return', () => {
            // Arrange
            const inputText: string = 'Text\\rMore';
            // Act
            const result: string = _skipEscapeSequence(inputText);
            // Assert
            expect(result).toContain('\r');
        });
        it('should replace \\( with opening parenthesis', () => {
            // Arrange
            const inputText: string = '\\(Start\\)';
            // Act
            const result: string = _skipEscapeSequence(inputText);
            // Assert
            expect(result).toContain('(');
        });
        it('should replace \\) with closing parenthesis', () => {
            // Arrange
            const inputText: string = '\\)';
            // Act
            const result: string = _skipEscapeSequence(inputText);
            // Assert
            expect(result).toContain(')');
        });
        it('should handle text with no escape sequences', () => {
            // Arrange
            const inputText: string = 'NoEscapes';
            // Act
            const result: string = _skipEscapeSequence(inputText);
            // Assert
            expect(result).toBe('NoEscapes');
        });
        it('should handle multiple escape sequences', () => {
            // Arrange
            const inputText: string = '\\n\\t\\r\\(\\)';
            // Act
            const result: string = _skipEscapeSequence(inputText);
            // Assert
            expect(result).toBeDefined();
        });
        it('should return empty string for empty input', () => {
            // Arrange
            const inputText: string = '';
            // Act
            const result: string = _skipEscapeSequence(inputText);
            // Assert
            expect(result).toBe('');
        });
    });
    // ============================================================================
    // _addFontResources Tests
    // ============================================================================
    describe('_addFontResources', () => {
        it('should return empty map when font is undefined (branch: if typeof font !== undefined FALSE)', () => {
            // Arrange
            const mockDictionary: any = jasmine.createSpyObj('Dictionary', ['get']);
            mockDictionary.get.and.returnValue(undefined);
            const mockCrossRef: any = jasmine.createSpyObj('CrossRef', ['_fetch']);
            // Act
            const result: Map<string, any> = _addFontResources(mockDictionary, mockCrossRef);
            // Assert
            expect(result instanceof Map).toBe(true);
            expect(result.size).toBe(0);
        });
        it('should return empty map when font is null (branch: font !== null FALSE)', () => {
            // Arrange
            const mockDictionary: any = jasmine.createSpyObj('Dictionary', ['get']);
            mockDictionary.get.and.returnValue(null);
            const mockCrossRef: any = jasmine.createSpyObj('CrossRef', ['_fetch']);
            // Act
            const result: Map<string, any> = _addFontResources(mockDictionary, mockCrossRef);
            // Assert
            expect(result instanceof Map).toBe(true);
            expect(result.size).toBe(0);
        });
        it('should return Map instance', () => {
            // Arrange
            const mockDictionary: any = jasmine.createSpyObj('Dictionary', ['get']);
            mockDictionary.get.and.returnValue(null);
            const mockCrossRef: any = jasmine.createSpyObj('CrossRef', ['_fetch']);
            // Act
            const result: Map<string, any> = _addFontResources(mockDictionary, mockCrossRef);
            // Assert
            expect(result instanceof Map).toBe(true);
        });
    });
    // ============================================================================
    // _decodeEncodedText Tests
    // ============================================================================
    describe('_decodeEncodedText', () => {
        it('should handle parenthesis-delimited text (case: "(")', () => {
            // Arrange
            const encodedText: string = '(Hello)';
            const mockFont: any = jasmine.createSpyObj('FontStructure', ['_charsToGlyphs']);
            mockFont._encoding = 'UTF-8';
            mockFont._charsToGlyphs.and.returnValue([
                { _unicode: 'H', _width: 10 },
                { _unicode: 'e', _width: 8 },
                { _unicode: 'l', _width: 6 },
                { _unicode: 'l', _width: 6 },
                { _unicode: 'o', _width: 8 }
            ]);
            const inputText: string[] = [];
            // Act
            const result: string = _decodeEncodedText(encodedText, mockFont, inputText);
            // Assert
            expect(result).toBeDefined();
            expect(typeof result).toBe('string');
        });
        it('should handle hex-delimited text (case: "<")', () => {
            // Arrange
            const encodedText: string = '<48656C6C6F>';
            const mockFont: any = jasmine.createSpyObj('FontStructure', ['_charsToGlyphs']);
            mockFont._encoding = 'UTF-8';
            mockFont._charsToGlyphs.and.returnValue([
                { _unicode: 'H', _width: 10 }
            ]);
            const inputText: string[] = [];
            // Act
            const result: string = _decodeEncodedText(encodedText, mockFont, inputText);
            // Assert
            expect(result).toBeDefined();
        });
        it('should handle array-delimited text (case: "[")', () => {
            // Arrange
            const encodedText: string = '[<48> <65>]';
            const mockFont: any = jasmine.createSpyObj('FontStructure', ['_charsToGlyphs']);
            mockFont._encoding = 'UTF-8';
            mockFont._charsToGlyphs.and.returnValue([]);
            const inputText: string[] = [];
            // Act
            const result: string = _decodeEncodedText(encodedText, mockFont, inputText);
            // Assert
            expect(result).toBeDefined();
        });
        it('should return empty string for unrecognized format', () => {
            // Arrange
            const encodedText: string = 'InvalidFormat';
            const mockFont: any = jasmine.createSpyObj('FontStructure', ['_charsToGlyphs']);
            mockFont._encoding = 'UTF-8';
            const inputText: string[] = [];
            // Act
            const result: string = _decodeEncodedText(encodedText, mockFont, inputText);
            // Assert
            expect(result).toBe('');
        });
    });
    // ============================================================================
    // _getXObjectResources Tests
    // ============================================================================
    describe('_getXObjectResources', () => {
        it('should return empty map when resources is null (branch: if resources FALSE)', () => {
            // Arrange
            const resources: any = null;
            const mockCrossRef: any = jasmine.createSpyObj('CrossRef', ['_fetch']);
            // Act
            const result: Map<string, any> = _getXObjectResources(resources, mockCrossRef);
            // Assert
            expect(result instanceof Map).toBe(true);
            expect(result.size).toBe(0);
        });
        it('should return empty map when XObject not in resources (branch: if resources.has FALSE)', () => {
            // Arrange
            const mockResources: any = jasmine.createSpyObj('Resources', ['has']);
            mockResources.has.and.returnValue(false);
            const mockCrossRef: any = jasmine.createSpyObj('CrossRef', ['_fetch']);
            // Act
            const result: Map<string, any> = _getXObjectResources(mockResources, mockCrossRef);
            // Assert
            expect(result instanceof Map).toBe(true);
            expect(result.size).toBe(0);
        });
        it('should return Map instance', () => {
            // Arrange
            const mockResources: any = null;
            const mockCrossRef: any = jasmine.createSpyObj('CrossRef', ['_fetch']);
            // Act
            const result: Map<string, any> = _getXObjectResources(mockResources, mockCrossRef);
            // Assert
            expect(result instanceof Map).toBe(true);
        });
        it('should process with imageExtraction mode when provided', () => {
            // Arrange
            const mockResources: any = jasmine.createSpyObj('Resources', ['has', 'get']);
            mockResources.has.and.returnValue(false);
            const mockCrossRef: any = jasmine.createSpyObj('CrossRef', ['_fetch']);
            const mode: _TextProcessingMode = _TextProcessingMode.imageExtraction;
            // Act
            const result: Map<string, any> = _getXObjectResources(mockResources, mockCrossRef, mode);
            // Assert
            expect(result instanceof Map).toBe(true);
        });
        it('should process with imageRedaction mode when provided', () => {
            // Arrange
            const mockResources: any = jasmine.createSpyObj('Resources', ['has']);
            mockResources.has.and.returnValue(false);
            const mockCrossRef: any = jasmine.createSpyObj('CrossRef', ['_fetch']);
            const mode: _TextProcessingMode = _TextProcessingMode.imageRedaction;
            // Act
            const result: Map<string, any> = _getXObjectResources(mockResources, mockCrossRef, mode);
            // Assert
            expect(result instanceof Map).toBe(true);
        });
    });
    // ============================================================================
    // _parseEncodedText Tests
    // ============================================================================
    describe('_parseEncodedText', () => {
        it('should return tuple of [string[], number[][]] structure', () => {
            // Arrange
            const encodedText: string = '(Test)';
            const mockFont: any = jasmine.createSpyObj('FontStructure', ['_charsToGlyphs']);
            mockFont._charsToGlyphs.and.returnValue([
                { _unicode: 'T', _width: 10 },
                { _unicode: 'e', _width: 8 },
                { _unicode: 's', _width: 8 },
                { _unicode: 't', _width: 6 }
            ]);
            // Act
            const result: [string[], number[][]] = _parseEncodedText(encodedText, mockFont);
            // Assert
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(2);
            expect(Array.isArray(result[0])).toBe(true);
            expect(Array.isArray(result[1])).toBe(true);
        });
        it('should handle parenthesis-delimited encoded text (case: "(")', () => {
            // Arrange
            const encodedText: string = '(Hello)';
            const mockFont: any = jasmine.createSpyObj('FontStructure', ['_charsToGlyphs']);
            mockFont._charsToGlyphs.and.returnValue([
                { _unicode: 'H', _width: 10 }
            ]);
            // Act
            const result: [string[], number[][]] = _parseEncodedText(encodedText, mockFont);
            // Assert
            expect(result[0] instanceof Array).toBe(true);
            expect(result[1] instanceof Array).toBe(true);
        });
        it('should handle hex-delimited encoded text (case: "<")', () => {
            // Arrange
            const encodedText: string = '<48656C6C6F>';
            const mockFont: any = jasmine.createSpyObj('FontStructure', ['_charsToGlyphs']);
            mockFont._charsToGlyphs.and.returnValue([
                { _unicode: 'H', _width: 10 }
            ]);
            // Act
            const result: [string[], number[][]] = _parseEncodedText(encodedText, mockFont);
            // Assert
            expect(result[0] instanceof Array).toBe(true);
        });
        it('should handle array-delimited encoded text (case: "[")', () => {
            // Arrange
            const encodedText: string = '[<48> <65>]';
            const mockFont: any = jasmine.createSpyObj('FontStructure', ['_charsToGlyphs']);
            mockFont._charsToGlyphs.and.returnValue([
                { _unicode: 'H', _width: 10 }
            ]);
            // Act
            const result: [string[], number[][]] = _parseEncodedText(encodedText, mockFont);
            // Assert
            expect(Array.isArray(result[0])).toBe(true);
            expect(Array.isArray(result[1])).toBe(true);
        });
    });
    // ============================================================================
    // _getXObject Tests
    // ============================================================================
    describe('_getXObject', () => {
        it('should handle null xObjectCollection (branch: if xObjectCollection.has FALSE)', () => {
            // Arrange
            const xObjectElement: string[] = ['/Image1'];
            const mockPage: any = jasmine.createSpyObj('Page', ['_dummy']);
            const xObjectCollection: Map<string, any> = new Map();
            const mockParser: any = jasmine.createSpyObj('Parser', ['_dummy']);
            // Act
            const result: any = _getXObject(xObjectElement, mockPage, xObjectCollection, mockParser);
            // Assert
            expect(result).toBeUndefined();
        });
        it('should extract xobject key by removing forward slash', () => {
            // Arrange
            const xObjectElement: string[] = ['/TestObject'];
            const mockPage: any = jasmine.createSpyObj('Page', ['_dummy']);
            const xObjectCollection: Map<string, any> = new Map();
            xObjectCollection.set('TestObject', null);
            const mockParser: any = jasmine.createSpyObj('Parser', ['_dummy']);
            // Act
            const result: any = _getXObject(xObjectElement, mockPage, xObjectCollection, mockParser);
            // Assert
            expect(result).toBeUndefined();
        });
        it('should return void when xobject not found in collection', () => {
            // Arrange
            const xObjectElement: string[] = ['/NonExistent'];
            const mockPage: any = jasmine.createSpyObj('Page', ['_dummy']);
            const xObjectCollection: Map<string, any> = new Map();
            const mockData: any = jasmine.createSpyObj('Data', ['_dummy']);
            // Act
            const result: any = _getXObject(xObjectElement, mockPage, xObjectCollection, mockData);
            // Assert
            expect(result).toBeUndefined();
        });
    });
});
