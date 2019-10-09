import { SpreadsheetModel } from '../../../src/spreadsheet/index';
import { SpreadsheetHelper } from "../util/spreadsheethelper.spec";
import { defaultData } from '../util/datasource.spec';
import { CellModel } from '../../../src';

/**
 *  Keyboard shortcuts spec
 */

describe('Spreadsheet edit module ->', () => {
    let helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');
    let model: SpreadsheetModel;
    describe('Checking updated edited value ->', () => {
        beforeAll((done: Function) => {
            model = {
                sheets: [{
                    rangeSettings: [{ dataSource: defaultData }],
                    rows: [{
                        index: 1,
                        cells: [
                            { index: 9, formula: '=D2' },
                            { index: 11, formula: '=J2' },
                            { index: 13, formula: '=L2' },
                            { index: 15, formula: '=N2' },
                        ]
                    }]
                }]
            };
            helper.initializeSpreadsheet(model, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('Check multiple cell dependency', (done: Function) => {
            setTimeout(() => {
                helper.invoke('getData', ['Sheet1!A1:Q11']).then((values: Map<string, CellModel>) => {
                    expect(values.get('D2').value.toString()).toEqual('10');
                    expect(values.get('J2').value.toString()).toEqual('10');
                    expect(values.get('L2').value.toString()).toEqual('10');
                    expect(values.get('N2').value.toString()).toEqual('10');
                    done();
                });
            }, 20);
        });
    });
});