import { SpreadsheetHelper } from "../util/spreadsheethelper.spec";
import { defaultData } from '../util/datasource.spec';
import { SheetModel, getRangeAddress, Spreadsheet } from "../../../src/index";

describe('Cell Format ->', () => {
    let helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');


    describe('API ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }], rows: [{ cells:[{ style: { fontSize: '9pt', fontFamily: 'Georgia', fontWeight: 'normal', fontStyle: 'normal', textAlign: 'left' } }] }] }], cellStyle: { fontSize: '14pt', fontFamily: 'Courier', fontWeight: 'bold', fontStyle: 'italic', textAlign: 'center' } }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('', (done: Function) => {
            let td: HTMLElement = helper.invoke('getCell', [0, 0]);
            expect(td.style.fontSize).toBe('9pt');
            expect(td.style.fontFamily).toBe('Georgia');
            expect(td.style.fontWeight).toBe('normal');
            expect(td.style.fontStyle).toBe('normal');
            expect(td.style.textAlign).toBe('left');

            td = helper.invoke('getCell', [0, 1]);
            expect(td.style.fontSize).toBe('14pt');
            expect(td.style.fontFamily).toBe('Courier');
            expect(td.style.fontWeight).toBe('bold');
            expect(td.style.fontStyle).toBe('italic');
            expect(td.style.textAlign).toBe('center');
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
        it('Border', (done: Function) => {
            helper.invoke('cellFormat', [{ border: '1px solid #000' }, 'A1']);
            let td: HTMLElement = helper.invoke('getCell', [0, 0]);
            expect(td.style.borderWidth).toBe('1px');
            expect(td.style.borderStyle).toBe('solid');
            expect(td.style.borderColor).toBe('rgb(0, 0, 0)');

            helper.invoke('cellFormat', [{ border: '1px solid red' }, 'C1']);
            td = helper.invoke('getCell', [0, 2]);
            expect(td.style.borderTop).toBe('1px solid red');
            expect(td.style.borderRight).toBe('1px solid red');
            expect(td.style.borderBottom).toBe('1px solid red');
            expect(td.style.borderLeft).toBe('');
            expect(helper.invoke('getCell', [0, 1]).style.borderRight).toBe('1px solid red');

            helper.invoke('cellFormat', [{ border: '2px solid #eb4034' }, 'B5']);
            td = helper.invoke('getCell', [4, 1]);
            expect(td.style.borderTop).toBe('');
            expect(td.style.borderLeft).toBe('');
            expect(td.style.borderRight).toBe('2px solid rgb(235, 64, 52)');
            expect(td.style.borderBottom).toBe('2px solid rgb(235, 64, 52)');
            expect(helper.invoke('getCell', [3, 1]).style.borderBottom).toBe('2px solid rgb(235, 64, 52)');
            expect(helper.invoke('getCell', [4, 0]).style.borderRight).toBe('2px solid rgb(235, 64, 52)');
            done();
        });

        it('Border are not removed after undo when selection is in reverse', (done: Function) => {
            helper.invoke('selectRange', ['D3:C2']);
            helper.click('#spreadsheet_borders');
            helper.click('.e-borders-menu ul li:nth-child(5)');
            helper.click('#spreadsheet_undo');
            expect(helper.invoke('getCell', [1, 3]).style.borderRight).toBe('');
            expect(helper.invoke('getCell', [2, 3]).style.borderRight).toBe('');
            expect(helper.invoke('getCell', [2, 3]).style.borderBottom).toBe('');
            expect(helper.invoke('getCell', [2, 2]).style.borderBottom).toBe('');
            done();
        });
    });

    describe('CR-Issues ->', () => {
        describe('fb22572 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({ cellStyle: { fontSize: '8pt' }, sheets: [{ rows: [{ index: 3, cells:
                    [{ index: 3, value: 'test' }] }], selectedRange: 'D4' }] }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Cell size is getting changed after applying border', (done: Function) => {
                helper.getElement('#' + helper.id + '_borders').click();
                helper.getElement('.e-menu-item[aria-label="Outside Borders"]').click();
                expect(helper.getInstance().sheets[0].rows[2]).toBeNull();
                expect(helper.getInstance().sheets[0].rows[3].height).toBeUndefined();
                expect(helper.invoke('getRow', [2]).style.height).toBe('20px');
                expect(helper.invoke('getRow', [3]).style.height).toBe('20px');
                done();
            });
        });
        describe('fb21556, fb21625 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ rows: [{ cells: [{ value: 'Item Name' }] }] }] }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            // it('When wrap text is applied to the cell, horizontal/vertical alignment is not working properly', (done: Function) => {
            //     helper.invoke('setRowHeight', [100]);
            //     helper.invoke('setColWidth', [150]);
            //     helper.getElement('#' + helper.id + '_wrap').click();
            //     helper.getElement('#' + helper.id + '_vertical_align').click();
            //     helper.getElement('#' + helper.id + '_vertical_align-popup .e-item:nth-child(2)').click();
            //     const wrapContent: HTMLElement = helper.invoke('getCell', [0, 0]).querySelector('.e-wrap-content');
            //     expect(getComputedStyle(wrapContent).bottom).toBe('33px');
            //     expect(getComputedStyle(wrapContent).transform).toBe('matrix(1, 0, 0, 1, 0, -8.5)');
            //     expect(getComputedStyle(wrapContent).left).toBe('0px');
            //     helper.getElement('#' + helper.id + '_vertical_align').click();
            //     helper.getElement('#' + helper.id + '_vertical_align-popup .e-item').click();
            //     expect(getComputedStyle(wrapContent).transform).toBe('none');
            //     expect(getComputedStyle(wrapContent).top).toBe('0px');
            //     helper.getElement('#' + helper.id + '_wrap').click();
            //     done();
            // });
        });
        describe('SF-356947 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet(
                    { sheets: [{ rows: [{ index: 3, height: 30, customHeight: true, cells: [{ index: 3, value: 'test' }] }],
                    selectedRange: 'D4' }] }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Selection issue while apply font size as 72pt for whole column with custom height enabled', (done: Function) => {
                const cell: HTMLElement = helper.invoke('getCell', [3, 3]);
                expect(cell.style.lineHeight).toBe('');
                helper.getElement('#' + helper.id + '_font_size').click();
                helper.getElement('#' + helper.id + '_font_size-popup').firstElementChild.lastElementChild.click();
                expect(cell.style.fontSize).toBe('72pt');
                expect(cell.style.lineHeight).toBe('29px');
                expect(helper.invoke('getRow', [3]).style.height).toBe('30px');
                helper.getElement('#' + helper.id + '_font_size').click();
                helper.getElement('#' + helper.id + '_font_size-popup').firstElementChild.children[5].click();
                expect(cell.style.fontSize).toBe('14pt');
                expect(cell.style.lineHeight).toBe('');
                helper.getElement('#' + helper.id + '_font_size').click();
                helper.getElement('#' + helper.id + '_font_size-popup').firstElementChild.children[13].click();
                expect(cell.style.fontSize).toBe('36pt');
                expect(cell.style.lineHeight).toBe('29px');
                helper.getElement('#' + helper.id + '_wrap').click();
                expect(cell.style.lineHeight).toBe('');
                expect(cell.querySelector('.e-wrap-content')).not.toBeNull();
                done();
            });
        });
        describe('EJ2-57647 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Used range not updated while Clear entire data.', (done: Function) => {
                let spreadsheet: Spreadsheet = helper.getInstance();
                let sheet: SheetModel = spreadsheet.sheets[0];
                spreadsheet.clear({type: 'Clear All', range: getRangeAddress([0, 0, sheet.usedRange.rowIndex, sheet.usedRange.colIndex])});
                setTimeout(() => {
                    expect(sheet.usedRange.rowIndex).toEqual(0);
                    expect(sheet.usedRange.colIndex).toEqual(0);
                    done();
                });
            });
            it('Used range not updated while delete entire data.', (done: Function) => {
                let spreadsheet: Spreadsheet = helper.getInstance();
                let sheet: SheetModel = spreadsheet.sheets[0];
                spreadsheet.selectRange(getRangeAddress([0, 0, sheet.usedRange.rowIndex, sheet.usedRange.colIndex]));
                helper.triggerKeyNativeEvent(46);
                setTimeout(() => {
                    expect(sheet.usedRange.rowIndex).toEqual(0);
                    expect(sheet.usedRange.colIndex).toEqual(0);
                    done();
                });
            });
        });
    });
});