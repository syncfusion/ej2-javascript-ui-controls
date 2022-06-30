import { SpreadsheetHelper } from "../util/spreadsheethelper.spec";
import { defaultData } from '../util/datasource.spec';
import { CellModel, Spreadsheet } from "../../../src/index";
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
        let spreadsheet: Spreadsheet;
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Merge', (done: Function) => {
            helper.invoke('merge', ['A1:C2']);
            spreadsheet = helper.getInstance();
            let cell: CellModel = spreadsheet.sheets[0].rows[0].cells[0];
            expect(cell.rowSpan).toBe(2);
            expect(cell.colSpan).toBe(3);
            expect(spreadsheet.sheets[0].rows[0].cells[1].colSpan).toBe(-1);
            expect(spreadsheet.sheets[0].rows[1].cells[2].colSpan).toBe(-2);
            expect(spreadsheet.sheets[0].rows[1].cells[2].rowSpan).toBe(-1);
            let td: HTMLTableCellElement = helper.invoke('getCell', [0, 0]);
            expect(td.getAttribute('rowspan')).toBe('2');
            expect(td.getAttribute('colspan')).toBe('3');
            expect(helper.invoke('getCell', [0, 1]).style.display).toBe('none');
            expect(helper.invoke('getCell', [1, 2]).style.display).toBe('none');

            helper.invoke('merge', ['E4:G6', 'Horizontally']);
            cell = spreadsheet.sheets[0].rows[3].cells[4];
            expect(cell.colSpan).toBe(3);
            expect(cell.rowSpan).toBeUndefined();
            expect(spreadsheet.sheets[0].rows[3].cells[6].colSpan).toBe(-2);
            expect(spreadsheet.sheets[0].rows[4].cells[4].colSpan).toBe(3);
            td = helper.invoke('getCell', [3, 4]);
            expect(td.colSpan).toBe(3);
            expect(td.rowSpan).toBe(1);
            expect(helper.invoke('getCell', [3, 5]).style.display).toBe('none');
            expect(helper.invoke('getCell', [3, 6]).style.display).toBe('none');

            helper.invoke('merge', ['B5:C7', 'Vertically']);
            cell = spreadsheet.sheets[0].rows[4].cells[1];
            expect(cell.rowSpan).toBe(3);
            expect(cell.colSpan).toBeUndefined();
            expect(spreadsheet.sheets[0].rows[6].cells[1].rowSpan).toBe(-2);
            expect(spreadsheet.sheets[0].rows[4].cells[2].rowSpan).toBe(3);
            td = helper.invoke('getCell', [4, 1]);
            expect(td.colSpan).toBe(1);
            expect(td.rowSpan).toBe(3);
            expect(helper.invoke('getCell', [5, 1]).style.display).toBe('none');
            expect(helper.invoke('getCell', [6, 1]).style.display).toBe('none');
            helper.invoke('selectRange', ['A1']);
            setTimeout(() => {
                done();
            });
        });

        it('Copy paste of merged range', (done: Function) => {
            helper.invoke('copy').then(() => {
                checkPosition(helper.getElementFromSpreadsheet('.e-active-cell'), ['0px', '0px', '40px', '192px']);
                helper.invoke('selectRange', ['K2']);
                helper.invoke('paste', ['K2']);
                setTimeout(() => {
                    const cell: CellModel = spreadsheet.sheets[0].rows[1].cells[10];
                    expect(cell.value).toEqual('Item Name');
                    expect(cell.colSpan).toBe(3);
                    expect(cell.rowSpan).toBe(2);
                    expect(spreadsheet.sheets[0].rows[2].cells[12].colSpan).toBe(-2);
                    expect(spreadsheet.sheets[0].rows[2].cells[10].rowSpan).toBe(-1);
                    const td: HTMLTableCellElement = helper.invoke('getCell', [1, 10]);
                    expect(td.rowSpan).toBe(2);
                    expect(td.colSpan).toBe(3);
                    expect(helper.invoke('getCell', [1, 11]).style.display).toBe('none');
                    expect(helper.invoke('getCell', [2, 12]).style.display).toBe('none');
                    helper.invoke('selectRange', ['B5:C5']);
                    setTimeout(() => {
                        done();
                    });
                });
            });
        });
        it('Cut paste of merged range', (done: Function) => {
            helper.invoke('cut').then(() => {
                checkPosition(helper.getElementFromSpreadsheet('.e-active-cell'), ['79px', '63px', '61px', '65px']);
                checkPosition(helper.getElementFromSpreadsheet('.e-selection'), ['79px', '63px', '61px', '129px']);
                helper.invoke('selectRange', ['E10']);
                helper.invoke('paste', ['E10']);
                setTimeout(() => {
                    let cell: CellModel = helper.getInstance().sheets[0].rows[9].cells[4];
                    expect(cell.value as any).toBe(41964);
                    expect(cell.colSpan).toBeUndefined();
                    expect(cell.rowSpan).toBe(3);
                    expect(spreadsheet.sheets[0].rows[10].cells[4].rowSpan).toBe(-1);
                    cell = spreadsheet.sheets[0].rows[9].cells[5];
                    expect(cell.value as any).toBe(0.2665972222222222);
                    expect(cell.colSpan).toBeUndefined();
                    expect(cell.rowSpan).toBe(3);
                    expect(spreadsheet.sheets[0].rows[11].cells[5].rowSpan).toBe(-2);
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
                }, 10);
            }, 10)
        });
    });

    describe('Checking for Dialog open  ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Checking for Dialog open', (done: Function) => {
            helper.invoke('selectRange', ['B2:D4']);
            helper.click('#' + helper.id + '_merge');
            setTimeout(() => {
               let dialogElem: number= document.getElementsByClassName("e-merge-alert-dlg").length
               expect(dialogElem).toBe(1);
                helper.click('.e-dialog .e-primary');
                done();
            });
            
        });
    });
    describe('Checking for Dialog not open  ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Checking for Dialog is not open', (done: Function) => {
            helper.invoke('selectRange', ['I2:J4']);
            helper.click('#' + helper.id + '_merge');
               let dialogElem: number= document.getElementsByClassName("e-merge-alert-dlg").length
               expect(dialogElem).toBe(0);
               done();
        });
    });
    describe('Apply merge cell for freeze pane row  ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Apply merge cell for freeze pane row', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.freezePanes(2,1,0);
            setTimeout(function () {
            helper.invoke('selectRange', ['A2:A3']);
            helper.click('#' + helper.id + '_merge');
            setTimeout(() => {
                 helper.click('.e-dialog .e-primary');
                 let emptyElem:number = document.getElementsByClassName("e-empty").length;
                 expect(emptyElem).toBe(1);
                 done();
             });
            });
        });
    });
    describe('Apply merge cell for freeze pane column ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Apply merge cell for freeze pane column', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.freezePanes(2,1,0);
            setTimeout(function () {
            helper.invoke('selectRange', ['A1:B1']);
            helper.click('#' + helper.id + '_merge');
            setTimeout(() => {
                 helper.click('.e-dialog .e-primary');
                 let emptyElem:number = document.getElementsByClassName("e-empty").length;
                 expect(emptyElem).toBe(1);
                 done();
             });
            });
        });
    });
    describe('Apply merge cell for freeze pane column and row ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Apply merge cell for freeze pane column and row', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.freezePanes(2,1,0);
            setTimeout(function () {
            helper.invoke('selectRange', ['A1:B4']);
            helper.click('#' + helper.id + '_merge');
            setTimeout(() => {
                 helper.click('.e-dialog .e-primary');
                 let emptyElem:number = document.getElementsByClassName("e-empty").length;
                 expect(emptyElem).toBe(3);
                 document.getElementsByClassName("e-sheet-content")[0].parentElement.scrollTop = 400;
                 setTimeout(() => {
                    document.getElementsByClassName("e-sheet-content")[0].parentElement.scrollTop = 0;
                    setTimeout(() => {
                 expect(spreadsheet.sheets[0].frozenColumns).toBe(1);
                 expect(spreadsheet.sheets[0].frozenRows).toBe(2);
                 done();
                    });
                 });
             });
            });
        });
    });

    describe('CR-Issues ->', () => {
        describe('I316931, I309395, FB23943 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet(
                    { sheets: [{ rows: [{ cells: [{ value: 'test' }] }], selectedRange: 'A1:B2' }] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Need to improve the wrap text with merge cells for pasted data', (done: Function) => {
                helper.invoke('merge');
                helper.invoke('cellFormat', [{ backgroundColor: '#ffff00' }]);
                helper.invoke('copy').then((): void => {
                    helper.invoke('selectRange', ['C4']);
                    setTimeout((): void => {
                        helper.invoke('paste', ['Sheet1!C4:C4']);
                        setTimeout((): void => {
                            const spreadsheet: Spreadsheet = helper.getInstance();
                            expect(spreadsheet.sheets[0].rows[3].cells[2].rowSpan).toEqual(2);
                            expect(spreadsheet.sheets[0].rows[3].cells[2].colSpan).toEqual(2);
                            expect(spreadsheet.sheets[0].rows[3].cells[2].value).toEqual('test');
                            expect(spreadsheet.sheets[0].rows[3].cells[2].style.backgroundColor).toEqual('#ffff00');
                            expect(spreadsheet.sheets[0].rows[3].cells[3].colSpan).toBe(-1);
                            expect(spreadsheet.sheets[0].rows[3].cells[3].style.backgroundColor).toEqual('#ffff00');
                            expect(spreadsheet.sheets[0].rows[4].cells[2].rowSpan).toBe(-1);
                            expect(spreadsheet.sheets[0].rows[4].cells[2].style.backgroundColor).toEqual('#ffff00');
                            expect(spreadsheet.sheets[0].rows[3].cells[4]).toBeUndefined();
                            done();
                        });
                    });
                });
            });

            it('Outside border is removed on merge cell', (done: Function) => {
                helper.invoke('merge', ['C1:D3']);
                helper.invoke('setBorder', [{ border: '1px solid #000000' }, 'C1:D3', 'Outer']);
                const td: HTMLElement = helper.invoke('getCell', [0, 2]);
                expect(td.style.borderRight).toBe('1px solid rgb(0, 0, 0)');
                expect(td.style.borderBottom).toBe('1px solid rgb(0, 0, 0)');
                helper.invoke('selectRange', ['C1']);
                helper.click('#' + helper.id + '_merge');
                expect(td.style.borderRight).toBe('');
                // expect(td.style.borderBottom).toBe(''); // Fails only on CI - Check
                expect(helper.invoke('getCell', [0, 3]).style.borderRight).toBe('1px solid rgb(0, 0, 0)');
                // expect(helper.invoke('getCell', [2, 2]).style.borderBottom).toBe('1px solid rgb(0, 0, 0)'); // Fails only on CI - Check
                done();
            });

            it('Applying merge on outside border', (done: Function) => {
                helper.invoke('setBorder', [{ border: '1px solid #000000' }, 'F2:G4', 'Outer']);
                helper.invoke('merge', ['F2:G4']);
                expect(helper.getInstance().sheets[0].rows[1].cells[5].style.borderRight).toBeUndefined();
                expect(helper.getInstance().sheets[0].rows[1].cells[5].style.borderBottom).toBeUndefined();
                expect(helper.getInstance().sheets[0].rows[1].cells[6].style.borderRight).toBe('1px solid #000000');
                expect(helper.getInstance().sheets[0].rows[3].cells[6].style.borderBottom).toBe('1px solid #000000');
                const td: HTMLElement = helper.invoke('getCell', [1, 5]);
                expect(td.style.borderRight).toBe('1px solid rgb(0, 0, 0)');
                expect(td.style.borderBottom).toBe('1px solid rgb(0, 0, 0)');
                helper.invoke('selectRange', ['F2']);
                helper.click('#' + helper.id + '_merge');
                expect(td.style.borderBottom).toBe('');
                expect(td.style.borderRight).toBe('');
                expect(helper.invoke('getCell', [3, 5]).style.borderBottom).toBe('1px solid rgb(0, 0, 0)');
                expect(helper.invoke('getCell', [1, 6]).style.borderRight).toBe('1px solid rgb(0, 0, 0)');
                done();
            });
        });
    });
});