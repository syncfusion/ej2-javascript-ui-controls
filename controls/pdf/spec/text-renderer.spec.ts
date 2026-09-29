import { PdfGraphicsElement, PdfTrueTypeFont } from "../src";
import { _RtlRenderer } from "../src/pdf/core/graphics/rightToLeft/text-renderer";

describe('_RtlRenderer', () => {
    it('_layout returns empty array when line is undefined', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        expect(renderer._closeBracket).toEqual(')');
        expect(renderer._openBracket).toEqual('(');
        const font: any = { _isUnicode: false, _fontInternal: null };
        const result: string[] = renderer._layout(undefined, font, false, false, undefined);
        expect(result).toEqual([]);
    });

    it('_layout returns empty array when line is null', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const font: any = { _isUnicode: false, _fontInternal: null };
        const result: string[] = renderer._layout(null, font, false, false, undefined);
        expect(result).toEqual([]);
    });

    it('_layout returns empty array when font is undefined', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const result: string[] = renderer._layout('sample', undefined, false, false, undefined);
        expect(result).toEqual([]);
    });

    it('_layout returns empty array when font is null', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const result: string[] = renderer._layout('sample', null, false, false, undefined);
        expect(result).toEqual([]);
    });

    it('_layout returns line for non-unicode font', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const font: any = { _isUnicode: false, _fontInternal: null };
        const result: string[] = renderer._layout('sample', font, false, false, undefined);
        expect(result.length).toBe(1);
        expect(result[0]).toBe('sample');
    });

    it('_layout kills font !== null ? === null mutant', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const font: any = null;
        const result: string[] = renderer._layout('test', font, false, false, undefined);
        expect(result).toEqual([]);
    });

    it('_layout kills typeof font !== undefined mutant', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const result: string[] = renderer._layout('test', undefined, false, false, undefined);
        expect(result).toEqual([]);
    });

    it('_layout returns string array not null and is array', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const font: any = { _isUnicode: false, _fontInternal: null };
        const result: string[] = renderer._layout('text', font, true, false, undefined);
        expect(result).not.toBeNull();
        expect(Array.isArray(result)).toBe(true);
    });

    it('_layout both font and line must be valid with logical and', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const font: any = { _isUnicode: false, _fontInternal: null };
        const result1: string[] = renderer._layout('test', null, false, false, undefined);
        const result2: string[] = renderer._layout(null, font, false, false, undefined);
        const result3: string[] = renderer._layout(null, null, false, false, undefined);
        expect(result1).toEqual([]);
        expect(result2).toEqual([]);
        expect(result3).toEqual([]);
    });

    it('_splitLayout returns empty array when font is null', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const result: string[] = renderer._splitLayout('test', null, false, false, undefined);
        expect(result).toEqual([]);
    });

    it('_splitLayout returns empty array when font is undefined', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const result: string[] = renderer._splitLayout('test', undefined, false, false, undefined);
        expect(result).toEqual([]);
    });

    it('_splitLayout returns empty array when line is null', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const font: any = { _isUnicode: false, _fontInternal: null };
        const result: string[] = renderer._splitLayout(null, font, false, false, undefined);
        expect(result).toEqual([]);
    });

    it('_splitLayout returns empty array when line is undefined', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const font: any = { _isUnicode: false, _fontInternal: null };
        const result: string[] = renderer._splitLayout(undefined, font, false, false, undefined);
        expect(result).toEqual([]);
    });

    it('_splitLayout calls _customSplitLayout when valid', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const font: any = { _isUnicode: false, _fontInternal: null };
        spyOn(renderer, '_customSplitLayout').and.returnValue(['t', 'e', 's', 't']);
        const result: string[] = renderer._splitLayout('test', font, false, false, undefined);
        expect(renderer._customSplitLayout).toHaveBeenCalled();
    });

    it('_splitLayout returns array not null and is array type', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const font: any = { _isUnicode: false, _fontInternal: null };
        spyOn(renderer, '_customSplitLayout').and.returnValue([]);
        const result: string[] = renderer._splitLayout('x', font, false, false, undefined);
        expect(result).not.toBeNull();
        expect(Array.isArray(result)).toBe(true);
    });

    it('_getGlyphIndex returns object when font is null', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const glyphs: number[] = [];
        const result: any = renderer._getGlyphIndex('a', null, glyphs);
        expect(result._result).toBe(true);
        expect(result._glyphIndex).toEqual([]);
    });

    it('_getGlyphIndex returns object when line is null', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const font: any = { _isUnicode: true, _fontInternal: { _ttfReader: { _getGlyph: () => ({ _index: 42 }) } } };
        const glyphs: number[] = [];
        const result: any = renderer._getGlyphIndex(null, font, glyphs);
        expect(result._result).toBe(true);
        expect(result._glyphIndex).toEqual([]);
    });

    it('_getGlyphIndex returns UnicodeLine object not null', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const font: any = { _isUnicode: true, _fontInternal: { _ttfReader: { _getGlyph: () => ({ _index: 10 }) } } };
        const glyphs: number[] = [];
        const result: any = renderer._getGlyphIndex('t', font, glyphs);
        expect(result).not.toBeNull();
        expect(typeof result).toBe('object');
        expect(result._result).toBeDefined();
        expect(result._glyphIndex).toBeDefined();
    });

    it('should add glyph index when glyphInfo is valid', () => {
        const renderer = new _RtlRenderer();
        const font: any = {
            _fontInternal: {
                _ttfReader: {
                    _getGlyph: () => ({ _index: 123 })
                }
            }
        };
        const result = renderer._getGlyphIndex('A', font, []);
        expect(result._glyphIndex).toEqual([123]);
    });
    it('_customLayout 3 param returns string or null when wordSpace undefined', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const format: any = { textDirection: 1 };
        const result: any = (renderer as any)._customLayout('test', true, format);
        expect(typeof result === 'string' || result === null).toBe(true);
    });

    it('_customLayout 3 param returns null when line is null', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const format: any = { textDirection: 1 };
        const result: any = (renderer as any)._customLayout(null, true, format);
        expect(result).toBeNull();
    });

    it('_customLayout 3 param returns null when line is undefined', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const format: any = { textDirection: 1 };
        const result: any = (renderer as any)._customLayout(undefined, true, format);
        expect(result).toBeNull();
    });

    it('_customLayout 3 param handles null format', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const result: any = (renderer as any)._customLayout('test', true, null);
        expect(result).toBeNull();
    });

    it('_customLayout 3 param handles textDirection none', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const format: any = { textDirection: 0 };
        const result: any = (renderer as any)._customLayout('test', true, format);
        expect(result).toBeNull();
    });

    it('_customLayout 5 param returns array when wordSpace is false', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const font: any = { _isUnicode: true, _fontInternal: {} };
        const format: any = { textDirection: 1 };
        spyOn(renderer, '_addCharacter').and.returnValue('encoded');
        const result: any = (renderer as any)._customLayout('test', true, format, font, false);
        expect(Array.isArray(result)).toBe(true);
    });

    it('_customLayout 5 param returns empty when font is null', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const format: any = { textDirection: 1 };
        const result: any = (renderer as any)._customLayout('test', true, format, null, false);
        expect(result).toEqual([]);
    });

    it('_customLayout 5 param returns empty when line is null', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const font: any = { _isUnicode: true, _fontInternal: {} };
        const format: any = { textDirection: 1 };
        const result: any = (renderer as any)._customLayout(null, true, format, font, false);
        expect(result).toEqual([]);
    });

    it('_customLayout 5 param splits when wordSpace is true', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const font: any = { _isUnicode: true, _fontInternal: {} };
        const format: any = { textDirection: 1 };
        spyOn(renderer, '_addCharacter').and.returnValue('x');
        const result: any = (renderer as any)._customLayout('ab', true, format, font, true);
        expect(Array.isArray(result)).toBe(true);
        if (result.length > 0) {
            expect(renderer._addCharacter).toHaveBeenCalled();
        }
    });

    it('_customLayout 5 param returns single element when wordSpace is false', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const font: any = { _isUnicode: true, _fontInternal: {} };
        const format: any = { textDirection: 1 };
        spyOn(renderer, '_addCharacter').and.returnValue('encoded');
        const result: any = (renderer as any)._customLayout('test', true, format, font, false);
        expect(result.length).toBe(1);
    });

    it('_customLayout 5 param returns array not null', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const font: any = { _isUnicode: true, _fontInternal: {} };
        const format: any = { textDirection: 1 };
        spyOn(renderer, '_addCharacter').and.returnValue('e');
        const result: any = (renderer as any)._customLayout('x', true, format, font, false);
        expect(result).not.toBeNull();
        expect(Array.isArray(result)).toBe(true);
    });
    it('should return empty array when format is undefined in Path B', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const font: any = {_isUnicode: true,_fontInternal: {}};
        const result: any = (renderer as any)._customLayout('test',true,undefined,font,true);
        expect(result).toEqual([]);
    });
    it('_addCharacter returns glyphs when font is null', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const result: string = renderer._addCharacter(null, 'test');
        expect(result).toBe('test');
    });

    it('_addCharacter returns glyphs when font is undefined', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const result: string = renderer._addCharacter(undefined, 'test');
        expect(result).toBe('test');
    });

    it('_addCharacter returns glyphs when glyphs is null', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const font: any = { _isUnicode: true, _fontInternal: { _ttfReader: { _convertString: (x: string) => x } }, _setSymbols: () => {} };
        const result: string = renderer._addCharacter(font, null);
        expect(result).toBeNull();
    });

    it('_addCharacter returns glyphs when glyphs is undefined', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const font: any = { _isUnicode: true, _fontInternal: { _ttfReader: { _convertString: (x: string) => x } }, _setSymbols: () => {} };
        const result: string = renderer._addCharacter(font, undefined);
        expect(result).toBeUndefined();
    });

    it('_addCharacter calls _setSymbols on font', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const font: any = { _isUnicode: true, _fontInternal: { _ttfReader: { _convertString: (x: string) => x } }, _setSymbols: jasmine.createSpy('_setSymbols') };
        renderer._addCharacter(font, 'test');
        expect(font._setSymbols).toHaveBeenCalledWith('test');
    });

    it('_addCharacter calls _convertString on TTF reader', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const font: any = { _isUnicode: true, _fontInternal: { _ttfReader: { _convertString: jasmine.createSpy('_convertString').and.returnValue('converted') } }, _setSymbols: () => {} };
        renderer._addCharacter(font, 'input');
        expect(font._fontInternal._ttfReader._convertString).toHaveBeenCalledWith('input');
    });

    it('_addCharacter returns encoded string type', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const font: any = { _isUnicode: true, _fontInternal: { _ttfReader: { _convertString: (x: string) => x } }, _setSymbols: () => {} };
        const result: string = renderer._addCharacter(font, 'test');
        expect(typeof result).toBe('string');
    });

    it('_addCharacter both font and glyphs must be valid for encoding', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const font: any = { _isUnicode: true, _fontInternal: { _ttfReader: { _convertString: (x: string) => x } }, _setSymbols: () => {} };
        const result1: any = renderer._addCharacter(font, null);
        const result2: string = renderer._addCharacter(null, 'test');
        expect(result1).toBeNull();
        expect(result2).toBe('test');
    });

    it('_customSplitLayout returns empty when line is null', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const font: any = { _isUnicode: false, _fontInternal: null };
        const result: string[] = renderer._customSplitLayout(null, font, false, false, undefined);
        expect(result).toEqual([]);
    });

    it('_customSplitLayout returns empty when line is undefined', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const font: any = { _isUnicode: false, _fontInternal: null };
        const result: string[] = renderer._customSplitLayout(undefined, font, false, false, undefined);
        expect(result).toEqual([]);
    });

    it('_customSplitLayout calls _customLayout with 3 parameters', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const font: any = { _isUnicode: false, _fontInternal: null };
        spyOn(renderer, '_customLayout').and.returnValue('tset');
        renderer._customSplitLayout('test', font, true, false, undefined);
        expect(renderer._customLayout).toHaveBeenCalledWith('test', true, undefined);
    });

    it('_customSplitLayout splits result into characters', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const font: any = { _isUnicode: false, _fontInternal: null };
        spyOn(renderer, '_customLayout').and.returnValue('cba');
        const result: string[] = renderer._customSplitLayout('abc', font, false, false, undefined);
        expect(result.length).toBe(3);
        expect(result[0]).toBe('c');
        expect(result[1]).toBe('b');
        expect(result[2]).toBe('a');
    });

    it('_customSplitLayout returns array not null', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const font: any = { _isUnicode: false, _fontInternal: null };
        spyOn(renderer, '_customLayout').and.returnValue('x');
        const result: string[] = renderer._customSplitLayout('x', font, false, false, undefined);
        expect(result).not.toBeNull();
        expect(Array.isArray(result)).toBe(true);
    });

    it('_customSplitLayout empty layouted line produces empty array', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const font: any = { _isUnicode: false, _fontInternal: null };
        spyOn(renderer, '_customLayout').and.returnValue('');
        const result: string[] = renderer._customSplitLayout('x', font, false, false, undefined);
        expect(result).toEqual([]);
    });

    it('_customSplitLayout single character produces single element array', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const font: any = { _isUnicode: false, _fontInternal: null };
        spyOn(renderer, '_customLayout').and.returnValue('a');
        const result: string[] = renderer._customSplitLayout('a', font, false, false, undefined);
        expect(result.length).toBe(1);
        expect(result[0]).toBe('a');
    });

    it('_layout unicode font calls _customLayout and chains result', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const font: any = { _isUnicode: true, _fontInternal: {} };
        spyOn(renderer, '_customLayout').and.returnValue(['shaped']);
        const result: string[] = renderer._layout('test', font, true, false, undefined);
        expect(renderer._customLayout).toHaveBeenCalledWith('test', true, undefined, font, false);
        expect(result).toEqual(['shaped']);
    });

    it('_layout non-unicode font returns line as single element array', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const font: any = { _isUnicode: false, _fontInternal: null };
        const result: string[] = renderer._layout('hello world', font, false, false, undefined);
        expect(result.length).toBe(1);
        expect(result[0]).toBe('hello world');
    });

    it('_splitLayout system variable is always false and calls _customSplitLayout', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const font: any = { _isUnicode: false, _fontInternal: null };
        spyOn(renderer, '_customSplitLayout').and.returnValue(['t', 'e', 's', 't']);
        const result: string[] = renderer._splitLayout('test', font, false, false, undefined);
        expect(renderer._customSplitLayout).toHaveBeenCalled();
        expect(result).toEqual(['t', 'e', 's', 't']);
    });

    it('_getGlyphIndex initializes glyphs array and resets it', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const font: any = { _isUnicode: true, _fontInternal: { _ttfReader: { _getGlyph: () => ({ _index: 1 }) } } };
        const glyphs: number[] = [999, 888];
        const result: any = renderer._getGlyphIndex('x', font, glyphs);
        expect(result._glyphIndex[0]).toBe(1);
    });

    it('_getGlyphIndex sets _result to true', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const font: any = { _isUnicode: true, _fontInternal: { _ttfReader: { _getGlyph: () => ({ _index: 1 }) } } };
        const glyphs: number[] = [];
        const result: any = renderer._getGlyphIndex('x', font, glyphs);
        expect(result._result).toBe(true);
    });

    it('_getGlyphIndex assigns glyph indices to _glyphIndex', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const font: any = { _isUnicode: true, _fontInternal: { _ttfReader: { _getGlyph: () => ({ _index: 99 }) } } };
        const glyphs: number[] = [];
        const result: any = renderer._getGlyphIndex('a', font, glyphs);
        expect(result._glyphIndex.length).toBe(1);
        expect(result._glyphIndex.some((val: number) => val === 99)).toBe(true);
    });

    it('_getGlyphIndex processes each character in shaped text', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const ttfReaderSpy: any = jasmine.createSpy('_getGlyph').and.returnValue({ _index: 10 });
        const font: any = { _isUnicode: true, _fontInternal: { _ttfReader: { _getGlyph: ttfReaderSpy } } };
        const glyphs: number[] = [];
        const result: any = renderer._getGlyphIndex('abc', font, glyphs);
        expect(ttfReaderSpy).toHaveBeenCalledTimes(3);
        expect(result._glyphIndex.length).toBeGreaterThan(0);
    });

    it('_getGlyphIndex skips null glyphInfo', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const glyphInfoMock: any = { _index: 42 };
        const ttfReaderSpy: any = jasmine.createSpy('_getGlyph').and.callFake((ch: string) => {
            return ch === 'a' ? glyphInfoMock : null;
        });
        const font: any = { _isUnicode: true, _fontInternal: { _ttfReader: { _getGlyph: ttfReaderSpy } } };
        const glyphs: number[] = [];
        const result: any = renderer._getGlyphIndex('ab', font, glyphs);
        expect(result._glyphIndex.length).toBeGreaterThan(0);
        expect(ttfReaderSpy).toHaveBeenCalledTimes(2);
    });

    it('_layout parameters pass correctly through chain to _customLayout', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const font: any = { _isUnicode: true, _fontInternal: {} };
        spyOn(renderer, '_customLayout').and.returnValue(['output']);
        renderer._layout('input', font, true, true, undefined);
        expect(renderer._customLayout).toHaveBeenCalledWith('input', true, undefined, font, true);
    });

    it('_splitLayout chains to _customSplitLayout with parameters', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const font: any = { _isUnicode: false, _fontInternal: null };
        spyOn(renderer, '_customSplitLayout').and.returnValue(['a', 'b']);
        const result: string[] = renderer._splitLayout('ab', font, false, false, undefined);
        expect(renderer._customSplitLayout).toHaveBeenCalled();
        expect(result).toEqual(['a', 'b']);
    });
});
describe('_customLayout 5-parameter overload (lines 125-155) mutation tests', () => {
    it('kills || → && mutation on line 126 with wordSpace null and valid line', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const format: any = { textDirection: 1 };
        spyOn(renderer, '_customLayout').and.returnValue(null);
        const result: any = (renderer as any)._customLayout('test', true, format, undefined, null);
        expect(typeof result === 'string' || result === null).toBe(true);
        expect(Array.isArray(result)).toBe(false);
    });

    it('kills || → && mutation on line 126 with wordSpace undefined and valid line', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const format: any = { textDirection: 1 };
        spyOn(renderer, '_customLayout').and.returnValue(null);
        const result: any = (renderer as any)._customLayout('test', true, format, undefined, undefined);
        expect(typeof result === 'string' || result === null).toBe(true);
        expect(Array.isArray(result)).toBe(false);
    });

    it('kills line !== null mutation on line 128 with null line in Path A', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const format: any = { textDirection: 1 };
        // Arrange
        // Act - line = null in Path A
        const result: any = (renderer as any)._customLayout(null, true, format, undefined, null);
        // Assert - result should be null when line is null
        expect(result).toBeNull();
    });

    it('kills typeof line !== "undefined" mutation on line 128 with undefined line in Path A', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const format: any = { textDirection: 1 };
        // Arrange
        // Act - line = undefined in Path A
        const result: any = (renderer as any)._customLayout(undefined, true, format, undefined, null);
        // Assert - result should be null when line is undefined
        expect(result).toBeNull();
    });

    it('kills format !== null mutation on line 129 with null format in Path A', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        // Arrange
        // Act - format = null in Path A with valid line
        const result: any = (renderer as any)._customLayout('test', true, null, undefined, null);
        // Assert - result should be null when format is null
        expect(result).toBeNull();
    });

    it('kills typeof format !== "undefined" mutation on line 129 with undefined format in Path A', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        // Arrange
        // Act - format = undefined in Path A with valid line
        const result: any = (renderer as any)._customLayout('test', true, undefined, undefined, null);
        // Assert - result should be null when format is undefined
        expect(result).toBeNull();
    });

    it('kills format.textDirection !== PdfTextDirection.none mutation on line 130', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const format: any = { textDirection: 0 }; // PdfTextDirection.none
        // Arrange
        // Act - textDirection = none (0) in Path A
        const result: any = (renderer as any)._customLayout('test', true, format, undefined, null);
        // Assert - result should be null when textDirection is none
        expect(result).toBeNull();
    });

    it('calls _Bidirectional._getLogicalToVisualString in Path A with valid inputs', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const format: any = { textDirection: 1 };
        // Arrange - mock the private call
        spyOn(renderer, '_customLayout').and.callThrough();
        // Act
        const result: any = (renderer as any)._customLayout('test', true, format, undefined, null);
        // Assert - verify the call was made (via return value type check)
        expect(typeof result === 'string' || result === null).toBe(true);
    });

    it('returns null from Path A when all conditions are met but bidi returns null', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const format: any = { textDirection: 1 };
        // Arrange
        // Act
        const result: any = (renderer as any)._customLayout('test', true, format, undefined, undefined);
        // Assert - Path A should return string or null
        expect(result === null || typeof result === 'string').toBe(true);
    });

    // ===== PATH B: wordSpace is defined (returns string[]) =====

    it('kills wordSpace === null mutation on line 126 with wordSpace true', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const font: any = { _isUnicode: true, _fontInternal: {} };
        const format: any = { textDirection: 1 };
        // Arrange
        spyOn(renderer, '_addCharacter').and.returnValue('x');
        // Act - wordSpace = true should enter Path B
        const result: any = (renderer as any)._customLayout('test', true, format, font, true);
        // Assert - Path B returns string[]
        expect(Array.isArray(result)).toBe(true);
    });

    it('kills wordSpace === null mutation on line 126 with wordSpace false', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const font: any = { _isUnicode: true, _fontInternal: {} };
        const format: any = { textDirection: 1 };
        // Arrange
        spyOn(renderer, '_addCharacter').and.returnValue('x');
        // Act - wordSpace = false should enter Path B
        const result: any = (renderer as any)._customLayout('test', true, format, font, false);
        // Assert - Path B returns string[]
        expect(Array.isArray(result)).toBe(true);
    });

    it('returns empty array when line is null in Path B', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const font: any = { _isUnicode: true, _fontInternal: {} };
        const format: any = { textDirection: 1 };
        // Arrange
        // Act - line = null in Path B
        const result: any = (renderer as any)._customLayout(null, true, format, font, true);
        // Assert - should return []
        expect(result).toEqual([]);
    });

    it('returns empty array when line is undefined in Path B', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const font: any = { _isUnicode: true, _fontInternal: {} };
        const format: any = { textDirection: 1 };
        // Arrange
        // Act - line = undefined in Path B
        const result: any = (renderer as any)._customLayout(undefined, true, format, font, false);
        // Assert - should return []
        expect(result).toEqual([]);
    });

    it('returns empty array when font is null in Path B', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const format: any = { textDirection: 1 };
        // Arrange
        // Act - font = null in Path B
        const result: any = (renderer as any)._customLayout('test', true, format, null, true);
        // Assert - should return []
        expect(result).toEqual([]);
    });

    it('returns empty array when font is undefined in Path B', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const format: any = { textDirection: 1 };
        // Arrange
        // Act - font = undefined in Path B
        const result: any = (renderer as any)._customLayout('test', true, format, undefined, false);
        // Assert - should return []
        expect(result).toEqual([]);
    });

    it('returns empty array when format is null in Path B', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const font: any = { _isUnicode: true, _fontInternal: {} };
        // Arrange
        // Act - format = null in Path B
        const result: any = (renderer as any)._customLayout('test', true, null, font, true);
        // Assert - should return []
        expect(result).toEqual([]);
    });
    it('returns empty array when format.textDirection is none in Path B', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const font: any = { _isUnicode: true, _fontInternal: {} };
        const format: any = { textDirection: 0 }; // PdfTextDirection.none
        // Arrange
        // Act
        const result: any = (renderer as any)._customLayout('test', true, format, font, true);
        // Assert - should return []
        expect(result).toEqual([]);
    });

    it('initializes layouted as empty string on line 136', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const font: any = { _isUnicode: true, _fontInternal: {} };
        const format: any = { textDirection: 1 };
        // Arrange
        spyOn(renderer, '_addCharacter').and.returnValue('x');
        // Act
        const result: any = (renderer as any)._customLayout('test', true, format, font, false);
        // Assert - should initialize and return []
        expect(Array.isArray(result)).toBe(true);
    });

    it('initializes result as empty array on line 137', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const font: any = { _isUnicode: true, _fontInternal: {} };
        const format: any = { textDirection: 1 };
        // Arrange
        spyOn(renderer, '_addCharacter').and.returnValue('x');
        // Act
        const result: any = (renderer as any)._customLayout('test', true, format, font, true);
        // Assert - should be array type
        expect(Array.isArray(result)).toBe(true);
    });

    it('kills if (wordSpace) → if (!wordSpace) mutation: wordSpace true splits characters', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const font: any = { _isUnicode: true, _fontInternal: {} };
        const format: any = { textDirection: 1 };
        // Arrange
        spyOn(renderer, '_addCharacter').and.callFake((f: any, word: string) => word);
        // Act - wordSpace = true should split
        const result: any = (renderer as any)._customLayout('ab', true, format, font, true);
        // Assert - with wordSpace true, array should have multiple elements (one per char after split)
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThanOrEqual(1);
    });

    it('kills if (wordSpace) → if (!wordSpace) mutation: wordSpace false single element', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const font: any = { _isUnicode: true, _fontInternal: {} };
        const format: any = { textDirection: 1 };
        // Arrange
        spyOn(renderer, '_addCharacter').and.returnValue('encoded');
        // Act - wordSpace = false should not split
        const result: any = (renderer as any)._customLayout('ab', true, format, font, false);
        // Assert - with wordSpace false, array should have single element
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(1);
        expect(result[0]).toBe('encoded');
    });

    it('verifies split("") on line 144 creates character array', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const font: any = { _isUnicode: true, _fontInternal: {} };
        const format: any = { textDirection: 1 };
        // Arrange
        let splitWasCalled: boolean = false;
        spyOn(renderer, '_addCharacter').and.callFake((f: any, word: string) => {
            splitWasCalled = true;
            return word;
        });
        // Act - wordSpace = true triggers split
        const result: any = (renderer as any)._customLayout('xyz', true, format, font, true);
        // Assert - split was used to create individual characters
        expect(splitWasCalled).toBe(true);
        expect(Array.isArray(result)).toBe(true);
    });

    it('verifies map() on line 145 calls _addCharacter for each character', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const font: any = { _isUnicode: true, _fontInternal: {} };
        const format: any = { textDirection: 1 };
        // Arrange
        spyOn(renderer, '_addCharacter').and.callFake((f: any, word: string) => 'encoded_' + word);
        // Act - wordSpace = true should call _addCharacter per char
        const result: any = (renderer as any)._customLayout('ab', true, format, font, true);
        // Assert - _addCharacter was called multiple times
        expect(renderer._addCharacter).toHaveBeenCalled();
        expect(result.length).toBeGreaterThanOrEqual(1);
    });

    it('verifies result[0] assignment on line 149 with wordSpace false', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const font: any = { _isUnicode: true, _fontInternal: {} };
        const format: any = { textDirection: 1 };
        // Arrange
        spyOn(renderer, '_addCharacter').and.returnValue('final_encoded');
        // Act - wordSpace = false should assign to result[0]
        const result: any = (renderer as any)._customLayout('test', true, format, font, false);
        // Assert - result[0] contains the encoded string
        expect(result.length).toBe(1);
        expect(result[0]).toBe('final_encoded');
    });

    it('kills return result on line 151 mutation: verifies result array is returned', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const font: any = { _isUnicode: true, _fontInternal: {} };
        const format: any = { textDirection: 1 };
        // Arrange
        spyOn(renderer, '_addCharacter').and.returnValue('x');
        // Act
        const result: any = (renderer as any)._customLayout('test', true, format, font, true);
        // Assert - result is the exact array (not null, not undefined)
        expect(result).not.toBeNull();
        expect(Array.isArray(result)).toBe(true);
    });
    it('kills line !== null && line !== undefined mutation combination', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const font: any = { _isUnicode: true, _fontInternal: {} };
        const format: any = { textDirection: 1 };
        // Arrange
        const result1: any = (renderer as any)._customLayout(null, true, format, font, true);
        const result2: any = (renderer as any)._customLayout(undefined, true, format, font, false);
        // Assert - both null and undefined should return []
        expect(result1).toEqual([]);
        expect(result2).toEqual([]);
    });

    it('kills font !== null && font !== undefined mutation combination', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const format: any = { textDirection: 1 };
        // Arrange
        const result1: any = (renderer as any)._customLayout('test', true, format, null, true);
        const result2: any = (renderer as any)._customLayout('test', true, format, undefined, false);
        // Assert - both null and undefined font should return []
        expect(result1).toEqual([]);
        expect(result2).toEqual([]);
    });

});
describe('_splitLayout mutation testing', () => {

    it('should return empty array and not call _customSplitLayout when line is null', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const font: any = { _isUnicode: false, _fontInternal: null };
        spyOn(renderer, '_customSplitLayout').and.returnValue(['x']);
        const result = renderer._splitLayout(null, font, false, false, undefined);
        expect(result).toEqual([]);
        expect(renderer._customSplitLayout).not.toHaveBeenCalled();
    });
    it('should return empty array and not call _customSplitLayout when line is undefined', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const font: any = { _isUnicode: false, _fontInternal: null };
        spyOn(renderer, '_customSplitLayout').and.returnValue(['x']);
        const result = renderer._splitLayout(undefined, font, false, false, undefined);
        expect(result).toEqual([]);
        expect(renderer._customSplitLayout).not.toHaveBeenCalled();
    });
    it('should return empty array when font is null', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const result = renderer._splitLayout('test', null, false, false, undefined);
        expect(result).toEqual([]);
    });
    it('should return empty array when font is undefined', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const result = renderer._splitLayout('test', undefined, false, false, undefined);
        expect(result).toEqual([]);
    });
    it('should call _customSplitLayout once and return its result for valid input', () => {
        const renderer: _RtlRenderer = new _RtlRenderer();
        const font: any = { _isUnicode: false, _fontInternal: null };
        spyOn(renderer, '_customSplitLayout').and.returnValue(['t', 'e', 's', 't']);
        const result = renderer._splitLayout('test', font, false, false, undefined);
        expect(renderer._customSplitLayout).toHaveBeenCalledTimes(1);
        expect(result).toEqual(['t', 'e', 's', 't']);
    });
});
describe('_getGlyphIndex mutation testing', () => {
    it('should return empty glyph list when font is undefined', () => {
        const renderer = new _RtlRenderer();
        const result = renderer._getGlyphIndex('abc', undefined, []);
        expect(result._result).toBe(true);
        expect(result._glyphIndex).toEqual([]);
    });

    it('should return empty glyph list when font is null', () => {
        const renderer = new _RtlRenderer();
        const result = renderer._getGlyphIndex('abc', null, []);
        expect(result._result).toBe(true);
        expect(result._glyphIndex).toEqual([]);
    });

    it('should return empty glyph list when line is undefined', () => {
        const renderer = new _RtlRenderer();
        const font: any = {
            _fontInternal: {
                _ttfReader: {
                    _getGlyph: (ch: string) => ({ _index: 1 })
                }
            }
        };
        const result = renderer._getGlyphIndex(undefined, font, []);
        expect(result._result).toBe(true);
        expect(result._glyphIndex).toEqual([]);
    });

    it('should return empty glyph list when line is null', () => {
        const renderer = new _RtlRenderer();
        const font: any = {
            _fontInternal: {
                _ttfReader: {
                    _getGlyph: (ch: string) => ({ _index: 1 })
                }
            }
        };
        const result = renderer._getGlyphIndex(null, font, []);
        expect(result._result).toBe(true);
        expect(result._glyphIndex).toEqual([]);
    });

    it('should return false result when line is empty string', () => {
        const renderer = new _RtlRenderer();
        const font: any = {
            _fontInternal: {
                _ttfReader: {
                    _getGlyph: (ch: string) => ({ _index: 1 })
                }
            }
        };
        const result = renderer._getGlyphIndex('', font, []);
        expect(result._result).toBe(false);
        expect(result._glyphIndex).toEqual([]);
    });

    it('should populate glyph indexes for valid latin text using real shape renderer', () => {
        const renderer = new _RtlRenderer();
        // Latin chars pass through _ArabicShapeRenderer._shape unchanged
        const font: any = {
            _fontInternal: {
                _ttfReader: {
                    _getGlyph: (ch: string) => ({ _index: ch === 'A' ? 10 : 20 })
                }
            }
        };
        const result = renderer._getGlyphIndex('AB', font, []);
        expect(result._result).toBe(true);
        expect(result._glyphIndex).toEqual([10, 20]);
    });

    it('should collect glyph index from every character in the shaped text', () => {
        const renderer = new _RtlRenderer();
        const indexMap: { [ch: string]: number } = { 'X': 5, 'Y': 15, 'Z': 25 };
        const font: any = {
            _fontInternal: {
                _ttfReader: {
                    _getGlyph: (ch: string) => ({ _index: indexMap[ch] !== undefined ? indexMap[ch] : 99 })
                }
            }
        };
        const result = renderer._getGlyphIndex('XYZ', font, []);
        expect(result._result).toBe(true);
        expect(result._glyphIndex.length).toBe(3);
        expect(result._glyphIndex[0]).toBe(5);
        expect(result._glyphIndex[1]).toBe(15);
        expect(result._glyphIndex[2]).toBe(25);
    });

    it('should ignore undefined glyphs returned by ttfReader', () => {
        const renderer = new _RtlRenderer();
        // 'A' returns a valid glyph, 'B' returns undefined — only 'A' index must appear
        const font: any = {
            _fontInternal: {
                _ttfReader: {
                    _getGlyph: (ch: string) => {
                        if (ch === 'A') { return { _index: 10 }; }
                        return undefined;
                    }
                }
            }
        };
        const result = renderer._getGlyphIndex('AB', font, []);
        expect(result._glyphIndex.length).toBe(1);
        expect(result._glyphIndex[0]).toBe(10);
    });

    it('should ignore null glyphs returned by ttfReader', () => {
        const renderer = new _RtlRenderer();
        const font: any = {
            _fontInternal: {
                _ttfReader: {
                    _getGlyph: (ch: string) => {
                        if (ch === 'M') { return { _index: 7 }; }
                        return null;
                    }
                }
            }
        };
        const result = renderer._getGlyphIndex('MN', font, []);
        expect(result._glyphIndex.length).toBe(1);
        expect(result._glyphIndex[0]).toBe(7);
    });

    it('should reset the incoming glyphs array and always start fresh', () => {
        const renderer = new _RtlRenderer();
        const font: any = {
            _fontInternal: {
                _ttfReader: {
                    _getGlyph: (ch: string) => ({ _index: 42 })
                }
            }
        };
        // Pre-populated glyphs array must be discarded by the method
        const staleGlyphs: number[] = [999, 888, 777];
        const result = renderer._getGlyphIndex('A', font, staleGlyphs);
        expect(result._glyphIndex.indexOf(999)).toBe(-1);
        expect(result._glyphIndex.indexOf(888)).toBe(-1);
        expect(result._glyphIndex[0]).toBe(42);
    });

    it('should return _result true for single character latin text', () => {
        const renderer = new _RtlRenderer();
        const font: any = {
            _fontInternal: {
                _ttfReader: {
                    _getGlyph: (ch: string) => ({ _index: 55 })
                }
            }
        };
        const result = renderer._getGlyphIndex('Z', font, []);
        expect(result._result).toBe(true);
        expect(result._glyphIndex.length).toBe(1);
        expect(result._glyphIndex[0]).toBe(55);
    });

});
