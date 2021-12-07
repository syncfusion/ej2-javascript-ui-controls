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
    });
});