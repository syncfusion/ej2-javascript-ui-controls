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
                helper.triggerKeyEvent('keydown', 39);
                expect(helper.getInstance().sheets[0].selectedRange).toBe('B1:B1');
                helper.triggerKeyEvent('keydown', 40);
                expect(helper.getInstance().sheets[0].selectedRange).toBe('B2:B2');
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
    });
});