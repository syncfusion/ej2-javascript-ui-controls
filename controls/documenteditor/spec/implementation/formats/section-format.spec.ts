import { WTableHolder } from '../../../src/index';
import { WSectionFormat } from '../../../src/document-editor/implementation/format/section-format';
describe('TableHolder Validation Testing', () => {
    afterEach(() => {
        WSectionFormat.clear();
    });
    it('TableHolder destroy  Testing', () => {
        let holder: WTableHolder = new WTableHolder();
        holder.destroy();
        holder.destroy();
        expect('').toBe('')
    });
    it('Section Format Copy Format Undefined Testing', () => {
        let sectionFormat: WSectionFormat = new WSectionFormat();
        let sectionFormat1: WSectionFormat = new WSectionFormat();
        sectionFormat.copyFormat(sectionFormat1);
        expect('').toBe('')
    });
    it('Section Format Copy Format Undefined Testing', () => {
        let sectionFormat: WSectionFormat = new WSectionFormat();
        sectionFormat.copyFormat(undefined);
        expect('').toBe('')
    });
    it('Section Format Copy Format Testing', () => {
        let sectionFormat: WSectionFormat = new WSectionFormat();
        let sectionFormat1: WSectionFormat = new WSectionFormat();
        sectionFormat1.footerDistance = 50;
        sectionFormat1.headerDistance = 50;
        sectionFormat1.differentFirstPage = true;
        sectionFormat.copyFormat(sectionFormat1);
        expect(sectionFormat.differentFirstPage).toBe(true);
    });
    it('Section Format Copy Format Testing', () => {
        let sectionFormat: WSectionFormat = new WSectionFormat();
        let sectionFormat1: WSectionFormat = new WSectionFormat();
        sectionFormat1.footerDistance = undefined;      
        sectionFormat.copyFormat(sectionFormat1);
        expect(sectionFormat.footerDistance).toBe(36);
    });
    it('Section Format destroy Testing', () => {
        let sectionFormat: WSectionFormat = new WSectionFormat();
        sectionFormat.destroy();
        expect('').toBe('')
    });
    it('Section Format Clone Format Testing', () => {
        let sectionFormat: WSectionFormat = new WSectionFormat();     
        sectionFormat.cloneFormat();
        expect(sectionFormat.footerDistance).toBe(36);
    });
});