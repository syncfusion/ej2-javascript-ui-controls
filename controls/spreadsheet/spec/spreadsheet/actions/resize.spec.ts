import { SpreadsheetHelper } from '../util/spreadsheethelper.spec';
import { defaultData } from '../util/datasource.spec';
import { ExtendedRowModel, Spreadsheet } from '../../../src/index';

describe('Resize ->', () => {
    const helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');

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
            },1000);
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
                    expect(spreadsheet.sheets[0].rows[2].hidden).toBeFalsy();
                    expect((spreadsheet.sheets[0].rows[2] as ExtendedRowModel).isFiltered).toBeTruthy();
                    expect(helper.invoke('getRowHeaderTable').rows[0].cells[0].textContent).toBe('3');
                    expect(helper.invoke('getContentTable').rows[0].getAttribute('aria-rowindex')).toBe('3');
                    done();
                });
            });
        });
    });
});