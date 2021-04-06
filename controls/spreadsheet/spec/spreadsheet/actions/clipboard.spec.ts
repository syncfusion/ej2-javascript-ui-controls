import { Spreadsheet, SpreadsheetModel } from '../../../src/spreadsheet/index';
import { SpreadsheetHelper } from '../util/spreadsheethelper.spec';
import { defaultData } from '../util/datasource.spec';

/**
 *  Clipboard test cases
 */
describe('Clipboard ->', () => {
    let helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');
    let model: SpreadsheetModel;
    describe('CR-Issues ->', () => {
        describe('F163240 ->', () => {
            beforeEach((done: Function) => {
                model = {
                    sheets: [{ ranges: [{ dataSource: defaultData }] }],
                    created: (): void => {
                        helper.getInstance().cellFormat({ fontWeight: 'bold', textAlign: 'center' }, 'A1:H1');
                    }
                };
                helper.initializeSpreadsheet(model, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Paste behaviour erroneous after cut', (done: Function) => {
                helper.invoke('selectRange', ['A1:D5']);
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].rows[0].cells[0].value).toEqual('Item Name');
                expect(spreadsheet.sheets[0].rows[4].cells[3].value.toString()).toEqual('15');
                expect(spreadsheet.sheets[0].rows[3].cells[0].value).toEqual('Formal Shoes');
                expect(spreadsheet.sheets[0].rows[2].cells[2].value).toEqual('0.2475925925925926');
                setTimeout((): void => {
                    helper.invoke('cut').then((): void => {
                        helper.invoke('selectRange', ['A2']);
                        setTimeout((): void => {
                            helper.invoke('paste', ['Sheet1!A2:A2']);
                            setTimeout((): void => {
                                expect(spreadsheet.sheets[0].rows[0].cells[0]).toBeNull();
                                expect(helper.invoke('getCell', [0, 0]).textContent).toEqual('');
                                expect(spreadsheet.sheets[0].rows[4].cells[3].value.toString()).toEqual('20');
                                expect(helper.invoke('getCell', [4, 3]).textContent).toEqual('20');
                                expect(spreadsheet.sheets[0].rows[3].cells[0].value).toEqual('Sports Shoes');
                                expect(helper.invoke('getCell', [3, 0]).textContent).toEqual('Sports Shoes');
                                expect(spreadsheet.sheets[0].rows[2].cells[2].value.toString()).toEqual('0.4823148148148148');
                                done();
                            });
                        });
                    });
                });
            });
        });
        describe('F162960 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({
                    sheets: [{ rows: [{ cells: [{ value: '100' }, { value: '25' }, { value: '1001' }] }, { cells: [{ value: '100' },
                    { value: '25' }, { value: '1001' }] }], selectedRange: 'A1:B2' }],
                    created: (): void => helper.getInstance().setRowHeight(45)
                }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Row height not persistent after cut/paste', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].rows[0].height).toEqual(45);
                expect(spreadsheet.sheets[0].rows[3]).toBeUndefined();
                helper.invoke('cut').then((): void => {
                    helper.invoke('selectRange', ['A4']);
                    setTimeout((): void => {
                        helper.invoke('paste', ['Sheet1!A4:A4']);
                        setTimeout((): void => {
                            expect(spreadsheet.sheets[0].rows[0].height).toEqual(45);
                            expect(helper.invoke('getRow', [0, 0]).style.height).toEqual('45px');
                            expect(spreadsheet.sheets[0].rows[3].cells[0].value.toString()).toEqual('100');
                            done();
                        });
                    });
                });
            });
        });
    });
});