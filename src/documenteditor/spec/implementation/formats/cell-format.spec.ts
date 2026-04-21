import { WCellFormat } from '../../../src/document-editor/implementation/format/cell-format';
describe('Cell Validation Testing', () => {
    afterEach(() => {
        WCellFormat.clear();
    });
    it('margin  Testing', () => {
console.log('margin  Testing');
        let cell: WCellFormat = new WCellFormat();
        expect(cell.containsMargins()).toBe(false);
        cell.leftMargin = undefined;
        cell.cellWidth = 20;
    });
    it('Cell format destroy Testing', () => {
console.log('Cell format destroy Testing');
        let cell: WCellFormat = new WCellFormat();
        expect(cell.containsMargins()).toBe(false);
        cell.destroy();
    });
    it('Clone format  Testing', () => {
console.log('Clone format  Testing');
        let cell: WCellFormat = new WCellFormat();
        expect(cell.containsMargins()).toBe(false);
        cell.cloneFormat();
    });
    it('copy format  Testing', () => {
console.log('copy format  Testing');
        let cell: WCellFormat = new WCellFormat();
        expect(cell.containsMargins()).toBe(false);
        cell.cellWidth = 312;
        cell.preferredWidth = 300;
        cell.copyFormat(cell);
    });
    it('copy format undefined  Testing', () => {
console.log('copy format undefined  Testing');
        let cell: WCellFormat = new WCellFormat();
        expect(cell.containsMargins()).toBe(false);
        cell.copyFormat(cell);
    });
    it('copy format validation  Testing', () => {
console.log('copy format validation  Testing');
        let cell: WCellFormat = new WCellFormat();
        expect(() => { cell.copyFormat(undefined) }).not.toThrowError();
    });
    it('copy cell format with shading undefined testing', () => {
console.log('copy cell format with shading undefined testing');
        let cell: WCellFormat = new WCellFormat();
        let cell2: WCellFormat = new WCellFormat();
        cell2.destroy();
        expect(() => { cell.copyFormat(cell2) }).not.toThrowError();
    });
    it('destroy Testing', () => {
console.log('destroy Testing');
        let cell: WCellFormat = new WCellFormat();
        cell.destroy();
        cell.cloneFormat();
        expect(() => { cell.destroy() }).not.toThrowError();
    });
});
