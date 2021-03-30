import { SpreadsheetHelper } from "../util/spreadsheethelper.spec";
import { defaultData } from '../util/datasource.spec';
import { CellModel } from "../../../src/index";
import { checkPosition } from "../actions/selection.spec";

describe('Merge ->', () => {
    const helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');


    describe('API ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }], rows: [{ cells: [{ rowSpan: 2, colSpan: 3 }] }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('', (done: Function) => {
            const cell: CellModel = helper.getInstance().sheets[0].rows[0].cells[0];
            expect(cell.rowSpan).toBe(2);
            expect(cell.colSpan).toBe(3);
            expect(helper.getInstance().sheets[0].rows[0].cells[1].colSpan).toBe(-1);
            expect(helper.getInstance().sheets[0].rows[1].cells[2].colSpan).toBe(-2);
            expect(helper.getInstance().sheets[0].rows[1].cells[2].rowSpan).toBe(-1);
            const td: HTMLTableCellElement = helper.invoke('getCell', [0, 0]);
            expect(td.getAttribute('rowspan')).toBe('2');
            expect(td.getAttribute('colspan')).toBe('3');
            expect(helper.invoke('getCell', [0, 1]).style.display).toBe('none');
            expect(helper.invoke('getCell', [1, 2]).style.display).toBe('none');
            done();
        });
    });

    describe('public method ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('', (done: Function) => {
            helper.invoke('merge', ['A1:C2']);
            let cell: CellModel = helper.getInstance().sheets[0].rows[0].cells[0];
            expect(cell.rowSpan).toBe(2);
            expect(cell.colSpan).toBe(3);
            expect(helper.getInstance().sheets[0].rows[0].cells[1].colSpan).toBe(-1);
            expect(helper.getInstance().sheets[0].rows[1].cells[2].colSpan).toBe(-2);
            expect(helper.getInstance().sheets[0].rows[1].cells[2].rowSpan).toBe(-1);
            let td: HTMLTableCellElement = helper.invoke('getCell', [0, 0]);
            expect(td.getAttribute('rowspan')).toBe('2');
            expect(td.getAttribute('colspan')).toBe('3');
            expect(helper.invoke('getCell', [0, 1]).style.display).toBe('none');
            expect(helper.invoke('getCell', [1, 2]).style.display).toBe('none');

            helper.invoke('merge', ['E4:G6', 'Horizontally']);
            cell = helper.getInstance().sheets[0].rows[3].cells[4];
            expect(cell.colSpan).toBe(3);
            expect(cell.rowSpan).toBeUndefined();
            expect(helper.getInstance().sheets[0].rows[3].cells[6].colSpan).toBe(-2);
            expect(helper.getInstance().sheets[0].rows[4].cells[4].colSpan).toBe(3);
            td = helper.invoke('getCell', [3, 4]);
            expect(td.colSpan).toBe(3);
            expect(td.rowSpan).toBe(1);
            expect(helper.invoke('getCell', [3, 5]).style.display).toBe('none');
            expect(helper.invoke('getCell', [3, 6]).style.display).toBe('none');

            helper.invoke('merge', ['B5:C7', 'Vertically']);
            cell = helper.getInstance().sheets[0].rows[4].cells[1];
            expect(cell.rowSpan).toBe(3);
            expect(cell.colSpan).toBeUndefined();
            expect(helper.getInstance().sheets[0].rows[6].cells[1].rowSpan).toBe(-2);
            expect(helper.getInstance().sheets[0].rows[4].cells[2].rowSpan).toBe(3);
            td = helper.invoke('getCell', [4, 1]);
            expect(td.colSpan).toBe(1);
            expect(td.rowSpan).toBe(3);
            expect(helper.invoke('getCell', [5, 1]).style.display).toBe('none');
            expect(helper.invoke('getCell', [6, 1]).style.display).toBe('none');
            done();
        });

        it('Selection & Clipboard', (done: Function) => {
            helper.invoke('selectRange', ['A1']);

            helper.invoke('copy').then(() => {
                checkPosition(helper.getElementFromSpreadsheet('.e-active-cell'), ['0px', '0px', '40px', '192px']);
                helper.invoke('selectRange', ['K2']);
                helper.invoke('paste', ['K2']);
                helper.invoke('getData', ['Sheet1!K2']).then((values: Map<string, CellModel>) => {
                    expect(values.get('K2').value).toEqual('Item Name');
                    expect(values.get('K2').colSpan).toBe(3);
                    expect(values.get('K2').rowSpan).toBe(2);
                    expect(helper.getInstance().sheets[0].rows[2].cells[12].colSpan).toBe(-2);
                    expect(helper.getInstance().sheets[0].rows[2].cells[10].rowSpan).toBe(-1);
                    const td: HTMLTableCellElement = helper.invoke('getCell', [1, 10]);
                    expect(td.rowSpan).toBe(2);
                    expect(td.colSpan).toBe(3);
                    expect(helper.invoke('getCell', [1, 11]).style.display).toBe('none');
                    expect(helper.invoke('getCell', [2, 12]).style.display).toBe('none');

                    // Cut paste for merged range
                    helper.invoke('selectRange', ['B5:C5']);
                    setTimeout(() => {
                        helper.invoke('cut').then(() => {
                            checkPosition(helper.getElementFromSpreadsheet('.e-active-cell'), ['79px', '63px', '61px', '65px']);
                            checkPosition(helper.getElementFromSpreadsheet('.e-selection'), ['79px', '63px', '61px', '129px']);
                            helper.invoke('selectRange', ['E10']);
                            helper.invoke('paste', ['E10']);
                            helper.invoke('getData', ['Sheet1!E10:F12']).then((values: any) => {
                                expect(values.get('E10').value).toBe(41964);
                                expect(values.get('E10').colSpan).toBeUndefined();
                                expect(values.get('E10').rowSpan).toBe(3);
                                expect(values.get('E11').rowSpan).toBe(-1);
                                expect(values.get('F10').value).toBe(0.2665972222222222);
                                expect(values.get('F10').colSpan).toBeUndefined();
                                expect(values.get('F10').rowSpan).toBe(3);
                                expect(values.get('F12').rowSpan).toBe(-2);
                                const td: HTMLTableCellElement = helper.invoke('getCell', [9, 5]);
                                expect(td.colSpan).toBe(1);
                                expect(td.rowSpan).toBe(3);
                                expect(helper.invoke('getCell', [10, 5]).style.display).toBe('none');
                                expect(helper.invoke('getCell', [11, 5]).style.display).toBe('none');
                                done();
                            });
                        });
                    });
                });
            });
        });
    });

    describe('UI Interaction ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });

        it('', (done: Function) => {
            // Forward reverse (selection from left to right)
            helper.invoke('selectRange', ['C9:B10']);
            helper.click('#' + helper.id + '_merge');
            let cell: CellModel = helper.getInstance().sheets[0].rows[8].cells[1];
            expect(cell.rowSpan).toBe(2);
            expect(cell.colSpan).toBe(2);
            expect(helper.getInstance().sheets[0].rows[8].cells[2].colSpan).toBe(-1);
            expect(helper.getInstance().sheets[0].rows[9].cells[2].colSpan).toBe(-1);
            expect(helper.getInstance().sheets[0].rows[9].cells[2].rowSpan).toBe(-1);
            let td: HTMLTableCellElement = helper.invoke('getCell', [8, 1]);
            expect(td.colSpan).toBe(2);
            expect(td.rowSpan).toBe(2);
            expect(helper.invoke('getCell', [9, 2]).style.display).toBe('none');

            // Reverse forward (selection from bottom to top)
            helper.invoke('selectRange', ['H12:I10']);
            helper.click('#' + helper.id + '_merge');
            cell = helper.getInstance().sheets[0].rows[9].cells[7];
            expect(cell.rowSpan).toBe(3);
            expect(cell.colSpan).toBe(2);
            expect(helper.getInstance().sheets[0].rows[9].cells[8].colSpan).toBe(-1);
            expect(helper.getInstance().sheets[0].rows[11].cells[8].colSpan).toBe(-1);
            expect(helper.getInstance().sheets[0].rows[11].cells[8].rowSpan).toBe(-2);
            td = helper.invoke('getCell', [9, 7]);
            expect(td.colSpan).toBe(2);
            expect(td.rowSpan).toBe(3);
            expect(helper.invoke('getCell', [10, 7]).style.display).toBe('none');
            done();
        });

        it('Merge in hidden column', (done: Function) => {
            // Hide column which contains merged cell
            helper.invoke('hideColumn', [2]);
            let td: HTMLTableCellElement = helper.invoke('getCell', [8, 1]);
            expect(td.colSpan).toBe(1);
            expect(td.rowSpan).toBe(2);

            // Merging over the hidden column
            helper.invoke('selectRange', ['B2:D4']);
            helper.click('#' + helper.id + '_merge');
            setTimeout(() => {
                helper.click('.e-dialog .e-primary');
                td = helper.invoke('getCell', [1, 1]);
                expect(td.colSpan).toBe(2);
                expect(td.rowSpan).toBe(3);

                // Hide column on merge cell
                helper.invoke('hideColumn', [1]);
                td = helper.invoke('getCell', [1, 1]);
                //expect(td.colSpan).toBe(1); // This case need to be fixed
                //expect(td.rowSpan).toBe(2);
                done();
            });
        });

        it('Merge in hidden row', (done: Function) => {
            // Hide row which contains merge cell
            helper.invoke('hideRow', [2]);
            setTimeout(() => {
                // let td: HTMLTableCellElement = helper.invoke('getCell', [1, 1]); // This case need to be fixed
                let td: HTMLTableCellElement = helper.invoke('getCell', [1, 3]);
                expect(td.colSpan).toBe(1);
                expect(td.rowSpan).toBe(2);

                // Merging over the hidden row
                helper.invoke('selectRange', ['G2:H5']);
                helper.click('#' + helper.id + '_merge');
                setTimeout(() => {
                    helper.click('.e-dialog .e-primary');
                    td = helper.invoke('getCell', [1, 6]);
                    expect(td.colSpan).toBe(2);
                    expect(td.rowSpan).toBe(3);

                    helper.invoke('hideRow', [1]);
                    setTimeout(() => {
                        // td = helper.invoke('getCell', [1, 6]); // This case need to be fixed
                        td = helper.invoke('getCell', [3, 6]);
                        expect(td.colSpan).toBe(2);
                        expect(td.rowSpan).toBe(2);
                        done();
                    });
                });
            });
        });

        it('Merge cell on row wise scrolling', (done: Function) => {
            helper.invoke('merge', ['J1:J20']);
            helper.getContentElement().parentElement.scrollTop = 400;
            setTimeout(()=>{
                // let td: HTMLTableCellElement = helper.invoke('getCell', [7, 9]); // This case need to be fixed
                const td: HTMLTableCellElement = helper.invoke('getCell', [3, 9]);
                //expect(td.rowSpan).toBe(17);
                helper.getContentElement().parentElement.scrollTop = 0;
                setTimeout(()=>{
                    // expect(td.rowSpan).toBe(1); // This case need to be fixed
                    // expect(helper.invoke('getCell', [0, 9]).rowSpan).toBe(18); // Check this now
                    done();
                });
            })
        });

        it('Merge cell on column wise scrolling', (done: Function) => {
            helper.invoke('merge', ['A12:I15']);
            helper.invoke('goTo', ['W1']);
            setTimeout(()=>{
                let td: HTMLTableCellElement = helper.invoke('getCell', [9, 7]);
                expect(td.colSpan).toBe(2);
                expect(td.rowSpan).toBe(6);
                helper.invoke('goTo', ['A1']);
                setTimeout(()=>{
                    expect(td.rowSpan).toBe(1);
                    expect(td.colSpan).toBe(1); 
                    td = helper.invoke('getCell', [9, 0]);
                    expect(td.rowSpan).toBe(6);
                    expect(td.colSpan).toBe(7);
                    done();
                });
            })
        });
    });
});