import { WRowFormat } from '../../../src/document-editor/implementation/format/row-format';
describe('Row Format Validation Testing', () => {
    afterEach(() => {
        WRowFormat.clear();
    });
    it('Row Format Clone Format Testing', () => {
console.log('Row Format Clone Format Testing');
        let rowFormat: WRowFormat = new WRowFormat();
        rowFormat.cloneFormat();
        expect('').toBe('')
    });
    it('Row Format destroy Testing', () => {
console.log('Row Format destroy Testing');
        let rowFormat: WRowFormat = new WRowFormat();
        rowFormat.destroy();
        expect('').toBe('')
    });
    it('copy format  Testing', () => {
console.log('copy format  Testing');
        let row: WRowFormat = new WRowFormat();
        let row1: WRowFormat = new WRowFormat();
        row1.height = 300;
        row1.isHeader = undefined;
        row.copyFormat(row1);
    });
    it('copy format undefined  Testing', () => {
console.log('copy format undefined  Testing');
        let row: WRowFormat = new WRowFormat();
        let row1: WRowFormat = new WRowFormat();
        row1.destroy();
        row.copyFormat(row1);
    });
    it('copy format undefined  Testing', () => {
console.log('copy format undefined  Testing');
        let row: WRowFormat = new WRowFormat();
        let row1: WRowFormat = new WRowFormat();
        row1.destroy();
        row.copyFormat(row1);
        expect(() => { row.copyFormat(undefined); }).not.toThrowError();
        expect(() => { row1.destroy(); }).not.toThrowError();
    });
});
