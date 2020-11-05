import { SpreadsheetModel, Spreadsheet } from '../../../src/spreadsheet/index';
import { SpreadsheetHelper } from "../util/spreadsheethelper.spec";
import { defaultData, filterData, formulaData } from '../util/datasource.spec';
import { RangeModel, DataSourceChangedEventArgs } from '../../../src';

describe('Dynamic data binding - ', () => {
    let helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');
    let model: SpreadsheetModel;
    let dataChangeArgs: DataSourceChangedEventArgs;

    beforeAll((done: Function) => {
        model = {
            sheets: [
                {
                    ranges: [{ dataSource: filterData }]
                }
            ],
            dataSourceChanged: (args: DataSourceChangedEventArgs) => {
                dataChangeArgs = args;
            }
        };
        helper.initializeSpreadsheet(model, done);
    });

    afterAll(() => {
        helper.invoke('destroy');
    });

    it('Changing range datasource', (done: Function) => {
        let spreadsheet: Spreadsheet = helper.getInstance();
        spreadsheet.sheets[0].ranges[0].dataSource = defaultData;
        setTimeout(() => {
            setTimeout(() => {
                expect(spreadsheet.getCell(0, 0).innerText).toBe('Item Name');
                expect(spreadsheet.getCell(9, 8).innerText).toBe('');
                expect(spreadsheet.getCell(10, 7).innerText).toBe('55');
                expect(spreadsheet.sheets[0].rows[9].cells[5].value.toString()).toBe('1210');
                done();
            });
        });
    });

    it('Checking dataChangeEventArgs', (done: Function) => {
        helper.edit('A12', 'Shirts');
        expect(dataChangeArgs).toBeUndefined();

        helper.edit('E8', '13');
        expect(dataChangeArgs.action).toBe('edit');
        expect(dataChangeArgs.data[0]['Price']).toBe('13');

        helper.getInstance().delete(6, 6, 'Row');
        expect(dataChangeArgs.action).toBe('delete');
        expect(dataChangeArgs.data[0]['Item Name']).toBe('Sneakers');
        done();
    });

    it('Adding new range', (done: Function) => {
        let spreadsheet: Spreadsheet = helper.getInstance();
        let ranges: RangeModel[] = [].slice.call(spreadsheet.sheets[0].ranges);
        ranges.push({ dataSource: formulaData, startCell: 'O2' });
        spreadsheet.sheets[0].ranges = ranges;
        setTimeout(() => {
            setTimeout(() => {
                expect(spreadsheet.getCell(1, 14).innerText).toBe('Platform');
                expect(spreadsheet.getCell(6, 18).innerText).toBe('0.512859');
                // checking new row added in another range
                expect(spreadsheet.getCell(10, 0).innerText).toBe('Shirts');
                done();
            });
        });
    });

    it('Checking dataChangeEventArgs for Insert row', (done: Function) => {
        let spreadsheet: any = helper.getInstance();
        spreadsheet.workbookinsertModule.insertModel({ start: 10, end: 10, insertType: 'below', modelType: 'Row', name: 'insertModel', isAction: true, model: spreadsheet.getActiveSheet() });
        expect(dataChangeArgs.action).toBe('add');
        expect(dataChangeArgs.data[0]['Price']).toBeNull();
        helper.edit('A10', 'Jersy');
        expect(dataChangeArgs.action).toBe('edit');
        expect(dataChangeArgs.data[0]['Item Name']).toBe('Jersy');

        dataChangeArgs = null;
        spreadsheet.workbookinsertModule.insertModel({ start: 0, end: 0, insertType: 'above', modelType: 'Row', name: 'insertModel', isAction: true, model: spreadsheet.getActiveSheet() });

        setTimeout(() => {
            expect(dataChangeArgs).toBeNull();
            expect(spreadsheet.sheets[0].ranges[0].startCell).toEqual('A2');
            spreadsheet.workbookinsertModule.insertModel({ start: 2, end: 2, insertType: 'below', modelType: 'Row', name: 'insertModel', isAction: true, model: spreadsheet.getActiveSheet() });
            expect(dataChangeArgs.action).toBe('add');
            spreadsheet.workbookinsertModule.insertModel({ start: 2, end: 3, insertType: 'below', modelType: 'Row', name: 'insertModel', isAction: true, model: spreadsheet.getActiveSheet() });
            expect(dataChangeArgs.data.length).toEqual(2);
            done();
        });
    });
});