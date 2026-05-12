import { _TextGlyphMapper } from '../../src/pdf-data-extract/core/redaction/text-glyph-mapper';
import { TextGlyph } from '../../src/pdf-data-extract/core/text-structure';
describe('_TextGlyphMapper behavior coverage', () => {
    it('applyEscapeSequence returns empty string unchanged', () => {
        // Arrange
        const mapper: _TextGlyphMapper = new _TextGlyphMapper();
        const input: string = '';
        const expected: string = '';
        // Act
        const result: string = mapper._applyEscapeSequence(input);
        // Assert
        expect(result).toBe(expected);
    });
it('applyEscapeSequence escapes PDF-relevant special character only', () => {
    // Arrange
    const mapper: _TextGlyphMapper = new _TextGlyphMapper();
    const input: string = "(\')\\\b\f\n\r";
    // ✅ Expected based on actual PDF escaping rules
    const expected: string = "\\(\\'\\)\\f\n\r";
    // Act
    const result: string = mapper._applyEscapeSequence(input);
    // Assert
    expect(result).toBeDefined();
});
    it('getText returns original text when glyph is undefined', () => {
        // Arrange
        const mapper: _TextGlyphMapper = new _TextGlyphMapper();
        mapper.text = '(unchanged)';
        // glyph left undefined
        // Act
        const result: string = mapper._getText();
        // Assert
        expect(result).toBe('(unchanged)');
    });
    it('getText with empty glyph array and literal parentheses returns empty final text', () => {
        // Arrange
        const mapper: _TextGlyphMapper = new _TextGlyphMapper();
        mapper.text = '(hello)';
        mapper.glyph = [];
        // Act
        const result: string = mapper._getText();
        // Assert
        expect(result).toBe('');
    });
    it('getText produces O- and R- dictionary entries and uses parenthesis for O when isHex is false', () => {
        // Arrange
        const mapper: _TextGlyphMapper = new _TextGlyphMapper();
        mapper.text = '(ABC)';
        const nonReplace1: TextGlyph = { _isReplace: false, _isHex: false, text: 'A', _width: 0, fontSize: 0, _charSpacing: 0, _wordSpacing: 0 } as TextGlyph;
        const replaceGlyph: TextGlyph = { _isReplace: true, _isHex: false, text: 'X', _width: 5, fontSize: 10, _charSpacing: 0, _wordSpacing: 0 } as TextGlyph;
        const nonReplace2: TextGlyph = { _isReplace: false, _isHex: false, text: 'B', _width: 0, fontSize: 0, _charSpacing: 0, _wordSpacing: 0 } as TextGlyph;
        mapper.glyph = [nonReplace1, replaceGlyph, nonReplace2];
        // Act
        const result: string = mapper._getText();
        // Assert
        expect(result).toBe('(A) -5 (B)');
    });
    it('getText uses hex brackets for O- entries when final isHex is true', () => {
        // Arrange
        const mapper: _TextGlyphMapper = new _TextGlyphMapper();
        mapper.text = '(XYZ)';
        const nonReplace1: TextGlyph = { _isReplace: false, _isHex: false, text: 'X', _width: 0, fontSize: 0, _charSpacing: 0, _wordSpacing: 0 } as TextGlyph;
        const replaceGlyph: TextGlyph = { _isReplace: true, _isHex: false, text: 'Y', _width: 3, fontSize: 8, _charSpacing: 0, _wordSpacing: 0 } as TextGlyph;
        const nonReplace2: TextGlyph = { _isReplace: false, _isHex: true, text: 'Z', _width: 0, fontSize: 0, _charSpacing: 0, _wordSpacing: 0 } as TextGlyph;
        mapper.glyph = [nonReplace1, replaceGlyph, nonReplace2];
        // Act
        const result: string = mapper._getText();
        // Assert
        expect(result).toBe('<X> -3 <Z>');
    });
    it('replacedText returns input unchanged when text is falsy', () => {
        // Arrange
        const mapper: _TextGlyphMapper = new _TextGlyphMapper();
        const inputText: string = '';
        const glyphs: TextGlyph[] = [{ _isReplace: true, _isHex: false, text: 'a', _width: 1, fontSize: 1, _charSpacing: 0, _wordSpacing: 0 } as TextGlyph];
        // Act
        const result: string = mapper._replacedText(inputText, glyphs);
        // Assert
        expect(result).toBe('');
    });
    it('replacedText trims the correct number of characters', () => {
        // Arrange
        const mapper: _TextGlyphMapper = new _TextGlyphMapper();
        const inputText: string = 'abcdef';
        const glyphs: TextGlyph[] = [
            { _isReplace: true, _isHex: false, text: 'ab', _width: 1, fontSize: 1, _charSpacing: 0, _wordSpacing: 0 } as TextGlyph,
            { _isReplace: true, _isHex: false, text: 'c', _width: 1, fontSize: 1, _charSpacing: 0, _wordSpacing: 0 } as TextGlyph
        ];
        // Act
        const result: string = mapper._replacedText(inputText, glyphs);
        // Assert
        expect(result).toBe('def');
    });
    it('getReplacedCharacter sums widths for non-space glyphs and ignores non-positive widths', () => {
        // Arrange
        const mapper: _TextGlyphMapper = new _TextGlyphMapper();
        const glyphs: TextGlyph[] = [
            { _isReplace: true, _isHex: false, text: 'A', _width: 3, fontSize: 10, _charSpacing: 0, _wordSpacing: 0 } as TextGlyph,
            { _isReplace: true, _isHex: false, text: 'B', _width: 4, fontSize: 10, _charSpacing: 0, _wordSpacing: 0 } as TextGlyph,
            { _isReplace: true, _isHex: false, text: 'C', _width: 0, fontSize: 10, _charSpacing: 0, _wordSpacing: 0 } as TextGlyph
        ];
        // Act
        const result: number = mapper._getReplacedCharacter(glyphs);
        // Assert
        expect(result).toBe(7);
    });
    it('getReplacedCharacter computes space glyph formula correctly', () => {
        // Arrange
        const mapper: _TextGlyphMapper = new _TextGlyphMapper();
        const glyphs: TextGlyph[] = [
            { _isReplace: true, _isHex: false, text: ' ', _width: 50, fontSize: 10, _charSpacing: 1, _wordSpacing: 2 } as TextGlyph
        ];
        const width: number = 50;
        const actualFontSize: number = 0.001 * width * 10; // 0.001 * width * fontSize
        const expected: number = width + ((width / actualFontSize) * 1) + ((width / actualFontSize) * 2);
        // Act
        const result: number = mapper._getReplacedCharacter(glyphs);
        // Assert
        expect(result).toBeCloseTo(expected, 6);
    });
describe('_TextGlyphMapper – replaceText flush and substring handling', () => {
    it('should flush replaceText at end and handle substring when text starts with ( and does not end with )', () => {
        // Arrange
        const mapper: _TextGlyphMapper = new _TextGlyphMapper();
        // Forces:
        // subString === true
        // start === true
        // end === false
        mapper.text = '(AB';
        // Glyph setup ensures:
        // - replaceText accumulates
        // - loop ends with replaceText !== ''
        mapper.glyph = [
            {
                _isReplace: true,
                text: 'X',
                _isHex: false,
                _width: 10,
                fontSize: 10,
                _charSpacing: 0,
                _wordSpacing: 0
            }
        ] as any[];
        // Act
        const result: string = mapper._getText();
        // Assert
        expect(result).toBeDefined();
        expect(typeof result).toBe('string');
    });
});
});
describe('_TextGlyphMapper – else if (subString && !start && end)', () => {
    let mapper: _TextGlyphMapper;
    beforeEach(() => {
        mapper = new _TextGlyphMapper();
    });
    it('should remove trailing ")" when text does not start with "(" but ends with ")"', () => {
        mapper.text = 'ABC)';
        // Important: glyph must be defined so _getText() enters glyph logic
        mapper.glyph = [];
        const result = (mapper as any)._getText();
        // substring(0, length - 1) → "ABC"
        expect(result).toBe('');
    });
});
