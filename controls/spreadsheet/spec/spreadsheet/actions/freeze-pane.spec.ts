import { SpreadsheetHelper } from "../util/spreadsheethelper.spec";
import { filterData } from '../util/datasource.spec';
import { SheetModel, getRangeAddress } from "../../../src/index";

describe('Freeze pane ->', () => {
    let helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');
    let sheet: SheetModel; let childCount: number; let usedRange: string;
    beforeAll((done: Function) => {
        helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: filterData }], frozenColumns: 3, frozenRows: 5 }]}, done);
    });
    afterAll(() => {
        helper.invoke('destroy');
    });
    it('Filtering', (done: Function) => {
        sheet = helper.getInstance().getActiveSheet();
        expect(sheet.topLeftCell).toBe('A1');
        expect(sheet.paneTopLeftCell).toBe('D6');
        childCount = helper.invoke('getContentTable').tBodies[0].childElementCount;
        usedRange = getRangeAddress([0, 0, sheet.usedRange.rowIndex, sheet.usedRange.colIndex]);
        helper.invoke(
            'applyFilter', [[{ value: 'Anchorage', field: 'E', predicate: 'or', operator: 'equal', type: 'string', matchCase: false, ignoreAccent: false }], usedRange]);
        setTimeout((): void => {
            expect(sheet.topLeftCell).toBe('A1');
            expect(sheet.paneTopLeftCell).toBe('D59');
            expect(helper.invoke('getColHeaderTable').tBodies[0].childElementCount).toBe(1);
            expect(helper.invoke('getContentTable').tBodies[0].childElementCount).toBe(childCount);
            done();
        });
    });
    it('Virtual scrolling', (done: Function) => {
        helper.invoke('goTo', ['CS244']);
        setTimeout((): void => {
            expect(sheet.topLeftCell).toBe('A1');
            expect(sheet.paneTopLeftCell).toBe('CS244');
            expect(helper.invoke('getContentTable').tBodies[0].childElementCount).toBe(childCount);
            helper.invoke('goTo', ['D59']);
            setTimeout((): void => {
                expect(sheet.paneTopLeftCell).toBe('D59');
                expect(helper.invoke('getContentTable').tBodies[0].childElementCount).toBe(childCount);
                done();
            });
        });
    });
    it('Sorting', (done: Function) => {
        expect(sheet.rows[58].cells[0].value.toString()).toBe('10305');
        expect(helper.invoke('getCell', [58, 0]).textContent).toBe('10305');
        expect(sheet.rows[194].cells[0].value.toString()).toBe('10441');
        expect(helper.invoke('getCell', [194, 0]).textContent).toBe('10441');
        helper.invoke('selectRange', ['A59']);
        helper.invoke('sort', [{ sortDescriptors: { order: 'Descending' } }, usedRange]).then(() => {
            expect(sheet.rows[58].cells[0].value.toString()).toBe('10441');
            expect(helper.invoke('getCell', [58, 0]).textContent).toBe('10441');
            expect(sheet.rows[194].cells[0].value.toString()).toBe('10305');
            expect(helper.invoke('getCell', [194, 0]).textContent).toBe('10305');
            done();
        });
    });
});