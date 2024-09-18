import { SpreadsheetHelper } from '../util/spreadsheethelper.spec';
import { defaultData } from '../util/datasource.spec';
import { ExtendedRowModel, SheetModel, Spreadsheet, getColumnWidth, getRangeAddress  } from '../../../src/index';
import { SpreadsheetModel } from '../../../src/spreadsheet/index';

describe('Resize ->', () => {
    const helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');
    let model: SpreadsheetModel;

    describe('public method ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }], rows: [{ index: 4, height: 100 }, { height: 120 }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        // it('AutoFit', (done: Function) => {
        //     helper.invoke('autoFit', ['A:B']); 
        //     expect(helper.getInstance().sheets[0].columns[0].width).toBe(137);
        //     expect(helper.getInstance().sheets[0].columns[1].width).toBe(72);
        //     expect(getComputedStyle(helper.invoke('getCell', [0,0])).width).toBe('137px');
        //     expect(getComputedStyle(helper.invoke('getCell', [0,1])).width).toBe('72px');

        //     helper.invoke('autoFit', ['5:6']);
        //     expect(helper.getInstance().sheets[0].rows[4].height).toBe(20);
        //     expect(helper.getInstance().sheets[0].rows[5].height).toBe(20);
        //     expect(getComputedStyle(helper.invoke('getCell', [4,0])).height).toBe('20px');
        //     expect(getComputedStyle(helper.invoke('getCell', [5,0])).height).toBe('20px');
        //     helper.getInstance().sheets[0].columns[0].width = 64; // resized column width persist for other test cases
        //     helper.getInstance().sheets[0].columns[1].width = 64;
        //     done();
        // });
    });

    describe('UI Interaction', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }], rows: [{ hidden: true }], columns: [{ hidden: true }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Apply autofit on hidden row which is the first row', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            const rowHdr: HTMLElement = helper.invoke('getRowHeaderTable').rows[0].cells[0];
            const rowHdrPanel: HTMLElement = helper.invoke('getRowHeaderContent');
            const offset: DOMRect = rowHdr.getBoundingClientRect() as DOMRect;
            helper.triggerMouseAction('mousemove', { x: offset.top + 0.5, y: offset.left + 1, offsetY: 3 }, rowHdrPanel, rowHdr);
            helper.triggerMouseAction('dblclick', { x: offset.top + 1, y: offset.left + 1, offsetY: 3 }, rowHdrPanel, rowHdr);
            setTimeout(() => {
                expect(spreadsheet.sheets[0].rows[0].hidden).toBeFalsy();
                done();
            });
        });
        it('Apply autofit on hidden column which is the first column', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            const colHdr: HTMLElement = helper.invoke('getCell', [null, 1, helper.invoke('getColHeaderTable').rows[0]]);
            const hdrPanel: HTMLElement = spreadsheet.element.querySelector('.e-header-panel') as HTMLElement;
            const offset: DOMRect = colHdr.getBoundingClientRect() as DOMRect;
            helper.triggerMouseAction('mousemove', { x: offset.left + 0.5, y: offset.top + 1, offsetX: 3 }, hdrPanel, colHdr);
            helper.triggerMouseAction('dblclick', { x: offset.left + 1, y: offset.top + 1, offsetX: 3 }, hdrPanel, colHdr);
            setTimeout(() => {
                expect(spreadsheet.sheets[0].columns[0].hidden).toBeFalsy();
                done();
            });
        });
        it('Apply autofit on row with protected sheet', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.protectSheet('Price Details',{ selectCells: true, formatRows: true});
            const rowHdr: HTMLElement = helper.invoke('getRowHeaderTable').rows[0].cells[0];
            const rowHdrPanel: HTMLElement = helper.invoke('getRowHeaderContent');
            const offset: DOMRect = rowHdr.getBoundingClientRect() as DOMRect;
            helper.triggerMouseAction('mousemove', { x: offset.top + 0.5, y: offset.left + 1, offsetY: 3 }, rowHdrPanel, rowHdr);
            helper.triggerMouseAction('dblclick', { x: offset.top + 1, y: offset.left + 1, offsetY: 3 }, rowHdrPanel, rowHdr);
            setTimeout(() => {
                expect(spreadsheet.sheets[0].selectedRange).toBe('A1:A1');
                done();
            });
        });
        it('Apply autofit on column with protected sheet', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.unprotectSheet('Price Details');
            setTimeout(() => {
                spreadsheet.protectSheet('Price Details',{ selectCells: true, formatColumns: true});
                const colHdr: HTMLElement = helper.invoke('getCell', [null, 3, helper.invoke('getColHeaderTable').rows[0]]);
                const hdrPanel: HTMLElement = spreadsheet.element.querySelector('.e-header-panel') as HTMLElement;
                const offset: DOMRect = colHdr.getBoundingClientRect() as DOMRect;
                helper.triggerMouseAction('mousemove', { x: offset.left + 0.5, y: offset.top + 1, offsetX: 3 }, hdrPanel, colHdr);
                helper.triggerMouseAction('dblclick', { x: offset.left + 1, y: offset.top + 1, offsetX: 3 }, hdrPanel, colHdr);
                setTimeout((): void => {
                    expect(spreadsheet.sheets[0].selectedRange).toBe('A1:A1');
                    done();
                });
            });
        });
        it('Apply mousedown on hidden row which is the first row', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.unprotectSheet('Price Details');
            setTimeout(() => {
                helper.invoke('hideRow', [0]);
                setTimeout(() => {
                    const spreadsheet: Spreadsheet = helper.getInstance();
                    const rowHdr: HTMLElement = helper.invoke('getRowHeaderTable').rows[0].cells[0];
                    const rowHdrPanel: HTMLElement = helper.invoke('getRowHeaderContent');
                    const offset: DOMRect = rowHdr.getBoundingClientRect() as DOMRect;
                    helper.triggerMouseAction('mousemove', { x: offset.top + 0.5, y: offset.left + 1, offsetY: 3 }, rowHdrPanel, rowHdr);
                    helper.triggerMouseAction('mousedown', { x: offset.left + 1, y: offset.top + 0.5, offsetY: 3 }, rowHdrPanel, rowHdr);
                    helper.triggerMouseAction('mousemove', { x: offset.left + 1, y: offset.top + 0.5, offsetY: 3 }, spreadsheet.element, rowHdr);
                    helper.triggerMouseAction('mouseup', { x: offset.left + 1, y: offset.top + 0.5, offsetY: 3 }, document, rowHdr);
                    setTimeout(() => {
                        expect(spreadsheet.sheets[0].rows[0].hidden).toBeFalsy();
                        done();
                    });
                });
            });
        });
        it('Apply autofit on column which having font style and font family', (done: Function) => {
            helper.invoke('selectRange', ['E1']);
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.cellFormat({ fontFamily: 'Arial Black', fontSize: '14pt' }, 'E1');
            spreadsheet.autoFit('E');
            setTimeout(() => {
                expect(spreadsheet.sheets[0].columns[4].width).toBe(44);
                done();
            });
        });
        it('Apply autofit on row which having font family', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.cellFormat({ fontFamily: 'Arial Black' }, 'A4');
            spreadsheet.autoFit('4');
            setTimeout(() => {
                expect(spreadsheet.sheets[0].rows[3].height).toBe(20);
                done();
            });
        });
        it('Apply autofit on hidden column', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.invoke('selectRange', ['F1']);
            spreadsheet.hideColumn(5, 5, true);
            setTimeout(() => {
                const colHdr: HTMLElement = helper.invoke('getCell', [null, 6, helper.invoke('getColHeaderTable').rows[0]]);
                const hdrPanel: HTMLElement = spreadsheet.element.querySelector('.e-header-panel') as HTMLElement;
                const offset: DOMRect = colHdr.getBoundingClientRect() as DOMRect;
                helper.triggerMouseAction('mousemove', { x: offset.left + 0.5, y: offset.top + 1, offsetX: 3 }, hdrPanel, colHdr);
                helper.triggerMouseAction('dblclick', { x: offset.left + 1, y: offset.top + 1, offsetX: 3 }, hdrPanel, colHdr);
                setTimeout(() => {
                    expect(spreadsheet.sheets[0].columns[5].width).toBe(54);
                    done();
                });
            });
        });
        it('Apply autofit on hidden column with copy indicator', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.invoke('selectRange', ['D1']);
            helper.invoke('copy', ['D1']);
            spreadsheet.hideColumn(3, 3, true);
            setTimeout(() => {
                expect(helper.getElementFromSpreadsheet('.e-copy-indicator')).not.toBeNull();
                spreadsheet.autoFit('D');
                setTimeout(() => {
                    expect(spreadsheet.sheets[0].columns[3].width).toBe(57);
                    expect(helper.getElement().querySelector('.e-copy-indicator').style.width).toBe('65px');
                    done();
                });
            });
        });
        it('Apply autofit on hidden column by selecting whole column', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.invoke('selectRange', ['F1:F200']);
            spreadsheet.hideColumn(5, 5, true);
            setTimeout(() => {
                spreadsheet.autoFit('F');
                setTimeout(() => {
                    expect(spreadsheet.sheets[0].columns[5].width).toBe(54);
                    done();
                });
            });
        });
        it('Apply autofit on hidden column increasing width', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.invoke('selectRange', ['F1:F200']);
            spreadsheet.hideColumn(5, 5, true);
            setTimeout(() => {
                spreadsheet.setColWidth('30', 6, 0);
                setTimeout(() => {
                    expect(spreadsheet.sheets[0].columns[5].width).toBe(54);
                    done();
                });
            });
        });
        it('Apply undo after increasing width in hidden column ', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.invoke('selectRange', ['H1']);
            spreadsheet.hideColumn(7, 7, true);
            setTimeout(() => {
                const colHdrPanel: HTMLElement = helper.invoke('getColumnHeaderContent').parentElement;
                const colHdr: HTMLElement = helper.invoke('getColHeaderTable').rows[0].cells[6];
                const offset: DOMRect = colHdr.getBoundingClientRect() as DOMRect;
                helper.triggerMouseAction('mousemove', { x: offset.left + 1, y: offset.top + 0.5, offsetX: 3 }, colHdrPanel, colHdr);
                helper.triggerMouseAction('mousedown', { x: offset.left, y: offset.top + 1, offsetX: 3 }, colHdrPanel, colHdr);
                helper.triggerMouseAction('mousemove', { x: offset.left + 50, y: offset.top + 1, offsetX: 3 }, spreadsheet.element, colHdr);
                helper.triggerMouseAction('mouseup', { x: offset.left + 50, y: offset.top + 1, offsetX: 3 }, document, colHdr);
                setTimeout(() => {
                    expect(spreadsheet.sheets[0].columns[7].hidden).toBeFalsy();
                    helper.click('#spreadsheet_undo');
                    helper.click('#spreadsheet_undo');
                    helper.click('#spreadsheet_undo');
                    setTimeout(() => {
                        expect(spreadsheet.sheets[0].columns[7].hidden).toBeTruthy();
                        done();
                    });
                });
            });
        });
        it('Apply autofit on rows and columns which contains wrap cell', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.setColWidth(30, 3, 0);
            helper.invoke('updateCell', [{ wrap: true }, 'D2']);
            spreadsheet.autoFit('D');
            expect(spreadsheet.sheets[0].columns[3].width).toBe(58);
            helper.invoke('updateCell', [{ value: 'Text Data Text Data Text Data Text Data Text Data Text Data Text Data' }, 'D2']);
            spreadsheet.setColWidth(228, 3, 0);
            spreadsheet.autoFit('D');
            expect(spreadsheet.sheets[0].columns[3].width).toBe(214);
            expect(spreadsheet.sheets[0].rows[1].height).toBe(256);
            spreadsheet.autoFit('2');
            expect(spreadsheet.sheets[0].rows[1].height).toBe(35);
            spreadsheet.setColWidth(260, 3, 0);
            spreadsheet.autoFit('D');
            expect(spreadsheet.sheets[0].columns[3].width).toBe(245);
            done();
        });
        it('Apply autofit changing the allowResizing property', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            const sheet: SheetModel = spreadsheet.sheets[0];
            const colWidth: number = getColumnWidth(sheet, 1);
            spreadsheet.allowResizing = false;
            spreadsheet.dataBind();
            spreadsheet.autoFit('B:B');
            expect(getColumnWidth(sheet, 1) === colWidth).toBeTruthy();
            spreadsheet.allowResizing = true;
            spreadsheet.dataBind();
            spreadsheet.autoFit('B:B');
            expect(getColumnWidth(sheet, 1) === colWidth).toBeFalsy();
            done();
        });
    });

    describe('UI Interaction for resize with protected sheet', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Apply protect sheet and resize in headers', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.protectSheet('Price Details',{ selectCells: true});
            const rowHdr: HTMLElement = helper.invoke('getRowHeaderTable').rows[0].cells[0];
            const rowHdrPanel: HTMLElement = helper.invoke('getRowHeaderContent');
            const offset: DOMRect = rowHdr.getBoundingClientRect() as DOMRect;
            helper.triggerMouseAction('mousemove', { x: offset.top + 0.5, y: offset.left + 1, offsetY: 3 }, rowHdrPanel, rowHdr);
            helper.triggerMouseAction('dblclick', { x: offset.top + 1, y: offset.left + 1, offsetY: 3 }, rowHdrPanel, rowHdr);
            setTimeout(() => {
                expect(spreadsheet.sheets[0].rows[0].height).toBeUndefined();
                done();
            });
        }); 
        it('Apply protect sheet and format rows as true and checking column resize', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.unprotectSheet('Price Details');
            setTimeout(() => {
                spreadsheet.protectSheet('Price Details',{ selectCells: true, formatRows: true});
                const rowHdr: HTMLElement = helper.invoke('getRowHeaderTable').rows[9].cells[0];
                const rowHdrPanel: HTMLElement = helper.invoke('getRowHeaderContent');
                const offset: DOMRect = rowHdr.getBoundingClientRect() as DOMRect;
                helper.triggerMouseAction('mousemove', { x: offset.top + 0.5, y: offset.left + 1, offsetY: 3 }, rowHdrPanel, rowHdr);
                helper.triggerMouseAction('dblclick', { x: offset.top + 1, y: offset.left + 1, offsetY: 3 }, rowHdrPanel, rowHdr);
                setTimeout(() => {
                    const colHdr: HTMLElement = helper.invoke('getCell', [null, 1, helper.invoke('getColHeaderTable').rows[0]]);
                    const hdrPanel: HTMLElement = spreadsheet.element.querySelector('.e-header-panel') as HTMLElement;
                    const offset: DOMRect = colHdr.getBoundingClientRect() as DOMRect;
                    helper.triggerMouseAction('mousemove', { x: offset.left + 0.5, y: offset.top + 1, offsetX: 3 }, hdrPanel, colHdr);
                    helper.triggerMouseAction('dblclick', { x: offset.left + 1, y: offset.top + 1, offsetX: 3 }, hdrPanel, colHdr);
                    setTimeout(() => {
                        expect(spreadsheet.sheets[0].rows[9].height).toBeUndefined();
                        done();
                    });
                });
            });
        }); 
        it('Apply protect sheet and format columns as true and checking row resize', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.unprotectSheet('Price Details');
            setTimeout(() => {
                spreadsheet.protectSheet('Price Details',{ selectCells: true, formatColumns: true});
                const rowHdr: HTMLElement = helper.invoke('getRowHeaderTable').rows[0].cells[0];
                const rowHdrPanel: HTMLElement = helper.invoke('getRowHeaderContent');
                const offset: DOMRect = rowHdr.getBoundingClientRect() as DOMRect;
                helper.triggerMouseAction('mousemove', { x: offset.top + 0.5, y: offset.left + 1, offsetY: 3 }, rowHdrPanel, rowHdr);
                helper.triggerMouseAction('dblclick', { x: offset.top + 1, y: offset.left + 1, offsetY: 3 }, rowHdrPanel, rowHdr);
                setTimeout(() => {
                    const colHdr: HTMLElement = helper.invoke('getCell', [null, 3, helper.invoke('getColHeaderTable').rows[0]]);
                    const hdrPanel: HTMLElement = spreadsheet.element.querySelector('.e-header-panel') as HTMLElement;
                    const offset: DOMRect = colHdr.getBoundingClientRect() as DOMRect;
                    helper.triggerMouseAction('mousemove', { x: offset.left + 0.5, y: offset.top + 1, offsetX: 3 }, hdrPanel, colHdr);
                    helper.triggerMouseAction('dblclick', { x: offset.left + 1, y: offset.top + 1, offsetX: 3 }, hdrPanel, colHdr);
                    setTimeout(() => {
                        expect(spreadsheet.sheets[0].rows[0].height).toBeUndefined();
                        expect(spreadsheet.sheets[0].columns[2].width).toBe(84);
                        done();
                    });
                });
            });
        }); 
        it('Reduce column to small size and click the column - I', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.unprotectSheet('Price Details');
            setTimeout(() => {
                const colHdrPanel: HTMLElement = helper.invoke('getColumnHeaderContent').parentElement;
                const colHdr: HTMLElement = helper.invoke('getColHeaderTable').rows[0].cells[2];
                const offset: DOMRect = colHdr.getBoundingClientRect() as DOMRect;
                helper.triggerMouseAction('mousemove', { x: offset.left - 1, y: offset.top - 0.5, offsetX: 3 }, colHdrPanel, colHdr);
                helper.triggerMouseAction('mousedown', { x: offset.left, y: offset.top - 1, offsetX: 3 }, colHdrPanel, colHdr);
                helper.triggerMouseAction('mousemove', { x: offset.left - 56, y: offset.top - 1, offsetX: 7 }, spreadsheet.element, colHdr);
                helper.triggerMouseAction('mouseup', { x: offset.left - 56, y: offset.top - 1, offsetX: 7 }, document, colHdr);
                setTimeout(() => {
                    const colHdr: HTMLElement = helper.invoke('getCell', [null, 1, helper.invoke('getColHeaderTable').rows[0]]);
                    let e = new MouseEvent('mousedown', { view: window, bubbles: true, cancelable: true });
                    colHdr.dispatchEvent(e);
                    e = new MouseEvent('mouseup', { view: window, bubbles: true, cancelable: true });
                    colHdr.dispatchEvent(e);
                    e = new MouseEvent('mousemove', { view: window, bubbles: true, cancelable: true });
                    colHdr.dispatchEvent(e);
                    e = new MouseEvent('click', { view: window, bubbles: true, cancelable: true });
                    colHdr.dispatchEvent(e);
                    setTimeout((): void => {
                        expect(spreadsheet.sheets[0].selectedRange).toBe('A1:A1');
                        done();
                    });
                });
            });
        }); 
        it('Reduce column to small size and click the column - II', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.invoke('selectRange', ['C1']);
            setTimeout(() => {
                const colHdr: HTMLElement = helper.invoke('getCell', [null, 1, helper.invoke('getColHeaderTable').rows[0]]);
                let e = new MouseEvent('mousedown', { view: window, bubbles: true, cancelable: true });
                colHdr.dispatchEvent(e);
                e = new MouseEvent('mouseup', { view: window, bubbles: true, cancelable: true });
                colHdr.dispatchEvent(e);
                e = new MouseEvent('mousemove', { view: window, bubbles: true, cancelable: true });
                colHdr.dispatchEvent(e);
                e = new MouseEvent('click', { view: window, bubbles: true, cancelable: true });
                colHdr.dispatchEvent(e);
                setTimeout((): void => {
                    expect(spreadsheet.sheets[0].selectedRange).toBe('C1:C1');
                    done();
                });
            });
        }); 
        it('Reduce row to small size and click the row - I ', (done: Function) => {
            helper.invoke('selectRange', ['A1']);
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.invoke('applyFilter', [[{ field: 'E', predicate: 'or', operator: 'equal', value: '10' }], 'A2:H2']);
            helper.invoke('updateCell', [{ notes: 'Syncfusion' }, 'A2']);
            const rowHdr: HTMLElement = helper.invoke('getRowHeaderTable').rows[2].cells[0];
            const rowHdrPanel: HTMLElement = helper.invoke('getRowHeaderContent');
            const offset: DOMRect = rowHdr.getBoundingClientRect() as DOMRect;
            helper.triggerMouseAction('mousemove', { x: offset.top - 0.5, y: offset.left - 1, offsetY: 3 }, rowHdrPanel, rowHdr);
            helper.triggerMouseAction('mousedown', { x: offset.left - 1, y: offset.top - 0.5, offsetY: 3 }, rowHdrPanel, rowHdr);
            helper.triggerMouseAction('mousemove', { x: offset.left - 1, y: offset.top - 13, offsetY: 7 }, spreadsheet.element, rowHdr);
            helper.triggerMouseAction('mouseup', { x: offset.left - 1, y: offset.top - 13, offsetY: 7 }, document, rowHdr);
            setTimeout(() => {
                const rowHdr: HTMLElement = helper.invoke('getRowHeaderTable').rows[1].cells[0];
                let e = new MouseEvent('mousedown', { view: window, bubbles: true, cancelable: true });
                rowHdr.dispatchEvent(e);
                e = new MouseEvent('mouseup', { view: window, bubbles: true, cancelable: true });
                rowHdr.dispatchEvent(e);
                e = new MouseEvent('mousemove', { view: window, bubbles: true, cancelable: true });
                rowHdr.dispatchEvent(e);
                e = new MouseEvent('click', { view: window, bubbles: true, cancelable: true });
                rowHdr.dispatchEvent(e);
                setTimeout((): void => {
                    expect(spreadsheet.sheets[0].selectedRange).toBe('A1:A1');
                    done();
                });
            });
        });  
        it('Reduce row to small size and click the row - II ', (done: Function) => {
            helper.invoke('selectRange', ['A8']);
            const spreadsheet: Spreadsheet = helper.getInstance();
            const rowHdr: HTMLElement = helper.invoke('getRowHeaderTable').rows[7].cells[0];
            const rowHdrPanel: HTMLElement = helper.invoke('getRowHeaderContent');
            const offset: DOMRect = rowHdr.getBoundingClientRect() as DOMRect;
            helper.triggerMouseAction('mousemove', { x: offset.top - 0.5, y: offset.left - 1, offsetY: 3 }, rowHdrPanel, rowHdr);
            helper.triggerMouseAction('mousedown', { x: offset.left - 1, y: offset.top - 0.5, offsetY: 3 }, rowHdrPanel, rowHdr);
            helper.triggerMouseAction('mousemove', { x: offset.left - 1, y: offset.top - 13, offsetY: 7 }, spreadsheet.element, rowHdr);
            helper.triggerMouseAction('mouseup', { x: offset.left - 1, y: offset.top - 13, offsetY: 7 }, document, rowHdr);
            setTimeout(() => {
                const rowHdr: HTMLElement = helper.invoke('getRowHeaderTable').rows[1].cells[0];
                let e = new MouseEvent('mousedown', { view: window, bubbles: true, cancelable: true });
                rowHdr.dispatchEvent(e);
                e = new MouseEvent('mouseup', { view: window, bubbles: true, cancelable: true });
                rowHdr.dispatchEvent(e);
                e = new MouseEvent('mousemove', { view: window, bubbles: true, cancelable: true });
                rowHdr.dispatchEvent(e);
                e = new MouseEvent('click', { view: window, bubbles: true, cancelable: true });
                rowHdr.dispatchEvent(e);
                setTimeout((): void => {
                    expect(spreadsheet.sheets[0].selectedRange).toBe('A8:A8');
                    done();
                });
            }); 
        }); 
     });

    describe('CR-Issues ->', () => {
        describe('I274109 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ showHeaders: false, rows: [{ cells: [{ value: '100' }, { value: '25' }, { value: '1001' }] }] }]
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            // it('Setting showHeaders to false to hide the Excel-like headers will generate errors (when setting autofit for cols through method)', (done: Function) => {
            //     helper.invoke('autoFit', ['A:C']);
            //     const spreadsheet: Spreadsheet = helper.getInstance();
            //     const row: HTMLTableRowElement = helper.invoke('getContentTable').rows[0];
            //     expect(spreadsheet.sheets[0].columns[0].width).toBe(27);
            //     expect(row.cells[0].getBoundingClientRect().width).toBe(27);
            //     expect(spreadsheet.sheets[0].columns[1].width).toBe(20);
            //     expect(row.cells[1].getBoundingClientRect().width).toBe(20);
            //     expect(spreadsheet.sheets[0].columns[2].width).toBe(35);
            //     expect(row.cells[2].getBoundingClientRect().width).toBe(35);
            //     helper.getInstance().sheets[0].columns[0].width = 64; // resized column width persist for other test cases
            //     helper.getInstance().sheets[0].columns[1].width = 64;
            //     helper.getInstance().sheets[0].columns[2].width = 64;
            //     done();
            // });
        });

        describe('EJ2-66027 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({ enableRtl: true }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Issues on spreadsheet when render the component in RTL mode', (done: Function) => {
                let spreadsheet: Spreadsheet = helper.getInstance();
                let activeCell: HTMLElement = helper.getElementFromSpreadsheet('.e-active-cell');
                const autoFill: HTMLElement = helper.getElementFromSpreadsheet('.e-autofill');
                expect(autoFill.style.top).toBe('15px');
                expect(autoFill.style.right).toBe('59px');
                let td: HTMLElement = helper.invoke('getCell', [12, 0]);
                let coords = td.getBoundingClientRect();
                let autoFillCoords = autoFill.getBoundingClientRect();
                helper.triggerMouseAction('mousedown', { x: autoFillCoords.left + 1, y: autoFillCoords.top + 1 }, null, autoFill);
                helper.getInstance().selectionModule.mouseMoveHandler({ target: autoFill, clientX: autoFillCoords.right, clientY: autoFillCoords.bottom });
                helper.getInstance().selectionModule.mouseMoveHandler({ target: td, clientX: coords.left + 1, clientY: coords.top + 1 });
                helper.triggerMouseAction('mouseup', { x: coords.left + 1, y: coords.top + 1 }, document, td);
                expect(autoFill.style.top).toBe('255px');
                expect(autoFill.style.right).toBe('59px');
                helper.invoke('selectRange', ['A1:A1']);
                expect(activeCell.style.width).toBe('64px');
                expect(spreadsheet.sheets[0].columns[0].width).toBeUndefined();
                const colHdrPanel: HTMLElement = helper.invoke('getColumnHeaderContent').parentElement;
                const colHdr: HTMLElement = helper.invoke('getColHeaderTable').rows[0].cells[0];
                const offset: DOMRect = colHdr.getBoundingClientRect() as DOMRect;
                helper.triggerMouseAction('mousemove', { x: offset.left - 1, y: offset.top + 0.5, offsetX: 3 }, colHdrPanel, colHdr);
                helper.triggerMouseAction('mousedown', { x: offset.left, y: offset.top + 1, offsetX: 3 }, colHdrPanel, colHdr);
                helper.triggerMouseAction('mousemove', { x: offset.left - 50, y: offset.top + 1, offsetX: 3 }, spreadsheet.element, colHdr);
                helper.triggerMouseAction('mouseup', { x: offset.left - 50, y: offset.top + 1, offsetX: 3 }, document, colHdr);
                setTimeout((): void => {
                    expect(activeCell.style.width).toBe('114px');
                    expect(spreadsheet.sheets[0].columns[0].width).toBe(114);
                    done();
                }, 50);
            });
        });
        describe('EJ2-876040->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [
                        {
                            rows: [
                                { cells: [{ value: 'Add Some Content' }] }, { cells: [{ value: '100' }] }, { cells: [{ value: '100' }] }, { cells: [{ value: '100' }] }
                            ]
                        }
                    ]
                }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('Autofit is not working properly when column contains wrap text cell with Bold style', (done: Function) => {
                helper.invoke('setColWidth', [200, 0]);
                helper.invoke('selectRange', ['A1:A4']);
                helper.getElement('#' + helper.id + '_wrap').click();
                helper.invoke('cellFormat', [{ fontSize: '14pt', fontWeight: 'bold' }, 'A1:A4']);
                helper.invoke('autoFit', ['A']);
                setTimeout((): void => {
                    expect(helper.getInstance().sheets[0].columns[0].width).toBe(158);
                    done();
                });
            });
        });
    });
    describe('EJ2-56123 ->', () => {
        beforeEach((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }], columns: [{ width: 150 }, { width: 150 }, { width: 150 }],
                rows: [{ height: 100 }, { height: 120 }, { height: 120 }] }] }, done);
        });
        afterEach(() => {
            helper.invoke('destroy');
        });
        it('Selection misalignment and script error on undo operation after resize the row', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.goTo("A60");
            spreadsheet.setRowHeight(20, 0);
            spreadsheet.setRowHeight(20, 1);
            spreadsheet.setRowHeight(20, 2);
            spreadsheet.selectRange("A1");
            let cellEle: HTMLElement = helper.getElements('.e-active-cell')[0];
            let selectionEle: HTMLElement = helper.getElements('.e-selection')[0];
            setTimeout((): void => {
                expect(cellEle.style.height).toEqual(selectionEle.style.height);
                expect(cellEle.style.top).toEqual(selectionEle.style.top);
                done();
            });
        });
    });
    describe('SF-367016, SF-371460 ->', () => {
        let spreadsheet: Spreadsheet;
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet(
                { sheets: [{ ranges: [{ dataSource: defaultData }], columns: [{ width: 150 }, { width: 150 }, { width: 150, hidden: true }],
                frozenColumns: 2, frozenRows: 2 }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Console error while performing autofit on hidden column which is the first column after the frozen column', (done: Function) => {
            spreadsheet = helper.getInstance();
            const colHdr: HTMLElement = helper.invoke('getCell', [null, 3, helper.invoke('getColHeaderTable').rows[0]]);
            const hdrPanel: HTMLElement = spreadsheet.element.querySelector('.e-header-panel') as HTMLElement;
            const offset: DOMRect = colHdr.getBoundingClientRect() as DOMRect;
            helper.triggerMouseAction('mousemove', { x: offset.left + 0.5, y: offset.top + 1, offsetX: 3 }, hdrPanel, colHdr);
            helper.triggerMouseAction('dblclick', { x: offset.left + 1, y: offset.top + 1, offsetX: 3 }, hdrPanel, colHdr);
            setTimeout((): void => {
                expect(spreadsheet.sheets[0].columns[2].hidden).toBeFalsy();
                done();
            });
        });
        it('Console error while performing autofit on hidden row which is the first row after the frozen row', (done: Function) => {
            helper.invoke(
                'applyFilter', [[{ value: 30, field: 'E', predicate: 'and', operator: 'notequal', type: 'number', matchCase: false,
                ignoreAccent: false }], 'A1:H11']);
            setTimeout((): void => {
                expect(spreadsheet.sheets[0].rows[2].hidden).toBeTruthy();
                expect((spreadsheet.sheets[0].rows[2] as ExtendedRowModel).isFiltered).toBeTruthy();
                const rowHdr: HTMLElement = helper.invoke('getRowHeaderTable').rows[0].cells[0];
                expect(rowHdr.textContent).toBe('4');
                const rowHdrPanel: HTMLElement = helper.invoke('getRowHeaderContent');
                const offset: DOMRect = rowHdr.getBoundingClientRect() as DOMRect;
                helper.triggerMouseAction('mousemove', { x: offset.top + 0.5, y: offset.left + 1, offsetY: 3 }, rowHdrPanel, rowHdr);
                helper.triggerMouseAction('dblclick', { x: offset.top + 1, y: offset.left + 1, offsetY: 3 }, rowHdrPanel, rowHdr);
                setTimeout((): void => {
                    // expect(spreadsheet.sheets[0].rows[2].hidden).toBeFalsy();
                    // expect((spreadsheet.sheets[0].rows[2] as ExtendedRowModel).isFiltered).toBeTruthy();
                    // expect(helper.invoke('getRowHeaderTable').rows[0].cells[0].textContent).toBe('3');
                    // expect(helper.invoke('getContentTable').rows[0].getAttribute('aria-rowindex')).toBe('3');
                    done();
                });
            });
        });
    });
    describe('EJ2-54762, EJ2-51216, EJ2-54009->', () => {
        beforeAll((done: Function) => {
            model = {
                sheets: [{ rows: [{ height: 15 }, { height: 10 }, { height: 8 }, { height: 30 }, ], 
                ranges: [{ dataSource: defaultData }] }]
            }
            helper.initializeSpreadsheet(model, done);
        });
        afterAll(() => {
            helper.invoke('destroy');;
        });
        it('EJ2-54762 - While save(json) and load(json) with resize functionalities, row header and cell selection are misaligned->', (done: Function) => {
            expect(helper.getInstance().sheets[0].rows[0].height).toBe(15);
            expect(helper.getInstance().sheets[0].rows[1].height).toBe(10);
            expect(helper.getInstance().sheets[0].rows[2].height).toBe(8);
            expect(helper.getInstance().sheets[0].rows[3].height).toBe(30);
            done();
        });
        it('EJ2-51216 - Underline and strikethrough not working after performing row resize action', (done: Function) => {
            helper.invoke('selectRange', ['B2']);
            helper.edit('B2', 'one two three four five ');
            helper.getElement('#' + helper.id + '_wrap').click();
            helper.invoke('setRowHeight', [80, 1]);
            helper.invoke('setColWidth', [150, 1]);
            helper.invoke('autoFit', ['2']);
            helper.invoke('autoFit', ['B']);
            helper.invoke('selectRange', ['C1']);
            helper.edit('C1', 'One Two');
            helper.invoke('cellFormat', [{ fontSize: '48pt' }, 'C1']);
            helper.invoke('autoFit', ['1']);
            helper.invoke('cellFormat', [{ fontSize: '9pt' }, 'C1']);
            helper.invoke('autoFit', ['1']);
            setTimeout(function () {
                let cellEle: HTMLElement = helper.getElements('.e-active-cell')[0];
                let selectionEle: HTMLElement = helper.getElements('.e-selection')[0];
                expect(cellEle.style.height).toEqual(selectionEle.style.height);
                done();
            });
        });
        it('EJ2-54009 - Cell selection misalignment issue when copy paste and resize the pasted cell.->', (done: Function) => {
            helper.invoke('selectRange', ['D1']);
            helper.invoke('copy', ['D1']);
            setTimeout(() => {
                expect(helper.getElementFromSpreadsheet('.e-copy-indicator')).not.toBeNull();
                helper.invoke('setRowHeight', [80, 0]);
                helper.invoke('setColWidth', [150, 3]);
                setTimeout(() => {
                    // expect(helper.getElement().querySelector('.e-copy-indicator').style.height).toBe('80px');
                    // expect(helper.getElement().querySelector('.e-copy-indicator').style.width).toBe('151px');
                    done();
                }, 100);
            }, 10);
        });
    });
    describe('EJ2-56260, EJ2-58247->', () => {
        let activeCell: HTMLElement; let spreadsheet: Spreadsheet;
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{ ranges: [{ dataSource: defaultData }] }]
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Row height issue after performing undo operation->', (done: Function) => {
            spreadsheet = helper.getInstance();
            spreadsheet.setRowHeight(10, 0);
            spreadsheet.selectRange("B1:B200");
            helper.getElement('#' + helper.id + '_cut').click();
            setTimeout(() => {
                spreadsheet.insertColumn(2);
                setTimeout(() => {
                    spreadsheet.selectRange("C1");
                    helper.getElement('#' + helper.id + '_paste').click();
                    helper.getElement('#' + helper.id + '_undo').click();
                    setTimeout(() => {
                        expect(helper.getInstance().sheets[0].rows[0].height).toBe(10);
                        done();
                    });
                });
            });
        });
        it('Merged cell selection misalignment on row resize', (done: Function) => {
            helper.invoke('selectRange', ['C7:D8']);
            helper.invoke('merge');
            setTimeout((): void => {
                activeCell = helper.getElementFromSpreadsheet('.e-active-cell');
                expect(activeCell.style.height).toBe('41px');
                expect(spreadsheet.sheets[0].rows[6].height).toBeUndefined();
                const rowHdrPanel: HTMLElement = helper.invoke('getRowHeaderContent');
                const rowHdr: HTMLElement = helper.invoke('getRowHeaderTable').rows[7].cells[0];
                const offset: DOMRect = rowHdr.getBoundingClientRect() as DOMRect;
                helper.triggerMouseAction('mousemove', { x: offset.top + 0.5, y: offset.left + 1, offsetY: 3 }, rowHdrPanel, rowHdr);
                helper.triggerMouseAction('mousedown', { x: offset.left + 1, y: offset.top + 0.5, offsetY: 3 }, rowHdrPanel, rowHdr);
                helper.triggerMouseAction('mousemove', { x: offset.left + 1, y: offset.top + 50, offsetY: 3 }, spreadsheet.element, rowHdr);
                helper.triggerMouseAction('mouseup', { x: offset.left + 1, y: offset.top + 50, offsetY: 3 }, document, rowHdr);
                setTimeout((): void => {
                    // expect(activeCell.style.height).toBe('90px');
                    expect(spreadsheet.sheets[0].rows[6].height).toBe(69);
                    done();
                });
            }, 50);
        });
        it('Merged cell selection misalignment on column resize', (done: Function) => {
            expect(activeCell.style.width).toBe('129px');
            expect(spreadsheet.sheets[0].columns[2].width).toBeUndefined();
            const colHdrPanel: HTMLElement = helper.invoke('getColumnHeaderContent').parentElement;
            const colHdr: HTMLElement = helper.invoke('getColHeaderTable').rows[0].cells[3];
            const offset: DOMRect = colHdr.getBoundingClientRect() as DOMRect;
            helper.triggerMouseAction('mousemove', { x: offset.left + 1, y: offset.top + 0.5, offsetX: 3 }, colHdrPanel, colHdr);
            helper.triggerMouseAction('mousedown', { x: offset.left, y: offset.top + 1, offsetX: 3 }, colHdrPanel, colHdr);
            helper.triggerMouseAction('mousemove', { x: offset.left + 50, y: offset.top + 1, offsetX: 3 }, spreadsheet.element, colHdr);
            helper.triggerMouseAction('mouseup', { x: offset.left + 50, y: offset.top + 1, offsetX: 3 }, document, colHdr);
            setTimeout((): void => {
                expect(activeCell.style.width).toBe('179px');
                expect(spreadsheet.sheets[0].columns[2].width).toBe(114);
                done();
            }, 50);
        });
        it('Merged cell other than active cell row / col resize', (done: Function) => {
            expect(spreadsheet.sheets[0].columns[3]).toBeUndefined();
            helper.invoke('setColWidth', [100, 3]);
            expect(spreadsheet.sheets[0].columns[3].width).toBe(100);
            setTimeout((): void => {
                expect(activeCell.style.width).toBe('215px');
                expect(spreadsheet.sheets[0].rows[7].height).toBeUndefined();
                helper.invoke('setRowHeight', [60, 7]);
                expect(spreadsheet.sheets[0].rows[7].height).toBe(60);
                setTimeout((): void => {
                    expect(activeCell.style.height).toBe('130px');
                    done();
                }, 50);
            }, 50);
        });
    });
    describe('EJ2-60189 ->', () => {
        beforeEach((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }],
                created: (): void => {
                    const spreadsheet: Spreadsheet = helper.getInstance();
                    spreadsheet.hideColumn(1);
                }
            }, done);
        });
        afterEach(() => {
            helper.invoke('destroy');
        });
        it('Selection misalignment occurs while performing autofit when the column is hidden', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.autoFit("A:C");
            let cellEle: HTMLElement = helper.getElements('.e-active-cell')[0];
            let selectionEle: HTMLElement = helper.getElements('.e-selection')[0];
            setTimeout((): void => {
                expect(cellEle.style.width).toEqual(selectionEle.style.width);
                expect(cellEle.style.left).toEqual(selectionEle.style.left);
                done();
            });
        });
    });
    describe('EJ2-61757 ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }],
                created: (): void => {
                    const spreadsheet: Spreadsheet = helper.getInstance();
                    spreadsheet.hideRow(2,4);
                }
            }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Console Error on un hiding rows with outside selected range', (done: Function) => {
            helper.invoke('selectRange', ['B1:B200']);
            setTimeout((): void => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].rows[2].hidden).toBeTruthy();
                expect(spreadsheet.sheets[0].rows[3].hidden).toBeTruthy();
                expect(spreadsheet.sheets[0].rows[4].hidden).toBeTruthy();
                const rowHdr: HTMLElement = helper.invoke('getRowHeaderTable').rows[2].cells[0];
                expect(rowHdr.textContent).toBe('6');
                const rowHdrPanel: HTMLElement = helper.invoke('getRowHeaderContent');
                const offset: DOMRect = rowHdr.getBoundingClientRect() as DOMRect;
                helper.triggerMouseAction('mousemove', { x: offset.top + 0.5, y: offset.left + 1, offsetY: 3 }, rowHdrPanel, rowHdr);
                helper.triggerMouseAction('dblclick', { x: offset.top + 1, y: offset.left + 1, offsetY: 3 }, rowHdrPanel, rowHdr);
                setTimeout((): void => {
                    expect(spreadsheet.sheets[0].rows[4].hidden).toBeFalsy();
                    done();
                });
            });
        });
    });
    describe('EJ2-70281 ->', () => {
        beforeEach((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }], columns: [{ width: 150 }, { width: 150 }, { width: 150 }] }] }, done);
        });
        afterEach(() => {
            helper.invoke('destroy');
        });
        it('Spreadsheet misbehaves when increasing the font size to entire column', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.selectRange("A1:A200");
            spreadsheet.cellFormat({ fontSize: '14pt' }, 'A1:A200');
            setTimeout((): void => {
                expect(helper.invoke('getMainContent').querySelector('.e-virtualable').style.transform).toBe('translate(0px, 0px)');
                expect(spreadsheet.sheets[0].rows[0].cells[0].style.fontSize).toBe('14pt');
                expect(helper.invoke('getRow', [2]).style.height).toBe('25px');
                expect(helper.getInstance().sheets[0].rows[2].height).toBe(25);
                done();
            });
        });
        it('Ensure the spreadsheet misbehaves when increasing the font size and font family to entire column', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.selectRange("A1:A200");
            spreadsheet.cellFormat({ fontFamily: 'Arial Black', fontSize: '14pt' }, 'A1:A200');
            setTimeout((): void => {
                expect(helper.invoke('getMainContent').querySelector('.e-virtualable').style.transform).toBe('translate(0px, 0px)');
                expect(spreadsheet.sheets[0].rows[10].cells[0].style.fontSize).toBe('14pt');
                expect(spreadsheet.sheets[0].rows[30].cells[0].style.fontFamily).toBe('Arial Black');
                expect(helper.invoke('getRow', [2]).style.height).toBe('28px');
                expect(helper.getInstance().sheets[0].rows[2].height).toBe(28);
                done();
            });
        });
        it('Ensure the spreadsheet misbehaves when increasing the font size with apply bold to entire column', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.selectRange("A1:A200");
            spreadsheet.cellFormat({ fontWeight: 'bold', fontSize: '14pt' }, 'A1:A200');
            setTimeout((): void => {
                expect(helper.invoke('getMainContent').querySelector('.e-virtualable').style.transform).toBe('translate(0px, 0px)');
                expect(spreadsheet.sheets[0].rows[0].cells[0].style.fontSize).toBe('14pt');
                expect(spreadsheet.sheets[0].rows[50].cells[0].style.fontWeight).toBe('bold');
                expect(helper.invoke('getRow', [2]).style.height).toBe('25px');
                expect(helper.getInstance().sheets[0].rows[2].height).toBe(25);
                done();
            });
        });
        it('Ensure the spreadsheet misbehaves when increasing the font size with apply font style italic to entire column', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.selectRange("A1:A200");
            spreadsheet.cellFormat({ fontStyle: 'italic', fontSize: '14pt' }, 'A1:A200');
            setTimeout((): void => {
                expect(helper.invoke('getMainContent').querySelector('.e-virtualable').style.transform).toBe('translate(0px, 0px)');
                expect(spreadsheet.sheets[0].rows[10].cells[0].style.fontSize).toBe('14pt');
                expect(spreadsheet.sheets[0].rows[30].cells[0].style.fontStyle).toBe('italic');
                expect(helper.invoke('getRow', [2]).style.height).toBe('25px');
                expect(helper.getInstance().sheets[0].rows[2].height).toBe(25);
                done();
            });
        });
        it('Ensure the spreadsheet misbehaves when increasing the font size with apply font decoration underline to entire column', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.selectRange("A1:A200");
            spreadsheet.cellFormat({ textDecoration: 'underline', fontSize: '14pt' }, 'A1:A200');
            setTimeout((): void => {
                expect(helper.invoke('getMainContent').querySelector('.e-virtualable').style.transform).toBe('translate(0px, 0px)');
                expect(spreadsheet.sheets[0].rows[10].cells[0].style.fontSize).toBe('14pt');
                expect(spreadsheet.sheets[0].rows[30].cells[0].style.textDecoration).toBe('underline');
                expect(helper.invoke('getRow', [2]).style.height).toBe('25px');
                expect(helper.getInstance().sheets[0].rows[2].height).toBe(25);
                done();
            });
        });
        it('Ensure the spreadsheet misbehaves when increasing the font size with apply font decoration strike through to entire column', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.selectRange("A1:A200");
            spreadsheet.cellFormat({ textDecoration: 'underline line-through', fontSize: '14pt' }, 'A1:A200');
            setTimeout((): void => {
                expect(helper.invoke('getMainContent').querySelector('.e-virtualable').style.transform).toBe('translate(0px, 0px)');
                expect(spreadsheet.sheets[0].rows[10].cells[0].style.fontSize).toBe('14pt');
                expect(spreadsheet.sheets[0].rows[30].cells[0].style.textDecoration).toBe('underline line-through');
                expect(helper.invoke('getRow', [2]).style.height).toBe('25px');
                expect(helper.getInstance().sheets[0].rows[2].height).toBe(25);
                done();
            });
        });
        it('Ensure the spreadsheet misbehaves when increasing the font size with apply conditional formatting through to entire column', (done: Function) => {
            helper.invoke('conditionalFormat', [{ type: 'BlueDataBar', range: 'F1:F100' }]);
            helper.invoke('conditionalFormat', [{ type: 'GreenDataBar', range: 'G1:G100' }]);
            helper.invoke('conditionalFormat', [{ type: 'ThreeArrows', range: 'D2:D11' }]);
            expect(helper.invoke('getCell', [2, 5]).getElementsByClassName('e-databar')[1].style.height).toBe('17px');
            expect(helper.invoke('getCell', [2, 6]).getElementsByClassName('e-databar')[1].style.height).toBe('17px');
            const cell: HTMLElement = helper.invoke('getCell', [2, 5]);
            expect(cell.style.fontSize).toBe('');
            helper.invoke('cellFormat', [{ fontSize: '14pt' }, 'Sheet1!F1:F100']);
            helper.invoke('cellFormat', [{ fontSize: '14pt' }, 'Sheet1!G1:G100']);
            helper.invoke('cellFormat', [{ fontSize: '14pt' }, 'Sheet1!H1:H100']);
            expect(helper.invoke('getCell', [2, 5]).getElementsByClassName('e-databar')[1].style.height).toBe('100%');
            expect(helper.invoke('getCell', [2, 6]).getElementsByClassName('e-databar')[1].style.height).toBe('100%');
            expect(helper.getInstance().sheets[0].rows[2].height).toBe(25);
            expect(cell.style.fontSize).toBe('14pt');
            done();
        });
        it('Ensure the spreadsheet misbehaves when increasing the row heigth using setRowsHeight method', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.setRowsHeight(40, ['1:50'])
            setTimeout((): void => {
                expect(helper.invoke('getMainContent').querySelector('.e-virtualable').style.transform).toBe('translate(0px, 0px)');
                expect(helper.invoke('getRow', [2]).style.height).toBe('40px');
                expect(helper.getInstance().sheets[0].rows[2].height).toBe(40);
                done();
            });
        });
        it('Ensure the spreadsheet misbehaves when increasing the font size with apply wrap text to entire column', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.invoke('selectRange', ['A1:A100']);
            helper.click('#spreadsheet_wrap');
            setTimeout((): void => {
                spreadsheet.cellFormat({ fontSize: '14pt' }, 'A1:A200');
                expect(helper.invoke('getMainContent').querySelector('.e-virtualable').style.transform).toBe('translate(0px, 0px)');
                let td: Element = helper.invoke('getCell', [3, 0]);
                expect(td.classList).toContain('e-wraptext');
                expect(td.parentElement.style.height).toBe('25px');
                expect(spreadsheet.sheets[0].rows[0].cells[0].style.fontSize).toBe('14pt');
                let secondtd: Element = helper.invoke('getCell', [15, 0]);
                expect(secondtd.classList).toContain('e-wraptext');
                expect(secondtd.parentElement.style.height).toBe('20px');
                expect(spreadsheet.sheets[0].rows[15].cells[0].style.fontSize).toBe('14pt');
                let thirdTd: Element = helper.invoke('getCell', [4, 0]);
                expect(thirdTd.classList).toContain('e-wraptext');
                expect(thirdTd.parentElement.style.height).toBe('25px');
                expect(spreadsheet.sheets[0].rows[4].cells[0].style.fontSize).toBe('14pt');
                done();
            });
        });
        it('Ensure the spreadsheet misbehaves when increasing the font size with apply borders to entire column', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.setBorder({ borderLeft: '3px solid #e0e0e0' }, 'A1:A50');
            spreadsheet.setBorder({ borderRight: '3px solid #e0e0e0' }, 'A1:A50');
            spreadsheet.setBorder({ borderTop: '3px solid #e0e0e0' }, 'A1:A50');
            spreadsheet.setBorder({ borderBottom: '3px solid #e0e0e0' }, 'A1:A50');
            helper.invoke('selectRange', ['A1:A100']);
            setTimeout((): void => {
                spreadsheet.cellFormat({ fontSize: '14pt' }, 'A1:A100');
                expect(spreadsheet.sheets[0].rows[3].cells[0].style.borderLeft).toBe('3px solid #e0e0e0');
                expect(spreadsheet.sheets[0].rows[4].cells[0].style.borderLeft).toBe('3px solid #e0e0e0');
                expect(spreadsheet.sheets[0].rows[4].cells[0].style.fontSize).toBe('14pt');
                done();
            });
        });
        it('In freeze pane ensure the spreadsheet misbehaves when increasing the font size to entire column', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.invoke('freezePanes', [3, 3]);
            setTimeout((): void => {
                spreadsheet.cellFormat({ fontSize: '14pt' }, 'A1:A100');
                expect(helper.invoke('getMainContent').querySelector('.e-virtualable').style.transform).toBe('translate(0px, 0px)');
                expect(spreadsheet.sheets[0].rows[0].cells[0].style.fontSize).toBe('14pt');
                expect(helper.invoke('getRow', [0]).style.height).toBe('25px');
                expect(spreadsheet.sheets[0].rows[10].cells[0].style.fontSize).toBe('14pt');
                expect(helper.invoke('getRow', [10]).style.height).toBe('25px');
                done();
            });
        });
    });
    describe('EJ2-70281 => Increase the font size in finite mode', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ rowCount: 150, colCount: 15, ranges: [{ dataSource: defaultData }] }], scrollSettings: { isFinite: true } }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Spreadsheet misbehaves when increasing the font size to entire column', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.selectRange("A1:A200");
            spreadsheet.cellFormat({ fontSize: '14pt' }, 'A1:A100');
            setTimeout((): void => {
                expect(helper.invoke('getMainContent').querySelector('.e-virtualable').style.transform).toBe('translate(0px, 0px)');
                expect(spreadsheet.sheets[0].rows[0].cells[0].style.fontSize).toBe('14pt');
                expect(helper.invoke('getRow', [2]).style.height).toBe('25px');
                expect(helper.getInstance().sheets[0].rows[2].height).toBe(25);
                done();
            });
        });
    });
    describe('EJ2-859445 ->', () => {
        beforeEach((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }],
                created: (): void => {
                    const spreadsheet: Spreadsheet = helper.getInstance();
                    spreadsheet.setRowsHeight(20, ['5:10']);
                }
            }, done);
        });
        afterEach(() => {
            helper.invoke('destroy');
        });
        it('Selection issue occurs while apply the cosmic Sans font family with the custom height applied rows', (done: Function) => {
            helper.getInstance().cellFormat({ fontFamily: 'Comic Sans MS' }, 'A5:A10');
            expect(helper.invoke('getCell', [9, 0]).style.lineHeight).not.toBe('');
            done();
        });
    });

    describe('Checking update action method for resize to fit ->', () => {
        beforeEach((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterEach(() => {
            helper.invoke('destroy');
        });
        it('resizeToFit Column from update action', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.invoke('selectRange', ['F1']);
            helper.openAndClickCMenuItem(0, 5, [8], null, true);
            setTimeout(() => {
                expect(spreadsheet.sheets[0].columns[5].hidden).toBeTruthy();
                let args = { action: 'resizeToFit', eventArgs: { sheetIndex: 0, index: 5, isCol: true } };
                helper.getInstance().updateAction(args);
                setTimeout(() => {
                    expect(spreadsheet.sheets[0].columns[5].hidden).toBeFalsy();
                    done();
                });
            });
        });
        it('resizeToFit Row from update action', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            helper.invoke('selectRange', ['A6']);
            helper.openAndClickCMenuItem(5, 0, [8], true);
            setTimeout(() => {
                expect(spreadsheet.sheets[0].rows[5].hidden).toBeTruthy();
                let args = { action: 'resizeToFit', eventArgs: { sheetIndex: 0, index: 5, isCol: false } };
                helper.getInstance().updateAction(args);
                setTimeout(() => {
                    expect(spreadsheet.sheets[0].rows[8].hidden).toBeFalsy();
                    done();
                });
            });
        });
    });
    describe('Resize in protect sheet with protect settings formatRows and formatColumns as true individually ->', () => {
        beforeEach((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterEach(() => {
            helper.invoke('destroy');
        });
        it('Resize in protect sheet with protect settings formatColumns as true', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.protectSheet('Sheet1', { selectCells: true, formatColumns: true, formatRows: false });
            const rowHdr: HTMLElement = helper.invoke('getRowHeaderTable').rows[0].cells[0];
            const rowHdrPanel: HTMLElement = helper.invoke('getRowHeaderContent');
            const offset: DOMRect = rowHdr.getBoundingClientRect() as DOMRect;
            helper.triggerMouseAction('mousemove', { x: offset.top + 0.5, y: offset.left + 1, offsetY: 3 }, rowHdrPanel, rowHdr);
            helper.triggerMouseAction('dblclick', { x: offset.top + 1, y: offset.left + 1, offsetY: 3 }, rowHdrPanel, rowHdr);
            setTimeout(() => {
                expect(spreadsheet.activeSheetIndex).toEqual(0);
                helper.invoke('unprotectSheet', ['Sheet1']);
                done();
            });
        });
        it('Resize in protect sheet with protect settings formatRows as true', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.protectSheet('Sheet1', { selectCells: true, formatColumns: false, formatRows: true });
            const colHdr: HTMLElement = helper.invoke('getCell', [null, 1, helper.invoke('getColHeaderTable').rows[0]]);
            const hdrPanel: HTMLElement = spreadsheet.element.querySelector('.e-header-panel') as HTMLElement;
            const offset: DOMRect = colHdr.getBoundingClientRect() as DOMRect;
            helper.triggerMouseAction('mousemove', { x: offset.left + 0.5, y: offset.top + 1, offsetX: 3 }, hdrPanel, colHdr);
            helper.triggerMouseAction('dblclick', { x: offset.left + 1, y: offset.top + 1, offsetX: 3 }, hdrPanel, colHdr);
            setTimeout(() => {
                expect(spreadsheet.activeSheetIndex).toEqual(0);
                done();
            });
        });
    });
    describe('Resize with args.cancel as true in actionBegin event ->', () => {
        beforeEach((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{ ranges: [{ dataSource: defaultData }] }], actionBegin: (args: {
                    args: {
                        eventArgs: any; cancel: boolean
                    }
                }) => {
                    args.args.eventArgs.cancel = true;
                },
            }, done);
        });
        afterEach(() => {
            helper.invoke('destroy');
        });
        it('Resize with args.cancel as true in actionBegin event. ->', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            const colHdr: HTMLElement = helper.invoke('getCell', [null, 1, helper.invoke('getColHeaderTable').rows[0]]);
            const hdrPanel: HTMLElement = spreadsheet.element.querySelector('.e-header-panel') as HTMLElement;
            const offset: DOMRect = colHdr.getBoundingClientRect() as DOMRect;
            helper.triggerMouseAction('mousemove', { x: offset.left + 0.5, y: offset.top + 1, offsetX: 3 }, hdrPanel, colHdr);
            helper.triggerMouseAction('dblclick', { x: offset.left + 1, y: offset.top + 1, offsetX: 3 }, hdrPanel, colHdr);
            setTimeout(() => {
                expect(spreadsheet.activeSheetIndex).toEqual(0);
                done();
            });
        });
    });
    describe('Resize with args.autoFitWithHeader as true in actionBegin event ->', () => {
        beforeEach((done: Function) => {
            helper.initializeSpreadsheet({
                sheets: [{ ranges: [{ dataSource: defaultData }] }], actionBegin: (args: {
                    args: {
                        eventArgs: any;
                    }
                }) => {
                    args.args.eventArgs.autoFitWithHeader = true;
                },
            }, done);
        });
        afterEach(() => {
            helper.invoke('destroy');
        });
        it('Resize with args.autoFitWithHeader as true in actionBegin event. ->', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            const colHdr: HTMLElement = helper.invoke('getCell', [null, 1, helper.invoke('getColHeaderTable').rows[0]]);
            const hdrPanel: HTMLElement = spreadsheet.element.querySelector('.e-header-panel') as HTMLElement;
            const offset: DOMRect = colHdr.getBoundingClientRect() as DOMRect;
            helper.triggerMouseAction('mousemove', { x: offset.left + 0.5, y: offset.top + 1, offsetX: 3 }, hdrPanel, colHdr);
            helper.triggerMouseAction('dblclick', { x: offset.left + 1, y: offset.top + 1, offsetX: 3 }, hdrPanel, colHdr);
            setTimeout(() => {
                expect(spreadsheet.activeSheetIndex).toEqual(0);
                done();
            });
        });
    });
    describe('Resize in the hidden rows and columns ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Resize in the hidden rows.', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.hideRow(0,0,true);
            const rowHdr: HTMLElement = helper.invoke('getRowHeaderTable').rows[0].cells[0];
            const rowHdrPanel: HTMLElement = helper.invoke('getRowHeaderContent');
            const offset: DOMRect = rowHdr.getBoundingClientRect() as DOMRect;
            helper.triggerMouseAction('mousemove', { x: offset.top - 0.5, y: offset.left - 1, offsetY: 3 }, rowHdrPanel, rowHdr);
            helper.triggerMouseAction('mousedown', { x: offset.left - 1, y: offset.top - 0.5, offsetY: 3 }, rowHdrPanel, rowHdr);
            helper.triggerMouseAction('mousemove', { x: offset.left - 1, y: offset.top + 10, offsetY: 7 }, spreadsheet.element, rowHdr);
            helper.triggerMouseAction('mouseup', { x: offset.left - 1, y: offset.top + 10, offsetY: 7 }, document, rowHdr);
            setTimeout(() => {
                expect(spreadsheet.activeSheetIndex).toEqual(0);
                done();
            });
        });
        it('Resize the row till it is hidden.', (done: Function) => {
            helper.invoke('selectRange', ['A8']);
            const spreadsheet: Spreadsheet = helper.getInstance();
            const rowHdr: HTMLElement = helper.invoke('getRowHeaderTable').rows[7].cells[0];
            const rowHdrPanel: HTMLElement = helper.invoke('getRowHeaderContent');
            const offset: DOMRect = rowHdr.getBoundingClientRect() as DOMRect;
            helper.triggerMouseAction('mousemove', { x: offset.top - 0.5, y: offset.left - 1, offsetY: 3 }, rowHdrPanel, rowHdr);
            helper.triggerMouseAction('mousedown', { x: offset.left - 1, y: offset.top - 0.5, offsetY: 3 }, rowHdrPanel, rowHdr);
            helper.triggerMouseAction('mousemove', { x: offset.left - 1, y: offset.top - 30, offsetY: 7 }, spreadsheet.element, rowHdr);
            helper.triggerMouseAction('mouseup', { x: offset.left - 1, y: offset.top - 30, offsetY: 7 }, document, rowHdr);
            setTimeout(() => {
                expect(spreadsheet.activeSheetIndex).toEqual(0);
                done();
            });
        });
        it('Resize the column till it is hidden.', (done: Function) => {
            const spreadsheet: Spreadsheet = helper.getInstance();
            const colHdrPanel: HTMLElement = helper.invoke('getColumnHeaderContent').parentElement;
            const colHdr: HTMLElement = helper.invoke('getColHeaderTable').rows[0].cells[2];
            const offset: DOMRect = colHdr.getBoundingClientRect() as DOMRect;
            helper.triggerMouseAction('mousemove', { x: offset.left - 1, y: offset.top - 0.5, offsetX: 3 }, colHdrPanel, colHdr);
            helper.triggerMouseAction('mousedown', { x: offset.left, y: offset.top - 1, offsetX: 3 }, colHdrPanel, colHdr);
            helper.triggerMouseAction('mousemove', { x: offset.left - 76, y: offset.top - 1, offsetX: 7 }, spreadsheet.element, colHdr);
            helper.triggerMouseAction('mouseup', { x: offset.left - 76, y: offset.top - 1, offsetX: 7 }, document, colHdr);
            setTimeout(() => {
                expect(spreadsheet.activeSheetIndex).toEqual(0);
                done();
            });
        });
        it('Resize the row till with merged cell.', (done: Function) => {
            helper.invoke('selectRange', ['A10:D100']);
            const spreadsheet: Spreadsheet = helper.getInstance();
            spreadsheet.applyFilter();
            spreadsheet.merge('B10:E10', 'Horizontally')
            setTimeout(() => {
                helper.invoke('wrap', ['B10']);
                const colHdr: HTMLElement = helper.invoke('getColHeaderTable').rows[0].cells[1];
                const hdrPanel: HTMLElement = spreadsheet.element.querySelector('.e-header-panel') as HTMLElement;
                const offset: DOMRect = colHdr.getBoundingClientRect() as DOMRect;
                helper.triggerMouseAction('mousemove', { x: offset.left + 0.5, y: offset.top + 1, offsetX: 3 }, hdrPanel, colHdr);
                helper.triggerMouseAction('dblclick', { x: offset.left + 1, y: offset.top + 1, offsetX: 3 }, hdrPanel, colHdr);
                setTimeout(() => {
                    expect(spreadsheet.activeSheetIndex).toEqual(0);
                    done();
                });
            });
        });
    });
});
