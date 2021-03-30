import { SpreadsheetHelper } from "../util/spreadsheethelper.spec";
import { defaultData } from '../util/datasource.spec';

describe('Insert & Delete ->', () => {
    let helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');

    describe('public method ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Insert', (done: Function) => {
            helper.invoke('insertRow', [2, 3]);
            expect(helper.getInstance().sheets[0].rows[2]).toEqual({});
            expect(helper.getInstance().sheets[0].rows[3]).toEqual({});
            setTimeout(() => {
                expect(helper.invoke('getCell', [2, 0]).textContent).toBe('');
                expect(helper.invoke('getCell', [4, 0]).textContent).toBe('Sports Shoes');

                helper.invoke('insertColumn', [3, 4]);
                setTimeout(() => {
                    expect(helper.getInstance().sheets[0].rows[0].cells[3]).toBeNull();
                    expect(helper.getInstance().sheets[0].rows[1].cells[3]).toBeNull();
                    expect(helper.getInstance().sheets[0].rows[0].cells[5].value).toEqual('Quantity');
                    expect(helper.invoke('getCell', [0, 3]).textContent).toBe('');
                    expect(helper.invoke('getCell', [0, 5]).textContent).toBe('Quantity');

                    helper.invoke('insertSheet', [1, 2]);
                    setTimeout(() => {
                        expect(helper.getInstance().sheets[1].name).toBe('Sheet2');
                        expect(helper.getInstance().sheets[2].name).toBe('Sheet3');
                        expect(helper.getElementFromSpreadsheet('.e-sheet-tab').getElementsByClassName('e-toolbar-item').length).toBe(3);
                        done();
                    });
                });
            });
        });

        it('Delete', (done: Function) => {
            helper.invoke('delete', [6, 6, 'Row']);
            setTimeout(() => {
                expect(helper.getInstance().sheets[0].rows[6].cells[0].value).toBe('Flip- Flops & Slippers');
                expect(helper.invoke('getCell', [6, 0]).textContent).toBe('Flip- Flops & Slippers');

                helper.invoke('delete', [6, 7, 'Column']);
                setTimeout(() => {
                    expect(helper.getInstance().sheets[0].rows[0].cells[6].value).toBe('Discount');
                    expect(helper.invoke('getCell', [0, 6]).textContent).toBe('Discount');

                    helper.invoke('delete', [1, 1, 'Sheet']);
                    setTimeout(() => {
                        expect(helper.getInstance().sheets[1].name).toBe('Sheet3');
                        expect(helper.getInstance().sheets[2]).toBeUndefined();
                        expect(helper.getElementFromSpreadsheet('.e-sheet-tab').getElementsByClassName('e-toolbar-item').length).toBe(2);
                        done();
                    });
                });
            });
        });
    });

    describe('UI Interaction ->', () => {

    });

});