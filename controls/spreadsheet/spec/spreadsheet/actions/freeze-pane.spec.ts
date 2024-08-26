import { SpreadsheetHelper } from "../util/spreadsheethelper.spec";
import { defaultData, filterData } from '../util/datasource.spec';
import { SheetModel, getRangeAddress, Spreadsheet } from "../../../src/index";

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
    it('Virtual scrolling - scroll down', (done: Function) => {
        helper.invoke('goTo', ['CS244']);
        setTimeout((): void => {
            expect(sheet.topLeftCell).toBe('A1');
            expect(sheet.paneTopLeftCell).toBe('CS244');
            expect(helper.invoke('getContentTable').tBodies[0].childElementCount).toBe(childCount);
            done();
        }, 30);
    });
    it('Virtual scrolling - scroll up', (done: Function) => {
        helper.invoke('goTo', ['D59']);
        setTimeout((): void => {
            expect(sheet.topLeftCell).toBe('A1');
            expect(sheet.paneTopLeftCell).toBe('D59');
            expect(helper.invoke('getContentTable').tBodies[0].childElementCount).toBe(childCount);
            done();
        }, 30);
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
        }, 30);
    });
    it('SF-401876 -> Apply freeze pane issue when columns range selection are before the viewport', (done: Function) => {
        sheet.selectedRange = 'A1:H11';
        sheet.frozenRows = 0; sheet.frozenColumns = 0;
        sheet.activeCell = 'A1';
        sheet.topLeftCell = sheet.paneTopLeftCell = 'D1';
        const spreadsheet: Spreadsheet = helper.getInstance();
        spreadsheet.setProperties({ sheets: spreadsheet.sheets }, true);
        helper.switchRibbonTab(5);
        helper.click('#' + helper.id + '_freezepanes');
        expect(sheet.frozenRows).toBe(0);
        expect(sheet.frozenColumns).toBe(0);
        done();
    });
});
describe('CR-Issues ->', () => {
    let helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');
    describe('EJ2-882771 ->', () => {
        beforeEach((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{ ranges: [{ dataSource: defaultData }], frozenColumns: 3, frozenRows: 5 }],
                scrollSettings: { enableVirtualization: false }
            }, done);
        });
        afterEach(() => {
            helper.invoke('destroy');
        });
        it('Cell selection is misaligned due to UI not properly rendered when deleting a column on the freeze pane and finite mode applied sheet with virtualization is set to false', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            const sheet: SheetModel = spreadsheet.getActiveSheet();
            expect(sheet.paneTopLeftCell).toBe('D6');
            helper.invoke('delete', [3, 3, 'Column']);
            setTimeout((): void => {
                let td: HTMLElement = helper.invoke('getCell', [0, 3]);
                expect(td.textContent).toBe('Price');
                td = helper.invoke('getCell', [0, 4]);
                expect(td.textContent).toBe('Amount');
                td = helper.invoke('getCell', [0, 5]);
                expect(td.textContent).toBe('Discount');
                td = helper.invoke('getCell', [0, 6]);
                expect(td.textContent).toBe('Profit');
                done();
            });
        });
    });
    describe('EJ2-902480 ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{ ranges: [{ dataSource: defaultData }], frozenColumns: 3 }],
                scrollSettings: { enableVirtualization: false, isFinite: true }
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Selection is misaligned and row/column headers gets duplicated when adding a row/column in finite mode outside the freeze pane', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            const sheet: SheetModel = spreadsheet.getActiveSheet();
            expect(sheet.paneTopLeftCell).toBe('D1');
            spreadsheet.insertColumn(3, 4);
            setTimeout((): void => {
                expect(helper.invoke('getCell', [0, 6]).textContent).toBe('Price');
                expect(helper.invoke('getCell', [0, 7]).textContent).toBe('Amount');
                expect(helper.invoke('getCell', [0, 8]).textContent).toBe('Discount');
                expect(helper.invoke('getCell', [0, 9]).textContent).toBe('Profit');
                spreadsheet.insertRow(6, 8);
                setTimeout((): void => {
                    expect(helper.invoke('getCell', [9, 0]).textContent).toBe('Sneakers');
                    expect(helper.invoke('getCell', [10, 0]).textContent).toBe('Running Shoes');
                    expect(helper.invoke('getCell', [11, 0]).textContent).toBe('Loafers');
                    expect(helper.invoke('getCell', [12, 0]).textContent).toBe('Cricket Shoes');
                    helper.invoke('hideColumn', [6, 8]);
                    setTimeout(() => {
                        expect(sheet.columns[6].hidden).toBeTruthy();
                        expect(sheet.columns[7].hidden).toBeTruthy();
                        expect(sheet.columns[8].hidden).toBeTruthy();
                        expect(helper.invoke('getCell', [0, 5]).textContent).toBe('Quantity');
                        expect(helper.invoke('getCell', [0, 9]).textContent).toBe('Profit');
                        helper.invoke('hideColumn', [6, 8, false]);
                        setTimeout(() => {
                            expect(sheet.columns[6].hidden).toBeFalsy();
                            expect(sheet.columns[7].hidden).toBeFalsy();
                            expect(sheet.columns[8].hidden).toBeFalsy();
                            expect(helper.invoke('getCell', [0, 6]).textContent).toBe('Price');
                            expect(helper.invoke('getCell', [0, 7]).textContent).toBe('Amount');
                            expect(helper.invoke('getCell', [0, 8]).textContent).toBe('Discount');
                            expect(helper.invoke('getCell', [0, 9]).textContent).toBe('Profit');
                            done();
                        });
                    });
                });
            });
        });
    });
});