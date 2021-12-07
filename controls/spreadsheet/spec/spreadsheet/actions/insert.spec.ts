import { SpreadsheetHelper } from "../util/spreadsheethelper.spec";
import { defaultData } from '../util/datasource.spec';
import { CellModel, getCellAddress, Spreadsheet } from "../../../src/index";

describe('Insert & Delete ->', () => {
    let helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');

    describe('public method ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Insert', (done: Function) => {
            helper.invoke('insertRow', [2, 3]);
            expect(helper.getInstance().sheets[0].rows[2]).toEqual({});
            expect(helper.getInstance().sheets[0].rows[3]).toEqual({});
            setTimeout(() => {
                expect(helper.invoke('getCell', [2, 0]).textContent).toBe('');
                expect(helper.invoke('getCell', [4, 0]).textContent).toBe('Sports Shoes');

                helper.invoke('insertColumn', [3, 4]);
                setTimeout(() => {
                    expect(helper.getInstance().sheets[0].rows[0].cells[3]).toBeNull();
                    expect(helper.getInstance().sheets[0].rows[1].cells[3]).toBeNull();
                    expect(helper.getInstance().sheets[0].rows[0].cells[5].value).toEqual('Quantity');
                    expect(helper.invoke('getCell', [0, 3]).textContent).toBe('');
                    expect(helper.invoke('getCell', [0, 5]).textContent).toBe('Quantity');

                    helper.invoke('insertSheet', [1, 2]);
                    setTimeout(() => {
                        expect(helper.getInstance().sheets[1].name).toBe('Sheet2');
                        expect(helper.getInstance().sheets[2].name).toBe('Sheet3');
                        expect(helper.getElementFromSpreadsheet('.e-sheet-tab').getElementsByClassName('e-toolbar-item').length).toBe(3);
                        done();
                    });
                });
            });
        });

        it('Delete', (done: Function) => {
            helper.invoke('delete', [6, 6, 'Row']);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[6].cells[0].value).toBe('Flip- Flops & Slippers');
                expect(helper.invoke('getCell', [6, 0]).textContent).toBe('Flip- Flops & Slippers');

                helper.invoke('delete', [6, 7, 'Column']);
                setTimeout(() => {
                    expect(helper.getInstance().sheets[0].rows[0].cells[6].value).toBe('Discount');
                    expect(helper.invoke('getCell', [0, 6]).textContent).toBe('Discount');

                    helper.invoke('delete', [1, 1, 'Sheet']);
                    setTimeout(() => {
                        expect(helper.getInstance().sheets[1].name).toBe('Sheet3');
                        expect(helper.getInstance().sheets[2]).toBeUndefined();
                        expect(helper.getElementFromSpreadsheet('.e-sheet-tab').getElementsByClassName('e-toolbar-item').length).toBe(2);
                        done();
                    });
                });
            });
        });
    });
    describe('CR-Issues ->', () => {
        describe('I289560 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({}, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Issue with data updation in the inserted column ', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.insertColumn(1);
                setTimeout((): void => {
                    const cellsModel: CellModel[] = [{ value: 'Unit Price', style: { fontWeight: 'bold', textAlign: 'center' } }, { value: '18.00' },
                        { value: '19.00' }, { value: '10.00' }, { value: '22.00' }, { value: '21.35' }, { value: '25.00' }, { value: '30.00' },
                        { value: '21.00' }, { value: '40.00' }, { value: '97.00' }];
                    let rowIndex: number = 1;
                    cellsModel.forEach((cell: CellModel): void => {
                        spreadsheet.updateCell(cell, getCellAddress(rowIndex, 1)); rowIndex++;
                    });
                    expect(spreadsheet.sheets[0].rows[1].cells[1].value).toBe('Unit Price');
                    expect(helper.invoke('getCell', [1, 1]).textContent).toBe('Unit Price');
                    expect(spreadsheet.sheets[0].rows[2].cells[1].value.toString()).toBe('18');
                    expect(helper.invoke('getCell', [2, 1]).textContent).toBe('18');
                    expect(spreadsheet.sheets[0].rows[11].cells[1].value.toString()).toBe('97');
                    expect(helper.invoke('getCell', [11, 1]).textContent).toBe('97');
                    done();
                });
            });
        });
        describe('fb16095, I284821, I309406, F161227, I282799, I282799 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet(
                    { showSheetTabs: false, definedNames: [{ name: 'definedRange', refersTo: 'Sheet1!A1:C3' }], sheets: [{ rows: [{ cells:
                    [{ value: '10' }] }, { cells: [{ value: '5' }] }, { cells: [{ formula: '=SUM(A1:A2)' }] }] }] }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('After insert new row cell edit is not working and update formula while insert/delete the rows/columns in calculate library', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.definedNames[0].refersTo).toBe('=Sheet1!A1:C3');
                expect(spreadsheet.sheets[0].rows[2].cells[0].formula).toBe('=SUM(A1:A2)');
                spreadsheet.insertRow(1);
                setTimeout((): void => {
                    expect(spreadsheet.definedNames[0].refersTo).toBe('=Sheet1!A1:C4');
                    expect(spreadsheet.sheets[0].rows[3].cells[0].formula).toBe('=SUM(A1:A3)');
                    helper.edit('A2', '20');
                    setTimeout((): void => {
                        expect(spreadsheet.sheets[0].rows[1].cells[0].value.toString()).toBe('20');
                        expect(helper.invoke('getCell', [1, 0]).textContent).toBe('20');
                        expect(spreadsheet.sheets[0].rows[3].cells[0].value.toString()).toBe('35');
                        expect(helper.invoke('getCell', [3, 0]).textContent).toBe('35');
                        done();
                    }, 20);
                });
            });
        });
        describe('I312024 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ name: 'Default' }, { name: 'Deleted' }] }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Sheets property issue in delete method', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets.length).toBe(2);
                spreadsheet.delete(1);
                setTimeout((): void => {
                    expect(spreadsheet.sheets.length).toBe(1);
                    expect(helper.getElements('#' + helper.id + ' .e-sheet-tab .e-toolbar-item').length).toBe(1);
                    done();
                });
            });
        });
        describe('F161685, I311828, I315412 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ name: 'Sheet1' }, { name: 'Sheet2' }] }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Issue with insertSheet method while passing the index argument and usedRange not updated properly with the inserted sheets', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets.length).toBe(2);
                spreadsheet.insertSheet([{ index: 2, name: 'Inserted Sheet' }]);
                setTimeout((): void => {
                    expect(spreadsheet.sheets.length).toBe(3);
                    expect(spreadsheet.sheets[2].usedRange.rowIndex).toBe(0);
                    expect(spreadsheet.sheets[2].usedRange.colIndex).toBe(0);
                    expect(helper.getElements('#' + helper.id + ' .e-sheet-tab .e-toolbar-item').length).toBe(3);
                    done();
                });
            });
        });
        describe('I309292 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({ allowInsert: false, allowDelete: false }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Insert delete disable issues in context menu', (done: Function) => {
                const cell: HTMLElement = (helper.getElement('#' + helper.id + ' .e-colhdr-table') as HTMLTableElement).rows[0].cells[2];
                helper.triggerMouseAction(
                    'contextmenu', { x: cell.getBoundingClientRect().left + 1, y: cell.getBoundingClientRect().top + 1 }, null,
                    cell);
                setTimeout((): void => {
                    expect(helper.getElement('#' + helper.id + '_cmenu_insert_column').classList).toContain('e-disabled');
                    expect(helper.getElement('#' + helper.id + '_cmenu_delete_column').classList).toContain('e-disabled');
                    done();
                });
            });
        });
    });
});