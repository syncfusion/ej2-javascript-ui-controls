import { WParagraphFormat } from '../../../src/document-editor/implementation/format/paragraph-format';
import { WListFormat } from '../../../src/document-editor/implementation/format/list-format';
/**
 * Paragraph format spec
 */
describe('Paragraph Validation Testing', () => {
    afterEach(() => {
        WParagraphFormat.clear();
        WListFormat.clear();
    });
    it('Copy format setting  Testing', () => {
        let para: WListFormat = new WListFormat();
        para.listLevelNumber = 20;
        expect('').toBe('');
    });
    it('Copy format Testing', () => {
        let para: WParagraphFormat = new WParagraphFormat();
        let para1: WParagraphFormat = new WParagraphFormat();
        para.copyFormat(para1);
        expect('').toBe('');
    });
    it('Copy format undefined Testing', () => {
        let para: WParagraphFormat = new WParagraphFormat();
        para.copyFormat(undefined);
        expect('').toBe('');
    });
    it('Clone format Testing', () => {
        let para: WParagraphFormat = new WParagraphFormat();
        para.cloneFormat();
        expect('').toBe('');
    });
    it('destroy Testing', () => {
        let para: WParagraphFormat = new WParagraphFormat();
        para.destroy();
        para.cloneFormat();
        expect(() => { para.destroy() }).not.toThrowError();
    });
    it('Clear Format validation', () => {
        let format: WParagraphFormat = new WParagraphFormat();
        format.leftIndent = 10;
        format.rightIndent = 12;
        format.afterSpacing = 10;
        format.listFormat.listId = 1;
        format.listFormat.listLevelNumber = 0;
        format.clearFormat();
        expect((format as any).uniqueParagraphFormat).toBeUndefined();
        expect(format.leftIndent).toBe(0);
        expect(format.rightIndent).toBe(0);
        expect(format.listFormat.listId).toBe(-1);
    });
});