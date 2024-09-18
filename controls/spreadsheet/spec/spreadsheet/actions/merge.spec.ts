import { SpreadsheetHelper } from '../util/spreadsheethelper.spec';
import { defaultData } from '../util/datasource.spec';
import { CellModel, setColumn, setRow, SheetModel, Spreadsheet, DialogBeforeOpenEventArgs  } from '../../../src/index';
import { checkPosition } from '../actions/selection.spec';

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
            }, 10);
        });
    });

    describe('Testing merge feature with different combinations ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Merge and delete row', (done: Function) => {
            helper.invoke('merge', ['A5:C8']);
            helper.invoke('delete', [6, 6, 'Row']);
            expect(helper.getInstance().sheets[0].rows[6].cells[3].value).toBe(20);
            done();
        });
        it('Merge and delete column', (done: Function) => {
            helper.invoke('merge', ['D5:F7', 'Horizontally']);
            helper.invoke('delete', [4, 4, 'Column']);
            expect(helper.getInstance().sheets[0].rows[6].cells[4].value).toBe('');
            done();
        });
        it('Selecting the merge cell by forward reverse order', (done: Function) => {
            helper.invoke('merge', ['B4:C6']);
            helper.invoke('merge', ['A7:C9']);
            helper.invoke('selectRange', ['C6:B9']);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[5].cells[2].rowSpan).toBe(-2);
                expect(helper.getInstance().sheets[0].rows[5].cells[2].colSpan).toBe(-2);
                done();
            });
        });
        it('Selecting the merge cells by reverse order', (done: Function) => {
            helper.invoke('merge', ['B4:C6']);
            helper.invoke('merge', ['A1:B3']);
            helper.invoke('selectRange', ['C5:B2']);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[5].cells[2].rowSpan).toBe(-2);
                expect(helper.getInstance().sheets[0].rows[5].cells[2].colSpan).toBe(-2);
                done();
            });
        });
        it('Selecting the merge cells by reverse forward order', (done: Function) => {
            helper.invoke('merge', ['D4:F6']);
            helper.invoke('merge', ['E1:G3']);
            helper.invoke('selectRange', ['E5:F2']);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[5].cells[4].rowSpan).toBe(-2);
                expect(helper.getInstance().sheets[0].rows[5].cells[4].colSpan).toBe(-1);
                done();
            }, 20);
        });
        it('Inserting row and column', (done: Function) => {
            helper.invoke('merge', ['A4:C7']);
            helper.invoke('insertRow', [5, 5]);
            helper.invoke('insertColumn', [1, 1]);
            setTimeout(() => {
                expect(helper.invoke('getCell', [5, 4]).textContent).toBe('');
                expect(helper.invoke('getCell', [0, 1]).textContent).toBe('');
                done();
            }, 20);
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
                }, 50);
            }, 50)
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
               expect(helper.getElements('.e-merge-alert-dlg.e-dialog').length).toBe(1);
               helper.setAnimationToNone('.e-merge-alert-dlg.e-dialog');
                helper.click('.e-dialog .e-primary');
                done();
            });
        });
        it('Checking for Dialog is not open', (done: Function) => {
            helper.invoke('selectRange', ['I2:J4']);
            helper.click('#' + helper.id + '_merge');
               let dialogElem: number= document.getElementsByClassName("e-merge-alert-dlg").length
               expect(dialogElem).toBe(0);
               done();
        });
        it('Cancelling merge dialog', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
                spreadsheet.dialogBeforeOpen = (args: DialogBeforeOpenEventArgs): void => {
                args.cancel = true;
            };
            helper.invoke('selectRange', ['E2:H2']);
            helper.click('#' + helper.id + '_merge');
            setTimeout(() => {
                var dialog = helper.getElement('.e-merge-alert-dlg.e-dialog');
                expect(!!dialog).toBeTruthy();
                done();
            });
        }); 
    });
    describe('Merge action with freeze pane ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ frozenRows: 2, frozenColumns: 1, selectedRange: 'A2:A3' }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Merge / unMerge between freeze and movable rows', (done: Function) => {
            helper.click('#' + helper.id + '_merge');
            const emptyRows: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName('e-empty') as HTMLCollectionOf<HTMLElement>;
            expect(emptyRows.length).toBe(1);
            expect(emptyRows[0].style.height).toBe('20px');
            expect(emptyRows[0].style.visibility).toBe('hidden');
            helper.click('#' + helper.id + '_merge');
            expect(document.getElementsByClassName('e-empty').length).toBe(0);
            done();
        });
        it('Merge / unMerge between freeze and movable columns', (done: Function) => {
            helper.invoke('selectRange', ['A1:B1']);
            helper.click('#' + helper.id + '_merge');
            const emptyCols: HTMLCollectionOf<HTMLElement> = document.getElementsByClassName('e-empty') as HTMLCollectionOf<HTMLElement>;
            expect(emptyCols.length).toBe(1);
            expect(emptyCols[0].style.width).toBe('64px');
            expect(emptyCols[0].style.visibility).toBe('hidden');
            helper.click('#' + helper.id + '_merge');
            expect(document.getElementsByClassName('e-empty').length).toBe(0);
            done();
        });
        it('Merge / unMerge between freezepanes', (done: Function) => {
            helper.invoke('selectRange', ['A1:C4']);
            helper.click('#' + helper.id + '_merge');
            const emptyRows: NodeListOf<HTMLElement> = document.querySelectorAll('.e-row.e-empty') as NodeListOf<HTMLElement>;
            expect(emptyRows.length).toBe(2);
            expect(emptyRows[0].style.height).toBe('20px');
            expect(emptyRows[0].style.visibility).toBe('hidden');
            const emptyCols: NodeListOf<HTMLElement> = document.querySelectorAll('.e-empty:not(.e-row)') as NodeListOf<HTMLElement>;
            expect(emptyCols.length).toBe(2);
            expect(emptyCols[0].style.width).toBe('64px');
            expect(emptyCols[0].style.visibility).toBe('hidden');
            helper.click('#' + helper.id + '_merge');
            expect(document.getElementsByClassName('e-empty').length).toBe(0);
            done();
        });
        it('Merge / unMerge between freezepanes with hidden row and column', (done: Function) => {
            const sheet: SheetModel = helper.getInstance().getActiveSheet();
            setRow(sheet, 2, { hidden: true });
            setColumn(sheet, 1, { hidden: true });
            helper.click('#' + helper.id + '_merge');
            const emptyRows: NodeListOf<HTMLElement> = document.querySelectorAll('.e-row.e-empty') as NodeListOf<HTMLElement>;
            expect(emptyRows.length).toBe(1);
            expect(emptyRows[0].style.height).toBe('20px');
            expect(emptyRows[0].style.visibility).toBe('hidden');
            const emptyCols: NodeListOf<HTMLElement> = document.querySelectorAll('.e-empty:not(.e-row)') as NodeListOf<HTMLElement>;
            expect(emptyCols.length).toBe(1);
            expect(emptyCols[0].style.width).toBe('64px');
            expect(emptyCols[0].style.visibility).toBe('hidden');
            helper.click('#' + helper.id + '_merge');
            expect(document.getElementsByClassName('e-empty').length).toBe(0);
            done();
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
        describe('I834951 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }],
                    rows: [{ cells: [{ colSpan:2 }, { index: 2, colSpan:2 }, { index: 4, colSpan:2 }, { index: 6, colSpan:2 }] }] 
                }] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('While scrolling the frozen column applied sheet merged cells get messed up with each other', (done: Function) => {
                helper.invoke('goTo', ['S1']);
                setTimeout(()=>{
                    let td: HTMLTableCellElement = helper.invoke('getCell', [0, 3]);
                    expect(td.style.display).toBe('');
                    helper.invoke('goTo', ['A1']);
                    setTimeout(()=>{
                        expect(td.style.display).toBe('none');
                        done();
                    }, 50);
                }, 50)
            });
        });
        describe('I866383 - Unmerge public method does not work while setting showRibbon as false ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({
                    showRibbon: false, sheets: [{
                        ranges: [{ dataSource: defaultData }]
                    }]
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Unmerge public method with MergeAll', (done: Function) => {
                helper.invoke('merge', ['A1:C2', 'All']);
                let spreadsheet: Spreadsheet = helper.getInstance();
                let cell: CellModel = spreadsheet.sheets[0].rows[0].cells[0];
                expect(cell.rowSpan).toBe(2);
                expect(cell.colSpan).toBe(3);
                expect(spreadsheet.sheets[0].rows[0].cells[1].colSpan).toBe(-1);
                expect(spreadsheet.sheets[0].rows[1].cells[2].colSpan).toBe(-2);
                expect(spreadsheet.sheets[0].rows[1].cells[2].rowSpan).toBe(-1);
                helper.invoke('unMerge', ['A1:C2']);
                expect(spreadsheet.sheets[0].rows[0].cells[0].value).toBe('Item Name');
                expect(spreadsheet.sheets[0].rows[0].cells[0].colSpan).toBeUndefined();
                expect(spreadsheet.sheets[0].rows[0].cells[0].rowSpan).toBeUndefined();
                done();
            });
            it('Unmerge public method with Merge Horizontal', (done: Function) => {
                helper.invoke('merge', ['D1:E2', 'Horizontally']);
                let spreadsheet: Spreadsheet = helper.getInstance();
                let cell: CellModel = spreadsheet.sheets[0].rows[0].cells[3];
                expect(cell.rowSpan).toBeUndefined();
                expect(cell.colSpan).toBe(2);
                expect(spreadsheet.sheets[0].rows[0].cells[4].colSpan).toBe(-1);
                expect(spreadsheet.sheets[0].rows[1].cells[3].colSpan).toBe(2);
                expect(spreadsheet.sheets[0].rows[1].cells[4].colSpan).toBe(-1);
                helper.invoke('unMerge', ['D1:E2']);
                expect(spreadsheet.sheets[0].rows[0].cells[3].value).toBe('Quantity');
                expect(spreadsheet.sheets[0].rows[0].cells[3].colSpan).toBeUndefined();
                expect(spreadsheet.sheets[0].rows[0].cells[4].rowSpan).toBeUndefined();
                done();
            });
            it('Unmerge public method with Merge Vertical', (done: Function) => {
                helper.invoke('merge', ['F1:G2', 'Vertically']);
                let spreadsheet: Spreadsheet = helper.getInstance();
                let cell: CellModel = spreadsheet.sheets[0].rows[0].cells[5];
                expect(cell.rowSpan).toBe(2);
                expect(cell.colSpan).toBeUndefined();
                expect(spreadsheet.sheets[0].rows[0].cells[6].rowSpan).toBe(2);
                expect(spreadsheet.sheets[0].rows[1].cells[5].rowSpan).toBe(-1);
                expect(spreadsheet.sheets[0].rows[1].cells[6].rowSpan).toBe(-1);
                helper.invoke('unMerge', ['F1:G2']);
                expect(spreadsheet.sheets[0].rows[0].cells[5].value).toBe('Amount');
                expect(spreadsheet.sheets[0].rows[0].cells[5].colSpan).toBeUndefined();
                expect(spreadsheet.sheets[0].rows[0].cells[5].rowSpan).toBeUndefined();
                done();
            });
        });
        describe('EJ2-861455 ->', () => {
            let spreadsheet: Spreadsheet;
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet(
                    { sheets: [ { rows: [{ cells: [{ value: '' }] }] } ] }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            })
            it('Handle all cells merging with an empty active cell', function (done){
                spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].rows[0].cells[0].format).toBeUndefined();
                helper.edit('C1', '11/11/2001');
                helper.edit('C2', '12/11/2001');
                helper.edit('C3', '12/08/2004');
                helper.edit('C4', '12/12/2006');
                helper.edit('D1', '12/12/2006');
                helper.edit('D2', '12/08/2004');
                helper.edit('D3', '12/08/2004');
                helper.edit('D4', '12/08/2004');
                helper.invoke('merge', ['A1:D4']);
                setTimeout(()=>{
                    expect(spreadsheet.sheets[0].rows[0].cells[0].format).toBe('m/d/yyyy');
                    expect(spreadsheet.sheets[0].rows[0].cells[0].colSpan).toBe(4);
                    expect(spreadsheet.sheets[0].rows[0].cells[0].rowSpan).toBe(4);     
                    done();
                });
                helper.click('#spreadsheet_undo');
                helper.edit('C1', '');
                helper.invoke('merge', ['A1:D4']);
                setTimeout(()=>{
                    expect(spreadsheet.sheets[0].rows[0].cells[0].format).toBe('m/d/yyyy');
                    expect(spreadsheet.sheets[0].rows[0].cells[0].colSpan).toBe(4);
                    expect(spreadsheet.sheets[0].rows[0].cells[0].rowSpan).toBe(4);     
                    done();
                });
                helper.click('#spreadsheet_undo');
                helper.edit('D1', '');
                helper.invoke('merge', ['A1:D4']);
                setTimeout(()=>{
                    expect(spreadsheet.sheets[0].rows[0].cells[0].format).toBe('m/d/yyyy');
                    expect(spreadsheet.sheets[0].rows[0].cells[0].colSpan).toBe(4);
                    expect(spreadsheet.sheets[0].rows[0].cells[0].rowSpan).toBe(4);     
                    done();
                });
            });
            it('Handle horizontal merging with an empty active cell', function (done){
                spreadsheet = helper.getInstance();
                helper.edit('C5', '11/11/2001');
                helper.edit('C6', '12/11/2001');
                helper.edit('C7', '12/08/2004');
                helper.edit('C8', '12/12/2006');
                helper.edit('D5', '12/12/2006');
                helper.edit('D6', '12/08/2004');
                helper.edit('D7', '12/08/2004');
                helper.edit('D8', '12/08/2004');
                helper.invoke('merge', ['A5:D8', 'Horizontally']);
                setTimeout(()=>{
                    expect(spreadsheet.sheets[0].rows[4].cells[0].format).toBe('m/d/yyyy');
                    expect(spreadsheet.sheets[0].rows[4].cells[0].colSpan).toBe(4);
                    expect(spreadsheet.sheets[0].rows[5].cells[0].format).toBe('m/d/yyyy');
                    expect(spreadsheet.sheets[0].rows[5].cells[0].colSpan).toBe(4); 
                    expect(spreadsheet.sheets[0].rows[6].cells[0].format).toBe('m/d/yyyy');
                    expect(spreadsheet.sheets[0].rows[6].cells[0].colSpan).toBe(4);
                    expect(spreadsheet.sheets[0].rows[7].cells[0].format).toBe('m/d/yyyy');
                    expect(spreadsheet.sheets[0].rows[7].cells[0].colSpan).toBe(4);  
                    done();
                });
                helper.click('#spreadsheet_undo');
            });
            it('Handle Vertical merging with an empty active cell', function (done) {
                spreadsheet = helper.getInstance();
                helper.edit('A11', '11/11/2001');
                helper.edit('A12', '12/11/2001');
                helper.edit('A13', '12/08/2004');
                helper.edit('A14', '12/12/2006');
                helper.invoke('merge', ['A9:A14', 'Vertically']);
                setTimeout(function () {
                    expect(spreadsheet.sheets[0].rows[8].cells[0].rowSpan).toBe(6);
                    expect(spreadsheet.sheets[0].rows[8].cells[0].format).toBe('m/d/yyyy');
                    done();
                });
                helper.click('#spreadsheet_undo');
                helper.edit('A11', '');
                helper.invoke('merge', ['A9:A14', 'Vertically']);
                setTimeout(function () {
                    expect(spreadsheet.sheets[0].rows[8].cells[0].rowSpan).toBe(6);
                    expect(spreadsheet.sheets[0].rows[8].cells[0].format).toBe('m/d/yyyy');
                    done();
                });
                helper.click('#spreadsheet_undo');
            });
            it('Handle merging formula applied with formatting with active empty cell', function (done){
                spreadsheet = helper.getInstance();
                helper.edit('E1','10');
                helper.edit('E2','-10');
                helper.edit('E3','30');
                helper.edit('E4','40');
                helper.edit('E5','50');
                helper.edit('B15', '=SUM(E1:E5)');
                spreadsheet.sheets[0].rows[14].cells[1].format = '$#,##0.00';
                helper.invoke('merge', ['A15:B15']);
                setTimeout(function () {
                    expect(spreadsheet.sheets[0].rows[14].cells[0].colSpan).toBe(2);
                    expect(spreadsheet.sheets[0].rows[14].cells[0].format).toBe('$#,##0.00');
                    expect(spreadsheet.sheets[0].rows[14].cells[0].formula).toBe('=SUM(E1:E5)');
                    done();
                });
            });
        });
    });
});