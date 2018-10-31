import { WCharacterFormat } from '../../../src/document-editor/implementation/format/character-format';
/**
 * Character format spec
 */
describe('Character Format Testing', () => {
    afterEach(() => {
        WCharacterFormat.clear();
    });
    it('Copy Format Testing', () => {
        let charFormat: WCharacterFormat = new WCharacterFormat();
        let charFormat1: WCharacterFormat = new WCharacterFormat();
        charFormat.bold = true;
        charFormat.fontSize = 12;
        charFormat1.copyFormat(charFormat);
        expect(charFormat1.fontSize).toBe(12);
    });
    it('Copy Format undefined Testing', () => {
        let charFormat: WCharacterFormat = new WCharacterFormat();
        charFormat.copyFormat(undefined);
    });
    it('destroy Testing', () => {
        let charFormat: WCharacterFormat = new WCharacterFormat();
        charFormat.destroy();
        charFormat.cloneFormat();
        expect(() => { charFormat.destroy() }).not.toThrowError();
    });
    it('Clone Format Testing', () => {
        let charFormat: WCharacterFormat = new WCharacterFormat();
        charFormat.cloneFormat();
    });
    it('Character Format Equal Format Testing', () => {
        let charFormat: WCharacterFormat = new WCharacterFormat();
        charFormat.isEqualFormat(charFormat);
        expect(charFormat.bold).toBe(false);
    });
    it('Default Value Testing', () => {
        let charFormat: WCharacterFormat = new WCharacterFormat();
        expect(charFormat.bold).toBe(false);
    });
    it('set Property Value Testing', () => {
        let charFormat: WCharacterFormat = new WCharacterFormat();
        charFormat.bold = undefined;
        expect(charFormat.bold).toBe(false);
    });
    it('Clear Format validation', () => {
        let characterFormat: WCharacterFormat = new WCharacterFormat();
        characterFormat.bold = true;
        characterFormat.italic = true;
        characterFormat.fontSize = 12;
        characterFormat.clearFormat();
        expect((characterFormat as any).uniqueCharacterFormat).toBeUndefined();
        expect(characterFormat.bold).toBe(false);
        expect(characterFormat.italic).toBe(false);
    });
});