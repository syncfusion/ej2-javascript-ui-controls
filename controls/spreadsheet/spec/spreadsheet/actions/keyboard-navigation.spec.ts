import { getRangeAddress } from "../../../src/index";
import { SpreadsheetHelper } from "../util/spreadsheethelper.spec";

describe('Spreadsheet cell navigation module ->', () => {
    let helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');

    describe('CR-Issues ->', () => {
        describe('F164825 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ allowScrolling: false }, done);
            });

            afterAll(() => {
                helper.invoke('destroy');
            });

            it('Cell navigation does not work without scrolling', (done: Function) => {
                helper.getElement().focus();
                helper.triggerKeyNativeEvent(39);
                expect(helper.getInstance().sheets[0].selectedRange).toBe('B1:B1');
                helper.triggerKeyNativeEvent(40);
                expect(helper.getInstance().sheets[0].selectedRange).toBe('B2:B2');
                helper.triggerKeyNativeEvent(37);
                expect(helper.getInstance().sheets[0].selectedRange).toBe('A2:A2');
                helper.triggerKeyNativeEvent(38);
                expect(helper.getInstance().sheets[0].selectedRange).toBe('A1:A1');
                done();
            });
        });

        describe('I348582, EJ2-60424 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ isProtected: true, protectSettings: { selectCells: true } }] }, done);
            });

            afterAll(() => {
                helper.invoke('destroy');
            });

            it('Shift selection on whole row makes scroll right even it is in viewport', (done: Function) => {
                helper.invoke('selectRange', [getRangeAddress([4, 0, 4, helper.getInstance().sheets[0].colCount - 1])]);
                helper.getElement().focus();
                helper.triggerKeyEvent('keydown', 40, null, false, true);
                expect(helper.getContentElement().parentElement.scrollLeft).toBe(0);
                done();
            });

            it('Pressing left/up key on 0th column/row throws script error on protected sheet', (done: Function) => {
                helper.invoke('selectRange', ['A1']);
                helper.triggerKeyEvent('keydown', 37);
                expect(helper.getInstance().sheets[0].selectedRange).toBe('A1:A1');
                helper.triggerKeyEvent('keydown', 38);
                expect(helper.getInstance().sheets[0].selectedRange).toBe('A1:A1');
                done();
            });
        });
        describe('SF-360092 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet(
                    { sheets: [{ rows: [{ cells: [{ index: 3, value: '20', validation: { ignoreBlank: true, inCellDropDown: true,
                        operator: 'Between', type: 'List', value1: '10,20,30', value2: '' } }] }], selectedRange: 'D1:D1' }] }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Cell navigation occurs while selecting cell template dropdown items', (done: Function) => {
                const cell: HTMLElement = helper.invoke('getCell', [0, 3]);
                expect(cell.firstElementChild.classList.contains('e-validation-list')).toBeTruthy();
                const ddl: HTMLElement = cell.getElementsByClassName('e-ddl')[0] as HTMLElement;
                ddl.focus();
                helper.getInstance('#' + helper.id + 'listValid').showPopup();
                expect(helper.getInstance().sheets[0].selectedRange).toBe('D1:D1');
                helper.triggerKeyEvent('keydown', 40, null, false, true, ddl);
                expect(helper.getInstance().sheets[0].selectedRange).toBe('D1:D1');
                helper.getElement('#' + helper.id + 'listValid_popup .e-list-item').click();
                expect(document.activeElement.classList.contains('e-spreadsheet')).toBeTruthy();
                done();
            });
        });

        describe('EJ2-59225 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ rowCount: 3, colCount: 3, selectedRange: 'B2:C3' }], scrollSettings: { isFinite: true } }, done);
            });
            afterAll(() => {
                helper.invoke('destroy');
            });
            it('The spreadsheet selection moves away from the spreadsheet table when we move it with the keyboard', (done: Function) => {
                const selectionEle: HTMLElement = helper.getElement('#' + helper.id + ' .e-selection');
                const autofillEle: HTMLElement = helper.getElement('#' + helper.id + ' .e-autofill');
                const table: HTMLElement = helper.invoke('getContentTable');
                const height: number = table.offsetHeight; const width: number = table.offsetWidth;
                const instance: any = helper.getInstance();
                const checkFn: Function = (): void => {
                    expect(instance.sheets[0].selectedRange).toBe('B2:C3');
                    expect(parseInt(selectionEle.style.height, 10)).toBeLessThan(height);
                    expect(parseInt(autofillEle.style.top, 10)).toBeLessThan(height);
                    expect(parseInt(selectionEle.style.width, 10)).toBeLessThan(width);
                    expect(parseInt(autofillEle.style.left, 10)).toBeLessThan(width);
                };
                checkFn()
                instance.element.focus();
                helper.triggerKeyEvent('keydown', 39, null, false, true);
                setTimeout(() => {
                    checkFn();
                    helper.triggerKeyEvent('keydown', 40, null, false, true);
                    setTimeout(() => {
                        checkFn();
                        done();
                    });
                });
            });
        });
        describe('EJ2-59905 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet(
                    { sheets: [{ rowCount: 10, colCount: 26, selectedRange: 'A10:A10', rows: [{ index: 4, hidden: true }, { index: 5, hidden: true }, { index: 6, hidden: true }] }], height: 300, scrollSettings: { isFinite: true }} , done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Keyboard selection issue in finite mode', (done: Function) => {
                const instance: any = helper.getInstance();
                instance.element.focus();
                helper.triggerKeyEvent('keydown', 39, null, false, false);
                setTimeout(() => {
                    expect(instance.sheets[0].selectedRange).toBe('B10:B10');
                    done();
                });
            });
        });
    });
    describe('EJ2-60990 ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ showHeaders: false ,rowCount: 5 , selectedRange: 'C4:C4'}], scrollSettings: { isFinite: true } }, done);
        });

        afterAll(() => {
            helper.invoke('destroy');
        });

        it('When showheader is false and in finite mode, Keyboard navigation is not working - bottom', (done: Function) => {
            helper.getElement().focus();
            helper.triggerKeyNativeEvent(40);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('C5:C5');
                done();
            });
        });
        it('When showheader is false and in finite mode, Keyboard navigation is not working - right', (done: Function) => {
            helper.triggerKeyNativeEvent(38);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].selectedRange).toBe('C4:C4');
                done();
            }, 50);
        });
    });
});
