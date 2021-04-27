import { SpreadsheetHelper } from "../util/spreadsheethelper.spec";
import { defaultData } from '../util/datasource.spec';
import { Spreadsheet } from '../../../src/index';

describe('Wrap ->', () => {
    let helper: SpreadsheetHelper = new SpreadsheetHelper('spreadsheet');

    describe('public method ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });
        it('', (done: Function) => {
            helper.getInstance().wrap('C2');
            let td: Element = helper.invoke('getCell', [1, 2]);
            expect(td.classList).toContain('e-wraptext');
            // expect(td.parentElement.style.height).toBe('38px'); check this now
            helper.edit('C2', '12 23 34 45 56 67 78'); // After Editing
            // expect(td.parentElement.style.height).toBe('56px'); check this now
            helper.invoke('cellFormat', [{ fontSize: '22pt' }, 'C2']); // After increasing font size
            // expect(td.parentElement.style.height).toBe('254px'); check this now
            helper.invoke('cellFormat', [{ fontFamily: 'Arial Black' }, 'C2']); // After changing font family
            // expect(td.parentElement.style.height).toBe('295px'); check this now
            helper.edit('C2', '12 23 3'); // After Editing by decreasing font length
            // expect(td.parentElement.style.height).toBe('128px'); - This case failed only in jenkin CI machine
            helper.invoke('cellFormat', [{ fontSize: '11pt' }, 'C2']); // After decreasing font size
            // expect(td.parentElement.style.height).toBe('22px'); - This case need to be fixed
            done();
        });
    });


    describe('UI Interaction ->', () => {
        beforeAll((done: Function) => {
            helper.initializeSpreadsheet({ sheets: [{ ranges: [{ dataSource: defaultData }] }] }, done);
        });
        afterAll(() => {
            helper.invoke('destroy');
        });

        it('', (done: Function) => {
            helper.invoke('selectRange', ['A4']);
            helper.click('#spreadsheet_wrap');
            let td: Element = helper.invoke('getCell', [3, 0]);
            expect(td.classList).toContain('e-wraptext');
            expect(td.parentElement.style.height).toBe('38px');
            done();
        });

        // it('Alt Enter', (done: Function) => { Need to handle this case
        //     helper.invoke('selectRange', ['D5']);
        //     helper.edit('D5', 'abcdefgh\nijkl\nmnopqrs');
        //     let td: Element = helper.invoke('getCell', [4, 3]);
        //     expect(td.classList).toContain('e-wraptext');
        //     expect(td.parentElement.style.height).toBe('56px');
        //     done();
        // });
    });
    describe('CR-Issues ->', () => {
        describe('I316931, I31444 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ rows: [{ cells: [{ wrap: true }] }] }] }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('UpdateCell method is not working in wrap cell after calling setRowHeight', (done: Function) => {
                helper.invoke('setRowHeight', [55]);
                const spreadsheet: Spreadsheet = helper.getInstance();
                expect(spreadsheet.sheets[0].rows[0].height).toBe(55);
                expect(spreadsheet.sheets[0].rows[0].cells[0].value).toBeUndefined();
                expect( helper.invoke('getRow', [0]).style.height).toBe('55px');
                helper.invoke('updateCell', [{ value: 'Welcome to Spreadsheet!!!' }]);
                expect(spreadsheet.sheets[0].rows[0].cells[0].value).toBe('Welcome to Spreadsheet!!!');
                expect(spreadsheet.sheets[0].rows[0].height).toBe(55);
                expect(helper.invoke('getRow', [0]).style.height).toBe('55px');
                done();
            });
        });
        describe('fb23856 ->', () => {
            beforeEach((done: Function) => {
                helper.initializeSpreadsheet({ sheets: [{ selectedRange: 'A1:B2' }] }, done);
            });
            afterEach(() => {
                helper.invoke('destroy');
            });
            it('Size of cell is increased for merge - top left allignment', (done: Function) => {
                const spreadsheet: Spreadsheet = helper.getInstance();
                helper.getElement('#' + helper.id + '_merge').click();
                helper.getElement('#' + helper.id + '_wrap').click();
                expect(spreadsheet.sheets[0].rows[0].height).toBeUndefined();
                helper.invoke('startEdit');
                (spreadsheet as any).editModule.editCellData.value = 'text\ntext';
                helper.getElement('#' + helper.id + '_edit').textContent = 'text\ntext';
                helper.triggerKeyNativeEvent(13);
                expect(spreadsheet.sheets[0].rows[0].height).toBeUndefined();
                helper.invoke('selectRange', ['A1:B2']);
                helper.invoke('startEdit');
                (spreadsheet as any).editModule.editCellData.value = 'text\n\ntext';
                helper.getElement('#' + helper.id + '_edit').textContent = 'text\n\ntext';
                helper.triggerKeyNativeEvent(13);
                expect(spreadsheet.sheets[0].rows[0].height).toBe(36);
                expect(spreadsheet.sheets[0].rows[1].height).toBeUndefined();
                done();
            });
        });
    });
});