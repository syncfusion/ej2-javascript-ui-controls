import { SpreadsheetHelper } from "../util/spreadsheethelper.spec";
import { defaultData } from '../util/datasource.spec';

describe('Resize ->', () => {
    const helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');

    describe('public method ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }], rows: [{ index: 4, height: 100 }, { height: 120 }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('AutoFit', (done: Function) => {
            helper.invoke('autoFit', ['A:B']); 
            expect(helper.getInstance().sheets[0].columns[0].width).toBe(137);
            expect(helper.getInstance().sheets[0].columns[1].width).toBe(72);
            expect(getComputedStyle(helper.invoke('getCell', [0,0])).width).toBe('137px');
            expect(getComputedStyle(helper.invoke('getCell', [0,1])).width).toBe('72px');

            helper.invoke('autoFit', ['5:6']);
            expect(helper.getInstance().sheets[0].rows[4].height).toBe(20);
            expect(helper.getInstance().sheets[0].rows[5].height).toBe(20);
            expect(getComputedStyle(helper.invoke('getCell', [4,0])).height).toBe('20px');
            expect(getComputedStyle(helper.invoke('getCell', [5,0])).height).toBe('20px');
            helper.getInstance().sheets[0].columns[0].width = 64; // resized column width persist for other test cases
            helper.getInstance().sheets[0].columns[1].width = 64;
            done();
        });
    });

    describe('UI Interaction ->', () => {
        
    });
});