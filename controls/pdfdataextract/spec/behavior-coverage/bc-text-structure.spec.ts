import { TextLine, TextWord, TextGlyph } from '../../src/pdf-data-extract/core/text-structure';
import { PdfFontStyle, Rectangle, PdfColor } from '@syncfusion/ej2-pdf';
describe('TextLine, TextWord, TextGlyph (Lines 1-798)', () => {
    let textLine: TextLine;
    let textWord: TextWord;
    let textGlyph: TextGlyph;
    beforeEach(() => {
        textLine = new TextLine();
        textWord = new TextWord();
        textGlyph = new TextGlyph();
    });
    // ===================== TextLine Tests =====================
    it('should initialize TextLine with default values', () => {
        // Arrange
        const line: TextLine = new TextLine();
        // Act & Assert
        expect(line._wordCollection).toBeDefined();
        expect(Array.isArray(line._wordCollection)).toBe(true);
        expect(line._wordCollection.length).toBe(0);
    });
    it('should get text property from TextLine', () => {
        // Arrange
        const line: TextLine = new TextLine();
        const testText: string = 'Hello World';
        line._text = testText;
        // Act
        const result: string = line.text;
        // Assert
        expect(result).toBe(testText);
        expect(result).toEqual('Hello World');
    });
    it('should get words property from TextLine', () => {
        // Arrange
        const line: TextLine = new TextLine();
        const word1: TextWord = new TextWord();
        word1._text = 'Word1';
        const word2: TextWord = new TextWord();
        word2._text = 'Word2';
        line._wordCollection = [word1, word2];
        // Act
        const result: TextWord[] = line.words;
        // Assert
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(2);
        expect(result[0]._text).toBe('Word1');
        expect(result[1]._text).toBe('Word2');
    });
    it('should get fontName property from TextLine', () => {
        // Arrange
        const line: TextLine = new TextLine();
        const fontName: string = 'Arial';
        line._fontName = fontName;
        // Act
        const result: string = line.fontName;
        // Assert
        expect(result).toBe(fontName);
        expect(result).toEqual('Arial');
    });
    it('should get fontSize property from TextLine', () => {
        // Arrange
        const line: TextLine = new TextLine();
        const fontSize: number = 12;
        line._fontSize = fontSize;
        // Act
        const result: number = line.fontSize;
        // Assert
        expect(result).toBe(fontSize);
        expect(result).toEqual(12);
    });
    it('should get fontStyle property from TextLine', () => {
        // Arrange
        const line: TextLine = new TextLine();
        const fontStyle: PdfFontStyle = PdfFontStyle.bold;
        line._fontStyle = fontStyle;
        // Act
        const result: PdfFontStyle = line.fontStyle;
        // Assert
        expect(result).toBe(fontStyle);
    });
    it('should get bounds property from TextLine', () => {
        // Arrange
        const line: TextLine = new TextLine();
        const bounds: Rectangle = { x: 10, y: 20, width: 100, height: 50 };
        line._bounds = bounds;
        // Act
        const result: Rectangle = line.bounds;
        // Assert
        expect(result).toBeDefined();
        expect(result.x).toBe(10);
        expect(result.y).toBe(20);
        expect(result.width).toBe(100);
        expect(result.height).toBe(50);
    });
    it('should get pageIndex property from TextLine', () => {
        // Arrange
        const line: TextLine = new TextLine();
        const pageIndex: number = 5;
        line._pageIndex = pageIndex;
        // Act
        const result: number = line.pageIndex;
        // Assert
        expect(result).toBe(pageIndex);
        expect(result).toEqual(5);
    });
    it('should handle empty text in TextLine', () => {
        // Arrange
        const line: TextLine = new TextLine();
        line._text = '';
        // Act
        const result: string = line.text;
        // Assert
        expect(result).toBe('');
        expect(result.length).toBe(0);
    });
    it('should handle null bounds in TextLine', () => {
        // Arrange
        const line: TextLine = new TextLine();
        line._bounds = null;
        // Act
        const result: Rectangle = line.bounds;
        // Assert
        expect(result).toBeNull();
    });
    it('should handle multiple words in TextLine collection', () => {
        // Arrange
        const line: TextLine = new TextLine();
        const words: TextWord[] = [];
        for (let i: number = 0; i < 5; i++) {
            const word: TextWord = new TextWord();
            word._text = `Word${i}`;
            words.push(word);
        }
        line._wordCollection = words;
        // Act
        const result: TextWord[] = line.words;
        // Assert
        expect(result.length).toBe(5);
        expect(result[0]._text).toBe('Word0');
        expect(result[4]._text).toBe('Word4');
    });
    // ===================== TextWord Tests =====================
    it('should initialize TextWord with default values', () => {
        // Arrange
        const word: TextWord = new TextWord();
        // Act & Assert
        expect(word._glyphs).toBeDefined();
        expect(Array.isArray(word._glyphs)).toBe(true);
        expect(word._glyphs.length).toBe(0);
    });
    it('should get text property from TextWord', () => {
        // Arrange
        const word: TextWord = new TextWord();
        const testText: string = 'Testing';
        word._text = testText;
        // Act
        const result: string = word.text;
        // Assert
        expect(result).toBe(testText);
        expect(result).toEqual('Testing');
    });
    it('should get glyphs property from TextWord', () => {
        // Arrange
        const word: TextWord = new TextWord();
        const glyph1: TextGlyph = new TextGlyph();
        glyph1._text = 'T';
        const glyph2: TextGlyph = new TextGlyph();
        glyph2._text = 'e';
        word._glyphs = [glyph1, glyph2];
        // Act
        const result: TextGlyph[] = word.glyphs;
        // Assert
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(2);
        expect(result[0]._text).toBe('T');
        expect(result[1]._text).toBe('e');
    });
    it('should get fontName property from TextWord', () => {
        // Arrange
        const word: TextWord = new TextWord();
        const fontName: string = 'Courier';
        word._fontName = fontName;
        // Act
        const result: string = word.fontName;
        // Assert
        expect(result).toBe(fontName);
        expect(result).toEqual('Courier');
    });
    it('should get fontSize property from TextWord', () => {
        // Arrange
        const word: TextWord = new TextWord();
        const fontSize: number = 14;
        word._fontSize = fontSize;
        // Act
        const result: number = word.fontSize;
        // Assert
        expect(result).toBe(fontSize);
        expect(result).toEqual(14);
    });
    it('should get fontStyle property from TextWord', () => {
        // Arrange
        const word: TextWord = new TextWord();
        const fontStyle: PdfFontStyle = PdfFontStyle.italic;
        word._fontStyle = fontStyle;
        // Act
        const result: PdfFontStyle = word.fontStyle;
        // Assert
        expect(result).toBe(fontStyle);
    });
    it('should get bounds property from TextWord', () => {
        // Arrange
        const word: TextWord = new TextWord();
        const bounds: Rectangle = { x: 5, y: 10, width: 50, height: 25 };
        word._bounds = bounds;
        // Act
        const result: Rectangle = word.bounds;
        // Assert
        expect(result).toBeDefined();
        expect(result.x).toBe(5);
        expect(result.y).toBe(10);
        expect(result.width).toBe(50);
        expect(result.height).toBe(25);
    });
    it('should handle empty glyph collection in TextWord', () => {
        // Arrange
        const word: TextWord = new TextWord();
        word._glyphs = [];
        // Act
        const result: TextGlyph[] = word.glyphs;
        // Assert
        expect(result.length).toBe(0);
        expect(Array.isArray(result)).toBe(true);
    });
    it('should handle large glyph collection in TextWord', () => {
        // Arrange
        const word: TextWord = new TextWord();
        const glyphs: TextGlyph[] = [];
        for (let i: number = 0; i < 100; i++) {
            const glyph: TextGlyph = new TextGlyph();
            glyph._text = String.fromCharCode(65 + (i % 26));
            glyphs.push(glyph);
        }
        word._glyphs = glyphs;
        // Act
        const result: TextGlyph[] = word.glyphs;
        // Assert
        expect(result.length).toBe(100);
        expect(result[0]._text).toBe('A');
        expect(result[25]._text).toBe('Z');
    });
    // ===================== TextGlyph Tests =====================
    it('should initialize TextGlyph with default values', () => {
        // Arrange
        const glyph: TextGlyph = new TextGlyph();
        // Act & Assert
        expect(glyph._isHex).toBe(false);
        expect(glyph._isReplace).toBe(false);
    });
    it('should get text property from TextGlyph', () => {
        // Arrange
        const glyph: TextGlyph = new TextGlyph();
        glyph._text = 'A';
        // Act
        const result: string = glyph.text;
        // Assert
        expect(result).toBe('A');
        expect(result).toEqual('A');
    });
    it('should get fontName property from TextGlyph', () => {
        // Arrange
        const glyph: TextGlyph = new TextGlyph();
        glyph._fontName = 'Times New Roman';
        // Act
        const result: string = glyph.fontName;
        // Assert
        expect(result).toBe('Times New Roman');
    });
    it('should get fontSize property from TextGlyph', () => {
        // Arrange
        const glyph: TextGlyph = new TextGlyph();
        glyph._fontSize = 16;
        // Act
        const result: number = glyph.fontSize;
        // Assert
        expect(result).toBe(16);
        expect(result).toEqual(16);
    });
    it('should get fontStyle property from TextGlyph', () => {
        // Arrange
        const glyph: TextGlyph = new TextGlyph();
        glyph._fontStyle = PdfFontStyle.strikeout;
        // Act
        const result: PdfFontStyle = glyph.fontStyle;
        // Assert
        expect(result).toBe(PdfFontStyle.strikeout);
    });
    it('should get bounds property from TextGlyph', () => {
        // Arrange
        const glyph: TextGlyph = new TextGlyph();
        const bounds: Rectangle = { x: 1, y: 2, width: 10, height: 15 };
        glyph._bounds = bounds;
        // Act
        const result: Rectangle = glyph.bounds;
        // Assert
        expect(result).toBeDefined();
        expect(result.x).toBe(1);
        expect(result.y).toBe(2);
        expect(result.width).toBe(10);
        expect(result.height).toBe(15);
    });
    it('should get color property from TextGlyph', () => {
        // Arrange
        const glyph: TextGlyph = new TextGlyph();
        const color: PdfColor = {r:255, b:0, g:0};
        glyph._color = color;
        // Act
        const result: PdfColor = glyph.color;
        // Assert
        expect(result).toBeDefined();
        expect(result).toBe(color);
    });
    it('should get isRotated property from TextGlyph', () => {
        // Arrange
        const glyph: TextGlyph = new TextGlyph();
        glyph._isRotated = true;
        // Act
        const result: boolean = glyph.isRotated;
        // Assert
        expect(result).toBe(true);
    });
    it('should handle special characters in TextGlyph', () => {
        // Arrange
        const glyph: TextGlyph = new TextGlyph();
        const specialChar: string = '©';
        glyph._text = specialChar;
        // Act
        const result: string = glyph.text;
        // Assert
        expect(result).toBe(specialChar);
        expect(result).toEqual('©');
    });
    it('should handle negative coordinates in TextGlyph bounds', () => {
        // Arrange
        const glyph: TextGlyph = new TextGlyph();
        const bounds: Rectangle = { x: -10, y: -20, width: 30, height: 40 };
        glyph._bounds = bounds;
        // Act
        const result: Rectangle = glyph.bounds;
        // Assert
        expect(result.x).toBe(-10);
        expect(result.y).toBe(-20);
    });
    it('should handle zero dimensions in TextGlyph bounds', () => {
        // Arrange
        const glyph: TextGlyph = new TextGlyph();
        const bounds: Rectangle = { x: 0, y: 0, width: 0, height: 0 };
        glyph._bounds = bounds;
        // Act
        const result: Rectangle = glyph.bounds;
        // Assert
        expect(result.x).toBe(0);
        expect(result.y).toBe(0);
        expect(result.width).toBe(0);
        expect(result.height).toBe(0);
    });
    it('should handle large font sizes in TextGlyph', () => {
        // Arrange
        const glyph: TextGlyph = new TextGlyph();
        glyph._fontSize = 999;
        // Act
        const result: number = glyph.fontSize;
        // Assert
        expect(result).toBe(999);
    });
    it('should handle null color in TextGlyph', () => {
        // Arrange
        const glyph: TextGlyph = new TextGlyph();
        glyph._color = null;
        // Act
        const result: PdfColor = glyph.color;
        // Assert
        expect(result).toBeNull();
    });
    it('should handle undefined text in TextGlyph', () => {
        // Arrange
        const glyph: TextGlyph = new TextGlyph();
        glyph._text = undefined;
        // Act
        const result: string = glyph.text;
        // Assert
        expect(result).toBeUndefined();
    });
    it('should handle isRotated false state in TextGlyph', () => {
        // Arrange
        const glyph: TextGlyph = new TextGlyph();
        glyph._isRotated = false;
        // Act
        const result: boolean = glyph.isRotated;
        // Assert
        expect(result).toBe(false);
    });
    it('should handle width property in TextGlyph', () => {
        // Arrange
        const glyph: TextGlyph = new TextGlyph();
        glyph._width = 5.5;
        // Act & Assert
        expect(glyph._width).toBe(5.5);
    });
    it('should handle charSpacing property in TextGlyph', () => {
        // Arrange
        const glyph: TextGlyph = new TextGlyph();
        glyph._charSpacing = 2.5;
        // Act & Assert
        expect(glyph._charSpacing).toBe(2.5);
    });
    it('should handle wordSpacing property in TextGlyph', () => {
        // Arrange
        const glyph: TextGlyph = new TextGlyph();
        glyph._wordSpacing = 3.0;
        // Act & Assert
        expect(glyph._wordSpacing).toBe(3.0);
    });
    it('should handle isHex property in TextGlyph', () => {
        // Arrange
        const glyph: TextGlyph = new TextGlyph();
        glyph._isHex = true;
        // Act & Assert
        expect(glyph._isHex).toBe(true);
    });
    it('should handle isReplace property in TextGlyph', () => {
        // Arrange
        const glyph: TextGlyph = new TextGlyph();
        glyph._isReplace = true;
        // Act & Assert
        expect(glyph._isReplace).toBe(true);
    });
    // ===================== Property Initialization Tests =====================
    it('should preserve TextLine property values across multiple accesses', () => {
        // Arrange
        const line: TextLine = new TextLine();
        const testText: string = 'Persistent Text';
        line._text = testText;
        // Act
        const result1: string = line.text;
        const result2: string = line.text;
        const result3: string = line.text;
        // Assert
        expect(result1).toBe(testText);
        expect(result2).toBe(testText);
        expect(result3).toBe(testText);
        expect(result1).toEqual(result2);
        expect(result2).toEqual(result3);
    });
    it('should preserve TextWord property values across multiple accesses', () => {
        // Arrange
        const word: TextWord = new TextWord();
        const fontName: string = 'Helvetica';
        word._fontName = fontName;
        // Act
        const result1: string = word.fontName;
        const result2: string = word.fontName;
        // Assert
        expect(result1).toBe(fontName);
        expect(result2).toBe(fontName);
    });
    it('should preserve TextGlyph property values across multiple accesses', () => {
        // Arrange
        const glyph: TextGlyph = new TextGlyph();
        const character: string = 'Z';
        glyph._text = character;
        // Act
        const result1: string = glyph.text;
        const result2: string = glyph.text;
        // Assert
        expect(result1).toBe(character);
        expect(result2).toBe(character);
    });
    it('should create independent TextLine instances', () => {
        // Arrange
        const line1: TextLine = new TextLine();
        const line2: TextLine = new TextLine();
        line1._text = 'Line 1';
        line2._text = 'Line 2';
        // Act
        const result1: string = line1.text;
        const result2: string = line2.text;
        // Assert
        expect(result1).toBe('Line 1');
        expect(result2).toBe('Line 2');
        expect(result1).not.toEqual(result2);
    });
    it('should create independent TextWord instances', () => {
        // Arrange
        const word1: TextWord = new TextWord();
        const word2: TextWord = new TextWord();
        word1._text = 'Word1';
        word2._text = 'Word2';
        // Act
        const result1: string = word1.text;
        const result2: string = word2.text;
        // Assert
        expect(result1).toBe('Word1');
        expect(result2).toBe('Word2');
        expect(result1).not.toEqual(result2);
    });
    it('should create independent TextGlyph instances', () => {
        // Arrange
        const glyph1: TextGlyph = new TextGlyph();
        const glyph2: TextGlyph = new TextGlyph();
        glyph1._text = 'A';
        glyph2._text = 'B';
        // Act
        const result1: string = glyph1.text;
        const result2: string = glyph2.text;
        // Assert
        expect(result1).toBe('A');
        expect(result2).toBe('B');
        expect(result1).not.toEqual(result2);
    });
    it('should handle default false values for TextGlyph boolean properties', () => {
        // Arrange
        const glyph: TextGlyph = new TextGlyph();
        // Act & Assert
        expect(glyph._isHex).toBe(false);
        expect(glyph._isReplace).toBe(false);
    });
    it('should support setting multiple properties on TextLine', () => {
        // Arrange
        const line: TextLine = new TextLine();
        line._text = 'Multi Line';
        line._fontName = 'Arial';
        line._fontSize = 12;
        line._fontStyle = PdfFontStyle.bold;
        line._pageIndex = 0;
        // Act
        const textResult: string = line.text;
        const fontNameResult: string = line.fontName;
        const fontSizeResult: number = line.fontSize;
        const fontStyleResult: PdfFontStyle = line.fontStyle;
        const pageIndexResult: number = line.pageIndex;
        // Assert
        expect(textResult).toBe('Multi Line');
        expect(fontNameResult).toBe('Arial');
        expect(fontSizeResult).toBe(12);
        expect(fontStyleResult).toBe(PdfFontStyle.bold);
        expect(pageIndexResult).toBe(0);
    });
    it('should support setting multiple properties on TextWord', () => {
        // Arrange
        const word: TextWord = new TextWord();
        word._text = 'MultiWord';
        word._fontName = 'Courier';
        word._fontSize = 14;
        word._fontStyle = PdfFontStyle.italic;
        // Act
        const textResult: string = word.text;
        const fontNameResult: string = word.fontName;
        const fontSizeResult: number = word.fontSize;
        const fontStyleResult: PdfFontStyle = word.fontStyle;
        // Assert
        expect(textResult).toBe('MultiWord');
        expect(fontNameResult).toBe('Courier');
        expect(fontSizeResult).toBe(14);
        expect(fontStyleResult).toBe(PdfFontStyle.italic);
    });
    it('should support setting multiple properties on TextGlyph', () => {
        // Arrange
        const glyph: TextGlyph = new TextGlyph();
        glyph._text = 'X';
        glyph._fontName = 'Verdana';
        glyph._fontSize = 18;
        glyph._fontStyle = PdfFontStyle.underline;
        glyph._width = 7.5;
        glyph._charSpacing = 1.0;
        glyph._wordSpacing = 2.0;
        glyph._isHex = true;
        glyph._isReplace = true;
        glyph._isRotated = true;
        // Act
        const textResult: string = glyph.text;
        const fontNameResult: string = glyph.fontName;
        const fontSizeResult: number = glyph.fontSize;
        const fontStyleResult: PdfFontStyle = glyph.fontStyle;
        const isRotatedResult: boolean = glyph.isRotated;
        // Assert
        expect(textResult).toBe('X');
        expect(fontNameResult).toBe('Verdana');
        expect(fontSizeResult).toBe(18);
        expect(fontStyleResult).toBe(PdfFontStyle.underline);
        expect(glyph._width).toBe(7.5);
        expect(glyph._charSpacing).toBe(1.0);
        expect(glyph._wordSpacing).toBe(2.0);
        expect(glyph._isHex).toBe(true);
        expect(glyph._isReplace).toBe(true);
        expect(isRotatedResult).toBe(true);
    });
});
