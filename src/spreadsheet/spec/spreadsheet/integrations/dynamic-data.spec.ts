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
                // expect(spreadsheet.getCell(0, 0).innerText).toBe('Item Name'); check this now
                expect(spreadsheet.getCell(9, 8).innerText).toBe('');
                expect(spreadsheet.getCell(10, 7).innerText).toBe('55');
                expect(spreadsheet.sheets[0].rows[9].cells[5].value.toString()).toBe('1210');
                done();
            });
        });
    });

    it('Checking dataChangeEventArgs', (done: Function) => {
        dataChangeArgs = undefined;
        const spreadsheet: any = helper.getInstance();
        helper.edit('A12', 'Shirts');
        expect(dataChangeArgs).toBeUndefined();

        helper.edit('E8', '13');
        expect(dataChangeArgs.action).toBe('edit');
        expect(dataChangeArgs.data[0]['Price']).toBe(13);

        helper.click('#' + helper.id + '_undo');
        expect(dataChangeArgs.data[0]['Price']).toBe(10);

        helper.click('#' + helper.id + '_redo');
        expect(dataChangeArgs.data[0]['Price']).toBe(13);

        spreadsheet.workbookdeleteModule.deleteModel({ start: 6, end: 6, insertType: 'above', modelType: 'Row', name: 'deleteModel', isAction: true, model: spreadsheet.getActiveSheet() });
            expect(dataChangeArgs.action).toBe('delete');
            expect(dataChangeArgs.data[0]['Item Name']).toBe('Sneakers');

            helper.click('#' + helper.id + '_undo');
            expect(dataChangeArgs.action).toBe('add');
            expect(dataChangeArgs.data[0]['Item Name']).toBe('Sneakers');

            helper.click('#' + helper.id + '_redo');
            expect(dataChangeArgs.action).toBe('delete');
            expect(dataChangeArgs.data[0]['Item Name']).toBe('Sneakers');
            done();
    });

    it('Adding new range', (done: Function) => {
        let spreadsheet: Spreadsheet = helper.getInstance();
        let ranges: RangeModel[] = [].slice.call(spreadsheet.sheets[0].ranges);
        ranges.push({ dataSource: formulaData, startCell: 'O2' });
        spreadsheet.sheets[0].ranges = ranges;
        spreadsheet.dataBind();
        setTimeout(() => {
            expect(spreadsheet.getCell(1, 14).innerText).toBe('Platform');
            expect(spreadsheet.getCell(6, 18).innerText).toBe('12:18:31 PM');
            expect(spreadsheet.sheets[0].rows[6].cells[18].format).toBe('h:mm:ss AM/PM');
            expect(spreadsheet.sheets[0].rows[6].cells[18].value).toBe('0.51285879629629627');
            expect(spreadsheet.getCell(10, 0).innerText).toBe('Shirts');
            done();
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

            helper.click('#' + helper.id + '_undo');
            expect(dataChangeArgs.action).toBe('delete');
            expect(dataChangeArgs.data.length).toEqual(2);
            expect(dataChangeArgs.data[0]['Item Name']).toBeNull();

            helper.click('#' + helper.id + '_redo');
            expect(dataChangeArgs.action).toBe('add');
            expect(dataChangeArgs.data.length).toEqual(2);
            expect(dataChangeArgs.data[0]['Item Name']).toBeNull();
            done();
        });
    });

    it('Checking dataChangeEventArgs for paste', (done: Function) => {
        helper.invoke('copy', ['A16']).then(()=>{
            helper.invoke('paste', ['A12']);
            expect(dataChangeArgs.action).toBe('edit');
            expect(dataChangeArgs.data[0]['Item Name']).toBe('Shirts');

            helper.click('#' + helper.id + '_undo');
            expect(dataChangeArgs.data[0]['Item Name']).toBe('Loafers');

            helper.click('#' + helper.id + '_redo');
            setTimeout(() => {
                expect(dataChangeArgs.data[0]['Item Name']).toBe('Shirts');
                done();
            });
        });
    });

    it('Checking dataChangeEventArgs for cut', (done: Function) => {
        helper.invoke('selectRange', ['H6:H8']);
        helper.invoke('cut').then(()=>{
            helper.invoke('paste', ['J6']);
            expect(dataChangeArgs.action).toBe('edit');
            expect(dataChangeArgs.data[0]['Profit']).toBeNull();
            expect(dataChangeArgs.data[0]['Item Name']).toBe('Casual Shoes');
            expect(dataChangeArgs.data.length).toBe(3);
            expect(dataChangeArgs.data[1]['Profit']).toBeNull();

            helper.click('#' + helper.id + '_undo');
            expect(dataChangeArgs.action).toBe('edit');
            expect(dataChangeArgs.data[0]['Profit']).toBe(10);
            expect(dataChangeArgs.data[0]['Date']).toBe('2/14/2014');
            expect(dataChangeArgs.data[2]['Profit']).toBe(27);

            helper.click('#' + helper.id + '_redo');
            setTimeout(() => {
                expect(dataChangeArgs.action).toBe('edit');
                expect(dataChangeArgs.data[0]['Profit']).toBeNull();
                expect(dataChangeArgs.data[0]['Item Name']).toBe('Casual Shoes');
                done();
            });
        });
    });

    it('Checking dataChangeEventArgs for clear', (done: Function) => {
        helper.invoke('selectRange', ['G6:G8']);
        helper.getInstance().cellformatModule.clearObj({ options: { type: 'Clear All' }, isAction: true });
        expect(dataChangeArgs.action).toBe('edit');
        expect(dataChangeArgs.data[0]['Discount']).toBeNull();
        expect(dataChangeArgs.data[0]['Item Name']).toBe('Casual Shoes');
        expect(dataChangeArgs.data.length).toBe(3);
        expect(dataChangeArgs.data[1]['Discount']).toBeNull();

        helper.click('#' + helper.id + '_undo');
        expect(dataChangeArgs.action).toBe('edit');
        expect(dataChangeArgs.data[0]['Discount']).toBe(1);
        expect(dataChangeArgs.data[1]['Discount']).toBe(5);

        helper.click('#' + helper.id + '_redo');
        expect(dataChangeArgs.action).toBe('edit');
        expect(dataChangeArgs.data[2]['Discount']).toBeNull();
        expect(dataChangeArgs.data[2]['Item Name']).toBe('Formal Shoes');
        done();
    });
    it('Checking fieldsOrder property with data source', (done: Function) => {
        const spreadsheet: any = helper.getInstance();
        expect(spreadsheet.sheets[0].ranges[0].info.flds.length).toBe(8);
        const ranges: RangeModel[] = spreadsheet.sheets[0].ranges;
        ranges[0].fieldsOrder = ['1', '2', '11', '15'];
        spreadsheet.sheets[0].ranges = ranges;
        spreadsheet.dataBind();
        expect(spreadsheet.sheets[0].rows[1].cells[0]).toBeUndefined();
        expect(spreadsheet.sheets[0].rows[1].cells[3]).toBeUndefined();
        expect(spreadsheet.sheets[0].rows[5].cells[0]).toBeUndefined();
        expect(spreadsheet.sheets[0].rows[6].cells[3]).toBeUndefined();
        expect(spreadsheet.sheets[0].rows[8].cells[7]).toBeUndefined();
        setTimeout((): void => {
            expect(spreadsheet.sheets[0].ranges[0].info.flds.length).toBe(4);
            expect(spreadsheet.sheets[0].ranges[0].info.flds[1]).toBe('2');
            expect(spreadsheet.sheets[0].rows[1].cells[0].value).toBe('1');
            expect(spreadsheet.sheets[0].rows[1].cells[3].value).toBe('15');
            expect(spreadsheet.sheets[0].rows[5].cells[0].value).toBeUndefined();
            expect(spreadsheet.sheets[0].rows[6].cells[3].value).toBeUndefined();
            expect(spreadsheet.sheets[0].rows[8].cells[7]).toBeUndefined();
            done();
        });
    });
    it('Changing data source with respect to the fieldsOrder', (done: Function) => {
        const spreadsheet: any = helper.getInstance();
        const data: Object[] = [{ 'Customer Name': 'Julius Gorner', '1': 31, '2': 33, '11': '34', '2024': '35', '15': '38529.22', '2023': '13', '2022': '33' },
            { 'Customer Name': 'Jenna Schoolfield', '1': 32, '2': 33, '11': '34', '2024': '35', '15': '38529.22', '2023': '31', '2022': '33' },
            { 'Customer Name': 'Vilhelmina Leipelt', '1': 33, '2': 53, '11': '54', '2024': '55', '15': '58529.22', '2023': '15', '2022': '53' }];
        const ranges: RangeModel[] = spreadsheet.sheets[0].ranges;
        ranges[0].dataSource = data;
        spreadsheet.sheets[0].ranges = ranges;
        spreadsheet.dataBind();
        setTimeout((): void => {
            expect(spreadsheet.sheets[0].rows[1].cells[0].value).toBe('1');
            expect(spreadsheet.sheets[0].rows[1].cells[3].value).toBe('15');
            expect(spreadsheet.sheets[0].rows[5].cells[0]).toBeUndefined();
            expect(spreadsheet.sheets[0].rows[6].cells[3]).toBeUndefined();
            expect(spreadsheet.sheets[0].rows[2].cells[0].value).toBe(31);
            expect(spreadsheet.sheets[0].rows[2].cells[3].value).toBe('38529.22');
            expect(spreadsheet.sheets[0].rows[4].cells[0].value).toBe(33);
            expect(spreadsheet.sheets[0].rows[4].cells[3].value).toBe('58529.22');
            done();
        });
    });
    it('Changing fieldsOrder property with data source', (done: Function) => {
        const spreadsheet: any = helper.getInstance();
        const ranges: RangeModel[] = spreadsheet.sheets[0].ranges;
        ranges[0].fieldsOrder = ['Customer Name', '2024', '2023'];
        spreadsheet.sheets[0].ranges = ranges;
        spreadsheet.dataBind();
        expect(spreadsheet.sheets[0].rows[1].cells[0]).toBeUndefined();
        expect(spreadsheet.sheets[0].rows[1].cells[3]).toBeUndefined();
        expect(spreadsheet.sheets[0].rows[5].cells[0]).toBeUndefined();
        expect(spreadsheet.sheets[0].rows[6].cells[3]).toBeUndefined();
        expect(spreadsheet.sheets[0].rows[8].cells[7]).toBeUndefined();
        setTimeout((): void => {
            expect(spreadsheet.sheets[0].ranges[0].info.flds[0]).toBe('Customer Name');
            expect(spreadsheet.sheets[0].ranges[0].info.flds[1]).toBe('2024');
            expect(spreadsheet.sheets[0].rows[1].cells[0].value).toBe('Customer Name');
            expect(spreadsheet.sheets[0].rows[1].cells[2].value).toBe('2023');
            expect(spreadsheet.sheets[0].rows[1].cells[3]).toBeUndefined();
            expect(spreadsheet.sheets[0].rows[2].cells[0].value).toBe('Julius Gorner');
            expect(spreadsheet.sheets[0].rows[2].cells[3]).toBeUndefined();
            expect(spreadsheet.sheets[0].rows[2].cells[2].value).toBe('13');
            expect(spreadsheet.sheets[0].rows[4].cells[0].value).toBe('Vilhelmina Leipelt');
            expect(spreadsheet.sheets[0].rows[4].cells[2].value).toBe('15');
            done();
        });
    });
});
