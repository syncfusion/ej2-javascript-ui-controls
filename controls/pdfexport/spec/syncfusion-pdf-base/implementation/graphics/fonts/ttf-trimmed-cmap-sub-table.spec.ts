/**
 * spec document for TtfTrimmedCmapSubTable.ts class
 */
import { TtfTrimmedCmapSubTable } from "../../../../../src/implementation/graphics/fonts/ttf-trimmed-cmap-sub-table";
describe('TtfTrimmedCmapSubTable.ts', () => {
    describe('Constructor initializing',()=> {
        let t1 : TtfTrimmedCmapSubTable = new TtfTrimmedCmapSubTable();
        it('Position == 0', () => {
            expect(t1).not.toBeUndefined();
        })
    })
})