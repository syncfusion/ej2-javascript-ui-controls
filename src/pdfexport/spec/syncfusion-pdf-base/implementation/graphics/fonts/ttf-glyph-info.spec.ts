/**
 * spec document for TtfGlyphInfo.ts class
 */
import { TtfGlyphInfo } from "../../../../../src/implementation/graphics/fonts/ttf-glyph-info";
describe('TtfGlyphInfo.ts', () => {
    describe('Constructor initializing',()=> {
        let t1 : TtfGlyphInfo = new TtfGlyphInfo();
        t1.index = 0;
        t1.charCode = 0;
        t1.width = 0;
        // t1.Eof();
        it('-this.constructor(string)', () => {
            expect(t1.empty).toBeTruthy();
        })
        let t2 : TtfGlyphInfo = new TtfGlyphInfo();
        t2.index = 2;
        it('Position == 0', () => {
            expect(t2.compareTo(t1)).toEqual(2);
        })
    })
})