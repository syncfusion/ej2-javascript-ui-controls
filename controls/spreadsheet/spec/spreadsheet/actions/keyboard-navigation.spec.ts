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

        describe('I348582 ->', () => {
            beforeAll((done: Function) => {
                helper.initializeSpreadsheet({}, done);
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
                (cell.getElementsByClassName('e-ddl')[0] as HTMLElement).focus();
                helper.getInstance('#' + helper.id + 'listValid').showPopup();
                expect(helper.getInstance().sheets[0].selectedRange).toBe('D1:D1');
                helper.triggerKeyEvent('keydown', 40, null, false, true);
                expect(helper.getInstance().sheets[0].selectedRange).toBe('D1:D1');
                helper.getElement('#' + helper.id + 'listValid_popup .e-list-item').click();
                expect(document.activeElement.classList.contains('e-spreadsheet')).toBeTruthy();
                done();
            });
        });
    });
});