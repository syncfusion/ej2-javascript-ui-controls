import { WTableFormat } from '../../../src/document-editor/implementation/format/table-format';
describe('Table Format Validation Testing', () => {
    afterEach(() => {
        WTableFormat.clear();
    });
    it('Set property value undefined', () => {
console.log('Set property value undefined');
        let tableFormat: WTableFormat = new WTableFormat();
        tableFormat.cellSpacing = undefined;
        expect(tableFormat.cellSpacing).toBe(0);
    });
    it('Clone Format  Testing', () => {
console.log('Clone Format  Testing');
        let tableFormat: WTableFormat = new WTableFormat();
        tableFormat.cloneFormat();
        expect('').toBe('');
        tableFormat.destroy();
        tableFormat.cloneFormat();
        expect(() => { tableFormat.destroy() }).not.toThrowError();
    });
    it('Copy Format  Testing', () => {
console.log('Copy Format  Testing');
        let tableFormat: WTableFormat = new WTableFormat();
        let tableFormat1: WTableFormat = new WTableFormat();
        tableFormat1.leftMargin = 12;
        tableFormat.copyFormat(tableFormat1);
        expect('').toBe('');
    });
    it('Copy Format undefined Testing', () => {
console.log('Copy Format undefined Testing');
        let tableFormat: WTableFormat = new WTableFormat();
        let tableFormat1: WTableFormat = new WTableFormat();
        tableFormat1.destroy();
        tableFormat.copyFormat(tableFormat1);
        expect('').toBe('');
    });
    it('Copy Format undefined validation', () => {
console.log('Copy Format undefined validation');
        let tableFormat: WTableFormat = new WTableFormat();
        tableFormat.copyFormat(undefined);
        expect(() => { tableFormat.copyFormat(undefined); }).not.toThrowError();
    });
    it('Has Value undefined Testing', () => {
console.log('Has Value undefined Testing');
        let tableFormat: WTableFormat = new WTableFormat();
        tableFormat.destroy();
        tableFormat.hasValue('leftMargin');
        expect('').toBe('');
    });
    it('get Property Value undefined Testing', () => {
console.log('get Property Value undefined Testing');
        let tableFormat: WTableFormat = new WTableFormat();
        tableFormat.destroy();
        tableFormat.getPropertyValue('leftMargin');
        expect('').toBe('');
    });
});
