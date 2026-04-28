import { WListFormat } from '../../../src/document-editor/implementation/format/list-format';

/**
 * List Format spec
 */
describe('Copy Format', () => {
    afterEach(() => {
        WListFormat.clear();
    });
    it('set property value undefined', () => {
console.log('set property value undefined');
        let format: WListFormat = new WListFormat();
        format.listLevelNumber = undefined;
        expect(format.listLevelNumber).toBe(0);
    });
    it('Copy format default', () => {
console.log('Copy format default');
        let format: WListFormat = new WListFormat();
        let format2: WListFormat = new WListFormat();
        format2.copyFormat(format);
    });
    it('Copy format value', () => {
console.log('Copy format value');
        let format: WListFormat = new WListFormat();
        format.listId = 1;
        format.listLevelNumber = 1;
        let format2: WListFormat = new WListFormat();
        format2.copyFormat(format);
    });
    it('destroy testing', () => {
console.log('destroy testing');
        let format: WListFormat = new WListFormat();
        format.destroy();
        expect(() => { format.destroy(); }).not.toThrowError();
    });
    it('Clear format validation', () => {
console.log('Clear format validation');
        let format: WListFormat = new WListFormat();
        format.listId = 1;
        format.listLevelNumber = 1;
        format.clearFormat();
        expect(format.listId).toBe(-1);
        expect(format.listLevelNumber).not.toBe(1);
        expect((format as any).uniqueListFormat).toBeUndefined();
    });
});
