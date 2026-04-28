import { _TextGlyphMapper } from "../src/pdf-data-extract/core/redaction/text-glyph-mapper";
import { TextGlyph } from "../src/pdf-data-extract/core/text-structure";
describe('Viewer Reported Issues', () => {
    it('1014602 - _getReplacedCharacter coverage', () => {
        let textGlyphMapper: _TextGlyphMapper = new _TextGlyphMapper();
        let textGlyph: TextGlyph = new TextGlyph();
        textGlyph._fontSize = 12;
        textGlyph._width = 0;
        textGlyph._charSpacing = 0;
        textGlyph._wordSpacing = 0;
        expect(textGlyphMapper._getReplacedCharacter([textGlyph])).toEqual(0);
    });
});